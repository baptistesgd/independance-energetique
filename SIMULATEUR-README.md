# Simulateur Indépendance Énergétique - Version 2026 🚀

## 📋 Description

Simulateur multi-étapes moderne et interactif permettant de calculer :
- Le taux d'autonomie énergétique
- Les économies mensuelles et annuelles
- Le retour sur investissement (ROI)
- Les aides d'État 2026
- Le mix énergétique optimal (solaire, batterie, éolien)

## ✨ Fonctionnalités

### Étape 1 : Localisation
- Saisie code postal (calcul coefficient régional d'ensoleillement)
- Sélection type de toiture (tuiles, ardoise, bac acier)

### Étape 2 : Besoins
- Slider facture mensuelle (50-500€)
- Calcul automatique consommation annuelle
- Checkboxes équipements énergivores :
  - Pompe à chaleur (+2 000 kWh/an)
  - Piscine (+1 500 kWh/an)
  - Véhicule électrique (+3 000 kWh/an)

### Étape 3 : Configuration & Résultats
- Options configurables :
  - **Panneaux solaires** (obligatoire) : 30% couverture
  - **Batterie** (+8 000€) : passe à 75% couverture
  - **Éolien** (+15 000€) : +15-20% couverture
  - **Borne recharge** (+1 200€) : recharge avec surplus

- **Graphique Doughnut en temps réel** (Chart.js) :
  - 🔴 Rouge = Réseau EDF
  - 🟡 Jaune = Solaire
  - 🟢 Vert = Batterie
  - 🔵 Bleu = Éolien

- **Cartes résultats** :
  - Économie mensuelle
  - Revenu revente surplus (0,13€/kWh)
  - Aides d'État (prime autoconso + TVA + Advenir)
  - ROI en années

## 🚀 Installation

### 1. Copier les fichiers dans votre repo GitHub

```
votre-repo/
├── simulateur.html
├── simulateur-styles.css
└── simulateur-script.js
```

### 2. Si vous avez déjà un simulateur

Remplacez simplement :
- `simulateur.html` → votre fichier existant
- Ajoutez `simulateur-styles.css` et `simulateur-script.js`

### 3. Liens à mettre à jour

Dans votre site, modifiez les liens vers le simulateur :

```html
<!-- Ancien -->
<a href="/simulateur.html">Simulateur</a>

<!-- Nouveau (reste identique) -->
<a href="/simulateur.html">Simulateur</a>
```

Le simulateur fonctionnera immédiatement après push ! ✨

## 🎨 Design

- **Mode clair** avec dégradés bleu/vert
- Cards avec ombres et effets hover
- Responsive 100% (mobile, tablet, desktop)
- Animations fluides entre les étapes
- Police Inter (Google Fonts)

## 📊 Logique de Calcul (Variables 2026)

### Couverture énergétique
- Solaire seul : **30%**
- + Batterie : **75%** (30% → 75%)
- + Éolien : **90-95%** (+15-20%)

### Coûts
- Solaire : **2 000€/kWc** installé
- Batterie : **8 000€** (10 kWh)
- Éolien : **15 000€** (5 kW)
- Borne : **1 200€** (wallbox 7,4 kW)

### Aides 2026
- Prime autoconsommation : **380€/kWc**
- TVA réduite : **10%**
- Prime Advenir (borne) : **500€**

### Production & Économies
- Production solaire : **1 000 kWh/kWc/an** (moyenne)
- Coefficients régionaux :
  - Sud (06, 13, 83) : **+15%**
  - Nord (59, 62) : **-15%**
- Revente surplus : **0,13€/kWh**
- Prix achat EDF : **0,23€/kWh**

### Formules de calcul

```javascript
// Dimensionnement
solarKwc = annualConsumption / 1000

// Couverture
totalCoverage = SOLAR (30%) + BATTERY (45%) + WIND (18%)
maxCoverage = 95% (plafond réaliste)

// Production
solarProduction = solarKwc × 1000 × regionalCoef
windProduction = 8000 × regionalCoef

// Économies
annualSavings = selfConsumption × 0.23€
surplusRevenue = surplus × 0.13€

// ROI
roiYears = netCost / (annualSavings + surplusRevenue)
```

## 🔧 Personnalisation

### Modifier les coûts

Éditez `simulateur-script.js` ligne 18-28 :

```javascript
const CONSTANTS = {
    SOLAR_COST_PER_KWC: 2000, // Modifiez ici
    BATTERY_COST: 8000,
    // ...
};
```

### Modifier les couleurs

Éditez `simulateur-styles.css` ou les styles inline dans le HTML :

```css
/* Couleur primaire (actuellement bleu) */
#0066FF → votre couleur

/* Dégradés */
linear-gradient(135deg, #0066FF 0%, #0052CC 100%)
```

### Intégrer capture de leads

Dans `simulateur-script.js`, fonction `showLeadForm()` ligne 329 :

```javascript
function showLeadForm() {
    // Intégrez votre formulaire ou webhook Make.com
    const data = {
        postalCode: simulationData.postalCode,
        consumption: simulationData.annualConsumption,
        config: {
            battery: simulationData.hasBattery,
            wind: simulationData.hasWind,
            charger: simulationData.hasCharger
        }
    };
    
    // Envoi vers Make.com
    fetch('https://hook.eu1.make.com/YOUR_WEBHOOK', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
```

## 📱 Responsive

Le simulateur s'adapte automatiquement :
- **Desktop** : 2 colonnes (config + résultats côte à côte)
- **Tablet** : 1 colonne
- **Mobile** : Design optimisé avec padding réduit

## 🎯 Prochaines étapes

1. Copier les 3 fichiers sur GitHub
2. Push
3. Vercel redéploie automatiquement
4. Tester sur https://independance-energetique.vercel.app/simulateur.html

## ⚠️ Dépendances

- **Chart.js 4.4.0** (CDN) : graphique doughnut
- **Google Fonts Inter** (CDN) : typographie
- **Aucune autre dépendance** : vanilla JavaScript pur

## 📊 Performance

- Calculs instantanés (< 10ms)
- Graphique mis à jour en temps réel
- Pas de rechargement de page
- Transitions fluides

## 🐛 Debug

Si le graphique ne s'affiche pas :
1. Vérifiez que Chart.js est bien chargé (console navigateur)
2. Vérifiez l'ID du canvas : `energy-chart`

Si les calculs sont incorrects :
1. Ouvrez la console navigateur (F12)
2. Vérifiez `simulationData` dans la console

---

**Version :** 2026  
**Dernière mise à jour :** 05/02/2025  
**Status :** ✅ Prêt pour production

© 2025 Indépendance Énergétique
