import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download, 
  QrCode, 
  ExternalLink,
  ChevronRight,
  Filter,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { Certificate, EcoEvent, UserProfile } from '../types';

interface EventsCertificatesProps {
  events: EcoEvent[];
  certificates: Certificate[];
  currentUser: UserProfile;
  onUpdateEvent: (updated: EcoEvent) => void;
  onIssueCertificate: (cert: Certificate) => void;
}

export const EventsCertificates: React.FC<EventsCertificatesProps> = ({
  events,
  certificates,
  currentUser,
  onUpdateEvent,
  onIssueCertificate
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Upcoming' | 'In Progress' | 'Completed'>('All');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (filterStatus === 'All') return true;
    return ev.status === filterStatus;
  });

  // Handle Join Event
  const handleJoin = (evt: EcoEvent) => {
    const updated: EcoEvent = {
      ...evt,
      userJoined: true,
      participantsCount: evt.participantsCount + 1
    };
    onUpdateEvent(updated);
    setActionNotice(`You have joined "${evt.title}". Ready to start field participation!`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Handle Start Participation
  const handleStartParticipation = (evt: EcoEvent) => {
    const updated: EcoEvent = {
      ...evt,
      status: 'In Progress'
    };
    onUpdateEvent(updated);
    setActionNotice(`Field participation started for "${evt.title}". Sampling telemetry active.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Handle Complete Participation
  const handleParticipate = (evt: EcoEvent) => {
    const updated: EcoEvent = {
      ...evt,
      userParticipated: true,
      status: 'Completed'
    };
    onUpdateEvent(updated);
    setActionNotice(`Field participation completed for "${evt.title}". Submitted for organization verification.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Handle Organization Verification & Issue Certificate
  const handleVerifyAndIssue = (evt: EcoEvent) => {
    const certId = `CERT-AQUANEX-${Date.now().toString().slice(-6)}`;
    const newCert: Certificate = {
      id: certId,
      credentialId: `AQX-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      recipientName: currentUser.name,
      eventTitle: evt.title,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      issuerOrg: 'AQUANEX International Clean Water Initiative',
      hoursContributed: 8,
      verificationHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      skillsVerified: [
        'Industrial Water Sampling & Sensor Calibration',
        'Effluent Discharge Protocol Inspection',
        'Aquatic Watershed Bio-Integrity Assessment'
      ]
    };

    const updatedEvt: EcoEvent = {
      ...evt,
      userVerified: true,
      certificateId: certId
    };

    onUpdateEvent(updatedEvt);
    onIssueCertificate(newCert);
    setSelectedCertificate(newCert);
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-1">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Community Stewardship &amp; Verified Impact</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Environmental Events &amp; Certifications
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl mt-1">
            Participate in real-world watershed restoration drives, industrial effluent audits, and AC condensate reclamation workshops.
            Earn cryptographically authenticated stewardship certificates upon organizational verification.
          </p>
        </div>

        {/* User Certificate Count Badge */}
        <div className="flex items-center gap-3 p-3 bg-cyan-950/60 border border-cyan-500/30 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-cyan-300 uppercase">Earned Certificates</div>
            <div className="text-xl font-bold font-mono text-white">
              {certificates.length} <span className="text-xs text-slate-400">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action notice banner if present */}
      {actionNotice && (
        <div className="p-3 bg-cyan-950/90 border border-cyan-500/50 rounded-lg text-xs font-mono text-cyan-200 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* EVENTS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Environmental Stewardship Drives</h2>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs font-mono">
            {(['All', 'Upcoming', 'In Progress', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded transition-colors ${
                  filterStatus === st
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const cert = certificates.find((c) => c.id === evt.certificateId);

            return (
              <div
                key={evt.id}
                className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-cyan-400/50 transition-all"
              >
                <div className="space-y-3">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      evt.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                      evt.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  {/* Details metadata */}
                  <div className="space-y-1.5 text-xs text-slate-400 font-mono pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{evt.participantsCount} / {evt.maxParticipants} Volunteers</span>
                    </div>
                  </div>

                  {/* Impact banner */}
                  <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded text-[11px] font-mono text-teal-300">
                    🌱 {evt.impactMetrics}
                  </div>
                </div>

                {/* Event Action Workflow: View → Join → Start → Complete → Verify → Certificate */}
                <div className="pt-3 border-t border-slate-800">
                  {evt.userVerified && cert ? (
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>View Verified Certificate</span>
                    </button>
                  ) : evt.userParticipated ? (
                    <button
                      onClick={() => handleVerifyAndIssue(evt)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 text-xs font-mono font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify &amp; Receive Certificate</span>
                    </button>
                  ) : evt.userJoined && evt.status === 'In Progress' ? (
                    <button
                      onClick={() => handleParticipate(evt)}
                      className="w-full py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/50 text-teal-300 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Complete Participation</span>
                    </button>
                  ) : evt.userJoined ? (
                    <button
                      onClick={() => handleStartParticipation(evt)}
                      className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>Start Participation</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(evt)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Join Stewardship Event</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ISSUED CERTIFICATES VAULT */}
      <div className="bg-slate-900/80 border border-cyan-500/25 rounded-xl p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Official Digital Certificates Vault
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            AQUANEX Clean Water Alliance Accredited
          </span>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm font-mono border border-dashed border-slate-800 rounded-xl p-6">
            <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No certificates available yet.</p>
            <p className="text-xs text-slate-500 mt-1">Join an environmental event above, complete field participation, and obtain organizational verification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 rounded-xl transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cert.eventTitle}</h4>
                      <div className="text-[11px] font-mono text-cyan-300">ID: {cert.credentialId}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono rounded"
                  >
                    View
                  </button>
                </div>

                <div className="text-xs text-slate-300 font-mono space-y-1 pt-1 border-t border-slate-800">
                  <div>Issued to: <strong className="text-white">{cert.recipientName}</strong></div>
                  <div>Date: <span className="text-slate-400">{cert.issueDate}</span></div>
                  <div>Issuer: <span className="text-slate-400">{cert.issuerOrg}</span></div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span className="truncate max-w-[200px]">Hash: {cert.verificationHash.slice(0, 18)}...</span>
                  <span className="text-emerald-400 font-bold">✓ Authenticated</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL CERTIFICATE DIGITAL VIEWER & PRINT MODAL */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#07111e] border-2 border-cyan-400/60 rounded-2xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)] relative space-y-6">
            
            {/* Top Close button */}
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white font-mono text-sm"
            >
              ✕
            </button>

            {/* Certificate Canvas Graphic Mock */}
            <div className="border-4 border-double border-cyan-500/40 p-6 rounded-xl bg-gradient-to-b from-[#09182b] to-[#050e1b] relative overflow-hidden text-center space-y-4">
              
              {/* Watermark seal behind */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Award className="w-96 h-96 text-cyan-400" />
              </div>

              {/* Certificate Header */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  AQUANEX INTERNATIONAL CLEAN WATER INITIATIVE
                </div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                  Certificate of Environmental Stewardship
                </h2>
                <div className="text-xs text-slate-400">
                  Credential ID: <span className="font-mono text-cyan-300">{selectedCertificate.credentialId}</span>
                </div>
              </div>

              {/* Recipient */}
              <div className="py-2">
                <div className="text-xs text-slate-400 italic">This is proudly awarded to</div>
                <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-teal-300 my-1 font-serif">
                  {selectedCertificate.recipientName}
                </div>
                <div className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  In recognition of distinguished leadership, field telemetry participation, and exemplary dedication to preserving freshwater biomes during:
                </div>
                <div className="text-sm font-bold text-cyan-200 mt-1">
                  "{selectedCertificate.eventTitle}"
                </div>
              </div>

              {/* Skills Verified */}
              <div className="p-3 bg-black/40 border border-cyan-500/20 rounded-lg text-left text-xs font-mono">
                <div className="text-[10px] text-cyan-400 uppercase font-bold mb-1">Competencies Verified:</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                  {selectedCertificate.skillsVerified.map((sk, idx) => (
                    <li key={idx}>{sk}</li>
                  ))}
                </ul>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-4 border-t border-cyan-500/20 grid grid-cols-3 items-end text-xs font-mono">
                <div className="text-left">
                  <div className="text-[10px] text-slate-400">Issue Date</div>
                  <div className="text-slate-200 font-semibold">{selectedCertificate.issueDate}</div>
                </div>

                {/* Digital Stamp Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full border-2 border-cyan-400/60 bg-cyan-950/60 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <ShieldCheck className="w-7 h-7 text-cyan-400" />
                  </div>
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest mt-1">
                    VERIFIED SEAL
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Digital Signature</div>
                  <div className="text-cyan-300 font-bold font-serif italic text-sm">Dr. Marcus Vance</div>
                  <div className="text-[9px] text-slate-500">Chief Environmental Officer</div>
                </div>
              </div>

              <div className="text-[9px] font-mono text-slate-500 truncate pt-1">
                Cryptographic Audit Hash: {selectedCertificate.verificationHash}
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400">
                Official accreditation verifiable globally.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCertificate(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
