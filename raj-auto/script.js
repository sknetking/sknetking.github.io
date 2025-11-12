// ============================================
// RAJ AUTO GARAGE - JAVASCRIPT
// Mobile Menu Toggle & Interactivity
// ============================================

// ========== FIXED ACTION BUTTONS ==========
// WhatsApp Button Handler
const whatsappBtn = document.getElementById('whatsappBtn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        const whatsappURL = 'https://wa.me/918957514343?text=Hello%20Raj%20Auto%20Garage%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.';
        window.open(whatsappURL, '_blank');
    });
}

// Share Button Handler (Web Share API)
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Raj Auto Garage',
            text: 'Expert Bike Repair & Maintenance - Quality Service at Transparent Prices with Free Doorstep Pickup & Drop!',
            url: window.location.href
        };

        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Share successful');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share error:', err);
                }
            }
        } else {
            // Fallback: Copy URL to clipboard
            fallbackShare(shareData.url);
        }
    });
}

// Fallback share function (copy to clipboard)
function fallbackShare(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Link copied to clipboard! You can share it now.');
    } catch (err) {
        console.error('Copy failed:', err);
        alert('Unable to copy. Please try again.');
    }
    
    document.body.removeChild(textArea);
}

// ========== MOBILE MENU TOGGLE ==========
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('navList');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-menu') && !event.target.closest('.hamburger')) {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
    }
});

// Active Link Highlighting
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveLink);

// Smooth Scroll for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Scroll Animation for Elements (Fade In)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and other elements
document.querySelectorAll('.service-card, .value-item, .service-item, .faq-item, .choose-item, .expertise-item, .mission-item, .info-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form Validation (if needed in future)
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(phone);
}

// WhatsApp URL Generator (for dynamic messages if needed)
function generateWhatsAppURL(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Example usage:
// const whatsappUrl = generateWhatsAppURL('918957514343', 'Hello, I need a service');
// window.open(whatsappUrl, '_blank');

// Analytics Event Tracking (optional)
document.querySelectorAll('.btn-primary, .cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Log CTA clicks for analytics
        console.log('CTA Button Clicked:', btn.textContent);
        
        // If you're using Google Analytics or similar:
        // gtag('event', 'cta_click', { 'button_text': btn.textContent });
    });
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close menu on Escape
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
    }
});

// Initialize Slick Slider for Testimonials
$(document).ready(function() {
    $('.testimonials-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: false,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false
                }
            }
        ]
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Raj Auto Garage website loaded successfully!');
    
    // You can add any additional initialization here
    // e.g., Load fonts, initialize plugins, set up tracking, etc.
});

// Utility: Scroll to top button (optional)
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show scroll-to-top button on scroll
window.addEventListener('scroll', () => {
    // You can add a scroll-to-top button here if needed
    if (window.scrollY > 300) {
        // Show button
    }
});

// Prevent accidental form submission on dynamically generated forms
document.addEventListener('submit', (e) => {
    // Add custom validation or prevent default behavior if needed
});
