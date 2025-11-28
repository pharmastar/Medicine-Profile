export interface DrugClassAndCategory {
  pharmacologicalClass: string;
  therapeuticCategory: string;
}

export interface AdverseDrugReactions {
  common: string[];
  serious: string[];
  rare: string[];
  blackBoxWarning: string | null;
}

export interface Interactions {
  drugDrug: string[];
  drugFood: string[];
  drugHerbal: string[];
}

export interface Pharmacokinetics {
  absorption: string;
  distribution: string;
  metabolism: string;
  excretion: string;
  halfLife: string;
  bioavailability: string;
}

export interface Pharmacodynamics {
  pathway: string[];
}

export interface DosageInformation {
  adult: string;
  pediatric: string;
  adjustments: string;
}

export interface BrandInfo {
  brandName: string;
  company: string;
  strengths: string;
}

export interface ClinicalCase {
  case: string;
  solution: string;
}

export interface CounsellingTips {
  generalTips: string[];
  timeOfAdministration: string;
  vehicle: string;
  withFood: string;
  foodsToAvoid: string;
}

export interface DrugMonograph {
  drugName: string;
  drugClassAndCategory: DrugClassAndCategory;
  introduction: string;
  mechanismOfAction: string[];
  therapeuticUses: {
    fdaApproved: string[];
    globalGuidelines: string[];
    offLabel: string[];
  };
  adverseDrugReactions: AdverseDrugReactions;
  interactions: Interactions;
  pharmacokinetics: Pharmacokinetics;
  pharmacodynamics: Pharmacodynamics;
  dosageInformation: DosageInformation;
  routesOfAdministration: string[];
  commonBrandsInPakistan: BrandInfo[];
  clinicalCases: ClinicalCase[];
  counsellingTips: CounsellingTips;
  references: string[];
}