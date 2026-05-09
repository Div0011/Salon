/* ─────────────────────────────────────────────
   Lumière Studio — script.js
───────────────────────────────────────────── */

// ── Interactive Background Canvas with Dynamic Polka Dots ──
const canvas = document.getElementById('interactive-bg');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let polkaDots = [];
const dotCount = prefersReducedMotion ? 0 : 60;
let scrollVelocity = 0;
let lastScrollY = 0;

class PoljaDot {
  constructor() {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.baseSize = Math.random() * 8 + 3;
    this.size = this.baseSize;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.15;
    this.baseOpacity = this.opacity;
    this.color = ['#c9929a', '#9e6b75', '#e8b4b0', '#d4b896', '#f2d4d0'][Math.floor(Math.random() * 5)];
    this.scale = 1;
    this.breathingPhase = Math.random() * Math.PI * 2;
  }

  update(mouseX, mouseY, scrollAmount) {
    // Gentle breathing animation
    this.breathingPhase += 0.01;
    const breathe = Math.sin(this.breathingPhase) * 0.15 + 1;
    
    // Drift movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen
    if (this.x < -20) this.x = canvasWidth + 20;
    if (this.x > canvasWidth + 20) this.x = -20;
    if (this.y < -20) this.y = canvasHeight + 20;
    if (this.y > canvasHeight + 20) this.y = -20;

    // Distance to cursor
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Ripple effect on mouse movement
    const interactionRadius = 200;
    if (distance < interactionRadius) {
      const strength = 1 - (distance / interactionRadius);
      this.scale = 1 + strength * 0.6; // Scale up near cursor
      this.opacity = this.baseOpacity + strength * 0.3;
    } else {
      this.scale = breathe; // Breathing effect when not interacting
      this.opacity = this.baseOpacity;
    }
    
    // Scroll-triggered ripple
    if (Math.abs(scrollVelocity) > 0.5) {
      const scrollEffect = Math.min(0.5, Math.abs(scrollVelocity) / 10);
      this.scale = Math.max(this.scale, 1 + scrollEffect * 0.4);
      this.opacity = Math.min(1, this.opacity + scrollEffect * 0.2);
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseSize * this.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Initialize polka dots
for (let i = 0; i < dotCount; i++) {
  polkaDots.push(new PoljaDot());
}

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  scrollVelocity = currentScrollY - lastScrollY;
  lastScrollY = currentScrollY;
}, { passive: true });

let rafBgId = null;
function animateBackground() {
  if (prefersReducedMotion) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  polkaDots.forEach(dot => {
    dot.update(mouseX, mouseY, scrollVelocity);
    dot.draw();
  });

  rafBgId = requestAnimationFrame(animateBackground);
}

function startBackgroundLoop() {
  if (prefersReducedMotion) return;
  if (rafBgId) cancelAnimationFrame(rafBgId);
  animateBackground();
}

function stopBackgroundLoop() {
  if (rafBgId) cancelAnimationFrame(rafBgId);
  rafBgId = null;
}

startBackgroundLoop();

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') stopBackgroundLoop();
  else startBackgroundLoop();
});

window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
});

// ── Custom Cursor with Petal Formation ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

// Create petals container for cursor
const cursorPetalsContainer = document.createElement('div');
cursorPetalsContainer.id = 'cursor-petals';
cursorPetalsContainer.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9997;';
document.body.insertBefore(cursorPetalsContainer, document.body.firstChild);

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  
  // Create petals at cursor position randomly
  if (Math.random() > 0.7) {
    createCursorPetal(mx, my);
  }
});

function createCursorPetal(x, y) {
  const petal = document.createElement('div');
  petal.className = 'cursor-petal';
  const size = 4 + Math.random() * 8;
  const angle = Math.random() * Math.PI * 2;
  const distance = 3 + Math.random() * 8;
  const offsetX = Math.cos(angle) * distance;
  const offsetY = Math.sin(angle) * distance;
  
  petal.style.cssText = `
    position: absolute;
    left: ${x + offsetX}px;
    top: ${y + offsetY}px;
    width: ${size}px;
    height: ${size}px;
    background: radial-gradient(circle, var(--blush), var(--rose));
    border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    opacity: 0.7;
    pointer-events: none;
    animation: fallPetal ${2 + Math.random() * 2}s ease-out forwards;
  `;
  
  cursorPetalsContainer.appendChild(petal);
  
  setTimeout(() => petal.remove(), 4000);
}

(function followLoop() {
  if (prefersReducedMotion) return;
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(followLoop);
})();

if (!prefersReducedMotion) {
  document.querySelectorAll('a, button, .pkg-tab, .testi-dot, .gallery-item, .nav-link').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; follower.style.opacity = '0'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; follower.style.opacity = '1'; });
  });
}

