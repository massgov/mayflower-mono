import throttle from "../helpers/throttle.js";

export default (function (window, document, $, undefined) {

  // Responsive table HTML structure
  // <div class="ma__table--responsive">
  //   <div class="ma__table--responsive__wrapper">
  //    <table class="ma__table"> ... </table>
  //   </div>
  // </div>

  const $window = $(window);
  let responsiveTables = [];

  function setWidths(rt) {
    rt.$table
      .find("thead th")
      .each(function (i) {
        rt.$stickyHeader
          .find("th")
          .eq(i)
          .width($(this).width());
      });

    if (rt.$stickyHeader) {
      // Set width of sticky table head.
      rt.$stickyHeader.width(rt.$table.width());
    }

  }

  function calcAllowance($table, $stickyHeader) {
    var a = 0;
    // Calculate allowance.
    $table.find("tbody tr:lt(3)").each(function () {
      a += $(this).height();
    });

    // Set fail safe limit (last three row might be too tall).
    // Set arbitrary limit at 0.25 of viewport height,
    // or you can use an arbitrary pixel value.
    if (a > $window.height() * 0.25) {
      a = $window.height() * 0.25;
    }

    // Add the height of sticky header.
    a += $stickyHeader.height();
    return a;
  }

  function updatePositions(rt) {
    // Return value of calculated allowance.
    let visibleParams = getVisibleParams(rt.$root[0]);
    // Position sticky header based on viewport scrollTop.
    if (rt.$stickyHeader) {
      let allowance = calcAllowance(rt.$table, rt.$stickyHeader);
      if (
        $window.scrollTop() > rt.$table.offset().top &&
        $window.scrollTop() < rt.$table.offset().top + rt.$table.outerHeight() - allowance
      ) {

        let additionalOffset = 0;

        if (document.documentElement.clientWidth <= 825) {
          const $jsStickyHeader = $('.js-sticky-header');
          if ($jsStickyHeader) {
            additionalOffset += $jsStickyHeader.height();
          }
        }
        if ($(".js-scroll-anchors")[0] &&
          $(".js-scroll-anchors").css("position") === "fixed" &&
          document.documentElement.clientWidth <= 765) {
          additionalOffset += $(".js-scroll-anchors").height();
        }

        // When top of viewport is in the table itself.
        rt.$stickyHeader.css({
          opacity: 1,
          top: $window.scrollTop() - rt.$table.offset().top + additionalOffset
        });

      }
      else {
        // When top of viewport is above or below table.
        rt.$stickyHeader.css({
          opacity: 0,
          top: 0
        });
      }
    }

    let tableBottom = rt.$table.offset().top + rt.$table.height();
    let scrolledBottom = $window.scrollTop() + $window.height();
    let canScrollHorizontally = rt.$table.width() > rt.$table.parent().width();
    rt.$root.toggleClass('has-horizontal-scroll', canScrollHorizontally);

    if (
        canScrollHorizontally &&
        visibleParams.bottomOutOfView &&
        !visibleParams.entirelyOutOfView &&
        scrolledBottom - rt.$table.offset().top > 100
      ) {
      rt.$root.find(".ma__table__horizontal-nav").css({
        bottom: (tableBottom - scrolledBottom) + 65
      });
    }
    else {
      rt.$root.find(".ma__table__horizontal-nav").css({ bottom: 0 });
    }
  }

  function initializeTable(element) {
    let $table = $(element).find('table');
    let $stickyHeader = null;

    if ($table.find("thead").length > 0 && $table.find("th").length > 0) {
      let $thead = $table.find("thead").clone();
      $table.after('<table class="ma__table sticky-thead" />');

      $stickyHeader = $(element).find(".sticky-thead");
      $stickyHeader.append($thead);

    }

    // Add class, remove margins, reset width and wrap table.
    $table
      .addClass("sticky-enabled")
      .css({
        margin: 0,
        width: "100%"
      });

    responsiveTables.push({
      $root: $(element),
      $table: $table,
      $stickyHeader: $stickyHeader
    });

  }

  function getVisibleParams(element) {
    let pageTop = $(window).scrollTop();
    let pageBottom = pageTop + $(window).height();
    let elementTop = $(element).offset().top;
    let elementBottom = elementTop + $(element).height();

    let topOutOfView = elementTop < pageTop;
    let bottomOutOfView = elementBottom > pageBottom;
    let entirelyOutOfView = pageTop > elementBottom || pageBottom < elementTop;

    return {
      topOutOfView: topOutOfView,
      bottomOutOfView: bottomOutOfView,
      entirelyOutOfView: entirelyOutOfView
    };
  }

  function recalcScrollbar(rt) {
    let containerWidth = rt.$table.parent().width();
    let tableWidth = rt.$table.width();
    let visiblePercentage = (containerWidth / tableWidth) * 100;
    let leftVisiblePercentage = Math.abs((rt.$table.offset().left - rt.$table.parent().offset().left) / tableWidth) * 100;
    let calcOperator;

    if (leftVisiblePercentage == 0) {
      calcOperator = '-';
    }
    else {
      calcOperator = '+';
    }

    rt.$root.find(".ma__scroll-indicator__button").css({
      left: `calc(${leftVisiblePercentage}% ${calcOperator} 2px)`,
      width: `calc(${visiblePercentage}%)`
    });
  }

  // Apply scroll-based classes.
  function applyScrollClasses(rt) {
    let visibleParams = getVisibleParams(rt.$root[0]);

    rt.$root.toggleClass("has-top-visible", visibleParams.topOutOfView);
    rt.$root.toggleClass("has-bottom-visible", visibleParams.bottomOutOfView);
    rt.$root.toggleClass("is-out-of-view", visibleParams.entirelyOutOfView);

  }

  function handleOverlappingElements(rt) {
    let visibleParams = getVisibleParams(rt.$root[0]);

    if (!visibleParams.entirelyOutOfView) {
      $(".ma__floating-action").hide();
    }
    else {
      $(".ma__floating-action").show();
    }
  }

  function handleWindowResize () {
    responsiveTables.forEach((rt) => {
      setWidths(rt);
      updatePositions(rt);
      recalcScrollbar(rt);
    });
  }

  function handleScroll() {
    responsiveTables.forEach((rt) => {
      updatePositions(rt);
      applyScrollClasses(rt);
      recalcScrollbar(rt);
      handleOverlappingElements(rt);
    });
  }

  function handleBeginScrolling() {
    responsiveTables.forEach((rt) => {
      rt.$root.addClass('is-scrolling');
    });
  }

  function handleEndScrolling() {
    responsiveTables.forEach(rt => {
      rt.$root.removeClass("is-scrolling");
    });
  }

  function scrollStartStop() {
    var $this = $(this);

    if (Date.now() - lastScrollAt > 100) {
      handleBeginScrolling();
    }

    lastScrollAt = Date.now();

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function () {
      if (Date.now() - lastScrollAt > 20) {
        handleEndScrolling();
      }
    }, 100);
  }

  // Scroller click handler.
  function handleScrollerClick(e) {
    const $scrollContainer = $(this).parents(".js-ma-responsive-table").find(".ma__table--responsive__wrapper");
    let posX = $(this).position().left;
    let midpoint = $(e.target).offset().left + $(e.target).width() / 2;
    let clickpoint = e.pageX - posX;

    if (clickpoint < midpoint ) {
      // Scroll left.
      $scrollContainer.animate({
        scrollLeft: $scrollContainer.scrollLeft() - Math.abs(midpoint - clickpoint)
      }, 250);
    }
    else {
      // Scroll right.
      $scrollContainer.animate({
        scrollLeft: $scrollContainer.scrollLeft() + Math.abs(midpoint - clickpoint)
      }, 250);
    }
  }

  function handleScrollerInteraction(e) {
    const $scrollContainer = $(this).parents(".js-ma-responsive-table").find(".ma__table--responsive__wrapper");

    let initialPosition = {
      x: e.pageX,
      y: e.pageY
    };

    function handleMouseUp() {
      // Remove listeners.
      $('body')
        .off('mousemove', handleMouseMove)
        .off('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
      let newPosition = {
        x: e.pageX,
        y: e.pageY
      };

      $scrollContainer.scrollLeft($scrollContainer.scrollLeft() + newPosition.x - initialPosition.x);
    }

    // Attach to body so you don't get a
    // disconnected handler if you drag off the bar.
    $('body')
      .on("mouseup", handleMouseUp)
      .on('mousemove', handleMouseMove);

  }

  // Scrollbar event handlers.
  function scrollbarEventHandlers() {
    const amountToScroll = 200;
    // @todo Cache `$scrollContainer` to avoid multiple lookups.

    // Scrollbar left arrow.
    $(".ma__table__horizontal-nav__left").click(function() {
      // On click of left arrow element, animate the movement of the scrollbar
      // to the left by the integer amount defined in `amountToScroll`.
      const $scrollContainer = $(this).parents(".js-ma-responsive-table").find(".ma__table--responsive__wrapper");
      const currentScrollLeft = $scrollContainer.scrollLeft();

      $scrollContainer.animate({
        scrollLeft: (currentScrollLeft - amountToScroll) < 0 ? 0 : (currentScrollLeft - amountToScroll)
      }, 250);
    });

    // Scrollbar right arrow.
    $(".ma__table__horizontal-nav__right").click(function() {
      // On click of left arrow element, animate the movement of the scrollbar
      // to the left by the integer amount defined in `amountToScroll`.
      const $scrollContainer = $(this).parents(".js-ma-responsive-table").find(".ma__table--responsive__wrapper");
      $scrollContainer.animate({
        scrollLeft: $scrollContainer.scrollLeft() + amountToScroll
      }, 250);
    });

    // Scroll indicator element.
    $(".ma__scroll-indicator").on('click', handleScrollerClick);

    $(".ma__scroll-indicator__button")
      .on("mousedown", handleScrollerInteraction)
      // Deaden clicking on the scroll button
      // in order to handle click on parent.
      .on("click", e => e.stopPropagation());

  }

  let lastScrollAt = Date.now();
  let scrollTimeout;

  // fire on horizontal scroll of container as well.
  $(".ma__table--responsive__wrapper").on("scroll", throttle(handleScroll, 100));

  $('.js-ma-responsive-table').each((i, el) => initializeTable(el));

  // Setup resize events.
  $window.on("resize", handleWindowResize);

  // @todo - Is this needed to run on :attach?
  handleWindowResize();

  $window.on("scroll", handleScroll);

  // @todo - Clean this up to be cleaner.
  $(document).on('scroll', scrollStartStop);

  // Setup scrollbar handlers.
  scrollbarEventHandlers();

})(window, document, jQuery);
