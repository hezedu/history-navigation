
import {RouteQuery, _UrlParsed, Route } from '../types/url';


type _QSTmpArr = Array<string>;

class URL {
  isHashMode: boolean;
  base: string;
  _location: Location;
  constructor({isHashMode = false, 
                base = '', 
                location = window.location,
                }){
    this.isHashMode = isHashMode;
    this._location = location;
    if(isHashMode){
      this.base = this._location.pathname + this._location.search + '#';
    } else {
      this.base = base;
    }
  }
  getHashUrlByLocation() : string {
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

  getRouteByLocation() : _UrlParsed{
    return urlParse(this.getUrlByLocation());
  }

  toLocationUrl(fullUrl: string) : string{
    return this.isHashMode ? (this.base + fullUrl) :  (this.base + fullUrl);
  }
}

function trimRoute(route: _UrlParsed): _UrlParsed {
  if(route.path.indexOf('?') === -1){
    return route;
  }
  let _route = urlParse(route.path);
  Object.assign(_route.query, route.query);
  return _route;
}

export function urlStringify(route: _UrlParsed): string{
  return _urlStringify(trimRoute(route));
}

function _urlStringify(route: _UrlParsed): string{
  let queryStr = queryStringify(route.query);
  if(queryStr) {
    queryStr = '?' + queryStr;
  }
  return route.path + queryStr;
}



function queryParse(qsString?: string): RouteQuery{
  const map = Object.create(null);
  if(!qsString || (typeof qsString === 'string' && qsString.length === 0)){
    return map;
  }
  const arr = qsString.split('&');
  let i = 0, len = arr.length, v: _QSTmpArr;
  for(; i < len; i++){
    v = arr[i].split('=');
    map[v[0]] = decodeURIComponent(v[1] === undefined ? '' : v[1]);
  }
  return map;
}

function queryStringify(obj: RouteQuery): string{
  if(!obj){
    return '';
  }
  let arr: string[] = [];
  Object.keys(obj).forEach(k => {
    arr.push(k + '=' + encodeURIComponent(obj[k]));
  });
  return arr.join('&');
}

export function urlParse(url: string): _UrlParsed{
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
export type UserUrl = string | _UrlParsed;


export function fullUrlParse(userUrl: UserUrl): Route {
  let route: _UrlParsed, fullUrl: string, uniquePath: string;
  if(typeof userUrl === 'string'){
    route = urlParse(userUrl);
    fullUrl = userUrl;
  } else {
    route = trimRoute(userUrl);
    fullUrl = _urlStringify(route);
  }
  uniquePath = trimSlash(route.path);

  return Object.assign({
    fullUrl,
    uniquePath
  }, route);
}

export function trimSlash(pathStr: string): string {
  let arr = pathStr.split('/');
  arr = arr.filter(v => v !== '');
  return arr.join('/');
}

export default URL;