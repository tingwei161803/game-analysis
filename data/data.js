/* Site data: meta, pages, scoring model, authors, methodology, glossary.
   Pure data — rendering logic lives in assets/app.js. */

window.SITE_META = {
  title: { en: "Game Project Report Card", zh: "遊戲專案評分報告" },
  subtitle: {
    en: "Twenty projects · seven dimensions · fifteen authors — a code-level audit",
    zh: "二十個專案 × 七大面向 × 十五位作者的程式碼級深度分析"
  },
  repo: "tingwei161803/game-analysis"
};

/* Weighted-total model. Weights sum to 1; totals are computed in app.js. */
window.GA_WEIGHTS = {
  tech: 0.20, design: 0.20, backend: 0.15, quality: 0.15,
  testing: 0.10, completeness: 0.10, originality: 0.10
};

window.GA_DIMS = [
  { key: "tech", icon: "memory", label: { en: "Technical Depth", zh: "技術深度" },
    desc: { en: "Engine & rendering technique, performance engineering (instancing, pooling, spatial structures), algorithmic substance, architectural difficulty.", zh: "引擎與渲染技術、效能工程（instancing、物件池、空間結構）、演算法含金量、架構難度。" } },
  { key: "design", icon: "stadia_controller", label: { en: "Game Design", zh: "遊戲設計" },
    desc: { en: "Core loop, balance, progression, game feel, UI/UX. For the non-game project (ssd) this dimension is scored as Content & Pedagogy.", zh: "核心玩法循環、平衡、進程系統、手感、UI/UX。非遊戲專案（ssd）以「內容／教學設計」評此面向。" } },
  { key: "backend", icon: "security", label: { en: "Backend & Security", zh: "後端與安全" },
    desc: { en: "API design, database, anti-cheat, rate limiting, secret hygiene, input validation — or deployment security posture for static sites.", zh: "API 設計、資料庫、防作弊、限流、密鑰衛生、輸入驗證——靜態網站則評部署安全實務。" } },
  { key: "quality", icon: "code", label: { en: "Code Quality", zh: "程式品質" },
    desc: { en: "Architecture, modularity, naming, type discipline, duplication, magic numbers.", zh: "架構、模組化、命名、型別紀律、重複程度、magic numbers。" } },
  { key: "testing", icon: "experiment", label: { en: "Testing", zh: "測試" },
    desc: { en: "Automated test existence and coverage, assertions, CI. No tests at all scores 1–2.", zh: "自動化測試的存在與覆蓋、斷言、CI。完全沒有測試給 1–2 分。" } },
  { key: "completeness", icon: "verified", label: { en: "Completeness", zh: "完成度" },
    desc: { en: "Playability/usability, polish, documentation, deployment status, audio & art coverage.", zh: "可玩性／可用性、打磨程度、文件、部署狀態、音效美術完整性。" } },
  { key: "originality", icon: "emoji_objects", label: { en: "Originality", zh: "原創性" },
    desc: { en: "How much is genuinely new versus a copy of existing games or content — judged on mechanics and substance, not theme alone.", zh: "相對既有遊戲／內容有多少真正的新東西——以機制與實質內容評斷，不只看題材皮相。" } }
];

