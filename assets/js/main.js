(function ($) {
  "use strict";

  /* ==================================================
   1. MOBILE MENU (jQuery plugin)
  ================================================== */
  $.fn.vsmobilemenu = function (options) {
    const settings = $.extend({
      menuToggleBtn: '.vs-menu-toggle',
      bodyToggleClass: 'vs-body-visible',
      subMenuClass: 'vs-submenu',
      subMenuParent: 'vs-item-has-children',
      subMenuParentToggle: 'vs-active',
      expandClass: 'vs-mean-expand',
      subMenuToggleClass: 'vs-open',
      toggleSpeed: 400,
    }, options);

    return this.each(function () {
      const $menu = $(this);

      // Toggle main menu visibility
      function toggleMenu() {
        $menu.toggleClass(settings.bodyToggleClass);

        // Close all submenus
        $menu.find('.' + settings.subMenuClass)
          .removeClass(settings.subMenuToggleClass)
          .slideUp(0)
          .parent()
          .removeClass(settings.subMenuParentToggle);
      }

      // Prepare submenu structure
      $menu.find('li').each(function () {
        const $submenu = $(this).children('ul');
        if ($submenu.length) {
          $submenu
            .addClass(settings.subMenuClass)
            .hide()
            .parent()
            .addClass(settings.subMenuParent)
            .children('a')
            .addClass(settings.expandClass);
        }
      });

      // Submenu toggle
      $menu.on('click', '.' + settings.expandClass, function (e) {
        e.preventDefault();
        const $submenu = $(this).siblings('ul');
        $(this).parent().toggleClass(settings.subMenuParentToggle);
        $submenu.slideToggle(settings.toggleSpeed).toggleClass(settings.subMenuToggleClass);
      });

      // Burger button
      $(settings.menuToggleBtn).on('click', toggleMenu);

      // Close menu on outside click
      $menu.on('click', toggleMenu);
      $menu.children().on('click', e => e.stopPropagation());
    });
  };

  $('.vs-menu-wrapper').vsmobilemenu();


  /* ==================================================
   2. STICKY HEADER + SCROLL TO TOP
  ================================================== */
  let lastScrollTop = 0;
  const scrollBtn = '.scrollToTop';

  function handleSticky($header) {
    const scrollTop = $(window).scrollTop();
    const height = $header.outerHeight();

    $header.parent().css('min-height', height);

    if (scrollTop > 800) {
      $header.parent().addClass('will-sticky');
      $header.toggleClass('active', scrollTop < lastScrollTop);
    } else {
      $header.parent().removeClass('will-sticky').css('min-height', '');
      $header.removeClass('active');
    }

    lastScrollTop = scrollTop;
  }

  $(window).on('scroll', function () {
    handleSticky($('.sticky-active'));
    $(scrollBtn).toggleClass('show', $(this).scrollTop() > 500);
  });

  $(scrollBtn).on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 600);
  });


  /* ==================================================
   3. BACKGROUND / COLOR / MASK HELPERS
  ================================================== */
  $('[data-bg-src]').each(function () {
    $(this)
      .css('background-image', `url(${$(this).data('bg-src')})`)
      .removeAttr('data-bg-src')
      .addClass('background-image');
  });

  $('[data-bg-color]').each(function () {
    $(this).css('background-color', $(this).data('bg-color')).removeAttr('data-bg-color');
  });

  $('[data-mask-src]').each(function () {
    const mask = $(this).data('mask-src');
    $(this).css({
      maskImage: `url(${mask})`,
      WebkitMaskImage: `url(${mask})`
    }).removeAttr('data-mask-src');
  });


  /* ==================================================
   4. MEDIA POPUPS
  ================================================== */
  $('.popup-image').magnificPopup({ type: 'image', gallery: { enabled: true } });
  $('.popup-video').magnificPopup({ type: 'iframe' });


  /* ==================================================
   5. TABS INDICATOR
  ================================================== */
  $.fn.indicator = function () {
    return this.each(function () {
      const $menu = $(this);
      const $items = $menu.find('a, button');
      $menu.append('<span class="indicator"></span>');
      const $line = $menu.find('.indicator');

      function moveIndicator() {
        const $active = $menu.find('.active');
        if (!$active.length) return;
        $line.css({
          width: $active.outerWidth(),
          height: $active.outerHeight(),
          top: $active.position().top,
          left: $active.position().left
        });
      }

      $items.on('click', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        moveIndicator();
      });

      moveIndicator();
    });
  };

  $('.choose-tab, .filter-menu, .product-tab-style1').each(function () {
    $(this).indicator();
  });


  /* ==================================================
   6. ANIMATIONS (WOW + data-ani)
  ================================================== */
