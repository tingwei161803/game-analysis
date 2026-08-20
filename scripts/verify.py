#!/usr/bin/env python3
"""Playwright-based UX verification for this static site.

Confirms that a generated static site provides a good user experience by
driving a headless Chromium browser through a suite of resilient checks.

Usage (always via uv -- this project mandates uv for all Python):

    uv run playwright install chromium          # one-time browser download
    uv run python scripts/verify.py --dir ./my-site
    uv run python scripts/verify.py --url http://localhost:8000

Provide EITHER --url (point at an already-running server) OR --dir (a folder
containing index.html; this script will start its own static server on a free
port). Exits 0 if every check PASSes (SKIPs are fine), 1 if any check FAILs.
"""

from __future__ import annotations

import argparse
import contextlib
import functools
import http.server
import socket
import socketserver
import sys
import threading
from dataclasses import dataclass, field

from playwright.sync_api import (
    Browser,
    Error as PlaywrightError,
    Page,
    TimeoutError as PlaywrightTimeout,
    sync_playwright,
)

# Default per-action timeout (ms). Static sites should respond instantly.
TIMEOUT_MS = 8000


# --------------------------------------------------------------------------- #
# Result tracking
# --------------------------------------------------------------------------- #
@dataclass
class Results:
    """Collects the PASS/SKIP/FAIL outcome of every check."""

    passed: int = 0
    skipped: int = 0
    failed: int = 0
    rows: list[tuple[str, str, str]] = field(default_factory=list)

    def _record(self, status: str, label: str, detail: str) -> None:
        self.rows.append((status, label, detail))
        symbol = {"PASS": "✓", "SKIP": "→", "FAIL": "✗"}[status]
        line = f"  [{status}] {symbol} {label}"
        if detail:
            line += f"  -- {detail}"
        print(line, flush=True)

    def ok(self, label: str, detail: str = "") -> None:
        self.passed += 1
        self._record("PASS", label, detail)

    def skip(self, label: str, detail: str = "") -> None:
        self.skipped += 1
        self._record("SKIP", label, detail)

    def fail(self, label: str, detail: str = "") -> None:
        self.failed += 1
        self._record("FAIL", label, detail)


def check(label: str):
    """Decorator: wrap a check so an unexpected exception becomes a FAIL.

    Each check function takes (page, results, *ctx) and is responsible for
    recording its own PASS/SKIP/FAIL. If it raises instead, we capture that
    as a FAIL with the exception text so one broken check never aborts the run.
    """

    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(page: Page, results: Results, *args, **kwargs):
            try:
                return fn(page, results, *args, **kwargs)
            except (PlaywrightTimeout, PlaywrightError) as exc:
                results.fail(label, f"playwright error: {_short(exc)}")
            except Exception as exc:  # noqa: BLE001 - defensive: keep going
                results.fail(label, f"unexpected error: {_short(exc)}")

        return wrapper

    return decorator


def _short(exc: object, limit: int = 120) -> str:
    text = str(exc).splitlines()[0] if str(exc) else exc.__class__.__name__
    return text[:limit]


# --------------------------------------------------------------------------- #
# Local static server (used when --dir is supplied)
# --------------------------------------------------------------------------- #
def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class _QuietServer(socketserver.TCPServer):
    allow_reuse_address = True


def start_static_server(directory: str) -> tuple[str, _QuietServer, threading.Thread]:
    """Serve `directory` on a free localhost port in a daemon thread.

    Returns (base_url, server, thread). Call server.shutdown() to stop.
    """
    port = _free_port()
    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler,
        directory=directory,
    )
    # Silence the default request logging so output stays readable.
    handler.log_message = lambda *a, **k: None  # type: ignore[assignment]
    server = _QuietServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return f"http://127.0.0.1:{port}", server, thread


