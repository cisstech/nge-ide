import{da as D}from"./chunk-THU2NYFJ.js";import{b as E,c as k}from"./chunk-SH63E2DY.js";import{$a as m,Aa as y,Ba as _,Hb as p,Ib as d,Jb as g,Kb as a,Lb as c,Qc as M,Rb as l,Rc as w,Sc as P,Wc as O,Zb as u,eb as o,fb as v,i as C,mc as h,oc as f,ra as x,ub as S,wb as r,xc as b}from"./chunk-PL3RMG6N.js";function z(e,t){if(e&1&&(a(0),g(1,"img",4),h(2,"safe"),c()),e&2){let s=l();o(),r("src",f(2,1,s.url,"url"),m)}}function I(e,t){if(e&1&&(a(0),p(1,"video",5),g(2,"source",4),h(3,"safe"),u(4," Sorry, your browser doesn't support embedded videos. "),d(),c()),e&2){let s=l();o(2),r("src",f(3,1,s.url,"url"),m)}}function R(e,t){if(e&1&&(a(0),p(1,"audio",5),g(2,"source",4),h(3,"safe"),u(4," Sorry, your browser doesn't support embedded audio. "),d(),c()),e&2){let s=l();o(2),r("src",f(3,1,s.url,"url"),m)}}function U(e,t){e&1&&(a(0),p(1,"h2"),u(2,"Unsupported media type"),d(),c())}var j=(()=>{let t=class t{constructor(n){this.changeDetectorRef=n,this.subscriptions=[]}ngOnInit(){this.subscriptions.push(this.editor.onChangeRequest.subscribe(n=>C(this,null,function*(){let{file:i}=n;switch(this.url=i==null?void 0:i.url,D.extname(n.uri.path)){case"svg":case"png":case"jpeg":case"jpg":case"gif":case"tiff":this.type="image";break;case"mov":case"mp4":case"mpeg":this.type="video";break;case"wav":case"mp3":this.type="audio";break}this.changeDetectorRef.markForCheck()})))}ngOnDestroy(){this.subscriptions.forEach(n=>n.unsubscribe())}};t.\u0275fac=function(i){return new(i||t)(v(b))},t.\u0275cmp=y({type:t,selectors:[["ide-media-editor"]],inputs:{editor:"editor"},decls:6,vars:4,consts:[[1,"media-editor"],[3,"ngSwitch"],[4,"ngSwitchCase"],[4,"ngSwitchDefault"],[3,"src"],["controls",""]],template:function(i,N){i&1&&(p(0,"div",0),a(1,1),S(2,z,3,4,"ng-container",2)(3,I,5,4,"ng-container",2)(4,R,5,4,"ng-container",2)(5,U,3,0,"ng-container",3),c(),d()),i&2&&(o(),r("ngSwitch",N.type),o(),r("ngSwitchCase","image"),o(),r("ngSwitchCase","video"),o(),r("ngSwitchCase","audio"))},dependencies:[M,w,P,E],styles:[".media-editor[_ngcontent-%COMP%]{height:100%;position:relative;background-position:0px 0px,10px 10px;background-size:20px 20px;background-image:linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%,#eee 100%),linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%,#eee 100%);display:flex;justify-content:center;align-items:center}.media-editor[_ngcontent-%COMP%]   video[_ngcontent-%COMP%], .media-editor[_ngcontent-%COMP%]   audio[_ngcontent-%COMP%]{width:100%;height:100%}.media-editor[_ngcontent-%COMP%]   div[_ngcontent-%COMP%], .media-editor[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .media-editor[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;max-width:90%;max-height:90%;height:auto;margin:auto;border-radius:16px;background-color:transparent}.media-editor[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{object-fit:cover}"],changeDetection:0});let e=t;return e})();var L=(()=>{let t=class t{constructor(){this.component=j}};t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=_({type:t}),t.\u0275inj=x({imports:[O,k]});let e=t;return e})();export{L as a};
