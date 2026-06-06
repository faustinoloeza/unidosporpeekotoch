// ================================================================
// UNIDos por Peek Otoch — main.js
// ================================================================

const META_KILOS = 200;

async function leerKilos() {
  const ID = "1xI-cUk6zefHj2v1aK1_RcdgjAO3lE74lGaZbyyO6eLs";
  const url = `https://docs.google.com/spreadsheets/d/${ID}/gviz/tq?tqx=out:json&range=A2`;

  const resp = await fetch(url);
  const texto = await resp.text();

  // La respuesta viene como: /*O_o*/google.visualization.Query.setResponse({...});
  const json = JSON.parse(texto.substring(47).slice(0, -2));

  const valor = json.table.rows[0].c[0].v;
  return valor;
}

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
function animateProgress(kilosActuales) {
  const fill    = document.getElementById('progressFill');
  const counter = document.getElementById('kgActual');
  const pct     = Math.min((kilosActuales / META_KILOS) * 100, 100);

  let current = 0;
  const fps   = 60;
  const dur   = 1800; // ms
  const steps = (fps * dur) / 1000;
  const inc   = kilosActuales / steps;

  const ticker = setInterval(() => {
    current = Math.min(current + inc, kilosActuales);
    counter.textContent = Math.floor(current);
    if (current >= kilosActuales) clearInterval(ticker);
  }, 1000 / fps);

  setTimeout(() => { fill.style.width = pct + '%'; }, 200);

  document.getElementById('progressPct').textContent = Math.round(pct) + '%';
}

// Only run animation when hero enters viewport
const heroObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      heroObserver.disconnect();
      leerKilos()
        .then(kilos => animateProgress(kilos ?? 0))
        .catch(() => animateProgress(0));
    }
  },
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
