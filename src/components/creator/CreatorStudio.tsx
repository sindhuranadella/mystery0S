import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  Bot,
  Shield,
  Layers,
  MapPin,
  Users,
  Search,
  Lock,
  ArrowRight,
  Skull,
  Flame,
  Scroll
} from 'lucide-react';
import { MysteryCase } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface CreatorStudioProps {
  onPublishCase: (newCase: MysteryCase) => Promise<void>;
  onClose: () => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ onPublishCase, onClose }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'ai_generate' | 'validate'>('create');
  const [aiPrompt, setAiPrompt] = useState({
    genre: 'Classic English Manor Murder',
    setting: 'Gilded age estate in 1928 during a snowstorm',
    suspectsCount: 4,
    difficulty: 'Intermediate'
  });
  const [generating, setGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Case under edit
  const [customCase, setCustomCase] = useState<Partial<MysteryCase>>({
    title: '',
    tagline: '',
    crimeCategory: 'Grand Theft',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    location: '',
    setting: '',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: '',
    incidentTime: '10:30 PM',
    locations: [
      {
        id: 'loc_main',
        caseId: 'custom',
        name: 'The Drawing Room',
        description: 'Velvet sofas, fireplace, and mahogany cabinets.',
        roomType: 'crime_scene',
        ambientImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        objects: [
          {
            id: 'obj_cabinet',
            name: 'Locked Liquor Cabinet',
            xPercent: 50,
            yPercent: 50,
            revealsClueId: 'clue_broken_seal',
            inspectMessage: 'The wax seal on the private reserve bottle was severed.'
          }
        ]
      }
    ],
    clues: [
      {
        id: 'clue_broken_seal',
        caseId: 'custom',
        name: 'Severed Wax Seal',
        description: 'Cut with a miniature scalpel.',
        evidenceType: 'physical',
        locationId: 'loc_main',
        locationName: 'The Drawing Room',
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['seal', 'cut']
      }
    ],
    suspects: [
      {
        id: 'suspect_a',
        caseId: 'custom',
        name: 'Charles Sterling',
        role: 'Estate Executor',
        age: 48,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Attorney managing the family estate.',
        personality: 'Measured and formal.',
        temperament: 'composed',
        possibleMotive: 'Embezzled trust funds.',
        alibi: 'Reviewing contracts in the carriage house.',
        initialStatement: '“I was drafting legal covenants all evening.”',
        relationships: [],
        knownFacts: ['Had key to the wine cabinet.'],
        hiddenFacts: ['Forged the codicil.'],
        authorizedDisclosures: []
      },
      {
        id: 'suspect_b',
        caseId: 'custom',
        name: 'Helena Sterling',
        role: 'Niece',
        age: 29,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Aspiring sculptor with mounting studio debts.',
        personality: 'Artistic, erratic.',
        temperament: 'nervous',
        possibleMotive: 'Disinherited in favor of charity.',
        alibi: 'Strolling in the greenhouse.',
        initialStatement: '“I was admiring the winter camellias.”',
        relationships: [],
        knownFacts: [],
        hiddenFacts: [],
        authorizedDisclosures: []
      }
    ],
    timelineEvents: [
      {
        id: 'evt_1',
        caseId: 'custom',
        timeString: '10:15 PM',
        sortTimestamp: 2215,
        title: 'Glass Breakage Heard',
        description: 'Chime from the drawing room.',
        source: 'witness',
        involvedSuspects: ['suspect_a'],
        location: 'The Drawing Room',
        isVerified: true
      }
    ],
    contradictions: [],
    hints: [
      {
        tier: 1,
        penaltyPoints: 2,
        title: 'Check the Cabinet Seal',
        content: 'Examine who carries fine surgical instruments.',
        focusArea: 'room_or_character'
      }
    ],
    verifiedSolution: {
      culpritId: 'suspect_a',
      culpritName: 'Charles Sterling',
      motive: 'Conceal trust fund embezzlement before tomorrow’s audit.',
      method: 'Used pocket scalpel to sever the cabinet seal and remove the ledgers.',
      requiredClueIds: ['clue_broken_seal'],
      keyContradictionIds: [],
      timelineVerificationOrder: ['evt_1'],
      solutionNarrative: 'Charles Sterling entered the drawing room at 10:15 PM to steal the incriminating audit ledgers.'
    }
  });

  const handleGenerateAI = async () => {
    setGenerating(true);
    soundManager.playKeyType();

    try {
      const res = await fetch('/api/creator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiPrompt)
      });
      const data = await res.json();
      if (data.draftCase) {
        setCustomCase(data.draftCase);
        setActiveTab('create');
        soundManager.playClueFound();
      }
    } catch (err) {
      console.error('Failed to generate mystery draft:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleValidate = async () => {
    soundManager.playKeyType();
    const res = await fetch('/api/creator/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case: customCase })
    });
    const data = await res.json();
    setValidationErrors(data.errors || []);
    setValidationSuccess(data.isValid);
    setActiveTab('validate');
  };

  const handlePublish = async () => {
    if (!validationSuccess) {
      await handleValidate();
      return;
    }
    setPublishing(true);
    soundManager.playKeyType();
    try {
      await onPublishCase(customCase as MysteryCase);
      soundManager.playCaseSolved();
      onClose();
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-stone-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#09080e]/95 border border-red-950/70 shadow-2xl mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-red-500/80 mb-1">
            Case Weaver Sanctuary · Authoring Workshop
          </div>
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-stone-100">
              The Mystery Crypt & Weaver Studio
            </h1>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-serif italic max-w-2xl">
            Inscribe and summon procedural horror cases with verified alibis, hidden forensic relics, and mathematical solvability validation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 text-xs font-cinzel border border-stone-800 transition-colors cursor-pointer"
          >
            Exit Crypt
          </button>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-5 py-2.5 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 text-stone-100 font-cinzel font-bold tracking-wider rounded-xl text-xs shadow-lg shadow-red-950/50 border border-red-700/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-red-300" />
            <span>{publishing ? 'Sealing Case...' : 'Validate & Inscribe'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#07060a]/90 rounded-2xl border border-stone-850 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-red-950/60 text-red-200 border border-red-800/60 shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Case Architect</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_generate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all cursor-pointer ${
            activeTab === 'ai_generate'
              ? 'bg-red-950/60 text-red-200 border border-red-800/60 shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-red-400" />
          <span>Summon via Gemini AI</span>
        </button>

        <button
          onClick={() => {
            handleValidate();
            setActiveTab('validate');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all cursor-pointer ${
            activeTab === 'validate'
              ? 'bg-red-950/60 text-red-200 border border-red-800/60 shadow-md shadow-red-950/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Solvability Crucible</span>
        </button>
      </div>

      {/* AI Mystery Drafter Tab */}
      {activeTab === 'ai_generate' && (
        <div className="p-6 rounded-2xl bg-[#07060a]/90 border border-stone-850 max-w-2xl mx-auto space-y-6 shadow-2xl">
          <div className="text-center">
            <Flame className="w-10 h-10 text-red-500 mx-auto mb-2 animate-pulse" />
            <h3 className="text-lg font-cinzel font-bold text-stone-100">Occult AI Case Summoning</h3>
            <p className="text-xs text-stone-400 mt-1 font-serif italic">
              Concoct an intricate, self-contained mystery with interconnected alibis, physical relics, and verified culprit motives.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                Genre & Macabre Tone
              </label>
              <input
                type="text"
                value={aiPrompt.genre}
                onChange={e => setAiPrompt({ ...aiPrompt, genre: e.target.value })}
                className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
              />
            </div>

            <div>
              <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                Setting & Sinister Era
              </label>
              <input
                type="text"
                value={aiPrompt.setting}
                onChange={e => setAiPrompt({ ...aiPrompt, setting: e.target.value })}
                className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                  Suspect Roster Count
                </label>
                <select
                  value={aiPrompt.suspectsCount}
                  onChange={e => setAiPrompt({ ...aiPrompt, suspectsCount: parseInt(e.target.value, 10) })}
                  className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif cursor-pointer"
                >
                  <option value={2}>2 Suspects</option>
                  <option value={3}>3 Suspects</option>
                  <option value={4}>4 Suspects</option>
                </select>
              </div>

              <div>
                <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                  Labyrinth Difficulty
                </label>
                <select
                  value={aiPrompt.difficulty}
                  onChange={e => setAiPrompt({ ...aiPrompt, difficulty: e.target.value })}
                  className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif cursor-pointer"
                >
                  <option value="Beginner">Apprentice Inquest</option>
                  <option value="Intermediate">Occult Detective</option>
                  <option value="Expert">Master Inquisitor</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-3 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 disabled:opacity-50 text-stone-100 font-cinzel font-bold tracking-wider rounded-xl text-xs shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 border border-red-700/50 transition-all mt-4 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-red-300" />
              <span>{generating ? 'Summoning Tale via Gemini API...' : 'Weave Playable Mystery Draft'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Case Editor Tab */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#07060a]/90 border border-stone-850 space-y-4 text-xs shadow-xl">
            <h3 className="text-sm font-cinzel font-bold text-red-400 uppercase tracking-wider">
              Sinister Case Chronicle
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                  Case Title
                </label>
                <input
                  type="text"
                  value={customCase.title || ''}
                  onChange={e => setCustomCase({ ...customCase, title: e.target.value })}
                  placeholder="e.g. The Crypt of Blackwood Priory"
                  className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
                />
              </div>

              <div>
                <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                  Ominous Premise Tagline
                </label>
                <input
                  type="text"
                  value={customCase.tagline || ''}
                  onChange={e => setCustomCase({ ...customCase, tagline: e.target.value })}
                  placeholder="A frozen manor, five sealed doors, and blood that does not dry..."
                  className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
                />
              </div>
            </div>

            <div>
              <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                Inquest Briefing Chronicle
              </label>
              <textarea
                value={customCase.description || ''}
                onChange={e => setCustomCase({ ...customCase, description: e.target.value })}
                rows={3}
                placeholder="Narrate the gruesome circumstances under which the victim was discovered..."
                className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif placeholder:italic"
              />
            </div>
          </div>

          {/* Solution Editor */}
          <div className="p-6 rounded-2xl bg-[#07060a]/90 border border-stone-850 space-y-4 text-xs shadow-xl">
            <h3 className="text-sm font-cinzel font-bold text-amber-500 uppercase tracking-wider">
              Verified Solution & Occult Forensic Truth
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                  Designated Culprit
                </label>
                <select
                  value={customCase.verifiedSolution?.culpritId || ''}
                  onChange={e =>
                    setCustomCase({
                      ...customCase,
                      verifiedSolution: {
                        ...(customCase.verifiedSolution as any),
                        culpritId: e.target.value,
                        culpritName: customCase.suspects?.find(s => s.id === e.target.value)?.name || 'Unknown'
                      }
                    })
                  }
                  className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif cursor-pointer"
                >
                  <option value="">Select Accused</option>
                  {customCase.suspects?.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                  Actual Dark Motive
                </label>
                <input
                  type="text"
                  value={customCase.verifiedSolution?.motive || ''}
                  onChange={e =>
                    setCustomCase({
                      ...customCase,
                      verifiedSolution: {
                        ...(customCase.verifiedSolution as any),
                        motive: e.target.value
                      }
                    })
                  }
                  className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
                />
              </div>
            </div>

            <div>
              <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                Full Solution Revelation
              </label>
              <textarea
                value={customCase.verifiedSolution?.solutionNarrative || ''}
                onChange={e =>
                  setCustomCase({
                    ...customCase,
                    verifiedSolution: {
                      ...(customCase.verifiedSolution as any),
                      solutionNarrative: e.target.value
                    }
                  })
                }
                rows={3}
                placeholder="The unvarnished truth unveiled to the inquisitor upon formal accusation clearance..."
                className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif placeholder:italic"
              />
            </div>
          </div>
        </div>
      )}

      {/* Solvability Validation Engine Tab */}
      {activeTab === 'validate' && (
        <div className="p-6 rounded-2xl bg-[#07060a]/90 border border-stone-850 max-w-2xl mx-auto space-y-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-base font-cinzel font-bold text-stone-100">Solvability & Dependency Crucible</h3>
              <p className="text-xs text-stone-400 font-serif italic">Deterministic mathematical check of all clue prerequisites and causal graphs.</p>
            </div>
          </div>

          {validationSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 font-serif">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">Case Solvability Verified: All relics are reachable and contradictions are non-circular.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {validationErrors.map((err, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 font-serif">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 text-xs font-cinzel border border-stone-850 cursor-pointer"
            >
              Back to Architect
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 text-stone-100 font-cinzel font-bold text-xs border border-red-700/50 cursor-pointer shadow-lg shadow-red-950/50"
            >
              Inscribe & Publish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
