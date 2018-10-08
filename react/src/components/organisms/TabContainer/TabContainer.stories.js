import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, object, select, text, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import TabContainer from '.';
import Tab from '../../molecules/Tab';

storiesOf('organisms', module)
  .add(
    'TabContainer',
    withInfo()(() => {
      return(
        <TabContainer>
          <Tab title="Tab 1">
            <TabContainer nested={true}>
              <Tab title="Nested Tab Here">This should support nesting like this.</Tab>
              <Tab title="Another Nested Tab">Tabs have unique ids that are tracked locally without state.</Tab>
            </TabContainer>
          </Tab>
          <Tab title="Tab 2">And this is my second tab.</Tab>
          <Tab title="Tab 3">Last Tab!</Tab>
        </TabContainer>
      );
    })
  );
