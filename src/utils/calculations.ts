/**
 * Calculs pour le simulateur d'économies énergétiques
 * Basé sur les données ADEME et les tarifs réglementés 2025-2026
 */

// Constantes basées sur données ADEME et tarifs réglementés
export const CONSTANTS = {
  // Prix kWh TTC (tarif réglementé base - source: CRE)
  PRIX_KWH_RESEAU: 0.2516, // €/kWh
  
  // Production solaire moyenne en France (kWh/kWc/an)
  PRODUCTION_SOLAIRE_SUD: 1400,
  PRODUCTION_SOLAIRE_CENTRE: 1200,
  PRODUCTION_SOLAIRE_NORD: 1000,
  
  // Rendement moyen installation
  RENDEMENT_INSTALLATION: 0.85,
  
  // Surface nécessaire par kWc (m² de toiture)
  SURFACE_PAR_KWC: 6,
  
  // Coût moyen installation (€/kWc TTC installé - source: ADEME)
  COUT_INSTALLATION_KWC: 2200,
  
  // Coût batterie de stockage (€/kWh)
  COUT_BATTERIE_KWH: 600,
  
  // Coût borne de recharge (installation comprise)
  COUT_BORNE_STANDARD: 1200,
  COUT_BORNE_INTELLIGENTE: 2000,
  
  // Aides MaPrimeRénov' et prime autoconsommation (2025-2026)
  PRIME_AUTOCONSO_3KWC: 370, // €/kWc
  PRIME_AUTOCONSO_9KWC: 280, // €/kWc
  PRIME_AUTOCONSO_36KWC: 200, // €/kWc
  PRIME_AUTOCONSO_100KWC: 100, // €/kWc
  
  // Taux autoconsommation sans/avec batterie
  TAUX_AUTOCONSO_SANS_BATTERIE: 0.35,
  TAUX_AUTOCONSO_AVEC_BATTERIE: 0.70,
  
  // Tarif rachat surplus (€/kWh)
  TARIF_RACHAT_SURPLUS: 0.13,
  
  // Durée de vie installation (années)
  DUREE_VIE_PANNEAUX: 30,
  DUREE_VIE_BATTERIE: 12,
  
  // Inflation annuelle électricité estimée
  INFLATION_ELEC_ANNUELLE: 0.04,
  
  // Consommation moyenne VE (kWh/100km)
  CONSO_VE_MOYENNE: 17,
};

export type Region = 'nord' | 'centre' | 'sud';

export interface SimulationInput {
  budgetElecAnnuel: number; // € par an
  surfaceToiture: number; // m²
  region: Region;
  avecBatterie: boolean;
  capaciteBatterie?: number; // kWh
  avecBorne: boolean;
  kmAnnuelsVE?: number;
}

export interface SimulationResult {
  // Dimensionnement
  puissanceRecommandee: number; // kWc
  productionAnnuelle: number; // kWh
  surfaceUtilisee: number; // m²
  
  // Économies
  economiesAnnuelles: number; // €
  economiesSur25Ans: number; // €
  tauxAutoconsommation: number; // %
  
  // Investissement
  coutInstallation: number; // €
  coutBatterie: number; // €
  coutBorne: number; // €
  coutTotal: number; // €
  
  // Aides
  primeAutoconsommation: number; // €
  coutNetApresAides: number; // €
  
  // Rentabilité
  tempsRetourInvestissement: number; // années
  rentabiliteSur25Ans: number; // €
  
  // CO2
  cO2EviteAnnuel: number; // kg
}

function getProductionParKwc(region: Region): number {
  switch (region) {
    case 'sud':
      return CONSTANTS.PRODUCTION_SOLAIRE_SUD;
    case 'centre':
      return CONSTANTS.PRODUCTION_SOLAIRE_CENTRE;
    case 'nord':
      return CONSTANTS.PRODUCTION_SOLAIRE_NORD;
  }
}

function calculerPrimeAutoconsommation(puissanceKwc: number): number {
  if (puissanceKwc <= 3) {
    return puissanceKwc * CONSTANTS.PRIME_AUTOCONSO_3KWC;
  } else if (puissanceKwc <= 9) {
    return puissanceKwc * CONSTANTS.PRIME_AUTOCONSO_9KWC;
  } else if (puissanceKwc <= 36) {
    return puissanceKwc * CONSTANTS.PRIME_AUTOCONSO_36KWC;
  } else {
    return puissanceKwc * CONSTANTS.PRIME_AUTOCONSO_100KWC;
  }
}

function calculerEconomiesCumulees(economieAn1: number, annees: number): number {
  let cumul = 0;
  let economieAnnuelle = economieAn1;
  
  for (let i = 0; i < annees; i++) {
    cumul += economieAnnuelle;
    economieAnnuelle *= (1 + CONSTANTS.INFLATION_ELEC_ANNUELLE);
  }
  
  return cumul;
}

