interface  HistoryNavigation {
  push: (userUrl: UserUrl) => void;
  relaunch: (userUrl: UserUrl) => void;
  switchTab: (userUrl: UserUrl) => void;
}

export type Tabs = Array<string>;

type StackItem = {
  stateKey: number,
  route: Route,

  isTab: boolean,
  tabIndex?: number,
  tabStackMap?: StackMap,
  [key: string]: any
}
export type StackMap = {
  [key: string]: StackItem
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

export type OnStackItemSet = (item: StackItem) => void;

export type OnRoutedEvent = {
  route: Route,
  behavior: string,
  distance: number,
  isPop: boolean,
  [key: string]: any
}

export type OnRouted = (e: OnRoutedEvent) => void;

export type HistoryNavOpt = {
  isHashMode?: boolean,
  base?: string,
  tabs?: Tabs,
  onRouted: OnRouted,
  onStackItemSet: OnStackItemSet,
  onStackItemDel: OnStackItemSet,
  onStackItemActivated: OnStackItemSet,
  onStackItemDeactivated: OnStackItemSet,
  onStackTabItemSet?: OnStackItemSet,
  onStackTabItemDel?: OnStackItemSet,
  onStackTabItemActivated?: OnStackItemSet,
  onStackTabItemDeactivated?: OnStackItemSet,
}


export type HistoryState = {
  key: number,
  modalKey: number
}

export type ModalCrumbs = Array<[number, number]>;
// export type HistoryNavigationMethod = 'push' | 'replace' | '_replace';
export type WhenBackPopInfo = {
  route: Route,
  behavior: string
}
