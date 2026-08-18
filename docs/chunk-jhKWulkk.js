import {bj as a,X as Xw,B as ty,Y as an,Z as ot$1,a2 as Ji,a3 as _i,aE as Vb,T as Ts,u as uT,E as El,D as nm,a4 as uw,n as Pg,az as _T,N as Ng,w as wI,J as tm,a5 as dw,d as Xg,aA as MT,ac as IT,V as hT,t as No$1,z as ir$1,y,a6 as xt,ag as xm,bk as oe$1,b1 as I,aO as MB,m as mt$1,bl as NB,q as qe,aF as le$1,j as jc,bm as _v,aL as de,bn as wv,aM as Pt$1,aK as Hd,aJ as pv,bo as AB,aZ as Fb,F as FC,a$ as Tg,e as yC,P as PC,W as Wg,v as vC,aX as Ug,ap as Vg,aY as VC,aq as jC,ar as BC,bp as Hg,bq as Bg,ab as xr$1,a7 as Ct,ax as Mg,br as b,a9 as Mo$1,aP as ye,bs as pi,aU as Ii,bt as Dr$1,bu as _s,bv as ub,b3 as kg,a_ as wg,A as Ag,b as Il,c as wl,bw as iv,aI as Ma$1,bx as vm,by as Xn$1,bz as lb,H as Hf,x as xg,av as HC,U as Uf,ad as _,ae as O,af as Ai,h as XC,b6 as ao$1,b4 as r2,bA as Xe$1,bB as mr$1,bC as ee,O as OC,bD as Rn$1,bE as Et,_ as _B,$,bF as hv,bG as Z_,ba as re,bh as _r$1,aa as Ln$1,bH as Sv,be as he$1,bd as Ar$1,bc as RB,at as B$1,R as bl,bI as hD,bJ as Ca,M as MC,p as Nf,r as xf,bK as ke,bL as ds,bM as jm,bN as co$1,bO as A,bP as Tv,bQ as Fr,bR as bv,bS as yv,aH as Ud,bT as gv,bU as XE,as as W,bV as Jt,b0 as xT}from'./main-XIPT6SY2.js';import {o as od}from'./chunk-B6OXTO__.js';function et(o){return o.buttons===0||o.detail===0}function tt(o){let n=o.touches&&o.touches[0]||o.changedTouches&&o.changedTouches[0];return !!n&&n.identifier===-1&&(n.radiusX==null||n.radiusX===1)&&(n.radiusY==null||n.radiusY===1)}var bn;function Vi(){if(bn==null){let o=typeof document<"u"?document.head:null;bn=!!(o&&(o.createShadowRoot||o.attachShadow));}return bn}function _n(o){if(Vi()){let n=o.getRootNode?o.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&n instanceof ShadowRoot)return n}return null}function Z(o){if(o.composedPath)try{return o.composedPath()[0]}catch{}return o.target}var gn;try{gn=typeof Intl<"u"&&Intl.v8BreakIterator;}catch{gn=false;}var N=(()=>{class o{_platformId=y(ao$1);isBrowser=this._platformId?r2(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||gn)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var nt;function Hi(){if(nt==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>nt=!0}));}finally{nt=nt||false;}return nt}function je(o){return Hi()?o:!!o.capture}function he(o){return o instanceof xt?o.nativeElement:o}var ji=new I("cdk-input-modality-detector-options"),Wi={ignoreKeys:[18,17,224,91,16]},Ui=650,vn={passive:true,capture:true},Yi=(()=>{class o{_platform=y(N);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new Fr(null);_options;_lastTouchMs=0;_onKeydown=e=>{this._options?.ignoreKeys?.some(t=>t===e.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=Z(e));};_onMousedown=e=>{Date.now()-this._lastTouchMs<Ui||(this._modality.next(et(e)?"keyboard":"mouse"),this._mostRecentTarget=Z(e));};_onTouchstart=e=>{if(tt(e)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=Z(e);};constructor(){let e=y(oe$1),t=y($),i=y(ji,{optional:true});if(this._options=B$1(B$1({},Wi),i),this.modalityDetected=this._modality.pipe(bv(1)),this.modalityChanged=this.modalityDetected.pipe(yv()),this._platform.isBrowser){let r=y(Rn$1).createRenderer(null,null);this._listenerCleanups=e.runOutsideAngular(()=>[r.listen(t,"keydown",this._onKeydown,vn),r.listen(t,"mousedown",this._onMousedown,vn),r.listen(t,"touchstart",this._onTouchstart,vn)]);}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(e=>e());}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),it=(function(o){return o[o.IMMEDIATE=0]="IMMEDIATE",o[o.EVENTUAL=1]="EVENTUAL",o})(it||{}),Ki=new I("cdk-focus-monitor-default-options"),Tt=je({passive:true,capture:true}),yn=(()=>{class o{_ngZone=y(oe$1);_platform=y(N);_inputModalityDetector=y(Yi);_origin=null;_lastFocusOrigin=null;_windowFocused=false;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=false;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=true,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=false);};_document=y($);_stopInputModalityDetector=new le$1;constructor(){let e=y(Ki,{optional:true});this._detectionMode=e?.detectionMode||it.IMMEDIATE;}_rootNodeFocusAndBlurListener=e=>{let t=Z(e);for(let i=t;i;i=i.parentElement)e.type==="focus"?this._onFocus(e,i):this._onBlur(e,i);};monitor(e,t=false){let i=he(e);if(!this._platform.isBrowser||i.nodeType!==1)return Ca();let r=_n(i)||this._document,s=this._elementInfo.get(i);if(s)return t&&(s.checkChildren=true),s.subject;let l={checkChildren:t,subject:new le$1,rootNode:r};return this._elementInfo.set(i,l),this._registerGlobalListeners(l),l.subject}stopMonitoring(e){let t=he(e),i=this._elementInfo.get(t);i&&(i.subject.complete(),this._setClasses(t),this._elementInfo.delete(t),this._removeGlobalListeners(i));}focusVia(e,t,i){let r=he(e),s=this._document.activeElement;r===s?this._getClosestElementsInfo(r).forEach(([l,m])=>this._originChanged(l,t,m)):(this._setOrigin(t),typeof r.focus=="function"&&r.focus(i));}ngOnDestroy(){this._elementInfo.forEach((e,t)=>this.stopMonitoring(t));}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(e){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(e)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:e&&this._isLastInteractionFromInputLabel(e)?"mouse":"program"}_shouldBeAttributedToTouch(e){return this._detectionMode===it.EVENTUAL||!!e?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(e,t){e.classList.toggle("cdk-focused",!!t),e.classList.toggle("cdk-touch-focused",t==="touch"),e.classList.toggle("cdk-keyboard-focused",t==="keyboard"),e.classList.toggle("cdk-mouse-focused",t==="mouse"),e.classList.toggle("cdk-program-focused",t==="program");}_setOrigin(e,t=false){this._ngZone.runOutsideAngular(()=>{if(this._origin=e,this._originFromTouchInteraction=e==="touch"&&t,this._detectionMode===it.IMMEDIATE){clearTimeout(this._originTimeoutId);let i=this._originFromTouchInteraction?Ui:1;this._originTimeoutId=setTimeout(()=>this._origin=null,i);}});}_onFocus(e,t){let i=this._elementInfo.get(t),r=Z(e);!i||!i.checkChildren&&t!==r||this._originChanged(t,this._getFocusOrigin(r),i);}_onBlur(e,t){let i=this._elementInfo.get(t);!i||i.checkChildren&&e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||(this._setClasses(t),this._emitOrigin(i,null));}_emitOrigin(e,t){e.subject.observers.length&&this._ngZone.run(()=>e.subject.next(t));}_registerGlobalListeners(e){if(!this._platform.isBrowser)return;let t=e.rootNode,i=this._rootNodeFocusListenerCount.get(t)||0;i||this._ngZone.runOutsideAngular(()=>{t.addEventListener("focus",this._rootNodeFocusAndBlurListener,Tt),t.addEventListener("blur",this._rootNodeFocusAndBlurListener,Tt);}),this._rootNodeFocusListenerCount.set(t,i+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener);}),this._inputModalityDetector.modalityDetected.pipe(Hd(this._stopInputModalityDetector)).subscribe(r=>{this._setOrigin(r,true);}));}_removeGlobalListeners(e){let t=e.rootNode;if(this._rootNodeFocusListenerCount.has(t)){let i=this._rootNodeFocusListenerCount.get(t);i>1?this._rootNodeFocusListenerCount.set(t,i-1):(t.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Tt),t.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Tt),this._rootNodeFocusListenerCount.delete(t));}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId));}_originChanged(e,t,i){this._setClasses(e,t),this._emitOrigin(i,t),this._lastFocusOrigin=t;}_getClosestElementsInfo(e){let t=[];return this._elementInfo.forEach((i,r)=>{(r===e||i.checkChildren&&r.contains(e))&&t.push([r,i]);}),t}_isLastInteractionFromInputLabel(e){let{_mostRecentTarget:t,mostRecentModality:i}=this._inputModalityDetector;if(i!=="mouse"||!t||t===e||e.nodeName!=="INPUT"&&e.nodeName!=="TEXTAREA"||e.disabled)return  false;let r=e.labels;if(r){for(let s=0;s<r.length;s++)if(r[s].contains(t))return  true}return  false}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var At=new WeakMap,se=(()=>{class o{_appRef;_injector=y(re);_environmentInjector=y(he$1);load(e){let t=this._appRef=this._appRef||this._injector.get(Ar$1),i=At.get(t);i||(i={loaders:new Set,refs:[]},At.set(t,i),t.onDestroy(()=>{At.get(t)?.refs.forEach(r=>r.destroy()),At.delete(t);})),i.loaders.has(e)||(i.loaders.add(e),i.refs.push(RB(e,{environmentInjector:this._environmentInjector})));}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var xn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(t,i){},styles:[`.cdk-visually-hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
  outline: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  left: 0;
}
[dir=rtl] .cdk-visually-hidden {
  left: auto;
  right: 0;
}
`],encapsulation:2})}return o})(),It;function ur(){if(It===void 0&&(It=null,typeof window<"u")){let o=window;if(o.trustedTypes!==void 0)try{It=o.trustedTypes.createPolicy("angular#components",{createHTML:n=>n});}catch(n){console.error(n);}}return It}function hr(o){return ur()?.createHTML(o)||o}function Gi(o,n,e){let t=e.sanitize(ke.HTML,n);o.innerHTML=hr(t||"");}function kn(o){return Array.isArray(o)?o:[o]}var Xi=new Set,Ae,wn=(()=>{class o{_platform=y(N);_nonce=y(co$1,{optional:true});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):pr;}matchMedia(e){return (this._platform.WEBKIT||this._platform.BLINK)&&fr(e,this._nonce),this._matchMedia(e)}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();function fr(o,n){if(!Xi.has(o))try{Ae||(Ae=document.createElement("style"),n&&Ae.setAttribute("nonce",n),Ae.setAttribute("type","text/css"),document.head.appendChild(Ae)),Ae.sheet&&(Ae.sheet.insertRule(`@media ${o.replace(/[{}]/g,"")} {body{ }}`,0),Xi.add(o));}catch(e){console.error(e);}}function pr(o){return {matches:o==="all"||o==="",media:o,addListener:()=>{},removeListener:()=>{}}}var br=(()=>{class o{create(e){return typeof MutationObserver>"u"?null:new MutationObserver(e)}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var qi=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({providers:[br]})}return o})();var Zi=new I("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),Qi=new I("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),_r=0,Cn=(()=>{class o{_ngZone=y(oe$1);_defaultOptions=y(Qi,{optional:true});_liveElement;_document=y($);_sanitizer=y(Z_);_previousTimeout;_currentPromise;_currentResolve;constructor(){let e=y(Zi,{optional:true});this._liveElement=e||this._createLiveElement();}announce(e,...t){let i=this._defaultOptions,r,s;return t.length===1&&typeof t[0]=="number"?s=t[0]:[r,s]=t,this.clear(),clearTimeout(this._previousTimeout),r||(r=i&&i.politeness?i.politeness:"polite"),s==null&&i&&(s=i.duration),this._liveElement.setAttribute("aria-live",r),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(l=>this._currentResolve=l)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!e||typeof e=="string"?this._liveElement.textContent=e:Gi(this._liveElement,e,this._sanitizer),typeof s=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),s)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0;},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="");}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0;}_createLiveElement(){let e="cdk-live-announcer-element",t=this._document.getElementsByClassName(e),i=this._document.createElement("div");for(let r=0;r<t.length;r++)t[r].remove();return i.classList.add(e),i.classList.add("cdk-visually-hidden"),i.setAttribute("aria-atomic","true"),i.setAttribute("aria-live","polite"),i.id=`cdk-live-announcer-${_r++}`,this._document.body.appendChild(i),i}_exposeAnnouncerToModals(e){let t=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let i=0;i<t.length;i++){let r=t[i],s=r.getAttribute("aria-owns");s?s.indexOf(e)===-1&&r.setAttribute("aria-owns",s+" "+e):r.setAttribute("aria-owns",e);}}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var gr=200,Ft=class{_letterKeyStream=new le$1;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new le$1;selectedItem=this._selectedItem;constructor(n,e){let t=typeof e?.debounceInterval=="number"?e.debounceInterval:gr;e?.skipPredicate&&(this._skipPredicateFn=e.skipPredicate),this.setItems(n),this._setupKeyHandler(t);}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete();}setCurrentSelectedItemIndex(n){this._selectedItemIndex=n;}setItems(n){this._items=n;}handleKey(n){let e=n.keyCode;n.key&&n.key.length===1?this._letterKeyStream.next(n.key.toLocaleUpperCase()):(e>=65&&e<=90||e>=48&&e<=57)&&this._letterKeyStream.next(String.fromCharCode(e));}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[];}_setupKeyHandler(n){this._letterKeyStream.pipe(Ud(e=>this._pressedLetters.push(e)),gv(n),Pt$1(()=>this._pressedLetters.length>0),de(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(e=>{for(let t=1;t<this._items.length+1;t++){let i=(this._selectedItemIndex+t)%this._items.length,r=this._items[i];if(!this._skipPredicateFn?.(r)&&r.getLabel?.().toLocaleUpperCase().trim().indexOf(e)===0){this._selectedItem.next(r);break}}this._pressedLetters=[];});}};function ge(o,...n){return n.length?n.some(e=>o[e]):o.altKey||o.shiftKey||o.ctrlKey||o.metaKey}var Pt=class{_items;_activeItemIndex=qe(-1);_activeItem=qe(null);_wrap=false;_typeaheadSubscription=ee.EMPTY;_itemChangesSubscription;_vertical=true;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=false;_pageUpAndDown={enabled:false,delta:10};_effectRef;_typeahead;_skipPredicateFn=n=>n.disabled;constructor(n,e){this._items=n,n instanceof ds?this._itemChangesSubscription=n.changes.subscribe(t=>this._itemsChanged(t.toArray())):Dr$1(n)&&(this._effectRef=jc(()=>this._itemsChanged(n()),{injector:e}));}tabOut=new le$1;change=new le$1;skipPredicate(n){return this._skipPredicateFn=n,this}withWrap(n=true){return this._wrap=n,this}withVerticalOrientation(n=true){return this._vertical=n,this}withHorizontalOrientation(n){return this._horizontal=n,this}withAllowedModifierKeys(n){return this._allowedModifierKeys=n,this}withTypeAhead(n=200){this._typeaheadSubscription.unsubscribe();let e=this._getItemsArray();return this._typeahead=new Ft(e,{debounceInterval:typeof n=="number"?n:void 0,skipPredicate:t=>this._skipPredicateFn(t)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(t=>{this.setActiveItem(t);}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(n=true){return this._homeAndEnd=n,this}withPageUpDown(n=true,e=10){return this._pageUpAndDown={enabled:n,delta:e},this}setActiveItem(n){let e=this._activeItem();this.updateActiveItem(n),this._activeItem()!==e&&this.change.next(this._activeItemIndex());}onKeydown(n){let e=n.keyCode,i=["altKey","ctrlKey","metaKey","shiftKey"].every(r=>!n[r]||this._allowedModifierKeys.indexOf(r)>-1);switch(e){case 9:this.tabOut.next();return;case 40:if(this._vertical&&i){this.setNextItemActive();break}else return;case 38:if(this._vertical&&i){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&i){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&i){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&i){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&i){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&i){let r=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(r>0?r:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&i){let r=this._activeItemIndex()+this._pageUpAndDown.delta,s=this._getItemsArray().length;this._setActiveItemByIndex(r<s?r:s-1,-1);break}else return;default:(i||ge(n,"shiftKey"))&&this._typeahead?.handleKey(n);return}this._typeahead?.reset(),n.preventDefault();}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return !!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1);}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1);}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1);}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1);}updateActiveItem(n){let e=this._getItemsArray(),t=typeof n=="number"?n:e.indexOf(n),i=e[t];this._activeItem.set(i??null),this._activeItemIndex.set(t),this._typeahead?.setCurrentSelectedItemIndex(t);}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete();}_setActiveItemByDelta(n){this._wrap?this._setActiveInWrapMode(n):this._setActiveInDefaultMode(n);}_setActiveInWrapMode(n){let e=this._getItemsArray();for(let t=1;t<=e.length;t++){let i=(this._activeItemIndex()+n*t+e.length)%e.length,r=e[i];if(!this._skipPredicateFn(r)){this.setActiveItem(i);return}}}_setActiveInDefaultMode(n){this._setActiveItemByIndex(this._activeItemIndex()+n,n);}_setActiveItemByIndex(n,e){let t=this._getItemsArray();if(t[n]){for(;this._skipPredicateFn(t[n]);)if(n+=e,!t[n])return;this.setActiveItem(n);}}_getItemsArray(){return Dr$1(this._items)?this._items():this._items instanceof ds?this._items.toArray():this._items}_itemsChanged(n){this._typeahead?.setItems(n);let e=this._activeItem();if(e){let t=n.indexOf(e);t>-1&&t!==this._activeItemIndex()&&(this._activeItemIndex.set(t),this._typeahead?.setCurrentSelectedItemIndex(t));}}};var ot=class extends Pt{setActiveItem(n){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(n),this.activeItem&&this.activeItem.setActiveStyles();}};var to=new Map,ie=class o{_appId=y(mr$1);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(n,e=false){this._appId!=="ng"&&(n+=this._appId);let t=to.get(n);return t===void 0?t=0:t++,to.set(n,t),`${n}${e?o._infix+"-":""}${t}`}static \u0275fac=function(e){return new(e||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})};var Ie;function no(){if(Ie==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return Ie=false,Ie;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)Ie=true;else {let o=Element.prototype.scrollTo;o?Ie=!/\{\s*\[native code\]\s*\}/.test(o.toString()):Ie=false;}}return Ie}function Mn(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var We,io=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function Dn(){if(We)return We;if(typeof document!="object"||!document)return We=new Set(io),We;let o=document.createElement("input");return We=new Set(io.filter(n=>(o.setAttribute("type",n),o.type===n))),We}var vr=new I("MATERIAL_ANIMATIONS"),oo=null;function yr(){return y(vr,{optional:true})?.animationsDisabled||y(hD,{optional:true})==="NoopAnimations"?"di-disabled":(oo??=y(wn).matchMedia("(prefers-reduced-motion)").matches,oo?"reduced-motion":"enabled")}function le(){return yr()!=="enabled"}function L(o){return o==null?"":typeof o=="string"?o:`${o}px`}function Ue(o){return o!=null&&`${o}`!="false"}var pe=(function(o){return o[o.FADING_IN=0]="FADING_IN",o[o.VISIBLE=1]="VISIBLE",o[o.FADING_OUT=2]="FADING_OUT",o[o.HIDDEN=3]="HIDDEN",o})(pe||{}),Rn=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=pe.HIDDEN;constructor(n,e,t,i=false){this._renderer=n,this.element=e,this.config=t,this._animationForciblyDisabledThroughCss=i;}fadeOut(){this._renderer.fadeOutRipple(this);}},ao=je({passive:true,capture:true}),On=class{_events=new Map;addHandler(n,e,t,i){let r=this._events.get(e);if(r){let s=r.get(t);s?s.add(i):r.set(t,new Set([i]));}else this._events.set(e,new Map([[t,new Set([i])]])),n.runOutsideAngular(()=>{document.addEventListener(e,this._delegateEventHandler,ao);});}removeHandler(n,e,t){let i=this._events.get(n);if(!i)return;let r=i.get(e);r&&(r.delete(t),r.size===0&&i.delete(e),i.size===0&&(this._events.delete(n),document.removeEventListener(n,this._delegateEventHandler,ao)));}_delegateEventHandler=n=>{let e=Z(n);e&&this._events.get(n.type)?.forEach((t,i)=>{(i===e||i.contains(e))&&t.forEach(r=>r.handleEvent(n));});}},rt={enterDuration:225,exitDuration:150},xr=800,so=je({passive:true,capture:true}),lo=["mousedown","touchstart"],co=["mouseup","mouseleave","touchend","touchcancel"],kr=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(t,i){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2})}return o})(),at=class o{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=false;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=false;_containerRect=null;static _eventManager=new On;constructor(n,e,t,i,r){this._target=n,this._ngZone=e,this._platform=i,i.isBrowser&&(this._containerElement=he(t)),r&&r.get(se).load(kr);}fadeInRipple(n,e,t={}){let i=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),r=B$1(B$1({},rt),t.animation);t.centered&&(n=i.left+i.width/2,e=i.top+i.height/2);let s=t.radius||wr(n,e,i),l=n-i.left,m=e-i.top,f=r.enterDuration,h=document.createElement("div");h.classList.add("mat-ripple-element"),h.style.left=`${l-s}px`,h.style.top=`${m-s}px`,h.style.height=`${s*2}px`,h.style.width=`${s*2}px`,t.color!=null&&(h.style.backgroundColor=t.color),h.style.transitionDuration=`${f}ms`,this._containerElement.appendChild(h);let x=window.getComputedStyle(h),G=x.transitionProperty,X=x.transitionDuration,H=G==="none"||X==="0s"||X==="0s, 0s"||i.width===0&&i.height===0,z=new Rn(this,h,t,H);h.style.transform="scale3d(1, 1, 1)",z.state=pe.FADING_IN,t.persistent||(this._mostRecentTransientRipple=z);let Me=null;return !H&&(f||r.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let ni=()=>{Me&&(Me.fallbackTimer=null),clearTimeout(ii),this._finishRippleTransition(z);},nn=()=>this._destroyRipple(z),ii=setTimeout(nn,f+100);h.addEventListener("transitionend",ni),h.addEventListener("transitioncancel",nn),Me={onTransitionEnd:ni,onTransitionCancel:nn,fallbackTimer:ii};}),this._activeRipples.set(z,Me),(H||!f)&&this._finishRippleTransition(z),z}fadeOutRipple(n){if(n.state===pe.FADING_OUT||n.state===pe.HIDDEN)return;let e=n.element,t=B$1(B$1({},rt),n.config.animation);e.style.transitionDuration=`${t.exitDuration}ms`,e.style.opacity="0",n.state=pe.FADING_OUT,(n._animationForciblyDisabledThroughCss||!t.exitDuration)&&this._finishRippleTransition(n);}fadeOutAll(){this._getActiveRipples().forEach(n=>n.fadeOut());}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(n=>{n.config.persistent||n.fadeOut();});}setupTriggerEvents(n){let e=he(n);!this._platform.isBrowser||!e||e===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=e,lo.forEach(t=>{o._eventManager.addHandler(this._ngZone,t,e,this);}));}handleEvent(n){n.type==="mousedown"?this._onMousedown(n):n.type==="touchstart"?this._onTouchStart(n):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{co.forEach(e=>{this._triggerElement.addEventListener(e,this,so);});}),this._pointerUpEventsRegistered=true);}_finishRippleTransition(n){n.state===pe.FADING_IN?this._startFadeOutTransition(n):n.state===pe.FADING_OUT&&this._destroyRipple(n);}_startFadeOutTransition(n){let e=n===this._mostRecentTransientRipple,{persistent:t}=n.config;n.state=pe.VISIBLE,!t&&(!e||!this._isPointerDown)&&n.fadeOut();}_destroyRipple(n){let e=this._activeRipples.get(n)??null;this._activeRipples.delete(n),this._activeRipples.size||(this._containerRect=null),n===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),n.state=pe.HIDDEN,e!==null&&(n.element.removeEventListener("transitionend",e.onTransitionEnd),n.element.removeEventListener("transitioncancel",e.onTransitionCancel),e.fallbackTimer!==null&&clearTimeout(e.fallbackTimer)),n.element.remove();}_onMousedown(n){let e=et(n),t=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+xr;!this._target.rippleDisabled&&!e&&!t&&(this._isPointerDown=true,this.fadeInRipple(n.clientX,n.clientY,this._target.rippleConfig));}_onTouchStart(n){if(!this._target.rippleDisabled&&!tt(n)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=true;let e=n.changedTouches;if(e)for(let t=0;t<e.length;t++)this.fadeInRipple(e[t].clientX,e[t].clientY,this._target.rippleConfig);}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=false,this._getActiveRipples().forEach(n=>{let e=n.state===pe.VISIBLE||n.config.terminateOnPointerUp&&n.state===pe.FADING_IN;!n.config.persistent&&e&&n.fadeOut();}));}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let n=this._triggerElement;n&&(lo.forEach(e=>o._eventManager.removeHandler(e,n,this)),this._pointerUpEventsRegistered&&(co.forEach(e=>n.removeEventListener(e,this,so)),this._pointerUpEventsRegistered=false));}};function wr(o,n,e){let t=Math.max(Math.abs(o-e.left),Math.abs(o-e.right)),i=Math.max(Math.abs(n-e.top),Math.abs(n-e.bottom));return Math.sqrt(t*t+i*i)}var Tn=new I("mat-ripple-global-options"),Nt=(()=>{class o{_elementRef=y(xt);_animationsDisabled=le();color;unbounded=false;centered=false;radius=0;animation;get disabled(){return this._disabled}set disabled(e){e&&this.fadeOutAllNonPersistent(),this._disabled=e,this._setupTriggerEventsIfEnabled();}_disabled=false;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(e){this._trigger=e,this._setupTriggerEventsIfEnabled();}_trigger;_rippleRenderer;_globalOptions;_isInitialized=false;constructor(){let e=y(oe$1),t=y(N),i=y(Tn,{optional:true}),r=y(re);this._globalOptions=i||{},this._rippleRenderer=new at(this,e,this._elementRef,t,r);}ngOnInit(){this._isInitialized=true,this._setupTriggerEventsIfEnabled();}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents();}fadeOutAll(){this._rippleRenderer.fadeOutAll();}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent();}get rippleConfig(){return {centered:this.centered,radius:this.radius,color:this.color,animation:B$1(B$1(B$1({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger);}launch(e,t=0,i){return typeof e=="number"?this._rippleRenderer.fadeInRipple(e,t,B$1(B$1({},this.rippleConfig),i)):this._rippleRenderer.fadeInRipple(0,0,B$1(B$1({},this.rippleConfig),e))}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(t,i){t&2&&Wg("mat-ripple-unbounded",i.unbounded);},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return o})();var Cr={capture:true},Er=["focus","mousedown","mouseenter","touchstart"],An="mat-ripple-loader-uninitialized",In="mat-ripple-loader-class-name",mo="mat-ripple-loader-centered",Lt="mat-ripple-loader-disabled",uo=(()=>{class o{_document=y($);_animationsDisabled=le();_globalRippleOptions=y(Tn,{optional:true});_platform=y(N);_ngZone=y(oe$1);_injector=y(re);_eventCleanups;_hosts=new Map;constructor(){let e=y(Rn$1).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>Er.map(t=>e.listen(this._document,t,this._onInteraction,Cr)));}ngOnDestroy(){let e=this._hosts.keys();for(let t of e)this.destroyRipple(t);this._eventCleanups.forEach(t=>t());}configureRipple(e,t){e.setAttribute(An,this._globalRippleOptions?.namespace??""),(t.className||!e.hasAttribute(In))&&e.setAttribute(In,t.className||""),t.centered&&e.setAttribute(mo,""),t.disabled&&e.setAttribute(Lt,"");}setDisabled(e,t){let i=this._hosts.get(e);i?(i.target.rippleDisabled=t,!t&&!i.hasSetUpEvents&&(i.hasSetUpEvents=true,i.renderer.setupTriggerEvents(e))):t?e.setAttribute(Lt,""):e.removeAttribute(Lt);}_onInteraction=e=>{let t=Z(e);if(t instanceof HTMLElement){let i=t.closest(`[${An}="${this._globalRippleOptions?.namespace??""}"]`);i&&this._createRipple(i);}};_createRipple(e){if(!this._document||this._hosts.has(e))return;e.querySelector(".mat-ripple")?.remove();let t=this._document.createElement("span");t.classList.add("mat-ripple",e.getAttribute(In)),e.append(t);let i=this._globalRippleOptions,r=this._animationsDisabled?0:i?.animation?.enterDuration??rt.enterDuration,s=this._animationsDisabled?0:i?.animation?.exitDuration??rt.exitDuration,l={rippleDisabled:this._animationsDisabled||i?.disabled||e.hasAttribute(Lt),rippleConfig:{centered:e.hasAttribute(mo),terminateOnPointerUp:i?.terminateOnPointerUp,animation:{enterDuration:r,exitDuration:s}}},m=new at(l,this._ngZone,t,this._platform,this._injector),f=!l.rippleDisabled;f&&m.setupTriggerEvents(e),this._hosts.set(e,{target:l,renderer:m,hasSetUpEvents:f}),e.removeAttribute(An);}destroyRipple(e){let t=this._hosts.get(e);t&&(t.renderer._removeTriggerEvents(),this._hosts.delete(e));}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var Ye=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["structural-styles"]],decls:0,vars:0,template:function(t,i){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--mat-focus-indicator-display, none);
  border-width: var(--mat-focus-indicator-border-width, 3px);
  border-style: var(--mat-focus-indicator-border-style, solid);
  border-color: var(--mat-focus-indicator-border-color, transparent);
  border-radius: var(--mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --mat-focus-indicator-display: block;
    --mat-focus-indicator-fallback-border-style: none;
  }
}
`],encapsulation:2})}return o})();var Sr=new I("MAT_BUTTON_CONFIG");function ho(o){return o==null?void 0:lb(o)}var fo=(()=>{class o{_elementRef=y(xt);_ngZone=y(oe$1);_animationsDisabled=le();_config=y(Sr,{optional:true});_focusMonitor=y(yn);_cleanupClick;_renderer=y(Mo$1);_rippleLoader=y(uo);_isAnchor;_isFab=false;color;get disableRipple(){return this._disableRipple}set disableRipple(e){this._disableRipple=e,this._updateRippleDisabled();}_disableRipple=false;get disabled(){return this._disabled}set disabled(e){this._disabled=e,this._updateRippleDisabled();}_disabled=false;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(e){this.tabIndex=e;}showProgress=_B(false,{transform:ub});constructor(){y(se).load(Ye);let e=this._elementRef.nativeElement;this._isAnchor=e.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??false,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(e,{className:"mat-mdc-button-ripple"});}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,true),this._isAnchor&&this._setupAsAnchor();}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);}focus(e="program",t){e?this._focusMonitor.focusVia(this._elementRef.nativeElement,e,t):this._elementRef.nativeElement.focus(t);}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?true:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:true}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled);}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation());}));}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,hostAttrs:[1,"mat-mdc-button-base"],hostVars:15,hostBindings:function(t,i){t&2&&(Mg("disabled",i._getDisabledAttribute())("aria-disabled",i._getAriaDisabled())("tabindex",i._getTabIndex()),XC(i.color?"mat-"+i.color:""),Wg("mat-mdc-button-progress-indicator-shown",i.showProgress())("mat-mdc-button-disabled",i.disabled)("mat-mdc-button-disabled-interactive",i.disabledInteractive)("mat-unthemed",!i.color)("_mat-animation-noopable",i._animationsDisabled));},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",ub],disabled:[2,"disabled","disabled",ub],ariaDisabled:[2,"aria-disabled","ariaDisabled",ub],disabledInteractive:[2,"disabledInteractive","disabledInteractive",ub],tabIndex:[2,"tabIndex","tabIndex",ho],_tabindex:[2,"tabindex","_tabindex",ho],showProgress:[1,"showProgress"]}})}return o})();var Mr=new I("cdk-dir-doc",{providedIn:"root",factory:()=>y($)}),Dr=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function Fn(o){let n=o?.toLowerCase()||"";return n==="auto"&&typeof navigator<"u"&&navigator?.language?Dr.test(navigator.language)?"rtl":"ltr":n==="rtl"?"rtl":"ltr"}var xe=(()=>{class o{get value(){return this.valueSignal()}valueSignal=qe("ltr");change=new Ct;constructor(){let e=y(Mr,{optional:true});if(e){let t=e.body?e.body.dir:null,i=e.documentElement?e.documentElement.dir:null;this.valueSignal.set(Fn(t||i||"ltr"));}}ngOnDestroy(){this.change.complete();}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var po=(()=>{class o{_isInitialized=false;_rawDir="";change=new Ct;get dir(){return this.valueSignal()}set dir(e){let t=this.valueSignal();this.valueSignal.set(Fn(e)),this._rawDir=e,t!==this.valueSignal()&&this._isInitialized&&this.change.emit(this.valueSignal());}get value(){return this.dir}valueSignal=qe("ltr");ngAfterContentInit(){this._isInitialized=true;}ngOnDestroy(){this.change.complete();}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["","dir",""]],hostVars:1,hostBindings:function(t,i){t&2&&Mg("dir",i._rawDir);},inputs:{dir:"dir"},outputs:{change:"dirChange"},exportAs:["dir"],features:[IT([{provide:xe,useExisting:o}])]})}return o})(),B=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({})}return o})();var Bt=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[B]})}return o})();var Or=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]],[["","progressIndicator",""]]],Tr=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]","[progressIndicator]"];function Ar(o,n){o&1&&(Il(0,"div",2),PC(1,3),wl());}var bo=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),_o=(()=>{class o extends fo{get appearance(){return this._appearance}set appearance(e){this.setAppearance(e||this._config?.defaultAppearance||"text");}_appearance=null;constructor(){super();let e=Ir(this._elementRef.nativeElement);e&&this.setAppearance(e);}setAppearance(e){if(e===this._appearance)return;let t=this._elementRef.nativeElement.classList,i=this._appearance?bo.get(this._appearance):null,r=bo.get(e);i&&t.remove(...i),t.add(...r),this._appearance=e;}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[wg],ngContentSelectors:Tr,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(t,i){t&1&&(FC(Or),Ag(0,"span",0),PC(1),Il(2,"span",1),PC(3,1),wl(),PC(4,2),yC(5,Ar,2,0,"div",2),Ag(6,"span",3)(7,"span",4)),t&2&&(Wg("mdc-button__ripple",!i._isFab)("mdc-fab__ripple",i._isFab),wI(5),vC(i.showProgress()?5:-1));},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--mat-button-text-horizontal-padding, 12px);
  height: var(--mat-button-text-container-height, 40px);
  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-text-label-text-transform);
  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-text-touch-target-size, 48px);
  display: var(--mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-filled-container-height, 40px);
  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-filled-label-text-transform);
  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-filled-touch-target-size, 48px);
  display: var(--mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));
  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-unelevated-button .mat-mdc-button-progress-indicator-container {
  --mat-progress-spinner-active-indicator-color: var(--mat-button-filled-progress-active-indicator-color, var(--mat-sys-on-primary));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));
  height: var(--mat-button-protected-container-height, 40px);
  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-protected-label-text-transform);
  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-protected-touch-target-size, 48px);
  display: var(--mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));
  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-outlined-container-height, 40px);
  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-outlined-label-text-transform);
  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));
  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));
  border-width: var(--mat-button-outlined-outline-width, 1px);
  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-outlined-touch-target-size, 48px);
  display: var(--mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));
  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-tonal-container-height, 40px);
  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-tonal-label-text-transform);
  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-tonal-touch-target-size, 48px);
  display: var(--mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);
}

.mat-mdc-button-progress-indicator-container {
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.mat-mdc-button-progress-indicator-shown mat-icon,
.mat-mdc-button-progress-indicator-shown [matButtonIcon],
.mat-mdc-button-progress-indicator-shown .mdc-button__label {
  visibility: hidden;
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2})}return o})();function Ir(o){return o.hasAttribute("mat-raised-button")?"elevated":o.hasAttribute("mat-stroked-button")?"outlined":o.hasAttribute("mat-flat-button")?"filled":o.hasAttribute("mat-button")?"text":null}var go=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[Bt,B]})}return o})();var Pr=["*"],vo=(()=>{class o{labelPosition="after";static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["","mat-internal-form-field",""]],hostAttrs:[1,"mdc-form-field","mat-internal-form-field"],hostVars:2,hostBindings:function(t,i){t&2&&Wg("mdc-form-field--align-end",i.labelPosition==="before");},inputs:{labelPosition:"labelPosition"},ngContentSelectors:Pr,decls:1,vars:0,template:function(t,i){t&1&&(FC(),PC(0));},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})}return o})();var Nr=["input"],Lr=["label"],Br=["*"],Pn={color:"accent",clickAction:"check-indeterminate",disabledInteractive:false},zr=new I("mat-checkbox-default-options",{providedIn:"root",factory:()=>Pn}),oe=(function(o){return o[o.Init=0]="Init",o[o.Checked=1]="Checked",o[o.Unchecked=2]="Unchecked",o[o.Indeterminate=3]="Indeterminate",o})(oe||{}),Nn=class{source;checked},Ln=(()=>{class o{_elementRef=y(xt);_changeDetectorRef=y(xm);_ngZone=y(oe$1);_animationsDisabled=le();_options=y(zr,{optional:true});focus(){this._inputElement.nativeElement.focus();}_createChangeEvent(e){let t=new Nn;return t.source=this,t.checked=e,t}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:"mdc-checkbox--anim-unchecked-checked",uncheckedToIndeterminate:"mdc-checkbox--anim-unchecked-indeterminate",checkedToUnchecked:"mdc-checkbox--anim-checked-unchecked",checkedToIndeterminate:"mdc-checkbox--anim-checked-indeterminate",indeterminateToChecked:"mdc-checkbox--anim-indeterminate-checked",indeterminateToUnchecked:"mdc-checkbox--anim-indeterminate-unchecked"};ariaLabel="";ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return `${this.id||this._uniqueId}-input`}required=false;labelPosition="after";name=null;change=new Ct;indeterminateChange=new Ct;value;disableRipple=false;_inputElement;_labelElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass="";_currentCheckState=oe.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){y(se).load(Ye);let e=y(new vm("tabindex"),{optional:true});this._options=this._options||Pn,this.color=this._options.color||Pn.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=y(ie).getId("mat-mdc-checkbox-"),this.disabledInteractive=this._options?.disabledInteractive??false;}ngOnChanges(e){e.required&&this._validatorChangeFn();}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate);}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck());}_checked=false;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck());}_disabled=false;get indeterminate(){return this._indeterminate()}set indeterminate(e){let t=e!=this._indeterminate();this._indeterminate.set(e),t&&(e?this._transitionCheckState(oe.Indeterminate):this._transitionCheckState(this.checked?oe.Checked:oe.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e);}_indeterminate=qe(false);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges();}writeValue(e){this.checked=!!e;}registerOnChange(e){this._controlValueAccessorChangeFn=e;}registerOnTouched(e){this._onTouched=e;}setDisabledState(e){this.disabled=e;}validate(e){return this.required&&e.value!==true?{required:true}:null}registerOnValidatorChange(e){this._validatorChangeFn=e;}_transitionCheckState(e){let t=this._currentCheckState,i=this._getAnimationTargetElement();if(!(t===e||!i)&&(this._currentAnimationClass&&i.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(t,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){i.classList.add(this._currentAnimationClass);let r=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{i.classList.remove(r);},1e3);});}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked);}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked);}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!=="noop"?(this.indeterminate&&e!=="check"&&Promise.resolve().then(()=>{this._indeterminate.set(false),this.indeterminateChange.emit(false);}),this._checked=!this._checked,this._transitionCheckState(this._checked?oe.Checked:oe.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e==="noop")&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate);}_onInteractionEvent(e){e.stopPropagation();}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck();});}_getAnimationClassForCheckStateTransition(e,t){if(this._animationsDisabled)return "";switch(e){case oe.Init:if(t===oe.Checked)return this._animationClasses.uncheckedToChecked;if(t==oe.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case oe.Unchecked:return t===oe.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case oe.Checked:return t===oe.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case oe.Indeterminate:return t===oe.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return ""}_syncIndeterminate(e){let t=this._inputElement;t&&(t.nativeElement.indeterminate=e);}_onInputClick(){this._handleInputClick();}_onTouchTargetClick(){this._handleInputClick(),this.disabled||this._inputElement.nativeElement.focus();}_preventBubblingFromLabel(e){e.target&&this._labelElement.nativeElement.contains(e.target)&&e.stopPropagation();}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["mat-checkbox"]],viewQuery:function(t,i){if(t&1&&Vg(Nr,5)(Lr,5),t&2){let r;jC(r=BC())&&(i._inputElement=r.first),jC(r=BC())&&(i._labelElement=r.first);}},hostAttrs:[1,"mat-mdc-checkbox"],hostVars:16,hostBindings:function(t,i){t&2&&(kg("id",i.id),Mg("tabindex",null)("aria-label",null)("aria-labelledby",null),XC(i.color?"mat-"+i.color:"mat-accent"),Wg("_mat-animation-noopable",i._animationsDisabled)("mdc-checkbox--disabled",i.disabled)("mat-mdc-checkbox-disabled",i.disabled)("mat-mdc-checkbox-checked",i.checked)("mat-mdc-checkbox-disabled-interactive",i.disabledInteractive));},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],ariaExpanded:[2,"aria-expanded","ariaExpanded",ub],ariaControls:[0,"aria-controls","ariaControls"],ariaOwns:[0,"aria-owns","ariaOwns"],id:"id",required:[2,"required","required",ub],labelPosition:"labelPosition",name:"name",value:"value",disableRipple:[2,"disableRipple","disableRipple",ub],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?void 0:lb(e)],color:"color",disabledInteractive:[2,"disabledInteractive","disabledInteractive",ub],checked:[2,"checked","checked",ub],disabled:[2,"disabled","disabled",ub],indeterminate:[2,"indeterminate","indeterminate",ub]},outputs:{change:"change",indeterminateChange:"indeterminateChange"},exportAs:["matCheckbox"],features:[IT([{provide:_,useExisting:Ai(()=>o),multi:true},{provide:O,useExisting:o,multi:true}]),_s],ngContentSelectors:Br,decls:15,vars:23,consts:[["checkbox",""],["input",""],["label",""],["mat-internal-form-field","",3,"click","labelPosition"],[1,"mdc-checkbox"],["aria-hidden","true",1,"mat-mdc-checkbox-touch-target",3,"click"],["type","checkbox",1,"mdc-checkbox__native-control",3,"blur","click","change","checked","indeterminate","disabled","id","required","tabIndex"],["aria-hidden","true",1,"mdc-checkbox__ripple"],["aria-hidden","true",1,"mdc-checkbox__background"],["focusable","false","viewBox","0 0 24 24",1,"mdc-checkbox__checkmark"],["fill","none","d","M1.73,12.91 8.1,19.28 22.79,4.59",1,"mdc-checkbox__checkmark-path"],[1,"mdc-checkbox__mixedmark"],["mat-ripple","","aria-hidden","true",1,"mat-mdc-checkbox-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-label",3,"for"]],template:function(t,i){if(t&1&&(FC(),Ts(0,"div",3),Pg("click",function(s){return i._preventBubblingFromLabel(s)}),Ts(1,"div",4,0)(3,"div",5),Pg("click",function(){return i._onTouchTargetClick()}),El(),Ts(4,"input",6,1),Pg("blur",function(){return i._onBlur()})("click",function(){return i._onInputClick()})("change",function(s){return i._onInteractionEvent(s)}),El(),xg(6,"div",7),Ts(7,"div",8),Hf(),Ts(8,"svg",9),xg(9,"path",10),El(),Uf(),xg(10,"div",11),El(),xg(11,"div",12),El(),Ts(12,"label",13,2),PC(14),El()()),t&2){let r=HC(2);Ng("labelPosition",i.labelPosition),wI(4),Wg("mdc-checkbox--selected",i.checked),Ng("checked",i.checked)("indeterminate",i.indeterminate)("disabled",i.disabled&&!i.disabledInteractive)("id",i.inputId)("required",i.required)("tabIndex",i.disabled&&!i.disabledInteractive?-1:i.tabIndex),Mg("aria-label",i.ariaLabel||null)("aria-labelledby",i.ariaLabelledby)("aria-describedby",i.ariaDescribedby)("aria-checked",i.indeterminate?"mixed":null)("aria-controls",i.ariaControls)("aria-disabled",i.disabled&&i.disabledInteractive?true:null)("aria-expanded",i.ariaExpanded)("aria-owns",i.ariaOwns)("name",i.name)("value",i.value),wI(7),Ng("matRippleTrigger",r)("matRippleDisabled",i.disableRipple||i.disabled)("matRippleCentered",true),wI(),Ng("for",i.inputId);}},dependencies:[Nt,vo],styles:[`.mdc-checkbox {
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
  padding: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  margin: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
}
.mdc-checkbox:hover > .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-unselected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {
  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-unselected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-unselected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--mat-checkbox-selected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control {
  position: absolute;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
  width: var(--mat-checkbox-state-layer-size, 40px);
  height: var(--mat-checkbox-state-layer-size, 40px);
  top: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
  right: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
  left: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);
}

.mdc-checkbox--disabled {
  cursor: default;
  pointer-events: none;
}

.mdc-checkbox__background {
  display: inline-flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 2px;
  background-color: transparent;
  pointer-events: none;
  will-change: background-color, border-color;
  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  border-color: var(--mat-checkbox-unselected-icon-color, var(--mat-sys-on-surface-variant));
  top: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  left: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);
}

.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));
  background-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));
}

