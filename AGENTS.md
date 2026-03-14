# AGENTS.md - Vimeo API 字幕上傳工具

本文件提供 AI Agent 在此代碼庫中工作的指導方針。

---

## 1. 專案概述

- **專案名稱**: vimeo-api
- **類型**: Node.js/Express 後端應用
- **用途**: 批量上傳 SRT 字幕至 Vimeo，支援網頁介面與 CLI 兩種操作方式
- **主要依賴**: express, @vimeo/vimeo, cors, multer
- **Node 版本**: >= 18

---

## 2. 執行指令

### 開發環境
```bash
# 安裝依賴
npm install

# 啟動網頁伺服器（推薦）
npm run dev

# 或直接執行
node src/server.js
```

### CLI 模式
```bash
# 預覽匹配結果（不上傳）
node src/index.js <ACCESS_TOKEN> --dry-run

# 正式上傳
node src/index.js <ACCESS_TOKEN>
```

### 單一檔案測試
```bash
# 測試特定模組
node -e "require('./src/vimeo-client')"

# 測試 matcher 邏輯
node -e "
const { loadSrtFiles, matchSrtToVideos } = require('./src/matcher');
const files = loadSrtFiles('./srt');
console.log(files);
"
```

---

## 3. 程式碼風格規範

### 3.1 語法與模組

- **使用 CommonJS**: 採用 `require()` 與 `module.exports`
- **不需 TypeScript**: 本專案為純 JavaScript
- **模組化**: 每個功能獨立一個檔案（vimeo-client.js, matcher.js 等）

```javascript
// 正確
const express = require("express");
const { createClient } = require("./vimeo-client");

// 錯誤
import express from "express";
```

### 3.2 變數與函式命名

- **變數**: camelCase
- **常數**: UPPER_SNAKE_CASE（如 `DRY_RUN`, `PORT`）
- **函式**: camelCase，描述性名稱
- **類別**（如有）: PascalCase

```javascript
// 變數
let cachedVideos = null;
const uploadDelay = 1000;

// 函式
function normalize(str) { ... }
async function fetchAllVideos(client) { ... }

// 常數
const SRT_DIR = path.resolve(__dirname, "../srt");
const DRY_RUN = process.argv.includes("--dry-run");
```

### 3.3 字串與引號

- **字串引號**: 雙引號 `"` 為主
- **CSS/HTML 屬性**: 雙引號

```javascript
// 正確
const app = express();
app.use(cors());

// 錯誤
const app = express();
app.use(cors());
```

### 3.4 空格與縮排

- **縮排**: 2 空格
- **物件/陣列**: 元素後逗號（trailing comma）
- **運算子周圍**: 前後空格

```javascript
// 正確
const obj = {
  key1: "value1",
  key2: "value2",
};

const arr = [1, 2, 3];

if (statusCode >= 400) {
  return reject(new Error(`API ${statusCode}`));
}

// 錯誤
const obj = { key1: "value1", key2: "value2" };
if(statusCode>=400){ ... }
```

### 3.5 Async 處理

- **使用 async/await**: 優先使用 async/await
- **錯誤處理**: try/catch 區塊
- **Promise 包裝**: 回呼式 API 包裝為 Promise

```javascript
// 正確
async function fetchAllVideos(client) {
  try {
    const res = await apiRequest(client, "GET", "/me/videos", params);
    return res.data;
  } catch (err) {
    console.error("取得影片失敗:", err.message);
    throw err;
  }
}

// Promise 包裝回呼
function apiRequest(client, method, endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    client.request(..., (error, body, statusCode) => {
      if (error) return reject(error);
      resolve(body);
    });
  });
}
```

### 3.6 錯誤處理

- **API 錯誤**: 回傳適當 HTTP 狀態碼與錯誤訊息
- **同步錯誤**: console.error + process.exit(1)
- **非同步錯誤**: .catch() 處理

```javascript
// Express 路由錯誤處理
app.post("/api/connect", async (req, res) => {
  try {
    const client = createClient(token);
    const user = await client.request(...);
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// CLI 錯誤處理
main().catch((err) => {
  console.error("發生錯誤:", err.message);
  process.exit(1);
});
```

### 3.7 模組匯出

- **使用 module.exports**: 物件形式匯出多個功能
- **命名匯出**: 明確命名以便 tree-shaking（雖然 CommonJS 不支援）

```javascript
// 正確
module.exports = { createClient, fetchAllVideos, addTextTrack };

// 錯誤
module.exports = function() { ... };
```

### 3.8 檔案組織

```
src/
├── server.js      # Express 伺服器與 API 路由
├── index.js       # CLI 入口點
├── vimeo-client.js # Vimeo API 封裝
└── matcher.js     # SRT 檔案與影片匹配邏輯
```

---

## 4. API 設計原則

### 4.1 RESTful 路由

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/connect` | 驗證 Token |
| GET | `/api/videos` | 取得影片列表 |
| POST | `/api/match` | 匹配 SRT 與影片 |
| POST | `/api/upload` | 提交上傳項目 |
| GET | `/api/upload/stream` | SSE 進度串流 |

### 4.2 請求/回應格式

- **請求**: JSON body 或 multipart/form-data
- **成功回應**: `{ success: true, ... }` 或 `{ ok: true, ... }`
- **錯誤回應**: `{ error: "錯誤訊息" }` + 適當 HTTP 狀態碼

### 4.3 SSE 即時更新

上傳進度使用 Server-Sent Events：

```javascript
res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
});

const send = (event, data) => {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
};

send("progress", { index: 0, status: "uploading" });
```

---

## 5. 開發注意事項

### 5.1 Vimeo API Token

- 需要 Vimeo Developer 帳號產生的 Personal Access Token
- 必要權限: `private`, `edit`, `upload`

### 5.2 檔名編碼處理

- Multer 儲存的 `originalname` 為 latin1 編碼
- CJK 檔名需解碼：

```javascript
const decodedName = Buffer.from(file.originalname, "latin1").toString("utf-8");
```

### 5.3 匹配邏輯

- 忽略大小寫、空格/底線/連字號差異
- normalize 函式：

```javascript
function normalize(str) {
  return str.trim().toLowerCase().replace(/[\s\-_]+/g, " ");
}
```

---

## 6. 未來擴充建議

如需加入測試或 linting：

```bash
# 安裝 Jest（測試）
npm install --save-dev jest

# 安裝 ESLint + Prettier
npm install --save-dev eslint prettier eslint-config-prettier
```

---

## 7. 快速參考

| 項目 | 規定 |
|------|------|
| 語法 | CommonJS (require/module.exports) |
| 縮排 | 2 空格 |
| 引號 | 雙引號 `"` |
| 命名 | camelCase（變數/函式）、UPPER_SNAKE_CASE（常數） |
| Async | async/await + try/catch |
| 錯誤處理 | HTTP 狀態碼 + JSON 錯誤訊息 |
| 測試框架 | 目前無（建議 Jest） |
| Linting | 目前無（建議 ESLint） |
