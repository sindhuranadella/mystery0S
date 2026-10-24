import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  AlertCircle,
  Skull,
  Flame,
  Zap
} from 'lucide-react';
import { MysteryCase, InvestigationSession, SceneLocation, SceneObject, Clue } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface SceneExplorerProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onInspectObject: (locationId: string, objectId: string) => Promise<{
    inspectMessage: string;
    newlyDiscoveredClue: Clue | null;
    locked?: boolean;
    message?: string;
  }>;
  onExploreLocation: (locationId: string) => void;
}

export const SceneExplorer: React.FC<SceneExplorerProps> = ({
  mysteryCase,
  session,
  onInspectObject,
  onExploreLocation,
}) => {
  const [activeLocationId, setActiveLocationId] = useState<string>(
    mysteryCase.locations[0]?.id || ''
  );
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<{
    message: string;
    clue?: Clue | null;
    isLocked?: boolean;
  } | null>(null);
  const [luminolMode, setLuminolMode] = useState(false);
  const [flashlight, setFlashlight] = useState<{ x: number; y: number } | null>(null);

  const currentLocation = mysteryCase.locations.find(l => l.id === activeLocationId) || mysteryCase.locations[0];

  const handleSelectLocation = (locId: string) => {
    setActiveLocationId(locId);
    onExploreLocation(locId);
    setSelectedObject(null);
    setInspectionResult(null);
  };

  const handleInspectClick = async (obj: SceneObject) => {
    setSelectedObject(obj);
    setInspectModalOpen(true);
    setInspectLoading(true);
    setInspectionResult(null);

    soundManager.playKeyType();

    const res = await onInspectObject(currentLocation.id, obj.id);
    setInspectLoading(false);

    if (res.locked) {
      setInspectionResult({
        message: res.message || 'Access is barred. A key or prior discovery is required.',
        isLocked: true
      });
    } else {
      if (res.newlyDiscoveredClue) {
        soundManager.playClueFound();
      }
      setInspectionResult({
        message: res.inspectMessage,
        clue: res.newlyDiscoveredClue,
        isLocked: false
      });
    }
  };

  return (
    <div className="space-y-6 text-stone-200">
      {/* Location Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-950 rounded-2xl border border-stone-800">
        {mysteryCase.locations.map(loc => {
          const isCurrent = loc.id === activeLocationId;
          const inspectedCount = loc.objects.filter(o => session.inspectedObjectIds.includes(o.id)).length;

          return (
            <button
              key={loc.id}
              onClick={() => handleSelectLocation(loc.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-red-950 to-rose-900 text-white border border-rose-700/60 shadow-lg'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-rose-400' : 'text-stone-600'}`} />
              <span>{loc.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isCurrent ? 'bg-rose-950 text-rose-300' : 'bg-stone-900 text-stone-500'
                }`}
              >
                {inspectedCount}/{loc.objects.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Scene Stage */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Visual Scene Canvas with Hotspots */}
        <div className="lg:col-span-8 flex flex-col">
          <div
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              setFlashlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseLeave={() => setFlashlight(null)}
            className="relative rounded-2xl overflow-hidden border border-rose-950/70 bg-[#06070a] aspect-[16/10] shadow-2xl select-none group horror-vignette"
          >
            {/* Ambient Background Image with Dynamic Luminol Mode Filter */}
            <img
              src={currentLocation.ambientImage}
              alt={currentLocation.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                luminolMode
                  ? 'brightness-[0.4] contrast-[1.8] hue-rotate-[220deg] saturate-[2.2]'
                  : 'brightness-[0.55] contrast-[1.3]'
              }`}
            />

            {/* Dark blood-smoke vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

            {/* Dynamic Flashlight Spotlight Overlay */}
            {flashlight && !luminolMode && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle 180px at ${flashlight.x}px ${flashlight.y}px, rgba(255,245,220,0.12) 0%, rgba(200,10,30,0.04) 50%, transparent 100%)`
                }}
              />
            )}

            {/* Luminol UV Mode Glowing Latent Traces Overlay */}
            {luminolMode && (
              <div className="absolute inset-0 pointer-events-none z-10 animate-pulse">
                {/* Latent Fluorescent Blood Footprints Decals */}
                <div className="absolute top-[68%] left-[45%] w-16 h-8 border-2 border-cyan-400/80 rounded-full blur-[1px] rotate-[-25deg] shadow-[0_0_15px_#22d3ee] flex items-center justify-center">
                  <span className="text-[9px] font-mono text-cyan-200 tracking-wider">LATENT TREAD</span>
                </div>
                <div className="absolute top-[58%] left-[55%] w-14 h-7 border-2 border-cyan-400/70 rounded-full blur-[1px] rotate-[15deg] shadow-[0_0_12px_#22d3ee]" />
                <div className="absolute top-[42%] left-[72%] w-12 h-12 rounded-full border border-cyan-300/80 blur-[2px] shadow-[0_0_20px_#06b6d4] flex items-center justify-center">
                  <span className="text-[8px] font-mono text-cyan-300">BIO SPATTER</span>
                </div>
              </div>
            )}

            {/* Police Caution Tape Ribbon Banner */}
            <div className="absolute -top-1 -right-8 w-44 bg-amber-400 text-stone-950 text-[8px] font-mono font-black py-0.5 px-4 rotate-45 shadow-lg border-y border-stone-900 pointer-events-none z-20 text-center tracking-tighter uppercase">
              POLICE // DO NOT CROSS
            </div>

            {/* Top Scene Information & Forensic Tools Overlay */}
            <div className="absolute top-4 left-4 right-16 flex items-center justify-between z-20">
              <div className="px-3 py-1.5 rounded-xl bg-stone-950/90 border border-stone-800/80 backdrop-blur-md">
                <div className="text-xs font-cinzel font-bold text-stone-100 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  {currentLocation.name}
                </div>
                <div className="text-[10px] text-stone-400 font-serif">{currentLocation.description}</div>
              </div>

              {/* Forensic Tool Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playKeyType();
                    setLuminolMode(!luminolMode);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition-all shadow-lg cursor-pointer ${
                    luminolMode
                      ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-stone-950/90 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                  title="Toggle 365nm Ultraviolet Forensic Light to reveal latent biological traces"
                >
                  <Zap className={`w-3.5 h-3.5 ${luminolMode ? 'text-cyan-400 animate-pulse' : 'text-stone-500'}`} />
                  <span>{luminolMode ? 'UV Luminol: ACTIVE' : 'UV Luminol Filter'}</span>
                </button>

                <div className="hidden sm:block px-2.5 py-1.5 rounded-xl bg-stone-950/90 border border-stone-800/80 backdrop-blur-md text-[11px] font-mono text-rose-400">
                  {currentLocation.objects.length} Hotspots
                </div>
              </div>
            </div>

            {/* Interactive Pulse Hotspots with Numbered Forensic Placards */}
            {currentLocation.objects.map((obj, idx) => {
              const isRevealed = obj.revealsClueId && session.discoveredClueIds.includes(obj.revealsClueId);
              const hasPrereq = obj.requiresClueId && !session.discoveredClueIds.includes(obj.requiresClueId);

              return (
                <div
                  key={obj.id}
                  style={{ left: `${obj.xPercent}%`, top: `${obj.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => handleInspectClick(obj)}
                    className="relative group/hotspot flex items-center justify-center p-2 rounded-full focus:outline-none cursor-pointer"
                    title={`Inspect ${obj.name}`}
                  >
                    {/* Pulsing ring */}
                    <span
                      className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                        luminolMode
                          ? 'bg-cyan-500/50'
                          : hasPrereq
                          ? 'bg-amber-600/30'
                          : isRevealed
                          ? 'bg-emerald-600/30'
                          : 'bg-rose-600/40'
                      }`}
                    />

                    {/* Button circle */}
                    <span
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-2xl backdrop-blur-md transition-all group-hover/hotspot:scale-125 ${
                        luminolMode
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_12px_#06b6d4]'
                          : hasPrereq
                          ? 'bg-amber-950 border-amber-600 text-amber-300'
                          : isRevealed
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : 'bg-stone-950 border-rose-600 text-rose-400'
                      }`}
                    >
                      {hasPrereq ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : isRevealed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                      )}
                    </span>

                    {/* Forensic Yellow Evidence Placard for Revealed Objects */}
                    {isRevealed && (
                      <span className="absolute -top-3 -right-2 bg-amber-400 text-stone-950 font-mono font-black text-[9px] px-1 py-0.2 rounded shadow-md border border-stone-900 pointer-events-none">
                        #{idx + 1}
                      </span>
                    )}

                    {/* Hover label */}
                    <span className="absolute bottom-full mb-2 hidden group-hover/hotspot:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-[11px] font-cinzel whitespace-nowrap shadow-xl z-30 pointer-events-none">
                      {obj.name}
                      {hasPrereq && <span className="text-[9px] text-amber-500 font-mono">(Barred)</span>}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Bottom forensic status prompt bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-stone-400 font-serif pointer-events-none z-20">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                {luminolMode
                  ? 'Fluorescing latent biological traces under UV illumination'
                  : 'Sweep forensic flashlight across hotspots to collect crucial relics'}
              </span>
              <span className="font-mono text-rose-400/90 text-[10px]">
                {luminolMode ? 'UV SPECTRUM: 365 NM' : 'FORENSIC INQUEST CAMERA'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Objects List & Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <h3 className="text-xs font-mono uppercase text-stone-400 font-semibold mb-3 flex items-center justify-between">
              <span>Points of Suspicion</span>
              <span className="text-rose-400 font-mono">{currentLocation.objects.length} Objects</span>
            </h3>

            <div className="space-y-2">
              {currentLocation.objects.map(obj => {
                const isInspected = session.inspectedObjectIds.includes(obj.id);
                const isRevealed = obj.revealsClueId && session.discoveredClueIds.includes(obj.revealsClueId);
                const hasPrereq = obj.requiresClueId && !session.discoveredClueIds.includes(obj.requiresClueId);

                return (
                  <div
                    key={obj.id}
                    onClick={() => handleInspectClick(obj)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isRevealed
                        ? 'bg-stone-900/60 border-emerald-900/50 hover:border-emerald-700'
                        : isInspected
                        ? 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
                        : 'bg-stone-950 border-stone-800/80 hover:border-rose-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          hasPrereq
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40'
                            : isRevealed
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                        }`}
                      >
                        {hasPrereq ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="text-xs font-cinzel font-bold text-stone-200">{obj.name}</div>
                        <div className="text-[10px] text-stone-500 font-serif">
                          {hasPrereq ? 'Locked / Requires Tool' : isRevealed ? 'Relic Cataloged' : 'Inspect with Flashlight'}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-600" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Autopsy / Room Forensics Log */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-rose-950/50 text-xs">
            <h4 className="font-cinzel font-semibold text-rose-300 mb-2 flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-rose-500" />
              Autopsy & Trace Log
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed font-serif">
              Search for microscopic residues, severed wires, or misplaced personal items. What seems insignificant may shatter a suspect's sworn alibi.
            </p>
          </div>
        </div>
      </div>

      {/* Inspection Modal Drawer */}
      {inspectModalOpen && selectedObject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-stone-950 border border-rose-950/80 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-400" />
                <h3 className="text-base font-cinzel font-bold text-stone-100">{selectedObject.name}</h3>
              </div>
              <button
                onClick={() => setInspectModalOpen(false)}
                className="text-stone-400 hover:text-stone-200 text-xs px-2 py-1 rounded bg-stone-900 font-mono"
              >
                Close (ESC)
              </button>
            </div>

            <div className="py-6">
              {inspectLoading ? (
                <div className="py-8 text-center text-xs text-stone-400 flex flex-col items-center gap-2 font-serif">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  <span>Examining microscopic traces...</span>
                </div>
              ) : inspectionResult ? (
                <div className="space-y-4">
                  {inspectionResult.isLocked ? (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/60 text-amber-200 text-xs flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-cinzel font-bold mb-1">Access Barred</div>
                        <p className="leading-relaxed font-serif">{inspectionResult.message}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-300 text-xs leading-relaxed mb-4 font-serif">
                        {inspectionResult.message}
                      </div>

                      {inspectionResult.clue && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/50 via-stone-900 to-stone-950 border border-rose-800/70 text-rose-200">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-rose-300">
                              <Skull className="w-4 h-4 text-rose-400 shrink-0" />
                              <span>Forensic Clue Discovered: {inspectionResult.clue.name}</span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-200 border border-red-800 font-bold uppercase tracking-wider shrink-0">
                              CONFISCATED
                            </span>
                          </div>

                          {/* Criminal Evidence Photograph with Police Scale & Exhibit Stamp */}
                          {inspectionResult.clue.imageUrl && (
                            <div className="relative mb-3 rounded-xl overflow-hidden border-2 border-rose-950 shadow-2xl group/ev bg-black">
                              <img
                                src={inspectionResult.clue.imageUrl}
                                alt={inspectionResult.clue.name}
                                className="w-full h-48 object-cover filter contrast-125 brightness-90 group-hover/ev:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
                              {/* Forensic metric scale indicator */}
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono text-amber-400 border border-amber-900/60 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span>FORENSIC SCALE: 10 CM</span>
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                                <span className="bg-black/80 px-2 py-0.5 rounded border border-rose-900/60 text-stone-300">
                                  {inspectionResult.clue.locationName}
                                </span>
                                <span className="bg-red-950/90 px-2 py-0.5 rounded border border-red-700 text-rose-200 font-bold">
                                  EXHIBIT #{inspectionResult.clue.id.slice(-4).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}

                          <p className="text-xs text-stone-300 mt-1 leading-relaxed font-serif">
                            {inspectionResult.clue.description}
                          </p>

                          {inspectionResult.clue.forensicNotes && (
                            <div className="mt-2.5 p-2.5 rounded-lg bg-black/60 border border-rose-950 text-[11px] font-mono text-rose-300/90 leading-relaxed flex items-start gap-2">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                              <span>{inspectionResult.clue.forensicNotes}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-3 text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900/60">
                              Type: {inspectionResult.clue.evidenceType}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-stone-900 text-stone-300 border border-stone-800">
                              Pinned to Pinboard
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-800">
              <button
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 text-white rounded-xl text-xs font-cinzel font-bold transition-all border border-rose-800/60"
              >
                Conclude Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
