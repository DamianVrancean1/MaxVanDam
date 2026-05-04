export type PricingPlan = {
  id: 'q1' | 'q2' | 'q3';
  title: string;
  period: string;
  monthly: number;
  total: number;
  features: string[];
  popular?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'q1',
    title: 'Abonament pe 3 luni',
    period: '3 luni',
    monthly: 1200,
    total: 3600,
    features: [
      'Gestionare stoc de baza',
      'Rapoarte lunare',
      'Alerte pentru stoc critic',
      'Suport prin email'
    ]
  },
  {
    id: 'q2',
    title: 'Abonament pe 1 an',
    period: '1 an',
    monthly: 950,
    total: 11400,
    features: [
      'Gestionare stoc avansata',
      'Rapoarte detaliate',
      'Automatizari pentru reaprovizionare',
      'Suport prioritar'
    ],
    popular: true
  },
  {
    id: 'q3',
    title: 'Abonament pe 3 ani',
    period: '3 ani',
    monthly: 850,
    total: 30600,
    features: [
      'Toate functionalitatile platformei',
      'Onboarding dedicat pentru echipa',
      'Discount pe termen lung',
      'Consultanta operationala periodica'
    ]
  }
];

export const getPricingPlanById = (planId: string): PricingPlan | undefined => {
  return pricingPlans.find((plan) => plan.id === planId);
};

