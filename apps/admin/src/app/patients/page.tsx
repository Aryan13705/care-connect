'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  X,
  FileText,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Patient } from '@careconnect/types';

export default function PatientManagementPage() {
  const { patients, appointments, showToast } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientStatuses, setPatientStatuses] = useState<Record<string, 'Active' | 'Suspended'>>({
    'patient-aryan-01': 'Active',
    'patient-sunita-02': 'Active',
    'patient-aarav-03': 'Active',
    'patient-kavita-04': 'Active',
  });

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    });
  }, [patients, searchQuery]);

  const toggleStatus = (patientId: string) => {
    const current = patientStatuses[patientId] || 'Active';
    const next = current === 'Active' ? 'Suspended' : 'Active';
    setPatientStatuses((prev) => ({ ...prev, [patientId]: next }));
    showToast(`Patient account status updated to ${next} (Demo).`, next === 'Active' ? 'success' : 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Patient Directory & Accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registered patient records, family dependents, health summaries, and account statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Users className="w-4 h-4 text-teal-600" />
          <span>{patients.length} Registered Demo Patients</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Patient</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Clinical Tags</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredPatients.map((p) => {
                const status = patientStatuses[p.id] || 'Active';
                const pAppointments = appointments.filter((a) => a.patientId === p.id);

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{p.city}, India</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {p.age}y • {p.gender}
                      </span>
                      <div className="text-[11px] text-slate-500">Blood: {p.bloodGroup}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-slate-800 dark:text-slate-200">{p.phone}</div>
                      <div className="text-[11px] text-slate-400">{p.email}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.chronicConditions.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-semibold"
                          >
                            {c}
                          </span>
                        ))}
                        {p.allergies.map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-semibold"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {status === 'Active' ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        <span>{status}</span>
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PATIENT DOSSIER MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatient.avatarUrl}
                  alt={selectedPatient.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedPatient.age} years • {selectedPatient.gender} • Blood: {selectedPatient.bloodGroup}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
              <div>
                <span className="text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedPatient.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {selectedPatient.email}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Preferred Language</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedPatient.preferredLanguage}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Emergency Contact</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Appointment History in Demo
              </span>
              <div className="space-y-2">
                {appointments
                  .filter((a) => a.patientId === selectedPatient.id || a.patientName === selectedPatient.name)
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {apt.doctorName} ({apt.doctorSpeciality})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {apt.date} • {apt.time} • {apt.mode}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                        {apt.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
