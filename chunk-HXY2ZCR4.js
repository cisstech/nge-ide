import{d as Ke,f as ze,h as Ue,k as $e}from"./chunk-XO3YPVKL.js";import{c as se,d as Pe,e as Be,k as He,ta as Le,ua as je,xa as Ve}from"./chunk-THU2NYFJ.js";import{l as ie,n as ne,t as Re,u as Fe}from"./chunk-PRTI5VBN.js";import{Aa as Q,Ba as P,Bb as L,Ca as B,E as ue,Hb as g,Hc as we,Ib as _,Ja as ge,Ka as E,Kb as N,La as C,Lb as A,Mb as j,Nb as Z,Nc as Me,O as pe,Oc as Te,Pb as I,Pc as Ne,Rb as u,Ua as M,Ub as ve,Uc as Ae,Vc as Se,Wb as X,Wc as Oe,X as fe,Xb as J,Yb as V,Zb as K,_b as be,a as y,cc as xe,db as T,dc as ye,eb as c,ec as De,fb as k,hb as _e,ic as Ee,kc as Ce,mc as ke,nc as Ie,p as D,pc as ee,qa as G,ra as R,ta as me,ub as m,va as F,vb as H,wb as f,xb as b,xc as te,yb as W}from"./chunk-PL3RMG6N.js";var re=class{constructor(){this.expansionModel=new Be(!0)}toggle(i){this.expansionModel.toggle(this._trackByValue(i))}expand(i){this.expansionModel.select(this._trackByValue(i))}collapse(i){this.expansionModel.deselect(this._trackByValue(i))}isExpanded(i){return this.expansionModel.isSelected(this._trackByValue(i))}toggleDescendants(i){this.expansionModel.isSelected(this._trackByValue(i))?this.collapseDescendants(i):this.expandDescendants(i)}collapseAll(){this.expansionModel.clear()}expandDescendants(i){let s=[i];s.push(...this.getDescendants(i)),this.expansionModel.select(...s.map(e=>this._trackByValue(e)))}collapseDescendants(i){let s=[i];s.push(...this.getDescendants(i)),this.expansionModel.deselect(...s.map(e=>this._trackByValue(e)))}_trackByValue(i){return this.trackBy?this.trackBy(i):i}},z=class extends re{constructor(i,s,e){super(),this.getLevel=i,this.isExpandable=s,this.options=e,this.options&&(this.trackBy=this.options.trackBy)}getDescendants(i){let s=this.dataNodes.indexOf(i),e=[];for(let t=s+1;t<this.dataNodes.length&&this.getLevel(i)<this.getLevel(this.dataNodes[t]);t++)e.push(this.dataNodes[t]);return e}expandAll(){this.expansionModel.select(...this.dataNodes.map(i=>this._trackByValue(i)))}};function nt(){return!0}var st=new me("mat-sanity-checks",{providedIn:"root",factory:nt}),ai=(()=>{let i=class i{constructor(e,t,n){this._sanityChecks=t,this._document=n,this._hasDoneGlobalChecks=!1,e._applyBodyHighContrastModeCssClasses(),this._hasDoneGlobalChecks||(this._hasDoneGlobalChecks=!0)}_checkIsEnabled(e){return Fe()?!1:typeof this._sanityChecks=="boolean"?this._sanityChecks:!!this._sanityChecks[e]}};i.\u0275fac=function(t){return new(t||i)(F(Ve),F(st,8),F(we))},i.\u0275mod=P({type:i}),i.\u0275inj=R({imports:[se,se]});let o=i;return o})();var p=function(o){return o[o.FADING_IN=0]="FADING_IN",o[o.VISIBLE=1]="VISIBLE",o[o.FADING_OUT=2]="FADING_OUT",o[o.HIDDEN=3]="HIDDEN",o}(p||{}),oe=class{constructor(i,s,e,t=!1){this._renderer=i,this.element=s,this.config=e,this._animationForciblyDisabledThroughCss=t,this.state=p.HIDDEN}fadeOut(){this._renderer.fadeOutRipple(this)}},qe=ne({passive:!0,capture:!0}),ae=class{constructor(){this._events=new Map,this._delegateEventHandler=i=>{var e;let s=Re(i);s&&((e=this._events.get(i.type))==null||e.forEach((t,n)=>{(n===s||n.contains(s))&&t.forEach(r=>r.handleEvent(i))}))}}addHandler(i,s,e,t){let n=this._events.get(s);if(n){let r=n.get(e);r?r.add(t):n.set(e,new Set([t]))}else this._events.set(s,new Map([[e,new Set([t])]])),i.runOutsideAngular(()=>{document.addEventListener(s,this._delegateEventHandler,qe)})}removeHandler(i,s,e){let t=this._events.get(i);if(!t)return;let n=t.get(s);n&&(n.delete(e),n.size===0&&t.delete(s),t.size===0&&(this._events.delete(i),document.removeEventListener(i,this._delegateEventHandler,qe)))}},Ye={enterDuration:225,exitDuration:150},rt=800,Ge=ne({passive:!0,capture:!0}),Qe=["mousedown","touchstart"],We=["mouseup","mouseleave","touchend","touchcancel"],S=class S{constructor(i,s,e,t){this._target=i,this._ngZone=s,this._platform=t,this._isPointerDown=!1,this._activeRipples=new Map,this._pointerUpEventsRegistered=!1,t.isBrowser&&(this._containerElement=ie(e))}fadeInRipple(i,s,e={}){let t=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),n=y(y({},Ye),e.animation);e.centered&&(i=t.left+t.width/2,s=t.top+t.height/2);let r=e.radius||ot(i,s,t),a=i-t.left,l=s-t.top,h=n.enterDuration,d=document.createElement("div");d.classList.add("mat-ripple-element"),d.style.left=`${a-r}px`,d.style.top=`${l-r}px`,d.style.height=`${r*2}px`,d.style.width=`${r*2}px`,e.color!=null&&(d.style.backgroundColor=e.color),d.style.transitionDuration=`${h}ms`,this._containerElement.appendChild(d);let v=window.getComputedStyle(d),Je=v.transitionProperty,le=v.transitionDuration,q=Je==="none"||le==="0s"||le==="0s, 0s"||t.width===0&&t.height===0,x=new oe(this,d,e,q);d.style.transform="scale3d(1, 1, 1)",x.state=p.FADING_IN,e.persistent||(this._mostRecentTransientRipple=x);let O=null;return!q&&(h||n.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let ce=()=>{O&&(O.fallbackTimer=null),clearTimeout(he),this._finishRippleTransition(x)},Y=()=>this._destroyRipple(x),he=setTimeout(Y,h+100);d.addEventListener("transitionend",ce),d.addEventListener("transitioncancel",Y),O={onTransitionEnd:ce,onTransitionCancel:Y,fallbackTimer:he}}),this._activeRipples.set(x,O),(q||!h)&&this._finishRippleTransition(x),x}fadeOutRipple(i){if(i.state===p.FADING_OUT||i.state===p.HIDDEN)return;let s=i.element,e=y(y({},Ye),i.config.animation);s.style.transitionDuration=`${e.exitDuration}ms`,s.style.opacity="0",i.state=p.FADING_OUT,(i._animationForciblyDisabledThroughCss||!e.exitDuration)&&this._finishRippleTransition(i)}fadeOutAll(){this._getActiveRipples().forEach(i=>i.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(i=>{i.config.persistent||i.fadeOut()})}setupTriggerEvents(i){let s=ie(i);!this._platform.isBrowser||!s||s===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=s,Qe.forEach(e=>{S._eventManager.addHandler(this._ngZone,e,s,this)}))}handleEvent(i){i.type==="mousedown"?this._onMousedown(i):i.type==="touchstart"?this._onTouchStart(i):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{We.forEach(s=>{this._triggerElement.addEventListener(s,this,Ge)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(i){i.state===p.FADING_IN?this._startFadeOutTransition(i):i.state===p.FADING_OUT&&this._destroyRipple(i)}_startFadeOutTransition(i){let s=i===this._mostRecentTransientRipple,{persistent:e}=i.config;i.state=p.VISIBLE,!e&&(!s||!this._isPointerDown)&&i.fadeOut()}_destroyRipple(i){var e;let s=(e=this._activeRipples.get(i))!=null?e:null;this._activeRipples.delete(i),this._activeRipples.size||(this._containerRect=null),i===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),i.state=p.HIDDEN,s!==null&&(i.element.removeEventListener("transitionend",s.onTransitionEnd),i.element.removeEventListener("transitioncancel",s.onTransitionCancel),s.fallbackTimer!==null&&clearTimeout(s.fallbackTimer)),i.element.remove()}_onMousedown(i){let s=Le(i),e=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+rt;!this._target.rippleDisabled&&!s&&!e&&(this._isPointerDown=!0,this.fadeInRipple(i.clientX,i.clientY,this._target.rippleConfig))}_onTouchStart(i){if(!this._target.rippleDisabled&&!je(i)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let s=i.changedTouches;if(s)for(let e=0;e<s.length;e++)this.fadeInRipple(s[e].clientX,s[e].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(i=>{let s=i.state===p.VISIBLE||i.config.terminateOnPointerUp&&i.state===p.FADING_IN;!i.config.persistent&&s&&i.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let i=this._triggerElement;i&&(Qe.forEach(s=>S._eventManager.removeHandler(s,i,this)),this._pointerUpEventsRegistered&&(We.forEach(s=>i.removeEventListener(s,this,Ge)),this._pointerUpEventsRegistered=!1))}};S._eventManager=new ae;var Ze=S;function ot(o,i,s){let e=Math.max(Math.abs(o-s.left),Math.abs(o-s.right)),t=Math.max(Math.abs(i-s.top),Math.abs(i-s.bottom));return Math.sqrt(e*e+t*t)}var U=class{constructor(i,s,e,t){this.transformFunction=i,this.getLevel=s,this.isExpandable=e,this.getChildren=t}_flattenNode(i,s,e,t){let n=this.transformFunction(i,s);if(e.push(n),this.isExpandable(n)){let r=this.getChildren(i);r&&(Array.isArray(r)?this._flattenChildren(r,s,e,t):r.pipe(fe(1)).subscribe(a=>{this._flattenChildren(a,s,e,t)}))}return e}_flattenChildren(i,s,e,t){i.forEach((n,r)=>{let a=t.slice();a.push(r!=i.length-1),this._flattenNode(n,s+1,e,a)})}flattenNodes(i){let s=[];return i.forEach(e=>this._flattenNode(e,0,s,[])),s}expandFlattenedNodes(i,s){let e=[],t=[];return t[0]=!0,i.forEach(n=>{let r=!0;for(let a=0;a<=this.getLevel(n);a++)r=r&&t[a];r&&e.push(n),this.isExpandable(n)&&(t[this.getLevel(n)+1]=s.isExpanded(n))}),e}},$=class extends Pe{get data(){return this._data.value}set data(i){this._data.next(i),this._flattenedData.next(this._treeFlattener.flattenNodes(this.data)),this._treeControl.dataNodes=this._flattenedData.value}constructor(i,s,e){super(),this._treeControl=i,this._treeFlattener=s,this._flattenedData=new D([]),this._expandedData=new D([]),this._data=new D([]),e&&(this.data=e)}connect(i){return pe(i.viewChange,this._treeControl.expansionModel.changed,this._flattenedData).pipe(ue(()=>(this._expandedData.next(this._treeFlattener.expandFlattenedNodes(this._flattenedData.value,this._treeControl)),this._expandedData.value)))}disconnect(){}};var at=(o,i,s)=>({focused:o,selected:i,expanded:s}),dt=o=>({$implicit:o});function lt(o,i){if(o&1){let s=Z();N(0),g(1,"div",5)(2,"span",6),K(3),_(),g(4,"div",7)(5,"span",8),I("click",function(){E(s);let t=u();return C(t._clearFilter())}),K(6,"\xD7"),_()()(),A()}if(o&2){let s=u();c(3),be(s.filter.term)}}function ct(o,i){o&1&&j(0)}function ht(o,i){if(o&1&&(N(0),g(1,"div")(2,"div",10),m(3,ct,1,0,"ng-container",11),_()(),A()),o&2){let s=u().$implicit,e=u(),t=V(5);c(),L("tree-node opaque focused selected tree-node--level-",s.level+1,""),b("padding-left",s.padding)("height",e.adapter.itemHeight,"px"),H("data-tree-node-id",s.id),c(),b("height",e.adapter.itemHeight,"px"),c(),f("ngTemplateOutlet",t)}}function ut(o,i){o&1&&j(0)}function pt(o,i){if(o&1&&(g(0,"div",12)(1,"div",10),m(2,ut,1,0,"ng-container",13),_()()),o&2){let s=u().$implicit,e=u();L("tree-node tree-node--level-",s.level,""),b("padding-left",s.padding)("height",e.adapter.itemHeight,"px"),f("ngClass",Ce(13,at,s.focused,s.selected,s.expanded)),H("data-tree-node-id",s.id),c(),b("height",e.adapter.itemHeight,"px"),c(),f("ngTemplateOutlet",e.nodeDirective.templateRef)("ngTemplateOutletContext",Ee(17,dt,s))}}function ft(o,i){o&1&&j(0)}function mt(o,i){if(o&1&&(N(0),g(1,"div")(2,"div",10),m(3,ft,1,0,"ng-container",11),_()(),A()),o&2){let s=u().$implicit,e=u(),t=V(5);c(),L("tree-node opaque focused selected tree-node--level-",s.level+1,""),b("padding-left",s.padding)("height",e.adapter.itemHeight,"px"),c(),b("height",e.adapter.itemHeight,"px"),c(),f("ngTemplateOutlet",t)}}function gt(o,i){if(o&1&&(N(0),m(1,ht,4,11,"ng-container",9)(2,pt,3,19,"ng-template",null,1,ee)(4,mt,4,10,"ng-container",2),A()),o&2){let s=i.$implicit,e=V(3);c(),f("ngIf",s.renaming)("ngIfElse",e),c(3),f("ngIf",s.creating)}}function _t(o,i){if(o&1){let s=Z();g(0,"span",14)(1,"input",15),I("click",function(t){return E(s),t.preventDefault(),C(t.stopPropagation())}),De("ngModelChange",function(t){E(s);let n=u();return ye(n.editing.text,t)||(n.editing.text=t),C(t)}),I("keydown",function(t){E(s);let n=u();return C(n._onEdit(t))})("blur",function(t){E(s);let n=u();return C(n._onEdit(t))}),_()()}if(o&2){let s=u();c(),xe("ngModel",s.editing.text)}}var vt=(()=>{let i=class i{static ngTemplateContextGuard(e,t){return!0}constructor(e){this.templateRef=e}};i.\u0275fac=function(t){return new(t||i)(k(_e))},i.\u0275dir=B({type:i,selectors:[["","treeNode",""],["ui-tree-node"]]});let o=i;return o})(),de=new Map,w=class{constructor(i=""){this.term=i}},Xe=class{constructor(i="",s=[],e=new w){this.active=i,this.expandedNodes=s,this.filter=e}},bt=(()=>{let i=class i{constructor(e){this.el=e}ngAfterContentInit(){setTimeout(()=>{this.el.nativeElement.focus()},500)}};i.\u0275fac=function(t){return new(t||i)(k(M))},i.\u0275dir=B({type:i,selectors:[["input","autofocus",""]]});let o=i;return o})(),Di=(()=>{let i=class i{get treeHeight(){var e,t;return((t=(e=this.adapter)==null?void 0:e.itemHeight)==null?void 0:t.toString())||"100%"}constructor(e,t){this.elementRef=e,this.changeDetectorRef=t,this.nodes=[],this.DATA_TREE_NODE_ID="data-tree-node-id",this.nodesIndex=new Map,this.parentsIndex=new Map,this.hiddenNodes=new Map,this.selectedNodes=new Map,this.isEmpty=!1,this.isShiftKeyPressed=!1,this.editing={text:"",node:void 0},this.visibleNodes=new D([]),this.filter=new w,this.controler=new z(n=>n.level,n=>n.expandable,{trackBy:n=>n}),this.flattener=new U((n,r)=>this.transformer(n,r),n=>n.level,n=>n.expandable,n=>this.children(n)),this.dataSource=new $(this.controler,this.flattener)}ngOnInit(){var e;if(!((e=this.adapter.id)!=null&&e.trim()))throw new Error("@Input() adapter.id is required !");de.set(this.adapter.id,this)}ngOnChanges(){var n;if(!this.adapter)throw new Error("@Input() adapter is required !");let e=["id","idProvider","nameProvider","isExpandable","childrenProvider"];for(let r of e){let a=this.adapter[r];if(!a||typeof a=="string"&&a.trim()==="")throw new Error(`@Input() adapter.${r} is required !`)}this.adapter.itemHeight=this.adapter.itemHeight||32,this.adapter.treeHeight=this.adapter.treeHeight||"100%",this.adapter.keepStateOnChangeNodes=(n=this.adapter.keepStateOnChangeNodes)!=null?n:!0;let t;this.adapter.keepStateOnChangeNodes&&(t=this.saveState()),this.buildIndexes(),t?this.restoreState(t):(this.unselectAll(!1),this.render())}ngOnDestroy(){var e;(e=this.adapter)!=null&&e.id&&de.delete(this.adapter.id)}selections(){return Array.from(this.selectedNodes.values()).map(e=>e.data)}focusedNode(){var e;return(e=this.activeNode)==null?void 0:e.data}isFocused(e){var t;if(e==null)throw new ReferenceError('Argument "node" is required.');return this.activeNode?((t=this.findHolder(e))==null?void 0:t.id)===this.activeNode.id:!1}isExpanded(e){if(e==null)throw new ReferenceError('Argument "node" is required.');let t=this.findHolder(e);return t!=null&&t.expandable?this.controler.isExpanded(t):!1}isSelected(e){if(e==null)throw new ReferenceError('Argument "node" is required.');let t=this.findHolder(e);return t?this.selectedNodes.has(t.id):!1}focus(e,t=!0){let n=this.findHolder(e);n&&(this.activeNode&&this.unselect(this.activeNode,!1),this.activeNode=n,this.select(e,!1),this.expandAncestors(n),t&&this.render(),this.scrollInto(n))}unfocus(){this.activeNode=void 0,this.changeDetectorRef.detectChanges()}expand(e,t=!0){if(!e)return;let n=this.findHolder(e);n&&n.expandable&&!this.controler.isExpanded(n)&&(this.controler.expand(n),this.expandAncestors(n),t&&this.render())}expandAll(e=!0){var t;(t=this.controler.dataNodes)==null||t.forEach(n=>{this.controler.expand(n)}),e&&this.render()}collapse(e,t=!0){if(!e)return;let n=this.findHolder(e);n&&n.expandable&&this.controler.isExpanded(n)&&(this.controler.collapse(n),this.adapter.onDidCollapse&&this.adapter.onDidCollapse(n.data),t&&this.render())}collapseAll(e=!0){this.controler.collapseAll(),e&&this.render()}toggle(e,t=!0){if(!e)return;let n=this.findHolder(e);n!=null&&n.expandable&&(this.controler.isExpanded(n)?this.collapse(e,t):this.expand(e,t))}startEdition(e,t){if(!this.adapter.onDidEditName)return;if(!e)throw new ReferenceError('Argument "node" is required.');let n=this.findHolder(e);n&&(this.unselectAll(!1),this.editing.node=n.data,this.editing.text=t?"":n.name,this.editing.creation=t,n.renaming=!t,n.creating=t,n.expandable&&!this.isExpanded(n)&&this.expand(e)),this.changeDetectorRef.detectChanges()}endEdition(){let e=this.findHolder(this.editing.node);e&&(e.renaming=!1,e.creating=!1),this.editing={text:""},this.changeDetectorRef.detectChanges()}search(e){if(this.filter.term||(this.stateBeforeSearching=this.saveState()),this.filter.term=(e.term||"").trim(),!this.filter.term){this.stateBeforeSearching?(this.restoreState(this.stateBeforeSearching),this.stateBeforeSearching=void 0):(this.hiddenNodes.clear(),this.render());return}let t=this.buildSearchPattern();if(t){this.activeNode=void 0,this.hiddenNodes.clear(),this.selectedNodes.clear(),this.collapseAll(!1);let n=t,r=new Set,a=this.controler.dataNodes||[],l=a.length-1;for(let h=l;h>=0;h--){let d=a[h];r.has(d.id)||(d.name.toLowerCase().match(n)?(r.add(d.id),this.iterateAncestors(d,v=>{this.controler.expand(v),r.add(v.id)})):this.hiddenNodes.set(d.id,d))}this.render()}else this.changeDetectorRef.detectChanges()}saveState(){let{term:e}=this.filter,t=this.controler.dataNodes||[];return{filter:{term:e},active:this.activeNode?this.activeNode.id:"",expandedNodes:t.filter(r=>this.controler.isExpanded(r)).map(r=>r.id)}}restoreState(e){e=e||{active:"",filter:new w,expandedNodes:[]},e.active=e.active||"",e.filter=e.filter||new w,e.expandedNodes=e.expandedNodes||[],this.hiddenNodes.clear(),this.selectedNodes.clear(),this.collapseAll(!1);let{active:t,filter:n,expandedNodes:r}=e;if(n.term?this.search(n):(r.forEach(a=>this.expand(a,!1)),this.render()),t){let a=this.findHolder(t);a&&this.focus(a)}}_onEdit(e){if(this.adapter.onDidEditName){e.stopPropagation();let{node:t,text:n,creation:r}=this.editing;if(!t)throw new Error("There is no focused node.");let a=e instanceof FocusEvent&&e.type==="blur",l=e instanceof KeyboardEvent&&e.key==="Enter";if(e instanceof KeyboardEvent&&e.key==="Escape")e.preventDefault(),this.endEdition();else if(a||l){e.preventDefault();let d=(n==null?void 0:n.trim())||"";try{d&&this.adapter.onDidEditName({node:t,text:d,creation:r})}finally{this.focus(t),this.endEdition()}}}}_clearFilter(){this.search({term:""})}_isRenaming(e){var t,n;if(e==null)throw new ReferenceError('Argument "node" is required.');return(t=this.editing)!=null&&t.node?!this.editing.creation&&((n=this.findHolder(e))==null?void 0:n.id)===this.adapter.idProvider(this.editing.node):!1}_isCreating(e){var t,n;if(e==null)throw new ReferenceError('Argument "node" is required.');return(t=this.editing)!=null&&t.node?!!this.editing.creation&&((n=this.findHolder(e))==null?void 0:n.id)===this.adapter.idProvider(this.editing.node):!1}_trackById(e,t){return t.id}keyup(){this.isShiftKeyPressed=!1}keydown(e){this.isShiftKeyPressed=e.shiftKey,this.isTreeContainsEvent(e)&&this.onKeyDown(e)}mousedown(e){this.changeDetectorRef.detach(),this.isTreeContainsEvent(e)&&(this.changeDetectorRef.reattach(),this.onMouseDown(e))}contextmenu(e){this.changeDetectorRef.detach(),this.isTreeContainsEvent(e)&&(this.changeDetectorRef.reattach(),this.onContextMenu(e))}onKeyDown(e){!this.activeNode&&!this.isEmpty&&!this.selectedNodes.size&&this.focus(this.controler.dataNodes[0]);let t=this.activeNode?this.domNode(this.activeNode):void 0;if(t&&this.activeNode)switch(e.key){case"ArrowUp":e.preventDefault(),e.stopPropagation(),this.navigate(t,"up");break;case"ArrowDown":e.preventDefault(),e.stopPropagation(),this.navigate(t,"down");break;case"ArrowLeft":this.isShiftKeyPressed||(e.preventDefault(),e.stopPropagation(),this.collapse(this.activeNode,!0));break;case"ArrowRight":this.isShiftKeyPressed||(e.preventDefault(),e.stopPropagation(),this.expand(this.activeNode,!0));break;default:this.triggerKeyboardEvent(e),this.triggerFilterEvent(e);break}else this.triggerFilterEvent(e);e.key==="Backspace"&&e.preventDefault()}onMouseDown(e){var n;let t=this.findHolderFromEvent(e);if(t)if(this.isShiftKeyPressed&&this.activeNode){let r=this.domNode(this.activeNode);if(!r){this.select(t);return}let a=this.domNode(t);if(!a)return;this.unselectAll(!1);let l=r,h=a.getClientRects().item(0).top,d=r.getClientRects().item(0).top;if(d<h)do this.select(l,!1),l=l.nextElementSibling;while(l&&!l.isEqualNode(a));else if(d>h)do this.select(l,!1),l=l.previousElementSibling;while(l&&!l.isEqualNode(a));this.select(a,!1),this.focus(t,!0)}else{this.unselectAll(!1),this.toggle(t,!1),this.focus(t,!0);let{actions:r}=this.adapter;(n=r==null?void 0:r.mouse)!=null&&n.click&&r.mouse.click({node:t.data,event:e})}}onContextMenu(e){var r;e.preventDefault(),e.stopPropagation();let t=this.findHolderFromEvent(e);t&&(this.isSelected(t)||this.unselectAll(!1),this.focus(t,!0));let{actions:n}=this.adapter;(r=n==null?void 0:n.mouse)!=null&&r.rightClick&&n.mouse.rightClick({node:t==null?void 0:t.data,event:e})}isTreeContainsEvent(e){return this.elementRef.nativeElement.contains(e.target)}triggerFilterEvent(e){if(e.defaultPrevented||!this.adapter.enableKeyboardFiltering)return;e.preventDefault(),e.stopPropagation();let{term:t}=this.filter;switch(e.key){case"Backspace":t&&this.search({term:t.slice(0,-1)});break;case" ":case"Tab":break;default:e.key.length===1&&this.search({term:t+e.key});break}}triggerKeyboardEvent(e){if(!this.activeNode)return;let{actions:t}=this.adapter;if(t){let{keys:n}=t;if(n){let r=n[e.key];r&&r({event:e,node:this.activeNode.data})}}}render(){let e=[],t=this.controler.dataNodes||[],n=new Set(this.controler.expansionModel.selected.map(r=>r.id));this.isEmpty=!0,t.forEach(r=>{if(this.isEmpty=!1,this.hiddenNodes.has(r.id))return;if(r.focused=this.isFocused(r),r.expanded=this.isExpanded(r),r.renaming=this._isRenaming(r),r.creating=this._isCreating(r),r.selected=this.isSelected(r),r.level===0){e.push(r);return}let a=this.findParent(r);for(;a!=null;){if(!n.has(a.id))return;if(a.level===0)break;a=this.findParent(a)}e.push(r)}),this.visibleNodes.next(e),this.changeDetectorRef.detectChanges()}buildIndexes(){var e;this.nodesIndex.clear(),this.parentsIndex.clear(),this.dataSource.data=this.nodes,(e=this.controler.dataNodes)==null||e.forEach(t=>{this.nodesIndex.set(t.id,t)})}buildSearchPattern(){let e;try{if(this.filter.term){let t=n=>n.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");e=new RegExp(`(${t(this.filter.term)})`,"g")}}catch(t){console.error(t)}return e}domNode(e){let t=this.findHolder(e);if(!t)throw new Error(e+" is not a registered node");return document.querySelector(`[${this.DATA_TREE_NODE_ID}="${t.id}"]`)}select(e,t=!0){let n=this.findHolder(e);n&&(this.selectedNodes.set(n.id,n),t&&this.changeDetectorRef.detectChanges())}unselect(e,t=!0){var r;let n=this.findHolder(e);n&&(this.selectedNodes.delete(n.id),n.id===((r=this.activeNode)==null?void 0:r.id)&&(this.activeNode=void 0),t&&this.changeDetectorRef.detectChanges())}unselectAll(e=!0){this.activeNode=void 0,this.selectedNodes.clear(),e&&this.changeDetectorRef.detectChanges()}expandAncestors(e){this.iterateAncestors(e,t=>{t.expandable&&!this.controler.isExpanded(t)&&(this.controler.expand(t),this.adapter.onDidExpand&&this.adapter.onDidExpand(t.data))})}iterateAncestors(e,t){let n=a=>{t(a);let l=this.findParent(a);l&&l.level>=0&&n(l)},r=this.findParent(e);r&&n(r)}scrollInto(e){var n;let t=this.findHolder(e);if(t){if(this.visibleNodes.value.indexOf(t)==-1)return;(n=this.domNode(e))==null||n.scrollIntoView({behavior:"smooth",block:"nearest"})}}navigate(e,t){this.unselectAll();let n=this.findHolderFromElement(e);if(!n)return;let r=e.previousElementSibling,a=e.nextElementSibling,l=t==="up"?r:a;if(!l)return;let h=this.findHolderFromElement(l);if(!h){this.focus(n);return}let d=r?this.findHolderFromElement(r):void 0;d&&this.isSelected(d)&&l.isEqualNode(r)&&this.unselect(n);let v=a?this.findHolderFromElement(a):void 0;v&&this.isSelected(v)&&l.isEqualNode(a)&&this.unselect(n),this.focus(h)}findParent(e){let t=this.findHolder(e);if(!t)return;let n=this.parentsIndex.get(t.id);if(n)return this.nodesIndex.get(n)}findHolderFromId(e){let{dataNodes:t}=this.controler;if(t)return t.find(n=>n.id===e)}findHolderFromData(e){let{dataNodes:t}=this.controler;if(t)return this.nodesIndex.get(this.adapter.idProvider(e))}findHolderFromEvent(e){let{dataNodes:t}=this.controler;if(!t)return;let n=this.DATA_TREE_NODE_ID,r=a=>{if(!a)return;let l=a.getAttribute(n);return l?this.nodesIndex.get(l):r(a.parentElement)};return r(e.target)}findHolderFromElement(e){let{dataNodes:t}=this.controler;if(!t)return;let n=e.getAttribute(this.DATA_TREE_NODE_ID);if(n)return this.nodesIndex.get(n)}findHolder(e){if(e&&this.controler.dataNodes)return typeof e=="string"?this.findHolderFromId(e):e instanceof Element?this.findHolderFromElement(e):"data"in e?e:this.findHolderFromData(e)}children(e){let t=this.adapter.childrenProvider(e)||[],n=this.adapter.idProvider(e);return t.forEach(r=>{this.parentsIndex.set(this.adapter.idProvider(r),n)}),t}transformer(e,t){var r,a;let n=this.adapter.isExpandable(e);return{id:this.adapter.idProvider(e),data:e,name:this.adapter.nameProvider(e),level:t,padding:t*12+"px",tooltip:(a=(r=this.adapter).tooltipProvider)==null?void 0:a.call(r,e),expandable:n}}};i.\u0275fac=function(t){return new(t||i)(k(M),k(te))},i.\u0275cmp=Q({type:i,selectors:[["ui-tree"]],contentQueries:function(t,n,r){if(t&1&&ve(r,vt,7),t&2){let a;X(a=J())&&(n.nodeDirective=a.first)}},hostBindings:function(t,n){t&1&&I("keyup",function(){return n.keyup()},!1,T)("keydown",function(a){return n.keydown(a)},!1,T)("click",function(a){return n.mousedown(a)},!1,T)("contextmenu",function(a){return n.contextmenu(a)},!1,T)},inputs:{nodes:"nodes",adapter:"adapter"},features:[ge],decls:6,vars:9,consts:[["inputTemplate",""],["nodeTemplate",""],[4,"ngIf"],["tabindex","0",1,"tree-component"],[4,"ngFor","ngForOf","ngForTrackBy"],["title","Filter",1,"tree-filter"],[1,"tree-filter__label"],[1,"tree-filter__commands"],["role","button","title","Clear",1,"command-clear",3,"click"],[4,"ngIf","ngIfElse"],[1,"tree-node__content"],[4,"ngTemplateOutlet"],[3,"ngClass"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[1,"tree-input"],["autofocus","","type","text","placeholder","Press Enter to create ESC to cancel...",3,"click","ngModelChange","keydown","blur","ngModel"]],template:function(t,n){t&1&&(m(0,lt,7,1,"ng-container",2),g(1,"div",3),m(2,gt,5,3,"ng-container",4),ke(3,"async"),_(),m(4,_t,2,1,"ng-template",null,0,ee)),t&2&&(f("ngIf",n.filter.term),c(),b("height",n.treeHeight),W("editing",n.editing.node!=null),c(),f("ngForOf",Ie(3,7,n.visibleNodes))("ngForTrackBy",n._trackById))},dependencies:[Me,Te,Ne,Ae,Ke,ze,Ue,bt,Se],styles:["[_nghost-%COMP%]{position:relative;--tree-selection-color: #bae7ff}.tree-component[_ngcontent-%COMP%]{height:100%;background:transparent}.tree-component[_ngcontent-%COMP%]:hover{outline:none}.tree-component[_ngcontent-%COMP%]:hover   .tree-node.focused[_ngcontent-%COMP%], .tree-component[_ngcontent-%COMP%]:hover   .tree-node.selected[_ngcontent-%COMP%]{background-color:var(--tree-selection-color)}.tree-component.editing[_ngcontent-%COMP%]   .opaque[_ngcontent-%COMP%]{opacity:1!important}.tree-component.editing[_ngcontent-%COMP%]   .tree-node[_ngcontent-%COMP%]{opacity:.4}.tree-node[_ngcontent-%COMP%]:hover, .tree-node.focused[_ngcontent-%COMP%], .tree-node.selected[_ngcontent-%COMP%]{background-color:#4242420a}.tree-node[_ngcontent-%COMP%], .tree-node__content[_ngcontent-%COMP%]{cursor:pointer;position:relative;width:100%;display:flex;overflow:hidden;align-items:center;box-sizing:border-box}.tree-node__content[_ngcontent-%COMP%]{padding:0 12px}.tree-input[_ngcontent-%COMP%]{display:flex;align-items:center;width:calc(100% - 4px);margin-right:4px}.tree-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;margin:0 0 0 8px;padding:.1rem .3rem;font-size:.8rem;line-height:1.5;background-clip:padding-box;border:1px solid #ced4da;border-radius:.15rem;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.tree-input[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem #007bff40}.tree-filter[_ngcontent-%COMP%]{background-color:#efc1ad;display:flex;align-items:center;position:absolute;border-radius:2px;padding:0 4px;max-width:calc(100% - 10px);text-overflow:ellipsis;overflow:hidden;text-align:right;box-sizing:border-box;cursor:all-scroll;font-size:13px;line-height:18px;height:20px;z-index:1;right:0;outline:rgba(0,0,0,0) solid 4px;transition:width .5s}.tree-filter[_ngcontent-%COMP%]:hover   .tree-filter__commands[_ngcontent-%COMP%]{display:flex}.tree-filter[_ngcontent-%COMP%]   .tree-filter__commands[_ngcontent-%COMP%]{display:none;display:flex;align-items:center}.tree-filter[_ngcontent-%COMP%]   .tree-filter__commands[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{cursor:pointer;font-size:18px;margin-left:4px}.tree-filter[_ngcontent-%COMP%]   .command-filter[_ngcontent-%COMP%]{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}"],changeDetection:0});let o=i;return o})(),Ei=(()=>{let i=class i{};i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=P({type:i}),i.\u0275inj=R({imports:[Oe,$e,He]});let o=i;return o})(),Ci=(()=>{let i=class i{get(e){return de.get(e)}};i.\u0275fac=function(t){return new(t||i)},i.\u0275prov=G({token:i,factory:i.\u0275fac,providedIn:"root"});let o=i;return o})();export{ai as a,vt as b,Xe as c,Di as d,Ei as e,Ci as f};
