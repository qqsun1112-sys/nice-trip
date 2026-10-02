/* NICE TRIP content registry
   日後新增／替換活動與文章，優先修改本檔資料，不必重做頁面。
   活動 service: city | temple | meditation | relaxation
   status: open | full | ended | upcoming | cancelled | postponed
*/
window.NICE_TRIP_CONTENT = {
  settings: {
    registrationPrimary: "official",
    officialPayment: "bank-transfer",
    externalActivityInfoProvider: "ACCUPASS",
    archiveEndedActivities: true,
    homepageActivityLimit: 3,
    homepageArticleLimit: 3,
    articleListingBatchSize: 24,
    launchMinimumActivities: 18,
    launchMinimumArticles: 19
  },
  activityServices: {
    city: { name: "城市故事行旅", subtitle: "文化教育", label: "探索" },
    temple: { name: "廟語心聲", subtitle: "信仰文化", label: "閱讀" },
    meditation: { name: "百八鐘靜心運動", subtitle: "心理健康", label: "安定" },
    relaxation: { name: "身心放鬆術", subtitle: "健康促進", label: "練習" }
  },
  activities: [
    {
      id: "body-relaxation-accupass-260720",
      service: "meditation",
      title: "百八鐘靜心運動｜實體活動",
      summary: "百八鐘靜心運動實體體驗活動，開放報名中。",
      status: "upcoming",
      visuals: { home: "assets/images/百八鐘靜心運動.png", listing: "assets/images/百八鐘靜心運動.png", detail: "assets/images/百八鐘靜心運動.png", social: "" },
      registrationDeadline: "",
      imageAlt: "百八鐘靜心運動實體活動主視覺",
      officialUrl: "activity-register.html?event=body-relaxation-accupass-260720",
      payment: "free"
    },
    {
      id: "meditation-108-accupass-260814",
      service: "relaxation",
      title: "身心放鬆術｜實體活動",
      summary: "身心放鬆術實體體驗活動，開放報名中。",
      status: "upcoming",
      visuals: { home: "assets/images/身心放鬆術.png", listing: "assets/images/身心放鬆術.png", detail: "assets/images/身心放鬆術.png", social: "" },
      registrationDeadline: "",
      imageAlt: "身心放鬆術實體活動主視覺",
      officialUrl: "activity-register.html?event=meditation-108-accupass-260814",
      payment: "free"
    },
    {
      id: "temple-songshan-20261026",
      service: "temple",
      title: "廟語心聲：松山霞海城隍廟",
      summary: "閱讀建築・閱讀文化・閱讀人生；用一小時，從建築與文化重新閱讀一座廟。",
      date: "2026-10-26",
      time: "15:00–16:00",
      status: "open",
      visuals: { home: "assets/images/廟語心聲.png", listing: "assets/images/廟語心聲.png", detail: "assets/images/廟語心聲.png", social: "" },
      registrationDeadline: "",
      imageAlt: "廟語心聲松山霞海城隍廟文化講座活動主視覺",
      officialUrl: "activity-register.html?event=temple-songshan-20261026",
      payment: "free"
    },
    {
      id: "xinzhuang-20261024",
      service: "city",
      title: "新莊小旅行",
      date: "2026-10-24",
      time: "10:00–12:00",
      status: "open",
      visuals: { home: "assets/images/新莊小旅行.png", listing: "assets/images/新莊小旅行.png", detail: "assets/images/activity-xinzhuang.jpg", social: "" },
      registrationDeadline: "",
      imageAlt: "新莊小旅行活動主視覺",
      officialUrl: "activity-register.html?event=xinzhuang-20261024",
      payment: "bank-transfer"
    },
    {
      id: "sheliao-20261031",
      service: "city",
      title: "社寮小旅行",
      summary: "一座小島，讀懂基隆數百年的海洋故事。",
      date: "2026-10-31",
      time: "10:00–12:00",
      status: "open",
      visuals: { home: "assets/images/社寮小旅行.png", listing: "assets/images/社寮小旅行.png", detail: "assets/images/activity-sheliao.jpg", social: "" },
      registrationDeadline: "",
      imageAlt: "社寮小旅行活動主視覺",
      officialUrl: "activity-register.html?event=sheliao-20261031",
      payment: "bank-transfer"
    },
    {
      id: "monga",
      service: "city",
      title: "艋舺小旅行",
      summary: "老城、信仰與街區故事。",
      date: "2026-11-07",
      time: "10:00–12:00",
      visuals: { home: "assets/images/艋舺小旅行.png", listing: "assets/images/艋舺小旅行.png", detail: "", social: "" },
      registrationDeadline: "",
      imageAlt: "艋舺小旅行活動主視覺",
      status: "open",
      officialUrl: "activity-register.html?event=monga",
      payment: "bank-transfer"
    },
    {
      id: "guandu-20261121",
      service: "city",
      title: "關渡小旅行",
      summary: "河岸、聚落與文化風景。",
      visuals: { home: "assets/images/關渡小旅行.png", listing: "assets/images/關渡小旅行.png", detail: "", social: "" },
      registrationDeadline: "",
      imageAlt: "關渡小旅行活動主視覺",
      date: "2026-11-21",
      time: "10:00–12:00",
      status: "open",
      officialUrl: "activity-register.html?event=guandu-20261121",
      payment: "bank-transfer"
    }
  ],
  articles: [
    {
      "slug": "songshan-trip-20260928",
      "category": "city",
      "publisher": "女子漾",
      "date": "2026-09-28",
      "image": "assets/images/LINE_ALBUM_2026.9.27 松山_261001_1.jpg",
      "imageAlt": "松山小旅行文章主視覺",
      "title": "松山小旅行｜沿著一條彎曲的河，走進錫口的繁華與日常",
      "excerpt": "從松山車站的光穹、慈祐宮到基隆河與饒河街，重新閱讀錫口的城市記憶。",
      "url": "https://woman.udn.com/woman/story/123162/9781612"
    },
    {
      "slug": "songshan-xiahai-20260921",
      "category": "faith",
      "publisher": "女子漾",
      "date": "2026-09-21",
      "image": "assets/images/旅行不一定要去遠方.jpg",
      "imageAlt": "松山霞海文化小旅行文章主視覺",
      "title": "旅行不一定要去遠方！走進松山霞海城隍廟，重新認識我們每天經過的城市",
      "excerpt": "從寺廟、建築、信仰與街道記憶重新閱讀熟悉的松山。",
      "url": "https://woman.udn.com/woman/story/123162/9767348"
    },
    {
      "slug": "songshan-xiahai-499-20260921",
      "category": "faith",
      "publisher": "台灣產經新聞網",
      "date": "2026-09-21",
      "image": "assets/images/旅行不一定要去遠方.jpg",
      "imageAlt": "松山霞海文化小旅行滿意度報導",
      "title": "寺廟變身城市教室｜「廟語心聲」獲中高齡參與者高度肯定",
      "excerpt": "松山霞海文化小旅行滿意度 4.99 分，文化走讀串起終身學習、地方認同與文化永續。",
      "url": "https://news.taiwannet.com.tw/news/220473/"
    },
    {
      "slug": "body-relaxation-zhonghe-senior-learning",
      "category": "wellness",
      "publisher": "台灣產經新聞網",
      "date": "2026-09-16",
      "image": "assets/images/身心放鬆術中和樂齡.jpg",
      "imageAlt": "身心放鬆術與樂齡健康促進報導",
      "title": "樂齡學習從「學習」走向「健康生活」｜身心放鬆術走進中和樂齡學習中心",
      "excerpt": "從呼吸、伸展與身體動作開始，把健康促進帶回每天的生活，也讓樂齡學習走向更完整的自我照顧。",
      "url": "https://news.taiwannet.com.tw/news/219916/"
    },
    {
      "slug": "confucius-wall",
      "category": "city",
      "publisher": "輕旅行",
      "date": "2026-09-02",
      "image": "assets/images/萬仞宮牆.jpg",
      "imageAlt": "臺北孔子廟萬仞宮牆",
      "title": "你以為只是一面牆，它卻裝下了兩千多年的文化",
      "excerpt": "從《論語》、孔德成到鴟吻、通天筒與團壽瓦當，讀懂萬仞宮牆。",
      "url": "https://travel.yam.com/article/140883"
    },
    {
      "slug": "kamikochi",
      "category": "travel",
      "publisher": "女子漾",
      "date": "2026-08-31",
      "image": "assets/images/article-kamikochi.jpg",
      "imageAlt": "日本上高地自然風景",
      "title": "走進上高地，才發現最美的不是風景",
      "excerpt": "從大正池到明神池，看見旅行如何與自然保持剛剛好的距離。",
      "url": "https://woman.udn.com/woman/story/123162/9724628"
    },
    {
      "slug": "kiyotsu",
      "category": "travel",
      "publisher": "輕旅行",
      "date": "2026-08-22",
      "image": "assets/images/article-kiyotsu.jpg",
      "imageAlt": "日本新潟清津峽",
      "title": "一條隧道，如何把峽谷變成藝術？",
      "excerpt": "走進750公尺的黑暗與光之間，重新學會觀看自然。",
      "url": "https://travel.yam.com/article/140763"
    },
    {
      "slug": "songshan-xiahai",
      "category": "faith",
      "publisher": "輕旅行",
      "date": "2026-08-20",
      "image": "assets/images/旅行不一定要去遠方.jpg",
      "imageAlt": "松山霞海城隍廟文章主視覺",
      "title": "旅行不一定要去遠方！走進松山霞海城隍廟",
      "excerpt": "從建築、匠藝與文化符號出發，重新學習如何看懂一座廟。",
      "url": "https://travel.yam.com/article/141045"
    },
    {
      "slug": "temple-voice-20260819",
      "category": "faith",
      "publisher": "台灣產經新聞網",
      "date": "2026-08-19",
      "image": "assets/images/當我們不再看懂廟宇.png",
      "imageAlt": "廟語心聲文化講座報導",
      "title": "當我們走進廟宇，還看得懂它在說什麼？",
      "excerpt": "松山霞海城隍廟《廟語心聲》從一小時文化講座，看見傳統文化重新被閱讀的可能。",
      "url": "https://news.taiwannet.com.tw/news/216093/"
    },
    {
      "slug": "temple-reading",
      "category": "faith",
      "publisher": "輕旅行",
      "date": "2026-08-11",
      "image": "assets/images/當我們不再看懂廟宇.png",
      "imageAlt": "臺灣廟宇文化文章主視覺",
      "title": "當我們不再看懂廟宇：臺灣傳統文化如何重新被閱讀？",
      "excerpt": "從匠師工藝、地方故事與人生智慧，重新理解廟宇的公共文化價值。",
      "url": "https://travel.yam.com/article/140664"
    },
    {
      "slug": "reading-city",
      "category": "city",
      "publisher": "女子漾",
      "date": "2026-08-04",
      "image": "assets/images/當旅行不再只是打卡jpg.jpg",
      "imageAlt": "閱讀城市文章主視覺",
      "title": "當旅行不再只是打卡，而是閱讀城市",
      "excerpt": "從79位城市讀者的回饋，看見文化走讀如何讓人重新理解一座城市。",
      "url": "https://woman.udn.com/woman/story/123162/9669005"
    },
    {
      "slug": "reading-city-peopo-20260804",
      "category": "city",
      "publisher": "公民新聞",
      "date": "2026-08-04",
      "image": "assets/images/當旅行不再只是打卡jpg.jpg",
      "imageAlt": "城市故事行旅社會影響力文章主視覺",
      "title": "當旅行不再只是打卡，而是閱讀城市─79位城市讀者帶給我們的啟發",
      "excerpt": "從79位參與者的回饋，看見文化走讀如何帶來文化理解與地方連結。",
      "url": "https://www.peopo.org/news/853900"
    },
    {
      "slug": "reading-city-taiwannet-20260803",
      "category": "city",
      "publisher": "台灣產經新聞網",
      "date": "2026-08-03",
      "image": "assets/images/當旅行不再只是打卡jpg.jpg",
      "imageAlt": "城市故事行旅社會影響力報導",
      "title": "當旅行不再只是打卡，而是閱讀城市──79位城市讀者帶給我們的啟發",
      "excerpt": "從城市故事行旅社會影響力報告，看見文化走讀如何連結地方、學習與永續。",
      "url": "https://news.taiwannet.com.tw/news/214170/"
    },
    {
      "slug": "temple-voice-brand-20260727",
      "category": "faith",
      "publisher": "台灣產經新聞網",
      "date": "2026-07-27",
      "image": "assets/images/當我們不再看懂廟宇.png",
      "imageAlt": "廟語心聲品牌發表報導",
      "title": "《廟語心聲》文化教育品牌正式發表",
      "excerpt": "以閱讀建築、閱讀文化、閱讀人生開啟臺灣文化閱讀新視角。",
      "url": "https://news.taiwannet.com.tw/news/213260/"
    },
    {
      "slug": "community-health-20260708",
      "category": "wellness",
      "publisher": "台灣產經新聞網",
      "date": "2026-07-08",
      "image": "assets/images/美遊記身心平衡之旅 (1).png",
      "imageAlt": "美遊記社區健康促進計畫報導",
      "title": "從社區開始打造健康臺灣｜美遊記發起《社區健康促進計畫》",
      "excerpt": "邀雙北里辦公處共同推動幸福社區，將健康促進帶回日常生活。",
      "url": "https://news.taiwannet.com.tw/news/211093/"
    },
    {
      "slug": "xinzhuang-reading-walk-20260524",
      "category": "city",
      "publisher": "台灣產經新聞網",
      "date": "2026-05-24",
      "image": "assets/images/新莊小旅行.png",
      "imageAlt": "新莊文化走讀活動成果報導",
      "title": "當閱讀走進老街巷弄｜《城市故事行旅》帶民眾重新認識新莊百年記憶",
      "excerpt": "2026年5月24日新莊文化走讀實際活動成果，從老街、廟宇與巷弄重新閱讀新莊百年城市記憶。",
      "url": "https://news.taiwannet.com.tw/news/206054/"
    },
    {
      "slug": "nice-trip-city-experience-20260430",
      "category": "city",
      "publisher": "台灣產經新聞網",
      "date": "2026-04-30",
      "image": "assets/images/城市故事行旅.jpg",
      "imageAlt": "美遊記城市文化與健康品牌報導",
      "title": "不是導覽，是一場讓人重新愛上土地的行動",
      "excerpt": "美遊記用走讀與呼吸重寫城市體驗，串聯文化、健康與永續旅行。",
      "url": "https://news.taiwannet.com.tw/news/203531/"
    },
    {
      "slug": "xikou-low-carbon-20260309",
      "category": "faith",
      "publisher": "女子漾",
      "date": "2026-03-09",
      "image": "assets/images/松山霞海城隍廟文章.jpg",
      "imageAlt": "松山霞海低碳小旅行文章主視覺",
      "title": "錫口信念永續轉型！低碳小旅行寫下「全滿分」標竿紀錄",
      "excerpt": "從松山霞海文化小旅行，看見信仰文化、低碳旅行與地方共好的實踐。",
      "url": "https://woman.udn.com/woman/story/123162/9369277"
    },
    {
      "slug": "chihlee-108-meditation-20260108",
      "category": "wellness",
      "publisher": "台灣產經新聞網",
      "date": "2026-01-08",
      "image": "assets/images/百八鐘靜心運動.png",
      "imageAlt": "致理科技大學百八鐘靜心運動活動成果報導",
      "title": "滿意度近滿分｜美遊記攜手致理科大「百八鐘靜心運動」",
      "excerpt": "百八鐘靜心運動走進致理科技大學，以實際參與回饋呈現高齡心理健康與身心安定的活動成果。",
      "url": "https://news.taiwannet.com.tw/news/192019/"
    }
  ]
};

