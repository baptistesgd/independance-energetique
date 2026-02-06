// Variables globales
let currentStep = 1;
let simulationData = {
    postalCode: '',
    roofType: '',
    roofSurface: 50,
    monthlyBill: 150,
    annualConsumption: 9000,
    equipment: [],
    hasBattery: false,
    hasWind: false,
    hasCharger: false
};

let energyChart = null;

// Constantes 2026
const CONSTANTS = {
    SOLAR_BASE_COVERAGE: 30,
    BATTERY_ADDITIONAL_COVERAGE: 45,
    WIND_ADDITIONAL_COVERAGE: 18,
    
    SOLAR_COST_PER_KWC: 2000,
    BATTERY_COST: 8000,
    WIND_COST: 15000,
    CHARGER_COST: 1200,
    
    PRIME_AUTO_PER_KWC: 380,
    TVA_RATE: 0.10,
    ADVENIR_BONUS: 500,
    
    SURPLUS_SELL_PRICE: 0.13,
    KWH_PRICE: 0.23,
    
    SOLAR_PRODUCTION_PER_KWC: 1000,
    
    // Coefficients régionaux solaire
    SOLAR_COEFFICIENTS: {
        'default': 1.0,
        '06': 1.15, '13': 1.15, '83': 1.15, '84': 1.12,
        '11': 1.12, '30': 1.12, '34': 1.12, '66': 1.12,
        '59': 0.85, '62': 0.85, '80': 0.85, '02': 0.85
    },
    
    // Coefficients régionaux éolien (vent moyen)
    WIND_COEFFICIENTS: {
        'default': 1.0,
        '29': 1.25, '22': 1.25, '56': 1.20, // Bretagne
        '50': 1.20, '14': 1.15, // Normandie
        '17': 1.15, '33': 1.10, '64': 1.10, // Atlantique
        '59': 1.15, '62': 1.15, '80': 1.10, // Nord
        '13': 0.90, '06': 0.85, '83': 0.85  // Méditerranée
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeChart();
    updateMonthlyBillDisplay();
    updateRoofSurfaceDisplay();
});

function initializeEventListeners() {
    // Postal code
    const postalInput = document.getElementById('postal-code');
    postalInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
        simulationData.postalCode = e.target.value;
    });
    
    // Roof surface
    const roofSlider = document.getElementById('roof-surface');
    roofSlider.addEventListener('input', updateRoofSurfaceDisplay);
    
    // Roof type
    document.querySelectorAll('input[name="roof-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            simulationData.roofType = e.target.value;
        });
    });
    
    // Monthly bill
    const billSlider = document.getElementById('monthly-bill');
    billSlider.addEventListener('input', updateMonthlyBillDisplay);
    
    // Equipment checkboxes
    document.querySelectorAll('.equipment-check').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateEquipmentList();
        });
    });
    
    // Config options
    document.querySelectorAll('.config-option').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSimulationData();
            calculateResults();
            updateChart();
        });
    });
}

function updateRoofSurfaceDisplay() {
    const value = document.getElementById('roof-surface').value;
    document.getElementById('roof-surface-value').textContent = value + ' m²';
    simulationData.roofSurface = parseInt(value);
}

function updateMonthlyBillDisplay() {
    const billValue = parseInt(document.getElementById('monthly-bill').value);
    document.getElementById('bill-value').textContent = billValue + ' €';
    
    // Calcul consommation
    const annualKwh = Math.round((billValue * 12) / CONSTANTS.KWH_PRICE);
    
    simulationData.monthlyBill = billValue;
    simulationData.annualConsumption = annualKwh;
    
    document.getElementById('kwh-value').textContent = annualKwh.toLocaleString('fr-FR');
    document.getElementById('annual-cost').textContent = (billValue * 12).toLocaleString('fr-FR') + ' €';
}

function updateEquipmentList() {
    simulationData.equipment = [];
    document.querySelectorAll('.equipment-check:checked').forEach(checkbox => {
        simulationData.equipment.push(checkbox.dataset.equipment);
    });
}

