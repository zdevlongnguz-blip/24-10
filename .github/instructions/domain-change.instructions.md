---
description: "Use when the user explicitly changes this app's domain from games to a specific topic such as books or students. Guides a coordinated domain conversion while preserving authentication."
---
# Domain Change Guide

Keep the current game domain unchanged unless the user explicitly names a new topic. Do not add a generic multi-domain abstraction preemptively.

When changing domains, use the exact topic and fields provided by the user. Update the domain end to end so names, data shapes, routes, validation, and AI behavior agree:

- `db.json`: rename the domain collection and provide coherent sample records. Keep the `users` collection and its authentication data unchanged.
- `routes.json`: update JSON Server route rewrites to match the new collection.
- `services/crud.js`: update collection URLs and CRUD methods to match the new entity and its fields.
- `routes/index.js`: update page routes, API paths, request validation, and response messages for the new entity.
- `views/games/`: update list/form/AI views, labels, fields, and navigation for the selected topic. Rename view files or folders when it improves clarity, and update every render path.
- `services/ai.js`: update Gemini tool names, declarations, parameters, validation, system prompt, and supplied entity/category context. Keep tool behavior aligned with the CRUD service; never leave old game or todo tools behind.
- `public/js/auth-ui.js`: update protected page path checks and post-login redirects only as needed for renamed pages. Preserve token storage, login/register behavior, authorization headers, and logout behavior.
- `README.md`: update project and API documentation to describe the selected topic.

Authentication is shared infrastructure, not part of the domain conversion. Preserve the existing `users` schema, auth service, login/register endpoints, token format/storage, `requireAuth` behavior, and API-client authorization interceptor. Do not rewrite or remove authentication while changing the catalog domain.

After conversion, search the workspace for old domain terms and stale routes, then verify CRUD payloads, route rewrites, form fields, AI tool parameters, and the authentication flow still agree. Run syntax checks and focused tests available in the project; do not claim an external AI call was tested unless it was actually run.
