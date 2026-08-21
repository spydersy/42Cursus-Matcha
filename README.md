# 🍵 Matcha

> Because love, too, can be industrialized.

**Matcha** is a full-stack dating web application (42 project). It covers the entire
process from registration to the final meeting: users register, complete their profile,
browse and search for matches, like each other, and chat in real time once connected.

**Contributors:** [Spyder](https://github.com/) & [Weirdo](https://github.com/)

---

## ✨ Features

- **Auth** — Registration with email verification, login/logout, password reset,
  strong-password policy (no dictionary words)
- **Profile** — Gender, sexual preferences, biography, reusable interest tags
  (`#vegan`, `#geek`, …), up to 5 pictures (1 profile picture), GPS location
  (with consent + manual fallback), editable at any time
- **Fame rating** — Public popularity score for every user
- **Browsing** — Smart suggestions based on orientation, geographic proximity,
  common tags and fame rating; sortable & filterable by age, location, fame, tags
- **Advanced search** — By age range, fame range, location and interest tags
- **Profile views** — Like/unlike, mutual-like = *connected*, visit history,
  online status & last connection, report fake account, block user
- **Chat** — Real-time messaging between connected users (≤ 10s delay)
- **Notifications** — Real-time alerts for likes, profile views, messages,
  matches and unlikes; unread badge visible from any page

## 🛠️ Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Backend    | Python 3 · **Flask** (micro-framework) · Flask-SocketIO |
| Frontend   | **React + TypeScript** (Vite) · Tailwind CSS           |
| Database   | **Neo4j** (graph DB, hand-written Cypher queries)      |
| Real-time  | Socket.IO (`Flask-SocketIO` + `socket.io-client`)      |
| Auth       | Hand-rolled sessions (httpOnly cookies) · bcrypt · itsdangerous |
| DevOps     | Docker Compose — one container per service (Neo4j, API, UI, Mailpit) · Faker seed script |

> ⚠️ Subject constraints: **no ORM/OGM, no validation libraries, no
> user-account-manager libraries.** All queries and validations are hand-written.

## 📁 Project Structure

```
matcha/
├── docker-compose.yml      # One container per service: neo4j, backend, frontend, mailpit
├── .env.example            # Template for environment variables
├── backend/
│   ├── Dockerfile          # API container (python:3.12-slim)
│   ├── run.py              # Entry point
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py     # App factory
│       ├── config.py       # Env-based configuration
│       ├── db.py           # Neo4j driver + Cypher helpers
│       ├── routes/         # auth, profile, browse, search, interact, chat, notifs
│       ├── sockets.py      # Socket.IO real-time events
│       └── utils/          # validation, security, email
├── frontend/               # Vite + React + TypeScript + Tailwind
│   ├── Dockerfile          # UI container (node:20-alpine)
│   └── src/
│       ├── components/     # Reusable UI (cards, badges, layout…)
│       ├── pages/          # Route pages
│       ├── hooks/          # auth, socket…
│       └── api/            # Backend client + types
└── seed/                   # 500+ profile generator (Faker)
```

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Python 3.10+
- Node.js 18+

### 1. Environment variables

```bash
cp .env.example .env
# Fill in the values (see table below) — NEVER commit .env
```

| Variable         | Description                              | Example                  |
| ---------------- | ---------------------------------------- | ------------------------ |
| `SECRET_KEY`     | Flask session/token secret               | *(random 64-char hex)*   |
| `NEO4J_URI`      | Bolt connection string                   | `bolt://localhost:7687`  |
| `NEO4J_USER`     | Neo4j username                           | `neo4j`                  |
| `NEO4J_PASSWORD` | Neo4j password                           | *(choose one)*           |
| `MAIL_HOST`      | SMTP host (Mailpit in dev)               | `localhost`              |
| `MAIL_PORT`      | SMTP port                                | `1025`                   |
| `MAIL_FROM`      | Sender address                           | `no-reply@matcha.local`  |
| `FRONTEND_URL`   | Used in verification/reset email links   | `http://localhost:5173`  |
| `UPLOAD_FOLDER`  | Where profile pictures are stored        | `uploads` (rel. to `backend/`) |

### 2a. Everything in Docker (each service in its own container)

```bash
docker compose up -d --build
# UI            → http://localhost:5173
# API           → http://localhost:5001  (5001: macOS AirPlay Receiver holds 5000)
# Neo4j browser → http://localhost:7474
# Mailpit inbox → http://localhost:8025
```

Source folders are bind-mounted, so code edits hot-reload inside the containers.

### 2b. Hybrid: infra in Docker, code on the host

```bash
docker compose up -d neo4j mailpit
# Neo4j browser → http://localhost:7474
# Mailpit inbox  → http://localhost:8025
```

### 3. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python run.py          # → http://localhost:5001
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev            # → http://localhost:5173
```

### 5. Seed the database (required for evaluation: ≥ 500 profiles)

```bash
# with the backend venv activated
python seed/seed.py --count 500
```

## 🔒 Security

- Passwords hashed with **bcrypt** — never stored in plain text
- All Cypher queries **parameterized** (no injection)
- All user input validated server-side; output escaped (no XSS/HTML/JS injection)
- File uploads validated (type, size, extension allowlist)
- Credentials and secrets live only in `.env` (git-ignored)
- No unhandled errors — proper HTTP status codes, graceful client handling

## 🗺️ Roadmap & Task Assignment

See **[ROADMAP.md](./ROADMAP.md)** — work is split equally by **feature
vertical**: **Spyder** (auth, matching/browse, interactions, chat) and
**Weirdo** (profile, search, notifications, seed) each ship API + UI end-to-end.

## 📚 Docs for AI agents

See **[AGENTS.md](./AGENTS.md)** for coding conventions, constraints and workflows.
