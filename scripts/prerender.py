#!/usr/bin/env python3
"""Bake the JS-rendered page body back into every static .html file.

The site renders itself from `data/*.js` at runtime, but each .html file also
ships a pre-rendered copy of that output so crawlers and JS-less visitors get
the real content. Hand-maintaining both copies is how they drift; this script
regenerates the static half from the live renderer, which is the single source
of truth.

For every entry in `window.SITE_PAGES` (English at the root, Traditional
Chinese under /zh-Hant/) it loads the page in headless Chromium, waits for the
render, and rewrites the file's `<main id="page">…</main>` block and `<title>`
with what the browser actually produced. Everything else in the file -- meta
description, canonical, hreflang, structured data -- is left untouched, because
those are per-page editorial decisions, not renderer output.

Usage (always via uv -- this project mandates uv for all Python):

    uv run --with playwright playwright install chromium   # one-time
    uv run --with playwright python scripts/prerender.py --dir .

Exits 0 when every page was rendered and written, 1 if any page failed.
"""

from __future__ import annotations

import argparse
import contextlib
import functools
import http.server
import re
import socket
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

TIMEOUT_MS = 15000

# Rewritten regions. Both are unique per file, so a plain span replace is safe.
MAIN_RE = re.compile(r'(<main id="page">)(.*?)(</main>)', re.S)
TITLE_RE = re.compile(r"(<title>)(.*?)(</title>)", re.S)


def free_port() -> int:
    with contextlib.closing(socket.socket()) as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


@contextlib.contextmanager
def serve(directory: Path):
    """Serve `directory` on a free localhost port for the lifetime of the block."""
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        """Same as the stdlib handler, minus a request log line per asset."""

        def log_message(self, *args):  # noqa: D102 - silence is the point
            pass

    handler = functools.partial(QuietHandler, directory=str(directory))
    socketserver.TCPServer.allow_reuse_address = True
    port = free_port()
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        thread.start()
        try:
            yield f"http://127.0.0.1:{port}"
        finally:
            httpd.shutdown()


def page_paths(slug: str) -> tuple[str, str]:
    """(english path, chinese path) relative to the site root, for one slug."""
    leaf = "index.html" if slug == "home" else f"{slug}.html"
    return leaf, f"zh-Hant/{leaf}"


def bake(file: Path, body: str, title: str) -> bool:
    """Write the rendered body and title into `file`. True if the file changed."""
    original = file.read_text(encoding="utf-8")

    if not MAIN_RE.search(original):
        raise ValueError(f'{file}: no <main id="page"> block to write into')
    updated = MAIN_RE.sub(
        lambda m: m.group(1) + "\n" + body.strip() + "\n" + m.group(3),
        original,
        count=1,
    )
    updated = TITLE_RE.sub(
        lambda m: m.group(1) + title + m.group(3),
        updated,
        count=1,
    )

    if updated == original:
        return False
    file.write_text(updated, encoding="utf-8")
    return True


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dir", default=".", help="site root (contains index.html)")
    args = ap.parse_args()

    root = Path(args.dir).resolve()
    if not (root / "index.html").is_file():
        print(f"error: {root}/index.html not found", file=sys.stderr)
        return 1

    failures: list[str] = []
    written = 0

    with serve(root) as base, sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.set_default_timeout(TIMEOUT_MS)

        page.goto(f"{base}/index.html", wait_until="load")
        slugs = page.evaluate("window.SITE_PAGES.map(p => p.slug)")

        for slug in slugs:
            for rel in page_paths(slug):
                target = root / rel
                if not target.is_file():
                    failures.append(f"{rel}: file does not exist")
                    print(f"  [MISS] {rel}", flush=True)
                    continue
                try:
                    page.goto(f"{base}/{rel}", wait_until="load")
                    # app.js replaces #page wholesale once the shell is ready.
                    page.wait_for_selector("main#page > *", state="attached")
                    body = page.inner_html("main#page")
                    title = page.title()
                    changed = bake(target, body, title)
                except Exception as exc:  # noqa: BLE001 - report and keep going
                    failures.append(f"{rel}: {exc}")
                    print(f"  [FAIL] {rel}  -- {exc}", flush=True)
                    continue
                written += int(changed)
                print(f"  [{'BAKE' if changed else 'SAME'}] {rel}", flush=True)

        browser.close()

    print(f"\n{written} file(s) updated, {len(failures)} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
