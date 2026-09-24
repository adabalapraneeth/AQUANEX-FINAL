import { ACWaterBatch, AssessmentResult, Certificate, EcoEvent, TimeSeriesReading, UserProfile } from '../types';
import { INITIAL_TIME_SERIES, SAMPLE_SCENARIOS, performFullAssessment } from './waterQuality';

const STORAGE_KEYS = {
  ASSESSMENTS: 'aquanex_assessments_v1',
  TIME_SERIES: 'aquanex_time_series_v1',
  CURRENT_ASSESSMENT: 'aquanex_current_assessment_v1',
  AC_BATCHES: 'aquanex_ac_batches_v1',
  EVENTS: 'aquanex_events_v1',
  CERTIFICATES: 'aquanex_certificates_v1',
  USER: 'aquanex_current_user_v1'
};

const DEFAULT_USER: UserProfile = {
  id: 'USR-7049',
  name: 'Elena Vance',
  email: 'e.vance@aquanex-monitoring.org',
  role: 'Environmental Auditor',
  organization: 'Apex Bio-Basin Environmental Consortium'
};

const DEFAULT_EVENTS: EcoEvent[] = [
  {
    id: 'EVT-101',
    title: 'Riverfront Industrial Effluent Audit & Sampling Drive',
    category: 'Water Quality Audit',
    date: '2026-10-02',
    location: 'North Estuary Water Basin, Sector 4',
    participantsCount: 42,
    maxParticipants: 60,
    status: 'Upcoming',
    description: 'Field sampling campaign collecting 150+ chemical and physical water quality samples across 12 industrial discharge outlets.',
    impactMetrics: '12 Outlets Screened · 18km Riverfront Protected',
    userJoined: true,
    userParticipated: false,
    userVerified: false
  },
  {
    id: 'EVT-102',
    title: 'AC Condensate Reclamation & Smart Irrigation Workshop',
    category: 'Water Reuse Innovation',
    date: '2026-09-18',
    location: 'AQUANEX Innovation Campus, Hall B',
    participantsCount: 88,
    maxParticipants: 100,
    status: 'Completed',
    description: 'Technical workshop training facilities managers to capture and purify HVAC condensate for zero-waste landscaping.',
    impactMetrics: '45,000 Liters Reclaimed / Month Projected',
    userJoined: true,
    userParticipated: true,
    userVerified: true,
    certificateId: 'CERT-AQUANEX-2026-0891'
  },
  {
    id: 'EVT-103',
    title: 'Coastal Mangrove Bio-Shield & Sluice Monitoring Patrol',
    category: 'Habitat Restoration',
    date: '2026-10-14',
    location: 'Tidal Delta Conservation Zone',
    participantsCount: 29,
    maxParticipants: 50,
    status: 'Upcoming',
    description: 'Deploying IoT salinity and turbidity sensors across coastal mangrove nursery channels receiving upstream industrial runoffs.',
    impactMetrics: '30 Hectares Marine Bio-diversity Protected',
    userJoined: false,
    userParticipated: false,
    userVerified: false
  }
];

const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: 'CERT-AQUANEX-2026-0891',
    credentialId: 'AQX-VERIFIED-8914-X9',
    recipientName: 'Elena Vance',
    eventTitle: 'AC Condensate Reclamation & Smart Irrigation Workshop',
    issueDate: 'September 19, 2026',
    issuerOrg: 'AQUANEX International Clean Water Initiative',
    hoursContributed: 8,
    verificationHash: '0x8f4d92a10b83e6729c11dae98342bbf6103e',
    skillsVerified: [
      'AC Condensate Quality Profiling',
      'Multi-Stage Micron & UV Water Filtration',
      'Closed-Loop Industrial Reclaim Systems'
    ]
  }
];

const DEFAULT_AC_BATCHES: ACWaterBatch[] = [
  {
    id: 'AC-BATCH-901',
    timestamp: '2026-09-24T08:30:00Z',
    quantityLiters: 420,
    pH: 7.1,
    tdsPpm: 68,
    turbidityNtu: 0.8,
    purificationStages: ['Sedimentation Pre-Filter', 'Activated Carbon Core', 'UV Sterilization'],
    reusableFor: {
      plantIrrigation: true,
      cleaning: true,
      toiletFlushing: true,
      landscaping: true
    },
    qualityRating: 'Optimal'
  },
  {
    id: 'AC-BATCH-902',
    timestamp: '2026-09-23T16:15:00Z',
    quantityLiters: 650,
    pH: 7.3,
    tdsPpm: 110,
    turbidityNtu: 1.2,
    purificationStages: ['Sedimentation Pre-Filter', 'Activated Carbon Core', 'UV Sterilization'],
    reusableFor: {
      plantIrrigation: true,
      cleaning: true,
      toiletFlushing: true,
      landscaping: true
    },
    qualityRating: 'Optimal'
  }
];

export function getStoredAssessments(): AssessmentResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  // Seed with sample assessments
  const sample1 = performFullAssessment(SAMPLE_SCENARIOS[0].input); // 82/100 Caution
  const sample2 = performFullAssessment(SAMPLE_SCENARIOS[1].input); // Safe
  const sample3 = performFullAssessment(SAMPLE_SCENARIOS[3].input); // Critical alert
  const initial = [sample1, sample2, sample3];
  saveStoredAssessments(initial);
  return initial;
}

export function saveStoredAssessments(assessments: AssessmentResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  } catch {
    // ignore
  }
}

export function getCurrentAssessment(): AssessmentResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ASSESSMENT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  // Default to the 82/100 scenario specified in prompt
  const initial = performFullAssessment(SAMPLE_SCENARIOS[0].input);
  saveCurrentAssessment(initial);
  return initial;
}

export function saveCurrentAssessment(assessment: AssessmentResult): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ASSESSMENT, JSON.stringify(assessment));
  } catch {
    // ignore
  }
}

export function getTimeSeriesReadings(): TimeSeriesReading[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIME_SERIES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return INITIAL_TIME_SERIES;
}

export function saveTimeSeriesReadings(readings: TimeSeriesReading[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIME_SERIES, JSON.stringify(readings));
  } catch {
    // ignore
  }
}

export function getStoredACBatches(): ACWaterBatch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AC_BATCHES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_AC_BATCHES;
}

export function saveStoredACBatches(batches: ACWaterBatch[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AC_BATCHES, JSON.stringify(batches));
  } catch {
    // ignore
  }
}

export function getStoredEvents(): EcoEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_EVENTS;
}

export function saveStoredEvents(events: EcoEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch {
    // ignore
  }
}

export function getStoredCertificates(): Certificate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_CERTIFICATES;
}

export function saveStoredCertificates(certs: Certificate[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
  } catch {
    // ignore
  }
}

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_USER;
}

export function saveCurrentUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch {
    // ignore
  }
}
