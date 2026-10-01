/* NICE TRIP content registry
   日後新增／替換活動與文章，優先修改本檔資料，不必重做頁面。
   活動 service: city | temple | meditation | relaxation
   status: open | full | ended | upcoming | cancelled | postponed
*/
window.NICE_TRIP_CONTENT = {
  settings: {
    registrationPrimary: "official",
    officialPayment: "bank-transfer",
    alternatePaymentProvider: "ACCUPASS",
    archiveEndedActivities: true,
    homepageActivityLimit: 3,
    homepageArticleLimit: 3
  },
  activityServices: {
    city: { name: "城市故事行旅", subtitle: "文化教育", label: "探索" },
    temple: { name: "廟語心聲", subtitle: "信仰文化", label: "閱讀" },
    meditation: { name: "百八鐘靜心運動", subtitle: "心理健康", label: "安定" },
    relaxation: { name: "身心放鬆術", subtitle: "健康促進", label: "練習" }
  },
  activities: [
    {
      id: "meditation-108-accupass-260720",
      service: "meditation",
      title: "百八鐘靜心運動｜實體活動",
      summary: "百八鐘靜心運動實體體驗活動，開放報名中。",
      status: "open",
      visuals: { home: "", listing: "", detail: "", social: "" },
      registrationDeadline: "",
      imageAlt: "百八鐘靜心運動實體活動主視覺",
      officialUrl: "",
      payment: "accupass",
      accupassUrl: "https://www.accupass.com/event/2607200101301082030862"
    },
    {
      id: "body-relaxation-accupass-260814",
      service: "relaxation",
      title: "身心放鬆術｜實體活動",
      summary: "身心放鬆術實體體驗活動，開放報名中。",
      status: "open",
      visuals: { home: "", listing: "", detail: "", social: "" },
      registrationDeadline: "",
      imageAlt: "身心放鬆術實體活動主視覺",
      officialUrl: "",
      payment: "accupass",
      accupassUrl: "https://www.accupass.com/event/2608140740241653305881"
    },
    {
      id: "temple-songshan-20261026",
      service: "temple",
      title: "廟語心聲：松山霞海城隍廟",
      summary: "閱讀建築・閱讀文化・閱讀人生；用一小時，從建築與文化重新閱讀一座廟。",
      date: "2026-10-26",
      time: "15:00–16:00",
      status: "open",
      visuals: { home: "", listing: "", detail: "", social: "" },
      registrationDeadline: "",
      imageAlt: "廟語心聲松山霞海城隍廟文化講座活動主視覺",
      officialUrl: "",
      payment: "free",
      accupassUrl: "https://www.accupass.com/event/2608250728484011067760"
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
      officialUrl: "activity-xinzhuang.html",
      payment: "bank-transfer",
      accupassUrl: "https://www.accupass.com/event/2608161009211123836604"
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
      officialUrl: "activity-sheliao.html",
      payment: "bank-transfer",
      accupassUrl: "https://www.accupass.com/event/2608240420081031009753"
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
      officialUrl: "activity-monga.html",
      payment: "bank-transfer",
      accupassUrl: "https://www.accupass.com/event/2608290620481899528172"
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
      officialUrl: "activity-guandu.html",
      payment: "bank-transfer",
      accupassUrl: "https://www.accupass.com/event/2609121231291837452375"
    }
  ],
  articles: [
    { category:"wellness", publisher:"台灣產經新聞網", date:"2026-09-16", image:"assets/images/身心放鬆術中和樂齡.jpg", imageAlt:"身心放鬆術與樂齡健康促進報導", title:"樂齡學習從「學習」走向「健康生活」｜身心放鬆術走進中和樂齡學習中心", url:"https://news.taiwannet.com.tw/news/219916/" },
    { category:"faith", publisher:"輕旅行", date:"2026-08-20", image:"assets/images/旅行不一定要去遠方.jpg", imageAlt:"松山霞海城隍廟文章主視覺", title:"旅行不一定要去遠方！走進松山霞海城隍廟", url:"https://travel.yam.com/article/141045" },
    { category:"city", publisher:"輕旅行", date:"2026-09-02", image:"assets/images/萬仞宮牆.jpg", imageAlt:"臺北孔子廟萬仞宮牆", title:"你以為只是一面牆，它卻裝下了兩千多年的文化", url:"https://travel.yam.com/article/140883" },
    { category:"travel", publisher:"女子漾", date:"2026-08-31", image:"assets/images/article-kamikochi.jpg", imageAlt:"日本上高地自然風景", title:"走進上高地，才發現最美的不是風景", url:"https://woman.udn.com/woman/story/123162/9724628" },
    { category:"travel", publisher:"輕旅行", date:"2026-08-22", image:"assets/images/article-kiyotsu.jpg", imageAlt:"日本新潟清津峽", title:"清津峽", url:"https://travel.yam.com/article/140763" },
    { category:"faith", publisher:"輕旅行", image:"assets/images/當我們不再看懂廟宇.png", imageAlt:"臺灣廟宇文化文章主視覺", title:"臺灣廟宇文化", url:"https://travel.yam.com/article/140664" },
    { category:"city", publisher:"女子漾", image:"assets/images/當旅行不再只是打卡jpg.jpg", imageAlt:"閱讀城市文章主視覺", title:"閱讀城市", url:"https://woman.udn.com/woman/story/123162/9669005" }
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
    return ({open:"開放報名",full:"已額滿",ended:"活動結束",upcoming:"即將公布",cancelled:"活動取消",postponed:"活動延期"})[status] || status;
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
    try { return await this.get("site_articles", "published_at.desc.nullslast,sort_order.asc"); }
    catch (e) { return window.NICE_TRIP_CONTENT.articles; }
  }
};
