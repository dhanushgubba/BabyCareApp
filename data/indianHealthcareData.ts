// Indian state-specific healthcare guidelines and data
// Based on MoHFW and state health department recommendations

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Chandigarh', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
  'Puducherry', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu'
];

export interface StateSpecificGuideline {
  state: string;
  category: 'vaccination' | 'nutrition' | 'healthcare' | 'supplementation';
  guideline: string;
  source: string;
  applicableAgeRange: {
    startDays: number;
    endDays: number;
  };
}

export const stateSpecificGuidelines: StateSpecificGuideline[] = [
  // Maharashtra specific guidelines
  {
    state: 'Maharashtra',
    category: 'vaccination',
    guideline: 'Additional Japanese Encephalitis vaccine recommended in endemic areas of Vidarbha region',
    source: 'Maharashtra State Health Department',
    applicableAgeRange: { startDays: 270, endDays: 365 }, // 9-12 months
  },
  {
    state: 'Maharashtra',
    category: 'nutrition',
    guideline: 'Include traditional foods like nachni (finger millet) and jowar in complementary feeding',
    source: 'Maharashtra Nutrition Mission',
    applicableAgeRange: { startDays: 180, endDays: 730 }, // 6-24 months
  },
  
  // Kerala specific guidelines
  {
    state: 'Kerala',
    category: 'supplementation',
    guideline: 'Iron and folic acid supplementation mandatory for all children 6-59 months',
    source: 'Kerala Health Department',
    applicableAgeRange: { startDays: 180, endDays: 1800 }, // 6-59 months
  },
  {
    state: 'Kerala',
    category: 'nutrition',
    guideline: 'Include coconut oil and fish in diet from 8 months onwards',
    source: 'Kerala Nutrition Guidelines',
    applicableAgeRange: { startDays: 240, endDays: 730 }, // 8-24 months
  },
  
  // Tamil Nadu specific guidelines
  {
    state: 'Tamil Nadu',
    category: 'healthcare',
    guideline: 'Enhanced monitoring for sickle cell disease in tribal areas',
    source: 'TN Public Health Department',
    applicableAgeRange: { startDays: 30, endDays: 365 }, // 1-12 months
  },
  {
    state: 'Tamil Nadu',
    category: 'nutrition',
    guideline: 'Include ragi and traditional Tamil foods like kozhukattai in weaning',
    source: 'TN Nutrition Guidelines',
    applicableAgeRange: { startDays: 180, endDays: 730 }, // 6-24 months
  },
  
  // West Bengal specific guidelines
  {
    state: 'West Bengal',
    category: 'vaccination',
    guideline: 'Increased focus on DPT and measles vaccination in tea garden areas',
    source: 'WB Health Department',
    applicableAgeRange: { startDays: 42, endDays: 365 }, // 6 weeks - 12 months
  },
  {
    state: 'West Bengal',
    category: 'nutrition',
    guideline: 'Include fish and rice-based complementary foods, avoid mustard oil for infants',
    source: 'WB Nutrition Mission',
    applicableAgeRange: { startDays: 180, endDays: 730 }, // 6-24 months
  },
  
  // Rajasthan specific guidelines
  {
    state: 'Rajasthan',
    category: 'healthcare',
    guideline: 'Enhanced vitamin D supplementation due to limited sun exposure in some regions',
    source: 'Rajasthan Health Department',
    applicableAgeRange: { startDays: 15, endDays: 730 }, // 2 weeks - 24 months
  },
  {
    state: 'Rajasthan',
    category: 'nutrition',
    guideline: 'Include bajra and traditional Rajasthani foods in complementary feeding',
    source: 'Rajasthan Nutrition Guidelines',
    applicableAgeRange: { startDays: 180, endDays: 730 }, // 6-24 months
  },
  
  // Uttar Pradesh specific guidelines
  {
    state: 'Uttar Pradesh',
    category: 'vaccination',
    guideline: 'Intensified pulse polio immunization in high-risk districts',
    source: 'UP Health Department',
    applicableAgeRange: { startDays: 0, endDays: 1825 }, // 0-5 years
  },
  {
    state: 'Uttar Pradesh',
    category: 'supplementation',
    guideline: 'Vitamin A supplementation every 6 months for children 9-59 months',
    source: 'UP Nutrition Mission',
    applicableAgeRange: { startDays: 270, endDays: 1800 }, // 9-59 months
  },
  
  // Gujarat specific guidelines
  {
    state: 'Gujarat',
    category: 'nutrition',
    guideline: 'Include traditional foods like dhokla, thepla (without spices) for toddlers',
    source: 'Gujarat Nutrition Guidelines',
    applicableAgeRange: { startDays: 365, endDays: 730 }, // 12-24 months
  },
  
  // Karnataka specific guidelines
  {
    state: 'Karnataka',
    category: 'nutrition',
    guideline: 'Include ragi, jowar, and traditional Karnataka foods in complementary feeding',
    source: 'Karnataka Health Department',
    applicableAgeRange: { startDays: 180, endDays: 730 }, // 6-24 months
  },
  
  // Andhra Pradesh & Telangana specific guidelines
  {
    state: 'Andhra Pradesh',
    category: 'nutrition',
    guideline: 'Include traditional foods like pesarattu, idli, and local millets',
    source: 'AP Health Department',
    applicableAgeRange: { startDays: 240, endDays: 730 }, // 8-24 months
  },
  {
    state: 'Telangana',
    category: 'nutrition',
    guideline: 'Include traditional foods like pesarattu, idli, and local millets',
    source: 'Telangana Health Department',
    applicableAgeRange: { startDays: 240, endDays: 730 }, // 8-24 months
  },
  
  // Assam specific guidelines
  {
    state: 'Assam',
    category: 'healthcare',
    guideline: 'Enhanced screening for thalassemia and G6PD deficiency',
    source: 'Assam Health Department',
    applicableAgeRange: { startDays: 30, endDays: 365 }, // 1-12 months
  },
  
  // Punjab specific guidelines
  {
    state: 'Punjab',
    category: 'nutrition',
    guideline: 'Include traditional Punjabi foods like makki di roti, sarson da saag (age-appropriate)',
    source: 'Punjab Health Department',
    applicableAgeRange: { startDays: 365, endDays: 730 }, // 12-24 months
  },
];

