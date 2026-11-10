'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  User,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SupportTicket, TicketStatus } from '@careconnect/types';

export default function SupportDeskPage() {
  const { tickets, respondToTicket, updateTicketStatus } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(tickets[0]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filteredTickets = tickets.filter(
    (t) => statusFilter === 'all' || t.status === statusFilter
  );

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setIsSending(true);
    await respondToTicket(selectedTicket.id, replyText);
    setReplyText('');
    setIsSending(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Support Desk & Feedback Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review patient inquiries, doctor availability questions, and platform suggestions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          <LifeBuoy className="w-4 h-4 text-teal-600" />
          <span>{tickets.length} Active Demo Tickets</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              statusFilter === st
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Tickets List on Left, Thread on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Column */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2">
            Ticket Feed ({filteredTickets.length})
          </span>

          <div className="space-y-2">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'urgent' || t.priority === 'high'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {t.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {t.message}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 mt-2">
                    <span>{t.userName} ({t.userRole})</span>
                    <span className="capitalize font-semibold text-teal-600 dark:text-teal-400">
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Ticket Conversation & Action */}
        {selectedTicket && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            {/* Ticket Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedTicket.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted by {selectedTicket.userName} ({selectedTicket.userRole})
                </p>
              </div>

              {selectedTicket.status !== 'resolved' && (
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                  className="px-3 py-1.5 rounded-xl border border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  Mark Resolved
                </button>
              )}
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedTicket.userName}
                  </span>
                  <span className="text-slate-400 text-[10px]">Initial Inquiry</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedTicket.message}
                </p>
              </div>

              {selectedTicket.responses.map((resp) => (
                <div
                  key={resp.id}
                  className={`p-4 rounded-xl space-y-1 border ${
                    resp.role === 'admin'
                      ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {resp.sender}
                    </span>
                    <span className="text-slate-400 text-[10px]">{resp.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {resp.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Input Box */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Send Administrator Response (Resolves Ticket in Local State)
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type official CareConnect support guidance here..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending...' : 'Send Response & Resolve'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
