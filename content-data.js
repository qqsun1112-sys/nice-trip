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
          "slug": "kiyotsu",
          "category": "travel",
          "publisher": "輕旅行",
          "date": "2026-08-22",
          "image": "assets/images/article-kiyotsu.jpg",
          "imageAlt": "日本新潟清津峽",
          "title": "一條隧道，如何把峽谷變成藝術？",
          "excerpt": "走進750公尺的黑暗與光之間，重新學會觀看自然。",
          "url": "https://travel.yam.com/article/140763",
          "sortOrder": 1
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
          "url": "https://woman.udn.com/woman/story/123162/9724628",
          "sortOrder": 2
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
          "url": "https://travel.yam.com/article/140883",
          "sortOrder": 3
      },
      {
          "slug": "songshan-trip-20260928",
          "category": "city",
          "publisher": "女子漾",
          "date": "2026-09-28",
          "image": "assets/images/LINE_ALBUM_2026.9.27 松山_261001_1.jpg",
          "imageAlt": "松山小旅行文章主視覺",
          "title": "松山小旅行｜沿著一條彎曲的河，走進錫口的繁華與日常",
          "excerpt": "從松山車站的光穹、慈祐宮到基隆河與饒河街，重新閱讀錫口的城市記憶。",
          "url": "https://woman.udn.com/woman/story/123162/9781612",
          "sortOrder": 4
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
          "url": "https://travel.yam.com/article/141045",
          "sortOrder": 5
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
          "url": "https://woman.udn.com/woman/story/123162/9669005",
          "sortOrder": 6
      },
      {
          "slug": "temple-reading",
          "category": "faith",
          "publisher": "輕旅行",
          "date": "2026-08-11",
          "image": "assets/images/temple-detail.webp",
          "imageAlt": "傳統廟宇建築文化細節",
          "title": "當我們不再看懂廟宇：臺灣傳統文化如何重新被閱讀？",
          "excerpt": "從匠師工藝、地方故事與人生智慧，重新理解廟宇的公共文化價值。",
          "url": "https://travel.yam.com/article/140664",
          "sortOrder": 7
      },

      {
          "slug": "ishigaki-torinji-20260304",
          "category": "travel",
          "publisher": "輕旅行",
          "date": "2026-03-03",
          "image": "assets/images/日本石垣島.jpg",
          "imageAlt": "搭乘郵輪前往日本石垣島桃林寺的旅程意象",
          "title": "日本石垣島桃林寺｜當地獨一無二的文化瑰寶｜地表最樸素的金剛力士",
          "excerpt": "從石垣島桃林寺的紅瓦、仁王像與四百年風雨，讀一段關於守護、節制與文化記憶的故事。",
          "url": "https://travel.yam.com/article/139660",
          "sortOrder": 9
      },
      {
          "slug": "beppu-umijigoku-20251215",
          "category": "travel",
          "publisher": "輕旅行",
          "date": "2025-12-14",
          "image": "assets/images/日本海地獄.jpg",
          "imageAlt": "日本九州別府海地獄自然景觀",
          "title": "日本海地獄｜在藍的像夢一樣的地方，學會對大自然保持謙卑",
          "excerpt": "走進九州別府海地獄，在夢幻鈷藍泉水與地熱景觀之間，重新感受自然的力量與敬意。",
          "url": "https://travel.yam.com/article/139107",
          "sortOrder": 10
      },
      {
          "slug": "setsugekka-train-20251201",
          "category": "travel",
          "publisher": "輕旅行",
          "date": "2025-12-01",
          "image": "assets/images/地表最完美的移動空間.jpg",
          "imageAlt": "日本新潟雪月花號景觀列車",
          "title": "地表最完美的移動空間｜讓想像飛馳，用極緻打造的雪月花號景觀列車",
          "excerpt": "搭上新潟雪月花號，從270度景觀、在地工藝到料理，體驗一座會移動的新潟文化展覽館。",
          "url": "https://travel.yam.com/article/139019",
          "sortOrder": 11
      },
      {
          "slug": "taipei-shikoku-henro-20250402",
          "category": "city",
          "publisher": "女子漾",
          "date": "2025-04-02",
          "image": "assets/images/與大師同行之「台北新四國遍路」.webp",
          "imageAlt": "台北新四國遍路朝聖文化旅行",
          "title": "與大師同行之「台北新四國遍路」～一路相伴、你不孤單的朝聖之旅",
          "excerpt": "從台北天后宮、臨濟護國禪寺到北投普濟寺，循著弘法大師與石佛足跡，閱讀台北的朝聖文化。",
          "url": "https://woman.udn.com/woman/story/123162/8648283?from=udn-search_ch4087",
          "sortOrder": 12
      },

      {
          "slug": "kamo-aquarium-20260421",
          "category": "travel",
          "publisher": "女子漾",
          "date": "2026-04-21",
          "image": "",
          "imageAlt": "日本鶴岡市立加茂水族館水母展示",
          "title": "日本鶴岡市立加茂水族館｜一座從低谷重生的水母奇蹟，讓人重新相信希望",
          "excerpt": "從差點閉館到成為世界知名的水母水族館，在夢幻光影與生命韌性之間，看見一座城市從低谷重新發光的故事。",
          "url": "https://woman.udn.com/woman/story/123162/9455065?from=udn-search_ch4087",
          "sortOrder": 13
      },
      {
          "slug": "atami-moa-museum-20250207",
          "category": "travel",
          "publisher": "女子漾",
          "date": "2025-02-07",
          "image": "",
          "imageAlt": "日本熱海MOA美術館",
          "title": "日本熱海MOA美術館～藝術、建築與自然交織的夢幻殿堂",
          "excerpt": "走進熱海山海之間的 MOA 美術館，從東亞藝術、建築空間到自然景觀，體驗一場跨越藝術與旅行的美學旅程。",
          "url": "https://woman.udn.com/woman/story/123162/8532840?from=udn-search_ch4087",
          "sortOrder": 14
      },
      {
          "slug": "logos-hope-ship-20250219",
          "category": "city",
          "publisher": "女子漾",
          "date": "2025-02-19",
          "image": "",
          "imageAlt": "海上圖書館望僕號",
          "title": "全世界最大的海上圖書館「望僕號」～一艘載運愛與希望的知識方舟",
          "excerpt": "當海風遇上書香，走進停靠基隆港的海上圖書館望僕號，閱讀一艘以知識、交流與希望航向世界的文化方舟。",
          "url": "https://woman.udn.com/woman/story/123162/8557421?from=udn-search_ch4087",
          "sortOrder": 15
      },
      {
          "slug": "yangmingshan-dream-lake-20241008",
          "category": "travel",
          "publisher": "女子漾",
          "date": "2024-10-08",
          "image": "",
          "imageAlt": "陽明山夢幻湖寂靜山徑",
          "title": "陽明山夢幻湖》都會寧靜公園內第一條寂靜山徑～寧靜致遠、深入人心",
          "excerpt": "從冷水坑走向夢幻湖，在台灣水韭、生態保育與寂靜山徑之間，重新體會安靜與自然共存的力量。",
          "url": "https://woman.udn.com/woman/story/123162/8245005?from=udn-search_ch4087",
          "sortOrder": 16
      },
      {
          "slug": "miho-museum-20240903",
          "category": "travel",
          "publisher": "女子漾",
          "date": "2024-09-03",
          "image": "",
          "imageAlt": "日本滋賀MIHO美秀美術館",
          "title": "日本滋賀MIHO美秀美術館｜躍然紙上的世外桃源｜閱讀就從旅行開始",
          "excerpt": "循著貝聿銘打造的桃花源意境，走進滋賀山林中的 MIHO 美術館，讓建築、藝術與旅行成為一場跨時空閱讀。",
          "url": "https://woman.udn.com/woman/story/123162/8202656?from=udn-search_ch4087",
          "sortOrder": 17
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
          "url": "https://news.taiwannet.com.tw/news/206054/",
          "sortOrder": 21
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
          "url": "https://news.taiwannet.com.tw/news/219916/",
          "sortOrder": 40
      },
      {
          "slug": "songshan-xiahai-499-20260921",
          "category": "faith",
          "publisher": "台灣產經新聞網",
          "date": "2026-09-21",
          "image": "assets/images/廟語心聲.png",
          "imageAlt": "廟語心聲文化活動主視覺",
          "title": "寺廟變身城市教室｜「廟語心聲」獲中高齡參與者高度肯定",
          "excerpt": "松山霞海文化小旅行滿意度 4.99 分，文化走讀串起終身學習、地方認同與文化永續。",
          "url": "https://news.taiwannet.com.tw/news/220473/",
          "sortOrder": 41
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
          "url": "https://news.taiwannet.com.tw/news/192019/",
          "sortOrder": 43
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
