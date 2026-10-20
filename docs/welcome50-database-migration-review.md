# WELCOME50 隔離資料庫變更（尚未執行）

正式資料庫已唯讀核對：`site_activities` 有 `service`、`ticket_options`；`registrations` 有 `quantity`、`unit_price`、`total_amount`；`registration_notifications.payload` 為 jsonb。上述表目前沒有優惠專用欄位。

## 變更草案
- `welcome50_enabled`：活動層級、預設 false；不會自動開啟所有 city 活動。
- `promotion_code`、`promotion_discount`、`original_total`：訂單保留優惠稽核明細，`total_amount` 仍為實付金額。
- 無碼報名：`promotion_code=null`、`promotion_discount=0`，保留舊有價格計算。
- 附有 rollback 草案；執行 rollback 前需檢查是否已有優惠訂單，避免資料遺失。

## 實作警戒
- 正式 `create_registration_atomic` 目前只寫既有欄位。正式導入時必須一起更新 RPC，保留活動 row lock、名額判斷與原始訂單流程，並在資料庫交易內保存優惠明細。
- Edge Function 必須從資料庫查詢 `service`、`welcome50_enabled`，以伺服器端票價重算。不可相信瀏覽器送來的優惠或總額。
- 現有系統每筆訂單單一票種；混合票種不在這次新增功能範圍內。
- 票種既有早鳥／限時價格與「不得與其他優惠券合併」的區別應保留：既有票價不是第二組優惠碼，除非主辦單位另定限制。
- 無效碼不可默默退回原價送單；客戶必須明確移除優惠碼後才能以原價送出。
- `ticket_price < 50` 時，折扣上限為該參加者票價，不得出現負數。
- 訂單付款後退款、取消或折扣稽核資料保留策略仍需在隔離環境驗證。

## 執行條件
目前 Supabase `list_branches` 回傳空清單。建立 Supabase 分支可能有額外費用，需先查詢費用並取得使用者同意；不得在正式專案直接試跑 migration。
