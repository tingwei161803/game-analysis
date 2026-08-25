/* =========================================================================
   Game Project Report Card · app.js  (vanilla, zero build)

   Layout engine: reads document.body[data-page], picks a renderer, paints
   into <main id="page">. Reuses the shared toolkit on window.LDW (t,
   escapeHtml, state, dialog, pageHref) injected by shell.js.

   Every human-facing string comes from a {en,zh} object via LDW.t(); every
   data-derived string is escaped before innerHTML. Which of the two comes out
   is fixed by the page's own <html lang> — the other language is a different
   URL, so there is no in-page language switch to repaint.
   ========================================================================= */
(function () {
  "use strict";

  function boot() {
    var L = window.LDW;
    if (!L || !L.ready) { document.addEventListener("ldw:shell-ready", boot, { once: true }); return; }
    run(L);
  }

  function run(L) {
    var t = L.t, esc = L.escapeHtml, state = L.state;
    var PROJECTS = (window.GA_PROJECTS || []).slice().sort(function (a, b) { return a.order - b.order; });
    var DIMS = window.GA_DIMS || [];
    var WEIGHTS = window.GA_WEIGHTS || {};
    var AUTHORS = window.GA_AUTHORS || {};
    var METHOD = window.GA_METHOD || {};
    var GLOSS = window.GA_GLOSSARY || [];
    var page = L.currentPage() || {};

    /* ---------- helpers ---------- */
    var byslug = {};
    PROJECTS.forEach(function (p) { byslug[p.slug] = p; });

    function total(p) {
      var s = 0;
      DIMS.forEach(function (d) { s += (p.scores[d.key] || 0) * (WEIGHTS[d.key] || 0); });
      return Math.round(s * 10) / 10;
    }
    function fmt1(n) { return (Math.round(n * 10) / 10).toFixed(1); }
    function authorColor(key) { return "var(--" + ((AUTHORS[key] || {}).color || "s1") + ")"; }
    function dimLabel(p, d) {
      if (p && p.dimLabels && p.dimLabels[d.key]) return t(p.dimLabels[d.key]);
      return t(d.label);
    }
    /* escape then apply light inline markup (**bold**, `code`) safely */
    function rich(obj) {
      var s = esc(t(obj));
      s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
      s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
      return s;
    }
    /* blue sequential ramp for the heatmap (score 1..10 -> step) */
    var RAMP = ["--q100","--q150","--q200","--q250","--q300","--q350","--q400","--q450","--q550","--q650"];
    function heatColor(v) {
      var i = Math.max(0, Math.min(RAMP.length - 1, Math.round(v) - 1));
      return "var(" + RAMP[i] + ")";
    }
    function heatInk(v) { return v >= 6 ? "#fff" : "var(--ink)"; }
    function scoreColorVar(v) {
      if (v >= 8) return "var(--good)";
      if (v <= 3) return "var(--bad)";
      return "var(--accent)";
    }
    var main = document.getElementById("page");

    /* ---------- shared tooltip ---------- */
    var tip = document.createElement("div");
    tip.className = "tip"; tip.setAttribute("role", "status");
    document.body.appendChild(tip);
    function showTip(html, x, y) {
      tip.innerHTML = html;
      tip.classList.add("show");
      var pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
      var left = x + pad, top = y + pad;
      if (left + w > window.innerWidth - 8) left = x - w - pad;
      if (top + h > window.innerHeight - 8) top = y - h - pad;
      tip.style.left = Math.max(8, left) + "px";
      tip.style.top = Math.max(8, top) + "px";
    }
    function hideTip() { tip.classList.remove("show"); }
    function bindTip(el, html) {
      el.addEventListener("mousemove", function (e) { showTip(html, e.clientX, e.clientY); });
      el.addEventListener("mouseleave", hideTip);
    }

    /* ---------- SVG radar (small multiple) ---------- */
    function radarSVG(p, size, stroke) {
      var n = DIMS.length, cx = size / 2, cy = size / 2, R = size / 2 - 18;
      var rings = [0.25, 0.5, 0.75, 1];
      function pt(i, rad) {
        var a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      }
      var g = "";
      rings.forEach(function (rr) {
        var pts = [];
        for (var i = 0; i < n; i++) { var q = pt(i, R * rr); pts.push(q[0].toFixed(1) + "," + q[1].toFixed(1)); }
        g += '<polygon points="' + pts.join(" ") + '" fill="none" stroke="var(--hairline)" stroke-width="1"/>';
      });
      for (var i = 0; i < n; i++) {
        var e = pt(i, R);
        g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="var(--hairline)" stroke-width="1"/>';
      }
      var dpts = [];
      DIMS.forEach(function (d, idx) {
        var v = (p.scores[d.key] || 0) / 10;
        var q = pt(idx, R * v);
        dpts.push(q[0].toFixed(1) + "," + q[1].toFixed(1));
      });
      g += '<polygon points="' + dpts.join(" ") + '" fill="' + stroke + '" fill-opacity="0.16" stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round"/>';
      DIMS.forEach(function (d, idx) {
        var v = (p.scores[d.key] || 0) / 10;
        var q = pt(idx, R * v);
        g += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="2.6" fill="' + stroke + '"/>';
      });
      return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="100%" height="' + size + '" role="img" aria-label="radar">' + g + '</svg>';
    }

    /* ---------- SVG multi-series radar (compare on one axis set) ---------- */
    function radarCompareSVG(list, size) {
      var n = DIMS.length, cx = size / 2, cy = size / 2, R = size / 2 - 42;
      function pt(i, rad) {
        var a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      }
      var g = "";
      [0.25, 0.5, 0.75, 1].forEach(function (rr) {
        var pts = [];
        for (var i = 0; i < n; i++) { var q = pt(i, R * rr); pts.push(q[0].toFixed(1) + "," + q[1].toFixed(1)); }
        g += '<polygon points="' + pts.join(" ") + '" fill="none" stroke="var(--hairline)" stroke-width="1"/>';
      });
      for (var i = 0; i < n; i++) {
        var e = pt(i, R);
        g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="var(--hairline)" stroke-width="1"/>';
        var lp = pt(i, R + 22);
        g += '<text x="' + lp[0].toFixed(1) + '" y="' + lp[1].toFixed(1) + '" font-size="10" fill="var(--muted)" text-anchor="middle" dominant-baseline="middle" font-family="monospace">' + esc(t(DIMS[i].label)) + "</text>";
      }
      list.forEach(function (item) {
        var pts = [];
        DIMS.forEach(function (d, idx) {
          var q = pt(idx, R * ((item.scores[d.key] || 0) / 10));
          pts.push(q[0].toFixed(1) + "," + q[1].toFixed(1));
        });
        g += '<polygon points="' + pts.join(" ") + '" fill="' + item.color + '" fill-opacity="0.12" stroke="' + item.color + '" stroke-width="2" stroke-linejoin="round"/>';
        DIMS.forEach(function (d, idx) {
          var q = pt(idx, R * ((item.scores[d.key] || 0) / 10));
          g += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="2.4" fill="' + item.color + '"/>';
        });
      });
      return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="100%" height="' + size + '" role="img" aria-label="radar compare">' + g + '</svg>';
    }

    /* =====================================================================
       RENDERERS
       =================================================================== */
    var R = {};

    /* ---------- HOME / hub ---------- */
    R.hub = function () {
      var ranked = PROJECTS.slice().sort(function (a, b) { return total(b) - total(a); });
      var maxTotal = 10;
      var craigGames = PROJECTS.filter(function (p) { return p.author === "craig7351"; });
      var avgCraig = craigGames.reduce(function (s, p) { return s + total(p); }, 0) / craigGames.length;
      var totalCommits = PROJECTS.reduce(function (s, p) { return s + p.commits; }, 0);
      var totalLoc = PROJECTS.reduce(function (s, p) { return s + p.loc; }, 0);

      var html = "";
      /* hero */
      html += '<section class="hero">' +
        '<div class="overline"><span>' + esc(t({ en: "Code-level audit · 2026-07 / 08", zh: "程式碼級體檢 · 2026-07／08" })) + "</span></div>" +
        "<h1>" + esc(t({ en: "Eight projects, ", zh: "八個專案，" })) + "<em>" + esc(t({ en: "read line by line", zh: "逐行讀過" })) + "</em>" + esc(t({ en: ".", zh: "。" })) + "</h1>" +
        '<p class="lede">' + esc(t({
          en: "Five AI-built 3D browser games by craig7351 across one 36-day sprint, OCF's 22-month security curriculum, and two Taiwanese text life-sims that share a designer — each scored on seven dimensions from the source code itself, not the README.",
          zh: "craig7351 在 36 天衝刺內用 AI 打造的五款 3D 瀏覽器遊戲、OCF 維護 22 個月的資安教材，加上兩款共用同一位設計者的台灣純文字人生模擬——每一個都從原始碼本身（不是 README）評七大面向。"
        })) + "</p>" +
        '<p class="small" style="margin:-16px 0 26px;max-width:62ch">' + esc(t({
          en: "These projects are the work of their original authors. This site is an independent third-party analysis — every project links back to its original repository and author below.",
          zh: "這些專案皆為原作者的作品。本站是獨立的第三方分析——下方每個專案都連回其原始 repo 與作者。"
        })) + "</p>" +
        '<div class="statband">' +
          stat(PROJECTS.length, { en: "projects audited", zh: "受檢專案" }) +
          stat(DIMS.length, { en: "scoring dimensions", zh: "評分面向" }) +
          stat(totalCommits, { en: "commits analyzed", zh: "分析的 commit" }) +
          stat((totalLoc / 1000).toFixed(0) + "k", { en: "lines of code", zh: "程式碼行數" }) +
        "</div>" +
      "</section>";

      /* ranking */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Weighted total", zh: "加權總分" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "The ranking", zh: "總分排行" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "Weighted across all seven dimensions (see Methodology). Hover a bar for the breakdown.", zh: "跨七大面向加權（見評分方法）。滑過長條看細項。" })) + "</p>" +
        '<div class="card viz" id="rankCard"></div></section>';

      /* heatmap */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Score matrix", zh: "分數矩陣" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "Every score, every dimension", zh: "所有分數、所有面向" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "Darker = stronger. The Total column is the weighted result. Hover any cell.", zh: "越深＝越強。Total 欄是加權結果。滑過任一格。" })) + "</p>" +
        '<div class="card viz"><div class="heat-wrap" id="heatWrap"></div></div></section>';

      /* radar small multiples */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Shape at a glance", zh: "一眼看形狀" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "Score profiles", zh: "評分輪廓" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "One radar per project — the shape shows where each is strong and where it is hollow.", zh: "每個專案一張雷達圖——形狀顯示各自的強項與空洞。" })) + "</p>" +
        '<div class="card viz"><div class="radar-grid" id="radarGrid"></div>' +
        '<p class="axis-note">' + esc(t({ en: "Axes (clockwise from top): " + DIMS.map(function (d) { return d.label.en; }).join(" · "), zh: "軸（自頂端順時針）：" + DIMS.map(function (d) { return d.label.zh; }).join("、") })) + "</p></div></section>";

      /* project entries */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Deep dives", zh: "深度分析" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "The projects", zh: "八個專案" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "Open any project for its full seven-dimension report, highlights, weaknesses and evidence.", zh: "點開任一專案看完整七面向報告、亮點、弱點與證據。" })) + "</p>" +
        '<div class="entry-grid" id="entryGrid"></div></section>';

      /* credits / original sources */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Credits & sources", zh: "原始出處與作者" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "The original projects & authors", zh: "原始專案與作者" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "All analyzed works belong to their original authors. This is an independent, unaffiliated analysis — visit and support the originals below.", zh: "所有被分析的作品皆屬於原作者。本站是獨立、非隸屬的分析——請前往下方支持原作。" })) + "</p>" +
        '<div class="card viz" id="creditsCard"></div></section>';

      main.innerHTML = html;

      /* fill ranking bars */
      var rc = document.getElementById("rankCard");
      ranked.forEach(function (p) {
        var tv = total(p);
        var row = document.createElement("div");
        row.className = "rank-row";
        var col = authorColor(p.author);
        row.innerHTML =
          '<a href="' + esc(L.pageHref({ slug: p.slug })) + '"><span class="author-dot" style="background:' + col + '"></span>' + esc(t(p.title)) + "</a>" +
          '<div class="bar-track"><div class="bar" style="width:' + (tv / maxTotal * 100) + "%;background:" + col + '"></div></div>' +
          '<div class="val">' + fmt1(tv) + "</div>";
        var bd = DIMS.map(function (d) { return esc(t(d.label)) + ": <b>" + p.scores[d.key] + "</b>"; }).join(" &nbsp; ");
        bindTip(row, "<b>" + esc(t(p.title)) + "</b> — " + t({ en: "total", zh: "總分" }) + " <b>" + fmt1(tv) + "</b><br>" + bd);
        rc.appendChild(row);
      });

      /* fill heatmap */
      var hw = document.getElementById("heatWrap");
      var tbl = '<table class="heat"><thead><tr><th class="rowh"></th>';
      DIMS.forEach(function (d) { tbl += "<th>" + esc(t(d.label)) + "</th>"; });
      tbl += "<th>" + esc(t({ en: "Total", zh: "總分" })) + "</th></tr></thead><tbody>";
      ranked.forEach(function (p) {
        tbl += '<tr><th class="rowh"><a href="' + esc(L.pageHref({ slug: p.slug })) + '"><span class="author-dot" style="background:' + authorColor(p.author) + '"></span>' + esc(t(p.title)) + "</a></th>";
        DIMS.forEach(function (d) {
          var v = p.scores[d.key];
          tbl += '<td data-v="' + v + '" data-dim="' + d.key + '" data-p="' + esc(p.slug) + '" style="background:' + heatColor(v) + ";color:" + heatInk(v) + '">' + v + "</td>";
        });
        var tv = total(p);
        tbl += '<td class="total num" style="color:' + scoreColorVar(tv) + '">' + fmt1(tv) + "</td>";
        tbl += "</tr>";
      });
      tbl += "</tbody></table>";
      hw.innerHTML = tbl;
      hw.querySelectorAll("td[data-v]").forEach(function (td) {
        var p = byslug[td.getAttribute("data-p")];
        var dk = td.getAttribute("data-dim");
        var d = DIMS.filter(function (x) { return x.key === dk; })[0];
        bindTip(td, "<b>" + esc(t(p.title)) + "</b><br>" + esc(dimLabel(p, d)) + ": <b>" + td.getAttribute("data-v") + "/10</b>");
      });

      /* fill radar grid */
      var rg = document.getElementById("radarGrid");
      PROJECTS.forEach(function (p) {
        var cell = document.createElement("a");
        cell.className = "radar-cell card";
        cell.href = L.pageHref({ slug: p.slug });
        cell.innerHTML = radarSVG(p, 180, authorColor(p.author)) +
          "<h4>" + esc(t(p.title)) + "</h4>" +
          '<span class="small num">' + t({ en: "total", zh: "總分" }) + " " + fmt1(total(p)) + "</span>";
        rg.appendChild(cell);
      });

      /* fill entries */
      var eg = document.getElementById("entryGrid");
      PROJECTS.forEach(function (p) {
        var a = document.createElement("a");
        a.className = "entry card";
        a.href = L.pageHref({ slug: p.slug });
        var col = authorColor(p.author);
        a.innerHTML =
          '<div class="entry__top"><span class="entry__title">' + esc(t(p.title)) + "</span>" +
          '<span class="entry__score">' + fmt1(total(p)) + '<small>/10</small></span></div>' +
          "<p>" + esc(t(p.tagline)).slice(0, 160) + "…</p>" +
          '<div class="entry__meta"><span class="tag"><span class="author-dot" style="background:' + col + '"></span>' + esc(t((AUTHORS[p.author] || {}).name)) + "</span>" +
          '<span class="tag">' + esc(t(p.genre)) + "</span></div>";
        eg.appendChild(a);
      });

      /* fill credits: authors + every original repo, with outbound links */
      var cc = document.getElementById("creditsCard");
      var ch = "";
      Object.keys(AUTHORS).forEach(function (k) {
        var au = AUTHORS[k];
        var mine = PROJECTS.filter(function (p) { return p.author === k; });
        ch += '<div style="margin-bottom:18px">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
            '<span class="author-dot" style="width:12px;height:12px;background:' + authorColor(k) + '"></span>' +
            '<a href="' + esc(au.url) + '" target="_blank" rel="noopener" style="font-weight:600;color:var(--ink)">' + esc(t(au.name)) + '</a>' +
            '<span class="small">' + esc(t(au.type)) + '</span>' +
          '</div>' +
          '<div style="display:flex;flex-wrap:wrap;gap:8px;padding-left:22px">';
        mine.forEach(function (p) {
          ch += '<a class="tag" href="https://github.com/' + esc(p.repo) + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:5px">' +
            '<span class="material-symbols-rounded" style="font-size:15px">code</span>' + esc(p.repo) + '</a>';
        });
        ch += "</div></div>";
      });
      cc.innerHTML = ch;
    };

    function stat(v, label) {
      return '<div class="stat"><b>' + esc(String(v)) + "</b><span>" + esc(t(label)) + "</span></div>";
    }

    /* ---------- PROJECT ---------- */
    R.project = function () {
      var p = byslug[page.project];
      if (!p) { main.innerHTML = '<p class="empty">Not found.</p>'; return; }
      var author = AUTHORS[p.author] || {};
      var col = authorColor(p.author);
      var tv = total(p);
      var ranked = PROJECTS.slice().sort(function (a, b) { return a.order - b.order; });
      var idx = ranked.map(function (x) { return x.slug; }).indexOf(p.slug);
      var prev = ranked[idx - 1], next = ranked[idx + 1];

      var html = "";
      /* head */
      html += '<section class="proj-head">' +
        '<div class="crumbs"><a href="index.html">' + esc(t({ en: "Overview", zh: "總覽" })) + '</a> / <a href="' + esc(author.url) + '" target="_blank" rel="noopener">' + esc(t(author.name)) + "</a></div>" +
        "<h1>" + esc(t(p.title)) + "</h1>" +
        '<p class="tagline">' + esc(t(p.tagline)) + "</p>" +
        '<div class="proj-links">';
      html += linkBtn(p.demo, "play_circle", { en: "Live demo", zh: "線上遊玩" });
      if (p.intro) html += linkBtn(p.intro, "article", { en: "Intro page", zh: "介紹頁" });
      html += linkBtn("https://github.com/" + p.repo, "code", { en: "Source", zh: "原始碼" });
      html += "</div></section>";

      /* scorecard */
      html += '<section class="section"><div class="scorecard">' +
        '<div class="card score-hero"><div class="big" style="color:' + scoreColorVar(tv) + '">' + fmt1(tv) + "<small>/10</small></div>" +
        '<div class="tier">' + esc(t({ en: "weighted total", zh: "加權總分" })) + "</div>" +
        '<div style="margin-top:10px">' + radarSVG(p, 150, col) + "</div></div>" +
        '<div class="card dimbars" id="dimbars"></div>' +
      "</div></section>";

      /* per-dimension articles */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Dimension by dimension", zh: "逐面向拆解" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "The seven dimensions", zh: "七大面向" })) + "</h2>" +
        '<div id="dimArticles"></div></section>';

      /* highlights + weaknesses */
      html += '<section class="section"><div class="hl-grid">' +
        '<div class="card li-card pos"><h3><span class="material-symbols-rounded">trending_up</span>' + esc(t({ en: "Highlights", zh: "亮點" })) + '</h3><ul class="li-list" id="hlList"></ul></div>' +
        '<div class="card li-card neg"><h3><span class="material-symbols-rounded">trending_down</span>' + esc(t({ en: "Weaknesses", zh: "弱點" })) + '</h3><ul class="li-list" id="wkList"></ul></div>' +
      "</div></section>";

      /* special callout */
      if (p.special) {
        html += '<section class="section"><div class="card callout"><h3>' + esc(t(p.special.title)) + "</h3>";
        p.special.body.forEach(function (b) { html += "<p>" + rich(b) + "</p>"; });
        html += "</div></section>";
      }

      /* AI + facts */
      html += '<section class="section"><div class="hl-grid">' +
        '<div class="card li-card"><h3><span class="material-symbols-rounded" style="color:var(--accent)">smart_toy</span>' + esc(t({ en: "AI-assisted development", zh: "AI 輔助開發跡象" })) + "</h3>" +
        '<p class="small" style="margin:0">' + rich(p.ai) + "</p></div>" +
        '<div class="card li-card"><h3><span class="material-symbols-rounded" style="color:var(--accent)">summarize</span>' + esc(t({ en: "Facts", zh: "統計" })) + '</h3><table class="facts" id="factsTbl"></table></div>' +
      "</div></section>";

      /* verdict */
      html += '<section class="section"><div class="card callout"><h3>' + esc(t({ en: "Verdict", zh: "總評" })) + "</h3><p>" + rich(p.verdict) + "</p></div></section>";

      /* prev/next */
      html += '<nav class="proj-next">';
      html += prev ? '<a href="' + esc(L.pageHref({ slug: prev.slug })) + '"><span class="material-symbols-rounded">arrow_back</span>' + esc(t(prev.title)) + "</a>" : "<span></span>";
      html += next ? '<a href="' + esc(L.pageHref({ slug: next.slug })) + '">' + esc(t(next.title)) + '<span class="material-symbols-rounded">arrow_forward</span></a>' : "<span></span>";
      html += "</nav>";

      main.innerHTML = html;

      /* dim bars */
      var db = document.getElementById("dimbars");
      DIMS.forEach(function (d) {
        var v = p.scores[d.key];
        var row = document.createElement("div");
        row.className = "dimbar";
        row.innerHTML =
          '<div class="lbl">' + esc(dimLabel(p, d)) + "</div>" +
          '<div class="track"><div class="fill" style="width:' + (v / 10 * 100) + "%;background:" + col + '"></div></div>' +
          '<div class="v" style="color:' + scoreColorVar(v) + '">' + v + "</div>";
        db.appendChild(row);
      });

      /* dim articles */
      var da = document.getElementById("dimArticles");
      DIMS.forEach(function (d) {
        var v = p.scores[d.key];
        var art = document.createElement("div");
        art.className = "dim-article";
        art.innerHTML =
          "<div><h3><span class=\"material-symbols-rounded\" style=\"color:" + col + ";font-size:20px\">" + esc(d.icon) + "</span>" + esc(dimLabel(p, d)) +
          ' <span class="dscore">' + v + "/10</span></h3></div>" +
          "<div><p>" + rich(p.dims[d.key]) + "</p></div>";
        da.appendChild(art);
      });

      /* highlights / weaknesses */
      var hl = document.getElementById("hlList"), wk = document.getElementById("wkList");
      p.highlights.forEach(function (h) { var li = document.createElement("li"); li.innerHTML = rich(h); hl.appendChild(li); });
      p.weaknesses.forEach(function (w) { var li = document.createElement("li"); li.innerHTML = rich(w); wk.appendChild(li); });

      /* facts */
      var ft = document.getElementById("factsTbl");
      var rows = [
        [{ en: "Stack", zh: "技術棧" }, p.stack.join(" · ")],
        [{ en: "Genre", zh: "類型" }, t(p.genre)],
        [{ en: "Period", zh: "開發期間" }, p.period],
        [{ en: "Active dev days", zh: "實際開發天數" }, p.devDays + (state.lang === "zh" ? " 天" : " days")],
        [{ en: "Commits", zh: "Commit 數" }, String(p.commits)],
        [{ en: "Lines of code", zh: "程式碼行數" }, "~" + p.loc.toLocaleString()],
        [{ en: "Author", zh: "作者" }, t(author.name)]
      ];
      rows.forEach(function (r) {
        var tr = document.createElement("tr");
        tr.innerHTML = "<th>" + esc(t(r[0])) + "</th><td>" + esc(r[1]) + "</td>";
        ft.appendChild(tr);
      });
    };

    function linkBtn(href, icon, label) {
      return '<a href="' + esc(href) + '" target="_blank" rel="noopener"><span class="material-symbols-rounded">' + icon + "</span>" + esc(t(label)) + "</a>";
    }

    /* ---------- AUTHORS ---------- */
    R.authors = function () {
      var authorList = Object.keys(AUTHORS).map(function (k) { return AUTHORS[k]; });
      var craigGames = PROJECTS.filter(function (p) { return p.author === "craig7351"; });
      var html = "";

      html += '<section class="hero" style="padding-top:20px">' +
        '<div class="overline"><span>' + esc(t({ en: "Four authors", zh: "四位作者" })) + "</span></div>" +
        "<h1>" + esc(t({ en: "Four ways to ship", zh: "四種出貨方式" })) + "</h1>" +
        '<p class="lede">' + esc(t({ en: "The same era, the same AI-assisted tooling, four different philosophies — one optimizing for velocity, one for institutional continuity, one for measured balance, and one that inherited a format and re-skinned it.", zh: "同一個時代、同樣的 AI 輔助工具，卻是四種哲學——一個最佳化速度、一個最佳化制度延續性、一個最佳化可量測的平衡，還有一個繼承既有格式再換皮。" })) + "</p></section>";

      /* profiles */
      html += '<section class="section"><div class="author-grid" id="authorGrid"></div></section>';

      /* radar compare */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "Head to head", zh: "正面對決" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "Author averages, overlaid", zh: "四位作者平均分疊圖" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "craig7351 = mean of five games; every other author = their single project. The overlaps tell the story: craig leads on completeness and game feel, OCF on content and security posture, LeoGGcat on design and code quality — and every one of them collapses on testing.", zh: "craig7351＝五款遊戲平均；其餘作者＝各自的單一專案。重疊處說明一切：craig 在完成度與手感領先，OCF 在內容與安全姿態領先，LeoGGcat 在設計與程式品質領先——而四位在測試上全部塌陷。" })) + "</p>" +
        '<div class="card viz"><div style="max-width:460px;margin:0 auto" id="cmpRadar"></div><div class="legend" id="cmpLegend"></div></div></section>';

      /* timeline */
      html += '<section class="section"><div class="overline"><span>' + esc(t({ en: "craig7351 · timeline", zh: "craig7351 · 時間軸" })) + "</span></div>" +
        "<h2>" + esc(t({ en: "Five games in 36 days", zh: "36 天五款遊戲" })) + "</h2>" +
        '<p class="section-sub">' + esc(t({ en: "The arc of a solo-plus-AI sprint — and where the skill curve shows.", zh: "一場「個人＋AI」衝刺的軌跡——以及技能曲線顯現之處。" })) + "</p>" +
        '<ul class="tl" id="tl"></ul></section>';

      main.innerHTML = html;

      /* author cards */
      var ag = document.getElementById("authorGrid");
      authorList.forEach(function (au) {
        var mine = PROJECTS.filter(function (p) { return p.author === au.key; });
        var avg = mine.reduce(function (s, p) { return s + total(p); }, 0) / mine.length;
        var commits = mine.reduce(function (s, p) { return s + p.commits; }, 0);
        var loc = mine.reduce(function (s, p) { return s + p.loc; }, 0);
        var card = document.createElement("div");
        card.className = "card author-card";
        var body = au.profile.map(function (par) { return "<p>" + rich(par) + "</p>"; }).join("");
        card.innerHTML =
          "<h3><span class=\"author-dot\" style=\"width:14px;height:14px;background:" + authorColor(au.key) + "\"></span>" +
          '<a href="' + esc(au.url) + '" target="_blank" rel="noopener" style="color:var(--ink)">' + esc(t(au.name)) + "</a></h3>" +
          '<span class="small">' + esc(t(au.type)) + "</span>" + body +
          '<div class="author-facts">' +
            '<div><b class="num">' + fmt1(avg) + "</b><span>" + esc(t({ en: "avg total", zh: "平均總分" })) + "</span></div>" +
            "<div><b class=\"num\">" + mine.length + "</b><span>" + esc(t({ en: "projects", zh: "專案數" })) + "</span></div>" +
            '<div><b class="num">' + commits + "</b><span>" + esc(t({ en: "commits", zh: "commit 數" })) + "</span></div>" +
            "<div><b class=\"num\">" + (loc / 1000).toFixed(1) + "k</b><span>" + esc(t({ en: "lines", zh: "行數" })) + "</span></div>" +
          "</div>";
        ag.appendChild(card);
      });

      /* compare radar */
      function avgScores(key) {
        var mine = PROJECTS.filter(function (p) { return p.author === key; });
        var o = {};
        DIMS.forEach(function (d) {
          o[d.key] = mine.reduce(function (s, p) { return s + p.scores[d.key]; }, 0) / mine.length;
        });
        return o;
      }
      var cmpList = authorList.map(function (au) {
        return { scores: avgScores(au.key), color: authorColor(au.key), name: au.name };
      });
      document.getElementById("cmpRadar").innerHTML = radarCompareSVG(cmpList, 400);
      document.getElementById("cmpLegend").innerHTML = cmpList.map(function (c) {
        return '<span><i style="background:' + c.color + '"></i>' + esc(t(c.name)) + "</span>";
      }).join("");

      /* timeline */
      var tl = document.getElementById("tl");
      craigGames.slice().sort(function (a, b) { return a.order - b.order; }).forEach(function (p) {
        var li = document.createElement("li");
        li.querySelectorAll && (li.style.cssText = "");
        var dot = li;
        var startDate = p.period.split(" ")[0];
        li.innerHTML =
          '<span class="tl-date">' + esc(startDate) + " · " + p.devDays + (state.lang === "zh" ? " 天 · " : "d · ") + p.commits + " commits</span>" +
          '<h4><a href="' + esc(L.pageHref({ slug: p.slug })) + '">' + esc(t(p.title)) + '</a><span class="num">' + fmt1(total(p)) + "</span></h4>" +
          "<p>" + esc(t(p.tagline)) + "</p>" +
          '<div class="tl-meta"><span class="tag">' + esc(t(p.genre)) + '</span><span class="tag">' + esc(p.stack[0] + " · " + p.stack[1]) + "</span></div>";
        li.querySelector(".tl-date"); /* dot color via CSS var override */
        li.style.setProperty("--dot", authorColor(p.author));
        tl.appendChild(li);
      });
      /* recolor timeline dots to author color */
      var style = document.createElement("style");
      style.textContent = ".tl li::before{background:" + authorColor("craig7351") + "}";
      main.appendChild(style);
    };

    /* ---------- METHODOLOGY ---------- */
    R.methodology = function () {
      var html = '<section class="hero" style="padding-top:20px">' +
        '<div class="overline"><span>' + esc(t({ en: "How the scores were made", zh: "分數怎麼來的" })) + "</span></div>" +
        "<h1>" + esc(t({ en: "Methodology", zh: "評分方法" })) + "</h1>" +
        '<p class="lede">' + esc(t({ en: "Every number here is a calibrated judgment backed by source-code evidence. Here is the rubric, the weighting, the process, the external checks — and the limits.", zh: "這裡每個數字都是有原始碼證據支撐的校準判斷。以下是規準、權重、流程、外部佐證——以及限制。" })) + "</p></section>";

      html += '<section class="section prose">';

      /* rubric */
      html += "<h3>" + esc(t({ en: "The 1–10 anchors", zh: "1–10 分規準" })) + "</h3><div class='table-scroll'><table><thead><tr><th>" + esc(t({ en: "Score", zh: "分數" })) + "</th><th>" + esc(t({ en: "Meaning", zh: "意義" })) + "</th></tr></thead><tbody>";
      METHOD.rubric.forEach(function (r) { html += "<tr><td class='num'>" + esc(r.range) + "</td><td>" + esc(t(r.label)) + "</td></tr>"; });
      html += "</tbody></table></div>";

      /* weights */
      html += "<h3>" + esc(t({ en: "The weighting", zh: "權重" })) + "</h3><p>" + esc(t(METHOD.weightsWhy)) + "</p>";
      html += "<div class='table-scroll'><table><thead><tr><th>" + esc(t({ en: "Dimension", zh: "面向" })) + "</th><th>" + esc(t({ en: "Weight", zh: "權重" })) + "</th><th>" + esc(t({ en: "What it measures", zh: "評什麼" })) + "</th></tr></thead><tbody>";
      DIMS.forEach(function (d) {
        html += "<tr><td>" + esc(t(d.label)) + "</td><td class='num'>" + Math.round((WEIGHTS[d.key] || 0) * 100) + "%</td><td>" + esc(t(d.desc)) + "</td></tr>";
      });
      html += "</tbody></table></div>";

      /* process */
      html += "<h3>" + esc(t({ en: "The process", zh: "分析流程" })) + "</h3><ol>";
      METHOD.process.forEach(function (s) { html += "<li>" + rich(s) + "</li>"; });
      html += "</ol>";

      /* verification */
      html += "<h3>" + esc(t({ en: "External verification", zh: "外部佐證" })) + "</h3><ul>";
      METHOD.verification.forEach(function (v) {
        html += "<li>" + esc(t(v)) + (v.url ? ' <a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(t({ en: "source ↗", zh: "來源 ↗" })) + "</a>" : "") + "</li>";
      });
      html += "</ul>";

      /* limits */
      html += "<h3>" + esc(t({ en: "Limits & disclaimer", zh: "限制與聲明" })) + "</h3><ul>";
      METHOD.limits.forEach(function (l) { html += "<li>" + esc(t(l)) + "</li>"; });
      html += "</ul>";

      html += "<p class='small' style='margin-top:24px'>" + esc(t({ en: "This is an independent, unaffiliated analysis. Project names, repositories and trademarks belong to their respective owners. Findings describe the state of each repository as audited on 2026-07-20.", zh: "這是獨立、非隸屬的分析。專案名稱、repo 與商標屬於各自擁有者。所有發現描述的是 2026-07-20 受檢時各 repo 的狀態。" })) + "</p>";

      html += "</section>";
      main.innerHTML = html;
    };

    /* ---------- GLOSSARY ---------- */
    R.glossary = function () {
      var html = '<section class="hero" style="padding-top:20px">' +
        '<div class="overline"><span>' + esc(t({ en: "Reference", zh: "參考" })) + "</span></div>" +
        "<h1>" + esc(t({ en: "Glossary", zh: "術語速查" })) + "</h1>" +
        '<p class="lede">' + esc(t({ en: "The technical terms that recur across the analyses — from thin instances to prompt injection.", zh: "分析中反覆出現的技術名詞——從 thin instances 到 prompt injection。" })) + "</p></section>";
      html += '<section class="section">' +
        '<div class="search-wrap"><span class="material-symbols-rounded">search</span>' +
        '<input type="search" id="glossSearch" autocomplete="off" /></div>' +
        '<div class="gloss-list" id="glossList"></div>' +
        '<p class="empty" id="glossEmpty" hidden></p></section>';
      main.innerHTML = html;

      var input = document.getElementById("glossSearch");
      input.setAttribute("placeholder", t({ en: "Search terms…", zh: "搜尋術語…" }));
      var list = document.getElementById("glossList");
      var empty = document.getElementById("glossEmpty");
      var sorted = GLOSS.slice().sort(function (a, b) { return t(a.term).localeCompare(t(b.term)); });

      function paint(q) {
        q = (q || "").trim().toLowerCase();
        list.innerHTML = "";
        var n = 0;
        sorted.forEach(function (g) {
          var hay = (t(g.term) + " " + t(g.def) + " " + g.cat).toLowerCase();
          if (q && hay.indexOf(q) === -1) return;
          n++;
          var d = document.createElement("details");
          d.setAttribute("data-item", "");
          d.innerHTML =
            "<summary>" + esc(t(g.term)) + '<span class="tag">' + esc(g.cat) + "</span></summary>" +
            '<div class="def">' + esc(t(g.def)) + "</div>";
          list.appendChild(d);
        });
        empty.hidden = n !== 0;
        if (n === 0) empty.textContent = t({ en: "No terms match “", zh: "找不到符合「" }) + q + t({ en: "”.", zh: "」的術語。" });
      }
      paint("");
      input.addEventListener("input", function () { paint(input.value); });
    };

    /* ---------- dispatch ---------- */
    function render() {
      var fn = R[page.layout] || R.hub;
      main.innerHTML = "";
      hideTip();
      fn();
    }
    render();
  }

  boot();
})();
