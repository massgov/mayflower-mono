/**
 * FooterSlim module.
 * @module @massds/mayflower-react/FooterSlim
 * @requires module:@massds/mayflower-assets/scss/03-organisms/footer-slim
 * @requires module:@massds/mayflower-assets/scss/01-atoms/svg-icons
 * @requires module:@massds/mayflower-assets/scss/01-atoms/svg-loc-icons
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// eslint-disable-next-line import/no-unresolved
import IconMarker from 'MayflowerReactBase/Icon/IconMarker';
// eslint-disable-next-line import/no-unresolved
import IconPhone from 'MayflowerReactBase/Icon/IconPhone';
// eslint-disable-next-line import/no-unresolved
import IconLaptop from 'MayflowerReactBase/Icon/IconLaptop';

const FooterSlim = ({
  title, description, siteLogo, stackedLogo, links, contact
}) => {
  const today = new Date();
  const year = today.getFullYear();

  const logoWrapperClasses = classNames({
    'ma__footer-slim__logos': true,
    'ma__footer-slim__logos--stacked': stackedLogo
  });

  const titleWrapperClasses = classNames({
    'ma__footer-slim__title': true,
    'ma__footer-slim__title--stacked': stackedLogo
  });

  return(
    <footer className="ma__footer-slim" id="footer">
      <div className="ma__footer-slim__container ma__container">
        <div className="ma__footer-slim__container__inner">
          <div className="ma__footer-slim__info">
            <div className={titleWrapperClasses}>
              <div className={logoWrapperClasses}>
                {siteLogo}
              </div>
              {title}
            </div>
            <p>{description}</p>
            <p className="ma__footer-slim__copyright">
              &copy;
              {' '}
              {year}
              {' '}
              Commonwealth of Massachusetts
            </p>
          </div>
          <div className="ma__footer-slim__details">
            {links && (
              <div className="ma__footer-slim__links">
                {links.map((link, linkIndex) => (
                  /* eslint-disable-next-line react/no-array-index-key */
                  <a href={link.href} key={`footslimlinks-${linkIndex}`}>{link.title}</a>
                ))}
              </div>
            )}
            {contact && (
              <div className="ma__footer-slim__contact">
                {contact.address && (
                  <p>
                    <IconMarker width={20} height={20} />
                    <span>{contact.address}</span>
                  </p>
                )}
                {contact.phone && (
                  <p>
                    <IconPhone width={20} height={20} />
                    <span>{contact.phone}</span>
                  </p>
                )}
                {contact.online && contact.online.href && contact.online.title && (
                  <p>
                    <IconLaptop width={20} height={20} />
                    <a href={contact.online.href}>{contact.online.title}</a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterSlim.propTypes = {
  /** The main title to be displayed in the footer */
  title: PropTypes.string.isRequired,
  /** A short description */
  description: PropTypes.string.isRequired,
  /** Additional links for key information */
  links: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    title: PropTypes.string
  })),
  /** Contact details for the responsible authority */
  contact: PropTypes.shape({
    address: PropTypes.string,
    phone: PropTypes.string,
    online: PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string
    })
  }),
  /** One or multiple logos rendered at the footer */
  siteLogo: PropTypes.element.isRequired,
  /** Whether logo(s) should be stacked on top of footer title */
  stackedLogo: PropTypes.bool
};

export default FooterSlim;
