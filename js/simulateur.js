// ============================================================================
// SIMULATEUR D'INDÉPENDANCE ÉNERGÉTIQUE - VERSION AVANCÉE
// ============================================================================

// État global de l'application
const simulatorState = {
  currentStep: 0,
  maxStepReached: 0,
  intentions: [],
  data: {
    // Données communes
    postalCode: '',
    region: '',
    sunExposure: 0, // heures équivalent plein soleil
    windExposure: 0, // facteur de charge éolien
    
    // Données solaire
    roofSurface: 50,
    roofType: '',
    roofOrientation: '',
    roofInclination: 30,
    
    // Données consommation
    monthlyBill: 150,
    annualConsumption: 0,
    
    // Équipements
    hasHeatPump: false,
    hasEV: false,
    hasPool: false,
    hasWaterHeater: false,
    hasAC: false,
    hasDryer: false,
    
    // Type habitation
    habitationType: '',
    
    // Sources d'énergie pour batteries/bornes
    hasSolar: false,
    hasWind: false,
    
    // Coordonnées
    name: '',
    email: '',
    phone: '',
    city: ''
  },
  
  // Résultats de calcul
  results: {
    solarProduction: 0,
    windProduction: 0,
    batteryStorage: 0,
    evCharging: 0,
    totalProduction: 0,
    selfConsumption: 0,
    autonomyRate: 0,
    gridDependency: 0,
    monthlySavings: 0,
    annualSavings: 0,
    surplusRevenue: 0,
    stateAid: 0,
    totalCost: 0,
    netCost: 0,
    roi: 0,
    gain20years: 0
  }
};

// Données régionales (basées sur le code postal)
const regionalData = {
  // Zones de référence simplifiées
  getRegionFromPostal: function(postalCode) {
    const dept = parseInt(postalCode.substring(0, 2));
    
    // Sud (meilleur ensoleillement)
    if ([06, 13, 83, 84, 30, 34, 11, 66, 64, 65, 31, 32, 09, 81, 82].includes(dept)) {
      return { zone: 'Sud', sun: 1300, wind: 0.15 }; // 1300 kWh/kWc/an, 15% facteur charge éolien
    }
    // Sud-Ouest / Atlantique (vent fort)
    else if ([17, 33, 40, 44, 29, 22, 56, 35, 50, 14, 76, 80, 62, 59].includes(dept)) {
      return { zone: 'Ouest', sun: 1100, wind: 0.25 };
    }
    // Est / Centre
    else if ([67, 68, 88, 54, 57, 25, 90, 39, 21, 71, 01, 69, 42, 38, 73, 74].includes(dept)) {
      return { zone: 'Est', sun: 1150, wind: 0.12 };
    }
    // Centre / Nord
    else {
      return { zone: 'Centre', sun: 1050, wind: 0.18 };
    }
  }
};

// ============================================================================
// INITIALISATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  initializeSimulator();
  attachEventListeners();
  renderStep();
});

function initializeSimulator() {
  // Créer le conteneur du simulateur s'il n'existe pas
  const simulatorContainer = document.getElementById('simulateur');
  if (!simulatorContainer) {
    console.error('Container #simulateur not found');
    return;
  }
  
  // Initialiser le HTML du simulateur
  simulatorContainer.innerHTML = `
    <div class="simulator-wrapper">
      <!-- Barre de progression -->
      <div class="simulator-progress">
        <div class="progress-bar">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <div class="progress-text" id="progressText">Étape 1 sur 6</div>
      </div>
      
      <!-- Conteneur des étapes -->
      <div class="simulator-steps" id="simulatorSteps"></div>
      
      <!-- Navigation -->
      <div class="simulator-navigation" id="simulatorNavigation">
        <button class="btn btn-secondary" id="btnPrevious" style="display:none;">
          ← Retour
        </button>
        <button class="btn btn-primary" id="btnNext" disabled>
          Continuer →
        </button>
      </div>
    </div>
  `;
}

// ============================================================================
// GESTION DES ÉVÉNEMENTS
// ============================================================================

function attachEventListeners() {
  document.getElementById('btnNext')?.addEventListener('click', nextStep);
  document.getElementById('btnPrevious')?.addEventListener('click', previousStep);
}

// ============================================================================
// RENDU DES ÉTAPES
// ============================================================================

function renderStep() {
  const stepsContainer = document.getElementById('simulatorSteps');
  if (!stepsContainer) return;
  
  stepsContainer.innerHTML = getStepHTML(simulatorState.currentStep);
  
  // Mise à jour de la progression
  updateProgress();
  
  // Réattacher les événements de l'étape courante
  attachStepEvents();
  
  // Mise à jour des boutons de navigation
  updateNavigationButtons();
  
  // Animation d'entrée
  stepsContainer.style.opacity = '0';
  setTimeout(() => {
    stepsContainer.style.transition = 'opacity 0.3s ease';
    stepsContainer.style.opacity = '1';
  }, 10);
}

function getStepHTML(stepIndex) {
  switch(stepIndex) {
    case 0: return getStep0_Intentions();
    case 1: return getStep1_Dynamic(); // Étape conditionnelle
    case 2: return getStep2_Consumption();
    case 3: return getStep3_Equipment();
    case 4: return getStep4_HabitationType();
    case 5: return getStep5_Results();
    default: return '';
  }
}

// ============================================================================
// ÉTAPE 0 : SÉLECTEUR D'INTENTIONS
// ============================================================================

