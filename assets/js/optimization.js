document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- 1. СЧЕТЧИКИ ---
    const initCounters = () => {
        const animateCounter = (el) => {
            const rawText = el.innerText.trim();
            const target = parseInt(rawText.replace(/\D/g, ''), 10) || 0;
            const suffix = rawText.replace(/[0-9]/g, ''); 
            const duration = 2000;
            const startTime = performance.now();
            if (target === 0) return;
            const step = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                el.innerText = Math.floor(progress * target) + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else el.innerText = target + suffix;
            };
            requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('.counter-number').forEach(num => counterObserver.observe(num));
    };

    // --- 2. АНИМАЦИИ ПРИ СКРОЛЛЕ ---
    const initScrollAnimations = () => {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.transitionDelay = el.getAttribute('data-wow-delay') || '0s';
                    el.classList.add('active');
                    scrollObserver.unobserve(el);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.wow').forEach(el => {
            el.classList.add('reveal'); 
            scrollObserver.observe(el);
        });
    };

    // --- 3. ЛАЙТБОКС (ФОТО) ---
    const initLightbox = () => {
        document.querySelectorAll('.popup-image').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const overlay = document.createElement('div');
                overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; cursor: zoom-out; opacity: 0; transition: opacity 0.3s ease;`;
                const img = document.createElement('img');
                img.src = link.getAttribute('href');
                img.style.cssText = `max-width: 90%; max-height: 90%; border-radius: 8px; transform: scale(0.9); transition: transform 0.3s ease;`;
                overlay.appendChild(img);
                document.body.appendChild(overlay);
                setTimeout(() => { overlay.style.opacity = '1'; img.style.transform = 'scale(1)'; }, 10);
                const close = () => { overlay.style.opacity = '0'; setTimeout(() => overlay.remove(), 300); };
                overlay.onclick = close;
            });
        });
    };

    // --- 4. ПЛАВНЫЙ СКРОЛЛ (ИСПРАВЛЕННЫЙ) ---
    const initSmoothScroll = () => {
        const headerOffset = 90; 

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '' || this.classList.contains('vs-menu-toggle')) return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    // Закрываем все меню перед скроллом
                    document.querySelectorAll('.vs-menu-wrapper, .sidemenu-wrapper').forEach(menu => {
                        menu.classList.remove('vs-body-visible', 'show');
                        menu.setAttribute('inert', '');
                    });
                    document.body.classList.remove('menu-open');

                    // Выполняем скролл
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    initCounters();
    initScrollAnimations();
    initLightbox();
    initSmoothScroll();
});