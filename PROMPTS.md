# AI Prompt History

## — Project Setup

**Prompt:** "which language is best for node:test in backend TDD node with js or node with ts"
**Response summary:** Recommended TypeScript for type safety on typed
API contracts (Vehicle, User, JWT payload), noted node:test works fine
with TS via tsx.

---

**Prompt:** "what is repository/service split is this required in TDD"
**Response summary:** No, the Repository/Service split is not strictly required for Test-Driven Development (TDD). You can write tests and practice TDD perfectly fine without it. When you separate the layers, you can test your business logic in isolation. You don't need to connect to a real database, clear tables, or handle migrations during your tests. you should use the Service layer, but you should skip the Repository layer.

---