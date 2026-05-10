/* ─────────────────────────────────────────────
   Lumière Studio — script.js
───────────────────────────────────────────── */

// ── Interactive Background Canvas ──
const canvas = document.getElementById('interactive-bg');
const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let polkaDots = [];
// More dots, bigger, bolder
const dotCount = prefersReducedMotion ? 0 : 90;
let scrollVelocity = 0;
let lastScrollY = 0;

// Palette: mix of DARK mauve/rose tones and VERY LIGHT near-white tones for contrast
const DOT_PALETTE = [
  // Dark/rich tones
  '#7a3f4a', '#9e6b75', '#6b3d47', '#c9929a', '#5c2e38',
  // Medium tones
  '#c9a96e', '#b87a85', '#d4b896', '#9e6b75',
  // Very light / near-white
  '#fde8ea', '#fff0f2', '#fdf4f0', '#ffe4e8', '#f9e0dc',
];

class PolkaDot {
  constructor() {
    this.reset(true);
  }

  reset(init = false) {
    this.x = Math.random() * canvasWidth;
    this.y = init ? Math.random() * canvasHeight : -100;
    const sizeClass = Math.random();
    if (sizeClass < 0.25)      this.baseSize = Math.random() * 40 + 55;
    else if (sizeClass < 0.55) this.baseSize = Math.random() * 30 + 25;
    else                       this.baseSize = Math.random() * 18 + 8;
    this.size = this.baseSize;
    this.speedX = (Math.random() - 0.5) * 0.18;
    this.speedY = (Math.random() - 0.5) * 0.18;
    const colIdx = Math.floor(Math.random() * DOT_PALETTE.length);
    this.color = DOT_PALETTE[colIdx];
    const isLight = colIdx >= 9;
    this.baseOpacity = isLight ? Math.random() * 0.35 + 0.45 : Math.random() * 0.30 + 0.30;
    this.opacity = this.baseOpacity;
    this.scale = 1;
    this.breathingPhase = Math.random() * Math.PI * 2;
    this.breatheSpeed = 0.006 + Math.random() * 0.008;
    this._grad = null;
    this._gradR = 0;
  }

  update(mouseX, mouseY, rebuildGrad) {
    this.breathingPhase += this.breatheSpeed;
    const breathe = Math.sin(this.breathingPhase) * 0.12 + 1;

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < -120) this.x = canvasWidth + 120;
    if (this.x > canvasWidth + 120) this.x = -120;
    if (this.y < -120) this.y = canvasHeight + 120;
    if (this.y > canvasHeight + 120) this.y = -120;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const interactionRadius = 260;

    if (distance < interactionRadius) {
      const strength = 1 - (distance / interactionRadius);
      this.scale = 1 + strength * 0.7;
      this.opacity = Math.min(0.95, this.baseOpacity + strength * 0.35);
    } else {
      this.scale = breathe;
      this.opacity = this.baseOpacity;
    }

    if (Math.abs(scrollVelocity) > 1) {
      const scrollEffect = Math.min(0.5, Math.abs(scrollVelocity) / 8);
      this.scale = Math.max(this.scale, 1 + scrollEffect * 0.5);
      this.opacity = Math.min(0.95, this.opacity + scrollEffect * 0.15);
    }
  }

  draw() {
    const r = Math.max(1, this.baseSize * this.scale);
    
    // Rebuild gradient if radius changed significantly or if it's null
    // We use translate(x,y) so the gradient can be defined at (0,0)
    if (!this._grad || Math.abs(this._gradR - r) > 1) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0,    hexToRgba(this.color, 1));
      g.addColorStop(0.55, hexToRgba(this.color, 0.6));
      g.addColorStop(1,    hexToRgba(this.color, 0));
      this._grad = g;
      this._gradR = r;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this._grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

// Helper to convert hex + alpha to rgba string
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

for (let i = 0; i < dotCount; i++) {
  polkaDots.push(new PolkaDot());
}

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });



// ── Lenis Smooth Scroll ──
const lenis = (typeof Lenis !== 'undefined') ? new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
}) : null;

// ── Single master RAF loop — drives Lenis + canvas ──
let masterFrameCount = 0;
function masterLoop(time) {
  masterFrameCount++;
  if (lenis) lenis.raf(time);

  // and only rebuilt every 12 frames (optimized from 6) to reduce GPU pressure
  if (!prefersReducedMotion) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const rebuildGrad = masterFrameCount % 12 === 0;
    polkaDots.forEach(dot => {
      dot.update(mouseX, mouseY, rebuildGrad);
      dot.draw();
    });
  }

  requestAnimationFrame(masterLoop);
}
requestAnimationFrame(masterLoop);

document.addEventListener('visibilitychange', () => {
  if (lenis) {
    document.visibilityState === 'hidden' ? lenis.stop() : lenis.start();
  }
});

// Feed Lenis scroll into scrollVelocity for dot burst effect
if (lenis) {
  lenis.on('scroll', ({ velocity }) => {
    scrollVelocity = velocity * 60;
  });
} else {
  document.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollVelocity = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
  }, { passive: true });
}

