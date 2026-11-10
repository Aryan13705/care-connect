'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export function AdminNavbar() {
  const { isDark, toggleTheme, tickets, appointments } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingAppointments = appointments.filter((a) => a.status === 'upcoming').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;

  return (
    <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-72 md:w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctors, patients, records..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Environment Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Demo SaaS Sandbox</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {(openTickets > 0 || pendingAppointments > 0) && (
              <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Platform Notifications
                </span>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  {openTickets + pendingAppointments} Active
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-teal-600 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {pendingAppointments} Consultations Scheduled
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      Active appointments pending in local pipeline.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {openTickets} Support Inquiries
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      Awaiting administrative responses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            A
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Aryan Jaiswal
            </div>
            <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              Lead Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