.mdc-checkbox--disabled .mdc-checkbox__background {
  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}
@media (forced-colors: active) {
  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-unselected-hover-icon-color, var(--mat-sys-on-surface));
  background-color: transparent;
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));
  background-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));
}

.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-unselected-focus-icon-color, var(--mat-sys-on-surface));
}

.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));
  background-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));
}

.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
    border-color: GrayText;
  }
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}

.mdc-checkbox__checkmark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);
  color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__checkmark {
    color: CanvasText;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
  color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
    color: GrayText;
  }
}

.mdc-checkbox__checkmark-path {
  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);
  stroke: currentColor;
  stroke-width: 3.12px;
  stroke-dashoffset: 29.7833385;
  stroke-dasharray: 29.7833385;
}

.mdc-checkbox__mixedmark {
  width: 100%;
  height: 0;
  transform: scaleX(0) rotate(0deg);
  border-width: 1px;
  border-style: solid;
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
  border-color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__mixedmark {
    margin: 0 1px;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
  border-color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
    border-color: GrayText;
  }
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,
.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,
.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,
.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {
  animation-duration: 180ms;
  animation-timing-function: linear;
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;
  transition: none;
}

.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;
  transition: none;
}
.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;
  transition: none;
}
.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;
  transition: none;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {
  stroke-dashoffset: 0;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);
  opacity: 1;
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(-45deg);
}