function initializeChart() {
    const ctx = document.getElementById('energy-chart').getContext('2d');
    
    energyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Réseau EDF', 'Solaire'],
            datasets: [{
                data: [70, 30],
                backgroundColor: ['#EF4444', '#FFA500'],
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
                        font: { size: 12, family: 'Inter' },
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
    // Coefficients
    const solarCoef = getSolarCoefficient(simulationData.postalCode);
    const windCoef = getWindCoefficient(simulationData.postalCode);
    
    // Dimensionnement solaire (limité par surface toit)
    const maxKwcBySurface = simulationData.roofSurface / 6; // 1 kWc ≈ 6m²
    const idealKwc = simulationData.annualConsumption / CONSTANTS.SOLAR_PRODUCTION_PER_KWC;
    const solarKwc = Math.min(Math.ceil(idealKwc), Math.ceil(maxKwcBySurface));
    
    // Couverture
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
    
    totalCoverage = Math.min(totalCoverage, 95);
    const edfCoverage = 100 - totalCoverage;
    
    // Production
    const solarProduction = solarKwc * CONSTANTS.SOLAR_PRODUCTION_PER_KWC * solarCoef;
    const windProduction = simulationData.hasWind ? 8000 * windCoef : 0;
    const totalProduction = solarProduction + windProduction;
    const selfConsumption = simulationData.annualConsumption * (totalCoverage / 100);
    const surplus = Math.max(0, totalProduction - selfConsumption);
    
    // Économies
    const annualSavings = selfConsumption * CONSTANTS.KWH_PRICE;
    const monthlySavings = Math.round(annualSavings / 12);
    
    // Bonus équipements (affichage uniquement, pas de calcul)
    let equipmentBonus = '';
    if (simulationData.equipment.includes('ve')) {
        equipmentBonus += '+ Recharge voiture gratuite\n';
    }
    if (simulationData.equipment.includes('pac')) {
        equipmentBonus += '+ Chauffage solaire\n';
    }
    
    // Revenu revente
    const surplusRevenue = Math.round(surplus * CONSTANTS.SURPLUS_SELL_PRICE);
    
    // Coûts
    const solarCost = solarKwc * CONSTANTS.SOLAR_COST_PER_KWC;
    const batteryCost = simulationData.hasBattery ? CONSTANTS.BATTERY_COST : 0;
    const windCost = simulationData.hasWind ? CONSTANTS.WIND_COST : 0;
    const chargerCost = simulationData.hasCharger ? CONSTANTS.CHARGER_COST : 0;
    
    let totalCost = solarCost + batteryCost + windCost + chargerCost;
    
    // Aides
    const primeAutoconso = solarKwc * CONSTANTS.PRIME_AUTO_PER_KWC;
    const tvaReduction = totalCost * CONSTANTS.TVA_RATE * 0.5;
    const advenirBonus = simulationData.hasCharger ? CONSTANTS.ADVENIR_BONUS : 0;
    
    const totalAids = Math.round(primeAutoconso + tvaReduction + advenirBonus);
    const netCost = totalCost - totalAids;
    
    // ROI
    const annualBenefit = annualSavings + surplusRevenue;
    const roiYears = (netCost / annualBenefit).toFixed(1);
    
    // Mise à jour affichage
    document.getElementById('monthly-savings').textContent = '+' + monthlySavings + ' €';
    document.getElementById('annual-savings').textContent = '+' + Math.round(annualSavings) + ' €';
    document.getElementById('surplus-revenue').textContent = '+' + surplusRevenue + ' €';
    document.getElementById('state-aids').textContent = '-' + totalAids.toLocaleString('fr-FR') + ' €';
    document.getElementById('roi-years').textContent = roiYears + ' ans';
    document.getElementById('total-cost').textContent = totalCost.toLocaleString('fr-FR') + ' €';
    document.getElementById('total-aids').textContent = '-' + totalAids.toLocaleString('fr-FR') + ' €';
    document.getElementById('net-cost').textContent = netCost.toLocaleString('fr-FR') + ' €';
    document.getElementById('autonomy-percent').textContent = totalCoverage + '%';
    document.getElementById('edf-percent').textContent = edfCoverage + '%';
    
    // Mise à jour graphique
    updateChartData(edfCoverage, solarCoverage, batteryCoverage, windCoverage);
}

function updateChart() {
    // Géré par calculateResults
}

function updateChartData(edf, solar, battery, wind) {
    if (energyChart) {
        const data = [];
        const labels = [];
        const colors = [];
        
        if (edf > 0) {
            data.push(edf);
            labels.push('Réseau EDF');
            colors.push('#EF4444');
        }
        
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
        energyChart.update('none');
    }
}

function getSolarCoefficient(postalCode) {
    if (!postalCode || postalCode.length < 2) return CONSTANTS.SOLAR_COEFFICIENTS.default;
    const dept = postalCode.substring(0, 2);
    return CONSTANTS.SOLAR_COEFFICIENTS[dept] || CONSTANTS.SOLAR_COEFFICIENTS.default;
}

function getWindCoefficient(postalCode) {
    if (!postalCode || postalCode.length < 2) return CONSTANTS.WIND_COEFFICIENTS.default;
    const dept = postalCode.substring(0, 2);
    return CONSTANTS.WIND_COEFFICIENTS[dept] || CONSTANTS.WIND_COEFFICIENTS.default;
}

// Navigation
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
    
    // Progress bar
    const progress = (stepNumber / 3) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('current-step-number').textContent = stepNumber;
    
    // Indicateurs
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
    
    // Connecteurs
    document.querySelectorAll('.connector').forEach((connector, index) => {
        if (index < stepNumber - 1) {
            connector.classList.add('active');
        } else {
            connector.classList.remove('active');
        }
    });
    
    currentStep = stepNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLeadForm() {
    document.getElementById('step-3').style.display = 'none';
    document.getElementById('lead-form').style.display = 'block';
    
    // Pré-remplir code postal
    document.getElementById('lead-postal').value = simulationData.postalCode;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const leadData = {
        firstname: document.getElementById('lead-firstname').value,
        lastname: document.getElementById('lead-lastname').value,
        email: document.getElementById('lead-email').value,
        phone: document.getElementById('lead-phone').value,
        postalCode: document.getElementById('lead-postal').value,
        simulation: {
            monthlyBill: simulationData.monthlyBill,
            annualConsumption: simulationData.annualConsumption,
            roofSurface: simulationData.roofSurface,
            equipment: simulationData.equipment,
            hasBattery: simulationData.hasBattery,
            hasWind: simulationData.hasWind,
            hasCharger: simulationData.hasCharger
        }
    };
    
    console.log('Lead capturé:', leadData);
    
    // TODO: Envoyer vers Make.com ou votre webhook
    // fetch('https://hook.eu1.make.com/YOUR_WEBHOOK', {
    //     method: 'POST',
    //     body: JSON.stringify(leadData)
    // });
    
    alert('Merci ! Votre demande d\'étude détaillée a été envoyée.\n\nUn expert vous recontacte sous 24h.');
    
    // Optionnel: Rediriger vers page de remerciement
    // window.location.href = '/merci.html';
}
