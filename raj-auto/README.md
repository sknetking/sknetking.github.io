# Raj Auto Garage - Static Website

A modern, responsive static website for a multi-brand Bike & Auto Garage specializing in Petrol and Electric vehicle repair. Built with pure HTML5, CSS3, and minimal JavaScript.

## 📋 Project Structure

```
bike-garage/
├── index.html          # Home page
├── services.html       # Services listing page
├── about.html          # About Us page
├── contact.html        # Contact & Location page
├── style.css           # Main stylesheet (responsive design)
├── script.js           # JavaScript for interactivity
└── README.md           # This file
```

## ✨ Features

- **Pure HTML5, CSS3, and JavaScript** - No frameworks or backend required
- **Fully Responsive Design** - Mobile-first approach with Flexbox and Grid
- **Dark Theme** - Professional mechanic-friendly color scheme (black/orange/gray)
- **WhatsApp Integration** - Direct click-to-chat CTAs with pre-filled messages
- **SEO Friendly** - Proper meta tags and semantic HTML
- **Fast Loading** - Minimal dependencies, optimized performance
- **Accessibility** - Proper heading hierarchy, semantic elements
- **Mobile Menu Toggle** - Hamburger menu for small screens
- **Smooth Animations** - Fade-in effects on scroll

## 📄 Page Details

### Home Page (index.html)
- **Hero Section** with compelling headline and CTA
- **Key Services** section (3 core offerings)
- **Value Proposition** highlighting key benefits
- **Testimonial Snippet** for social proof

### Services Page (services.html)
- Detailed service categories (6 services)
- Service details with feature lists
- Pricing disclaimer and quote CTA

### About Page (about.html)
- Company mission and vision
- Why Choose Us section
- Expertise areas
- Call-to-action

### Contact Page (contact.html)
- Primary WhatsApp CTA
- Contact information and operating hours
- Service area details
- FAQ section
- Map placeholder for Google Maps embed

## 🔗 WhatsApp Integration

All CTA buttons link to WhatsApp with pre-filled messages:

| Button | Message |
|--------|---------|
| Request Doorstep Pickup | "Hello, I need a doorstep pickup for a bike service." |
| Book Service / Get Quote | "I need a quote for a service. My bike is a [Type]." |
| Contact Us | "Hello, I have a general inquiry for the garage." |

**Phone Number:** +91 8957514343 (Replace with actual number)

## 🎨 Design Features

### Color Scheme
- **Primary Color:** #ff6b35 (Orange)
- **Secondary Color:** #1a1a1a (Dark Gray/Black)
- **Text Light:** #f0f0f0
- **Accent:** #ffa500

### Typography
- Primary Font: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Responsive font sizes (scales down on mobile)

### Layout
- Max-width container: 1200px
- Mobile-first responsive approach
- CSS Grid and Flexbox for layouts
- 3-column layouts on desktop, 1-column on mobile

## 📱 Responsive Breakpoints

- **Desktop:** 1200px and above
- **Tablet:** 768px - 1199px
- **Mobile:** 480px - 767px
- **Small Mobile:** Below 480px

## 🚀 Deployment to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "+" > "New repository"
3. Name it: `yourusername.github.io` (replace with your username)
4. Choose "Public"
5. Click "Create repository"

### Step 2: Upload Files
Using Git:
```bash
# Clone the repository
git clone https://github.com/yourusername/yourusername.github.io.git

# Navigate to the folder
cd yourusername.github.io

# Copy all files from bike-garage to this directory
# (index.html, services.html, about.html, contact.html, style.css, script.js)

# Stage all changes
git add .

# Commit
git commit -m "Initial commit - Raj Auto Garage website"

# Push to GitHub
git push origin main
```

### Step 3: Configure GitHub Pages
1. Go to your repository settings
2. Scroll to "GitHub Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"
6. Wait 2-3 minutes for deployment

### Step 4: Access Your Site
Your website will be live at: `https://yourusername.github.io`