export const getStateSpecificGuidelines = (state: string, babyAgeInDays: number) => {
  return stateSpecificGuidelines.filter(guideline => 
    guideline.state === state &&
    babyAgeInDays >= guideline.applicableAgeRange.startDays &&
    babyAgeInDays <= guideline.applicableAgeRange.endDays
  );
};

export const getVaccinationCenters = (state: string) => {
  // This would typically come from a real API or database
  const centersByState: Record<string, string[]> = {
    'Maharashtra': [
      'Primary Health Centre (PHC)',
      'Community Health Centre (CHC)',
      'District Hospital',
      'Municipal Corporation Health Posts',
    ],
    'Delhi': [
      'Delhi Government Hospitals',
      'Municipal Corporation Health Centers',
      'Private Hospitals (Apollo, Max, Fortis)',
      'Mohalla Clinics',
    ],
    'Karnataka': [
      'Bangalore Medical College Hospital',
      'Victoria Hospital',
      'District Health Centers',
      'Anganwadi Centers',
    ],
    // Add more states as needed
  };
  
  return centersByState[state] || [
    'Primary Health Centre (PHC)',
    'Community Health Centre (CHC)', 
    'District Hospital',
    'Government Medical College Hospital',
  ];
};

export const emergencyContacts = {
  nationalHelplines: [
    { name: 'National Emergency Number', number: '112' },
    { name: 'Child Helpline', number: '1098' },
    { name: 'Medical Emergency', number: '102' },
    { name: 'Women Helpline', number: '181' },
  ],
  mohfwHelpline: '1075',
  covidHelpline: '1075',
};
