document.addEventListener('DOMContentLoaded', () => {
    initializeActiveLinks();
    initializeSmoothAnchors();
    initializeMobileNavigation();
});

function initializeActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('#sidebar .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) {
            return;
        }

        if (href === '/' && currentPath === href) {
            link.classList.add('active');
            return;
        }

        if (href !== '/' && currentPath.startsWith(href)) {
            link.classList.add('active');
        }
    });
}

function initializeSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initializeMobileNavigation() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('nav-overlay');
    const toggleButton = document.getElementById('mobile-nav-toggle');
    const links = document.querySelectorAll('#sidebar a');

    if (!sidebar || !toggleButton) {
        return;
    }

    const openNav = () => {
        sidebar.classList.add('translate-x-0');
        sidebar.classList.remove('-translate-x-full');
        toggleButton.setAttribute('aria-expanded', 'true');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        document.body.classList.add('overflow-hidden');
    };

    const closeNav = () => {
        sidebar.classList.remove('translate-x-0');
        sidebar.classList.add('-translate-x-full');
        toggleButton.setAttribute('aria-expanded', 'false');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        document.body.classList.remove('overflow-hidden');
    };

    toggleButton.addEventListener('click', () => {
        const isOpen = sidebar.classList.contains('translate-x-0');
        if (isOpen) {
            closeNav();
        } else {
            openNav();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeNav();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            if (overlay) {
                overlay.classList.add('hidden');
            }
            toggleButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('overflow-hidden');
        } else {
            sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('-translate-x-full');
            toggleButton.setAttribute('aria-expanded', 'false');
            if (overlay) {
                overlay.classList.add('hidden');
            }
            document.body.classList.remove('overflow-hidden');
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });

    if (window.innerWidth >= 768) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        document.body.classList.remove('overflow-hidden');
    } else {
        closeNav();
    }
}
