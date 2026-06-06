// ================================================================
// UNIDos por Peek Otoch — main.js
// Para actualizar el progreso, cambia KILOS_ACTUALES al número real
// ================================================================

const KILOS_ACTUALES = 0; // <-- ACTUALIZA ESTE NÚMERO con los kg recolectados
const META_KILOS = 200;

// ---------- AOS ----------
AOS.init({ duration: 750, once: true, offset: 70, easing: 'ease-out-cubic' });

// ---------- Swiper ----------
new Swiper('.mySwiper', {
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  autoplay: { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  breakpoints: {
    600:  { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

// ---------- Progress bar ----------
function animateProgress() {
  const fill    = document.getElementById('progressFill');
  const counter = document.getElementById('kgActual');
  const pct     = Math.min((KILOS_ACTUALES / META_KILOS) * 100, 100);

  let current = 0;
  const fps   = 60;
  const dur   = 1800; // ms
  const steps = (fps * dur) / 1000;
  const inc   = KILOS_ACTUALES / steps;

  const ticker = setInterval(() => {
    current = Math.min(current + inc, KILOS_ACTUALES);
    counter.textContent = Math.floor(current);
    if (current >= KILOS_ACTUALES) clearInterval(ticker);
  }, 1000 / fps);

  setTimeout(() => { fill.style.width = pct + '%'; }, 200);

  // Update percentage label
  document.getElementById('progressPct').textContent = Math.round(pct) + '%';
}

// Only run animation when hero enters viewport
const heroObserver = new IntersectionObserver(
  entries => { if (entries[0].isIntersecting) { animateProgress(); heroObserver.disconnect(); } },
  { threshold: 0.25 }
);
heroObserver.observe(document.getElementById('hero'));

// ---------- Navbar shrink on scroll ----------
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 60) {
    nav.classList.add('navbar-scrolled');
  } else {
    nav.classList.remove('navbar-scrolled');
  }
}, { passive: true });

// ---------- Smooth-close mobile menu on link click ----------
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const toggler = document.querySelector('.navbar-toggler');
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('show')) toggler.click();
  });
});

// ---------- Copy to clipboard for bank number ----------
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.copy).then(() => {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-1"></i>¡Copiado!';
      btn.style.background = '#22c55e';
      setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 2000);
    });
  });
});
