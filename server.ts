import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CASES, ACHIEVEMENTS_LIST } from './src/data/seedCases.js';
import { MysteryCase, InvestigationSession, AccusationSubmission, User, PersonalNote, EvidenceLink } from './src/types/mystery.js';
import { evaluateAccusation, computeRankFromXP } from './src/services/scoringEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini AI Client Server-Side
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Database Store (with sample pre-seeded users and cases)
interface DatabaseStore {
  users: Record<string, User & { passwordHash: string }>;
  cases: Record<string, MysteryCase>;
  sessions: Record<string, InvestigationSession>;
  authTokens: Record<string, string>; // token -> userId
}

const db: DatabaseStore = {
  users: {
    'usr_default': {
      id: 'usr_default',
      username: 'DetectiveHolt',
      email: 'sindhura.nadella06@gmail.com',
      passwordHash: 'hashed_secret_123',
      createdAt: '2026-10-24T12:00:00Z',
      rank: 'Investigator',
      experiencePoints: 850,
      casesCompleted: 1,
      casesAttempted: 2,
      totalEvidenceDiscovered: 14,
      averageScore: 88,
      achievements: ['first_clue', 'truth_unmasked', 'timeline_architect']
    }
  },
  cases: {},
  sessions: {},
  authTokens: {
    'default_token_key': 'usr_default'
  }
};

// Seed Cases into DB
for (const c of INITIAL_CASES) {
  db.cases[c.id] = JSON.parse(JSON.stringify(c));
}

// Helper to sanitize case (Strip sensitive verifiedSolution from player during active investigation)
function sanitizeCaseForPlayer(c: MysteryCase): Omit<MysteryCase, 'verifiedSolution'> & { hasSolution: boolean } {
  const { verifiedSolution: _, ...safeCase } = c;
  return {
    ...safeCase,
    hasSolution: true
  };
}

// Auth Middleware
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || 'default_token_key';
  const userId = db.authTokens[token];
  if (!userId || !db.users[userId]) {
    // If not found, fall back to default user for seamless experience
    (req as any).user = db.users['usr_default'];
    return next();
  }
  (req as any).user = db.users[userId];
  next();
}

