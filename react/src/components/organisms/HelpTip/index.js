import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import some from 'lodash.some';

import Collapse from '../../animations/Collapse';
import Icon from '../../atoms/icons/Icon';
import './style.css';


class HelpTip extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {
    this.setState({ isOpen: false });
  }

  componentWillReceiveProps(nextProps) {
    const isAnyDifferent = some(
      ['textBefore', 'textAfter', 'triggerText', 'helpText'],
      (property) => this.props[property] !== nextProps[property]
    );
    if (isAnyDifferent) {
      this.setState({ isOpen: false });
    }
  }

  toggleOpen = (e) => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleOpenForKeyUp = (e) => {
    if (e.which === 13 || e.which === 32) {
      // 13 is enter, 32 is spacebar
      e.preventDefault();
      e.stopPropagation();
      this.toggleOpen(e);
    }
  };

  // Rendering
  // ---------

  buildDangerouslyIfHasMarkup = (text, hasMarkup) => (hasMarkup ? <span dangerouslySetInnerHTML={{ __html: text }} /> : text)

  render() {
    const {
      hasMarkup, labelId, triggerText, textAfter, helpText, children, id
    } = this.props;

    const baseClass = classNames({
      'ma__help-tip': true,
      'mobile-tray': !this.props.bypassMobileStyle
    });
    const helpTextClasses = classNames({
      'ma__help-tip__text': !children,
      'ma__help-tip__text--children': children
    });

    return(
      <span className={baseClass} id={id}>
        <span className="ma__help-tip__label" id={labelId}>
          {this.buildDangerouslyIfHasMarkup(this.props.textBefore, hasMarkup)}
          {/* can't use a button b/c disrupts fieldsets when used inside of legend */}
          <div
            className={`ma__help-tip__trigger ${this.state.isOpen ? 'active' : ''}`}
            onClick={this.toggleOpen}
            onKeyUp={this.toggleOpenForKeyUp}
            tabIndex="0"
            role="button"
            aria-describedby={id}
            aria-expanded={this.state.isOpen}
          >
            {this.buildDangerouslyIfHasMarkup(triggerText, hasMarkup)}
            <Icon name="questionmark" svgHeight={15} svgWidth={15} />
          </div>
          {this.buildDangerouslyIfHasMarkup(textAfter, hasMarkup)}
        </span>
        <Collapse in={this.state.isOpen} dimension="height" className="ma__help-tip__container">
          <div className="ma__help-tip__content">
            <div
              tabIndex="0"
              role="button"
              className="ma__help-tip__close-mobile"
              onClick={this.toggleOpen}
              onKeyUp={this.toggleOpenForKeyUp}
            >
              <Icon name="close" label="Close help tip" />
            </div>
            <div
              tabIndex="0"
              role="button"
              className="ma__help-tip__close-desktop"
              onClick={this.toggleOpen}
              onKeyUp={this.toggleOpenForKeyUp}
            >
              <Icon name="close" label="Close help tip" />
            </div>
            {(helpText || children) && (
              <div className={helpTextClasses} aria-live="polite">
                {helpText && <p className="ma__help-tip__text--direct">{helpText}</p>}
                {children && children}
              </div>
            )}
          </div>
        </Collapse>
      </span>
    );
  }
}

HelpTip.propTypes = {
  textBefore: PropTypes.string,
  textAfter: PropTypes.string,
  triggerText: PropTypes.string.isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  labelId: PropTypes.string,
  id: PropTypes.string,
  bypassMobileStyle: PropTypes.bool,
  hasMarkup: PropTypes.bool
};

HelpTip.defaultProps = {
  labelId: '',
  hasMarkup: false
};

export default HelpTip;
