type Component = {
  loaded: Function,
  beforeDestory: Function,
  activated: Function,
  deactivated: Function
}
type Page = {
  path: String,
  component: Component,
  title?: String,
  className?: String
}
type Config = {
  pageBg?: String,
  pageClassName?: String,
  pages: Array<Page>
}
const DEF_PAGE_BG = '#fff';

export default function Main() {
  const container = genContainer();

  Object.assign(container.style, {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  });
  let handle = genHandle();

  container.append(handle);
  
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

function genPageWrap (){
  const el = document.createElement('div');
  Object.assign(el.style, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    position: 'absolute'
  });
  return el;
}