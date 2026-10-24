import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Activity,
  Fingerprint,
  Microscope,
  Pipette,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  Search,
  FileText,
  Skull,
  Radio,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { soundManager } from '../../services/audioAmbiance';

interface ForensicLabProps {
  onExportFinding?: (title: string, content: string) => void;
  onOpenCase?: (caseId: string) => void;
}

export const ForensicLab: React.FC<ForensicLabProps> = ({
  onExportFinding,
  onOpenCase,
}) => {
  const [activeStation, setActiveStation] = useState<'chemistry' | 'voice' | 'fingerprint' | 'optical'>('chemistry');

  // Chemistry State
  const [selectedSample, setSelectedSample] = useState<number>(0);
  const [selectedReagent, setSelectedReagent] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    color: string;
    compound: string;
    certainty: number;
    notes: string;
  } | null>(null);
  const [isReacting, setIsReacting] = useState(false);

  // Voice Stress State
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [stressScore, setStressScore] = useState<number>(0);

  // Fingerprint State
  const [afisScanning, setAfisScanning] = useState(false);
  const [afisMatched, setAfisMatched] = useState(false);

  // Optical State
  const [comparatorSplit, setComparatorSplit] = useState(50);

  const samples = [
    {
      id: 'samp_acon',
      name: 'Capsule Reservoir Residue',
      origin: 'CyberPeak Tower · Coffee Reservoir #3',
      caseId: 'the-silent-alibi',
      caseTitle: 'The Silent Alibi',
      initialAppearance: 'Clear oily viscous droplet',
      knownCompound: 'Aconitine Bio-Toxin (C34H47NO11)',
      reagents: {
        marquis: { color: 'bg-rose-700', text: 'Crimson-Purple', result: 'Alkaloid Neurotoxin Positive' },
        nitric: { color: 'bg-amber-500', text: 'Intense Yellow-Orange', result: 'Monkshood Aconitum Confirmed' },
        luminol: { color: 'bg-cyan-500', text: 'Weak Pale Blue', result: 'No blood traces detected' }
      }
    },
    {
      id: 'samp_grease',
      name: 'Vault Hinge Silicone Lubricant',
      origin: 'Lord Harrington Private Study Safe',
      caseId: 'the-midnight-diamond',
      caseTitle: 'The Midnight Diamond',
      initialAppearance: 'High-viscosity amber grease with reflective dust',
      knownCompound: 'Lithium Stearate + Synthetic Zirconia Dust',
      reagents: {
        marquis: { color: 'bg-stone-600', text: 'No Reaction (Inert)', result: 'Non-biological petroleum grease' },
        nitric: { color: 'bg-stone-500', text: 'Brownish Sludge', result: 'Synthetic lubricant confirmed' },
        luminol: { color: 'bg-blue-600', text: 'Strong Refractive Fluorescence', result: 'Microscopic diamond dust faceting verified' }
      }
    },
    {
      id: 'samp_ash',
      name: 'Charred Hearth Telegram Carbon',
      origin: 'Harrington Manor Drawing Hearth',
      caseId: 'the-midnight-diamond',
      caseTitle: 'The Midnight Diamond',
      initialAppearance: 'Fragile blackened paper fragments',
      knownCompound: 'Wood pulp, iron gall ink traces, Zurich postmark',
      reagents: {
        marquis: { color: 'bg-zinc-800', text: 'Carbon precipitate', result: 'Commercial telegraphic dispatch paper' },
        nitric: { color: 'bg-emerald-700', text: 'Faint Green Oxidation', result: 'Iron gall ink residues revealed' },
        luminol: { color: 'bg-indigo-500', text: 'Ultraviolet Phosphorescence', result: 'Sub-surface characters legible under 365nm' }
      }
    },
    {
      id: 'samp_seawall',
      name: 'Breakwater Tool Saline Crust',
      origin: 'Saint-Malo Seawall Sewer Gutter',
      caseId: 'echoes-in-the-fog',
      caseTitle: 'Echoes in the Fog',
      initialAppearance: 'Crusted marine salt and copper verdigris',
      knownCompound: 'Sodium chloride + Industrial neoprene seal grease',
      reagents: {
        marquis: { color: 'bg-teal-700', text: 'Deep Blue-Green', result: 'Marine salvage grease confirmed' },
        nitric: { color: 'bg-white', text: 'Curdy White Precipitate', result: 'Silver chloride / high seawater salinity' },
        luminol: { color: 'bg-cyan-400', text: 'Fluorescent Green Halo', result: 'Tide-line immersion confirmed under 2 hours' }
      }
    }
  ];

  const suspectAudios = [
    {
      id: 'vance_wiretap',
      name: 'Evelyn Vance · Alibi Citation',
      suspect: 'Evelyn Vance',
      quote: '“I spent the entire hour alone in the west library reviewing Lord Harrington’s historical monographs. I never stepped into the study corridor.”',
      timestamp: '22:15 - 22:45 PM',
      deceptionProbability: 89,
      stressAnalysis: 'Severe glottal tension spike during pronunciation of "alone in the west library". Heartbeat elevated to 134 BPM.'
    },
    {
      id: 'thorne_wiretap',
      name: 'Dr. Aris Thorne · Fitness Center Claim',
      suspect: 'Dr. Aris Thorne',
      quote: '“I was bench-pressing in the 4th floor fitness center all night. Check the turnstile RFID records if you doubt my word.”',
      timestamp: '23:30 - 23:55 PM',
      deceptionProbability: 94,
      stressAnalysis: 'Artificial vocal pacing. Steady baseline indicates coached pre-meditated response, but pitch flutter occurs on "turnstile records".'
    },
    {
      id: 'croft_wiretap',
      name: 'Julian Croft · Smoking Terrace',
      suspect: 'Julian Croft',
      quote: '“Look, I lost that cufflink hours ago at dinner! I was outside freezing my ears off on the terrace smoking Turkish cigarettes.”',
      timestamp: '22:10 - 22:35 PM',
      deceptionProbability: 24,
      stressAnalysis: 'Physiological anger and agitation detected, but vocal jitter is consistent with genuine outrage and innocence.'
    }
  ];

  const handleRunReagentTest = (reagentKey: 'marquis' | 'nitric' | 'luminol') => {
    setSelectedReagent(reagentKey);
    setIsReacting(true);
    soundManager.playKeyType();

    setTimeout(() => {
      setIsReacting(false);
      const cur = samples[selectedSample];
      const outcome = cur.reagents[reagentKey];
      setTestResult({
        tested: true,
        color: outcome.color,
        compound: cur.knownCompound,
        certainty: 98.7,
        notes: outcome.result
      });
      soundManager.playClueFound();
    }, 900);
  };

  const handlePlayVoice = (index: number) => {
    setSelectedVoice(index);
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      setStressScore(0);
    } else {
      setIsPlayingAudio(true);
      soundManager.playKeyType();
      // Simulate real-time stress telemetry
      let current = 20;
      const target = suspectAudios[index].deceptionProbability;
      const timer = setInterval(() => {
        current += 5;
        setStressScore(Math.min(target, current));
        if (current >= target) {
          clearInterval(timer);
          soundManager.playContradictionFound();
        }
      }, 80);
    }
  };

  const handleScanAfis = () => {
    setAfisScanning(true);
    setAfisMatched(false);
    soundManager.playKeyType();

    setTimeout(() => {
      setAfisScanning(false);
      setAfisMatched(true);
      soundManager.playClueFound();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050609] text-stone-200 py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-rose-950/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs font-mono mb-3">
            <FlaskConical className="w-3.5 h-3.5 text-rose-400" />
            <span>SCOTLAND YARD OCCULT BUREAU · FORENSIC LABORATORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-stone-100">
            Forensic Pathology & Science Suite
          </h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl font-serif">
            Analyze chemical alkaloids, decompose voice-stress frequencies on wiretap recordings, inspect latent ridge minutiae, and verify toolmark striations.
          </p>
        </div>

        {/* Station Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveStation('chemistry');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all ${
              activeStation === 'chemistry'
                ? 'bg-rose-950 text-white border border-rose-700 shadow-lg'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-rose-400" />
            <span>Chemical & Toxin Lab</span>
          </button>

          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveStation('voice');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all ${
              activeStation === 'voice'
                ? 'bg-rose-950 text-white border border-rose-700 shadow-lg'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-red-400" />
            <span>Voice Stress Wiretap</span>
          </button>

          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveStation('fingerprint');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all ${
              activeStation === 'fingerprint'
                ? 'bg-rose-950 text-white border border-rose-700 shadow-lg'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
            <span>AFIS Minutiae Scanner</span>
          </button>

          <button
            onClick={() => {
              soundManager.playKeyType();
              setActiveStation('optical');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-cinzel font-semibold transition-all ${
              activeStation === 'optical'
                ? 'bg-rose-950 text-white border border-rose-700 shadow-lg'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optical Comparator</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STATION 1: CHEMISTRY & TOXIN SPECTROMETRY */}
      {/* ========================================================= */}
      {activeStation === 'chemistry' && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sample Selector */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-mono uppercase text-stone-400 font-semibold tracking-wider">
              Crime Scene Evidence Samples
            </h3>

            <div className="space-y-2.5">
              {samples.map((samp, idx) => (
                <div
                  key={samp.id}
                  onClick={() => {
                    soundManager.playKeyType();
                    setSelectedSample(idx);
                    setTestResult(null);
                    setSelectedReagent(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedSample === idx
                      ? 'bg-stone-900 border-rose-700 shadow-xl shadow-rose-950/30 ring-1 ring-rose-700/60'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-rose-400 font-bold uppercase">{samp.caseTitle}</span>
                    <span className="text-stone-500">SAMPLE #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-cinzel font-bold text-stone-100 mb-1">{samp.name}</h4>
                  <p className="text-xs text-stone-400 font-serif leading-relaxed">{samp.origin}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testing Rig & Reagent Bench */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <h3 className="text-base font-cinzel font-bold text-stone-100">
                    Reagent Spectrophotometry Rig
                  </h3>
                  <div className="text-xs text-stone-400 font-serif mt-0.5">
                    Testing: <span className="text-rose-300 font-bold">{samples[selectedSample].name}</span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded bg-black/60 border border-stone-800 text-[10px] font-mono text-stone-400">
                  UV-VIS: 200 - 800 NM
                </div>
              </div>

              {/* Apparatus Chamber */}
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                {/* Simulated Reaction Test Tube */}
                <div className="relative h-64 rounded-2xl bg-black border border-stone-800 flex flex-col items-center justify-center p-6 overflow-hidden">
                  <div className="text-[10px] font-mono text-stone-500 absolute top-3 left-3">
                    CHAMBER 01 · PETRI SLAB
                  </div>

                  {/* Reaction Glass Vial */}
                  <div className="relative w-24 h-44 rounded-b-3xl border-2 border-stone-700 bg-stone-950/80 shadow-2xl flex flex-col justify-end p-2 overflow-hidden">
                    {/* Measurement graduation lines */}
                    <div className="absolute inset-y-4 right-1 flex flex-col justify-between text-[8px] font-mono text-stone-600">
                      <span>15ml</span>
                      <span>10ml</span>
                      <span>5ml</span>
                      <span>1ml</span>
                    </div>

                    {/* Fluid level with reaction colors */}
                    <div
                      className={`w-full rounded-b-2xl transition-all duration-700 ${
                        isReacting
                          ? 'h-32 bg-amber-600 animate-pulse'
                          : testResult
                          ? `h-32 ${testResult.color} shadow-lg shadow-rose-950/50`
                          : 'h-16 bg-stone-800 opacity-60'
                      }`}
                    />

                    {/* Dropper Pipette Visual */}
                    {isReacting && (
                      <div className="absolute top-2 inset-x-0 flex flex-col items-center animate-bounce">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span className="text-[8px] font-mono text-rose-300 mt-1">Reagent Added</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-stone-400 mt-3 text-center">
                    {isReacting
                      ? 'Catalyzing reaction...'
                      : testResult
                      ? testResult.notes
                      : 'Awaiting chemical dropper'}
                  </div>
                </div>

                {/* Reagent Dropper Buttons */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    Select Chemical Reagent Dropper:
                  </span>

                  <button
                    disabled={isReacting}
                    onClick={() => handleRunReagentTest('marquis')}
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-rose-700 text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-cinzel font-bold text-stone-200">Marquis Reagent</div>
                      <div className="text-[10px] text-stone-400 font-serif">Formaldehyde & sulfuric acid (Alkaloid test)</div>
                    </div>
                    <Pipette className="w-4 h-4 text-rose-400" />
                  </button>

                  <button
                    disabled={isReacting}
                    onClick={() => handleRunReagentTest('nitric')}
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-700 text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-cinzel font-bold text-stone-200">Concentrated Nitric Acid</div>
                      <div className="text-[10px] text-stone-400 font-serif">Precipitation test for Monkshood Aconitum</div>
                    </div>
                    <Pipette className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    disabled={isReacting}
                    onClick={() => handleRunReagentTest('luminol')}
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-cyan-700 text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-cinzel font-bold text-stone-200">UV-Luminol Activator</div>
                      <div className="text-[10px] text-stone-400 font-serif">Catalytic fluorescence for biological trace & gem faceting</div>
                    </div>
                    <Pipette className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* Lab Certificate Output */}
              {testResult && (
                <div className="p-4 rounded-xl bg-[#030306] border border-rose-900/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      CERTIFIED LABORATORY SPECTROGRAM
                    </span>
                    <span className="text-emerald-400 font-bold">MATCH: {testResult.certainty}% CONFIDENCE</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Identified Substance</span>
                      <span className="text-stone-200 font-bold">{testResult.compound}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Pathology Finding</span>
                      <span className="text-rose-300 font-bold">{testResult.notes}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-stone-500">
                      Verified by Scotland Yard Chemical Directorate
                    </span>
                    {onOpenCase && (
                      <button
                        onClick={() => onOpenCase(samples[selectedSample].caseId)}
                        className="text-xs font-cinzel font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        Launch Inquest Case <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STATION 2: WIRETAP VOICE STRESS DECEPTION SCANNER */}
      {/* ========================================================= */}
      {activeStation === 'voice' && (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Wiretap Roster */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono uppercase text-stone-400 font-semibold tracking-wider">
              Surveillance Wiretap Recordings
            </h3>

            {suspectAudios.map((aud, idx) => (
              <div
                key={aud.id}
                onClick={() => {
                  soundManager.playKeyType();
                  setSelectedVoice(idx);
                  setIsPlayingAudio(false);
                  setStressScore(0);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedVoice === idx
                    ? 'bg-stone-900 border-red-700 shadow-xl shadow-red-950/30 ring-1 ring-red-700/60'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-rose-400 font-bold">{aud.suspect}</span>
                  <span className="text-stone-500">{aud.timestamp}</span>
                </div>
                <h4 className="text-sm font-cinzel font-bold text-stone-100">{aud.name}</h4>
              </div>
            ))}
          </div>

          {/* Voice Analyzer Spectrogram */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-stone-950 border border-stone-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-base font-cinzel font-bold text-stone-100">
                  Micro-Tremor Pitch & Deception Gauge
                </h3>
                <div className="text-xs text-stone-400 font-mono mt-0.5">
                  Subject: <span className="text-rose-300 font-bold">{suspectAudios[selectedVoice].suspect}</span>
                </div>
              </div>

              <button
                onClick={() => handlePlayVoice(selectedVoice)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-cinzel font-bold border transition-all ${
                  isPlayingAudio
                    ? 'bg-red-950 text-red-200 border-red-700 animate-pulse'
                    : 'bg-gradient-to-r from-red-900 to-rose-900 text-white border-rose-700 shadow-md'
                }`}
              >
                {isPlayingAudio ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Stop Wiretap' : 'Play & Analyze Audio'}</span>
              </button>
            </div>

            {/* Testimonial Quote Quote Box */}
            <div className="p-4 rounded-xl bg-black/60 border border-stone-800 text-xs italic text-stone-300 font-serif leading-relaxed">
              {suspectAudios[selectedVoice].quote}
            </div>

            {/* Simulated Voice Pitch Oscilloscope */}
            <div className="p-4 rounded-xl bg-black border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                <span>VOCAL PERTURBATION WAVEFORM (HZ)</span>
                <span className={isPlayingAudio ? 'text-red-400 font-bold animate-pulse' : 'text-stone-500'}>
                  {isPlayingAudio ? 'LIVE HARMONIC SCAN' : 'STANDBY'}
                </span>
              </div>

              {/* Dynamic Animated Wave Bars */}
              <div className="h-20 flex items-center justify-between gap-1 px-2 overflow-hidden">
                {Array.from({ length: 40 }).map((_, i) => {
                  const barH = isPlayingAudio
                    ? Math.sin(Date.now() * 0.01 + i * 0.4) * 35 + 40
                    : Math.sin(i * 0.5) * 8 + 12;

                  return (
                    <div
                      key={i}
                      style={{ height: `${barH}px` }}
                      className={`flex-1 rounded-full transition-all duration-100 ${
                        isPlayingAudio && stressScore > 70
                          ? 'bg-gradient-to-t from-red-800 to-rose-500'
                          : 'bg-stone-700'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Deception Index Meter */}
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">DECEPTION PROBABILITY METRIC</span>
                <span
                  className={`font-bold text-sm ${
                    stressScore > 75 ? 'text-red-400' : stressScore > 50 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {stressScore}% DECEPTIVE
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-stone-950 border border-stone-800 overflow-hidden">
                <div
                  style={{ width: `${stressScore}%` }}
                  className={`h-full transition-all duration-300 ${
                    stressScore > 75
                      ? 'bg-gradient-to-r from-amber-500 to-red-600'
                      : 'bg-gradient-to-r from-emerald-600 to-amber-500'
                  }`}
                />
              </div>

              <div className="text-xs text-stone-300 font-serif leading-relaxed mt-2">
                <span className="font-mono text-rose-400 font-bold uppercase text-[10px] block mb-1">
                  Physiological Micro-Tremor Analysis:
                </span>
                {suspectAudios[selectedVoice].stressAnalysis}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STATION 3: AFIS MINUTIAE FINGERPRINT SCANNER */}
      {/* ========================================================= */}
      {activeStation === 'fingerprint' && (
        <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-base font-cinzel font-bold text-stone-100">
                Automated Fingerprint Identification Suite (AFIS)
              </h3>
              <p className="text-xs text-stone-400 font-serif mt-0.5">
                Comparison of crime scene latent ridge print against custody database booking records.
              </p>
            </div>

            <button
              onClick={handleScanAfis}
              disabled={afisScanning}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-900 to-rose-900 hover:from-red-800 text-white rounded-xl text-xs font-cinzel font-bold border border-rose-700 shadow-md transition-all"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{afisScanning ? 'Extracting Minutiae...' : 'Scan & Compare Latent Print'}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Latent Smudge */}
            <div className="p-5 rounded-xl bg-black border border-stone-800 relative flex flex-col items-center">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider mb-3">
                EXHIBIT A: Crime Scene Latent Lift (Study Vault Knob)
              </span>

              <div className="relative w-52 h-64 rounded-2xl border-2 border-stone-700 bg-stone-950 flex items-center justify-center overflow-hidden">
                <Fingerprint className="w-40 h-40 text-stone-600 opacity-60" />

                {/* Minutiae reticles */}
                {(afisScanning || afisMatched) && (
                  <>
                    <div className="absolute top-1/3 left-1/3 w-6 h-6 rounded-full border border-red-500 animate-ping pointer-events-none" />
                    <div className="absolute top-1/2 right-1/3 w-6 h-6 rounded-full border border-emerald-500 animate-pulse pointer-events-none" />
                    <div className="absolute bottom-1/4 left-1/2 w-6 h-6 rounded-full border border-amber-500 animate-pulse pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Suspect Match Result */}
            <div className="p-5 rounded-xl bg-black border border-stone-800 relative flex flex-col items-center justify-between">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider mb-3">
                AFIS Database Match: Evelyn Vance (Booking #8820)
              </span>

              <div className="relative w-52 h-64 rounded-2xl border-2 border-stone-700 bg-stone-950 flex items-center justify-center overflow-hidden">
                <Fingerprint className={`w-40 h-40 ${afisMatched ? 'text-emerald-500' : 'text-stone-700'}`} />

                {afisMatched && (
                  <div className="absolute inset-0 bg-emerald-950/30 flex items-center justify-center p-3 text-center">
                    <div className="p-3 rounded-xl bg-black/90 border border-emerald-600 text-emerald-300 font-mono text-xs shadow-2xl">
                      <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                      <div>16 MINUTIAE POINTS MATCHED</div>
                      <div className="text-[10px] text-stone-400 mt-1">Right Index Whorl (99.4%)</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full text-center text-xs font-mono text-stone-400 mt-3">
                {afisMatched
                  ? 'Verified: Evelyn Vance operated the biometric keypad prior to 10:45 PM.'
                  : 'Click "Scan & Compare" to run database matching.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STATION 4: OPTICAL COMPARATOR (TOOLMARKS) */}
      {/* ========================================================= */}
      {activeStation === 'optical' && (
        <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-base font-cinzel font-bold text-stone-100">
                Split-Lens Optical Toolmark Comparator
              </h3>
              <p className="text-xs text-stone-400 font-serif mt-0.5">
                Drag the divider slider to align microscopic striations from the glass vitrine edge with the seized diamond glass cutter.
              </p>
            </div>

            <div className="text-xs font-mono text-stone-400">
              ALIGNMENT: {comparatorSplit}%
            </div>
          </div>

          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-stone-800 bg-black select-none">
            {/* Left Image: Evidence Striation */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${comparatorSplit}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
                alt="Evidence Glass Vitrine Cut"
                className="absolute inset-0 w-full h-full object-cover filter contrast-150 grayscale"
                style={{ width: '100%', minWidth: '700px' }}
              />
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/85 text-[10px] font-mono text-amber-400 border border-amber-900/60">
                CRIME SCENE VITRINE (CASE #03)
              </div>
            </div>

            {/* Right Image: Seized Tool Striation */}
            <div
              className="absolute inset-y-0 right-0 overflow-hidden"
              style={{ width: `${100 - comparatorSplit}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80"
                alt="Seized Tool Striation"
                className="absolute inset-0 w-full h-full object-cover filter contrast-150 grayscale"
                style={{ width: '100%', minWidth: '700px' }}
              />
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/85 text-[10px] font-mono text-cyan-400 border border-cyan-900/60">
                CAPTAIN LAURENT TOOLKIT
              </div>
            </div>

            {/* Divider Line */}
            <div
              className="absolute inset-y-0 w-1 bg-red-500 shadow-2xl cursor-ew-resize flex items-center justify-center"
              style={{ left: `${comparatorSplit}%` }}
            >
              <div className="w-5 h-8 rounded bg-red-600 border border-white flex items-center justify-center text-white text-[10px]">
                ↔
              </div>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span>DRAG OPTICAL LENS COMPARATOR:</span>
              <span className="text-rose-400 font-bold">
                {Math.abs(comparatorSplit - 50) < 4 ? 'STRIATIONS COINCIDE (100% MATCH)' : 'SLIGHT OFFSET'}
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="85"
              value={comparatorSplit}
              onChange={(e) => setComparatorSplit(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-ew-resize accent-rose-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};
