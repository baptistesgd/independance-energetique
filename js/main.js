/**
 * PÔLE ÉNERGIE & AUTONOMIE - JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // CONSTANTES ET CONFIGURATION
    // ============================================
    
    const CONFIG = {
        PRIX_KWH: 0.2516,
        PRODUCTION_REGION: {
            nord: 1000,
            centre: 1200,
            sud: 1400
        },
        RENDEMENT: 0.85,
        SURFACE_PAR_KWC: 6,
        COUT_KWC: 2200,
        COUT_BATTERIE_KWH: 600,
        COUT_BORNE: 2000,
        PRIME_3KWC: 370,
        PRIME_9KWC: 280,
        TAUX_AUTO_SANS_BATTERIE: 0.35,
        TAUX_AUTO_AVEC_BATTERIE: 0.70,
        TARIF_RACHAT: 0.13,
        INFLATION: 0.04,
        CONSO_VE: 17
    };

    // ============================================
    // ÉTAT DU SIMULATEUR
    // ============================================
    
    let simulatorState = {
        budget: 1800,
        surface: 50,
        region: 'centre',
        withBattery: false,
        batteryCapacity: 10,
        withEV: false,
        kmAnnual: 15000,
        step: 1
    };

    // ============================================
    // FONCTIONS DE CALCUL
    // ============================================
    
    function calculateResults() {
        const { budget, surface, region, withBattery, batteryCapacity, withEV, kmAnnual } = simulatorState;
        
        // Consommation annuelle estimée
        const consoAnnuelle = budget / CONFIG.PRIX_KWH;
        
        // Puissance max selon surface
        const puissanceMaxSurface = surface / CONFIG.SURFACE_PAR_KWC;
        
        // Production par kWc selon région
        const productionParKwc = CONFIG.PRODUCTION_REGION[region];
        
        // Taux autoconsommation
        const tauxAutoconso = withBattery ? CONFIG.TAUX_AUTO_AVEC_BATTERIE : CONFIG.TAUX_AUTO_SANS_BATTERIE;
        
        // Puissance recommandée
        const puissanceIdeale = consoAnnuelle / (productionParKwc * tauxAutoconso * 0.8);
        const puissanceRecommandee = Math.min(Math.max(3, Math.round(puissanceIdeale * 10) / 10), puissanceMaxSurface, 36);
        
        // Production annuelle
        const productionAnnuelle = puissanceRecommandee * productionParKwc * CONFIG.RENDEMENT;
        
        // Économies
        const energieAutoconsommee = productionAnnuelle * tauxAutoconso;
        const energieSurplus = productionAnnuelle * (1 - tauxAutoconso);
        const economiesAutoconso = energieAutoconsommee * CONFIG.PRIX_KWH;
        const reventesSurplus = energieSurplus * CONFIG.TARIF_RACHAT;
        
        // Économies VE
        let economiesVE = 0;
        if (withEV) {
            const consoVE = (kmAnnual / 100) * CONFIG.CONSO_VE;
            const chargeVESolaire = withBattery ? consoVE * 0.6 : consoVE * 0.3;
            economiesVE = chargeVESolaire * CONFIG.PRIX_KWH;
        }
        
        const economiesAnnuelles = economiesAutoconso + reventesSurplus + economiesVE;
        
        // Économies cumulées sur 25 ans
        let cumul = 0;
        let eco = economiesAnnuelles;
        for (let i = 0; i < 25; i++) {
            cumul += eco;
            eco *= (1 + CONFIG.INFLATION);
        }
        
        // Coûts
        const coutInstallation = puissanceRecommandee * CONFIG.COUT_KWC;
        const coutBatterie = withBattery ? batteryCapacity * CONFIG.COUT_BATTERIE_KWH : 0;
        const coutBorne = withEV ? CONFIG.COUT_BORNE : 0;
        const coutTotal = coutInstallation + coutBatterie + coutBorne;
        
        // Prime autoconsommation
        let prime = 0;
        if (puissanceRecommandee <= 3) {
            prime = puissanceRecommandee * CONFIG.PRIME_3KWC;
        } else if (puissanceRecommandee <= 9) {
            prime = puissanceRecommandee * CONFIG.PRIME_9KWC;
        } else {
            prime = puissanceRecommandee * 200;
        }
        
        const coutNet = coutTotal - prime;
        const roi = coutNet / economiesAnnuelles;
        const gainTotal = cumul - coutNet;
        
        return {
            puissance: Math.round(puissanceRecommandee * 10) / 10,
            production: Math.round(productionAnnuelle),
            economiesAnnuelles: Math.round(economiesAnnuelles),
            economiesCumulees: Math.round(cumul),
            coutTotal: Math.round(coutTotal),
            coutNet: Math.round(coutNet),
            roi: Math.round(roi * 10) / 10,
            gainTotal: Math.round(gainTotal),
            tauxAutoconso: Math.round(tauxAutoconso * 100)
        };
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    }

    function formatNumber(value) {
        return new Intl.NumberFormat('fr-FR').format(value);
    }

    // ============================================
    // MISE À JOUR DE L'INTERFACE
    // ============================================
    
    function updateResults() {
        const results = calculateResults();
        
        // Résultats step 1
        document.getElementById('result-power').textContent = results.puissance + ' kWc';
        document.getElementById('result-savings').textContent = formatCurrency(results.economiesAnnuelles);
        document.getElementById('result-roi').textContent = results.roi + ' ans';
        document.getElementById('result-total').textContent = formatCurrency(results.gainTotal);
        
        // Recap step 2
        document.getElementById('recap-power').textContent = results.puissance + ' kWc';
        document.getElementById('recap-savings').textContent = formatCurrency(results.economiesAnnuelles) + '/an';
        document.getElementById('recap-cost').textContent = formatCurrency(results.coutNet) + ' *';
        
        // Options dans le recap
        let options = '';
        if (simulatorState.withBattery) {
            options += ' • + Batterie ' + simulatorState.batteryCapacity + 'kWh';
        }
        if (simulatorState.withEV) {
            options += ' • + Borne VE';
        }
        document.getElementById('recap-options').textContent = options;
        
        // Final step 3
        document.getElementById('final-power').textContent = results.puissance + ' kWc';
        document.getElementById('final-production').textContent = formatNumber(results.production) + ' kWh';
        document.getElementById('final-savings').textContent = formatCurrency(results.economiesAnnuelles);
        document.getElementById('final-cost').textContent = formatCurrency(results.coutNet);
        document.getElementById('final-roi').textContent = results.roi + ' ans';
        document.getElementById('final-total').textContent = formatCurrency(results.gainTotal);
    }

    // ============================================
    // GESTIONNAIRES D'ÉVÉNEMENTS - SIMULATEUR
    // ============================================
    
    // Budget slider
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', function() {
            simulatorState.budget = parseInt(this.value);
            budgetValue.textContent = formatCurrency(simulatorState.budget);
            updateResults();
        });
    }

    // Surface slider
    const surfaceSlider = document.getElementById('surface');
    const surfaceValue = document.getElementById('surface-value');
    if (surfaceSlider) {
        surfaceSlider.addEventListener('input', function() {
            simulatorState.surface = parseInt(this.value);
            surfaceValue.textContent = simulatorState.surface + ' m²';
            updateResults();
        });
    }

    // Region buttons
    const regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            regionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            simulatorState.region = this.dataset.region;
            updateResults();
        });
    });

    // Battery option
    const batteryCheckbox = document.getElementById('with-battery');
    const batteryCard = document.getElementById('option-battery');
    const batterySlider = document.getElementById('battery-capacity');
    const batteryValue = document.getElementById('battery-value');
    
    if (batteryCheckbox) {
        batteryCheckbox.addEventListener('change', function() {
            simulatorState.withBattery = this.checked;
            batteryCard.classList.toggle('active', this.checked);
            updateResults();
        });
    }
    
    if (batterySlider) {
        batterySlider.addEventListener('input', function() {
            simulatorState.batteryCapacity = parseInt(this.value);
            batteryValue.textContent = simulatorState.batteryCapacity + ' kWh';
            updateResults();
        });
    }

    // EV option
    const evCheckbox = document.getElementById('with-ev');
    const evCard = document.getElementById('option-ev');
    const kmSlider = document.getElementById('km-annual');
    const kmValue = document.getElementById('km-value');
    
    if (evCheckbox) {
        evCheckbox.addEventListener('change', function() {
            simulatorState.withEV = this.checked;
            evCard.classList.toggle('active', this.checked);
            updateResults();
        });
    }
    
    if (kmSlider) {
        kmSlider.addEventListener('input', function() {
            simulatorState.kmAnnual = parseInt(this.value);
            kmValue.textContent = formatNumber(simulatorState.kmAnnual) + ' km';
            updateResults();
        });
    }

    // ============================================
    // NAVIGATION ENTRE ÉTAPES
    // ============================================
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const steps = document.querySelectorAll('.step');
    
    function goToStep(stepNum) {
        simulatorState.step = stepNum;
        
        // Hide all steps
        step1.classList.add('hidden');
        step2.classList.add('hidden');
        step3.classList.add('hidden');
        
        // Show current step
        if (stepNum === 1) step1.classList.remove('hidden');
        if (stepNum === 2) step2.classList.remove('hidden');
        if (stepNum === 3) step3.classList.remove('hidden');
        
        // Update step indicators
        steps.forEach((step, index) => {
            step.classList.toggle('active', index < stepNum);
        });
        
        // Scroll to simulator
        document.getElementById('simulateur').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Button to step 2
    const toStep2Btn = document.getElementById('to-step-2');
    if (toStep2Btn) {
        toStep2Btn.addEventListener('click', function() {
            goToStep(2);
        });
    }

    // Back to step 1
    const backToStep1Btn = document.getElementById('back-to-step-1');
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', function() {
            goToStep(1);
        });
    }

    // New simulation
    const newSimBtn = document.getElementById('new-simulation');
    if (newSimBtn) {
        newSimBtn.addEventListener('click', function() {
            // Reset form
            document.getElementById('lead-form').reset();
            goToStep(1);
        });
    }

    // ============================================
    // SOUMISSION DU FORMULAIRE
    // ============================================
    
    const leadForm = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submit-btn');
    const formError = document.getElementById('form-error');
    
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check consent
            const consentContact = document.getElementById('consent-contact').checked;
            if (!consentContact) {
                formError.textContent = 'Veuillez accepter les conditions pour continuer.';
                formError.classList.remove('hidden');
                return;
            }
            
            formError.classList.add('hidden');
            
            // Show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" fill="none"/></svg> Envoi en cours...';
            
            // Simulate API call
            setTimeout(function() {
                // Get form data
                const firstname = document.getElementById('firstname').value;
                
                // Update success message
                document.getElementById('user-firstname').textContent = firstname;
                
                // Log data (in production, send to API)
                console.log('Lead data:', {
                    firstname: firstname,
                    lastname: document.getElementById('lastname').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    zipcode: document.getElementById('zipcode').value,
                    consentPartners: document.getElementById('consent-partners').checked,
                    simulation: simulatorState,
                    results: calculateResults()
                });
                
                // Go to step 3
                goToStep(3);
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Recevoir mon étude gratuite <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
                
            }, 1500);
        });
    }

    // ============================================
    // STICKY CTA
    // ============================================
    
    const stickyCta = document.getElementById('sticky-cta');
    const simulatorSection = document.getElementById('simulateur');
    
    function updateStickyCta() {
        if (!stickyCta || !simulatorSection) return;
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const showThreshold = windowHeight * 0.5;
        
        // Check if in simulator section
        const rect = simulatorSection.getBoundingClientRect();
        const isInSimulator = rect.top < windowHeight && rect.bottom > 0;
        
        if (scrollY > showThreshold && !isInSimulator) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', updateStickyCta, { passive: true });
    updateStickyCta();

    // ============================================
    // MOBILE MENU
    // ============================================
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ============================================
    // INITIALISATION
    // ============================================
    
    updateResults();
    
});
