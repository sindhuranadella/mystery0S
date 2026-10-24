import React from 'react';
import {
  Compass,
  Award,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Flame,
  Skull
} from 'lucide-react';
import { User, MysteryCase, InvestigationSession, Achievement } from '../types/mystery';
import { ACHIEVEMENTS_LIST } from '../data/seedCases';

interface DashboardProps {
  user: User;
  allCases: MysteryCase[];
  activeSession: InvestigationSession | null;
  onOpenCase: (caseId: string) => void;
  onResumeSession: () => void;
  onOpenCreator: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  allCases,
  activeSession,
  onOpenCase,
  onResumeSession,
  onOpenCreator,
}) => {
  const activeCase = activeSession ? allCases.find(c => c.id === activeSession.caseId) : null;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 text-stone-200">
      {/* Subtle Criminal Sanctum Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80"
          alt="Sanctum Ambience"
          className="w-full h-full object-cover opacity-[0.05] filter contrast-150 brightness-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070a] via-[#06070a]/85 to-[#06070a]" />
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-950 via-[#0a080d] to-rose-950/40 border border-rose-950/60 p-6 sm:p-8 mb-8 shadow-2xl">
        {/* Subtle Police Tape Hazard Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-700 via-amber-500 to-rose-900 opacity-60" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-950 border border-rose-900/40 text-rose-300 text-xs font-mono mb-2">
              <Skull className="w-3.5 h-3.5 text-rose-500" />
              <span>Inquest Bureau #{user.id.slice(-6).toUpperCase()} · Active Docket</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-cinzel font-bold tracking-tight text-stone-100">
              Inquisitor {user.username}'s Sanctum
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl font-serif">
              The shadows hold the truth. Review confidential autopsy records, cross-examine suspects in cold blood, and deliver verified indictments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {activeCase && (
              <button
                onClick={onResumeSession}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-950 via-rose-950 to-stone-900 hover:from-red-900 hover:to-rose-900 text-rose-100 rounded-xl text-xs font-cinzel font-bold shadow-lg shadow-black border border-rose-800/60 transition-all hover:scale-[1.02]"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Resume: {activeCase.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenCreator}
              className="px-4 py-2.5 bg-stone-950 hover:bg-stone-900 text-stone-300 rounded-xl text-xs font-cinzel font-semibold border border-stone-800 hover:border-rose-900/60 transition-all"
            >
              Draft Dark Mystery
            </button>
          </div>
        </div>
      </div>

      {/* Forensic Performance Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400 uppercase">Inquisitor Rank</div>
          <div className="text-lg font-cinzel font-bold text-amber-400 mt-1">{user.rank}</div>
          <div className="text-[10px] text-stone-500 font-mono mt-0.5">{user.experiencePoints} Total XP</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400 uppercase">Cases Solved</div>
          <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
            {user.casesCompleted} <span className="text-xs text-stone-500">/ {user.casesAttempted}</span>
          </div>
          <div className="text-[10px] text-stone-500 font-serif mt-0.5">Verified Accusations</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400 uppercase">Relics Logged</div>
          <div className="text-lg font-bold text-rose-400 mt-1 font-mono">{user.totalEvidenceDiscovered}</div>
          <div className="text-[10px] text-stone-500 font-serif mt-0.5">Physical Traces</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400 uppercase">Average Score</div>
          <div className="text-lg font-bold text-stone-200 mt-1 font-mono">{user.averageScore || 88}/100</div>
          <div className="text-[10px] text-stone-500 font-serif mt-0.5">Deduction Rigor</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400 uppercase">Occult Badges</div>
          <div className="text-lg font-bold text-purple-400 mt-1 font-mono">
            {user.achievements.length} <span className="text-xs text-stone-500">/ {ACHIEVEMENTS_LIST.length}</span>
          </div>
          <div className="text-[10px] text-stone-500 font-serif mt-0.5">Badges Unlocked</div>
        </div>

        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-mono text-stone-400 uppercase">Accuracy Rate</div>
          <div className="text-lg font-bold text-sky-400 mt-1 font-mono">
            {user.casesAttempted > 0 ? Math.round((user.casesCompleted / user.casesAttempted) * 100) : 100}%
          </div>
          <div className="text-[10px] text-stone-500 font-serif mt-0.5">Clearance Ratio</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Active Investigation & Cases */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Case Card if any */}
          {activeCase && activeSession && (
            <div className="p-6 rounded-2xl bg-stone-950 border border-rose-900/60 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono uppercase text-rose-400 font-semibold tracking-wider">
                    Inquest in Progress
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  Began {new Date(activeSession.startedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={activeCase.coverImage}
                  alt={activeCase.title}
                  className="w-full sm:w-44 h-28 object-cover rounded-xl border border-stone-800 brightness-75 contrast-125"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-cinzel font-bold text-stone-100">{activeCase.title}</h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2 font-serif">{activeCase.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-300 font-mono">
                    <div>
                      Relics: <span className="font-bold text-rose-400">{activeSession.discoveredClueIds.length}</span> / {activeCase.clues.length}
                    </div>
                    <div>
                      Rooms Explored: <span className="font-bold text-stone-200">{activeSession.exploredLocationIds.length}</span> / {activeCase.locations.length}
                    </div>
                    <div>
                      Hints Used: <span className="font-bold text-amber-500">{activeSession.unlockedHints.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={onResumeSession}
                      className="px-4 py-2 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 text-rose-100 border border-rose-800/60 rounded-lg text-xs font-cinzel font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5" /> Continue Inquest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Mystery Cases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-cinzel font-bold text-stone-100">Confidential Case Dockets</h3>
                <p className="text-xs text-stone-400 font-serif">Selected cases suited for your current investigative clearance.</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {allCases.map(c => {
                const isCurrent = activeSession?.caseId === c.id;
                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                        <span className="font-mono text-rose-400">{c.crimeCategory}</span>
                        <span className="text-[10px] font-mono text-amber-400">
                          {c.difficulty}
                        </span>
                      </div>
                      <h4 className="text-base font-cinzel font-bold text-stone-100 group-hover:text-rose-300 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2 font-serif">{c.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500 font-mono">
                        {c.locations.length} Locations · {c.suspects.length} Suspects
                      </span>
                      <button
                        onClick={() => onOpenCase(c.id)}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 text-stone-300 hover:bg-rose-950 hover:text-rose-200 border border-stone-800 text-xs font-cinzel font-semibold transition-all flex items-center gap-1"
                      >
                        {isCurrent ? 'Resume' : 'Examine'} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Investigator Accolades */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-cinzel font-bold text-stone-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Inquisitor Relics & Honors
              </h3>
              <span className="text-xs font-mono text-stone-500">
                {user.achievements.length} / {ACHIEVEMENTS_LIST.length}
              </span>
            </div>

            <div className="space-y-3">
              {ACHIEVEMENTS_LIST.map(ach => {
                const isUnlocked = user.achievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-stone-900/80 border-amber-900/40 text-stone-200'
                        : 'bg-stone-950 border-stone-900 text-stone-600 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-950/60 border border-amber-800/50 text-amber-400'
                          : 'bg-stone-900 border border-stone-800 text-stone-600'
                      }`}
                    >
                      {isUnlocked ? <Zap className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate font-cinzel">{ach.title}</span>
                        <span className="text-[10px] font-mono text-amber-400/80">+{ach.xpValue} XP</span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5 font-serif">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Horror Advice Card */}
          <div className="p-5 rounded-2xl bg-[#09080d] border border-rose-950/60 text-xs text-stone-300">
            <div className="font-cinzel font-bold text-rose-300 mb-1 flex items-center gap-2">
              <Skull className="w-4 h-4 text-rose-500" />
              Inquest Doctrine
            </div>
            <p className="text-stone-400 leading-relaxed font-serif">
              Liars always leave physical trails. When interviewing suspects, present the exact card swipe timestamps or mud tread patterns. If they stammer, you have struck the nerve of the crime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
