Executive Summary
This app is for the students who have trouble keeping track of the tasks they have to do. 
This app makes it so that you can have everything on your To-Do List in one place. You write everything you need to do that day. There is even a “done” button to indicate you finished it. After that, you can also delete the task so the list doesn’t get too long. 

System Overview
I created a flask web app API task manager. 

Architecture Diagram:



How to Run:
# build docker 
build -t task-tracker:latest . 
# run 
docker run --rm -p 5050:5050 --env-file .env task-tracker:latest 
# health check 
curl http://localhost:5050/health

Design Decisions
Why this concept: Flask was lightweight, easy for containerization, and good for beginners. Alternatives considered: SQLite or MongoDB. However, they weren’t chosen 
Tradeoffs: In-memory tasks vanish on restart; simple but not persistent. 
Security/Privacy: No secrets in repo; .env.example provided; input validated. 
Ops: Logs to stdout; one-command run; known limitation = non-persistent data.

Results & Evaluation
Screenshots of the UI (/assets/) showing add/delete/checkbox actions. 
Health endpoint output ({"status":"ok"}). 
Note that the image size is small and runs instantly. 
Mention optional smoke test (tests/test_smoke.py) that checks /health.