window.GA_AUTHORS = {
  craig7351: {
    key: "craig7351", color: "s1",
    name: { en: "craig7351 (Book AI)", zh: "craig7351（Book AI）" },
    type: { en: "Solo developer + AI pair", zh: "個人開發者＋AI 結對" },
    url: "https://github.com/craig7351",
    profile: [
      { en: "Five 3D browser games shipped in **36 days** (2026-06-12 → 07-18), every one deployed live with a real Cloudflare D1 backend — leaderboards, message boards, online-presence charts. 248 commits, ~29k lines of hand-written code, and effectively 100% of commits co-authored by Claude (Opus 4.8 for the first four, **Fable 5** for the fifth).",
        zh: "**36 天**內連發五款 3D 瀏覽器遊戲（2026-06-12 → 07-18），每一款都真實部署且有 Cloudflare D1 後端——排行榜、留言板、在線人數圖表。248 個 commit、約 2.9 萬行手寫程式碼，幾乎 100% commit 由 Claude 共同署名（前四作 Opus 4.8、第五作 **Fable 5**）。" },
      { en: "The signature workflow: a human directing design, verifying on real devices and handling real-world constraints (free-tier quotas, iOS quirks), while the AI produces code at burst cadence — 63 commits in a single day at peak. The repos double as artifacts of this workflow: reskin playbooks, READMEs written for 'the next AI', a custom Claude skill, even a prompt-injection incident report.",
        zh: "招牌工作流：人主導設計、真機驗證、處理真實世界限制（免費額度、iOS 怪癖），AI 以爆量節奏產碼——高峰單日 63 個 commit。repo 本身就是這套工作流的文物：換皮 playbook、寫給「下一個 AI」的 README、自製 Claude skill、甚至 prompt injection 事件報告。" },
      { en: "Consistent strengths: completeness and game feel, plus unusually mature free-tier cost engineering. Consistent debts: zero-to-minimal testing, god-file architecture, and a recurring weak-password signature ('0501') that leaks into public repos.",
        zh: "穩定強項：完成度與手感，外加超齡的免費額度成本工程。穩定債務：測試趨近於零、god file 架構，以及一再洩進公開 repo 的弱密碼簽名（「0501」）。" }
    ]
  },
  ocf: {
    key: "ocf", color: "s2",
    name: { en: "Open Culture Foundation (OCF)", zh: "財團法人開放文化基金會（OCF）" },
    type: { en: "Nonprofit organization", zh: "非營利組織" },
    url: "https://github.com/ocftw",
    profile: [
      { en: "One project maintained over **22 months** (2024-09 → 2026-07): a digital-security curriculum for Taiwanese civil-society organizations, run as institutional infrastructure — shared org account, PR reviews with issue references, issue templates, deploy-branch strategy, scoped tokens, CC-BY 4.0 licensing.",
        zh: "一個專案維護 **22 個月**（2024-09 → 2026-07）：給台灣公民團體的資安教材，以制度性基礎設施的方式營運——組織共用帳號、引用 issue 的 PR 審核、issue 模板、部署分支策略、最小權限 token、CC-BY 4.0 授權。" },
      { en: "Where the solo author optimizes for velocity, OCF optimizes for continuity and audience fit: written editorial rules, a policy template mapped to Taiwanese NGO governance, Tor access for at-risk users — and a late-2026 burst that quietly added a 7,600-line 3D teaching game.",
        zh: "個人作者最佳化的是速度，OCF 最佳化的是延續性與受眾適配：明文寫作規範、貼合台灣 NGO 治理的政策範本、給高風險使用者的 Tor 管道——以及 2026 年中悄悄加入的 7,600 行 3D 教學遊戲。" }
    ]
  },
  leoggcat: {
    key: "leoggcat", color: "s4",
    name: { en: "Leo Chang · 最先生 (LeoGGcat)", zh: "Leo Chang・最先生（LeoGGcat）" },
    type: { en: "Solo creator + collaborator + AI", zh: "個人創作者＋協作者＋AI" },
    url: "https://github.com/LeoGGcat",
    profile: [
      { en: "One game, **18 consecutive days**, 267 commits and 32 released versions (2026-08-07 → 08-24) — a text-only Taiwanese baseball career sim shipped on its own domain as an installable PWA. The workflow is a hybrid no other author here uses: the owner (credited in-game as 最先生 Mr.TheMost) directs design, a second developer contributes through pull requests, and Claude is the commit author on 39 commits and co-signs 30 more.",
        zh: "一款遊戲、**連續 18 天**、267 個 commit、32 個發布版本（2026-08-07 → 08-24）——一款純文字的台灣棒球生涯模擬，上線於自有網域且可安裝為 PWA。它的工作流是本站其他作者都沒有的混合體：擁有者（遊戲內署名最先生 Mr.TheMost）主導設計、第二位開發者以 pull request 貢獻，Claude 則是 39 個 commit 的作者、另共同署名 30 個。" },
      { en: "The signature is measurement. Balance is not tuned by feel but re-derived from full-flow Monte Carlo runs — thousands of simulated careers used first to prove the old Hall-of-Fame thresholds were mathematically unreachable, then to re-anchor the whole ladder to explicit population targets. The code carries the same habit: comments justify decisions with numbers (contrast ratios, measured season counts, surgery frequencies) instead of restating what the line does.",
        zh: "招牌是量測。平衡不是靠手感調，而是用完整流程的蒙地卡羅重新推導——上千段模擬生涯先證明舊的名人堂門檻在數學上走不到，再把整條階梯重新錨定到明確的母體目標。程式碼帶著同一個習慣：註解用數字（對比度、實測球季場次、動刀頻率）替決策辯護，而不是複述那行在做什麼。" },
      { en: "Consistent strengths: domain-modelling depth, comment quality and product-grade finish (four themes, PWA, share card, wiki, changelog). Consistent debts: no tests, no CI, a calibration harness that never entered the repository, and 173 hand-maintained cache-bust tokens standing in for a build step.",
        zh: "穩定強項：領域模型的深度、註解品質，以及產品級的完成度（四種佈景、PWA、分享卡、wiki、更新日誌）。穩定債務：無測試、無 CI、校準工具始終沒進 repo，以及用 173 個手動維護的 cache-bust token 代替建置流程。" }
    ]
  },
  jarvanthevoyager: {
    key: "jarvanthevoyager", color: "s3",
    name: { en: "jarvanthevoyager", zh: "jarvanthevoyager" },
    type: { en: "Solo producer, borrowed format", zh: "個人製作人・沿用既有格式" },
    url: "https://github.com/jarvanthevoyager",
    profile: [
      { en: "One game in a single 3,500-line HTML file, published through the GitHub web UI in 17 commits across four days — 'Add files via upload', 'Update index.html'. That history is therefore not a development history at all: the work happened off-platform, and the artifact is the only evidence of how it was built.",
        zh: "一款遊戲，裝在單一 3,500 行的 HTML 檔裡，透過 GitHub 網頁介面在四天內以 17 個 commit 發布——「Add files via upload」「Update index.html」。所以這份歷史根本不是開發歷史：工作發生在平台之外，成品本身是唯一的建構證據。" },
      { en: "The README credits the original concept to 最先生 (@mr.themost) — the designer behind YaKyoLife. This is a format handed to a second producer: the same seeded-life chassis re-skinned onto cheer-squad careers, a subject with no obvious prior example. What the producer adds is output discipline (consistent escaping, cookieless analytics, a documented storage table) and the audit's only shipped integrity checker.",
        zh: "README 把原創概念署名給最先生（@mr.themost）——YaKyoLife 背後的設計者。這是把格式交給第二位製作人：同一副種子化人生的底盤，換皮到啦啦隊生涯這個找不到明顯前例的題材上。製作人加上去的是輸出紀律（一致的跳脫、無 cookie 的流量統計、附上儲存鍵表格），以及全站唯一有出貨的完整性檢查器。" },
      { en: "The trade-off is legibility and provenance: one global scope holding 131 top-level functions, documentation that has drifted from the build (stale counts, three broken links, a licence badged but absent), and balance argued by observation where the sibling project argues by simulation.",
        zh: "代價是可讀性與來源可追溯性：單一全域作用域塞著 131 個頂層函式、文件已與 build 脫節（數字過期、三個壞連結、授權有徽章卻沒檔案），以及在姊妹作用模擬論證平衡的地方，這裡只能用觀察論證。" }
    ]
  },
  aioo: {
    key: "aioo", color: "s5",
    name: { en: "aioo", zh: "aioo" },
    type: { en: "Solo creator, closed source", zh: "個人創作者・原始碼不公開" },
    url: "https://aioo.tw/",
    profile: [
      { en: "A run of small browser games published under a single pen name, with no repository, no licence and no real name attached. Two are audited here, and they overlap in time: the scooter-test site went from 2.5.0 to 2.8.1 in **seven days** (2026-11-09 → 11-15) and grew two further games along the way, while the car-test game went from 0.1.0 to 0.1.29 in **four days** inside that same week (2026-11-10 → 11-13), seventeen of those releases on a single day. Every release is described in an in-game changelog written for players.",
        zh: "以同一個筆名發表的一系列小型瀏覽器遊戲，沒有 repo、沒有授權、也沒有掛真名。這裡受檢的有兩款，而且時間是重疊的：機車路考的站在**七天內**從 2.5.0 走到 2.8.1（2026-11-09 → 11-15），途中還多長出兩款遊戲；汽車路考則在同一週內的**四天**從 0.1.0 走到 0.1.29（2026-11-10 → 11-13），其中十七個版本在同一天發出。每一版都寫進給玩家看的遊戲內更新紀錄。" },
      { en: "The signature is tuning from data and saying so. Comments quote the pass rate that motivated each change, mark every number the government did not publish as a 'game setting', and describe a simulated pupil with a reaction delay used to sweep difficulty. The code is shipped unminified as plain ES modules, so all of that reasoning is readable in the browser.",
        zh: "招牌是用數據調整，而且把數據寫出來。註解引用促成每次修改的通過率、把政府沒公布的每個數字標成「game setting」，還描述了一個有反應延遲、用來掃描難度的模擬學員。程式以未壓縮的 ES module 原樣出貨，所以這些推理在瀏覽器裡全都讀得到。" },
      { en: "The debt is verifiability, and it is the same in both: tests and server code are named in comments but stay private. The second debt is what speed does to shared code. The car game was forked from the scooter game, and the scooter site's own three modes share by copying — three copies of one MP4 muxer, kept in step by hand.",
        zh: "債務是可查核性，而且兩款都一樣：測試與伺服器端程式只在註解裡有名字，本身並不公開。第二筆債是速度對共用程式碼造成的後果。汽車那款是從機車那款 fork 出來的，而機車站自己的三個模式也是靠複製來共用——同一支 MP4 muxer 有三份，靠手動維持一致。" }
    ]
  },
  steventsao: {
    key: "steventsao", color: "s6",
    name: { en: "Steven Tsao", zh: "Steven Tsao" },
    type: { en: "Solo developer + agents, live service", zh: "個人開發者＋agent・營運中的服務" },
    url: "https://lifayuan.app/sources",
    profile: [
      { en: "One online game run as a service: a domain registered on 2026-10-18 and version tags up to v57.57 a month later, with quick match, rooms, chat, replays and a bilingual interface. The credit is on the game's own sources page; there is no public repository.",
        zh: "一款以服務方式營運的線上遊戲：網域在 2026-10-18 註冊，一個月後版本標記已到 v57.57，有快速配對、房間、聊天、回放與雙語介面。署名寫在遊戲自己的史料頁上；沒有公開的 repo。" },
      { en: "The working style shows in the comments: an 'owner' is quoted giving instructions, agents are described adding content by 'read an example, draft, check, fix, submit', and fixes are justified with telemetry — a date, a count, a device. The same care extends outward: election-law windows are coded into the game, and the parody roster ships with a 235-link bibliography and a takedown contact.",
        zh: "工作方式寫在註解裡：有一位「owner」被引述下指示，agent 被描述成以「read an example, draft, check, fix, submit」的方式新增內容，修正則用遙測來論證——一個日期、一個次數、一種機型。同樣的謹慎也向外延伸：選舉法規的時間窗被寫進遊戲，戲仿角色名單則附上 235 個連結的參考書目與下架聯絡方式。" },
      { en: "Strongest on netcode and deployment hardening; weakest where nothing can be inspected — server workers, check scripts, a licence — and in a global-scope client that still ships a mode it retired.",
        zh: "最強的是連線與部署加固；最弱的是無從檢視的地方——伺服器端的 worker、檢查腳本、一份授權——以及一個到現在還出貨著已退役模式的全域作用域客戶端。" }
    ]
  },
  shanshenbu: {
    key: "shanshenbu", color: "s7",
    name: { en: "Shanshenbu Brawl developers", zh: "閃身步大亂鬥 開發者" },
    type: { en: "Unsigned indie, closed source", zh: "未署名的獨立開發・原始碼不公開" },
    url: "https://shanshenbu.net/about",
    profile: [
      { en: "An unsigned project — the site says only 'independent development' and speaks as 'we' — that went live in October 2026 and within about four weeks had ranked play, a shop, cloud saves, an Android wrapper and four separate environments. There is no repository and no licence.",
        zh: "一個沒有署名的專案——網站只寫「獨立開發」、用「我們」自稱——2026 年 10 月上線，大約四週內就有了排位、商城、雲端存檔、Android 殼與四個分開的環境。沒有 repo，也沒有授權。" },
      { en: "The method is the opposite of tidy: everything is one 21,725-line HTML file, but that file is annotated like a logbook, with dated fixes, error counts, before-and-after measurements and the team's own security findings. Some comments are tagged as the result of an AI review, and several are signed with short handles whose nature cannot be determined.",
        zh: "做法與整潔相反：全部塞在一個 21,725 行的 HTML 檔裡，但那個檔案被註解得像一本航海日誌，有標了日期的修正、錯誤次數、修改前後的量測，以及團隊對自己做出的資安發現。有些註解標明是 AI 審查的結果，還有幾則以簡短的代號署名，那些代號的性質無從判斷。" },
      { en: "Highest technical ambition in the audit — rollback netcode, trained opponents, procedural animation — paired with its lowest structural discipline, and a ranked ladder that seats bots as players without saying so.",
        zh: "本次體檢技術野心最高——rollback 連線、訓練出來的對手、程序化動畫——搭配的卻是最低的結構紀律，以及一個讓電腦以玩家身分入座卻沒有說明的排位賽。" }
    ]
  },
  andrewhuang: {
    key: "andrewhuang", color: "s8",
    name: { en: "Andrew Huang, MD", zh: "Andrew Huang, MD" },
    type: { en: "Individual creator, submitted for audit", zh: "個人創作者・主動投稿受檢" },
    url: "https://andrewshhuang.com/",
    profile: [
      { en: "One short game published under the projects section of a personal site titled 'Andrew Huang, MD — Medicine, AI & Ideas'. It is the only project in this report that asked to be here: an issue on this site's repository described the game, offered a self-assessment and invited a comparison. There is no repository; the three scripts are served unminified.",
        zh: "一款短篇遊戲，發表在個人網站「Andrew Huang, MD — Medicine, AI & Ideas」的 projects 區。它是本報告中唯一主動要求受檢的專案：本站 repo 上的一則 issue 介紹了遊戲、附上自評，並邀請比對。沒有 repo；三支 script 以未壓縮的形式送出。" },
      { en: "The signature is restraint. A 929-line engine that touches neither the DOM nor the network, an interface that only draws what the engine reports, and a title screen that promises to collect no data — a promise the code keeps. The subject is drawn from life: block exams, shared lecture notes, roll calls and past papers, written by someone who evidently sat them.",
        zh: "招牌是節制。一顆 929 行、既不碰 DOM 也不碰網路的引擎；一個只把引擎回報的東西畫出來的介面；以及在標題畫面承諾不蒐集任何資料——而程式確實做到了。題材取自生活：區段考、共筆、點名與考古題，寫的人顯然自己考過。" },
      { en: "The debts are the ones a small solo project usually carries: no tests despite an engine built to be tested, balance set by hand, a security policy that is declared but not enforced, and credit owed — and given — for the walk-and-interact presentation and the generated illustrations.",
        zh: "債務是小型個人專案常見的那幾樣：引擎明明是為了可測試而寫，卻沒有測試；平衡靠手調；資安政策有宣告但沒有強制執行；而「走動互動」的呈現方式與生成的插畫都另有出處——它也都註明了。" }
    ]
  },
  mcltyl: {
    "key": "mcltyl",
    "color": "s9",
    "name": {
      "en": "mcltyl",
      "zh": "mcltyl"
    },
    "type": {
      "en": "Solo author + AI",
      "zh": "個人作者＋AI"
    },
    "url": "https://github.com/mcltyl",
    "profile": [
      {
        "en": "The game is unsigned: its pages say only that it is 'a personal work by one author together with AI, not any company's product', and link a Threads account, **@mrclty**. The engine's licence names the copyright holder as **mcltyl**, whose GitHub profile reads 'Marcel' with the bio 'Software PM'. That account holds 45 public repositories; apart from the engine they are almost all small 'agent skill' packages created in March and April 2026.",
        "zh": "這款遊戲沒有署名：頁面上只說它是「一位作者跟 AI 一起做的個人作品，不是任何公司的產品」，並連到一個 Threads 帳號 **@mrclty**。引擎的授權把著作權人寫成 **mcltyl**，這個 GitHub 帳號的個人檔案顯示名稱是「Marcel」，簡介是「Software PM」。帳號底下有 45 個公開 repo；除了引擎之外，幾乎都是 2026 年 3、4 月建立的小型「agent skill」套件。"
      },
      {
        "en": "fab24hr launched on **4 October 2026** and by mid-November had four languages, 36 playable roles, a 13-chapter story and a teaching site of several hundred pages. The author asks for support through a tip link and says the money pays for AI usage; the site carries no ads. The engine was split out and published eleven days after launch, with three of its four commits authored by Claude.",
        "zh": "fab24hr 在 **2026 年 10 月 4 日**上線，到 11 月中已經有四個語言、36 個可以玩的角色、13 章的主線，以及一個數百頁的教學網站。作者透過贊助連結請大家支持，並說這筆錢用來付 AI 的使用費；網站沒有廣告。引擎在上線十一天後被抽出來公開，四個 commit 裡有三個的作者是 Claude。"
      },
      {
        "en": "The pattern across what can be seen: product thinking ahead of code style — a privacy statement that matches the client line by line, a licence enforced by the build and the tests, documentation aimed at AI tools — with the game's own source, tests and server kept private.",
        "zh": "從看得到的東西歸納出來的樣子：產品思維走在程式風格前面——一份和客戶端逐項對得上的隱私說明、一份由建置與測試強制執行的授權、寫給 AI 工具看的文件——而遊戲自己的原始碼、測試與伺服器都不公開。"
      }
    ]
  },
  koritsulab: {
    "key": "koritsulab",
    "color": "s10",
    "name": {
      "en": "Kōritsu Lab (Ion)",
      "zh": "Kōritsu Lab（Ion）"
    },
    "type": {
      "en": "Small studio",
      "zh": "小型工作室"
    },
    "url": "https://koritsulab.com/about/",
    "profile": [
      {
        "en": "Kōritsu Lab (効率) describes itself as a small studio founded in Taipei in **2026** that makes interactive works and tools. Its site lists six free browser games — an investing game on historical prices, a career game set in the advertising industry, this election game, an arcade cooking game, a typhoon battle-top game and a political-parody survival game — and a journal of twenty posts, each signed **Ion**, the studio's creator, with publication and update dates.",
        "zh": "Kōritsu Lab（効率）自述是 **2026** 年在台北成立的小工作室，做互動作品和工具。網站上列出六款免費的網頁遊戲——用歷史價格做的投資遊戲、以廣告業為背景的職涯遊戲、這款選舉遊戲、街機式的料理遊戲、颱風戰鬥陀螺，以及一款政治趣味的生存遊戲——還有二十篇札記，每一篇都署名 **Ion**（工作室的創作者），並標示發布與更新日期。"
      },
      {
        "en": "The studio states its practices in public: the about page says AI tools assist with code and text and that everything is reviewed before publication; a disclaimer page separates entertainment from prediction for its finance, weather and political titles; each game has its own privacy policy. For this game the journal explains the design motive (a time budget that cannot be met, a vow rewritten in red) and a lesson learned from comparing simulated and real win rates.",
        "zh": "工作室把自己的做法寫在公開頁面上：關於頁說明製作時使用 AI 工具輔助撰寫程式與文稿、發布前都會審閱；免責聲明頁替金融、氣象與政治題材的作品劃清娛樂與預測的界線；每款遊戲有自己的隱私權政策。針對這款遊戲，札記說明了設計動機（永遠不夠用的時間預算、被紅筆改寫的初心），以及一次比較模擬勝率與真實玩家勝率之後學到的事。"
      },
      {
        "en": "Judged from this one title: strong on systems design, writing volume and finish, disciplined TypeScript with a pure core, and careful, well-disclosed data handling. The recurring limit is verifiability — no public repository, tests, simulator or server code — together with a deployment that omits common security headers while publishing full source maps.",
        "zh": "只就這一款作品來看：強項是系統設計、文字量與完成度，TypeScript 寫得有紀律、核心是純的，資料處理仔細而且交代清楚。反覆出現的限制是可查核性——沒有公開的 repository、測試、模擬器或伺服器程式——以及部署上少了常見的安全 header，卻又公開了完整的 source map。"
      }
    ]
  },
  draftmylife: {
    "key": "draftmylife",
    "color": "s11",
    "name": {
      "en": "Draft My Life (operator unsigned)",
      "zh": "人生草稿（經營者未署名）"
    },
    "type": {
      "en": "Unsigned commercial operator, closed source",
      "zh": "未署名的商業經營者・原始碼不公開"
    },
    "url": "https://draftmylife.com/terms",
    "profile": [
      {
        "en": "No person is named anywhere. The terms give the operator as 'Draft My Life' with a support mailbox, in-game text speaks as 'the editorial desk', and the only outside presence the code points to is a Threads account. There is no public repository and no licence; a GitHub search by name, domain and storage-key strings found nothing.",
        "zh": "任何地方都沒有出現人名。服務條款把經營者寫成「人生草稿」並附客服信箱，遊戲內的文字以「編輯部」自稱，程式指向的唯一對外管道是一個 Threads 帳號。沒有公開的 repo，也沒有授權；以名稱、網域與儲存鍵字串在 GitHub 搜尋都沒有結果。"
      },
      {
        "en": "The dated comments run from 2026-09-14 to 2026-11-17, and in that time the project went from a closed test to a paid service with accounts, payments, subscriptions, legal pages and a second chapter. The comments read like minutes: each change cites a design-document section, a date and whether 'the user' has confirmed it, and many say the decision was delegated to Claude.",
        "zh": "標了日期的註解從 2026-09-14 到 2026-11-17，這段時間裡專案從封測走到有帳號、金流、訂閱、法律頁面與第二個篇章的付費服務。註解讀起來像會議紀錄：每一項改動都標著設計文件章節、日期，以及「使用者」是否已確認，其中不少寫明這項決定交給 Claude 判斷。"
      },
      {
        "en": "The signature is distrust of its own narrator, turned into mechanism: outcomes rolled in code, replies classified and counted. The debts are a single enormous file, a test suite and a server that outsiders cannot see, and numbers the code itself still labels as test values.",
        "zh": "招牌是對自己的敘事者不信任，並把這份不信任做成機制：結果由程式擲出，回覆被分類、被計數。債務則是一支巨大的單一檔案、外人看不到的測試套件與伺服器，以及程式自己仍標為測試值的數字。"
      }
    ]
  },
  emberlin0631: {
    "key": "emberlin0631",
    "color": "s12",
    "name": {
      "en": "Emberlin0631",
      "zh": "Emberlin0631"
    },
    "type": {
      "en": "Solo creator + AI pair",
      "zh": "個人創作者＋AI 結對"
    },
    "url": "https://github.com/Emberlin0631",
    "profile": [
      {
        "en": "A GitHub account with four public repositories, all created between 2026-10-16 and 2026-11-07, of which this game is the first. The game itself is unsigned: the page credits no one and refers only to 'the game's maker'. The live site runs on a Cloudflare Workers subdomain under a different handle; nothing published says how the two relate.",
        "zh": "一個有四個公開 repo 的 GitHub 帳號，全都建立於 2026-10-16 到 2026-11-07 之間，這款遊戲是第一個。遊戲本身沒有署名：頁面上沒有任何製作名單，只提到「遊戲製作者」。線上版本掛在另一個代號底下的 Cloudflare Workers 子網域；公開的資料裡沒有說明兩者的關係。"
      },
      {
        "en": "The working pattern visible in this one repository: a first upload through the GitHub web page, then 61 commits in ten days authored under Claude's identity from a single long session — 40 of them on one day — each a small, described change. The README reads as a running log of requests and decisions, including clinical wording adjusted 'per the user's review'.",
        "zh": "從這一個 repo 看得到的工作方式：先從 GitHub 網頁上傳第一版，接著十天內有 61 個以 Claude 身分署名、出自同一個長 session 的 commit——其中 40 個集中在同一天——每一個都是有說明的小改動。README 讀起來像一份持續更新的需求與決策紀錄，其中包括「依使用者審核」調整的臨床措辭。"
      },
      {
        "en": "On the evidence of one project: strong domain content, a habit of explaining to the player why an answer was right, and care about not collecting data. The debts are a single very large file, source and tests kept outside the public repository, and a deployment that publishes the project folder as it is.",
        "zh": "就這一個專案的證據來看：專業內容紮實、習慣向玩家解釋答案為什麼對，也在意不蒐集資料。欠下的是一個非常大的單一檔案、放在公開 repo 之外的原始碼與測試，以及把專案資料夾原封不動發佈出去的部署方式。"
      }
    ]
  },
  yinluren: {
    "key": "yinluren",
    "color": "s13",
    "name": {
      "en": "引路人 · 小林老師 (education_writing)",
      "zh": "引路人・小林老師（education_writing）"
    },
    "type": {
      "en": "Individual educator-creator",
      "zh": "個人教育工作者／創作者"
    },
    "url": "https://education-writing-ai.netlify.app/",
    "profile": [
      {
        "en": "The game is signed '引路人 education_writing' and links to a personal site and an Instagram account of the same name. That site introduces the author as 小林老師, a serving senior-high resource-class teacher who writes plain-language guides on autism, ADHD, emotional and behavioural needs and inclusive education for mainstream teachers and parents. No personal name is published, and none is used here.",
        "zh": "遊戲的署名是「引路人 education_writing」，並連到同名的個人官網與 Instagram 帳號。官網介紹作者是小林老師，現職高中資源班教師，為普通班老師與家長撰寫自閉症、ADHD、情緒行為與融合教育的白話指南。作者沒有公開本名，這裡也不使用。"
      },
      {
        "en": "The site's resource list links to **more than a dozen small web tools** on the same host — a teacher salary calculator, a pension estimator, a personality quiz, a fifteen-lesson social-skills course and others — with this game pinned in a 'game' category. Only the game was read for this report card; the other tools and the site itself were not audited, and no public code repository was found for any of them.",
        "zh": "官網的資源列表連到同一家主機上的**十多個小型網頁工具**——教師薪資試算、退休金估算、人格測驗、十五堂社交技巧課等等——這款遊戲被釘選在「遊戲」分類裡。這份體檢只讀了遊戲本身；其他工具與官網都沒有受檢，也找不到其中任何一個的公開程式碼 repo。"
      },
      {
        "en": "On the evidence of this one game: strong domain knowledge turned directly into rules and prose, a preference for single self-contained files, and no visible engineering process — no tests, no versioned history, no changelog beyond a 'v9' in a comment.",
        "zh": "就這一款遊戲來看：紮實的領域知識被直接轉成規則與文字，偏好單一、自足的檔案，看不到工程流程——沒有測試、沒有版本歷史，除了註解裡的一個「v9」之外也沒有更新紀錄。"
      }
    ]
  },
  mochiparty: {
    "key": "mochiparty",
    "color": "s14",
    "name": {
      "en": "Mochi Party (unsigned)",
      "zh": "麻糬派對營運團隊（未署名）"
    },
    "type": {
      "en": "Individual developer running a live service (self-described)",
      "zh": "營運線上服務的個人開發者（自述）"
    },
    "url": "https://mochiparty.app/support",
    "profile": [
      {
        "en": "The game is unsigned. Its support, privacy and terms pages name the operator as the Mochi Party operations team and describe it in parentheses as an individual developer (`support.html:20`); no personal name, studio site or public repository is linked. Comments in the code refer to a person called Ray who reports bugs from real devices and makes product decisions, but the site does not present that name as a credit.",
        "zh": "遊戲沒有署名。客服、隱私權政策與服務條款頁把營運者寫成「麻糬派對營運團隊」，並在括號裡說明是個人開發者（`support.html:20`）；沒有連到任何個人姓名、工作室網站或公開 repository。程式註解裡提到一位名叫 Ray 的人，在真機上回報問題並決定產品方向，但網站沒有把這個名字當作署名呈現。"
      },
      {
        "en": "What the artifact shows about how they work: a written contract document that client and server both cite by section, notes files for bandwidth, payments, security and the iOS app, parallel work lanes with letter names, and a habit of dating decisions in comments — the dated ones run from 2026-09-28 to 2026-11-03. The server moved from Go to Rust at some point before the current build.",
        "zh": "成品透露的工作方式：一份客戶端與伺服器都依章節引用的契約文件，流量、金流、資安與 iOS App 各有筆記檔，以字母命名的平行工作線，以及在註解裡替決定標日期的習慣——有日期的註解從 2026-09-28 到 2026-11-03。伺服器在目前這個版本之前的某個時間點從 Go 改寫成 Rust。"
      },
      {
        "en": "Consistent strengths on this evidence: operational realism (store review rejections, minors' spending caps, ban appeals and data retention are all handled in code and in policy) and unusually careful mobile networking. Consistent debts: delivery without a build step, and prototype-era structure that the product has outgrown.",
        "zh": "就這些證據來看的穩定強項：營運上的務實（商店審查退件、未成年消費上限、停權申訴與資料保存期限，在程式與政策兩邊都有處理），以及少見地細緻的行動網路處理。穩定債務：沒有建置步驟的交付，以及產品已經長大、結構卻還停在原型時期。"
      }
    ]
  },
  hryjosn: {
    "key": "hryjosn",
    "color": "s15",
    "name": {
      "en": "Henry (hryjosn)",
      "zh": "Henry（hryjosn）"
    },
    "type": {
      "en": "Solo developer",
      "zh": "個人開發者"
    },
    "url": "https://github.com/hryjosn",
    "profile": [
      {
        "en": "The About page is signed by Henry, an engineer in Taiwan, who says the questions, the code and the pixel-art sofa are all their own work, and that the site was made alone after a plan to collaborate fell through. The page links a Threads account and the GitHub profile `hryjosn`, where the game's source is not public; the only related repository there is the uptime monitor for this site.",
        "zh": "關於頁署名 Henry，是一位台灣的工程師，自述題目、程式與那張像素沙發都是自己做的，原本想找人合作沒有成，之後就一個人做。頁面連到 Threads 帳號與 GitHub 帳號 `hryjosn`，遊戲的原始碼沒有公開在那裡；唯一相關的 repo 是這個站的 uptime 監控。"
      },
      {
        "en": "The earliest dated public mention listed on the site is press and forum coverage from 2 September 2026; by the fetch date the statistics page counted 573,363 completed free rounds. In that span the site grew from one girlfriend-edition quiz to four editions, several modes and two side quizzes. The author also names another project, a blind-ballot site for Taiwan's 2026 local elections, and a new app in development.",
        "zh": "站上列出最早有日期的公開提及，是 2026 年 9 月 2 日的媒體與論壇討論；到抓取當天，統計頁累計了 573,363 局打完的自由局。這段期間，這個站從一份女友版測驗長成四個版本、多種模式與兩個支線測驗。作者另外提到自己的其他作品：一個針對台灣 2026 年地方選舉、把候選人資訊蓋起來的投票站，以及一款開發中的新 App。"
      },
      {
        "en": "The working habit that shows through is measurement followed by explanation. Reports and answer distributions decide what gets rewritten, and the reasoning is published as long notes in two languages. The site carries ads, session recording and a sponsorship page, all disclosed. Consistent debts, as far as an outsider can see: nothing public to verify the tests or the server with.",
        "zh": "透出來的工作習慣是先量測、再解釋。回報與作答分佈決定哪些題目要重寫，理由則寫成兩種語言的長文公開。站上有廣告、畫面錄製與贊助頁，全都有揭露。就外人看得到的範圍，穩定的債務是：沒有任何公開的東西可以用來查核測試或伺服器。"
      }
    ]
  }
};

