export interface Expert {
  id: string;
  name: string;
  role: string;
  image: string;
  experience: string;
  bio: string;
  expertise: string[];
  certifications: string[];
  sources: string[];
}

export const experts: Expert[] = [
  {
    id: 'jean-pascal-moreau',
    name: 'Jean-Pascal M.',
    role: 'Ingénieur Énergies Renouvelables',
    image: '/images/experts/jean-pascal.webp',
    experience: '15 ans d\'expérience',
    bio: 'Ancien consultant technique pour l\'ADEME, Jean-Pascal a supervisé plus de 2 000 installations photovoltaïques en France. Diplômé de l\'École des Mines de Paris en génie énergétique, il se spécialise dans l\'optimisation des systèmes hybrides solaire-stockage pour les particuliers et les PME. Sa philosophie : "Une installation solaire rentable, c\'est avant tout une installation bien dimensionnée."',
    expertise: [
      'Dimensionnement installations solaires',
      'Systèmes de stockage batteries',
      'Autoconsommation optimisée',
      'Audit énergétique résidentiel',
    ],
    certifications: [
      'QualiPV - Module Électricité',
      'RGE (Reconnu Garant de l\'Environnement)',
      'Certificat ADEME Conseiller en Rénovation Énergétique',
    ],
    sources: [
      'https://www.ademe.fr',
      'https://www.ecologie.gouv.fr',
      'https://www.photovoltaique.info',
    ],
  },
  {
    id: 'sophie-delacroix',
    name: 'Sophie D.',
    role: 'Experte Mobilité Électrique & Smart Grid',
    image: '/images/experts/sophie.webp',
    experience: '15 ans d\'expérience',
    bio: 'Ingénieure en systèmes électriques (CentraleSupélec), Sophie a travaillé 8 ans chez Enedis sur le déploiement des infrastructures de recharge en France avant de rejoindre le secteur privé. Elle est reconnue pour sa capacité à vulgariser les contraintes techniques complexes du réseau électrique. Son crédo : "La mobilité électrique, c\'est simple quand on comprend son compteur."',
    expertise: [
      'Bornes de recharge résidentielles',
      'Smart charging et pilotage intelligent',
      'Raccordement au réseau électrique',
      'Couplage VE-photovoltaïque',
    ],
    certifications: [
      'Qualification IRVE (Infrastructure de Recharge pour Véhicules Électriques)',
      'Habilitation électrique BR',
      'Formation Enedis Raccordements',
    ],
    sources: [
      'https://www.ecologie.gouv.fr/bornes-recharge',
      'https://www.enedis.fr',
      'https://www.avere-france.org',
    ],
  },
];

export function getExpertById(id: string): Expert | undefined {
  return experts.find((expert) => expert.id === id);
}

export function getExpertByName(name: string): Expert | undefined {
  return experts.find((expert) => expert.name.toLowerCase().includes(name.toLowerCase()));
}
