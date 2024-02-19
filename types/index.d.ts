interface  HistoryNavigation {

  push: (userUrl: UserUrl) => void;
}
type OnCreateParams = {
  route: Route,
  meta: PageMeta,
  stateKey: number
}
type Component = {
  // onCreate: (OnCreateParams) => HTMLElement,
  
  onCreate: (item: PageStackItem, hNv: HistoryNavigation) => HTMLElement,
  onBeforeDestory: () => void,
  // onDestory: Function,
  // onModalCreate?: Function,
  // onModealDestory?: Function,
  // activated?: Function,
  // deactivated?: Function
}
type PageMeta = {
  [key: string]: any
}
type Page = {
  path: string,
  component: Component,
  meta?: PageMeta,
  className?: string
}

export type TabBar = Array<string>;
export type Pages = Array<Page>;

export type Config = {
  isHashMode?: boolean,
  base?: string,
  pageBg?: string,
  pageClassName?: string,
  pages: Pages,
  notFoundPage?: Component,
  tabBar?: TabBar,
}

type PageItem = Page & {
  trimedPath: string,
  isTab: boolean,
  // tabIndex?: number
}

export type PageHashMap = {
  [key: string]: PageItem
}

type PageStackItem = {
  stateKey: number,
  route: Route,
  isTab: boolean,
  tabIndex?: number
}
export type StackMap = {
  [key: string]: PageStackItem
};

export type QueryObj = {
  [key: string]: string
}
export type UrlParseResult = {
  path: string,
  query: QueryObj
}
export type Route = UrlParseResult & {
  fullPath: string,
  trimedPath: string
}

type StateSetParams = {
  route: Route,
  stateKey: number
}
export type OnStackItemSet = (item: PageStackItem) => void;
export type OnRoutedEvent = {
  route: Route,
  behavior: string,
  distance: number,
  isPop: boolean
}
export type OnRouted = (e: OnRoutedEvent) => void;
export type HistoryNavOpt = {
  isHashMode?: boolean,
  base?: string,
  tabs?: TabBar,
  onRouted: OnRouted,
  onStackItemSet: OnStackItemSet,
  onStackItemDel: OnStackItemSet
}
type PageStackItem = {
  route: Route,
  page: Page
}


export type HistoryState = {
  key: number,
  modalKey: number
}

export type ModalCrumbs = Array<[number, number]>;
export type HistoryNavigationMethod = 'push' | 'replace' | '_replace';
export type WhenBackPopInfo = {
  route: Route,
  behavior: string
}

export type Behavior = {
  type: string,
  distance: number,
  isPop: boolean
}