# --------------------------------------------------------------------------- #
# Small DOM helpers (resilient selector lookup)
# --------------------------------------------------------------------------- #
def first_visible(page: Page, selectors: list[str], timeout: int = 1500):
    """Return the first locator matching any selector that is visible, else None."""
    for sel in selectors:
        loc = page.locator(sel).first
        try:
            if loc.count() > 0 and loc.is_visible(timeout=timeout):
                return loc
        except (PlaywrightTimeout, PlaywrightError):
            continue
    return None


def first_present(page: Page, selectors: list[str]):
    """Return the first locator matching any selector that exists in DOM, else None."""
    for sel in selectors:
        loc = page.locator(sel).first
        if loc.count() > 0:
            return loc
    return None


def card_count(page: Page) -> int:
    """Count cards that are currently visible inside the grid."""
    return page.locator("#grid .card:visible, .card:visible").count()


# Layout-agnostic "primary content" selector: a gallery renders .card, but
# article/dashboard/timeline/table/kanban/... render other nodes. Every layout
# template marks its primary nodes with data-item, so that is the reliable hook.
CONTENT_SELECTORS = (
    "[data-item], "                 # universal primary-content hook (any layout)
    ".card, "                       # gallery / bento / hub
    ".timeline-item, [data-event], .tl-item, "  # timeline
    "table tbody tr, .row, [data-row], "  # table / comparison / dashboard
    ".stat, .stat-card, .metric, [data-stat], "  # dashboard
    ".tile, .kb-card, .faq-item, .acc-item, .plan, "  # bento/kanban/faq/comparison
    ".lb-row, .leaderboard-row, .tier-row, .scrolly-step, .place, "  # leaderboard/scrolly/map
    "article section, .article-section, .prose > *, [data-section]"  # article
)


def has_content(page: Page) -> bool:
    """True if any recognizable primary-content node is present in the DOM."""
    return page.locator(CONTENT_SELECTORS).count() > 0


# Attribution markers that must never reach a shipped site: the deliverable is
# the user's site, not an advert for whatever produced it, so no page should
# disclose which generator or tool assembled it.
ATTRIBUTION_TOKENS = ("built with", "generated by", "powered by")


# --------------------------------------------------------------------------- #
# Checks
# --------------------------------------------------------------------------- #
@check("Page loads with a non-empty <title>")
def check_title(page: Page, results: Results) -> None:
    title = (page.title() or "").strip()
    if title:
        results.ok("Page loads with a non-empty <title>", f"title={title!r}")
    else:
        results.fail("Page loads with a non-empty <title>", "title is empty")


@check("Primary content renders")
def check_cards(page: Page, results: Results) -> None:
    # Layout-agnostic: a gallery renders .card, but article/dashboard/timeline/
    # table layouts render other primary-content nodes. Accept any of them so
    # non-gallery layouts aren't falsely failed.
    SELECTORS = CONTENT_SELECTORS
    with contextlib.suppress(PlaywrightTimeout, PlaywrightError):
        page.wait_for_selector(SELECTORS, timeout=TIMEOUT_MS, state="attached")
    n = page.locator(SELECTORS).count()
    if n >= 1:
        results.ok("Primary content renders", f"{n} content node(s)")
    else:
        # last resort: a non-trivially-populated <main>
        main_txt = (page.locator("main").first.inner_text() if page.locator("main").count() else "").strip()
        if len(main_txt) > 40:
            results.ok("Primary content renders", "main has rendered text content")
        else:
            results.fail("Primary content renders", "no recognizable content nodes found")


@check("No console errors")
def check_console(page: Page, results: Results, errors: list[str]) -> None:
    if not errors:
        results.ok("No console errors")
    else:
        sample = "; ".join(errors[:3])
        results.fail("No console errors", f"{len(errors)} error(s): {sample}")


