/*
 * ONG DANDARA - Niger Website JavaScript
 * Enhanced interactivity and accessibility
 */

// ========================================
// Global State & Constants
// ========================================
const state = {
  currentTheme: 'light',
  mobileNavOpen: false,
  facts: [],
  shownFacts: new Set()
};

// Niger facts for the random facts feature
const nigerFacts = [
  "Le Niger est le plus grand pays d'Afrique de l'Ouest avec 1,267 million km².",
  "Niamey, la capitale, est située sur le fleuve Niger.",
  "Le Niger possède d'importantes réserves d'uranium dans la région d'Arlit.",
  "Le pays compte plus de 20 groupes ethniques différents.",
  "Le parc national du W du Niger est inscrit au patrimoine mondial de l'UNESCO.",
  "Le Niger partage ses frontières avec 7 pays africains.",
  "La langue officielle est le français, mais le haoussa est largement parlé.",
  "Le fleuve Niger traverse le pays d'ouest en est sur plus de 500 km.",
  "Le Niger est l'un des pays les plus jeunes du monde en termes d'âge médian.",
  "L'arbre national du Niger est le moringa, très nutritif.",
  "Les dinosaures du Niger incluent le célèbre Nigersaurus.",
  "Le festival de la cure salée à In-Gall célèbre la culture touarègue.",
  "Le millet et le sorgho sont les céréales de base traditionnelles.",
  "Le Niger possède le plus grand troupeau de dromadaires d'Afrique de l'Ouest.",
  "La réserve naturelle de l'Aïr et du Ténéré est la plus grande d'Afrique."
];

// ========================================
// Utility Functions
// ========================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error)
 */
function showToast(message, type = 'success') {
  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
      <button class="toast-close" onclick="closeToast(this)" aria-label="Fermer la notification">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOutToRight 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
  
  // Add close functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => closeToast(closeBtn));
}

/**
 * Close toast notification
 * @param {HTMLElement} button - Close button element
 */
function closeToast(button) {
  const toast = button.closest('.toast');
  if (toast) {
    toast.style.animation = 'slideOutToRight 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }
}

/**
 * Get or create toast container
 * @returns {HTMLElement} Toast container element
 */
function getOrCreateToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Animate element with specified animation
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - Animation name
 */
function animateElement(element, animation) {
  element.style.animation = `${animation} 0.5s ease-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, 500);
}

/**
 * Manage focus for accessibility
 * @param {HTMLElement} element - Element to focus
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    // Small delay to ensure element is ready
    setTimeout(() => {
      element.focus();
    }, 100);
  }
}

// ========================================
// Theme Management
// ========================================

/**
 * Initialize theme based on localStorage or system preference
 */
function initializeTheme() {
  const savedTheme = localStorage.getItem('dandara-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    state.currentTheme = savedTheme;
  } else if (prefersDark) {
    state.currentTheme = 'dark';
  }
  
  applyTheme(state.currentTheme);
  updateThemeToggleButton();
}

/**
 * Apply theme to the page
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
  const body = document.body;
  
  if (theme === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }
  
  state.currentTheme = theme;
  localStorage.setItem('dandara-theme', theme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  updateThemeToggleButton();
  
  // Show feedback
  const message = newTheme === 'dark' ? 'Mode sombre activé' : 'Mode clair activé';
  showToast(message, 'success');
  
  // Add a subtle animation to the theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  animateElement(themeToggle, 'popIn');
}

/**
 * Update theme toggle button appearance
 */
function updateThemeToggleButton() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const isDark = state.currentTheme === 'dark';
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', 
      isDark ? 'Passer au mode clair' : 'Passer au mode sombre'
    );
  }
}

// ========================================
// Mobile Navigation
// ========================================

/**
 * Toggle mobile navigation menu
 */
function toggleMobileNav() {
  const nav = document.getElementById('mainNav');
  const toggle = document.querySelector('.mobile-nav-toggle');
  
  state.mobileNavOpen = !state.mobileNavOpen;
  
  if (state.mobileNavOpen) {
    nav.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fermer le menu');
    
    // Focus management for accessibility
    const firstNavLink = nav.querySelector('a');
    manageFocus(firstNavLink);
  } else {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    
    // Return focus to toggle button
    manageFocus(toggle);
  }
}

/**
 * Close mobile navigation
 */
function closeMobileNav() {
  if (state.mobileNavOpen) {
    toggleMobileNav();
  }
}

/**
 * Handle navigation link clicks
 * @param {Event} event - Click event
 * @param {string} pageId - Target page ID
 */
function handleNavClick(event, pageId) {
  event.preventDefault();
  
  // Close mobile nav if open
  closeMobileNav();
  
  // Show the target page
  showPage(pageId);
  
  // Update URL hash
  history.pushState(null, null, `#${pageId}`);
  
  // Scroll to top of page smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Animate the page transition
  const targetSection = document.getElementById(pageId);
  if (targetSection) {
    animateElement(targetSection, 'fadeInUp');
  }
}

// ========================================
// Page Navigation & Routing
// ========================================

/**
 * Show specific page section
 * @param {string} pageId - ID of the page to show
 */
function showPage(pageId) {
  const pages = document.querySelectorAll('section.page');
  const navLinks = document.querySelectorAll('nav a');
  
  // Hide all pages
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update navigation active state
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });
}

