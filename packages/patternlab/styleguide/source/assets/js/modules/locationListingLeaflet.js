import sticky from "../helpers/sticky.js";

export default (function (window, document, $) {

  function initListing (el, i) {
    $(el).each(function(i){
      let $el = $(this),
      $mapCol = $el.find(".js-location-listing-map");
      sticky.init($mapCol);

      $el.find(".ma__image-promo").on('click', function(e){
        if (e.target.href) {
          e.stopImmediatePropagation();
          return;
        }

        e.preventDefault();
        let index = $(this).index();
        $('html, body').animate({
          scrollTop: $mapCol.offset().top,
        });

        let maker = window.leafletMarkers[index];
        window.leafletMap.flyTo(maker.getLatLng());
        maker.openPopup();
      }).on("mouseenter focusin", function (e) {
        let index = $(this).index();
        let maker = window.leafletMarkers[index];
        $(maker._icon).addClass('ma-highlighted');

      }).on("mouseleave", function (e) {
        let index = $(this).index();
        let maker = window.leafletMarkers[index];
        $(maker._icon).removeClass('ma-highlighted');
      });
    });
  }


  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".js-location-listing.leaflet").forEach(function(el, i) {
      initListing(el, i);
    })
  })
}) (window, document, jQuery);
