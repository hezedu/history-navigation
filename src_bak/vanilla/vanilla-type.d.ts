import type {HistoryNavigation,  } from '../lib/history-navigation';
type BeforeDestory = () => void;
type CmptReturn = {
  beforeDestory?: BeforeDestory,
  activated?: () => void,
  deactivated?: () => void,
}
type ComponentResult = void | BeforeDestory | CmptReturn;
type Component = (el: HTMLElement, hNv: HistoryNavigation, item: StackItem) => ComponentResult;


export type Pages = Array<Page>;


export type TabBarItem = {
  path: string,
  [key: string]: any
}
export type TabBarList = Array<TabBarItem>;
export type TabBarComponentResult = {dom: HTMLElement, onSwitch: (tabIndex: number) => void};
export type TabBarComponent = (list: TabBarList, hNv: HistoryNavigation) => TabBarComponentResult;
export type TabBar = {
  list: TabBarList,
  component?: TabBarComponent
};

type TransitionCss = {
  [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
};
type TransitionFn = () => TransitionCss;
type PageTransition = {
  type: 'transition' | 'animation',
  beforeEnter: TransitionFn,
  enter: TransitionFn,
  leave: TransitionFn

  // entered: TransitionFn,
  // leave: TransitionFn,
  // left: TransitionFn
}

type Page = {
  path: string,
  component: Component,
  meta?: PageMeta,
  className?: string,
  transition?: TransitionFn
}

type PageItem = Page & {
  trimedPath: string,
  isTab: boolean,
  tabIndex?: number
}

export type PageHashMap = {
  [key: string]: PageItem
}
export type Config = {
  isHashMode?: boolean,
  base?: string,
  pageBg?: string,
  pageTransition?: PageTransition,
  pageClassName?: string,
  pages: Pages,
  notFoundPage?: Component,
  tabBar?: TabBar,
  onRouted?: Function
}
