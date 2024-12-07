// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.textContent);
    let count = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const animate = () => {
        count += increment;
        if (count < target) {
            element.textContent = Math.ceil(count) + '+';
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + '+';
        }
    };
    
    animate();
}

// Animate counters when they come into view
const observeCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
};

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Course card hover effect
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
});

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
    
    // Initialize counter animations
    observeCounters();
    
    // Add animation classes to elements
    document.querySelectorAll('.feature-card, .course-card, .trainer-card').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
});

// Lazy loading for images
document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

// Search Form Handling
document.querySelector('.search-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchQuery = this.querySelector('input[type="text"]').value;
    const category = this.querySelector('select:nth-of-type(1)').value;
    const level = this.querySelector('select:nth-of-type(2)').value;
    
    // Here you would typically make an API call with the search parameters
    console.log('Search:', { searchQuery, category, level });
    
    // Show loading state
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري البحث...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        // Here you would handle the search results
    }, 1500);
});

// Category Cards Animation
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.category-icon').style.transform = 'rotateY(180deg)';
        this.querySelector('.category-icon i').style.transform = 'rotateY(-180deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.category-icon').style.transform = 'rotateY(0)';
        this.querySelector('.category-icon i').style.transform = 'rotateY(0)';
    });
});

// Search Input Enhancement
const searchInput = document.querySelector('.search-form input[type="text"]');
if (searchInput) {
    // Clear button
    searchInput.addEventListener('input', function() {
        const clearButton = this.parentElement.querySelector('.clear-search');
        if (!clearButton && this.value) {
            const btn = document.createElement('button');
            btn.className = 'clear-search btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted';
            btn.innerHTML = '<i class="fas fa-times"></i>';
            btn.style.zIndex = '4';
            btn.onclick = (e) => {
                e.preventDefault();
                this.value = '';
                btn.remove();
            };
            this.parentElement.appendChild(btn);
        } else if (clearButton && !this.value) {
            clearButton.remove();
        }
    });
}

// Form Select Enhancement
document.querySelectorAll('.form-select').forEach(select => {
    select.addEventListener('change', function() {
        if (this.value !== this.options[0].value) {
            this.classList.add('selected');
        } else {
            this.classList.remove('selected');
        }
    });
});

// شريط التقدم عند التمرير
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
});

// تحميل الصور الكسول
document.addEventListener("DOMContentLoaded", function() {
    const lazyImages = document.querySelectorAll("img[data-src]");
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// تنقل سلس بين الأقسام
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        
        if (section) {
            const offsetTop = section.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
