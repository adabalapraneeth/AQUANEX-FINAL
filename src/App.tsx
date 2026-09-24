import React, { useState, useEffect } from 'react';
import { CosmicBackground } from './components/CosmicBackground';
import { Navbar, NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PollutionAssessment } from './components/PollutionAssessment';
import { SolarWaterTreatment } from './components/SolarWaterTreatment';
import { ACWaterReuse } from './components/ACWaterReuse';
import { EventsCertificates } from './components/EventsCertificates';
import { Dashboard } from './components/Dashboard';
import { OrganizationDashboard } from './components/OrganizationDashboard';
import { AuthModal } from './components/AuthModal';
import { 
  ACWaterBatch, 
  AssessmentResult, 
  Certificate, 
  EcoEvent, 
  TimeSeriesReading, 
  UserProfile 
} from './types';
import { 
  getCurrentAssessment, 
  getCurrentUser, 
  getStoredACBatches, 
  getStoredAssessments, 
  getStoredCertificates, 
  getStoredEvents, 
  getTimeSeriesReadings, 
  saveCurrentAssessment, 
  saveCurrentUser, 
  saveStoredACBatches, 
  saveStoredAssessments, 
  saveStoredCertificates, 
  saveStoredEvents, 
  saveTimeSeriesReadings 
} from './utils/storage';
import { Droplets, ShieldCheck, Heart, Github, Sun, Building2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult>(getCurrentAssessment);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(getStoredAssessments);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesReading[]>(getTimeSeriesReadings);
  const [acBatches, setAcBatches] = useState<ACWaterBatch[]>(getStoredACBatches);
  const [events, setEvents] = useState<EcoEvent[]>(getStoredEvents);
  const [certificates, setCertificates] = useState<Certificate[]>(getStoredCertificates);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveCurrentAssessment(currentAssessment);
  }, [currentAssessment]);

  useEffect(() => {
    saveStoredAssessments(assessmentHistory);
  }, [assessmentHistory]);

  useEffect(() => {
    saveTimeSeriesReadings(timeSeries);
  }, [timeSeries]);

  useEffect(() => {
    saveStoredACBatches(acBatches);
  }, [acBatches]);

  useEffect(() => {
    saveStoredEvents(events);
  }, [events]);

  useEffect(() => {
    saveStoredCertificates(certificates);
  }, [certificates]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  // Handlers for assessments
  const handleNewAssessment = (result: AssessmentResult, newTimeSeriesPoint?: TimeSeriesReading) => {
    setCurrentAssessment(result);
    setAssessmentHistory((prev) => [result, ...prev]);

    if (newTimeSeriesPoint) {
      setTimeSeries((prev) => [...prev, newTimeSeriesPoint]);
    }
  };

  const handleUpdateAssessment = (updated: AssessmentResult) => {
    setCurrentAssessment(updated);
    setAssessmentHistory((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Handlers for AC Water Reclaim
  const handleAddACBatch = (batch: ACWaterBatch) => {
    setAcBatches((prev) => [batch, ...prev]);
  };

  // Handlers for Events & Certs
  const handleUpdateEvent = (updated: EcoEvent) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === updated.id ? updated : evt))
    );
  };

  const handleIssueCertificate = (cert: Certificate) => {
    setCertificates((prev) => [cert, ...prev]);
  };

  // Handlers for Organization Dashboard
  const handleCreateEvent = (newEvent: EcoEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleApproveParticipation = (eventId: string, volunteerName: string) => {
    const certId = `CERT-AQUANEX-${Date.now().toString().slice(-6)}`;
    const evt = events.find((e) => e.id === eventId);
    const newCert: Certificate = {
      id: certId,
      credentialId: `AQX-${Math.floor(1000 + Math.random() * 9000)}-ORG`,
      recipientName: volunteerName || 'Verified Environmental Volunteer',
      eventTitle: evt?.title || 'Industrial Water Quality Field Sampling',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      issuerOrg: currentUser.organization || 'AQUANEX Clean Water Alliance',
      hoursContributed: 8,
      verificationHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      skillsVerified: [
        'Effluent Discharge Audit Compliance',
        'Field Sensor Cross-Calibration',
        'Watershed Biome Protection Protocols'
      ],
      status: 'Approved'
    };

    setCertificates((prev) => [newCert, ...prev]);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, userVerified: true, certificateId: certId } : e
      )
    );
  };

  const handleRejectParticipation = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, userParticipated: false, userVerified: false } : e
      )
    );
  };

  // Check critical alerts
  const criticalCount = assessmentHistory.filter(
    (h) => h.isCriticalAlert || h.grade === 'D'
  ).length;

  return (
    <div className="min-h-screen bg-[#040812] text-slate-100 flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Cosmic Background with Stars & Upward Hydro Particles */}
      <CosmicBackground />

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        hasCriticalAlert={currentAssessment.isCriticalAlert || criticalCount > 0}
        criticalAlertCount={criticalCount}
        onJumpToCriticalAlert={() => {
          setCurrentTab('pollution');
        }}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {currentTab === 'home' && (
          <HeroSection
            onSelectTab={setCurrentTab}
            currentAssessment={currentAssessment}
          />
        )}

        {currentTab === 'pollution' && (
          <PollutionAssessment
            currentAssessment={currentAssessment}
            history={assessmentHistory}
            timeSeries={timeSeries}
            onNewAssessment={handleNewAssessment}
            onUpdateAssessment={handleUpdateAssessment}
          />
        )}

        {currentTab === 'solar' && (
          <SolarWaterTreatment />
        )}

        {currentTab === 'ac-reuse' && (
          <ACWaterReuse
            batches={acBatches}
            onAddBatch={handleAddACBatch}
          />
        )}

        {currentTab === 'events' && (
          <EventsCertificates
            events={events}
            certificates={certificates}
            currentUser={currentUser}
            onUpdateEvent={handleUpdateEvent}
            onIssueCertificate={handleIssueCertificate}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            currentAssessment={currentAssessment}
            history={assessmentHistory}
            acBatches={acBatches}
            events={events}
            certificates={certificates}
            user={currentUser}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'org-portal' && (
          <OrganizationDashboard
            events={events}
            certificates={certificates}
            assessments={assessmentHistory}
            currentUser={currentUser}
            onCreateEvent={handleCreateEvent}
            onApproveParticipation={handleApproveParticipation}
            onRejectParticipation={handleRejectParticipation}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#03070f]/95 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-wider">AQUANEX</span>
            <span>— Smart Water. Sustainable Future.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-amber-400 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Solar Hydro-Purification Active</span>
            </span>
            <span className="text-slate-400">5 Baseline Sensors + Optional Hardware Probes</span>
            <span className="text-cyan-400">SPCB Authority Dispatch Simulation</span>
          </div>
        </div>
      </footer>

      {/* 5. User Profile / Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSaveUser={setCurrentUser}
        onLogout={() => {
          setCurrentUser({
            id: 'USR-GUEST',
            name: 'Guest Observer',
            email: 'guest@aquanex.org',
            role: 'Community Volunteer',
            organization: 'Independent Environmental Observer',
            isAuthenticated: false
          });
        }}
      />

    </div>
  );
}