@check("Language toggle works")
def check_lang_toggle(page: Page, results: Results) -> None:
    toggle = first_visible(
        page,
        [
            "#lang-en", "[data-lang='en']", "[data-lang=en]", "button[data-lang]",
            ".lang-toggle",
            # single-button toggle pattern (zh<->en on one button)
            "#langToggle", "#lang-toggle", "button[title='Language']",
            "button[aria-label*='language' i]", "button[aria-label*='語言']",
        ],
    )
    if toggle is None:
        results.skip("Language toggle works", "no language toggle found")
        return

    before_text = page.locator("#grid, main, body").first.inner_text()[:2000]
    before_pressed = toggle.get_attribute("aria-pressed")
    before_lang = page.locator("html").get_attribute("lang")

    toggle.click()
    page.wait_for_timeout(300)

    after_text = page.locator("#grid, main, body").first.inner_text()[:2000]
    after_pressed = toggle.get_attribute("aria-pressed")
    after_lang = page.locator("html").get_attribute("lang")

    changed = (
        before_text != after_text
        or (before_pressed != after_pressed and after_pressed is not None)
        or (before_lang != after_lang)
    )
    if changed:
        results.ok("Language toggle works", "visible text / state changed")
    else:
        results.fail("Language toggle works", "clicking toggle produced no observable change")


@check("Theme toggle works")
def check_theme_toggle(page: Page, results: Results) -> None:
    toggle = first_visible(
        page,
        ["#theme-toggle", "[data-theme-toggle]", ".theme-toggle", "button[aria-label*='theme' i]"],
    )
    if toggle is None:
        results.skip("Theme toggle works", "no theme toggle found")
        return

    def signature() -> tuple:
        html = page.locator("html")
        body = page.locator("body")
        return (
            html.get_attribute("data-theme"),
            html.get_attribute("class"),
            body.get_attribute("data-theme"),
            body.get_attribute("class"),
        )

    before = signature()
    toggle.click()
    page.wait_for_timeout(300)
    after = signature()

    if before != after:
        results.ok("Theme toggle works", "theme class/attribute on <html>/<body> changed")
    else:
        results.fail("Theme toggle works", "no theme attribute/class change detected")


@check("Search filters the grid")
def check_search(page: Page, results: Results) -> None:
    search = first_visible(
        page,
        ["#search", "input[type='search']", "input[name='search']", "[role='searchbox']"],
    )
    if search is None:
        results.skip("Search filters the grid", "no search input found")
        return

    before = card_count(page)
    if before == 0:
        results.skip("Search filters the grid", "no visible cards to filter")
        return

    # Derive a query from a real card so it matches at least one item, then we
    # also test a definitely-nonexistent query to confirm filtering narrows.
    sample = page.locator("#grid .card, .card").first.inner_text().strip().split()
    nonsense = "zzqxnonexistentquery123"

    search.fill(nonsense)
    page.wait_for_timeout(300)
    after_nonsense = card_count(page)

    search.fill("")
    page.wait_for_timeout(200)
    if sample:
        search.fill(sample[0][:8])
        page.wait_for_timeout(300)
    after_match = card_count(page)

    # Leave the input cleared so later checks see the full grid again.
    search.fill("")
    page.wait_for_timeout(200)

    if after_nonsense < before:
        detail = f"{before} -> {after_nonsense} on no-match query"
        if sample:
            detail += f", {after_match} on matching query"
        results.ok("Search filters the grid", detail)
    else:
        results.fail(
            "Search filters the grid",
            f"card count did not decrease (before={before}, after={after_nonsense})",
        )


@check("Filter chips update the grid")
def check_chips(page: Page, results: Results) -> None:
    chips = page.locator(".chip, [data-filter], .filter-chip")
    if chips.count() == 0:
        results.skip("Filter chips update the grid", "no .chip elements found")
        return

    before = card_count(page)
    # Click a chip that isn't an "all"/reset chip if we can identify one.
    target = None
    for i in range(min(chips.count(), 6)):
        c = chips.nth(i)
        label = (c.inner_text() or "").strip().lower()
        if label not in {"all", "全部", "reset", ""}:
            target = c
            break
    target = target or chips.first

    if not target.is_visible():
        results.skip("Filter chips update the grid", "chips present but not visible")
        return

    target.click()
    page.wait_for_timeout(300)
    after = card_count(page)
    pressed = target.get_attribute("aria-pressed")
    active = "active" in (target.get_attribute("class") or "")

    if after != before or pressed == "true" or active:
        results.ok("Filter chips update the grid", f"cards {before} -> {after}")
    else:
        results.fail("Filter chips update the grid", "clicking chip changed nothing observable")