/* Methodology page content */
window.GA_METHOD = {
  rubric: [
    { range: "1–3", label: { en: "Amateur / serious problems", zh: "業餘／有嚴重問題" } },
    { range: "4–5", label: { en: "Works, but rough", zh: "可運作但粗糙" } },
    { range: "6–7", label: { en: "Solid, well-executed", zh: "紮實良好" } },
    { range: "8–9", label: { en: "Professional grade", zh: "專業水準" } },
    { range: "10", label: { en: "Industry-leading", zh: "業界頂尖" } }
  ],
  weightsWhy: {
    en: "Technical depth and design carry the most weight (20% each) because they define what a game *is*; backend/security and code quality (15% each) determine whether it survives contact with real users; testing, completeness and originality (10% each) round out the health check. The weighted total is computed live from the per-dimension scores — change one score and the total follows.",
    zh: "技術深度與遊戲設計權重最高（各 20%），因為它們定義一款遊戲「是什麼」；後端安全與程式品質（各 15%）決定它接觸真實使用者後能不能活下來；測試、完成度、原創性（各 10%）補完整體健檢。加權總分由各面向分數即時計算——改一個分數總分就跟著變。"
  },
  process: [
    { en: "**Full clone, full history — where a repository exists.** Nine projects have a public repository and were cloned with git history; commit timelines, authorship and cadence were analyzed alongside the code. The other eleven publish no source for the game itself, so every file the live site serves to a browser was downloaded and read instead. Most of those ship unminified code with comments intact, so the reading is still line-level. Where the build is minified, the audit says so and cites a file plus a searchable snippet instead of a line number; where the site also serves source maps with the original sources embedded (Weight of a Vote), those originals were read.", zh: "**完整 clone、完整歷史——在有 repo 的前提下。**有九個專案有公開的 repo，連同 git 歷史一起 clone；commit 時間軸、署名與節奏與程式碼一併分析。其餘十一個沒有公開遊戲本體的原始碼，所以改為下載線上站台送到瀏覽器的每一個檔案來讀。它們大多以未壓縮、註解完整的形式出貨，所以仍然讀得到行號等級。遇到壓縮過的 build，條目會明說，並改以「檔名加一段搜尋得到的原文」取代行號；若站台同時送出內嵌原始內容的 source map（一票之重），讀的就是還原出來的原始檔。" },
    { en: "**Source-level review, not README-level.** Every project's core game logic, backend functions, database schemas, security mechanisms, tests and build configs were read directly. Every claim in this report cites a file (and usually a line range) as evidence.", zh: "**讀原始碼，不是讀 README。**每個專案的核心遊戲邏輯、後端 functions、資料庫 schema、安全機制、測試與建置設定都被直接閱讀。報告中每個論斷都引用具體檔案（多附行號）為證。" },
    { en: "**One rubric, cross-calibrated.** Every project is scored on the same 1–10 anchors by parallel reviewers working from an identical brief. For the later batches those reviewers were AI agents, each reading one project and returning evidence with citations; an editor pass then spot-checked citations against the files, re-read the most sensitive claims, and adjusted scores so a '7' means the same thing everywhere — which in several cases meant lowering a reviewer's score where the code actually read did not support it. For the one non-game (ssd), the Game Design dimension was re-scoped to Content & Pedagogy.", zh: "**同一規準、交叉校準。**每個專案都由平行審查以完全相同的評分規準與指示打 1–10 分。後面幾批的審查者是 AI agent，各讀一個專案、回報附引用的證據；之後由編輯統一抽查引用是否與檔案相符、重讀最敏感的論斷，並調整分數，確保每個「7 分」意義一致——有幾款因此被調低，因為實際讀到的程式碼撐不起審查者原本給的分數。唯一的非遊戲專案（ssd）將「遊戲設計」面向改評「內容／教學設計」。" },
    { en: "**Live verification.** On 2026-07-20 all eleven public URLs of the first six projects (deployments, intro pages and the embedded game) were checked, and on 2026-08-25 the two life-sims' deployments were checked the same way — every one returned HTTP 200. Three shipped-artifact projects were fetched on 2026-11-17 and the remaining nine on 2026-11-18. All twenty projects were live when read.", zh: "**現況查核。**2026-07-20 檢查前六個專案的全部 11 個公開網址（部署、介紹頁、嵌入式遊戲），2026-08-25 以同樣方式檢查兩款人生模擬的部署——全數回應 HTTP 200。三個以出貨物受檢的專案於 2026-11-17 抓取，其餘九個於 2026-11-18 抓取。二十個專案在受檢當下都活著。" }
  ],
  verification: [
    { en: "Genre context: 'Vampire Survivors–like' is a recognized subgenre with its own Wikipedia entry; 3D takes on the formula (e.g. Megabonk, 2025, one million copies in two weeks) are an established trend — context for zombie-survivors' originality score.", zh: "類型背景：「Vampire Survivors–like」是有維基百科條目的公認子類型；3D 化（如 2025 年兩週賣百萬套的 Megabonk）已是既定趨勢——這是 zombie-survivors 原創性評分的脈絡。", url: "https://en.wikipedia.org/wiki/Vampire_Survivors%E2%80%93like" },
    { en: "Ad-fakery context: the gap between Whiteout Survival's ads and its real gameplay is widely documented (the 'ads vs gameplay' genre of coverage) — the exact phenomenon fake-whiteout-survival satirizes by building the fake game for real.", zh: "假廣告背景：《寒霜啟示錄》廣告與實際玩法的落差被大量記錄（「ads vs gameplay」型內容）——fake-whiteout-survival 正是把這個現象反諷地做成真遊戲。", url: "https://www.youtube.com/watch?v=KVdaXHUnRw0" },
    { en: "Shared authorship, checked in the data: CheerLife's README credits its original concept to 最先生 (@mr.themost), the same name on YaKyoLife's title screen — and `mr.themost <ja42022@gmail.com>` appears as a committer in YaKyoLife's git history, sharing an email address with that repository's owner account. The two games are treated in this report as one design lineage on that basis.", zh: "共同作者關係，用資料查核過：CheerLife 的 README 把原創概念署名給最先生（@mr.themost），與 YaKyoLife 片頭署名同一人——而 `mr.themost <ja42022@gmail.com>` 出現在 YaKyoLife 的 git 歷史中，與該 repo 擁有者帳號共用同一個 email。本報告據此把兩款遊戲視為同一條設計血脈。" }
  ],
  limits: [
    { en: "This is a static, code-level audit: nobody profiled frame rates or fuzzed the APIs. Runtime claims (e.g. 'dead code never triggers') come from reading control flow, not instrumentation.", zh: "這是靜態的程式碼級體檢：沒有實測 FPS、沒有 fuzz API。運行期論斷（如「死程式碼不會觸發」）來自控制流閱讀，非動態量測。" },
    { en: "Scores are calibrated judgments, not measurements. The rubric and evidence are public precisely so you can disagree with a number and check the reasoning behind it.", zh: "分數是校準過的判斷，不是量測值。規準與證據全部公開，就是為了讓你可以不同意某個分數、並檢驗它背後的推理。" },
    { en: "Security findings are reported for defensive awareness. The leaked keys described here protect message boards on free hobby games; they are cited as hygiene lessons, not as an invitation.", zh: "安全發現以防禦意識為目的呈現。文中的洩漏密鑰保護的是免費小遊戲的留言板；引用它們是為了衛生課，不是邀請函。" },
    { en: "Commit counts are not comparable across projects. CheerLife was published entirely through the GitHub web UI, so its 17 commits are upload events, not development history; its real iteration happened off-platform and cannot be read from git at all.", zh: "commit 數在專案之間不可比較。CheerLife 全程透過 GitHub 網頁介面發布，那 17 個 commit 是上傳事件而非開發歷史；它真正的迭代發生在平台之外，完全無法從 git 讀出。" },
    { en: "Eleven projects were read without the game's repository. Only the client is visible: server code, test suites and git history could not be inspected, commit and dev-day fields read 'unknown', and line counts are lines shipped to the browser — for minified builds, lines after reformatting, which are not comparable with hand-written source. Telemetry figures, pass rates, measurements and test names quoted from comments are the authors' own statements; a test that is named but cannot be read is credited as evidence of process, not as verification, which caps those testing scores at 4.", zh: "有十一個專案是在讀不到遊戲本體 repo 的情況下受檢的。看得到的只有客戶端：伺服器端程式、測試套件與 git 歷史都無法檢視，commit 數與開發天數欄位寫的是「不明」，行數則是送到瀏覽器的行數——壓縮過的 build 是重新排版後的行數，不能與手寫的原始碼相比。從註解引用的遙測數字、通過率、量測結果與測試檔名，都是作者自己的陳述；一支被點名卻讀不到的測試只算流程存在的證據、不算驗證，這些專案的測試分數因此以 4 分為上限。" },
    { en: "Large codebases were read by sampling. Where a project ships tens of thousands of lines, the core systems were read in full and the rest sampled; each such entry says so. One entry (Teacher Infinite Flow) reports balance figures from the reviewer's own re-implementation of the game's rules, written from the source because the game has no randomness. Those numbers are the audit's, not the author's, and were not confirmed by playing.", zh: "大型程式庫是抽樣閱讀的。出貨數萬行的專案，核心系統完整讀過，其餘抽樣；這類條目都會註明。有一則條目（教師無限流）引用的平衡數字，來自審查者依原始碼重新實作遊戲規則後得到的結果——因為那款遊戲沒有亂數。那些數字是這次體檢算出來的，不是作者提供的，也沒有透過實際遊玩確認。" },
    { en: "Some submitted games are not here. A site that blocks automated fetching or says in writing that it does not want to be scraped is not read at all, and no score is published for it; a site whose robots.txt turns away AI crawlers is held back unless its author agrees. Reading what a browser is served is not the same as being welcome to.", zh: "有些被推薦的遊戲不在這裡。擋下自動抓取、或明文表示不願被爬取的站台，完全不會被讀，也不會發表任何分數；robots.txt 拒絕 AI 爬蟲的站台，除非作者同意，否則先不收錄。瀏覽器拿得到的東西，不等於歡迎你來讀。" },
    { en: "Four audit dates, not one. The first six projects describe commits as of 2026-07-20; yakyulife and CheerLife were audited on 2026-08-25; three shipped-artifact projects describe what their sites served on 2026-11-17, and the remaining nine what was served or committed on 2026-11-18.", zh: "有四個受檢日期，不是一個。前六個專案描述的是 2026-07-20 的 commit；yakyulife 與 CheerLife 於 2026-08-25 受檢；三個以出貨物受檢的專案描述的是它們的站台在 2026-11-17 送出的內容，其餘九個則是 2026-11-18 送出或 commit 的內容。" },
    { en: "Each score is a snapshot of its audit date. Repositories and live sites move; scores describe what was audited, not the future.", zh: "每個分數都是受檢當日的快照。repo 與線上站台都會前進；分數描述的是受檢的對象，不是未來。" }
  ]
};

