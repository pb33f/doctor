var PrintingPress=(function(u){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var li,ci;const de=globalThis,Ve=de.ShadowRoot&&(de.ShadyCSS===void 0||de.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,We=Symbol(),Nr=new WeakMap;let Lr=class{constructor(t,r,o){if(this._$cssResult$=!0,o!==We)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o;const r=this.t;if(Ve&&t===void 0){const o=r!==void 0&&r.length===1;o&&(t=Nr.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Nr.set(r,t))}return t}toString(){return this.cssText}};const hi=e=>new Lr(typeof e=="string"?e:e+"",void 0,We),C=(e,...t)=>{const r=e.length===1?e[0]:t.reduce((o,i,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Lr(r,e,We)},ui=(e,t)=>{if(Ve)e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of t){const o=document.createElement("style"),i=de.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,e.appendChild(o)}},Dr=Ve?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(const o of t.cssRules)r+=o.cssText;return hi(r)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:fi,defineProperty:mi,getOwnPropertyDescriptor:gi,getOwnPropertyNames:vi,getOwnPropertySymbols:yi,getPrototypeOf:bi}=Object,it=globalThis,Br=it.trustedTypes,wi=Br?Br.emptyScript:"",Je=it.reactiveElementPolyfillSupport,Jt=(e,t)=>e,pe={toAttribute(e,t){switch(t){case Boolean:e=e?wi:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},qe=(e,t)=>!fi(e,t),Ur={attribute:!0,type:String,converter:pe,reflect:!1,useDefault:!1,hasChanged:qe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),it.litPropertyMetadata??(it.litPropertyMetadata=new WeakMap);let Rt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,r=Ur){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(t,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,r);i!==void 0&&mi(this.prototype,t,i)}}static getPropertyDescriptor(t,r,o){const{get:i,set:s}=gi(this.prototype,t)??{get(){return this[r]},set(n){this[r]=n}};return{get:i,set(n){const a=i==null?void 0:i.call(this);s==null||s.call(this,n),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ur}static _$Ei(){if(this.hasOwnProperty(Jt("elementProperties")))return;const t=bi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Jt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Jt("properties"))){const r=this.properties,o=[...vi(r),...yi(r)];for(const i of o)this.createProperty(i,r[i])}const t=this[Symbol.metadata];if(t!==null){const r=litPropertyMetadata.get(t);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const r=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const i of o)r.unshift(Dr(i))}else t!==void 0&&r.push(Dr(t));return r}static _$Eu(t,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(r=>r(this))}addController(t){var r;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)==null||r.call(t))}removeController(t){var r;(r=this._$EO)==null||r.delete(t)}_$E_(){const t=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ui(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(t,r,o){this._$AK(t,o)}_$ET(t,r){var s;const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(i!==void 0&&o.reflect===!0){const n=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:pe).toAttribute(r,o.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,r){var s,n;const o=this.constructor,i=o._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=o.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:pe;this._$Em=i;const c=l.fromAttribute(r,a.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(t,r,o,i=!1,s){var n;if(t!==void 0){const a=this.constructor;if(i===!1&&(s=this[t]),o??(o=a.getPropertyOptions(t)),!((o.hasChanged??qe)(s,r)||o.useDefault&&o.reflect&&s===((n=this._$Ej)==null?void 0:n.get(t))&&!this.hasAttribute(a._$Eu(t,o))))return;this.C(t,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,r,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??r??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(r=void 0),this._$AL.set(t,r)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(r)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(r)}willUpdate(t){}_$AE(t){var r;(r=this._$EO)==null||r.forEach(o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(t){}firstUpdated(t){}};Rt.elementStyles=[],Rt.shadowRootOptions={mode:"open"},Rt[Jt("elementProperties")]=new Map,Rt[Jt("finalized")]=new Map,Je==null||Je({ReactiveElement:Rt}),(it.reactiveElementVersions??(it.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qt=globalThis,Hr=e=>e,he=qt.trustedTypes,jr=he?he.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ir="$lit$",st=`lit$${Math.random().toFixed(9).slice(2)}$`,Fr="?"+st,$i=`<${Fr}>`,gt=document,Gt=()=>gt.createComment(""),Yt=e=>e===null||typeof e!="object"&&typeof e!="function",Ge=Array.isArray,_i=e=>Ge(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ye=`[ 	
\f\r]`,Xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Vr=/-->/g,Wr=/>/g,vt=RegExp(`>|${Ye}(?:([^\\s"'>=/]+)(${Ye}*=${Ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Jr=/'/g,qr=/"/g,Gr=/^(?:script|style|textarea|title)$/i,xi=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),v=xi(1),yt=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Yr=new WeakMap,bt=gt.createTreeWalker(gt,129);function Xr(e,t){if(!Ge(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return jr!==void 0?jr.createHTML(t):t}const Pi=(e,t)=>{const r=e.length-1,o=[];let i,s=t===2?"<svg>":t===3?"<math>":"",n=Xt;for(let a=0;a<r;a++){const l=e[a];let c,d,p=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===Xt?d[1]==="!--"?n=Vr:d[1]!==void 0?n=Wr:d[2]!==void 0?(Gr.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=vt):d[3]!==void 0&&(n=vt):n===vt?d[0]===">"?(n=i??Xt,p=-1):d[1]===void 0?p=-2:(p=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?vt:d[3]==='"'?qr:Jr):n===qr||n===Jr?n=vt:n===Vr||n===Wr?n=Xt:(n=vt,i=void 0);const h=n===vt&&e[a+1].startsWith("/>")?" ":"";s+=n===Xt?l+$i:p>=0?(o.push(c),l.slice(0,p)+Ir+l.slice(p)+st+h):l+st+(p===-2?a:h)}return[Xr(e,s+(e[r]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]};let Xe=class di{constructor({strings:t,_$litType$:r},o){let i;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,d]=Pi(t,r);if(this.el=di.createElement(c,o),bt.currentNode=this.el.content,r===2||r===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=bt.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(Ir)){const m=d[n++],h=i.getAttribute(p).split(st),y=/([.?@])?(.*)/.exec(m);l.push({type:1,index:s,name:y[2],strings:h,ctor:y[1]==="."?Si:y[1]==="?"?Ci:y[1]==="@"?Ei:ue}),i.removeAttribute(p)}else p.startsWith(st)&&(l.push({type:6,index:s}),i.removeAttribute(p));if(Gr.test(i.tagName)){const p=i.textContent.split(st),m=p.length-1;if(m>0){i.textContent=he?he.emptyScript:"";for(let h=0;h<m;h++)i.append(p[h],Gt()),bt.nextNode(),l.push({type:2,index:++s});i.append(p[m],Gt())}}}else if(i.nodeType===8)if(i.data===Fr)l.push({type:2,index:s});else{let p=-1;for(;(p=i.data.indexOf(st,p+1))!==-1;)l.push({type:7,index:s}),p+=st.length-1}s++}}static createElement(t,r){const o=gt.createElement("template");return o.innerHTML=t,o}};function Mt(e,t,r=e,o){var n,a;if(t===yt)return t;let i=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const s=Yt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(t=Mt(e,i._$AS(e,t.values),i,o)),t}let Ai=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:r},parts:o}=this._$AD,i=((t==null?void 0:t.creationScope)??gt).importNode(r,!0);bt.currentNode=i;let s=bt.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Ke(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Oi(s,this,t)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(s=bt.nextNode(),n++)}return bt.currentNode=gt,i}p(t){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,r),r+=o.strings.length-2):o._$AI(t[r])),r++}},Ke=class pi{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,r,o,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Mt(this,t,r),Yt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==yt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):_i(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&Yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(gt.createTextNode(t)),this._$AH=t}$(t){var s;const{values:r,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Xe.createElement(Xr(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(r);else{const n=new Ai(i,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(t){let r=Yr.get(t.strings);return r===void 0&&Yr.set(t.strings,r=new Xe(t)),r}k(t){Ge(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of t)i===r.length?r.push(o=new pi(this.O(Gt()),this.O(Gt()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);t!==this._$AB;){const i=Hr(t).nextSibling;Hr(t).remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cv=t,(r=this._$AP)==null||r.call(this,t))}},ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,r,o,i,s){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=b}_$AI(t,r=this,o,i){const s=this.strings;let n=!1;if(s===void 0)t=Mt(this,t,r,0),n=!Yt(t)||t!==this._$AH&&t!==yt,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Mt(this,a[o+l],r,l),c===yt&&(c=this._$AH[l]),n||(n=!Yt(c)||c!==this._$AH[l]),c===b?t=b:t!==b&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Si=class extends ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}},Ci=class extends ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}},Ei=class extends ue{constructor(t,r,o,i,s){super(t,r,o,i,s),this.type=5}_$AI(t,r=this){if((t=Mt(this,t,r,0)??b)===yt)return;const o=this._$AH,i=t===b&&o!==b||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==b&&(o===b||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,t):this._$AH.handleEvent(t)}};class Oi{constructor(t,r,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Mt(this,t)}}const Ze=qt.litHtmlPolyfillSupport;Ze==null||Ze(Xe,Ke),(qt.litHtmlVersions??(qt.litHtmlVersions=[])).push("3.3.2");const ki=(e,t,r)=>{const o=(r==null?void 0:r.renderBefore)??t;let i=o._$litPart$;if(i===void 0){const s=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new Ke(t.insertBefore(Gt(),s),s,void 0,r??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis;let O=class extends Rt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const t=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=t.firstChild),t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ki(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return yt}};O._$litElement$=!0,O.finalized=!0,(li=wt.litElementHydrateSupport)==null||li.call(wt,{LitElement:O});const Qe=wt.litElementPolyfillSupport;Qe==null||Qe({LitElement:O}),(wt.litElementVersions??(wt.litElementVersions=[])).push("4.2.2");var Ti=C`
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
`,Ri=C`
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
`,tr="";function er(e){tr=e}function Mi(e=""){if(!tr){const t=[...document.getElementsByTagName("script")],r=t.find(o=>o.hasAttribute("data-shoelace"));if(r)er(r.getAttribute("data-shoelace"));else{const o=t.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";o&&(i=o.getAttribute("src")),er(i.split("/").slice(0,-1).join("/"))}}return tr.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var zi={name:"default",resolver:e=>Mi(`assets/icons/${e}.svg`)},Ni=zi,Kr={caret:`
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
  `},Li={name:"system",resolver:e=>e in Kr?`data:image/svg+xml,${encodeURIComponent(Kr[e])}`:""},Di=Li,fe=[Ni,Di],me=[];function Bi(e){me.push(e)}function Ui(e){me=me.filter(t=>t!==e)}function Zr(e){return fe.find(t=>t.name===e)}function Hi(e,t){ji(e),fe.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),me.forEach(r=>{r.library===e&&r.setIcon()})}function ji(e){fe=fe.filter(t=>t.name!==e)}var Ii=C`
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
`,Qr=Object.defineProperty,Fi=Object.defineProperties,Vi=Object.getOwnPropertyDescriptor,Wi=Object.getOwnPropertyDescriptors,to=Object.getOwnPropertySymbols,Ji=Object.prototype.hasOwnProperty,qi=Object.prototype.propertyIsEnumerable,eo=e=>{throw TypeError(e)},ro=(e,t,r)=>t in e?Qr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,ge=(e,t)=>{for(var r in t||(t={}))Ji.call(t,r)&&ro(e,r,t[r]);if(to)for(var r of to(t))qi.call(t,r)&&ro(e,r,t[r]);return e},oo=(e,t)=>Fi(e,Wi(t)),g=(e,t,r,o)=>{for(var i=o>1?void 0:o?Vi(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Qr(t,r,i),i},io=(e,t,r)=>t.has(e)||eo("Cannot "+r),Gi=(e,t,r)=>(io(e,t,"read from private field"),t.get(e)),Yi=(e,t,r)=>t.has(e)?eo("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),Xi=(e,t,r,o)=>(io(e,t,"write to private field"),t.set(e,r),r);function nt(e,t){const r=ge({waitUntilFirstUpdate:!1},t);return(o,i)=>{const{update:s}=o,n=Array.isArray(e)?e:[e];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const d=a.get(c),p=this[c];d!==p&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[i](d,p)}}),s.call(this,a)}}}var zt=C`
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
 */const D=e=>(t,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ki={attribute:!0,type:String,converter:pe,reflect:!1,hasChanged:qe},Zi=(e=Ki,t,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(r.name,e),o==="accessor"){const{name:n}=r;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e,!0,a)}}throw Error("Unsupported decorator location: "+o)};function f(e){return(t,r)=>typeof r=="object"?Zi(e,t,r):((o,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),n?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function R(e){return f({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qi=(e,t,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $t(e,t){return(r,o,i)=>{const s=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(e))??null};return Qi(r,o,{get(){return s(this)}})}}var ve,q=class extends O{constructor(){super(),Yi(this,ve,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const r=new CustomEvent(e,ge({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(r),r}static define(e,t=this,r={}){const o=customElements.get(e);if(!o){try{customElements.define(e,t,r)}catch{customElements.define(e,class extends t{},r)}return}let i=" (unknown version)",s=i;"version"in t&&t.version&&(i=" v"+t.version),"version"in o&&o.version&&(s=" v"+o.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,r){Gi(this,ve)||(this.constructor.elementProperties.forEach((o,i)=>{o.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Xi(this,ve,!0)),super.attributeChangedCallback(e,t,r)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,r)=>{e.has(r)&&this[r]==null&&(this[r]=t)})}};ve=new WeakMap,q.version="2.20.1",q.dependencies={},g([f()],q.prototype,"dir",2),g([f()],q.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ts=(e,t)=>(e==null?void 0:e._$litType$)!==void 0;var Kt=Symbol(),ye=Symbol(),rr,or=new Map,G=class extends q{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var r;let o;if(t!=null&&t.spriteSheet)return this.svg=v`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(o=await fetch(e,{mode:"cors"}),!o.ok)return o.status===410?Kt:ye}catch{return ye}try{const i=document.createElement("div");i.innerHTML=await o.text();const s=i.firstElementChild;if(((r=s==null?void 0:s.tagName)==null?void 0:r.toLowerCase())!=="svg")return Kt;rr||(rr=new DOMParser);const a=rr.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Kt}catch{return Kt}}connectedCallback(){super.connectedCallback(),Bi(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Ui(this)}getIconSource(){const e=Zr(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:r}=this.getIconSource(),o=r?Zr(this.library):void 0;if(!t){this.svg=null;return}let i=or.get(t);if(i||(i=this.resolveIcon(t,o),or.set(t,i)),!this.initialRender)return;const s=await i;if(s===ye&&or.delete(t),t===this.getIconSource().url){if(ts(s)){if(this.svg=s,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(s){case ye:case Kt:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(e=o==null?void 0:o.mutator)==null||e.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};G.styles=[zt,Ii],g([R()],G.prototype,"svg",2),g([f({reflect:!0})],G.prototype,"name",2),g([f()],G.prototype,"src",2),g([f()],G.prototype,"label",2),g([f({reflect:!0})],G.prototype,"library",2),g([nt("label")],G.prototype,"handleLabelChange",1),g([nt(["name","src","library"])],G.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const es={ATTRIBUTE:1},rs=e=>(...t)=>({_$litDirective$:e,values:t});let os=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,r,o){this._$Ct=t,this._$AM=r,this._$Ci=o}_$AS(t,r){return this.update(t,r)}update(t,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=rs(class extends os{constructor(e){var t;if(super(e),e.type!==es.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var o,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in t)t[s]&&!((o=this.nt)!=null&&o.has(s))&&this.st.add(s);return this.render(t)}const r=e.element.classList;for(const s of this.st)s in t||(r.remove(s),this.st.delete(s));for(const s in t){const n=!!t[s];n===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(n?(r.add(s),this.st.add(s)):(r.remove(s),this.st.delete(s)))}return yt}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const so=Symbol.for(""),is=e=>{if((e==null?void 0:e.r)===so)return e==null?void 0:e._$litStatic$},no=(e,...t)=>({_$litStatic$:t.reduce((r,o,i)=>r+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+e[i+1],e[0]),r:so}),ao=new Map,ss=e=>(t,...r)=>{const o=r.length;let i,s;const n=[],a=[];let l,c=0,d=!1;for(;c<o;){for(l=t[c];c<o&&(s=r[c],(i=is(s))!==void 0);)l+=i+t[++c],d=!0;c!==o&&a.push(s),n.push(l),c++}if(c===o&&n.push(t[o]),d){const p=n.join("$$lit$$");(t=ao.get(p))===void 0&&(n.raw=n,ao.set(p,t=n)),r=a}return e(t,...r)},ns=ss(v);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=e=>e??b;var L=class extends q{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?no`a`:no`button`;return ns`
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
    `}};L.styles=[zt,Ri],L.dependencies={"sl-icon":G},g([$t(".icon-button")],L.prototype,"button",2),g([R()],L.prototype,"hasFocus",2),g([f()],L.prototype,"name",2),g([f()],L.prototype,"library",2),g([f()],L.prototype,"src",2),g([f()],L.prototype,"href",2),g([f()],L.prototype,"target",2),g([f()],L.prototype,"download",2),g([f()],L.prototype,"label",2),g([f({type:Boolean,reflect:!0})],L.prototype,"disabled",2);const ir=new Set,Nt=new Map;let _t,sr="ltr",nr="en";const lo=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(lo){const e=new MutationObserver(po);sr=document.documentElement.dir||"ltr",nr=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function co(...e){e.map(t=>{const r=t.$code.toLowerCase();Nt.has(r)?Nt.set(r,Object.assign(Object.assign({},Nt.get(r)),t)):Nt.set(r,t),_t||(_t=t)}),po()}function po(){lo&&(sr=document.documentElement.dir||"ltr",nr=document.documentElement.lang||navigator.language),[...ir.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let as=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){ir.add(this.host)}hostDisconnected(){ir.delete(this.host)}dir(){return`${this.host.dir||sr}`.toLowerCase()}lang(){return`${this.host.lang||nr}`.toLowerCase()}getTranslationData(t){var r,o;const i=new Intl.Locale(t.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),n=(o=(r=i==null?void 0:i.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=Nt.get(`${s}-${n}`),l=Nt.get(s);return{locale:i,language:s,region:n,primary:a,secondary:l}}exists(t,r){var o;const{primary:i,secondary:s}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(i&&i[t]||s&&s[t]||r.includeFallback&&_t&&_t[t])}term(t,...r){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let s;if(o&&o[t])s=o[t];else if(i&&i[t])s=i[t];else if(_t&&_t[t])s=_t[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...r):s}date(t,r){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),r).format(t)}number(t,r){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),r).format(t)}relativeTime(t,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(t,r)}};var ho={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};co(ho);var ls=ho,be=class extends as{};co(ls);var xt=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return v`
      <span
        part="base"
        class=${Zt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?v`
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
    `}};xt.styles=[zt,Ti],xt.dependencies={"sl-icon-button":L},g([f({reflect:!0})],xt.prototype,"variant",2),g([f({reflect:!0})],xt.prototype,"size",2),g([f({type:Boolean,reflect:!0})],xt.prototype,"pill",2),g([f({type:Boolean})],xt.prototype,"removable",2),xt.define("sl-tag"),L.define("sl-icon-button");var cs=C`
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
`,ds=C`
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
`;const at=Math.min,B=Math.max,we=Math.round,$e=Math.floor,Y=e=>({x:e,y:e}),ps={left:"right",right:"left",bottom:"top",top:"bottom"};function ar(e,t,r){return B(e,at(t,r))}function Lt(e,t){return typeof e=="function"?e(t):e}function lt(e){return e.split("-")[0]}function Dt(e){return e.split("-")[1]}function uo(e){return e==="x"?"y":"x"}function lr(e){return e==="y"?"height":"width"}function Q(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function cr(e){return uo(Q(e))}function hs(e,t,r){r===void 0&&(r=!1);const o=Dt(e),i=cr(e),s=lr(i);let n=i==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(n=_e(n)),[n,_e(n)]}function us(e){const t=_e(e);return[dr(e),t,dr(t)]}function dr(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const fo=["left","right"],mo=["right","left"],fs=["top","bottom"],ms=["bottom","top"];function gs(e,t,r){switch(e){case"top":case"bottom":return r?t?mo:fo:t?fo:mo;case"left":case"right":return t?fs:ms;default:return[]}}function vs(e,t,r,o){const i=Dt(e);let s=gs(lt(e),r==="start",o);return i&&(s=s.map(n=>n+"-"+i),t&&(s=s.concat(s.map(dr)))),s}function _e(e){const t=lt(e);return ps[t]+e.slice(t.length)}function ys(e){return{top:0,right:0,bottom:0,left:0,...e}}function go(e){return typeof e!="number"?ys(e):{top:e,right:e,bottom:e,left:e}}function xe(e){const{x:t,y:r,width:o,height:i}=e;return{width:o,height:i,top:r,left:t,right:t+o,bottom:r+i,x:t,y:r}}function vo(e,t,r){let{reference:o,floating:i}=e;const s=Q(t),n=cr(t),a=lr(n),l=lt(t),c=s==="y",d=o.x+o.width/2-i.width/2,p=o.y+o.height/2-i.height/2,m=o[a]/2-i[a]/2;let h;switch(l){case"top":h={x:d,y:o.y-i.height};break;case"bottom":h={x:d,y:o.y+o.height};break;case"right":h={x:o.x+o.width,y:p};break;case"left":h={x:o.x-i.width,y:p};break;default:h={x:o.x,y:o.y}}switch(Dt(t)){case"start":h[n]-=m*(r&&c?-1:1);break;case"end":h[n]+=m*(r&&c?-1:1);break}return h}async function bs(e,t){var r;t===void 0&&(t={});const{x:o,y:i,platform:s,rects:n,elements:a,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:p="floating",altBoundary:m=!1,padding:h=0}=Lt(t,e),y=go(h),_=a[m?p==="floating"?"reference":"floating":p],$=xe(await s.getClippingRect({element:(r=await(s.isElement==null?void 0:s.isElement(_)))==null||r?_:_.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:d,strategy:l})),x=p==="floating"?{x:o,y:i,width:n.floating.width,height:n.floating.height}:n.reference,P=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),S=await(s.isElement==null?void 0:s.isElement(P))?await(s.getScale==null?void 0:s.getScale(P))||{x:1,y:1}:{x:1,y:1},M=xe(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:P,strategy:l}):x);return{top:($.top-M.top+y.top)/S.y,bottom:(M.bottom-$.bottom+y.bottom)/S.y,left:($.left-M.left+y.left)/S.x,right:(M.right-$.right+y.right)/S.x}}const ws=50,$s=async(e,t,r)=>{const{placement:o="bottom",strategy:i="absolute",middleware:s=[],platform:n}=r,a=n.detectOverflow?n:{...n,detectOverflow:bs},l=await(n.isRTL==null?void 0:n.isRTL(t));let c=await n.getElementRects({reference:e,floating:t,strategy:i}),{x:d,y:p}=vo(c,o,l),m=o,h=0;const y={};for(let w=0;w<s.length;w++){const _=s[w];if(!_)continue;const{name:$,fn:x}=_,{x:P,y:S,data:M,reset:E}=await x({x:d,y:p,initialPlacement:o,placement:m,strategy:i,middlewareData:y,rects:c,platform:a,elements:{reference:e,floating:t}});d=P??d,p=S??p,y[$]={...y[$],...M},E&&h<ws&&(h++,typeof E=="object"&&(E.placement&&(m=E.placement),E.rects&&(c=E.rects===!0?await n.getElementRects({reference:e,floating:t,strategy:i}):E.rects),{x:d,y:p}=vo(c,m,l)),w=-1)}return{x:d,y:p,placement:m,strategy:i,middlewareData:y}},_s=e=>({name:"arrow",options:e,async fn(t){const{x:r,y:o,placement:i,rects:s,platform:n,elements:a,middlewareData:l}=t,{element:c,padding:d=0}=Lt(e,t)||{};if(c==null)return{};const p=go(d),m={x:r,y:o},h=cr(i),y=lr(h),w=await n.getDimensions(c),_=h==="y",$=_?"top":"left",x=_?"bottom":"right",P=_?"clientHeight":"clientWidth",S=s.reference[y]+s.reference[h]-m[h]-s.floating[y],M=m[h]-s.reference[h],E=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let z=E?E[P]:0;(!z||!await(n.isElement==null?void 0:n.isElement(E)))&&(z=a.floating[P]||s.floating[y]);const rt=S/2-M/2,K=z/2-w[y]/2-1,j=at(p[$],K),ut=at(p[x],K),Z=j,ft=z-w[y]-ut,N=z/2-w[y]/2+rt,Tt=ar(Z,N,ft),ot=!l.arrow&&Dt(i)!=null&&N!==Tt&&s.reference[y]/2-(N<Z?j:ut)-w[y]/2<0,W=ot?N<Z?N-Z:N-ft:0;return{[h]:m[h]+W,data:{[h]:Tt,centerOffset:N-Tt-W,...ot&&{alignmentOffset:W}},reset:ot}}}),xs=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var r,o;const{placement:i,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:c}=t,{mainAxis:d=!0,crossAxis:p=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:y="none",flipAlignment:w=!0,..._}=Lt(e,t);if((r=s.arrow)!=null&&r.alignmentOffset)return{};const $=lt(i),x=Q(a),P=lt(a)===a,S=await(l.isRTL==null?void 0:l.isRTL(c.floating)),M=m||(P||!w?[_e(a)]:us(a)),E=y!=="none";!m&&E&&M.push(...vs(a,w,y,S));const z=[a,...M],rt=await l.detectOverflow(t,_),K=[];let j=((o=s.flip)==null?void 0:o.overflows)||[];if(d&&K.push(rt[$]),p){const N=hs(i,n,S);K.push(rt[N[0]],rt[N[1]])}if(j=[...j,{placement:i,overflows:K}],!K.every(N=>N<=0)){var ut,Z;const N=(((ut=s.flip)==null?void 0:ut.index)||0)+1,Tt=z[N];if(Tt&&(!(p==="alignment"?x!==Q(Tt):!1)||j.every(J=>Q(J.placement)===x?J.overflows[0]>0:!0)))return{data:{index:N,overflows:j},reset:{placement:Tt}};let ot=(Z=j.filter(W=>W.overflows[0]<=0).sort((W,J)=>W.overflows[1]-J.overflows[1])[0])==null?void 0:Z.placement;if(!ot)switch(h){case"bestFit":{var ft;const W=(ft=j.filter(J=>{if(E){const mt=Q(J.placement);return mt===x||mt==="y"}return!0}).map(J=>[J.placement,J.overflows.filter(mt=>mt>0).reduce((mt,Ra)=>mt+Ra,0)]).sort((J,mt)=>J[1]-mt[1])[0])==null?void 0:ft[0];W&&(ot=W);break}case"initialPlacement":ot=a;break}if(i!==ot)return{reset:{placement:ot}}}return{}}}},Ps=new Set(["left","top"]);async function As(e,t){const{placement:r,platform:o,elements:i}=e,s=await(o.isRTL==null?void 0:o.isRTL(i.floating)),n=lt(r),a=Dt(r),l=Q(r)==="y",c=Ps.has(n)?-1:1,d=s&&l?-1:1,p=Lt(t,e);let{mainAxis:m,crossAxis:h,alignmentAxis:y}=typeof p=="number"?{mainAxis:p,crossAxis:0,alignmentAxis:null}:{mainAxis:p.mainAxis||0,crossAxis:p.crossAxis||0,alignmentAxis:p.alignmentAxis};return a&&typeof y=="number"&&(h=a==="end"?y*-1:y),l?{x:h*d,y:m*c}:{x:m*c,y:h*d}}const Ss=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var r,o;const{x:i,y:s,placement:n,middlewareData:a}=t,l=await As(t,e);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:n}}}}},Cs=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:r,y:o,placement:i,platform:s}=t,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:$=>{let{x,y:P}=$;return{x,y:P}}},...c}=Lt(e,t),d={x:r,y:o},p=await s.detectOverflow(t,c),m=Q(lt(i)),h=uo(m);let y=d[h],w=d[m];if(n){const $=h==="y"?"top":"left",x=h==="y"?"bottom":"right",P=y+p[$],S=y-p[x];y=ar(P,y,S)}if(a){const $=m==="y"?"top":"left",x=m==="y"?"bottom":"right",P=w+p[$],S=w-p[x];w=ar(P,w,S)}const _=l.fn({...t,[h]:y,[m]:w});return{..._,data:{x:_.x-r,y:_.y-o,enabled:{[h]:n,[m]:a}}}}}},Es=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var r,o;const{placement:i,rects:s,platform:n,elements:a}=t,{apply:l=()=>{},...c}=Lt(e,t),d=await n.detectOverflow(t,c),p=lt(i),m=Dt(i),h=Q(i)==="y",{width:y,height:w}=s.floating;let _,$;p==="top"||p==="bottom"?(_=p,$=m===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):($=p,_=m==="end"?"top":"bottom");const x=w-d.top-d.bottom,P=y-d.left-d.right,S=at(w-d[_],x),M=at(y-d[$],P),E=!t.middlewareData.shift;let z=S,rt=M;if((r=t.middlewareData.shift)!=null&&r.enabled.x&&(rt=P),(o=t.middlewareData.shift)!=null&&o.enabled.y&&(z=x),E&&!m){const j=B(d.left,0),ut=B(d.right,0),Z=B(d.top,0),ft=B(d.bottom,0);h?rt=y-2*(j!==0||ut!==0?j+ut:B(d.left,d.right)):z=w-2*(Z!==0||ft!==0?Z+ft:B(d.top,d.bottom))}await l({...t,availableWidth:rt,availableHeight:z});const K=await n.getDimensions(a.floating);return y!==K.width||w!==K.height?{reset:{rects:!0}}:{}}}};function Pe(){return typeof window<"u"}function Bt(e){return yo(e)?(e.nodeName||"").toLowerCase():"#document"}function U(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function X(e){var t;return(t=(yo(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function yo(e){return Pe()?e instanceof Node||e instanceof U(e).Node:!1}function F(e){return Pe()?e instanceof Element||e instanceof U(e).Element:!1}function tt(e){return Pe()?e instanceof HTMLElement||e instanceof U(e).HTMLElement:!1}function bo(e){return!Pe()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof U(e).ShadowRoot}function Qt(e){const{overflow:t,overflowX:r,overflowY:o,display:i}=V(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+r)&&i!=="inline"&&i!=="contents"}function Os(e){return/^(table|td|th)$/.test(Bt(e))}function Ae(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const ks=/transform|translate|scale|rotate|perspective|filter/,Ts=/paint|layout|strict|content/,Pt=e=>!!e&&e!=="none";let pr;function Se(e){const t=F(e)?V(e):e;return Pt(t.transform)||Pt(t.translate)||Pt(t.scale)||Pt(t.rotate)||Pt(t.perspective)||!hr()&&(Pt(t.backdropFilter)||Pt(t.filter))||ks.test(t.willChange||"")||Ts.test(t.contain||"")}function Rs(e){let t=ct(e);for(;tt(t)&&!Ut(t);){if(Se(t))return t;if(Ae(t))return null;t=ct(t)}return null}function hr(){return pr==null&&(pr=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),pr}function Ut(e){return/^(html|body|#document)$/.test(Bt(e))}function V(e){return U(e).getComputedStyle(e)}function Ce(e){return F(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ct(e){if(Bt(e)==="html")return e;const t=e.assignedSlot||e.parentNode||bo(e)&&e.host||X(e);return bo(t)?t.host:t}function wo(e){const t=ct(e);return Ut(t)?e.ownerDocument?e.ownerDocument.body:e.body:tt(t)&&Qt(t)?t:wo(t)}function te(e,t,r){var o;t===void 0&&(t=[]),r===void 0&&(r=!0);const i=wo(e),s=i===((o=e.ownerDocument)==null?void 0:o.body),n=U(i);if(s){const a=ur(n);return t.concat(n,n.visualViewport||[],Qt(i)?i:[],a&&r?te(a):[])}else return t.concat(i,te(i,[],r))}function ur(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function $o(e){const t=V(e);let r=parseFloat(t.width)||0,o=parseFloat(t.height)||0;const i=tt(e),s=i?e.offsetWidth:r,n=i?e.offsetHeight:o,a=we(r)!==s||we(o)!==n;return a&&(r=s,o=n),{width:r,height:o,$:a}}function fr(e){return F(e)?e:e.contextElement}function Ht(e){const t=fr(e);if(!tt(t))return Y(1);const r=t.getBoundingClientRect(),{width:o,height:i,$:s}=$o(t);let n=(s?we(r.width):r.width)/o,a=(s?we(r.height):r.height)/i;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Ms=Y(0);function _o(e){const t=U(e);return!hr()||!t.visualViewport?Ms:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function zs(e,t,r){return t===void 0&&(t=!1),!r||t&&r!==U(e)?!1:t}function At(e,t,r,o){t===void 0&&(t=!1),r===void 0&&(r=!1);const i=e.getBoundingClientRect(),s=fr(e);let n=Y(1);t&&(o?F(o)&&(n=Ht(o)):n=Ht(e));const a=zs(s,r,o)?_o(s):Y(0);let l=(i.left+a.x)/n.x,c=(i.top+a.y)/n.y,d=i.width/n.x,p=i.height/n.y;if(s){const m=U(s),h=o&&F(o)?U(o):o;let y=m,w=ur(y);for(;w&&o&&h!==y;){const _=Ht(w),$=w.getBoundingClientRect(),x=V(w),P=$.left+(w.clientLeft+parseFloat(x.paddingLeft))*_.x,S=$.top+(w.clientTop+parseFloat(x.paddingTop))*_.y;l*=_.x,c*=_.y,d*=_.x,p*=_.y,l+=P,c+=S,y=U(w),w=ur(y)}}return xe({width:d,height:p,x:l,y:c})}function Ee(e,t){const r=Ce(e).scrollLeft;return t?t.left+r:At(X(e)).left+r}function xo(e,t){const r=e.getBoundingClientRect(),o=r.left+t.scrollLeft-Ee(e,r),i=r.top+t.scrollTop;return{x:o,y:i}}function Ns(e){let{elements:t,rect:r,offsetParent:o,strategy:i}=e;const s=i==="fixed",n=X(o),a=t?Ae(t.floating):!1;if(o===n||a&&s)return r;let l={scrollLeft:0,scrollTop:0},c=Y(1);const d=Y(0),p=tt(o);if((p||!p&&!s)&&((Bt(o)!=="body"||Qt(n))&&(l=Ce(o)),p)){const h=At(o);c=Ht(o),d.x=h.x+o.clientLeft,d.y=h.y+o.clientTop}const m=n&&!p&&!s?xo(n,l):Y(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+d.x+m.x,y:r.y*c.y-l.scrollTop*c.y+d.y+m.y}}function Ls(e){return Array.from(e.getClientRects())}function Ds(e){const t=X(e),r=Ce(e),o=e.ownerDocument.body,i=B(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),s=B(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+Ee(e);const a=-r.scrollTop;return V(o).direction==="rtl"&&(n+=B(t.clientWidth,o.clientWidth)-i),{width:i,height:s,x:n,y:a}}const Po=25;function Bs(e,t){const r=U(e),o=X(e),i=r.visualViewport;let s=o.clientWidth,n=o.clientHeight,a=0,l=0;if(i){s=i.width,n=i.height;const d=hr();(!d||d&&t==="fixed")&&(a=i.offsetLeft,l=i.offsetTop)}const c=Ee(o);if(c<=0){const d=o.ownerDocument,p=d.body,m=getComputedStyle(p),h=d.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,y=Math.abs(o.clientWidth-p.clientWidth-h);y<=Po&&(s-=y)}else c<=Po&&(s+=c);return{width:s,height:n,x:a,y:l}}function Us(e,t){const r=At(e,!0,t==="fixed"),o=r.top+e.clientTop,i=r.left+e.clientLeft,s=tt(e)?Ht(e):Y(1),n=e.clientWidth*s.x,a=e.clientHeight*s.y,l=i*s.x,c=o*s.y;return{width:n,height:a,x:l,y:c}}function Ao(e,t,r){let o;if(t==="viewport")o=Bs(e,r);else if(t==="document")o=Ds(X(e));else if(F(t))o=Us(t,r);else{const i=_o(e);o={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return xe(o)}function So(e,t){const r=ct(e);return r===t||!F(r)||Ut(r)?!1:V(r).position==="fixed"||So(r,t)}function Hs(e,t){const r=t.get(e);if(r)return r;let o=te(e,[],!1).filter(a=>F(a)&&Bt(a)!=="body"),i=null;const s=V(e).position==="fixed";let n=s?ct(e):e;for(;F(n)&&!Ut(n);){const a=V(n),l=Se(n);!l&&a.position==="fixed"&&(i=null),(s?!l&&!i:!l&&a.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||Qt(n)&&!l&&So(e,n))?o=o.filter(d=>d!==n):i=a,n=ct(n)}return t.set(e,o),o}function js(e){let{element:t,boundary:r,rootBoundary:o,strategy:i}=e;const n=[...r==="clippingAncestors"?Ae(t)?[]:Hs(t,this._c):[].concat(r),o],a=Ao(t,n[0],i);let l=a.top,c=a.right,d=a.bottom,p=a.left;for(let m=1;m<n.length;m++){const h=Ao(t,n[m],i);l=B(h.top,l),c=at(h.right,c),d=at(h.bottom,d),p=B(h.left,p)}return{width:c-p,height:d-l,x:p,y:l}}function Is(e){const{width:t,height:r}=$o(e);return{width:t,height:r}}function Fs(e,t,r){const o=tt(t),i=X(t),s=r==="fixed",n=At(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=Y(0);function c(){l.x=Ee(i)}if(o||!o&&!s)if((Bt(t)!=="body"||Qt(i))&&(a=Ce(t)),o){const h=At(t,!0,s,t);l.x=h.x+t.clientLeft,l.y=h.y+t.clientTop}else i&&c();s&&!o&&i&&c();const d=i&&!o&&!s?xo(i,a):Y(0),p=n.left+a.scrollLeft-l.x-d.x,m=n.top+a.scrollTop-l.y-d.y;return{x:p,y:m,width:n.width,height:n.height}}function mr(e){return V(e).position==="static"}function Co(e,t){if(!tt(e)||V(e).position==="fixed")return null;if(t)return t(e);let r=e.offsetParent;return X(e)===r&&(r=r.ownerDocument.body),r}function Eo(e,t){const r=U(e);if(Ae(e))return r;if(!tt(e)){let i=ct(e);for(;i&&!Ut(i);){if(F(i)&&!mr(i))return i;i=ct(i)}return r}let o=Co(e,t);for(;o&&Os(o)&&mr(o);)o=Co(o,t);return o&&Ut(o)&&mr(o)&&!Se(o)?r:o||Rs(e)||r}const Vs=async function(e){const t=this.getOffsetParent||Eo,r=this.getDimensions,o=await r(e.floating);return{reference:Fs(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function Ws(e){return V(e).direction==="rtl"}const Oe={convertOffsetParentRelativeRectToViewportRelativeRect:Ns,getDocumentElement:X,getClippingRect:js,getOffsetParent:Eo,getElementRects:Vs,getClientRects:Ls,getDimensions:Is,getScale:Ht,isElement:F,isRTL:Ws};function Oo(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Js(e,t){let r=null,o;const i=X(e);function s(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:d,top:p,width:m,height:h}=c;if(a||t(),!m||!h)return;const y=$e(p),w=$e(i.clientWidth-(d+m)),_=$e(i.clientHeight-(p+h)),$=$e(d),P={rootMargin:-y+"px "+-w+"px "+-_+"px "+-$+"px",threshold:B(0,at(1,l))||1};let S=!0;function M(E){const z=E[0].intersectionRatio;if(z!==l){if(!S)return n();z?n(!1,z):o=setTimeout(()=>{n(!1,1e-7)},1e3)}z===1&&!Oo(c,e.getBoundingClientRect())&&n(),S=!1}try{r=new IntersectionObserver(M,{...P,root:i.ownerDocument})}catch{r=new IntersectionObserver(M,P)}r.observe(e)}return n(!0),s}function qs(e,t,r,o){o===void 0&&(o={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=fr(e),d=i||s?[...c?te(c):[],...t?te(t):[]]:[];d.forEach($=>{i&&$.addEventListener("scroll",r,{passive:!0}),s&&$.addEventListener("resize",r)});const p=c&&a?Js(c,r):null;let m=-1,h=null;n&&(h=new ResizeObserver($=>{let[x]=$;x&&x.target===c&&h&&t&&(h.unobserve(t),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var P;(P=h)==null||P.observe(t)})),r()}),c&&!l&&h.observe(c),t&&h.observe(t));let y,w=l?At(e):null;l&&_();function _(){const $=At(e);w&&!Oo(w,$)&&r(),w=$,y=requestAnimationFrame(_)}return r(),()=>{var $;d.forEach(x=>{i&&x.removeEventListener("scroll",r),s&&x.removeEventListener("resize",r)}),p==null||p(),($=h)==null||$.disconnect(),h=null,l&&cancelAnimationFrame(y)}}const Gs=Ss,Ys=Cs,Xs=xs,ko=Es,Ks=_s,Zs=(e,t,r)=>{const o=new Map,i={platform:Oe,...r},s={...i.platform,_c:o};return $s(e,t,{...i,platform:s})};function Qs(e){return tn(e)}function gr(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function tn(e){for(let t=e;t;t=gr(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=gr(e);t;t=gr(t)){if(!(t instanceof Element))continue;const r=getComputedStyle(t);if(r.display!=="contents"&&(r.position!=="static"||Se(r)||t.tagName==="BODY"))return t}return null}function en(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var A=class extends q{constructor(){super(...arguments),this.localize=new be(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,i=0,s=0,n=0,a=0,l=0,c=0,d=0;r?e.top<t.top?(o=e.left,i=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,d=t.top):(o=t.left,i=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,d=e.top):e.left<t.left?(o=e.right,i=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,d=t.bottom):(o=t.right,i=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,d=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||en(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=qs(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Gs({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(ko({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=i?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(Xs({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(Ys({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(ko({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Ks({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?r=>Oe.getOffsetParent(r,Qs):Oe.getOffsetParent;Zs(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:oo(ge({},Oe),{getOffsetParent:t})}).then(({x:r,y:o,middlewareData:i,placement:s})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let d="",p="",m="",h="";if(this.arrowPlacement==="start"){const y=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",p=n?y:"",h=n?"":y}else if(this.arrowPlacement==="end"){const y=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";p=n?"":y,h=n?y:"",m=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(h=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",d=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(h=typeof l=="number"?`${l}px`:"",d=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:d,right:p,bottom:m,left:h,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return v`
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
        ${this.arrow?v`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};A.styles=[zt,ds],g([$t(".popup")],A.prototype,"popup",2),g([$t(".popup__arrow")],A.prototype,"arrowEl",2),g([f()],A.prototype,"anchor",2),g([f({type:Boolean,reflect:!0})],A.prototype,"active",2),g([f({reflect:!0})],A.prototype,"placement",2),g([f({reflect:!0})],A.prototype,"strategy",2),g([f({type:Number})],A.prototype,"distance",2),g([f({type:Number})],A.prototype,"skidding",2),g([f({type:Boolean})],A.prototype,"arrow",2),g([f({attribute:"arrow-placement"})],A.prototype,"arrowPlacement",2),g([f({attribute:"arrow-padding",type:Number})],A.prototype,"arrowPadding",2),g([f({type:Boolean})],A.prototype,"flip",2),g([f({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],A.prototype,"flipFallbackPlacements",2),g([f({attribute:"flip-fallback-strategy"})],A.prototype,"flipFallbackStrategy",2),g([f({type:Object})],A.prototype,"flipBoundary",2),g([f({attribute:"flip-padding",type:Number})],A.prototype,"flipPadding",2),g([f({type:Boolean})],A.prototype,"shift",2),g([f({type:Object})],A.prototype,"shiftBoundary",2),g([f({attribute:"shift-padding",type:Number})],A.prototype,"shiftPadding",2),g([f({attribute:"auto-size"})],A.prototype,"autoSize",2),g([f()],A.prototype,"sync",2),g([f({type:Object})],A.prototype,"autoSizeBoundary",2),g([f({attribute:"auto-size-padding",type:Number})],A.prototype,"autoSizePadding",2),g([f({attribute:"hover-bridge",type:Boolean})],A.prototype,"hoverBridge",2);var To=new Map,rn=new WeakMap;function on(e){return e??{keyframes:[],options:{duration:0}}}function Ro(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function Mo(e,t){To.set(e,on(t))}function zo(e,t,r){const o=rn.get(e);if(o!=null&&o[t])return Ro(o[t],r.dir);const i=To.get(t);return i?Ro(i,r.dir):{keyframes:[],options:{duration:0}}}function No(e,t){return new Promise(r=>{function o(i){i.target===e&&(e.removeEventListener(t,o),r())}e.addEventListener(t,o)})}function Lo(e,t,r){return new Promise(o=>{if((r==null?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=e.animate(t,oo(ge({},r),{duration:sn()?0:r.duration}));i.addEventListener("cancel",o,{once:!0}),i.addEventListener("finish",o,{once:!0})})}function Do(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function sn(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Bo(e){return Promise.all(e.getAnimations().map(t=>new Promise(r=>{t.cancel(),requestAnimationFrame(r)})))}var T=class extends q{constructor(){super(),this.localize=new be(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=Do(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=Do(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Bo(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=zo(this,"tooltip.show",{dir:this.localize.dir()});await Lo(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Bo(this.body);const{keyframes:r,options:o}=zo(this,"tooltip.hide",{dir:this.localize.dir()});await Lo(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,No(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,No(this,"sl-after-hide")}render(){return v`
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
    `}};T.styles=[zt,cs],T.dependencies={"sl-popup":A},g([$t("slot:not([name])")],T.prototype,"defaultSlot",2),g([$t(".tooltip__body")],T.prototype,"body",2),g([$t("sl-popup")],T.prototype,"popup",2),g([f()],T.prototype,"content",2),g([f()],T.prototype,"placement",2),g([f({type:Boolean,reflect:!0})],T.prototype,"disabled",2),g([f({type:Number})],T.prototype,"distance",2),g([f({type:Boolean,reflect:!0})],T.prototype,"open",2),g([f({type:Number})],T.prototype,"skidding",2),g([f()],T.prototype,"trigger",2),g([f({type:Boolean})],T.prototype,"hoist",2),g([nt("open",{waitUntilFirstUpdate:!0})],T.prototype,"handleOpenChange",1),g([nt(["content","distance","hoist","placement","skidding"])],T.prototype,"handleOptionsChange",1),g([nt("disabled")],T.prototype,"handleDisabledChange",1),Mo("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),Mo("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),T.define("sl-tooltip"),G.define("sl-icon");var nn=C`
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
`;function an(e,t){function r(i){const s=e.getBoundingClientRect(),n=e.ownerDocument.defaultView,a=s.left+n.scrollX,l=s.top+n.scrollY,c=i.pageX-a,d=i.pageY-l;t!=null&&t.onMove&&t.onMove(c,d)}function o(){document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o),t!=null&&t.onStop&&t.onStop()}document.addEventListener("pointermove",r,{passive:!0}),document.addEventListener("pointerup",o),(t==null?void 0:t.initialEvent)instanceof PointerEvent&&r(t.initialEvent)}function Uo(e,t,r){const o=i=>Object.is(i,-0)?0:i;return e<t?o(t):e>r?o(r):o(e)}var Ho=()=>null,H=class extends q{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new be(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=Ho,this.snapThreshold=12}toSnapFunction(e){const t=e.split(" ");return({pos:r,size:o,snapThreshold:i,isRtl:s,vertical:n})=>{let a=r,l=Number.POSITIVE_INFINITY;return t.forEach(c=>{let d;if(c.startsWith("repeat(")){const m=e.substring(7,e.length-1),h=m.endsWith("%"),y=Number.parseFloat(m),w=h?o*(y/100):y;d=Math.round((s&&!n?o-r:r)/w)*w}else c.endsWith("%")?d=o*(Number.parseFloat(c)/100):d=Number.parseFloat(c);s&&!n&&(d=o-d);const p=Math.abs(r-d);p<=i&&p<l&&(a=d,l=p)}),a}}set snap(e){this.snapValue=e??"",e?this.snapFunction=typeof e=="string"?this.toSnapFunction(e):e:this.snapFunction=Ho}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),an(this,{onMove:(r,o)=>{var i;let s=this.vertical?o:r;this.primary==="end"&&(s=this.size-s),s=(i=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical}))!=null?i:s,this.position=Uo(this.pixelsToPercentage(s),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){let t=this.position;const r=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);if(e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=r),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=r),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),e.key==="Enter")if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const o=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=o})}this.position=Uo(t,0,100)}}handleResize(e){const{width:t,height:r}=e[0].contentRect;this.size=this.vertical?r:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",r=this.localize.dir()==="rtl",o=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,i="auto";return this.primary==="end"?r&&!this.vertical?this.style[e]=`${o} var(--divider-width) ${i}`:this.style[e]=`${i} var(--divider-width) ${o}`:r&&!this.vertical?this.style[e]=`${i} var(--divider-width) ${o}`:this.style[e]=`${o} var(--divider-width) ${i}`,this.style[t]="",v`
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
    `}};H.styles=[zt,nn],g([$t(".divider")],H.prototype,"divider",2),g([f({type:Number,reflect:!0})],H.prototype,"position",2),g([f({attribute:"position-in-pixels",type:Number})],H.prototype,"positionInPixels",2),g([f({type:Boolean,reflect:!0})],H.prototype,"vertical",2),g([f({type:Boolean,reflect:!0})],H.prototype,"disabled",2),g([f()],H.prototype,"primary",2),g([f({reflect:!0})],H.prototype,"snap",1),g([f({type:Number,attribute:"snap-threshold"})],H.prototype,"snapThreshold",2),g([nt("position")],H.prototype,"handlePositionChange",1),g([nt("positionInPixels")],H.prototype,"handlePositionInPixelsChange",1),g([nt("vertical")],H.prototype,"handleVerticalChange",1),H.define("sl-split-panel");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vr=e=>(t,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=globalThis,yr=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,br=Symbol(),jo=new WeakMap;let Io=class{constructor(t,r,o){if(this._$cssResult$=!0,o!==br)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o;const r=this.t;if(yr&&t===void 0){const o=r!==void 0&&r.length===1;o&&(t=jo.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&jo.set(r,t))}return t}toString(){return this.cssText}};const ln=e=>new Io(typeof e=="string"?e:e+"",void 0,br),Te=(e,...t)=>{const r=e.length===1?e[0]:t.reduce(((o,i,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new Io(r,e,br)},cn=(e,t)=>{if(yr)e.adoptedStyleSheets=t.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of t){const o=document.createElement("style"),i=ke.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,e.appendChild(o)}},Fo=yr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(const o of t.cssRules)r+=o.cssText;return ln(r)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:dn,defineProperty:pn,getOwnPropertyDescriptor:hn,getOwnPropertyNames:un,getOwnPropertySymbols:fn,getPrototypeOf:mn}=Object,dt=globalThis,Vo=dt.trustedTypes,gn=Vo?Vo.emptyScript:"",wr=dt.reactiveElementPolyfillSupport,ee=(e,t)=>e,Re={toAttribute(e,t){switch(t){case Boolean:e=e?gn:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},$r=(e,t)=>!dn(e,t),Wo={attribute:!0,type:String,converter:Re,reflect:!1,useDefault:!1,hasChanged:$r};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),dt.litPropertyMetadata??(dt.litPropertyMetadata=new WeakMap);let jt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,r=Wo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(t,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,r);i!==void 0&&pn(this.prototype,t,i)}}static getPropertyDescriptor(t,r,o){const{get:i,set:s}=hn(this.prototype,t)??{get(){return this[r]},set(n){this[r]=n}};return{get:i,set(n){const a=i==null?void 0:i.call(this);s==null||s.call(this,n),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Wo}static _$Ei(){if(this.hasOwnProperty(ee("elementProperties")))return;const t=mn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ee("properties"))){const r=this.properties,o=[...un(r),...fn(r)];for(const i of o)this.createProperty(i,r[i])}const t=this[Symbol.metadata];if(t!==null){const r=litPropertyMetadata.get(t);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const r=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const i of o)r.unshift(Fo(i))}else t!==void 0&&r.push(Fo(t));return r}static _$Eu(t,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((r=>this.enableUpdating=r)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((r=>r(this)))}addController(t){var r;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)==null||r.call(t))}removeController(t){var r;(r=this._$EO)==null||r.delete(t)}_$E_(){const t=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return cn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)}))}attributeChangedCallback(t,r,o){this._$AK(t,o)}_$ET(t,r){var s;const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(i!==void 0&&o.reflect===!0){const n=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:Re).toAttribute(r,o.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,r){var s,n;const o=this.constructor,i=o._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const a=o.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:Re;this._$Em=i;const c=l.fromAttribute(r,a.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(t,r,o){var i;if(t!==void 0){const s=this.constructor,n=this[t];if(o??(o=s.getPropertyOptions(t)),!((o.hasChanged??$r)(n,r)||o.useDefault&&o.reflect&&n===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,r,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??r??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(r=void 0),this._$AL.set(t,r)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(o=this._$EO)==null||o.forEach((i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)})),this.update(r)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(r)}willUpdate(t){}_$AE(t){var r;(r=this._$EO)==null||r.forEach((o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((r=>this._$ET(r,this[r])))),this._$EM()}updated(t){}firstUpdated(t){}};jt.elementStyles=[],jt.shadowRootOptions={mode:"open"},jt[ee("elementProperties")]=new Map,jt[ee("finalized")]=new Map,wr==null||wr({ReactiveElement:jt}),(dt.reactiveElementVersions??(dt.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vn={attribute:!0,type:String,converter:Re,reflect:!1,hasChanged:$r},yn=(e=vn,t,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(r.name,e),o==="accessor"){const{name:n}=r;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e)}}throw Error("Unsupported decorator location: "+o)};function et(e){return(t,r)=>typeof r=="object"?yn(e,t,r):((o,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),n?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Jo(e){return et({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const re=globalThis,Me=re.trustedTypes,qo=Me?Me.createPolicy("lit-html",{createHTML:e=>e}):void 0,Go="$lit$",pt=`lit$${Math.random().toFixed(9).slice(2)}$`,Yo="?"+pt,bn=`<${Yo}>`,St=document,oe=()=>St.createComment(""),ie=e=>e===null||typeof e!="object"&&typeof e!="function",_r=Array.isArray,wn=e=>_r(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",xr=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Xo=/-->/g,Ko=/>/g,Ct=RegExp(`>|${xr}(?:([^\\s"'>=/]+)(${xr}*=${xr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Zo=/'/g,Qo=/"/g,ti=/^(?:script|style|textarea|title)$/i,$n=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),Pr=$n(1),It=Symbol.for("lit-noChange"),k=Symbol.for("lit-nothing"),ei=new WeakMap,Et=St.createTreeWalker(St,129);function ri(e,t){if(!_r(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return qo!==void 0?qo.createHTML(t):t}const _n=(e,t)=>{const r=e.length-1,o=[];let i,s=t===2?"<svg>":t===3?"<math>":"",n=se;for(let a=0;a<r;a++){const l=e[a];let c,d,p=-1,m=0;for(;m<l.length&&(n.lastIndex=m,d=n.exec(l),d!==null);)m=n.lastIndex,n===se?d[1]==="!--"?n=Xo:d[1]!==void 0?n=Ko:d[2]!==void 0?(ti.test(d[2])&&(i=RegExp("</"+d[2],"g")),n=Ct):d[3]!==void 0&&(n=Ct):n===Ct?d[0]===">"?(n=i??se,p=-1):d[1]===void 0?p=-2:(p=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?Ct:d[3]==='"'?Qo:Zo):n===Qo||n===Zo?n=Ct:n===Xo||n===Ko?n=se:(n=Ct,i=void 0);const h=n===Ct&&e[a+1].startsWith("/>")?" ":"";s+=n===se?l+bn:p>=0?(o.push(c),l.slice(0,p)+Go+l.slice(p)+pt+h):l+pt+(p===-2?a:h)}return[ri(e,s+(e[r]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]};class ne{constructor({strings:t,_$litType$:r},o){let i;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,d]=_n(t,r);if(this.el=ne.createElement(c,o),Et.currentNode=this.el.content,r===2||r===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=Et.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(Go)){const m=d[n++],h=i.getAttribute(p).split(pt),y=/([.?@])?(.*)/.exec(m);l.push({type:1,index:s,name:y[2],strings:h,ctor:y[1]==="."?Pn:y[1]==="?"?An:y[1]==="@"?Sn:ze}),i.removeAttribute(p)}else p.startsWith(pt)&&(l.push({type:6,index:s}),i.removeAttribute(p));if(ti.test(i.tagName)){const p=i.textContent.split(pt),m=p.length-1;if(m>0){i.textContent=Me?Me.emptyScript:"";for(let h=0;h<m;h++)i.append(p[h],oe()),Et.nextNode(),l.push({type:2,index:++s});i.append(p[m],oe())}}}else if(i.nodeType===8)if(i.data===Yo)l.push({type:2,index:s});else{let p=-1;for(;(p=i.data.indexOf(pt,p+1))!==-1;)l.push({type:7,index:s}),p+=pt.length-1}s++}}static createElement(t,r){const o=St.createElement("template");return o.innerHTML=t,o}}function Ft(e,t,r=e,o){var n,a;if(t===It)return t;let i=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const s=ie(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(t=Ft(e,i._$AS(e,t.values),i,o)),t}class xn{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:r},parts:o}=this._$AD,i=((t==null?void 0:t.creationScope)??St).importNode(r,!0);Et.currentNode=i;let s=Et.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ae(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Cn(s,this,t)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(s=Et.nextNode(),n++)}return Et.currentNode=St,i}p(t){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,r),r+=o.strings.length-2):o._$AI(t[r])),r++}}class ae{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,r,o,i){this.type=2,this._$AH=k,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Ft(this,t,r),ie(t)?t===k||t==null||t===""?(this._$AH!==k&&this._$AR(),this._$AH=k):t!==this._$AH&&t!==It&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):wn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==k&&ie(this._$AH)?this._$AA.nextSibling.data=t:this.T(St.createTextNode(t)),this._$AH=t}$(t){var s;const{values:r,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=ne.createElement(ri(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(r);else{const n=new xn(i,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(t){let r=ei.get(t.strings);return r===void 0&&ei.set(t.strings,r=new ne(t)),r}k(t){_r(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of t)i===r.length?r.push(o=new ae(this.O(oe()),this.O(oe()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cv=t,(r=this._$AP)==null||r.call(this,t))}}class ze{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,r,o,i,s){this.type=1,this._$AH=k,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=k}_$AI(t,r=this,o,i){const s=this.strings;let n=!1;if(s===void 0)t=Ft(this,t,r,0),n=!ie(t)||t!==this._$AH&&t!==It,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Ft(this,a[o+l],r,l),c===It&&(c=this._$AH[l]),n||(n=!ie(c)||c!==this._$AH[l]),c===k?t=k:t!==k&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(t)}j(t){t===k?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pn extends ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===k?void 0:t}}class An extends ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==k)}}class Sn extends ze{constructor(t,r,o,i,s){super(t,r,o,i,s),this.type=5}_$AI(t,r=this){if((t=Ft(this,t,r,0)??k)===It)return;const o=this._$AH,i=t===k&&o!==k||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==k&&(o===k||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,t):this._$AH.handleEvent(t)}}class Cn{constructor(t,r,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Ft(this,t)}}const Ar=re.litHtmlPolyfillSupport;Ar==null||Ar(ne,ae),(re.litHtmlVersions??(re.litHtmlVersions=[])).push("3.3.1");const En=(e,t,r)=>{const o=(r==null?void 0:r.renderBefore)??t;let i=o._$litPart$;if(i===void 0){const s=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new ae(t.insertBefore(oe(),s),s,void 0,r??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis;class kt extends jt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const t=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=t.firstChild),t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=En(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return It}}kt._$litElement$=!0,kt.finalized=!0,(ci=Ot.litElementHydrateSupport)==null||ci.call(Ot,{LitElement:kt});const Sr=Ot.litElementPolyfillSupport;Sr==null||Sr({LitElement:kt}),(Ot.litElementVersions??(Ot.litElementVersions=[])).push("4.2.1");function On(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const kn=Te`
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
`;var Tn=Object.defineProperty,Rn=Object.getOwnPropertyDescriptor,Vt=(e,t,r,o)=>{for(var i=o>1?void 0:o?Rn(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Tn(t,r,i),i};let ht=class extends kt{constructor(){super(),this.lower=!1,this.method="GET"}render(){let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.micro?`method ${e} micro`:`method ${e}`;return Pr`
            <sl-tag variant="${On(this.method)}" class="${t}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};ht.styles=kn,Vt([et()],ht.prototype,"method",2),Vt([et({type:Boolean})],ht.prototype,"lower",2),Vt([et({type:Boolean})],ht.prototype,"large",2),Vt([et({type:Boolean})],ht.prototype,"tiny",2),Vt([et({type:Boolean})],ht.prototype,"micro",2),ht=Vt([vr("pb33f-http-method")],ht);const Mn=Te`
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
    }`;var zn=Object.defineProperty,Nn=Object.getOwnPropertyDescriptor,Ne=(e,t,r,o)=>{for(var i=o>1?void 0:o?Nn(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&zn(t,r,i),i};let Wt=class extends kt{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return Pr` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};Wt.styles=Mn,Ne([et()],Wt.prototype,"name",2),Ne([et()],Wt.prototype,"url",2),Ne([et({type:Boolean})],Wt.prototype,"wide",2),Wt=Ne([vr("pb33f-header")],Wt);const Ln=Te`

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

`,Dn=Te`
    
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
 `,Bn="pb33f-theme-change";var Un=Object.defineProperty,Hn=Object.getOwnPropertyDescriptor,Cr=(e,t,r,o)=>{for(var i=o>1?void 0:o?Hn(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Un(t,r,i),i};const Er="dark",jn="light",In="tektronix",oi="pb33f-theme",ii="pb33f-base-theme";let le=class extends kt{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?In:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(oi);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(ii);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(oi,e),localStorage.setItem(ii,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===jn?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Bn,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Er?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===Er?"sun":"moon",t=this.baseTheme===Er?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",r=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return Pr`
            <sl-tooltip content="${t}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTheme}
                    name="${e}"
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
        `}};le.styles=[Ln,Dn],Cr([Jo()],le.prototype,"baseTheme",2),Cr([Jo()],le.prototype,"tektronixActive",2),le=Cr([vr("pb33f-theme-switcher")],le);const Fn=C`
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
`;var Vn=Object.defineProperty,Wn=Object.getOwnPropertyDescriptor,Or=(e,t,r,o)=>{for(var i=o>1?void 0:o?Wn(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Vn(t,r,i),i};const si="pp-split-position",Jn=20;u.PpLayout=class extends O{constructor(){super(...arguments),this.title="",this.splitPos=Jn}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const t=sessionStorage.getItem(si);t&&(this.splitPos=parseFloat(t))}onReposition(t){const r=t.target.position;typeof r=="number"&&(this.splitPos=r,sessionStorage.setItem(si,String(r)))}render(){return v`
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
    `}},u.PpLayout.styles=Fn,Or([R()],u.PpLayout.prototype,"title",2),Or([R()],u.PpLayout.prototype,"splitPos",2),u.PpLayout=Or([D("pp-layout")],u.PpLayout);const qn=C`
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
`;var Gn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,Le=(e,t,r,o)=>{for(var i=o>1?void 0:o?Yn(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Gn(t,r,i),i};u.PpNav=class extends O{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)||[]}catch{}const r=this.getAttribute("data-models");if(r)try{this.modelGroups=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return v`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?v`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(t=>v`<pp-nav-tag .tag=${t} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:b}
      ${this.modelGroups.length?v`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(t=>v`<pp-nav-model-group .group=${t} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:b}
    `}},u.PpNav.styles=qn,Le([R()],u.PpNav.prototype,"tags",2),Le([R()],u.PpNav.prototype,"modelGroups",2),Le([R()],u.PpNav.prototype,"activeSlug",2),u.PpNav=Le([D("pp-nav")],u.PpNav);const Xn=C`
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
`;var Kn=Object.defineProperty,Zn=Object.getOwnPropertyDescriptor,De=(e,t,r,o)=>{for(var i=o>1?void 0:o?Zn(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Kn(t,r,i),i};function kr(e,t){var r,o;return t?!!((r=e.operations)!=null&&r.some(i=>i.slug===t)||(o=e.children)!=null&&o.some(i=>kr(i,t))):!1}u.PpNavTag=class extends O{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("tag")||t.has("activeSlug"))&&kr(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,n;const{tag:t,activeSlug:r,open:o}=this,i=kr(t,r);return v`
            <div class="tag-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${t.summary||t.name}</span>
            </div>
            ${o?v`
                        <div class="tag-body">
                            ${(s=t.operations)!=null&&s.length?v`
                                        <ul>
                                            ${t.operations.map(a=>v`
                                                        <li>
                                                            <a href="operations/${a.slug}.html" class="${a.deprecated?"deprecated":""} ${a.slug===r?"active":""}">
                                                                <pb33f-http-method tiny
                                                                        method=${a.method}></pb33f-http-method>
                                                                <span class="op-title">${a.summary||a.path}</span>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:b}
                            ${(n=t.children)!=null&&n.length?v`
                                        <div class="children">
                                            ${t.children.map(a=>v`
                                                        <pp-nav-tag .tag=${a}
                                                                    .activeSlug=${r}></pp-nav-tag>`)}
                                        </div>
                                    `:b}
                        </div>
                    `:b}
        `}},u.PpNavTag.styles=Xn,De([f({type:Object})],u.PpNavTag.prototype,"tag",2),De([f()],u.PpNavTag.prototype,"activeSlug",2),De([R()],u.PpNavTag.prototype,"open",2),u.PpNavTag=De([D("pp-nav-tag")],u.PpNavTag);const Qn=C`
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
`;var ta=Object.defineProperty,ea=Object.getOwnPropertyDescriptor,Be=(e,t,r,o)=>{for(var i=o>1?void 0:o?ea(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&ta(t,r,i),i};function ni(e,t){var r;return t?((r=e.models)==null?void 0:r.some(o=>o.typeSlug+"/"+o.slug===t))??!1:!1}u.PpNavModelGroup=class extends O{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("group")||t.has("activeSlug"))&&ni(this.group,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s;const{group:t,activeSlug:r,open:o}=this,i=ni(t,r);return v`
            <div class="group-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${t.name}</span>
            </div>
            ${o&&((s=t.models)!=null&&s.length)?v`
                    <div class="group-body">
                        <ul>
                            ${t.models.map(n=>{const a=n.typeSlug+"/"+n.slug;return v`
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
        `}},u.PpNavModelGroup.styles=Qn,Be([f({type:Object})],u.PpNavModelGroup.prototype,"group",2),Be([f()],u.PpNavModelGroup.prototype,"activeSlug",2),Be([R()],u.PpNavModelGroup.prototype,"open",2),u.PpNavModelGroup=Be([D("pp-nav-model-group")],u.PpNavModelGroup);const ra=C`
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
`;var oa=Object.defineProperty,ia=Object.getOwnPropertyDescriptor,ce=(e,t,r,o)=>{for(var i=o>1?void 0:o?ia(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&oa(t,r,i),i};u.PpNavOperation=class extends O{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return v`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},u.PpNavOperation.styles=ra,ce([f()],u.PpNavOperation.prototype,"method",2),ce([f()],u.PpNavOperation.prototype,"path",2),ce([f()],u.PpNavOperation.prototype,"slug",2),ce([f({type:Boolean})],u.PpNavOperation.prototype,"deprecated",2),u.PpNavOperation=ce([D("pp-nav-operation")],u.PpNavOperation);const Ue=C`
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
`,sa=C`
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
`;var na=Object.defineProperty,aa=Object.getOwnPropertyDescriptor,Tr=(e,t,r,o)=>{for(var i=o>1?void 0:o?aa(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&na(t,r,i),i};u.PpOperationPage=class extends O{constructor(){super(...arguments),this.operationJson="",this.parsed=null}willUpdate(t){if(t.has("operationJson")&&this.operationJson)try{this.parsed=JSON.parse(this.operationJson)}catch{this.parsed=null}}render(){return this.parsed?v`
      <h3>Raw Operation Definition</h3>
      <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
    `:b}},u.PpOperationPage.styles=[Ue,sa],Tr([f({attribute:"operation-json"})],u.PpOperationPage.prototype,"operationJson",2),Tr([R()],u.PpOperationPage.prototype,"parsed",2),u.PpOperationPage=Tr([D("pp-operation-page")],u.PpOperationPage);const la=C`
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
  .parameter {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }
  .param-name {
    font-family: var(--font-stack-bold, monospace);
    color: var(--font-color, #e8e9ed);
  }
  .param-type {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    margin-left: 0.5rem;
    font-family: var(--font-stack, monospace);
  }
  .param-type a {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
  .param-type a:hover {
    text-decoration: underline;
  }
  .param-in {
    color: var(--font-color-sub2, #6e6e6e);
    margin-left: 0.5rem;
    font-size: 0.8em;
    font-family: var(--font-stack, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .required-badge {
    color: var(--error-color, #ff3c74);
    font-family: var(--font-stack-bold, monospace);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .deprecated-badge {
    color: var(--warn-400, #ff6a00);
    font-family: var(--font-stack-bold, monospace);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .param-desc {
    color: var(--font-color-sub1, #a7a7a7);
    margin-top: 0.2rem;
  }
  .enum-values {
    color: var(--font-color-sub2, #6e6e6e);
    font-size: 0.85em;
    margin-top: 0.15rem;
  }
  .enum-value {
    color: var(--warn-400, #ff6a00);
    font-family: var(--font-stack, monospace);
  }
`;var ca=Object.defineProperty,da=Object.getOwnPropertyDescriptor,Rr=(e,t,r,o)=>{for(var i=o>1?void 0:o?da(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&ca(t,r,i),i};function pa(e){var t;if(!e)return{type:"",enumValues:null};try{const r=JSON.parse(e);let o="";return r.type==="array"&&r.items?o=`array<${r.items.type||((t=r.items.$ref)==null?void 0:t.split("/").pop())||"any"}>`:r.type?(o=Array.isArray(r.type)?r.type.join(" | "):r.type,r.format&&(o+=` (${r.format})`)):r.oneOf?o="oneOf":r.anyOf?o="anyOf":r.allOf?o="allOf":r.$ref&&(o=r.$ref.split("/").pop()),{type:o,enumValues:Array.isArray(r.enum)?r.enum:null}}catch{return{type:"",enumValues:null}}}u.PpOperationParameters=class extends O{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(t){if(t.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}render(){return this.params.length?v`
      <h3>Parameters</h3>
      ${this.params.map(t=>{const r=t.ref?null:pa(t.schemaJson),o=t.ref?t.ref.name:(r==null?void 0:r.type)||"";return v`
          <div class="parameter">
            <span class="param-name">${t.name}</span>
            ${o?t.ref?v`<span class="param-type"><a href="models/${t.ref.typeSlug}/${t.ref.slug}.html">${o}</a></span>`:v`<span class="param-type">${o}</span>`:b}
            <span class="param-in">${t.in}</span>
            ${t.required?v`<span class="required-badge">required</span>`:b}
            ${t.deprecated?v`<span class="deprecated-badge">deprecated</span>`:b}
            ${t.description?v`<div class="param-desc">${t.description}</div>`:b}
            ${r!=null&&r.enumValues?v`<div class="enum-values">Enum: ${r.enumValues.map((i,s)=>v`${s>0?", ":""}<span class="enum-value">${i}</span>`)}</div>`:b}
          </div>
        `})}
    `:b}},u.PpOperationParameters.styles=[Ue,la],Rr([f({attribute:"parameters-json"})],u.PpOperationParameters.prototype,"parametersJson",2),Rr([R()],u.PpOperationParameters.prototype,"params",2),u.PpOperationParameters=Rr([D("pp-operation-parameters")],u.PpOperationParameters);const ha=C`
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
  .response {
    margin-bottom: 1.5rem;
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 1rem;
    background: rgba(35, 35, 35, 0.2);
  }
  h4 {
    margin: 0 0 0.5rem 0;
  }
  .status-code {
    font-family: var(--font-stack-bold, monospace);
    font-weight: 700;
    margin-right: 0.5em;
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  .ref-link {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
  .ref-link:hover {
    text-decoration: underline;
  }
  .media-type-ref {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
  .media-type-label {
    font-family: var(--font-stack-bold, monospace);
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 0.85em;
  }
  .schema-type {
    color: var(--font-color-sub2, #6e6e6e);
    font-family: var(--font-stack, monospace);
    font-size: 0.85em;
    margin-top: 0.25rem;
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
  .enum-values {
    color: var(--font-color-sub2, #6e6e6e);
    font-size: 0.85em;
    margin-top: 0.15rem;
  }
  .enum-value {
    color: var(--warn-400, #ff6a00);
    font-family: var(--font-stack, monospace);
  }
  .nested {
    margin-left: 1rem;
    border-left: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.25));
  }
  .items-label {
    font-family: var(--font-stack, monospace);
    font-size: 0.8em;
    color: var(--font-color-sub2, #6e6e6e);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.3rem 0.75rem 0;
  }
`;var ua=Object.defineProperty,fa=Object.getOwnPropertyDescriptor,Mr=(e,t,r,o)=>{for(var i=o>1?void 0:o?fa(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&ua(t,r,i),i};function ai(e){var t;if(!e)return"";if(e.type==="array"&&e.items)return`array<${e.items.type||((t=e.items.$ref)==null?void 0:t.split("/").pop())||"any"}>`;if(e.type){let r=Array.isArray(e.type)?e.type.join(" | "):e.type;return e.format&&(r+=` (${e.format})`),r}return e.oneOf?"oneOf":e.anyOf?"anyOf":e.allOf?"allOf":e.$ref?e.$ref.split("/").pop():""}function ma(e){var t;return e?e.properties?e:e.type==="array"&&((t=e.items)!=null&&t.properties)?e.items:null:null}u.PpOperationResponses=class extends O{constructor(){super(...arguments),this.responsesJson="",this.responses=[]}willUpdate(t){if(t.has("responsesJson")&&this.responsesJson)try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}}renderProperty(t,r,o,i){const s=ai(r),n=ma(r),a=(r==null?void 0:r.type)==="array"&&n;return v`
      <div class="property">
        <span class="prop-name">${t}</span>
        ${s?v`<span class="prop-type">${s}</span>`:b}
        ${o.has(t)?v`<span class="required-badge">required</span>`:b}
        ${r.description?v`<div class="prop-desc">${r.description}</div>`:b}
        ${r.enum?v`<div class="enum-values">Enum: ${r.enum.map((l,c)=>v`${c>0?", ":""}<span class="enum-value">${l}</span>`)}</div>`:b}
      </div>
      ${n&&i<4?v`
            <div class="nested">
              ${a?v`<div class="items-label">items</div>`:b}
              ${this.renderSchemaProperties(n,i+1)}
            </div>
          `:b}
    `}renderSchemaProperties(t,r=0){if(!t)return b;const o=t.properties||{},i=new Set(t.required||[]),s=Object.entries(o);if(!s.length){const n=ai(t);return n?v`<div class="schema-type">Type: ${n}</div>`:b}return s.map(([n,a])=>this.renderProperty(n,a,i,r))}renderMediaType(t){if(t.schemaRef)return v`
        <div class="media-type-ref">
          <span class="media-type-label">${t.mediaType}</span>
          <a class="ref-link" href="models/${t.schemaRef.typeSlug}/${t.schemaRef.slug}.html">
            ${t.schemaRef.name}
          </a>
        </div>
      `;if(!t.schemaJson)return b;let r;try{r=JSON.parse(t.schemaJson)}catch{return b}return v`
      <div class="media-type-label">${t.mediaType}</div>
      ${this.renderSchemaProperties(r)}
    `}renderResponse(t){var r;return v`
      <div class="response">
        <h4>
          <span class="status-code">${t.statusCode}</span>
          ${t.description}
        </h4>
        ${t.ref?v`<a class="ref-link" href="models/${t.ref.typeSlug}/${t.ref.slug}.html">${t.ref.name}</a>`:((r=t.content)==null?void 0:r.map(o=>this.renderMediaType(o)))??b}
      </div>
    `}render(){return this.responses.length?v`
      <h3>Responses</h3>
      ${this.responses.map(t=>this.renderResponse(t))}
    `:b}},u.PpOperationResponses.styles=[Ue,ha],Mr([f({attribute:"responses-json"})],u.PpOperationResponses.prototype,"responsesJson",2),Mr([R()],u.PpOperationResponses.prototype,"responses",2),u.PpOperationResponses=Mr([D("pp-operation-responses")],u.PpOperationResponses);const ga=C`
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
`;var va=Object.defineProperty,ya=Object.getOwnPropertyDescriptor,He=(e,t,r,o)=>{for(var i=o>1?void 0:o?ya(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&va(t,r,i),i};u.PpModelPage=class extends O{constructor(){super(...arguments),this.modelJson="",this.name="",this.parsed=null}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}render(){if(!this.parsed)return b;const t=this.parsed,r=t.properties||{},o=new Set(t.required||[]),i=Object.entries(r);return v`
      ${t.type?v`<div><strong>Type:</strong> ${t.type}</div>`:b}
      ${i.length?v`
            <h3>Properties</h3>
            ${i.map(([s,n])=>v`
                <div class="property">
                  <span class="prop-name">${s}</span>
                  ${n.type?v`<span class="prop-type">${n.type}</span>`:b}
                  ${o.has(s)?v`<span class="required-badge">required</span>`:b}
                  ${n.description?v`<div class="prop-desc">${n.description}</div>`:b}
                </div>
              `)}
          `:b}
      <h3>Schema Definition</h3>
      <pre><code>${JSON.stringify(t,null,2)}</code></pre>
    `}},u.PpModelPage.styles=[Ue,ga],He([f({attribute:"model-json"})],u.PpModelPage.prototype,"modelJson",2),He([f()],u.PpModelPage.prototype,"name",2),He([R()],u.PpModelPage.prototype,"parsed",2),u.PpModelPage=He([D("pp-model-page")],u.PpModelPage);const ba=C`
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
`;var wa=Object.defineProperty,$a=Object.getOwnPropertyDescriptor,je=(e,t,r,o)=>{for(var i=o>1?void 0:o?$a(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&wa(t,r,i),i};u.PpModelCard=class extends O{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return v`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?v`<p>${this.description}</p>`:""}
      </a>
    `}},u.PpModelCard.styles=ba,je([f()],u.PpModelCard.prototype,"name",2),je([f()],u.PpModelCard.prototype,"href",2),je([f()],u.PpModelCard.prototype,"description",2),u.PpModelCard=je([D("pp-model-card")],u.PpModelCard);const _a=C`
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
`;var xa=Object.defineProperty,Pa=Object.getOwnPropertyDescriptor,zr=(e,t,r,o)=>{for(var i=o>1?void 0:o?Pa(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&xa(t,r,i),i};u.PpCrossRefs=class extends O{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var o,i,s,n,a,l;const{refs:t}=this;return((o=t.UsedByOperations)==null?void 0:o.length)||((i=t.UsedByModels)==null?void 0:i.length)||((s=t.UsesModels)==null?void 0:s.length)?v`
      ${(n=t.UsedByOperations)!=null&&n.length?v`
            <h3>Used by Operations</h3>
            <ul>
              ${t.UsedByOperations.map(c=>v`
                  <li>
                    <a href="operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:b}
      ${(a=t.UsedByModels)!=null&&a.length?v`
            <h3>Referenced by</h3>
            <ul>
              ${t.UsedByModels.map(c=>v`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:b}
      ${(l=t.UsesModels)!=null&&l.length?v`
            <h3>References</h3>
            <ul>
              ${t.UsesModels.map(c=>v`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:b}
    `:b}},u.PpCrossRefs.styles=_a,zr([f({attribute:"refs-json"})],u.PpCrossRefs.prototype,"refsJson",2),zr([R()],u.PpCrossRefs.prototype,"refs",2),u.PpCrossRefs=zr([D("pp-cross-refs")],u.PpCrossRefs);const Aa=C`
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
`;var Sa=Object.defineProperty,Ca=Object.getOwnPropertyDescriptor,Ie=(e,t,r,o)=>{for(var i=o>1?void 0:o?Ca(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Sa(t,r,i),i};u.PpExampleBlock=class extends O{constructor(){super(...arguments),this.name="",this.exampleJson="",this.parsed=null}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{this.parsed=JSON.parse(this.exampleJson)}catch{this.parsed=null}}render(){return this.parsed?v`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
      </details>
    `:b}},u.PpExampleBlock.styles=Aa,Ie([f()],u.PpExampleBlock.prototype,"name",2),Ie([f({attribute:"example-json"})],u.PpExampleBlock.prototype,"exampleJson",2),Ie([R()],u.PpExampleBlock.prototype,"parsed",2),u.PpExampleBlock=Ie([D("pp-example-block")],u.PpExampleBlock);const Ea=C`
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
`;var Oa=Object.defineProperty,ka=Object.getOwnPropertyDescriptor,Fe=(e,t,r,o)=>{for(var i=o>1?void 0:o?ka(t,r):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(i=(o?n(t,r,i):n(i))||i);return o&&i&&Oa(t,r,i),i};u.PpComponentSection=class extends O{constructor(){super(...arguments),this.mediaType="",this.schemaJson="",this.parsed=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.parsed=JSON.parse(this.schemaJson)}catch{this.parsed=null}}render(){return v`
      ${this.mediaType?v`<div class="media-type">${this.mediaType}</div>`:b}
      ${this.parsed?v`<pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>`:b}
    `}},u.PpComponentSection.styles=Ea,Fe([f({attribute:"media-type"})],u.PpComponentSection.prototype,"mediaType",2),Fe([f({attribute:"schema-json"})],u.PpComponentSection.prototype,"schemaJson",2),Fe([R()],u.PpComponentSection.prototype,"parsed",2),u.PpComponentSection=Fe([D("pp-component-section")],u.PpComponentSection),er("static/shoelace");const Ta={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'};return Hi("default",{resolver:e=>{const t=Ta[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}),u})({});
