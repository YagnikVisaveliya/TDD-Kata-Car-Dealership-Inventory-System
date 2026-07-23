# AI Prompt History

## Session 1 — Project Setup

**Prompt:** "which language is best for node:test in backend TDD node with js or node with ts"
**Response summary:** Recommended TypeScript for type safety on typed
API contracts (Vehicle, User, JWT payload), noted node:test works fine
with TS via tsx.

---

**Prompt:** "which database is best Postgres or MongoDb"
**Response Summary:** Compared Postgres vs MongoDB for a relational inventory
system. Chose PostgreSQL for transactional integrity (atomic quantity
decrements on purchase), relational structure (Users, Vehicles), and
range-query support for price filtering.

---

**Prompt:** "what is repository/service split is this required in TDD"
**Response summary:** No, the Repository/Service split is not strictly required for Test-Driven Development (TDD). You can write tests and practice TDD perfectly fine without it. When you separate the layers, you can test your business logic in isolation. You don't need to connect to a real database, clear tables, or handle migrations during your tests. you should use the Service layer, but you should skip the Repository layer.

---

## Session 2 — Database Schema

**Prompt:** "is that require of purchase because not mentioned show user which is purchase vehicle"
**Summary:** Reconsidered whether a Purchase model was needed beyond
the literal spec requirement ("purchase a vehicle, decreasing its
quantity"). Decided to keep the schema minimal — User and Vehicle only —
matching exactly what the spec.

---

## Session 3 - TDD Workflow

**Prompt:** "i do with direct controller and then middleware and routes"
**Summary:** Decided to simplify the architecture to Controller + Service
(later simplified further to Controller-only) rather than a full
Controller/Service/Repository split, after discussing trade-offs for a
kata-scoped project and Incubyte's live pairing-round format.

---

**Prompt:** "in this project i think use refresh access token?"
**Summary:** Discussed access/refresh token pattern, decided against it
since the spec only requires "token-based authentication" without
mentioning session refresh — kept a single JWT with 1h expiry to avoid
scope creep, noted the trade-off for the README.

---

**Prompt:** "Give Test file for vehical router which contain all routes like POST ,GET ,PUT ,DELETE Vehicle,purchase Vehicle,Restock Vehicle
**Summary:** Here is the complete, production-ready VehicleService.test.ts file based on your Vehicle schema. It uses the native node:test runner, node:assert/strict, and standard TypeScript type casting to mock the Prisma client.


## Session 4 — Project Setup Client-side
**Prompt:** "help to setup typescript configuration for reactjs"
**Summary:** This TypeScript configuration sets up a safe, high-performance environment for modern React projects by dividing the work between TypeScript and your build tool (like Vite or Webpack). It tells TypeScript to act strictly as a code guard—verifying browser features, automatically recognizing React components without needing manual imports, and enforcing strict type safety to catch bugs early—while completely turning off code generation so your bundler can handle the actual building process faster.

The user interface must be built to support or easily toggle between the following distinct, production-level aesthetic palettes:

### Option A: Minimalist Light Creative Theme (Zinc + Amber)
A clean, editorial-style tech workspace aesthetic that eliminates default blues and standard grays.
* **Canvas Background**: Crisp `bg-zinc-50` base.
* **Card & Module Surfaces**: Solid `bg-white` with clean, low-contrast borders (`border-zinc-200/80`).
* **Primary Typography**: Deep, high-contrast black text (`text-zinc-950`).
* **Visual Anchor Accents**: Energetic neon amber (`bg-amber-500`) used for structural lines, badges, and focus indicators.
* **Destructive Actions**: Soft rose blocks (`bg-rose-50`) paired with sharp crimson text (`text-rose-700`) for clear warnings.

### Option B: Cyberpunk Cyber-Grid Theme (Slate + Cyan + Violet)
An immersive, high-contrast dark synth-wave look optimized for an advanced telemetry terminal aesthetic.
* **Canvas Background**: Deep dark `bg-slate-950`.
* **Card & Module Surfaces**: Semi-transparent dark plates (`bg-slate-900/40`) backed by a crisp `backdrop-blur-md`.
* **Atmospheric Lighting**: Radial ambient glowing nodes (`bg-violet-600/10` and `bg-cyan-600/10`) heavily blurred underneath main container components.
* **Primary Elements & Accents**: Electric cyan (`text-cyan-400`) and neon violet (`bg-gradient-to-r from-violet-600 to-indigo-600`) for active states, headers, and action inputs.
* **System Borders**: Thin, industrial outline dividers using `border-slate-800/80`.

## Session 5 — Prompt used in updatetion of UI

**Prompt** "currently i have this design most of the student have same design so now i want to diff in this somethid serch in left part and right part show all cars and in search if i put single char then not search put whole name then show also i need somthing like some search in Make BMW then autometically in MODEL filter show dropdown of that make models"

**Prompt** "when too many vehicle that time not perfect i need to stable serch in whole right side and in vehicle card i need to update Restock button when click on button that time show input feild every category show diff color in category text if we put pic for every category then?"

**Prompt** "if we use picture of car or use icon type picture and not too light and dark color and last own is not also good / simthing different if we put in image company logo"
