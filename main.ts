
import Main from './src/vanilla/vanilla.ts';
import type { StackItem, HistoryNavigation } from './src/lib/history-navigation';
import type { Config, TabBarList } from './src/vanilla/vanilla-type.d.ts';
const pages = [
  {
    path: '/', meta: {title: '首页'}, 
    component: (pageEl: HTMLElement, hNv: HistoryNavigation, opt: StackItem) => {

      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path + 'now: ' + Date.now();
      pageEl.append(el);
      const btn = document.createElement('button');
      btn.textContent = 'switchTab to list';
      btn.addEventListener('click', () => {
        hNv.switchTab('/list');
      });
      pageEl.append(btn);
      return {
        beforeDestory() {
          console.log('index onBeforeDestory');
        }
      }
    }
  },
  {path: '/list', meta: {title: '列表'}, component(pageEl: HTMLElement, hNv: HistoryNavigation, opt: StackItem){

      const el = document.createElement('h1');
      el.textContent = 'hello ' + opt.route.path + 'now: ' + Date.now();
      const btn = document.createElement('button');
      btn.textContent = 'relaunch to /';
      btn.addEventListener('click', () => {
        hNv.relaunch('/');
      });
      const btn2 = document.createElement('button');
      btn2.textContent = 'Go To Detail';
      btn2.addEventListener('click', () => {
        hNv.push('/detail');
      });
      pageEl.append(el);
      pageEl.append(btn);
      pageEl.append(btn2);
      return {
        beforeDestory(){
          console.log('list onBeforeDestory');
        }
      }
    }
  },
  {path: '/detail', meta: {title: '详情'}, component(pageEl: HTMLElement, hNv: HistoryNavigation, opt: StackItem){
      const el = document.createElement('h1');
      el.textContent = 'Detail ' + opt.route.path + 'now: ' + Date.now();
      const btn = document.createElement('button');
      btn.textContent = 'relaunch to /';
      btn.addEventListener('click', () => {
        hNv.relaunch('/');
      });
      const btn2 = document.createElement('button');
      btn2.textContent = 'Go To Detail';
      btn2.addEventListener('click', () => {
        hNv.push('/detail');
      });
      pageEl.append(el);
      pageEl.append(btn);
      pageEl.append(btn2);
      return {
        beforeDestory(){
          console.log('list onBeforeDestory');
        }
      }
    }
  },
  {path: '/me', meta: {title: '我'}, component(pageEl: HTMLElement, hNv: HistoryNavigation, opt: StackItem){

      const el = document.createElement('h1');
      el.textContent = 'Me ' + opt.route.path + 'now: ' + Date.now();
      const btn = document.createElement('button');
      btn.textContent = 'relaunch to /';
      btn.addEventListener('click', () => {
        hNv.relaunch('/');
      });
      pageEl.append(el);
      pageEl.append(btn);
      return {
        beforeDestory(){
          console.log('list onBeforeDestory');
        }
      }
    }
  }
];

// const Tabbar = (list, ) => {

// }

const config: Config = {
  pages,
  tabBar: {
    list: [
      {path: '/', title: '首页'},
      {path: '/list', title: '列表'},
      {path: '/me', title: '我'}
    ]
  },
  onRouted(_route, page){
    document.title = page.meta.title;
  },
  pageTransition: {
    type: 'transition',
    // deactivated(){
    //   return {
    //     left: '100%',
    //   }
    // },
    // activated(){
    //   return {
    //     alignContent: 'center'
    //   }
    // },
    beforeEnter(){
      return {
        left: '100%',
      }
    },
    enter(){
      return {
        left: '0px'
      }
    },
    leave(){
      return {
        left: '-100%'
      }
    }
    // beforeDeactivate(){
    //   return {
    //     left: '-100%'
    //   }
    // },

  }
  // notFoundPage: {
  //   meta: {title: '404'},
  //   compo
  // },
  // tabBar: {
  //   list: [],
  //   component: 

  // }
};

(document.querySelector('#app') as HTMLElement)
.append(Main(config));
