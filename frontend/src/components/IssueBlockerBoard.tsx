import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  MessageCircle, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  User,
  RotateCcw
} from 'lucide-react';
import { Issue, IssueCategory, IssueSeverity, Relocation } from '../types';

interface IssueBlockerBoardProps {
  issues: Issue[];
  onResolveIssue: (issueId: string, resolutionNotes: string) => void;
  onReopenIssue?: (issueId: string) => void;
  onCreateIssue: (issue: Omit<Issue, 'id'>) => Promise<void>;
  relocations: Relocation[];
  opsLeads: string[];
}

export const IssueBlockerBoard: React.FC<IssueBlockerBoardProps> = ({
  issues,
  onResolveIssue,
  onReopenIssue,
  onCreateIssue,
  relocations,
  opsLeads,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'active' | 'resolved'>('active');
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedRelocationId, setSelectedRelocationId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('society_gatepass');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [reportedBy, setReportedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [formError, setFormError] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeIssues = issues.filter((i) => i.status !== 'resolved');
  const resolvedIssues = issues.filter((i) => i.status === 'resolved');

  const displayedIssues = viewMode === 'active' ? activeIssues : resolvedIssues;
  const selectedRelocation = relocations.find((item) => item.id === selectedRelocationId);

  const getSeverityPill = (sev: IssueSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            CRITICAL BLOCKER
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            HIGH SEVERITY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            MEDIUM SEVERITY
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Relocation Blockers & Failures</h2>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              {activeIssues.length} Active Blockers
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-world failures across gated societies, local electricity boards, and city logistics
          </p>
        </div>

        {/* View Switcher: Active vs Resolved */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => {
                setFormError('');
                setShowReportForm(true);
                setReportedBy(opsLeads[0] || '');
                setAssignedTo(opsLeads[0] || '');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
            >
              + Report Blocker
            </button>
            <button
              onClick={() => setViewMode('active')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'active' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Blockers ({activeIssues.length})
            </button>
            <button
              onClick={() => setViewMode('resolved')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'resolved' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved History ({resolvedIssues.length})
            </button>
          </div>
        </div>

        {showReportForm && (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedRelocation || !title.trim() || !description.trim() || !reportedBy || !assignedTo) {
                setFormError('Select a relocation and complete all required fields.');
                return;
              }
              try {
                await onCreateIssue({
                  relocationId: selectedRelocation.id,
                  customerName: selectedRelocation.customerName,
                  city: selectedRelocation.toCity,
                  title: title.trim(),
                  description: description.trim(),
                  category,
                  severity,
                  status: 'open',
                  reportedAt: new Date().toISOString(),
                  reportedBy,
                  assignedTo,
                });
                setShowReportForm(false);
                setSelectedRelocationId('');
                setTitle('');
                setDescription('');
                setFormError('');
              } catch (error) {
                setFormError(error instanceof Error ? error.message : 'Unable to report blocker');
              }
            }}
            className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
          >
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Related Relocation *</label>
              <select required value={selectedRelocationId} onChange={(event) => setSelectedRelocationId(event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="">Select customer — relocation ID</option>
                {relocations.map((relocation) => (
                  <option key={relocation.id} value={relocation.id}>
                    {relocation.customerName} — {relocation.id}
                  </option>
                ))}
              </select>
              {selectedRelocation && <p className="mt-1 text-slate-500">{selectedRelocation.fromCity} → {selectedRelocation.toCity} · {selectedRelocation.targetMoveDate}</p>}
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blocker Title *</label>
              <input required value={title} onChange={(event) => setTitle(event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select value={category} onChange={(event) => setCategory(event.target.value as IssueCategory)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="society_gatepass">Society / Gate Pass</option>
                <option value="documentation">Documentation</option>
                <option value="movers">Packers & Movers</option>
                <option value="utilities">Utilities</option>
                <option value="transport_vehicle">Transport / Vehicle</option>
                <option value="payment">Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Description *</label>
              <textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity *</label>
              <select value={severity} onChange={(event) => setSeverity(event.target.value as IssueSeverity)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reported By *</label>
              <select required value={reportedBy} onChange={(event) => setReportedBy(event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="">Select reporter</option>
                {opsLeads.map((lead) => <option key={lead} value={lead}>{lead}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned To *</label>
              <select required value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white">
                <option value="">Select owner</option>
                {opsLeads.map((lead) => <option key={lead} value={lead}>{lead}</option>)}
              </select>
            </div>
            {formError && <p className="sm:col-span-2 text-rose-700">{formError}</p>}
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowReportForm(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold">Save Blocker</button>
            </div>
          </form>
        )}
      </div>

      {/* Issues Grid / List */}
      <div className="p-4 sm:p-5 grid grid-cols-1 gap-4">
        {displayedIssues.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {viewMode === 'active' 
              ? 'No active blockers! All moves are running smoothly.' 
              : 'No resolved blockers yet.'}
          </div>
        ) : (
          displayedIssues.map((issue) => (
            <div
              key={issue.id}
              className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow relative ${
                issue.status === 'resolved' 
                  ? 'border-emerald-200 bg-emerald-50/10 opacity-80' 
                  : 'border-rose-200 bg-gradient-to-br from-white to-rose-50/20'
              }`}
            >
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {issue.status === 'resolved' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      RESOLVED
                    </span>
                  ) : (
                    getSeverityPill(issue.severity)
                  )}
                  <span className="text-xs font-bold text-slate-900">{issue.customerName}</span>
                  <span className="text-xs text-slate-400 font-mono">({issue.relocationId})</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {issue.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {issue.reportedAt}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {issue.assignedTo}
                  </span>
                </div>
              </div>
              <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-slate-600">
                <span>Reported by: <strong>{issue.reportedBy || 'Not recorded'}</strong></span>
                <span>Assigned to: <strong>{issue.assignedTo || 'Not assigned'}</strong></span>
                <span>Reported at: <strong>{issue.reportedAt || 'Not recorded'}</strong></span>
              </div>

              {/* Issue Title & Description */}
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{issue.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-slate-200/80 mb-3 whitespace-pre-line">
                {issue.description}
              </p>

              {/* AI Ops Suggested Action */}
              {issue.suggestedAiAction && (
                <div className="mb-3 bg-indigo-50/80 border border-indigo-200/80 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Ops Recommended Resolution Strategy:</span>
                  </div>
                  <p className="text-indigo-800 leading-relaxed font-medium whitespace-pre-line">
                    {issue.suggestedAiAction}
                  </p>
                </div>
              )}

              {/* AI WhatsApp Message Generator Draft */}
              {issue.suggestedWhatsAppMsg && (
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-3 text-xs mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      AI WhatsApp Broadcast Draft (Vendor / Society / Landlord):
                    </span>
                    <button
                      onClick={() => copyToClipboard(issue.suggestedWhatsAppMsg!, issue.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300 transition-colors shadow-2xs"
                    >
                      {copiedId === issue.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Text
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-800 bg-white/90 p-2.5 rounded border border-emerald-100 font-mono text-[11px] leading-relaxed">
                    "{issue.suggestedWhatsAppMsg}"
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {issue.status === 'resolved' ? (
                  onReopenIssue && (
                    <button
                      onClick={() => onReopenIssue(issue.id)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reopen Blocker</span>
                    </button>
                  )
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setResolvingId(issue.id);
                        setResolutionNotes('');
                      }}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Issue Resolved</span>
                    </button>
                    {resolvingId === issue.id && (
                      <div className="absolute right-5 bottom-14 z-10 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Resolution notes *</label>
                        <textarea value={resolutionNotes} onChange={(event) => setResolutionNotes(event.target.value)} rows={3} className="w-full rounded border border-slate-300 p-2 text-xs" />
                        <div className="mt-2 flex justify-end gap-2">
                          <button onClick={() => setResolvingId(null)} className="text-xs text-slate-600">Cancel</button>
                          <button disabled={!resolutionNotes.trim()} onClick={() => { onResolveIssue(issue.id, resolutionNotes.trim()); setResolvingId(null); }} className="rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white disabled:opacity-50">Confirm</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
