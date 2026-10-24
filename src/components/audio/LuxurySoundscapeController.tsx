import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Skull,
  Disc,
  Heart,
  Sparkles,
  Zap
} from 'lucide-react';
import { soundManager } from '../../services/audioAmbiance';

export const LuxurySoundscapeController: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'none' | 'rain' | 'drone' | 'vinyl' | 'heartbeat'>('none');
  const [volume, setVolume] = useState(soundManager.volume);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const channels = [
    {
      id: 'rain' as const,
      name: 'Highland Storm',
      sub: 'Rain & Thunder',
      icon: CloudRain,
      desc: 'Torrential Scottish rain on leaded glass windows'
    },
    {
      id: 'drone' as const,
      name: 'Morgue Drone',
      sub: '55Hz Sub-Bass',
      icon: Skull,
      desc: 'Cavernous binaural resonance of the autopsy vault'
    },
    {
      id: 'vinyl' as const,
      name: 'Noir Gramophone',
      sub: 'Vinyl Crackle',
      icon: Disc,
      desc: '1920s wax disc hiss and needle surface noise'
    },
    {
      id: 'heartbeat' as const,
      name: 'Adrenaline Pulse',
      sub: 'Cardiac Rhythm',
      icon: Heart,
      desc: 'Tense physiological pulse under interrogation'
    }
  ];

  // Oscilloscope canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(soundManager.analyser ? soundManager.analyser.frequencyBinCount : 32);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (soundManager.analyser && activeChannel !== 'none' && !isMuted) {
        soundManager.analyser.getByteFrequencyData(dataArray);
      } else {
        // Idle gentle waveform
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.sin(Date.now() * 0.003 + i * 0.2) * 8 + 8;
        }
      }

      const barWidth = (canvas.width / dataArray.length) * 1.5;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85 + 2;
        const red = Math.min(255, 160 + dataArray[i]);
        const green = Math.max(20, 40 - dataArray[i] * 0.1);
        const blue = Math.max(30, 60 - dataArray[i] * 0.2);

        ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.85)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeChannel, isMuted]);

  const handleSelectChannel = (ch: 'rain' | 'drone' | 'vinyl' | 'heartbeat') => {
    if (activeChannel === ch) {
      soundManager.stopSoundscape();
      setActiveChannel('none');
    } else {
      soundManager.startSoundscape(ch);
      setActiveChannel(ch);
    }
    soundManager.playKeyType();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundManager.setVolume(newVol);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Minimized Floating Bar */}
      {!isExpanded ? (
        <div
          onClick={() => {
            soundManager.playKeyType();
            setIsExpanded(true);
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-stone-950/95 border border-rose-900/60 shadow-2xl hover:border-rose-600/80 cursor-pointer backdrop-blur-md transition-all group hover:scale-105"
        >
          {/* Waveform visualizer mini canvas */}
          <canvas
            ref={canvasRef}
            width={48}
            height={20}
            className="w-12 h-5 rounded opacity-80"
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-stone-200 group-hover:text-rose-300">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Horror Soundscape</span>
            </div>
            <span className="text-[9px] font-mono text-stone-500">
              {activeChannel === 'none' ? 'Synthesizer Idle' : `Channel: ${activeChannel.toUpperCase()}`}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMute();
            }}
            className="p-1 rounded-md text-stone-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-600" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
          </button>
        </div>
      ) : (
        /* Expanded High-End Deck */
        <div className="w-80 sm:w-88 rounded-2xl bg-[#08070d] border border-rose-900/80 shadow-2xl shadow-black p-5 backdrop-blur-xl animate-fade-in flex flex-col gap-4 text-stone-200">
          {/* Deck Header */}
          <div className="flex items-center justify-between pb-3 border-b border-rose-950/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-950/60 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-cinzel font-bold text-rose-100">Occult Audio Deck</h4>
                <div className="text-[9px] font-mono text-stone-500">AM 1420 KHZ // ATMOSPHERIC GENERATOR</div>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playKeyType();
                setIsExpanded(false);
              }}
              className="p-1 rounded-lg hover:bg-stone-900 text-stone-400 hover:text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Oscilloscope Waveform Monitor */}
          <div className="relative rounded-xl p-3 bg-black/80 border border-stone-800/80 overflow-hidden">
            <div className="flex items-center justify-between text-[9px] font-mono text-rose-400/90 mb-1.5">
              <span>FREQUENCY MONITOR</span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${activeChannel !== 'none' && !isMuted ? 'bg-red-500 animate-ping' : 'bg-stone-600'}`} />
                {activeChannel !== 'none' && !isMuted ? 'BROADCASTING' : 'STANDBY'}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={260}
              height={36}
              className="w-full h-9 rounded bg-[#030306]"
            />
          </div>

          {/* Channels Selector Grid */}
          <div className="grid grid-cols-2 gap-2">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const isSelected = activeChannel === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChannel(ch.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/50 border-rose-700 text-rose-100 shadow-md ring-1 ring-rose-700/50'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-stone-500'}`} />
                    <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-black/60 text-stone-400">
                      {isSelected ? 'ON AIR' : 'OFF'}
                    </span>
                  </div>
                  <div className="text-xs font-cinzel font-bold truncate">{ch.name}</div>
                  <div className="text-[9px] font-mono text-stone-500 truncate">{ch.sub}</div>
                </button>
              );
            })}
          </div>

          {/* Volume Fader & Mute Control */}
          <div className="pt-2 border-t border-rose-950/60 flex items-center justify-between gap-3 text-xs">
            <button
              onClick={handleToggleMute}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
              <span className="text-[10px] font-mono">{isMuted ? 'Muted' : 'Live'}</span>
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-[9px] font-mono text-stone-500">VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <span className="text-[9px] font-mono text-stone-400 w-7 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
