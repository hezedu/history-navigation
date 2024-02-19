
import type { Pages, PageHashMap, TabBar} from './vanilla-type';
import { trimSlash } from '../lib/url';
export function _formatPages(pages: Pages): PageHashMap{
  let map: PageHashMap = {};
  let i = 0, len = pages.length, page, tk;
  for(; i < len; i++){
    page = pages[i];
    tk = trimSlash(page.path);
    if(map.hasOwnProperty(tk)){
      throw new Error(`pageMap key: ${tk} is same as ${page.path}`);
    }
    map[tk] = Object.assign({
      trimedPath: tk,
      isTab: false,
      cmptKey: i
    }, page);
  }
  return map;
}

export function _formatTabBar(tabBar: TabBar, pageMap: PageHashMap){

  const len = tabBar.length;
  if(len < 2){
    throw new Error(`tabBar list length must >= 2`);
  }
  let i = 0,  tk, item;
  
  const _set:Set<string> = new Set;
  // const list:TabBar = [];
  for(; i < len; i++){
    item = tabBar[i];
    tk = trimSlash(item);
    let page;
    if(pageMap.hasOwnProperty(tk)){
      page = pageMap[tk];
    }
    if(!page || page.path !== item){
      throw new Error(`tabBar pagePath: ${i} is not found in pages`);
    }
    if(_set.has(tk)){
      throw new Error(`tabBar pagePath: ${tk} is same as ${i}`);
    }
    page.isTab = true;
    // page.tabIndex = i;
    _set.add(tk);
    // list.push(tk);
  }
  return _set;
}