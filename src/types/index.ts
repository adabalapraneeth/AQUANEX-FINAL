export type GradeLevel = 'A' | 'B' | 'C' | 'D';
export type SeverityLevel = 'Safe' | 'Caution' | 'High Risk' | 'Critical';

export interface WaterParameter {
  id: string;
  name: string;
  symbol: string;
  value: number;
  unit: string;
  safeMin: number;
  safeMax: number;
  isNormal: boolean;
  statusText: string;
  description: string;
  isOptionalSensor?: boolean;
  sensorInstalled?: boolean;
}

export interface OptionalSensorsState {
  heavyMetals: boolean;
  chemicalSpectrometry: boolean;
  emergingContaminants: boolean;
}

export interface AssessmentResult {
  id: string;
  outletId: string;
  location: string;
  timestamp: string;
  score: number;
  grade: GradeLevel;
  severity: SeverityLevel;
  parameters: WaterParameter[];
  abnormalParameters: string[];
  explanation: string;
  recommendedAction: string;
  isCriticalAlert: boolean;
  authorityNotified?: boolean;
  authorityNotificationTimestamp?: string;
  authorityTicketId?: string;
}

export interface TimeSeriesReading {
  time: string;
  score: number;
  outletId?: string;
  timestampMs?: number;
}

export interface ACWaterBatch {
  id: string;
  timestamp: string;
  quantityLiters: number;
  pH: number;
  tdsPpm: number;
  turbidityNtu: number;
  purificationStages: string[];
  reusableFor: {
    plantIrrigation: boolean;
    cleaning: boolean;
    toiletFlushing: boolean;
    landscaping: boolean;
  };
  qualityRating: 'Optimal' | 'Good' | 'Needs Treatment';
}

export interface EcoEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  participantsCount: number;
  maxParticipants: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  description: string;
  impactMetrics: string;
  userJoined?: boolean;
  userParticipated?: boolean;
  userVerified?: boolean;
  certificateId?: string;
  createdByUser?: string;
}

export interface Certificate {
  id: string;
  credentialId: string;
  recipientName: string;
  eventTitle: string;
  issueDate: string;
  issuerOrg: string;
  hoursContributed: number;
  verificationHash: string;
  skillsVerified: string[];
  status?: 'Approved' | 'Pending' | 'Rejected';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Industrial Plant Operator' | 'Environmental Auditor' | 'Community Volunteer' | 'Authorized Organization Admin';
  organization: string;
  isAuthenticated?: boolean;
}

export interface SolarPlantLocation {
  id: string;
  name: string;
  state: string;
  coordinates: { xPercent: number; yPercent: number };
  dailyCapacityM3: number;
  technology: string;
  villagesCovered: number;
  status: 'Operational Demo' | 'Pilot Stage' | 'Projected';
}
