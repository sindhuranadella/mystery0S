"""
MysteryOS - Relational SQLAlchemy Database Models
Normalized schema supporting users, cases, locations, objects, clues, suspects,
timeline events, contradictions, investigation sessions, and scoring reports.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(64), primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    rank = db.Column(db.String(32), default='Trainee', nullable=False)
    experience_points = db.Column(db.Integer, default=100, nullable=False)
    cases_completed = db.Column(db.Integer, default=0, nullable=False)
    cases_attempted = db.Column(db.Integer, default=0, nullable=False)
    total_evidence_discovered = db.Column(db.Integer, default=0, nullable=False)
    average_score = db.Column(db.Float, default=0.0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    sessions = db.relationship('InvestigationSession', backref='user', lazy=True, cascade='all, delete-orphan')


class Case(db.Model):
    __tablename__ = 'cases'

    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    tagline = db.Column(db.String(255), nullable=False)
    crime_category = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(30), nullable=False)
    estimated_minutes = db.Column(db.Integer, default=25, nullable=False)
    location = db.Column(db.String(150), nullable=False)
    setting = db.Column(db.Text, nullable=False)
    cover_image = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=False)
    incident_time = db.Column(db.String(50), nullable=False)
    is_official = db.Column(db.Boolean, default=True, nullable=False)
    author_name = db.Column(db.String(80), default='MysteryOS Archives', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Solution data (restricted server-side, never returned to active investigator)
    culprit_id = db.Column(db.String(64), nullable=False)
    culprit_name = db.Column(db.String(100), nullable=False)
    verified_motive = db.Column(db.Text, nullable=False)
    verified_method = db.Column(db.Text, nullable=False)
    solution_narrative = db.Column(db.Text, nullable=False)

    locations = db.relationship('Location', backref='case', lazy=True, cascade='all, delete-orphan')
    clues = db.relationship('Clue', backref='case', lazy=True, cascade='all, delete-orphan')
    suspects = db.relationship('Suspect', backref='case', lazy=True, cascade='all, delete-orphan')
    timeline_events = db.relationship('TimelineEvent', backref='case', lazy=True, cascade='all, delete-orphan')
    contradictions = db.relationship('ContradictionRule', backref='case', lazy=True, cascade='all, delete-orphan')


class Location(db.Model):
    __tablename__ = 'locations'

    id = db.Column(db.String(64), primary_key=True)
    case_id = db.Column(db.String(64), db.ForeignKey('cases.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    room_type = db.Column(db.String(50), default='crime_scene', nullable=False)
    ambient_image = db.Column(db.String(500), nullable=False)

    objects = db.relationship('SceneObject', backref='location', lazy=True, cascade='all, delete-orphan')


class SceneObject(db.Model):
    __tablename__ = 'scene_objects'

    id = db.Column(db.String(64), primary_key=True)
    location_id = db.Column(db.String(64), db.ForeignKey('locations.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    x_percent = db.Column(db.Float, nullable=False)
    y_percent = db.Column(db.Float, nullable=False)
    reveals_clue_id = db.Column(db.String(64), nullable=True)
    requires_clue_id = db.Column(db.String(64), nullable=True)
    inspect_message = db.Column(db.Text, nullable=False)
    locked_message = db.Column(db.Text, nullable=True)


class Clue(db.Model):
    __tablename__ = 'clues'

    id = db.Column(db.String(64), primary_key=True)
    case_id = db.Column(db.String(64), db.ForeignKey('cases.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    evidence_type = db.Column(db.String(50), nullable=False)
    location_id = db.Column(db.String(64), nullable=False)
    location_name = db.Column(db.String(100), nullable=False)
    reliability = db.Column(db.String(50), default='verified_fact', nullable=False)
    significance = db.Column(db.String(50), default='crucial', nullable=False)
    tags = db.Column(db.JSON, default=list, nullable=False)
    details = db.Column(db.Text, nullable=True)


class Suspect(db.Model):
    __tablename__ = 'suspects'

    id = db.Column(db.String(64), primary_key=True)
    case_id = db.Column(db.String(64), db.ForeignKey('cases.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    avatar = db.Column(db.String(500), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    personality = db.Column(db.String(150), nullable=False)
    temperament = db.Column(db.String(50), default='composed', nullable=False)
    possible_motive = db.Column(db.Text, nullable=False)
    alibi = db.Column(db.Text, nullable=False)
    initial_statement = db.Column(db.Text, nullable=False)
    known_facts = db.Column(db.JSON, default=list, nullable=False)
    hidden_facts = db.Column(db.JSON, default=list, nullable=False)
    authorized_disclosures = db.Column(db.JSON, default=list, nullable=False)


class TimelineEvent(db.Model):
    __tablename__ = 'timeline_events'

    id = db.Column(db.String(64), primary_key=True)
    case_id = db.Column(db.String(64), db.ForeignKey('cases.id'), nullable=False)
    time_string = db.Column(db.String(50), nullable=False)
    sort_timestamp = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(50), nullable=False)
    involved_suspects = db.Column(db.JSON, default=list, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    is_verified = db.Column(db.Boolean, default=True, nullable=False)


class ContradictionRule(db.Model):
    __tablename__ = 'contradictions'

    id = db.Column(db.String(64), primary_key=True)
    case_id = db.Column(db.String(64), db.ForeignKey('cases.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    suspect_id = db.Column(db.String(64), nullable=False)
    suspect_name = db.Column(db.String(100), nullable=False)
    claimed_statement = db.Column(db.Text, nullable=False)
    contradicting_clue_id = db.Column(db.String(64), nullable=False)
    contradicting_clue_name = db.Column(db.String(120), nullable=False)
    explanation = db.Column(db.Text, nullable=False)
    suggested_follow_up = db.Column(db.Text, nullable=False)
    is_confirmed = db.Column(db.Boolean, default=True, nullable=False)


class InvestigationSession(db.Model):
    __tablename__ = 'investigation_sessions'

    id = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey('users.id'), nullable=False)
    case_id = db.Column(db.String(64), db.ForeignKey('cases.id'), nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_active_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_completed = db.Column(db.Boolean, default=False, nullable=False)

    discovered_clue_ids = db.Column(db.JSON, default=list, nullable=False)
    explored_location_ids = db.Column(db.JSON, default=list, nullable=False)
    inspected_object_ids = db.Column(db.JSON, default=list, nullable=False)
    unlocked_hints = db.Column(db.JSON, default=list, nullable=False)

    personal_notes = db.relationship('PersonalNote', backref='session', lazy=True, cascade='all, delete-orphan')
    evidence_links = db.relationship('EvidenceLink', backref='session', lazy=True, cascade='all, delete-orphan')


class PersonalNote(db.Model):
    __tablename__ = 'personal_notes'

    id = db.Column(db.String(64), primary_key=True)
    session_id = db.Column(db.String(64), db.ForeignKey('investigation_sessions.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='theory', nullable=False)
    is_important = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class EvidenceLink(db.Model):
    __tablename__ = 'evidence_links'

    id = db.Column(db.String(64), primary_key=True)
    session_id = db.Column(db.String(64), db.ForeignKey('investigation_sessions.id'), nullable=False)
    from_node_id = db.Column(db.String(64), nullable=False)
    to_node_id = db.Column(db.String(64), nullable=False)
    relation_type = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text, nullable=True)