function getStep0_Intentions() {
  return `
    <div class="step-container">
      <h2 class="step-title">🎯 Quel est votre objectif prioritaire ?</h2>
      <p class="step-subtitle">Sélectionnez une ou plusieurs solutions qui vous intéressent</p>
      
      <div class="intentions-grid">
        <div class="intention-card" data-intention="solaire">
          <div class="intention-icon">☀️</div>
          <div class="intention-title">Produire</div>
          <div class="intention-desc">Panneaux solaires photovoltaïques</div>
          <div class="intention-badge">Base indispensable</div>
        </div>
        
        <div class="intention-card" data-intention="eolien">
          <div class="intention-icon">🌬️</div>
          <div class="intention-title">Diversifier</div>
          <div class="intention-desc">Éolienne domestique</div>
          <div class="intention-badge">Complément hiver</div>
        </div>
        
        <div class="intention-card" data-intention="batterie">
          <div class="intention-icon">🔋</div>
          <div class="intention-title">Stocker</div>
          <div class="intention-desc">Batteries de stockage</div>
          <div class="intention-badge">+40% autonomie</div>
        </div>
        
        <div class="intention-card" data-intention="borne">
          <div class="intention-icon">🚗</div>
          <div class="intention-title">Recharger</div>
          <div class="intention-desc">Borne véhicule électrique</div>
          <div class="intention-badge">Prime 500€</div>
        </div>
        
        <div class="intention-card intention-pack" data-intention="pack">
          <div class="intention-icon">🌍</div>
          <div class="intention-title">Le Pack Total</div>
          <div class="intention-desc">Autonomie maximale</div>
          <div class="intention-badge">Recommandé</div>
        </div>
      </div>
      
      <div class="info-box info-success" style="margin-top: 30px; display: none;" id="intentionsInfo">
        <strong>💡 Astuce :</strong> Combiner plusieurs solutions augmente significativement votre taux d'autonomie.
      </div>
    </div>
  `;
}

// ============================================================================
// ÉTAPE 1 : DYNAMIQUE SELON INTENTIONS
// ============================================================================

function getStep1_Dynamic() {
  const intentions = simulatorState.intentions;
  
  // Si solaire sélectionné : questions sur le toit
  if (intentions.includes('solaire') || intentions.includes('pack')) {
    return getStep1_Solar();
  }
  // Si éolien seulement : question code postal
  else if (intentions.includes('eolien')) {
    return getStep1_Wind();
  }
  // Si batterie ou borne sans production : suggestion
  else if (intentions.includes('batterie') || intentions.includes('borne')) {
    return getStep1_NeedProduction();
  }
  
  return '';
}

function getStep1_Solar() {
  return `
    <div class="step-container">
      <h2 class="step-title">☀️ Configuration de votre installation solaire</h2>
      <p class="step-subtitle">Ces informations nous permettent de calculer votre production réelle</p>
      
      <!-- Code postal -->
      <div class="form-group">
        <label for="postalCode">
          <span class="label-icon">📍</span>
          Code postal de votre installation
        </label>
        <input 
          type="text" 
          id="postalCode" 
          class="form-input" 
          placeholder="Ex: 75001"
          maxlength="5"
          pattern="[0-9]{5}"
          value="${simulatorState.data.postalCode}"
        >
        <small class="input-hint">Détermine l'ensoleillement moyen de votre région</small>
      </div>
      
      <!-- Surface du toit -->
      <div class="form-group">
        <label for="roofSurface">
          <span class="label-icon">📐</span>
          Surface de toit disponible : <strong id="roofSurfaceValue">${simulatorState.data.roofSurface} m²</strong>
        </label>
        <input 
          type="range" 
          id="roofSurface" 
          class="form-range" 
          min="10" 
          max="300" 
          step="5"
          value="${simulatorState.data.roofSurface}"
        >
        <div class="range-labels">
          <span>10 m²</span>
          <span>300 m²</span>
        </div>
        <small class="input-hint">1 kWc nécessite environ 6-8 m² de toiture</small>
      </div>
      
      <!-- Type de toiture -->
      <div class="form-group">
        <label>
          <span class="label-icon">🏠</span>
          Type de toiture
        </label>
        <div class="options-grid">
          <div class="option-card" data-value="tuiles">
            <div class="option-icon">🏠</div>
            <div class="option-label">Tuiles</div>
          </div>
          <div class="option-card" data-value="ardoise">
            <div class="option-icon">🏘️</div>
            <div class="option-label">Ardoise</div>
          </div>
          <div class="option-card" data-value="bac-acier">
            <div class="option-icon">🏭</div>
            <div class="option-label">Bac acier</div>
          </div>
        </div>
      </div>
      
      <!-- Orientation -->
      <div class="form-group">
        <label>
          <span class="label-icon">🧭</span>
          Orientation principale du toit
        </label>
        <div class="options-grid">
          <div class="option-card" data-value="sud">
            <div class="option-icon">☀️</div>
            <div class="option-label">Sud</div>
            <div class="option-badge">Optimal</div>
          </div>
          <div class="option-card" data-value="sud-est">
            <div class="option-icon">🌅</div>
            <div class="option-label">Sud-Est</div>
            <div class="option-badge">Très bien</div>
          </div>
          <div class="option-card" data-value="sud-ouest">
            <div class="option-icon">🌄</div>
            <div class="option-label">Sud-Ouest</div>
            <div class="option-badge">Très bien</div>
          </div>
          <div class="option-card" data-value="est">
            <div class="option-icon">🌤️</div>
            <div class="option-label">Est</div>
            <div class="option-badge">Bon</div>
          </div>
          <div class="option-card" data-value="ouest">
            <div class="option-icon">🌥️</div>
            <div class="option-label">Ouest</div>
            <div class="option-badge">Bon</div>
          </div>
          <div class="option-card" data-value="nord">
            <div class="option-icon">⛅</div>
            <div class="option-label">Nord</div>
            <div class="option-badge">Non recommandé</div>
          </div>
        </div>
      </div>
      
      <div class="info-box info-warning" id="orientationWarning" style="display:none;">
        <strong>⚠️ Attention :</strong> Une orientation Nord réduit la production de 60-70%. Nous recommandons d'autres solutions.
      </div>
    </div>
  `;
}

