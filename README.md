# Fleet Workspace — Car Dealership Inventory System

A full-stack inventory management system for a car dealership, built for the **Incubyte TDD Kata**. Admins can add, update, restock, and remove vehicles, while customers can browse, search, and purchase from live inventory.

Built test-first throughout, following the **Red → Green → Refactor** workflow across both the backend and frontend.

---

## Tech Stack

### Backend

* Node.js + TypeScript + Express
* PostgreSQL + Prisma ORM (v7, driver adapters)
* JWT-based authentication (bcrypt password hashing)
* `node:test` (built-in test runner) with the `mock` module

### Frontend

* React + TypeScript + Vite
* Tailwind CSS
* React Router
* Axios (request/response interceptors for authentication)
* Vitest + React Testing Library

---

## Features

* User registration & login (JWT authentication)
* Role-based access control (Admin & Customer)
* Browse vehicles with pagination
* Search/filter by make, model, category, and price range
* Purchase flow with atomic stock decrement using Prisma's `decrement` operator
* Admin-only vehicle management (add, edit, delete, restock)
* Consistent JSON API response format:

  ```json
  {
    "success": true,
    "message": "...",
    "data": {}
  }
  ```
* Responsive UI

---

## Screenshots

### Login

<p align="center">
  <img src="https://github.com/user-attachments/assets/7fcd6bce-0a01-45cf-862d-8d3bf4009b06" alt="Login Page" width="900">
</p>

---

### Dashboard

<p align="center">
  <img src="https://github.com/user-attachments/assets/fbedb6f1-77b8-4ac2-8286-7f192cb41e73" alt="Dashboard" width="900">
</p>

---

## Project Structure

```text
Fleet-Workspace/
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   ├── generated/
│   └── tests/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── types/
│   └── test/
│
├── PROMPTS.md
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL running locally or a hosted connection string
- npm

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see `.env.example`):

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db_name>"
JWT_SECRET="<your-secret-key>"
PORT=5000
```

Run migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### Creating an admin user

There's no public "become admin" endpoint (by design — this should never
be self-service). To test admin-only features locally:

```bash
npx prisma studio
```

Register a normal user via `POST /api/auth/register`, then open Prisma
Studio and change that user's `role` field from `CUSTOMER` to `ADMIN`
directly in the `users` table. Log in again to receive a token with
the updated role.

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL="http://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Run tests

Backend:
```bash
cd server
npm test
```

Frontend:
```bash
cd client
npx vitest run --coverage
```
---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/vehicles?page=&limit=` | Protected | List vehicles, paginated |
| GET | `/api/vehicles/search?make=&model=&category=&minPrice=&maxPrice=` | Protected | Search/filter vehicles |
| POST | `/api/vehicles` | Protected | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Protected | Update a vehicle (partial update supported) |
| DELETE | `/api/vehicles/:id` | Protected (Admin) | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Protected | Purchase a vehicle (atomic quantity decrement) |
| POST | `/api/vehicles/:id/restock` | Protected (Admin) | Restock a vehicle (atomic quantity increment) |

All responses follow a consistent shape:
```json
{ "success": true, "message": "...", "data": { ... } }
```

---

## Test Report

<p align="center">
  <img src="https://github.com/user-attachments/assets/51da6ca0-fb23-4b06-ae79-09ae184cff07" alt="Coverage Report" width="900">
</p>

---

## My AI Usage

**Tools Used**

* Claude (Anthropic) — used throughout both backend and
frontend development, in two separate working sessions.
* Antigravity — used to improve the frontend UI, refine layouts, color palette, typography, spacing, responsiveness, and overall user experience.

### Backend

- Discussed and chose the tech stack (TypeScript over JavaScript for
  compile-time safety on typed contracts; PostgreSQL over MongoDB for
  transactional integrity on stock decrements).
- Followed a strict TDD workflow throughout: for every controller,
  middleware, and route, I asked for a failing test first (Red), ran it
  myself to confirm the failure, then requested the minimal
  implementation (Green), then refactored where it improved clarity.
- Made deliberate scope decisions with AI as a sounding board, not a
  decision-maker: chose Controller-only architecture (no service/
  repository split) and skipped a `Purchase` transaction-history model
  and an access/refresh-token pair, since neither was required by the
  spec — both are documented trade-offs I can expand on if asked.
- Used AI to help debug a real bug I found through my own testing: a
  JWT payload mismatch (`userId` vs the `id`/`role` shape my middleware
  expected) that silently broke admin-only routes. This surfaced
  through my own integration tests, not through AI review, which
  reinforced why integration tests matter alongside unit tests.
- Used `node:test`'s built-in `mock` module (rather than a separate
  mocking library) to keep unit tests fast and dependency-free, with
  AI helping me learn its API.
- Used AI to design and implement pagination consistently across list
  and search endpoints, and to add a global JSON error/404 handler so
  every API response — success or failure — follows the same shape.

### Frontend

- Used Claude to design the frontend architecture so the codebase
  stayed testable and followed single-responsibility principles.
- Used a strict TDD workflow: for each component, context, and API
  module, wrote the test first (Red), implemented to pass it (Green),
  then discussed refactors.
- Used AI to debug integration mismatches between frontend assumptions
  and the real backend response shapes — e.g., aligning the frontend's
  `unwrapData` helper with the backend's `createResponse(success,
  message, data)` envelope, and fixing a `purchaseVehicle` call missing
  a required `quantity` field.
- Used AI to design a custom visual identity (color palette, typography,
  a stock-status indicator) instead of shipping default Tailwind
  component styling.
- Used AI to generate seed data and a Prisma seed script for local
  development/testing.
- Used AI to draft this README and structure the required
  documentation.

* Used **Antigravity** to improve the frontend UI, refine layouts, color palette, typography, spacing, responsiveness, and overall user experience.

### Reflection

AI accelerated the repetitive parts of TDD — writing thorough test
cases with proper mocking, covering edge cases I might have skipped —
while I stayed responsible for reviewing each test's logic, running
every test myself to confirm Red before accepting an implementation,
and verifying generated code actually matched my real backend
contracts. The most valuable moments were when I fed back real error
output and my actual controller code rather than accepting generic
assumptions — that's specifically how the JWT bug and the pagination
test's hidden assertion issue were caught and fixed correctly, rather
than papered over.

---

## PROMPTS.md

See [`PROMPTS.md`](./PROMPTS.md) for the complete AI conversation history used during development.

---

## License

Built for the Incubyte Recruitment TDD Kata.
