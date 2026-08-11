import {s as sC,a_ as Mg,g as $C,L as Lg,z as zC,C as Cl,T as Tl,d as bC,X as Xg,x as xI,_ as _C,a7 as bt,Y as Ye$1,ab as Ar,ac as NT,ax as kg,R as Ro,r as sr,v as v$1,a6 as Rt,bk as ae,b1 as I$1,a9 as Ao,G as GB,bv as yb,j as sT,b6 as lo,b4 as v2,bD as et$1,bN as yr,$,bO as pS,ba as se$1,be as ge$1,bd as Or,bc as KB,at as B$1,aF as de$1,bK as ba,aK as qd,bB as On,bz as vb,bH as wD,bP as Pe$1,bA as te,bQ as fs,bt as Er,V as Vc,bR as jr,bS as Ov,bT as bv,bU as fo,aH as Zd,bV as Cv,aM as Lt,aL as fe$1}from'./main-5O2UVD2T.js';var Re=new I$1("cdk-dir-doc",{providedIn:"root",factory:()=>v$1($)}),Fe=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function ft(n){let a=n?.toLowerCase()||"";return a==="auto"&&typeof navigator<"u"&&navigator?.language?Fe.test(navigator.language)?"rtl":"ltr":a==="rtl"?"rtl":"ltr"}var ie=(()=>{class n{get value(){return this.valueSignal()}valueSignal=Ye$1("ltr");change=new bt;constructor(){let t=v$1(Re,{optional:true});if(t){let e=t.body?t.body.dir:null,o=t.documentElement?t.documentElement.dir:null;this.valueSignal.set(ft(e||o||"ltr"));}}ngOnDestroy(){this.change.complete();}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var bn=(()=>{class n{_isInitialized=false;_rawDir="";change=new bt;get dir(){return this.valueSignal()}set dir(t){let e=this.valueSignal();this.valueSignal.set(ft(t)),this._rawDir=t,e!==this.valueSignal()&&this._isInitialized&&this.change.emit(this.valueSignal());}get value(){return this.dir}valueSignal=Ye$1("ltr");ngAfterContentInit(){this._isInitialized=true;}ngOnDestroy(){this.change.complete();}static \u0275fac=function(e){return new(e||n)};static \u0275dir=Ar({type:n,selectors:[["","dir",""]],hostVars:1,hostBindings:function(e,o){e&2&&kg("dir",o._rawDir);},inputs:{dir:"dir"},outputs:{change:"dirChange"},exportAs:["dir"],features:[NT([{provide:ie,useExisting:n}])]})}return n})(),J=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=Ro({type:n});static \u0275inj=sr({})}return n})();function z(n){return n.buttons===0||n.detail===0}function j(n){let a=n.touches&&n.touches[0]||n.changedTouches&&n.changedTouches[0];return !!a&&a.identifier===-1&&(a.radiusX==null||a.radiusX===1)&&(a.radiusY==null||a.radiusY===1)}var ht;function re(){if(ht==null){let n=typeof document<"u"?document.head:null;ht=!!(n&&(n.createShadowRoot||n.attachShadow));}return ht}function vt(n){if(re()){let a=n.getRootNode?n.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&a instanceof ShadowRoot)return a}return null}function h(n){if(n.composedPath)try{return n.composedPath()[0]}catch{}return n.target}var gt;try{gt=typeof Intl<"u"&&Intl.v8BreakIterator;}catch{gt=false;}var v=(()=>{class n{_platformId=v$1(lo);isBrowser=this._platformId?v2(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||gt)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var H;function se(){if(H==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>H=!0}));}finally{H=H||false;}return H}function L(n){return se()?n:!!n.capture}function I(n){return n instanceof Rt?n.nativeElement:n}var ce=new I$1("cdk-input-modality-detector-options"),de={ignoreKeys:[18,17,224,91,16]},me=650,_t={passive:true,capture:true},le=(()=>{class n{_platform=v$1(v);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new jr(null);_options;_lastTouchMs=0;_onKeydown=t=>{this._options?.ignoreKeys?.some(e=>e===t.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=h(t));};_onMousedown=t=>{Date.now()-this._lastTouchMs<me||(this._modality.next(z(t)?"keyboard":"mouse"),this._mostRecentTarget=h(t));};_onTouchstart=t=>{if(j(t)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=h(t);};constructor(){let t=v$1(ae),e=v$1($),o=v$1(ce,{optional:true});if(this._options=B$1(B$1({},de),o),this.modalityDetected=this._modality.pipe(Ov(1)),this.modalityChanged=this.modalityDetected.pipe(bv()),this._platform.isBrowser){let i=v$1(On).createRenderer(null,null);this._listenerCleanups=t.runOutsideAngular(()=>[i.listen(e,"keydown",this._onKeydown,_t),i.listen(e,"mousedown",this._onMousedown,_t),i.listen(e,"touchstart",this._onTouchstart,_t)]);}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(t=>t());}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})(),K=(function(n){return n[n.IMMEDIATE=0]="IMMEDIATE",n[n.EVENTUAL=1]="EVENTUAL",n})(K||{}),ue=new I$1("cdk-focus-monitor-default-options"),tt=L({passive:true,capture:true}),yt=(()=>{class n{_ngZone=v$1(ae);_platform=v$1(v);_inputModalityDetector=v$1(le);_origin=null;_lastFocusOrigin=null;_windowFocused=false;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=false;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=true,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=false);};_document=v$1($);_stopInputModalityDetector=new de$1;constructor(){let t=v$1(ue,{optional:true});this._detectionMode=t?.detectionMode||K.IMMEDIATE;}_rootNodeFocusAndBlurListener=t=>{let e=h(t);for(let o=e;o;o=o.parentElement)t.type==="focus"?this._onFocus(t,o):this._onBlur(t,o);};monitor(t,e=false){let o=I(t);if(!this._platform.isBrowser||o.nodeType!==1)return ba();let i=vt(o)||this._document,s=this._elementInfo.get(o);if(s)return e&&(s.checkChildren=true),s.subject;let u={checkChildren:e,subject:new de$1,rootNode:i};return this._elementInfo.set(o,u),this._registerGlobalListeners(u),u.subject}stopMonitoring(t){let e=I(t),o=this._elementInfo.get(e);o&&(o.subject.complete(),this._setClasses(e),this._elementInfo.delete(e),this._removeGlobalListeners(o));}focusVia(t,e,o){let i=I(t),s=this._document.activeElement;i===s?this._getClosestElementsInfo(i).forEach(([u,R])=>this._originChanged(u,e,R)):(this._setOrigin(e),typeof i.focus=="function"&&i.focus(o));}ngOnDestroy(){this._elementInfo.forEach((t,e)=>this.stopMonitoring(e));}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(t){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(t)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:t&&this._isLastInteractionFromInputLabel(t)?"mouse":"program"}_shouldBeAttributedToTouch(t){return this._detectionMode===K.EVENTUAL||!!t?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(t,e){t.classList.toggle("cdk-focused",!!e),t.classList.toggle("cdk-touch-focused",e==="touch"),t.classList.toggle("cdk-keyboard-focused",e==="keyboard"),t.classList.toggle("cdk-mouse-focused",e==="mouse"),t.classList.toggle("cdk-program-focused",e==="program");}_setOrigin(t,e=false){this._ngZone.runOutsideAngular(()=>{if(this._origin=t,this._originFromTouchInteraction=t==="touch"&&e,this._detectionMode===K.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?me:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o);}});}_onFocus(t,e){let o=this._elementInfo.get(e),i=h(t);!o||!o.checkChildren&&e!==i||this._originChanged(e,this._getFocusOrigin(i),o);}_onBlur(t,e){let o=this._elementInfo.get(e);!o||o.checkChildren&&t.relatedTarget instanceof Node&&e.contains(t.relatedTarget)||(this._setClasses(e),this._emitOrigin(o,null));}_emitOrigin(t,e){t.subject.observers.length&&this._ngZone.run(()=>t.subject.next(e));}_registerGlobalListeners(t){if(!this._platform.isBrowser)return;let e=t.rootNode,o=this._rootNodeFocusListenerCount.get(e)||0;o||this._ngZone.runOutsideAngular(()=>{e.addEventListener("focus",this._rootNodeFocusAndBlurListener,tt),e.addEventListener("blur",this._rootNodeFocusAndBlurListener,tt);}),this._rootNodeFocusListenerCount.set(e,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener);}),this._inputModalityDetector.modalityDetected.pipe(qd(this._stopInputModalityDetector)).subscribe(i=>{this._setOrigin(i,true);}));}_removeGlobalListeners(t){let e=t.rootNode;if(this._rootNodeFocusListenerCount.has(e)){let o=this._rootNodeFocusListenerCount.get(e);o>1?this._rootNodeFocusListenerCount.set(e,o-1):(e.removeEventListener("focus",this._rootNodeFocusAndBlurListener,tt),e.removeEventListener("blur",this._rootNodeFocusAndBlurListener,tt),this._rootNodeFocusListenerCount.delete(e));}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId));}_originChanged(t,e,o){this._setClasses(t,e),this._emitOrigin(o,e),this._lastFocusOrigin=e;}_getClosestElementsInfo(t){let e=[];return this._elementInfo.forEach((o,i)=>{(i===t||o.checkChildren&&i.contains(t))&&e.push([i,o]);}),e}_isLastInteractionFromInputLabel(t){let{_mostRecentTarget:e,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!e||e===t||t.nodeName!=="INPUT"&&t.nodeName!=="TEXTAREA"||t.disabled)return  false;let i=t.labels;if(i){for(let s=0;s<i.length;s++)if(i[s].contains(e))return  true}return  false}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var et=new WeakMap,V=(()=>{class n{_appRef;_injector=v$1(se$1);_environmentInjector=v$1(ge$1);load(t){let e=this._appRef=this._appRef||this._injector.get(Or),o=et.get(e);o||(o={loaders:new Set,refs:[]},et.set(e,o),e.onDestroy(()=>{et.get(e)?.refs.forEach(i=>i.destroy()),et.delete(e);})),o.loaders.has(t)||(o.loaders.add(t),o.refs.push(KB(t,{environmentInjector:this._environmentInjector})));}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var Se=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=sC({type:n,selectors:[["ng-component"]],exportAs:["cdkVisuallyHidden"],decls:0,vars:0,template:function(e,o){},styles:[`.cdk-visually-hidden {
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
`],encapsulation:2})}return n})(),nt;function Le(){if(nt===void 0&&(nt=null,typeof window<"u")){let n=window;if(n.trustedTypes!==void 0)try{nt=n.trustedTypes.createPolicy("angular#components",{createHTML:a=>a});}catch(a){console.error(a);}}return nt}function Pe(n){return Le()?.createHTML(n)||n}function be(n,a,t){let e=t.sanitize(Pe$1.HTML,a);n.innerHTML=Pe(e||"");}function Qn(n){return Array.isArray(n)?n:[n]}var pe=new Set,O,xt=(()=>{class n{_platform=v$1(v);_nonce=v$1(fo,{optional:true});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):Ue;}matchMedia(t){return (this._platform.WEBKIT||this._platform.BLINK)&&Be(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();function Be(n,a){if(!pe.has(n))try{O||(O=document.createElement("style"),a&&O.setAttribute("nonce",a),O.setAttribute("type","text/css"),document.head.appendChild(O)),O.sheet&&(O.sheet.insertRule(`@media ${n.replace(/[{}]/g,"")} {body{ }}`,0),pe.add(n));}catch(t){console.error(t);}}function Ue(n){return {matches:n==="all"||n==="",media:n,addListener:()=>{},removeListener:()=>{}}}var ze=(()=>{class n{create(t){return typeof MutationObserver>"u"?null:new MutationObserver(t)}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var na=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=Ro({type:n});static \u0275inj=sr({providers:[ze]})}return n})();var fe=new I$1("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),he=new I$1("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),je=0,He=(()=>{class n{_ngZone=v$1(ae);_defaultOptions=v$1(he,{optional:true});_liveElement;_document=v$1($);_sanitizer=v$1(pS);_previousTimeout;_currentPromise;_currentResolve;constructor(){let t=v$1(fe,{optional:true});this._liveElement=t||this._createLiveElement();}announce(t,...e){let o=this._defaultOptions,i,s;return e.length===1&&typeof e[0]=="number"?s=e[0]:[i,s]=e,this.clear(),clearTimeout(this._previousTimeout),i||(i=o&&o.politeness?o.politeness:"polite"),s==null&&o&&(s=o.duration),this._liveElement.setAttribute("aria-live",i),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(u=>this._currentResolve=u)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!t||typeof t=="string"?this._liveElement.textContent=t:be(this._liveElement,t,this._sanitizer),typeof s=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),s)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0;},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="");}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0;}_createLiveElement(){let t="cdk-live-announcer-element",e=this._document.getElementsByClassName(t),o=this._document.createElement("div");for(let i=0;i<e.length;i++)e[i].remove();return o.classList.add(t),o.classList.add("cdk-visually-hidden"),o.setAttribute("aria-atomic","true"),o.setAttribute("aria-live","polite"),o.id=`cdk-live-announcer-${je++}`,this._document.body.appendChild(o),o}_exposeAnnouncerToModals(t){let e=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let o=0;o<e.length;o++){let i=e[o],s=i.getAttribute("aria-owns");s?s.indexOf(t)===-1&&i.setAttribute("aria-owns",s+" "+t):i.setAttribute("aria-owns",t);}}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var Ke=200,at=class{_letterKeyStream=new de$1;_items=[];_selectedItemIndex=-1;_pressedLetters=[];_skipPredicateFn;_selectedItem=new de$1;selectedItem=this._selectedItem;constructor(a,t){let e=typeof t?.debounceInterval=="number"?t.debounceInterval:Ke;t?.skipPredicate&&(this._skipPredicateFn=t.skipPredicate),this.setItems(a),this._setupKeyHandler(e);}destroy(){this._pressedLetters=[],this._letterKeyStream.complete(),this._selectedItem.complete();}setCurrentSelectedItemIndex(a){this._selectedItemIndex=a;}setItems(a){this._items=a;}handleKey(a){let t=a.keyCode;a.key&&a.key.length===1?this._letterKeyStream.next(a.key.toLocaleUpperCase()):(t>=65&&t<=90||t>=48&&t<=57)&&this._letterKeyStream.next(String.fromCharCode(t));}isTyping(){return this._pressedLetters.length>0}reset(){this._pressedLetters=[];}_setupKeyHandler(a){this._letterKeyStream.pipe(Zd(t=>this._pressedLetters.push(t)),Cv(a),Lt(()=>this._pressedLetters.length>0),fe$1(()=>this._pressedLetters.join("").toLocaleUpperCase())).subscribe(t=>{for(let e=1;e<this._items.length+1;e++){let o=(this._selectedItemIndex+e)%this._items.length,i=this._items[o];if(!this._skipPredicateFn?.(i)&&i.getLabel?.().toLocaleUpperCase().trim().indexOf(t)===0){this._selectedItem.next(i);break}}this._pressedLetters=[];});}};function ve(n,...a){return a.length?a.some(t=>n[t]):n.altKey||n.shiftKey||n.ctrlKey||n.metaKey}var ot=class{_items;_activeItemIndex=Ye$1(-1);_activeItem=Ye$1(null);_wrap=false;_typeaheadSubscription=te.EMPTY;_itemChangesSubscription;_vertical=true;_horizontal=null;_allowedModifierKeys=[];_homeAndEnd=false;_pageUpAndDown={enabled:false,delta:10};_effectRef;_typeahead;_skipPredicateFn=a=>a.disabled;constructor(a,t){this._items=a,a instanceof fs?this._itemChangesSubscription=a.changes.subscribe(e=>this._itemsChanged(e.toArray())):Er(a)&&(this._effectRef=Vc(()=>this._itemsChanged(a()),{injector:t}));}tabOut=new de$1;change=new de$1;skipPredicate(a){return this._skipPredicateFn=a,this}withWrap(a=true){return this._wrap=a,this}withVerticalOrientation(a=true){return this._vertical=a,this}withHorizontalOrientation(a){return this._horizontal=a,this}withAllowedModifierKeys(a){return this._allowedModifierKeys=a,this}withTypeAhead(a=200){this._typeaheadSubscription.unsubscribe();let t=this._getItemsArray();return this._typeahead=new at(t,{debounceInterval:typeof a=="number"?a:void 0,skipPredicate:e=>this._skipPredicateFn(e)}),this._typeaheadSubscription=this._typeahead.selectedItem.subscribe(e=>{this.setActiveItem(e);}),this}cancelTypeahead(){return this._typeahead?.reset(),this}withHomeAndEnd(a=true){return this._homeAndEnd=a,this}withPageUpDown(a=true,t=10){return this._pageUpAndDown={enabled:a,delta:t},this}setActiveItem(a){let t=this._activeItem();this.updateActiveItem(a),this._activeItem()!==t&&this.change.next(this._activeItemIndex());}onKeydown(a){let t=a.keyCode,o=["altKey","ctrlKey","metaKey","shiftKey"].every(i=>!a[i]||this._allowedModifierKeys.indexOf(i)>-1);switch(t){case 9:this.tabOut.next();return;case 40:if(this._vertical&&o){this.setNextItemActive();break}else return;case 38:if(this._vertical&&o){this.setPreviousItemActive();break}else return;case 39:if(this._horizontal&&o){this._horizontal==="rtl"?this.setPreviousItemActive():this.setNextItemActive();break}else return;case 37:if(this._horizontal&&o){this._horizontal==="rtl"?this.setNextItemActive():this.setPreviousItemActive();break}else return;case 36:if(this._homeAndEnd&&o){this.setFirstItemActive();break}else return;case 35:if(this._homeAndEnd&&o){this.setLastItemActive();break}else return;case 33:if(this._pageUpAndDown.enabled&&o){let i=this._activeItemIndex()-this._pageUpAndDown.delta;this._setActiveItemByIndex(i>0?i:0,1);break}else return;case 34:if(this._pageUpAndDown.enabled&&o){let i=this._activeItemIndex()+this._pageUpAndDown.delta,s=this._getItemsArray().length;this._setActiveItemByIndex(i<s?i:s-1,-1);break}else return;default:(o||ve(a,"shiftKey"))&&this._typeahead?.handleKey(a);return}this._typeahead?.reset(),a.preventDefault();}get activeItemIndex(){return this._activeItemIndex()}get activeItem(){return this._activeItem()}isTyping(){return !!this._typeahead&&this._typeahead.isTyping()}setFirstItemActive(){this._setActiveItemByIndex(0,1);}setLastItemActive(){this._setActiveItemByIndex(this._getItemsArray().length-1,-1);}setNextItemActive(){this._activeItemIndex()<0?this.setFirstItemActive():this._setActiveItemByDelta(1);}setPreviousItemActive(){this._activeItemIndex()<0&&this._wrap?this.setLastItemActive():this._setActiveItemByDelta(-1);}updateActiveItem(a){let t=this._getItemsArray(),e=typeof a=="number"?a:t.indexOf(a),o=t[e];this._activeItem.set(o??null),this._activeItemIndex.set(e),this._typeahead?.setCurrentSelectedItemIndex(e);}destroy(){this._typeaheadSubscription.unsubscribe(),this._itemChangesSubscription?.unsubscribe(),this._effectRef?.destroy(),this._typeahead?.destroy(),this.tabOut.complete(),this.change.complete();}_setActiveItemByDelta(a){this._wrap?this._setActiveInWrapMode(a):this._setActiveInDefaultMode(a);}_setActiveInWrapMode(a){let t=this._getItemsArray();for(let e=1;e<=t.length;e++){let o=(this._activeItemIndex()+a*e+t.length)%t.length,i=t[o];if(!this._skipPredicateFn(i)){this.setActiveItem(o);return}}}_setActiveInDefaultMode(a){this._setActiveItemByIndex(this._activeItemIndex()+a,a);}_setActiveItemByIndex(a,t){let e=this._getItemsArray();if(e[a]){for(;this._skipPredicateFn(e[a]);)if(a+=t,!e[a])return;this.setActiveItem(a);}}_getItemsArray(){return Er(this._items)?this._items():this._items instanceof fs?this._items.toArray():this._items}_itemsChanged(a){this._typeahead?.setItems(a);let t=this._activeItem();if(t){let e=a.indexOf(t);e>-1&&e!==this._activeItemIndex()&&(this._activeItemIndex.set(e),this._typeahead?.setCurrentSelectedItemIndex(e));}}};var Et=class extends ot{setActiveItem(a){this.activeItem&&this.activeItem.setInactiveStyles(),super.setActiveItem(a),this.activeItem&&this.activeItem.setActiveStyles();}};var ge=new Map,wt=class n{_appId=v$1(yr);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(a,t=false){this._appId!=="ng"&&(a+=this._appId);let e=ge.get(a);return e===void 0?e=0:e++,ge.set(a,e),`${a}${t?n._infix+"-":""}${e}`}static \u0275fac=function(t){return new(t||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})};var N;function eo(){if(N==null){if(typeof document!="object"||!document||typeof Element!="function"||!Element)return N=false,N;if(document.documentElement?.style&&"scrollBehavior"in document.documentElement.style)N=true;else {let n=Element.prototype.scrollTo;n?N=!/\{\s*\[native code\]\s*\}/.test(n.toString()):N=false;}}return N}function ao(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}var P,_e=["color","button","checkbox","date","datetime-local","email","file","hidden","image","month","number","password","radio","range","reset","search","submit","tel","text","time","url","week"];function ro(){if(P)return P;if(typeof document!="object"||!document)return P=new Set(_e),P;let n=document.createElement("input");return P=new Set(_e.filter(a=>(n.setAttribute("type",a),n.type===a))),P}var Ve=new I$1("MATERIAL_ANIMATIONS"),ye=null;function We(){return v$1(Ve,{optional:true})?.animationsDisabled||v$1(wD,{optional:true})==="NoopAnimations"?"di-disabled":(ye??=v$1(xt).matchMedia("(prefers-reduced-motion)").matches,ye?"reduced-motion":"enabled")}function B(){return We()!=="enabled"}function go(n){return n==null?"":typeof n=="string"?n:`${n}px`}function Eo(n){return n!=null&&`${n}`!="false"}var f=(function(n){return n[n.FADING_IN=0]="FADING_IN",n[n.VISIBLE=1]="VISIBLE",n[n.FADING_OUT=2]="FADING_OUT",n[n.HIDDEN=3]="HIDDEN",n})(f||{}),At=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=f.HIDDEN;constructor(a,t,e,o=false){this._renderer=a,this.element=t,this.config=e,this._animationForciblyDisabledThroughCss=o;}fadeOut(){this._renderer.fadeOutRipple(this);}},xe=L({passive:true,capture:true}),It=class{_events=new Map;addHandler(a,t,e,o){let i=this._events.get(t);if(i){let s=i.get(e);s?s.add(o):i.set(e,new Set([o]));}else this._events.set(t,new Map([[e,new Set([o])]])),a.runOutsideAngular(()=>{document.addEventListener(t,this._delegateEventHandler,xe);});}removeHandler(a,t,e){let o=this._events.get(a);if(!o)return;let i=o.get(t);i&&(i.delete(e),i.size===0&&o.delete(t),o.size===0&&(this._events.delete(a),document.removeEventListener(a,this._delegateEventHandler,xe)));}_delegateEventHandler=a=>{let t=h(a);t&&this._events.get(a.type)?.forEach((e,o)=>{(o===t||o.contains(t))&&e.forEach(i=>i.handleEvent(a));});}},W={enterDuration:225,exitDuration:150},Ze=800,Ee=L({passive:true,capture:true}),we=["mousedown","touchstart"],Ae=["mouseup","mouseleave","touchend","touchcancel"],Ge=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=sC({type:n,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(e,o){},styles:[`.mat-ripple {
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
`],encapsulation:2})}return n})(),Z=class n{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=false;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=false;_containerRect=null;static _eventManager=new It;constructor(a,t,e,o,i){this._target=a,this._ngZone=t,this._platform=o,o.isBrowser&&(this._containerElement=I(e)),i&&i.get(V).load(Ge);}fadeInRipple(a,t,e={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),i=B$1(B$1({},W),e.animation);e.centered&&(a=o.left+o.width/2,t=o.top+o.height/2);let s=e.radius||$e(a,t,o),u=a-o.left,R=t-o.top,T=i.enterDuration,b=document.createElement("div");b.classList.add("mat-ripple-element"),b.style.left=`${u-s}px`,b.style.top=`${R-s}px`,b.style.height=`${s*2}px`,b.style.width=`${s*2}px`,e.color!=null&&(b.style.backgroundColor=e.color),b.style.transitionDuration=`${T}ms`,this._containerElement.appendChild(b);let kt=window.getComputedStyle(b),Ne=kt.transitionProperty,Ct=kt.transitionDuration,rt=Ne==="none"||Ct==="0s"||Ct==="0s, 0s"||o.width===0&&o.height===0,M=new At(this,b,e,rt);b.style.transform="scale3d(1, 1, 1)",M.state=f.FADING_IN,e.persistent||(this._mostRecentTransientRipple=M);let G=null;return !rt&&(T||i.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let Ot=()=>{G&&(G.fallbackTimer=null),clearTimeout(Nt),this._finishRippleTransition(M);},st=()=>this._destroyRipple(M),Nt=setTimeout(st,T+100);b.addEventListener("transitionend",Ot),b.addEventListener("transitioncancel",st),G={onTransitionEnd:Ot,onTransitionCancel:st,fallbackTimer:Nt};}),this._activeRipples.set(M,G),(rt||!T)&&this._finishRippleTransition(M),M}fadeOutRipple(a){if(a.state===f.FADING_OUT||a.state===f.HIDDEN)return;let t=a.element,e=B$1(B$1({},W),a.config.animation);t.style.transitionDuration=`${e.exitDuration}ms`,t.style.opacity="0",a.state=f.FADING_OUT,(a._animationForciblyDisabledThroughCss||!e.exitDuration)&&this._finishRippleTransition(a);}fadeOutAll(){this._getActiveRipples().forEach(a=>a.fadeOut());}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(a=>{a.config.persistent||a.fadeOut();});}setupTriggerEvents(a){let t=I(a);!this._platform.isBrowser||!t||t===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=t,we.forEach(e=>{n._eventManager.addHandler(this._ngZone,e,t,this);}));}handleEvent(a){a.type==="mousedown"?this._onMousedown(a):a.type==="touchstart"?this._onTouchStart(a):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{Ae.forEach(t=>{this._triggerElement.addEventListener(t,this,Ee);});}),this._pointerUpEventsRegistered=true);}_finishRippleTransition(a){a.state===f.FADING_IN?this._startFadeOutTransition(a):a.state===f.FADING_OUT&&this._destroyRipple(a);}_startFadeOutTransition(a){let t=a===this._mostRecentTransientRipple,{persistent:e}=a.config;a.state=f.VISIBLE,!e&&(!t||!this._isPointerDown)&&a.fadeOut();}_destroyRipple(a){let t=this._activeRipples.get(a)??null;this._activeRipples.delete(a),this._activeRipples.size||(this._containerRect=null),a===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),a.state=f.HIDDEN,t!==null&&(a.element.removeEventListener("transitionend",t.onTransitionEnd),a.element.removeEventListener("transitioncancel",t.onTransitionCancel),t.fallbackTimer!==null&&clearTimeout(t.fallbackTimer)),a.element.remove();}_onMousedown(a){let t=z(a),e=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+Ze;!this._target.rippleDisabled&&!t&&!e&&(this._isPointerDown=true,this.fadeInRipple(a.clientX,a.clientY,this._target.rippleConfig));}_onTouchStart(a){if(!this._target.rippleDisabled&&!j(a)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=true;let t=a.changedTouches;if(t)for(let e=0;e<t.length;e++)this.fadeInRipple(t[e].clientX,t[e].clientY,this._target.rippleConfig);}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=false,this._getActiveRipples().forEach(a=>{let t=a.state===f.VISIBLE||a.config.terminateOnPointerUp&&a.state===f.FADING_IN;!a.config.persistent&&t&&a.fadeOut();}));}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let a=this._triggerElement;a&&(we.forEach(t=>n._eventManager.removeHandler(t,a,this)),this._pointerUpEventsRegistered&&(Ae.forEach(t=>a.removeEventListener(t,this,Ee)),this._pointerUpEventsRegistered=false));}};function $e(n,a,t){let e=Math.max(Math.abs(n-t.left),Math.abs(n-t.right)),o=Math.max(Math.abs(a-t.top),Math.abs(a-t.bottom));return Math.sqrt(e*e+o*o)}var Tt=new I$1("mat-ripple-global-options"),So=(()=>{class n{_elementRef=v$1(Rt);_animationsDisabled=B();color;unbounded=false;centered=false;radius=0;animation;get disabled(){return this._disabled}set disabled(t){t&&this.fadeOutAllNonPersistent(),this._disabled=t,this._setupTriggerEventsIfEnabled();}_disabled=false;get trigger(){return this._trigger||this._elementRef.nativeElement}set trigger(t){this._trigger=t,this._setupTriggerEventsIfEnabled();}_trigger;_rippleRenderer;_globalOptions;_isInitialized=false;constructor(){let t=v$1(ae),e=v$1(v),o=v$1(Tt,{optional:true}),i=v$1(se$1);this._globalOptions=o||{},this._rippleRenderer=new Z(this,t,this._elementRef,e,i);}ngOnInit(){this._isInitialized=true,this._setupTriggerEventsIfEnabled();}ngOnDestroy(){this._rippleRenderer._removeTriggerEvents();}fadeOutAll(){this._rippleRenderer.fadeOutAll();}fadeOutAllNonPersistent(){this._rippleRenderer.fadeOutAllNonPersistent();}get rippleConfig(){return {centered:this.centered,radius:this.radius,color:this.color,animation:B$1(B$1(B$1({},this._globalOptions.animation),this._animationsDisabled?{enterDuration:0,exitDuration:0}:{}),this.animation),terminateOnPointerUp:this._globalOptions.terminateOnPointerUp}}get rippleDisabled(){return this.disabled||!!this._globalOptions.disabled}_setupTriggerEventsIfEnabled(){!this.disabled&&this._isInitialized&&this._rippleRenderer.setupTriggerEvents(this.trigger);}launch(t,e=0,o){return typeof t=="number"?this._rippleRenderer.fadeInRipple(t,e,B$1(B$1({},this.rippleConfig),o)):this._rippleRenderer.fadeInRipple(0,0,B$1(B$1({},this.rippleConfig),t))}static \u0275fac=function(e){return new(e||n)};static \u0275dir=Ar({type:n,selectors:[["","mat-ripple",""],["","matRipple",""]],hostAttrs:[1,"mat-ripple"],hostVars:2,hostBindings:function(e,o){e&2&&Xg("mat-ripple-unbounded",o.unbounded);},inputs:{color:[0,"matRippleColor","color"],unbounded:[0,"matRippleUnbounded","unbounded"],centered:[0,"matRippleCentered","centered"],radius:[0,"matRippleRadius","radius"],animation:[0,"matRippleAnimation","animation"],disabled:[0,"matRippleDisabled","disabled"],trigger:[0,"matRippleTrigger","trigger"]},exportAs:["matRipple"]})}return n})();var Ye={capture:true},Qe=["focus","mousedown","mouseenter","touchstart"],Mt="mat-ripple-loader-uninitialized",Dt="mat-ripple-loader-class-name",Ie="mat-ripple-loader-centered",it="mat-ripple-loader-disabled",Te=(()=>{class n{_document=v$1($);_animationsDisabled=B();_globalRippleOptions=v$1(Tt,{optional:true});_platform=v$1(v);_ngZone=v$1(ae);_injector=v$1(se$1);_eventCleanups;_hosts=new Map;constructor(){let t=v$1(On).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>Qe.map(e=>t.listen(this._document,e,this._onInteraction,Ye)));}ngOnDestroy(){let t=this._hosts.keys();for(let e of t)this.destroyRipple(e);this._eventCleanups.forEach(e=>e());}configureRipple(t,e){t.setAttribute(Mt,this._globalRippleOptions?.namespace??""),(e.className||!t.hasAttribute(Dt))&&t.setAttribute(Dt,e.className||""),e.centered&&t.setAttribute(Ie,""),e.disabled&&t.setAttribute(it,"");}setDisabled(t,e){let o=this._hosts.get(t);o?(o.target.rippleDisabled=e,!e&&!o.hasSetUpEvents&&(o.hasSetUpEvents=true,o.renderer.setupTriggerEvents(t))):e?t.setAttribute(it,""):t.removeAttribute(it);}_onInteraction=t=>{let e=h(t);if(e instanceof HTMLElement){let o=e.closest(`[${Mt}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o);}};_createRipple(t){if(!this._document||this._hosts.has(t))return;t.querySelector(".mat-ripple")?.remove();let e=this._document.createElement("span");e.classList.add("mat-ripple",t.getAttribute(Dt)),t.append(e);let o=this._globalRippleOptions,i=this._animationsDisabled?0:o?.animation?.enterDuration??W.enterDuration,s=this._animationsDisabled?0:o?.animation?.exitDuration??W.exitDuration,u={rippleDisabled:this._animationsDisabled||o?.disabled||t.hasAttribute(it),rippleConfig:{centered:t.hasAttribute(Ie),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:i,exitDuration:s}}},R=new Z(u,this._ngZone,e,this._platform,this._injector),T=!u.rippleDisabled;T&&R.setupTriggerEvents(t),this._hosts.set(t,{target:u,renderer:R,hasSetUpEvents:T}),t.removeAttribute(Mt);}destroyRipple(t){let e=this._hosts.get(t);e&&(e.renderer._removeTriggerEvents(),this._hosts.delete(t));}static \u0275fac=function(e){return new(e||n)};static \u0275prov=et$1({token:n,factory:n.\u0275fac})}return n})();var Me=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=sC({type:n,selectors:[["structural-styles"]],decls:0,vars:0,template:function(e,o){},styles:[`.mat-focus-indicator {
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
`],encapsulation:2})}return n})();var Xe=new I$1("MAT_BUTTON_CONFIG");function De(n){return n==null?void 0:vb(n)}var ke=(()=>{class n{_elementRef=v$1(Rt);_ngZone=v$1(ae);_animationsDisabled=B();_config=v$1(Xe,{optional:true});_focusMonitor=v$1(yt);_cleanupClick;_renderer=v$1(Ao);_rippleLoader=v$1(Te);_isAnchor;_isFab=false;color;get disableRipple(){return this._disableRipple}set disableRipple(t){this._disableRipple=t,this._updateRippleDisabled();}_disableRipple=false;get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._updateRippleDisabled();}_disabled=false;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(t){this.tabIndex=t;}showProgress=GB(false,{transform:yb});constructor(){v$1(V).load(Me);let t=this._elementRef.nativeElement;this._isAnchor=t.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??false,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(t,{className:"mat-mdc-button-ripple"});}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,true),this._isAnchor&&this._setupAsAnchor();}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);}focus(t="program",e){t?this._focusMonitor.focusVia(this._elementRef.nativeElement,t,e):this._elementRef.nativeElement.focus(e);}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?true:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:true}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled);}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation());}));}static \u0275fac=function(e){return new(e||n)};static \u0275dir=Ar({type:n,hostAttrs:[1,"mat-mdc-button-base"],hostVars:15,hostBindings:function(e,o){e&2&&(kg("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),sT(o.color?"mat-"+o.color:""),Xg("mat-mdc-button-progress-indicator-shown",o.showProgress())("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled));},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",yb],disabled:[2,"disabled","disabled",yb],ariaDisabled:[2,"aria-disabled","ariaDisabled",yb],disabledInteractive:[2,"disabledInteractive","disabledInteractive",yb],tabIndex:[2,"tabIndex","tabIndex",De],_tabindex:[2,"tabindex","_tabindex",De],showProgress:[1,"showProgress"]}})}return n})();var Ce=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=Ro({type:n});static \u0275inj=sr({imports:[J]})}return n})();var qe=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]],[["","progressIndicator",""]]],Je=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]","[progressIndicator]"];function tn(n,a){n&1&&(Cl(0,"div",2),zC(1,3),Tl());}var Oe=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),en=(()=>{class n extends ke{get appearance(){return this._appearance}set appearance(t){this.setAppearance(t||this._config?.defaultAppearance||"text");}_appearance=null;constructor(){super();let t=nn(this._elementRef.nativeElement);t&&this.setAppearance(t);}setAppearance(t){if(t===this._appearance)return;let e=this._elementRef.nativeElement.classList,o=this._appearance?Oe.get(this._appearance):null,i=Oe.get(t);o&&e.remove(...o),e.add(...i),this._appearance=t;}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=sC({type:n,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[Mg],ngContentSelectors:Je,decls:8,vars:5,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-mdc-button-progress-indicator-container"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(e,o){e&1&&($C(qe),Lg(0,"span",0),zC(1),Cl(2,"span",1),zC(3,1),Tl(),zC(4,2),bC(5,tn,2,0,"div",2),Lg(6,"span",3)(7,"span",4)),e&2&&(Xg("mdc-button__ripple",!o._isFab)("mdc-fab__ripple",o._isFab),xI(5),_C(o.showProgress()?5:-1));},styles:[`.mat-mdc-button-base {
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
`],encapsulation:2})}return n})();function nn(n){return n.hasAttribute("mat-raised-button")?"elevated":n.hasAttribute("mat-stroked-button")?"outlined":n.hasAttribute("mat-flat-button")?"filled":n.hasAttribute("mat-button")?"text":null}var ci=en;var di=(()=>{class n{static \u0275fac=function(e){return new(e||n)};static \u0275mod=Ro({type:n});static \u0275inj=sr({imports:[Ce,J]})}return n})();export{B,Ce as C,Eo as E,He as H,I,J,Me as M,Qn as Q,Se as S,V,ve as a,bn as b,ci as c,di as d,en as e,Et as f,So as g,h,ie as i,ao as j,go as k,eo as l,na as n,ro as r,v,wt as w};