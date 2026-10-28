import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  User, 
  Plus, 
  Filter, 
  Check, 
  Search
} from 'lucide-react';
import { Task, TaskCategory, TaskPriority } from '../types';

interface TaskCenterProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  taskFilter: 'all' | 'overdue' | 'today' | 'completed';
  setTaskFilter: (filter: 'all' | 'overdue' | 'today' | 'completed') => void;
}

export const TaskCenter: React.FC<TaskCenterProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  taskFilter,
  setTaskFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newCategory, setNewCategory] = useState<TaskCategory>('society_gatepass');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAssignedTo, setNewAssignedTo] = useState('Priya Sharma');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((task) => {
    // Status / date filters
    if (taskFilter === 'overdue' && task.status !== 'overdue') return false;
    if (taskFilter === 'completed' && task.status !== 'completed') return false;
    if (taskFilter === 'today') {
      const isDueToday = 
        task.dueDate === todayStr || 
        task.dueDate === '2026-10-27' || 
        task.dueDate === '2026-10-28';
      if (!isDueToday) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    // Search filter
    if (taskSearch.trim()) {
      const matchSearch = 
        task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        task.customerName.toLowerCase().includes(taskSearch.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(taskSearch.toLowerCase()) ||
        task.city.toLowerCase().includes(taskSearch.toLowerCase()) ||
        task.id.toLowerCase().includes(taskSearch.toLowerCase());
      if (!matchSearch) return false;
    }

    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 uppercase">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 uppercase">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 uppercase">Low</span>;
    }
  };

  const getCategoryLabel = (cat: TaskCategory) => {
    const map: Record<TaskCategory, string> = {
      apartment: 'Apartment',
      movers: 'Packers & Movers',
      utilities: 'Utilities',
      documentation: 'Documentation & KYC',
      society_gatepass: 'Society & Gate Pass',
      post_move: 'Post-Move Support',
    };
    return map[cat] || cat;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const isPastDue = newDueDate < todayStr;

    onAddTask({
      relocationId: 'REL-MANUAL',
      customerName: newCustomer || 'Direct Ops Task',
      city: newCity as any,
      title: newTitle,
      category: newCategory,
      dueDate: newDueDate,
      status: isPastDue ? 'overdue' : 'pending',
      priority: newPriority,
      assignedTo: newAssignedTo,
    });

    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Operations Task Center</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {filteredTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-500">Track and clear execution bottlenecks across ground teams</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setTaskFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                taskFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTaskFilter('today')}
              className={`px-3 py-1 rounded-md transition-colors ${
                taskFilter === 'today' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Due Today
            </button>
            <button
              onClick={() => setTaskFilter('overdue')}
              className={`px-3 py-1 rounded-md transition-colors ${
                taskFilter === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setTaskFilter('completed')}
              className={`px-3 py-1 rounded-md transition-colors ${
                taskFilter === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              Done
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Category:
        </span>
        {['all', 'society_gatepass', 'movers', 'utilities', 'documentation', 'apartment', 'post_move'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-800 text-white font-semibold'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? 'All Categories' : getCategoryLabel(cat as TaskCategory)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                task.status === 'completed' 
                  ? 'bg-slate-50/60 opacity-60' 
                  : task.status === 'overdue' 
                  ? 'bg-rose-50/30 hover:bg-rose-50/50' 
                  : 'hover:bg-slate-50/80'
              }`}
            >
              {/* Checkbox & Details */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.status === 'completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : task.status === 'overdue'
                      ? 'border-rose-400 hover:border-rose-600 bg-white'
                      : 'border-slate-300 hover:border-indigo-600 bg-white'
                  }`}
                >
                  {task.status === 'completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-mono font-medium text-slate-400">{task.id}</span>
                    <span className="text-xs font-bold text-slate-900">{task.customerName}</span>
                    <span className="text-[11px] text-slate-500">({task.city})</span>
                    {getPriorityBadge(task.priority)}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {getCategoryLabel(task.category)}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold ${
                    task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}>
                    {task.title}
                  </p>

                  {task.blockerReason && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-rose-700 font-medium bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                      <AlertTriangle className="w-3 h-3 text-rose-600 flex-shrink-0" />
                      <span>Blocker: {task.blockerReason}</span>
                    </div>
                  )}

                  {task.notes && !task.blockerReason && (
                    <p className="mt-1 text-[11px] text-slate-500 italic">
                      Note: {task.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Due Date & Assignee */}
              <div className="flex flex-col items-end gap-1.5 text-right flex-shrink-0">
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className={task.status === 'overdue' ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                    {task.status === 'overdue' ? `OVERDUE (${task.dueDate})` : task.dueDate}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{task.assignedTo}</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Add New Ops Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title / Action *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call Bescom assistant engineer for meter inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Aditya Mehra"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option>Bengaluru</option>
                    <option>Pune</option>
                    <option>Mumbai</option>
                    <option>Delhi-NCR</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                    <option>Ahmedabad</option>
                    <option>Kolkata</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="society_gatepass">Society & Gate Pass</option>
                    <option value="movers">Packers & Movers</option>
                    <option value="utilities">Utilities</option>
                    <option value="documentation">Documentation</option>
                    <option value="apartment">Apartment</option>
                    <option value="post_move">Post Move</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Ops Lead</label>
                  <select
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option>Priya Sharma</option>
                    <option>Rahul Verma</option>
                    <option>Sneha Kulkarni</option>
                    <option>Amit Roy</option>
                    <option>Vikram Nair</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
