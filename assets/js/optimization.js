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

    // --- 4. ПЛАВНЫЙ СКРОЛЛ И КНОПКА "НАВЕРХ" ---
    const initSmoothScroll = () => {
        // Логика для якорных ссылок
        const headerOffset = 90; 
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '' || this.classList.contains('vs-menu-toggle')) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    document.querySelectorAll('.vs-menu-wrapper, .sidemenu-wrapper').forEach(menu => {
                        menu.classList.remove('vs-body-visible', 'show');
                        menu.setAttribute('inert', '');
                    });
                    document.body.classList.remove('menu-open');
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });

        // **НОВОЕ:** Логика для кнопки "Наверх"
        document.querySelectorAll('.scrollToTop').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    };
    
    // --- 5. ПОЗИЦИОНИРОВАНИЕ ДЕКОРАТИВНЫХ ЭЛЕМЕНТОВ ---
    const initShapeMockup = () => {
        document.querySelectorAll('.shape-mockup').forEach(element => {
            const dataset = element.dataset;
            if (dataset.top)    element.style.top    = !isNaN(dataset.top)    ? dataset.top + 'px' : dataset.top;
            if (dataset.right)  element.style.right  = !isNaN(dataset.right)  ? dataset.right + 'px' : dataset.right;
            if (dataset.bottom) element.style.bottom = !isNaN(dataset.bottom) ? dataset.bottom + 'px' : dataset.bottom;
            if (dataset.left)   element.style.left   = !isNaN(dataset.left)   ? dataset.left + 'px' : dataset.left;
            element.removeAttribute('data-top');
            element.removeAttribute('data-right');
            element.removeAttribute('data-bottom');
            element.removeAttribute('data-left');
            if (element.parentElement) {
                element.parentElement.classList.add('shape-mockup-wrap');
            }
        });
    };

    // **НОВОЕ:** --- 6. ФОНЫ И МАСКИ ИЗ DATA-АТРИБУТОВ ---
    const initDataAttributes = () => {
        document.querySelectorAll('[data-bg-src]').forEach(el => {
            el.style.backgroundImage = `url(${el.dataset.bgSrc})`;
            el.removeAttribute('data-bg-src');
        });
        document.querySelectorAll('[data-mask-src]').forEach(el => {
            const maskUrl = `url(${el.dataset.maskSrc})`;
            el.style.maskImage = maskUrl;
            el.style.webkitMaskImage = maskUrl;
            el.removeAttribute('data-mask-src');
        });
    };

    /*----------- Throttling Helper (Explicit Global) -----------*/
    window.throttle = function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    };
    
    // --- 7. СИСТЕМА МЕНЮ (Mobile & Side Menu) ---
    const initMenuSystem = () => {
        const menuConfigs = [
            {
                trigger: '.vs-menu-toggle',
                drawer: '.vs-menu-wrapper',
                content: '.vs-mobile-menu',
                activeClass: 'vs-body-visible'
            },
            {
                trigger: '.sideMenuToggler',
                drawer: '.sidemenu-wrapper',
                content: '.sidemenu-content',
                activeClass: 'show'
            }
        ];

        const openDrawer = (config) => {
            const drawer = document.querySelector(config.drawer);
            if (!drawer) return;
            drawer.classList.add(config.activeClass);
            drawer.removeAttribute('inert');
            document.body.classList.add('menu-open');
        };

        const closeDrawer = (config) => {
            const drawer = document.querySelector(config.drawer);
            if (!drawer) return;
            drawer.classList.remove(config.activeClass);
            drawer.setAttribute('inert', '');
            // Проверяем, открыты ли другие меню, прежде чем убирать класс с body
            if (!document.querySelector('.vs-body-visible, .sidemenu-wrapper.show')) {
                document.body.classList.remove('menu-open');
            }
        };

        // Устанавливаем начальное состояние `inert` для доступности
        menuConfigs.forEach(config => {
            const drawer = document.querySelector(config.drawer);
            if (drawer) drawer.setAttribute('inert', '');
        });

        // Единый обработчик кликов для открытия меню (делегирование)
        document.body.addEventListener('click', (e) => {
            const matchingConfig = menuConfigs.find(config => e.target.closest(config.trigger));
            if (matchingConfig) {
                e.preventDefault();
                openDrawer(matchingConfig);
            }
        });

        // Обработчики для закрытия меню (кнопки, клик мимо)
        menuConfigs.forEach(config => {
            const drawer = document.querySelector(config.drawer);
            if (!drawer) return;

            drawer.querySelectorAll('.closeButton, .sideMenuCls').forEach(closeBtn => {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeDrawer(config);
                });
            });

            drawer.addEventListener('click', (e) => {
                if (!e.target.closest(config.content)) {
                    closeDrawer(config);
                }
            });
        });

        // Глобальный обработчик для клавиши Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                menuConfigs.forEach(config => closeDrawer(config));
            }
        });
    };

        // --- 8. АНИМАЦИЯ КНОПОК (WAVE-BTN) ---
    const initWaveButtons = () => {
        const waveHtml = "<span class='btn-hover'><span class='btn-hover-inner'>" + "<span class='part'></span>".repeat(4) + "</span></span>";
        
        document.querySelectorAll('.wave-btn').forEach(button => {
            button.insertAdjacentHTML('beforeend', waveHtml);
        });
    };


        // --- 9. "ЛИПКАЯ" ШАПКА (STICKY HEADER) ---
    const initStickyHeader = () => {
        let lastScrollTop = 0;
        const header = document.querySelector('.sticky-active');
        const scrollTopButton = document.querySelector('.scrollToTop');

        // Если на странице нет элемента шапки, то ничего не делаем.
        if (!header) return;

        const headerParent = header.parentElement;
        if (!headerParent) return;

        // Используем наш глобальный window.throttle
        window.addEventListener('scroll', window.throttle(() => {
            const scrollTop = window.scrollY;
            const height = header.offsetHeight; // Нативный аналог .outerHeight()

            // Задаем min-height родителю, чтобы избежать "прыжка" контента
            headerParent.style.minHeight = height + 'px';

            if (scrollTop > 800) {
                headerParent.classList.add('will-sticky');
                // Показываем/скрываем шапку в зависимости от направления скролла
                header.classList.toggle('active', scrollTop < lastScrollTop);
            } else {
                headerParent.classList.remove('will-sticky');
                headerParent.style.minHeight = ''; // Сбрасываем min-height
                header.classList.remove('active');
            }

            // Обновляем позицию скролла для следующего события
            lastScrollTop = scrollTop;

            // Показываем/скрываем кнопку "Наверх"
            if (scrollTopButton) {
                scrollTopButton.classList.toggle('show', scrollTop > 500);
            }
        }, 150));
    };

    
var scene = document.querySelector('.parallax');

if (scene) {
  var parallax = new Parallax(scene, {
    relativeInput: false,
    hoverOnly: true,
  });
}

    // ==================================================
    //              ЗАПУСК ВСЕХ ФУНКЦИЙ
    // ==================================================
    initCounters();
    initScrollAnimations();
    initLightbox();
    initSmoothScroll();
    initShapeMockup();
    initDataAttributes(); 
initMenuSystem();
initWaveButtons();
initStickyHeader();
});
