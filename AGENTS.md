# AGENTS.md — Matcha

Guidance for AI agents (and humans) working in this repository.

## Project context

**Matcha** is a 42 school project: a full-stack **dating website**
(subject: `matcha.pdf`, v6.1). Registration → profile → matching → likes →
real-time chat & notifications. Graded in a peer-defense; **any security breach
= score 0**.

**Contributors:** Spyder & Weirdo — both **full-stack**. Work is split by
feature vertical (see ROADMAP.md), not by layer. Both are evaluated
individually: *everyone must be able to explain the entire codebase* —
always review each other's PRs.

## Hard constraints (from the subject — non-negotiable)

1. **Micro-framework only.** Flask provides routing/templating. It must **not**
   be extended with:
   - ❌ ORM / OGM (SQLAlchemy, neo4j OGM, neomodel…)
   - ❌ Validator libraries (WTForms, marshmallow, pydantic-as-validation…)
   - ❌ User Account Managers (Flask-Login, Flask-Security, django-allauth…)
   - ✅ Everything above is **hand-written**: Cypher queries, input validation,
     auth/session logic.
2. **Database:** Neo4j (graph), accessed via the official `neo4j` Python driver
   with **parameterized Cypher only**.
3. **Security minimums:** bcrypt-hashed passwords, no SQL/Cypher injection,
   no HTML/JS injection in unprotected variables, validated file uploads,
   no unhandled errors (server or client console), proper HTTP status codes.
4. **Secrets:** only in `.env` (git-ignored). `.env.example` documents the keys.
5. **Layout:** header / main / footer on every page; **mobile-friendly**;
   compatible with latest Firefox & Chrome.
6. **Real-time:** chat & notifications ≤ 10s delay; unread badges visible from
   any page.
7. **Evaluation:** DB seeded with ≥ 500 distinct profiles (`seed/seed.py`).

## Tech stack

| Concern   | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Backend   | Python 3.10+, Flask, Flask-SocketIO, `neo4j` driver, bcrypt, itsdangerous, python-dotenv |
| Frontend  | React 18 + **TypeScript** + Vite, Tailwind CSS, react-router, socket.io-client |
| Infra     | Docker Compose — one container per service: Neo4j (bolt `7687`, browser `7474`), backend API (`5001` — macOS AirPlay holds `5000`), frontend UI (`5173`), Mailpit (`8025`, SMTP `1025`) |

## Repository layout

```
backend/app/
├── __init__.py      # app factory (create_app)
├── config.py        # reads .env — never hardcode secrets
├── db.py            # neo4j driver singleton + query helpers
├── routes/          # one blueprint per domain: auth, profile, browse,
│                    # search, interact, chat, notifications
├── sockets.py       # Socket.IO event handlers (chat, notifications, presence)
└── utils/
    ├── validation.py  # hand-written validators (email, password strength…)
    ├── security.py    # hashing, tokens, decorators (@require_auth)
    └── email.py       # verification / password-reset emails
frontend/src/
├── components/      # reusable UI (UserCard, TagInput, NotificationBell…)
├── pages/           # one folder per route
├── hooks/           # useAuth, useSocket, useNotifications
└── api/             # fetch wrappers + shared TS types
```

## Commands

```bash
docker compose up -d --build                      # full stack (neo4j, backend, frontend, mailpit)
docker compose up -d neo4j mailpit                # infra only (host-dev hybrid)
cd backend && source venv/bin/activate
python run.py                                     # backend :5001 (host dev)
cd frontend && npm run dev                        # frontend :5173 (host dev)
python seed/seed.py --count 500                   # seed DB
```

## Coding conventions

- **Python:** PEP 8, type hints, one blueprint per domain, routes only do
  HTTP plumbing → call a service/query function in `db.py` or `services/`.
- **TypeScript:** strict mode, no `any` without a comment, shared types live
  in `frontend/src/api/types.ts` and mirror the backend JSON shapes.
- **Cypher:** always parameterized (`session.run(query, **params)`), never
  f-strings with user input. Constraints/indexes defined in `db.py` init.
- **Validation:** every endpoint validates input via `utils/validation.py`;
  every form mirrors the same rules client-side.
- **Errors:** return proper HTTP codes + JSON `{error: "..."}`; frontend
  displays friendly messages. Never leak stack traces.
- **Git:** feature branches `feat/<topic>` / `fix/<topic>`, small PRs reviewed
  by the other contributor, no commits of `.env`, uploads, or credentials.
  Commit style: `feat(auth): add password reset endpoint`.
- **Definition of done:** works in Firefox + Chrome, mobile layout OK,
  no console errors, validation tested, peer-reviewed.

## Security checklist (run before every merge)

- [ ] Password bcrypt-hashed, dictionary words rejected (wordlist check)
- [ ] All Cypher parameterized
- [ ] All forms validated client + server
- [ ] Uploads: extension/MIME/size allowlist, stored outside web root
- [ ] No `.env` or secrets committed
- [ ] No unhandled rejection / stack trace visible anywhere
- [ ] Auth required on every non-public endpoint (check `curl` without cookie)

## Task assignment

See [ROADMAP.md](./ROADMAP.md) for the full plan. Ownership is **by feature
vertical** — each owner ships Cypher + Flask API + React UI for their scope:

| Owner     | Scope                                                                                 |
| --------- | ------------------------------------------------------------------------------------- |
| **Spyder**  | Infra/backend skeleton, Auth, Matching engine & Browse, Interactions, Chat            |
| **Weirdo**  | Frontend skeleton, Profile, Views/Likes lists, Search, Notifications, Seed            |
| **Shared**  | Types contract, security audit, cross-browser QA, integration testing, defense        |

Keep this file and ROADMAP.md up to date when structure, conventions or
assignments change.
