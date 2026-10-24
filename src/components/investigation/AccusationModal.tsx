import React, { useState } from 'react';
import {
  Gavel,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  Skull,
  Flame
} from 'lucide-react';
import { MysteryCase, InvestigationSession, AccusationSubmission } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface AccusationModalProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onClose: () => void;
  onSubmitAccusation: (submission: AccusationSubmission) => Promise<void>;
}

export const AccusationModal: React.FC<AccusationModalProps> = ({
  mysteryCase,
  session,
  onClose,
  onSubmitAccusation,
}) => {
  const [suspectId, setSuspectId] = useState<string>(
    session.hypothesis?.suspectedCulpritId || mysteryCase.suspects[0]?.id || ''
  );
  const [motive, setMotive] = useState<string>(session.hypothesis?.proposedMotive || '');
  const [method, setMethod] = useState<string>(session.hypothesis?.proposedMethod || '');
  const [supportingClues, setSupportingClues] = useState<string[]>(
    session.hypothesis?.supportingClueIds || []
  );
  const [reasoning, setReasoning] = useState<string>(session.hypothesis?.notes || '');
  const [submitting, setSubmitting] = useState(false);

  const discoveredClues = mysteryCase.clues.filter(c => session.discoveredClueIds.includes(c.id));

  const toggleClue = (id: string) => {
    soundManager.playKeyType();
    setSupportingClues(prev => (prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectId || submitting) return;

    setSubmitting(true);
    soundManager.playKeyType();

    const timelineOrder = session.playerTimeline
      ? session.playerTimeline.map(t => t.eventId)
      : mysteryCase.timelineEvents.map(e => e.id);

    try {
      await onSubmitAccusation({
        suspectId,
        motive,
        method,
        supportingClueIds: supportingClues,
        timelineOrdering: timelineOrder,
        writtenReasoning: reasoning
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-stone-950 border border-rose-950/80 shadow-2xl p-6 sm:p-8 my-8 text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-stone-100">
                The Grand Inquest & Formal Indictment
              </h3>
              <div className="text-[11px] text-stone-400 font-serif">Case Docket: {mysteryCase.title}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-6 space-y-6 text-xs">
          {/* Scoring Notice */}
          <div className="p-3.5 rounded-xl bg-stone-900 border border-rose-950 text-stone-300 leading-relaxed flex items-start gap-2.5 font-serif">
            <Flame className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-cinzel font-bold text-rose-300">Deterministic 100-Point Rubric:</span> Culprit (30 pts), Motive (15 pts), Method (15 pts), Supporting Forensic Relics (25 pts), and Timeline (15 pts). Lucky guesses yield zero.
            </div>
          </div>

          {/* Suspect Selection */}
          <div>
            <label className="block font-mono uppercase text-stone-400 font-semibold mb-2">
              1. Indict the Primary Perpetrator
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mysteryCase.suspects.map(suspect => {
                const isSelected = suspectId === suspect.id;
                return (
                  <div
                    key={suspect.id}
                    onClick={() => {
                      soundManager.playKeyType();
                      setSuspectId(suspect.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center ${
                      isSelected
                        ? 'bg-rose-950/80 border-rose-600 ring-1 ring-rose-500 shadow-xl'
                        : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <img
                      src={suspect.avatar}
                      alt={suspect.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-800 grayscale mb-2"
                    />
                    <div className="font-cinzel font-bold text-stone-200 truncate w-full">{suspect.name}</div>
                    <div className="text-[10px] text-stone-500 truncate w-full font-serif">{suspect.role}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motive & Method */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono uppercase text-stone-400 font-semibold mb-1">
                2. Inquest: Proposed Motive
              </label>
              <textarea
                value={motive}
                onChange={e => setMotive(e.target.value)}
                placeholder="State the underlying greed, debt, or dark intent..."
                rows={3}
                required
                className="w-full p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-stone-400 font-semibold mb-1">
                3. Inquest: Modus Operandi (Method)
              </label>
              <textarea
                value={method}
                onChange={e => setMethod(e.target.value)}
                placeholder="Detail how the vault was breached or the crime executed..."
                rows={3}
                required
                className="w-full p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
              />
            </div>
          </div>

          {/* Supporting Evidence */}
          <div>
            <label className="block font-mono uppercase text-stone-400 font-semibold mb-2">
              4. Forensic Relics Pinned to Indictment ({supportingClues.length} Selected)
            </label>
            <div className="grid sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-stone-900/60 rounded-xl border border-stone-800 font-serif">
              {discoveredClues.map(clue => {
                const isSelected = supportingClues.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    onClick={() => toggleClue(clue.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="truncate mr-2 font-medium">{clue.name}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Written Deductive Reasoning */}
          <div>
            <label className="block font-mono uppercase text-stone-400 font-semibold mb-1">
              5. Final Deductive Inquest Argument
            </label>
            <textarea
              value={reasoning}
              onChange={e => setReasoning(e.target.value)}
              placeholder="Present your final synthesis explaining how the suspect's sworn alibi was dismantled..."
              rows={3}
              className="w-full p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 font-mono"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !suspectId}
              className="px-6 py-2.5 bg-gradient-to-r from-red-950 via-rose-900 to-stone-900 hover:from-red-900 hover:to-rose-800 disabled:opacity-40 text-white font-cinzel font-bold rounded-xl border border-rose-800/60 shadow-xl flex items-center gap-2"
            >
              <Gavel className="w-4 h-4 text-rose-300" />
              <span>{submitting ? 'Deliberating...' : 'Deliver Verdict'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