window.addEventListener('resize', () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  polkaDots.forEach(d => { d._grad = null; });
}, { passive: true });


// ── Custom Cursor (disabled) ──
// Feedback: remove the custom cursor dot.
// Keeping code removed to avoid runtime overhead and visual artifacts.





// ── Refined Nav Logic: Hide on Scroll, Minimal Button on Stop ──
const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');

// Debounced “scroll end” detection so:
// - header hides immediately while scrolling
// - burger (minimal state) appears only after scrolling stops
let scrollTimeout = null;
let isScrolling = false;

const SHOW_AT = 60; // matches existing CSS logic
const SCROLL_END_DELAY = 250; // how long without scroll before showing burger

const setFullNav = () => {
  nav.classList.remove('minimal');
  nav.classList.add('scrolled');
  nav.style.transform = 'translateY(0)';
};

const setMinimalNav = () => {
  // Ensure minimal burger is visible when scrolling stops
  nav.classList.add('minimal');
  nav.classList.add('scrolled');
  nav.style.transform = 'translateY(0)';
};

const hideFullNavWhileScrolling = () => {
  if (window.scrollY > SHOW_AT) {
    // Immediately hide header while scrolling
    nav.classList.remove('minimal');
    nav.style.transform = 'translateY(-100%)';
    nav.classList.add('scrolled');
  }
};

const updateNav = () => {
  const currentScroll = window.scrollY;

  // At top: full nav restored
  if (currentScroll <= SHOW_AT) {
    isScrolling = false;
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
    nav.classList.remove('scrolled', 'minimal');
    nav.style.transform = 'translateY(0)';
    return;
  }

  // While scrolling: hide full header
  if (!isScrolling) isScrolling = true;
  hideFullNavWhileScrolling();

  // Scroll end debounce
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
    setFullNav();
  }, SCROLL_END_DELAY);
};

if (lenis) {
  lenis.on('scroll', updateNav);
} else {
  window.addEventListener('scroll', updateNav, { passive: true });
}

// In case page loads mid-scroll
updateNav();

// ── High-End Full Screen Polka Dot Menu ──
const fsMenu = document.getElementById('fsMenu');
const menuDots = document.querySelectorAll('.menu-dot');

burger.addEventListener('click', () => {
  const isActive = fsMenu.classList.toggle('is-active');
  burger.classList.toggle('is-active');
  burger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  
  if (isActive) {
    if (lenis) lenis.stop();
    // Staggered entry for dots
    menuDots.forEach((dot, index) => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0) translateY(60px)';
      dot.style.transition = 'all 0.8s var(--ease)';
      setTimeout(() => {
        dot.style.opacity = '1';
        dot.style.transform = 'scale(1) translateY(0)';
      }, 150 + index * 80);
    });
  } else {
    if (lenis) lenis.start();
    // Quick exit
    menuDots.forEach(dot => {
      dot.style.opacity = '0';
      dot.style.transform = 'scale(0.8) translateY(-40px)';
    });
  }
});

// Close menu on link click, close button, or Escape
const closeBtn = document.getElementById('fsMenuClose');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    fsMenu.classList.remove('is-active');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  });
}

