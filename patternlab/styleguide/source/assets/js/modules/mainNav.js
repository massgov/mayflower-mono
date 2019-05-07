
const menuButton = document.querySelector(".js-header-menu-button");
let menuButtonText = menuButton.querySelector('.ma__header__menu-text');
let buttonLabel = menuButtonText.textContent;
const feedbackButton = document.querySelector('.ma__fixed-feedback-button');
let menuItems = document.querySelectorAll('.js-main-nav-toggle');
let mobileUtilityItems = document.querySelector('.ma__header__utility-nav--narrow');
const stateOrgsButton = mobileUtilityItems.getElementsByClassName('js-util-nav-toggle')[0];
let windowWidth = window.innerWidth;


// create a new div element 
var menuOverlay = document.createElement("div");
menuOverlay.setAttribute("class", "menu-overlay");
document.body.appendChild(menuOverlay);
// Close and reset menu on overlay click
menuOverlay.addEventListener("click", function () {
  close();
});

// Open and close the menu
if (null !== menuButton) {
  menuButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("body").classList.toggle("show-menu");
    menuOverlay.classList.toggle('overlay-open');
    feedbackButton.style.zIndex = "0";

    if (buttonLabel == "Menu") {
      menuButtonText.textContent = "Close";
      buttonLabel = "Close";
    } else {
      menuButtonText.textContent = "Menu";
      buttonLabel = "Menu";
    }
  });
}

// ****** Main Header Search button on mobile should open the mobile menu  ******
const searchForm = document.querySelector(".js-header-search-menu .js-header-search-form");

if (null !== searchForm) {
  searchForm.addEventListener("submit", function (event) {
    if (window.innerWidth > 620) {
      return;
    }
    event.preventDefault();
    document.querySelector("body").classList.toggle("show-menu");
    document.querySelector('.ma__header__nav-search .ma__header-search__input').focus();
    feedbackButton.classList.toggle("hide-button");

    if (buttonLabel == "Menu") {
      menuButtonText.textContent = "Close";
      buttonLabel = "Close";
    } else {
      menuButtonText.textContent = "Menu";
      buttonLabel = "Menu";
    }

    menuOverlay.classList.toggle('overlay-open');
  });
}

// On mobile, turn govt button into link
stateOrgsButton.addEventListener("click", function (e) {
  stateOrgsButton.querySelector('.ma__utility-nav__content').remove();
  window.location.pathname = 'https://www.mass.gov/state-a-to-z';
});

// Slide submenus open
[].forEach.call(menuItems, function (item) {
  const itemButton = item.querySelector('.ma__main-nav__top-link');
  const subMenu = item.querySelector('.ma__main-nav__subitems');
  const subItems = subMenu.querySelector('.ma__main-nav__container');

  subItems.style.opacity = "0";

  itemButton.addEventListener("click", function (e) {
    item.classList.toggle('submenu-open');

    if (subMenu.classList.contains('is-closed')) {
      /** Show the subMenu. */
      subMenu.classList.remove('is-closed');
      subMenu.style.height = "auto";

      /** Get the computed height of the subMenu. */
      var height = subMenu.clientHeight + "px";
      /** Set the height of the submenu as 0px, */
      /** so we can trigger the slide down animation. */
      subMenu.style.height = "0";

      subMenu.style.height = height;
      subItems.style.opacity = "1";


      /** Slide up. */
    } else {
      /** Set the height as 0px to trigger the slide up animation. */
      subMenu.style.height = "0";
      subItems.style.opacity = "0";
      subMenu.classList.add('is-closed');
    }

    hide(item);

  })

});

function hide(thisItem) {
  // For closing all non-active open items
  for (let i = 0; i < menuItems.length; i++) {

    if (thisItem != menuItems[i]) {
      menuItems[i].classList.remove('submenu-open');
      menuItems[i].querySelector('.ma__main-nav__subitems').classList.add('is-closed');
    }
  }
}

function close() {
  document.querySelector("body").classList.toggle("show-menu");
  menuOverlay.classList.toggle('overlay-open');

  menuButtonText.textContent = "Menu";
  buttonLabel = "Menu";
}

