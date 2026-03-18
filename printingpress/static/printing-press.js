var PrintingPress=(function(d){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var _i,ki;const Jt=globalThis,Rr=Jt.ShadowRoot&&(Jt.ShadyCSS===void 0||Jt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Lr=Symbol(),qo=new WeakMap;let Wo=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==Lr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(Rr&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=qo.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&qo.set(r,e))}return e}toString(){return this.cssText}};const Si=t=>new Wo(typeof t=="string"?t:t+"",void 0,Lr),R=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new Wo(r,t,Lr)},Ei=(t,e)=>{if(Rr)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const o=document.createElement("style"),s=Jt.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},Ko=Rr?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Si(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Oi,defineProperty:Ti,getOwnPropertyDescriptor:Ri,getOwnPropertyNames:Li,getOwnPropertySymbols:Mi,getPrototypeOf:zi}=Object,Se=globalThis,Go=Se.trustedTypes,Di=Go?Go.emptyScript:"",Mr=Se.reactiveElementPolyfillSupport,vt=(t,e)=>t,qt={toAttribute(t,e){switch(e){case Boolean:t=t?Di:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},zr=(t,e)=>!Oi(t,e),Yo={attribute:!0,type:String,converter:qt,reflect:!1,useDefault:!1,hasChanged:zr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Se.litPropertyMetadata??(Se.litPropertyMetadata=new WeakMap);let nt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Yo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&Ti(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=Ri(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:s,set(n){const a=s==null?void 0:s.call(this);i==null||i.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Yo}static _$Ei(){if(this.hasOwnProperty(vt("elementProperties")))return;const e=zi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(vt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(vt("properties"))){const r=this.properties,o=[...Li(r),...Mi(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(Ko(s))}else e!==void 0&&r.push(Ko(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(r=>r(this))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ei(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var i;const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const n=(((i=o.converter)==null?void 0:i.toAttribute)!==void 0?o.converter:qt).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,r){var i,n;const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const a=o.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:qt;this._$Em=s;const c=l.fromAttribute(r,a.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(e,r,o,s=!1,i){var n;if(e!==void 0){const a=this.constructor;if(s===!1&&(i=this[e]),o??(o=a.getPropertyOptions(e)),!((o.hasChanged??zr)(i,r)||o.useDefault&&o.reflect&&i===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(a._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)}),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach(o=>{var s;return(s=o.hostUpdated)==null?void 0:s.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};nt.elementStyles=[],nt.shadowRootOptions={mode:"open"},nt[vt("elementProperties")]=new Map,nt[vt("finalized")]=new Map,Mr==null||Mr({ReactiveElement:nt}),(Se.reactiveElementVersions??(Se.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Xo=t=>t,Wt=bt.trustedTypes,Zo=Wt?Wt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Qo="$lit$",Ee=`lit$${Math.random().toFixed(9).slice(2)}$`,es="?"+Ee,Ni=`<${es}>`,He=document,yt=()=>He.createComment(""),wt=t=>t===null||typeof t!="object"&&typeof t!="function",Dr=Array.isArray,Fi=t=>Dr(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Nr=`[ 	
\f\r]`,$t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ts=/-->/g,rs=/>/g,Ue=RegExp(`>|${Nr}(?:([^\\s"'>=/]+)(${Nr}*=${Nr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),os=/'/g,ss=/"/g,is=/^(?:script|style|textarea|title)$/i,Ii=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),p=Ii(1),Oe=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ns=new WeakMap,Ve=He.createTreeWalker(He,129);function as(t,e){if(!Dr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Zo!==void 0?Zo.createHTML(e):e}const Bi=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=$t;for(let a=0;a<r;a++){const l=t[a];let c,m,v=-1,_=0;for(;_<l.length&&(n.lastIndex=_,m=n.exec(l),m!==null);)_=n.lastIndex,n===$t?m[1]==="!--"?n=ts:m[1]!==void 0?n=rs:m[2]!==void 0?(is.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=Ue):m[3]!==void 0&&(n=Ue):n===Ue?m[0]===">"?(n=s??$t,v=-1):m[1]===void 0?v=-2:(v=n.lastIndex-m[2].length,c=m[1],n=m[3]===void 0?Ue:m[3]==='"'?ss:os):n===ss||n===os?n=Ue:n===ts||n===rs?n=$t:(n=Ue,s=void 0);const w=n===Ue&&t[a+1].startsWith("/>")?" ":"";i+=n===$t?l+Ni:v>=0?(o.push(c),l.slice(0,v)+Qo+l.slice(v)+Ee+w):l+Ee+(v===-2?a:w)}return[as(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};let Fr=class Pi{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,n=0;const a=e.length-1,l=this.parts,[c,m]=Bi(e,r);if(this.el=Pi.createElement(c,o),Ve.currentNode=this.el.content,r===2||r===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(s=Ve.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const v of s.getAttributeNames())if(v.endsWith(Qo)){const _=m[n++],w=s.getAttribute(v).split(Ee),k=/([.?@])?(.*)/.exec(_);l.push({type:1,index:i,name:k[2],strings:w,ctor:k[1]==="."?Hi:k[1]==="?"?Ui:k[1]==="@"?Vi:Kt}),s.removeAttribute(v)}else v.startsWith(Ee)&&(l.push({type:6,index:i}),s.removeAttribute(v));if(is.test(s.tagName)){const v=s.textContent.split(Ee),_=v.length-1;if(_>0){s.textContent=Wt?Wt.emptyScript:"";for(let w=0;w<_;w++)s.append(v[w],yt()),Ve.nextNode(),l.push({type:2,index:++i});s.append(v[_],yt())}}}else if(s.nodeType===8)if(s.data===es)l.push({type:2,index:i});else{let v=-1;for(;(v=s.data.indexOf(Ee,v+1))!==-1;)l.push({type:7,index:i}),v+=Ee.length-1}i++}}static createElement(e,r){const o=He.createElement("template");return o.innerHTML=e,o}};function at(t,e,r=t,o){var n,a;if(e===Oe)return e;let s=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const i=wt(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=s:r._$Cl=s),s!==void 0&&(e=at(t,s._$AS(t,e.values),s,o)),e}let ji=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=((e==null?void 0:e.creationScope)??He).importNode(r,!0);Ve.currentNode=s;let i=Ve.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Ir(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new Ji(i,this,e)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(i=Ve.nextNode(),n++)}return Ve.currentNode=He,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}},Ir=class Ai{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=at(this,e,r),wt(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==Oe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Fi(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&wt(this._$AH)?this._$AA.nextSibling.data=e:this.T(He.createTextNode(e)),this._$AH=e}$(e){var i;const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Fr.createElement(as(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const n=new ji(s,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=ns.get(e.strings);return r===void 0&&ns.set(e.strings,r=new Fr(e)),r}k(e){Dr(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new Ai(this.O(yt()),this.O(yt()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const s=Xo(e).nextSibling;Xo(e).remove(),e=s}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}},Kt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=b}_$AI(e,r=this,o,s){const i=this.strings;let n=!1;if(i===void 0)e=at(this,e,r,0),n=!wt(e)||e!==this._$AH&&e!==Oe,n&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=at(this,a[o+l],r,l),c===Oe&&(c=this._$AH[l]),n||(n=!wt(c)||c!==this._$AH[l]),c===b?e=b:e!==b&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Hi=class extends Kt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},Ui=class extends Kt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},Vi=class extends Kt{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=at(this,e,r,0)??b)===Oe)return;const o=this._$AH,s=e===b&&o!==b||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==b&&(o===b||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}};class Ji{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){at(this,e)}}const Br=bt.litHtmlPolyfillSupport;Br==null||Br(Fr,Ir),(bt.litHtmlVersions??(bt.litHtmlVersions=[])).push("3.3.2");const qi=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let s=o._$litPart$;if(s===void 0){const i=(r==null?void 0:r.renderBefore)??null;o._$litPart$=s=new Ir(e.insertBefore(yt(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Je=globalThis;let F=class extends nt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qi(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Oe}};F._$litElement$=!0,F.finalized=!0,(_i=Je.litElementHydrateSupport)==null||_i.call(Je,{LitElement:F});const jr=Je.litElementPolyfillSupport;jr==null||jr({LitElement:F}),(Je.litElementVersions??(Je.litElementVersions=[])).push("4.2.2");var Wi=R`
  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-800);
  }

  .tag--primary:active > sl-icon-button {
    color: var(--sl-color-primary-600);
  }

  .tag--success {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-800);
  }

  .tag--success:active > sl-icon-button {
    color: var(--sl-color-success-600);
  }

  .tag--neutral {
    background-color: var(--sl-color-neutral-50);
    border-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-800);
  }

  .tag--neutral:active > sl-icon-button {
    color: var(--sl-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-50);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-800);
  }

  .tag--warning:active > sl-icon-button {
    color: var(--sl-color-warning-600);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-800);
  }

  .tag--danger:active > sl-icon-button {
    color: var(--sl-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--sl-button-font-size-small);
    height: calc(var(--sl-input-height-small) * 0.8);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
    padding: 0 var(--sl-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`,Ki=R`
  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`,Hr="";function Ur(t){Hr=t}function Gi(t=""){if(!Hr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)Ur(r.getAttribute("data-shoelace"));else{const o=e.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let s="";o&&(s=o.getAttribute("src")),Ur(s.split("/").slice(0,-1).join("/"))}}return Hr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Yi={name:"default",resolver:t=>Gi(`assets/icons/${t}.svg`)},Xi=Yi,ls={caret:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,check:`
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"chevron-left":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,"chevron-right":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,copy:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,"eye-slash":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,eyedropper:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,"grip-vertical":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,indeterminate:`
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"person-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,"play-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,"pause-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,radio:`
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,"star-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,"x-lg":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,"x-circle-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `},Zi={name:"system",resolver:t=>t in ls?`data:image/svg+xml,${encodeURIComponent(ls[t])}`:""},Qi=Zi,Gt=[Xi,Qi],Yt=[];function en(t){Yt.push(t)}function tn(t){Yt=Yt.filter(e=>e!==t)}function cs(t){return Gt.find(e=>e.name===t)}function rn(t,e){on(t),Gt.push({name:t,resolver:e.resolver,mutator:e.mutator,spriteSheet:e.spriteSheet}),Yt.forEach(r=>{r.library===t&&r.setIcon()})}function on(t){Gt=Gt.filter(e=>e.name!==t)}var sn=R`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`,ds=Object.defineProperty,nn=Object.defineProperties,an=Object.getOwnPropertyDescriptor,ln=Object.getOwnPropertyDescriptors,ps=Object.getOwnPropertySymbols,cn=Object.prototype.hasOwnProperty,dn=Object.prototype.propertyIsEnumerable,Vr=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),Jr=t=>{throw TypeError(t)},hs=(t,e,r)=>e in t?ds(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Te=(t,e)=>{for(var r in e||(e={}))cn.call(e,r)&&hs(t,r,e[r]);if(ps)for(var r of ps(e))dn.call(e,r)&&hs(t,r,e[r]);return t},xt=(t,e)=>nn(t,ln(e)),u=(t,e,r,o)=>{for(var s=o>1?void 0:o?an(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&ds(e,r,s),s},us=(t,e,r)=>e.has(t)||Jr("Cannot "+r),pn=(t,e,r)=>(us(t,e,"read from private field"),e.get(t)),hn=(t,e,r)=>e.has(t)?Jr("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),un=(t,e,r,o)=>(us(t,e,"write to private field"),e.set(t,r),r),mn=function(t,e){this[0]=t,this[1]=e},fn=t=>{var e=t[Vr("asyncIterator")],r=!1,o,s={};return e==null?(e=t[Vr("iterator")](),o=i=>s[i]=n=>e[i](n)):(e=e.call(t),o=i=>s[i]=n=>{if(r){if(r=!1,i==="throw")throw n;return n}return r=!0,{done:!1,value:new mn(new Promise(a=>{var l=e[i](n);l instanceof Object||Jr("Object expected"),a(l)}),1)}}),s[Vr("iterator")]=()=>s,o("next"),"throw"in e?o("throw"):s.throw=i=>{throw i},"return"in e&&o("return"),s};function G(t,e){const r=Te({waitUntilFirstUpdate:!1},e);return(o,s)=>{const{update:i}=o,n=Array.isArray(t)?t:[t];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const m=a.get(c),v=this[c];m!==v&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[s](m,v)}}),i.call(this,a)}}}var Q=R`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=t=>(e,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gn={attribute:!0,type:String,converter:qt,reflect:!1,hasChanged:zr},vn=(t=gn,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t,!0,a)}}throw Error("Unsupported decorator location: "+o)};function h(t){return(e,r)=>typeof r=="object"?vn(t,e,r):((o,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(t){return h({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bn=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function I(t,e){return(r,o,s)=>{const i=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(t))??null};return bn(r,o,{get(){return i(this)}})}}var Xt,q=class extends F{constructor(){super(),hn(this,Xt,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Te({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let s=" (unknown version)",i=s;"version"in e&&e.version&&(s=" v"+e.version),"version"in o&&o.version&&(i=" v"+o.version),!(s&&i&&s===i)&&console.warn(`Attempted to register <${t}>${s}, but <${t}>${i} has already been registered.`)}attributeChangedCallback(t,e,r){pn(this,Xt)||(this.constructor.elementProperties.forEach((o,s)=>{o.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),un(this,Xt,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Xt=new WeakMap,q.version="2.20.1",q.dependencies={},u([h()],q.prototype,"dir",2),u([h()],q.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yn=(t,e)=>(t==null?void 0:t._$litType$)!==void 0,wn=t=>t.strings===void 0;var _t=Symbol(),Zt=Symbol(),qr,Wr=new Map,ee=class extends q{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e!=null&&e.spriteSheet)return this.svg=p`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?_t:Zt}catch{return Zt}try{const s=document.createElement("div");s.innerHTML=await o.text();const i=s.firstElementChild;if(((r=i==null?void 0:i.tagName)==null?void 0:r.toLowerCase())!=="svg")return _t;qr||(qr=new DOMParser);const a=qr.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):_t}catch{return _t}}connectedCallback(){super.connectedCallback(),en(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),tn(this)}getIconSource(){const t=cs(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?cs(this.library):void 0;if(!e){this.svg=null;return}let s=Wr.get(e);if(s||(s=this.resolveIcon(e,o),Wr.set(e,s)),!this.initialRender)return;const i=await s;if(i===Zt&&Wr.delete(e),e===this.getIconSource().url){if(yn(i)){if(this.svg=i,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(i){case Zt:case _t:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(t=o==null?void 0:o.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};ee.styles=[Q,sn],u([T()],ee.prototype,"svg",2),u([h({reflect:!0})],ee.prototype,"name",2),u([h()],ee.prototype,"src",2),u([h()],ee.prototype,"label",2),u([h({reflect:!0})],ee.prototype,"library",2),u([G("label")],ee.prototype,"handleLabelChange",1),u([G(["name","src","library"])],ee.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kr={ATTRIBUTE:1,CHILD:2},Gr=t=>(...e)=>({_$litDirective$:t,values:e});let Yr=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ve=Gr(class extends Yr{constructor(t){var e;if(super(t),t.type!==Kr.ATTRIBUTE||t.name!=="class"||((e=t.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var o,s;if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in e)e[i]&&!((o=this.nt)!=null&&o.has(i))&&this.st.add(i);return this.render(e)}const r=t.element.classList;for(const i of this.st)i in e||(r.remove(i),this.st.delete(i));for(const i in e){const n=!!e[i];n===this.st.has(i)||(s=this.nt)!=null&&s.has(i)||(n?(r.add(i),this.st.add(i)):(r.remove(i),this.st.delete(i)))}return Oe}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ms=Symbol.for(""),$n=t=>{if((t==null?void 0:t.r)===ms)return t==null?void 0:t._$litStatic$},Qt=(t,...e)=>({_$litStatic$:e.reduce((r,o,s)=>r+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[s+1],t[0]),r:ms}),fs=new Map,xn=t=>(e,...r)=>{const o=r.length;let s,i;const n=[],a=[];let l,c=0,m=!1;for(;c<o;){for(l=e[c];c<o&&(i=r[c],(s=$n(i))!==void 0);)l+=s+e[++c],m=!0;c!==o&&a.push(i),n.push(l),c++}if(c===o&&n.push(e[o]),m){const v=n.join("$$lit$$");(e=fs.get(v))===void 0&&(n.raw=n,fs.set(v,e=n)),r=a}return t(e,...r)},er=xn(p);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const B=t=>t??b;var X=class extends q{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Qt`a`:Qt`button`;return er`
      <${e}
        part="base"
        class=${ve({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${B(t?void 0:this.disabled)}
        type=${B(t?void 0:"button")}
        href=${B(t?this.href:void 0)}
        target=${B(t?this.target:void 0)}
        download=${B(t?this.download:void 0)}
        rel=${B(t&&this.target?"noreferrer noopener":void 0)}
        role=${B(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${B(this.name)}
          library=${B(this.library)}
          src=${B(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};X.styles=[Q,Ki],X.dependencies={"sl-icon":ee},u([I(".icon-button")],X.prototype,"button",2),u([T()],X.prototype,"hasFocus",2),u([h()],X.prototype,"name",2),u([h()],X.prototype,"library",2),u([h()],X.prototype,"src",2),u([h()],X.prototype,"href",2),u([h()],X.prototype,"target",2),u([h()],X.prototype,"download",2),u([h()],X.prototype,"label",2),u([h({type:Boolean,reflect:!0})],X.prototype,"disabled",2);const Xr=new Set,lt=new Map;let qe,Zr="ltr",Qr="en";const gs=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(gs){const t=new MutationObserver(bs);Zr=document.documentElement.dir||"ltr",Qr=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function vs(...t){t.map(e=>{const r=e.$code.toLowerCase();lt.has(r)?lt.set(r,Object.assign(Object.assign({},lt.get(r)),e)):lt.set(r,e),qe||(qe=e)}),bs()}function bs(){gs&&(Zr=document.documentElement.dir||"ltr",Qr=document.documentElement.lang||navigator.language),[...Xr.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let _n=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Xr.add(this.host)}hostDisconnected(){Xr.delete(this.host)}dir(){return`${this.host.dir||Zr}`.toLowerCase()}lang(){return`${this.host.lang||Qr}`.toLowerCase()}getTranslationData(e){var r,o;const s=new Intl.Locale(e.replace(/_/g,"-")),i=s==null?void 0:s.language.toLowerCase(),n=(o=(r=s==null?void 0:s.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=lt.get(`${i}-${n}`),l=lt.get(i);return{locale:s,language:i,region:n,primary:a,secondary:l}}exists(e,r){var o;const{primary:s,secondary:i}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(s&&s[e]||i&&i[e]||r.includeFallback&&qe&&qe[e])}term(e,...r){const{primary:o,secondary:s}=this.getTranslationData(this.lang());let i;if(o&&o[e])i=o[e];else if(s&&s[e])i=s[e];else if(qe&&qe[e])i=qe[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i=="function"?i(...r):i}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var ys={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};vs(ys);var kn=ys,be=class extends _n{};vs(kn);var We=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return p`
      <span
        part="base"
        class=${ve({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?p`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </span>
    `}};We.styles=[Q,Wi],We.dependencies={"sl-icon-button":X},u([h({reflect:!0})],We.prototype,"variant",2),u([h({reflect:!0})],We.prototype,"size",2),u([h({type:Boolean,reflect:!0})],We.prototype,"pill",2),u([h({type:Boolean})],We.prototype,"removable",2),We.define("sl-tag"),X.define("sl-icon-button");var Cn=R`
  :host {
    --max-width: 20rem;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--sl-tooltip-arrow-size);
    --arrow-color: var(--sl-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: var(--sl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--sl-tooltip-border-radius);
    background-color: var(--sl-tooltip-background-color);
    font-family: var(--sl-tooltip-font-family);
    font-size: var(--sl-tooltip-font-size);
    font-weight: var(--sl-tooltip-font-weight);
    line-height: var(--sl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--sl-tooltip-color);
    padding: var(--sl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`,Pn=R`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;const Re=Math.min,te=Math.max,tr=Math.round,rr=Math.floor,ye=t=>({x:t,y:t}),An={left:"right",right:"left",bottom:"top",top:"bottom"};function eo(t,e,r){return te(t,Re(e,r))}function ct(t,e){return typeof t=="function"?t(e):t}function Le(t){return t.split("-")[0]}function dt(t){return t.split("-")[1]}function ws(t){return t==="x"?"y":"x"}function to(t){return t==="y"?"height":"width"}function ke(t){const e=t[0];return e==="t"||e==="b"?"y":"x"}function ro(t){return ws(ke(t))}function Sn(t,e,r){r===void 0&&(r=!1);const o=dt(t),s=ro(t),i=to(s);let n=s==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[i]>e.floating[i]&&(n=or(n)),[n,or(n)]}function En(t){const e=or(t);return[oo(t),e,oo(e)]}function oo(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}const $s=["left","right"],xs=["right","left"],On=["top","bottom"],Tn=["bottom","top"];function Rn(t,e,r){switch(t){case"top":case"bottom":return r?e?xs:$s:e?$s:xs;case"left":case"right":return e?On:Tn;default:return[]}}function Ln(t,e,r,o){const s=dt(t);let i=Rn(Le(t),r==="start",o);return s&&(i=i.map(n=>n+"-"+s),e&&(i=i.concat(i.map(oo)))),i}function or(t){const e=Le(t);return An[e]+t.slice(e.length)}function Mn(t){return{top:0,right:0,bottom:0,left:0,...t}}function _s(t){return typeof t!="number"?Mn(t):{top:t,right:t,bottom:t,left:t}}function sr(t){const{x:e,y:r,width:o,height:s}=t;return{width:o,height:s,top:r,left:e,right:e+o,bottom:r+s,x:e,y:r}}function ks(t,e,r){let{reference:o,floating:s}=t;const i=ke(e),n=ro(e),a=to(n),l=Le(e),c=i==="y",m=o.x+o.width/2-s.width/2,v=o.y+o.height/2-s.height/2,_=o[a]/2-s[a]/2;let w;switch(l){case"top":w={x:m,y:o.y-s.height};break;case"bottom":w={x:m,y:o.y+o.height};break;case"right":w={x:o.x+o.width,y:v};break;case"left":w={x:o.x-s.width,y:v};break;default:w={x:o.x,y:o.y}}switch(dt(e)){case"start":w[n]-=_*(r&&c?-1:1);break;case"end":w[n]+=_*(r&&c?-1:1);break}return w}async function zn(t,e){var r;e===void 0&&(e={});const{x:o,y:s,platform:i,rects:n,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:m="viewport",elementContext:v="floating",altBoundary:_=!1,padding:w=0}=ct(e,t),k=_s(w),S=a[_?v==="floating"?"reference":"floating":v],E=sr(await i.getClippingRect({element:(r=await(i.isElement==null?void 0:i.isElement(S)))==null||r?S:S.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:c,rootBoundary:m,strategy:l})),g=v==="floating"?{x:o,y:s,width:n.floating.width,height:n.floating.height}:n.reference,f=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),y=await(i.isElement==null?void 0:i.isElement(f))?await(i.getScale==null?void 0:i.getScale(f))||{x:1,y:1}:{x:1,y:1},x=sr(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:g,offsetParent:f,strategy:l}):g);return{top:(E.top-x.top+k.top)/y.y,bottom:(x.bottom-E.bottom+k.bottom)/y.y,left:(E.left-x.left+k.left)/y.x,right:(x.right-E.right+k.right)/y.x}}const Dn=50,Nn=async(t,e,r)=>{const{placement:o="bottom",strategy:s="absolute",middleware:i=[],platform:n}=r,a=n.detectOverflow?n:{...n,detectOverflow:zn},l=await(n.isRTL==null?void 0:n.isRTL(e));let c=await n.getElementRects({reference:t,floating:e,strategy:s}),{x:m,y:v}=ks(c,o,l),_=o,w=0;const k={};for(let A=0;A<i.length;A++){const S=i[A];if(!S)continue;const{name:E,fn:g}=S,{x:f,y,data:x,reset:$}=await g({x:m,y:v,initialPlacement:o,placement:_,strategy:s,middlewareData:k,rects:c,platform:a,elements:{reference:t,floating:e}});m=f??m,v=y??v,k[E]={...k[E],...x},$&&w<Dn&&(w++,typeof $=="object"&&($.placement&&(_=$.placement),$.rects&&(c=$.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:s}):$.rects),{x:m,y:v}=ks(c,_,l)),A=-1)}return{x:m,y:v,placement:_,strategy:s,middlewareData:k}},Fn=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:s,rects:i,platform:n,elements:a,middlewareData:l}=e,{element:c,padding:m=0}=ct(t,e)||{};if(c==null)return{};const v=_s(m),_={x:r,y:o},w=ro(s),k=to(w),A=await n.getDimensions(c),S=w==="y",E=S?"top":"left",g=S?"bottom":"right",f=S?"clientHeight":"clientWidth",y=i.reference[k]+i.reference[w]-_[w]-i.floating[k],x=_[w]-i.reference[w],$=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let C=$?$[f]:0;(!C||!await(n.isElement==null?void 0:n.isElement($)))&&(C=a.floating[f]||i.floating[k]);const O=y/2-x/2,P=C/2-A[k]/2-1,L=Re(v[E],P),N=Re(v[g],P),U=L,me=C-A[k]-N,J=C/2-A[k]/2+O,Ae=eo(U,J,me),fe=!l.arrow&&dt(s)!=null&&J!==Ae&&i.reference[k]/2-(J<U?L:N)-A[k]/2<0,Z=fe?J<U?J-U:J-me:0;return{[w]:_[w]+Z,data:{[w]:Ae,centerOffset:J-Ae-Z,...fe&&{alignmentOffset:Z}},reset:fe}}}),In=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:s,middlewareData:i,rects:n,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:m=!0,crossAxis:v=!0,fallbackPlacements:_,fallbackStrategy:w="bestFit",fallbackAxisSideDirection:k="none",flipAlignment:A=!0,...S}=ct(t,e);if((r=i.arrow)!=null&&r.alignmentOffset)return{};const E=Le(s),g=ke(a),f=Le(a)===a,y=await(l.isRTL==null?void 0:l.isRTL(c.floating)),x=_||(f||!A?[or(a)]:En(a)),$=k!=="none";!_&&$&&x.push(...Ln(a,A,k,y));const C=[a,...x],O=await l.detectOverflow(e,S),P=[];let L=((o=i.flip)==null?void 0:o.overflows)||[];if(m&&P.push(O[E]),v){const J=Sn(s,n,y);P.push(O[J[0]],O[J[1]])}if(L=[...L,{placement:s,overflows:P}],!P.every(J=>J<=0)){var N,U;const J=(((N=i.flip)==null?void 0:N.index)||0)+1,Ae=C[J];if(Ae&&(!(v==="alignment"?g!==ke(Ae):!1)||L.every(D=>ke(D.placement)===g?D.overflows[0]>0:!0)))return{data:{index:J,overflows:L},reset:{placement:Ae}};let fe=(U=L.filter(Z=>Z.overflows[0]<=0).sort((Z,D)=>Z.overflows[1]-D.overflows[1])[0])==null?void 0:U.placement;if(!fe)switch(w){case"bestFit":{var me;const Z=(me=L.filter(D=>{if($){const V=ke(D.placement);return V===g||V==="y"}return!0}).map(D=>[D.placement,D.overflows.filter(V=>V>0).reduce((V,Be)=>V+Be,0)]).sort((D,V)=>D[1]-V[1])[0])==null?void 0:me[0];Z&&(fe=Z);break}case"initialPlacement":fe=a;break}if(s!==fe)return{reset:{placement:fe}}}return{}}}},Bn=new Set(["left","top"]);async function jn(t,e){const{placement:r,platform:o,elements:s}=t,i=await(o.isRTL==null?void 0:o.isRTL(s.floating)),n=Le(r),a=dt(r),l=ke(r)==="y",c=Bn.has(n)?-1:1,m=i&&l?-1:1,v=ct(e,t);let{mainAxis:_,crossAxis:w,alignmentAxis:k}=typeof v=="number"?{mainAxis:v,crossAxis:0,alignmentAxis:null}:{mainAxis:v.mainAxis||0,crossAxis:v.crossAxis||0,alignmentAxis:v.alignmentAxis};return a&&typeof k=="number"&&(w=a==="end"?k*-1:k),l?{x:w*m,y:_*c}:{x:_*c,y:w*m}}const Hn=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:s,y:i,placement:n,middlewareData:a}=e,l=await jn(e,t);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:n}}}}},Un=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:s,platform:i}=e,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:E=>{let{x:g,y:f}=E;return{x:g,y:f}}},...c}=ct(t,e),m={x:r,y:o},v=await i.detectOverflow(e,c),_=ke(Le(s)),w=ws(_);let k=m[w],A=m[_];if(n){const E=w==="y"?"top":"left",g=w==="y"?"bottom":"right",f=k+v[E],y=k-v[g];k=eo(f,k,y)}if(a){const E=_==="y"?"top":"left",g=_==="y"?"bottom":"right",f=A+v[E],y=A-v[g];A=eo(f,A,y)}const S=l.fn({...e,[w]:k,[_]:A});return{...S,data:{x:S.x-r,y:S.y-o,enabled:{[w]:n,[_]:a}}}}}},Vn=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:s,rects:i,platform:n,elements:a}=e,{apply:l=()=>{},...c}=ct(t,e),m=await n.detectOverflow(e,c),v=Le(s),_=dt(s),w=ke(s)==="y",{width:k,height:A}=i.floating;let S,E;v==="top"||v==="bottom"?(S=v,E=_===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):(E=v,S=_==="end"?"top":"bottom");const g=A-m.top-m.bottom,f=k-m.left-m.right,y=Re(A-m[S],g),x=Re(k-m[E],f),$=!e.middlewareData.shift;let C=y,O=x;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(O=f),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(C=g),$&&!_){const L=te(m.left,0),N=te(m.right,0),U=te(m.top,0),me=te(m.bottom,0);w?O=k-2*(L!==0||N!==0?L+N:te(m.left,m.right)):C=A-2*(U!==0||me!==0?U+me:te(m.top,m.bottom))}await l({...e,availableWidth:O,availableHeight:C});const P=await n.getDimensions(a.floating);return k!==P.width||A!==P.height?{reset:{rects:!0}}:{}}}};function ir(){return typeof window<"u"}function pt(t){return Cs(t)?(t.nodeName||"").toLowerCase():"#document"}function re(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function we(t){var e;return(e=(Cs(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Cs(t){return ir()?t instanceof Node||t instanceof re(t).Node:!1}function ae(t){return ir()?t instanceof Element||t instanceof re(t).Element:!1}function Ce(t){return ir()?t instanceof HTMLElement||t instanceof re(t).HTMLElement:!1}function Ps(t){return!ir()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof re(t).ShadowRoot}function kt(t){const{overflow:e,overflowX:r,overflowY:o,display:s}=le(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&s!=="inline"&&s!=="contents"}function Jn(t){return/^(table|td|th)$/.test(pt(t))}function nr(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}const qn=/transform|translate|scale|rotate|perspective|filter/,Wn=/paint|layout|strict|content/,Ke=t=>!!t&&t!=="none";let so;function ar(t){const e=ae(t)?le(t):t;return Ke(e.transform)||Ke(e.translate)||Ke(e.scale)||Ke(e.rotate)||Ke(e.perspective)||!io()&&(Ke(e.backdropFilter)||Ke(e.filter))||qn.test(e.willChange||"")||Wn.test(e.contain||"")}function Kn(t){let e=Me(t);for(;Ce(e)&&!ht(e);){if(ar(e))return e;if(nr(e))return null;e=Me(e)}return null}function io(){return so==null&&(so=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),so}function ht(t){return/^(html|body|#document)$/.test(pt(t))}function le(t){return re(t).getComputedStyle(t)}function lr(t){return ae(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Me(t){if(pt(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Ps(t)&&t.host||we(t);return Ps(e)?e.host:e}function As(t){const e=Me(t);return ht(e)?t.ownerDocument?t.ownerDocument.body:t.body:Ce(e)&&kt(e)?e:As(e)}function Ct(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const s=As(t),i=s===((o=t.ownerDocument)==null?void 0:o.body),n=re(s);if(i){const a=no(n);return e.concat(n,n.visualViewport||[],kt(s)?s:[],a&&r?Ct(a):[])}else return e.concat(s,Ct(s,[],r))}function no(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Ss(t){const e=le(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const s=Ce(t),i=s?t.offsetWidth:r,n=s?t.offsetHeight:o,a=tr(r)!==i||tr(o)!==n;return a&&(r=i,o=n),{width:r,height:o,$:a}}function ao(t){return ae(t)?t:t.contextElement}function ut(t){const e=ao(t);if(!Ce(e))return ye(1);const r=e.getBoundingClientRect(),{width:o,height:s,$:i}=Ss(e);let n=(i?tr(r.width):r.width)/o,a=(i?tr(r.height):r.height)/s;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Gn=ye(0);function Es(t){const e=re(t);return!io()||!e.visualViewport?Gn:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Yn(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==re(t)?!1:e}function Ge(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const s=t.getBoundingClientRect(),i=ao(t);let n=ye(1);e&&(o?ae(o)&&(n=ut(o)):n=ut(t));const a=Yn(i,r,o)?Es(i):ye(0);let l=(s.left+a.x)/n.x,c=(s.top+a.y)/n.y,m=s.width/n.x,v=s.height/n.y;if(i){const _=re(i),w=o&&ae(o)?re(o):o;let k=_,A=no(k);for(;A&&o&&w!==k;){const S=ut(A),E=A.getBoundingClientRect(),g=le(A),f=E.left+(A.clientLeft+parseFloat(g.paddingLeft))*S.x,y=E.top+(A.clientTop+parseFloat(g.paddingTop))*S.y;l*=S.x,c*=S.y,m*=S.x,v*=S.y,l+=f,c+=y,k=re(A),A=no(k)}}return sr({width:m,height:v,x:l,y:c})}function cr(t,e){const r=lr(t).scrollLeft;return e?e.left+r:Ge(we(t)).left+r}function Os(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-cr(t,r),s=r.top+e.scrollTop;return{x:o,y:s}}function Xn(t){let{elements:e,rect:r,offsetParent:o,strategy:s}=t;const i=s==="fixed",n=we(o),a=e?nr(e.floating):!1;if(o===n||a&&i)return r;let l={scrollLeft:0,scrollTop:0},c=ye(1);const m=ye(0),v=Ce(o);if((v||!v&&!i)&&((pt(o)!=="body"||kt(n))&&(l=lr(o)),v)){const w=Ge(o);c=ut(o),m.x=w.x+o.clientLeft,m.y=w.y+o.clientTop}const _=n&&!v&&!i?Os(n,l):ye(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+m.x+_.x,y:r.y*c.y-l.scrollTop*c.y+m.y+_.y}}function Zn(t){return Array.from(t.getClientRects())}function Qn(t){const e=we(t),r=lr(t),o=t.ownerDocument.body,s=te(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),i=te(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+cr(t);const a=-r.scrollTop;return le(o).direction==="rtl"&&(n+=te(e.clientWidth,o.clientWidth)-s),{width:s,height:i,x:n,y:a}}const Ts=25;function ea(t,e){const r=re(t),o=we(t),s=r.visualViewport;let i=o.clientWidth,n=o.clientHeight,a=0,l=0;if(s){i=s.width,n=s.height;const m=io();(!m||m&&e==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}const c=cr(o);if(c<=0){const m=o.ownerDocument,v=m.body,_=getComputedStyle(v),w=m.compatMode==="CSS1Compat"&&parseFloat(_.marginLeft)+parseFloat(_.marginRight)||0,k=Math.abs(o.clientWidth-v.clientWidth-w);k<=Ts&&(i-=k)}else c<=Ts&&(i+=c);return{width:i,height:n,x:a,y:l}}function ta(t,e){const r=Ge(t,!0,e==="fixed"),o=r.top+t.clientTop,s=r.left+t.clientLeft,i=Ce(t)?ut(t):ye(1),n=t.clientWidth*i.x,a=t.clientHeight*i.y,l=s*i.x,c=o*i.y;return{width:n,height:a,x:l,y:c}}function Rs(t,e,r){let o;if(e==="viewport")o=ea(t,r);else if(e==="document")o=Qn(we(t));else if(ae(e))o=ta(e,r);else{const s=Es(t);o={x:e.x-s.x,y:e.y-s.y,width:e.width,height:e.height}}return sr(o)}function Ls(t,e){const r=Me(t);return r===e||!ae(r)||ht(r)?!1:le(r).position==="fixed"||Ls(r,e)}function ra(t,e){const r=e.get(t);if(r)return r;let o=Ct(t,[],!1).filter(a=>ae(a)&&pt(a)!=="body"),s=null;const i=le(t).position==="fixed";let n=i?Me(t):t;for(;ae(n)&&!ht(n);){const a=le(n),l=ar(n);!l&&a.position==="fixed"&&(s=null),(i?!l&&!s:!l&&a.position==="static"&&!!s&&(s.position==="absolute"||s.position==="fixed")||kt(n)&&!l&&Ls(t,n))?o=o.filter(m=>m!==n):s=a,n=Me(n)}return e.set(t,o),o}function oa(t){let{element:e,boundary:r,rootBoundary:o,strategy:s}=t;const n=[...r==="clippingAncestors"?nr(e)?[]:ra(e,this._c):[].concat(r),o],a=Rs(e,n[0],s);let l=a.top,c=a.right,m=a.bottom,v=a.left;for(let _=1;_<n.length;_++){const w=Rs(e,n[_],s);l=te(w.top,l),c=Re(w.right,c),m=Re(w.bottom,m),v=te(w.left,v)}return{width:c-v,height:m-l,x:v,y:l}}function sa(t){const{width:e,height:r}=Ss(t);return{width:e,height:r}}function ia(t,e,r){const o=Ce(e),s=we(e),i=r==="fixed",n=Ge(t,!0,i,e);let a={scrollLeft:0,scrollTop:0};const l=ye(0);function c(){l.x=cr(s)}if(o||!o&&!i)if((pt(e)!=="body"||kt(s))&&(a=lr(e)),o){const w=Ge(e,!0,i,e);l.x=w.x+e.clientLeft,l.y=w.y+e.clientTop}else s&&c();i&&!o&&s&&c();const m=s&&!o&&!i?Os(s,a):ye(0),v=n.left+a.scrollLeft-l.x-m.x,_=n.top+a.scrollTop-l.y-m.y;return{x:v,y:_,width:n.width,height:n.height}}function lo(t){return le(t).position==="static"}function Ms(t,e){if(!Ce(t)||le(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return we(t)===r&&(r=r.ownerDocument.body),r}function zs(t,e){const r=re(t);if(nr(t))return r;if(!Ce(t)){let s=Me(t);for(;s&&!ht(s);){if(ae(s)&&!lo(s))return s;s=Me(s)}return r}let o=Ms(t,e);for(;o&&Jn(o)&&lo(o);)o=Ms(o,e);return o&&ht(o)&&lo(o)&&!ar(o)?r:o||Kn(t)||r}const na=async function(t){const e=this.getOffsetParent||zs,r=this.getDimensions,o=await r(t.floating);return{reference:ia(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function aa(t){return le(t).direction==="rtl"}const dr={convertOffsetParentRelativeRectToViewportRelativeRect:Xn,getDocumentElement:we,getClippingRect:oa,getOffsetParent:zs,getElementRects:na,getClientRects:Zn,getDimensions:sa,getScale:ut,isElement:ae,isRTL:aa};function Ds(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function la(t,e){let r=null,o;const s=we(t);function i(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),i();const c=t.getBoundingClientRect(),{left:m,top:v,width:_,height:w}=c;if(a||e(),!_||!w)return;const k=rr(v),A=rr(s.clientWidth-(m+_)),S=rr(s.clientHeight-(v+w)),E=rr(m),f={rootMargin:-k+"px "+-A+"px "+-S+"px "+-E+"px",threshold:te(0,Re(1,l))||1};let y=!0;function x($){const C=$[0].intersectionRatio;if(C!==l){if(!y)return n();C?n(!1,C):o=setTimeout(()=>{n(!1,1e-7)},1e3)}C===1&&!Ds(c,t.getBoundingClientRect())&&n(),y=!1}try{r=new IntersectionObserver(x,{...f,root:s.ownerDocument})}catch{r=new IntersectionObserver(x,f)}r.observe(t)}return n(!0),i}function ca(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=ao(t),m=s||i?[...c?Ct(c):[],...e?Ct(e):[]]:[];m.forEach(E=>{s&&E.addEventListener("scroll",r,{passive:!0}),i&&E.addEventListener("resize",r)});const v=c&&a?la(c,r):null;let _=-1,w=null;n&&(w=new ResizeObserver(E=>{let[g]=E;g&&g.target===c&&w&&e&&(w.unobserve(e),cancelAnimationFrame(_),_=requestAnimationFrame(()=>{var f;(f=w)==null||f.observe(e)})),r()}),c&&!l&&w.observe(c),e&&w.observe(e));let k,A=l?Ge(t):null;l&&S();function S(){const E=Ge(t);A&&!Ds(A,E)&&r(),A=E,k=requestAnimationFrame(S)}return r(),()=>{var E;m.forEach(g=>{s&&g.removeEventListener("scroll",r),i&&g.removeEventListener("resize",r)}),v==null||v(),(E=w)==null||E.disconnect(),w=null,l&&cancelAnimationFrame(k)}}const da=Hn,pa=Un,ha=In,Ns=Vn,ua=Fn,ma=(t,e,r)=>{const o=new Map,s={platform:dr,...r},i={...s.platform,_c:o};return Nn(t,e,{...s,platform:i})};function fa(t){return ga(t)}function co(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function ga(t){for(let e=t;e;e=co(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=co(t);e;e=co(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||ar(r)||e.tagName==="BODY"))return e}return null}function va(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var M=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,s=0,i=0,n=0,a=0,l=0,c=0,m=0;r?t.top<e.top?(o=t.left,s=t.bottom,i=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,m=e.top):(o=e.left,s=e.bottom,i=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,m=t.top):t.left<e.left?(o=t.right,s=t.top,i=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,m=e.bottom):(o=e.right,s=e.top,i=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,m=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${m}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||va(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=ca(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[da({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Ns({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=s?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(ha({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(pa({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Ns({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(ua({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>dr.getOffsetParent(r,fa):dr.getOffsetParent;ma(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:xt(Te({},dr),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:s,placement:i})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=s.arrow.x,c=s.arrow.y;let m="",v="",_="",w="";if(this.arrowPlacement==="start"){const k=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",v=n?k:"",w=n?"":k}else if(this.arrowPlacement==="end"){const k=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";v=n?"":k,w=n?k:"",_=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(w=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",m=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(w=typeof l=="number"?`${l}px`:"",m=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:m,right:v,bottom:_,left:w,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return p`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${ve({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${ve({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?p`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};M.styles=[Q,Pn],u([I(".popup")],M.prototype,"popup",2),u([I(".popup__arrow")],M.prototype,"arrowEl",2),u([h()],M.prototype,"anchor",2),u([h({type:Boolean,reflect:!0})],M.prototype,"active",2),u([h({reflect:!0})],M.prototype,"placement",2),u([h({reflect:!0})],M.prototype,"strategy",2),u([h({type:Number})],M.prototype,"distance",2),u([h({type:Number})],M.prototype,"skidding",2),u([h({type:Boolean})],M.prototype,"arrow",2),u([h({attribute:"arrow-placement"})],M.prototype,"arrowPlacement",2),u([h({attribute:"arrow-padding",type:Number})],M.prototype,"arrowPadding",2),u([h({type:Boolean})],M.prototype,"flip",2),u([h({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],M.prototype,"flipFallbackPlacements",2),u([h({attribute:"flip-fallback-strategy"})],M.prototype,"flipFallbackStrategy",2),u([h({type:Object})],M.prototype,"flipBoundary",2),u([h({attribute:"flip-padding",type:Number})],M.prototype,"flipPadding",2),u([h({type:Boolean})],M.prototype,"shift",2),u([h({type:Object})],M.prototype,"shiftBoundary",2),u([h({attribute:"shift-padding",type:Number})],M.prototype,"shiftPadding",2),u([h({attribute:"auto-size"})],M.prototype,"autoSize",2),u([h()],M.prototype,"sync",2),u([h({type:Object})],M.prototype,"autoSizeBoundary",2),u([h({attribute:"auto-size-padding",type:Number})],M.prototype,"autoSizePadding",2),u([h({attribute:"hover-bridge",type:Boolean})],M.prototype,"hoverBridge",2);var Fs=new Map,ba=new WeakMap;function ya(t){return t??{keyframes:[],options:{duration:0}}}function Is(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function W(t,e){Fs.set(t,ya(e))}function ce(t,e,r){const o=ba.get(t);if(o!=null&&o[e])return Is(o[e],r.dir);const s=Fs.get(e);return s?Is(s,r.dir):{keyframes:[],options:{duration:0}}}function ze(t,e){return new Promise(r=>{function o(s){s.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function de(t,e,r){return new Promise(o=>{if((r==null?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");const s=t.animate(e,xt(Te({},r),{duration:wa()?0:r.duration}));s.addEventListener("cancel",o,{once:!0}),s.addEventListener("finish",o,{once:!0})})}function Bs(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function wa(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function $e(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}function js(t,e){return t.map(r=>xt(Te({},r),{height:r.height==="auto"?`${e}px`:r.height}))}var K=class extends q{constructor(){super(),this.localize=new be(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=Bs(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=Bs(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await $e(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=ce(this,"tooltip.show",{dir:this.localize.dir()});await de(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await $e(this.body);const{keyframes:r,options:o}=ce(this,"tooltip.hide",{dir:this.localize.dir()});await de(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,ze(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ze(this,"sl-after-hide")}render(){return p`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${ve({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${""}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?"polite":"off"}>
          <slot name="content">${this.content}</slot>
        </div>
      </sl-popup>
    `}};K.styles=[Q,Cn],K.dependencies={"sl-popup":M},u([I("slot:not([name])")],K.prototype,"defaultSlot",2),u([I(".tooltip__body")],K.prototype,"body",2),u([I("sl-popup")],K.prototype,"popup",2),u([h()],K.prototype,"content",2),u([h()],K.prototype,"placement",2),u([h({type:Boolean,reflect:!0})],K.prototype,"disabled",2),u([h({type:Number})],K.prototype,"distance",2),u([h({type:Boolean,reflect:!0})],K.prototype,"open",2),u([h({type:Number})],K.prototype,"skidding",2),u([h()],K.prototype,"trigger",2),u([h({type:Boolean})],K.prototype,"hoist",2),u([G("open",{waitUntilFirstUpdate:!0})],K.prototype,"handleOpenChange",1),u([G(["content","distance","hoist","placement","skidding"])],K.prototype,"handleOptionsChange",1),u([G("disabled")],K.prototype,"handleDisabledChange",1),W("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),W("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),K.define("sl-tooltip"),ee.define("sl-icon");var $a=R`
  :host {
    --divider-width: 4px;
    --divider-hit-area: 12px;
    --min: 0%;
    --max: 100%;

    display: grid;
  }

  .start,
  .end {
    overflow: hidden;
  }

  .divider {
    flex: 0 0 var(--divider-width);
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-900);
    z-index: 1;
  }

  .divider:focus {
    outline: none;
  }

  :host(:not([disabled])) .divider:focus-visible {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  :host([disabled]) .divider {
    cursor: not-allowed;
  }

  /* Horizontal */
  :host(:not([vertical], [disabled])) .divider {
    cursor: col-resize;
  }

  :host(:not([vertical])) .divider::after {
    display: flex;
    content: '';
    position: absolute;
    height: 100%;
    left: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    width: var(--divider-hit-area);
  }

  /* Vertical */
  :host([vertical]) {
    flex-direction: column;
  }

  :host([vertical]:not([disabled])) .divider {
    cursor: row-resize;
  }

  :host([vertical]) .divider::after {
    content: '';
    position: absolute;
    width: 100%;
    top: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    height: var(--divider-hit-area);
  }

  @media (forced-colors: active) {
    .divider {
      outline: solid 1px transparent;
    }
  }
`;function xa(t,e){function r(s){const i=t.getBoundingClientRect(),n=t.ownerDocument.defaultView,a=i.left+n.scrollX,l=i.top+n.scrollY,c=s.pageX-a,m=s.pageY-l;e!=null&&e.onMove&&e.onMove(c,m)}function o(){document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o),e!=null&&e.onStop&&e.onStop()}document.addEventListener("pointermove",r,{passive:!0}),document.addEventListener("pointerup",o),(e==null?void 0:e.initialEvent)instanceof PointerEvent&&r(e.initialEvent)}function Hs(t,e,r){const o=s=>Object.is(s,-0)?0:s;return t<e?o(e):t>r?o(r):o(t)}var Us=()=>null,oe=class extends q{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new be(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=Us,this.snapThreshold=12}toSnapFunction(t){const e=t.split(" ");return({pos:r,size:o,snapThreshold:s,isRtl:i,vertical:n})=>{let a=r,l=Number.POSITIVE_INFINITY;return e.forEach(c=>{let m;if(c.startsWith("repeat(")){const _=t.substring(7,t.length-1),w=_.endsWith("%"),k=Number.parseFloat(_),A=w?o*(k/100):k;m=Math.round((i&&!n?o-r:r)/A)*A}else c.endsWith("%")?m=o*(Number.parseFloat(c)/100):m=Number.parseFloat(c);i&&!n&&(m=o-m);const v=Math.abs(r-m);v<=s&&v<l&&(a=m,l=v)}),a}}set snap(t){this.snapValue=t??"",t?this.snapFunction=typeof t=="string"?this.toSnapFunction(t):t:this.snapFunction=Us}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(t=>this.handleResize(t)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this)}detectSize(){const{width:t,height:e}=this.getBoundingClientRect();this.size=this.vertical?e:t}percentageToPixels(t){return this.size*(t/100)}pixelsToPercentage(t){return t/this.size*100}handleDrag(t){const e=this.localize.dir()==="rtl";this.disabled||(t.cancelable&&t.preventDefault(),xa(this,{onMove:(r,o)=>{var s;let i=this.vertical?o:r;this.primary==="end"&&(i=this.size-i),i=(s=this.snapFunction({pos:i,size:this.size,snapThreshold:this.snapThreshold,isRtl:e,vertical:this.vertical}))!=null?s:i,this.position=Hs(this.pixelsToPercentage(i),0,100)},initialEvent:t}))}handleKeyDown(t){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(t.key)){let e=this.position;const r=(t.shiftKey?10:1)*(this.primary==="end"?-1:1);if(t.preventDefault(),(t.key==="ArrowLeft"&&!this.vertical||t.key==="ArrowUp"&&this.vertical)&&(e-=r),(t.key==="ArrowRight"&&!this.vertical||t.key==="ArrowDown"&&this.vertical)&&(e+=r),t.key==="Home"&&(e=this.primary==="end"?100:0),t.key==="End"&&(e=this.primary==="end"?0:100),t.key==="Enter")if(this.isCollapsed)e=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const o=this.position;e=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=o})}this.position=Hs(e,0,100)}}handleResize(t){const{width:e,height:r}=t[0].contentRect;this.size=this.vertical?r:e,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const t=this.vertical?"gridTemplateRows":"gridTemplateColumns",e=this.vertical?"gridTemplateColumns":"gridTemplateRows",r=this.localize.dir()==="rtl",o=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,s="auto";return this.primary==="end"?r&&!this.vertical?this.style[t]=`${o} var(--divider-width) ${s}`:this.style[t]=`${s} var(--divider-width) ${o}`:r&&!this.vertical?this.style[t]=`${s} var(--divider-width) ${o}`:this.style[t]=`${o} var(--divider-width) ${s}`,this.style[e]="",p`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${B(this.disabled?void 0:"0")}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `}};oe.styles=[Q,$a],u([I(".divider")],oe.prototype,"divider",2),u([h({type:Number,reflect:!0})],oe.prototype,"position",2),u([h({attribute:"position-in-pixels",type:Number})],oe.prototype,"positionInPixels",2),u([h({type:Boolean,reflect:!0})],oe.prototype,"vertical",2),u([h({type:Boolean,reflect:!0})],oe.prototype,"disabled",2),u([h()],oe.prototype,"primary",2),u([h({reflect:!0})],oe.prototype,"snap",1),u([h({type:Number,attribute:"snap-threshold"})],oe.prototype,"snapThreshold",2),u([G("position")],oe.prototype,"handlePositionChange",1),u([G("positionInPixels")],oe.prototype,"handlePositionInPixelsChange",1),u([G("vertical")],oe.prototype,"handleVerticalChange",1),oe.define("sl-split-panel");var _a=R`
  :host {
    --size: 25rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .drawer {
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .drawer--contained {
    position: absolute;
    z-index: initial;
  }

  .drawer--fixed {
    position: fixed;
    z-index: var(--sl-z-index-drawer);
  }

  .drawer__panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 2;
    max-width: 100%;
    max-height: 100%;
    background-color: var(--sl-panel-background-color);
    box-shadow: var(--sl-shadow-x-large);
    overflow: auto;
    pointer-events: all;
  }

  .drawer__panel:focus {
    outline: none;
  }

  .drawer--top .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--end .drawer__panel {
    top: 0;
    inset-inline-end: 0;
    bottom: auto;
    inset-inline-start: auto;
    width: var(--size);
    height: 100%;
  }

  .drawer--bottom .drawer__panel {
    top: auto;
    inset-inline-end: auto;
    bottom: 0;
    inset-inline-start: 0;
    width: 100%;
    height: var(--size);
  }

  .drawer--start .drawer__panel {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: var(--size);
    height: 100%;
  }

  .drawer__header {
    display: flex;
  }

  .drawer__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .drawer__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .drawer__header-actions sl-icon-button,
  .drawer__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .drawer__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .drawer__footer {
    text-align: right;
    padding: var(--footer-spacing);
  }

  .drawer__footer ::slotted(sl-button:not(:last-of-type)) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .drawer:not(.drawer--has-footer) .drawer__footer {
    display: none;
  }

  .drawer__overlay {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
    pointer-events: all;
  }

  .drawer--contained .drawer__overlay {
    display: none;
  }

  @media (forced-colors: active) {
    .drawer__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`;function*po(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*fn(po(t.shadowRoot.activeElement))))}function Vs(){return[...po()].pop()}var Js=new WeakMap;function qs(t){let e=Js.get(t);return e||(e=window.getComputedStyle(t,null),Js.set(t,e)),e}function ka(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const e=qs(t);return e.visibility!=="hidden"&&e.display!=="none"}function Ca(t){const e=qs(t),{overflowY:r,overflowX:o}=e;return r==="scroll"||o==="scroll"?!0:r!=="auto"||o!=="auto"?!1:t.scrollHeight>t.clientHeight&&r==="auto"||t.scrollWidth>t.clientWidth&&o==="auto"}function Pa(t){const e=t.tagName.toLowerCase(),r=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(r)||r<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){const i=t.getRootNode(),n=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=i.querySelector(`${n}:checked`);return a?a===t:i.querySelector(n)===t}return ka(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:Ca(t):!1}function Aa(t){var e,r;const o=ho(t),s=(e=o[0])!=null?e:null,i=(r=o[o.length-1])!=null?r:null;return{start:s,end:i}}function Sa(t,e){var r;return((r=t.getRootNode({composed:!0}))==null?void 0:r.host)!==e}function ho(t){const e=new WeakMap,r=[];function o(s){if(s instanceof Element){if(s.hasAttribute("inert")||s.closest("[inert]")||e.has(s))return;e.set(s,!0),!r.includes(s)&&Pa(s)&&r.push(s),s instanceof HTMLSlotElement&&Sa(s,t)&&s.assignedElements({flatten:!0}).forEach(i=>{o(i)}),s.shadowRoot!==null&&s.shadowRoot.mode==="open"&&o(s.shadowRoot)}for(const i of s.children)o(i)}return o(t),r.sort((s,i)=>{const n=Number(s.getAttribute("tabindex"))||0;return(Number(i.getAttribute("tabindex"))||0)-n})}var Pt=[],Ea=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var r;if(e.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const o=Vs();if(this.previousFocus=o,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const s=ho(this.element);let i=s.findIndex(a=>a===o);this.previousFocus=this.currentFocus;const n=this.tabDirection==="forward"?1:-1;for(;;){i+n>=s.length?i=0:i+n<0?i=s.length-1:i+=n,this.previousFocus=this.currentFocus;const a=s[i];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||a&&this.possiblyHasTabbableChildren(a))return;e.preventDefault(),this.currentFocus=a,(r=this.currentFocus)==null||r.focus({preventScroll:!1});const l=[...po()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){Pt.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){Pt=Pt.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return Pt[Pt.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const t=ho(this.element);if(!this.element.matches(":focus-within")){const e=t[0],r=t[t.length-1],o=this.tabDirection==="forward"?e:r;typeof(o==null?void 0:o.focus)=="function"&&(this.currentFocus=o,o.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}},uo=new Set;function Oa(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}function Ta(){const t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}function mo(t){if(uo.add(t),!document.documentElement.classList.contains("sl-scroll-lock")){const e=Oa()+Ta();let r=getComputedStyle(document.documentElement).scrollbarGutter;(!r||r==="auto")&&(r="stable"),e<2&&(r=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",r),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function fo(t){uo.delete(t),uo.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}var Ra=t=>{var e;const{activeElement:r}=document;r&&t.contains(r)&&((e=document.activeElement)==null||e.blur())},go=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function La(t){if(!t)return"";const e=t.assignedNodes({flatten:!0});let r="";return[...e].forEach(o=>{o.nodeType===Node.TEXT_NODE&&(r+=o.textContent)}),r}function Ws(t){return t.charAt(0).toUpperCase()+t.slice(1)}var se=class extends q{constructor(){super(...arguments),this.hasSlotController=new go(this,"footer"),this.localize=new be(this),this.modal=new Ea(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=t=>{this.contained||t.key==="Escape"&&this.modal.isActive()&&this.open&&(t.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),mo(this)))}disconnectedCallback(){super.disconnectedCallback(),fo(this),this.removeOpenListeners()}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){const r=ce(this,"drawer.denyClose",{dir:this.localize.dir()});de(this.panel,r.keyframes,r.options);return}this.hide()}addOpenListeners(){var t;"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;document.removeEventListener("keydown",this.handleDocumentKeyDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),mo(this));const t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([$e(this.drawer),$e(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});const e=ce(this,`drawer.show${Ws(this.placement)}`,{dir:this.localize.dir()}),r=ce(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([de(this.panel,e.keyframes,e.options),de(this.overlay,r.keyframes,r.options)]),this.emit("sl-after-show")}else{Ra(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),fo(this)),await Promise.all([$e(this.drawer),$e(this.overlay)]);const t=ce(this,`drawer.hide${Ws(this.placement)}`,{dir:this.localize.dir()}),e=ce(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([de(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),de(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const r=this.originalTrigger;typeof(r==null?void 0:r.focus)=="function"&&setTimeout(()=>r.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),mo(this)),this.open&&this.contained&&(this.modal.deactivate(),fo(this))}async show(){if(!this.open)return this.open=!0,ze(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ze(this,"sl-after-hide")}render(){return p`
      <div
        part="base"
        class=${ve({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${B(this.noHeader?this.label:void 0)}
          aria-labelledby=${B(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":p`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length>0?this.label:"\uFEFF"} </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click=${()=>this.requestClose("close-button")}
                    ></sl-icon-button>
                  </div>
                </header>
              `}

          <slot part="body" class="drawer__body"></slot>

          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};se.styles=[Q,_a],se.dependencies={"sl-icon-button":X},u([I(".drawer")],se.prototype,"drawer",2),u([I(".drawer__panel")],se.prototype,"panel",2),u([I(".drawer__overlay")],se.prototype,"overlay",2),u([h({type:Boolean,reflect:!0})],se.prototype,"open",2),u([h({reflect:!0})],se.prototype,"label",2),u([h({reflect:!0})],se.prototype,"placement",2),u([h({type:Boolean,reflect:!0})],se.prototype,"contained",2),u([h({attribute:"no-header",type:Boolean,reflect:!0})],se.prototype,"noHeader",2),u([G("open",{waitUntilFirstUpdate:!0})],se.prototype,"handleOpenChange",1),u([G("contained",{waitUntilFirstUpdate:!0})],se.prototype,"handleNoModalChange",1),W("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),W("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),W("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),W("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),W("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),W("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),W("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),W("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),W("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),W("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),W("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),se.define("sl-drawer");var Ma=R`
  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--sl-spacing-medium);
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
  }

  .details__header::-webkit-details-marker {
    display: none;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(1px + var(--sl-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: not-allowed;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: var(--sl-spacing-medium);
  }
`,pe=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.style.height=this.open?"auto":"0",this.open&&(this.details.open=!0),this.detailsObserver=new MutationObserver(t=>{for(const e of t)e.type==="attributes"&&e.attributeName==="open"&&(this.details.open?this.show():this.hide())}),this.detailsObserver.observe(this.details,{attributes:!0})}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.detailsObserver)==null||t.disconnect()}handleSummaryClick(t){t.preventDefault(),this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.open?this.hide():this.show()),(t.key==="ArrowUp"||t.key==="ArrowLeft")&&(t.preventDefault(),this.hide()),(t.key==="ArrowDown"||t.key==="ArrowRight")&&(t.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.details.open=!0,this.emit("sl-show",{cancelable:!0}).defaultPrevented){this.open=!1,this.details.open=!1;return}await $e(this.body);const{keyframes:e,options:r}=ce(this,"details.show",{dir:this.localize.dir()});await de(this.body,js(e,this.body.scrollHeight),r),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented){this.details.open=!0,this.open=!0;return}await $e(this.body);const{keyframes:e,options:r}=ce(this,"details.hide",{dir:this.localize.dir()});await de(this.body,js(e,this.body.scrollHeight),r),this.body.style.height="auto",this.details.open=!1,this.emit("sl-after-hide")}}async show(){if(!(this.open||this.disabled))return this.open=!0,ze(this,"sl-after-show")}async hide(){if(!(!this.open||this.disabled))return this.open=!1,ze(this,"sl-after-hide")}render(){const t=this.localize.dir()==="rtl";return p`
      <details
        part="base"
        class=${ve({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":t})}
      >
        <summary
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="content"
          aria-disabled=${this.disabled?"true":"false"}
          tabindex=${this.disabled?"-1":"0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${t?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${t?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </details>
    `}};pe.styles=[Q,Ma],pe.dependencies={"sl-icon":ee},u([I(".details")],pe.prototype,"details",2),u([I(".details__header")],pe.prototype,"header",2),u([I(".details__body")],pe.prototype,"body",2),u([I(".details__expand-icon-slot")],pe.prototype,"expandIconSlot",2),u([h({type:Boolean,reflect:!0})],pe.prototype,"open",2),u([h()],pe.prototype,"summary",2),u([h({type:Boolean,reflect:!0})],pe.prototype,"disabled",2),u([G("open",{waitUntilFirstUpdate:!0})],pe.prototype,"handleOpenChange",1),W("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}}),W("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}}),pe.define("sl-details"),M.define("sl-popup");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pr=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const hr=globalThis,vo=hr.ShadowRoot&&(hr.ShadyCSS===void 0||hr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,bo=Symbol(),Ks=new WeakMap;let Gs=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==bo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(vo&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Ks.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Ks.set(r,e))}return e}toString(){return this.cssText}};const za=t=>new Gs(typeof t=="string"?t:t+"",void 0,bo),At=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new Gs(r,t,bo)},Da=(t,e)=>{if(vo)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),s=hr.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},Ys=vo?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return za(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Na,defineProperty:Fa,getOwnPropertyDescriptor:Ia,getOwnPropertyNames:Ba,getOwnPropertySymbols:ja,getPrototypeOf:Ha}=Object,De=globalThis,Xs=De.trustedTypes,Ua=Xs?Xs.emptyScript:"",yo=De.reactiveElementPolyfillSupport,St=(t,e)=>t,ur={toAttribute(t,e){switch(e){case Boolean:t=t?Ua:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},wo=(t,e)=>!Na(t,e),Zs={attribute:!0,type:String,converter:ur,reflect:!1,useDefault:!1,hasChanged:wo};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),De.litPropertyMetadata??(De.litPropertyMetadata=new WeakMap);let mt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Zs){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&Fa(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=Ia(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:s,set(n){const a=s==null?void 0:s.call(this);i==null||i.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Zs}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;const e=Ha(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){const r=this.properties,o=[...Ba(r),...ja(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(Ys(s))}else e!==void 0&&r.push(Ys(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise((r=>this.enableUpdating=r)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach((r=>r(this)))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Da(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)}))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var i;const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const n=(((i=o.converter)==null?void 0:i.toAttribute)!==void 0?o.converter:ur).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,r){var i,n;const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const a=o.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:ur;this._$Em=s;const c=l.fromAttribute(r,a.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(e,r,o){var s;if(e!==void 0){const i=this.constructor,n=this[e];if(o??(o=i.getPropertyOptions(e)),!((o.hasChanged??wo)(n,r)||o.useDefault&&o.reflect&&n===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(i._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach((s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)})),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach((o=>{var s;return(s=o.hostUpdated)==null?void 0:s.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach((r=>this._$ET(r,this[r])))),this._$EM()}updated(e){}firstUpdated(e){}};mt.elementStyles=[],mt.shadowRootOptions={mode:"open"},mt[St("elementProperties")]=new Map,mt[St("finalized")]=new Map,yo==null||yo({ReactiveElement:mt}),(De.reactiveElementVersions??(De.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Va={attribute:!0,type:String,converter:ur,reflect:!1,hasChanged:wo},Ja=(t=Va,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+o)};function ie(t){return(e,r)=>typeof r=="object"?Ja(t,e,r):((o,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Qs(t){return ie({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,mr=Et.trustedTypes,ei=mr?mr.createPolicy("lit-html",{createHTML:t=>t}):void 0,ti="$lit$",Ne=`lit$${Math.random().toFixed(9).slice(2)}$`,ri="?"+Ne,qa=`<${ri}>`,Ye=document,Ot=()=>Ye.createComment(""),Tt=t=>t===null||typeof t!="object"&&typeof t!="function",$o=Array.isArray,Wa=t=>$o(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",xo=`[ 	
\f\r]`,Rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oi=/-->/g,si=/>/g,Xe=RegExp(`>|${xo}(?:([^\\s"'>=/]+)(${xo}*=${xo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ii=/'/g,ni=/"/g,ai=/^(?:script|style|textarea|title)$/i,Ka=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),Ze=Ka(1),Qe=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),li=new WeakMap,et=Ye.createTreeWalker(Ye,129);function ci(t,e){if(!$o(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ei!==void 0?ei.createHTML(e):e}const Ga=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=Rt;for(let a=0;a<r;a++){const l=t[a];let c,m,v=-1,_=0;for(;_<l.length&&(n.lastIndex=_,m=n.exec(l),m!==null);)_=n.lastIndex,n===Rt?m[1]==="!--"?n=oi:m[1]!==void 0?n=si:m[2]!==void 0?(ai.test(m[2])&&(s=RegExp("</"+m[2],"g")),n=Xe):m[3]!==void 0&&(n=Xe):n===Xe?m[0]===">"?(n=s??Rt,v=-1):m[1]===void 0?v=-2:(v=n.lastIndex-m[2].length,c=m[1],n=m[3]===void 0?Xe:m[3]==='"'?ni:ii):n===ni||n===ii?n=Xe:n===oi||n===si?n=Rt:(n=Xe,s=void 0);const w=n===Xe&&t[a+1].startsWith("/>")?" ":"";i+=n===Rt?l+qa:v>=0?(o.push(c),l.slice(0,v)+ti+l.slice(v)+Ne+w):l+Ne+(v===-2?a:w)}return[ci(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Lt{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,n=0;const a=e.length-1,l=this.parts,[c,m]=Ga(e,r);if(this.el=Lt.createElement(c,o),et.currentNode=this.el.content,r===2||r===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(s=et.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const v of s.getAttributeNames())if(v.endsWith(ti)){const _=m[n++],w=s.getAttribute(v).split(Ne),k=/([.?@])?(.*)/.exec(_);l.push({type:1,index:i,name:k[2],strings:w,ctor:k[1]==="."?Xa:k[1]==="?"?Za:k[1]==="@"?Qa:fr}),s.removeAttribute(v)}else v.startsWith(Ne)&&(l.push({type:6,index:i}),s.removeAttribute(v));if(ai.test(s.tagName)){const v=s.textContent.split(Ne),_=v.length-1;if(_>0){s.textContent=mr?mr.emptyScript:"";for(let w=0;w<_;w++)s.append(v[w],Ot()),et.nextNode(),l.push({type:2,index:++i});s.append(v[_],Ot())}}}else if(s.nodeType===8)if(s.data===ri)l.push({type:2,index:i});else{let v=-1;for(;(v=s.data.indexOf(Ne,v+1))!==-1;)l.push({type:7,index:i}),v+=Ne.length-1}i++}}static createElement(e,r){const o=Ye.createElement("template");return o.innerHTML=e,o}}function ft(t,e,r=t,o){var n,a;if(e===Qe)return e;let s=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const i=Tt(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=s:r._$Cl=s),s!==void 0&&(e=ft(t,s._$AS(t,e.values),s,o)),e}class Ya{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=((e==null?void 0:e.creationScope)??Ye).importNode(r,!0);et.currentNode=s;let i=et.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Mt(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new el(i,this,e)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(i=et.nextNode(),n++)}return et.currentNode=Ye,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}}class Mt{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=ft(this,e,r),Tt(e)?e===j||e==null||e===""?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==Qe&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Wa(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&Tt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ye.createTextNode(e)),this._$AH=e}$(e){var i;const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Lt.createElement(ci(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const n=new Ya(s,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=li.get(e.strings);return r===void 0&&li.set(e.strings,r=new Lt(e)),r}k(e){$o(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new Mt(this.O(Ot()),this.O(Ot()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}}class fr{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=j}_$AI(e,r=this,o,s){const i=this.strings;let n=!1;if(i===void 0)e=ft(this,e,r,0),n=!Tt(e)||e!==this._$AH&&e!==Qe,n&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=ft(this,a[o+l],r,l),c===Qe&&(c=this._$AH[l]),n||(n=!Tt(c)||c!==this._$AH[l]),c===j?e=j:e!==j&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Xa extends fr{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class Za extends fr{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class Qa extends fr{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=ft(this,e,r,0)??j)===Qe)return;const o=this._$AH,s=e===j&&o!==j||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==j&&(o===j||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}}class el{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){ft(this,e)}}const _o=Et.litHtmlPolyfillSupport;_o==null||_o(Lt,Mt),(Et.litHtmlVersions??(Et.litHtmlVersions=[])).push("3.3.1");const tl=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let s=o._$litPart$;if(s===void 0){const i=(r==null?void 0:r.renderBefore)??null;o._$litPart$=s=new Mt(e.insertBefore(Ot(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const tt=globalThis;let Fe=class extends mt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=tl(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Qe}};Fe._$litElement$=!0,Fe.finalized=!0,(ki=tt.litElementHydrateSupport)==null||ki.call(tt,{LitElement:Fe});const ko=tt.litElementPolyfillSupport;ko==null||ko({LitElement:Fe}),(tt.litElementVersions??(tt.litElementVersions=[])).push("4.2.1");function rl(t){switch(t.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const ol=At`
    :host {
        --http-get-color: var(--terminal-text, #00FF00);
        --http-post-color: var(--primary-color, #62c4ff);
        --http-put-color: var(--primary-color, #62c4ff);
        --http-delete-color: var(--sl-color-danger-600, #ff3c74);
        --http-patch-color: var(--primary-color, #62c4ff);
        --http-options-color: var(--sl-color-neutral-500, #585858);
        --http-head-color: var(--sl-color-neutral-500, #585858);
        --http-trace-color: var(--sl-color-neutral-500, #585858);
    }

    sl-tag.method {
        width: 83px;
        text-align: center;
    }

    sl-tag.method.large {
        width: 125px;
        text-align: center;
    }

    sl-tag.method.small {
        width: 67px;
    }

    sl-tag.method.small::part(base) {
        height: 18px;
        width: 67px;
    }

    sl-tag.method.micro {
        width: 48px;
    }

    sl-tag.method.micro::part(base) {
        height: 16px;
        width: 48px;
        font-size: 0.6rem;
        padding: 0 2px;
    }

    sl-tag.method.large::part(base) {
        width: 135px;
    }

    .method::part(base) {
        background: var(--background-color);
        border-radius: 0;
        text-align: center;
        font-family: var(--font-stack-bold), monospace;
        width: 100%;
    }

    sl-tag[variant="success"].method::part(base) {
        color: var(--http-get-color);
        border-color: var(--http-get-color);
    }

    sl-tag[variant="primary"].method::part(base) {
        color: var(--http-post-color);
        border-color: var(--http-post-color);
    }

    sl-tag[variant="warning"].method::part(base) {
        color: var(--http-patch-color);
        border-color: var(--http-patch-color);
    }

    :host-context(html[theme="light"]) .method::part(base) {
        background: #f0f0f0;
        border-color: #000;
        color: #000;
    }

    .method.large::part(base) {
        font-size: 1.5rem
    }

    .method::part(content) {
        border-radius: 0;
        text-align: center;
        width: 100%;
        display: inline-block;
    }

    .method-naked {
        font-family: var(--font-stack-bold), monospace;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        white-space: nowrap;
    }
    .method-naked.get { color: var(--http-get-color); }
    .method-naked.post { color: var(--http-post-color); }
    .method-naked.put { color: var(--http-put-color); }
    .method-naked.delete { color: var(--http-delete-color); }
    .method-naked.patch { color: var(--http-patch-color); }
    .method-naked.options { color: var(--http-options-color); }
    .method-naked.head { color: var(--http-head-color); }
    .method-naked.trace { color: var(--http-trace-color); }

    :host-context(html[theme="light"]) {
        --http-get-color: #15803d;
        --http-post-color: #2563eb;
        --http-put-color: #2563eb;
        --http-delete-color: #dc2626;
        --http-patch-color: #2563eb;
        --http-options-color: #6b7280;
        --http-head-color: #6b7280;
        --http-trace-color: #6b7280;
    }
`;var sl=Object.defineProperty,il=Object.getOwnPropertyDescriptor,rt=(t,e,r,o)=>{for(var s=o>1?void 0:o?il(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&sl(e,r,s),s};const nl={GET:"GET",POST:"POST",PUT:"PUT",DELETE:"DEL",PATCH:"PAT",OPTIONS:"OPT",HEAD:"HEAD",TRACE:"TRC"};let Pe=class extends Fe{constructor(){super(),this.mode="",this.lower=!1,this.method="GET"}render(){if(this.mode==="nav-naked"){const r=this.method.toUpperCase(),o=nl[r]??r,s=this.method.toLowerCase();return Ze`<span class="method-naked ${s}">${o}</span>`}let t="medium";this.large&&(t="large"),this.tiny&&(t="small"),this.micro&&(t="small");const e=this.micro?`method ${t} micro`:`method ${t}`;return Ze`
            <sl-tag variant="${rl(this.method)}" class="${e}"
                    size="${t}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};Pe.styles=ol,rt([ie()],Pe.prototype,"method",2),rt([ie({type:Boolean})],Pe.prototype,"lower",2),rt([ie({type:Boolean})],Pe.prototype,"large",2),rt([ie({type:Boolean})],Pe.prototype,"tiny",2),rt([ie({type:Boolean})],Pe.prototype,"micro",2),rt([ie({reflect:!0})],Pe.prototype,"mode",2),Pe=rt([pr("pb33f-http-method")],Pe);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const al={CHILD:2},ll=t=>(...e)=>({_$litDirective$:t,values:e});class cl{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Co=class extends cl{constructor(e){if(super(e),this.it=j,e.type!==al.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===j||e==null)return this._t=void 0,this.it=e;if(e===Qe)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}};Co.directiveName="unsafeHTML",Co.resultType=1;const di=ll(Co),dl=At`
    :host {
        color: var(--font-color);
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        word-break: break-all;
    }
    .bracket {
        color: var(--secondary-color);
        font-family: var(--font-stack-bold), monospace;
        text-shadow: 0 0 10px var(--secondary-color);
    }

    :host-context(html[theme="light"]) .bracket {
        text-shadow: none;
    }

    .param {
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        text-shadow: 0 0 10px var(--primary-color);
        font-weight: normal;
    }

    :host-context(html[theme="light"]) .param {
        text-shadow: none;
    }
    .slash {
        color: var(--font-color-sub2)
    }
    .param:hover {
        //text-decoration: underline;
        //cursor: pointer;
    }
    
    .nowrap {
        display: inline-block;
    }
`;var pl=Object.defineProperty,hl=Object.getOwnPropertyDescriptor,Po=(t,e,r,o)=>{for(var s=o>1?void 0:o?hl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&pl(e,r,s),s};let zt=class extends Fe{constructor(){super(),this.path="/",this.nowrap=!1}replaceBrackets(){const t=/\{([\w$.#/]+)\}/g,e=this.nowrap?" nowrap":"",r=this.formatSlashes(this.path).replace(t,(o,s)=>`<span class="bracket${e}">{</span><span class="param${e}">${s}</span><span class="bracket${e}">}</span>`);return this.nowrap?Ze`<div style="white-space: nowrap;">${di(r)}</div>`:Ze`${di(r)}`}formatSlashes(t){return t.replaceAll("/",'<span class="slash">/</span>')}render(){return Ze`${this.replaceBrackets()}`}};zt.styles=dl,Po([ie()],zt.prototype,"path",2),Po([ie({type:Boolean})],zt.prototype,"nowrap",2),zt=Po([pr("pb33f-render-operation-path")],zt);const ul=At`
    a, a:visited, a:active {
        text-decoration: none;
        color: var(--primary-color);
    }

    a:hover {
        color: var(--primary-color);
        text-decoration: underline;
    }

    header.pb33f-header {
        display: flex;
        height: 57px;
        flex-direction: row;
        z-index: 1;
        background-color: var(--background-color);
    }

    header.pb33f-header > .logo {
        width: 170px;
        min-width: 170px;
        padding: 9px 0 10px 10px;
        border-bottom: 1px dashed var(--secondary-color);
        height: 36px;
    }

    header.pb33f-header > .logo.wide {
        width: 300px;
    }

    header.pb33f-header > .logo.fluid {
        width: auto;
        min-width: 170px;
        white-space: nowrap;
    }

    header.pb33f-header > .logo .caret {
        font-size: 1.6em;
        color: var(--secondary-color)
    }

    header.pb33f-header > .logo .name {
        font-size: 1.7em;
        font-family: var(--font-stack-bold), sans-serif;
        color: var(--primary-color);
        text-shadow: 0 0 10px var(--primary-color-text-shadow), 0 0 10px var(--primary-color-text-shadow);
    }

    :host-context(html[theme="light"]) header.pb33f-header > .logo .name {
        text-shadow: none;
    }

    header.pb33f-header > .logo .name > sl-icon {
        vertical-align: middle;
    }


    header.pb33f-header > .logo .name > a {
        text-decoration: none;
    }

    header.pb33f-header > .logo .name > a:hover {
        text-decoration: underline;

    }

    header.pb33f-header > .logo .name > a:active {
        text-decoration: underline;
        color: var(--secondary-color);
        text-shadow: 0 0 5px var(--secondary-color-text-shadow), 0 0 10px var(--secondary-color-text-shadow-outer);
    }

    :host-context(html[theme="light"]) header.pb33f-header > .logo .name > a:active {
        text-shadow: none;
    }

    header.pb33f-header > .logo .name::after {
        content: "";
        -webkit-animation: cursor .8s infinite;
        animation: cursor .8s infinite;
        background: var(--primary-color);
        border-radius: 0;
        display: inline-block;
        height: 0.9em;
        margin-left: 0.2em;
        width: 3px;
        bottom: -2px;
        position: relative;
    }

    header .header-space {
        height: 55px;
        flex-grow: 2;
        border-bottom: 1px dashed var(--secondary-color);
    }

    @-webkit-keyframes cursor {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    @keyframes cursor {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }`;var ml=Object.defineProperty,fl=Object.getOwnPropertyDescriptor,Dt=(t,e,r,o)=>{for(var s=o>1?void 0:o?fl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&ml(e,r,s),s};let ot=class extends Fe{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1,this.fluid=!1}render(){const t=this.fluid?"fluid":this.wide?"wide":"";return Ze`
            <header class="pb33f-header">
                <div class="logo ${t}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};ot.styles=ul,Dt([ie()],ot.prototype,"name",2),Dt([ie()],ot.prototype,"url",2),Dt([ie({type:Boolean})],ot.prototype,"wide",2),Dt([ie({type:Boolean})],ot.prototype,"fluid",2),ot=Dt([pr("pb33f-header")],ot);const gl=At`

    :host {
        display: inline-flex;
        align-items: center;
        gap: 0;
    }

    sl-icon-button::part(base) {
        font-size: 1.4rem;
        color: var(--secondary-color);
    }

    sl-icon-button.tek-active::part(base) {
        color: #33ff33;
        text-shadow: 0 0 8px rgba(51, 255, 51, 0.6);
    }

`,vl=At`
    
    sl-tooltip::part(base){
        font-family: var(--font-stack), monospace;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }


    sl-tooltip::part(body){
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        background-color: var(--background-color);
        color: var(--font-color);
        border: 1px dashed var(--secondary-color);
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    sl-tooltip::part(base__arrow){
        background-color: var(--secondary-color);
    }
 `,bl="pb33f-theme-change";var yl=Object.defineProperty,wl=Object.getOwnPropertyDescriptor,Ao=(t,e,r,o)=>{for(var s=o>1?void 0:o?wl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&yl(e,r,s),s};const So="dark",$l="light",xl="tektronix",pi="pb33f-theme",hi="pb33f-base-theme";let Nt=class extends Fe{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?xl:this.baseTheme}connectedCallback(){super.connectedCallback();const t=localStorage.getItem(pi);if(t==="tektronix"){this.tektronixActive=!0;const e=localStorage.getItem(hi);this.baseTheme=e==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=t==="light"?"light":"dark";this.applyTheme()}applyTheme(){const t=this.activeTheme;localStorage.setItem(pi,t),localStorage.setItem(hi,this.baseTheme);const e=document.querySelector("html");e&&(e.setAttribute("theme",t),t===$l?e.classList.remove("sl-theme-dark"):e.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(bl,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===So?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const t=this.baseTheme===So?"sun":"moon",e=this.baseTheme===So?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",r=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return Ze`
            <sl-tooltip content="${e}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTheme}
                    name="${t}"
                    label="Toggle dark/light">
                </sl-icon-button>
            </sl-tooltip>
            <sl-tooltip content="${r}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTektronix}
                    name="display"
                    class="${this.tektronixActive?"tek-active":""}"
                    label="Toggle Tektronix">
                </sl-icon-button>
            </sl-tooltip>
        `}};Nt.styles=[gl,vl],Ao([Qs()],Nt.prototype,"baseTheme",2),Ao([Qs()],Nt.prototype,"tektronixActive",2),Nt=Ao([pr("pb33f-theme-switcher")],Nt);const _l=R`
    :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--background-color);
    }

    pb33f-header {
        position: sticky;
        top: 0;
        z-index: 10;
    }

    pb33f-theme-switcher {
        margin-left: auto;
    }

    .theme-controls {
        float: right;
        margin-top: 8px;
        margin-right: 8px;
    }

    sl-split-panel {
        flex: 1;
        --divider-width: 2px;
        --min: 200px;
        --max: 40%;
    }

    sl-split-panel::part(divider) {
        background-color: var(--secondary-color);
    }

    sl-icon.divider-vert {
        position: absolute;
        left: 2px;
        border-radius: 0;
        background: var(--secondary-color);
        color: var(--background-color);
        padding: 0;
        width: 10px;
        height: 40px;
    }

    sl-split-panel::part(divider):focus-visible {
        background-color: var(--primary-color);
    }

    sl-split-panel:focus-within sl-icon {
        background-color: var(--primary-color);
        color: var(--background-color);
    }

    .nav-panel,
    .content-panel {
        overflow-y: auto;
        height: calc(100vh - var(--pp-header-height, 57px));
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-lowalpha) var(--terminal-background);
    }

    .nav-panel::-webkit-scrollbar,
    .content-panel::-webkit-scrollbar {
        width: 8px;
    }

    .nav-panel::-webkit-scrollbar-track,
    .content-panel::-webkit-scrollbar-track {
        background-color: var(--terminal-background);
    }

    .nav-panel::-webkit-scrollbar-thumb,
    .content-panel::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background: var(--secondary-color-lowalpha);
    }

    .nav-panel {
        background: var(--background-color);
    }

    .content-panel {
    }
`,gr=R`
  :host {
    display: block;
    font-family: var(--font-stack, BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, monospace);
    color: var(--font-color, #e8e9ed);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

    
  a {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
    color: var(--primary-color);
  }
`;var kl=Object.defineProperty,Cl=Object.getOwnPropertyDescriptor,Eo=(t,e,r,o)=>{for(var s=o>1?void 0:o?Cl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&kl(e,r,s),s};const ui="pp-split-position",Pl=20;d.PpLayout=class extends F{constructor(){super(...arguments),this.title="",this.splitPos=Pl}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const e=sessionStorage.getItem(ui);e&&(this.splitPos=parseFloat(e))}onReposition(e){const r=e.target.position;typeof r=="number"&&(this.splitPos=r,sessionStorage.setItem(ui,String(r)))}render(){return p`
      <pb33f-header name=${this.title} url="index.html" fluid>
        <div class="theme-controls">
            <pb33f-theme-switcher></pb33f-theme-switcher>
        </div>
      </pb33f-header>
      <sl-split-panel position=${this.splitPos} @sl-reposition=${this.onReposition}>
        <sl-icon slot="divider" name="grip-vertical" class="divider-vert" aria-hidden="true"></sl-icon>
        <div slot="start" class="nav-panel">
          <slot name="nav"></slot>
        </div>
        <div slot="end" class="content-panel">
          <slot name="content"></slot>
        </div>
      </sl-split-panel>
    `}},d.PpLayout.styles=[_l,gr],Eo([T()],d.PpLayout.prototype,"title",2),Eo([T()],d.PpLayout.prototype,"splitPos",2),d.PpLayout=Eo([H("pp-layout")],d.PpLayout);const Al=R`
  :host {
    display: block;
    padding: 0.75rem 0.5rem;
    font-family: var(--font-stack, BerkeleyMono-Regular, monospace);
  }

  .nav-home {
    display: block;
    padding: 0.5rem 0.75rem;
    font-family: var(--font-stack-bold, monospace);
    border-radius: 0;
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .nav-home:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    text-decoration: none;
  }

  .nav-section {
    margin-bottom: 0.75rem;
  }

  h4 {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
    margin: 0 0 0.4rem 0.75rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }

  .nav-models-section {
    margin-top: 0.75rem;
  }

  .nav-models-link {
    display: block;
    padding: 0.3rem 0.75rem;
    color: var(--font-color-sub1, #a7a7a7);
    text-decoration: none;
  }
  .nav-models-link:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
`;var Sl=Object.defineProperty,El=Object.getOwnPropertyDescriptor,vr=(t,e,r,o)=>{for(var s=o>1?void 0:o?El(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Sl(e,r,s),s};d.PpNav=class extends F{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const e=this.getAttribute("data-nav");if(e)try{this.tags=JSON.parse(e)||[]}catch{}const r=this.getAttribute("data-models");if(r)try{this.modelGroups=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return p`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?p`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(e=>p`<pp-nav-tag .tag=${e} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:b}
      ${this.modelGroups.length?p`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(e=>p`<pp-nav-model-group .group=${e} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:b}
    `}},d.PpNav.styles=Al,vr([T()],d.PpNav.prototype,"tags",2),vr([T()],d.PpNav.prototype,"modelGroups",2),vr([T()],d.PpNav.prototype,"activeSlug",2),d.PpNav=vr([H("pp-nav")],d.PpNav);const Ol=R`
    :host {
        display: block;
        margin: 0 0 var(--global-padding) 0; 
    }

    .tag-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: var(--global-padding) 0 var(--global-padding) 0;
        font-family: var(--font-stack), monospace;
        color: var(--font-color);

    }

    .tag-header sl-icon {
        margin-right: var(--global-padding);
        padding-left: var(--global-padding);
    }

    .tag-header:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
    }

    .tag-header.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }
    
    .tag-body {
        padding: var(--global-padding) 0 var(--global-padding) 0;
    }
    
    .chevron {
        color: var(--secondary-color);
        padding-left: var(--global-padding);
    }

    .tag-header:hover .chevron,
    .tag-header.active .chevron {
        color: var(--primary-color);
    }

    .tag-description {
        padding: var(--global-padding) var(--global-padding) var(--global-padding) 22px;
        font-size: var(--smaller-font);
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
    }


    ul {
        list-style: none;
        margin: 0 0 0 15px;
        padding: var(--global-padding) 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-top: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    li a {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        padding: 0.2rem 0.4rem;
        border-radius: 0;
        color: var(--font-color);
        text-decoration: none;
        border-left: 2px solid var(--background-color);
    }

    li a:hover {
        background: var(--primary-color-verylowalpha);
        text-decoration: none;
        border-left: 2px solid var(--secondary-color);
    }

    li a.active {
        background: var(--primary-color-verylowalpha);
        border-left: 2px solid var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
    }
    
    .op-title {
        flex: 1;
        min-width: 0;
        max-width: var(--nav-op-max-width);
        font-family: var(--font-stack), monospace;
        font-size: var(--smaller-font);
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
    }

    li a.active .op-title {
        font-family: var(--font-stack-bold), monospace;
    }
    
    .children {
        margin-left: 15px;
        margin-bottom: var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
    }

    .deprecated {
        text-decoration: line-through;
        opacity: 0.5;
    }
`;var Tl=Object.defineProperty,Rl=Object.getOwnPropertyDescriptor,br=(t,e,r,o)=>{for(var s=o>1?void 0:o?Rl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Tl(e,r,s),s};function Oo(t,e){var r,o;return e?!!((r=t.operations)!=null&&r.some(s=>s.slug===e)||(o=t.children)!=null&&o.some(s=>Oo(s,e))):!1}d.PpNavTag=class extends F{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("tag")||e.has("activeSlug"))&&Oo(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var i,n;const{tag:e,activeSlug:r,open:o}=this,s=Oo(e,r);return p`
            <div class="tag-header ${s?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${e.summary||e.name}</span>
            </div>
            ${o?p`
                        <div class="tag-body">
                            ${(i=e.operations)!=null&&i.length?p`
                                        <ul>
                                            ${e.operations.map(a=>p`
                                                        <li>
                                                            <a href="operations/${a.slug}.html" class="${a.deprecated?"deprecated":""} ${a.slug===r?"active":""}">
                                                                <span class="op-title">${a.summary||a.path}</span>
                                                                <pb33f-http-method mode="nav-naked"
                                                                        method=${a.method}></pb33f-http-method>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:b}
                            ${(n=e.children)!=null&&n.length?p`
                                        <div class="children">
                                            ${e.children.map(a=>p`
                                                        <pp-nav-tag .tag=${a}
                                                                    .activeSlug=${r}></pp-nav-tag>`)}
                                        </div>
                                    `:b}
                        </div>
                    `:b}
        `}},d.PpNavTag.styles=Ol,br([h({type:Object})],d.PpNavTag.prototype,"tag",2),br([h()],d.PpNavTag.prototype,"activeSlug",2),br([T()],d.PpNavTag.prototype,"open",2),d.PpNavTag=br([H("pp-nav-tag")],d.PpNavTag);const Ll=R`
    :host {
        display: block;
        margin: 0 0 var(--global-padding) 0;
    }

    .group-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: var(--global-padding) 0 var(--global-padding) 0;
        font-family: var(--font-stack), monospace;
        color: var(--font-color);
    }

    .group-header sl-icon {
        margin-right: var(--global-padding);
        padding-left: var(--global-padding);
    }

    .group-header:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
    }

    .group-header.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }

    .chevron {
        color: var(--secondary-color);
        padding-left: var(--global-padding);
    }

    .group-header:hover .chevron,
    .group-header.active .chevron {
        color: var(--primary-color);
    }

    .group-body {
        padding: var(--global-padding) 0 var(--global-padding) 0;
    }

    ul {
        list-style: none;
        margin: 0 0 0 15px;
        padding: var(--global-padding) 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-top: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    li a {
        display: flex;
        min-height: 22px;
        align-items: center;
        gap: 0.4rem;
        padding: 0.2rem 0.4rem;
        border-radius: 0;
        color: var(--font-color);
        text-decoration: none;
        border-left: 2px solid var(--background-color);
    }

    li a:hover {
        background: var(--primary-color-verylowalpha);
        text-decoration: none;
        border-left: 2px solid var(--secondary-color);
    }

    li a.active {
        background: var(--primary-color-verylowalpha);
        border-left: 2px solid var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
    }

    .model-name {
        font-family: var(--font-stack), monospace;
        font-size: var(--smaller-font);
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
    }

    li a.active .model-name {
        font-family: var(--font-stack-bold), monospace;
    }
`;var Ml=Object.defineProperty,zl=Object.getOwnPropertyDescriptor,yr=(t,e,r,o)=>{for(var s=o>1?void 0:o?zl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Ml(e,r,s),s};function mi(t,e){var r;return e?((r=t.models)==null?void 0:r.some(o=>o.typeSlug+"/"+o.slug===e))??!1:!1}d.PpNavModelGroup=class extends F{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("group")||e.has("activeSlug"))&&mi(this.group,this.activeSlug)&&(this.open=!0)}updated(e){(e.has("activeSlug")||e.has("group"))&&this.open&&this.activeSlug&&requestAnimationFrame(()=>{const r=this.renderRoot.querySelector("a.active");r==null||r.scrollIntoView({block:"center",behavior:"smooth"})})}toggle(){this.open=!this.open}render(){var i;const{group:e,activeSlug:r,open:o}=this,s=mi(e,r);return p`
            <div class="group-header ${s?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${e.name}</span>
            </div>
            ${o&&((i=e.models)!=null&&i.length)?p`
                    <div class="group-body">
                        <ul>
                            ${e.models.map(n=>{const a=n.typeSlug+"/"+n.slug;return p`
                                        <li>
                                            <a href="models/${n.typeSlug}/${n.slug}.html"
                                               class="${a===r?"active":""}">
                                                <span class="model-name">${n.name}</span>
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:b}
        `}},d.PpNavModelGroup.styles=Ll,yr([h({type:Object})],d.PpNavModelGroup.prototype,"group",2),yr([h()],d.PpNavModelGroup.prototype,"activeSlug",2),yr([T()],d.PpNavModelGroup.prototype,"open",2),d.PpNavModelGroup=yr([H("pp-nav-model-group")],d.PpNavModelGroup);const Dl=R`
  :host {
    display: block;
  }
  a {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0;
    color: var(--font-color, #e8e9ed);
    text-decoration: none;
  }
  a:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
  }
  .path {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--font-stack, monospace);
  }
  .deprecated {
    text-decoration: line-through;
    opacity: 0.5;
  }
`;var Nl=Object.defineProperty,Fl=Object.getOwnPropertyDescriptor,Ft=(t,e,r,o)=>{for(var s=o>1?void 0:o?Fl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Nl(e,r,s),s};d.PpNavOperation=class extends F{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return p`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},d.PpNavOperation.styles=Dl,Ft([h()],d.PpNavOperation.prototype,"method",2),Ft([h()],d.PpNavOperation.prototype,"path",2),Ft([h()],d.PpNavOperation.prototype,"slug",2),Ft([h({type:Boolean})],d.PpNavOperation.prototype,"deprecated",2),d.PpNavOperation=Ft([H("pp-nav-operation")],d.PpNavOperation);const wr=R`
    .constraints {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.1rem 0.75rem;
        margin-top: 0.3rem;
        font-size: 0.85em;
        font-family: var(--font-stack);
    }

    .constraint-label {
        color: var(--font-color-sub2);
        text-align: right;
    }

    .constraint-value {
        color: var(--font-color-sub1);
    }

    .constraint-value code {
        color: var(--warn-400);
    }

    .enum-value {
        color: var(--warn-400);
        font-family: var(--font-stack);
    }
`,fi=R`
    a.ref-link,
    a.ref-link:hover {
        color: var(--terminal-text);
        font-family: var(--font-stack), monospace;
    }

    a.ref-link {
        text-decoration: none;
    }

    a.ref-link:hover {
        text-decoration: underline;
    }
`,Il=R`
    :host {
        display: block;
        margin-top: 0
    }

    .parameter {
        display: grid;
        grid-template-columns: 200px 200px 150px 1fr;
        gap: 0 20px;
        padding: var(--global-padding) var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }

    .param-name-col {
        text-align: right;
        white-space: nowrap;
    }

    .param-type-col {
        white-space: nowrap;
    }

    .param-desc-col {
        color: var(--font-color-sub1);
    }

    .param-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .param-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        white-space: nowrap;
    }

    a.ref-link.param-name {
        font-family: var(--font-stack-bold), monospace;
    }

    .param-in-col {
        white-space: nowrap;
        display: flex;
        gap: 0.3rem;
    }

    .param-in-icon {
        color: var(--primary-color);
    }

    .param-in {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .required-badge {
        color: var(--error-color);
        border: 1px solid var(--error-color-dimmed);
        background-color: var(--error-color-verylowalpha);
        padding: 2px var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .deprecated-badge {
        color: var(--warn-400);
        font-family: var(--font-stack-bold);
        margin-left: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.8em;
    }

    .param-extras {
        grid-column: 1 / -1;
        padding-top: 0.25rem;
    }
`,Bl={schemas:"schemas",responses:"responses",parameters:"parameters",requestBodies:"request-bodies",headers:"headers",securitySchemes:"security",examples:"examples",links:"links",callbacks:"callbacks",pathItems:"path-items"};function jl(t){let e=t.replace(/([a-z0-9])([A-Z])/g,"$1-$2");return e=e.toLowerCase(),e=e.replace(/[/]/g,"-").replace(/[{}_.]/g,"-").replace(/ /g,"-"),e=e.replace(/[^a-z0-9-]/g,""),e=e.replace(/-{2,}/g,"-"),e=e.replace(/^-|-$/g,""),e||"unnamed"}function $r(t){if(!t||!t.startsWith("#/components/"))return null;const e=t.replace("#/components/","").split("/");if(e.length!==2)return null;const[r,o]=e,s=Bl[r];return s?{name:o,href:`models/${s}/${jl(o)}.html`}:null}function To(t,e){if(!t)return[];const r=[];return e!=null&&e.includeExample&&(t.example!==void 0&&r.push({label:"example",value:JSON.stringify(t.example)}),t.default!==void 0&&r.push({label:"default",value:JSON.stringify(t.default)})),t.minimum!==void 0&&r.push({label:"min",value:t.minimum}),t.maximum!==void 0&&r.push({label:"max",value:t.maximum}),t.exclusiveMinimum!==void 0&&r.push({label:"exclusiveMin",value:t.exclusiveMinimum}),t.exclusiveMaximum!==void 0&&r.push({label:"exclusiveMax",value:t.exclusiveMaximum}),t.minLength!==void 0&&r.push({label:"minLength",value:t.minLength}),t.maxLength!==void 0&&r.push({label:"maxLength",value:t.maxLength}),t.minItems!==void 0&&r.push({label:"minItems",value:t.minItems}),t.maxItems!==void 0&&r.push({label:"maxItems",value:t.maxItems}),t.uniqueItems&&r.push({label:"uniqueItems",value:"true"}),t.pattern&&r.push({label:"pattern",value:t.pattern,isCode:!0}),t.multipleOf!==void 0&&r.push({label:"multipleOf",value:t.multipleOf}),r}function xr(t){var e;if(!t)return"";if(t.type==="array"&&t.items)return`Array<${t.items.type||((e=t.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`;if(t.type){let r=Array.isArray(t.type)?t.type.join(" | "):t.type;return t.format&&(r+=` (${t.format})`),r}return t.oneOf?"oneOf":t.anyOf?"anyOf":t.allOf?"allOf":t.$ref?t.$ref.split("/").pop()??"":""}const Hl=R`
    :host {
        display: inline;
        position: relative;
    }

    .trigger {
        display: inline;
    }

    sl-popup {
        z-index: 10000;
    }

    sl-popup::part(popup) {
        z-index: 10000;
    }

    .pp-ref-popover-content {
        max-width: 500px;
        max-height: 400px;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--background-color);
        border: 1px dashed var(--secondary-color);
        padding: 0.75rem;
        text-align: left;
    }

    .popover-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .type-badge {
        color: var(--secondary-color);
        background: var(--secondary-color-very-lowalpha);
        border: 1px solid var(--secondary-color-dimmer);
        padding: 0.1em 0.4em;
        text-transform: uppercase;
        font-family: var(--font-stack-bold);
        letter-spacing: 0.05em;
        font-size: 0.75em;
    }

    .component-name {
        font-family: var(--font-stack-bold);
        color: var(--font-color);
    }

    .popover-body {
        border-top: 1px dotted var(--hrcolor);
        padding-top: 0.5rem;
    }

    .popover-example {
        border-top: 1px dotted var(--hrcolor);
        margin-top: 0.5rem;
        padding-top: 0.5rem;
    }

    .example-label {
        font-family: var(--font-stack);
        color: var(--font-color-sub2);
        text-transform: uppercase;
        font-size: 0.8em;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
        text-align: left;
    }
`,gi=new Map;let vi=!1;function Ul(){if(vi)return;vi=!0;const t=document.getElementById("pp-schema-registry");if(t!=null&&t.textContent)try{const e=JSON.parse(t.textContent);for(const[r,o]of Object.entries(e))gi.set(r,o)}catch{}}function bi(t){return Ul(),gi.get(t)}function Vl(t){if(!(t!=null&&t.startsWith("#/components/")))return;const e=t.replace("#/components/","");return bi(e)}const Jl=R`
    :host {
        display: block;
    }

    .property {
        display: grid;
        grid-template-columns: 200px 200px 1fr;
        gap: 0 1rem;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    .prop-name-col {
        text-align: right;
        white-space: nowrap;
    }

    .prop-type-col {
        white-space: nowrap;
    }

    .prop-desc-col {
        color: var(--font-color-sub1);
    }

    .prop-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .prop-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        white-space: nowrap;
    }

    .prop-type-link {
        border: 1px dotted var(--background-color);
    }

    .required-badge {
        color: var(--error-color);
        border: 1px solid var(--error-color-dimmed);
        background-color: var(--error-color-verylowalpha);
        padding: 0 var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    a.ref-type-link,
    a.ref-type-link:visited,
    a.ref-type-link:active {
        color: var(--terminal-text);
        text-decoration: none;
        font-family: var(--font-stack);
    }

    a.ref-type-link:hover {
        text-decoration: underline;
    }

    :host([compact]) .property {
        grid-template-columns: 1fr 1fr;
        padding: 8px 0.5rem;
    }

    :host([compact]) .prop-desc-col {
        display: none;
    }

    .property.scalar {
        grid-template-columns: auto 1fr;
    }

    :host([compact]) .property.scalar {
        grid-template-columns: 1fr;
    }

    :host([compact]) .property.scalar .prop-type-col {
        white-space: normal;
    }

    :host([compact]) .property.scalar .prop-desc-col {
        display: block;
    }

    .property.scalar .constraints {
        grid-template-columns: auto auto;
        justify-content: start;
    }

    .property.scalar .constraint-label {
        text-align: left;
    }
`;var ql=Object.defineProperty,Wl=Object.getOwnPropertyDescriptor,_r=(t,e,r,o)=>{for(var s=o>1?void 0:o?Wl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&ql(e,r,s),s};d.PpSchemaProperties=class extends F{constructor(){super(...arguments),this.schemaJson="",this.compact=!1,this.schema=null}willUpdate(e){if(e.has("schemaJson")&&this.schemaJson)try{this.schema=JSON.parse(this.schemaJson)}catch{this.schema=null}}renderConstraints(e){var o,s;const r=To(e);return!r.length&&!((o=e.enum)!=null&&o.length)?b:p`
            <div class="constraints">
                ${r.map(i=>p`
                    <span class="constraint-label">${i.label}:</span>
                    <span class="constraint-value">${i.isCode?p`<code>${i.value}</code>`:i.value}</span>
                `)}
                ${(s=e.enum)!=null&&s.length?p`
                    <span class="constraint-label">enum:</span>
                    <span class="constraint-value">${e.enum.map((i,n)=>p`${n>0?", ":""}<span
                            class="enum-value">${JSON.stringify(i)}</span>`)}</span>
                `:b}
            </div>
        `}renderRefAnchor(e,r){const o=p`<a class="ref-type-link" href="${r.href}">\u279c ${r.name}</a>`;return this.compact?o:p`
            <pp-ref-popover schema-ref="${e}">${o}</pp-ref-popover>`}renderType(e){var o;if(!e)return b;if(e.type==="array"&&((o=e.items)!=null&&o.$ref)){const s=$r(e.items.$ref);if(s)return p`<span
                        class="prop-type prop-type-link">Array&lt;${this.renderRefAnchor(e.items.$ref,s)}&gt;</span>`}if(e.$ref){const s=$r(e.$ref);if(s)return p`<span class="prop-type prop-type-link">${this.renderRefAnchor(e.$ref,s)}</span>`}const r=xr(e);return r?p`<span class="prop-type">${r}</span>`:b}render(){var i;if(!this.schema)return b;const e=this.schema.type==="array"&&((i=this.schema.items)!=null&&i.properties)?this.schema.items:this.schema,r=e.properties||{},o=new Set(e.required||[]),s=Object.entries(r);if(!s.length){const n=xr(e);return!n&&!e.description?b:p`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${n?p`<span class="prop-type">${n}</span>`:b}
                        ${this.renderConstraints(e)}
                    </div>
                    <div class="prop-desc-col">
                        ${e.description?e.description:b}
                    </div>
                </div>
            `}return s.map(([n,a])=>p`
                <div class="property">
                    <div class="prop-name-col">
                        ${o.has(n)?p`<span class="required-badge">req</span>`:b}
                        <span class="prop-name">${n}</span>
                    </div>
                    <div class="prop-type-col">
                        ${this.renderType(a)}
                        ${this.renderConstraints(a)}
                    </div>
                    <div class="prop-desc-col">
                        ${a.description?a.description:b}
                    </div>
                </div>
            `)}},d.PpSchemaProperties.styles=[wr,Jl],_r([h({attribute:"schema-json"})],d.PpSchemaProperties.prototype,"schemaJson",2),_r([h({type:Boolean,reflect:!0})],d.PpSchemaProperties.prototype,"compact",2),_r([T()],d.PpSchemaProperties.prototype,"schema",2),d.PpSchemaProperties=_r([H("pp-schema-properties")],d.PpSchemaProperties);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Ro=class extends Yr{constructor(e){if(super(e),this.it=b,e.type!==Kr.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===b||e==null)return this._t=void 0,this.it=e;if(e===Oe)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}};Ro.directiveName="unsafeHTML",Ro.resultType=1;const Lo=Gr(Ro);var yi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Kl(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Mo={exports:{}},wi;function Gl(){return wi||(wi=1,(function(t){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var r=(function(o){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,i=0,n={},a={manual:o.Prism&&o.Prism.manual,disableWorkerMessageHandler:o.Prism&&o.Prism.disableWorkerMessageHandler,util:{encode:function g(f){return f instanceof l?new l(f.type,g(f.content),f.alias):Array.isArray(f)?f.map(g):f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(g){return Object.prototype.toString.call(g).slice(8,-1)},objId:function(g){return g.__id||Object.defineProperty(g,"__id",{value:++i}),g.__id},clone:function g(f,y){y=y||{};var x,$;switch(a.util.type(f)){case"Object":if($=a.util.objId(f),y[$])return y[$];x={},y[$]=x;for(var C in f)f.hasOwnProperty(C)&&(x[C]=g(f[C],y));return x;case"Array":return $=a.util.objId(f),y[$]?y[$]:(x=[],y[$]=x,f.forEach(function(O,P){x[P]=g(O,y)}),x);default:return f}},getLanguage:function(g){for(;g;){var f=s.exec(g.className);if(f)return f[1].toLowerCase();g=g.parentElement}return"none"},setLanguage:function(g,f){g.className=g.className.replace(RegExp(s,"gi"),""),g.classList.add("language-"+f)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(x){var g=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(x.stack)||[])[1];if(g){var f=document.getElementsByTagName("script");for(var y in f)if(f[y].src==g)return f[y]}return null}},isActive:function(g,f,y){for(var x="no-"+f;g;){var $=g.classList;if($.contains(f))return!0;if($.contains(x))return!1;g=g.parentElement}return!!y}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(g,f){var y=a.util.clone(a.languages[g]);for(var x in f)y[x]=f[x];return y},insertBefore:function(g,f,y,x){x=x||a.languages;var $=x[g],C={};for(var O in $)if($.hasOwnProperty(O)){if(O==f)for(var P in y)y.hasOwnProperty(P)&&(C[P]=y[P]);y.hasOwnProperty(O)||(C[O]=$[O])}var L=x[g];return x[g]=C,a.languages.DFS(a.languages,function(N,U){U===L&&N!=g&&(this[N]=C)}),C},DFS:function g(f,y,x,$){$=$||{};var C=a.util.objId;for(var O in f)if(f.hasOwnProperty(O)){y.call(f,O,f[O],x||O);var P=f[O],L=a.util.type(P);L==="Object"&&!$[C(P)]?($[C(P)]=!0,g(P,y,null,$)):L==="Array"&&!$[C(P)]&&($[C(P)]=!0,g(P,y,O,$))}}},plugins:{},highlightAll:function(g,f){a.highlightAllUnder(document,g,f)},highlightAllUnder:function(g,f,y){var x={callback:y,container:g,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",x),x.elements=Array.prototype.slice.apply(x.container.querySelectorAll(x.selector)),a.hooks.run("before-all-elements-highlight",x);for(var $=0,C;C=x.elements[$++];)a.highlightElement(C,f===!0,x.callback)},highlightElement:function(g,f,y){var x=a.util.getLanguage(g),$=a.languages[x];a.util.setLanguage(g,x);var C=g.parentElement;C&&C.nodeName.toLowerCase()==="pre"&&a.util.setLanguage(C,x);var O=g.textContent,P={element:g,language:x,grammar:$,code:O};function L(U){P.highlightedCode=U,a.hooks.run("before-insert",P),P.element.innerHTML=P.highlightedCode,a.hooks.run("after-highlight",P),a.hooks.run("complete",P),y&&y.call(P.element)}if(a.hooks.run("before-sanity-check",P),C=P.element.parentElement,C&&C.nodeName.toLowerCase()==="pre"&&!C.hasAttribute("tabindex")&&C.setAttribute("tabindex","0"),!P.code){a.hooks.run("complete",P),y&&y.call(P.element);return}if(a.hooks.run("before-highlight",P),!P.grammar){L(a.util.encode(P.code));return}if(f&&o.Worker){var N=new Worker(a.filename);N.onmessage=function(U){L(U.data)},N.postMessage(JSON.stringify({language:P.language,code:P.code,immediateClose:!0}))}else L(a.highlight(P.code,P.grammar,P.language))},highlight:function(g,f,y){var x={code:g,grammar:f,language:y};if(a.hooks.run("before-tokenize",x),!x.grammar)throw new Error('The language "'+x.language+'" has no grammar.');return x.tokens=a.tokenize(x.code,x.grammar),a.hooks.run("after-tokenize",x),l.stringify(a.util.encode(x.tokens),x.language)},tokenize:function(g,f){var y=f.rest;if(y){for(var x in y)f[x]=y[x];delete f.rest}var $=new v;return _($,$.head,g),m(g,$,f,$.head,0),k($)},hooks:{all:{},add:function(g,f){var y=a.hooks.all;y[g]=y[g]||[],y[g].push(f)},run:function(g,f){var y=a.hooks.all[g];if(!(!y||!y.length))for(var x=0,$;$=y[x++];)$(f)}},Token:l};o.Prism=a;function l(g,f,y,x){this.type=g,this.content=f,this.alias=y,this.length=(x||"").length|0}l.stringify=function g(f,y){if(typeof f=="string")return f;if(Array.isArray(f)){var x="";return f.forEach(function(L){x+=g(L,y)}),x}var $={type:f.type,content:g(f.content,y),tag:"span",classes:["token",f.type],attributes:{},language:y},C=f.alias;C&&(Array.isArray(C)?Array.prototype.push.apply($.classes,C):$.classes.push(C)),a.hooks.run("wrap",$);var O="";for(var P in $.attributes)O+=" "+P+'="'+($.attributes[P]||"").replace(/"/g,"&quot;")+'"';return"<"+$.tag+' class="'+$.classes.join(" ")+'"'+O+">"+$.content+"</"+$.tag+">"};function c(g,f,y,x){g.lastIndex=f;var $=g.exec(y);if($&&x&&$[1]){var C=$[1].length;$.index+=C,$[0]=$[0].slice(C)}return $}function m(g,f,y,x,$,C){for(var O in y)if(!(!y.hasOwnProperty(O)||!y[O])){var P=y[O];P=Array.isArray(P)?P:[P];for(var L=0;L<P.length;++L){if(C&&C.cause==O+","+L)return;var N=P[L],U=N.inside,me=!!N.lookbehind,J=!!N.greedy,Ae=N.alias;if(J&&!N.pattern.global){var fe=N.pattern.toString().match(/[imsuy]*$/)[0];N.pattern=RegExp(N.pattern.source,fe+"g")}for(var Z=N.pattern||N,D=x.next,V=$;D!==f.tail&&!(C&&V>=C.reach);V+=D.value.length,D=D.next){var Be=D.value;if(f.length>g.length)return;if(!(Be instanceof l)){var Sr=1,ge;if(J){if(ge=c(Z,V,g,me),!ge||ge.index>=g.length)break;var Er=ge.index,Zc=ge.index+ge[0].length,je=V;for(je+=D.value.length;Er>=je;)D=D.next,je+=D.value.length;if(je-=D.value.length,V=je,D.value instanceof l)continue;for(var Vt=D;Vt!==f.tail&&(je<Zc||typeof Vt.value=="string");Vt=Vt.next)Sr++,je+=Vt.value.length;Sr--,Be=g.slice(V,je),ge.index-=V}else if(ge=c(Z,0,Be,me),!ge)continue;var Er=ge.index,Or=ge[0],Uo=Be.slice(0,Er),Ci=Be.slice(Er+Or.length),Vo=V+Be.length;C&&Vo>C.reach&&(C.reach=Vo);var Tr=D.prev;Uo&&(Tr=_(f,Tr,Uo),V+=Uo.length),w(f,Tr,Sr);var Qc=new l(O,U?a.tokenize(Or,U):Or,Ae,Or);if(D=_(f,Tr,Qc),Ci&&_(f,D,Ci),Sr>1){var Jo={cause:O+","+L,reach:Vo};m(g,f,y,D.prev,V,Jo),C&&Jo.reach>C.reach&&(C.reach=Jo.reach)}}}}}}function v(){var g={value:null,prev:null,next:null},f={value:null,prev:g,next:null};g.next=f,this.head=g,this.tail=f,this.length=0}function _(g,f,y){var x=f.next,$={value:y,prev:f,next:x};return f.next=$,x.prev=$,g.length++,$}function w(g,f,y){for(var x=f.next,$=0;$<y&&x!==g.tail;$++)x=x.next;f.next=x,x.prev=f,g.length-=$}function k(g){for(var f=[],y=g.head.next;y!==g.tail;)f.push(y.value),y=y.next;return f}if(!o.document)return o.addEventListener&&(a.disableWorkerMessageHandler||o.addEventListener("message",function(g){var f=JSON.parse(g.data),y=f.language,x=f.code,$=f.immediateClose;o.postMessage(a.highlight(x,a.languages[y],y)),$&&o.close()},!1)),a;var A=a.util.currentScript();A&&(a.filename=A.src,A.hasAttribute("data-manual")&&(a.manual=!0));function S(){a.manual||a.highlightAll()}if(!a.manual){var E=document.readyState;E==="loading"||E==="interactive"&&A&&A.defer?document.addEventListener("DOMContentLoaded",S):window.requestAnimationFrame?window.requestAnimationFrame(S):window.setTimeout(S,16)}return a})(e);t.exports&&(t.exports=r),typeof yi<"u"&&(yi.Prism=r),r.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},r.languages.markup.tag.inside["attr-value"].inside.entity=r.languages.markup.entity,r.languages.markup.doctype.inside["internal-subset"].inside=r.languages.markup,r.hooks.add("wrap",function(o){o.type==="entity"&&(o.attributes.title=o.content.replace(/&amp;/,"&"))}),Object.defineProperty(r.languages.markup.tag,"addInlined",{value:function(s,i){var n={};n["language-"+i]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:r.languages[i]},n.cdata=/^<!\[CDATA\[|\]\]>$/i;var a={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:n}};a["language-"+i]={pattern:/[\s\S]+/,inside:r.languages[i]};var l={};l[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:a},r.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(r.languages.markup.tag,"addAttribute",{value:function(o,s){r.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+o+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:r.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),r.languages.html=r.languages.markup,r.languages.mathml=r.languages.markup,r.languages.svg=r.languages.markup,r.languages.xml=r.languages.extend("markup",{}),r.languages.ssml=r.languages.xml,r.languages.atom=r.languages.xml,r.languages.rss=r.languages.xml,(function(o){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;o.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},o.languages.css.atrule.inside.rest=o.languages.css;var i=o.languages.markup;i&&(i.tag.addInlined("style","css"),i.tag.addAttribute("style","css"))})(r),r.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},r.languages.javascript=r.languages.extend("clike",{"class-name":[r.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),r.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,r.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:r.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:r.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:r.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:r.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:r.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),r.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:r.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),r.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),r.languages.markup&&(r.languages.markup.tag.addInlined("script","javascript"),r.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),r.languages.js=r.languages.javascript,(function(){if(typeof r>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var o="Loading…",s=function(A,S){return"✖ Error "+A+" while fetching file: "+S},i="✖ Error: File does not exist or is empty",n={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},a="data-src-status",l="loading",c="loaded",m="failed",v="pre[data-src]:not(["+a+'="'+c+'"]):not(['+a+'="'+l+'"])';function _(A,S,E){var g=new XMLHttpRequest;g.open("GET",A,!0),g.onreadystatechange=function(){g.readyState==4&&(g.status<400&&g.responseText?S(g.responseText):g.status>=400?E(s(g.status,g.statusText)):E(i))},g.send(null)}function w(A){var S=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(A||"");if(S){var E=Number(S[1]),g=S[2],f=S[3];return g?f?[E,Number(f)]:[E,void 0]:[E,E]}}r.hooks.add("before-highlightall",function(A){A.selector+=", "+v}),r.hooks.add("before-sanity-check",function(A){var S=A.element;if(S.matches(v)){A.code="",S.setAttribute(a,l);var E=S.appendChild(document.createElement("CODE"));E.textContent=o;var g=S.getAttribute("data-src"),f=A.language;if(f==="none"){var y=(/\.(\w+)$/.exec(g)||[,"none"])[1];f=n[y]||y}r.util.setLanguage(E,f),r.util.setLanguage(S,f);var x=r.plugins.autoloader;x&&x.loadLanguages(f),_(g,function($){S.setAttribute(a,c);var C=w(S.getAttribute("data-range"));if(C){var O=$.split(/\r\n?|\n/g),P=C[0],L=C[1]==null?O.length:C[1];P<0&&(P+=O.length),P=Math.max(0,Math.min(P-1,O.length)),L<0&&(L+=O.length),L=Math.max(0,Math.min(L,O.length)),$=O.slice(P,L).join(`
`),S.hasAttribute("data-start")||S.setAttribute("data-start",String(P+1))}E.textContent=$,r.highlightElement(E)},function($){S.setAttribute(a,m),E.textContent=$})}}),r.plugins.fileHighlight={highlight:function(S){for(var E=(S||document).querySelectorAll(v),g=0,f;f=E[g++];)r.highlightElement(f)}};var k=!1;r.fileHighlight=function(){k||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),k=!0),r.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Mo)),Mo.exports}var Yl=Gl();const gt=Kl(Yl);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json,(function(t){var e=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,o="(?:"+r.source+"(?:[ 	]+"+e.source+")?|"+e.source+"(?:[ 	]+"+r.source+")?)",s=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),i=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function n(a,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<value>>/g,function(){return a});return RegExp(c,l)}t.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return o})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<key>>/g,function(){return"(?:"+s+"|"+i+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:n(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:n(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:n(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:n(i),lookbehind:!0,greedy:!0},number:{pattern:n(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:e,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},t.languages.yml=t.languages.yaml})(Prism);const Xl=R`
    :host {
        display: block;
    }

    /* ── Plain mode (no line numbers) ── */

    pre {
        margin: 0;
        padding: var(--global-padding-double);
        overflow-x: auto;
        border-left: 5px solid var(--secondary-color);
        border-top: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
        background-color: var(--background-color);
        background-image: linear-gradient(to right, var(--chroma-gradient-start), var(--background-color));
        color: var(--font-color);
        font-family: var(--font-stack), monospace;
        line-height: 1.5;
        width: 100%;
        box-sizing: border-box;
    }

    code {
        background: none;
        padding: 0;
        border: none;
        color: inherit;
    }

    /* YAML: unquoted values are plain text — use secondary color */

    pre.language-yaml,
    .lined-code pre.language-yaml {
        color: var(--secondary-color, #c9a0dc);
    }

    /* ── Lined code container ── */

    .lined-code {
        width: 100%;
        overflow-x: auto;
        background: var(--terminal-background, #0a0a0a);
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-lowalpha) var(--terminal-background);
    }

    .lined-code pre {
        margin: 0;
        padding: 0;
        overflow-x: visible;
        background: var(--terminal-background, #0a0a0a);
        color: var(--font-color, #e8e9ed);
        font-family: var(--font-stack, monospace);
        font-size: 0.8rem;
        line-height: 1.5;
        width: max-content;
        min-width: 100%;
        box-sizing: border-box;
    }

    .lined-code code {
        display: block;
    }

    /* ── Individual line ── */

    .line {
        display: flex;
        min-height: 1.5em;
    }

    .line.highlighted {
        background: rgba(98, 196, 255, 0.08);
    }

    .line.highlighted .line-number {
        color: var(--primary-color, rgba(98, 196, 255, 1.0));
        border-right-color: rgba(98, 196, 255, 0.4);
        background: rgba(98, 196, 255, 0.08);
    }

    /* ── Gutter (sticky line numbers) ── */

    .line-number {
        display: inline-block;
        width: calc(var(--gutter-digits, 3) * 1ch + 1.5rem);
        min-width: calc(var(--gutter-digits, 3) * 1ch + 1.5rem);
        padding: 0 0.75rem;
        text-align: right;
        color: var(--font-color-sub2, #555);
        border-right: 1px solid var(--hrcolor, #3d3d3d);
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer;
        flex-shrink: 0;
        box-sizing: border-box;
        position: sticky;
        left: 0;
        z-index: 1;
        background: var(--terminal-background, #0a0a0a);
        transition: color 0.1s, border-right-color 0.1s;
    }

    .line-number:hover {
        color: var(--font-color-sub1, #a7a7a7);
    }

    /* Pre-defined highlights: disable interactive gutter */

    .lined-code.locked .line-number {
        cursor: default;
    }

    .lined-code.locked .line-number:hover {
        color: var(--font-color-sub2, #555);
    }

    /* ── Line content ── */

    .line-content {
        padding: 0 1rem;
        white-space: pre;
        flex: 1;
    }

    /* Vertical breathing room */

    .line:first-child .line-number,
    .line:first-child .line-content {
        padding-top: 1rem;
    }

    .line:last-child .line-number,
    .line:last-child .line-content {
        padding-bottom: 1rem;
    }

    /* ── Prism token styles (self-contained) ── */

    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
        color: var(--font-color-sub2, #555);
    }

    .token.punctuation {
        color: var(--font-color-sub1, #a7a7a7);
    }

    .token.namespace {
        opacity: .7;
    }

    .token.property,
    .token.tag,
    .token.constant,
    .token.symbol,
    .token.deleted {
        color: var(--primary-color, rgba(98, 196, 255, 1.0));
    }

    .token.number {
        color: var(--tertiary-color, #fd971f);
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
        color: var(--secondary-color, #c9a0dc);
    }

    .token.operator,
    .token.entity,
    .token.url,
    .token.variable {
        color: var(--tertiary-color, #fd971f);
    }

    .token.atrule {
        color: var(--primary-color, rgba(98, 196, 255, 1.0));
    }

    .token.attr-value,
    .token.function,
    .token.class-name {
        color: var(--secondary-color, #c9a0dc);
    }

    .token.keyword,
    .token.null {
        color: var(--secondary-color, #c9a0dc);
    }

    .token.regex,
    .token.important {
        color: #fd971f;
    }

    /* boolean after important — Prism YAML aliases boolean as important */

    .token.boolean {
        color: var(--secondary-color, #c9a0dc);
    }

    .token.important,
    .token.bold {
        font-weight: bold;
    }

    .token.italic {
        font-style: italic;
    }

    .token.entity {
        cursor: help;
    }

    /* ── Location bar ── */

    .location {
        padding: 0.5rem 1rem;
        background: var(--card-background-color, rgba(35, 35, 35, 0.55));
        border-top: 1px solid var(--hrcolor, #3d3d3d);
        color: var(--font-color-sub2, #555);
        font-family: var(--font-stack, monospace);
        font-size: 0.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;var Zl=Object.defineProperty,Ql=Object.getOwnPropertyDescriptor,xe=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ql(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Zl(e,r,s),s};gt.manual=!0,d.PpCodeViewer=class extends F{constructor(){super(...arguments),this.code="",this.language="json",this.pretty=!1,this.lineNumbers=!1,this.highlightLines="",this.startLine=1,this.location="",this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:"",language:"",segments:[]},this._highlightCache={spec:"",parsed:new Set}}get displayCode(){if(!this.code)return"";if(this.pretty&&this.language==="json")try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(e){const r=new Set;if(!e)return r;for(const o of e.split(",")){const i=o.trim().match(/^(\d+)(?:-(\d+))?$/);if(!i)continue;const n=parseInt(i[1],10),a=i[2]?parseInt(i[2],10):n;for(let l=Math.min(n,a);l<=Math.max(n,a);l++)r.add(l)}return r}highlightCode(){const e=this.displayCode;if(!e)return"";try{return gt.highlight(e,gt.languages[this.language],this.language)}catch{return e}}splitHighlightedLines(e){const r=[];let o="";const s=[];let i=0;for(;i<e.length;)if(e[i]===`
`){for(let n=s.length-1;n>=0;n--)o+="</span>";r.push(o),o=s.join(""),i++}else if(e[i]==="<")if(e.startsWith("</span>",i))o+="</span>",s.pop(),i+=7;else{const n=e.indexOf(">",i);if(n===-1){o+=e[i],i++;continue}const a=e.slice(i,n+1);o+=a,a.startsWith("</")||s.push(a),i=n+1}else o+=e[i],i++;for(let n=s.length-1;n>=0;n--)o+="</span>";return o&&r.push(o),r}getLineSegments(){const e=this.displayCode;if(e===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;const r=this.highlightCode(),o=r?this.splitHighlightedLines(r):[];return this._segmentCache={code:e,language:this.language,segments:o},o}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){const e=this.parsedHighlights;return e.size>0?e:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}handleLineClick(e,r){if(this.isLocked)return;const o=new Set;if(r.shiftKey&&this.lastClickedLine!==null){const s=Math.min(this.lastClickedLine,e),i=Math.max(this.lastClickedLine,e);for(let n=s;n<=i;n++)o.add(n)}else this.selectedLines.size===1&&this.selectedLines.has(e)||o.add(e);this.selectedLines=o,this.lastClickedLine=e}willUpdate(e){(e.has("code")||e.has("language"))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?p`<div class="location">${this.location}</div>`:b}render(){if(!this.lineNumbers)return p`
              <pre class="language-${this.language}"><code>${Lo(this.highlightCode())}</code></pre>
              ${this.renderLocation()}
            `;const e=this.getLineSegments(),r=Math.max(this.startLine,1),o=r+e.length-1,s=o>0?Math.floor(Math.log10(o))+1:1,i=this.effectiveHighlights,n=this.isLocked;return p`
          <div class="lined-code${n?" locked":""}" style="--gutter-digits: ${s}">
            <pre class="language-${this.language}"><code>${e.map((a,l)=>{const c=r+l,m=i.has(c);return p`<span class="line${m?" highlighted":""}"
                ><span class="line-number"
                       @click=${v=>this.handleLineClick(c,v)}
                >${c}</span><span class="line-content">${Lo(a||" ")}</span>
</span>`})}</code></pre>
          </div>
          ${this.renderLocation()}
        `}},d.PpCodeViewer.styles=[Xl],xe([h()],d.PpCodeViewer.prototype,"code",2),xe([h()],d.PpCodeViewer.prototype,"language",2),xe([h({type:Boolean})],d.PpCodeViewer.prototype,"pretty",2),xe([h({attribute:"line-numbers",type:Boolean})],d.PpCodeViewer.prototype,"lineNumbers",2),xe([h({attribute:"highlight-lines"})],d.PpCodeViewer.prototype,"highlightLines",2),xe([h({attribute:"start-line",type:Number})],d.PpCodeViewer.prototype,"startLine",2),xe([h()],d.PpCodeViewer.prototype,"location",2),xe([T()],d.PpCodeViewer.prototype,"selectedLines",2),xe([T()],d.PpCodeViewer.prototype,"lastClickedLine",2),d.PpCodeViewer=xe([H("pp-code-viewer")],d.PpCodeViewer);var ec=Object.defineProperty,tc=Object.getOwnPropertyDescriptor,st=(t,e,r,o)=>{for(var s=o>1?void 0:o?tc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&ec(e,r,s),s};d.PpRefPopover=class extends F{constructor(){super(...arguments),this.registryKey="",this.schemaRef="",this.active=!1,this.entry=null,this.parsedData=null}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.showTimeout),clearTimeout(this.hideTimeout),this.active=!1}show(){clearTimeout(this.hideTimeout),this.showTimeout=window.setTimeout(()=>{if(this.entry=(this.registryKey?bi(this.registryKey):Vl(this.schemaRef))??null,this.entry){try{this.parsedData=JSON.parse(this.entry.schemaJson)}catch{this.parsedData=null}this.active=!0}},300)}hide(){clearTimeout(this.showTimeout),this.hideTimeout=window.setTimeout(()=>{this.active=!1},200)}cancelHide(){clearTimeout(this.hideTimeout)}resolveExample(){var r,o;if((r=this.entry)!=null&&r.mockJson)return this.entry.mockJson;const e=this.parsedData;return e?((o=e.schema)==null?void 0:o.example)!==void 0?JSON.stringify(e.schema.example):e.example!==void 0?JSON.stringify(e.example):Array.isArray(e.examples)&&e.examples.length>0?JSON.stringify(e.examples[0]):null:null}getSchemaJson(){if(!this.entry)return"";const e=this.parsedData;return e?e.schema?JSON.stringify(e.schema):this.entry.schemaJson:this.entry.schemaJson}formatJson(e){try{return JSON.stringify(JSON.parse(e),null,2)}catch{return e}}render(){const e=this.resolveExample(),r=this.getSchemaJson();return p`
            <span class="trigger"
                @mouseenter=${this.show}
                @mouseleave=${this.hide}
                @click=${()=>{this.active=!1}}>
                <slot></slot>
            </span>
            ${this.active&&this.entry?p`
                <sl-popup
                    .anchor=${this.trigger}
                    placement="bottom-start"
                    strategy="fixed"
                    active
                    flip shift
                    distance="8">
                    <div class="pp-ref-popover-content"
                        @mouseenter=${this.cancelHide}
                        @mouseleave=${this.hide}>
                        <div class="popover-header">
                            <span class="type-badge">${this.entry.componentType}</span>
                            <span class="component-name">${this.entry.name}</span>
                        </div>
                        <div class="popover-body">
                            <pp-schema-properties compact schema-json=${r}></pp-schema-properties>
                        </div>
                        ${e?p`
                            <div class="popover-example">
                                <div class="example-label">Example</div>
                                <pp-code-viewer
                                    .code=${this.formatJson(e)}
                                    language="json">
                                </pp-code-viewer>
                            </div>
                        `:b}
                    </div>
                </sl-popup>
            `:b}
        `}},d.PpRefPopover.styles=Hl,st([h({attribute:"registry-key"})],d.PpRefPopover.prototype,"registryKey",2),st([h({attribute:"schema-ref"})],d.PpRefPopover.prototype,"schemaRef",2),st([T()],d.PpRefPopover.prototype,"active",2),st([T()],d.PpRefPopover.prototype,"entry",2),st([T()],d.PpRefPopover.prototype,"parsedData",2),st([I(".trigger")],d.PpRefPopover.prototype,"trigger",2),d.PpRefPopover=st([H("pp-ref-popover")],d.PpRefPopover);var rc=Object.defineProperty,oc=Object.getOwnPropertyDescriptor,zo=(t,e,r,o)=>{for(var s=o>1?void 0:o?oc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&rc(e,r,s),s};d.PpOperationParameters=class extends F{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(e){if(e.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}renderConstraints(e){var o,s;if(!e)return b;const r=To(e);return!r.length&&!((o=e.enum)!=null&&o.length)?b:p`
      <div class="constraints">
        ${r.map(i=>p`
          <span class="constraint-label">${i.label}:</span>
          <span class="constraint-value">${i.isCode?p`<code>${i.value}</code>`:i.value}</span>
        `)}
        ${(s=e.enum)!=null&&s.length?p`
          <span class="constraint-label">enum:</span>
          <span class="constraint-value">${e.enum.map((i,n)=>p`${n>0?", ":""}<span class="enum-value">${i}</span>`)}</span>
        `:b}
      </div>
    `}inIcon(e){switch(e){case"cookie":return"cookie";case"header":return"envelope";case"path":return"signpost";case"query":return"question-diamond";default:return"question-diamond"}}parseSchema(e){if(!e)return null;try{return JSON.parse(e)}catch{return null}}render(){return this.params.length?p`
      ${this.params.map(e=>{const r=this.parseSchema(e.schemaJson),o=xr(r);return p`
            <div class="parameter">
                <div class="param-name-col">
                    ${e.required?p`<span class="required-badge">req</span>`:b}
                    ${e.ref?p`
                                <pp-ref-popover registry-key="${e.ref.componentType}/${e.ref.name}"><a
                                        class="ref-link param-name" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c
                                    ${e.name}</a></pp-ref-popover>`:p`<span class="param-name">${e.name}</span>`}
                    
                    ${e.deprecated?p`<span class="deprecated-badge">deprecated</span>`:b}
                </div>
                <div class="param-type-col">
                    ${o?p`<span class="param-type">${o}</span>`:b}
                    ${this.renderConstraints(r)}
                </div>
                <div class="param-in-col">
                    <sl-icon class="param-in-icon" name="${this.inIcon(e.in)}"></sl-icon>
                    <span class="param-in">${e.in}</span>
                </div>
                <div class="param-desc-col">
                    ${e.description||b}
                </div>
                ${!e.ref&&(e.rawJson||e.rawYaml)||e.mockJson||e.examples&&Object.keys(e.examples).length>0?p`
                            <div class="param-extras">
                                ${!e.ref&&(e.rawJson||e.rawYaml)?p`
                                            <pp-raw-viewer-btn
                                                    title="${e.name} (${e.in})"
                                                    raw-json=${e.rawJson||""}
                                                    raw-yaml=${e.rawYaml||""}
                                                    start-line=${e.sourceLine||1}>
                                            </pp-raw-viewer-btn>`:b}
                                ${e.mockJson||e.examples&&Object.keys(e.examples).length>0?p`
                                            <pp-example-selector
                                                    mock-json=${e.mockJson||""}
                                                    examples-json=${e.examples?JSON.stringify(e.examples):""}>
                                            </pp-example-selector>`:b}
                            </div>
                        `:b}
            </div>
        `})}
    `:b}},d.PpOperationParameters.styles=[gr,wr,fi,Il],zo([h({attribute:"parameters-json"})],d.PpOperationParameters.prototype,"parametersJson",2),zo([T()],d.PpOperationParameters.prototype,"params",2),d.PpOperationParameters=zo([H("pp-operation-parameters")],d.PpOperationParameters);const sc=R`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    h2 {
        border-bottom: 1px dashed var(--hrcolor);
        font-family: var(--font-stack), monospace;
        padding-bottom: var(--global-padding-double);
        margin-top: 80px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    h3 {
        margin-bottom: 40px;
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 1.6rem;
        margin-top: 0;
    }

    .response {
        margin-bottom: 1.5rem;
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
        padding: 1rem;
    }
    
    .status-code {
        font-family: var(--font-stack-bold), monospace;
        margin-right: var(--global-padding-double);
        color: var(--primary-color);
    }

    .media-type-ref {
        margin-top: 40px;
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        padding: var(--global-padding-double) 0;
    }

    .media-type-label {
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .array-type {
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
    }

    /* ── Headers section ── */

    .headers-section {
        margin-top: 0.75rem;
        border-top: 1px dotted var(--hrcolor);
        padding-top: 0.5rem;
    }

    .headers-label {
        font-family: var(--font-stack-bold);
        color: var(--font-color-sub2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.8em;
        margin-bottom: 0.25rem;
    }

    .header-entry {
        padding: 0.35rem 0.75rem;
        border-bottom: 1px dotted var(--hrcolor);
    }

    .header-entry:last-child {
        border-bottom: none;
    }

    .header-name {
        font-family: var(--font-stack-bold);
        color: var(--font-color);
    }

    .header-type {
        color: var(--primary-color);
        margin-left: 0.5rem;
        font-family: var(--font-stack);
    }

    .header-desc {
        color: var(--font-color-sub1);
        margin-top: 0.2rem;
        font-size: 0.9em;
    }

    /* ── Common header grid ── */

    .common-header-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.15rem 0.75rem;
        padding: 0.3rem 0.75rem;
        align-items: baseline;
    }

    .common-link-label {
        color: var(--font-color-sub2);
        font-family: var(--font-stack);
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        grid-column: 1 / -1;
        margin-bottom: 0.15rem;
    }

    .header-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack-bold);
        cursor: pointer;
    }

    .header-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    .common-header-desc {
        color: var(--font-color-sub1);
    }

    /* ── Inline examples ── */

    .inline-example {
        margin-top: var(--global-padding-double);
    }

    .inline-example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
    }

    /* ── Response group headings ── */

    .response-group-heading {
        margin-top: 1.5rem;
    }

    /* ── Common errors ── */

    .common-error-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0;
    }

    .error-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack), monospace;
        cursor: pointer;
        font-size: 0.85em;
    }

    .error-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    .common-error-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.15rem 0.75rem;
        margin-bottom: 0.5rem;
        align-items: baseline;
    }

    .common-error-code {
        font-family: var(--font-stack-bold);
        font-weight: 700;
        color: var(--primary-color);
    }

    .common-error-desc {
        color: var(--font-color-sub1);
    }
`,ic=R`
  sl-details.pp-details {
    margin-top: 1.5rem;
  }
  sl-details.pp-details::part(base) {
    background: transparent;
    border: 1px dashed var(--secondary-color-dimmer);
    border-radius: 0;
  }
  sl-details.pp-details::part(header) {
    padding: 0.6rem 1rem;
  }
  sl-details.pp-details::part(summary-icon) {
    color: var(--secondary-color);
  }
  sl-details.pp-details::part(content) {
    padding: 0 1rem 1rem;
  }
  .pp-details-summary {
    font-family: var(--font-stack-bold);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-color);
  }
`,$i={100:"Continue",101:"Switching Protocols",102:"Processing",103:"Early Hints",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Content Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a Teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Too Early",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",510:"Not Extended",511:"Network Authentication Required"};var nc=Object.defineProperty,ac=Object.getOwnPropertyDescriptor,he=(t,e,r,o)=>{for(var s=o>1?void 0:o?ac(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&nc(e,r,s),s};d.PpOperationResponses=class extends F{constructor(){super(...arguments),this.responsesJson="",this.commonHeadersJson="",this.responses=[],this.commonResponseHeaders=[],this.commonHeaderNames=new Set,this.commonErrorKeys=new Set,this.commonErrorResponses=new Map,this.successResponses=[],this.redirectResponses=[],this.errorResponses=[]}willUpdate(e){if(e.has("responsesJson")&&this.responsesJson){try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}const{commonNames:r}=this.computeCommonHeaders();this.commonHeaderNames=r;const o=[...this.responses].sort((c,m)=>parseInt(c.statusCode,10)-parseInt(m.statusCode,10)),s=[],i=[],n=[];for(const c of o){const m=parseInt(c.statusCode,10);m>=400?n.push(c):m>=300?i.push(c):s.push(c)}this.successResponses=s,this.redirectResponses=i,this.errorResponses=n;const{commonKeys:a,commonResponses:l}=this.computeCommonErrors(n);this.commonErrorKeys=a,this.commonErrorResponses=l}if(e.has("commonHeadersJson")&&this.commonHeadersJson)try{this.commonResponseHeaders=JSON.parse(this.commonHeadersJson)}catch{this.commonResponseHeaders=[]}}renderRefLink(e,r=!1){const o=p`<a class="ref-link" href="models/${e.typeSlug}/${e.slug}.html">\u279c ${e.name}</a>`;return r?p`
            <pp-ref-popover registry-key="${e.componentType}/${e.name}">${o}</pp-ref-popover>`:o}renderInlineExamples(e){const r=[];if(e.examples)for(const[o,s]of Object.entries(e.examples))s&&r.push({key:o,json:s});return e.mockJson&&r.push({key:"Example",json:e.mockJson}),r.length?r.map(o=>{let s=o.json;try{s=JSON.stringify(JSON.parse(o.json),null,2)}catch{}return p`
                <div class="inline-example">
                    <div class="inline-example-label">${o.key}</div>
                    <pp-code-viewer
                            .code=${s}
                            language="json">
                    </pp-code-viewer>
                </div>
            `}):b}renderMediaType(e){if(e.isArray&&e.itemsRef){const r=e.itemsSchemaJson||e.schemaJson;return p`
                <div class="media-type-ref">
                    <span class="media-type-label">${e.mediaType}</span>
                    <span class="array-type">Array&lt;${this.renderRefLink(e.itemsRef)}&gt;</span>
                </div>
                ${r?p`
                    <pp-schema-properties schema-json=${r}></pp-schema-properties>`:b}
                ${this.renderInlineExamples(e)}
            `}return e.schemaRef?p`
                <div class="media-type-ref">
                    <span class="media-type-label">${e.mediaType}</span>
                    ${this.renderRefLink(e.schemaRef)}
                </div>
                ${e.schemaJson?p`
                    <pp-schema-properties schema-json=${e.schemaJson}></pp-schema-properties>`:b}
                ${this.renderInlineExamples(e)}
            `:e.schemaJson?p`
            <div class="media-type-label">${e.mediaType}</div>
            <pp-schema-properties schema-json=${e.schemaJson}></pp-schema-properties>
            ${this.renderInlineExamples(e)}
        `:b}computeCommonHeaders(){const e=new Map,r=new Map;for(const i of this.responses)for(const n of i.headers??[])e.set(n.name,(e.get(n.name)??0)+1),r.has(n.name)||r.set(n.name,n);const o=[],s=new Set;for(const[i,n]of e)n>=2&&(o.push(r.get(i)),s.add(i));return{common:o,commonNames:s}}scrollToHeader(e){const r=document.getElementById("header-"+e);r==null||r.scrollIntoView({behavior:"smooth",block:"nearest"})}renderHeaderConstraints(e){var o,s;return e.example!==void 0||e.minimum!==void 0||e.maximum!==void 0||e.default!==void 0||e.pattern||((o=e.enum)==null?void 0:o.length)?p`
            <div class="header-constraints">
                ${e.example!==void 0?p`<span class="constraint-label">example</span><span
                        class="constraint-value">${e.example}</span>`:b}
                ${e.default!==void 0?p`<span class="constraint-label">default</span><span
                        class="constraint-value">${e.default}</span>`:b}
                ${e.minimum!==void 0?p`<span class="constraint-label">min</span><span
                        class="constraint-value">${e.minimum}</span>`:b}
                ${e.maximum!==void 0?p`<span class="constraint-label">max</span><span
                        class="constraint-value">${e.maximum}</span>`:b}
                ${e.pattern?p`<span class="constraint-label">pattern</span><span
                        class="constraint-value"><code>${e.pattern}</code></span>`:b}
                ${(s=e.enum)!=null&&s.length?p`<span class="constraint-label">enum</span><span
                        class="constraint-value">${e.enum.map((i,n)=>p`${n>0?", ":""}<span
                        class="enum-value">${i}</span>`)}</span>`:b}
            </div>
        `:b}renderHeaderEntry(e){return p`
            <div class="header-entry">
                ${e.ref?p`
                            <pp-ref-popover registry-key="${e.ref.componentType}/${e.ref.name}"><a
                                    class="ref-link header-name" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c
                                ${e.name}</a></pp-ref-popover>`:p`<span class="header-name">${e.name}</span>`}
                ${e.schemaType?p`<span class="header-type">${e.schemaType}</span>`:b}
                ${e.description?p`
                    <div class="header-desc">${e.description}</div>`:b}
                ${this.renderHeaderConstraints(e)}
            </div>
        `}renderHeaders(e,r){if(!e||!e.length)return b;const o=e.filter(i=>!r.has(i.name)),s=e.filter(i=>r.has(i.name));return!o.length&&!s.length?b:p`
            <div class="headers-section">
                <div class="headers-label">Headers</div>
                ${s.length?p`
                    <div class="common-header-grid">
                        <div class="common-link-label">\u2191 common</div>
                        ${s.map(i=>p`
                            <a class="header-anchor" @click=${n=>{n.preventDefault(),this.scrollToHeader(i.name)}}>${i.name}</a>
                            <span class="common-header-desc">${i.description||""}</span>
                        `)}
                    </div>
                `:b}
                ${o.map(i=>this.renderHeaderEntry(i))}
            </div>
        `}errorRefKey(e){var r;if(e.ref)return`ref:${e.ref.slug}`;if((r=e.content)!=null&&r.length){const o=e.content[0];if(o.schemaRef)return`schema:${o.schemaRef.slug}`;if(o.isArray&&o.itemsRef)return`items:${o.itemsRef.slug}`}return null}computeCommonErrors(e){const r=new Map;for(const i of e){const n=this.errorRefKey(i);if(!n)continue;const a=r.get(n);a?a.codeDescs.push({code:i.statusCode,description:i.description}):r.set(n,{resp:i,codeDescs:[{code:i.statusCode,description:i.description}]})}const o=new Set,s=new Map;for(const[i,n]of r)n.codeDescs.length>=2&&(o.add(i),s.set(i,n));return{commonKeys:o,commonResponses:s}}scrollToCommonError(e){var o;const r=(o=this.shadowRoot)==null?void 0:o.getElementById("common-error-"+e);r==null||r.scrollIntoView({behavior:"smooth",block:"nearest"})}renderResponse(e,r,o){var n,a;const s=o?this.errorRefKey(e):null,i=s!=null&&(o==null?void 0:o.has(s));return p`
            <div class="response">
                    <h3><span class="status-code">${e.statusCode}</span> ${$i[e.statusCode]||""}</h3>
                    
                    ${e.description}
                    ${e.rawJson||e.rawYaml?p`
                                <pp-raw-viewer-btn
                                        title="Response ${e.statusCode}"
                                        raw-json=${e.rawJson||""}
                                        raw-yaml=${e.rawYaml||""}
                                        start-line=${e.sourceLine||1}>
                                </pp-raw-viewer-btn>`:b}
             
                ${i?p`
                            <div class="common-error-link">
                                ${e.ref?this.renderRefLink(e.ref,!0):b}
                                ${!e.ref&&((n=e.content)!=null&&n.length)?this.renderMediaTypeHeader(e.content[0]):b}
                                <a class="error-anchor" @click=${l=>{l.preventDefault(),this.scrollToCommonError(s)}}>\u2191 see common example</a>
                            </div>`:e.ref?this.renderRefLink(e.ref,!0):((a=e.content)==null?void 0:a.map(l=>this.renderMediaType(l)))??b}
                ${this.renderHeaders(e.headers??[],r)}
            </div>
        `}renderMediaTypeHeader(e){return e.isArray&&e.itemsRef?p`
                <span class="media-type-label">${e.mediaType}</span>
                <span class="array-type">Array&lt;${this.renderRefLink(e.itemsRef)}&gt;</span>
            `:e.schemaRef?p`
                <span class="media-type-label">${e.mediaType}</span>
                ${this.renderRefLink(e.schemaRef)}
            `:b}renderCommonErrors(e,r){return e.size?p`
            <div class="response-group-heading">Common Error Responses</div>
            ${[...e.entries()].map(([o,{resp:s,codeDescs:i}])=>{var n;return p`
                <div class="response common-error-response" id="common-error-${o}">
                    <div class="common-error-grid">
                        ${i.map(({code:a,description:l})=>p`
                            <span class="common-error-code">${a} ${$i[a]||""}</span>
                            <span class="common-error-desc">${l}</span>
                        `)}
                    </div>
                    ${s.ref?this.renderRefLink(s.ref,!0):((n=s.content)==null?void 0:n.map(a=>this.renderMediaType(a)))??b}
                    ${this.renderHeaders(s.headers??[],r)}
                </div>
            `})}
        `:b}render(){if(!this.responses.length)return b;const e=this.commonHeaderNames,r=this.commonErrorKeys,o=this.commonErrorResponses;return p`
            <h2>Responses</h2>
            ${this.successResponses.map(s=>this.renderResponse(s,e))}
            ${this.redirectResponses.length?p`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary">Redirect Responses</span>
                    ${this.redirectResponses.map(s=>this.renderResponse(s,e))}
                </sl-details>
            `:b}
            ${this.commonResponseHeaders.length?p`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary">Common Response Headers</span>
                    ${this.commonResponseHeaders.map(s=>this.renderHeaderEntry(s))}
                </sl-details>
            `:b}
            ${this.errorResponses.length||o.size?p`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary">Error Responses</span>
                    ${this.renderCommonErrors(o,e)}
                    ${this.errorResponses.map(s=>this.renderResponse(s,e,r))}
                </sl-details>
            `:b}
        `}},d.PpOperationResponses.styles=[gr,wr,fi,sc,ic],he([h({attribute:"responses-json"})],d.PpOperationResponses.prototype,"responsesJson",2),he([h({attribute:"common-headers-json"})],d.PpOperationResponses.prototype,"commonHeadersJson",2),he([T()],d.PpOperationResponses.prototype,"responses",2),he([T()],d.PpOperationResponses.prototype,"commonResponseHeaders",2),he([T()],d.PpOperationResponses.prototype,"commonHeaderNames",2),he([T()],d.PpOperationResponses.prototype,"commonErrorKeys",2),he([T()],d.PpOperationResponses.prototype,"commonErrorResponses",2),he([T()],d.PpOperationResponses.prototype,"successResponses",2),he([T()],d.PpOperationResponses.prototype,"redirectResponses",2),he([T()],d.PpOperationResponses.prototype,"errorResponses",2),d.PpOperationResponses=he([H("pp-operation-responses")],d.PpOperationResponses);const lc=R`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    h3 {
        margin-bottom: var(--global-padding-double);
        color: var(--primary-color);
        font-family: var(--font-stack-bold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    pre {
        background: var(--terminal-background);
        border: 1px solid var(--hrcolor);
        border-radius: 0;
        padding: 1rem;
        overflow-x: auto;
        color: var(--font-color);
    }

    code {
        background: none;
        padding: 0;
        border: none;
        color: var(--font-color);
    }

    .property {
        margin-bottom: 0;
        padding: 0.5rem 0.75rem;
        border-top: 1px dotted var(--secondary-color-dimmer);
    }

    .prop-name {
        font-family: var(--font-stack-bold);
        color: var(--font-color);
    }

    .prop-type {
        color: var(--primary-color);
        margin-left: 0.5rem;
        font-family: var(--font-stack);
    }

    .prop-format {
        color: var(--font-color-sub2);
        margin-left: 0.25rem;
        font-family: var(--font-stack);
    }

    .prop-desc {
        color: var(--font-color-sub1);
        margin-top: 0.2rem;
    }

    .required-badge {
        color: var(--error-color);
        font-family: var(--font-stack-bold);
        margin-left: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .enum-values {
        color: var(--font-color-sub2);
        font-size: 0.85em;
        margin-top: 0.15rem;
    }

    .enum-value {
        color: var(--warn-400);
        font-family: var(--font-stack);
    }

    .traits {
        margin-bottom: 1rem;
    }

    .example-object {
        margin-bottom: 1rem;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    .example-object:last-child {
        border-bottom: none;
    }

    .example-header {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }

    .example-summary {
        color: var(--font-color-sub1);
        font-family: var(--font-stack);
        font-size: 0.9em;
    }

    .example-external a {
        color: var(--terminal-text);
        text-decoration: none;
        font-family: var(--font-stack);
    }

    .example-external a:hover {
        text-decoration: underline;
    }

    a.ref-type-link,
    a.ref-type-link:visited,
    a.ref-type-link:active {
        color: var(--terminal-text);
        text-decoration: none;
        font-family: var(--font-stack);
    }

    a.ref-type-link:hover {
        text-decoration: underline;
    }
`,cc=R`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0;
  }
  h3 {
    margin: 0;
    color: var(--secondary-color);
    font-family: var(--font-stack-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .toggle-group {
    display: flex;
    gap: 0;
    margin-left: auto;
  }
  .toggle-btn {
    background: none;
    border: 1px solid var(--hrcolor);
    color: var(--font-color-sub2);
    font-family: var(--font-stack);
    font-size: 0.75em;
    padding: 0.2em 0.6em;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .toggle-btn:first-child {
    border-right: none;
  }
  .toggle-btn.active {
    color: var(--primary-color);
    border-color: var(--primary-color);
    background: var(--primary-color-verylowalpha);
  }
  .toggle-btn:hover:not(.active) {
    color: var(--font-color-sub1);
  }
  .code-container {
    border: 1px solid var(--hrcolor);
  }
`;var dc=Object.defineProperty,pc=Object.getOwnPropertyDescriptor,it=(t,e,r,o)=>{for(var s=o>1?void 0:o?pc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&dc(e,r,s),s};d.PpInlineCode=class extends F{constructor(){super(...arguments),this.rawJson="",this.rawYaml="",this.startLine=1,this.title="Schema",this.location="",this.mode="yaml"}connectedCallback(){super.connectedCallback();const e=document.body.getAttribute("data-spec-format");(e==="json"||e==="yaml")&&(this.mode=e)}render(){if(!this.rawJson&&!this.rawYaml)return b;const e=!!this.rawJson,r=!!this.rawYaml,o=this.mode==="yaml"&&r?this.rawYaml:this.rawJson,s=this.mode==="yaml"&&r?"yaml":"json";return p`
      <div class="toolbar">
        <h3>${this.title}</h3>
        ${e&&r?p`
          <div class="toggle-group">
            <button class="toggle-btn ${this.mode==="json"?"active":""}"
                    @click=${()=>this.mode="json"}>JSON</button>
            <button class="toggle-btn ${this.mode==="yaml"?"active":""}"
                    @click=${()=>this.mode="yaml"}>YAML</button>
          </div>
        `:b}
      </div>
      <div class="code-container">
        <pp-code-viewer
          code=${o}
          language=${s}
          ?pretty=${s==="json"}
          ?line-numbers=${s==="json"?o.includes(`
`)||o.startsWith("{")||o.startsWith("["):o.split(`
`).length>1}
          start-line=${this.startLine}
          location=${this.location}>
        </pp-code-viewer>
      </div>
    `}},d.PpInlineCode.styles=[cc],it([h({attribute:"raw-json"})],d.PpInlineCode.prototype,"rawJson",2),it([h({attribute:"raw-yaml"})],d.PpInlineCode.prototype,"rawYaml",2),it([h({attribute:"start-line",type:Number})],d.PpInlineCode.prototype,"startLine",2),it([h()],d.PpInlineCode.prototype,"title",2),it([h()],d.PpInlineCode.prototype,"location",2),it([T()],d.PpInlineCode.prototype,"mode",2),d.PpInlineCode=it([H("pp-inline-code")],d.PpInlineCode);var hc=Object.defineProperty,uc=Object.getOwnPropertyDescriptor,_e=(t,e,r,o)=>{for(var s=o>1?void 0:o?uc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&hc(e,r,s),s};d.PpModelPage=class extends F{constructor(){super(...arguments),this.modelJson="",this.name="",this.rawYaml="",this.schemaRawYaml="",this.schemaRawJson="",this.schemaStartLine=1,this.startLine=1,this.location="",this.parsed=null}willUpdate(e){if(e.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}renderConstraints(e){var o,s;const r=To(e,{includeExample:!0});return!r.length&&!((o=e.enum)!=null&&o.length)?b:p`
      <div class="constraints">
        ${r.map(i=>p`
          <span class="constraint-label">${i.label}</span>
          <span class="constraint-value">${i.isCode?p`<code>${i.value}</code>`:i.value}</span>
        `)}
        ${(s=e.enum)!=null&&s.length?p`
          <span class="constraint-label">enum</span>
          <span class="constraint-value">${e.enum.map((i,n)=>p`${n>0?", ":""}<span class="enum-value">${JSON.stringify(i)}</span>`)}</span>
        `:b}
      </div>
    `}renderType(e){var o;if(!e)return b;if(e.type==="array"&&((o=e.items)!=null&&o.$ref)){const s=$r(e.items.$ref);if(s)return p`<span class="prop-type">Array&lt;<pp-ref-popover schema-ref="${e.items.$ref}"><a class="ref-type-link" href="${s.href}">\u279c ${s.name}</a></pp-ref-popover>&gt;</span>`}if(e.$ref){const s=$r(e.$ref);if(s)return p`<span class="prop-type"><pp-ref-popover schema-ref="${e.$ref}"><a class="ref-type-link" href="${s.href}">\u279c ${s.name}</a></pp-ref-popover></span>`}const r=xr(e);return r?p`<span class="prop-type">${r}</span>`:b}renderExampleObjects(e){const r=Object.entries(e);return r.length?p`
      <h3>Examples</h3>
      ${r.map(([o,s])=>p`
        <div class="example-object">
          <div class="example-header">
            <span class="prop-name">${o}</span>
            ${s.summary?p`<span class="example-summary">${s.summary}</span>`:b}
          </div>
          ${s.description?p`<div class="prop-desc">${s.description}</div>`:b}
          ${s.value!==void 0?p`<pp-inline-code raw-json=${JSON.stringify(s.value,null,2)} title=${o}></pp-inline-code>`:b}
          ${s.externalValue?p`<div class="example-external"><a href=${s.externalValue}>${s.externalValue}</a></div>`:b}
        </div>
      `)}
    `:b}renderComponentWithSchema(e,r){const o=e.schema||{},s=this.schemaRawJson||JSON.stringify(o,null,2),i=this.schemaRawYaml;return p`
      <div class="traits">
        <h3>Traits</h3>
        <div class="constraints">
          ${r}
          ${o.type?p`
            <span class="constraint-label">type</span>
            <span class="constraint-value">${o.type}${o.format?` (${o.format})`:""}</span>
          `:b}
        </div>
        ${this.renderConstraints(o)}
      </div>
      ${e.examples?this.renderExampleObjects(e.examples):b}
      ${!e.examples&&(e.example!==void 0||o.example!==void 0)?p`<pp-inline-code raw-json=${JSON.stringify(e.example??o.example,null,2)} title="Example"></pp-inline-code>`:b}
      ${Object.keys(o).length?p`<pp-inline-code
            raw-json=${s}
            raw-yaml=${i}
            start-line=${this.schemaStartLine}
            title="Schema"></pp-inline-code>`:b}
    `}renderParameter(e){return this.renderComponentWithSchema(e,p`
      <span class="constraint-label">name</span>
      <span class="constraint-value">${e.name}</span>
      <span class="constraint-label">in</span>
      <span class="constraint-value">${e.in}</span>
      ${e.required!==void 0?p`
        <span class="constraint-label">required</span>
        <span class="constraint-value">${e.required}</span>
      `:b}
      ${e.deprecated?p`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:b}
    `)}renderHeader(e){return this.renderComponentWithSchema(e,p`
      ${e.required?p`
        <span class="constraint-label">required</span>
        <span class="constraint-value">true</span>
      `:b}
      ${e.deprecated?p`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:b}
    `)}renderSchema(e){const r=e.example!==void 0?JSON.stringify(e.example,null,2):"";return p`
      ${e.type?p`<div><strong>Type:</strong> ${e.type}</div>`:b}
      ${e.properties?p`
            <h3>Properties</h3>
            <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
          `:b}
      ${r?p`<pp-inline-code raw-json=${r} title="Example"></pp-inline-code>`:b}
      <pp-inline-code
        raw-json=${this.modelJson}
        raw-yaml=${this.rawYaml}
        start-line=${this.startLine}
        location=${this.location}
        title="Schema"></pp-inline-code>
    `}render(){if(!this.parsed)return b;const e=this.parsed;return e.in?this.renderParameter(e):e.schema&&!e.properties&&!e.in?this.renderHeader(e):this.renderSchema(e)}},d.PpModelPage.styles=[gr,wr,lc],_e([h({attribute:"model-json"})],d.PpModelPage.prototype,"modelJson",2),_e([h()],d.PpModelPage.prototype,"name",2),_e([h({attribute:"raw-yaml"})],d.PpModelPage.prototype,"rawYaml",2),_e([h({attribute:"schema-raw-yaml"})],d.PpModelPage.prototype,"schemaRawYaml",2),_e([h({attribute:"schema-raw-json"})],d.PpModelPage.prototype,"schemaRawJson",2),_e([h({attribute:"schema-start-line",type:Number})],d.PpModelPage.prototype,"schemaStartLine",2),_e([h({attribute:"start-line",type:Number})],d.PpModelPage.prototype,"startLine",2),_e([h()],d.PpModelPage.prototype,"location",2),_e([T()],d.PpModelPage.prototype,"parsed",2),d.PpModelPage=_e([H("pp-model-page")],d.PpModelPage);const mc=R`
  :host {
    display: block;
  }
  a {
    display: block;
    padding: 0.75rem 1rem;
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    color: var(--font-color, #e8e9ed);
    text-decoration: none;
    transition: border-color 0.15s;
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
  }
  a:hover {
    border-color: var(--secondary-color, #f83aff);
    text-decoration: none;
  }
  strong {
    display: block;
    margin-bottom: 0.2rem;
    font-family: var(--font-stack-bold, monospace);
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  p {
    color: var(--font-color-sub1, #a7a7a7);
    margin: 0;
  }
`;var fc=Object.defineProperty,gc=Object.getOwnPropertyDescriptor,kr=(t,e,r,o)=>{for(var s=o>1?void 0:o?gc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&fc(e,r,s),s};d.PpModelCard=class extends F{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return p`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?p`<p>${this.description}</p>`:""}
      </a>
    `}},d.PpModelCard.styles=mc,kr([h()],d.PpModelCard.prototype,"name",2),kr([h()],d.PpModelCard.prototype,"href",2),kr([h()],d.PpModelCard.prototype,"description",2),d.PpModelCard=kr([H("pp-model-card")],d.PpModelCard);const vc=R`
  :host {
    display: block;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px dashed var(--secondary-color-dimmer);
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
  }
  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }
  a {
    color: var(--primary-color);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .type-badge {
    color: var(--secondary-color, #f83aff);
    background: var(--secondary-color-very-lowalpha);
    border: 1px solid var(--secondary-color-dimmer);
    padding: 0.1em 0.4em;
    border-radius: 0;
    text-transform: uppercase;
    font-family: var(--font-stack-bold), monospace;
    letter-spacing: 0.05em;
  }
`;var bc=Object.defineProperty,yc=Object.getOwnPropertyDescriptor,Do=(t,e,r,o)=>{for(var s=o>1?void 0:o?yc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&bc(e,r,s),s};d.PpCrossRefs=class extends F{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(e){if(e.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var o,s,i,n,a,l;const{refs:e}=this;return((o=e.UsedByOperations)==null?void 0:o.length)||((s=e.UsedByModels)==null?void 0:s.length)||((i=e.UsesModels)==null?void 0:i.length)?p`
      ${(n=e.UsedByOperations)!=null&&n.length?p`
            <h3>Used by Operations</h3>
            <ul>
              ${e.UsedByOperations.map(c=>p`
                  <li>
                    <a href="operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:b}
      ${(a=e.UsedByModels)!=null&&a.length?p`
            <h3>Referenced by</h3>
            <ul>
              ${e.UsedByModels.map(c=>p`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:b}
      ${(l=e.UsesModels)!=null&&l.length?p`
            <h3>References</h3>
            <ul>
              ${e.UsesModels.map(c=>p`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:b}
    `:b}},d.PpCrossRefs.styles=vc,Do([h({attribute:"refs-json"})],d.PpCrossRefs.prototype,"refsJson",2),Do([T()],d.PpCrossRefs.prototype,"refs",2),d.PpCrossRefs=Do([H("pp-cross-refs")],d.PpCrossRefs);const wc=R`
  :host {
    display: block;
    margin: var(--global-padding-double);
  }
  details {
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
  }
  summary {
    cursor: pointer;
    padding: var(--global-padding) var(--global-padding-double);
    font-family: var(--font-stack-bold), monospace;
    background: var(--card-background-color);
    border-radius: 0;
    color: var(--font-color-sub1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  summary:hover {
    color: var(--primary-color,;
  }
  pre {
    margin: 0;
    padding: var(--global-padding-double);
    overflow-x: auto;
    background: var(--terminal-background);
    color: var(--font-color);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: inherit;
  }
`,$c=R`
  code,
  pre {
    color: var(--font-color);
    background: none;
    font-family: var(--font-stack), sans-serif;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    tab-size: 4;
    hyphens: none;
  }

  pre.json {
    color: var(--secondary-color);
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: var(--font-color-sub2);
  }

  .token.punctuation {
    color: var(--font-color-sub1);
  }

  .token.namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: var(--primary-color);
  }

  .token.boolean {
    color: var(--secondary-color);
  }

  .token.number {
    color: var(--tertiary-color);
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: var(--secondary-color);
  }

  .token.operator,
  .token.entity,
  .token.url,
  .token.variable {
    color: var(--tertiary-color);
  }

  .token.atrule {
    color: var(--primary-color);
  }

  .token.attr-value,
  .token.function,
  .token.class-name {
    color: var(--secondary-color);
  }

  .token.keyword,
  .token.null {
    color: var(--secondary-color);
  }

  .token.regex,
  .token.important {
    color: #fd971f;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;var xc=Object.defineProperty,_c=Object.getOwnPropertyDescriptor,Cr=(t,e,r,o)=>{for(var s=o>1?void 0:o?_c(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&xc(e,r,s),s};gt.manual=!0,d.PpExampleBlock=class extends F{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(e){if(e.has("exampleJson")&&this.exampleJson)try{const r=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(r,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return b;let e;try{e=gt.highlight(this.formatted,gt.languages.json,"json")}catch{e=this.formatted}return p`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${Lo(e)}</code></pre>
      </details>
    `}},d.PpExampleBlock.styles=[wc,$c],Cr([h()],d.PpExampleBlock.prototype,"name",2),Cr([h({attribute:"example-json"})],d.PpExampleBlock.prototype,"exampleJson",2),Cr([T()],d.PpExampleBlock.prototype,"formatted",2),d.PpExampleBlock=Cr([H("pp-example-block")],d.PpExampleBlock);const kc=R`
  :host {
    display: block;
  }
  sl-drawer {
    --size: 50vw;
  }
  sl-drawer::part(panel) {
    background: var(--terminal-background, #0a0a0a);
    border-left: 1px solid var(--hrcolor, #3d3d3d);
  }
  sl-drawer::part(header) {
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border-bottom: 1px solid var(--hrcolor, #3d3d3d);
  }
  sl-drawer::part(title) {
    font-family: var(--font-stack-bold, monospace);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  sl-drawer::part(close-button) {
    color: var(--font-color-sub1, #a7a7a7);
  }
  sl-drawer::part(body) {
    padding: 0;
    display: flex;
    align-items: flex-start;
    scrollbar-width: thin;
    scrollbar-color: var(--secondary-color-lowalpha) var(--terminal-background);
  }
  sl-drawer::part(body)::-webkit-scrollbar {
    width: 8px;
  }
  sl-drawer::part(body)::-webkit-scrollbar-track {
    background-color: var(--terminal-background);
  }
  sl-drawer::part(body)::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: var(--secondary-color-lowalpha);
  }
  pp-code-viewer {
    width: 100%;
  }
  sl-drawer::part(footer) {
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border-top: 1px solid var(--hrcolor, #3d3d3d);
    display: flex;
    justify-content: flex-end;
    padding: 0.75rem 1rem;
  }
  sl-drawer::part(header-actions) {
    display: flex;
    align-items: center;
  }
  .format-toggle {
    display: flex;
    gap: 0.5rem;
  }
  .format-toggle button {
    cursor: pointer;
    background: none;
    border: 1px dashed var(--hrcolor, #3d3d3d);
    color: var(--font-color-sub1, #a7a7a7);
    font-family: var(--font-stack, monospace);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.15s, border-color 0.15s;
  }
  .format-toggle button.active {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    border-color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  .format-toggle button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .copy-btn {
    cursor: pointer;
    background: var(--primary-color, rgba(98, 196, 255, 1.0));
    color: var(--background-color, #0d1117);
    border: none;
    padding: 0.5rem 1.25rem;
    font-family: var(--font-stack-bold, monospace);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: background 0.15s, opacity 0.15s;
  }
  .copy-btn:hover {
    opacity: 0.85;
  }
  .copy-btn.copied {
    background: var(--terminal-text, #00ff00);
  }
`;var Cc=Object.defineProperty,Pc=Object.getOwnPropertyDescriptor,ue=(t,e,r,o)=>{for(var s=o>1?void 0:o?Pc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Cc(e,r,s),s};d.PpExampleDrawer=class extends F{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.copied=!1,this.rawMode=!1,this.highlightLines="",this.startLine=1,this.location="",this.handleShowExample=e=>{const r=e.detail;this.title=r.title,this.json=r.json,this.yaml=r.yaml||"",this.rawMode=r.rawMode??!1,this.highlightLines=r.highlightLines||"",this.startLine=r.startLine??1,this.location=r.location||"";const o=document.body.getAttribute("data-spec-format");o==="yaml"&&r.yaml?this.format="yaml":o==="json"&&r.json?this.format="json":this.format=r.yaml?"yaml":"json",this.updateComplete.then(()=>{const s=this.drawer;s&&(s.updateComplete?s.updateComplete.then(()=>s.show()):s.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get copyText(){var r;const e=(r=this.shadowRoot)==null?void 0:r.querySelector("pp-code-viewer");return e?e.displayCode:this.format==="yaml"&&this.yaml?this.yaml:this.json}async copyToClipboard(){const e=this.copyText;if(e)try{await navigator.clipboard.writeText(e),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}catch{}}render(){const e=this.format==="yaml"&&this.yaml?this.yaml:this.json,r=this.format==="yaml"?"yaml":"json";return p`
      <sl-drawer label=${this.title||"Example"} placement="end">
        ${this.yaml?p`
          <div slot="header-actions" class="format-toggle">
            <button class="${this.format==="json"?"active":""}"
                    ?disabled=${!this.json}
                    @click=${()=>this.format="json"}>JSON</button>
            <button class="${this.format==="yaml"?"active":""}"
                    @click=${()=>this.format="yaml"}>YAML</button>
          </div>
        `:""}
        <pp-code-viewer
          .code=${e}
          .language=${r}
          ?line-numbers=${this.rawMode}
          .pretty=${r==="json"}
          .startLine=${this.startLine}
          .location=${this.location}
          highlight-lines=${this.highlightLines}>
        </pp-code-viewer>
        <button
          slot="footer"
          class="copy-btn ${this.copied?"copied":""}"
          @click=${this.copyToClipboard}>
          ${this.copied?"Copied!":"Copy to Clipboard"}
        </button>
      </sl-drawer>
    `}},d.PpExampleDrawer.styles=[kc],ue([T()],d.PpExampleDrawer.prototype,"title",2),ue([T()],d.PpExampleDrawer.prototype,"json",2),ue([T()],d.PpExampleDrawer.prototype,"yaml",2),ue([T()],d.PpExampleDrawer.prototype,"format",2),ue([T()],d.PpExampleDrawer.prototype,"copied",2),ue([T()],d.PpExampleDrawer.prototype,"rawMode",2),ue([T()],d.PpExampleDrawer.prototype,"highlightLines",2),ue([T()],d.PpExampleDrawer.prototype,"startLine",2),ue([T()],d.PpExampleDrawer.prototype,"location",2),ue([I("sl-drawer")],d.PpExampleDrawer.prototype,"drawer",2),d.PpExampleDrawer=ue([H("pp-example-drawer")],d.PpExampleDrawer);var Ac=R`
  :host {
    display: inline-block;
  }

  .dropdown::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    border-radius: var(--sl-border-radius-medium);
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    display: block;
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`,Y=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}const r=(o,s)=>{if(!o)return null;const i=o.closest(s);if(i)return i;const n=o.getRootNode();return n instanceof ShadowRoot?r(n.host,s):null};setTimeout(()=>{var o;const s=((o=this.containingElement)==null?void 0:o.getRootNode())instanceof ShadowRoot?Vs():document.activeElement;(!this.containingElement||r(s,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{const e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{const e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){const t=this.trigger.assignedElements({flatten:!0})[0];typeof(t==null?void 0:t.focus)=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}const e=this.getMenu();if(e){const r=e.getAllItems(),o=r[0],s=r[r.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),r.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(o),o.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(s),s.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){const e=this.trigger.assignedElements({flatten:!0}).find(o=>Aa(o).start);let r;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":r=e.button;break;default:r=e}r.setAttribute("aria-haspopup","true"),r.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,ze(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ze(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await $e(this),this.panel.hidden=!1,this.popup.active=!0;const{keyframes:t,options:e}=ce(this,"dropdown.show",{dir:this.localize.dir()});await de(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await $e(this);const{keyframes:t,options:e}=ce(this,"dropdown.hide",{dir:this.localize.dir()});await de(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return p`
      <sl-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${B(this.sync?this.sync:void 0)}
        class=${ve({dropdown:!0,"dropdown--open":this.open})}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open?"false":"true"} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `}};Y.styles=[Q,Ac],Y.dependencies={"sl-popup":M},u([I(".dropdown")],Y.prototype,"popup",2),u([I(".dropdown__trigger")],Y.prototype,"trigger",2),u([I(".dropdown__panel")],Y.prototype,"panel",2),u([h({type:Boolean,reflect:!0})],Y.prototype,"open",2),u([h({reflect:!0})],Y.prototype,"placement",2),u([h({type:Boolean,reflect:!0})],Y.prototype,"disabled",2),u([h({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],Y.prototype,"stayOpenOnSelect",2),u([h({attribute:!1})],Y.prototype,"containingElement",2),u([h({type:Number})],Y.prototype,"distance",2),u([h({type:Number})],Y.prototype,"skidding",2),u([h({type:Boolean})],Y.prototype,"hoist",2),u([h({reflect:!0})],Y.prototype,"sync",2),u([G("open",{waitUntilFirstUpdate:!0})],Y.prototype,"handleOpenChange",1),W("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}}),W("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}}),Y.define("sl-dropdown");var Sc=R`
  :host {
    display: block;
    position: relative;
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }
`,No=class extends q{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(t){const e=["menuitem","menuitemcheckbox"],r=t.composedPath(),o=r.find(a=>{var l;return e.includes(((l=a==null?void 0:a.getAttribute)==null?void 0:l.call(a,"role"))||"")});if(!o||r.find(a=>{var l;return((l=a==null?void 0:a.getAttribute)==null?void 0:l.call(a,"role"))==="menu"})!==this)return;const n=o;n.type==="checkbox"&&(n.checked=!n.checked),this.emit("sl-select",{detail:{item:n}})}handleKeyDown(t){if(t.key==="Enter"||t.key===" "){const e=this.getCurrentItem();t.preventDefault(),t.stopPropagation(),e==null||e.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(t.key)){const e=this.getAllItems(),r=this.getCurrentItem();let o=r?e.indexOf(r):0;e.length>0&&(t.preventDefault(),t.stopPropagation(),t.key==="ArrowDown"?o++:t.key==="ArrowUp"?o--:t.key==="Home"?o=0:t.key==="End"&&(o=e.length-1),o<0&&(o=e.length-1),o>e.length-1&&(o=0),this.setCurrentItem(e[o]),e[o].focus())}}handleMouseDown(t){const e=t.target;this.isMenuItem(e)&&this.setCurrentItem(e)}handleSlotChange(){const t=this.getAllItems();t.length>0&&this.setCurrentItem(t[0])}isMenuItem(t){var e;return t.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((e=t.getAttribute("role"))!=null?e:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(t=>!(t.inert||!this.isMenuItem(t)))}getCurrentItem(){return this.getAllItems().find(t=>t.getAttribute("tabindex")==="0")}setCurrentItem(t){this.getAllItems().forEach(r=>{r.setAttribute("tabindex",r===t?"0":"-1")})}render(){return p`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};No.styles=[Q,Sc],u([I("slot")],No.prototype,"defaultSlot",2),No.define("sl-menu");var Ec=R`
  :host {
    --submenu-offset: -2px;

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-2x-small);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item.menu-item--loading {
    outline: none;
    cursor: wait;
  }

  .menu-item.menu-item--loading *:not(sl-spinner) {
    opacity: 0.5;
  }

  .menu-item--loading sl-spinner {
    --indicator-color: currentColor;
    --track-width: 1px;
    position: absolute;
    font-size: 0.75em;
    top: calc(50% - 0.5em);
    left: 0.65rem;
    opacity: 1;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
      var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
      var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
    );
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  sl-popup::part(popup) {
    box-shadow: var(--sl-shadow-large);
    z-index: var(--sl-z-index-dropdown);
    margin-left: var(--submenu-offset);
  }

  .menu-item--rtl sl-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }

  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const It=(t,e)=>{var o;const r=t._$AN;if(r===void 0)return!1;for(const s of r)(o=s._$AO)==null||o.call(s,e,!1),It(s,e);return!0},Pr=t=>{let e,r;do{if((e=t._$AM)===void 0)break;r=e._$AN,r.delete(t),t=e}while((r==null?void 0:r.size)===0)},xi=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(r===void 0)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),Rc(e)}};function Oc(t){this._$AN!==void 0?(Pr(this),this._$AM=t,xi(this)):this._$AM=t}function Tc(t,e=!1,r=0){const o=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(o))for(let i=r;i<o.length;i++)It(o[i],!1),Pr(o[i]);else o!=null&&(It(o,!1),Pr(o));else It(this,t)}const Rc=t=>{t.type==Kr.CHILD&&(t._$AP??(t._$AP=Tc),t._$AQ??(t._$AQ=Oc))};class Lc extends Yr{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,r,o){super._$AT(e,r,o),xi(this),this.isConnected=e._$AU}_$AO(e,r=!0){var o,s;e!==this.isConnected&&(this.isConnected=e,e?(o=this.reconnected)==null||o.call(this):(s=this.disconnected)==null||s.call(this)),r&&(It(this,e),Pr(this))}setValue(e){if(wn(this._$Ct))this._$Ct._$AI(e,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=e,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mc=()=>new zc;class zc{}const Fo=new WeakMap,Dc=Gr(class extends Lc{render(t){return b}update(t,[e]){var o;const r=e!==this.G;return r&&this.G!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.G=e,this.ht=(o=t.options)==null?void 0:o.host,this.rt(this.ct=t.element)),b}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let r=Fo.get(e);r===void 0&&(r=new WeakMap,Fo.set(e,r)),r.get(this.G)!==void 0&&this.G.call(this.ht,void 0),r.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,e;return typeof this.G=="function"?(t=Fo.get(this.ht??globalThis))==null?void 0:t.get(this.G):(e=this.G)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Nc=class{constructor(t,e){this.popupRef=Mc(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=r=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${r.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${r.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=r=>{switch(r.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":r.target!==this.host&&(r.preventDefault(),r.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(r);break}},this.handleClick=r=>{var o;r.target===this.host?(r.preventDefault(),r.stopPropagation()):r.target instanceof Element&&(r.target.tagName==="sl-menu-item"||(o=r.target.role)!=null&&o.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=r=>{r.relatedTarget&&r.relatedTarget instanceof Element&&this.host.contains(r.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=r=>{r.stopPropagation()},this.handlePopupReposition=()=>{const r=this.host.renderRoot.querySelector("slot[name='submenu']"),o=r==null?void 0:r.assignedElements({flatten:!0}).filter(c=>c.localName==="sl-menu")[0],s=getComputedStyle(this.host).direction==="rtl";if(!o)return;const{left:i,top:n,width:a,height:l}=o.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${s?i+a:i}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${n}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${s?i+a:i}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${n+l}px`)},(this.host=t).addController(this),this.hasSlotController=e}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(t){const e=this.host.renderRoot.querySelector("slot[name='submenu']");if(!e){console.error("Cannot activate a submenu if no corresponding menuitem can be found.",this);return}let r=null;for(const o of e.assignedElements())if(r=o.querySelectorAll("sl-menu-item, [role^='menuitem']"),r.length!==0)break;if(!(!r||r.length===0)){r[0].setAttribute("tabindex","0");for(let o=1;o!==r.length;++o)r[o].setAttribute("tabindex","-1");this.popupRef.value&&(t.preventDefault(),t.stopPropagation(),this.popupRef.value.active?r[0]instanceof HTMLElement&&r[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{r[0]instanceof HTMLElement&&r[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(t){this.popupRef.value&&this.popupRef.value.active!==t&&(this.popupRef.value.active=t,this.host.requestUpdate())}enableSubmenu(t=!0){t?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var t;if(!((t=this.host.parentElement)!=null&&t.computedStyleMap))return;const e=this.host.parentElement.computedStyleMap(),o=["padding-top","border-top-width","margin-top"].reduce((s,i)=>{var n;const a=(n=e.get(i))!=null?n:new CSSUnitValue(0,"px"),c=(a instanceof CSSUnitValue?a:new CSSUnitValue(0,"px")).to("px");return s-c.value},0);this.skidding=o}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){const t=getComputedStyle(this.host).direction==="rtl";return this.isConnected?p`
      <sl-popup
        ${Dc(this.popupRef)}
        placement=${t?"left-start":"right-start"}
        anchor="anchor"
        flip
        flip-fallback-strategy="best-fit"
        skidding="${this.skidding}"
        strategy="fixed"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot name="submenu"></slot>
      </sl-popup>
    `:p` <slot name="submenu" hidden></slot> `}},Fc=R`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`,Io=class extends q{constructor(){super(...arguments),this.localize=new be(this)}render(){return p`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};Io.styles=[Q,Fc];var ne=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new go(this,"submenu"),this.submenuController=new Nc(this,this.hasSlotController),this.handleHostClick=t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())},this.handleMouseOver=t=>{this.focus(),t.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){const t=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=t;return}t!==this.cachedTextLabel&&(this.cachedTextLabel=t,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return La(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){const t=this.localize.dir()==="rtl",e=this.submenuController.isExpanded();return p`
      <div
        id="anchor"
        part="base"
        class=${ve({"menu-item":!0,"menu-item--rtl":t,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":e})}
        ?aria-haspopup="${this.isSubmenu()}"
        ?aria-expanded="${!!e}"
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <sl-icon name=${t?"chevron-left":"chevron-right"} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading?p` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:""}
      </div>
    `}};ne.styles=[Q,Ec],ne.dependencies={"sl-icon":ee,"sl-popup":M,"sl-spinner":Io},u([I("slot:not([name])")],ne.prototype,"defaultSlot",2),u([I(".menu-item")],ne.prototype,"menuItem",2),u([h()],ne.prototype,"type",2),u([h({type:Boolean,reflect:!0})],ne.prototype,"checked",2),u([h()],ne.prototype,"value",2),u([h({type:Boolean,reflect:!0})],ne.prototype,"loading",2),u([h({type:Boolean,reflect:!0})],ne.prototype,"disabled",2),u([G("checked")],ne.prototype,"handleCheckedChange",1),u([G("disabled")],ne.prototype,"handleDisabledChange",1),u([G("type")],ne.prototype,"handleTypeChange",1),ne.define("sl-menu-item");var Bt=new WeakMap,jt=new WeakMap,Ht=new WeakMap,Bo=new WeakSet,Ar=new WeakMap,Ic=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),s=this.options.name(this.host),i=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!n&&typeof s=="string"&&s.length>0&&typeof i<"u"&&(Array.isArray(i)?i.forEach(a=>{r.formData.append(s,a.toString())}):r.formData.append(s,i.toString()))},this.handleFormSubmit=r=>{var o;const s=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=Bt.get(this.form))==null||o.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!s&&!i(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Ar.set(this.host,[])},this.handleInteraction=r=>{const o=Ar.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=Te({form:r=>{const o=r.form;if(o){const i=r.getRootNode().querySelector(`#${o}`);if(i)return i}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),Ar.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Ar.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,Bt.has(this.form)?Bt.get(this.form).add(this.host):Bt.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),jt.has(this.form)||(jt.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Ht.has(this.form)||(Ht.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=Bt.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),jt.has(this.form)&&(this.form.reportValidity=jt.get(this.form),jt.delete(this.form)),Ht.has(this.form)&&(this.form.checkValidity=Ht.get(this.form),Ht.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Bo.add(t):Bo.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!Bo.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t==null||t.preventDefault()}},jo=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(xt(Te({},jo),{valid:!1,valueMissing:!0})),Object.freeze(xt(Te({},jo),{valid:!1,customError:!0}));var Bc=R`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host([data-sl-button-group__button--first]:not([data-sl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-sl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-sl-button-group__button--last]:not([data-sl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-sl-button-group__button]:not([data-sl-button-group__button--first])) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-sl-button-group__button]:not(
          [data-sl-button-group__button--first],
          [data-sl-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-sl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-sl-button-group__button--focus]),
  :host([data-sl-button-group__button][checked]) {
    z-index: 2;
  }
`,z=class extends q{constructor(){super(...arguments),this.formControlController=new Ic(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new go(this,"[default]","prefix","suffix"),this.localize=new be(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:jo}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?Qt`a`:Qt`button`;return er`
      <${e}
        part="base"
        class=${ve({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${B(t?void 0:this.disabled)}
        type=${B(t?void 0:this.type)}
        title=${this.title}
        name=${B(t?void 0:this.name)}
        value=${B(t?void 0:this.value)}
        href=${B(t&&!this.disabled?this.href:void 0)}
        target=${B(t?this.target:void 0)}
        download=${B(t?this.download:void 0)}
        rel=${B(t?this.rel:void 0)}
        role=${B(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret?er` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?er`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};z.styles=[Q,Bc],z.dependencies={"sl-icon":ee,"sl-spinner":Io},u([I(".button")],z.prototype,"button",2),u([T()],z.prototype,"hasFocus",2),u([T()],z.prototype,"invalid",2),u([h()],z.prototype,"title",2),u([h({reflect:!0})],z.prototype,"variant",2),u([h({reflect:!0})],z.prototype,"size",2),u([h({type:Boolean,reflect:!0})],z.prototype,"caret",2),u([h({type:Boolean,reflect:!0})],z.prototype,"disabled",2),u([h({type:Boolean,reflect:!0})],z.prototype,"loading",2),u([h({type:Boolean,reflect:!0})],z.prototype,"outline",2),u([h({type:Boolean,reflect:!0})],z.prototype,"pill",2),u([h({type:Boolean,reflect:!0})],z.prototype,"circle",2),u([h()],z.prototype,"type",2),u([h()],z.prototype,"name",2),u([h()],z.prototype,"value",2),u([h()],z.prototype,"href",2),u([h()],z.prototype,"target",2),u([h()],z.prototype,"rel",2),u([h()],z.prototype,"download",2),u([h()],z.prototype,"form",2),u([h({attribute:"formaction"})],z.prototype,"formAction",2),u([h({attribute:"formenctype"})],z.prototype,"formEnctype",2),u([h({attribute:"formmethod"})],z.prototype,"formMethod",2),u([h({attribute:"formnovalidate",type:Boolean})],z.prototype,"formNoValidate",2),u([h({attribute:"formtarget"})],z.prototype,"formTarget",2),u([G("disabled",{waitUntilFirstUpdate:!0})],z.prototype,"handleDisabledChange",1),z.define("sl-button");const jc=R`
  :host {
    display: inline-block;
    margin: 0.5rem 0;
  }
  .selector {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  button {
    cursor: pointer;
    background: var(--card-background-color);
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
    padding: 0.3rem 0.6rem;
    font-family: var(--font-stack-bold);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--font-color-sub1);
    transition: color 0.15s, border-color 0.15s;
  }
  button:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
  sl-button::part(base) {
    border: 1px solid var(--primary-color);
    border-radius: 0;
    font-family: var(--font-stack);
    background-color: var(--background-color);
    color: var(--primary-color);
    min-height: 20px;
    max-height: 20px;
    min-width: 150px;
    max-width: 220px;
  }
  sl-button::part(label) {
    line-height: 17px;
    font-size: 0.7rem;
    overflow-x: hidden;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  sl-menu {
    border: 1px solid var(--primary-color);
    border-radius: 0;
  }
  sl-menu-item::part(base) {
    color: var(--primary-color);
    font-family: var(--font-stack);
    line-height: 17px;
    font-size: 0.7rem;
    --sl-color-neutral-100: var(--secondary-color-lowalpha);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;var Hc=Object.defineProperty,Uc=Object.getOwnPropertyDescriptor,Ut=(t,e,r,o)=>{for(var s=o>1?void 0:o?Uc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Hc(e,r,s),s};d.PpExampleSelector=class extends F{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.entries=[]}willUpdate(e){(e.has("examplesData")||e.has("mockJson")||e.has("examplesJson"))&&this.buildEntries()}buildEntries(){const e=[];let r=this.mockJson,o={};if(this.examplesData)try{const s=JSON.parse(this.examplesData);s.mockJson&&(r=s.mockJson),s.examples&&(o=s.examples)}catch{}if(this.examplesJson)try{o={...o,...JSON.parse(this.examplesJson)}}catch{}for(const[s,i]of Object.entries(o))i&&e.push({key:s,json:i});r&&e.push({key:"Generated Example",json:r}),this.entries=e}showExample(e){let r=e.json;try{r=JSON.stringify(JSON.parse(e.json),null,2)}catch{}const o=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:e.key,json:r}});document.dispatchEvent(o)}handleSelect(e){var s,i;const r=(i=(s=e.detail)==null?void 0:s.item)==null?void 0:i.value;if(r===void 0)return;const o=parseInt(r,10);o>=0&&o<this.entries.length&&this.showExample(this.entries[o])}render(){if(!this.entries.length)return b;if(this.entries.length===1){const e=this.entries[0];return p`
        <div class="selector">
          <button @click=${()=>this.showExample(e)}>${e.key}</button>
        </div>
      `}return p`
      <div class="selector">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>View Example...</sl-button>
          <sl-menu @sl-select=${this.handleSelect}>
            ${this.entries.map((e,r)=>p`
              <sl-menu-item value="${r}">${e.key}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `}},d.PpExampleSelector.styles=jc,Ut([h({attribute:"examples-data"})],d.PpExampleSelector.prototype,"examplesData",2),Ut([h({attribute:"mock-json"})],d.PpExampleSelector.prototype,"mockJson",2),Ut([h({attribute:"examples-json"})],d.PpExampleSelector.prototype,"examplesJson",2),Ut([T()],d.PpExampleSelector.prototype,"entries",2),d.PpExampleSelector=Ut([H("pp-example-selector")],d.PpExampleSelector);const Vc=R`
    :host {
        display: inline-block;
    }

    sl-button::part(base) {
        font-family: var(--font-stack), monospace;
        padding: var(--global-padding);
        font-size: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
`,Jc=R`
    sl-tooltip::part(base){
        font-family: var(--font-stack), monospace;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }


    sl-tooltip::part(body){
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        background-color: var(--background-color);
        color: var(--font-color);
        border: 1px dashed var(--secondary-color);
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    sl-tooltip::part(base__arrow){
        background-color: var(--secondary-color);
    }
`;var qc=Object.defineProperty,Wc=Object.getOwnPropertyDescriptor,Ie=(t,e,r,o)=>{for(var s=o>1?void 0:o?Wc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&qc(e,r,s),s};d.PpRawViewerBtn=class extends F{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml="",this.highlightLines="",this.startLine=1,this.location="",this.showTextLabel=!1}showRaw(){const e=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0}});document.dispatchEvent(e)}render(){return!this.rawJson&&!this.rawYaml?b:p`
            <sl-tooltip content="VIEW RAW OBJECT">
                <sl-button variant="text" size="small" @click=${this.showRaw}>
                    <sl-icon slot="prefix" name="braces" label="VIEW RAW OBJECT" ></sl-icon>
                </sl-button>
            </sl-tooltip>`}},d.PpRawViewerBtn.styles=[Vc,Jc],Ie([h({attribute:"title"})],d.PpRawViewerBtn.prototype,"btnTitle",2),Ie([h({attribute:"raw-json"})],d.PpRawViewerBtn.prototype,"rawJson",2),Ie([h({attribute:"raw-yaml"})],d.PpRawViewerBtn.prototype,"rawYaml",2),Ie([h({attribute:"highlight-lines"})],d.PpRawViewerBtn.prototype,"highlightLines",2),Ie([h({attribute:"start-line",type:Number})],d.PpRawViewerBtn.prototype,"startLine",2),Ie([h()],d.PpRawViewerBtn.prototype,"location",2),Ie([h({type:Boolean})],d.PpRawViewerBtn.prototype,"showTextLabel",2),d.PpRawViewerBtn=Ie([H("pp-raw-viewer-btn")],d.PpRawViewerBtn);const Kc=R`
    :host {
        display: block;
    }

    .ext-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0 var(--global-padding-double);
    }
    
    .ext-value,
    .ext-key {
        padding: var(--global-padding-double) 0;
    }
    
    .ext-value {
        border-bottom: 1px dashed var(--hrcolor);
    }

    .ext-key:last-of-type,
    .ext-value:last-of-type {
        border-bottom: none;
    }

    .ext-key {
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        text-align: right;
        white-space: nowrap;
    }

    .ext-scalar {
        font-family: var(--font-stack), monospace;
        color: var(--font-color);
    }
`;var Gc=Object.defineProperty,Yc=Object.getOwnPropertyDescriptor,Ho=(t,e,r,o)=>{for(var s=o>1?void 0:o?Yc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Gc(e,r,s),s};d.PpExtensions=class extends F{constructor(){super(...arguments),this.extensionsJson="",this.extensions=[]}willUpdate(e){if(e.has("extensionsJson"))if(this.extensionsJson)try{this.extensions=JSON.parse(this.extensionsJson)}catch{this.extensions=[]}else this.extensions=[]}renderValue(e){return e==null?b:typeof e=="object"?p`<pp-code-viewer code=${JSON.stringify(e,null,2)} language="json"></pp-code-viewer>`:p`<span class="ext-scalar">${String(e)}</span>`}render(){return this.extensions.length?p`<div class="ext-grid">
      ${this.extensions.map(e=>p`
        <div class="ext-key">${e.key}</div>
        <div class="ext-value">${this.renderValue(e.value)}</div>
      `)}
    </div>`:b}},d.PpExtensions.styles=Kc,Ho([h({attribute:"extensions-json"})],d.PpExtensions.prototype,"extensionsJson",2),Ho([T()],d.PpExtensions.prototype,"extensions",2),d.PpExtensions=Ho([H("pp-extensions")],d.PpExtensions),Ur("static/shoelace");const Xc={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',braces:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/></svg>',envelope:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>',"question-diamond":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>',cookie:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/><path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/></svg>',signpost:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M12.532 5l1.666 2-1.666 2H2V5z"/></svg>'};return rn("default",{resolver:t=>{const e=Xc[t];return e?`data:image/svg+xml,${encodeURIComponent(e)}`:`static/shoelace/assets/icons/${t}.svg`}}),Object.defineProperty(d,Symbol.toStringTag,{value:"Module"}),d})({});
