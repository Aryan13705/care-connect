'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AnalyticsPage() {
  const { analytics } = useAdmin();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Healthcare Platform Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Macro metrics across clinical specialties, patient demographic growth, and appointment fulfillment.
        </p>
      </div>

      {/* KPI HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Consultations Managed</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalAppointments.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% month-over-month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Active Patient Cohort</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics.totalPatients.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1,420 new registrations</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Estimated Monthly Platform GMV</span>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
            ₹{analytics.monthlyRevenueEstimate.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 font-medium">Demonstration Simulated Volume</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Consultation Completion Rate</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">93.6%</div>
          <div className="text-xs text-emerald-500 font-semibold">Low cancellation rate (6.4%)</div>
        </div>
      </div>

      {/* SPECIALITY DISTRIBUTION BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Consultation Volume by Speciality
            </h2>
            <p className="text-xs text-slate-500">Distribution across 12 clinical branches</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {analytics.specialityDistribution.map((spec) => (
              <div key={spec.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{spec.name}</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {spec.count} doctors ({spec.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${spec.percentage * 3.5}%` }}
                    className="h-full bg-teal-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REVENUE BREAKDOWN CHART */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Revenue Analytics Projection (Simulated)
            </h2>
            <p className="text-xs text-slate-500">Monthly consultation GMV in INR</p>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { m: 'Jun', amt: '₹7.8L', h: 55 },
              { m: 'Jul', amt: '₹8.9L', h: 63 },
              { m: 'Aug', amt: '₹10.2L', h: 72 },
              { m: 'Sep', amt: '₹11.8L', h: 83 },
              { m: 'Oct', amt: '₹13.4L', h: 92 },
              { m: 'Nov (Proj)', amt: '₹14.2L', h: 100 },
            ].map((bar) => (
              <div key={bar.m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {bar.amt}
                </span>
                <div
                  style={{ height: `${bar.h}%` }}
                  className="w-full bg-gradient-to-t from-teal-700 to-teal-500 rounded-t-lg transition-all hover:opacity-90"
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {bar.m}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 flex justify-between items-center">
            <span>Platform take rate: ₹49 per booking</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">
              Estimated ₹1.41L in platform fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
