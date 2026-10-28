import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Save } from 'lucide-react';
import { Relocation, RelocationPhase, SUPPORTED_CITIES, isSupportedCity, normalizeCity } from '../types';

interface EditMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  move: Relocation | null;
  onSave: (updatedMove: Relocation) => void;
  opsLeads: string[];
}

export const EditMoveModal: React.FC<EditMoveModalProps> = ({
  isOpen,
  onClose,
  move,
  onSave,
  opsLeads,
}) => {
  if (!isOpen || !move) return null;

  const [customerName, setCustomerName] = useState(move.customerName);
  const [phone, setPhone] = useState(move.phone);
  const [email, setEmail] = useState(move.email);

  // Origin City State
  const initialOriginIsSupported = isSupportedCity(move.fromCity);
  const [originSelect, setOriginSelect] = useState<string>(
    initialOriginIsSupported ? move.fromCity : 'OTHER'
  );
  const [customOrigin, setCustomOrigin] = useState<string>(
    initialOriginIsSupported ? '' : move.fromCity
  );

  // Destination City State
  const initialDestIsSupported = isSupportedCity(move.toCity);
  const [destSelect, setDestSelect] = useState<string>(
    initialDestIsSupported ? move.toCity : 'OTHER'
  );
  const [customDest, setCustomDest] = useState<string>(
    initialDestIsSupported ? '' : move.toCity
  );

  const [targetMoveDate, setTargetMoveDate] = useState(move.targetMoveDate);
  const [currentPhase, setCurrentPhase] = useState<RelocationPhase>(move.currentPhase);
  const [assignedOps, setAssignedOps] = useState(move.assignedOps);
  
  // Apartment Details
  const [societyName, setSocietyName] = useState(move.apartment?.societyName || '');
  const [flatNumber, setFlatNumber] = useState(move.apartment?.flatNumber || '');
  const [apartmentStatus, setApartmentStatus] = useState(move.apartment?.status || 'Searching');
  const [societyNocStatus, setSocietyNocStatus] = useState(move.apartment?.societyNocStatus || 'Not Applied');

  // Movers Details
  const [vendorName, setVendorName] = useState(move.movers?.vendorName || '');
  const [slotTime, setSlotTime] = useState(move.movers?.slotTime || '');
  const [vehicleType, setVehicleType] = useState(move.movers?.vehicleType || '14ft Container Truck');

  // Risk Details
  const [riskScore, setRiskScore] = useState<'Low' | 'Medium' | 'High'>(move.riskScore);
  const [riskReason, setRiskReason] = useState(move.riskReason || '');

  const resolvedOrigin = normalizeCity(originSelect === 'OTHER' ? (customOrigin.trim() || 'Other') : originSelect);
  const resolvedDest = normalizeCity(destSelect === 'OTHER' ? (customDest.trim() || 'Other') : destSelect);

  const isOriginUnsupported = resolvedOrigin && !isSupportedCity(resolvedOrigin);
  const isDestUnsupported = resolvedDest && !isSupportedCity(resolvedDest);
  const hasUnsupportedCity = isOriginUnsupported || isDestUnsupported;

  const phases: RelocationPhase[] = [
    'Apartment Shortlist',
    'Packers & Movers',
    'Utility Setup',
    'Documentation & KYC',
    'Moving Day',
    'Post-Move Support',
    'Completed'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Relocation = {
      ...move,
      customerName,
      phone,
      email,
      fromCity: resolvedOrigin,
      toCity: resolvedDest,
      currentPhase,
      targetMoveDate,
      assignedOps,
      apartment: {
        ...move.apartment,
        societyName: societyName || 'Pending Society Allotment',
        flatNumber: flatNumber || 'Pending Unit',
        locality: `${resolvedDest} Hub`,
        status: apartmentStatus,
        societyNocStatus,
      },
      movers: {
        ...move.movers,
        vendorName: vendorName || 'SafePack Express',
        slotTime: slotTime || 'Morning Slot (9 AM - 1 PM)',
        vehicleType: vehicleType || '14ft Container Truck',
      },
      riskScore,
      riskReason: riskReason || (hasUnsupportedCity 
        ? `Out-of-network route: ${[isOriginUnsupported ? resolvedOrigin : null, isDestUnsupported ? resolvedDest : null].filter(Boolean).join(' and ')} requires manual partner confirmation.`
        : undefined),
      notes: [
        `Record edited by ops coordinator on ${new Date().toLocaleDateString()}`,
        ...(move.notes || [])
      ]
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden text-xs flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded">
                {move.id}
              </span>
              <h3 className="text-base font-bold text-white">Edit Relocation Details</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Update customer parameters, routing, and ground operational status</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer / Family Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Cities Section with Supported Hubs + Other */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin City *</label>
              <select
                value={originSelect}
                onChange={(e) => setOriginSelect(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="OTHER">Other (Outside 8 Hubs)...</option>
              </select>

              {originSelect === 'OTHER' && (
                <input
                  type="text"
                  required
                  placeholder="Enter origin city (e.g. Jaipur)"
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-slate-800"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Hub City *</label>
              <select
                value={destSelect}
                onChange={(e) => setDestSelect(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="OTHER">Other (Outside 8 Hubs)...</option>
              </select>

              {destSelect === 'OTHER' && (
                <input
                  type="text"
                  required
                  placeholder="Enter destination city (e.g. Lucknow)"
                  value={customDest}
                  onChange={(e) => setCustomDest(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/40 text-slate-800"
                />
              )}
            </div>
          </div>

          {/* Non-Hub Warning Banner */}
          {hasUnsupportedCity && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Non-Hub Operational Network Alert</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                <strong>{isOriginUnsupported && resolvedOrigin} {isOriginUnsupported && isDestUnsupported && '& '} {isDestUnsupported && resolvedDest}</strong> {isOriginUnsupported && isDestUnsupported ? 'are' : 'is'} outside QuickMove's 8 core metro hubs. QuickMove does not maintain on-ground staff, vetted property brokers, or guaranteed utility partners here.
              </p>
              <p className="text-[10px] font-medium text-amber-700 italic">
                * Ground logistics and utility transfers require manual partner confirmation. Do not promise fixed turnaround times without verifying local vendors.
              </p>
            </div>
          )}

          {/* Move Date, Phase, Ops Lead */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Move Date</label>
              <input
                type="date"
                value={targetMoveDate}
                onChange={(e) => setTargetMoveDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Pipeline Phase</label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value as RelocationPhase)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-semibold text-indigo-700"
              >
                {phases.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Ops Lead</label>
              <select
                value={assignedOps}
                onChange={(e) => setAssignedOps(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                {Array.from(new Set([assignedOps, ...opsLeads].filter(Boolean))).map((lead) => (
                  <option key={lead} value={lead}>{lead}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Apartment & Society Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Society Name</label>
              <input
                type="text"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Flat / Unit Number</label>
              <input
                type="text"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Society NOC Pass</label>
              <select
                value={societyNocStatus}
                onChange={(e) => setSocietyNocStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                <option value="Not Applied">Not Applied</option>
                <option value="Applied">Applied</option>
                <option value="Approved">Approved</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Logistics & Movers Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Logistics / Moving Partner</label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Moving Slot Window</label>
              <input
                type="text"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 2:00 PM"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vehicle Sizing</label>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                placeholder="14ft Container Truck"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Risk Level & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operational Risk Status</label>
              <select
                value={riskScore}
                onChange={(e) => setRiskScore(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold"
              >
                <option value="Low">Low Risk (On Track)</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk (Blocker Alert)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Risk Reason / Note</label>
              <input
                type="text"
                value={riskReason}
                onChange={(e) => setRiskReason(e.target.value)}
                placeholder="e.g. Society MC lift curfew or meter delay..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Bottom Action CTAs */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Relocation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
