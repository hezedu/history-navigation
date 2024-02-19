type Page = {
  path: string,
  component: Component,
  meta?: PageMeta,
  className?: string
}

type PageItem = Page & {
  trimedPath: string,
  isTab: boolean,
  // tabIndex?: number
}

export type PageHashMap = {
  [key: string]: PageItem
}

export type Pages = Array<Page>;


export type TabBarItem = {
  path: string,
  [key: string]: any
}
export type TabBarList = Array<TabBarItem>;

export type TabBar = {
  list: TabBarList
};

export type Config = {
  isHashMode?: boolean,
  base?: string,
  pageBg?: string,
  pageClassName?: string,
  pages: Pages,
  notFoundPage?: Component,
  tabBar?: TabBar,
}