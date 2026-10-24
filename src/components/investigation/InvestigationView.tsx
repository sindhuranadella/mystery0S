import React, { useState } from 'react';
import {
  Compass,
  MessageSquare,
  Network,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  Gavel,
  HelpCircle,
  ArrowLeft,
  Skull,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  MysteryCase,
  InvestigationSession,
  Clue,
  PersonalNote,
  EvidenceLink,
  DialogueMessage,
  PlayerTimelineEntry,
  Hypothesis,
  AccusationSubmission,
  ScoreReport,
  VerifiedSolution
} from '../../types/mystery';
import { SceneExplorer } from './SceneExplorer';
import { InterrogationTerminal } from './InterrogationTerminal';
import { InteractiveEvidenceBoard } from './InteractiveEvidenceBoard';
import { TimelineReconstruction } from './TimelineReconstruction';
import { ContradictionTracker } from './ContradictionTracker';
import { EvidenceNotebook } from './EvidenceNotebook';
import { HypothesisWorkspace } from './HypothesisWorkspace';
import { HintModal } from './HintModal';
import { AccusationModal } from './AccusationModal';
import { CaseReportModal } from './CaseReportModal';

interface InvestigationViewProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onBackToCases: () => void;
  onInspectObject: (locationId: string, objectId: string) => Promise<{
    inspectMessage: string;
    newlyDiscoveredClue: Clue | null;
    locked?: boolean;
    message?: string;
  }>;
  onExploreLocation: (locationId: string) => void;
  onSendMessage: (suspectId: string, question: string) => Promise<DialogueMessage>;
  onAddLink: (link: Omit<EvidenceLink, 'id'>) => Promise<void>;
  onRemoveLink: (linkId: string) => Promise<void>;
  onSavePositions: (positions: Record<string, { x: number; y: number }>) => void;
  onSaveTimeline: (timeline: PlayerTimelineEntry[]) => void;
  onAddNote: (note: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateNote: (noteId: string, updates: Partial<PersonalNote>) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onSaveHypothesis: (hypo: Hypothesis) => void;
  onUnlockHint: (tier: number) => Promise<void>;
  onSubmitAccusation: (submission: AccusationSubmission) => Promise<{
    report: ScoreReport;
    verifiedSolution: VerifiedSolution;
  }>;
  onReplay: () => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  mysteryCase,
  session,
  onBackToCases,
  onInspectObject,
  onExploreLocation,
  onSendMessage,
  onAddLink,
  onRemoveLink,
  onSavePositions,
  onSaveTimeline,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onSaveHypothesis,
  onUnlockHint,
  onSubmitAccusation,
  onReplay,
}) => {
  const [activeTab, setActiveTab] = useState<
    'scenes' | 'interrogate' | 'board' | 'timeline' | 'contradictions' | 'notebook' | 'hypothesis'
  >('scenes');

  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [accusationModalOpen, setAccusationModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [lastReport, setLastReport] = useState<ScoreReport | null>(session.finalReport || null);
  const [lastSolution, setLastSolution] = useState<VerifiedSolution | null>(null);

  const handleAccusationSubmit = async (submission: AccusationSubmission) => {
    const res = await onSubmitAccusation(submission);
    setLastReport(res.report);
    setLastSolution(res.verifiedSolution);
    setAccusationModalOpen(false);
    setReportModalOpen(true);
  };

  const handleSelectSuspectFromContradiction = (suspectId: string) => {
    setActiveTab('interrogate');
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 text-stone-200">
      {/* Subtle Criminal Case Ambient Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src={mysteryCase.coverImage}
          alt={mysteryCase.title}
          className="w-full h-full object-cover opacity-[0.08] filter contrast-150 brightness-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070a] via-[#06070a]/80 to-[#06070a]" />
      </div>

      {/* Top Bar with Case Meta & Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-950/95 border border-rose-950/70 shadow-2xl mb-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCases}
            className="p-2 rounded-xl bg-stone-900 hover:bg-rose-950 text-stone-300 hover:text-white transition-all border border-stone-800"
            title="Back to Case Archives"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-cinzel font-bold text-stone-100">{mysteryCase.title}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-900/60">
                {mysteryCase.difficulty}
              </span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5 font-serif">{mysteryCase.location}</div>
          </div>
        </div>

        {/* Real-time Case Progress Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">
            Relics Discovered: <strong className="text-rose-400">{session.discoveredClueIds.length}</strong> / {mysteryCase.clues.length}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">
            Rooms Explored: <strong className="text-stone-200">{session.exploredLocationIds.length}</strong> / {mysteryCase.locations.length}
          </div>

          {/* Hint Trigger Button */}
          <button
            onClick={() => setHintModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/80 text-amber-300 border border-amber-900/50 transition-all font-semibold font-cinzel"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Occult Hints ({session.unlockedHints.length}/3)</span>
          </button>

          {/* Final Accusation Button */}
          <button
            onClick={() => setAccusationModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 border border-rose-700/60 text-white font-cinzel font-bold transition-all shadow-lg"
          >
            <Gavel className="w-3.5 h-3.5 text-rose-300" />
            <span>Formal Inquest</span>
          </button>
        </div>
      </div>

      {/* Investigation Sub-navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-rose-950/40">
        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'scenes'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Crime Scenes</span>
        </button>

        <button
          onClick={() => setActiveTab('interrogate')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'interrogate'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Interrogation Cell</span>
        </button>

        <button
          onClick={() => setActiveTab('board')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'board'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Evidence Board ({session.evidenceLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'timeline'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline of Dread</span>
        </button>

        <button
          onClick={() => setActiveTab('contradictions')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'contradictions'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Contradictions</span>
        </button>

        <button
          onClick={() => setActiveTab('notebook')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'notebook'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Autopsy Dossier ({session.personalNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hypothesis')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold shrink-0 transition-all ${
            activeTab === 'hypothesis'
              ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Hypothesis Crucible</span>
        </button>
      </div>

      {/* Active Panel View */}
      <div>
        {activeTab === 'scenes' && (
          <SceneExplorer
            mysteryCase={mysteryCase}
            session={session}
            onInspectObject={onInspectObject}
            onExploreLocation={onExploreLocation}
          />
        )}

        {activeTab === 'interrogate' && (
          <InterrogationTerminal
            mysteryCase={mysteryCase}
            session={session}
            onSendMessage={onSendMessage}
          />
        )}

        {activeTab === 'board' && (
          <InteractiveEvidenceBoard
            mysteryCase={mysteryCase}
            session={session}
            onAddLink={onAddLink}
            onRemoveLink={onRemoveLink}
            onSavePositions={onSavePositions}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineReconstruction
            mysteryCase={mysteryCase}
            session={session}
            onSaveTimeline={onSaveTimeline}
          />
        )}

        {activeTab === 'contradictions' && (
          <ContradictionTracker
            mysteryCase={mysteryCase}
            session={session}
            onSelectSuspect={handleSelectSuspectFromContradiction}
          />
        )}

        {activeTab === 'notebook' && (
          <EvidenceNotebook
            mysteryCase={mysteryCase}
            session={session}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onDeleteNote={onDeleteNote}
          />
        )}

        {activeTab === 'hypothesis' && (
          <HypothesisWorkspace
            mysteryCase={mysteryCase}
            session={session}
            onSaveHypothesis={onSaveHypothesis}
            onOpenAccusation={() => setAccusationModalOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      {hintModalOpen && (
        <HintModal
          mysteryCase={mysteryCase}
          unlockedHints={session.unlockedHints}
          onUnlockHint={onUnlockHint}
          onClose={() => setHintModalOpen(false)}
        />
      )}

      {accusationModalOpen && (
        <AccusationModal
          mysteryCase={mysteryCase}
          session={session}
          onClose={() => setAccusationModalOpen(false)}
          onSubmitAccusation={handleAccusationSubmit}
        />
      )}

      {reportModalOpen && lastReport && (
        <CaseReportModal
          mysteryCase={mysteryCase}
          report={lastReport}
          verifiedSolution={lastSolution || mysteryCase.verifiedSolution}
          onClose={() => setReportModalOpen(false)}
          onReplay={() => {
            setReportModalOpen(false);
            onReplay();
          }}
          onBackToLibrary={() => {
            setReportModalOpen(false);
            onBackToCases();
          }}
        />
      )}
    </div>
  );
};
