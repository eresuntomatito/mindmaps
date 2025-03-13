// Mind Map Module
const MindMapApp = {
    init() {
        // Initialize all required components
        this.initializeComponents();
        
        // Bind events
        window.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
        });
    },

    initializeComponents() {
        // Initialize navigation if we're on a map page
        if (document.querySelector('.mind-map')) {
            new NavigationMenu();
            new MindMap();
        }
    }
};

// Mind Map Core Functionality
class MindMap {
    constructor(options = {}) {
        this.options = {
            expandAllSelector: '.expand-all-btn',
            styleToggleSelector: '#styleToggle',
            expandableSelector: '.expandable',
            expandableContentSelector: '.expandable-content',
            processStepSelector: '.process-step',
            nodeSelector: '.node',
            scrollLeftSelector: '.scroll-left',
            scrollRightSelector: '.scroll-right',
            mindMapSelector: '.mind-map',
            ...options
        };

        // Get relationships from data attribute if available
        const mindMap = document.querySelector(this.options.mindMapSelector);
        if (mindMap && mindMap.dataset.relationships) {
            try {
                this.relationships = JSON.parse(mindMap.dataset.relationships);
            } catch (e) {
                console.error('Error parsing relationships:', e);
                this.relationships = {};
            }
        } else {
            this.relationships = {};
        }
        
        // Section type mappings
        this.sectionTypes = {
            // Core business processes (Light Blue)
            'Core Components': 'process',
            'Production Process': 'process',
            'Raw Materials': 'process',
            'Life Cycle Stages': 'process',
            'Raw Materials & Quarry': 'process',
            'Core Principles': 'process',
            'Design & Production': 'process',
            
            // Technology related (Light Purple)
            'Technology Enablers': 'technology',
            'Technology & Innovation': 'technology',
            'Maintenance & Equipment': 'technology',
            'Digital Solutions': 'technology',
            'Smart Manufacturing': 'technology',
            
            // Business related (Light Orange)
            'Impact & Value': 'business',
            'Business Models': 'business',
            'Market Factors': 'business',
            'Customers': 'business',
            'Economic Factors': 'business',
            'Distribution & Logistics': 'business',
            
            // Environmental (Light Green)
            'Environmental Control': 'environment',
            'Environmental Impacts': 'environment',
            'Waste Management': 'environment',
            'Resource Efficiency': 'environment',
            'Resource Impacts': 'environment',
            'Emissions & Pollution': 'environment',
            
            // Planning and strategy (Light Teal)
            'Next Steps': 'planning',
            'Implementation Framework': 'planning',
            'Strategic Planning': 'planning',
            'Prevention & Minimization': 'planning',
            'Waste Management Strategies': 'planning',
            
            // Analysis and quality (Light Pink)
            'Quality Control': 'analysis',
            'Assessment Methods': 'analysis',
            'Implementation Challenges': 'analysis',
            'Process Control': 'analysis',
            'Impact Analysis': 'analysis',
            'Performance Monitoring': 'analysis',
            
            // Implementation and operations (Light Indigo)
            'Safety & Compliance': 'implementation',
            'Policy & Governance': 'implementation',
            'Implementation & Control': 'implementation',
            'Operational Controls': 'implementation',
            
            // Management and logistics (Light Light Green)
            'Storage & Distribution': 'management',
            'Plant Management': 'management',
            'Distribution & Logistics': 'management',
            'Logistics Flow': 'management',
            'Resource Management': 'management'
        };
        
        this.init();
    }

    init() {
        // Initialize all components
        const components = [
            this.initStyleToggle,
            this.initExpandables,
            this.initExpandAllButton,
            this.initScrolling,
            this.initRelationships,
            this.initViewport,
            this.initSectionColors,
            this.initColorLegend
        ];

        // Initialize each component and catch any errors
        components.forEach(component => {
            try {
                component.call(this);
            } catch (e) {
                console.error(`Error initializing component:`, e);
            }
        });
    }

