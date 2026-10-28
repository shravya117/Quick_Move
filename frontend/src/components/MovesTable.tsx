import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Relocation, RelocationPhase, isSupportedCity } from '../types';

interface MovesTableProps {
  relocations: Relocation[];
  onSelectMove: (move: Relocation) => void;
  onOpenQuickWhatsApp: (move: Relocation) => void;
  onEditMove?: (move: Relocation) => void;
  onDeleteMove?: (move: Relocation) => void;
  onCreateRelocation?: () => void;
}

export const MovesTable: React.FC<MovesTableProps> = ({
  relocations,
  onSelectMove,
  onOpenQuickWhatsApp,
  onEditMove,
  onDeleteMove,
  onCreateRelocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');

  const phases = [
    'All',
    'Apartment Shortlist',
    'Packers & Movers',
    'Utility Setup',
    'Documentation & KYC',
    'Moving Day',
    'Post-Move Support',
    'Completed'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredMoves = relocations.filter((move) => {
    const matchesSearch = 
      move.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      move.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      move.toCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      move.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (move.apartment?.societyName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const normalizePhase = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
    const matchesPhase = phaseFilter === 'All' ||
      normalizePhase(move.currentPhase) === normalizePhase(phaseFilter);

    return matchesSearch && matchesPhase;
  });

  const getRiskBadge = (risk: 'Low' | 'Medium' | 'High', reason?: string) => {
    if (risk === 'High') {
      return (
        <span 
          title={reason} 
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
          High Risk
        </span>
      );
    }
    if (risk === 'Medium') {
      return (
        <span 
          title={reason} 
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          Medium Risk
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        On Track
      </span>
    );
  };

  const getPhaseBadge = (phase: RelocationPhase) => {
    const colorMap: Record<RelocationPhase, string> = {
      'Apartment Shortlist': 'bg-purple-50 text-purple-700 border-purple-200',
      'Packers & Movers': 'bg-blue-50 text-blue-700 border-blue-200',
      'Utility Setup': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Documentation & KYC': 'bg-amber-50 text-amber-700 border-amber-200',
      'Moving Day': 'bg-rose-50 text-rose-700 border-rose-300 font-bold',
      'Post-Move Support': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorMap[phase] || 'bg-slate-50 text-slate-700'}`}>
        {phase}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header & Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Relocation Pipeline ({filteredMoves.length})</h2>
            <p className="text-xs text-slate-500">Live operational status across all hub and non-hub customer relocations</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search customer, ID, society..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <label htmlFor="phase-filter" className="text-xs font-semibold text-slate-600">Pipeline phase</label>
          <select
            id="phase-filter"
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {phases.map((phase) => <option key={phase} value={phase}>{phase}</option>)}
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Customer & Relocation</th>
              <th className="py-3 px-4">Route</th>
              <th className="py-3 px-4">Move Date</th>
              <th className="py-3 px-4">Current Phase</th>
              <th className="py-3 px-4">Society / Gate Pass</th>
              <th className="py-3 px-4">Ops Lead</th>
              <th className="py-3 px-4">Risk Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
            {filteredMoves.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <span>No relocations found matching your criteria.</span>
                    {onCreateRelocation && (
                      <button onClick={onCreateRelocation} className="text-indigo-600 font-semibold hover:text-indigo-800">
                        Create a relocation
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredMoves.map((move) => {
                const hasNonHub = !isSupportedCity(move.fromCity) || !isSupportedCity(move.toCity);

                return (
                  <tr 
                    key={move.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectMove(move)}
                  >
                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {move.customerName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {move.id}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span>{move.fromCity}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-indigo-700">{move.toCity}</span>
                        {hasNonHub && (
                          <span 
                            title="Contains city outside QuickMove 8 core hubs" 
                            className="inline-flex items-center text-amber-600 bg-amber-50 px-1 py-0.2 rounded text-[10px] font-semibold border border-amber-200"
                          >
                            <AlertTriangle className="w-3 h-3 mr-0.5 text-amber-500" /> Non-Hub
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]" title={move.apartment?.societyName}>
                        {move.apartment?.societyName || 'Society Pending'}
                      </div>
                    </td>

                    {/* Move Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{move.targetMoveDate}</span>
                      </div>
                      {(move.targetMoveDate === todayStr || move.targetMoveDate === '2026-10-28') ? (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          TODAY
                        </span>
                      ) : move.targetMoveDate === '2026-10-29' ? (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          TOMORROW
                        </span>
                      ) : null}
                    </td>

                    {/* Phase */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getPhaseBadge(move.currentPhase)}
                    </td>

                    {/* Society / Gatepass status */}
                    <td className="py-3.5 px-4">
                      {move.apartment?.societyNocStatus === 'Approved' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Pass Issued
                        </span>
                      ) : move.apartment?.societyNocStatus === 'Blocked' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> NOC Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          {move.apartment?.societyNocStatus || 'Not Applied'}
                        </span>
                      )}
                    </td>

                    {/* Ops Lead */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{move.assignedOps}</span>
                      </div>
                    </td>

                    {/* Risk */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRiskBadge(move.riskScore, move.riskReason)}
                    </td>

                    {/* Actions: WhatsApp, Edit, Delete, Details */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenQuickWhatsApp(move)}
                          title="Send AI-Formatted WhatsApp Update"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        
                        {onEditMove && (
                          <button
                            onClick={() => onEditMove(move)}
                            title="Edit Relocation Pipeline Details"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onDeleteMove && (
                          <button
                            onClick={() => onDeleteMove(move)}
                            title="Delete Relocation"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onSelectMove(move)}
                          className="ml-1 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
