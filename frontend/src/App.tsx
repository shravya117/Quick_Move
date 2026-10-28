import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Truck, 
  ListTodo, 
  ShieldAlert
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { MovesTable } from './components/MovesTable';
import { TaskCenter } from './components/TaskCenter';
import { IssueBlockerBoard } from './components/IssueBlockerBoard';
import { MoveDetailModal } from './components/MoveDetailModal';
import { AiOpsAssistantModal } from './components/AiOpsAssistantModal';
import { NewMoveModal } from './components/NewMoveModal';
import { EditMoveModal } from './components/EditMoveModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

import { City, Relocation, Task, Issue, RelocationPhase, SUPPORTED_CITIES, OpsMember } from './types';
import { api } from './utils/api';

export const App: React.FC = () => {
  const [relocations, setRelocations] = useState<Relocation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Global Filter States
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedOps, setSelectedOps] = useState<string | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'moves' | 'tasks' | 'issues'>('moves');
  const [taskFilter, setTaskFilter] = useState<'all' | 'overdue' | 'today' | 'completed'>('all');

  // Modal States
  const [selectedMove, setSelectedMove] = useState<Relocation | null>(null);
  const [moveDetailTab, setMoveDetailTab] = useState<'details' | 'whatsapp' | 'notes'>('details');
  const [editingMove, setEditingMove] = useState<Relocation | null>(null);
  const [deletingMove, setDeletingMove] = useState<Relocation | null>(null);

  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isNewMoveOpen, setIsNewMoveOpen] = useState(false);

  const opsTeam = useMemo<OpsMember[]>(() => {
    const names = new Set(relocations.map((move) => move.assignedOps).filter(Boolean));
    return Array.from(names).map((name) => ({
      id: name,
      name,
      activeMovesCount: relocations.filter((move) => move.assignedOps === name && move.currentPhase !== 'Completed').length,
      phone: '',
      cities: Array.from(new Set(relocations.filter((move) => move.assignedOps === name).map((move) => move.toCity))),
    }));
  }, [relocations]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [moves, loadedTasks, loadedIssues] = await Promise.all([
          api.getRelocations(),
          api.getTasks(),
          api.getIssues(),
        ]);
        setRelocations(moves);
        setTasks(loadedTasks);
        setIssues(loadedIssues);
        setDataError(null);
      } catch (error) {
        setDataError(error instanceof Error ? error.message : 'Unable to load operational data');
      } finally {
        setIsLoading(false);
      }
    };
    void loadData();
  }, []);

  const reportError = (error: unknown) => {
    setDataError(error instanceof Error ? error.message : 'The operation failed');
  };

  // Compute live active move counts per ops coordinator
  const activeMoveCountsByLead = useMemo(() => {
    const counts: Record<string, number> = {};
    opsTeam.forEach(member => {
      counts[member.name] = relocations.filter(
        m => m.assignedOps === member.name && m.currentPhase !== 'Completed'
      ).length;
    });
    return counts;
  }, [opsTeam, relocations]);

  // Extract any unique non-hub cities present in active moves
  const customCities = useMemo(() => {
    const set = new Set<string>();
    relocations.forEach(m => {
      if (!(SUPPORTED_CITIES as readonly string[]).includes(m.toCity)) {
        set.add(m.toCity);
      }
    });
    return Array.from(set);
  }, [relocations]);

  // Filtered views based on global city and ops lead selections
  const filteredRelocations = relocations.filter((move) => {
    const matchesCity = selectedCity === 'All' || move.toCity === selectedCity;
    const matchesOps = selectedOps === 'All' || move.assignedOps === selectedOps;
    return matchesCity && matchesOps;
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesCity = selectedCity === 'All' || task.city === selectedCity;
    const matchesOps = selectedOps === 'All' || task.assignedTo === selectedOps;
    return matchesCity && matchesOps;
  });

  const filteredIssues = issues.filter((issue) => {
    const matchesCity = selectedCity === 'All' || issue.city === selectedCity;
    const matchesOps = selectedOps === 'All' || issue.assignedTo === selectedOps;
    return matchesCity && matchesOps;
  });

  // KPI Calculations
  const activeMovesCount = filteredRelocations.filter(m => m.currentPhase !== 'Completed').length;
  const pendingTasksCount = filteredTasks.filter(t => t.status !== 'completed').length;
  const overdueTasksCount = filteredTasks.filter(t => t.status === 'overdue').length;
  const criticalIssuesCount = filteredIssues.filter(i => i.status !== 'resolved' && (i.severity === 'critical' || i.severity === 'high')).length;

  // Handlers
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    try {
      const updated = await api.updateTask({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' });
      setTasks(prev => prev.map(item => item.id === taskId ? updated : item));
    } catch (error) { reportError(error); }
  };

  const handleAddTask = async (newTaskData: Omit<Task, 'id'>) => {
    try {
      const newTask = await api.createTask(newTaskData);
      setTasks(prev => [newTask, ...prev]);
    } catch (error) { reportError(error); }
  };

  const handleResolveIssue = async (issueId: string) => {
    const issue = issues.find((item) => item.id === issueId);
    if (!issue) return;
    try {
      const updated = await api.updateIssue({ ...issue, status: 'resolved' });
      setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
    } catch (error) { reportError(error); }
  };

  const handleReopenIssue = async (issueId: string) => {
    const issue = issues.find((item) => item.id === issueId);
    if (!issue) return;
    try {
      const updated = await api.updateIssue({ ...issue, status: 'open' });
      setIssues(prev => prev.map(item => item.id === issueId ? updated : item));
    } catch (error) { reportError(error); }
  };

  const handleAddIssue = async (newIssueData: Omit<Issue, 'id'>) => {
    try {
      const newIssue = await api.createIssue(newIssueData);
      setIssues(prev => [newIssue, ...prev]);
    } catch (error) { reportError(error); }
  };

  const handleUpdatePhase = async (moveId: string, newPhase: RelocationPhase) => {
    const move = relocations.find((item) => item.id === moveId);
    if (!move) return;
    const updatedMove = { ...move, currentPhase: newPhase, notes: [`Phase updated to "${newPhase}" on ${new Date().toLocaleDateString()}`, ...move.notes] };
    try {
      const saved = await api.updateRelocation(updatedMove);
      setRelocations(prev => prev.map(item => item.id === moveId ? saved : item));
      setSelectedMove(prev => prev?.id === moveId ? saved : prev);
    } catch (error) { reportError(error); }
  };

  const handleAddNote = async (moveId: string, noteText: string) => {
    const move = relocations.find((item) => item.id === moveId);
    if (!move) return;
    try {
      const saved = await api.updateRelocation({ ...move, notes: [noteText, ...move.notes] });
      setRelocations(prev => prev.map(item => item.id === moveId ? saved : item));
      setSelectedMove(prev => prev?.id === moveId ? saved : prev);
    } catch (error) { reportError(error); }
  };

  const handleAddRelocation = async (newMove: Relocation) => {
    try {
      const saved = await api.createRelocation(newMove);
      setRelocations(prev => [saved, ...prev]);
      setIsNewMoveOpen(false);
    } catch (error) { reportError(error); }
  };

  const handleUpdateRelocation = async (updatedMove: Relocation) => {
    try {
      const saved = await api.updateRelocation(updatedMove);
      setRelocations(prev => prev.map(item => item.id === saved.id ? saved : item));
      setSelectedMove(prev => prev?.id === saved.id ? saved : prev);
    } catch (error) { reportError(error); }
  };

  const handleDeleteRelocation = async (moveId: string) => {
    try {
      await api.deleteRelocation(moveId);
      setRelocations(prev => prev.filter(item => item.id !== moveId));
      setSelectedMove(prev => prev?.id === moveId ? null : prev);
    } catch (error) { reportError(error); }
  };

  const handleSelectMoveForDetails = (move: Relocation) => {
    setMoveDetailTab('details');
    setSelectedMove(move);
  };

  const handleQuickWhatsApp = (move: Relocation) => {
    setMoveDetailTab('whatsapp');
    setSelectedMove(move);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Main Navigation */}
      <Navbar
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedOps={selectedOps}
        setSelectedOps={setSelectedOps}
        opsTeam={opsTeam}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenNewMove={() => setIsNewMoveOpen(true)}
        overdueCount={overdueTasksCount}
        criticalIssuesCount={criticalIssuesCount}
        activeMoveCountsByLead={activeMoveCountsByLead}
        customCities={customCities}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {dataError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800">
            {dataError}
          </div>
        )}
        {isLoading && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading live operational data...</div>}
        
        {/* Banner with Context / City filter status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Live Ops Control
              </span>
              <span className="text-xs text-slate-400">
                {selectedCity === 'All' ? 'All Hubs & Cities' : `${selectedCity} Area`} · {selectedOps === 'All' ? 'All 5 Coordinators' : selectedOps}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Relocation Coordination Dashboard
            </h1>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
              Centralizing WhatsApp groups, apartment keys, movers dispatch, and utility approvals into one actionable view.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-900/40"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Co-Pilot</span>
            </button>
          </div>
        </div>

        {!isLoading && <>
        {/* 4 Summary Stats Cards */}
        <StatsCards
          activeMovesCount={activeMovesCount}
          pendingTasksCount={pendingTasksCount}
          overdueTasksCount={overdueTasksCount}
          criticalIssuesCount={criticalIssuesCount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setTaskFilter={setTaskFilter}
        />

        {/* Main Tab Controls */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('moves')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'moves'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Relocation Pipeline ({filteredRelocations.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tasks');
              setTaskFilter('all');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tasks'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>Task Center ({pendingTasksCount})</span>
            {overdueTasksCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'issues'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Blockers & Failures ({criticalIssuesCount})</span>
            {criticalIssuesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800">
                {criticalIssuesCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'moves' && (
          <MovesTable
            relocations={filteredRelocations}
            onSelectMove={handleSelectMoveForDetails}
            onOpenQuickWhatsApp={handleQuickWhatsApp}
            onEditMove={(move) => setEditingMove(move)}
            onDeleteMove={(move) => setDeletingMove(move)}
            onCreateRelocation={() => setIsNewMoveOpen(true)}
          />
        )}
        </>}

        {activeTab === 'tasks' && (
          <TaskCenter
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
          />
        )}

        {activeTab === 'issues' && (
          <IssueBlockerBoard
            issues={filteredIssues}
            onResolveIssue={handleResolveIssue}
            onReopenIssue={handleReopenIssue}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-700">QuickMove AI Ops Hub v1.0</span>
            <span>· Built for 5 On-Ground Ops Leads across 8 Core Hubs</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Local Storage Active</span>
            <span>Zero Engineering Dependency</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MoveDetailModal
        move={selectedMove}
        onClose={() => setSelectedMove(null)}
        onUpdatePhase={handleUpdatePhase}
        onAddNote={handleAddNote}
        initialTab={moveDetailTab}
        onEditMove={(move) => setEditingMove(move)}
        onDeleteMove={(move) => setDeletingMove(move)}
      />

      <AiOpsAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        relocations={relocations}
        onAddTask={handleAddTask}
        onAddIssue={handleAddIssue}
      />

      <NewMoveModal
        isOpen={isNewMoveOpen}
        onClose={() => setIsNewMoveOpen(false)}
        onAddRelocation={handleAddRelocation}
      />

      <EditMoveModal
        isOpen={Boolean(editingMove)}
        move={editingMove}
        onClose={() => setEditingMove(null)}
        onSave={handleUpdateRelocation}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingMove)}
        move={deletingMove}
        onClose={() => setDeletingMove(null)}
        onConfirmDelete={handleDeleteRelocation}
      />

    </div>
  );
};

export default App;
