# Matcha backend — Flask API + Socket.IO (dev image, hot reload via bind mount)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencies first for layer caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# run.py is delivered by T2 (backend skeleton).
CMD ["python", "run.py"]
