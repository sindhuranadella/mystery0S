import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Shield,
  Zap,
  FolderOpen,
  Skull,
  Flame
} from 'lucide-react';
import { MysteryCase, ScoreReport, VerifiedSolution } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface CaseReportModalProps {
  mysteryCase: MysteryCase;
  report: ScoreReport;
  verifiedSolution: VerifiedSolution;
  onClose: () => void;
  onReplay: () => void;
  onBackToLibrary: () => void;
}

export const CaseReportModal: React.FC<CaseReportModalProps> = ({
  mysteryCase,
  report,
  verifiedSolution,
  onClose,
  onReplay,
  onBackToLibrary,
}) => {
  useEffect(() => {
    if (report.isSolved) {
      soundManager.playCaseSolved();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [report.isSolved]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-stone-950 border border-rose-950/80 shadow-2xl p-6 sm:p-8 my-8 text-stone-200">
        {/* Header Banner */}
        <div className="text-center pb-6 border-b border-stone-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs font-mono text-stone-400 mb-3">
            <Skull className="w-3.5 h-3.5 text-rose-500" />
            <span>Coroner Clearance & Inquest Verdict</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-cinzel font-extrabold tracking-tight text-stone-100">
            Case Closed: {mysteryCase.title}
          </h2>

          <div className="mt-3 flex items-center justify-center gap-3 font-mono">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                report.isSolved
                  ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                  : 'bg-stone-900 text-stone-400 border-stone-800'
              }`}
            >
              {report.isSolved ? 'Verdict: Indictment Affirmed' : 'Verdict: Inquest Flawed'}
            </span>
            <span className="text-xs text-stone-400">
              Score: <strong className="text-stone-100 text-base">{report.totalScore}</strong> / 100
            </span>
          </div>
        </div>

        {/* 100-Point Score Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Culprit (30)</div>
            <div className={`text-base font-cinzel font-bold mt-0.5 ${report.culpritScore > 0 ? 'text-rose-400' : 'text-stone-600'}`}>
              +{report.culpritScore}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Motive (15)</div>
            <div className={`text-base font-cinzel font-bold mt-0.5 ${report.motiveScore > 0 ? 'text-stone-200' : 'text-stone-600'}`}>
              +{report.motiveScore}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Method (15)</div>
            <div className={`text-base font-cinzel font-bold mt-0.5 ${report.methodScore > 0 ? 'text-stone-200' : 'text-stone-600'}`}>
              +{report.methodScore}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Relics (25)</div>
            <div className="text-base font-cinzel font-bold text-amber-400 mt-0.5">
              +{report.evidenceScore}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-center">
            <div className="text-[10px] font-mono text-stone-500 uppercase">Timeline (15)</div>
            <div className="text-base font-cinzel font-bold text-sky-400 mt-0.5">
              +{report.timelineScore}
            </div>
          </div>
        </div>

        {/* Penalty details if hints used */}
        {report.hintDeductions > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono text-center mb-6">
            Hint Penalty Applied: -{report.hintDeductions} pts ({report.hintsUsedCount} hint{report.hintsUsedCount > 1 ? 's' : ''} requested)
          </div>
        )}

        {/* The Official Forensic Truth Narrative */}
        <div className="space-y-4 text-xs leading-relaxed mb-6 font-serif">
          <div className="p-4 rounded-xl bg-stone-900 border border-rose-950/80">
            <div className="font-cinzel font-bold text-rose-300 mb-1 tracking-wider text-[11px]">
              The Unmasked Truth & Forensic Breakdown
            </div>
            <p className="text-stone-300 leading-relaxed mb-3">
              {verifiedSolution.solutionNarrative}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-stone-800 text-[11px] font-sans">
              <div>
                <span className="text-stone-400 block font-mono">True Perpetrator:</span>
                <span className="font-cinzel font-bold text-rose-400 text-sm">{verifiedSolution.culpritName}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-mono">Verified Motive:</span>
                <span className="text-stone-200 font-serif">{verifiedSolution.motive}</span>
              </div>
            </div>
          </div>

          {/* Missed Clues or Educational Improvement */}
          {report.missedClues.length > 0 && (
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400">
              <span className="font-bold text-amber-400">Unexamined Crucial Traces: </span>
              {report.missedClues.join(', ')}
            </div>
          )}

          {/* Unlocked Achievements */}
          {report.unlockedAchievements.length > 0 && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/50 to-stone-900 border border-rose-900/40 text-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="font-cinzel font-bold">Inquisitor Honors: +{report.xpAwarded} Experience Points</span>
              </div>
              <span className="text-[10px] font-mono uppercase text-stone-400">Rank: {report.newRank}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-800">
          <button
            onClick={onReplay}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-cinzel font-semibold flex items-center justify-center gap-2 border border-stone-800"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-open Docket
          </button>

          <button
            onClick={onBackToLibrary}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 border border-rose-800/60 text-white font-cinzel font-bold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <FolderOpen className="w-3.5 h-3.5" /> Next Crime File
          </button>
        </div>
      </div>
    </div>
  );
};
