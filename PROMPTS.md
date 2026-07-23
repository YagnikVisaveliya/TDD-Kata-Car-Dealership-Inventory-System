# AI Prompt History

## — Project Setup

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

## TDD Workflow

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


## — Project Setup Client-side
**Prompt:** "help to setup typescript configuration for reactjs"
**Summary:** This TypeScript configuration sets up a safe, high-performance environment for modern React projects by dividing the work between TypeScript and your build tool (like Vite or Webpack). It tells TypeScript to act strictly as a code guard—verifying browser features, automatically recognizing React components without needing manual imports, and enforcing strict type safety to catch bugs early—while completely turning off code generation so your bundler can handle the actual building process faster.