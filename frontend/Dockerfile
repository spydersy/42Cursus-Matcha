# Matcha frontend — Vite + React + TypeScript dev server (hot reload via bind mount)
FROM node:20-alpine

WORKDIR /app

# Dependencies first for layer caching (package.json is delivered by T3).
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host makes the dev server reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
