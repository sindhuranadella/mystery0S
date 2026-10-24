export type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';
export type EvidenceType = 'physical' | 'document' | 'digital' | 'statement' | 'timeline' | 'environmental' | 'financial';
export type Reliability = 'verified_fact' | 'rumor' | 'unverified_claim';
export type DetectiveRank = 'Trainee' | 'Investigator' | 'Detective' | 'Senior Detective' | 'Master Detective';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  rank: DetectiveRank;
  experiencePoints: number;
  casesCompleted: number;
  casesAttempted: number;
  totalEvidenceDiscovered: number;
  averageScore: number;
  achievements: string[];
}

export interface UserProfile {
  id: string;
  userId: string;
  bio: string;
  badgeTitle: string;
  themePreference: 'midnight' | 'noir' | 'cyber';
  soundEnabled: boolean;
}

export interface Clue {
  id: string;
  caseId: string;
  name: string;
  description: string;
  evidenceType: EvidenceType;
  locationId: string;
  locationName: string;
  discoveryRequirements?: {
    requiredClueId?: string;
    requiredKeyId?: string;
    requiredTool?: string;
    description?: string;
  };
  reliability: Reliability;
  significance: 'crucial' | 'supporting' | 'circumstantial' | 'red_herring';
  discoveredAt?: string;
  tags: string[];
  iconName?: string;
  imageUrl?: string;
  forensicNotes?: string;
  details?: string;
  hiddenFactDisclosed?: string;
}

export interface SceneObject {
  id: string;
  name: string;
  description?: string;
  xPercent: number; // 0-100 for hotspot placement
  yPercent: number;
  revealsClueId?: string;
  requiresClueId?: string;
  requiresKeyName?: string;
  isInspected?: boolean;
  inspectMessage: string;
  lockedMessage?: string;
  inspectActionLabel?: string;
}

export interface SceneLocation {
  id: string;
  caseId: string;
  name: string;
  description: string;
  roomType: 'crime_scene' | 'suspect_room' | 'common_area' | 'restricted' | 'outdoor';
  ambientImage: string;
  objects: SceneObject[];
}

