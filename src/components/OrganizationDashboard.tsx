import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Award, 
  Send, 
  Users, 
  Activity, 
  Calendar, 
  Clock, 
  Check, 
  ExternalLink,
  Search,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { AssessmentResult, Certificate, EcoEvent, UserProfile } from '../types';

interface OrganizationDashboardProps {
  events: EcoEvent[];
  certificates: Certificate[];
  assessments: AssessmentResult[];
  currentUser: UserProfile;
  onCreateEvent: (newEvent: EcoEvent) => void;
  onApproveParticipation: (eventId: string, volunteerName: string) => void;
  onRejectParticipation: (eventId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({
  events,
  certificates,
  assessments,
  currentUser,
  onCreateEvent,
  onApproveParticipation,
  onRejectParticipation,
  onNavigateTab
}) => {
  // New event modal / form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Water Quality Audit');
  const [newDate, setNewDate] = useState('2026-10-20');
  const [newLocation, setNewLocation] = useState('East Coastal Estuary Basin');
  const [newMaxParticipants, setNewMaxParticipants] = useState(50);
  const [newDescription, setNewDescription] = useState('');
  const [newImpact, setNewImpact] = useState('25 Outfall Points Monitored');

  const [activeSubTab, setActiveSubTab] = useState<'events_volunteers' | 'pollution_oversight' | 'certificates_mgmt'>('events_volunteers');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: EcoEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      date: newDate,
      location: newLocation,
      participantsCount: 1,
      maxParticipants: Number(newMaxParticipants),
      status: 'Upcoming',
      description: newDescription || 'Standard environmental field auditing and cleanup drive.',
      impactMetrics: newImpact,
      createdByUser: currentUser.name,
      userJoined: false,
      userParticipated: false,
      userVerified: false
    };

    onCreateEvent(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setActionSuccessMsg(`Successfully created event "${created.title}"!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Critical pollution alerts count
  const criticalAssessments = assessments.filter(a => a.isCriticalAlert || a.grade === 'D');

  return (
    <div className="space-y-8">
      
      {/* Top Organization Header */}
      <div className="p-6 bg-slate-900/80 border border-cyan-500/25 rounded-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Authorized Environmental Organization Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Organization Governance &amp; Oversight
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-mono">
            Logged in as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.organization})
          </p>
        </div>

        {/* Quick action: Create New Event Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs font-mono rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create Stewardship Event</span>
        </button>
      </div>

      {/* Action Notification message */}
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('events_volunteers')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-2 ${
            activeSubTab === 'events_volunteers'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Events &amp; Volunteer Verification ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pollution_oversight')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-2 ${
            activeSubTab === 'pollution_oversight'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Pollution Alerts &amp; Authority Oversight ({criticalAssessments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certificates_mgmt')}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors flex items-center gap-2 ${
            activeSubTab === 'certificates_mgmt'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certificates Repository ({certificates.length})</span>
        </button>
      </div>

      {/* TAB 1: Events & Volunteer Verification */}
      {activeSubTab === 'events_volunteers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-5 bg-slate-900/80 border border-cyan-500/20 rounded-xl space-y-3 backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                    {evt.category}
                  </span>
                  <span className="text-slate-400">{evt.date}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{evt.title}</h4>
                  <div className="text-xs text-slate-400 line-clamp-1">{evt.location}</div>
                </div>

                <div className="text-xs font-mono text-slate-300 flex justify-between p-2 bg-slate-950 rounded">
                  <span>Registered Volunteers:</span>
                  <strong className="text-cyan-300">{evt.participantsCount} / {evt.maxParticipants}</strong>
                </div>

                {/* Verification Control */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Participation Status:</span>
                    <span className={`font-bold ${evt.userVerified ? 'text-emerald-400' : evt.userParticipated ? 'text-amber-400' : 'text-slate-500'}`}>
                      {evt.userVerified ? '✓ Approved & Certified' : evt.userParticipated ? 'Awaiting Org Approval' : 'Joined / Registered'}
                    </span>
                  </div>

                  {evt.userParticipated && !evt.userVerified ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onApproveParticipation(evt.id, currentUser.name);
                          setActionSuccessMsg(`Approved and issued certificate for ${evt.title}`);
                        }}
                        className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Approve &amp; Issue Cert</span>
                      </button>
                      <button
                        onClick={() => {
                          onRejectParticipation(evt.id);
                          setActionSuccessMsg(`Rejected participation claim for ${evt.title}`);
                        }}
                        className="py-1.5 px-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-400">
                      {evt.userVerified ? 'Digital credential verified on ledger.' : 'Pending volunteer field completion.'}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Pollution Alerts & Authority Oversight */}
      {activeSubTab === 'pollution_oversight' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Industrial Effluent Audits &amp; Critical Alert Surveillance
            </h3>
            <button
              onClick={() => onNavigateTab('pollution')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Open Pollution Assessment Suite</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Outlet ID</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Abnormal Parameters</th>
                  <th className="py-2.5 px-3">Authority Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-white font-bold">{a.outletId}</td>
                    <td className="py-2.5 px-3 text-slate-300 truncate max-w-xs">{a.location}</td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(a.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-3 text-white font-bold">{a.score} / 100</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        a.grade === 'A' ? 'bg-emerald-950 text-emerald-400' :
                        a.grade === 'B' ? 'bg-amber-950 text-amber-400' :
                        a.grade === 'C' ? 'bg-orange-950 text-orange-400' : 'bg-red-950 text-red-400'
                      }`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {a.abnormalParameters.length > 0 ? (
                        <span className="text-amber-400 font-mono text-[11px]">
                          {a.abnormalParameters.slice(0, 2).join(', ')}
                          {a.abnormalParameters.length > 2 ? ` +${a.abnormalParameters.length - 2}` : ''}
                        </span>
                      ) : (
                        <span className="text-emerald-400">Compliant</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {a.authorityNotified ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Dispatched ({a.authorityTicketId})</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Local Monitoring</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Certificates Repository */}
      {activeSubTab === 'certificates_mgmt' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Issued Credentials Ledger</h3>
            <span className="text-xs font-mono text-slate-400">{certificates.length} Total Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-xl space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">{cert.credentialId}</span>
                  <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    ✓ Verified
                  </span>
                </div>
                <div className="text-white font-semibold">{cert.eventTitle}</div>
                <div className="text-slate-400">Awarded to: <strong className="text-slate-200">{cert.recipientName}</strong></div>
                <div className="text-[10px] text-slate-500 truncate">Hash: {cert.verificationHash}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Create New Environmental Stewardship Event</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">Event Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ganga Canal Sluice Water Quality Sampling Expedition"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                  >
                    <option value="Water Quality Audit">Water Quality Audit</option>
                    <option value="Water Reuse Innovation">Water Reuse Innovation</option>
                    <option value="Habitat Restoration">Habitat Restoration</option>
                    <option value="Industrial Outfall Inspection">Industrial Outfall Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">Monitoring Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Max Volunteers</label>
                  <input
                    type="number"
                    value={newMaxParticipants}
                    onChange={(e) => setNewMaxParticipants(Number(e.target.value))}
                    min="5"
                    max="500"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[10px] mb-1">Impact Goal Target</label>
                  <input
                    type="text"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[10px] mb-1">Description &amp; Brief</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-white outline-none"
                  placeholder="Field sampling protocol, safety measures and equipment deployed..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  Publish Event
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
