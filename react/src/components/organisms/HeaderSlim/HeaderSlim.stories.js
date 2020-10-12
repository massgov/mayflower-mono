import React from 'react';
import { StoryPage } from 'StorybookConfig/preview';

import logo from '@massds/mayflower-assets/static/images/stateseal.png';
import SiteLogo from 'MayflowerReactMedia/SiteLogo';
import HeaderSearch from 'MayflowerReactMolecules/HeaderSearch';
import Button from 'MayflowerReactButtons/Button';
import HeaderSlim from '.';


export const HeaderSlimExample = (args) => <HeaderSlim {...args} />;

HeaderSlimExample.storyName = 'Default';
HeaderSlimExample.args = {
  siteLogo: (
    <SiteLogo
      url={{
        domain: 'https://www.mass.gov/'
      }}
      image={{
        src: logo,
        alt: 'Massachusetts state seal',
        width: 45,
        height: 45
      }}
      siteName="Mass.gov"
      title="Mass.gov homepage"
    />
  ),
  skipNav: (<a className="ma__header__skip-nav" href="#main-content">skip to main content</a>)
};

export const HeaderSlimWithNavs = (args) => <HeaderSlim {...args} />;

HeaderSlimWithNavs.storyName = 'HeaderSlim with Nav';
HeaderSlimWithNavs.args = {
  siteLogo: (
    <SiteLogo
      url={{
        domain: 'https://www.mass.gov/'
      }}
      image={{
        src: logo,
        alt: 'Massachusetts state seal',
        width: 45,
        height: 45
      }}
      siteName="Mass.gov"
      title="Mass.gov homepage"
    />
  ),
  skipNav: (<a className="ma__header__skip-nav" href="#main-content">skip to main content</a>),
  mainNav: <Button usage="secondary" text="Log in"/>,
  utilityNav: <><a href="#main-content">Nav Link 1</a><a href="#main-content">Nav Link 2</a></>
};

export default {
  title: 'organisms/HeaderSlim',
  component: HeaderSlim,
  parameters: {
    docs: {
      page: () => <StoryPage />
    }
  }
};
