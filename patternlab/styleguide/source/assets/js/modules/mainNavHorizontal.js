export default (function (window, document, $, undefined) {

    let windowWidth = window.innerWidth;

    $(window).resize(function () {
        windowWidth = window.innerWidth;
    });

    $('.js-main-nav-horizontal').each(function () {
        let openClass = "is-open",
            hasFocus = "has-focus",
            closeClass = "is-closed",
            submenuClass = "show-submenu",
            $parent = $(this),
            $mainNavItem = $parent.find('.js-main-nav-horizontal-toggle'),
            breakpoint = 840; // matches CSS breakpoint for Main Nav

        $mainNavItem.on('keydown', function (e) {
            // Grab all the DOM info we need...
            let $link = $(this),
                $otherLinks = $mainNavItem.not($link),
                $topLevelLinks = $parent.find('.ma__main-nav-horizontal__top-link'),
                open = $link.hasClass(openClass),
                $openContent = $parent.find('.js-main-nav-horizontal-content.' + openClass),
                $focusedElement = $(document.activeElement),
                menuFlipped = (windowWidth < breakpoint),
                // relevant if open..
                $topLevelItem = $focusedElement.parents('.ma__main-nav-horizontal__item'),
                $topLevelLink = $topLevelItem.find('.ma__main-nav-horizontal__top-link'),
                $dropdownLinks = $link.find('.ma__main-nav-horizontal__subitem .ma__main-nav-horizontal__link'),
                dropdownLinksLength = $dropdownLinks.length,
                focusIndexInDropdown = $dropdownLinks.index($focusedElement),
                // Easy access to the key that was pressed.
                keycode = e.keyCode,
                action = {
                    'skip': keycode === 9, // tab
                    'close': keycode === 27, // esc
                    'left': keycode === 37, // left arrow
                    'right': keycode === 39, // right arrow
                    'up': keycode === 38, // up arrow
                    'down': keycode === 40, // down arrow
                    'space': keycode === 32, //space
                    'enter': keycode === 13 // enter
                };

            // Default behavior is prevented for all actions except 'skip'.
            if (action.close || action.left || action.right || action.up || action.down) {
                e.preventDefault();
            }

            if (action.enter || action.space) {
                $link.addClass(hasFocus);
                $otherLinks.removeClass(hasFocus);
            }

            if (action.skip) {
                console.log(focusIndexInDropdown);
            }

            if (action.skip && dropdownLinksLength === (focusIndexInDropdown + 1)) {
                console.log(focusIndexInDropdown);
                hide($openContent);
                $topLevelLink.attr('aria-expanded', 'false');
                $link.removeClass(hasFocus);
                return;
            }

            // if (action.skip && focusIndexInDropdown === -1) {
            //   console.log('back');
            // }

            // Navigate into or within a submenu. This is needed on up/down actions
            // (unless the menu is flipped and closed) and when using the right arrow
            // while the menu is flipped and submenu is closed.
            if (((action.up || action.down) && !(menuFlipped && !open))
                || (action.right && menuFlipped && !open)) {
                // Open pull down menu if necessary.
                if (!open && !$link.hasClass(hasFocus)) {
                    show($topLevelItem.find('.js-main-nav-horizontal-content'));
                    $topLevelLink.attr('aria-expanded', 'true');
                    $link.addClass(openClass);
                }

                // Adjust index of active menu item based on performed action.
                focusIndexInDropdown += (action.up ? -1 : 1);
                // If the menu is flipped, skip the last item in each submenu. Otherwise,
                // skip the first item. This is done by repeating the index adjustment.
                if (menuFlipped) {
                    if (focusIndexInDropdown === dropdownLinksLength - 1) {
                        focusIndexInDropdown += (action.up ? -1 : 1);
                    }
                } else {
                    if (focusIndexInDropdown === 0 || focusIndexInDropdown >= dropdownLinksLength) {

                        focusIndexInDropdown += (action.up ? -1 : 1);
                    }
                }
                // Wrap around if at the end of the submenu.
                focusIndexInDropdown = ((focusIndexInDropdown % dropdownLinksLength) + dropdownLinksLength) % dropdownLinksLength;
                $dropdownLinks[focusIndexInDropdown].focus();
                return;
            }

            // Close menu and return focus to menubar
            if (action.close || (menuFlipped && action.left)) {
                hide($openContent);
                $link.removeClass(openClass);
                $link.removeClass(hasFocus);
                $topLevelLink.focus().attr('aria-expanded', 'false');
                return;
            }

            // Navigate between submenus. This is needed for left/right actions in
            // normal layout, or up/down actions in flipped layout (when nav is closed).
            if (((action.left || action.right) && !menuFlipped) ||
                ((action.up || action.down) && menuFlipped && !open)) {
                let index = $topLevelLinks.index($topLevelLink),
                    prev = action.left || action.up,
                    linkCount = $topLevelLinks.length;

                // hide content
                // If menubar focus
                //  - Change menubar item
                //
                // If dropdown focus
                //  - Open previous pull down menu and select first item
                hide($openContent);
                $topLevelLink.attr('aria-expanded', 'false');
                $link.removeClass(hasFocus);
                // Get previous item if left arrow, next item if right arrow.
                index += (prev ? -1 : 1);
                // Wrap around if at the end of the set of menus.
                index = ((index % linkCount) + linkCount) % linkCount;
                $topLevelLinks[index].focus();
                return;
            }

        })
            .on('mouseenter', function (e) {
                $(this).children('button').attr("aria-expanded", "true");
                $('.has-focus').removeClass('has-focus');

                if (windowWidth > breakpoint) {
                    let $openContent = $(this).find('.js-main-nav-horizontal-content');
                    show($openContent);
                }
            })
            .on('mouseleave', function (e) {
                $(this).children('button').attr("aria-expanded", "false");

                if (windowWidth > breakpoint) {
                    let $openContent = $(this).find('.js-main-nav-horizontal-content');
                    hide($openContent);
                }
            });

        $mainNavItem.children('button, a').on('click', function (e) {
            let $el = $(this),
                $elParent = $el.parent(),
                $content = $elParent.find('.js-main-nav-horizontal-content'),
                $openContent = $parent.find('.js-main-nav-horizontal-content.' + openClass),
                isOpen = $content.hasClass(openClass);

            // mobile
            if (windowWidth <= breakpoint) {
                e.preventDefault();
                // add open class to this item
                $elParent.addClass(openClass);
                show($content);
                $el.attr('aria-expanded', 'true');
            } else {
                hide($openContent);
                $el.attr('aria-expanded', 'false');

                if (!isOpen) {
                    show($content);
                    $el.attr('aria-expanded', 'true');
                }
            }
        });

        $('.js-close-sub-nav').on('click', function () {
            let $openContent = $parent.find('.js-main-nav-horizontal-content.' + openClass);
            hide($openContent);
        });

        // Hide any open submenu content when the sidebar menu is closed
        $('.js-header-menu-button').click(function () {
            let $openContent = $parent.find('.js-main-nav-horizontal-content.' + openClass);
            hide($openContent);

            $('.ma__utility-nav__content').addClass('is-closed');
        });

        function hide($content) {
            $('body').removeClass(submenuClass);
            $parent.find("." + openClass).removeClass(openClass);

            if (windowWidth <= breakpoint) {
                $content.addClass(closeClass);
            } else {
                $content
                    .stop(true, true)
                    .slideUp('fast', function () {
                        $content
                            .addClass(closeClass)
                            .slideDown(0);
                    });
            }
        }

        function show($content) {
            $('body').addClass(submenuClass);
            if (windowWidth <= breakpoint) {
                $content
                    .addClass(openClass)
                    .removeClass(closeClass);
            } else {
                $content
                    .stop(true, true)
                    .delay(200)
                    .slideUp(0, function () {
                        $content
                            .addClass(openClass)
                            .removeClass(closeClass)
                            .slideDown('fast');
                    });
            }
        }


    });

})(window, document, jQuery);
