# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code and assets
COPY src/ ./src/
COPY templates/ ./templates/
COPY static/ ./static/

# Default port (overridden by .env if needed)
ENV PORT=5050
EXPOSE 5050

CMD ["python", "src/app.py"]
