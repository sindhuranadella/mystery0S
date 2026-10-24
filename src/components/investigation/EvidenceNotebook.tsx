import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Star,
  Search,
  Filter,
  CheckCircle2,
  Shield,
  Sparkles,
  Tag,
  Skull
} from 'lucide-react';
import { MysteryCase, InvestigationSession, PersonalNote, Clue } from '../../types/mystery';
import { soundManager } from '../../services/audioAmbiance';

interface EvidenceNotebookProps {
  mysteryCase: MysteryCase;
  session: InvestigationSession;
  onAddNote: (note: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateNote: (noteId: string, updates: Partial<PersonalNote>) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export const EvidenceNotebook: React.FC<EvidenceNotebookProps> = ({
  mysteryCase,
  session,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState<'clues' | 'notes'>('clues');
  const [search, setSearch] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<PersonalNote['category']>('theory');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const discoveredClues = mysteryCase.clues.filter(c => session.discoveredClueIds.includes(c.id));

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    soundManager.playKeyType();
    await onAddNote({
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      category: newNoteCategory,
      isImportant: false
    });

    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const filteredClues = discoveredClues.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.locationName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotes = session.personalNotes.filter(
    n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-stone-200">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('clues')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all ${
              activeTab === 'clues'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            Verified Forensic Relics ({discoveredClues.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-rose-950 text-rose-200 border border-rose-800/80 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            Inquisitor Notes ({session.personalNotes.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter records..."
            className="w-full pl-8 pr-3 py-1.5 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
          />
        </div>
      </div>

      {/* CLUES TAB */}
      {activeTab === 'clues' && (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredClues.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 bg-stone-950 rounded-2xl border border-stone-800 text-stone-500 text-xs font-serif">
              No relics uncovered matching query. Explore candlelit rooms to discover hidden traces.
            </div>
          ) : (
            filteredClues.map(clue => (
              <div
                key={clue.id}
                className="rounded-2xl bg-stone-950 border border-stone-800 hover:border-rose-900/60 transition-all flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {clue.imageUrl && (
                  <div className="relative h-44 w-full bg-black overflow-hidden group/img">
                    <img
                      src={clue.imageUrl}
                      alt={clue.name}
                      className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover/img:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[9px] font-mono text-amber-400 border border-amber-900/60">
                      FORENSIC EVIDENCE
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-950/90 text-[9px] font-mono text-rose-200 border border-red-800 font-bold">
                      EXHIBIT #{clue.id.slice(-4).toUpperCase()}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-rose-400 flex items-center gap-1">
                        <Skull className="w-3.5 h-3.5" />
                        Physical Case Relic
                      </span>
                      <span className="text-stone-400 text-[10px] uppercase font-mono">
                        Type: {clue.evidenceType}
                      </span>
                    </div>

                    <h4 className="text-sm font-cinzel font-bold text-stone-100 mb-2">{clue.name}</h4>
                    <p className="text-xs text-stone-400 leading-relaxed mb-3 font-serif">{clue.description}</p>

                    {clue.forensicNotes && (
                      <div className="mb-3 p-2 rounded-lg bg-black/50 border border-rose-950 text-[11px] font-mono text-rose-300/90 leading-relaxed">
                        {clue.forensicNotes}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span>Found: {clue.locationName}</span>
                    <span className="text-amber-500/90 capitalize">{clue.significance} lead</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {!isAddingNote ? (
            <button
              onClick={() => setIsAddingNote(true)}
              className="w-full p-3.5 rounded-2xl border border-dashed border-stone-800 hover:border-rose-900/60 hover:bg-stone-950 text-stone-400 hover:text-rose-300 text-xs font-cinzel font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Record Inquisitor Observation
            </button>
          ) : (
            <form onSubmit={handleCreateNote} className="p-5 rounded-2xl bg-stone-950 border border-rose-950/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-cinzel font-bold text-stone-100">Draft Inquisitor Note</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="text-xs text-stone-500 hover:text-stone-300 font-mono"
                >
                  Cancel
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  placeholder="Record Title..."
                  required
                  className="sm:col-span-2 px-3 py-2 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
                />

                <select
                  value={newNoteCategory}
                  onChange={e => setNewNoteCategory(e.target.value as any)}
                  className="px-3 py-2 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-700 font-mono"
                >
                  <option value="theory">Theory</option>
                  <option value="lead">Lead</option>
                  <option value="contradiction">Contradiction</option>
                  <option value="general">General</option>
                </select>
              </div>

              <textarea
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                placeholder="Detail your deductions, bloodline motives, or cross-examination strategy..."
                rows={4}
                required
                className="w-full p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-rose-700 font-serif"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-red-950 to-rose-900 hover:from-red-900 hover:to-rose-800 text-white font-cinzel font-bold rounded-xl text-xs transition-all border border-rose-800/60 shadow-lg"
                >
                  Save to Autopsy File
                </button>
              </div>
            </form>
          )}

          {/* Notes List */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="p-5 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-rose-400">
                      Category: {note.category}
                    </span>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-stone-600 hover:text-red-400 p-1"
                      title="Destroy Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-cinzel font-bold text-stone-100 mb-1">{note.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed whitespace-pre-line font-serif">{note.content}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 text-[10px] font-mono text-stone-600">
                  Last updated: {new Date(note.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
