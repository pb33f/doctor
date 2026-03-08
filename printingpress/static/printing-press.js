var PrintingPress=(function(f){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Qr,ts;const ce=globalThis,De=ce.ShadowRoot&&(ce.ShadyCSS===void 0||ce.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ue=Symbol(),Oo=new WeakMap;let ko=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==Ue)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(De&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=Oo.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Oo.set(o,t))}return t}toString(){return this.cssText}};const rs=e=>new ko(typeof e=="string"?e:e+"",void 0,Ue),O=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((r,s,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new ko(o,e,Ue)},ss=(e,t)=>{if(De)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const r=document.createElement("style"),s=ce.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=o.cssText,e.appendChild(r)}},To=De?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return rs(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is,defineProperty:ns,getOwnPropertyDescriptor:as,getOwnPropertyNames:ls,getOwnPropertySymbols:cs,getPrototypeOf:hs}=Object,rt=globalThis,Mo=rt.trustedTypes,ds=Mo?Mo.emptyScript:"",He=rt.reactiveElementPolyfillSupport,Ft=(e,t)=>e,he={toAttribute(e,t){switch(t){case Boolean:e=e?ds:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},je=(e,t)=>!is(e,t),Ro={attribute:!0,type:String,converter:he,reflect:!1,useDefault:!1,hasChanged:je};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),rt.litPropertyMetadata??(rt.litPropertyMetadata=new WeakMap);let Ot=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Ro){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,o);s!==void 0&&ns(this.prototype,t,s)}}static getPropertyDescriptor(t,o,r){const{get:s,set:i}=as(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:s,set(n){const a=s==null?void 0:s.call(this);i==null||i.call(this,n),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ro}static _$Ei(){if(this.hasOwnProperty(Ft("elementProperties")))return;const t=hs(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ft("properties"))){const o=this.properties,r=[...ls(o),...cs(o)];for(const s of r)this.createProperty(s,o[s])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,s]of o)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const s=this._$Eu(o,r);s!==void 0&&this._$Eh.set(s,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)o.unshift(To(s))}else t!==void 0&&o.push(To(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(o=>this.enableUpdating=o),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(o=>o(this))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ss(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)})}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var i;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:he).toAttribute(o,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,o){var i,n;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const a=r.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:he;this._$Em=s;const c=l.fromAttribute(o,a.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(t,o,r,s=!1,i){var n;if(t!==void 0){const a=this.constructor;if(s===!1&&(i=this[t]),r??(r=a.getPropertyOptions(t)),!((r.hasChanged??je)(i,o)||r.useDefault&&r.reflect&&i===((n=this._$Ej)==null?void 0:n.get(t))&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:s,wrapped:i},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach(s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)}),this.update(o)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};Ot.elementStyles=[],Ot.shadowRootOptions={mode:"open"},Ot[Ft("elementProperties")]=new Map,Ot[Ft("finalized")]=new Map,He==null||He({ReactiveElement:Ot}),(rt.reactiveElementVersions??(rt.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vt=globalThis,Lo=e=>e,de=Vt.trustedTypes,zo=de?de.createPolicy("lit-html",{createHTML:e=>e}):void 0,No="$lit$",st=`lit$${Math.random().toFixed(9).slice(2)}$`,Bo="?"+st,ps=`<${Bo}>`,ft=document,Wt=()=>ft.createComment(""),qt=e=>e===null||typeof e!="object"&&typeof e!="function",Ie=Array.isArray,us=e=>Ie(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Fe=`[ 	
\f\r]`,Jt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Do=/-->/g,Uo=/>/g,mt=RegExp(`>|${Fe}(?:([^\\s"'>=/]+)(${Fe}*=${Fe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ho=/'/g,jo=/"/g,Io=/^(?:script|style|textarea|title)$/i,fs=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),b=fs(1),gt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Fo=new WeakMap,vt=ft.createTreeWalker(ft,129);function Vo(e,t){if(!Ie(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return zo!==void 0?zo.createHTML(t):t}const ms=(e,t)=>{const o=e.length-1,r=[];let s,i=t===2?"<svg>":t===3?"<math>":"",n=Jt;for(let a=0;a<o;a++){const l=e[a];let c,d,h=-1,u=0;for(;u<l.length&&(n.lastIndex=u,d=n.exec(l),d!==null);)u=n.lastIndex,n===Jt?d[1]==="!--"?n=Do:d[1]!==void 0?n=Uo:d[2]!==void 0?(Io.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=mt):d[3]!==void 0&&(n=mt):n===mt?d[0]===">"?(n=s??Jt,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?mt:d[3]==='"'?jo:Ho):n===jo||n===Ho?n=mt:n===Do||n===Uo?n=Jt:(n=mt,s=void 0);const p=n===mt&&e[a+1].startsWith("/>")?" ":"";i+=n===Jt?l+ps:h>=0?(r.push(c),l.slice(0,h)+No+l.slice(h)+st+p):l+st+(h===-2?a:p)}return[Vo(e,i+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let Ve=class es{constructor({strings:t,_$litType$:o},r){let s;this.parts=[];let i=0,n=0;const a=t.length-1,l=this.parts,[c,d]=ms(t,o);if(this.el=es.createElement(c,r),vt.currentNode=this.el.content,o===2||o===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=vt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(No)){const u=d[n++],p=s.getAttribute(h).split(st),g=/([.?@])?(.*)/.exec(u);l.push({type:1,index:i,name:g[2],strings:p,ctor:g[1]==="."?vs:g[1]==="?"?ys:g[1]==="@"?bs:pe}),s.removeAttribute(h)}else h.startsWith(st)&&(l.push({type:6,index:i}),s.removeAttribute(h));if(Io.test(s.tagName)){const h=s.textContent.split(st),u=h.length-1;if(u>0){s.textContent=de?de.emptyScript:"";for(let p=0;p<u;p++)s.append(h[p],Wt()),vt.nextNode(),l.push({type:2,index:++i});s.append(h[u],Wt())}}}else if(s.nodeType===8)if(s.data===Bo)l.push({type:2,index:i});else{let h=-1;for(;(h=s.data.indexOf(st,h+1))!==-1;)l.push({type:7,index:i}),h+=st.length-1}i++}}static createElement(t,o){const r=ft.createElement("template");return r.innerHTML=t,r}};function kt(e,t,o=e,r){var n,a;if(t===gt)return t;let s=r!==void 0?(n=o._$Co)==null?void 0:n[r]:o._$Cl;const i=qt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),i===void 0?s=void 0:(s=new i(e),s._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=s:o._$Cl=s),s!==void 0&&(t=kt(e,s._$AS(e,t.values),s,r)),t}let gs=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??ft).importNode(o,!0);vt.currentNode=s;let i=vt.nextNode(),n=0,a=0,l=r[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new We(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new ws(i,this,t)),this._$AV.push(c),l=r[++a]}n!==(l==null?void 0:l.index)&&(i=vt.nextNode(),n++)}return vt.currentNode=ft,s}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},We=class os{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=kt(this,t,o),qt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==gt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):us(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&qt(this._$AH)?this._$AA.nextSibling.data=t:this.T(ft.createTextNode(t)),this._$AH=t}$(t){var i;const{values:o,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Ve.createElement(Vo(r.h,r.h[0]),this.options)),r);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(o);else{const n=new gs(s,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(t){let o=Fo.get(t.strings);return o===void 0&&Fo.set(t.strings,o=new Ve(t)),o}k(t){Ie(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,s=0;for(const i of t)s===o.length?o.push(r=new os(this.O(Wt()),this.O(Wt()),this,this.options)):r=o[s],r._$AI(i),s++;s<o.length&&(this._$AR(r&&r._$AB.nextSibling,s),o.length=s)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const s=Lo(t).nextSibling;Lo(t).remove(),t=s}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}},pe=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,s,i){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=o,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,o=this,r,s){const i=this.strings;let n=!1;if(i===void 0)t=kt(this,t,o,0),n=!qt(t)||t!==this._$AH&&t!==gt,n&&(this._$AH=t);else{const a=t;let l,c;for(t=i[0],l=0;l<i.length-1;l++)c=kt(this,a[r+l],o,l),c===gt&&(c=this._$AH[l]),n||(n=!qt(c)||c!==this._$AH[l]),c===$?t=$:t!==$&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},vs=class extends pe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},ys=class extends pe{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},bs=class extends pe{constructor(t,o,r,s,i){super(t,o,r,s,i),this.type=5}_$AI(t,o=this){if((t=kt(this,t,o,0)??$)===gt)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}};class ws{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){kt(this,t)}}const qe=Vt.litHtmlPolyfillSupport;qe==null||qe(Ve,We),(Vt.litHtmlVersions??(Vt.litHtmlVersions=[])).push("3.3.2");const $s=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const i=(o==null?void 0:o.renderBefore)??null;r._$litPart$=s=new We(t.insertBefore(Wt(),i),i,void 0,o??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis;let R=class extends Ot{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=$s(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return gt}};R._$litElement$=!0,R.finalized=!0,(Qr=yt.litElementHydrateSupport)==null||Qr.call(yt,{LitElement:R});const Je=yt.litElementPolyfillSupport;Je==null||Je({LitElement:R}),(yt.litElementVersions??(yt.litElementVersions=[])).push("4.2.2");var _s=O`
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
`,xs=O`
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
`,Xe="";function Ye(e){Xe=e}function As(e=""){if(!Xe){const t=[...document.getElementsByTagName("script")],o=t.find(r=>r.hasAttribute("data-shoelace"));if(o)Ye(o.getAttribute("data-shoelace"));else{const r=t.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let s="";r&&(s=r.getAttribute("src")),Ye(s.split("/").slice(0,-1).join("/"))}}return Xe.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Ps={name:"default",resolver:e=>As(`assets/icons/${e}.svg`)},Cs=Ps,Wo={caret:`
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
  `},Ss={name:"system",resolver:e=>e in Wo?`data:image/svg+xml,${encodeURIComponent(Wo[e])}`:""},Es=Ss,ue=[Cs,Es],fe=[];function Os(e){fe.push(e)}function ks(e){fe=fe.filter(t=>t!==e)}function qo(e){return ue.find(t=>t.name===e)}function Ts(e,t){Ms(e),ue.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),fe.forEach(o=>{o.library===e&&o.setIcon()})}function Ms(e){ue=ue.filter(t=>t.name!==e)}var Rs=O`
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
`,Jo=Object.defineProperty,Ls=Object.defineProperties,zs=Object.getOwnPropertyDescriptor,Ns=Object.getOwnPropertyDescriptors,Xo=Object.getOwnPropertySymbols,Bs=Object.prototype.hasOwnProperty,Ds=Object.prototype.propertyIsEnumerable,Yo=e=>{throw TypeError(e)},Ko=(e,t,o)=>t in e?Jo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,me=(e,t)=>{for(var o in t||(t={}))Bs.call(t,o)&&Ko(e,o,t[o]);if(Xo)for(var o of Xo(t))Ds.call(t,o)&&Ko(e,o,t[o]);return e},Zo=(e,t)=>Ls(e,Ns(t)),v=(e,t,o,r)=>{for(var s=r>1?void 0:r?zs(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Jo(t,o,s),s},Go=(e,t,o)=>t.has(e)||Yo("Cannot "+o),Us=(e,t,o)=>(Go(e,t,"read from private field"),t.get(e)),Hs=(e,t,o)=>t.has(e)?Yo("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),js=(e,t,o,r)=>(Go(e,t,"write to private field"),t.set(e,o),o);function Xt(e,t){const o=me({waitUntilFirstUpdate:!1},t);return(r,s)=>{const{update:i}=r,n=Array.isArray(e)?e:[e];r.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const d=a.get(c),h=this[c];d!==h&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[s](d,h)}}),i.call(this,a)}}}var Yt=O`
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
 */const F=e=>(t,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Is={attribute:!0,type:String,converter:he,reflect:!1,hasChanged:je},Fs=(e=Is,t,o)=>{const{kind:r,metadata:s}=o;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(o.name,e),r==="accessor"){const{name:n}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(r==="setter"){const{name:n}=o;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e,!0,a)}}throw Error("Unsupported decorator location: "+r)};function m(e){return(t,o)=>typeof o=="object"?Fs(e,t,o):((r,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,r),n?Object.getOwnPropertyDescriptor(s,i):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function V(e){return m({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vs=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Tt(e,t){return(o,r,s)=>{const i=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(e))??null};return Vs(o,r,{get(){return i(this)}})}}var ge,K=class extends R{constructor(){super(),Hs(this,ge,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const o=new CustomEvent(e,me({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const r=customElements.get(e);if(!r){try{customElements.define(e,t,o)}catch{customElements.define(e,class extends t{},o)}return}let s=" (unknown version)",i=s;"version"in t&&t.version&&(s=" v"+t.version),"version"in r&&r.version&&(i=" v"+r.version),!(s&&i&&s===i)&&console.warn(`Attempted to register <${e}>${s}, but <${e}>${i} has already been registered.`)}attributeChangedCallback(e,t,o){Us(this,ge)||(this.constructor.elementProperties.forEach((r,s)=>{r.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),js(this,ge,!0)),super.attributeChangedCallback(e,t,o)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,o)=>{e.has(o)&&this[o]==null&&(this[o]=t)})}};ge=new WeakMap,K.version="2.20.1",K.dependencies={},v([m()],K.prototype,"dir",2),v([m()],K.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ws=(e,t)=>(e==null?void 0:e._$litType$)!==void 0;var Kt=Symbol(),ve=Symbol(),Ke,Ze=new Map,Z=class extends K{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var o;let r;if(t!=null&&t.spriteSheet)return this.svg=b`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(r=await fetch(e,{mode:"cors"}),!r.ok)return r.status===410?Kt:ve}catch{return ve}try{const s=document.createElement("div");s.innerHTML=await r.text();const i=s.firstElementChild;if(((o=i==null?void 0:i.tagName)==null?void 0:o.toLowerCase())!=="svg")return Kt;Ke||(Ke=new DOMParser);const a=Ke.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):Kt}catch{return Kt}}connectedCallback(){super.connectedCallback(),Os(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),ks(this)}getIconSource(){const e=qo(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:o}=this.getIconSource(),r=o?qo(this.library):void 0;if(!t){this.svg=null;return}let s=Ze.get(t);if(s||(s=this.resolveIcon(t,r),Ze.set(t,s)),!this.initialRender)return;const i=await s;if(i===ve&&Ze.delete(t),t===this.getIconSource().url){if(Ws(i)){if(this.svg=i,r){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&n&&r.mutator(n)}return}switch(i){case ve:case Kt:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(e=r==null?void 0:r.mutator)==null||e.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};Z.styles=[Yt,Rs],v([V()],Z.prototype,"svg",2),v([m({reflect:!0})],Z.prototype,"name",2),v([m()],Z.prototype,"src",2),v([m()],Z.prototype,"label",2),v([m({reflect:!0})],Z.prototype,"library",2),v([Xt("label")],Z.prototype,"handleLabelChange",1),v([Xt(["name","src","library"])],Z.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qs={ATTRIBUTE:1},Js=e=>(...t)=>({_$litDirective$:e,values:t});let Xs=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Zt=Js(class extends Xs{constructor(e){var t;if(super(e),e.type!==qs.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,s;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in t)t[i]&&!((r=this.nt)!=null&&r.has(i))&&this.st.add(i);return this.render(t)}const o=e.element.classList;for(const i of this.st)i in t||(o.remove(i),this.st.delete(i));for(const i in t){const n=!!t[i];n===this.st.has(i)||(s=this.nt)!=null&&s.has(i)||(n?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return gt}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qo=Symbol.for(""),Ys=e=>{if((e==null?void 0:e.r)===Qo)return e==null?void 0:e._$litStatic$},tr=(e,...t)=>({_$litStatic$:t.reduce((o,r,s)=>o+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+e[s+1],e[0]),r:Qo}),er=new Map,Ks=e=>(t,...o)=>{const r=o.length;let s,i;const n=[],a=[];let l,c=0,d=!1;for(;c<r;){for(l=t[c];c<r&&(i=o[c],(s=Ys(i))!==void 0);)l+=s+t[++c],d=!0;c!==r&&a.push(i),n.push(l),c++}if(c===r&&n.push(t[r]),d){const h=n.join("$$lit$$");(t=er.get(h))===void 0&&(n.raw=n,er.set(h,t=n)),o=a}return e(t,...o)},Zs=Ks(b);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W=e=>e??$;var z=class extends K{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?tr`a`:tr`button`;return Zs`
      <${t}
        part="base"
        class=${Zt({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${W(e?void 0:this.disabled)}
        type=${W(e?void 0:"button")}
        href=${W(e?this.href:void 0)}
        target=${W(e?this.target:void 0)}
        download=${W(e?this.download:void 0)}
        rel=${W(e&&this.target?"noreferrer noopener":void 0)}
        role=${W(e?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${W(this.name)}
          library=${W(this.library)}
          src=${W(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};z.styles=[Yt,xs],z.dependencies={"sl-icon":Z},v([Tt(".icon-button")],z.prototype,"button",2),v([V()],z.prototype,"hasFocus",2),v([m()],z.prototype,"name",2),v([m()],z.prototype,"library",2),v([m()],z.prototype,"src",2),v([m()],z.prototype,"href",2),v([m()],z.prototype,"target",2),v([m()],z.prototype,"download",2),v([m()],z.prototype,"label",2),v([m({type:Boolean,reflect:!0})],z.prototype,"disabled",2);const Ge=new Set,Mt=new Map;let bt,Qe="ltr",to="en";const or=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(or){const e=new MutationObserver(sr);Qe=document.documentElement.dir||"ltr",to=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function rr(...e){e.map(t=>{const o=t.$code.toLowerCase();Mt.has(o)?Mt.set(o,Object.assign(Object.assign({},Mt.get(o)),t)):Mt.set(o,t),bt||(bt=t)}),sr()}function sr(){or&&(Qe=document.documentElement.dir||"ltr",to=document.documentElement.lang||navigator.language),[...Ge.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Gs=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Ge.add(this.host)}hostDisconnected(){Ge.delete(this.host)}dir(){return`${this.host.dir||Qe}`.toLowerCase()}lang(){return`${this.host.lang||to}`.toLowerCase()}getTranslationData(t){var o,r;const s=new Intl.Locale(t.replace(/_/g,"-")),i=s==null?void 0:s.language.toLowerCase(),n=(r=(o=s==null?void 0:s.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",a=Mt.get(`${i}-${n}`),l=Mt.get(i);return{locale:s,language:i,region:n,primary:a,secondary:l}}exists(t,o){var r;const{primary:s,secondary:i}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(s&&s[t]||i&&i[t]||o.includeFallback&&bt&&bt[t])}term(t,...o){const{primary:r,secondary:s}=this.getTranslationData(this.lang());let i;if(r&&r[t])i=r[t];else if(s&&s[t])i=s[t];else if(bt&&bt[t])i=bt[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof i=="function"?i(...o):i}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var ir={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};rr(ir);var Qs=ir,eo=class extends Gs{};rr(Qs);var wt=class extends K{constructor(){super(...arguments),this.localize=new eo(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return b`
      <span
        part="base"
        class=${Zt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
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
    `}};wt.styles=[Yt,_s],wt.dependencies={"sl-icon-button":z},v([m({reflect:!0})],wt.prototype,"variant",2),v([m({reflect:!0})],wt.prototype,"size",2),v([m({type:Boolean,reflect:!0})],wt.prototype,"pill",2),v([m({type:Boolean})],wt.prototype,"removable",2),wt.define("sl-tag"),z.define("sl-icon-button");var ti=O`
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
`,ei=O`
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
`;const it=Math.min,N=Math.max,ye=Math.round,be=Math.floor,q=e=>({x:e,y:e}),oi={left:"right",right:"left",bottom:"top",top:"bottom"};function oo(e,t,o){return N(e,it(t,o))}function Rt(e,t){return typeof e=="function"?e(t):e}function nt(e){return e.split("-")[0]}function Lt(e){return e.split("-")[1]}function nr(e){return e==="x"?"y":"x"}function ro(e){return e==="y"?"height":"width"}function G(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function so(e){return nr(G(e))}function ri(e,t,o){o===void 0&&(o=!1);const r=Lt(e),s=so(e),i=ro(s);let n=s==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(n=we(n)),[n,we(n)]}function si(e){const t=we(e);return[io(e),t,io(t)]}function io(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const ar=["left","right"],lr=["right","left"],ii=["top","bottom"],ni=["bottom","top"];function ai(e,t,o){switch(e){case"top":case"bottom":return o?t?lr:ar:t?ar:lr;case"left":case"right":return t?ii:ni;default:return[]}}function li(e,t,o,r){const s=Lt(e);let i=ai(nt(e),o==="start",r);return s&&(i=i.map(n=>n+"-"+s),t&&(i=i.concat(i.map(io)))),i}function we(e){const t=nt(e);return oi[t]+e.slice(t.length)}function ci(e){return{top:0,right:0,bottom:0,left:0,...e}}function cr(e){return typeof e!="number"?ci(e):{top:e,right:e,bottom:e,left:e}}function $e(e){const{x:t,y:o,width:r,height:s}=e;return{width:r,height:s,top:o,left:t,right:t+r,bottom:o+s,x:t,y:o}}function hr(e,t,o){let{reference:r,floating:s}=e;const i=G(t),n=so(t),a=ro(n),l=nt(t),c=i==="y",d=r.x+r.width/2-s.width/2,h=r.y+r.height/2-s.height/2,u=r[a]/2-s[a]/2;let p;switch(l){case"top":p={x:d,y:r.y-s.height};break;case"bottom":p={x:d,y:r.y+r.height};break;case"right":p={x:r.x+r.width,y:h};break;case"left":p={x:r.x-s.width,y:h};break;default:p={x:r.x,y:r.y}}switch(Lt(t)){case"start":p[n]-=u*(o&&c?-1:1);break;case"end":p[n]+=u*(o&&c?-1:1);break}return p}async function hi(e,t){var o;t===void 0&&(t={});const{x:r,y:s,platform:i,rects:n,elements:a,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:h="floating",altBoundary:u=!1,padding:p=0}=Rt(t,e),g=cr(p),_=a[u?h==="floating"?"reference":"floating":h],w=$e(await i.getClippingRect({element:(o=await(i.isElement==null?void 0:i.isElement(_)))==null||o?_:_.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:c,rootBoundary:d,strategy:l})),x=h==="floating"?{x:r,y:s,width:n.floating.width,height:n.floating.height}:n.reference,A=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),C=await(i.isElement==null?void 0:i.isElement(A))?await(i.getScale==null?void 0:i.getScale(A))||{x:1,y:1}:{x:1,y:1},T=$e(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:x,offsetParent:A,strategy:l}):x);return{top:(w.top-T.top+g.top)/C.y,bottom:(T.bottom-w.bottom+g.bottom)/C.y,left:(w.left-T.left+g.left)/C.x,right:(T.right-w.right+g.right)/C.x}}const di=50,pi=async(e,t,o)=>{const{placement:r="bottom",strategy:s="absolute",middleware:i=[],platform:n}=o,a=n.detectOverflow?n:{...n,detectOverflow:hi},l=await(n.isRTL==null?void 0:n.isRTL(t));let c=await n.getElementRects({reference:e,floating:t,strategy:s}),{x:d,y:h}=hr(c,r,l),u=r,p=0;const g={};for(let y=0;y<i.length;y++){const _=i[y];if(!_)continue;const{name:w,fn:x}=_,{x:A,y:C,data:T,reset:S}=await x({x:d,y:h,initialPlacement:r,placement:u,strategy:s,middlewareData:g,rects:c,platform:a,elements:{reference:e,floating:t}});d=A??d,h=C??h,g[w]={...g[w],...T},S&&p<di&&(p++,typeof S=="object"&&(S.placement&&(u=S.placement),S.rects&&(c=S.rects===!0?await n.getElementRects({reference:e,floating:t,strategy:s}):S.rects),{x:d,y:h}=hr(c,u,l)),y=-1)}return{x:d,y:h,placement:u,strategy:s,middlewareData:g}},ui=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:s,rects:i,platform:n,elements:a,middlewareData:l}=t,{element:c,padding:d=0}=Rt(e,t)||{};if(c==null)return{};const h=cr(d),u={x:o,y:r},p=so(s),g=ro(p),y=await n.getDimensions(c),_=p==="y",w=_?"top":"left",x=_?"bottom":"right",A=_?"clientHeight":"clientWidth",C=i.reference[g]+i.reference[p]-u[p]-i.floating[g],T=u[p]-i.reference[p],S=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let M=S?S[A]:0;(!M||!await(n.isElement==null?void 0:n.isElement(S)))&&(M=a.floating[A]||i.floating[g]);const et=C/2-T/2,X=M/2-y[g]/2-1,D=it(h[w],X),dt=it(h[x],X),Y=D,pt=M-y[g]-dt,L=M/2-y[g]/2+et,Et=oo(Y,L,pt),ot=!l.arrow&&Lt(s)!=null&&L!==Et&&i.reference[g]/2-(L<Y?D:dt)-y[g]/2<0,j=ot?L<Y?L-Y:L-pt:0;return{[p]:u[p]+j,data:{[p]:Et,centerOffset:L-Et-j,...ot&&{alignmentOffset:j}},reset:ot}}}),fi=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:s,middlewareData:i,rects:n,initialPlacement:a,platform:l,elements:c}=t,{mainAxis:d=!0,crossAxis:h=!0,fallbackPlacements:u,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:y=!0,..._}=Rt(e,t);if((o=i.arrow)!=null&&o.alignmentOffset)return{};const w=nt(s),x=G(a),A=nt(a)===a,C=await(l.isRTL==null?void 0:l.isRTL(c.floating)),T=u||(A||!y?[we(a)]:si(a)),S=g!=="none";!u&&S&&T.push(...li(a,y,g,C));const M=[a,...T],et=await l.detectOverflow(t,_),X=[];let D=((r=i.flip)==null?void 0:r.overflows)||[];if(d&&X.push(et[w]),h){const L=ri(s,n,C);X.push(et[L[0]],et[L[1]])}if(D=[...D,{placement:s,overflows:X}],!X.every(L=>L<=0)){var dt,Y;const L=(((dt=i.flip)==null?void 0:dt.index)||0)+1,Et=M[L];if(Et&&(!(h==="alignment"?x!==G(Et):!1)||D.every(I=>G(I.placement)===x?I.overflows[0]>0:!0)))return{data:{index:L,overflows:D},reset:{placement:Et}};let ot=(Y=D.filter(j=>j.overflows[0]<=0).sort((j,I)=>j.overflows[1]-I.overflows[1])[0])==null?void 0:Y.placement;if(!ot)switch(p){case"bestFit":{var pt;const j=(pt=D.filter(I=>{if(S){const ut=G(I.placement);return ut===x||ut==="y"}return!0}).map(I=>[I.placement,I.overflows.filter(ut=>ut>0).reduce((ut,ca)=>ut+ca,0)]).sort((I,ut)=>I[1]-ut[1])[0])==null?void 0:pt[0];j&&(ot=j);break}case"initialPlacement":ot=a;break}if(s!==ot)return{reset:{placement:ot}}}return{}}}},mi=new Set(["left","top"]);async function gi(e,t){const{placement:o,platform:r,elements:s}=e,i=await(r.isRTL==null?void 0:r.isRTL(s.floating)),n=nt(o),a=Lt(o),l=G(o)==="y",c=mi.has(n)?-1:1,d=i&&l?-1:1,h=Rt(t,e);let{mainAxis:u,crossAxis:p,alignmentAxis:g}=typeof h=="number"?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:h.mainAxis||0,crossAxis:h.crossAxis||0,alignmentAxis:h.alignmentAxis};return a&&typeof g=="number"&&(p=a==="end"?g*-1:g),l?{x:p*d,y:u*c}:{x:u*c,y:p*d}}const vi=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:s,y:i,placement:n,middlewareData:a}=t,l=await gi(t,e);return n===((o=a.offset)==null?void 0:o.placement)&&(r=a.arrow)!=null&&r.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:n}}}}},yi=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:s,platform:i}=t,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:w=>{let{x,y:A}=w;return{x,y:A}}},...c}=Rt(e,t),d={x:o,y:r},h=await i.detectOverflow(t,c),u=G(nt(s)),p=nr(u);let g=d[p],y=d[u];if(n){const w=p==="y"?"top":"left",x=p==="y"?"bottom":"right",A=g+h[w],C=g-h[x];g=oo(A,g,C)}if(a){const w=u==="y"?"top":"left",x=u==="y"?"bottom":"right",A=y+h[w],C=y-h[x];y=oo(A,y,C)}const _=l.fn({...t,[p]:g,[u]:y});return{..._,data:{x:_.x-o,y:_.y-r,enabled:{[p]:n,[u]:a}}}}}},bi=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:s,rects:i,platform:n,elements:a}=t,{apply:l=()=>{},...c}=Rt(e,t),d=await n.detectOverflow(t,c),h=nt(s),u=Lt(s),p=G(s)==="y",{width:g,height:y}=i.floating;let _,w;h==="top"||h==="bottom"?(_=h,w=u===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):(w=h,_=u==="end"?"top":"bottom");const x=y-d.top-d.bottom,A=g-d.left-d.right,C=it(y-d[_],x),T=it(g-d[w],A),S=!t.middlewareData.shift;let M=C,et=T;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(et=A),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(M=x),S&&!u){const D=N(d.left,0),dt=N(d.right,0),Y=N(d.top,0),pt=N(d.bottom,0);p?et=g-2*(D!==0||dt!==0?D+dt:N(d.left,d.right)):M=y-2*(Y!==0||pt!==0?Y+pt:N(d.top,d.bottom))}await l({...t,availableWidth:et,availableHeight:M});const X=await n.getDimensions(a.floating);return g!==X.width||y!==X.height?{reset:{rects:!0}}:{}}}};function _e(){return typeof window<"u"}function zt(e){return dr(e)?(e.nodeName||"").toLowerCase():"#document"}function B(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function J(e){var t;return(t=(dr(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function dr(e){return _e()?e instanceof Node||e instanceof B(e).Node:!1}function U(e){return _e()?e instanceof Element||e instanceof B(e).Element:!1}function Q(e){return _e()?e instanceof HTMLElement||e instanceof B(e).HTMLElement:!1}function pr(e){return!_e()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof B(e).ShadowRoot}function Gt(e){const{overflow:t,overflowX:o,overflowY:r,display:s}=H(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&s!=="inline"&&s!=="contents"}function wi(e){return/^(table|td|th)$/.test(zt(e))}function xe(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const $i=/transform|translate|scale|rotate|perspective|filter/,_i=/paint|layout|strict|content/,$t=e=>!!e&&e!=="none";let no;function Ae(e){const t=U(e)?H(e):e;return $t(t.transform)||$t(t.translate)||$t(t.scale)||$t(t.rotate)||$t(t.perspective)||!ao()&&($t(t.backdropFilter)||$t(t.filter))||$i.test(t.willChange||"")||_i.test(t.contain||"")}function xi(e){let t=at(e);for(;Q(t)&&!Nt(t);){if(Ae(t))return t;if(xe(t))return null;t=at(t)}return null}function ao(){return no==null&&(no=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),no}function Nt(e){return/^(html|body|#document)$/.test(zt(e))}function H(e){return B(e).getComputedStyle(e)}function Pe(e){return U(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function at(e){if(zt(e)==="html")return e;const t=e.assignedSlot||e.parentNode||pr(e)&&e.host||J(e);return pr(t)?t.host:t}function ur(e){const t=at(e);return Nt(t)?e.ownerDocument?e.ownerDocument.body:e.body:Q(t)&&Gt(t)?t:ur(t)}function Qt(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const s=ur(e),i=s===((r=e.ownerDocument)==null?void 0:r.body),n=B(s);if(i){const a=lo(n);return t.concat(n,n.visualViewport||[],Gt(s)?s:[],a&&o?Qt(a):[])}else return t.concat(s,Qt(s,[],o))}function lo(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function fr(e){const t=H(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const s=Q(e),i=s?e.offsetWidth:o,n=s?e.offsetHeight:r,a=ye(o)!==i||ye(r)!==n;return a&&(o=i,r=n),{width:o,height:r,$:a}}function co(e){return U(e)?e:e.contextElement}function Bt(e){const t=co(e);if(!Q(t))return q(1);const o=t.getBoundingClientRect(),{width:r,height:s,$:i}=fr(t);let n=(i?ye(o.width):o.width)/r,a=(i?ye(o.height):o.height)/s;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Ai=q(0);function mr(e){const t=B(e);return!ao()||!t.visualViewport?Ai:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Pi(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==B(e)?!1:t}function _t(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const s=e.getBoundingClientRect(),i=co(e);let n=q(1);t&&(r?U(r)&&(n=Bt(r)):n=Bt(e));const a=Pi(i,o,r)?mr(i):q(0);let l=(s.left+a.x)/n.x,c=(s.top+a.y)/n.y,d=s.width/n.x,h=s.height/n.y;if(i){const u=B(i),p=r&&U(r)?B(r):r;let g=u,y=lo(g);for(;y&&r&&p!==g;){const _=Bt(y),w=y.getBoundingClientRect(),x=H(y),A=w.left+(y.clientLeft+parseFloat(x.paddingLeft))*_.x,C=w.top+(y.clientTop+parseFloat(x.paddingTop))*_.y;l*=_.x,c*=_.y,d*=_.x,h*=_.y,l+=A,c+=C,g=B(y),y=lo(g)}}return $e({width:d,height:h,x:l,y:c})}function Ce(e,t){const o=Pe(e).scrollLeft;return t?t.left+o:_t(J(e)).left+o}function gr(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-Ce(e,o),s=o.top+t.scrollTop;return{x:r,y:s}}function Ci(e){let{elements:t,rect:o,offsetParent:r,strategy:s}=e;const i=s==="fixed",n=J(r),a=t?xe(t.floating):!1;if(r===n||a&&i)return o;let l={scrollLeft:0,scrollTop:0},c=q(1);const d=q(0),h=Q(r);if((h||!h&&!i)&&((zt(r)!=="body"||Gt(n))&&(l=Pe(r)),h)){const p=_t(r);c=Bt(r),d.x=p.x+r.clientLeft,d.y=p.y+r.clientTop}const u=n&&!h&&!i?gr(n,l):q(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+d.x+u.x,y:o.y*c.y-l.scrollTop*c.y+d.y+u.y}}function Si(e){return Array.from(e.getClientRects())}function Ei(e){const t=J(e),o=Pe(e),r=e.ownerDocument.body,s=N(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),i=N(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let n=-o.scrollLeft+Ce(e);const a=-o.scrollTop;return H(r).direction==="rtl"&&(n+=N(t.clientWidth,r.clientWidth)-s),{width:s,height:i,x:n,y:a}}const vr=25;function Oi(e,t){const o=B(e),r=J(e),s=o.visualViewport;let i=r.clientWidth,n=r.clientHeight,a=0,l=0;if(s){i=s.width,n=s.height;const d=ao();(!d||d&&t==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}const c=Ce(r);if(c<=0){const d=r.ownerDocument,h=d.body,u=getComputedStyle(h),p=d.compatMode==="CSS1Compat"&&parseFloat(u.marginLeft)+parseFloat(u.marginRight)||0,g=Math.abs(r.clientWidth-h.clientWidth-p);g<=vr&&(i-=g)}else c<=vr&&(i+=c);return{width:i,height:n,x:a,y:l}}function ki(e,t){const o=_t(e,!0,t==="fixed"),r=o.top+e.clientTop,s=o.left+e.clientLeft,i=Q(e)?Bt(e):q(1),n=e.clientWidth*i.x,a=e.clientHeight*i.y,l=s*i.x,c=r*i.y;return{width:n,height:a,x:l,y:c}}function yr(e,t,o){let r;if(t==="viewport")r=Oi(e,o);else if(t==="document")r=Ei(J(e));else if(U(t))r=ki(t,o);else{const s=mr(e);r={x:t.x-s.x,y:t.y-s.y,width:t.width,height:t.height}}return $e(r)}function br(e,t){const o=at(e);return o===t||!U(o)||Nt(o)?!1:H(o).position==="fixed"||br(o,t)}function Ti(e,t){const o=t.get(e);if(o)return o;let r=Qt(e,[],!1).filter(a=>U(a)&&zt(a)!=="body"),s=null;const i=H(e).position==="fixed";let n=i?at(e):e;for(;U(n)&&!Nt(n);){const a=H(n),l=Ae(n);!l&&a.position==="fixed"&&(s=null),(i?!l&&!s:!l&&a.position==="static"&&!!s&&(s.position==="absolute"||s.position==="fixed")||Gt(n)&&!l&&br(e,n))?r=r.filter(d=>d!==n):s=a,n=at(n)}return t.set(e,r),r}function Mi(e){let{element:t,boundary:o,rootBoundary:r,strategy:s}=e;const n=[...o==="clippingAncestors"?xe(t)?[]:Ti(t,this._c):[].concat(o),r],a=yr(t,n[0],s);let l=a.top,c=a.right,d=a.bottom,h=a.left;for(let u=1;u<n.length;u++){const p=yr(t,n[u],s);l=N(p.top,l),c=it(p.right,c),d=it(p.bottom,d),h=N(p.left,h)}return{width:c-h,height:d-l,x:h,y:l}}function Ri(e){const{width:t,height:o}=fr(e);return{width:t,height:o}}function Li(e,t,o){const r=Q(t),s=J(t),i=o==="fixed",n=_t(e,!0,i,t);let a={scrollLeft:0,scrollTop:0};const l=q(0);function c(){l.x=Ce(s)}if(r||!r&&!i)if((zt(t)!=="body"||Gt(s))&&(a=Pe(t)),r){const p=_t(t,!0,i,t);l.x=p.x+t.clientLeft,l.y=p.y+t.clientTop}else s&&c();i&&!r&&s&&c();const d=s&&!r&&!i?gr(s,a):q(0),h=n.left+a.scrollLeft-l.x-d.x,u=n.top+a.scrollTop-l.y-d.y;return{x:h,y:u,width:n.width,height:n.height}}function ho(e){return H(e).position==="static"}function wr(e,t){if(!Q(e)||H(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return J(e)===o&&(o=o.ownerDocument.body),o}function $r(e,t){const o=B(e);if(xe(e))return o;if(!Q(e)){let s=at(e);for(;s&&!Nt(s);){if(U(s)&&!ho(s))return s;s=at(s)}return o}let r=wr(e,t);for(;r&&wi(r)&&ho(r);)r=wr(r,t);return r&&Nt(r)&&ho(r)&&!Ae(r)?o:r||xi(e)||o}const zi=async function(e){const t=this.getOffsetParent||$r,o=this.getDimensions,r=await o(e.floating);return{reference:Li(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function Ni(e){return H(e).direction==="rtl"}const Se={convertOffsetParentRelativeRectToViewportRelativeRect:Ci,getDocumentElement:J,getClippingRect:Mi,getOffsetParent:$r,getElementRects:zi,getClientRects:Si,getDimensions:Ri,getScale:Bt,isElement:U,isRTL:Ni};function _r(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Bi(e,t){let o=null,r;const s=J(e);function i(){var a;clearTimeout(r),(a=o)==null||a.disconnect(),o=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),i();const c=e.getBoundingClientRect(),{left:d,top:h,width:u,height:p}=c;if(a||t(),!u||!p)return;const g=be(h),y=be(s.clientWidth-(d+u)),_=be(s.clientHeight-(h+p)),w=be(d),A={rootMargin:-g+"px "+-y+"px "+-_+"px "+-w+"px",threshold:N(0,it(1,l))||1};let C=!0;function T(S){const M=S[0].intersectionRatio;if(M!==l){if(!C)return n();M?n(!1,M):r=setTimeout(()=>{n(!1,1e-7)},1e3)}M===1&&!_r(c,e.getBoundingClientRect())&&n(),C=!1}try{o=new IntersectionObserver(T,{...A,root:s.ownerDocument})}catch{o=new IntersectionObserver(T,A)}o.observe(e)}return n(!0),i}function Di(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=co(e),d=s||i?[...c?Qt(c):[],...t?Qt(t):[]]:[];d.forEach(w=>{s&&w.addEventListener("scroll",o,{passive:!0}),i&&w.addEventListener("resize",o)});const h=c&&a?Bi(c,o):null;let u=-1,p=null;n&&(p=new ResizeObserver(w=>{let[x]=w;x&&x.target===c&&p&&t&&(p.unobserve(t),cancelAnimationFrame(u),u=requestAnimationFrame(()=>{var A;(A=p)==null||A.observe(t)})),o()}),c&&!l&&p.observe(c),t&&p.observe(t));let g,y=l?_t(e):null;l&&_();function _(){const w=_t(e);y&&!_r(y,w)&&o(),y=w,g=requestAnimationFrame(_)}return o(),()=>{var w;d.forEach(x=>{s&&x.removeEventListener("scroll",o),i&&x.removeEventListener("resize",o)}),h==null||h(),(w=p)==null||w.disconnect(),p=null,l&&cancelAnimationFrame(g)}}const Ui=vi,Hi=yi,ji=fi,xr=bi,Ii=ui,Fi=(e,t,o)=>{const r=new Map,s={platform:Se,...o},i={...s.platform,_c:r};return pi(e,t,{...s,platform:i})};function Vi(e){return Wi(e)}function po(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Wi(e){for(let t=e;t;t=po(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=po(e);t;t=po(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||Ae(o)||t.tagName==="BODY"))return t}return null}function qi(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var P=class extends K{constructor(){super(...arguments),this.localize=new eo(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom");let r=0,s=0,i=0,n=0,a=0,l=0,c=0,d=0;o?e.top<t.top?(r=e.left,s=e.bottom,i=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,d=t.top):(r=t.left,s=t.bottom,i=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,d=e.top):e.left<t.left?(r=e.right,s=e.top,i=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,d=t.bottom):(r=t.right,s=t.top,i=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,d=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||qi(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Di(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Ui({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(xr({apply:({rects:o})=>{const r=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=s?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(ji({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(Hi({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(xr({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Ii({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?o=>Se.getOffsetParent(o,Vi):Se.getOffsetParent;Fi(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:Zo(me({},Se),{getOffsetParent:t})}).then(({x:o,y:r,middlewareData:s,placement:i})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){const l=s.arrow.x,c=s.arrow.y;let d="",h="",u="",p="";if(this.arrowPlacement==="start"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";d=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",h=n?g:"",p=n?"":g}else if(this.arrowPlacement==="end"){const g=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=n?"":g,p=n?g:"",u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(p=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",d=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(p=typeof l=="number"?`${l}px`:"",d=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:d,right:h,bottom:u,left:p,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return b`
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
        ${this.arrow?b`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};P.styles=[Yt,ei],v([Tt(".popup")],P.prototype,"popup",2),v([Tt(".popup__arrow")],P.prototype,"arrowEl",2),v([m()],P.prototype,"anchor",2),v([m({type:Boolean,reflect:!0})],P.prototype,"active",2),v([m({reflect:!0})],P.prototype,"placement",2),v([m({reflect:!0})],P.prototype,"strategy",2),v([m({type:Number})],P.prototype,"distance",2),v([m({type:Number})],P.prototype,"skidding",2),v([m({type:Boolean})],P.prototype,"arrow",2),v([m({attribute:"arrow-placement"})],P.prototype,"arrowPlacement",2),v([m({attribute:"arrow-padding",type:Number})],P.prototype,"arrowPadding",2),v([m({type:Boolean})],P.prototype,"flip",2),v([m({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],P.prototype,"flipFallbackPlacements",2),v([m({attribute:"flip-fallback-strategy"})],P.prototype,"flipFallbackStrategy",2),v([m({type:Object})],P.prototype,"flipBoundary",2),v([m({attribute:"flip-padding",type:Number})],P.prototype,"flipPadding",2),v([m({type:Boolean})],P.prototype,"shift",2),v([m({type:Object})],P.prototype,"shiftBoundary",2),v([m({attribute:"shift-padding",type:Number})],P.prototype,"shiftPadding",2),v([m({attribute:"auto-size"})],P.prototype,"autoSize",2),v([m()],P.prototype,"sync",2),v([m({type:Object})],P.prototype,"autoSizeBoundary",2),v([m({attribute:"auto-size-padding",type:Number})],P.prototype,"autoSizePadding",2),v([m({attribute:"hover-bridge",type:Boolean})],P.prototype,"hoverBridge",2);var Ar=new Map,Ji=new WeakMap;function Xi(e){return e??{keyframes:[],options:{duration:0}}}function Pr(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function Cr(e,t){Ar.set(e,Xi(t))}function Sr(e,t,o){const r=Ji.get(e);if(r!=null&&r[t])return Pr(r[t],o.dir);const s=Ar.get(t);return s?Pr(s,o.dir):{keyframes:[],options:{duration:0}}}function Er(e,t){return new Promise(o=>{function r(s){s.target===e&&(e.removeEventListener(t,r),o())}e.addEventListener(t,r)})}function Or(e,t,o){return new Promise(r=>{if((o==null?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const s=e.animate(t,Zo(me({},o),{duration:Yi()?0:o.duration}));s.addEventListener("cancel",r,{once:!0}),s.addEventListener("finish",r,{once:!0})})}function kr(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function Yi(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Tr(e){return Promise.all(e.getAnimations().map(t=>new Promise(o=>{t.cancel(),requestAnimationFrame(o)})))}var k=class extends K{constructor(){super(),this.localize=new eo(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=kr(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=kr(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Tr(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:o,options:r}=Sr(this,"tooltip.show",{dir:this.localize.dir()});await Or(this.popup.popup,o,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Tr(this.body);const{keyframes:o,options:r}=Sr(this,"tooltip.hide",{dir:this.localize.dir()});await Or(this.popup.popup,o,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Er(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Er(this,"sl-after-hide")}render(){return b`
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
    `}};k.styles=[Yt,ti],k.dependencies={"sl-popup":P},v([Tt("slot:not([name])")],k.prototype,"defaultSlot",2),v([Tt(".tooltip__body")],k.prototype,"body",2),v([Tt("sl-popup")],k.prototype,"popup",2),v([m()],k.prototype,"content",2),v([m()],k.prototype,"placement",2),v([m({type:Boolean,reflect:!0})],k.prototype,"disabled",2),v([m({type:Number})],k.prototype,"distance",2),v([m({type:Boolean,reflect:!0})],k.prototype,"open",2),v([m({type:Number})],k.prototype,"skidding",2),v([m()],k.prototype,"trigger",2),v([m({type:Boolean})],k.prototype,"hoist",2),v([Xt("open",{waitUntilFirstUpdate:!0})],k.prototype,"handleOpenChange",1),v([Xt(["content","distance","hoist","placement","skidding"])],k.prototype,"handleOptionsChange",1),v([Xt("disabled")],k.prototype,"handleDisabledChange",1),Cr("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),Cr("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),k.define("sl-tooltip");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const uo=e=>(t,o)=>{o!==void 0?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=globalThis,fo=Ee.ShadowRoot&&(Ee.ShadyCSS===void 0||Ee.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,mo=Symbol(),Mr=new WeakMap;let Rr=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==mo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(fo&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=Mr.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Mr.set(o,t))}return t}toString(){return this.cssText}};const Ki=e=>new Rr(typeof e=="string"?e:e+"",void 0,mo),Oe=(e,...t)=>{const o=e.length===1?e[0]:t.reduce(((r,s,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1]),e[0]);return new Rr(o,e,mo)},Zi=(e,t)=>{if(fo)e.adoptedStyleSheets=t.map((o=>o instanceof CSSStyleSheet?o:o.styleSheet));else for(const o of t){const r=document.createElement("style"),s=Ee.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=o.cssText,e.appendChild(r)}},Lr=fo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return Ki(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Gi,defineProperty:Qi,getOwnPropertyDescriptor:tn,getOwnPropertyNames:en,getOwnPropertySymbols:on,getPrototypeOf:rn}=Object,lt=globalThis,zr=lt.trustedTypes,sn=zr?zr.emptyScript:"",go=lt.reactiveElementPolyfillSupport,te=(e,t)=>e,ke={toAttribute(e,t){switch(t){case Boolean:e=e?sn:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},vo=(e,t)=>!Gi(e,t),Nr={attribute:!0,type:String,converter:ke,reflect:!1,useDefault:!1,hasChanged:vo};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),lt.litPropertyMetadata??(lt.litPropertyMetadata=new WeakMap);let Dt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Nr){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,o);s!==void 0&&Qi(this.prototype,t,s)}}static getPropertyDescriptor(t,o,r){const{get:s,set:i}=tn(this.prototype,t)??{get(){return this[o]},set(n){this[o]=n}};return{get:s,set(n){const a=s==null?void 0:s.call(this);i==null||i.call(this,n),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Nr}static _$Ei(){if(this.hasOwnProperty(te("elementProperties")))return;const t=rn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(te("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(te("properties"))){const o=this.properties,r=[...en(o),...on(o)];for(const s of r)this.createProperty(s,o[s])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,s]of o)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const s=this._$Eu(o,r);s!==void 0&&this._$Eh.set(s,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)o.unshift(Lr(s))}else t!==void 0&&o.push(Lr(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((o=>this.enableUpdating=o)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((o=>o(this)))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Zi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)}))}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var i;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const n=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:ke).toAttribute(o,r.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,o){var i,n;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const a=r.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:ke;this._$Em=s;const c=l.fromAttribute(o,a.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(t,o,r){var s;if(t!==void 0){const i=this.constructor,n=this[t];if(r??(r=i.getPropertyOptions(t)),!((r.hasChanged??vo)(n,o)||r.useDefault&&r.reflect&&n===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(i._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:s,wrapped:i},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??o??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach((s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)})),this.update(o)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach((r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((o=>this._$ET(o,this[o])))),this._$EM()}updated(t){}firstUpdated(t){}};Dt.elementStyles=[],Dt.shadowRootOptions={mode:"open"},Dt[te("elementProperties")]=new Map,Dt[te("finalized")]=new Map,go==null||go({ReactiveElement:Dt}),(lt.reactiveElementVersions??(lt.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nn={attribute:!0,type:String,converter:ke,reflect:!1,hasChanged:vo},an=(e=nn,t,o)=>{const{kind:r,metadata:s}=o;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(o.name,e),r==="accessor"){const{name:n}=o;return{set(a){const l=t.get.call(this);t.set.call(this,a),this.requestUpdate(n,l,e)},init(a){return a!==void 0&&this.C(n,void 0,e,a),a}}}if(r==="setter"){const{name:n}=o;return function(a){const l=this[n];t.call(this,a),this.requestUpdate(n,l,e)}}throw Error("Unsupported decorator location: "+r)};function tt(e){return(t,o)=>typeof o=="object"?an(e,t,o):((r,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,r),n?Object.getOwnPropertyDescriptor(s,i):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Br(e){return tt({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ee=globalThis,Te=ee.trustedTypes,Dr=Te?Te.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ur="$lit$",ct=`lit$${Math.random().toFixed(9).slice(2)}$`,Hr="?"+ct,ln=`<${Hr}>`,xt=document,oe=()=>xt.createComment(""),re=e=>e===null||typeof e!="object"&&typeof e!="function",yo=Array.isArray,cn=e=>yo(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",bo=`[ 	
\f\r]`,se=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,jr=/-->/g,Ir=/>/g,At=RegExp(`>|${bo}(?:([^\\s"'>=/]+)(${bo}*=${bo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fr=/'/g,Vr=/"/g,Wr=/^(?:script|style|textarea|title)$/i,hn=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),wo=hn(1),Ut=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),qr=new WeakMap,Pt=xt.createTreeWalker(xt,129);function Jr(e,t){if(!yo(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Dr!==void 0?Dr.createHTML(t):t}const dn=(e,t)=>{const o=e.length-1,r=[];let s,i=t===2?"<svg>":t===3?"<math>":"",n=se;for(let a=0;a<o;a++){const l=e[a];let c,d,h=-1,u=0;for(;u<l.length&&(n.lastIndex=u,d=n.exec(l),d!==null);)u=n.lastIndex,n===se?d[1]==="!--"?n=jr:d[1]!==void 0?n=Ir:d[2]!==void 0?(Wr.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=At):d[3]!==void 0&&(n=At):n===At?d[0]===">"?(n=s??se,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,c=d[1],n=d[3]===void 0?At:d[3]==='"'?Vr:Fr):n===Vr||n===Fr?n=At:n===jr||n===Ir?n=se:(n=At,s=void 0);const p=n===At&&e[a+1].startsWith("/>")?" ":"";i+=n===se?l+ln:h>=0?(r.push(c),l.slice(0,h)+Ur+l.slice(h)+ct+p):l+ct+(h===-2?a:p)}return[Jr(e,i+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class ie{constructor({strings:t,_$litType$:o},r){let s;this.parts=[];let i=0,n=0;const a=t.length-1,l=this.parts,[c,d]=dn(t,o);if(this.el=ie.createElement(c,r),Pt.currentNode=this.el.content,o===2||o===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=Pt.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(Ur)){const u=d[n++],p=s.getAttribute(h).split(ct),g=/([.?@])?(.*)/.exec(u);l.push({type:1,index:i,name:g[2],strings:p,ctor:g[1]==="."?un:g[1]==="?"?fn:g[1]==="@"?mn:Me}),s.removeAttribute(h)}else h.startsWith(ct)&&(l.push({type:6,index:i}),s.removeAttribute(h));if(Wr.test(s.tagName)){const h=s.textContent.split(ct),u=h.length-1;if(u>0){s.textContent=Te?Te.emptyScript:"";for(let p=0;p<u;p++)s.append(h[p],oe()),Pt.nextNode(),l.push({type:2,index:++i});s.append(h[u],oe())}}}else if(s.nodeType===8)if(s.data===Hr)l.push({type:2,index:i});else{let h=-1;for(;(h=s.data.indexOf(ct,h+1))!==-1;)l.push({type:7,index:i}),h+=ct.length-1}i++}}static createElement(t,o){const r=xt.createElement("template");return r.innerHTML=t,r}}function Ht(e,t,o=e,r){var n,a;if(t===Ut)return t;let s=r!==void 0?(n=o._$Co)==null?void 0:n[r]:o._$Cl;const i=re(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),i===void 0?s=void 0:(s=new i(e),s._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=s:o._$Cl=s),s!==void 0&&(t=Ht(e,s._$AS(e,t.values),s,r)),t}class pn{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??xt).importNode(o,!0);Pt.currentNode=s;let i=Pt.nextNode(),n=0,a=0,l=r[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new ne(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new gn(i,this,t)),this._$AV.push(c),l=r[++a]}n!==(l==null?void 0:l.index)&&(i=Pt.nextNode(),n++)}return Pt.currentNode=xt,s}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}}class ne{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,s){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Ht(this,t,o),re(t)?t===E||t==null||t===""?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==Ut&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):cn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==E&&re(this._$AH)?this._$AA.nextSibling.data=t:this.T(xt.createTextNode(t)),this._$AH=t}$(t){var i;const{values:o,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ie.createElement(Jr(r.h,r.h[0]),this.options)),r);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(o);else{const n=new pn(s,this),a=n.u(this.options);n.p(o),this.T(a),this._$AH=n}}_$AC(t){let o=qr.get(t.strings);return o===void 0&&qr.set(t.strings,o=new ie(t)),o}k(t){yo(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,s=0;for(const i of t)s===o.length?o.push(r=new ne(this.O(oe()),this.O(oe()),this,this.options)):r=o[s],r._$AI(i),s++;s<o.length&&(this._$AR(r&&r._$AB.nextSibling,s),o.length=s)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}}class Me{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,s,i){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=o,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=E}_$AI(t,o=this,r,s){const i=this.strings;let n=!1;if(i===void 0)t=Ht(this,t,o,0),n=!re(t)||t!==this._$AH&&t!==Ut,n&&(this._$AH=t);else{const a=t;let l,c;for(t=i[0],l=0;l<i.length-1;l++)c=Ht(this,a[r+l],o,l),c===Ut&&(c=this._$AH[l]),n||(n=!re(c)||c!==this._$AH[l]),c===E?t=E:t!==E&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(t)}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class un extends Me{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===E?void 0:t}}class fn extends Me{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E)}}class mn extends Me{constructor(t,o,r,s,i){super(t,o,r,s,i),this.type=5}_$AI(t,o=this){if((t=Ht(this,t,o,0)??E)===Ut)return;const r=this._$AH,s=t===E&&r!==E||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==E&&(r===E||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}}class gn{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ht(this,t)}}const $o=ee.litHtmlPolyfillSupport;$o==null||$o(ie,ne),(ee.litHtmlVersions??(ee.litHtmlVersions=[])).push("3.3.1");const vn=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const i=(o==null?void 0:o.renderBefore)??null;r._$litPart$=s=new ne(t.insertBefore(oe(),i),i,void 0,o??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis;class St extends Dt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=vn(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Ut}}St._$litElement$=!0,St.finalized=!0,(ts=Ct.litElementHydrateSupport)==null||ts.call(Ct,{LitElement:St});const _o=Ct.litElementPolyfillSupport;_o==null||_o({LitElement:St}),(Ct.litElementVersions??(Ct.litElementVersions=[])).push("4.2.1");function yn(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const bn=Oe`
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
`;var wn=Object.defineProperty,$n=Object.getOwnPropertyDescriptor,jt=(e,t,o,r)=>{for(var s=r>1?void 0:r?$n(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&wn(t,o,s),s};let ht=class extends St{constructor(){super(),this.lower=!1,this.method="GET"}render(){let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.micro?`method ${e} micro`:`method ${e}`;return wo`
            <sl-tag variant="${yn(this.method)}" class="${t}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};ht.styles=bn,jt([tt()],ht.prototype,"method",2),jt([tt({type:Boolean})],ht.prototype,"lower",2),jt([tt({type:Boolean})],ht.prototype,"large",2),jt([tt({type:Boolean})],ht.prototype,"tiny",2),jt([tt({type:Boolean})],ht.prototype,"micro",2),ht=jt([uo("pb33f-http-method")],ht);const _n=Oe`
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
    }`;var xn=Object.defineProperty,An=Object.getOwnPropertyDescriptor,Re=(e,t,o,r)=>{for(var s=r>1?void 0:r?An(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&xn(t,o,s),s};let It=class extends St{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return wo` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};It.styles=_n,Re([tt()],It.prototype,"name",2),Re([tt()],It.prototype,"url",2),Re([tt({type:Boolean})],It.prototype,"wide",2),It=Re([uo("pb33f-header")],It);const Pn=Oe`

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

`,Cn=Oe`
    
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
 `,Sn="pb33f-theme-change";var En=Object.defineProperty,On=Object.getOwnPropertyDescriptor,xo=(e,t,o,r)=>{for(var s=r>1?void 0:r?On(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&En(t,o,s),s};const Ao="dark",kn="light",Tn="tektronix",Xr="pb33f-theme",Yr="pb33f-base-theme";let ae=class extends St{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Tn:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(Xr);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(Yr);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(Xr,e),localStorage.setItem(Yr,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===kn?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Sn,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Ao?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===Ao?"sun":"moon",t=this.baseTheme===Ao?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",o=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return wo`
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
        `}};ae.styles=[Pn,Cn],xo([Br()],ae.prototype,"baseTheme",2),xo([Br()],ae.prototype,"tektronixActive",2),ae=xo([uo("pb33f-theme-switcher")],ae);const Mn=O`
  :host {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: var(--pp-nav-width, 300px) 1fr;
    grid-template-areas:
      "header header"
      "nav content";
    min-height: 100vh;
    background: var(--background-color, #0d1117);
  }

  pb33f-header {
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  pb33f-theme-switcher {
    margin-left: auto;
  }

  ::slotted([slot='nav']) {
    grid-area: nav;
    background: var(--background-color, #0d1117);
    border-right: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    overflow-y: auto;
    position: sticky;
    top: var(--pp-header-height, 57px);
    height: calc(100vh - var(--pp-header-height, 57px));
  }

  ::slotted([slot='content']) {
    grid-area: content;
    padding: 2rem 3rem;
    max-width: 1000px;
  }
`;var Rn=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,Kr=(e,t,o,r)=>{for(var s=r>1?void 0:r?Ln(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Rn(t,o,s),s};f.PpLayout=class extends R{constructor(){super(...arguments),this.title=""}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation"}render(){return b`
      <pb33f-header name=${this.title} url="index.html" wide>
        <pb33f-theme-switcher></pb33f-theme-switcher>
      </pb33f-header>
      <slot name="nav"></slot>
      <slot name="content"></slot>
    `}},f.PpLayout.styles=Mn,Kr([V()],f.PpLayout.prototype,"title",2),f.PpLayout=Kr([F("pp-layout")],f.PpLayout);const zn=O`
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
`;var Nn=Object.defineProperty,Bn=Object.getOwnPropertyDescriptor,Po=(e,t,o,r)=>{for(var s=r>1?void 0:r?Bn(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Nn(t,o,s),s};f.PpNav=class extends R{constructor(){super(...arguments),this.tags=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return b`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?b`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(t=>b`<pp-nav-tag .tag=${t} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:$}
    `}},f.PpNav.styles=zn,Po([V()],f.PpNav.prototype,"tags",2),Po([V()],f.PpNav.prototype,"activeSlug",2),f.PpNav=Po([F("pp-nav")],f.PpNav);const Dn=O`
  :host {
    display: block;
  }
  details {
    margin-bottom: 0.15rem;
  }
  summary {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-family: var(--font-stack-bold, monospace);
    border-radius: 0;
    list-style: none;
    color: var(--font-color-sub1, #a7a7a7);
    text-transform: lowercase;
  }
  summary:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  summary::marker { display: none; }
  summary::-webkit-details-marker { display: none; }
  summary::before {
    content: '\\25B8 ';
    color: var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    margin-right: 2px;
  }
  details[open] > summary::before {
    content: '\\25BE ';
  }
  ul {
    list-style: none;
    margin: 0 0 0 0.5rem;
    padding: 0 0 0 0.5rem;
    border-left: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }
  li a {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0;
    color: var(--font-color, #e8e9ed);
    text-decoration: none;
  }
  li a:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    text-decoration: none;
  }
  li a.active {
    background: var(--secondary-color-very-lowalpha, rgba(248, 58, 255, 0.05));
    border-left: 2px solid var(--secondary-color, #f83aff);
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  .path {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--font-stack, monospace);
  }
  .children {
    margin-left: 0.25rem;
    padding-left: 0.25rem;
  }
  .deprecated {
    text-decoration: line-through;
    opacity: 0.5;
  }
`;var Un=Object.defineProperty,Hn=Object.getOwnPropertyDescriptor,Co=(e,t,o,r)=>{for(var s=r>1?void 0:r?Hn(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Un(t,o,s),s};function Zr(e,t){var o,r;return t?!!((o=e.Operations)!=null&&o.some(s=>s.Slug===t)||(r=e.Children)!=null&&r.some(s=>Zr(s,t))):!1}f.PpNavTag=class extends R{constructor(){super(...arguments),this.tag={Name:"",Summary:"",Children:null,Operations:null,IsNavOnly:!1},this.activeSlug=""}render(){var s,i;const{tag:t,activeSlug:o}=this,r=Zr(t,o);return b`
      <details ?open=${r}>
        <summary>${t.Name}</summary>
        ${(s=t.Operations)!=null&&s.length?b`
              <ul>
                ${t.Operations.map(n=>b`
                    <li>
                      <a
                        href="operations/${n.Slug}.html"
                        class="${n.Deprecated?"deprecated":""} ${n.Slug===o?"active":""}"
                      >
                        <pb33f-http-method method=${n.Method}></pb33f-http-method>
                        <span class="path">${n.Path}</span>
                      </a>
                    </li>
                  `)}
              </ul>
            `:$}
        ${(i=t.Children)!=null&&i.length?b`
              <div class="children">
                ${t.Children.map(n=>b`<pp-nav-tag .tag=${n} .activeSlug=${o}></pp-nav-tag>`)}
              </div>
            `:$}
      </details>
    `}},f.PpNavTag.styles=Dn,Co([m({type:Object})],f.PpNavTag.prototype,"tag",2),Co([m()],f.PpNavTag.prototype,"activeSlug",2),f.PpNavTag=Co([F("pp-nav-tag")],f.PpNavTag);const jn=O`
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
`;var In=Object.defineProperty,Fn=Object.getOwnPropertyDescriptor,le=(e,t,o,r)=>{for(var s=r>1?void 0:r?Fn(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&In(t,o,s),s};f.PpNavOperation=class extends R{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return b`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},f.PpNavOperation.styles=jn,le([m()],f.PpNavOperation.prototype,"method",2),le([m()],f.PpNavOperation.prototype,"path",2),le([m()],f.PpNavOperation.prototype,"slug",2),le([m({type:Boolean})],f.PpNavOperation.prototype,"deprecated",2),f.PpNavOperation=le([F("pp-nav-operation")],f.PpNavOperation);const Gr=O`
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
`,Vn=O`
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
`;var Wn=Object.defineProperty,qn=Object.getOwnPropertyDescriptor,So=(e,t,o,r)=>{for(var s=r>1?void 0:r?qn(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Wn(t,o,s),s};f.PpOperationPage=class extends R{constructor(){super(...arguments),this.operationJson="",this.parsed=null}willUpdate(t){if(t.has("operationJson")&&this.operationJson)try{this.parsed=JSON.parse(this.operationJson)}catch{this.parsed=null}}render(){return this.parsed?b`
      <h3>Raw Operation Definition</h3>
      <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
    `:$}},f.PpOperationPage.styles=[Gr,Vn],So([m({attribute:"operation-json"})],f.PpOperationPage.prototype,"operationJson",2),So([V()],f.PpOperationPage.prototype,"parsed",2),f.PpOperationPage=So([F("pp-operation-page")],f.PpOperationPage);const Jn=O`
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
`;var Xn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,Le=(e,t,o,r)=>{for(var s=r>1?void 0:r?Yn(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Xn(t,o,s),s};f.PpModelPage=class extends R{constructor(){super(...arguments),this.modelJson="",this.name="",this.parsed=null}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}render(){if(!this.parsed)return $;const t=this.parsed,o=t.properties||{},r=new Set(t.required||[]),s=Object.entries(o);return b`
      ${t.type?b`<div><strong>Type:</strong> ${t.type}</div>`:$}
      ${s.length?b`
            <h3>Properties</h3>
            ${s.map(([i,n])=>b`
                <div class="property">
                  <span class="prop-name">${i}</span>
                  ${n.type?b`<span class="prop-type">${n.type}</span>`:$}
                  ${r.has(i)?b`<span class="required-badge">required</span>`:$}
                  ${n.description?b`<div class="prop-desc">${n.description}</div>`:$}
                </div>
              `)}
          `:$}
      <h3>Schema Definition</h3>
      <pre><code>${JSON.stringify(t,null,2)}</code></pre>
    `}},f.PpModelPage.styles=[Gr,Jn],Le([m({attribute:"model-json"})],f.PpModelPage.prototype,"modelJson",2),Le([m()],f.PpModelPage.prototype,"name",2),Le([V()],f.PpModelPage.prototype,"parsed",2),f.PpModelPage=Le([F("pp-model-page")],f.PpModelPage);const Kn=O`
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
`;var Zn=Object.defineProperty,Gn=Object.getOwnPropertyDescriptor,ze=(e,t,o,r)=>{for(var s=r>1?void 0:r?Gn(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&Zn(t,o,s),s};f.PpModelCard=class extends R{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return b`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?b`<p>${this.description}</p>`:""}
      </a>
    `}},f.PpModelCard.styles=Kn,ze([m()],f.PpModelCard.prototype,"name",2),ze([m()],f.PpModelCard.prototype,"href",2),ze([m()],f.PpModelCard.prototype,"description",2),f.PpModelCard=ze([F("pp-model-card")],f.PpModelCard);const Qn=O`
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
`;var ta=Object.defineProperty,ea=Object.getOwnPropertyDescriptor,Eo=(e,t,o,r)=>{for(var s=r>1?void 0:r?ea(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&ta(t,o,s),s};f.PpCrossRefs=class extends R{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var r,s,i,n,a,l;const{refs:t}=this;return((r=t.UsedByOperations)==null?void 0:r.length)||((s=t.UsedByModels)==null?void 0:s.length)||((i=t.UsesModels)==null?void 0:i.length)?b`
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
          `:$}
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
          `:$}
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
          `:$}
    `:$}},f.PpCrossRefs.styles=Qn,Eo([m({attribute:"refs-json"})],f.PpCrossRefs.prototype,"refsJson",2),Eo([V()],f.PpCrossRefs.prototype,"refs",2),f.PpCrossRefs=Eo([F("pp-cross-refs")],f.PpCrossRefs);const oa=O`
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
`;var ra=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,Ne=(e,t,o,r)=>{for(var s=r>1?void 0:r?sa(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&ra(t,o,s),s};f.PpExampleBlock=class extends R{constructor(){super(...arguments),this.name="",this.exampleJson="",this.parsed=null}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{this.parsed=JSON.parse(this.exampleJson)}catch{this.parsed=null}}render(){return this.parsed?b`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>
      </details>
    `:$}},f.PpExampleBlock.styles=oa,Ne([m()],f.PpExampleBlock.prototype,"name",2),Ne([m({attribute:"example-json"})],f.PpExampleBlock.prototype,"exampleJson",2),Ne([V()],f.PpExampleBlock.prototype,"parsed",2),f.PpExampleBlock=Ne([F("pp-example-block")],f.PpExampleBlock);const ia=O`
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
`;var na=Object.defineProperty,aa=Object.getOwnPropertyDescriptor,Be=(e,t,o,r)=>{for(var s=r>1?void 0:r?aa(t,o):t,i=e.length-1,n;i>=0;i--)(n=e[i])&&(s=(r?n(t,o,s):n(s))||s);return r&&s&&na(t,o,s),s};f.PpComponentSection=class extends R{constructor(){super(...arguments),this.mediaType="",this.schemaJson="",this.parsed=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.parsed=JSON.parse(this.schemaJson)}catch{this.parsed=null}}render(){return b`
      ${this.mediaType?b`<div class="media-type">${this.mediaType}</div>`:$}
      ${this.parsed?b`<pre><code>${JSON.stringify(this.parsed,null,2)}</code></pre>`:$}
    `}},f.PpComponentSection.styles=ia,Be([m({attribute:"media-type"})],f.PpComponentSection.prototype,"mediaType",2),Be([m({attribute:"schema-json"})],f.PpComponentSection.prototype,"schemaJson",2),Be([V()],f.PpComponentSection.prototype,"parsed",2),f.PpComponentSection=Be([F("pp-component-section")],f.PpComponentSection),Ye("static/shoelace");const la={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>'};return Ts("default",{resolver:e=>{const t=la[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(f,Symbol.toStringTag,{value:"Module"}),f})({});
