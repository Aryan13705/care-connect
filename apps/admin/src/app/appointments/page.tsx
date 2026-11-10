'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Appointment, AppointmentStatus } from '@careconnect/types';

export default function AppointmentManagementPage() {
  const { appointments, updateAppointmentStatus } = useAdmin();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesTab = activeTab === 'all' || a.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.bookingReference.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.doctorSpeciality.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [appointments, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Consultation Appointments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global scheduling ledger across all telehealth video rooms and in-person hospital visits.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>{appointments.length} Total Bookings Recorded</span>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, patient, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-full md:w-auto">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? appointments.length
                : appointments.filter((a) => a.status === tab).length;
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Reference</th>
                <th className="py-3.5 px-4">Patient Details</th>
                <th className="py-3.5 px-4">Specialist Doctor</th>
                <th className="py-3.5 px-4">Slot Schedule</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Fee Breakdown</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {apt.bookingReference}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {apt.patientName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {apt.patientAge}y, {apt.patientGender}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {apt.doctorName}
                    </div>
                    <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                      {apt.doctorSpeciality}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-semibold">
                      {apt.date}
                    </div>
                    <div className="text-[11px] text-slate-500">{apt.time}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {apt.mode === 'video' ? (
                        <Video className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      )}
                      <span>{apt.mode === 'video' ? 'Virtual Video' : 'In-Clinic'}</span>
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      ₹{apt.totalFee}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ₹{apt.consultationFee} + ₹{apt.platformFee}
                    </div>
                  </td>

                  <td className="py-4 px-4">
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

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPOINTMENT MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Appointment Detail</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {selectedAppointment.bookingReference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 block">Patient</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedAppointment.patientName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Doctor</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedAppointment.doctorName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Date & Time</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-bold capitalize text-slate-800 dark:text-slate-200">
                  {selectedAppointment.status}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Reason for Visit
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {selectedAppointment.reasonForVisit}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Administrative Status Override (Demo)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateAppointmentStatus(selectedAppointment.id, 'completed');
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => {
                    updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
