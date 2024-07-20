type BeforeDestory = () => void;
type ComponentReturns = {
  beforeDestory?: BeforeDestory,
  activated?: () => void,
  deactivated?: () => void,
}
type Query = {
  [key: string]: string
}
type Route = {
  path: string,
  query?: Query
}

type Mode = 'hash' | 'path' | {type: 'path', base: string };

type ComponentReturn = void | BeforeDestory | ComponentReturns;
type PageComponent = (el: HTMLElement, route: Route) => ComponentReturn;
type PageCommon = {
  bg: string,
}

type Page = PageCommon & {
  path: string,
  component: PageComponent,
  meta?: {
    [key: string]: any
  }
}

type Config = {
  mode: Mode,
  pageCommon: PageCommon,
  pages: [page],
  notFoundPageComponent: PageComponent
} 
