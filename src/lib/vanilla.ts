import HistoryNav from './history';
import { OnStackItemSet } from '../../types/index';
import { _formatPages } from './util';
const pages = [
  {path: '/', component: {
    onCreate(opt: OnStackItemSet){
      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path;
      return el;
    }
  }}
]
const defNotFoundPage = {
  onCreate: () => {
    const el = document.createElement('h1');
    el.textContent = '404 NotFound';
    return el;
  },
  onDestory:  () => {},
  activated:  () => {},
  deactivated:  () => {},
}
const pageMap = _formatPages(pages);
console.log('pageMap', pageMap);
function getPageCmpt(trimedPath: string){
  console.log('trimedPath', trimedPath, pageMap)
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
    onStackItemSet: (opt: OnStackItemSet) => {
      const pageContainer = genPageWrap(opt.stateKey);
      const pageCmpt = getPageCmpt(opt.route.trimedPath);
      const page = pageCmpt.onCreate(opt);
      pageContainer.append(page);
      container.append(pageContainer);
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

function genHandle (){
  const el = document.createElement('div');
  Object.assign(el.style, {
    height: 0,
    width: 0,
    border: 0,
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    outline: 'none',
    position: 'static'
  });
  return el;
}

function genPageWrap (zIndex: number){
  const el = document.createElement('div');
  Object.assign(el.style, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex
  });
  return el;
}