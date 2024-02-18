
import { KEY_NAME, MODAL_KEY_NAME } from './constant';
import type { HistoryState } from '../../types/index';
const h = window.history;

export function getCurrentStateKey () {
  const state = h.state;
  if (state && typeof state[KEY_NAME] === 'number') {
    return state[KEY_NAME];
  }
  return 1;
}

export function getCurrModaKey(){
  const state = h.state;
  if(state && typeof state[MODAL_KEY_NAME] === 'number'){
    return state[MODAL_KEY_NAME];
  }
  return 0;
}

export function genStateKey () {
  return getCurrentStateKey() + 1;
}

export function getCurrState() {
  return {
    key: getCurrentStateKey(),
    modalKey: getCurrModaKey()
  };
}

let _preState: HistoryState = getCurrState();

export function getPreState() {
  return Object.assign({}, _preState);
}

function _setPreState(state: HistoryState) {
  _preState = Object.assign({}, state);
}

export function updatePreState() {
  _setPreState(getCurrState());
}

// let _preKey = getCurrentStateKey();
// export function get2PreStateKey () {
//   return _preKey;
// }

// export function set2PreStateKey (key) {
//   _preKey = key;
// }

