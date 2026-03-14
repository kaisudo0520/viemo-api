# SKILLS.md - 技能說明文件

本文件記錄系統中所有可用技能的用途說明，供 AI Agent 在執行任務時參考。

---

## 專業領域技能 (ECC 系列)

### 架構與開發方法

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/agentic-engineering | 使用 eval-first 執行的 agent 工程，強調評估驅動開發 |
| ecc/ai-first-engineering | AI agent 生成大量實作輸出的工程營運模型 |
| ecc/autonomous-loops | 自主 agent 循環模式，包含品質閘道、評估和恢復控制 |
| ecc/continuous-agent-loop | 連續自主 agent 工作流程的設計模式 |
| ecc/blueprint | 將目標轉為逐步建設計劃，適合多階段、多代理工程專案 |
| ecc/ralphinho-rfc-pipeline | RFC 驅動的 DAG 執行模式，含品質閘道和合併隊列 |
| ecc/strategic-compact | 策略性上下文壓縮，在任務階段保持上下文 |

### 後端開發

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/backend-patterns | Node.js、Express、Next.js API 路由的後端架構模式 |
| ecc/api-design | REST API 設計模式，包含命名、狀態碼、分頁、錯誤回應 |
| ecc/springboot-patterns | Spring Boot 架構模式、REST API 設計、資料層、快取 |
| ecc/springboot-security | Spring Security 最佳實踐，包含驗證、授權、CSRF 防護 |
| ecc/springboot-tdd | Spring Boot 測試驅動開發，使用 JUnit 5、Mockito、MockMvc |
| ecc/django-patterns | Django 架構模式、DRF API 設計、ORM 最佳實踐 |
| ecc/django-security | Django 安全最佳實踐（認證、授權、SQL 注入防護） |
| ecc/django-tdd | Django 測試策略，使用 pytest-django |
| ecc/golang-patterns | Go 慣用模式、最佳實踐和約定 |
| ecc/golang-testing | Go 測試模式，包含表格驅動測試、基準測試、模糊測試 |
| ecc/python-patterns | Python 慣用模式、PEP 8 標準、型別提示 |
| ecc/python-testing | Python 測試策略，使用 pytest、TDD 方法論 |
| ecc/kotlin-patterns | Kotlin 慣用模式、最佳實踐（coroutines、null 安全） |
| ecc/kotlin-ktor-patterns | Ktor 伺服器模式，包含路由 DSL、插件、認證 |
| ecc/kotlin-exposed-patterns | JetBrains Exposed ORM 模式 |
| ecc/kotlin-coroutines-flows | Kotlin Coroutines 和 Flow 模式 |
| ecc/java-coding-standards | Java Spring Boot 編碼標準 |
| ecc/jpa-patterns | JPA/Hibernate 模式，實體設計、查詢優化 |
| ecc/android-clean-architecture | Android 和 KMP 的 Clean Architecture |
| ecc/cpp-coding-standards | C++ 編碼標準，基於 C++ Core Guidelines |
| ecc/cpp-testing | C++ 測試模式，使用 GoogleTest/CTest |
| ecc/perl-patterns | 現代 Perl 5.36+ 慣用模式和最佳實踐 |
| ecc/perl-security | Perl 安全（taint 模式、輸入驗證、DBI 參數化查詢） |
| ecc/perl-testing | Perl 測試模式，使用 Test2::V0 |

### 前端開發

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/frontend-patterns | React、Next.js 開發模式、狀態管理、效能優化 |
| ecc/frontend-design | 生產級前端介面建立，避免通用 AI 美學 |
| ecc/frontend-slides | 建立動畫豐富的 HTML 簡報 |
| ecc/next-best-practices | Next.js 最佳實踐，包含 RSC 邊界、資料模式、async APIs |
| ecc/vercel-react-best-practices | Vercel React 效能優化指南 |
| ecc/compose-multiplatform-patterns | Compose Multiplatform 和 Jetpack Compose 模式 |
| ecc/swiftui-patterns | SwiftUI 架構模式、狀態管理、導航、效能優化 |
| ecc/swift-concurrency-6-2 | Swift 6.2 並發設計 |
| ecc/swift-actor-persistence | Swift Actor 持久化，執行緒安全資料儲存 |
| ecc/swift-protocol-di-testing | Swift 協議依賴注入和測試 |
| ecc/liquid-glass-design | iOS 26 Liquid Glass 設計系統 |

### 資料庫

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/postgres-patterns | PostgreSQL 資料庫模式，查詢優化、schema 設計、索引 |
| ecc/clickhouse-io | ClickHouse 資料庫模式，高效能分析工作負載 |
| ecc/database-migrations | 資料庫遷移最佳實踐（Prisma、Drizzle、Django、TypeORM） |

### 測試與品質

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/tdd-workflow | 測試驅動開發工作流程，80%+ 覆蓋率 |
| ecc/e2e-testing | Playwright E2E 測試模式、Page Object Model、CI/CD 整合 |
| ecc/springboot-verification | Spring Boot 驗證循環：建置、靜態分析、測試、掃描 |
| ecc/django-verification | Django 驗證循環：遷移、linting、測試、安全掃描 |
| ecc/verification-loop | 綜合驗證系統 |
| ecc/eval-harness | 正式評估框架，實現 EDD 原則 |
| ecc/python-testing | Python 測試策略（pytest、TDD、mocking） |
| ecc/kotlin-testing | Kotlin 測試模式，使用 Kotest、MockK |
| ecc/cpp-testing | C++ 測試配置和診斷 |

