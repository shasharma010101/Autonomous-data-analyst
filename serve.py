#!/usr/bin/env python3
"""Cross-platform local web server for Autonomous Data Analyst.

Works on Linux, macOS and Windows without PowerShell or any third-party
packages. Usage:

    python3 serve.py          # opens http://localhost:8000/
    PORT=9000 python3 serve.py
"""

import http.server
import os
import socketserver
import sys
import threading
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
START_PORT = int(os.environ.get("PORT", "8000"))
MAX_TRIES = 20


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Always serve fresh files while developing/demoing.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    httpd = None
    port = START_PORT
    for port in range(START_PORT, START_PORT + MAX_TRIES):
        try:
            httpd = Server(("127.0.0.1", port), Handler)
            break
        except OSError:
            continue

    if httpd is None:
        print(
            f"[!] No free port found in range {START_PORT}-{START_PORT + MAX_TRIES - 1}."
        )
        return 1

    url = f"http://localhost:{port}/"
    print("=" * 58)
    print("        Autonomous Data Analyst - Local Web Server")
    print("=" * 58)
    print(f" Server URL : {url}")
    print(f" Local Path : {BASE_DIR}")
    print(" Status     : Active & Listening for requests")
    print(" Stop Server: Press Ctrl+C anytime")
    print("=" * 58)
    sys.stdout.flush()

    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
