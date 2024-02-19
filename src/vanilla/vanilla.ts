import HistoryNav from '../lib/history';
import type { StackItem, HistoryNavigation } from '../lib/history-navigation';
import { _formatPages } from './util';
import type { PageHashMap, Config } from './vanilla-type';

const defNotFoundPage = {
  onCreate: () => {
    const el = document.createElement('h1');
    el.textContent = '404 NotFound';
    return el;
  },
  onBeforeDestory:  () => {},
  activated:  () => {},
  deactivated:  () => {},
}

function getPageCmpt(pageMap: PageHashMap, trimedPath: string){
  if(pageMap.hasOwnProperty(trimedPath)){
    return pageMap[trimedPath].component;
  }
  return defNotFoundPage;
}
export default function Main(config: Config) {
  const container = genContainer();
  const pageMap = _formatPages(config.pages);
  Object.assign(container.style, {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  });
  const hNv = new HistoryNav({
    isHashMode: config.isHashMode,
    base: config.base,
    onStackItemSet(opt: StackItem) {
      const pageContainer = genPageWrap(opt.stateKey);
      const pageCmpt = getPageCmpt(pageMap, opt.route.trimedPath);
      const page = pageCmpt.onCreate(opt, hNv);
      pageContainer.append(page);
      container.append(pageContainer);
    },
    onRouted({route}){
      document.title = route.path;
    },
    tabs: ['/', '/list', '/me'],
    onStackItemDel(opt: StackItem){
      const pageWrap = document.getElementById('_h_n_page_' + opt.stateKey);
      if(pageWrap){
        const pageCmpt = getPageCmpt(pageMap, opt.route.trimedPath);
        pageCmpt.onBeforeDestory();
        pageWrap.remove();
      }
    }
  })
  hNv.load();
  return container;
}


function genContainer (){
  const el = document.createElement('div');
  Object.assign(el.style, {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  });
  return el;
}


function genPageWrap (stateKey: number){
  const el = document.createElement('div');
  el.id = '_h_n_page_' + stateKey;
  Object.assign(el.style, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: stateKey,
    background: '#fff'
  });
  return el;
}