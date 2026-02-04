export interface Benefit {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: 'green' | 'solar' | 'electric' | 'wind';
  features: string[];
  stats: {
    label: string;
    value: string;
  };
  cta: string;
  link: string;
}

export const benefits: Benefit[] = [
  {
    id: 'panneaux-solaires',
    title: 'Panneaux Solaires',
    subtitle: 'Produisez votre propre électricité',
    description: 'Arrêtez de subir les hausses tarifaires. Avec une installation photovoltaïque bien dimensionnée, vous réduisez jusqu\'à 70% de votre facture d\'électricité et vous protégez contre l\'inflation énergétique pour les 25 prochaines années.',
    icon: 'sun',
    color: 'solar',
    features: [
      'Installation certifiée RGE pour accès aux aides',
      'Garantie production 25 ans',
      'Suivi de production en temps réel',
      'Revente du surplus à EDF OA',
    ],
    stats: {
      label: 'Économie moyenne',
      value: '1 200€/an',
    },
    cta: 'Estimer mon potentiel solaire',
    link: '#simulateur',
  },
  {
    id: 'batteries-stockage',
    title: 'Batteries de Stockage',
    subtitle: 'Consommez votre énergie quand vous en avez besoin',
    description: 'Sans batterie, vous perdez 65% de votre production solaire. Avec un système de stockage intelligent, vous passez à 70% d\'autoconsommation et vous gagnez en autonomie face aux coupures de courant.',
    icon: 'battery',
    color: 'green',
    features: [
      'Stockage lithium fer phosphate (LFP) 10 000 cycles',
      'Autonomie en cas de coupure réseau',
      'Pilotage intelligent des heures creuses',
      'Compatible toutes marques onduleurs',
    ],
    stats: {
      label: 'Autoconsommation',
      value: 'jusqu\'à 70%',
    },
    cta: 'Calculer ma capacité idéale',
    link: '#simulateur',
  },
  {
    id: 'bornes-recharge',
    title: 'Bornes de Recharge',
    subtitle: 'Rechargez votre VE avec votre propre énergie',
    description: 'Pourquoi payer le plein électrique 4x plus cher en station ? Une borne intelligente couplée à vos panneaux solaires vous permet de rouler à moins de 2€ les 100 km. Et vous contribuez à désencombrer le réseau aux heures de pointe.',
    icon: 'plug',
    color: 'electric',
    features: [
      'Borne 7,4 kW à 22 kW selon vos besoins',
      'Pilotage solaire intelligent',
      'Compatible tous véhicules électriques',
      'Installation conforme IRVE',
    ],
    stats: {
      label: 'Coût trajet',
      value: '< 2€/100km',
    },
    cta: 'Configurer ma borne',
    link: '#simulateur',
  },
  {
    id: 'eolien-domestique',
    title: 'Éolien Domestique',
    subtitle: 'Complétez votre production en hiver',
    description: 'Le solaire produit moins en hiver, quand vous consommez le plus. Une micro-éolienne de 3 à 6 kW compense ce déficit et booste votre autonomie annuelle. Idéal pour les zones ventées (littoral, campagne ouverte).',
    icon: 'wind',
    color: 'green',
    features: [
      'Puissance 1 kW à 6 kW selon site',
      'Production complémentaire au solaire',
      'Étude de vent préalable incluse',
      'Silencieux (< 35 dB)',
    ],
    stats: {
      label: 'Production hiver',
      value: '+40%',
    },
    cta: 'Évaluer mon potentiel éolien',
    link: '#simulateur',
  },
];

export function getBenefitById(id: string): Benefit | undefined {
  return benefits.find((benefit) => benefit.id === id);
}