function getStep1_Wind() {
  return `
    <div class="step-container">
      <h2 class="step-title">🌬️ Configuration de votre éolienne domestique</h2>
      <p class="step-subtitle">Le vent varie fortement selon les régions</p>
      
      <div class="form-group">
        <label for="postalCodeWind">
          <span class="label-icon">📍</span>
          Code postal de votre installation
        </label>
        <input 
          type="text" 
          id="postalCodeWind" 
          class="form-input" 
          placeholder="Ex: 75001"
          maxlength="5"
          pattern="[0-9]{5}"
          value="${simulatorState.data.postalCode}"
        >
        <small class="input-hint">Détermine le potentiel éolien de votre zone</small>
      </div>
      
      <div class="info-box info-info" style="margin-top: 20px;">
        <strong>💡 Bon à savoir :</strong> Les zones côtières (Bretagne, Normandie, côte Atlantique) ont le meilleur potentiel éolien. Une étude de vent locale sera nécessaire pour valider la faisabilité.
      </div>
    </div>
  `;
}

function getStep1_NeedProduction() {
  const needsBattery = simulatorState.intentions.includes('batterie');
  const needsEV = simulatorState.intentions.includes('borne');
  
  return `
    <div class="step-container">
      <h2 class="step-title">⚡ Besoin d'une source de production</h2>
      <p class="step-subtitle">
        ${needsBattery ? 'Votre batterie' : 'Votre borne de recharge'} 
        nécessite une source d'énergie pour être rentable
      </p>
      
      <div class="info-box info-warning" style="margin-bottom: 30px;">
        <strong>💡 Recommandation :</strong> 
        ${needsBattery ? 
          'Sans production solaire ou éolienne, une batterie seule ne fera que stocker l\'électricité du réseau, ce qui n\'est pas rentable.' : 
          'Recharger votre véhicule avec votre propre production peut vous faire économiser 1 500€/an.'
        }
      </div>
      
      <div class="question-box">
        <h3>Possédez-vous déjà une source de production ?</h3>
        
        <div class="options-grid" style="margin-top: 20px;">
          <div class="option-card" data-value="has-solar">
            <div class="option-icon">☀️</div>
            <div class="option-label">J'ai des panneaux solaires</div>
          </div>
          <div class="option-card" data-value="has-wind">
            <div class="option-icon">🌬️</div>
            <div class="option-label">J'ai une éolienne</div>
          </div>
          <div class="option-card" data-value="has-both">
            <div class="option-icon">⚡</div>
            <div class="option-label">J'ai les deux</div>
          </div>
        </div>
        
        <div class="divider" style="margin: 30px 0;">
          <span>ou</span>
        </div>
        
        <h3>Vous n'avez pas encore de production ? C'est le moment !</h3>
        <p style="color: #666; margin-bottom: 20px;">
          Ajoutez une source de production pour maximiser votre investissement
        </p>
        
        <div class="options-grid">
          <div class="option-card option-card-add" data-value="add-solar">
            <div class="option-icon">➕ ☀️</div>
            <div class="option-label">Ajouter des panneaux solaires</div>
            <div class="option-badge">Recommandé</div>
          </div>
          <div class="option-card option-card-add" data-value="add-wind">
            <div class="option-icon">➕ 🌬️</div>
            <div class="option-label">Ajouter une éolienne</div>
          </div>
          <div class="option-card option-card-add" data-value="add-both">
            <div class="option-icon">➕ ⚡</div>
            <div class="option-label">Ajouter les deux</div>
            <div class="option-badge">Autonomie max</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// ÉTAPE 2 : CONSOMMATION
// ============================================================================

function getStep2_Consumption() {
  return `
    <div class="step-container">
      <h2 class="step-title">💡 Quelle est votre consommation actuelle ?</h2>
      <p class="step-subtitle">Plus votre facture est élevée, plus vos économies seront importantes</p>
      
      <div class="form-group">
        <label for="monthlyBill">
          <span class="label-icon">💰</span>
          Facture d'électricité mensuelle : <strong id="monthlyBillValue">${simulatorState.data.monthlyBill} €</strong>
        </label>
        <input 
          type="range" 
          id="monthlyBill" 
          class="form-range" 
          min="50" 
          max="500" 
          step="10"
          value="${simulatorState.data.monthlyBill}"
        >
        <div class="range-labels">
          <span>50 €</span>
          <span>500 €</span>
        </div>
      </div>
      
      <div class="consumption-display">
        <div class="consumption-card">
          <div class="consumption-label">Vous payez actuellement</div>
          <div class="consumption-value" id="monthlyDisplay">${simulatorState.data.monthlyBill} €</div>
          <div class="consumption-period">par mois à EDF</div>
        </div>
        
        <div class="consumption-card">
          <div class="consumption-label">Soit par an</div>
          <div class="consumption-value" id="annualDisplay">${simulatorState.data.monthlyBill * 12} €</div>
          <div class="consumption-period">~${Math.round(simulatorState.data.monthlyBill * 12 / 0.20)} kWh/an</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// ÉTAPE 3 : ÉQUIPEMENTS
// ============================================================================

function getStep3_Equipment() {
  return `
    <div class="step-container">
      <h2 class="step-title">🏠 Vos équipements énergivores</h2>
      <p class="step-subtitle">Cochez ce que vous possédez pour affiner vos économies</p>
      
      <div class="equipment-grid">
        <div class="equipment-card" data-equipment="heatPump">
          <input type="checkbox" id="eq-heatPump" ${simulatorState.data.hasHeatPump ? 'checked' : ''}>
          <label for="eq-heatPump">
            <div class="equipment-icon">🌡️</div>
            <div class="equipment-name">Pompe à chaleur</div>
            <div class="equipment-benefit">💰 Chauffez gratuitement avec le soleil</div>
          </label>
        </div>
        
        <div class="equipment-card" data-equipment="ev">
          <input type="checkbox" id="eq-ev" ${simulatorState.data.hasEV ? 'checked' : ''}>
          <label for="eq-ev">
            <div class="equipment-icon">🚗</div>
            <div class="equipment-name">Voiture électrique</div>
            <div class="equipment-benefit">💰 Rechargez gratuitement à domicile</div>
          </label>
        </div>
        
        <div class="equipment-card" data-equipment="pool">
          <input type="checkbox" id="eq-pool" ${simulatorState.data.hasPool ? 'checked' : ''}>
          <label for="eq-pool">
            <div class="equipment-icon">🏊</div>
            <div class="equipment-name">Piscine</div>
            <div class="equipment-benefit">💰 Filtration et chauffage solaires</div>
          </label>
        </div>
        
        <div class="equipment-card" data-equipment="waterHeater">
          <input type="checkbox" id="eq-waterHeater" ${simulatorState.data.hasWaterHeater ? 'checked' : ''}>
          <label for="eq-waterHeater">
            <div class="equipment-icon">🚿</div>
            <div class="equipment-name">Ballon d'eau chaude électrique</div>
            <div class="equipment-benefit">💰 Eau chaude gratuite en journée</div>
          </label>
        </div>
        
        <div class="equipment-card" data-equipment="ac">
          <input type="checkbox" id="eq-ac" ${simulatorState.data.hasAC ? 'checked' : ''}>
          <label for="eq-ac">
            <div class="equipment-icon">❄️</div>
            <div class="equipment-name">Climatisation</div>
            <div class="equipment-benefit">💰 Climatisez en journée avec le soleil</div>
          </label>
        </div>
        
        <div class="equipment-card" data-equipment="dryer">
          <input type="checkbox" id="eq-dryer" ${simulatorState.data.hasDryer ? 'checked' : ''}>
          <label for="eq-dryer">
            <div class="equipment-icon">👕</div>
            <div class="equipment-name">Sèche-linge</div>
            <div class="equipment-benefit">💰 Séchez gratuitement en journée</div>
          </label>
        </div>
      </div>
      
      <div class="info-box info-success" style="margin-top: 30px;">
        <strong>💡 Bon à savoir :</strong> Ces équipements augmentent votre taux d'autoconsommation car ils consomment en journée, quand vos panneaux produisent.
      </div>
    </div>
  `;
}

// ============================================================================
// ÉTAPE 4 : TYPE D'HABITATION
// ============================================================================

function getStep4_HabitationType() {
  return `
    <div class="step-container">
      <h2 class="step-title">🏡 Quel est votre type d'habitation ?</h2>
      <p class="step-subtitle">Pour adapter la solution à votre situation</p>
      
      <div class="options-grid">
        <div class="option-card option-card-large" data-value="maison">
          <div class="option-icon">🏠</div>
          <div class="option-label">Maison individuelle</div>
          <div class="option-desc">Toutes solutions disponibles</div>
        </div>
        
        <div class="option-card option-card-large" data-value="appartement">
          <div class="option-icon">🏢</div>
          <div class="option-label">Appartement</div>
          <div class="option-desc">Solutions adaptées (balcon, copropriété)</div>
        </div>
        
        <div class="option-card option-card-large" data-value="entreprise">
          <div class="option-icon">🏭</div>
          <div class="option-label">Entreprise / Local</div>
          <div class="option-desc">Aides professionnelles renforcées</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// ÉTAPE 5 : RÉSULTATS
// ============================================================================

function getStep5_Results() {
  // Calculer les résultats
  calculateResults();
  
  return `
    <div class="step-container">
      <div class="results-hero">
        <h2>🎉 Votre potentiel d'indépendance énergétique</h2>
        <div class="autonomy-display">
          <div class="autonomy-value">${Math.round(simulatorState.results.autonomyRate)}%</div>
          <div class="autonomy-label">d'autonomie énergétique</div>
        </div>
      </div>
      
      <!-- GRAPHIQUE CAMEMBERT - LE MONEY SHOT -->
      <div class="chart-section">
        <h3 class="chart-title">📊 Répartition de votre énergie</h3>
        <div class="chart-container">
          <canvas id="energyDonutChart"></canvas>
        </div>
        <div class="chart-legend" id="chartLegend"></div>
      </div>
      
      <!-- SUGGESTIONS POUR ATTEINDRE 100% -->
      ${simulatorState.results.autonomyRate < 90 ? `
        <div class="suggestions-section">
          <h3 class="suggestions-title">🚀 Augmentez votre autonomie</h3>
          <div class="suggestions-grid" id="suggestionsGrid"></div>
        </div>
      ` : `
        <div class="info-box info-success">
          <strong>🎯 Félicitations !</strong> Vous avez choisi une configuration optimale pour une autonomie maximale.
        </div>
      `}
      
      <!-- DÉTAILS FINANCIERS -->
      <div class="financial-section">
        <h3>💰 Vos gains chaque mois</h3>
        
        <div class="financial-grid">
          <div class="financial-card">
            <div class="financial-icon">💵</div>
            <div class="financial-label">Vous économisez</div>
            <div class="financial-value">+${Math.round(simulatorState.results.monthlySavings)} €</div>
            <div class="financial-period">par mois</div>
          </div>
          
          <div class="financial-card">
            <div class="financial-icon">📈</div>
            <div class="financial-label">Revente surplus</div>
            <div class="financial-value">+${Math.round(simulatorState.results.surplusRevenue)} €</div>
            <div class="financial-period">par an</div>
          </div>
          
          <div class="financial-card">
            <div class="financial-icon">🎁</div>
            <div class="financial-label">Aides de l'État</div>
            <div class="financial-value">-${Math.round(simulatorState.results.stateAid)} €</div>
            <div class="financial-period">déduits</div>
          </div>
          
          <div class="financial-card financial-card-highlight">
            <div class="financial-icon">⏱️</div>
            <div class="financial-label">Rentabilisé en</div>
            <div class="financial-value">${simulatorState.results.roi} ans</div>
            <div class="financial-period">puis gains purs !</div>
          </div>
        </div>
      </div>
      
      <!-- INVESTISSEMENT -->
      <div class="investment-section">
        <div class="investment-breakdown">
          <div class="investment-row">
            <span class="investment-label">Coût total installation</span>
            <span class="investment-value">${simulatorState.results.totalCost.toLocaleString('fr-FR')} €</span>
          </div>
          <div class="investment-row investment-row-positive">
            <span class="investment-label">- Aides 2026</span>
            <span class="investment-value">-${simulatorState.results.stateAid.toLocaleString('fr-FR')} €</span>
          </div>
          <div class="investment-row investment-row-total">
            <span class="investment-label">Votre investissement net</span>
            <span class="investment-value">${simulatorState.results.netCost.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      </div>
      
      <!-- FORMULAIRE DE CONTACT -->
      <div class="contact-section">
        <h3 class="contact-title">📄 Recevez votre étude détaillée gratuite</h3>
        <p class="contact-subtitle">Un expert vous recontacte sous 24h pour affiner votre projet</p>
        
        <div class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="contactName">Nom complet *</label>
              <input type="text" id="contactName" class="form-input" required placeholder="Jean Dupont">
            </div>
            <div class="form-group">
              <label for="contactEmail">Email *</label>
              <input type="email" id="contactEmail" class="form-input" required placeholder="jean.dupont@email.com">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="contactPhone">Téléphone *</label>
              <input type="tel" id="contactPhone" class="form-input" required placeholder="06 12 34 56 78">
            </div>
            <div class="form-group">
              <label for="contactCity">Ville *</label>
              <input type="text" id="contactCity" class="form-input" required placeholder="Paris" value="${simulatorState.data.city}">
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="contactRGPD" required>
              <span>J'accepte d'être contacté par un conseiller pour mon projet d'indépendance énergétique</span>
            </label>
          </div>
          
          <button class="btn btn-primary btn-large" id="btnSubmitContact">
            📧 Recevoir mon étude détaillée
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// CALCULS ET RÉSULTATS
// ============================================================================

function calculateResults() {
  const data = simulatorState.data;
  const results = simulatorState.results;
  
  // Récupérer les données régionales
  const regionData = regionalData.getRegionFromPostal(data.postalCode || '75001');
  data.sunExposure = regionData.sun;
  data.windExposure = regionData.wind;
  
  // Consommation annuelle en kWh
  data.annualConsumption = (data.monthlyBill * 12) / 0.20; // 0.20€/kWh prix moyen
  
  // ========== PRODUCTION SOLAIRE ==========
  if (simulatorState.intentions.includes('solaire') || simulatorState.intentions.includes('pack')) {
    // Puissance installable (1 kWc = ~7m²)
    const installedPower = data.roofSurface / 7;
    
    // Coefficient d'orientation
    const orientationCoef = {
      'sud': 1.0,
      'sud-est': 0.95,
      'sud-ouest': 0.95,
      'est': 0.85,
      'ouest': 0.85,
      'nord': 0.3
    }[data.roofOrientation] || 0.9;
    
    // Production annuelle (kWh/an)
    results.solarProduction = installedPower * data.sunExposure * orientationCoef;
  }
  
  // ========== PRODUCTION ÉOLIENNE ==========
  if (simulatorState.intentions.includes('eolien') || simulatorState.intentions.includes('pack')) {
    // Éolienne domestique moyenne 5 kW
    const windPower = 5; // kW
    const hoursPerYear = 8760;
    results.windProduction = windPower * hoursPerYear * data.windExposure;
  }
  
  // ========== PRODUCTION TOTALE ==========
  results.totalProduction = results.solarProduction + results.windProduction;
  
  // ========== TAUX D'AUTOCONSOMMATION ==========
  let baseAutoconsumption = 0.35; // 35% de base sans batterie
  
  // Bonus équipements qui consomment en journée
  if (data.hasHeatPump) baseAutoconsumption += 0.08;
  if (data.hasPool) baseAutoconsumption += 0.05;
  if (data.hasWaterHeater) baseAutoconsumption += 0.05;
  if (data.hasAC) baseAutoconsumption += 0.07;
  if (data.hasDryer) baseAutoconsumption += 0.03;
  
  // Avec batterie : +40% d'autoconsommation
  if (simulatorState.intentions.includes('batterie') || simulatorState.intentions.includes('pack')) {
    baseAutoconsumption += 0.40;
    results.batteryStorage = 10; // kWh stockés
  }
  
  baseAutoconsumption = Math.min(baseAutoconsumption, 0.85); // Max 85%
  
  // ========== TAUX D'AUTONOMIE ==========
  const consumedFromProduction = results.totalProduction * baseAutoconsumption;
  results.autonomyRate = Math.min((consumedFromProduction / data.annualConsumption) * 100, 100);
  results.gridDependency = 100 - results.autonomyRate;
  
  // ========== ÉCONOMIES ==========
  results.annualSavings = consumedFromProduction * 0.20; // 0.20€/kWh économisés
  results.monthlySavings = results.annualSavings / 12;
  
  // Revente du surplus (15% du surplus à 0.13€/kWh)
  const surplus = results.totalProduction - consumedFromProduction;
  results.surplusRevenue = surplus * 0.13;
  
  // ========== AIDES DE L'ÉTAT ==========
  let totalAid = 0;
  
  // Prime autoconsommation panneaux solaires
  if (simulatorState.intentions.includes('solaire') || simulatorState.intentions.includes('pack')) {
    const installedPower = data.roofSurface / 7;
    if (installedPower <= 3) totalAid += 380 * installedPower;
    else if (installedPower <= 9) totalAid += 280 * installedPower;
    else totalAid += 160 * installedPower;
  }
  
  // Crédit d'impôt batterie (25%)
  if (simulatorState.intentions.includes('batterie') || simulatorState.intentions.includes('pack')) {
    totalAid += 8000 * 0.25; // 25% du coût batterie
  }
  
  // Prime Advenir borne de recharge
  if (simulatorState.intentions.includes('borne') || simulatorState.intentions.includes('pack')) {
    totalAid += 500;
  }
  
  results.stateAid = totalAid;
  
  // ========== COÛTS ==========
  let totalCost = 0;
  
  if (simulatorState.intentions.includes('solaire') || simulatorState.intentions.includes('pack')) {
    const installedPower = data.roofSurface / 7;
    totalCost += installedPower * 2000; // 2000€/kWc
  }
  
  if (simulatorState.intentions.includes('batterie') || simulatorState.intentions.includes('pack')) {
    totalCost += 8000; // Batterie 10 kWh
  }
  
  if (simulatorState.intentions.includes('eolien') || simulatorState.intentions.includes('pack')) {
    totalCost += 15000; // Éolienne domestique
  }
  
  if (simulatorState.intentions.includes('borne') || simulatorState.intentions.includes('pack')) {
    totalCost += 1200; // Borne de recharge
  }
  
  results.totalCost = totalCost;
  results.netCost = totalCost - totalAid;
  
  // ========== ROI ==========
  const annualGain = results.annualSavings + results.surplusRevenue;
  results.roi = Math.round(results.netCost / annualGain);
  
  // ========== GAIN SUR 20 ANS ==========
  // Avec augmentation 5%/an du prix de l'électricité
  let totalGain = 0;
  for (let year = 1; year <= 20; year++) {
    totalGain += annualGain * Math.pow(1.05, year);
  }
  results.gain20years = totalGain - results.netCost;
}

// ============================================================================
// GESTION DES ÉVÉNEMENTS DES ÉTAPES
// ============================================================================

function attachStepEvents() {
  const step = simulatorState.currentStep;
  
  switch(step) {
    case 0:
      attachStep0Events();
      break;
    case 1:
      attachStep1Events();
      break;
    case 2:
      attachStep2Events();
      break;
    case 3:
      attachStep3Events();
      break;
    case 4:
      attachStep4Events();
      break;
    case 5:
      attachStep5Events();
      break;
  }
}

function attachStep0Events() {
  const cards = document.querySelectorAll('.intention-card');
  
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const intention = this.dataset.intention;
      
      if (intention === 'pack') {
        // Sélectionner tout
        cards.forEach(c => c.classList.add('selected'));
        simulatorState.intentions = ['solaire', 'eolien', 'batterie', 'borne', 'pack'];
      } else {
        // Toggle sélection
        this.classList.toggle('selected');
        
        // Désélectionner pack
        document.querySelector('[data-intention="pack"]').classList.remove('selected');
        
        // Update intentions
        const index = simulatorState.intentions.indexOf(intention);
        if (index > -1) {
          simulatorState.intentions.splice(index, 1);
        } else {
          simulatorState.intentions.push(intention);
        }
        
        // Retirer pack
        const packIndex = simulatorState.intentions.indexOf('pack');
        if (packIndex > -1) {
          simulatorState.intentions.splice(packIndex, 1);
        }
      }
      
      // Afficher info si au moins 2 intentions
      const infoBox = document.getElementById('intentionsInfo');
      if (simulatorState.intentions.length >= 2) {
        infoBox.style.display = 'block';
      } else {
        infoBox.style.display = 'none';
      }
      
      updateNavigationButtons();
    });
  });
}

