const fs = require('fs');
const path = require('path');

// Configuration for mind map categories
const CATEGORIES = {
    'business': {
        icon: 'fa-industry',
        title: 'Business & Operations',
        pattern: /business|operations|plant|quarry|maintenance/i
    },
    'sustainability': {
        icon: 'fa-leaf',
        title: 'Sustainability',
        pattern: /sustainability|circular|waste|environment/i
    },
    'technology': {
        icon: 'fa-microchip',
        title: 'Technology',
        pattern: /technology|digital|smart|ai|automation/i
    }
};

function generateNavigation() {
    // Read all files in the maps directory
    const mapsDir = path.join(__dirname, '../maps');
    const files = fs.readdirSync(mapsDir)
        .filter(file => file.endsWith('.html') && file !== 'template.html');

    // Categorize mind maps
    const categorizedMaps = {};
    files.forEach(file => {
        const content = fs.readFileSync(path.join(mapsDir, file), 'utf8');
        const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
        if (!titleMatch) return;

        const title = titleMatch[1];
        let category = 'other';

        // Determine category based on filename and title
        for (const [cat, config] of Object.entries(CATEGORIES)) {
            if (config.pattern.test(file) || config.pattern.test(title)) {
                category = cat;
                break;
            }
        }

        if (!categorizedMaps[category]) {
            categorizedMaps[category] = [];
        }
        categorizedMaps[category].push({ file, title });
    });

    // Generate navigation HTML
    let navHtml = `<nav class="site-navigation">
    <div class="nav-content">
        <a href="index.html" class="home-link">
            <i class="fas fa-home"></i>
            Mind Maps Hub
        </a>
        <div class="nav-tree">
            <ul>`;

    // Add categorized items
    Object.entries(CATEGORIES).forEach(([category, config]) => {
        if (categorizedMaps[category] && categorizedMaps[category].length > 0) {
            navHtml += `
                <li>
                    <a href="#"><i class="fas ${config.icon}"></i>${config.title}</a>
                    <ul>`;
            
            categorizedMaps[category].forEach(({ file, title }) => {
                navHtml += `
                        <li><a href="${file}">${title}</a></li>`;
            });

            navHtml += `
                    </ul>
                </li>`;
        }
    });

    navHtml += `
            </ul>
        </div>
    </div>
</nav>`;

    // Write to navigation template file
    fs.writeFileSync(path.join(__dirname, '../includes/navigation.html'), navHtml);
    console.log('Navigation updated successfully!');
}

// Run the update
generateNavigation(); 