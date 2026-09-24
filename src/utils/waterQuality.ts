import { AssessmentResult, GradeLevel, OptionalSensorsState, SeverityLevel, WaterParameter } from '../types';

export interface RawAssessmentInput {
  outletId: string;
  location: string;
  pH: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  electricalConductivity: number;
  optionalSensors: OptionalSensorsState;
  heavyMetals?: number;
  chemicalContaminants?: number;
  emergingContaminants?: number;
}

export function evaluateWaterParameters(input: RawAssessmentInput): WaterParameter[] {
  const params: WaterParameter[] = [
    {
      id: 'ph',
      name: 'pH Level',
      symbol: 'pH',
      value: input.pH,
      unit: 'pH',
      safeMin: 6.5,
      safeMax: 8.5,
      isNormal: input.pH >= 6.5 && input.pH <= 8.5,
      statusText: input.pH < 6.5 ? 'Acidic Discharge' : input.pH > 8.5 ? 'Alkaline Discharge' : 'Optimal Neutral',
      description: 'Acidity or alkalinity measure. Industrial discharge must remain balanced to prevent aquatic biome corrosion.'
    },
    {
      id: 'turbidity',
      name: 'Turbidity',
      symbol: 'NTU',
      value: input.turbidity,
      unit: 'NTU',
      safeMin: 0.1,
      safeMax: 5.0,
      isNormal: input.turbidity <= 5.0,
      statusText: input.turbidity <= 5.0 ? 'Clear / Compliant' : input.turbidity <= 15 ? 'Moderate Haze' : 'High Suspended Solids',
      description: 'Water clarity and suspended particulates. Elevated levels smother aquatic flora and block sunlight.'
    },
    {
      id: 'temperature',
      name: 'Water Temperature',
      symbol: 'Temp',
      value: input.temperature,
      unit: '°C',
      safeMin: 15.0,
      safeMax: 30.0,
      isNormal: input.temperature >= 15.0 && input.temperature <= 30.0,
      statusText: input.temperature > 30.0 ? 'Thermal Pollution Risk' : input.temperature < 15.0 ? 'Hypothermic Shock' : 'Ambient Equilibrium',
      description: 'Thermal effluent monitoring. Heated industrial outfall severely degrades dissolved oxygen retention.'
    },
    {
      id: 'dissolved_oxygen',
      name: 'Dissolved Oxygen',
      symbol: 'DO',
      value: input.dissolvedOxygen,
      unit: 'mg/L',
      safeMin: 5.0,
      safeMax: 14.0,
      isNormal: input.dissolvedOxygen >= 5.0,
      statusText: input.dissolvedOxygen >= 6.5 ? 'Healthy Aeration' : input.dissolvedOxygen >= 5.0 ? 'Adequate' : input.dissolvedOxygen >= 3.0 ? 'Hypoxic Stress' : 'Critical Anoxic Zone',
      description: 'Vital gas necessary for biological river life. Rapid drops indicate organic or biochemical oxygen demand (BOD).'
    },
    {
      id: 'conductivity',
      name: 'Electrical Conductivity',
      symbol: 'EC',
      value: input.electricalConductivity,
      unit: 'µS/cm',
      safeMin: 100,
      safeMax: 1000,
      isNormal: input.electricalConductivity >= 100 && input.electricalConductivity <= 1000,
      statusText: input.electricalConductivity <= 1000 ? 'Normal Ion Balance' : input.electricalConductivity <= 1800 ? 'Elevated Dissolved Ions' : 'High Saline / Chemical Discharge',
      description: 'Ability of water to pass electric flow, directly linked to total dissolved inorganic salts and ions.'
    }
  ];

  // Optional sensor: Heavy Metals Probe
  if (input.optionalSensors.heavyMetals) {
    const val = input.heavyMetals ?? 0.02;
    params.push({
      id: 'heavy_metals',
      name: 'Heavy Metals (Pb/Cd/Cr)',
      symbol: 'HM',
      value: val,
      unit: 'ppm',
      safeMin: 0.0,
      safeMax: 0.05,
      isNormal: val <= 0.05,
      statusText: val <= 0.05 ? 'Below Toxic Threshold' : 'Hazardous Heavy Metals',
      description: 'Measured via multi-channel Ion Selective Electrode (ISE) probe.',
      isOptionalSensor: true,
      sensorInstalled: true
    });
  }

  // Optional sensor: Chemical Spectrometry
  if (input.optionalSensors.chemicalSpectrometry) {
    const val = input.chemicalContaminants ?? 6.5;
    params.push({
      id: 'chemical_spectrometry',
      name: 'Chemical COD / Phenols',
      symbol: 'COD',
      value: val,
      unit: 'mg/L',
      safeMin: 0.0,
      safeMax: 15.0,
      isNormal: val <= 15.0,
      statusText: val <= 15.0 ? 'Compliant Organic Level' : 'High Industrial Chemical Load',
      description: 'Measured via UV-Vis multi-wavelength absorbance spectrometer probe.',
      isOptionalSensor: true,
      sensorInstalled: true
    });
  }

  // Optional sensor: Emerging Contaminants
  if (input.optionalSensors.emergingContaminants) {
    const val = input.emergingContaminants ?? 0.4;
    params.push({
      id: 'emerging_contaminants',
      name: 'Emerging Surfactants / PFAS',
      symbol: 'EC-P',
      value: val,
      unit: 'µg/L',
      safeMin: 0.0,
      safeMax: 1.0,
      isNormal: val <= 1.0,
      statusText: val <= 1.0 ? 'Trace Non-Hazardous' : 'Critical Emerging Pollutants',
      description: 'Measured via in-line laser-induced fluorometric detector.',
      isOptionalSensor: true,
      sensorInstalled: true
    });
  }

  return params;
}

