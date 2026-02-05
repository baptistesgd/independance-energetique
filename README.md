# Independance-energetique.fr

Site web professionnel pour solutions d'autoconsommation énergétique.

## 🚀 Déploiement Rapide

### Option 1 : Vercel (Recommandé)
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel
```

### Option 2 : GitHub Pages
```bash
# 1. Créer un repo GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/independance-energetique.git
git push -u origin main

# 2. Activer GitHub Pages dans Settings > Pages
```

### Option 3 : Netlify
```bash
# 1. Drop le dossier sur https://app.netlify.com/drop
```

## 📁 Structure

```
/
├── index.html              # Page d'accueil
├── simulateur.html         # Simulateur ROI
├── contact.html            # Contact
├── a-propos.html          # Équipe
├── mentions-legales.html   # Mentions légales
├── politique-confidentialite.html
├── css/
│   ├── reset.css
│   ├── styles.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── navigation.js
│   ├── simulateur.js
│   └── forms.js
├── blog/
│   └── *.html
└── produits/
    └── *.html
```

## ⚙️ Configuration Make.com

### Webhook URL
Dans `js/simulateur.js` ligne 332, remplacer :
```javascript
const WEBHOOK_URL = 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID';
```

### Structure des données envoyées
```json
{
  "nom": "string",
  "email": "string",
  "telephone": "string",
  "consommation": "number",
  "surfaceToit": "number",
  "region": "string",
  "avecBatterie": "boolean",
  "economiesEstimees": "number",
  "roiEstime": "number",
  "consentement": "boolean",
  "timestamp": "ISO 8601"
}
```

## 🎨 Personnalisation

### Couleurs (dans `css/styles.css`)
```css
:root {
    --color-primary: #0066FF;
    --color-secondary: #00D084;
    --color-accent: #FFB800;
}
```

### Polices
- Display : Syne (Google Fonts)
- Body : Space Mono (Google Fonts)

## 📊 Analytics

Ajouter Google Analytics dans `index.html` :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 RGPD

- Consentement obligatoire pour formulaires
- Données stockées pour partenaires uniquement
- Droit d'accès/suppression via contact

## 🐛 Debug

En local, ouvrir la console :
```javascript
// Voir l'état du simulateur
console.log(window.simulatorState);

// Voir les events trackés
window.trackEvent('Test', 'click', 'Debug');
```

## 📝 SEO

- Balises meta complètes
- Schema.org JSON-LD
- Sitemap.xml à générer
- robots.txt à configurer

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 📧 Support

contact@independance-energetique.fr

## 📄 License

Propriétaire - Independance-energetique.fr © 2025
