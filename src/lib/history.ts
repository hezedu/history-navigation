import type { Config, PageHashMap, Component,  HistoryNavigationMethod, Route, ModalCrumbs,PageStackItem,
  StackMap,  HistoryState, WhenBackPopInfo, Behavior, HistoryNavOpt, OnRouted, 
  OnStackItemSet } from '../../types/index';
import { _formatPages, _formatTabs, getTotalSteps } from './util';
import URL, { fullUrlParse } from './url';
import type { UserUrl } from './url';
import {STATE_START_KEY, 
        KEY_NAME,
        getCurrentStateKey, 
        getCurrState, 
        getCurrModaKey, 
        getPreState,  
        updatePreState, 
        genStateKey
      } from './state-key';


let isInit = false;

const h = window.history;

class HistoryNav {
  _isOmitForwardEvent = false;
  _whenBackPopInfo?: WhenBackPopInfo | null;

  stackMap: StackMap = {};
  tabMap?: Map<string, number>;
  tabStackMap?: StackMap;
  urlUtils: URL;
  modalCrumbs: ModalCrumbs = [];
  behavior: Behavior = {
    type: '',
    distance: 0,
    isPop: false
  }
  onStackItemSet: OnStackItemSet;
  onStackItemDel: OnStackItemSet;
  onRouted: OnRouted;
  _handleWindowUnload: () => void;
  _handlePopstate: () => void;
  loaded = false;
  constructor(opts: HistoryNavOpt){
    if(isInit){
      throw new Error('Only one instance can be generated.');
    }
    isInit = true;
    if(opts.tabs){
      this.tabMap = _formatTabs(opts.tabs);
      this.tabStackMap = {};
    }
    this.urlUtils = new URL(opts.isHashMode, opts.base);
    this.onStackItemSet = opts.onStackItemSet;
    this.onStackItemDel = opts.onStackItemDel;
    this.onRouted = opts.onRouted;
    this._handleWindowUnload = () => {
      this.handleWindowUnload();
    }
    this._handlePopstate = () => {
      this.handlePopstate();
    }
    window.addEventListener('beforeunload', this._handleWindowUnload);
    window.addEventListener('popstate', this._handlePopstate);
  }
  load(userUrl?: string){
    if(this.loaded){
      throw new Error('Already loaded');
    }
    
    const _userUrl = userUrl === undefined ? 
        this.urlUtils.getUrlByLocation() : 
        userUrl;
    const currRoute = fullUrlParse(_userUrl);
    const key = getCurrentStateKey();
    if(key !== 0){
      if(this.isTabRoute(currRoute.trimedPath)){
        this.backToStartAndReplace(currRoute, 'loaded');
        return;
      }
    }
    this._replaceCurrPage(currRoute, 'loaded');
    this.loaded = true;
  }
  isTabRoute(trimedPath: string){
    if(!this.tabMap){
      return undefined;
    }
    return this.tabMap.has(trimedPath);
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

  _backAndReplace(steps: number, route: Route, behavior: string){
    if(steps < 1){
      return;
    }
    this._whenBackPopInfo = {
      route,
      behavior
    }
    this.back(steps);
  }

  backToStartAndReplace(route: Route, behavior: string){
    const count = this.getbackToZeroCount();
    if(count > 0){
      this._backAndReplace(count, route, behavior);
    } else if(count === 0){
      this._replace(route, behavior);
    } else {
      console.error('_backToStartAndReplace not back', count);
    }
  }

  replace(userUrl: UserUrl){
    const route = fullUrlParse(userUrl);
    if(this.isTabRoute(route.trimedPath)){
      throw new Error('Cannot replace the tab url, please use switchTab');
    }
    this._replaceCurrPage(route, 'replace');
  }

  _replaceCurrPage(route: Route, behavior: string){
    const modalCount = getCurrModaKey();
    if(modalCount){
      this._backAndReplace(modalCount, route, behavior);
      return;
    }
    this._replace(route, behavior);
  }
  _replace(route: Route, behavior: string = 'replace'){
    const preKey = getPreState().key;
    const key = getCurrentStateKey();
    const distance = key - preKey;
    const toUrl = this.urlUtils.toLocationUrl(route.fullPath);
    let state =  h.state;
    if(!state || !state[KEY_NAME]){
      state = Object.assign({}, history.state);
      state[KEY_NAME] = key;
    }
    
    h.replaceState(state, '', toUrl);
    updatePreState();
   if(behavior === 'relaunch'){
      this._clearAll();
    } else {
      this._clearAfter();
    }
    this.setPageStackItem(key, route);
    this.onRouted({
      route,
      isPop: false,
      behavior,
      distance
    });
  }

  push(userUrl: UserUrl){
    const route = fullUrlParse(userUrl);
    if(this.isTabRoute(route.trimedPath)){
      throw new Error('Cannot push the tab url, please use switchTab');
    }
    this._push(route);
  }
  _push(route: Route){
    const key = genStateKey();
    // this._setModalCrumbsWhenChange();
    h.pushState({[KEY_NAME]: key}, '', this.urlUtils.toLocationUrl(route.fullPath));
    updatePreState();
    this.setPageStackItem(key, route);
    this.onRouted({
      route,
      behavior: 'push',
      distance: 1,
      isPop: false
    });
  }

  _clearAll(){
    if(this.tabStackMap){
      this.clearTabStack();
    }
    this.clearStack();
  }
  _clearAfter(){
    const key = getCurrentStateKey();
    const map = this.stackMap;
    let i, v;
    for (i in map) {
      if(map.hasOwnProperty(i)){
        v = map[i];
        if (v.stateKey > key) {
          this._delPageStackItem(map, i, v);
        }
      }
    }
  }
  clearTabStack(){
    this._clearMap(this.tabStackMap as StackMap);
    if(this.stackMap.hasOwnProperty(STATE_START_KEY)){
      this._delPageStackItem(this.stackMap, STATE_START_KEY, this.stackMap[STATE_START_KEY]);
    }
  }
  clearStack(){
    this._clearMap(this.stackMap);
  }
  _clearMap(_map: StackMap){
    let k;
    for(k in _map){
      if(_map.hasOwnProperty(k)){
        this._delPageStackItem(_map, k, _map[k]);
      }
    }
  }
  _delPageStackItem(hashMap: StackMap, stateKey: string | number, item: PageStackItem){
    delete(hashMap[stateKey]);
    this.onStackItemDel(item);
  }
  delPageStackItem(hashMap: StackMap, stateKey: string | number){
    const item = hashMap[stateKey];
    if(item){
      this._delPageStackItem(hashMap, stateKey, item);
    }
  }
  setPageStackItem(stateKey: number, route: Route){
    let item: PageStackItem = {
      route,
      stateKey,
      isTab: false
    }
    if(stateKey === STATE_START_KEY){
      const tabIndex = this.getTabIndex(route.trimedPath);
      if(tabIndex !== undefined){
        item.isTab = true;
        item.tabIndex = tabIndex;
        if(!(this.tabStackMap as StackMap).hasOwnProperty(tabIndex)){
          (this.tabStackMap as StackMap)[tabIndex] = item;
        }
      }
    }
    this.stackMap[stateKey] = item;
    this.onStackItemSet(item);
  }
  // _clearAfter(){
  //   const key = getCurrentStateKey();
  //   this.stackMap
  // }

  // backToStartAndReplace(route: Route, behavior: string){
  //   const count = this.getbackToZeroCount();
  //   if(count > 0){
  //     this._backAndReplace(count, '_replace', [route, behavior]);
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
    if(this._isOmitForwardEvent){
      this._isOmitForwardEvent = false;
      return;
    }
    console.log('[handlePop]');
    let _backInfo = this._whenBackPopInfo;
    if(_backInfo){
      this._replace(_backInfo.route, _backInfo.behavior);
      this._whenBackPopInfo = null;
      return;
    }
  
    const preState = getPreState();
    const preKey = preState.key;
  
    if(!h.state){ // The user manually modifies the browser address bar
      let _popPushKey = preKey + 1;
      h.replaceState({[KEY_NAME]: _popPushKey}, '');
      updatePreState();
      this._replace(fullUrlParse(this.urlUtils.getUrlByLocation()), '_popPush');
      // this._setModalCrumbsWhenChange();
      return;
    }
  
    const total = this._getStepsTotal(preState);
    
    if(total > 0){ 
      console.log('forward', total);
      console.error('Forward is disabled by history-navigation-vue');
      this._isOmitForwardEvent = true;
      this.back(total);
      return;
    }
  
    const currState = getCurrState();
    const currKey = currState.key;
  
    const page = this.stackMap[currKey];
    if(!page && currState.modalKey){
      this.back(currState.modalKey);
      return;
    }
  
    // this._autoRemoveModal();
  
    updatePreState();
    
    if(preKey === currKey) {
      return;
    }
  
    // if(preKey === currKey){
    //   const modalKey = getCurrModaKey();
    //   const preModalKey = this.getLastModalKeyByCrumbs(preKey);
    //   if(modalKey > preModalKey){
    //     this._isOmitForwardEvent = true;
    //     this.back(modalKey - preModalKey);
    //     return;
    //   }
    //   this.removeModal();
    //   // this._set2ModalCrumbsWhenChange();
    //   return;
    // }
  
    const compare = currKey - preKey;
  
    // let backTra = this._whenPopTra;
    // if(!backTra && compare === -1){
    //   backTra = this._getBackTra();
    //   // console.log('--------------- backTra ---------------', backTra);
    // } 
    // this._setTra(backTra);
    // this._whenPopTra = null;
  
    const route = fullUrlParse(this.urlUtils.getUrlByLocation());
    if(!page){
      this.setPageStackItem(currKey, route);
    }
    this._clearAfter();
    this.onRouted({
      route,
      behavior: 'back',
      distance: compare,
      isPop: true
    });

  }
  destroy(){
    if(isInit){
      window.addEventListener('popstate', this._handlePopstate);
      window.removeEventListener('beforeunload', this._handleWindowUnload);
      this._clearAll();
      isInit = false;
    }
  }
}


export default HistoryNav;