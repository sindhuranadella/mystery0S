import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  AlertTriangle,
  User,
  Shield,
  Sparkles,
  Flame,
  Skull,
  HelpCircle
} from 'lucide-react';
import { MysteryCase, InvestigationSession, Suspect, DialogueMessage } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface InterrogationTerminalProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onSendMessage: (suspectId: string, question: string) => Promise<DialogueMessage>;
}

export const InterrogationTerminal: React.FC<InterrogationTerminalProps> = ({
  mysteryCase,
  session,
  onSendMessage,
}) => {
  const [activeSuspectId, setActiveSuspectId] = useState<string>(
    mysteryCase.suspects[0]?.id || ''
  );
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSuspect = mysteryCase.suspects.find(s => s.id === activeSuspectId) || mysteryCase.suspects[0];
  const dialogue = session.dialogueHistory[activeSuspectId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [dialogue, loading]);

  const handleSend = async (qText?: string) => {
    const q = (qText || inputQuestion).trim();
    if (!q || loading) return;

    setInputQuestion('');
    setLoading(true);
    soundManager.playKeyType();

    try {
      const resMsg = await onSendMessage(activeSuspectId, q);
      if (resMsg.contradictionFlagged) {
        soundManager.playContradictionFound();
      } else {
        soundManager.playKeyType();
      }
    } finally {
      setLoading(false);
    }
  };

  const getTemperamentBadge = (temp: Suspect['temperament']) => {
    switch (temp) {
      case 'composed':
        return 'text-stone-300 border-stone-800 bg-stone-900/60';
      case 'defensive':
        return 'text-rose-400 border-rose-900/60 bg-rose-950/40';
      case 'nervous':
        return 'text-amber-400 border-amber-900/60 bg-amber-950/40';
      case 'arrogant':
        return 'text-purple-400 border-purple-900/60 bg-purple-950/40';
      default:
        return 'text-stone-400 border-stone-800 bg-stone-950';
    }
  };

  const getSuggestedQuestions = (suspect: Suspect) => {
    if (suspect.id === 'suspect_evelyn_vance') {
      return [
        'Where were you between 10:15 and 10:45 PM?',
        'Can you explain why your Appraiser Badge #04 swiped into the study at 10:22 PM?',
        'We recovered a half-burned telegram about your debts in Zurich. Care to explain?',
        'Why was an emerald silk glove coated with vault hinge grease found in the conservatory?'
      ];
    }
    if (suspect.id === 'suspect_julian_croft') {
      return [
        'Your gold cufflink was found on the rug right by the opened vault. Explain.',
        'Did you see anyone enter the conservatory while you were smoking on the terrace?',
        'How much do you currently owe your London creditors?'
      ];
    }
    if (suspect.id === 'suspect_lucas_gray') {
      return [
        'Who had access to the study corridor keys tonight?',
        'Did anyone look suspicious right when the champagne glasses broke at 10:20 PM?'
      ];
    }
    return [
      'Where were you at the time of the incident?',
      'Can you corroborate the alibi of the other suspects?',
      'Did you notice anyone tampering with the security doors?'
    ];
  };

  return (
    <div className="space-y-6 text-stone-200">
      {/* Suspect Roster Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mysteryCase.suspects.map(s => {
          const isSelected = s.id === activeSuspectId;
          const msgCount = session.dialogueHistory[s.id]?.length || 0;

          return (
            <div
              key={s.id}
              onClick={() => setActiveSuspectId(s.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-stone-950 border-rose-700 shadow-xl shadow-rose-950/30 ring-1 ring-rose-700/60'
                  : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
              }`}
            >
              <img
                src={s.avatar}
                alt={s.name}
                className="w-11 h-11 rounded-xl object-cover border border-stone-800 grayscale contrast-125"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-cinzel font-bold text-stone-200 truncate">{s.name}</div>
                <div className="text-[10px] text-stone-400 truncate font-serif">{s.role}</div>
                <div className="flex items-center gap-1.5 mt-1 font-mono">
                  <span className={`text-[9px] px-1.5 rounded border ${getTemperamentBadge(s.temperament)}`}>
                    {s.temperament}
                  </span>
                  {msgCount > 0 && (
                    <span className="text-[9px] text-stone-600">{msgCount} msgs</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interrogation Chamber Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Dossier Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#08070c] border border-rose-950/70 shadow-xl relative overflow-hidden">
            {/* Background criminal booking docket watermarks */}
            <div className="absolute top-2 right-2 text-[8px] font-mono text-stone-700 select-none uppercase tracking-widest border border-stone-800/60 px-1 py-0.5 rounded">
              DOSSIER #{activeSuspect.id.slice(-6)}
            </div>

            <div className="flex items-start gap-4 mb-4 relative z-10">
              {/* Suspect photo with Police Booking Height Chart Background */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-stone-700 shadow-2xl bg-stone-900 shrink-0">
                {/* Booking height lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_19px,_rgba(255,255,255,0.08)_20px)] bg-[size:100%_20px] pointer-events-none z-10" />
                <img
                  src={activeSuspect.avatar}
                  alt={activeSuspect.name}
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 relative z-0"
                />
                <div className="absolute bottom-0 inset-x-0 bg-stone-950/90 py-0.5 text-center text-[8px] font-mono text-rose-300 font-bold border-t border-stone-800 z-20">
                  INQUEST
                </div>
              </div>

              <div>
                <h3 className="text-base font-cinzel font-bold text-stone-100">{activeSuspect.name}</h3>
                <div className="text-xs text-rose-400 font-medium font-serif">{activeSuspect.role}</div>
                <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Age: {activeSuspect.age} · Status: Detained
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs relative z-10">
              <div>
                <span className="font-mono text-stone-400 uppercase text-[10px] block">Temperament & Persona</span>
                <p className="text-stone-300 mt-0.5 leading-relaxed font-serif">{activeSuspect.personality}</p>
              </div>

              <div>
                <span className="font-mono text-stone-400 uppercase text-[10px] block">Sworn Alibi</span>
                <p className="text-stone-300 mt-0.5 leading-relaxed bg-[#050608] p-2.5 rounded-lg border border-stone-800 font-serif italic">
                  "{activeSuspect.alibi}"
                </p>
              </div>

              <div>
                <span className="font-mono text-stone-400 uppercase text-[10px] block">Initial Statement</span>
                <p className="text-stone-400 italic mt-0.5 leading-relaxed font-serif">
                  {activeSuspect.initialStatement}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-4 rounded-2xl bg-[#08070c] border border-stone-850 shadow-xl">
            <h4 className="text-xs font-cinzel uppercase text-rose-400 font-semibold mb-2 flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-rose-500" />
              Lines of Inquest
            </h4>
            <div className="space-y-1.5">
              {getSuggestedQuestions(activeSuspect).map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sq)}
                  disabled={loading}
                  className="w-full text-left p-2 rounded-lg bg-stone-900/60 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-900/60 text-[11px] text-stone-300 hover:text-rose-200 transition-all font-serif cursor-pointer"
                >
                  "{sq}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Chat Terminal with Interrogation Cell Background */}
        <div className="lg:col-span-8 flex flex-col h-[580px] rounded-2xl bg-[#08070c] border border-stone-800 shadow-2xl overflow-hidden relative">
          {/* Subtle Criminal Interrogation Cell Ambient Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
              alt="Interrogation Chamber"
              className="w-full h-full object-cover opacity-10 filter contrast-150 brightness-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08070c] via-transparent to-[#08070c]/80" />
          </div>

          {/* Header */}
          <div className="px-5 py-3.5 bg-[#050608]/90 border-b border-stone-800 flex items-center justify-between relative z-10 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              <span className="text-xs font-cinzel font-bold text-stone-200">
                Interrogation Chamber: {activeSuspect.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
              <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/50 text-rose-300">
                Server-Guarded Truth Boundary
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 relative z-10">
            {/* Opening statement */}
            <div className="flex items-start gap-3">
              <img
                src={activeSuspect.avatar}
                alt={activeSuspect.name}
                className="w-8 h-8 rounded-lg object-cover border border-stone-800 grayscale shrink-0"
              />
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 bg-stone-900 border border-stone-800 text-stone-200 text-xs leading-relaxed font-serif shadow-md">
                <div className="text-[10px] font-cinzel font-bold text-rose-300 mb-1">{activeSuspect.name}</div>
                {activeSuspect.initialStatement}
              </div>
            </div>

            {/* Conversation */}
            {dialogue.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'investigator' ? 'flex-row-reverse' : ''
                }`}
              >
                {msg.sender === 'investigator' ? (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-stone-800 to-rose-950 border border-rose-800/50 flex items-center justify-center text-rose-200 shrink-0 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <img
                    src={activeSuspect.avatar}
                    alt={activeSuspect.name}
                    className="w-8 h-8 rounded-lg object-cover border border-stone-800 grayscale shrink-0"
                  />
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-serif shadow-md ${
                    msg.sender === 'investigator'
                      ? 'rounded-tr-sm bg-gradient-to-r from-stone-900 to-rose-950 border border-rose-800/60 text-white'
                      : 'rounded-tl-sm bg-stone-900/90 border border-stone-800 text-stone-200'
                  }`}
                >
                  <div
                    className={`text-[10px] font-cinzel font-bold mb-1 flex items-center justify-between gap-4 ${
                      msg.sender === 'investigator' ? 'text-rose-200' : 'text-rose-400'
                    }`}
                  >
                    <span>{msg.sender === 'investigator' ? 'Inquisitor Holt' : activeSuspect.name}</span>
                    <span className="text-[9px] font-mono opacity-50">{msg.timestamp}</span>
                  </div>

                  <p>{msg.text}</p>

                  {/* Contradiction Alert */}
                  {msg.contradictionFlagged && (
                    <div className="mt-2.5 p-2 rounded-lg bg-red-950/80 border border-red-500/60 text-red-200 text-[11px] flex items-center gap-2 animate-bounce">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="font-semibold font-cinzel">
                        Inconsistency Detected! Suspect statement conflicts with physical evidence.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <img
                  src={activeSuspect.avatar}
                  alt={activeSuspect.name}
                  className="w-8 h-8 rounded-lg object-cover border border-stone-800 grayscale shrink-0 animate-pulse"
                />
                <div className="px-4 py-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-stone-400 text-xs flex items-center gap-2 font-serif">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>{activeSuspect.name} is hesitating before answering...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Terminal */}
          <div className="p-3 bg-[#050608] border-t border-stone-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={e => setInputQuestion(e.target.value)}
                placeholder={`Cross-examine ${activeSuspect.name} on their timeline or confront with physical evidence...`}
                disabled={loading}
                className="flex-1 bg-stone-900 px-4 py-2.5 rounded-xl border border-stone-800 focus:border-rose-700 focus:outline-none text-xs text-stone-200 placeholder:text-stone-500 font-serif"
              />
              <button
                type="submit"
                disabled={loading || !inputQuestion.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 disabled:opacity-40 text-white rounded-xl text-xs font-cinzel font-bold transition-all flex items-center gap-1.5 border border-rose-800/60 shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Question</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