/**
 * Handle browser navigation (back/forward)
 */
function handleHashChange() {
  const hash = window.location.hash.replace('#', '');
  const validPages = ['presentation', 'projets', 'galerie', 'actualites', 'partenaires', 'contact'];
  
  if (hash && validPages.includes(hash)) {
    showPage(hash);
  } else {
    showPage('presentation');
  }
}

// ========================================
// Random Facts Feature
// ========================================

/**
 * Load shown facts from localStorage
 */
function loadShownFacts() {
  const saved = localStorage.getItem('dandara-shown-facts');
  if (saved) {
    try {
      const factsArray = JSON.parse(saved);
      state.shownFacts = new Set(factsArray);
    } catch (e) {
      console.warn('Error loading shown facts:', e);
      state.shownFacts = new Set();
    }
  }
}

/**
 * Save shown facts to localStorage
 */
function saveShownFacts() {
  try {
    const factsArray = Array.from(state.shownFacts);
    localStorage.setItem('dandara-shown-facts', JSON.stringify(factsArray));
  } catch (e) {
    console.warn('Error saving shown facts:', e);
  }
}

/**
 * Get a random fact that hasn't been shown yet
 * @returns {string|null} Random fact or null if all have been shown
 */
function getRandomFact() {
  const availableFacts = nigerFacts.filter((fact, index) => !state.shownFacts.has(index));
  
  if (availableFacts.length === 0) {
    return null; // All facts have been shown
  }
  
  const randomIndex = Math.floor(Math.random() * availableFacts.length);
  const selectedFact = availableFacts[randomIndex];
  
  // Find the original index and mark it as shown
  const originalIndex = nigerFacts.indexOf(selectedFact);
  state.shownFacts.add(originalIndex);
  saveShownFacts();
  
  return selectedFact;
}

/**
 * Display a random fact with animation
 */
function showRandomFact() {
  const fact = getRandomFact();
  
  if (!fact) {
    showToast('Tous les faits ont été affichés ! Cliquez sur "Réinitialiser" pour recommencer.', 'error');
    return;
  }
  
  const factsDisplay = document.getElementById('factsDisplay');
  if (!factsDisplay) return;
  
  // Create fact element
  const factElement = document.createElement('div');
  factElement.className = 'fact-item';
  factElement.innerHTML = `
    <p>${fact}</p>
    <small>Fait ${state.shownFacts.size} sur ${nigerFacts.length}</small>
  `;
  
  // Add with animation
  factElement.style.opacity = '0';
  factElement.style.transform = 'translateX(-30px)';
  factsDisplay.appendChild(factElement);
  
  // Trigger animation
  setTimeout(() => {
    factElement.style.transition = 'all 0.5s ease-out';
    factElement.style.opacity = '1';
    factElement.style.transform = 'translateX(0)';
  }, 10);
  
  // Update button text if all facts shown
  if (state.shownFacts.size >= nigerFacts.length) {
    const factButton = document.getElementById('factButton');
    if (factButton) {
      factButton.textContent = 'Tous les faits affichés !';
      factButton.disabled = true;
    }
  }
  
  showToast('Nouveau fait sur le Niger ajouté !', 'success');
}

