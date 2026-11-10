'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  ShieldCheck,
  Users,
  Calendar,
  LifeBuoy,
  BarChart3,
  Sliders,
  FileSpreadsheet,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const { doctors, tickets } = useAdmin();

  const pendingVerificationCount = doctors.filter((d) => d.verificationStatus === 'pending').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Doctor Directory', href: '/doctors', icon: Stethoscope },
    {
      label: 'Doctor Verification',
      href: '/doctors/verification',
      icon: ShieldCheck,
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
    },
    { label: 'Patient Directory', href: '/patients', icon: Users },
    { label: 'Appointments', href: '/appointments', icon: Calendar },
    {
      label: 'Support Desk',
      href: '/support',
      icon: LifeBuoy,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
    },
    { label: 'Platform Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Platform Settings', href: '/settings', icon: Sliders },
    { label: 'Audit Logs', href: '/audit-logs', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-900/40">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg tracking-tight">CareConnect</div>
              <div className="text-xs text-teal-400 font-semibold tracking-wider uppercase">
                Admin Console
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 m-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Phase 1 Demo Active</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Local demonstration repository without authentication.
        </p>
      </div>
    </aside>
  );
}
