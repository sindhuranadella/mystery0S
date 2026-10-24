import React, { useState } from 'react';
import { Skull, Key, Mail, User as UserIcon, X, AlertCircle, Flame } from 'lucide-react';
import { User } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    soundManager.playKeyType();

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication denied. Access credentials invalid.');
      } else {
        soundManager.playClueFound();
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch {
      setError('Communication with the inquisitor archives failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in text-stone-100">
      <div className="relative w-full max-w-md rounded-2xl bg-[#09080e] border border-red-950/70 shadow-2xl shadow-red-950/50 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-850">
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-base font-cinzel font-bold text-stone-100">
              {isLogin ? 'Inquisitor Order Clearance' : 'Swear Oath of the Inquest'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-600/40 text-red-200 text-xs flex items-center gap-2 font-serif">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="py-5 space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
                Inquisitor Pseudonym
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. Master Corvus"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
              Secret Inscription (Email or Handle)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sindhura.nadella06@gmail.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
              />
            </div>
          </div>

          <div>
            <label className="block font-cinzel uppercase tracking-wider text-stone-400 mb-1 font-semibold text-[11px]">
              Forbidden Passcode
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-black/80 rounded-xl border border-stone-850 text-stone-200 focus:outline-none focus:border-red-600 font-serif"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-red-900 to-rose-950 hover:from-red-800 hover:to-rose-900 disabled:opacity-50 text-stone-100 font-cinzel font-bold tracking-wider rounded-xl text-xs transition-all border border-red-700/50 shadow-lg shadow-red-950/40 mt-2 cursor-pointer"
          >
            {loading ? 'Unsealing Records...' : isLogin ? 'Access Forbidden Dossiers' : 'Inscribe Inquisitor Oath'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setError('');
                setIsLogin(!isLogin);
              }}
              className="text-stone-400 hover:text-red-400 underline text-[11px] font-serif italic cursor-pointer"
            >
              {isLogin ? "Require initiation into the order? Register" : "Already bound by oath? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

