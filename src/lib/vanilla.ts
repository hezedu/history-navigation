import HistoryNav from './history';
import { PageStackItem, HistoryNavigation } from '../../types/index';
import { _formatPages } from './util';
const pages = [
  {path: '/', component: {
    onCreate(opt: PageStackItem, hNv: HistoryNavigation){
      const div = document.createElement('div');
      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path;
      div.append(el);
      const btn = document.createElement('button');
      btn.textContent = 'push to list';
      btn.addEventListener('click', () => {
        hNv.push('/list');
      });
      div.append(btn);
      return div;
    },
    onBeforeDestory(){
      console.log('index onBeforeDestory');
    }
  }},
  {path: '/list', component: {
    onCreate(opt: PageStackItem){
      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path;
      return el;
    },
    onBeforeDestory(){
      console.log('list onBeforeDestory');
    }
  }},
]

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
const pageMap = _formatPages(pages);
function getPageCmpt(trimedPath: string){
  if(pageMap.hasOwnProperty(trimedPath)){
    return pageMap[trimedPath].component;
  }
  return defNotFoundPage;
}
export default function Main() {
  const container = genContainer();

  Object.assign(container.style, {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  });
  const hNv = new HistoryNav({
    isHashMode: true,
    onStackItemSet(opt: PageStackItem) {
      const pageContainer = genPageWrap(opt.stateKey);
      const pageCmpt = getPageCmpt(opt.route.trimedPath);
      const page = pageCmpt.onCreate(opt, hNv);
      pageContainer.append(page);
      container.append(pageContainer);
    },
    onRouted(){

    },
    onStackItemDel(opt: PageStackItem){
      const pageWrap = document.getElementById('_h_n_page_' + opt.stateKey);
      if(pageWrap){
        const pageCmpt = getPageCmpt(opt.route.trimedPath);
        pageCmpt.onBeforeDestory();
        pageWrap.remove();
      }
    }
  })
  hNv.load('/');


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

// function genHandle (){
//   const el = document.createElement('div');
//   Object.assign(el.style, {
//     height: 0,
//     width: 0,
//     border: 0,
//     margin: 0,
//     padding: 0,
//     boxShadow: 'none',
//     outline: 'none',
//     position: 'static'
//   });
//   return el;
// }

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