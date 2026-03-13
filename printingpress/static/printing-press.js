var PrintingPress=(function(u){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var si,ni;const he=globalThis,Fe=he.ShadowRoot&&(he.ShadyCSS===void 0||he.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ve=Symbol(),Ro=new WeakMap;let zo=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==Ve)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(Fe&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=Ro.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Ro.set(o,t))}return t}toString(){return this.cssText}};const ci=e=>new zo(typeof e=="string"?e:e+"",void 0,Ve),S=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((r,i,s)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new zo(o,e,Ve)},hi=(e,t)=>{if(Fe)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const r=document.createElement("style"),i=he.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},Lo=Fe?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return ci(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:di,defineProperty:pi,getOwnPropertyDescriptor:ui,getOwnPropertyNames:fi,getOwnPropertySymbols:gi,getPrototypeOf:mi}=Object,it=globalThis,No=it.trustedTypes,vi=No?No.emptyScript:"",We=it.reactiveElementPolyfillSupport,qt=(e,t)=>e,de={toAttribute(e,t){switch(t){case Boolean:e=e?vi:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},qe=(e,t)=>!di(e,t),Do={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:qe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),it.litPropertyMetadata??(it.litPropertyMetadata=new WeakMap);let Mt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Do){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&pi(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){const{get:i,set:s}=ui(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:i,set(n){const a=i==null?void 0:i.call(this);s==null||s.call(this,n),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Do}static _$Ei(){if(this.hasOwnProperty(qt("elementProperties")))return;const t=mi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(qt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(qt("properties"))){const o=this.properties,r=[...fi(o),...gi(o)];for(const i of r)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)o.unshift(Lo(i))}else t!==void 0&&o.push(Lo(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(o=>this.enableUpdating=o),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(o=>o(this))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return hi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)})}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:de).toAttribute(o,r.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,o){var s,n;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=r.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:de;this._$Em=i;const c=l.fromAttribute(o,a.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(t,o,r,i=!1,s){var n;if(t!==void 0){const a=this.constructor;if(i===!1&&(s=this[t]),r??(r=a.getPropertyOptions(t)),!((r.hasChanged??qe)(s,o)||r.useDefault&&r.reflect&&s===((n=this._$Ej)==null?void 0:n.get(t))&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};Mt.elementStyles=[],Mt.shadowRootOptions={mode:"open"},Mt[qt("elementProperties")]=new Map,Mt[qt("finalized")]=new Map,We==null||We({ReactiveElement:Mt}),(it.reactiveElementVersions??(it.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt=globalThis,Bo=e=>e,pe=Jt.trustedTypes,Uo=pe?pe.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ho="$lit$",st=`lit$${Math.random().toFixed(9).slice(2)}$`,jo="?"+st,yi=`<${jo}>`,mt=document,Gt=()=>mt.createComment(""),Yt=e=>e===null||typeof e!="object"&&typeof e!="function",Je=Array.isArray,bi=e=>Je(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ge=`[ 	
\f\r]`,Xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Io=/-->/g,Fo=/>/g,vt=RegExp(`>|${Ge}(?:([^\\s"'>=/]+)(${Ge}*=${Ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vo=/'/g,Wo=/"/g,qo=/^(?:script|style|textarea|title)$/i,wi=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),y=wi(1),yt=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),Jo=new WeakMap,bt=mt.createTreeWalker(mt,129);function Go(e,t){if(!Je(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Uo!==void 0?Uo.createHTML(t):t}const $i=(e,t)=>{const o=e.length-1,r=[];let i,s=t===2?"<svg>":t===3?"<math>":"",n=Xt;for(let a=0;a<o;a++){const l=e[a];let c,h,d=-1,f=0;for(;f<l.length&&(n.lastIndex=f,h=n.exec(l),h!==null);)f=n.lastIndex,n===Xt?h[1]==="!--"?n=Io:h[1]!==void 0?n=Fo:h[2]!==void 0?(qo.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=vt):h[3]!==void 0&&(n=vt):n===vt?h[0]===">"?(n=i??Xt,d=-1):h[1]===void 0?d=-2:(d=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?vt:h[3]==='"'?Wo:Vo):n===Wo||n===Vo?n=vt:n===Io||n===Fo?n=Xt:(n=vt,i=void 0);const p=n===vt&&e[a+1].startsWith("/>")?" ":"";s+=n===Xt?l+yi:d>=0?(r.push(c),l.slice(0,d)+Ho+l.slice(d)+st+p):l+st+(d===-2?a:p)}return[Go(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let Ye=class ai{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,h]=$i(t,o);if(this.el=ai.createElement(c,r),bt.currentNode=this.el.content,o===2||o===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=bt.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Ho)){const f=h[n++],p=i.getAttribute(d).split(st),v=/([.?@])?(.*)/.exec(f);l.push({type:1,index:s,name:v[2],strings:p,ctor:v[1]==="."?xi:v[1]==="?"?Pi:v[1]==="@"?Ai:ue}),i.removeAttribute(d)}else d.startsWith(st)&&(l.push({type:6,index:s}),i.removeAttribute(d));if(qo.test(i.tagName)){const d=i.textContent.split(st),f=d.length-1;if(f>0){i.textContent=pe?pe.emptyScript:"";for(let p=0;p<f;p++)i.append(d[p],Gt()),bt.nextNode(),l.push({type:2,index:++s});i.append(d[f],Gt())}}}else if(i.nodeType===8)if(i.data===jo)l.push({type:2,index:s});else{let d=-1;for(;(d=i.data.indexOf(st,d+1))!==-1;)l.push({type:7,index:s}),d+=st.length-1}s++}}static createElement(t,o){const r=mt.createElement("template");return r.innerHTML=t,r}};function Rt(e,t,o=e,r){var n,a;if(t===yt)return t;let i=r!==void 0?(n=o._$Co)==null?void 0:n[r]:o._$Cl;const s=Yt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=Rt(e,i._$AS(e,t.values),i,r)),t}let _i=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??mt).importNode(o,!0);bt.currentNode=i;let s=bt.nextNode(),n=0,a=0,l=r[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Xe(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Ci(s,this,t)),this._$AV.push(c),l=r[++a]}n!==(l==null?void 0:l.index)&&(s=bt.nextNode(),n++)}return bt.currentNode=mt,i}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},Xe=class li{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Rt(this,t,o),Yt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==yt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):bi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&Yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(mt.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Ye.createElement(Go(r.h,r.h[0]),this.options)),r);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(o);else{const n=new _i(i,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(t){let o=Jo.get(t.strings);return o===void 0&&Jo.set(t.strings,o=new Ye(t)),o}k(t){Je(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,i=0;for(const s of t)i===o.length?o.push(r=new li(this.O(Gt()),this.O(Gt()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const i=Bo(t).nextSibling;Bo(t).remove(),t=i}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}},ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=w}_$AI(t,o=this,r,i){const s=this.strings;let n=!1;if(s===void 0)t=Rt(this,t,o,0),n=!Yt(t)||t!==this._$AH&&t!==yt,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Rt(this,a[r+l],o,l),c===yt&&(c=this._$AH[l]),n||(n=!Yt(c)||c!==this._$AH[l]),c===w?t=w:t!==w&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},xi=class extends ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},Pi=class extends ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},Ai=class extends ue{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=Rt(this,t,o,0)??w)===yt)return;const r=this._$AH,i=t===w&&r!==w||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==w&&(r===w||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}};class Ci{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Rt(this,t)}}const Ke=Jt.litHtmlPolyfillSupport;Ke==null||Ke(Ye,Xe),(Jt.litHtmlVersions??(Jt.litHtmlVersions=[])).push("3.3.2");const Si=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const s=(o==null?void 0:o.renderBefore)??null;r._$litPart$=i=new Xe(t.insertBefore(Gt(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis;let T=class extends Mt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Si(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return yt}};T._$litElement$=!0,T.finalized=!0,(si=wt.litElementHydrateSupport)==null||si.call(wt,{LitElement:T});const Ze=wt.litElementPolyfillSupport;Ze==null||Ze({LitElement:T}),(wt.litElementVersions??(wt.litElementVersions=[])).push("4.2.2");var Ei=S`
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
`,Oi=S`
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
`,Qe="";function to(e){Qe=e}function ki(e=""){if(!Qe){const t=[...document.getElementsByTagName("script")],o=t.find(r=>r.hasAttribute("data-shoelace"));if(o)to(o.getAttribute("data-shoelace"));else{const r=t.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";r&&(i=r.getAttribute("src")),to(i.split("/").slice(0,-1).join("/"))}}return Qe.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Ti={name:"default",resolver:e=>ki(`assets/icons/${e}.svg`)},Mi=Ti,Yo={caret:`
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
  `},Ri={name:"system",resolver:e=>e in Yo?`data:image/svg+xml,${encodeURIComponent(Yo[e])}`:""},zi=Ri,fe=[Mi,zi],ge=[];function Li(e){ge.push(e)}function Ni(e){ge=ge.filter(t=>t!==e)}function Xo(e){return fe.find(t=>t.name===e)}function Di(e,t){Bi(e),fe.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),ge.forEach(o=>{o.library===e&&o.setIcon()})}function Bi(e){fe=fe.filter(t=>t.name!==e)}var Ui=S`
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
`,Ko=Object.defineProperty,Hi=Object.defineProperties,ji=Object.getOwnPropertyDescriptor,Ii=Object.getOwnPropertyDescriptors,Zo=Object.getOwnPropertySymbols,Fi=Object.prototype.hasOwnProperty,Vi=Object.prototype.propertyIsEnumerable,Qo=e=>{throw TypeError(e)},tr=(e,t,o)=>t in e?Ko(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,me=(e,t)=>{for(var o in t||(t={}))Fi.call(t,o)&&tr(e,o,t[o]);if(Zo)for(var o of Zo(t))Vi.call(t,o)&&tr(e,o,t[o]);return e},er=(e,t)=>Hi(e,Ii(t)),m=(e,t,o,r)=>{for(var i=r>1?void 0:r?ji(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&Ko(t,o,i),i},or=(e,t,o)=>t.has(e)||Qo("Cannot "+o),Wi=(e,t,o)=>(or(e,t,"read from private field"),t.get(e)),qi=(e,t,o)=>t.has(e)?Qo("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),Ji=(e,t,o,r)=>(or(e,t,"write to private field"),t.set(e,o),o);function nt(e,t){const o=me({waitUntilFirstUpdate:!1},t);return(r,i)=>{const{update:s}=r,n=Array.isArray(e)?e:[e];r.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const h=a.get(c),d=this[c];h!==d&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[i](h,d)}}),s.call(this,a)}}}var zt=S`
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
 */const j=e=>(t,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gi={attribute:!0,type:String,converter:de,reflect:!1,hasChanged:qe},Yi=(e=Gi,t,o)=>{const{kind:r,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),r==="accessor"){const{name:n}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(r==="setter"){const{name:n}=o;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e,!0,a)}}throw Error("Unsupported decorator location: "+r)};function g(e){return(t,o)=>typeof o=="object"?Yi(e,t,o):((r,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),n?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function L(e){return g({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xi=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $t(e,t){return(o,r,i)=>{const s=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(e))??null};return Xi(o,r,{get(){return s(this)}})}}var ve,J=class extends T{constructor(){super(),qi(this,ve,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const o=new CustomEvent(e,me({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const r=customElements.get(e);if(!r){try{customElements.define(e,t,o)}catch{customElements.define(e,class extends t{},o)}return}let i=" (unknown version)",s=i;"version"in t&&t.version&&(i=" v"+t.version),"version"in r&&r.version&&(s=" v"+r.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,o){Wi(this,ve)||(this.constructor.elementProperties.forEach((r,i)=>{r.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Ji(this,ve,!0)),super.attributeChangedCallback(e,t,o)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,o)=>{e.has(o)&&this[o]==null&&(this[o]=t)})}};ve=new WeakMap,J.version="2.20.1",J.dependencies={},m([g()],J.prototype,"dir",2),m([g()],J.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ki=(e,t)=>(e==null?void 0:e._$litType$)!==void 0;var Kt=Symbol(),ye=Symbol(),eo,oo=new Map,G=class extends J{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var o;let r;if(t!=null&&t.spriteSheet)return this.svg=y`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(r=await fetch(e,{mode:"cors"}),!r.ok)return r.status===410?Kt:ye}catch{return ye}try{const i=document.createElement("div");i.innerHTML=await r.text();const s=i.firstElementChild;if(((o=s==null?void 0:s.tagName)==null?void 0:o.toLowerCase())!=="svg")return Kt;eo||(eo=new DOMParser);const a=eo.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Kt}catch{return Kt}}connectedCallback(){super.connectedCallback(),Li(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Ni(this)}getIconSource(){const e=Xo(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:o}=this.getIconSource(),r=o?Xo(this.library):void 0;if(!t){this.svg=null;return}let i=oo.get(t);if(i||(i=this.resolveIcon(t,r),oo.set(t,i)),!this.initialRender)return;const s=await i;if(s===ye&&oo.delete(t),t===this.getIconSource().url){if(Ki(s)){if(this.svg=s,r){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&n&&r.mutator(n)}return}switch(s){case ye:case Kt:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(e=r==null?void 0:r.mutator)==null||e.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};G.styles=[zt,Ui],m([L()],G.prototype,"svg",2),m([g({reflect:!0})],G.prototype,"name",2),m([g()],G.prototype,"src",2),m([g()],G.prototype,"label",2),m([g({reflect:!0})],G.prototype,"library",2),m([nt("label")],G.prototype,"handleLabelChange",1),m([nt(["name","src","library"])],G.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zi={ATTRIBUTE:1},Qi=e=>(...t)=>({_$litDirective$:e,values:t});let ts=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=Qi(class extends ts{constructor(e){var t;if(super(e),e.type!==Zi.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in t)t[s]&&!((r=this.nt)!=null&&r.has(s))&&this.st.add(s);return this.render(t)}const o=e.element.classList;for(const s of this.st)s in t||(o.remove(s),this.st.delete(s));for(const s in t){const n=!!t[s];n===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(n?(o.add(s),this.st.add(s)):(o.remove(s),this.st.delete(s)))}return yt}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rr=Symbol.for(""),es=e=>{if((e==null?void 0:e.r)===rr)return e==null?void 0:e._$litStatic$},ir=(e,...t)=>({_$litStatic$:t.reduce((o,r,i)=>o+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+e[i+1],e[0]),r:rr}),sr=new Map,os=e=>(t,...o)=>{const r=o.length;let i,s;const n=[],a=[];let l,c=0,h=!1;for(;c<r;){for(l=t[c];c<r&&(s=o[c],(i=es(s))!==void 0);)l+=i+t[++c],h=!0;c!==r&&a.push(s),n.push(l),c++}if(c===r&&n.push(t[r]),h){const d=n.join("$$lit$$");(t=sr.get(d))===void 0&&(n.raw=n,sr.set(d,t=n)),o=a}return e(t,...o)},rs=os(y);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=e=>e??w;var N=class extends J{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?ir`a`:ir`button`;return rs`
      <${t}
        part="base"
        class=${Zt({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${I(e?void 0:this.disabled)}
        type=${I(e?void 0:"button")}
        href=${I(e?this.href:void 0)}
        target=${I(e?this.target:void 0)}
        download=${I(e?this.download:void 0)}
        rel=${I(e&&this.target?"noreferrer noopener":void 0)}
        role=${I(e?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${I(this.name)}
          library=${I(this.library)}
          src=${I(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};N.styles=[zt,Oi],N.dependencies={"sl-icon":G},m([$t(".icon-button")],N.prototype,"button",2),m([L()],N.prototype,"hasFocus",2),m([g()],N.prototype,"name",2),m([g()],N.prototype,"library",2),m([g()],N.prototype,"src",2),m([g()],N.prototype,"href",2),m([g()],N.prototype,"target",2),m([g()],N.prototype,"download",2),m([g()],N.prototype,"label",2),m([g({type:Boolean,reflect:!0})],N.prototype,"disabled",2);const ro=new Set,Lt=new Map;let _t,io="ltr",so="en";const nr=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(nr){const e=new MutationObserver(lr);io=document.documentElement.dir||"ltr",so=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function ar(...e){e.map(t=>{const o=t.$code.toLowerCase();Lt.has(o)?Lt.set(o,Object.assign(Object.assign({},Lt.get(o)),t)):Lt.set(o,t),_t||(_t=t)}),lr()}function lr(){nr&&(io=document.documentElement.dir||"ltr",so=document.documentElement.lang||navigator.language),[...ro.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let is=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){ro.add(this.host)}hostDisconnected(){ro.delete(this.host)}dir(){return`${this.host.dir||io}`.toLowerCase()}lang(){return`${this.host.lang||so}`.toLowerCase()}getTranslationData(t){var o,r;const i=new Intl.Locale(t.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),n=(r=(o=i==null?void 0:i.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",a=Lt.get(`${s}-${n}`),l=Lt.get(s);return{locale:i,language:s,region:n,primary:a,secondary:l}}exists(t,o){var r;const{primary:i,secondary:s}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[t]||s&&s[t]||o.includeFallback&&_t&&_t[t])}term(t,...o){const{primary:r,secondary:i}=this.getTranslationData(this.lang());let s;if(r&&r[t])s=r[t];else if(i&&i[t])s=i[t];else if(_t&&_t[t])s=_t[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...o):s}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var cr={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};ar(cr);var ss=cr,be=class extends is{};ar(ss);var xt=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return y`
      <span
        part="base"
        class=${Zt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?y`
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
    `}};xt.styles=[zt,Ei],xt.dependencies={"sl-icon-button":N},m([g({reflect:!0})],xt.prototype,"variant",2),m([g({reflect:!0})],xt.prototype,"size",2),m([g({type:Boolean,reflect:!0})],xt.prototype,"pill",2),m([g({type:Boolean})],xt.prototype,"removable",2),xt.define("sl-tag"),N.define("sl-icon-button");var ns=S`
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
`,as=S`
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
`;const at=Math.min,D=Math.max,we=Math.round,$e=Math.floor,Y=e=>({x:e,y:e}),ls={left:"right",right:"left",bottom:"top",top:"bottom"};function no(e,t,o){return D(e,at(t,o))}function Nt(e,t){return typeof e=="function"?e(t):e}function lt(e){return e.split("-")[0]}function Dt(e){return e.split("-")[1]}function hr(e){return e==="x"?"y":"x"}function ao(e){return e==="y"?"height":"width"}function Q(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function lo(e){return hr(Q(e))}function cs(e,t,o){o===void 0&&(o=!1);const r=Dt(e),i=lo(e),s=ao(i);let n=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(n=_e(n)),[n,_e(n)]}function hs(e){const t=_e(e);return[co(e),t,co(t)]}function co(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const dr=["left","right"],pr=["right","left"],ds=["top","bottom"],ps=["bottom","top"];function us(e,t,o){switch(e){case"top":case"bottom":return o?t?pr:dr:t?dr:pr;case"left":case"right":return t?ds:ps;default:return[]}}function fs(e,t,o,r){const i=Dt(e);let s=us(lt(e),o==="start",r);return i&&(s=s.map(n=>n+"-"+i),t&&(s=s.concat(s.map(co)))),s}function _e(e){const t=lt(e);return ls[t]+e.slice(t.length)}function gs(e){return{top:0,right:0,bottom:0,left:0,...e}}function ur(e){return typeof e!="number"?gs(e):{top:e,right:e,bottom:e,left:e}}function xe(e){const{x:t,y:o,width:r,height:i}=e;return{width:r,height:i,top:o,left:t,right:t+r,bottom:o+i,x:t,y:o}}function fr(e,t,o){let{reference:r,floating:i}=e;const s=Q(t),n=lo(t),a=ao(n),l=lt(t),c=s==="y",h=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[a]/2-i[a]/2;let p;switch(l){case"top":p={x:h,y:r.y-i.height};break;case"bottom":p={x:h,y:r.y+r.height};break;case"right":p={x:r.x+r.width,y:d};break;case"left":p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(Dt(t)){case"start":p[n]-=f*(o&&c?-1:1);break;case"end":p[n]+=f*(o&&c?-1:1);break}return p}async function ms(e,t){var o;t===void 0&&(t={});const{x:r,y:i,platform:s,rects:n,elements:a,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:f=!1,padding:p=0}=Nt(t,e),v=ur(p),_=a[f?d==="floating"?"reference":"floating":d],$=xe(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(_)))==null||o?_:_.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:h,strategy:l})),x=d==="floating"?{x:r,y:i,width:n.floating.width,height:n.floating.height}:n.reference,P=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),C=await(s.isElement==null?void 0:s.isElement(P))?await(s.getScale==null?void 0:s.getScale(P))||{x:1,y:1}:{x:1,y:1},M=xe(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:P,strategy:l}):x);return{top:($.top-M.top+v.top)/C.y,bottom:(M.bottom-$.bottom+v.bottom)/C.y,left:($.left-M.left+v.left)/C.x,right:(M.right-$.right+v.right)/C.x}}const vs=50,ys=async(e,t,o)=>{const{placement:r="bottom",strategy:i="absolute",middleware:s=[],platform:n}=o,a=n.detectOverflow?n:{...n,detectOverflow:ms},l=await(n.isRTL==null?void 0:n.isRTL(t));let c=await n.getElementRects({reference:e,floating:t,strategy:i}),{x:h,y:d}=fr(c,r,l),f=r,p=0;const v={};for(let b=0;b<s.length;b++){const _=s[b];if(!_)continue;const{name:$,fn:x}=_,{x:P,y:C,data:M,reset:E}=await x({x:h,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:v,rects:c,platform:a,elements:{reference:e,floating:t}});h=P??h,d=C??d,v[$]={...v[$],...M},E&&p<vs&&(p++,typeof E=="object"&&(E.placement&&(f=E.placement),E.rects&&(c=E.rects===!0?await n.getElementRects({reference:e,floating:t,strategy:i}):E.rects),{x:h,y:d}=fr(c,f,l)),b=-1)}return{x:h,y:d,placement:f,strategy:i,middlewareData:v}},bs=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:i,rects:s,platform:n,elements:a,middlewareData:l}=t,{element:c,padding:h=0}=Nt(e,t)||{};if(c==null)return{};const d=ur(h),f={x:o,y:r},p=lo(i),v=ao(p),b=await n.getDimensions(c),_=p==="y",$=_?"top":"left",x=_?"bottom":"right",P=_?"clientHeight":"clientWidth",C=s.reference[v]+s.reference[p]-f[p]-s.floating[v],M=f[p]-s.reference[p],E=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let R=E?E[P]:0;(!R||!await(n.isElement==null?void 0:n.isElement(E)))&&(R=a.floating[P]||s.floating[v]);const ot=C/2-M/2,K=R/2-b[v]/2-1,H=at(d[$],K),ut=at(d[x],K),Z=H,ft=R-b[v]-ut,z=R/2-b[v]/2+ot,Tt=no(Z,z,ft),rt=!l.arrow&&Dt(i)!=null&&z!==Tt&&s.reference[v]/2-(z<Z?H:ut)-b[v]/2<0,W=rt?z<Z?z-Z:z-ft:0;return{[p]:f[p]+W,data:{[p]:Tt,centerOffset:z-Tt-W,...rt&&{alignmentOffset:W}},reset:rt}}}),ws=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:i,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:c}=t,{mainAxis:h=!0,crossAxis:d=!0,fallbackPlacements:f,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:b=!0,..._}=Nt(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const $=lt(i),x=Q(a),P=lt(a)===a,C=await(l.isRTL==null?void 0:l.isRTL(c.floating)),M=f||(P||!b?[_e(a)]:hs(a)),E=v!=="none";!f&&E&&M.push(...fs(a,b,v,C));const R=[a,...M],ot=await l.detectOverflow(t,_),K=[];let H=((r=s.flip)==null?void 0:r.overflows)||[];if(h&&K.push(ot[$]),d){const z=cs(i,n,C);K.push(ot[z[0]],ot[z[1]])}if(H=[...H,{placement:i,overflows:K}],!K.every(z=>z<=0)){var ut,Z;const z=(((ut=s.flip)==null?void 0:ut.index)||0)+1,Tt=R[z];if(Tt&&(!(d==="alignment"?x!==Q(Tt):!1)||H.every(q=>Q(q.placement)===x?q.overflows[0]>0:!0)))return{data:{index:z,overflows:H},reset:{placement:Tt}};let rt=(Z=H.filter(W=>W.overflows[0]<=0).sort((W,q)=>W.overflows[1]-q.overflows[1])[0])==null?void 0:Z.placement;if(!rt)switch(p){case"bestFit":{var ft;const W=(ft=H.filter(q=>{if(E){const gt=Q(q.placement);return gt===x||gt==="y"}return!0}).map(q=>[q.placement,q.overflows.filter(gt=>gt>0).reduce((gt,$a)=>gt+$a,0)]).sort((q,gt)=>q[1]-gt[1])[0])==null?void 0:ft[0];W&&(rt=W);break}case"initialPlacement":rt=a;break}if(i!==rt)return{reset:{placement:rt}}}return{}}}},$s=new Set(["left","top"]);async function _s(e,t){const{placement:o,platform:r,elements:i}=e,s=await(r.isRTL==null?void 0:r.isRTL(i.floating)),n=lt(o),a=Dt(o),l=Q(o)==="y",c=$s.has(n)?-1:1,h=s&&l?-1:1,d=Nt(t,e);let{mainAxis:f,crossAxis:p,alignmentAxis:v}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof v=="number"&&(p=a==="end"?v*-1:v),l?{x:p*h,y:f*c}:{x:f*c,y:p*h}}const xs=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:i,y:s,placement:n,middlewareData:a}=t,l=await _s(t,e);return n===((o=a.offset)==null?void 0:o.placement)&&(r=a.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:n}}}}},Ps=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:i,platform:s}=t,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:$=>{let{x,y:P}=$;return{x,y:P}}},...c}=Nt(e,t),h={x:o,y:r},d=await s.detectOverflow(t,c),f=Q(lt(i)),p=hr(f);let v=h[p],b=h[f];if(n){const $=p==="y"?"top":"left",x=p==="y"?"bottom":"right",P=v+d[$],C=v-d[x];v=no(P,v,C)}if(a){const $=f==="y"?"top":"left",x=f==="y"?"bottom":"right",P=b+d[$],C=b-d[x];b=no(P,b,C)}const _=l.fn({...t,[p]:v,[f]:b});return{..._,data:{x:_.x-o,y:_.y-r,enabled:{[p]:n,[f]:a}}}}}},As=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:i,rects:s,platform:n,elements:a}=t,{apply:l=()=>{},...c}=Nt(e,t),h=await n.detectOverflow(t,c),d=lt(i),f=Dt(i),p=Q(i)==="y",{width:v,height:b}=s.floating;let _,$;d==="top"||d==="bottom"?(_=d,$=f===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):($=d,_=f==="end"?"top":"bottom");const x=b-h.top-h.bottom,P=v-h.left-h.right,C=at(b-h[_],x),M=at(v-h[$],P),E=!t.middlewareData.shift;let R=C,ot=M;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(ot=P),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(R=x),E&&!f){const H=D(h.left,0),ut=D(h.right,0),Z=D(h.top,0),ft=D(h.bottom,0);p?ot=v-2*(H!==0||ut!==0?H+ut:D(h.left,h.right)):R=b-2*(Z!==0||ft!==0?Z+ft:D(h.top,h.bottom))}await l({...t,availableWidth:ot,availableHeight:R});const K=await n.getDimensions(a.floating);return v!==K.width||b!==K.height?{reset:{rects:!0}}:{}}}};function Pe(){return typeof window<"u"}function Bt(e){return gr(e)?(e.nodeName||"").toLowerCase():"#document"}function B(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function X(e){var t;return(t=(gr(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function gr(e){return Pe()?e instanceof Node||e instanceof B(e).Node:!1}function F(e){return Pe()?e instanceof Element||e instanceof B(e).Element:!1}function tt(e){return Pe()?e instanceof HTMLElement||e instanceof B(e).HTMLElement:!1}function mr(e){return!Pe()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof B(e).ShadowRoot}function Qt(e){const{overflow:t,overflowX:o,overflowY:r,display:i}=V(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&i!=="inline"&&i!=="contents"}function Cs(e){return/^(table|td|th)$/.test(Bt(e))}function Ae(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const Ss=/transform|translate|scale|rotate|perspective|filter/,Es=/paint|layout|strict|content/,Pt=e=>!!e&&e!=="none";let ho;function Ce(e){const t=F(e)?V(e):e;return Pt(t.transform)||Pt(t.translate)||Pt(t.scale)||Pt(t.rotate)||Pt(t.perspective)||!po()&&(Pt(t.backdropFilter)||Pt(t.filter))||Ss.test(t.willChange||"")||Es.test(t.contain||"")}function Os(e){let t=ct(e);for(;tt(t)&&!Ut(t);){if(Ce(t))return t;if(Ae(t))return null;t=ct(t)}return null}function po(){return ho==null&&(ho=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),ho}function Ut(e){return/^(html|body|#document)$/.test(Bt(e))}function V(e){return B(e).getComputedStyle(e)}function Se(e){return F(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ct(e){if(Bt(e)==="html")return e;const t=e.assignedSlot||e.parentNode||mr(e)&&e.host||X(e);return mr(t)?t.host:t}function vr(e){const t=ct(e);return Ut(t)?e.ownerDocument?e.ownerDocument.body:e.body:tt(t)&&Qt(t)?t:vr(t)}function te(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const i=vr(e),s=i===((r=e.ownerDocument)==null?void 0:r.body),n=B(i);if(s){const a=uo(n);return t.concat(n,n.visualViewport||[],Qt(i)?i:[],a&&o?te(a):[])}else return t.concat(i,te(i,[],o))}function uo(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function yr(e){const t=V(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const i=tt(e),s=i?e.offsetWidth:o,n=i?e.offsetHeight:r,a=we(o)!==s||we(r)!==n;return a&&(o=s,r=n),{width:o,height:r,$:a}}function fo(e){return F(e)?e:e.contextElement}function Ht(e){const t=fo(e);if(!tt(t))return Y(1);const o=t.getBoundingClientRect(),{width:r,height:i,$:s}=yr(t);let n=(s?we(o.width):o.width)/r,a=(s?we(o.height):o.height)/i;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const ks=Y(0);function br(e){const t=B(e);return!po()||!t.visualViewport?ks:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Ts(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==B(e)?!1:t}function At(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const i=e.getBoundingClientRect(),s=fo(e);let n=Y(1);t&&(r?F(r)&&(n=Ht(r)):n=Ht(e));const a=Ts(s,o,r)?br(s):Y(0);let l=(i.left+a.x)/n.x,c=(i.top+a.y)/n.y,h=i.width/n.x,d=i.height/n.y;if(s){const f=B(s),p=r&&F(r)?B(r):r;let v=f,b=uo(v);for(;b&&r&&p!==v;){const _=Ht(b),$=b.getBoundingClientRect(),x=V(b),P=$.left+(b.clientLeft+parseFloat(x.paddingLeft))*_.x,C=$.top+(b.clientTop+parseFloat(x.paddingTop))*_.y;l*=_.x,c*=_.y,h*=_.x,d*=_.y,l+=P,c+=C,v=B(b),b=uo(v)}}return xe({width:h,height:d,x:l,y:c})}function Ee(e,t){const o=Se(e).scrollLeft;return t?t.left+o:At(X(e)).left+o}function wr(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-Ee(e,o),i=o.top+t.scrollTop;return{x:r,y:i}}function Ms(e){let{elements:t,rect:o,offsetParent:r,strategy:i}=e;const s=i==="fixed",n=X(r),a=t?Ae(t.floating):!1;if(r===n||a&&s)return o;let l={scrollLeft:0,scrollTop:0},c=Y(1);const h=Y(0),d=tt(r);if((d||!d&&!s)&&((Bt(r)!=="body"||Qt(n))&&(l=Se(r)),d)){const p=At(r);c=Ht(r),h.x=p.x+r.clientLeft,h.y=p.y+r.clientTop}const f=n&&!d&&!s?wr(n,l):Y(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+h.x+f.x,y:o.y*c.y-l.scrollTop*c.y+h.y+f.y}}function Rs(e){return Array.from(e.getClientRects())}function zs(e){const t=X(e),o=Se(e),r=e.ownerDocument.body,i=D(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=D(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let n=-o.scrollLeft+Ee(e);const a=-o.scrollTop;return V(r).direction==="rtl"&&(n+=D(t.clientWidth,r.clientWidth)-i),{width:i,height:s,x:n,y:a}}const $r=25;function Ls(e,t){const o=B(e),r=X(e),i=o.visualViewport;let s=r.clientWidth,n=r.clientHeight,a=0,l=0;if(i){s=i.width,n=i.height;const h=po();(!h||h&&t==="fixed")&&(a=i.offsetLeft,l=i.offsetTop)}const c=Ee(r);if(c<=0){const h=r.ownerDocument,d=h.body,f=getComputedStyle(d),p=h.compatMode==="CSS1Compat"&&parseFloat(f.marginLeft)+parseFloat(f.marginRight)||0,v=Math.abs(r.clientWidth-d.clientWidth-p);v<=$r&&(s-=v)}else c<=$r&&(s+=c);return{width:s,height:n,x:a,y:l}}function Ns(e,t){const o=At(e,!0,t==="fixed"),r=o.top+e.clientTop,i=o.left+e.clientLeft,s=tt(e)?Ht(e):Y(1),n=e.clientWidth*s.x,a=e.clientHeight*s.y,l=i*s.x,c=r*s.y;return{width:n,height:a,x:l,y:c}}function _r(e,t,o){let r;if(t==="viewport")r=Ls(e,o);else if(t==="document")r=zs(X(e));else if(F(t))r=Ns(t,o);else{const i=br(e);r={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return xe(r)}function xr(e,t){const o=ct(e);return o===t||!F(o)||Ut(o)?!1:V(o).position==="fixed"||xr(o,t)}function Ds(e,t){const o=t.get(e);if(o)return o;let r=te(e,[],!1).filter(a=>F(a)&&Bt(a)!=="body"),i=null;const s=V(e).position==="fixed";let n=s?ct(e):e;for(;F(n)&&!Ut(n);){const a=V(n),l=Ce(n);!l&&a.position==="fixed"&&(i=null),(s?!l&&!i:!l&&a.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||Qt(n)&&!l&&xr(e,n))?r=r.filter(h=>h!==n):i=a,n=ct(n)}return t.set(e,r),r}function Bs(e){let{element:t,boundary:o,rootBoundary:r,strategy:i}=e;const n=[...o==="clippingAncestors"?Ae(t)?[]:Ds(t,this._c):[].concat(o),r],a=_r(t,n[0],i);let l=a.top,c=a.right,h=a.bottom,d=a.left;for(let f=1;f<n.length;f++){const p=_r(t,n[f],i);l=D(p.top,l),c=at(p.right,c),h=at(p.bottom,h),d=D(p.left,d)}return{width:c-d,height:h-l,x:d,y:l}}function Us(e){const{width:t,height:o}=yr(e);return{width:t,height:o}}function Hs(e,t,o){const r=tt(t),i=X(t),s=o==="fixed",n=At(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=Y(0);function c(){l.x=Ee(i)}if(r||!r&&!s)if((Bt(t)!=="body"||Qt(i))&&(a=Se(t)),r){const p=At(t,!0,s,t);l.x=p.x+t.clientLeft,l.y=p.y+t.clientTop}else i&&c();s&&!r&&i&&c();const h=i&&!r&&!s?wr(i,a):Y(0),d=n.left+a.scrollLeft-l.x-h.x,f=n.top+a.scrollTop-l.y-h.y;return{x:d,y:f,width:n.width,height:n.height}}function go(e){return V(e).position==="static"}function Pr(e,t){if(!tt(e)||V(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return X(e)===o&&(o=o.ownerDocument.body),o}function Ar(e,t){const o=B(e);if(Ae(e))return o;if(!tt(e)){let i=ct(e);for(;i&&!Ut(i);){if(F(i)&&!go(i))return i;i=ct(i)}return o}let r=Pr(e,t);for(;r&&Cs(r)&&go(r);)r=Pr(r,t);return r&&Ut(r)&&go(r)&&!Ce(r)?o:r||Os(e)||o}const js=async function(e){const t=this.getOffsetParent||Ar,o=this.getDimensions,r=await o(e.floating);return{reference:Hs(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function Is(e){return V(e).direction==="rtl"}const Oe={convertOffsetParentRelativeRectToViewportRelativeRect:Ms,getDocumentElement:X,getClippingRect:Bs,getOffsetParent:Ar,getElementRects:js,getClientRects:Rs,getDimensions:Us,getScale:Ht,isElement:F,isRTL:Is};function Cr(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Fs(e,t){let o=null,r;const i=X(e);function s(){var a;clearTimeout(r),(a=o)==null||a.disconnect(),o=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:h,top:d,width:f,height:p}=c;if(a||t(),!f||!p)return;const v=$e(d),b=$e(i.clientWidth-(h+f)),_=$e(i.clientHeight-(d+p)),$=$e(h),P={rootMargin:-v+"px "+-b+"px "+-_+"px "+-$+"px",threshold:D(0,at(1,l))||1};let C=!0;function M(E){const R=E[0].intersectionRatio;if(R!==l){if(!C)return n();R?n(!1,R):r=setTimeout(()=>{n(!1,1e-7)},1e3)}R===1&&!Cr(c,e.getBoundingClientRect())&&n(),C=!1}try{o=new IntersectionObserver(M,{...P,root:i.ownerDocument})}catch{o=new IntersectionObserver(M,P)}o.observe(e)}return n(!0),s}function Vs(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=fo(e),h=i||s?[...c?te(c):[],...t?te(t):[]]:[];h.forEach($=>{i&&$.addEventListener("scroll",o,{passive:!0}),s&&$.addEventListener("resize",o)});const d=c&&a?Fs(c,o):null;let f=-1,p=null;n&&(p=new ResizeObserver($=>{let[x]=$;x&&x.target===c&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var P;(P=p)==null||P.observe(t)})),o()}),c&&!l&&p.observe(c),t&&p.observe(t));let v,b=l?At(e):null;l&&_();function _(){const $=At(e);b&&!Cr(b,$)&&o(),b=$,v=requestAnimationFrame(_)}return o(),()=>{var $;h.forEach(x=>{i&&x.removeEventListener("scroll",o),s&&x.removeEventListener("resize",o)}),d==null||d(),($=p)==null||$.disconnect(),p=null,l&&cancelAnimationFrame(v)}}const Ws=xs,qs=Ps,Js=ws,Sr=As,Gs=bs,Ys=(e,t,o)=>{const r=new Map,i={platform:Oe,...o},s={...i.platform,_c:r};return ys(e,t,{...i,platform:s})};function Xs(e){return Ks(e)}function mo(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Ks(e){for(let t=e;t;t=mo(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=mo(e);t;t=mo(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||Ce(o)||t.tagName==="BODY"))return t}return null}function Zs(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var A=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom");let r=0,i=0,s=0,n=0,a=0,l=0,c=0,h=0;o?e.top<t.top?(r=e.left,i=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,h=t.top):(r=t.left,i=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,h=e.top):e.left<t.left?(r=e.right,i=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,h=t.bottom):(r=t.right,i=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,h=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||Zs(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Vs(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Ws({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(Sr({apply:({rects:o})=>{const r=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=i?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(Js({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(qs({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(Sr({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Gs({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?o=>Oe.getOffsetParent(o,Xs):Oe.getOffsetParent;Ys(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:er(me({},Oe),{getOffsetParent:t})}).then(({x:o,y:r,middlewareData:i,placement:s})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let h="",d="",f="",p="";if(this.arrowPlacement==="start"){const v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=n?v:"",p=n?"":v}else if(this.arrowPlacement==="end"){const v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=n?"":v,p=n?v:"",f=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(p=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(p=typeof l=="number"?`${l}px`:"",h=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:h,right:d,bottom:f,left:p,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return y`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${Zt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${Zt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?y`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};A.styles=[zt,as],m([$t(".popup")],A.prototype,"popup",2),m([$t(".popup__arrow")],A.prototype,"arrowEl",2),m([g()],A.prototype,"anchor",2),m([g({type:Boolean,reflect:!0})],A.prototype,"active",2),m([g({reflect:!0})],A.prototype,"placement",2),m([g({reflect:!0})],A.prototype,"strategy",2),m([g({type:Number})],A.prototype,"distance",2),m([g({type:Number})],A.prototype,"skidding",2),m([g({type:Boolean})],A.prototype,"arrow",2),m([g({attribute:"arrow-placement"})],A.prototype,"arrowPlacement",2),m([g({attribute:"arrow-padding",type:Number})],A.prototype,"arrowPadding",2),m([g({type:Boolean})],A.prototype,"flip",2),m([g({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],A.prototype,"flipFallbackPlacements",2),m([g({attribute:"flip-fallback-strategy"})],A.prototype,"flipFallbackStrategy",2),m([g({type:Object})],A.prototype,"flipBoundary",2),m([g({attribute:"flip-padding",type:Number})],A.prototype,"flipPadding",2),m([g({type:Boolean})],A.prototype,"shift",2),m([g({type:Object})],A.prototype,"shiftBoundary",2),m([g({attribute:"shift-padding",type:Number})],A.prototype,"shiftPadding",2),m([g({attribute:"auto-size"})],A.prototype,"autoSize",2),m([g()],A.prototype,"sync",2),m([g({type:Object})],A.prototype,"autoSizeBoundary",2),m([g({attribute:"auto-size-padding",type:Number})],A.prototype,"autoSizePadding",2),m([g({attribute:"hover-bridge",type:Boolean})],A.prototype,"hoverBridge",2);var Er=new Map,Qs=new WeakMap;function tn(e){return e??{keyframes:[],options:{duration:0}}}function Or(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function kr(e,t){Er.set(e,tn(t))}function Tr(e,t,o){const r=Qs.get(e);if(r!=null&&r[t])return Or(r[t],o.dir);const i=Er.get(t);return i?Or(i,o.dir):{keyframes:[],options:{duration:0}}}function Mr(e,t){return new Promise(o=>{function r(i){i.target===e&&(e.removeEventListener(t,r),o())}e.addEventListener(t,r)})}function Rr(e,t,o){return new Promise(r=>{if((o==null?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=e.animate(t,er(me({},o),{duration:en()?0:o.duration}));i.addEventListener("cancel",r,{once:!0}),i.addEventListener("finish",r,{once:!0})})}function zr(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function en(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Lr(e){return Promise.all(e.getAnimations().map(t=>new Promise(o=>{t.cancel(),requestAnimationFrame(o)})))}var k=class extends J{constructor(){super(),this.localize=new be(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=zr(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=zr(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Lr(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:o,options:r}=Tr(this,"tooltip.show",{dir:this.localize.dir()});await Rr(this.popup.popup,o,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Lr(this.body);const{keyframes:o,options:r}=Tr(this,"tooltip.hide",{dir:this.localize.dir()});await Rr(this.popup.popup,o,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Mr(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Mr(this,"sl-after-hide")}render(){return y`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${Zt({tooltip:!0,"tooltip--open":this.open})}
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
    `}};k.styles=[zt,ns],k.dependencies={"sl-popup":A},m([$t("slot:not([name])")],k.prototype,"defaultSlot",2),m([$t(".tooltip__body")],k.prototype,"body",2),m([$t("sl-popup")],k.prototype,"popup",2),m([g()],k.prototype,"content",2),m([g()],k.prototype,"placement",2),m([g({type:Boolean,reflect:!0})],k.prototype,"disabled",2),m([g({type:Number})],k.prototype,"distance",2),m([g({type:Boolean,reflect:!0})],k.prototype,"open",2),m([g({type:Number})],k.prototype,"skidding",2),m([g()],k.prototype,"trigger",2),m([g({type:Boolean})],k.prototype,"hoist",2),m([nt("open",{waitUntilFirstUpdate:!0})],k.prototype,"handleOpenChange",1),m([nt(["content","distance","hoist","placement","skidding"])],k.prototype,"handleOptionsChange",1),m([nt("disabled")],k.prototype,"handleDisabledChange",1),kr("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),kr("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),k.define("sl-tooltip"),G.define("sl-icon");var on=S`
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
`;function rn(e,t){function o(i){const s=e.getBoundingClientRect(),n=e.ownerDocument.defaultView,a=s.left+n.scrollX,l=s.top+n.scrollY,c=i.pageX-a,h=i.pageY-l;t!=null&&t.onMove&&t.onMove(c,h)}function r(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",r),t!=null&&t.onStop&&t.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",r),(t==null?void 0:t.initialEvent)instanceof PointerEvent&&o(t.initialEvent)}function Nr(e,t,o){const r=i=>Object.is(i,-0)?0:i;return e<t?r(t):e>o?r(o):r(e)}var Dr=()=>null,U=class extends J{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new be(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=Dr,this.snapThreshold=12}toSnapFunction(e){const t=e.split(" ");return({pos:o,size:r,snapThreshold:i,isRtl:s,vertical:n})=>{let a=o,l=Number.POSITIVE_INFINITY;return t.forEach(c=>{let h;if(c.startsWith("repeat(")){const f=e.substring(7,e.length-1),p=f.endsWith("%"),v=Number.parseFloat(f),b=p?r*(v/100):v;h=Math.round((s&&!n?r-o:o)/b)*b}else c.endsWith("%")?h=r*(Number.parseFloat(c)/100):h=Number.parseFloat(c);s&&!n&&(h=r-h);const d=Math.abs(o-h);d<=i&&d<l&&(a=h,l=d)}),a}}set snap(e){this.snapValue=e??"",e?this.snapFunction=typeof e=="string"?this.toSnapFunction(e):e:this.snapFunction=Dr}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),rn(this,{onMove:(o,r)=>{var i;let s=this.vertical?r:o;this.primary==="end"&&(s=this.size-s),s=(i=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical}))!=null?i:s,this.position=Nr(this.pixelsToPercentage(s),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){let t=this.position;const o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);if(e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),e.key==="Enter")if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const r=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=r})}this.position=Nr(t,0,100)}}handleResize(e){const{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",r=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,i="auto";return this.primary==="end"?o&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${i}`:this.style[e]=`${i} var(--divider-width) ${r}`:o&&!this.vertical?this.style[e]=`${i} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${i}`,this.style[t]="",y`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${I(this.disabled?void 0:"0")}
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
    `}};U.styles=[zt,on],m([$t(".divider")],U.prototype,"divider",2),m([g({type:Number,reflect:!0})],U.prototype,"position",2),m([g({attribute:"position-in-pixels",type:Number})],U.prototype,"positionInPixels",2),m([g({type:Boolean,reflect:!0})],U.prototype,"vertical",2),m([g({type:Boolean,reflect:!0})],U.prototype,"disabled",2),m([g()],U.prototype,"primary",2),m([g({reflect:!0})],U.prototype,"snap",1),m([g({type:Number,attribute:"snap-threshold"})],U.prototype,"snapThreshold",2),m([nt("position")],U.prototype,"handlePositionChange",1),m([nt("positionInPixels")],U.prototype,"handlePositionInPixelsChange",1),m([nt("vertical")],U.prototype,"handleVerticalChange",1),U.define("sl-split-panel");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vo=e=>(t,o)=>{o!==void 0?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=globalThis,yo=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,bo=Symbol(),Br=new WeakMap;let Ur=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==bo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(yo&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=Br.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Br.set(o,t))}return t}toString(){return this.cssText}};const sn=e=>new Ur(typeof e=="string"?e:e+"",void 0,bo),Te=(e,...t)=>{const o=e.length===1?e[0]:t.reduce(((r,i,s)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new Ur(o,e,bo)},nn=(e,t)=>{if(yo)e.adoptedStyleSheets=t.map((o=>o instanceof CSSStyleSheet?o:o.styleSheet));else for(const o of t){const r=document.createElement("style"),i=ke.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},Hr=yo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return sn(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:an,defineProperty:ln,getOwnPropertyDescriptor:cn,getOwnPropertyNames:hn,getOwnPropertySymbols:dn,getPrototypeOf:pn}=Object,ht=globalThis,jr=ht.trustedTypes,un=jr?jr.emptyScript:"",wo=ht.reactiveElementPolyfillSupport,ee=(e,t)=>e,Me={toAttribute(e,t){switch(t){case Boolean:e=e?un:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},$o=(e,t)=>!an(e,t),Ir={attribute:!0,type:String,converter:Me,reflect:!1,useDefault:!1,hasChanged:$o};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ht.litPropertyMetadata??(ht.litPropertyMetadata=new WeakMap);let jt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Ir){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&ln(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){const{get:i,set:s}=cn(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:i,set(n){const a=i==null?void 0:i.call(this);s==null||s.call(this,n),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ir}static _$Ei(){if(this.hasOwnProperty(ee("elementProperties")))return;const t=pn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ee("properties"))){const o=this.properties,r=[...hn(o),...dn(o)];for(const i of r)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)o.unshift(Hr(i))}else t!==void 0&&o.push(Hr(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((o=>this.enableUpdating=o)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((o=>o(this)))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return nn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)}))}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Me).toAttribute(o,r.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,o){var s,n;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=r.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:Me;this._$Em=i;const c=l.fromAttribute(o,a.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(t,o,r){var i;if(t!==void 0){const s=this.constructor,n=this[t];if(r??(r=s.getPropertyOptions(t)),!((r.hasChanged??$o)(n,o)||r.useDefault&&r.reflect&&n===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach((i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)})),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach((r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((o=>this._$ET(o,this[o])))),this._$EM()}updated(t){}firstUpdated(t){}};jt.elementStyles=[],jt.shadowRootOptions={mode:"open"},jt[ee("elementProperties")]=new Map,jt[ee("finalized")]=new Map,wo==null||wo({ReactiveElement:jt}),(ht.reactiveElementVersions??(ht.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fn={attribute:!0,type:String,converter:Me,reflect:!1,hasChanged:$o},gn=(e=fn,t,o)=>{const{kind:r,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),r==="accessor"){const{name:n}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(r==="setter"){const{name:n}=o;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e)}}throw Error("Unsupported decorator location: "+r)};function et(e){return(t,o)=>typeof o=="object"?gn(e,t,o):((r,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),n?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Fr(e){return et({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oe=globalThis,Re=oe.trustedTypes,Vr=Re?Re.createPolicy("lit-html",{createHTML:e=>e}):void 0,Wr="$lit$",dt=`lit$${Math.random().toFixed(9).slice(2)}$`,qr="?"+dt,mn=`<${qr}>`,Ct=document,re=()=>Ct.createComment(""),ie=e=>e===null||typeof e!="object"&&typeof e!="function",_o=Array.isArray,vn=e=>_o(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",xo=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Jr=/-->/g,Gr=/>/g,St=RegExp(`>|${xo}(?:([^\\s"'>=/]+)(${xo}*=${xo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yr=/'/g,Xr=/"/g,Kr=/^(?:script|style|textarea|title)$/i,yn=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),Po=yn(1),It=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Zr=new WeakMap,Et=Ct.createTreeWalker(Ct,129);function Qr(e,t){if(!_o(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vr!==void 0?Vr.createHTML(t):t}const bn=(e,t)=>{const o=e.length-1,r=[];let i,s=t===2?"<svg>":t===3?"<math>":"",n=se;for(let a=0;a<o;a++){const l=e[a];let c,h,d=-1,f=0;for(;f<l.length&&(n.lastIndex=f,h=n.exec(l),h!==null);)f=n.lastIndex,n===se?h[1]==="!--"?n=Jr:h[1]!==void 0?n=Gr:h[2]!==void 0?(Kr.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=St):h[3]!==void 0&&(n=St):n===St?h[0]===">"?(n=i??se,d=-1):h[1]===void 0?d=-2:(d=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?St:h[3]==='"'?Xr:Yr):n===Xr||n===Yr?n=St:n===Jr||n===Gr?n=se:(n=St,i=void 0);const p=n===St&&e[a+1].startsWith("/>")?" ":"";s+=n===se?l+mn:d>=0?(r.push(c),l.slice(0,d)+Wr+l.slice(d)+dt+p):l+dt+(d===-2?a:p)}return[Qr(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class ne{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,h]=bn(t,o);if(this.el=ne.createElement(c,r),Et.currentNode=this.el.content,o===2||o===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=Et.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Wr)){const f=h[n++],p=i.getAttribute(d).split(dt),v=/([.?@])?(.*)/.exec(f);l.push({type:1,index:s,name:v[2],strings:p,ctor:v[1]==="."?$n:v[1]==="?"?_n:v[1]==="@"?xn:ze}),i.removeAttribute(d)}else d.startsWith(dt)&&(l.push({type:6,index:s}),i.removeAttribute(d));if(Kr.test(i.tagName)){const d=i.textContent.split(dt),f=d.length-1;if(f>0){i.textContent=Re?Re.emptyScript:"";for(let p=0;p<f;p++)i.append(d[p],re()),Et.nextNode(),l.push({type:2,index:++s});i.append(d[f],re())}}}else if(i.nodeType===8)if(i.data===qr)l.push({type:2,index:s});else{let d=-1;for(;(d=i.data.indexOf(dt,d+1))!==-1;)l.push({type:7,index:s}),d+=dt.length-1}s++}}static createElement(t,o){const r=Ct.createElement("template");return r.innerHTML=t,r}}function Ft(e,t,o=e,r){var n,a;if(t===It)return t;let i=r!==void 0?(n=o._$Co)==null?void 0:n[r]:o._$Cl;const s=ie(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=Ft(e,i._$AS(e,t.values),i,r)),t}class wn{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??Ct).importNode(o,!0);Et.currentNode=i;let s=Et.nextNode(),n=0,a=0,l=r[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ae(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Pn(s,this,t)),this._$AV.push(c),l=r[++a]}n!==(l==null?void 0:l.index)&&(s=Et.nextNode(),n++)}return Et.currentNode=Ct,i}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}}class ae{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Ft(this,t,o),ie(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==It&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==O&&ie(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ct.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ne.createElement(Qr(r.h,r.h[0]),this.options)),r);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(o);else{const n=new wn(i,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(t){let o=Zr.get(t.strings);return o===void 0&&Zr.set(t.strings,o=new ne(t)),o}k(t){_o(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,i=0;for(const s of t)i===o.length?o.push(r=new ae(this.O(re()),this.O(re()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}}class ze{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=O}_$AI(t,o=this,r,i){const s=this.strings;let n=!1;if(s===void 0)t=Ft(this,t,o,0),n=!ie(t)||t!==this._$AH&&t!==It,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Ft(this,a[r+l],o,l),c===It&&(c=this._$AH[l]),n||(n=!ie(c)||c!==this._$AH[l]),c===O?t=O:t!==O&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class $n extends ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class _n extends ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class xn extends ze{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=Ft(this,t,o,0)??O)===It)return;const r=this._$AH,i=t===O&&r!==O||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==O&&(r===O||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}}class Pn{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ft(this,t)}}const Ao=oe.litHtmlPolyfillSupport;Ao==null||Ao(ne,ae),(oe.litHtmlVersions??(oe.litHtmlVersions=[])).push("3.3.1");const An=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const s=(o==null?void 0:o.renderBefore)??null;r._$litPart$=i=new ae(t.insertBefore(re(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis;class kt extends jt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=An(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return It}}kt._$litElement$=!0,kt.finalized=!0,(ni=Ot.litElementHydrateSupport)==null||ni.call(Ot,{LitElement:kt});const Co=Ot.litElementPolyfillSupport;Co==null||Co({LitElement:kt}),(Ot.litElementVersions??(Ot.litElementVersions=[])).push("4.2.1");function Cn(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const Sn=Te`
    sl-tag.method {
        width: 83px;
        text-align: center;
    }

    sl-tag.method.large {
        width: 125px;
        text-align: center;
    }

    sl-tag.method.medium {
        
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
`;var En=Object.defineProperty,On=Object.getOwnPropertyDescriptor,Vt=(e,t,o,r)=>{for(var i=r>1?void 0:r?On(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&En(t,o,i),i};let pt=class extends kt{constructor(){super(),this.lower=!1,this.method="GET"}render(){let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.micro?`method ${e} micro`:`method ${e}`;return Po`
            <sl-tag variant="${Cn(this.method)}" class="${t}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};pt.styles=Sn,Vt([et()],pt.prototype,"method",2),Vt([et({type:Boolean})],pt.prototype,"lower",2),Vt([et({type:Boolean})],pt.prototype,"large",2),Vt([et({type:Boolean})],pt.prototype,"tiny",2),Vt([et({type:Boolean})],pt.prototype,"micro",2),pt=Vt([vo("pb33f-http-method")],pt);const kn=Te`
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
    }`;var Tn=Object.defineProperty,Mn=Object.getOwnPropertyDescriptor,Le=(e,t,o,r)=>{for(var i=r>1?void 0:r?Mn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&Tn(t,o,i),i};let Wt=class extends kt{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return Po` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};Wt.styles=kn,Le([et()],Wt.prototype,"name",2),Le([et()],Wt.prototype,"url",2),Le([et({type:Boolean})],Wt.prototype,"wide",2),Wt=Le([vo("pb33f-header")],Wt);const Rn=Te`

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

`,zn=Te`
    
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
 `,Ln="pb33f-theme-change";var Nn=Object.defineProperty,Dn=Object.getOwnPropertyDescriptor,So=(e,t,o,r)=>{for(var i=r>1?void 0:r?Dn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&Nn(t,o,i),i};const Eo="dark",Bn="light",Un="tektronix",ti="pb33f-theme",ei="pb33f-base-theme";let le=class extends kt{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Un:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(ti);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(ei);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(ti,e),localStorage.setItem(ei,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===Bn?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Ln,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Eo?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===Eo?"sun":"moon",t=this.baseTheme===Eo?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",o=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return Po`
            <sl-tooltip content="${t}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTheme}
                    name="${e}"
                    label="Toggle dark/light">
                </sl-icon-button>
            </sl-tooltip>
            <sl-tooltip content="${o}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTektronix}
                    name="display"
                    class="${this.tektronixActive?"tek-active":""}"
                    label="Toggle Tektronix">
                </sl-icon-button>
            </sl-tooltip>
        `}};le.styles=[Rn,zn],So([Fr()],le.prototype,"baseTheme",2),So([Fr()],le.prototype,"tektronixActive",2),le=So([vo("pb33f-theme-switcher")],le);const Hn=S`
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
        padding: 2rem 3rem;
        max-width: 1000px;
    }
`;var jn=Object.defineProperty,In=Object.getOwnPropertyDescriptor,Oo=(e,t,o,r)=>{for(var i=r>1?void 0:r?In(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&jn(t,o,i),i};const oi="pp-split-position",Fn=20;u.PpLayout=class extends T{constructor(){super(...arguments),this.title="",this.splitPos=Fn}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const t=sessionStorage.getItem(oi);t&&(this.splitPos=parseFloat(t))}onReposition(t){const o=t.target.position;typeof o=="number"&&(this.splitPos=o,sessionStorage.setItem(oi,String(o)))}render(){return y`
      <pb33f-header name=${this.title} url="index.html" wide>
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
    `}},u.PpLayout.styles=Hn,Oo([L()],u.PpLayout.prototype,"title",2),Oo([L()],u.PpLayout.prototype,"splitPos",2),u.PpLayout=Oo([j("pp-layout")],u.PpLayout);const Vn=S`
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
`;var Wn=Object.defineProperty,qn=Object.getOwnPropertyDescriptor,Ne=(e,t,o,r)=>{for(var i=r>1?void 0:r?qn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&Wn(t,o,i),i};u.PpNav=class extends T{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)}catch{}const o=this.getAttribute("data-models");if(o)try{this.modelGroups=JSON.parse(o)}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return y`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?y`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(t=>y`<pp-nav-tag .tag=${t} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:w}
      ${this.modelGroups.length?y`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(t=>y`<pp-nav-model-group .group=${t} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:w}
    `}},u.PpNav.styles=Vn,Ne([L()],u.PpNav.prototype,"tags",2),Ne([L()],u.PpNav.prototype,"modelGroups",2),Ne([L()],u.PpNav.prototype,"activeSlug",2),u.PpNav=Ne([j("pp-nav")],u.PpNav);const Jn=S`
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
        min-height: 22px; 
        align-items: flex-start;
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
        padding-top: 3px; 
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
`;var Gn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,De=(e,t,o,r)=>{for(var i=r>1?void 0:r?Yn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&Gn(t,o,i),i};function ko(e,t){var o,r;return t?!!((o=e.operations)!=null&&o.some(i=>i.slug===t)||(r=e.children)!=null&&r.some(i=>ko(i,t))):!1}u.PpNavTag=class extends T{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("tag")||t.has("activeSlug"))&&ko(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,n;const{tag:t,activeSlug:o,open:r}=this,i=ko(t,o);return y`
            <div class="tag-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${r?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${t.summary||t.name}</span>
            </div>
            ${r?y`
                        <div class="tag-body">
                            ${(s=t.operations)!=null&&s.length?y`
                                        <ul>
                                            ${t.operations.map(a=>y`
                                                        <li>
                                                            <a href="operations/${a.slug}.html" class="${a.deprecated?"deprecated":""} ${a.slug===o?"active":""}">
                                                                <pb33f-http-method tiny
                                                                        method=${a.method}></pb33f-http-method>
                                                                <span class="op-title">${a.summary||a.path}</span>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:w}
                            ${(n=t.children)!=null&&n.length?y`
                                        <div class="children">
                                            ${t.children.map(a=>y`
                                                        <pp-nav-tag .tag=${a}
                                                                    .activeSlug=${o}></pp-nav-tag>`)}
                                        </div>
                                    `:w}
                        </div>
                    `:w}
        `}},u.PpNavTag.styles=Jn,De([g({type:Object})],u.PpNavTag.prototype,"tag",2),De([g()],u.PpNavTag.prototype,"activeSlug",2),De([L()],u.PpNavTag.prototype,"open",2),u.PpNavTag=De([j("pp-nav-tag")],u.PpNavTag);const Xn=S`
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
`;var Kn=Object.defineProperty,Zn=Object.getOwnPropertyDescriptor,Be=(e,t,o,r)=>{for(var i=r>1?void 0:r?Zn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&Kn(t,o,i),i};function ri(e,t){var o;return t?((o=e.models)==null?void 0:o.some(r=>r.typeSlug+"/"+r.slug===t))??!1:!1}u.PpNavModelGroup=class extends T{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("group")||t.has("activeSlug"))&&ri(this.group,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s;const{group:t,activeSlug:o,open:r}=this,i=ri(t,o);return y`
            <div class="group-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${r?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${t.name}</span>
            </div>
            ${r&&((s=t.models)!=null&&s.length)?y`
                    <div class="group-body">
                        <ul>
                            ${t.models.map(n=>{const a=n.typeSlug+"/"+n.slug;return y`
                                        <li>
                                            <a href="models/${n.typeSlug}/${n.slug}.html"
                                               class="${a===o?"active":""}">
                                                <span class="model-name">${n.name}</span>
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:w}
        `}},u.PpNavModelGroup.styles=Xn,Be([g({type:Object})],u.PpNavModelGroup.prototype,"group",2),Be([g()],u.PpNavModelGroup.prototype,"activeSlug",2),Be([L()],u.PpNavModelGroup.prototype,"open",2),u.PpNavModelGroup=Be([j("pp-nav-model-group")],u.PpNavModelGroup);const Qn=S`
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
`;var ta=Object.defineProperty,ea=Object.getOwnPropertyDescriptor,ce=(e,t,o,r)=>{for(var i=r>1?void 0:r?ea(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&ta(t,o,i),i};u.PpNavOperation=class extends T{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return y`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},u.PpNavOperation.styles=Qn,ce([g()],u.PpNavOperation.prototype,"method",2),ce([g()],u.PpNavOperation.prototype,"path",2),ce([g()],u.PpNavOperation.prototype,"slug",2),ce([g({type:Boolean})],u.PpNavOperation.prototype,"deprecated",2),u.PpNavOperation=ce([j("pp-nav-operation")],u.PpNavOperation);const ii=S`
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

  code {
    font-family: var(--font-stack, monospace);
    background: var(--terminal-background, #000);
    padding: 0.15em 0.4em;
    border-radius: 0;
    border: 1px solid var(--hrcolor, #3d3d3d);
    color: var(--terminal-text, #00FF00);
  }

  a {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
`,oa=S`
  :host {
    display: block;
    margin-top: 2rem;
    border-top: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    padding-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  pre {
    background: var(--terminal-background, #000);
    border: 1px solid var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 1rem;
    overflow-x: auto;
    color: var(--font-color, #e8e9ed);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: var(--font-color, #e8e9ed);
  }
`;var ra=Object.defineProperty,ia=Object.getOwnPropertyDescriptor,To=(e,t,o,r)=>{for(var i=r>1?void 0:r?ia(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&ra(t,o,i),i};u.PpOperationPage=class extends T{constructor(){super(...arguments),this.operationJson="",this.parsed=null}willUpdate(t){if(t.has("operationJson")&&this.operationJson)try{this.parsed=JSON.parse(this.operationJson)}catch{this.parsed=null}}render(){return this.parsed?y`
      <h3>Raw Operation Definition</h3>
      <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
    `:w}},u.PpOperationPage.styles=[ii,oa],To([g({attribute:"operation-json"})],u.PpOperationPage.prototype,"operationJson",2),To([L()],u.PpOperationPage.prototype,"parsed",2),u.PpOperationPage=To([j("pp-operation-page")],u.PpOperationPage);const sa=S`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  pre {
    background: var(--terminal-background, #000);
    border: 1px solid var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 1rem;
    overflow-x: auto;
    color: var(--font-color, #e8e9ed);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: var(--font-color, #e8e9ed);
  }
  .property {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }
  .prop-name {
    font-family: var(--font-stack-bold, monospace);
    color: var(--font-color, #e8e9ed);
  }
  .prop-type {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    margin-left: 0.5rem;
    font-family: var(--font-stack, monospace);
  }
  .prop-desc {
    color: var(--font-color-sub1, #a7a7a7);
    margin-top: 0.2rem;
  }
  .required-badge {
    color: var(--error-color, #ff3c74);
    font-family: var(--font-stack-bold, monospace);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;var na=Object.defineProperty,aa=Object.getOwnPropertyDescriptor,Ue=(e,t,o,r)=>{for(var i=r>1?void 0:r?aa(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&na(t,o,i),i};u.PpModelPage=class extends T{constructor(){super(...arguments),this.modelJson="",this.name="",this.parsed=null}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}render(){if(!this.parsed)return w;const t=this.parsed,o=t.properties||{},r=new Set(t.required||[]),i=Object.entries(o);return y`
      ${t.type?y`<div><strong>Type:</strong> ${t.type}</div>`:w}
      ${i.length?y`
            <h3>Properties</h3>
            ${i.map(([s,n])=>y`
                <div class="property">
                  <span class="prop-name">${s}</span>
                  ${n.type?y`<span class="prop-type">${n.type}</span>`:w}
                  ${r.has(s)?y`<span class="required-badge">required</span>`:w}
                  ${n.description?y`<div class="prop-desc">${n.description}</div>`:w}
                </div>
              `)}
          `:w}
      <h3>Schema Definition</h3>
      <pre><code>${JSON.stringify(t,null,2)}</code></pre>
    `}},u.PpModelPage.styles=[ii,sa],Ue([g({attribute:"model-json"})],u.PpModelPage.prototype,"modelJson",2),Ue([g()],u.PpModelPage.prototype,"name",2),Ue([L()],u.PpModelPage.prototype,"parsed",2),u.PpModelPage=Ue([j("pp-model-page")],u.PpModelPage);const la=S`
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
`;var ca=Object.defineProperty,ha=Object.getOwnPropertyDescriptor,He=(e,t,o,r)=>{for(var i=r>1?void 0:r?ha(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&ca(t,o,i),i};u.PpModelCard=class extends T{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return y`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?y`<p>${this.description}</p>`:""}
      </a>
    `}},u.PpModelCard.styles=la,He([g()],u.PpModelCard.prototype,"name",2),He([g()],u.PpModelCard.prototype,"href",2),He([g()],u.PpModelCard.prototype,"description",2),u.PpModelCard=He([j("pp-model-card")],u.PpModelCard);const da=S`
  :host {
    display: block;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
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
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .type-badge {
    color: var(--secondary-color, #f83aff);
    background: var(--secondary-color-very-lowalpha, rgba(248, 58, 255, 0.05));
    border: 1px solid var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    padding: 0.1em 0.4em;
    border-radius: 0;
    text-transform: uppercase;
    font-family: var(--font-stack-bold, monospace);
    letter-spacing: 0.05em;
  }
`;var pa=Object.defineProperty,ua=Object.getOwnPropertyDescriptor,Mo=(e,t,o,r)=>{for(var i=r>1?void 0:r?ua(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&pa(t,o,i),i};u.PpCrossRefs=class extends T{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var r,i,s,n,a,l;const{refs:t}=this;return((r=t.UsedByOperations)==null?void 0:r.length)||((i=t.UsedByModels)==null?void 0:i.length)||((s=t.UsesModels)==null?void 0:s.length)?y`
      ${(n=t.UsedByOperations)!=null&&n.length?y`
            <h3>Used by Operations</h3>
            <ul>
              ${t.UsedByOperations.map(c=>y`
                  <li>
                    <a href="operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:w}
      ${(a=t.UsedByModels)!=null&&a.length?y`
            <h3>Referenced by</h3>
            <ul>
              ${t.UsedByModels.map(c=>y`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:w}
      ${(l=t.UsesModels)!=null&&l.length?y`
            <h3>References</h3>
            <ul>
              ${t.UsesModels.map(c=>y`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:w}
    `:w}},u.PpCrossRefs.styles=da,Mo([g({attribute:"refs-json"})],u.PpCrossRefs.prototype,"refsJson",2),Mo([L()],u.PpCrossRefs.prototype,"refs",2),u.PpCrossRefs=Mo([j("pp-cross-refs")],u.PpCrossRefs);const fa=S`
  :host {
    display: block;
    margin: 0.75rem 0;
  }
  details {
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
  }
  summary {
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    font-family: var(--font-stack-bold, monospace);
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border-radius: 0;
    color: var(--font-color-sub1, #a7a7a7);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  summary:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  pre {
    margin: 0;
    padding: 0.75rem;
    overflow-x: auto;
    background: var(--terminal-background, #000);
    color: var(--font-color, #e8e9ed);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: inherit;
  }
`;var ga=Object.defineProperty,ma=Object.getOwnPropertyDescriptor,je=(e,t,o,r)=>{for(var i=r>1?void 0:r?ma(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&ga(t,o,i),i};u.PpExampleBlock=class extends T{constructor(){super(...arguments),this.name="",this.exampleJson="",this.parsed=null}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{this.parsed=JSON.parse(this.exampleJson)}catch{this.parsed=null}}render(){return this.parsed?y`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
      </details>
    `:w}},u.PpExampleBlock.styles=fa,je([g()],u.PpExampleBlock.prototype,"name",2),je([g({attribute:"example-json"})],u.PpExampleBlock.prototype,"exampleJson",2),je([L()],u.PpExampleBlock.prototype,"parsed",2),u.PpExampleBlock=je([j("pp-example-block")],u.PpExampleBlock);const va=S`
  :host {
    display: block;
    margin: 0.75rem 0;
  }
  .media-type {
    font-family: var(--font-stack-bold, monospace);
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  pre {
    background: var(--terminal-background, #000);
    border: 1px solid var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 0.75rem;
    overflow-x: auto;
    color: var(--font-color, #e8e9ed);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: inherit;
  }
`;var ya=Object.defineProperty,ba=Object.getOwnPropertyDescriptor,Ie=(e,t,o,r)=>{for(var i=r>1?void 0:r?ba(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(r?n(t,o,i):n(i))||i);return r&&i&&ya(t,o,i),i};u.PpComponentSection=class extends T{constructor(){super(...arguments),this.mediaType="",this.schemaJson="",this.parsed=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.parsed=JSON.parse(this.schemaJson)}catch{this.parsed=null}}render(){return y`
      ${this.mediaType?y`<div class="media-type">${this.mediaType}</div>`:w}
      ${this.parsed?y`<pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>`:w}
    `}},u.PpComponentSection.styles=va,Ie([g({attribute:"media-type"})],u.PpComponentSection.prototype,"mediaType",2),Ie([g({attribute:"schema-json"})],u.PpComponentSection.prototype,"schemaJson",2),Ie([L()],u.PpComponentSection.prototype,"parsed",2),u.PpComponentSection=Ie([j("pp-component-section")],u.PpComponentSection),to("static/shoelace");const wa={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'};return Di("default",{resolver:e=>{const t=wa[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}),u})({});
