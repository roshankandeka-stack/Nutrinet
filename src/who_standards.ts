/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// WHO Growth Reference Data for Boys and Girls (0 - 60 Months)
// These arrays represent key milestones. We use linear interpolation for exact month calculations.

export interface WHODataPoint {
  month: number;
  median: number;
  sd1: number;
  sd2: number;
  sd3: number;
  sdMinus1: number;
  sdMinus2: number;
  sdMinus3: number;
}

// Weight-for-Age Standards (kg)
export const weightStandards = {
  boys: [
    { month: 0, median: 3.3, sd1: 3.9, sd2: 4.4, sd3: 5.0, sdMinus1: 2.9, sdMinus2: 2.5, sdMinus3: 2.1 },
    { month: 3, median: 6.4, sd1: 7.2, sd2: 8.0, sd3: 9.0, sdMinus1: 5.7, sdMinus2: 5.0, sdMinus3: 4.4 },
    { month: 6, median: 7.9, sd1: 8.9, sd2: 9.8, sd3: 10.9, sdMinus1: 7.1, sdMinus2: 6.4, sdMinus3: 5.7 },
    { month: 12, median: 9.6, sd1: 10.8, sd2: 12.0, sd3: 13.3, sdMinus1: 8.6, sdMinus2: 7.7, sdMinus3: 6.9 },
    { month: 18, median: 10.9, sd1: 12.2, sd2: 13.5, sd3: 15.0, sdMinus1: 9.8, sdMinus2: 8.8, sdMinus3: 7.9 },
    { month: 24, median: 12.2, sd1: 13.6, sd2: 15.3, sd3: 17.0, sdMinus1: 11.0, sdMinus2: 9.7, sdMinus3: 8.6 },
    { month: 36, median: 14.3, sd1: 16.2, sd2: 18.3, sd3: 20.5, sdMinus1: 12.7, sdMinus2: 11.3, sdMinus3: 10.1 },
    { month: 48, median: 16.3, sd1: 18.5, sd2: 21.0, sd3: 23.8, sdMinus1: 14.4, sdMinus2: 12.9, sdMinus3: 11.4 },
    { month: 60, median: 18.3, sd1: 21.0, sd2: 24.1, sd3: 27.5, sdMinus1: 16.2, sdMinus2: 14.3, sdMinus3: 12.7 },
  ] as WHODataPoint[],
  girls: [
    { month: 0, median: 3.2, sd1: 3.7, sd2: 4.2, sd3: 4.8, sdMinus1: 2.8, sdMinus2: 2.4, sdMinus3: 2.0 },
    { month: 3, median: 5.8, sd1: 6.6, sd2: 7.5, sd3: 8.5, sdMinus1: 5.2, sdMinus2: 4.6, sdMinus3: 4.0 },
    { month: 6, median: 7.3, sd1: 8.2, sd2: 9.3, sd3: 10.5, sdMinus1: 6.5, sdMinus2: 5.7, sdMinus3: 5.0 },
    { month: 12, median: 8.9, sd1: 10.2, sd2: 11.5, sd3: 13.1, sdMinus1: 8.0, sdMinus2: 7.2, sdMinus3: 6.3 },
    { month: 18, median: 10.2, sd1: 11.6, sd2: 13.2, sd3: 15.0, sdMinus1: 9.1, sdMinus2: 8.1, sdMinus3: 7.1 },
    { month: 24, median: 11.5, sd1: 13.0, sd2: 14.8, sd3: 16.9, sdMinus1: 10.2, sdMinus2: 9.0, sdMinus3: 7.9 },
    { month: 36, median: 13.9, sd1: 15.8, sd2: 18.1, sd3: 20.8, sdMinus1: 12.2, sdMinus2: 10.8, sdMinus3: 9.6 },
    { month: 48, median: 15.5, sd1: 17.9, sd2: 20.7, sd3: 23.9, sdMinus1: 13.7, sdMinus2: 12.1, sdMinus3: 10.7 },
    { month: 60, median: 17.5, sd1: 20.3, sd2: 23.5, sd3: 27.2, sdMinus1: 15.3, sdMinus2: 13.4, sdMinus3: 11.8 },
  ] as WHODataPoint[],
};

