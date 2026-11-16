# 遊戲專案評分報告 · Game Project Report Card

一份**程式碼級**的第三方分析網站：把十一個專案——craig7351（Book AI）在 36 天內用 AI 打造的五款 3D 瀏覽器遊戲、財團法人開放文化基金會（OCF）維護 22 個月的資安教材，兩款共用同一位設計者的台灣純文字人生模擬（YaKyoLife 棒球人生、CheerLife 啦啦隊人生），再加上三款原始碼不公開、改從線上出貨程式讀起的台灣網頁遊戲（一把入庫、議場大亂鬥、閃身步大亂鬥）——逐行讀過，從**技術深度、遊戲設計、後端與安全、程式品質、測試、完成度、原創性**七大面向各給 1–10 分並算出加權總分。

> ⚠️ **這些專案都是原作者的作品，本站只是獨立、非隸屬的第三方分析。** 每個專案都在網站上連回其原始 GitHub repo（沒有公開 repo 的則連回線上站台）與作者，請前往支持原作。

🌐 **線上版**：<https://game-analysis.peteraim.com/>

---

## ✨ 功能特色

- **加權總分排行** — 七大面向依權重（技術/設計各 20%、後端/品質各 15%、測試/完成度/原創各 10%）即時計算總分。
- **分數矩陣熱力圖** — 11 專案 × 7 面向一眼看完，深藍＝越強，滑過任一格看細項。
- **雷達圖輪廓** — 每個專案一張雷達小圖 + 作者平均分疊圖，形狀直接顯示強項與空洞。
- **十一頁深度報告** — 每個專案獨立一頁：分數卡、逐面向評語（附檔案:行號證據）、亮點、弱點、AI 輔助開發跡象、統計、總評，以及 kill-switch / prompt-injection 等特別事件。
- **作者對比 + 時間軸** — 七種截然不同的出貨哲學（個人＋AI 極速、組織營運、可量測的平衡工程、繼承格式再換皮，以及三種不公開原始碼卻各自營運線上遊戲的做法），與 craig7351 五作品的開發時間軸。
- **評分方法頁** — 完整規準、權重理由、分析流程、外部佐證與限制聲明，全部公開讓你能反駁每個數字。
- **術語速查** — 可搜尋的技術詞彙表（thin instances、D1、限流、prompt injection…）。
- **中英文各有自己的網址 + 深/淺色** — 英文在根目錄、中文在 `/zh-Hant/`，切換語言＝換一個網址（可加書籤、可分享）；深/淺色仍由 localStorage 記憶。
- **零 build 純靜態** — 純 HTML/CSS/JS，無框架、無打包，直接部署 GitHub Pages。

## 📂 內容結構與資料來源

分析對象（皆為**原作者**的作品，非本站作品；前八個是公開 repo，後三個沒有公開 repo）：