@check("Dialog opens on card click and closes on Esc")
def check_dialog(page: Page, results: Results) -> None:
    card = first_visible(page, ["#grid .card", ".card"])
    if card is None:
        results.skip("Dialog opens on card click and closes on Esc", "no clickable card")
        return

    dialog_selectors = ["dialog[open]", "[role='dialog']:visible", ".dialog:visible", ".modal:visible"]
    card.click()
    page.wait_for_timeout(400)
    dialog = first_visible(page, dialog_selectors)
    if dialog is None:
        results.skip(
            "Dialog opens on card click and closes on Esc",
            "card click did not open a dialog (site may use inline detail)",
        )
        return

    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    still_open = first_visible(page, dialog_selectors, timeout=800)
    if still_open is None:
        results.ok("Dialog opens on card click and closes on Esc", "opened and Esc closed it")
    else:
        results.fail("Dialog opens on card click and closes on Esc", "dialog did not close on Esc")


@check("Deep link opens the target item")
def check_deep_link(page: Page, base_url: str, results: Results) -> None:
    # Find a slug/id we can deep-link to: prefer an explicit data-slug/id on a card.
    card = first_present(page, ["#grid .card[data-slug]", ".card[data-slug]", "#grid .card[id]", ".card[id]"])
    slug = None
    if card is not None:
        slug = card.get_attribute("data-slug") or card.get_attribute("id")
    if not slug:
        results.skip("Deep link opens the target item", "no card slug/id to deep-link to")
        return

    page.goto(f"{base_url}#{slug}", wait_until="domcontentloaded", timeout=TIMEOUT_MS)
    page.wait_for_timeout(500)
    opened = first_visible(
        page,
        ["dialog[open]", "[role='dialog']:visible", ".dialog:visible", ".modal:visible", f"#{slug}:visible"],
    )
    if opened is not None:
        results.ok("Deep link opens the target item", f"#{slug} opened a dialog/section")
    else:
        results.fail("Deep link opens the target item", f"#{slug} did not reveal the item")


@check("Responsive at 375px (no horizontal overflow)")
def check_responsive(page: Page, results: Results) -> None:
    page.set_viewport_size({"width": 375, "height": 800})
    page.wait_for_timeout(300)
    # Compare scrollable width to the viewport width with a small tolerance.
    metrics = page.evaluate(
        "() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth })"
    )
    overflow = metrics["scroll"] - metrics["client"]
    tolerance = 4  # px; sub-pixel rounding / scrollbar gutter
    if not has_content(page):
        results.fail("Responsive at 375px (no horizontal overflow)", "nothing rendered at 375px")
    elif overflow <= tolerance:
        results.ok("Responsive at 375px (no horizontal overflow)", f"overflow={overflow}px")
    else:
        results.fail(
            "Responsive at 375px (no horizontal overflow)",
            f"horizontal overflow of {overflow}px (scroll={metrics['scroll']}, client={metrics['client']})",
        )
    # Restore a desktop viewport for any later checks.
    page.set_viewport_size({"width": 1280, "height": 900})


@check("Basic a11y: images labelled, controls have accessible names")
def check_a11y(page: Page, results: Results) -> None:
    problems: list[str] = []

    # Images must have alt text (empty alt is allowed: it marks the image decorative).
    bad_images = page.evaluate(
        """() => Array.from(document.querySelectorAll('img'))
            .filter(img => !img.hasAttribute('alt')
                && img.getAttribute('role') !== 'presentation'
                && img.getAttribute('aria-hidden') !== 'true')
            .length"""
    )
    if bad_images:
        problems.append(f"{bad_images} <img> without alt/role=presentation")

    # Interactive controls should expose an accessible name.
    unnamed = page.evaluate(
        """() => Array.from(document.querySelectorAll('button, a[href], [role="button"]'))
            .filter(el => {
                const text = (el.textContent || '').trim();
                const aria = el.getAttribute('aria-label');
                const labelledby = el.getAttribute('aria-labelledby');
                const title = el.getAttribute('title');
                const hasImg = el.querySelector('img[alt]:not([alt=""])');
                return !text && !aria && !labelledby && !title && !hasImg;
            }).length"""
    )
    if unnamed:
        problems.append(f"{unnamed} interactive control(s) without an accessible name")

    if not problems:
        results.ok("Basic a11y: images labelled, controls have accessible names")
    else:
        results.fail(
            "Basic a11y: images labelled, controls have accessible names",
            "; ".join(problems),
        )


