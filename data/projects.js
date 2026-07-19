/* Deep-dive analysis data for the six audited repositories.
   Pure data. Inline markup: `code` and **bold** are rendered by app.js
   AFTER HTML-escaping, so raw data can never inject markup. */
window.GA_PROJECTS = [
  /* ================================================================ 1 */
  {
    slug: "zombie-survivors",
    order: 1,
    author: "craig7351",
    repo: "craig7351/zombie-survivors",
    demo: "https://zombie-survivors-e4y.pages.dev",
    intro: "https://craig7351.github.io/zombie-survivors/",
    title: { en: "Zombie Survivors", zh: "殭屍大逃殺 Zombie Survivors" },
    tagline: {
      en: "A 3D Vampire Survivors-like roguelite: auto-fire, gem pickups, three-choice level-ups, a 7-boss story mode plus an endless deathmatch — backed by a global leaderboard on Cloudflare D1.",
      zh: "3D 版 Vampire Survivors-like roguelite——自動開火、撿寶石三選一升級、劇情模式打 7 王破關 + 死鬥模式無盡波數，後端是 Cloudflare D1 全球排行榜。"
    },
    genre: { en: "Survivors-like roguelite", zh: "Survivors-like 割草 roguelite" },
    stack: ["Vue 3", "TypeScript", "Babylon.js 9", "Tailwind 4", "Vite", "CF Pages Functions", "D1"],
    period: "2026-06-12 → 2026-07-12",
    devDays: 6, commits: 62, loc: 8570,
    scores: { tech: 6.5, design: 7, backend: 5.5, quality: 6.5, testing: 1.5, completeness: 8, originality: 5 },
    dims: {
      tech: {
        en: "Genuine performance engineering at a modest scale: bullets and XP gems ride **thin instances with a Float32Array SoA matrix buffer** (`weapon-system.ts`, `gem-system.ts` CAPACITY=4000), a pre-instantiated pool of 63 skeletal-animated zombies (`zombie-horde.ts`), a **spatial hash grid** for neighbor queries (`spatial-grid.ts`), and Draco-compressed GLBs with a self-hosted decoder (−26 MB). But the horde caps at ~63 concurrent enemies — far from a true swarm — and there is no LOD, no worker, and every algorithm is a linear scan.",
        zh: "真材實料但規模不大的效能工程：子彈與經驗寶石用 **thin instances + Float32Array SoA matrix buffer**（`weapon-system.ts`、`gem-system.ts` CAPACITY=4000）、預建 63 隻骨架動畫殭屍池（`zombie-horde.ts`）、**空間雜湊網格**做鄰近查詢（`spatial-grid.ts`）、GLB 全數 Draco 壓縮＋自帶解碼器（省 26MB）。但怪物上限僅約 63 隻，離真正「怪海」有距離；無 LOD、無 worker，演算法都是線性掃描。"
      },
      design: {
        en: "A complete VS loop with its own judgment: 8 characters with trade-offs, 25 capped upgrades, 7 bosses across 5 attack patterns, and a meta shop. The mature calls: **jump-dodging contact damage** (a movement axis VS lacks), a lifesteal-per-second cap, and a deathmatch **level cap of 60 that guarantees every run ends** so the leaderboard stays meaningful. Upgrades are mostly numeric stacking — no weapon evolution depth.",
        zh: "完整且有自己想法的 VS 循環：8 角色各有 trade-off、25 個有上限的升級、7 王 5 種招式、meta 商店。成熟的設計判斷：**跳躍可閃避接觸傷害**（VS 沒有的走位維度）、吸血設每秒上限、死鬥**等級上限 60 保證 run 必然結束**讓排行榜有區別度。弱點：升級多為純數值堆疊，缺武器進化深度。"
      },
      backend: {
        en: "A real backend with smart pieces — fully parameterized queries, plausibility validation (kills ≤ time×25+50, sub-200s clears rejected), and a cost-aware presence redesign that writes D1 only ~13% of the time. But there is **zero rate limiting** on any POST endpoint, deathmatch scores are **forgeable with one curl** (clamped at 100M vs a legit max ≈ 100k), and the message-board **delete key '0501' is hardcoded in the public repo** (`messages.ts`).",
        zh: "有真後端且部分做得聰明——全參數化查詢、合理性驗證（kills ≤ time×25+50、破關 <200 秒拒收）、線上人數改「進場制」僅 ~13% 機率寫 D1 的成本意識設計。但**所有 POST 端點零限流**，死鬥分數**一支 curl 即可偽造**（clamp 到 1 億但合法上限約 10 萬），且留言板**刪除密鑰 '0501' 硬編碼在公開 repo**（`messages.ts`）。"
      },
      quality: {
        en: "Strict TypeScript with `noUnusedLocals`, clean system decomposition (horde / weapons / gems / bosses / sound each in its own module), declarative data-driven content, and dense why-style comments. The flaw: `game.ts` is a **1,315-line closure factory** holding 40+ state variables — a textbook god function — plus three near-identical all-enemy scan loops.",
        zh: "TS strict + `noUnusedLocals`，系統切分乾淨（怪群／武器／寶石／王／音效各司其職）、資料驅動、高密度「為什麼」式註解。致命傷：`game.ts` 是 **1,315 行的閉包工廠**，內含 40+ 個狀態變數的 god function；另有三段幾乎相同的全敵人掃描迴圈重複。"
      },
      testing: {
        en: "Zero automated tests, zero CI. No `*.test.*` files, no vitest/jest, no workflows — the only quality gate is `vue-tsc --noEmit` inside the build. The backend clamp/sanitize helpers are the most testable pure functions in the repo and remain untested.",
        zh: "零自動化測試、零 CI。無任何 test/spec 檔、無 vitest/jest、無 workflows——唯一品質關卡是 build 內的 `vue-tsc --noEmit`。後端 clamp/sanitize 是全案最好測的純函式，卻沒有測試。"
      },
      completeness: {
        en: "Astonishing polish for a first work: live deployment, a hand-written intro site, YouTube gameplay video, 11 screenshots, a fully procedural audio stack (all SFX + 4 BGM tracks with music-theory comments), monster codex, message board, an SVG online-count history chart, and three thorough docs (README / GAME.md / BACKEND.md runbook).",
        zh: "以第一個作品而言打磨得驚人：線上可玩、手寫介紹站、YouTube 影片、11 張截圖、全程序合成音訊（全部音效＋4 首附樂理註解的 BGM）、怪物圖鑑、留言板、手刻 SVG 在線人數歷史圖，外加三份詳盡文件（README／GAME.md／BACKEND.md runbook）。"
      },
      originality: {
        en: "An openly admitted Vampire Survivors clone (the README's first line says so) built on CC0 asset packs — but the additions are real: full 3D with a rotatable camera, jump-dodge as a mechanical difference, a mutator-driven deathmatch, and a social layer this genre rarely has. A genre-follower with its own twist, not a reskin.",
        zh: "公開承認的 Vampire Survivors 複製（README 第一句自稱 VS-like）、美術為 CC0 素材包——但加的東西是真的：3D 化＋可旋轉相機、跳躍閃避的機制性差異、突變子死鬥模式、此類型少見的社交層。是「有自己 twist 的類型跟隨作」，不是換皮。"
      }
    },
    highlights: [
      { en: "**Skeletal-animation zombie pool** — 7 types × 9 pre-instantiated animated clones with staggered Run/Walk cycles to break uniformity (`zombie-horde.ts:121-165`)", zh: "**殭屍動畫池**——7 類型 × 9 隻預建骨架動畫實體，輪流錯開 Run/Walk 動畫打破整齊感（`zombie-horde.ts:121-165`）" },
      { en: "**Cost-aware presence** — heartbeat polling refactored to check-in-once + ~13% probabilistic maintenance, explicitly to cut Cloudflare Functions/D1 usage (`online.ts:20-33`)", zh: "**成本感知的在線人數**——心跳輪詢重構為「進場制」＋約 13% 機率性維護，明確為降 Cloudflare Functions/D1 用量（`online.ts:20-33`）" },
      { en: "**Zero-asset audio** — every SFX and 4 mood-shifting BGM tracks synthesized in Web Audio with a lookahead scheduler (`sound.ts`)", zh: "**零資產音訊**——全部音效＋4 首隨進度切換的 BGM 純 Web Audio 合成，含 lookahead scheduler（`sound.ts`）" },
      { en: "**Guaranteed-ending deathmatch** — level cap 60 + steepening growth + contact lethality scaling solve the 'nobody ever dies' leaderboard problem (`deathmatch.ts`)", zh: "**保證結束的死鬥設計**——等級上限 60＋後期成長轉陡＋接觸致命性放大，三管齊下解「站著不死、排行榜無區別度」（`deathmatch.ts`）" },
      { en: "**Thin-instance weapon pipeline** — knife model merged then swapped seamlessly onto the existing matrix buffer, with pierce/crit/freeze modifier chain (`weapon-system.ts:87-118`)", zh: "**thin instance 武器管線**——飛刀模型合併後無縫承接既有 matrix buffer，含穿透／暴擊／冰凍修飾鏈（`weapon-system.ts:87-118`）" }
    ],
    weaknesses: [
      { en: "**Hardcoded delete key** `'0501'` in the public repo lets anyone wipe the message board (`messages.ts:12`)", zh: "**刪除密鑰 `'0501'` 硬編碼**在公開 repo，任何人可刪光留言板（`messages.ts:12`）" },
      { en: "**Forgeable deathmatch scores** — clamp allows 100,000,000 vs a legit max ≈ 100k; no cross-field consistency check (`run.ts:26`)", zh: "**死鬥分數可偽造**——clamp 上限 1 億 vs 合法上限約 10 萬，無跨欄位一致性驗證（`run.ts:26`）" },
      { en: "**Zero rate limiting** on every POST endpoint — the board can be flooded by a script", zh: "**所有 POST 端點零限流**——留言板可被腳本灌爆" },
      { en: "**1,315-line god function** — `createGame` holds all game state in one closure; story and deathmatch logic interleave (`game.ts`)", zh: "**1,315 行 god function**——`createGame` 閉包持有全部遊戲狀態，劇情與死鬥邏輯交織（`game.ts`）" },
      { en: "**Zero tests, zero CI** — even the trivially testable backend validators are untested", zh: "**零測試零 CI**——連最好測的後端驗證純函式都沒測" }
    ],
    ai: {
      en: "Certain and heavy: the repo ships `.claude/launch.json`; the primary commit author is a corporate AI account with craig7351 as co-author. On day one, milestones 1 through 6 — from performance prototype to deployed meta-shop build — landed within **100 minutes** (18 commits). GAME.md is literally a reskin playbook written for the AI workflow, and leftover penguin/fox models reveal this is itself a full reskin of an earlier animal-themed game.",
      zh: "確定且重度：repo 內有 `.claude/launch.json`；主要 commit 作者是公司 AI 帳號、craig7351 為共同作者。首日從效能原型到部署完 meta 商店的里程碑 1–6 在 **100 分鐘內**完成（18 commits）。GAME.md 本身就是寫給 AI 工作流的「換皮 playbook」，而遺留的企鵝／狐狸模型顯示本作正是前一款動物遊戲的全面換皮。"
    },
    special: null,
    verdict: {
      en: "Far beyond hobby level for a 'first work': the performance engineering, cost awareness and design judgment are real. But it is a heavily AI-assisted product whose safety net is zero — no tests, soft-validation-only anti-cheat, and a hardcoded secret that should never have shipped.",
      zh: "以「第一個作品」而言遠超業餘水準——效能工程、成本意識、設計判斷都紮實。但它是重度 AI 輔助的產物且安全網為零：無測試、防作弊停留在軟驗證，硬編碼密鑰更是不該犯的錯。"
    }
  },

  /* ================================================================ 2 */
  {
    slug: "fake-whiteout-survival",
    order: 2,
    author: "craig7351",
    repo: "craig7351/fake-whiteout-survival",
    demo: "https://fake-whiteout-survival.pages.dev",
    intro: null,
    title: { en: "Fake Whiteout Survival", zh: "偽寒冰啟示錄 Fake Whiteout Survival" },
    tagline: {
      en: "The 'snowfield butcher shop' minigame that exists only in Whiteout Survival's misleading ads — actually built: hunt cattle, sell meat, hire automation, then survive a 30-wave zombie tower-defense finale.",
      zh: "把《寒霜啟示錄》買量廣告裡不存在的「雪地賣肉舖」假玩法做成真遊戲：獵牛取肉→擺攤賣錢→買自動化員工→撐過 30 波殭屍塔防終局。"
    },
    genre: { en: "Arcade idle × tower defense", zh: "放置經營 × 塔防混合" },
    stack: ["Vue 3", "TypeScript", "Babylon.js 9", "Tailwind 4", "Vite 6", "CF Pages Functions", "D1"],
    period: "2026-06-18 → 2026-07-14",
    devDays: 4, commits: 96, loc: 7000,
    scores: { tech: 7, design: 7, backend: 6, quality: 6.5, testing: 1.5, completeness: 8, originality: 4.5 },
    dims: {
      tech: {
        en: "Solid Babylon.js performance work driven by measurement, not templates: the **BackStack module** draws 200 stacked meat slabs on the player's back via one thin-instance mesh with a hand-written `Float32Array` matrix buffer (zero-allocation hot path), while `tree-field.ts` documents **reverting** thin instances back to InstancedMesh because per-tree frustum culling won. Zombie pool built lazily, static meshes frozen, Draco 24→11 MB self-hosted. No LOD, no spatial partitioning — collisions are brute-force O(n·m).",
        zh: "量測驅動而非套模板的紮實 Babylon.js 效能工程：**BackStack 模組**用單一 thin-instance mesh＋手寫 `Float32Array` matrix buffer（零配置熱路徑）畫背上 200 層肉；`tree-field.ts` 記錄了從 thin instance **改回** InstancedMesh 的決策（逐棵視錐剔除更省）。殭屍池延遲建立、靜態物 freeze、Draco 24→11MB 自帶解碼器。無 LOD、無空間分割——碰撞是 O(n·m) 暴力迴圈。"
      },
      design: {
        en: "A complete loop with a real mid-game pivot: economy phase → automation phase (dog / hunter / cashier) → 30-wave tower-defense endgame with bosses every 3 waves and a pure-slow tower. Git history shows genuine design iteration — house-HP was cut for a more readable **breach mechanic** (10 zombies inside = loss). Weak spots: the upgrade tree has exactly one entry, no mid-run save, and the run is short.",
        zh: "有真實中後期轉折的完整循環：經營期→自動化期（狗／獵人／收銀員）→30 波塔防終局（每 3 波 Boss、含無傷害純減速塔）。git 歷史可見真實設計迭代——砍掉「房子血量」改成更易讀的 **breach 判定**（殭屍攻入 10 隻判負）。弱點：升級樹只有一項、無中途存檔、流程偏短。"
      },
      backend: {
        en: "Above-average defenses: parameterized SQL, IP-based D1 rate limits (4–8 s per action), profanity filtering, wave clamped to 30 with 'claimed clear below wave 30 recorded as not cleared', ADMIN_KEY in Pages Secrets. Then the hole: the frontend hardcodes debug password **'19840501' and its comment admits it equals the admin key** — anyone reading the bundle can wipe the board and open the cheat panel. Rate limiter has a SELECT-then-UPSERT race; the `rate` table is never cleaned.",
        zh: "防護高於平均：SQL 全參數化、依 IP 的 D1 限流（各動作 4–8 秒）、髒話過濾、wave 鎖 30 且「未達 30 波宣稱通關一律改記未通關」、ADMIN_KEY 走 Pages Secret。但破口在前端：硬編碼 debug 密碼 **'19840501' 且註解自曝＝留言板刪除碼**——讀 bundle 就能刪留言＋開作弊面板。限流有 SELECT-then-UPSERT race，`rate` 表永不清理。"
      },
      quality: {
        en: "Strict TS with **zero `any` in the whole codebase**, `vue-tsc` forced before build, parameters centralized in a 349-line commented `config.ts`. The counterweight: `game.ts` is **3,837 lines** — one `createGame()` closure containing nearly all logic, with the 'stand-in-zone payment' block copy-pasted six times and the attack block twice.",
        zh: "TS strict 且**全案零 `any`**、build 前強制 `vue-tsc`、參數集中在 349 行帶註解的 `config.ts`。反面：`game.ts` **3,837 行**——一個 `createGame()` 閉包包下幾乎全部邏輯，「站框付款」邏輯複製貼上六處、攻擊邏輯兩處。"
      },
      testing: {
        en: "Zero automated tests, no test dependencies, no CI. The only gate is type-checking inside the build — though DEVLOG records a real 'typecheck before every build' discipline.",
        zh: "零自動化測試、無測試依賴、無 CI。唯一閘門是 build 內的型別檢查——DEVLOG 倒是記載了「改完一律先型別檢查再 build」的紀律。"
      },
      completeness: {
        en: "Near-full spec for a hobby game: live with global leaderboard, nested-reply message board, 7-day online chart, server-wide stats, 11 achievements (with a commit that verified all are triggerable), 5-track synthesized BGM, four docs (README / BACKEND / DEVLOG pitfall collection / README_AI), and graceful degradation everywhere — model-load fallbacks, offline localStorage mode, fire-and-forget community calls.",
        zh: "以個人小遊戲標準近乎滿配：線上可玩＋全球排行榜＋巢狀回覆留言板＋7 天在線折線圖＋全服統計、11 項成就（有 commit 專門驗證全部可觸發）、5 軌合成 BGM、四份文件（README／BACKEND／DEVLOG 踩雷集／README_AI），且到處優雅降級——模型載入 fallback、離線 localStorage 模式、社群呼叫 fire-and-forget。"
      },
      originality: {
        en: "The premise is knowingly derivative — recreating a game that only exists in scam ads — and that meta joke is genuinely clever. Mechanically, though, it is an assembly of two very mature genres (arcade idle + TD); the breach rule, slow-tower and social layer are its own, but no new mechanic is invented.",
        zh: "題材直白承認山寨——複刻「只存在於騙人廣告裡的遊戲」，這個 meta 前提本身有巧思。但機制層面是「放置經營＋塔防」兩個極成熟類型的拼接；breach 判定、減速塔與社群層是自己長的，並無新機制發明。"
      }
    },
    highlights: [
      { en: "**BackStack thin-instance stack** — 200 visual layers at zero FPS cost, with smooth growth animation and per-step sway (`back-stack.ts`)", zh: "**BackStack thin-instance 背堆**——200 層視覺零 FPS 損耗，含平滑生長動畫與隨步伐擺動（`back-stack.ts`）" },
      { en: "**Documented negative knowledge** — DEVLOG lists five failed fixes for iOS double-tap zoom before the working one, plus thin-instance-on-merged-mesh and TDZ pitfalls (`DEVLOG.md`)", zh: "**踩雷文件化**——DEVLOG 列出 iOS 雙擊放大的 5 種無效解法與最終解，外加 thin-instance 對合併 mesh 失效、TDZ bug 根因（`DEVLOG.md`）" },
      { en: "**Textbook quota-incident response** — reduce, slim, then a reversible `_routes.json` circuit breaker, all documented in commit messages", zh: "**教科書級配額事故應對**——先降流量、再瘦身、最後用可逆的 `_routes.json` 斷路器，全程寫進 commit message" },
      { en: "**Zero-external-dependency resilience** — self-hosted Draco, synthesized music, automatic localStorage fallback: fully playable offline", zh: "**零外部依賴的韌性**——自帶 Draco、合成音樂、API 掛掉自動回退 localStorage，斷網也能完整遊玩" },
      { en: "**Server-side plausibility validation** — wave clamped to 30 and false clears demoted, stricter than most small games' accept-everything (`run.ts:14-24`)", zh: "**伺服器端合理性驗證**——wave 鎖 30、假通關降級記錄，比多數小遊戲「照單全收」認真（`run.ts:14-24`）" }
    ],
    weaknesses: [
      { en: "**Admin key effectively leaked** — frontend hardcodes `'19840501'` with a comment admitting it equals the backend ADMIN_KEY (`game-view.vue:270`)", zh: "**管理密鑰實質外洩**——前端硬編碼 `'19840501'`，註解自曝與後端 ADMIN_KEY 相同（`game-view.vue:270`）" },
      { en: "**3,837-line god function** with six copy-pasted payment blocks and duplicated attack logic (`game.ts`)", zh: "**3,837 行 god function**——六處複製貼上的付款邏輯、兩處重複的攻擊邏輯（`game.ts`）" },
      { en: "**Zero tests, zero CI** — not even the rate limiter or leaderboard clamps have unit tests", zh: "**零測試零 CI**——連 D1 限流、排行榜 clamp 這種純函式都沒單元測試" },
      { en: "**Rate limiter race** (non-atomic SELECT-then-UPSERT) and a `rate` table that is never cleaned (`_lib.ts:46-62`)", zh: "**限流 race**（SELECT-then-UPSERT 非原子）且 `rate` 表永不清理（`_lib.ts:46-62`）" },
      { en: "**Leaderboard still scriptable** — no client proof; one fake max-score entry per IP every 4 seconds", zh: "**排行榜仍可腳本灌榜**——無任何 client 證明機制，每 IP 每 4 秒可寫一筆滿分成績" }
    ],
    ai: {
      en: "Public and extreme: all **96 commits carry Claude Opus 4.8 co-authorship** (92 tagged '1M context'); the author's brand is literally 'Book AI'; README_AI describes itself as written by the AI after reading the codebase. The cadence is the human-directs-AI loop at full speed — **63 commits in one day**, including a 12-commit battle with iOS double-tap zoom where a human verified on-device while the AI iterated.",
      zh: "公開且極端：全部 **96 個 commit 都帶 Claude Opus 4.8 共同作者**（92 個標註 1M context）；作者品牌就叫「Book AI」；README_AI 自述由 AI 讀完整個程式碼後整理。節奏是全速的「人指揮 AI」迴圈——**單日 63 commits**，其中連續 12 個 commit 在跟 iOS 雙擊放大纏鬥：人在真機驗證、AI 快速迭代。"
    },
    special: {
      title: { en: "Incident report: the kill-switch day", zh: "事件還原：kill-switch 之日" },
      body: [
        { en: "2026-07-13: real traffic pushed the account's shared Cloudflare Functions free quota (100k/day) to the brink — old background tabs were still running a retired 60-second heartbeat poll that could not be remotely stopped.", zh: "2026-07-13：真實流量把帳號共用的 Cloudflare Functions 免費額度（每日 10 萬）逼到臨界——使用者留在背景的舊分頁還在跑已淘汰的 60 秒心跳輪詢，無法遠端叫停。" },
        { en: "Same-day, three moves: (1) 09:05 switch presence to check-in-once; (2) 14:17 slim the landing calls from 5 requests to 2; (3) 15:42 emergency stop — a `_routes.json` that routes `/api/*` to static, sacrificing community features while the game stays playable on localStorage. The commit message includes the rollback procedure.", zh: "當天三步：(1) 09:05 心跳制改「進場制」；(2) 14:17 首頁請求 5 個瘦身到 2 個；(3) 15:42 緊急止血——新增 `_routes.json` 把 `/api/*` 排除出 Functions 路由，犧牲社群功能、遊戲本體靠 localStorage 照常可玩，commit message 還寫明恢復方式。" },
        { en: "Next morning, quota reset confirmed, the kill-switch was removed. A reversible circuit breaker with a documented timeline — operational maturity well beyond a month-old hobby project (even if the naive heartbeat was a self-planted landmine).", zh: "隔天確認額度重置後移除 kill-switch。可逆斷路器＋完整時間線記錄——對上線不到一個月的 hobby 專案是超齡的營運成熟度（雖然最初的天真心跳輪詢是自己埋的雷）。" }
      ]
    },
    verdict: {
      en: "The strongest 'ops story' in the series: measured rendering trade-offs, documented pitfalls, and a real quota-incident handled like a professional. The debt is the same as its siblings — a god file, zero tests — plus one self-inflicted key leak in the frontend bundle.",
      zh: "系列中「營運故事」最強的一作：量測後的渲染取捨、文件化的踩雷、像職業團隊一樣處理的配額事故。債務與兄弟作相同——god file、零測試——再加一個前端 bundle 裡自曝的密鑰。"
    }
  },

  /* ================================================================ 3 */
  {
    slug: "duck-strike",
    order: 3,
    author: "craig7351",
    repo: "craig7351/DUCK-STRIKE",
    demo: "https://duck-strike.pages.dev",
    intro: "https://craig7351.github.io/DUCK-STRIKE/",
    title: { en: "DUCK STRIKE", zh: "鴨鴨突擊 DUCK STRIKE" },
    tagline: {
      en: "A browser low-poly FPS: endless AI waves in a single arena, CS-style buy phases between waves, a boss every 5 waves, and a global leaderboard on death.",
      zh: "瀏覽器低多邊形 FPS：單一競技場迎戰無盡波次 AI 敵兵、波間 CS 式買槍、每 5 波打王，死後結算上傳全球排行榜。"
    },
    genre: { en: "Wave-survival FPS", zh: "波次生存 FPS" },
    stack: ["Vue 3", "TypeScript", "Babylon.js 7", "Tailwind 4", "Vite", "CF Pages Functions", "D1"],
    period: "2026-06-26 → 2026-07-02",
    devDays: 4, commits: 27, loc: 5000,
    scores: { tech: 7, design: 7, backend: 6, quality: 7, testing: 1.5, completeness: 7.5, originality: 4.5 },
    dims: {
      tech: {
        en: "A self-built FPS stack that holds up: hitscan rays with separate head/body hitboxes, LOS occlusion rays, `sqrt(random)` uniform disc spread, trauma-squared camera shake. The gem is the **dual-timeline bullet time** — the world runs on scaled `dt` while the player and weapons keep real time (`game.ts:586-600`). Enemy AI is layered greedy avoidance without a navmesh: straight → axis-slide → angle-scan → side-lock. No real pathfinding, and the single small arena means hard perf problems never had to be solved.",
        zh: "站得住的自製 FPS 技術棧：hitscan 射線＋獨立頭／身受擊盒、LOS 遮蔽射線、`sqrt(random)` 圓盤均勻散布、trauma 平方鏡頭震動。最亮眼是**雙時間軸子彈時間**——世界用縮放 `dt`、玩家與武器維持真實時間（`game.ts:586-600`）。敵人 AI 是無 navmesh 的分層貪婪避障：直走→沿軸滑行→角度掃描→慣用側鎖定。沒有真正尋路，且單一小場景讓效能難題不需被解決。"
      },
      design: {
        en: "An interlocking loop: kill bounties + streak bonuses + headshot rewards fund the between-wave armory; streak thresholds grant heal/berserk/ammo; kills charge a time-slow ultimate; meta upgrades persist. Six weapons and six behaviorally distinct enemies. The real standout is the **touch scheme: the fire button doubles as look** — hold to shoot, drag the same finger to aim — solving the two-thumb conflict. One map only, and the boss's flagship abilities never actually trigger (see quality).",
        zh: "互相咬合的循環：擊殺獎金＋連殺加成＋爆頭獎勵餵給波間軍火庫；連殺門檻給回血／狂暴／補彈；擊殺充能時緩大絕；meta 永久升級。6 把武器、6 種行為真正不同的敵人。真亮點是**觸控方案「射擊鈕兼看視」**——按住開火、同指拖曳瞄準，解掉雙拇指衝突。弱點：單一地圖，且王的招牌招式實際不會觸發（見程式品質）。"
      },
      backend: {
        en: "Real deployed backend with above-average awareness: parameterized queries, sanitizers, difficulty whitelists, **score plausibility clamps** (`killCap = wave²·3+150`), and a self-built D1 rate limiter designed fail-open. But the trust model is still 'believe the client': the wave field accepts up to 100,000 — reporting wave=200 defeats the killCap — Turnstile was added server-side but **never wired into the client**, and the original admin key `'7351'` shipped hardcoded before being rotated (the old key still sits in BACKEND.md).",
        zh: "真實部署的後端且意識高於平均：參數化查詢、sanitizer、難度白名單、**分數合理性夾制**（`killCap = wave²·3+150`）、自建 fail-open 的 D1 限流。但信任模型仍是「相信客戶端」：wave 欄位上限 10 萬——報 wave=200 就繞過 killCap；Turnstile 只做了後端**前端根本沒接**；初版管理鍵 `'7351'` 曾硬編碼上線（舊鑰至今留在 BACKEND.md）。"
      },
      quality: {
        en: "The best-structured of the five: strict TS, a 230-line commented `config.ts` data layer, small focused modules (largest file 681 lines), minimal interfaces to break circular deps. But shipping without tests left a real bug: **`maxHpRuntime` is declared and never assigned** (`enemies.ts:53`), so the boss's enrage and minion-summon phases — headline features in the README — are dead code; the health bar also divides by unscaled HP.",
        zh: "五作中架構最好的一作：strict TS、230 行帶註解的 `config.ts` 資料層、模組小而專（最大檔 681 行）、用最小介面解循環相依。但無測試留下真 bug：**`maxHpRuntime` 宣告後從未賦值**（`enemies.ts:53`），README 大書特書的王狂暴化＋召喚小兵是死程式碼；血條分母也用了未縮放的 HP。"
      },
      testing: {
        en: "Zero automated tests, no CI. The only defense is build-time typecheck. The never-triggering boss enrage is exactly the regression a minimal unit test would have caught — the direct cost of the gap. Half a point back for the README_AI discipline of 'trust exit codes, not claims'.",
        zh: "零自動化測試、無 CI，唯一防線是 build 時 typecheck。「王永不狂暴」正是一個最小單元測試就能抓到的 regression——這是無測試的直接代價。加回半分是因為 README_AI 建立了「以 exit code 為準」的驗證紀律。"
      },
      completeness: {
        en: "Full-chain delivery in a week: deployed playable build, intro page with 8 screenshots, desktop+mobile input, synthesized SFX plus a 5-style step-sequencer soundtrack, an off-screen-rendered enemy codex, leaderboard/message board/online charts, and four docs with recorded pitfalls. Docked for the single map and for documented boss abilities that are actually dead code.",
        zh: "一週內全鏈路交付：可玩正式版部署、8 張截圖的介紹頁、桌機＋手機雙輸入、合成音效＋5 曲風步進音序器配樂、離屏渲染的敵人圖鑑、排行榜／留言板／在線圖表、四份含踩坑記錄的文件。扣分：單一地圖、文件宣稱的王招式實為死程式碼。"
      },
      originality: {
        en: "The most formulaic of the five: wave survival + CS buy economy + COD-zombies structure, and the 'duck' theme exists only in strings — the models are soldier asset packs; even the player isn't a duck. Real original touches: the kill-charged time-slow ultimate, the companion attack dog with aggro transfer, and the fire-button-as-look touch design.",
        zh: "五作中最公式化的一作：波次生存＋CS 買槍經濟＋COD 殭屍式結構，且「鴨子」主題只存在於字串——模型是士兵素材包，連玩家都不是鴨子。真正原創的點：擊殺充能時緩大絕、會引怪／咬怪的軍犬同伴、「射擊鈕兼看視」觸控設計。"
      }
    },
    highlights: [
      { en: "**Dual-timeline bullet time** — world on scaled dt, player at full speed, charge drains in real time, early-cancel keeps the remainder (`game.ts:586-600`)", zh: "**雙時間軸子彈時間**——世界縮放 dt、玩家全速、充能以真實時間消耗、可提前關閉保留餘量（`game.ts:586-600`）" },
      { en: "**Zero-file procedural audio** — all SFX synthesized, plus a parameterized 5-style step-sequencer soundtrack (`sound.ts`, `music.ts`)", zh: "**零音檔程序音訊**——全部 SFX 合成，外加參數化的 5 曲風步進音序器配樂（`sound.ts`、`music.ts`）" },
      { en: "**Layered navmesh-free avoidance** — straight → axis-slide → ±110° scan → 0.5 s side-lock debounce, each layer's intent commented (`enemies.ts:312-347`)", zh: "**無 navmesh 分層避障**——直走→軸滑行→±110° 掃描→慣用側鎖定 0.5 秒防抖，每層意圖都有註解（`enemies.ts:312-347`）" },
      { en: "**Fail-open D1 rate limiting + score clamps** — self-built because *.pages.dev has no WAF; players never get hurt by limiter errors (`_lib.ts:76-96`)", zh: "**fail-open D1 限流＋分數夾制**——明知 *.pages.dev 無 WAF 而在 Function 層自建，限流出錯不誤傷玩家（`_lib.ts:76-96`）" },
      { en: "**SECURITY_INCIDENT.md** — a first-hand record of prompt-injection attempts against the agentic dev workflow itself", zh: "**SECURITY_INCIDENT.md**——對 agentic 開發工作流本身的 prompt injection 攻擊一手記錄" }
    ],
    weaknesses: [
      { en: "**Boss enrage/summon is dead code** — `maxHpRuntime` never assigned, so the HP-phase check always reads 100% (`enemies.ts:53`)", zh: "**王的狂暴／召喚是死程式碼**——`maxHpRuntime` 從未被賦值，血量階段判斷永遠是 100%（`enemies.ts:53`）" },
      { en: "**Zero tests, zero CI** — the reason the bug above shipped and survived", zh: "**零測試零 CI**——正是上述 bug 得以上線存活的原因" },
      { en: "**Leaderboard forgeable** — wave accepts 100k, Turnstile client never wired, deviceId self-reported (`run.ts`, `App.vue:55`)", zh: "**排行榜可灌**——wave 收到 10 萬、Turnstile 前端未接、deviceId 客戶端自報（`run.ts`、`App.vue:55`）" },
      { en: "**Heartbeat unthrottled** — fake deviceIds can inflate the online-count headline number (`heartbeat.ts`)", zh: "**heartbeat 無限流**——偽造 deviceId 可灌高首頁主打的「在線人數」（`heartbeat.ts`）" },
      { en: "**Key-hygiene history** — admin key `'7351'` shipped hardcoded; the stale key still documented in BACKEND.md", zh: "**金鑰衛生史**——管理鍵 `'7351'` 曾硬編碼上線，舊鑰仍留在 BACKEND.md" }
    ],
    ai: {
      en: "All **27 commits co-authored by Claude Opus 4.8 (1M context)**. The repo contains README_AI.md — a handover doc written for 'the next AI' — and SECURITY_INCIDENT.md documenting prompt-injection attempts during development: rare first-person evidence of an agentic workflow. Cadence: six commits in 47 minutes; a gyroscope feature added and reverted within 13 minutes.",
      zh: "全部 **27 個 commit 由 Claude Opus 4.8（1M context）共同署名**。repo 內有寫給「下一個 AI」的交接文件 README_AI.md，以及記錄開發期間 prompt injection 攻擊的 SECURITY_INCIDENT.md——agentic 工作流的罕見一手證據。節奏：47 分鐘六個 commit；陀螺儀功能 13 分鐘內加入又 revert。"
    },
    special: {
      title: { en: "Rare artifact: a prompt-injection incident log", zh: "罕見文物：prompt injection 事件記錄" },
      body: [
        { en: "SECURITY_INCIDENT.md records attacks the AI workflow encountered mid-development: payloads injected through tool-result channels, a gift-card social-engineering lure, and fake tool-success messages.", zh: "SECURITY_INCIDENT.md 記錄了開發過程中 AI 工作流遭遇的攻擊：透過 tool result 通道注入的 payload、禮品卡社交工程誘餌、假的工具成功訊息。" },
        { en: "For a hobby game repo to ship a security incident report about its own AI development process is — as of 2026 — genuinely unusual, and a useful primary source on agentic-coding threat models.", zh: "一個 hobby 遊戲 repo 附上「自己 AI 開發流程」的資安事件報告，在 2026 年仍屬罕見，也是 agentic coding 威脅模型的有用一手資料。" }
      ]
    },
    verdict: {
      en: "The best code structure of the five and a clever touch-input idea, undercut by the series' recurring flaw at its most visible: a marquee boss feature that never runs because nothing ever tested it.",
      zh: "五作中最好的程式結構＋真正有想法的觸控方案，卻被系列共同缺陷以最顯眼的方式反噬：招牌王招式因為從沒被測試而根本不會發生。"
    }
  },

  /* ================================================================ 4 */
  {
    slug: "angry-pig",
    order: 4,
    author: "craig7351",
    repo: "craig7351/angry-pig",
    demo: "https://angry-pig.pages.dev",
    intro: "https://craig7351.github.io/angry-pig/",
    title: { en: "Angry Pig", zh: "憤怒豬 Angry Pig" },
    tagline: {
      en: "A first-person 3D throwing-destruction game: aim, charge, hurl balls at crate-and-brick fortresses and knock the animals off — Angry Birds re-imagined from inside the slingshot.",
      zh: "第一人稱 3D 投擲破壞遊戲：瞄準、蓄力、丟球砸垮木箱磚牆堡壘、把動物撞落地——像站進彈弓裡玩憤怒鳥。"
    },
    genre: { en: "Physics destruction", zh: "物理破壞投擲" },
    stack: ["three.js r160", "cannon-es", "JavaScript", "Vite 5", "CF Pages Functions", "D1"],
    period: "2026-07-04 → 2026-07-12",
    devDays: 7, commits: 47, loc: 3987,
    scores: { tech: 7, design: 8, backend: 6.5, quality: 6.5, testing: 1, completeness: 8, originality: 6 },
    dims: {
      tech: {
        en: "Solid physics integration: SAPBroadphase, body sleep, four ContactMaterials, and a correct fixed-step accumulator loop (1/60, max 5 substeps). The standout is `measureAnimatedBounds()` — because `Box3.setFromObject` misses skinned deformation, it samples the idle animation at 6 timestamps, applies bone transforms per vertex (with stride sampling on dense meshes) and unions the boxes. A pitfall many three.js veterans fall into, solved properly. No InstancedMesh for dynamic objects, no LOD.",
        zh: "紮實的物理整合：SAPBroadphase、body sleep、四組 ContactMaterial、正確的固定步進 accumulator 迴圈（1/60、最多 5 子步）。最亮眼是 `measureAnimatedBounds()`——因為 `Box3.setFromObject` 抓不到骨骼變形，沿 idle 動畫採樣 6 個時刻、逐頂點套骨骼變換取包圍盒聯集（高面數模型還做 stride 抽樣）。這是許多 three.js 老手都會踩的坑，被正確解掉。動態物無 InstancedMesh、無 LOD。"
      },
      design: {
        en: "The juice engineering is the best in the series: hit-stop that scales with combo (capped 0.11 s), combo pitch rising a semitone per hit, an in-flight score counter with comet trail and milestone burst text, and an **air-snipe bounty** (2.5 m off the ground, once per animal to prevent farming). The economy deliberately decouples coins from score 'to avoid inflation'; 15 hand-built levels teach chain-collapse via explosive foundations. First-person fixed positioning limits depth; late-game special balls are badly imbalanced.",
        zh: "爽感工程是系列最佳：隨連擊加長的 hit-stop（封頂 0.11 秒）、每連擊升半音的 combo 音階、飛行中即時計數器＋彗星拖尾＋里程碑爆字、**空中狙擊賞金**（需離地 2.5m 且每隻限一次防 farm）。經濟刻意把金幣與分數脫鉤「避免通膨」；15 個手工關卡用爆裂物地基教連鎖倒塌。弱點：第一人稱固定站位限制縱深，後期特殊彈性價比失衡。"
      },
      backend: {
        en: "Careful cost engineering — parameterized queries, dual-layer XSS defense, IP rate limits, edge caching (30–300 s), full CSP in `_headers`, and the presence system's evolution from ~1,900 requests/tab/day heartbeats to check-in-once with 13% probabilistic maintenance, each step quantified in commit messages. Then the blunders: **README literally prints the ADMIN_KEY `0501`** in its deploy instructions, message DELETE is unthrottled (a 4-digit key, brute-forceable), scores are forgeable (wave=60 → ~18M points), and names are identities so anyone can impersonate the leaderboard.",
        zh: "用心的成本工程——參數化查詢、雙層 XSS 防禦、IP 限流、邊緣快取（30–300 秒）、`_headers` 完整 CSP，以及線上人數從「每分頁每天 ~1900 請求」的心跳制演進到進場制＋13% 機率性維護，每步 commit 都附量化數據。然後是失誤：**README 直接把 ADMIN_KEY `0501` 明碼寫進部署指令**、留言 DELETE 無限流（4 位數密碼可暴力破解）、分數可偽造（報 wave=60 可灌 1800 萬分）、name 即身分可冒名霸榜。"
      },
      quality: {
        en: "Comment quality is exceptional (nearly every block explains *why*, e.g. why leaderboard keys avoid emoji variation selectors), and the **level-building DSL** (`stack`/`tower`/`plankTower` combinators) defines 15 levels in a few lines each. But `fps.js` is a 2,612-line single file mixing rendering, physics, UI, network, levels and shop — and dropping TypeScript costs: the `game` object carries 20+ dynamic fields and entities are typed by ad-hoc tags like `e.boss`.",
        zh: "註解品質極高（幾乎每區塊解釋「為什麼」，例如排行榜 key 為何避用 emoji 變體選擇字），**關卡建造 DSL**（`stack`／`tower`／`plankTower` 組合子）讓 15 關各只需幾行定義。但 `fps.js` 是 2,612 行單檔，渲染、物理、UI、網路、關卡、商店全混一起——且放棄 TypeScript 的代價明顯：`game` 物件 20+ 個動態欄位、entity 靠 `e.boss` 之類隨貼標籤區分。"
      },
      testing: {
        en: "Zero everything: no test files, no test script, no CI, and — unlike the TS siblings — no typecheck as a fallback line of defense. High-regression-risk physics and scoring formulas rely entirely on manual play.",
        zh: "全零：無測試檔、無 test script、無 CI，且不同於 TS 兄弟作——連型別檢查這道替代防線都沒有。高回歸風險的物理參數與計分公式全靠手動驗證。"
      },
      completeness: {
        en: "Nine days, astonishing delivery: 4 modes, 15 levels, 8 special balls, bosses, 4 biomes, mobile touch with iOS crosshair fixes, a settings menu, opening camera sweep, one-time tutorial, offline fallback, a thorough README with deploy steps, an intro page, screenshots and a YouTube video.",
        zh: "九天做到驚人交付量：4 種模式、15 關、8 種特殊彈、Boss、4 種 biome、手機觸控含 iOS 準星修正、設定選單、開場運鏡、一次性新手教學、離線 fallback、含部署步驟的詳盡 README、介紹頁、截圖與 YouTube 影片。"
      },
      originality: {
        en: "An open Angry Birds homage — but the perspective shift is a substantive gameplay change: 2D side-view parabolas become first-person charging with a predicted-arc dot, a genuinely different aiming feel. Add the highest-flight leaderboard, air-snipe double hits, and physics-toy special balls (summon pig, black hole, tornado): derivative theme, original execution.",
        zh: "公開致敬憤怒鳥——但視角轉換是實質玩法變化：2D 側視拋物線變成第一人稱蓄力＋拋物線預測點，瞄準體驗完全不同。再加「飛最高」獨立排行榜、空中狙擊二段擊、召喚豬／黑洞／龍捲等物理玩具特殊彈：衍生題材、原創執行。"
      }
    },
    highlights: [
      { en: "**Skinned-mesh animated bounds** — samples the idle animation at 6 timestamps and unions per-vertex bone-transformed boxes, fixing floating feet (`fps.js:402-432`)", zh: "**蒙皮動畫包圍盒採樣**——沿 idle 動畫 6 個時刻逐頂點套骨骼變換取聯集，解決動物腳浮空（`fps.js:402-432`）" },
      { en: "**Quota-driven backend evolution** — heartbeat → conditional upsert → check-in, each commit quantified (~1,900 req/day → 1-2 req/session)", zh: "**免費額度驅動的後端演進**——心跳→條件式 upsert→進場制，每步 commit 附量化數據（~1900 req/天 → 每場 1-2 req）" },
      { en: "**Level-building DSL** — `tower()`/`plankTower()` combinators make an 8-line skyscraper level; the same helpers drive deathmatch procedural generation (`fps.js:1289-1329`)", zh: "**關卡建造 DSL**——`tower()`／`plankTower()` 組合子讓「摩天要塞」只需 8 行，同套 helper 直接複用到死鬥程序生成（`fps.js:1289-1329`）" },
      { en: "**Layered game feel** — hit-stop + combo pitch + milestone burst text + screen shake, all hand-written and mutually tuned", zh: "**打擊感堆疊**——hit-stop＋combo 音階＋里程碑爆字＋畫面震動，全手寫且互相配合" },
      { en: "**Dual-layer degradation** — every API call has a localStorage fallback; fully playable with no backend at all (`fps.js:1770-1792`)", zh: "**雙層降級策略**——每個 API 呼叫都有 localStorage fallback，完全沒有後端也能完整遊玩（`fps.js:1770-1792`）" }
    ],
    weaknesses: [
      { en: "**ADMIN_KEY printed in the README** (`printf 0501 | npx wrangler …`) and message DELETE unthrottled — a brute-forceable 4-digit key (`README.md:112`)", zh: "**ADMIN_KEY 明碼寫進 README**（`printf 0501 | npx wrangler …`）且留言 DELETE 無限流——4 位數密碼可暴力破解（`README.md:112`）" },
      { en: "**Scores fully forgeable** — self-reported wave=60 yields ~18M points; name-keyed ranking allows impersonation (`score.js`)", zh: "**分數可完全偽造**——自報 wave=60 可灌 1800 萬分；排名以 name 聚合可冒名（`score.js`）" },
      { en: "**2,612-line single file** with no module boundaries; no TS means 20+ untyped dynamic fields on `game` (`fps.js`)", zh: "**2,612 行單檔**無模組邊界；無 TS 使 `game` 物件 20+ 個動態欄位毫無防護（`fps.js`）" },
      { en: "**Zero tests, zero CI, zero typecheck**", zh: "**零測試、零 CI、零型別檢查**" },
      { en: "**Rate-limiter race** — SELECT and INSERT are not atomic; concurrent requests slip through (`_lib.js:46-57`)", zh: "**限流競態**——SELECT 與 INSERT 非原子，並發請求可同時通過（`_lib.js:46-57`）" }
    ],
    ai: {
      en: "46 of 47 commits co-authored by Claude Opus 4.8, every message wrapped in an `@` prefix from the automation tooling. Burst cadence (11 commits on 7/5, 15 on 7/11), quantified commit messages, and a human clearly in the loop for real-world issues — Cloudflare quotas, iOS viewport quirks, emoji variation selectors.",
      zh: "47 個 commit 中 46 個由 Claude Opus 4.8 共同署名，所有訊息帶自動化工具的 `@` 前綴包裝。爆量節奏（7/5 一天 11 個、7/11 一天 15 個）、量化的 commit message，且人明顯在迴圈中處理真實世界問題——Cloudflare 額度、iOS viewport、emoji 變體選擇字。"
    },
    special: null,
    verdict: {
      en: "The best game-feel of the series and a real physics-engineering gem, shipped with the series' worst safety story: no tests, no types, and an admin key printed in the manual.",
      zh: "系列中手感最好的一作＋一顆真正的物理工程寶石，卻配上系列最差的安全故事：無測試、無型別、管理密鑰直接印在說明書裡。"
    }
  },

  /* ================================================================ 5 */
  {
    slug: "angry-baseball",
    order: 5,
    author: "craig7351",
    repo: "craig7351/angry-baseball",
    demo: "https://angry-baseball.pages.dev",
    intro: "https://craig7351.github.io/angry-baseball/",
    title: { en: "Angry Baseball", zh: "憤怒棒球 Angry Baseball" },
    tagline: {
      en: "A first-person 3D batting game: a pig pitches, you time the swing with a crosshair, and the outfield is packed with destructible targets — animal towers, chain-explosive barrels and a flying JACKPOT golden pig.",
      zh: "第一人稱 3D 棒球打擊：投手是一隻豬，滑鼠準星＋時機點擊揮棒，外野擺滿可破壞目標——動物觀眾塔、連環爆桶、橫越天際的 JACKPOT 金豬。"
    },
    genre: { en: "Batting × physics destruction", zh: "棒球打擊 × 物理破壞" },
    stack: ["three.js r160", "cannon-es", "JavaScript", "Vite 5", "puppeteer E2E", "CF Pages Functions", "D1"],
    period: "2026-07-11 → 2026-07-18",
    devDays: 8, commits: 16, loc: 4300,
    scores: { tech: 7, design: 7.5, backend: 6.5, quality: 7, testing: 3, completeness: 8, originality: 6.5 },
    dims: {
      tech: {
        en: "Real math where it matters: the pitch release solves initial velocity analytically **compensating gravity and the breaking-ball's constant acceleration together**, so curves still cross the strike zone precisely (`game.js:229-239`). Batting skips rigid-body bat collision for a tunable two-axis model — timing (early=pull, late=push) × aim (under the ball = fly) — blended into an impulse for cannon-es. Simplified per-tick Magnus force; every texture is procedural canvas (turf stripes, ball seams, sky). No shaders or post-processing; the hard physics problems are deliberately routed around.",
        zh: "該用數學的地方是真數學：投球依球種目標點解析反解初速，**同時補償重力與變化球恆定加速度**，曲球下墜後仍準確進壘（`game.js:229-239`）。打擊不做球棒剛體碰撞，改用可調校的雙軸模型——時機軸（早揮拉打／晚揮推打）× 準星軸（壓球心下緣打高飛）——混合成衝量交給 cannon-es。每 tick 施加簡化 Magnus 力；全部貼圖為程序 canvas 生成（草皮條紋、棒球縫線、天空）。無 shader／後處理，物理難點被刻意繞開。"
      },
      design: {
        en: "The 'every pitch must pay off' juice philosophy fully executed: a shrinking timing ring that snaps green in the zone, a PERFECT metallic ring whose synthesis varies continuously with quality, combo pitch ladders, crowd volume scaling with distance, and full-screen record-break text. Intermittent reinforcement by design (golden balls on pitches 5 and 9, a bomb ball that rewards *not* swinging, a 4% chicken pitch, a JACKPOT pig crossing the outfield) — PLAN.md literally cites it as the addiction mechanism. Nine bats with real feel differences. Docked for inheriting most systems 90-100% from angry-pig.",
        zh: "「每球必有回饋」的 juice 哲學被徹底執行：貼合好球帶瞬間變綠的時機縮圈、依品質連續變化的 PERFECT 金屬鏗聲、combo 音階、隨距離漸強的群眾歡呼、破紀錄全螢幕大字。有意識的間歇性強化設計（第 5、9 球必出黃金球、「忍住不揮 +100」的炸彈球、4% 投手丟雞、橫越外野的 JACKPOT 金豬）——PLAN.md 明寫這是上癮機制。9 支球棒有真實手感差異。扣分：多數系統 90-100% 繼承自 angry-pig。"
      },
      backend: {
        en: "The most defense-aware backend of the five: per-mode plausibility caps (distance board 400 m; survival estimated from the note field **which is itself capped to prevent bypass**), an audit log, and an **in-game read-only admin dashboard** where the rate-limit `hits` column doubles as an attack signal. The staggered-submit fix (two boards hitting the same 3 s IP limit → frontend delays the second by 3.5 s) shows self-debugging, though it patches the backend with a client hack. Same family sins: the `'0501'` admin password sits in a test file, and names are identities.",
        zh: "五作中防禦意識最高的後端：per-mode 合理性上限（最遠榜 400m；生存榜依 note 欄位估算且 **note 本身也封頂防繞過**）、audit 記錄、**遊戲內建唯讀管理面板**——限流表 `hits` 欄位兼作攻擊訊號。「結算送分錯開限流」修復（兩榜撞同 IP 3 秒限流→前端把第二筆延後 3.5 秒）顯示自我除錯能力，雖然本質是用 client hack 補後端設計。家族通病依舊：`'0501'` 管理密碼躺在測試檔裡、name 即身分。"
      },
      quality: {
        en: "Reasonable module boundaries where it counts: `batting.js` is a zero-dependency pure function ('pure math, no deps' says its header), `fx.js` uses dependency injection to break circular imports, dispose discipline is complete. But `game.js` is a 1,781-line everything-file — state machine, UI wiring, shop, leaderboard client, admin client, touch stick — contradicting PLAN.md's own module plan.",
        zh: "該切的地方切了：`batting.js` 是零依賴純函式（檔頭自述「純數學，無相依」）、`fx.js` 用依賴注入解循環引用、dispose 紀律完整。但 `game.js` 是 1,781 行大雜燴——狀態機、UI 佈線、商店、排行榜 client、管理面板、觸控搖桿全塞一檔，與 PLAN.md 自己規劃的拆分背道而馳。"
      },
      testing: {
        en: "The only project in the series with tests at all: 8 puppeteer-core E2E scripts, including **a bot that actually plays baseball** — polling a debug hook for the ball's z-position and clicking the swing at the right moment, completing full 10-pitch games. But none of them assert anything (console.log for eyeball judgment), there is no CI, the Chrome path is hardcoded to Windows, and the perfectly testable `batting.js` pure function has zero unit tests. Verification scripts for an AI workflow, not a regression suite.",
        zh: "系列唯一有測試的專案：8 個 puppeteer-core E2E 腳本，包括**一個真的會打棒球的 bot**——輪詢 debug 鉤子讀球的 z 座標、在正確時機點擊揮棒，能打完整場 10 球。但全部沒有斷言（console.log 目視判讀）、無 CI、Chrome 路徑寫死 Windows，且最可測的 `batting.js` 純函式零單元測試。是 AI 工作流的驗證腳本，不是回歸測試套件。"
      },
      completeness: {
        en: "A professional-grade delivery for ~a week: 4 modes, 12 challenges, a 9-bat shop, 4 leaderboards, threaded message board, admin dashboard, 7-day peak chart, mobile stick, settings, onboarding, opening camera sweep — deployed with a marketing page and YouTube embed, fully playable offline. Docked for documentation drift: the README still advertises the slow-motion ball-cam that a commit explicitly removed.",
        zh: "約一週的專業級交付：4 種模式、12 關挑戰、9 支球棒商店、4 個排行榜、分層留言板、管理面板、7 天尖峰折線圖、手機搖桿、設定、新手引導、開場運鏡——已部署＋行銷頁＋YouTube 嵌入、離線完整可玩。扣分：文件漂移——README 仍宣稱已被 commit 明確移除的慢動作追球。"
      },
      originality: {
        en: "Home-run derby games are plentiful; putting **destructible physics targets in the outfield** is not. Bomb balls that reward restraint, a pitcher who throws chickens, a joke salted-fish bat — the comedy toolkit builds a personality. Still the fifth work in its own universe, on its predecessor's engine, with a rhythm-game timing core: clever recombination rather than invention.",
        zh: "全壘打大賽遊戲很多；**把可破壞物理目標搬進外野**的不多。獎勵忍住不揮的炸彈球、丟雞的投手、鹹魚棒的搞笑組合建立了個性。但它仍是自家宇宙的第五作、跑在前作引擎上、核心是節奏遊戲的時機判定：聰明的重組而非發明。"
      }
    },
    highlights: [
      { en: "**Analytic pitch solution** — initial velocity solved with gravity + break acceleration compensated together, one clear comment explaining the math (`game.js:229-239`)", zh: "**投球解析解**——反解初速同時補償重力與變化球加速度，一行註解講明白數學（`game.js:229-239`）" },
      { en: "**Two-axis batting model** — timing × aim as a pure function with centralized tunables (`batting.js:45-86`)", zh: "**時機＋準星雙軸打擊模型**——純函式、參數集中、可調校（`batting.js:45-86`）" },
      { en: "**Cost-engineered backend** — check-in presence, edge caches, and `Math.random()<0.13` opportunistic table cleanup (`online.js`, `_lib.js`)", zh: "**成本工程級後端**——進場制、邊緣快取、`Math.random()<0.13` 機會性清表（`online.js`、`_lib.js`）" },
      { en: "**In-game attack-analytics dashboard** — rate-limit hits as attack signals, audit event categories, presence-flooding detection (`admin.js`)", zh: "**遊戲內建攻擊分析儀表板**——限流 hits 兼作攻擊訊號、audit 事件分類、灌水偵測（`admin.js`）" },
      { en: "**A test bot that plays baseball** — reads `window.__dbgBallZ` through a debug hook and completes full games headlessly (`test/smoke.mjs`)", zh: "**會打棒球的測試 bot**——透過 debug 鉤子讀 `window.__dbgBallZ`，無頭環境打完整場（`test/smoke.mjs`）" }
    ],
    weaknesses: [
      { en: "**Admin password `'0501'` committed** in `test/admin.mjs:23` — even as a dev key, it signals weak password habits", zh: "**管理密碼 `'0501'` 進了公開 repo**（`test/admin.mjs:23`）——即使是 dev key 也暗示密碼強度習慣" },
      { en: "**Names are identities** — anyone can impersonate or merge onto another player's leaderboard entry (`leaderboard.js:16-26`)", zh: "**排行榜以玩家名字為身分**——冒名頂替、合併他人分數零成本（`leaderboard.js:16-26`）" },
      { en: "**Tests without assertions, no CI, non-portable** — hardcoded Windows Chrome path; `batting.js` has zero unit tests", zh: "**測試無斷言、無 CI、不可移植**——Chrome 路徑寫死 Windows；`batting.js` 純函式零單元測試" },
      { en: "**1,781-line monolith** contradicting its own PLAN.md module split (`game.js`)", zh: "**game.js 1,781 行單體**——與自家 PLAN.md 規劃的拆分背道而馳" },
      { en: "**Documentation drift** — README advertises removed features; a self-admitted dead `hitStop` variable remains (`README.md:20`)", zh: "**文件漂移**——README 宣稱已移除的功能；自承是死代碼的 `hitStop` 變數仍殘留（`README.md:20`）" }
    ],
    ai: {
      en: "All **16 commits co-authored by Claude Fable 5** — the author upgraded models mid-series (the first four games were Opus 4.8). The first commit lands ~3,600 lines of playable game including backend, tests and a plan document. The repo ships a **custom Claude Code skill** (`.claude/skills/ui-assets`) teaching the AI to cut sprite sheets with PIL flood-fill, and the game exposes `window.__DBG` hooks designed specifically for headless AI self-verification. Doc-driven development: PLAN.md precedes the code, with a reuse-ratio table against angry-pig.",
      zh: "全部 **16 個 commit 由 Claude Fable 5 共同署名**——作者在系列中途升級了模型（前四作是 Opus 4.8）。首 commit 一次落地約 3,600 行可玩遊戲，含後端、測試與企劃書。repo 內附**自製 Claude Code skill**（`.claude/skills/ui-assets`）教 AI 用 PIL flood-fill 切素材，遊戲並暴露專為無頭 AI 自我驗證設計的 `window.__DBG` 鉤子。文檔驅動開發：PLAN.md 先於程式碼，附對 angry-pig 的複用比例表。"
    },
    special: null,
    verdict: {
      en: "The most mature entry in the series: real math in the physics, the first appearance of tests (however assertion-less), the sharpest backend defenses — and the same monolith habit and weak-password signature carried over one more time.",
      zh: "系列最成熟的一作：物理裡有真數學、測試首次登場（雖然沒有斷言）、後端防禦最鋒利——但單體檔案的習慣與弱密碼的簽名又一次被帶了過來。"
    }
  },

  /* ================================================================ 6 */
  {
    slug: "ssd",
    order: 6,
    author: "ocf",
    repo: "ocftw/ssd",
    demo: "https://ssd.ocf.tw/",
    intro: "https://ssd.ocf.tw/games/",
    title: { en: "SSD · Shield of Self-Defense", zh: "資安新手村 SSD" },
    tagline: {
      en: "OCF's digital-security curriculum for Taiwanese civil-society organizations: 94 pages of localized security guidance, policy templates — and, hidden inside, a full 7,600-line Three.js 3D teaching game.",
      zh: "開放文化基金會給台灣公民團體的資安防護基礎教材：94 頁在地化資安指引、政策範本——而且裡面還藏著一款 7,600 行的 Three.js 3D 教學遊戲。"
    },
    genre: { en: "Security curriculum + 3D teaching game", zh: "資安教材網站＋3D 教學遊戲" },
    stack: ["MkDocs Material", "Python 3.11 + uv", "Three.js 0.184", "GitHub Actions", "Cloudflare", "Tor onion"],
    period: "2024-09-23 → 2026-07-16",
    devDays: 660, commits: 160, loc: 7600,
    dimLabels: { design: { en: "Content & Pedagogy", zh: "內容／教學設計" } },
    scores: { tech: 7.5, design: 8.5, backend: 7, quality: 7, testing: 2.5, completeness: 8, originality: 8.5 },
    dims: {
      tech: {
        en: "Far above average for a docs site: a custom MkDocs build hook does **content-hash cache-busting for ES modules** (with idempotency and stable hash ordering), 12 theme overrides plus 1,820 lines of custom CSS, and 8 plugins including `llms.txt` generation for AI consumption. The embedded 3D game brings procedural terrain, InstancedMesh vegetation, a post-processing pipeline, device-tiered quality, Web Audio synthesis and a three-language structure-text-separated i18n architecture — fully vendored, fully offline.",
        zh: "以文件網站而言遠超平均：自寫 MkDocs build hook 對 **ES module 做內容雜湊快取破壞**（含冪等性與固定雜湊順序）、12 個主題 override＋1,820 行自訂 CSS、8 個外掛含產出 `llms.txt` 供 AI 取用。嵌入式 3D 遊戲有程序化地形、InstancedMesh 植被、後處理管線、依裝置分檔畫質、Web Audio 合成音效、三語「結構與文字分離」i18n 架構——完整 vendored、全離線。"
      },
      design: {
        en: "Professionally engineered pedagogy: written editorial rules target a junior-high reading level and mandate 'concrete steps, never concepts alone' with counter-example contrast; a standard chapter template specifies time / budget / protection level per lesson. Content is technically correct and current (Passkey/FIDO2 anti-phishing explained properly; the VPN comparison cites third-party audits) and the **8-chapter NGO security-policy template maps onto actual Taiwanese nonprofit governance**. The consultant toolkit is thin and leans on a non-public Google Docs deck.",
        zh: "被工程化的專業教學設計：明文寫作規範鎖定國中生閱讀程度、「一定要給具體做法不能只給觀念」並附反例對照；標準章節模板規定每課的操作時間／預算／防護力。內容技術正確且跟上時代（Passkey/FIDO2 抗釣魚機制解釋到位；VPN 比較表附第三方稽核註腳），**8 章 NGO 資安政策範本直接對應台灣非營利組織治理結構**。弱點：顧問工具包偏薄且依賴需權限的 Google 簡報。"
      },
      backend: {
        en: "No backend — but deployment security practices walk the talk: a **Tor onion service with `onion-location` headers on every page**, the privacy plugin self-hosting third-party assets, CVE-aware dependency bumps in CI, minimal-scope Cloudflare purge tokens, and an XSS-escaping helper in the game that even got a fix for unescaped single quotes. The one glaring contradiction: a privacy-education site **ships Google Analytics**.",
        zh: "無後端——但部署層身體力行：**Tor onion service 且每頁送出 `onion-location` header**、privacy 外掛把第三方資產本地化、CI 有 CVE 意識的依賴升級、最小範圍的 Cloudflare purge token、遊戲的 XSS 轉義 helper 甚至修過漏轉單引號。唯一刺眼的矛盾：一個隱私教育網站**掛著 Google Analytics**。"
      },
      quality: {
        en: "Well-organized configuration with commented decisions, a docstring-ed cache-bust hook, visible refactoring discipline in the game code (a dedicated dedupe/dead-code commit produced `util.js`), consistent frontmatter. Legacy debt shows: the `asserts/` (sic) directory typo permeates the site, personal-security content is split across two directory trees, and the game's `main.js` is 3,755 lines with no linter anywhere.",
        zh: "組織清楚且關鍵決策有註解的設定、有 docstring 的 cache-bust hook、遊戲程式碼可見重構紀律（專門的去重複／清死碼 commit 產出 `util.js`）、frontmatter 一致。歷史債也明顯：`asserts/`（拼錯的 assets）目錄錯字貫穿全站、個人資安內容分裂在兩個目錄樹、遊戲 `main.js` 單檔 3,755 行、全案無 linter。"
      },
      testing: {
        en: "The weakest dimension: the only workflow builds and deploys on push — **no PR CI, no linkcheck, no markdown lint, and MkDocs strict mode is off**, so broken links warn instead of failing. The hook and 7,600 lines of game JS have zero tests. Build success is the only quality gate for a 94-page curriculum.",
        zh: "最弱面向：唯一的 workflow 只在 push 時 build＋部署——**沒有 PR CI、沒有 linkcheck、沒有 markdown lint、mkdocs 未開 strict mode**，斷鏈只警告不擋版。hook 與 7,600 行遊戲 JS 零測試。94 頁教材的品質閘門只有「build 有過」。"
      },
      completeness: {
        en: "All 8 advertised topics landed as 94 markdown pages (~260k characters — roughly a 250-page book), plus an 11-post blog series, checklists, the policy template, a trilingual game, issue templates, contribution guides and licensing docs. Live and tied to real-world events (a forum sign-up on the site). Maintenance is bursty: ~10 commits in the year to 2025-11, then 116 in June 2026.",
        zh: "宣告的 8 大主題全數落地為 94 個 markdown 頁（約 26 萬字元——相當於 250 頁的書），外加 11 篇部落格系列文、檢查清單、政策範本、三語遊戲、issue 模板、貢獻指南與授權說明。線上營運且結合實體活動（站上有論壇報名）。維護節奏不均：到 2025-11 的一年間僅約 10 個 commit，2026-06 單月爆出 116 個。"
      },
      originality: {
        en: "Not a translation compilation of EFF SSD / Security-in-a-Box, but an original localized rewrite: LINE web-login 2FA, hijacked Facebook pages, NT$ budget ranges, Taiwan VPN node comparisons, a Signal/email incident-reporting channel, and governance-aware policy templates. Sources are honestly credited. And 'teach security via a 3D adventure game' — five ruins as five courses, wrong answers as learning moments — is a genuinely rare pedagogical move in this space.",
        zh: "不是 EFF SSD／Security-in-a-Box 的翻譯彙編，而是原創的在地化重寫：LINE 網頁登入雙重認證、粉專被盜、台幣預算區間、VPN 台灣節點比較、Signal／email 通報管道、貼合治理結構的政策範本。參考來源誠實列出。而「用 3D 探險遊戲教資安」——五座遺跡＝五門課、答錯是學習點——在這個領域是罕見的原創教學法。"
      }
    },
    highlights: [
      { en: "**An embedded Three.js teaching game** — 7,600 lines, trilingual, fully offline, with turn-based quiz combat and five skill-practice stations (`docs/games/`)", zh: "**嵌入式 Three.js 教學遊戲**——7,600 行、三語、全離線，含回合制問答戰鬥與 5 座技能練習站（`docs/games/`）" },
      { en: "**Content-hash cache-bust hook** — solves real mixed-version ES-module deploys, with idempotency and stable hash ordering (`hooks/cache_bust.py`)", zh: "**內容雜湊快取破壞 hook**——解決 ES module 部署新舊混搭的真實問題，含冪等性與固定雜湊順序（`hooks/cache_bust.py`）" },
      { en: "**Tor onion + `onion-location`** — a security curriculum that practices what it preaches on anonymous access (`overrides/main.html`)", zh: "**Tor onion＋`onion-location`**——資安教材身體力行提供匿名存取管道（`overrides/main.html`）" },
      { en: "**A ready-to-adopt NGO security-policy template** — 8 chapters mapped to Taiwanese nonprofit governance (`docs/org/policy/template.md`)", zh: "**可直接採用的 NGO 資安政策範本**——8 章條文貼合台灣非營利組織治理（`docs/org/policy/template.md`）" },
      { en: "**Editorial rules as code** — audience-fit turned into executable writing constraints, plus `llms.txt` for AI consumers (`contexts/writting_rules.md`)", zh: "**寫作規範文件化**——把受眾適配變成可執行的編輯規則，並產出對 AI 友善的 `llms.txt`（`contexts/writting_rules.md`）" }
    ],
    weaknesses: [
      { en: "**Nearly no CI quality checks** — no PR CI, no linkcheck/lint, strict mode off; 94 pages of links verified by hand", zh: "**幾乎沒有 CI 品質檢查**——無 PR CI、無 linkcheck／lint、strict mode 未開；94 頁教材的連結全靠人工" },
      { en: "**Privacy contradiction** — Google Analytics on a privacy-education site (`mkdocs.yml:239-241`)", zh: "**隱私矛盾**——隱私教育網站掛 Google Analytics（`mkdocs.yml:239-241`）" },
      { en: "**Thin consultant toolkit** relying on a permission-gated Google Docs deck, with placeholder text left in (`docs/guide/assessment.md`)", zh: "**顧問工具包偏薄**且依賴需權限的 Google 簡報，留有佔位文字（`docs/guide/assessment.md`）" },
      { en: "**Information-architecture debt** — split directory trees and the site-wide `asserts/` typo", zh: "**資訊架構歷史債**——目錄分裂與全站沿用的 `asserts/` 錯字" },
      { en: "**Opaque attribution** — 87% of commits from a shared org account; individual contributions untraceable", zh: "**貢獻歸屬不透明**——87% commit 出自共用帳號，個人貢獻無法追溯" }
    ],
    ai: {
      en: "Different in kind from craig7351's repos: an **organization-operated project** — 139 of 160 commits from the shared `ssd@ocf.tw` account, an OCF staff member, three external contributors, PR flow with issue references since 2026, deploy-branch strategy and secrets management. The June 2026 burst of 116 commits (mostly the game) suggests a single, likely AI-assisted development pipeline arriving late in the project's life.",
      zh: "與 craig7351 的 repo 是不同物種：**組織營運型專案**——160 個 commit 中 139 個出自共用帳號 `ssd@ocf.tw`，加上一位 OCF 職員、三位外部貢獻者，2026 年起有引用 issue 的 PR 流程、部署分支策略與 secrets 管理。2026-06 單月 116 個 commit 的爆發（多為遊戲開發）暗示一條疑似 AI 輔助的開發管道在專案後期加入。"
    },
    special: {
      title: { en: "A different species: the organizational project", zh: "不同物種：組織型專案" },
      body: [
        { en: "Where craig7351's games are one person + one AI at maximum velocity, ssd is infrastructure: a shared account, PR reviews, issue templates, an upstream-sync branch model, bot deployments and scoped tokens. Slower, but built to outlive any individual contributor.", zh: "craig7351 的遊戲是「一人＋一 AI」的極速衝刺；ssd 則是基礎設施：共用帳號、PR 審核、issue 模板、上游同步分支模型、bot 部署與最小權限 token。慢，但被設計成能活得比任何個人貢獻者久。" },
        { en: "The trade shows in the scores: ssd wins originality and content design by a wide margin and is the only project with real institutional continuity — yet its testing gap (no CI checks for a 94-page curriculum) mirrors the same industry-wide blind spot the games have.", zh: "取捨反映在分數上：ssd 在原創性與內容設計大幅領先，也是唯一有真實制度延續性的專案——但它的測試缺口（94 頁教材沒有 CI 檢查）與遊戲們踩的是同一個全行業盲點。" }
      ]
    },
    verdict: {
      en: "The highest total score in the audit: original localized content with professional pedagogy, deployment security that practices what it teaches, and a surprise 3D game inside. Its gaps — no CI, a GA tracker on a privacy site — are fixable process debts, not design flaws.",
      zh: "本次體檢總分最高：原創在地化內容＋專業教學設計、身體力行的部署安全，還藏了一款 3D 遊戲。它的缺口——沒有 CI、隱私網站掛 GA——是可修的流程債，不是設計缺陷。"
    }
  }
];