function attachStep1Events() {
  const intentions = simulatorState.intentions;
  
  if (intentions.includes('solaire') || intentions.includes('pack')) {
    // Code postal
    const postalInput = document.getElementById('postalCode');
    postalInput?.addEventListener('input', function() {
      simulatorState.data.postalCode = this.value;
      updateNavigationButtons();
    });
    
    // Surface
    const surfaceSlider = document.getElementById('roofSurface');
    const surfaceValue = document.getElementById('roofSurfaceValue');
    surfaceSlider?.addEventListener('input', function() {
      simulatorState.data.roofSurface = parseInt(this.value);
      surfaceValue.textContent = `${this.value} m²`;
    });
    
    // Type de toiture
    const roofTypeCards = document.querySelectorAll('.option-card[data-value="tuiles"], .option-card[data-value="ardoise"], .option-card[data-value="bac-acier"]');
    roofTypeCards.forEach(card => {
      card.addEventListener('click', function() {
        roofTypeCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        simulatorState.data.roofType = this.dataset.value;
        updateNavigationButtons();
      });
    });
    
    // Orientation
    const orientationCards = document.querySelectorAll('.option-card[data-value="sud"], .option-card[data-value="sud-est"], .option-card[data-value="sud-ouest"], .option-card[data-value="est"], .option-card[data-value="ouest"], .option-card[data-value="nord"]');
    orientationCards.forEach(card => {
      card.addEventListener('click', function() {
        orientationCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        simulatorState.data.roofOrientation = this.dataset.value;
        
        // Afficher warning si Nord
        const warning = document.getElementById('orientationWarning');
        if (this.dataset.value === 'nord') {
          warning.style.display = 'block';
        } else {
          warning.style.display = 'none';
        }
        
        updateNavigationButtons();
      });
    });
  } else if (intentions.includes('eolien')) {
    const postalInput = document.getElementById('postalCodeWind');
    postalInput?.addEventListener('input', function() {
      simulatorState.data.postalCode = this.value;
      updateNavigationButtons();
    });
  } else {
    // Production check
    const productionCards = document.querySelectorAll('.option-card');
    productionCards.forEach(card => {
      card.addEventListener('click', function() {
        const value = this.dataset.value;
        
        if (value === 'has-solar') {
          simulatorState.data.hasSolar = true;
        } else if (value === 'has-wind') {
          simulatorState.data.hasWind = true;
        } else if (value === 'has-both') {
          simulatorState.data.hasSolar = true;
          simulatorState.data.hasWind = true;
        } else if (value === 'add-solar') {
          simulatorState.intentions.push('solaire');
        } else if (value === 'add-wind') {
          simulatorState.intentions.push('eolien');
        } else if (value === 'add-both') {
          simulatorState.intentions.push('solaire', 'eolien');
        }
        
        updateNavigationButtons();
      });
    });
  }
}

