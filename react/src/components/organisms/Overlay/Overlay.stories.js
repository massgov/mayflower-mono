import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';

import Overlay from '.';
import markdown from './Overlay.md';
import { AccordionItem, DecorativeLink, Link, SidebarHeading, TableofContents } from '../../../index';

const getDecorativeLink = (index) => {
  const props = {
    info: text(`Overlay.Children.${index}.DecorativeLink.info`, 'Title info here'),
    text: text(`Overlay.Children.${index}.DecorativeLink.text`, 'Lorem ipsum dolor sit amet'),
    href: text(`Overlay.Children.${index}.DecorativeLink.href`, 'index.pdf'),
    showFileIcon: boolean(`Overlay.Children.${index}.DecorativeLink.showFileIcon`, true)
  };
  return<DecorativeLink {...props} />;
};

const getAccordionItem = (name = 'laptop', index) => {
  const props = {
    title: 'Collapsible Header Two',
    info: 'Collapsible Header Two',
    icon: null,
    border: boolean(`Overlay.Children.${index}.AccordionItem.border`, false),
    secondary: boolean(`Overlay.Children.${index}.AccordionItem.secondary`, false),
    emphasize: boolean(`Overlay.Children.${index}.AccordionItem.emphasize`, true),
    // eslint-disable-next-line radix
    headerLevel: parseInt(select(`Overlay.Children.${index}.AccordionItem.headerLevel`, {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6'
    }, '2'))
  };
  return<AccordionItem {...props}>{getLink()}</AccordionItem>;
};

const getLink = (sampleText = 'Sample Link') => {
  const linkProps = {
    sampleText,
    href: 'http://www.mass.gov/'
  };
  return<Link {...linkProps} />;
};

const getSidebarHeading = () => {
  const levelOptions = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6'
  };
  const props = {
    title: text('Overlay.SidebarHeading.title', 'Table of Contents'),
    // eslint-disable-next-line radix
    level: parseInt(select('Overlay.SidebarHeading.level', levelOptions, '2'))
  };
  return<SidebarHeading {...props} />;
};

storiesOf('organisms', module).addDecorator(withKnobs)
  .add(
    'Overlay',
    withInfo(`<div>${markdown}</div>`)(() => {
      // This function should normally return a component.
      // A good choice for this is Link.
      // You could also just use plain text, or whatever tags you want.
      const title = () => {
        // Toggling this will show the story using the Overlay.text prop in the title.
        const linkChoice = boolean('Overlay.linkChoice', true);
        if (linkChoice) {
          return getLink();
        }
        return text('Overlay.title', 'The Title of the Table of Contents');
      };
      const props = {
        id: text('Overlay.id', 'toc-overlay-1'),
        title
      };
      const tocProps = {
        heading: getSidebarHeading()
      };
      return(
        <Overlay{...props}>
          <TableofContents {...tocProps}>
            {getDecorativeLink(0)}
            {getAccordionItem('phone', 1)}
            {getAccordionItem('phone', 2)}
          </TableofContents>
        </Overlay>
      );
    })
  );
