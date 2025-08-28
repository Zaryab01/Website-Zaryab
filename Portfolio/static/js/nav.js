document.addEventListener('DOMContentLoaded', () => {
    // Enhanced navigation functionality
    initializeNavigation();
    initializeTooltips();
    initializeKeyboardNavigation();
});

function initializeNavigation() {
    // Add active state management
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '/') {
            link.classList.add('active');
            link.style.backgroundColor = 'rgba(0, 255, 65, 0.2)';
            link.style.borderRight = '4px solid var(--neon-green)';
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeTooltips() {
    // Enhanced tooltips for mobile navigation
    const navLinks = document.querySelectorAll('.nav-link[data-tooltip]');
    
    navLinks.forEach(link => {
        const tooltip = document.createElement('div');
        tooltip.className = 'nav-tooltip';
        tooltip.textContent = link.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: var(--neon-green);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
            margin-left: 10px;
            border: 1px solid var(--neon-green);
        `;
        
        link.appendChild(tooltip);
        
        link.addEventListener('mouseenter', () => {
            if (window.innerWidth < 768) {
                tooltip.style.opacity = '1';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

function initializeKeyboardNavigation() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentActive = document.activeElement;
        const currentIndex = navLinks.indexOf(currentActive);
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    navLinks[currentIndex - 1].focus();
                } else if (currentIndex === -1 && navLinks.length > 0) {
                    navLinks[navLinks.length - 1].focus();
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < navLinks.length - 1 && currentIndex !== -1) {
                    navLinks[currentIndex + 1].focus();
                } else if (currentIndex === -1 && navLinks.length > 0) {
                    navLinks[0].focus();
                }
                break;
                
            case 'Enter':
                if (currentActive && currentActive.classList.contains('nav-link')) {
                    currentActive.click();
                }
                break;
                
            case 'Escape':
                // Close mobile navigation if open
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('nav-overlay');
                if (sidebar && sidebar.classList.contains('w-72')) {
                    sidebar.classList.remove('w-72');
                    sidebar.classList.add('w-16');
                    if (overlay) overlay.classList.add('hidden');
                }
                break;
        }
    });
}

// Navigation state management
class NavigationState {
    constructor() {
        this.isExpanded = false;
        this.activeSection = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadState();
    }
    
    bindEvents() {
        // Save navigation state to localStorage
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    }
    
    saveState() {
        const state = {
            isExpanded: this.isExpanded,
            activeSection: this.activeSection
        };
        localStorage.setItem('navState', JSON.stringify(state));
    }
    
    loadState() {
        try {
            const saved = localStorage.getItem('navState');
            if (saved) {
                const state = JSON.parse(saved);
                this.isExpanded = state.isExpanded;
                this.activeSection = state.activeSection;
                
                // Restore expanded sections
                if (this.activeSection) {
                    const section = document.getElementById(this.activeSection + '-content');
                    const arrow = document.getElementById(this.activeSection + '-arrow');
                    if (section && arrow) {
                        section.classList.remove('hidden');
                        arrow.style.transform = 'rotate(180deg)';
                    }
                }
            }
        } catch (e) {
            // Ignore errors in loading state
        }
    }
    
    setActiveSection(sectionId) {
        this.activeSection = sectionId;
        this.saveState();
    }
}

// Initialize navigation state management
const navState = new NavigationState();

// Enhanced section toggle with state management
window.toggleSection = function(sectionId) {
    const content = document.getElementById(sectionId + '-content');
    const arrow = document.getElementById(sectionId + '-arrow');
    
    if (content && arrow) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
            navState.setActiveSection(sectionId);
        } else {
            content.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
            navState.setActiveSection(null);
        }
    }
};

window.toggleSubsection = function(subsectionId) {
    const content = document.getElementById(subsectionId + '-content');
    const arrow = document.getElementById(subsectionId + '-arrow');
    
    if (content && arrow) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
        }
    }
};

