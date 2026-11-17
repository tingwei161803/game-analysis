/* Arcade hall · DOM side.
   Builds the hall section that sits between the site chrome and <main> on the
   home page: headline, caption card and the canvas the three.js scene
   (arcade.js) draws into. Everything is read from the site data.

   Language and theme belong to the shell: the language is fixed by the page's
   <html lang> (the other language is a different URL) and the theme by the
   shell's toggle, which this file only listens to. Without WebGL the section
   stays a plain headline and the page below it is the whole home page. */
(function () {
  "use strict";

  var SELF = document.currentScript ? document.currentScript.src : "";
  var root = document.documentElement;

  var T = {
    en: {
      over: "Code-level audit",
      title: "Every codebase gets a <em>high score</em>.",
      lede: "{n} browser-game projects read line by line, each scored 1⁠–⁠10 on {d} dimensions.",
      lede2: " Walk the hall, pick a cabinet, insert a coin for the full report.",
      total: "Weighted total",
      coin: "Insert coin",
      prev: "Previous cabinet",
      next: "Next cabinet",
      hint: "Scroll, drag or ← → to walk · Enter to play",
      hintTouch: "Swipe to walk · tap the cabinet to play",
      loc: "lines",
      rank: "Rank",
      canvas: "3D arcade hall with one cabinet per audited project. The same projects are listed as links further down the page."
    },
    zh: {
      over: "程式碼級體檢",
      title: "每個專案，都有一台自己的<em>計分機台</em>。",
      lede: "{n} 個瀏覽器遊戲專案逐行讀過，在 {d} 個面向各評 1–10 分。",
      lede2: "沿著機台走，挑一台，投幣看完整報告。",
      total: "加權總分",
      coin: "投幣",
      prev: "上一台",
      next: "下一台",
      hint: "捲動、拖曳或按 ← → 移動 · Enter 投幣",
      hintTouch: "滑動移動 · 點機台投幣",
      loc: "行",
      rank: "排名",
      canvas: "3D 機台廳，每個受檢專案一台機台。頁面下方有相同專案的連結列表。"
    }
  };

  var MARKUP =
    '<div class="stage" id="stage">' +
      '<canvas id="gl" tabindex="0"></canvas>' +
      '<div class="ah-hero">' +
        '<div class="ah-hero__over"><span id="ahOver"></span></div>' +
        '<p class="ah-hero__title" id="ahTitle"></p>' +
        '<p class="ah-hero__lede"><span id="ahLede"></span><span class="ah-hero__lede2" id="ahLede2"></span></p>' +
        '<nav class="ah-hero__nav" id="ahNav"></nav>' +
      "</div>" +
      '<aside class="ah-card" id="card">' +
        '<div class="ah-card__meta"><span class="ah-card__rank" id="cRank"></span>' +
          '<span class="ah-card__dot" aria-hidden="true"></span><span class="ah-card__author" id="cAuthor"></span></div>' +
        '<h2 class="ah-card__title"><a id="cTitle" href="#"></a></h2>' +
        '<p class="ah-card__genre" id="cGenre"></p>' +
        '<p class="ah-card__tag" id="cTag"></p>' +
        '<dl class="ah-card__scores" id="cScores"></dl>' +
        '<div class="ah-card__foot">' +
          '<div class="ah-card__total"><span id="cTotalLabel"></span><strong id="cTotal"></strong></div>' +
          '<a class="coin" id="cCoin" href="#"><i aria-hidden="true"></i><span id="cCoinLabel"></span></a>' +
        "</div>" +
        '<div class="ah-card__nav">' +
          '<button type="button" id="prevBtn">&#8249;</button>' +
          '<span class="ah-card__count" id="cCount"></span>' +
          '<button type="button" id="nextBtn">&#8250;</button>' +
          '<span class="ah-card__hint" id="cHint"></span>' +
        "</div>" +
      "</aside>" +
    "</div>";

  function mount(L) {
    var main = document.getElementById("page");
    if (!main || document.getElementById("hall")) return;

    var DIMS = window.GA_DIMS || [];
    var W = window.GA_WEIGHTS || {};
    var AUTH = window.GA_AUTHORS || {};
    var lang = L.state.lang === "zh" ? "zh" : "en";
    var theme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    var listeners = [];
    var shown = -1;
    var coarse = window.matchMedia && matchMedia("(pointer: coarse)").matches;

    function tr(k) { return T[lang][k]; }
    function $(id) { return document.getElementById(id); }
    function pad2(n) { return n < 10 ? "0" + n : "" + n; }
    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    }

    function totalOf(p) {
      var s = 0;
      for (var i = 0; i < DIMS.length; i++) {
        var k = DIMS[i].key;
        s += (Number(p.scores && p.scores[k]) || 0) * (Number(W[k]) || 0);
      }
      return s;
    }
    var projects = (window.GA_PROJECTS || []).slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    }).map(function (p) {
      var t = totalOf(p);
      return { p: p, slug: p.slug, total: t, totalStr: t.toFixed(2), rank: 0, author: AUTH[p.author] || null };
    });
    projects.slice().sort(function (a, b) { return b.total - a.total; })
      .forEach(function (it, i) { it.rank = i + 1; });
    if (!projects.length) return;

    function href(i) { return L.pageHref({ slug: projects[i].slug }); }
    function authorColor(it) {
      var cs = getComputedStyle(root);
      var c = it.author && it.author.color ? cs.getPropertyValue("--" + it.author.color).trim() : "";
      return c || cs.getPropertyValue("--accent").trim() || "#256abf";
    }

    /* ---------- build ---------- */
    var hall = el("section", "hall");
    hall.id = "hall";
    hall.innerHTML = MARKUP; /* fixed markup above; every data string goes in through textContent */
    main.parentNode.insertBefore(hall, main);

    /* The stage sticks just below the site's own sticky chrome. */
    function measureChrome() {
      var h = 0;
      [".appbar", ".pagenav"].forEach(function (sel) {
        var n = document.querySelector(sel);
        if (n) h += n.getBoundingClientRect().height;
      });
      if (h) hall.style.setProperty("--ah-top", Math.round(h) + "px");
    }
    measureChrome();
    window.addEventListener("resize", measureChrome);
    window.addEventListener("load", measureChrome);
    /* The chrome reflows once its icon and text fonts arrive, so keep watching it. */
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(measureChrome);
      [".appbar", ".pagenav"].forEach(function (sel) { var n = document.querySelector(sel); if (n) ro.observe(n); });
    }

    $("ahOver").textContent = tr("over");
    $("ahTitle").innerHTML = tr("title"); /* fixed strings from T above, no data */
    $("ahLede").textContent = tr("lede").replace("{n}", projects.length).replace("{d}", DIMS.length);
    $("ahLede2").textContent = tr("lede2");
    $("cTotalLabel").textContent = tr("total");
    $("cCoinLabel").textContent = tr("coin");
    $("gl").setAttribute("aria-label", tr("canvas"));
    $("gl").setAttribute("role", "img");
    $("prevBtn").setAttribute("aria-label", tr("prev"));
    $("nextBtn").setAttribute("aria-label", tr("next"));
    $("cHint").textContent = coarse ? tr("hintTouch") : tr("hint");

    var nav = $("ahNav");
    nav.setAttribute("aria-label", lang === "zh" ? "站內頁面" : "Site pages");
    ["methodology", "authors", "glossary"].forEach(function (slug) {
      var pg = null;
      (L.pages || []).forEach(function (p) { if (p.slug === slug) pg = p; });
      if (!pg) return;
      var a = el("a", null, L.t(pg.title));
      a.href = L.pageHref(pg);
      nav.appendChild(a);
    });

    var dl = $("cScores");
    DIMS.forEach(function (d) {
      var row = el("div");
      row.appendChild(el("dt", null, L.t(d.label)));
      var dd = el("dd");
      var bar = el("span", "sbar"); bar.setAttribute("aria-hidden", "true");
      bar.appendChild(el("i"));
      dd.appendChild(bar); dd.appendChild(el("b"));
      row.appendChild(dd); dl.appendChild(row);
    });

    /* ---------- caption card ---------- */
    function show(i, force) {
      if (i < 0 || i >= projects.length) return;
      if (i === shown && !force) return;
      shown = i;
      var it = projects[i], p = it.p;
      $("card").style.setProperty("--ac", authorColor(it));
      $("cRank").textContent = tr("rank") + " " + pad2(it.rank) + " / " + pad2(projects.length);
      $("cAuthor").textContent = it.author ? L.t(it.author.name) : (p.author || "");
      $("cTitle").textContent = L.t(p.title);
      $("cTitle").href = href(i);
      $("cGenre").textContent = L.t(p.genre) +
        (p.loc ? " · " + Number(p.loc).toLocaleString("en-US") + " " + tr("loc") : "");
      $("cTag").textContent = L.t(p.tagline);
      $("cTotal").textContent = it.totalStr;
      $("cCoin").href = href(i);
      var rows = $("cScores").children;
      for (var k = 0; k < DIMS.length; k++) {
        var v = Number(p.scores && p.scores[DIMS[k].key]) || 0;
        rows[k].querySelector("i").style.width = (v * 10) + "%";
        rows[k].querySelector("b").textContent = v.toFixed(1);
      }
    }
    function setCount(i) {
      $("cCount").textContent = pad2(i + 1) + " / " + pad2(projects.length);
      $("prevBtn").disabled = i <= 0;
      $("nextBtn").disabled = i >= projects.length - 1;
    }
    show(0, true); setCount(0);

    /* ---------- theme follows the shell ---------- */
    new MutationObserver(function () {
      var now = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      if (now === theme) return;
      theme = now;
      show(shown < 0 ? 0 : shown, true);
      for (var i = 0; i < listeners.length; i++) listeners[i]("theme");
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    window.HALL = {
      projects: projects,
      dims: DIMS,
      get lang() { return lang; },
      get theme() { return theme; },
      title: function (i) { return L.t(projects[i].p.title); },
      href: href,
      color: function (i) { return authorColor(projects[i]); },
      token: function (name) { return getComputedStyle(root).getPropertyValue(name).trim(); },
      show: show,
      setCount: setCount,
      onChange: function (fn) { listeners.push(fn); }
    };

    /* The scene is an ES module so it can import three.js through the page's
       import map; load it only now that HALL and the canvas exist. */
    var s = document.createElement("script");
    s.type = "module";
    s.src = SELF.replace(/arcade-ui\.js(\?.*)?$/, "arcade.js");
    document.body.appendChild(s);
  }

  window.ArcadeHall = { mount: mount };
})();
