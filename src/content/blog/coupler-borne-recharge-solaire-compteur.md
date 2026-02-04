---
title: "Comment coupler borne de recharge et solaire sans surcharger son compteur"
description: "Guide technique complet pour installer une borne VE avec des panneaux solaires sans faire disjoncter votre installation. Dimensionnement, pilotage intelligent et erreurs à éviter."
publishedDate: "2026-01-08"
modifiedDate: "2026-01-18"
author:
  name: "Sophie D."
  id: "sophie-delacroix"
image:
  src: "/images/blog/borne-recharge-solaire.webp"
  alt: "Borne de recharge véhicule électrique connectée à des panneaux solaires"
category: "mobilite-electrique"
tags:
  - borne recharge
  - véhicule électrique
  - solaire
  - smart charging
  - délestage
  - compteur électrique
featured: true
readingTime: 14
---

## Le piège du "tout électrique" mal préparé

J'accompagne des particuliers dans leurs projets de mobilité électrique depuis 15 ans, et je vois régulièrement la même erreur : des propriétaires enthousiastes qui installent panneaux solaires ET borne de recharge sans penser à l'interaction entre les deux. Résultat ? Le compteur qui disjoncte au premier soir d'hiver, quand la voiture se met à charger pendant que le four et le chauffage tournent.

Ce guide va vous expliquer **comment dimensionner et piloter correctement** votre installation pour que borne de recharge et panneaux solaires fonctionnent en harmonie — sans surcharger votre compteur ni nécessiter un abonnement EDF démesuré.

## Comprendre les bases : puissance vs énergie

Avant d'aller plus loin, clarifions deux notions que beaucoup confondent :

### La puissance (kW)
C'est la "vitesse" à laquelle l'électricité circule à un instant T. Votre compteur a une puissance souscrite (3 kVA, 6 kVA, 9 kVA, etc.) qui représente le maximum que vous pouvez tirer simultanément du réseau. Si vous dépassez, ça disjoncte.

### L'énergie (kWh)
C'est la quantité totale d'électricité consommée sur une période. C'est ce que vous payez sur votre facture.

**Pourquoi c'est important ?** Parce qu'une borne de recharge consomme beaucoup de puissance instantanée (3,7 kW à 22 kW selon les modèles), même si l'énergie totale reste raisonnable.

## État des lieux : votre compteur peut-il encaisser ?

### Les puissances en jeu

Faisons l'inventaire des gros consommateurs de votre foyer :

| Équipement | Puissance typique |
|------------|-------------------|
| Four électrique | 2 à 3 kW |
| Plaques induction | 3 à 7 kW |
| Chauffe-eau | 1,5 à 2 kW |
| Climatisation/PAC | 2 à 5 kW |
| Sèche-linge | 2 à 3 kW |
| Borne 7,4 kW (monophasé) | 7,4 kW |
| Borne 11 kW (triphasé) | 11 kW |
| Borne 22 kW (triphasé) | 22 kW |

Si vous avez un abonnement 9 kVA (le plus courant) et que vous faites tourner le four (3 kW) pendant que la borne charge à 7,4 kW, vous êtes déjà à 10,4 kW : **ça disjoncte**.

### Le calcul à faire AVANT l'installation

1. **Listez vos appareils énergivores** et leur puissance
2. **Identifiez les usages simultanés** probables (le soir typiquement)
3. **Calculez la puissance maximale** de pointe
4. **Comparez à votre abonnement** actuel

Exemple concret :
- Soir d'hiver, 19h : PAC (3 kW) + four (2,5 kW) + plaques (3 kW) + éclairage/divers (1 kW) = **9,5 kW**
- Vous êtes déjà à la limite de votre 9 kVA
- Ajouter une borne 7,4 kW = **16,9 kW** nécessaires = impossible sans modification

## Les 3 solutions pour ne pas tout faire sauter

### Solution 1 : Augmenter son abonnement (la solution paresseuse)

Vous pouvez demander à Enedis de passer en 12 kVA, 15 kVA ou plus. Mais attention aux conséquences :

**Côté positif :**
- Simple à mettre en œuvre
- Pas de contrainte au quotidien

**Côté négatif :**
- Coût de l'abonnement : +30 à +50% sur la partie fixe de votre facture
- Peut nécessiter un passage en triphasé (travaux ~500-1500€)
- Potentiellement un renforcement du réseau (facturé par Enedis)
- Vous ne profitez pas intelligemment de votre production solaire