// =================== AUTH ROUTES ===================
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }
  const existing = Object.values(db.users).find(u => u.email === email || u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'User with this email or username already exists' });
  }
  const id = `usr_${Date.now()}`;
  const newUser: User & { passwordHash: string } = {
    id,
    username,
    email,
    passwordHash: `hash_${password}`, // securely tracked in real app
    createdAt: new Date().toISOString(),
    rank: 'Trainee',
    experiencePoints: 100,
    casesCompleted: 0,
    casesAttempted: 0,
    totalEvidenceDiscovered: 0,
    averageScore: 0,
    achievements: ['first_clue']
  };
  db.users[id] = newUser;
  const token = `token_${id}_${Date.now()}`;
  db.authTokens[token] = id;
  const { passwordHash: _, ...safeUser } = newUser;
  res.json({ token, user: safeUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(db.users).find(u => u.email === email || u.username === email);
  if (!user || user.passwordHash !== `hash_${password}` && password !== 'detective123') {
    // allow quick demo login
    if (user) {
      const token = `token_${user.id}_${Date.now()}`;
      db.authTokens[token] = user.id;
      const { passwordHash: _, ...safeUser } = user;
      return res.json({ token, user: safeUser });
    }
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
  }
  const token = `token_${user.id}_${Date.now()}`;
  db.authTokens[token] = user.id;
  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.post('/api/auth/profile', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { username } = req.body;
  if (username) user.username = username;
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// =================== CASE LIBRARY ===================
app.get('/api/cases', requireAuth, (req, res) => {
  const { difficulty, category, search } = req.query;
  let cases = Object.values(db.cases).map(c => sanitizeCaseForPlayer(c));

  if (difficulty && difficulty !== 'All') {
    cases = cases.filter(c => c.difficulty === difficulty);
  }
  if (category && category !== 'All') {
    cases = cases.filter(c => c.crimeCategory === category);
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    cases = cases.filter(c => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));
  }

  res.json({ cases });
});

app.get('/api/cases/:id', requireAuth, (req, res) => {
  const c = db.cases[req.params.id];
  if (!c) return res.status(404).json({ error: 'Case not found' });
  res.json({ case: sanitizeCaseForPlayer(c) });
});

// =================== INVESTIGATION SESSION ===================
app.post('/api/sessions/start', requireAuth, (req, res) => {
  const user = (req as any).user;
  const { caseId } = req.body;
  const c = db.cases[caseId];
  if (!c) return res.status(404).json({ error: 'Case not found' });

  // Look for existing active session
  let session = Object.values(db.sessions).find(s => s.userId === user.id && s.caseId === caseId && !s.isCompleted);

  if (!session) {
    const sessionId = `sess_${user.id}_${caseId}_${Date.now()}`;
    session = {
      id: sessionId,
      userId: user.id,
      caseId,
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      discoveredClueIds: [],
      exploredLocationIds: [c.locations[0]?.id || ''],
      inspectedObjectIds: [],
      unlockedKeys: [],
      personalNotes: [
        {
          id: `note_${Date.now()}`,
          title: 'Initial Case Briefing',
          content: `Crime: ${c.title}. Victim: ${c.victim?.name || 'Unknown'}. Incident timeline reported around ${c.incidentTime}. Objective: Collect physical evidence, interrogate 4 suspects, detect contradictions, and identify the true culprit with verified proof.`,
          category: 'general',
          isImportant: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      evidenceLinks: [],
      boardPositions: {},
      dialogueHistory: {},
      playerTimeline: c.timelineEvents.map((evt, idx) => ({
        eventId: evt.id,
        proposedOrder: idx + 1,
        userNotes: ''
      })),
      unlockedHints: [],
      detectedContradictionIds: [],
      hypothesis: {
        suspectedCulpritId: '',
        proposedMotive: '',
        proposedMethod: '',
        sequenceOfEvents: '',
        supportingClueIds: [],
        contradictoryClueIds: [],
        unresolvedQuestions: '',
        confidenceLevel: 50,
        notes: ''
      },
      isCompleted: false
    };
    db.sessions[sessionId] = session;
    user.casesAttempted = (user.casesAttempted || 0) + 1;
  }

  res.json({
    session,
    case: sanitizeCaseForPlayer(c)
  });
});

app.get('/api/sessions/:sessionId', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Investigation session not found' });
  const c = db.cases[session.caseId];
  res.json({
    session,
    case: sanitizeCaseForPlayer(c)
  });
});

// Scene Object Inspection & Clue Discovery
app.post('/api/sessions/:sessionId/inspect', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { locationId, objectId } = req.body;
  const c = db.cases[session.caseId];
  if (!c) return res.status(404).json({ error: 'Case not found' });

  const loc = c.locations.find(l => l.id === locationId);
  const obj = loc?.objects.find(o => o.id === objectId);
  if (!obj) return res.status(404).json({ error: 'Scene object not found' });

  // Check prerequisites
  if (obj.requiresClueId && !session.discoveredClueIds.includes(obj.requiresClueId)) {
    return res.status(400).json({
      locked: true,
      message: obj.lockedMessage || 'You need additional evidence or tools before you can examine this object.'
    });
  }

  if (!session.inspectedObjectIds.includes(objectId)) {
    session.inspectedObjectIds.push(objectId);
  }
  if (!session.exploredLocationIds.includes(locationId)) {
    session.exploredLocationIds.push(locationId);
  }

  let newlyDiscoveredClue = null;
  if (obj.revealsClueId && !session.discoveredClueIds.includes(obj.revealsClueId)) {
    session.discoveredClueIds.push(obj.revealsClueId);
    newlyDiscoveredClue = c.clues.find(clue => clue.id === obj.revealsClueId);
    const user = (req as any).user;
    user.totalEvidenceDiscovered = (user.totalEvidenceDiscovered || 0) + 1;
  }

  session.lastActiveAt = new Date().toISOString();

  res.json({
    inspectMessage: obj.inspectMessage,
    newlyDiscoveredClue,
    session
  });
});

// Explore Location
app.post('/api/sessions/:sessionId/explore', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { locationId } = req.body;
  if (!session.exploredLocationIds.includes(locationId)) {
    session.exploredLocationIds.push(locationId);
  }
  res.json({ session });
});

// Notes CRUD
app.post('/api/sessions/:sessionId/notes', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { title, content, clueId, suspectId, category, isImportant } = req.body;
  const newNote: PersonalNote = {
    id: `note_${Date.now()}`,
    title: title || 'Untitled Note',
    content: content || '',
    clueId,
    suspectId,
    category: category || 'general',
    isImportant: Boolean(isImportant),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  session.personalNotes.unshift(newNote);
  res.json({ note: newNote, session });
});

app.put('/api/sessions/:sessionId/notes/:noteId', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const note = session.personalNotes.find(n => n.id === req.params.noteId);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  const { title, content, category, isImportant } = req.body;
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (category !== undefined) note.category = category;
  if (isImportant !== undefined) note.isImportant = isImportant;
  note.updatedAt = new Date().toISOString();
  res.json({ note, session });
});

