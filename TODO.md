# TODO — Lumière Studio (High-end Rebuild)

## Plan verification (done)
- [x] Inspect current repo structure
- [x] Review `index.html`, `styles.css`, `script.js`, `README.md`, `TODO.md`
- [x] Confirm rebuild order: core UX first (hero/nav/footer), then interactive background & parallax/scroll effects, then visual polish and layout integrity

## Implementation steps
### 1) Core structure + layout integrity
- [ ] Verify hero/nav/footer rendering and spacing (no crumbled headings/text)
- [ ] Ensure white space exposes the intended background (no accidental solid backgrounds)
- [ ] Ensure all “card-like” blocks use curved edges (border-radius + overflow rules)

### 2) Interactive background first
- [ ] Optimize canvas polka dots: pause/slow when tab hidden and respect reduced motion
- [ ] Make custom cursor safe: disable/fallback on touch/coarse pointer and reduced motion

### 3) Parallax & scroll effects (major concepts)
- [ ] Audit current gallery parallax + reveal overlap
- [ ] Wire the existing `[data-scroll]` RAF engine by adding `data-scroll` attributes to appropriate elements
- [ ] Remove conflicts between IntersectionObserver reveal and RAF engine for the same nodes
- [ ] Ensure scroll engine degrades gracefully with JS disabled (CSS defaults)

### 4) Site “real look” polish
- [ ] Typography/spacing pass for every section (hero/about/services/packages/academy/testimonials/gallery/contact/footer)
- [ ] Add premium hover/focus-visible states for keyboard users
- [ ] Ensure images have correct visibility + sizing (no distortion)

### 5) Forms + interactions
- [ ] Add contact form basic validation + clear error/success states
- [ ] Improve mobile menu accessibility: aria-expanded + Escape to close

### 6) Performance & SEO basics
- [ ] Add lazy-loading / decoding/async / fetchpriority where appropriate
- [ ] Add/verify meta tags for SEO and social previews
- [ ] Confirm no layout shift from animations

### 7) Testing checklist
- [ ] Desktop: scroll through every section, verify nav highlighting
- [ ] Mobile: verify nav burger, scroll effects, gallery, and form
- [ ] Reduced motion: verify no heavy animations