**craig7351（Book AI）依時間軸的五款遊戲**
1. [craig7351/zombie-survivors](https://github.com/craig7351/zombie-survivors) — 3D Vampire Survivors-like
2. [craig7351/fake-whiteout-survival](https://github.com/craig7351/fake-whiteout-survival) — 放置經營 × 塔防
3. [craig7351/DUCK-STRIKE](https://github.com/craig7351/DUCK-STRIKE) — 波次生存 FPS
4. [craig7351/angry-pig](https://github.com/craig7351/angry-pig) — 物理破壞投擲
5. [craig7351/angry-baseball](https://github.com/craig7351/angry-baseball) — 棒球打擊 × 物理破壞

**財團法人開放文化基金會（OCF）**
6. [ocftw/ssd](https://github.com/ocftw/ssd) — 資安防護基礎教材（<https://ssd.ocf.tw/>）

**同一條設計血脈的兩款純文字人生模擬**
7. [LeoGGcat/yakyulife](https://github.com/LeoGGcat/yakyulife) — 棒球生涯模擬（<https://www.yakyolife.com/>）
8. [jarvanthevoyager/CheerLife](https://github.com/jarvanthevoyager/CheerLife) — 啦啦隊生涯模擬（<https://jarvanthevoyager.github.io/CheerLife/>）

> 第 7、8 兩款的 README／片頭都把原創概念署名給同一位設計者（最先生 @mr.themost），本站據此把它們視為同一條設計血脈分析。

**三款找不到公開 repo、改從線上出貨程式讀起的台灣網頁遊戲**
9. 一把入庫（<https://car.aioo.tw/>）— 台灣汽車路考模擬，作者 aioo
10. 議場大亂鬥 Floor Fight（<https://lifayuan.app/>）— 立法院議場 5v5 線上亂鬥，作者 Steven Tsao
11. 閃身步大亂鬥（<https://shanshenbu.net/>）— 迷因題材的 2D 格鬥 × roguelite，未署名的獨立開發

> 第 9–11 款都找過原始 repo（頁面連結、source map、GitHub 搜尋）但沒有找到，所以分析對象是 2026-11-17 伺服器實際送到瀏覽器的檔案。三款出貨的都是未壓縮、註解完整的程式碼，仍可附行號；但伺服器端程式、測試與 git 歷史看不到，commit 數與開發天數因此標為「不明」，測試分數也設了上限。

所有評語基於實際閱讀原始碼、git 歷史與部署現況（2026-07-20 查核前六個專案的全部 11 個公開網址、2026-08-25 查核兩款人生模擬的部署，皆回應 200；2026-11-17 抓取三款無 repo 遊戲的線上站台）。分數為校準過的判斷，非量測值；規準與證據全部公開於「評分方法」頁。

```
game-analysis/
├── index.html + 14 個 .html   # hub 首頁 + 11 專案頁 + 作者/方法/術語頁（共用 shell）
├── assets/
│   ├── styles.css             # 編輯風視覺（襯線標題 + 等寬數據）+ 明暗 token
│   ├── shell.js               # 共用 chrome：app bar / 跨頁導覽 / footer / dialog
│   └── app.js                 # 版型引擎：依 data-page 選 renderer + SVG 雷達/熱力圖
├── data/
│   ├── projects.js            # 十一專案的七面向評語、亮點、弱點、統計（雙語）
│   └── data.js                # 站台 meta、權重模型、作者、方法論、術語、頁面清單
├── CNAME                      # game-analysis.peteraim.com
└── .nojekyll
```

## 🛠 本機使用

```bash
# 任一靜態伺服器即可；本專案零 build、零依賴
uv run python -m http.server 4173
# 開 http://localhost:4173/
```

測試（Playwright，逐頁檢查渲染/雙語/主題/響應式/a11y/無 console error）：

```bash
uv run --with playwright playwright install chromium
uv run --with playwright python scripts/verify.py --dir .
```

改過 `data/*.js` 之後要重烤靜態內容（每個 .html 都內建一份 JS 渲染結果給爬蟲與無 JS 訪客看，
這支腳本用真的瀏覽器重新產生它，避免兩份內容各走各的）：

```bash
uv run --with playwright python scripts/prerender.py --dir .
```

## 📝 聲明

- 本網站是**獨立的第三方分析**，與 craig7351（Book AI）、財團法人開放文化基金會（OCF）、aioo、Steven Tsao 或任何被分析專案及其作者**無隸屬關係**。所有專案名稱、repo、商標歸各自擁有者所有。
- 分析為靜態的程式碼級體檢（非動態量測）。前六個專案描述的是 **2026-07-20** 受檢 commit 的狀態，yakyulife 與 CheerLife 為 **2026-08-25**，三款無 repo 的遊戲為 **2026-11-17** 線上站台送出的內容；repo 與站台都會前進，分數不代表未來。
- 文中提及的安全發現（如洩漏的管理密鑰）以**防禦意識**為目的呈現，是衛生課而非利用邀請。
- 本網站使用 Google Analytics 4（GA4 property：**Game Analysis - GA4**）蒐集匿名流量數據。
