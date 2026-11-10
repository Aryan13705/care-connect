'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Award,
  Building,
  Calendar,
  ChevronLeft,
  AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function DoctorVerificationPage() {
  const { doctors, approveDoctor, rejectDoctor } = useAdmin();

  const pendingDoctors = doctors.filter((d) => d.verificationStatus === 'pending');
  const [selectedDocId, setSelectedDocId] = useState<string>(
    pendingDoctors[0]?.id || doctors[0]?.id
  );
  const [reviewNotes, setReviewNotes] = useState(
    'Medical degree from CMC Vellore and Karnataka Medical Council registration verified against demo public ledger.'
  );

  const selectedDoctor = doctors.find((d) => d.id === selectedDocId) || doctors[0];

  const handleApprove = async () => {
    if (!selectedDoctor) return;
    await approveDoctor(selectedDoctor.id, reviewNotes);
  };

  const handleReject = async () => {
    if (!selectedDoctor) return;
    await rejectDoctor(selectedDoctor.id, reviewNotes);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/doctors"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Doctor Credential Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review state council registrations and educational degrees before granting clinical license.
          </p>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
        <span>
          <strong>Phase 1 Demonstration Workflow:</strong> Simulated verification approval engine. Actions update in-memory state and append administrative audit logs.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Queue (Left Column) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold uppercase text-slate-400">
              Applications Queue ({pendingDoctors.length})
            </span>
          </div>

          {pendingDoctors.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Queue Cleared!
              </p>
              <p className="text-xs text-slate-500">
                All submitted doctor credential applications have been reviewed.
              </p>
            </div>
          ) : (
            pendingDoctors.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold truncate">
                        {doc.specialityName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        Reg: {doc.registrationNumber}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Doctor Dossier & Documents (Right Columns) */}
        {selectedDoctor && (
          <div className="lg:col-span-2 space-y-5">
            {/* Candidate Header */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedDoctor.avatarUrl}
                    alt={selectedDoctor.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-600"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedDoctor.name}
                    </h2>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {selectedDoctor.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      Applied on 08 Nov 2026 • Status:{' '}
                      <span className="font-bold capitalize text-slate-800 dark:text-slate-200">
                        {selectedDoctor.verificationStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={selectedDoctor.verificationStatus === 'verified'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Credentials</span>
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={selectedDoctor.verificationStatus === 'rejected'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* Council & Degree Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedDoctor.registrationNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Medical Council</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedDoctor.registrationCouncil}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedDoctor.experienceYears} Years Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Document Verification Preview */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Uploaded Verification Certificates
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Certificate 1: Degree */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>Postgraduate Medical Degree</span>
                    </div>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                      PDF • 2.4 MB
                    </span>
                  </div>

                  <div className="h-32 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 flex flex-col justify-between text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-[8px] bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold px-1.5 py-0.5 rounded">
                      DIGITAL PREVIEW
                    </div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-2">
                      {selectedDoctor.qualification}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Conferred by Recognized University Medical Faculty
                    </div>
                    <div className="text-[9px] text-teal-600 dark:text-teal-400 font-mono">
                      Doc Hash: sha256:7f81b9...verified
                    </div>
                  </div>
                </div>

                {/* Certificate 2: Registration Council */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span>Council Registration Certificate</span>
                    </div>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
                      PDF • 1.1 MB
                    </span>
                  </div>

                  <div className="h-32 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 flex flex-col justify-between text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-[8px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                      SEAL VALID
                    </div>
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-2">
                      {selectedDoctor.registrationCouncil}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      License #{selectedDoctor.registrationNumber}
                    </div>
                    <div className="text-[9px] text-teal-600 dark:text-teal-400 font-mono">
                      Good Standing: Active & Unencumbered
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Notes Input */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Administrative Verification Audit Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                placeholder="Enter audit review findings before signing off..."
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
