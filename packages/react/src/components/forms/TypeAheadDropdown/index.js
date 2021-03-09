/**
 * TypeAheadDropdown module.
 * @module @massds/mayflower-react/TypeAheadDropdown
 * @requires module:@massds/mayflower-assets/scss/01-atoms/button-with-icon
 * @requires module:@massds/mayflower-assets/scss/01-atoms/button-search
 * @requires module:@massds/mayflower-assets/scss/01-atoms/input-typeahead
 * @requires module:@massds/mayflower-assets/scss/01-atoms/svg-icons
 * @requires module:@massds/mayflower-assets/scss/01-atoms/svg-loc-icons
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ButtonWithIcon from 'MayflowerReactButtons/ButtonWithIcon';
import InputTextFuzzy from 'MayflowerReactForms/InputTextFuzzy';
// eslint-disable-next-line import/no-unresolved
import IconChevron from 'MayflowerReactBase/Icon/IconChevron';

const TypeAheadDropdown = (props) => {
  const [buttonExpand, setButtonExpand] = useState(false);
  const [buttonText, setButtonText] = useState(props.dropdownButton.text);
  const [buttonClicked, setButtonClicked] = useState();
  const buttonRef = useRef();
  const wrapperRef = useRef();

  const handleRefMouseDown = () => {
    setButtonClicked(true);
  }

  const handleClick = () => {
    setButtonExpand(!buttonExpand);
  }

  const handleKeyDown = (event) => {
    // If the user pressed escape, or pressed enter with nothing selected close
    // the panel.
    if ((event.key === 'Escape')
        || (event.key === 'Enter' && event.target.value === '')) {
      closeDropdown();
    }
    if (event.key === 'Escape' && buttonRef) {
      buttonRef.focus();
    }
    if (typeof props.onKeyDown === 'function') {
      props.onKeyDown(event);
    }
  }

  const handleInputBlur = () => {
    if (buttonClicked) {
      closeDropdown();
    }
  }

  const handleSelect = (event, { suggestion }) => {
    // Stop the filters form submission if enter is pressed in the selector.
    event.preventDefault();
    // Update this component state and pass the event out to the calling code.
    const { text } = suggestion.item;
    if (text.length > 0) {
      setButtonText(text);
      setButtonExpand(false);
      if (typeof props.inputText.onSuggestionClick === 'function') {
        props.inputText.onSuggestionClick(event, { suggestion });
      }
    }
  }

  const handleClickOutside = (event) => {
    // Close the panel if the user clicks outside the component.
    const node = wrapperRef.current;
    if ((node && !node.contains(event.target))) {
      if (buttonExpand) {
        setButtonExpand(false);
      }
    }
  }

  const closeDropdown = () => {
    setButtonExpand(false);
  }

  useEffect(() => {
    const selectedValue = props.inputText.selected;
    if (selectedValue !== undefined) {
      setButtonText(selectedValue);
      setButtonExpand(false);
    }
  }, [props.inputText.selected]);

  useEffect(() => {
    setButtonClicked(false);
    document.addEventListener('mousedown', handleClickOutside);
    buttonRef.current.addEventListener('mousedown', handleRefMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      buttonRef.current.removeEventListener('mousedown', handleRefMouseDown);
    };
  });

  const dropdownButton = {
    onClick: handleClick,
    setButtonRef: buttonRef,
    expanded: buttonExpand,
    icon: <IconChevron height={20} width={20} />,
    size: '',
    ...props.dropdownButton
  };
  dropdownButton.text = buttonText || dropdownButton.text;

  const inputTextFuzzyProps = {
    ...props.inputText,
    onKeyDown: handleKeyDown,
    onSuggestionClick: handleSelect,
    onBlur: handleInputBlur,
    autoFocusInput: true
  };

  return(
    <div ref={wrapperRef}>
      <ButtonWithIcon {...dropdownButton} />
      {buttonExpand && (
        <InputTextFuzzy {...inputTextFuzzyProps} />
      )}
    </div>
  );
}

TypeAheadDropdown.propTypes = {
  /** The props to set up the dropdown button */
  dropdownButton: PropTypes.shape(ButtonWithIcon.propTypes).isRequired,
  /** The props to set up the inputTextFuzzy */
  inputText: PropTypes.shape(InputTextFuzzy.propTypes).isRequired,
  /** Custom keydown callback */
  onKeyDown: PropTypes.func
};

export default TypeAheadDropdown;
