'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AuditLogsPage() {
  const { auditLogs } = useAdmin();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Administrative Audit Log Preview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable tracking of verification decisions, booking updates, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          <FileSpreadsheet className="w-4 h-4 text-teal-600" />
          <span>{auditLogs.length} Demonstration Records</span>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
        <span>
          <strong>Illustrative Audit Records:</strong> Generated automatically during clinical verification, status adjustments, and patient interactions in Phase 1.
        </span>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, actor, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Event Action</th>
                <th className="py-3.5 px-4">Resource</th>
                <th className="py-3.5 px-6">Event Details</th>
                <th className="py-3.5 px-4">Origin IP</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white">
                    <div>{log.actorName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{log.actorRole}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-400">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {log.resourceType}: <span className="font-bold">{log.resourceId}</span>
                  </td>

                  <td className="py-3.5 px-6 font-sans text-slate-600 dark:text-slate-300 max-w-xs">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.status === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : log.status === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
