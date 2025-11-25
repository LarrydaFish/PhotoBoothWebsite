/* script.js
  - mobile menu toggle
  - smooth scroll
  - reveal on scroll
  - gallery lightbox
  - image focal helper (data-focal)
  - year auto update
*/

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', (!expanded).toString());
    if (mobileMenu.hasAttribute('hidden')) mobileMenu.removeAttribute('hidden');
    else mobileMenu.setAttribute('hidden', '');
  });

  // Close mobile menu links
  document.querySelectorAll('#mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.setAttribute('hidden', '');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = this.getAttribute('href');
      if (!target || target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu) mobileMenu.setAttribute('hidden', '');
      }
    });
  });

  // Reveal on scroll (simple IntersectionObserver)
  const revealEls = document.querySelectorAll('.animate-up, .animate-scale');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));

  // Lightbox gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lbClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-src') || btn.querySelector('img')?.src;
      const alt = btn.querySelector('img')?.alt || '';
      if (!src) return;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // close lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };
  lbClose && lbClose.addEventListener('click', closeLightbox);
  lightbox && lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });

  // Per-image focal helper for images with data-focal="X% Y%"
  document.querySelectorAll('img[data-focal]').forEach(img => {
    const f = img.getAttribute('data-focal').trim();
    if (f) {
      img.style.objectPosition = f;
      img.style.setProperty('--img-focal', f);
    }
  });

  // Update copyright year if present
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});



