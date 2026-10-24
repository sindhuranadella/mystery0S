# MysteryOS REST API Documentation

## Authentication Endpoints
* `POST /api/auth/register`: Register new investigator account.
* `POST /api/auth/login`: Authenticate and receive session token.
* `GET /api/auth/me`: Fetch authenticated investigator profile.
* `POST /api/auth/profile`: Update callsign / username.

## Case Archives
* `GET /api/cases`: Fetch case library. Supports filters: `?difficulty=...&category=...&search=...`. Excludes sensitive solutions.
* `GET /api/cases/:id`: Detailed case briefing without solution.

## Investigation Sessions
* `POST /api/sessions/start`: Initialize or resume an investigation session for the given `caseId`.
* `GET /api/sessions/:sessionId`: Retrieve current session state.
* `POST /api/sessions/:sessionId/inspect`: Inspect interactive scene hotspot (`locationId`, `objectId`). Unlocks clues and checks prerequisites.
* `POST /api/sessions/:sessionId/explore`: Mark room as explored.
* `POST /api/sessions/:sessionId/interrogate`: Conduct natural language interrogation (`suspectId`, `question`). Evaluates contradictions and preserves character knowledge boundaries.
* `POST /api/sessions/:sessionId/notes`: Add personal note.
* `PUT /api/sessions/:sessionId/notes/:noteId`: Update personal note.
* `DELETE /api/sessions/:sessionId/notes/:noteId`: Remove personal note.
* `POST /api/sessions/:sessionId/evidence-links`: Pin red string link between nodes on evidence board.
* `DELETE /api/sessions/:sessionId/evidence-links/:linkId`: Cut evidence link.
* `POST /api/sessions/:sessionId/board-positions`: Save draggable node canvas positions.
* `POST /api/sessions/:sessionId/timeline`: Save reconstructed timeline event ordering.
* `POST /api/sessions/:sessionId/hypothesis`: Save working deductive theory.
* `POST /api/sessions/:sessionId/hints`: Unlock progressive hint tier (records point penalty).
* `POST /api/sessions/:sessionId/accuse`: Submit formal indictment. Deterministically evaluates against 100-pt scoring model, computes XP, unlocks achievements, and returns verified educational narrative.

## Creator Studio
* `POST /api/creator/generate`: AI-assisted mystery drafting with Gemini.
* `POST /api/creator/validate`: Deterministic dependency and prerequisite validator.
* `POST /api/creator/cases`: Publish validated custom mystery.
