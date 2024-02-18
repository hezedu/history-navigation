import type { Config, PageHashMap, Component, Route, ModalCrumbs,
  PageStackHashMap, HistoryNavStacksHashMap, HistoryState, WhenBackPopInfo, Behavior, HistoryNavOpt,
  OnStackItemSet } from '../../types/index';
import { _formatPages, _formatTabs, getTotalSteps } from './util';
import URL, { fullUrlParse } from './url';
import { getCurrentStateKey, getCurrState, getCurrModaKey, getPreState,  updatePreState } from './state-key';
import { KEY_NAME } from './constant';


let isInit = false;

const h = window.history;

class HistoryNav {
  _isOmitForwardEvent = false;
  _whenBackPopInfo?: WhenBackPopInfo;

  pageStackHashMap: PageStackHashMap = {};
  stacks: HistoryNavStacksHashMap = {};
  tabMap?: Map<string, number>;
  tabStacks: HistoryNavStacksHashMap = {};
  tabPageStackHashMap?: PageStackHashMap;
  urlUtils: URL;
  modalCrumbs: ModalCrumbs = [];
  behavior: Behavior = {
    type: '',
    distance: 0,
    isPop: false
  }
  onStackItemSet: OnStackItemSet;
  constructor(opts: HistoryNavOpt){
    if(isInit){
      throw new Error('Only one instance can be generated.');
    }
    isInit = true;
    if(opts.tabs){
      this.tabMap = _formatTabs(opts.tabs);
      this.tabPageStackHashMap = {};
    }
    this.urlUtils = new URL(opts.isHashMode, opts.base);
    this.onStackItemSet = opts.onStackItemSet;
    window.addEventListener('beforeunload', this.handleWindowUnload);
    window.addEventListener('popstate', this.handlePopstate);
  }
  load(userUrl?: string){
    const _userUrl = userUrl === undefined ? 
        this.urlUtils.getUrlByLocation() : 
        userUrl;
    const currRoute = fullUrlParse(_userUrl);
    // const key = getCurrentStateKey();
    // if(key !== 0){
    //   if(this.isTabRoute(currRoute.trimedPath)){
    //     this.backToStartAndReplace(currRoute, 'loaded');
    //     return;
    //   }
    // }
    this._replaceCurrPage(currRoute, 'loaded');
  }
  getTabIndex(trimedPath: string){
    if(!this.tabMap){
      return undefined;
    }
    return this.tabMap.get(trimedPath);
  }
  back(steps: number = 1){
    if(steps < 1){
      return;
    }
    if(steps){
      h.go(-steps);
    }
  }
  // _clearAll(){
  //   if(this.tabPageStackHashMap){
  //     this._clearMap(this.tabPageStackHashMap);
  //   }
  //   this._clearMap(this.pageStackHashMap);
  // }
  // _clearMap(){

  // }
  _backAndApply(steps: number, method: string, args: IArguments){
    if(steps < 1){
      return;
    }
    this._whenBackPopInfo = {
      method,
      args
    }
    this.back(steps);
  }


  _replace(route: Route, behavior: string){
    const preKey = getPreState().key;
    const key = getCurrentStateKey();
    const distance = key - preKey;
    this.behavior = {
      type: behavior || 'replace',
      distance,
      isPop: false
    }

    const toUrl = this.urlUtils.toLocationUrl(route.fullPath);
    let state =  h.state;
    if(!state || !state[KEY_NAME]){
      state = Object.assign({}, history.state);
      state[KEY_NAME] = key;
    }
    
    h.replaceState(state, '', toUrl);
    updatePreState();
    if(this.behavior.type === 'loaded'){
      this.setPageStackItem(key, route);
      return;
    }
    // if(this.behavior.type === 'relaunch'){
    //   const oldKey = key - distance;
    //   this._clearAll();
    // }
    // this.implementation.nextTick(() => {
    //   if(newBehavior.type === 'relaunch'){
    //     this._setAllCleaned();
    //     const oldKey = key - distance;
    //     this.stackMap[oldKey].isClean = false;
    //     this.implementation.nextTick(() => {
    //       this._clearAll();
    //       this._setMapItem(key, fullParse);
    //       this._onRouted();
    //     })
        
    //   } else {
    //     this._clearAfter();
    //     this._setMapItem(key, fullParse);
    //     this._onRouted();
    //   }
    // });
  }
  setPageStackItem(stateKey: number, route: Route){

    this.stacks[stateKey] = route;
    const tabIndex = this.getTabIndex(route.trimedPath);
    let isTab = false;
    if(tabIndex !== undefined){
      isTab = true;
      this.tabStacks[tabIndex] = route;
    }
    this.onStackItemSet({
      stateKey,
      isTab,
      tabIndex,
      route
    });
  }
  // _clearAfter(){
  //   const key = getCurrentStateKey();
  //   this.stacks
  // }
  _replaceCurrPage(route: Route, behavior: string){
    const modalCount = getCurrModaKey();
    if(modalCount){
      this._backAndApply(modalCount, '_replace', arguments);
      return;
    }
    this._replace(route, behavior);
  }
  // backToStartAndReplace(route: Route, behavior: string){
  //   const count = this.getbackToZeroCount();
  //   if(count > 0){
  //     this._backAndApply(count, '_replace', [route, behavior]);
  //   } else if(count === 0){
  //     this._replace(route, behavior);
  //   } else {
  //     console.error('_backToStartAndReplace not back', count);
  //   }
  // }
  getbackToZeroCount(){
    return this._getStepsTotal({key: 0, modalKey: 0});
  }
  _getStepsTotal(distState: HistoryState){
    return getTotalSteps(this.modalCrumbs, getCurrState(), distState);

  }
  handleWindowUnload(){

  }
  handlePopstate(){

  }
  destroy(){
    if(isInit){
      window.addEventListener('popstate', this.handlePopstate);
      window.removeEventListener('beforeunload', this.handleWindowUnload);
      isInit = false;
    }
  }
}


export default HistoryNav;