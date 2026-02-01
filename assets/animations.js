// APEX PERFORMANCE - Main JavaScript
// Version: 1.0.0

(function() {
    'use strict';

    // Cart Management
    const CartManager = {
        init: function() {
            this.updateCartCount();
            this.bindEvents();
        },

        updateCartCount: function() {
            fetch('/cart.js')
                .then(response => response.json())
                .then(cart => {
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = cart.item_count;
                    }
                })
                .catch(error => console.error('Error:', error));
        },

        bindEvents: function() {
            // Add to cart buttons
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    e.preventDefault();
                    const variantId = e.target.dataset.variantId;
                    CartManager.addToCart(variantId, e.target);
                }
            });
        },

        addToCart: function(variantId, button) {
            const data = {
                id: variantId,
                quantity: 1
            };

            fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                this.updateCartCount();
                this.showSuccessMessage(button);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },

        showSuccessMessage: function(button) {
            const originalText = button.textContent;
            button.textContent = '✓ AJOUTÉ';
            button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    };

    // Smooth Scroll
    const SmoothScroll = {
        init: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });
        }
    };

    // Scroll Animations
    const ScrollAnimations = {
        init: function() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.product-card, .category-card').forEach(el => {
                observer.observe(el);
            });
        }
    };

    // Header Scroll Effect
    const HeaderScroll = {
        init: function() {
            const header = document.querySelector('header');
            if (!header) return;

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 100) {
                    header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
                }
            });
        }
    };

    // Newsletter Form
    const Newsletter = {
        init: function() {
            const form = document.querySelector('.newsletter-form');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                
                // Shopify customer form submission
                fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `contact[email]=${encodeURIComponent(email)}&contact[tags]=newsletter`
                })
                .then(() => {
                    Newsletter.showSuccess();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        },

        showSuccess: function() {
            const successMessage = document.querySelector('.newsletter-success');
            if (successMessage) {
                successMessage.classList.add('show');
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }
        }
    };

    // Mobile Menu
    const MobileMenu = {
        init: function() {
            const menuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            if (menuBtn && navLinks) {
                menuBtn.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                });
            }
        }
    };

    // Initialize all modules on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        CartManager.init();
        SmoothScroll.init();
        ScrollAnimations.init();
        HeaderScroll.init();
        Newsletter.init();
        MobileMenu.init();
    });

})();
