# Structure du Projet Independance-energetique.fr

```
independance-energetique/
├── index.html                          # Page d'accueil
├── simulateur.html                     # Page simulateur ROI
├── contact.html                        # Page contact
├── a-propos.html                       # Page équipe/auteurs
├── mentions-legales.html               # Mentions légales
├── politique-confidentialite.html     # RGPD
├── css/
│   ├── styles.css                      # Styles principaux
│   ├── reset.css                       # Reset CSS
│   └── responsive.css                  # Media queries
├── js/
│   ├── main.js                         # Scripts globaux
│   ├── simulateur.js                   # Calculateur ROI
│   ├── forms.js                        # Gestion formulaires
│   └── navigation.js                   # Menu mobile
├── blog/
│   ├── index.html                      # Liste des articles
│   ├── batterie-domestique-guide-complet-2024.html
│   └── rentabilite-solaire-autoconsommation.html
├── produits/
│   ├── panneaux-solaires.html
│   ├── batteries-domestiques.html
│   ├── bornes-recharge.html
│   └── eolien-domestique.html
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-bg.jpg
│   │   └── auteurs/
│   │       ├── marc-l.jpg
│   │       └── sophie-d.jpg
│   └── icons/
│       ├── solar.svg
│       ├── battery.svg
│       ├── charging.svg
│       └── wind.svg
├── data/
│   └── schema-org.json                 # Données structurées
└── README.md                           # Instructions déploiement
```

## Automatisation Make.com - Identifiants d'ancrage

### Formulaires
- `#lead-form-simulateur` - Formulaire principal de capture
- `#lead-form-contact` - Formulaire page contact
- `.lead-name` - Champ nom
- `.lead-email` - Champ email
- `.lead-phone` - Champ téléphone
- `.lead-consumption` - Consommation annuelle
- `.lead-roof-surface` - Surface de toit
- `.lead-rgpd-consent` - Case consentement RGPD

### Résultats Simulateur
- `#simulation-results` - Bloc résultats
- `.roi-value` - Valeur ROI
- `.economies-annuelles` - Économies estimées
- `.aides-etat` - Montant aides
- `.temps-amortissement` - Temps amortissement

### Navigation
- `#sticky-cta` - Bouton sticky
- `#main-nav` - Navigation principale
- `.blog-article` - Articles de blog
- `.product-card` - Cartes produits