/* Glossary — terms that appear across the analyses */
window.GA_GLOSSARY = [
  { term: { en: "Rollback netcode", zh: "Rollback netcode（回滾式連線）" }, cat: "Network",
    def: { en: "A way to run a fast-paced game over a network without waiting for the other side: each peer simulates ahead using a guess for inputs that have not arrived, then rewinds and re-simulates when the real input shows up. It only works if the simulation is deterministic. Shanshenbu Brawl implements it in the browser with a seeded PRNG, quantized floats and periodic state hashes.", zh: "讓快節奏遊戲在網路上不必等對方的做法：每一端先用猜的輸入往前模擬，真正的輸入到了再倒帶重算。前提是模擬必須具決定性。閃身步大亂鬥在瀏覽器裡實作了它，用有種子的 PRNG、量化的浮點數與定期的狀態雜湊。" } },
  { term: { en: "Client-side prediction", zh: "客戶端預測" }, cat: "Network",
    def: { en: "With a server-authoritative game, the client shows the result of its own action immediately instead of waiting for the server, then reconciles when the server's answer arrives. Floor Fight predicts the local player's swings and extrapolates everyone else from the last server report.", zh: "在伺服器權威的遊戲裡，客戶端不等伺服器、先把自己動作的結果顯示出來，等伺服器的答案到了再對帳。議場大亂鬥對本地玩家的揮擊做預測，其他人則從上一次的伺服器報告外插。" } },
  { term: { en: "Fixed timestep", zh: "固定時間步" }, cat: "Simulation",
    def: { en: "Advancing a simulation in equal slices of time regardless of how fast frames are drawn, carrying any leftover time to the next frame. It makes outcomes independent of frame rate. One-Shot Parking judges in fixed 1/120 s steps and integrates the car in substeps of at most 1/240 s.", zh: "不管畫面畫得多快，都以等長的時間片推進模擬，餘下的時間帶到下一幀。這讓結果與幀率無關。一把入庫以固定 1/120 秒步進判分，車輛則以最長 1/240 秒的子步積分。" } },
  { term: { en: "Kinematic bicycle model", zh: "Kinematic bicycle model（運動學自行車模型）" }, cat: "Simulation",
    def: { en: "A standard simplification of a car for low-speed manoeuvring: the two front wheels and the two rear wheels are each collapsed into one, and the car turns about a point set by the steering angle and wheelbase, with no tyre slip. It is accurate enough for parking and is what One-Shot Parking uses.", zh: "低速操車時常用的車輛簡化模型：把兩個前輪與兩個後輪各自合成一個，車子繞著由轉向角與軸距決定的點轉動，不考慮輪胎打滑。用來模擬停車夠準，一把入庫用的就是它。" } },
  { term: { en: "Shipped-artifact audit", zh: "出貨物受檢" }, cat: "Method",
    def: { en: "Reading a project from the files its server actually sends to a browser, when no source repository is public. It can be line-level if the code is not minified, but git history, tests and server code are out of reach — which is why the projects audited this way show 'unknown' for commits and carry capped testing scores.", zh: "在沒有公開原始碼 repo 的情況下，從伺服器實際送到瀏覽器的檔案來讀一個專案。如果程式沒有壓縮，可以讀到行號等級，但 git 歷史、測試與伺服器端程式都搆不到——這就是為什麼以這種方式受檢的專案在 commit 欄位顯示「不明」，測試分數也有上限。" } },
  { term: { en: "Thin instances", zh: "Thin instances" }, cat: "3D",
    def: { en: "A Babylon.js technique that draws thousands of copies of one mesh in a single draw call by feeding the GPU a raw matrix buffer. Cheapest possible instancing — but no per-instance culling or picking.", zh: "Babylon.js 技術：把原始矩陣 buffer 直接餵給 GPU，用單一 draw call 畫出上千份同一 mesh。最便宜的 instancing——代價是無法逐實例剔除或點選。" } },
  { term: { en: "InstancedMesh", zh: "InstancedMesh" }, cat: "3D",
    def: { en: "Engine-managed mesh instancing: each instance is still an object (can be culled or picked individually) while sharing geometry. fake-whiteout-survival reverted trees from thin instances back to InstancedMesh because per-tree frustum culling won.", zh: "引擎管理的 mesh instancing：每個實例仍是物件（可各自剔除、點選）但共享幾何。fake-whiteout-survival 把樹從 thin instance 改回 InstancedMesh，因為逐棵視錐剔除更省。" } },
  { term: { en: "Object pooling", zh: "物件池" }, cat: "3D",
    def: { en: "Pre-allocating a fixed set of objects (bullets, enemies, particles) and recycling them instead of creating/destroying at runtime — avoids garbage-collection hitches. Used pervasively in all five games.", zh: "預先配置固定數量的物件（子彈、敵人、粒子）並重複利用，而非運行期建立／銷毀——避免 GC 卡頓。五款遊戲全面採用。" } },
  { term: { en: "Spatial hash grid", zh: "空間雜湊網格" }, cat: "3D",
    def: { en: "Partitioning space into grid cells keyed by hashed coordinates so neighbor queries check only nearby cells instead of every object — turning O(n²) proximity tests into near-linear work.", zh: "把空間切成以座標雜湊為 key 的格子，鄰近查詢只需檢查附近格子而非所有物件——把 O(n²) 的鄰近測試變成近似線性。" } },
  { term: { en: "Draco compression", zh: "Draco 壓縮" }, cat: "3D",
    def: { en: "Google's geometry-compression codec for 3D meshes. Cuts GLB asset size dramatically (24→11 MB in one project); the games vendor the decoder locally to avoid CDN dependency.", zh: "Google 的 3D 幾何壓縮編碼。大幅縮小 GLB 素材（某專案 24→11MB）；這些遊戲把解碼器放在本地以避免 CDN 依賴。" } },
  { term: { en: "LOD (Level of Detail)", zh: "LOD（細節層次）" }, cat: "3D",
    def: { en: "Swapping simpler models in at distance to save GPU work. Notably absent from all five games — one of the recurring 'technical ceiling' findings.", zh: "距離遠時換用較簡單的模型以省 GPU。五款遊戲都沒有——是重複出現的「技術天花板」發現之一。" } },
  { term: { en: "Hitscan", zh: "Hitscan" }, cat: "3D",
    def: { en: "FPS shooting implemented as an instantaneous ray test rather than a simulated projectile. DUCK STRIKE pairs it with separate head/body hitboxes for headshot logic.", zh: "用瞬時射線測試而非模擬彈道實作的 FPS 射擊。DUCK STRIKE 配上獨立頭／身受擊盒做爆頭判定。" } },
  { term: { en: "Navmesh", zh: "Navmesh（導航網格）" }, cat: "3D",
    def: { en: "A precomputed walkable-surface graph used for AI pathfinding. DUCK STRIKE deliberately skips it, using layered greedy avoidance instead — effective in one small arena, unscalable beyond it.", zh: "預先計算的可行走面圖，供 AI 尋路。DUCK STRIKE 刻意不用，改用分層貪婪避障——在單一小場景有效，無法擴展。" } },
  { term: { en: "Fixed timestep", zh: "固定步進" }, cat: "3D",
    def: { en: "Running physics at a constant tick (e.g. 1/60 s) with an accumulator, decoupled from render frame rate — the correct way to keep physics deterministic across devices.", zh: "物理以固定 tick（如 1/60 秒）搭配 accumulator 運行、與渲染幀率解耦——讓物理跨裝置行為一致的正確做法。" } },
  { term: { en: "Magnus force", zh: "Magnus 力" }, cat: "3D",
    def: { en: "The aerodynamic force that makes spinning balls curve. Angry Baseball applies a simplified per-tick version so breaking pitches actually break.", zh: "讓旋轉球體轉彎的空氣動力。憤怒棒球每 tick 施加簡化版本，讓變化球真的會變化。" } },
  { term: { en: "Cloudflare Pages Functions", zh: "Cloudflare Pages Functions" }, cat: "Backend",
    def: { en: "Serverless functions attached to a static Pages deployment — the backend runtime for all five games' leaderboards. Free tier: 100k requests/day, shared across an account, which drove several redesigns in this series.", zh: "掛在靜態 Pages 部署上的 serverless functions——五款遊戲排行榜的後端運行環境。免費額度每日 10 萬請求、帳號共用，這條線逼出了系列中好幾次重新設計。" } },
  { term: { en: "D1", zh: "D1" }, cat: "Backend",
    def: { en: "Cloudflare's serverless SQLite database. Stores every leaderboard, message board and presence table in this audit; also abused as a rate-limiter store (with check-then-write races as the cost).", zh: "Cloudflare 的 serverless SQLite 資料庫。本次體檢裡所有排行榜、留言板、在線表都存這裡；也被兼用作限流儲存（代價是 check-then-write 競態）。" } },
  { term: { en: "Rate limiting", zh: "限流" }, cat: "Backend",
    def: { en: "Capping how often a client may hit an endpoint. The series evolved from none (zombie-survivors) to IP-keyed D1 limits with fail-open design (later games) — one of the clearest skill-growth arcs in the audit.", zh: "限制客戶端打端點的頻率。系列從完全沒有（zombie-survivors）演進到依 IP 的 D1 限流＋fail-open 設計（後期作品）——是本次體檢中最清楚的成長曲線之一。" } },
  { term: { en: "Parameterized query", zh: "參數化查詢" }, cat: "Backend",
    def: { en: "Passing user input to SQL as bound parameters instead of string concatenation, eliminating SQL injection. All six projects get this right — everywhere.", zh: "把使用者輸入以綁定參數傳入 SQL 而非字串拼接，根絕 SQL injection。六個專案全部做對、無一例外。" } },
  { term: { en: "Plausibility clamp", zh: "合理性夾制" }, cat: "Backend",
    def: { en: "Server-side sanity bounds on submitted scores (e.g. killCap = wave²·3+150). A soft anti-cheat: it blocks absurd values but cannot stop a client that lies within the bounds.", zh: "伺服器端對送分做合理性上限（如 killCap = wave²·3+150）。軟性防作弊：擋得住荒謬值，擋不住在上限內說謊的客戶端。" } },
  { term: { en: "Turnstile", zh: "Turnstile" }, cat: "Backend",
    def: { en: "Cloudflare's CAPTCHA alternative for proving a human/browser is present. DUCK STRIKE added it server-side but never wired the client — so it silently allows everything.", zh: "Cloudflare 的 CAPTCHA 替代方案，證明請求來自真實瀏覽器。DUCK STRIKE 只做了後端、前端從未接上——於是它默默放行一切。" } },
  { term: { en: "CSP (Content Security Policy)", zh: "CSP（內容安全政策）" }, cat: "Backend",
    def: { en: "An HTTP header whitelisting what a page may load or execute — a strong second line against XSS. The angry-pig/baseball pair ships a strict script-src 'self' CSP via _headers.", zh: "以 HTTP header 白名單限制頁面可載入／執行的內容——XSS 的堅實第二道防線。憤怒豬／棒球透過 _headers 出貨嚴格的 script-src 'self' CSP。" } },
  { term: { en: "XSS & escapeHtml", zh: "XSS 與 escapeHtml" }, cat: "Backend",
    def: { en: "Cross-site scripting: injected content executing as code. The defense is escaping user strings before DOM insertion — these projects consistently do both server sanitization and client escaping.", zh: "跨站腳本攻擊：被注入的內容以程式碼身分執行。防禦是字串進 DOM 前轉義——這些專案一致做到伺服器清洗＋客戶端轉義雙層。" } },
  { term: { en: "Kill switch (_routes.json)", zh: "Kill switch（_routes.json）" }, cat: "Ops",
    def: { en: "A Cloudflare Pages file that routes paths away from Functions. Used in the fake-whiteout quota incident as a reversible circuit breaker: /api/* went static, the game survived on localStorage, and the rollback was documented in the commit.", zh: "Cloudflare Pages 的路由設定檔，可把路徑排除出 Functions。fake-whiteout 配額事故中被用作可逆斷路器：/api/* 改走靜態、遊戲靠 localStorage 存活、commit 裡寫明回滾方式。" } },
  { term: { en: "God function / god file", zh: "God function／god file" }, cat: "Quality",
    def: { en: "One function or file that owns far too much state and logic (1,315–3,837 lines in this series). Works — until testing, onboarding or refactoring is needed. The single most consistent code-quality finding across the five games.", zh: "一個函式或檔案持有過多狀態與邏輯（本系列 1,315–3,837 行不等）。能動——直到需要測試、交接或重構的那天。是五款遊戲最一致的程式品質發現。" } },
  { term: { en: "E2E test", zh: "E2E 測試" }, cat: "Quality",
    def: { en: "End-to-end testing that drives the real app (here: puppeteer-controlled headless Chrome). Angry Baseball's smoke bot actually plays full games — but asserts nothing, making it a verification harness rather than a regression suite.", zh: "端對端測試：驅動真實應用（此處為 puppeteer 控制的無頭 Chrome）。憤怒棒球的 smoke bot 真的會打完整場——但沒有斷言，所以是驗證工具而非回歸測試。" } },
  { term: { en: "CI (Continuous Integration)", zh: "CI（持續整合）" }, cat: "Quality",
    def: { en: "Automation that builds and tests every change. Absent from all six repos in any meaningful form — the shared blind spot of this entire audit.", zh: "對每次變更自動建置與測試。六個 repo 都沒有任何有意義的 CI——本次體檢所有專案共同的盲點。" } },
  { term: { en: "Agentic development", zh: "Agentic 開發" }, cat: "AI",
    def: { en: "A workflow where an AI agent edits, runs and verifies code in a loop while a human directs. Evidence throughout: Claude co-authorship on ~100% of game commits, READMEs addressed to 'the next AI', debug hooks built for headless AI self-verification.", zh: "AI agent 在迴圈中編輯、執行、驗證程式碼、人負責指揮的工作流。證據遍布全案：遊戲 commit 近 100% 由 Claude 共同署名、寫給「下一個 AI」的 README、專為無頭 AI 自我驗證設計的 debug 鉤子。" } },
  { term: { en: "Prompt injection", zh: "Prompt injection" }, cat: "AI",
    def: { en: "Attacking an AI workflow by smuggling instructions into content it reads (tool results, web pages). DUCK STRIKE's SECURITY_INCIDENT.md is a rare first-hand log of such attempts during development.", zh: "把指令夾帶進 AI 讀取的內容（tool 結果、網頁）以攻擊其工作流。DUCK STRIKE 的 SECURITY_INCIDENT.md 是開發期間此類攻擊的罕見一手記錄。" } },
  { term: { en: "Survivors-like", zh: "Survivors-like（割草生存）" }, cat: "Genre",
    def: { en: "The auto-attack horde-survival subgenre popularized by Vampire Survivors (2022), now a recognized category with its own Wikipedia entry. zombie-survivors is an admitted 3D entry in this lineage.", zh: "由 Vampire Survivors（2022）帶紅的自動攻擊怪海生存子類型，如今是有維基百科條目的公認類別。zombie-survivors 是公開承認的 3D 系譜成員。" } },
  { term: { en: "Tor onion service", zh: "Tor onion service" }, cat: "Ops",
    def: { en: "Hosting a site inside the Tor network for anonymous, censorship-resistant access. ssd serves its curriculum over an onion address and advertises it with per-page onion-location headers — practicing what it teaches.", zh: "把網站架在 Tor 網路內提供匿名、抗審查存取。ssd 以 onion 位址提供教材並在每頁送出 onion-location header——身體力行它教的東西。" } },
  { term: { en: "MkDocs (Material)", zh: "MkDocs（Material）" }, cat: "Ops",
    def: { en: "A Python static-site generator for documentation. ssd extends it unusually far: custom build hooks, 12 template overrides, a privacy plugin localizing third-party assets, and llms.txt output.", zh: "Python 文件靜態網站產生器。ssd 把它延伸得異常遠：自訂 build hook、12 個模板 override、將第三方資產本地化的 privacy 外掛、llms.txt 輸出。" } },
  { term: { en: "Seeded PRNG", zh: "種子化亂數（seeded PRNG）" }, cat: "Quality",
    def: { en: "A deterministic pseudo-random generator whose whole sequence is fixed by one starting string, so the same seed plus the same choices replays an identical run. Both life-sims use a mulberry32-style generator this way, which turns the seed into a shareable artifact — and makes bug reports reproducible from a seed plus a choice list.", zh: "決定性的偽亂數產生器：整段序列由一個起始字串決定，因此相同種子＋相同選擇會重播出完全相同的一輪。兩款人生模擬都以 mulberry32 式產生器這樣使用，讓種子本身成為可分享物——也讓 bug 回報只要附上種子與選擇序列就能重現。" } },
  { term: { en: "Monte Carlo balance calibration", zh: "蒙地卡羅平衡校準" }, cat: "Quality",
    def: { en: "Tuning a game by simulating thousands of complete playthroughs and reading the resulting distribution, rather than by feel. yakyulife re-anchored its whole career-evaluation ladder this way — targeting 'Hall of Fame = 15% of all players' — after simulation showed the old thresholds sat above any reachable player.", zh: "以模擬上千段完整流程、讀取結果分布的方式調整平衡，而不是靠手感。yakyulife 用這個方法把整條生涯評價階梯重新錨定——目標是「名人堂＝全部玩家的 15%」——因為模擬顯示舊門檻高過任何玩家可達到的上限。" } },
  { term: { en: "Positional adjustment", zh: "守位調整（positional adjustment）" }, cat: "Genre",
    def: { en: "A sabermetric correction that credits harder defensive positions (catcher, shortstop) and debits easier ones (first base, DH) when comparing player value. yakyulife implements it in run units and rescales it to each league's real season length instead of a hardcoded 162 games.", zh: "賽伯計量學的修正：比較球員價值時，替難守的位置（捕手、游擊）加分、替好守的位置（一壘、指定打擊）扣分。yakyulife 以「失分」為單位實作，並依各聯盟真實球季場次縮放，而不是寫死 162 場。" } },
  { term: { en: "Reflected HTML injection", zh: "反射型 HTML 注入" }, cat: "Backend",
    def: { en: "When a value taken from the URL is written into the page as markup instead of text, a crafted link can inject elements into another visitor's page. yakyulife reads `?seed=` unsanitized and renders it through an `innerHTML` assignment on the retirement screen — the same feature built for sharing links.", zh: "當來自網址的值被當成標記（而非文字）寫進頁面時，構造過的連結就能把元素注入到另一位訪客的頁面。yakyulife 未消毒地讀取 `?seed=`，並在引退畫面經由 `innerHTML` 賦值渲染它——正是為分享連結而做的那個功能。" } },
  { term: { en: "Cache-bust token", zh: "cache-bust token" }, cat: "Ops",
    def: { en: "A version string appended to an asset URL (`?v=1.5.8`) so a CDN or browser cannot serve a stale copy. yakyulife applies one to every ES-module import specifier — 173 of them — which guarantees a consistent module graph but has to be updated by hand at every release.", zh: "附加在資源網址後的版本字串（`?v=1.5.8`），讓 CDN 或瀏覽器無法回舊檔。yakyulife 把它加在每一個 ES module 的 import 指定符上——共 173 個——這保證了模組圖版本一致，但每次發版都得手動更新。" } }
];

