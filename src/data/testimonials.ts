export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  installation: string;
  date: string;
  rating: number;
  quote: string;
  results: {
    label: string;
    value: string;
  }[];
}

export const testimonials: Testimonial[] = [
  {
    id: 'famille-martin',
    name: 'Famille Martin',
    location: 'Montpellier (34)',
    installation: '6 kWc + Batterie 10 kWh',
    date: 'Mars 2025',
    rating: 5,
    quote: 'On payait 280€/mois d\'électricité avec la clim et le chauffage. Aujourd\'hui, notre facture tourne autour de 45€. Le conseiller nous avait promis un retour sur investissement en 7 ans, on est plutôt partis sur 5 ans vu la hausse des tarifs.',
    results: [
      { label: 'Économie mensuelle', value: '235€' },
      { label: 'Autoconsommation', value: '68%' },
      { label: 'ROI estimé', value: '5 ans' },
    ],
  },
  {
    id: 'pierre-dubois',
    name: 'Pierre D.',
    location: 'Nantes (44)',
    installation: '9 kWc + Borne 11 kW',
    date: 'Janvier 2025',
    rating: 5,
    quote: 'Je fais 25 000 km/an en Tesla. Avant, je chargeais aux Superchargers : environ 200€/mois. Maintenant, je charge à la maison avec mon solaire, le coût est quasi nul. La borne intelligente décale la charge automatiquement quand le soleil donne.',
    results: [
      { label: 'Économie carburant', value: '2 400€/an' },
      { label: 'Charge solaire', value: '85%' },
      { label: 'CO2 évité', value: '3.2 tonnes/an' },
    ],
  },
  {
    id: 'marie-laurent',
    name: 'Marie L.',
    location: 'Lyon (69)',
    installation: '3 kWc (appartement copropriété)',
    date: 'Novembre 2024',
    rating: 4,
    quote: 'En appartement, je pensais que le solaire était impossible. L\'équipe a monté le dossier pour la copropriété et on a installé 3 kWc sur notre balcon-terrasse exposé sud. Résultat : -40% sur ma facture, et j\'ai convaincu trois voisins de faire pareil.',
    results: [
      { label: 'Économie annuelle', value: '520€' },
      { label: 'Surface utilisée', value: '18 m²' },
      { label: 'Délai installation', value: '3 semaines' },
    ],
  },
  {
    id: 'exploitation-girard',
    name: 'Exploitation Girard',
    location: 'Charentes (16)',
    installation: '36 kWc + 2 micro-éoliennes',
    date: 'Septembre 2024',
    rating: 5,
    quote: 'Notre exploitation agricole consommait 45 000 kWh/an (serres, irrigation, chambres froides). Le combo solaire + éolien nous rend quasiment autonomes. L\'hiver, les éoliennes prennent le relais quand le solaire faiblit. On revend même du surplus.',
    results: [
      { label: 'Autonomie atteinte', value: '92%' },
      { label: 'Revenus surplus', value: '3 800€/an' },
      { label: 'Temps de retour', value: '6.5 ans' },
    ],
  },
];

export function getTestimonialById(id: string): Testimonial | undefined {
  return testimonials.find((t) => t.id === id);
}

export function getTestimonialsByRating(minRating: number): Testimonial[] {
  return testimonials.filter((t) => t.rating >= minRating);
}