// Height-for-Age Standards (cm)
export const heightStandards = {
  boys: [
    { month: 0, median: 49.9, sd1: 51.7, sd2: 53.5, sd3: 55.3, sdMinus1: 48.0, sdMinus2: 46.1, sdMinus3: 44.2 },
    { month: 3, median: 61.4, sd1: 63.5, sd2: 65.5, sd3: 67.6, sdMinus1: 59.4, sdMinus2: 57.3, sdMinus3: 55.3 },
    { month: 6, median: 67.6, sd1: 69.6, sd2: 71.6, sd3: 73.7, sdMinus1: 65.5, sdMinus2: 63.5, sdMinus3: 61.4 },
    { month: 12, median: 75.7, sd1: 78.0, sd2: 80.2, sd3: 82.5, sdMinus1: 73.4, sdMinus2: 71.0, sdMinus3: 68.6 },
    { month: 18, median: 82.3, sd1: 84.8, sd2: 87.3, sd3: 89.8, sdMinus1: 79.8, sdMinus2: 77.2, sdMinus3: 74.7 },
    { month: 24, median: 87.8, sd1: 90.4, sd2: 93.0, sd3: 95.7, sdMinus1: 85.1, sdMinus2: 82.5, sdMinus3: 79.8 },
    { month: 36, median: 96.1, sd1: 99.1, sd2: 102.1, sd3: 105.1, sdMinus1: 93.1, sdMinus2: 90.1, sdMinus3: 87.1 },
    { month: 48, median: 103.3, sd1: 106.6, sd2: 110.0, sd3: 113.3, sdMinus1: 100.0, sdMinus2: 96.7, sdMinus3: 93.3 },
    { month: 60, median: 110.0, sd1: 113.7, sd2: 117.4, sd3: 121.1, sdMinus1: 106.3, sdMinus2: 102.6, sdMinus3: 98.9 },
  ] as WHODataPoint[],
  girls: [
    { month: 0, median: 49.1, sd1: 50.9, sd2: 52.7, sd3: 54.5, sdMinus1: 47.3, sdMinus2: 45.4, sdMinus3: 43.6 },
    { month: 3, median: 59.8, sd1: 61.8, sd2: 63.8, sd3: 65.8, sdMinus1: 57.7, sdMinus2: 55.6, sdMinus3: 53.6 },
    { month: 6, median: 65.7, sd1: 67.6, sd2: 69.6, sd3: 71.6, sdMinus1: 63.7, sdMinus2: 61.7, sdMinus3: 59.8 },
    { month: 12, median: 74.0, sd1: 76.2, sd2: 78.4, sd3: 80.7, sdMinus1: 71.8, sdMinus2: 69.5, sdMinus3: 67.2 },
    { month: 18, median: 80.7, sd1: 83.2, sd2: 85.7, sd3: 88.2, sdMinus1: 78.2, sdMinus2: 75.6, sdMinus3: 73.1 },
    { month: 24, median: 86.4, sd1: 89.0, sd2: 91.6, sd3: 94.3, sdMinus1: 83.7, sdMinus2: 81.1, sdMinus3: 78.4 },
    { month: 36, median: 95.1, sd1: 98.0, sd2: 100.9, sd3: 103.8, sdMinus1: 92.2, sdMinus2: 89.3, sdMinus3: 86.4 },
    { month: 48, median: 102.7, sd1: 105.9, sd2: 109.1, sd3: 112.3, sdMinus1: 99.5, sdMinus2: 96.3, sdMinus3: 93.1 },
    { month: 60, median: 109.4, sd1: 112.9, sd2: 116.4, sd3: 119.9, sdMinus1: 105.9, sdMinus2: 102.4, sdMinus3: 98.9 },
  ] as WHODataPoint[],
};

// Interpolation Helper
export function interpolateWHO(standards: WHODataPoint[], month: number): WHODataPoint {
  // Edge cases
  if (month <= standards[0].month) return standards[0];
  if (month >= standards[standards.length - 1].month) return standards[standards.length - 1];

  // Find surrounding milestones
  let lower = standards[0];
  let upper = standards[standards.length - 1];

  for (let i = 0; i < standards.length - 1; i++) {
    if (month >= standards[i].month && month <= standards[i + 1].month) {
      lower = standards[i];
      upper = standards[i + 1];
      break;
    }
  }

  const factor = (month - lower.month) / (upper.month - lower.month);
  
  const interpolate = (val1: number, val2: number) => val1 + factor * (val2 - val1);

  return {
    month,
    median: interpolate(lower.median, upper.median),
    sd1: interpolate(lower.sd1, upper.sd1),
    sd2: interpolate(lower.sd2, upper.sd2),
    sd3: interpolate(lower.sd3, upper.sd3),
    sdMinus1: interpolate(lower.sdMinus1, upper.sdMinus1),
    sdMinus2: interpolate(lower.sdMinus2, upper.sdMinus2),
    sdMinus3: interpolate(lower.sdMinus3, upper.sdMinus3),
  };
}

