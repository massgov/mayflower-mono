import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import EmergencyHeader from '.';
import Icon from '../../atoms/icons/Icon';
import { svgOptions } from '../../atoms/icons/Icon/Icon.knob.options';

storiesOf('molecules', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('EmergencyHeader', (() => {
    const iconName = select('Icon: name', svgOptions, 'alert');
    const titleText = text('title', 'The State is experiencing severe weather due to the winter storm Paula.');
    const props = {
      title: ({ theme, linkClasses }) => <a className={linkClasses} href="https://www.mass.gov">{titleText}</a>,
      theme: select('theme', {
        'c-highlight (default)': 'c-highlight',
        'c-primary': 'c-primary',
        'c-primary-alt': 'c-primary-alt',
        'c-error': 'c-error',
        'c-gray': 'c-gray'
      }, 'c-highlight'),
      prefix: text('prefix', 'Emergency Alerts'),
      icon: (!iconName) ? null : <Icon name={iconName} />
    };
    return(<EmergencyHeader {...props} />);
  }));
