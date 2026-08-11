import {b as bn$1,d as di,e as en$1,n as na,J,v as v$1,w as wt$1,E as Eo$1,B,i as ie,r as ro$1,H as He$1,a as ve,f as Et$1,h,V,M as Me,S as Se,g as So$1,I as I$1,C as Ce,j as ao$1,k as go$1,Q as Qn,l as eo$1}from'./chunk-BXTJUGBy.js';import {bj as i,s as sC,u as uy,O as an$1,Q as ot,a2 as Ji$1,a3 as _i,aE as n_,b as bs,y as yT,w as wl,A as cm,a4 as yw,U as Ug,az as kT,F as Fg,x as xI,D as am,a5 as Dw,o as om,aA as PT,ac as NT,J as wT,R as Ro,r as sr$1,v,a6 as Rt,ag as Pm,bk as ae,b1 as I,aO as qB,c as vt$1,bl as ZB,Y as Ye$1,aF as de,V as Vc,bm as kv,aL as fe,bn as xv,aM as Lt,aK as qd,aJ as Iv,bo as QB,aZ as Kb,g as $C,a$ as xg,d as bC,z as zC,X as Xg,_ as _C,aX as Zg,ap as Wg,aY as ZC,aq as WC,ar as qC,bp as qg,bq as Gg,ab as Ar,br as b,a9 as Ao$1,aP as ye$1,bs as pi,aU as Ii,bt as Er,bu as Ss,bv as yb,b3 as Vg,ax as kg,bw as pv,aI as xa,a7 as bt$1,bx as Tm,by as Jn$1,bz as vb,B as qf,P as Pg,av as YC,Z as Zf,ad as _,ae as O,af as Ri,j as sT,bA as te,L as Lg,C as Cl,T as Tl,H as HC,bB as On$1,bC as wt$2,bD as et,$,bE as wv,ba as se,bh as Sr,aa as jn$1,bF as Fv,I as Sl,n as PC,p as Ff,q as Pf,bd as Or,bG as zm,bH as wD,be as ge,bI as R,bJ as Rv,bK as ba,bL as sI,at as B$1,as as q,bM as en$2,bc as KB,b0 as jT}from'./main-5O2UVD2T.js';import {o as od}from'./chunk-B1vJDkZe.js';var qn=["*"],Zi=(()=>{class o{labelPosition="after";static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["","mat-internal-form-field",""]],hostAttrs:[1,"mdc-form-field","mat-internal-form-field"],hostVars:2,hostBindings:function(t,n){t&2&&Xg("mdc-form-field--align-end",n.labelPosition==="before");},inputs:{labelPosition:"labelPosition"},ngContentSelectors:qn,decls:1,vars:0,template:function(t,n){t&1&&($C(),zC(0));},styles:[`.mat-internal-form-field {
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
`],encapsulation:2})}return o})();var Un=["input"],Gn=["label"],Kn=["*"],jt={color:"accent",clickAction:"check-indeterminate",disabledInteractive:false},Zn=new I("mat-checkbox-default-options",{providedIn:"root",factory:()=>jt}),X=(function(o){return o[o.Init=0]="Init",o[o.Checked=1]="Checked",o[o.Unchecked=2]="Unchecked",o[o.Indeterminate=3]="Indeterminate",o})(X||{}),Yt=class{source;checked},Xt=(()=>{class o{_elementRef=v(Rt);_changeDetectorRef=v(Pm);_ngZone=v(ae);_animationsDisabled=B();_options=v(Zn,{optional:true});focus(){this._inputElement.nativeElement.focus();}_createChangeEvent(e){let t=new Yt;return t.source=this,t.checked=e,t}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:"mdc-checkbox--anim-unchecked-checked",uncheckedToIndeterminate:"mdc-checkbox--anim-unchecked-indeterminate",checkedToUnchecked:"mdc-checkbox--anim-checked-unchecked",checkedToIndeterminate:"mdc-checkbox--anim-checked-indeterminate",indeterminateToChecked:"mdc-checkbox--anim-indeterminate-checked",indeterminateToUnchecked:"mdc-checkbox--anim-indeterminate-unchecked"};ariaLabel="";ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return `${this.id||this._uniqueId}-input`}required=false;labelPosition="after";name=null;change=new bt$1;indeterminateChange=new bt$1;value;disableRipple=false;_inputElement;_labelElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass="";_currentCheckState=X.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){v(V).load(Me);let e=v(new Tm("tabindex"),{optional:true});this._options=this._options||jt,this.color=this._options.color||jt.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=v(wt$1).getId("mat-mdc-checkbox-"),this.disabledInteractive=this._options?.disabledInteractive??false;}ngOnChanges(e){e.required&&this._validatorChangeFn();}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate);}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck());}_checked=false;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck());}_disabled=false;get indeterminate(){return this._indeterminate()}set indeterminate(e){let t=e!=this._indeterminate();this._indeterminate.set(e),t&&(e?this._transitionCheckState(X.Indeterminate):this._transitionCheckState(this.checked?X.Checked:X.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e);}_indeterminate=Ye$1(false);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges();}writeValue(e){this.checked=!!e;}registerOnChange(e){this._controlValueAccessorChangeFn=e;}registerOnTouched(e){this._onTouched=e;}setDisabledState(e){this.disabled=e;}validate(e){return this.required&&e.value!==true?{required:true}:null}registerOnValidatorChange(e){this._validatorChangeFn=e;}_transitionCheckState(e){let t=this._currentCheckState,n=this._getAnimationTargetElement();if(!(t===e||!n)&&(this._currentAnimationClass&&n.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(t,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){n.classList.add(this._currentAnimationClass);let r=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{n.classList.remove(r);},1e3);});}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked);}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked);}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!=="noop"?(this.indeterminate&&e!=="check"&&Promise.resolve().then(()=>{this._indeterminate.set(false),this.indeterminateChange.emit(false);}),this._checked=!this._checked,this._transitionCheckState(this._checked?X.Checked:X.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e==="noop")&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate);}_onInteractionEvent(e){e.stopPropagation();}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck();});}_getAnimationClassForCheckStateTransition(e,t){if(this._animationsDisabled)return "";switch(e){case X.Init:if(t===X.Checked)return this._animationClasses.uncheckedToChecked;if(t==X.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case X.Unchecked:return t===X.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case X.Checked:return t===X.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case X.Indeterminate:return t===X.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return ""}_syncIndeterminate(e){let t=this._inputElement;t&&(t.nativeElement.indeterminate=e);}_onInputClick(){this._handleInputClick();}_onTouchTargetClick(){this._handleInputClick(),this.disabled||this._inputElement.nativeElement.focus();}_preventBubblingFromLabel(e){e.target&&this._labelElement.nativeElement.contains(e.target)&&e.stopPropagation();}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["mat-checkbox"]],viewQuery:function(t,n){if(t&1&&Wg(Un,5)(Gn,5),t&2){let r;WC(r=qC())&&(n._inputElement=r.first),WC(r=qC())&&(n._labelElement=r.first);}},hostAttrs:[1,"mat-mdc-checkbox"],hostVars:16,hostBindings:function(t,n){t&2&&(Vg("id",n.id),kg("tabindex",null)("aria-label",null)("aria-labelledby",null),sT(n.color?"mat-"+n.color:"mat-accent"),Xg("_mat-animation-noopable",n._animationsDisabled)("mdc-checkbox--disabled",n.disabled)("mat-mdc-checkbox-disabled",n.disabled)("mat-mdc-checkbox-checked",n.checked)("mat-mdc-checkbox-disabled-interactive",n.disabledInteractive));},inputs:{ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],ariaExpanded:[2,"aria-expanded","ariaExpanded",yb],ariaControls:[0,"aria-controls","ariaControls"],ariaOwns:[0,"aria-owns","ariaOwns"],id:"id",required:[2,"required","required",yb],labelPosition:"labelPosition",name:"name",value:"value",disableRipple:[2,"disableRipple","disableRipple",yb],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?void 0:vb(e)],color:"color",disabledInteractive:[2,"disabledInteractive","disabledInteractive",yb],checked:[2,"checked","checked",yb],disabled:[2,"disabled","disabled",yb],indeterminate:[2,"indeterminate","indeterminate",yb]},outputs:{change:"change",indeterminateChange:"indeterminateChange"},exportAs:["matCheckbox"],features:[NT([{provide:_,useExisting:Ri(()=>o),multi:true},{provide:O,useExisting:o,multi:true}]),Ss],ngContentSelectors:Kn,decls:15,vars:23,consts:[["checkbox",""],["input",""],["label",""],["mat-internal-form-field","",3,"click","labelPosition"],[1,"mdc-checkbox"],["aria-hidden","true",1,"mat-mdc-checkbox-touch-target",3,"click"],["type","checkbox",1,"mdc-checkbox__native-control",3,"blur","click","change","checked","indeterminate","disabled","id","required","tabIndex"],["aria-hidden","true",1,"mdc-checkbox__ripple"],["aria-hidden","true",1,"mdc-checkbox__background"],["focusable","false","viewBox","0 0 24 24",1,"mdc-checkbox__checkmark"],["fill","none","d","M1.73,12.91 8.1,19.28 22.79,4.59",1,"mdc-checkbox__checkmark-path"],[1,"mdc-checkbox__mixedmark"],["mat-ripple","","aria-hidden","true",1,"mat-mdc-checkbox-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-label",3,"for"]],template:function(t,n){if(t&1&&($C(),bs(0,"div",3),Ug("click",function(a){return n._preventBubblingFromLabel(a)}),bs(1,"div",4,0)(3,"div",5),Ug("click",function(){return n._onTouchTargetClick()}),wl(),bs(4,"input",6,1),Ug("blur",function(){return n._onBlur()})("click",function(){return n._onInputClick()})("change",function(a){return n._onInteractionEvent(a)}),wl(),Pg(6,"div",7),bs(7,"div",8),qf(),bs(8,"svg",9),Pg(9,"path",10),wl(),Zf(),Pg(10,"div",11),wl(),Pg(11,"div",12),wl(),bs(12,"label",13,2),zC(14),wl()()),t&2){let r=YC(2);Fg("labelPosition",n.labelPosition),xI(4),Xg("mdc-checkbox--selected",n.checked),Fg("checked",n.checked)("indeterminate",n.indeterminate)("disabled",n.disabled&&!n.disabledInteractive)("id",n.inputId)("required",n.required)("tabIndex",n.disabled&&!n.disabledInteractive?-1:n.tabIndex),kg("aria-label",n.ariaLabel||null)("aria-labelledby",n.ariaLabelledby)("aria-describedby",n.ariaDescribedby)("aria-checked",n.indeterminate?"mixed":null)("aria-controls",n.ariaControls)("aria-disabled",n.disabled&&n.disabledInteractive?true:null)("aria-expanded",n.ariaExpanded)("aria-owns",n.ariaOwns)("name",n.name)("value",n.value),xI(7),Fg("matRippleTrigger",r)("matRippleDisabled",n.disableRipple||n.disabled)("matRippleCentered",true),xI(),Fg("for",n.inputId);}},dependencies:[So$1,Zi],styles:[`.mdc-checkbox {
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
`],encapsulation:2})}return o})(),Qi=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[Xt,J]})}return o})();var qt=class{_box;_destroyed=new de;_resizeSubject=new de;_resizeObserver;_elementObservables=new Map;constructor(i){this._box=i,typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)));}observe(i){return this._elementObservables.has(i)||this._elementObservables.set(i,new R(e=>{let t=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(i,{box:this._box}),()=>{this._resizeObserver?.unobserve(i),t.unsubscribe(),this._elementObservables.delete(i);}}).pipe(Lt(e=>e.some(t=>t.target===i)),Rv({bufferSize:1,refCount:true}),qd(this._destroyed))),this._elementObservables.get(i)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear();}},$i=(()=>{class o{_cleanupErrorListener;_observers=new Map;_ngZone=v(ae);constructor(){}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.();}observe(e,t){let n=t?.box||"content-box";return this._observers.has(n)||this._observers.set(n,new qt(n)),this._observers.get(n).observe(e)}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})();var $n=["notch"],Jn=["*"],Ji=["iconPrefixContainer"],en=["textPrefixContainer"],tn=["iconSuffixContainer"],nn=["textSuffixContainer"],eo=["textField"],to=["*",[["mat-label"]],[["","matPrefix",""],["","matIconPrefix",""]],[["","matTextPrefix",""]],[["","matTextSuffix",""]],[["","matSuffix",""],["","matIconSuffix",""]],[["mat-error"],["","matError",""]],[["mat-hint",3,"align","end"]],[["mat-hint","align","end"]]],io=["*","mat-label","[matPrefix], [matIconPrefix]","[matTextPrefix]","[matTextSuffix]","[matSuffix], [matIconSuffix]","mat-error, [matError]","mat-hint:not([align='end'])","mat-hint[align='end']"];function no(o,i){o&1&&Pg(0,"span",21);}function oo(o,i){if(o&1&&(bs(0,"label",20),zC(1,1),bC(2,no,1,0,"span",21),wl()),o&2){let e=HC(2);Fg("floating",e._shouldLabelFloat())("monitorResize",e._hasOutline())("id",e._labelId),kg("for",e._control.disableAutomaticLabeling?null:e._control.id),xI(2),_C(!e.hideRequiredMarker&&e._control.required?2:-1);}}function ro(o,i){if(o&1&&bC(0,oo,3,5,"label",20),o&2){let e=HC();_C(e._hasFloatingLabel()?0:-1);}}function ao(o,i){o&1&&Pg(0,"div",7);}function so(o,i){}function lo(o,i){if(o&1&&xg(0,so,0,0,"ng-template",13),o&2){HC(2);let e=YC(1);Fg("ngTemplateOutlet",e);}}function co(o,i){if(o&1&&(bs(0,"div",9),bC(1,lo,1,1,null,13),wl()),o&2){let e=HC();Fg("matFormFieldNotchedOutlineOpen",e._shouldLabelFloat()),xI(),_C(e._forceDisplayInfixLabel()?-1:1);}}function mo(o,i){o&1&&(bs(0,"div",10,2),zC(2,2),wl());}function ho(o,i){o&1&&(bs(0,"div",11,3),zC(2,3),wl());}function fo(o,i){}function uo(o,i){if(o&1&&xg(0,fo,0,0,"ng-template",13),o&2){HC();let e=YC(1);Fg("ngTemplateOutlet",e);}}function po(o,i){o&1&&(bs(0,"div",14,4),zC(2,4),wl());}function _o(o,i){o&1&&(bs(0,"div",15,5),zC(2,5),wl());}function go(o,i){o&1&&Pg(0,"div",16);}function bo(o,i){o&1&&(bs(0,"div",18),zC(1,6),wl());}function vo(o,i){if(o&1&&(bs(0,"mat-hint",22),yT(1),wl()),o&2){let e=HC(2);Fg("id",e._hintLabelId),xI(),om(e.hintLabel);}}function yo(o,i){if(o&1&&(bs(0,"div",19),bC(1,vo,2,2,"mat-hint",22),zC(2,7),Pg(3,"div",23),zC(4,8),wl()),o&2){let e=HC();xI(),_C(e.hintLabel?1:-1);}}var ze=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["mat-label"]]})}return o})(),xo=new I("MatError");var Ut=(()=>{class o{align="start";id=v(wt$1).getId("mat-mdc-hint-");static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["mat-hint"]],hostAttrs:[1,"mat-mdc-form-field-hint","mat-mdc-form-field-bottom-align"],hostVars:4,hostBindings:function(t,n){t&2&&(Vg("id",n.id),kg("align",null),Xg("mat-mdc-form-field-hint-end",n.align==="end"));},inputs:{align:"align",id:"id"}})}return o})(),ko=new I("MatPrefix");var Co=new I("MatSuffix");var dn=new I("FloatingLabelParent"),on=(()=>{class o{_elementRef=v(Rt);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize();}_floating=false;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe();}_monitorResize=false;_resizeObserver=v($i);_ngZone=v(ae);_parent=v(dn);_resizeSubscription=new te;ngOnDestroy(){this._resizeSubscription.unsubscribe();}getWidth(){return wo(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized());}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:"border-box"}).subscribe(()=>this._handleResize());});}static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["label","matFormFieldFloatingLabel",""]],hostAttrs:[1,"mdc-floating-label","mat-mdc-floating-label"],hostVars:2,hostBindings:function(t,n){t&2&&Xg("mdc-floating-label--float-above",n.floating);},inputs:{floating:"floating",monitorResize:"monitorResize"}})}return o})();function wo(o){let i=o;if(i.offsetParent!==null)return i.scrollWidth;let e=i.cloneNode(true);e.style.setProperty("position","absolute"),e.style.setProperty("transform","translate(-9999px, -9999px)"),document.documentElement.appendChild(e);let t=e.scrollWidth;return e.remove(),t}var rn="mdc-line-ripple--active",ut="mdc-line-ripple--deactivating",an=(()=>{class o{_elementRef=v(Rt);_cleanupTransitionEnd;constructor(){let e=v(ae),t=v(Ao$1);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=t.listen(this._elementRef.nativeElement,"transitionend",this._handleTransitionEnd);});}activate(){let e=this._elementRef.nativeElement.classList;e.remove(ut),e.add(rn);}deactivate(){this._elementRef.nativeElement.classList.add(ut);}_handleTransitionEnd=e=>{let t=this._elementRef.nativeElement.classList,n=t.contains(ut);e.propertyName==="opacity"&&n&&t.remove(rn,ut);};ngOnDestroy(){this._cleanupTransitionEnd();}static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["div","matFormFieldLineRipple",""]],hostAttrs:[1,"mdc-line-ripple"]})}return o})(),sn=(()=>{class o{_elementRef=v(Rt);_ngZone=v(ae);open=false;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,t=e.querySelector(".mdc-floating-label");t?(e.classList.add("mdc-notched-outline--upgraded"),typeof requestAnimationFrame=="function"&&(t.style.transitionDuration="0s",this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>t.style.transitionDuration="");}))):e.classList.add("mdc-notched-outline--no-label");}_setNotchWidth(e){let t=this._notch.nativeElement;!this.open||!e?t.style.width="":t.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`;}_setMaxWidth(e){this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width",`calc(100% - ${e}px)`);}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["div","matFormFieldNotchedOutline",""]],viewQuery:function(t,n){if(t&1&&Wg($n,5),t&2){let r;WC(r=qC())&&(n._notch=r.first);}},hostAttrs:[1,"mdc-notched-outline"],hostVars:2,hostBindings:function(t,n){t&2&&Xg("mdc-notched-outline--notched",n.open);},inputs:{open:[0,"matFormFieldNotchedOutlineOpen","open"]},ngContentSelectors:Jn,decls:5,vars:0,consts:[["notch",""],[1,"mat-mdc-notch-piece","mdc-notched-outline__leading"],[1,"mat-mdc-notch-piece","mdc-notched-outline__notch"],[1,"mat-mdc-notch-piece","mdc-notched-outline__trailing"]],template:function(t,n){t&1&&($C(),Lg(0,"div",1),Cl(1,"div",2,0),zC(3),Tl(),Lg(4,"div",3));},encapsulation:2})}return o})(),Ve=(()=>{class o{value=null;stateChanges;id;placeholder;ngControl=null;focused=false;empty=false;shouldLabelFloat=false;required=false;disabled=false;errorState=false;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o})}return o})();var He=new I("MatFormField"),So=new I("MAT_FORM_FIELD_DEFAULT_OPTIONS"),ln="fill",Eo="auto",cn="fixed",Mo="translateY(-50%)",pt=(()=>{class o{_elementRef=v(Rt);_changeDetectorRef=v(Pm);_platform=v(v$1);_idGenerator=v(wt$1);_ngZone=v(ae);_defaults=v(So,{optional:true});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=qB("iconPrefixContainer");_textPrefixContainerSignal=qB("textPrefixContainer");_iconSuffixContainerSignal=qB("iconSuffixContainer");_textSuffixContainerSignal=qB("textSuffixContainer");_prefixSuffixContainers=vt$1(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=ZB(ze);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=Eo$1(e);}_hideRequiredMarker=false;color="primary";get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||Eo}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck());}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let t=e||this._defaults?.appearance||ln;this._appearanceSignal.set(t);}_appearanceSignal=Ye$1(ln);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||cn}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||cn;}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints();}_hintLabel="";_hasIconPrefix=false;_hasTextPrefix=false;_hasIconSuffix=false;_hasTextSuffix=false;_labelId=this._idGenerator.getId("mat-mdc-form-field-label-");_hintLabelId=this._idGenerator.getId("mat-mdc-hint-");_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e;}_destroyed=new de;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=B();constructor(){let e=this._defaults,t=v(ie);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),Vc(()=>this._currentDirection=t.valueSignal()),this._syncOutlineLabelOffset();}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled");},300);}),this._changeDetectorRef.detectChanges();}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix();}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck();}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete();}getLabelId=vt$1(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel="always");}_initializeControl(e){let t=this._control,n="mat-mdc-form-field-type-";e&&this._elementRef.nativeElement.classList.remove(n+e.controlType),t.controlType&&this._elementRef.nativeElement.classList.add(n+t.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=t.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck();}),this._describedByChanges?.unsubscribe(),this._describedByChanges=t.stateChanges.pipe(kv([void 0,void 0]),fe(()=>[t.errorState,t.userAriaDescribedBy]),xv(),Lt(([[r,a],[c,m]])=>r!==c||a!==m)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),t.ngControl&&t.ngControl.valueChanges&&(this._valueChanges=t.ngControl.valueChanges.pipe(qd(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()));}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText);}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),Iv(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck();});}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck();}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck();}),this._validateHints(),this._syncDescribedByIds();}_assertFormFieldControl(){this._control;}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=true,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=false,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle("mat-focused",e),this._textField?.nativeElement.classList.toggle("mdc-text-field--focused",e);}_syncOutlineLabelOffset(){QB({earlyRead:()=>{if(this._appearanceSignal()!=="outline")return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset());});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:"border-box"});}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())});}_shouldAlwaysFloat(){return this.floatLabel==="always"}_hasOutline(){return this.appearance==="outline"}_forceDisplayInfixLabel(){return !this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=vt$1(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():false}_shouldForward(e){let t=this._control?this._control.ngControl:null;return t&&t[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?"error":"hint"}_handleLabelResized(){this._refreshOutlineNotchWidth();}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());}_processHints(){this._validateHints(),this._syncDescribedByIds();}_validateHints(){this._hintChildren;}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy=="string"&&e.push(...this._control.userAriaDescribedBy.split(" ")),this._getSubscriptMessageType()==="hint"){let r=this._hintChildren?this._hintChildren.find(c=>c.align==="start"):null,a=this._hintChildren?this._hintChildren.find(c=>c.align==="end"):null;r?e.push(r.id):this._hintLabel&&e.push(this._hintLabelId),a&&e.push(a.id);}else this._errorChildren&&e.push(...this._errorChildren.map(r=>r.id));let t=this._control.describedByIds,n;if(t){let r=this._describedByIds||e;n=e.concat(t.filter(a=>a&&!r.includes(a)));}else n=e;this._control.setDescribedByIds(n),this._describedByIds=e;}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return ["",null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,t=this._textPrefixContainer?.nativeElement,n=this._iconSuffixContainer?.nativeElement,r=this._textSuffixContainer?.nativeElement,a=e?.getBoundingClientRect().width??0,c=t?.getBoundingClientRect().width??0,m=n?.getBoundingClientRect().width??0,u=r?.getBoundingClientRect().width??0,f=this._currentDirection==="rtl"?"-1":"1",_=`${a+c}px`,K=`calc(${f} * (${_} + var(--mat-mdc-form-field-label-offset-x, 0px)))`,U=`var(--mat-mdc-form-field-label-transform, ${Mo} translateX(${K}))`,J=a+c+m+u;return [U,J]}_writeOutlinedLabelStyles(e){if(e!==null){let[t,n]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=t),n!==null&&this._notchedOutline?._setMaxWidth(n);}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let t=e.getRootNode();return t&&t!==e}return document.documentElement.contains(e)}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["mat-form-field"]],contentQueries:function(t,n,r){if(t&1&&(qg(r,n._labelChild,ze,5),Gg(r,Ve,5)(r,ko,5)(r,Co,5)(r,xo,5)(r,Ut,5)),t&2){ZC();let a;WC(a=qC())&&(n._formFieldControl=a.first),WC(a=qC())&&(n._prefixChildren=a),WC(a=qC())&&(n._suffixChildren=a),WC(a=qC())&&(n._errorChildren=a),WC(a=qC())&&(n._hintChildren=a);}},viewQuery:function(t,n){if(t&1&&(Zg(n._iconPrefixContainerSignal,Ji,5)(n._textPrefixContainerSignal,en,5)(n._iconSuffixContainerSignal,tn,5)(n._textSuffixContainerSignal,nn,5),Wg(eo,5)(Ji,5)(en,5)(tn,5)(nn,5)(on,5)(sn,5)(an,5)),t&2){ZC(4);let r;WC(r=qC())&&(n._textField=r.first),WC(r=qC())&&(n._iconPrefixContainer=r.first),WC(r=qC())&&(n._textPrefixContainer=r.first),WC(r=qC())&&(n._iconSuffixContainer=r.first),WC(r=qC())&&(n._textSuffixContainer=r.first),WC(r=qC())&&(n._floatingLabel=r.first),WC(r=qC())&&(n._notchedOutline=r.first),WC(r=qC())&&(n._lineRipple=r.first);}},hostAttrs:[1,"mat-mdc-form-field"],hostVars:38,hostBindings:function(t,n){t&2&&Xg("mat-mdc-form-field-label-always-float",n._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix",n._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix",n._hasIconSuffix)("mat-form-field-invalid",n._control.errorState)("mat-form-field-disabled",n._control.disabled)("mat-form-field-autofilled",n._control.autofilled)("mat-form-field-appearance-fill",n.appearance=="fill")("mat-form-field-appearance-outline",n.appearance=="outline")("mat-form-field-hide-placeholder",n._hasFloatingLabel()&&!n._shouldLabelFloat())("mat-primary",n.color!=="accent"&&n.color!=="warn")("mat-accent",n.color==="accent")("mat-warn",n.color==="warn")("ng-untouched",n._shouldForward("untouched"))("ng-touched",n._shouldForward("touched"))("ng-pristine",n._shouldForward("pristine"))("ng-dirty",n._shouldForward("dirty"))("ng-valid",n._shouldForward("valid"))("ng-invalid",n._shouldForward("invalid"))("ng-pending",n._shouldForward("pending"));},inputs:{hideRequiredMarker:"hideRequiredMarker",color:"color",floatLabel:"floatLabel",appearance:"appearance",subscriptSizing:"subscriptSizing",hintLabel:"hintLabel"},exportAs:["matFormField"],features:[NT([{provide:He,useExisting:o},{provide:dn,useExisting:o}])],ngContentSelectors:io,decls:18,vars:21,consts:[["labelTemplate",""],["textField",""],["iconPrefixContainer",""],["textPrefixContainer",""],["textSuffixContainer",""],["iconSuffixContainer",""],[1,"mat-mdc-text-field-wrapper","mdc-text-field",3,"click"],[1,"mat-mdc-form-field-focus-overlay"],[1,"mat-mdc-form-field-flex"],["matFormFieldNotchedOutline","",3,"matFormFieldNotchedOutlineOpen"],[1,"mat-mdc-form-field-icon-prefix"],[1,"mat-mdc-form-field-text-prefix"],[1,"mat-mdc-form-field-infix"],[3,"ngTemplateOutlet"],[1,"mat-mdc-form-field-text-suffix"],[1,"mat-mdc-form-field-icon-suffix"],["matFormFieldLineRipple",""],["aria-atomic","true","aria-live","polite",1,"mat-mdc-form-field-subscript-wrapper","mat-mdc-form-field-bottom-align"],[1,"mat-mdc-form-field-error-wrapper"],[1,"mat-mdc-form-field-hint-wrapper"],["matFormFieldFloatingLabel","",3,"floating","monitorResize","id"],["aria-hidden","true",1,"mat-mdc-form-field-required-marker","mdc-floating-label--required"],[3,"id"],[1,"mat-mdc-form-field-hint-spacer"]],template:function(t,n){if(t&1&&($C(to),xg(0,ro,1,1,"ng-template",null,0,jT),bs(2,"div",6,1),Ug("click",function(a){return n._control.onContainerClick(a)}),bC(4,ao,1,0,"div",7),bs(5,"div",8),bC(6,co,2,2,"div",9),bC(7,mo,3,0,"div",10),bC(8,ho,3,0,"div",11),bs(9,"div",12),bC(10,uo,1,1,null,13),zC(11),wl(),bC(12,po,3,0,"div",14),bC(13,_o,3,0,"div",15),wl(),bC(14,go,1,0,"div",16),wl(),bs(15,"div",17),bC(16,bo,2,0,"div",18)(17,yo,5,1,"div",19),wl()),t&2){let r;xI(2),Xg("mdc-text-field--filled",!n._hasOutline())("mdc-text-field--outlined",n._hasOutline())("mdc-text-field--no-label",!n._hasFloatingLabel())("mdc-text-field--disabled",n._control.disabled)("mdc-text-field--invalid",n._control.errorState),xI(2),_C(!n._hasOutline()&&!n._control.disabled?4:-1),xI(2),_C(n._hasOutline()?6:-1),xI(),_C(n._hasIconPrefix?7:-1),xI(),_C(n._hasTextPrefix?8:-1),xI(2),_C(!n._hasOutline()||n._forceDisplayInfixLabel()?10:-1),xI(2),_C(n._hasTextSuffix?12:-1),xI(),_C(n._hasIconSuffix?13:-1),xI(),_C(n._hasOutline()?-1:14),xI(),Xg("mat-mdc-form-field-subscript-dynamic-size",n.subscriptSizing==="dynamic");let a=n._getSubscriptMessageType();xI(),_C((r=a)==="error"?16:r==="hint"?17:-1);}},dependencies:[on,sn,Kb,an,Ut],styles:[`.mdc-text-field {
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
`],encapsulation:2})}return o})();var ye=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[na,pt,J]})}return o})();var Do=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["ng-component"]],hostAttrs:["cdk-text-field-style-loader",""],decls:0,vars:0,template:function(t,n){},styles:[`textarea.cdk-textarea-autosize {
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
`],encapsulation:2})}return o})(),Fo={passive:true},mn=(()=>{class o{_platform=v(v$1);_ngZone=v(ae);_renderer=v(On$1).createRenderer(null,null);_styleLoader=v(V);_monitoredElements=new Map;monitor(e){if(!this._platform.isBrowser)return wt$2;this._styleLoader.load(Do);let t=I$1(e),n=this._monitoredElements.get(t);if(n)return n.subject;let r=new de,a="cdk-text-field-autofilled",c=u=>{u.animationName==="cdk-text-field-autofill-start"&&!t.classList.contains(a)?(t.classList.add(a),this._ngZone.run(()=>r.next({target:u.target,isAutofilled:true}))):u.animationName==="cdk-text-field-autofill-end"&&t.classList.contains(a)&&(t.classList.remove(a),this._ngZone.run(()=>r.next({target:u.target,isAutofilled:false})));},m=this._ngZone.runOutsideAngular(()=>(t.classList.add("cdk-text-field-autofill-monitored"),this._renderer.listen(t,"animationstart",c,Fo)));return this._monitoredElements.set(t,{subject:r,unlisten:m}),r}stopMonitoring(e){let t=I$1(e),n=this._monitoredElements.get(t);n&&(n.unlisten(),n.subject.complete(),t.classList.remove("cdk-text-field-autofill-monitored"),t.classList.remove("cdk-text-field-autofilled"),this._monitoredElements.delete(t));}ngOnDestroy(){this._monitoredElements.forEach((e,t)=>this.stopMonitoring(t));}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})();var hn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({})}return o})();var _t=new I("");var fn=new I("MAT_INPUT_VALUE_ACCESSOR");var gt=(()=>{class o{isErrorState(e,t){return !!(e&&e.invalid&&(e.touched||t&&t.submitted))}isSignalErrorState(e){if(!e)return  false;let t=e().invalid(),n=e().touched();return t&&n}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})();var De=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=false;matcher;ngControl;formField;constructor(i,e,t,n,r){this._defaultMatcher=i,this._parentFormGroup=t,this._parentForm=n,this._stateChanges=r,e?Er(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null;}updateErrorState(){let i=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==i&&(this.errorState=e,this._stateChanges.next());}_getCurrentErrorState(i){if(this.formField&&i?.isSignalErrorState)return i.isSignalErrorState(this.formField.field())??false;let e=this._parentFormGroup||this._parentForm,t=this.ngControl?this.ngControl.control:null;return i?.isErrorState(t,e)??false}};var Ao=["button","checkbox","file","hidden","image","radio","range","reset","submit"],Io=new I("MAT_INPUT_CONFIG"),un=(()=>{class o{_elementRef=v(Rt);_platform=v(v$1);ngControl=v(b,{optional:true,self:true});_autofillMonitor=v(mn);_ngZone=v(ae);_formField=v(He,{optional:true});_renderer=v(Ao$1);_uid=v(wt$1).getId("mat-input-");_previousNativeValue;_inputValueAccessor;_signalBasedValueAccessor;_previousPlaceholder=null;_errorStateTracker;_config=v(Io,{optional:true});_cleanupIosKeyup;_cleanupWebkitWheel;_isServer=false;_isNativeSelect=false;_isTextarea=false;_isInFormField=false;focused=false;stateChanges=new de;controlType="mat-input";autofilled=false;get disabled(){return this._disabled}set disabled(e){this._disabled=Eo$1(e),this.focused&&(this.focused=false,this.stateChanges.next());}_disabled=false;get id(){return this._id}set id(e){this._id=e||this._uid;}_id;placeholder;name;get required(){return this._required??this.ngControl?.control?.hasValidator(ye$1.required)??false}set required(e){this._required=Eo$1(e);}_required;get type(){return this._type}set type(e){this._type=e||"text",this._validateType(),!this._isTextarea&&ro$1().has(this._type)&&(this._elementRef.nativeElement.type=this._type);}_type="text";get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e;}userAriaDescribedBy;get value(){return this._signalBasedValueAccessor?this._signalBasedValueAccessor.value():this._inputValueAccessor.value}set value(e){e!==this.value&&(this._signalBasedValueAccessor?this._signalBasedValueAccessor.value.set(e):this._inputValueAccessor.value=e,this.stateChanges.next());}get readonly(){return this._readonly}set readonly(e){this._readonly=Eo$1(e);}_readonly=false;disabledInteractive;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e;}_neverEmptyInputTypes=["date","datetime","datetime-local","month","time","week"].filter(e=>ro$1().has(e));constructor(){let e=v(pi,{optional:true}),t=v(Ii,{optional:true}),n=v(gt),r=v(fn,{optional:true,self:true}),a=v(_t,{optional:true,self:true}),c=this._elementRef.nativeElement,m=c.nodeName.toLowerCase();r?Er(r.value)?this._signalBasedValueAccessor=r:this._inputValueAccessor=r:this._inputValueAccessor=c,this._previousNativeValue=this.value,this.id=this.id,this._platform.IOS&&this._ngZone.runOutsideAngular(()=>{this._cleanupIosKeyup=this._renderer.listen(c,"keyup",this._iOSKeyupListener);}),this._errorStateTracker=new De(n,a||this.ngControl,t,e,this.stateChanges),this._isServer=!this._platform.isBrowser,this._isNativeSelect=m==="select",this._isTextarea=m==="textarea",this._isInFormField=!!this._formField,this.disabledInteractive=this._config?.disabledInteractive||false,this._isNativeSelect&&(this.controlType=c.multiple?"mat-native-select-multiple":"mat-native-select"),this._signalBasedValueAccessor&&Vc(()=>{this._signalBasedValueAccessor.value(),this.stateChanges.next();});}ngAfterViewInit(){this._platform.isBrowser&&this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(e=>{this.autofilled=e.isAutofilled,this.stateChanges.next();});}ngOnChanges(){this.stateChanges.next();}ngOnDestroy(){this.stateChanges.complete(),this._platform.isBrowser&&this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement),this._cleanupIosKeyup?.(),this._cleanupWebkitWheel?.();}ngDoCheck(){this.ngControl&&(this.updateErrorState(),this.ngControl.disabled!==null&&this.ngControl.disabled!==this.disabled&&(this.disabled=this.ngControl.disabled,this.stateChanges.next())),this._dirtyCheckNativeValue(),this._dirtyCheckPlaceholder();}focus(e){this._elementRef.nativeElement.focus(e);}updateErrorState(){this._errorStateTracker.updateErrorState();}_focusChanged(e){if(e!==this.focused){if(!this._isNativeSelect&&e&&this.disabled&&this.disabledInteractive){let t=this._elementRef.nativeElement;t.type==="number"?(t.type="text",t.setSelectionRange(0,0),t.type="number"):t.setSelectionRange(0,0);}this.focused=e,this.stateChanges.next();}}_onInput(){}_dirtyCheckNativeValue(){let e=this._elementRef.nativeElement.value;this._previousNativeValue!==e&&(this._previousNativeValue=e,this.stateChanges.next());}_dirtyCheckPlaceholder(){let e=this._getPlaceholder();if(e!==this._previousPlaceholder){let t=this._elementRef.nativeElement;this._previousPlaceholder=e,e?t.setAttribute("placeholder",e):t.removeAttribute("placeholder");}}_getPlaceholder(){return this.placeholder||null}_validateType(){Ao.indexOf(this._type)>-1;}_isNeverEmpty(){return this._neverEmptyInputTypes.indexOf(this._type)>-1}_isBadInput(){let e=this._elementRef.nativeElement.validity;return e&&e.badInput}get empty(){return !this._isNeverEmpty()&&!this._elementRef.nativeElement.value&&!this._isBadInput()&&!this.autofilled}get shouldLabelFloat(){if(this._isNativeSelect){let e=this._elementRef.nativeElement,t=e.options[0];return this.focused||e.multiple||!this.empty||!!(e.selectedIndex>-1&&t&&t.label)}else return this.focused&&!this.disabled||!this.empty}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby");}onContainerClick(){this.focused||this.focus();}_isInlineSelect(){let e=this._elementRef.nativeElement;return this._isNativeSelect&&(e.multiple||e.size>1)}_iOSKeyupListener=e=>{let t=e.target;!t.value&&t.selectionStart===0&&t.selectionEnd===0&&(t.setSelectionRange(1,1),t.setSelectionRange(0,0));};_getReadonlyAttribute(){return this._isNativeSelect?null:this.readonly||this.disabled&&this.disabledInteractive?"true":null}static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["input","matInput",""],["textarea","matInput",""],["select","matNativeControl",""],["input","matNativeControl",""],["textarea","matNativeControl",""]],hostAttrs:[1,"mat-mdc-input-element"],hostVars:21,hostBindings:function(t,n){t&1&&Ug("focus",function(){return n._focusChanged(true)})("blur",function(){return n._focusChanged(false)})("input",function(){return n._onInput()}),t&2&&(Vg("id",n.id)("disabled",n.disabled&&!n.disabledInteractive)("required",n.required),kg("name",n.name||null)("readonly",n._getReadonlyAttribute())("aria-disabled",n.disabled&&n.disabledInteractive?"true":null)("aria-invalid",n.empty&&n.required?null:n.errorState)("aria-required",n.required)("id",n.id),Xg("mat-input-server",n._isServer)("mat-mdc-form-field-textarea-control",n._isInFormField&&n._isTextarea)("mat-mdc-form-field-input-control",n._isInFormField)("mat-mdc-input-disabled-interactive",n.disabledInteractive)("mdc-text-field__input",n._isInFormField)("mat-mdc-native-select-inline",n._isInlineSelect()));},inputs:{disabled:"disabled",id:"id",placeholder:"placeholder",name:"name",required:"required",type:"type",errorStateMatcher:"errorStateMatcher",userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],value:"value",readonly:"readonly",disabledInteractive:[2,"disabledInteractive","disabledInteractive",yb]},exportAs:["matInput"],features:[NT([{provide:Ve,useExisting:o}]),Ss]})}return o})(),pn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[ye,ye,hn,J]})}return o})();var We=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new de;bulk={select:i=>this._select(i),deselect:i=>this._deselect(i),setSelection:i=>this._setSelection(i)};constructor(i=false,e,t=true,n){this._multiple=i,this._emitChanges=t,this.compareWith=n,e&&e.length&&(i?e.forEach(r=>this._markSelected(r)):this._markSelected(e[0]),this._selectedToEmit.length=0);}select(...i){return this._select(i)}deselect(...i){return this._deselect(i)}setSelection(...i){return this._setSelection(i)}toggle(i){return this.isSelected(i)?this.deselect(i):this.select(i)}clear(i=true){this._unmarkAll();let e=this._hasQueuedChanges();return i&&this._emitChangeEvent(),e}isSelected(i){return this._selection.has(this._getConcreteValue(i))}isEmpty(){return this._selection.size===0}hasValue(){return !this.isEmpty()}sort(i){this._multiple&&this.selected&&this._selected.sort(i);}isMultipleSelection(){return this._multiple}_select(i){this._verifyValueAssignment(i),i.forEach(t=>this._markSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(i){this._verifyValueAssignment(i),i.forEach(t=>this._unmarkSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(i){this._verifyValueAssignment(i);let e=this.selected,t=new Set(i.map(r=>this._getConcreteValue(r)));i.forEach(r=>this._markSelected(r)),e.filter(r=>!t.has(this._getConcreteValue(r,t))).forEach(r=>this._unmarkSelected(r));let n=this._hasQueuedChanges();return this._emitChangeEvent(),n}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[]);}_markSelected(i){i=this._getConcreteValue(i),this.isSelected(i)||(this._multiple||this._unmarkAll(),this.isSelected(i)||this._selection.add(i),this._emitChanges&&this._selectedToEmit.push(i));}_unmarkSelected(i){i=this._getConcreteValue(i),this.isSelected(i)&&(this._selection.delete(i),this._emitChanges&&this._deselectedToEmit.push(i));}_unmarkAll(){this.isEmpty()||this._selection.forEach(i=>this._unmarkSelected(i));}_verifyValueAssignment(i){i.length>1&&this._multiple;}_hasQueuedChanges(){return !!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(i,e){if(this.compareWith){e=e??this._selection;for(let t of e)if(this.compareWith(i,t))return t;return i}else return i}};var zo=20,Gt=(()=>{class o{_ngZone=v(ae);_platform=v(v$1);_renderer=v(On$1).createRenderer(null,null);_cleanupGlobalListener;_scrolled=new de;_scrolledCount=0;scrollContainers=new Map;register(e){this.scrollContainers.has(e)||this.scrollContainers.set(e,e.elementScrolled().subscribe(()=>this._scrolled.next(e)));}deregister(e){let t=this.scrollContainers.get(e);t&&(t.unsubscribe(),this.scrollContainers.delete(e));}scrolled(e=zo){return this._platform.isBrowser?new R(t=>{this._cleanupGlobalListener||(this._cleanupGlobalListener=this._ngZone.runOutsideAngular(()=>this._renderer.listen("document","scroll",()=>this._scrolled.next())));let n=e>0?this._scrolled.pipe(wv(e)).subscribe(t):this._scrolled.subscribe(t);return this._scrolledCount++,()=>{n.unsubscribe(),this._scrolledCount--,this._scrolledCount||(this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0);}}):ba()}ngOnDestroy(){this._cleanupGlobalListener?.(),this._cleanupGlobalListener=void 0,this.scrollContainers.forEach((e,t)=>this.deregister(t)),this._scrolled.complete();}ancestorScrolled(e,t){let n=this.getAncestorScrollContainers(e);return this.scrolled(t).pipe(Lt(r=>!r||n.indexOf(r)>-1))}getAncestorScrollContainers(e){let t=[];return this.scrollContainers.forEach((n,r)=>{this._targetContainsElement(r,e)&&t.push(r);}),t}_targetContainsElement(e,t){let n=I$1(t),r=e.getElementRef().nativeElement;do if(n==r)return  true;while(n=n.parentElement);return  false}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})();var Vo=20,xe=(()=>{class o{_platform=v(v$1);_listeners;_viewportSize=null;_change=new de;_document=v($);constructor(){let e=v(ae),t=v(On$1).createRenderer(null,null);e.runOutsideAngular(()=>{if(this._platform.isBrowser){let n=r=>this._change.next(r);this._listeners=[t.listen("window","resize",n),t.listen("window","orientationchange",n)];}this.change().subscribe(()=>this._viewportSize=null);});}ngOnDestroy(){this._listeners?.forEach(e=>e()),this._change.complete();}getViewportSize(){this._viewportSize||this._updateViewportSize();let e={width:this._viewportSize.width,height:this._viewportSize.height};return this._platform.isBrowser||(this._viewportSize=null),e}getViewportRect(){let e=this.getViewportScrollPosition(),{width:t,height:n}=this.getViewportSize();return {top:e.top,left:e.left,bottom:e.top+n,right:e.left+t,height:n,width:t}}getViewportScrollPosition(){if(!this._platform.isBrowser)return {top:0,left:0};let e=this._document,t=this._getWindow(),n=e.documentElement,r=n.getBoundingClientRect(),a=-r.top||e.body?.scrollTop||t.scrollY||n.scrollTop||0,c=-r.left||e.body?.scrollLeft||t.scrollX||n.scrollLeft||0;return {top:a,left:c}}change(e=Vo){return e>0?this._change.pipe(wv(e)):this._change}_getWindow(){return this._document.defaultView||window}_updateViewportSize(){let e=this._getWindow();this._viewportSize=this._platform.isBrowser?{width:e.innerWidth,height:e.innerHeight}:{width:0,height:0};}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})();var bt=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({})}return o})(),Kt=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[J,bt,J,bt]})}return o})();var je=class{_attachedHost=null;attach(i){return this._attachedHost=i,i.attach(this)}detach(){let i=this._attachedHost;i!=null&&(this._attachedHost=null,i.detach());}get isAttached(){return this._attachedHost!=null}setAttachedHost(i){this._attachedHost=i;}},Zt=class extends je{component;viewContainerRef;injector;projectableNodes;bindings;directives;constructor(i,e,t,n,r,a){super(),this.component=i,this.viewContainerRef=e,this.injector=t,this.projectableNodes=n,this.bindings=r||null,this.directives=a||null;}},Ye=class extends je{templateRef;viewContainerRef;context;injector;constructor(i,e,t,n){super(),this.templateRef=i,this.viewContainerRef=e,this.context=t,this.injector=n;}get origin(){return this.templateRef.elementRef}attach(i,e=this.context){return this.context=e,super.attach(i)}detach(){return this.context=void 0,super.detach()}},Qt=class extends je{element;constructor(i){super(),this.element=i instanceof Rt?i.nativeElement:i;}},$t=class{_attachedPortal=null;_disposeFn=null;_isDisposed=false;hasAttached(){return !!this._attachedPortal}attach(i){if(i instanceof Zt)return this._attachedPortal=i,this.attachComponentPortal(i);if(i instanceof Ye)return this._attachedPortal=i,this.attachTemplatePortal(i);if(this.attachDomPortal&&i instanceof Qt)return this._attachedPortal=i,this.attachDomPortal(i)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn();}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=true;}setDisposeFn(i){this._disposeFn=i;}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null);}},vt=class extends $t{outletElement;_appRef;_defaultInjector;constructor(i,e,t){super(),this.outletElement=i,this._appRef=e,this._defaultInjector=t;}attachComponentPortal(i){let e;if(i.viewContainerRef){let t=i.injector||i.viewContainerRef.injector,n=t.get(en$2,null,{optional:true})||void 0;e=i.viewContainerRef.createComponent(i.component,{index:i.viewContainerRef.length,injector:t,ngModuleRef:n,projectableNodes:i.projectableNodes||void 0,bindings:i.bindings||void 0,directives:i.directives||void 0}),this.setDisposeFn(()=>e.destroy());}else {let t=this._appRef,n=i.injector||this._defaultInjector||se.NULL,r=n.get(ge,t.injector);e=KB(i.component,{elementInjector:n,environmentInjector:r,projectableNodes:i.projectableNodes||void 0,bindings:i.bindings||void 0,directives:i.directives||void 0}),t.attachView(e.hostView),this.setDisposeFn(()=>{t.viewCount>0&&t.detachView(e.hostView),e.destroy();});}return this.outletElement.appendChild(this._getComponentRootNode(e)),this._attachedPortal=i,e}attachTemplatePortal(i){let e=i.viewContainerRef,t=e.createEmbeddedView(i.templateRef,i.context,{injector:i.injector});return t.rootNodes.forEach(n=>this.outletElement.appendChild(n)),t.detectChanges(),this.setDisposeFn(()=>{let n=e.indexOf(t);n!==-1&&e.remove(n);}),this._attachedPortal=i,t}attachDomPortal=i=>{let e=i.element;e.parentNode;let t=this.outletElement.ownerDocument.createComment("dom-portal");e.parentNode.insertBefore(t,e),this.outletElement.appendChild(e),this._attachedPortal=i,super.setDisposeFn(()=>{t.parentNode&&t.parentNode.replaceChild(e,t);});};dispose(){super.dispose(),this.outletElement.remove();}_getComponentRootNode(i){return i.hostView.rootNodes[0]}};var _n=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({})}return o})();var gn=eo$1();function Sn(o){return new yt(o.get(xe),o.get($))}var yt=class{_viewportRuler;_previousHTMLStyles={top:"",left:""};_previousScrollPosition;_isEnabled=false;_document;constructor(i,e){this._viewportRuler=i,this._document=e;}attach(){}enable(){if(this._canBeEnabled()){let i=this._document.documentElement;this._previousScrollPosition=this._viewportRuler.getViewportScrollPosition(),this._previousHTMLStyles.left=i.style.left||"",this._previousHTMLStyles.top=i.style.top||"",i.style.left=go$1(-this._previousScrollPosition.left),i.style.top=go$1(-this._previousScrollPosition.top),i.classList.add("cdk-global-scrollblock"),this._isEnabled=true;}}disable(){if(this._isEnabled){let i=this._document.documentElement,e=this._document.body,t=i.style,n=e.style,r=t.scrollBehavior||"",a=n.scrollBehavior||"";this._isEnabled=false,t.left=this._previousHTMLStyles.left,t.top=this._previousHTMLStyles.top,i.classList.remove("cdk-global-scrollblock"),gn&&(t.scrollBehavior=n.scrollBehavior="auto"),window.scroll(this._previousScrollPosition.left,this._previousScrollPosition.top),gn&&(t.scrollBehavior=r,n.scrollBehavior=a);}}_canBeEnabled(){if(this._document.documentElement.classList.contains("cdk-global-scrollblock")||this._isEnabled)return  false;let e=this._document.documentElement,t=this._viewportRuler.getViewportSize();return e.scrollHeight>t.height||e.scrollWidth>t.width}};function En(o,i){return new xt(o.get(Gt),o.get(ae),o.get(xe),i)}var xt=class{_scrollDispatcher;_ngZone;_viewportRuler;_config;_scrollSubscription=null;_overlayRef;_initialScrollPosition;constructor(i,e,t,n){this._scrollDispatcher=i,this._ngZone=e,this._viewportRuler=t,this._config=n;}attach(i){this._overlayRef,this._overlayRef=i;}enable(){if(this._scrollSubscription)return;let i=this._scrollDispatcher.scrolled(0).pipe(Lt(e=>!e||!this._overlayRef.overlayElement.contains(e.getElementRef().nativeElement)));this._config&&this._config.threshold&&this._config.threshold>1?(this._initialScrollPosition=this._viewportRuler.getViewportScrollPosition().top,this._scrollSubscription=i.subscribe(()=>{let e=this._viewportRuler.getViewportScrollPosition().top;Math.abs(e-this._initialScrollPosition)>this._config.threshold?this._detach():this._overlayRef.updatePosition();})):this._scrollSubscription=i.subscribe(this._detach);}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null);}detach(){this.disable(),this._overlayRef=null;}_detach=()=>{this.disable(),this._overlayRef.hasAttached()&&this._ngZone.run(()=>this._overlayRef.detach());}};var Xe=class{enable(){}disable(){}attach(){}};function Jt(o,i){return i.some(e=>{let t=o.bottom<e.top,n=o.top>e.bottom,r=o.right<e.left,a=o.left>e.right;return t||n||r||a})}function bn(o,i){return i.some(e=>{let t=o.top<e.top,n=o.bottom>e.bottom,r=o.left<e.left,a=o.right>e.right;return t||n||r||a})}function Ue(o,i){return new kt(o.get(Gt),o.get(xe),o.get(ae),i)}var kt=class{_scrollDispatcher;_viewportRuler;_ngZone;_config;_scrollSubscription=null;_overlayRef;constructor(i,e,t,n){this._scrollDispatcher=i,this._viewportRuler=e,this._ngZone=t,this._config=n;}attach(i){this._overlayRef,this._overlayRef=i;}enable(){if(!this._scrollSubscription){let i=this._config?this._config.scrollThrottle:0;this._scrollSubscription=this._scrollDispatcher.scrolled(i).subscribe(()=>{if(this._overlayRef.updatePosition(),this._config&&this._config.autoClose){let e=this._overlayRef.overlayElement.getBoundingClientRect(),{width:t,height:n}=this._viewportRuler.getViewportSize();Jt(e,[{width:t,height:n,bottom:n,right:t,top:0,left:0}])&&(this.disable(),this._ngZone.run(()=>this._overlayRef.detach()));}});}}disable(){this._scrollSubscription&&(this._scrollSubscription.unsubscribe(),this._scrollSubscription=null);}detach(){this.disable(),this._overlayRef=null;}},Mn=(()=>{class o{_injector=v(se);noop=()=>new Xe;close=e=>En(this._injector,e);block=()=>Sn(this._injector);reposition=e=>Ue(this._injector,e);static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})(),qe=class{positionStrategy;scrollStrategy=new Xe;panelClass="";hasBackdrop=false;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=false;usePopover;eventPredicate;constructor(i){if(i){let e=Object.keys(i);for(let t of e)i[t]!==void 0&&(this[t]=i[t]);}}};var Ct=class{connectionPair;scrollableViewProperties;constructor(i,e){this.connectionPair=i,this.scrollableViewProperties=e;}};var Rn=(()=>{class o{_attachedOverlays=[];_document=v($);_isAttached=false;ngOnDestroy(){this.detach();}add(e){this.remove(e),this._attachedOverlays.push(e);}remove(e){let t=this._attachedOverlays.indexOf(e);t>-1&&this._attachedOverlays.splice(t,1),this._attachedOverlays.length===0&&this.detach();}canReceiveEvent(e,t,n){return n.observers.length<1?false:e.eventPredicate?e.eventPredicate(t):true}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})(),On=(()=>{class o extends Rn{_ngZone=v(ae);_renderer=v(On$1).createRenderer(null,null);_cleanupKeydown;add(e){super.add(e),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener);}),this._isAttached=true);}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=false);}_keydownListener=e=>{let t=this._attachedOverlays;for(let n=t.length-1;n>-1;n--){let r=t[n];if(this.canReceiveEvent(r,e,r._keydownEvents)){this._ngZone.run(()=>r._keydownEvents.next(e));break}}};static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})(),Dn=(()=>{class o extends Rn{_platform=v(v$1);_ngZone=v(ae);_renderer=v(On$1).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=false;_pointerDownEventTarget=null;_cleanups;add(e){if(super.add(e),!this._isAttached){let t=this._document.body,n={capture:true},r=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[r.listen(t,"pointerdown",this._pointerDownListener,n),r.listen(t,"click",this._clickListener,n),r.listen(t,"auxclick",this._clickListener,n),r.listen(t,"contextmenu",this._clickListener,n)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=t.style.cursor,t.style.cursor="pointer",this._cursorStyleIsSet=true),this._isAttached=true;}}detach(){this._isAttached&&(this._cleanups?.forEach(e=>e()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=false),this._isAttached=false);}_pointerDownListener=e=>{this._pointerDownEventTarget=h(e);};_clickListener=e=>{let t=h(e),n=e.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:t;this._pointerDownEventTarget=null;let r=this._attachedOverlays.slice();for(let a=r.length-1;a>-1;a--){let c=r[a],m=c._outsidePointerEvents;if(!(!c.hasAttached()||!this.canReceiveEvent(c,e,m))){if(vn(c.overlayElement,t)||vn(c.overlayElement,n))break;this._ngZone?this._ngZone.run(()=>m.next(e)):m.next(e);}}};static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})();function vn(o,i){let e=typeof ShadowRoot<"u"&&ShadowRoot,t=i;for(;t;){if(t===o)return  true;t=e&&t instanceof ShadowRoot?t.host:t.parentNode;}return  false}var Fn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(t,n){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
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
`],encapsulation:2})}return o})(),Tn=(()=>{class o{_platform=v(v$1);_containerElement;_document=v($);_styleLoader=v(V);ngOnDestroy(){this._containerElement?.remove();}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let e="cdk-overlay-container";if(this._platform.isBrowser||ao$1()){let n=this._document.querySelectorAll(`.${e}[platform="server"], .${e}[platform="test"]`);for(let r=0;r<n.length;r++)n[r].remove();}let t=this._document.createElement("div");t.classList.add(e),ao$1()?t.setAttribute("platform","test"):this._platform.isBrowser||t.setAttribute("platform","server"),this._document.body.appendChild(t),this._containerElement=t;}_loadStyles(){this._styleLoader.load(Fn);}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})(),ei=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(i,e,t,n){this._renderer=e,this._ngZone=t,this.element=i.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=e.listen(this.element,"click",n);}detach(){this._ngZone.runOutsideAngular(()=>{let i=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(i,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),i.style.pointerEvents="none",i.classList.remove("cdk-overlay-backdrop-showing");});}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove();}};function ti(o){return o&&o.nodeType===1}var wt=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new de;_attachments=new de;_detachments=new de;_positionStrategy;_scrollStrategy;_locationChanges=te.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=false;_previousHostParent;_keydownEvents=new de;_outsidePointerEvents=new de;_afterNextRenderRef;constructor(i,e,t,n,r,a,c,m,u,f=false,_,q){this._portalOutlet=i,this._host=e,this._pane=t,this._config=n,this._ngZone=r,this._keyboardDispatcher=a,this._document=c,this._location=m,this._outsideClickDispatcher=u,this._animationsDisabled=f,this._injector=_,this._renderer=q,n.scrollStrategy&&(this._scrollStrategy=n.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=n.positionStrategy;}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(i){if(this._disposed)return null;this._attachHost();let e=this._portalOutlet.attach(i);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=sI(()=>{this.hasAttached()&&this.updatePosition();},{injector:this._injector}),this._togglePointerEvents(true),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,true),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof e?.onDestroy=="function"&&e.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()));}),e}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(false),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let i=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),i}dispose(){if(this._disposed)return;let i=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,i&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=true;}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply();}updatePositionStrategy(i){i!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=i,this.hasAttached()&&(i.attach(this),this.updatePosition()));}updateSize(i){this._config=B$1(B$1({},this._config),i),this._updateElementSize();}setDirection(i){this._config=q(B$1({},this._config),{direction:i}),this._updateElementDirection();}addPanelClass(i){this._pane&&this._toggleClasses(this._pane,i,true);}removePanelClass(i){this._pane&&this._toggleClasses(this._pane,i,false);}getDirection(){let i=this._config.direction;return i?typeof i=="string"?i:i.value:"ltr"}updateScrollStrategy(i){i!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=i,this.hasAttached()&&(i.attach(this),i.enable()));}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection());}_updateElementSize(){if(!this._pane)return;let i=this._pane.style;i.width=go$1(this._config.width),i.height=go$1(this._config.height),i.minWidth=go$1(this._config.minWidth),i.minHeight=go$1(this._config.minHeight),i.maxWidth=go$1(this._config.maxWidth),i.maxHeight=go$1(this._config.maxHeight);}_togglePointerEvents(i){this._pane.style.pointerEvents=i?"":"none";}_attachHost(){if(!this._host.parentElement){let i=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;ti(i)?i.after(this._host):i?.type==="parent"?i.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host);}if(this._config.usePopover)try{this._host.showPopover();}catch{}}_attachBackdrop(){let i="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new ei(this._document,this._renderer,this._ngZone,e=>{this._backdropClick.next(e);}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,true),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(i));}):this._backdropRef.element.classList.add(i);}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host);}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach();}_toggleClasses(i,e,t){let n=Qn(e||[]).filter(r=>!!r);n.length&&(t?i.classList.add(...n):i.classList.remove(...n));}_detachContentWhenEmpty(){let i=false;try{this._detachContentAfterRenderRef=sI(()=>{i=!0,this._detachContent();},{injector:this._injector});}catch(e){if(i)throw e;this._detachContent();}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent();}),this._detachContentMutationObserver.observe(this._pane,{childList:true}));}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,false),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent());}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect();}_disposeScrollStrategy(){let i=this._scrollStrategy;i?.disable(),i?.detach?.();}},yn="cdk-overlay-connected-position-bounding-box",Ho=/([A-Za-z%]+)$/;function ii(o,i){return new St(i,o.get(xe),o.get($),o.get(v$1),o.get(Tn))}var St=class{_viewportRuler;_document;_platform;_overlayContainer;_overlayRef;_isInitialRender=false;_lastBoundingBoxSize={width:0,height:0};_isPushed=false;_canPush=true;_growAfterOpen=false;_hasFlexibleDimensions=true;_positionLocked=false;_originRect;_overlayRect;_viewportRect;_containerRect;_viewportMargin=0;_scrollables=[];_preferredPositions=[];_origin;_pane;_isDisposed=false;_boundingBox=null;_lastPosition=null;_lastScrollVisibility=null;_positionChanges=new de;_resizeSubscription=te.EMPTY;_offsetX=0;_offsetY=0;_transformOriginSelector;_appliedPanelClasses=[];_previousPushAmount=null;_popoverLocation="global";positionChanges=this._positionChanges;get positions(){return this._preferredPositions}constructor(i,e,t,n,r){this._viewportRuler=e,this._document=t,this._platform=n,this._overlayContainer=r,this.setOrigin(i);}attach(i){this._overlayRef&&this._overlayRef,this._validatePositions(),i.hostElement.classList.add(yn),this._overlayRef=i,this._boundingBox=i.hostElement,this._pane=i.overlayElement,this._isDisposed=false,this._isInitialRender=true,this._lastPosition=null,this._resizeSubscription.unsubscribe(),this._resizeSubscription=this._viewportRuler.change().subscribe(()=>{this._isInitialRender=true,this.apply();});}apply(){if(this._isDisposed||!this._platform.isBrowser)return;if(!this._isInitialRender&&this._positionLocked&&this._lastPosition){this.reapplyLastPosition();return}this._clearPanelClasses(),this._resetOverlayElementStyles(),this._resetBoundingBoxStyles(),this._viewportRect=this._getNarrowedViewportRect(),this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._containerRect=this._getContainerRect();let i=this._originRect,e=this._overlayRect,t=this._viewportRect,n=this._containerRect,r=[],a;for(let c of this._preferredPositions){let m=this._getOriginPoint(i,n,c),u=this._getOverlayPoint(m,e,c),f=this._getOverlayFit(u,e,t,c);if(f.isCompletelyWithinViewport){this._isPushed=false,this._applyPosition(c,m);return}if(this._canFitWithFlexibleDimensions(f,u,t)){r.push({position:c,origin:m,overlayRect:e,boundingBoxRect:this._calculateBoundingBoxRect(m,c)});continue}(!a||a.overlayFit.visibleArea<f.visibleArea)&&(a={overlayFit:f,overlayPoint:u,originPoint:m,position:c,overlayRect:e});}if(r.length){let c=null,m=-1;for(let u of r){let f=u.boundingBoxRect.width*u.boundingBoxRect.height*(u.position.weight||1);f>m&&(m=f,c=u);}this._isPushed=false,this._applyPosition(c.position,c.origin);return}if(this._canPush){this._isPushed=true,this._applyPosition(a.position,a.originPoint);return}this._applyPosition(a.position,a.originPoint);}detach(){this._clearPanelClasses(),this._lastPosition=null,this._previousPushAmount=null,this._resizeSubscription.unsubscribe();}dispose(){this._isDisposed||(this._boundingBox&&ke(this._boundingBox.style,{top:"",left:"",right:"",bottom:"",height:"",width:"",alignItems:"",justifyContent:""}),this._pane&&this._resetOverlayElementStyles(),this._overlayRef&&this._overlayRef.hostElement.classList.remove(yn),this.detach(),this._positionChanges.complete(),this._overlayRef=this._boundingBox=null,this._isDisposed=true);}reapplyLastPosition(){if(this._isDisposed||!this._platform.isBrowser)return;let i=this._lastPosition;i?(this._originRect=this._getOriginRect(),this._overlayRect=this._pane.getBoundingClientRect(),this._viewportRect=this._getNarrowedViewportRect(),this._containerRect=this._getContainerRect(),this._applyPosition(i,this._getOriginPoint(this._originRect,this._containerRect,i))):this.apply();}withScrollableContainers(i){return this._scrollables=i,this}withPositions(i){return this._preferredPositions=i,i.indexOf(this._lastPosition)===-1&&(this._lastPosition=null),this._validatePositions(),this}withViewportMargin(i){return this._viewportMargin=i,this}withFlexibleDimensions(i=true){return this._hasFlexibleDimensions=i,this}withGrowAfterOpen(i=true){return this._growAfterOpen=i,this}withPush(i=true){return this._canPush=i,this}withLockedPosition(i=true){return this._positionLocked=i,this}setOrigin(i){return this._origin=i,this}withDefaultOffsetX(i){return this._offsetX=i,this}withDefaultOffsetY(i){return this._offsetY=i,this}withTransformOriginOn(i){return this._transformOriginSelector=i,this}withPopoverLocation(i){return this._popoverLocation=i,this}getPopoverInsertionPoint(){return this._popoverLocation==="global"?null:this._popoverLocation!=="inline"?this._popoverLocation:this._origin instanceof Rt?this._origin.nativeElement:ti(this._origin)?this._origin:null}_getOriginPoint(i,e,t){let n;if(t.originX=="center")n=i.left+i.width/2;else {let a=this._isRtl()?i.right:i.left,c=this._isRtl()?i.left:i.right;n=t.originX=="start"?a:c;}e.left<0&&(n-=e.left);let r;return t.originY=="center"?r=i.top+i.height/2:r=t.originY=="top"?i.top:i.bottom,e.top<0&&(r-=e.top),{x:n,y:r}}_getOverlayPoint(i,e,t){let n;t.overlayX=="center"?n=-e.width/2:t.overlayX==="start"?n=this._isRtl()?-e.width:0:n=this._isRtl()?0:-e.width;let r;return t.overlayY=="center"?r=-e.height/2:r=t.overlayY=="top"?0:-e.height,{x:i.x+n,y:i.y+r}}_getOverlayFit(i,e,t,n){let r=kn(e),{x:a,y:c}=i,m=this._getOffset(n,"x"),u=this._getOffset(n,"y");m&&(a+=m),u&&(c+=u);let f=0-a,_=a+r.width-t.width,q=0-c,K=c+r.height-t.height,U=this._subtractOverflows(r.width,f,_),J=this._subtractOverflows(r.height,q,K),di=U*J;return {visibleArea:di,isCompletelyWithinViewport:r.width*r.height===di,fitsInViewportVertically:J===r.height,fitsInViewportHorizontally:U==r.width}}_canFitWithFlexibleDimensions(i,e,t){if(this._hasFlexibleDimensions){let n=t.bottom-e.y,r=t.right-e.x,a=xn(this._overlayRef.getConfig().minHeight),c=xn(this._overlayRef.getConfig().minWidth),m=i.fitsInViewportVertically||a!=null&&a<=n,u=i.fitsInViewportHorizontally||c!=null&&c<=r;return m&&u}return  false}_pushOverlayOnScreen(i,e,t){if(this._previousPushAmount&&this._positionLocked)return {x:i.x+this._previousPushAmount.x,y:i.y+this._previousPushAmount.y};let n=kn(e),r=this._viewportRect,a=Math.max(i.x+n.width-r.width,0),c=Math.max(i.y+n.height-r.height,0),m=Math.max(r.top-t.top-i.y,0),u=Math.max(r.left-t.left-i.x,0),f=0,_=0;return n.width<=r.width?f=u||-a:f=i.x<this._getViewportMarginStart()?r.left-t.left-i.x:0,n.height<=r.height?_=m||-c:_=i.y<this._getViewportMarginTop()?r.top-t.top-i.y:0,this._previousPushAmount={x:f,y:_},{x:i.x+f,y:i.y+_}}_applyPosition(i,e){if(this._setTransformOrigin(i),this._setOverlayElementStyles(e,i),this._setBoundingBoxStyles(e,i),i.panelClass&&this._addPanelClasses(i.panelClass),this._positionChanges.observers.length){let t=this._getScrollVisibility();if(i!==this._lastPosition||!this._lastScrollVisibility||!Wo(this._lastScrollVisibility,t)){let n=new Ct(i,t);this._positionChanges.next(n);}this._lastScrollVisibility=t;}this._lastPosition=i,this._isInitialRender=false;}_setTransformOrigin(i){if(!this._transformOriginSelector)return;let e=this._boundingBox.querySelectorAll(this._transformOriginSelector),t,n=i.overlayY;i.overlayX==="center"?t="center":this._isRtl()?t=i.overlayX==="start"?"right":"left":t=i.overlayX==="start"?"left":"right";for(let r=0;r<e.length;r++)e[r].style.transformOrigin=`${t} ${n}`;}_calculateBoundingBoxRect(i,e){let t=this._viewportRect,n=this._isRtl(),r,a,c;if(e.overlayY==="top")a=i.y,r=t.height-a+this._getViewportMarginBottom();else if(e.overlayY==="bottom")c=t.height-i.y+this._getViewportMarginTop()+this._getViewportMarginBottom(),r=t.height-c+this._getViewportMarginTop();else {let K=Math.min(t.bottom-i.y+t.top,i.y),U=this._lastBoundingBoxSize.height;r=K*2,a=i.y-K,r>U&&!this._isInitialRender&&!this._growAfterOpen&&(a=i.y-U/2);}let m=e.overlayX==="start"&&!n||e.overlayX==="end"&&n,u=e.overlayX==="end"&&!n||e.overlayX==="start"&&n,f,_,q;if(u)q=t.width-i.x+this._getViewportMarginStart()+this._getViewportMarginEnd(),f=i.x-this._getViewportMarginStart();else if(m)_=i.x,f=t.right-i.x-this._getViewportMarginEnd();else {let K=Math.min(t.right-i.x+t.left,i.x),U=this._lastBoundingBoxSize.width;f=K*2,_=i.x-K,f>U&&!this._isInitialRender&&!this._growAfterOpen&&(_=i.x-U/2);}return {top:a,left:_,bottom:c,right:q,width:f,height:r}}_setBoundingBoxStyles(i,e){let t=this._calculateBoundingBoxRect(i,e);!this._isInitialRender&&!this._growAfterOpen&&(t.height=Math.min(t.height,this._lastBoundingBoxSize.height),t.width=Math.min(t.width,this._lastBoundingBoxSize.width));let n={};if(this._hasExactPosition())n.top=n.left="0",n.bottom=n.right="auto",n.maxHeight=n.maxWidth="",n.width=n.height="100%";else {let r=this._overlayRef.getConfig().maxHeight,a=this._overlayRef.getConfig().maxWidth;n.width=go$1(t.width),n.height=go$1(t.height),n.top=go$1(t.top)||"auto",n.bottom=go$1(t.bottom)||"auto",n.left=go$1(t.left)||"auto",n.right=go$1(t.right)||"auto",e.overlayX==="center"?n.alignItems="center":n.alignItems=e.overlayX==="end"?"flex-end":"flex-start",e.overlayY==="center"?n.justifyContent="center":n.justifyContent=e.overlayY==="bottom"?"flex-end":"flex-start",r&&(n.maxHeight=go$1(r)),a&&(n.maxWidth=go$1(a));}this._lastBoundingBoxSize=t,ke(this._boundingBox.style,n);}_resetBoundingBoxStyles(){ke(this._boundingBox.style,{top:"0",left:"0",right:"0",bottom:"0",height:"",width:"",alignItems:"",justifyContent:""});}_resetOverlayElementStyles(){ke(this._pane.style,{top:"",left:"",bottom:"",right:"",position:"",transform:""});}_setOverlayElementStyles(i,e){let t={},n=this._hasExactPosition(),r=this._hasFlexibleDimensions,a=this._overlayRef.getConfig();if(n){let f=this._viewportRuler.getViewportScrollPosition();ke(t,this._getExactOverlayY(e,i,f)),ke(t,this._getExactOverlayX(e,i,f));}else t.position="static";let c="",m=this._getOffset(e,"x"),u=this._getOffset(e,"y");m&&(c+=`translateX(${m}px) `),u&&(c+=`translateY(${u}px)`),t.transform=c.trim(),a.maxHeight&&(n?t.maxHeight=go$1(a.maxHeight):r&&(t.maxHeight="")),a.maxWidth&&(n?t.maxWidth=go$1(a.maxWidth):r&&(t.maxWidth="")),ke(this._pane.style,t);}_getExactOverlayY(i,e,t){let n={top:"",bottom:""},r=this._getOverlayPoint(e,this._overlayRect,i);if(this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,t)),i.overlayY==="bottom"){let a=this._document.documentElement.clientHeight;n.bottom=`${a-(r.y+this._overlayRect.height)}px`;}else n.top=go$1(r.y);return n}_getExactOverlayX(i,e,t){let n={left:"",right:""},r=this._getOverlayPoint(e,this._overlayRect,i);this._isPushed&&(r=this._pushOverlayOnScreen(r,this._overlayRect,t));let a;if(this._isRtl()?a=i.overlayX==="end"?"left":"right":a=i.overlayX==="end"?"right":"left",a==="right"){let c=this._document.documentElement.clientWidth;n.right=`${c-(r.x+this._overlayRect.width)}px`;}else n.left=go$1(r.x);return n}_getScrollVisibility(){let i=this._getOriginRect(),e=this._pane.getBoundingClientRect(),t=this._scrollables.map(n=>n.getElementRef().nativeElement.getBoundingClientRect());return {isOriginClipped:bn(i,t),isOriginOutsideView:Jt(i,t),isOverlayClipped:bn(e,t),isOverlayOutsideView:Jt(e,t)}}_subtractOverflows(i,...e){return e.reduce((t,n)=>t-Math.max(n,0),i)}_getNarrowedViewportRect(){let i=this._document.documentElement.clientWidth,e=this._document.documentElement.clientHeight,t=this._viewportRuler.getViewportScrollPosition();return {top:t.top+this._getViewportMarginTop(),left:t.left+this._getViewportMarginStart(),right:t.left+i-this._getViewportMarginEnd(),bottom:t.top+e-this._getViewportMarginBottom(),width:i-this._getViewportMarginStart()-this._getViewportMarginEnd(),height:e-this._getViewportMarginTop()-this._getViewportMarginBottom()}}_isRtl(){return this._overlayRef.getDirection()==="rtl"}_hasExactPosition(){return !this._hasFlexibleDimensions||this._isPushed}_getOffset(i,e){return e==="x"?i.offsetX==null?this._offsetX:i.offsetX:i.offsetY==null?this._offsetY:i.offsetY}_validatePositions(){}_addPanelClasses(i){this._pane&&Qn(i).forEach(e=>{e!==""&&this._appliedPanelClasses.indexOf(e)===-1&&(this._appliedPanelClasses.push(e),this._pane.classList.add(e));});}_clearPanelClasses(){this._pane&&(this._appliedPanelClasses.forEach(i=>{this._pane.classList.remove(i);}),this._appliedPanelClasses=[]);}_getViewportMarginStart(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.start??0}_getViewportMarginEnd(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.end??0}_getViewportMarginTop(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.top??0}_getViewportMarginBottom(){return typeof this._viewportMargin=="number"?this._viewportMargin:this._viewportMargin?.bottom??0}_getOriginRect(){let i=this._origin;if(i instanceof Rt)return i.nativeElement.getBoundingClientRect();if(i instanceof Element)return i.getBoundingClientRect();let e=i.width||0,t=i.height||0;return {top:i.y,bottom:i.y+t,left:i.x,right:i.x+e,height:t,width:e}}_getContainerRect(){let i=this._overlayRef.getConfig().usePopover&&this._popoverLocation!=="global",e=this._overlayContainer.getContainerElement();i&&(e.style.display="block");let t=e.getBoundingClientRect();return i&&(e.style.display=""),t}};function ke(o,i){for(let e in i)i.hasOwnProperty(e)&&(o[e]=i[e]);return o}function xn(o){if(typeof o!="number"&&o!=null){let[i,e]=o.split(Ho);return !e||e==="px"?parseFloat(i):null}return o||null}function kn(o){return {top:Math.floor(o.top),right:Math.floor(o.right),bottom:Math.floor(o.bottom),left:Math.floor(o.left),width:Math.floor(o.width),height:Math.floor(o.height)}}function Wo(o,i){return o===i?true:o.isOriginClipped===i.isOriginClipped&&o.isOriginOutsideView===i.isOriginOutsideView&&o.isOverlayClipped===i.isOverlayClipped&&o.isOverlayOutsideView===i.isOverlayOutsideView}var Cn="cdk-global-overlay-wrapper";function Pn(o){return new Et}var Et=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=false;attach(i){let e=i.getConfig();this._overlayRef=i,this._width&&!e.width&&i.updateSize({width:this._width}),this._height&&!e.height&&i.updateSize({height:this._height}),i.hostElement.classList.add(Cn),this._isDisposed=false;}top(i=""){return this._bottomOffset="",this._topOffset=i,this._alignItems="flex-start",this}left(i=""){return this._xOffset=i,this._xPosition="left",this}bottom(i=""){return this._topOffset="",this._bottomOffset=i,this._alignItems="flex-end",this}right(i=""){return this._xOffset=i,this._xPosition="right",this}start(i=""){return this._xOffset=i,this._xPosition="start",this}end(i=""){return this._xOffset=i,this._xPosition="end",this}width(i=""){return this._overlayRef?this._overlayRef.updateSize({width:i}):this._width=i,this}height(i=""){return this._overlayRef?this._overlayRef.updateSize({height:i}):this._height=i,this}centerHorizontally(i=""){return this.left(i),this._xPosition="center",this}centerVertically(i=""){return this.top(i),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let i=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement.style,t=this._overlayRef.getConfig(),{width:n,height:r,maxWidth:a,maxHeight:c}=t,m=(n==="100%"||n==="100vw")&&(!a||a==="100%"||a==="100vw"),u=(r==="100%"||r==="100vh")&&(!c||c==="100%"||c==="100vh"),f=this._xPosition,_=this._xOffset,q=this._overlayRef.getConfig().direction==="rtl",K="",U="",J="";m?J="flex-start":f==="center"?(J="center",q?U=_:K=_):q?f==="left"||f==="end"?(J="flex-end",K=_):(f==="right"||f==="start")&&(J="flex-start",U=_):f==="left"||f==="start"?(J="flex-start",K=_):(f==="right"||f==="end")&&(J="flex-end",U=_),i.position=this._cssPosition,i.marginLeft=m?"0":K,i.marginTop=u?"0":this._topOffset,i.marginBottom=this._bottomOffset,i.marginRight=m?"0":U,e.justifyContent=J,e.alignItems=u?"flex-start":this._alignItems;}dispose(){if(this._isDisposed||!this._overlayRef)return;let i=this._overlayRef.overlayElement.style,e=this._overlayRef.hostElement,t=e.style;e.classList.remove(Cn),t.justifyContent=t.alignItems=i.marginTop=i.marginBottom=i.marginLeft=i.marginRight=i.position="",this._overlayRef=null,this._isDisposed=true;}},An=(()=>{class o{_injector=v(se);global(){return Pn()}flexibleConnectedTo(e){return ii(this._injector,e)}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})(),Ge=new I("OVERLAY_DEFAULT_CONFIG");function ni(o,i){o.get(V).load(Fn);let e=o.get(Tn),t=o.get($),n=o.get(wt$1),r=o.get(Or),a=o.get(ie),c=o.get(Ao$1,null,{optional:true})||o.get(On$1).createRenderer(null,null),m=new qe(i),u=o.get(Ge,null,{optional:true})?.usePopover??true;m.direction=m.direction||a.value,!t.body||!("showPopover"in t.body)?m.usePopover=false:m.usePopover=i?.usePopover??u;let f=t.createElement("div"),_=t.createElement("div");f.id=n.getId("cdk-overlay-"),f.classList.add("cdk-overlay-pane"),_.appendChild(f),m.usePopover&&(_.setAttribute("popover","manual"),_.classList.add("cdk-overlay-popover"));let q=m.usePopover?m.positionStrategy?.getPopoverInsertionPoint?.():null;return ti(q)?q.after(_):q?.type==="parent"?q.element.appendChild(_):e.getContainerElement().appendChild(_),new wt(new vt(f,r,o),_,f,m,o.get(ae),o.get(On),t,o.get(zm),o.get(Dn),i?.disableAnimations??o.get(wD,null,{optional:true})==="NoopAnimations",o.get(ge),c)}var In=(()=>{class o{scrollStrategies=v(Mn);_positionBuilder=v(An);_injector=v(se);create(e){return ni(this._injector,e)}position(){return this._positionBuilder}static \u0275fac=function(t){return new(t||o)};static \u0275prov=et({token:o,factory:o.\u0275fac})}return o})(),jo=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"}],Yo=new I("cdk-connected-overlay-scroll-strategy",{providedIn:"root",factory:()=>{let o=v(se);return ()=>Ue(o)}}),Fe=(()=>{class o{elementRef=v(Rt);static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["","cdk-overlay-origin",""],["","overlay-origin",""],["","cdkOverlayOrigin",""]],exportAs:["cdkOverlayOrigin"]})}return o})(),Nn=new I("cdk-connected-overlay-default-config"),Mt=(()=>{class o{_dir=v(ie,{optional:true});_injector=v(se);_overlayRef;_templatePortal;_backdropSubscription=te.EMPTY;_attachSubscription=te.EMPTY;_detachSubscription=te.EMPTY;_positionSubscription=te.EMPTY;_offsetX;_offsetY;_position;_scrollStrategyFactory=v(Yo);_ngZone=v(ae);origin;positions;positionStrategy;get offsetX(){return this._offsetX}set offsetX(e){this._offsetX=e,this._position&&this._updatePositionStrategy(this._position);}get offsetY(){return this._offsetY}set offsetY(e){this._offsetY=e,this._position&&this._updatePositionStrategy(this._position);}width;height;minWidth;minHeight;backdropClass;panelClass;viewportMargin=0;scrollStrategy;open=false;disableClose=false;transformOriginSelector;hasBackdrop=false;lockPosition=false;flexibleDimensions=false;growAfterOpen=false;push=false;disposeOnNavigation=false;usePopover;matchWidth=false;set _config(e){typeof e!="string"&&this._assignConfig(e);}backdropClick=new bt$1;positionChange=new bt$1;attach=new bt$1;detach=new bt$1;overlayKeydown=new bt$1;overlayOutsideClick=new bt$1;constructor(){let e=v(Sr),t=v(jn$1),n=v(Nn,{optional:true}),r=v(Ge,{optional:true});this.usePopover=r?.usePopover===false?null:"global",this._templatePortal=new Ye(e,t),this.scrollStrategy=this._scrollStrategyFactory(),n&&this._assignConfig(n);}get overlayRef(){return this._overlayRef}get dir(){return this._dir?this._dir.value:"ltr"}ngOnDestroy(){this._attachSubscription.unsubscribe(),this._detachSubscription.unsubscribe(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this._overlayRef?.dispose();}ngOnChanges(e){this._position&&(this._updatePositionStrategy(this._position),this._overlayRef?.updateSize({width:this._getWidth(),minWidth:this.minWidth,height:this.height,minHeight:this.minHeight}),e.origin&&this.open&&this._position.apply()),e.open&&(this.open?this.attachOverlay():this.detachOverlay());}_createOverlay(){(!this.positions||!this.positions.length)&&(this.positions=jo);let e=this._overlayRef=ni(this._injector,this._buildConfig());this._attachSubscription=e.attachments().subscribe(()=>this.attach.emit()),this._detachSubscription=e.detachments().subscribe(()=>this.detach.emit()),e.keydownEvents().subscribe(t=>{this.overlayKeydown.next(t),t.keyCode===27&&!this.disableClose&&!ve(t)&&(t.preventDefault(),this.detachOverlay());}),this._overlayRef.outsidePointerEvents().subscribe(t=>{let n=this._getOriginElement(),r=h(t);(!n||n!==r&&!n.contains(r))&&this.overlayOutsideClick.next(t);});}_buildConfig(){let e=this._position=this.positionStrategy||this._createPositionStrategy(),t=new qe({direction:this._dir||"ltr",positionStrategy:e,scrollStrategy:this.scrollStrategy,hasBackdrop:this.hasBackdrop,disposeOnNavigation:this.disposeOnNavigation,usePopover:!!this.usePopover});return (this.height||this.height===0)&&(t.height=this.height),(this.minWidth||this.minWidth===0)&&(t.minWidth=this.minWidth),(this.minHeight||this.minHeight===0)&&(t.minHeight=this.minHeight),this.backdropClass&&(t.backdropClass=this.backdropClass),this.panelClass&&(t.panelClass=this.panelClass),t}_updatePositionStrategy(e){let t=this.positions.map(n=>({originX:n.originX,originY:n.originY,overlayX:n.overlayX,overlayY:n.overlayY,offsetX:n.offsetX||this.offsetX,offsetY:n.offsetY||this.offsetY,panelClass:n.panelClass||void 0}));return e.setOrigin(this._getOrigin()).withPositions(t).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover===null?"global":this.usePopover)}_createPositionStrategy(){let e=ii(this._injector,this._getOrigin());return this._updatePositionStrategy(e),e}_getOrigin(){return this.origin instanceof Fe?this.origin.elementRef:this.origin}_getOriginElement(){return this.origin instanceof Fe?this.origin.elementRef.nativeElement:this.origin instanceof Rt?this.origin.nativeElement:typeof Element<"u"&&this.origin instanceof Element?this.origin:null}_getWidth(){return this.width?this.width:this.matchWidth?this._getOriginElement()?.getBoundingClientRect?.().width:void 0}attachOverlay(){this._overlayRef||this._createOverlay();let e=this._overlayRef;e.getConfig().hasBackdrop=this.hasBackdrop,e.updateSize({width:this._getWidth()}),e.hasAttached()||e.attach(this._templatePortal),this.hasBackdrop?this._backdropSubscription=e.backdropClick().subscribe(t=>this.backdropClick.emit(t)):this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.positionChange.observers.length>0&&(this._positionSubscription=this._position.positionChanges.pipe(Fv(()=>this.positionChange.observers.length>0)).subscribe(t=>{this._ngZone.run(()=>this.positionChange.emit(t)),this.positionChange.observers.length===0&&this._positionSubscription.unsubscribe();})),this.open=true;}detachOverlay(){this._overlayRef?.detach(),this._backdropSubscription.unsubscribe(),this._positionSubscription.unsubscribe(),this.open=false;}_assignConfig(e){this.origin=e.origin??this.origin,this.positions=e.positions??this.positions,this.positionStrategy=e.positionStrategy??this.positionStrategy,this.offsetX=e.offsetX??this.offsetX,this.offsetY=e.offsetY??this.offsetY,this.width=e.width??this.width,this.height=e.height??this.height,this.minWidth=e.minWidth??this.minWidth,this.minHeight=e.minHeight??this.minHeight,this.backdropClass=e.backdropClass??this.backdropClass,this.panelClass=e.panelClass??this.panelClass,this.viewportMargin=e.viewportMargin??this.viewportMargin,this.scrollStrategy=e.scrollStrategy??this.scrollStrategy,this.disableClose=e.disableClose??this.disableClose,this.transformOriginSelector=e.transformOriginSelector??this.transformOriginSelector,this.hasBackdrop=e.hasBackdrop??this.hasBackdrop,this.lockPosition=e.lockPosition??this.lockPosition,this.flexibleDimensions=e.flexibleDimensions??this.flexibleDimensions,this.growAfterOpen=e.growAfterOpen??this.growAfterOpen,this.push=e.push??this.push,this.disposeOnNavigation=e.disposeOnNavigation??this.disposeOnNavigation,this.usePopover=e.usePopover??this.usePopover,this.matchWidth=e.matchWidth??this.matchWidth;}static \u0275fac=function(t){return new(t||o)};static \u0275dir=Ar({type:o,selectors:[["","cdk-connected-overlay",""],["","connected-overlay",""],["","cdkConnectedOverlay",""]],inputs:{origin:[0,"cdkConnectedOverlayOrigin","origin"],positions:[0,"cdkConnectedOverlayPositions","positions"],positionStrategy:[0,"cdkConnectedOverlayPositionStrategy","positionStrategy"],offsetX:[0,"cdkConnectedOverlayOffsetX","offsetX"],offsetY:[0,"cdkConnectedOverlayOffsetY","offsetY"],width:[0,"cdkConnectedOverlayWidth","width"],height:[0,"cdkConnectedOverlayHeight","height"],minWidth:[0,"cdkConnectedOverlayMinWidth","minWidth"],minHeight:[0,"cdkConnectedOverlayMinHeight","minHeight"],backdropClass:[0,"cdkConnectedOverlayBackdropClass","backdropClass"],panelClass:[0,"cdkConnectedOverlayPanelClass","panelClass"],viewportMargin:[0,"cdkConnectedOverlayViewportMargin","viewportMargin"],scrollStrategy:[0,"cdkConnectedOverlayScrollStrategy","scrollStrategy"],open:[0,"cdkConnectedOverlayOpen","open"],disableClose:[0,"cdkConnectedOverlayDisableClose","disableClose"],transformOriginSelector:[0,"cdkConnectedOverlayTransformOriginOn","transformOriginSelector"],hasBackdrop:[2,"cdkConnectedOverlayHasBackdrop","hasBackdrop",yb],lockPosition:[2,"cdkConnectedOverlayLockPosition","lockPosition",yb],flexibleDimensions:[2,"cdkConnectedOverlayFlexibleDimensions","flexibleDimensions",yb],growAfterOpen:[2,"cdkConnectedOverlayGrowAfterOpen","growAfterOpen",yb],push:[2,"cdkConnectedOverlayPush","push",yb],disposeOnNavigation:[2,"cdkConnectedOverlayDisposeOnNavigation","disposeOnNavigation",yb],usePopover:[0,"cdkConnectedOverlayUsePopover","usePopover"],matchWidth:[2,"cdkConnectedOverlayMatchWidth","matchWidth",yb],_config:[0,"cdkConnectedOverlay","_config"]},outputs:{backdropClick:"backdropClick",positionChange:"positionChange",attach:"attach",detach:"detach",overlayKeydown:"overlayKeydown",overlayOutsideClick:"overlayOutsideClick"},exportAs:["cdkConnectedOverlay"],features:[Ss]})}return o})(),oi=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({providers:[In],imports:[J,_n,Kt,Kt]})}return o})();var Ln=(()=>{class o{_animationsDisabled=B();state="unchecked";disabled=false;appearance="full";static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(t,n){t&2&&Xg("mat-pseudo-checkbox-indeterminate",n.state==="indeterminate")("mat-pseudo-checkbox-checked",n.state==="checked")("mat-pseudo-checkbox-disabled",n.disabled)("mat-pseudo-checkbox-minimal",n.appearance==="minimal")("mat-pseudo-checkbox-full",n.appearance==="full")("_mat-animation-noopable",n._animationsDisabled);},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(t,n){},styles:[`.mat-pseudo-checkbox {
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
`],encapsulation:2})}return o})();var Xo=["text"],qo=[[["mat-icon"]],"*"],Uo=["mat-icon","*"];function Go(o,i){if(o&1&&Pg(0,"mat-pseudo-checkbox",1),o&2){let e=HC();Fg("disabled",e.disabled)("state",e.selected?"checked":"unchecked");}}function Ko(o,i){if(o&1&&Pg(0,"mat-pseudo-checkbox",3),o&2){let e=HC();Fg("disabled",e.disabled);}}function Zo(o,i){if(o&1&&(bs(0,"span",4),yT(1),wl()),o&2){let e=HC();xI(),Sl("(",e.group.label,")");}}var ai=new I("MAT_OPTION_PARENT_COMPONENT"),si=new I("MatOptgroup");var ri=class{source;isUserInput;constructor(i,e=false){this.source=i,this.isUserInput=e;}},Te=(()=>{class o{_element=v(Rt);_changeDetectorRef=v(Pm);_parent=v(ai,{optional:true});group=v(si,{optional:true});_signalDisableRipple=false;_selected=false;_active=false;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=v(wt$1).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e);}_disabled=Ye$1(false);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return !!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new bt$1;_text;_stateChanges=new de;constructor(){let e=v(V);e.load(Me),e.load(Se),this._signalDisableRipple=!!this._parent&&Er(this._parent.disableRipple);}get active(){return this._active}get viewValue(){return (this._text?.nativeElement.textContent||"").trim()}select(e=true){this._selected||(this._selected=true,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent());}deselect(e=true){this._selected&&(this._selected=false,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent());}focus(e,t){let n=this._getHostElement();typeof n.focus=="function"&&n.focus(t);}setActiveStyles(){this._active||(this._active=true,this._changeDetectorRef.markForCheck());}setInactiveStyles(){this._active&&(this._active=false,this._changeDetectorRef.markForCheck());}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!ve(e)&&(this._selectViaInteraction(),e.preventDefault());}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:true,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(true));}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e);}}ngOnDestroy(){this._stateChanges.complete();}_emitSelectionChangeEvent(e=false){this.onSelectionChange.emit(new ri(this,e));}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["mat-option"]],viewQuery:function(t,n){if(t&1&&Wg(Xo,7),t&2){let r;WC(r=qC())&&(n._text=r.first);}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(t,n){t&1&&Ug("click",function(){return n._selectViaInteraction()})("keydown",function(a){return n._handleKeydown(a)}),t&2&&(Vg("id",n.id),kg("aria-selected",n.selected)("aria-disabled",n.disabled.toString()),Xg("mdc-list-item--selected",n.selected)("mat-mdc-option-multiple",n.multiple)("mat-mdc-option-active",n.active)("mdc-list-item--disabled",n.disabled));},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",yb]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:Uo,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(t,n){t&1&&($C(qo),bC(0,Go,1,2,"mat-pseudo-checkbox",1),zC(1),bs(2,"span",2,0),zC(4,1),wl(),bC(5,Ko,1,1,"mat-pseudo-checkbox",3),bC(6,Zo,2,1,"span",4),Pg(7,"div",5)),t&2&&(_C(n.multiple?0:-1),xI(5),_C(!n.multiple&&n.selected&&!n.hideSingleSelectionIndicator?5:-1),xI(),_C(n.group&&n.group._inert?6:-1),xI(),Fg("matRippleTrigger",n._getHostElement())("matRippleDisabled",n.disabled||n.disableRipple));},dependencies:[Ln,So$1],styles:[`.mat-mdc-option {
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
`],encapsulation:2})}return o})();function Bn(o,i,e){if(e.length){let t=i.toArray(),n=e.toArray(),r=0;for(let a=0;a<o+1;a++)t[a].group&&t[a].group===n[r]&&r++;return r}return 0}function zn(o,i,e,t){return o<e?o:o+i>e+t?Math.max(0,o-t+i):e}var Vn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[J]})}return o})();var li=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[Ce,Vn,Te,J]})}return o})();var er=["trigger"],tr=["panel"],ir=[[["mat-select-trigger"]],"*"],nr=["mat-select-trigger","*"];function or(o,i){if(o&1&&(bs(0,"span",4),yT(1),wl()),o&2){let e=HC();xI(),om(e.placeholder);}}function rr(o,i){o&1&&zC(0);}function ar(o,i){if(o&1&&(bs(0,"span",11),yT(1),wl()),o&2){let e=HC(2);xI(),om(e.triggerValue);}}function sr(o,i){if(o&1&&(bs(0,"span",5),bC(1,rr,1,0)(2,ar,2,1,"span",11),wl()),o&2){let e=HC();xI(),_C(e.customTrigger?1:2);}}function lr(o,i){if(o&1){let e=PC();bs(0,"div",12,1),Ug("keydown",function(n){Ff(e);let r=HC();return Pf(r._handleKeydown(n))}),zC(2,1),wl();}if(o&2){let e=HC();sT(e.panelClass),Xg("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",e._parentFormField?.color==="primary")("mat-accent",e._parentFormField?.color==="accent")("mat-warn",e._parentFormField?.color==="warn")("mat-undefined",!e._parentFormField?.color),kg("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby());}}var cr=new I("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let o=v(se);return ()=>Ue(o)}}),dr=new I("MAT_SELECT_CONFIG"),mr=new I("MatSelectTrigger"),ci=class{source;value;constructor(i,e){this.source=i,this.value=e;}},jn=(()=>{class o{_viewportRuler=v(xe);_changeDetectorRef=v(Pm);_elementRef=v(Rt);_dir=v(ie,{optional:true});_idGenerator=v(wt$1);_renderer=v(Ao$1);_parentFormField=v(He,{optional:true});ngControl=v(b,{self:true,optional:true});_liveAnnouncer=v(He$1);_defaultOptions=v(dr,{optional:true});_animationsDisabled=B();_popoverLocation;_initialized=new de;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let n=this.panel.nativeElement,r=Bn(e,this.options,this.optionGroups),a=t._getHostElement();e===0&&r===1?n.scrollTop=0:n.scrollTop=zn(a.offsetTop,a.offsetHeight,n.scrollTop,n.offsetHeight);}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0);}_getChangeEvent(e){return new ci(this,e)}_scrollStrategyFactory=v(cr);_panelOpen=false;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new de;_errorStateTracker;stateChanges=new de;disableAutomaticLabeling=true;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=false;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=false;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e);}_disableRipple=Ye$1(false);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties();}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??false;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next();}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(ye$1.required)??false}set required(e){this._required=e,this.stateChanges.next();}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e;}_multiple=false;disableOptionCentering=this._defaultOptions?.disableOptionCentering??false;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection();}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e);}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e;}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next();}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e;}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??false;optionSelectionChanges=pv(()=>{let e=this.options;return e?e.changes.pipe(kv(e),xa(()=>Iv(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(xa(()=>this.optionSelectionChanges))});openedChange=new bt$1;_openedStream=this.openedChange.pipe(Lt(e=>e),fe(()=>{}));_closedStream=this.openedChange.pipe(Lt(e=>!e),fe(()=>{}));selectionChange=new bt$1;valueChange=new bt$1;constructor(){let e=v(gt),t=v(pi,{optional:true}),n=v(Ii,{optional:true}),r=v(new Tm("tabindex"),{optional:true}),a=v(Ge,{optional:true}),c=v(_t,{optional:true,self:true});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new De(e,c||this.ngControl,n,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=r==null?0:parseInt(r)||0,this._popoverLocation=a?.usePopover===false?null:"inline",this.id=this.id;}ngOnInit(){this._selectionModel=new We(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(qd(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges());});}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(qd(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect());}),this.options.changes.pipe(kv(null),qd(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection();});}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let n=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?n.setAttribute("aria-labelledby",e):n.removeAttribute("aria-labelledby");}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState());}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass));}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete();}toggle(){this.panelOpen?this.close():this.open();}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=true,this._overlayDir.positionChange.pipe(Jn$1(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled();}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(true)));}close(){this._panelOpen&&(this._panelOpen=false,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(false)));}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(n),this._cleanupDetach=void 0;};let e=this.panel.nativeElement,t=this._renderer.listen(e,"animationend",r=>{r.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay());}),n=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay();},200);e.classList.add("mat-select-panel-exit");}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck();}writeValue(e){this._assignValue(e);}registerOnChange(e){this._onChange=e;}registerOnTouched(e){this._onTouched=e;}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next();}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return "";if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState();}_isRtl(){return this._dir?this._dir.value==="rtl":false}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e));}_handleClosedKeydown(e){let t=e.keyCode,n=t===40||t===38||t===37||t===39,r=t===13||t===32,a=this._keyManager;if(!a.isTyping()&&r&&!ve(e)||(this.multiple||e.altKey)&&n)e.preventDefault(),this.open();else if(!this.multiple){let c=this.selected;a.onKeydown(e);let m=this.selected;m&&c!==m&&this._liveAnnouncer.announce(m.viewValue,1e4);}}_handleOpenKeydown(e){let t=this._keyManager,n=e.keyCode,r=n===40||n===38,a=t.isTyping();if(r&&e.altKey)e.preventDefault(),this.close();else if(!a&&(n===13||n===32)&&t.activeItem&&!ve(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!a&&this._multiple&&n===65&&e.ctrlKey){e.preventDefault();let c=this.options.some(m=>!m.disabled&&!m.selected);this.options.forEach(m=>{m.disabled||(c?m.select():m.deselect());});}else {let c=t.activeItemIndex;t.onKeydown(e),this._multiple&&r&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==c&&t.activeItem._selectViaInteraction();}}_handleOverlayKeydown(e){e.keyCode===27&&!ve(e)&&(e.preventDefault(),this.close());}_onFocus(){this.disabled||(this._focused=true,this.stateChanges.next());}_onBlur(){this._focused=false,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next());}get empty(){return !this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next();});}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else {let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1);}this._changeDetectorRef.markForCheck();}_selectOptionByValue(e){let t=this.options.find(n=>{if(this._selectionModel.isSelected(n))return  false;try{return (n.value!=null||this.canSelectNullableOptions)&&this._compareWith(n.value,e)}catch{return  false}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,true):false}_skipPredicate=e=>this.panelOpen?false:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof Fe?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck();}_initKeyManager(){this._keyManager=new Et$1(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close());}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction();});}_resetOptions(){let e=Iv(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(qd(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus());}),Iv(...this.options.map(t=>t._stateChanges)).pipe(qd(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next();});}_onSelect(e,t){let n=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(n!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),n!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next();}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,n)=>this.sortComparator?this.sortComparator(t,n,e):e.indexOf(t)-e.indexOf(n)),this.stateChanges.next();}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(n=>n.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck();}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e);}else this._keyManager.setActiveItem(this._selectionModel.selected[0]);}_canOpen(){return !this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e);}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+" ":"";return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby");}onContainerClick(e){let t=h(e);t&&(t.tagName==="MAT-OPTION"||t.classList.contains("cdk-overlay-backdrop")||t.closest(".mat-mdc-select-panel"))||(this.focus(),this.open());}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(t){return new(t||o)};static \u0275cmp=sC({type:o,selectors:[["mat-select"]],contentQueries:function(t,n,r){if(t&1&&Gg(r,mr,5)(r,Te,5)(r,si,5),t&2){let a;WC(a=qC())&&(n.customTrigger=a.first),WC(a=qC())&&(n.options=a),WC(a=qC())&&(n.optionGroups=a);}},viewQuery:function(t,n){if(t&1&&Wg(er,5)(tr,5)(Mt,5),t&2){let r;WC(r=qC())&&(n.trigger=r.first),WC(r=qC())&&(n.panel=r.first),WC(r=qC())&&(n._overlayDir=r.first);}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(t,n){t&1&&Ug("keydown",function(a){return n._handleKeydown(a)})("focus",function(){return n._onFocus()})("blur",function(){return n._onBlur()}),t&2&&(kg("id",n.id)("tabindex",n.disabled?-1:n.tabIndex)("aria-controls",n.panelOpen?n.id+"-panel":null)("aria-expanded",n.panelOpen)("aria-label",n.ariaLabel||null)("aria-required",n.required.toString())("aria-disabled",n.disabled.toString())("aria-invalid",n.errorState)("aria-activedescendant",n._getAriaActiveDescendant()),Xg("mat-mdc-select-disabled",n.disabled)("mat-mdc-select-invalid",n.errorState)("mat-mdc-select-required",n.required)("mat-mdc-select-empty",n.empty)("mat-mdc-select-multiple",n.multiple)("mat-select-open",n.panelOpen));},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",yb],disableRipple:[2,"disableRipple","disableRipple",yb],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:vb(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",yb],placeholder:"placeholder",required:[2,"required","required",yb],multiple:[2,"multiple","multiple",yb],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",yb],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",vb],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",yb]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[NT([{provide:Ve,useExisting:o},{provide:ai,useExisting:o}]),Ss],ngContentSelectors:nr,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(t,n){if(t&1&&($C(ir),bs(0,"div",2,0),Ug("click",function(){return n.open()}),bs(3,"div",3),bC(4,or,2,1,"span",4)(5,sr,3,1,"span",5),wl(),bs(6,"div",6)(7,"div",7),qf(),bs(8,"svg",8),Pg(9,"path",9),wl()()()(),xg(10,lr,3,16,"ng-template",10),Ug("detach",function(){return n.close()})("backdropClick",function(){return n.close()})("overlayKeydown",function(a){return n._handleOverlayKeydown(a)})),t&2){let r=YC(1);xI(3),kg("id",n._valueId),xI(),_C(n.empty?4:5),xI(6),Fg("cdkConnectedOverlayDisableClose",true)("cdkConnectedOverlayPanelClass",n._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",n._scrollStrategy)("cdkConnectedOverlayOrigin",n._preferredOverlayOrigin||r)("cdkConnectedOverlayPositions",n._positions)("cdkConnectedOverlayWidth",n._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",true)("cdkConnectedOverlayUsePopover",n._popoverLocation);}},dependencies:[Fe,Mt],styles:[`@keyframes _mat-select-enter {
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
`],encapsulation:2})}return o})();var Yn=(()=>{class o{static \u0275fac=function(t){return new(t||o)};static \u0275mod=Ro({type:o});static \u0275inj=sr$1({imports:[oi,li,J,bt,ye,li]})}return o})();var Dt=class{constructor(i){this.config=i;}config;useOverlay;title="";text="";html="";backdrop=true;icon;width;allowOutsideClick=true;allowEscapeKey=true;allowEnterKey=true;showConfirmButton=true;showDenyButton=false;showCancelButton=false;confirmButtonText="Ok";denyButtonText="No";cancelButtonText="Cancel";confirmButtonColor;denyButtonColor;cancelButtonColor;confirmButtonAriaLabel="";denyButtonAriaLabel="";cancelButtonAriaLabel="";reverseButtons=false;showCloseButton=false;containerClass=""};var Xn=class o{sourceFiles=[{label:"TS",path:"/examples/message/message.ts",language:"typescript"},{label:"HTML",path:"/examples/message/message.html",language:"html"}];options=new Dt;result;constructor(){this.options.title="Message Title",this.options.text="Message Body",this.options.icon="success",this.options.useOverlay=true,this.options.showCloseButton=true,this.options.showCancelButton=true;}ngOnInit(){}openModal(){i.show(this.options).afterClose.subscribe(i=>{this.result=i;});}showLoading(){let i$1=i.fire({icon:"loading",text:"Please Wait...",showConfirmButton:false,allowEnterKey:false,allowEscapeKey:false,allowOutsideClick:false,showCloseButton:false});i$1.afterClose.subscribe(e=>{console.log(e);}),setTimeout(()=>{i$1.close();},5e3);}static \u0275fac=function(e){return new(e||o)};static \u0275cmp=sC({type:o,selectors:[["app-message"]],features:[NT([])],decls:74,vars:26,consts:[["title","Message","readmePath","/readmes/message/README.md",3,"files"],[1,"configuration"],["appearance","outline"],["matInput","","type","text","name","title",3,"ngModelChange","ngModel"],["matInput","","type","text","name","text",3,"ngModelChange","ngModel"],["matInput","","type","text","name","html",3,"ngModelChange","ngModel"],["type","text","name","icon",3,"ngModelChange","ngModel"],[3,"value"],["name","showCloseButton",3,"ngModelChange","ngModel"],["name","allowOutsideClick",3,"ngModelChange","ngModel"],["name","allowEnterKey",3,"ngModelChange","ngModel"],["name","allowEscapeKey",3,"ngModelChange","ngModel"],["name","showConfirmButton",3,"ngModelChange","ngModel"],["matInput","","type","text","name","confirmButtonText",3,"ngModelChange","ngModel"],[3,"ngModelChange","ngModel"],["matInput","","type","text","name","cancelButtonText",3,"ngModelChange","ngModel"],["mat-raised-button","","color","primary",1,"btn-demo",3,"click"],["dir","ltr",2,"text-align","left"]],template:function(e,t){e&1&&(bs(0,"app-example-showcase",0)(1,"div",1)(2,"mat-form-field",2)(3,"mat-label"),yT(4,"Title"),wl(),bs(5,"input",3),cm("ngModelChange",function(r){return wT(t.options.title,r)||(t.options.title=r),r}),wl(),yw(),wl(),bs(6,"mat-form-field",2)(7,"mat-label"),yT(8,"Text"),wl(),bs(9,"input",4),cm("ngModelChange",function(r){return wT(t.options.text,r)||(t.options.text=r),r}),wl(),yw(),wl(),bs(10,"mat-form-field",2)(11,"mat-label"),yT(12,"Html"),wl(),bs(13,"input",5),cm("ngModelChange",function(r){return wT(t.options.html,r)||(t.options.html=r),r}),wl(),yw(),wl(),bs(14,"mat-form-field",2)(15,"mat-label"),yT(16,"Icon"),wl(),bs(17,"mat-select",6),cm("ngModelChange",function(r){return wT(t.options.icon,r)||(t.options.icon=r),r}),bs(18,"mat-option",7),yT(19,"None"),wl(),bs(20,"mat-option",7),yT(21,"Success"),wl(),bs(22,"mat-option",7),yT(23,"Error"),wl(),bs(24,"mat-option",7),yT(25,"Info"),wl(),bs(26,"mat-option",7),yT(27,"Warning"),wl(),bs(28,"mat-option",7),yT(29,"Question"),wl(),bs(30,"mat-option",7),yT(31,"Loading"),wl()(),yw(),wl()(),bs(32,"div")(33,"mat-checkbox",8),cm("ngModelChange",function(r){return wT(t.options.showCloseButton,r)||(t.options.showCloseButton=r),r}),yT(34," Show Close Button "),wl(),yw(),bs(35,"mat-checkbox",9),cm("ngModelChange",function(r){return wT(t.options.allowOutsideClick,r)||(t.options.allowOutsideClick=r),r}),yT(36," Allow Outside Click "),wl(),yw(),bs(37,"mat-checkbox",10),cm("ngModelChange",function(r){return wT(t.options.allowEnterKey,r)||(t.options.allowEnterKey=r),r}),yT(38," Allow Enter Key "),wl(),yw(),bs(39,"mat-checkbox",11),cm("ngModelChange",function(r){return wT(t.options.allowEscapeKey,r)||(t.options.allowEscapeKey=r),r}),yT(40," Allow Escape Key "),wl(),yw(),wl(),bs(41,"div",1)(42,"mat-checkbox",12),cm("ngModelChange",function(r){return wT(t.options.showConfirmButton,r)||(t.options.showConfirmButton=r),r}),yT(43," Show confirm button "),wl(),yw(),bs(44,"mat-form-field",2)(45,"mat-label"),yT(46,"Text"),wl(),bs(47,"input",13),cm("ngModelChange",function(r){return wT(t.options.confirmButtonText,r)||(t.options.confirmButtonText=r),r}),wl(),yw(),wl()(),bs(48,"div",1)(49,"mat-checkbox",14),cm("ngModelChange",function(r){return wT(t.options.showCancelButton,r)||(t.options.showCancelButton=r),r}),yT(50,"Show Cancel button"),wl(),yw(),bs(51,"mat-form-field",2)(52,"mat-label"),yT(53,"Text"),wl(),bs(54,"input",15),cm("ngModelChange",function(r){return wT(t.options.cancelButtonText,r)||(t.options.cancelButtonText=r),r}),wl(),yw(),wl()(),bs(55,"div",1)(56,"mat-checkbox",14),cm("ngModelChange",function(r){return wT(t.options.showDenyButton,r)||(t.options.showDenyButton=r),r}),yT(57,"Show Deny button"),wl(),yw(),bs(58,"mat-form-field",2)(59,"mat-label"),yT(60,"Text"),wl(),bs(61,"input",15),cm("ngModelChange",function(r){return wT(t.options.denyButtonText,r)||(t.options.denyButtonText=r),r}),wl(),yw(),wl()(),bs(62,"div",1)(63,"mat-checkbox",14),cm("ngModelChange",function(r){return wT(t.options.useOverlay,r)||(t.options.useOverlay=r),r}),yT(64,' Use Overlay popover (add popover="manual" to show dialog in top layer) '),wl(),yw(),wl(),bs(65,"button",16),Ug("click",function(){return t.openModal()}),yT(66," Show Alert "),wl(),bs(67,"h5"),yT(68,"Result:"),wl(),bs(69,"pre",17),yT(70),kT(71,"json"),wl(),bs(72,"button",16),Ug("click",function(){return t.showLoading()}),yT(73," Show loading with 5 seconds "),wl()()),e&2&&(Fg("files",t.sourceFiles),xI(5),am("ngModel",t.options.title),Dw(),xI(4),am("ngModel",t.options.text),Dw(),xI(4),am("ngModel",t.options.html),Dw(),xI(4),am("ngModel",t.options.icon),Dw(),xI(),Fg("value",""),xI(2),Fg("value","success"),xI(2),Fg("value","error"),xI(2),Fg("value","info"),xI(2),Fg("value","warning"),xI(2),Fg("value","question"),xI(2),Fg("value","loading"),xI(3),am("ngModel",t.options.showCloseButton),Dw(),xI(2),am("ngModel",t.options.allowOutsideClick),Dw(),xI(2),am("ngModel",t.options.allowEnterKey),Dw(),xI(2),am("ngModel",t.options.allowEscapeKey),Dw(),xI(3),am("ngModel",t.options.showConfirmButton),Dw(),xI(5),am("ngModel",t.options.confirmButtonText),Dw(),xI(2),am("ngModel",t.options.showCancelButton),Dw(),xI(5),am("ngModel",t.options.cancelButtonText),Dw(),xI(2),am("ngModel",t.options.showDenyButton),Dw(),xI(5),am("ngModel",t.options.denyButtonText),Dw(),xI(2),am("ngModel",t.options.useOverlay),Dw(),xI(7),om(PT(71,24,t.result)));},dependencies:[uy,an$1,ot,Ji$1,_i,ye,pt,ze,bn$1,pn,un,di,en$1,Yn,jn,Te,Qi,Xt,od,n_],styles:[".configuration[_ngcontent-%COMP%]{display:flex;gap:20px;flex-wrap:wrap;align-items:center}"]})};export{Xn as MessageComponent};