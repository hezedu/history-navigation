
import {QueryObj, UrlParseResult, Route } from '../../types/index';

class URL {
  isHashMode: Boolean;
  base: string;
  _location= window.location;
  constructor(isHashMode: Boolean = false, base = ''){
    this.isHashMode = isHashMode;
    if(isHashMode){
      this.base = this._location.pathname + this._location.search + '#';
    } else {
      this.base = base;
    }
  }
  getHashUrlByLocation() : string{
    let url = this._location.hash;
    if(url.length > 0){
      url = url.substring(1);
    }
    return url;
  }
  getUrlByLocation() : string{
    if(this.isHashMode){
      return this.getHashUrlByLocation();
    }
    let pathname = this._location.pathname;
    let i = pathname.indexOf(this.base);
    if(i === 0){
      pathname = pathname.substring(this.base.length);
    }
    return pathname + this._location.search;
  }
  getRouteByLocation(){
    return urlParse(this.getUrlByLocation());
  }
  toLocationUrl(fullPath: string) : string{
    return this.isHashMode ? (this.base + fullPath) :  (this.base + fullPath);
  }
}

function trimRoute(route: UrlParseResult): UrlParseResult{
  if(route.path.indexOf('?') === -1){
    return route;
  }
  let _route = urlParse(route.path);
  Object.assign(_route.query, route.query);
  return _route;
}

export function urlStringify(route: UrlParseResult): string{
  return _urlStringify(trimRoute(route));
}

function _urlStringify(route: UrlParseResult): string{
  let queryStr = queryStringify(route.query);
  if(queryStr) {
    queryStr = '?' + queryStr;
  }
  return route.path + queryStr;
}



function queryParse(qsString?: string): QueryObj{
  const map = Object.create(null);
  if(!qsString || (typeof qsString === 'string' && qsString.length === 0)){
    return map;
  }
  const arr = qsString.split('&');
  let i = 0, len = arr.length, v;
  for(; i < len; i++){
    v = arr[i];
    v = v.split('=');
    map[v[0]] = decodeURIComponent(v[1]);
  }
  return map;
}

function queryStringify(obj: QueryObj): string{
  if(!obj){
    return '';
  }
  let arr: string[] = [];
  Object.keys(obj).forEach(k => {
    arr.push(k + '=' + encodeURIComponent(obj[k]));
  });
  return arr.join('&');
}


export function urlParse(url: string): UrlParseResult{
  let i = url.indexOf('?');
  let path, qsString;
  if(i !== -1){
    path = url.substring(0, i);
    qsString = url.substring(i + 1);
  } else {
    path = url;
    qsString = '';
  }
  return {
    path,
    query: queryParse(qsString)
  }
}
export type UserUrl = string | UrlParseResult;

/* path, fullPath, trimedPath, query */
export function fullUrlParse(userUrl: UserUrl): Route{
  let route, fullPath, trimedPath;
  if(typeof userUrl === 'string'){
    route = urlParse(userUrl);
    fullPath = userUrl;
  } else {
    route = trimRoute(userUrl);
    fullPath = _urlStringify(route);
  }
  trimedPath = trimSlash(route.path);
  return Object.assign({
    fullPath,
    trimedPath
  }, route);
}

export function trimSlash(pathStr: string){
  let arr = pathStr.split('/');
  arr = arr.filter(v => v !== '');
  return arr.join('/');
}


export default URL;