# 🗺️ Matcha — Roadmap

Work plan split **equally** between the two contributors — **by feature
vertical, not by layer**. Each owner ships their features **end-to-end**
(Cypher + Flask API + React UI), so both build API, UI and matching logic
first-hand:

- **🕷️ Spyder** — Infra & backend skeleton · Auth · Matching engine & Browse · Interactions · Chat
- **👾 Weirdo** — Frontend skeleton · Profile · Views/Likes lists · Search · Notifications · Seed
- **🤝 Shared** — Types contract, cross-browser QA, security audit, integration, defense prep

> ⚠️ Both members are graded individually at the defense and must understand
> **the whole project**. Vertical ownership guarantees everyone touches the
> full stack — still pair-review every PR.

**Status legend:** ⬜ todo · 🔵 in progress · ✅ done

---

## Phase 0 — Foundations 🏗️

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T1  | Root scaffolding: `.env.example`, `.gitignore`, `README`, Docker Compose (one container per service: Neo4j + backend + frontend + Mailpit) | 🕷️ Spyder | ✅ |
| T2  | Backend skeleton: Flask app factory, config, Neo4j driver + constraints/indexes, error handlers | 🕷️ Spyder | ✅ |
| T3  | Frontend skeleton: Vite + React + TS + Tailwind, router, layout (header/main/footer), API client | 👾 Weirdo | ✅ |
| T4  | Shared types contract: JSON shapes for User/Profile/Tag/Message/Notification (`api/types.ts`) | 🤝 Shared | ✅ |

**Milestone M0 ✅** — backend serves `/api/health`, frontend renders layout, both connected to Neo4j. *(Full stack runs in Docker: neo4j + backend :5001 + frontend :5173 + mailpit.)*

---

## Phase 1 — Auth 🔐 *(Spyder, end-to-end)*

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T5  | Auth API: register (email/username/names/strong password + dictionary-word rejection), bcrypt, email verification link (itsdangerous token via Mailpit), login/logout (httpOnly session), password reset | 🕷️ Spyder | ✅ |
| T6  | Auth pages: Register / Login / Forgot / Reset / Verify-email landing, `useAuth` hook + protected routes | 🕷️ Spyder | ✅ |

**Milestone M1 ✅:** full register → verify → login → logout → reset flow works end-to-end.

---

## Phase 2 — User Profile 👤 *(Weirdo, end-to-end)*

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T7  | Profile API: gender, sexual preferences (default bisexual), bio, reusable tags, up to 5 pictures (1 profile pic, validated upload), GPS location + manual fallback + update, edit email/names, fame-rating computation | 👾 Weirdo | ⬜ |
| T8  | Profile pages: profile completion wizard + edit form, TagInput with autocomplete, picture gallery upload (set profile pic, delete), location consent + manual entry | 👾 Weirdo | ⬜ |
| T9  | "Who viewed me" + "who liked me" API endpoints | 👾 Weirdo | ⬜ |
| T10 | "Who viewed me" + "who liked me" lists in UI | 👾 Weirdo | ⬜ |

**Milestone M2:** a user can complete & edit a full profile with pictures, tags and location.

---

## Phase 3 — Browsing & Search 🔍 *(split: Spyder = suggestions, Weirdo = search)*

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T11 | Matching engine (Cypher): orientation-aware suggestions (hetero/bi rules), weighted by proximity + common tags + fame rating; sort & filter by age/location/fame/tags; exclude blocked users | 🕷️ Spyder | ⬜ |
| T12 | Browse page: suggestion cards grid + sort bar + filter panel | 🕷️ Spyder | ⬜ |
| T13 | Advanced search API: age range, fame range, location, one/multiple tags; sortable & filterable | 👾 Weirdo | ⬜ |
| T14 | Search page: criteria form + results grid with sort/filter | 👾 Weirdo | ⬜ |

**Milestone M3:** users discover each other via suggestions and advanced search.

---

