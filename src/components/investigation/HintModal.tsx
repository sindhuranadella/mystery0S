import React from 'react';
import { HelpCircle, Lock, Unlock, AlertTriangle, Sparkles, X } from 'lucide-react';
import { MysteryCase, ProgressiveHint } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface HintModalProps {
  mysteryCase: MysteryCase;
  unlockedHints: number[];
  onUnlockHint: (tier: number) => Promise<void>;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  mysteryCase,
  unlockedHints,
  onUnlockHint,
  onClose,
}) => {
  const hints = mysteryCase.hints || [];

  const handleUnlock = (tier: number) => {
    soundManager.playKeyType();
    onUnlockHint(tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Tiered Progressive Hint System
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 my-4 leading-relaxed">
          Stuck on a forensic trail? You may request hints. Points are transparently deducted from your final deduction score for each tier unlocked.
        </p>

        <div className="space-y-4">
          {hints.map(hint => {
            const isUnlocked = unlockedHints.includes(hint.tier);
            const canUnlock = hint.tier === 1 || unlockedHints.includes(hint.tier - 1);

            return (
              <div
                key={hint.tier}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 text-slate-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isUnlocked
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Tier {hint.tier}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{hint.title}</span>
                  </div>

                  <span className="text-[10px] font-mono text-red-400">
                    -{hint.penaltyPoints} Pts Penalty
                  </span>
                </div>

                {isUnlocked ? (
                  <p className="text-xs text-slate-300 leading-relaxed mt-2 pt-2 border-t border-slate-800/80">
                    {hint.content}
                  </p>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">
                      Focus: {hint.focusArea.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleUnlock(hint.tier)}
                      disabled={!canUnlock}
                      className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white disabled:opacity-40 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unlock Hint (-{hint.penaltyPoints} pts)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-5 border-t border-slate-800 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
