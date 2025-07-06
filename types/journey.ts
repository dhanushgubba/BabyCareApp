export interface BabyProfile {
  id: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  birthWeight?: number; // in grams
  state?: string; // Indian state for localized guidelines
  isPregnancy?: boolean; // true if tracking pregnancy
  dueDate?: Date; // for pregnancy tracking
  currentWeek?: number; // pregnancy week or baby age in weeks
}

export interface Milestone {
  id: string;
  category: 'development' | 'vaccination' | 'nutrition' | 'checkup' | 'growth';
  title: string;
  description: string;
  ageInDays: number; // day in the 1000-day journey
  isCompleted: boolean;
  isOverdue: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  stateSpecific?: string[]; // array of Indian states this applies to
  source: 'mohfw' | 'who' | 'iap'; // Ministry of Health & Family Welfare, WHO, Indian Academy of Pediatrics
  completedDate?: Date;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  scheduledDate: Date;
  completedDate?: Date;
  dueAgeInDays: number;
  batch?: string;
  location?: string;
  sideEffects?: string;
  nextDue?: Date;
  isOverdue: boolean;
  stateRecommendations?: string[];
}

export interface NutritionGuideline {
  id: string;
  ageRangeStart: number; // in days
  ageRangeEnd: number; // in days
  category: 'breastfeeding' | 'complementary' | 'supplements' | 'avoid';
  title: string;
  description: string;
  recommendations: string[];
  indianContext?: string; // specific recommendations for Indian families
  stateSpecific?: string[];
}

export interface DoctorVisit {
  id: string;
  scheduledDate: Date;
  visitType: 'routine' | 'vaccination' | 'illness' | 'growth' | 'development';
  completed: boolean;
  notes?: string;
  weight?: number;
  height?: number;
  recommendations?: string[];
  nextVisitDate?: Date;
}

export interface JourneyDay {
  dayNumber: number; // 1-1000
  date: Date;
  milestones: Milestone[];
  vaccinations: VaccinationRecord[];
  nutritionGuidelines: NutritionGuideline[];
  doctorVisits: DoctorVisit[];
  isToday: boolean;
  isPast: boolean;
  isUpcoming: boolean;
}

export interface JourneyStats {
  totalMilestones: number;
  completedMilestones: number;
  overdueMilestones: number;
  upcomingVaccinations: number;
  completionPercentage: number;
  currentPhase: 'pregnancy' | 'newborn' | 'infant' | 'toddler';
  daysCompleted: number;
  daysRemaining: number;
}

export interface AlertNotification {
  id: string;
  type: 'vaccination' | 'checkup' | 'milestone' | 'nutrition' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  dueDate: Date;
  isRead: boolean;
  actionRequired: boolean;
  relatedMilestoneId?: string;
}