export function calculerSimulation(input: SimulationInput): SimulationResult {
  const { 
    budgetElecAnnuel, 
    surfaceToiture, 
    region, 
    avecBatterie, 
    capaciteBatterie = 10,
    avecBorne,
    kmAnnuelsVE = 15000,
  } = input;
  
  // Consommation annuelle estimée
  const consoAnnuelle = budgetElecAnnuel / CONSTANTS.PRIX_KWH_RESEAU;
  
  // Puissance max selon surface disponible
  const puissanceMaxSurface = surfaceToiture / CONSTANTS.SURFACE_PAR_KWC;
  
  // Production par kWc selon région
  const productionParKwc = getProductionParKwc(region);
  
  // Puissance recommandée (couvrir 80% de la conso avec autoconsommation)
  const tauxAutoconso = avecBatterie 
    ? CONSTANTS.TAUX_AUTOCONSO_AVEC_BATTERIE 
    : CONSTANTS.TAUX_AUTOCONSO_SANS_BATTERIE;
  
  const puissanceIdeale = consoAnnuelle / (productionParKwc * tauxAutoconso * 0.8);
  const puissanceRecommandee = Math.min(
    Math.max(3, Math.round(puissanceIdeale * 10) / 10),
    puissanceMaxSurface,
    36 // Limite pratique pour particuliers
  );
  
  // Production annuelle
  const productionAnnuelle = puissanceRecommandee * productionParKwc * CONSTANTS.RENDEMENT_INSTALLATION;
  
  // Surface utilisée
  const surfaceUtilisee = puissanceRecommandee * CONSTANTS.SURFACE_PAR_KWC;
  
  // Calcul des économies
  const energieAutoconsommee = productionAnnuelle * tauxAutoconso;
  const energieSurplus = productionAnnuelle * (1 - tauxAutoconso);
  
  const economiesAutoconso = energieAutoconsommee * CONSTANTS.PRIX_KWH_RESEAU;
  const reventesSurplus = energieSurplus * CONSTANTS.TARIF_RACHAT_SURPLUS;
  
  // Économies VE si borne
  let economiesVE = 0;
  if (avecBorne && kmAnnuelsVE) {
    const consoVE = (kmAnnuelsVE / 100) * CONSTANTS.CONSO_VE_MOYENNE;
    // On suppose que 60% de la charge VE peut être solaire avec batterie
    const chargeVESolaire = avecBatterie ? consoVE * 0.6 : consoVE * 0.3;
    // Économie = différence entre prix réseau et "gratuit" solaire
    economiesVE = chargeVESolaire * CONSTANTS.PRIX_KWH_RESEAU;
  }
  
  const economiesAnnuelles = economiesAutoconso + reventesSurplus + economiesVE;
  const economiesSur25Ans = calculerEconomiesCumulees(economiesAnnuelles, 25);
  
  // Coûts
  const coutInstallation = puissanceRecommandee * CONSTANTS.COUT_INSTALLATION_KWC;
  const coutBatterie = avecBatterie ? capaciteBatterie * CONSTANTS.COUT_BATTERIE_KWH : 0;
  const coutBorne = avecBorne ? CONSTANTS.COUT_BORNE_INTELLIGENTE : 0;
  const coutTotal = coutInstallation + coutBatterie + coutBorne;
  
  // Aides
  const primeAutoconsommation = calculerPrimeAutoconsommation(puissanceRecommandee);
  const coutNetApresAides = coutTotal - primeAutoconsommation;
  
  // Rentabilité
  const tempsRetourInvestissement = coutNetApresAides / economiesAnnuelles;
  const rentabiliteSur25Ans = economiesSur25Ans - coutNetApresAides;
  
  // Impact CO2 (source ADEME: 0.052 kg CO2/kWh mix français, ~0.4 kg évité vs fossile)
  const cO2EviteAnnuel = productionAnnuelle * 0.4;
  
  return {
    puissanceRecommandee,
    productionAnnuelle: Math.round(productionAnnuelle),
    surfaceUtilisee: Math.round(surfaceUtilisee),
    economiesAnnuelles: Math.round(economiesAnnuelles),
    economiesSur25Ans: Math.round(economiesSur25Ans),
    tauxAutoconsommation: Math.round(tauxAutoconso * 100),
    coutInstallation: Math.round(coutInstallation),
    coutBatterie: Math.round(coutBatterie),
    coutBorne: Math.round(coutBorne),
    coutTotal: Math.round(coutTotal),
    primeAutoconsommation: Math.round(primeAutoconsommation),
    coutNetApresAides: Math.round(coutNetApresAides),
    tempsRetourInvestissement: Math.round(tempsRetourInvestissement * 10) / 10,
    rentabiliteSur25Ans: Math.round(rentabiliteSur25Ans),
    cO2EviteAnnuel: Math.round(cO2EviteAnnuel),
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}
