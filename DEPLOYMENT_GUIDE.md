# Phase 5｜免費測試部署指南

## 建議路徑：GitHub Pages
1. 建立一個新的 GitHub repository（例如 `nice-trip-preview`）。
2. 將本資料夾內所有檔案放在 repository 根目錄。
3. Repository Settings → Pages → Build and deployment → Deploy from a branch。
4. Branch 選 `main`，Folder 選 `/ (root)`。
5. 儲存後等待 GitHub Pages 產生免費測試網址。

## 測試站安全設定
- 本 Phase 5 HTML 已加入 `noindex,nofollow`，避免測試站被搜尋引擎當正式網站收錄。
- `robots.txt` 也暫時禁止索引。
- 正式上線時必須移除 noindex、改寫 canonical、sitemap 與 robots.txt。
- 不要把密碼、API key、付款金鑰或私人資料放進 repository。

## 正式上線前必做
- 將 `https://www.example.com/` 全部替換為正式網域。
- 更新 sitemap.xml。
- robots.txt 改為允許索引。
- 移除所有 HTML 的 `<meta name="robots" content="noindex,nofollow">`。
- 真實表單後端／寄信服務完成後，再啟用正式送出。
