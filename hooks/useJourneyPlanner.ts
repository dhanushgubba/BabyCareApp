import { useState, useEffect } from 'react';
import { 
  BabyProfile, 
  Milestone, 
  VaccinationRecord, 
  NutritionGuideline, 
  DoctorVisit, 
  JourneyDay, 
  JourneyStats, 
  AlertNotification 
} from '../types/journey';

// Mock data based on MoHFW guidelines for Indian babies
const getDefaultMilestones = (birthDate: Date): Milestone[] => {
  const milestones: Milestone[] = [
    // Vaccination milestones
    {
      id: 'bcg-birth',
      category: 'vaccination',
      title: 'BCG Vaccine',
      description: 'BCG vaccine at birth to protect against tuberculosis',
      ageInDays: 0,
      isCompleted: false,
      isOverdue: false,
      priority: 'critical',
      source: 'mohfw',
    },
    {
      id: 'hep-b-birth',
      category: 'vaccination',
      title: 'Hepatitis B (Birth Dose)',
      description: 'First dose of Hepatitis B vaccine within 24 hours of birth',
      ageInDays: 1,
      isCompleted: false,
      isOverdue: false,
      priority: 'critical',
      source: 'mohfw',
    },
    {
      id: 'opv-0',
      category: 'vaccination',
      title: 'OPV (Birth Dose)',
      description: 'Oral Polio Vaccine birth dose',
      ageInDays: 0,
      isCompleted: false,
      isOverdue: false,
      priority: 'critical',
      source: 'mohfw',
    },
    {
      id: 'dpt-1',
      category: 'vaccination',
      title: 'DPT 1st Dose',
      description: 'First dose of Diphtheria, Pertussis, and Tetanus vaccine',
      ageInDays: 42, // 6 weeks
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    {
      id: 'pentavalent-1',
      category: 'vaccination',
      title: 'Pentavalent 1st Dose',
      description: 'First dose of Pentavalent vaccine (DPT + Hep B + Hib)',
      ageInDays: 42,
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    
    // Development milestones
    {
      id: 'first-smile',
      category: 'development',
      title: 'First Social Smile',
      description: 'Baby shows first social smile, usually around 6-8 weeks',
      ageInDays: 50,
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'who',
    },
    {
      id: 'head-control',
      category: 'development',
      title: 'Head Control',
      description: 'Baby can hold head up when on tummy',
      ageInDays: 90, // 3 months
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'who',
    },
    {
      id: 'rolling-over',
      category: 'development',
      title: 'Rolling Over',
      description: 'Baby can roll from tummy to back and back to tummy',
      ageInDays: 120, // 4 months
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'who',
    },
    {
      id: 'sitting-support',
      category: 'development',
      title: 'Sitting with Support',
      description: 'Baby can sit with support and hold head steady',
      ageInDays: 180, // 6 months
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'who',
    },
    
    // Nutrition milestones
    {
      id: 'exclusive-breastfeeding',
      category: 'nutrition',
      title: 'Exclusive Breastfeeding',
      description: 'Continue exclusive breastfeeding for first 6 months',
      ageInDays: 30,
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    {
      id: 'complementary-feeding',
      category: 'nutrition',
      title: 'Start Complementary Feeding',
      description: 'Introduce complementary foods alongside breastfeeding',
      ageInDays: 180, // 6 months
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    {
      id: 'iron-rich-foods',
      category: 'nutrition',
      title: 'Iron-Rich Foods',
      description: 'Include iron-rich foods like ragi, dal, green vegetables',
      ageInDays: 210, // 7 months
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'mohfw',
    },
    
    // Growth checkups
    {
      id: 'weight-check-1month',
      category: 'checkup',
      title: '1 Month Checkup',
      description: 'Weight, height, and development assessment',
      ageInDays: 30,
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    {
      id: 'weight-check-3month',
      category: 'checkup',
      title: '3 Month Checkup',
      description: 'Growth monitoring and development assessment',
      ageInDays: 90,
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    {
      id: 'weight-check-6month',
      category: 'checkup',
      title: '6 Month Checkup',
      description: 'Half-yearly growth and development review',
      ageInDays: 180,
      isCompleted: false,
      isOverdue: false,
      priority: 'high',
      source: 'mohfw',
    },
    
    // Additional Indian-specific milestones
    {
      id: 'vitamin-d-supplement',
      category: 'nutrition',
      title: 'Vitamin D Supplementation',
      description: 'Start Vitamin D drops as recommended for Indian babies',
      ageInDays: 15,
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'iap',
    },
    {
      id: 'iron-supplement',
      category: 'nutrition',
      title: 'Iron Supplementation',
      description: 'Iron drops supplementation for prevention of anemia',
      ageInDays: 180, // 6 months
      isCompleted: false,
      isOverdue: false,
      priority: 'medium',
      source: 'mohfw',
    },
  ];

  // Add more milestones up to 1000 days (approximately 2.7 years)
  // This is a comprehensive list that would continue...
  
  return milestones.map(milestone => ({
    ...milestone,
    isOverdue: false, // Will be calculated based on current date
  }));
};

const getNutritionGuidelines = (): NutritionGuideline[] => [
  {
    id: 'exclusive-bf-0-6',
    ageRangeStart: 0,
    ageRangeEnd: 180,
    category: 'breastfeeding',
    title: 'Exclusive Breastfeeding (0-6 months)',
    description: 'Breast milk is the complete food for babies in the first 6 months',
    recommendations: [
      'Feed on demand, at least 8-12 times per day',
      'No water, juices, or other foods needed',
      'Continue night feeding',
      'Ensure proper latch and positioning'
    ],
    indianContext: 'In Indian climate, exclusive breastfeeding provides all hydration needs',
  },
  {
    id: 'complementary-6-12',
    ageRangeStart: 180,
    ageRangeEnd: 365,
    category: 'complementary',
    title: 'Complementary Feeding (6-12 months)',
    description: 'Gradual introduction of family foods alongside continued breastfeeding',
    recommendations: [
      'Start with mashed dal, rice, ragi porridge',
      'Include local seasonal fruits and vegetables',
      'Add ghee or oil for energy density',
      'Avoid salt and sugar in first year',
      'Continue breastfeeding on demand'
    ],
    indianContext: 'Use traditional foods like khichdi, dal chawal, seasonal vegetables',
  },
  {
    id: 'toddler-12-24',
    ageRangeStart: 365,
    ageRangeEnd: 730,
    category: 'complementary',
    title: 'Toddler Nutrition (12-24 months)',
    description: 'Transition to family foods with continued breastfeeding',
    recommendations: [
      'Include variety of textures and tastes',
      'Offer 3 meals and 2 healthy snacks',
      'Include protein sources like egg, dal, chicken',
      'Continue breastfeeding up to 2 years',
      'Ensure adequate iron and calcium'
    ],
    indianContext: 'Adapt family recipes for appropriate texture and reduce spices',
  },
];

export function useJourneyPlanner() {
  // Sample baby profile - in real app, this would come from user input
  const [babyProfile, setBabyProfile] = useState<BabyProfile>({
    id: '1',
    name: 'Baby',
    birthDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days old
    gender: 'other',
    state: 'Maharashtra', // Default to Maharashtra
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [nutritionGuidelines] = useState<NutritionGuideline[]>(getNutritionGuidelines());
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);

  useEffect(() => {
    // Initialize milestones based on baby's birth date
    const defaultMilestones = getDefaultMilestones(babyProfile.birthDate);
    setMilestones(defaultMilestones);
    
    // Check for overdue milestones and create alerts
    checkOverdueMilestones(defaultMilestones);
  }, [babyProfile.birthDate]);

  const checkOverdueMilestones = (milestoneList: Milestone[]) => {
    const today = new Date();
    const babyAgeInDays = Math.floor((today.getTime() - babyProfile.birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const overdueMilestones = milestoneList.filter(milestone => 
      !milestone.isCompleted && milestone.ageInDays < babyAgeInDays - 7 // 7 days grace period
    );

    const newAlerts: AlertNotification[] = overdueMilestones.map(milestone => ({
      id: `alert-${milestone.id}`,
      type: milestone.category === 'vaccination' ? 'vaccination' : 
            milestone.category === 'checkup' ? 'checkup' : 'milestone',
      priority: milestone.priority,
      title: `Overdue: ${milestone.title}`,
      message: `This ${milestone.category} was due ${Math.floor(babyAgeInDays - milestone.ageInDays)} days ago`,
      dueDate: new Date(babyProfile.birthDate.getTime() + milestone.ageInDays * 24 * 60 * 60 * 1000),
      isRead: false,
      actionRequired: true,
      relatedMilestoneId: milestone.id,
    }));

    setAlerts(newAlerts);
  };

  const completeMilestone = (milestoneId: string, notes?: string) => {
    setMilestones(prev => prev.map(milestone => 
      milestone.id === milestoneId 
        ? { ...milestone, isCompleted: true, completedDate: new Date(), notes }
        : milestone
    ));
  };

  const getUpcomingMilestones = (days: number = 30): Milestone[] => {
    const today = new Date();
    const babyAgeInDays = Math.floor((today.getTime() - babyProfile.birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const futureCutoff = babyAgeInDays + days;

    return milestones.filter(milestone => 
      !milestone.isCompleted && 
      milestone.ageInDays >= babyAgeInDays && 
      milestone.ageInDays <= futureCutoff
    ).sort((a, b) => a.ageInDays - b.ageInDays);
  };

  const getCurrentNutritionGuidelines = (): NutritionGuideline[] => {
    const today = new Date();
    const babyAgeInDays = Math.floor((today.getTime() - babyProfile.birthDate.getTime()) / (1000 * 60 * 60 * 24));

    return nutritionGuidelines.filter(guideline =>
      babyAgeInDays >= guideline.ageRangeStart && babyAgeInDays <= guideline.ageRangeEnd
    );
  };

  const getJourneyStats = (): JourneyStats => {
    const today = new Date();
    const babyAgeInDays = Math.floor((today.getTime() - babyProfile.birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.isCompleted).length;
    const overdueMilestones = milestones.filter(m => 
      !m.isCompleted && m.ageInDays < babyAgeInDays - 7
    ).length;
    
    const upcomingVaccinations = milestones.filter(m => 
      m.category === 'vaccination' && 
      !m.isCompleted && 
      m.ageInDays >= babyAgeInDays && 
      m.ageInDays <= babyAgeInDays + 30
    ).length;

    const getCurrentPhase = (): 'pregnancy' | 'newborn' | 'infant' | 'toddler' => {
      if (babyAgeInDays < 0) return 'pregnancy';
      if (babyAgeInDays <= 28) return 'newborn';
      if (babyAgeInDays <= 365) return 'infant';
      return 'toddler';
    };

    return {
      totalMilestones,
      completedMilestones,
      overdueMilestones,
      upcomingVaccinations,
      completionPercentage: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
      currentPhase: getCurrentPhase(),
      daysCompleted: Math.max(0, babyAgeInDays),
      daysRemaining: Math.max(0, 1000 - babyAgeInDays),
    };
  };

  const updateBabyProfile = (profile: Partial<BabyProfile>) => {
    setBabyProfile(prev => ({ ...prev, ...profile }));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  return {
    babyProfile,
    milestones,
    nutritionGuidelines,
    alerts,
    updateBabyProfile,
    completeMilestone,
    getUpcomingMilestones,
    getCurrentNutritionGuidelines,
    getJourneyStats,
    dismissAlert,
    markAlertAsRead,
  };
}
