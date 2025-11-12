import os, threading
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

def create_app():
    app = Flask(__name__, template_folder="../templates", static_folder="../static")
    CORS(app)

    tasks = {}
    next_id = {"value": 1}
    lock = threading.Lock()

    # seed
    with lock:
        for title in ["Learn Flask", "Dockerize app", "Write README case-study"]:
            tid = next_id["value"]; next_id["value"] += 1
            tasks[tid] = {"id": tid, "title": title, "done": False}

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    @app.get("/api/tasks")
    def list_tasks():
        with lock:
            data = [tasks[k] for k in sorted(tasks.keys(), reverse=True)]
        return jsonify(data), 200

    @app.post("/api/tasks")
    def create_task():
        payload = request.get_json(force=True) or {}
        title = str(payload.get("title", "")).strip()
        if not title:
            return jsonify({"error": "title is required"}), 400
        with lock:
            tid = next_id["value"]; next_id["value"] += 1
            tasks[tid] = {"id": tid, "title": title, "done": False}
            created = dict(tasks[tid])
        return jsonify(created), 201

    @app.patch("/api/tasks/<int:task_id>")
    def update_task(task_id):
        payload = request.get_json(force=True) or {}
        with lock:
            if task_id not in tasks:
                return jsonify({"error": "not found"}), 404
            if "title" in payload:
                t = str(payload["title"]).strip()
                if t:
                    tasks[task_id]["title"] = t
            if "done" in payload:
                tasks[task_id]["done"] = bool(payload["done"])
            updated = dict(tasks[task_id])
        return jsonify(updated), 200

    @app.delete("/api/tasks/<int:task_id>")
    def delete_task(task_id):
        with lock:
            if task_id not in tasks:
                return jsonify({"error": "not found"}), 404
            del tasks[task_id]
        return "", 204

    @app.get("/")
    def home():
        return render_template("index.html")

    return app

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=False)
