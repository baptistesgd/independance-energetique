/**
 * Simulateur ROI - Calcul interactif d'économies et retour sur investissement
 * Independance-energetique.fr
 */

(function() {
    'use strict';
    
    // ============================================
    // CONSTANTES & CONFIGURATION
    // ============================================
    
    const CONFIG = {
        // Prix moyens 2025
        PRIX_KWH_MOYEN: 0.23, // €/kWh (tarif régulé + ARENH)
        PRIX_PANNEAU_PAR_KWC: 2800, // €/kWc installé (incluant main d'œuvre)
        PRIX_BATTERIE_PAR_KWH: 800, // €/kWh de capacité
        PRIX_ONDULEUR: 1500, // € (moyen)
        
        // Rendements et production
        PRODUCTION_KWH_PAR_KWC: {
            nord: 900,
            centre: 1000,
            sud: 1100
        },
        
        // Taux d'autoconsommation selon batterie
        TAUX_AUTOCONSO_SANS_BATTERIE: 0.35,
        TAUX_AUTOCONSO_AVEC_BATTERIE: 0.75,
        
        // Aides d'État 2025
        PRIME_AUTOCONSO_PAR_KWC: {
            '0-3': 380,
            '3-9': 280,
            '9-36': 160,
            '36-100': 80
        },
        
        PRIX_RACHAT_SURPLUS: 0.13, // €/kWh
        
        // TVA
        TVA_REDUITE_SEUIL_KWC: 3,
        TVA_NORMALE: 0.20,
        TVA_REDUITE: 0.055,
        
        // Inflation et évolution
        INFLATION_ELECTRICITE: 0.08, // 8% par an (estimation conservatrice)
        DEGRADATION_PANNEAUX: 0.005, // 0.5% par an
        
        // Durées
        DUREE_GARANTIE_PANNEAUX: 25, // ans
        DUREE_VIE_BATTERIE: 10, // ans
        DUREE_SIMULATION: 25 // ans
    };
    
    // ============================================
    // ÉTAT DU SIMULATEUR
    // ============================================
    
    const state = {
        consommation: 6000, // kWh/an
        surfaceToit: 30, // m²
        region: 'centre',
        avecBatterie: false,
        capaciteBatterie: 10, // kWh
        puissanceInstallation: 0, // kWc (calculé)
        coutTotal: 0,
        economiesAnnuelles: 0,
        aidesEtat: 0,
        tempsAmortissement: 0,
        roiTotal: 0,
        tauxAutoconsommation: 0
    };
    
    // ============================================
    // CALCULS
    // ============================================
    
    function calculerPuissanceInstallation(surface) {
        // 1 kWc nécessite environ 5-6 m² de panneaux
        // On prend 5.5m² en moyenne
        return Math.floor((surface / 5.5) * 10) / 10; // Arrondi à 0.1 près
    }
    
    function calculerPrimeAutoconso(puissance) {
        let tarifPrime = 0;
        
        if (puissance <= 3) {
            tarifPrime = CONFIG.PRIME_AUTOCONSO_PAR_KWC['0-3'];
        } else if (puissance <= 9) {
            tarifPrime = CONFIG.PRIME_AUTOCONSO_PAR_KWC['3-9'];
        } else if (puissance <= 36) {
            tarifPrime = CONFIG.PRIME_AUTOCONSO_PAR_KWC['9-36'];
        } else {
            tarifPrime = CONFIG.PRIME_AUTOCONSO_PAR_KWC['36-100'];
        }
        
        return puissance * tarifPrime;
    }
    
    function calculerTVA(puissance) {
        return puissance <= CONFIG.TVA_REDUITE_SEUIL_KWC 
            ? CONFIG.TVA_REDUITE 
            : CONFIG.TVA_NORMALE;
    }
    
    function calculerCoutInstallation(puissance, avecBatterie, capaciteBatterie) {
        let coutHT = 0;
        
        // Coût panneaux + installation
        coutHT += puissance * CONFIG.PRIX_PANNEAU_PAR_KWC;
        
        // Onduleur
        coutHT += CONFIG.PRIX_ONDULEUR;
        
        // Batterie optionnelle
        if (avecBatterie) {
            coutHT += capaciteBatterie * CONFIG.PRIX_BATTERIE_PAR_KWH;
        }
        
        // TVA
        const tva = calculerTVA(puissance);
        const coutTTC = coutHT * (1 + tva);
        
        return {
            coutHT,
            coutTTC,
            tva
        };
    }
    
    function calculerProduction(puissance, region) {
        const productionParKWc = CONFIG.PRODUCTION_KWH_PAR_KWC[region] || CONFIG.PRODUCTION_KWH_PAR_KWC.centre;
        return puissance * productionParKWc;
    }
    
    function calculerEconomies(production, consommation, avecBatterie) {
        const tauxAutoconso = avecBatterie 
            ? CONFIG.TAUX_AUTOCONSO_AVEC_BATTERIE 
            : CONFIG.TAUX_AUTOCONSO_SANS_BATTERIE;
        
        // Énergie autoconsommée
        const energieAutoconso = Math.min(production * tauxAutoconso, consommation);
        
        // Surplus vendu
        const surplus = Math.max(0, production - energieAutoconso);
        
        // Économies
        const economieAutoconso = energieAutoconso * CONFIG.PRIX_KWH_MOYEN;
        const revenusVente = surplus * CONFIG.PRIX_RACHAT_SURPLUS;
        
        const economiesAnnuelles = economieAutoconso + revenusVente;
        
        return {
            economiesAnnuelles,
            energieAutoconso,
            surplus,
            tauxAutoconso: (energieAutoconso / production) * 100
        };
    }
    
    function calculerROI(coutTTC, aidesEtat, economiesAnnuelles) {
        const investissementNet = coutTTC - aidesEtat;
        
        // Calcul simple du temps d'amortissement
        const tempsAmortissement = investissementNet / economiesAnnuelles;
        
        // ROI sur 25 ans avec inflation
        let roiTotal = -investissementNet;
        let productionActuelle = 1.0;
        
        for (let annee = 1; annee <= CONFIG.DUREE_SIMULATION; annee++) {
            // Dégradation des panneaux
            productionActuelle *= (1 - CONFIG.DEGRADATION_PANNEAUX);
            
            // Inflation du prix de l'électricité
            const prixElecAnnee = CONFIG.PRIX_KWH_MOYEN * Math.pow(1 + CONFIG.INFLATION_ELECTRICITE, annee - 1);
            
            // Économies de l'année
            const economiesAnnee = economiesAnnuelles * productionActuelle * (prixElecAnnee / CONFIG.PRIX_KWH_MOYEN);
            
            roiTotal += economiesAnnee;
            
            // Coût remplacement batterie à 10 ans
            if (annee === 10 && state.avecBatterie) {
                roiTotal -= state.capaciteBatterie * CONFIG.PRIX_BATTERIE_PAR_KWH;
            }
        }
        
        return {
            tempsAmortissement,
            roiTotal
        };
    }
    
    function calculerSimulation() {
        // Calcul puissance
        state.puissanceInstallation = calculerPuissanceInstallation(state.surfaceToit);
        
        // Calcul coût
        const couts = calculerCoutInstallation(
            state.puissanceInstallation, 
            state.avecBatterie, 
            state.capaciteBatterie
        );
        state.coutTotal = couts.coutTTC;
        
        // Calcul aides
        state.aidesEtat = calculerPrimeAutoconso(state.puissanceInstallation);
        
        // MaPrimeRénov' Rénovation Globale (si applicable)
        // Ajout simplifié : 1000€ si installation > 6 kWc
        if (state.puissanceInstallation > 6) {
            state.aidesEtat += 1000;
        }
        
        // Calcul production
        const production = calculerProduction(state.puissanceInstallation, state.region);
        
        // Calcul économies
        const resultatsEconomies = calculerEconomies(
            production, 
            state.consommation, 
            state.avecBatterie
        );
        state.economiesAnnuelles = resultatsEconomies.economiesAnnuelles;
        state.tauxAutoconsommation = resultatsEconomies.tauxAutoconso;
        
        // Calcul ROI
        const resultatsROI = calculerROI(
            state.coutTotal, 
            state.aidesEtat, 
            state.economiesAnnuelles
        );
        state.tempsAmortissement = resultatsROI.tempsAmortissement;
        state.roiTotal = resultatsROI.roiTotal;
    }
    
    // ============================================
    // AFFICHAGE DES RÉSULTATS
    // ============================================
    
    function afficherResultats() {
        const resultsContainer = document.getElementById('simulation-results');
        if (!resultsContainer) return;
        
        resultsContainer.classList.add('visible');
        
        // Mise à jour des valeurs
        updateValue('.roi-value', formatCurrency(state.roiTotal));
        updateValue('.economies-annuelles', formatCurrency(state.economiesAnnuelles));
        updateValue('.aides-etat', formatCurrency(state.aidesEtat));
        updateValue('.temps-amortissement', `${state.tempsAmortissement.toFixed(1)} ans`);
        updateValue('.cout-installation', formatCurrency(state.coutTotal));
        updateValue('.puissance-installation', `${state.puissanceInstallation} kWc`);
        updateValue('.taux-autoconso', `${state.tauxAutoconsommation.toFixed(0)}%`);
        
        // Animation des chiffres
        animateNumbers();
        
        // Afficher le formulaire de contact
        setTimeout(() => {
            const leadForm = document.getElementById('lead-form-simulateur');
            if (leadForm) {
                leadForm.classList.add('visible');
            }
        }, 500);
    }
    
    function updateValue(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    function animateNumbers() {
        const elements = document.querySelectorAll('[data-animate-number]');
        
        elements.forEach(el => {
            const finalValue = parseFloat(el.textContent.replace(/[^\d.-]/g, ''));
            const duration = 1000;
            const steps = 30;
            const increment = finalValue / steps;
            let currentValue = 0;
            let step = 0;
            
            const timer = setInterval(() => {
                currentValue += increment;
                step++;
                
                if (step >= steps) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                
                el.textContent = formatCurrency(currentValue);
            }, duration / steps);
        });
    }
    
    // ============================================
    // GESTION DU FORMULAIRE
    // ============================================
    
    function initFormInputs() {
        // Consommation slider
        const consommationSlider = document.getElementById('consommation-slider');
        const consommationValue = document.getElementById('consommation-value');
        
        if (consommationSlider) {
            consommationSlider.addEventListener('input', (e) => {
                state.consommation = parseInt(e.target.value);
                consommationValue.textContent = `${state.consommation.toLocaleString('fr-FR')} kWh/an`;
            });
        }
        
        // Surface toit slider
        const surfaceSlider = document.getElementById('surface-slider');
        const surfaceValue = document.getElementById('surface-value');
        
        if (surfaceSlider) {
            surfaceSlider.addEventListener('input', (e) => {
                state.surfaceToit = parseInt(e.target.value);
                surfaceValue.textContent = `${state.surfaceToit} m²`;
            });
        }
        
        // Région select
        const regionSelect = document.getElementById('region-select');
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                state.region = e.target.value;
            });
        }
        
        // Batterie checkbox
        const batterieCheckbox = document.getElementById('batterie-checkbox');
        const batterieOptions = document.getElementById('batterie-options');
        
        if (batterieCheckbox) {
            batterieCheckbox.addEventListener('change', (e) => {
                state.avecBatterie = e.target.checked;
                if (batterieOptions) {
                    batterieOptions.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }
        
        // Capacité batterie slider
        const batterieSlider = document.getElementById('batterie-slider');
        const batterieValue = document.getElementById('batterie-value');
        
        if (batterieSlider) {
            batterieSlider.addEventListener('input', (e) => {
                state.capaciteBatterie = parseInt(e.target.value);
                batterieValue.textContent = `${state.capaciteBatterie} kWh`;
            });
        }
    }
    
    function initSimulatorForm() {
        const form = document.getElementById('simulator-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Calculer
            calculerSimulation();
            
            // Afficher résultats
            afficherResultats();
            
            // Scroll vers résultats
            const results = document.getElementById('simulation-results');
            if (results) {
                results.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Tracking
            if (window.trackEvent) {
                window.trackEvent('Simulateur', 'calculate', 'ROI Calculation');
            }
        });
    }
    
    // ============================================
    // FORMULAIRE LEADS
    // ============================================
    
    function initLeadForm() {
        const leadForm = document.getElementById('lead-form-simulateur');
        if (!leadForm) return;
        
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nom: document.querySelector('.lead-name').value,
                email: document.querySelector('.lead-email').value,
                telephone: document.querySelector('.lead-phone').value,
                consommation: state.consommation,
                surfaceToit: state.surfaceToit,
                region: state.region,
                avecBatterie: state.avecBatterie,
                economiesEstimees: state.economiesAnnuelles,
                roiEstime: state.roiTotal,
                consentement: document.querySelector('.lead-rgpd-consent').checked,
                timestamp: new Date().toISOString()
            };
            
            // Validation
            if (!formData.consentement) {
                alert('Vous devez accepter la politique de confidentialité');
                return;
            }
            
            // Envoyer les données (à configurer avec Make.com ou autre)
            try {
                const submitButton = leadForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';
                
                // Simuler l'envoi (remplacer par vraie API)
                await sendLeadData(formData);
                
                // Succès
                showSuccessMessage();
                leadForm.reset();
                
                // Tracking
                if (window.trackEvent) {
                    window.trackEvent('Lead', 'submit', 'Simulateur Form');
                }
            } catch (error) {
                console.error('Erreur envoi lead:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    }
    
    async function sendLeadData(data) {
        // À CONFIGURER : Endpoint Make.com ou autre webhook
        const WEBHOOK_URL = 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID';
        
        // Pour le développement, on log juste les données
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Lead Data:', data);
            return new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // En production, envoyer à Make.com
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Erreur serveur');
        }
        
        return response.json();
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3>Demande envoyée avec succès !</h3>
                <p>Nous vous contacterons dans les plus brefs délais pour affiner votre projet.</p>
            </div>
        `;
        
        const leadForm = document.getElementById('lead-form-simulateur');
        if (leadForm) {
            leadForm.parentNode.insertBefore(successDiv, leadForm);
            leadForm.style.display = 'none';
        }
        
        setTimeout(() => {
            successDiv.style.opacity = '1';
            successDiv.style.transform = 'scale(1)';
        }, 10);
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        initFormInputs();
        initSimulatorForm();
        initLeadForm();
        
        console.log('✅ Simulateur initialized');
    }
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Exposer l'état pour debug
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.simulatorState = state;
    }
    
})();