/**
 * Reset shown facts and clear display
 */
function resetFacts() {
  state.shownFacts.clear();
  localStorage.removeItem('dandara-shown-facts');
  
  const factsDisplay = document.getElementById('factsDisplay');
  if (factsDisplay) {
    // Animate out existing facts
    const factItems = factsDisplay.querySelectorAll('.fact-item');
    factItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease-in';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        setTimeout(() => item.remove(), 300);
      }, index * 100);
    });
  }
  
  // Reset button
  const factButton = document.getElementById('factButton');
  if (factButton) {
    factButton.textContent = 'Découvrir un fait sur le Niger';
    factButton.disabled = false;
  }
  
  showToast('Faits réinitialisés !', 'success');
}

// ========================================
// Contact Form Enhancement
// ========================================

/**
 * Handle contact form submission
 * @param {Event} event - Form submit event
 */
function handleContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  // Basic validation
  if (!name || !email || !message) {
    showToast('Veuillez remplir tous les champs requis.', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Veuillez entrer une adresse email valide.', 'error');
    return;
  }
  
  // Simulate form submission
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Envoi en cours...';
  submitButton.disabled = true;
  
  setTimeout(() => {
    showToast(`Merci ${name} ! Votre message a été envoyé avec succès.`, 'success');
    form.reset();
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }, 1500);
}

// ========================================
// Keyboard Navigation & Accessibility
// ========================================

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardNavigation(event) {
  // Escape key closes mobile nav
  if (event.key === 'Escape' && state.mobileNavOpen) {
    closeMobileNav();
    return;
  }
  
  // Tab key management for mobile nav
  if (event.key === 'Tab' && state.mobileNavOpen) {
    const nav = document.getElementById('mainNav');
    const focusableElements = nav.querySelectorAll('a');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Handle focus management for accessibility
 */
function initializeAccessibility() {
  // Add skip link for keyboard users
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-link sr-only';
  skipLink.textContent = 'Aller au contenu principal';
  skipLink.addEventListener('focus', () => {
    skipLink.classList.remove('sr-only');
  });
  skipLink.addEventListener('blur', () => {
    skipLink.classList.add('sr-only');
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add main landmark
  const main = document.querySelector('main');
  if (main) {
    main.id = 'main';
    main.setAttribute('role', 'main');
  }
}

// ========================================
// Initialize Application
// ========================================

/**
 * Initialize all functionality when DOM is ready
 */
function initializeApp() {
  console.log('🚀 Initializing ONG DANDARA website...');
  
  try {
    // Initialize theme
    initializeTheme();
    
    // Initialize shown facts
    loadShownFacts();
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Set up event listeners
    setupEventListeners();
    
    // Handle initial page load
    handleHashChange();
    
    console.log('✅ Website initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing website:', error);
    showToast('Erreur lors de l\'initialisation du site.', 'error');
  }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Mobile navigation toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }
  
  // Navigation links
  const navLinks = document.querySelectorAll('nav a[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const pageId = link.getAttribute('data-page');
      handleNavClick(event, pageId);
    });
  });
  
  // Hash change for browser navigation
  window.addEventListener('hashchange', handleHashChange);
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Random facts buttons
  const factButton = document.getElementById('factButton');
  if (factButton) {
    factButton.addEventListener('click', showRandomFact);
  }
  
  const resetButton = document.getElementById('resetFactsButton');
  if (resetButton) {
    resetButton.addEventListener('click', resetFacts);
  }
  
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', (event) => {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (state.mobileNavOpen && 
        !nav.contains(event.target) && 
        !toggle.contains(event.target)) {
      closeMobileNav();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Close mobile nav on resize to larger screen
    if (window.innerWidth > 768 && state.mobileNavOpen) {
      closeMobileNav();
    }
  });
}

// ========================================
// Start Application
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Additional CSS for toast close button (if needed)
const additionalStyles = `
.toast-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes slideOutToRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--niger-orange);
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  z-index: 1001;
  border-radius: 0 0 0.5rem 0;
}

.skip-link:not(.sr-only) {
  clip: auto;
  width: auto;
  height: auto;
  overflow: visible;
  white-space: normal;
}
`;

// Add additional styles
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);