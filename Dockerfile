# syntax=docker/dockerfile:1
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ ./src/
COPY static/ ./static/
COPY templates/ ./templates/
COPY .env.example ./.env.example
ENV PORT=8080
EXPOSE 8080
CMD ["python", "src/app.py"]