// Calculate the Z-Score based on standard deviations
export function calculateZScore(value: number, standard: WHODataPoint): number {
  if (value === standard.median) return 0;
  
  if (value > standard.median) {
    // Value is above median, positive z-score
    // 1 z-score unit positive is sd1 - median
    const oneSD = standard.sd1 - standard.median;
    const diff = value - standard.median;
    if (value <= standard.sd1) {
      return diff / oneSD;
    } else if (value <= standard.sd2) {
      return 1 + (value - standard.sd1) / (standard.sd2 - standard.sd1);
    } else {
      return 2 + (value - standard.sd2) / (standard.sd3 - standard.sd2);
    }
  } else {
    // Value is below median, negative z-score
    const oneSD = standard.median - standard.sdMinus1;
    const diff = standard.median - value;
    if (value >= standard.sdMinus1) {
      return - (diff / oneSD);
    } else if (value >= standard.sdMinus2) {
      return -1 - (standard.sdMinus1 - value) / (standard.sdMinus1 - standard.sdMinus2);
    } else {
      return -2 - (standard.sdMinus2 - value) / (standard.sdMinus2 - standard.sdMinus3);
    }
  }
}

// Map Z-Score to Nutrition Status Label
export function getZScoreStatus(zScore: number, metric: 'weight' | 'height' | 'bmi') {
  if (zScore <= -3) {
    return {
      label: metric === 'weight' ? 'Severe Underweight' : metric === 'height' ? 'Severe Stunting' : 'Severe Wasting',
      color: 'bg-red-100 text-red-800 border-red-300',
      textColor: 'text-red-700',
      status: 'severe',
      description: 'Critical clinical threshold. Needs urgent pediatrician support and therapeutic feeding.'
    };
  } else if (zScore <= -2) {
    return {
      label: metric === 'weight' ? 'Moderate Underweight' : metric === 'height' ? 'Moderate Stunting' : 'Moderate Wasting',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      textColor: 'text-orange-700',
      status: 'moderate',
      description: 'At risk for malnutrition. Increase calorie and dense protein supplements immediately.'
    };
  } else if (zScore <= -1) {
    return {
      label: 'Mildly Low',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      textColor: 'text-yellow-700',
      status: 'mild',
      description: 'Slightly below WHO median. Maintain dietary checkup and add nutrition rich foods.'
    };
  } else if (zScore >= 2) {
    return {
      label: 'High (Above Median)',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      textColor: 'text-indigo-700',
      status: 'high',
      description: 'Higher than optimal median child. If BMI, verify high calorie sugar limits.'
    };
  } else {
    return {
      label: 'Optimal (Healthy)',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      textColor: 'text-emerald-700',
      status: 'healthy',
      description: 'Normal healthy child conforming fully with WHO standards guidelines.'
    };
  }
}

// Nutrition Clinics and PHCs directory in Ahmedabad (Vastrapur, Maninagar, etc.)
export interface Clinic {
  id: string;
  name: string;
  type: string;
  area: string;
  address: string;
  contact: string;
  charge: string;
}

export const clinicsInAhmedabad: Clinic[] = [
  {
    id: 'c1',
    name: 'SVP Public General Hospital Pediatric wing',
    type: 'Government Teaching Hospital',
    area: 'Ellisbridge',
    address: 'SVP Hospital Camp, Ellisbridge, Ahmedabad, Gujarat 380006',
    contact: '+91 79 2657 7621',
    charge: 'Free (Government-backed under Poshan Abhiyaan)'
  },
  {
    id: 'c2',
    name: 'Maninagar Urban Primary Health Centre (UPHC)',
    type: 'Municipal Corporation Clinic',
    area: 'Maninagar',
    address: 'Opposite Railway Station Ground, Maninagar East, Ahmedabad 380008',
    contact: '+91 79 2546 2200',
    charge: 'Free (Includes free energy-dense food Sattu packs)'
  },
  {
    id: 'c3',
    name: 'Vastrapur Anganwadi & Child Nutrition Centre',
    type: 'Anganwadi Hub',
    area: 'Vastrapur',
    address: 'Vastrapur Gam Child Care Trust, Near Vastrapur Lake, Ahmedabad 380015',
    contact: '+91 98980 12345',
    charge: 'Free (Asha Workers and free weight screening)'
  },
  {
    id: 'c4',
    name: 'Civil Hospital Pediatric Malnutrition Ward',
    type: 'General Government Hospital',
    area: 'Asarwa',
    address: 'Civil Hospital Campus, Haripura, Asarwa, Ahmedabad 380016',
    contact: '+91 79 2268 3721',
    charge: 'Free (Provides complete nutritional therapy programs)'
  },
  {
    id: 'c5',
    name: 'SNEHA Pediatric Trust',
    type: 'NGO Health Center',
    area: 'Ghatlodia',
    address: 'SNEHA building, Ghatlodia Road, Ahmedabad 380061',
    contact: '+91 79 2741 0212',
    charge: 'Token fee ₹10 (Includes doctor and ragi biscuit packs)'
  }
];
