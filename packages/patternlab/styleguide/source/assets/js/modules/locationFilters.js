export default (function (window,document,$,undefined) {
  $('.js-location-filters:not(.leaflet)').each(function() {
    let $el = $(this);

    let $resultHeading = $('.js-results-heading'),
      $clearAllButton = '.js-results-heading-clear', // events triggered on parent
      $filterButton = '.js-results-heading-tag'; // events triggered on parent

    // When google map libraries are loaded, initialize places.autocomplete on the location input, if it exists.
    $(document).on('ma:LibrariesLoaded:GoogleMaps', function() {
      let $locationFilterParent = $('.js-filter-by-location', $el);
      let $locationFilter = $locationFilterParent.find('input');
      if ($locationFilter.length) {
        // Create the google places autocomplete object and associate it with the zip code text input.
        let locationInput = document.getElementById($locationFilter.attr('id'));
        let swLat = $locationFilterParent.data('maPlaceBoundsSwLat');
        let swLng = $locationFilterParent.data('maPlaceBoundsSwLng');
        let neLat = $locationFilterParent.data('maPlaceBoundsNeLat');
        let neLng = $locationFilterParent.data('maPlaceBoundsNeLng');

        let defaultBounds = new google.maps.LatLngBounds(new google.maps.LatLng(swLat,swLng), new google.maps.LatLng(neLat,neLng));

        // See options: https://developers.google.com/maps/documentation/javascript/places-autocomplete#add_autocomplete
        let options = {
          bounds: defaultBounds,
          strictBounds: true,
          types: ['geocode'],
          componentRestrictions: {country: 'us'},
          fields: ['place_id'],
        };
        ma.autocomplete = new google.maps.places.Autocomplete(locationInput, options);
      }

      populateFormData($el, false);
    });

    // Listen for clear all button click + trigger interaction event on parent.
    $resultHeading.on('click', $clearAllButton, function () {
      $resultHeading.trigger('ma:ResultsHeading:ActiveTagClicked', [{clearedFilter: 'all'}]);
      $el.trigger('ma:FormFilter:DataUpdated', {$form: $el, clearedFilter: 'all'});
      populateFormData($el, true);
    });

    // Listen for single filter button click and trigger interaction event on parent.
    $resultHeading.on('click', $filterButton, function (e) {
      let clearedFilter = {
        'type': $(e.target).data('ma-filter-type'),
        'value': $(e.target).data('ma-filter-value'),
        'text': $(e.target).text()
      };

      $resultHeading.trigger('ma:ResultsHeading:ActiveTagClicked', [{clearedFilter: clearedFilter}]);
      $el.trigger('ma:FormFilter:DataUpdated', {$form: $el, clearedFilter: clearedFilter});
      populateFormData($el, true);
    });

    // Listen for new data from another component interaction (i.e. results heading), update form.
    $el.on('ma:FormFilter:DataUpdated', function(e, data) {
      renderForm({clearedFilter: data.clearedFilter, $form: $el});
    });

    // Handle global form submission.
    $el.submit(function(e) {
      e.preventDefault();

      // Update master data with the various filter values.
      populateFormData($el, true);
    });

  });

  function populateFormData($el, isFormSubmit) {
    let formData = getFormData({$form: $el});

    if (!isFormSubmit) {
      let location = getParameterFromUrl('location');
      let $location = $el.find('.js-filter-by-location');

      // Set the location from the URL.
      $location.find('input').val(location);

      // Build the form data from the URL params.
      formData = [];

      // Get location data from URL.
      if (location) {
        formData.push({
          type: 'location',
          text: location,
          value: location
        });
      }

      let $tags = $el.find('.js-filter-by-tags');
      let tags = getParameterFromUrl('tags');
      if (tags) {
        let splitTags = tags.split(',');
        splitTags.forEach((tag) => {
          if (tag) {
            tag = tag.split(':');
            formData.push({
              type: 'tag',
              text: tag[1],
              value: tag[0]
            });
            $tags.find('input[type=checkbox][value=' + tag[0] + ']').prop('checked', true);
          }
        });
      }
    }

    pushFilterState(formData, isFormSubmit);

    // Trigger location listing filter event with current filter values.
    $el.trigger('ma:LocationFilter:FiltersUpdated', [{formData: formData}, isFormSubmit]);
  }

  function renderForm(args) {
    let clearedFilter = args.clearedFilter;
    // The clear all button was pressed.
    if (clearedFilter === "all") {
      clearForm(args);
    }
    // Single filter button was pressed.
    else {
      clearDeactivatedFilter(args);
    }
  }

  function getParameterFromUrl(param) {
    let params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  function getFormData(args) {
    let $form = $(args.$form),
      $location = $form.find('.js-filter-by-location'),
      $tags = $form.find('.js-filter-by-tags'),
      formData = [];

    // Get location
    if ($location.find('input').length) {
      let place = $location.find('input').val();
      if (place) {
        formData.push({
          type: 'location',
          text: place,
          value: place
        });
      }
    }

    $tags.find('input:checked').each(function() {
      formData.push({'type': 'tag', 'value': $(this).val(), 'text': $(this).siblings("label").text()});
    });

    return formData;
  }

  function clearDeactivatedFilter(args) {
    let $form = $(args.$form),
      $place = $form.find('.js-filter-by-location'),
      $tags = $form.find('.js-filter-by-tags'),
      clearedFilter = args.clearedFilter;

    // If the cleared filter button was for a location filter.
    if (clearedFilter.type === 'location') {
      $place.find('input').val("");
      return;
    }

    // If the cleared filter button was for a tag filter.
    if (clearedFilter.type === 'tag') {
      $tags.find('input[type=checkbox][value=' + clearedFilter.value + ']').prop('checked', false);
    }
  }

  function clearForm(args) {
    let $form = $(args.$form),
      $tags = $('.js-filter-by-tags', $form),
      $place = $('.js-filter-by-location', $form).find('input');

    // Clear location text input.
    if ($place.length) {
      $place.val("");
    }
    // Uncheck all checked tags inputs.
    $tags.find('input:checked').prop('checked', false);
  }

  function pushFilterState(filters, isFormSubmit) {
    let params = new URLSearchParams(window.location.search);
    let pageNum = params.get('page');

    if (isFormSubmit) {
      pageNum = 1;
      params.set('page', pageNum);
    }

    params.delete('location');
    params.delete('tags');

    if (filters.length) {
      let tagFilters = [];
      filters.forEach((filter) => {
        if (filter.type === 'location') {
          params.set('location', filter.value);
        }
        if (filter.type === 'tag') {
          tagFilters.push(filter.value + ':' + filter.text);
        }
      });

      params.set('tags', tagFilters.join(','));
    }

    history.pushState(
      { page: pageNum },
      `${document.title} | page ${pageNum}`, `${window.location.origin}${window.location.pathname}?${params.toString()}`
    );
  }

})(window,document,jQuery);
