import React from 'react';
import { Skull, Volume2, VolumeX, FolderOpen, Compass, PenTool, User as UserIcon, Flame, Sparkles } from 'lucide-react';
import { User, DetectiveRank } from '../types/mystery';
import { soundManager } from '../services/audioAmbiance';

interface NavbarProps {
  user: User;
  activeView: 'landing' | 'cases' | 'dashboard' | 'investigation' | 'creator' | 'lab';
  setActiveView: (view: 'landing' | 'cases' | 'dashboard' | 'investigation' | 'creator' | 'lab') => void;
  onOpenProfile: () => void;
  onOpenJournal: () => void;
  hasActiveInvestigation: boolean;
  onContinueActiveCase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  setActiveView,
  onOpenProfile,
  onOpenJournal,
  hasActiveInvestigation,
  onContinueActiveCase,
}) => {
  const [muted, setMuted] = React.useState(soundManager.isMuted);

  const toggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
  };

  const getRankBadgeClass = (rank: DetectiveRank) => {
    switch (rank) {
      case 'Master Detective':
        return 'text-amber-400 border-amber-900/60 bg-amber-950/30';
      case 'Senior Detective':
        return 'text-rose-400 border-rose-900/60 bg-rose-950/30';
      case 'Detective':
        return 'text-red-400 border-red-900/60 bg-red-950/30';
      case 'Investigator':
        return 'text-stone-300 border-stone-800 bg-stone-900/40';
      default:
        return 'text-stone-400 border-stone-800 bg-stone-950/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050609]/90 border-b border-rose-950/50 text-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-b from-stone-900 via-rose-950 to-black border border-rose-900/40 shadow-lg shadow-black group-hover:border-rose-600/60 transition-all">
            <Skull className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold tracking-widest text-base sm:text-lg text-rose-100 group-hover:text-rose-300 transition-colors">
                MysteryOS
              </span>
              <span className="text-[10px] font-mono text-rose-500/80 uppercase">
                Occult Dossier
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links: Clean typographic links with zero pills */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-cinzel tracking-wider">
          <button
            onClick={() => setActiveView('landing')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'landing' ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sanctum
          </button>
          <button
            onClick={() => setActiveView('cases')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'cases' ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Case Archives
          </button>
          <button
            onClick={() => setActiveView('lab')}
            className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'lab' ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Forensic Lab</span>
            <span className="text-[9px] font-mono px-1 rounded bg-red-950/80 text-rose-300 border border-red-800">
              NEW
            </span>
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'dashboard' ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Investigator Desk
          </button>
          <button
            onClick={() => setActiveView('creator')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'creator' ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Creator Crypt
          </button>
        </nav>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {hasActiveInvestigation && (
            <button
              onClick={onContinueActiveCase}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 text-rose-100 border border-rose-800/60 rounded-lg text-xs font-semibold shadow-md shadow-black transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Resume Active Inquest</span>
            </button>
          )}

          {/* Quick-Slide Field Journal Button */}
          <button
            onClick={() => {
              soundManager.playKeyType();
              onOpenJournal();
            }}
            title="Open Inquisitor Field Journal [Press J]"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-700/80 text-stone-300 hover:text-amber-300 text-xs font-cinzel font-semibold transition-all shadow-md group"
          >
            <PenTool className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Journal</span>
            <span className="text-[9px] font-mono text-stone-500 hidden md:inline">[J]</span>
          </button>

          {/* Horror Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={muted ? 'Unmute horror atmospheric ambiance' : 'Mute audio'}
            className="p-2 rounded-lg bg-stone-950 border border-stone-800 hover:border-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-stone-600" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
          </button>

          {/* Investigator Profile */}
          <div
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-2.5 py-1 pr-1.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 cursor-pointer transition-all"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-stone-200">{user.username}</div>
              <div className={`text-[10px] font-mono px-1.5 rounded border ${getRankBadgeClass(user.rank)}`}>
                {user.rank} · {user.experiencePoints} XP
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-stone-900 border border-rose-950 flex items-center justify-center text-rose-300">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
