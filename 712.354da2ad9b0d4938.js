"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[712],{7712:(x,s,n)=>{n.r(s),n.d(s,{PreviewEditorModule:()=>l});var r=n(6814),a=n(3994),d=n(7507),e=n(9212);function p(t,c){if(1&t&&(e.TgZ(0,"div",5),e._UZ(1,"iframe",6),e.ALo(2,"safe"),e.qZA()),2&t){const i=e.oxw(2);e.xp6(1),e.Q6J("src",e.xi3(2,1,i.preview.data,"resource"),e.uOi)}}function v(t,c){if(1&t&&(e.TgZ(0,"div",5),e._UZ(1,"iframe",7),e.ALo(2,"safe"),e.qZA()),2&t){const i=e.oxw(2);e.xp6(1),e.Q6J("srcdoc",e.xi3(2,1,i.preview.data,"html"),e.oJD)}}function g(t,c){if(1&t&&(e.TgZ(0,"div",5),e._UZ(1,"nge-markdown",8),e.qZA()),2&t){const i=e.oxw(2);e.xp6(1),e.Q6J("data",i.preview.data)}}function h(t,c){1&t&&(e.TgZ(0,"div",5)(1,"div",9),e._uU(2,"NO PREVIEW"),e.qZA()())}function w(t,c){if(1&t&&(e.ynx(0)(1,2),e.YNc(2,p,3,4,"div",3)(3,v,3,4,"div",3)(4,g,2,1,"div",3)(5,h,3,0,"div",4),e.BQk()()),2&t){const i=e.oxw();e.xp6(1),e.Q6J("ngSwitch",i.preview.type),e.xp6(1),e.Q6J("ngSwitchCase","URL"),e.xp6(1),e.Q6J("ngSwitchCase","HTML"),e.xp6(1),e.Q6J("ngSwitchCase","MARKDOWN")}}function f(t,c){1&t&&(e.TgZ(0,"div",9),e._uU(1,"NO PREVIEW"),e.qZA())}let m=(()=>{class t{constructor(i){this.changeDetectorRef=i,this.subscriptions=[]}ngOnInit(){this.subscriptions.push(this.editor.onChangeRequest.subscribe(i=>{this.preview=i.options?.preview,this.changeDetectorRef.markForCheck(),this.changeDetectorRef.detectChanges()}))}ngOnDestroy(){this.subscriptions.forEach(i=>i.unsubscribe())}static#e=this.\u0275fac=function(o){return new(o||t)(e.Y36(e.sBO))};static#t=this.\u0275cmp=e.Xpm({type:t,selectors:[["ide-preview-editor"]],inputs:{editor:"editor"},decls:3,vars:2,consts:[[4,"ngIf","ngIfElse"],["noPreview",""],[3,"ngSwitch"],["class","preview-editor",4,"ngSwitchCase"],["class","preview-editor",4,"ngSwitchDefault"],[1,"preview-editor"],["frameborder","0",3,"src"],["frameborder","0",3,"srcdoc"],[3,"data"],[1,"center"]],template:function(o,u){if(1&o&&e.YNc(0,w,6,4,"ng-container",0)(1,f,2,0,"ng-template",null,1,e.W1O),2&o){const _=e.MAs(2);e.Q6J("ngIf",u.preview)("ngIfElse",_)}},dependencies:[r.O5,r.RF,r.n9,r.ED,a.NgeMarkdownComponent,d.yl],styles:[".preview-editor[_ngcontent-%COMP%]{height:100%;width:100%;overflow:auto;padding:8px;position:relative}iframe[_ngcontent-%COMP%]{width:100%;height:100%}.center[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}"],changeDetection:0})}return t})(),l=(()=>{class t{constructor(){this.component=m}static#e=this.\u0275fac=function(o){return new(o||t)};static#t=this.\u0275mod=e.oAB({type:t});static#i=this.\u0275inj=e.cJS({imports:[r.ez,d.ZZ,a.NgeMarkdownModule]})}return t})()}}]);