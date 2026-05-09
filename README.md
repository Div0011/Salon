# Élégance Beauty Studio Website

A high-end, elegant salon website featuring a sophisticated pastel color palette and smooth scroll-based interactions. Perfect for beauty professionals offering makeup, makeover, training, and coaching services.

## ✨ Features

### Design Elements
- **Pastel Color Palette**: Soft pinks, lavenders, peaches, and mints creating an elegant, feminine aesthetic
- **Scroll-Based Navigation**: Smooth scrolling with reveal animations as you explore
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Modern Typography**: Elegant serif headings (Cormorant Garamond) paired with clean sans-serif body text (Montserrat)

### Sections Included

1. **Hero Section**: Eye-catching introduction with gradient background and call-to-action buttons
2. **About Section**: Personal story with statistics and professional credentials
3. **Services Section**: 6 signature services with hover effects
4. **Packages Section**: 3 curated packages (Radiance, Glamour, Bridal Bliss) with pricing
5. **Training Section**: Professional courses and certification programs
6. **Gallery Section**: Portfolio showcase with hover overlays
7. **Testimonials**: Client reviews with star ratings
8. **Contact Section**: Contact form with location, phone, and email details
9. **Footer**: Complete site navigation and social links

## 🎨 Color Palette

```css
Pastel Pink: #FFE5EC
Pastel Lavender: #E5D9F2
Pastel Peach: #FFD6BA
Pastel Mint: #D4F1F4
Pastel Rose: #FFC8DD
Pastel Lilac: #CDB4DB
Pastel Cream: #FFF8F0
Accent Rose Gold: #B76E79
Accent Gold: #D4AF37
```

## 🚀 Getting Started

### Installation

1. Download all files to your project folder:
   - `index.html`
   - `styles.css`
   - `script.js`

2. Open `index.html` in your web browser

3. No build process or dependencies required!

### Customization

#### Update Content

**Business Name & Branding**
- Search for "Élégance" in `index.html` and replace with your salon name
- Update the logo in the navigation section

**Contact Information**
- Update address, phone, and email in the Contact section
- Modify social media links in the footer

**Services & Packages**
- Edit service descriptions in the Services section
- Update package names, prices, and features
- Modify course offerings in the Training section

#### Add Images

Replace the placeholder backgrounds with your actual images:

```html
<!-- Example: Replace in About section -->
<div class="image-placeholder" style="background-image: url('your-image.jpg');">
```

For the gallery, add images to each gallery item:

```html
<div class="gallery-placeholder" style="background-image: url('gallery-1.jpg');">
```

#### Customize Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --pastel-pink: #FFE5EC;
    --pastel-lavender: #E5D9F2;
    /* Modify these to match your brand */
}
```

## 📱 Responsive Breakpoints

- Desktop: 1024px and above
- Tablet: 768px - 1023px
- Mobile: Below 768px

## ⚡ Performance Features

- Smooth scroll animations with RequestAnimationFrame
- Intersection Observer for reveal animations
- Lazy loading support for images
- Optimized CSS with minimal dependencies

## 🎯 Interactive Features

### Navigation
- Fixed navbar with scroll effect
- Smooth scrolling to sections
- Active link highlighting

### Animations
- Fade-in hero section
- Scroll-triggered reveal animations
- Hover effects on cards and buttons
- Parallax background effects

### Forms & Buttons
- Contact form with validation
- Package selection with confirmation
- Course enrollment functionality
- Book Now button scrolls to contact

## 🛠️ Customization Tips

### Change Fonts
Replace the Google Fonts link in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

Update CSS variables:
```css
--font-heading: 'YourHeadingFont', serif;
--font-body: 'YourBodyFont', sans-serif;
```

### Adjust Spacing
Modify the section padding:

```css
:root {
    --section-padding: 120px; /* Change this value */
}
```

### Add New Sections
Follow the existing section structure:

```html
<section id="new-section" class="new-section">
    <div class="container">
        <div class="section-header reveal">
            <span class="section-label">Label</span>
            <h2 class="section-title">Title</h2>
        </div>
        <!-- Your content -->
    </div>
</section>
```

## 📧 Form Integration

The contact form currently logs to console. To integrate with a backend:

### Option 1: FormSpree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: Netlify Forms
```html
<form name="contact" method="POST" data-netlify="true">
```

### Option 3: Custom Backend
Modify the form submission handler in `script.js`:

```javascript
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    
    // Send to your API
    await fetch('your-api-endpoint', {
        method: 'POST',
        body: formData
    });
});
```

## 🌟 Best Practices

1. **Images**: Use high-quality images (minimum 1920px width for hero)
2. **Optimization**: Compress images before uploading (use TinyPNG or similar)
3. **SEO**: Update meta tags in the `<head>` section
4. **Accessibility**: Maintain color contrast ratios for readability
5. **Testing**: Test on multiple devices and browsers

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Inspiration

This website draws inspiration from:
- High-end beauty and fashion websites
- Modern scroll-based experiences
- Elegant pastel aesthetics
- Luxury brand presentations

## 📝 License

Free to use for personal and commercial projects. Attribution appreciated but not required.

## 💡 Tips for Success

1. **Professional Photography**: Invest in high-quality photos of your work
2. **Consistent Branding**: Use your brand colors throughout
3. **Clear CTAs**: Make booking and contact options prominent
4. **Social Proof**: Add real testimonials and before/after photos
5. **Regular Updates**: Keep your portfolio and services current

## 🤝 Support

For questions or customization help, refer to the inline comments in the code files.

---

**Built with ❤️ for beauty professionals who deserve a stunning online presence**
