# Mind Maps Hub

A web-based platform for creating and managing interactive mind maps with a focus on construction materials, sustainability, and technology.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Mind Map Management Protocol](#mind-map-management-protocol)
- [Creating New Mind Maps](#creating-new-mind-maps)
- [Map Categories](#map-categories)
- [Styling Guide](#styling-guide)
- [Development Guide](#development-guide)

## Features
- Interactive mind maps with expandable nodes
- Categorized navigation system
- Responsive grid layout
- Color-coded sections for better visualization
- Relationship highlighting between connected nodes
- Breadcrumb navigation
- Mobile-friendly design

## Project Structure
```
mind-map/
├── index.html              # Main entry point
├── css/
│   └── mindmap.css        # Main stylesheet
├── js/
│   └── mindmap.js         # Core JavaScript functionality
├── scripts/
│   └── update_navigation.js # Navigation management script
├── includes/
│   └── navigation.html    # Shared navigation template
└── maps/                  # Individual mind map files
    ├── template.html      # Standard template for new maps
    ├── circular_economy.html
    ├── construction_materials_business.html
    └── ...
```

## Mind Map Management Protocol

### 1. Using the Template
Always start with the provided template when creating new mind maps:
- Location: `maps/template.html`
- Replace `[TITLE]` placeholders
- Follow the predefined structure
- Keep the navigation injection comment

```html
<!-- Key elements in template.html -->
<!-- Navigation will be injected here by NavigationMenu -->
<div class="container">
    <div class="central-topic">
        <h1>[TITLE]</h1>
        <!-- ... -->
    </div>
</div>
```

### 2. File Naming Convention
Follow these rules for mind map filenames:
- Use lowercase letters
- Separate words with hyphens
- Include category keywords
- Examples:
  - `business-process-optimization.html`
  - `technology-ai-automation.html`
  - `sustainability-waste-management.html`

### 3. Navigation Management
The system uses an automated navigation update process:

1. **Update Script**
   ```bash
   node scripts/update_navigation.js
   ```
   This script:
   - Scans all mind maps in the `maps` directory
   - Categorizes them based on content and filename
   - Updates the navigation structure automatically
   - Maintains consistent paths and icons

2. **Categories**
   The script recognizes these categories:
   ```javascript
   - Business & Operations (pattern: business|operations|plant|quarry|maintenance)
   - Sustainability (pattern: sustainability|circular|waste|environment)
   - Technology (pattern: technology|digital|smart|ai|automation)
   ```

3. **Quality Checklist**
   Before deploying new mind maps:
   - [ ] Template structure is followed
   - [ ] Navigation is updated via script
   - [ ] All paths are relative
   - [ ] Single navigation injection point exists
   - [ ] Navigation works on both index and map pages

### 4. Maintenance Rules
To maintain consistency across the platform:
- Never manually edit `navigation.html`
- Always use `template.html` for new maps
- Run `update_navigation.js` after adding/removing maps
- Keep category patterns updated in the script
- Test navigation on both index and map pages
- Verify single navigation instance on all pages

## Creating New Mind Maps

### Step 1: Create the HTML File
1. Create a new HTML file in the `maps` directory
2. Use the following template structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Map Name] Mind Map</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/mindmap.css" id="main-styles">
</head>
<body>
    <div class="container">
        <div class="central-topic">
            <h1>[Map Title]</h1>
            <button class="expand-all-btn">Expand All</button>
        </div>

        <div class="mind-map">
            <div class="flow-container">
                <!-- Sections go here -->
            </div>
        </div>
    </div>
    <script src="../js/mindmap.js"></script>
</body>
</html>
```

### Step 2: Add Map Sections
Each section should follow this structure:
```html
<div class="column" data-section-type="[type]">
    <h2>[Section Title]</h2>
    <div class="process-flow">
        <div class="process-step">
            <div class="node">
                <h3 class="expandable">[Node Title]</h3>
                <ul class="expandable-content">
                    <li class="expandable">[Topic]
                        <ul class="expandable-content">
                            <li>[Subtopic]</li>
                            <li>[Subtopic]</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

### Step 3: Update Navigation
1. Add the map to the appropriate category in `index.html`
2. Update the navigation menu in the `NavigationMenu` class in `mindmap.js`

## Map Categories

### Business & Operations
- Construction Materials
- Process Optimization
- Plant Operations
- Quarry Operations

### Sustainability
- Circular Economy
- Lifecycle Assessment
- Resource Management

### Technology
- Digital Solutions
- Smart Infrastructure
- Innovation

## Styling Guide

### Section Types and Colors
```css
Available section types:
- process (Light Blue)
- technology (Light Purple)
- business (Light Orange)
- environment (Light Green)
- planning (Light Teal)
- analysis (Light Pink)
- implementation (Light Indigo)
- management (Light Light Green)
```

Use the appropriate `data-section-type` attribute to apply themed colors:
```html
<div class="column" data-section-type="process">
```

### Icons
Use Font Awesome icons for visual elements. Common icons:
- `fa-industry` - Manufacturing/Industry
- `fa-leaf` - Sustainability
- `fa-microchip` - Technology
- `fa-recycle` - Circular Economy
- `fa-chart-line` - Analysis
- `fa-gears` - Process

## Development Guide

### Adding New Features
1. Add new functionality to `mindmap.js`
2. Update CSS styles in `mindmap.css`
3. Test across different screen sizes
4. Update documentation

### Best Practices
- Keep node hierarchy to maximum 3 levels
- Use clear, concise titles
- Maintain consistent styling
- Test expandable functionality
- Ensure mobile responsiveness
- Add descriptive comments
- Follow existing naming conventions

### Relationships
To add relationships between nodes:
```html
<div class="mind-map" data-relationships='{
    "Node A": ["Node B", "Node C"],
    "Node B": ["Node A"]
}'>
```

## License
[Your License Here] 