# Fleet Workspace — Car Dealership Inventory System

A full-stack inventory management system for a car dealership, built as part of the Incubyte TDD Kata. Admins can add, update, restock, and remove vehicles; customers can browse, search, and purchase from live inventory. Built test-first, with a clear Red-Green-Refactor commit history.

## Tech Stack

**Backend**
- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- JWT-based authentication
- `node:test` for backend unit/integration tests

**Frontend**
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Axios (with request/response interceptors for auth)
- Vitest + React Testing Library

## Features

- User registration & login (JWT auth, token stored client-side, auto-logout on expiry/401)
- Role-based access control (Admin vs Customer)
- Browse all vehicles with live stock status
- Search/filter vehicles by make, model, category, and price range (debounced)
- Purchase flow — disabled automatically when a vehicle is out of stock
- Admin-only: add, edit, delete, and restock vehicles
- Responsive, custom-designed UI (not default Tailwind styling)

## Screenshots

> Add your screenshots to a `screenshots/` folder in the project root and reference them below.

| Login | Dashboard |
|---|---|
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) |

| Search & Filter | Admin Controls |
|---|---|
| ![Search](./screenshots/search.png) | ![Admin](./screenshots/admin-controls.png) |

## Project Structure

```
.
├── server/                # Backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── prisma/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── test/
├── client/                 # Frontend SPA
│   ├── src/
│   │   ├── api/            # axios instance + endpoint functions (tested)
│   │   ├── context/         # AuthContext (tested)
│   │   ├── components/      # VehicleCard, SearchBar, VehicleForm, ProtectedRoute (tested)
│   │   ├── pages/            # LoginPage, RegisterPage, DashboardPage
│   │   └── types/
│   └── test/
├── PROMPTS.md
└── README.md
```

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

Create a `.env` file in `server/`:

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

(Optional) Seed the database with sample vehicles:

```bash
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

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

The app will run at `http://localhost:5173`.

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

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/vehicles` | Protected | List all vehicles |
| GET | `/api/vehicles/search` | Protected | Search/filter vehicles |
| POST | `/api/vehicles` | Protected (Admin) | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Protected (Admin) | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Protected (Admin) | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Protected | Purchase a vehicle (decreases quantity) |
| POST | `/api/vehicles/:id/restock` | Protected (Admin) | Restock a vehicle (increases quantity) |

## Test Report

> Paste your latest test run output here once available.

```
Backend:
<paste node:test output>

Frontend:
<paste vitest --coverage output>
```

## My AI Usage

**Tools used:** Claude (Anthropic), used throughout both backend and frontend development.

**How I used it:**
- Used Claude to help design the frontend architecture so the codebase stayed testable and followed single-responsibility principles.
- Used Claude in a strict TDD workflow: for each component, context, and API module, I asked it to write the test first (Red), then implemented the code to pass it (Green), then discussed refactors where needed.
- Used Claude to debug integration issues between frontend assumptions and my actual backend response shapes — for example, aligning the frontend's `unwrapData` helper with my backend's `createResponse(success, message, data)` envelope, and fixing a `purchaseVehicle` call that was missing a required `quantity` field.
- Used Claude to design a custom visual identity (color palette, typography, a stock-status indicator) instead of shipping default Tailwind component styling.
- Used Claude to generate seed data (sample vehicles) and a Prisma seed script for local development/testing.
- Used Claude to draft this README and structure the AI usage documentation required by the kata.

**Reflection:**
AI accelerated the repetitive parts of TDD (writing thorough test cases with proper mocking, covering edge cases I might have skipped) while I stayed responsible for reviewing each test's logic, verifying it matched my actual backend contracts, and catching integration mismatches by testing against my real API. The tightest feedback loop came from being explicit about my actual backend implementation (Prisma schema, controller code, response envelope) rather than letting the AI assume a shape — several bugs were caught early because I fed back real error messages and controller code rather than accepting generic assumptions.

## PROMPTS.md

See [`PROMPTS.md`](./PROMPTS.md) in the project root for the full AI chat history used during development.

## License

Built for the Incubyte recruitment TDD Kata.