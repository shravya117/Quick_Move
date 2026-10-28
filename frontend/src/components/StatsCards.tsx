import React from 'react';
import { 
  Truck, 
  Clock, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface StatsCardsProps {
  activeMovesCount: number;
  pendingTasksCount: number;
  overdueTasksCount: number;
  criticalIssuesCount: number;
  opsLeadCount: number;
  activeTab: 'moves' | 'tasks' | 'issues';
  setActiveTab: (tab: 'moves' | 'tasks' | 'issues') => void;
  setTaskFilter?: (filter: 'all' | 'overdue' | 'today' | 'completed') => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  activeMovesCount,
  pendingTasksCount,
  overdueTasksCount,
  criticalIssuesCount,
  opsLeadCount,
  activeTab,
  setActiveTab,
  setTaskFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Active Moves */}
      <div 
        onClick={() => setActiveTab('moves')}
        className={`bg-white rounded-xl p-5 border cursor-pointer transition-all hover:shadow-md ${
          activeTab === 'moves' 
            ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-sm' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +20% QoQ
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{activeMovesCount}</div>
        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
          <span>Active Relocations</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 2. Pending Tasks */}
      <div 
        onClick={() => {
          setActiveTab('tasks');
          if (setTaskFilter) setTaskFilter('all');
        }}
        className={`bg-white rounded-xl p-5 border cursor-pointer transition-all hover:shadow-md ${
          activeTab === 'tasks' 
            ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm' 
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            Across {opsLeadCount} Ops Leads
          </span>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{pendingTasksCount}</div>
        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
          <span>Tasks In Progress</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 3. Overdue Tasks */}
      <div 
        onClick={() => {
          setActiveTab('tasks');
          if (setTaskFilter) setTaskFilter('overdue');
        }}
        className={`bg-white rounded-xl p-5 border cursor-pointer transition-all hover:shadow-md ${
          overdueTasksCount > 0 ? 'bg-amber-50/40 border-amber-300' : 'border-slate-200'
        } ${activeTab === 'tasks' ? 'ring-2 ring-amber-200' : ''}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            overdueTasksCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {overdueTasksCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          {overdueTasksCount > 0 ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
              Needs Action
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              All Caught Up
            </span>
          )}
        </div>
        <div className={`text-2xl font-bold tracking-tight ${overdueTasksCount > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
          {overdueTasksCount}
        </div>
        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
          <span>Overdue Milestones</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 4. Critical Blockers & Issues */}
      <div 
        onClick={() => setActiveTab('issues')}
        className={`bg-white rounded-xl p-5 border cursor-pointer transition-all hover:shadow-md ${
          criticalIssuesCount > 0 ? 'bg-rose-50/50 border-rose-300' : 'border-slate-200'
        } ${activeTab === 'issues' ? 'ring-2 ring-rose-200' : ''}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            criticalIssuesCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {criticalIssuesCount > 0 ? <AlertOctagon className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          {criticalIssuesCount > 0 ? (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              High Severity
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Zero Blockers
            </span>
          )}
        </div>
        <div className={`text-2xl font-bold tracking-tight ${criticalIssuesCount > 0 ? 'text-rose-900' : 'text-slate-900'}`}>
          {criticalIssuesCount}
        </div>
        <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
          <span>On-Ground Blockers</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

    </div>
  );
};
