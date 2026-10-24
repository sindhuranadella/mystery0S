import React, { useState } from 'react';
import {
  Clock,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldAlert,
  Skull
} from 'lucide-react';
import { MysteryCase, InvestigationSession, TimelineEvent, PlayerTimelineEntry } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface TimelineReconstructionProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onSaveTimeline: (timeline: PlayerTimelineEntry[]) => void;
}

export const TimelineReconstruction: React.FC<TimelineReconstructionProps> = ({
  mysteryCase,
  session,
  onSaveTimeline,
}) => {
  const [timelineEntries, setTimelineEntries] = useState<PlayerTimelineEntry[]>(
    session.playerTimeline && session.playerTimeline.length > 0
      ? session.playerTimeline
      : mysteryCase.timelineEvents.map((evt, idx) => ({
          eventId: evt.id,
          proposedOrder: idx + 1,
          userNotes: ''
        }))
  );

  const getSourceBadge = (source: TimelineEvent['source']) => {
    switch (source) {
      case 'physical_record':
        return 'text-emerald-400 border-emerald-900/60 bg-emerald-950/40';
      case 'surveillance':
        return 'text-stone-300 border-stone-800 bg-stone-900/40';
      case 'suspect_claim':
        return 'text-amber-400 border-amber-900/60 bg-amber-950/40';
      case 'witness':
        return 'text-rose-400 border-rose-900/60 bg-rose-950/40';
      default:
        return 'text-stone-400 border-stone-800 bg-stone-950';
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= timelineEntries.length) return;

    soundManager.playKeyType();
    const updated = [...timelineEntries];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    const reordered = updated.map((entry, idx) => ({
      ...entry,
      proposedOrder: idx + 1
    }));

    setTimelineEntries(reordered);
    onSaveTimeline(reordered);
  };

  // Check chronological conflicts
  const conflicts: { eventId: string; reason: string }[] = [];
  for (let i = 0; i < timelineEntries.length - 1; i++) {
    const curEvt = mysteryCase.timelineEvents.find(e => e.id === timelineEntries[i].eventId);
    const nextEvt = mysteryCase.timelineEvents.find(e => e.id === timelineEntries[i + 1].eventId);

    if (curEvt && nextEvt && curEvt.sortTimestamp > nextEvt.sortTimestamp) {
      conflicts.push({
        eventId: curEvt.id,
        reason: `Timeline Inversion: "${curEvt.title}" (${curEvt.timeString}) is situated prior to earlier event "${nextEvt.title}" (${nextEvt.timeString}).`
      });
    }
  }

  return (
    <div className="space-y-6 text-stone-200">
      <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-cinzel font-bold text-stone-100">The Timeline of Dread</h3>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-serif">
            Reorder the events of the murder in exact chronological sequence. Forged alibis produce temporal paradoxes.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          {conflicts.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>{conflicts.length} Temporal Conflict{conflicts.length > 1 ? 's' : ''} Detected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Chronological Sequence Aligned</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Event Cards */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-rose-950/40 before:z-0">
        {timelineEntries.map((entry, idx) => {
          const evt = mysteryCase.timelineEvents.find(e => e.id === entry.eventId);
          if (!evt) return null;

          const conflict = conflicts.find(c => c.eventId === evt.id);

          return (
            <div
              key={evt.id}
              className={`relative z-10 pl-14 transition-all ${conflict ? 'animate-pulse' : ''}`}
            >
              {/* Timeline marker node */}
              <div
                className={`absolute left-4 top-5 -translate-x-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold shadow-lg ${
                  conflict
                    ? 'bg-red-950 border-red-500 text-red-300'
                    : 'bg-stone-950 border-rose-700 text-rose-300'
                }`}
              >
                {idx + 1}
              </div>

              {/* Event Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  conflict
                    ? 'bg-stone-950 border-red-500/60 shadow-red-950/30'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-300 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/50">
                      {evt.timeString}
                    </span>
                    <h4 className="text-sm font-cinzel font-bold text-stone-100">{evt.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getSourceBadge(
                        evt.source
                      )}`}
                    >
                      Source: {evt.source.replace('_', ' ')}
                    </span>

                    {/* Move controls */}
                    <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-stone-400 hover:text-white disabled:opacity-30"
                        title="Move Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === timelineEntries.length - 1}
                        className="p-1 text-stone-400 hover:text-white disabled:opacity-30"
                        title="Move Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-serif">{evt.description}</p>

                <div className="flex items-center gap-4 mt-3 text-[11px] text-stone-400 font-mono">
                  <span>Location: {evt.location}</span>
                </div>

                {/* Conflict Alert Warning */}
                {conflict && (
                  <div className="mt-3 p-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 font-serif">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{conflict.reason}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
