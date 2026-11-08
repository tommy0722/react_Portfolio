# 小小作品集

個人作品集網站，前端 React（Vite），後端 [Django](https://github.com/tommy0722/myweb_backend)（另一個 repo）。

## 功能

- **記帳本**（`/accounting`，需登入）：收支紀錄、帳戶／分類管理、定期交易（到期需手動確認才記帳）、月度預算上限與可自由花用金額、統計圖表、批量操作、CSV 匯出。
- **楓之谷打王紀錄**（`/mapleboss`，需登入）：Boss 擊殺時間上傳與重生倒數。
- **今天吃什麼輪盤**（`/roulette`，需登入）：附近餐廳抽選、輪盤動畫、歷史紀錄統計。
- **24 點遊戲**（`/game24`）：隨機發牌並即時運算求解。
- **色塊拼圖** / **密碼強度判斷**：小型 CSS / JS 練習作品。
- 「Django 後端」頁籤展示另外幾個私有 Django 專案的架構文件（排班系統、幼兒發展評估系統、發票辨識系統）。

登入採 Google OAuth，取得 JWT 後呼叫 Django REST API。

## 開發

```bash
npm install
npm run dev       # 本機開發伺服器
npm run build     # 建置到 dist/
npm test          # 執行單元測試（Vitest）
npm run lint      # ESLint（目前尚有既有程式碼的既有警告未清，非本次變更引入）
```

需要的環境變數見 `.env.example`（複製為 `.env` 後填入實際值，`.env` 不會被提交）。

## 部署

`Dockerfile` 多階段建置：Node 建置 `dist/` → 複製進 `nginx` image。`docker-compose.yml` 僅掛載 `nginx.conf`，不要額外掛載本機目錄到 `/usr/share/nginx/html`，否則會蓋掉建置好的內容。

```bash
docker compose up -d --build
```
