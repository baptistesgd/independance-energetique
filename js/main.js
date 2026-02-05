/**
 * Main JavaScript - Independance-energetique.fr
 * Gère les animations, le scroll, et les interactions globales
 */

(function() {
    'use strict';
    
    // ============================================
    // INTERSECTION OBSERVER - Animations au scroll
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                // Optionnel : déconnecter après animation pour meilleures perfs
                // animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments avec data-animate
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            animateOnScroll.observe(el);
        });
    }
    
    // ============================================
    // STICKY CTA BUTTON
    // ============================================
    
    function initStickyCTA() {
        const stickyCTA = document.getElementById('sticky-cta');
        if (!stickyCTA) return;
        
        stickyCTA.addEventListener('click', () => {
            window.location.href = '/simulateur.html';
        });
        
        // Cacher le bouton sticky en haut de page
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll < 300) {
                stickyCTA.style.opacity = '0';
                stickyCTA.style.pointerEvents = 'none';
            } else {
                stickyCTA.style.opacity = '1';
                stickyCTA.style.pointerEvents = 'auto';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // ============================================
    // SMOOTH SCROLL POUR ANCRES
    // ============================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorer les ancres vides ou juste "#"
                if (href === '#' || href === '') {
                    e.preventDefault();
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 6px rgba(10, 14, 26, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // ============================================
    // PERFORMANCE - Lazy Loading Images
    // ============================================
    
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Le navigateur supporte le lazy loading natif
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback pour navigateurs plus anciens
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ============================================
    // UTILITIES
    // ============================================
    
    // Debounce function pour optimiser les events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function pour optimiser le scroll
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ============================================
    // ANALYTICS TRACKING (optionnel)
    // ============================================
    
    function trackEvent(category, action, label) {
        // Placeholder pour Google Analytics ou autre
        if (window.gtag) {
            window.gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Log en développement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Analytics Event:', { category, action, label });
        }
    }
    
    // Tracker les clics sur les CTA principaux
    function initCTATracking() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .nav-link-cta');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const label = btn.textContent.trim() || btn.getAttribute('aria-label');
                trackEvent('CTA', 'click', label);
            });
        });
    }
    
    // ============================================
    // ACCESSIBILITY IMPROVEMENTS
    // ============================================
    
    function initAccessibility() {
        // Gestion du focus clavier pour skip link
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.addEventListener('blur', () => {
                        target.removeAttribute('tabindex');
                    }, { once: true });
                }
            });
        }
        
        // Ajouter des labels ARIA dynamiques si nécessaires
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (!link.getAttribute('aria-label') && link.textContent) {
                link.setAttribute('aria-label', `Naviguer vers ${link.textContent.trim()}`);
            }
        });
    }
    
    // ============================================
    // COOKIE CONSENT (Placeholder RGPD)
    // ============================================
    
    function initCookieConsent() {
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem('cookie-consent');
        
        if (!consent) {
            // Afficher la bannière de cookies
            // À implémenter selon les besoins
            console.log('Cookie consent required');
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        console.log('🚀 Independance-energetique.fr - Scripts loaded');
        
        initAnimations();
        initStickyCTA();
        initSmoothScroll();
        initHeaderScroll();
        initLazyLoading();
        initCTATracking();
        initAccessibility();
        // initCookieConsent(); // Décommenter si nécessaire
        
        // Log de démarrage pour debug
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Development mode - All scripts initialized');
        }
    }
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Exposer certaines fonctions globalement si nécessaire
    window.trackEvent = trackEvent;
    
})();
