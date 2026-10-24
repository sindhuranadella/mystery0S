import React, { useState } from 'react';
import { Skull, Award, X, Check, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
import { User } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdateProfile: (username: string) => Promise<void>;
  onSwitchUser: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onUpdateProfile,
  onSwitchUser,
}) => {
  const [username, setUsername] = useState(user.username);
  const [isSaved, setIsSaved] = useState(false);
  const [muted, setMuted] = useState(soundManager.isMuted);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    soundManager.playKeyType();
    await onUpdateProfile(username.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-stone-100">
      <div className="relative w-full max-w-md rounded-2xl bg-[#09080e] border border-red-950/70 shadow-2xl shadow-red-950/50 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-850">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-base font-cinzel font-bold text-stone-100">Inquisitor Sanctum & Dossier</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="py-5 space-y-4 text-xs">
          {/* Badge & Rank Header */}
          <div className="p-4 rounded-xl bg-black/60 border border-stone-850 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-950 via-stone-900 to-rose-950 border border-red-800/40 flex items-center justify-center text-red-200 font-cinzel font-bold text-xl shadow-inner shadow-red-950">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-cinzel font-bold text-stone-100 text-sm tracking-wide">{user.username}</div>
              <div className="text-amber-500 font-mono text-[11px]">{user.rank} • {user.experiencePoints} Inquest XP</div>
              <div className="text-stone-500 text-[10px] font-mono">{user.email}</div>
            </div>
          </div>

          <div>
            <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
              Inquisitor Call-Sign / Pseudonym
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
            />
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-stone-850 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-stone-300 font-serif">Occult Horror Ambiance Engine</span>
              <span className="text-[10px] text-stone-500 font-serif italic">Procedural minor seconds & eerie bells</span>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 flex items-center gap-1.5 text-[11px] border border-stone-800 cursor-pointer transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-red-400" />}
              <span className="font-mono">{muted ? 'Silenced' : 'Haunted'}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onSwitchUser}
              className="text-stone-400 hover:text-red-400 underline text-[11px] cursor-pointer font-serif italic"
            >
              Switch Inquisitor / Relog
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 text-stone-100 font-cinzel font-bold tracking-wider rounded-xl text-xs transition-all border border-red-700/50 shadow-md shadow-red-950/40 flex items-center gap-1.5 cursor-pointer"
            >
              {isSaved ? <Check className="w-3.5 h-3.5 text-red-300" /> : null}
              <span>{isSaved ? 'Sealed' : 'Inscribe Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