app.delete('/api/sessions/:sessionId/notes/:noteId', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.personalNotes = session.personalNotes.filter(n => n.id !== req.params.noteId);
  res.json({ success: true, session });
});

// Evidence Links
app.post('/api/sessions/:sessionId/evidence-links', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { fromNodeId, toNodeId, fromType, toType, relationType, notes } = req.body;
  const newLink: EvidenceLink = {
    id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fromNodeId,
    toNodeId,
    fromType: fromType || 'clue',
    toType: toType || 'clue',
    relationType: relationType || 'supports',
    notes
  };
  session.evidenceLinks.push(newLink);
  res.json({ link: newLink, session });
});

app.delete('/api/sessions/:sessionId/evidence-links/:linkId', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.evidenceLinks = session.evidenceLinks.filter(l => l.id !== req.params.linkId);
  res.json({ success: true, session });
});

// Evidence Board Positions
app.post('/api/sessions/:sessionId/board-positions', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.boardPositions = {
    ...session.boardPositions,
    ...req.body.positions
  };
  res.json({ success: true });
});

// Timeline Save
app.post('/api/sessions/:sessionId/timeline', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.playerTimeline = req.body.playerTimeline;
  res.json({ session });
});

// Hypothesis Save
app.post('/api/sessions/:sessionId/hypothesis', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  session.hypothesis = {
    ...session.hypothesis,
    ...req.body.hypothesis
  };
  res.json({ session });
});

// Hints Unlock
app.post('/api/sessions/:sessionId/hints', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { tier } = req.body;
  if (!session.unlockedHints.includes(tier)) {
    session.unlockedHints.push(tier);
  }
  res.json({ session });
});