    initStyleToggle() {
        const styleToggle = document.querySelector(this.options.styleToggleSelector);
        const mainStyles = document.getElementById('main-styles');
        let stylesEnabled = true;

        if (styleToggle && mainStyles) {
            styleToggle.addEventListener('click', () => {
                stylesEnabled = !stylesEnabled;
                mainStyles.disabled = !stylesEnabled;
                styleToggle.textContent = stylesEnabled ? 'Disable CSS' : 'Enable CSS';
                styleToggle.classList.toggle('disabled', !stylesEnabled);
            });
        }
    }

    initExpandables() {
        // First ensure all content is collapsed initially
        document.querySelectorAll('.expandable-content').forEach(content => {
            content.classList.add('collapsed');
        });

        // Remove any existing event listeners by cloning and replacing elements
        const cloneAndReplace = (element) => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
            return clone;
        };

        // Handle h3 elements
        document.querySelectorAll('h3.expandable').forEach(heading => {
            const newHeading = cloneAndReplace(heading);
            newHeading.addEventListener('click', (e) => {
                e.stopPropagation();
                const content = newHeading.nextElementSibling;
                if (content && content.classList.contains('expandable-content')) {
                    content.classList.toggle('collapsed');
                    newHeading.classList.toggle('expanded');
                }
            });
        });

        // Handle li elements
        document.querySelectorAll('li.expandable').forEach(item => {
            const newItem = cloneAndReplace(item);
            
            // Add expand indicator if not already present
            if (!newItem.querySelector('.expand-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'expand-indicator';
                newItem.insertBefore(indicator, newItem.firstChild);
            }

            newItem.addEventListener('click', (e) => {
                e.stopPropagation();
                const content = newItem.querySelector(':scope > .expandable-content');
                if (content) {
                    content.classList.toggle('collapsed');
                    newItem.classList.toggle('expanded');
                }
            });
        });
    }

    initExpandAllButton() {
        let expandAllBtn = document.querySelector(this.options.expandAllSelector);
        const centralTopic = document.querySelector('.central-topic');
        
        if (!expandAllBtn && centralTopic) {
            expandAllBtn = document.createElement('button');
            expandAllBtn.textContent = 'Expand All';
            expandAllBtn.className = 'expand-all-btn';
            centralTopic.appendChild(expandAllBtn);
        }

        if (expandAllBtn) {
            // Remove any existing listeners
            const newBtn = expandAllBtn.cloneNode(true);
            expandAllBtn.parentNode.replaceChild(newBtn, expandAllBtn);
            expandAllBtn = newBtn;

            let allExpanded = false;
            const toggleExpansion = () => {
                allExpanded = !allExpanded;
                expandAllBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';

                // Toggle all expandable contents
                document.querySelectorAll('.expandable-content').forEach(content => {
                    content.classList.toggle('collapsed', !allExpanded);
                });

                // Toggle expanded state on all expandable elements
                document.querySelectorAll('.expandable').forEach(expandable => {
                    expandable.classList.toggle('expanded', allExpanded);
                });
            };

            expandAllBtn.addEventListener('click', toggleExpansion);
        }
    }

    initViewport() {
        const mindMap = document.querySelector(this.options.mindMapSelector);
        if (!mindMap) return;

        // Ensure the first column is fully visible
        const firstColumn = mindMap.querySelector('.column');
        if (firstColumn) {
            const containerWidth = mindMap.clientWidth;
            const columnWidth = firstColumn.offsetWidth;
            const initialScroll = Math.max(0, (columnWidth - containerWidth) / 2);
            mindMap.scrollLeft = initialScroll;
        }

        // Update scroll indicators on load
        this.updateScrollIndicators(mindMap);
    }