**Alternative Deployment via GitHub Web UI:**
1. Go to your repository
2. Click "Add file" > "Upload files"
3. Drag and drop all files
4. Click "Commit changes"
5. Site will auto-deploy within minutes

## 🔧 Customization Guide

### Change Business Name & Contact
In all HTML files, search and replace:
- `Raj Auto Garage` → Your business name
- `+91 8957514343` → Your WhatsApp number
- `Raj Auto` → Your brand name

### Update Colors
In `style.css`, modify `:root` variables:
```css
:root {
    --primary-color: #ff6b35;      /* Orange */
    --secondary-color: #1a1a1a;    /* Dark */
    --text-light: #f0f0f0;         /* Light text */
    /* ... more colors ... */
}
```

### Add Images
Replace placeholder images:
```html
<!-- Old -->
<div class="placeholder-image">Image Placeholder</div>

<!-- New -->
<img src="path/to/your/image.jpg" alt="Description">
```

### Add Google Maps
In `contact.html`, replace the map placeholder:
```html
<!-- Old -->
<div class="placeholder-map">...</div>

<!-- New -->
<iframe src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE" ...></iframe>
```

To get embed code:
1. Go to [Google Maps](https://maps.google.com)
2. Search for your location
3. Click "Share" > "Embed a map"
4. Copy the embed code

### Customize Phone Number
Search for `918957514343` in all files and replace with your actual WhatsApp Business number (without spaces or dashes, with country code).

### Update Social Media Links
In footer, update:
```html
<a href="https://facebook.com/yourpage">f</a>
<a href="https://instagram.com/yourprofile">📷</a>
<a href="https://wa.me/your-number">💬</a>
```

## 📊 SEO Optimization

The website includes:
- Proper meta descriptions
- Keywords for each page
- Semantic HTML5 elements
- Mobile-friendly design (mobile-first)
- Fast loading (no heavy frameworks)
- Structured heading hierarchy

### Further SEO:
1. Submit sitemap to Google Search Console
2. Add Google Analytics tracking
3. Use Google My Business for local SEO
4. Add schema markup for local business

## 📞 Contact CTAs

Every page includes strategic WhatsApp CTAs:
- **Header:** "Book Service" button
- **Home Hero:** "Request Doorstep Pickup"
- **Services:** "Click to Chat for Custom Quote"
- **Contact:** "Message on WhatsApp"

## 🎯 Conversion Optimization

- Clear value proposition on home page
- Multiple CTAs throughout
- Trust signals (testimonials, quality guarantee)
- Mobile-optimized forms and buttons
- Fast loading times
- Easy navigation

## 🔒 Security Notes

- No user data collection (static site)
- No backend vulnerabilities
- HTTPS automatically enabled on GitHub Pages
- Regular backup via GitHub

## 📈 Analytics (Optional)

To add Google Analytics:

1. Sign up at [Google Analytics](https://analytics.google.com)
2. Create a property for your domain
3. Copy the GA4 tracking code
4. Add to `<head>` of all HTML files:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

## 🐛 Troubleshooting

**Site not showing up?**
- Wait 5-10 minutes for GitHub Pages to deploy
- Check repository name is `username.github.io`
- Verify repository is public
- Check GitHub Pages is enabled in settings

**WhatsApp links not working?**
- Ensure phone number has country code (91 for India)
- Test link: `https://wa.me/918957514343`
- Make sure it's opened on device with WhatsApp

**Mobile menu not working?**
- Check `script.js` is loaded
- Verify browser console for errors (F12)
- Try clearing browser cache

## 📝 License

This template is provided as-is for business use.

## 🤝 Support

For issues or customization help:
1. Check all phone numbers are correct
2. Verify file names match exactly
3. Test on different browsers and devices
4. Check browser console (F12) for errors

---

**Version:** 1.0  
**Created:** November 2025  
**Hosting:** GitHub Pages (github.io)

Enjoy your professional static website! 🚗🏍️