@check("No tool attribution in the shipped page")
def check_no_attribution(page: Page, results: Results) -> None:
    # The serialized DOM covers the rendered footer, inline text, and HTML
    # comments — the places a generator's name most plausibly leaks into output.
    html = (page.content() or "").lower()
    hits = sorted({tok for tok in ATTRIBUTION_TOKENS if tok in html})
    if hits:
        results.fail(
            "No tool attribution in the shipped page",
            f"found {', '.join(hits)} — the site must not disclose what tool produced it",
        )
    else:
        results.ok("No tool attribution in the shipped page")


# --------------------------------------------------------------------------- #
# Orchestration
# --------------------------------------------------------------------------- #
def reset_view(page: Page) -> None:
    """Return the page to a clean, full-grid state between checks.

    Checks mutate state (search text, active filter chip, an open dialog). Without
    a reset, a later check inherits a filtered/empty grid and fails spuriously.
    """
    try:
        # Close any open dialog.
        page.keyboard.press("Escape")
        # Clear search inputs.
        for sel in ["#search", "#searchInput", "input[type='search']", "[role='searchbox']"]:
            loc = page.locator(sel)
            if loc.count() and loc.first.is_visible():
                loc.first.fill("")
                break
        # Reset filter to an "all"/reset chip if one exists.
        chips = page.locator(".chip, [data-filter], .filter-chip")
        for i in range(min(chips.count(), 8)):
            c = chips.nth(i)
            label = (c.inner_text() or "").strip().lower()
            if label in {"all", "全部", "reset"}:
                c.click()
                break
        page.wait_for_timeout(200)
    except Exception:
        pass  # reset is best-effort; never let it abort the suite


def run_checks(page: Page, base_url: str, console_errors: list[str], results: Results) -> None:
    print("\nRunning UX checks:\n", flush=True)
    check_title(page, results)
    check_cards(page, results)
    # Functional checks (these mutate page state, so reset the view between them).
    check_lang_toggle(page, results)
    check_theme_toggle(page, results)
    check_search(page, results)
    reset_view(page)
    check_chips(page, results)
    reset_view(page)
    check_dialog(page, results)
    reset_view(page)
    check_deep_link(page, base_url, results)
    reset_view(page)
    check_responsive(page, results)
    check_a11y(page, results)
    check_no_attribution(page, results)
    # Console errors are accumulated across the whole session; check last.
    check_console(page, results, console_errors)


# --------------------------------------------------------------------------- #
# Multi-page support (a shared-shell site: one .html per page, one data file)
# --------------------------------------------------------------------------- #
def discover_pages(page: Page) -> list[dict]:
    """Read window.SITE_PAGES to learn the page list of a multi-page site.

    Returns [] for a single-page site (no SITE_PAGES), which tells the caller
    to fall back to the classic single-page suite.
    """
    with contextlib.suppress(PlaywrightTimeout, PlaywrightError):
        return page.evaluate(
            """() => (Array.isArray(window.SITE_PAGES) ? window.SITE_PAGES : []).map(p => ({
                slug: String(p.slug),
                layout: String(p.layout || ''),
                href: p.slug === 'home' ? 'index.html' : p.slug + '.html'
            }))"""
        )
    return []


