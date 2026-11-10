'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  Building,
  Award,
  Globe,
  X,
  Stethoscope,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Doctor } from '@careconnect/types';

export default function DoctorManagementPage() {
  const { doctors, approveDoctor, rejectDoctor } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const specialities = Array.from(new Set(doctors.map((d) => d.specialityName)));

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialityName.toLowerCase().includes(q) ||
        doc.clinicAddress.toLowerCase().includes(q);

      const matchesSpec = specialityFilter === 'all' || doc.specialityName === specialityFilter;
      const matchesStatus = statusFilter === 'all' || doc.verificationStatus === statusFilter;

      return matchesSearch && matchesSpec && matchesStatus;
    });
  }, [doctors, searchQuery, specialityFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Doctor Directory & Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse verified clinical practitioners, review council credentials, and monitor performance.
          </p>
        </div>

        <Link
          href="/doctors/verification"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Verification Queue</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor name, clinic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Speciality Filter */}
          <select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Specialities</option>
            {specialities.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {(['all', 'verified', 'pending'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Doctor Details</th>
                <th className="py-3.5 px-4">Speciality</th>
                <th className="py-3.5 px-4">Qualifications & Experience</th>
                <th className="py-3.5 px-4">Consultation Fee</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredDoctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {doc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {doc.registrationNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {doc.specialityName}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-slate-800 dark:text-slate-200 text-xs">
                      {doc.qualification}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {doc.experienceYears} years clinical experience
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white text-sm">
                    ₹{doc.consultationFee}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({doc.reviewCount})
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        doc.verificationStatus === 'verified'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : doc.verificationStatus === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          doc.verificationStatus === 'verified'
                            ? 'bg-emerald-500'
                            : doc.verificationStatus === 'pending'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span className="capitalize">{doc.verificationStatus}</span>
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT DOCTOR DRAWER / MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.avatarUrl}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-600"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {selectedDoctor.title}
                  </p>
                  <p className="text-xs text-slate-500">{selectedDoctor.qualification}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block">Registration Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedDoctor.registrationNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Medical Council</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedDoctor.registrationCouncil}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Consultation Fee</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  ₹{selectedDoctor.consultationFee}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Clinical Experience</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedDoctor.experienceYears} Years
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Clinical Facility
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {selectedDoctor.clinicAddress}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                About Specialist
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedDoctor.bio}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Clinical Focus Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDoctor.areasOfPractice.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Status:{' '}
                <strong className="capitalize text-slate-900 dark:text-white">
                  {selectedDoctor.verificationStatus}
                </strong>
              </span>

              {selectedDoctor.verificationStatus === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      approveDoctor(selectedDoctor.id);
                      setSelectedDoctor(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                  >
                    Approve Verification
                  </button>
                  <button
                    onClick={() => {
                      rejectDoctor(selectedDoctor.id);
                      setSelectedDoctor(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
