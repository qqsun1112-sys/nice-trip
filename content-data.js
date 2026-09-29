/* NICE TRIP content registry
   日後新增／替換活動與文章，優先修改本檔資料，不必重做頁面。
   活動 service: city | temple | meditation | relaxation
   status: open | full | ended | upcoming
*/
window.NICE_TRIP_CONTENT = {
  activityServices: {
    city: { name: "城市故事行旅", subtitle: "文化教育", label: "探索" },
    temple: { name: "廟語心聲", subtitle: "信仰文化", label: "閱讀" },
    meditation: { name: "百八鐘靜心運動", subtitle: "心理健康", label: "安定" },
    relaxation: { name: "身心放鬆術", subtitle: "健康促進", label: "練習" }
  },
  activities: [
    {
      id: "xinzhuang-20261024",
      service: "city",
      title: "新莊小旅行",
      date: "2026-10-24",
      time: "10:00–12:00",
      status: "open",
      officialUrl: "activity-xinzhuang.html",
      payment: "bank-transfer",
      accupassUrl: "https://www.accupass.com/event/2608161009211123836604"
    },
    {
      id: "sheliao-20261031",
      service: "city",
      title: "社寮小旅行",
      date: "2026-10-31",
      status: "upcoming",
      officialUrl: "",
      payment: "bank-transfer",
      accupassUrl: "https://www.accupass.com/event/2608240420081031009753"
    },
    {
      id: "monga",
      service: "city",
      title: "艋舺小旅行",
      status: "upcoming",
      officialUrl: "",
      payment: "bank-transfer",
      accupassUrl: ""
    },
    {
      id: "guandu-20261121",
      service: "city",
      title: "關渡小旅行",
      date: "2026-11-21",
      status: "upcoming",
      officialUrl: "",
      payment: "bank-transfer",
      accupassUrl: ""
    }
  ],
  articles: [
    { category:"faith", publisher:"輕旅行", date:"2026-08-20", title:"旅行不一定要去遠方！走進松山霞海城隍廟", url:"https://travel.yam.com/article/141045" },
    { category:"city", publisher:"輕旅行", date:"2026-09-02", title:"你以為只是一面牆，它卻裝下了兩千多年的文化", url:"https://travel.yam.com/article/140883" },
    { category:"travel", publisher:"女子漾", date:"2026-08-31", title:"走進上高地，才發現最美的不是風景", url:"https://woman.udn.com/woman/story/123162/9724628" },
    { category:"travel", publisher:"輕旅行", date:"2026-08-22", title:"清津峽", url:"https://travel.yam.com/article/140763" },
    { category:"faith", publisher:"輕旅行", title:"臺灣廟宇文化", url:"https://travel.yam.com/article/140664" },
    { category:"city", publisher:"女子漾", title:"閱讀城市", url:"https://woman.udn.com/woman/story/123162/9669005" }
  ]
};

window.NiceTripContent = {
  activeActivities() {
    const today = new Date();
    today.setHours(0,0,0,0);
    return window.NICE_TRIP_CONTENT.activities
      .filter(a => a.status !== "ended" && (!a.date || new Date(a.date + "T00:00:00") >= today))
      .sort((a,b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31"));
  },
  pastActivities() {
    const today = new Date();
    today.setHours(0,0,0,0);
    return window.NICE_TRIP_CONTENT.activities
      .filter(a => a.status === "ended" || (a.date && new Date(a.date + "T00:00:00") < today))
      .sort((a,b) => (b.date || "").localeCompare(a.date || ""));
  },
  activitiesByService(service) {
    return this.activeActivities().filter(a => a.service === service);
  },
  latestArticles(limit) {
    return [...window.NICE_TRIP_CONTENT.articles]
      .sort((a,b) => (b.date || "").localeCompare(a.date || ""))
      .slice(0, limit || window.NICE_TRIP_CONTENT.articles.length);
  }
};
