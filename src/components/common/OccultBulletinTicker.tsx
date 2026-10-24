import React, { useState, useEffect } from 'react';
import { Skull, AlertCircle, Radio, Clock } from 'lucide-react';

export const OccultBulletinTicker: React.FC = () => {
  const bulletins = [
    'OCT 24 23:42 BST // SCOTLAND YARD CRIME UPDATE: Lord Harrington vault hinges coated with synthetic grease to silence ultrasonic alarm.',
    'CORONER MORGUE SLAB // TOXICOLOGY REPORT: Lethal monkshood aconitine extract confirmed in Marcus Vance espresso reservoir #3.',
    'SAINT-MALO HARBOR // MARITIME SALVAGE SEARCH: Industrial diamond suction glass cutter recovered from granite breakwater sewer.',
    'INTERROGATION CHAMBER // CONTRADICTION ALERT: Evelyn Vance Appraiser Badge #04 swiped into study at 10:22 PM, disproving library alibi.',
    'FORENSIC BALLISTICS // SPECTRAL MATCH: Zirconia replica faceted with micro-laser tooling calibrated to private Zurich syndicate specs.',
    'METROPOLITAN BUREAU // OCCULT WARNING: Unauthorized personnel barred from sub-vault server switches at CyberPeak Tower.'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % bulletins.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bulletins.length]);

  return (
    <div className="w-full bg-[#030406] border-b border-rose-950/60 text-stone-400 py-1.5 px-4 text-[11px] font-mono flex items-center justify-between gap-4 select-none relative z-30 overflow-hidden">
      {/* Sinister Red Horizon Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-red-600/40 via-rose-500/80 to-red-600/40" />

      {/* Left indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider text-[10px] bg-red-950/50 px-2 py-0.5 rounded border border-red-900/60">
          <Radio className="w-3 h-3 text-red-400 animate-pulse" />
          <span>INQUEST WIRE</span>
        </span>
        <span className="text-stone-500 text-[10px] hidden sm:inline">CH-07</span>
      </div>

      {/* Center scrolling bulletin text */}
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="animate-fade-in inline-flex items-center gap-2 text-stone-300">
          <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 inline" />
          <span className="tracking-wide">{bulletins[currentIndex]}</span>
        </div>
      </div>

      {/* Right Timecode */}
      <div className="shrink-0 hidden md:flex items-center gap-2 text-stone-500 text-[10px]">
        <Clock className="w-3 h-3 text-rose-600/70" />
        <span>{currentTime}</span>
      </div>
    </div>
  );
};
