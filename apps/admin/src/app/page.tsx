'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Stethoscope,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function AdminOverviewPage() {
  const { doctors, appointments, analytics, auditLogs } = useAdmin();

  const pendingDoctorsCount = doctors.filter((d) => d.verificationStatus === 'pending').length;
  const recentBookings = appointments.slice(0, 5);

  const kpis = [
    {
      label: 'Total Patients',
      value: analytics.totalPatients.toLocaleString(),
      change: '+14% vs last month',
      isPositive: true,
      icon: Users,
      color: 'teal',
    },
    {
      label: 'Verified Doctors',
      value: analytics.totalDoctors.toLocaleString(),
      change: '+8 new this week',
      isPositive: true,
      icon: Stethoscope,
      color: 'blue',
    },
    {
      label: 'Pending Verification',
      value: pendingDoctorsCount.toString(),
      change: 'Requires administrative action',
      isPositive: false,
      icon: ShieldAlert,
      color: 'amber',
      highlight: pendingDoctorsCount > 0,
      href: '/doctors/verification',
    },
    {
      label: 'Total Consultations',
      value: analytics.totalAppointments.toLocaleString(),
      change: '+22% telehealth volume',
      isPositive: true,
      icon: Calendar,
      color: 'indigo',
    },
    {
      label: 'Completed Consults',
      value: analytics.completedConsultations.toLocaleString(),
      change: '93.6% fulfillment rate',
      isPositive: true,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      label: 'Cancelled / Rescheduled',
      value: analytics.cancelledAppointments.toLocaleString(),
      change: '6.4% cancellation rate',
      isPositive: false,
      icon: XCircle,
      color: 'rose',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Greeting & Demo Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Healthcare System Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time status of doctors, patients, and scheduled consultations across CareConnect.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/doctors/verification"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review Applications ({pendingDoctorsCount})</span>
          </Link>
        </div>
      </div>

      {/* 1. KEY KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                kpi.highlight
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    kpi.color === 'teal'
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                      : kpi.color === 'amber'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : kpi.color === 'emerald'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
                {kpi.value}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {kpi.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Clock className="w-3 h-3 text-amber-500" />
                )}
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Trends Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Monthly Consultation Volume
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total bookings vs completed consultations (May - Nov 2026)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-slate-600 dark:text-slate-300">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-slate-600 dark:text-slate-300">Completed</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="pt-4 h-56 flex items-end justify-between gap-3 px-2">
            {analytics.appointmentTrends.map((trend) => {
              const maxVal = 7000;
              const bookedHeight = (trend.appointments / maxVal) * 100;
              const completedHeight = (trend.completed / maxVal) * 100;

              return (
                <div key={trend.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    <div
                      style={{ height: `${bookedHeight}%` }}
                      className="w-4 sm:w-6 bg-teal-600 hover:bg-teal-500 rounded-t-md transition-all relative group-hover:shadow-md"
                      title={`${trend.date}: ${trend.appointments} Bookings`}
                    />
                    <div
                      style={{ height: `${completedHeight}%` }}
                      className="w-4 sm:w-6 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-t-md transition-all"
                      title={`${trend.date}: ${trend.completed} Completed`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {trend.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Growth by Month */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Doctor Network Growth
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active verified clinical specialists
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.doctorGrowth.map((g) => {
              const percent = Math.round((g.doctors / 550) * 100);
              return (
                <div key={g.month} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{g.month} 2026</span>
                    <span className="text-teal-600 dark:text-teal-400">{g.doctors} doctors</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-gradient-to-r from-teal-500 to-teal-700 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <span>Specialist onboarding SLA</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">98.2% on-time</span>
          </div>
        </div>
      </div>

      {/* 3. RECENT BOOKINGS & ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recent Bookings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest consultation scheduling actions
              </p>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5">Reference</th>
                  <th className="py-2.5">Patient</th>
                  <th className="py-2.5">Doctor</th>
                  <th className="py-2.5">Slot</th>
                  <th className="py-2.5">Mode</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {recentBookings.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {apt.bookingReference}
                    </td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">
                      {apt.patientName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {apt.doctorName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {apt.date} • {apt.time}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {apt.mode === 'video' ? <Video className="w-3 h-3 text-teal-600" /> : <MapPin className="w-3 h-3 text-teal-600" />}
                        {apt.mode === 'video' ? 'Video' : 'Clinic'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'upcoming'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : apt.status === 'completed'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {apt.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Audit Stream (Demo)
            </h2>
            <Link
              href="/audit-logs"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1"
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {log.actorName}
                  </span>
                  <span className="text-slate-400">{log.timestamp.split(' ')[1]}</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {log.action}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
