import './style.css';
import Main from './src/vanilla/vanilla.ts';
import type { StackItem, HistoryNavigation } from './src/lib/history-navigation';
import type { Config, TabBarList } from './src/vanilla/vanilla-type.d.ts';
const pages = [
  {path: '/', meta: {title: '首页'}, component: {
    onCreate(opt: StackItem, hNv: HistoryNavigation){
      const div = document.createElement('div');
      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path + 'now: ' + Date.now();
      div.append(el);
      const btn = document.createElement('button');
      btn.textContent = 'switchTab to list';
      btn.addEventListener('click', () => {
        hNv.switchTab('/list');
      });
      div.append(btn);
      return div;
    },
    onBeforeDestory(){
      console.log('index onBeforeDestory');
    }
  }},
  {path: '/list', meta: {title: '列表'}, component: {
    onCreate(opt: StackItem, hNv: HistoryNavigation){
      const div = document.createElement('div');
      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path + 'now: ' + Date.now();
      const btn = document.createElement('button');
      btn.textContent = 'relaunch to /';
      btn.addEventListener('click', () => {
        hNv.relaunch('/');
      });
      const btn2 = document.createElement('button');
      btn2.textContent = 'Go To Detail';
      btn.addEventListener('click', () => {
        hNv.push('/detail');
      });
      div.append(el);
      div.append(btn);
      div.append(btn2);
      return div;
    },
    onBeforeDestory(){
      console.log('list onBeforeDestory');
    }
  }},
  {path: '/detail', meta: {title: '详情'}, component: {
    onCreate(opt: StackItem, hNv: HistoryNavigation){
      const div = document.createElement('div');
      const el = document.createElement('h1');
      el.textContent = 'Detail ' + opt.route.path + 'now: ' + Date.now();
      const btn = document.createElement('button');
      btn.textContent = 'relaunch to /';
      btn.addEventListener('click', () => {
        hNv.relaunch('/');
      });
      div.append(el);
      div.append(btn);
      return div;
    },
    onBeforeDestory(){
      console.log('list onBeforeDestory');
    }
  }},
  {path: '/me', meta: {title: '我'}, component: {
    onCreate(opt: StackItem, hNv: HistoryNavigation){
      const div = document.createElement('div');
      const el = document.createElement('h1');
      el.textContent = 'Me ' + opt.route.path + 'now: ' + Date.now();
      const btn = document.createElement('button');
      btn.textContent = 'relaunch to /';
      btn.addEventListener('click', () => {
        hNv.relaunch('/');
      });
      div.append(el);
      div.append(btn);
      return div;
    },
    onBeforeDestory(){
      console.log('list onBeforeDestory');
    }
  }},
];

const Tabbar = (list, ) => {

}

const config: Config = {
  pages,
  // tabBar: {
  //   list: [],
  //   component: 

  // }
};

(document.querySelector('#app') as HTMLElement)
.replaceWith(Main(config));
