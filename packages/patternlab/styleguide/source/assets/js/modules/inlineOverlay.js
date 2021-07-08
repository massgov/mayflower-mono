
export default (function (window,document,$,undefined) {
  let tocContainerClass = '.js-toc-container';
  let containerClass = '.js-inline-overlay';
  let contentClass = '.js-inline-overlay-content';
  let toggleClass = '.js-inline-overlay-toggle';
  let titleClass  = '.js-inline-overlay-title';
  let feedbackButton = $('body').find('.ma__fixed-feedback-button');
  let tocFocusableElements = $('.js-inline-overlay').find(':focusable');
  let firstFocusableElement = tocFocusableElements[0];
  let lastFocusableElement = tocFocusableElements[tocFocusableElements.length - 1];
  const mainPageToggleButtton = $(".js-inline-overlay-title .js-inline-overlay-toggle");

  function initialize () {
    // Add random ID if no ID present.
    let contentID = $(contentClass).attr('id');
    if(!contentID) {
      let id = `overlay-${Math.floor(Math.random()*100000)}`;
       $(containerClass).attr('id', id);
       $(toggleClass).attr('aria-controls, id');
    }
  }

  function toggleOverlay() {
    let $containerEl = $(this).closest(tocContainerClass).find(containerClass);
    let isOpen = $containerEl.hasClass('is-open');
    $('body').toggleClass('scroll-disabled', !isOpen);
    $containerEl.toggleClass('is-open', !isOpen);

    $(`${toggleClass}[aria-expanded=${!isOpen}]`).parents(titleClass).focus();

    feedbackButton.toggleClass('hide-button');
  }

  initialize();
  $(document).on('click', toggleClass, toggleOverlay);
  // allow esc key to dismiss overlay
  $(document).keydown(function(e) {
    // ESCAPE key pressed
    let key = (e.keyCode ? e.keyCode : e.witch);
    if (key == "27" && $(containerClass).hasClass('is-open')) {
      // Close the overlay.
      $('.ma__toc--overlay__container').removeClass('is-open');
      // Set focus on the toggle GamepadButton.
      mainPageToggleButtton.focus();
    }
  });

  // Keep the focus in the overlay while it's open. Don't let it go on the main page.
  // console.log(tocFocusableElements[lastIndex]);
  $(lastFocusableElement).keydown(function(e) {
    let key = (e.keyCode ? e.keyCode : e.witch);
    // When tab key is hit on the last ficusable element,
    if (key == "9") {
      // Set focus on the first focusable element in the overlay.
      firstFocusableElement.focus();
    }
  });

})(window,document,jQuery);
