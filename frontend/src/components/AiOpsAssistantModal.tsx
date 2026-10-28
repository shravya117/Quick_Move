import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MessageSquare, 
  CheckCircle, 
  Copy, 
  Check, 
  ShieldAlert,
  Bot,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { Relocation, Task, Issue, City, TaskCategory } from '../types';
import { api } from '../utils/api';

interface AiOpsAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  relocations: Relocation[];
  onAddTask?: (task: Omit<Task, 'id'>) => void;
  onAddIssue?: (issue: Omit<Issue, 'id'>) => void;
}

export const AiOpsAssistantModal: React.FC<AiOpsAssistantModalProps> = ({
  isOpen,
  onClose,
  relocations,
  onAddTask,
  onAddIssue,
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'parser' | 'composer' | 'audit'>('parser');

  // Mode 1: Parser
  const [rawMessageInput, setRawMessageInput] = useState('');
  const [parsedResult, setParsedResult] = useState<{
    customerMatched: string;
    city: City;
    category: TaskCategory;
    severity: 'critical' | 'high' | 'medium' | 'low';
    rootCause: string;
    actionPlan: string;
    draftResponse: string;
    targetRelocationId: string;
  } | null>(null);

  const [taskAddedToast, setTaskAddedToast] = useState(false);
  const [blockerAddedToast, setBlockerAddedToast] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Mode 2: Composer
  const [selectedRelocationId, setSelectedRelocationId] = useState(relocations[0]?.id || '');
  const [scenarioType, setScenarioType] = useState('society_noc');
  const [composerTone, setComposerTone] = useState<'firm_sla' | 'empathic' | 'vendor_urgency'>('firm_sla');
  const [generatedDraft, setGeneratedDraft] = useState('');

  // Mode 3: Copied state
  const [copied, setCopied] = useState(false);

  // Sample quick test scenarios for the ops team
  const sampleScenarios = [
    {
      label: 'Sample 1: Bengaluru Society NOC Block',
      text: 'Bhaiya security guard at Prestige Lakeside is not letting the SafePack truck enter. Guard saying estate manager hasn\'t received lift deposit slip and no moving allowed after 6 PM! Driver is threatening to leave goods on road. Please call immediately!!'
    },
    {
      label: 'Sample 2: Mumbai Pali Hill Narrow Road Extortion',
      text: 'Sir I am driver Ramesh from Mumbai Star Packers. Pali Hill lane is too small, 17ft container cannot go. We need 3 small tempo to shift cartons. Cost is 12000 extra cash. Give permission or we unload here.'
    },
    {
      label: 'Sample 3: Pune MSEDCL Meter Inspection',
      text: 'MSEDCL sub-engineer visited Amanora Flat 904. He said previous tenant unpaid dues of ₹3,410 are pending, so name transfer is blocked until clearance.'
    }
  ];

  const handleParseMessage = async () => {
    if (!rawMessageInput.trim()) return;
    try {
      setIsParsing(true);
      const result = await api.parseMessage(rawMessageInput, relocations);
      setParsedResult({ ...result, targetRelocationId: result.targetRelocationId ?? '' });
    } catch (error) {
      setParsedResult(null);
      window.alert(error instanceof Error ? error.message : 'Groq AI is unavailable');
    } finally {
      setIsParsing(false);
    }
  };

  const handleCreateTaskFromAi = () => {
    if (!parsedResult || !parsedResult.targetRelocationId || !onAddTask) return;
    if (!window.confirm('Confirm adding this AI-generated task to the operations queue?')) return;

    onAddTask({
      relocationId: parsedResult.targetRelocationId,
      customerName: parsedResult.customerMatched,
      city: parsedResult.city,
      title: `[AI Parsed] Execute Action Plan: ${parsedResult.rootCause.slice(0, 70)}...`,
      category: parsedResult.category,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      priority: parsedResult.severity === 'critical' ? 'critical' : 'high',
      assignedTo: 'Priya Sharma',
      notes: parsedResult.actionPlan,
      blockerReason: parsedResult.rootCause
    });

    setTaskAddedToast(true);
    setTimeout(() => setTaskAddedToast(false), 3000);
  };

  const handleCreateBlockerFromAi = () => {
    if (!parsedResult || !parsedResult.targetRelocationId || !onAddIssue) return;
    if (!window.confirm('Confirm logging this AI-generated blocker?')) return;

    onAddIssue({
      relocationId: parsedResult.targetRelocationId,
      customerName: parsedResult.customerMatched,
      city: parsedResult.city,
      title: `[WhatsApp Alert] ${parsedResult.rootCause.slice(0, 60)}...`,
      description: `Raw Message: "${rawMessageInput}"\n\nRoot Cause: ${parsedResult.rootCause}`,
      severity: parsedResult.severity,
      status: 'open',
      category: parsedResult.category,
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedTo: 'Priya Sharma',
      suggestedAiAction: parsedResult.actionPlan,
      suggestedWhatsAppMsg: parsedResult.draftResponse
    });

    setBlockerAddedToast(true);
    setTimeout(() => setBlockerAddedToast(false), 3000);
  };

  const handleGenerateDraft = () => {
    const selectedMove = relocations.find((r) => r.id === selectedRelocationId) || relocations[0];
    
    // Guard against empty relocations or undefined state
    if (!selectedMove) {
      setGeneratedDraft('No relocation currently available to compose message. Please create or select an active relocation.');
      return;
    }

    const society = selectedMove.apartment?.societyName || 'the society';
    const flat = selectedMove.apartment?.flatNumber || 'the allotted unit';
    const customer = selectedMove.customerName || 'Resident';
    const moveDate = selectedMove.targetMoveDate || 'scheduled date';
    const moverVendor = selectedMove.movers?.vendorName || 'Logistics Partner';
    const moverSlot = selectedMove.movers?.slotTime || 'morning slot';
    const destinationCity = selectedMove.toCity || 'destination city';
    
    if (scenarioType === 'society_noc') {
      if (composerTone === 'firm_sla') {
        setGeneratedDraft(
          `To the Society Management Office (${society}),\n\nThis is an urgent operational communication from QuickMove on behalf of resident ${customer} (Unit: ${flat}). The moving truck has been dispatched with scheduled arrival on ${moveDate}. All necessary KYC and lease documentation have been formally recorded. Please ensure security personnel are notified to provide freight elevator access without delay.\n\nQuickMove Ops Control: 1800-QM-MOVES`
        );
      } else {
        setGeneratedDraft(
          `Respected Committee Members,\n\nWe kindly request your assistance in approving gate access for ${customer} arriving on ${moveDate} at ${flat}. Our moving team will strictly adhere to society noise, parking, and elevator padding regulations. Thank you for your support!`
        );
      }
    } else if (scenarioType === 'vendor_delay') {
      setGeneratedDraft(
        `URGENT ESCALATION to ${moverVendor}:\n\nRelocation #${selectedMove.id} for customer ${customer} in ${destinationCity} is in critical breach of the agreed arrival window (${moverSlot}). A 15% SLA penalty will apply per hour of unnotified transit delay. Provide live GPS location ping immediately.\n\nQuickMove Vendor Desk`
      );
    } else {
      setGeneratedDraft(
        `Dear Landlord,\n\nGreetings from QuickMove. For your property at ${society} (${flat}), we require your digital OTP consent to complete the utility meter transfer for your tenant ${customer}. Please click this secure 10-second link to approve: https://quickmove.in/verify-meter/${selectedMove.id}\n\nThank you for ensuring a smooth move-in.`
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              AI Ops Co-Pilot
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
            Ground Coordination Intelligence
          </h2>
          <p className="text-xs text-indigo-200/90 max-w-xl">
            Empowering our 5-person operations team to process messy WhatsApp messages, resolve gated society disputes, and draft instantaneous communications.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-bold">
          <button
            onClick={() => setActiveMode('parser')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeMode === 'parser'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Message Triage & Parser</span>
          </button>
          
          <button
            onClick={() => {
              setActiveMode('composer');
              handleGenerateDraft();
            }}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeMode === 'composer'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Instant Resolution Drafts</span>
          </button>

          <button
            onClick={() => setActiveMode('audit')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeMode === 'audit'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>City Failure Mode Audits</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* MODE 1: WHATSAPP PARSER */}
          {activeMode === 'parser' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Paste Raw Unstructured Message from WhatsApp Group or Email:
                </label>
                <textarea
                  rows={3}
                  value={rawMessageInput}
                  onChange={(e) => setRawMessageInput(e.target.value)}
                  placeholder="e.g. Guard at Prestige Lakeside is not letting the truck enter..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-mono"
                />
              </div>

              {/* Sample Quick Fill Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400">Quick Test Samples:</span>
                {sampleScenarios.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawMessageInput(s.text);
                    }}
                    className="text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleParseMessage}
                disabled={!rawMessageInput.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Parse Message & Generate Action Plan</span>
              </button>

              {/* Parsed Result Display */}
              {parsedResult && (
                <div className="mt-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-200">
                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Parsed Relocation Intelligence:
                    </span>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded uppercase">
                      {parsedResult.severity} SEVERITY
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-500">Target Customer:</span>{' '}
                      <strong className="text-slate-900">{parsedResult.customerMatched}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Hub City:</span>{' '}
                      <strong className="text-slate-900">{parsedResult.city}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Classification:</span>{' '}
                      <strong className="text-indigo-800 capitalize">{parsedResult.category.replace('_', ' ')}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800">Ground Root Cause:</span>
                    <p className="mt-0.5 text-slate-600 bg-white p-2 rounded border border-indigo-100">
                      {parsedResult.rootCause}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800">Recommended Ops Action Plan:</span>
                    <p className="mt-0.5 text-slate-800 whitespace-pre-line bg-white p-2 rounded border border-indigo-100 font-medium">
                      {parsedResult.actionPlan}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900">
                        Generated Ready-to-Send WhatsApp Text:
                      </span>
                      <button
                        onClick={() => copyToClipboard(parsedResult.draftResponse)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-300 shadow-2xs"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-slate-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                      "{parsedResult.draftResponse}"
                    </p>
                  </div>

                  {/* Direct Ops Execution Actions */}
                  <div className="pt-2 border-t border-indigo-200 flex flex-wrap items-center gap-2">
                    {onAddTask && (
                      <button
                        type="button"
                        onClick={handleCreateTaskFromAi}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Action Plan to Task Center</span>
                      </button>
                    )}

                    {onAddIssue && (
                      <button
                        type="button"
                        onClick={handleCreateBlockerFromAi}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Log as Active Blocker Ticket</span>
                      </button>
                    )}

                    {taskAddedToast && (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 animate-pulse">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Task Added to Dashboard!
                      </span>
                    )}

                    {blockerAddedToast && (
                      <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1 animate-pulse">
                        <Check className="w-3.5 h-3.5 text-rose-600" /> Blocker Ticket Created!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: INSTANT COMPOSER */}
          {activeMode === 'composer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Move</label>
                  <select
                    value={selectedRelocationId}
                    onChange={(e) => setSelectedRelocationId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {relocations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.customerName} ({r.toCity})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scenario Template</label>
                  <select
                    value={scenarioType}
                    onChange={(e) => setScenarioType(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="society_noc">Society NOC & Gate Pass</option>
                    <option value="vendor_delay">Packers Transit Delay Warning</option>
                    <option value="landlord_otp">Landlord Utility Transfer OTP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tone of Message</label>
                  <select
                    value={composerTone}
                    onChange={(e) => setComposerTone(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="firm_sla">Firm / Strict Legal SLA</option>
                    <option value="empathic">Polite & Empathetic</option>
                    <option value="vendor_urgency">High Urgency Dispatch</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateDraft}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs"
              >
                Regenerate AI Draft
              </button>

              {generatedDraft && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs">Formatted Output:</span>
                    <button
                      onClick={() => copyToClipboard(generatedDraft)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied to Clipboard' : 'Copy Draft'}
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-800 bg-white p-3 rounded-lg border border-emerald-100 whitespace-pre-wrap leading-relaxed">
                    {generatedDraft}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: CITY AUDIT */}
          {activeMode === 'audit' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Ground-level relocation failure modes identified across QuickMove's 8 operating hubs:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Bengaluru (Whitefield / ORR / Bellandur)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Lift NOC Curfew</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    High-density societies (Prestige, Sobha, Godrej) enforce strict 6 PM moving bans and require ₹10k–₹25k refundable lift deposits 48 hours in advance. Rain waterlogging on underpasses (Panathur, Kadubeesanahalli) delays 14ft container trucks.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Mumbai (Bandra / Khar / South Mumbai)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Heavy Truck Bans</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Traffic police strictly prohibits container trucks between 8 AM and 9 PM. By-lanes cannot fit 17ft or 19ft trucks, requiring pre-booked 2-to-3 Tata Ace mini-tempo shuttles to avoid vendor on-the-spot extortion.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Pune (Hinjawadi / Hadapsar / Kharadi)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">MSEDCL Arrears</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    MSEDCL electricity meter transfer requires physical stamped Index II and clearance of previous tenant electricity arrears before consumer portal unlocks transfer.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">Hyderabad (HITEC City / Gachibowli / Financial District)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">MyGate Digitization</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Strict digital gated pass via MyGate or ApnaComplex with landlord pre-approval. Pet ownership policies require rabies vaccination registration before entry.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Close AI Co-Pilot
          </button>
        </div>

      </div>
    </div>
  );
};
