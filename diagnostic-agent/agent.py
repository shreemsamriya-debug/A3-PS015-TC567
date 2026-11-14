
import json
import secrets
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ENGINE_DIR = BASE_DIR / "network_engine"
DIAGNOSTICS_SCRIPT = ENGINE_DIR / "diagnostics.py"

WEBSITE_ORIGIN = "https://net-sense-ai.vercel.app"
HOST = "127.0.0.1"
PORT = 8765

TOKEN = secrets.token_urlsafe(32)
diagnostic_lock = threading.Lock()


class NetSenseHandler(BaseHTTPRequestHandler):

    def send_json(self, status, data):
        body = json.dumps(data).encode("utf-8")

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")

        if self.headers.get("Origin") == WEBSITE_ORIGIN:
            self.send_header("Access-Control-Allow-Origin", WEBSITE_ORIGIN)
            self.send_header("Vary", "Origin")

        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        if self.headers.get("Origin") != WEBSITE_ORIGIN:
            self.send_error(403, "Website origin not allowed.")
            return

        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", WEBSITE_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Vary", "Origin")

        if self.headers.get("Access-Control-Request-Private-Network") == "true":
            self.send_header("Access-Control-Allow-Private-Network", "true")

        self.end_headers()

    def authorized(self):
        origin = self.headers.get("Origin", "")
        host = self.headers.get("Host", "")

        if origin != WEBSITE_ORIGIN:
            self.send_json(403, {
                "status": "error",
                "message": "Website origin not allowed."
            })
            return False

        if host not in (f"127.0.0.1:{PORT}", f"localhost:{PORT}"):
            self.send_json(403, {
                "status": "error",
                "message": "Invalid local host."
            })
            return False

        if self.headers.get("Authorization") != f"Bearer {TOKEN}":
            self.send_json(401, {
                "status": "error",
                "message": "Invalid agent token."
            })
            return False

        return True

    def do_GET(self):
        if self.path != "/health":
            self.send_json(404, {
                "status": "error",
                "message": "Not found."
            })
            return

        if not self.authorized():
            return

        self.send_json(200, {
            "status": "ready",
            "application": "NetSense AI Local Agent",
            "version": "1.1"
        })

    def do_POST(self):
        if self.path != "/diagnose":
            self.send_json(404, {
                "status": "error",
                "message": "Not found."
            })
            return

        if not self.authorized():
            return

        if not diagnostic_lock.acquire(blocking=False):
            self.send_json(429, {
                "status": "error",
                "message": "A diagnostic is already running."
            })
            return

        try:
            if not DIAGNOSTICS_SCRIPT.is_file():
                self.send_json(500, {
                    "status": "error",
                    "message": "Diagnostic engine not found."
                })
                return

            result = subprocess.run(
                [sys.executable, str(DIAGNOSTICS_SCRIPT), "--json"],
                cwd=str(ENGINE_DIR),
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=180,
                check=False
            )

            if result.returncode != 0:
                self.send_json(500, {
                    "status": "error",
                    "message": "Diagnostic execution failed.",
                    "details": result.stderr[-1000:]
                })
                return

            report = json.loads(result.stdout.strip())

            self.send_json(200, {
                "status": "success",
                "report": report
            })

        except subprocess.TimeoutExpired:
            self.send_json(504, {
                "status": "error",
                "message": "Diagnostic timed out."
            })

        except json.JSONDecodeError:
            self.send_json(500, {
                "status": "error",
                "message": "Diagnostic engine returned invalid JSON."
            })

        except Exception as error:
            self.send_json(500, {
                "status": "error",
                "message": str(error)
            })

        finally:
            diagnostic_lock.release()

    def log_message(self, format, *args):
        print("[NetSense Agent]", format % args)


if __name__ == "__main__":

    if not DIAGNOSTICS_SCRIPT.is_file():
        print("ERROR: diagnostics.py was not found.")
        sys.exit(1)

    server = ThreadingHTTPServer((HOST, PORT), NetSenseHandler)

    print("\n====================================")
    print("       NETSENSE AI LOCAL AGENT")
    print("====================================")
    print("Agent address: http://127.0.0.1:8765")
    print("\nYour new private connection token:")
    print(TOKEN)
    print("\nCopy this token directly into the website.")
    print("DO NOT share it in chat or screenshots.")
    print("\nKeep this terminal open while using NetSense AI.")
    print("Press Ctrl+C to stop the agent.")
    print("====================================\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping NetSense AI agent...")
    finally:
        server.server_close()
