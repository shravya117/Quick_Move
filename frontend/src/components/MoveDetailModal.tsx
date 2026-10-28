import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Building2, 
  Truck, 
  Zap, 
  FileCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { Relocation, RelocationPhase, isSupportedCity } from '../types';

interface MoveDetailModalProps {
  move: Relocation | null;
  onClose: () => void;
  onUpdatePhase: (moveId: string, newPhase: RelocationPhase) => void;
  onAddNote: (moveId: string, note: string) => void;
  initialTab?: 'details' | 'whatsapp' | 'notes';
  onEditMove?: (move: Relocation) => void;
  onDeleteMove?: (move: Relocation) => void;
}

export const MoveDetailModal: React.FC<MoveDetailModalProps> = ({
  move,
  onClose,
  onUpdatePhase,
  onAddNote,
  initialTab = 'details',
  onEditMove,
  onDeleteMove,
}) => {
  if (!move) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'whatsapp' | 'notes'>(initialTab);
  const [newNoteText, setNewNoteText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, move?.id]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(move.id, newNoteText);
    setNewNoteText('');
  };

  const phases: RelocationPhase[] = [
    'Apartment Shortlist',
    'Packers & Movers',
    'Utility Setup',
    'Documentation & KYC',
    'Moving Day',
    'Post-Move Support',
    'Completed'
  ];

  const hasNonHub = !isSupportedCity(move.fromCity) || !isSupportedCity(move.toCity);
  const providerAssignment = move.providerAssignment;
  const recordedProviderName = providerAssignment?.providerName
    || move.movers?.vendorName;
  const hasAssignedProvider = Boolean(
    providerAssignment?.providerId || providerAssignment?.providerName
  ) && recordedProviderName?.trim().toLowerCase() !== 'unassigned';
  const isConfirmedAssignment = providerAssignment?.assignmentStatus === 'confirmed'
    && providerAssignment?.availabilityStatus === 'available';
  const hasUnavailableProvider = providerAssignment?.availabilityStatus === 'unavailable';
  const isAvailabilityVerified = providerAssignment?.availabilityStatus === 'available';
  const providerBookingLabel = !hasAssignedProvider
    ? 'Unassigned'
    : isConfirmedAssignment
      ? 'Confirmed'
      : 'Pending verification';
  const providerAvailabilityLabel = !hasAssignedProvider
    ? 'Not verified'
    : hasUnavailableProvider
      ? 'Unavailable'
      : isAvailabilityVerified
        ? 'Available'
        : 'Not verified';

  // Pre-generated AI WhatsApp Messages tailored to this customer
  const whatsappMessages = [
    {
      target: 'Customer Update',
      recipient: move.customerName,
      text: `Hello ${move.customerName}, this is ${move.assignedOps} from QuickMove. Your relocation to ${move.toCity} is in the "${move.currentPhase}" phase. Target moving date is ${move.targetMoveDate}. Logistics partner: ${recordedProviderName || 'Not assigned'} (${move.movers?.slotTime || 'Time to be confirmed'}). Please let us know if you need anything addressed today!`
    },
    {
      target: 'Society / Estate Manager Notice',
      recipient: `${move.apartment?.societyName || 'Society'} Estate Office`,
      text: `Respected Management Committee, QuickMove is coordinating the move-in for resident ${move.customerName} into ${move.apartment?.flatNumber || 'allotted flat'} on ${move.targetMoveDate}. Lift reservation slot requested: ${move.movers?.slotTime || 'Standard Slot'}. Truck details: ${move.movers?.vehicleType || 'Container Truck'}. Moving deposit & documents have been verified.`
    },
    {
      target: 'Logistics Vendor Dispatch',
      recipient: `${recordedProviderName || 'Logistics Partner'}`,
      text: `Dispatch details for ${move.customerName} (${move.id}) to ${move.apartment?.societyName || 'Society'}, ${move.apartment?.locality || 'Locality'}, ${move.toCity}. Scheduled slot: ${move.movers?.slotTime || 'Time to be confirmed'}. Confirm the provider booking and vehicle before dispatch.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          
          <div className="absolute top-5 right-5 flex items-center gap-2">
            {onEditMove && (
              <button
                onClick={() => {
                  onClose();
                  onEditMove(move);
                }}
                title="Edit Pipeline Record"
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </button>
            )}

            {onDeleteMove && (
              <button
                onClick={() => {
                  onClose();
                  onDeleteMove(move);
                }}
                title="Delete Relocation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2 pr-28">
            <span className="font-mono text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded">
              {move.id}
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {move.fromCity} → {move.toCity}
            </span>
            {hasNonHub && (
              <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Non-Hub Route
              </span>
            )}
            {move.riskScore === 'High' && (
              <span className="text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> High Risk
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            {move.customerName}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {move.phone}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Target Move: <strong className="text-white ml-0.5">{move.targetMoveDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Lead: <strong className="text-white ml-0.5">{move.assignedOps}</strong>
            </span>
          </div>

          {/* Quick Phase Changer Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-400">Current Phase:</span>
            <select
              value={move.currentPhase}
              onChange={(e) => onUpdatePhase(move.id, e.target.value as RelocationPhase)}
              className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {phases.map((p) => (
                <option key={p} value={p}>
                  Phase: {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Operational Pillars
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            AI WhatsApp Generator
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ops Log ({move.notes?.length || 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'details' && (
            <>
              {/* Non-Hub Alert if outside 8 cities */}
              {hasNonHub && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Non-Hub Network Warning:
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This relocation involves a city outside QuickMove's 8 core metro hubs ({move.fromCity} → {move.toCity}). QuickMove does not have dedicated local operations, vetted property brokers, or guaranteed utility SLAs here. Logistics availability and utility turnaround require explicit third-party partner verification.
                  </p>
                </div>
              )}

              {/* Risk Alert if any */}
              {move.riskReason && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Operational Delay Risk Assessment:
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed font-medium">
                    {move.riskReason}
                  </p>
                </div>
              )}

              {/* Grid of the 4 key ops dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Apartment & Society */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-3">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Apartment & Society Gate Pass</span>
                  </div>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Society:</span>
                      <span className="font-semibold">{move.apartment?.societyName || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Unit:</span>
                      <span className="font-semibold">{move.apartment?.flatNumber || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lease Status:</span>
                      <span className="font-semibold text-indigo-700">{move.apartment?.status || 'Searching'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Society NOC Pass:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        move.apartment?.societyNocStatus === 'Approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : move.apartment?.societyNocStatus === 'Blocked' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {move.apartment?.societyNocStatus || 'Not Applied'}
                      </span>
                    </div>
                    {move.apartment?.societyRulesNote && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                        Rule: {move.apartment.societyRulesNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Packers & Movers */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-3">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Logistics & Moving Vendor</span>
                  </div>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vendor:</span>
                      <span className="font-semibold">{recordedProviderName || 'Not Assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vendor Contact:</span>
                      <span className="font-semibold">{providerAssignment?.providerPhone || move.movers?.vendorPhone || 'Not recorded'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Booking Status:</span>
                      <span className={`font-semibold ${
                        providerBookingLabel === 'Confirmed' ? 'text-emerald-700' :
                        providerBookingLabel === 'Pending verification' ? 'text-amber-700' : 'text-slate-500'
                      }`}>{providerBookingLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle Type:</span>
                      <span className="font-semibold text-[11px]">{providerAssignment?.vehicleType || move.movers?.vehicleType || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Slot Window:</span>
                      <span className="font-semibold">{move.movers?.slotTime || 'TBD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Availability:</span>
                      <span className={`font-semibold ${
                        providerAvailabilityLabel === 'Available' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>{providerAvailabilityLabel}</span>
                    </div>
                    {providerAssignment?.assignedJobs !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned Jobs:</span>
                        <span className="font-semibold">{providerAssignment.assignedJobs}</span>
                      </div>
                    )}
                    {!isConfirmedAssignment && hasAssignedProvider && (
                      <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                        Provider details are recorded, but booking and capacity have not been confirmed by the backend.
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Utilities Setup */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-3">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Utilities Transfer Status</span>
                  </div>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Electricity (EB Meter):</span>
                      <span className="font-semibold">{move.utilities?.electricityStatus || 'Not Started'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Broadband Internet:</span>
                      <span className="font-semibold">{move.utilities?.internetStatus || 'Not Started'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cooking Gas (PNG/LPG):</span>
                      <span className="font-semibold">{move.utilities?.gasStatus || 'Not Started'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Water Card:</span>
                      <span className="font-semibold">{move.utilities?.waterStatus || 'Verified'}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Documentation & Address KYC */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-3">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Documentation & Paperwork</span>
                  </div>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Registered Agreement:</span>
                      <span className={move.documents?.rentalAgreementRegistered ? 'text-emerald-700 font-bold' : 'text-slate-400 font-medium'}>
                        {move.documents?.rentalAgreementRegistered ? '✓ Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Police Verification:</span>
                      <span className={move.documents?.policeVerificationDone ? 'text-emerald-700 font-bold' : 'text-slate-400 font-medium'}>
                        {move.documents?.policeVerificationDone ? '✓ Completed' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Aadhaar Address Update:</span>
                      <span className={move.documents?.aadhaarAddressSubmitted ? 'text-emerald-700 font-bold' : 'text-slate-400 font-medium'}>
                        {move.documents?.aadhaarAddressSubmitted ? '✓ Submitted' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Bank Address KYC:</span>
                      <span className={move.documents?.bankAddressUpdated ? 'text-emerald-700 font-bold' : 'text-slate-400 font-medium'}>
                        {move.documents?.bankAddressUpdated ? '✓ Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Click to copy pre-formatted WhatsApp updates ready to paste into WhatsApp Web or send via mobile to the customer, society management, or logistics vendor:
              </p>

              {whatsappMessages.map((msg, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">
                      {msg.target} ({msg.recipient})
                    </span>
                    <button
                      onClick={() => copyText(msg.text, `msg-${idx}`)}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs"
                    >
                      {copiedKey === `msg-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy WhatsApp Text
                        </>
                      )}
                    </button>
                  </div>
                  <p className="p-3 bg-white rounded-lg border border-emerald-100 font-mono text-[11px] text-slate-800 leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add operational update or call note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-700"
                >
                  Post Note
                </button>
              </form>

              <div className="space-y-2">
                {(move.notes || []).map((note, index) => (
                  <div key={index} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs">
                    • {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Edit and Delete options */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onDeleteMove && (
              <button
                onClick={() => {
                  onClose();
                  onDeleteMove(move);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold text-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Relocation</span>
              </button>
            )}

            {onEditMove && (
              <button
                onClick={() => {
                  onClose();
                  onEditMove(move);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-300 rounded-lg font-semibold text-xs transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Full Details</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