export function calculateCombinedWaterScore(params: WaterParameter[]): {
  score: number;
  grade: GradeLevel;
  severity: SeverityLevel;
  abnormalParameters: string[];
  explanation: string;
  recommendedAction: string;
  isCriticalAlert: boolean;
} {
  let totalScoreWeight = 0;
  let accumulatedScore = 0;
  const abnormalParameters: string[] = [];

  for (const param of params) {
    let paramScore = 100;

    switch (param.id) {
      case 'ph': {
        const dev = Math.abs(param.value - 7.2);
        if (dev <= 1.0) {
          paramScore = 100;
        } else if (dev <= 1.5) {
          paramScore = 80;
        } else if (dev <= 2.2) {
          paramScore = 55;
          abnormalParameters.push(`pH Level (${param.value.toFixed(1)})`);
        } else {
          paramScore = Math.max(10, 40 - (dev - 2.2) * 25);
          abnormalParameters.push(`pH Level (${param.value.toFixed(1)})`);
        }
        accumulatedScore += paramScore * 1.5;
        totalScoreWeight += 1.5;
        break;
      }
      case 'turbidity': {
        if (param.value <= 5.0) {
          paramScore = 100;
        } else if (param.value <= 10.0) {
          paramScore = 75;
          abnormalParameters.push(`Turbidity (${param.value.toFixed(1)} NTU)`);
        } else if (param.value <= 25.0) {
          paramScore = 48;
          abnormalParameters.push(`Turbidity (${param.value.toFixed(1)} NTU)`);
        } else {
          paramScore = Math.max(10, 30 - (param.value - 25));
          abnormalParameters.push(`Turbidity (${param.value.toFixed(1)} NTU)`);
        }
        accumulatedScore += paramScore * 1.3;
        totalScoreWeight += 1.3;
        break;
      }
      case 'temperature': {
        if (param.value >= 18 && param.value <= 26) {
          paramScore = 100;
        } else if (param.value >= 15 && param.value <= 30) {
          paramScore = 85;
        } else if (param.value <= 36) {
          paramScore = 50;
          abnormalParameters.push(`Temperature (${param.value.toFixed(1)} °C)`);
        } else {
          paramScore = 20;
          abnormalParameters.push(`Temperature (${param.value.toFixed(1)} °C)`);
        }
        accumulatedScore += paramScore * 1.0;
        totalScoreWeight += 1.0;
        break;
      }
      case 'dissolved_oxygen': {
        if (param.value >= 6.5) {
          paramScore = 100;
        } else if (param.value >= 5.0) {
          paramScore = 82;
        } else if (param.value >= 3.5) {
          paramScore = 50;
          abnormalParameters.push(`Dissolved Oxygen (${param.value.toFixed(1)} mg/L)`);
        } else if (param.value >= 2.0) {
          paramScore = 25;
          abnormalParameters.push(`Dissolved Oxygen (${param.value.toFixed(1)} mg/L)`);
        } else {
          paramScore = 5;
          abnormalParameters.push(`Critical Dissolved Oxygen (${param.value.toFixed(1)} mg/L)`);
        }
        accumulatedScore += paramScore * 1.8;
        totalScoreWeight += 1.8;
        break;
      }
      case 'conductivity': {
        if (param.value >= 150 && param.value <= 800) {
          paramScore = 100;
        } else if (param.value <= 1000) {
          paramScore = 80;
        } else if (param.value <= 1600) {
          paramScore = 55;
          abnormalParameters.push(`Electrical Conductivity (${param.value.toFixed(0)} µS/cm)`);
        } else {
          paramScore = Math.max(10, 35 - ((param.value - 1600) / 100));
          abnormalParameters.push(`Electrical Conductivity (${param.value.toFixed(0)} µS/cm)`);
        }
        accumulatedScore += paramScore * 1.2;
        totalScoreWeight += 1.2;
        break;
      }
      case 'heavy_metals': {
        if (param.value <= 0.02) {
          paramScore = 100;
        } else if (param.value <= 0.05) {
          paramScore = 75;
        } else {
          paramScore = 15;
          abnormalParameters.push(`Heavy Metals (${param.value.toFixed(3)} ppm)`);
        }
        accumulatedScore += paramScore * 2.0;
        totalScoreWeight += 2.0;
        break;
      }
      case 'chemical_spectrometry': {
        if (param.value <= 8.0) {
          paramScore = 100;
        } else if (param.value <= 15.0) {
          paramScore = 75;
        } else {
          paramScore = 20;
          abnormalParameters.push(`Chemical COD (${param.value.toFixed(1)} mg/L)`);
        }
        accumulatedScore += paramScore * 1.8;
        totalScoreWeight += 1.8;
        break;
      }
      case 'emerging_contaminants': {
        if (param.value <= 0.5) {
          paramScore = 100;
        } else if (param.value <= 1.0) {
          paramScore = 75;
        } else {
          paramScore = 15;
          abnormalParameters.push(`Emerging Contaminants (${param.value.toFixed(2)} µg/L)`);
        }
        accumulatedScore += paramScore * 1.8;
        totalScoreWeight += 1.8;
        break;
      }
    }
  }

  const normalizedScore = Math.round(accumulatedScore / totalScoreWeight);
  const clampedScore = Math.max(0, Math.min(100, normalizedScore));

  let grade: GradeLevel = 'A';
  let severity: SeverityLevel = 'Safe';

  if (clampedScore >= 85) {
    grade = 'A';
    severity = 'Safe';
  } else if (clampedScore >= 70) {
    grade = 'B';
    severity = 'Caution';
  } else if (clampedScore >= 50) {
    grade = 'C';
    severity = 'High Risk';
  } else {
    grade = 'D';
    severity = 'Critical';
  }

  // Generate short explanation
  let explanation = '';
  if (abnormalParameters.length === 0) {
    explanation = 'All monitored parameters are within safe environmental discharge thresholds. Water quality satisfies regulatory criteria.';
  } else if (grade === 'B') {
    const listStr = abnormalParameters.map(p => p.split(' (')[0].toLowerCase()).join(' and ');
    explanation = `Water quality shows abnormal ${listStr} levels. Further inspection and secondary settling are recommended.`;
  } else if (grade === 'C') {
    const listStr = abnormalParameters.map(p => p.split(' (')[0]).join(', ');
    explanation = `High pollution risk detected across ${listStr}. Industrial discharge exceeds standard aquatic tolerance parameters.`;
  } else {
    explanation = `Critical pollution emergency detected! Severe parameter anomalies (${abnormalParameters.join(', ')}) pose imminent environmental hazard to natural water systems.`;
  }

  // Recommended actions
  let recommendedAction = '';
  if (grade === 'A') {
    recommendedAction = 'Proceed with normal scheduled discharge. Maintain baseline automated telemetry logging.';
  } else if (grade === 'B') {
    recommendedAction = 'Deploy aeration booster and verify settling tank filtration. Re-sample outlet in 2 hours.';
  } else if (grade === 'C') {
    recommendedAction = 'Throttle discharge flow rate by 50%. Engage chemical neutralization and flocculation unit. Inspect upstream manufacturing line.';
  } else {
    recommendedAction = 'IMMEDIATE OUTLET SHUTDOWN REQUIRED: Seal sluice valve SV-04. Divert effluent to holding retention lagoon. Notify Regional Environmental Board immediately.';
  }

  // Critical alert triggered when Grade is D or score < 50 or severe DO drop (< 2.5) or severe pH anomaly (< 4.5 or > 10.5)
  const isCriticalAlert = grade === 'D' || clampedScore < 50 || params.some(p => (p.id === 'dissolved_oxygen' && p.value < 2.5) || (p.id === 'ph' && (p.value < 4.5 || p.value > 10.5)));

  return {
    score: clampedScore,
    grade,
    severity,
    abnormalParameters,
    explanation,
    recommendedAction,
    isCriticalAlert
  };
}

