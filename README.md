# Vimeo 字幕批量上傳工具

批量上傳 SRT 字幕檔至 Vimeo，自動依檔名匹配對應影片。提供網頁介面與 CLI 兩種操作方式。

## 功能

- 透過 Vimeo API 取得帳號下所有影片
- SRT 檔名自動比對影片標題（忽略大小寫、空格/底線/連字號差異）
- 預覽匹配結果（dry-run），確認後再上傳
- 字幕語言預設繁體中文（zh-TW）

## 前置需求

- [Node.js](https://nodejs.org/) >= 18
- Vimeo Personal Access Token（需含 `upload`、`edit` scope）

### 取得 Access Token

1. 前往 [Vimeo Developer](https://developer.vimeo.com/apps) 建立應用程式
2. 在應用程式頁面產生 Personal Access Token
3. 勾選所需權限：`private`、`edit`、`upload`

## 安裝

```bash
git clone https://github.com/kaisudo0520/viemo-api.git
cd vimeo-api
npm install
```

## 設定

複製範本並填入 Access Token：

```bash
cp .env.sample .env
```

編輯 `.env`，替換 token：

```
VIMEO_ACCESS_TOKEN=your_access_token_here
```

## 使用方式

### 網頁介面

```bash
npm run dev
```

開啟 http://localhost:3000 ，依照畫面四步驟操作：

1. **連線** — 貼上 Access Token，驗證帳號
2. **選取檔案** — 拖曳或點擊上傳 `.srt` 檔
3. **預覽匹配** — 確認 SRT 與影片的對應關係
4. **上傳** — 確認無誤後批量上傳字幕

### CLI 模式

將 `.srt` 檔案放入 `srt/` 目錄，檔名須與影片標題一致。

```bash
# 預覽匹配結果（不上傳）
npm run dry-run

# 正式上傳
npm run upload
```

## 檔名匹配規則

SRT 檔名（不含副檔名）需與 Vimeo 影片標題一致。比對時：

- 忽略大小寫
- 空格、底線 `_`、連字號 `-` 視為相同

| SRT 檔名 | 可匹配的影片標題 |
|----------|----------------|
| `我的旅遊紀錄.srt` | 我的旅遊紀錄 |
| `product-demo.srt` | Product Demo |
| `my_video.srt` | my video |

## 專案結構

```
vimeo-api/
├── .env                 # Access Token
├── public/
│   └── index.html       # 網頁介面
├── srt/                 # CLI 模式的 SRT 目錄
└── src/
    ├── server.js        # Express API 伺服器
    ├── vimeo-client.js  # Vimeo API 封裝
    ├── matcher.js       # 匹配邏輯
    └── index.js         # CLI 入口
```

## API 端點（內部）

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/connect` | 驗證 Token 並連線 |
| GET | `/api/videos` | 取得影片列表 |
| POST | `/api/match` | 上傳 SRT 檔並比對影片 |
| POST | `/api/upload` | 批量上傳字幕至 Vimeo |

## 授權

ISC
