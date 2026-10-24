import React, { useState, useRef, useEffect } from 'react';
import {
  Network,
  Plus,
  Trash2,
  Filter,
  Move,
  Info,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Link2,
  X,
  Skull
} from 'lucide-react';
import { MysteryCase, InvestigationSession, EvidenceLink, Clue, Suspect } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface InteractiveEvidenceBoardProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onAddLink: (link: Omit<EvidenceLink, 'id'>) => Promise<void>;
  onRemoveLink: (linkId: string) => Promise<void>;
  onSavePositions: (positions: Record<string, { x: number; y: number }>) => void;
}

interface BoardNode {
  id: string;
  type: 'clue' | 'suspect' | 'location';
  title: string;
  subtitle: string;
  image?: string;
  category?: string;
  color: string;
  x: number;
  y: number;
  data: Clue | Suspect | { name: string; description: string };
}

export const InteractiveEvidenceBoard: React.FC<InteractiveEvidenceBoardProps> = ({
  mysteryCase,
  session,
  onAddLink,
  onRemoveLink,
  onSavePositions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<BoardNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [targetConnectId, setTargetConnectId] = useState<string | null>(null);
  const [linkRelation, setLinkRelation] = useState<EvidenceLink['relationType']>('supports');
  const [linkNotes, setLinkNotes] = useState('');

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const assembledNodes: BoardNode[] = [];
    const discoveredClues = mysteryCase.clues.filter(c => session.discoveredClueIds.includes(c.id));

    // Suspects
    mysteryCase.suspects.forEach((s, idx) => {
      const savedPos = session.boardPositions[s.id];
      assembledNodes.push({
        id: s.id,
        type: 'suspect',
        title: s.name,
        subtitle: s.role,
        image: s.avatar,
        color: 'border-rose-900/80 bg-[#120a0e]/90',
        x: savedPos?.x ?? (80 + (idx % 2) * 260),
        y: savedPos?.y ?? (60 + Math.floor(idx / 2) * 160),
        data: s
      });
    });

    // Discovered Clues
    discoveredClues.forEach((c, idx) => {
      const savedPos = session.boardPositions[c.id];
      assembledNodes.push({
        id: c.id,
        type: 'clue',
        title: c.name,
        subtitle: `Relic: ${c.evidenceType}`,
        image: c.imageUrl,
        category: c.evidenceType,
        color: c.significance === 'crucial' ? 'border-amber-700/80 bg-[#160e0a]/90' : 'border-stone-700/80 bg-[#0d0d12]/90',
        x: savedPos?.x ?? (380 + (idx % 3) * 200),
        y: savedPos?.y ?? (80 + Math.floor(idx / 3) * 150),
        data: c
      });
    });

    // Locations
    mysteryCase.locations.forEach((loc, idx) => {
      const savedPos = session.boardPositions[loc.id];
      assembledNodes.push({
        id: loc.id,
        type: 'location',
        title: loc.name,
        subtitle: 'Crime Scene Area',
        image: loc.ambientImage,
        color: 'border-stone-800 bg-[#08080c]/90',
        x: savedPos?.x ?? (60 + idx * 240),
        y: savedPos?.y ?? 430,
        data: { name: loc.name, description: loc.description }
      });
    });

    setNodes(assembledNodes);
  }, [mysteryCase, session.discoveredClueIds]);

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;

    setNodes(prev =>
      prev.map(n => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            x: Math.max(20, Math.min(1100, e.clientX - dragOffset.x)),
            y: Math.max(20, Math.min(650, e.clientY - dragOffset.y))
          };
        }
        return n;
      })
    );
  };

  const handleMouseUp = () => {
    if (draggingNodeId) {
      const updatedPositions: Record<string, { x: number; y: number }> = {};
      nodes.forEach(n => {
        updatedPositions[n.id] = { x: n.x, y: n.y };
      });
      onSavePositions(updatedPositions);
      setDraggingNodeId(null);
    }
  };

  const handleStartConnect = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!connectingFromId) {
      setConnectingFromId(nodeId);
      soundManager.playKeyType();
    } else if (connectingFromId === nodeId) {
      setConnectingFromId(null);
    } else {
      setTargetConnectId(nodeId);
      setLinkModalOpen(true);
    }
  };

  const handleCreateLink = async () => {
    if (!connectingFromId || !targetConnectId) return;

    const fromNode = nodes.find(n => n.id === connectingFromId);
    const toNode = nodes.find(n => n.id === targetConnectId);

    if (fromNode && toNode) {
      await onAddLink({
        fromNodeId: fromNode.id,
        toNodeId: toNode.id,
        fromType: fromNode.type,
        toType: toNode.type,
        relationType: linkRelation,
        notes: linkNotes
      });
      soundManager.playClueFound();
    }

    setLinkModalOpen(false);
    setConnectingFromId(null);
    setTargetConnectId(null);
    setLinkNotes('');
  };

  const getRelationColor = (rel: EvidenceLink['relationType']) => {
    switch (rel) {
      case 'supports':
        return '#e11d48'; // crimson
      case 'contradicts':
        return '#f43f5e'; // blood rose
      case 'places_at':
        return '#fbbf24'; // amber
      case 'belongs_to':
        return '#a855f7'; // dark purple
      case 'motive_for':
        return '#ea580c'; // blood orange
      default:
        return '#78716c';
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="space-y-4 text-stone-200 select-none">
      {/* Board Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-stone-950 border border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-rose-950 text-xs font-mono text-rose-300">
            <Skull className="w-3.5 h-3.5 text-rose-500" />
            <span>Blood-Red Pinboard</span>
          </div>

          {connectingFromId && (
            <div className="px-3 py-1 rounded-lg bg-rose-950 border border-rose-600 text-rose-200 text-xs font-cinzel flex items-center gap-2 animate-pulse">
              <span>Select second clue to tether with crimson yarn...</span>
              <button onClick={() => setConnectingFromId(null)} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-stone-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Supports
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Contradicts
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Places At
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Motive
          </div>
        </div>

        <div className="text-xs text-stone-400 font-mono">
          {session.evidenceLinks.length} Blood Threads Tethered
        </div>
      </div>

      {/* Pinboard Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-rose-950/70 bg-[#050608] shadow-2xl cursor-grab active:cursor-grabbing horror-vignette"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(136,19,55,0.18) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Dark weathered forensic investigation corkboard background texture */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80"
            alt="Forensic Evidence Wall"
            className="w-full h-full object-cover opacity-15 filter contrast-125 brightness-50 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/80" />
        </div>
        {/* SVG Thread Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {session.evidenceLinks.map(link => {
            const fromNode = nodes.find(n => n.id === link.fromNodeId);
            const toNode = nodes.find(n => n.id === link.toNodeId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + 85;
            const y1 = fromNode.y + 40;
            const x2 = toNode.x + 85;
            const y2 = toNode.y + 40;
            const strokeColor = getRelationColor(link.relationType);

            return (
              <g key={link.id} className="group/thread">
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeDasharray={link.relationType === 'contradicts' ? '5,4' : undefined}
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
                <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="5" fill={strokeColor} />
              </g>
            );
          })}
        </svg>

        {/* Draggable Evidence Cards */}
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          const isConnecting = connectingFromId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={e => handleMouseDown(node.id, e)}
              onClick={() => setSelectedNodeId(node.id)}
              style={{ left: `${node.x}px`, top: `${node.y}px` }}
              className={`absolute z-20 w-44 p-3 rounded-2xl border-2 backdrop-blur-md shadow-2xl transition-shadow cursor-move ${node.color} ${
                isSelected ? 'ring-2 ring-rose-500 shadow-2xl scale-105' : 'hover:border-rose-700/80'
              } ${isConnecting ? 'ring-2 ring-rose-500 animate-pulse' : ''}`}
            >
              {/* Node Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-rose-300 px-1.5 py-0.2 rounded bg-black/80">
                  {node.type}
                </span>

                <button
                  onClick={e => handleStartConnect(node.id, e)}
                  title="Tether red thread"
                  className={`p-1 rounded-full text-xs transition-colors ${
                    isConnecting ? 'bg-rose-700 text-white' : 'bg-black/60 hover:bg-rose-800 text-stone-300 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3 h-3" />
                </button>
              </div>

              {/* Node Body */}
              <div className="flex items-center gap-2">
                {node.image && (
                  <img
                    src={node.image}
                    alt={node.title}
                    className="w-8 h-8 rounded-lg object-cover border border-stone-800 grayscale shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-cinzel font-bold text-stone-100 truncate">{node.title}</div>
                  <div className="text-[10px] text-stone-400 truncate font-serif">{node.subtitle}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col md:flex-row items-start justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4 flex-1">
            {selectedNode.image && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-stone-800 shrink-0 shadow-lg bg-black">
                <img
                  src={selectedNode.image}
                  alt={selectedNode.title}
                  className="w-full h-full object-cover filter contrast-125 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-1 inset-x-1 text-[8px] font-mono text-center text-rose-300 bg-black/80 rounded">
                  EVIDENCE
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900/60">
                  {selectedNode.type} File
                </span>
                <h4 className="text-base font-cinzel font-bold text-stone-100 truncate">{selectedNode.title}</h4>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-2xl mt-2 font-serif">
                {'description' in selectedNode.data
                  ? selectedNode.data.description
                  : 'bio' in selectedNode.data
                  ? selectedNode.data.bio
                  : ''}
              </p>
            </div>
          </div>

          {/* Links for this node */}
          <div className="w-full md:w-80">
            <div className="text-xs font-mono uppercase text-stone-400 font-semibold mb-2">
              Crimson Connections
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {session.evidenceLinks
                .filter(l => l.fromNodeId === selectedNode.id || l.toNodeId === selectedNode.id)
                .map(link => {
                  const otherId = link.fromNodeId === selectedNode.id ? link.toNodeId : link.fromNodeId;
                  const otherNode = nodes.find(n => n.id === otherId);
                  return (
                    <div
                      key={link.id}
                      className="p-2 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: getRelationColor(link.relationType) }}
                        />
                        <span className="font-semibold text-stone-400 uppercase text-[10px] font-mono">{link.relationType}:</span>
                        <span className="text-stone-200 truncate font-serif">{otherNode?.title || otherId}</span>
                      </div>
                      <button
                        onClick={() => onRemoveLink(link.id)}
                        className="text-stone-500 hover:text-rose-400 p-1"
                        title="Sever thread"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              {session.evidenceLinks.filter(l => l.fromNodeId === selectedNode.id || l.toNodeId === selectedNode.id).length === 0 && (
                <div className="text-[11px] text-stone-500 italic font-serif">No crimson threads tethered to this evidence yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link Creation Modal */}
      {linkModalOpen && connectingFromId && targetConnectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-stone-950 border border-rose-950/80 shadow-2xl p-6">
            <h3 className="text-base font-cinzel font-bold text-stone-100 mb-1">Tether Crimson Yarn</h3>
            <p className="text-xs text-stone-400 mb-4 font-serif">
              Establish the deductive relationship connecting these two pieces of crime evidence.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-stone-400 uppercase text-[10px] block mb-1">
                  Relationship Classification
                </label>
                <select
                  value={linkRelation}
                  onChange={e => setLinkRelation(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
                >
                  <option value="supports">Supports (Forensic alignment)</option>
                  <option value="contradicts">Contradicts (Disproves alibi / timeline)</option>
                  <option value="places_at">Places At (Establishes presence at scene)</option>
                  <option value="belongs_to">Belongs To (Ownership of relic)</option>
                  <option value="motive_for">Motive For (Financial or occult intent)</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-stone-400 uppercase text-[10px] block mb-1">
                  Investigator Reasoning Notes
                </label>
                <textarea
                  value={linkNotes}
                  onChange={e => setLinkNotes(e.target.value)}
                  placeholder="Record your deductive reasoning..."
                  rows={3}
                  className="w-full p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setLinkModalOpen(false);
                    setConnectingFromId(null);
                  }}
                  className="px-4 py-2 text-stone-400 hover:text-stone-200 font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLink}
                  className="px-4 py-2 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 text-white font-cinzel font-bold rounded-xl border border-rose-800/60 shadow-lg"
                >
                  Pin Thread
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
