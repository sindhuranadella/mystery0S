import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  PenTool,
  Save,
  Award,
  Skull,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { User, MysteryCase, InvestigationSession } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface DetectiveJournalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  activeCase: MysteryCase | null;
  activeSession: InvestigationSession | null;
  onContinueCase?: () => void;
}

export const DetectiveJournalDrawer: React.FC<DetectiveJournalDrawerProps> = ({
  isOpen,
  onClose,
  user,
  activeCase,
  activeSession,
  onContinueCase,
}) => {
  const [scratchpad, setScratchpad] = useState(() => {
    return localStorage.getItem('mystery_journal_scratchpad') || 
      'INQUEST FIELD NOTES:\n- Verify access timestamps for Study lock\n- Cross-check high heel mud depth in garden\n- Inquire about Zurich debt telegram...';
  });
  const [activeTab, setActiveTab] = useState<'notes' | 'docket' | 'credentials' | 'rubric'>('notes');
  const [saveIndicator, setSaveIndicator] = useState(false);

  useEffect(() => {
    localStorage.setItem('mystery_journal_scratchpad', scratchpad);
  }, [scratchpad]);

  // Keyboard shortcut ESC and J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.key === 'j' || e.key === 'J') && !isOpen && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        soundManager.playKeyType();
        // Toggle journal
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleManualSave = () => {
    localStorage.setItem('mystery_journal_scratchpad', scratchpad);
    soundManager.playKeyType();
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-lg h-full bg-[#0a080d] border-l border-rose-950/80 shadow-2xl flex flex-col text-stone-200 overflow-hidden">
        {/* Leather texture grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,200,180,0.12) 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Top Journal Header with Gold Foil Styling */}
        <div className="relative z-10 px-6 py-4 border-b border-rose-950/70 bg-[#070509] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-900/60 to-rose-950 border border-amber-800/60 flex items-center justify-center text-amber-300 shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-cinzel font-bold text-stone-100 flex items-center gap-2">
                <span>Field Journal</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-900/60">
                  CONFIDENTIAL
                </span>
              </h3>
              <p className="text-[10px] font-mono text-stone-500">
                OFFICIAL OCCULT BUREAU LOGBOOK · PRESS [ESC] TO CLOSE
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playKeyType();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="relative z-10 px-6 py-2.5 bg-black/40 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto text-xs font-cinzel">
          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveTab('notes');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'notes'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Inquisitor Scratchpad
          </button>
          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveTab('docket');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'docket'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Active Docket
          </button>
          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveTab('credentials');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'credentials'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Credentials
          </button>
          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveTab('rubric');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'rubric'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/60 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Scoring Rubric
          </button>
        </div>

        {/* Tab Contents */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB: SCRATCHPAD */}
          {activeTab === 'notes' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-stone-400 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-rose-400" />
                  Freeform Detective Scratchpad
                </span>
                <button
                  onClick={handleManualSave}
                  className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
                >
                  <Save className="w-3 h-3 text-rose-400" />
                  <span>{saveIndicator ? 'Saved!' : 'Save'}</span>
                </button>
              </div>

              <textarea
                value={scratchpad}
                onChange={(e) => setScratchpad(e.target.value)}
                placeholder="Record rapid observations, suspect inconsistencies, or timestamps..."
                className="flex-1 w-full p-4 rounded-xl bg-black/60 border border-rose-950/80 text-xs font-mono text-stone-300 leading-relaxed focus:outline-none focus:border-rose-700/80 resize-none selection:bg-rose-950"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(transparent, transparent 23px, rgba(136,19,55,0.15) 24px)'
                }}
              />
              <div className="text-[10px] font-mono text-stone-500">
                Notes persist locally across cases and investigation sessions.
              </div>
            </div>
          )}

          {/* TAB: ACTIVE DOCKET */}
          {activeTab === 'docket' && (
            <div className="space-y-4">
              {activeCase ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-950 border border-rose-950/80">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
                      Currently Assigned Crime
                    </span>
                    <h4 className="text-base font-cinzel font-bold text-stone-100">{activeCase.title}</h4>
                    <p className="text-xs text-stone-400 mt-1 font-serif">{activeCase.tagline}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-stone-500">
                      <span>{activeCase.location}</span>
                      <span>·</span>
                      <span>{activeCase.difficulty}</span>
                    </div>
                  </div>

                  {activeSession && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-black/50 border border-stone-800">
                        <div className="text-[10px] text-stone-500 font-mono">Forensic Relics</div>
                        <div className="text-sm font-bold text-stone-200 mt-0.5">
                          {activeSession.discoveredClueIds.length} / {activeCase.clues.length} Cataloged
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-black/50 border border-stone-800">
                        <div className="text-[10px] text-stone-500 font-mono">Suspect Interrogations</div>
                        <div className="text-sm font-bold text-rose-400 mt-0.5">
                          {Object.keys(activeSession.dialogueHistory).length} / {activeCase.suspects.length} Examined
                        </div>
                      </div>
                    </div>
                  )}

                  {onContinueCase && (
                    <button
                      onClick={() => {
                        soundManager.playKeyType();
                        onClose();
                        onContinueCase();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 text-white text-xs font-cinzel font-bold border border-rose-700/60 shadow-lg transition-all"
                    >
                      <Compass className="w-4 h-4 text-rose-300" />
                      <span>Resume Crime Scene Investigation</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-stone-500 font-serif">
                  No active case docket underway. Select a case from the Archives to begin.
                </div>
              )}
            </div>
          )}

          {/* TAB: CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-900/40 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-stone-900 border border-amber-700/60 flex items-center justify-center text-amber-400 text-2xl font-cinzel font-bold shadow-inner">
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-base font-cinzel font-bold text-stone-100">{user.username}</h4>
                    <div className="text-xs text-amber-400 font-mono mt-0.5">
                      Scotland Yard Occult Bureau
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">ID: {user.id}</div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-800/80 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-stone-500 text-[10px]">Rank</span>
                    <div className="text-stone-200 font-bold">{user.rank}</div>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px]">Experience</span>
                    <div className="text-rose-400 font-bold">{user.experiencePoints} XP</div>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px]">Cases Solved</span>
                    <div className="text-stone-200 font-bold">{user.casesCompleted}</div>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px]">Average Deduction</span>
                    <div className="text-emerald-400 font-bold">{user.averageScore} / 100</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-between font-mono font-bold text-stone-200 mb-1">
                  <span>Culprit Identification</span>
                  <span className="text-rose-400">30 Points</span>
                </div>
                <p className="text-[11px] text-stone-400 font-serif">
                  Naming the verified perpetrator responsible for executing the crime.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-between font-mono font-bold text-stone-200 mb-1">
                  <span>Forensic Evidence Support</span>
                  <span className="text-rose-400">25 Points</span>
                </div>
                <p className="text-[11px] text-stone-400 font-serif">
                  Selecting verified physical traces, electronic access logs, or lab specimens.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-between font-mono font-bold text-stone-200 mb-1">
                  <span>Chronological Sequence</span>
                  <span className="text-rose-400">15 Points</span>
                </div>
                <p className="text-[11px] text-stone-400 font-serif">
                  Aligning key incident moments in verified chronological order.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex items-center justify-between font-mono font-bold text-stone-200 mb-1">
                  <span>Motive & Method Verification</span>
                  <span className="text-rose-400">30 Points</span>
                </div>
                <p className="text-[11px] text-stone-400 font-serif">
                  15 points for verified financial/personal motive; 15 points for execution mechanism.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
