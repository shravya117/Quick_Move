import React, { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Relocation, SUPPORTED_CITIES, isSupportedCity, normalizeCity } from '../types';

interface NewMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRelocation: (relocation: Relocation) => void;
  opsLeads: string[];
}

export const NewMoveModal: React.FC<NewMoveModalProps> = ({
  isOpen,
  onClose,
  onAddRelocation,
  opsLeads,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Origin City State
  const [originSelect, setOriginSelect] = useState<string>('Delhi-NCR');
  const [customOrigin, setCustomOrigin] = useState<string>('');
  
  // Destination City State
  const [destSelect, setDestSelect] = useState<string>('Bengaluru');
  const [customDest, setCustomDest] = useState<string>('');

  const [targetMoveDate, setTargetMoveDate] = useState('2026-11-05');
  const [assignedOps, setAssignedOps] = useState(opsLeads[0] || '');
  const [societyName, setSocietyName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [vendorName, setVendorName] = useState('SafePack Express');
  const [vehicleType, setVehicleType] = useState('14ft Container Truck');

  useEffect(() => {
    if (!assignedOps && opsLeads.length > 0) setAssignedOps(opsLeads[0]);
  }, [assignedOps, opsLeads]);

  const resolvedOrigin = normalizeCity(originSelect === 'OTHER' ? (customOrigin.trim() || 'Other') : originSelect);
  const resolvedDest = normalizeCity(destSelect === 'OTHER' ? (customDest.trim() || 'Other') : destSelect);

  const isOriginUnsupported = resolvedOrigin && !isSupportedCity(resolvedOrigin);
  const isDestUnsupported = resolvedDest && !isSupportedCity(resolvedDest);
  const hasUnsupportedCity = isOriginUnsupported || isDestUnsupported;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const newId = `REL-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRelocation: Relocation = {
      id: newId,
      customerName,
      phone: phone || '+91 98000 00000',
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      fromCity: resolvedOrigin,
      toCity: resolvedDest,
      currentPhase: 'Apartment Shortlist',
      targetMoveDate,
      assignedOps,
      apartment: {
        societyName: societyName || 'Pending Society Allotment',
        flatNumber: flatNumber || 'Pending Unit',
        locality: `${resolvedDest} Central`,
        status: 'Searching',
        depositPaid: false,
        societyNocStatus: 'Not Applied',
      },
      movers: {
        vendorName: isDestUnsupported 
          ? (vendorName ? `${vendorName} (Unverified Partner)` : 'Pending Third-Party Quote')
          : (vendorName || 'SafePack Express'),
        vendorPhone: isDestUnsupported ? 'Manual Quote Required' : '+91 98000 11223',
        status: 'Unassigned',
        slotTime: 'Morning (9 AM - 1 PM)',
        vehicleType: vehicleType || '14ft Container Truck',
      },
      utilities: {
        electricityStatus: 'Not Started',
        internetStatus: 'Not Started',
        gasStatus: 'Not Started',
        waterStatus: isDestUnsupported ? 'Pending Society Tanker Card' : 'Verified',
      },
      documents: {
        rentalAgreementRegistered: false,
        policeVerificationDone: false,
        bankAddressUpdated: false,
        aadhaarAddressSubmitted: false,
      },
      riskScore: hasUnsupportedCity ? 'High' : 'Low',
      riskReason: hasUnsupportedCity 
        ? `Out-of-network relocation: ${[isOriginUnsupported ? resolvedOrigin : null, isDestUnsupported ? resolvedDest : null].filter(Boolean).join(' and ')} is outside QuickMove's 8 core hubs. Ground vendors and utilities require manual partner confirmation.`
        : 'New relocation initiated; initial partner checks scheduled.',
      notes: [
        `Relocation intake logged into QuickMove Operations system by ${assignedOps}.`,
        ...(hasUnsupportedCity ? [`Operational Warning: Non-hub route (${resolvedOrigin} → ${resolvedDest}). No pre-contracted SLAs available.`] : [])
      ],
    };

    onAddRelocation(newRelocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Intake New Customer Relocation</h3>
            <p className="text-xs text-slate-400 mt-0.5">Add to live operations tracking pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Customer / Family Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Varun & Pooja Kapur"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98xxx xxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Cities Section with Supported Hubs + Other */}
          <div className="grid grid-cols-2 gap-3">
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
                  className="mt-2 w-full px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30 text-slate-800"
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
                  className="mt-2 w-full px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30 text-slate-800"
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
                * Do NOT confirm moving dates or quote SLAs to the customer until third-party logistics and utility feasibility are verified manually.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block font-semibold text-slate-700 mb-1">Assigned Ops Lead</label>
              <select
                value={assignedOps}
                onChange={(e) => setAssignedOps(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                {opsLeads.map((lead) => (
                  <option key={lead} value={lead}>{lead}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Society</label>
              <input
                type="text"
                placeholder="e.g. Prestige Lakeside"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Flat / Unit Number</label>
              <input
                type="text"
                placeholder="e.g. Flat 602, Tower B"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Logistics / Moving Partner</label>
              <input
                type="text"
                placeholder={isDestUnsupported ? 'Subject to manual quote' : 'e.g. SafePack Express'}
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vehicle Sizing</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="14ft Container Truck">14ft Container Truck</option>
                <option value="17ft Container Truck">17ft Container Truck</option>
                <option value="19ft Container Truck">19ft Container Truck</option>
                <option value="Shuttle Mini-Tempo (Tata Ace)">Shuttle Mini-Tempo (Tata Ace)</option>
              </select>
            </div>
          </div>

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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm"
            >
              Create Relocation
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
