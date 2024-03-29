import type {  Tabs, HistoryState, ModalCrumbs } from './history-navigation';
import { trimSlash } from './url';



export function formatTabs(tabs: Tabs){
  const len = tabs.length;
  if(len < 2){
    throw new Error(`tabBar list length must >= 2`);
  }
 
  let i = 0,  tk, item;
  
  const _map:Map<string, number> = new Map;
  // const list:TabBar = [];
  for(; i < len; i++){
    item = tabs[i];
    tk = trimSlash(item);

    if(_map.has(tk)){
      throw new Error(`tabBar pagePath: ${tk} is same as ${i}`);
    }
    // page.tabIndex = i;
    _map.set(tk, i);
    // list.push(tk);
  }
  return _map;
}




function _getModalSteps(arr: ModalCrumbs, startState: HistoryState, endState: HistoryState){
  let i = _findCrumbsIndex(arr, startState.key);
  const endIndex = _findCrumbsIndex(arr, endState.key);
  let count = 0;
  const startCrumb = arr[i];
  if(startCrumb && startCrumb[0] === startState.key){
    count = arr[i][1] - startState.modalKey;
  }
  count = count + endState.modalKey;
  i = i + 1;
  for(; i < endIndex; i++){
    count = count + arr[i][1];
  }
  return count;
}

function _findCrumbsIndex(arr: ModalCrumbs, stateKey: number){
  let i = 0;
  const len = arr.length;
  for(; i < len; i++){
    if(arr[i][0] >= stateKey){
      break;
    }
  }
  return i;
}

export function _getTotalSteps(arr: ModalCrumbs, startState: HistoryState, endState: HistoryState){
  const modals = _getModalSteps(arr, startState, endState);
  return modals + (endState.key - startState.key);
}

export function getTotalSteps(arr: ModalCrumbs, currState: HistoryState, distState: HistoryState) {
  const { key, modalKey } = currState;
  const distKey = distState.key;
  const distModalKey = distState.modalKey;
  let count = key - distKey;
  if(count === 0){
    return modalKey - distModalKey;
  }
  let start, end;
  const isBack = count > 0;
  if(isBack){
    start = distState;
    end = currState;
  } else {
    start = currState;
    end = distState;
  }
  let total = _getTotalSteps(arr, start, end);
  if(!isBack){
    total = -total;
  }
  return total;
}


