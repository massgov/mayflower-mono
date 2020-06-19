// ****** Menu button ******
let menuButton = document.querySelector(".js-header-menu-horizontal-button");
let feedbackButton = document.querySelector('.ma__fixed-feedback-button');

if (null !== menuButton) {
  menuButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("body").classList.toggle("show-menu-horizontal");

    // Hide feedback button when menu opens.
    feedbackButton.classList.toggle("hide-button");
  });
}

// ****** Main Header Search button on mobile should open the mobile menu  ******
let searchForm = document.querySelector(".js-header-search-menu-horizontal .js-header-search-form");

if (null !== searchForm) {
  searchForm.addEventListener("submit", function (event) {
    if (window.innerWidth > 620) {
      return;
    }
    event.preventDefault();
    document.querySelector("body").classList.toggle("show-menu-horizontal");
    document.querySelector('.ma__header__nav-search .ma__header-search__input').focus();
    feedbackButton.classList.toggle("hide-button");
  });
}