@check("Cross-page nav is present and links resolve")
def check_nav_links(page: Page, base_url: str, results: Results, pages: list[dict]) -> None:
    import urllib.request

    pills = page.locator(".navpill, .pagenav a, nav a[href$='.html']").count()
    if pills < max(2, len(pages) - 0):
        results.fail(
            "Cross-page nav is present and links resolve",
            f"expected ~{len(pages)} nav links, found {pills}",
        )
        return
    bad: list[str] = []
    for pg in pages:
        url = f"{base_url}/{pg['href']}"
        try:
            with urllib.request.urlopen(url, timeout=5) as resp:  # noqa: S310 - localhost
                if resp.status != 200:
                    bad.append(f"{pg['href']} ({resp.status})")
        except Exception as exc:  # noqa: BLE001
            bad.append(f"{pg['href']} ({_short(exc, 40)})")
    if bad:
        results.fail("Cross-page nav is present and links resolve", "; ".join(bad))
    else:
        results.ok(
            "Cross-page nav is present and links resolve",
            f"{pills} nav links, {len(pages)} pages all 200",
        )


@check("Language choice persists across navigation")
def check_lang_persist(page: Page, base_url: str, results: Results, pages: list[dict]) -> None:
    second = next((p for p in pages if p["slug"] != "home"), None)
    if second is None:
        results.skip("Language choice persists across navigation", "only one page")
        return

    page.goto(base_url, wait_until="networkidle", timeout=TIMEOUT_MS)
    toggle = first_visible(page, ["#langToggle", "button[title='Language']", "button[aria-label*='language' i]"])
    if toggle is None:
        results.skip("Language choice persists across navigation", "no language toggle")
        return

    before = page.locator("html").get_attribute("lang")
    toggle.click()
    page.wait_for_timeout(250)
    after = page.locator("html").get_attribute("lang")
    if after == before:
        results.skip("Language choice persists across navigation", "toggle did not change <html lang>")
        return

    page.goto(f"{base_url}/{second['href']}", wait_until="networkidle", timeout=TIMEOUT_MS)
    page.wait_for_timeout(200)
    lang2 = page.locator("html").get_attribute("lang")
    if lang2 == after:
        results.ok(
            "Language choice persists across navigation",
            f"{before} -> {after}, still {lang2} after navigating to {second['href']}",
        )
    else:
        results.fail(
            "Language choice persists across navigation",
            f"set {after} but {second['href']} loaded as {lang2}",
        )


def run_page_checks(page: Page, page_url: str, errors: list[str], results: Results, slug: str) -> None:
    """The click-safe core suite for ONE page of a multi-page site.

    Interaction checks (search/chips/dialog/deep-link) run only when the page
    actually exposes those controls, so a nav-only hub page won't be clicked
    into navigating away mid-run. `page_url` is THIS page's own URL, so a
    #slug deep link resolves against the right .html (not the site root).
    """
    print(f"\n  Page: {slug}", flush=True)
    check_title(page, results)
    check_cards(page, results)
    check_lang_toggle(page, results)
    check_theme_toggle(page, results)
    # Interaction checks: only when the relevant controls/items exist on THIS page.
    if page.locator("#search, input[type='search']").count():
        check_search(page, results)
        reset_view(page)
    if page.locator(".chip, [data-filter], .filter-chip").count():
        check_chips(page, results)
        reset_view(page)
    if page.locator(".card[data-slug]").count():
        check_dialog(page, results)
        reset_view(page)
        check_deep_link(page, page_url, results)
        reset_view(page)
    check_responsive(page, results)
    check_a11y(page, results)
    check_no_attribution(page, results)
    check_console(page, results, errors)


