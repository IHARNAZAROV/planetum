(function ($) {
  "use strict";


  /*---------- Set Mask (нужно для data-mask-src в секции teachers) ----------*/
  if ($("[data-mask-src]").length > 0) {
    $("[data-mask-src]").each(function () {
      var mask = $(this).attr("data-mask-src");
      $(this).css({
        "mask-image": "url(" + mask + ")",
        "-webkit-mask-image": "url(" + mask + ")",
      });
      $(this).removeAttr("data-mask-src");
    });
  }

  /*---------- WOW Js (Scroll Animation) ----------*/
  if (typeof WOW === "function") {
    new WOW().init();
  }

  /*---------- Shape Mockup (позиционирование декора) ----------*/
  $.fn.shapeMockup = function () {
    var $shape = $(this);
    $shape.each(function () {
      var $currentShape = $(this),
        shapeTop = $currentShape.data("top"),
        shapeRight = $currentShape.data("right"),
        shapeBottom = $currentShape.data("bottom"),
        shapeLeft = $currentShape.data("left");

      $currentShape
        .css({
          top: shapeTop,
          right: shapeRight,
          bottom: shapeBottom,
          left: shapeLeft,
        })
        .removeAttr("data-top")
        .removeAttr("data-right")
        .removeAttr("data-bottom")
        .removeAttr("data-left")
        .parent()
        .addClass("shape-mockup-wrap");
    });
  };

  if ($(".shape-mockup").length > 0) {
    $(".shape-mockup").shapeMockup();
  }
})(jQuery);
