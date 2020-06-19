export default (function (window,document,$,undefined) {
  "use strict";

  $('.js-header-tag-link').each(function(index) {

    let $el = $(this),
        $showHideButton = $('.js-header-tag-button', $el),
        $dynamicItems = $('a:nth-child(n+4)', $el),
        $focusItem = $('a:nth-child(4)', $el),
        id = $el.attr('id') || 'headerTags' + (index + 1),
        open = $el.hasClass('is-open');

      // Set the id attribute (respects default if set).
      $el.attr('id', id);

      if ($dynamicItems.length) {
        // Show our see button if we have more than three items.
        $showHideButton.attr('aria-expanded',open).attr('aria-controls', id);
        $showHideButton.show();
      }

      $showHideButton.on('click', function(e) {
        e.preventDefault();
        $el.toggleClass('is-open');

        if ($el.hasClass('is-open')) {
          $showHideButton.attr('aria-expanded', 'true');
          $dynamicItems.show();
          $focusItem.focus();
        }
        else {
          $showHideButton.attr('aria-expanded', 'false');
          $dynamicItems.hide();
        }
      });
  });

  $('.ma__relationship-indicators--terms').each(function() {
    let $tagWrapper = $(this);
    let $button = $tagWrapper.find('.js-relationship-indicator-button');
    let $buttonCounter = $button.find('.tag-count');
    let $hiddenTag = $tagWrapper.find('.js-wrapped-link:hidden');
    let $focusTag = $hiddenTag.first().find('a');
    let tagCount = $hiddenTag.length;
    let $tagState = $button.find('.tag-state');

    // If hidden  tags exist, show button.
    if (tagCount) {
      $button.toggle();
    }

    // Use hidden tags to populate button label.
    $buttonCounter.text(tagCount);

    $button.on('click', function() {
      let $tagStateText = $tagState.text();

      // Open hidden tags.
      $tagWrapper.parent().toggleClass('tags-open');
      $button.toggleClass('is-open');
      $hiddenTag.toggle();

      // Change button text.
      $tagState.text($tagStateText === 'fewer' ? 'more' : 'fewer');

      $button.attr('aria-pressed', function(_, attr) { return !(attr == 'true') });

    });

    $button.on('keydown', function(e) {
      if (e.keyCode === 9 && $tagWrapper.parent().hasClass('tags-open')) { 
        $focusTag.focus();
        e.preventDefault(); 
      }
    });

    $(window).resize(function () {
      // Remove all the screen width specific styles.
      $buttonCounter.removeAttr('style');
      $hiddenTag.removeAttr('style');

      setTimeout(function(){
        let windowWidth = $(window).width();
        
        // recount the hidden tags.
        $hiddenTag = $tagWrapper.find('.ma__relationship-indicators--term:hidden');
        tagCount = $hiddenTag.length;

        // Update button text.
        $buttonCounter.text(tagCount);
        $tagState.text('more');
        
        // Reset the button visibility.
        if(tagCount >= 1 && windowWidth < 910) {
          $button.show();
        } 
        else if (tagCount == 0) {
          $button.hide();
        }
        
      }, 500);

    });

  });

})(window,document,jQuery);
