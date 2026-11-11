/* Time change applies only to the November 14 Xinzhuang session. */
(function () {
  const slug = 'xinzhuang-faith-20261114';
  const page = location.pathname.split('/').pop();
  const isEventPage = page === 'activity-detail.html' || page === 'activity-register.html';
  if (isEventPage && new URLSearchParams(location.search).get('event') !== slug) return;
  if (Date.now() >= Date.parse('2026-11-14T11:30:00+08:00')) return;
  const header = document.querySelector('header');
  if (!header) return;
  const notice = document.createElement('aside');
  notice.id = 'ntXinzhuangTimeNotice';
  notice.setAttribute('aria-label', '新莊信仰小旅行活動時間異動');
  notice.style.cssText = 'background:#fff3d9;border-bottom:2px solid #a97924;color:#294a50;padding:18px 24px;font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;line-height:1.8';
  notice.innerHTML = '<div style="max-width:1180px;margin:auto"><strong style="display:block;font-size:18px;color:#754d10">重要通知｜新莊信仰小旅行提前30分鐘舉行</strong><p style="margin:6px 0">2026年11月14日（六）原訂10:00–12:00，<strong>調整為09:30–11:30</strong>。集合地點：捷運頭前庄站1號出口外，請於09:30前抵達。造成不便，敬請見諒，感謝您的體諒與配合。</p><p style="margin:6px 0">如因時間調整而無法參加，歡迎透過 <a href="https://lin.ee/nLqg231G" target="_blank" rel="noopener noreferrer" style="color:#17677a;text-decoration:underline">美遊記 LINE 官方帳號</a>與我們聯繫。</p>' + (isEventPage ? '' : '<a href="activity-detail.html?event=' + slug + '" style="color:#17677a;text-decoration:underline;font-weight:bold">查看活動詳情 →</a>') + '</div>';
  header.insertAdjacentElement('afterend', notice);
})();
