// ================================
// MAIN JAVASCRIPT FUNCTIONALITY
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initVideoLightbox();
    initSmoothScrolling();
    initLoadingAnimation();
    initFormHandling();
    initAnimationsOnScroll();
    initParallaxEffects();
});

// ================================
// NAVIGATION FUNCTIONALITY
// ================================

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation highlighting
    highlightActiveNav();
}

function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html') || 
            (currentPage === 'index.html' && href === '#home')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ================================
// SCROLL EFFECTS
// ================================

function initScrollEffects() {
    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.featured-work') || 
                              document.querySelector('section:not(.hero)');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Hide scroll indicator on scroll
    window.addEventListener('scroll', function() {
        if (scrollIndicator && window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ================================
// VIDEO LIGHTBOX FUNCTIONALITY
// ================================

function initVideoLightbox() {
    // Create lightbox if it doesn't exist
    createVideoLightbox();

    const featuredItems = document.querySelectorAll('.featured-item, .portfolio-item');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Add click listeners to featured items
    featuredItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoSrc = this.dataset.video;
            const videoType = this.dataset.videoType || 'mp4';
            
            if (videoSrc) {
                openVideoLightbox(videoSrc, videoType);
            } else {
                // Fallback: open a sample video or show message
                console.log('No video source provided for this item');
            }
        });
    });
}

function createVideoLightbox() {
    // Check if lightbox already exists
    if (document.querySelector('.video-lightbox')) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'video-lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <div class="lightbox-close">
                <i class="fas fa-times"></i>
            </div>
            <video class="lightbox-video" controls>
                <source src="" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;
    
    document.body.appendChild(lightbox);

    // Close lightbox functionality
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeVideoLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeVideoLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeVideoLightbox();
        }
    });
}

function openVideoLightbox(videoSrc, videoType = 'mp4') {
    const lightbox = document.querySelector('.video-lightbox');
    const video = lightbox.querySelector('.lightbox-video');
    const source = video.querySelector('source');
    
    source.src = videoSrc;
    source.type = `video/${videoType}`;
    video.load();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Play video after a short delay
    setTimeout(() => {
        video.play().catch(e => console.log('Video autoplay prevented'));
    }, 300);
}

function closeVideoLightbox() {
    const lightbox = document.querySelector('.video-lightbox');
    const video = lightbox.querySelector('.lightbox-video');
    
    lightbox.classList.remove('active');
    video.pause();
    video.currentTime = 0;
    document.body.style.overflow = '';
}

// ================================
// SMOOTH SCROLLING
// ================================

function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// ================================
// LOADING ANIMATION
// ================================

function initLoadingAnimation() {
    // Create loading overlay
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);

    // Hide loading after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1000);
    });
}

// ================================
// FORM HANDLING
// ================================

function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (validateForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form handler)
                setTimeout(() => {
                    showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Please enter a valid name');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Please enter a message with at least 10 characters');
    }
    
    if (errors.length > 0) {
        showFormMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = message;
    
    // Add styles
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 8px;
        font-weight: 500;
        ${type === 'success' ? 
            'background: rgba(121, 87, 87, 0.1); color: #795757; border: 1px solid rgba(121, 87, 87, 0.3);' :
            'background: rgba(102, 67, 67, 0.1); color: #664343; border: 1px solid rgba(102, 67, 67, 0.3);'
        }
    `;
    
    const form = document.getElementById('contact-form');
    form.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ================================
// ANIMATIONS ON SCROLL
// ================================

function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .featured-item,
        .service-card,
        .portfolio-item,
        .about-content,
        .skills-item,
        .experience-item
    `);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Add CSS for animate-in class
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ================================
// PARALLAX EFFECTS
// ================================

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-video, .parallax-bg');
    
    if (parallaxElements.length === 0) return;
    
    // Throttle scroll events for better performance
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(el => {
            if (el.classList.contains('hero-video')) {
                el.style.transform = `translate(-50%, calc(-50% + ${rate}px))`;
            } else {
                el.style.transform = `translateY(${rate}px)`;
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ================================
// PORTFOLIO FILTER FUNCTIONALITY
// ================================

function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ================================
// PAGE-SPECIFIC FUNCTIONALITY
// ================================

// Initialize page-specific features based on current page
function initPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'portfolio.html':
            initPortfolioFilters();
            break;
        case 'about.html':
            initSkillsAnimation();
            break;
        case 'contact.html':
            initContactMap();
            break;
    }
}

// Skills animation for about page
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-fill');
                const percentage = progressBar.dataset.percentage;
                
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 500);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Contact map initialization (placeholder)
function initContactMap() {
    const mapContainer = document.getElementById('contact-map');
    if (mapContainer) {
        // Placeholder for map initialization
        // You would integrate with Google Maps API or similar here
        mapContainer.innerHTML = '<p>Map integration would go here</p>';
    }
}

// ================================
// PERFORMANCE OPTIMIZATIONS
// ================================

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', initPageSpecific);

// ================================
// SERVICE WORKER REGISTRATION
// ================================

// Register service worker for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ================================
// ERROR HANDLING
// ================================

// Global error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send error reports to a logging service here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close lightbox with Escape key (already handled above)
    // Add more keyboard shortcuts as needed
    
    // Skip to main content with Alt+S
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Ensure focus is visible for keyboard users
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// Add CSS for keyboard navigation
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid #795757 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);
