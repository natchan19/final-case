import requests, os
PORT = os.getenv("PORT", "8080")
def test_health():
    r = requests.get(f"http://localhost:{PORT}/health", timeout=3)
    assert r.status_code == 200
    assert r.json().get("status") == "ok"
