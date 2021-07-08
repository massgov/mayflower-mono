// let arrowNavItems = document.querySelectorAll(".ma__arrow-nav");
let arrowButtons = document.querySelectorAll(".ma__arrow-nav > .ma__arrow-button");

function switchVisibility() {
  let width = document.querySelector("body").clientWidth;
  // Make arrow buttons visible to keyboard and screen readers.
  if (width < 621) {
    arrowButtons.forEach(button => {
      if(button.hasAttribute("aria-hidden")) {
        button.removeAttribute("aria-hidden");
      }

      if (button.getAttribute("tabindex") == "-1") {
        button.setAttribute("tabindex", "0");
      }
    });
  }

  // Hide arrow buttons to keyboard and screen readers.
  if (width > 620) {
    arrowButtons.forEach(button => {
      if(!button.hasAttribute("aria-hidden")) {
        button.setAttribute("aria-hidden", "true");
      }

      if (button.getAttribute("tabindex") == "0") {
        button.setAttribute("tabindex", "-1");
      }
    });
  }
}

switchVisibility();
window.addEventListener("resize", switchVisibility);