/* Page registry — one entry per .html page */
window.SITE_PAGES = [
  { slug: "home", layout: "hub", icon: "home",
    title: { en: "Overview", zh: "總覽" },
    subtitle: { en: "Rankings, score matrix and profiles at a glance", zh: "排行、分數矩陣與輪廓一覽" } },
  { slug: "zombie-survivors", layout: "project", icon: "swords", project: "zombie-survivors",
    title: { en: "Zombie Survivors", zh: "殭屍大逃殺" } },
  { slug: "fake-whiteout-survival", layout: "project", icon: "ac_unit", project: "fake-whiteout-survival",
    title: { en: "Fake Whiteout", zh: "偽寒冰啟示錄" } },
  { slug: "duck-strike", layout: "project", icon: "raven", project: "duck-strike",
    title: { en: "DUCK STRIKE", zh: "鴨鴨突擊" } },
  { slug: "angry-pig", layout: "project", icon: "rocket_launch", project: "angry-pig",
    title: { en: "Angry Pig", zh: "憤怒豬" } },
  { slug: "angry-baseball", layout: "project", icon: "sports_baseball", project: "angry-baseball",
    title: { en: "Angry Baseball", zh: "憤怒棒球" } },
  { slug: "ssd", layout: "project", icon: "shield", project: "ssd",
    title: { en: "OCF · SSD", zh: "OCF 資安新手村" } },
  { slug: "yakyulife", layout: "project", icon: "sports_baseball", project: "yakyulife",
    title: { en: "YaKyoLife", zh: "YaKyoLife 棒球人生" } },
  { slug: "cheerlife", layout: "project", icon: "celebration", project: "cheerlife",
    title: { en: "CheerLife", zh: "CheerLife 啦啦隊人生" } },
  { slug: "car-license", layout: "project", icon: "directions_car", project: "car-license",
    title: { en: "One-Shot Parking", zh: "一把入庫" } },
  { slug: "floor-fight", layout: "project", icon: "gavel", project: "floor-fight",
    title: { en: "Floor Fight", zh: "議場大亂鬥" } },
  { slug: "shanshenbu", layout: "project", icon: "sports_martial_arts", project: "shanshenbu",
    title: { en: "Shanshenbu Brawl", zh: "閃身步大亂鬥" } },
  { slug: "seven-seconds", layout: "project", icon: "two_wheeler", project: "seven-seconds",
    title: { en: "Seven Seconds", zh: "七秒上路" } },
  { slug: "ilove-block", layout: "project", icon: "stethoscope", project: "ilove-block",
    title: { en: "I Love Block", zh: "我愛區段" } },
  {"slug": "fab24hr", "layout": "project", "icon": "precision_manufacturing", "project": "fab24hr", "title": {"en": "fab24hr", "zh": "fab24hr"}},
  {"slug": "weight-of-a-vote", "layout": "project", "icon": "how_to_vote", "project": "weight-of-a-vote", "title": {"en": "Weight of a Vote", "zh": "一票之重"}},
  {"slug": "draftmylife", "layout": "project", "icon": "edit_note", "project": "draftmylife", "title": {"en": "Draft My Life", "zh": "人生草稿"}},
  {"slug": "patient-seems-dead", "layout": "project", "icon": "vital_signs", "project": "patient-seems-dead", "title": {"en": "Rookie Nurse", "zh": "菜鳥護理師"}},
  {"slug": "teacher-survival", "layout": "project", "icon": "school", "project": "teacher-survival", "title": {"en": "Teacher Survival", "zh": "教師無限流"}},
  {"slug": "mochi-party", "layout": "project", "icon": "celebration", "project": "mochi-party", "title": {"en": "Mochi Party", "zh": "麻糬派對"}},
  {"slug": "sleep-on-the-couch", "layout": "project", "icon": "weekend", "project": "sleep-on-the-couch", "title": {"en": "Sleeping on the Couch?", "zh": "今晚睡沙發？"}},
  { slug: "authors", layout: "authors", icon: "group",
    title: { en: "Authors", zh: "作者對比" },
    subtitle: { en: "Very different ways to ship software", zh: "截然不同的出貨方式" } },
  { slug: "methodology", layout: "methodology", icon: "rule",
    title: { en: "Methodology", zh: "評分方法" },
    subtitle: { en: "Rubric, weights, process, verification and limits", zh: "規準、權重、流程、佐證與限制" } },
  { slug: "glossary", layout: "glossary", icon: "dictionary",
    title: { en: "Glossary", zh: "術語速查" },
    subtitle: { en: "The technical terms behind the findings", zh: "分析背後的技術名詞" } }
];