// 1. Инициализация WOW (НЕ зависит от slick)
new WOW().init();

// animation timing
$('[data-ani-duration]').each(function () {
  $(this).css('animation-duration', $(this).data('ani-duration'));
});

$('[data-ani-delay]').each(function () {
  $(this).css('animation-delay', $(this).data('ani-delay'));
});

// animation name
$('[data-ani]').each(function () {
  $(this).addClass($(this).data('ani'));
});

/*
  🔴 КЛЮЧЕВОЙ ФИКС:
  vscustom-carousel уже инициализировал slick,
  поэтому мы НЕ ждём init, а форсируем первый слайд
*/
$(window).on('load', function () {

  // 1. Показываем ВСЕ элементы первого слайда
  $('.vs-carousel .slick-slide').first()
    .find('[data-ani]')
    .addClass('vs-animated');

});

// 2. При смене слайда — нормальная логика
$('.vs-carousel').on('afterChange', function (event, slick, currentSlide) {

  // скрываем всё
  $(slick.$slides).find('[data-ani]').removeClass('vs-animated');

  // показываем активный
  $(slick.$slides[currentSlide]).find('[data-ani]').addClass('vs-animated');

});
  /* ==================================================
   7. COUNTERS
  ================================================== */
  $('.counter-number').counterUp({ delay: 10, time: 1000 });


  /* ==================================================
   8. SHAPE MOCKUPS
  ================================================== */
  $('.shape-mockup').each(function () {
    const $el = $(this);
    $el.css({
      top: $el.data('top'),
      right: $el.data('right'),
      bottom: $el.data('bottom'),
      left: $el.data('left')
    }).removeAttr('data-top data-right data-bottom data-left')
      .parent()
      .addClass('shape-mockup-wrap');
  });


 /* ==================================================
   9. SMOOTH SCROLL (SAFE VERSION)
================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {

    // ❗ НЕ ТРОГАЕМ кнопки управления интерфейсом
    if (
      this.classList.contains('sideMenuToggler') ||
      this.classList.contains('vs-menu-toggle')
    ) {
      return;
    }

    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});

  /* ==================================================
   10. BUTTON HOVER EFFECT
  ================================================== */
  $('.wave-btn').append(
    "<span class='btn-hover'><span class='btn-hover-inner'>" +
    "<span class='part'></span>".repeat(4) +
    "</span></span>"
  );

  /* ==================================================
   11. SIDE MENU (OFFCANVAS)
================================================== */

(function initSideMenu() {

  const sideMenu = '.sidemenu-wrapper';
  const openBtn = '.sideMenuToggler';
  const closeBtn = '.sideMenuCls';
  const activeClass = 'show';

  // ===== helpers =====
  function openMenu() {
    $(sideMenu).addClass(activeClass);
    $(sideMenu).find(closeBtn).trigger('focus');
  }

  function closeMenu() {
    $(sideMenu).removeClass(activeClass);
    $(openBtn).trigger('focus');
  }

  // ===== open =====
  $(document).on('click', openBtn, function (e) {
    e.preventDefault();
    openMenu();
  });

  // ===== close by button =====
  $(sideMenu).find(closeBtn).on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // ===== close by overlay =====
  $(sideMenu).on('click', function () {
    closeMenu();
  });

  // ===== prevent close inside content =====
  $(sideMenu).find('.sidemenu-content').on('click', function (e) {
    e.stopPropagation();
  });

  // ===== close by ESC =====
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $(sideMenu).hasClass(activeClass)) {
      closeMenu();
    }
  });

})();



})(jQuery);
