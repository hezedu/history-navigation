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
export type TabBar = Array<string>;