# Zoom Clone

A modern meeting management platform inspired by Zoom, built with a Next.js frontend and a FastAPI backend. Create instant meetings, schedule future ones, and join with a meeting code or invite link — all through a clean, responsive interface.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.11-009688?logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## Overview

Zoom Clone is a full-stack meeting management application that replicates the core workflows of a modern video conferencing platform — without the video. The project's focus is on solid frontend-backend integration through a REST API: creating meetings, scheduling them, joining with a code or link, and managing the resulting data through a well-structured relational schema.

The frontend is built with Next.js 16's App Router and TypeScript, styled with Tailwind CSS v4, and organized around a small set of reusable, single-responsibility components. The backend is a FastAPI service backed by SQLAlchemy ORM models and a SQLite database, with Pydantic handling request and response validation throughout.

The application assumes a single default user with no authentication layer, in line with the project's scope, which prioritizes meeting workflows and data modeling over identity management. Every meeting and participant created through the UI is persisted and retrievable through the API, and the same endpoints power both the seeded sample data and anything created interactively.

---

## Features

### Frontend

- Dashboard with quick-access actions for New Meeting, Join Meeting, and Schedule Meeting
- Instant meeting creation with automatic redirect to the meeting room
- Meeting scheduling with title, description, date and time, and duration
- Join meeting flow accepting either a bare meeting code or a full invite link
- Meeting room view displaying meeting details, invite link, and copy actions
- Upcoming and recent meetings lists on the dashboard
- Copy-to-clipboard for both meeting code and invite link, with fallback error handling
- Sticky sidebar and navbar navigation, both responsive across breakpoints
- Reusable loading and empty-state components shared across all data views
- Form validation with inline error messaging on both the join and schedule pages
- Fully responsive layout tested across mobile, tablet, and desktop widths

### Backend

- RESTful API built with FastAPI
- SQLAlchemy ORM models for meetings and participants
- SQLite database with a relational schema and foreign key constraints
- Unique, collision-checked meeting code generation
- Case-insensitive meeting code lookups for both retrieval and join operations
- Pydantic schemas for strict request and response validation
- Participant records created on every successful join
- Seed script for populating sample meetings on first run
- Automatic interactive API documentation via Swagger UI

---

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | Next.js 16 (App Router), TypeScript |
| Styling    | Tailwind CSS v4                     |
| Icons      | Lucide React                        |
| Backend    | FastAPI                             |
| ORM        | SQLAlchemy                          |
| Validation | Pydantic                            |
| Database   | SQLite                              |
| Server     | Uvicorn                             |

---

## Architecture

The application follows a standard client-server architecture with a clear separation between presentation, API, and persistence layers.- The **frontend** is a client-rendered Next.js application. Each page (Dashboard, Schedule, Join, Meeting Room) manages its own local state with `useState` and `useEffect`, and communicates with the backend exclusively through a small set of typed helper functions in `lib/api.ts`.
- The **backend** exposes a versionless REST API under the `/meetings` prefix. Each route validates its input through a Pydantic schema, performs a database operation through SQLAlchemy, and returns a serialized response model.
- The **database** is a single SQLite file with two related tables — `meetings` and `participants` — connected through a foreign key, allowing each meeting to track the participants who have joined it.

No client-side state management library is used; all shared state is fetched fresh from the API on each page load, keeping the data flow simple and predictable.

---

## Folder StructureZoomClone/
backend/
main.py
database.py
models.py
schemas.py
seed.py
init.py
routers/
init.py
meeting.py
frontend/
app/
layout.tsx
globals.css
page.tsx
schedule/
page.tsx
join/
page.tsx
meeting/
[code]/
page.tsx
components/
  Navbar.tsx
  Sidebar.tsx
  ActionCard.tsx
  MeetingList.tsx
  EmptyState.tsx
  LoadingSpinner.tsx

lib/
  api.ts
  config.ts

types.ts
zoom_clone.db

---

## Installation Guide

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm

### Backend Setup

