# MysteryOS Database Schema Documentation

## Overview
MysteryOS utilizes a normalized relational schema designed for strict session isolation, forensic data integrity, and deterministic scoring.

### Entity Relationship Model

#### 1. `users`
* `id` (VARCHAR(64), Primary Key)
* `username` (VARCHAR(80), Unique, Indexed)
* `email` (VARCHAR(120), Unique, Indexed)
* `password_hash` (VARCHAR(256))
* `rank` (VARCHAR(32), e.g., 'Trainee', 'Investigator', 'Detective', 'Master Detective')
* `experience_points` (INTEGER, Default: 100)
* `cases_completed` (INTEGER, Default: 0)
* `cases_attempted` (INTEGER, Default: 0)
* `total_evidence_discovered` (INTEGER, Default: 0)
* `average_score` (FLOAT, Default: 0.0)
* `created_at` (TIMESTAMP)

#### 2. `cases`
* `id` (VARCHAR(64), Primary Key)
* `title` (VARCHAR(150))
* `tagline` (VARCHAR(255))
* `crime_category` (VARCHAR(50))
* `difficulty` (VARCHAR(30))
* `estimated_minutes` (INTEGER)
* `location` (VARCHAR(150))
* `setting` (TEXT)
* `cover_image` (VARCHAR(500))
* `description` (TEXT)
* `incident_time` (VARCHAR(50))
* `is_official` (BOOLEAN)
* `author_name` (VARCHAR(80))
* `culprit_id` (VARCHAR(64)) — *Server-only restriction*
* `culprit_name` (VARCHAR(100)) — *Server-only restriction*
* `verified_motive` (TEXT) — *Server-only restriction*
* `verified_method` (TEXT) — *Server-only restriction*
* `solution_narrative` (TEXT) — *Server-only restriction*

#### 3. `locations` & `scene_objects`
* `locations`: `id`, `case_id`, `name`, `description`, `room_type`, `ambient_image`
* `scene_objects`: `id`, `location_id`, `name`, `x_percent`, `y_percent`, `reveals_clue_id`, `requires_clue_id`, `inspect_message`, `locked_message`

#### 4. `clues`
* `id` (VARCHAR(64), Primary Key)
* `case_id` (VARCHAR(64), Foreign Key)
* `name` (VARCHAR(120))
* `description` (TEXT)
* `evidence_type` ('physical', 'document', 'digital', 'statement', 'timeline', 'environmental', 'financial')
* `location_id` (VARCHAR(64))
* `location_name` (VARCHAR(100))
* `reliability` ('verified_fact', 'rumor', 'unverified_claim')
* `significance` ('crucial', 'supporting', 'circumstantial', 'red_herring')
* `tags` (JSON)
* `details` (TEXT)

#### 5. `suspects`
* `id` (VARCHAR(64), Primary Key)
* `case_id` (VARCHAR(64), Foreign Key)
* `name` (VARCHAR(100))
* `role` (VARCHAR(100))
* `age` (INTEGER)
* `avatar` (VARCHAR(500))
* `bio` (TEXT)
* `personality` (VARCHAR(150))
* `temperament` ('composed', 'defensive', 'nervous', 'arrogant')
* `alibi` (TEXT)
* `initial_statement` (TEXT)
* `known_facts` (JSON)
* `hidden_facts` (JSON)
* `authorized_disclosures` (JSON)

#### 6. `contradictions`
* `id` (VARCHAR(64), Primary Key)
* `case_id` (VARCHAR(64), Foreign Key)
* `title` (VARCHAR(150))
* `suspect_id` (VARCHAR(64))
* `claimed_statement` (TEXT)
* `contradicting_clue_id` (VARCHAR(64))
* `explanation` (TEXT)
* `suggested_follow_up` (TEXT)

#### 7. `investigation_sessions`
* `id` (VARCHAR(64), Primary Key)
* `user_id` (VARCHAR(64), Foreign Key)
* `case_id` (VARCHAR(64), Foreign Key)
* `started_at` (TIMESTAMP)
* `last_active_at` (TIMESTAMP)
* `is_completed` (BOOLEAN)
* `discovered_clue_ids` (JSON)
* `explored_location_ids` (JSON)
* `inspected_object_ids` (JSON)
* `unlocked_hints` (JSON)