    initScrolling() {
        const mindMap = document.querySelector(this.options.mindMapSelector);
        const scrollLeft = document.querySelector(this.options.scrollLeftSelector);
        const scrollRight = document.querySelector(this.options.scrollRightSelector);

        if (mindMap && scrollLeft && scrollRight) {
            const scrollAmount = 300;

            scrollLeft.addEventListener('click', () => {
                mindMap.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            scrollRight.addEventListener('click', () => {
                mindMap.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            // Update scroll indicators visibility
            mindMap.addEventListener('scroll', () => this.updateScrollIndicators(mindMap));
            window.addEventListener('resize', () => this.updateScrollIndicators(mindMap));
            
            // Initial update
            this.updateScrollIndicators(mindMap);
        }
    }

    updateScrollIndicators(mindMap) {
        const scrollLeft = document.querySelector(this.options.scrollLeftSelector);
        const scrollRight = document.querySelector(this.options.scrollRightSelector);
        
        if (scrollLeft && scrollRight) {
            const canScrollLeft = mindMap.scrollLeft > 0;
            const canScrollRight = mindMap.scrollLeft < (mindMap.scrollWidth - mindMap.clientWidth);

            scrollLeft.style.display = canScrollLeft ? 'flex' : 'none';
            scrollRight.style.display = canScrollRight ? 'flex' : 'none';
        }
    }

    initRelationships() {
        const nodes = document.querySelectorAll(this.options.nodeSelector);
        
        nodes.forEach(node => {
            const title = node.querySelector('h3')?.textContent;
            if (title) {
                node.addEventListener('mouseenter', () => this.highlightRelationships(node, title));
                node.addEventListener('mouseleave', () => this.clearHighlights());
            }
        });
    }

    highlightRelationships(node, title) {
        const related = this.relationships[title] || [];
        const allNodes = document.querySelectorAll(this.options.nodeSelector);
        
        allNodes.forEach(n => {
            const nodeTitle = n.querySelector('h3')?.textContent;
            if (nodeTitle) {
                if (n === node) {
                    n.classList.add('highlight-source');
                } else if (related.includes(nodeTitle)) {
                    n.classList.add('highlight-related');
                }
            }
        });
    }

    clearHighlights() {
        document.querySelectorAll(this.options.nodeSelector).forEach(node => {
            node.classList.remove('highlight-source', 'highlight-destination', 'highlight-related');
        });
    }

    initSectionColors() {
        const columns = document.querySelectorAll('.column');
        let colorIndex = 1;

        columns.forEach(column => {
            const heading = column.querySelector('h2');
            if (heading) {
                const title = heading.textContent;
                const sectionType = this.sectionTypes[title];

                if (sectionType) {
                    column.dataset.sectionType = sectionType;
                } else {
                    // Fallback to color classes if no section type is found
                    column.classList.add(`color-${colorIndex}`);
                    colorIndex = (colorIndex % 8) + 1;
                }
            }
        });
    }

    initColorLegend() {
        // Create color legend container if it doesn't exist
        let legend = document.querySelector('.color-legend');
        if (!legend) {
            legend = document.createElement('div');
            legend.className = 'color-legend';
            document.body.appendChild(legend);
        }

        // Clear existing legend items
        legend.innerHTML = '';

        // Get unique section types from columns
        const sectionTypes = new Set();
        document.querySelectorAll('.column[data-section-type]').forEach(column => {
            sectionTypes.add(column.dataset.sectionType);
        });

        // Create legend items
        sectionTypes.forEach(type => {
            const item = document.createElement('div');
            item.className = 'color-legend-item';
            
            const swatch = document.createElement('div');
            swatch.className = `color-legend-swatch ${type}`;
            
            const label = document.createElement('span');
            label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            
            item.appendChild(swatch);
            item.appendChild(label);
            legend.appendChild(item);
        });
    }
}

// Navigation Menu
class NavigationMenu {
    static instance = null;

    constructor() {
        // Singleton pattern - only allow one instance
        if (NavigationMenu.instance) {
            return NavigationMenu.instance;
        }
        NavigationMenu.instance = this;
        
        // Check if navigation is already present
        if (!document.querySelector('.site-navigation')) {
            this.init();
        }
    }

    async init() {
        try {
            // Determine if we're in a map page or the index
            const isMapPage = window.location.pathname.includes('/maps/');
            const navigationPath = isMapPage ? '../includes/navigation.html' : 'includes/navigation.html';

            // Load the navigation template
            const response = await fetch(navigationPath);
            const navigationHtml = await response.text();

            // Process the HTML to fix paths based on current location
            const processedHtml = this.processNavigationPaths(navigationHtml, isMapPage);

            // Insert the navigation at the start of the body, only if it doesn't exist
            const existingNav = document.querySelector('.site-navigation');
            if (!existingNav) {
                const body = document.body;
                body.insertAdjacentHTML('afterbegin', processedHtml);
                // Initialize navigation functionality
                this.initializeNavigation();
            }
        } catch (error) {
            console.error('Error loading navigation:', error);
            // Fallback to static navigation if loading fails and no navigation exists
            if (!document.querySelector('.site-navigation')) {
                this.createStaticNavigation();
            }
        }
    }

    processNavigationPaths(html, isMapPage) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Fix home link
        const homeLink = tempDiv.querySelector('.home-link');
        if (homeLink) {
            homeLink.href = isMapPage ? '../index.html' : 'index.html';
        }

        // Fix map links
        tempDiv.querySelectorAll('.nav-tree a[href]').forEach(link => {
            if (link.getAttribute('href') !== '#') {
                const href = link.getAttribute('href');
                if (!href.startsWith('http')) {
                    link.href = isMapPage ? href : `maps/${href}`;
                }
            }
        });

        return tempDiv.innerHTML;
    }

    createStaticNavigation() {
        // Fallback static navigation if loading fails
        const isMapPage = window.location.pathname.includes('/maps/');
        const staticNav = `
            <nav class="site-navigation">
                <div class="nav-content">
                    <a href="${isMapPage ? '../index.html' : 'index.html'}" class="home-link">
                        <i class="fas fa-home"></i>
                        Mind Maps Hub
                    </a>
                    <div class="nav-tree">
                        <ul>
                            <li>
                                <a href="#"><i class="fas fa-industry"></i>Business & Operations</a>
                                <ul>
                                    <li><a href="${isMapPage ? '' : 'maps/'}construction_materials_business.html">Construction Materials Business</a></li>
                                    <li><a href="${isMapPage ? '' : 'maps/'}business_process_optimization.html">Business Process Optimization</a></li>
                                    <li><a href="${isMapPage ? '' : 'maps/'}cement_plant.html">Cement Plant</a></li>
                                    <li><a href="${isMapPage ? '' : 'maps/'}quarry-operations.html">Quarry Operations</a></li>
                                    <li><a href="${isMapPage ? '' : 'maps/'}predictive-maintenance-aggregates.html">Predictive Maintenance in Aggregates</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#"><i class="fas fa-leaf"></i>Sustainability</a>
                                <ul>
                                    <li><a href="${isMapPage ? '' : 'maps/'}circular_economy.html">Circular Economy</a></li>
                                    <li><a href="${isMapPage ? '' : 'maps/'}construction_waste_lca.html">Construction Waste LCA</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#"><i class="fas fa-microchip"></i>Technology</a>
                                <ul>
                                    <li><a href="${isMapPage ? '' : 'maps/'}digital_technology.html">Digital Technology Impact</a></li>
                                    <li><a href="${isMapPage ? '' : 'maps/'}smart_infrastructure.html">Smart Infrastructure</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
        document.body.insertAdjacentHTML('afterbegin', staticNav);
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Add click handlers for expandable menu items
        document.querySelectorAll('.nav-tree > ul > li > a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = item.parentElement;
                parent.classList.toggle('expanded');
            });
        });

        // Highlight current page in navigation
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-tree a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
                // Expand parent menu
                const parentMenu = link.closest('li').parentElement.parentElement;
                if (parentMenu.classList.contains('nav-tree')) {
                    parentMenu.querySelector('li').classList.add('expanded');
                }
            }
        });
    }
}

// Initialize the application
const initApp = () => {
    // Create single navigation instance
    const nav = new NavigationMenu();
    
    // Initialize mind map if we're on a map page
    if (document.querySelector('.mind-map')) {
        new MindMap();
    }
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MindMapApp, MindMap, NavigationMenu };
} 