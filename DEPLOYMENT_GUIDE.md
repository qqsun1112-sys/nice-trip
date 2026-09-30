# 美遊記 NICE TRIP｜部署與維護說明

## 正式網站
目前 repository：`qqsun1112-sys/nice-trip`
GitHub Pages 基準網址：`https://qqsun1112-sys.github.io/nice-trip/`

網站已採正式可索引設定：
- robots.txt：Allow /
- sitemap.xml：正式 GitHub Pages 網址
- 公開頁 canonical：正式 GitHub Pages 網址
- privacy / terms / admin / 404 不作一般內容索引

## 內容管理
管理入口：`admin.html`

後台用途：
- 活動新增／編輯／發布／下架
- 文章新增／編輯／發布／下架
- 圖片直接上傳
- 活動狀態與報名截止管理

後台資料：Supabase
公開前台只讀取 `published=true` 的活動與文章；讀取失敗時保留靜態 fallback。公開 REST 讀取只使用 Supabase publishable `apikey`，不使用 service-role／secret key。

活動日期以 `Asia/Taipei` 判斷；取消與延期活動不會因原活動日期已過而被誤列為「活動足跡」。

精選閱讀正式來源目前允許：輕旅行（travel.yam.com）、女子漾（woman.udn.com）、公民新聞（peopo.org）。後台發布時會檢查媒體名稱與網址來源一致。

## 報名
官網報名為主要流程，目前付款方式為銀行電匯。
需要信用卡或其他金流時，可提供該場活動的 ACCUPASS 作備用入口。

新莊報名使用：
- `submit-registration`
- `report-transfer`

兩支 Edge Function 均限制允許來源並執行後端欄位驗證。

## 安全原則
- 不要把 Supabase service-role／secret key 放進 repository。
- 前端只可使用 publishable key。
- 管理密碼不要寫入 HTML、README 或 GitHub。
- registrations 含個資，不建立公開 SELECT policy。
- 活動保險用出生日期與身分證字號不得挪作行銷用途。

## 正式更新流程
一般活動與文章：使用 admin.html，不需修改程式碼。
網站版型／功能：修改 repository 後由 GitHub Pages 部署。

若未來改用自訂網域，需同步更新 canonical、sitemap、robots 與 Supabase Edge Function CORS allowlist。
