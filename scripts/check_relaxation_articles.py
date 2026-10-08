#!/usr/bin/env python3
"""Static QA for NICE TRIP relaxation articles. Run: python3 scripts/check_relaxation_articles.py"""
from html.parser import HTMLParser
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parent.parent
SLUGS = [
    "kou-tian-zhong", "yan-jin", "ming-tian-gu", "cuo-er-che-er",
    "zhi-shu", "yun-yan", "mian-yu", "tu-na", "liu-zi-qi-jue",
    "mo-fu", "dun-zhong", "zhuan-di-gu",
]
PAGES = [f"body-relaxation-{slug}.html" for slug in SLUGS]

class Inspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = []
        self.images = []
        self.headings = 0
        self.lang = None
        self.has_viewport = False
        self.has_description = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "img":
            self.images.append(attrs)
        if tag == "h2":
            self.headings += 1
        if tag == "meta" and attrs.get("name") == "viewport":
            self.has_viewport = True
        if tag == "meta" and attrs.get("name") == "description":
            self.has_description = True

errors = []
overview = ROOT / "body-relaxation.html"
if not overview.is_file():
    errors.append("Missing overview body-relaxation.html")
else:
    source = overview.read_text(encoding="utf-8")
    for p in PAGES:
        if f'href="{p}"' not in source:
            errors.append(f"Overview missing link to {p}")

for i, p in enumerate(PAGES):
    path = ROOT / p
    if not path.is_file():
        errors.append(f"Missing article {p}")
        continue
    html = path.read_text(encoding="utf-8")
    ins = Inspector()
    ins.feed(html)
    if ins.lang != "zh-Hant":
        errors.append(f"{p}: lang must be zh-Hant")
    if not ins.has_viewport:
        errors.append(f"{p}: missing viewport")
    # Original manuscripts may have no subheadings; do not invent headings to satisfy QA.
    if "<article" not in html or "</article>" not in html:
        errors.append(f"{p}: article element missing")
    if len(ins.ids) != len(set(ins.ids)):
        errors.append(f"{p}: duplicate IDs")
    if "@media(max-width:" not in html or "focus-visible" not in html:
        errors.append(f"{p}: mobile accessibility styles missing")
    if 'href="body-relaxation.html#daily-practices"' not in html:
        errors.append(f"{p}: return-to-overview missing")
    if i > 0 and f'href="{PAGES[i-1]}"' not in html:
        errors.append(f"{p}: wrong previous link")
    if i < len(PAGES)-1 and f'href="{PAGES[i+1]}"' not in html:
        errors.append(f"{p}: wrong next link")
    if i == 0 and 'rel="prev"' in html:
        errors.append(f"{p}: first page should not have previous")
    if i == len(PAGES)-1 and 'rel="next"' in html:
        errors.append(f"{p}: last page should not have next")
    for img in ins.images:
        src = img.get("src", "")
        if not img.get("alt"):
            errors.append(f"{p}: image missing alt text")
        if src and not src.startswith(("http://", "https://", "data:")):
            if not (ROOT / src.split("?")[0]).is_file():
                errors.append(f"{p}: missing image file {src}")
    for href in ins.links:
        if href.startswith("#") and href[1:] not in ins.ids:
            errors.append(f"{p}: broken in-page anchor {href}")

# The normal test-branch check verifies structure. Release checks additionally
# block publication until all twelve approved visuals are present and embedded.
if "--release" in sys.argv:
    manifest_path = ROOT / "data/body-relaxation-images.json"
    if not manifest_path.is_file():
        errors.append("Release gate: approved-image manifest missing")
    else:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        records = manifest.get("articles", [])
        if len(records) != len(PAGES):
            errors.append("Release gate: expected exactly 12 approved-image records")
        for item in records:
            page = item.get("page", "")
            img = item.get("approved_image_path", "")
            if page not in PAGES:
                errors.append(f"Release gate: unexpected page {page}")
                continue
            if not item.get("asset_verified") or not item.get("embedded"):
                errors.append(f"Release gate: image approval/embedding incomplete for {page}")
            if not img or not (ROOT / img).is_file():
                errors.append(f"Release gate: approved image missing for {page}: {img}")
            elif f'src="{img}"' not in (ROOT / page).read_text(encoding="utf-8"):
                errors.append(f"Release gate: article does not reference approved image {page}")

if errors:
    print("FAIL: " + str(len(errors)) + " problem(s)")
    for error in errors:
        print(" - " + error)
    sys.exit(1)
print("PASS: overview + 12 articles, navigation, metadata, local images, anchors and accessibility structure")
print("NOTE: This does not replace visual browser/mobile QA or confirm approved hero images.")