// ── Sticky Nav with Hide/Show on Scroll ──
const nav = document.getElementById('nav');
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
  let currentScroll = window.scrollY;
  
  if (currentScroll > 60) {
    if (currentScroll > lastScrollTop) {
      // Scrolling DOWN - hide nav
      nav.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling UP - show nav
      nav.style.transform = 'translateY(0)';
    }
  } else {
    nav.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  
  // Clear existing timeout
  clearTimeout(scrollTimeout);
  
  // Show nav after scrolling stops
  scrollTimeout = setTimeout(() => {
    if (currentScroll > 60) {
      nav.style.transform = 'translateY(0)';
    }
  }, 800);
  
  nav.classList.toggle('scrolled', currentScroll > 60);
});

// ── Mobile Menu ──
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open');
  mobileMenu.style.display = mobileMenu.classList.contains('open') ? 'flex' : 'none';
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    mobileMenu.style.display = 'none';
    burger.setAttribute('aria-expanded', 'false');
  }
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.style.display = 'none';
  });
});

// ── Hero Image Ken Burns ──
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');
}

// ── Falling Petals (Extended throughout page) ──
const petalsContainer = document.getElementById('petals');
const PETAL_COUNT = 30;

function createPetals() {
  if (prefersReducedMotion) return;
  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 8 + Math.random() * 14;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${-20 - Math.random() * 100}px;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${0.4 + Math.random() * 0.5};
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    `;
    petalsContainer.appendChild(p);
  }
}

createPetals();

// ── Scroll Reveal (IntersectionObserver) ──
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
      let delay = 0;
      siblings.forEach(sib => {
        if (sib === entry.target) {
          setTimeout(() => entry.target.classList.add('visible'), delay);
        }
        delay += 80;
      });
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObs.observe(el));

// ── Package Tabs ──
const tabs = document.querySelectorAll('.pkg-tab');
const clientGrid = document.getElementById('pkgClients');
const studentGrid = document.getElementById('pkgStudents');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    if (tab.dataset.tab === 'clients') {
      clientGrid.classList.remove('hidden');
      studentGrid.classList.add('hidden');
    } else {
      studentGrid.classList.remove('hidden');
      clientGrid.classList.add('hidden');
    }
    // re-trigger reveal on newly visible cards
    document.querySelectorAll('#pkgStudents .reveal-up, #pkgClients .reveal-up').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 100);
    });
  });
});

// ── Testimonials Slider ──
const track = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('testiDots');
let currentSlide = 0;
const cards = document.querySelectorAll('.testi-card');
const totalSlides = Math.ceil(cards.length / 1);

// Create dots
for (let i = 0; i < cards.length; i++) {
  const dot = document.createElement('button');
  dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}

function goToSlide(idx) {
  currentSlide = Math.max(0, Math.min(idx, cards.length - 1));
  const cardWidth = cards[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

// Auto-advance
setInterval(() => goToSlide((currentSlide + 1) % cards.length), 4500);

// Touch swipe
let startX = 0;
track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
track.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
});

// ── Contact Form ──
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  setTimeout(() => {
    form.reset();
    successMsg.classList.remove('hidden');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    setTimeout(() => successMsg.classList.add('hidden'), 5000);
  }, 1200);
});

// ── Smooth active nav link ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const linkObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(s => linkObs.observe(s));

// ── High-end scroll effects engine (fade/zoom/parallax + premium blur) ──
(function initScrollEffects() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const els = Array.from(document.querySelectorAll('[data-scroll]'));
  if (!els.length) return;

  const vh = () => window.innerHeight;
  const vCenter = () => vh() * 0.5;

  // Set initial states
  if (!prefersReduced) {
    els.forEach(el => {
      const effect = el.dataset.scroll || 'fade';
      const baseOpacity = el.dataset.baseOpacity;
      const initialTransform = el.dataset.initialTransform;

      if ((effect.startsWith('fade') || effect === 'fade') && baseOpacity != null) {
        el.style.opacity = baseOpacity;
      }
      if (initialTransform) {
        el.style.transform = initialTransform;
      }
    });
  }

  let rafId = null;
  const tick = () => {
    rafId = null;

    const viewH = vh();
    const center = vCenter();

    els.forEach(el => {
      if (prefersReduced) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
        return;
      }

      const effect = el.dataset.scroll || 'fade';
      const intensity = parseFloat(el.dataset.intensity || '1');
      const depth = parseFloat(el.dataset.depth || '1');
      const blur = parseFloat(el.dataset.blur || '0');
      const rotate = parseFloat(el.dataset.rotate || '0');

      const outFade = el.dataset.outFade !== 'false';

      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height * 0.5;
      const dist = (elCenter - center) / (viewH * 0.55); // ~ -1..1

      // 0..1 visibility: 1 near center, 0 when far away
      const visibilityRaw = 1 - Math.min(1, Math.max(0, Math.abs(dist)));

      // entry/exit window tuning
      const enterZone = parseFloat(el.dataset.enterZone || '0.85');
      const exitZone = parseFloat(el.dataset.exitZone || '0.15');
      let visibility = visibilityRaw;
      visibility = (visibility - exitZone) / (enterZone - exitZone);
      visibility = Math.min(1, Math.max(0, visibility));

      const eased = visibility * visibility * (3 - 2 * visibility); // smoothstep

      // Opacity
      const baseOpacity = parseFloat(el.dataset.baseOpacity || '0');
      const maxOpacity = parseFloat(el.dataset.maxOpacity || '1');

      let alpha;
      if (effect.startsWith('fade')) {
        alpha = baseOpacity + (maxOpacity - baseOpacity) * eased;
      } else {
        alpha = 0.25 + 0.75 * eased;
      }

      if (outFade) {
        const leave = Math.min(1, Math.max(0, (Math.abs(dist) - 0.2) / 0.9));
        alpha = alpha * (1 - leave * 0.85);
      }
      el.style.opacity = String(alpha);

      // Transform
      let tx = parseFloat(el.dataset.x || '0');
      let ty = parseFloat(el.dataset.y || '0');

      let translateX = 0;
      let translateY = 0;
      let scale = parseFloat(el.dataset.scale || '1');
      let rot = 0;
      let blurPx = 0;

      if (effect === 'parallax' || effect === 'image-parallax') {
        translateY = (-dist * 18 * intensity * depth) + ty;
        translateX = (dist * 6 * intensity * depth) + tx;
        scale = 1 + (1 - eased) * 0.06 * intensity;
        rot = rotate * (1 - eased) * 0.15;
        blurPx = blur * (1 - eased);
      } else if (effect === 'zoom') {
        translateY = ty;
        translateX = tx;
        scale = 1 + (1 - eased) * 0.14 * intensity * depth;
        rot = rotate * (1 - eased);
        blurPx = blur * (1 - eased);
      } else if (effect === 'fade-up') {
        translateY = (1 - eased) * 44 * intensity + ty;
        translateX = (1 - eased) * -8 * intensity + tx;
        scale = 1 + (1 - eased) * 0.03 * intensity;
        rot = rotate * (1 - eased);
        blurPx = blur * (1 - eased);
      } else if (effect === 'fade-down') {
        translateY = -(1 - eased) * 44 * intensity + ty;
        translateX = (1 - eased) * 8 * intensity + tx;
        scale = 1 + (1 - eased) * 0.03 * intensity;
        rot = rotate * (1 - eased);
        blurPx = blur * (1 - eased);
      } else if (effect === 'fade') {
        translateY = (1 - eased) * 22 * intensity + ty;
        translateX = (1 - eased) * tx;
        scale = parseFloat(el.dataset.scale || '1') + (1 - eased) * 0.03 * intensity;
        rot = rotate * (1 - eased);
        blurPx = blur * (1 - eased);
      } else {
        // generic reveal
        translateY = (1 - eased) * 36 * intensity + ty;
        translateX = (1 - eased) * 10 * intensity + tx;
        scale = 1 + (1 - eased) * 0.06 * intensity;
        rot = rotate * (1 - eased);
        blurPx = blur * (1 - eased);
      }

      el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rot}deg) scale(${scale})`;
      el.style.filter = blurPx > 0.01 ? `blur(${Math.min(12, blurPx)}px)` : 'none';
    });
  };

  const onScroll = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// ── Gallery Parallax + Caption Reveal ──
