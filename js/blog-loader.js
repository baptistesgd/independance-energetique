// ============================================================================
// BLOG LOADER - Chargement dynamique des 2 derniers articles
// Structure HTML adaptée à la charte graphique du site
// ============================================================================

// Liste des articles de blog (à mettre à jour manuellement)
const blogArticles = [
  {
    title: "Aides État 2026 : Le guide complet des subventions photovoltaïques",
    slug: "/blog/aides-etat-photovoltaique-2026",
    excerpt: "Prime autoconsommation, crédit d'impôt batterie, TVA réduite : toutes les aides cumulables pour votre installation solaire en 2026.",
    category: "Aides & Financement",
    readTime: "8 min",
    author: {
      name: "Marc L.",
      initials: "ML",
      color: "#4A90E2"
    },
    date: "2025-01-15",
    dateFormatted: "15 janv. 2025"
  },
  {
    title: "Recharger sa Tesla gratuitement avec des panneaux solaires",
    slug: "/blog/recharger-tesla-panneaux-solaires",
    excerpt: "Guide complet : dimensionnement, installation borne, pilotage surplus solaire. Économisez 1 500€/an sur vos recharges.",
    category: "Véhicule Électrique",
    readTime: "14 min",
    author: {
      name: "Sophie D.",
      initials: "SD",
      color: "#27AE60"
    },
    date: "2025-01-05",
    dateFormatted: "5 janv. 2025"
  },
  {
    title: "Batterie domestique : Le guide complet 2024",
    slug: "/blog/batterie-domestique-guide-complet-2024",
    excerpt: "Lithium-ion vs LFP, dimensionnement, coûts réels, durée de vie : tout ce qu'il faut savoir avant d'investir dans une batterie de stockage.",
    category: "Batteries",
    readTime: "12 min",
    author: {
      name: "Marc L.",
      initials: "ML",
      color: "#4A90E2"
    },
    date: "2024-12-15",
    dateFormatted: "15 déc. 2024"
  },
  {
    title: "Rentabilité du solaire en autoconsommation",
    slug: "/blog/rentabilite-solaire-autoconsommation",
    excerpt: "Calcul du TRI, impact du taux d'autoconsommation, optimisation du ROI : les vrais chiffres de la rentabilité photovoltaïque en 2025.",
    category: "ROI",
    readTime: "10 min",
    author: {
      name: "Sophie D.",
      initials: "SD",
      color: "#27AE60"
    },
    date: "2024-12-10",
    dateFormatted: "10 déc. 2024"
  }
];

// Fonction pour trier les articles par date (plus récent en premier)
function sortArticlesByDate(articles) {
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Fonction pour générer le HTML d'un article (STRUCTURE EXACTE DU SITE)
function generateArticleHTML(article, index) {
  const animationDelay = index > 0 ? ` data-delay="${index * 100}"` : '';
  
  return `
    <article class="blog-card" data-animate="slide-up"${animationDelay}>
        <div class="blog-meta">
            <span class="blog-category">${article.category}</span>
            <span class="blog-reading-time">${article.readTime}</span>
        </div>
        <h3 class="blog-title">
            <a href="${article.slug}">
                ${article.title}
            </a>
        </h3>
        <p class="blog-excerpt">
            ${article.excerpt}
        </p>
        <div class="blog-footer">
            <div class="blog-author">
                <div class="author-avatar" style="background-color: ${article.author.color};">${article.author.initials}</div>
                <span class="author-name">${article.author.name}</span>
            </div>
            <time datetime="${article.date}">${article.dateFormatted}</time>
        </div>
    </article>
  `;
}

// Fonction principale pour charger les 2 derniers articles
function loadLatestBlogArticles() {
  const blogGrid = document.querySelector('.blog-grid');
  
  if (!blogGrid) {
    console.warn('Blog grid container (.blog-grid) not found');
    return;
  }
  
  // Trier les articles par date
  const sortedArticles = sortArticlesByDate([...blogArticles]);
  
  // Prendre les 2 plus récents
  const latestArticles = sortedArticles.slice(0, 2);
  
  // Générer et injecter le HTML
  blogGrid.innerHTML = latestArticles
    .map((article, index) => generateArticleHTML(article, index))
    .join('');
  
  console.log('✅ Blog articles chargés :', latestArticles.length);
}

// Charger les articles au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  loadLatestBlogArticles();
});

// Exposer globalement pour pouvoir rafraîchir manuellement si besoin
window.refreshBlogArticles = loadLatestBlogArticles;
