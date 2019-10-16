import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text, array } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import MultiSelectDropDown from './index';

storiesOf('molecules', module)
  .addDecorator(withKnobs({ escapeHTML: false }))
  .add('MultiSelectDropDown', (() => {
    const props = {
      title: text('title', 'Filter by Format(s)'),
      titleClasses: array('titleClasses', []),
      dropdownItems: object('dropdownItems', [{
        label: 'PDF',
        value: 'pdf'
      }, {
        label: 'Excel',
        value: 'excel'
      }, {
        label: 'CSV',
        value: 'csv'
      }, {
        label: 'HTML',
        value: 'html'
      }, {
        label: 'JSON',
        value: 'json'
      }], 'dropdownItems'),
      onItemSelect: action('onItemSelect onClick'),
      onDropDownClick: action('onButtonClick onClick'),
      fieldName: text('fieldName', 'formats')
    };
    return(
      <MultiSelectDropDown {...props} />
    );
  }));