(function initGalleryEffects() {
  const galleryItems = document.querySelectorAll('.gallery-item[data-parallax]');
  if (!galleryItems.length) return;

  const preferredReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const captionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.25 });

  galleryItems.forEach(item => captionObserver.observe(item));

  let galleryFrameId = null;

  const updateGalleryParallax = () => {
    galleryFrameId = null;
    if (preferredReducedMotion) return;

    const viewportCenter = window.innerHeight * 0.5;

    galleryItems.forEach(item => {
      const img = item.querySelector('.gallery-img');
      if (!img) return;

      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height * 0.5;
      const distanceFromCenter = (itemCenter - viewportCenter) / window.innerHeight;
      const parallaxFactor = parseFloat(item.dataset.parallax) || 0.1;
      const translateY = Math.max(-36, Math.min(36, -distanceFromCenter * 72 * parallaxFactor));

      img.style.transform = `translate3d(0, ${translateY}px, 0) scale(1.1)`;
    });
  };

  const requestGalleryUpdate = () => {
    if (galleryFrameId) return;
    galleryFrameId = requestAnimationFrame(updateGalleryParallax);
  };

  window.addEventListener('scroll', requestGalleryUpdate, { passive: true });
  window.addEventListener('resize', requestGalleryUpdate);
  requestGalleryUpdate();
})();

