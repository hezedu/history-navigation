import type {  Route, ModalCrumbs, StackItem, StackMap,  HistoryState, WhenBackPopInfo, HistoryNavOpt, OnRouted, OnStackItemSet, OnRoutedEvent } from './history-navigation.d';

import { STATE_START_KEY,  KEY_NAME, getCurrentStateKey, getCurrState, getCurrModaKey, getPreState, updatePreState, genStateKey } from './state-key';
import { formatTabs, getTotalSteps } from './util';
import URL, { fullUrlParse } from './url';
import type { UserUrl } from './url';

const h = window.history;

let isInit = false;

class HistoryNav {
  _isOmitForwardEvent = false;
  _whenBackPopInfo?: WhenBackPopInfo | null;

  stackMap: StackMap = {};
  tabMap?: Map<string, number>;
  urlUtils: URL;
  modalCrumbs: ModalCrumbs = [];
  onStackItemSet: OnStackItemSet;
  onStackItemDel: OnStackItemSet;
  onStackItemActivated: OnStackItemSet;
  onStackItemDeactivated: OnStackItemSet;


  onStackTabItemSet?: OnStackItemSet;
  onStackTabItemDel?: OnStackItemSet;
  onStackTabItemActivated?: OnStackItemSet;
  onStackTabItemDeactivated?: OnStackItemSet;
  onRouted: OnRouted;
  _handleWindowUnload: () => void;
  _handlePopstate: () => void;
  currStackItem?: StackItem;
  currTabStackItem?: StackItem;
  loaded = false;
  constructor(opts: HistoryNavOpt){
    if(isInit){
      throw new Error('Only one instance can be generated.');
    }
    isInit = true;
    if(opts.tabs){
      this.tabMap = formatTabs(opts.tabs);
      this.onStackTabItemSet = opts.onStackTabItemSet;
      this.onStackTabItemDel = opts.onStackTabItemDel;
      this.onStackTabItemActivated = opts.onStackTabItemActivated;
      this.onStackTabItemDeactivated = opts.onStackTabItemDeactivated;
    }
    this.urlUtils = new URL(opts.isHashMode, opts.base);
    this.onStackItemSet = opts.onStackItemSet;
    this.onStackItemDel = opts.onStackItemDel;
    this.onStackItemActivated = opts.onStackItemActivated;
    this.onStackItemDeactivated = opts.onStackItemDeactivated;

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
 
      if(distance !== 0){
        this._clearAfter();
      }
      // const currItem = this.stackMap[key];
      // if(currItem){
        
      // }
      if(behavior === 'switchTab'){
        if(key === STATE_START_KEY){
          const item = this.stackMap[key];
          if(item){
            let _tabSMap = <StackMap>item.tabStackMap;
            let _tabIndex = <number>item.tabIndex;
            if(_tabSMap.hasOwnProperty(_tabIndex)){
              let tab = _tabSMap[_tabIndex];
              if(tab){
                (this.onStackTabItemDeactivated as OnStackItemSet)(tab);
              }
            }
            // console.log('_tabSMap', _tabSMap,  _tabIndex);
          
          }
        }
      }
      
    }
    const routeE = {
      route,
      isPop: false,
      behavior,
      distance
    }
    this.setPageStackItem(key, routeE);
    this.onRouted(routeE);
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
    const preItem = <StackItem>this.stackMap[getCurrentStateKey()];
    this.onStackItemDeactivated(preItem);
    // this._setModalCrumbsWhenChange();
    h.pushState({[KEY_NAME]: key}, '', this.urlUtils.toLocationUrl(route.fullPath));
    updatePreState();
    const routeE = {
      route,
      behavior: 'push',
      distance: 1,
      isPop: false
    }
    this.setPageStackItem(key, routeE);
    this.onRouted(routeE);
  }
  relaunch(userUrl: UserUrl){
    const route = fullUrlParse(userUrl);
    this.backToStartAndReplace(route, 'relaunch');
  }
  switchTab(userUrl: UserUrl){
    const route = fullUrlParse(userUrl);
    if(!this.isTabRoute(route.trimedPath)){
      console.error(userUrl, ' is not tab url');
      return;
    }
    this.backToStartAndReplace(route, 'switchTab');
  }
  _clearAll(){
    if(this.tabMap){
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
    if(this.stackMap.hasOwnProperty(STATE_START_KEY)){
      const item = this.stackMap[STATE_START_KEY];
      const _map = item.tabStackMap;
      if(_map){
        for(let k in _map){
          if(_map.hasOwnProperty(k)){
            let item = _map[k];
            delete(_map[k]);
            (this.onStackTabItemDel as OnStackItemSet)(item);
          }
        }
        this._delPageStackItem(this.stackMap, STATE_START_KEY, this.stackMap[STATE_START_KEY]);
      }
    }
  }
  clearStack(){
    const _map = this.stackMap;
    let k;
    for(k in _map){
      if(_map.hasOwnProperty(k)){
        this._delPageStackItem(_map, k, _map[k]);
      }
    }
  }
  _delPageStackItem(hashMap: StackMap, stateKey: string | number, item: StackItem){
    delete(hashMap[stateKey]);
    this.onStackItemDel(item);
  }
  // delPageStackItem(hashMap: StackMap, stateKey: string | number){
  //   const item = hashMap[stateKey];
  //   if(item){
  //     this._delPageStackItem(hashMap, stateKey, item);
  //   }
  // }
  setPageStackItem(stateKey: number, routedEvent: OnRoutedEvent){
    const route = routedEvent.route;
    if(this.isTabRoute(route.trimedPath)){
      if(stateKey !== STATE_START_KEY){
        throw new Error('tabRoute is stateKey is not ' + STATE_START_KEY);
      }
      const tabIndex = <number>this.getTabIndex(route.trimedPath);
      let stackItem;
      if(this.stackMap.hasOwnProperty(stateKey)){

        stackItem = this.stackMap[stateKey];
        stackItem.route = route;
        stackItem.tabIndex = tabIndex;

        if(!stackItem.isTab){
          this._delPageStackItem(this.stackMap, stateKey, stackItem);
          stackItem = null;
        }
      }
      
      if(!stackItem) { 
        stackItem = this.stackMap[stateKey] = {
          route,
          stateKey,
          isTab: true,
          tabIndex,
          tabStackMap: {}
        }
        this.onStackItemSet(stackItem);
      }
      const map = <StackMap>stackItem.tabStackMap;
      if(map.hasOwnProperty(tabIndex)){ 
        // throw new Error('Already has stackItem');
        (this.onStackTabItemActivated as OnStackItemSet)(map[tabIndex]);
        // console.log('_delTabPageStackItem', tabIndex);
        // this._delPageStackItem(map, tabIndex, map[tabIndex]);
      } else {
        const tabStackItem = map[tabIndex] = {
          route,
          stateKey,
          isTab: true,
          tabIndex,
          stackItem
        };
        (this.onStackTabItemSet as OnStackItemSet)(tabStackItem);
      }
    } else {

      
      if(this.stackMap.hasOwnProperty(stateKey)){
        let item = this.stackMap[stateKey];
        if(item.isTab){
          this._clearAll();
        } else {
          this._delPageStackItem(this.stackMap, stateKey, item);
        }
      }

      const item = this.stackMap[stateKey] = {
        route,
        stateKey,
        isTab: false
      }

      this.onStackItemSet(item);
    }
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
      const item = <StackItem>this.stackMap[preKey];
      this.onStackItemDeactivated(item);
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
  
    const stackItem = this.stackMap[currKey];
    if(!stackItem && currState.modalKey){
      this.back(currState.modalKey);
      return;
    }
  
    // this._autoRemoveModal();
  
    updatePreState();
    
    if(preKey === currKey) {
      return;
    }

    const compare = currKey - preKey;
  
    // let backTra = this._whenPopTra;
    // if(!backTra && compare === -1){
    //   backTra = this._getBackTra();
    //   // console.log('--------------- backTra ---------------', backTra);
    // } 
    // this._setTra(backTra);
    // this._whenPopTra = null;
  
    const route = fullUrlParse(this.urlUtils.getUrlByLocation());
    const routeE = {
      route,
      behavior: 'back',
      distance: compare,
      isPop: true
    }
    if(stackItem){
      this.onStackItemActivated(stackItem);
    } else {
      this.setPageStackItem(currKey, routeE);
    }
    this._clearAfter();
    this.onRouted(routeE);

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