menuDots.forEach(dot => {
  dot.addEventListener('click', () => {
    fsMenu.classList.remove('is-active');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && fsMenu.classList.contains('is-active')) {
    fsMenu.classList.remove('is-active');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
});

// ── Hero Image Ken Burns ──
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');
}

// ── Falling Petals ──
const petalsContainer = document.getElementById('petals');
const PETAL_COUNT = 30;
function createPetals() {
  if (prefersReducedMotion) return;
  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 8 + Math.random() * 14;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      top:${-20 - Math.random() * 100}px;
      width:${size}px;height:${size}px;
      animation-duration:${6 + Math.random() * 10}s;
      animation-delay:${Math.random() * 8}s;
      opacity:${0.4 + Math.random() * 0.5};
      border-radius:${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    `;
    petalsContainer.appendChild(p);
  }
}
createPetals();

// ── Scroll Reveal (IntersectionObserver) — fade-up on enter, stay visible ──
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
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
}, { threshold: 0.10 });

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
    document.querySelectorAll('#pkgStudents .reveal-up,#pkgClients .reveal-up').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 100);
    });
  });
});

// ── Testimonials Marquee (Handled via CSS) ──
// Obsolete JS removed to prevent conflict with CSS marquee animation.

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

// ── Active Nav Link ──
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

// ── Section Fade-In on Scroll (sections fade up as they enter viewport, stay visible) ──
(function initSectionReveal() {
  if (prefersReducedMotion) return;

  // These are the full sections with data-scroll data-effect="fade"
  const fadeSections = document.querySelectorAll('section[data-scroll][data-effect="fade"]');

  // Set initial state: hidden below
  fadeSections.forEach(sec => {
    if (sec.id === 'hero') return; // hero is always visible
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(48px)';
    sec.style.transition = 'opacity 0.85s cubic-bezier(.4,0,.2,1), transform 0.85s cubic-bezier(.4,0,.2,1)';
  });

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObs.unobserve(entry.target); // stay visible once revealed
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  fadeSections.forEach(sec => {
    if (sec.id !== 'hero') sectionObs.observe(sec);
  });
})();

// ── Inner element parallax / subtle scroll effects (only for non-section elements) ──
(function initScrollEffects() {
  if (prefersReducedMotion) return;

  // Only apply to inner elements that have data-scroll but are NOT section-level fade containers
  const els = Array.from(document.querySelectorAll('[data-scroll]')).filter(el => {
    // Exclude the full section elements (they are handled by initSectionReveal)
    return el.tagName.toLowerCase() !== 'section';
  });

  if (!els.length) return;

  const vh = () => window.innerHeight;

  let rafId = null;
  const tick = () => {
    rafId = null;
    const viewH = vh();
    const center = viewH * 0.5;

    els.forEach(el => {
      const effect = el.dataset.effect || el.dataset.scroll || 'fade';
      const intensity = parseFloat(el.dataset.intensity || '1');
      const depth = parseFloat(el.dataset.depth || '1');
      const blur = parseFloat(el.dataset.blur || '0');
      const rotate = parseFloat(el.dataset.rotate || '0');

      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height * 0.5;
      const dist = (elCenter - center) / (viewH * 0.55);

      // Raw visibility 0..1
      const visibilityRaw = 1 - Math.min(1, Math.max(0, Math.abs(dist)));
      const enterZone = parseFloat(el.dataset.enterZone || '0.85');
      const exitZone = parseFloat(el.dataset.exitZone || '0.15');
      let visibility = (visibilityRaw - exitZone) / (enterZone - exitZone);
      visibility = Math.min(1, Math.max(0, visibility));
      const eased = visibility * visibility * (3 - 2 * visibility);

      // Only fade in from bottom, never fade out once visible
      // Track if element has already been shown
      if (!el._revealed) {
        const baseOpacity = parseFloat(el.dataset.baseOpacity || '0');
        const maxOpacity = parseFloat(el.dataset.maxOpacity || '1');
        const alpha = baseOpacity + (maxOpacity - baseOpacity) * eased;
        el.style.opacity = String(alpha);
        
        // Staggered reveal logic: don't mark as revealed until it's very clear
        if (eased >= 0.99) el._revealed = true;
      }

      let translateX = 0;
      let translateY = 0;
      let scale = 1;
      let rot = 0;
      let blurPx = 0;

      if (effect === 'image-parallax') {
        // True parallax: move the internal image, not the container
        const img = el.querySelector('img');
        if (img) {
          const imgTranslateY = (-dist * 35 * intensity * depth);
          const imgScale = 1.1 + (Math.abs(dist) * 0.1); 
          img.style.transform = `translate3d(0, ${imgTranslateY}px, 0) scale(${imgScale})`;
        }
        // Container entrance animation
        if (!el._revealed) {
          translateY = (1 - eased) * 40 * intensity;
        }
      } else if (effect === 'parallax') {
        translateY = (-dist * 16 * intensity * depth);
        translateX = (dist * 4 * intensity * depth);
        scale = 1 + (1 - eased) * 0.05 * intensity;
        rot = rotate * (1 - eased) * 0.1;
        blurPx = blur * (1 - eased);
      } else if (effect === 'fade-up') {
        if (!el._revealed) {
          translateY = (1 - eased) * 38 * intensity;
        }
        scale = 1 + (1 - eased) * 0.02 * intensity;
      } else if (effect === 'fade') {
        if (!el._revealed) {
          translateY = (1 - eased) * 18 * intensity;
        }
      }

      // Apply container transform (excluding image-parallax which moves its own image)
      if (effect !== 'image-parallax') {
        if (!el._revealed || effect === 'parallax') {
          el.style.transform = `translate3d(${translateX}px,${translateY}px,0) rotate(${rot}deg) scale(${scale})`;
        }
      } else {
        // For image-parallax, only apply the entrance transform to container
        if (!el._revealed) {
          el.style.transform = `translate3d(0,${translateY}px,0)`;
        } else {
          el.style.transform = 'none';
        }
      }

      el.style.filter = blurPx > 0.01 ? `blur(${Math.min(10, blurPx)}px)` : 'none';
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

  const captionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.2 });

  galleryItems.forEach(item => captionObserver.observe(item));

  let galleryFrameId = null;
  const updateGalleryParallax = () => {
    galleryFrameId = null;
    const viewportCenter = window.innerHeight * 0.5;
    galleryItems.forEach(item => {
      const img = item.querySelector('.gallery-img');
      if (!img) return;
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height * 0.5;
      const distanceFromCenter = (itemCenter - viewportCenter) / window.innerHeight;
      const parallaxFactor = parseFloat(item.dataset.parallax) || 0.1;
      const translateY = Math.max(-32, Math.min(32, -distanceFromCenter * 64 * parallaxFactor));
      img.style.transform = `translate3d(0,${translateY}px,0) scale(1.1)`;
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