```bash
git clone https://github.com/roshangowda275/zoom-clone.git
cd zoom-clone

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn backend.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with interactive documentation at `http://127.0.0.1:8000/docs`.

> The server must be started from the project root using `backend.main:app`, since the backend package uses relative imports internally.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

Both the backend and frontend servers must be running simultaneously for the application to function.

---

## API Endpoints

| Method | Endpoint                        | Description                                      |
|--------|----------------------------------|---------------------------------------------------|
| POST   | `/meetings/instant`             | Creates an instant meeting and returns its details |
| POST   | `/meetings/schedule`            | Creates a scheduled meeting with title, description, time, and duration |
| GET    | `/meetings/upcoming`            | Returns all meetings scheduled in the future       |
| GET    | `/meetings/recent`              | Returns instant and past meetings, most recent first |
| GET    | `/meetings/{meeting_code}`      | Retrieves a single meeting by its code             |
| POST   | `/meetings/join/{meeting_code}` | Joins a meeting by code, creating a participant record |

Full request and response schemas are available through the Swagger UI at `/docs` once the backend is running.

---

## Application Workflow

1. **Dashboard** — The user lands on the dashboard, which fetches and displays upcoming and recent meetings from the backend on load.
2. **Starting a meeting** — Clicking New Meeting navigates to a dedicated page that creates an instant meeting and redirects to its room.
3. **Scheduling a meeting** — Clicking Schedule Meeting opens a form for title, description, date and time, and duration. On submission, the meeting is persisted and the user is redirected to its meeting room; the meeting also becomes visible in the dashboard's Upcoming Meetings list.
4. **Joining a meeting** — Clicking Join Meeting opens a form requesting a display name and either a meeting code or a full invite link. The backend validates that the meeting exists before creating a participant record and redirecting to the meeting room.
5. **Meeting Room** — The final destination for all three flows. It displays the meeting's title, code, invite link, creation time, and, where applicable, scheduled time and duration, along with copy actions for the code and link, and a Leave Meeting action that shows a Meeting Ended screen.

---

## Screenshots

Add screenshots to a /screenshots directory and update the paths below.

**Dashboard**

`screenshots/dashboard.png`

**Schedule Meeting**

`screenshots/schedule-meeting.png`

**Join Meeting**

`screenshots/join-meeting.png`

**Meeting Room**

`screenshots/meeting-room.png`

---

## Assumptions

- No authentication is implemented; the application assumes a single default user, per the project's stated scope.
- Meeting codes are treated as case-insensitive on both lookup and join, so a code can be typed or pasted in any case.
- The join flow accepts a bare meeting code or a full invite link containing `/meeting/{code}`, extracting the code from either format.
- No real-time video, audio, or screen sharing is implemented; the project focuses on the meeting lifecycle and data model rather than media transport.
- A meeting's "recent" status is derived from either having no scheduled time (an instant meeting) or a scheduled time in the past, ordered by creation date.
- The backend automatically re-seeds sample data on every startup if the database is empty, so the deployed instance always has data even after a filesystem reset.

---

## Future Enhancements

- Real-time video calling and audio using WebRTC
- Screen sharing during active meetings
- User authentication and persistent accounts
- In-meeting chat
- Email or push notifications for upcoming meetings
- Participant management, including host controls such as mute and remove
- Meeting recording and playback
- Calendar integration for scheduled meetings

---

## Learning Outcomes

Building this project reinforced the value of designing a clean, relational database schema before writing any endpoint logic, since the meeting-participant relationship shaped nearly every API decision that followed. Working with Next.js's App Router alongside a separate FastAPI backend clarified how to structure client-side data fetching without a global state library, relying instead on component-local state and a small set of typed API helpers. It also highlighted the importance of consistent data normalization across the stack, since a single case-sensitivity mismatch between how meeting codes were generated and how they were looked up was enough to break the join flow entirely.

---

## Author

**Name:** Your Name
**GitHub:** [github.com/roshangowda275](https://github.com/roshangowda275)
**LinkedIn:** [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

## License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions.

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
