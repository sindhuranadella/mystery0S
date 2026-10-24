import React from 'react';
import { AlertTriangle, CheckCircle2, Lock, ArrowRight, ShieldAlert, Skull } from 'lucide-react';
import { MysteryCase, InvestigationSession, ContradictionRule } from '../../types/mystery';
import { evaluateCaseContradictions } from '../../services/contradictionEngine';

interface ContradictionTrackerProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onSelectSuspect: (suspectId: string) => void;
}

export const ContradictionTracker: React.FC<ContradictionTrackerProps> = ({
  mysteryCase,
  session,
  onSelectSuspect,
}) => {
  const { activeContradictions, pendingContradictionsCount, allEvaluations } =
    evaluateCaseContradictions(mysteryCase, session);

  return (
    <div className="space-y-6 text-stone-200">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-cinzel font-bold text-stone-100">
              Contradiction & Deception Hub
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 max-w-xl font-serif">
            Suspect lies cannot survive against physical records, biometric timestamps, and footprint treads.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-bold">
            {activeContradictions.length} Verified Falsehoods
          </div>
          {pendingContradictionsCount > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-500 text-xs">
              {pendingContradictionsCount} Hidden Leads Pending
            </div>
          )}
        </div>
      </div>

      {/* Contradiction Cards Grid */}
      <div className="space-y-4">
        {allEvaluations.map((evalItem) => {
          const { rule, isTriggered, missingPrerequisiteClueName, supportingClueName } = evalItem;
          const suspect = mysteryCase.suspects.find(s => s.id === rule.suspectId);

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all ${
                isTriggered
                  ? 'bg-stone-950 border-red-500/60 shadow-2xl shadow-red-950/20'
                  : 'bg-stone-950/50 border-stone-900 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isTriggered
                        ? 'bg-red-950 text-red-400 border border-red-600/50'
                        : 'bg-stone-900 text-stone-600'
                    }`}
                  >
                    {isTriggered ? <Skull className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </span>

                  <div>
                    <h4 className="text-sm font-cinzel font-bold text-stone-100">{rule.title}</h4>
                    <span className="text-[11px] text-rose-400 font-mono">
                      Suspect: {rule.suspectName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                      isTriggered
                        ? 'bg-red-950 text-red-300 border-red-700'
                        : 'bg-stone-900 text-stone-500 border-stone-800'
                    }`}
                  >
                    {isTriggered ? 'Confirmed Falsehood' : 'Requires Physical Proof'}
                  </span>
                </div>
              </div>

              {isTriggered ? (
                <div className="space-y-3 pt-2 text-xs">
                  {/* Claimed statement */}
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-serif">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
                      Suspect's Sworn Testimony
                    </span>
                    <p className="italic">"{rule.claimedStatement}"</p>
                  </div>

                  {/* Why it contradicts */}
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-stone-300 font-serif">
                    <span className="text-[10px] font-mono uppercase text-red-400 block mb-1">
                      Forensic Inconsistency Analysis
                    </span>
                    <p className="leading-relaxed">{rule.explanation}</p>
                  </div>

                  {/* Supporting Evidence Citation & Suggested Follow Up */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-800">
                    <div className="text-[11px] text-rose-400 font-mono flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Refuted by: {supportingClueName}</span>
                    </div>

                    {suspect && (
                      <button
                        onClick={() => onSelectSuspect(suspect.id)}
                        className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-rose-950 text-stone-300 hover:text-white border border-stone-800 text-xs font-cinzel font-semibold transition-all flex items-center gap-1.5"
                      >
                        <span>Confront {suspect.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-xs text-stone-500 flex items-center gap-2 font-serif">
                  <Lock className="w-3.5 h-3.5 text-stone-600" />
                  <span>
                    Investigate more crime scenes to unmask proof for: "{missingPrerequisiteClueName}".
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
