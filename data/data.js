/* Site data: meta, pages, scoring model, authors, methodology, glossary.
   Pure data — rendering logic lives in assets/app.js. */

window.SITE_META = {
  title: { en: "Game Project Report Card", zh: "遊戲專案評分報告" },
  subtitle: {
    en: "Eight repos · seven dimensions · four authors — a code-level audit",
    zh: "八個專案 × 七大面向 × 四位作者的程式碼級深度分析"
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
    { en: "**Full clone, full history.** All eight repositories were cloned with complete git history; commit timelines, authorship and cadence were analyzed alongside the code.", zh: "**完整 clone、完整歷史。**八個 repo 全數 clone 含完整 git 歷史；commit 時間軸、署名與節奏與程式碼一併分析。" },
    { en: "**Source-level review, not README-level.** Every project's core game logic, backend functions, database schemas, security mechanisms, tests and build configs were read directly. Every claim in this report cites a file (and usually a line range) as evidence.", zh: "**讀原始碼，不是讀 README。**每個專案的核心遊戲邏輯、後端 functions、資料庫 schema、安全機制、測試與建置設定都被直接閱讀。報告中每個論斷都引用具體檔案（多附行號）為證。" },
    { en: "**One rubric, cross-calibrated.** All eight projects were scored on the same 1–10 anchors by parallel reviewers using an identical brief, then cross-checked so a '7' means the same thing everywhere. For the one non-game (ssd), the Game Design dimension was re-scoped to Content & Pedagogy.", zh: "**同一規準、交叉校準。**六個專案由平行審查以完全相同的評分規準與指示打 1–10 分，再交叉校準確保每個「7 分」意義一致。唯一的非遊戲專案（ssd）將「遊戲設計」面向改評「內容／教學設計」。" },
    { en: "**Live verification.** On 2026-07-20 all eleven public URLs of the first six projects (deployments, intro pages and the embedded game) were checked, and on 2026-08-25 the two life-sims' deployments were checked the same way — every one returned HTTP 200. All eight projects are live.", zh: "**現況查核。**2026-07-20 檢查前六個專案的全部 11 個公開網址（部署、介紹頁、嵌入式遊戲），2026-08-25 以同樣方式檢查兩款人生模擬的部署——全數回應 HTTP 200，八個專案都活著。" }
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
    { en: "Two audit dates, not one. The first six projects describe commits as of 2026-07-20; yakyulife and CheerLife were audited on 2026-08-25 and describe their state on that date.", zh: "有兩個受檢日期，不是一個。前六個專案描述的是 2026-07-20 的 commit；yakyulife 與 CheerLife 於 2026-08-25 受檢，描述的是該日的狀態。" },
    { en: "One snapshot in time (2026-07-20). Repositories move; scores describe the audited commits, not the future.", zh: "單一時間點快照（2026-07-20）。repo 會前進；分數描述的是受檢的 commit，不是未來。" }
  ]
};

/* Glossary — terms that appear across the analyses */
window.GA_GLOSSARY = [
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
  { slug: "authors", layout: "authors", icon: "group",
    title: { en: "Authors", zh: "作者對比" },
    subtitle: { en: "Two very different ways to ship software", zh: "兩種截然不同的出貨方式" } },
  { slug: "methodology", layout: "methodology", icon: "rule",
    title: { en: "Methodology", zh: "評分方法" },
    subtitle: { en: "Rubric, weights, process, verification and limits", zh: "規準、權重、流程、佐證與限制" } },
  { slug: "glossary", layout: "glossary", icon: "dictionary",
    title: { en: "Glossary", zh: "術語速查" },
    subtitle: { en: "The technical terms behind the findings", zh: "分析背後的技術名詞" } }
];
