import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Relocation } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  move: Relocation | null;
  onConfirmDelete: (moveId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  move,
  onConfirmDelete,
}) => {
  if (!isOpen || !move) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">Delete Relocation?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This action permanently removes the relocation from the active pipeline and local storage.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Move Card Info */}
        <div className="p-5 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-slate-700 mb-1">
              <span className="font-bold text-slate-900">{move.customerName}</span>
              <span className="font-mono text-slate-500">{move.id}</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Route: <strong>{move.fromCity} → {move.toCity}</strong>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Phase: {move.currentPhase} · Ops Lead: {move.assignedOps}
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed text-[11px]">
            Please confirm you want to remove this record from QuickMove's operational pipeline. Associated on-ground coordination for this move will be terminated.
          </p>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete(move.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};
