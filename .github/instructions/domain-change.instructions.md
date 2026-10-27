---
description: "Use when the user explicitly changes this app's domain from games to another entity (books, employees, movies, ...). The vanilla JS frontend skeleton and all CRUD/auth logic are frozen; only entity-specific binding points may change, driven by db.json."
---
# Domain Change Guide

Keep the current game domain unchanged unless the user explicitly names a new entity. Do not add a generic multi-domain abstraction.

## Source of truth
The new `db.json` (collection name + record fields) defines the new entity. Use its exact collection name, field names, and value types. Do not invent, rename, merge, or drop fields.

## Core principle: the skeleton is frozen
The frontend is vanilla JS that renders the UI and handles CRUD. This skeleton, plus the server-side CRUD logic, already works. A domain change only swaps the entity at its **binding points**. Everything else is read-only.

### Binding points (the ONLY places you may edit)
1. Identifiers/strings containing the old entity name (`game`, `games`, `Game`...): collection name, API paths, route paths, variable names, element IDs/classes tied to the entity, view file/folder names (pure rename only).
2. Field references: field names in payload objects, form inputs, table columns, `row.<field>` accesses, validation rules per field.
3. Display text: titles, labels, placeholders, button text, messages, navigation text, README, system prompt wording, sample data.
4. Select/option lists tied to a field (for example category values) derived from `db.json`.

### Adding or removing a field
Allowed only by **copying the existing pattern**: one more table column, one more form input, one more validation line, one more payload key, written in the same style as its neighbors. If the new field type has no existing pattern in the skeleton (for example a date picker, file upload, or multi-select where only text/number/select exist), STOP and ask the user instead of designing a new mechanism.

### Frozen (never change, even if the result would be "better")
- Frontend skeleton: render functions' structure, DOM-building approach (template strings vs `createElement`), event binding and delegation, fetch/axios call structure, async pattern, state handling, refetch-after-mutation flow, confirm/alert flow, redirect flow, pagination/search/sort if present.
- Function names that are not entity-specific, signatures, parameter order, return shapes, control flow, file layout, formatting, comments, naming style.
- Server-side CRUD logic, routing structure, middleware order, error handling, status codes, response shapes.
- Dependencies, configs, scripts, build setup. No upgrades, no additions.
- Authentication: `users` schema and data, auth service, login/register endpoints, token format/storage (localStorage), `requireAuth`, logout, authorization interceptor/headers. `auth-ui.js` may change only protected-page path checks or post-login redirects when a page path was actually renamed.

No refactor, cleanup, dedup, reorder, modernization, or optimization of existing code. If you see a bug or an improvement opportunity, do NOT fix it: report it in the final reply.

## Per-file scope
- `db.json`: rename the domain collection and provide coherent sample records. Keep `users` unchanged.
- `routes.json`: change only rewrite entries referencing the old collection.
- `services/crud.js`: change collection URLs and field names only.
- `routes/index.js`: change page/API paths, per-field validation, and messages only.
- `views/games/` and frontend JS: apply binding-point edits only; keep markup structure and scripts intact.
- `services/ai.js`: change tool names, declarations, parameter names/descriptions, system prompt wording, and entity/category context only; keep the tool-calling flow aligned with the CRUD service; leave no old game or todo tools behind.
- `README.md`: describe the new entity and API.

## Verification
1. Search the workspace for old entity terms and stale routes; none may remain outside git history.
2. Review the full diff. Every changed line must fall under a binding point. Revert anything else.
3. Confirm `db.json` fields, route rewrites, API payloads, form inputs, table columns, validation, and AI tool parameters all use the same field names.
4. Confirm the authentication flow is byte-for-byte unchanged apart from permitted path updates.
5. Run available syntax checks and focused tests; do not claim an external AI call was tested unless it was actually run.
6. Final reply: list changed files, plus any bugs or improvements noticed but intentionally left untouched.