export interface Suspect {
  id: string;
  caseId: string;
  name: string;
  role: string;
  age: number;
  avatar: string;
  bio: string;
  personality: string;
  temperament: 'nervous' | 'composed' | 'defensive' | 'arrogant' | 'cryptic';
  possibleMotive: string;
  alibi: string;
  initialStatement: string;
  relationships: { characterName: string; relationship: string }[];
  knownFacts: string[];
  hiddenFacts: string[];
  authorizedDisclosures: string[];
  contradictionTriggers?: {
    keywordOrClue: string;
    revealedStatement: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timeString: string; // e.g. "09:30 PM"
  sortTimestamp: number; // numeric for deterministic verification
  title: string;
  description: string;
  source: 'surveillance' | 'suspect_claim' | 'physical_record' | 'witness' | 'digital';
  involvedSuspects: string[];
  location: string;
  isVerified: boolean;
  conflictingEventId?: string;
  conflictReason?: string;
}

export interface ContradictionRule {
  id: string;
  caseId: string;
  title: string;
  suspectId: string;
  suspectName: string;
  claimedStatement: string;
  contradictingClueId: string;
  contradictingClueName: string;
  contradictingEventId?: string;
  explanation: string;
  suggestedFollowUp: string;
  isConfirmed: boolean;
}

export interface ProgressiveHint {
  tier: 1 | 2 | 3;
  penaltyPoints: number;
  title: string;
  content: string;
  focusArea: 'general_direction' | 'room_or_character' | 'key_connection';
}

export interface VerifiedSolution {
  culpritId: string;
  culpritName: string;
  motive: string;
  method: string;
  requiredClueIds: string[];
  keyContradictionIds: string[];
  timelineVerificationOrder: string[];
  solutionNarrative: string;
  commonFalseTheories?: {
    suspectId: string;
    reasonWhyIncorrect: string;
  }[];
}

export interface MysteryCase {
  id: string;
  title: string;
  tagline: string;
  crimeCategory: 'Grand Theft' | 'Homicide' | 'Espionage' | 'Corporate Sabotage' | 'Arson';
  difficulty: Difficulty;
  estimatedMinutes: number;
  location: string;
  setting: string;
  coverImage: string;
  description: string;
  incidentTime: string;
  victim?: {
    name: string;
    description: string;
  };
  locations: SceneLocation[];
  clues: Clue[];
  suspects: Suspect[];
  timelineEvents: TimelineEvent[];
  contradictions: ContradictionRule[];
  hints: ProgressiveHint[];
  verifiedSolution: VerifiedSolution;
  isOfficial: boolean;
  authorName: string;
  createdAt: string;
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  clueId?: string;
  suspectId?: string;
  category: 'lead' | 'theory' | 'contradiction' | 'general';
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceLink {
  id: string;
  fromNodeId: string; // clue id or suspect id
  toNodeId: string;
  fromType: 'clue' | 'suspect' | 'location' | 'event';
  toType: 'clue' | 'suspect' | 'location' | 'event';
  relationType: 'supports' | 'contradicts' | 'belongs_to' | 'places_at' | 'motive_for';
  notes?: string;
}

export interface BoardNodePosition {
  id: string;
  x: number;
  y: number;
}

export interface DialogueMessage {
  id: string;
  suspectId: string;
  sender: 'investigator' | 'suspect' | 'system';
  text: string;
  timestamp: string;
  revealedClueId?: string;
  contradictionFlagged?: boolean;
}

export interface PlayerTimelineEntry {
  eventId: string;
  proposedOrder: number;
  userNotes?: string;
}

export interface Hypothesis {
  suspectedCulpritId: string;
  proposedMotive: string;
  proposedMethod: string;
  sequenceOfEvents: string;
  supportingClueIds: string[];
  contradictoryClueIds: string[];
  unresolvedQuestions: string;
  confidenceLevel: number; // 1-100
  notes: string;
}

export interface AccusationSubmission {
  suspectId: string;
  motive: string;
  method: string;
  supportingClueIds: string[];
  timelineOrdering: string[]; // eventIds in order
  writtenReasoning: string;
}

export interface ScoreReport {
  totalScore: number; // 0-100
  culpritScore: number; // 0 or 30
  motiveScore: number; // 0 to 15
  methodScore: number; // 0 to 15
  evidenceScore: number; // 0 to 25
  timelineScore: number; // 0 to 15
  hintDeductions: number;
  accuracyPercentage: number;
  isSolved: boolean;
  correctCulprit: string;
  actualMotive: string;
  actualMethod: string;
  missedClues: string[];
  discoveredCluesCount: number;
  totalCluesCount: number;
  verifiedContradictionsFound: number;
  totalContradictionsCount: number;
  hintsUsedCount: number;
  timeSpentSeconds: number;
  educationalBreakdown: string;
  unlockedAchievements: string[];
  xpAwarded: number;
  newRank?: DetectiveRank;
}

export interface InvestigationSession {
  id: string;
  userId: string;
  caseId: string;
  startedAt: string;
  lastActiveAt: string;
  discoveredClueIds: string[];
  exploredLocationIds: string[];
  inspectedObjectIds: string[];
  unlockedKeys: string[];
  personalNotes: PersonalNote[];
  evidenceLinks: EvidenceLink[];
  boardPositions: Record<string, { x: number; y: number }>;
  dialogueHistory: Record<string, DialogueMessage[]>; // keyed by suspectId
  playerTimeline: PlayerTimelineEntry[];
  unlockedHints: number[]; // tier 1, 2, 3
  detectedContradictionIds: string[];
  hypothesis: Hypothesis;
  accusation?: AccusationSubmission;
  finalReport?: ScoreReport;
  isCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpValue: number;
  criteria: string;
}