**Mon avis :** C'est la solution de facilité, mais rarement la plus économique sur le long terme.

### Solution 2 : Le délestage intelligent (la solution maligne)

Le principe est simple : un boîtier mesure en temps réel la puissance consommée par le foyer et **ajuste automatiquement la puissance de charge** de la borne pour ne jamais dépasser la puissance souscrite.

**Comment ça marche concrètement :**

1. Vous avez un abonnement 9 kVA
2. Le boîtier mesure que vous consommez 6 kW (four + PAC)
3. Il autorise la borne à charger à 3 kW maximum (9 - 6 = 3)
4. Quand le four s'arrête, la puissance disponible augmente
5. La borne passe automatiquement à 6 kW

**Les bornes avec délestage intégré :**
- Wallbox Pulsar Plus / Copper (via Power Boost)
- Easee Home / Charge
- Schneider EVlink
- Hager Witty

**Coût supplémentaire :** 150 à 400€ pour le kit de mesure (pince ampèremétrique ou compteur connecté)

**Mon avis :** C'est le minimum à installer. Ne faites jamais poser une borne sans cette fonction si votre abonnement est en dessous de 12 kVA.

### Solution 3 : Le pilotage solaire (la solution optimale)

C'est la Rolls du couplage borne + solaire. Au lieu de simplement éviter de disjoncter, le système **pilote activement la charge** pour maximiser l'utilisation de votre production photovoltaïque.

**Le fonctionnement :**

1. Vos panneaux produisent 5 kW
2. Votre maison consomme 2 kW
3. Surplus disponible : 3 kW
4. La borne se déclenche automatiquement et charge à 3 kW
5. Si un nuage passe et que la production baisse à 3 kW, la borne s'arrête (surplus = 1 kW, insuffisant)

**Les technologies disponibles :**