.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(0deg);
  opacity: 1;
}

@keyframes mdc-checkbox-unchecked-checked-checkmark-path {
  0%, 50% {
    stroke-dashoffset: 29.7833385;
  }
  50% {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
  0%, 68.2% {
    transform: scaleX(0);
  }
  68.2% {
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes mdc-checkbox-checked-unchecked-checkmark-path {
  from {
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    opacity: 1;
    stroke-dashoffset: 0;
  }
  to {
    opacity: 0;
    stroke-dashoffset: -29.7833385;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-checkmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(45deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-checkmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(45deg);
    opacity: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: rotate(0deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(315deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
  0% {
    animation-timing-function: linear;
    transform: scaleX(1);
    opacity: 1;
  }
  32.8%, 100% {
    transform: scaleX(0);
    opacity: 0;
  }
}
.mat-mdc-checkbox {
  display: inline-block;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-checkbox label {
  cursor: pointer;
}
.mat-mdc-checkbox .mat-internal-form-field {
  color: var(--mat-checkbox-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-checkbox-label-text-font, var(--mat-sys-body-medium-font));
  line-height: var(--mat-checkbox-label-text-line-height, var(--mat-sys-body-medium-line-height));
  font-size: var(--mat-checkbox-label-text-size, var(--mat-sys-body-medium-size));
  letter-spacing: var(--mat-checkbox-label-text-tracking, var(--mat-sys-body-medium-tracking));
  font-weight: var(--mat-checkbox-label-text-weight, var(--mat-sys-body-medium-weight));
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
  cursor: default;
  color: var(--mat-checkbox-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
    color: GrayText;
  }
}
.mat-mdc-checkbox label:empty {
  display: none;
}
.mat-mdc-checkbox .mdc-checkbox__ripple {
  opacity: 0;
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple,
.mdc-checkbox__ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),
.mdc-checkbox__ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-mdc-checkbox-ripple .mat-ripple-element {
  opacity: 0.1;
}

.mat-mdc-checkbox-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--mat-checkbox-touch-target-size, 48px);
  width: var(--mat-checkbox-touch-target-size, 48px);
  transform: translate(-50%, -50%);
  display: var(--mat-checkbox-touch-target-display, block);
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {
  border-radius: 50%;
}

.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})}return o})(),yo=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[Ln,B]})}return o})();var Bn=class{_box;_destroyed=new le$1;_resizeSubject=new le$1;_resizeObserver;_elementObservables=new Map;constructor(n){this._box=n,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)));}observe(n){return this._elementObservables.has(n)||this._elementObservables.set(n,new A(e=>{let t=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(n,{box:this._box}),()=>{this._resizeObserver?.unobserve(n),t.unsubscribe(),this._elementObservables.delete(n);}}).pipe(Pt$1(e=>e.some(t=>t.target===n)),Tv({bufferSize:1,refCount:true}),Hd(this._destroyed))),this._elementObservables.get(n)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear();}},xo=(()=>{class o{_cleanupErrorListener;_observers=new Map;_ngZone=y(oe$1);constructor(){}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.();}observe(e,t){let i=t?.box||"content-box";return this._observers.has(i)||this._observers.set(i,new Bn(i)),this._observers.get(i).observe(e)}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var Hr=["notch"],jr=["*"],ko=["iconPrefixContainer"],wo=["textPrefixContainer"],Co=["iconSuffixContainer"],Eo=["textSuffixContainer"],Wr=["textField"],Ur=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],Yr=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function Kr(o,n){o&1&&xg(0,"span",21);}function Gr(o,n){if(o&1&&(Ts(0,"label",20),PC(1,1),yC(2,Kr,1,0,"span",21),El()),o&2){let e=OC(2);Ng("floating",e._shouldLabelFloat())("monitorResize",e._hasOutline())("id",e._labelId),Mg("for",e._control.disableAutomaticLabeling?null:e._control.id),wI(2),vC(!e.hideRequiredMarker&&e._control.required?2:-1);}}function Xr(o,n){if(o&1&&yC(0,Gr,3,5,"label",20),o&2){let e=OC();vC(e._hasFloatingLabel()?0:-1);}}function qr(o,n){o&1&&xg(0,"div",7);}function Zr(o,n){}function Qr(o,n){if(o&1&&Tg(0,Zr,0,0,"ng-template",13),o&2){OC(2);let e=HC(1);Ng("ngTemplateOutlet",e);}}function $r(o,n){if(o&1&&(Ts(0,"div",9),yC(1,Qr,1,1,null,13),El()),o&2){let e=OC();Ng("matFormFieldNotchedOutlineOpen",e._shouldLabelFloat()),wI(),vC(e._forceDisplayInfixLabel()?-1:1);}}function Jr(o,n){o&1&&(Ts(0,"div",10,2),PC(2,2),El());}function ea(o,n){o&1&&(Ts(0,"div",11,3),PC(2,3),El());}function ta(o,n){}function na(o,n){if(o&1&&Tg(0,ta,0,0,"ng-template",13),o&2){OC();let e=HC(1);Ng("ngTemplateOutlet",e);}}function ia(o,n){o&1&&(Ts(0,"div",14,4),PC(2,4),El());}function oa(o,n){o&1&&(Ts(0,"div",15,5),PC(2,5),El());}function ra(o,n){o&1&&xg(0,"div",16);}function aa(o,n){o&1&&(Ts(0,"div",18),PC(1,6),El());}function sa(o,n){if(o&1&&(Ts(0,"mat-hint",22),uT(1),El()),o&2){let e=OC(2);Ng("id",e._hintLabelId),wI(),Xg(e.hintLabel);}}function la(o,n){if(o&1&&(Ts(0,"div",19),yC(1,sa,2,2,"mat-hint",22),PC(2,7),xg(3,"div",23),PC(4,8),El()),o&2){let e=OC();wI(),vC(e.hintLabel?1:-1);}}var st=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["mat-label"]]})}return o})(),ca=new I("MatError");var zn=(()=>{class o{align="start";id=y(ie).getId("mat-mdc-hint-");static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(t,i){t&2&&(kg("id",i.id),Mg("align",null),Wg("mat-mdc-form-field-hint-end",i.align==="end"));},inputs:{align:"align",id:"id"}})}return o})(),da=new I("MatPrefix");var ma=new I("MatSuffix");var Ao=new I("FloatingLabelParent"),So=(()=>{class o{_elementRef=y(xt);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize();}_floating=false;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe();}_monitorResize=false;_resizeObserver=y(xo);_ngZone=y(oe$1);_parent=y(Ao);_resizeSubscription=new ee;ngOnDestroy(){this._resizeSubscription.unsubscribe();}getWidth(){return ua(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized());}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize());});}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(t,i){t&2&&Wg("mdc-floating-label--float-above",i.floating);},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return o})();function ua(o){let n=o;if(n.offsetParent!==null)return n.scrollWidth;let e=n.cloneNode(true);e.style.setProperty("position","absolute"),e.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(e);let t=e.scrollWidth;return e.remove(),t}var Mo="mdc-line-ripple--active",zt="mdc-line-ripple--deactivating",Do=(()=>{class o{_elementRef=y(xt);_cleanupTransitionEnd;constructor(){let e=y(oe$1),t=y(Mo$1);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=t.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd);});}activate(){let e=this._elementRef.nativeElement.classList;e.remove(zt),e.add(Mo);}deactivate(){this._elementRef.nativeElement.classList.add(zt);}_handleTransitionEnd=e=>{let t=this._elementRef.nativeElement.classList,i=t.contains(zt);e.propertyName==="opacity"&&i&&t.remove(Mo,zt);};ngOnDestroy(){this._cleanupTransitionEnd();}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return o})(),Ro=(()=>{class o{_elementRef=y(xt);_ngZone=y(oe$1);open=false;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,t=e.querySelector(".mdc-floating-label");t?(e.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(t.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>t.style.transitionDuration="");}))):e.classList.add("mdc-notched-outline--no-label");}_setNotchWidth(e){let t=this._notch.nativeElement;!this.open||!e?t.style.width="":t.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`;}_setMaxWidth(e){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${e}px)`);}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(t,i){if(t&1&&Vg(Hr,5),t&2){let r;jC(r=BC())&&(i._notch=r.first);}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(t,i){t&2&&Wg("mdc-notched-outline--notched",i.open);},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},ngContentSelectors:jr,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(t,i){t&1&&(FC(),Ag(0,"div",1),Il(1,"div",2,0),PC(3),wl(),Ag(4,"div",3));},encapsulation:2})}return o})(),lt=(()=>{class o{value=null;stateChanges;id;placeholder;ngControl=null;focused=false;empty=false;shouldLabelFloat=false;required=false;disabled=false;errorState=false;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o})}return o})();var ct=new I("MatFormField"),ha=new I("MAT_FORM_FIELD_DEFAULT_OPTIONS"),Oo="fill",fa="auto",To="fixed",pa="translateY(-50%)",Vt=(()=>{class o{_elementRef=y(xt);_changeDetectorRef=y(xm);_platform=y(N);_idGenerator=y(ie);_ngZone=y(oe$1);_defaults=y(ha,{optional:true});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=MB("iconPrefixContainer");_textPrefixContainerSignal=MB("textPrefixContainer");_iconSuffixContainerSignal=MB("iconSuffixContainer");_textSuffixContainerSignal=MB("textSuffixContainer");_prefixSuffixContainers=mt$1(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=NB(st);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=Ue(e);}_hideRequiredMarker=false;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||fa}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck());}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let t=e||this._defaults?.appearance||Oo;this._appearanceSignal.set(t);}_appearanceSignal=qe(Oo);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||To}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||To;}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints();}_hintLabel="";_hasIconPrefix=false;_hasTextPrefix=false;_hasIconSuffix=false;_hasTextSuffix=false;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e;}_destroyed=new le$1;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=le();constructor(){let e=this._defaults,t=y(xe);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),jc(()=>this._currentDirection=t.valueSignal()),this._syncOutlineLabelOffset();}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled");},300);}),this._changeDetectorRef.detectChanges();}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix();}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck();}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete();}getLabelId=mt$1(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always");}_initializeControl(e){let t=this._control,i="mat-mdc-form-field-type-";e&&this._elementRef.nativeElement.classList.remove(i+e.controlType),t.controlType&&this._elementRef.nativeElement.classList.add(i+t.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=t.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck();}),this._describedByChanges?.unsubscribe(),this._describedByChanges=t.stateChanges.pipe(_v([void 0,void 0]),de(()=>[t.errorState,t.userAriaDescribedBy]),wv(),Pt$1(([[r,s],[l,m]])=>r!==l||s!==m)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),t.ngControl&&t.ngControl.valueChanges&&(this._valueChanges=t.ngControl.valueChanges.pipe(Hd(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()));}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText);}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),pv(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck();});}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck();}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck();}),this._validateHints(),this._syncDescribedByIds();}_assertFormFieldControl(){this._control;}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=true,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=false,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",e),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",e);}_syncOutlineLabelOffset(){AB({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset());});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:"border-box"});}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())});}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return !this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=mt$1(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():false}_shouldForward(e){let t=this._control?this._control.ngControl:null;return t&&t[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth();}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());}_processHints(){this._validateHints(),this._syncDescribedByIds();}_validateHints(){this._hintChildren;}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&e.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let r=this._hintChildren?this._hintChildren.find(l=>l.align==="start"):null,s=this._hintChildren?this._hintChildren.find(l=>l.align==="end"):null;r?e.push(r.id):this._hintLabel&&e.push(this._hintLabelId),s&&e.push(s.id);}else this._errorChildren&&e.push(...this._errorChildren.map(r=>r.id));let t=this._control.describedByIds,i;if(t){let r=this._describedByIds||e;i=e.concat(t.filter(s=>s&&!r.includes(s)));}else i=e;this._control.setDescribedByIds(i),this._describedByIds=e;}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return ["",null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,t=this._textPrefixContainer?.nativeElement,i=this._iconSuffixContainer?.nativeElement,r=this._textSuffixContainer?.nativeElement,s=e?.getBoundingClientRect().width??0,l=t?.getBoundingClientRect().width??0,m=i?.getBoundingClientRect().width??0,f=r?.getBoundingClientRect().width??0,h=this._currentDirection==="rtl"?"-1":"1",x=`${s+l}px`,X=`calc(${h} * (${x} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,H=`var(--mat-mdc-form-field-label-transform, ${pa} translateX(${X}))`,z=s+l+m+f;return [H,z]}_writeOutlinedLabelStyles(e){if(e!==null){let[t,i]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=t),i!==null&&this._notchedOutline?._setMaxWidth(i);}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let t=e.getRootNode();return t&&t!==e}return document.documentElement.contains(e)}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["mat-form-field"]],contentQueries:function(t,i,r){if(t&1&&(Hg(r,i._labelChild,st,5),Bg(r,lt,5)(r,da,5)(r,ma,5)(r,ca,5)(r,zn,5)),t&2){VC();let s;jC(s=BC())&&(i._formFieldControl=s.first),jC(s=BC())&&(i._prefixChildren=s),jC(s=BC())&&(i._suffixChildren=s),jC(s=BC())&&(i._errorChildren=s),jC(s=BC())&&(i._hintChildren=s);}},viewQuery:function(t,i){if(t&1&&(Ug(i._iconPrefixContainerSignal,ko,5)(i._textPrefixContainerSignal,wo,5)(i._iconSuffixContainerSignal,Co,5)(i._textSuffixContainerSignal,Eo,5),Vg(Wr,5)(ko,5)(wo,5)(Co,5)(Eo,5)(So,5)(Ro,5)(Do,5)),t&2){VC(4);let r;jC(r=BC())&&(i._textField=r.first),jC(r=BC())&&(i._iconPrefixContainer=r.first),jC(r=BC())&&(i._textPrefixContainer=r.first),jC(r=BC())&&(i._iconSuffixContainer=r.first),jC(r=BC())&&(i._textSuffixContainer=r.first),jC(r=BC())&&(i._floatingLabel=r.first),jC(r=BC())&&(i._notchedOutline=r.first),jC(r=BC())&&(i._lineRipple=r.first);}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(t,i){t&2&&Wg("mat-mdc-form-field-label-always-float",i._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",i._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",i._hasIconSuffix)("mat-form-field-invalid",i._control.errorState)("mat-form-field-disabled",i._control.disabled)("mat-form-field-autofilled",i._control.autofilled)("mat-form-field-appearance-fill",i.appearance=="fill")("mat-form-field-appearance-outline",i.appearance=="outline")("mat-form-field-hide-placeholder",i._hasFloatingLabel()&&!i._shouldLabelFloat())("mat-primary",i.color!=="accent"&&i.color!=="warn")("mat-accent",i.color==="accent")("mat-warn",i.color==="warn")("ng-untouched",i._shouldForward("untouched"))("ng-touched",i._shouldForward("touched"))("ng-pristine",i._shouldForward("pristine"))("ng-dirty",i._shouldForward("dirty"))("ng-valid",i._shouldForward("valid"))("ng-invalid",i._shouldForward("invalid"))("ng-pending",i._shouldForward("pending"));},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[IT([{provide:ct,useExisting:o},{provide:Ao,useExisting:o}])],ngContentSelectors:Yr,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(t,i){if(t&1&&(FC(Ur),Tg(0,Xr,1,1,"ng-template",null,0,xT),Ts(2,"div",6,1),Pg("click",function(s){return i._control.onContainerClick(s)}),yC(4,qr,1,0,"div",7),Ts(5,"div",8),yC(6,$r,2,2,"div",9),yC(7,Jr,3,0,"div",10),yC(8,ea,3,0,"div",11),Ts(9,"div",12),yC(10,na,1,1,null,13),PC(11),El(),yC(12,ia,3,0,"div",14),yC(13,oa,3,0,"div",15),El(),yC(14,ra,1,0,"div",16),El(),Ts(15,"div",17),yC(16,aa,2,0,"div",18)(17,la,5,1,"div",19),El()),t&2){let r;wI(2),Wg("mdc-text-field--filled",!i._hasOutline())("mdc-text-field--outlined",i._hasOutline())("mdc-text-field--no-label",!i._hasFloatingLabel())("mdc-text-field--disabled",i._control.disabled)("mdc-text-field--invalid",i._control.errorState),wI(2),vC(!i._hasOutline()&&!i._control.disabled?4:-1),wI(2),vC(i._hasOutline()?6:-1),wI(),vC(i._hasIconPrefix?7:-1),wI(),vC(i._hasTextPrefix?8:-1),wI(2),vC(!i._hasOutline()||i._forceDisplayInfixLabel()?10:-1),wI(2),vC(i._hasTextSuffix?12:-1),wI(),vC(i._hasIconSuffix?13:-1),wI(),vC(i._hasOutline()?-1:14),wI(),Wg("mat-mdc-form-field-subscript-dynamic-size",i.subscriptSizing==="dynamic");let s=i._getSubscriptMessageType();wI(),vC((r=s)==="error"?16:r==="hint"?17:-1);}},dependencies:[So,Ro,Fb,Do,zn],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-filled-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));
  caret-color: var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
  border-top-right-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) {
  background-color: var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));
  font-size: var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));
  border-width: var(--mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error));
}
.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error));
}
.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error));
}

.mdc-line-ripple--active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--mat-form-field-container-height, 56px);
  padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--mat-form-field-error-text-color, var(--mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));
  line-height: var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));
  font-size: var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));
  letter-spacing: var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));
  font-weight: var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));
  font-weight: var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--mat-form-field-outlined-label-text-populated-size) * var(--mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2})}return o})();var Fe=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[qi,Vt,B]})}return o})();var _a=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(t,i){},styles:[`textarea.cdk-textarea-autosize {
  resize: none;
}

textarea.cdk-textarea-autosize-measuring {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: auto !important;
  overflow: hidden !important;
}

textarea.cdk-textarea-autosize-measuring-firefox {
  padding: 2px 0 !important;
  box-sizing: content-box !important;
  height: 0 !important;
}

@keyframes cdk-text-field-autofill-start { /*!*/ }
@keyframes cdk-text-field-autofill-end { /*!*/ }
.cdk-text-field-autofill-monitored:-webkit-autofill {
  animation: cdk-text-field-autofill-start 0s 1ms;
}

.cdk-text-field-autofill-monitored:not(:-webkit-autofill) {
  animation: cdk-text-field-autofill-end 0s 1ms;
}
`],encapsulation:2})}return o})(),ga={passive:true},Io=(()=>{class o{_platform=y(N);_ngZone=y(oe$1);_renderer=y(Rn$1).createRenderer(null,null);_styleLoader=y(se);_monitoredElements=new Map;monitor(e){if(!this._platform.isBrowser)return Et;this._styleLoader.load(_a);let t=he(e),i=this._monitoredElements.get(t);if(i)return i.subject;let r=new le$1,s="cdk-text-field-autofilled",l=f=>{f.animationName==="cdk-text-field-autofill-start"&&!t.classList.contains(s)?(t.classList.add(s),this._ngZone.run(()=>r.next({target:f.target,isAutofilled:true}))):f.animationName==="cdk-text-field-autofill-end"&&t.classList.contains(s)&&(t.classList.remove(s),this._ngZone.run(()=>r.next({target:f.target,isAutofilled:false})));},m=this._ngZone.runOutsideAngular(()=>(t.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(t,"animationstart",l,ga)));return this._monitoredElements.set(t,{subject:r,unlisten:m}),r}stopMonitoring(e){let t=he(e),i=this._monitoredElements.get(t);i&&(i.unlisten(),i.subject.complete(),t.classList.remove("cdk-text-field-autofill-monitored"),t.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(t));}ngOnDestroy(){this._monitoredElements.forEach((e,t)=>this.stopMonitoring(t));}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var Fo=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({})}return o})();var Ht=new I("");var Po=new I("MAT_INPUT_VALUE_ACCESSOR");var jt=(()=>{class o{isErrorState(e,t){return !!(e&&e.invalid&&(e.touched||t&&t.submitted))}isSignalErrorState(e){if(!e)return  false;let t=e().invalid(),i=e().touched();return t&&i}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var Ke=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=false;matcher;ngControl;formField;constructor(n,e,t,i,r){this._defaultMatcher=n,this._parentFormGroup=t,this._parentForm=i,this._stateChanges=r,e?Dr$1(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null;}updateErrorState(){let n=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==n&&(this.errorState=e,this._stateChanges.next());}_getCurrentErrorState(n){if(this.formField&&n?.isSignalErrorState)return n.isSignalErrorState(this.formField.field())??false;let e=this._parentFormGroup||this._parentForm,t=this.ngControl?this.ngControl.control:null;return n?.isErrorState(t,e)??false}};var xa=["button","checkbox","file","hidden","image","radio","range","reset","submit"],ka=new I("MAT_INPUT_CONFIG"),No=(()=>{class o{_elementRef=y(xt);_platform=y(N);ngControl=y(b,{optional:true,self:true});_autofillMonitor=y(Io);_ngZone=y(oe$1);_formField=y(ct,{optional:true});_renderer=y(Mo$1);_uid=y(ie).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=y(ka,{optional:true});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=false;_isNativeSelect=false;_isTextarea=false;_isInFormField=false;focused=false;stateChanges=new le$1;controlType="mat-input";autofilled=false;get disabled(){return this._disabled}set disabled(e){this._disabled=Ue(e),this.focused&&(this.focused=false,this.stateChanges.next());}_disabled=false;get id(){return this._id}set id(e){this._id=e||this._uid;}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(ye.required)??false}set required(e){this._required=Ue(e);}_required;get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&Dn().has(this._type)&&(this._elementRef.nativeElement.type=this._type);}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e;}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next());}get readonly(){return this._readonly}set readonly(e){this._readonly=Ue(e);}_readonly=false;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e;}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(e=>Dn().has(e));constructor(){let e=y(pi,{optional:true}),t=y(Ii,{optional:true}),i=y(jt),r=y(Po,{optional:true,self:true}),s=y(Ht,{optional:true,self:true}),l=this._elementRef.nativeElement,m=l.nodeName.toLowerCase();r?Dr$1(r.value)?this._signalBasedValueAccessor=r:this._inputValueAccessor=r:this._inputValueAccessor=l,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(l,"keyup",this._iOSKeyupListener);}),this._errorStateTracker=new Ke(i,s||this.ngControl,t,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=m==="select",this._isTextarea=m==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||false,this._isNativeSelect&&(this.controlType=l.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&jc(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next();});}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next();});}ngOnChanges(){this.stateChanges.next();}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.();}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder();}focus(e){this._elementRef.nativeElement.focus(e);}updateErrorState(){this._errorStateTracker.updateErrorState();}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let t=this._elementRef.nativeElement;t.type==="number"?(t.type="text",t.setSelectionRange(0,0),t.type="number"):t.setSelectionRange(0,0);}this.focused=e,this.stateChanges.next();}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next());}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let t=this._elementRef.nativeElement;this._previousPlaceholder=e,e?t.setAttribute("placeholder",e):t.removeAttribute("placeholder");}}_getPlaceholder(){return this.placeholder||null}_validateType(){xa.indexOf(this._type)>-1;}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return !this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,t=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&t&&t.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby");}onContainerClick(){this.focused||this.focus();}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let t=e.target;!t.value&&t.selectionStart===0&&t.selectionEnd===0&&(t.setSelectionRange(1,1),t.setSelectionRange(0,0));};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(t,i){t&1&&Pg("focus",function(){return i._focusChanged(true)})("blur",function(){return i._focusChanged(false)})("input",function(){return i._onInput()}),t&2&&(kg("id",i.id)("disabled",i.disabled&&!i.disabledInteractive)("required",i.required),Mg("name",i.name||null)("readonly",i._getReadonlyAttribute())("aria-disabled",i.disabled&&i.disabledInteractive?"true":null)("aria-invalid",i.empty&&i.required?null:i.errorState)("aria-required",i.required)("id",i.id),Wg("mat-input-server",i._isServer)("mat-mdc-form-field-textarea-control",i._isInFormField&&i._isTextarea)("mat-mdc-form-field-input-control",i._isInFormField)("mat-mdc-input-disabled-interactive",i.disabledInteractive)("mdc-text-field__input",i._isInFormField)("mat-mdc-native-select-inline",i._isInlineSelect()));},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",ub]},exportAs:["matInput"],features:[IT([{provide:lt,useExisting:o}]),_s]})}return o})(),Lo=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[Fe,Fe,Fo,B]})}return o})();var dt=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new le$1;bulk={select:n=>this._select(n),deselect:n=>this._deselect(n),setSelection:n=>this._setSelection(n)};constructor(n=false,e,t=true,i){this._multiple=n,this._emitChanges=t,this.compareWith=i,e&&e.length&&(n?e.forEach(r=>this._markSelected(r)):this._markSelected(e[0]),this._selectedToEmit.length=0);}select(...n){return this._select(n)}deselect(...n){return this._deselect(n)}setSelection(...n){return this._setSelection(n)}toggle(n){return this.isSelected(n)?this.deselect(n):this.select(n)}clear(n=true){this._unmarkAll();let e=this._hasQueuedChanges();return n&&this._emitChangeEvent(),e}isSelected(n){return this._selection.has(this._getConcreteValue(n))}isEmpty(){return this._selection.size===0}hasValue(){return !this.isEmpty()}sort(n){this._multiple&&this.selected&&this._selected.sort(n);}isMultipleSelection(){return this._multiple}_select(n){this._verifyValueAssignment(n),n.forEach(t=>this._markSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(n){this._verifyValueAssignment(n),n.forEach(t=>this._unmarkSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(n){this._verifyValueAssignment(n);let e=this.selected,t=new Set(n.map(r=>this._getConcreteValue(r)));n.forEach(r=>this._markSelected(r)),e.filter(r=>!t.has(this._getConcreteValue(r,t))).forEach(r=>this._unmarkSelected(r));let i=this._hasQueuedChanges();return this._emitChangeEvent(),i}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[]);}_markSelected(n){n=this._getConcreteValue(n),this.isSelected(n)||(this._multiple||this._unmarkAll(),this.isSelected(n)||this._selection.add(n),this._emitChanges&&this._selectedToEmit.push(n));}_unmarkSelected(n){n=this._getConcreteValue(n),this.isSelected(n)&&(this._selection.delete(n),this._emitChanges&&this._deselectedToEmit.push(n));}_unmarkAll(){this.isEmpty()||this._selection.forEach(n=>this._unmarkSelected(n));}_verifyValueAssignment(n){n.length>1&&this._multiple;}_hasQueuedChanges(){return !!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(n,e){if(this.compareWith){e=e??this._selection;for(let t of e)if(this.compareWith(n,t))return t;return n}else return n}};var Ea=20,Vn=(()=>{class o{_ngZone=y(oe$1);_platform=y(N);_renderer=y(Rn$1).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new le$1;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)));}deregister(e){let t=this.scrollContainers.get(e);t&&(t.unsubscribe(),this.scrollContainers.delete(e));}scrolled(e=Ea){return this._platform.isBrowser?new A(t=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let i=e>0?this._scrolled.pipe(hv(e)).subscribe(t):this._scrolled.subscribe(t);return this._scrolledCount++,()=>{i.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0);}}):Ca()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,t)=>this.deregister(t)),this._scrolled.complete();}ancestorScrolled(e,t){let i=this.getAncestorScrollContainers(e);return this.scrolled(t).pipe(Pt$1(r=>!r||i.indexOf(r)>-1))}getAncestorScrollContainers(e){let t=[];return this.scrollContainers.forEach((i,r)=>{this._targetContainsElement(r,e)&&t.push(r);}),t}_targetContainsElement(e,t){let i=he(t),r=e.getElementRef().nativeElement;do if(i==r)return  true;while(i=i.parentElement);return  false}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var Sa=20,Pe=(()=>{class o{_platform=y(N);_listeners;_viewportSize=null;_change=new le$1;_document=y($);constructor(){let e=y(oe$1),t=y(Rn$1).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let i=r=>this._change.next(r);this._listeners=[t.listen("window","resize",i),t.listen("window","orientationchange",i)];}this.change().subscribe(()=>this._viewportSize=null);});}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete();}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:t,height:i}=this.getViewportSize();return {top:e.top,left:e.left,bottom:e.top+i,right:e.left+t,height:i,width:t}}getViewportScrollPosition(){if(!this._platform.isBrowser)return {top:0,left:0};let e=this._document,t=this._getWindow(),i=e.documentElement,r=i.getBoundingClientRect(),s=-r.top||e.body?.scrollTop||t.scrollY||i.scrollTop||0,l=-r.left||e.body?.scrollLeft||t.scrollX||i.scrollLeft||0;return {top:s,left:l}}change(e=Sa){return e>0?this._change.pipe(hv(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0};}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();var Wt=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({})}return o})(),Hn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[B,Wt,B,Wt]})}return o})();var mt=class{_attachedHost=null;attach(n){return this._attachedHost=n,n.attach(this)}detach(){let n=this._attachedHost;n!=null&&(this._attachedHost=null,n.detach());}get isAttached(){return this._attachedHost!=null}setAttachedHost(n){this._attachedHost=n;}},jn=class extends mt{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(n,e,t,i,r,s){super(),this.component=n,this.viewContainerRef=e,this.injector=t,this.projectableNodes=i,this.bindings=r||null,this.directives=s||null;}},ut=class extends mt{templateRef;viewContainerRef;context;injector;constructor(n,e,t,i){super(),this.templateRef=n,this.viewContainerRef=e,this.context=t,this.injector=i;}get origin(){return this.templateRef.elementRef}attach(n,e=this.context){return this.context=e,super.attach(n)}detach(){return this.context=void 0,super.detach()}},Wn=class extends mt{element;constructor(n){super(),this.element=n instanceof xt?n.nativeElement:n;}},Un=class{_attachedPortal=null;_disposeFn=null;_isDisposed=false;hasAttached(){return !!this._attachedPortal}attach(n){if(n instanceof jn)return this._attachedPortal=n,this.attachComponentPortal(n);if(n instanceof ut)return this._attachedPortal=n,this.attachTemplatePortal(n);if(this.attachDomPortal&&n instanceof Wn)return this._attachedPortal=n,this.attachDomPortal(n)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn();}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=true;}setDisposeFn(n){this._disposeFn=n;}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null);}},Ut=class extends Un{outletElement;_appRef;_defaultInjector;constructor(n,e,t){super(),this.outletElement=n,this._appRef=e,this._defaultInjector=t;}attachComponentPortal(n){let e;if(n.viewContainerRef){let t=n.injector||n.viewContainerRef.injector,i=t.get(Jt,null,{optional:true})||void 0;e=n.viewContainerRef.createComponent(n.component,{index:n.viewContainerRef.length,injector:t,ngModuleRef:i,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),this.setDisposeFn(()=>e.destroy());}else {let t=this._appRef,i=n.injector||this._defaultInjector||re.NULL,r=i.get(he$1,t.injector);e=RB(n.component,{elementInjector:i,environmentInjector:r,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0,directives:n.directives||void 0}),t.attachView(e.hostView),this.setDisposeFn(()=>{t.viewCount>0&&t.detachView(e.hostView),e.destroy();});}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=n,e}attachTemplatePortal(n){let e=n.viewContainerRef,t=e.createEmbeddedView(n.templateRef,n.context,{injector:n.injector});return t.rootNodes.forEach(i=>this.outletElement.appendChild(i)),t.detectChanges(),this.setDisposeFn(()=>{let i=e.indexOf(t);i!==-1&&e.remove(i);}),this._attachedPortal=n,t}attachDomPortal=n=>{let e=n.element;e.parentNode;let t=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(t,e),this.outletElement.appendChild(e),this._attachedPortal=n,super.setDisposeFn(()=>{t.parentNode&&t.parentNode.replaceChild(e,t);});};dispose(){super.dispose(),this.outletElement.remove();}_getComponentRootNode(n){return n.hostView.rootNodes[0]}};var Bo=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({})}return o})();var zo=no();function Go(o){return new Yt(o.get(Pe),o.get($))}var Yt=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=false;_document;constructor(n,e){this._viewportRuler=n,this._document=e;}attach(){}enable(){if(this._canBeEnabled()){let n=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=n.style.left||"",this._previousHTMLStyles.top=n.style.top||"",n.style.left=L(-this._previousScrollPosition.left),n.style.top=L(-this._previousScrollPosition.top),n.classList.add("cdk-global-scrollblock"),this._isEnabled=true;}}disable(){if(this._isEnabled){let n=this._document.documentElement,e=this._document.body,t=n.style,i=e.style,r=t.scrollBehavior||"",s=i.scrollBehavior||"";this._isEnabled=false,t.left=this._previousHTMLStyles.left,t.top=this._previousHTMLStyles.top,n.classList.remove("cdk-global-scrollblock"),zo&&(t.scrollBehavior=i.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),zo&&(t.scrollBehavior=r,i.scrollBehavior=s);}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return  false;let e=this._document.documentElement,t=this._viewportRuler.getViewportSize();return e.scrollHeight>t.height||e.scrollWidth>t.width}};function Xo(o,n){return new Kt(o.get(Vn),o.get(oe$1),o.get(Pe),n)}var Kt=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(n,e,t,i){this._scrollDispatcher=n,this._ngZone=e,this._viewportRuler=t,this._config=i;}attach(n){this._overlayRef,this._overlayRef=n;}enable(){if(this._scrollSubscription)return;let n=this._scrollDispatcher.scrolled(0).pipe(Pt$1(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=n.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition();})):this._scrollSubscription=n.subscribe(this._detach);}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null);}detach(){this.disable(),this._overlayRef=null;}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach());}};var ht=class{enable(){}disable(){}attach(){}};function Yn(o,n){return n.some(e=>{let t=o.bottom<e.top,i=o.top>e.bottom,r=o.right<e.left,s=o.left>e.right;return t||i||r||s})}function Vo(o,n){return n.some(e=>{let t=o.top<e.top,i=o.bottom>e.bottom,r=o.left<e.left,s=o.right>e.right;return t||i||r||s})}function pt(o,n){return new Gt(o.get(Vn),o.get(Pe),o.get(oe$1),n)}var Gt=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(n,e,t,i){this._scrollDispatcher=n,this._viewportRuler=e,this._ngZone=t,this._config=i;}attach(n){this._overlayRef,this._overlayRef=n;}enable(){if(!this._scrollSubscription){let n=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(n).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:t,height:i}=this._viewportRuler.getViewportSize();Yn(e,[{width:t,height:i,bottom:i,right:t,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()));}});}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null);}detach(){this.disable(),this._overlayRef=null;}},qo=(()=>{class o{_injector=y(re);noop=()=>new ht;close=e=>Xo(this._injector,e);block=()=>Go(this._injector);reposition=e=>pt(this._injector,e);static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),ft=class{positionStrategy;scrollStrategy=new ht;panelClass="";hasBackdrop=false;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=false;usePopover;eventPredicate;constructor(n){if(n){let e=Object.keys(n);for(let t of e)n[t]!==void 0&&(this[t]=n[t]);}}};var Xt=class{connectionPair;scrollableViewProperties;constructor(n,e){this.connectionPair=n,this.scrollableViewProperties=e;}};var Zo=(()=>{class o{_attachedOverlays=[];_document=y($);_isAttached=false;ngOnDestroy(){this.detach();}add(e){this.remove(e),this._attachedOverlays.push(e);}remove(e){let t=this._attachedOverlays.indexOf(e);t>-1&&this._attachedOverlays.splice(t,1),this._attachedOverlays.length===0&&this.detach();}canReceiveEvent(e,t,i){return i.observers.length<1?false:e.eventPredicate?e.eventPredicate(t):true}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),Qo=(()=>{class o extends Zo{_ngZone=y(oe$1);_renderer=y(Rn$1).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener);}),this._isAttached=true);}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=false);}_keydownListener=e=>{let t=this._attachedOverlays;for(let i=t.length-1;i>-1;i--){let r=t[i];if(this.canReceiveEvent(r,e,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(e));break}}};static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),$o=(()=>{class o extends Zo{_platform=y(N);_ngZone=y(oe$1);_renderer=y(Rn$1).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=false;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let t=this._document.body,i={capture:true},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(t,"pointerdown",this._pointerDownListener,i),r.listen(t,"click",this._clickListener,i),r.listen(t,"auxclick",this._clickListener,i),r.listen(t,"contextmenu",this._clickListener,i)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=t.style.cursor,t.style.cursor="pointer",this._cursorStyleIsSet=true),this._isAttached=true;}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=false),this._isAttached=false);}_pointerDownListener=e=>{this._pointerDownEventTarget=Z(e);};_clickListener=e=>{let t=Z(e),i=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:t;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let s=r.length-1;s>-1;s--){let l=r[s],m=l._outsidePointerEvents;if(!(!l.hasAttached()||!this.canReceiveEvent(l,e,m))){if(Ho(l.overlayElement,t)||Ho(l.overlayElement,i))break;this._ngZone?this._ngZone.run(()=>m.next(e)):m.next(e);}}};static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})();function Ho(o,n){let e=typeof ShadowRoot<"u"&&ShadowRoot,t=n;for(;t;){if(t===o)return  true;t=e&&t instanceof ShadowRoot?t.host:t.parentNode;}return  false}var Jo=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(t,i){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2})}return o})(),er=(()=>{class o{_platform=y(N);_containerElement;_document=y($);_styleLoader=y(se);ngOnDestroy(){this._containerElement?.remove();}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||Mn()){let i=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let r=0;r<i.length;r++)i[r].remove();}let t=this._document.createElement("div");t.classList.add(e),Mn()?t.setAttribute("platform","test"):this._platform.isBrowser||t.setAttribute("platform","server"),this._document.body.appendChild(t),this._containerElement=t;}_loadStyles(){this._styleLoader.load(Jo);}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),Kn=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(n,e,t,i){this._renderer=e,this._ngZone=t,this.element=n.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",i);}detach(){this._ngZone.runOutsideAngular(()=>{let n=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(n,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),n.style.pointerEvents="none",n.classList.remove("cdk-overlay-backdrop-showing");});}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove();}};function Gn(o){return o&&o.nodeType===1}var qt=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new le$1;_attachments=new le$1;_detachments=new le$1;_positionStrategy;_scrollStrategy;_locationChanges=ee.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=false;_previousHostParent;_keydownEvents=new le$1;_outsidePointerEvents=new le$1;_afterNextRenderRef;constructor(n,e,t,i,r,s,l,m,f,h=false,x,G){this._portalOutlet=n,this._host=e,this._pane=t,this._config=i,this._ngZone=r,this._keyboardDispatcher=s,this._document=l,this._location=m,this._outsideClickDispatcher=f,this._animationsDisabled=h,this._injector=x,this._renderer=G,i.scrollStrategy&&(this._scrollStrategy=i.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=i.positionStrategy;}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(n){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(n);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=XE(()=>{this.hasAttached()&&this.updatePosition();},{injector:this._injector}),this._togglePointerEvents(true),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,true),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()));}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(false),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let n=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),n}dispose(){if(this._disposed)return;let n=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,n&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=true;}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply();}updatePositionStrategy(n){n!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=n,this.hasAttached()&&(n.attach(this),this.updatePosition()));}updateSize(n){this._config=B$1(B$1({},this._config),n),this._updateElementSize();}setDirection(n){this._config=W(B$1({},this._config),{direction:n}),this._updateElementDirection();}addPanelClass(n){this._pane&&this._toggleClasses(this._pane,n,true);}removePanelClass(n){this._pane&&this._toggleClasses(this._pane,n,false);}getDirection(){let n=this._config.direction;return n?typeof n=="string"?n:n.value:"ltr"}updateScrollStrategy(n){n!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=n,this.hasAttached()&&(n.attach(this),n.enable()));}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection());}_updateElementSize(){if(!this._pane)return;let n=this._pane.style;n.width=L(this._config.width),n.height=L(this._config.height),n.minWidth=L(this._config.minWidth),n.minHeight=L(this._config.minHeight),n.maxWidth=L(this._config.maxWidth),n.maxHeight=L(this._config.maxHeight);}_togglePointerEvents(n){this._pane.style.pointerEvents=n?"":"none";}_attachHost(){if(!this._host.parentElement){let n=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;Gn(n)?n.after(this._host):n?.type==="parent"?n.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host);}if(this._config.usePopover)try{this._host.showPopover();}catch{}}_attachBackdrop(){let n="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new Kn(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e);}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,true),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(n));}):this._backdropRef.element.classList.add(n);}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host);}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach();}_toggleClasses(n,e,t){let i=kn(e||[]).filter(r=>!!r);i.length&&(t?n.classList.add(...i):n.classList.remove(...i));}_detachContentWhenEmpty(){let n=false;try{this._detachContentAfterRenderRef=XE(()=>{n=!0,this._detachContent();},{injector:this._injector});}catch(e){if(n)throw e;this._detachContent();}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent();}),this._detachContentMutationObserver.observe(this._pane,{childList:true}));}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,false),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent());}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect();}_disposeScrollStrategy(){let n=this._scrollStrategy;n?.disable(),n?.detach?.();}},jo="cdk-overlay-connected-position-bounding-box",Ma=/([A-Za-z%]+)$/;function Xn(o,n){return new Zt(n,o.get(Pe),o.get($),o.get(N),o.get(er))}var Zt=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=false;_lastBoundingBoxSize={width:0,height:0};_isPushed=false;_canPush=true;_growAfterOpen=false;_hasFlexibleDimensions=true;_positionLocked=false;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=false;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new le$1;_resizeSubscription=ee.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(n,e,t,i,r){this._viewportRuler=e,this._document=t,this._platform=i,this._overlayContainer=r,this.setOrigin(n);}attach(n){this._overlayRef&&this._overlayRef,this._validatePositions(),n.hostElement.classList.add(jo),this._overlayRef=n,this._boundingBox=n.hostElement,this._pane=n.overlayElement,this._isDisposed=false,this._isInitialRender=true,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=true,this.apply();});}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let n=this._originRect,e=this._overlayRect,t=this._viewportRect,i=this._containerRect,r=[],s;for(let l of this._preferredPositions){let m=this._getOriginPoint(n,i,l),f=this._getOverlayPoint(m,e,l),h=this._getOverlayFit(f,e,t,l);if(h.isCompletelyWithinViewport){this._isPushed=false,this._applyPosition(l,m);return}if(this._canFitWithFlexibleDimensions(h,f,t)){r.push({position:l,origin:m,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(m,l)});continue}(!s||s.overlayFit.visibleArea<h.visibleArea)&&(s={overlayFit:h,overlayPoint:f,originPoint:m,position:l,overlayRect:e});}if(r.length){let l=null,m=-1;for(let f of r){let h=f.boundingBoxRect.width*f.boundingBoxRect.height*(f.position.weight||1);h>m&&(m=h,l=f);}this._isPushed=false,this._applyPosition(l.position,l.origin);return}if(this._canPush){this._isPushed=true,this._applyPosition(s.position,s.originPoint);return}this._applyPosition(s.position,s.originPoint);}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe();}dispose(){this._isDisposed||(this._boundingBox&&Ne(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(jo),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=true);}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let n=this._lastPosition;n?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(n,this._getOriginPoint(this._originRect,this._containerRect,n))):this.apply();}withScrollableContainers(n){return this._scrollables=n,this}withPositions(n){return this._preferredPositions=n,n.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(n){return this._viewportMargin=n,this}withFlexibleDimensions(n=true){return this._hasFlexibleDimensions=n,this}withGrowAfterOpen(n=true){return this._growAfterOpen=n,this}withPush(n=true){return this._canPush=n,this}withLockedPosition(n=true){return this._positionLocked=n,this}setOrigin(n){return this._origin=n,this}withDefaultOffsetX(n){return this._offsetX=n,this}withDefaultOffsetY(n){return this._offsetY=n,this}withTransformOriginOn(n){return this._transformOriginSelector=n,this}withPopoverLocation(n){return this._popoverLocation=n,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof xt?this._origin.nativeElement:Gn(this._origin)?this._origin:null}_getOriginPoint(n,e,t){let i;if(t.originX=="center")i=n.left+n.width/2;else {let s=this._isRtl()?n.right:n.left,l=this._isRtl()?n.left:n.right;i=t.originX=="start"?s:l;}e.left<0&&(i-=e.left);let r;return t.originY=="center"?r=n.top+n.height/2:r=t.originY=="top"?n.top:n.bottom,e.top<0&&(r-=e.top),{x:i,y:r}}_getOverlayPoint(n,e,t){let i;t.overlayX=="center"?i=-e.width/2:t.overlayX==="start"?i=this._isRtl()?-e.width:0:i=this._isRtl()?0:-e.width;let r;return t.overlayY=="center"?r=-e.height/2:r=t.overlayY=="top"?0:-e.height,{x:n.x+i,y:n.y+r}}_getOverlayFit(n,e,t,i){let r=Uo(e),{x:s,y:l}=n,m=this._getOffset(i,"x"),f=this._getOffset(i,"y");m&&(s+=m),f&&(l+=f);let h=0-s,x=s+r.width-t.width,G=0-l,X=l+r.height-t.height,H=this._subtractOverflows(r.width,h,x),z=this._subtractOverflows(r.height,G,X),Me=H*z;return {visibleArea:Me,isCompletelyWithinViewport:r.width*r.height===Me,fitsInViewportVertically:z===r.height,fitsInViewportHorizontally:H==r.width}}_canFitWithFlexibleDimensions(n,e,t){if(this._hasFlexibleDimensions){let i=t.bottom-e.y,r=t.right-e.x,s=Wo(this._overlayRef.getConfig().minHeight),l=Wo(this._overlayRef.getConfig().minWidth),m=n.fitsInViewportVertically||s!=null&&s<=i,f=n.fitsInViewportHorizontally||l!=null&&l<=r;return m&&f}return  false}_pushOverlayOnScreen(n,e,t){if(this._previousPushAmount&&this._positionLocked)return {x:n.x+this._previousPushAmount.x,y:n.y+this._previousPushAmount.y};let i=Uo(e),r=this._viewportRect,s=Math.max(n.x+i.width-r.width,0),l=Math.max(n.y+i.height-r.height,0),m=Math.max(r.top-t.top-n.y,0),f=Math.max(r.left-t.left-n.x,0),h=0,x=0;return i.width<=r.width?h=f||-s:h=n.x<this._getViewportMarginStart()?r.left-t.left-n.x:0,i.height<=r.height?x=m||-l:x=n.y<this._getViewportMarginTop()?r.top-t.top-n.y:0,this._previousPushAmount={x:h,y:x},{x:n.x+h,y:n.y+x}}_applyPosition(n,e){if(this._setTransformOrigin(n),this._setOverlayElementStyles(e,n),this._setBoundingBoxStyles(e,n),n.panelClass&&this._addPanelClasses(n.panelClass),this._positionChanges.observers.length){let t=this._getScrollVisibility();if(n!==this._lastPosition||!this._lastScrollVisibility||!Da(this._lastScrollVisibility,t)){let i=new Xt(n,t);this._positionChanges.next(i);}this._lastScrollVisibility=t;}this._lastPosition=n,this._isInitialRender=false;}_setTransformOrigin(n){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),t,i=n.overlayY;n.overlayX==="center"?t="center":this._isRtl()?t=n.overlayX==="start"?"right":"left":t=n.overlayX==="start"?"left":"right";for(let r=0;r<e.length;r++)e[r].style.transformOrigin=`${t} ${i}`;}_calculateBoundingBoxRect(n,e){let t=this._viewportRect,i=this._isRtl(),r,s,l;if(e.overlayY==="top")s=n.y,r=t.height-s+this._getViewportMarginBottom();else if(e.overlayY==="bottom")l=t.height-n.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=t.height-l+this._getViewportMarginTop();else {let X=Math.min(t.bottom-n.y+t.top,n.y),H=this._lastBoundingBoxSize.height;r=X*2,s=n.y-X,r>H&&!this._isInitialRender&&!this._growAfterOpen&&(s=n.y-H/2);}let m=e.overlayX==="start"&&!i||e.overlayX==="end"&&i,f=e.overlayX==="end"&&!i||e.overlayX==="start"&&i,h,x,G;if(f)G=t.width-n.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),h=n.x-this._getViewportMarginStart();else if(m)x=n.x,h=t.right-n.x-this._getViewportMarginEnd();else {let X=Math.min(t.right-n.x+t.left,n.x),H=this._lastBoundingBoxSize.width;h=X*2,x=n.x-X,h>H&&!this._isInitialRender&&!this._growAfterOpen&&(x=n.x-H/2);}return {top:s,left:x,bottom:l,right:G,width:h,height:r}}_setBoundingBoxStyles(n,e){let t=this._calculateBoundingBoxRect(n,e);!this._isInitialRender&&!this._growAfterOpen&&(t.height=Math.min(t.height,this._lastBoundingBoxSize.height),t.width=Math.min(t.width,this._lastBoundingBoxSize.width));let i={};if(this._hasExactPosition())i.top=i.left="0",i.bottom=i.right="auto",i.maxHeight=i.maxWidth="",i.width=i.height="100%";else {let r=this._overlayRef.getConfig().maxHeight,s=this._overlayRef.getConfig().maxWidth;i.width=L(t.width),i.height=L(t.height),i.top=L(t.top)||"auto",i.bottom=L(t.bottom)||"auto",i.left=L(t.left)||"auto",i.right=L(t.right)||"auto",e.overlayX==="center"?i.alignItems="center":i.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?i.justifyContent="center":i.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",r&&(i.maxHeight=L(r)),s&&(i.maxWidth=L(s));}this._lastBoundingBoxSize=t,Ne(this._boundingBox.style,i);}_resetBoundingBoxStyles(){Ne(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""});}_resetOverlayElementStyles(){Ne(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""});}_setOverlayElementStyles(n,e){let t={},i=this._hasExactPosition(),r=this._hasFlexibleDimensions,s=this._overlayRef.getConfig();if(i){let h=this._viewportRuler.getViewportScrollPosition();Ne(t,this._getExactOverlayY(e,n,h)),Ne(t,this._getExactOverlayX(e,n,h));}else t.position="static";let l="",m=this._getOffset(e,"x"),f=this._getOffset(e,"y");m&&(l+=`translateX(${m}px) `),f&&(l+=`translateY(${f}px)`),t.transform=l.trim(),s.maxHeight&&(i?t.maxHeight=L(s.maxHeight):r&&(t.maxHeight="")),s.maxWidth&&(i?t.maxWidth=L(s.maxWidth):r&&(t.maxWidth="")),Ne(this._pane.style,t);}_getExactOverlayY(n,e,t){let i={top:"",bottom:""},r=this._getOverlayPoint(e,this._overlayRect,n);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,t)),n.overlayY==="bottom"){let s=this._document.documentElement.clientHeight;i.bottom=`${s-(r.y+this._overlayRect.height)}px`;}else i.top=L(r.y);return i}_getExactOverlayX(n,e,t){let i={left:"",right:""},r=this._getOverlayPoint(e,this._overlayRect,n);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,t));let s;if(this._isRtl()?s=n.overlayX==="end"?"left":"right":s=n.overlayX==="end"?"right":"left",s==="right"){let l=this._document.documentElement.clientWidth;i.right=`${l-(r.x+this._overlayRect.width)}px`;}else i.left=L(r.x);return i}_getScrollVisibility(){let n=this._getOriginRect(),e=this._pane.getBoundingClientRect(),t=this._scrollables.map(i=>i.getElementRef().nativeElement.getBoundingClientRect());return {isOriginClipped:Vo(n,t),isOriginOutsideView:Yn(n,t),isOverlayClipped:Vo(e,t),isOverlayOutsideView:Yn(e,t)}}_subtractOverflows(n,...e){return e.reduce((t,i)=>t-Math.max(i,0),n)}_getNarrowedViewportRect(){let n=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,t=this._viewportRuler.getViewportScrollPosition();return {top:t.top+this._getViewportMarginTop(),left:t.left+this._getViewportMarginStart(),right:t.left+n-this._getViewportMarginEnd(),bottom:t.top+e-this._getViewportMarginBottom(),width:n-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return !this._hasFlexibleDimensions||this._isPushed}_getOffset(n,e){return e==="x"?n.offsetX==null?this._offsetX:n.offsetX:n.offsetY==null?this._offsetY:n.offsetY}_validatePositions(){}_addPanelClasses(n){this._pane&&kn(n).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e));});}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(n=>{this._pane.classList.remove(n);}),this._appliedPanelClasses=[]);}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let n=this._origin;if(n instanceof xt)return n.nativeElement.getBoundingClientRect();if(n instanceof Element)return n.getBoundingClientRect();let e=n.width||0,t=n.height||0;return {top:n.y,bottom:n.y+t,left:n.x,right:n.x+e,height:t,width:e}}_getContainerRect(){let n=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();n&&(e.style.display="block");let t=e.getBoundingClientRect();return n&&(e.style.display=""),t}};function Ne(o,n){for(let e in n)n.hasOwnProperty(e)&&(o[e]=n[e]);return o}function Wo(o){if(typeof o!="number"&&o!=null){let[n,e]=o.split(Ma);return !e||e==="px"?parseFloat(n):null}return o||null}function Uo(o){return {top:Math.floor(o.top),right:Math.floor(o.right),bottom:Math.floor(o.bottom),left:Math.floor(o.left),width:Math.floor(o.width),height:Math.floor(o.height)}}function Da(o,n){return o===n?true:o.isOriginClipped===n.isOriginClipped&&o.isOriginOutsideView===n.isOriginOutsideView&&o.isOverlayClipped===n.isOverlayClipped&&o.isOverlayOutsideView===n.isOverlayOutsideView}var Yo="cdk-global-overlay-wrapper";function tr(o){return new Qt}var Qt=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=false;attach(n){let e=n.getConfig();this._overlayRef=n,this._width&&!e.width&&n.updateSize({width:this._width}),this._height&&!e.height&&n.updateSize({height:this._height}),n.hostElement.classList.add(Yo),this._isDisposed=false;}top(n=""){return this._bottomOffset="",this._topOffset=n,this._alignItems="flex-start",this}left(n=""){return this._xOffset=n,this._xPosition="left",this}bottom(n=""){return this._topOffset="",this._bottomOffset=n,this._alignItems="flex-end",this}right(n=""){return this._xOffset=n,this._xPosition="right",this}start(n=""){return this._xOffset=n,this._xPosition="start",this}end(n=""){return this._xOffset=n,this._xPosition="end",this}width(n=""){return this._overlayRef?this._overlayRef.updateSize({width:n}):this._width=n,this}height(n=""){return this._overlayRef?this._overlayRef.updateSize({height:n}):this._height=n,this}centerHorizontally(n=""){return this.left(n),this._xPosition="center",this}centerVertically(n=""){return this.top(n),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,t=this._overlayRef.getConfig(),{width:i,height:r,maxWidth:s,maxHeight:l}=t,m=(i==="100%"||i==="100vw")&&(!s||s==="100%"||s==="100vw"),f=(r==="100%"||r==="100vh")&&(!l||l==="100%"||l==="100vh"),h=this._xPosition,x=this._xOffset,G=this._overlayRef.getConfig().direction==="rtl",X="",H="",z="";m?z="flex-start":h==="center"?(z="center",G?H=x:X=x):G?h==="left"||h==="end"?(z="flex-end",X=x):(h==="right"||h==="start")&&(z="flex-start",H=x):h==="left"||h==="start"?(z="flex-start",X=x):(h==="right"||h==="end")&&(z="flex-end",H=x),n.position=this._cssPosition,n.marginLeft=m?"0":X,n.marginTop=f?"0":this._topOffset,n.marginBottom=this._bottomOffset,n.marginRight=m?"0":H,e.justifyContent=z,e.alignItems=f?"flex-start":this._alignItems;}dispose(){if(this._isDisposed||!this._overlayRef)return;let n=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,t=e.style;e.classList.remove(Yo),t.justifyContent=t.alignItems=n.marginTop=n.marginBottom=n.marginLeft=n.marginRight=n.position="",this._overlayRef=null,this._isDisposed=true;}},nr=(()=>{class o{_injector=y(re);global(){return tr()}flexibleConnectedTo(e){return Xn(this._injector,e)}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),bt=new I("OVERLAY_DEFAULT_CONFIG");function qn(o,n){o.get(se).load(Jo);let e=o.get(er),t=o.get($),i=o.get(ie),r=o.get(Ar$1),s=o.get(xe),l=o.get(Mo$1,null,{optional:true})||o.get(Rn$1).createRenderer(null,null),m=new ft(n),f=o.get(bt,null,{optional:true})?.usePopover??true;m.direction=m.direction||s.value,!t.body||!("showPopover"in t.body)?m.usePopover=false:m.usePopover=n?.usePopover??f;let h=t.createElement("div"),x=t.createElement("div");h.id=i.getId("cdk-overlay-"),h.classList.add("cdk-overlay-pane"),x.appendChild(h),m.usePopover&&(x.setAttribute("popover","manual"),x.classList.add("cdk-overlay-popover"));let G=m.usePopover?m.positionStrategy?.getPopoverInsertionPoint?.():null;return Gn(G)?G.after(x):G?.type==="parent"?G.element.appendChild(x):e.getContainerElement().appendChild(x),new qt(new Ut(h,r,o),x,h,m,o.get(oe$1),o.get(Qo),t,o.get(jm),o.get($o),n?.disableAnimations??o.get(hD,null,{optional:true})==="NoopAnimations",o.get(he$1),l)}var ir=(()=>{class o{scrollStrategies=y(qo);_positionBuilder=y(nr);_injector=y(re);create(e){return qn(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(t){return new(t||o)};static \u0275prov=Xe$1({token:o,factory:o.\u0275fac})}return o})(),Ra=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],Oa=new I("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let o=y(re);return ()=>pt(o)}}),Ge=(()=>{class o{elementRef=y(xt);static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return o})(),or=new I("cdk-connected-overlay-default-config"),$t=(()=>{class o{_dir=y(xe,{optional:true});_injector=y(re);_overlayRef;_templatePortal;_backdropSubscription=ee.EMPTY;_attachSubscription=ee.EMPTY;_detachSubscription=ee.EMPTY;_positionSubscription=ee.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=y(Oa);_ngZone=y(oe$1);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position);}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position);}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=false;disableClose=false;transformOriginSelector;hasBackdrop=false;lockPosition=false;flexibleDimensions=false;growAfterOpen=false;push=false;disposeOnNavigation=false;usePopover;matchWidth=false;set _config(e){typeof e!="string"&&this._assignConfig(e);}backdropClick=new Ct;positionChange=new Ct;attach=new Ct;detach=new Ct;overlayKeydown=new Ct;overlayOutsideClick=new Ct;constructor(){let e=y(_r$1),t=y(Ln$1),i=y(or,{optional:true}),r=y(bt,{optional:true});this.usePopover=r?.usePopover===false?null:"global",this._templatePortal=new ut(e,t),this.scrollStrategy=this._scrollStrategyFactory(),i&&this._assignConfig(i);}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose();}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay());}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=Ra);let e=this._overlayRef=qn(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(t=>{this.overlayKeydown.next(t),t.keyCode===27&&!this.disableClose&&!ge(t)&&(t.preventDefault(),this.detachOverlay());}),this._overlayRef.outsidePointerEvents().subscribe(t=>{let i=this._getOriginElement(),r=Z(t);(!i||i!==r&&!i.contains(r))&&this.overlayOutsideClick.next(t);});}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),t=new ft({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return (this.height||this.height===0)&&(t.height=this.height),(this.minWidth||this.minWidth===0)&&(t.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(t.minHeight=this.minHeight),this.backdropClass&&(t.backdropClass=this.backdropClass),this.panelClass&&(t.panelClass=this.panelClass),t}_updatePositionStrategy(e){let t=this.positions.map(i=>({originX:i.originX,originY:i.originY,overlayX:i.overlayX,overlayY:i.overlayY,offsetX:i.offsetX||this.offsetX,offsetY:i.offsetY||this.offsetY,panelClass:i.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(t).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=Xn(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof Ge?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof Ge?this.origin.elementRef.nativeElement:this.origin instanceof xt?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(t=>this.backdropClick.emit(t)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(Sv(()=>this.positionChange.observers.length>0)).subscribe(t=>{this._ngZone.run(()=>this.positionChange.emit(t)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe();})),this.open=true;}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=false;}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth;}static \u0275fac=function(t){return new(t||o)};static \u0275dir=xr$1({type:o,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",ub],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",ub],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",ub],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",ub],push:[2,"cdkConnectedOverlayPush","push",ub],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",ub],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",ub],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[_s]})}return o})(),Zn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({providers:[ir],imports:[B,Bo,Hn,Hn]})}return o})();var rr=(()=>{class o{_animationsDisabled=le();state="unchecked";disabled=false;appearance="full";static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(t,i){t&2&&Wg("mat-pseudo-checkbox-indeterminate",i.state==="indeterminate")("mat-pseudo-checkbox-checked",i.state==="checked")("mat-pseudo-checkbox-disabled",i.disabled)("mat-pseudo-checkbox-minimal",i.appearance==="minimal")("mat-pseudo-checkbox-full",i.appearance==="full")("_mat-animation-noopable",i._animationsDisabled);},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(t,i){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--mat-pseudo-checkbox-full-unselected-icon-color, var(--mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--mat-pseudo-checkbox-full-selected-icon-color, var(--mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-full-selected-checkmark-color, var(--mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return o})();var Ta=["text"],Aa=[[["mat-icon"]],"*"],Ia=["mat-icon","*"];function Fa(o,n){if(o&1&&xg(0,"mat-pseudo-checkbox",1),o&2){let e=OC();Ng("disabled",e.disabled)("state",e.selected?"checked":"unchecked");}}function Pa(o,n){if(o&1&&xg(0,"mat-pseudo-checkbox",3),o&2){let e=OC();Ng("disabled",e.disabled);}}function Na(o,n){if(o&1&&(Ts(0,"span",4),uT(1),El()),o&2){let e=OC();wI(),bl("(",e.group.label,")");}}var $n=new I("MAT_OPTION_PARENT_COMPONENT"),Jn=new I("MatOptgroup");var Qn=class{source;isUserInput;constructor(n,e=false){this.source=n,this.isUserInput=e;}},Xe=(()=>{class o{_element=y(xt);_changeDetectorRef=y(xm);_parent=y($n,{optional:true});group=y(Jn,{optional:true});_signalDisableRipple=false;_selected=false;_active=false;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=y(ie).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e);}_disabled=qe(false);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return !!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new Ct;_text;_stateChanges=new le$1;constructor(){let e=y(se);e.load(Ye),e.load(xn),this._signalDisableRipple=!!this._parent&&Dr$1(this._parent.disableRipple);}get active(){return this._active}get viewValue(){return (this._text?.nativeElement.textContent||"").trim()}select(e=true){this._selected||(this._selected=true,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent());}deselect(e=true){this._selected&&(this._selected=false,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent());}focus(e,t){let i=this._getHostElement();typeof i.focus=="function"&&i.focus(t);}setActiveStyles(){this._active||(this._active=true,this._changeDetectorRef.markForCheck());}setInactiveStyles(){this._active&&(this._active=false,this._changeDetectorRef.markForCheck());}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!ge(e)&&(this._selectViaInteraction(),e.preventDefault());}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:true,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(true));}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e);}}ngOnDestroy(){this._stateChanges.complete();}_emitSelectionChangeEvent(e=false){this.onSelectionChange.emit(new Qn(this,e));}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["mat-option"]],viewQuery:function(t,i){if(t&1&&Vg(Ta,7),t&2){let r;jC(r=BC())&&(i._text=r.first);}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(t,i){t&1&&Pg("click",function(){return i._selectViaInteraction()})("keydown",function(s){return i._handleKeydown(s)}),t&2&&(kg("id",i.id),Mg("aria-selected",i.selected)("aria-disabled",i.disabled.toString()),Wg("mdc-list-item--selected",i.selected)("mat-mdc-option-multiple",i.multiple)("mat-mdc-option-active",i.active)("mdc-list-item--disabled",i.disabled));},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",ub]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:Ia,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(t,i){t&1&&(FC(Aa),yC(0,Fa,1,2,"mat-pseudo-checkbox",1),PC(1),Ts(2,"span",2,0),PC(4,1),El(),yC(5,Pa,1,1,"mat-pseudo-checkbox",3),yC(6,Na,2,1,"span",4),xg(7,"div",5)),t&2&&(vC(i.multiple?0:-1),wI(5),vC(!i.multiple&&i.selected&&!i.hideSingleSelectionIndicator?5:-1),wI(),vC(i.group&&i.group._inert?6:-1),wI(),Ng("matRippleTrigger",i._getHostElement())("matRippleDisabled",i.disabled||i.disableRipple));},dependencies:[rr,Nt],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})}return o})();function ar(o,n,e){if(e.length){let t=n.toArray(),i=e.toArray(),r=0;for(let s=0;s<o+1;s++)t[s].group&&t[s].group===i[r]&&r++;return r}return 0}function sr(o,n,e,t){return o<e?o:o+n>e+t?Math.max(0,o-t+n):e}var lr=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[B]})}return o})();var ei=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[Bt,lr,Xe,B]})}return o})();var La=["trigger"],Ba=["panel"],za=[[["mat-select-trigger"]],"*"],Va=["mat-select-trigger","*"];function Ha(o,n){if(o&1&&(Ts(0,"span",4),uT(1),El()),o&2){let e=OC();wI(),Xg(e.placeholder);}}function ja(o,n){o&1&&PC(0);}function Wa(o,n){if(o&1&&(Ts(0,"span",11),uT(1),El()),o&2){let e=OC(2);wI(),Xg(e.triggerValue);}}function Ua(o,n){if(o&1&&(Ts(0,"span",5),yC(1,ja,1,0)(2,Wa,2,1,"span",11),El()),o&2){let e=OC();wI(),vC(e.customTrigger?1:2);}}function Ya(o,n){if(o&1){let e=MC();Ts(0,"div",12,1),Pg("keydown",function(i){Nf(e);let r=OC();return xf(r._handleKeydown(i))}),PC(2,1),El();}if(o&2){let e=OC();XC(e.panelClass),Wg("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",e._parentFormField?.color==="primary")("mat-accent",e._parentFormField?.color==="accent")("mat-warn",e._parentFormField?.color==="warn")("mat-undefined",!e._parentFormField?.color),Mg("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby());}}var Ka=new I("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let o=y(re);return ()=>pt(o)}}),Ga=new I("MAT_SELECT_CONFIG"),Xa=new I("MatSelectTrigger"),ti=class{source;value;constructor(n,e){this.source=n,this.value=e;}},cr=(()=>{class o{_viewportRuler=y(Pe);_changeDetectorRef=y(xm);_elementRef=y(xt);_dir=y(xe,{optional:true});_idGenerator=y(ie);_renderer=y(Mo$1);_parentFormField=y(ct,{optional:true});ngControl=y(b,{self:true,optional:true});_liveAnnouncer=y(Cn);_defaultOptions=y(Ga,{optional:true});_animationsDisabled=le();_popoverLocation;_initialized=new le$1;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let i=this.panel.nativeElement,r=ar(e,this.options,this.optionGroups),s=t._getHostElement();e===0&&r===1?i.scrollTop=0:i.scrollTop=sr(s.offsetTop,s.offsetHeight,i.scrollTop,i.offsetHeight);}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0);}_getChangeEvent(e){return new ti(this,e)}_scrollStrategyFactory=y(Ka);_panelOpen=false;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new le$1;_errorStateTracker;stateChanges=new le$1;disableAutomaticLabeling=true;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=false;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=false;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e);}_disableRipple=qe(false);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties();}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??false;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next();}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(ye.required)??false}set required(e){this._required=e,this.stateChanges.next();}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e;}_multiple=false;disableOptionCentering=this._defaultOptions?.disableOptionCentering??false;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection();}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e);}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e;}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next();}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e;}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??false;optionSelectionChanges=iv(()=>{let e=this.options;return e?e.changes.pipe(_v(e),Ma$1(()=>pv(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(Ma$1(()=>this.optionSelectionChanges))});openedChange=new Ct;_openedStream=this.openedChange.pipe(Pt$1(e=>e),de(()=>{}));_closedStream=this.openedChange.pipe(Pt$1(e=>!e),de(()=>{}));selectionChange=new Ct;valueChange=new Ct;constructor(){let e=y(jt),t=y(pi,{optional:true}),i=y(Ii,{optional:true}),r=y(new vm("tabindex"),{optional:true}),s=y(bt,{optional:true}),l=y(Ht,{optional:true,self:true});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new Ke(e,l||this.ngControl,i,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=r==null?0:parseInt(r)||0,this._popoverLocation=s?.usePopover===false?null:"inline",this.id=this.id;}ngOnInit(){this._selectionModel=new dt(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(Hd(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges());});}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(Hd(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect());}),this.options.changes.pipe(_v(null),Hd(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection();});}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let i=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?i.setAttribute("aria-labelledby",e):i.removeAttribute("aria-labelledby");}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState());}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass));}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete();}toggle(){this.panelOpen?this.close():this.open();}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=true,this._overlayDir.positionChange.pipe(Xn$1(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled();}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(true)));}close(){this._panelOpen&&(this._panelOpen=false,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(false)));}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(i),this._cleanupDetach=void 0;};let e=this.panel.nativeElement,t=this._renderer.listen(e,"animationend",r=>{r.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay());}),i=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay();},200);e.classList.add("mat-select-panel-exit");}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck();}writeValue(e){this._assignValue(e);}registerOnChange(e){this._onChange=e;}registerOnTouched(e){this._onTouched=e;}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next();}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return "";if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState();}_isRtl(){return this._dir?this._dir.value==="rtl":false}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e));}_handleClosedKeydown(e){let t=e.keyCode,i=t===40||t===38||t===37||t===39,r=t===13||t===32,s=this._keyManager;if(!s.isTyping()&&r&&!ge(e)||(this.multiple||e.altKey)&&i)e.preventDefault(),this.open();else if(!this.multiple){let l=this.selected;s.onKeydown(e);let m=this.selected;m&&l!==m&&this._liveAnnouncer.announce(m.viewValue,1e4);}}_handleOpenKeydown(e){let t=this._keyManager,i=e.keyCode,r=i===40||i===38,s=t.isTyping();if(r&&e.altKey)e.preventDefault(),this.close();else if(!s&&(i===13||i===32)&&t.activeItem&&!ge(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!s&&this._multiple&&i===65&&e.ctrlKey){e.preventDefault();let l=this.options.some(m=>!m.disabled&&!m.selected);this.options.forEach(m=>{m.disabled||(l?m.select():m.deselect());});}else {let l=t.activeItemIndex;t.onKeydown(e),this._multiple&&r&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==l&&t.activeItem._selectViaInteraction();}}_handleOverlayKeydown(e){e.keyCode===27&&!ge(e)&&(e.preventDefault(),this.close());}_onFocus(){this.disabled||(this._focused=true,this.stateChanges.next());}_onBlur(){this._focused=false,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next());}get empty(){return !this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next();});}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else {let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1);}this._changeDetectorRef.markForCheck();}_selectOptionByValue(e){let t=this.options.find(i=>{if(this._selectionModel.isSelected(i))return  false;try{return (i.value!=null||this.canSelectNullableOptions)&&this._compareWith(i.value,e)}catch{return  false}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,true):false}_skipPredicate=e=>this.panelOpen?false:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof Ge?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck();}_initKeyManager(){this._keyManager=new ot(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close());}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction();});}_resetOptions(){let e=pv(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(Hd(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus());}),pv(...this.options.map(t=>t._stateChanges)).pipe(Hd(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next();});}_onSelect(e,t){let i=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(i!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),i!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next();}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,i)=>this.sortComparator?this.sortComparator(t,i,e):e.indexOf(t)-e.indexOf(i)),this.stateChanges.next();}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(i=>i.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck();}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e);}else this._keyManager.setActiveItem(this._selectionModel.selected[0]);}_canOpen(){return !this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e);}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+" ":"";return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby");}onContainerClick(e){let t=Z(e);t&&(t.tagName==="MAT-OPTION"||t.classList.contains("cdk-overlay-backdrop")||t.closest(".mat-mdc-select-panel"))||(this.focus(),this.open());}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=Xw({type:o,selectors:[["mat-select"]],contentQueries:function(t,i,r){if(t&1&&Bg(r,Xa,5)(r,Xe,5)(r,Jn,5),t&2){let s;jC(s=BC())&&(i.customTrigger=s.first),jC(s=BC())&&(i.options=s),jC(s=BC())&&(i.optionGroups=s);}},viewQuery:function(t,i){if(t&1&&Vg(La,5)(Ba,5)($t,5),t&2){let r;jC(r=BC())&&(i.trigger=r.first),jC(r=BC())&&(i.panel=r.first),jC(r=BC())&&(i._overlayDir=r.first);}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(t,i){t&1&&Pg("keydown",function(s){return i._handleKeydown(s)})("focus",function(){return i._onFocus()})("blur",function(){return i._onBlur()}),t&2&&(Mg("id",i.id)("tabindex",i.disabled?-1:i.tabIndex)("aria-controls",i.panelOpen?i.id+"-panel":null)("aria-expanded",i.panelOpen)("aria-label",i.ariaLabel||null)("aria-required",i.required.toString())("aria-disabled",i.disabled.toString())("aria-invalid",i.errorState)("aria-activedescendant",i._getAriaActiveDescendant()),Wg("mat-mdc-select-disabled",i.disabled)("mat-mdc-select-invalid",i.errorState)("mat-mdc-select-required",i.required)("mat-mdc-select-empty",i.empty)("mat-mdc-select-multiple",i.multiple)("mat-select-open",i.panelOpen));},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",ub],disableRipple:[2,"disableRipple","disableRipple",ub],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:lb(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",ub],placeholder:"placeholder",required:[2,"required","required",ub],multiple:[2,"multiple","multiple",ub],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",ub],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",lb],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",ub]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[IT([{provide:lt,useExisting:o},{provide:$n,useExisting:o}]),_s],ngContentSelectors:Va,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(t,i){if(t&1&&(FC(za),Ts(0,"div",2,0),Pg("click",function(){return i.open()}),Ts(3,"div",3),yC(4,Ha,2,1,"span",4)(5,Ua,3,1,"span",5),El(),Ts(6,"div",6)(7,"div",7),Hf(),Ts(8,"svg",8),xg(9,"path",9),El()()()(),Tg(10,Ya,3,16,"ng-template",10),Pg("detach",function(){return i.close()})("backdropClick",function(){return i.close()})("overlayKeydown",function(s){return i._handleOverlayKeydown(s)})),t&2){let r=HC(1);wI(3),Mg("id",i._valueId),wI(),vC(i.empty?4:5),wI(6),Ng("cdkConnectedOverlayDisableClose",true)("cdkConnectedOverlayPanelClass",i._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",i._scrollStrategy)("cdkConnectedOverlayOrigin",i._preferredOverlayOrigin||r)("cdkConnectedOverlayPositions",i._positions)("cdkConnectedOverlayWidth",i._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",true)("cdkConnectedOverlayUsePopover",i._popoverLocation);}},dependencies:[Ge,$t],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2})}return o})();var dr=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=No$1({type:o});static \u0275inj=ir$1({imports:[Zn,ei,B,Wt,Fe,ei]})}return o})();var tn=class{constructor(n){this.config=n;}config;useOverlay;title="";text="";html="";backdrop=true;icon;width;allowOutsideClick=true;allowEscapeKey=true;allowEnterKey=true;showConfirmButton=true;showDenyButton=false;showCancelButton=false;confirmButtonText="Ok";denyButtonText="No";cancelButtonText="Cancel";confirmButtonColor;denyButtonColor;cancelButtonColor;confirmButtonAriaLabel="";denyButtonAriaLabel="";cancelButtonAriaLabel="";reverseButtons=false;showCloseButton=false;containerClass=""};var mr=class o{sourceFiles=[{label:"TS",path:"/examples/message/message.ts",language:"typescript"},{label:"HTML",path:"/examples/message/message.html",language:"html"}];options=new tn;result;constructor(){this.options.title="Message Title",this.options.text="Message Body",this.options.icon="success",this.options.useOverlay=true,this.options.showCloseButton=true,this.options.showCancelButton=true;}ngOnInit(){}openModal(){a.show(this.options).afterClose.subscribe(n=>{this.result=n;});}showLoading(){let n=a.fire({icon:"loading",text:"Please Wait...",showConfirmButton:false,allowEnterKey:false,allowEscapeKey:false,allowOutsideClick:false,showCloseButton:false});n.afterClose.subscribe(e=>{console.log(e);}),setTimeout(()=>{n.close();},5e3);}static \u0275fac=function(e){return new(e||o)};static \u0275cmp=Xw({type:o,selectors:[["app-message"]],features:[IT([])],decls:74,vars:26,consts:[["title","Message","readmePath","/readmes/message/README.md",3,"files"],[1,"configuration"],["appearance","outline"],["matInput","","type","text","name","title",3,"ngModelChange","ngModel"],["matInput","","type","text","name","text",3,"ngModelChange","ngModel"],["matInput","","type","text","name","html",3,"ngModelChange","ngModel"],["type","text","name","icon",3,"ngModelChange","ngModel"],[3,"value"],["name","showCloseButton",3,"ngModelChange","ngModel"],["name","allowOutsideClick",3,"ngModelChange","ngModel"],["name","allowEnterKey",3,"ngModelChange","ngModel"],["name","allowEscapeKey",3,"ngModelChange","ngModel"],["name","showConfirmButton",3,"ngModelChange","ngModel"],["matInput","","type","text","name","confirmButtonText",3,"ngModelChange","ngModel"],[3,"ngModelChange","ngModel"],["matInput","","type","text","name","cancelButtonText",3,"ngModelChange","ngModel"],["mat-raised-button","","color","primary",1,"btn-demo",3,"click"],["dir","ltr",2,"text-align","left"]],template:function(e,t){e&1&&(Ts(0,"app-example-showcase",0)(1,"div",1)(2,"mat-form-field",2)(3,"mat-label"),uT(4,"Title"),El(),Ts(5,"input",3),nm("ngModelChange",function(r){return hT(t.options.title,r)||(t.options.title=r),r}),El(),uw(),El(),Ts(6,"mat-form-field",2)(7,"mat-label"),uT(8,"Text"),El(),Ts(9,"input",4),nm("ngModelChange",function(r){return hT(t.options.text,r)||(t.options.text=r),r}),El(),uw(),El(),Ts(10,"mat-form-field",2)(11,"mat-label"),uT(12,"Html"),El(),Ts(13,"input",5),nm("ngModelChange",function(r){return hT(t.options.html,r)||(t.options.html=r),r}),El(),uw(),El(),Ts(14,"mat-form-field",2)(15,"mat-label"),uT(16,"Icon"),El(),Ts(17,"mat-select",6),nm("ngModelChange",function(r){return hT(t.options.icon,r)||(t.options.icon=r),r}),Ts(18,"mat-option",7),uT(19,"None"),El(),Ts(20,"mat-option",7),uT(21,"Success"),El(),Ts(22,"mat-option",7),uT(23,"Error"),El(),Ts(24,"mat-option",7),uT(25,"Info"),El(),Ts(26,"mat-option",7),uT(27,"Warning"),El(),Ts(28,"mat-option",7),uT(29,"Question"),El(),Ts(30,"mat-option",7),uT(31,"Loading"),El()(),uw(),El()(),Ts(32,"div")(33,"mat-checkbox",8),nm("ngModelChange",function(r){return hT(t.options.showCloseButton,r)||(t.options.showCloseButton=r),r}),uT(34," Show Close Button "),El(),uw(),Ts(35,"mat-checkbox",9),nm("ngModelChange",function(r){return hT(t.options.allowOutsideClick,r)||(t.options.allowOutsideClick=r),r}),uT(36," Allow Outside Click "),El(),uw(),Ts(37,"mat-checkbox",10),nm("ngModelChange",function(r){return hT(t.options.allowEnterKey,r)||(t.options.allowEnterKey=r),r}),uT(38," Allow Enter Key "),El(),uw(),Ts(39,"mat-checkbox",11),nm("ngModelChange",function(r){return hT(t.options.allowEscapeKey,r)||(t.options.allowEscapeKey=r),r}),uT(40," Allow Escape Key "),El(),uw(),El(),Ts(41,"div",1)(42,"mat-checkbox",12),nm("ngModelChange",function(r){return hT(t.options.showConfirmButton,r)||(t.options.showConfirmButton=r),r}),uT(43," Show confirm button "),El(),uw(),Ts(44,"mat-form-field",2)(45,"mat-label"),uT(46,"Text"),El(),Ts(47,"input",13),nm("ngModelChange",function(r){return hT(t.options.confirmButtonText,r)||(t.options.confirmButtonText=r),r}),El(),uw(),El()(),Ts(48,"div",1)(49,"mat-checkbox",14),nm("ngModelChange",function(r){return hT(t.options.showCancelButton,r)||(t.options.showCancelButton=r),r}),uT(50,"Show Cancel button"),El(),uw(),Ts(51,"mat-form-field",2)(52,"mat-label"),uT(53,"Text"),El(),Ts(54,"input",15),nm("ngModelChange",function(r){return hT(t.options.cancelButtonText,r)||(t.options.cancelButtonText=r),r}),El(),uw(),El()(),Ts(55,"div",1)(56,"mat-checkbox",14),nm("ngModelChange",function(r){return hT(t.options.showDenyButton,r)||(t.options.showDenyButton=r),r}),uT(57,"Show Deny button"),El(),uw(),Ts(58,"mat-form-field",2)(59,"mat-label"),uT(60,"Text"),El(),Ts(61,"input",15),nm("ngModelChange",function(r){return hT(t.options.denyButtonText,r)||(t.options.denyButtonText=r),r}),El(),uw(),El()(),Ts(62,"div",1)(63,"mat-checkbox",14),nm("ngModelChange",function(r){return hT(t.options.useOverlay,r)||(t.options.useOverlay=r),r}),uT(64,' Use Overlay popover (add popover="manual" to show dialog in top layer) '),El(),uw(),El(),Ts(65,"button",16),Pg("click",function(){return t.openModal()}),uT(66," Show Alert "),El(),Ts(67,"h5"),uT(68,"Result:"),El(),Ts(69,"pre",17),uT(70),_T(71,"json"),El(),Ts(72,"button",16),Pg("click",function(){return t.showLoading()}),uT(73," Show loading with 5 seconds "),El()()),e&2&&(Ng("files",t.sourceFiles),wI(5),tm("ngModel",t.options.title),dw(),wI(4),tm("ngModel",t.options.text),dw(),wI(4),tm("ngModel",t.options.html),dw(),wI(4),tm("ngModel",t.options.icon),dw(),wI(),Ng("value",""),wI(2),Ng("value","success"),wI(2),Ng("value","error"),wI(2),Ng("value","info"),wI(2),Ng("value","warning"),wI(2),Ng("value","question"),wI(2),Ng("value","loading"),wI(3),tm("ngModel",t.options.showCloseButton),dw(),wI(2),tm("ngModel",t.options.allowOutsideClick),dw(),wI(2),tm("ngModel",t.options.allowEnterKey),dw(),wI(2),tm("ngModel",t.options.allowEscapeKey),dw(),wI(3),tm("ngModel",t.options.showConfirmButton),dw(),wI(5),tm("ngModel",t.options.confirmButtonText),dw(),wI(2),tm("ngModel",t.options.showCancelButton),dw(),wI(5),tm("ngModel",t.options.cancelButtonText),dw(),wI(2),tm("ngModel",t.options.showDenyButton),dw(),wI(5),tm("ngModel",t.options.denyButtonText),dw(),wI(2),tm("ngModel",t.options.useOverlay),dw(),wI(7),Xg(MT(71,24,t.result)));},dependencies:[ty,an,ot$1,Ji,_i,Fe,Vt,st,po,Lo,No,go,_o,dr,cr,Xe,yo,Ln,od,Vb],styles:[".configuration[_ngcontent-%COMP%]{display:flex;gap:20px;flex-wrap:wrap;align-items:center}"]})};export{mr as MessageComponent};