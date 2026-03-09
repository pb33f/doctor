var PrintingPress=(function(m){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ir,rr;const he=globalThis,Ie=he.ShadowRoot&&(he.ShadyCSS===void 0||he.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,je=Symbol(),Ro=new WeakMap;let Mo=class{constructor(t,o,i){if(this._$cssResult$=!0,i!==je)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(Ie&&t===void 0){const i=o!==void 0&&o.length===1;i&&(t=Ro.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Ro.set(o,t))}return t}toString(){return this.cssText}};const ar=e=>new Mo(typeof e=="string"?e:e+"",void 0,je),E=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((i,r,s)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1],e[0]);return new Mo(o,e,je)},lr=(e,t)=>{if(Ie)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const i=document.createElement("style"),r=he.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,e.appendChild(i)}},zo=Ie?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const i of t.cssRules)o+=i.cssText;return ar(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cr,defineProperty:hr,getOwnPropertyDescriptor:dr,getOwnPropertyNames:pr,getOwnPropertySymbols:ur,getPrototypeOf:fr}=Object,rt=globalThis,Lo=rt.trustedTypes,gr=Lo?Lo.emptyScript:"",Fe=rt.reactiveElementPolyfillSupport,qt=(e,t)=>e,de={toAttribute(e,t){switch(t){case Boolean:e=e?gr:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},Ve=(e,t)=>!cr(e,t),No={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:Ve};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),rt.litPropertyMetadata??(rt.litPropertyMetadata=new WeakMap);let Rt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=No){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,o);r!==void 0&&hr(this.prototype,t,r)}}static getPropertyDescriptor(t,o,i){const{get:r,set:s}=dr(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:r,set(n){const a=r==null?void 0:r.call(this);s==null||s.call(this,n),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??No}static _$Ei(){if(this.hasOwnProperty(qt("elementProperties")))return;const t=fr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(qt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(qt("properties"))){const o=this.properties,i=[...pr(o),...ur(o)];for(const r of i)this.createProperty(r,o[r])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[o,i]of this.elementProperties){const r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)o.unshift(zo(r))}else t!==void 0&&o.push(zo(t));return o}static _$Eu(t,o){const i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(o=>this.enableUpdating=o),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(o=>o(this))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const i of o.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(o=>{var i;return(i=o.hostConnected)==null?void 0:i.call(o)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(o=>{var i;return(i=o.hostDisconnected)==null?void 0:i.call(o)})}attributeChangedCallback(t,o,i){this._$AK(t,i)}_$ET(t,o){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const n=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:de).toAttribute(o,i.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,o){var s,n;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=i.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:de;this._$Em=r;const c=l.fromAttribute(o,a.type);this[r]=c??((n=this._$Ej)==null?void 0:n.get(r))??c,this._$Em=null}}requestUpdate(t,o,i,r=!1,s){var n;if(t!==void 0){const a=this.constructor;if(r===!1&&(s=this[t]),i??(i=a.getPropertyOptions(t)),!((i.hasChanged??Ve)(s,o)||i.useDefault&&i.reflect&&s===((n=this._$Ej)==null?void 0:n.get(t))&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:i,reflect:r,wrapped:s},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(o=void 0),this._$AL.set(t,o)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,n]of r){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(i=this._$EO)==null||i.forEach(r=>{var s;return(s=r.hostUpdate)==null?void 0:s.call(r)}),this.update(o)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach(i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};Rt.elementStyles=[],Rt.shadowRootOptions={mode:"open"},Rt[qt("elementProperties")]=new Map,Rt[qt("finalized")]=new Map,Fe==null||Fe({ReactiveElement:Rt}),(rt.reactiveElementVersions??(rt.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt=globalThis,Do=e=>e,pe=Jt.trustedTypes,Bo=pe?pe.createPolicy("lit-html",{createHTML:e=>e}):void 0,Uo="$lit$",st=`lit$${Math.random().toFixed(9).slice(2)}$`,Ho="?"+st,mr=`<${Ho}>`,mt=document,Yt=()=>mt.createComment(""),Xt=e=>e===null||typeof e!="object"&&typeof e!="function",We=Array.isArray,vr=e=>We(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",qe=`[ 	
\f\r]`,Kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Io=/-->/g,jo=/>/g,vt=RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fo=/'/g,Vo=/"/g,Wo=/^(?:script|style|textarea|title)$/i,yr=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),b=yr(1),yt=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),qo=new WeakMap,bt=mt.createTreeWalker(mt,129);function Jo(e,t){if(!We(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Bo!==void 0?Bo.createHTML(t):t}const br=(e,t)=>{const o=e.length-1,i=[];let r,s=t===2?"<svg>":t===3?"<math>":"",n=Kt;for(let a=0;a<o;a++){const l=e[a];let c,h,d=-1,u=0;for(;u<l.length&&(n.lastIndex=u,h=n.exec(l),h!==null);)u=n.lastIndex,n===Kt?h[1]==="!--"?n=Io:h[1]!==void 0?n=jo:h[2]!==void 0?(Wo.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=vt):h[3]!==void 0&&(n=vt):n===vt?h[0]===">"?(n=r??Kt,d=-1):h[1]===void 0?d=-2:(d=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?vt:h[3]==='"'?Vo:Fo):n===Vo||n===Fo?n=vt:n===Io||n===jo?n=Kt:(n=vt,r=void 0);const p=n===vt&&e[a+1].startsWith("/>")?" ":"";s+=n===Kt?l+mr:d>=0?(i.push(c),l.slice(0,d)+Uo+l.slice(d)+st+p):l+st+(d===-2?a:p)}return[Jo(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};let Je=class sr{constructor({strings:t,_$litType$:o},i){let r;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,h]=br(t,o);if(this.el=sr.createElement(c,i),bt.currentNode=this.el.content,o===2||o===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=bt.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Uo)){const u=h[n++],p=r.getAttribute(d).split(st),v=/([.?@])?(.*)/.exec(u);l.push({type:1,index:s,name:v[2],strings:p,ctor:v[1]==="."?$r:v[1]==="?"?_r:v[1]==="@"?xr:ue}),r.removeAttribute(d)}else d.startsWith(st)&&(l.push({type:6,index:s}),r.removeAttribute(d));if(Wo.test(r.tagName)){const d=r.textContent.split(st),u=d.length-1;if(u>0){r.textContent=pe?pe.emptyScript:"";for(let p=0;p<u;p++)r.append(d[p],Yt()),bt.nextNode(),l.push({type:2,index:++s});r.append(d[u],Yt())}}}else if(r.nodeType===8)if(r.data===Ho)l.push({type:2,index:s});else{let d=-1;for(;(d=r.data.indexOf(st,d+1))!==-1;)l.push({type:7,index:s}),d+=st.length-1}s++}}static createElement(t,o){const i=mt.createElement("template");return i.innerHTML=t,i}};function Mt(e,t,o=e,i){var n,a;if(t===yt)return t;let r=i!==void 0?(n=o._$Co)==null?void 0:n[i]:o._$Cl;const s=Xt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==s&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),s===void 0?r=void 0:(r=new s(e),r._$AT(e,o,i)),i!==void 0?(o._$Co??(o._$Co=[]))[i]=r:o._$Cl=r),r!==void 0&&(t=Mt(e,r._$AS(e,t.values),r,i)),t}let wr=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:i}=this._$AD,r=((t==null?void 0:t.creationScope)??mt).importNode(o,!0);bt.currentNode=r;let s=bt.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Ye(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Pr(s,this,t)),this._$AV.push(c),l=i[++a]}n!==(l==null?void 0:l.index)&&(s=bt.nextNode(),n++)}return bt.currentNode=mt,r}p(t){let o=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,o),o+=i.strings.length-2):i._$AI(t[o])),o++}},Ye=class nr{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,i,r){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Mt(this,t,o),Xt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==yt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):vr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&Xt(this._$AH)?this._$AA.nextSibling.data=t:this.T(mt.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Je.createElement(Jo(i.h,i.h[0]),this.options)),i);if(((s=this._$AH)==null?void 0:s._$AD)===r)this._$AH.p(o);else{const n=new wr(r,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(t){let o=qo.get(t.strings);return o===void 0&&qo.set(t.strings,o=new Je(t)),o}k(t){We(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let i,r=0;for(const s of t)r===o.length?o.push(i=new nr(this.O(Yt()),this.O(Yt()),this,this.options)):i=o[r],i._$AI(s),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(t=this._$AA.nextSibling,o){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,o);t!==this._$AB;){const r=Do(t).nextSibling;Do(t).remove(),t=r}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}},ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,i,r,s){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=o,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=w}_$AI(t,o=this,i,r){const s=this.strings;let n=!1;if(s===void 0)t=Mt(this,t,o,0),n=!Xt(t)||t!==this._$AH&&t!==yt,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Mt(this,a[i+l],o,l),c===yt&&(c=this._$AH[l]),n||(n=!Xt(c)||c!==this._$AH[l]),c===w?t=w:t!==w&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!r&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},$r=class extends ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}},_r=class extends ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}},xr=class extends ue{constructor(t,o,i,r,s){super(t,o,i,r,s),this.type=5}_$AI(t,o=this){if((t=Mt(this,t,o,0)??w)===yt)return;const i=this._$AH,r=t===w&&i!==w||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==w&&(i===w||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}};class Pr{constructor(t,o,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Mt(this,t)}}const Xe=Jt.litHtmlPolyfillSupport;Xe==null||Xe(Je,Ye),(Jt.litHtmlVersions??(Jt.litHtmlVersions=[])).push("3.3.2");const Ar=(e,t,o)=>{const i=(o==null?void 0:o.renderBefore)??t;let r=i._$litPart$;if(r===void 0){const s=(o==null?void 0:o.renderBefore)??null;i._$litPart$=r=new Ye(t.insertBefore(Yt(),s),s,void 0,o??{})}return r._$AI(e),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis;let M=class extends Rt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ar(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return yt}};M._$litElement$=!0,M.finalized=!0,(ir=wt.litElementHydrateSupport)==null||ir.call(wt,{LitElement:M});const Ke=wt.litElementPolyfillSupport;Ke==null||Ke({LitElement:M}),(wt.litElementVersions??(wt.litElementVersions=[])).push("4.2.2");var Cr=E`
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
`,Sr=E`
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
`,Ze="";function Ge(e){Ze=e}function Er(e=""){if(!Ze){const t=[...document.getElementsByTagName("script")],o=t.find(i=>i.hasAttribute("data-shoelace"));if(o)Ge(o.getAttribute("data-shoelace"));else{const i=t.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let r="";i&&(r=i.getAttribute("src")),Ge(r.split("/").slice(0,-1).join("/"))}}return Ze.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Or={name:"default",resolver:e=>Er(`assets/icons/${e}.svg`)},kr=Or,Yo={caret:`
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
  `},Tr={name:"system",resolver:e=>e in Yo?`data:image/svg+xml,${encodeURIComponent(Yo[e])}`:""},Rr=Tr,fe=[kr,Rr],ge=[];function Mr(e){ge.push(e)}function zr(e){ge=ge.filter(t=>t!==e)}function Xo(e){return fe.find(t=>t.name===e)}function Lr(e,t){Nr(e),fe.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),ge.forEach(o=>{o.library===e&&o.setIcon()})}function Nr(e){fe=fe.filter(t=>t.name!==e)}var Dr=E`
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
`,Ko=Object.defineProperty,Br=Object.defineProperties,Ur=Object.getOwnPropertyDescriptor,Hr=Object.getOwnPropertyDescriptors,Zo=Object.getOwnPropertySymbols,Ir=Object.prototype.hasOwnProperty,jr=Object.prototype.propertyIsEnumerable,Go=e=>{throw TypeError(e)},Qo=(e,t,o)=>t in e?Ko(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,me=(e,t)=>{for(var o in t||(t={}))Ir.call(t,o)&&Qo(e,o,t[o]);if(Zo)for(var o of Zo(t))jr.call(t,o)&&Qo(e,o,t[o]);return e},ti=(e,t)=>Br(e,Hr(t)),g=(e,t,o,i)=>{for(var r=i>1?void 0:i?Ur(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&Ko(t,o,r),r},ei=(e,t,o)=>t.has(e)||Go("Cannot "+o),Fr=(e,t,o)=>(ei(e,t,"read from private field"),t.get(e)),Vr=(e,t,o)=>t.has(e)?Go("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),Wr=(e,t,o,i)=>(ei(e,t,"write to private field"),t.set(e,o),o);function nt(e,t){const o=me({waitUntilFirstUpdate:!1},t);return(i,r)=>{const{update:s}=i,n=Array.isArray(e)?e:[e];i.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const h=a.get(c),d=this[c];h!==d&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[r](h,d)}}),s.call(this,a)}}}var zt=E`
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
 */const q=e=>(t,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qr={attribute:!0,type:String,converter:de,reflect:!1,hasChanged:Ve},Jr=(e=qr,t,o)=>{const{kind:i,metadata:r}=o;let s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),i==="accessor"){const{name:n}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(i==="setter"){const{name:n}=o;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e,!0,a)}}throw Error("Unsupported decorator location: "+i)};function f(e){return(t,o)=>typeof o=="object"?Jr(e,t,o):((i,r,s)=>{const n=r.hasOwnProperty(s);return r.constructor.createProperty(s,i),n?Object.getOwnPropertyDescriptor(r,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function U(e){return f({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yr=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $t(e,t){return(o,i,r)=>{const s=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(e))??null};return Yr(o,i,{get(){return s(this)}})}}var ve,J=class extends M{constructor(){super(),Vr(this,ve,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const o=new CustomEvent(e,me({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const i=customElements.get(e);if(!i){try{customElements.define(e,t,o)}catch{customElements.define(e,class extends t{},o)}return}let r=" (unknown version)",s=r;"version"in t&&t.version&&(r=" v"+t.version),"version"in i&&i.version&&(s=" v"+i.version),!(r&&s&&r===s)&&console.warn(`Attempted to register <${e}>${r}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,o){Fr(this,ve)||(this.constructor.elementProperties.forEach((i,r)=>{i.reflect&&this[r]!=null&&this.initialReflectedProperties.set(r,this[r])}),Wr(this,ve,!0)),super.attributeChangedCallback(e,t,o)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,o)=>{e.has(o)&&this[o]==null&&(this[o]=t)})}};ve=new WeakMap,J.version="2.20.1",J.dependencies={},g([f()],J.prototype,"dir",2),g([f()],J.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xr=(e,t)=>(e==null?void 0:e._$litType$)!==void 0;var Zt=Symbol(),ye=Symbol(),Qe,to=new Map,Y=class extends J{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var o;let i;if(t!=null&&t.spriteSheet)return this.svg=b`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(i=await fetch(e,{mode:"cors"}),!i.ok)return i.status===410?Zt:ye}catch{return ye}try{const r=document.createElement("div");r.innerHTML=await i.text();const s=r.firstElementChild;if(((o=s==null?void 0:s.tagName)==null?void 0:o.toLowerCase())!=="svg")return Zt;Qe||(Qe=new DOMParser);const a=Qe.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Zt}catch{return Zt}}connectedCallback(){super.connectedCallback(),Mr(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),zr(this)}getIconSource(){const e=Xo(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:o}=this.getIconSource(),i=o?Xo(this.library):void 0;if(!t){this.svg=null;return}let r=to.get(t);if(r||(r=this.resolveIcon(t,i),to.set(t,r)),!this.initialRender)return;const s=await r;if(s===ye&&to.delete(t),t===this.getIconSource().url){if(Xr(s)){if(this.svg=s,i){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof i.mutator=="function"&&n&&i.mutator(n)}return}switch(s){case ye:case Zt:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(e=i==null?void 0:i.mutator)==null||e.call(i,this.svg),this.emit("sl-load")}}}render(){return this.svg}};Y.styles=[zt,Dr],g([U()],Y.prototype,"svg",2),g([f({reflect:!0})],Y.prototype,"name",2),g([f()],Y.prototype,"src",2),g([f()],Y.prototype,"label",2),g([f({reflect:!0})],Y.prototype,"library",2),g([nt("label")],Y.prototype,"handleLabelChange",1),g([nt(["name","src","library"])],Y.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kr={ATTRIBUTE:1},Zr=e=>(...t)=>({_$litDirective$:e,values:t});let Gr=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,i){this._$Ct=t,this._$AM=o,this._$Ci=i}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Gt=Zr(class extends Gr{constructor(e){var t;if(super(e),e.type!==Kr.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var i,r;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in t)t[s]&&!((i=this.nt)!=null&&i.has(s))&&this.st.add(s);return this.render(t)}const o=e.element.classList;for(const s of this.st)s in t||(o.remove(s),this.st.delete(s));for(const s in t){const n=!!t[s];n===this.st.has(s)||(r=this.nt)!=null&&r.has(s)||(n?(o.add(s),this.st.add(s)):(o.remove(s),this.st.delete(s)))}return yt}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oi=Symbol.for(""),Qr=e=>{if((e==null?void 0:e.r)===oi)return e==null?void 0:e._$litStatic$},ii=(e,...t)=>({_$litStatic$:t.reduce((o,i,r)=>o+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(i)+e[r+1],e[0]),r:oi}),ri=new Map,ts=e=>(t,...o)=>{const i=o.length;let r,s;const n=[],a=[];let l,c=0,h=!1;for(;c<i;){for(l=t[c];c<i&&(s=o[c],(r=Qr(s))!==void 0);)l+=r+t[++c],h=!0;c!==i&&a.push(s),n.push(l),c++}if(c===i&&n.push(t[i]),h){const d=n.join("$$lit$$");(t=ri.get(d))===void 0&&(n.raw=n,ri.set(d,t=n)),o=a}return e(t,...o)},es=ts(b);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=e=>e??w;var L=class extends J{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?ii`a`:ii`button`;return es`
      <${t}
        part="base"
        class=${Gt({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
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
    `}};L.styles=[zt,Sr],L.dependencies={"sl-icon":Y},g([$t(".icon-button")],L.prototype,"button",2),g([U()],L.prototype,"hasFocus",2),g([f()],L.prototype,"name",2),g([f()],L.prototype,"library",2),g([f()],L.prototype,"src",2),g([f()],L.prototype,"href",2),g([f()],L.prototype,"target",2),g([f()],L.prototype,"download",2),g([f()],L.prototype,"label",2),g([f({type:Boolean,reflect:!0})],L.prototype,"disabled",2);const eo=new Set,Lt=new Map;let _t,oo="ltr",io="en";const si=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(si){const e=new MutationObserver(ai);oo=document.documentElement.dir||"ltr",io=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function ni(...e){e.map(t=>{const o=t.$code.toLowerCase();Lt.has(o)?Lt.set(o,Object.assign(Object.assign({},Lt.get(o)),t)):Lt.set(o,t),_t||(_t=t)}),ai()}function ai(){si&&(oo=document.documentElement.dir||"ltr",io=document.documentElement.lang||navigator.language),[...eo.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let os=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){eo.add(this.host)}hostDisconnected(){eo.delete(this.host)}dir(){return`${this.host.dir||oo}`.toLowerCase()}lang(){return`${this.host.lang||io}`.toLowerCase()}getTranslationData(t){var o,i;const r=new Intl.Locale(t.replace(/_/g,"-")),s=r==null?void 0:r.language.toLowerCase(),n=(i=(o=r==null?void 0:r.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&i!==void 0?i:"",a=Lt.get(`${s}-${n}`),l=Lt.get(s);return{locale:r,language:s,region:n,primary:a,secondary:l}}exists(t,o){var i;const{primary:r,secondary:s}=this.getTranslationData((i=o.lang)!==null&&i!==void 0?i:this.lang());return o=Object.assign({includeFallback:!1},o),!!(r&&r[t]||s&&s[t]||o.includeFallback&&_t&&_t[t])}term(t,...o){const{primary:i,secondary:r}=this.getTranslationData(this.lang());let s;if(i&&i[t])s=i[t];else if(r&&r[t])s=r[t];else if(_t&&_t[t])s=_t[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...o):s}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(t,o)}};var li={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};ni(li);var is=li,be=class extends os{};ni(is);var xt=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return b`
      <span
        part="base"
        class=${Gt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?b`
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
    `}};xt.styles=[zt,Cr],xt.dependencies={"sl-icon-button":L},g([f({reflect:!0})],xt.prototype,"variant",2),g([f({reflect:!0})],xt.prototype,"size",2),g([f({type:Boolean,reflect:!0})],xt.prototype,"pill",2),g([f({type:Boolean})],xt.prototype,"removable",2),xt.define("sl-tag"),L.define("sl-icon-button");var rs=E`
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
`,ss=E`
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
`;const at=Math.min,N=Math.max,we=Math.round,$e=Math.floor,X=e=>({x:e,y:e}),ns={left:"right",right:"left",bottom:"top",top:"bottom"};function ro(e,t,o){return N(e,at(t,o))}function Nt(e,t){return typeof e=="function"?e(t):e}function lt(e){return e.split("-")[0]}function Dt(e){return e.split("-")[1]}function ci(e){return e==="x"?"y":"x"}function so(e){return e==="y"?"height":"width"}function Q(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function no(e){return ci(Q(e))}function as(e,t,o){o===void 0&&(o=!1);const i=Dt(e),r=no(e),s=so(r);let n=r==="x"?i===(o?"end":"start")?"right":"left":i==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(n=_e(n)),[n,_e(n)]}function ls(e){const t=_e(e);return[ao(e),t,ao(t)]}function ao(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const hi=["left","right"],di=["right","left"],cs=["top","bottom"],hs=["bottom","top"];function ds(e,t,o){switch(e){case"top":case"bottom":return o?t?di:hi:t?hi:di;case"left":case"right":return t?cs:hs;default:return[]}}function ps(e,t,o,i){const r=Dt(e);let s=ds(lt(e),o==="start",i);return r&&(s=s.map(n=>n+"-"+r),t&&(s=s.concat(s.map(ao)))),s}function _e(e){const t=lt(e);return ns[t]+e.slice(t.length)}function us(e){return{top:0,right:0,bottom:0,left:0,...e}}function pi(e){return typeof e!="number"?us(e):{top:e,right:e,bottom:e,left:e}}function xe(e){const{x:t,y:o,width:i,height:r}=e;return{width:i,height:r,top:o,left:t,right:t+i,bottom:o+r,x:t,y:o}}function ui(e,t,o){let{reference:i,floating:r}=e;const s=Q(t),n=no(t),a=so(n),l=lt(t),c=s==="y",h=i.x+i.width/2-r.width/2,d=i.y+i.height/2-r.height/2,u=i[a]/2-r[a]/2;let p;switch(l){case"top":p={x:h,y:i.y-r.height};break;case"bottom":p={x:h,y:i.y+i.height};break;case"right":p={x:i.x+i.width,y:d};break;case"left":p={x:i.x-r.width,y:d};break;default:p={x:i.x,y:i.y}}switch(Dt(t)){case"start":p[n]-=u*(o&&c?-1:1);break;case"end":p[n]+=u*(o&&c?-1:1);break}return p}async function fs(e,t){var o;t===void 0&&(t={});const{x:i,y:r,platform:s,rects:n,elements:a,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:h="viewport",elementContext:d="floating",altBoundary:u=!1,padding:p=0}=Nt(t,e),v=pi(p),_=a[u?d==="floating"?"reference":"floating":d],$=xe(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(_)))==null||o?_:_.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:h,strategy:l})),x=d==="floating"?{x:i,y:r,width:n.floating.width,height:n.floating.height}:n.reference,P=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),C=await(s.isElement==null?void 0:s.isElement(P))?await(s.getScale==null?void 0:s.getScale(P))||{x:1,y:1}:{x:1,y:1},T=xe(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:P,strategy:l}):x);return{top:($.top-T.top+v.top)/C.y,bottom:(T.bottom-$.bottom+v.bottom)/C.y,left:($.left-T.left+v.left)/C.x,right:(T.right-$.right+v.right)/C.x}}const gs=50,ms=async(e,t,o)=>{const{placement:i="bottom",strategy:r="absolute",middleware:s=[],platform:n}=o,a=n.detectOverflow?n:{...n,detectOverflow:fs},l=await(n.isRTL==null?void 0:n.isRTL(t));let c=await n.getElementRects({reference:e,floating:t,strategy:r}),{x:h,y:d}=ui(c,i,l),u=i,p=0;const v={};for(let y=0;y<s.length;y++){const _=s[y];if(!_)continue;const{name:$,fn:x}=_,{x:P,y:C,data:T,reset:S}=await x({x:h,y:d,initialPlacement:i,placement:u,strategy:r,middlewareData:v,rects:c,platform:a,elements:{reference:e,floating:t}});h=P??h,d=C??d,v[$]={...v[$],...T},S&&p<gs&&(p++,typeof S=="object"&&(S.placement&&(u=S.placement),S.rects&&(c=S.rects===!0?await n.getElementRects({reference:e,floating:t,strategy:r}):S.rects),{x:h,y:d}=ui(c,u,l)),y=-1)}return{x:h,y:d,placement:u,strategy:r,middlewareData:v}},vs=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:i,placement:r,rects:s,platform:n,elements:a,middlewareData:l}=t,{element:c,padding:h=0}=Nt(e,t)||{};if(c==null)return{};const d=pi(h),u={x:o,y:i},p=no(r),v=so(p),y=await n.getDimensions(c),_=p==="y",$=_?"top":"left",x=_?"bottom":"right",P=_?"clientHeight":"clientWidth",C=s.reference[v]+s.reference[p]-u[p]-s.floating[v],T=u[p]-s.reference[p],S=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let R=S?S[P]:0;(!R||!await(n.isElement==null?void 0:n.isElement(S)))&&(R=a.floating[P]||s.floating[v]);const ot=C/2-T/2,Z=R/2-y[v]/2-1,H=at(d[$],Z),ut=at(d[x],Z),G=H,ft=R-y[v]-ut,z=R/2-y[v]/2+ot,Tt=ro(G,z,ft),it=!l.arrow&&Dt(r)!=null&&z!==Tt&&s.reference[v]/2-(z<G?H:ut)-y[v]/2<0,V=it?z<G?z-G:z-ft:0;return{[p]:u[p]+V,data:{[p]:Tt,centerOffset:z-Tt-V,...it&&{alignmentOffset:V}},reset:it}}}),ys=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,i;const{placement:r,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:c}=t,{mainAxis:h=!0,crossAxis:d=!0,fallbackPlacements:u,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:y=!0,..._}=Nt(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const $=lt(r),x=Q(a),P=lt(a)===a,C=await(l.isRTL==null?void 0:l.isRTL(c.floating)),T=u||(P||!y?[_e(a)]:ls(a)),S=v!=="none";!u&&S&&T.push(...ps(a,y,v,C));const R=[a,...T],ot=await l.detectOverflow(t,_),Z=[];let H=((i=s.flip)==null?void 0:i.overflows)||[];if(h&&Z.push(ot[$]),d){const z=as(r,n,C);Z.push(ot[z[0]],ot[z[1]])}if(H=[...H,{placement:r,overflows:Z}],!Z.every(z=>z<=0)){var ut,G;const z=(((ut=s.flip)==null?void 0:ut.index)||0)+1,Tt=R[z];if(Tt&&(!(d==="alignment"?x!==Q(Tt):!1)||H.every(W=>Q(W.placement)===x?W.overflows[0]>0:!0)))return{data:{index:z,overflows:H},reset:{placement:Tt}};let it=(G=H.filter(V=>V.overflows[0]<=0).sort((V,W)=>V.overflows[1]-W.overflows[1])[0])==null?void 0:G.placement;if(!it)switch(p){case"bestFit":{var ft;const V=(ft=H.filter(W=>{if(S){const gt=Q(W.placement);return gt===x||gt==="y"}return!0}).map(W=>[W.placement,W.overflows.filter(gt=>gt>0).reduce((gt,ma)=>gt+ma,0)]).sort((W,gt)=>W[1]-gt[1])[0])==null?void 0:ft[0];V&&(it=V);break}case"initialPlacement":it=a;break}if(r!==it)return{reset:{placement:it}}}return{}}}},bs=new Set(["left","top"]);async function ws(e,t){const{placement:o,platform:i,elements:r}=e,s=await(i.isRTL==null?void 0:i.isRTL(r.floating)),n=lt(o),a=Dt(o),l=Q(o)==="y",c=bs.has(n)?-1:1,h=s&&l?-1:1,d=Nt(t,e);let{mainAxis:u,crossAxis:p,alignmentAxis:v}=typeof d=="number"?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return a&&typeof v=="number"&&(p=a==="end"?v*-1:v),l?{x:p*h,y:u*c}:{x:u*c,y:p*h}}const $s=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,i;const{x:r,y:s,placement:n,middlewareData:a}=t,l=await ws(t,e);return n===((o=a.offset)==null?void 0:o.placement)&&(i=a.arrow)!=null&&i.alignmentOffset?{}:{x:r+l.x,y:s+l.y,data:{...l,placement:n}}}}},_s=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:i,placement:r,platform:s}=t,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:$=>{let{x,y:P}=$;return{x,y:P}}},...c}=Nt(e,t),h={x:o,y:i},d=await s.detectOverflow(t,c),u=Q(lt(r)),p=ci(u);let v=h[p],y=h[u];if(n){const $=p==="y"?"top":"left",x=p==="y"?"bottom":"right",P=v+d[$],C=v-d[x];v=ro(P,v,C)}if(a){const $=u==="y"?"top":"left",x=u==="y"?"bottom":"right",P=y+d[$],C=y-d[x];y=ro(P,y,C)}const _=l.fn({...t,[p]:v,[u]:y});return{..._,data:{x:_.x-o,y:_.y-i,enabled:{[p]:n,[u]:a}}}}}},xs=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,i;const{placement:r,rects:s,platform:n,elements:a}=t,{apply:l=()=>{},...c}=Nt(e,t),h=await n.detectOverflow(t,c),d=lt(r),u=Dt(r),p=Q(r)==="y",{width:v,height:y}=s.floating;let _,$;d==="top"||d==="bottom"?(_=d,$=u===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):($=d,_=u==="end"?"top":"bottom");const x=y-h.top-h.bottom,P=v-h.left-h.right,C=at(y-h[_],x),T=at(v-h[$],P),S=!t.middlewareData.shift;let R=C,ot=T;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(ot=P),(i=t.middlewareData.shift)!=null&&i.enabled.y&&(R=x),S&&!u){const H=N(h.left,0),ut=N(h.right,0),G=N(h.top,0),ft=N(h.bottom,0);p?ot=v-2*(H!==0||ut!==0?H+ut:N(h.left,h.right)):R=y-2*(G!==0||ft!==0?G+ft:N(h.top,h.bottom))}await l({...t,availableWidth:ot,availableHeight:R});const Z=await n.getDimensions(a.floating);return v!==Z.width||y!==Z.height?{reset:{rects:!0}}:{}}}};function Pe(){return typeof window<"u"}function Bt(e){return fi(e)?(e.nodeName||"").toLowerCase():"#document"}function D(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function K(e){var t;return(t=(fi(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function fi(e){return Pe()?e instanceof Node||e instanceof D(e).Node:!1}function j(e){return Pe()?e instanceof Element||e instanceof D(e).Element:!1}function tt(e){return Pe()?e instanceof HTMLElement||e instanceof D(e).HTMLElement:!1}function gi(e){return!Pe()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof D(e).ShadowRoot}function Qt(e){const{overflow:t,overflowX:o,overflowY:i,display:r}=F(e);return/auto|scroll|overlay|hidden|clip/.test(t+i+o)&&r!=="inline"&&r!=="contents"}function Ps(e){return/^(table|td|th)$/.test(Bt(e))}function Ae(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const As=/transform|translate|scale|rotate|perspective|filter/,Cs=/paint|layout|strict|content/,Pt=e=>!!e&&e!=="none";let lo;function Ce(e){const t=j(e)?F(e):e;return Pt(t.transform)||Pt(t.translate)||Pt(t.scale)||Pt(t.rotate)||Pt(t.perspective)||!co()&&(Pt(t.backdropFilter)||Pt(t.filter))||As.test(t.willChange||"")||Cs.test(t.contain||"")}function Ss(e){let t=ct(e);for(;tt(t)&&!Ut(t);){if(Ce(t))return t;if(Ae(t))return null;t=ct(t)}return null}function co(){return lo==null&&(lo=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),lo}function Ut(e){return/^(html|body|#document)$/.test(Bt(e))}function F(e){return D(e).getComputedStyle(e)}function Se(e){return j(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ct(e){if(Bt(e)==="html")return e;const t=e.assignedSlot||e.parentNode||gi(e)&&e.host||K(e);return gi(t)?t.host:t}function mi(e){const t=ct(e);return Ut(t)?e.ownerDocument?e.ownerDocument.body:e.body:tt(t)&&Qt(t)?t:mi(t)}function te(e,t,o){var i;t===void 0&&(t=[]),o===void 0&&(o=!0);const r=mi(e),s=r===((i=e.ownerDocument)==null?void 0:i.body),n=D(r);if(s){const a=ho(n);return t.concat(n,n.visualViewport||[],Qt(r)?r:[],a&&o?te(a):[])}else return t.concat(r,te(r,[],o))}function ho(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function vi(e){const t=F(e);let o=parseFloat(t.width)||0,i=parseFloat(t.height)||0;const r=tt(e),s=r?e.offsetWidth:o,n=r?e.offsetHeight:i,a=we(o)!==s||we(i)!==n;return a&&(o=s,i=n),{width:o,height:i,$:a}}function po(e){return j(e)?e:e.contextElement}function Ht(e){const t=po(e);if(!tt(t))return X(1);const o=t.getBoundingClientRect(),{width:i,height:r,$:s}=vi(t);let n=(s?we(o.width):o.width)/i,a=(s?we(o.height):o.height)/r;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Es=X(0);function yi(e){const t=D(e);return!co()||!t.visualViewport?Es:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Os(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==D(e)?!1:t}function At(e,t,o,i){t===void 0&&(t=!1),o===void 0&&(o=!1);const r=e.getBoundingClientRect(),s=po(e);let n=X(1);t&&(i?j(i)&&(n=Ht(i)):n=Ht(e));const a=Os(s,o,i)?yi(s):X(0);let l=(r.left+a.x)/n.x,c=(r.top+a.y)/n.y,h=r.width/n.x,d=r.height/n.y;if(s){const u=D(s),p=i&&j(i)?D(i):i;let v=u,y=ho(v);for(;y&&i&&p!==v;){const _=Ht(y),$=y.getBoundingClientRect(),x=F(y),P=$.left+(y.clientLeft+parseFloat(x.paddingLeft))*_.x,C=$.top+(y.clientTop+parseFloat(x.paddingTop))*_.y;l*=_.x,c*=_.y,h*=_.x,d*=_.y,l+=P,c+=C,v=D(y),y=ho(v)}}return xe({width:h,height:d,x:l,y:c})}function Ee(e,t){const o=Se(e).scrollLeft;return t?t.left+o:At(K(e)).left+o}function bi(e,t){const o=e.getBoundingClientRect(),i=o.left+t.scrollLeft-Ee(e,o),r=o.top+t.scrollTop;return{x:i,y:r}}function ks(e){let{elements:t,rect:o,offsetParent:i,strategy:r}=e;const s=r==="fixed",n=K(i),a=t?Ae(t.floating):!1;if(i===n||a&&s)return o;let l={scrollLeft:0,scrollTop:0},c=X(1);const h=X(0),d=tt(i);if((d||!d&&!s)&&((Bt(i)!=="body"||Qt(n))&&(l=Se(i)),d)){const p=At(i);c=Ht(i),h.x=p.x+i.clientLeft,h.y=p.y+i.clientTop}const u=n&&!d&&!s?bi(n,l):X(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+h.x+u.x,y:o.y*c.y-l.scrollTop*c.y+h.y+u.y}}function Ts(e){return Array.from(e.getClientRects())}function Rs(e){const t=K(e),o=Se(e),i=e.ownerDocument.body,r=N(t.scrollWidth,t.clientWidth,i.scrollWidth,i.clientWidth),s=N(t.scrollHeight,t.clientHeight,i.scrollHeight,i.clientHeight);let n=-o.scrollLeft+Ee(e);const a=-o.scrollTop;return F(i).direction==="rtl"&&(n+=N(t.clientWidth,i.clientWidth)-r),{width:r,height:s,x:n,y:a}}const wi=25;function Ms(e,t){const o=D(e),i=K(e),r=o.visualViewport;let s=i.clientWidth,n=i.clientHeight,a=0,l=0;if(r){s=r.width,n=r.height;const h=co();(!h||h&&t==="fixed")&&(a=r.offsetLeft,l=r.offsetTop)}const c=Ee(i);if(c<=0){const h=i.ownerDocument,d=h.body,u=getComputedStyle(d),p=h.compatMode==="CSS1Compat"&&parseFloat(u.marginLeft)+parseFloat(u.marginRight)||0,v=Math.abs(i.clientWidth-d.clientWidth-p);v<=wi&&(s-=v)}else c<=wi&&(s+=c);return{width:s,height:n,x:a,y:l}}function zs(e,t){const o=At(e,!0,t==="fixed"),i=o.top+e.clientTop,r=o.left+e.clientLeft,s=tt(e)?Ht(e):X(1),n=e.clientWidth*s.x,a=e.clientHeight*s.y,l=r*s.x,c=i*s.y;return{width:n,height:a,x:l,y:c}}function $i(e,t,o){let i;if(t==="viewport")i=Ms(e,o);else if(t==="document")i=Rs(K(e));else if(j(t))i=zs(t,o);else{const r=yi(e);i={x:t.x-r.x,y:t.y-r.y,width:t.width,height:t.height}}return xe(i)}function _i(e,t){const o=ct(e);return o===t||!j(o)||Ut(o)?!1:F(o).position==="fixed"||_i(o,t)}function Ls(e,t){const o=t.get(e);if(o)return o;let i=te(e,[],!1).filter(a=>j(a)&&Bt(a)!=="body"),r=null;const s=F(e).position==="fixed";let n=s?ct(e):e;for(;j(n)&&!Ut(n);){const a=F(n),l=Ce(n);!l&&a.position==="fixed"&&(r=null),(s?!l&&!r:!l&&a.position==="static"&&!!r&&(r.position==="absolute"||r.position==="fixed")||Qt(n)&&!l&&_i(e,n))?i=i.filter(h=>h!==n):r=a,n=ct(n)}return t.set(e,i),i}function Ns(e){let{element:t,boundary:o,rootBoundary:i,strategy:r}=e;const n=[...o==="clippingAncestors"?Ae(t)?[]:Ls(t,this._c):[].concat(o),i],a=$i(t,n[0],r);let l=a.top,c=a.right,h=a.bottom,d=a.left;for(let u=1;u<n.length;u++){const p=$i(t,n[u],r);l=N(p.top,l),c=at(p.right,c),h=at(p.bottom,h),d=N(p.left,d)}return{width:c-d,height:h-l,x:d,y:l}}function Ds(e){const{width:t,height:o}=vi(e);return{width:t,height:o}}function Bs(e,t,o){const i=tt(t),r=K(t),s=o==="fixed",n=At(e,!0,s,t);let a={scrollLeft:0,scrollTop:0};const l=X(0);function c(){l.x=Ee(r)}if(i||!i&&!s)if((Bt(t)!=="body"||Qt(r))&&(a=Se(t)),i){const p=At(t,!0,s,t);l.x=p.x+t.clientLeft,l.y=p.y+t.clientTop}else r&&c();s&&!i&&r&&c();const h=r&&!i&&!s?bi(r,a):X(0),d=n.left+a.scrollLeft-l.x-h.x,u=n.top+a.scrollTop-l.y-h.y;return{x:d,y:u,width:n.width,height:n.height}}function uo(e){return F(e).position==="static"}function xi(e,t){if(!tt(e)||F(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return K(e)===o&&(o=o.ownerDocument.body),o}function Pi(e,t){const o=D(e);if(Ae(e))return o;if(!tt(e)){let r=ct(e);for(;r&&!Ut(r);){if(j(r)&&!uo(r))return r;r=ct(r)}return o}let i=xi(e,t);for(;i&&Ps(i)&&uo(i);)i=xi(i,t);return i&&Ut(i)&&uo(i)&&!Ce(i)?o:i||Ss(e)||o}const Us=async function(e){const t=this.getOffsetParent||Pi,o=this.getDimensions,i=await o(e.floating);return{reference:Bs(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}};function Hs(e){return F(e).direction==="rtl"}const Oe={convertOffsetParentRelativeRectToViewportRelativeRect:ks,getDocumentElement:K,getClippingRect:Ns,getOffsetParent:Pi,getElementRects:Us,getClientRects:Ts,getDimensions:Ds,getScale:Ht,isElement:j,isRTL:Hs};function Ai(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Is(e,t){let o=null,i;const r=K(e);function s(){var a;clearTimeout(i),(a=o)==null||a.disconnect(),o=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:h,top:d,width:u,height:p}=c;if(a||t(),!u||!p)return;const v=$e(d),y=$e(r.clientWidth-(h+u)),_=$e(r.clientHeight-(d+p)),$=$e(h),P={rootMargin:-v+"px "+-y+"px "+-_+"px "+-$+"px",threshold:N(0,at(1,l))||1};let C=!0;function T(S){const R=S[0].intersectionRatio;if(R!==l){if(!C)return n();R?n(!1,R):i=setTimeout(()=>{n(!1,1e-7)},1e3)}R===1&&!Ai(c,e.getBoundingClientRect())&&n(),C=!1}try{o=new IntersectionObserver(T,{...P,root:r.ownerDocument})}catch{o=new IntersectionObserver(T,P)}o.observe(e)}return n(!0),s}function js(e,t,o,i){i===void 0&&(i={});const{ancestorScroll:r=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=i,c=po(e),h=r||s?[...c?te(c):[],...t?te(t):[]]:[];h.forEach($=>{r&&$.addEventListener("scroll",o,{passive:!0}),s&&$.addEventListener("resize",o)});const d=c&&a?Is(c,o):null;let u=-1,p=null;n&&(p=new ResizeObserver($=>{let[x]=$;x&&x.target===c&&p&&t&&(p.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{var P;(P=p)==null||P.observe(t)})),o()}),c&&!l&&p.observe(c),t&&p.observe(t));let v,y=l?At(e):null;l&&_();function _(){const $=At(e);y&&!Ai(y,$)&&o(),y=$,v=requestAnimationFrame(_)}return o(),()=>{var $;h.forEach(x=>{r&&x.removeEventListener("scroll",o),s&&x.removeEventListener("resize",o)}),d==null||d(),($=p)==null||$.disconnect(),p=null,l&&cancelAnimationFrame(v)}}const Fs=$s,Vs=_s,Ws=ys,Ci=xs,qs=vs,Js=(e,t,o)=>{const i=new Map,r={platform:Oe,...o},s={...r.platform,_c:i};return ms(e,t,{...r,platform:s})};function Ys(e){return Xs(e)}function fo(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Xs(e){for(let t=e;t;t=fo(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=fo(e);t;t=fo(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||Ce(o)||t.tagName==="BODY"))return t}return null}function Ks(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var A=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom");let i=0,r=0,s=0,n=0,a=0,l=0,c=0,h=0;o?e.top<t.top?(i=e.left,r=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,h=t.top):(i=t.left,r=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,h=e.top):e.left<t.left?(i=e.right,r=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,h=t.bottom):(i=t.right,r=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,h=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||Ks(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=js(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Fs({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(Ci({apply:({rects:o})=>{const i=this.sync==="width"||this.sync==="both",r=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${o.reference.width}px`:"",this.popup.style.height=r?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(Ws({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(Vs({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(Ci({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(qs({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?o=>Oe.getOffsetParent(o,Ys):Oe.getOffsetParent;Js(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:ti(me({},Oe),{getOffsetParent:t})}).then(({x:o,y:i,middlewareData:r,placement:s})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${o}px`,top:`${i}px`}),this.arrow){const l=r.arrow.x,c=r.arrow.y;let h="",d="",u="",p="";if(this.arrowPlacement==="start"){const v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",d=n?v:"",p=n?"":v}else if(this.arrowPlacement==="end"){const v=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=n?"":v,p=n?v:"",u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(p=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(p=typeof l=="number"?`${l}px`:"",h=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:h,right:d,bottom:u,left:p,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return b`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${Gt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${Gt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?b`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};A.styles=[zt,ss],g([$t(".popup")],A.prototype,"popup",2),g([$t(".popup__arrow")],A.prototype,"arrowEl",2),g([f()],A.prototype,"anchor",2),g([f({type:Boolean,reflect:!0})],A.prototype,"active",2),g([f({reflect:!0})],A.prototype,"placement",2),g([f({reflect:!0})],A.prototype,"strategy",2),g([f({type:Number})],A.prototype,"distance",2),g([f({type:Number})],A.prototype,"skidding",2),g([f({type:Boolean})],A.prototype,"arrow",2),g([f({attribute:"arrow-placement"})],A.prototype,"arrowPlacement",2),g([f({attribute:"arrow-padding",type:Number})],A.prototype,"arrowPadding",2),g([f({type:Boolean})],A.prototype,"flip",2),g([f({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],A.prototype,"flipFallbackPlacements",2),g([f({attribute:"flip-fallback-strategy"})],A.prototype,"flipFallbackStrategy",2),g([f({type:Object})],A.prototype,"flipBoundary",2),g([f({attribute:"flip-padding",type:Number})],A.prototype,"flipPadding",2),g([f({type:Boolean})],A.prototype,"shift",2),g([f({type:Object})],A.prototype,"shiftBoundary",2),g([f({attribute:"shift-padding",type:Number})],A.prototype,"shiftPadding",2),g([f({attribute:"auto-size"})],A.prototype,"autoSize",2),g([f()],A.prototype,"sync",2),g([f({type:Object})],A.prototype,"autoSizeBoundary",2),g([f({attribute:"auto-size-padding",type:Number})],A.prototype,"autoSizePadding",2),g([f({attribute:"hover-bridge",type:Boolean})],A.prototype,"hoverBridge",2);var Si=new Map,Zs=new WeakMap;function Gs(e){return e??{keyframes:[],options:{duration:0}}}function Ei(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function Oi(e,t){Si.set(e,Gs(t))}function ki(e,t,o){const i=Zs.get(e);if(i!=null&&i[t])return Ei(i[t],o.dir);const r=Si.get(t);return r?Ei(r,o.dir):{keyframes:[],options:{duration:0}}}function Ti(e,t){return new Promise(o=>{function i(r){r.target===e&&(e.removeEventListener(t,i),o())}e.addEventListener(t,i)})}function Ri(e,t,o){return new Promise(i=>{if((o==null?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const r=e.animate(t,ti(me({},o),{duration:Qs()?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function Mi(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function Qs(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function zi(e){return Promise.all(e.getAnimations().map(t=>new Promise(o=>{t.cancel(),requestAnimationFrame(o)})))}var k=class extends J{constructor(){super(),this.localize=new be(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=Mi(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=Mi(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await zi(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:o,options:i}=ki(this,"tooltip.show",{dir:this.localize.dir()});await Ri(this.popup.popup,o,i),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await zi(this.body);const{keyframes:o,options:i}=ki(this,"tooltip.hide",{dir:this.localize.dir()});await Ri(this.popup.popup,o,i),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Ti(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Ti(this,"sl-after-hide")}render(){return b`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${Gt({tooltip:!0,"tooltip--open":this.open})}
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
    `}};k.styles=[zt,rs],k.dependencies={"sl-popup":A},g([$t("slot:not([name])")],k.prototype,"defaultSlot",2),g([$t(".tooltip__body")],k.prototype,"body",2),g([$t("sl-popup")],k.prototype,"popup",2),g([f()],k.prototype,"content",2),g([f()],k.prototype,"placement",2),g([f({type:Boolean,reflect:!0})],k.prototype,"disabled",2),g([f({type:Number})],k.prototype,"distance",2),g([f({type:Boolean,reflect:!0})],k.prototype,"open",2),g([f({type:Number})],k.prototype,"skidding",2),g([f()],k.prototype,"trigger",2),g([f({type:Boolean})],k.prototype,"hoist",2),g([nt("open",{waitUntilFirstUpdate:!0})],k.prototype,"handleOpenChange",1),g([nt(["content","distance","hoist","placement","skidding"])],k.prototype,"handleOptionsChange",1),g([nt("disabled")],k.prototype,"handleDisabledChange",1),Oi("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),Oi("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),k.define("sl-tooltip"),Y.define("sl-icon");var tn=E`
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
`;function en(e,t){function o(r){const s=e.getBoundingClientRect(),n=e.ownerDocument.defaultView,a=s.left+n.scrollX,l=s.top+n.scrollY,c=r.pageX-a,h=r.pageY-l;t!=null&&t.onMove&&t.onMove(c,h)}function i(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",i),t!=null&&t.onStop&&t.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",i),(t==null?void 0:t.initialEvent)instanceof PointerEvent&&o(t.initialEvent)}function Li(e,t,o){const i=r=>Object.is(r,-0)?0:r;return e<t?i(t):e>o?i(o):i(e)}var Ni=()=>null,B=class extends J{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new be(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=Ni,this.snapThreshold=12}toSnapFunction(e){const t=e.split(" ");return({pos:o,size:i,snapThreshold:r,isRtl:s,vertical:n})=>{let a=o,l=Number.POSITIVE_INFINITY;return t.forEach(c=>{let h;if(c.startsWith("repeat(")){const u=e.substring(7,e.length-1),p=u.endsWith("%"),v=Number.parseFloat(u),y=p?i*(v/100):v;h=Math.round((s&&!n?i-o:o)/y)*y}else c.endsWith("%")?h=i*(Number.parseFloat(c)/100):h=Number.parseFloat(c);s&&!n&&(h=i-h);const d=Math.abs(o-h);d<=r&&d<l&&(a=h,l=d)}),a}}set snap(e){this.snapValue=e??"",e?this.snapFunction=typeof e=="string"?this.toSnapFunction(e):e:this.snapFunction=Ni}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),en(this,{onMove:(o,i)=>{var r;let s=this.vertical?i:o;this.primary==="end"&&(s=this.size-s),s=(r=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical}))!=null?r:s,this.position=Li(this.pixelsToPercentage(s),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){let t=this.position;const o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);if(e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),e.key==="Enter")if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const i=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=i})}this.position=Li(t,0,100)}}handleResize(e){const{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",i=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,r="auto";return this.primary==="end"?o&&!this.vertical?this.style[e]=`${i} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${i}`:o&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${i}`:this.style[e]=`${i} var(--divider-width) ${r}`,this.style[t]="",b`
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
    `}};B.styles=[zt,tn],g([$t(".divider")],B.prototype,"divider",2),g([f({type:Number,reflect:!0})],B.prototype,"position",2),g([f({attribute:"position-in-pixels",type:Number})],B.prototype,"positionInPixels",2),g([f({type:Boolean,reflect:!0})],B.prototype,"vertical",2),g([f({type:Boolean,reflect:!0})],B.prototype,"disabled",2),g([f()],B.prototype,"primary",2),g([f({reflect:!0})],B.prototype,"snap",1),g([f({type:Number,attribute:"snap-threshold"})],B.prototype,"snapThreshold",2),g([nt("position")],B.prototype,"handlePositionChange",1),g([nt("positionInPixels")],B.prototype,"handlePositionInPixelsChange",1),g([nt("vertical")],B.prototype,"handleVerticalChange",1),B.define("sl-split-panel");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const go=e=>(t,o)=>{o!==void 0?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ke=globalThis,mo=ke.ShadowRoot&&(ke.ShadyCSS===void 0||ke.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,vo=Symbol(),Di=new WeakMap;let Bi=class{constructor(t,o,i){if(this._$cssResult$=!0,i!==vo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(mo&&t===void 0){const i=o!==void 0&&o.length===1;i&&(t=Di.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Di.set(o,t))}return t}toString(){return this.cssText}};const on=e=>new Bi(typeof e=="string"?e:e+"",void 0,vo),Te=(e,...t)=>{const o=e.length===1?e[0]:t.reduce(((i,r,s)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1]),e[0]);return new Bi(o,e,vo)},rn=(e,t)=>{if(mo)e.adoptedStyleSheets=t.map((o=>o instanceof CSSStyleSheet?o:o.styleSheet));else for(const o of t){const i=document.createElement("style"),r=ke.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=o.cssText,e.appendChild(i)}},Ui=mo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const i of t.cssRules)o+=i.cssText;return on(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:sn,defineProperty:nn,getOwnPropertyDescriptor:an,getOwnPropertyNames:ln,getOwnPropertySymbols:cn,getPrototypeOf:hn}=Object,ht=globalThis,Hi=ht.trustedTypes,dn=Hi?Hi.emptyScript:"",yo=ht.reactiveElementPolyfillSupport,ee=(e,t)=>e,Re={toAttribute(e,t){switch(t){case Boolean:e=e?dn:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},bo=(e,t)=>!sn(e,t),Ii={attribute:!0,type:String,converter:Re,reflect:!1,useDefault:!1,hasChanged:bo};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ht.litPropertyMetadata??(ht.litPropertyMetadata=new WeakMap);let It=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Ii){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,o);r!==void 0&&nn(this.prototype,t,r)}}static getPropertyDescriptor(t,o,i){const{get:r,set:s}=an(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:r,set(n){const a=r==null?void 0:r.call(this);s==null||s.call(this,n),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ii}static _$Ei(){if(this.hasOwnProperty(ee("elementProperties")))return;const t=hn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ee("properties"))){const o=this.properties,i=[...ln(o),...cn(o)];for(const r of i)this.createProperty(r,o[r])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[i,r]of o)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[o,i]of this.elementProperties){const r=this._$Eu(o,i);r!==void 0&&this._$Eh.set(r,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const r of i)o.unshift(Ui(r))}else t!==void 0&&o.push(Ui(t));return o}static _$Eu(t,o){const i=o.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((o=>this.enableUpdating=o)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((o=>o(this)))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const i of o.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((o=>{var i;return(i=o.hostConnected)==null?void 0:i.call(o)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((o=>{var i;return(i=o.hostDisconnected)==null?void 0:i.call(o)}))}attributeChangedCallback(t,o,i){this._$AK(t,i)}_$ET(t,o){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const n=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Re).toAttribute(o,i.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,o){var s,n;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=i.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:Re;this._$Em=r;const c=l.fromAttribute(o,a.type);this[r]=c??((n=this._$Ej)==null?void 0:n.get(r))??c,this._$Em=null}}requestUpdate(t,o,i){var r;if(t!==void 0){const s=this.constructor,n=this[t];if(i??(i=s.getPropertyOptions(t)),!((i.hasChanged??bo)(n,o)||i.useDefault&&i.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,o,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:i,reflect:r,wrapped:s},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),s!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(o=void 0),this._$AL.set(t,o)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[s,n]of r){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(i=this._$EO)==null||i.forEach((r=>{var s;return(s=r.hostUpdate)==null?void 0:s.call(r)})),this.update(o)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach((i=>{var r;return(r=i.hostUpdated)==null?void 0:r.call(i)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((o=>this._$ET(o,this[o])))),this._$EM()}updated(t){}firstUpdated(t){}};It.elementStyles=[],It.shadowRootOptions={mode:"open"},It[ee("elementProperties")]=new Map,It[ee("finalized")]=new Map,yo==null||yo({ReactiveElement:It}),(ht.reactiveElementVersions??(ht.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pn={attribute:!0,type:String,converter:Re,reflect:!1,hasChanged:bo},un=(e=pn,t,o)=>{const{kind:i,metadata:r}=o;let s=globalThis.litPropertyMetadata.get(r);if(s===void 0&&globalThis.litPropertyMetadata.set(r,s=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),i==="accessor"){const{name:n}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(i==="setter"){const{name:n}=o;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e)}}throw Error("Unsupported decorator location: "+i)};function et(e){return(t,o)=>typeof o=="object"?un(e,t,o):((i,r,s)=>{const n=r.hasOwnProperty(s);return r.constructor.createProperty(s,i),n?Object.getOwnPropertyDescriptor(r,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ji(e){return et({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oe=globalThis,Me=oe.trustedTypes,Fi=Me?Me.createPolicy("lit-html",{createHTML:e=>e}):void 0,Vi="$lit$",dt=`lit$${Math.random().toFixed(9).slice(2)}$`,Wi="?"+dt,fn=`<${Wi}>`,Ct=document,ie=()=>Ct.createComment(""),re=e=>e===null||typeof e!="object"&&typeof e!="function",wo=Array.isArray,gn=e=>wo(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",$o=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qi=/-->/g,Ji=/>/g,St=RegExp(`>|${$o}(?:([^\\s"'>=/]+)(${$o}*=${$o}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yi=/'/g,Xi=/"/g,Ki=/^(?:script|style|textarea|title)$/i,mn=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),_o=mn(1),jt=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Zi=new WeakMap,Et=Ct.createTreeWalker(Ct,129);function Gi(e,t){if(!wo(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fi!==void 0?Fi.createHTML(t):t}const vn=(e,t)=>{const o=e.length-1,i=[];let r,s=t===2?"<svg>":t===3?"<math>":"",n=se;for(let a=0;a<o;a++){const l=e[a];let c,h,d=-1,u=0;for(;u<l.length&&(n.lastIndex=u,h=n.exec(l),h!==null);)u=n.lastIndex,n===se?h[1]==="!--"?n=qi:h[1]!==void 0?n=Ji:h[2]!==void 0?(Ki.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=St):h[3]!==void 0&&(n=St):n===St?h[0]===">"?(n=r??se,d=-1):h[1]===void 0?d=-2:(d=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?St:h[3]==='"'?Xi:Yi):n===Xi||n===Yi?n=St:n===qi||n===Ji?n=se:(n=St,r=void 0);const p=n===St&&e[a+1].startsWith("/>")?" ":"";s+=n===se?l+fn:d>=0?(i.push(c),l.slice(0,d)+Vi+l.slice(d)+dt+p):l+dt+(d===-2?a:p)}return[Gi(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class ne{constructor({strings:t,_$litType$:o},i){let r;this.parts=[];let s=0,n=0;const a=t.length-1,l=this.parts,[c,h]=vn(t,o);if(this.el=ne.createElement(c,i),Et.currentNode=this.el.content,o===2||o===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=Et.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Vi)){const u=h[n++],p=r.getAttribute(d).split(dt),v=/([.?@])?(.*)/.exec(u);l.push({type:1,index:s,name:v[2],strings:p,ctor:v[1]==="."?bn:v[1]==="?"?wn:v[1]==="@"?$n:ze}),r.removeAttribute(d)}else d.startsWith(dt)&&(l.push({type:6,index:s}),r.removeAttribute(d));if(Ki.test(r.tagName)){const d=r.textContent.split(dt),u=d.length-1;if(u>0){r.textContent=Me?Me.emptyScript:"";for(let p=0;p<u;p++)r.append(d[p],ie()),Et.nextNode(),l.push({type:2,index:++s});r.append(d[u],ie())}}}else if(r.nodeType===8)if(r.data===Wi)l.push({type:2,index:s});else{let d=-1;for(;(d=r.data.indexOf(dt,d+1))!==-1;)l.push({type:7,index:s}),d+=dt.length-1}s++}}static createElement(t,o){const i=Ct.createElement("template");return i.innerHTML=t,i}}function Ft(e,t,o=e,i){var n,a;if(t===jt)return t;let r=i!==void 0?(n=o._$Co)==null?void 0:n[i]:o._$Cl;const s=re(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==s&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),s===void 0?r=void 0:(r=new s(e),r._$AT(e,o,i)),i!==void 0?(o._$Co??(o._$Co=[]))[i]=r:o._$Cl=r),r!==void 0&&(t=Ft(e,r._$AS(e,t.values),r,i)),t}class yn{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:i}=this._$AD,r=((t==null?void 0:t.creationScope)??Ct).importNode(o,!0);Et.currentNode=r;let s=Et.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ae(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new _n(s,this,t)),this._$AV.push(c),l=i[++a]}n!==(l==null?void 0:l.index)&&(s=Et.nextNode(),n++)}return Et.currentNode=Ct,r}p(t){let o=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,o),o+=i.strings.length-2):i._$AI(t[o])),o++}}class ae{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,i,r){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=i,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Ft(this,t,o),re(t)?t===O||t==null||t===""?(this._$AH!==O&&this._$AR(),this._$AH=O):t!==this._$AH&&t!==jt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==O&&re(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ct.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ne.createElement(Gi(i.h,i.h[0]),this.options)),i);if(((s=this._$AH)==null?void 0:s._$AD)===r)this._$AH.p(o);else{const n=new yn(r,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(t){let o=Zi.get(t.strings);return o===void 0&&Zi.set(t.strings,o=new ne(t)),o}k(t){wo(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let i,r=0;for(const s of t)r===o.length?o.push(i=new ae(this.O(ie()),this.O(ie()),this,this.options)):i=o[r],i._$AI(s),r++;r<o.length&&(this._$AR(i&&i._$AB.nextSibling,r),o.length=r)}_$AR(t=this._$AA.nextSibling,o){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,o);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}}class ze{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,i,r,s){this.type=1,this._$AH=O,this._$AN=void 0,this.element=t,this.name=o,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=O}_$AI(t,o=this,i,r){const s=this.strings;let n=!1;if(s===void 0)t=Ft(this,t,o,0),n=!re(t)||t!==this._$AH&&t!==jt,n&&(this._$AH=t);else{const a=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Ft(this,a[i+l],o,l),c===jt&&(c=this._$AH[l]),n||(n=!re(c)||c!==this._$AH[l]),c===O?t=O:t!==O&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!r&&this.j(t)}j(t){t===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class bn extends ze{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===O?void 0:t}}class wn extends ze{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==O)}}class $n extends ze{constructor(t,o,i,r,s){super(t,o,i,r,s),this.type=5}_$AI(t,o=this){if((t=Ft(this,t,o,0)??O)===jt)return;const i=this._$AH,r=t===O&&i!==O||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==O&&(i===O||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}}class _n{constructor(t,o,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Ft(this,t)}}const xo=oe.litHtmlPolyfillSupport;xo==null||xo(ne,ae),(oe.litHtmlVersions??(oe.litHtmlVersions=[])).push("3.3.1");const xn=(e,t,o)=>{const i=(o==null?void 0:o.renderBefore)??t;let r=i._$litPart$;if(r===void 0){const s=(o==null?void 0:o.renderBefore)??null;i._$litPart$=r=new ae(t.insertBefore(ie(),s),s,void 0,o??{})}return r._$AI(e),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis;class kt extends It{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=xn(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return jt}}kt._$litElement$=!0,kt.finalized=!0,(rr=Ot.litElementHydrateSupport)==null||rr.call(Ot,{LitElement:kt});const Po=Ot.litElementPolyfillSupport;Po==null||Po({LitElement:kt}),(Ot.litElementVersions??(Ot.litElementVersions=[])).push("4.2.1");function Pn(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const An=Te`
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
`;var Cn=Object.defineProperty,Sn=Object.getOwnPropertyDescriptor,Vt=(e,t,o,i)=>{for(var r=i>1?void 0:i?Sn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&Cn(t,o,r),r};let pt=class extends kt{constructor(){super(),this.lower=!1,this.method="GET"}render(){let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.micro?`method ${e} micro`:`method ${e}`;return _o`
            <sl-tag variant="${Pn(this.method)}" class="${t}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};pt.styles=An,Vt([et()],pt.prototype,"method",2),Vt([et({type:Boolean})],pt.prototype,"lower",2),Vt([et({type:Boolean})],pt.prototype,"large",2),Vt([et({type:Boolean})],pt.prototype,"tiny",2),Vt([et({type:Boolean})],pt.prototype,"micro",2),pt=Vt([go("pb33f-http-method")],pt);const En=Te`
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
    }`;var On=Object.defineProperty,kn=Object.getOwnPropertyDescriptor,Le=(e,t,o,i)=>{for(var r=i>1?void 0:i?kn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&On(t,o,r),r};let Wt=class extends kt{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return _o` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};Wt.styles=En,Le([et()],Wt.prototype,"name",2),Le([et()],Wt.prototype,"url",2),Le([et({type:Boolean})],Wt.prototype,"wide",2),Wt=Le([go("pb33f-header")],Wt);const Tn=Te`

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

`,Rn=Te`
    
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
 `,Mn="pb33f-theme-change";var zn=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,Ao=(e,t,o,i)=>{for(var r=i>1?void 0:i?Ln(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&zn(t,o,r),r};const Co="dark",Nn="light",Dn="tektronix",Qi="pb33f-theme",tr="pb33f-base-theme";let le=class extends kt{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Dn:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(Qi);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(tr);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(Qi,e),localStorage.setItem(tr,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===Nn?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Mn,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Co?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===Co?"sun":"moon",t=this.baseTheme===Co?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",o=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return _o`
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
        `}};le.styles=[Tn,Rn],Ao([ji()],le.prototype,"baseTheme",2),Ao([ji()],le.prototype,"tektronixActive",2),le=Ao([go("pb33f-theme-switcher")],le);const Bn=E`
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

    .nav-panel {
        overflow-y: auto;
        height: calc(100vh - var(--pp-header-height, 57px));
        background: var(--background-color);
    }

    .content-panel {
        overflow-y: auto;
        height: calc(100vh - var(--pp-header-height, 57px));
        padding: 2rem 3rem;
        max-width: 1000px;
    }
`;var Un=Object.defineProperty,Hn=Object.getOwnPropertyDescriptor,So=(e,t,o,i)=>{for(var r=i>1?void 0:i?Hn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&Un(t,o,r),r};const er="pp-split-position",In=20;m.PpLayout=class extends M{constructor(){super(...arguments),this.title="",this.splitPos=In}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const t=sessionStorage.getItem(er);t&&(this.splitPos=parseFloat(t))}onReposition(t){const o=t.target.position;typeof o=="number"&&(this.splitPos=o,sessionStorage.setItem(er,String(o)))}render(){return b`
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
    `}},m.PpLayout.styles=Bn,So([U()],m.PpLayout.prototype,"title",2),So([U()],m.PpLayout.prototype,"splitPos",2),m.PpLayout=So([q("pp-layout")],m.PpLayout);const jn=E`
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
`;var Fn=Object.defineProperty,Vn=Object.getOwnPropertyDescriptor,Eo=(e,t,o,i)=>{for(var r=i>1?void 0:i?Vn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&Fn(t,o,r),r};m.PpNav=class extends M{constructor(){super(...arguments),this.tags=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return b`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?b`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(t=>b`<pp-nav-tag .tag=${t} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:w}
    `}},m.PpNav.styles=jn,Eo([U()],m.PpNav.prototype,"tags",2),Eo([U()],m.PpNav.prototype,"activeSlug",2),m.PpNav=Eo([q("pp-nav")],m.PpNav);const Wn=E`
    :host {
        display: block;
        margin: var(--global-padding) 0 var(--global-padding) 0;
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
        padding: var(--global-padding-double) 0 var(--global-padding-double) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-top: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    li a {
        display: flex;
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
        color: var(--primary-color);
    }

    .op-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--font-stack-bold), monospace;
        font-size: var(--smaller-font);
        
    }

    .children {
        margin-top: var(--global-padding);
        margin-left: 15px;
        margin-bottom: var(--global-padding);
      
    }

    .deprecated {
        text-decoration: line-through;
        opacity: 0.5;
    }
`;var qn=Object.defineProperty,Jn=Object.getOwnPropertyDescriptor,Ne=(e,t,o,i)=>{for(var r=i>1?void 0:i?Jn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&qn(t,o,r),r};function Oo(e,t){var o,i;return t?!!((o=e.Operations)!=null&&o.some(r=>r.Slug===t)||(i=e.Children)!=null&&i.some(r=>Oo(r,t))):!1}m.PpNavTag=class extends M{constructor(){super(...arguments),this.tag={Name:"",Summary:"",Children:null,Operations:null,IsNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("tag")||t.has("activeSlug"))&&Oo(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,n;const{tag:t,activeSlug:o,open:i}=this,r=Oo(t,o);return b`
            <div class="tag-header ${r?"active":""}" @click=${this.toggle}>
                <sl-icon name=${i?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${t.Summary||t.Name}</span>
            </div>
            ${i?b`
                        <div class="tag-body">
                            ${(s=t.Operations)!=null&&s.length?b`
                                        <ul>
                                            ${t.Operations.map(a=>b`
                                                        <li>
                                                            <a
                                                                    href="operations/${a.Slug}.html"
                                                                    class="${a.Deprecated?"deprecated":""} ${a.Slug===o?"active":""}"
                                                            >
                                                                <pb33f-http-method tiny
                                                                        method=${a.Method}></pb33f-http-method>
                                                                <span class="op-title">${a.Summary||a.Path}</span>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:w}
                            ${(n=t.Children)!=null&&n.length?b`
                                        <div class="children">
                                            ${t.Children.map(a=>b`
                                                        <pp-nav-tag .tag=${a}
                                                                    .activeSlug=${o}></pp-nav-tag>`)}
                                        </div>
                                    `:w}
                        </div>
                    `:w}
        `}},m.PpNavTag.styles=Wn,Ne([f({type:Object})],m.PpNavTag.prototype,"tag",2),Ne([f()],m.PpNavTag.prototype,"activeSlug",2),Ne([U()],m.PpNavTag.prototype,"open",2),m.PpNavTag=Ne([q("pp-nav-tag")],m.PpNavTag);const Yn=E`
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
`;var Xn=Object.defineProperty,Kn=Object.getOwnPropertyDescriptor,ce=(e,t,o,i)=>{for(var r=i>1?void 0:i?Kn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&Xn(t,o,r),r};m.PpNavOperation=class extends M{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return b`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},m.PpNavOperation.styles=Yn,ce([f()],m.PpNavOperation.prototype,"method",2),ce([f()],m.PpNavOperation.prototype,"path",2),ce([f()],m.PpNavOperation.prototype,"slug",2),ce([f({type:Boolean})],m.PpNavOperation.prototype,"deprecated",2),m.PpNavOperation=ce([q("pp-nav-operation")],m.PpNavOperation);const or=E`
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
`,Zn=E`
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
`;var Gn=Object.defineProperty,Qn=Object.getOwnPropertyDescriptor,ko=(e,t,o,i)=>{for(var r=i>1?void 0:i?Qn(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&Gn(t,o,r),r};m.PpOperationPage=class extends M{constructor(){super(...arguments),this.operationJson="",this.parsed=null}willUpdate(t){if(t.has("operationJson")&&this.operationJson)try{this.parsed=JSON.parse(this.operationJson)}catch{this.parsed=null}}render(){return this.parsed?b`
      <h3>Raw Operation Definition</h3>
      <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
    `:w}},m.PpOperationPage.styles=[or,Zn],ko([f({attribute:"operation-json"})],m.PpOperationPage.prototype,"operationJson",2),ko([U()],m.PpOperationPage.prototype,"parsed",2),m.PpOperationPage=ko([q("pp-operation-page")],m.PpOperationPage);const ta=E`
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
`;var ea=Object.defineProperty,oa=Object.getOwnPropertyDescriptor,De=(e,t,o,i)=>{for(var r=i>1?void 0:i?oa(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&ea(t,o,r),r};m.PpModelPage=class extends M{constructor(){super(...arguments),this.modelJson="",this.name="",this.parsed=null}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}render(){if(!this.parsed)return w;const t=this.parsed,o=t.properties||{},i=new Set(t.required||[]),r=Object.entries(o);return b`
      ${t.type?b`<div><strong>Type:</strong> ${t.type}</div>`:w}
      ${r.length?b`
            <h3>Properties</h3>
            ${r.map(([s,n])=>b`
                <div class="property">
                  <span class="prop-name">${s}</span>
                  ${n.type?b`<span class="prop-type">${n.type}</span>`:w}
                  ${i.has(s)?b`<span class="required-badge">required</span>`:w}
                  ${n.description?b`<div class="prop-desc">${n.description}</div>`:w}
                </div>
              `)}
          `:w}
      <h3>Schema Definition</h3>
      <pre><code>${JSON.stringify(t,null,2)}</code></pre>
    `}},m.PpModelPage.styles=[or,ta],De([f({attribute:"model-json"})],m.PpModelPage.prototype,"modelJson",2),De([f()],m.PpModelPage.prototype,"name",2),De([U()],m.PpModelPage.prototype,"parsed",2),m.PpModelPage=De([q("pp-model-page")],m.PpModelPage);const ia=E`
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
`;var ra=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,Be=(e,t,o,i)=>{for(var r=i>1?void 0:i?sa(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&ra(t,o,r),r};m.PpModelCard=class extends M{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return b`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?b`<p>${this.description}</p>`:""}
      </a>
    `}},m.PpModelCard.styles=ia,Be([f()],m.PpModelCard.prototype,"name",2),Be([f()],m.PpModelCard.prototype,"href",2),Be([f()],m.PpModelCard.prototype,"description",2),m.PpModelCard=Be([q("pp-model-card")],m.PpModelCard);const na=E`
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
`;var aa=Object.defineProperty,la=Object.getOwnPropertyDescriptor,To=(e,t,o,i)=>{for(var r=i>1?void 0:i?la(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&aa(t,o,r),r};m.PpCrossRefs=class extends M{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var i,r,s,n,a,l;const{refs:t}=this;return((i=t.UsedByOperations)==null?void 0:i.length)||((r=t.UsedByModels)==null?void 0:r.length)||((s=t.UsesModels)==null?void 0:s.length)?b`
      ${(n=t.UsedByOperations)!=null&&n.length?b`
            <h3>Used by Operations</h3>
            <ul>
              ${t.UsedByOperations.map(c=>b`
                  <li>
                    <a href="../../operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:w}
      ${(a=t.UsedByModels)!=null&&a.length?b`
            <h3>Referenced by</h3>
            <ul>
              ${t.UsedByModels.map(c=>b`
                  <li>
                    <a href="../${c.ComponentType}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:w}
      ${(l=t.UsesModels)!=null&&l.length?b`
            <h3>References</h3>
            <ul>
              ${t.UsesModels.map(c=>b`
                  <li>
                    <a href="../${c.ComponentType}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:w}
    `:w}},m.PpCrossRefs.styles=na,To([f({attribute:"refs-json"})],m.PpCrossRefs.prototype,"refsJson",2),To([U()],m.PpCrossRefs.prototype,"refs",2),m.PpCrossRefs=To([q("pp-cross-refs")],m.PpCrossRefs);const ca=E`
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
`;var ha=Object.defineProperty,da=Object.getOwnPropertyDescriptor,Ue=(e,t,o,i)=>{for(var r=i>1?void 0:i?da(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&ha(t,o,r),r};m.PpExampleBlock=class extends M{constructor(){super(...arguments),this.name="",this.exampleJson="",this.parsed=null}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{this.parsed=JSON.parse(this.exampleJson)}catch{this.parsed=null}}render(){return this.parsed?b`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
      </details>
    `:w}},m.PpExampleBlock.styles=ca,Ue([f()],m.PpExampleBlock.prototype,"name",2),Ue([f({attribute:"example-json"})],m.PpExampleBlock.prototype,"exampleJson",2),Ue([U()],m.PpExampleBlock.prototype,"parsed",2),m.PpExampleBlock=Ue([q("pp-example-block")],m.PpExampleBlock);const pa=E`
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
`;var ua=Object.defineProperty,fa=Object.getOwnPropertyDescriptor,He=(e,t,o,i)=>{for(var r=i>1?void 0:i?fa(t,o):t,s=e.length-1,n;s>=0;s--)(n=e[s])&&(r=(i?n(t,o,r):n(r))||r);return i&&r&&ua(t,o,r),r};m.PpComponentSection=class extends M{constructor(){super(...arguments),this.mediaType="",this.schemaJson="",this.parsed=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.parsed=JSON.parse(this.schemaJson)}catch{this.parsed=null}}render(){return b`
      ${this.mediaType?b`<div class="media-type">${this.mediaType}</div>`:w}
      ${this.parsed?b`<pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>`:w}
    `}},m.PpComponentSection.styles=pa,He([f({attribute:"media-type"})],m.PpComponentSection.prototype,"mediaType",2),He([f({attribute:"schema-json"})],m.PpComponentSection.prototype,"schemaJson",2),He([U()],m.PpComponentSection.prototype,"parsed",2),m.PpComponentSection=He([q("pp-component-section")],m.PpComponentSection),Ge("static/shoelace");const ga={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'};return Lr("default",{resolver:e=>{const t=ga[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(m,Symbol.toStringTag,{value:"Module"}),m})({});
