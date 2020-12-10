import React from 'react';
import { StoryPage } from 'StorybookConfig/preview';
import HeaderMixed from './index';
import mainItems from './main-nav.data';
import { LoginItem, TranslateItem, StateItem } from './utility-items.data';

export const HeaderMixedExample = (args) => <HeaderMixed {...args} />;
HeaderMixedExample.args = {
  utilityItems: [
    TranslateItem,
    StateItem,
    LoginItem
  ],
  mainItems
};
HeaderMixedExample.storyName = 'Default';

export const HeaderMixedWithoutMainNav = (args) => <HeaderMixed {...args} />;
HeaderMixedWithoutMainNav.args = {
  utilityItems: [
    TranslateItem,
    StateItem,
    LoginItem
  ]
};
HeaderMixedWithoutMainNav.storyName = 'Header Mixed without MainNav';

export const HeaderMixedWithoutMainNavUtilityNav = (args) => <HeaderMixed {...args} />;
HeaderMixedWithoutMainNavUtilityNav.storyName = 'Header Mixed with NavSearch';
export const HeaderMixedWithoutUtilityNav = (args) => <HeaderMixed {...args} />;
HeaderMixedWithoutUtilityNav.args = {
  mainItems
};
HeaderMixedWithoutUtilityNav.storyName = 'Header mixed without UtilityNav';

export const HeaderMixedWithoutMainUtilityNavAndSearch = (args) => <HeaderMixed {...args} />;
HeaderMixedWithoutMainUtilityNavAndSearch.args = {
  NavSearch: null
};
HeaderMixedWithoutMainUtilityNavAndSearch.storyName = 'Header mixed without MainNav, UtilityNav and Search';

export default {
  title: 'organisms/HeaderMixed',
  component: HeaderMixed,
  parameters: {
    docs: {
      page: () => <StoryPage />
    }
  }
};
