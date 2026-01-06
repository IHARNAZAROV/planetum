(function ($) {
  "use strict";

  $(function () {
    /* ==================================================
       1. ОБЪЕДИНЕННОЕ МЕНЮ (Mobile & Side Menu)
    ================================================== */
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

    function openDrawer(config) {
      $(config.drawer).addClass(config.activeClass).removeAttr('inert');
      $('body').addClass('menu-open');
    }

    function closeDrawer(config) {
      $(config.drawer).removeClass(config.activeClass).attr('inert', '');
      if ($('.vs-body-visible, .sidemenu-wrapper.show').length === 0) {
        $('body').removeClass('menu-open');
      }
    }

    menuConfigs.forEach(config => {
      const $drawer = $(config.drawer);
      if (!$drawer.length) return;

      $drawer.attr('inert', '');

      $(document).on('click', config.trigger, function (e) {
        e.preventDefault();
        openDrawer(config);
      });

      $drawer.find('.closeButton, .sideMenuCls').on('click', function (e) {
        e.preventDefault();
        closeDrawer(config);
      });

      $drawer.on('click', function (e) {
        if (!$(e.target).closest(config.content).length) {
          closeDrawer(config);
        }
      });
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        menuConfigs.forEach(config => closeDrawer(config));
      }
    });

    /* ==================================================
       2. STICKY HEADER + SCROLL TO TOP
    ================================================== */
    let lastScrollTop = 0;
    const scrollBtn = '.scrollToTop';

    $(window).on('scroll', function () {
      const $header = $('.sticky-active');
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

      $(scrollBtn).toggleClass('show', scrollTop > 500);
    });

    $(scrollBtn).on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 600);
    });

    /* ==================================================
       3. HELPERS (BG, MASK, TABS, SHAPES)
    ================================================== */
    $('[data-bg-src]').each(function () {
      $(this).css('background-image', `url(${$(this).data('bg-src')})`).removeAttr('data-bg-src');
    });

    $('[data-mask-src]').each(function () {
      const mask = $(this).data('mask-src');
      $(this).css({ maskImage: `url(${mask})`, WebkitMaskImage: `url(${mask})` }).removeAttr('data-mask-src');
    });

    $('.shape-mockup').each(function () {
      const $el = $(this);
      $el.css({ top: $el.data('top'), right: $el.data('right'), bottom: $el.data('bottom'), left: $el.data('left') })
         .removeAttr('data-top data-right data-bottom data-left').parent().addClass('shape-mockup-wrap');
    });

    $('.wave-btn').append("<span class='btn-hover'><span class='btn-hover-inner'>" + "<span class='part'></span>".repeat(4) + "</span></span>");

    /* ==================================================
       4. SLICK CAROUSEL ANIMATIONS
    ================================================== */
    $(window).on('load', function () {
      $('.vs-carousel .slick-slide').first().find('[data-ani]').addClass('vs-animated');
    });

    $('.vs-carousel').on('afterChange', function (event, slick, currentSlide) {
      $(slick.$slides).find('[data-ani]').removeClass('vs-animated');
      $(slick.$slides[currentSlide]).find('[data-ani]').addClass('vs-animated');
    });

  });
})(jQuery);