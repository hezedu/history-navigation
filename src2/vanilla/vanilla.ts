import HistoryNav from '../lib/history';
import type { StackItem, HistoryNavigation } from '../lib/history-navigation';
import { _formatPages, formatTabBarList } from './util';
import type { PageHashMap, Config, PageItem, Component, TabBar, ComponentResult, TabBarList, TabBarComponent, TabBarComponentResult } from './vanilla-type';

const defNotFoundPage: PageItem = {
  path: '',
  trimedPath: '',
  isTab: false,
  meta: {
    title: '404'
  },
  component: (pageEl) => {
      const el = document.createElement('h1');
      el.textContent = '404 NotFound';
      pageEl.append(el);
    }
}

const defTabBarCmpt = (list: TabBarList, hNv: HistoryNavigation) => {

  const div = document.createElement('div');
  Object.assign(div.style, {
    height: '50px',
    position: 'absolute',
    width: '100%',
    left: 0,
    bottom: 0,
    background: '#ccc',
    display: 'flex',
    justifyContent: 'space-between'
  })
  list.forEach(item => {
    const btn = document.createElement('button');
    btn.textContent = item.title;
    btn.addEventListener('click', () => {
      hNv.switchTab(item.path);
    });
    div.append(btn);
  });
  let preItem: HTMLElement;
  return {
    dom: div,
    onSwitch(tabIndex: number){
      console.log('onSwitch', tabIndex)
      if(preItem){
        preItem.style.backgroundColor = '';
        preItem.style.color = '';
      }
      preItem = (div.children[tabIndex] as HTMLElement);
      preItem.style.backgroundColor = 'blue';
      preItem.style.color = '#fff';
    }
  };
}

function getPage(pageMap: PageHashMap, trimedPath: string): PageItem {
  if(pageMap.hasOwnProperty(trimedPath)){
    return pageMap[trimedPath];
  }
  return defNotFoundPage;
}
export default function Main(config: Config) {
  const container = genContainer();
  const pageMap = _formatPages(config);
  
  const tabBar = config.tabBar;
  let tabs; 
  let tabCmptResult: TabBarComponentResult;
  if(tabBar){
    tabs = tabBar.list.map(v => {
      return v.path;
    });
    formatTabBarList(tabBar.list, pageMap);
  }
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
    tabs,
    onStackItemSet(item: StackItem) {
      // if(item.isTab){
      //   if(!item.pageContainer){
      //     item.pageContainer = genPageWrap(item);
      //     item.pageContainer.append(tabCmptResult.dom);
      //     container.append(item.pageContainer);
      //   }
      //   const pageConfig = getPage(pageMap, item.route.trimedPath);
      //   item.tabPageEl = genTabPageContainer();
      //   item.cmpt = pageConfig.component(item.tabPageEl, hNv, item);
      //   item.pageContainer.append(item.tabPageEl);
        
      // } else {

      // }



      // pageContainer.append(page);
      
      const pageContainer = genPageWrap(item);
      const pageConfig = getPage(pageMap, item.route.trimedPath);
      item.pageConfig = pageConfig;
      item.pageContainer = pageContainer;
      if(item.isTab){
        pageContainer.append(tabCmptResult.dom);
      } else {
        item.cmpt = pageConfig.component(pageContainer, hNv, item);
      }
      if(pageConfig.transition){

      }
      container.append(pageContainer);
    },
    onStackItemDel(item: StackItem){
      cmptBeforeDestory(item.cmpt);
      item.pageContainer.remove();
    },
    onStackItemActivated(item: StackItem){
      item.pageContainer.hidden = false;
      console.log('onStackItemActivated');
    },
    onStackItemDeactivated(item: StackItem){
      item.pageContainer.hidden = true;
      console.log('onStackItemDeactivated');
    },

    onStackTabItemSet(item: StackItem){
      const stackItem = item.stackItem as StackItem;
      const pageContainer = genTabPageContainer(item);
      const pageConfig = getPage(pageMap, item.route.trimedPath);
      item.pageConfig = pageConfig;
      item.pageContainer = pageContainer;
      item.cmpt = pageConfig.component(pageContainer, hNv, item);
      stackItem.pageContainer.append(item.pageContainer);
    },
    onStackTabItemDel(item: StackItem){
      cmptBeforeDestory(item.cmpt);
      item.pageContainer.remove();
    },
    onStackTabItemActivated(item: StackItem){
      item.pageContainer.hidden = false;
      console.log('onStackTabItemActivated');
    },
    onStackTabItemDeactivated(item: StackItem){
      item.pageContainer.hidden = true;
      console.log('onStackTabItemDeactivated');
    },

    onRouted(arg){
      if(onRouted){
        const route = arg.route;
        const pageConfig = pageMap[route.trimedPath];
        console.log('onRouted', pageConfig)
        if(pageConfig.isTab){
          tabCmptResult.onSwitch(pageConfig.tabIndex as number);
        }
        onRouted(arg, pageConfig);
      }
    },
  })


  if(tabBar){
    let tabBarCmpt = tabBar.component || defTabBarCmpt;
    tabCmptResult = tabBarCmpt(tabBar.list, hNv);
  }
  hNv.load();
  return container;
}

function cmptBeforeDestory(cmptResult: ComponentResult){
  if(cmptResult){
    if(typeof cmptResult === 'function'){
      cmptResult();
    } else {
      const d = cmptResult.beforeDestory;
      if(d){
        d();
      }
    }
  }
}

function genTabPageContainer (item: StackItem){
  const el = document.createElement('div');
  Object.assign(el.style, {
    top: 0,
    left: 0,
    right: 0,
    bottom: '50px',
    overflow: 'hidden',
    position: 'absolute',
    background: '#eee',
    zIndex: item.tabIndex
  });
  el.dataset.myname = 'tabpage';
  return el;
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

function genPageWrap (item: StackItem){
  const stateKey = item.stateKey;
  const el = document.createElement('div');
  // el.id = '_h_n_page_' + stateKey;
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
  
  el.dataset.myname = 'page';
  return el;
}