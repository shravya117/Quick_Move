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

import { City, Relocation, Task, Issue, RelocationPhase, SUPPORTED_CITIES } from './types';
import { OPS_TEAM } from './data/mockData';
import { 
  loadRelocations, 
  saveRelocations, 
  loadTasks, 
  saveTasks, 
  loadIssues, 
  saveIssues 
} from './utils/storage';

export const App: React.FC = () => {
  const [relocations, setRelocations] = useState<Relocation[]>(loadRelocations);
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [issues, setIssues] = useState<Issue[]>(loadIssues);

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

  // Sync state changes with localStorage
  useEffect(() => {
    saveRelocations(relocations);
  }, [relocations]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveIssues(issues);
  }, [issues]);

  // Compute live active move counts per ops coordinator
  const activeMoveCountsByLead = useMemo(() => {
    const counts: Record<string, number> = {};
    OPS_TEAM.forEach(member => {
      counts[member.name] = relocations.filter(
        m => m.assignedOps === member.name && m.currentPhase !== 'Completed'
      ).length;
    });
    return counts;
  }, [relocations]);

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
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `TSK-${Math.floor(200 + Math.random() * 800)}`,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        return { ...i, status: 'resolved' };
      }
      return i;
    }));
  };

  const handleReopenIssue = (issueId: string) => {
    setIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        return { ...i, status: 'open' };
      }
      return i;
    }));
  };

  const handleAddIssue = (newIssueData: Omit<Issue, 'id'>) => {
    const newIssue: Issue = {
      ...newIssueData,
      id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
    };
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleUpdatePhase = (moveId: string, newPhase: RelocationPhase) => {
    setRelocations(prev => prev.map(m => {
      if (m.id === moveId) {
        return { 
          ...m, 
          currentPhase: newPhase,
          notes: [`Phase updated to "${newPhase}" on ${new Date().toLocaleDateString()}`, ...m.notes]
        };
      }
      return m;
    }));
    if (selectedMove && selectedMove.id === moveId) {
      setSelectedMove(prev => prev ? { ...prev, currentPhase: newPhase } : null);
    }
  };

  const handleAddNote = (moveId: string, noteText: string) => {
    setRelocations(prev => prev.map(m => {
      if (m.id === moveId) {
        return { ...m, notes: [noteText, ...m.notes] };
      }
      return m;
    }));
    if (selectedMove && selectedMove.id === moveId) {
      setSelectedMove(prev => prev ? { ...prev, notes: [noteText, ...prev.notes] } : null);
    }
  };

  const handleAddRelocation = (newMove: Relocation) => {
    setRelocations(prev => [newMove, ...prev]);
  };

  const handleUpdateRelocation = (updatedMove: Relocation) => {
    setRelocations(prev => prev.map(m => m.id === updatedMove.id ? updatedMove : m));
    if (selectedMove && selectedMove.id === updatedMove.id) {
      setSelectedMove(updatedMove);
    }
  };

  const handleDeleteRelocation = (moveId: string) => {
    setRelocations(prev => prev.filter(m => m.id !== moveId));
    if (selectedMove && selectedMove.id === moveId) {
      setSelectedMove(null);
    }
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
        opsTeam={OPS_TEAM}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenNewMove={() => setIsNewMoveOpen(true)}
        overdueCount={overdueTasksCount}
        criticalIssuesCount={criticalIssuesCount}
        activeMoveCountsByLead={activeMoveCountsByLead}
        customCities={customCities}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
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
            <span>Active Relocations ({filteredRelocations.length})</span>
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
          />
        )}

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