### 部署與 DevOps

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/deployment-patterns | 部署工作流程、CI/CD、Docker 容器化、Health Check |
| ecc/docker-patterns | Docker 和 Docker Compose 模式，開發、網路、儲存 |
| ecc/enterprise-agent-ops | 企業級 agent 工作負載營運，可觀測性、安全界限 |

### 安全

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/security-review | 安全審查清單，用於認證、用戶輸入、機密、API 端點 |
| ecc/security-scan | Claude Code 配置安全漏洞掃描 |
| ecc/security-best-practices | 語言/框架特定安全最佳實踐審查 |
| ecc/django-security | Django 安全最佳實踐 |
| ecc/springboot-security | Spring Security 最佳實踐 |
| ecc/perl-security | Perl 安全最佳實踐 |

### AI 與 API 整合

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/claude-api | Anthropic Claude API 模式，Messages API、streaming、tool use |
| ecc/x-api | X/Twitter API 整合，推文、發布、時間線 |
| ecc/fal-ai-media | fal.ai 媒體生成（圖像、視頻、音訊） |
| ecc/videodb | 影片/音訊處理：擷取、索引、搜尋、轉碼 |
| ecc/video-editing | AI 輔助影片編輯工作流程 |
| ecc/foundation-models-on-device | Apple FoundationModels 框架，裝置上 LLM |

### 研究與搜尋

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/deep-research | 多來源深度研究，使用 firecrawl 和 exa MCPs |
| ecc/exa-search | Exa 神經搜尋，網路、程式碼、公司研究 |
| ecc/search-first | 研究優先工作流程，編碼前先搜尋現有工具 |
| ecc/market-research | 市場研究、競爭分析、投資者盡職調查 |

### 內容創作

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/content-engine | 平台原生內容系統（X、LinkedIn、TikTok、YouTube） |
| ecc/crosspost | 跨平台內容分發，適配各平台特性 |
| ecc/article-writing | 文章、部落格、教程、簡報內容撰寫 |
| ecc/investor-materials | 投資人材料創建（pitch deck、財務模型） |
| ecc/investor-outreach | 投資人外展訊息撰寫 |
| ecc/prompt-optimizer | Prompt 優化分析 |

### 專業領域知識

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/carrier-relationship-management | 承運人組合管理、費率談判、績效追蹤 |
| ecc/logistics-exception-management | 物流異常管理、貨運延遲、索賠處理 |
| ecc/customs-trade-compliance | 關務貿易合規、稅則分類、關稅優化 |
| ecc/energy-procurement | 能源採購、費率優化、需求費用管理 |
| ecc/inventory-demand-planning | 需求預測、庫存規劃、安全庫存優化 |
| ecc/production-scheduling | 生產排程、瓶頸解析、換線優化 |
| ecc/quality-nonconformance | 品質不符合管理、NCR、CAPA、SPC |
| ecc/returns-reverse-logistics | 退貨與逆向物流、退款處理、欺詐檢測 |
| ecc/visa-doc-translate | 簽證文件翻譯和雙語 PDF 創建 |

### 工具與框架

| 技能名稱 | 用途說明 |
|---------|----------|
| ecc/cost-aware-llm-pipeline | LLM API 使用成本優化，模型路由、預算追蹤 |
| ecc/iterative-retrieval | 漸進式檢索模式，解決 agent 上下文問題 |
| ecc/content-hash-cache-pattern | 內容雜湊快取模式，自動失效 |
| ecc/agent-harness-construction | AI agent 行動空間和工具定義優化 |
| ecc/nanoclaw-repl | NanoClaw v2 REPL，零依賴工作階段感知 REPL |
| ecc/dmux-workflows | 多 agent 工作流程，使用 tmux 窗格管理 |
| ecc/project-guidelines-example | 專案特定技能範本 |
| ecc/configure-ecc | ECC 互動式安裝程式 |
| ecc/continuous-learning | 從工作階段提取可重用模式 |
| ecc/continuous-learning-v2 | 直覺學習系統 v2.1，專案範圍隔離 |
| ecc/plankton-code-quality | Plankton 程式碼品質，寫入時格式化/linting |
| ecc/regex-vs-llm-structured-text | 正則表達式 vs LLM 決策框架 |
| ecc/skill-stocktake | 技能審計，品質評估 |

---

## 內建技能

| 技能名稱 | 用途說明 |
|---------|----------|
| playwright | 瀏覽器自動化，使用 Playwright MCP |
| frontend-ui-ux | 設計師轉開發者的 UI/UX 專業技能 |
| git-master | Git 操作（原子提交、rebase、歷史搜尋） |
| dev-browser | 瀏覽器自動化，持續性頁面狀態 |

---

## 其他技能

| 技能名稱 | 用途說明 |
|---------|----------|
| docs:write-concisely | 簡潔技術寫作，使文件更清晰、專業 |
| frontend-design | 生產級前端介面建立 |
| shadcn-ui | shadcn/ui 整合指導、組件發現、自訂 |
| test-driven-development | 測試驅動開發 |
| webapp-testing | 本地 Web 應用測試，使用 Playwright |
| vercel-react-best-practices | Vercel React 效能優化 |

---

## 技能調用原則

1. **AI 主動檢查**：執行任務時，系統會主動評估任務領域並加載相關技能
2. **手動指定**：用戶也可明確要求使用特定技能
3. **技能優先順序**：用戶安裝的技能優先於內建預設

---

## 相關文件

- [AGENTS.md](./AGENTS.md) - 代碼庫專用的 AI Agent 指導方針