function attachStep2Events() {
  const billSlider = document.getElementById('monthlyBill');
  const billValue = document.getElementById('monthlyBillValue');
  const monthlyDisplay = document.getElementById('monthlyDisplay');
  const annualDisplay = document.getElementById('annualDisplay');
  
  billSlider?.addEventListener('input', function() {
    const value = parseInt(this.value);
    simulatorState.data.monthlyBill = value;
    billValue.textContent = `${value} €`;
    monthlyDisplay.textContent = `${value} €`;
    annualDisplay.textContent = `${value * 12} €`;
    
    const kWh = Math.round((value * 12) / 0.20);
    document.querySelector('.consumption-period').textContent = `~${kWh.toLocaleString('fr-FR')} kWh/an`;
  });
}

function attachStep3Events() {
  const equipmentCards = document.querySelectorAll('.equipment-card');
  
  equipmentCards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const equipment = card.dataset.equipment;
    
    checkbox?.addEventListener('change', function() {
      switch(equipment) {
        case 'heatPump': simulatorState.data.hasHeatPump = this.checked; break;
        case 'ev': simulatorState.data.hasEV = this.checked; break;
        case 'pool': simulatorState.data.hasPool = this.checked; break;
        case 'waterHeater': simulatorState.data.hasWaterHeater = this.checked; break;
        case 'ac': simulatorState.data.hasAC = this.checked; break;
        case 'dryer': simulatorState.data.hasDryer = this.checked; break;
      }
    });
    
    // Permettre de cliquer sur la carte entière
    card.addEventListener('click', function(e) {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });
}

