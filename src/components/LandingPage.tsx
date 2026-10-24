import React, { useState } from 'react';
import {
  Skull,
  Search,
  MessageSquare,
  Network,
  Clock,
  Award,
  ChevronRight,
  Flame,
  AlertTriangle,
  Compass,
  Zap,
  Eye,
  ShieldAlert,
  Camera,
  X,
  FileText,
  FlaskConical
} from 'lucide-react';
import { MysteryCase } from '../types/mystery';
import { soundManager } from '../services/audioAmbiance';

interface ForensicExhibit {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  stamp: string;
  caseId: string;
  caseTitle: string;
  docketNumber: string;
  description: string;
  forensicObservation: string;
  tags: string[];
}

interface LandingPageProps {
  featuredCase: MysteryCase;
  allCases: MysteryCase[];
  onStartCase: (caseId: string) => void;
  onExploreCases: () => void;
  onOpenLab?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  featuredCase,
  allCases,
  onStartCase,
  onExploreCases,
  onOpenLab,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedExhibit, setSelectedExhibit] = useState<ForensicExhibit | null>(null);

  const crimeExhibits: ForensicExhibit[] = [
    {
      id: 'exhibit-vault-heist',
      title: 'Lord Harrington Wall Vault Breach',
      subtitle: 'Scottish Highlands · Primary Crime Scene',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      stamp: 'EXHIBIT 01 · VAULT CRACKED',
      caseId: 'the-midnight-diamond',
      caseTitle: 'The Midnight Diamond',
      docketNumber: 'DOCKET #409-SC',
      description: 'The 600-pound reinforced steel wall vault pried ajar during the 50th Jubilee Gala. Synthetic safe grease applied to silent hinge locks prevented ultrasonic perimeter sirens from firing.',
      forensicObservation: 'Micro-laser score marks along the bezel rim confirm a fabricated cubic zirconia duplicate replaced the 45-carat Blue Sovereign before 10:45 PM.',
      tags: ['Heavy Vault', 'Silent Breach', 'Substituted Gem']
    },
    {
      id: 'exhibit-aconitine-morgue',
      title: 'Aconitine Bio-Toxin Autopsy Slab',
      subtitle: 'Neo-London Penthouse · Coroner Slab',
      image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1200&q=80',
      stamp: 'EXHIBIT 02 · LETHAL POISON',
      caseId: 'the-silent-alibi',
      caseTitle: 'The Silent Alibi',
      docketNumber: 'DOCKET #882-NL',
      description: 'Cold stainless steel autopsy tray holding confiscated bio-sensors and micro-pipette capsules. Victim Marcus Vance collapsed at his desk within 90 seconds of drinking his automated espresso.',
      forensicObservation: 'Gas chromatography detected lethal Monkshood aconitine extract injected through a 0.2mm needle aperture into coffee reservoir #3.',
      tags: ['Neurotoxin', 'IoT Dispenser', 'Autopsy Table']
    },
    {
      id: 'exhibit-burned-blackmail',
      title: 'Half-Incinerated Zurich Cablegram',
      subtitle: 'Stone Hearth Ashes · Blackmail Evidence',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      stamp: 'EXHIBIT 03 · CHARRED PAPER',
      caseId: 'the-midnight-diamond',
      caseTitle: 'The Midnight Diamond',
      docketNumber: 'DOCKET #117-ZH',
      description: 'Charred parchment recovered from glowing embers inside Lord Harrington’s private study hearth. Hastily burned by the perpetrator before fleeing into the conservatory gardens.',
      forensicObservation: 'Infrared imaging recovered fragmented script: "...FORECLOSURE IMMINENT... BUYER IN ZURICH WAITING 2.4M CHF CONTINGENT ON BLUE SOVEREIGN DELIVERY..."',
      tags: ['Blackmail Proof', 'Ash Reconstruction', 'Urgent Motive']
    },
    {
      id: 'exhibit-drowned-astrolabe',
      title: 'Saint-Malo Seawall Breakwater Salvage',
      subtitle: 'Brittany Ramparts · Stormy Atlantic Coast',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      stamp: 'EXHIBIT 04 · SEAWALL BREAK',
      caseId: 'echoes-in-the-fog',
      caseTitle: 'Echoes in the Fog',
      docketNumber: 'DOCKET #331-SM',
      description: 'Fog-drenched breakwater rocks where the museum gallery was breached during the 1:15 AM blackout. The heavy Royal Astrolabe was ditched in a watertight canister beneath the tidal surge.',
      forensicObservation: 'A specialized suction-cup diamond glass cutting apparatus was retrieved from the stone sewer drain below the seawall, bearing serial numbers matching local salvage gear.',
      tags: ['Atlantic Mist', 'Storm Blackout', 'Submerged Relic']
    },
    {
      id: 'exhibit-detention-chamber',
      title: 'Maximum Security Holding Cell 07',
      subtitle: 'Inquest Facility · Audio Surveillance',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      stamp: 'EXHIBIT 05 · DETENTION CELL',
      caseId: 'the-midnight-diamond',
      caseTitle: 'The Midnight Diamond',
      docketNumber: 'DOCKET #904-IT',
      description: 'Cold concrete interrogation chamber illuminated by a 500W overhead beam. Suspects are cross-examined against physical proof, electronic card logs, and alibi timestamps.',
      forensicObservation: 'Contradiction detection logs record suspect alibi collapse when confronted with electronic study card swipes and soil-stained evening gloves.',
      tags: ['High-Power Beam', 'Alibi Breakdown', 'Cross-Examination']
    },
    {
      id: 'exhibit-luminol-spatter',
      title: 'Forensic Luminol 365nm Latent Trails',
      subtitle: 'Ultraviolet Spectrum · Biological Traces',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      stamp: 'EXHIBIT 06 · BLOOD LUMINOL',
      caseId: 'the-silent-alibi',
      caseTitle: 'The Silent Alibi',
      docketNumber: 'DOCKET #662-UV',
      description: 'Fluorescent biological and chemical smears illuminated under 365nm UV forensic lamps. Wiped surfaces appear clean in visible light, but glow intensely under forensic wavelength.',
      forensicObservation: 'Hurried directional wipe pattern shows the perpetrator attempted to cleanse the espresso drip tray with alcohol wipes before the security patrol arrived.',
      tags: ['UV 365nm', 'Fluorescent Decal', 'Directional Spatter']
    }
  ];

  const faqs = [
    {
      q: 'How does the interrogation chamber prevent suspects from lying about reality?',
      a: 'The server controls the immutable truth of the case independently of the AI dialogue engine. Suspects are bound by strict fact boundaries and alibi secrets; attempts to extract false confessions or manipulate timestamps are met with in-character deflections.'
    },
    {
      q: 'Can cases be solved without an external AI key?',
      a: 'Yes. MysteryOS includes a fully authored deterministic scripted interrogation engine. Every case is fully solvable, testable, and scorably verified offline or online.'
    },
    {
      q: 'What is the 100-point forensic scoring rubric?',
      a: '30 points for the true culprit, 15 points for the verified motive, 15 points for the execution method, 25 points for supporting forensic clues, and 15 points for chronological timeline alignment. Deductions are transparently applied if hints are invoked.'
    },
    {
      q: 'How does the Contradiction Detection engine function?',
      a: 'The engine compares suspect testimony against forensic records, access logs, and environmental footprints. When physical proof directly disproves a suspect claim, a contradiction alert is added to your investigation docket.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#06070a] text-stone-200 flex flex-col selection:bg-rose-900/40">
      {/* Horror Hero Section with Fog & Vignette */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-rose-950/40">
        {/* Shocking Criminal Crime Scene Background Image with Deep Atmospheric Mask */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
            alt="Dark Forensic Crime Scene"
            className="w-full h-full object-cover opacity-25 filter contrast-125 brightness-40 mix-blend-luminosity scale-105"
          />
          {/* Ominous Forensic Caution Tape Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-rose-700 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06070a]/90 via-[#06070a]/70 to-[#06070a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#06070a]/80 to-[#06070a]" />
        </div>

        {/* Sinister Red Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-rose-950/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-red-950/20 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-950 border border-rose-900/50 text-rose-300 text-xs font-mono mb-6">
              <Skull className="w-3.5 h-3.5 text-rose-500" />
              <span>Occult Inquest & Forensic Bureau</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-cinzel font-extrabold tracking-tight leading-tight sm:leading-none mb-6">
              Some secrets should remain buried.{' '}
              <span className="block mt-2 bg-gradient-to-r from-rose-400 via-red-300 to-stone-200 bg-clip-text text-transparent glow-crimson">
                Every clue bleeds the truth.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-400 mb-8 leading-relaxed max-w-2xl font-serif">
              Step into the darkened chambers of MysteryOS. Inspect macabre crime scenes, cross-examine terrified suspects under cold spotlights, unmask contradictions, and assemble evidence on a crimson pinboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onStartCase(featuredCase.id)}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-red-900 via-rose-900 to-stone-900 hover:from-red-800 hover:to-rose-800 text-white rounded-xl text-sm font-cinzel font-bold shadow-xl shadow-black transition-all hover:scale-[1.02] border border-rose-700/60"
              >
                <Compass className="w-4 h-4 text-rose-300" />
                <span>Begin Inquest: The Midnight Diamond</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCases}
                className="flex items-center gap-2 px-5 py-3.5 bg-stone-950 hover:bg-stone-900 text-stone-300 hover:text-white rounded-xl text-sm font-semibold border border-stone-800 hover:border-rose-900/60 transition-all font-cinzel"
              >
                <Search className="w-4 h-4 text-stone-500" />
                <span>Examine Archives ({allCases.length} Cases)</span>
              </button>

              {onOpenLab && (
                <button
                  onClick={onOpenLab}
                  className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-stone-950 to-stone-900 hover:from-rose-950/60 hover:to-stone-900 text-rose-300 hover:text-rose-100 rounded-xl text-sm font-semibold border border-rose-900/60 hover:border-rose-600 transition-all font-cinzel shadow-lg"
                >
                  <FlaskConical className="w-4 h-4 text-rose-400" />
                  <span>Forensic Science Lab</span>
                </button>
              )}
            </div>

            {/* Verification Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 w-full pt-8 border-t border-rose-950/40">
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <div className="text-2xl font-bold text-stone-100 font-mono">100%</div>
                <div className="text-xs text-stone-400 font-mono">Deterministic Scoring</div>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <div className="text-2xl font-bold text-rose-400 font-mono">4 Suspects</div>
                <div className="text-xs text-stone-400 font-mono">Guarded AI Interrogation</div>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <div className="text-2xl font-bold text-stone-300 font-mono">10 Relics</div>
                <div className="text-xs text-stone-400 font-mono">Interactive Crime Clues</div>
              </div>
              <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80">
                <div className="text-2xl font-bold text-amber-500 font-mono">3 Tiers</div>
                <div className="text-xs text-stone-400 font-mono">Progressive Hints</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Spotlight */}
      <section className="py-16 border-b border-rose-950/40 bg-[#07080d]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <div className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
                Primary Crime Docket
              </div>
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-stone-100">
                Case File #01: The Midnight Diamond
              </h2>
            </div>
            <button
              onClick={() => onStartCase(featuredCase.id)}
              className="px-4 py-2 text-xs font-cinzel font-bold rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900 transition-all flex items-center gap-1.5"
            >
              Open Dossier <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid md:grid-cols-12 gap-6 bg-stone-950 rounded-2xl border border-rose-950/60 overflow-hidden shadow-2xl">
            <div className="md:col-span-5 relative min-h-[260px] md:min-h-full">
              <img
                src={featuredCase.coverImage}
                alt={featuredCase.title}
                className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-stone-950" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-stone-950/90 text-amber-400 border border-amber-900/60">
                  {featuredCase.difficulty}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-2">
                  <span>{featuredCase.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>Est. {featuredCase.estimatedMinutes} mins</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-rose-400">{featuredCase.crimeCategory}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-stone-100 mb-3">
                  {featuredCase.tagline}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed mb-6 font-serif">
                  {featuredCase.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                    <div className="text-[11px] text-stone-400 font-mono">Suspects in Custody</div>
                    <div className="text-sm font-semibold text-stone-200 mt-0.5">4 Interrogable</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                    <div className="text-[11px] text-stone-400 font-mono">Forensic Traces</div>
                    <div className="text-sm font-semibold text-stone-200 mt-0.5">{featuredCase.clues.length} Interactive Clues</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900/60 border border-stone-800">
                    <div className="text-[11px] text-stone-400 font-mono">Concealed Inconsistencies</div>
                    <div className="text-sm font-semibold text-rose-400 mt-0.5">{featuredCase.contradictions.length} Hidden Lies</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-rose-950/40">
                <button
                  onClick={() => onStartCase(featuredCase.id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 border border-rose-700/60 text-white rounded-lg text-xs font-cinzel font-bold transition-all shadow-md"
                >
                  Enter Crime Scene
                </button>
                <span className="text-xs text-stone-400 font-mono">
                  Immutable Solution · Real Contradiction Rules
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Macabre Crime Evidence & Forensic Polaroids Gallery */}
      <section className="py-20 border-b border-rose-950/60 bg-[#040508] relative overflow-hidden">
        {/* Background dark crime ambiance texture */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <img
            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=2000&q=80"
            alt="Forensic Decals"
            className="w-full h-full object-cover filter contrast-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040508] via-transparent to-[#040508]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-900/60 text-rose-300 text-xs font-mono mb-3">
                <Skull className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>CONFIDENTIAL POLICE ARCHIVES · EXHIBIT DOSSIERS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-stone-100">
                The Macabre Evidence Vault
              </h2>
              <p className="text-sm text-stone-400 mt-2 max-w-2xl font-serif">
                Autopsy tables, severed safe bolts, incinerated blackmail dispatches, and latent arterial spatter. Every relic tells the terrible truth of what occurred in the dark.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{crimeExhibits.length} Forensic Polaroids Logged</span>
            </div>
          </div>

          {/* Crime Polaroids Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crimeExhibits.map(exhibit => (
              <div
                key={exhibit.id}
                onClick={() => {
                  soundManager.playKeyType();
                  setSelectedExhibit(exhibit);
                }}
                className="group relative rounded-2xl bg-stone-950 border border-stone-800/90 hover:border-red-800/80 transition-all duration-300 overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] flex flex-col justify-between"
              >
                {/* Red pushpin visual detail */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 w-3.5 h-3.5 rounded-full bg-red-600 border border-red-400 shadow-md flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white opacity-80" />
                </div>

                {/* Polaroid Image Frame */}
                <div className="relative h-56 w-full overflow-hidden bg-black pt-5 px-3">
                  <div className="relative w-full h-full rounded-xl overflow-hidden border border-stone-800">
                    <img
                      src={exhibit.image}
                      alt={exhibit.title}
                      className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30 pointer-events-none" />

                    {/* Police Tape Header Ribbon */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 border border-amber-900/60 text-[9px] font-mono text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span>CRIME SCENE EVIDENCE</span>
                    </div>

                    {/* Exhibit Code Stamp */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-red-950/90 text-rose-200 px-2 py-0.5 rounded border border-red-800 font-bold">
                        {exhibit.stamp}
                      </span>
                      <span className="bg-black/80 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                        {exhibit.docketNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Exhibit Details Card */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-rose-400/90 font-mono uppercase tracking-wider mb-1">
                      {exhibit.subtitle}
                    </div>
                    <h3 className="text-base font-cinzel font-bold text-stone-100 mb-2 group-hover:text-rose-300 transition-colors">
                      {exhibit.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-serif mb-4">
                      {exhibit.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {exhibit.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 text-stone-400 border border-stone-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-cinzel font-semibold text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Examine <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forensic Toolkit Pillars */}
      <section className="py-16 border-b border-rose-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-2">
              Horror Investigation Toolkit
            </h2>
            <h3 className="text-3xl font-cinzel font-bold text-stone-100">
              The Investigator's Instruments
            </h3>
            <p className="text-sm text-stone-400 mt-2 font-serif">
              Every system is engineered to provide genuine procedural deductions, not random luck.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-900/40 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-base font-cinzel font-bold text-stone-100 mb-2">Scene Hotspots & Autopsy</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-serif">
                Explore candlelit rooms, investigate opened safes, and inspect discarded objects. Clues demand prerequisites or keys before revealing their secrets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-300 mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-cinzel font-bold text-stone-100 mb-2">Interrogation Chamber</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-serif">
                Confront suspects with physical proof. Constrained by secrets and fears, their demeanor cracks when caught in an impossible alibi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-cinzel font-bold text-stone-100 mb-2">Contradiction Engine</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-serif">
                Deterministic detection compares testimony with timestamps and grease samples, registering inconsistencies as actionable investigative leads.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-900/40 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <h4 className="text-base font-cinzel font-bold text-stone-100 mb-2">Crimson String Pinboard</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-serif">
                Drag and pin clues, suspects, and murder locations. Connect them with blood-red threads to visualize criminal associations and motives.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-900/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-cinzel font-bold text-stone-100 mb-2">Timeline of Dread</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-serif">
                Reconstruct the critical hour of the crime. The timeline engine immediately flags chronologically impossible claims and forged alibis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-200 mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-cinzel font-bold text-stone-100 mb-2">100-Point Deduction Rubric</h4>
              <p className="text-xs text-stone-400 leading-relaxed font-serif">
                Culprit (30 pts), Motive (15 pts), Method (15 pts), Forensic Evidence (25 pts), and Timeline (15 pts). Lucky guesses yield zero; rigorous proofs triumph.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Field Reports */}
      <section className="py-14 border-b border-rose-950/40 bg-[#07080d]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase text-stone-400 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
              Coroner Archive Samples
            </span>
            <h3 className="text-xl font-cinzel font-bold text-stone-200 mt-2">
              Deductions in the Dark
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 font-mono">Score: 95/100</span>
                <span className="text-[10px] text-stone-400 font-mono">Deduction: Verified</span>
              </div>
              <p className="text-xs text-stone-300 italic mb-4 font-serif">
                “By correlating the Appraiser Badge swipe at 10:22 PM with the greased silk glove buried in the conservatory, I dismantled Evelyn Vance\'s alibi completely.”
              </p>
              <div className="text-[11px] text-stone-400 font-mono">— Inquest Record #842</div>
            </div>

            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-400 font-mono">Score: 88/100</span>
                <span className="text-[10px] text-stone-400 font-mono">Deduction: High Accuracy</span>
              </div>
              <p className="text-xs text-stone-300 italic mb-4 font-serif">
                “The gold cufflink under the vault was a deliberate plant. The high-heel mud prints in the garden proved Julian Croft couldn’t be the intruder.”
              </p>
              <div className="text-[11px] text-stone-400 font-mono">— Inquest Record #919</div>
            </div>

            <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 font-mono">Score: 78/100</span>
                <span className="text-[10px] text-stone-400 font-mono">Deduction: Solved (1 Hint)</span>
              </div>
              <p className="text-xs text-stone-300 italic mb-4 font-serif">
                “The scorched cablegram recovered from the stone fireplace exposed the secret Zurich buyer and established the motive conclusively.”
              </p>
              <div className="text-[11px] text-stone-400 font-mono">— Inquest Record #731</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-b border-rose-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-cinzel font-bold text-stone-100">
              Frequently Asked Inquiries
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-mono">
              Investigation mechanics, AI safeguards, and forensic truth rules.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-stone-950 border border-stone-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-stone-900/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-stone-200">
                    {faq.q}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-stone-500 transition-transform ${
                      openFaq === idx ? 'rotate-90 text-rose-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-stone-400 leading-relaxed border-t border-stone-800 bg-[#050608] font-serif">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-[#040507] border-t border-rose-950/40 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-900/40 flex items-center justify-center text-rose-400">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <div className="font-cinzel font-bold text-stone-300">MysteryOS Occult Archives</div>
              <div className="text-[11px] text-stone-500">Autonomous Evidence & Deduction Architecture</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-stone-500 font-mono">
            <span>Server: Express + Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Database: Normalized Relational Session Model</span>
            <span aria-hidden="true">·</span>
            <span>Privacy: Zero Personal Telemetry</span>
          </div>
        </div>
      </footer>

      {/* Forensic Exhibit Inspection Modal */}
      {selectedExhibit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#09080e] border border-rose-900/80 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Top header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                  {selectedExhibit.stamp} · {selectedExhibit.docketNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedExhibit(null)}
                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 overflow-y-auto space-y-5 flex-1 pr-1">
              {/* Evidence Photo */}
              <div className="relative rounded-xl overflow-hidden border-2 border-stone-800 bg-black shadow-2xl">
                <img
                  src={selectedExhibit.image}
                  alt={selectedExhibit.title}
                  className="w-full h-64 sm:h-80 object-cover filter contrast-125 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/85 text-[10px] font-mono text-amber-400 border border-amber-900/60 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>POLICE FORENSIC RECORD · 10 CM SCALE</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                  <span className="bg-stone-950/90 text-stone-300 px-2.5 py-1 rounded border border-rose-950">
                    {selectedExhibit.subtitle}
                  </span>
                  <span className="bg-red-950/90 text-rose-200 px-2.5 py-1 rounded border border-red-700 font-bold">
                    INQUEST EXHIBIT
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-cinzel font-bold text-stone-100 mb-2">
                  {selectedExhibit.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed font-serif">
                  {selectedExhibit.description}
                </p>
              </div>

              {/* Forensic Laboratory Finding */}
              <div className="p-4 rounded-xl bg-black/60 border border-rose-950 text-xs font-mono text-rose-300/90 leading-relaxed flex items-start gap-3">
                <FileText className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-400 mb-1 uppercase text-[10px]">
                    Coroner & Laboratory Pathology Log:
                  </div>
                  <p>{selectedExhibit.forensicObservation}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedExhibit.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-stone-900 text-stone-300 border border-stone-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-stone-800 shrink-0 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedExhibit(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-mono transition-colors"
              >
                Close Docket (ESC)
              </button>

              <button
                onClick={() => {
                  const targetCaseId = selectedExhibit.caseId;
                  setSelectedExhibit(null);
                  onStartCase(targetCaseId);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-900 to-rose-900 hover:from-red-800 hover:to-rose-800 text-white text-xs font-cinzel font-bold border border-rose-700 shadow-lg shadow-black transition-all"
              >
                <span>Launch Case: {selectedExhibit.caseTitle}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
