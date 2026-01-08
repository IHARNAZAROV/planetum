(function ($) {
  "use strict";

  $(function () {

    
    /* ==================================================
        4. SLICK CAROUSEL ANIMATIONS
       ================================================== */
    // Вся эта логика относится к библиотеке Slick Carousel,
    // которую мы еще не заменяли. Поэтому она остается здесь.
    $(window).on('load', function () {
      $('.vs-carousel .slick-slide').first().find('[data-ani]').addClass('vs-animated');
    });

    $('.vs-carousel').on('afterChange', function (event, slick, currentSlide) {
      $(slick.$slides).find('[data-ani]').removeClass('vs-animated');
      $(slick.$slides[currentSlide]).find('[data-ani]').addClass('vs-animated');
    });

  });

})(jQuery);
