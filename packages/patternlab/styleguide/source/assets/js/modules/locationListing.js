import sticky from "../helpers/sticky.js";
import listings from "../helpers/listing.js";

export default (function (window, document, $) {
  // Active state classes for location listing rows.
  let activeClass = "is-active",
    markerActiveClass = "is-marker-bounce",
    // Selectors for event listeners on dynamic content.
    row = ".js-location-listing-link",
    activeLocationListingRow = row + "." + activeClass,
    markerActiveLocationListingRow = row + "." + markerActiveClass,
    // Parent component selectors.
    container = ".js-location-listing-results",
    parent = ".js-image-promos",
    mapCol = ".js-location-listing-map";

  $(".js-location-listing:not(.leaflet)").each(function (i) {
    let $el = $(this),
      $mapCol = $el.find(".js-location-listing-map"),
      $map = $el.find(".js-google-map"),
      $resultsHeading = $el.find(".js-results-heading"),
      $pagination = $el.find(".js-pagination"),
      $locationFilter = $el.find(".js-location-filters");

    sticky.init($mapCol);

    // Get the location listing component data (this could be replaced with an api)
    const rawData = ma.locationListing[i]; // Data object created in @organisms/by-author/location-listing.twig

    let masterData = []; // master data structure to preserve state
    // Listen for map initialization, populate master data structure using locationListing, map markers.
    $map.on("ma:GoogleMap:MapInitialized", function (e, markers) {
      masterData = populateMasterDataSource(rawData, markers); // to preserve state
    });

    // Listen for Google Map api library load completion, with geocode, geometry, and places libraries
    $(document).on("ma:LibrariesLoaded:GoogleMaps", function () {
      // Set up click handler for location listing rows.
      $el.on("click", row, function (e) {
        // If the link has an href, allow the normal link functionality
        // and exit event handler.
        if (e.target.href) {
          e.stopImmediatePropagation();
          return;
        }

        let index = $(e.currentTarget).index();

        // Trigger map to recenter on this item based on it's index.
        $map.trigger("ma:GoogleMap:MapRecenter", index);

        // Mark this link as active.
        $el.find(activeLocationListingRow).removeClass(activeClass);
        // In case the event is triggered on a child element.
        $(e.currentTarget).addClass(activeClass);
      });

      // Set up hover / focus event for listing rows.
      $el.on("mouseenter focusin", row, function (e) {
        // Remove active state from previously selected list item.
        $el.find(activeLocationListingRow).removeClass(activeClass);

        // Remove "focus" class from any "focused" location listing row.
        // ("focus" vs focus because hover doesn't bring focus to element.)
        $el.find(markerActiveLocationListingRow).removeClass(markerActiveClass);

        // Focus moved into listing for first time, so flag with class, recenter + bounce marker.
        $(e.currentTarget).addClass(markerActiveClass);
        let index = $(e.currentTarget).index();

        // Trigger map to recenter on this item and make the marker bounce
        $map.trigger("ma:GoogleMap:MarkerBounce", index);
      });

      // Remove "focus" class from any "focused" location listing row.
      $el.on("mouseleave", row, function (e) {
        $el.find(markerActiveLocationListingRow).removeClass(markerActiveClass);
      });

      // Handle location listings form interaction (triggered by locationFilters.js).
      $locationFilter.on("ma:LocationFilter:FiltersUpdated", function (e, formValues, resetValues) {
        // Only update things if masterData contains data.
        if (masterData.items && masterData.items.length > 0) {
          // transformData() returns a jQuery deferred object which allows us to wait for any asynchronous js execution to return before executing the .done(callback).
          // @see: https://api.jquery.com/deferred.done/
          transformData(masterData, formValues).done(function (transformation) {
            let page = 1;
            if (!resetValues) {
              page = parseInt(getPage(), 10);
            }
            masterData = transformation.data; // preserve state
            // Update the results heading based on the current items state.
            transformation.data.resultsHeading = listings.transformResultsHeading({
              data: transformation.data,
              page: page
            });
            // Update pagination data structure, reset to first page
            transformation.data.pagination = listings.transformPaginationData({
              data: transformation.data,
              targetPage: page
            });
            // Render the listing page.
            listings.renderListingPage({data: transformation.data, page: page});
            // Get the associated markers based on the listing items.
            transformation.markers = getActiveMarkers({data: transformation.data, page: page});
            // Trigger child components render with updated data
            updateChildComponents(transformation);
          });
        }
      });

      // Handle active filter/tag button interactions (triggered by resultsHeading.js).
      $resultsHeading.on("ma:ResultsHeading:ActiveTagClicked", function (e, clearedFilter) {
        // transformData() returns a jQuery deferred object which allows us to wait for any asynchronous js execution to return before executing the .done(callback).
        // @see: https://api.jquery.com/deferred.done/
        transformData(masterData, clearedFilter).done(function (transformation) {
          masterData = transformation.data; // preserve state
          transformation.clearedFilter = clearedFilter;

          masterData = transformation.data; // preserve state
          // Update the results heading based on the current items state.
          transformation.data.resultsHeading = listings.transformResultsHeading({ data: transformation.data });
          // Update pagination data structure, reset to first page
          transformation.data.pagination = listings.transformPaginationData({ data: transformation.data });
          // Render the listing page.
          listings.renderListingPage({ data: transformation.data });
          // Get the associated markers based on the listing items.
          transformation.markers = getActiveMarkers({ data: transformation.data });
          // Trigger child components render with updated data
          updateChildComponents(transformation);
        });
      });

      function handlePagination(e, target) {
        let nextPage = parseInt(target, 10);
        // If this is happening during page load, e will be null, and focus should not be updated.
        let focus = !!e;

        masterData.pagination = listings.transformPaginationData({ data: masterData, targetPage: nextPage });
        masterData.resultsHeading = listings.transformResultsHeading({ data: masterData, page: nextPage });
        listings.renderListingPage({ data: masterData, page: nextPage, focus });

        let markers = getActiveMarkers({ data: masterData, page: nextPage });
        // Trigger child components render with updated data
        updateChildComponents({ data: masterData, markers: markers });
      }

      function getPage() {
        let defaultPage = 1;
        let params = new URLSearchParams(window.location.search);
        if (history.state) {
          defaultPage = history.state.page;
        }
        if (params) {
          defaultPage = params.get("_page");
        }
        return defaultPage;
      }

      // Handle pagination event (triggered by pagination.js), render targetPage.
      $pagination.on("ma:Pagination:Pagination", handlePagination);
      let defaultPage = getPage();

      handlePagination(null, defaultPage);
    });

    // Trigger events to update child components with new data.
    function updateChildComponents(args) {
      $resultsHeading.trigger("ma:ResultsHeading:DataUpdated", [args.data.resultsHeading]);
      $map.trigger("ma:GoogleMap:MarkersUpdated", [{ markers: args.markers, place: args.place }]);
      $pagination.trigger("ma:Pagination:DataUpdated", [args.data.pagination]);
      if (args.clearedFilter) {
        $locationFilter.trigger("ma:FormFilter:DataUpdated", [args.clearedFilter]);
      }
    }
  });

  /**
   * Data initialization.
   */

  /**
   * Returns a master data structure with page level / listing item level data and markup, to reflect component state.
   *
   * @param listing
   *   The locationListing data structure to use as a source
   * @param markers
   *   The array of map markers created by component google map (googleMaps.js module)
   * @returns {Array}
   *   An array with the following structure:
   *    [
   *      maxItems: the max number of items to show per listing "page" if provided, defaults to all
   *      totalPages: the number of pages of items that should render, given the current filters
   *      resultsHeading: the data structure necessary to render a resultsHeading component
   *      items: an array of listing items [
   *        isActive: whether or not the listing should be shown, given current filters state
   *        page: the page that the listing, if active, will appear on, given the current sort order
   *        promo: the data structure for the imagePromo component
   *        markup: the compiled imagePromo markup
   *        marker: the related map marker data structure for the listing item
   *      ]
   *      pagination: the data structure necessary to render a pagination component
   *      selectors: the selectors for the listing, listing items, listing row, and map
   *    ]
   */
  function populateMasterDataSource(listing, markers) {
    // Populate master data structure
    let masterData = [];

    // Ensure locationListing.imagePromos.items is an array (the twig template json_encode()'s a php array)
    let promosArray = [];
    $.map(listing.imagePromos.items, function (val, index) { promosArray[index] = val; });
    listing.imagePromos.items = promosArray;

    // Ensure locationListing.pagination.pages is an array (the twig template json_encode()'s a php array)
    let pages = [];
    $.map(listing.pagination.pages, function (val, index) { pages[index] = val; });
    listing.pagination.pages = pages;


    let masterListing = listing.imagePromos.items;

    let masterListingMarkup = listings.transformListing(masterListing, "locationListingRow");
    // The max number of items per page, if designated in locationListing data structure, else all
    masterData.maxItems = listing.maxItems ? listing.maxItems : listing.imagePromos.items.length;
    // The initial results heading data structure
    masterData.resultsHeading = listing.resultsHeading;
    // The array of items and their respective page, in/active status, marker data, imagePromo data, and markup
    masterData.items = getMasterListingWithMarkupAndMarkers(masterListing, masterListingMarkup, markers, masterData.maxItems);
    // The initial pagination data structure;
    masterData.pagination = listing.pagination;
    // The total number of pages, given the number of items and the maxItems variable
    masterData.totalPages = Math.ceil(masterData.items.length / masterData.maxItems);
    // Set the selector properties necessary to render
    masterData.selectors = {};
    masterData.selectors.container = container;
    masterData.selectors.parent = parent;
    masterData.selectors.row = row;
    masterData.selectors.map = mapCol;

    return masterData;
  }

  /**
   * Creates the master data structure items array
   *
   * @param listing
   *   The locationListing data structure
   * @param markup
   *   The generated array of item markup
   * @param markers
   *   The associated map markers for each item
   * @param max
   *   The maximum number of items per page
   * @returns {Array}
   *  An array of listing items with the following structure:
   *  [
   *      isActive: whether or not the listing should be shown, given current filters state
   *      page: the page that the listing, if active, will appear on, given the current sort order
   *      promo: the data structure for the imagePromo component
   *      markup: the compiled imagePromo markup
   *      marker: the related map marker data structure for the listing item
   *   ]
   */
  function getMasterListingWithMarkupAndMarkers(listing, markup, markers, max) {
    let items = [];
    markers.forEach(function (item, index) {
      items[index] = {
        isActive: true, // @todo consider checking for this in case of server side preprocessing of state
        page: Math.ceil((index + 1) / max),
        marker: item,
        markup: markup[index],
        data: listing[index]
      };
    });
    return items;
  }

  /**
   * Data transformation.
   */

  /**
   * The main data transformation wrapper, returns an instance of masterData which reflects the component state.
   *
   * @param data
   *  An instance of masterData to start from.
   * @param transformation
   *  An object representing the change in state (locationFilter form data, resultsHeading tag interaction, etc.)
   *
   * @returns {{data: *, markers: *}}
   *  An object with the current state masterData instance and an array of their related sorted markers to send to map.
   */
  function transformData(data, transformation) {
    // This data transformation potentially involves asynchronous google geocoding.
    // This jQuery deferered object allows us to wait for a return before moving on inside of the parent function (which invokes this function).
    // @see https://api.jquery.com/jquery.deferred/
    let promise = $.Deferred();
    let transformReturn = {};

    // First filter the data based on component state, then sort alphabetically by default.
    let filteredData = listings.filterListingData(data, transformation),
      sortedData = listings.sortDataAlphabetically(filteredData),
      place = "";

    // Sort data by location, if that filter is present.
    if (listings.hasFilter(filteredData.resultsHeading.tags, "location")) {
      place = listings.getFilterValues(filteredData.resultsHeading.tags, "location")[0]; // returns array
      // If place argument was selected from the locationFilter autocomplete (initiated on the zipcode text input).
      if (typeof ma.autocomplete !== "undefined") {
        let autocompletePlace = ma.autocomplete.getPlace();
      }
      // Geocode the address, then sort the markers and instance of locationListing masterData.
      ma.geocoder = ma.geocoder ? ma.geocoder : new google.maps.Geocoder();
      if (typeof autocompletePlace !== "undefined" && autocompletePlace.hasOwnProperty("place_id")) {
        // This is an asynchronous function
        listings.geocodePlaceId(autocompletePlace.place_id, function (result) {
          transformReturn.data = sortDataAroundPlace(result, filteredData);
          transformReturn.geocode = result;
          // Return the data sorted by location and the geocoded place object
          promise.resolve(transformReturn);
        });
      }
      // If place argument was populated from locationFilter (zipcode text input) but not from Place autocomplete.
      else {
        // This is an asynchronous function
        var reasonable_formatted_location = place + " MA, USA";
        listings.geocodeAddressString(reasonable_formatted_location, function (result) {
          transformReturn.data = sortDataAroundPlace(result, filteredData);
          transformReturn.geocode = result;
          // Return the data sorted by location and the geocoded place object
          promise.resolve(transformReturn);
        });
      }
    }
    else {
      // Return the data sorted by alphabet and the empty place object
      promise.resolve({ data: sortedData, place: place });
    }

    return promise;
  }

  /**
   * Returns the markers which correspond to a given "page" of location listing data.
   *
   * @param args
   *  An object with the following structure:
   *    {
   *      data: instance of filtered, sorted masterData off of which to base markers
   *      page: the target page of items/markers to render
   *    }
   *
   * @returns
   *   An array of corresponding map marker objects which should be rendered
   */
  function getActiveMarkers(args) {
    let data = args.data,
      page = args.page ? args.page : 1; // default to first page if non provided

    // Get just the markers from our active sorted/filtered data listing.
    return data.items.filter(function (item) {
      return item.isActive && item.page === page;
    }).map(function (item) {
      return item.marker;
    });
  }

  /**
   * Returns instance of location listing masterData, sorted proximity to place.
   *
   * @param geocode
   *   The geocode information by which to sort.
   * @param data
   *   The instance of location listing masterData.
   * @returns {*}
   *   Sorted instance of location listing masterData.
   */
  function sortDataAroundPlace(geocode, data) {
    // Get all existing marker distance from place, assign as marker property.
    for (let key in data.items) {
      if (data.items.hasOwnProperty(key)) {
        data.items[key].marker.distance = google.maps.geometry.spherical.computeDistanceBetween(geocode.geometry.location, data.items[key].marker.getPosition());
      }
    }

    // Sort existing markers by closest to the place.
    data.items.sort(function (a, b) {
      return a.marker.distance - b.marker.distance;
    });

    // Update each location listing item's page number based on new marker sort order.
    let paginated = listings.paginateItems(data.items, data.maxItems);
    data.items = paginated.items;
    data.totalPages = paginated.totalPages;
    data.place = geocode;

    // Return the newly sorted instance of location listing masterData.
    return data;
  }
}) (window, document, jQuery);
