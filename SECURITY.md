# MysteryOS Security Architecture & Data Isolation

## 1. Solution Masking & Truth Preservation
* Case solutions (`culprit_id`, `verified_motive`, `verified_method`, `solution_narrative`) are strictly quarantined on the server side.
* Case fetching endpoints (`/api/cases`, `/api/cases/:id`) programmatically sanitize case objects prior to serialization. Active players never receive the culprit or hidden facts in browser payloads.

## 2. Server-Controlled AI Fact Boundary
* Natural-language interrogation models are given explicit system instructions with strict fact boundaries (`known_facts`, `hidden_facts`, `authorized_disclosures`).
* The LLM is prohibited from inventing new clues, altering timestamps, or claiming evidence exists before the player discovers it.
* Player input is treated as untrusted; attempts to override system prompts or coerce early confessions are handled via character-appropriate deflections.

## 3. Session Isolation & Access Control
* Investigation sessions, personal notes, board configurations, and accusations are strictly scoped to the authenticated `user_id`.
* Attempts to inspect or modify another user's session ID are rejected with `403 Forbidden` / `404 Not Found`.

## 4. API Key Protection
* LLM API keys (`GEMINI_API_KEY`) reside exclusively in server-side environment variables and are never bundled, transmitted, or accessible by client code.
