import React from 'react';

// Hook
export const useEventListener = (eventName, handler, elementRef) => {
  // Create a ref that stores handler.
  const savedHandler = React.useRef();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    const element = elementRef.current;
    // Make sure element supports addEventListener.
    const isSupported = element && element.addEventListener;
    if (!isSupported) {
      return;
    }
    // Create event listener that calls handler function stored in ref.
    const eventListener = (event) => savedHandler.current(event);
    // Add event listener.
    element.addEventListener(eventName, eventListener);
    // Remove event listener on cleanup.
    // eslint-disable-next-line consistent-return
    return(() => {
      if (elementRef.current) {
        elementRef.current.removeEventListener(eventName, eventListener);
      }
    });
  }, [eventName, elementRef]);
};

export const useWindowWidth = () => {
  const windowWidth = React.useRef(window ? window.innerWidth : null);
  const resize = React.useCallback(() => {
    windowWidth.current = window.innerWidth;
  }, []);
  useEventListener('resize', resize, { current: window });

  return windowWidth;
};

function mainNavReducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case 'setButtonExpanded': {
      if (newState.items[action.index]) {
        newState.items[action.index] = {
          ...newState.items[action.index],
          buttonExpanded: action.status
        };
      }
      break;
    }
    case 'setIsOpen': {
      if (action.status) {
        newState.isOpen = action.status;
      }
      break;
    }
    case 'setIsItemOpen': {
      if (newState.items[action.index]) {
        newState.items[action.index] = {
          ...newState.items[action.index],
          isOpen: action.status
        };
      }
      break;
    }
    case 'hide': {
      newState.items = newState.items.map(() => ({
        buttonExpanded: false,
        isOpen: false
      }));
      newState.isOpen = false;
      if (Object.prototype.hasOwnProperty.call(action, 'index') && newState.items[action.index]) {
        newState.items[action.index] = { buttonExpanded: true, isOpen: true };
      }
      break;
    }
    case 'show': {
      if (Object.prototype.hasOwnProperty.call(action, 'index') && state.items[action.index]) {
        newState.items[action.index] = {
          buttonExpanded: true,
          isOpen: true
        };
      }
      newState.isOpen = true;
      break;
    }
    default:
      return newState;
  }
  return newState;
}

const initMainNavState = (items) => {
  const initialList = {
    isOpen: false,
    items: items.map(() => ({
      buttonExpanded: false,
      isOpen: false
    }))
  };
  return initialList;
};

// Custom hook that sets up the Header's MainNav context.
// This isn't placed in the hooks file because it uses mainNavReducer.
export const useHeaderMainNav = (items) => {
  const windowWidthRef = useWindowWidth();
  const breakpoint = 840;
  const [state, dispatch] = React.useReducer(mainNavReducer, items, initMainNavState);
  const setButtonExpanded = React.useCallback(({ index, status }) => {
    dispatch({ type: 'setButtonExpanded', index, status });
  }, []);
  const setIsOpen = React.useCallback(({ index, status }) => {
    dispatch({ type: 'setIsItemOpen', index, status });
  }, []);

  // Hides all Nav Items. If you pass an object with an index key,
  // all nav items except the one that matches the index will be hidden.
  const hide = React.useCallback((options = {}) => {
    const { index = undefined } = options;
    const windowWidth = windowWidthRef.current;
    if (windowWidth) {
      const body = document.querySelector('body');
      const submenuClass = 'show-submenu';
      body.classList.remove(submenuClass);
      if (windowWidth <= breakpoint) {
        dispatch({ type: 'hide', index, status: false });
      } else {
        // @todo animate here!
        dispatch({ type: 'hide', index, status: false });
      }
    }
  }, [windowWidthRef]);

  // Shows the NavItem with the passed index number.
  const show = React.useCallback((options = {}) => {
    const { index } = options;
    const windowWidth = windowWidthRef.current;
    const body = document.querySelector('body');
    const submenuClass = 'show-submenu';
    body.classList.add(submenuClass);

    if (windowWidth <= breakpoint) {
      dispatch({ type: 'show', index });
    } else {
      // @todo animate here!
      dispatch({ type: 'show', index });
    }
  }, [windowWidthRef]);
  // Restrict the available functionality for NavItem components to the following.
  return React.useMemo(() => ({
    ...state,
    setButtonExpanded,
    setIsOpen,
    hide,
    show
  }), [state, setButtonExpanded, setIsOpen, hide, show]);
};

export const useHeaderNavKeydown = (ref, onKeyDown) => {
  useEventListener('keydown', onKeyDown, ref);
};
export const useHeaderNavMouseEvents = (ref, onMouseEnter, onMouseLeave) => {
  useEventListener('mouseenter', onMouseEnter, ref);
  useEventListener('mouseleave', onMouseLeave, ref);
};
export const useHeaderNavButtonEffects = (ref, onClick) => {
  useEventListener('click', onClick, ref);
};