// =================== NATURAL LANGUAGE INTERROGATION ===================
app.post('/api/sessions/:sessionId/interrogate', requireAuth, async (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const { suspectId, question } = req.body;
  const c = db.cases[session.caseId];
  if (!c) return res.status(404).json({ error: 'Case not found' });

  const suspect = c.suspects.find(s => s.id === suspectId);
  if (!suspect) return res.status(404).json({ error: 'Suspect not found' });

  // Save investigator message
  if (!session.dialogueHistory[suspectId]) {
    session.dialogueHistory[suspectId] = [];
  }
  const userMsg = {
    id: `msg_${Date.now()}`,
    suspectId,
    sender: 'investigator' as const,
    text: question,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  session.dialogueHistory[suspectId].push(userMsg);

  // Check if player presented a specific clue that triggers a contradiction statement
  const lowerQ = question.toLowerCase();
  let revealedClueNotice: string | undefined = undefined;
  let contradictionDetected = false;

  // Evaluate contradiction triggers
  if (suspect.contradictionTriggers) {
    for (const trig of suspect.contradictionTriggers) {
      if (lowerQ.includes(trig.keywordOrClue.toLowerCase()) || session.discoveredClueIds.includes(trig.keywordOrClue)) {
        if (lowerQ.includes('card') || lowerQ.includes('badge') || lowerQ.includes('glove') || lowerQ.includes('ledger') || lowerQ.includes('safe') || lowerQ.includes('time')) {
          contradictionDetected = true;
        }
      }
    }
  }

  let suspectReply = '';

  // Attempt Server-Side Gemini Call if configured
  if (aiClient) {
    try {
      const discoveredCluesText = c.clues
        .filter(cl => session.discoveredClueIds.includes(cl.id))
        .map(cl => `- ${cl.name}: ${cl.description}`)
        .join('\n');

      const systemPrompt = `You are roleplaying as ${suspect.name}, a character in an interactive mystery murder/theft investigation named "${c.title}".
Character Profile:
- Role: ${suspect.role}, Age: ${suspect.age}
- Personality: ${suspect.personality}
- Temperament: ${suspect.temperament}
- Alibi: ${suspect.alibi}
- Known Facts to Character: ${JSON.stringify(suspect.knownFacts)}
- Secrets & Hidden Facts (DO NOT outright confess unless cornered with indisputable proof): ${JSON.stringify(suspect.hiddenFacts)}
- Authorized Disclosures: ${JSON.stringify(suspect.authorizedDisclosures)}

STRICT TRUTH-PRESERVATION & INVESTIGATION RULES:
1. Stay strictly in character as ${suspect.name}. Speak in the first person with appropriate tone and mannerisms.
2. NEVER break character or say you are an AI.
3. NEVER invent clues, timestamps, or characters that do not exist in the case data.
4. The player has discovered the following clues so far:
${discoveredCluesText || '(No clues discovered yet)'}
5. Do NOT reveal clues the player has not found. If the player asks about unknown things, express ignorance or deflect naturally.
6. If the player accuses you, defend yourself based on your alibi: "${suspect.alibi}".
7. If the player presents direct evidence matching your contradiction (like the Appraiser Badge #04 swipe at 10:22 PM or the emerald silk glove), become flustered or defensive, stammer, and attempt an excuse, but do not freely confess everything.
8. Keep your response concise (2-4 sentences max), punchy, and cinematic.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      suspectReply = response.text || '';
    } catch (err) {
      console.error('Gemini interrogation error, using smart fallback:', err);
    }
  }

  // Scripted Fallback if AI not configured or failed
  if (!suspectReply) {
    if (suspectId === 'suspect_evelyn_vance') {
      if (lowerQ.includes('card') || lowerQ.includes('swipe') || lowerQ.includes('ledger') || lowerQ.includes('10:22') || lowerQ.includes('badge')) {
        suspectReply = '“That card swipe at 10:22 PM must be a machine error! Or someone took my reticule from the chair while I was visiting the powder room! I swear to you, Inspector, I did not touch the safe.”';
        contradictionDetected = true;
      } else if (lowerQ.includes('glove') || lowerQ.includes('emerald') || lowerQ.includes('grease')) {
        suspectReply = '“I... I dropped that emerald glove earlier during a walk through the glasshouses! Anyone could have retrieved it from the soil. You are grasping at straws, Detective.”';
        contradictionDetected = true;
      } else if (lowerQ.includes('swiss') || lowerQ.includes('zurich') || lowerQ.includes('money') || lowerQ.includes('telegram') || lowerQ.includes('debt')) {
        suspectReply = '“My business dealings are strictly private. All antique galleries face cash-flow variations, but suggesting I would steal Lord Harrington\'s jewel is slanderous!”';
      } else if (lowerQ.includes('where') || lowerQ.includes('alibi') || lowerQ.includes('10')) {
        suspectReply = '“As I stated plainly, I was nestled in the west wing library reading Lord Harrington\'s monographs between 10:00 and 10:45 PM. No one disturbed me, and I disturbed no one.”';
      } else {
        suspectReply = '“Inspector, I am here as an accredited gemologist to inspect rare treasures, not to be cross-examined like a common pickpocket. What specifically are you implying?”';
      }
    } else if (suspectId === 'suspect_julian_croft') {
      if (lowerQ.includes('cufflink') || lowerQ.includes('gold')) {
        suspectReply = '“I tell you, that gold cufflink went missing during dinner! Evelyn Vance was seated right beside me, admiring the monogram. I think someone lifted it to frame me!”';
      } else if (lowerQ.includes('terrace') || lowerQ.includes('smoke') || lowerQ.includes('cigar')) {
        suspectReply = '“I stood out on that cold balcony from 10:15 until 10:35 PM puffing Turkish tobacco. Victoria looked through the glass and saw my lighter spark!”';
      } else {
        suspectReply = '“Look, I owe money in London, I don’t deny it. But I love my uncle, and I wouldn’t dare touch his prize diamond.”';
      }
    } else if (suspectId === 'suspect_lucas_gray') {
      if (lowerQ.includes('glass') || lowerQ.includes('champagne') || lowerQ.includes('crash')) {
        suspectReply = '“At 10:20 PM sharp, a tray was unsettled near the orchestra. I immediately tended to the breakage alongside the gallery guards. It occupied us for several minutes.”';
      } else {
        suspectReply = '“My thirty-two years of service to Harrington Manor are beyond reproach. I oversee sixty staff members and guard the estate honor.”';
      }
    } else {
      suspectReply = `“I have cooperated fully with your inquiry, Inspector. Please check the logs and witness statements if you doubt my word.”`;
    }
  }

  const suspectMsg = {
    id: `msg_${Date.now() + 1}`,
    suspectId,
    sender: 'suspect' as const,
    text: suspectReply,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    revealedClueId: revealedClueNotice,
    contradictionFlagged: contradictionDetected
  };
  session.dialogueHistory[suspectId].push(suspectMsg);

  res.json({
    message: suspectMsg,
    session
  });
});

// =================== FORMAL ACCUSATION & SCORING ===================
app.post('/api/sessions/:sessionId/accuse', requireAuth, (req, res) => {
  const session = db.sessions[req.params.sessionId];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const c = db.cases[session.caseId];
  if (!c) return res.status(404).json({ error: 'Case not found' });

  const submission: AccusationSubmission = req.body.accusation;
  session.accusation = submission;

  const timeSpentSeconds = Math.round((Date.now() - new Date(session.startedAt).getTime()) / 1000);

  // Evaluate Accusation using deterministic 100-point algorithm
  const report = evaluateAccusation(
    c,
    submission,
    session.unlockedHints,
    session.discoveredClueIds,
    timeSpentSeconds
  );

  session.finalReport = report;
  session.isCompleted = true;

  // Award User XP and updates
  const user = (req as any).user;
  user.experiencePoints = (user.experiencePoints || 0) + report.xpAwarded;
  user.casesCompleted = (user.casesCompleted || 0) + 1;
  user.rank = computeRankFromXP(user.experiencePoints);
  report.newRank = user.rank;

  // Merge achievements
  for (const ach of report.unlockedAchievements) {
    if (!user.achievements.includes(ach)) {
      user.achievements.push(ach);
    }
  }

  res.json({
    report,
    verifiedSolution: c.verifiedSolution,
    session,
    user
  });
});

// =================== CREATOR STUDIO & AI CASE GENERATION ===================
app.post('/api/creator/validate', requireAuth, (req, res) => {
  const customCase: MysteryCase = req.body.case;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!customCase.title || customCase.title.trim().length < 3) errors.push('Case title is required (min 3 chars).');
  if (!customCase.description || customCase.description.trim().length < 20) errors.push('Case description must be at least 20 characters.');
  if (!customCase.locations || customCase.locations.length < 2) errors.push('At least 2 investigation locations are required.');
  if (!customCase.suspects || customCase.suspects.length < 2) errors.push('At least 2 suspects are required.');
  if (!customCase.clues || customCase.clues.length < 3) errors.push('At least 3 clues are required.');

  if (!customCase.verifiedSolution?.culpritId) errors.push('A verified culprit must be selected.');
  if (!customCase.verifiedSolution?.motive) errors.push('A verified motive must be provided.');
  if (!customCase.verifiedSolution?.method) errors.push('A verified method must be provided.');

  // Validate clue reference integrity
  const locIds = new Set(customCase.locations?.map(l => l.id) || []);
  for (const clue of customCase.clues || []) {
    if (!locIds.has(clue.locationId)) {
      errors.push(`Clue "${clue.name}" references non-existent location ID: ${clue.locationId}`);
    }
  }

  // Validate suspect culprit existence
  const suspectIds = new Set(customCase.suspects?.map(s => s.id) || []);
  if (customCase.verifiedSolution?.culpritId && !suspectIds.has(customCase.verifiedSolution.culpritId)) {
    errors.push(`The designated culprit does not exist in the suspect roster.`);
  }

  res.json({
    isValid: errors.length === 0,
    errors,
    warnings
  });
});

app.post('/api/creator/generate', requireAuth, async (req, res) => {
  const { genre, setting, suspectsCount, difficulty } = req.body;

  let generatedCase: Partial<MysteryCase> | null = null;

  if (aiClient) {
    try {
      const prompt = `Create a complete, logically coherent, playable mystery investigation case in JSON format.
Genre: ${genre || 'Classic Noir Whodunit'}
Setting: ${setting || 'Venetian Palazzo during Carnevale'}
Suspects Count: ${suspectsCount || 3}
Difficulty: ${difficulty || 'Intermediate'}

Return valid JSON adhering to this structure:
{
  "title": "The Glass Masquerade",
  "tagline": "A rare Murano ruby glass chalice shattered during midnight chimes.",
  "crimeCategory": "Grand Theft",
  "difficulty": "${difficulty || 'Intermediate'}",
  "estimatedMinutes": 25,
  "location": "Palazzo Contarini, Venice",
  "setting": "Canal-side marble palazzo during a heavy thunderstorm.",
  "coverImage": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  "description": "At midnight, the Contarini ruby chalice was stolen and replaced with stained glass fragments.",
  "incidentTime": "12:00 AM",
  "victim": { "name": "Countess Isabella", "description": "Patron of Venetian glass masters." },
  "locations": [
    {
      "id": "loc_ballroom",
      "name": "Mirror Gallery",
      "description": "Ornate baroque hall with gilded mirrors and glass chandeliers.",
      "roomType": "crime_scene",
      "ambientImage": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80",
      "objects": [
        { "id": "obj_pedestal", "name": "Marble Display Pedestal", "xPercent": 50, "yPercent": 50, "revealsClueId": "clue_glass_shards", "inspectMessage": "Fragmented colored glass scatter the pedestal." }
      ]
    },
    {
      "id": "loc_balcony",
      "name": "Canal Balcony",
      "description": "Marble balustrade overlooking the dark canal waters.",
      "roomType": "common_area",
      "ambientImage": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
      "objects": [
        { "id": "obj_rope", "name": "Mooring Rope Anchor", "xPercent": 70, "yPercent": 60, "revealsClueId": "clue_damp_cloak", "inspectMessage": "A wet velvet cloak hooked on the iron cleat." }
      ]
    }
  ],
  "clues": [
    {
      "id": "clue_glass_shards",
      "name": "Counterfeit Stained Shards",
      "description": "Cheap modern soda-lime glass rather than genuine 16th-century ruby glass.",
      "evidenceType": "physical",
      "locationId": "loc_ballroom",
      "locationName": "Mirror Gallery",
      "reliability": "verified_fact",
      "significance": "crucial",
      "tags": ["glass", "chalice"]
    },
    {
      "id": "clue_damp_cloak",
      "name": "Drenched Black Harlequin Cloak",
      "description": "Damp cloak smelling of gondola engine grease, left on the water balcony.",
      "evidenceType": "physical",
      "locationId": "loc_balcony",
      "locationName": "Canal Balcony",
      "reliability": "verified_fact",
      "significance": "crucial",
      "tags": ["escape", "harlequin"]
    }
  ],
  "suspects": [
    {
      "id": "suspect_marco",
      "name": "Marco Bellini",
      "role": "Master Glassblower",
      "age": 42,
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      "bio": "Renowned Murano artisan with failing furnace workshops.",
      "personality": "Passionate, proud, desperate for funding.",
      "temperament": "nervous",
      "possibleMotive": "Save his ancestral glass furnace from bankruptcy.",
      "alibi": "Drinking prosecco by the courtyard fountain at midnight.",
      "initialStatement": "I would never destroy sacred Venetian heritage! I was in the courtyard all evening.",
      "knownFacts": ["Has key to the display vitrine."],
      "hiddenFacts": ["He took the ruby chalice to cast a mold."],
      "authorizedDisclosures": []
    },
    {
      "id": "suspect_bianca",
      "name": "Bianca Rinaldi",
      "role": "Private Antiquities Dealer",
      "age": 36,
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "bio": "Milanese broker representing secret international collectors.",
      "personality": "Smooth, evasive, impeccably dressed.",
      "temperament": "composed",
      "possibleMotive": "Commission of 300,000 euros.",
      "alibi": "Dancing the minuet in the salon.",
      "initialStatement": "My clients seek legal antiquities only. Ask the musicians.",
      "knownFacts": [],
      "hiddenFacts": [],
      "authorizedDisclosures": []
    }
  ],
  "timelineEvents": [
    { "id": "evt_1", "timeString": "11:45 PM", "sortTimestamp": 2345, "title": "Gondola Mooring", "description": "Gondola heard idling below balcony.", "source": "witness", "involvedSuspects": [], "location": "Canal Balcony", "isVerified": true },
    { "id": "evt_2", "timeString": "12:00 AM", "sortTimestamp": 2400, "title": "Midnight Bells Strike", "description": "Mirror Gallery lights flicker; glass crash heard.", "source": "physical_record", "involvedSuspects": ["suspect_marco"], "location": "Mirror Gallery", "isVerified": true }
  ],
  "contradictions": [],
  "hints": [
    { "tier": 1, "penaltyPoints": 2, "title": "Check the Balcony", "content": "The thief had a water escape route prepared.", "focusArea": "room_or_character" }
  ],
  "verifiedSolution": {
    "culpritId": "suspect_marco",
    "culpritName": "Marco Bellini",
    "motive": "To preserve his bankrupt Murano glass furnace by melting down the ruby chalice gold foil.",
    "method": "Swapped the chalice for painted glass, fled through the water balcony wearing the harlequin cloak, and dropped the damp garments before blending back in.",
    "requiredClueIds": ["clue_glass_shards", "clue_damp_cloak"],
    "keyContradictionIds": [],
    "timelineVerificationOrder": ["evt_1", "evt_2"],
    "solutionNarrative": "Marco Bellini used his intimate knowledge of glass chemical composition to fake the chalice and escape via the canal."
  }
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8
        }
      });

      const text = response.text || '';
      generatedCase = JSON.parse(text);
    } catch (err) {
      console.error('AI mystery drafting failed, using default crafted template:', err);
    }
  }

  if (!generatedCase) {
    generatedCase = {
      title: 'The Crimson Cipher',
      tagline: 'An encrypted research drive disappears from a locked high-security vault.',
      crimeCategory: 'Corporate Sabotage',
      difficulty: 'Intermediate',
      estimatedMinutes: 20,
      location: 'Quantum Leap Labs, Zurich',
      setting: 'A subterranean cryogenic facility with biometric security locks.',
      coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
      description: 'At 03:00 AM, the quantum cryptography core drive was extracted from cold storage.',
      incidentTime: '03:00 AM',
      victim: { name: 'Dr. Hans Richter', description: 'Quantum Research Director.' },
      locations: [
        {
          id: 'loc_cryo_vault',
          caseId: 'custom_cipher',
          name: 'Cryogenic Vault',
          description: 'Sub-zero vapor and locked magnetic enclosures.',
          roomType: 'crime_scene',
          ambientImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
          objects: [
            { id: 'obj_cryo_pod', name: 'Drive Enclosure Pod', xPercent: 50, yPercent: 50, revealsClueId: 'clue_liquid_nitrogen', inspectMessage: 'The nitrogen seal was bypass-heated.' }
          ]
        }
      ],
      clues: [
        {
          id: 'clue_liquid_nitrogen',
          caseId: 'custom_cipher',
          name: 'Thermal Heat-Trace Foil',
          description: 'Foil used to fool the cryo thermal sensor during extraction.',
          evidenceType: 'physical',
          locationId: 'loc_cryo_vault',
          locationName: 'Cryogenic Vault',
          reliability: 'verified_fact',
          significance: 'crucial',
          tags: ['thermal', 'drive'],
          details: 'Recovered near exhaust vents.'
        }
      ],
      suspects: [
        {
          id: 'suspect_greta',
          caseId: 'custom_cipher',
          name: 'Greta Lindqvist',
          role: 'Lead Systems Architect',
          age: 35,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          bio: 'Cryptographic specialist with high clearance.',
          personality: 'Cold, precise, uncompromising.',
          temperament: 'composed',
          possibleMotive: 'Offered 5M by rival tech syndicate.',
          alibi: 'Reviewing code in office 2B.',
          initialStatement: 'I was running simulation cycles all night.',
          relationships: [],
          knownFacts: ['Knows cryogenic bypass protocols.'],
          hiddenFacts: ['Has the thermal foil in her bag.'],
          authorizedDisclosures: []
        }
      ],
      timelineEvents: [
        { id: 'evt_q1', caseId: 'custom_cipher', timeString: '03:00 AM', sortTimestamp: 300, title: 'Thermal Alarm Bypass', description: 'Vault sensors register heat spoofing.', source: 'physical_record', involvedSuspects: ['suspect_greta'], location: 'Cryogenic Vault', isVerified: true }
      ],
      contradictions: [],
      hints: [
        { tier: 1, penaltyPoints: 2, title: 'Check thermal bypass', content: 'Examine who understood the cryogenic sensor tolerances.', focusArea: 'key_connection' }
      ],
      verifiedSolution: {
        culpritId: 'suspect_greta',
        culpritName: 'Greta Lindqvist',
        motive: 'Sell proprietary quantum algorithms to an overseas rival.',
        method: 'Used thermal foil to fool the vault sensor at 03:00 AM.',
        requiredClueIds: ['clue_liquid_nitrogen'],
        keyContradictionIds: [],
        timelineVerificationOrder: ['evt_q1'],
        solutionNarrative: 'Greta used thermal foil to trick the cryo chamber into releasing the drive.'
      }
    };
  }

  res.json({ draftCase: generatedCase });
});

app.post('/api/creator/cases', requireAuth, (req, res) => {
  const user = (req as any).user;
  const customCase: MysteryCase = req.body.case;
  const newId = `custom_${Date.now()}`;
  customCase.id = newId;
  customCase.authorName = user.username || 'Detective';
  customCase.isOfficial = false;
  customCase.createdAt = new Date().toISOString();

  db.cases[newId] = customCase;
  res.json({ success: true, case: sanitizeCaseForPlayer(customCase) });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MysteryOS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start MysteryOS server:', err);
});
