/**
 * generate-blog-list.js
 * Script qui scanne le dossier /blog/ et génère automatiquement articles.json
 * 
 * USAGE : node generate-blog-list.js
 * 
 * Ce script :
 * 1. Scanne tous les fichiers .html dans /blog/
 * 2. Extrait les métadonnées (title, description, date, author) depuis les balises HTML
 * 3. Génère un fichier articles.json
 * 4. La page blog/index.html charge ce JSON automatiquement
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BLOG_DIR = path.join(__dirname, 'blog');
const OUTPUT_FILE = path.join(BLOG_DIR, 'articles.json');
const EXCLUDED_FILES = ['index.html', 'articles.json'];

// Fonction pour extraire les métadonnées d'un fichier HTML
function extractMetadata(htmlContent, filename) {
    const article = {
        url: `/blog/${filename}`,
        filename: filename
    };
    
    // Extraire le title
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    article.title = titleMatch ? titleMatch[1].replace(/\s*\|.*$/, '').trim() : 'Sans titre';
    
    // Extraire la meta description
    const descMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    article.excerpt = descMatch ? descMatch[1].substring(0, 200) : '';
    
    // Extraire la date de publication (depuis Schema.org ou meta)
    const datePublishedMatch = htmlContent.match(/"datePublished":\s*"(\d{4}-\d{2}-\d{2})"/);
    if (datePublishedMatch) {
        article.date = datePublishedMatch[1];
    } else {
        // Fallback : date de modification du fichier
        const stats = fs.statSync(path.join(BLOG_DIR, filename));
        article.date = stats.mtime.toISOString().split('T')[0];
    }
    
    // Extraire l'auteur (depuis Schema.org)
    const authorMatch = htmlContent.match(/"author":\s*{\s*"@type":\s*"Person",\s*"name":\s*"(.*?)"/);
    article.author = authorMatch ? authorMatch[1] : 'Équipe IE';
    
    // Générer les initiales de l'auteur
    const nameParts = article.author.split(' ');
    article.authorAvatar = nameParts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
    
    // Couleur de l'auteur (basée sur le hash du nom)
    const colors = ['#4A90E2', '#27AE60', '#E67E22', '#9B59B6', '#1ABC9C', '#E74C3C'];
    const colorIndex = article.author.length % colors.length;
    article.authorColor = colors[colorIndex];
    
    // Extraire le temps de lecture (chercher dans le HTML)
    const readingTimeMatch = htmlContent.match(/(\d+)\s*min(?:utes?)?\s+(?:de\s+)?lecture/i);
    article.readingTime = readingTimeMatch ? `${readingTimeMatch[1]} min` : '5 min';
    
    // Déterminer la catégorie basée sur le contenu
    const content = htmlContent.toLowerCase();
    if (content.includes('batterie') || content.includes('stockage')) {
        article.category = 'Batteries';
        article.emoji = '🔋';
    } else if (content.includes('panneau') || content.includes('photovoltaïque') || content.includes('solaire')) {
        article.category = 'Panneaux';
        article.emoji = '☀️';
    } else if (content.includes('aide') || content.includes('subvention') || content.includes('prime')) {
        article.category = 'Aides';
        article.emoji = '🎁';
    } else if (content.includes('rentabilité') || content.includes('roi') || content.includes('retour sur investissement')) {
        article.category = 'ROI';
        article.emoji = '📊';
    } else if (content.includes('autonomie') || content.includes('indépendance')) {
        article.category = 'Autonomie';
        article.emoji = '⚡';
    } else {
        article.category = 'Guide';
        article.emoji = '📖';
    }
    
    return article;
}

// Fonction principale
function generateArticlesList() {
    console.log('🔍 Scanning blog directory...');
    
    // Lire tous les fichiers du dossier /blog/
    const files = fs.readdirSync(BLOG_DIR)
        .filter(file => 
            file.endsWith('.html') && 
            !EXCLUDED_FILES.includes(file)
        );
    
    console.log(`📄 Found ${files.length} article(s)`);
    
    // Extraire les métadonnées de chaque fichier
    const articles = files.map(file => {
        console.log(`  ↳ Processing: ${file}`);
        const filePath = path.join(BLOG_DIR, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        return extractMetadata(htmlContent, file);
    });
    
    // Trier par date (plus récent en premier)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Écrire le fichier JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    
    console.log(`✅ Generated: ${OUTPUT_FILE}`);
    console.log(`📊 Total articles: ${articles.length}`);
    console.log('\n📋 Articles:');
    articles.forEach(article => {
        console.log(`  ${article.emoji} ${article.title} (${article.date})`);
    });
}

// Exécution
try {
    generateArticlesList();
    console.log('\n✨ Done!');
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
