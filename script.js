// Gestion du thème clair/sombre
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') document.body.classList.add('dark');
updateToggleText();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  updateToggleText();
});
function updateToggleText() {
  if (document.body.classList.contains('dark')) {
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌙';
  }
}

// Routage basique en hash : afficher la section correspondant au hash, sinon présentation
const pages = Array.from(document.querySelectorAll('section.page'));
function showPage(pageId) {
  pages.forEach(sec => {
    if (sec.id === pageId) sec.classList.add('active');
    else sec.classList.remove('active');
  });
  // Mettre à jour le lien actif
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === '#' + pageId) a.classList.add('active');
    else a.classList.remove('active');
  });
}
function handleHash() {
  const hash = location.hash.replace('#', '');
  const valid = pages.map(p => p.id);
  if (valid.includes(hash)) {
    showPage(hash);
  } else {
    showPage('presentation');
  }
}
window.addEventListener('hashchange', handleHash);
document.addEventListener('DOMContentLoaded', () => {
  handleHash();
  // Smooth scroll si on charge avec hash
  const hash = location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({behavior:'smooth'});
  }
});

// Soumission du formulaire en façade
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('formSuccess').style.display = 'block';
  setTimeout(() => {
    document.getElementById('formSuccess').style.display = 'none';
    this.reset();
  }, 2600);
});

// Navigation functionality for separate pages
function setActiveNavItem(currentPage) {
  document.querySelectorAll('nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === currentPage || 
        a.getAttribute('href') === './' + currentPage ||
        (currentPage === 'index.html' && a.getAttribute('href') === './')) {
      a.classList.add('active');
    }
  });
}