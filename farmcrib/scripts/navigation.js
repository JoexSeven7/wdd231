/**
 * Navigation Module
 * Handles hamburger menu toggle, active link highlighting, and keyboard navigation
 * Author: FarmCrib Development Team
 */

/**
 * Initializes the mobile hamburger menu
 */
export function initHamburgerMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');

  if (!menuToggle || !primaryNav) return;

  /**
   * Opens or closes the mobile navigation menu
   */
  const toggleMenu = () => {
    const isOpen = primaryNav.classList.contains('open');
    primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', !isOpen);
    
    if (!isOpen) {
      const firstLink = primaryNav.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  };

  /**
   * Closes the menu when clicking outside or pressing Escape
   */
  const closeMenu = () => {
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', toggleMenu);

  document.addEventListener('click', (event) => {
    if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && primaryNav.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Close menu when a nav link is clicked (mobile)
  const navLinks = primaryNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Handle window resize - close menu on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

/**
 * Sets the active class on the current page's navigation link
 */
export function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.primary-nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Initialize all navigation features
 */
export function initNavigation() {
  initHamburgerMenu();
  setActiveNavLink();
}
