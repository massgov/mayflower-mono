import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text, number, boolean } from '@storybook/addon-knobs';
import logo from '@massds/mayflower-assets/static/images/stateseal.png';
import FooterSlim from './index';
import FooterSlimDocs from './FooterSlim.md';
import SiteLogo from 'MayflowerReactMedia/SiteLogo';

storiesOf('organisms/FooterSlim', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add(
    'FooterSlim', () => {
      const siteLogoProps = {
        url: {
          domain: text('siteLogo: url domain', 'https://www.mass.gov/', 'SiteLogo')
        },
        image: {
          src: text('siteLogo: image src', logo, 'SiteLogo'),
          alt: text('siteLogo: image alt', 'Massachusetts state seal', 'SiteLogo'),
          width: number('siteLogo: image width', 45, 'SiteLogo'),
          height: number('siteLogo: image height', 45, 'SiteLogo')
        },
        title: text('siteLogo: title', 'Mass.gov homepage', 'SiteLogo')
      };
      const props = {
        title: text('title', 'Massachusetts Executive Office of Eductation (EDU)'),
        description: text('description', "The Department of Early Education and Care's mission is to support the healthy growth and development of all children by providing high quality programs and resources for families"),
        links: object('links', [
          { href: '#', title: 'Lead Agencies Policies' },
          { href: '#', title: 'Child Care Licensing Procedures' }
        ]),
        contact: {
          address: text('contact: address', '51 Sleeper St. 4th Floor, Boston, MA 02210', 'Contact'),
          phone: text('contact: phone', '(617) 988-6600', 'Contact'),
          online: {
            href: text('contact: online href', '#', 'Contact'),
            title: text('contact: online title', 'EEC Official Website', 'Contact')
          }
        },
        siteLogo: <SiteLogo {...siteLogoProps} />,
        stackedLogo: boolean('stackedLogo', false)
      };
      return(<FooterSlim {...props} />);
    },
    { info: FooterSlimDocs }
  )
  .add(
    'FooterSlim with two logos', () => {
      const siteLogo1Props = {
        url: {
          domain: text('siteLogo: url domain', 'https://www.mass.gov/', 'SiteLogo 1')
        },
        image: {
          src: text('siteLogo: image src', logo, 'SiteLogo 1'),
          alt: text('siteLogo: image alt', 'Massachusetts state seal', 'SiteLogo 1'),
          width: number('siteLogo: image width', 45, {}, 'SiteLogo 1'),
          height: number('siteLogo: image height', 45, {}, 'SiteLogo 1')
        },
        title: text('siteLogo: title', 'Mass.gov homepage', 'SiteLogo 1')
      };
      const siteLogo2Props = {
        url: {
          domain: text('siteLogo: url domain', 'http://www.doe.mass.edu/', 'SiteLogo 2')
        },
        image: {
          src: text('siteLogo: image src', 'http://www.doe.mass.edu/images/Master-Logo_695x338_color.png', 'SiteLogo 2'),
          alt: text('siteLogo: image alt', 'Massachusetts state seal', 'SiteLogo 2'),
          width: number('siteLogo: image width', 120, {}, 'SiteLogo 2'),
          height: number('siteLogo: image height', 45, {}, 'SiteLogo 2')
        },
        title: text('siteLogo: title', 'Mass.gov homepage', 'SiteLogo 2')
      };
      const props = {
        title: text('title', 'Massachusetts Executive Office of Eductation (EDU)'),
        description: text('description', "The Department of Early Education and Care's mission is to support the healthy growth and development of all children by providing high quality programs and resources for families"),
        links: object('links', [
          { href: '#', title: 'Lead Agencies Policies' },
          { href: '#', title: 'Child Care Licensing Procedures' }
        ]),
        contact: {
          address: text('contact: address', '51 Sleeper St. 4th Floor, Boston, MA 02210', 'Contact'),
          phone: text('contact: phone', '(617) 988-6600', 'Contact'),
          online: {
            href: text('contact: online href', '#', 'Contact'),
            title: text('contact: online title', 'EEC Official Website', 'Contact')
          }
        },
        siteLogo: (
          <React.Fragment>
            <SiteLogo {...siteLogo1Props} />
            <SiteLogo {...siteLogo2Props} />
          </React.Fragment>
        ),
        stackedLogo: boolean('stackedLogo', true)
      };
      return(<FooterSlim {...props} />);
    },
    { info: FooterSlimDocs }
  );
