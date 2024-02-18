type OnCreateParams = {
  route: Route,
  meta: PageMeta,
  stateKey: number
}
type Component = {
  onCreate: (OnCreateParams) => HTMLElement,
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

// type PageStackItem = PageItem & {
//   stackId: number
// }
export type PageStackHashMap = {
  [key: number]: PageItem
}

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
export type OnStackItemSet = Function<StateSetParams>;
export type HistoryNavOpt = {
  isHashMode?: boolean,
  base?: string,
  tabs?: TabBar,
  routed?: OnStackItemSet,
  onStackItemSet: OnStackItemSet,
  onStackItemDestory?: OnStackItemSet
}
type PageStackItem = {
  route: Route,
  page: Page
}
export type HistoryNavStacksHashMap = {
  [key: number]: route
}

export type HistoryState = {
  key: number,
  modalKey: number
}

export type ModalCrumbs = Array<[number, number]>;

export type WhenBackPopInfo = {
  method: string,
  args: IArguments
}

export type Behavior = {
  type: string,
  distance: number,
  isPop: boolean
}