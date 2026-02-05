/**
 * Navigation JavaScript - Menu Mobile & Interactions
 */

(function() {
    'use strict';
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;
        
        // Toggle menu
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Empêcher le scroll du body quand le menu est ouvert
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu quand on clique sur un lien
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Fermer le menu avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });
        
        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ============================================
    // ACTIVE LINK HIGHLIGHTING
    // ============================================
    
    function highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            if (currentPath === linkPath || 
                (currentPath === '/' && linkPath === '/') ||
                (currentPath.includes(linkPath) && linkPath !== '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    // ============================================
    // SUBMENU HOVER (si nécessaire pour version desktop)
    // ============================================
    
    function initSubmenuHover() {
        const navItems = document.querySelectorAll('.nav-menu > li');
        
        navItems.forEach(item => {
            const submenu = item.querySelector('.submenu');
            if (!submenu) return;
            
            let timeout;
            
            item.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                submenu.style.display = 'block';
                setTimeout(() => {
                    submenu.classList.add('visible');
                }, 10);
            });
            
            item.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    submenu.classList.remove('visible');
                    setTimeout(() => {
                        submenu.style.display = 'none';
                    }, 200);
                }, 100);
            });
        });
    }
    
    // ============================================
    // RESIZE HANDLER
    // ============================================
    
    function handleResize() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth > 768) {
            // Desktop - Réinitialiser le menu mobile
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    }
    
    // Debounce resize event
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });
    
    // ============================================
    // HEADER STICKY BEHAVIOR (Optionnel)
    // ============================================
    
    function initStickyHeader() {
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        let lastScroll = 0;
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Ajouter une classe quand on scrolle vers le bas
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
                
                // Masquer le header en scrollant vers le bas (optionnel)
                if (currentScroll > lastScroll && currentScroll > 300) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove('scrolled');
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    // ============================================
    // SEARCH FUNCTIONALITY (si nécessaire)
    // ============================================
    
    function initSearch() {
        const searchToggle = document.querySelector('.search-toggle');
        const searchOverlay = document.querySelector('.search-overlay');
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.querySelector('.search-close');
        
        if (!searchToggle || !searchOverlay) return;
        
        // Ouvrir la recherche
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
        });
        
        // Fermer la recherche
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
            });
        }
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
    
    // ============================================
    // BREADCRUMB GENERATION (pour pages internes)
    // ============================================
    
    function generateBreadcrumb() {
        const breadcrumbContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbContainer) return;
        
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        let breadcrumbHTML = '<a href="/">Accueil</a>';
        let currentPath = '';
        
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            const label = segment
                .replace(/-/g, ' ')
                .replace(/\.html$/, '')
                .replace(/^\w/, c => c.toUpperCase());
            
            if (isLast) {
                breadcrumbHTML += ` <span class="breadcrumb-separator">›</span> <span class="breadcrumb-current">${label}</span>`;
            } else {
                breadcrumbHTML += ` <span class="breadcrumb-separator">›</span> <a href="${currentPath}">${label}</a>`;
            }
        });
        
        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        initMobileMenu();
        highlightActiveLink();
        // initSubmenuHover(); // Activer si nécessaire
        // initStickyHeader(); // Activer si nécessaire
        // initSearch(); // Activer si nécessaire
        // generateBreadcrumb(); // Activer pour pages internes
        
        console.log('✅ Navigation initialized');
    }
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