export function performFullAssessment(input: RawAssessmentInput): AssessmentResult {
  const evaluatedParams = evaluateWaterParameters(input);
  const evaluation = calculateCombinedWaterScore(evaluatedParams);

  return {
    id: `ASSESS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    outletId: input.outletId,
    location: input.location,
    timestamp: new Date().toISOString(),
    score: evaluation.score,
    grade: evaluation.grade,
    severity: evaluation.severity,
    parameters: evaluatedParams,
    abnormalParameters: evaluation.abnormalParameters,
    explanation: evaluation.explanation,
    recommendedAction: evaluation.recommendedAction,
    isCriticalAlert: evaluation.isCriticalAlert
  };
}

export const SAMPLE_SCENARIOS: { name: string; description: string; input: RawAssessmentInput }[] = [
  {
    name: 'Sample B: Cautionary Effluent (82/100)',
    description: 'Matches official reference demo: elevated turbidity (7.8 NTU) & conductivity (1180 µS/cm)',
    input: {
      outletId: 'IND-OUTLET-704',
      location: 'North Estuary Discharge Canal - Sector 4',
      pH: 7.4,
      turbidity: 7.8,
      temperature: 24.5,
      dissolvedOxygen: 6.8,
      electricalConductivity: 1180,
      optionalSensors: {
        heavyMetals: false,
        chemicalSpectrometry: false,
        emergingContaminants: false
      }
    }
  },
  {
    name: 'Sample A: Safe Baseline (94/100)',
    description: 'Pristine treated outlet discharge meeting strict Grade A compliance',
    input: {
      outletId: 'IND-OUTLET-302',
      location: 'South Wetland Bio-Filtration Channel',
      pH: 7.2,
      turbidity: 1.4,
      temperature: 21.0,
      dissolvedOxygen: 8.2,
      electricalConductivity: 380,
      optionalSensors: {
        heavyMetals: false,
        chemicalSpectrometry: false,
        emergingContaminants: false
      }
    }
  },
  {
    name: 'Sample C: High Thermal & Suspended Solids (61/100)',
    description: 'Thermal pollution surge with elevated turbidity and degraded dissolved oxygen',
    input: {
      outletId: 'IND-OUTLET-518',
      location: 'East Cooling Sluice - Thermal Station',
      pH: 8.7,
      turbidity: 14.5,
      temperature: 34.2,
      dissolvedOxygen: 3.9,
      electricalConductivity: 1350,
      optionalSensors: {
        heavyMetals: false,
        chemicalSpectrometry: false,
        emergingContaminants: false
      }
    }
  },
  {
    name: 'Sample D: 🚨 Critical Toxic Acid Surge (36/100)',
    description: 'Severe industrial incident triggering automatic Critical Water Pollution Alert',
    input: {
      outletId: 'IND-OUTLET-992',
      location: 'Central Chemical Drain Outfall - Dock 7',
      pH: 4.1,
      turbidity: 28.0,
      temperature: 37.5,
      dissolvedOxygen: 1.8,
      electricalConductivity: 2450,
      optionalSensors: {
        heavyMetals: true,
        chemicalSpectrometry: true,
        emergingContaminants: false
      },
      heavyMetals: 0.18,
      chemicalContaminants: 32.4
    }
  }
];

export const INITIAL_TIME_SERIES = [
  { time: '08:00', score: 78 },
  { time: '10:00', score: 82 },
  { time: '12:00', score: 69 },
  { time: '14:00', score: 88 },
  { time: '16:00', score: 91 }
];