window.NiceTripContent = {
  todayTaipei() {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const m = Object.fromEntries(parts.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
    return m.year + "-" + m.month + "-" + m.day;
  },
  visual(item, placement) {
    if (!item) return "";
    if (item.visuals) return item.visuals[placement] || "";
    return item.image || "";
  },
  activeActivities() {
    const today = this.todayTaipei();
    return window.NICE_TRIP_CONTENT.activities
      .filter(a => !["ended","cancelled"].includes(a.status) && (!a.date || a.date >= today))
      .sort((a,b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31"));
  },
  pastActivities() {
    const today = this.todayTaipei();
    return window.NICE_TRIP_CONTENT.activities
      .filter(a => a.status === "ended" || (a.date && a.date < today && !["cancelled","postponed"].includes(a.status)))
      .sort((a,b) => (b.date || "").localeCompare(a.date || ""));
  },
  activitiesByService(service) {
    return this.activeActivities().filter(a => a.service === service);
  },
  statusLabel(status) {
    return ({open:"開放報名",full:"已額滿",ended:"活動結束",upcoming:"即將公布",paused:"暫停報名",closed:"停止報名",cancelled:"活動取消",postponed:"活動延期"})[status] || status;
  },
  latestArticles(limit) {
    return [...window.NICE_TRIP_CONTENT.articles]
      .sort((a,b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, limit || window.NICE_TRIP_CONTENT.articles.length);
  }
};


/* Remote content sync: public read only. Static registry above remains the fallback. */
window.NiceTripContent.remote = {
  url: "https://eanxqqctblwfhtdrhwuk.supabase.co",
  key: "sb_publishable_C_5cBiXJWq2zVyWmgnMZbQ_W4aonYIy",
  async get(table, orderColumn) {
    const endpoint = this.url + "/rest/v1/" + table + "?published=eq.true&select=*&order=" + orderColumn;
    const response = await fetch(endpoint, {
      headers: { apikey: this.key }
    });
    if (!response.ok) throw new Error("content fetch failed");
    return response.json();
  },
  async activities() {
    try { return await this.get("site_activities", "event_date.asc.nullslast,sort_order.asc"); }
    catch (e) { return window.NICE_TRIP_CONTENT.activities; }
  },
  async articles() {
    try { return await this.get("site_articles", "sort_order.asc,published_at.desc.nullslast"); }
    catch (e) { return window.NICE_TRIP_CONTENT.articles; }
  }
};
