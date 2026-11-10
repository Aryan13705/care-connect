'use client';

import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all animate-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-700 text-white'
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-white'
              : 'bg-slate-900/90 border-slate-700 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-teal-400 flex-shrink-0" />
          )}

          <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
