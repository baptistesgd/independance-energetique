// Variables globales
let currentStep = 1;
let simulationData = {
    postalCode: '',
    roofType: '',
    monthlyBill: 150,
    annualConsumption: 9000,
    equipment: [],
    hasBattery: false,
    hasWind: false,
    hasCharger: false
};

let energyChart = null;

// Constantes de calcul 2026
const CONSTANTS = {
    SOLAR_BASE_COVERAGE: 30, // % avec panneaux seuls
    BATTERY_ADDITIONAL_COVERAGE: 45, // passage de 30% à 75%
    WIND_ADDITIONAL_COVERAGE: 18, // ajout 15-20%
    
    SOLAR_COST_PER_KWC: 2000, // €/kWc installé
    BATTERY_COST: 8000, // € pour 10 kWh
    WIND_COST: 15000, // € pour éolienne 5kW
    CHARGER_COST: 1200, // € pour wallbox
    
    PRIME_AUTO_PER_KWC: 380, // € prime autoconso
    TVA_RATE: 0.10, // TVA réduite 10%
    ADVENIR_BONUS: 500, // € prime Advenir
    
    SURPLUS_SELL_PRICE: 0.13, // €/kWh
    KWH_PRICE: 0.23, // €/kWh prix achat EDF
    
    SOLAR_PRODUCTION_PER_KWC: 1000, // kWh/an/kWc (moyenne France)
    
    // Coefficients régionaux (basé sur 2 premiers chiffres code postal)
    REGIONAL_COEFFICIENTS: {
        'default': 1.0,
        '06': 1.15, '13': 1.15, '83': 1.15, '84': 1.12, // Sud
        '11': 1.12, '30': 1.12, '34': 1.12, '66': 1.12, // Occitanie
        '59': 0.85, '62': 0.85, '80': 0.85, '02': 0.85  // Nord
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeChart();
    updateMonthlyBillDisplay();
});

function initializeEventListeners() {
    // Postal code validation
    const postalInput = document.getElementById('postal-code');
    postalInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
        simulationData.postalCode = e.target.value;
    });
    
    // Roof type selection
    document.querySelectorAll('input[name="roof-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            simulationData.roofType = e.target.value;
        });
    });
    
    // Monthly bill slider
    const billSlider = document.getElementById('monthly-bill');
    billSlider.addEventListener('input', updateMonthlyBillDisplay);
    
    // Equipment checkboxes
    document.querySelectorAll('.equipment-check').forEach(checkbox => {
        checkbox.addEventListener('change', updateMonthlyBillDisplay);
    });
    
    // Configuration options
    document.querySelectorAll('.config-option').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSimulationData();
            calculateResults();
            updateChart();
        });
    });
}

function updateMonthlyBillDisplay() {
    const billValue = parseInt(document.getElementById('monthly-bill').value);
    document.getElementById('bill-value').textContent = billValue + ' €';
    
    // Calcul consommation annuelle de base
    let annualKwh = billValue * 12 / CONSTANTS.KWH_PRICE;
    
    // Ajout équipements
    document.querySelectorAll('.equipment-check:checked').forEach(checkbox => {
        annualKwh += parseInt(checkbox.dataset.consumption);
    });
    
    simulationData.monthlyBill = billValue;
    simulationData.annualConsumption = Math.round(annualKwh);
    
    document.getElementById('kwh-value').textContent = simulationData.annualConsumption.toLocaleString('fr-FR');
}

