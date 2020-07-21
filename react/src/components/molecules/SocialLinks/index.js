/**
 * SocialLinks module.
 * @module @massds/mayflower-react/SocialLinks
 * @requires module:@massds/mayflower-assets/scss/02-molecules/social-links
 * @requires module:@massds/mayflower-assets/scss/01-atoms/svg-icons
 * @requires module:@massds/mayflower-assets/scss/01-atoms/svg-loc-icons
 */
import React from 'react';
import PropTypes from 'prop-types';
import Facebook from 'MayflowerReactBase/Icon/Facebook';
import Twitter from 'MayflowerReactBase/Icon/Twitter';
import Linkedin from 'MayflowerReactBase/Icon/Linkedin';
import Youtube from 'MayflowerReactBase/Icon/Youtube';
import Instagram from 'MayflowerReactBase/Icon/Instagram';

const SocialLinks = (socialLinks) => (
  <section className="ma__social-links">
    {socialLinks.label && <span className="ma__social-links__label">{socialLinks.label}</span>}
    <ul className="ma__social-links__items">
      {
        socialLinks.items.map((socialLink, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <SocialLink {...socialLink} key={`socialLink_${i}`} index={i} />
        ))
      }
    </ul>
  </section>
);

const SocialLink = (socialLink) => {
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    instagram: Instagram
  };
  const IconComponent = socialLink.linkType ? icons[socialLink.linkType] : null;
  return(
    <li className="ma__social-links__item">
      <a
        href={socialLink.href}
        className="ma__social-links__link js-social-share"
        data-social-share={socialLink.linkType}
        aria-label={socialLink.altText}
      >
        <IconComponent />
      </a>
    </li>
  );
}

SocialLink.propTypes = {
  /** The URL for the link */
  href: PropTypes.string.isRequired,
  /** The type of social link and the icon name */
  linkType: PropTypes.oneOf(['facebook', 'twitter', 'linkedin', 'youtube', 'instagram']).isRequired,
  /** Alt text for accessibility */
  altText: PropTypes.string.isRequired
};

SocialLinks.propTypes = {
  /** The optional label for the social links */
  label: PropTypes.string,
  /** The social links to display */
  items: PropTypes.arrayOf(PropTypes.shape(SocialLink.propTypes)).isRequired
};

SocialLinks.defaultProps = {
  label: ''
};

export default SocialLinks;
