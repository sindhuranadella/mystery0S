import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { CaseLibrary } from './components/CaseLibrary';
import { InvestigationView } from './components/investigation/InvestigationView';
import { CreatorStudio } from './components/creator/CreatorStudio';
import { ProfileModal } from './components/profile/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';
import { OccultBulletinTicker } from './components/common/OccultBulletinTicker';
import { LuxurySoundscapeController } from './components/audio/LuxurySoundscapeController';
import { DetectiveJournalDrawer } from './components/journal/DetectiveJournalDrawer';
import { ForensicLab } from './components/lab/ForensicLab';
import { MysteryCase, InvestigationSession, User, Clue, PersonalNote, EvidenceLink, DialogueMessage, PlayerTimelineEntry, Hypothesis, AccusationSubmission, ScoreReport, VerifiedSolution } from './types/mystery';
import { INITIAL_CASES } from './data/seedCases';

export function App() {
  const [user, setUser] = useState<User>({
    id: 'usr_default',
    username: 'DetectiveHolt',
    email: 'sindhura.nadella06@gmail.com',
    createdAt: '2026-10-24T12:00:00Z',
    rank: 'Investigator',
    experiencePoints: 850,
    casesCompleted: 1,
    casesAttempted: 2,
    totalEvidenceDiscovered: 14,
    averageScore: 88,
    achievements: ['first_clue', 'truth_unmasked', 'timeline_architect']
  });

  const [cases, setCases] = useState<MysteryCase[]>(INITIAL_CASES);
  const [activeView, setActiveView] = useState<'landing' | 'cases' | 'dashboard' | 'investigation' | 'creator' | 'lab'>('landing');
  const [activeSession, setActiveSession] = useState<InvestigationSession | null>(null);
  const [activeCase, setActiveCase] = useState<MysteryCase | null>(null);
  const [authToken, setAuthToken] = useState<string>('default_token_key');

  const [profileOpen, setProfileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);

  // Fetch initial case files and user status
  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => {
        if (data.cases && data.cases.length > 0) {
          setCases(data.cases);
        }
      })
      .catch(() => {});

    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Global hotkey [J] for Field Journal
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.key === 'j' || e.key === 'J') && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setJournalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Start or resume an investigation session
  const handleStartCase = async (caseId: string) => {
    try {
      const res = await fetch('/api/sessions/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ caseId })
      });
      const data = await res.json();
      if (data.session && data.case) {
        setActiveSession(data.session);
        setActiveCase(data.case);
        setActiveView('investigation');
      }
    } catch (err) {
      console.error('Failed to start case session:', err);
      // Fallback local session if offline
      const selected = cases.find(c => c.id === caseId) || cases[0];
      const fallbackSession: InvestigationSession = {
        id: `sess_local_${Date.now()}`,
        userId: user.id,
        caseId: selected.id,
        startedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        discoveredClueIds: [],
        exploredLocationIds: [selected.locations[0]?.id || ''],
        inspectedObjectIds: [],
        unlockedKeys: [],
        personalNotes: [
          {
            id: `note_${Date.now()}`,
            title: 'Initial Case Briefing',
            content: `Incident: ${selected.title}. Focus on collecting verified physical evidence and cross-referencing alibis.`,
            category: 'general',
            isImportant: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        evidenceLinks: [],
        boardPositions: {},
        dialogueHistory: {},
        playerTimeline: selected.timelineEvents.map((e, idx) => ({
          eventId: e.id,
          proposedOrder: idx + 1,
          userNotes: ''
        })),
        unlockedHints: [],
        detectedContradictionIds: [],
        hypothesis: {
          suspectedCulpritId: '',
          proposedMotive: '',
          proposedMethod: '',
          sequenceOfEvents: '',
          supportingClueIds: [],
          contradictoryClueIds: [],
          unresolvedQuestions: '',
          confidenceLevel: 50,
          notes: ''
        },
        isCompleted: false
      };
      setActiveSession(fallbackSession);
      setActiveCase(selected);
      setActiveView('investigation');
    }
  };

  // Inspect Scene Object Handler
  const handleInspectObject = async (locationId: string, objectId: string) => {
    if (!activeSession) return { inspectMessage: '', newlyDiscoveredClue: null };

    try {
      const res = await fetch(`/api/sessions/${activeSession.id}/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ locationId, objectId })
      });
      const data = await res.json();
      if (data.session) {
        setActiveSession(data.session);
      }
      return data;
    } catch {
      return {
        inspectMessage: 'Unable to examine object right now.',
        newlyDiscoveredClue: null
      };
    }
  };

  // Explore Location Handler
  const handleExploreLocation = async (locationId: string) => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/api/sessions/${activeSession.id}/explore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ locationId })
      });
      const data = await res.json();
      if (data.session) {
        setActiveSession(data.session);
      }
    } catch {}
  };

  // Interrogate Suspect Handler
  const handleSendMessage = async (suspectId: string, question: string): Promise<DialogueMessage> => {
    if (!activeSession) throw new Error('No active session');

    const res = await fetch(`/api/sessions/${activeSession.id}/interrogate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ suspectId, question })
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
    return data.message;
  };

  // Add Evidence Link Handler
  const handleAddLink = async (link: Omit<EvidenceLink, 'id'>) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/evidence-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(link)
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  // Remove Evidence Link Handler
  const handleRemoveLink = async (linkId: string) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/evidence-links/${linkId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  // Save Board Coordinates Handler
  const handleSavePositions = async (positions: Record<string, { x: number; y: number }>) => {
    if (!activeSession) return;
    await fetch(`/api/sessions/${activeSession.id}/board-positions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ positions })
    });
  };

  // Save Timeline Reconstruction Handler
  const handleSaveTimeline = async (timeline: PlayerTimelineEntry[]) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/timeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ playerTimeline: timeline })
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  // Notes CRUD Handlers
  const handleAddNote = async (note: Omit<PersonalNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(note)
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  const handleUpdateNote = async (noteId: string, updates: Partial<PersonalNote>) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/notes/${noteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  // Save Hypothesis Handler
  const handleSaveHypothesis = async (hypo: Hypothesis) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/hypothesis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ hypothesis: hypo })
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  // Unlock Hint Handler
  const handleUnlockHint = async (tier: number) => {
    if (!activeSession) return;
    const res = await fetch(`/api/sessions/${activeSession.id}/hints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ tier })
    });
    const data = await res.json();
    if (data.session) {
      setActiveSession(data.session);
    }
  };

  // Submit Formal Accusation Handler
  const handleSubmitAccusation = async (submission: AccusationSubmission): Promise<{
    report: ScoreReport;
    verifiedSolution: VerifiedSolution;
  }> => {
    if (!activeSession) throw new Error('No active investigation session');

    const res = await fetch(`/api/sessions/${activeSession.id}/accuse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ accusation: submission })
    });
    const data = await res.json();
    if (data.session) setActiveSession(data.session);
    if (data.user) setUser(data.user);

    return {
      report: data.report,
      verifiedSolution: data.verifiedSolution
    };
  };

  // Publish Case Handler
  const handlePublishCase = async (newCase: MysteryCase) => {
    const res = await fetch('/api/creator/cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ case: newCase })
    });
    const data = await res.json();
    if (data.case) {
      setCases(prev => [data.case, ...prev]);
      setActiveView('cases');
    }
  };

  // Profile Update Handler
  const handleUpdateProfile = async (newUsername: string) => {
    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ username: newUsername })
    });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
    }
  };

  const featuredCase = cases.find(c => c.id === 'the-midnight-diamond') || cases[0];

  return (
    <div className="min-h-screen bg-[#050609] text-stone-100 flex flex-col font-sans selection:bg-rose-900/40 relative">
      {/* Navigation Header */}
      <Navbar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenJournal={() => setJournalOpen(true)}
        hasActiveInvestigation={Boolean(activeSession && !activeSession.isCompleted)}
        onContinueActiveCase={() => setActiveView('investigation')}
      />

      {/* Occult Incident Wire Bulletin Ticker */}
      <OccultBulletinTicker />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            featuredCase={featuredCase}
            allCases={cases}
            onStartCase={handleStartCase}
            onExploreCases={() => setActiveView('cases')}
            onOpenLab={() => setActiveView('lab')}
          />
        )}

        {activeView === 'cases' && (
          <CaseLibrary
            cases={cases}
            onSelectCase={handleStartCase}
            activeCaseId={activeSession?.caseId}
          />
        )}

        {activeView === 'lab' && (
          <ForensicLab
            onOpenCase={handleStartCase}
          />
        )}

        {activeView === 'dashboard' && (
          <Dashboard
            user={user}
            allCases={cases}
            activeSession={activeSession}
            onOpenCase={handleStartCase}
            onResumeSession={() => setActiveView('investigation')}
            onOpenCreator={() => setActiveView('creator')}
          />
        )}

        {activeView === 'investigation' && activeCase && activeSession && (
          <InvestigationView
            mysteryCase={activeCase}
            session={activeSession}
            onBackToCases={() => setActiveView('cases')}
            onInspectObject={handleInspectObject}
            onExploreLocation={handleExploreLocation}
            onSendMessage={handleSendMessage}
            onAddLink={handleAddLink}
            onRemoveLink={handleRemoveLink}
            onSavePositions={handleSavePositions}
            onSaveTimeline={handleSaveTimeline}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onSaveHypothesis={handleSaveHypothesis}
            onUnlockHint={handleUnlockHint}
            onSubmitAccusation={handleSubmitAccusation}
            onReplay={() => handleStartCase(activeCase.id)}
          />
        )}

        {activeView === 'creator' && (
          <CreatorStudio
            onPublishCase={handlePublishCase}
            onClose={() => setActiveView('cases')}
          />
        )}
      </main>

      {/* High-End Floating Horror Soundscape Controller */}
      <LuxurySoundscapeController />

      {/* Quick-Slide Detective Field Journal Drawer */}
      <DetectiveJournalDrawer
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
        user={user}
        activeCase={activeCase}
        activeSession={activeSession}
        onContinueCase={activeCase ? () => setActiveView('investigation') : undefined}
      />

      {/* Modals */}
      {profileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setProfileOpen(false)}
          onUpdateProfile={handleUpdateProfile}
          onSwitchUser={() => {
            setProfileOpen(false);
            setAuthModalOpen(true);
          }}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(newUser, token) => {
            setUser(newUser);
            setAuthToken(token);
          }}
        />
      )}
    </div>
  );
}

export default App;
