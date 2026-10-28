import React from 'react';
import { 
  Building2, 
  Sparkles, 
  MapPin, 
  Users,
  ShieldAlert
} from 'lucide-react';
import { City, OpsMember, SUPPORTED_CITIES, isSupportedCity } from '../types';

interface NavbarProps {
  selectedCity: City | 'All';
  setSelectedCity: (city: City | 'All') => void;
  selectedOps: string | 'All';
  setSelectedOps: (ops: string | 'All') => void;
  opsTeam: OpsMember[];
  onOpenAiAssistant: () => void;
  onOpenNewMove: () => void;
  overdueCount: number;
  criticalIssuesCount: number;
  activeMoveCountsByLead?: Record<string, number>;
  customCities?: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  setSelectedCity,
  selectedOps,
  setSelectedOps,
  opsTeam,
  onOpenAiAssistant,
  onOpenNewMove,
  overdueCount,
  criticalIssuesCount,
  activeMoveCountsByLead = {},
  customCities = [],
}) => {
  // Combine core 8 cities + any custom non-hub cities currently in the pipeline
  const cities: (City | 'All')[] = [
    'All',
    ...SUPPORTED_CITIES,
    ...customCities.filter(c => !isSupportedCity(c))
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">QuickMove</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                  AI Ops Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">8-City Relocation Execution Center</p>
            </div>
          </div>

          {/* Operational City & Team Filters */}
          <div className="hidden md:flex items-center space-x-3">
            {/* City Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-500">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City | 'All')}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Hubs & Cities' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Ops Coordinator Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-500">Ops Lead:</span>
              <select
                value={selectedOps}
                onChange={(e) => setSelectedOps(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="All">All Leads</option>
                {opsTeam.map((m) => {
                  const count = activeMoveCountsByLead[m.name] ?? m.activeMovesCount;
                  return (
                    <option key={m.id} value={m.name}>
                      {m.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5">
            {/* Critical alert pill if there are blockers */}
            {(criticalIssuesCount > 0 || overdueCount > 0) && (
              <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{criticalIssuesCount} Blockers · {overdueCount} Overdue</span>
              </div>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-3.5 py-2 rounded-lg font-semibold text-xs shadow-sm transition-all shadow-indigo-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Ops Co-Pilot</span>
            </button>

            {/* New Move Button */}
            <button
              onClick={onOpenNewMove}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              + New Relocation
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
