import React, { useState } from 'react';
import {
  Skull,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Save,
  Send,
  Flame,
  Fingerprint,
  Scroll
} from 'lucide-react';
import { MysteryCase, InvestigationSession, Hypothesis } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface HypothesisWorkspaceProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onSaveHypothesis: (hypo: Hypothesis) => void;
  onOpenAccusation: () => void;
}

export const HypothesisWorkspace: React.FC<HypothesisWorkspaceProps> = ({
  mysteryCase,
  session,
  onSaveHypothesis,
  onOpenAccusation,
}) => {
  const [hypothesis, setHypothesis] = useState<Hypothesis>(
    session.hypothesis || {
      suspectedCulpritId: '',
      proposedMotive: '',
      proposedMethod: '',
      sequenceOfEvents: '',
      supportingClueIds: [],
      contradictoryClueIds: [],
      unresolvedQuestions: '',
      confidenceLevel: 60,
      notes: ''
    }
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const discoveredClues = mysteryCase.clues.filter(c => session.discoveredClueIds.includes(c.id));

  const handleToggleClue = (clueId: string) => {
    soundManager.playKeyType();
    setHypothesis(prev => {
      const exists = prev.supportingClueIds.includes(clueId);
      return {
        ...prev,
        supportingClueIds: exists
          ? prev.supportingClueIds.filter(id => id !== clueId)
          : [...prev.supportingClueIds, clueId]
      };
    });
  };

  const handleSave = () => {
    soundManager.playKeyType();
    onSaveHypothesis(hypothesis);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Check theory strength
  const hasCulprit = Boolean(hypothesis.suspectedCulpritId);
  const hasMotive = hypothesis.proposedMotive.length >= 10;
  const hasMethod = hypothesis.proposedMethod.length >= 10;
  const hasEvidence = hypothesis.supportingClueIds.length >= 2;

  return (
    <div className="space-y-6 text-stone-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#09080d]/90 border border-red-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-red-500/80 mb-1">
            Forensic Synthesis · Crucible of Deductions
          </div>
          <h3 className="text-lg font-cinzel font-bold text-stone-100 flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            The Crucible of Deduction
          </h3>
          <p className="text-xs text-stone-400 mt-1 font-serif italic max-w-xl">
            Synthesize bloodline testimonies, ritual relics, and temporal contradictions into an irrefutable indictment before the inquest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900/90 hover:bg-stone-850 text-stone-300 rounded-xl text-xs font-cinzel font-semibold border border-stone-800 hover:border-red-900/50 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-stone-400" />
            <span>{savedSuccess ? 'Inscribed to Tome' : 'Inscribe Draft'}</span>
          </button>

          <button
            onClick={onOpenAccusation}
            className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 text-stone-100 rounded-xl text-xs font-cinzel font-bold tracking-wider border border-red-700/60 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
          >
            <Skull className="w-3.5 h-3.5 text-red-300" />
            <span>Summon Inquest</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Form */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6 p-6 rounded-2xl bg-[#07060a]/90 border border-stone-800/80 shadow-2xl">
          {/* Prime Suspect Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-cinzel uppercase tracking-wider text-stone-300 font-bold flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5 text-red-500" />
                <span>1. Prime Target of Indictment</span>
              </label>
              <span className="text-[10px] font-mono text-stone-500">SELECT ACCUSED</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mysteryCase.suspects.map(suspect => {
                const isSelected = hypothesis.suspectedCulpritId === suspect.id;
                return (
                  <div
                    key={suspect.id}
                    onClick={() => {
                      soundManager.playKeyType();
                      setHypothesis({ ...hypothesis, suspectedCulpritId: suspect.id });
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'bg-red-950/40 border-red-600/80 ring-1 ring-red-600 shadow-lg shadow-red-950/60'
                        : 'bg-black/50 border-stone-850 hover:border-stone-700'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-pulse" />
                    )}
                    <img
                      src={suspect.avatar}
                      alt={suspect.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-800 grayscale contrast-125 mb-2"
                    />
                    <div className="text-xs font-cinzel font-bold text-stone-200 truncate w-full">{suspect.name}</div>
                    <div className="text-[10px] text-stone-400 font-serif italic truncate w-full">{suspect.role}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motive & Method Inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-stone-300 mb-1.5 font-bold">
                2. Depraved Motive
              </label>
              <textarea
                value={hypothesis.proposedMotive}
                onChange={e => setHypothesis({ ...hypothesis, proposedMotive: e.target.value })}
                placeholder="What darkness drove the culprit? (Forbidden inheritance, blood pact, debt, ritual coverup)..."
                rows={3}
                className="w-full p-3 bg-black/60 rounded-xl border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-red-600 font-serif placeholder:italic placeholder:text-stone-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase tracking-wider text-stone-300 mb-1.5 font-bold">
                3. Sinister Execution Method
              </label>
              <textarea
                value={hypothesis.proposedMethod}
                onChange={e => setHypothesis({ ...hypothesis, proposedMethod: e.target.value })}
                placeholder="How was the horror enacted? (Vial of arsenic, forged testament, staged electrocution)..."
                rows={3}
                className="w-full p-3 bg-black/60 rounded-xl border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-red-600 font-serif placeholder:italic placeholder:text-stone-600 transition-colors"
              />
            </div>
          </div>

          {/* Supporting Evidence Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-cinzel uppercase tracking-wider text-stone-300 font-bold flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-red-500" />
                <span>4. Bound Relics & Forensic Clues ({hypothesis.supportingClueIds.length} Bound)</span>
              </label>
              <span className="text-[10px] font-mono text-stone-500">MINIMUM 2 PIECES</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {discoveredClues.map(clue => {
                const isSelected = hypothesis.supportingClueIds.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    onClick={() => handleToggleClue(clue.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-950/40 border-red-600/70 text-red-100 shadow-sm shadow-red-950/40'
                        : 'bg-black/40 border-stone-850 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="text-xs font-bold text-stone-200 truncate">{clue.name}</div>
                      <div className="text-[10px] text-stone-500 font-serif italic truncate">{clue.locationName}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="p-4 rounded-xl bg-black/40 border border-stone-850">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-cinzel uppercase tracking-wider text-stone-300 font-bold">
                5. Inquisitor Conviction
              </label>
              <span className="text-xs font-bold text-red-400 font-mono">
                {hypothesis.confidenceLevel}% Certainty
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={hypothesis.confidenceLevel}
              onChange={e => setHypothesis({ ...hypothesis, confidenceLevel: parseInt(e.target.value, 10) })}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-stone-900 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-serif italic mt-1">
              <span>Whispers of Doubt</span>
              <span>Absolute Condemnation</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Deductive Quality Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#07060a]/90 border border-stone-800 shadow-xl">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-stone-300 font-bold mb-3 flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5 text-amber-500" />
              <span>Inquest Readiness Rites</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                {hasCulprit ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className={hasCulprit ? 'text-stone-200' : 'text-stone-500'}>
                  Prime suspect condemned
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasMotive ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className={hasMotive ? 'text-stone-200' : 'text-stone-500'}>
                  Dark motive unmasked
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasMethod ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className={hasMethod ? 'text-stone-200' : 'text-stone-500'}>
                  Lethal method documented
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasEvidence ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className={hasEvidence ? 'text-stone-200' : 'text-stone-500'}>
                  At least 2 relics bound to proof
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-850">
              <button
                onClick={onOpenAccusation}
                disabled={!hasCulprit}
                className="w-full py-2.5 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 disabled:from-stone-900 disabled:to-stone-900 disabled:text-stone-600 disabled:border-stone-850 text-stone-100 font-cinzel font-bold tracking-wider rounded-xl text-xs transition-all border border-red-800/50 shadow-lg shadow-red-950/40 cursor-pointer"
              >
                Proceed to Formal Inquest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

