# 🚀 Guide de Déploiement - Independance-energetique.fr

## ✅ Contenu du Package

Le site est **100% prêt à déployer**. Voici ce qui est inclus :

### Pages HTML (8 fichiers)
- ✓ `index.html` - Page d'accueil complète avec hero, solutions, CTA
- ✓ `simulateur.html` - Calculateur ROI interactif avec formulaire lead
- ✓ `mentions-legales.html` - Mentions légales conformes
- ✓ `politique-confidentialite.html` - RGPD complet
- ✓ `blog/index.html` - Liste des articles
- ✓ `blog/batterie-domestique-guide-complet-2024.html` - Article 1 (1000+ mots)
- ✓ `blog/rentabilite-solaire-autoconsommation.html` - Article 2 (1000+ mots)

### CSS (3 fichiers)
- ✓ `css/reset.css` - Normalisation cross-browser
- ✓ `css/styles.css` - Design moderne avec variables CSS, animations
- ✓ `css/responsive.css` - Mobile-first, breakpoints optimisés

### JavaScript (4 fichiers)
- ✓ `js/main.js` - Scripts globaux, animations scroll, accessibility
- ✓ `js/navigation.js` - Menu mobile, navigation
- ✓ `js/simulateur.js` - Calculateur ROI complet avec formules réelles
- ✓ `js/forms.js` - Validation formulaires

### Configuration
- ✓ `.gitignore` - Prêt pour Git
- ✓ `vercel.json` - Configuration Vercel
- ✓ `README.md` - Documentation complète

## 📦 Décompression

```bash
tar -xzf independance-energetique.tar.gz
cd independance-energetique
```

## 🚀 Options de Déploiement

### Option 1 : Vercel (Recommandé - 2 min)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Production
vercel --prod
```

**URL finale :** `https://independance-energetique.vercel.app`

### Option 2 : Netlify (3 min)

1. Créer compte sur https://netlify.com
2. "Add new site" > "Deploy manually"
3. Drag & drop le dossier décompressé
4. ✅ Déployé !

### Option 3 : GitHub Pages (5 min)

```bash
# Initialiser Git
git init
git add .
git commit -m "Site initial"

# Créer repo GitHub puis
git remote add origin https://github.com/USERNAME/independance-energetique.git
git push -u origin main

# Activer GitHub Pages dans Settings > Pages
```

## ⚙️ Configuration Make.com (Capture Leads)

Dans `js/simulateur.js`, ligne 332 :

```javascript
const WEBHOOK_URL = 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID';
```

### Structure des données envoyées

```json
{
  "nom": "string",
  "email": "string",
  "telephone": "string",
  "consommation": 6000,
  "surfaceToit": 30,
  "region": "centre",
  "avecBatterie": false,
  "economiesEstimees": 1122,
  "roiEstime": 16500,
  "consentement": true,
  "timestamp": "2025-02-05T10:30:00.000Z"
}
```

### Scénario Make.com recommandé

1. **Webhook** - Réception données
2. **Router** :
   - → Google Sheets (archivage leads)
   - → Email notification (vous)
   - → CRM (HubSpot, Pipedrive...)
   - → Email confirmation (lead)

## 🎨 Personnalisation

### Couleurs (dans `css/styles.css`)

```css
:root {
    --color-primary: #0066FF;      /* Bleu principal */
    --color-secondary: #00D084;    /* Vert éco */
    --color-accent: #FFB800;       /* Jaune accent */
}
```

### Polices

- **Display (titres)** : Syne (Google Fonts)
- **Body (texte)** : Space Mono (Google Fonts)

Modifier dans `<head>` de chaque page HTML.

### Logo

Remplacer dans `assets/images/logo.svg` (ou utiliser PNG)

## 📊 Analytics (Optionnel)

Ajouter dans `<head>` de `index.html` :

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔍 SEO - Étapes Post-Déploiement

### 1. Générer Sitemap.xml

```bash
# Utiliser un générateur en ligne ou
npm install sitemap
# puis script Node.js
```

### 2. Créer robots.txt

```
User-agent: *
Allow: /
Sitemap: https://independance-energetique.fr/sitemap.xml
```

### 3. Google Search Console

1. Ajouter propriété
2. Soumettre sitemap
3. Demander indexation

## 🐛 Debug & Tests

### En local

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server
```

Ouvrir http://localhost:8000

### Console navigateur

```javascript
// Voir état simulateur
console.log(window.simulatorState);

// Tester tracking
window.trackEvent('Test', 'click', 'Debug');
```

## ✅ Checklist Pré-Production

- [ ] Remplacer webhook Make.com
- [ ] Ajouter vraies images dans `/assets/images/`
- [ ] Compléter mentions légales (SIRET, adresse)
- [ ] Configurer domaine personnalisé
- [ ] Tester formulaire lead
- [ ] Vérifier responsive mobile
- [ ] Tester PageSpeed (objectif 90+)
- [ ] Configurer Analytics

## 📧 Support

Questions ? → contact@independance-energetique.fr

## 📄 Licence

Propriétaire - Independance-energetique.fr © 2025
Tous droits réservés.

---

**🎉 Félicitations ! Votre site est prêt à conquérir le web énergétique français !**
