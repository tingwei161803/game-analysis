# 遊戲專案評分報告 · Game Project Report Card

一份**程式碼級**的第三方分析網站：把六個 GitHub 專案——craig7351（Book AI）在 36 天內用 AI 打造的五款 3D 瀏覽器遊戲，加上財團法人開放文化基金會（OCF）維護 22 個月的資安教材——逐行讀過，從**技術深度、遊戲設計、後端與安全、程式品質、測試、完成度、原創性**七大面向各給 1–10 分並算出加權總分。

> ⚠️ **這些專案都是原作者的作品，本站只是獨立、非隸屬的第三方分析。** 每個專案都在網站上連回其原始 GitHub repo 與作者，請前往支持原作。

🌐 **線上版**：<https://game-analysis.peteraim.com/>

---

## ✨ 功能特色

- **加權總分排行** — 七大面向依權重（技術/設計各 20%、後端/品質各 15%、測試/完成度/原創各 10%）即時計算總分。
- **分數矩陣熱力圖** — 6 專案 × 7 面向一眼看完，深藍＝越強，滑過任一格看細項。
- **雷達圖輪廓** — 每個專案一張雷達小圖 + 作者平均分疊圖，形狀直接顯示強項與空洞。
- **六頁深度報告** — 每個專案獨立一頁：分數卡、逐面向評語（附檔案:行號證據）、亮點、弱點、AI 輔助開發跡象、統計、總評，以及 kill-switch / prompt-injection 等特別事件。
- **作者對比 + 時間軸** — 兩種截然不同的出貨哲學（個人＋AI 極速 vs 組織營運），與 craig7351 五作品的開發時間軸。
- **評分方法頁** — 完整規準、權重理由、分析流程、外部佐證與限制聲明，全部公開讓你能反駁每個數字。
- **術語速查** — 可搜尋的技術詞彙表（thin instances、D1、限流、prompt injection…）。
- **中英文全頁切換 + 深/淺色** — 一鍵整頁切換，localStorage 記憶，預設英文。
- **零 build 純靜態** — 純 HTML/CSS/JS，無框架、無打包，直接部署 GitHub Pages。

## 📂 內容結構與資料來源

分析對象（皆為**原作者**的公開 repo，非本站作品）：

**craig7351（Book AI）依時間軸的五款遊戲**
1. [craig7351/zombie-survivors](https://github.com/craig7351/zombie-survivors) — 3D Vampire Survivors-like
2. [craig7351/fake-whiteout-survival](https://github.com/craig7351/fake-whiteout-survival) — 放置經營 × 塔防
3. [craig7351/DUCK-STRIKE](https://github.com/craig7351/DUCK-STRIKE) — 波次生存 FPS
4. [craig7351/angry-pig](https://github.com/craig7351/angry-pig) — 物理破壞投擲
5. [craig7351/angry-baseball](https://github.com/craig7351/angry-baseball) — 棒球打擊 × 物理破壞

**財團法人開放文化基金會（OCF）**
6. [ocftw/ssd](https://github.com/ocftw/ssd) — 資安防護基礎教材（<https://ssd.ocf.tw/>）

所有評語基於實際閱讀原始碼、git 歷史與部署現況（2026-07-20 查核全部 11 個公開網址皆回應 200）。分數為校準過的判斷，非量測值；規準與證據全部公開於「評分方法」頁。

```
game-analysis/
├── index.html + 9 個 .html    # hub 首頁 + 6 專案頁 + 作者/方法/術語頁（共用 shell）
├── assets/
│   ├── styles.css             # 編輯風視覺（襯線標題 + 等寬數據）+ 明暗 token
│   ├── shell.js               # 共用 chrome：app bar / 跨頁導覽 / footer / dialog
│   └── app.js                 # 版型引擎：依 data-page 選 renderer + SVG 雷達/熱力圖
├── data/
│   ├── projects.js            # 六專案的七面向評語、亮點、弱點、統計（雙語）
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
uv run playwright install chromium
uv run python scripts/verify.py --dir .
```

## 📝 聲明

- 本網站是**獨立的第三方分析**，與 craig7351（Book AI）、財團法人開放文化基金會（OCF）或任何被分析專案**無隸屬關係**。所有專案名稱、repo、商標歸各自擁有者所有。
- 分析為靜態的程式碼級體檢（非動態量測），描述的是 **2026-07-20** 受檢 commit 的狀態；repo 會前進，分數不代表未來。
- 文中提及的安全發現（如洩漏的管理密鑰）以**防禦意識**為目的呈現，是衛生課而非利用邀請。
- 本網站使用 Google Analytics 4（GA4 property：**Game Analysis - GA4**）蒐集匿名流量數據。
