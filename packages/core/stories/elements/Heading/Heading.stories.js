import React from 'react';
import ColoredHeading from '@massds/mayflower-react/dist/ColoredHeading';
import CompHeading from '@massds/mayflower-react/dist/CompHeading';
import SidebarHeading from '@massds/mayflower-react/dist/SidebarHeading';
import { attachHTML } from '../../util/renderCode';

const { STORYBOOK_CDN_PATH } = process.env;

const coloredHeading = (
  <>
    <ColoredHeading
      color="blue"
      level="2"
      text="Colored Heading (Primary)"
    />
    <ColoredHeading
      color="green"
      sidebar
      level="2"
      text="Colored Heading (Primary Alt)"
    />
  </>
);

const compHeading = (
  <>
    <CompHeading
      centered={false}
      color=""
      id=""
      level={3}
      sidebar={false}
      title="Comp Heading (Primary Alt | H3)"
      titleContext=""
    />
    <CompHeading
      centered={false}
      color="yellow"
      id=""
      level={4}
      sidebar={false}
      title="Comp Heading (Highlight | H4)"
      titleContext=""
    />
    <CompHeading
      centered={false}
      color="gray"
      id=""
      level={5}
      sidebar={false}
      title="Comp Heading (Gray | H5)"
      titleContext=""
    />
  </>
);

const sidebarHeading = (
  <SidebarHeading
    level={2}
    title="List Heading"
  />
);

const notesHeadingColored = `// Link to CSS: <link rel="stylesheet" href="${STORYBOOK_CDN_PATH}/css/colored-heading.css">`;

const notesHeadingComp = `// Link to CSS: <link rel="stylesheet" href="${STORYBOOK_CDN_PATH}/css/comp-heading.css">`;

const notesHeadingSidebar = `// Link to CSS: <link rel="stylesheet" href="${STORYBOOK_CDN_PATH}/css/sidebar-heading.css">`;

export const headingColored = () => coloredHeading;
attachHTML(headingColored, coloredHeading, notesHeadingColored);

export const headingComp = () => compHeading;
attachHTML(headingComp, compHeading, notesHeadingComp);

export const headingSidebar = () => sidebarHeading;
attachHTML(headingSidebar, sidebarHeading, notesHeadingSidebar);