**Niveau 1 - Pilotage ON/OFF :**
La borne démarre ou s'arrête selon qu'il y a suffisamment de surplus. Simple mais pas optimal (la charge s'interrompt souvent).

**Niveau 2 - Pilotage modulant (recommandé) :**
La borne ajuste sa puissance en continu (de 1,4 kW à 7,4 kW en monophasé) pour coller exactement au surplus disponible. Charge fluide et optimale.

**Niveau 3 - Pilotage hybride avec batterie :**
Le système utilise d'abord le surplus solaire direct, puis complète avec la batterie domestique si nécessaire, et seulement en dernier recours avec le réseau.

**Les solutions compatibles pilotage solaire :**
- **Fronius Wattpilot** : excellente intégration avec onduleurs Fronius
- **Wallbox + Solar Manager** : fonctionne avec la plupart des onduleurs
- **MyEnergi Zappi** : pilotage natif très efficace, compatible tous onduleurs
- **SolarEdge + borne SolarEdge** : écosystème fermé mais très bien intégré

## Configuration pratique : le cas type

Prenons un exemple concret pour illustrer le dimensionnement optimal.

### Situation de départ

- **Maison** : 120 m², chauffage PAC, 4 personnes
- **Consommation annuelle** : 8 000 kWh (hors VE)
- **Abonnement actuel** : 9 kVA monophasé
- **Véhicule** : Renault Megane E-Tech, 15 000 km/an
- **Installation solaire** : 6 kWc en autoconsommation

### Calcul des besoins VE

- Consommation Megane E-Tech : ~17 kWh/100 km
- Besoin annuel : 15 000 × 0,17 = **2 550 kWh/an**
- Besoin hebdomadaire : 2 550 / 52 = **49 kWh/semaine**

### Choix de la borne

Avec 49 kWh/semaine à charger, combien de temps faut-il selon la puissance ?

| Puissance borne | Temps pour 49 kWh |
|-----------------|-------------------|
| 2,3 kW (prise renforcée) | 21 heures |
| 3,7 kW | 13 heures |
| 7,4 kW | 6,5 heures |
| 11 kW (triphasé) | 4,5 heures |

**Recommandation :** Une borne **7,4 kW monophasé** est largement suffisante. Elle permet de récupérer une semaine de trajet en une nuit, sans nécessiter de passage en triphasé.

### Configuration du pilotage

**Option A - Budget serré (~1 500€ tout compris) :**
- Borne Wallbox Pulsar Plus 7,4 kW : 800€
- Kit Power Boost (délestage) : 200€
- Installation : 500€

Fonctionnement : la borne ne dépasse jamais la capacité disponible. Charge principalement la nuit quand la consommation est faible.

**Option B - Optimisation solaire (~2 500€ tout compris) :**
- Borne MyEnergi Zappi 7,4 kW : 1 200€
- Pince CT (mesure production) : 100€
- Installation : 700€

Fonctionnement : en journée, la borne consomme uniquement le surplus solaire. La nuit, elle complète si nécessaire au tarif heures creuses.

### Résultat économique

Avec l'option B et notre installation 6 kWc :

**Production solaire annuelle :** 6 × 1 200 kWh = 7 200 kWh

**Surplus exploitable pour VE :** environ 40% de la production, soit 2 880 kWh (plus que les 2 550 kWh nécessaires !)

**Économie :**
- Sans pilotage solaire : 2 550 kWh × 0,25€ = 638€/an de recharge réseau
- Avec pilotage solaire : 2 550 kWh × 0,02€ (coût marginal solaire) = 51€/an
- **Gain : 587€/an** grâce au pilotage solaire

L'investissement supplémentaire de 1 000€ (option B vs A) est rentabilisé en moins de 2 ans.

## Les erreurs courantes à éviter

### Erreur 1 : Installer une borne 22 kW "au cas où"

Une borne 22 kW nécessite un abonnement triphasé minimum 18 kVA, et la plupart des VE actuels ne chargent qu'à 11 kW en AC de toute façon. C'est payer plus cher pour rien.

### Erreur 2 : Oublier le délestage

"Ma borne a disjoncté 3 fois ce mois-ci" est la phrase que j'entends le plus souvent chez les clients qui ont fait installer leur borne par un électricien non spécialisé IRVE.

### Erreur 3 : Charger systématiquement à 100%

Votre batterie VE vous remerciera si vous la maintenez entre 20% et 80% au quotidien. Réservez les charges à 100% aux longs trajets. Cela tombe bien : avec le pilotage solaire, vous chargez un peu chaque jour plutôt que tout d'un coup.

### Erreur 4 : Négliger l'orientation de la recharge

Si vous rentrez du travail à 19h et que votre voiture charge la nuit, vous n'utilisez pas votre production solaire. **Repensez vos habitudes** : branchez la voiture le matin avant de partir (même 1h de charge solaire, c'est ça de pris), ou investissez dans une batterie domestique pour stocker le surplus du jour.

## Ma checklist avant installation

Avant de valider votre projet, vérifiez ces points :

- [ ] Mon abonnement actuel est-il suffisant avec délestage ? (Calculer la pointe théorique)
- [ ] Ma borne intègre-t-elle un système de délestage ? (Si non, prévoir le kit)
- [ ] Ai-je intérêt à un pilotage solaire ? (Si installation PV > 3 kWc, généralement oui)
- [ ] Mon véhicule est-il compatible avec la modulation de charge ? (99% le sont)
- [ ] L'installateur est-il certifié IRVE ? (Obligatoire pour les aides et l'assurance)
- [ ] Où sera installée la borne ? (À moins de 25m du tableau électrique idéalement)

## Conclusion : ne subissez pas, pilotez

L'erreur serait de voir la borne de recharge comme un simple "gros appareil électrique" supplémentaire. Bien intégrée à votre écosystème solaire, elle devient au contraire un **outil d'optimisation** qui valorise chaque kWh produit par vos panneaux.

Le surcoût d'une borne avec pilotage intelligent (300 à 500€ de plus qu'une borne basique) est généralement rentabilisé en 6 à 12 mois grâce aux économies sur la recharge.

Et surtout, vous évitez les mauvaises surprises : plus de disjonctions intempestives, plus de factures EDF qui explosent, et la satisfaction de rouler (presque) gratuitement grâce au soleil.

---

*Ces recommandations sont basées sur mon expérience de terrain et les bonnes pratiques du secteur. Chaque installation est unique : les puissances, les équipements et les stratégies de pilotage doivent être adaptés à votre situation spécifique. [Utilisez notre simulateur](#simulateur) pour obtenir une première estimation, ou demandez une étude technique personnalisée.*
