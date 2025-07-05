class DBD {
  constructor(config){
    this.init(config);
  }
  init(config){
    /* 
      isHash: Boolean,
      base: ,
      
      pageCommon: {
        backgroundColor: '',
        transition: ,
      },
      pages: [
        {
          path: string,
          component: Component,
          meta?: {},
          backgroundColor?: ,
          transition?:
        }
      ],
      tabbar: {
        list: [
          {
            path: '',
            name: ''
          }
        ],

        component?: {},
      },
      notFoundPageComponent?: ,
      disabledAllPageTransition: ,
    */
    return genPageContainer();
  }
}


export default DBD;
function genPageContainer(){
  const dom = document.createElement('div');
  Object.assign(dom.style, {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  });
  return dom;
}

function genPage(stateKey, bg){
  const dom = document.createElement('div');
  Object.assign(dom.style, {
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    overflow: 'auto',
    position: 'absolute',
    zIndex: stateKey,
    backgroundColor: bg
  });
  return dom;
}