var PrintingPress=(function(p){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Gn,Vn;const er=globalThis,ti=er.ShadowRoot&&(er.ShadyCSS===void 0||er.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ei=Symbol(),xs=new WeakMap;let Ls=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==ei)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(ti&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=xs.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&xs.set(o,t))}return t}toString(){return this.cssText}};const Kn=e=>new Ls(typeof e=="string"?e:e+"",void 0,ei),E=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Ls(o,e,ei)},tl=(e,t)=>{if(ti)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const r=document.createElement("style"),i=er.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},Cs=ti?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return Kn(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:el,defineProperty:ol,getOwnPropertyDescriptor:rl,getOwnPropertyNames:il,getOwnPropertySymbols:sl,getPrototypeOf:al}=Object,ae=globalThis,Is=ae.trustedTypes,nl=Is?Is.emptyScript:"",oi=ae.reactiveElementPolyfillSupport,bo=(e,t)=>e,Fe={toAttribute(e,t){switch(t){case Boolean:e=e?nl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},ri=(e,t)=>!el(e,t),As={attribute:!0,type:String,converter:Fe,reflect:!1,useDefault:!1,hasChanged:ri};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ae.litPropertyMetadata??(ae.litPropertyMetadata=new WeakMap);let Ge=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=As){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&ol(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){const{get:i,set:s}=rl(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:i,set(a){const n=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??As}static _$Ei(){if(this.hasOwnProperty(bo("elementProperties")))return;const t=al(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(bo("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bo("properties"))){const o=this.properties,r=[...il(o),...sl(o)];for(const i of r)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)o.unshift(Cs(i))}else t!==void 0&&o.push(Cs(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(o=>this.enableUpdating=o),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(o=>o(this))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return tl(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)})}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const a=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Fe).toAttribute(o,r.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,o){var s,a;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Fe;this._$Em=i;const c=l.fromAttribute(o,n.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(t,o,r,i=!1,s){var a;if(t!==void 0){const n=this.constructor;if(i===!1&&(s=this[t]),r??(r=n.getPropertyOptions(t)),!((r.hasChanged??ri)(s,o)||r.useDefault&&r.reflect&&s===((a=this._$Ej)==null?void 0:a.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),s!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:n}=a,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};Ge.elementStyles=[],Ge.shadowRootOptions={mode:"open"},Ge[bo("elementProperties")]=new Map,Ge[bo("finalized")]=new Map,oi==null||oi({ReactiveElement:Ge}),(ae.reactiveElementVersions??(ae.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vo=globalThis,js=e=>e,or=vo.trustedTypes,Ss=or?or.createPolicy("lit-html",{createHTML:e=>e}):void 0,Ns="$lit$",ne=`lit$${Math.random().toFixed(9).slice(2)}$`,Ts="?"+ne,ll=`<${Ts}>`,Ce=document,yo=()=>Ce.createComment(""),wo=e=>e===null||typeof e!="object"&&typeof e!="function",ii=Array.isArray,cl=e=>ii(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",si=`[ 	
\f\r]`,Mo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ks=/-->/g,Ds=/>/g,Ie=RegExp(`>|${si}(?:([^\\s"'>=/]+)(${si}*=${si}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Es=/'/g,zs=/"/g,$s=/^(?:script|style|textarea|title)$/i,dl=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),d=dl(1),Tt=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),_s=new WeakMap,Ae=Ce.createTreeWalker(Ce,129);function Os(e,t){if(!ii(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ss!==void 0?Ss.createHTML(t):t}const pl=(e,t)=>{const o=e.length-1,r=[];let i,s=t===2?"<svg>":t===3?"<math>":"",a=Mo;for(let n=0;n<o;n++){const l=e[n];let c,g,m=-1,w=0;for(;w<l.length&&(a.lastIndex=w,g=a.exec(l),g!==null);)w=a.lastIndex,a===Mo?g[1]==="!--"?a=ks:g[1]!==void 0?a=Ds:g[2]!==void 0?($s.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=Ie):g[3]!==void 0&&(a=Ie):a===Ie?g[0]===">"?(a=i??Mo,m=-1):g[1]===void 0?m=-2:(m=a.lastIndex-g[2].length,c=g[1],a=g[3]===void 0?Ie:g[3]==='"'?zs:Es):a===zs||a===Es?a=Ie:a===ks||a===Ds?a=Mo:(a=Ie,i=void 0);const f=a===Ie&&e[n+1].startsWith("/>")?" ":"";s+=a===Mo?l+ll:m>=0?(r.push(c),l.slice(0,m)+Ns+l.slice(m)+ne+f):l+ne+(m===-2?n:f)}return[Os(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let ai=class Xn{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,a=0;const n=t.length-1,l=this.parts,[c,g]=pl(t,o);if(this.el=Xn.createElement(c,r),Ae.currentNode=this.el.content,o===2||o===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=Ae.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const m of i.getAttributeNames())if(m.endsWith(Ns)){const w=g[a++],f=i.getAttribute(m).split(ne),M=/([.?@])?(.*)/.exec(w);l.push({type:1,index:s,name:M[2],strings:f,ctor:M[1]==="."?hl:M[1]==="?"?gl:M[1]==="@"?ml:rr}),i.removeAttribute(m)}else m.startsWith(ne)&&(l.push({type:6,index:s}),i.removeAttribute(m));if($s.test(i.tagName)){const m=i.textContent.split(ne),w=m.length-1;if(w>0){i.textContent=or?or.emptyScript:"";for(let f=0;f<w;f++)i.append(m[f],yo()),Ae.nextNode(),l.push({type:2,index:++s});i.append(m[w],yo())}}}else if(i.nodeType===8)if(i.data===Ts)l.push({type:2,index:s});else{let m=-1;for(;(m=i.data.indexOf(ne,m+1))!==-1;)l.push({type:7,index:s}),m+=ne.length-1}s++}}static createElement(t,o){const r=Ce.createElement("template");return r.innerHTML=t,r}};function Ve(e,t,o=e,r){var a,n;if(t===Tt)return t;let i=r!==void 0?(a=o._$Co)==null?void 0:a[r]:o._$Cl;const s=wo(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=Ve(e,i._$AS(e,t.values),i,r)),t}let ul=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??Ce).importNode(o,!0);Ae.currentNode=i;let s=Ae.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new ni(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new fl(s,this,t)),this._$AV.push(c),l=r[++n]}a!==(l==null?void 0:l.index)&&(s=Ae.nextNode(),a++)}return Ae.currentNode=Ce,i}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},ni=class qn{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Ve(this,t,o),wo(t)?t===y||t==null||t===""?(this._$AH!==y&&this._$AR(),this._$AH=y):t!==this._$AH&&t!==Tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):cl(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==y&&wo(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ce.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ai.createElement(Os(r.h,r.h[0]),this.options)),r);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(o);else{const a=new ul(i,this),n=a.u(this.options);a.p(o),this.T(n),this._$AH=a}}_$AC(t){let o=_s.get(t.strings);return o===void 0&&_s.set(t.strings,o=new ai(t)),o}k(t){ii(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,i=0;for(const s of t)i===o.length?o.push(r=new qn(this.O(yo()),this.O(yo()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const i=js(t).nextSibling;js(t).remove(),t=i}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}},rr=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=y,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=y}_$AI(t,o=this,r,i){const s=this.strings;let a=!1;if(s===void 0)t=Ve(this,t,o,0),a=!wo(t)||t!==this._$AH&&t!==Tt,a&&(this._$AH=t);else{const n=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Ve(this,n[r+l],o,l),c===Tt&&(c=this._$AH[l]),a||(a=!wo(c)||c!==this._$AH[l]),c===y?t=y:t!==y&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},hl=class extends rr{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===y?void 0:t}},gl=class extends rr{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==y)}},ml=class extends rr{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=Ve(this,t,o,0)??y)===Tt)return;const r=this._$AH,i=t===y&&r!==y||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==y&&(r===y||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}};class fl{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ve(this,t)}}const li=vo.litHtmlPolyfillSupport;li==null||li(ai,ni),(vo.litHtmlVersions??(vo.litHtmlVersions=[])).push("3.3.2");const bl=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const s=(o==null?void 0:o.renderBefore)??null;r._$litPart$=i=new ni(t.insertBefore(yo(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const je=globalThis;let Q=class extends Ge{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=bl(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Tt}};Q._$litElement$=!0,Q.finalized=!0,(Gn=je.litElementHydrateSupport)==null||Gn.call(je,{LitElement:Q});const ci=je.litElementPolyfillSupport;ci==null||ci({LitElement:Q}),(je.litElementVersions??(je.litElementVersions=[])).push("4.2.2");var vl=E`
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
`,yl=E`
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
`,di="";function pi(e){di=e}function wl(e=""){if(!di){const t=[...document.getElementsByTagName("script")],o=t.find(r=>r.hasAttribute("data-shoelace"));if(o)pi(o.getAttribute("data-shoelace"));else{const r=t.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";r&&(i=r.getAttribute("src")),pi(i.split("/").slice(0,-1).join("/"))}}return di.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Ml={name:"default",resolver:e=>wl(`assets/icons/${e}.svg`)},xl=Ml,Ps={caret:`
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
  `},Ll={name:"system",resolver:e=>e in Ps?`data:image/svg+xml,${encodeURIComponent(Ps[e])}`:""},Cl=Ll,ir=[xl,Cl],sr=[];function Il(e){sr.push(e)}function Al(e){sr=sr.filter(t=>t!==e)}function Rs(e){return ir.find(t=>t.name===e)}function jl(e,t){Sl(e),ir.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),sr.forEach(o=>{o.library===e&&o.setIcon()})}function Sl(e){ir=ir.filter(t=>t.name!==e)}var Nl=E`
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
`,Us=Object.defineProperty,Tl=Object.defineProperties,kl=Object.getOwnPropertyDescriptor,Dl=Object.getOwnPropertyDescriptors,Ys=Object.getOwnPropertySymbols,El=Object.prototype.hasOwnProperty,zl=Object.prototype.propertyIsEnumerable,ui=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),hi=e=>{throw TypeError(e)},Bs=(e,t,o)=>t in e?Us(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,Kt=(e,t)=>{for(var o in t||(t={}))El.call(t,o)&&Bs(e,o,t[o]);if(Ys)for(var o of Ys(t))zl.call(t,o)&&Bs(e,o,t[o]);return e},xo=(e,t)=>Tl(e,Dl(t)),u=(e,t,o,r)=>{for(var i=r>1?void 0:r?kl(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Us(t,o,i),i},Hs=(e,t,o)=>t.has(e)||hi("Cannot "+o),$l=(e,t,o)=>(Hs(e,t,"read from private field"),t.get(e)),_l=(e,t,o)=>t.has(e)?hi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),Ol=(e,t,o,r)=>(Hs(e,t,"write to private field"),t.set(e,o),o),Pl=function(e,t){this[0]=e,this[1]=t},Rl=e=>{var t=e[ui("asyncIterator")],o=!1,r,i={};return t==null?(t=e[ui("iterator")](),r=s=>i[s]=a=>t[s](a)):(t=t.call(e),r=s=>i[s]=a=>{if(o){if(o=!1,s==="throw")throw a;return a}return o=!0,{done:!1,value:new Pl(new Promise(n=>{var l=t[s](a);l instanceof Object||hi("Object expected"),n(l)}),1)}}),i[ui("iterator")]=()=>i,r("next"),"throw"in t?r("throw"):i.throw=s=>{throw s},"return"in t&&r("return"),i};function G(e,t){const o=Kt({waitUntilFirstUpdate:!1},t);return(r,i)=>{const{update:s}=r,a=Array.isArray(e)?e:[e];r.update=function(n){a.forEach(l=>{const c=l;if(n.has(c)){const g=n.get(c),m=this[c];g!==m&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[i](g,m)}}),s.call(this,n)}}}var et=E`
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
 */const Ul={attribute:!0,type:String,converter:Fe,reflect:!1,hasChanged:ri},Yl=(e=Ul,t,o)=>{const{kind:r,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),r==="accessor"){const{name:a}=o;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,e,!0,n)},init(n){return n!==void 0&&this.C(a,void 0,e,n),n}}}if(r==="setter"){const{name:a}=o;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,e,!0,n)}}throw Error("Unsupported decorator location: "+r)};function h(e){return(t,o)=>typeof o=="object"?Yl(e,t,o):((r,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(e){return h({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Bl(e){return(t,o)=>{const r=typeof t=="function"?t:t[o];Object.assign(r,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hl=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _(e,t){return(o,r,i)=>{const s=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(e))??null};return Hl(o,r,{get(){return s(this)}})}}var ar,V=class extends Q{constructor(){super(),_l(this,ar,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,o])=>{this.constructor.define(t,o)})}emit(t,o){const r=new CustomEvent(t,Kt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},o));return this.dispatchEvent(r),r}static define(t,o=this,r={}){const i=customElements.get(t);if(!i){try{customElements.define(t,o,r)}catch{customElements.define(t,class extends o{},r)}return}let s=" (unknown version)",a=s;"version"in o&&o.version&&(s=" v"+o.version),"version"in i&&i.version&&(a=" v"+i.version),!(s&&a&&s===a)&&console.warn(`Attempted to register <${t}>${s}, but <${t}>${a} has already been registered.`)}attributeChangedCallback(t,o,r){$l(this,ar)||(this.constructor.elementProperties.forEach((i,s)=>{i.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),Ol(this,ar,!0)),super.attributeChangedCallback(t,o,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((o,r)=>{t.has(r)&&this[r]==null&&(this[r]=o)})}};ar=new WeakMap,V.version="2.20.1",V.dependencies={},u([h()],V.prototype,"dir",2),u([h()],V.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ql=(e,t)=>(e==null?void 0:e._$litType$)!==void 0,Qs=e=>e.strings===void 0,Wl={},Zl=(e,t=Wl)=>e._$AH=t;var Lo=Symbol(),nr=Symbol(),gi,mi=new Map,ut=class extends V{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var o;let r;if(t!=null&&t.spriteSheet)return this.svg=d`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(r=await fetch(e,{mode:"cors"}),!r.ok)return r.status===410?Lo:nr}catch{return nr}try{const i=document.createElement("div");i.innerHTML=await r.text();const s=i.firstElementChild;if(((o=s==null?void 0:s.tagName)==null?void 0:o.toLowerCase())!=="svg")return Lo;gi||(gi=new DOMParser);const n=gi.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return n?(n.part.add("svg"),document.adoptNode(n)):Lo}catch{return Lo}}connectedCallback(){super.connectedCallback(),Il(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Al(this)}getIconSource(){const e=Rs(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:o}=this.getIconSource(),r=o?Rs(this.library):void 0;if(!t){this.svg=null;return}let i=mi.get(t);if(i||(i=this.resolveIcon(t,r),mi.set(t,i)),!this.initialRender)return;const s=await i;if(s===nr&&mi.delete(t),t===this.getIconSource().url){if(Ql(s)){if(this.svg=s,r){await this.updateComplete;const a=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&a&&r.mutator(a)}return}switch(s){case nr:case Lo:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(e=r==null?void 0:r.mutator)==null||e.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};ut.styles=[et,Nl],u([k()],ut.prototype,"svg",2),u([h({reflect:!0})],ut.prototype,"name",2),u([h()],ut.prototype,"src",2),u([h()],ut.prototype,"label",2),u([h({reflect:!0})],ut.prototype,"library",2),u([G("label")],ut.prototype,"handleLabelChange",1),u([G(["name","src","library"])],ut.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const te={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},lr=e=>(...t)=>({_$litDirective$:e,values:t});let cr=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rt=lr(class extends cr{constructor(e){var t;if(super(e),e.type!==te.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in t)t[s]&&!((r=this.nt)!=null&&r.has(s))&&this.st.add(s);return this.render(t)}const o=e.element.classList;for(const s of this.st)s in t||(o.remove(s),this.st.delete(s));for(const s in t){const a=!!t[s];a===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(a?(o.add(s),this.st.add(s)):(o.remove(s),this.st.delete(s)))}return Tt}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fi=Symbol.for(""),Fl=e=>{if((e==null?void 0:e.r)===fi)return e==null?void 0:e._$litStatic$},Gl=e=>({_$litStatic$:e,r:fi}),dr=(e,...t)=>({_$litStatic$:t.reduce((o,r,i)=>o+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+e[i+1],e[0]),r:fi}),Ws=new Map,Vl=e=>(t,...o)=>{const r=o.length;let i,s;const a=[],n=[];let l,c=0,g=!1;for(;c<r;){for(l=t[c];c<r&&(s=o[c],(i=Fl(s))!==void 0);)l+=i+t[++c],g=!0;c!==r&&n.push(s),a.push(l),c++}if(c===r&&a.push(t[r]),g){const m=a.join("$$lit$$");(t=Ws.get(m))===void 0&&(a.raw=a,Ws.set(m,t=a)),o=n}return e(t,...o)},Co=Vl(d);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const O=e=>e??y;var at=class extends V{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?dr`a`:dr`button`;return Co`
      <${t}
        part="base"
        class=${rt({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${O(e?void 0:this.disabled)}
        type=${O(e?void 0:"button")}
        href=${O(e?this.href:void 0)}
        target=${O(e?this.target:void 0)}
        download=${O(e?this.download:void 0)}
        rel=${O(e&&this.target?"noreferrer noopener":void 0)}
        role=${O(e?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${O(this.name)}
          library=${O(this.library)}
          src=${O(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};at.styles=[et,yl],at.dependencies={"sl-icon":ut},u([_(".icon-button")],at.prototype,"button",2),u([k()],at.prototype,"hasFocus",2),u([h()],at.prototype,"name",2),u([h()],at.prototype,"library",2),u([h()],at.prototype,"src",2),u([h()],at.prototype,"href",2),u([h()],at.prototype,"target",2),u([h()],at.prototype,"download",2),u([h()],at.prototype,"label",2),u([h({type:Boolean,reflect:!0})],at.prototype,"disabled",2);const bi=new Set,Je=new Map;let Se,vi="ltr",yi="en";const Zs=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Zs){const e=new MutationObserver(Gs);vi=document.documentElement.dir||"ltr",yi=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Fs(...e){e.map(t=>{const o=t.$code.toLowerCase();Je.has(o)?Je.set(o,Object.assign(Object.assign({},Je.get(o)),t)):Je.set(o,t),Se||(Se=t)}),Gs()}function Gs(){Zs&&(vi=document.documentElement.dir||"ltr",yi=document.documentElement.lang||navigator.language),[...bi.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Jl=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){bi.add(this.host)}hostDisconnected(){bi.delete(this.host)}dir(){return`${this.host.dir||vi}`.toLowerCase()}lang(){return`${this.host.lang||yi}`.toLowerCase()}getTranslationData(t){var o,r;const i=new Intl.Locale(t.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),a=(r=(o=i==null?void 0:i.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",n=Je.get(`${s}-${a}`),l=Je.get(s);return{locale:i,language:s,region:a,primary:n,secondary:l}}exists(t,o){var r;const{primary:i,secondary:s}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[t]||s&&s[t]||o.includeFallback&&Se&&Se[t])}term(t,...o){const{primary:r,secondary:i}=this.getTranslationData(this.lang());let s;if(r&&r[t])s=r[t];else if(i&&i[t])s=i[t];else if(Se&&Se[t])s=Se[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...o):s}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var Vs={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};Fs(Vs);var Xl=Vs,ht=class extends Jl{};Fs(Xl);var Ne=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return d`
      <span
        part="base"
        class=${rt({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?d`
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
    `}};Ne.styles=[et,vl],Ne.dependencies={"sl-icon-button":at},u([h({reflect:!0})],Ne.prototype,"variant",2),u([h({reflect:!0})],Ne.prototype,"size",2),u([h({type:Boolean,reflect:!0})],Ne.prototype,"pill",2),u([h({type:Boolean})],Ne.prototype,"removable",2),Ne.define("sl-tag"),at.define("sl-icon-button");var ql=E`
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
`,Kl=E`
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
`;const le=Math.min,wt=Math.max,pr=Math.round,ur=Math.floor,Qt=e=>({x:e,y:e}),tc={left:"right",right:"left",bottom:"top",top:"bottom"};function wi(e,t,o){return wt(e,le(t,o))}function Xe(e,t){return typeof e=="function"?e(t):e}function ce(e){return e.split("-")[0]}function qe(e){return e.split("-")[1]}function Js(e){return e==="x"?"y":"x"}function Mi(e){return e==="y"?"height":"width"}function ee(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function xi(e){return Js(ee(e))}function ec(e,t,o){o===void 0&&(o=!1);const r=qe(e),i=xi(e),s=Mi(i);let a=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(a=hr(a)),[a,hr(a)]}function oc(e){const t=hr(e);return[Li(e),t,Li(t)]}function Li(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const Xs=["left","right"],qs=["right","left"],rc=["top","bottom"],ic=["bottom","top"];function sc(e,t,o){switch(e){case"top":case"bottom":return o?t?qs:Xs:t?Xs:qs;case"left":case"right":return t?rc:ic;default:return[]}}function ac(e,t,o,r){const i=qe(e);let s=sc(ce(e),o==="start",r);return i&&(s=s.map(a=>a+"-"+i),t&&(s=s.concat(s.map(Li)))),s}function hr(e){const t=ce(e);return tc[t]+e.slice(t.length)}function nc(e){return{top:0,right:0,bottom:0,left:0,...e}}function Ks(e){return typeof e!="number"?nc(e):{top:e,right:e,bottom:e,left:e}}function gr(e){const{x:t,y:o,width:r,height:i}=e;return{width:r,height:i,top:o,left:t,right:t+r,bottom:o+i,x:t,y:o}}function ta(e,t,o){let{reference:r,floating:i}=e;const s=ee(t),a=xi(t),n=Mi(a),l=ce(t),c=s==="y",g=r.x+r.width/2-i.width/2,m=r.y+r.height/2-i.height/2,w=r[n]/2-i[n]/2;let f;switch(l){case"top":f={x:g,y:r.y-i.height};break;case"bottom":f={x:g,y:r.y+r.height};break;case"right":f={x:r.x+r.width,y:m};break;case"left":f={x:r.x-i.width,y:m};break;default:f={x:r.x,y:r.y}}switch(qe(t)){case"start":f[a]-=w*(o&&c?-1:1);break;case"end":f[a]+=w*(o&&c?-1:1);break}return f}async function lc(e,t){var o;t===void 0&&(t={});const{x:r,y:i,platform:s,rects:a,elements:n,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:g="viewport",elementContext:m="floating",altBoundary:w=!1,padding:f=0}=Xe(t,e),M=Ks(f),j=n[w?m==="floating"?"reference":"floating":m],A=gr(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(j)))==null||o?j:j.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(n.floating)),boundary:c,rootBoundary:g,strategy:l})),v=m==="floating"?{x:r,y:i,width:a.floating.width,height:a.floating.height}:a.reference,b=await(s.getOffsetParent==null?void 0:s.getOffsetParent(n.floating)),x=await(s.isElement==null?void 0:s.isElement(b))?await(s.getScale==null?void 0:s.getScale(b))||{x:1,y:1}:{x:1,y:1},C=gr(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:v,offsetParent:b,strategy:l}):v);return{top:(A.top-C.top+M.top)/x.y,bottom:(C.bottom-A.bottom+M.bottom)/x.y,left:(A.left-C.left+M.left)/x.x,right:(C.right-A.right+M.right)/x.x}}const cc=50,dc=async(e,t,o)=>{const{placement:r="bottom",strategy:i="absolute",middleware:s=[],platform:a}=o,n=a.detectOverflow?a:{...a,detectOverflow:lc},l=await(a.isRTL==null?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:g,y:m}=ta(c,r,l),w=r,f=0;const M={};for(let I=0;I<s.length;I++){const j=s[I];if(!j)continue;const{name:A,fn:v}=j,{x:b,y:x,data:C,reset:L}=await v({x:g,y:m,initialPlacement:r,placement:w,strategy:i,middlewareData:M,rects:c,platform:n,elements:{reference:e,floating:t}});g=b??g,m=x??m,M[A]={...M[A],...C},L&&f<cc&&(f++,typeof L=="object"&&(L.placement&&(w=L.placement),L.rects&&(c=L.rects===!0?await a.getElementRects({reference:e,floating:t,strategy:i}):L.rects),{x:g,y:m}=ta(c,w,l)),I=-1)}return{x:g,y:m,placement:w,strategy:i,middlewareData:M}},pc=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:i,rects:s,platform:a,elements:n,middlewareData:l}=t,{element:c,padding:g=0}=Xe(e,t)||{};if(c==null)return{};const m=Ks(g),w={x:o,y:r},f=xi(i),M=Mi(f),I=await a.getDimensions(c),j=f==="y",A=j?"top":"left",v=j?"bottom":"right",b=j?"clientHeight":"clientWidth",x=s.reference[M]+s.reference[f]-w[f]-s.floating[M],C=w[f]-s.reference[f],L=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let S=L?L[b]:0;(!S||!await(a.isElement==null?void 0:a.isElement(L)))&&(S=n.floating[b]||s.floating[M]);const z=x/2-C/2,N=S/2-I[M]/2-1,$=le(m[A],N),Y=le(m[v],N),H=$,st=S-I[M]-Y,B=S/2-I[M]/2+z,pt=wi(H,B,st),ot=!l.arrow&&qe(i)!=null&&B!==pt&&s.reference[M]/2-(B<H?$:Y)-I[M]/2<0,X=ot?B<H?B-H:B-st:0;return{[f]:w[f]+X,data:{[f]:pt,centerOffset:B-pt-X,...ot&&{alignmentOffset:X}},reset:ot}}}),uc=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:i,middlewareData:s,rects:a,initialPlacement:n,platform:l,elements:c}=t,{mainAxis:g=!0,crossAxis:m=!0,fallbackPlacements:w,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:M="none",flipAlignment:I=!0,...j}=Xe(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const A=ce(i),v=ee(n),b=ce(n)===n,x=await(l.isRTL==null?void 0:l.isRTL(c.floating)),C=w||(b||!I?[hr(n)]:oc(n)),L=M!=="none";!w&&L&&C.push(...ac(n,I,M,x));const S=[n,...C],z=await l.detectOverflow(t,j),N=[];let $=((r=s.flip)==null?void 0:r.overflows)||[];if(g&&N.push(z[A]),m){const B=ec(i,a,x);N.push(z[B[0]],z[B[1]])}if($=[...$,{placement:i,overflows:N}],!N.every(B=>B<=0)){var Y,H;const B=(((Y=s.flip)==null?void 0:Y.index)||0)+1,pt=S[B];if(pt&&(!(m==="alignment"?v!==ee(pt):!1)||$.every(R=>ee(R.placement)===v?R.overflows[0]>0:!0)))return{data:{index:B,overflows:$},reset:{placement:pt}};let ot=(H=$.filter(X=>X.overflows[0]<=0).sort((X,R)=>X.overflows[1]-R.overflows[1])[0])==null?void 0:H.placement;if(!ot)switch(f){case"bestFit":{var st;const X=(st=$.filter(R=>{if(L){const F=ee(R.placement);return F===v||F==="y"}return!0}).map(R=>[R.placement,R.overflows.filter(F=>F>0).reduce((F,qt)=>F+qt,0)]).sort((R,F)=>R[1]-F[1])[0])==null?void 0:st[0];X&&(ot=X);break}case"initialPlacement":ot=n;break}if(i!==ot)return{reset:{placement:ot}}}return{}}}},hc=new Set(["left","top"]);async function gc(e,t){const{placement:o,platform:r,elements:i}=e,s=await(r.isRTL==null?void 0:r.isRTL(i.floating)),a=ce(o),n=qe(o),l=ee(o)==="y",c=hc.has(a)?-1:1,g=s&&l?-1:1,m=Xe(t,e);let{mainAxis:w,crossAxis:f,alignmentAxis:M}=typeof m=="number"?{mainAxis:m,crossAxis:0,alignmentAxis:null}:{mainAxis:m.mainAxis||0,crossAxis:m.crossAxis||0,alignmentAxis:m.alignmentAxis};return n&&typeof M=="number"&&(f=n==="end"?M*-1:M),l?{x:f*g,y:w*c}:{x:w*c,y:f*g}}const mc=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:i,y:s,placement:a,middlewareData:n}=t,l=await gc(t,e);return a===((o=n.offset)==null?void 0:o.placement)&&(r=n.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:a}}}}},fc=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:i,platform:s}=t,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:A=>{let{x:v,y:b}=A;return{x:v,y:b}}},...c}=Xe(e,t),g={x:o,y:r},m=await s.detectOverflow(t,c),w=ee(ce(i)),f=Js(w);let M=g[f],I=g[w];if(a){const A=f==="y"?"top":"left",v=f==="y"?"bottom":"right",b=M+m[A],x=M-m[v];M=wi(b,M,x)}if(n){const A=w==="y"?"top":"left",v=w==="y"?"bottom":"right",b=I+m[A],x=I-m[v];I=wi(b,I,x)}const j=l.fn({...t,[f]:M,[w]:I});return{...j,data:{x:j.x-o,y:j.y-r,enabled:{[f]:a,[w]:n}}}}}},bc=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:i,rects:s,platform:a,elements:n}=t,{apply:l=()=>{},...c}=Xe(e,t),g=await a.detectOverflow(t,c),m=ce(i),w=qe(i),f=ee(i)==="y",{width:M,height:I}=s.floating;let j,A;m==="top"||m==="bottom"?(j=m,A=w===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(A=m,j=w==="end"?"top":"bottom");const v=I-g.top-g.bottom,b=M-g.left-g.right,x=le(I-g[j],v),C=le(M-g[A],b),L=!t.middlewareData.shift;let S=x,z=C;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(z=b),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(S=v),L&&!w){const $=wt(g.left,0),Y=wt(g.right,0),H=wt(g.top,0),st=wt(g.bottom,0);f?z=M-2*($!==0||Y!==0?$+Y:wt(g.left,g.right)):S=I-2*(H!==0||st!==0?H+st:wt(g.top,g.bottom))}await l({...t,availableWidth:z,availableHeight:S});const N=await a.getDimensions(n.floating);return M!==N.width||I!==N.height?{reset:{rects:!0}}:{}}}};function mr(){return typeof window<"u"}function Ke(e){return ea(e)?(e.nodeName||"").toLowerCase():"#document"}function Mt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Wt(e){var t;return(t=(ea(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function ea(e){return mr()?e instanceof Node||e instanceof Mt(e).Node:!1}function Et(e){return mr()?e instanceof Element||e instanceof Mt(e).Element:!1}function oe(e){return mr()?e instanceof HTMLElement||e instanceof Mt(e).HTMLElement:!1}function oa(e){return!mr()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof Mt(e).ShadowRoot}function Io(e){const{overflow:t,overflowX:o,overflowY:r,display:i}=zt(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&i!=="inline"&&i!=="contents"}function vc(e){return/^(table|td|th)$/.test(Ke(e))}function fr(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const yc=/transform|translate|scale|rotate|perspective|filter/,wc=/paint|layout|strict|content/,Te=e=>!!e&&e!=="none";let Ci;function br(e){const t=Et(e)?zt(e):e;return Te(t.transform)||Te(t.translate)||Te(t.scale)||Te(t.rotate)||Te(t.perspective)||!Ii()&&(Te(t.backdropFilter)||Te(t.filter))||yc.test(t.willChange||"")||wc.test(t.contain||"")}function Mc(e){let t=de(e);for(;oe(t)&&!to(t);){if(br(t))return t;if(fr(t))return null;t=de(t)}return null}function Ii(){return Ci==null&&(Ci=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Ci}function to(e){return/^(html|body|#document)$/.test(Ke(e))}function zt(e){return Mt(e).getComputedStyle(e)}function vr(e){return Et(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function de(e){if(Ke(e)==="html")return e;const t=e.assignedSlot||e.parentNode||oa(e)&&e.host||Wt(e);return oa(t)?t.host:t}function ra(e){const t=de(e);return to(t)?e.ownerDocument?e.ownerDocument.body:e.body:oe(t)&&Io(t)?t:ra(t)}function Ao(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const i=ra(e),s=i===((r=e.ownerDocument)==null?void 0:r.body),a=Mt(i);if(s){const n=Ai(a);return t.concat(a,a.visualViewport||[],Io(i)?i:[],n&&o?Ao(n):[])}else return t.concat(i,Ao(i,[],o))}function Ai(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function ia(e){const t=zt(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const i=oe(e),s=i?e.offsetWidth:o,a=i?e.offsetHeight:r,n=pr(o)!==s||pr(r)!==a;return n&&(o=s,r=a),{width:o,height:r,$:n}}function ji(e){return Et(e)?e:e.contextElement}function eo(e){const t=ji(e);if(!oe(t))return Qt(1);const o=t.getBoundingClientRect(),{width:r,height:i,$:s}=ia(t);let a=(s?pr(o.width):o.width)/r,n=(s?pr(o.height):o.height)/i;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const xc=Qt(0);function sa(e){const t=Mt(e);return!Ii()||!t.visualViewport?xc:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Lc(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==Mt(e)?!1:t}function ke(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const i=e.getBoundingClientRect(),s=ji(e);let a=Qt(1);t&&(r?Et(r)&&(a=eo(r)):a=eo(e));const n=Lc(s,o,r)?sa(s):Qt(0);let l=(i.left+n.x)/a.x,c=(i.top+n.y)/a.y,g=i.width/a.x,m=i.height/a.y;if(s){const w=Mt(s),f=r&&Et(r)?Mt(r):r;let M=w,I=Ai(M);for(;I&&r&&f!==M;){const j=eo(I),A=I.getBoundingClientRect(),v=zt(I),b=A.left+(I.clientLeft+parseFloat(v.paddingLeft))*j.x,x=A.top+(I.clientTop+parseFloat(v.paddingTop))*j.y;l*=j.x,c*=j.y,g*=j.x,m*=j.y,l+=b,c+=x,M=Mt(I),I=Ai(M)}}return gr({width:g,height:m,x:l,y:c})}function yr(e,t){const o=vr(e).scrollLeft;return t?t.left+o:ke(Wt(e)).left+o}function aa(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-yr(e,o),i=o.top+t.scrollTop;return{x:r,y:i}}function Cc(e){let{elements:t,rect:o,offsetParent:r,strategy:i}=e;const s=i==="fixed",a=Wt(r),n=t?fr(t.floating):!1;if(r===a||n&&s)return o;let l={scrollLeft:0,scrollTop:0},c=Qt(1);const g=Qt(0),m=oe(r);if((m||!m&&!s)&&((Ke(r)!=="body"||Io(a))&&(l=vr(r)),m)){const f=ke(r);c=eo(r),g.x=f.x+r.clientLeft,g.y=f.y+r.clientTop}const w=a&&!m&&!s?aa(a,l):Qt(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+g.x+w.x,y:o.y*c.y-l.scrollTop*c.y+g.y+w.y}}function Ic(e){return Array.from(e.getClientRects())}function Ac(e){const t=Wt(e),o=vr(e),r=e.ownerDocument.body,i=wt(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=wt(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let a=-o.scrollLeft+yr(e);const n=-o.scrollTop;return zt(r).direction==="rtl"&&(a+=wt(t.clientWidth,r.clientWidth)-i),{width:i,height:s,x:a,y:n}}const na=25;function jc(e,t){const o=Mt(e),r=Wt(e),i=o.visualViewport;let s=r.clientWidth,a=r.clientHeight,n=0,l=0;if(i){s=i.width,a=i.height;const g=Ii();(!g||g&&t==="fixed")&&(n=i.offsetLeft,l=i.offsetTop)}const c=yr(r);if(c<=0){const g=r.ownerDocument,m=g.body,w=getComputedStyle(m),f=g.compatMode==="CSS1Compat"&&parseFloat(w.marginLeft)+parseFloat(w.marginRight)||0,M=Math.abs(r.clientWidth-m.clientWidth-f);M<=na&&(s-=M)}else c<=na&&(s+=c);return{width:s,height:a,x:n,y:l}}function Sc(e,t){const o=ke(e,!0,t==="fixed"),r=o.top+e.clientTop,i=o.left+e.clientLeft,s=oe(e)?eo(e):Qt(1),a=e.clientWidth*s.x,n=e.clientHeight*s.y,l=i*s.x,c=r*s.y;return{width:a,height:n,x:l,y:c}}function la(e,t,o){let r;if(t==="viewport")r=jc(e,o);else if(t==="document")r=Ac(Wt(e));else if(Et(t))r=Sc(t,o);else{const i=sa(e);r={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return gr(r)}function ca(e,t){const o=de(e);return o===t||!Et(o)||to(o)?!1:zt(o).position==="fixed"||ca(o,t)}function Nc(e,t){const o=t.get(e);if(o)return o;let r=Ao(e,[],!1).filter(n=>Et(n)&&Ke(n)!=="body"),i=null;const s=zt(e).position==="fixed";let a=s?de(e):e;for(;Et(a)&&!to(a);){const n=zt(a),l=br(a);!l&&n.position==="fixed"&&(i=null),(s?!l&&!i:!l&&n.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||Io(a)&&!l&&ca(e,a))?r=r.filter(g=>g!==a):i=n,a=de(a)}return t.set(e,r),r}function Tc(e){let{element:t,boundary:o,rootBoundary:r,strategy:i}=e;const a=[...o==="clippingAncestors"?fr(t)?[]:Nc(t,this._c):[].concat(o),r],n=la(t,a[0],i);let l=n.top,c=n.right,g=n.bottom,m=n.left;for(let w=1;w<a.length;w++){const f=la(t,a[w],i);l=wt(f.top,l),c=le(f.right,c),g=le(f.bottom,g),m=wt(f.left,m)}return{width:c-m,height:g-l,x:m,y:l}}function kc(e){const{width:t,height:o}=ia(e);return{width:t,height:o}}function Dc(e,t,o){const r=oe(t),i=Wt(t),s=o==="fixed",a=ke(e,!0,s,t);let n={scrollLeft:0,scrollTop:0};const l=Qt(0);function c(){l.x=yr(i)}if(r||!r&&!s)if((Ke(t)!=="body"||Io(i))&&(n=vr(t)),r){const f=ke(t,!0,s,t);l.x=f.x+t.clientLeft,l.y=f.y+t.clientTop}else i&&c();s&&!r&&i&&c();const g=i&&!r&&!s?aa(i,n):Qt(0),m=a.left+n.scrollLeft-l.x-g.x,w=a.top+n.scrollTop-l.y-g.y;return{x:m,y:w,width:a.width,height:a.height}}function Si(e){return zt(e).position==="static"}function da(e,t){if(!oe(e)||zt(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return Wt(e)===o&&(o=o.ownerDocument.body),o}function pa(e,t){const o=Mt(e);if(fr(e))return o;if(!oe(e)){let i=de(e);for(;i&&!to(i);){if(Et(i)&&!Si(i))return i;i=de(i)}return o}let r=da(e,t);for(;r&&vc(r)&&Si(r);)r=da(r,t);return r&&to(r)&&Si(r)&&!br(r)?o:r||Mc(e)||o}const Ec=async function(e){const t=this.getOffsetParent||pa,o=this.getDimensions,r=await o(e.floating);return{reference:Dc(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function zc(e){return zt(e).direction==="rtl"}const wr={convertOffsetParentRelativeRectToViewportRelativeRect:Cc,getDocumentElement:Wt,getClippingRect:Tc,getOffsetParent:pa,getElementRects:Ec,getClientRects:Ic,getDimensions:kc,getScale:eo,isElement:Et,isRTL:zc};function ua(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function $c(e,t){let o=null,r;const i=Wt(e);function s(){var n;clearTimeout(r),(n=o)==null||n.disconnect(),o=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:g,top:m,width:w,height:f}=c;if(n||t(),!w||!f)return;const M=ur(m),I=ur(i.clientWidth-(g+w)),j=ur(i.clientHeight-(m+f)),A=ur(g),b={rootMargin:-M+"px "+-I+"px "+-j+"px "+-A+"px",threshold:wt(0,le(1,l))||1};let x=!0;function C(L){const S=L[0].intersectionRatio;if(S!==l){if(!x)return a();S?a(!1,S):r=setTimeout(()=>{a(!1,1e-7)},1e3)}S===1&&!ua(c,e.getBoundingClientRect())&&a(),x=!1}try{o=new IntersectionObserver(C,{...b,root:i.ownerDocument})}catch{o=new IntersectionObserver(C,b)}o.observe(e)}return a(!0),s}function _c(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=ji(e),g=i||s?[...c?Ao(c):[],...t?Ao(t):[]]:[];g.forEach(A=>{i&&A.addEventListener("scroll",o,{passive:!0}),s&&A.addEventListener("resize",o)});const m=c&&n?$c(c,o):null;let w=-1,f=null;a&&(f=new ResizeObserver(A=>{let[v]=A;v&&v.target===c&&f&&t&&(f.unobserve(t),cancelAnimationFrame(w),w=requestAnimationFrame(()=>{var b;(b=f)==null||b.observe(t)})),o()}),c&&!l&&f.observe(c),t&&f.observe(t));let M,I=l?ke(e):null;l&&j();function j(){const A=ke(e);I&&!ua(I,A)&&o(),I=A,M=requestAnimationFrame(j)}return o(),()=>{var A;g.forEach(v=>{i&&v.removeEventListener("scroll",o),s&&v.removeEventListener("resize",o)}),m==null||m(),(A=f)==null||A.disconnect(),f=null,l&&cancelAnimationFrame(M)}}const Oc=mc,Pc=fc,Rc=uc,ha=bc,Uc=pc,Yc=(e,t,o)=>{const r=new Map,i={platform:wr,...o},s={...i.platform,_c:r};return dc(e,t,{...i,platform:s})};function Bc(e){return Hc(e)}function Ni(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Hc(e){for(let t=e;t;t=Ni(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=Ni(e);t;t=Ni(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||br(o)||t.tagName==="BODY"))return t}return null}function Qc(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var W=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),o=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let i=0,s=0,a=0,n=0,l=0,c=0,g=0,m=0;r?t.top<o.top?(i=t.left,s=t.bottom,a=t.right,n=t.bottom,l=o.left,c=o.top,g=o.right,m=o.top):(i=o.left,s=o.bottom,a=o.right,n=o.bottom,l=t.left,c=t.top,g=t.right,m=t.top):t.left<o.left?(i=t.right,s=t.top,a=o.left,n=o.top,l=t.right,c=t.bottom,g=o.left,m=o.bottom):(i=o.right,s=o.top,a=t.left,n=t.top,l=o.right,c=o.bottom,g=t.left,m=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${a}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${l}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${g}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${m}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Qc(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=_c(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Oc({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(ha({apply:({rects:r})=>{const i=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${r.reference.width}px`:"",this.popup.style.height=s?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Rc({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Pc({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(ha({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Uc({element:this.arrowEl,padding:this.arrowPadding}));const o=this.strategy==="absolute"?r=>wr.getOffsetParent(r,Bc):wr.getOffsetParent;Yc(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:xo(Kt({},wr),{getOffsetParent:o})}).then(({x:r,y:i,middlewareData:s,placement:a})=>{const n=this.localize.dir()==="rtl",l={top:"bottom",right:"left",bottom:"top",left:"right"}[a.split("-")[0]];if(this.setAttribute("data-current-placement",a),Object.assign(this.popup.style,{left:`${r}px`,top:`${i}px`}),this.arrow){const c=s.arrow.x,g=s.arrow.y;let m="",w="",f="",M="";if(this.arrowPlacement==="start"){const I=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";m=typeof g=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",w=n?I:"",M=n?"":I}else if(this.arrowPlacement==="end"){const I=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";w=n?"":I,M=n?I:"",f=typeof g=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(M=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":"",m=typeof g=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(M=typeof c=="number"?`${c}px`:"",m=typeof g=="number"?`${g}px`:"");Object.assign(this.arrowEl.style,{top:m,right:w,bottom:f,left:M,[l]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return d`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${rt({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${rt({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?d`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};W.styles=[et,Kl],u([_(".popup")],W.prototype,"popup",2),u([_(".popup__arrow")],W.prototype,"arrowEl",2),u([h()],W.prototype,"anchor",2),u([h({type:Boolean,reflect:!0})],W.prototype,"active",2),u([h({reflect:!0})],W.prototype,"placement",2),u([h({reflect:!0})],W.prototype,"strategy",2),u([h({type:Number})],W.prototype,"distance",2),u([h({type:Number})],W.prototype,"skidding",2),u([h({type:Boolean})],W.prototype,"arrow",2),u([h({attribute:"arrow-placement"})],W.prototype,"arrowPlacement",2),u([h({attribute:"arrow-padding",type:Number})],W.prototype,"arrowPadding",2),u([h({type:Boolean})],W.prototype,"flip",2),u([h({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],W.prototype,"flipFallbackPlacements",2),u([h({attribute:"flip-fallback-strategy"})],W.prototype,"flipFallbackStrategy",2),u([h({type:Object})],W.prototype,"flipBoundary",2),u([h({attribute:"flip-padding",type:Number})],W.prototype,"flipPadding",2),u([h({type:Boolean})],W.prototype,"shift",2),u([h({type:Object})],W.prototype,"shiftBoundary",2),u([h({attribute:"shift-padding",type:Number})],W.prototype,"shiftPadding",2),u([h({attribute:"auto-size"})],W.prototype,"autoSize",2),u([h()],W.prototype,"sync",2),u([h({type:Object})],W.prototype,"autoSizeBoundary",2),u([h({attribute:"auto-size-padding",type:Number})],W.prototype,"autoSizePadding",2),u([h({attribute:"hover-bridge",type:Boolean})],W.prototype,"hoverBridge",2);var ga=new Map,Wc=new WeakMap;function Zc(e){return e??{keyframes:[],options:{duration:0}}}function ma(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function K(e,t){ga.set(e,Zc(t))}function nt(e,t,o){const r=Wc.get(e);if(r!=null&&r[t])return ma(r[t],o.dir);const i=ga.get(t);return i?ma(i,o.dir):{keyframes:[],options:{duration:0}}}function Zt(e,t){return new Promise(o=>{function r(i){i.target===e&&(e.removeEventListener(t,r),o())}e.addEventListener(t,r)})}function gt(e,t,o){return new Promise(r=>{if((o==null?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=e.animate(t,xo(Kt({},o),{duration:Fc()?0:o.duration}));i.addEventListener("cancel",r,{once:!0}),i.addEventListener("finish",r,{once:!0})})}function fa(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function Fc(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function vt(e){return Promise.all(e.getAnimations().map(t=>new Promise(o=>{t.cancel(),requestAnimationFrame(o)})))}function ba(e,t){return e.map(o=>xo(Kt({},o),{height:o.height==="auto"?`${t}px`:o.height}))}var lt=class extends V{constructor(){super(),this.localize=new ht(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=fa(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=fa(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await vt(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:o,options:r}=nt(this,"tooltip.show",{dir:this.localize.dir()});await gt(this.popup.popup,o,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await vt(this.body);const{keyframes:o,options:r}=nt(this,"tooltip.hide",{dir:this.localize.dir()});await gt(this.popup.popup,o,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Zt(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Zt(this,"sl-after-hide")}render(){return d`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${rt({tooltip:!0,"tooltip--open":this.open})}
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
    `}};lt.styles=[et,ql],lt.dependencies={"sl-popup":W},u([_("slot:not([name])")],lt.prototype,"defaultSlot",2),u([_(".tooltip__body")],lt.prototype,"body",2),u([_("sl-popup")],lt.prototype,"popup",2),u([h()],lt.prototype,"content",2),u([h()],lt.prototype,"placement",2),u([h({type:Boolean,reflect:!0})],lt.prototype,"disabled",2),u([h({type:Number})],lt.prototype,"distance",2),u([h({type:Boolean,reflect:!0})],lt.prototype,"open",2),u([h({type:Number})],lt.prototype,"skidding",2),u([h()],lt.prototype,"trigger",2),u([h({type:Boolean})],lt.prototype,"hoist",2),u([G("open",{waitUntilFirstUpdate:!0})],lt.prototype,"handleOpenChange",1),u([G(["content","distance","hoist","placement","skidding"])],lt.prototype,"handleOptionsChange",1),u([G("disabled")],lt.prototype,"handleDisabledChange",1),K("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),K("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),lt.define("sl-tooltip"),ut.define("sl-icon");var Gc=E`
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
`;function Vc(e,t){function o(i){const s=e.getBoundingClientRect(),a=e.ownerDocument.defaultView,n=s.left+a.scrollX,l=s.top+a.scrollY,c=i.pageX-n,g=i.pageY-l;t!=null&&t.onMove&&t.onMove(c,g)}function r(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",r),t!=null&&t.onStop&&t.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",r),(t==null?void 0:t.initialEvent)instanceof PointerEvent&&o(t.initialEvent)}function va(e,t,o){const r=i=>Object.is(i,-0)?0:i;return e<t?r(t):e>o?r(o):r(e)}var ya=()=>null,xt=class extends V{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new ht(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=ya,this.snapThreshold=12}toSnapFunction(e){const t=e.split(" ");return({pos:o,size:r,snapThreshold:i,isRtl:s,vertical:a})=>{let n=o,l=Number.POSITIVE_INFINITY;return t.forEach(c=>{let g;if(c.startsWith("repeat(")){const w=e.substring(7,e.length-1),f=w.endsWith("%"),M=Number.parseFloat(w),I=f?r*(M/100):M;g=Math.round((s&&!a?r-o:o)/I)*I}else c.endsWith("%")?g=r*(Number.parseFloat(c)/100):g=Number.parseFloat(c);s&&!a&&(g=r-g);const m=Math.abs(o-g);m<=i&&m<l&&(n=g,l=m)}),n}}set snap(e){this.snapValue=e??"",e?this.snapFunction=typeof e=="string"?this.toSnapFunction(e):e:this.snapFunction=ya}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),Vc(this,{onMove:(o,r)=>{var i;let s=this.vertical?r:o;this.primary==="end"&&(s=this.size-s),s=(i=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical}))!=null?i:s,this.position=va(this.pixelsToPercentage(s),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){let t=this.position;const o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);if(e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),e.key==="Enter")if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const r=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=r})}this.position=va(t,0,100)}}handleResize(e){const{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",r=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,i="auto";return this.primary==="end"?o&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${i}`:this.style[e]=`${i} var(--divider-width) ${r}`:o&&!this.vertical?this.style[e]=`${i} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${i}`,this.style[t]="",d`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${O(this.disabled?void 0:"0")}
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
    `}};xt.styles=[et,Gc],u([_(".divider")],xt.prototype,"divider",2),u([h({type:Number,reflect:!0})],xt.prototype,"position",2),u([h({attribute:"position-in-pixels",type:Number})],xt.prototype,"positionInPixels",2),u([h({type:Boolean,reflect:!0})],xt.prototype,"vertical",2),u([h({type:Boolean,reflect:!0})],xt.prototype,"disabled",2),u([h()],xt.prototype,"primary",2),u([h({reflect:!0})],xt.prototype,"snap",1),u([h({type:Number,attribute:"snap-threshold"})],xt.prototype,"snapThreshold",2),u([G("position")],xt.prototype,"handlePositionChange",1),u([G("positionInPixels")],xt.prototype,"handlePositionInPixelsChange",1),u([G("vertical")],xt.prototype,"handleVerticalChange",1),xt.define("sl-split-panel");var Jc=E`
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
`;function*Ti(e=document.activeElement){e!=null&&(yield e,"shadowRoot"in e&&e.shadowRoot&&e.shadowRoot.mode!=="closed"&&(yield*Rl(Ti(e.shadowRoot.activeElement))))}function wa(){return[...Ti()].pop()}var Ma=new WeakMap;function xa(e){let t=Ma.get(e);return t||(t=window.getComputedStyle(e,null),Ma.set(e,t)),t}function Xc(e){if(typeof e.checkVisibility=="function")return e.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const t=xa(e);return t.visibility!=="hidden"&&t.display!=="none"}function qc(e){const t=xa(e),{overflowY:o,overflowX:r}=t;return o==="scroll"||r==="scroll"?!0:o!=="auto"||r!=="auto"?!1:e.scrollHeight>e.clientHeight&&o==="auto"||e.scrollWidth>e.clientWidth&&r==="auto"}function Kc(e){const t=e.tagName.toLowerCase(),o=Number(e.getAttribute("tabindex"));if(e.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||e.hasAttribute("disabled")||e.closest("[inert]"))return!1;if(t==="input"&&e.getAttribute("type")==="radio"){const s=e.getRootNode(),a=`input[type='radio'][name="${e.getAttribute("name")}"]`,n=s.querySelector(`${a}:checked`);return n?n===e:s.querySelector(a)===e}return Xc(e)?(t==="audio"||t==="video")&&e.hasAttribute("controls")||e.hasAttribute("tabindex")||e.hasAttribute("contenteditable")&&e.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(t)?!0:qc(e):!1}function td(e){var t,o;const r=ki(e),i=(t=r[0])!=null?t:null,s=(o=r[r.length-1])!=null?o:null;return{start:i,end:s}}function ed(e,t){var o;return((o=e.getRootNode({composed:!0}))==null?void 0:o.host)!==t}function ki(e){const t=new WeakMap,o=[];function r(i){if(i instanceof Element){if(i.hasAttribute("inert")||i.closest("[inert]")||t.has(i))return;t.set(i,!0),!o.includes(i)&&Kc(i)&&o.push(i),i instanceof HTMLSlotElement&&ed(i,e)&&i.assignedElements({flatten:!0}).forEach(s=>{r(s)}),i.shadowRoot!==null&&i.shadowRoot.mode==="open"&&r(i.shadowRoot)}for(const s of i.children)r(s)}return r(e),o.sort((i,s)=>{const a=Number(i.getAttribute("tabindex"))||0;return(Number(s.getAttribute("tabindex"))||0)-a})}var jo=[],La=class{constructor(e){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=t=>{var o;if(t.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const r=wa();if(this.previousFocus=r,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;t.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const i=ki(this.element);let s=i.findIndex(n=>n===r);this.previousFocus=this.currentFocus;const a=this.tabDirection==="forward"?1:-1;for(;;){s+a>=i.length?s=0:s+a<0?s=i.length-1:s+=a,this.previousFocus=this.currentFocus;const n=i[s];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||n&&this.possiblyHasTabbableChildren(n))return;t.preventDefault(),this.currentFocus=n,(o=this.currentFocus)==null||o.focus({preventScroll:!1});const l=[...Ti()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=e,this.elementsWithTabbableControls=["iframe"]}activate(){jo.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){jo=jo.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return jo[jo.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const e=ki(this.element);if(!this.element.matches(":focus-within")){const t=e[0],o=e[e.length-1],r=this.tabDirection==="forward"?t:o;typeof(r==null?void 0:r.focus)=="function"&&(this.currentFocus=r,r.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute("controls")}};function od(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}var Di=new Set;function rd(){const e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function id(){const e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(e)||!e?0:e}function So(e){if(Di.add(e),!document.documentElement.classList.contains("sl-scroll-lock")){const t=rd()+id();let o=getComputedStyle(document.documentElement).scrollbarGutter;(!o||o==="auto")&&(o="stable"),t<2&&(o=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",o),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${t}px`)}}function No(e){Di.delete(e),Di.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}function Ca(e,t,o="vertical",r="smooth"){const i=od(e,t),s=i.top+t.scrollTop,a=i.left+t.scrollLeft,n=t.scrollLeft,l=t.scrollLeft+t.offsetWidth,c=t.scrollTop,g=t.scrollTop+t.offsetHeight;(o==="horizontal"||o==="both")&&(a<n?t.scrollTo({left:a,behavior:r}):a+e.clientWidth>l&&t.scrollTo({left:a-t.offsetWidth+e.clientWidth,behavior:r})),(o==="vertical"||o==="both")&&(s<c?t.scrollTo({top:s,behavior:r}):s+e.clientHeight>g&&t.scrollTo({top:s-t.offsetHeight+e.clientHeight,behavior:r}))}var Ia=e=>{var t;const{activeElement:o}=document;o&&e.contains(o)&&((t=document.activeElement)==null||t.blur())},oo=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=o=>{const r=o.target;(this.slotNames.includes("[default]")&&!r.name||r.name&&this.slotNames.includes(r.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!=="")return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if(t.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!t.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function sd(e){if(!e)return"";const t=e.assignedNodes({flatten:!0});let o="";return[...t].forEach(r=>{r.nodeType===Node.TEXT_NODE&&(o+=r.textContent)}),o}function Aa(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Lt=class extends V{constructor(){super(...arguments),this.hasSlotController=new oo(this,"footer"),this.localize=new ht(this),this.modal=new La(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=e=>{this.contained||e.key==="Escape"&&this.modal.isActive()&&this.open&&(e.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),So(this)))}disconnectedCallback(){super.disconnectedCallback(),No(this),this.removeOpenListeners()}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const o=nt(this,"drawer.denyClose",{dir:this.localize.dir()});gt(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){var e;"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var e;document.removeEventListener("keydown",this.handleDocumentKeyDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),So(this));const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([vt(this.drawer),vt(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});const t=nt(this,`drawer.show${Aa(this.placement)}`,{dir:this.localize.dir()}),o=nt(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([gt(this.panel,t.keyframes,t.options),gt(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{Ia(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),No(this)),await Promise.all([vt(this.drawer),vt(this.overlay)]);const e=nt(this,`drawer.hide${Aa(this.placement)}`,{dir:this.localize.dir()}),t=nt(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([gt(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),gt(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),So(this)),this.open&&this.contained&&(this.modal.deactivate(),No(this))}async show(){if(!this.open)return this.open=!0,Zt(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Zt(this,"sl-after-hide")}render(){return d`
      <div
        part="base"
        class=${rt({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${O(this.noHeader?this.label:void 0)}
          aria-labelledby=${O(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":d`
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
    `}};Lt.styles=[et,Jc],Lt.dependencies={"sl-icon-button":at},u([_(".drawer")],Lt.prototype,"drawer",2),u([_(".drawer__panel")],Lt.prototype,"panel",2),u([_(".drawer__overlay")],Lt.prototype,"overlay",2),u([h({type:Boolean,reflect:!0})],Lt.prototype,"open",2),u([h({reflect:!0})],Lt.prototype,"label",2),u([h({reflect:!0})],Lt.prototype,"placement",2),u([h({type:Boolean,reflect:!0})],Lt.prototype,"contained",2),u([h({attribute:"no-header",type:Boolean,reflect:!0})],Lt.prototype,"noHeader",2),u([G("open",{waitUntilFirstUpdate:!0})],Lt.prototype,"handleOpenChange",1),u([G("contained",{waitUntilFirstUpdate:!0})],Lt.prototype,"handleNoModalChange",1),K("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),K("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),K("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),K("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),K("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),K("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),K("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),K("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),K("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),K("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),K("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),Lt.define("sl-drawer");var ad=E`
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
`,$t=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.style.height=this.open?"auto":"0",this.open&&(this.details.open=!0),this.detailsObserver=new MutationObserver(e=>{for(const t of e)t.type==="attributes"&&t.attributeName==="open"&&(this.details.open?this.show():this.hide())}),this.detailsObserver.observe(this.details,{attributes:!0})}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.detailsObserver)==null||e.disconnect()}handleSummaryClick(e){e.preventDefault(),this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key==="ArrowUp"||e.key==="ArrowLeft")&&(e.preventDefault(),this.hide()),(e.key==="ArrowDown"||e.key==="ArrowRight")&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.details.open=!0,this.emit("sl-show",{cancelable:!0}).defaultPrevented){this.open=!1,this.details.open=!1;return}await vt(this.body);const{keyframes:t,options:o}=nt(this,"details.show",{dir:this.localize.dir()});await gt(this.body,ba(t,this.body.scrollHeight),o),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented){this.details.open=!0,this.open=!0;return}await vt(this.body);const{keyframes:t,options:o}=nt(this,"details.hide",{dir:this.localize.dir()});await gt(this.body,ba(t,this.body.scrollHeight),o),this.body.style.height="auto",this.details.open=!1,this.emit("sl-after-hide")}}async show(){if(!(this.open||this.disabled))return this.open=!0,Zt(this,"sl-after-show")}async hide(){if(!(!this.open||this.disabled))return this.open=!1,Zt(this,"sl-after-hide")}render(){const e=this.localize.dir()==="rtl";return d`
      <details
        part="base"
        class=${rt({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
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
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </details>
    `}};$t.styles=[et,ad],$t.dependencies={"sl-icon":ut},u([_(".details")],$t.prototype,"details",2),u([_(".details__header")],$t.prototype,"header",2),u([_(".details__body")],$t.prototype,"body",2),u([_(".details__expand-icon-slot")],$t.prototype,"expandIconSlot",2),u([h({type:Boolean,reflect:!0})],$t.prototype,"open",2),u([h()],$t.prototype,"summary",2),u([h({type:Boolean,reflect:!0})],$t.prototype,"disabled",2),u([G("open",{waitUntilFirstUpdate:!0})],$t.prototype,"handleOpenChange",1),K("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}}),K("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}}),$t.define("sl-details"),W.define("sl-popup");var nd=E`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`,ro=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.separatorDir=this.localize.dir(),this.label=""}getSeparator(){const t=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[t,...t.querySelectorAll("[id]")].forEach(o=>o.removeAttribute("id")),t.setAttribute("data-default",""),t.slot="separator",t}handleSlotChange(){const e=[...this.defaultSlot.assignedElements({flatten:!0})].filter(t=>t.tagName.toLowerCase()==="sl-breadcrumb-item");e.forEach((t,o)=>{const r=t.querySelector('[slot="separator"]');r===null?t.append(this.getSeparator()):r.hasAttribute("data-default")&&r.replaceWith(this.getSeparator()),o===e.length-1?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),d`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true">
        <slot name="separator">
          <sl-icon name=${this.localize.dir()==="rtl"?"chevron-left":"chevron-right"} library="system"></sl-icon>
        </slot>
      </span>
    `}};ro.styles=[et,nd],ro.dependencies={"sl-icon":ut},u([_("slot")],ro.prototype,"defaultSlot",2),u([_('slot[name="separator"]')],ro.prototype,"separatorSlot",2),u([h()],ro.prototype,"label",2),ro.define("sl-breadcrumb");var ld=E`
  :host {
    display: inline-flex;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-600);
    line-height: var(--sl-line-height-normal);
    white-space: nowrap;
  }

  .breadcrumb-item__label {
    display: inline-block;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    text-decoration: none;
    color: inherit;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: var(--sl-transition-fast) --color;
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label {
    color: var(--sl-color-primary-600);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:hover {
    color: var(--sl-color-primary-500);
  }

  :host(:not(:last-of-type)) .breadcrumb-item__label:active {
    color: var(--sl-color-primary-600);
  }

  .breadcrumb-item__label:focus {
    outline: none;
  }

  .breadcrumb-item__label:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .breadcrumb-item__prefix,
  .breadcrumb-item__suffix {
    display: none;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .breadcrumb-item--has-prefix .breadcrumb-item__prefix {
    display: inline-flex;
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .breadcrumb-item--has-suffix .breadcrumb-item__suffix {
    display: inline-flex;
    margin-inline-start: var(--sl-spacing-x-small);
  }

  :host(:last-of-type) .breadcrumb-item__separator {
    display: none;
  }

  .breadcrumb-item__separator {
    display: inline-flex;
    align-items: center;
    margin: 0 var(--sl-spacing-x-small);
    user-select: none;
    -webkit-user-select: none;
  }
`,pe=class extends V{constructor(){super(...arguments),this.hasSlotController=new oo(this,"prefix","suffix"),this.renderType="button",this.rel="noreferrer noopener"}setRenderType(){const e=this.defaultSlot.assignedElements({flatten:!0}).filter(t=>t.tagName.toLowerCase()==="sl-dropdown").length>0;if(this.href){this.renderType="link";return}if(e){this.renderType="dropdown";return}this.renderType="button"}hrefChanged(){this.setRenderType()}handleSlotChange(){this.setRenderType()}render(){return d`
      <div
        part="base"
        class=${rt({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test("prefix"),"breadcrumb-item--has-suffix":this.hasSlotController.test("suffix")})}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${this.renderType==="link"?d`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${O(this.target?this.target:void 0)}"
                rel=${O(this.target?this.rel:void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            `:""}
        ${this.renderType==="button"?d`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            `:""}
        ${this.renderType==="dropdown"?d`
              <div part="label" class="breadcrumb-item__label breadcrumb-item__label--drop-down">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            `:""}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `}};pe.styles=[et,ld],u([_("slot:not([name])")],pe.prototype,"defaultSlot",2),u([k()],pe.prototype,"renderType",2),u([h()],pe.prototype,"href",2),u([h()],pe.prototype,"target",2),u([h()],pe.prototype,"rel",2),u([G("href",{waitUntilFirstUpdate:!0})],pe.prototype,"hrefChanged",1),pe.define("sl-breadcrumb-item");var cd=E`
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
`,Mr=class extends V{constructor(){super(...arguments),this.localize=new ht(this)}render(){return d`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};Mr.styles=[et,cd],Mr.define("sl-spinner");var To=new WeakMap,ko=new WeakMap,Do=new WeakMap,Ei=new WeakSet,xr=new WeakMap,ja=class{constructor(e,t){this.handleFormData=o=>{const r=this.options.disabled(this.host),i=this.options.name(this.host),s=this.options.value(this.host),a=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!r&&!a&&typeof i=="string"&&i.length>0&&typeof s<"u"&&(Array.isArray(s)?s.forEach(n=>{o.formData.append(i,n.toString())}):o.formData.append(i,s.toString()))},this.handleFormSubmit=o=>{var r;const i=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&((r=To.get(this.form))==null||r.forEach(a=>{this.setUserInteracted(a,!0)})),this.form&&!this.form.noValidate&&!i&&!s(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),xr.set(this.host,[])},this.handleInteraction=o=>{const r=xr.get(this.host);r.includes(o.type)||r.push(o.type),r.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const o=this.form.querySelectorAll("*");for(const r of o)if(typeof r.checkValidity=="function"&&!r.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const o=this.form.querySelectorAll("*");for(const r of o)if(typeof r.reportValidity=="function"&&!r.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=Kt({form:o=>{const r=o.form;if(r){const s=o.getRootNode().querySelector(`#${r}`);if(s)return s}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var r;return(r=o.disabled)!=null?r:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,r)=>o.value=r,assumeInteractionOn:["sl-input"]},t)}hostConnected(){const e=this.options.form(this.host);e&&this.attachForm(e),xr.set(this.host,[]),this.options.assumeInteractionOn.forEach(t=>{this.host.addEventListener(t,this.handleInteraction)})}hostDisconnected(){this.detachForm(),xr.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){const e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,To.has(this.form)?To.get(this.form).add(this.host):To.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),ko.has(this.form)||(ko.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Do.has(this.form)||(Do.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const e=To.get(this.form);e&&(e.delete(this.host),e.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),ko.has(this.form)&&(this.form.reportValidity=ko.get(this.form),ko.delete(this.form)),Do.has(this.form)&&(this.form.checkValidity=Do.get(this.form),Do.delete(this.form)),this.form=void 0))}setUserInteracted(e,t){t?Ei.add(e):Ei.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){const o=document.createElement("button");o.type=e,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",t&&(o.name=t.name,o.value=t.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(r=>{t.hasAttribute(r)&&o.setAttribute(r,t.getAttribute(r))})),this.form.append(o),o.click(),o.remove()}}getForm(){var e;return(e=this.form)!=null?e:null}reset(e){this.doAction("reset",e)}submit(e){this.doAction("submit",e)}setValidity(e){const t=this.host,o=!!Ei.has(t),r=!!t.required;t.toggleAttribute("data-required",r),t.toggleAttribute("data-optional",!r),t.toggleAttribute("data-invalid",!e),t.toggleAttribute("data-valid",e),t.toggleAttribute("data-user-invalid",!e&&o),t.toggleAttribute("data-user-valid",e&&o)}updateValidity(){const e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){const t=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||e==null||e.preventDefault()}},zi=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(xo(Kt({},zi),{valid:!1,valueMissing:!0})),Object.freeze(xo(Kt({},zi),{valid:!1,customError:!0}));var dd=E`
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
`,Z=class extends V{constructor(){super(...arguments),this.formControlController=new ja(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new oo(this,"[default]","prefix","suffix"),this.localize=new ht(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:zi}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){const e=this.isLink(),t=e?dr`a`:dr`button`;return Co`
      <${t}
        part="base"
        class=${rt({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${O(e?void 0:this.disabled)}
        type=${O(e?void 0:this.type)}
        title=${this.title}
        name=${O(e?void 0:this.name)}
        value=${O(e?void 0:this.value)}
        href=${O(e&&!this.disabled?this.href:void 0)}
        target=${O(e?this.target:void 0)}
        download=${O(e?this.download:void 0)}
        rel=${O(e?this.rel:void 0)}
        role=${O(e?void 0:"button")}
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
        ${this.caret?Co` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Co`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${t}>
    `}};Z.styles=[et,dd],Z.dependencies={"sl-icon":ut,"sl-spinner":Mr},u([_(".button")],Z.prototype,"button",2),u([k()],Z.prototype,"hasFocus",2),u([k()],Z.prototype,"invalid",2),u([h()],Z.prototype,"title",2),u([h({reflect:!0})],Z.prototype,"variant",2),u([h({reflect:!0})],Z.prototype,"size",2),u([h({type:Boolean,reflect:!0})],Z.prototype,"caret",2),u([h({type:Boolean,reflect:!0})],Z.prototype,"disabled",2),u([h({type:Boolean,reflect:!0})],Z.prototype,"loading",2),u([h({type:Boolean,reflect:!0})],Z.prototype,"outline",2),u([h({type:Boolean,reflect:!0})],Z.prototype,"pill",2),u([h({type:Boolean,reflect:!0})],Z.prototype,"circle",2),u([h()],Z.prototype,"type",2),u([h()],Z.prototype,"name",2),u([h()],Z.prototype,"value",2),u([h()],Z.prototype,"href",2),u([h()],Z.prototype,"target",2),u([h()],Z.prototype,"rel",2),u([h()],Z.prototype,"download",2),u([h()],Z.prototype,"form",2),u([h({attribute:"formaction"})],Z.prototype,"formAction",2),u([h({attribute:"formenctype"})],Z.prototype,"formEnctype",2),u([h({attribute:"formmethod"})],Z.prototype,"formMethod",2),u([h({attribute:"formnovalidate",type:Boolean})],Z.prototype,"formNoValidate",2),u([h({attribute:"formtarget"})],Z.prototype,"formTarget",2),u([G("disabled",{waitUntilFirstUpdate:!0})],Z.prototype,"handleDisabledChange",1),Z.define("sl-button");var pd=E`
  :host {
    --width: 31rem;
    --header-spacing: var(--sl-spacing-large);
    --body-spacing: var(--sl-spacing-large);
    --footer-spacing: var(--sl-spacing-large);

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--sl-z-index-dialog);
  }

  .dialog__panel {
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--sl-spacing-2x-large));
    max-height: calc(100% - var(--sl-spacing-2x-large));
    background-color: var(--sl-panel-background-color);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--sl-shadow-x-large);
  }

  .dialog__panel:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog__panel {
      max-height: 80vh;
    }
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    display: flex;
  }

  .dialog__title {
    flex: 1 1 auto;
    font: inherit;
    font-size: var(--sl-font-size-large);
    line-height: var(--sl-line-height-dense);
    padding: var(--header-spacing);
    margin: 0;
  }

  .dialog__header-actions {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--sl-spacing-2x-small);
    padding: 0 var(--header-spacing);
  }

  .dialog__header-actions sl-icon-button,
  .dialog__header-actions ::slotted(sl-icon-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer ::slotted(sl-button:not(:first-of-type)) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--sl-overlay-background-color);
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--sl-color-neutral-0);
    }
  }
`,Ft=class extends V{constructor(){super(...arguments),this.hasSlotController=new oo(this,"footer"),this.localize=new ht(this),this.modal=new La(this),this.open=!1,this.label="",this.noHeader=!1,this.handleDocumentKeyDown=e=>{e.key==="Escape"&&this.modal.isActive()&&this.open&&(e.stopPropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),So(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),No(this),this.removeOpenListeners()}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const o=nt(this,"dialog.denyClose",{dir:this.localize.dir()});gt(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){var e;"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard")):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var e;(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),So(this);const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([vt(this.dialog),vt(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});const t=nt(this,"dialog.show",{dir:this.localize.dir()}),o=nt(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([gt(this.panel,t.keyframes,t.options),gt(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{Ia(this),this.emit("sl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([vt(this.dialog),vt(this.overlay)]);const e=nt(this,"dialog.hide",{dir:this.localize.dir()}),t=nt(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([gt(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),gt(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,No(this);const o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}async show(){if(!this.open)return this.open=!0,Zt(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Zt(this,"sl-after-hide")}render(){return d`
      <div
        part="base"
        class=${rt({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${O(this.noHeader?this.label:void 0)}
          aria-labelledby=${O(this.noHeader?void 0:"title")}
          tabindex="-1"
        >
          ${this.noHeader?"":d`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:"\uFEFF"} </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click="${()=>this.requestClose("close-button")}"
                    ></sl-icon-button>
                  </div>
                </header>
              `}
          ${""}
          <div part="body" class="dialog__body" tabindex="-1"><slot></slot></div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};Ft.styles=[et,pd],Ft.dependencies={"sl-icon-button":at},u([_(".dialog")],Ft.prototype,"dialog",2),u([_(".dialog__panel")],Ft.prototype,"panel",2),u([_(".dialog__overlay")],Ft.prototype,"overlay",2),u([h({type:Boolean,reflect:!0})],Ft.prototype,"open",2),u([h({reflect:!0})],Ft.prototype,"label",2),u([h({attribute:"no-header",type:Boolean,reflect:!0})],Ft.prototype,"noHeader",2),u([G("open",{waitUntilFirstUpdate:!0})],Ft.prototype,"handleOpenChange",1),K("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}}),K("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}}),K("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}}),K("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),K("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),Ft.define("sl-dialog");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=e=>(t,o)=>{o!==void 0?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lr=globalThis,$i=Lr.ShadowRoot&&(Lr.ShadyCSS===void 0||Lr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_i=Symbol(),Sa=new WeakMap;let Na=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==_i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if($i&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=Sa.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Sa.set(o,t))}return t}toString(){return this.cssText}};const ud=e=>new Na(typeof e=="string"?e:e+"",void 0,_i),yt=(e,...t)=>{const o=e.length===1?e[0]:t.reduce(((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new Na(o,e,_i)},hd=(e,t)=>{if($i)e.adoptedStyleSheets=t.map((o=>o instanceof CSSStyleSheet?o:o.styleSheet));else for(const o of t){const r=document.createElement("style"),i=Lr.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},Ta=$i?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return ud(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gd,defineProperty:md,getOwnPropertyDescriptor:fd,getOwnPropertyNames:bd,getOwnPropertySymbols:vd,getPrototypeOf:yd}=Object,he=globalThis,ka=he.trustedTypes,wd=ka?ka.emptyScript:"",Oi=he.reactiveElementPolyfillSupport,Eo=(e,t)=>e,Cr={toAttribute(e,t){switch(t){case Boolean:e=e?wd:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},Pi=(e,t)=>!gd(e,t),Da={attribute:!0,type:String,converter:Cr,reflect:!1,useDefault:!1,hasChanged:Pi};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),he.litPropertyMetadata??(he.litPropertyMetadata=new WeakMap);let io=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Da){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&md(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){const{get:i,set:s}=fd(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:i,set(a){const n=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Da}static _$Ei(){if(this.hasOwnProperty(Eo("elementProperties")))return;const t=yd(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Eo("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Eo("properties"))){const o=this.properties,r=[...bd(o),...vd(o)];for(const i of r)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)o.unshift(Ta(i))}else t!==void 0&&o.push(Ta(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((o=>this.enableUpdating=o)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((o=>o(this)))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return hd(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)}))}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const a=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Cr).toAttribute(o,r.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,o){var s,a;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Cr;this._$Em=i;const c=l.fromAttribute(o,n.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(t,o,r){var i;if(t!==void 0){const s=this.constructor,a=this[t];if(r??(r=s.getPropertyOptions(t)),!((r.hasChanged??Pi)(a,o)||r.useDefault&&r.reflect&&a===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),s!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:n}=a,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach((i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)})),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach((r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((o=>this._$ET(o,this[o])))),this._$EM()}updated(t){}firstUpdated(t){}};io.elementStyles=[],io.shadowRootOptions={mode:"open"},io[Eo("elementProperties")]=new Map,io[Eo("finalized")]=new Map,Oi==null||Oi({ReactiveElement:io}),(he.reactiveElementVersions??(he.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Md={attribute:!0,type:String,converter:Cr,reflect:!1,hasChanged:Pi},xd=(e=Md,t,o)=>{const{kind:r,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),r==="accessor"){const{name:a}=o;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,e)},init(n){return n!==void 0&&this.C(a,void 0,e,n),n}}}if(r==="setter"){const{name:a}=o;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,e)}}throw Error("Unsupported decorator location: "+r)};function D(e){return(t,o)=>typeof o=="object"?xd(e,t,o):((r,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function De(e){return D({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ld=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function so(e,t){return(o,r,i)=>{const s=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(e))??null};return Ld(o,r,{get(){return s(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zo=globalThis,Ir=zo.trustedTypes,Ea=Ir?Ir.createPolicy("lit-html",{createHTML:e=>e}):void 0,za="$lit$",ge=`lit$${Math.random().toFixed(9).slice(2)}$`,$a="?"+ge,Cd=`<${$a}>`,Ee=document,$o=()=>Ee.createComment(""),_o=e=>e===null||typeof e!="object"&&typeof e!="function",Ri=Array.isArray,Id=e=>Ri(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ui=`[ 	
\f\r]`,Oo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_a=/-->/g,Oa=/>/g,ze=RegExp(`>|${Ui}(?:([^\\s"'>=/]+)(${Ui}*=${Ui}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pa=/'/g,Ra=/"/g,Ua=/^(?:script|style|textarea|title)$/i,Ad=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),tt=Ad(1),me=Symbol.for("lit-noChange"),it=Symbol.for("lit-nothing"),Ya=new WeakMap,$e=Ee.createTreeWalker(Ee,129);function Ba(e,t){if(!Ri(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ea!==void 0?Ea.createHTML(t):t}const jd=(e,t)=>{const o=e.length-1,r=[];let i,s=t===2?"<svg>":t===3?"<math>":"",a=Oo;for(let n=0;n<o;n++){const l=e[n];let c,g,m=-1,w=0;for(;w<l.length&&(a.lastIndex=w,g=a.exec(l),g!==null);)w=a.lastIndex,a===Oo?g[1]==="!--"?a=_a:g[1]!==void 0?a=Oa:g[2]!==void 0?(Ua.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=ze):g[3]!==void 0&&(a=ze):a===ze?g[0]===">"?(a=i??Oo,m=-1):g[1]===void 0?m=-2:(m=a.lastIndex-g[2].length,c=g[1],a=g[3]===void 0?ze:g[3]==='"'?Ra:Pa):a===Ra||a===Pa?a=ze:a===_a||a===Oa?a=Oo:(a=ze,i=void 0);const f=a===ze&&e[n+1].startsWith("/>")?" ":"";s+=a===Oo?l+Cd:m>=0?(r.push(c),l.slice(0,m)+za+l.slice(m)+ge+f):l+ge+(m===-2?n:f)}return[Ba(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class Po{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,a=0;const n=t.length-1,l=this.parts,[c,g]=jd(t,o);if(this.el=Po.createElement(c,r),$e.currentNode=this.el.content,o===2||o===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=$e.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const m of i.getAttributeNames())if(m.endsWith(za)){const w=g[a++],f=i.getAttribute(m).split(ge),M=/([.?@])?(.*)/.exec(w);l.push({type:1,index:s,name:M[2],strings:f,ctor:M[1]==="."?Nd:M[1]==="?"?Td:M[1]==="@"?kd:Ar}),i.removeAttribute(m)}else m.startsWith(ge)&&(l.push({type:6,index:s}),i.removeAttribute(m));if(Ua.test(i.tagName)){const m=i.textContent.split(ge),w=m.length-1;if(w>0){i.textContent=Ir?Ir.emptyScript:"";for(let f=0;f<w;f++)i.append(m[f],$o()),$e.nextNode(),l.push({type:2,index:++s});i.append(m[w],$o())}}}else if(i.nodeType===8)if(i.data===$a)l.push({type:2,index:s});else{let m=-1;for(;(m=i.data.indexOf(ge,m+1))!==-1;)l.push({type:7,index:s}),m+=ge.length-1}s++}}static createElement(t,o){const r=Ee.createElement("template");return r.innerHTML=t,r}}function ao(e,t,o=e,r){var a,n;if(t===me)return t;let i=r!==void 0?(a=o._$Co)==null?void 0:a[r]:o._$Cl;const s=_o(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=ao(e,i._$AS(e,t.values),i,r)),t}class Sd{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??Ee).importNode(o,!0);$e.currentNode=i;let s=$e.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new Ro(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Dd(s,this,t)),this._$AV.push(c),l=r[++n]}a!==(l==null?void 0:l.index)&&(s=$e.nextNode(),a++)}return $e.currentNode=Ee,i}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}}class Ro{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=it,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=ao(this,t,o),_o(t)?t===it||t==null||t===""?(this._$AH!==it&&this._$AR(),this._$AH=it):t!==this._$AH&&t!==me&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Id(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==it&&_o(this._$AH)?this._$AA.nextSibling.data=t:this.T(Ee.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Po.createElement(Ba(r.h,r.h[0]),this.options)),r);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(o);else{const a=new Sd(i,this),n=a.u(this.options);a.p(o),this.T(n),this._$AH=a}}_$AC(t){let o=Ya.get(t.strings);return o===void 0&&Ya.set(t.strings,o=new Po(t)),o}k(t){Ri(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,i=0;for(const s of t)i===o.length?o.push(r=new Ro(this.O($o()),this.O($o()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}}class Ar{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=it,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=it}_$AI(t,o=this,r,i){const s=this.strings;let a=!1;if(s===void 0)t=ao(this,t,o,0),a=!_o(t)||t!==this._$AH&&t!==me,a&&(this._$AH=t);else{const n=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=ao(this,n[r+l],o,l),c===me&&(c=this._$AH[l]),a||(a=!_o(c)||c!==this._$AH[l]),c===it?t=it:t!==it&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===it?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Nd extends Ar{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===it?void 0:t}}class Td extends Ar{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==it)}}class kd extends Ar{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=ao(this,t,o,0)??it)===me)return;const r=this._$AH,i=t===it&&r!==it||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==it&&(r===it||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}}class Dd{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ao(this,t)}}const Yi=zo.litHtmlPolyfillSupport;Yi==null||Yi(Po,Ro),(zo.litHtmlVersions??(zo.litHtmlVersions=[])).push("3.3.1");const Ed=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const s=(o==null?void 0:o.renderBefore)??null;r._$litPart$=i=new Ro(t.insertBefore($o(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _e=globalThis;let ft=class extends io{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ed(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return me}};ft._$litElement$=!0,ft.finalized=!0,(Vn=_e.litElementHydrateSupport)==null||Vn.call(_e,{LitElement:ft});const Bi=_e.litElementPolyfillSupport;Bi==null||Bi({LitElement:ft}),(_e.litElementVersions??(_e.litElementVersions=[])).push("4.2.1");function zd(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";case"query":return"primary";default:return"neutral"}}const $d=yt`
    :host {
        --http-get-color: var(--terminal-text);
        --http-get-border-color: var(--ok-color-lowalpha);
        --http-post-color: var(--primary-color);
        --http-post-border-color: var(--primary-color-lowalpha);
        --http-put-color: var(--primary-color);
        --http-put-border-color: var(--primary-color-lowalpha);
        --http-delete-color: var(--error-color);
        --http-delete-border-color: var(--error-color-lowalpha);
        --http-patch-color: var(--warn-color);
        --http-patch-border-color: var(--warn-color-lowalpha);
        --http-options-color: var(--tertiary-color);
        --http-head-color: var(--tertiary-color);
        --http-trace-color: var(--tertiary-color);
        --http-query-color: var(--primary-color);
        --http-query-border-color: var(--primary-color-lowalpha);
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
        border-color: var(--http-get-border-color, var(--http-get-color));
    }

    sl-tag[variant="primary"].method.post::part(base) {
        color: var(--http-post-color);
        border-color: var(--http-post-border-color, var(--http-post-color));
    }

    sl-tag[variant="primary"].method.put::part(base) {
        color: var(--http-put-color);
        border-color: var(--http-put-border-color, var(--http-put-color));
    }

    sl-tag[variant="primary"].method.query::part(base) {
        color: var(--http-query-color);
        border-color: var(--http-query-border-color, var(--http-query-color));
    }

    sl-tag[variant="warning"].method::part(base) {
        color: var(--http-patch-color);
        border-color: var(--http-patch-border-color, var(--http-patch-color));
    }

    sl-tag[variant="danger"].method::part(base) {
        color: var(--http-delete-color);
        border-color: var(--http-delete-border-color, var(--http-delete-color));
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
    .method-naked.query { color: var(--http-query-color); }

    :host-context(html[theme="light"]) {
        --http-get-color: #15803d;
        --http-post-color: #2563eb;
        --http-put-color: #2563eb;
        --http-delete-color: #dc2626;
        --http-patch-color: #2563eb;
        --http-options-color: #6b7280;
        --http-head-color: #6b7280;
        --http-trace-color: #6b7280;
        --http-query-color: #2563eb;
    }
`;var _d=Object.defineProperty,Od=Object.getOwnPropertyDescriptor,Oe=(e,t,o,r)=>{for(var i=r>1?void 0:r?Od(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&_d(t,o,i),i};const Pd={GET:"GET",POST:"POST",PUT:"PUT",DELETE:"DEL",PATCH:"PAT",OPTIONS:"OPT",HEAD:"HEAD",TRACE:"TRC",QUERY:"QRY"};let re=class extends ft{constructor(){super(),this.mode="",this.lower=!1,this.method="GET"}render(){if(this.mode==="nav-naked"){const r=this.method.toUpperCase(),i=Pd[r]??r,s=this.method.toLowerCase();return tt`<span class="method-naked ${s}">${i}</span>`}let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.method.toLowerCase(),o=this.micro?`method ${e} micro ${t}`:`method ${e} ${t}`;return tt`
            <sl-tag variant="${zd(this.method)}" class="${o}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};re.styles=$d,Oe([D()],re.prototype,"method",2),Oe([D({type:Boolean})],re.prototype,"lower",2),Oe([D({type:Boolean})],re.prototype,"large",2),Oe([D({type:Boolean})],re.prototype,"tiny",2),Oe([D({type:Boolean})],re.prototype,"micro",2),Oe([D({reflect:!0})],re.prototype,"mode",2),re=Oe([ue("pb33f-http-method")],re);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ha={ATTRIBUTE:1,CHILD:2},Qa=e=>(...t)=>({_$litDirective$:e,values:t});let Wa=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Hi=class extends Wa{constructor(t){if(super(t),this.it=it,t.type!==Ha.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===it||t==null)return this._t=void 0,this.it=t;if(t===me)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}};Hi.directiveName="unsafeHTML",Hi.resultType=1;const Za=Qa(Hi),Rd=yt`
    :host {
        color: var(--font-color);
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        word-break: break-all;
        text-decoration: var(--op-path-text-decoration);
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
        /* text-decoration: underline; */
        /* cursor: pointer; */
    }
    
    .nowrap {
        display: inline-block;
    }
`;var Ud=Object.defineProperty,Yd=Object.getOwnPropertyDescriptor,Qi=(e,t,o,r)=>{for(var i=r>1?void 0:r?Yd(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Ud(t,o,i),i};let Uo=class extends ft{constructor(){super(),this.path="/",this.nowrap=!1}replaceBrackets(){const e=/\{([\w$.#/]+)\}/g,t=this.nowrap?" nowrap":"",o=this.formatSlashes(this.path).replace(e,(r,i)=>`<span class="bracket${t}">{</span><span class="param${t}">${i}</span><span class="bracket${t}">}</span>`);return this.nowrap?tt`<div style="white-space: nowrap;">${Za(o)}</div>`:tt`${Za(o)}`}formatSlashes(e){return e.replaceAll("/",'<span class="slash">/</span>')}render(){return tt`${this.replaceBrackets()}`}};Uo.styles=Rd,Qi([D()],Uo.prototype,"path",2),Qi([D({type:Boolean})],Uo.prototype,"nowrap",2),Uo=Qi([ue("pb33f-render-operation-path")],Uo);const Bd=yt`
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
    }`;var Hd=Object.defineProperty,Qd=Object.getOwnPropertyDescriptor,Yo=(e,t,o,r)=>{for(var i=r>1?void 0:r?Qd(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Hd(t,o,i),i};let Pe=class extends ft{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1,this.fluid=!1}render(){const e=this.fluid?"fluid":this.wide?"wide":"";return tt`
            <header class="pb33f-header">
                <div class="logo ${e}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};Pe.styles=Bd,Yo([D()],Pe.prototype,"name",2),Yo([D()],Pe.prototype,"url",2),Yo([D({type:Boolean})],Pe.prototype,"wide",2),Yo([D({type:Boolean})],Pe.prototype,"fluid",2),Pe=Yo([ue("pb33f-header")],Pe);const Wd=yt`

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

`,Fa=yt`
    
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
 `,Re="pb33f-theme-change";var Zd=Object.defineProperty,Fd=Object.getOwnPropertyDescriptor,Wi=(e,t,o,r)=>{for(var i=r>1?void 0:r?Fd(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Zd(t,o,i),i};const Zi="dark",Gd="light",Vd="tektronix",Ga="pb33f-theme",Va="pb33f-base-theme";let Bo=class extends ft{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Vd:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(Ga);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(Va);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(Ga,e),localStorage.setItem(Va,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===Gd?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Re,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Zi?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===Zi?"sun":"moon",t=this.baseTheme===Zi?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",o=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return tt`
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
        `}};Bo.styles=[Wd,Fa],Wi([De()],Bo.prototype,"baseTheme",2),Wi([De()],Bo.prototype,"tektronixActive",2),Bo=Wi([ue("pb33f-theme-switcher")],Bo);var Jd=yt`
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
`;const Fi=new Set,no=new Map;let Ue,Gi="ltr",Vi="en";const Ja=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Ja){const e=new MutationObserver(qa);Gi=document.documentElement.dir||"ltr",Vi=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Xa(...e){e.map(t=>{const o=t.$code.toLowerCase();no.has(o)?no.set(o,Object.assign(Object.assign({},no.get(o)),t)):no.set(o,t),Ue||(Ue=t)}),qa()}function qa(){Ja&&(Gi=document.documentElement.dir||"ltr",Vi=document.documentElement.lang||navigator.language),[...Fi.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Xd=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Fi.add(this.host)}hostDisconnected(){Fi.delete(this.host)}dir(){return`${this.host.dir||Gi}`.toLowerCase()}lang(){return`${this.host.lang||Vi}`.toLowerCase()}getTranslationData(t){var o,r;const i=new Intl.Locale(t.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),a=(r=(o=i==null?void 0:i.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",n=no.get(`${s}-${a}`),l=no.get(s);return{locale:i,language:s,region:a,primary:n,secondary:l}}exists(t,o){var r;const{primary:i,secondary:s}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[t]||s&&s[t]||o.includeFallback&&Ue&&Ue[t])}term(t,...o){const{primary:r,secondary:i}=this.getTranslationData(this.lang());let s;if(r&&r[t])s=r[t];else if(i&&i[t])s=i[t];else if(Ue&&Ue[t])s=Ue[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...o):s}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var Ka={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};Xa(Ka);var qd=Ka,tn=class extends Xd{};Xa(qd);var Kd=yt`
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
`,en=Object.defineProperty,tp=Object.defineProperties,ep=Object.getOwnPropertyDescriptors,on=Object.getOwnPropertySymbols,op=Object.prototype.hasOwnProperty,rp=Object.prototype.propertyIsEnumerable,rn=e=>{throw TypeError(e)},sn=(e,t,o)=>t in e?en(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,an=(e,t)=>{for(var o in t||(t={}))op.call(t,o)&&sn(e,o,t[o]);if(on)for(var o of on(t))rp.call(t,o)&&sn(e,o,t[o]);return e},ip=(e,t)=>tp(e,ep(t)),U=(e,t,o,r)=>{for(var i=void 0,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=a(t,o,i)||i);return i&&en(t,o,i),i},nn=(e,t,o)=>t.has(e)||rn("Cannot "+o),sp=(e,t,o)=>(nn(e,t,"read from private field"),t.get(e)),ap=(e,t,o)=>t.has(e)?rn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),np=(e,t,o,r)=>(nn(e,t,"write to private field"),t.set(e,o),o),jr,lo=class extends ft{constructor(){super(),ap(this,jr,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const o=new CustomEvent(e,an({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const r=customElements.get(e);if(!r){try{customElements.define(e,t,o)}catch{customElements.define(e,class extends t{},o)}return}let i=" (unknown version)",s=i;"version"in t&&t.version&&(i=" v"+t.version),"version"in r&&r.version&&(s=" v"+r.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,o){sp(this,jr)||(this.constructor.elementProperties.forEach((r,i)=>{r.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),np(this,jr,!0)),super.attributeChangedCallback(e,t,o)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,o)=>{e.has(o)&&this[o]==null&&(this[o]=t)})}};jr=new WeakMap,lo.version="2.20.1",lo.dependencies={},U([D()],lo.prototype,"dir"),U([D()],lo.prototype,"lang");const fe=Math.min,Ct=Math.max,Sr=Math.round,Nr=Math.floor,Gt=e=>({x:e,y:e}),lp={left:"right",right:"left",bottom:"top",top:"bottom"};function Ji(e,t,o){return Ct(e,fe(t,o))}function co(e,t){return typeof e=="function"?e(t):e}function be(e){return e.split("-")[0]}function po(e){return e.split("-")[1]}function ln(e){return e==="x"?"y":"x"}function Xi(e){return e==="y"?"height":"width"}function ie(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function qi(e){return ln(ie(e))}function cp(e,t,o){o===void 0&&(o=!1);const r=po(e),i=qi(e),s=Xi(i);let a=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(a=Tr(a)),[a,Tr(a)]}function dp(e){const t=Tr(e);return[Ki(e),t,Ki(t)]}function Ki(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const cn=["left","right"],dn=["right","left"],pp=["top","bottom"],up=["bottom","top"];function hp(e,t,o){switch(e){case"top":case"bottom":return o?t?dn:cn:t?cn:dn;case"left":case"right":return t?pp:up;default:return[]}}function gp(e,t,o,r){const i=po(e);let s=hp(be(e),o==="start",r);return i&&(s=s.map(a=>a+"-"+i),t&&(s=s.concat(s.map(Ki)))),s}function Tr(e){const t=be(e);return lp[t]+e.slice(t.length)}function mp(e){return{top:0,right:0,bottom:0,left:0,...e}}function pn(e){return typeof e!="number"?mp(e):{top:e,right:e,bottom:e,left:e}}function kr(e){const{x:t,y:o,width:r,height:i}=e;return{width:r,height:i,top:o,left:t,right:t+r,bottom:o+i,x:t,y:o}}function un(e,t,o){let{reference:r,floating:i}=e;const s=ie(t),a=qi(t),n=Xi(a),l=be(t),c=s==="y",g=r.x+r.width/2-i.width/2,m=r.y+r.height/2-i.height/2,w=r[n]/2-i[n]/2;let f;switch(l){case"top":f={x:g,y:r.y-i.height};break;case"bottom":f={x:g,y:r.y+r.height};break;case"right":f={x:r.x+r.width,y:m};break;case"left":f={x:r.x-i.width,y:m};break;default:f={x:r.x,y:r.y}}switch(po(t)){case"start":f[a]-=w*(o&&c?-1:1);break;case"end":f[a]+=w*(o&&c?-1:1);break}return f}async function fp(e,t){var o;t===void 0&&(t={});const{x:r,y:i,platform:s,rects:a,elements:n,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:g="viewport",elementContext:m="floating",altBoundary:w=!1,padding:f=0}=co(t,e),M=pn(f),j=n[w?m==="floating"?"reference":"floating":m],A=kr(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(j)))==null||o?j:j.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(n.floating)),boundary:c,rootBoundary:g,strategy:l})),v=m==="floating"?{x:r,y:i,width:a.floating.width,height:a.floating.height}:a.reference,b=await(s.getOffsetParent==null?void 0:s.getOffsetParent(n.floating)),x=await(s.isElement==null?void 0:s.isElement(b))?await(s.getScale==null?void 0:s.getScale(b))||{x:1,y:1}:{x:1,y:1},C=kr(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:v,offsetParent:b,strategy:l}):v);return{top:(A.top-C.top+M.top)/x.y,bottom:(C.bottom-A.bottom+M.bottom)/x.y,left:(A.left-C.left+M.left)/x.x,right:(C.right-A.right+M.right)/x.x}}const bp=50,vp=async(e,t,o)=>{const{placement:r="bottom",strategy:i="absolute",middleware:s=[],platform:a}=o,n=a.detectOverflow?a:{...a,detectOverflow:fp},l=await(a.isRTL==null?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:g,y:m}=un(c,r,l),w=r,f=0;const M={};for(let I=0;I<s.length;I++){const j=s[I];if(!j)continue;const{name:A,fn:v}=j,{x:b,y:x,data:C,reset:L}=await v({x:g,y:m,initialPlacement:r,placement:w,strategy:i,middlewareData:M,rects:c,platform:n,elements:{reference:e,floating:t}});g=b??g,m=x??m,M[A]={...M[A],...C},L&&f<bp&&(f++,typeof L=="object"&&(L.placement&&(w=L.placement),L.rects&&(c=L.rects===!0?await a.getElementRects({reference:e,floating:t,strategy:i}):L.rects),{x:g,y:m}=un(c,w,l)),I=-1)}return{x:g,y:m,placement:w,strategy:i,middlewareData:M}},yp=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:i,rects:s,platform:a,elements:n,middlewareData:l}=t,{element:c,padding:g=0}=co(e,t)||{};if(c==null)return{};const m=pn(g),w={x:o,y:r},f=qi(i),M=Xi(f),I=await a.getDimensions(c),j=f==="y",A=j?"top":"left",v=j?"bottom":"right",b=j?"clientHeight":"clientWidth",x=s.reference[M]+s.reference[f]-w[f]-s.floating[M],C=w[f]-s.reference[f],L=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let S=L?L[b]:0;(!S||!await(a.isElement==null?void 0:a.isElement(L)))&&(S=n.floating[b]||s.floating[M]);const z=x/2-C/2,N=S/2-I[M]/2-1,$=fe(m[A],N),Y=fe(m[v],N),H=$,st=S-I[M]-Y,B=S/2-I[M]/2+z,pt=Ji(H,B,st),ot=!l.arrow&&po(i)!=null&&B!==pt&&s.reference[M]/2-(B<H?$:Y)-I[M]/2<0,X=ot?B<H?B-H:B-st:0;return{[f]:w[f]+X,data:{[f]:pt,centerOffset:B-pt-X,...ot&&{alignmentOffset:X}},reset:ot}}}),wp=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:i,middlewareData:s,rects:a,initialPlacement:n,platform:l,elements:c}=t,{mainAxis:g=!0,crossAxis:m=!0,fallbackPlacements:w,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:M="none",flipAlignment:I=!0,...j}=co(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const A=be(i),v=ie(n),b=be(n)===n,x=await(l.isRTL==null?void 0:l.isRTL(c.floating)),C=w||(b||!I?[Tr(n)]:dp(n)),L=M!=="none";!w&&L&&C.push(...gp(n,I,M,x));const S=[n,...C],z=await l.detectOverflow(t,j),N=[];let $=((r=s.flip)==null?void 0:r.overflows)||[];if(g&&N.push(z[A]),m){const B=cp(i,a,x);N.push(z[B[0]],z[B[1]])}if($=[...$,{placement:i,overflows:N}],!N.every(B=>B<=0)){var Y,H;const B=(((Y=s.flip)==null?void 0:Y.index)||0)+1,pt=S[B];if(pt&&(!(m==="alignment"?v!==ie(pt):!1)||$.every(R=>ie(R.placement)===v?R.overflows[0]>0:!0)))return{data:{index:B,overflows:$},reset:{placement:pt}};let ot=(H=$.filter(X=>X.overflows[0]<=0).sort((X,R)=>X.overflows[1]-R.overflows[1])[0])==null?void 0:H.placement;if(!ot)switch(f){case"bestFit":{var st;const X=(st=$.filter(R=>{if(L){const F=ie(R.placement);return F===v||F==="y"}return!0}).map(R=>[R.placement,R.overflows.filter(F=>F>0).reduce((F,qt)=>F+qt,0)]).sort((R,F)=>R[1]-F[1])[0])==null?void 0:st[0];X&&(ot=X);break}case"initialPlacement":ot=n;break}if(i!==ot)return{reset:{placement:ot}}}return{}}}},Mp=new Set(["left","top"]);async function xp(e,t){const{placement:o,platform:r,elements:i}=e,s=await(r.isRTL==null?void 0:r.isRTL(i.floating)),a=be(o),n=po(o),l=ie(o)==="y",c=Mp.has(a)?-1:1,g=s&&l?-1:1,m=co(t,e);let{mainAxis:w,crossAxis:f,alignmentAxis:M}=typeof m=="number"?{mainAxis:m,crossAxis:0,alignmentAxis:null}:{mainAxis:m.mainAxis||0,crossAxis:m.crossAxis||0,alignmentAxis:m.alignmentAxis};return n&&typeof M=="number"&&(f=n==="end"?M*-1:M),l?{x:f*g,y:w*c}:{x:w*c,y:f*g}}const Lp=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:i,y:s,placement:a,middlewareData:n}=t,l=await xp(t,e);return a===((o=n.offset)==null?void 0:o.placement)&&(r=n.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:a}}}}},Cp=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:i,platform:s}=t,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:A=>{let{x:v,y:b}=A;return{x:v,y:b}}},...c}=co(e,t),g={x:o,y:r},m=await s.detectOverflow(t,c),w=ie(be(i)),f=ln(w);let M=g[f],I=g[w];if(a){const A=f==="y"?"top":"left",v=f==="y"?"bottom":"right",b=M+m[A],x=M-m[v];M=Ji(b,M,x)}if(n){const A=w==="y"?"top":"left",v=w==="y"?"bottom":"right",b=I+m[A],x=I-m[v];I=Ji(b,I,x)}const j=l.fn({...t,[f]:M,[w]:I});return{...j,data:{x:j.x-o,y:j.y-r,enabled:{[f]:a,[w]:n}}}}}},Ip=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:i,rects:s,platform:a,elements:n}=t,{apply:l=()=>{},...c}=co(e,t),g=await a.detectOverflow(t,c),m=be(i),w=po(i),f=ie(i)==="y",{width:M,height:I}=s.floating;let j,A;m==="top"||m==="bottom"?(j=m,A=w===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(A=m,j=w==="end"?"top":"bottom");const v=I-g.top-g.bottom,b=M-g.left-g.right,x=fe(I-g[j],v),C=fe(M-g[A],b),L=!t.middlewareData.shift;let S=x,z=C;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(z=b),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(S=v),L&&!w){const $=Ct(g.left,0),Y=Ct(g.right,0),H=Ct(g.top,0),st=Ct(g.bottom,0);f?z=M-2*($!==0||Y!==0?$+Y:Ct(g.left,g.right)):S=I-2*(H!==0||st!==0?H+st:Ct(g.top,g.bottom))}await l({...t,availableWidth:z,availableHeight:S});const N=await a.getDimensions(n.floating);return M!==N.width||I!==N.height?{reset:{rects:!0}}:{}}}};function Dr(){return typeof window<"u"}function uo(e){return hn(e)?(e.nodeName||"").toLowerCase():"#document"}function It(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Vt(e){var t;return(t=(hn(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function hn(e){return Dr()?e instanceof Node||e instanceof It(e).Node:!1}function _t(e){return Dr()?e instanceof Element||e instanceof It(e).Element:!1}function se(e){return Dr()?e instanceof HTMLElement||e instanceof It(e).HTMLElement:!1}function gn(e){return!Dr()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof It(e).ShadowRoot}function Ho(e){const{overflow:t,overflowX:o,overflowY:r,display:i}=Ot(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&i!=="inline"&&i!=="contents"}function Ap(e){return/^(table|td|th)$/.test(uo(e))}function Er(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const jp=/transform|translate|scale|rotate|perspective|filter/,Sp=/paint|layout|strict|content/,Ye=e=>!!e&&e!=="none";let ts;function zr(e){const t=_t(e)?Ot(e):e;return Ye(t.transform)||Ye(t.translate)||Ye(t.scale)||Ye(t.rotate)||Ye(t.perspective)||!es()&&(Ye(t.backdropFilter)||Ye(t.filter))||jp.test(t.willChange||"")||Sp.test(t.contain||"")}function Np(e){let t=ve(e);for(;se(t)&&!ho(t);){if(zr(t))return t;if(Er(t))return null;t=ve(t)}return null}function es(){return ts==null&&(ts=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),ts}function ho(e){return/^(html|body|#document)$/.test(uo(e))}function Ot(e){return It(e).getComputedStyle(e)}function $r(e){return _t(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ve(e){if(uo(e)==="html")return e;const t=e.assignedSlot||e.parentNode||gn(e)&&e.host||Vt(e);return gn(t)?t.host:t}function mn(e){const t=ve(e);return ho(t)?e.ownerDocument?e.ownerDocument.body:e.body:se(t)&&Ho(t)?t:mn(t)}function Qo(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const i=mn(e),s=i===((r=e.ownerDocument)==null?void 0:r.body),a=It(i);if(s){const n=os(a);return t.concat(a,a.visualViewport||[],Ho(i)?i:[],n&&o?Qo(n):[])}else return t.concat(i,Qo(i,[],o))}function os(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function fn(e){const t=Ot(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const i=se(e),s=i?e.offsetWidth:o,a=i?e.offsetHeight:r,n=Sr(o)!==s||Sr(r)!==a;return n&&(o=s,r=a),{width:o,height:r,$:n}}function rs(e){return _t(e)?e:e.contextElement}function go(e){const t=rs(e);if(!se(t))return Gt(1);const o=t.getBoundingClientRect(),{width:r,height:i,$:s}=fn(t);let a=(s?Sr(o.width):o.width)/r,n=(s?Sr(o.height):o.height)/i;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const Tp=Gt(0);function bn(e){const t=It(e);return!es()||!t.visualViewport?Tp:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function kp(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==It(e)?!1:t}function Be(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const i=e.getBoundingClientRect(),s=rs(e);let a=Gt(1);t&&(r?_t(r)&&(a=go(r)):a=go(e));const n=kp(s,o,r)?bn(s):Gt(0);let l=(i.left+n.x)/a.x,c=(i.top+n.y)/a.y,g=i.width/a.x,m=i.height/a.y;if(s){const w=It(s),f=r&&_t(r)?It(r):r;let M=w,I=os(M);for(;I&&r&&f!==M;){const j=go(I),A=I.getBoundingClientRect(),v=Ot(I),b=A.left+(I.clientLeft+parseFloat(v.paddingLeft))*j.x,x=A.top+(I.clientTop+parseFloat(v.paddingTop))*j.y;l*=j.x,c*=j.y,g*=j.x,m*=j.y,l+=b,c+=x,M=It(I),I=os(M)}}return kr({width:g,height:m,x:l,y:c})}function _r(e,t){const o=$r(e).scrollLeft;return t?t.left+o:Be(Vt(e)).left+o}function vn(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-_r(e,o),i=o.top+t.scrollTop;return{x:r,y:i}}function Dp(e){let{elements:t,rect:o,offsetParent:r,strategy:i}=e;const s=i==="fixed",a=Vt(r),n=t?Er(t.floating):!1;if(r===a||n&&s)return o;let l={scrollLeft:0,scrollTop:0},c=Gt(1);const g=Gt(0),m=se(r);if((m||!m&&!s)&&((uo(r)!=="body"||Ho(a))&&(l=$r(r)),m)){const f=Be(r);c=go(r),g.x=f.x+r.clientLeft,g.y=f.y+r.clientTop}const w=a&&!m&&!s?vn(a,l):Gt(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+g.x+w.x,y:o.y*c.y-l.scrollTop*c.y+g.y+w.y}}function Ep(e){return Array.from(e.getClientRects())}function zp(e){const t=Vt(e),o=$r(e),r=e.ownerDocument.body,i=Ct(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=Ct(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let a=-o.scrollLeft+_r(e);const n=-o.scrollTop;return Ot(r).direction==="rtl"&&(a+=Ct(t.clientWidth,r.clientWidth)-i),{width:i,height:s,x:a,y:n}}const yn=25;function $p(e,t){const o=It(e),r=Vt(e),i=o.visualViewport;let s=r.clientWidth,a=r.clientHeight,n=0,l=0;if(i){s=i.width,a=i.height;const g=es();(!g||g&&t==="fixed")&&(n=i.offsetLeft,l=i.offsetTop)}const c=_r(r);if(c<=0){const g=r.ownerDocument,m=g.body,w=getComputedStyle(m),f=g.compatMode==="CSS1Compat"&&parseFloat(w.marginLeft)+parseFloat(w.marginRight)||0,M=Math.abs(r.clientWidth-m.clientWidth-f);M<=yn&&(s-=M)}else c<=yn&&(s+=c);return{width:s,height:a,x:n,y:l}}function _p(e,t){const o=Be(e,!0,t==="fixed"),r=o.top+e.clientTop,i=o.left+e.clientLeft,s=se(e)?go(e):Gt(1),a=e.clientWidth*s.x,n=e.clientHeight*s.y,l=i*s.x,c=r*s.y;return{width:a,height:n,x:l,y:c}}function wn(e,t,o){let r;if(t==="viewport")r=$p(e,o);else if(t==="document")r=zp(Vt(e));else if(_t(t))r=_p(t,o);else{const i=bn(e);r={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return kr(r)}function Mn(e,t){const o=ve(e);return o===t||!_t(o)||ho(o)?!1:Ot(o).position==="fixed"||Mn(o,t)}function Op(e,t){const o=t.get(e);if(o)return o;let r=Qo(e,[],!1).filter(n=>_t(n)&&uo(n)!=="body"),i=null;const s=Ot(e).position==="fixed";let a=s?ve(e):e;for(;_t(a)&&!ho(a);){const n=Ot(a),l=zr(a);!l&&n.position==="fixed"&&(i=null),(s?!l&&!i:!l&&n.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||Ho(a)&&!l&&Mn(e,a))?r=r.filter(g=>g!==a):i=n,a=ve(a)}return t.set(e,r),r}function Pp(e){let{element:t,boundary:o,rootBoundary:r,strategy:i}=e;const a=[...o==="clippingAncestors"?Er(t)?[]:Op(t,this._c):[].concat(o),r],n=wn(t,a[0],i);let l=n.top,c=n.right,g=n.bottom,m=n.left;for(let w=1;w<a.length;w++){const f=wn(t,a[w],i);l=Ct(f.top,l),c=fe(f.right,c),g=fe(f.bottom,g),m=Ct(f.left,m)}return{width:c-m,height:g-l,x:m,y:l}}function Rp(e){const{width:t,height:o}=fn(e);return{width:t,height:o}}function Up(e,t,o){const r=se(t),i=Vt(t),s=o==="fixed",a=Be(e,!0,s,t);let n={scrollLeft:0,scrollTop:0};const l=Gt(0);function c(){l.x=_r(i)}if(r||!r&&!s)if((uo(t)!=="body"||Ho(i))&&(n=$r(t)),r){const f=Be(t,!0,s,t);l.x=f.x+t.clientLeft,l.y=f.y+t.clientTop}else i&&c();s&&!r&&i&&c();const g=i&&!r&&!s?vn(i,n):Gt(0),m=a.left+n.scrollLeft-l.x-g.x,w=a.top+n.scrollTop-l.y-g.y;return{x:m,y:w,width:a.width,height:a.height}}function is(e){return Ot(e).position==="static"}function xn(e,t){if(!se(e)||Ot(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return Vt(e)===o&&(o=o.ownerDocument.body),o}function Ln(e,t){const o=It(e);if(Er(e))return o;if(!se(e)){let i=ve(e);for(;i&&!ho(i);){if(_t(i)&&!is(i))return i;i=ve(i)}return o}let r=xn(e,t);for(;r&&Ap(r)&&is(r);)r=xn(r,t);return r&&ho(r)&&is(r)&&!zr(r)?o:r||Np(e)||o}const Yp=async function(e){const t=this.getOffsetParent||Ln,o=this.getDimensions,r=await o(e.floating);return{reference:Up(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function Bp(e){return Ot(e).direction==="rtl"}const Or={convertOffsetParentRelativeRectToViewportRelativeRect:Dp,getDocumentElement:Vt,getClippingRect:Pp,getOffsetParent:Ln,getElementRects:Yp,getClientRects:Ep,getDimensions:Rp,getScale:go,isElement:_t,isRTL:Bp};function Cn(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Hp(e,t){let o=null,r;const i=Vt(e);function s(){var n;clearTimeout(r),(n=o)==null||n.disconnect(),o=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:g,top:m,width:w,height:f}=c;if(n||t(),!w||!f)return;const M=Nr(m),I=Nr(i.clientWidth-(g+w)),j=Nr(i.clientHeight-(m+f)),A=Nr(g),b={rootMargin:-M+"px "+-I+"px "+-j+"px "+-A+"px",threshold:Ct(0,fe(1,l))||1};let x=!0;function C(L){const S=L[0].intersectionRatio;if(S!==l){if(!x)return a();S?a(!1,S):r=setTimeout(()=>{a(!1,1e-7)},1e3)}S===1&&!Cn(c,e.getBoundingClientRect())&&a(),x=!1}try{o=new IntersectionObserver(C,{...b,root:i.ownerDocument})}catch{o=new IntersectionObserver(C,b)}o.observe(e)}return a(!0),s}function Qp(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=rs(e),g=i||s?[...c?Qo(c):[],...t?Qo(t):[]]:[];g.forEach(A=>{i&&A.addEventListener("scroll",o,{passive:!0}),s&&A.addEventListener("resize",o)});const m=c&&n?Hp(c,o):null;let w=-1,f=null;a&&(f=new ResizeObserver(A=>{let[v]=A;v&&v.target===c&&f&&t&&(f.unobserve(t),cancelAnimationFrame(w),w=requestAnimationFrame(()=>{var b;(b=f)==null||b.observe(t)})),o()}),c&&!l&&f.observe(c),t&&f.observe(t));let M,I=l?Be(e):null;l&&j();function j(){const A=Be(e);I&&!Cn(I,A)&&o(),I=A,M=requestAnimationFrame(j)}return o(),()=>{var A;g.forEach(v=>{i&&v.removeEventListener("scroll",o),s&&v.removeEventListener("resize",o)}),m==null||m(),(A=f)==null||A.disconnect(),f=null,l&&cancelAnimationFrame(M)}}const Wp=Lp,Zp=Cp,Fp=wp,In=Ip,Gp=yp,Vp=(e,t,o)=>{const r=new Map,i={platform:Or,...o},s={...i.platform,_c:r};return vp(e,t,{...i,platform:s})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const An=Qa(class extends Wa{constructor(e){var t;if(super(e),e.type!==Ha.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((s=>s!==""))));for(const s in t)t[s]&&!((r=this.nt)!=null&&r.has(s))&&this.st.add(s);return this.render(t)}const o=e.element.classList;for(const s of this.st)s in t||(o.remove(s),this.st.delete(s));for(const s in t){const a=!!t[s];a===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(a?(o.add(s),this.st.add(s)):(o.remove(s),this.st.delete(s)))}return me}});function Jp(e){return Xp(e)}function ss(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Xp(e){for(let t=e;t;t=ss(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=ss(e);t;t=ss(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||zr(o)||t.tagName==="BODY"))return t}return null}function qp(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var J=class extends lo{constructor(){super(...arguments),this.localize=new tn(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom");let r=0,i=0,s=0,a=0,n=0,l=0,c=0,g=0;o?e.top<t.top?(r=e.left,i=e.bottom,s=e.right,a=e.bottom,n=t.left,l=t.top,c=t.right,g=t.top):(r=t.left,i=t.bottom,s=t.right,a=t.bottom,n=e.left,l=e.top,c=e.right,g=e.top):e.left<t.left?(r=e.right,i=e.top,s=t.left,a=t.top,n=e.right,l=e.bottom,c=t.left,g=t.bottom):(r=t.right,i=t.top,s=e.left,a=e.top,n=t.right,l=t.bottom,c=e.left,g=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${g}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||qp(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Qp(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Wp({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(In({apply:({rects:o})=>{const r=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=i?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(Fp({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(Zp({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(In({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Gp({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?o=>Or.getOffsetParent(o,Jp):Or.getOffsetParent;Vp(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:ip(an({},Or),{getOffsetParent:t})}).then(({x:o,y:r,middlewareData:i,placement:s})=>{const a=this.localize.dir()==="rtl",n={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let g="",m="",w="",f="";if(this.arrowPlacement==="start"){const M=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";g=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",m=a?M:"",f=a?"":M}else if(this.arrowPlacement==="end"){const M=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";m=a?"":M,f=a?M:"",w=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(f=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",g=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(f=typeof l=="number"?`${l}px`:"",g=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:g,right:m,bottom:w,left:f,[n]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return tt`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${An({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${An({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?tt`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};J.styles=[Kd,Jd],U([so(".popup")],J.prototype,"popup"),U([so(".popup__arrow")],J.prototype,"arrowEl"),U([D()],J.prototype,"anchor"),U([D({type:Boolean,reflect:!0})],J.prototype,"active"),U([D({reflect:!0})],J.prototype,"placement"),U([D({reflect:!0})],J.prototype,"strategy"),U([D({type:Number})],J.prototype,"distance"),U([D({type:Number})],J.prototype,"skidding"),U([D({type:Boolean})],J.prototype,"arrow"),U([D({attribute:"arrow-placement"})],J.prototype,"arrowPlacement"),U([D({attribute:"arrow-padding",type:Number})],J.prototype,"arrowPadding"),U([D({type:Boolean})],J.prototype,"flip"),U([D({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],J.prototype,"flipFallbackPlacements"),U([D({attribute:"flip-fallback-strategy"})],J.prototype,"flipFallbackStrategy"),U([D({type:Object})],J.prototype,"flipBoundary"),U([D({attribute:"flip-padding",type:Number})],J.prototype,"flipPadding"),U([D({type:Boolean})],J.prototype,"shift"),U([D({type:Object})],J.prototype,"shiftBoundary"),U([D({attribute:"shift-padding",type:Number})],J.prototype,"shiftPadding"),U([D({attribute:"auto-size"})],J.prototype,"autoSize"),U([D()],J.prototype,"sync"),U([D({type:Object})],J.prototype,"autoSizeBoundary"),U([D({attribute:"auto-size-padding",type:Number})],J.prototype,"autoSizePadding"),U([D({attribute:"hover-bridge",type:Boolean})],J.prototype,"hoverBridge"),J.define("sl-popup");const Kp=yt`

    a, a:visited, a:active {
        text-decoration: none;
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal
    }

    a:hover {
        color: var(--primary-color);
        text-decoration: underline;
    }
    
    hr {
        height: 1px;
        border-bottom: none;
        border-left: none;
        border-right: none;
        border-top: 1px dashed var(--secondary-color);
        margin-bottom: 20px;
        margin-top: 10px;
    }

    .origin-location {
        font-size: 0.8rem;
    }


    .empty-data {
        text-align: center;
        padding-top: 20px;
        color: var(--font-color-sub2)
    }

    .empty-data .mute-icon {
        font-size: 100px;
        margin-bottom: 20px;
        color: var(--font-color-sub2);
    }

    .empty-data .binary-icon {
        font-size: 100px;
        margin-bottom: 20px;
        color: var(--secondary-color);
    }

    .empty-data .up-icon {
        font-size: 100px;
        margin-bottom: 20px;
        color: var(--primary-color);
    }

    .empty-data .ok-icon {
        font-size: 100px;
        margin-bottom: 20px;
        color: var(--primary-color);
    }

    .empty-data.ok {
        color: var(--primary-color);
    }

    .empty-data.engage {
        padding-top: 90px;
        color: var(--primary-color);
    }

    .binary-data .binary-icon {
        font-size: 100px;
        margin-bottom: 20px;
        color: var(--primary-color);
    }
    
    strong {
        font-weight: normal;
        font-family: var(--font-stack-bold), monospace;
    }

    .spin {
        display: inline-block;
        position: relative;
        width: 35px;
        height: 25px;
    }
    
    .spin:after {
        content: " ";
        display: block;
        border-radius: 50%;
        width: 0;
        height: 0;
        margin: 8px;
        box-sizing: border-box;
        border: 10px solid var(--primary-color);
        border-color: var(--primary-color) transparent var(--primary-color) transparent;
        animation: spinner 1.2s infinite;
    }
    .pb33f-loader {
        display: inline-block;
        position: relative;
        width: 100%;
        height: 60px;
    }

    @keyframes spinner {
        0% {
            transform: rotate(0);
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        50% {
            transform: rotate(900deg);
            animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        100% {
            transform: rotate(1800deg);
        }
    }
    
`,tu=yt`
    code {
        font-size: 0.7rem;
        vertical-align: top;
        font-family: var(--font-stack), monospace;
        border: 1px solid var(--secondary-color-lowalpha);
        color: var(--secondary-color);
        border-radius: 0;
        padding: 0 2px 1px 2px;
        margin: 0 0 2px 0;
        display: inline-block;
        background-color: var(--secondary-color-very-lowalpha);
        text-transform: uppercase;
    }

    code:hover {
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
    }

    div.root {
        margin-left: 10px;
        font-size: 0.7rem;
        font-family: var(--font-stack-bold), monospace;
    }

    code.root {
        margin-left: 10px;
        font-size: 0.7rem;
        text-transform: uppercase;
    }


    code.skinny-root {
        margin-left: 10px;
        font-size: 0.7rem;
        
    }
    
    .clickable:hover {
        cursor: pointer;
    }
    
    .example-container {
        margin: 10px 0 10px 0;
    }

    h4 {
        margin-top: 0;
        padding-top: 0;
        margin-bottom: 10px;
        font-size: 0.8rem;
    }

    h3.label {
        margin-top: 0;
        padding-top: 0;
        margin-bottom: 10px;
        font-size: 1rem;
    }

    blockquote {
        color: var(--font-color-sub1);
        font-family: var(--font-stack-italic), sans-serif;
        border-left: 1px solid var(--secondary-color);
        padding-left: 10px;
        margin-inline-start: 20px;
    }
    
    
    .secondary {
        color: var(--secondary-color);
    }


    .margin-top {
        margin-top: 10px !important;
    }

    .margin-bottom {
        margin-bottom: 10px !important;
    }

    .map-key {
        color: var(--secondary-color);
        margin-top: 10px;
        margin-bottom: 5px;
    }

    .index-key {
        color: var(--secondary-color);
        font-size: 0.8rem;
    }
    
    .icon-vertical {
        vertical-align: text-top;
        margin-top: -2px;
    }

    .icon-vertical-no-margin {
        vertical-align: text-top;
    }

    .model-text{
        font-size: 0.8rem;
        font-weight: normal;
    }
    
    .model-item {
        font-size: 0.8rem;
        margin-bottom: 10px;
    }
    
    .map-value {
        padding-top: 5px;
        padding-left: 20px;
        margin-left: 20px;
        border-left: 1px dashed var(--secondary-color-dimmer);
    }

    .list-key {
        display: inline-block;
        font-size: 0.8rem;
        font-family: var(--font-stack), monospace;
        min-width: 60px;
        width: 60px;
        max-width: 60px;
        text-align: right;
    }

    .list-key-wide {
        min-width: 110px;
        width: 110px;
        max-width: 110px;
    }

    .list-key-full {
        display: inline-block;
        font-size: 0.8rem;
        font-family: var(--font-stack), monospace;
        text-align: right;
    }

    .list-value {
        font-size: 0.8rem;
        font-family: var(--font-stack-bold), monospace;
        color: var(--secondary-color)
    }

    .link {
        margin-right: 20px;
        font-size: 0.8rem;
    }

    strong {
        font-family: var(--font-stack-bold), monospace;
    }

    .reflink-icon {
        font-size: 1rem;
        vertical-align: top;
    }

    .reflink {
        color: var(--terminal-text);
        font-family: var(--font-stack-bold), monospace;
    }

    .reflink:hover {
        text-decoration: underline;
        cursor: pointer;
    }


    .hr-nopadding {
        margin: 0;
        padding: 0;

    }
    
    .required {
        color: var(--error-color);
        font-size: 0.7rem;
        vertical-align: middle;
    }

    .deprecated-large {
        color: var(--warn-color);
        padding: 5px;
        font-size: 0.8rem;
        vertical-align: top;
        border: 1px dashed var(--warn-color-lowalpha);
        margin: 5px 0 5px 0;
    }

    .deprecated-large > sl-icon {
        vertical-align: text-top;
    }

    .required-large > sl-icon {
        vertical-align: text-top;
    }

    .boolean-value > sl-icon {
        vertical-align: text-top;
    }

    .boolean-value {
        color: var(--font-color);
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 0.8rem;
        vertical-align: top;
        margin: 5px 0 5px 0;
    }

    .required-large {
        color: var(--error-color);
        font-size: 0.8rem;
        padding-top: 5px;
        padding-bottom: 5px;
        font-family: var(--font-stack-bold), monospace;
        vertical-align: top;
        margin: 5px 0 5px 0;
    }

    strong {
        font-weight: normal;
        font-family: var(--font-stack-bold), monospace;
    }

    .http200 {
        color: var(--font-color);
    }

    .http400 {
        color: var(--warn-300);
    }

    .http500 {
        color: var(--error-color);
    }

    .title-question {
        font-size: 1rem;
        vertical-align: middle;
    }

    .title-container {
        border: 1px dashed var(--font-color-sub3);
        padding: 10px;
    }

    .tag {
        display: inline-block;
        font-size: 0.8rem;
        color: var(--primary-color);
        padding: 0 5px 0 5px;
        border: 1px solid var(--primary-color);
        margin-bottom: 5px;
    }

    .tag:hover {
        color: var(--background-color);
        background-color: var(--primary-color);
        cursor: pointer;
    }

    .tag:active {
        background-color: var(--error-color);
        border: 1px solid var(--error-color);
    }

    .tag-alt {
        display: inline-block;
        font-size: 0.8rem;
        color: var(--secondary-color);
        padding: 5px;
        margin-bottom: 5px;
    }

    .flex {
        display: flex;
    }

    .section-control {
        vertical-align: middle;
    }

    .section-control::part(base) {
        padding: 0;
    }

    .section-control:hover {
        color: var(--primary-color);
        cursor: pointer;
    }

    .closed {
        display: none;
    }

    .open {
        display: block;
    }
    
    hr.hr-nopadding:last-child {
        display: none
    }
    
    hr.hrlist:last-child {
        display: none;
    }
    
    .component-container {
        font-size: 0.8rem; 
        padding-left: 20px;
        margin-bottom: 10px;
    }
`,eu=yt`
    
    em, i {
        font-style: normal;
        font-family: var(--font-stack-italic), monospace;
    }
    
    strong {
        font-style: normal;
        font-family: var(--font-stack-bold), monospace;
    }
    

`;var T=(e=>(e.VERSION="version",e.SCHEMA="schema",e.SCHEMAS="schemas",e.SCHEMA_TYPES="types",e.MEDIA_TYPE="mediaType",e.HEADER="header",e.EXAMPLE="example",e.EXAMPLES="examples",e.ENCODING="encoding",e.REQUEST_BODY="requestBody",e.REQUEST_BODIES="requestBodies",e.PARAMETER="parameter",e.PARAMETER_QUERY="query",e.COOKIE="cookie",e.PARAMETERS="parameters",e.LINK="link",e.LINKS="links",e.RESPONSE="response",e.RESPONSES="responses",e.OPERATION="operation",e.OPERATIONS="operations",e.SECURITY_SCHEME="securityScheme",e.SECURITY_SCHEMES="securitySchemes",e.EXTERNAL_DOCS="externalDocs",e.SECURITY="security",e.CALLBACK="callback",e.CALLBACKS="callbacks",e.PATH_ITEM="pathItem",e.PATH_ITEMS="pathItems",e.XML="xml",e.HEADERS="headers",e.SERVER="server",e.SERVERS="servers",e.SERVER_VARIABLE="serverVariable",e.PATHS="paths",e.COMPONENTS="components",e.CONTACT="contact",e.LICENSE="license",e.INFO="info",e.TAG="tag",e.TAGS="tags",e.DOCUMENT="document",e.WEBHOOK="webhook",e.WEBHOOKS="webhooks",e.EXTENSIONS="extensions",e.EXTENSION="extension",e.NO_EXAMPLE="noExample",e.POLYMORPHIC="polymorphic",e.ERROR="error",e.WARNING="warning",e.ROLODEX_FILE="rolodex-file",e.ROLODEX_FOLDER="rolodex-dir",e.OPENAPI="openapi",e.UPLOAD="upload",e.ADD="add",e.UNKNOWN="unknown",e.EXPAND_NODE="expand-node",e.POV_MODE="pov-mode",e.JS="js",e.GO="go",e.TS="ts",e.CS="cs",e.C="c",e.CPP="cpp",e.PHP="php",e.PY="py",e.HTML="html",e.MD="md",e.JAVA="java",e.RS="rs",e.ZIG="zig",e.RB="rb",e.YAML="yaml",e.JSON="json",e))(T||{}),ou=Object.defineProperty,ru=Object.getOwnPropertyDescriptor,Wo=(e,t,o,r)=>{for(var i=r>1?void 0:r?ru(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&ou(t,o,i),i},jn=(e=>(e.tiny="tiny",e.small="small",e.smaller="smaller",e.medium="medium",e.large="large",e.huge="huge",e))(jn||{}),Sn=(e=>(e.primary="primary",e.secondary="secondary",e.inverse="inverse",e.font="font",e.warning="warning",e.polymorphic="polymorphic",e.error="error",e.filtered="filtered",e))(Sn||{});let ye=class extends ft{constructor(){super(),this._themeHandler=()=>this.requestUpdate(),this.size="medium",this.color="primary"}getSize(){switch(this.size){case"tiny":return"0.8rem";case"smaller":return"1.2rem";case"medium":return"1.4rem";case"large":return"1.8rem";case"huge":return"2rem";case"small":default:return"1rem"}}getIconColor(){switch(this.color){case"primary":return"var(--primary-color)";case"secondary":return"var(--secondary-color)";case"warning":return"var(--warn-color)";case"polymorphic":return"var(--warn-color)";case"error":return"var(--error-color)";case"inverse":return"var(--background-color)";case"filtered":return"var(--font-color-sub2)";case"font":default:return"var(--font-color)"}}connectedCallback(){super.connectedCallback(),window.addEventListener(Re,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(Re,this._themeHandler)}isLightMode(){return document.documentElement.getAttribute("theme")==="light"}getNodeTypeFromIcon(e){return Object.values(T).includes(e)?e:T.SCHEMA}static getIconForType(e){switch(e){case T.DOCUMENT:return"stars";case T.SCHEMA:return"box";case T.SCHEMA_TYPES:return"diagram-3";case T.MEDIA_TYPE:case T.XML:return"code-slash";case T.HEADER:case T.HEADERS:return"envelope";case T.EXAMPLE:case T.EXAMPLES:return"chat-left-quote";case T.ENCODING:return"box-seam";case T.REQUEST_BODY:case T.REQUEST_BODIES:return"box-arrow-in-right";case T.PARAMETER:case T.PARAMETERS:case T.SERVER_VARIABLE:return"braces-asterisk";case T.PARAMETER_QUERY:return"question-lg";case T.COOKIE:return"cookie";case T.LINK:case T.LINKS:return"link";case T.RESPONSE:case T.RESPONSES:return"box-arrow-left";case T.OPERATION:case T.OPERATIONS:return"gear-wide-connected";case T.SECURITY_SCHEME:case T.SECURITY_SCHEMES:case T.SECURITY:return"shield-lock";case T.CALLBACK:case T.CALLBACKS:return"telephone-outbound";case T.PATH_ITEM:case T.PATH_ITEMS:return"geo";case T.SERVER:case T.SERVERS:return"hdd-network";case T.PATHS:return"compass";case T.COMPONENTS:return"boxes";case T.CONTACT:return"person-circle";case T.LICENSE:return"patch-check";case T.UPLOAD:return"upload";case T.INFO:return"info-square";case T.TAG:return"tag";case T.TAGS:return"tags";case T.VERSION:return"award";case T.EXTENSIONS:case T.EXTENSION:return"plug";case T.WEBHOOK:case T.WEBHOOKS:return"arrow-clockwise";case T.NO_EXAMPLE:return"exclamation-circle";case T.POLYMORPHIC:return"diagram-3";case T.ERROR:return"x-square";case T.WARNING:return"exclamation-triangle";case T.ROLODEX_FOLDER:return"folder";case T.ROLODEX_FILE:return"journal-code";case T.JS:return"filetype-js";case T.PHP:return"filetype-php";case T.PY:return"filetype-py";case T.HTML:return"filetype-html";case T.MD:return"markdown";case T.JAVA:return"filetype-java";case T.EXTERNAL_DOCS:return"journals";case T.RB:return"filetype-rb";case T.EXPAND_NODE:return"node-plus";case T.POV_MODE:return"binoculars";default:return"box"}}openapiIcon(){return this.isLightMode()?"PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogIzAwMDsiLz4KPC9zdmc+":"PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogI2ZmZjsiLz4KPC9zdmc+"}goIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIuMDAwMDAxIj4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMDIwLjM2MjIpIj4KICAgIDxlbGxpcHNlIGN4PSItOTA3LjM1NjU3IiBjeT0iNDc5LjkwMDA5IiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0ic2NhbGUoLTEgMSkgcm90YXRlKC02MC41NDgpIi8+CiAgICA8ZWxsaXBzZSBjeD0iLTg5MS41NzY1NCIgY3k9IjUwNy44NDYxIiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0icm90YXRlKC02MC41NDgpIi8+CiAgICA8cGF0aCBmaWxsPSIjMzg0ZTU0IiBkPSJNMTYuMDkxNjkzIDEwMjEuMzY0MmMtMS4xMDU3NDkuMDEtMi4yMTAzNDEuMDQ5LTMuMzE2MDkuMDlDNi44NDIyNTU4IDEwMjEuNjczOCAyIDEwMjYuMzk0MiAyIDEwMzIuMzYyMnYyMGgyOHYtMjBjMC01Ljk2ODMtNC42NjczNDUtMTAuNDkxMi0xMC41OTAyMy0xMC45MDgtMS4xMDU3NS0uMDc4LTIuMjEyMzI4LS4wOTktMy4zMTgwNzctLjA5eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNNC42MDc4ODY3IDEwMjUuMDQ2MmMuNDU5NTY0LjI1OTUgMS44MTgyNjIgMS4yMDEzIDEuOTgwOTgzIDEuNjQ4LjE4MzQwMS41MDM1LjE1OTM4NSAxLjA2NTctLjExNDYxNCAxLjU1MS0uMzQ2NjI3LjYxMzgtMS4wMDUzNDEuOTQ4Ny0xLjY5NjQyMS45MzY1LS4zMzk4ODYtLjAxLTEuNzIwMjgzLS42MzcyLTIuMDQyNTYxLS44MTkyLS45Nzc1NC0uNTUxOS0xLjM1MDc5NS0xLjc0MTgtLjgzMzY4Ni0yLjY1NzYuNTE3MTA5LS45MTU4IDEuNzI4NzQ5LTEuMjEwNyAyLjcwNjI5OS0uNjU4N3oiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuMDg2NjY1OSIgaGVpZ2h0PSIzLjUzMTM2NjMiIHg9IjE0LjQwNjIxMyIgeT0iMTAzNS42ODQyIiBmaWxsLW9wYWNpdHk9Ii4zMjg1MDI0NiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiByeT0iLjYyNDI2MzI5IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMTYgMTAyMy4zNjIyYy05IDAtMTIgMy43MTUzLTEyIDl2MjBoMjRjLS4wNDg4OS03LjM1NjIgMC0xOCAwLTIwIDAtNS4yODQ4LTMtOS0xMi05eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMjcuMDc0MDczIDEwMjUuMDQ2MmMtLjQ1OTU3LjI1OTUtMS44MTgyNTcgMS4yMDEzLTEuOTgwOTc5IDEuNjQ4LS4xODM0MDEuNTAzNS0uMTU5Mzg0IDEuMDY1Ny4xMTQ2MTQgMS41NTEuMzQ2NjI3LjYxMzggMS4wMDUzMzUuOTQ4NyAxLjY5NjQxNS45MzY1LjMzOTg4LS4wMSAxLjcyMDI5LS42MzcyIDIuMDQyNTYtLjgxOTIuOTc3NTQtLjU1MTkgMS4zNTA3OS0xLjc0MTguODMzNjktMi42NTc2LS41MTcxMS0uOTE1OC0xLjcyODc2LTEuMjEwNy0yLjcwNjMtLjY1ODd6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjE3NTczNCIgY3k9IjEwMzAuMzU0MiIgcj0iNC42NTM3NTQyIiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjEwLjMzOTQ4NiIgY3k9IjEwMzAuMzU0MiIgcj0iNC44MzE2MzQ1IiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxyZWN0IHdpZHRoPSIzLjY2NzM2ODciIGhlaWdodD0iNC4xMDYzNDA5IiB4PSIxNC4xMTU4NjMiIHk9IjEwMzUuOTE3NCIgZmlsbC1vcGFjaXR5PSIuMzI5NDExNzYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcnk9Ii43MjU5MDUzNiIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuNjY3MzY4NyIgaGVpZ2h0PSI0LjEwNjM0MDkiIHg9IjE0LjExNTg2MyIgeT0iMTAzNS4yMjUzIiBmaWxsPSIjZmZmY2ZiIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ5PSIuNzI1OTA1MzYiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjMyOTQxMTc2IiBkPSJNMTkuOTk5NzM1IDEwMzYuNTI4OWMwIC44MzgtLjg3MTIyOCAxLjI2ODItMi4xNDQ3NjYgMS4xNjU5LS4wMjM2NiAwLS4wNDc5NS0uNjAwNC0uMjU0MTQ3LS41ODMyLS41MDM2NjkuMDQyLTEuMDk1OTAyLS4wMi0xLjY4NTk2NC0uMDItLjYxMjkzOSAwLTEuMjA2MzQyLjE4MjYtMS42ODU0OS4wMTctLjExMDIzMy0uMDM4LS4xNzgyOTguNTgzOC0uMjYxNTMyLjU4MTYtMS4yNDM2ODUtLjAzMy0yLjA3ODgwMy0uMzM4My0yLjA3ODgwMy0xLjE2MTggMC0xLjIxMTggMS44MTU2MzUtMi4xOTQxIDQuMDU1MzUxLTIuMTk0MSAyLjIzOTcwNCAwIDQuMDU1MzUxLjk4MjMgNC4wNTUzNTEgMi4xOTQxeiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjYzM4Yzc0IiBkPSJNMTkuOTc3NDE0IDEwMzUuNzAwNGMwIC41Njg1LS40MzM2NTkuODU1NC0xLjEzODA5MSAxLjAwMDEtLjI5MTkzMy4wNi0uNjMwMzcxLjA5Ni0xLjAwMzcxOS4xMTY2LS41NjQwNS4wMzItMS4yMDc3ODIuMDMxLTEuODkxMjIuMDMxLS42NzI4MzQgMC0xLjMwNzE4MiAwLTEuODY0OTA0LS4wMjktLjMwNjI2OC0uMDE3LS41ODk0MjktLjA0My0uODQzMTY0LS4wODQtLjgxMzgzMy0uMTMxOC0xLjMyNDk2Mi0uNDE3LTEuMzI0OTYyLTEuMDM0NCAwLTEuMTYwMSAxLjgwNTY0Mi0yLjEwMDYgNC4wMzMwMy0yLjEwMDYgMi4yMjczNzcgMCA0LjAzMzAzLjk0MDUgNC4wMzMwMyAyLjEwMDZ6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxlbGxpcHNlIGN4PSIxNS45NDQzODIiIGN5PSIxMDMzLjg1MDEiIGZpbGw9IiMyMzIwMWYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcng9IjIuMDgwMTczMyIgcnk9IjEuMzQzNzQ3IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIxMi40MTQyMDEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIyMy4xMTAxMjEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzODRlNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIuMzk3MzA4NzQiIGQ9Ik01LjAwNTUzNzcgMTAyNy4yNzI3Yy0xLjE3MDQzNS0xLjA4MzUtMi4wMjY5NzMtLjc3MjEtMi4wNDQxNzItLjc0NjMiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4NGU1NCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9Ii4zOTczMDg3NCIgZD0iTTQuMzg1MjQ1NyAxMDI2LjkxNTJjLTEuMTU4NTU3LjAzNi0xLjM0NjcwNC42MzAzLTEuMzM4ODEuNjUyM20yMy41ODQwOTczLS4zOTUxYzEuMTcwNDMtMS4wODM1IDIuMDI2OTctLjc3MjEgMi4wNDQxNy0uNzQ2MyIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzg0ZTU0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iLjM5NzMwODc0IiBkPSJNMjcuMzIxNzczIDEwMjYuNjczYzEuMTU4NTYuMDM2IDEuMzQ2Ny42MzAyIDEuMzM4OC42NTIyIi8+CiAgPC9nPgo8L3N2Zz4="}typescriptIcon(){return"CjxzdmcgZmlsbD0ibm9uZSIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiMzMTc4YzYiIGhlaWdodD0iNTEyIiByeD0iNTAiIHdpZHRoPSI1MTIiLz48cmVjdCBmaWxsPSIjMzE3OGM2IiBoZWlnaHQ9IjUxMiIgcng9IjUwIiB3aWR0aD0iNTEyIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMzE2LjkzOSA0MDcuNDI0djUwLjA2MWM4LjEzOCA0LjE3MiAxNy43NjMgNy4zIDI4Ljg3NSA5LjM4NnMyMi44MjMgMy4xMjkgMzUuMTM1IDMuMTI5YzExLjk5OSAwIDIzLjM5Ny0xLjE0NyAzNC4xOTYtMy40NDIgMTAuNzk5LTIuMjk0IDIwLjI2OC02LjA3NSAyOC40MDYtMTEuMzQyIDguMTM4LTUuMjY2IDE0LjU4MS0xMi4xNSAxOS4zMjgtMjAuNjVzNy4xMjEtMTkuMDA3IDcuMTIxLTMxLjUyMmMwLTkuMDc0LTEuMzU2LTE3LjAyNi00LjA2OS0yMy44NTdzLTYuNjI1LTEyLjkwNi0xMS43MzgtMTguMjI1Yy01LjExMi01LjMxOS0xMS4yNDItMTAuMDkxLTE4LjM4OS0xNC4zMTVzLTE1LjIwNy04LjIxMy0yNC4xOC0xMS45NjdjLTYuNTczLTIuNzEyLTEyLjQ2OC01LjM0NS0xNy42ODUtNy45LTUuMjE3LTIuNTU2LTkuNjUxLTUuMTYzLTEzLjMwMy03LjgyMi0zLjY1Mi0yLjY2LTYuNDY5LTUuNDc2LTguNDUxLTguNDQ4LTEuOTgyLTIuOTczLTIuOTc0LTYuMzM2LTIuOTc0LTEwLjA5MSAwLTMuNDQxLjg4Ny02LjU0NCAyLjY2MS05LjMwOHM0LjI3OC01LjEzNiA3LjUxMi03LjExOGMzLjIzNS0xLjk4MSA3LjE5OS0zLjUyIDExLjg5NC00LjYxNSA0LjY5Ni0xLjA5NSA5LjkxMi0xLjY0MiAxNS42NTEtMS42NDIgNC4xNzMgMCA4LjU4MS4zMTMgMTMuMjI0LjkzOCA0LjY0My42MjYgOS4zMTIgMS41OTEgMTQuMDA4IDIuODk0IDQuNjk1IDEuMzA0IDkuMjU5IDIuOTQ3IDEzLjY5NCA0LjkyOCA0LjQzNCAxLjk4MiA4LjUyOSA0LjI3NiAxMi4yODUgNi44ODR2LTQ2Ljc3NmMtNy42MTYtMi45Mi0xNS45MzctNS4wODQtMjQuOTYyLTYuNDkycy0xOS4zODEtMi4xMTItMzEuMDY2LTIuMTEyYy0xMS44OTUgMC0yMy4xNjMgMS4yNzgtMzMuODA1IDMuODMzcy0yMC4wMDYgNi41NDQtMjguMDkzIDExLjk2N2MtOC4wODYgNS40MjQtMTQuNDc2IDEyLjMzMy0xOS4xNzEgMjAuNzI5LTQuNjk1IDguMzk1LTcuMDQzIDE4LjQzMy03LjA0MyAzMC4xMTQgMCAxNC45MTQgNC4zMDQgMjcuNjM4IDEyLjkxMiAzOC4xNzIgOC42MDcgMTAuNTMzIDIxLjY3NSAxOS40NSAzOS4yMDQgMjYuNzUxIDYuODg2IDIuODE2IDEzLjMwMyA1LjU3OSAxOS4yNSA4LjI5MXMxMS4wODYgNS41MjggMTUuNDE1IDguNDQ4YzQuMzMgMi45MiA3Ljc0NyA2LjEwMSAxMC4yNTIgOS41NDMgMi41MDQgMy40NDEgMy43NTYgNy4zNTIgMy43NTYgMTEuNzMzIDAgMy4yMzMtLjc4MyA2LjIzMS0yLjM0OCA4Ljk5NXMtMy45MzkgNS4xNjItNy4xMjEgNy4xOTYtNy4xNDcgMy42MjQtMTEuODk0IDQuNzcxYy00Ljc0OCAxLjE0OC0xMC4zMDMgMS43MjEtMTYuNjY4IDEuNzIxLTEwLjg1MSAwLTIxLjU5Ny0xLjkwMy0zMi4yNC01LjcxLTEwLjY0Mi0zLjgwNi0yMC41MDItOS41MTYtMjkuNTc5LTE3LjEzem0tODQuMTU5LTEyMy4zNDJoNjQuMjJ2LTQxLjA4MmgtMTc5djQxLjA4Mmg2My45MDZ2MTgyLjkxOGg1MC44NzR6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4="}csIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHdpZHRoPSIyMDQuOCIKICAgaGVpZ2h0PSIyMDQuOCIKICAgdmlld0JveD0iMCAwIDU0LjE4NjY2NiA1NC4xODY2NjciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImEiCiAgICAgICB4MT0iNDYuNzczIgogICAgICAgeDI9IjY5LjkwNyIKICAgICAgIHkxPSI4Ni40NjIiCiAgICAgICB5Mj0iMTI2LjczMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzMy45ODMgLTUxOC45NzQpIHNjYWxlKDguNzg5OTYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcAogICAgICAgICBzdG9wLWNvbG9yPSIjOTI3QkU1IgogICAgICAgICBpZD0ic3RvcDEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3RvcC1jb2xvcj0iIzUxMkJENCIKICAgICAgICAgaWQ9InN0b3AyIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxmaWx0ZXIKICAgICAgIGlkPSJiIgogICAgICAgd2lkdGg9IjQyLjg0NSIKICAgICAgIGhlaWdodD0iMzkuMTM2IgogICAgICAgeD0iNDQuNjI5IgogICAgICAgeT0iOTEuODkiCiAgICAgICBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiCiAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8ZmVGbG9vZAogICAgICAgICBmbG9vZC1vcGFjaXR5PSIwIgogICAgICAgICByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgaWQ9ImZlRmxvb2QyIiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MiIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGlkPSJmZU9mZnNldDIiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgzIiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIGlkPSJmZUJsZW5kMyIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgaW49IlNvdXJjZUFscGhhIgogICAgICAgICByZXN1bHQ9ImhhcmRBbHBoYSIKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIgogICAgICAgICBpZD0iZmVDb2xvck1hdHJpeDQiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMSIKICAgICAgICAgaWQ9ImZlT2Zmc2V0NCIgLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMi40OTkiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjQiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg1IiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgcmVzdWx0PSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBpZD0iZmVCbGVuZDUiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIGluPSJTb3VyY2VBbHBoYSIKICAgICAgICAgcmVzdWx0PSJoYXJkQWxwaGEiCiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg2IiAvPgogICAgICA8ZmVPZmZzZXQKICAgICAgICAgZHk9IjQiCiAgICAgICAgIGlkPSJmZU9mZnNldDYiIC8+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBzdGREZXZpYXRpb249IjIiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjYiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA5IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4NyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0M19kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ3IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OCIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGR5PSI5IgogICAgICAgICBpZD0iZmVPZmZzZXQ4IiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIyLjUiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjgiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA1IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QzX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NF9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MTAiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMTUiCiAgICAgICAgIGlkPSJmZU9mZnNldDEwIiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIzIgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxMCIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3Q0X2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9InNoYXBlIgogICAgICAgICBpZD0iZmVCbGVuZDEyIiAvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxwYXRoCiAgICAgZD0iTTEzNS43MzEgMjg1Ljg1djE3My45M2MwIDIxLjUxNyAxMS40NzggNDEuNDE4IDMwLjEyNSA1Mi4xNjhsMTUwLjYyNCA4Ni45NzZhNjAuMjIzIDYwLjIyMyAwIDAgMCA2MC4yNSAwbDE1MC42MjMtODYuOTc2YTYwLjIzNyA2MC4yMzcgMCAwIDAgMzAuMTI0LTUyLjE2OVYyODUuODUxYzAtMjEuNTI1LTExLjQ3Ny00MS40MjMtMzAuMTI0LTUyLjE3N0wzNzYuNzI5IDE0Ni43MmE2MC4yMSA2MC4yMSAwIDAgMC02MC4yNDkgMGwtMTUwLjYyNCA4Ni45NTRhNjAuMjQ1IDYwLjI0NSAwIDAgMC0zMC4xMjUgNTIuMTc3eiIKICAgICBmaWxsPSJ1cmwoI2EpIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KC4xIDAgMCAuMSAtNy41NjcgLTEwLjE4OSkiCiAgICAgaWQ9InBhdGgxMiIgLz4KICA8cGF0aAogICAgIGQ9Ik01NC4wNTYgOTguMDN2Ni44NTVhMS43MTEgMS43MTEgMCAwIDAgMS43MTQgMS43MTQgMS43MTMgMS43MTMgMCAwIDAgMS43MTQtMS43MTQgMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMCA1LjE0IDUuMTQgMCAxIDEtMTAuMjgyIDB2LTYuODU0YTUuMTQgNS4xNCAwIDEgMSAxMC4yODIgMCAxLjcxMiAxLjcxMiAwIDEgMS0zLjQyNyAwIDEuNzEyIDEuNzEyIDAgMSAwLTMuNDI3IDB6bTI3LjQxOCA2Ljg1NWExLjcxMiAxLjcxMiAwIDAgMS0xLjcxNCAxLjcxNGgtMS43MTR2MS43MTNjMCAuNDU1LS4xOC44OTEtLjUwMiAxLjIxMmExLjcxIDEuNzEgMCAwIDEtMi40MjMgMCAxLjcxOSAxLjcxOSAwIDAgMS0uNTAyLTEuMjEydi0xLjcxM2gtMy40Mjd2MS43MTNhMS43MSAxLjcxIDAgMCAxLTEuNzE0IDEuNzE0IDEuNzEgMS43MSAwIDAgMS0xLjcxMy0xLjcxNHYtMS43MTNINjYuMDVhMS43MTMgMS43MTMgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMy40MjdINjYuMDVhMS43MTIgMS43MTIgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMS43MTRhMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMHYxLjcxM2gzLjQyN3YtMS43MTNhMS43MTIgMS43MTIgMCAxIDEgMy40MjcgMHYxLjcxM2gxLjcxNGMuNDU0IDAgLjg5LjE4IDEuMjExLjUwMmExLjcxIDEuNzEgMCAwIDEgMCAyLjQyMyAxLjcxMiAxLjcxMiAwIDAgMS0xLjIxMS41MDNoLTEuNzE0djMuNDI3aDEuNzE0YTEuNzE4IDEuNzE4IDAgMCAxIDEuNzE0IDEuNzEzem0tNi44NTUtNS4xNGgtMy40Mjd2My40MjdoMy40Mjd6IgogICAgIGZpbGw9IiNmZmYiCiAgICAgZmlsdGVyPSJ1cmwoI2IpIgogICAgIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpzY3JlZW4iCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLjg3OSAwIDAgLjg3OSAtMzAuOTY1IC02Mi4wODYpIgogICAgIGlkPSJwYXRoMTMiIC8+Cjwvc3ZnPgo="}cIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHZpZXdCb3g9IjAgMCAzOC4wMDAwODkgNDIuMDAwMDMxIgogICB3aWR0aD0iMzgwLjAwMDg5IgogICBoZWlnaHQ9IjQyMC4wMDAzMSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMTAiCiAgIHNvZGlwb2RpOmRvY25hbWU9Imljb25zOC1jLXByb2dyYW1taW5nLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wLjEgKDNiYzJlODEzZjUsIDIwMjAtMDktMDcpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExNiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE0IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU2IgogICAgIGlkPSJuYW1lZHZpZXcxMiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMS40ODk1ODMzIgogICAgIGlua3NjYXBlOmN4PSIxOTAiCiAgICAgaW5rc2NhcGU6Y3k9IjIxMC4wMDI4MiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEwIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzI4MzU5MyIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAxNy45MDMsMC4yODYyODE2NiBjIDAuNjc5LC0wLjM4MSAxLjUxNSwtMC4zODEgMi4xOTMsMCBDIDIzLjQ1MSwyLjE2OTI4MTcgMzMuNTQ3LDcuODM3MjgxNyAzNi45MDMsOS43MjAyODE3IDM3LjU4MiwxMC4xMDAyODIgMzgsMTAuODA0MjgyIDM4LDExLjU2NjI4MiBjIDAsMy43NjYgMCwxNS4xMDEgMCwxOC44NjcgMCwwLjc2MiAtMC40MTgsMS40NjYgLTEuMDk3LDEuODQ3IC0zLjM1NSwxLjg4MyAtMTMuNDUxLDcuNTUxIC0xNi44MDcsOS40MzQgLTAuNjc5LDAuMzgxIC0xLjUxNSwwLjM4MSAtMi4xOTMsMCAtMy4zNTUsLTEuODgzIC0xMy40NTEsLTcuNTUxIC0xNi44MDcsLTkuNDM0IC0wLjY3OCwtMC4zODEgLTEuMDk2LC0xLjA4NCAtMS4wOTYsLTEuODQ2IDAsLTMuNzY2IDAsLTE1LjEwMSAwLC0xOC44NjcgMCwtMC43NjIgMC40MTgsLTEuNDY2IDEuMDk3LC0xLjg0NzAwMDMgMy4zNTQsLTEuODgzIDEzLjQ1MiwtNy41NTEgMTYuODA2LC05LjQzNDAwMDA0IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoMiIKICAgICBzdHlsZT0iZmlsbDojMDA0NDgyO2ZpbGwtb3BhY2l0eToxIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzVjNmJjMCIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAwLjMwNCwzMS40MDQyODIgYyAtMC4yNjYsLTAuMzU2IC0wLjMwNCwtMC42OTQgLTAuMzA0LC0xLjE0OSAwLC0zLjc0NCAwLC0xNS4wMTQgMCwtMTguNzU5IDAsLTAuNzU4IDAuNDE3LC0xLjQ1OCAxLjA5NCwtMS44MzYwMDAzIDMuMzQzLC0xLjg3MiAxMy40MDUsLTcuNTA3IDE2Ljc0OCwtOS4zODAwMDAwNCAwLjY3NywtMC4zNzkgMS41OTQsLTAuMzcxIDIuMjcxLDAuMDA4IDMuMzQzLDEuODcyMDAwMDQgMTMuMzcxLDcuNDU5MDAwMDQgMTYuNzE0LDkuMzMxMDAwMDQgMC4yNywwLjE1MiAwLjQ3NiwwLjMzNSAwLjY2LDAuNTc2MDAwMyB6IgogICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICBpZD0icGF0aDQiCiAgICAgc3R5bGU9ImZpbGw6IzY1OWFkMjtmaWxsLW9wYWNpdHk6MSIgLz4KICA8cGF0aAogICAgIGZpbGw9IiNmZmZmZmYiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMTksNy4wMDAyODE3IGMgNy43MjcsMCAxNCw2LjI3MzAwMDMgMTQsMTQuMDAwMDAwMyAwLDcuNzI3IC02LjI3MywxNCAtMTQsMTQgLTcuNzI3LDAgLTE0LC02LjI3MyAtMTQsLTE0IDAsLTcuNzI3IDYuMjczLC0xNC4wMDAwMDAzIDE0LC0xNC4wMDAwMDAzIHogbSAwLDcuMDAwMDAwMyBjIDMuODYzLDAgNywzLjEzNiA3LDcgMCwzLjg2MyAtMy4xMzcsNyAtNyw3IC0zLjg2MywwIC03LC0zLjEzNyAtNywtNyAwLC0zLjg2NCAzLjEzNiwtNyA3LC03IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoNiIgLz4KICA8cGF0aAogICAgIGZpbGw9IiMzOTQ5YWIiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMzcuNDg1LDEwLjIwNTI4MiBjIDAuNTE2LDAuNDgzIDAuNTA2LDEuMjExIDAuNTA2LDEuNzg0IDAsMy43OTUgLTAuMDMyLDE0LjU4OSAwLjAwOSwxOC4zODQgMC4wMDQsMC4zOTYgLTAuMTI3LDAuODEzIC0wLjMyMywxLjEyNyBsIC0xOS4wODQsLTEwLjUgeiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9InBhdGg4IgogICAgIHN0eWxlPSJmaWxsOiMwMDU5OWM7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo="}cppIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9InV0Zi04Ij8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMzA2cHgiIGhlaWdodD0iMzQ0LjM1cHgiIHZpZXdCb3g9IjAgMCAzMDYgMzQ0LjM1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDYgMzQ0LjM1IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iIzAwNTk5QyIgZD0iTTMwMi4xMDcsMjU4LjI2MmMyLjQwMS00LjE1OSwzLjg5My04Ljg0NSwzLjg5My0xMy4wNTNWOTkuMTRjMC00LjIwOC0xLjQ5LTguODkzLTMuODkyLTEzLjA1MkwxNTMsMTcyLjE3NQoJTDMwMi4xMDcsMjU4LjI2MnoiLz4KPHBhdGggZmlsbD0iIzAwNDQ4MiIgZD0iTTE2Ni4yNSwzNDEuMTkzbDEyNi41LTczLjAzNGMzLjY0NC0yLjEwNCw2Ljk1Ni01LjczNyw5LjM1Ny05Ljg5N0wxNTMsMTcyLjE3NUwzLjg5MywyNTguMjYzCgljMi40MDEsNC4xNTksNS43MTQsNy43OTMsOS4zNTcsOS44OTZsMTI2LjUsNzMuMDM0QzE0Ny4wMzcsMzQ1LjQwMSwxNTguOTYzLDM0NS40MDEsMTY2LjI1LDM0MS4xOTN6Ii8+CjxwYXRoIGZpbGw9IiM2NTlBRDIiIGQ9Ik0zMDIuMTA4LDg2LjA4N2MtMi40MDItNC4xNi01LjcxNS03Ljc5My05LjM1OC05Ljg5N0wxNjYuMjUsMy4xNTZjLTcuMjg3LTQuMjA4LTE5LjIxMy00LjIwOC0yNi41LDAKCUwxMy4yNSw3Ni4xOUM1Ljk2Miw4MC4zOTcsMCw5MC43MjUsMCw5OS4xNHYxNDYuMDY5YzAsNC4yMDgsMS40OTEsOC44OTQsMy44OTMsMTMuMDUzTDE1MywxNzIuMTc1TDMwMi4xMDgsODYuMDg3eiIvPgo8Zz4KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNTMsMjc0LjE3NWMtNTYuMjQzLDAtMTAyLTQ1Ljc1Ny0xMDItMTAyczQ1Ljc1Ny0xMDIsMTAyLTEwMmMzNi4yOTIsMCw3MC4xMzksMTkuNTMsODguMzMxLDUwLjk2OAoJCWwtNDQuMTQzLDI1LjU0NGMtOS4xMDUtMTUuNzM2LTI2LjAzOC0yNS41MTItNDQuMTg4LTI1LjUxMmMtMjguMTIyLDAtNTEsMjIuODc4LTUxLDUxYzAsMjguMTIxLDIyLjg3OCw1MSw1MSw1MQoJCWMxOC4xNTIsMCwzNS4wODUtOS43NzYsNDQuMTkxLTI1LjUxNWw0NC4xNDMsMjUuNTQzQzIyMy4xNDIsMjU0LjY0NCwxODkuMjk0LDI3NC4xNzUsMTUzLDI3NC4xNzV6Ii8+CjwvZz4KPGc+Cgk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjI1NSwxNjYuNTA4IDI0My42NjYsMTY2LjUwOCAyNDMuNjY2LDE1NS4xNzUgMjMyLjMzNCwxNTUuMTc1IDIzMi4zMzQsMTY2LjUwOCAyMjEsMTY2LjUwOCAKCQkyMjEsMTc3Ljg0MSAyMzIuMzM0LDE3Ny44NDEgMjMyLjMzNCwxODkuMTc1IDI0My42NjYsMTg5LjE3NSAyNDMuNjY2LDE3Ny44NDEgMjU1LDE3Ny44NDEgCSIvPgo8L2c+CjxnPgoJPHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIyOTcuNSwxNjYuNTA4IDI4Ni4xNjYsMTY2LjUwOCAyODYuMTY2LDE1NS4xNzUgMjc0LjgzNCwxNTUuMTc1IDI3NC44MzQsMTY2LjUwOCAyNjMuNSwxNjYuNTA4IAoJCTI2My41LDE3Ny44NDEgMjc0LjgzNCwxNzcuODQxIDI3NC44MzQsMTg5LjE3NSAyODYuMTY2LDE4OS4xNzUgMjg2LjE2NiwxNzcuODQxIDI5Ny41LDE3Ny44NDEgCSIvPgo8L2c+Cjwvc3ZnPgo="}zigLogo(){return"CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTUzIDE0MCI+CjxnIGZpbGw9IiNmN2E0MWQiPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI0NiwyMiAyOCw0NCAxOSwzMCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNDYsMjIgMzMsMzMgMjgsNDQgMjIsNDQgMjIsOTUgMzEsOTUgMjAsMTAwIDEyLDExNyAwLDExNyAwLDIyIiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiLz4KCQk8cG9seWdvbiBwb2ludHM9IjMxLDk1IDEyLDExNyA0LDEwNiIvPgoJPC9nPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI1NiwyMiA2MiwzNiAzNyw0NCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNTYsMjIgMTExLDIyIDExMSw0NCAzNyw0NCA1NiwzMiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxMTYsOTUgOTcsMTE3IDkwLDEwNCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTE2LDk1IDEwMCwxMDQgOTcsMTE3IDQyLDExNyA0Miw5NSIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTAsMCA1MiwxMTcgMywxNDAgMTAxLDIyIi8+Cgk8L2c+Cgk8Zz4KCQk8cG9seWdvbiBwb2ludHM9IjE0MSwyMiAxNDAsNDAgMTIyLDQ1Ii8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTMsMjIgMTUzLDExNyAxMDYsMTE3IDEyMCwxMDUgMTI1LDk1IDEzMSw5NSAxMzEsNDUgMTIyLDQ1IDEzMiwzNiAxNDEsMjIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTI1LDk1IDEzMCwxMTAgMTA2LDExNyIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="}render(){const e=ye.getIconForType(this.getNodeTypeFromIcon(this.icon));switch(this.icon){case T.OPENAPI:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.openapiIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}; ${this.isLightMode()?"filter: grayscale(100%)":""}"></sl-icon>`;case T.GO:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.goIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.TS:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.typescriptIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.CS:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.csIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.C:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.CPP:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cppIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.ZIG:return tt`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.zigLogo()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}return tt`
            <sl-icon exportparts="base" data-fresh="${this.icon}" name="${e}"
                     class="icon-vertical-no-margin"
                     style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}};ye.styles=[Kp,tu,eu,Fa],Wo([D()],ye.prototype,"icon",2),Wo([D({type:jn})],ye.prototype,"size",2),Wo([D({type:Sn})],ye.prototype,"color",2),Wo([D()],ye.prototype,"tooltip",2),ye=Wo([ue("pb33f-model-icon")],ye);var Pt=class extends lo{constructor(){super(...arguments),this.localize=new tn(this),this.value=0,this.type="decimal",this.noGrouping=!1,this.currency="USD",this.currencyDisplay="symbol"}render(){return isNaN(this.value)?"":this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.noGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};U([D({type:Number})],Pt.prototype,"value"),U([D()],Pt.prototype,"type"),U([D({attribute:"no-grouping",type:Boolean})],Pt.prototype,"noGrouping"),U([D()],Pt.prototype,"currency"),U([D({attribute:"currency-display"})],Pt.prototype,"currencyDisplay"),U([D({attribute:"minimum-integer-digits",type:Number})],Pt.prototype,"minimumIntegerDigits"),U([D({attribute:"minimum-fraction-digits",type:Number})],Pt.prototype,"minimumFractionDigits"),U([D({attribute:"maximum-fraction-digits",type:Number})],Pt.prototype,"maximumFractionDigits"),U([D({attribute:"minimum-significant-digits",type:Number})],Pt.prototype,"minimumSignificantDigits"),U([D({attribute:"maximum-significant-digits",type:Number})],Pt.prototype,"maximumSignificantDigits"),Pt.define("sl-format-number");const iu=yt`
    .paginator-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* background: var(--pagination-header); */
        border-bottom: 1px solid var(--secondary-color);
        border-top: 1px solid var(--secondary-color);
    }
    
    .location {
        color: var(--font-color-sub1);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    strong {
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
    }

    strong.current-page, strong.total {
        color: var(--primary-color);
    }

    .result-range {
        font-size: 0.8rem;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .hide {
        display: none;
    }
    
`,Nn="paginatorFirstPage",Tn="paginatorLastPage",kn="paginatorNextPage",Dn="paginatorPreviousPage";var su=Object.defineProperty,au=Object.getOwnPropertyDescriptor,Jt=(e,t,o,r)=>{for(var i=r>1?void 0:r?au(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&su(t,o,i),i};let At=class extends ft{get hide(){return this.totalItems<=this.itemsPerPage}constructor(){super(),this.currentPage=1,this.totalPages=0,this.totalItems=0,this.itemsPerPage=20,this.label="Problems"}getRangeStart(){let e=this.currentPage*this.itemsPerPage-this.itemsPerPage;return e==0?0:e>0?e:0}getPagesRemaining(){let e=this.totalItems-this.currentPage*this.itemsPerPage;return e>0?e:0}getRangeEnd(){let e=this.getRangeStart();e==1&&(e=0);let t=e+this.itemsPerPage;return t>this.totalItems?this.totalItems:t>=0?t:0}nextPage(){this.currentPage<this.totalPages&&this.dispatchEvent(new CustomEvent(kn,{composed:!0}))}previousPage(){this.currentPage>1&&this.dispatchEvent(new CustomEvent(Dn,{composed:!0}))}lastPage(){this.currentPage<this.totalPages&&this.dispatchEvent(new CustomEvent(Tn,{composed:!0}))}firstPage(){this.currentPage>1&&this.dispatchEvent(new CustomEvent(Nn,{composed:!0}))}togglePrev(e){this.homeButton&&(this.prevButton.disabled=e,this.homeButton.disabled=e)}toggleNext(e){this.endButton&&(this.nextButton.disabled=e,this.endButton.disabled=e)}updated(){this.togglePrev(this.currentPage===1),this.toggleNext(this.currentPage===this.totalPages)}render(){return this.totalItems==0?tt``:tt`
            <div class="paginator-navigation ${this.hide?"hide":""}">
                <div>
                    <sl-icon-button @click=${this.firstPage} name="chevron-double-left" label="First page" class="home" title="first page" disabled>
                    </sl-icon-button>
                    <sl-icon-button @click=${this.previousPage} name="chevron-left" label="Previous page" title="previous page" class="previous" disabled>
                    </sl-icon-button>
                </div>
                <div class="location" aria-current="page">Page
                    <strong class="current-page">${this.currentPage}</strong> of
                    <strong class="total-pages">${this.totalPages}</strong>
                </div>
                <div class="result-range">
                    ${this.label} ${this.getRangeStart()+1} - ${this.getRangeEnd()} of <strong class="total">
                    <sl-format-number value="${this.totalItems}"></sl-format-number></strong>
                </div>
                <div>
                    <sl-icon-button @click=${this.nextPage} name="chevron-right" label="Next page" title="next page" class="next">
                    </sl-icon-button>
                    <sl-icon-button @click=${this.lastPage} name="chevron-double-right" label="Last page" title="last page" class="end">
                    </sl-icon-button>
                </div>
            </div>
        `}};At.styles=[iu],Jt([De()],At.prototype,"currentPage",2),Jt([De()],At.prototype,"totalPages",2),Jt([De()],At.prototype,"totalItems",2),Jt([De()],At.prototype,"itemsPerPage",2),Jt([so(".home")],At.prototype,"homeButton",2),Jt([so(".previous")],At.prototype,"prevButton",2),Jt([so(".next")],At.prototype,"nextButton",2),Jt([so(".end")],At.prototype,"endButton",2),Jt([D()],At.prototype,"label",2),At=Jt([ue("pb33f-paginator")],At);const nu=yt`

    .paginator-values {
        overflow-y: auto;
        /* max-height: calc(100vh - 490px); */
        max-height: calc(100vh - 550px);
    }

 

    .paginator-values::-webkit-scrollbar {
        width: 8px;
    }

    .paginator-values::-webkit-scrollbar-track {
        background-color: var(--terminal-background);
    }

    .paginator-values::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background: var(--secondary-color-lowalpha);
        padding: var(--global-padding);
    }
    
    .no-values {
        height: 600px;
        width: 70%;
        margin: 0 auto;
        padding-top: 50px;
        text-align: center;
        font-size: 1.9em;
        color: var(--font-color-sub4);
        font-family: var(--font-stack-bold), monospace;
        overflow-y: hidden;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .error {
        color: var(--error-color);
    } 
    
    .no-values sl-icon {
        margin-bottom: 30px;
        font-size: 5em;
       
    }
   
`,lu={size:15,family:"BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"normal",style:"normal"},cu={size:10,family:"BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"normal",style:"normal"},du={size:12,family:"BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"normal",style:"normal"},pu={size:15,family:"BerkeleyMono-Bold, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"bold",style:"normal"},uu={size:25,family:"BerkeleyMono-Bold, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",weight:"bold",style:"normal",lineHeight:3};var hu=Object.defineProperty,gu=(e,t,o,r)=>{for(var i=void 0,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=a(t,o,i)||i);return i&&hu(t,o,i),i};class mu extends ft{constructor(){super(),this.currentTheme="dark",this._themeHandler=()=>{this.readColors(),this.currentTheme=Pr()}}readColors(){const t=getComputedStyle(this);this.primary=t.getPropertyValue("--primary-color").trim(),this.secondary=t.getPropertyValue("--secondary-color").trim(),this.tertiary=t.getPropertyValue("--tertiary-color").trim(),this.background=t.getPropertyValue("--background-color").trim(),this.error=t.getPropertyValue("--error-color").trim(),this.ok=t.getPropertyValue("--terminal-text").trim(),this.warn=t.getPropertyValue("--warn-color").trim(),this.color1=t.getPropertyValue("--chart-color1").trim(),this.color2=t.getPropertyValue("--chart-color2").trim(),this.color3=t.getPropertyValue("--chart-color3").trim(),this.color4=t.getPropertyValue("--chart-color4").trim(),this.color5=t.getPropertyValue("--chart-color5").trim()}firstUpdated(){this.readColors(),this.currentTheme=Pr(),this.font=lu,this.smallFont=cu,this.mediumFont=du,this.titleFont=uu,this.fontBold=pu,window.addEventListener(Re,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(Re,this._themeHandler)}}gu([De()],mu.prototype,"currentTheme");function Pr(){const e=document.documentElement.getAttribute("theme");return e==="light"?"light":e==="tektronix"?"tektronix":"dark"}var fu=Object.defineProperty,bu=Object.getOwnPropertyDescriptor,En=(e,t,o,r)=>{for(var i=r>1?void 0:r?bu(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&fu(t,o,i),i};let Zo=class extends ft{constructor(){super(),this.animationFrameId=null,this._currentTheme="dark",this._themeHandler=()=>{this._currentTheme=Pr()},this.sparkArray=[],this.gravity=.005,this.spawnRate=50,this.isError=!1,this.animating=!1}firstUpdated(){var t;this._currentTheme=Pr(),window.addEventListener(Re,this._themeHandler);const e=this.renderRoot.querySelector("canvas");if(e){this.canvas=e;const o=(t=this.canvas)==null?void 0:t.getContext("2d");o&&(this.ctx=o)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(Re,this._themeHandler)}startAnimation(){this.animating||(this.animationTimer=setInterval(()=>this.spawnSpark(),1e3/this.spawnRate),this.animating=!0,this.animateSparks())}stopAnimation(){this.animating=!1,clearInterval(this.animationTimer),this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.sparkArray=[],this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}getRandomBetween(e,t){return Math.random()*(t-e)+e}spawnSpark(){if(this.animating){let e;this._currentTheme==="light"?e=this.isError?Math.random()>.5?"rgb(60, 60, 60)":"rgb(120, 120, 120)":Math.random()>.5?"rgb(80, 80, 80)":"rgb(160, 160, 160)":this._currentTheme==="tektronix"?e=this.isError?Math.random()>.5?"rgb(102, 255, 102)":"rgb(34, 204, 34)":Math.random()>.5?"rgb(51, 255, 51)":"rgb(26, 153, 26)":e=this.isError?Math.random()>.5?"rgb(255, 60, 116)":"rgb(157, 26, 65)":Math.random()>.5?"rgb(248, 58, 255)":"rgb(98, 196, 255)",this.sparkArray.push({x:Math.random()*this.canvas.width,y:-2,size:1,color:e,velocityY:this.getRandomBetween(.05,.3),lifetime:150,initialLifetime:150,opacity:1})}}animateSparks(){var e,t,o;if(this.animating){(o=this.ctx)==null||o.clearRect(0,0,(e=this.canvas)==null?void 0:e.width,(t=this.canvas)==null?void 0:t.height),this.sparkArray=this.sparkArray.filter(r=>r.lifetime>0);for(let r of this.sparkArray)this.drawSpark(r),r.y+=r.velocityY,r.velocityY+=this.gravity,r.lifetime--,r.opacity=r.lifetime/r.initialLifetime;this.animationFrameId=requestAnimationFrame(()=>this.animateSparks())}}drawSpark(e){this.ctx.globalAlpha=e.opacity,this.ctx.fillStyle=e.color,/Safari/.test(navigator.userAgent)||(this.ctx.shadowColor=e.color,this.ctx.shadowBlur=8),this.ctx.fillRect(e.x,e.y,e.size,e.size),this.ctx.globalAlpha=1}render(){return tt`
            <canvas width="100%" height="100%"></canvas>`}};Zo.styles=yt`
        canvas {
            width: 100%;
            height: 100%;
            image-rendering: pixelated; /* Ensures pixelated appearance */
        }
    `,En([D({type:Boolean})],Zo.prototype,"isError",2),Zo=En([ue("pb33f-pixel-sparks")],Zo);function xg(e){return e}var vu=Object.defineProperty,yu=Object.getOwnPropertyDescriptor,Xt=(e,t,o,r)=>{for(var i=r>1?void 0:r?yu(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&vu(t,o,i),i};let kt=class extends ft{constructor(){super(),this.sparks=new Zo,this.currentPage=1,this.totalPages=1,this.totalItems=0,this.itemsPerPage=20,this.activeIndex=0,this.invalid=!1,this.hideSparks=!1,this.paginatorNavigator=new At,this.paginatorNavigator.currentPage=this.currentPage,this.paginatorNavigator.totalPages=this.totalPages,this.paginatorNavigator.totalItems=this.totalItems,this.paginatorNavigator.itemsPerPage=this.itemsPerPage,this.addEventListener(Nn,this.firstPage.bind(this)),this.addEventListener(Tn,this.lastPage.bind(this)),this.addEventListener(kn,this.nextPage.bind(this)),this.addEventListener(Dn,this.previousPage.bind(this))}nextPage(e){e.stopPropagation(),this.currentPage<this.totalPages&&this.currentPage++}lastPage(e){e.stopPropagation(),this.currentPage<this.totalPages&&(this.currentPage=this.totalPages)}firstPage(e){e.stopPropagation(),this.currentPage>1&&(this.currentPage=1)}setPage(e){this.currentPage=Math.ceil(e/this.itemsPerPage),this.activeIndex=e}previousPage(e){e.stopPropagation(),this.currentPage>1&&this.currentPage--}calcTotalPages(){return Math.ceil(this.totalItems/this.itemsPerPage)}willUpdate(){var e,t,o;this.totalItems=(e=this.values)==null?void 0:e.length,this.totalPages=this.calcTotalPages(),this.currentPage>this.totalPages&&(this.currentPage=Math.max(1,this.totalPages)),this.sparks.isError=this.invalid,this.paginatorNavigator.currentPage=this.currentPage,this.paginatorNavigator.totalItems=(t=this.values)==null?void 0:t.length,this.paginatorNavigator.itemsPerPage=this.itemsPerPage,this.paginatorNavigator.totalPages=this.totalPages,this.label&&(this.paginatorNavigator.label=this.label),this.renderValues=(o=this.values)==null?void 0:o.slice(this.paginatorNavigator.getRangeStart(),this.paginatorNavigator.getRangeEnd())}startSparks(){this.sparks.startAnimation()}stopSparks(){this.sparks.stopAnimation()}render(){var e;return((e=this.renderValues)==null?void 0:e.length)===0||!this.renderValues?this.hideSparks?tt`
                    <div class="no-values" style="position: relative">
                    </div>
                    `:tt`
                    <div class="no-values ${this.invalid?"error":""}" style="position: relative">
                        <div style="position: absolute; width: 100%; top: -50px; left: 0;">${this.sparks}</div>
                        <sl-icon name="prescription2"></sl-icon>
                        <br/>
                        ${this.invalid?"invalid / error":"healthy!"}
                    </div>
                `:tt`
            ${this.paginatorNavigator}
            <div class="paginator-values" part="values">
                ${this.renderValues}
            </div>
        `}};kt.styles=[nu],Xt([D({type:ft})],kt.prototype,"values",2),Xt([D({type:Number})],kt.prototype,"currentPage",2),Xt([D({type:Number})],kt.prototype,"totalPages",2),Xt([D({type:Number})],kt.prototype,"totalItems",2),Xt([D({type:Number})],kt.prototype,"itemsPerPage",2),Xt([D()],kt.prototype,"label",2),Xt([D()],kt.prototype,"activeIndex",2),Xt([D({type:Boolean})],kt.prototype,"invalid",2),Xt([D({type:Boolean})],kt.prototype,"hideSparks",2),kt=Xt([ue("pb33f-paginator-navigation")],kt);const wu=E`
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
        scroll-behavior: auto;
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
`,mo=E`
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
`;var Mu=Object.defineProperty,xu=Object.getOwnPropertyDescriptor,as=(e,t,o,r)=>{for(var i=r>1?void 0:r?xu(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Mu(t,o,i),i};const zn="pp-split-position",Lu=20;p.PpLayout=class extends Q{constructor(){super(...arguments),this.title="",this.splitPos=Lu}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const t=sessionStorage.getItem(zn);t&&(this.splitPos=parseFloat(t))}onReposition(t){const o=t.target.position;typeof o=="number"&&(this.splitPos=o,sessionStorage.setItem(zn,String(o)))}render(){return d`
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
    `}},p.PpLayout.styles=[wu,mo],as([k()],p.PpLayout.prototype,"title",2),as([k()],p.PpLayout.prototype,"splitPos",2),p.PpLayout=as([q("pp-layout")],p.PpLayout);const Cu=E`
    :host {
        display: block;
        padding: var(--global-padding);
        font-family: var(--font-stack), monospace;
    }

    .nav-home {
        display: block;
        padding: var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        border-radius: 0;
        color: var(--primary-color);
        text-decoration: none;
        margin-bottom: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .nav-home:hover {
        background: var(--primary-color-verylowalpha);
        text-decoration: none;
    }

    .nav-section {
        margin-bottom: var(--global-padding);
    }

    h4 {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--secondary-color);
        font-family: var(--font-stack-bold), monospace;
        margin: 0 0 var(--global-padding) 0;
        padding-bottom: var(--global-padding);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    .nav-models-section {
        margin-top: 0.75rem;
    }

    .nav-models-link {
        display: block;
        padding: var(--global-padding);
        color: var(--font-color-sub1);
        text-decoration: none;
    }

    .nav-models-link:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
        text-decoration: none;
    }
`;var Iu=Object.defineProperty,Au=Object.getOwnPropertyDescriptor,Fo=(e,t,o,r)=>{for(var i=r>1?void 0:r?Au(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Iu(t,o,i),i};p.PpNav=class extends Q{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.webhooks=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)||[]}catch{}const o=this.getAttribute("data-models");if(o)try{this.modelGroups=JSON.parse(o)||[]}catch{}const r=this.getAttribute("data-webhooks");if(r)try{this.webhooks=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return d`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?d`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(t=>d`<pp-nav-tag .tag=${t} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:y}
      ${this.webhooks.length?d`
            <div class="nav-section">
              <h4>Webhooks</h4>
              <pp-nav-tag
                .tag=${{name:"Webhooks",summary:"Webhooks",children:null,operations:this.webhooks,isNavOnly:!1}}
                .activeSlug=${this.activeSlug}
              ></pp-nav-tag>
            </div>
          `:y}
      ${this.modelGroups.length?d`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(t=>d`<pp-nav-model-group .group=${t} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:y}
    `}},p.PpNav.styles=Cu,Fo([k()],p.PpNav.prototype,"tags",2),Fo([k()],p.PpNav.prototype,"modelGroups",2),Fo([k()],p.PpNav.prototype,"webhooks",2),Fo([k()],p.PpNav.prototype,"activeSlug",2),p.PpNav=Fo([q("pp-nav")],p.PpNav);const ju=E`
    :host {
        display: block;
        margin: 0; 
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
        padding: var(--global-padding) 0 0 0;
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
        margin: 0 0 0 18px;
        padding: 0 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    li a {
        display: flex;
        align-items: baseline;
        gap: var(--global-padding);
        padding: var(--global-padding);
        border-radius: 0;
        color: var(--font-color);
        text-decoration: none;
        border-left: 2px solid var(--background-color);
        font-size: 0.9rem;
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
        font-family: var(--font-stack), monospace;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
    }

    pb33f-http-method {
        flex-shrink: 0;
        margin-left: auto;
    }

    /* global html[theme] override in printing-press.css cannot reach into shadow DOM,
       so replicate the monochrome override here via :host-context */
    :host-context(html[theme="light"]) pb33f-http-method,
    :host-context(html[theme="tektronix"]) pb33f-http-method {
        --http-get-color: var(--font-color);
        --http-post-color: var(--font-color);
        --http-put-color: var(--font-color);
        --http-delete-color: var(--font-color);
        --http-patch-color: var(--font-color);
        --http-options-color: var(--font-color);
        --http-head-color: var(--font-color);
        --http-trace-color: var(--font-color);
        --http-query-color: var(--font-color);
    }

    li a.active .op-title {
        font-family: var(--font-stack-bold), monospace;
    }
    
    .children {
        margin-left: 18px;
        margin-bottom: var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    .deprecated {
        text-decoration: line-through;
        opacity: 0.5;
    }
`;var Su=Object.defineProperty,Nu=Object.getOwnPropertyDescriptor,Rr=(e,t,o,r)=>{for(var i=r>1?void 0:r?Nu(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Su(t,o,i),i};function ns(e,t){var o,r;return t?!!((o=e.operations)!=null&&o.some(i=>i.slug===t)||(r=e.children)!=null&&r.some(i=>ns(i,t))):!1}p.PpNavTag=class extends Q{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("tag")||t.has("activeSlug"))&&ns(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,a;const{tag:t,activeSlug:o,open:r}=this,i=ns(t,o);return d`
            <div class="tag-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${r?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${t.summary||t.name}</span>
            </div>
            ${r?d`
                        <div class="tag-body">
                            ${(s=t.operations)!=null&&s.length?d`
                                        <ul>
                                            ${t.operations.map(n=>d`
                                                        <li>
                                                            <a href="operations/${n.slug}.html" class="${n.deprecated?"deprecated":""} ${n.slug===o?"active":""}">
                                                                <span class="op-title">${n.summary||n.path}</span>
                                                                <pb33f-http-method mode="nav-naked"
                                                                        method=${n.method}></pb33f-http-method>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:y}
                            ${(a=t.children)!=null&&a.length?d`
                                        <div class="children">
                                            ${t.children.map(n=>d`
                                                        <pp-nav-tag .tag=${n}
                                                                    .activeSlug=${o}></pp-nav-tag>`)}
                                        </div>
                                    `:y}
                        </div>
                    `:y}
        `}},p.PpNavTag.styles=ju,Rr([h({type:Object})],p.PpNavTag.prototype,"tag",2),Rr([h()],p.PpNavTag.prototype,"activeSlug",2),Rr([k()],p.PpNavTag.prototype,"open",2),p.PpNavTag=Rr([q("pp-nav-tag")],p.PpNavTag);const Tu=E`
    :host {
        display: block;
        margin: 0;
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
        padding: 0 0 var(--global-padding) 0;
    }

    ul {
        list-style: none;
        margin: 0 0 0 18px;
        padding: 0 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    li a {
        display: flex;
        min-height: 22px;
        align-items: center;
        gap: 0 var(--global-padding) 0 var(--global-padding);
        padding: var(--global-padding);
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
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
    }

    li a.active .model-name {
        font-family: var(--font-stack-bold), monospace;
    }
`;var ku=Object.defineProperty,Du=Object.getOwnPropertyDescriptor,Ur=(e,t,o,r)=>{for(var i=r>1?void 0:r?Du(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&ku(t,o,i),i};function $n(e,t){var o;return t?((o=e.models)==null?void 0:o.some(r=>r.typeSlug+"/"+r.slug===t))??!1:!1}p.PpNavModelGroup=class extends Q{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("group")||t.has("activeSlug"))&&$n(this.group,this.activeSlug)&&(this.open=!0)}updated(t){(t.has("activeSlug")||t.has("group"))&&this.open&&this.activeSlug&&requestAnimationFrame(()=>{const o=this.renderRoot.querySelector("a.active");o==null||o.scrollIntoView({block:"center",behavior:"auto"})})}toggle(){this.open=!this.open}render(){var s;const{group:t,activeSlug:o,open:r}=this,i=$n(t,o);return d`
            <div class="group-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${r?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${t.name}</span>
            </div>
            ${r&&((s=t.models)!=null&&s.length)?d`
                    <div class="group-body">
                        <ul>
                            ${t.models.map(a=>{const n=a.typeSlug+"/"+a.slug;return d`
                                        <li>
                                            <a href="models/${a.typeSlug}/${a.slug}.html"
                                               class="${n===o?"active":""}">
                                                <span class="model-name">${a.name}</span>
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:y}
        `}},p.PpNavModelGroup.styles=Tu,Ur([h({type:Object})],p.PpNavModelGroup.prototype,"group",2),Ur([h()],p.PpNavModelGroup.prototype,"activeSlug",2),Ur([k()],p.PpNavModelGroup.prototype,"open",2),p.PpNavModelGroup=Ur([q("pp-nav-model-group")],p.PpNavModelGroup);const Eu=E`
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
`;var zu=Object.defineProperty,$u=Object.getOwnPropertyDescriptor,Go=(e,t,o,r)=>{for(var i=r>1?void 0:r?$u(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&zu(t,o,i),i};p.PpNavOperation=class extends Q{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return d`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},p.PpNavOperation.styles=Eu,Go([h()],p.PpNavOperation.prototype,"method",2),Go([h()],p.PpNavOperation.prototype,"path",2),Go([h()],p.PpNavOperation.prototype,"slug",2),Go([h({type:Boolean})],p.PpNavOperation.prototype,"deprecated",2),p.PpNavOperation=Go([q("pp-nav-operation")],p.PpNavOperation);const Yr=E`
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

    .enum-section {
        grid-column: 1 / -1;
        margin-top: 0.3rem;
    }

    .enum-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.25rem;
    }

    .enum-value {
        color: var(--warn-400);
        font-family: var(--font-stack);
        padding: 0.1rem 0.4rem;
        border: 1px solid var(--border-color-lowalpha);
        white-space: nowrap;
    }
`,Br=E`
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
`,_u=E`
    :host {
        display: block;
        margin-top: 0;
        padding: var(--global-padding);
        border: 1px dotted var(--hrcolor);
    }

    .parameter, .extensions {
        display: grid;
        grid-template-columns: 200px 200px 150px 1fr;
        gap: 0 20px;
        padding: var(--global-padding) var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }
    
    pp-raw-viewer-btn { 
        float: right;
    }

    .parameter:first-child {
        border-top: none;
    }

    .extensions {
        border-top: none;
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
        padding-top: 1px;
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
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.8em;
    }

    .param-extras {
        grid-column: 1 / -1;
        padding-top: var(--global-padding);
    }

    .param-extensions {
        grid-column: 1 / -1;
        padding-top: var(--global-padding);
    }
    
    .param-desc-col h4 {
        margin-top: 0;
        border-bottom: 1px dotted var(--hrcolor);
        width: 100%;
        margin-bottom: var(--global-padding-double);
        padding-bottom: var(--global-padding);
    }
`,Ou={schemas:"schemas",responses:"responses",parameters:"parameters",requestBodies:"request-bodies",headers:"headers",securitySchemes:"security",examples:"examples",links:"links",callbacks:"callbacks",pathItems:"path-items"};function Pu(e){let t=e.replace(/([a-z0-9])([A-Z])/g,"$1-$2");return t=t.toLowerCase(),t=t.replace(/[/]/g,"-").replace(/[{}_.]/g,"-").replace(/ /g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-{2,}/g,"-"),t=t.replace(/^-|-$/g,""),t||"unnamed"}function He(e){if(!e||!e.startsWith("#/components/"))return null;const t=e.replace("#/components/","").split("/");if(t.length!==2)return null;const[o,r]=t,i=Ou[o];return i?{name:r,href:`models/${i}/${Pu(r)}.html`}:null}function _n(e,t){if(!e)return[];const o=[];return t!=null&&t.includeExample&&(e.example!==void 0&&o.push({label:"example",value:JSON.stringify(e.example)}),e.default!==void 0&&o.push({label:"default",value:JSON.stringify(e.default)})),e.minimum!==void 0&&o.push({label:"min",value:e.minimum}),e.maximum!==void 0&&o.push({label:"max",value:e.maximum}),e.exclusiveMinimum!==void 0&&o.push({label:"exclusiveMin",value:e.exclusiveMinimum}),e.exclusiveMaximum!==void 0&&o.push({label:"exclusiveMax",value:e.exclusiveMaximum}),e.minLength!==void 0&&o.push({label:"minLength",value:e.minLength}),e.maxLength!==void 0&&o.push({label:"maxLength",value:e.maxLength}),e.minItems!==void 0&&o.push({label:"minItems",value:e.minItems}),e.maxItems!==void 0&&o.push({label:"maxItems",value:e.maxItems}),e.uniqueItems&&o.push({label:"uniqueItems",value:"true"}),e.pattern&&o.push({label:"pattern",value:e.pattern,isCode:!0}),e.multipleOf!==void 0&&o.push({label:"multipleOf",value:e.multipleOf}),o}function Hr(e){var t;if(!e)return"";if(e.type==="array"&&e.items)return`Array<${e.items.type||((t=e.items.$ref)==null?void 0:t.split("/").pop())||"any"}>`;if(e.type){let o=Array.isArray(e.type)?e.type.join(" | "):e.type;return e.format&&(o+=` (${e.format})`),o}return e.oneOf?"oneOf":e.anyOf?"anyOf":e.allOf?"allOf":e.$ref?e.$ref.split("/").pop()??"":""}function Dt(e,t=!1){const o=d`<a class="ref-link" href="models/${e.typeSlug}/${e.slug}.html">\u279c ${e.name}</a>`;return t?d`<pp-ref-popover registry-key="${e.componentType}/${e.name}">${o}</pp-ref-popover>`:o}function Ru(e,t){var i,s;if(!e)return y;if(e.allOf&&Array.isArray(e.allOf)){const a=[];let n=!0;for(const l of e.allOf){if(!l.$ref){n=!1;continue}const c=He(l.$ref);c&&a.push({ref:l.$ref,link:c})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">
                ${a.map((l,c)=>d`
                    ${c>0?d` <span class="composition-separator">+</span> `:y}
                    ${t(l.ref,l.link)}
                `)}
            </span>`}if(e.type==="array"&&((i=e.items)!=null&&i.allOf)&&Array.isArray(e.items.allOf)){const a=[];let n=!0;for(const l of e.items.allOf){if(!l.$ref){n=!1;continue}const c=He(l.$ref);c&&a.push({ref:l.$ref,link:c})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">Array&lt;${a.map((l,c)=>d`
                ${c>0?d` <span class="composition-separator">+</span> `:y}
                ${t(l.ref,l.link)}
            `)}&gt;</span>`}if(e.type==="array"&&((s=e.items)!=null&&s.$ref)){const a=He(e.items.$ref);if(a)return d`<span class="prop-type prop-type-link">Array&lt;${t(e.items.$ref,a)}&gt;</span>`}const o=e.oneOf??e.anyOf;if(o&&Array.isArray(o)){const a=[];let n=!0;for(const c of o){if(!c.$ref){n=!1;break}const g=He(c.$ref);g&&a.push({ref:c.$ref,link:g})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">
                ${a.map((c,g)=>d`
                    ${g>0?d` <span class="composition-separator">|</span> `:y}
                    ${t(c.ref,c.link)}
                `)}
            </span>`;const l=o.map(c=>c.title).filter(Boolean);if(l.length===o.length)return d`<span class="prop-type">${l.join(" | ")}</span>`}if(e.$ref){const a=He(e.$ref);if(a)return d`<span class="prop-type prop-type-link">${t(e.$ref,a)}</span>`}const r=Hr(e);return r?d`<span class="prop-type">${r}</span>`:y}function Vo(e,t){var i,s;if(!e)return y;const o=_n(e,{includeExample:t==null?void 0:t.includeExample});if(!o.length&&!((i=e.enum)!=null&&i.length))return y;const r=(t==null?void 0:t.labelSuffix)??"";return d`
        <div class="constraints">
            ${o.map(a=>d`
                <span class="constraint-label">${a.label}${r}</span>
                <span class="constraint-value">${a.isCode?d`<code>${a.value}</code>`:a.value}</span>
            `)}
            ${(s=e.enum)!=null&&s.length?d`
                <div class="enum-section">
                    <span class="constraint-label">enum${r}</span>
                    <div class="enum-grid">${e.enum.map(a=>d`<span class="enum-value">${JSON.stringify(a)}</span>`)}</div>
                </div>
            `:y}
        </div>
    `}const Uu=E`
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
        width: 650px;
        max-height: 400px;
        overflow-y: auto;
        overscroll-behavior: contain;
        background: var(--background-color);
        border: 1px dashed var(--secondary-color);
        padding: var(--global-padding);
        text-align: left;
    }

    .popover-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: var(--global-padding);
    }

    .popover-header pp-icon-title {
        --pp-icon-title-color: var(--font-color);
        --icon-title-icon-offset: 0.15em;
    }


    .popover-body {
        border-top: 1px dotted var(--hrcolor);
        padding-top: var(--global-padding);
    }

    .popover-example {
        border-top: 1px dotted var(--hrcolor);
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
    }

    .example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding);
        text-align: left;
    }
`,On=new Map;let Pn=!1;function Yu(){if(Pn)return;Pn=!0;const e=document.getElementById("pp-schema-registry");if(e!=null&&e.textContent)try{const t=JSON.parse(e.textContent);for(const[o,r]of Object.entries(t))On.set(o,r)}catch{}}function Rn(e){return Yu(),On.get(e)}function ls(e){if(!(e!=null&&e.startsWith("#/components/")))return;const t=e.replace("#/components/","");return Rn(t)}var Bu=E`
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
`,mt=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=e=>{this.open&&e.key==="Escape"&&(e.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=e=>{var t;if(e.key==="Escape"&&this.open&&!this.closeWatcher){e.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(e.key==="Tab"){if(this.open&&((t=document.activeElement)==null?void 0:t.tagName.toLowerCase())==="sl-menu-item"){e.preventDefault(),this.hide(),this.focusOnTrigger();return}const o=(r,i)=>{if(!r)return null;const s=r.closest(i);if(s)return s;const a=r.getRootNode();return a instanceof ShadowRoot?o(a.host,i):null};setTimeout(()=>{var r;const i=((r=this.containingElement)==null?void 0:r.getRootNode())instanceof ShadowRoot?wa():document.activeElement;(!this.containingElement||o(i,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=e=>{const t=e.composedPath();this.containingElement&&!t.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=e=>{const t=e.target;!this.stayOpenOnSelect&&t.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){const e=this.trigger.assignedElements({flatten:!0})[0];typeof(e==null?void 0:e.focus)=="function"&&e.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(e=>e.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(e){if([" ","Enter"].includes(e.key)){e.preventDefault(),this.handleTriggerClick();return}const t=this.getMenu();if(t){const o=t.getAllItems(),r=o[0],i=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(e.key)&&(e.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(e.key==="ArrowDown"||e.key==="Home")&&(t.setCurrentItem(r),r.focus()),(e.key==="ArrowUp"||e.key==="End")&&(t.setCurrentItem(i),i.focus())}))}}handleTriggerKeyUp(e){e.key===" "&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){const t=this.trigger.assignedElements({flatten:!0}).find(r=>td(r).start);let o;if(t){switch(t.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=t.button;break;default:o=t}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,Zt(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Zt(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var e;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var e;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await vt(this),this.panel.hidden=!1,this.popup.active=!0;const{keyframes:e,options:t}=nt(this,"dropdown.show",{dir:this.localize.dir()});await gt(this.popup.popup,e,t),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await vt(this);const{keyframes:e,options:t}=nt(this,"dropdown.hide",{dir:this.localize.dir()});await gt(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return d`
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
        sync=${O(this.sync?this.sync:void 0)}
        class=${rt({dropdown:!0,"dropdown--open":this.open})}
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
    `}};mt.styles=[et,Bu],mt.dependencies={"sl-popup":W},u([_(".dropdown")],mt.prototype,"popup",2),u([_(".dropdown__trigger")],mt.prototype,"trigger",2),u([_(".dropdown__panel")],mt.prototype,"panel",2),u([h({type:Boolean,reflect:!0})],mt.prototype,"open",2),u([h({reflect:!0})],mt.prototype,"placement",2),u([h({type:Boolean,reflect:!0})],mt.prototype,"disabled",2),u([h({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],mt.prototype,"stayOpenOnSelect",2),u([h({attribute:!1})],mt.prototype,"containingElement",2),u([h({type:Number})],mt.prototype,"distance",2),u([h({type:Number})],mt.prototype,"skidding",2),u([h({type:Boolean})],mt.prototype,"hoist",2),u([h({reflect:!0})],mt.prototype,"sync",2),u([G("open",{waitUntilFirstUpdate:!0})],mt.prototype,"handleOpenChange",1),K("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}}),K("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}}),mt.define("sl-dropdown");var Hu=E`
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
`,cs=class extends V{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(e){const t=["menuitem","menuitemcheckbox"],o=e.composedPath(),r=o.find(n=>{var l;return t.includes(((l=n==null?void 0:n.getAttribute)==null?void 0:l.call(n,"role"))||"")});if(!r||o.find(n=>{var l;return((l=n==null?void 0:n.getAttribute)==null?void 0:l.call(n,"role"))==="menu"})!==this)return;const a=r;a.type==="checkbox"&&(a.checked=!a.checked),this.emit("sl-select",{detail:{item:a}})}handleKeyDown(e){if(e.key==="Enter"||e.key===" "){const t=this.getCurrentItem();e.preventDefault(),e.stopPropagation(),t==null||t.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(e.key)){const t=this.getAllItems(),o=this.getCurrentItem();let r=o?t.indexOf(o):0;t.length>0&&(e.preventDefault(),e.stopPropagation(),e.key==="ArrowDown"?r++:e.key==="ArrowUp"?r--:e.key==="Home"?r=0:e.key==="End"&&(r=t.length-1),r<0&&(r=t.length-1),r>t.length-1&&(r=0),this.setCurrentItem(t[r]),t[r].focus())}}handleMouseDown(e){const t=e.target;this.isMenuItem(t)&&this.setCurrentItem(t)}handleSlotChange(){const e=this.getAllItems();e.length>0&&this.setCurrentItem(e[0])}isMenuItem(e){var t;return e.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((t=e.getAttribute("role"))!=null?t:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>!(e.inert||!this.isMenuItem(e)))}getCurrentItem(){return this.getAllItems().find(e=>e.getAttribute("tabindex")==="0")}setCurrentItem(e){this.getAllItems().forEach(o=>{o.setAttribute("tabindex",o===e?"0":"-1")})}render(){return d`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};cs.styles=[et,Hu],u([_("slot")],cs.prototype,"defaultSlot",2),cs.define("sl-menu");var Qu=E`
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
 */const Jo=(e,t)=>{var r;const o=e._$AN;if(o===void 0)return!1;for(const i of o)(r=i._$AO)==null||r.call(i,t,!1),Jo(i,t);return!0},Qr=e=>{let t,o;do{if((t=e._$AM)===void 0)break;o=t._$AN,o.delete(e),e=t}while((o==null?void 0:o.size)===0)},Un=e=>{for(let t;t=e._$AM;e=t){let o=t._$AN;if(o===void 0)t._$AN=o=new Set;else if(o.has(e))break;o.add(e),Fu(t)}};function Wu(e){this._$AN!==void 0?(Qr(this),this._$AM=e,Un(this)):this._$AM=e}function Zu(e,t=!1,o=0){const r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let s=o;s<r.length;s++)Jo(r[s],!1),Qr(r[s]);else r!=null&&(Jo(r,!1),Qr(r));else Jo(this,e)}const Fu=e=>{e.type==te.CHILD&&(e._$AP??(e._$AP=Zu),e._$AQ??(e._$AQ=Wu))};class Gu extends cr{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,o,r){super._$AT(t,o,r),Un(this),this.isConnected=t._$AU}_$AO(t,o=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(i=this.disconnected)==null||i.call(this)),o&&(Jo(this,t),Qr(this))}setValue(t){if(Qs(this._$Ct))this._$Ct._$AI(t,this);else{const o=[...this._$Ct._$AH];o[this._$Ci]=t,this._$Ct._$AI(o,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vu=()=>new Ju;class Ju{}const ds=new WeakMap,Xu=lr(class extends Gu{render(e){return y}update(e,[t]){var r;const o=t!==this.G;return o&&this.G!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.G=t,this.ht=(r=e.options)==null?void 0:r.host,this.rt(this.ct=e.element)),y}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let o=ds.get(t);o===void 0&&(o=new WeakMap,ds.set(t,o)),o.get(this.G)!==void 0&&this.G.call(this.ht,void 0),o.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){var e,t;return typeof this.G=="function"?(e=ds.get(this.ht??globalThis))==null?void 0:e.get(this.G):(t=this.G)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var qu=class{constructor(e,t){this.popupRef=Vu(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=o=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${o.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${o.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=o=>{switch(o.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":o.target!==this.host&&(o.preventDefault(),o.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(o);break}},this.handleClick=o=>{var r;o.target===this.host?(o.preventDefault(),o.stopPropagation()):o.target instanceof Element&&(o.target.tagName==="sl-menu-item"||(r=o.target.role)!=null&&r.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=o=>{o.relatedTarget&&o.relatedTarget instanceof Element&&this.host.contains(o.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=o=>{o.stopPropagation()},this.handlePopupReposition=()=>{const o=this.host.renderRoot.querySelector("slot[name='submenu']"),r=o==null?void 0:o.assignedElements({flatten:!0}).filter(c=>c.localName==="sl-menu")[0],i=getComputedStyle(this.host).direction==="rtl";if(!r)return;const{left:s,top:a,width:n,height:l}=r.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${i?s+n:s}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${a}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${i?s+n:s}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${a+l}px`)},(this.host=e).addController(this),this.hasSlotController=t}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(e){const t=this.host.renderRoot.querySelector("slot[name='submenu']");if(!t){console.error("Cannot activate a submenu if no corresponding menuitem can be found.",this);return}let o=null;for(const r of t.assignedElements())if(o=r.querySelectorAll("sl-menu-item, [role^='menuitem']"),o.length!==0)break;if(!(!o||o.length===0)){o[0].setAttribute("tabindex","0");for(let r=1;r!==o.length;++r)o[r].setAttribute("tabindex","-1");this.popupRef.value&&(e.preventDefault(),e.stopPropagation(),this.popupRef.value.active?o[0]instanceof HTMLElement&&o[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{o[0]instanceof HTMLElement&&o[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(e){this.popupRef.value&&this.popupRef.value.active!==e&&(this.popupRef.value.active=e,this.host.requestUpdate())}enableSubmenu(e=!0){e?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var e;if(!((e=this.host.parentElement)!=null&&e.computedStyleMap))return;const t=this.host.parentElement.computedStyleMap(),r=["padding-top","border-top-width","margin-top"].reduce((i,s)=>{var a;const n=(a=t.get(s))!=null?a:new CSSUnitValue(0,"px"),c=(n instanceof CSSUnitValue?n:new CSSUnitValue(0,"px")).to("px");return i-c.value},0);this.skidding=r}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){const e=getComputedStyle(this.host).direction==="rtl";return this.isConnected?d`
      <sl-popup
        ${Xu(this.popupRef)}
        placement=${e?"left-start":"right-start"}
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
    `:d` <slot name="submenu" hidden></slot> `}},jt=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new oo(this,"submenu"),this.submenuController=new qu(this,this.hasSlotController),this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleMouseOver=e=>{this.focus(),e.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){const e=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=e;return}e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return sd(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){const e=this.localize.dir()==="rtl",t=this.submenuController.isExpanded();return d`
      <div
        id="anchor"
        part="base"
        class=${rt({"menu-item":!0,"menu-item--rtl":e,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":t})}
        ?aria-haspopup="${this.isSubmenu()}"
        ?aria-expanded="${!!t}"
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <sl-icon name=${e?"chevron-left":"chevron-right"} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading?d` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:""}
      </div>
    `}};jt.styles=[et,Qu],jt.dependencies={"sl-icon":ut,"sl-popup":W,"sl-spinner":Mr},u([_("slot:not([name])")],jt.prototype,"defaultSlot",2),u([_(".menu-item")],jt.prototype,"menuItem",2),u([h()],jt.prototype,"type",2),u([h({type:Boolean,reflect:!0})],jt.prototype,"checked",2),u([h()],jt.prototype,"value",2),u([h({type:Boolean,reflect:!0})],jt.prototype,"loading",2),u([h({type:Boolean,reflect:!0})],jt.prototype,"disabled",2),u([G("checked")],jt.prototype,"handleCheckedChange",1),u([G("disabled")],jt.prototype,"handleDisabledChange",1),u([G("type")],jt.prototype,"handleTypeChange",1),jt.define("sl-menu-item");var Ku=E`
  :host {
    --indicator-color: var(--sl-color-primary-600);
    --track-color: var(--sl-color-neutral-200);
    --track-width: 2px;

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group__indicator {
    position: absolute;
    transition:
      var(--sl-transition-fast) translate ease,
      var(--sl-transition-fast) width ease;
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--sl-spacing-x-large);
  }

  .tab-group--has-scroll-controls .tab-group__scroll-button--start--hidden,
  .tab-group--has-scroll-controls .tab-group__scroll-button--end--hidden {
    visibility: hidden;
  }

  .tab-group__body {
    display: block;
    overflow: auto;
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: var(--sl-spacing-x-large);
  }

  .tab-group__scroll-button--start {
    left: 0;
  }

  .tab-group__scroll-button--end {
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--start {
    left: auto;
    right: 0;
  }

  .tab-group--rtl .tab-group__scroll-button--end {
    left: 0;
    right: auto;
  }

  /*
   * Top
   */

  .tab-group--top {
    flex-direction: column;
  }

  .tab-group--top .tab-group__nav-container {
    order: 1;
  }

  .tab-group--top .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--top .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--top .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--track-width) var(--track-color);
  }

  .tab-group--top .tab-group__indicator {
    bottom: calc(-1 * var(--track-width));
    border-bottom: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--top .tab-group__body {
    order: 2;
  }

  .tab-group--top ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Bottom
   */

  .tab-group--bottom {
    flex-direction: column;
  }

  .tab-group--bottom .tab-group__nav-container {
    order: 2;
  }

  .tab-group--bottom .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group--bottom .tab-group__nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group--bottom .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--track-width) var(--track-color);
  }

  .tab-group--bottom .tab-group__indicator {
    top: calc(-1 * var(--track-width));
    border-top: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--bottom .tab-group__body {
    order: 1;
  }

  .tab-group--bottom ::slotted(sl-tab-panel) {
    --padding: var(--sl-spacing-medium) 0;
  }

  /*
   * Start
   */

  .tab-group--start {
    flex-direction: row;
  }

  .tab-group--start .tab-group__nav-container {
    order: 1;
  }

  .tab-group--start .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--track-width) var(--track-color);
  }

  .tab-group--start .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    border-right: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--start.tab-group--rtl .tab-group__indicator {
    right: auto;
    left: calc(-1 * var(--track-width));
  }

  .tab-group--start .tab-group__body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group--start ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }

  /*
   * End
   */

  .tab-group--end {
    flex-direction: row;
  }

  .tab-group--end .tab-group__nav-container {
    order: 2;
  }

  .tab-group--end .tab-group__tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-left: solid var(--track-width) var(--track-color);
  }

  .tab-group--end .tab-group__indicator {
    left: calc(-1 * var(--track-width));
    border-inline-start: solid var(--track-width) var(--indicator-color);
  }

  .tab-group--end.tab-group--rtl .tab-group__indicator {
    right: calc(-1 * var(--track-width));
    left: auto;
  }

  .tab-group--end .tab-group__body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group--end ::slotted(sl-tab-panel) {
    --padding: 0 var(--sl-spacing-medium);
  }
`,th=E`
  :host {
    display: contents;
  }
`,Wr=class extends V{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>{this.emit("sl-resize",{detail:{entries:e}})}),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){const e=this.shadowRoot.querySelector("slot");if(e!==null){const t=e.assignedElements({flatten:!0});this.observedElements.forEach(o=>this.resizeObserver.unobserve(o)),this.observedElements=[],t.forEach(o=>{this.resizeObserver.observe(o),this.observedElements.push(o)})}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return d` <slot @slotchange=${this.handleSlotChange}></slot> `}};Wr.styles=[et,th],u([h({type:Boolean,reflect:!0})],Wr.prototype,"disabled",2),u([G("disabled",{waitUntilFirstUpdate:!0})],Wr.prototype,"handleDisabledChange",1);var dt=class extends V{constructor(){super(...arguments),this.tabs=[],this.focusableTabs=[],this.panels=[],this.localize=new ht(this),this.hasScrollControls=!1,this.shouldHideScrollStartButton=!1,this.shouldHideScrollEndButton=!1,this.placement="top",this.activation="auto",this.noScrollControls=!1,this.fixedScrollControls=!1,this.scrollOffset=1}connectedCallback(){const e=Promise.all([customElements.whenDefined("sl-tab"),customElements.whenDefined("sl-tab-panel")]);super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(t=>{const o=t.filter(({target:r})=>{if(r===this)return!0;if(r.closest("sl-tab-group")!==this)return!1;const i=r.tagName.toLowerCase();return i==="sl-tab"||i==="sl-tab-panel"});if(o.length!==0){if(o.some(r=>!["aria-labelledby","aria-controls"].includes(r.attributeName))&&setTimeout(()=>this.setAriaLabels()),o.some(r=>r.attributeName==="disabled"))this.syncTabsAndPanels();else if(o.some(r=>r.attributeName==="active")){const i=o.filter(s=>s.attributeName==="active"&&s.target.tagName.toLowerCase()==="sl-tab").map(s=>s.target).find(s=>s.active);i&&this.setActiveTab(i)}}}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,attributeFilter:["active","disabled","name","panel"],childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),e.then(()=>{new IntersectionObserver((o,r)=>{var i;o[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab((i=this.getActiveTab())!=null?i:this.tabs[0],{emitEvents:!1}),r.unobserve(o[0].target))}).observe(this.tabGroup)})})}disconnectedCallback(){var e,t;super.disconnectedCallback(),(e=this.mutationObserver)==null||e.disconnect(),this.nav&&((t=this.resizeObserver)==null||t.unobserve(this.nav))}getAllTabs(){return this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()}getAllPanels(){return[...this.body.assignedElements()].filter(e=>e.tagName.toLowerCase()==="sl-tab-panel")}getActiveTab(){return this.tabs.find(e=>e.active)}handleClick(e){const o=e.target.closest("sl-tab");(o==null?void 0:o.closest("sl-tab-group"))===this&&o!==null&&this.setActiveTab(o,{scrollBehavior:"smooth"})}handleKeyDown(e){const o=e.target.closest("sl-tab");if((o==null?void 0:o.closest("sl-tab-group"))===this&&(["Enter"," "].includes(e.key)&&o!==null&&(this.setActiveTab(o,{scrollBehavior:"smooth"}),e.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))){const i=this.tabs.find(n=>n.matches(":focus")),s=this.localize.dir()==="rtl";let a=null;if((i==null?void 0:i.tagName.toLowerCase())==="sl-tab"){if(e.key==="Home")a=this.focusableTabs[0];else if(e.key==="End")a=this.focusableTabs[this.focusableTabs.length-1];else if(["top","bottom"].includes(this.placement)&&e.key===(s?"ArrowRight":"ArrowLeft")||["start","end"].includes(this.placement)&&e.key==="ArrowUp"){const n=this.tabs.findIndex(l=>l===i);a=this.findNextFocusableTab(n,"backward")}else if(["top","bottom"].includes(this.placement)&&e.key===(s?"ArrowLeft":"ArrowRight")||["start","end"].includes(this.placement)&&e.key==="ArrowDown"){const n=this.tabs.findIndex(l=>l===i);a=this.findNextFocusableTab(n,"forward")}if(!a)return;a.tabIndex=0,a.focus({preventScroll:!0}),this.activation==="auto"?this.setActiveTab(a,{scrollBehavior:"smooth"}):this.tabs.forEach(n=>{n.tabIndex=n===a?0:-1}),["top","bottom"].includes(this.placement)&&Ca(a,this.nav,"horizontal"),e.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:"smooth"})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:"smooth"})}setActiveTab(e,t){if(t=Kt({emitEvents:!0,scrollBehavior:"auto"},t),e!==this.activeTab&&!e.disabled){const o=this.activeTab;this.activeTab=e,this.tabs.forEach(r=>{r.active=r===this.activeTab,r.tabIndex=r===this.activeTab?0:-1}),this.panels.forEach(r=>{var i;return r.active=r.name===((i=this.activeTab)==null?void 0:i.panel)}),this.syncIndicator(),["top","bottom"].includes(this.placement)&&Ca(this.activeTab,this.nav,"horizontal",t.scrollBehavior),t.emitEvents&&(o&&this.emit("sl-tab-hide",{detail:{name:o.panel}}),this.emit("sl-tab-show",{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(e=>{const t=this.panels.find(o=>o.name===e.panel);t&&(e.setAttribute("aria-controls",t.getAttribute("id")),t.setAttribute("aria-labelledby",e.getAttribute("id")))})}repositionIndicator(){const e=this.getActiveTab();if(!e)return;const t=e.clientWidth,o=e.clientHeight,r=this.localize.dir()==="rtl",i=this.getAllTabs(),a=i.slice(0,i.indexOf(e)).reduce((n,l)=>({left:n.left+l.clientWidth,top:n.top+l.clientHeight}),{left:0,top:0});switch(this.placement){case"top":case"bottom":this.indicator.style.width=`${t}px`,this.indicator.style.height="auto",this.indicator.style.translate=r?`${-1*a.left}px`:`${a.left}px`;break;case"start":case"end":this.indicator.style.width="auto",this.indicator.style.height=`${o}px`,this.indicator.style.translate=`0 ${a.top}px`;break}}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.focusableTabs=this.tabs.filter(e=>!e.disabled),this.panels=this.getAllPanels(),this.syncIndicator(),this.updateComplete.then(()=>this.updateScrollControls())}findNextFocusableTab(e,t){let o=null;const r=t==="forward"?1:-1;let i=e+r;for(;e<this.tabs.length;){if(o=this.tabs[i]||null,o===null){t==="forward"?o=this.focusableTabs[0]:o=this.focusableTabs[this.focusableTabs.length-1];break}if(!o.disabled)break;i+=r}return o}updateScrollButtons(){this.hasScrollControls&&!this.fixedScrollControls&&(this.shouldHideScrollStartButton=this.scrollFromStart()<=this.scrollOffset,this.shouldHideScrollEndButton=this.isScrolledToEnd())}isScrolledToEnd(){return this.scrollFromStart()+this.nav.clientWidth>=this.nav.scrollWidth-this.scrollOffset}scrollFromStart(){return this.localize.dir()==="rtl"?-this.nav.scrollLeft:this.nav.scrollLeft}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=["top","bottom"].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth+1,this.updateScrollButtons()}syncIndicator(){this.getActiveTab()?(this.indicator.style.display="block",this.repositionIndicator()):this.indicator.style.display="none"}show(e){const t=this.tabs.find(o=>o.panel===e);t&&this.setActiveTab(t,{scrollBehavior:"smooth"})}render(){const e=this.localize.dir()==="rtl";return d`
      <div
        part="base"
        class=${rt({"tab-group":!0,"tab-group--top":this.placement==="top","tab-group--bottom":this.placement==="bottom","tab-group--start":this.placement==="start","tab-group--end":this.placement==="end","tab-group--rtl":this.localize.dir()==="rtl","tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?d`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${rt({"tab-group__scroll-button":!0,"tab-group__scroll-button--start":!0,"tab-group__scroll-button--start--hidden":this.shouldHideScrollStartButton})}
                  name=${e?"chevron-right":"chevron-left"}
                  library="system"
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term("scrollToStart")}
                  @click=${this.handleScrollToStart}
                ></sl-icon-button>
              `:""}

          <div class="tab-group__nav" @scrollend=${this.updateScrollButtons}>
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <sl-resize-observer @sl-resize=${this.syncIndicator}>
                <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
              </sl-resize-observer>
            </div>
          </div>

          ${this.hasScrollControls?d`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class=${rt({"tab-group__scroll-button":!0,"tab-group__scroll-button--end":!0,"tab-group__scroll-button--end--hidden":this.shouldHideScrollEndButton})}
                  name=${e?"chevron-left":"chevron-right"}
                  library="system"
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term("scrollToEnd")}
                  @click=${this.handleScrollToEnd}
                ></sl-icon-button>
              `:""}
        </div>

        <slot part="body" class="tab-group__body" @slotchange=${this.syncTabsAndPanels}></slot>
      </div>
    `}};dt.styles=[et,Ku],dt.dependencies={"sl-icon-button":at,"sl-resize-observer":Wr},u([_(".tab-group")],dt.prototype,"tabGroup",2),u([_(".tab-group__body")],dt.prototype,"body",2),u([_(".tab-group__nav")],dt.prototype,"nav",2),u([_(".tab-group__indicator")],dt.prototype,"indicator",2),u([k()],dt.prototype,"hasScrollControls",2),u([k()],dt.prototype,"shouldHideScrollStartButton",2),u([k()],dt.prototype,"shouldHideScrollEndButton",2),u([h()],dt.prototype,"placement",2),u([h()],dt.prototype,"activation",2),u([h({attribute:"no-scroll-controls",type:Boolean})],dt.prototype,"noScrollControls",2),u([h({attribute:"fixed-scroll-controls",type:Boolean})],dt.prototype,"fixedScrollControls",2),u([Bl({passive:!0})],dt.prototype,"updateScrollButtons",1),u([G("noScrollControls",{waitUntilFirstUpdate:!0})],dt.prototype,"updateScrollControls",1),u([G("placement",{waitUntilFirstUpdate:!0})],dt.prototype,"syncIndicator",1),dt.define("sl-tab-group");var eh=(e,t)=>{let o=0;return function(...r){window.clearTimeout(o),o=window.setTimeout(()=>{e.call(this,...r)},t)}},Yn=(e,t,o)=>{const r=e[t];e[t]=function(...i){r.call(this,...i),o.call(this,r,...i)}};(()=>{if(typeof window>"u")return;if(!("onscrollend"in window)){const t=new Set,o=new WeakMap,r=s=>{for(const a of s.changedTouches)t.add(a.identifier)},i=s=>{for(const a of s.changedTouches)t.delete(a.identifier)};document.addEventListener("touchstart",r,!0),document.addEventListener("touchend",i,!0),document.addEventListener("touchcancel",i,!0),Yn(EventTarget.prototype,"addEventListener",function(s,a){if(a!=="scrollend")return;const n=eh(()=>{t.size?n():this.dispatchEvent(new Event("scrollend"))},100);s.call(this,"scroll",n,{passive:!0}),o.set(this,n)}),Yn(EventTarget.prototype,"removeEventListener",function(s,a){if(a!=="scrollend")return;const n=o.get(this);n&&s.call(this,"scroll",n,{passive:!0})})}})();var oh=E`
  :host {
    display: inline-block;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    border-radius: var(--sl-border-radius-medium);
    color: var(--sl-color-neutral-600);
    padding: var(--sl-spacing-medium) var(--sl-spacing-large);
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition:
      var(--transition-speed) box-shadow,
      var(--transition-speed) color;
  }

  .tab:hover:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  :host(:focus) {
    outline: transparent;
  }

  :host(:focus-visible) {
    color: var(--sl-color-primary-600);
    outline: var(--sl-focus-ring);
    outline-offset: calc(-1 * var(--sl-focus-ring-width) - var(--sl-focus-ring-offset));
  }

  .tab.tab--active:not(.tab--disabled) {
    color: var(--sl-color-primary-600);
  }

  .tab.tab--closable {
    padding-inline-end: var(--sl-spacing-small);
  }

  .tab.tab--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab__close-button {
    font-size: var(--sl-font-size-small);
    margin-inline-start: var(--sl-spacing-small);
  }

  .tab__close-button::part(base) {
    padding: var(--sl-spacing-3x-small);
  }

  @media (forced-colors: active) {
    .tab.tab--active:not(.tab--disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`,rh=0,Rt=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.attrId=++rh,this.componentId=`sl-tab-${this.attrId}`,this.panel="",this.active=!1,this.closable=!1,this.disabled=!1,this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}handleCloseClick(e){e.stopPropagation(),this.emit("sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false"),this.disabled&&!this.active?this.tabIndex=-1:this.tabIndex=0}render(){return this.id=this.id.length>0?this.id:this.componentId,d`
      <div
        part="base"
        class=${rt({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
      >
        <slot></slot>
        ${this.closable?d`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </div>
    `}};Rt.styles=[et,oh],Rt.dependencies={"sl-icon-button":at},u([_(".tab")],Rt.prototype,"tab",2),u([h({reflect:!0})],Rt.prototype,"panel",2),u([h({type:Boolean,reflect:!0})],Rt.prototype,"active",2),u([h({type:Boolean,reflect:!0})],Rt.prototype,"closable",2),u([h({type:Boolean,reflect:!0})],Rt.prototype,"disabled",2),u([h({type:Number,reflect:!0})],Rt.prototype,"tabIndex",2),u([G("active")],Rt.prototype,"handleActiveChange",1),u([G("disabled")],Rt.prototype,"handleDisabledChange",1),Rt.define("sl-tab");var ih=E`
  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`,sh=0,Xo=class extends V{constructor(){super(...arguments),this.attrId=++sh,this.componentId=`sl-tab-panel-${this.attrId}`,this.name="",this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return d`
      <slot
        part="base"
        class=${rt({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};Xo.styles=[et,ih],u([h({reflect:!0})],Xo.prototype,"name",2),u([h({type:Boolean,reflect:!0})],Xo.prototype,"active",2),u([G("active")],Xo.prototype,"handleActiveChange",1),Xo.define("sl-tab-panel");const ps=E`
    sl-button::part(base) {
        border: 1px solid var(--primary-color);
        border-radius: 0;
        font-family: var(--font-stack), monospace;
        background-color: var(--background-color);
        color: var(--primary-color);
        min-height: 20px;
        max-height: 40px;
        min-width: 150px;
        max-width: 300px;
    }

    sl-button::part(label) {
        overflow-x: hidden;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-menu {
        border: 1px solid var(--primary-color);
        border-radius: 0;
    }

    sl-dropdown {
        margin-top: var(--global-padding-double);
    }

    sl-menu-item::part(base) {
        color: var(--primary-color);
        font-family: var(--font-stack);
        --sl-color-neutral-100: var(--secondary-color-lowalpha);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
`,ah=[ps,E`
    :host {
        display: block;
        margin-top: var(--global-padding);
        --compact-name-width: 200px;
    }

    .property {
        display: grid;
        grid-template-columns: 200px minmax(300px, auto) 1fr;
        gap: 0 1rem;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .property:last-child, .property:last-of-type {
        border-bottom: none;
    }
    
    .prop-name-col {
        text-align: right;
        white-space: nowrap;
    }

    .prop-type-col {
        white-space: nowrap;
    }

    .prop-desc-col {
        padding-left: var(--global-padding);
        color: var(--font-color-sub1)
    }

    .prop-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }
    .prop-name.required {
        color: var(--error-color);
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
        grid-template-columns: var(--compact-name-width) minmax(0, 1fr);
        padding: 8px 0.5rem;
    }

    :host([compact]) .prop-desc-col {
        display: none;
    }

    :host([compact]) .prop-type-col {
        min-width: 0;
        overflow: hidden;
    }

    :host([compact]) .prop-type {
        display: block;
        white-space: normal;
        overflow-wrap: anywhere;
    }

    :host([compact]) a.ref-type-link {
        overflow-wrap: anywhere;
    }

    :host([compact]) .composition-ref-entry {
        grid-template-columns: auto minmax(0, 1fr);
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

    .composition-refs {
        padding: var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .composition-label {
        display: block;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: var(--font-stack), monospace;
        margin-bottom: var(--global-padding);
        color: var(--font-color-sub1);
    }

    .composition-label.polymorphic {
        color: var(--warn-color);
    }

    .composition-ref-entry {
        display: grid;
        grid-template-columns: 200px minmax(300px, auto) 1fr;
        gap: 0 1rem;
        align-items: baseline;
        padding: 4px 0;
    }

    .composition-ref-link {
        grid-column: 1 / 3;
    }

    .composition-ref-desc {
        color: var(--font-color-sub1);
    }

    .composition-separator {
        color: var(--primary-color);
        font-weight: bold;
        margin: 0 0.25em;
    }

    :host([compact]) .composition-refs {
        padding: 8px 0.5rem;
    }

    :host([compact]) .composition-ref-desc {
        display: none;
    }

    :host([compact]) .composition-label {
        display: block;
    }

    .oneof-property {
        display: flex;
        align-items: stretch;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .oneof-property > .oneof-left {
        width: var(--compact-name-width);
        min-width: var(--compact-name-width);
        padding-right: 1rem;
    }

    .oneof-prop-name {
        text-align: right;
        white-space: nowrap;
    }

    .oneof-desc-container {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .oneof-prop-desc {
        color: var(--font-color-sub1);
        padding-top: var(--global-padding);
        text-align: right;
    }

    .oneof-option-desc {
        padding: var(--global-padding);
        color: var(--font-color-sub1);
        font-size: 0.9em;
        border-bottom: 1px dotted var(--hrcolor);
    }

    .oneof-option-scalar {
        padding: var(--global-padding);
    }

    .oneof-tabs {
        --indicator-color: var(--warn-color);
        --track-color: transparent;
        --sl-transition-x-fast: 0s;
        flex: 1;
    }

    .oneof-tabs::part(base) {
        height: 100%;
        gap: 0;
    }

    .oneof-tabs::part(nav) {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-inline-end: var(--global-padding) solid var(--warn-color);
    }

    .oneof-tabs::part(tabs) {
        flex: 1;
        width: 250px;
        min-width: 250px;
    }

    :host([condensed]) .oneof-tabs::part(tabs) {
        width: 170px;
        min-width: 170px;
    }

    .oneof-tabs::part(body) {
        overflow: auto;
    }

    .oneof-tabs sl-tab {
        width: 100%;
    }

    .oneof-tabs sl-tab::part(base) {
        display: flex;
        width: 100%;
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.5rem 0.8rem;
        color: var(--warn-color);
        border-radius: 0;
        margin-inline-end: -1px;
    }

    .oneof-tabs sl-tab[active]::part(base) {
        color: var(--background-color);
        background-color: var(--warn-color);
        border-radius: 0;
        margin-inline-end: -1px;
    }

    .oneof-tabs sl-tab-panel::part(base) {
        padding: 0 0 0 var(--global-padding);
    }

    .prop-type-col sl-dropdown {
        margin-top: 0;
    }

    .property-oneof {
        grid-column: 1 / -1;
    }

    :host([compact]) .oneof-container {
        display: block;
    }
`];var nh=Object.defineProperty,lh=Object.getOwnPropertyDescriptor,qo=(e,t,o,r)=>{for(var i=r>1?void 0:r?lh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&nh(t,o,i),i};p.PpSchemaProperties=class extends Q{constructor(){super(...arguments),this.schemaJson="",this.compact=!1,this.condensed=!1,this.schema=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.schema=JSON.parse(this.schemaJson),this.computeNameColumnWidth()}catch{this.schema=null}}computeNameColumnWidth(){if(!this.schema)return;let t=0;const o=this.schema.properties,r=new Set(this.schema.required??[]);let i=!1;if(o)for(const n of Object.keys(o))n.length>t&&(t=n.length),r.has(n)&&(i=!0);const s=i?70:0,a=Math.max(150,t*8.5+s+16);this.style.setProperty("--compact-name-width",`${Math.round(a)}px`)}renderRefAnchor(t,o){const r=d`<a class="ref-type-link" href="${o.href}">\u279c ${o.name}</a>`;return d`
            <pp-ref-popover schema-ref="${t}">${r}</pp-ref-popover>`}renderType(t){return Ru(t,(o,r)=>this.renderRefAnchor(o,r))}renderPropertyRow(t,o,r){return d`
            <div class="property">
                <div class="prop-name-col">
                    ${r.has(t)?d`<span class="required-badge">req</span>`:y}
                    <span class="prop-name ${r.has(t)?"required":""}">${t}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(o)}
                    ${Vo(o,{labelSuffix:":"})}
                </div>
                <div class="prop-desc-col">
                    ${o.description?o.description:y}
                </div>
            </div>
        `}renderPropertyTable(t,o){const r=Object.entries(t);return r.length?r.map(([i,s])=>{const a=s.oneOf??s.anyOf;return a&&Array.isArray(a)?d`
                    <div class="property-oneof">
                        ${this.renderOneOf(a,i,s.description,o.has(i),"polymorphic")}
                    </div>
                `:this.renderPropertyRow(i,s,o)}):y}renderCompositionRefs(t){return d`
            <div class="composition-refs">
                <span class="composition-label">Composed from</span>
                ${t.map(o=>{const r=He(o.$ref);if(!r)return y;const i=ls(o.$ref),s=(i==null?void 0:i.description)??"";return d`
                        <div class="composition-ref-entry">
                            <span class="composition-ref-link">${this.renderRefAnchor(o.$ref,r)}</span>
                            ${s?d`<span class="composition-ref-desc">${s}</span>`:y}
                        </div>
                    `})}
            </div>
        `}renderComposition(t){const o=t.allOf,r=[],i=new Set(t.required||[]),s={};t.properties&&Object.assign(s,t.properties);for(const a of o)if(a.$ref)r.push(a);else if(a.properties&&Object.assign(s,a.properties),a.required)for(const n of a.required)i.add(n);return d`
            ${r.length?this.renderCompositionRefs(r):y}
            ${Object.keys(s).length?this.renderPropertyTable(s,i):y}
        `}renderOneOf(t,o,r,i,s){return t.length?d`
            <div class="oneof-property">
                <div class="oneof-left">
                    ${o?d`
                        <div class="oneof-prop-name">
                            ${i?d`<span class="required-badge">req</span>`:y}
                            <span class="prop-name">${o}</span>
                            ${s?d`<div class="composition-label polymorphic">(${s})</div>`:y}
                        </div>
                    `:y}
                    ${r?d`<div class="oneof-prop-desc">${r}</div>`:y}
                </div>
                <div class="oneof-desc-container">
                    <sl-tab-group class="oneof-tabs" placement="start">
                        ${t.map((a,n)=>{var l;return d`
                            <sl-tab slot="nav" panel="oneof-${n}" class="oneof-tab" ?active=${n===0}>
                                \u203A ${a.title||((l=a.$ref)==null?void 0:l.split("/").pop())||`Option ${n+1}`}
                            </sl-tab>
                        `})}
                        ${t.map((a,n)=>d`
                            <sl-tab-panel name="oneof-${n}" ?active=${n===0}>
                                ${this.renderOneOfOption(a)}
                            </sl-tab-panel>
                        `)}
                    </sl-tab-group>
                </div>
            </div>
        `:y}renderOneOfOption(t){if(t.$ref){const i=He(t.$ref);if(!i)return y;const s=ls(t.$ref);return d`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(t.$ref,i)}
                    ${s!=null&&s.description?d`<span class="oneof-option-desc">${s.description}</span>`:y}
                </div>
            `}const o=new Set(t.required||[]),r=Hr(t);return d`
            ${t.description?d`<div class="oneof-option-desc">${t.description}</div>`:y}
            ${t.properties?this.renderPropertyTable(t.properties,o):r?d`<div class="oneof-option-scalar"><span class="prop-type">${r}</span>${Vo(t,{labelSuffix:":"})}</div>`:y}
        `}render(){var s,a,n,l;if(!this.schema)return y;const t=this.schema.type==="array"&&((s=this.schema.items)!=null&&s.properties||(a=this.schema.items)!=null&&a.allOf||(n=this.schema.items)!=null&&n.oneOf||(l=this.schema.items)!=null&&l.anyOf)?this.schema.items:this.schema;if(t.allOf&&Array.isArray(t.allOf))return this.renderComposition(t);if(t.oneOf&&Array.isArray(t.oneOf))return this.renderOneOf(t.oneOf,"ONE OF",void 0,void 0,"polymorphic");if(t.anyOf&&Array.isArray(t.anyOf))return this.renderOneOf(t.anyOf,"ANY OF",void 0,void 0,"polymorphic");const o=t.properties||{},r=new Set(t.required||[]);if(!Object.entries(o).length){const c=Hr(t);return!c&&!t.description?y:d`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${c?d`<span class="prop-type">${c}</span>`:y}
                        ${Vo(t,{labelSuffix:":"})}
                    </div>
                    <div class="prop-desc-col">
                        ${t.description?t.description:y}
                    </div>
                </div>
            `}return this.renderPropertyTable(o,r)}},p.PpSchemaProperties.styles=[Yr,...ah],qo([h({attribute:"schema-json"})],p.PpSchemaProperties.prototype,"schemaJson",2),qo([h({type:Boolean,reflect:!0})],p.PpSchemaProperties.prototype,"compact",2),qo([h({type:Boolean,reflect:!0})],p.PpSchemaProperties.prototype,"condensed",2),qo([k()],p.PpSchemaProperties.prototype,"schema",2),p.PpSchemaProperties=qo([q("pp-schema-properties")],p.PpSchemaProperties);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class us extends cr{constructor(t){if(super(t),this.it=y,t.type!==te.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===y||t==null)return this._t=void 0,this.it=t;if(t===Tt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}}us.directiveName="unsafeHTML",us.resultType=1;const Qe=lr(us);var Bn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ch(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var hs={exports:{}},Hn;function dh(){return Hn||(Hn=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(r){var i=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,s=0,a={},n={manual:r.Prism&&r.Prism.manual,disableWorkerMessageHandler:r.Prism&&r.Prism.disableWorkerMessageHandler,util:{encode:function v(b){return b instanceof l?new l(b.type,v(b.content),b.alias):Array.isArray(b)?b.map(v):b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(v){return Object.prototype.toString.call(v).slice(8,-1)},objId:function(v){return v.__id||Object.defineProperty(v,"__id",{value:++s}),v.__id},clone:function v(b,x){x=x||{};var C,L;switch(n.util.type(b)){case"Object":if(L=n.util.objId(b),x[L])return x[L];C={},x[L]=C;for(var S in b)b.hasOwnProperty(S)&&(C[S]=v(b[S],x));return C;case"Array":return L=n.util.objId(b),x[L]?x[L]:(C=[],x[L]=C,b.forEach(function(z,N){C[N]=v(z,x)}),C);default:return b}},getLanguage:function(v){for(;v;){var b=i.exec(v.className);if(b)return b[1].toLowerCase();v=v.parentElement}return"none"},setLanguage:function(v,b){v.className=v.className.replace(RegExp(i,"gi"),""),v.classList.add("language-"+b)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(C){var v=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(C.stack)||[])[1];if(v){var b=document.getElementsByTagName("script");for(var x in b)if(b[x].src==v)return b[x]}return null}},isActive:function(v,b,x){for(var C="no-"+b;v;){var L=v.classList;if(L.contains(b))return!0;if(L.contains(C))return!1;v=v.parentElement}return!!x}},languages:{plain:a,plaintext:a,text:a,txt:a,extend:function(v,b){var x=n.util.clone(n.languages[v]);for(var C in b)x[C]=b[C];return x},insertBefore:function(v,b,x,C){C=C||n.languages;var L=C[v],S={};for(var z in L)if(L.hasOwnProperty(z)){if(z==b)for(var N in x)x.hasOwnProperty(N)&&(S[N]=x[N]);x.hasOwnProperty(z)||(S[z]=L[z])}var $=C[v];return C[v]=S,n.languages.DFS(n.languages,function(Y,H){H===$&&Y!=v&&(this[Y]=S)}),S},DFS:function v(b,x,C,L){L=L||{};var S=n.util.objId;for(var z in b)if(b.hasOwnProperty(z)){x.call(b,z,b[z],C||z);var N=b[z],$=n.util.type(N);$==="Object"&&!L[S(N)]?(L[S(N)]=!0,v(N,x,null,L)):$==="Array"&&!L[S(N)]&&(L[S(N)]=!0,v(N,x,z,L))}}},plugins:{},highlightAll:function(v,b){n.highlightAllUnder(document,v,b)},highlightAllUnder:function(v,b,x){var C={callback:x,container:v,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};n.hooks.run("before-highlightall",C),C.elements=Array.prototype.slice.apply(C.container.querySelectorAll(C.selector)),n.hooks.run("before-all-elements-highlight",C);for(var L=0,S;S=C.elements[L++];)n.highlightElement(S,b===!0,C.callback)},highlightElement:function(v,b,x){var C=n.util.getLanguage(v),L=n.languages[C];n.util.setLanguage(v,C);var S=v.parentElement;S&&S.nodeName.toLowerCase()==="pre"&&n.util.setLanguage(S,C);var z=v.textContent,N={element:v,language:C,grammar:L,code:z};function $(H){N.highlightedCode=H,n.hooks.run("before-insert",N),N.element.innerHTML=N.highlightedCode,n.hooks.run("after-highlight",N),n.hooks.run("complete",N),x&&x.call(N.element)}if(n.hooks.run("before-sanity-check",N),S=N.element.parentElement,S&&S.nodeName.toLowerCase()==="pre"&&!S.hasAttribute("tabindex")&&S.setAttribute("tabindex","0"),!N.code){n.hooks.run("complete",N),x&&x.call(N.element);return}if(n.hooks.run("before-highlight",N),!N.grammar){$(n.util.encode(N.code));return}if(b&&r.Worker){var Y=new Worker(n.filename);Y.onmessage=function(H){$(H.data)},Y.postMessage(JSON.stringify({language:N.language,code:N.code,immediateClose:!0}))}else $(n.highlight(N.code,N.grammar,N.language))},highlight:function(v,b,x){var C={code:v,grammar:b,language:x};if(n.hooks.run("before-tokenize",C),!C.grammar)throw new Error('The language "'+C.language+'" has no grammar.');return C.tokens=n.tokenize(C.code,C.grammar),n.hooks.run("after-tokenize",C),l.stringify(n.util.encode(C.tokens),C.language)},tokenize:function(v,b){var x=b.rest;if(x){for(var C in x)b[C]=x[C];delete b.rest}var L=new m;return w(L,L.head,v),g(v,L,b,L.head,0),M(L)},hooks:{all:{},add:function(v,b){var x=n.hooks.all;x[v]=x[v]||[],x[v].push(b)},run:function(v,b){var x=n.hooks.all[v];if(!(!x||!x.length))for(var C=0,L;L=x[C++];)L(b)}},Token:l};r.Prism=n;function l(v,b,x,C){this.type=v,this.content=b,this.alias=x,this.length=(C||"").length|0}l.stringify=function v(b,x){if(typeof b=="string")return b;if(Array.isArray(b)){var C="";return b.forEach(function($){C+=v($,x)}),C}var L={type:b.type,content:v(b.content,x),tag:"span",classes:["token",b.type],attributes:{},language:x},S=b.alias;S&&(Array.isArray(S)?Array.prototype.push.apply(L.classes,S):L.classes.push(S)),n.hooks.run("wrap",L);var z="";for(var N in L.attributes)z+=" "+N+'="'+(L.attributes[N]||"").replace(/"/g,"&quot;")+'"';return"<"+L.tag+' class="'+L.classes.join(" ")+'"'+z+">"+L.content+"</"+L.tag+">"};function c(v,b,x,C){v.lastIndex=b;var L=v.exec(x);if(L&&C&&L[1]){var S=L[1].length;L.index+=S,L[0]=L[0].slice(S)}return L}function g(v,b,x,C,L,S){for(var z in x)if(!(!x.hasOwnProperty(z)||!x[z])){var N=x[z];N=Array.isArray(N)?N:[N];for(var $=0;$<N.length;++$){if(S&&S.cause==z+","+$)return;var Y=N[$],H=Y.inside,st=!!Y.lookbehind,B=!!Y.greedy,pt=Y.alias;if(B&&!Y.pattern.global){var ot=Y.pattern.toString().match(/[imsuy]*$/)[0];Y.pattern=RegExp(Y.pattern.source,ot+"g")}for(var X=Y.pattern||Y,R=C.next,F=L;R!==b.tail&&!(S&&F>=S.reach);F+=R.value.length,R=R.next){var qt=R.value;if(b.length>v.length)return;if(!(qt instanceof l)){var Jr=1,Ht;if(B){if(Ht=c(X,F,v,st),!Ht||Ht.index>=v.length)break;var Xr=Ht.index,wg=Ht.index+Ht[0].length,Le=F;for(Le+=R.value.length;Xr>=Le;)R=R.next,Le+=R.value.length;if(Le-=R.value.length,F=Le,R.value instanceof l)continue;for(var tr=R;tr!==b.tail&&(Le<wg||typeof tr.value=="string");tr=tr.next)Jr++,Le+=tr.value.length;Jr--,qt=v.slice(F,Le),Ht.index-=F}else if(Ht=c(X,0,qt,st),!Ht)continue;var Xr=Ht.index,qr=Ht[0],ys=qt.slice(0,Xr),Jn=qt.slice(Xr+qr.length),ws=F+qt.length;S&&ws>S.reach&&(S.reach=ws);var Kr=R.prev;ys&&(Kr=w(b,Kr,ys),F+=ys.length),f(b,Kr,Jr);var Mg=new l(z,H?n.tokenize(qr,H):qr,pt,qr);if(R=w(b,Kr,Mg),Jn&&w(b,R,Jn),Jr>1){var Ms={cause:z+","+$,reach:ws};g(v,b,x,R.prev,F,Ms),S&&Ms.reach>S.reach&&(S.reach=Ms.reach)}}}}}}function m(){var v={value:null,prev:null,next:null},b={value:null,prev:v,next:null};v.next=b,this.head=v,this.tail=b,this.length=0}function w(v,b,x){var C=b.next,L={value:x,prev:b,next:C};return b.next=L,C.prev=L,v.length++,L}function f(v,b,x){for(var C=b.next,L=0;L<x&&C!==v.tail;L++)C=C.next;b.next=C,C.prev=b,v.length-=L}function M(v){for(var b=[],x=v.head.next;x!==v.tail;)b.push(x.value),x=x.next;return b}if(!r.document)return r.addEventListener&&(n.disableWorkerMessageHandler||r.addEventListener("message",function(v){var b=JSON.parse(v.data),x=b.language,C=b.code,L=b.immediateClose;r.postMessage(n.highlight(C,n.languages[x],x)),L&&r.close()},!1)),n;var I=n.util.currentScript();I&&(n.filename=I.src,I.hasAttribute("data-manual")&&(n.manual=!0));function j(){n.manual||n.highlightAll()}if(!n.manual){var A=document.readyState;A==="loading"||A==="interactive"&&I&&I.defer?document.addEventListener("DOMContentLoaded",j):window.requestAnimationFrame?window.requestAnimationFrame(j):window.setTimeout(j,16)}return n})(t);e.exports&&(e.exports=o),typeof Bn<"u"&&(Bn.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(r){r.type==="entity"&&(r.attributes.title=r.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(i,s){var a={};a["language-"+s]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[s]},a.cdata=/^<!\[CDATA\[|\]\]>$/i;var n={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:a}};n["language-"+s]={pattern:/[\s\S]+/,inside:o.languages[s]};var l={};l[i]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return i}),"i"),lookbehind:!0,greedy:!0,inside:n},o.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(r,i){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+r+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[i,"language-"+i],inside:o.languages[i]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(r){var i=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;r.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+i.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+i.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+i.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+i.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:i,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},r.languages.css.atrule.inside.rest=r.languages.css;var s=r.languages.markup;s&&(s.tag.addInlined("style","css"),s.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var r="Loading…",i=function(I,j){return"✖ Error "+I+" while fetching file: "+j},s="✖ Error: File does not exist or is empty",a={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},n="data-src-status",l="loading",c="loaded",g="failed",m="pre[data-src]:not(["+n+'="'+c+'"]):not(['+n+'="'+l+'"])';function w(I,j,A){var v=new XMLHttpRequest;v.open("GET",I,!0),v.onreadystatechange=function(){v.readyState==4&&(v.status<400&&v.responseText?j(v.responseText):v.status>=400?A(i(v.status,v.statusText)):A(s))},v.send(null)}function f(I){var j=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(I||"");if(j){var A=Number(j[1]),v=j[2],b=j[3];return v?b?[A,Number(b)]:[A,void 0]:[A,A]}}o.hooks.add("before-highlightall",function(I){I.selector+=", "+m}),o.hooks.add("before-sanity-check",function(I){var j=I.element;if(j.matches(m)){I.code="",j.setAttribute(n,l);var A=j.appendChild(document.createElement("CODE"));A.textContent=r;var v=j.getAttribute("data-src"),b=I.language;if(b==="none"){var x=(/\.(\w+)$/.exec(v)||[,"none"])[1];b=a[x]||x}o.util.setLanguage(A,b),o.util.setLanguage(j,b);var C=o.plugins.autoloader;C&&C.loadLanguages(b),w(v,function(L){j.setAttribute(n,c);var S=f(j.getAttribute("data-range"));if(S){var z=L.split(/\r\n?|\n/g),N=S[0],$=S[1]==null?z.length:S[1];N<0&&(N+=z.length),N=Math.max(0,Math.min(N-1,z.length)),$<0&&($+=z.length),$=Math.max(0,Math.min($,z.length)),L=z.slice(N,$).join(`
`),j.hasAttribute("data-start")||j.setAttribute("data-start",String(N+1))}A.textContent=L,o.highlightElement(A)},function(L){j.setAttribute(n,g),A.textContent=L})}}),o.plugins.fileHighlight={highlight:function(j){for(var A=(j||document).querySelectorAll(m),v=0,b;b=A[v++];)o.highlightElement(b)}};var M=!1;o.fileHighlight=function(){M||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),M=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(hs)),hs.exports}var ph=dh();const fo=ch(ph);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json,(function(e){var t=/[*&][^\s[\]{},]+/,o=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r="(?:"+o.source+"(?:[ 	]+"+t.source+")?|"+t.source+"(?:[ 	]+"+o.source+")?)",i=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),s=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function a(n,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return n});return RegExp(c,l)}e.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return"(?:"+i+"|"+s+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:a(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:a(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:a(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:a(s),lookbehind:!0,greedy:!0},number:{pattern:a(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:o,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism),Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))}),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var r={};r["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var s={};s[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:i},Prism.languages.insertBefore("markup","cdata",s)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;const uh=E`
    :host {
        display: block;
    }

    /* ── Plain mode (no line numbers) ── */

    pre {
        margin: 0;
        padding: var(--global-padding-double) var(--global-padding-double) var(--global-padding-double) 20px;
        overflow-x: auto;
        border-left: 5px solid var(--code-accent-color, var(--secondary-color));
        border-top: 1px dashed var(--code-border-color, var(--secondary-color-dimmer));
        border-bottom: 1px dashed var(--code-border-color, var(--secondary-color-dimmer));
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

    /* ── Embedded mode: strip decorative chrome when inside a drawer/container ── */

    :host([embedded]) pre {
        border-left: none;
        border-top: none;
        border-bottom: none;
        background-color: var(--background-color);
        background-image: none;
        padding-left: var(--global-padding-double);
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
        background: var(--background-color);
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-lowalpha) var(--background-color);
    }

    .lined-code pre {
        margin: 0;
        padding: 0;
        overflow-x: visible;
        background: var(--background-color);
        color: var(--font-color);
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        width: 100%;
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
        background: var(--background-color);
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
        white-space: pre-wrap;
        overflow-wrap: break-word;
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
        border-bottom: 1px solid var(--hrcolor);
        color: var(--font-color-sub2);
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;var hh=Object.defineProperty,gh=Object.getOwnPropertyDescriptor,Ut=(e,t,o,r)=>{for(var i=r>1?void 0:r?gh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&hh(t,o,i),i};fo.manual=!0,p.PpCodeViewer=class extends Q{constructor(){super(...arguments),this.code="",this.language="json",this.pretty=!1,this.lineNumbers=!1,this.highlightLines="",this.startLine=1,this.location="",this.embedded=!1,this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:"",language:"",segments:[]},this._highlightCache={spec:"",parsed:new Set}}get displayCode(){if(!this.code)return"";if(this.pretty&&this.language==="json")try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(t){const o=new Set;if(!t)return o;for(const r of t.split(",")){const s=r.trim().match(/^(\d+)(?:-(\d+))?$/);if(!s)continue;const a=parseInt(s[1],10),n=s[2]?parseInt(s[2],10):a;for(let l=Math.min(a,n);l<=Math.max(a,n);l++)o.add(l)}return o}highlightCode(){const t=this.displayCode;if(!t)return"";try{const o=this.language==="xml"?"markup":this.language;return fo.highlight(t,fo.languages[o],o)}catch{return t}}splitHighlightedLines(t){const o=[];let r="";const i=[];let s=0;for(;s<t.length;)if(t[s]===`
`){for(let a=i.length-1;a>=0;a--)r+="</span>";o.push(r),r=i.join(""),s++}else if(t[s]==="<")if(t.startsWith("</span>",s))r+="</span>",i.pop(),s+=7;else{const a=t.indexOf(">",s);if(a===-1){r+=t[s],s++;continue}const n=t.slice(s,a+1);r+=n,n.startsWith("</")||i.push(n),s=a+1}else r+=t[s],s++;for(let a=i.length-1;a>=0;a--)r+="</span>";return r&&o.push(r),o}getLineSegments(){const t=this.displayCode;if(t===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;const o=this.highlightCode(),r=o?this.splitHighlightedLines(o):[];return this._segmentCache={code:t,language:this.language,segments:r},r}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){const t=this.parsedHighlights;return t.size>0?t:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}handleLineClick(t,o){if(this.isLocked)return;const r=new Set;if(o.shiftKey&&this.lastClickedLine!==null){const i=Math.min(this.lastClickedLine,t),s=Math.max(this.lastClickedLine,t);for(let a=i;a<=s;a++)r.add(a)}else this.selectedLines.size===1&&this.selectedLines.has(t)||r.add(t);this.selectedLines=r,this.lastClickedLine=t}willUpdate(t){(t.has("code")||t.has("language"))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?d`<div class="location">${this.location}</div>`:y}render(){if(!this.lineNumbers)return d`
              ${this.renderLocation()}
              <pre class="language-${this.language}"><code>${Qe(this.highlightCode())}</code></pre>
            `;const t=this.getLineSegments(),o=Math.max(this.startLine,1),r=o+t.length-1,i=r>0?Math.floor(Math.log10(r))+1:1,s=this.effectiveHighlights,a=this.isLocked;return d`
          ${this.renderLocation()}
          <div class="lined-code${a?" locked":""}" style="--gutter-digits: ${i}">
            <pre class="language-${this.language}"><code>${t.map((n,l)=>{const c=o+l,g=s.has(c);return d`<span class="line${g?" highlighted":""}"
                ><span class="line-number"
                       @click=${m=>this.handleLineClick(c,m)}
                >${c}</span><span class="line-content">${Qe(n||" ")}</span>
</span>`})}</code></pre>
          </div>
        `}},p.PpCodeViewer.styles=[uh],Ut([h()],p.PpCodeViewer.prototype,"code",2),Ut([h()],p.PpCodeViewer.prototype,"language",2),Ut([h({type:Boolean})],p.PpCodeViewer.prototype,"pretty",2),Ut([h({attribute:"line-numbers",type:Boolean})],p.PpCodeViewer.prototype,"lineNumbers",2),Ut([h({attribute:"highlight-lines"})],p.PpCodeViewer.prototype,"highlightLines",2),Ut([h({attribute:"start-line",type:Number})],p.PpCodeViewer.prototype,"startLine",2),Ut([h()],p.PpCodeViewer.prototype,"location",2),Ut([h({type:Boolean,reflect:!0})],p.PpCodeViewer.prototype,"embedded",2),Ut([k()],p.PpCodeViewer.prototype,"selectedLines",2),Ut([k()],p.PpCodeViewer.prototype,"lastClickedLine",2),p.PpCodeViewer=Ut([q("pp-code-viewer")],p.PpCodeViewer);const mh=E`
    :host {
        display: flex;
        align-items: flex-start;
        gap: var(--global-padding);
    }

    pb33f-model-icon {
        flex-shrink: 0;
        margin-top: var(--icon-title-icon-offset, 0.2em);
    }

    h1, h2, h3, h4 {
        margin: 0;
        padding: 0;
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        overflow-wrap: anywhere;
        min-width: 0;
    }
`;var fh=Object.defineProperty,bh=Object.getOwnPropertyDescriptor,Ko=(e,t,o,r)=>{for(var i=r>1?void 0:r?bh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&fh(t,o,i),i};p.PpIconTitle=class extends Q{constructor(){super(...arguments),this.icon="",this.heading="",this.level=1,this.size="huge"}render(){if(!this.heading)return y;const t=Gl(`h${Math.min(Math.max(this.level,1),6)}`);return Co`
            <pb33f-model-icon icon=${this.icon} size=${this.size}></pb33f-model-icon>
            <${t}>${this.heading}</${t}>
        `}},p.PpIconTitle.styles=[mh],Ko([h()],p.PpIconTitle.prototype,"icon",2),Ko([h()],p.PpIconTitle.prototype,"heading",2),Ko([h({type:Number})],p.PpIconTitle.prototype,"level",2),Ko([h()],p.PpIconTitle.prototype,"size",2),p.PpIconTitle=Ko([q("pp-icon-title")],p.PpIconTitle);var vh=Object.defineProperty,yh=Object.getOwnPropertyDescriptor,We=(e,t,o,r)=>{for(var i=r>1?void 0:r?yh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&vh(t,o,i),i};p.PpRefPopover=class extends Q{constructor(){super(...arguments),this.registryKey="",this.schemaRef="",this.active=!1,this.entry=null,this.parsedData=null}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.showTimeout),clearTimeout(this.hideTimeout),this.active=!1}show(){clearTimeout(this.hideTimeout),this.showTimeout=window.setTimeout(()=>{if(this.entry=(this.registryKey?Rn(this.registryKey):ls(this.schemaRef))??null,this.entry){try{this.parsedData=JSON.parse(this.entry.schemaJson)}catch{this.parsedData=null}this.active=!0}},300)}hide(){clearTimeout(this.showTimeout),this.hideTimeout=window.setTimeout(()=>{this.active=!1},200)}cancelHide(){clearTimeout(this.hideTimeout)}resolveExample(){var o,r;if((o=this.entry)!=null&&o.mockJson)return this.entry.mockJson;const t=this.parsedData;return t?((r=t.schema)==null?void 0:r.example)!==void 0?JSON.stringify(t.schema.example):t.example!==void 0?JSON.stringify(t.example):Array.isArray(t.examples)&&t.examples.length>0?JSON.stringify(t.examples[0]):null:null}getSchemaJson(){if(!this.entry)return"";const t=this.parsedData;return t?t.schema?JSON.stringify(t.schema):this.entry.schemaJson:this.entry.schemaJson}formatJson(t){try{return JSON.stringify(JSON.parse(t),null,2)}catch{return t}}render(){const t=this.resolveExample(),o=this.getSchemaJson();return d`
            <span class="trigger"
                @mouseenter=${this.show}
                @mouseleave=${this.hide}
                @click=${()=>{this.active=!1}}>
                <slot></slot>
            </span>
            ${this.active&&this.entry?d`
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
                            <pp-icon-title icon=${this.entry.componentType} heading=${this.entry.name} level=${3} size="medium"></pp-icon-title>
                        </div>
                        <div class="popover-body">
                            <pp-schema-properties compact condensed schema-json=${o}></pp-schema-properties>
                        </div>
                        ${t?d`
                            <div class="popover-example">
                                <div class="example-label">Example</div>
                                <pp-code-viewer
                                    .code=${this.formatJson(t)}
                                    language="json">
                                </pp-code-viewer>
                            </div>
                        `:y}
                    </div>
                </sl-popup>
            `:y}
        `}},p.PpRefPopover.styles=Uu,We([h({attribute:"registry-key"})],p.PpRefPopover.prototype,"registryKey",2),We([h({attribute:"schema-ref"})],p.PpRefPopover.prototype,"schemaRef",2),We([k()],p.PpRefPopover.prototype,"active",2),We([k()],p.PpRefPopover.prototype,"entry",2),We([k()],p.PpRefPopover.prototype,"parsedData",2),We([_(".trigger")],p.PpRefPopover.prototype,"trigger",2),p.PpRefPopover=We([q("pp-ref-popover")],p.PpRefPopover);const wh=E`
    :host {
        display: block;
    }

    .ext-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0 var(--global-padding);
    }
    
    .ext-value,
    .ext-key {
        padding: var(--global-padding) 0;
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
`;var Mh=Object.defineProperty,xh=Object.getOwnPropertyDescriptor,gs=(e,t,o,r)=>{for(var i=r>1?void 0:r?xh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Mh(t,o,i),i};p.PpExtensions=class extends Q{constructor(){super(...arguments),this.extensionsJson="",this.extensions=[]}willUpdate(t){if(t.has("extensionsJson"))if(this.extensionsJson)try{this.extensions=JSON.parse(this.extensionsJson)}catch{this.extensions=[]}else this.extensions=[]}renderValue(t){return t==null?y:typeof t=="object"?d`<pp-code-viewer code=${JSON.stringify(t,null,2)} language="json"></pp-code-viewer>`:d`<span class="ext-scalar">${String(t)}</span>`}render(){return this.extensions.length?d`<div class="ext-grid">
      ${this.extensions.map(t=>d`
        <div class="ext-key">${t.key}</div>
        <div class="ext-value">${this.renderValue(t.value)}</div>
      `)}
    </div>`:y}},p.PpExtensions.styles=wh,gs([h({attribute:"extensions-json"})],p.PpExtensions.prototype,"extensionsJson",2),gs([k()],p.PpExtensions.prototype,"extensions",2),p.PpExtensions=gs([q("pp-extensions")],p.PpExtensions);var Lh=Object.defineProperty,Ch=Object.getOwnPropertyDescriptor,ms=(e,t,o,r)=>{for(var i=r>1?void 0:r?Ch(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Lh(t,o,i),i};p.PpOperationParameters=class extends Q{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(t){if(t.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}inIcon(t){switch(t){case"cookie":return"cookie";case"header":return"envelope";case"path":return"signpost";case"query":return"question-diamond";default:return"question-diamond"}}parseSchema(t){if(!t)return null;try{return JSON.parse(t)}catch{return null}}render(){return this.params.length?d`
      ${this.params.map(t=>{var i;const o=this.parseSchema(t.schemaJson),r=Hr(o);return d`
          <div class="parameter">
            <div class="param-name-col">
              ${t.required?d`<span class="required-badge">req</span>`:y}
              ${t.ref?d`
                    <pp-ref-popover registry-key="${t.ref.componentType}/${t.ref.name}"><a
                        class="ref-link param-name" href="models/${t.ref.typeSlug}/${t.ref.slug}.html">\u279c
                      ${t.name}</a></pp-ref-popover>`:d`<span class="param-name">${t.name}</span>`}

              ${t.deprecated?d`<span class="deprecated-badge">deprecated</span>`:y}
            </div>
            <div class="param-type-col">
              ${r?d`<span class="param-type">${r}</span>`:y}
              ${Vo(o,{labelSuffix:":"})}
            </div>
            <div class="param-in-col">
              <sl-icon class="param-in-icon" name="${this.inIcon(t.in)}"></sl-icon>
              <span class="param-in">${t.in}</span>
            </div>
            <div class="param-desc-col">
              ${t.description||y}
              ${!t.ref&&(t.rawJson||t.rawYaml)?d`
                    <pp-raw-viewer-btn
                        title="${t.name} (${t.in})"
                        raw-json=${t.rawJson||""}
                        raw-yaml=${t.rawYaml||""}
                        start-line=${t.sourceLine||1}
                        location=${t.location||""}>
                    </pp-raw-viewer-btn>`:y}
            </div>
            ${!t.ref&&(t.rawJson||t.rawYaml)||t.mockJson||t.examples&&Object.keys(t.examples).length>0?d`
                  <div class="param-extras">
                    ${t.mockJson||t.examples&&Object.keys(t.examples).length>0?d`
                          <pp-example-selector
                              mock-json=${t.mockJson||""}
                              examples-json=${t.examples?JSON.stringify(t.examples):""}>
                          </pp-example-selector>`:y}
                  </div>
                `:y}
          </div>
          ${(i=t.extensions)!=null&&i.length?d`
            <div class="parameter extensions">
            <div class="param-name-col">
              &nbsp;
            </div>
            <div class="param-type-col">
              &nbsp;
            </div>
            <div class="param-in-col">
              &nbsp;
            </div>
            <div class="param-desc-col">
                <h4>${t.name} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(t.extensions)}></pp-extensions>
            </div>
            </div>`:y}
          
        `})}
    `:y}},p.PpOperationParameters.styles=[mo,Yr,Br,_u],ms([h({attribute:"parameters-json"})],p.PpOperationParameters.prototype,"parametersJson",2),ms([k()],p.PpOperationParameters.prototype,"params",2),p.PpOperationParameters=ms([q("pp-operation-parameters")],p.PpOperationParameters);const Qn=E`
    .status-ok {
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
    }

    .status-warn {
        color: var(--warn-color);
        font-family: var(--font-stack-bold), monospace;
    }

    .status-error {
        color: var(--error-color);
        font-family: var(--font-stack-bold), monospace;
    }
`,Ih=E`
    :host {
        display: block;
        margin-top: var(--global-padding);
    }

    h2 {
        border-bottom: 1px dashed var(--hrcolor);
        font-family: var(--font-stack), monospace;
        padding-bottom: var(--global-padding);
        margin-top: 40px;
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
        margin-bottom: var(--global-padding);
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
        padding: var(--global-padding);
    }

    .response:last-child {
        margin-bottom: 0;
    }


    .response > h3 {
        margin-bottom: 20px;
    }

    .pp-details-summary > h3 {
        margin-bottom: 0;
    }

    .status-code {
        font-family: var(--font-stack-bold), monospace;
    }

    /* ── Headers section ── */

    .headers-section {
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
    }

    .headers-label {
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
        padding-bottom: var(--global-padding);
        margin-top: var(--global-padding);
    }

    .header-entry {
        display: grid;
        grid-template-columns: 200px 200px 1fr;
        gap: 0 1rem;
        padding: var(--global-padding) var(--global-padding);
        border-top: 1px dotted var(--hrcolor);
    }

    .header-entry:first-child {
        border-bottom: none;
        border-top: none;
    }
    
    .header-entry-extensions {
        border-top: none;
    }
    
    .headers-values {
        border: 1px dashed var(--hrcolor);
    }
    
    .header-name-col {
        text-align: right;
        white-space: nowrap;
    }

    .header-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .header-type-col {
        white-space: nowrap;
    }

    .header-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
    }

    .header-desc-col {
        color: var(--font-color-sub1);
    }

    /* ── Common header list ── */

    .common-link-label {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: var(--global-padding);
    }

    ul.common-header-list {
        list-style: none;
        padding-left: 20px;
        margin: 0;
    }

    ul.common-header-list > li {
        line-height: 1.8em;
    }

    ul.common-header-list > li::before {
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        margin-right: 10px;
        content: ">";
    }

    .header-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack-bold), monospace;
        cursor: pointer;
    }

    .header-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    /* ── Response group headings ── */

    .property-box {
        border: 1px dotted var(--hrcolor);
        padding: var(--global-padding);
    }
    
    .response-group-heading {
        margin-bottom: var(--global-padding);
    }
    
    .response-desc {
        margin: var(--global-padding-double) 0;
        padding: var(--global-padding-double) 0;
        border-bottom: 1px dashed var(--hrcolor);
        border-top: 1px dashed var(--hrcolor);
    }
    
    .response-group-heading h4 {
        margin: 0;
        padding: 0;
        font-size: 1.2rem;
    }
    
    .response-extensions {
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
    }
    
    .media-type-extensions h4, 
    .response-extensions h4,
    .header-extensions h4 {
        font-weight: normal;
        margin-top: 0;
        border-bottom: 1px dotted var(--hrcolor);
        width: 100%;
        margin-bottom: var(--global-padding);
        padding-bottom: var(--global-padding);
        text-transform: uppercase;
        color: var(--font-color-sub1);
        letter-spacing: 0.05em;
        font-family: var(--font-stack), monospace;
    }


    /* ── Links section ── */

    .links-section {
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
    }

    .links-label {
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
        padding-bottom: var(--global-padding);
        margin-top: var(--global-padding);
    }

    .link-entry {
        display: grid;
        grid-template-columns: 300px 300px 1fr;
        gap: 0 1rem;
        padding: var(--global-padding);
        border-top: 1px dotted var(--hrcolor);
    }

    .link-entry:first-of-type {
        border-top: none;
    }
    
    .link-entry:last-child {
        border-bottom: none;
    }

    .link-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
        text-align: right;
    }

    .link-target {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
    }

    .link-desc {
        color: var(--font-color-sub1);
    }

    /* ── Common errors ── */

    .common-error-link {
        display: flex;
        align-items: center;
        gap: var(--global-padding);
        padding: var(--global-padding);
    }

    .error-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack), monospace;
        cursor: pointer;
    }

    .error-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    .common-error-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        margin-bottom: var(--global-padding);
        border: 1px dotted var(--hrcolor);
    }

    .common-error-code {
        font-family: var(--font-stack), monospace;
        padding: var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .common-error-desc {
        padding: var(--global-padding) var(--global-padding) var(--global-padding) 40px;
        border-bottom: dotted 1px var(--hrcolor);
        color: var(--font-color-sub1);
    }
    
    .media-type-extensions {
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
    }

    .header-extensions {
        grid-column: 1 / -1;
        padding: var(--global-padding);
    }

    pp-raw-viewer-btn {
        float: right;
    }
`,Ah=E`
    sl-details.pp-details {
        margin-top: 40px;
        position: relative;
    }

    sl-details.pp-details::part(base) {
        background: transparent;
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
    }

    sl-details.pp-details::part(header) {
        padding: var(--global-padding);
    }

    sl-details.pp-details::part(summary-icon) {
        color: var(--secondary-color);
    }

    sl-details.pp-details::part(content) {
        padding: var(--global-padding);
    }

    .pp-details-summary {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        width: 100%;
    }
    
    .pp-details-summary h3 {
        margin: 0;
        border-bottom: none;
        padding: 0;
    }
`;function fs(e){const t=parseInt(e,10);return t>=500?"status-error":t>=400?"status-warn":"status-ok"}const Zr={100:"Continue",101:"Switching Protocols",102:"Processing",103:"Early Hints",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Content Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a Teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Too Early",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",510:"Not Extended",511:"Network Authentication Required"};var jh=E`
  :host {
    --error-color: var(--sl-color-danger-600);
    --success-color: var(--sl-color-success-600);

    display: inline-block;
  }

  .copy-button__button {
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
  }

  .copy-button--success .copy-button__button {
    color: var(--success-color);
  }

  .copy-button--error .copy-button__button {
    color: var(--error-color);
  }

  .copy-button__button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  slot {
    display: inline-flex;
  }
`,ct=class extends V{constructor(){super(...arguments),this.localize=new ht(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let e=this.value;if(this.from){const t=this.getRootNode(),o=this.from.includes("."),r=this.from.includes("[")&&this.from.includes("]");let i=this.from,s="";o?[i,s]=this.from.trim().split("."):r&&([i,s]=this.from.trim().replace(/\]$/,"").split("["));const a="getElementById"in t?t.getElementById(i):null;a?r?e=a.getAttribute(s)||"":o?e=a[s]||"":e=a.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!e)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(e),this.showStatus("success"),this.emit("sl-copy",{detail:{value:e}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(e){const t=this.copyLabel||this.localize.term("copy"),o=this.successLabel||this.localize.term("copied"),r=this.errorLabel||this.localize.term("error"),i=e==="success"?this.successIcon:this.errorIcon,s=nt(this,"copy.in",{dir:"ltr"}),a=nt(this,"copy.out",{dir:"ltr"});this.tooltip.content=e==="success"?o:r,await this.copyIcon.animate(a.keyframes,a.options).finished,this.copyIcon.hidden=!0,this.status=e,i.hidden=!1,await i.animate(s.keyframes,s.options).finished,setTimeout(async()=>{await i.animate(a.keyframes,a.options).finished,i.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(s.keyframes,s.options).finished,this.tooltip.content=t,this.isCopying=!1},this.feedbackDuration)}render(){const e=this.copyLabel||this.localize.term("copy");return d`
      <sl-tooltip
        class=${rt({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
        content=${e}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <sl-icon library="system" name="copy"></sl-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <sl-icon library="system" name="check"></sl-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <sl-icon library="system" name="x-lg"></sl-icon>
          </slot>
        </button>
      </sl-tooltip>
    `}};ct.styles=[et,jh],ct.dependencies={"sl-icon":ut,"sl-tooltip":lt},u([_('slot[name="copy-icon"]')],ct.prototype,"copyIcon",2),u([_('slot[name="success-icon"]')],ct.prototype,"successIcon",2),u([_('slot[name="error-icon"]')],ct.prototype,"errorIcon",2),u([_("sl-tooltip")],ct.prototype,"tooltip",2),u([k()],ct.prototype,"isCopying",2),u([k()],ct.prototype,"status",2),u([h()],ct.prototype,"value",2),u([h()],ct.prototype,"from",2),u([h({type:Boolean,reflect:!0})],ct.prototype,"disabled",2),u([h({attribute:"copy-label"})],ct.prototype,"copyLabel",2),u([h({attribute:"success-label"})],ct.prototype,"successLabel",2),u([h({attribute:"error-label"})],ct.prototype,"errorLabel",2),u([h({attribute:"feedback-duration",type:Number})],ct.prototype,"feedbackDuration",2),u([h({attribute:"tooltip-placement"})],ct.prototype,"tooltipPlacement",2),u([h({type:Boolean})],ct.prototype,"hoist",2),K("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}}),K("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}}),ct.define("sl-copy-button");const Sh=[ps,E`
    :host {
        display: inline-block;
        margin: var(--example-margin, var(--global-padding) 0 var(--global-padding) 0);
        width: 100%;
    }

    .selector {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }

    button {
        cursor: pointer;
        background: var(--background-color);
        border: 1px dashed var(--hrcolor);
        border-radius: 0;
        padding: var(--global-padding) var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--font-color-sub1);
        transition: color 0.15s, border-color 0.15s;
    }

    button:hover {
        color: var(--primary-color);
        border-color: var(--primary-color);
    }

    /* Inline mode */

    .inline-example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .inline-selector-row {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-top: var(--global-padding-double);
    }

    .inline-example-desc {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        display: inline-block;
        border-left: 2px solid var(--secondary-color);
        padding-left: var(--global-padding-double);
        height: calc(var(--global-padding) * 3);
        padding-top: var(--global-padding);
    }

    .code-container {
        position: relative;
    }

    .floating-actions {
        position: absolute;
        top: var(--global-padding);
        right: var(--global-padding);
        z-index: 1;
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .floating-copy {
        --sl-color-primary-600: var(--primary-color);
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }

    .floating-expand::part(base) {
        color: var(--font-color-sub1);
    }
    .floating-expand::part(base):hover {
        color: var(--primary-color);
    }

    .floating-actions sl-tooltip {
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: inherit;
        --sl-tooltip-padding: var(--global-padding);
        --sl-tooltip-arrow-size: 6px;
    }
    .floating-actions sl-tooltip::part(body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .floating-copy::part(tooltip__body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    sl-dropdown {
        margin-top: 0;
    }
    
    pp-code-viewer {
        margin-top: var(--code-viewer-margin-top, var(--global-padding));
    }
`],Fr=E`
    /* Direct sl-tooltip styling (used by pp-raw-viewer-btn etc.) */
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

    /* sl-copy-button forwarded tooltip parts (tooltip lives inside
       sl-copy-button's shadow DOM and is exposed via exportparts) */
    sl-copy-button::part(tooltip__base){
        font-family: var(--font-stack), monospace;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-copy-button::part(tooltip__body){
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        background-color: var(--background-color);
        color: var(--font-color);
        border: 1px dashed var(--secondary-color);
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-copy-button::part(tooltip__base__arrow){
        background-color: var(--secondary-color);
    }
`;var Nh=Object.defineProperty,Th=Object.getOwnPropertyDescriptor,St=(e,t,o,r)=>{for(var i=r>1?void 0:r?Th(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Nh(t,o,i),i};p.PpExampleSelector=class extends Q{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.descriptionsJson="",this.mode="drawer",this.codeLanguage="json",this.hideLabel=!1,this.showExpand=!1,this.exampleTitle="Example",this.entries=[],this.descriptions={},this.selectedIndex=0}willUpdate(t){(t.has("examplesData")||t.has("mockJson")||t.has("examplesJson")||t.has("descriptionsJson"))&&this.buildEntries()}buildEntries(){const t=[];let o=this.mockJson,r={};if(this.examplesData)try{const i=JSON.parse(this.examplesData);i.mockJson&&(o=i.mockJson),i.examples&&(r=i.examples)}catch{}if(this.examplesJson)try{r={...r,...JSON.parse(this.examplesJson)}}catch{}for(const[i,s]of Object.entries(r))s&&t.push({key:i,json:s});if(o&&t.push({key:"",json:o}),this.entries=t,this.selectedIndex=0,this.descriptionsJson)try{this.descriptions=JSON.parse(this.descriptionsJson)}catch{this.descriptions={}}else this.descriptions={}}showExample(t){let o=t.json;if(this.codeLanguage==="json")try{o=JSON.stringify(JSON.parse(t.json),null,2)}catch{}const r=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:t.key,json:o,language:this.codeLanguage}});this.dispatchEvent(r)}handleSelect(t){var i,s;const o=(s=(i=t.detail)==null?void 0:i.item)==null?void 0:s.value;if(o===void 0)return;const r=parseInt(o,10);r>=0&&r<this.entries.length&&this.showExample(this.entries[r])}render(){if(!this.entries.length)return y;if(this.mode==="inline")return this.renderInline();if(this.entries.length===1){const t=this.entries[0];return d`
        <div class="selector">
          <button @click=${()=>this.showExample(t)}>${t.key}</button>
        </div>
      `}return d`
      <div class="selector">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>View Example...</sl-button>
          <sl-menu @sl-select=${this.handleSelect}>
            ${this.entries.map((t,o)=>d`
              <sl-menu-item value="${o}">${t.key}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `}inlineLabel(t){return t.toLowerCase().includes("example")?t:`${t} Example`}expandToDrawer(t){this.dispatchEvent(new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.exampleTitle,json:t,language:this.codeLanguage}}))}renderCodeBlock(t){return d`
      <div class="code-container">
        <div class="floating-actions">
          ${this.showExpand?d`
            <sl-tooltip content="view expanded example">
              <sl-icon-button name="arrows-fullscreen" label="Expand"
                class="floating-expand"
                @click=${()=>this.expandToDrawer(t)}></sl-icon-button>
            </sl-tooltip>
          `:y}
          <sl-copy-button .value=${t} class="floating-copy"></sl-copy-button>
        </div>
        <pp-code-viewer .code=${t} .language=${this.codeLanguage}
            ?pretty=${this.codeLanguage==="json"}></pp-code-viewer>
      </div>
    `}renderInline(){const t=this.entries[this.selectedIndex];if(this.entries.length===1)return d`
        ${this.hideLabel?y:d`<div class="inline-example-label">${this.inlineLabel(t.key)}</div>`}
        ${this.renderCodeBlock(t.json)}
      `;const o=this.descriptions[t.key];return d`
      ${this.hideLabel?y:d`<div class="inline-example-label">Example</div>`}
      ${this.renderCodeBlock(t.json)}
      <div class="inline-selector-row">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>${this.inlineLabel(t.key)}</sl-button>
          <sl-menu @sl-select=${this.handleInlineSelect}>
            ${this.entries.map((r,i)=>d`
              <sl-menu-item value="${i}">${this.inlineLabel(r.key)}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
        ${o?d`<span class="inline-example-desc">${o}</span>`:y}
      </div>
    `}handleInlineSelect(t){var r,i;const o=(i=(r=t.detail)==null?void 0:r.item)==null?void 0:i.value;o!==void 0&&(this.selectedIndex=parseInt(o,10))}},p.PpExampleSelector.styles=[...Sh,Fr],St([h({attribute:"examples-data"})],p.PpExampleSelector.prototype,"examplesData",2),St([h({attribute:"mock-json"})],p.PpExampleSelector.prototype,"mockJson",2),St([h({attribute:"examples-json"})],p.PpExampleSelector.prototype,"examplesJson",2),St([h({attribute:"descriptions-json"})],p.PpExampleSelector.prototype,"descriptionsJson",2),St([h()],p.PpExampleSelector.prototype,"mode",2),St([h({attribute:"code-language"})],p.PpExampleSelector.prototype,"codeLanguage",2),St([h({type:Boolean,attribute:"hide-label"})],p.PpExampleSelector.prototype,"hideLabel",2),St([h({type:Boolean,attribute:"show-expand"})],p.PpExampleSelector.prototype,"showExpand",2),St([h({attribute:"example-title"})],p.PpExampleSelector.prototype,"exampleTitle",2),St([k()],p.PpExampleSelector.prototype,"entries",2),St([k()],p.PpExampleSelector.prototype,"descriptions",2),St([k()],p.PpExampleSelector.prototype,"selectedIndex",2),p.PpExampleSelector=St([q("pp-example-selector")],p.PpExampleSelector);const kh=[ps,E`
    :host {
        display: block;
    }

    .media-type-ref {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        padding: 0 0 var(--global-padding);
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

    .media-type-extensions {
        margin-top: var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
        padding-top: var(--global-padding-double);
    }

    .media-type-extensions h4 {
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 0 0 var(--global-padding) 0;
    }

    /* Split panel (wide layout) */
    .schema-split {
        --divider-width: 2px;
        --divider-hit-area: 12px;
        margin-top: var(--global-padding);
        overflow: hidden;
        grid-template-rows: 1fr;
    }
    .schema-split::part(divider) {
        background-color: var(--secondary-color);
    }
    .schema-split sl-icon[slot="divider"] {
        position: absolute;
        left: 2px;
        border-radius: 0;
        background: var(--secondary-color);
        color: var(--background-color);
        padding: 0;
        width: 10px;
        height: 40px;
    }
    .split-pane {
        height: 100%;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-dimmer) transparent;
    }
    .split-pane::-webkit-scrollbar { width: 6px; }
    .split-pane::-webkit-scrollbar-track { background: transparent; }
    .split-pane::-webkit-scrollbar-thumb { background: var(--secondary-color-dimmer); border-radius: 0; }
    .schema-props-pane {
        padding: 0 var(--global-padding-double) var(--global-padding-double) 0;
    }
    .schema-example-pane {
        padding: 0 0 0 var(--global-padding-double);
        --code-accent-color: var(--primary-color);
        --code-border-color: var(--primary-color-lowalpha);
        --example-margin: 0;
        --code-viewer-margin-top: 0;
    }
`];var Dh=Object.defineProperty,Eh=Object.getOwnPropertyDescriptor,we=(e,t,o,r)=>{for(var i=r>1?void 0:r?Eh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Dh(t,o,i),i};p.PpMediaTypeSelector=class extends Q{constructor(){super(...arguments),this.contentJson="",this.mediaTypes=[],this.selectedIndex=0,this.schemasIdentical=!1,this.wide=!1,this.resizeObserver=null,this._sizePending=!1,this._rafId=0}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.wide=this.offsetWidth>=900,this.resizeObserver=new ResizeObserver(t=>{for(const o of t)this.wide=o.contentRect.width>=900}),this.resizeObserver.observe(this)},0)}disconnectedCallback(){var t;super.disconnectedCallback(),cancelAnimationFrame(this._rafId),(t=this.resizeObserver)==null||t.disconnect(),this.resizeObserver=null}updated(t){(t.has("wide")||t.has("selectedIndex")||t.has("mediaTypes"))&&this.sizeSplitPanel()}sizeSplitPanel(){!this.splitPanel||!this.propsPane||this._sizePending||(this._sizePending=!0,this._rafId=requestAnimationFrame(()=>{if(this._sizePending=!1,!this.splitPanel||!this.propsPane)return;const o=Array.from(this.propsPane.children).reduce((w,f)=>w+f.offsetHeight,0),r=getComputedStyle(this.propsPane),i=parseFloat(r.paddingTop)+parseFloat(r.paddingBottom),s=o+i,a=document.documentElement.clientHeight||800,n=this.mediaTypes[this.selectedIndex],l=this.getPropCount(n);let c;l>=6?c=Math.max(300,Math.min(s,a*.6)):c=Math.max(200,s);const g=getComputedStyle(this.splitPanel),m=parseFloat(g.paddingTop)+parseFloat(g.paddingBottom);this.splitPanel.style.height=`${c+m}px`}))}getPropCount(t){const o=t!=null&&t.isArray&&(t!=null&&t.itemsSchemaJson)?t.itemsSchemaJson:t==null?void 0:t.schemaJson;if(!o)return 0;try{const r=JSON.parse(o);return r.properties?Object.keys(r.properties).length:0}catch{return 0}}isComplexWithExample(t){if(!t.schemaJson&&!(t.isArray&&t.itemsSchemaJson))return!1;const o=t.isArray&&t.itemsSchemaJson?t.itemsSchemaJson:t.schemaJson;if(!o)return!1;try{const r=JSON.parse(o),i=r.properties||r.allOf||r.oneOf||r.anyOf,s=!!(t.mockJson||t.mockYaml||t.mockXml||t.examples&&Object.keys(t.examples).length);return!!i&&s}catch{return!1}}willUpdate(t){if(t.has("contentJson")&&this.contentJson){try{this.mediaTypes=JSON.parse(this.contentJson)}catch{this.mediaTypes=[]}const o=this.mediaTypes.findIndex(r=>r.mediaType.toLowerCase()==="application/json");this.selectedIndex=o>=0?o:0,this.schemasIdentical=this.mediaTypes.length>1&&new Set(this.mediaTypes.map(r=>this.schemaFingerprint(r))).size===1}}schemaFingerprint(t){return t.isArray&&t.itemsRef?`array:${t.itemsRef.slug}:${t.itemsSchemaJson||t.schemaJson}`:t.schemaRef?`ref:${t.schemaRef.componentType}/${t.schemaRef.slug}`:`inline:${t.schemaJson}`}getMockAndLanguage(t){const o=t.mediaType.toLowerCase();return(o.includes("yaml")||o.includes("x-yaml"))&&t.mockYaml?{mock:t.mockYaml,language:"yaml"}:o.includes("xml")&&t.mockXml?{mock:t.mockXml,language:"xml"}:{mock:t.mockJson||"",language:"json"}}renderSchemaHeader(t){return t.isArray&&t.itemsRef?d`
                <div class="media-type-ref">
                    <span class="media-type-label">${t.mediaType}</span>
                    <span class="array-type">Array&lt;${Dt(t.itemsRef)}&gt;</span>
                </div>`:t.schemaRef?d`
                <div class="media-type-ref">
                    <span class="media-type-label">${t.mediaType}</span>
                    ${Dt(t.schemaRef)}
                </div>`:t.schemaJson?d`<div class="media-type-label">${t.mediaType}</div>`:y}renderSchemaProperties(t){if(t.isArray&&t.itemsRef){const o=t.itemsSchemaJson||t.schemaJson;return o?d`<pp-schema-properties schema-json=${o}></pp-schema-properties>`:y}return t.schemaRef?t.schemaJson?d`<pp-schema-properties schema-json=${t.schemaJson}></pp-schema-properties>`:y:t.schemaJson?d`<pp-schema-properties schema-json=${t.schemaJson}></pp-schema-properties>`:y}renderInlineExamples(t,o,r){const i=t.examples&&Object.keys(t.examples).length>0;return!i&&!r?y:d`
            <pp-example-selector mode="inline" code-language=${o}
                examples-json=${i?JSON.stringify(t.examples):""}
                mock-json=${r}>
            </pp-example-selector>
        `}renderExtensions(t){var o;return(o=t.extensions)!=null&&o.length?d`
            <div class="media-type-extensions">
                <h4>${t.mediaType} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(t.extensions)}></pp-extensions>
            </div>
        `:y}renderRefInfo(t){return t.isArray&&t.itemsRef?d`<span class="array-type">Array&lt;${Dt(t.itemsRef)}&gt;</span>`:t.schemaRef?Dt(t.schemaRef):y}renderDropdown(t){return d`
            <div class="media-type-ref">
                <sl-dropdown skidding="5" distance="5">
                    <sl-button slot="trigger" caret>${t.mediaType}</sl-button>
                    <sl-menu @sl-select=${this.handleSelect}>
                        ${this.mediaTypes.map((o,r)=>d`
                            <sl-menu-item value="${r}">${o.mediaType}</sl-menu-item>
                        `)}
                    </sl-menu>
                </sl-dropdown>
                ${this.renderRefInfo(t)}
            </div>
        `}handleSelect(t){var i,s;const o=(s=(i=t.detail)==null?void 0:i.item)==null?void 0:s.value;if(o===void 0)return;const r=parseInt(o,10);r>=0&&r<this.mediaTypes.length&&(this.selectedIndex=r)}renderSplit(t){const o=t.isArray&&t.itemsSchemaJson?t.itemsSchemaJson:t.schemaJson,{mock:r,language:i}=this.getMockAndLanguage(t),s=t.examples&&Object.keys(t.examples).length>0,a=t.mediaType||"Example";return d`
            <sl-split-panel class="schema-split" position="60">
                <div slot="start" class="split-pane schema-props-pane">
                    <pp-schema-properties schema-json=${o||""} compact></pp-schema-properties>
                </div>
                <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                <div slot="end" class="split-pane schema-example-pane">
                    <pp-example-selector mode="inline" code-language=${i}
                        mock-json=${r}
                        examples-json=${s?JSON.stringify(t.examples):""}
                        hide-label show-expand
                        example-title=${a}></pp-example-selector>
                </div>
            </sl-split-panel>
        `}render(){if(!this.mediaTypes.length)return y;if(this.mediaTypes.length===1){const i=this.mediaTypes[0];if(this.wide&&this.isComplexWithExample(i))return d`
                    ${this.renderSchemaHeader(i)}
                    ${this.renderSplit(i)}
                    ${this.renderExtensions(i)}
                `;const{mock:s,language:a}=this.getMockAndLanguage(i);return d`
                ${this.renderSchemaHeader(i)}
                ${this.renderInlineExamples(i,a,s)}
                ${this.renderSchemaProperties(i)}
                ${this.renderExtensions(i)}
            `}const t=this.mediaTypes[this.selectedIndex];if(this.schemasIdentical){const i=this.mediaTypes[0];if(this.wide&&this.isComplexWithExample(t))return d`
                    ${this.renderDropdown(t)}
                    ${this.renderSplit(t)}
                    ${this.renderExtensions(t)}
                `;const{mock:s,language:a}=this.getMockAndLanguage(t);return d`
                ${this.renderDropdown(t)}
                ${this.renderInlineExamples(t,a,s)}
                ${this.renderSchemaProperties(i)}
                ${this.renderExtensions(t)}
            `}if(this.wide&&this.isComplexWithExample(t))return d`
                ${this.renderDropdown(t)}
                ${this.renderSplit(t)}
                ${this.renderExtensions(t)}
            `;const{mock:o,language:r}=this.getMockAndLanguage(t);return d`
            ${this.renderDropdown(t)}
            ${this.renderInlineExamples(t,r,o)}
            ${this.renderSchemaProperties(t)}
            ${this.renderExtensions(t)}
        `}},p.PpMediaTypeSelector.styles=[mo,Br,kh],we([h({attribute:"content-json"})],p.PpMediaTypeSelector.prototype,"contentJson",2),we([k()],p.PpMediaTypeSelector.prototype,"mediaTypes",2),we([k()],p.PpMediaTypeSelector.prototype,"selectedIndex",2),we([k()],p.PpMediaTypeSelector.prototype,"schemasIdentical",2),we([k()],p.PpMediaTypeSelector.prototype,"wide",2),we([_(".schema-split")],p.PpMediaTypeSelector.prototype,"splitPanel",2),we([_(".schema-props-pane")],p.PpMediaTypeSelector.prototype,"propsPane",2),p.PpMediaTypeSelector=we([q("pp-media-type-selector")],p.PpMediaTypeSelector);var zh=Object.defineProperty,$h=Object.getOwnPropertyDescriptor,Yt=(e,t,o,r)=>{for(var i=r>1?void 0:r?$h(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&zh(t,o,i),i};p.PpOperationResponses=class extends Q{constructor(){super(...arguments),this.responsesJson="",this.commonHeadersJson="",this.responses=[],this.commonResponseHeaders=[],this.commonHeaderNames=new Set,this.commonErrorKeys=new Set,this.commonErrorResponses=new Map,this.successResponses=[],this.redirectResponses=[],this.errorResponses=[]}willUpdate(t){if(t.has("responsesJson")&&this.responsesJson){try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}const o=[...this.responses].sort((l,c)=>parseInt(l.statusCode,10)-parseInt(c.statusCode,10)),r=[],i=[],s=[];for(const l of o){const c=parseInt(l.statusCode,10);c>=400?s.push(l):c>=300?i.push(l):r.push(l)}this.successResponses=r,this.redirectResponses=i,this.errorResponses=s;const{commonKeys:a,commonResponses:n}=this.computeCommonErrors(s);this.commonErrorKeys=a,this.commonErrorResponses=n}if(t.has("commonHeadersJson")&&this.commonHeadersJson){try{this.commonResponseHeaders=JSON.parse(this.commonHeadersJson)}catch{this.commonResponseHeaders=[]}this.commonHeaderNames=new Set(this.commonResponseHeaders.map(o=>o.name))}}getResponseNavItems(){const t=[];for(const o of[...this.successResponses,...this.redirectResponses,...this.errorResponses])t.push({label:`${o.statusCode} ${Zr[o.statusCode]||""}`.trim(),id:`response-${o.statusCode}`});return t}scrollToHeader(t){var i,s;const o=(i=this.shadowRoot)==null?void 0:i.getElementById("header-"+t);if(!o)return;const r=o.closest("sl-details");r&&!r.open?(r.open=!0,(s=r.updateComplete)==null||s.then(()=>{o.scrollIntoView({behavior:"auto",block:"center"})})):o.scrollIntoView({behavior:"auto",block:"center"})}renderHeaderEntry(t){var o;return d`
            <div class="header-entry">
                <div class="header-name-col">
                    ${t.ref?d`
                                <pp-ref-popover registry-key="${t.ref.componentType}/${t.ref.name}"><a
                                        class="ref-link header-name" href="models/${t.ref.typeSlug}/${t.ref.slug}.html">\u279c
                                    ${t.name}</a></pp-ref-popover>`:d`<span class="header-name">${t.name}</span>`}
                </div>
                <div class="header-type-col">
                    ${t.schemaType?d`<span class="header-type">${t.schemaType}</span>`:y}
                    ${Vo(t,{includeExample:!0})}
                </div>
                <div class="header-desc-col">
                    ${t.description||y}
                </div>
            </div>
            ${(o=t.extensions)!=null&&o.length?d`
                <div class="header-entry header-entry-extensions">
                    <div class="header-name-col">
                        &nbsp;    
                    </div>
                    <div class="header-type-col">
                        &nbsp;
                    </div>
                    <div class="header-desc-col">
                        <div class="header-extensions">
                            <h4>${t.name} Header Extensions</h4>
                            <pp-extensions extensions-json=${JSON.stringify(t.extensions)}></pp-extensions>
                        </div>
                    </div>
                </div>    
            `:y}
        `}renderHeaders(t,o){if(!t||!t.length)return y;const r=t.filter(s=>!o.has(s.name)),i=t.filter(s=>o.has(s.name));return!r.length&&!i.length?y:d`
            <div class="headers-section">
                <h4 class="headers-label">Response Headers</h4>
                    ${r.length?d`
                        <div class="headers-values">
                            ${r.map(s=>this.renderHeaderEntry(s))}
                        </div>`:y}
                ${i.length?d`
                    <div class="common-link-label">\u2191 common headers</div>
                    <ul class="common-header-list">
                        ${i.map(s=>d`
                            <li><a class="header-anchor" @click=${a=>{a.preventDefault(),this.scrollToHeader(s.name)}}>${s.name}</a></li>
                        `)}
                    </ul>
                `:y}
            </div>
        `}renderLinks(t){return t!=null&&t.length?d`
            <div class="links-section">
                <h4 class="links-label">Response Links</h4>
                ${t.map(o=>d`
                    <div class="link-entry">
                        <span class="link-name">${o.ref?d`<pp-ref-popover registry-key="links/${o.ref.name}"><a class="ref-link" href="models/${o.ref.typeSlug}/${o.ref.slug}.html">\u279c ${o.name}</a></pp-ref-popover>`:o.name}</span>
                        ${o.operationId?d`<span class="link-target">\u2192 ${o.operationSlug?d`<a class="ref-link" href="operations/${o.operationSlug}.html">${o.operationId}</a>`:o.operationId}</span>`:y}
                        ${o.operationRef?d`<span class="link-target">\u2192 ${o.operationRef}</span>`:y}
                        ${o.description?d`<span class="link-desc">${o.description}</span>`:y}
                    </div>
                `)}
            </div>
        `:y}errorRefKey(t){var o;if(t.ref)return`ref:${t.ref.slug}`;if((o=t.content)!=null&&o.length){const r=t.content[0];if(r.schemaRef)return`schema:${r.schemaRef.slug}`;if(r.isArray&&r.itemsRef)return`items:${r.itemsRef.slug}`}return null}computeCommonErrors(t){const o=new Map;for(const s of t){const a=this.errorRefKey(s);if(!a)continue;const n=o.get(a);n?n.codeDescs.push({code:s.statusCode,description:s.description}):o.set(a,{resp:s,codeDescs:[{code:s.statusCode,description:s.description}]})}const r=new Set,i=new Map;for(const[s,a]of o)a.codeDescs.length>=2&&(r.add(s),i.set(s,a));return{commonKeys:r,commonResponses:i}}scrollToCommonError(t){var r;const o=(r=this.shadowRoot)==null?void 0:r.getElementById("common-error-"+t);o==null||o.scrollIntoView({behavior:"auto",block:"nearest"})}renderResponse(t,o,r){var a,n,l;const i=r?this.errorRefKey(t):null,s=i!=null&&(r==null?void 0:r.has(i));return d`
            <div class="response" id="response-${t.statusCode}">
                    <h3><span class="status-code ${fs(t.statusCode)}">${t.statusCode}</span> ${Zr[t.statusCode]||""}
                        ${t.rawJson||t.rawYaml?d`
                                <pp-raw-viewer-btn
                                        title="Response ${t.statusCode}"
                                        raw-json=${t.rawJson||""}
                                        raw-yaml=${t.rawYaml||""}
                                        start-line=${t.sourceLine||1}
                                        location=${t.location||""}>
                                </pp-raw-viewer-btn>`:y}
                    </h3>
                    ${t.descHtml?d`<div class="response-desc">${Qe(t.descHtml)}</div>`:y}
              
                ${s?d`
                            <div class="common-error-link">
                                ${t.ref?Dt(t.ref,!0):y}
                                ${!t.ref&&((a=t.content)!=null&&a.length)?this.renderMediaTypeHeader(t.content[0]):y}
                                <a class="error-anchor" @click=${c=>{c.preventDefault(),this.scrollToCommonError(i)}}>\u2191 see common example</a>
                            </div>`:t.ref?Dt(t.ref,!0):(n=t.content)!=null&&n.length?d`<pp-media-type-selector content-json=${JSON.stringify(t.content)}></pp-media-type-selector>`:y}
                ${this.renderHeaders(t.headers??[],o)}
                ${this.renderLinks(t.links??[])}
                ${(l=t.extensions)!=null&&l.length?d`
                    <div class="response-extensions">
                        <h4>Response ${t.statusCode} Extensions</h4>
                        <pp-extensions extensions-json=${JSON.stringify(t.extensions)}></pp-extensions>
                    </div>`:y}
            </div>
        `}renderMediaTypeHeader(t){return t.isArray&&t.itemsRef?d`
                <span class="media-type-label">${t.mediaType}</span>
                <span class="array-type">Array&lt;${Dt(t.itemsRef)}&gt;</span>
            `:t.schemaRef?d`
                <span class="media-type-label">${t.mediaType}</span>
                ${Dt(t.schemaRef)}
            `:y}renderCommonErrors(t,o){return t.size?d`
            <div class="response-group-heading"><h4>Common Error Responses</h4></div>
            ${[...t.entries()].map(([r,{resp:i,codeDescs:s}])=>{var a;return d`
                <div class="response common-error-response" id="common-error-${r}">
                    <div class="common-error-grid">
                        ${s.map(({code:n,description:l})=>d`
                            <div class="common-error-code"><span class="${fs(n)}">${n}</span> ${Zr[n]||""}</div>
                            <div class="common-error-desc">${l}</div>
                        `)}
                    </div>
                    ${i.ref?Dt(i.ref,!0):(a=i.content)!=null&&a.length?d`<pp-media-type-selector content-json=${JSON.stringify(i.content)}></pp-media-type-selector>`:y}
                    ${this.renderHeaders(i.headers??[],o)}
                </div>
            `})}
        `:y}render(){if(!this.responses.length)return y;const t=this.commonHeaderNames,o=this.commonErrorKeys,r=this.commonErrorResponses;return d`
            <h2>Responses</h2>
            ${this.successResponses.map(i=>this.renderResponse(i,t))}
            ${this.redirectResponses.length?d`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Redirect Responses</h3></span>
                    ${this.redirectResponses.map(i=>this.renderResponse(i,t))}
                </sl-details>
            `:y}
            ${this.commonResponseHeaders.length?d`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Common Response Headers</h3></span>
                    <div class="property-box">
                        ${this.commonResponseHeaders.map(i=>d`
                            <div id="header-${i.name}">${this.renderHeaderEntry(i)}</div>
                        `)}
                    </div>
                </sl-details>
            `:y}
            ${this.errorResponses.length||r.size?d`
                <sl-details class="pp-details">
                    <div slot="summary" class="pp-details-summary"><h3>Error Responses</h3></div>
                    ${this.renderCommonErrors(r,t)}
                    ${this.errorResponses.map(i=>this.renderResponse(i,t,o))}
                </sl-details>
            `:y}
        `}},p.PpOperationResponses.styles=[mo,Yr,Br,Qn,Ih,Ah],Yt([h({attribute:"responses-json"})],p.PpOperationResponses.prototype,"responsesJson",2),Yt([h({attribute:"common-headers-json"})],p.PpOperationResponses.prototype,"commonHeadersJson",2),Yt([k()],p.PpOperationResponses.prototype,"responses",2),Yt([k()],p.PpOperationResponses.prototype,"commonResponseHeaders",2),Yt([k()],p.PpOperationResponses.prototype,"commonHeaderNames",2),Yt([k()],p.PpOperationResponses.prototype,"commonErrorKeys",2),Yt([k()],p.PpOperationResponses.prototype,"commonErrorResponses",2),Yt([k()],p.PpOperationResponses.prototype,"successResponses",2),Yt([k()],p.PpOperationResponses.prototype,"redirectResponses",2),Yt([k()],p.PpOperationResponses.prototype,"errorResponses",2),p.PpOperationResponses=Yt([q("pp-operation-responses")],p.PpOperationResponses);const _h=E`
    :host {
        display: block;
    }

    .callback-entry {
        margin-bottom: var(--global-padding-double);
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
        padding: var(--global-padding-double);
    }

    .callback-entry:last-child {
        margin-bottom: 0;
    }

    .callback-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding-double);
    }

    .callback-operation {
        margin-top: var(--global-padding-double);
        padding-top: var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }

    .callback-operation:first-child {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
    }

    .callback-method-expression {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-bottom: var(--global-padding-double);
    }

    .callback-expression {
        font-family: var(--font-stack), monospace;
        color: var(--primary-color);
        word-break: break-all;
    }

    .callback-desc {
        color: var(--font-color-sub1);
        margin-bottom: var(--global-padding-double);
    }

    .callback-section-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding);
        margin-top: var(--global-padding-double);
    }

    .callback-response {
        display: flex;
        align-items: baseline;
        gap: var(--global-padding-double);
        padding: var(--global-padding) 0;
    }

    .callback-response-code {
        font-family: var(--font-stack-bold), monospace;
    }

    .callback-response-desc {
        color: var(--font-color-sub1);
    }

`;var Oh=Object.defineProperty,Ph=Object.getOwnPropertyDescriptor,bs=(e,t,o,r)=>{for(var i=r>1?void 0:r?Ph(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Oh(t,o,i),i};p.PpOperationCallbacks=class extends Q{constructor(){super(...arguments),this.callbacksJson="",this.callbacks=[]}willUpdate(t){if(t.has("callbacksJson")&&this.callbacksJson)try{this.callbacks=JSON.parse(this.callbacksJson)}catch{this.callbacks=[]}}renderRequestBody(t){var o;return t.ref?d`<div class="callback-section-label">Request Body</div>${Dt(t.ref,!0)}`:(o=t.content)!=null&&o.length?d`
            <div class="callback-section-label">Request Body${t.required?" (required)":""}</div>
            ${t.descHtml?d`<div class="callback-desc">${Qe(t.descHtml)}</div>`:y}
            <pp-media-type-selector content-json=${JSON.stringify(t.content)}></pp-media-type-selector>
        `:y}renderResponses(t){return t!=null&&t.length?d`
            <div class="callback-section-label">Responses</div>
            ${t.map(o=>{var r;return d`
                <div class="callback-response">
                    <span class="callback-response-code ${fs(o.statusCode)}">${o.statusCode}</span>
                    <span class="callback-response-code">${Zr[o.statusCode]||""}</span>
                    ${o.descHtml?d`<span class="callback-response-desc">${Qe(o.descHtml)}</span>`:o.description?d`<span class="callback-response-desc">${o.description}</span>`:y}
                </div>
                ${o.ref?Dt(o.ref,!0):y}
                ${!o.ref&&((r=o.content)!=null&&r.length)?d`<pp-media-type-selector content-json=${JSON.stringify(o.content)}></pp-media-type-selector>`:y}
            `})}
        `:y}renderCallbackOperation(t){return d`
            <div class="callback-operation">
                <div class="callback-method-expression">
                    <pb33f-http-method method=${t.method}></pb33f-http-method>
                    <span class="callback-expression">${t.expression}</span>
                </div>
                ${t.descHtml?d`<div class="callback-desc">${Qe(t.descHtml)}</div>`:y}
                ${t.requestBody?this.renderRequestBody(t.requestBody):y}
                ${this.renderResponses(t.responses??[])}
            </div>
        `}render(){return this.callbacks.length?d`
            ${this.callbacks.map(t=>d`
                <div class="callback-entry">
                    <div class="callback-name">
                        ${t.ref?Dt(t.ref,!0):y}
                        ${t.name}
                    </div>
                    ${t.operations.map(o=>this.renderCallbackOperation(o))}
                </div>
            `)}
        `:y}},p.PpOperationCallbacks.styles=[mo,Br,Qn,_h],bs([h({attribute:"callbacks-json"})],p.PpOperationCallbacks.prototype,"callbacksJson",2),bs([k()],p.PpOperationCallbacks.prototype,"callbacks",2),p.PpOperationCallbacks=bs([q("pp-operation-callbacks")],p.PpOperationCallbacks);const Rh=E`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    h3 {
        margin-top: var(--subheader-margin-top);
        margin-bottom: 0;
        padding-bottom: var(--subheader-padding-bottom);
        font-size: var(--h3-size);
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px dashed var(--hrcolor);
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

    .property-grid {
        border: 1px dashed var(--hrcolor);
        margin-top: var(--global-padding-double);
        margin-bottom: var(--global-padding-double);
    }

    .property-grid-entry {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 0 1rem;
        padding: var(--global-padding);
        border-top: 1px dotted var(--hrcolor);
    }

    .property-grid-entry:first-child {
        border-top: none;
    }

    .property-grid-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub2);
        text-align: right;
    }

    .property-grid-value {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .property-grid-entry .enum-grid {
        margin-top: 0;
    }

    .property-grid-value code {
        color: var(--warn-400);
    }

    .enum-section-full {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        padding: var(--global-padding);
        border-top: 1px dotted var(--hrcolor);
    }

    .example-object {
        margin-bottom: 1rem;
        padding: var(--global-padding);
        border-bottom: 1px dotted var(--secondary-color-dimmer);
    }

    .example-object:last-child {
        border-bottom: none;
    }

    .example-header {
        display: flex;
        align-items: baseline;
        gap: var(--global-padding);
    }

    .example-summary {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        font-size: 0.9em;
    }

    .example-external a {
        color: var(--terminal-text);
        text-decoration: none;
        font-family: var(--font-stack), monospace;
    }

    .example-external a:hover {
        text-decoration: underline;
    }

    a.ref-type-link,
    a.ref-type-link:visited,
    a.ref-type-link:active {
        color: var(--terminal-text);
        text-decoration: none;
        font-family: var(--font-stack), monospace;
    }

    a.ref-type-link:hover {
        text-decoration: underline;
    }

    /* Split panel (wide layout) */
    .schema-split {
        --divider-width: 2px;
        --divider-hit-area: 12px;
        margin-top: var(--global-padding-double);
        overflow: hidden;
        grid-template-rows: 1fr;
        border-top: 1px solid var(--secondary-color-lowalpha);
        border-bottom: 1px solid var(--secondary-color-lowalpha);
        padding-top: var(--global-padding);
        padding-bottom: var(--global-padding);
        
    }
    .schema-split::part(divider) {
        background-color: var(--secondary-color);
    }
    .schema-split sl-icon[slot="divider"] {
        position: absolute;
        left: 2px;
        border-radius: 0;
        background: var(--secondary-color);
        color: var(--background-color);
        padding: 0;
        width: var(--global-padding);
        height: calc(var(--global-padding) * 4);
    }

    /* Shared pane styles */
    .split-pane {
        height: 100%;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-dimmer) transparent;
    }
    .split-pane::-webkit-scrollbar {
        width: 6px;
    }
    .split-pane::-webkit-scrollbar-track {
        background: transparent;
    }
    .split-pane::-webkit-scrollbar-thumb {
        background: var(--secondary-color-dimmer);
        border-radius: 0;
    }
    .split-pane h3 {
        position: sticky;
        top: 0;
        background: var(--background-color);
        z-index: 1;
        margin-top: 0;
        padding: 0 0 var(--global-padding) 0;
    }

    /* Left pane */
    .schema-props-pane {
        padding: 0 var(--global-padding-double) var(--global-padding-double) 0;
    }

    /* Right pane: flush example, primary accent colors */
    .schema-example-pane {
        padding: 0 0 0 var(--global-padding-double);
        --code-accent-color: var(--primary-color);
        --code-border-color: var(--primary-color-lowalpha);
        --example-margin: 0;
        --code-viewer-margin-top: 0;
    }

`,Uh=E`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-bottom: var(--global-padding-double);
        
    }

    h3 {
        margin: 0;
        padding-bottom: var(--subheader-padding-bottom);
        font-size: var(--h3-size);
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px dashed var(--hrcolor);
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
        font-family: var(--font-stack), monospace;
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
        position: relative;

    }

    .floating-copy {
        position: absolute;
        top: var(--global-padding);
        right: var(--global-padding);
        z-index: 1;
    }
`;var Yh=Object.defineProperty,Bh=Object.getOwnPropertyDescriptor,Me=(e,t,o,r)=>{for(var i=r>1?void 0:r?Bh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Yh(t,o,i),i};p.PpInlineCode=class extends Q{constructor(){super(...arguments),this.rawJson="",this.rawYaml="",this.startLine=1,this.title="Schema",this.location="",this.noLineNumbers=!1,this.mode="yaml"}connectedCallback(){super.connectedCallback();const t=document.body.getAttribute("data-spec-format");(t==="json"||t==="yaml")&&(this.mode=t)}render(){if(!this.rawJson&&!this.rawYaml)return y;const t=!!this.rawJson,o=!!this.rawYaml,r=this.mode==="yaml"&&o?this.rawYaml:this.rawJson,i=this.mode==="yaml"&&o?"yaml":"json",s=t&&o;return d`
      ${this.title||s?d`
      <div class="toolbar">
        ${this.title?d`<h3>${this.title}</h3>`:y}
        ${s?d`
          <div class="toggle-group">
            <button class="toggle-btn ${this.mode==="json"?"active":""}"
                    @click=${()=>this.mode="json"}>JSON</button>
            <button class="toggle-btn ${this.mode==="yaml"?"active":""}"
                    @click=${()=>this.mode="yaml"}>YAML</button>
          </div>
        `:y}
      </div>
      `:y}
      <div class="code-container">
        <sl-copy-button .value=${r} class="floating-copy"></sl-copy-button>
        <pp-code-viewer
          code=${r}
          language=${i}
          ?pretty=${i==="json"}
          ?line-numbers=${!this.noLineNumbers&&(i==="json"?r.includes(`
`)||r.startsWith("{")||r.startsWith("["):r.indexOf(`
`)!==-1)}
          start-line=${this.startLine}
          location=${this.location}>
        </pp-code-viewer>
      </div>
    `}},p.PpInlineCode.styles=[Uh,Fr],Me([h({attribute:"raw-json"})],p.PpInlineCode.prototype,"rawJson",2),Me([h({attribute:"raw-yaml"})],p.PpInlineCode.prototype,"rawYaml",2),Me([h({attribute:"start-line",type:Number})],p.PpInlineCode.prototype,"startLine",2),Me([h()],p.PpInlineCode.prototype,"title",2),Me([h()],p.PpInlineCode.prototype,"location",2),Me([h({attribute:"no-line-numbers",type:Boolean})],p.PpInlineCode.prototype,"noLineNumbers",2),Me([k()],p.PpInlineCode.prototype,"mode",2),p.PpInlineCode=Me([q("pp-inline-code")],p.PpInlineCode);var Hh=Object.defineProperty,Qh=Object.getOwnPropertyDescriptor,bt=(e,t,o,r)=>{for(var i=r>1?void 0:r?Qh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Hh(t,o,i),i};p.PpModelPage=class extends Q{constructor(){super(...arguments),this.modelJson="",this.name="",this.rawYaml="",this.schemaRawYaml="",this.schemaRawJson="",this.schemaStartLine=1,this.startLine=1,this.location="",this.mockJson="",this.parsed=null,this.wide=!1,this.exampleJson="",this.resizeObserver=null,this._sizePending=!1,this._rafId=0}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.wide=this.offsetWidth>=900,this.resizeObserver=new ResizeObserver(t=>{for(const o of t)this.wide=o.contentRect.width>=900}),this.resizeObserver.observe(this)},0)}disconnectedCallback(){var t;super.disconnectedCallback(),cancelAnimationFrame(this._rafId),(t=this.resizeObserver)==null||t.disconnect(),this.resizeObserver=null}updated(t){(t.has("wide")||t.has("parsed")||t.has("exampleJson"))&&this.sizeSplitPanel()}sizeSplitPanel(){!this.splitPanel||!this.propsPane||this._sizePending||(this._sizePending=!0,this._rafId=requestAnimationFrame(()=>{var m;if(this._sizePending=!1,!this.splitPanel||!this.propsPane)return;const o=Array.from(this.propsPane.children).reduce((w,f)=>w+f.offsetHeight,0),r=getComputedStyle(this.propsPane),i=parseFloat(r.paddingTop)+parseFloat(r.paddingBottom),s=o+i,a=document.documentElement.clientHeight||800,n=(m=this.parsed)!=null&&m.properties?Object.keys(this.parsed.properties).length:0;let l;n>=6?l=Math.max(300,Math.min(s,a*.6)):l=Math.max(200,s);const c=getComputedStyle(this.splitPanel),g=parseFloat(c.paddingTop)+parseFloat(c.paddingBottom);this.splitPanel.style.height=`${l+g}px`}))}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}if(t.has("parsed")||t.has("mockJson")){const o=this.parsed;(o==null?void 0:o.example)!==void 0?this.exampleJson=JSON.stringify(o.example,null,2):this.exampleJson=this.mockJson||""}}renderExamples(t,o){if(t.examples){const i={},s={};for(const[n,l]of Object.entries(t.examples)){l.value!==void 0&&(i[n]=JSON.stringify(l.value,null,2));const c=l.description||l.summary||"";c&&(s[n]=c)}if(!Object.keys(i).length)return y;const a=Object.keys(s).length?JSON.stringify(s):"";return d`<pp-example-selector mode="inline"
        examples-json=${JSON.stringify(i)}
        descriptions-json=${a}></pp-example-selector>`}const r=t.example??(o==null?void 0:o.example);return r!==void 0?d`<pp-example-selector mode="inline" mock-json=${JSON.stringify(r,null,2)}></pp-example-selector>`:y}collectSchemaEntries(t){var r;const o=[];t.type&&o.push({label:"type",value:t.type+(t.format?` (${t.format})`:""),isCode:!0}),t.default!==void 0&&o.push({label:"default",value:JSON.stringify(t.default),isCode:!0});for(const i of _n(t))o.push(i);return(r=t.enum)!=null&&r.length&&o.push({label:"enum",value:d`<div class="enum-grid">${t.enum.map(i=>d`<span class="enum-value">${JSON.stringify(i)}</span>`)}</div>`}),o}renderPropertyGrid(t){return t.length?d`
      <div class="property-grid">
        ${t.map(o=>d`
          <div class="property-grid-entry">
            <span class="property-grid-label">${o.label}</span>
            <span class="property-grid-value">${o.isCode?d`<code>${o.value}</code>`:o.value}</span>
          </div>
        `)}
      </div>
    `:y}renderParameter(t){const o=t.schema||{},r=[{label:"name",value:t.name},{label:"in",value:t.in}];return t.required!==void 0&&r.push({label:"required",value:String(t.required)}),t.deprecated&&r.push({label:"deprecated",value:"true"}),r.push(...this.collectSchemaEntries(o)),d`
      ${o.type!=="boolean"?this.renderExamples(t,o):y}
      ${this.renderPropertyGrid(r)}
    `}renderHeader(t){const o=t.schema||{},r=[];return t.required&&r.push({label:"required",value:"true"}),t.deprecated&&r.push({label:"deprecated",value:"true"}),r.push(...this.collectSchemaEntries(o)),d`
      ${this.renderExamples(t,o)}
      ${this.renderPropertyGrid(r)}
    `}renderSchema(t){if(!(t.properties||t.allOf||t.oneOf||t.anyOf)){const i=this.collectSchemaEntries(t);return d`
        ${t.type!=="boolean"&&this.exampleJson?d`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`:y}
        ${this.renderPropertyGrid(i)}
      `}const r=t.properties?"Properties":t.allOf?"Composition":"Variants";return this.wide&&this.exampleJson?this.renderSchemaSplit(r):this.renderSchemaStacked(r)}renderSchemaSplit(t){return d`
      <sl-split-panel class="schema-split" position="60">
        <div slot="start" class="split-pane schema-props-pane">
          <h3>${t}</h3>
          <pp-schema-properties schema-json=${this.modelJson} compact></pp-schema-properties>
        </div>
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>
        <div slot="end" class="split-pane schema-example-pane">
          <pp-example-selector mode="inline" mock-json=${this.exampleJson} hide-label show-expand
            example-title="${this.name} Example"></pp-example-selector>
        </div>
      </sl-split-panel>
    `}renderSchemaStacked(t){return d`
      ${this.exampleJson?d`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`:y}
      <h3>${t}</h3>
      <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
    `}render(){if(!this.parsed)return y;const t=this.parsed;return t.in?this.renderParameter(t):t.schema&&!t.properties&&!t.in?this.renderHeader(t):this.renderSchema(t)}},p.PpModelPage.styles=[mo,Yr,Rh],bt([h({attribute:"model-json"})],p.PpModelPage.prototype,"modelJson",2),bt([h()],p.PpModelPage.prototype,"name",2),bt([h({attribute:"raw-yaml"})],p.PpModelPage.prototype,"rawYaml",2),bt([h({attribute:"schema-raw-yaml"})],p.PpModelPage.prototype,"schemaRawYaml",2),bt([h({attribute:"schema-raw-json"})],p.PpModelPage.prototype,"schemaRawJson",2),bt([h({attribute:"schema-start-line",type:Number})],p.PpModelPage.prototype,"schemaStartLine",2),bt([h({attribute:"start-line",type:Number})],p.PpModelPage.prototype,"startLine",2),bt([h()],p.PpModelPage.prototype,"location",2),bt([h({attribute:"mock-json"})],p.PpModelPage.prototype,"mockJson",2),bt([k()],p.PpModelPage.prototype,"parsed",2),bt([k()],p.PpModelPage.prototype,"wide",2),bt([k()],p.PpModelPage.prototype,"exampleJson",2),bt([_(".schema-split")],p.PpModelPage.prototype,"splitPanel",2),bt([_(".schema-props-pane")],p.PpModelPage.prototype,"propsPane",2),p.PpModelPage=bt([q("pp-model-page")],p.PpModelPage);const Wh=E`
  :host {
    display: block;
  }
  a {
    display: block;
    padding: 0.75rem 1rem;
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
    color: var(--font-color);
    text-decoration: none;
    transition: border-color 0.15s;
    background: var(--card-background-color);
  }
  a:hover {
    border-color: var(--secondary-color);
    text-decoration: none;
  }
  strong {
    display: block;
    margin-bottom: 0.2rem;
    font-family: var(--font-stack-bold);
    color: var(--primary-color);
  }
  p {
    color: var(--font-color-sub1);
    margin: 0;
  }
`;var Zh=Object.defineProperty,Fh=Object.getOwnPropertyDescriptor,Gr=(e,t,o,r)=>{for(var i=r>1?void 0:r?Fh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Zh(t,o,i),i};p.PpModelCard=class extends Q{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return d`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?d`<p>${this.description}</p>`:""}
      </a>
    `}},p.PpModelCard.styles=Wh,Gr([h()],p.PpModelCard.prototype,"name",2),Gr([h()],p.PpModelCard.prototype,"href",2),Gr([h()],p.PpModelCard.prototype,"description",2),p.PpModelCard=Gr([q("pp-model-card")],p.PpModelCard);const Gh=E`
    :host {
        display: block;
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
        border-top: 1px dashed var(--secondary-color-dimmer);
    }
`,Vh=E`
    :host {
        display: block;
        margin-bottom: var(--global-padding);
        margin-top: var(--global-padding-double);
    }

    h3 {
        margin-top: var(--global-padding);
        margin-bottom: var(--global-padding);
        padding-bottom: var(--global-padding);
        font-size: var(--h3-size);
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px dashed var(--hrcolor);
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: var(--global-padding);
        margin-bottom: var(--global-padding);
        margin-top: var(--global-padding);
    }

    .toolbar sl-input {
        flex: 1;
    }

    pb33f-paginator-navigation::part(values) {
        max-height: none;
        overflow-y: visible;
        padding-top: var(--global-padding-half);
    }
    
    .empty-state {
        color: var(--font-color-sub2);
        font-family: var(--font-stack), monospace;
        padding: var(--global-padding);
    }

    sl-dropdown::part(panel) {
        background: var(--background-color);
        border: 1px dashed var(--primary-color);
        border-radius: 0;
    }

    sl-menu-item::part(base) {
        font-family: var(--font-stack), monospace;
        color: var(--font-color);
    }

    sl-menu-item::part(checked-icon) {
        color: var(--primary-color);
    }

    sl-input::part(base) {
        background: var(--background-color);
        border: 1px solid var(--primary-color);
        border-radius: 0;
    }

    sl-input::part(input) {
        font-family: var(--font-stack), monospace;
        font-size: 0.85rem;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .filter-btn::part(base) {
        font-family: var(--font-stack), monospace;
        font-size: 0.85rem;
        color: var(--primary-color);
        background: var(--background-color);
        border: 1px solid var(--primary-color);
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .filter-btn::part(label) {
        font-family: var(--font-stack), monospace;
    }
`;var Jh=E`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) border,
      var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--sl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--sl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Filled inputs */
  .input--filled {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .input--filled:hover:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .input--filled.input--focused:not(.input--disabled) {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .input--filled.input--disabled {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--sl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--sl-color-primary-500);
    caret-color: var(--sl-input-color);
  }

  .input--filled .input__control:-webkit-autofill,
  .input--filled .input__control:-webkit-autofill:hover,
  .input--filled .input__control:-webkit-autofill:focus,
  .input--filled .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--sl-input-height-large) var(--sl-input-filled-background-color) inset !important;
  }

  .input__control::placeholder {
    color: var(--sl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--sl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  .input__prefix ::slotted(sl-icon),
  .input__suffix ::slotted(sl-icon) {
    color: var(--sl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--small {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    height: var(--sl-input-height-small);
  }

  .input--small .input__control {
    height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-small);
  }

  .input--small .input__clear,
  .input--small .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-small) * 2);
  }

  .input--small .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .input--small .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .input--medium {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    height: var(--sl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-medium);
  }

  .input--medium .input__clear,
  .input--medium .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-medium) * 2);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    height: var(--sl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    padding: 0 var(--sl-input-spacing-large);
  }

  .input--large .input__clear,
  .input--large .input__password-toggle {
    width: calc(1em + var(--sl-input-spacing-large) * 2);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  /*
   * Pill modifier
   */

  .input--pill.input--small {
    border-radius: var(--sl-input-height-small);
  }

  .input--pill.input--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .input--pill.input--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Clearable + Password Toggle
   */

  .input__clear,
  .input__password-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover,
  .input__password-toggle:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .input__clear:focus,
  .input__password-toggle:focus {
    outline: none;
  }

  /* Don't show the browser's password toggle in Edge */
  ::-ms-reveal {
    display: none;
  }

  /* Hide the built-in number spinner */
  .input--no-spin-buttons input[type='number']::-webkit-outer-spin-button,
  .input--no-spin-buttons input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    display: none;
  }

  .input--no-spin-buttons input[type='number'] {
    -moz-appearance: textfield;
  }
`,Xh=(e="value")=>(t,o)=>{const r=t.constructor,i=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(s,a,n){var l;const c=r.getPropertyOptions(e),g=typeof c.attribute=="string"?c.attribute:e;if(s===g){const m=c.converter||Fe,f=(typeof m=="function"?m:(l=m==null?void 0:m.fromAttribute)!=null?l:Fe.fromAttribute)(n,c.type);this[e]!==f&&(this[o]=f)}i.call(this,s,a,n)}},qh=E`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Kh=lr(class extends cr{constructor(e){if(super(e),e.type!==te.PROPERTY&&e.type!==te.ATTRIBUTE&&e.type!==te.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Qs(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===Tt||t===y)return t;const o=e.element,r=e.name;if(e.type===te.PROPERTY){if(t===o[r])return Tt}else if(e.type===te.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(r))return Tt}else if(e.type===te.ATTRIBUTE&&o.getAttribute(r)===t+"")return Tt;return Zl(e),t}});var P=class extends V{constructor(){super(...arguments),this.formControlController=new ja(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new oo(this,"help-text","label"),this.localize=new ht(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var e;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((e=this.input)==null?void 0:e.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(e){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=e,this.value=this.__dateInput.value}get valueAsNumber(){var e;return this.__numberInput.value=this.value,((e=this.input)==null?void 0:e.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(e){this.__numberInput.valueAsNumber=e,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(e){e.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleKeyDown(e){const t=e.metaKey||e.ctrlKey||e.shiftKey||e.altKey;e.key==="Enter"&&!t&&setTimeout(()=>{!e.defaultPrevented&&!e.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(e,t,o="none"){this.input.setSelectionRange(e,t,o)}setRangeText(e,t,o,r="preserve"){const i=t??this.input.selectionStart,s=o??this.input.selectionEnd;this.input.setRangeText(e,i,s,r),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){const e=this.hasSlotController.test("label"),t=this.hasSlotController.test("help-text"),o=this.label?!0:!!e,r=this.helpText?!0:!!t,s=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return d`
      <div
        part="form-control"
        class=${rt({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":r})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${rt({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.passwordVisible?"text":this.type}
              title=${this.title}
              name=${O(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${O(this.placeholder)}
              minlength=${O(this.minlength)}
              maxlength=${O(this.maxlength)}
              min=${O(this.min)}
              max=${O(this.max)}
              step=${O(this.step)}
              .value=${Kh(this.value)}
              autocapitalize=${O(this.autocapitalize)}
              autocomplete=${O(this.autocomplete)}
              autocorrect=${O(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${O(this.pattern)}
              enterkeyhint=${O(this.enterkeyhint)}
              inputmode=${O(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${s?d`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `:""}
            ${this.passwordToggle&&!this.disabled?d`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?d`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:d`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                `:""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};P.styles=[et,qh,Jh],P.dependencies={"sl-icon":ut},u([_(".input__control")],P.prototype,"input",2),u([k()],P.prototype,"hasFocus",2),u([h()],P.prototype,"title",2),u([h({reflect:!0})],P.prototype,"type",2),u([h()],P.prototype,"name",2),u([h()],P.prototype,"value",2),u([Xh()],P.prototype,"defaultValue",2),u([h({reflect:!0})],P.prototype,"size",2),u([h({type:Boolean,reflect:!0})],P.prototype,"filled",2),u([h({type:Boolean,reflect:!0})],P.prototype,"pill",2),u([h()],P.prototype,"label",2),u([h({attribute:"help-text"})],P.prototype,"helpText",2),u([h({type:Boolean})],P.prototype,"clearable",2),u([h({type:Boolean,reflect:!0})],P.prototype,"disabled",2),u([h()],P.prototype,"placeholder",2),u([h({type:Boolean,reflect:!0})],P.prototype,"readonly",2),u([h({attribute:"password-toggle",type:Boolean})],P.prototype,"passwordToggle",2),u([h({attribute:"password-visible",type:Boolean})],P.prototype,"passwordVisible",2),u([h({attribute:"no-spin-buttons",type:Boolean})],P.prototype,"noSpinButtons",2),u([h({reflect:!0})],P.prototype,"form",2),u([h({type:Boolean,reflect:!0})],P.prototype,"required",2),u([h()],P.prototype,"pattern",2),u([h({type:Number})],P.prototype,"minlength",2),u([h({type:Number})],P.prototype,"maxlength",2),u([h()],P.prototype,"min",2),u([h()],P.prototype,"max",2),u([h()],P.prototype,"step",2),u([h()],P.prototype,"autocapitalize",2),u([h()],P.prototype,"autocorrect",2),u([h()],P.prototype,"autocomplete",2),u([h({type:Boolean})],P.prototype,"autofocus",2),u([h()],P.prototype,"enterkeyhint",2),u([h({type:Boolean,converter:{fromAttribute:e=>!(!e||e==="false"),toAttribute:e=>e?"true":"false"}})],P.prototype,"spellcheck",2),u([h()],P.prototype,"inputmode",2),u([G("disabled",{waitUntilFirstUpdate:!0})],P.prototype,"handleDisabledChange",1),u([G("step",{waitUntilFirstUpdate:!0})],P.prototype,"handleStepChange",1),u([G("value",{waitUntilFirstUpdate:!0})],P.prototype,"handleValueChange",1),P.define("sl-input");var tg=Object.defineProperty,eg=Object.getOwnPropertyDescriptor,xe=(e,t,o,r)=>{for(var i=r>1?void 0:r?eg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&tg(t,o,i),i};const Wn={schemas:"Schemas",responses:"Responses",parameters:"Parameters",requestBodies:"Request Bodies",headers:"Headers",securitySchemes:"Security Schemes",examples:"Examples",links:"Links",callbacks:"Callbacks"},og=["GET","POST","PUT","DELETE","PATCH","OPTIONS","HEAD","QUERY"];p.PpRefList=class extends Q{constructor(){super(...arguments),this.type="operations",this.heading="",this.items=[],this.filterValue="",this.searchTerm="",this.filteredItems=[],this.filterOptions=[],this.handleClear=()=>{clearTimeout(this.searchTimeout),this.searchTerm=""}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.searchTimeout)}willUpdate(t){if(t.has("items")&&this.type==="components"){const o=new Set(this.items.map(r=>r.componentType));this.filterOptions=[...o].sort()}(t.has("items")||t.has("filterValue")||t.has("searchTerm"))&&(this.filteredItems=this.computeFiltered())}computeFiltered(){const t=this.searchTerm.toLowerCase();if(this.type==="operations"){let o=this.items;return this.filterValue&&(o=o.filter(r=>r.method.toUpperCase()===this.filterValue)),t&&(o=o.filter(r=>r.path.toLowerCase().includes(t))),o}else{let o=this.items;return this.filterValue&&(o=o.filter(r=>r.componentType===this.filterValue)),t&&(o=o.filter(r=>r.name.toLowerCase().includes(t))),o}}handleSearch(t){clearTimeout(this.searchTimeout);const o=t.target.value;this.searchTimeout=window.setTimeout(()=>{this.searchTerm=o},150)}handleFilter(t){var r,i;const o=(i=(r=t.detail)==null?void 0:r.item)==null?void 0:i.value;this.filterValue=o??""}renderToolbar(){var o,r;const t=this.type==="operations"?this.filterValue||"ALL METHODS":((o=Wn[this.filterValue])==null?void 0:o.toUpperCase())||((r=this.filterValue)==null?void 0:r.toUpperCase())||"ALL TYPES";return d`
            <div class="toolbar">
                <sl-dropdown>
                    <sl-button slot="trigger" class="filter-btn" caret size="small">
                        ${this.type==="operations"&&this.filterValue?d`<pb33f-http-method method=${this.filterValue} tiny></pb33f-http-method>`:t}
                    </sl-button>
                    <sl-menu @sl-select=${this.handleFilter}>
                        <sl-menu-item value="">
                            ${this.type==="operations"?"ALL METHODS":"ALL TYPES"}
                        </sl-menu-item>
                        ${this.type==="operations"?og.map(i=>d`
                                <sl-menu-item value=${i}><pb33f-http-method method=${i}></pb33f-http-method></sl-menu-item>`):this.filterOptions.map(i=>d`
                                <sl-menu-item value=${i}>
                                    ${Wn[i]||i}
                                </sl-menu-item>`)}
                    </sl-menu>
                </sl-dropdown>
                <sl-input
                    size="small"
                    placeholder=${this.type==="operations"?"SEARCH PATHS...":"SEARCH NAMES..."}
                    aria-label=${this.type==="operations"?"Filter by path":"Search components"}
                    clearable
                    @sl-input=${this.handleSearch}
                    @sl-clear=${this.handleClear}>
                </sl-input>
            </div>
        `}renderOperationItem(t){return d`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:var(--global-padding-half) 0">
                <pb33f-http-method method=${t.method} tiny></pb33f-http-method>
                <a style="color:var(--font-color);text-decoration:none;font-family:var(--font-stack),monospace;--op-path-text-decoration:none"
                   @mouseenter=${o=>o.target.style.setProperty("--op-path-text-decoration","underline")}
                   @mouseleave=${o=>o.target.style.setProperty("--op-path-text-decoration","none")}
                   @focus=${o=>o.target.style.setProperty("--op-path-text-decoration","underline")}
                   @blur=${o=>o.target.style.setProperty("--op-path-text-decoration","none")}
                   href="operations/${t.slug}.html">
                    <pb33f-render-operation-path path=${t.path} nowrap></pb33f-render-operation-path>
                </a>
            </div>
        `}renderComponentItem(t){return d`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">
                <pb33f-model-icon icon=${t.componentType} size="medium"></pb33f-model-icon>
                <a style="color:var(--terminal-text);text-decoration:none;font-family:var(--font-stack),monospace"
                   @mouseenter=${o=>o.target.style.textDecoration="underline"}
                   @mouseleave=${o=>o.target.style.textDecoration="none"}
                   href="models/${t.typeSlug}/${t.slug}.html"><span aria-hidden="true">\u279c</span> ${t.name}</a>
            </div>
        `}render(){if(!this.items.length)return y;const t=this.type==="operations"?this.filteredItems.map(r=>this.renderOperationItem(r)):this.filteredItems.map(r=>this.renderComponentItem(r)),o=this.items.length>20;return d`
            <h3>${this.heading}</h3>
            ${o?this.renderToolbar():y}
            ${this.filteredItems.length?d`<pb33f-paginator-navigation
                            .values=${t}
                            .label=${this.heading}
                            hideSparks>
                        </pb33f-paginator-navigation>`:d`<div class="empty-state">No matching references</div>`}
        `}},p.PpRefList.styles=Vh,xe([h()],p.PpRefList.prototype,"type",2),xe([h()],p.PpRefList.prototype,"heading",2),xe([h({type:Array})],p.PpRefList.prototype,"items",2),xe([k()],p.PpRefList.prototype,"filterValue",2),xe([k()],p.PpRefList.prototype,"searchTerm",2),xe([k()],p.PpRefList.prototype,"filteredItems",2),xe([k()],p.PpRefList.prototype,"filterOptions",2),p.PpRefList=xe([q("pp-ref-list")],p.PpRefList);var rg=Object.defineProperty,ig=Object.getOwnPropertyDescriptor,vs=(e,t,o,r)=>{for(var i=r>1?void 0:r?ig(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&rg(t,o,i),i};p.PpCrossRefs=class extends Q{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var s,a,n;const{refs:t}=this,o=(((s=t.usedByOperations)==null?void 0:s.length)??0)>0,r=(((a=t.usedByModels)==null?void 0:a.length)??0)>0,i=(((n=t.usesModels)==null?void 0:n.length)??0)>0;return!o&&!r&&!i?y:d`
            ${o?d`
                <pp-ref-list
                    type="operations"
                    heading="Consumed By"
                    .items=${t.usedByOperations}>
                </pp-ref-list>`:y}
            ${r?d`
                <pp-ref-list
                    type="components"
                    heading="Referenced By"
                    .items=${t.usedByModels}>
                </pp-ref-list>`:y}
            ${i?d`
                <pp-ref-list
                    type="components"
                    heading="References"
                    .items=${t.usesModels}>
                </pp-ref-list>`:y}
        `}},p.PpCrossRefs.styles=Gh,vs([h({attribute:"refs-json"})],p.PpCrossRefs.prototype,"refsJson",2),vs([k()],p.PpCrossRefs.prototype,"refs",2),p.PpCrossRefs=vs([q("pp-cross-refs")],p.PpCrossRefs);const sg=E`
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
`,ag=yt`
  
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
    
  pre.yaml {
      color: var(--secondary-color);
  }

    pre.json {
        color: var(--secondary-color);
    }

    /* Code blocks */

  pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
    border-radius: 0.3em;
  }


  /* Inline code */

  :not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
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

  .token.boolean,
  .token.number {
    color: var(--secondary-color);
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
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: var(--tertiary-color);
  }

  .token.atrule {
      color: var(--primary-color);
  }
  
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: var(--terminal-text);
  }

  .token.keyword {
    color: var(--primary-color);
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

 
`,ng=E`
  /* Override: number tokens use tertiary instead of secondary */
  .token.number {
    color: var(--tertiary-color);
  }

  /* Override: function/class-name tokens use secondary instead of terminal-text */
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: var(--secondary-color);
  }

  /* Override: keyword/null tokens use secondary instead of primary */
  .token.keyword,
  .token.null {
    color: var(--secondary-color);
  }
`;var lg=Object.defineProperty,cg=Object.getOwnPropertyDescriptor,Vr=(e,t,o,r)=>{for(var i=r>1?void 0:r?cg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&lg(t,o,i),i};fo.manual=!0,p.PpExampleBlock=class extends Q{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{const o=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(o,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return y;let t;try{t=fo.highlight(this.formatted,fo.languages.json,"json")}catch{t=this.formatted}return d`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${Qe(t)}</code></pre>
      </details>
    `}},p.PpExampleBlock.styles=[sg,ag,ng],Vr([h()],p.PpExampleBlock.prototype,"name",2),Vr([h({attribute:"example-json"})],p.PpExampleBlock.prototype,"exampleJson",2),Vr([k()],p.PpExampleBlock.prototype,"formatted",2),p.PpExampleBlock=Vr([q("pp-example-block")],p.PpExampleBlock);const dg=E`
    :host {
        display: block;
    }

    sl-drawer {
        --size: 50vw;
    }

    sl-drawer::part(panel) {
        background: var(--background-color);
        border-left: var(--global-padding) solid var(--secondary-color);
    }

    sl-drawer::part(header) {
        display: none;
    }

    sl-drawer::part(body) {
        padding: 0;
        display: flex;
        flex-direction: column;
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-lowalpha) var(--background-color);
    }

    .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: var(--background-color);
        border-bottom: 1px solid var(--hrcolor);
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .drawer-title {
        margin: 0;
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--primary-color);
    }

    .rich-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .component-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .drawer-component-title {
        font-family: var(--font-stack-bold), monospace;
        font-size: 1.4rem;
        color: var(--font-color);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .close-btn {
        color: var(--font-color-sub1);
        font-size: 1rem;
    }

    .code-container {
        position: relative;
        flex: 1;
    }

    .floating-copy {
        position: absolute;
        right: var(--global-padding-double);
        z-index: 1;
        --sl-color-primary-600: var(--primary-color);
        --sl-tooltip-background-color: var(--background-color);
        --sl-tooltip-color: var(--font-color);
        --sl-tooltip-border-radius: 0;
        --sl-tooltip-font-family: var(--font-stack), monospace;
        --sl-tooltip-font-size: 0.9rem;
        --sl-tooltip-padding: 0.25rem 0.75rem;
        --sl-tooltip-arrow-size: 6px;
    }

    .floating-copy::part(tooltip__body) {
        border: 1px dashed var(--secondary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    pp-code-viewer {
        width: 100%;
    }

    .format-toggle {
        display: flex;
        gap: 0.5rem;
    }

    .format-toggle button {
        cursor: pointer;
        background: none;
        border: 1px dashed var(--hrcolor);
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        padding: 0.25rem 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: color 0.15s, border-color 0.15s;
    }

    .format-toggle button.active {
        color: var(--primary-color);
        border-color: var(--primary-color);
    }

    .format-toggle button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
`;var pg=Object.defineProperty,ug=Object.getOwnPropertyDescriptor,Nt=(e,t,o,r)=>{for(var i=r>1?void 0:r?ug(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&pg(t,o,i),i};p.PpExampleDrawer=class extends Q{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.rawMode=!1,this.highlightLines="",this.startLine=1,this.location="",this.method="",this.path="",this.componentType="",this.handleShowExample=t=>{const o=t.detail;if(this.title=o.title,this.json=o.json,this.yaml=o.yaml||"",this.rawMode=o.rawMode??!1,this.highlightLines=o.highlightLines||"",this.startLine=o.startLine??1,this.location=o.location||"",this.method=o.method||"",this.path=o.path||"",this.componentType=o.componentType||"",o.language)this.format=o.language;else{const r=document.body.getAttribute("data-spec-format");r==="yaml"&&o.yaml?this.format="yaml":r==="json"&&o.json?this.format="json":this.format=o.yaml?"yaml":"json"}this.updateComplete.then(()=>{const r=this.drawer;r&&typeof r.show=="function"&&(r.updateComplete?r.updateComplete.then(()=>r.show()):r.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get copyText(){var o;const t=(o=this.shadowRoot)==null?void 0:o.querySelector("pp-code-viewer");return t?t.displayCode:this.format==="yaml"&&this.yaml?this.yaml:this.json}renderHeader(){return this.method&&this.path?d`
        <div class="rich-header">
          <pb33f-http-method method=${this.method}></pb33f-http-method>
          <pb33f-render-operation-path path=${this.path} nowrap></pb33f-render-operation-path>
        </div>
      `:this.componentType?d`
        <div class="component-header">
          <pb33f-model-icon icon=${this.componentType} size="large"></pb33f-model-icon>
          <span class="drawer-component-title">${this.title}</span>
        </div>
      `:d`<h3 class="drawer-title">${this.title||"Example"}</h3>`}render(){const t=this.format==="yaml"&&this.yaml?this.yaml:this.json,o=this.format;return d`
      <sl-drawer placement="end" no-header>
        <div class="drawer-header">
          ${this.renderHeader()}
          <div class="header-actions">
            ${this.yaml?d`
              <div class="format-toggle">
                <button class="${this.format==="json"?"active":""}"
                        ?disabled=${!this.json}
                        @click=${()=>this.format="json"}>JSON</button>
                <button class="${this.format==="yaml"?"active":""}"
                        @click=${()=>this.format="yaml"}>YAML</button>
              </div>
            `:""}
            <sl-icon-button name="x-lg" label="Close" class="close-btn"
                @click=${()=>{var r;return(r=this.drawer)==null?void 0:r.hide()}}></sl-icon-button>
          </div>
        </div>
        <div class="code-container">
          <sl-copy-button .value=${t} class="floating-copy"></sl-copy-button>
          <pp-code-viewer
            .code=${t}
            .language=${o}
            ?line-numbers=${this.rawMode}
            .pretty=${o==="json"}
            .startLine=${this.startLine}
            .location=${this.location}
            highlight-lines=${this.highlightLines}
            embedded>
          </pp-code-viewer>
        </div>
      </sl-drawer>
    `}},p.PpExampleDrawer.styles=[dg,Fr],Nt([k()],p.PpExampleDrawer.prototype,"title",2),Nt([k()],p.PpExampleDrawer.prototype,"json",2),Nt([k()],p.PpExampleDrawer.prototype,"yaml",2),Nt([k()],p.PpExampleDrawer.prototype,"format",2),Nt([k()],p.PpExampleDrawer.prototype,"rawMode",2),Nt([k()],p.PpExampleDrawer.prototype,"highlightLines",2),Nt([k()],p.PpExampleDrawer.prototype,"startLine",2),Nt([k()],p.PpExampleDrawer.prototype,"location",2),Nt([k()],p.PpExampleDrawer.prototype,"method",2),Nt([k()],p.PpExampleDrawer.prototype,"path",2),Nt([k()],p.PpExampleDrawer.prototype,"componentType",2),Nt([_("sl-drawer")],p.PpExampleDrawer.prototype,"drawer",2),p.PpExampleDrawer=Nt([q("pp-example-drawer")],p.PpExampleDrawer);const hg=E`
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
`;var gg=Object.defineProperty,mg=Object.getOwnPropertyDescriptor,Bt=(e,t,o,r)=>{for(var i=r>1?void 0:r?mg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&gg(t,o,i),i};p.PpRawViewerBtn=class extends Q{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml="",this.highlightLines="",this.startLine=1,this.location="",this.method="",this.path="",this.componentType="",this.showTextLabel=!1}showRaw(){const t=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0,method:this.method||void 0,path:this.path||void 0,componentType:this.componentType||void 0}});this.dispatchEvent(t)}render(){return!this.rawJson&&!this.rawYaml?y:d`
            <sl-tooltip content="VIEW RAW OBJECT">
                <sl-button variant="text" size="small" @click=${this.showRaw}>
                    <sl-icon slot="prefix" name="braces" label="VIEW RAW OBJECT" ></sl-icon>
                </sl-button>
            </sl-tooltip>`}},p.PpRawViewerBtn.styles=[hg,Fr],Bt([h({attribute:"title"})],p.PpRawViewerBtn.prototype,"btnTitle",2),Bt([h({attribute:"raw-json"})],p.PpRawViewerBtn.prototype,"rawJson",2),Bt([h({attribute:"raw-yaml"})],p.PpRawViewerBtn.prototype,"rawYaml",2),Bt([h({attribute:"highlight-lines"})],p.PpRawViewerBtn.prototype,"highlightLines",2),Bt([h({attribute:"start-line",type:Number})],p.PpRawViewerBtn.prototype,"startLine",2),Bt([h()],p.PpRawViewerBtn.prototype,"location",2),Bt([h()],p.PpRawViewerBtn.prototype,"method",2),Bt([h()],p.PpRawViewerBtn.prototype,"path",2),Bt([h({attribute:"component-type"})],p.PpRawViewerBtn.prototype,"componentType",2),Bt([h({type:Boolean})],p.PpRawViewerBtn.prototype,"showTextLabel",2),p.PpRawViewerBtn=Bt([q("pp-raw-viewer-btn")],p.PpRawViewerBtn);const fg=E`
    :host {
        display: block;
        position: fixed;
        top: calc(var(--pp-header-height) + 85px);
        right: 10px;
        z-index: 5;
        width: 438px;
    }

    :host([nav-hidden]) {
        width: 22px;
    }

    .nav-container {
        display: flex;
        flex-direction: row;
        border: 1px solid var(--secondary-color);
        background: var(--background-color);
        max-height: 60vh;
    }

    .nav-container:has(.collapse-tab:hover) {
        border-color: var(--primary-color);
    }

    .nav-container:has(.collapse-tab:active) {
        border-color: var(--warn-color);
    }

    nav {
        flex: 1;
        min-width: 0;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        padding: var(--global-padding-double);
    }

    :host([nav-hidden]) nav {
        display: none;
    }

    .collapse-tab {
        width: 20px;
        font-size: 55px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--secondary-color);
        cursor: pointer;
    }

    .collapse-tab:hover {
        background: var(--primary-color);
    }

    .collapse-tab:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
    }

    .collapse-tab sl-icon {
        color: var(--background-color);
        font-size: 0.7em;
    }

    .collapse-tab.flashing {
        animation: flash-warn 250ms ease forwards;
    }

    @keyframes flash-warn {
        0% { background: var(--warn-color); }
        100% { background: var(--secondary-color); }
    }

    .nav-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        cursor: pointer;
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        letter-spacing: 0.05em;
        word-break: break-all;
    }

    .nav-header sl-icon {
        flex-shrink: 0;
        color: var(--secondary-color);
    }

    .nav-sections {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
    }

    .nav-sections > li {
        padding: 0.2rem 0;
    }

    .nav-sections a {
        color: var(--font-color-sub1);
        text-decoration: none;
        cursor: pointer;
        font-family: var(--font-stack), monospace;
        font-size: 0.85rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }

    .nav-sections a:hover {
        color: var(--primary-color);
        text-decoration: underline;
    }

    .nav-sections a.active {
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
    }

    .nav-children {
        list-style: none;
        padding-left: 0.75rem;
        margin: 0;
    }

    .nav-children li {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.1rem 0;
    }

    .nav-children sl-icon {
        font-size: 0.6em;
        color: var(--secondary-color);
        flex-shrink: 0;
    }

    a.status-2xx, a.status-2xx:hover { color: var(--terminal-text); }
    a.status-3xx, a.status-3xx:hover { color: var(--primary-color); }
    a.status-4xx, a.status-4xx:hover { color: var(--warn-color); }
    a.status-5xx, a.status-5xx:hover { color: var(--error-color); }
`;var bg=Object.defineProperty,vg=Object.getOwnPropertyDescriptor,Ze=(e,t,o,r)=>{for(var i=r>1?void 0:r?vg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&bg(t,o,i),i};const Zn="pp-page-nav-collapsed",Fn="pp-page-nav-hidden";p.PpPageNav=class extends Q{constructor(){super(...arguments),this.pageTitle="",this.sectionsJson="",this.sections=[],this.collapsed=!1,this.navHidden=!1,this.activeId="",this.scrollContainer=null,this.rafId=0,this.scrollSpySuppressed=!1,this.suppressionTimerId=0,this.boundScrollHandler=()=>this.onScroll()}connectedCallback(){super.connectedCallback(),this.collapsed=localStorage.getItem(Zn)==="true",this.navHidden=localStorage.getItem(Fn)==="true"}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.scrollContainer)==null||t.removeEventListener("scroll",this.boundScrollHandler),this.clearSuppressionTimer()}clearSuppressionTimer(){this.suppressionTimerId&&(window.clearTimeout(this.suppressionTimerId),this.suppressionTimerId=0)}updated(t){t.has("navHidden")&&this.toggleAttribute("nav-hidden",this.navHidden)}willUpdate(t){if(t.has("sectionsJson")&&this.sectionsJson){try{this.sections=JSON.parse(this.sectionsJson)}catch{this.sections=[]}this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}}loadResponseChildren(){var r;const t=this.sections.find(i=>i.id==="section-responses");if(!t)return;const o=()=>{const i=document.getElementById("section-responses");i&&typeof i.getResponseNavItems=="function"&&(t.children=i.getResponseNavItems(),this.requestUpdate())};o(),(r=t.children)!=null&&r.length||customElements.whenDefined("pp-operation-responses").then(()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>o())})})}setupScrollSpy(){var o;const t=document.querySelector("pp-layout");this.scrollContainer=((o=t==null?void 0:t.shadowRoot)==null?void 0:o.querySelector(".content-panel"))||null,this.scrollContainer&&this.scrollContainer.addEventListener("scroll",this.boundScrollHandler,{passive:!0})}suppressScrollSpy(){this.scrollSpySuppressed=!0,this.clearSuppressionTimer()}scheduleScrollSpyResume(){this.clearSuppressionTimer(),this.suppressionTimerId=window.setTimeout(()=>{this.scrollSpySuppressed=!1,this.suppressionTimerId=0},150)}onScroll(){if(this.scrollSpySuppressed){this.scheduleScrollSpyResume();return}this.rafId||(this.rafId=requestAnimationFrame(()=>{this.rafId=0,this.updateActiveSection()}))}updateActiveSection(){let o="";for(const r of this.sections){const i=this.findElement(r.id);if(i&&i.getBoundingClientRect().top<=100&&(o=r.id),r.children)for(const s of r.children){const a=this.findElement(s.id);a&&a.getBoundingClientRect().top<=100&&(o=s.id)}}o&&o!==this.activeId&&(this.activeId=o)}findElement(t){const o=document.getElementById(t);if(o)return o;const r=document.getElementById("section-responses");return r!=null&&r.shadowRoot?r.shadowRoot.getElementById(t):null}navigateTo(t){this.suppressScrollSpy(),this.activeId=t;const o=this.findElement(t);if(!o)return;const r=o.closest("sl-details");r&&!r.open?(r.addEventListener("sl-after-show",()=>{o.scrollIntoView({behavior:"auto",block:"center"})},{once:!0}),r.open=!0):o.scrollIntoView({behavior:"auto",block:"center"})}toggleCollapsed(){this.collapsed=!this.collapsed,localStorage.setItem(Zn,String(this.collapsed))}toggleNavHidden(){var r,i;const t=(r=this.shadowRoot)==null?void 0:r.querySelector(".collapse-tab");t&&(t.addEventListener("animationend",()=>t.classList.remove("flashing"),{once:!0}),t.classList.add("flashing"));const o=(i=this.shadowRoot)==null?void 0:i.querySelector(".nav-container");!this.navHidden&&o?o.style.height=o.offsetHeight+"px":this.navHidden&&o&&(o.style.height=""),this.navHidden=!this.navHidden,localStorage.setItem(Fn,String(this.navHidden))}handleTabKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.toggleNavHidden())}statusColorClass(t){const o=t.substring(0,1);return o==="2"?"status-2xx":o==="3"?"status-3xx":o==="4"?"status-4xx":o==="5"?"status-5xx":""}render(){return d`
            <div class="nav-container">
                <nav aria-label="Page sections">
                    <div class="nav-header" @click=${this.toggleCollapsed}
                         aria-expanded=${!this.collapsed}>
                        <span class="nav-title">${this.pageTitle}</span>
                        <sl-icon name=${this.collapsed?"chevron-right":"chevron-down"}></sl-icon>
                    </div>
                    ${this.collapsed?y:d`
                        <ul class="nav-sections">
                            ${this.sections.map(t=>{var o;return d`
                                <li>
                                    <a href="#${t.id}"
                                       class=${t.id===this.activeId?"active":""}
                                       aria-current=${t.id===this.activeId?"true":y}
                                       @click=${r=>{r.preventDefault(),this.navigateTo(t.id)}}>
                                        ${t.label}
                                    </a>
                                    ${(o=t.children)!=null&&o.length?d`
                                        <ul class="nav-children">
                                            ${t.children.map(r=>d`
                                                <li>
                                                    <sl-icon name="chevron-right"></sl-icon>
                                                    <a href="#${r.id}"
                                                       class="${r.id===this.activeId?"active":""} ${this.statusColorClass(r.label)}"
                                                       @click=${i=>{i.preventDefault(),this.navigateTo(r.id)}}>
                                                        ${r.label}
                                                    </a>
                                                </li>
                                            `)}
                                        </ul>
                                    `:y}
                                </li>
                            `})}
                        </ul>
                    `}
                </nav>
                <div class="collapse-tab"
                     role="button"
                     tabindex="0"
                     aria-label=${this.navHidden?"Expand navigation":"Collapse navigation"}
                     @click=${this.toggleNavHidden}
                     @keydown=${this.handleTabKeydown}>
                    <sl-icon name=${this.navHidden?"chevron-left":"chevron-right"}></sl-icon>
                </div>
            </div>
        `}},p.PpPageNav.styles=[fg],Ze([h({attribute:"page-title"})],p.PpPageNav.prototype,"pageTitle",2),Ze([h({attribute:"sections-json"})],p.PpPageNav.prototype,"sectionsJson",2),Ze([k()],p.PpPageNav.prototype,"sections",2),Ze([k()],p.PpPageNav.prototype,"collapsed",2),Ze([k()],p.PpPageNav.prototype,"navHidden",2),Ze([k()],p.PpPageNav.prototype,"activeId",2),p.PpPageNav=Ze([q("pp-page-nav")],p.PpPageNav),pi("static/shoelace");const yg={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',braces:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/></svg>',envelope:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>',"question-diamond":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/> <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>',cookie:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/> <path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/></svg>',signpost:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M12.532 5l1.666 2-1.666 2H2V5z"/></svg>',"shield-lock":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/> <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/></svg>',"person-lock":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/></svg>',key:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/> <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/> <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/> <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/> <path d="M3.902 4.222a5 5 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 4 4 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556m6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705M3.68 5.842a.5.5 0 0 1 .422.568q-.044.289-.044.59c0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.5 6.5 0 0 0 3.058 7q0-.375.054-.736a.5.5 0 0 1 .568-.422m8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.5 10.5 0 0 0 .584-2.678.5.5 0 0 1 .54-.456"/> <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865m-.89 1.257a.5.5 0 0 1 .04.706A5.48 5.48 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346m12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49"/></svg>',"x-lg":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>',"hdd-network":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"/></svg>',"box-arrow-up-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>',box:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>',"box-arrow-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/> <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>',"braces-asterisk":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z"/></svg>',"box-arrow-in-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/> <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/></svg>',"telephone-outbound":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"/></svg>',geo:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/></svg>',"chat-left-quote":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/></svg>',"arrow-clockwise":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>',"gear-wide-connected":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/></svg>',"chevron-double-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/> <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>',"chevron-double-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/> <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"zoom-in":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"/></svg>',"zoom-out":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/></svg>',"image-alt":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5z"/></svg>',image:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/></svg>',eye:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>',"eye-slash":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>',"arrows-fullscreen":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"/></svg>',"filetype-svg":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM0 14.841a1.13 1.13 0 0 0 .401.823q.194.162.478.252.285.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357a2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.187-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566a1.2 1.2 0 0 0-.5-.41a1.8 1.8 0 0 0-.78-.152q-.44 0-.776.15-.337.149-.528.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.256.193q-.167.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zm4.575 1.09h.952l1.327-3.999h-.879l-.887 3.138H5.05l-.897-3.138h-.917zm5.483-3.293q.114.228.14.492h-.776a.8.8 0 0 0-.096-.249.7.7 0 0 0-.17-.19.7.7 0 0 0-.237-.126 1 1 0 0 0-.3-.044q-.427 0-.664.302-.235.3-.235.85v.497q0 .352.097.616a.9.9 0 0 0 .305.413.87.87 0 0 0 .518.146 1 1 0 0 0 .457-.097.67.67 0 0 0 .273-.263q.09-.164.09-.364v-.254h-.823v-.59h1.576v.798q0 .29-.096.55a1.3 1.3 0 0 1-.293.457 1.4 1.4 0 0 1-.495.314q-.296.111-.698.111a2 2 0 0 1-.752-.132 1.45 1.45 0 0 1-.534-.377 1.6 1.6 0 0 1-.319-.58 2.5 2.5 0 0 1-.105-.745v-.507q0-.54.199-.949.202-.406.583-.633.383-.228.926-.228.357 0 .635.1.282.1.48.275.2.176.314.407"/></svg>'};return jl("default",{resolver:e=>{const t=yg[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(p,Symbol.toStringTag,{value:"Module"}),p})({});
