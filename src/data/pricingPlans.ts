export interface PricingPlan {
  id: string;
  title: string;
  monthly: number;
  total: number;
  period: string;
  popular: boolean;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'q1',
    title: 'Basic',
    monthly: 299,
    total: 3289,
    period: '12 luni',
    popular: false,
    features: [
      'Pana la 500 produse',
      'Gestionare stoc de baza',
      'Rapoarte lunare',
      'Suport email',
    ],
  },
  {
    id: 'q2',
    title: 'Professional',
    monthly: 599,
    total: 6589,
    period: '12 luni',
    popular: true,
    features: [
      'Pana la 5.000 produse',
      'Gestionare stoc avansata',
      'Rapoarte saptamanale',
      'Integrare comenzi online',
      'Suport prioritar',
    ],
  },
  {
    id: 'q3',
    title: 'Enterprise',
    monthly: 999,
    total: 10989,
    period: '12 luni',
    popular: false,
    features: [
      'Produse nelimitate',
      'Gestionare multi-depozit',
      'Rapoarte in timp real',
      'API acces complet',
      'Manager de cont dedicat',
      'Suport 24/7',
    ],
  },
];

export const getPricingPlanById = (id: string): PricingPlan | undefined =>
  pricingPlans.find((plan) => plan.id === id);
