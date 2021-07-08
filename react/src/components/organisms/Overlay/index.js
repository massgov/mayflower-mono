import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.css';

class Overlay extends Component {
  state = {
    showContent: false
  };
  toggleContent = () => {
    this.setState((currentState) => {
      return {
        showContent: !currentState.showContent
      };
    }, () => {
      // Set focus onto overlay-title after state is set.
      if (this.state.showContent) {
        document.getElementsByClassName('js-inline-overlay-title')[0].focus();
      }
    })
  };
  render() {
    const containerClasses = classNames({
      'ma__toc--overlay__container': true,
      'js-inline-overlay': true,
      'is-open': this.state.showContent
    });
    return(
      <div className="ma__toc--overlay js-toc-container" id={this.props.id}>
        <div className="ma__toc__toc__title js-inline-overlay-title" tabIndex="-1" onClick={this.toggleContent}>
          <span className="ma__toc__subtitle">This is a part of:</span>
          {this.props.title()}
          <button type="button" className="ma__toc__toc__toggle js-inline-overlay-toggle" aria-expanded={this.state.showContent} aria-controls="toc-overlay">
            <span className="show">
              +
              <span className="ma__visually-hidden">Show table of contents</span>
            </span>
          </button>
        </div>
        <div className={containerClasses} id="toc-overlay">
          <div className="ma__toc__toc__title js-inline-overlay-title" tabIndex="-1" onClick={this.toggleContent}>
            <span className="ma__toc__subtitle">This is a part of:</span>
            {this.props.title()}
            <button type="button" className="ma__toc__toc__toggle js-inline-overlay-toggle" aria-expanded={this.state.showContent} aria-controls="toc-overlay">
              <span className="hide">
                &times;
                <span className="ma__visually-hidden">Hide table of contents</span>
              </span>
            </button>
          </div>
          <div className="ma__toc--overlay__content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  /** The overlay container id. */
  id: PropTypes.string,
  /** A function that returns a link content or text to display. */
  title: PropTypes.func,
};

export default Overlay;