def run_multipage(context, base_url: str, pages: list[dict], results: Results) -> None:
    print(f"\nMulti-page site: {len(pages)} pages "
          f"({', '.join(p['slug'] for p in pages)})", flush=True)

    # Site-wide checks on a dedicated page.
    nav_page = context.new_page()
    nav_page.goto(base_url, wait_until="networkidle", timeout=TIMEOUT_MS)
    check_nav_links(nav_page, base_url, results, pages)
    check_lang_persist(nav_page, base_url, results, pages)
    with contextlib.suppress(Exception):
        nav_page.close()

    # Per-page checks, each on its own fresh page so console errors and any
    # accidental navigation stay isolated to that page.
    for pg in pages:
        page = context.new_page()
        errors: list[str] = []
        page.on(
            "console",
            lambda msg, errs=errors: errs.append(f"{msg.type}: {msg.text}") if msg.type == "error" else None,
        )
        page.on("pageerror", lambda err, errs=errors: errs.append(f"pageerror: {_short(err)}"))
        url = f"{base_url}/{pg['href']}"
        try:
            page.goto(url, wait_until="networkidle", timeout=TIMEOUT_MS)
            run_page_checks(page, url, errors, results, pg["slug"])
        except (PlaywrightTimeout, PlaywrightError) as exc:
            results.fail(f"Page loads: {pg['slug']}", f"could not load {url}: {_short(exc)}")
        finally:
            with contextlib.suppress(Exception):
                page.close()


def verify(base_url: str, force_single: bool = False) -> Results:
    results = Results()
    console_errors: list[str] = []

    with sync_playwright() as p:
        browser: Browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        context.set_default_timeout(TIMEOUT_MS)
        page = context.new_page()

        # Capture console errors and uncaught page errors throughout the run.
        page.on(
            "console",
            lambda msg: console_errors.append(f"{msg.type}: {msg.text}")
            if msg.type == "error"
            else None,
        )
        page.on("pageerror", lambda err: console_errors.append(f"pageerror: {_short(err)}"))

        try:
            print(f"Loading {base_url} ...", flush=True)
            page.goto(base_url, wait_until="networkidle", timeout=TIMEOUT_MS)
            pages = [] if force_single else discover_pages(page)
            if len(pages) > 1:
                # Multi-page site (shared shell, one .html per page).
                with contextlib.suppress(Exception):
                    page.close()
                run_multipage(context, base_url, pages, results)
            else:
                run_checks(page, base_url, console_errors, results)
        except (PlaywrightTimeout, PlaywrightError) as exc:
            results.fail("Page loads", f"could not load {base_url}: {_short(exc)}")
        finally:
            with contextlib.suppress(Exception):
                context.close()
            with contextlib.suppress(Exception):
                browser.close()

    return results


def print_summary(results: Results) -> None:
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    total = results.passed + results.skipped + results.failed
    print(f"  PASS: {results.passed}")
    print(f"  SKIP: {results.skipped}")
    print(f"  FAIL: {results.failed}")
    print(f"  TOTAL CHECKS: {total}")
    if results.failed:
        print("\n  Failed checks:")
        for status, label, detail in results.rows:
            if status == "FAIL":
                print(f"    - {label}: {detail}")
    print("=" * 60)
    print("RESULT:", "FAIL ✗" if results.failed else "PASS ✓")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify this static site's UX with Playwright.",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="URL of an already-running site, e.g. http://localhost:8000")
    group.add_argument("--dir", help="Path to a folder containing index.html (a local server is started)")
    parser.add_argument(
        "--single",
        action="store_true",
        help="Force single-page mode (skip multi-page crawl even if window.SITE_PAGES exists)",
    )
    args = parser.parse_args()

    server = None
    thread = None
    try:
        if args.url:
            base_url = args.url.rstrip("/")
        else:
            import os

            site_dir = os.path.abspath(args.dir)
            if not os.path.isfile(os.path.join(site_dir, "index.html")):
                print(f"ERROR: no index.html found in {site_dir}", file=sys.stderr)
                return 1
            base_url, server, thread = start_static_server(site_dir)
            print(f"Serving {site_dir} at {base_url}", flush=True)

        results = verify(base_url, force_single=args.single)
        print_summary(results)
        return 1 if results.failed else 0
    finally:
        if server is not None:
            with contextlib.suppress(Exception):
                server.shutdown()
                server.server_close()
        if thread is not None:
            thread.join(timeout=2)


if __name__ == "__main__":
    sys.exit(main())