function initializeChart() {
    const ctx = document.getElementById('energy-chart').getContext('2d');
    
    energyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Réseau EDF', 'Solaire', 'Batterie', 'Éolien'],
            datasets: [{
                data: [70, 30, 0, 0],
                backgroundColor: [
                    '#EF4444', // Rouge EDF
                    '#FFA500', // Jaune Solaire
                    '#00D084', // Vert Batterie
                    '#0066FF'  // Bleu Éolien
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function updateSimulationData() {
    simulationData.hasBattery = document.getElementById('option-battery').checked;
    simulationData.hasWind = document.getElementById('option-wind').checked;
    simulationData.hasCharger = document.getElementById('option-charger').checked;
}

function calculateResults() {
    // Calcul coefficient régional
    const regionalCoef = getRegionalCoefficient(simulationData.postalCode);
    
    // Dimensionnement installation solaire (1 kWc pour 1000 kWh/an)
    const solarKwc = Math.ceil(simulationData.annualConsumption / CONSTANTS.SOLAR_PRODUCTION_PER_KWC);
    
    // Calcul couverture énergétique
    let totalCoverage = CONSTANTS.SOLAR_BASE_COVERAGE;
    let solarCoverage = CONSTANTS.SOLAR_BASE_COVERAGE;
    let batteryCoverage = 0;
    let windCoverage = 0;
    
    if (simulationData.hasBattery) {
        batteryCoverage = CONSTANTS.BATTERY_ADDITIONAL_COVERAGE;
        totalCoverage += batteryCoverage;
    }
    
    if (simulationData.hasWind) {
        windCoverage = CONSTANTS.WIND_ADDITIONAL_COVERAGE;
        totalCoverage += windCoverage;
    }
    
    // Limitation à 95% max (on ne peut jamais être 100% autonome)
    totalCoverage = Math.min(totalCoverage, 95);
    
    const edfCoverage = 100 - totalCoverage;
    
    // Calcul production totale
    const solarProduction = solarKwc * CONSTANTS.SOLAR_PRODUCTION_PER_KWC * regionalCoef;
    const windProduction = simulationData.hasWind ? 8000 * regionalCoef * 0.9 : 0; // 8 MWh/an éolien 5kW
    
    const totalProduction = solarProduction + windProduction;
    const selfConsumption = simulationData.annualConsumption * (totalCoverage / 100);
    const surplus = Math.max(0, totalProduction - selfConsumption);
    
    // Calcul économies
    const annualSavings = selfConsumption * CONSTANTS.KWH_PRICE;
    const monthlySavings = Math.round(annualSavings / 12);
    
    // Calcul revenu revente surplus
    const surplusRevenue = Math.round(surplus * CONSTANTS.SURPLUS_SELL_PRICE);
    
    // Calcul coûts
    const solarCost = solarKwc * CONSTANTS.SOLAR_COST_PER_KWC;
    const batteryCost = simulationData.hasBattery ? CONSTANTS.BATTERY_COST : 0;
    const windCost = simulationData.hasWind ? CONSTANTS.WIND_COST : 0;
    const chargerCost = simulationData.hasCharger ? CONSTANTS.CHARGER_COST : 0;
    
    let totalCost = solarCost + batteryCost + windCost + chargerCost;
    
    // Calcul aides
    const primeAutoconso = solarKwc * CONSTANTS.PRIME_AUTO_PER_KWC;
    const tvaReduction = totalCost * CONSTANTS.TVA_RATE * 0.5; // Approximation économie TVA
    const advenirBonus = simulationData.hasCharger ? CONSTANTS.ADVENIR_BONUS : 0;
    
    const totalAids = Math.round(primeAutoconso + tvaReduction + advenirBonus);
    const netCost = totalCost - totalAids;
    
    // Calcul ROI
    const annualBenefit = annualSavings + surplusRevenue;
    const roiYears = (netCost / annualBenefit).toFixed(1);
    
    // Mise à jour affichage
    document.getElementById('monthly-savings').textContent = monthlySavings + ' €';
    document.getElementById('annual-savings').textContent = Math.round(annualSavings) + ' €';
    document.getElementById('surplus-revenue').textContent = surplusRevenue + ' €';
    document.getElementById('state-aids').textContent = totalAids.toLocaleString('fr-FR') + ' €';
    document.getElementById('roi-years').textContent = roiYears + ' ans';
    document.getElementById('total-cost').textContent = totalCost.toLocaleString('fr-FR') + ' €';
    document.getElementById('total-aids').textContent = '-' + totalAids.toLocaleString('fr-FR') + ' €';
    document.getElementById('net-cost').textContent = netCost.toLocaleString('fr-FR') + ' €';
    document.getElementById('autonomy-percent').textContent = totalCoverage + '%';
    
    // Mise à jour graphique
    updateChartData(edfCoverage, solarCoverage, batteryCoverage, windCoverage);
}

function updateChart() {
    // La mise à jour est déjà gérée par calculateResults()
}

function updateChartData(edf, solar, battery, wind) {
    if (energyChart) {
        const data = [edf];
        const labels = ['Réseau EDF'];
        const colors = ['#EF4444'];
        
        if (solar > 0) {
            data.push(solar);
            labels.push('Solaire');
            colors.push('#FFA500');
        }
        
        if (battery > 0) {
            data.push(battery);
            labels.push('Batterie');
            colors.push('#00D084');
        }
        
        if (wind > 0) {
            data.push(wind);
            labels.push('Éolien');
            colors.push('#0066FF');
        }
        
        energyChart.data.labels = labels;
        energyChart.data.datasets[0].data = data;
        energyChart.data.datasets[0].backgroundColor = colors;
        energyChart.update('none'); // Animation désactivée pour fluidité
    }
}

function getRegionalCoefficient(postalCode) {
    if (!postalCode || postalCode.length < 2) return CONSTANTS.REGIONAL_COEFFICIENTS.default;
    
    const dept = postalCode.substring(0, 2);
    return CONSTANTS.REGIONAL_COEFFICIENTS[dept] || CONSTANTS.REGIONAL_COEFFICIENTS.default;
}

// Navigation entre étapes
function goToStep(stepNumber) {
    // Validation étape 1
    if (currentStep === 1 && stepNumber === 2) {
        const postalCode = document.getElementById('postal-code').value;
        const roofType = document.querySelector('input[name="roof-type"]:checked');
        
        if (!postalCode || postalCode.length !== 5) {
            alert('Veuillez saisir un code postal valide (5 chiffres)');
            return;
        }
        
        if (!roofType) {
            alert('Veuillez sélectionner un type de toiture');
            return;
        }
        
        simulationData.postalCode = postalCode;
        simulationData.roofType = roofType.value;
    }
    
    // Validation étape 2
    if (currentStep === 2 && stepNumber === 3) {
        updateSimulationData();
        calculateResults();
    }
    
    // Masquer étape actuelle
    document.getElementById('step-' + currentStep).style.display = 'none';
    
    // Afficher nouvelle étape
    document.getElementById('step-' + stepNumber).style.display = 'block';
    
    // Mettre à jour progress bar
    const progress = (stepNumber / 3) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
    
    // Mettre à jour indicateurs
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        const step = parseInt(indicator.dataset.step);
        indicator.classList.remove('active', 'completed');
        
        if (step === stepNumber) {
            indicator.classList.add('active');
            indicator.style.background = '#0066FF';
            indicator.style.color = 'white';
        } else if (step < stepNumber) {
            indicator.classList.add('completed');
            indicator.style.background = '#00D084';
            indicator.style.color = 'white';
        } else {
            indicator.style.background = '#E5E7EB';
            indicator.style.color = '#9CA3AF';
        }
    });
    
    currentStep = stepNumber;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLeadForm() {
    alert('Formulaire de contact à intégrer ici.\nVous pouvez connecter Make.com ou un webhook pour capturer les leads.');
    // TODO: Intégrer votre formulaire de capture de leads
}
