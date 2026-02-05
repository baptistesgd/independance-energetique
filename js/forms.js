/**
 * Gestion des formulaires - Validation et soumission
 */
(function() {
    'use strict';
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        return re.test(phone.replace(/\s/g, ''));
    }
    
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = form.querySelector('input[type="email"]');
                const phone = form.querySelector('input[type="tel"]');
                
                let isValid = true;
                
                if (email && !validateEmail(email.value)) {
                    email.classList.add('error');
                    isValid = false;
                } else if (email) {
                    email.classList.remove('error');
                }
                
                if (phone && !validatePhone(phone.value)) {
                    phone.classList.add('error');
                    isValid = false;
                } else if (phone) {
                    phone.classList.remove('error');
                }
                
                if (isValid) {
                    form.submit();
                }
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }
})();
