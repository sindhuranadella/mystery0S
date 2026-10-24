import React, { useState } from 'react';
import { Search, Filter, Clock, MapPin, Users, ChevronRight, Skull, Folder, Flame } from 'lucide-react';
import { MysteryCase, Difficulty } from '../types/mystery';

interface CaseLibraryProps {
  cases: MysteryCase[];
  onSelectCase: (caseId: string) => void;
  activeCaseId?: string;
}

export const CaseLibrary: React.FC<CaseLibraryProps> = ({
  cases,
  onSelectCase,
  activeCaseId,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || c.crimeCategory === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 text-stone-200">
      {/* Subtle Criminal Archive Ambient Backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=80"
          alt="Criminal Archive Ambience"
          className="w-full h-full object-cover opacity-[0.05] filter contrast-150 brightness-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06070a] via-[#06070a]/85 to-[#06070a]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-cinzel font-bold tracking-tight text-stone-100">
            Confidential Case Archives
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-serif">
            Examine sealed investigative dockets. Each file contains verified physical proof, sworn depositions, and an immutable truth.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-400 self-start md:self-auto">
          {filteredCases.length} of {cases.length} Dockets Available
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 mb-8 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dossier by title, crime setting, or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-stone-900/80 rounded-xl border border-stone-800 focus:border-rose-700 focus:outline-none text-xs text-stone-200 placeholder:text-stone-500 font-serif"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-stone-400 font-mono hidden sm:inline">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-stone-900/80 rounded-xl border border-stone-800 text-xs text-stone-200 focus:border-rose-700 focus:outline-none cursor-pointer w-full sm:w-auto font-mono"
          >
            <option value="All">All Tiers</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-stone-400 font-mono hidden sm:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-stone-900/80 rounded-xl border border-stone-800 text-xs text-stone-200 focus:border-rose-700 focus:outline-none cursor-pointer w-full sm:w-auto font-mono"
          >
            <option value="All">All Categories</option>
            <option value="Grand Theft">Grand Theft</option>
            <option value="Homicide">Homicide</option>
            <option value="Corporate Sabotage">Corporate Sabotage</option>
          </select>
        </div>
      </div>

      {/* Case Cards Grid */}
      {filteredCases.length === 0 ? (
        <div className="text-center py-16 bg-stone-950 rounded-2xl border border-stone-800">
          <Folder className="w-12 h-12 text-stone-700 mx-auto mb-3" />
          <h3 className="text-base font-cinzel font-bold text-stone-300">No dockets found</h3>
          <p className="text-xs text-stone-500 mt-1 font-serif">Try modifying your query or category filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(c => {
            const isActive = activeCaseId === c.id;
            return (
              <div
                key={c.id}
                className={`flex flex-col justify-between rounded-2xl overflow-hidden bg-stone-950 border transition-all hover:scale-[1.01] hover:shadow-2xl ${
                  isActive ? 'border-rose-700/80 shadow-rose-950/30' : 'border-stone-800 hover:border-rose-900/50'
                }`}
              >
                {/* Cover Banner */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-full h-full object-cover brightness-[0.7] contrast-125 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-amber-400 bg-stone-950/90 px-2 py-0.5 rounded border border-amber-900/40">
                      {c.difficulty}
                    </span>
                    <span className="text-rose-300 bg-stone-950/90 px-2 py-0.5 rounded border border-rose-900/40">
                      {c.crimeCategory}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-200 text-[10px] font-mono font-bold uppercase animate-pulse">
                      Active Inquest
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-cinzel font-bold text-stone-100 line-clamp-1">{c.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4 font-serif">
                      {c.description}
                    </p>

                    <div className="space-y-2 text-xs text-stone-400 mb-4 font-serif">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-600" />
                        <span className="truncate">{c.location}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-600" />
                          <span>~{c.estimatedMinutes} mins</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-stone-600" />
                          <span>{c.suspects.length} Suspects</span>
                        </div>
                      </div>
                    </div>

                    {/* Criminal Evidence Relic Strip */}
                    <div className="mb-4 pt-3 border-t border-stone-800/60">
                      <div className="text-[10px] font-mono text-stone-500 mb-2 flex items-center justify-between">
                        <span>CRIME RELIC PHOTOGRAPHS</span>
                        <span className="text-rose-400/90">{c.clues.filter(cl => cl.imageUrl).length} ON RECORD</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.clues.filter(cl => cl.imageUrl).slice(0, 3).map((cl, idx) => (
                          <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-800 bg-black group/clue">
                            <img
                              src={cl.imageUrl}
                              alt={cl.name}
                              className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover/clue:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0.5 inset-x-0 text-[7px] font-mono text-center text-rose-300 font-bold">
                              #{idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                    <div className="text-[11px] text-stone-500 font-mono">
                      {c.clues.length} Forensic Relics
                    </div>
                    <button
                      onClick={() => onSelectCase(c.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-rose-900 text-white hover:bg-rose-800 shadow-md'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300'
                      }`}
                    >
                      <span>{isActive ? 'Resume Inquest' : 'Open Docket'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
