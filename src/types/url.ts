
export type RouteQuery = {
  [key: string]: string
}
export type _UrlParsed = {
  path: string,
  query: RouteQuery
}

export type Route = _UrlParsed & {
  fullUrl: string,
  uniquePath: string
}