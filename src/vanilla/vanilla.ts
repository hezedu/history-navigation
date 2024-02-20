import HistoryNav from '../lib/history';
import type { StackItem, HistoryNavigation } from '../lib/history-navigation';
import { _formatPages, noop } from './util';
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
  const onRouted = config.onRouted;
  const hNv = new HistoryNav({
    isHashMode: config.isHashMode,
    base: config.base,
    onStackItemSet(item: StackItem) {
      const pageContainer = genPageWrap(item.stateKey);
      const pageCmpt = getPageCmpt(pageMap, item.route.trimedPath);
      item.cmpt = pageCmpt(item, pageContainer, hNv);
      item.pageContainer = pageContainer;
      // pageContainer.append(page);
      container.append(pageContainer);
    },
    onRouted(arg){
      if(onRouted){
        const route = arg.route;
        const page = pageMap[route.trimedPath];
        onRouted(arg, page);
      }
    },
    tabs: ['/', '/list', '/me'],
    onStackItemDel(item: StackItem){
 
      item.cmpt.beforeDestory();
      item.pageContainer.remove();
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