function attachStep4Events() {
  const habitationCards = document.querySelectorAll('.option-card');
  
  habitationCards.forEach(card => {
    card.addEventListener('click', function() {
      habitationCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      simulatorState.data.habitationType = this.dataset.value;
      updateNavigationButtons();
    });
  });
}

function attachStep5Events() {
  // Créer le graphique en camembert
  createEnergyDonutChart();
  
  // Générer les suggestions
  generateSuggestions();
  
  // Bouton de soumission
  const submitBtn = document.getElementById('btnSubmitContact');
  submitBtn?.addEventListener('click', submitContactForm);
}

// ============================================================================
// GRAPHIQUE CAMEMBERT (DONUT CHART)
// ============================================================================

function createEnergyDonutChart() {
  const canvas = document.getElementById('energyDonutChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const results = simulatorState.results;
  
  // Données du graphique
  const data = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };
  
  // EDF (rouge) - Dépendance restante
  if (results.gridDependency > 0) {
    data.labels.push('Réseau EDF');
    data.datasets[0].data.push(results.gridDependency);
    data.datasets[0].backgroundColor.push('#ef4444');
  }
  
  // Solaire (jaune)
  if (results.solarProduction > 0) {
    const solarPercent = (results.solarProduction / simulatorState.data.annualConsumption) * 100;
    data.labels.push('Énergie Solaire');
    data.datasets[0].data.push(Math.min(solarPercent, 100));
    data.datasets[0].backgroundColor.push('#fbbf24');
  }
  
  // Éolien (bleu)
  if (results.windProduction > 0) {
    const windPercent = (results.windProduction / simulatorState.data.annualConsumption) * 100;
    data.labels.push('Énergie Éolienne');
    data.datasets[0].data.push(Math.min(windPercent, 100));
    data.datasets[0].backgroundColor.push('#3b82f6');
  }
  
  // Batterie (vert) - Bonus d'autonomie
  if (simulatorState.intentions.includes('batterie') || simulatorState.intentions.includes('pack')) {
    data.labels.push('Stockage Batterie');
    data.datasets[0].data.push(15); // Bonus visuel
    data.datasets[0].backgroundColor.push('#10b981');
  }
  
  // Créer le graphique
  if (window.energyChart) {
    window.energyChart.destroy();
  }
  
  window.energyChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${Math.round(context.parsed)}%`;
            }
          }
        }
      },
      cutout: '65%'
    }
  });
  
  // Créer la légende personnalisée
  createChartLegend(data);
}

function createChartLegend(data) {
  const legendContainer = document.getElementById('chartLegend');
  if (!legendContainer) return;
  
  let legendHTML = '<div class="legend-items">';
  
  data.labels.forEach((label, index) => {
    const color = data.datasets[0].backgroundColor[index];
    const value = Math.round(data.datasets[0].data[index]);
    
    legendHTML += `
      <div class="legend-item">
        <div class="legend-color" style="background-color: ${color};"></div>
        <div class="legend-label">${label}</div>
        <div class="legend-value">${value}%</div>
      </div>
    `;
  });
  
  legendHTML += '</div>';
  legendContainer.innerHTML = legendHTML;
}

// ============================================================================
// SUGGESTIONS POUR AUGMENTER L'AUTONOMIE
// ============================================================================

function generateSuggestions() {
  const suggestionsGrid = document.getElementById('suggestionsGrid');
  if (!suggestionsGrid) return;
  
  const intentions = simulatorState.intentions;
  const suggestions = [];
  
  // Suggérer ce qui n'est pas encore sélectionné
  if (!intentions.includes('solaire') && !intentions.includes('pack')) {
    suggestions.push({
      icon: '☀️',
      title: 'Panneaux Solaires',
      benefit: '+40% d\'autonomie',
      impact: 'Production de jour optimale',
      cost: '~12 000 €'
    });
  }
  
  if (!intentions.includes('batterie') && !intentions.includes('pack')) {
    suggestions.push({
      icon: '🔋',
      title: 'Batterie de Stockage',
      benefit: '+35% d\'autonomie',
      impact: 'Utilisez votre énergie la nuit',
      cost: '~8 000 €'
    });
  }
  
  if (!intentions.includes('eolien') && !intentions.includes('pack')) {
    suggestions.push({
      icon: '🌬️',
      title: 'Éolienne Domestique',
      benefit: '+15% d\'autonomie',
      impact: 'Production hiver et nuit',
      cost: '~15 000 €'
    });
  }
  
  if (!intentions.includes('borne') && !intentions.includes('pack') && simulatorState.data.hasEV) {
    suggestions.push({
      icon: '🚗',
      title: 'Borne de Recharge',
      benefit: 'Économies recharge',
      impact: 'Rechargez avec votre production',
      cost: '~1 200 € (prime -500€)'
    });
  }
  
  // Générer le HTML
  let html = '';
  suggestions.forEach(suggestion => {
    html += `
      <div class="suggestion-card">
        <div class="suggestion-icon">${suggestion.icon}</div>
        <div class="suggestion-title">${suggestion.title}</div>
        <div class="suggestion-benefit">${suggestion.benefit}</div>
        <div class="suggestion-impact">${suggestion.impact}</div>
        <div class="suggestion-cost">${suggestion.cost}</div>
      </div>
    `;
  });
  
  suggestionsGrid.innerHTML = html;
}

// ============================================================================
// NAVIGATION
// ============================================================================

function nextStep() {
  const canProceed = validateCurrentStep();
  if (!canProceed) return;
  
  simulatorState.currentStep++;
  simulatorState.maxStepReached = Math.max(simulatorState.maxStepReached, simulatorState.currentStep);
  renderStep();
}

function previousStep() {
  if (simulatorState.currentStep > 0) {
    simulatorState.currentStep--;
    renderStep();
  }
}

function validateCurrentStep() {
  const step = simulatorState.currentStep;
  
  switch(step) {
    case 0:
      return simulatorState.intentions.length > 0;
    
    case 1:
      const intentions = simulatorState.intentions;
      if (intentions.includes('solaire') || intentions.includes('pack')) {
        return simulatorState.data.postalCode.length === 5 &&
               simulatorState.data.roofType !== '' &&
               simulatorState.data.roofOrientation !== '';
      } else if (intentions.includes('eolien')) {
        return simulatorState.data.postalCode.length === 5;
      } else {
        // Batterie/borne : vérifier qu'une source est choisie
        return simulatorState.data.hasSolar || 
               simulatorState.data.hasWind || 
               intentions.includes('solaire') || 
               intentions.includes('eolien');
      }
    
    case 2:
      return true; // Toujours valide (slider)
    
    case 3:
      return true; // Optionnel
    
    case 4:
      return simulatorState.data.habitationType !== '';
    
    default:
      return true;
  }
}

function updateNavigationButtons() {
  const btnNext = document.getElementById('btnNext');
  const btnPrevious = document.getElementById('btnPrevious');
  
  if (btnNext) {
    btnNext.disabled = !validateCurrentStep();
  }
  
  if (btnPrevious) {
    btnPrevious.style.display = simulatorState.currentStep > 0 ? 'block' : 'none';
  }
  
  // Cacher navigation sur la dernière étape (résultats)
  const navigation = document.getElementById('simulatorNavigation');
  if (navigation && simulatorState.currentStep === 5) {
    navigation.style.display = 'none';
  } else if (navigation) {
    navigation.style.display = 'flex';
  }
}

function updateProgress() {
  const totalSteps = 6;
  const progress = ((simulatorState.currentStep + 1) / totalSteps) * 100;
  
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
  
  if (progressText) {
    progressText.textContent = `Étape ${simulatorState.currentStep + 1} sur ${totalSteps}`;
  }
}

// ============================================================================
// SOUMISSION DU FORMULAIRE
// ============================================================================

function submitContactForm() {
  const name = document.getElementById('contactName')?.value;
  const email = document.getElementById('contactEmail')?.value;
  const phone = document.getElementById('contactPhone')?.value;
  const city = document.getElementById('contactCity')?.value;
  const rgpd = document.getElementById('contactRGPD')?.checked;
  
  if (!name || !email || !phone || !city || !rgpd) {
    alert('Veuillez remplir tous les champs obligatoires et accepter la politique de confidentialité.');
    return;
  }
  
  // Valider l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Veuillez entrer une adresse email valide.');
    return;
  }
  
  // Sauvegarder les données
  simulatorState.data.name = name;
  simulatorState.data.email = email;
  simulatorState.data.phone = phone;
  simulatorState.data.city = city;
  
  // Préparer les données pour envoi
  const leadData = {
    ...simulatorState.data,
    intentions: simulatorState.intentions,
    results: simulatorState.results,
    timestamp: new Date().toISOString()
  };
  
  console.log('Lead data to send:', leadData);
  
  // TODO: Envoyer les données à votre API
  // fetch('/api/submit-lead', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(leadData)
  // })
  
  // Afficher le message de succès
  showSuccessMessage();
}

function showSuccessMessage() {
  const stepsContainer = document.getElementById('simulatorSteps');
  if (!stepsContainer) return;
  
  stepsContainer.innerHTML = `
    <div class="success-container">
      <div class="success-icon">✅</div>
      <h2 class="success-title">Merci pour votre confiance !</h2>
      <p class="success-message">
        Votre demande d'étude détaillée a bien été envoyée.<br>
        Un expert vous contactera dans les 24 heures pour affiner votre projet.
      </p>
      <p class="success-email">
        Un récapitulatif a été envoyé à <strong>${simulatorState.data.email}</strong>
      </p>
      <button class="btn btn-primary" onclick="location.reload()">
        🔄 Faire une nouvelle simulation
      </button>
    </div>
  `;
  
  document.getElementById('simulatorNavigation').style.display = 'none';
}

// ============================================================================
// CHARGEMENT DE CHART.JS
// ============================================================================

// Charger Chart.js si pas déjà chargé
if (typeof Chart === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  document.head.appendChild(script);
}