## Phase 4 — Interactions 💘 *(Spyder, end-to-end)*

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T15 | Interactions API: like/unlike (requires own profile pic; mutual like = connected), block (hides everywhere + kills chat), report fake account, visit history recording, online status + last connection, fame rating exposure | 🕷️ Spyder | ⬜ |
| T16 | Profile detail page: picture gallery, all public info (no email), fame rating, online/last-seen, like/unlike + "liked you"/"connected" indicators, block & report actions | 🕷️ Spyder | ⬜ |

**Milestone M4:** likes create connections; block/report/visits all behave per subject.

---

## Phase 5 — Real-time: Chat & Notifications ⚡ *(split: Spyder = chat, Weirdo = notifications)*

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T17 | Chat backend: Socket.IO rooms, message persistence in Neo4j, history endpoint, connection gating (only connected users, un-like/block disables chat) | 🕷️ Spyder | ⬜ |
| T18 | Chat UI: conversations list + live message window, "new message" indicator visible from any page | 🕷️ Spyder | ⬜ |
| T19 | Notifications backend: real-time events for like / profile view / message / mutual like / unlike, unread count + mark-read endpoints | 👾 Weirdo | ⬜ |
| T20 | Notifications UI: bell + dropdown, unread badge on every page, toast on new event | 👾 Weirdo | ⬜ |

**Milestone M5:** real-time chat & notifications ≤ 10s delay. **Mandatory part feature-complete.**

---

## Phase 6 — Ship It 🚢

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| T21 | Seed script: ≥ 500 distinct realistic profiles (Faker): varied genders/orientations/tags/locations/pictures/fame | 👾 Weirdo | ⬜ |
| T22 | Mobile responsiveness + Firefox/Chrome cross-browser QA (each owner QAs their own pages first, then swap) | 🤝 Shared | ⬜ |
| T23 | Security audit: Cypher injection, XSS, uploads, plain-text passwords, dictionary passwords, unhandled errors, endpoint auth sweep | 🤝 Shared | ⬜ |
| T24 | Integration testing of every subject requirement + defense prep (both can explain all code) | 🤝 Shared | ⬜ |

**Milestone M6:** mandatory part **perfect** — ready for evaluation.

---

## Phase 7 — Bonuses ⭐ *(only after M6 is flawless)*

| ID  | Task | Owner | Status |
| --- | ---- | ----- | ------ |
| B1  | Interactive map of users (precise JS geolocation + nearby-users API) | 🕷️ Spyder | ⬜ |
| B2  | Photo gallery: drag-and-drop upload + basic editing (crop/rotate/filters) | 👾 Weirdo | ⬜ |
| B3  | OmniAuth strategy (e.g. Google/42 OAuth) | 👾 Weirdo | ⬜ |
| B4  | Video/audio chat for connected users (WebRTC) | 🤝 Shared | ⬜ |
| B5  | Schedule real-life dates/events for matched users | 🤝 Shared | ⬜ |

---

## Task balance

| Owner | Exclusive tasks | Shared tasks |
| ----- | --------------- | ------------ |
| 🕷️ Spyder | T1, T2, T5, T6, T11, T12, T15, T16, T17, T18 (**10**) | T4, T22, T23, T24 |
| 👾 Weirdo | T3, T7, T8, T9, T10, T13, T14, T19, T20, T21 (**10**) | T4, T22, T23, T24 |

### Stack coverage check — both work end-to-end

| Skill area | 🕷️ Spyder | 👾 Weirdo |
| ---------- | --------- | --------- |
| Cypher / Neo4j | T2, T11, T15, T17 | T7, T9, T13, T21 |
| Flask API | T5, T11, T15, T17 | T7, T9, T13, T19 |
| React / TS UI | T6, T12, T16, T18 | T3, T8, T10, T14, T20 |
| Matching / ranking logic | T11 (suggestions), T15 (fame exposure) | T7 (fame rating), T13 (search) |
| WebSockets | T17 server + T18 client | T19 server + T20 client |

Workload is balanced; if one finishes early, pick from the shared column or
pair on the other's current task (especially T11 matching engine, T7 profile
API & T17 chat — the hardest). Cross-dependencies (e.g. T11 needs T7's data
model) are intentional: they force PR reviews of each other's code.
