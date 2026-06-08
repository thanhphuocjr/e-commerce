#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"
PORT="${HTTP_PORT:-8080}"

cd "${ROOT_DIR}"

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok is not installed. Install it first with: brew install ngrok/ngrok/ngrok" >&2
  exit 1
fi

if ! ngrok config check >/dev/null 2>&1; then
  echo "ngrok authtoken is not configured." >&2
  echo "Get a free token at: https://dashboard.ngrok.com/get-started/your-authtoken" >&2
  echo "Then run: ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>" >&2
  exit 1
fi

if [ ! -f "${ENV_FILE}" ]; then
  echo "Missing ${ENV_FILE}. Create it first." >&2
  exit 1
fi

echo "Starting local Docker stack..."
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d

echo "Waiting for local app health check..."
for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null; then
    break
  fi
  sleep 1
done

curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null

echo "Opening public ngrok tunnel for http://127.0.0.1:${PORT}"
echo "Keep this terminal open while demoing."
ngrok http "${PORT}"
