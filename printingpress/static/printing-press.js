var PrintingPress=(function(u){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Bn,Hn;const Fo=globalThis,Wr=Fo.ShadowRoot&&(Fo.ShadyCSS===void 0||Fo.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Fr=Symbol(),ys=new WeakMap;let Ms=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==Fr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(Wr&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=ys.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ys.set(o,t))}return t}toString(){return this.cssText}};const Fn=e=>new Ms(typeof e=="string"?e:e+"",void 0,Fr),k=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new Ms(o,e,Fr)},Gn=(e,t)=>{if(Wr)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const r=document.createElement("style"),i=Fo.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},ws=Wr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return Fn(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Vn,defineProperty:Jn,getOwnPropertyDescriptor:Xn,getOwnPropertyNames:Kn,getOwnPropertySymbols:qn,getPrototypeOf:tl}=Object,oe=globalThis,xs=oe.trustedTypes,el=xs?xs.emptyScript:"",Gr=oe.reactiveElementPolyfillSupport,po=(e,t)=>e,He={toAttribute(e,t){switch(t){case Boolean:e=e?el:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},Vr=(e,t)=>!Vn(e,t),Ls={attribute:!0,type:String,converter:He,reflect:!1,useDefault:!1,hasChanged:Vr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),oe.litPropertyMetadata??(oe.litPropertyMetadata=new WeakMap);let Qe=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Ls){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&Jn(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){const{get:i,set:s}=Xn(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:i,set(a){const n=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ls}static _$Ei(){if(this.hasOwnProperty(po("elementProperties")))return;const t=tl(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(po("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(po("properties"))){const o=this.properties,r=[...Kn(o),...qn(o)];for(const i of r)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)o.unshift(ws(i))}else t!==void 0&&o.push(ws(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(o=>this.enableUpdating=o),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(o=>o(this))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Gn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)})}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const a=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:He).toAttribute(o,r.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,o){var s,a;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:He;this._$Em=i;const c=l.fromAttribute(o,n.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(t,o,r,i=!1,s){var a;if(t!==void 0){const n=this.constructor;if(i===!1&&(s=this[t]),r??(r=n.getPropertyOptions(t)),!((r.hasChanged??Vr)(s,o)||r.useDefault&&r.reflect&&s===((a=this._$Ej)==null?void 0:a.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),s!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:n}=a,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};Qe.elementStyles=[],Qe.shadowRootOptions={mode:"open"},Qe[po("elementProperties")]=new Map,Qe[po("finalized")]=new Map,Gr==null||Gr({ReactiveElement:Qe}),(oe.reactiveElementVersions??(oe.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ho=globalThis,Is=e=>e,Go=ho.trustedTypes,Cs=Go?Go.createPolicy("lit-html",{createHTML:e=>e}):void 0,As="$lit$",re=`lit$${Math.random().toFixed(9).slice(2)}$`,js="?"+re,ol=`<${js}>`,Me=document,go=()=>Me.createComment(""),mo=e=>e===null||typeof e!="object"&&typeof e!="function",Jr=Array.isArray,rl=e=>Jr(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Xr=`[ 	
\f\r]`,fo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ns=/-->/g,Ss=/>/g,we=RegExp(`>|${Xr}(?:([^\\s"'>=/]+)(${Xr}*=${Xr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ts=/'/g,Ds=/"/g,Es=/^(?:script|style|textarea|title)$/i,il=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),d=il(1),Ct=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),ks=new WeakMap,xe=Me.createTreeWalker(Me,129);function zs(e,t){if(!Jr(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Cs!==void 0?Cs.createHTML(t):t}const sl=(e,t)=>{const o=e.length-1,r=[];let i,s=t===2?"<svg>":t===3?"<math>":"",a=fo;for(let n=0;n<o;n++){const l=e[n];let c,g,m=-1,M=0;for(;M<l.length&&(a.lastIndex=M,g=a.exec(l),g!==null);)M=a.lastIndex,a===fo?g[1]==="!--"?a=Ns:g[1]!==void 0?a=Ss:g[2]!==void 0?(Es.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=we):g[3]!==void 0&&(a=we):a===we?g[0]===">"?(a=i??fo,m=-1):g[1]===void 0?m=-2:(m=a.lastIndex-g[2].length,c=g[1],a=g[3]===void 0?we:g[3]==='"'?Ds:Ts):a===Ds||a===Ts?a=we:a===Ns||a===Ss?a=fo:(a=we,i=void 0);const b=a===we&&e[n+1].startsWith("/>")?" ":"";s+=a===fo?l+ol:m>=0?(r.push(c),l.slice(0,m)+As+l.slice(m)+re+b):l+re+(m===-2?n:b)}return[zs(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let Kr=class Zn{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,a=0;const n=t.length-1,l=this.parts,[c,g]=sl(t,o);if(this.el=Zn.createElement(c,r),xe.currentNode=this.el.content,o===2||o===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=xe.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const m of i.getAttributeNames())if(m.endsWith(As)){const M=g[a++],b=i.getAttribute(m).split(re),w=/([.?@])?(.*)/.exec(M);l.push({type:1,index:s,name:w[2],strings:b,ctor:w[1]==="."?nl:w[1]==="?"?ll:w[1]==="@"?cl:Vo}),i.removeAttribute(m)}else m.startsWith(re)&&(l.push({type:6,index:s}),i.removeAttribute(m));if(Es.test(i.tagName)){const m=i.textContent.split(re),M=m.length-1;if(M>0){i.textContent=Go?Go.emptyScript:"";for(let b=0;b<M;b++)i.append(m[b],go()),xe.nextNode(),l.push({type:2,index:++s});i.append(m[M],go())}}}else if(i.nodeType===8)if(i.data===js)l.push({type:2,index:s});else{let m=-1;for(;(m=i.data.indexOf(re,m+1))!==-1;)l.push({type:7,index:s}),m+=re.length-1}s++}}static createElement(t,o){const r=Me.createElement("template");return r.innerHTML=t,r}};function Ze(e,t,o=e,r){var a,n;if(t===Ct)return t;let i=r!==void 0?(a=o._$Co)==null?void 0:a[r]:o._$Cl;const s=mo(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=Ze(e,i._$AS(e,t.values),i,r)),t}let al=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??Me).importNode(o,!0);xe.currentNode=i;let s=xe.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new qr(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new dl(s,this,t)),this._$AV.push(c),l=r[++n]}a!==(l==null?void 0:l.index)&&(s=xe.nextNode(),a++)}return xe.currentNode=Me,i}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},qr=class Wn{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Ze(this,t,o),mo(t)?t===y||t==null||t===""?(this._$AH!==y&&this._$AR(),this._$AH=y):t!==this._$AH&&t!==Ct&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):rl(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==y&&mo(this._$AH)?this._$AA.nextSibling.data=t:this.T(Me.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Kr.createElement(zs(r.h,r.h[0]),this.options)),r);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(o);else{const a=new al(i,this),n=a.u(this.options);a.p(o),this.T(n),this._$AH=a}}_$AC(t){let o=ks.get(t.strings);return o===void 0&&ks.set(t.strings,o=new Kr(t)),o}k(t){Jr(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,i=0;for(const s of t)i===o.length?o.push(r=new Wn(this.O(go()),this.O(go()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const i=Is(t).nextSibling;Is(t).remove(),t=i}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}},Vo=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=y,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=y}_$AI(t,o=this,r,i){const s=this.strings;let a=!1;if(s===void 0)t=Ze(this,t,o,0),a=!mo(t)||t!==this._$AH&&t!==Ct,a&&(this._$AH=t);else{const n=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=Ze(this,n[r+l],o,l),c===Ct&&(c=this._$AH[l]),a||(a=!mo(c)||c!==this._$AH[l]),c===y?t=y:t!==y&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},nl=class extends Vo{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===y?void 0:t}},ll=class extends Vo{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==y)}},cl=class extends Vo{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=Ze(this,t,o,0)??y)===Ct)return;const r=this._$AH,i=t===y&&r!==y||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==y&&(r===y||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}};class dl{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ze(this,t)}}const ti=ho.litHtmlPolyfillSupport;ti==null||ti(Kr,qr),(ho.litHtmlVersions??(ho.litHtmlVersions=[])).push("3.3.2");const ul=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const s=(o==null?void 0:o.renderBefore)??null;r._$litPart$=i=new qr(t.insertBefore(go(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le=globalThis;let Q=class extends Qe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ul(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Ct}};Q._$litElement$=!0,Q.finalized=!0,(Bn=Le.litElementHydrateSupport)==null||Bn.call(Le,{LitElement:Q});const ei=Le.litElementPolyfillSupport;ei==null||ei({LitElement:Q}),(Le.litElementVersions??(Le.litElementVersions=[])).push("4.2.2");var pl=k`
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
`,hl=k`
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
`,oi="";function ri(e){oi=e}function gl(e=""){if(!oi){const t=[...document.getElementsByTagName("script")],o=t.find(r=>r.hasAttribute("data-shoelace"));if(o)ri(o.getAttribute("data-shoelace"));else{const r=t.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";r&&(i=r.getAttribute("src")),ri(i.split("/").slice(0,-1).join("/"))}}return oi.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var ml={name:"default",resolver:e=>gl(`assets/icons/${e}.svg`)},fl=ml,$s={caret:`
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
  `},bl={name:"system",resolver:e=>e in $s?`data:image/svg+xml,${encodeURIComponent($s[e])}`:""},vl=bl,Jo=[fl,vl],Xo=[];function yl(e){Xo.push(e)}function Ml(e){Xo=Xo.filter(t=>t!==e)}function Os(e){return Jo.find(t=>t.name===e)}function wl(e,t){xl(e),Jo.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),Xo.forEach(o=>{o.library===e&&o.setIcon()})}function xl(e){Jo=Jo.filter(t=>t.name!==e)}var Ll=k`
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
`,_s=Object.defineProperty,Il=Object.defineProperties,Cl=Object.getOwnPropertyDescriptor,Al=Object.getOwnPropertyDescriptors,Ps=Object.getOwnPropertySymbols,jl=Object.prototype.hasOwnProperty,Nl=Object.prototype.propertyIsEnumerable,ii=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),si=e=>{throw TypeError(e)},Rs=(e,t,o)=>t in e?_s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,Vt=(e,t)=>{for(var o in t||(t={}))jl.call(t,o)&&Rs(e,o,t[o]);if(Ps)for(var o of Ps(t))Nl.call(t,o)&&Rs(e,o,t[o]);return e},bo=(e,t)=>Il(e,Al(t)),h=(e,t,o,r)=>{for(var i=r>1?void 0:r?Cl(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&_s(t,o,i),i},Us=(e,t,o)=>t.has(e)||si("Cannot "+o),Sl=(e,t,o)=>(Us(e,t,"read from private field"),t.get(e)),Tl=(e,t,o)=>t.has(e)?si("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),Dl=(e,t,o,r)=>(Us(e,t,"write to private field"),t.set(e,o),o),El=function(e,t){this[0]=e,this[1]=t},kl=e=>{var t=e[ii("asyncIterator")],o=!1,r,i={};return t==null?(t=e[ii("iterator")](),r=s=>i[s]=a=>t[s](a)):(t=t.call(e),r=s=>i[s]=a=>{if(o){if(o=!1,s==="throw")throw a;return a}return o=!0,{done:!1,value:new El(new Promise(n=>{var l=t[s](a);l instanceof Object||si("Object expected"),n(l)}),1)}}),i[ii("iterator")]=()=>i,r("next"),"throw"in t?r("throw"):i.throw=s=>{throw s},"return"in t&&r("return"),i};function J(e,t){const o=Vt({waitUntilFirstUpdate:!1},t);return(r,i)=>{const{update:s}=r,a=Array.isArray(e)?e:[e];r.update=function(n){a.forEach(l=>{const c=l;if(n.has(c)){const g=n.get(c),m=this[c];g!==m&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[i](g,m)}}),s.call(this,n)}}}var rt=k`
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
 */const X=e=>(t,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zl={attribute:!0,type:String,converter:He,reflect:!1,hasChanged:Vr},$l=(e=zl,t,o)=>{const{kind:r,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),r==="accessor"){const{name:a}=o;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,e,!0,n)},init(n){return n!==void 0&&this.C(a,void 0,e,n),n}}}if(r==="setter"){const{name:a}=o;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,e,!0,n)}}throw Error("Unsupported decorator location: "+r)};function p(e){return(t,o)=>typeof o=="object"?$l(e,t,o):((r,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function D(e){return p({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ol(e){return(t,o)=>{const r=typeof t=="function"?t:t[o];Object.assign(r,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _l=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function B(e,t){return(o,r,i)=>{const s=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(e))??null};return _l(o,r,{get(){return s(this)}})}}var Ko,K=class extends Q{constructor(){super(),Tl(this,Ko,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,o])=>{this.constructor.define(t,o)})}emit(t,o){const r=new CustomEvent(t,Vt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},o));return this.dispatchEvent(r),r}static define(t,o=this,r={}){const i=customElements.get(t);if(!i){try{customElements.define(t,o,r)}catch{customElements.define(t,class extends o{},r)}return}let s=" (unknown version)",a=s;"version"in o&&o.version&&(s=" v"+o.version),"version"in i&&i.version&&(a=" v"+i.version),!(s&&a&&s===a)&&console.warn(`Attempted to register <${t}>${s}, but <${t}>${a} has already been registered.`)}attributeChangedCallback(t,o,r){Sl(this,Ko)||(this.constructor.elementProperties.forEach((i,s)=>{i.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),Dl(this,Ko,!0)),super.attributeChangedCallback(t,o,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((o,r)=>{t.has(r)&&this[r]==null&&(this[r]=o)})}};Ko=new WeakMap,K.version="2.20.1",K.dependencies={},h([p()],K.prototype,"dir",2),h([p()],K.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pl=(e,t)=>(e==null?void 0:e._$litType$)!==void 0,Ys=e=>e.strings===void 0,Rl={},Ul=(e,t=Rl)=>e._$AH=t;var vo=Symbol(),qo=Symbol(),ai,ni=new Map,pt=class extends K{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var o;let r;if(t!=null&&t.spriteSheet)return this.svg=d`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(r=await fetch(e,{mode:"cors"}),!r.ok)return r.status===410?vo:qo}catch{return qo}try{const i=document.createElement("div");i.innerHTML=await r.text();const s=i.firstElementChild;if(((o=s==null?void 0:s.tagName)==null?void 0:o.toLowerCase())!=="svg")return vo;ai||(ai=new DOMParser);const n=ai.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return n?(n.part.add("svg"),document.adoptNode(n)):vo}catch{return vo}}connectedCallback(){super.connectedCallback(),yl(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Ml(this)}getIconSource(){const e=Os(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:o}=this.getIconSource(),r=o?Os(this.library):void 0;if(!t){this.svg=null;return}let i=ni.get(t);if(i||(i=this.resolveIcon(t,r),ni.set(t,i)),!this.initialRender)return;const s=await i;if(s===qo&&ni.delete(t),t===this.getIconSource().url){if(Pl(s)){if(this.svg=s,r){await this.updateComplete;const a=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&a&&r.mutator(a)}return}switch(s){case qo:case vo:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(e=r==null?void 0:r.mutator)==null||e.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};pt.styles=[rt,Ll],h([D()],pt.prototype,"svg",2),h([p({reflect:!0})],pt.prototype,"name",2),h([p()],pt.prototype,"src",2),h([p()],pt.prototype,"label",2),h([p({reflect:!0})],pt.prototype,"library",2),h([J("label")],pt.prototype,"handleLabelChange",1),h([J(["name","src","library"])],pt.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},tr=e=>(...t)=>({_$litDirective$:e,values:t});let er=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const st=tr(class extends er{constructor(e){var t;if(super(e),e.type!==Jt.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in t)t[s]&&!((r=this.nt)!=null&&r.has(s))&&this.st.add(s);return this.render(t)}const o=e.element.classList;for(const s of this.st)s in t||(o.remove(s),this.st.delete(s));for(const s in t){const a=!!t[s];a===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(a?(o.add(s),this.st.add(s)):(o.remove(s),this.st.delete(s)))}return Ct}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const li=Symbol.for(""),Yl=e=>{if((e==null?void 0:e.r)===li)return e==null?void 0:e._$litStatic$},Bl=e=>({_$litStatic$:e,r:li}),or=(e,...t)=>({_$litStatic$:t.reduce((o,r,i)=>o+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+e[i+1],e[0]),r:li}),Bs=new Map,Hl=e=>(t,...o)=>{const r=o.length;let i,s;const a=[],n=[];let l,c=0,g=!1;for(;c<r;){for(l=t[c];c<r&&(s=o[c],(i=Yl(s))!==void 0);)l+=i+t[++c],g=!0;c!==r&&n.push(s),a.push(l),c++}if(c===r&&a.push(t[r]),g){const m=a.join("$$lit$$");(t=Bs.get(m))===void 0&&(a.raw=a,Bs.set(m,t=a)),o=n}return e(t,...o)},yo=Hl(d);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const P=e=>e??y;var lt=class extends K{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?or`a`:or`button`;return yo`
      <${t}
        part="base"
        class=${st({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${P(e?void 0:this.disabled)}
        type=${P(e?void 0:"button")}
        href=${P(e?this.href:void 0)}
        target=${P(e?this.target:void 0)}
        download=${P(e?this.download:void 0)}
        rel=${P(e&&this.target?"noreferrer noopener":void 0)}
        role=${P(e?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${P(this.name)}
          library=${P(this.library)}
          src=${P(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};lt.styles=[rt,hl],lt.dependencies={"sl-icon":pt},h([B(".icon-button")],lt.prototype,"button",2),h([D()],lt.prototype,"hasFocus",2),h([p()],lt.prototype,"name",2),h([p()],lt.prototype,"library",2),h([p()],lt.prototype,"src",2),h([p()],lt.prototype,"href",2),h([p()],lt.prototype,"target",2),h([p()],lt.prototype,"download",2),h([p()],lt.prototype,"label",2),h([p({type:Boolean,reflect:!0})],lt.prototype,"disabled",2);const ci=new Set,We=new Map;let Ie,di="ltr",ui="en";const Hs=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Hs){const e=new MutationObserver(Zs);di=document.documentElement.dir||"ltr",ui=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Qs(...e){e.map(t=>{const o=t.$code.toLowerCase();We.has(o)?We.set(o,Object.assign(Object.assign({},We.get(o)),t)):We.set(o,t),Ie||(Ie=t)}),Zs()}function Zs(){Hs&&(di=document.documentElement.dir||"ltr",ui=document.documentElement.lang||navigator.language),[...ci.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Ql=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){ci.add(this.host)}hostDisconnected(){ci.delete(this.host)}dir(){return`${this.host.dir||di}`.toLowerCase()}lang(){return`${this.host.lang||ui}`.toLowerCase()}getTranslationData(t){var o,r;const i=new Intl.Locale(t.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),a=(r=(o=i==null?void 0:i.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",n=We.get(`${s}-${a}`),l=We.get(s);return{locale:i,language:s,region:a,primary:n,secondary:l}}exists(t,o){var r;const{primary:i,secondary:s}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[t]||s&&s[t]||o.includeFallback&&Ie&&Ie[t])}term(t,...o){const{primary:r,secondary:i}=this.getTranslationData(this.lang());let s;if(r&&r[t])s=r[t];else if(i&&i[t])s=i[t];else if(Ie&&Ie[t])s=Ie[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...o):s}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var Ws={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};Qs(Ws);var Zl=Ws,gt=class extends Ql{};Qs(Zl);var Ce=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return d`
      <span
        part="base"
        class=${st({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
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
    `}};Ce.styles=[rt,pl],Ce.dependencies={"sl-icon-button":lt},h([p({reflect:!0})],Ce.prototype,"variant",2),h([p({reflect:!0})],Ce.prototype,"size",2),h([p({type:Boolean,reflect:!0})],Ce.prototype,"pill",2),h([p({type:Boolean})],Ce.prototype,"removable",2),Ce.define("sl-tag"),lt.define("sl-icon-button");var Wl=k`
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
`,Fl=k`
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
`;const ie=Math.min,ft=Math.max,rr=Math.round,ir=Math.floor,Ut=e=>({x:e,y:e}),Gl={left:"right",right:"left",bottom:"top",top:"bottom"};function pi(e,t,o){return ft(e,ie(t,o))}function Fe(e,t){return typeof e=="function"?e(t):e}function se(e){return e.split("-")[0]}function Ge(e){return e.split("-")[1]}function Fs(e){return e==="x"?"y":"x"}function hi(e){return e==="y"?"height":"width"}function Xt(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function gi(e){return Fs(Xt(e))}function Vl(e,t,o){o===void 0&&(o=!1);const r=Ge(e),i=gi(e),s=hi(i);let a=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(a=sr(a)),[a,sr(a)]}function Jl(e){const t=sr(e);return[mi(e),t,mi(t)]}function mi(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const Gs=["left","right"],Vs=["right","left"],Xl=["top","bottom"],Kl=["bottom","top"];function ql(e,t,o){switch(e){case"top":case"bottom":return o?t?Vs:Gs:t?Gs:Vs;case"left":case"right":return t?Xl:Kl;default:return[]}}function tc(e,t,o,r){const i=Ge(e);let s=ql(se(e),o==="start",r);return i&&(s=s.map(a=>a+"-"+i),t&&(s=s.concat(s.map(mi)))),s}function sr(e){const t=se(e);return Gl[t]+e.slice(t.length)}function ec(e){return{top:0,right:0,bottom:0,left:0,...e}}function Js(e){return typeof e!="number"?ec(e):{top:e,right:e,bottom:e,left:e}}function ar(e){const{x:t,y:o,width:r,height:i}=e;return{width:r,height:i,top:o,left:t,right:t+r,bottom:o+i,x:t,y:o}}function Xs(e,t,o){let{reference:r,floating:i}=e;const s=Xt(t),a=gi(t),n=hi(a),l=se(t),c=s==="y",g=r.x+r.width/2-i.width/2,m=r.y+r.height/2-i.height/2,M=r[n]/2-i[n]/2;let b;switch(l){case"top":b={x:g,y:r.y-i.height};break;case"bottom":b={x:g,y:r.y+r.height};break;case"right":b={x:r.x+r.width,y:m};break;case"left":b={x:r.x-i.width,y:m};break;default:b={x:r.x,y:r.y}}switch(Ge(t)){case"start":b[a]-=M*(o&&c?-1:1);break;case"end":b[a]+=M*(o&&c?-1:1);break}return b}async function oc(e,t){var o;t===void 0&&(t={});const{x:r,y:i,platform:s,rects:a,elements:n,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:g="viewport",elementContext:m="floating",altBoundary:M=!1,padding:b=0}=Fe(t,e),w=Js(b),j=n[M?m==="floating"?"reference":"floating":m],A=ar(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(j)))==null||o?j:j.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(n.floating)),boundary:c,rootBoundary:g,strategy:l})),v=m==="floating"?{x:r,y:i,width:a.floating.width,height:a.floating.height}:a.reference,f=await(s.getOffsetParent==null?void 0:s.getOffsetParent(n.floating)),x=await(s.isElement==null?void 0:s.isElement(f))?await(s.getScale==null?void 0:s.getScale(f))||{x:1,y:1}:{x:1,y:1},I=ar(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:v,offsetParent:f,strategy:l}):v);return{top:(A.top-I.top+w.top)/x.y,bottom:(I.bottom-A.bottom+w.bottom)/x.y,left:(A.left-I.left+w.left)/x.x,right:(I.right-A.right+w.right)/x.x}}const rc=50,ic=async(e,t,o)=>{const{placement:r="bottom",strategy:i="absolute",middleware:s=[],platform:a}=o,n=a.detectOverflow?a:{...a,detectOverflow:oc},l=await(a.isRTL==null?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:g,y:m}=Xs(c,r,l),M=r,b=0;const w={};for(let C=0;C<s.length;C++){const j=s[C];if(!j)continue;const{name:A,fn:v}=j,{x:f,y:x,data:I,reset:L}=await v({x:g,y:m,initialPlacement:r,placement:M,strategy:i,middlewareData:w,rects:c,platform:n,elements:{reference:e,floating:t}});g=f??g,m=x??m,w[A]={...w[A],...I},L&&b<rc&&(b++,typeof L=="object"&&(L.placement&&(M=L.placement),L.rects&&(c=L.rects===!0?await a.getElementRects({reference:e,floating:t,strategy:i}):L.rects),{x:g,y:m}=Xs(c,M,l)),C=-1)}return{x:g,y:m,placement:M,strategy:i,middlewareData:w}},sc=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:i,rects:s,platform:a,elements:n,middlewareData:l}=t,{element:c,padding:g=0}=Fe(e,t)||{};if(c==null)return{};const m=Js(g),M={x:o,y:r},b=gi(i),w=hi(b),C=await a.getDimensions(c),j=b==="y",A=j?"top":"left",v=j?"bottom":"right",f=j?"clientHeight":"clientWidth",x=s.reference[w]+s.reference[b]-M[b]-s.floating[w],I=M[b]-s.reference[b],L=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let N=L?L[f]:0;(!N||!await(a.isElement==null?void 0:a.isElement(L)))&&(N=n.floating[f]||s.floating[w]);const z=x/2-I/2,S=N/2-C[w]/2-1,$=ie(m[A],S),U=ie(m[v],S),H=$,ot=N-C[w]-U,Y=N/2-C[w]/2+z,dt=pi(H,Y,ot),tt=!l.arrow&&Ge(i)!=null&&Y!==dt&&s.reference[w]/2-(Y<H?$:U)-C[w]/2<0,V=tt?Y<H?Y-H:Y-ot:0;return{[b]:M[b]+V,data:{[b]:dt,centerOffset:Y-dt-V,...tt&&{alignmentOffset:V}},reset:tt}}}),ac=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:i,middlewareData:s,rects:a,initialPlacement:n,platform:l,elements:c}=t,{mainAxis:g=!0,crossAxis:m=!0,fallbackPlacements:M,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:w="none",flipAlignment:C=!0,...j}=Fe(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const A=se(i),v=Xt(n),f=se(n)===n,x=await(l.isRTL==null?void 0:l.isRTL(c.floating)),I=M||(f||!C?[sr(n)]:Jl(n)),L=w!=="none";!M&&L&&I.push(...tc(n,C,w,x));const N=[n,...I],z=await l.detectOverflow(t,j),S=[];let $=((r=s.flip)==null?void 0:r.overflows)||[];if(g&&S.push(z[A]),m){const Y=Vl(i,a,x);S.push(z[Y[0]],z[Y[1]])}if($=[...$,{placement:i,overflows:S}],!S.every(Y=>Y<=0)){var U,H;const Y=(((U=s.flip)==null?void 0:U.index)||0)+1,dt=N[Y];if(dt&&(!(m==="alignment"?v!==Xt(dt):!1)||$.every(_=>Xt(_.placement)===v?_.overflows[0]>0:!0)))return{data:{index:Y,overflows:$},reset:{placement:dt}};let tt=(H=$.filter(V=>V.overflows[0]<=0).sort((V,_)=>V.overflows[1]-_.overflows[1])[0])==null?void 0:H.placement;if(!tt)switch(b){case"bestFit":{var ot;const V=(ot=$.filter(_=>{if(L){const F=Xt(_.placement);return F===v||F==="y"}return!0}).map(_=>[_.placement,_.overflows.filter(F=>F>0).reduce((F,Gt)=>F+Gt,0)]).sort((_,F)=>_[1]-F[1])[0])==null?void 0:ot[0];V&&(tt=V);break}case"initialPlacement":tt=n;break}if(i!==tt)return{reset:{placement:tt}}}return{}}}},nc=new Set(["left","top"]);async function lc(e,t){const{placement:o,platform:r,elements:i}=e,s=await(r.isRTL==null?void 0:r.isRTL(i.floating)),a=se(o),n=Ge(o),l=Xt(o)==="y",c=nc.has(a)?-1:1,g=s&&l?-1:1,m=Fe(t,e);let{mainAxis:M,crossAxis:b,alignmentAxis:w}=typeof m=="number"?{mainAxis:m,crossAxis:0,alignmentAxis:null}:{mainAxis:m.mainAxis||0,crossAxis:m.crossAxis||0,alignmentAxis:m.alignmentAxis};return n&&typeof w=="number"&&(b=n==="end"?w*-1:w),l?{x:b*g,y:M*c}:{x:M*c,y:b*g}}const cc=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:i,y:s,placement:a,middlewareData:n}=t,l=await lc(t,e);return a===((o=n.offset)==null?void 0:o.placement)&&(r=n.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:a}}}}},dc=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:i,platform:s}=t,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:A=>{let{x:v,y:f}=A;return{x:v,y:f}}},...c}=Fe(e,t),g={x:o,y:r},m=await s.detectOverflow(t,c),M=Xt(se(i)),b=Fs(M);let w=g[b],C=g[M];if(a){const A=b==="y"?"top":"left",v=b==="y"?"bottom":"right",f=w+m[A],x=w-m[v];w=pi(f,w,x)}if(n){const A=M==="y"?"top":"left",v=M==="y"?"bottom":"right",f=C+m[A],x=C-m[v];C=pi(f,C,x)}const j=l.fn({...t,[b]:w,[M]:C});return{...j,data:{x:j.x-o,y:j.y-r,enabled:{[b]:a,[M]:n}}}}}},uc=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:i,rects:s,platform:a,elements:n}=t,{apply:l=()=>{},...c}=Fe(e,t),g=await a.detectOverflow(t,c),m=se(i),M=Ge(i),b=Xt(i)==="y",{width:w,height:C}=s.floating;let j,A;m==="top"||m==="bottom"?(j=m,A=M===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(A=m,j=M==="end"?"top":"bottom");const v=C-g.top-g.bottom,f=w-g.left-g.right,x=ie(C-g[j],v),I=ie(w-g[A],f),L=!t.middlewareData.shift;let N=x,z=I;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(z=f),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(N=v),L&&!M){const $=ft(g.left,0),U=ft(g.right,0),H=ft(g.top,0),ot=ft(g.bottom,0);b?z=w-2*($!==0||U!==0?$+U:ft(g.left,g.right)):N=C-2*(H!==0||ot!==0?H+ot:ft(g.top,g.bottom))}await l({...t,availableWidth:z,availableHeight:N});const S=await a.getDimensions(n.floating);return w!==S.width||C!==S.height?{reset:{rects:!0}}:{}}}};function nr(){return typeof window<"u"}function Ve(e){return Ks(e)?(e.nodeName||"").toLowerCase():"#document"}function bt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Yt(e){var t;return(t=(Ks(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Ks(e){return nr()?e instanceof Node||e instanceof bt(e).Node:!1}function Nt(e){return nr()?e instanceof Element||e instanceof bt(e).Element:!1}function Kt(e){return nr()?e instanceof HTMLElement||e instanceof bt(e).HTMLElement:!1}function qs(e){return!nr()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof bt(e).ShadowRoot}function Mo(e){const{overflow:t,overflowX:o,overflowY:r,display:i}=St(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&i!=="inline"&&i!=="contents"}function pc(e){return/^(table|td|th)$/.test(Ve(e))}function lr(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const hc=/transform|translate|scale|rotate|perspective|filter/,gc=/paint|layout|strict|content/,Ae=e=>!!e&&e!=="none";let fi;function cr(e){const t=Nt(e)?St(e):e;return Ae(t.transform)||Ae(t.translate)||Ae(t.scale)||Ae(t.rotate)||Ae(t.perspective)||!bi()&&(Ae(t.backdropFilter)||Ae(t.filter))||hc.test(t.willChange||"")||gc.test(t.contain||"")}function mc(e){let t=ae(e);for(;Kt(t)&&!Je(t);){if(cr(t))return t;if(lr(t))return null;t=ae(t)}return null}function bi(){return fi==null&&(fi=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),fi}function Je(e){return/^(html|body|#document)$/.test(Ve(e))}function St(e){return bt(e).getComputedStyle(e)}function dr(e){return Nt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ae(e){if(Ve(e)==="html")return e;const t=e.assignedSlot||e.parentNode||qs(e)&&e.host||Yt(e);return qs(t)?t.host:t}function ta(e){const t=ae(e);return Je(t)?e.ownerDocument?e.ownerDocument.body:e.body:Kt(t)&&Mo(t)?t:ta(t)}function wo(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const i=ta(e),s=i===((r=e.ownerDocument)==null?void 0:r.body),a=bt(i);if(s){const n=vi(a);return t.concat(a,a.visualViewport||[],Mo(i)?i:[],n&&o?wo(n):[])}else return t.concat(i,wo(i,[],o))}function vi(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function ea(e){const t=St(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const i=Kt(e),s=i?e.offsetWidth:o,a=i?e.offsetHeight:r,n=rr(o)!==s||rr(r)!==a;return n&&(o=s,r=a),{width:o,height:r,$:n}}function yi(e){return Nt(e)?e:e.contextElement}function Xe(e){const t=yi(e);if(!Kt(t))return Ut(1);const o=t.getBoundingClientRect(),{width:r,height:i,$:s}=ea(t);let a=(s?rr(o.width):o.width)/r,n=(s?rr(o.height):o.height)/i;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const fc=Ut(0);function oa(e){const t=bt(e);return!bi()||!t.visualViewport?fc:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function bc(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==bt(e)?!1:t}function je(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const i=e.getBoundingClientRect(),s=yi(e);let a=Ut(1);t&&(r?Nt(r)&&(a=Xe(r)):a=Xe(e));const n=bc(s,o,r)?oa(s):Ut(0);let l=(i.left+n.x)/a.x,c=(i.top+n.y)/a.y,g=i.width/a.x,m=i.height/a.y;if(s){const M=bt(s),b=r&&Nt(r)?bt(r):r;let w=M,C=vi(w);for(;C&&r&&b!==w;){const j=Xe(C),A=C.getBoundingClientRect(),v=St(C),f=A.left+(C.clientLeft+parseFloat(v.paddingLeft))*j.x,x=A.top+(C.clientTop+parseFloat(v.paddingTop))*j.y;l*=j.x,c*=j.y,g*=j.x,m*=j.y,l+=f,c+=x,w=bt(C),C=vi(w)}}return ar({width:g,height:m,x:l,y:c})}function ur(e,t){const o=dr(e).scrollLeft;return t?t.left+o:je(Yt(e)).left+o}function ra(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-ur(e,o),i=o.top+t.scrollTop;return{x:r,y:i}}function vc(e){let{elements:t,rect:o,offsetParent:r,strategy:i}=e;const s=i==="fixed",a=Yt(r),n=t?lr(t.floating):!1;if(r===a||n&&s)return o;let l={scrollLeft:0,scrollTop:0},c=Ut(1);const g=Ut(0),m=Kt(r);if((m||!m&&!s)&&((Ve(r)!=="body"||Mo(a))&&(l=dr(r)),m)){const b=je(r);c=Xe(r),g.x=b.x+r.clientLeft,g.y=b.y+r.clientTop}const M=a&&!m&&!s?ra(a,l):Ut(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+g.x+M.x,y:o.y*c.y-l.scrollTop*c.y+g.y+M.y}}function yc(e){return Array.from(e.getClientRects())}function Mc(e){const t=Yt(e),o=dr(e),r=e.ownerDocument.body,i=ft(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=ft(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let a=-o.scrollLeft+ur(e);const n=-o.scrollTop;return St(r).direction==="rtl"&&(a+=ft(t.clientWidth,r.clientWidth)-i),{width:i,height:s,x:a,y:n}}const ia=25;function wc(e,t){const o=bt(e),r=Yt(e),i=o.visualViewport;let s=r.clientWidth,a=r.clientHeight,n=0,l=0;if(i){s=i.width,a=i.height;const g=bi();(!g||g&&t==="fixed")&&(n=i.offsetLeft,l=i.offsetTop)}const c=ur(r);if(c<=0){const g=r.ownerDocument,m=g.body,M=getComputedStyle(m),b=g.compatMode==="CSS1Compat"&&parseFloat(M.marginLeft)+parseFloat(M.marginRight)||0,w=Math.abs(r.clientWidth-m.clientWidth-b);w<=ia&&(s-=w)}else c<=ia&&(s+=c);return{width:s,height:a,x:n,y:l}}function xc(e,t){const o=je(e,!0,t==="fixed"),r=o.top+e.clientTop,i=o.left+e.clientLeft,s=Kt(e)?Xe(e):Ut(1),a=e.clientWidth*s.x,n=e.clientHeight*s.y,l=i*s.x,c=r*s.y;return{width:a,height:n,x:l,y:c}}function sa(e,t,o){let r;if(t==="viewport")r=wc(e,o);else if(t==="document")r=Mc(Yt(e));else if(Nt(t))r=xc(t,o);else{const i=oa(e);r={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return ar(r)}function aa(e,t){const o=ae(e);return o===t||!Nt(o)||Je(o)?!1:St(o).position==="fixed"||aa(o,t)}function Lc(e,t){const o=t.get(e);if(o)return o;let r=wo(e,[],!1).filter(n=>Nt(n)&&Ve(n)!=="body"),i=null;const s=St(e).position==="fixed";let a=s?ae(e):e;for(;Nt(a)&&!Je(a);){const n=St(a),l=cr(a);!l&&n.position==="fixed"&&(i=null),(s?!l&&!i:!l&&n.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||Mo(a)&&!l&&aa(e,a))?r=r.filter(g=>g!==a):i=n,a=ae(a)}return t.set(e,r),r}function Ic(e){let{element:t,boundary:o,rootBoundary:r,strategy:i}=e;const a=[...o==="clippingAncestors"?lr(t)?[]:Lc(t,this._c):[].concat(o),r],n=sa(t,a[0],i);let l=n.top,c=n.right,g=n.bottom,m=n.left;for(let M=1;M<a.length;M++){const b=sa(t,a[M],i);l=ft(b.top,l),c=ie(b.right,c),g=ie(b.bottom,g),m=ft(b.left,m)}return{width:c-m,height:g-l,x:m,y:l}}function Cc(e){const{width:t,height:o}=ea(e);return{width:t,height:o}}function Ac(e,t,o){const r=Kt(t),i=Yt(t),s=o==="fixed",a=je(e,!0,s,t);let n={scrollLeft:0,scrollTop:0};const l=Ut(0);function c(){l.x=ur(i)}if(r||!r&&!s)if((Ve(t)!=="body"||Mo(i))&&(n=dr(t)),r){const b=je(t,!0,s,t);l.x=b.x+t.clientLeft,l.y=b.y+t.clientTop}else i&&c();s&&!r&&i&&c();const g=i&&!r&&!s?ra(i,n):Ut(0),m=a.left+n.scrollLeft-l.x-g.x,M=a.top+n.scrollTop-l.y-g.y;return{x:m,y:M,width:a.width,height:a.height}}function Mi(e){return St(e).position==="static"}function na(e,t){if(!Kt(e)||St(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return Yt(e)===o&&(o=o.ownerDocument.body),o}function la(e,t){const o=bt(e);if(lr(e))return o;if(!Kt(e)){let i=ae(e);for(;i&&!Je(i);){if(Nt(i)&&!Mi(i))return i;i=ae(i)}return o}let r=na(e,t);for(;r&&pc(r)&&Mi(r);)r=na(r,t);return r&&Je(r)&&Mi(r)&&!cr(r)?o:r||mc(e)||o}const jc=async function(e){const t=this.getOffsetParent||la,o=this.getDimensions,r=await o(e.floating);return{reference:Ac(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function Nc(e){return St(e).direction==="rtl"}const pr={convertOffsetParentRelativeRectToViewportRelativeRect:vc,getDocumentElement:Yt,getClippingRect:Ic,getOffsetParent:la,getElementRects:jc,getClientRects:yc,getDimensions:Cc,getScale:Xe,isElement:Nt,isRTL:Nc};function ca(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Sc(e,t){let o=null,r;const i=Yt(e);function s(){var n;clearTimeout(r),(n=o)==null||n.disconnect(),o=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:g,top:m,width:M,height:b}=c;if(n||t(),!M||!b)return;const w=ir(m),C=ir(i.clientWidth-(g+M)),j=ir(i.clientHeight-(m+b)),A=ir(g),f={rootMargin:-w+"px "+-C+"px "+-j+"px "+-A+"px",threshold:ft(0,ie(1,l))||1};let x=!0;function I(L){const N=L[0].intersectionRatio;if(N!==l){if(!x)return a();N?a(!1,N):r=setTimeout(()=>{a(!1,1e-7)},1e3)}N===1&&!ca(c,e.getBoundingClientRect())&&a(),x=!1}try{o=new IntersectionObserver(I,{...f,root:i.ownerDocument})}catch{o=new IntersectionObserver(I,f)}o.observe(e)}return a(!0),s}function Tc(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=yi(e),g=i||s?[...c?wo(c):[],...t?wo(t):[]]:[];g.forEach(A=>{i&&A.addEventListener("scroll",o,{passive:!0}),s&&A.addEventListener("resize",o)});const m=c&&n?Sc(c,o):null;let M=-1,b=null;a&&(b=new ResizeObserver(A=>{let[v]=A;v&&v.target===c&&b&&t&&(b.unobserve(t),cancelAnimationFrame(M),M=requestAnimationFrame(()=>{var f;(f=b)==null||f.observe(t)})),o()}),c&&!l&&b.observe(c),t&&b.observe(t));let w,C=l?je(e):null;l&&j();function j(){const A=je(e);C&&!ca(C,A)&&o(),C=A,w=requestAnimationFrame(j)}return o(),()=>{var A;g.forEach(v=>{i&&v.removeEventListener("scroll",o),s&&v.removeEventListener("resize",o)}),m==null||m(),(A=b)==null||A.disconnect(),b=null,l&&cancelAnimationFrame(w)}}const Dc=cc,Ec=dc,kc=ac,da=uc,zc=sc,$c=(e,t,o)=>{const r=new Map,i={platform:pr,...o},s={...i.platform,_c:r};return ic(e,t,{...i,platform:s})};function Oc(e){return _c(e)}function wi(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function _c(e){for(let t=e;t;t=wi(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=wi(e);t;t=wi(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||cr(o)||t.tagName==="BODY"))return t}return null}function Pc(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var Z=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),o=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let i=0,s=0,a=0,n=0,l=0,c=0,g=0,m=0;r?t.top<o.top?(i=t.left,s=t.bottom,a=t.right,n=t.bottom,l=o.left,c=o.top,g=o.right,m=o.top):(i=o.left,s=o.bottom,a=o.right,n=o.bottom,l=t.left,c=t.top,g=t.right,m=t.top):t.left<o.left?(i=t.right,s=t.top,a=o.left,n=o.top,l=t.right,c=t.bottom,g=o.left,m=o.bottom):(i=o.right,s=o.top,a=t.left,n=t.top,l=o.right,c=o.bottom,g=t.left,m=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${a}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${l}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${g}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${m}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||Pc(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Tc(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Dc({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(da({apply:({rects:r})=>{const i=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=i?`${r.reference.width}px`:"",this.popup.style.height=s?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(kc({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Ec({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(da({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:i})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${i}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(zc({element:this.arrowEl,padding:this.arrowPadding}));const o=this.strategy==="absolute"?r=>pr.getOffsetParent(r,Oc):pr.getOffsetParent;$c(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:bo(Vt({},pr),{getOffsetParent:o})}).then(({x:r,y:i,middlewareData:s,placement:a})=>{const n=this.localize.dir()==="rtl",l={top:"bottom",right:"left",bottom:"top",left:"right"}[a.split("-")[0]];if(this.setAttribute("data-current-placement",a),Object.assign(this.popup.style,{left:`${r}px`,top:`${i}px`}),this.arrow){const c=s.arrow.x,g=s.arrow.y;let m="",M="",b="",w="";if(this.arrowPlacement==="start"){const C=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";m=typeof g=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",M=n?C:"",w=n?"":C}else if(this.arrowPlacement==="end"){const C=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";M=n?"":C,w=n?C:"",b=typeof g=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(w=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":"",m=typeof g=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(w=typeof c=="number"?`${c}px`:"",m=typeof g=="number"?`${g}px`:"");Object.assign(this.arrowEl.style,{top:m,right:M,bottom:b,left:w,[l]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return d`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${st({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${st({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?d`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};Z.styles=[rt,Fl],h([B(".popup")],Z.prototype,"popup",2),h([B(".popup__arrow")],Z.prototype,"arrowEl",2),h([p()],Z.prototype,"anchor",2),h([p({type:Boolean,reflect:!0})],Z.prototype,"active",2),h([p({reflect:!0})],Z.prototype,"placement",2),h([p({reflect:!0})],Z.prototype,"strategy",2),h([p({type:Number})],Z.prototype,"distance",2),h([p({type:Number})],Z.prototype,"skidding",2),h([p({type:Boolean})],Z.prototype,"arrow",2),h([p({attribute:"arrow-placement"})],Z.prototype,"arrowPlacement",2),h([p({attribute:"arrow-padding",type:Number})],Z.prototype,"arrowPadding",2),h([p({type:Boolean})],Z.prototype,"flip",2),h([p({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],Z.prototype,"flipFallbackPlacements",2),h([p({attribute:"flip-fallback-strategy"})],Z.prototype,"flipFallbackStrategy",2),h([p({type:Object})],Z.prototype,"flipBoundary",2),h([p({attribute:"flip-padding",type:Number})],Z.prototype,"flipPadding",2),h([p({type:Boolean})],Z.prototype,"shift",2),h([p({type:Object})],Z.prototype,"shiftBoundary",2),h([p({attribute:"shift-padding",type:Number})],Z.prototype,"shiftPadding",2),h([p({attribute:"auto-size"})],Z.prototype,"autoSize",2),h([p()],Z.prototype,"sync",2),h([p({type:Object})],Z.prototype,"autoSizeBoundary",2),h([p({attribute:"auto-size-padding",type:Number})],Z.prototype,"autoSizePadding",2),h([p({attribute:"hover-bridge",type:Boolean})],Z.prototype,"hoverBridge",2);var ua=new Map,Rc=new WeakMap;function Uc(e){return e??{keyframes:[],options:{duration:0}}}function pa(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function it(e,t){ua.set(e,Uc(t))}function vt(e,t,o){const r=Rc.get(e);if(r!=null&&r[t])return pa(r[t],o.dir);const i=ua.get(t);return i?pa(i,o.dir):{keyframes:[],options:{duration:0}}}function ne(e,t){return new Promise(o=>{function r(i){i.target===e&&(e.removeEventListener(t,r),o())}e.addEventListener(t,r)})}function Tt(e,t,o){return new Promise(r=>{if((o==null?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=e.animate(t,bo(Vt({},o),{duration:Yc()?0:o.duration}));i.addEventListener("cancel",r,{once:!0}),i.addEventListener("finish",r,{once:!0})})}function ha(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function Yc(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Bt(e){return Promise.all(e.getAnimations().map(t=>new Promise(o=>{t.cancel(),requestAnimationFrame(o)})))}function ga(e,t){return e.map(o=>bo(Vt({},o),{height:o.height==="auto"?`${t}px`:o.height}))}var at=class extends K{constructor(){super(),this.localize=new gt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=ha(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=ha(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Bt(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:o,options:r}=vt(this,"tooltip.show",{dir:this.localize.dir()});await Tt(this.popup.popup,o,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Bt(this.body);const{keyframes:o,options:r}=vt(this,"tooltip.hide",{dir:this.localize.dir()});await Tt(this.popup.popup,o,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,ne(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ne(this,"sl-after-hide")}render(){return d`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${st({tooltip:!0,"tooltip--open":this.open})}
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
    `}};at.styles=[rt,Wl],at.dependencies={"sl-popup":Z},h([B("slot:not([name])")],at.prototype,"defaultSlot",2),h([B(".tooltip__body")],at.prototype,"body",2),h([B("sl-popup")],at.prototype,"popup",2),h([p()],at.prototype,"content",2),h([p()],at.prototype,"placement",2),h([p({type:Boolean,reflect:!0})],at.prototype,"disabled",2),h([p({type:Number})],at.prototype,"distance",2),h([p({type:Boolean,reflect:!0})],at.prototype,"open",2),h([p({type:Number})],at.prototype,"skidding",2),h([p()],at.prototype,"trigger",2),h([p({type:Boolean})],at.prototype,"hoist",2),h([J("open",{waitUntilFirstUpdate:!0})],at.prototype,"handleOpenChange",1),h([J(["content","distance","hoist","placement","skidding"])],at.prototype,"handleOptionsChange",1),h([J("disabled")],at.prototype,"handleDisabledChange",1),it("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),it("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),at.define("sl-tooltip"),pt.define("sl-icon");var Bc=k`
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
`;function Hc(e,t){function o(i){const s=e.getBoundingClientRect(),a=e.ownerDocument.defaultView,n=s.left+a.scrollX,l=s.top+a.scrollY,c=i.pageX-n,g=i.pageY-l;t!=null&&t.onMove&&t.onMove(c,g)}function r(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",r),t!=null&&t.onStop&&t.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",r),(t==null?void 0:t.initialEvent)instanceof PointerEvent&&o(t.initialEvent)}function ma(e,t,o){const r=i=>Object.is(i,-0)?0:i;return e<t?r(t):e>o?r(o):r(e)}var fa=()=>null,yt=class extends K{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new gt(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=fa,this.snapThreshold=12}toSnapFunction(e){const t=e.split(" ");return({pos:o,size:r,snapThreshold:i,isRtl:s,vertical:a})=>{let n=o,l=Number.POSITIVE_INFINITY;return t.forEach(c=>{let g;if(c.startsWith("repeat(")){const M=e.substring(7,e.length-1),b=M.endsWith("%"),w=Number.parseFloat(M),C=b?r*(w/100):w;g=Math.round((s&&!a?r-o:o)/C)*C}else c.endsWith("%")?g=r*(Number.parseFloat(c)/100):g=Number.parseFloat(c);s&&!a&&(g=r-g);const m=Math.abs(o-g);m<=i&&m<l&&(n=g,l=m)}),n}}set snap(e){this.snapValue=e??"",e?this.snapFunction=typeof e=="string"?this.toSnapFunction(e):e:this.snapFunction=fa}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),Hc(this,{onMove:(o,r)=>{var i;let s=this.vertical?r:o;this.primary==="end"&&(s=this.size-s),s=(i=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical}))!=null?i:s,this.position=ma(this.pixelsToPercentage(s),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){let t=this.position;const o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);if(e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),e.key==="Enter")if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const r=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=r})}this.position=ma(t,0,100)}}handleResize(e){const{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",r=`
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
        tabindex=${P(this.disabled?void 0:"0")}
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
    `}};yt.styles=[rt,Bc],h([B(".divider")],yt.prototype,"divider",2),h([p({type:Number,reflect:!0})],yt.prototype,"position",2),h([p({attribute:"position-in-pixels",type:Number})],yt.prototype,"positionInPixels",2),h([p({type:Boolean,reflect:!0})],yt.prototype,"vertical",2),h([p({type:Boolean,reflect:!0})],yt.prototype,"disabled",2),h([p()],yt.prototype,"primary",2),h([p({reflect:!0})],yt.prototype,"snap",1),h([p({type:Number,attribute:"snap-threshold"})],yt.prototype,"snapThreshold",2),h([J("position")],yt.prototype,"handlePositionChange",1),h([J("positionInPixels")],yt.prototype,"handlePositionInPixelsChange",1),h([J("vertical")],yt.prototype,"handleVerticalChange",1),yt.define("sl-split-panel");var Qc=k`
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
`;function*xi(e=document.activeElement){e!=null&&(yield e,"shadowRoot"in e&&e.shadowRoot&&e.shadowRoot.mode!=="closed"&&(yield*kl(xi(e.shadowRoot.activeElement))))}function ba(){return[...xi()].pop()}var va=new WeakMap;function ya(e){let t=va.get(e);return t||(t=window.getComputedStyle(e,null),va.set(e,t)),t}function Zc(e){if(typeof e.checkVisibility=="function")return e.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const t=ya(e);return t.visibility!=="hidden"&&t.display!=="none"}function Wc(e){const t=ya(e),{overflowY:o,overflowX:r}=t;return o==="scroll"||r==="scroll"?!0:o!=="auto"||r!=="auto"?!1:e.scrollHeight>e.clientHeight&&o==="auto"||e.scrollWidth>e.clientWidth&&r==="auto"}function Fc(e){const t=e.tagName.toLowerCase(),o=Number(e.getAttribute("tabindex"));if(e.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||e.hasAttribute("disabled")||e.closest("[inert]"))return!1;if(t==="input"&&e.getAttribute("type")==="radio"){const s=e.getRootNode(),a=`input[type='radio'][name="${e.getAttribute("name")}"]`,n=s.querySelector(`${a}:checked`);return n?n===e:s.querySelector(a)===e}return Zc(e)?(t==="audio"||t==="video")&&e.hasAttribute("controls")||e.hasAttribute("tabindex")||e.hasAttribute("contenteditable")&&e.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(t)?!0:Wc(e):!1}function Gc(e){var t,o;const r=Li(e),i=(t=r[0])!=null?t:null,s=(o=r[r.length-1])!=null?o:null;return{start:i,end:s}}function Vc(e,t){var o;return((o=e.getRootNode({composed:!0}))==null?void 0:o.host)!==t}function Li(e){const t=new WeakMap,o=[];function r(i){if(i instanceof Element){if(i.hasAttribute("inert")||i.closest("[inert]")||t.has(i))return;t.set(i,!0),!o.includes(i)&&Fc(i)&&o.push(i),i instanceof HTMLSlotElement&&Vc(i,e)&&i.assignedElements({flatten:!0}).forEach(s=>{r(s)}),i.shadowRoot!==null&&i.shadowRoot.mode==="open"&&r(i.shadowRoot)}for(const s of i.children)r(s)}return r(e),o.sort((i,s)=>{const a=Number(i.getAttribute("tabindex"))||0;return(Number(s.getAttribute("tabindex"))||0)-a})}var xo=[],Jc=class{constructor(e){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=t=>{var o;if(t.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const r=ba();if(this.previousFocus=r,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;t.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const i=Li(this.element);let s=i.findIndex(n=>n===r);this.previousFocus=this.currentFocus;const a=this.tabDirection==="forward"?1:-1;for(;;){s+a>=i.length?s=0:s+a<0?s=i.length-1:s+=a,this.previousFocus=this.currentFocus;const n=i[s];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||n&&this.possiblyHasTabbableChildren(n))return;t.preventDefault(),this.currentFocus=n,(o=this.currentFocus)==null||o.focus({preventScroll:!1});const l=[...xi()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=e,this.elementsWithTabbableControls=["iframe"]}activate(){xo.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){xo=xo.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return xo[xo.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const e=Li(this.element);if(!this.element.matches(":focus-within")){const t=e[0],o=e[e.length-1],r=this.tabDirection==="forward"?t:o;typeof(r==null?void 0:r.focus)=="function"&&(this.currentFocus=r,r.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute("controls")}};function Xc(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}var Ii=new Set;function Kc(){const e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function qc(){const e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(e)||!e?0:e}function Ci(e){if(Ii.add(e),!document.documentElement.classList.contains("sl-scroll-lock")){const t=Kc()+qc();let o=getComputedStyle(document.documentElement).scrollbarGutter;(!o||o==="auto")&&(o="stable"),t<2&&(o=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",o),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${t}px`)}}function Ai(e){Ii.delete(e),Ii.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}function Ma(e,t,o="vertical",r="smooth"){const i=Xc(e,t),s=i.top+t.scrollTop,a=i.left+t.scrollLeft,n=t.scrollLeft,l=t.scrollLeft+t.offsetWidth,c=t.scrollTop,g=t.scrollTop+t.offsetHeight;(o==="horizontal"||o==="both")&&(a<n?t.scrollTo({left:a,behavior:r}):a+e.clientWidth>l&&t.scrollTo({left:a-t.offsetWidth+e.clientWidth,behavior:r})),(o==="vertical"||o==="both")&&(s<c?t.scrollTo({top:s,behavior:r}):s+e.clientHeight>g&&t.scrollTo({top:s-t.offsetHeight+e.clientHeight,behavior:r}))}var td=e=>{var t;const{activeElement:o}=document;o&&e.contains(o)&&((t=document.activeElement)==null||t.blur())},hr=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=o=>{const r=o.target;(this.slotNames.includes("[default]")&&!r.name||r.name&&this.slotNames.includes(r.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!=="")return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if(t.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!t.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function ed(e){if(!e)return"";const t=e.assignedNodes({flatten:!0});let o="";return[...t].forEach(r=>{r.nodeType===Node.TEXT_NODE&&(o+=r.textContent)}),o}function wa(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Mt=class extends K{constructor(){super(...arguments),this.hasSlotController=new hr(this,"footer"),this.localize=new gt(this),this.modal=new Jc(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=e=>{this.contained||e.key==="Escape"&&this.modal.isActive()&&this.open&&(e.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),Ci(this)))}disconnectedCallback(){super.disconnectedCallback(),Ai(this),this.removeOpenListeners()}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const o=vt(this,"drawer.denyClose",{dir:this.localize.dir()});Tt(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){var e;"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var e;document.removeEventListener("keydown",this.handleDocumentKeyDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),Ci(this));const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([Bt(this.drawer),Bt(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});const t=vt(this,`drawer.show${wa(this.placement)}`,{dir:this.localize.dir()}),o=vt(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([Tt(this.panel,t.keyframes,t.options),Tt(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{td(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),Ai(this)),await Promise.all([Bt(this.drawer),Bt(this.overlay)]);const e=vt(this,`drawer.hide${wa(this.placement)}`,{dir:this.localize.dir()}),t=vt(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([Tt(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),Tt(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),Ci(this)),this.open&&this.contained&&(this.modal.deactivate(),Ai(this))}async show(){if(!this.open)return this.open=!0,ne(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ne(this,"sl-after-hide")}render(){return d`
      <div
        part="base"
        class=${st({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${P(this.noHeader?this.label:void 0)}
          aria-labelledby=${P(this.noHeader?void 0:"title")}
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
    `}};Mt.styles=[rt,Qc],Mt.dependencies={"sl-icon-button":lt},h([B(".drawer")],Mt.prototype,"drawer",2),h([B(".drawer__panel")],Mt.prototype,"panel",2),h([B(".drawer__overlay")],Mt.prototype,"overlay",2),h([p({type:Boolean,reflect:!0})],Mt.prototype,"open",2),h([p({reflect:!0})],Mt.prototype,"label",2),h([p({reflect:!0})],Mt.prototype,"placement",2),h([p({type:Boolean,reflect:!0})],Mt.prototype,"contained",2),h([p({attribute:"no-header",type:Boolean,reflect:!0})],Mt.prototype,"noHeader",2),h([J("open",{waitUntilFirstUpdate:!0})],Mt.prototype,"handleOpenChange",1),h([J("contained",{waitUntilFirstUpdate:!0})],Mt.prototype,"handleNoModalChange",1),it("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),it("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),it("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),it("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),it("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),it("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),it("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),it("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),it("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),it("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),it("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),Mt.define("sl-drawer");var od=k`
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
`,Dt=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.style.height=this.open?"auto":"0",this.open&&(this.details.open=!0),this.detailsObserver=new MutationObserver(e=>{for(const t of e)t.type==="attributes"&&t.attributeName==="open"&&(this.details.open?this.show():this.hide())}),this.detailsObserver.observe(this.details,{attributes:!0})}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.detailsObserver)==null||e.disconnect()}handleSummaryClick(e){e.preventDefault(),this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key==="ArrowUp"||e.key==="ArrowLeft")&&(e.preventDefault(),this.hide()),(e.key==="ArrowDown"||e.key==="ArrowRight")&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.details.open=!0,this.emit("sl-show",{cancelable:!0}).defaultPrevented){this.open=!1,this.details.open=!1;return}await Bt(this.body);const{keyframes:t,options:o}=vt(this,"details.show",{dir:this.localize.dir()});await Tt(this.body,ga(t,this.body.scrollHeight),o),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented){this.details.open=!0,this.open=!0;return}await Bt(this.body);const{keyframes:t,options:o}=vt(this,"details.hide",{dir:this.localize.dir()});await Tt(this.body,ga(t,this.body.scrollHeight),o),this.body.style.height="auto",this.details.open=!1,this.emit("sl-after-hide")}}async show(){if(!(this.open||this.disabled))return this.open=!0,ne(this,"sl-after-show")}async hide(){if(!(!this.open||this.disabled))return this.open=!1,ne(this,"sl-after-hide")}render(){const e=this.localize.dir()==="rtl";return d`
      <details
        part="base"
        class=${st({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
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
    `}};Dt.styles=[rt,od],Dt.dependencies={"sl-icon":pt},h([B(".details")],Dt.prototype,"details",2),h([B(".details__header")],Dt.prototype,"header",2),h([B(".details__body")],Dt.prototype,"body",2),h([B(".details__expand-icon-slot")],Dt.prototype,"expandIconSlot",2),h([p({type:Boolean,reflect:!0})],Dt.prototype,"open",2),h([p()],Dt.prototype,"summary",2),h([p({type:Boolean,reflect:!0})],Dt.prototype,"disabled",2),h([J("open",{waitUntilFirstUpdate:!0})],Dt.prototype,"handleOpenChange",1),it("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}}),it("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}}),Dt.define("sl-details"),Z.define("sl-popup");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const le=e=>(t,o)=>{o!==void 0?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gr=globalThis,ji=gr.ShadowRoot&&(gr.ShadyCSS===void 0||gr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ni=Symbol(),xa=new WeakMap;let La=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==Ni)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(ji&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=xa.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&xa.set(o,t))}return t}toString(){return this.cssText}};const rd=e=>new La(typeof e=="string"?e:e+"",void 0,Ni),mt=(e,...t)=>{const o=e.length===1?e[0]:t.reduce(((r,i,s)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1]),e[0]);return new La(o,e,Ni)},id=(e,t)=>{if(ji)e.adoptedStyleSheets=t.map((o=>o instanceof CSSStyleSheet?o:o.styleSheet));else for(const o of t){const r=document.createElement("style"),i=gr.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=o.cssText,e.appendChild(r)}},Ia=ji?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return rd(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:sd,defineProperty:ad,getOwnPropertyDescriptor:nd,getOwnPropertyNames:ld,getOwnPropertySymbols:cd,getPrototypeOf:dd}=Object,ce=globalThis,Ca=ce.trustedTypes,ud=Ca?Ca.emptyScript:"",Si=ce.reactiveElementPolyfillSupport,Lo=(e,t)=>e,mr={toAttribute(e,t){switch(t){case Boolean:e=e?ud:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},Ti=(e,t)=>!sd(e,t),Aa={attribute:!0,type:String,converter:mr,reflect:!1,useDefault:!1,hasChanged:Ti};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ce.litPropertyMetadata??(ce.litPropertyMetadata=new WeakMap);let Ke=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=Aa){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,o);i!==void 0&&ad(this.prototype,t,i)}}static getPropertyDescriptor(t,o,r){const{get:i,set:s}=nd(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:i,set(a){const n=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Aa}static _$Ei(){if(this.hasOwnProperty(Lo("elementProperties")))return;const t=dd(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Lo("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Lo("properties"))){const o=this.properties,r=[...ld(o),...cd(o)];for(const i of r)this.createProperty(i,o[i])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,i]of o)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const i=this._$Eu(o,r);i!==void 0&&this._$Eh.set(i,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)o.unshift(Ia(i))}else t!==void 0&&o.push(Ia(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((o=>this.enableUpdating=o)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((o=>o(this)))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return id(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)}))}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var s;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const a=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:mr).toAttribute(o,r.type);this._$Em=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(t,o){var s,a;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=r.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:mr;this._$Em=i;const c=l.fromAttribute(o,n.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(t,o,r){var i;if(t!==void 0){const s=this.constructor,a=this[t];if(r??(r=s.getPropertyOptions(t)),!((r.hasChanged??Ti)(a,o)||r.useDefault&&r.reflect&&a===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:i,wrapped:s},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),s!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:n}=a,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach((i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)})),this.update(o)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach((r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((o=>this._$ET(o,this[o])))),this._$EM()}updated(t){}firstUpdated(t){}};Ke.elementStyles=[],Ke.shadowRootOptions={mode:"open"},Ke[Lo("elementProperties")]=new Map,Ke[Lo("finalized")]=new Map,Si==null||Si({ReactiveElement:Ke}),(ce.reactiveElementVersions??(ce.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pd={attribute:!0,type:String,converter:mr,reflect:!1,hasChanged:Ti},hd=(e=pd,t,o)=>{const{kind:r,metadata:i}=o;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(o.name,e),r==="accessor"){const{name:a}=o;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,e)},init(n){return n!==void 0&&this.C(a,void 0,e,n),n}}}if(r==="setter"){const{name:a}=o;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,e)}}throw Error("Unsupported decorator location: "+r)};function E(e){return(t,o)=>typeof o=="object"?hd(e,t,o):((r,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,r),a?Object.getOwnPropertyDescriptor(i,s):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ne(e){return E({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gd=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function qe(e,t){return(o,r,i)=>{const s=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(e))??null};return gd(o,r,{get(){return s(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Io=globalThis,fr=Io.trustedTypes,ja=fr?fr.createPolicy("lit-html",{createHTML:e=>e}):void 0,Na="$lit$",de=`lit$${Math.random().toFixed(9).slice(2)}$`,Sa="?"+de,md=`<${Sa}>`,Se=document,Co=()=>Se.createComment(""),Ao=e=>e===null||typeof e!="object"&&typeof e!="function",Di=Array.isArray,fd=e=>Di(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ei=`[ 	
\f\r]`,jo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ta=/-->/g,Da=/>/g,Te=RegExp(`>|${Ei}(?:([^\\s"'>=/]+)(${Ei}*=${Ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ea=/'/g,ka=/"/g,za=/^(?:script|style|textarea|title)$/i,bd=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),q=bd(1),ue=Symbol.for("lit-noChange"),et=Symbol.for("lit-nothing"),$a=new WeakMap,De=Se.createTreeWalker(Se,129);function Oa(e,t){if(!Di(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ja!==void 0?ja.createHTML(t):t}const vd=(e,t)=>{const o=e.length-1,r=[];let i,s=t===2?"<svg>":t===3?"<math>":"",a=jo;for(let n=0;n<o;n++){const l=e[n];let c,g,m=-1,M=0;for(;M<l.length&&(a.lastIndex=M,g=a.exec(l),g!==null);)M=a.lastIndex,a===jo?g[1]==="!--"?a=Ta:g[1]!==void 0?a=Da:g[2]!==void 0?(za.test(g[2])&&(i=RegExp("</"+g[2],"g")),a=Te):g[3]!==void 0&&(a=Te):a===Te?g[0]===">"?(a=i??jo,m=-1):g[1]===void 0?m=-2:(m=a.lastIndex-g[2].length,c=g[1],a=g[3]===void 0?Te:g[3]==='"'?ka:Ea):a===ka||a===Ea?a=Te:a===Ta||a===Da?a=jo:(a=Te,i=void 0);const b=a===Te&&e[n+1].startsWith("/>")?" ":"";s+=a===jo?l+md:m>=0?(r.push(c),l.slice(0,m)+Na+l.slice(m)+de+b):l+de+(m===-2?n:b)}return[Oa(e,s+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class No{constructor({strings:t,_$litType$:o},r){let i;this.parts=[];let s=0,a=0;const n=t.length-1,l=this.parts,[c,g]=vd(t,o);if(this.el=No.createElement(c,r),De.currentNode=this.el.content,o===2||o===3){const m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(i=De.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const m of i.getAttributeNames())if(m.endsWith(Na)){const M=g[a++],b=i.getAttribute(m).split(de),w=/([.?@])?(.*)/.exec(M);l.push({type:1,index:s,name:w[2],strings:b,ctor:w[1]==="."?Md:w[1]==="?"?wd:w[1]==="@"?xd:br}),i.removeAttribute(m)}else m.startsWith(de)&&(l.push({type:6,index:s}),i.removeAttribute(m));if(za.test(i.tagName)){const m=i.textContent.split(de),M=m.length-1;if(M>0){i.textContent=fr?fr.emptyScript:"";for(let b=0;b<M;b++)i.append(m[b],Co()),De.nextNode(),l.push({type:2,index:++s});i.append(m[M],Co())}}}else if(i.nodeType===8)if(i.data===Sa)l.push({type:2,index:s});else{let m=-1;for(;(m=i.data.indexOf(de,m+1))!==-1;)l.push({type:7,index:s}),m+=de.length-1}s++}}static createElement(t,o){const r=Se.createElement("template");return r.innerHTML=t,r}}function to(e,t,o=e,r){var a,n;if(t===ue)return t;let i=r!==void 0?(a=o._$Co)==null?void 0:a[r]:o._$Cl;const s=Ao(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),s===void 0?i=void 0:(i=new s(e),i._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=i:o._$Cl=i),i!==void 0&&(t=to(e,i._$AS(e,t.values),i,r)),t}class yd{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??Se).importNode(o,!0);De.currentNode=i;let s=De.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new So(s,s.nextSibling,this,t):l.type===1?c=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(c=new Ld(s,this,t)),this._$AV.push(c),l=r[++n]}a!==(l==null?void 0:l.index)&&(s=De.nextNode(),a++)}return De.currentNode=Se,i}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}}class So{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,i){this.type=2,this._$AH=et,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=to(this,t,o),Ao(t)?t===et||t==null||t===""?(this._$AH!==et&&this._$AR(),this._$AH=et):t!==this._$AH&&t!==ue&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):fd(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==et&&Ao(this._$AH)?this._$AA.nextSibling.data=t:this.T(Se.createTextNode(t)),this._$AH=t}$(t){var s;const{values:o,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=No.createElement(Oa(r.h,r.h[0]),this.options)),r);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(o);else{const a=new yd(i,this),n=a.u(this.options);a.p(o),this.T(n),this._$AH=a}}_$AC(t){let o=$a.get(t.strings);return o===void 0&&$a.set(t.strings,o=new No(t)),o}k(t){Di(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,i=0;for(const s of t)i===o.length?o.push(r=new So(this.O(Co()),this.O(Co()),this,this.options)):r=o[i],r._$AI(s),i++;i<o.length&&(this._$AR(r&&r._$AB.nextSibling,i),o.length=i)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}}class br{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,i,s){this.type=1,this._$AH=et,this._$AN=void 0,this.element=t,this.name=o,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=et}_$AI(t,o=this,r,i){const s=this.strings;let a=!1;if(s===void 0)t=to(this,t,o,0),a=!Ao(t)||t!==this._$AH&&t!==ue,a&&(this._$AH=t);else{const n=t;let l,c;for(t=s[0],l=0;l<s.length-1;l++)c=to(this,n[r+l],o,l),c===ue&&(c=this._$AH[l]),a||(a=!Ao(c)||c!==this._$AH[l]),c===et?t=et:t!==et&&(t+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(t)}j(t){t===et?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Md extends br{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===et?void 0:t}}class wd extends br{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==et)}}class xd extends br{constructor(t,o,r,i,s){super(t,o,r,i,s),this.type=5}_$AI(t,o=this){if((t=to(this,t,o,0)??et)===ue)return;const r=this._$AH,i=t===et&&r!==et||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==et&&(r===et||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}}class Ld{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){to(this,t)}}const ki=Io.litHtmlPolyfillSupport;ki==null||ki(No,So),(Io.litHtmlVersions??(Io.litHtmlVersions=[])).push("3.3.1");const Id=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const s=(o==null?void 0:o.renderBefore)??null;r._$litPart$=i=new So(t.insertBefore(Co(),s),s,void 0,o??{})}return i._$AI(e),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=globalThis;let ht=class extends Ke{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Id(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return ue}};ht._$litElement$=!0,ht.finalized=!0,(Hn=Ee.litElementHydrateSupport)==null||Hn.call(Ee,{LitElement:ht});const zi=Ee.litElementPolyfillSupport;zi==null||zi({LitElement:ht}),(Ee.litElementVersions??(Ee.litElementVersions=[])).push("4.2.1");function Cd(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";case"query":return"primary";default:return"neutral"}}const Ad=mt`
    :host {
        --http-get-color: var(--terminal-text, #00FF00);
        --http-post-color: var(--primary-color, #62c4ff);
        --http-put-color: var(--primary-color, #62c4ff);
        --http-delete-color: var(--sl-color-danger-600, #ff3c74);
        --http-patch-color: var(--primary-color, #62c4ff);
        --http-options-color: var(--sl-color-neutral-500, #585858);
        --http-head-color: var(--sl-color-neutral-500, #585858);
        --http-trace-color: var(--sl-color-neutral-500, #585858);
        --http-query-color: var(--primary-color, #62c4ff);
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
`;var jd=Object.defineProperty,Nd=Object.getOwnPropertyDescriptor,ke=(e,t,o,r)=>{for(var i=r>1?void 0:r?Nd(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&jd(t,o,i),i};const Sd={GET:"GET",POST:"POST",PUT:"PUT",DELETE:"DEL",PATCH:"PAT",OPTIONS:"OPT",HEAD:"HEAD",TRACE:"TRC",QUERY:"QRY"};let qt=class extends ht{constructor(){super(),this.mode="",this.lower=!1,this.method="GET"}render(){if(this.mode==="nav-naked"){const o=this.method.toUpperCase(),r=Sd[o]??o,i=this.method.toLowerCase();return q`<span class="method-naked ${i}">${r}</span>`}let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.micro?`method ${e} micro`:`method ${e}`;return q`
            <sl-tag variant="${Cd(this.method)}" class="${t}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};qt.styles=Ad,ke([E()],qt.prototype,"method",2),ke([E({type:Boolean})],qt.prototype,"lower",2),ke([E({type:Boolean})],qt.prototype,"large",2),ke([E({type:Boolean})],qt.prototype,"tiny",2),ke([E({type:Boolean})],qt.prototype,"micro",2),ke([E({reflect:!0})],qt.prototype,"mode",2),qt=ke([le("pb33f-http-method")],qt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const _a={ATTRIBUTE:1,CHILD:2},Pa=e=>(...t)=>({_$litDirective$:e,values:t});let Ra=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let $i=class extends Ra{constructor(t){if(super(t),this.it=et,t.type!==_a.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===et||t==null)return this._t=void 0,this.it=t;if(t===ue)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}};$i.directiveName="unsafeHTML",$i.resultType=1;const Ua=Pa($i),Td=mt`
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
`;var Dd=Object.defineProperty,Ed=Object.getOwnPropertyDescriptor,Oi=(e,t,o,r)=>{for(var i=r>1?void 0:r?Ed(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Dd(t,o,i),i};let To=class extends ht{constructor(){super(),this.path="/",this.nowrap=!1}replaceBrackets(){const e=/\{([\w$.#/]+)\}/g,t=this.nowrap?" nowrap":"",o=this.formatSlashes(this.path).replace(e,(r,i)=>`<span class="bracket${t}">{</span><span class="param${t}">${i}</span><span class="bracket${t}">}</span>`);return this.nowrap?q`<div style="white-space: nowrap;">${Ua(o)}</div>`:q`${Ua(o)}`}formatSlashes(e){return e.replaceAll("/",'<span class="slash">/</span>')}render(){return q`${this.replaceBrackets()}`}};To.styles=Td,Oi([E()],To.prototype,"path",2),Oi([E({type:Boolean})],To.prototype,"nowrap",2),To=Oi([le("pb33f-render-operation-path")],To);const kd=mt`
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
    }`;var zd=Object.defineProperty,$d=Object.getOwnPropertyDescriptor,Do=(e,t,o,r)=>{for(var i=r>1?void 0:r?$d(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&zd(t,o,i),i};let ze=class extends ht{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1,this.fluid=!1}render(){const e=this.fluid?"fluid":this.wide?"wide":"";return q`
            <header class="pb33f-header">
                <div class="logo ${e}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};ze.styles=kd,Do([E()],ze.prototype,"name",2),Do([E()],ze.prototype,"url",2),Do([E({type:Boolean})],ze.prototype,"wide",2),Do([E({type:Boolean})],ze.prototype,"fluid",2),ze=Do([le("pb33f-header")],ze);const Od=mt`

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

`,Ya=mt`
    
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
 `,$e="pb33f-theme-change";var _d=Object.defineProperty,Pd=Object.getOwnPropertyDescriptor,_i=(e,t,o,r)=>{for(var i=r>1?void 0:r?Pd(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&_d(t,o,i),i};const Pi="dark",Rd="light",Ud="tektronix",Ba="pb33f-theme",Ha="pb33f-base-theme";let Eo=class extends ht{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Ud:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(Ba);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(Ha);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(Ba,e),localStorage.setItem(Ha,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===Rd?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent($e,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Pi?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===Pi?"sun":"moon",t=this.baseTheme===Pi?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",o=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return q`
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
        `}};Eo.styles=[Od,Ya],_i([Ne()],Eo.prototype,"baseTheme",2),_i([Ne()],Eo.prototype,"tektronixActive",2),Eo=_i([le("pb33f-theme-switcher")],Eo);var Yd=mt`
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
`;const Ri=new Set,eo=new Map;let Oe,Ui="ltr",Yi="en";const Qa=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Qa){const e=new MutationObserver(Wa);Ui=document.documentElement.dir||"ltr",Yi=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Za(...e){e.map(t=>{const o=t.$code.toLowerCase();eo.has(o)?eo.set(o,Object.assign(Object.assign({},eo.get(o)),t)):eo.set(o,t),Oe||(Oe=t)}),Wa()}function Wa(){Qa&&(Ui=document.documentElement.dir||"ltr",Yi=document.documentElement.lang||navigator.language),[...Ri.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Bd=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Ri.add(this.host)}hostDisconnected(){Ri.delete(this.host)}dir(){return`${this.host.dir||Ui}`.toLowerCase()}lang(){return`${this.host.lang||Yi}`.toLowerCase()}getTranslationData(t){var o,r;const i=new Intl.Locale(t.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),a=(r=(o=i==null?void 0:i.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",n=eo.get(`${s}-${a}`),l=eo.get(s);return{locale:i,language:s,region:a,primary:n,secondary:l}}exists(t,o){var r;const{primary:i,secondary:s}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(i&&i[t]||s&&s[t]||o.includeFallback&&Oe&&Oe[t])}term(t,...o){const{primary:r,secondary:i}=this.getTranslationData(this.lang());let s;if(r&&r[t])s=r[t];else if(i&&i[t])s=i[t];else if(Oe&&Oe[t])s=Oe[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof s=="function"?s(...o):s}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var Fa={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};Za(Fa);var Hd=Fa,Ga=class extends Bd{};Za(Hd);var Qd=mt`
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
`,Va=Object.defineProperty,Zd=Object.defineProperties,Wd=Object.getOwnPropertyDescriptors,Ja=Object.getOwnPropertySymbols,Fd=Object.prototype.hasOwnProperty,Gd=Object.prototype.propertyIsEnumerable,Xa=e=>{throw TypeError(e)},Ka=(e,t,o)=>t in e?Va(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,qa=(e,t)=>{for(var o in t||(t={}))Fd.call(t,o)&&Ka(e,o,t[o]);if(Ja)for(var o of Ja(t))Gd.call(t,o)&&Ka(e,o,t[o]);return e},Vd=(e,t)=>Zd(e,Wd(t)),R=(e,t,o,r)=>{for(var i=void 0,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=a(t,o,i)||i);return i&&Va(t,o,i),i},tn=(e,t,o)=>t.has(e)||Xa("Cannot "+o),Jd=(e,t,o)=>(tn(e,t,"read from private field"),t.get(e)),Xd=(e,t,o)=>t.has(e)?Xa("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),Kd=(e,t,o,r)=>(tn(e,t,"write to private field"),t.set(e,o),o),vr,oo=class extends ht{constructor(){super(),Xd(this,vr,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const o=new CustomEvent(e,qa({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const r=customElements.get(e);if(!r){try{customElements.define(e,t,o)}catch{customElements.define(e,class extends t{},o)}return}let i=" (unknown version)",s=i;"version"in t&&t.version&&(i=" v"+t.version),"version"in r&&r.version&&(s=" v"+r.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,o){Jd(this,vr)||(this.constructor.elementProperties.forEach((r,i)=>{r.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Kd(this,vr,!0)),super.attributeChangedCallback(e,t,o)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,o)=>{e.has(o)&&this[o]==null&&(this[o]=t)})}};vr=new WeakMap,oo.version="2.20.1",oo.dependencies={},R([E()],oo.prototype,"dir"),R([E()],oo.prototype,"lang");const pe=Math.min,wt=Math.max,yr=Math.round,Mr=Math.floor,Ht=e=>({x:e,y:e}),qd={left:"right",right:"left",bottom:"top",top:"bottom"};function Bi(e,t,o){return wt(e,pe(t,o))}function ro(e,t){return typeof e=="function"?e(t):e}function he(e){return e.split("-")[0]}function io(e){return e.split("-")[1]}function en(e){return e==="x"?"y":"x"}function Hi(e){return e==="y"?"height":"width"}function te(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function Qi(e){return en(te(e))}function tu(e,t,o){o===void 0&&(o=!1);const r=io(e),i=Qi(e),s=Hi(i);let a=i==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[s]>t.floating[s]&&(a=wr(a)),[a,wr(a)]}function eu(e){const t=wr(e);return[Zi(e),t,Zi(t)]}function Zi(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const on=["left","right"],rn=["right","left"],ou=["top","bottom"],ru=["bottom","top"];function iu(e,t,o){switch(e){case"top":case"bottom":return o?t?rn:on:t?on:rn;case"left":case"right":return t?ou:ru;default:return[]}}function su(e,t,o,r){const i=io(e);let s=iu(he(e),o==="start",r);return i&&(s=s.map(a=>a+"-"+i),t&&(s=s.concat(s.map(Zi)))),s}function wr(e){const t=he(e);return qd[t]+e.slice(t.length)}function au(e){return{top:0,right:0,bottom:0,left:0,...e}}function sn(e){return typeof e!="number"?au(e):{top:e,right:e,bottom:e,left:e}}function xr(e){const{x:t,y:o,width:r,height:i}=e;return{width:r,height:i,top:o,left:t,right:t+r,bottom:o+i,x:t,y:o}}function an(e,t,o){let{reference:r,floating:i}=e;const s=te(t),a=Qi(t),n=Hi(a),l=he(t),c=s==="y",g=r.x+r.width/2-i.width/2,m=r.y+r.height/2-i.height/2,M=r[n]/2-i[n]/2;let b;switch(l){case"top":b={x:g,y:r.y-i.height};break;case"bottom":b={x:g,y:r.y+r.height};break;case"right":b={x:r.x+r.width,y:m};break;case"left":b={x:r.x-i.width,y:m};break;default:b={x:r.x,y:r.y}}switch(io(t)){case"start":b[a]-=M*(o&&c?-1:1);break;case"end":b[a]+=M*(o&&c?-1:1);break}return b}async function nu(e,t){var o;t===void 0&&(t={});const{x:r,y:i,platform:s,rects:a,elements:n,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:g="viewport",elementContext:m="floating",altBoundary:M=!1,padding:b=0}=ro(t,e),w=sn(b),j=n[M?m==="floating"?"reference":"floating":m],A=xr(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(j)))==null||o?j:j.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(n.floating)),boundary:c,rootBoundary:g,strategy:l})),v=m==="floating"?{x:r,y:i,width:a.floating.width,height:a.floating.height}:a.reference,f=await(s.getOffsetParent==null?void 0:s.getOffsetParent(n.floating)),x=await(s.isElement==null?void 0:s.isElement(f))?await(s.getScale==null?void 0:s.getScale(f))||{x:1,y:1}:{x:1,y:1},I=xr(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:v,offsetParent:f,strategy:l}):v);return{top:(A.top-I.top+w.top)/x.y,bottom:(I.bottom-A.bottom+w.bottom)/x.y,left:(A.left-I.left+w.left)/x.x,right:(I.right-A.right+w.right)/x.x}}const lu=50,cu=async(e,t,o)=>{const{placement:r="bottom",strategy:i="absolute",middleware:s=[],platform:a}=o,n=a.detectOverflow?a:{...a,detectOverflow:nu},l=await(a.isRTL==null?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:i}),{x:g,y:m}=an(c,r,l),M=r,b=0;const w={};for(let C=0;C<s.length;C++){const j=s[C];if(!j)continue;const{name:A,fn:v}=j,{x:f,y:x,data:I,reset:L}=await v({x:g,y:m,initialPlacement:r,placement:M,strategy:i,middlewareData:w,rects:c,platform:n,elements:{reference:e,floating:t}});g=f??g,m=x??m,w[A]={...w[A],...I},L&&b<lu&&(b++,typeof L=="object"&&(L.placement&&(M=L.placement),L.rects&&(c=L.rects===!0?await a.getElementRects({reference:e,floating:t,strategy:i}):L.rects),{x:g,y:m}=an(c,M,l)),C=-1)}return{x:g,y:m,placement:M,strategy:i,middlewareData:w}},du=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:i,rects:s,platform:a,elements:n,middlewareData:l}=t,{element:c,padding:g=0}=ro(e,t)||{};if(c==null)return{};const m=sn(g),M={x:o,y:r},b=Qi(i),w=Hi(b),C=await a.getDimensions(c),j=b==="y",A=j?"top":"left",v=j?"bottom":"right",f=j?"clientHeight":"clientWidth",x=s.reference[w]+s.reference[b]-M[b]-s.floating[w],I=M[b]-s.reference[b],L=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let N=L?L[f]:0;(!N||!await(a.isElement==null?void 0:a.isElement(L)))&&(N=n.floating[f]||s.floating[w]);const z=x/2-I/2,S=N/2-C[w]/2-1,$=pe(m[A],S),U=pe(m[v],S),H=$,ot=N-C[w]-U,Y=N/2-C[w]/2+z,dt=Bi(H,Y,ot),tt=!l.arrow&&io(i)!=null&&Y!==dt&&s.reference[w]/2-(Y<H?$:U)-C[w]/2<0,V=tt?Y<H?Y-H:Y-ot:0;return{[b]:M[b]+V,data:{[b]:dt,centerOffset:Y-dt-V,...tt&&{alignmentOffset:V}},reset:tt}}}),uu=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:i,middlewareData:s,rects:a,initialPlacement:n,platform:l,elements:c}=t,{mainAxis:g=!0,crossAxis:m=!0,fallbackPlacements:M,fallbackStrategy:b="bestFit",fallbackAxisSideDirection:w="none",flipAlignment:C=!0,...j}=ro(e,t);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const A=he(i),v=te(n),f=he(n)===n,x=await(l.isRTL==null?void 0:l.isRTL(c.floating)),I=M||(f||!C?[wr(n)]:eu(n)),L=w!=="none";!M&&L&&I.push(...su(n,C,w,x));const N=[n,...I],z=await l.detectOverflow(t,j),S=[];let $=((r=s.flip)==null?void 0:r.overflows)||[];if(g&&S.push(z[A]),m){const Y=tu(i,a,x);S.push(z[Y[0]],z[Y[1]])}if($=[...$,{placement:i,overflows:S}],!S.every(Y=>Y<=0)){var U,H;const Y=(((U=s.flip)==null?void 0:U.index)||0)+1,dt=N[Y];if(dt&&(!(m==="alignment"?v!==te(dt):!1)||$.every(_=>te(_.placement)===v?_.overflows[0]>0:!0)))return{data:{index:Y,overflows:$},reset:{placement:dt}};let tt=(H=$.filter(V=>V.overflows[0]<=0).sort((V,_)=>V.overflows[1]-_.overflows[1])[0])==null?void 0:H.placement;if(!tt)switch(b){case"bestFit":{var ot;const V=(ot=$.filter(_=>{if(L){const F=te(_.placement);return F===v||F==="y"}return!0}).map(_=>[_.placement,_.overflows.filter(F=>F>0).reduce((F,Gt)=>F+Gt,0)]).sort((_,F)=>_[1]-F[1])[0])==null?void 0:ot[0];V&&(tt=V);break}case"initialPlacement":tt=n;break}if(i!==tt)return{reset:{placement:tt}}}return{}}}},pu=new Set(["left","top"]);async function hu(e,t){const{placement:o,platform:r,elements:i}=e,s=await(r.isRTL==null?void 0:r.isRTL(i.floating)),a=he(o),n=io(o),l=te(o)==="y",c=pu.has(a)?-1:1,g=s&&l?-1:1,m=ro(t,e);let{mainAxis:M,crossAxis:b,alignmentAxis:w}=typeof m=="number"?{mainAxis:m,crossAxis:0,alignmentAxis:null}:{mainAxis:m.mainAxis||0,crossAxis:m.crossAxis||0,alignmentAxis:m.alignmentAxis};return n&&typeof w=="number"&&(b=n==="end"?w*-1:w),l?{x:b*g,y:M*c}:{x:M*c,y:b*g}}const gu=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:i,y:s,placement:a,middlewareData:n}=t,l=await hu(t,e);return a===((o=n.offset)==null?void 0:o.placement)&&(r=n.arrow)!=null&&r.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:a}}}}},mu=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:i,platform:s}=t,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:A=>{let{x:v,y:f}=A;return{x:v,y:f}}},...c}=ro(e,t),g={x:o,y:r},m=await s.detectOverflow(t,c),M=te(he(i)),b=en(M);let w=g[b],C=g[M];if(a){const A=b==="y"?"top":"left",v=b==="y"?"bottom":"right",f=w+m[A],x=w-m[v];w=Bi(f,w,x)}if(n){const A=M==="y"?"top":"left",v=M==="y"?"bottom":"right",f=C+m[A],x=C-m[v];C=Bi(f,C,x)}const j=l.fn({...t,[b]:w,[M]:C});return{...j,data:{x:j.x-o,y:j.y-r,enabled:{[b]:a,[M]:n}}}}}},fu=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:i,rects:s,platform:a,elements:n}=t,{apply:l=()=>{},...c}=ro(e,t),g=await a.detectOverflow(t,c),m=he(i),M=io(i),b=te(i)==="y",{width:w,height:C}=s.floating;let j,A;m==="top"||m==="bottom"?(j=m,A=M===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(A=m,j=M==="end"?"top":"bottom");const v=C-g.top-g.bottom,f=w-g.left-g.right,x=pe(C-g[j],v),I=pe(w-g[A],f),L=!t.middlewareData.shift;let N=x,z=I;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(z=f),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(N=v),L&&!M){const $=wt(g.left,0),U=wt(g.right,0),H=wt(g.top,0),ot=wt(g.bottom,0);b?z=w-2*($!==0||U!==0?$+U:wt(g.left,g.right)):N=C-2*(H!==0||ot!==0?H+ot:wt(g.top,g.bottom))}await l({...t,availableWidth:z,availableHeight:N});const S=await a.getDimensions(n.floating);return w!==S.width||C!==S.height?{reset:{rects:!0}}:{}}}};function Lr(){return typeof window<"u"}function so(e){return nn(e)?(e.nodeName||"").toLowerCase():"#document"}function xt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Qt(e){var t;return(t=(nn(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function nn(e){return Lr()?e instanceof Node||e instanceof xt(e).Node:!1}function Et(e){return Lr()?e instanceof Element||e instanceof xt(e).Element:!1}function ee(e){return Lr()?e instanceof HTMLElement||e instanceof xt(e).HTMLElement:!1}function ln(e){return!Lr()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof xt(e).ShadowRoot}function ko(e){const{overflow:t,overflowX:o,overflowY:r,display:i}=kt(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&i!=="inline"&&i!=="contents"}function bu(e){return/^(table|td|th)$/.test(so(e))}function Ir(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const vu=/transform|translate|scale|rotate|perspective|filter/,yu=/paint|layout|strict|content/,_e=e=>!!e&&e!=="none";let Wi;function Cr(e){const t=Et(e)?kt(e):e;return _e(t.transform)||_e(t.translate)||_e(t.scale)||_e(t.rotate)||_e(t.perspective)||!Fi()&&(_e(t.backdropFilter)||_e(t.filter))||vu.test(t.willChange||"")||yu.test(t.contain||"")}function Mu(e){let t=ge(e);for(;ee(t)&&!ao(t);){if(Cr(t))return t;if(Ir(t))return null;t=ge(t)}return null}function Fi(){return Wi==null&&(Wi=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Wi}function ao(e){return/^(html|body|#document)$/.test(so(e))}function kt(e){return xt(e).getComputedStyle(e)}function Ar(e){return Et(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ge(e){if(so(e)==="html")return e;const t=e.assignedSlot||e.parentNode||ln(e)&&e.host||Qt(e);return ln(t)?t.host:t}function cn(e){const t=ge(e);return ao(t)?e.ownerDocument?e.ownerDocument.body:e.body:ee(t)&&ko(t)?t:cn(t)}function zo(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const i=cn(e),s=i===((r=e.ownerDocument)==null?void 0:r.body),a=xt(i);if(s){const n=Gi(a);return t.concat(a,a.visualViewport||[],ko(i)?i:[],n&&o?zo(n):[])}else return t.concat(i,zo(i,[],o))}function Gi(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function dn(e){const t=kt(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const i=ee(e),s=i?e.offsetWidth:o,a=i?e.offsetHeight:r,n=yr(o)!==s||yr(r)!==a;return n&&(o=s,r=a),{width:o,height:r,$:n}}function Vi(e){return Et(e)?e:e.contextElement}function no(e){const t=Vi(e);if(!ee(t))return Ht(1);const o=t.getBoundingClientRect(),{width:r,height:i,$:s}=dn(t);let a=(s?yr(o.width):o.width)/r,n=(s?yr(o.height):o.height)/i;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const wu=Ht(0);function un(e){const t=xt(e);return!Fi()||!t.visualViewport?wu:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function xu(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==xt(e)?!1:t}function Pe(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const i=e.getBoundingClientRect(),s=Vi(e);let a=Ht(1);t&&(r?Et(r)&&(a=no(r)):a=no(e));const n=xu(s,o,r)?un(s):Ht(0);let l=(i.left+n.x)/a.x,c=(i.top+n.y)/a.y,g=i.width/a.x,m=i.height/a.y;if(s){const M=xt(s),b=r&&Et(r)?xt(r):r;let w=M,C=Gi(w);for(;C&&r&&b!==w;){const j=no(C),A=C.getBoundingClientRect(),v=kt(C),f=A.left+(C.clientLeft+parseFloat(v.paddingLeft))*j.x,x=A.top+(C.clientTop+parseFloat(v.paddingTop))*j.y;l*=j.x,c*=j.y,g*=j.x,m*=j.y,l+=f,c+=x,w=xt(C),C=Gi(w)}}return xr({width:g,height:m,x:l,y:c})}function jr(e,t){const o=Ar(e).scrollLeft;return t?t.left+o:Pe(Qt(e)).left+o}function pn(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-jr(e,o),i=o.top+t.scrollTop;return{x:r,y:i}}function Lu(e){let{elements:t,rect:o,offsetParent:r,strategy:i}=e;const s=i==="fixed",a=Qt(r),n=t?Ir(t.floating):!1;if(r===a||n&&s)return o;let l={scrollLeft:0,scrollTop:0},c=Ht(1);const g=Ht(0),m=ee(r);if((m||!m&&!s)&&((so(r)!=="body"||ko(a))&&(l=Ar(r)),m)){const b=Pe(r);c=no(r),g.x=b.x+r.clientLeft,g.y=b.y+r.clientTop}const M=a&&!m&&!s?pn(a,l):Ht(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+g.x+M.x,y:o.y*c.y-l.scrollTop*c.y+g.y+M.y}}function Iu(e){return Array.from(e.getClientRects())}function Cu(e){const t=Qt(e),o=Ar(e),r=e.ownerDocument.body,i=wt(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),s=wt(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let a=-o.scrollLeft+jr(e);const n=-o.scrollTop;return kt(r).direction==="rtl"&&(a+=wt(t.clientWidth,r.clientWidth)-i),{width:i,height:s,x:a,y:n}}const hn=25;function Au(e,t){const o=xt(e),r=Qt(e),i=o.visualViewport;let s=r.clientWidth,a=r.clientHeight,n=0,l=0;if(i){s=i.width,a=i.height;const g=Fi();(!g||g&&t==="fixed")&&(n=i.offsetLeft,l=i.offsetTop)}const c=jr(r);if(c<=0){const g=r.ownerDocument,m=g.body,M=getComputedStyle(m),b=g.compatMode==="CSS1Compat"&&parseFloat(M.marginLeft)+parseFloat(M.marginRight)||0,w=Math.abs(r.clientWidth-m.clientWidth-b);w<=hn&&(s-=w)}else c<=hn&&(s+=c);return{width:s,height:a,x:n,y:l}}function ju(e,t){const o=Pe(e,!0,t==="fixed"),r=o.top+e.clientTop,i=o.left+e.clientLeft,s=ee(e)?no(e):Ht(1),a=e.clientWidth*s.x,n=e.clientHeight*s.y,l=i*s.x,c=r*s.y;return{width:a,height:n,x:l,y:c}}function gn(e,t,o){let r;if(t==="viewport")r=Au(e,o);else if(t==="document")r=Cu(Qt(e));else if(Et(t))r=ju(t,o);else{const i=un(e);r={x:t.x-i.x,y:t.y-i.y,width:t.width,height:t.height}}return xr(r)}function mn(e,t){const o=ge(e);return o===t||!Et(o)||ao(o)?!1:kt(o).position==="fixed"||mn(o,t)}function Nu(e,t){const o=t.get(e);if(o)return o;let r=zo(e,[],!1).filter(n=>Et(n)&&so(n)!=="body"),i=null;const s=kt(e).position==="fixed";let a=s?ge(e):e;for(;Et(a)&&!ao(a);){const n=kt(a),l=Cr(a);!l&&n.position==="fixed"&&(i=null),(s?!l&&!i:!l&&n.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||ko(a)&&!l&&mn(e,a))?r=r.filter(g=>g!==a):i=n,a=ge(a)}return t.set(e,r),r}function Su(e){let{element:t,boundary:o,rootBoundary:r,strategy:i}=e;const a=[...o==="clippingAncestors"?Ir(t)?[]:Nu(t,this._c):[].concat(o),r],n=gn(t,a[0],i);let l=n.top,c=n.right,g=n.bottom,m=n.left;for(let M=1;M<a.length;M++){const b=gn(t,a[M],i);l=wt(b.top,l),c=pe(b.right,c),g=pe(b.bottom,g),m=wt(b.left,m)}return{width:c-m,height:g-l,x:m,y:l}}function Tu(e){const{width:t,height:o}=dn(e);return{width:t,height:o}}function Du(e,t,o){const r=ee(t),i=Qt(t),s=o==="fixed",a=Pe(e,!0,s,t);let n={scrollLeft:0,scrollTop:0};const l=Ht(0);function c(){l.x=jr(i)}if(r||!r&&!s)if((so(t)!=="body"||ko(i))&&(n=Ar(t)),r){const b=Pe(t,!0,s,t);l.x=b.x+t.clientLeft,l.y=b.y+t.clientTop}else i&&c();s&&!r&&i&&c();const g=i&&!r&&!s?pn(i,n):Ht(0),m=a.left+n.scrollLeft-l.x-g.x,M=a.top+n.scrollTop-l.y-g.y;return{x:m,y:M,width:a.width,height:a.height}}function Ji(e){return kt(e).position==="static"}function fn(e,t){if(!ee(e)||kt(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return Qt(e)===o&&(o=o.ownerDocument.body),o}function bn(e,t){const o=xt(e);if(Ir(e))return o;if(!ee(e)){let i=ge(e);for(;i&&!ao(i);){if(Et(i)&&!Ji(i))return i;i=ge(i)}return o}let r=fn(e,t);for(;r&&bu(r)&&Ji(r);)r=fn(r,t);return r&&ao(r)&&Ji(r)&&!Cr(r)?o:r||Mu(e)||o}const Eu=async function(e){const t=this.getOffsetParent||bn,o=this.getDimensions,r=await o(e.floating);return{reference:Du(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function ku(e){return kt(e).direction==="rtl"}const Nr={convertOffsetParentRelativeRectToViewportRelativeRect:Lu,getDocumentElement:Qt,getClippingRect:Su,getOffsetParent:bn,getElementRects:Eu,getClientRects:Iu,getDimensions:Tu,getScale:no,isElement:Et,isRTL:ku};function vn(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function zu(e,t){let o=null,r;const i=Qt(e);function s(){var n;clearTimeout(r),(n=o)==null||n.disconnect(),o=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),s();const c=e.getBoundingClientRect(),{left:g,top:m,width:M,height:b}=c;if(n||t(),!M||!b)return;const w=Mr(m),C=Mr(i.clientWidth-(g+M)),j=Mr(i.clientHeight-(m+b)),A=Mr(g),f={rootMargin:-w+"px "+-C+"px "+-j+"px "+-A+"px",threshold:wt(0,pe(1,l))||1};let x=!0;function I(L){const N=L[0].intersectionRatio;if(N!==l){if(!x)return a();N?a(!1,N):r=setTimeout(()=>{a(!1,1e-7)},1e3)}N===1&&!vn(c,e.getBoundingClientRect())&&a(),x=!1}try{o=new IntersectionObserver(I,{...f,root:i.ownerDocument})}catch{o=new IntersectionObserver(I,f)}o.observe(e)}return a(!0),s}function $u(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=Vi(e),g=i||s?[...c?zo(c):[],...t?zo(t):[]]:[];g.forEach(A=>{i&&A.addEventListener("scroll",o,{passive:!0}),s&&A.addEventListener("resize",o)});const m=c&&n?zu(c,o):null;let M=-1,b=null;a&&(b=new ResizeObserver(A=>{let[v]=A;v&&v.target===c&&b&&t&&(b.unobserve(t),cancelAnimationFrame(M),M=requestAnimationFrame(()=>{var f;(f=b)==null||f.observe(t)})),o()}),c&&!l&&b.observe(c),t&&b.observe(t));let w,C=l?Pe(e):null;l&&j();function j(){const A=Pe(e);C&&!vn(C,A)&&o(),C=A,w=requestAnimationFrame(j)}return o(),()=>{var A;g.forEach(v=>{i&&v.removeEventListener("scroll",o),s&&v.removeEventListener("resize",o)}),m==null||m(),(A=b)==null||A.disconnect(),b=null,l&&cancelAnimationFrame(w)}}const Ou=gu,_u=mu,Pu=uu,yn=fu,Ru=du,Uu=(e,t,o)=>{const r=new Map,i={platform:Nr,...o},s={...i.platform,_c:r};return cu(e,t,{...i,platform:s})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mn=Pa(class extends Ra{constructor(e){var t;if(super(e),e.type!==_a.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var r,i;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((s=>s!==""))));for(const s in t)t[s]&&!((r=this.nt)!=null&&r.has(s))&&this.st.add(s);return this.render(t)}const o=e.element.classList;for(const s of this.st)s in t||(o.remove(s),this.st.delete(s));for(const s in t){const a=!!t[s];a===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(a?(o.add(s),this.st.add(s)):(o.remove(s),this.st.delete(s)))}return ue}});function Yu(e){return Bu(e)}function Xi(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Bu(e){for(let t=e;t;t=Xi(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=Xi(e);t;t=Xi(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||Cr(o)||t.tagName==="BODY"))return t}return null}function Hu(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var G=class extends oo{constructor(){super(...arguments),this.localize=new Ga(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom");let r=0,i=0,s=0,a=0,n=0,l=0,c=0,g=0;o?e.top<t.top?(r=e.left,i=e.bottom,s=e.right,a=e.bottom,n=t.left,l=t.top,c=t.right,g=t.top):(r=t.left,i=t.bottom,s=t.right,a=t.bottom,n=e.left,l=e.top,c=e.right,g=e.top):e.left<t.left?(r=e.right,i=e.top,s=t.left,a=t.top,n=e.right,l=e.bottom,c=t.left,g=t.bottom):(r=t.right,i=t.top,s=e.left,a=e.top,n=t.right,l=t.bottom,c=e.left,g=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${g}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||Hu(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=$u(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[Ou({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(yn({apply:({rects:o})=>{const r=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=i?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(Pu({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(_u({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(yn({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Ru({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?o=>Nr.getOffsetParent(o,Yu):Nr.getOffsetParent;Uu(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:Vd(qa({},Nr),{getOffsetParent:t})}).then(({x:o,y:r,middlewareData:i,placement:s})=>{const a=this.localize.dir()==="rtl",n={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let g="",m="",M="",b="";if(this.arrowPlacement==="start"){const w=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";g=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",m=a?w:"",b=a?"":w}else if(this.arrowPlacement==="end"){const w=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";m=a?"":w,b=a?w:"",M=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(b=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",g=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(b=typeof l=="number"?`${l}px`:"",g=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:g,right:m,bottom:M,left:b,[n]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return q`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${Mn({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${Mn({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?q`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};G.styles=[Qd,Yd],R([qe(".popup")],G.prototype,"popup"),R([qe(".popup__arrow")],G.prototype,"arrowEl"),R([E()],G.prototype,"anchor"),R([E({type:Boolean,reflect:!0})],G.prototype,"active"),R([E({reflect:!0})],G.prototype,"placement"),R([E({reflect:!0})],G.prototype,"strategy"),R([E({type:Number})],G.prototype,"distance"),R([E({type:Number})],G.prototype,"skidding"),R([E({type:Boolean})],G.prototype,"arrow"),R([E({attribute:"arrow-placement"})],G.prototype,"arrowPlacement"),R([E({attribute:"arrow-padding",type:Number})],G.prototype,"arrowPadding"),R([E({type:Boolean})],G.prototype,"flip"),R([E({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],G.prototype,"flipFallbackPlacements"),R([E({attribute:"flip-fallback-strategy"})],G.prototype,"flipFallbackStrategy"),R([E({type:Object})],G.prototype,"flipBoundary"),R([E({attribute:"flip-padding",type:Number})],G.prototype,"flipPadding"),R([E({type:Boolean})],G.prototype,"shift"),R([E({type:Object})],G.prototype,"shiftBoundary"),R([E({attribute:"shift-padding",type:Number})],G.prototype,"shiftPadding"),R([E({attribute:"auto-size"})],G.prototype,"autoSize"),R([E()],G.prototype,"sync"),R([E({type:Object})],G.prototype,"autoSizeBoundary"),R([E({attribute:"auto-size-padding",type:Number})],G.prototype,"autoSizePadding"),R([E({attribute:"hover-bridge",type:Boolean})],G.prototype,"hoverBridge"),G.define("sl-popup");const Qu=mt`

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
    
`,Zu=mt`
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
`,Wu=mt`
    
    em, i {
        font-style: normal;
        font-family: var(--font-stack-italic), monospace;
    }
    
    strong {
        font-style: normal;
        font-family: var(--font-stack-bold), monospace;
    }
    

`;var T=(e=>(e.VERSION="version",e.SCHEMA="schema",e.SCHEMAS="schemas",e.SCHEMA_TYPES="types",e.MEDIA_TYPE="mediaType",e.HEADER="header",e.EXAMPLE="example",e.EXAMPLES="examples",e.ENCODING="encoding",e.REQUEST_BODY="requestBody",e.REQUEST_BODIES="requestBodies",e.PARAMETER="parameter",e.PARAMETER_QUERY="query",e.COOKIE="cookie",e.PARAMETERS="parameters",e.LINK="link",e.LINKS="links",e.RESPONSE="response",e.RESPONSES="responses",e.OPERATION="operation",e.OPERATIONS="operations",e.SECURITY_SCHEME="securityScheme",e.SECURITY_SCHEMES="securitySchemes",e.EXTERNAL_DOCS="externalDocs",e.SECURITY="security",e.CALLBACK="callback",e.CALLBACKS="callbacks",e.PATH_ITEM="pathItem",e.PATH_ITEMS="pathItems",e.XML="xml",e.HEADERS="headers",e.SERVER="server",e.SERVERS="servers",e.SERVER_VARIABLE="serverVariable",e.PATHS="paths",e.COMPONENTS="components",e.CONTACT="contact",e.LICENSE="license",e.INFO="info",e.TAG="tag",e.TAGS="tags",e.DOCUMENT="document",e.WEBHOOK="webhook",e.WEBHOOKS="webhooks",e.EXTENSIONS="extensions",e.EXTENSION="extension",e.NO_EXAMPLE="noExample",e.POLYMORPHIC="polymorphic",e.ERROR="error",e.WARNING="warning",e.ROLODEX_FILE="rolodex-file",e.ROLODEX_FOLDER="rolodex-dir",e.OPENAPI="openapi",e.UPLOAD="upload",e.ADD="add",e.UNKNOWN="unknown",e.EXPAND_NODE="expand-node",e.POV_MODE="pov-mode",e.JS="js",e.GO="go",e.TS="ts",e.CS="cs",e.C="c",e.CPP="cpp",e.PHP="php",e.PY="py",e.HTML="html",e.MD="md",e.JAVA="java",e.RS="rs",e.ZIG="zig",e.RB="rb",e.YAML="yaml",e.JSON="json",e))(T||{}),Fu=Object.defineProperty,Gu=Object.getOwnPropertyDescriptor,$o=(e,t,o,r)=>{for(var i=r>1?void 0:r?Gu(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Fu(t,o,i),i},wn=(e=>(e.tiny="tiny",e.small="small",e.smaller="smaller",e.medium="medium",e.large="large",e.huge="huge",e))(wn||{}),xn=(e=>(e.primary="primary",e.secondary="secondary",e.inverse="inverse",e.font="font",e.warning="warning",e.polymorphic="polymorphic",e.error="error",e.filtered="filtered",e))(xn||{});let me=class extends ht{constructor(){super(),this._themeHandler=()=>this.requestUpdate(),this.size="medium",this.color="primary"}getSize(){switch(this.size){case"tiny":return"0.8rem";case"smaller":return"1.2rem";case"medium":return"1.4rem";case"large":return"1.8rem";case"huge":return"2rem";case"small":default:return"1rem"}}getIconColor(){switch(this.color){case"primary":return"var(--primary-color)";case"secondary":return"var(--secondary-color)";case"warning":return"var(--warn-color)";case"polymorphic":return"var(--warn-color)";case"error":return"var(--error-color)";case"inverse":return"var(--background-color)";case"filtered":return"var(--font-color-sub2)";case"font":default:return"var(--font-color)"}}connectedCallback(){super.connectedCallback(),window.addEventListener($e,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener($e,this._themeHandler)}isLightMode(){return document.documentElement.getAttribute("theme")==="light"}getNodeTypeFromIcon(e){return Object.values(T).includes(e)?e:T.SCHEMA}static getIconForType(e){switch(e){case T.DOCUMENT:return"stars";case T.SCHEMA:return"box";case T.SCHEMA_TYPES:return"diagram-3";case T.MEDIA_TYPE:case T.XML:return"code-slash";case T.HEADER:case T.HEADERS:return"envelope";case T.EXAMPLE:case T.EXAMPLES:return"chat-left-quote";case T.ENCODING:return"box-seam";case T.REQUEST_BODY:case T.REQUEST_BODIES:return"box-arrow-in-right";case T.PARAMETER:case T.PARAMETERS:case T.SERVER_VARIABLE:return"braces-asterisk";case T.PARAMETER_QUERY:return"question-lg";case T.COOKIE:return"cookie";case T.LINK:case T.LINKS:return"link";case T.RESPONSE:case T.RESPONSES:return"box-arrow-left";case T.OPERATION:case T.OPERATIONS:return"gear-wide-connected";case T.SECURITY_SCHEME:case T.SECURITY_SCHEMES:case T.SECURITY:return"shield-lock";case T.CALLBACK:case T.CALLBACKS:return"telephone-outbound";case T.PATH_ITEM:case T.PATH_ITEMS:return"geo";case T.SERVER:case T.SERVERS:return"hdd-network";case T.PATHS:return"compass";case T.COMPONENTS:return"boxes";case T.CONTACT:return"person-circle";case T.LICENSE:return"patch-check";case T.UPLOAD:return"upload";case T.INFO:return"info-square";case T.TAG:return"tag";case T.TAGS:return"tags";case T.VERSION:return"award";case T.EXTENSIONS:case T.EXTENSION:return"plug";case T.WEBHOOK:case T.WEBHOOKS:return"arrow-clockwise";case T.NO_EXAMPLE:return"exclamation-circle";case T.POLYMORPHIC:return"diagram-3";case T.ERROR:return"x-square";case T.WARNING:return"exclamation-triangle";case T.ROLODEX_FOLDER:return"folder";case T.ROLODEX_FILE:return"journal-code";case T.JS:return"filetype-js";case T.PHP:return"filetype-php";case T.PY:return"filetype-py";case T.HTML:return"filetype-html";case T.MD:return"markdown";case T.JAVA:return"filetype-java";case T.EXTERNAL_DOCS:return"journals";case T.RB:return"filetype-rb";case T.EXPAND_NODE:return"node-plus";case T.POV_MODE:return"binoculars";default:return"box"}}openapiIcon(){return this.isLightMode()?"PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogIzAwMDsiLz4KPC9zdmc+":"PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogI2ZmZjsiLz4KPC9zdmc+"}goIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIuMDAwMDAxIj4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMDIwLjM2MjIpIj4KICAgIDxlbGxpcHNlIGN4PSItOTA3LjM1NjU3IiBjeT0iNDc5LjkwMDA5IiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0ic2NhbGUoLTEgMSkgcm90YXRlKC02MC41NDgpIi8+CiAgICA8ZWxsaXBzZSBjeD0iLTg5MS41NzY1NCIgY3k9IjUwNy44NDYxIiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0icm90YXRlKC02MC41NDgpIi8+CiAgICA8cGF0aCBmaWxsPSIjMzg0ZTU0IiBkPSJNMTYuMDkxNjkzIDEwMjEuMzY0MmMtMS4xMDU3NDkuMDEtMi4yMTAzNDEuMDQ5LTMuMzE2MDkuMDlDNi44NDIyNTU4IDEwMjEuNjczOCAyIDEwMjYuMzk0MiAyIDEwMzIuMzYyMnYyMGgyOHYtMjBjMC01Ljk2ODMtNC42NjczNDUtMTAuNDkxMi0xMC41OTAyMy0xMC45MDgtMS4xMDU3NS0uMDc4LTIuMjEyMzI4LS4wOTktMy4zMTgwNzctLjA5eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNNC42MDc4ODY3IDEwMjUuMDQ2MmMuNDU5NTY0LjI1OTUgMS44MTgyNjIgMS4yMDEzIDEuOTgwOTgzIDEuNjQ4LjE4MzQwMS41MDM1LjE1OTM4NSAxLjA2NTctLjExNDYxNCAxLjU1MS0uMzQ2NjI3LjYxMzgtMS4wMDUzNDEuOTQ4Ny0xLjY5NjQyMS45MzY1LS4zMzk4ODYtLjAxLTEuNzIwMjgzLS42MzcyLTIuMDQyNTYxLS44MTkyLS45Nzc1NC0uNTUxOS0xLjM1MDc5NS0xLjc0MTgtLjgzMzY4Ni0yLjY1NzYuNTE3MTA5LS45MTU4IDEuNzI4NzQ5LTEuMjEwNyAyLjcwNjI5OS0uNjU4N3oiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuMDg2NjY1OSIgaGVpZ2h0PSIzLjUzMTM2NjMiIHg9IjE0LjQwNjIxMyIgeT0iMTAzNS42ODQyIiBmaWxsLW9wYWNpdHk9Ii4zMjg1MDI0NiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiByeT0iLjYyNDI2MzI5IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMTYgMTAyMy4zNjIyYy05IDAtMTIgMy43MTUzLTEyIDl2MjBoMjRjLS4wNDg4OS03LjM1NjIgMC0xOCAwLTIwIDAtNS4yODQ4LTMtOS0xMi05eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMjcuMDc0MDczIDEwMjUuMDQ2MmMtLjQ1OTU3LjI1OTUtMS44MTgyNTcgMS4yMDEzLTEuOTgwOTc5IDEuNjQ4LS4xODM0MDEuNTAzNS0uMTU5Mzg0IDEuMDY1Ny4xMTQ2MTQgMS41NTEuMzQ2NjI3LjYxMzggMS4wMDUzMzUuOTQ4NyAxLjY5NjQxNS45MzY1LjMzOTg4LS4wMSAxLjcyMDI5LS42MzcyIDIuMDQyNTYtLjgxOTIuOTc3NTQtLjU1MTkgMS4zNTA3OS0xLjc0MTguODMzNjktMi42NTc2LS41MTcxMS0uOTE1OC0xLjcyODc2LTEuMjEwNy0yLjcwNjMtLjY1ODd6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjE3NTczNCIgY3k9IjEwMzAuMzU0MiIgcj0iNC42NTM3NTQyIiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjEwLjMzOTQ4NiIgY3k9IjEwMzAuMzU0MiIgcj0iNC44MzE2MzQ1IiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxyZWN0IHdpZHRoPSIzLjY2NzM2ODciIGhlaWdodD0iNC4xMDYzNDA5IiB4PSIxNC4xMTU4NjMiIHk9IjEwMzUuOTE3NCIgZmlsbC1vcGFjaXR5PSIuMzI5NDExNzYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcnk9Ii43MjU5MDUzNiIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuNjY3MzY4NyIgaGVpZ2h0PSI0LjEwNjM0MDkiIHg9IjE0LjExNTg2MyIgeT0iMTAzNS4yMjUzIiBmaWxsPSIjZmZmY2ZiIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ5PSIuNzI1OTA1MzYiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjMyOTQxMTc2IiBkPSJNMTkuOTk5NzM1IDEwMzYuNTI4OWMwIC44MzgtLjg3MTIyOCAxLjI2ODItMi4xNDQ3NjYgMS4xNjU5LS4wMjM2NiAwLS4wNDc5NS0uNjAwNC0uMjU0MTQ3LS41ODMyLS41MDM2NjkuMDQyLTEuMDk1OTAyLS4wMi0xLjY4NTk2NC0uMDItLjYxMjkzOSAwLTEuMjA2MzQyLjE4MjYtMS42ODU0OS4wMTctLjExMDIzMy0uMDM4LS4xNzgyOTguNTgzOC0uMjYxNTMyLjU4MTYtMS4yNDM2ODUtLjAzMy0yLjA3ODgwMy0uMzM4My0yLjA3ODgwMy0xLjE2MTggMC0xLjIxMTggMS44MTU2MzUtMi4xOTQxIDQuMDU1MzUxLTIuMTk0MSAyLjIzOTcwNCAwIDQuMDU1MzUxLjk4MjMgNC4wNTUzNTEgMi4xOTQxeiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjYzM4Yzc0IiBkPSJNMTkuOTc3NDE0IDEwMzUuNzAwNGMwIC41Njg1LS40MzM2NTkuODU1NC0xLjEzODA5MSAxLjAwMDEtLjI5MTkzMy4wNi0uNjMwMzcxLjA5Ni0xLjAwMzcxOS4xMTY2LS41NjQwNS4wMzItMS4yMDc3ODIuMDMxLTEuODkxMjIuMDMxLS42NzI4MzQgMC0xLjMwNzE4MiAwLTEuODY0OTA0LS4wMjktLjMwNjI2OC0uMDE3LS41ODk0MjktLjA0My0uODQzMTY0LS4wODQtLjgxMzgzMy0uMTMxOC0xLjMyNDk2Mi0uNDE3LTEuMzI0OTYyLTEuMDM0NCAwLTEuMTYwMSAxLjgwNTY0Mi0yLjEwMDYgNC4wMzMwMy0yLjEwMDYgMi4yMjczNzcgMCA0LjAzMzAzLjk0MDUgNC4wMzMwMyAyLjEwMDZ6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxlbGxpcHNlIGN4PSIxNS45NDQzODIiIGN5PSIxMDMzLjg1MDEiIGZpbGw9IiMyMzIwMWYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcng9IjIuMDgwMTczMyIgcnk9IjEuMzQzNzQ3IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIxMi40MTQyMDEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIyMy4xMTAxMjEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzODRlNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIuMzk3MzA4NzQiIGQ9Ik01LjAwNTUzNzcgMTAyNy4yNzI3Yy0xLjE3MDQzNS0xLjA4MzUtMi4wMjY5NzMtLjc3MjEtMi4wNDQxNzItLjc0NjMiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4NGU1NCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9Ii4zOTczMDg3NCIgZD0iTTQuMzg1MjQ1NyAxMDI2LjkxNTJjLTEuMTU4NTU3LjAzNi0xLjM0NjcwNC42MzAzLTEuMzM4ODEuNjUyM20yMy41ODQwOTczLS4zOTUxYzEuMTcwNDMtMS4wODM1IDIuMDI2OTctLjc3MjEgMi4wNDQxNy0uNzQ2MyIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzg0ZTU0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iLjM5NzMwODc0IiBkPSJNMjcuMzIxNzczIDEwMjYuNjczYzEuMTU4NTYuMDM2IDEuMzQ2Ny42MzAyIDEuMzM4OC42NTIyIi8+CiAgPC9nPgo8L3N2Zz4="}typescriptIcon(){return"CjxzdmcgZmlsbD0ibm9uZSIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiMzMTc4YzYiIGhlaWdodD0iNTEyIiByeD0iNTAiIHdpZHRoPSI1MTIiLz48cmVjdCBmaWxsPSIjMzE3OGM2IiBoZWlnaHQ9IjUxMiIgcng9IjUwIiB3aWR0aD0iNTEyIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMzE2LjkzOSA0MDcuNDI0djUwLjA2MWM4LjEzOCA0LjE3MiAxNy43NjMgNy4zIDI4Ljg3NSA5LjM4NnMyMi44MjMgMy4xMjkgMzUuMTM1IDMuMTI5YzExLjk5OSAwIDIzLjM5Ny0xLjE0NyAzNC4xOTYtMy40NDIgMTAuNzk5LTIuMjk0IDIwLjI2OC02LjA3NSAyOC40MDYtMTEuMzQyIDguMTM4LTUuMjY2IDE0LjU4MS0xMi4xNSAxOS4zMjgtMjAuNjVzNy4xMjEtMTkuMDA3IDcuMTIxLTMxLjUyMmMwLTkuMDc0LTEuMzU2LTE3LjAyNi00LjA2OS0yMy44NTdzLTYuNjI1LTEyLjkwNi0xMS43MzgtMTguMjI1Yy01LjExMi01LjMxOS0xMS4yNDItMTAuMDkxLTE4LjM4OS0xNC4zMTVzLTE1LjIwNy04LjIxMy0yNC4xOC0xMS45NjdjLTYuNTczLTIuNzEyLTEyLjQ2OC01LjM0NS0xNy42ODUtNy45LTUuMjE3LTIuNTU2LTkuNjUxLTUuMTYzLTEzLjMwMy03LjgyMi0zLjY1Mi0yLjY2LTYuNDY5LTUuNDc2LTguNDUxLTguNDQ4LTEuOTgyLTIuOTczLTIuOTc0LTYuMzM2LTIuOTc0LTEwLjA5MSAwLTMuNDQxLjg4Ny02LjU0NCAyLjY2MS05LjMwOHM0LjI3OC01LjEzNiA3LjUxMi03LjExOGMzLjIzNS0xLjk4MSA3LjE5OS0zLjUyIDExLjg5NC00LjYxNSA0LjY5Ni0xLjA5NSA5LjkxMi0xLjY0MiAxNS42NTEtMS42NDIgNC4xNzMgMCA4LjU4MS4zMTMgMTMuMjI0LjkzOCA0LjY0My42MjYgOS4zMTIgMS41OTEgMTQuMDA4IDIuODk0IDQuNjk1IDEuMzA0IDkuMjU5IDIuOTQ3IDEzLjY5NCA0LjkyOCA0LjQzNCAxLjk4MiA4LjUyOSA0LjI3NiAxMi4yODUgNi44ODR2LTQ2Ljc3NmMtNy42MTYtMi45Mi0xNS45MzctNS4wODQtMjQuOTYyLTYuNDkycy0xOS4zODEtMi4xMTItMzEuMDY2LTIuMTEyYy0xMS44OTUgMC0yMy4xNjMgMS4yNzgtMzMuODA1IDMuODMzcy0yMC4wMDYgNi41NDQtMjguMDkzIDExLjk2N2MtOC4wODYgNS40MjQtMTQuNDc2IDEyLjMzMy0xOS4xNzEgMjAuNzI5LTQuNjk1IDguMzk1LTcuMDQzIDE4LjQzMy03LjA0MyAzMC4xMTQgMCAxNC45MTQgNC4zMDQgMjcuNjM4IDEyLjkxMiAzOC4xNzIgOC42MDcgMTAuNTMzIDIxLjY3NSAxOS40NSAzOS4yMDQgMjYuNzUxIDYuODg2IDIuODE2IDEzLjMwMyA1LjU3OSAxOS4yNSA4LjI5MXMxMS4wODYgNS41MjggMTUuNDE1IDguNDQ4YzQuMzMgMi45MiA3Ljc0NyA2LjEwMSAxMC4yNTIgOS41NDMgMi41MDQgMy40NDEgMy43NTYgNy4zNTIgMy43NTYgMTEuNzMzIDAgMy4yMzMtLjc4MyA2LjIzMS0yLjM0OCA4Ljk5NXMtMy45MzkgNS4xNjItNy4xMjEgNy4xOTYtNy4xNDcgMy42MjQtMTEuODk0IDQuNzcxYy00Ljc0OCAxLjE0OC0xMC4zMDMgMS43MjEtMTYuNjY4IDEuNzIxLTEwLjg1MSAwLTIxLjU5Ny0xLjkwMy0zMi4yNC01LjcxLTEwLjY0Mi0zLjgwNi0yMC41MDItOS41MTYtMjkuNTc5LTE3LjEzem0tODQuMTU5LTEyMy4zNDJoNjQuMjJ2LTQxLjA4MmgtMTc5djQxLjA4Mmg2My45MDZ2MTgyLjkxOGg1MC44NzR6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4="}csIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHdpZHRoPSIyMDQuOCIKICAgaGVpZ2h0PSIyMDQuOCIKICAgdmlld0JveD0iMCAwIDU0LjE4NjY2NiA1NC4xODY2NjciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImEiCiAgICAgICB4MT0iNDYuNzczIgogICAgICAgeDI9IjY5LjkwNyIKICAgICAgIHkxPSI4Ni40NjIiCiAgICAgICB5Mj0iMTI2LjczMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzMy45ODMgLTUxOC45NzQpIHNjYWxlKDguNzg5OTYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcAogICAgICAgICBzdG9wLWNvbG9yPSIjOTI3QkU1IgogICAgICAgICBpZD0ic3RvcDEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3RvcC1jb2xvcj0iIzUxMkJENCIKICAgICAgICAgaWQ9InN0b3AyIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxmaWx0ZXIKICAgICAgIGlkPSJiIgogICAgICAgd2lkdGg9IjQyLjg0NSIKICAgICAgIGhlaWdodD0iMzkuMTM2IgogICAgICAgeD0iNDQuNjI5IgogICAgICAgeT0iOTEuODkiCiAgICAgICBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiCiAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8ZmVGbG9vZAogICAgICAgICBmbG9vZC1vcGFjaXR5PSIwIgogICAgICAgICByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgaWQ9ImZlRmxvb2QyIiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MiIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGlkPSJmZU9mZnNldDIiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgzIiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIGlkPSJmZUJsZW5kMyIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgaW49IlNvdXJjZUFscGhhIgogICAgICAgICByZXN1bHQ9ImhhcmRBbHBoYSIKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIgogICAgICAgICBpZD0iZmVDb2xvck1hdHJpeDQiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMSIKICAgICAgICAgaWQ9ImZlT2Zmc2V0NCIgLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMi40OTkiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjQiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg1IiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgcmVzdWx0PSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBpZD0iZmVCbGVuZDUiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIGluPSJTb3VyY2VBbHBoYSIKICAgICAgICAgcmVzdWx0PSJoYXJkQWxwaGEiCiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg2IiAvPgogICAgICA8ZmVPZmZzZXQKICAgICAgICAgZHk9IjQiCiAgICAgICAgIGlkPSJmZU9mZnNldDYiIC8+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBzdGREZXZpYXRpb249IjIiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjYiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA5IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4NyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0M19kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ3IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OCIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGR5PSI5IgogICAgICAgICBpZD0iZmVPZmZzZXQ4IiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIyLjUiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjgiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA1IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QzX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NF9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MTAiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMTUiCiAgICAgICAgIGlkPSJmZU9mZnNldDEwIiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIzIgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxMCIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3Q0X2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9InNoYXBlIgogICAgICAgICBpZD0iZmVCbGVuZDEyIiAvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxwYXRoCiAgICAgZD0iTTEzNS43MzEgMjg1Ljg1djE3My45M2MwIDIxLjUxNyAxMS40NzggNDEuNDE4IDMwLjEyNSA1Mi4xNjhsMTUwLjYyNCA4Ni45NzZhNjAuMjIzIDYwLjIyMyAwIDAgMCA2MC4yNSAwbDE1MC42MjMtODYuOTc2YTYwLjIzNyA2MC4yMzcgMCAwIDAgMzAuMTI0LTUyLjE2OVYyODUuODUxYzAtMjEuNTI1LTExLjQ3Ny00MS40MjMtMzAuMTI0LTUyLjE3N0wzNzYuNzI5IDE0Ni43MmE2MC4yMSA2MC4yMSAwIDAgMC02MC4yNDkgMGwtMTUwLjYyNCA4Ni45NTRhNjAuMjQ1IDYwLjI0NSAwIDAgMC0zMC4xMjUgNTIuMTc3eiIKICAgICBmaWxsPSJ1cmwoI2EpIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KC4xIDAgMCAuMSAtNy41NjcgLTEwLjE4OSkiCiAgICAgaWQ9InBhdGgxMiIgLz4KICA8cGF0aAogICAgIGQ9Ik01NC4wNTYgOTguMDN2Ni44NTVhMS43MTEgMS43MTEgMCAwIDAgMS43MTQgMS43MTQgMS43MTMgMS43MTMgMCAwIDAgMS43MTQtMS43MTQgMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMCA1LjE0IDUuMTQgMCAxIDEtMTAuMjgyIDB2LTYuODU0YTUuMTQgNS4xNCAwIDEgMSAxMC4yODIgMCAxLjcxMiAxLjcxMiAwIDEgMS0zLjQyNyAwIDEuNzEyIDEuNzEyIDAgMSAwLTMuNDI3IDB6bTI3LjQxOCA2Ljg1NWExLjcxMiAxLjcxMiAwIDAgMS0xLjcxNCAxLjcxNGgtMS43MTR2MS43MTNjMCAuNDU1LS4xOC44OTEtLjUwMiAxLjIxMmExLjcxIDEuNzEgMCAwIDEtMi40MjMgMCAxLjcxOSAxLjcxOSAwIDAgMS0uNTAyLTEuMjEydi0xLjcxM2gtMy40Mjd2MS43MTNhMS43MSAxLjcxIDAgMCAxLTEuNzE0IDEuNzE0IDEuNzEgMS43MSAwIDAgMS0xLjcxMy0xLjcxNHYtMS43MTNINjYuMDVhMS43MTMgMS43MTMgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMy40MjdINjYuMDVhMS43MTIgMS43MTIgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMS43MTRhMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMHYxLjcxM2gzLjQyN3YtMS43MTNhMS43MTIgMS43MTIgMCAxIDEgMy40MjcgMHYxLjcxM2gxLjcxNGMuNDU0IDAgLjg5LjE4IDEuMjExLjUwMmExLjcxIDEuNzEgMCAwIDEgMCAyLjQyMyAxLjcxMiAxLjcxMiAwIDAgMS0xLjIxMS41MDNoLTEuNzE0djMuNDI3aDEuNzE0YTEuNzE4IDEuNzE4IDAgMCAxIDEuNzE0IDEuNzEzem0tNi44NTUtNS4xNGgtMy40Mjd2My40MjdoMy40Mjd6IgogICAgIGZpbGw9IiNmZmYiCiAgICAgZmlsdGVyPSJ1cmwoI2IpIgogICAgIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpzY3JlZW4iCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLjg3OSAwIDAgLjg3OSAtMzAuOTY1IC02Mi4wODYpIgogICAgIGlkPSJwYXRoMTMiIC8+Cjwvc3ZnPgo="}cIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHZpZXdCb3g9IjAgMCAzOC4wMDAwODkgNDIuMDAwMDMxIgogICB3aWR0aD0iMzgwLjAwMDg5IgogICBoZWlnaHQ9IjQyMC4wMDAzMSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMTAiCiAgIHNvZGlwb2RpOmRvY25hbWU9Imljb25zOC1jLXByb2dyYW1taW5nLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wLjEgKDNiYzJlODEzZjUsIDIwMjAtMDktMDcpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExNiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE0IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU2IgogICAgIGlkPSJuYW1lZHZpZXcxMiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMS40ODk1ODMzIgogICAgIGlua3NjYXBlOmN4PSIxOTAiCiAgICAgaW5rc2NhcGU6Y3k9IjIxMC4wMDI4MiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEwIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzI4MzU5MyIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAxNy45MDMsMC4yODYyODE2NiBjIDAuNjc5LC0wLjM4MSAxLjUxNSwtMC4zODEgMi4xOTMsMCBDIDIzLjQ1MSwyLjE2OTI4MTcgMzMuNTQ3LDcuODM3MjgxNyAzNi45MDMsOS43MjAyODE3IDM3LjU4MiwxMC4xMDAyODIgMzgsMTAuODA0MjgyIDM4LDExLjU2NjI4MiBjIDAsMy43NjYgMCwxNS4xMDEgMCwxOC44NjcgMCwwLjc2MiAtMC40MTgsMS40NjYgLTEuMDk3LDEuODQ3IC0zLjM1NSwxLjg4MyAtMTMuNDUxLDcuNTUxIC0xNi44MDcsOS40MzQgLTAuNjc5LDAuMzgxIC0xLjUxNSwwLjM4MSAtMi4xOTMsMCAtMy4zNTUsLTEuODgzIC0xMy40NTEsLTcuNTUxIC0xNi44MDcsLTkuNDM0IC0wLjY3OCwtMC4zODEgLTEuMDk2LC0xLjA4NCAtMS4wOTYsLTEuODQ2IDAsLTMuNzY2IDAsLTE1LjEwMSAwLC0xOC44NjcgMCwtMC43NjIgMC40MTgsLTEuNDY2IDEuMDk3LC0xLjg0NzAwMDMgMy4zNTQsLTEuODgzIDEzLjQ1MiwtNy41NTEgMTYuODA2LC05LjQzNDAwMDA0IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoMiIKICAgICBzdHlsZT0iZmlsbDojMDA0NDgyO2ZpbGwtb3BhY2l0eToxIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzVjNmJjMCIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAwLjMwNCwzMS40MDQyODIgYyAtMC4yNjYsLTAuMzU2IC0wLjMwNCwtMC42OTQgLTAuMzA0LC0xLjE0OSAwLC0zLjc0NCAwLC0xNS4wMTQgMCwtMTguNzU5IDAsLTAuNzU4IDAuNDE3LC0xLjQ1OCAxLjA5NCwtMS44MzYwMDAzIDMuMzQzLC0xLjg3MiAxMy40MDUsLTcuNTA3IDE2Ljc0OCwtOS4zODAwMDAwNCAwLjY3NywtMC4zNzkgMS41OTQsLTAuMzcxIDIuMjcxLDAuMDA4IDMuMzQzLDEuODcyMDAwMDQgMTMuMzcxLDcuNDU5MDAwMDQgMTYuNzE0LDkuMzMxMDAwMDQgMC4yNywwLjE1MiAwLjQ3NiwwLjMzNSAwLjY2LDAuNTc2MDAwMyB6IgogICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICBpZD0icGF0aDQiCiAgICAgc3R5bGU9ImZpbGw6IzY1OWFkMjtmaWxsLW9wYWNpdHk6MSIgLz4KICA8cGF0aAogICAgIGZpbGw9IiNmZmZmZmYiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMTksNy4wMDAyODE3IGMgNy43MjcsMCAxNCw2LjI3MzAwMDMgMTQsMTQuMDAwMDAwMyAwLDcuNzI3IC02LjI3MywxNCAtMTQsMTQgLTcuNzI3LDAgLTE0LC02LjI3MyAtMTQsLTE0IDAsLTcuNzI3IDYuMjczLC0xNC4wMDAwMDAzIDE0LC0xNC4wMDAwMDAzIHogbSAwLDcuMDAwMDAwMyBjIDMuODYzLDAgNywzLjEzNiA3LDcgMCwzLjg2MyAtMy4xMzcsNyAtNyw3IC0zLjg2MywwIC03LC0zLjEzNyAtNywtNyAwLC0zLjg2NCAzLjEzNiwtNyA3LC03IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoNiIgLz4KICA8cGF0aAogICAgIGZpbGw9IiMzOTQ5YWIiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMzcuNDg1LDEwLjIwNTI4MiBjIDAuNTE2LDAuNDgzIDAuNTA2LDEuMjExIDAuNTA2LDEuNzg0IDAsMy43OTUgLTAuMDMyLDE0LjU4OSAwLjAwOSwxOC4zODQgMC4wMDQsMC4zOTYgLTAuMTI3LDAuODEzIC0wLjMyMywxLjEyNyBsIC0xOS4wODQsLTEwLjUgeiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9InBhdGg4IgogICAgIHN0eWxlPSJmaWxsOiMwMDU5OWM7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo="}cppIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9InV0Zi04Ij8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMzA2cHgiIGhlaWdodD0iMzQ0LjM1cHgiIHZpZXdCb3g9IjAgMCAzMDYgMzQ0LjM1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDYgMzQ0LjM1IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iIzAwNTk5QyIgZD0iTTMwMi4xMDcsMjU4LjI2MmMyLjQwMS00LjE1OSwzLjg5My04Ljg0NSwzLjg5My0xMy4wNTNWOTkuMTRjMC00LjIwOC0xLjQ5LTguODkzLTMuODkyLTEzLjA1MkwxNTMsMTcyLjE3NQoJTDMwMi4xMDcsMjU4LjI2MnoiLz4KPHBhdGggZmlsbD0iIzAwNDQ4MiIgZD0iTTE2Ni4yNSwzNDEuMTkzbDEyNi41LTczLjAzNGMzLjY0NC0yLjEwNCw2Ljk1Ni01LjczNyw5LjM1Ny05Ljg5N0wxNTMsMTcyLjE3NUwzLjg5MywyNTguMjYzCgljMi40MDEsNC4xNTksNS43MTQsNy43OTMsOS4zNTcsOS44OTZsMTI2LjUsNzMuMDM0QzE0Ny4wMzcsMzQ1LjQwMSwxNTguOTYzLDM0NS40MDEsMTY2LjI1LDM0MS4xOTN6Ii8+CjxwYXRoIGZpbGw9IiM2NTlBRDIiIGQ9Ik0zMDIuMTA4LDg2LjA4N2MtMi40MDItNC4xNi01LjcxNS03Ljc5My05LjM1OC05Ljg5N0wxNjYuMjUsMy4xNTZjLTcuMjg3LTQuMjA4LTE5LjIxMy00LjIwOC0yNi41LDAKCUwxMy4yNSw3Ni4xOUM1Ljk2Miw4MC4zOTcsMCw5MC43MjUsMCw5OS4xNHYxNDYuMDY5YzAsNC4yMDgsMS40OTEsOC44OTQsMy44OTMsMTMuMDUzTDE1MywxNzIuMTc1TDMwMi4xMDgsODYuMDg3eiIvPgo8Zz4KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNTMsMjc0LjE3NWMtNTYuMjQzLDAtMTAyLTQ1Ljc1Ny0xMDItMTAyczQ1Ljc1Ny0xMDIsMTAyLTEwMmMzNi4yOTIsMCw3MC4xMzksMTkuNTMsODguMzMxLDUwLjk2OAoJCWwtNDQuMTQzLDI1LjU0NGMtOS4xMDUtMTUuNzM2LTI2LjAzOC0yNS41MTItNDQuMTg4LTI1LjUxMmMtMjguMTIyLDAtNTEsMjIuODc4LTUxLDUxYzAsMjguMTIxLDIyLjg3OCw1MSw1MSw1MQoJCWMxOC4xNTIsMCwzNS4wODUtOS43NzYsNDQuMTkxLTI1LjUxNWw0NC4xNDMsMjUuNTQzQzIyMy4xNDIsMjU0LjY0NCwxODkuMjk0LDI3NC4xNzUsMTUzLDI3NC4xNzV6Ii8+CjwvZz4KPGc+Cgk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjI1NSwxNjYuNTA4IDI0My42NjYsMTY2LjUwOCAyNDMuNjY2LDE1NS4xNzUgMjMyLjMzNCwxNTUuMTc1IDIzMi4zMzQsMTY2LjUwOCAyMjEsMTY2LjUwOCAKCQkyMjEsMTc3Ljg0MSAyMzIuMzM0LDE3Ny44NDEgMjMyLjMzNCwxODkuMTc1IDI0My42NjYsMTg5LjE3NSAyNDMuNjY2LDE3Ny44NDEgMjU1LDE3Ny44NDEgCSIvPgo8L2c+CjxnPgoJPHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIyOTcuNSwxNjYuNTA4IDI4Ni4xNjYsMTY2LjUwOCAyODYuMTY2LDE1NS4xNzUgMjc0LjgzNCwxNTUuMTc1IDI3NC44MzQsMTY2LjUwOCAyNjMuNSwxNjYuNTA4IAoJCTI2My41LDE3Ny44NDEgMjc0LjgzNCwxNzcuODQxIDI3NC44MzQsMTg5LjE3NSAyODYuMTY2LDE4OS4xNzUgMjg2LjE2NiwxNzcuODQxIDI5Ny41LDE3Ny44NDEgCSIvPgo8L2c+Cjwvc3ZnPgo="}zigLogo(){return"CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTUzIDE0MCI+CjxnIGZpbGw9IiNmN2E0MWQiPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI0NiwyMiAyOCw0NCAxOSwzMCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNDYsMjIgMzMsMzMgMjgsNDQgMjIsNDQgMjIsOTUgMzEsOTUgMjAsMTAwIDEyLDExNyAwLDExNyAwLDIyIiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiLz4KCQk8cG9seWdvbiBwb2ludHM9IjMxLDk1IDEyLDExNyA0LDEwNiIvPgoJPC9nPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI1NiwyMiA2MiwzNiAzNyw0NCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNTYsMjIgMTExLDIyIDExMSw0NCAzNyw0NCA1NiwzMiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxMTYsOTUgOTcsMTE3IDkwLDEwNCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTE2LDk1IDEwMCwxMDQgOTcsMTE3IDQyLDExNyA0Miw5NSIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTAsMCA1MiwxMTcgMywxNDAgMTAxLDIyIi8+Cgk8L2c+Cgk8Zz4KCQk8cG9seWdvbiBwb2ludHM9IjE0MSwyMiAxNDAsNDAgMTIyLDQ1Ii8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTMsMjIgMTUzLDExNyAxMDYsMTE3IDEyMCwxMDUgMTI1LDk1IDEzMSw5NSAxMzEsNDUgMTIyLDQ1IDEzMiwzNiAxNDEsMjIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTI1LDk1IDEzMCwxMTAgMTA2LDExNyIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="}render(){const e=me.getIconForType(this.getNodeTypeFromIcon(this.icon));switch(this.icon){case T.OPENAPI:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.openapiIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}; ${this.isLightMode()?"filter: grayscale(100%)":""}"></sl-icon>`;case T.GO:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.goIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.TS:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.typescriptIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.CS:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.csIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.C:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.CPP:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cppIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case T.ZIG:return q`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.zigLogo()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}return q`
            <sl-icon exportparts="base" data-fresh="${this.icon}" name="${e}"
                     class="icon-vertical-no-margin"
                     style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}};me.styles=[Qu,Zu,Wu,Ya],$o([E()],me.prototype,"icon",2),$o([E({type:wn})],me.prototype,"size",2),$o([E({type:xn})],me.prototype,"color",2),$o([E()],me.prototype,"tooltip",2),me=$o([le("pb33f-model-icon")],me);var zt=class extends oo{constructor(){super(...arguments),this.localize=new Ga(this),this.value=0,this.type="decimal",this.noGrouping=!1,this.currency="USD",this.currencyDisplay="symbol"}render(){return isNaN(this.value)?"":this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.noGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};R([E({type:Number})],zt.prototype,"value"),R([E()],zt.prototype,"type"),R([E({attribute:"no-grouping",type:Boolean})],zt.prototype,"noGrouping"),R([E()],zt.prototype,"currency"),R([E({attribute:"currency-display"})],zt.prototype,"currencyDisplay"),R([E({attribute:"minimum-integer-digits",type:Number})],zt.prototype,"minimumIntegerDigits"),R([E({attribute:"minimum-fraction-digits",type:Number})],zt.prototype,"minimumFractionDigits"),R([E({attribute:"maximum-fraction-digits",type:Number})],zt.prototype,"maximumFractionDigits"),R([E({attribute:"minimum-significant-digits",type:Number})],zt.prototype,"minimumSignificantDigits"),R([E({attribute:"maximum-significant-digits",type:Number})],zt.prototype,"maximumSignificantDigits"),zt.define("sl-format-number");const Vu=mt`
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
    
`,Ln="paginatorFirstPage",In="paginatorLastPage",Cn="paginatorNextPage",An="paginatorPreviousPage";var Ju=Object.defineProperty,Xu=Object.getOwnPropertyDescriptor,Zt=(e,t,o,r)=>{for(var i=r>1?void 0:r?Xu(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Ju(t,o,i),i};let Lt=class extends ht{get hide(){return this.totalItems<=this.itemsPerPage}constructor(){super(),this.currentPage=1,this.totalPages=0,this.totalItems=0,this.itemsPerPage=20,this.label="Problems"}getRangeStart(){let e=this.currentPage*this.itemsPerPage-this.itemsPerPage;return e==0?0:e>0?e:0}getPagesRemaining(){let e=this.totalItems-this.currentPage*this.itemsPerPage;return e>0?e:0}getRangeEnd(){let e=this.getRangeStart();e==1&&(e=0);let t=e+this.itemsPerPage;return t>this.totalItems?this.totalItems:t>=0?t:0}nextPage(){this.currentPage<this.totalPages&&this.dispatchEvent(new CustomEvent(Cn,{composed:!0}))}previousPage(){this.currentPage>1&&this.dispatchEvent(new CustomEvent(An,{composed:!0}))}lastPage(){this.currentPage<this.totalPages&&this.dispatchEvent(new CustomEvent(In,{composed:!0}))}firstPage(){this.currentPage>1&&this.dispatchEvent(new CustomEvent(Ln,{composed:!0}))}togglePrev(e){this.homeButton&&(this.prevButton.disabled=e,this.homeButton.disabled=e)}toggleNext(e){this.endButton&&(this.nextButton.disabled=e,this.endButton.disabled=e)}updated(){this.togglePrev(this.currentPage===1),this.toggleNext(this.currentPage===this.totalPages)}render(){return this.totalItems==0?q``:q`
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
        `}};Lt.styles=[Vu],Zt([Ne()],Lt.prototype,"currentPage",2),Zt([Ne()],Lt.prototype,"totalPages",2),Zt([Ne()],Lt.prototype,"totalItems",2),Zt([Ne()],Lt.prototype,"itemsPerPage",2),Zt([qe(".home")],Lt.prototype,"homeButton",2),Zt([qe(".previous")],Lt.prototype,"prevButton",2),Zt([qe(".next")],Lt.prototype,"nextButton",2),Zt([qe(".end")],Lt.prototype,"endButton",2),Zt([E()],Lt.prototype,"label",2),Lt=Zt([le("pb33f-paginator")],Lt);const Ku=mt`

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
   
`,qu={size:15,family:"BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"normal",style:"normal"},tp={size:10,family:"BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"normal",style:"normal"},ep={size:12,family:"BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"normal",style:"normal"},op={size:15,family:"BerkeleyMono-Bold, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",lineHeight:2,weight:"bold",style:"normal"},rp={size:25,family:"BerkeleyMono-Bold, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial",weight:"bold",style:"normal",lineHeight:3};var ip=Object.defineProperty,sp=(e,t,o,r)=>{for(var i=void 0,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=a(t,o,i)||i);return i&&ip(t,o,i),i};class ap extends ht{constructor(){super(),this.currentTheme="dark",this._themeHandler=()=>{this.readColors(),this.currentTheme=Sr()}}readColors(){const t=getComputedStyle(this);this.primary=t.getPropertyValue("--primary-color").trim(),this.secondary=t.getPropertyValue("--secondary-color").trim(),this.tertiary=t.getPropertyValue("--tertiary-color").trim(),this.background=t.getPropertyValue("--background-color").trim(),this.error=t.getPropertyValue("--error-color").trim(),this.ok=t.getPropertyValue("--terminal-text").trim(),this.warn=t.getPropertyValue("--warn-color").trim(),this.color1=t.getPropertyValue("--chart-color1").trim(),this.color2=t.getPropertyValue("--chart-color2").trim(),this.color3=t.getPropertyValue("--chart-color3").trim(),this.color4=t.getPropertyValue("--chart-color4").trim(),this.color5=t.getPropertyValue("--chart-color5").trim()}firstUpdated(){this.readColors(),this.currentTheme=Sr(),this.font=qu,this.smallFont=tp,this.mediumFont=ep,this.titleFont=rp,this.fontBold=op,window.addEventListener($e,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener($e,this._themeHandler)}}sp([Ne()],ap.prototype,"currentTheme");function Sr(){const e=document.documentElement.getAttribute("theme");return e==="light"?"light":e==="tektronix"?"tektronix":"dark"}var np=Object.defineProperty,lp=Object.getOwnPropertyDescriptor,jn=(e,t,o,r)=>{for(var i=r>1?void 0:r?lp(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&np(t,o,i),i};let Oo=class extends ht{constructor(){super(),this.animationFrameId=null,this._currentTheme="dark",this._themeHandler=()=>{this._currentTheme=Sr()},this.sparkArray=[],this.gravity=.005,this.spawnRate=50,this.isError=!1,this.animating=!1}firstUpdated(){var t;this._currentTheme=Sr(),window.addEventListener($e,this._themeHandler);const e=this.renderRoot.querySelector("canvas");if(e){this.canvas=e;const o=(t=this.canvas)==null?void 0:t.getContext("2d");o&&(this.ctx=o)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener($e,this._themeHandler)}startAnimation(){this.animating||(this.animationTimer=setInterval(()=>this.spawnSpark(),1e3/this.spawnRate),this.animating=!0,this.animateSparks())}stopAnimation(){this.animating=!1,clearInterval(this.animationTimer),this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.sparkArray=[],this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}getRandomBetween(e,t){return Math.random()*(t-e)+e}spawnSpark(){if(this.animating){let e;this._currentTheme==="light"?e=this.isError?Math.random()>.5?"rgb(60, 60, 60)":"rgb(120, 120, 120)":Math.random()>.5?"rgb(80, 80, 80)":"rgb(160, 160, 160)":this._currentTheme==="tektronix"?e=this.isError?Math.random()>.5?"rgb(102, 255, 102)":"rgb(34, 204, 34)":Math.random()>.5?"rgb(51, 255, 51)":"rgb(26, 153, 26)":e=this.isError?Math.random()>.5?"rgb(255, 60, 116)":"rgb(157, 26, 65)":Math.random()>.5?"rgb(248, 58, 255)":"rgb(98, 196, 255)",this.sparkArray.push({x:Math.random()*this.canvas.width,y:-2,size:1,color:e,velocityY:this.getRandomBetween(.05,.3),lifetime:150,initialLifetime:150,opacity:1})}}animateSparks(){var e,t,o;if(this.animating){(o=this.ctx)==null||o.clearRect(0,0,(e=this.canvas)==null?void 0:e.width,(t=this.canvas)==null?void 0:t.height),this.sparkArray=this.sparkArray.filter(r=>r.lifetime>0);for(let r of this.sparkArray)this.drawSpark(r),r.y+=r.velocityY,r.velocityY+=this.gravity,r.lifetime--,r.opacity=r.lifetime/r.initialLifetime;this.animationFrameId=requestAnimationFrame(()=>this.animateSparks())}}drawSpark(e){this.ctx.globalAlpha=e.opacity,this.ctx.fillStyle=e.color,/Safari/.test(navigator.userAgent)||(this.ctx.shadowColor=e.color,this.ctx.shadowBlur=8),this.ctx.fillRect(e.x,e.y,e.size,e.size),this.ctx.globalAlpha=1}render(){return q`
            <canvas width="100%" height="100%"></canvas>`}};Oo.styles=mt`
        canvas {
            width: 100%;
            height: 100%;
            image-rendering: pixelated; /* Ensures pixelated appearance */
        }
    `,jn([E({type:Boolean})],Oo.prototype,"isError",2),Oo=jn([le("pb33f-pixel-sparks")],Oo);function fg(e){return e}var cp=Object.defineProperty,dp=Object.getOwnPropertyDescriptor,Wt=(e,t,o,r)=>{for(var i=r>1?void 0:r?dp(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&cp(t,o,i),i};let At=class extends ht{constructor(){super(),this.sparks=new Oo,this.currentPage=1,this.totalPages=1,this.totalItems=0,this.itemsPerPage=20,this.activeIndex=0,this.invalid=!1,this.hideSparks=!1,this.paginatorNavigator=new Lt,this.paginatorNavigator.currentPage=this.currentPage,this.paginatorNavigator.totalPages=this.totalPages,this.paginatorNavigator.totalItems=this.totalItems,this.paginatorNavigator.itemsPerPage=this.itemsPerPage,this.addEventListener(Ln,this.firstPage.bind(this)),this.addEventListener(In,this.lastPage.bind(this)),this.addEventListener(Cn,this.nextPage.bind(this)),this.addEventListener(An,this.previousPage.bind(this))}nextPage(e){e.stopPropagation(),this.currentPage<this.totalPages&&this.currentPage++}lastPage(e){e.stopPropagation(),this.currentPage<this.totalPages&&(this.currentPage=this.totalPages)}firstPage(e){e.stopPropagation(),this.currentPage>1&&(this.currentPage=1)}setPage(e){this.currentPage=Math.ceil(e/this.itemsPerPage),this.activeIndex=e}previousPage(e){e.stopPropagation(),this.currentPage>1&&this.currentPage--}calcTotalPages(){return Math.ceil(this.totalItems/this.itemsPerPage)}willUpdate(){var e,t,o;this.totalItems=(e=this.values)==null?void 0:e.length,this.totalPages=this.calcTotalPages(),this.currentPage>this.totalPages&&(this.currentPage=Math.max(1,this.totalPages)),this.sparks.isError=this.invalid,this.paginatorNavigator.currentPage=this.currentPage,this.paginatorNavigator.totalItems=(t=this.values)==null?void 0:t.length,this.paginatorNavigator.itemsPerPage=this.itemsPerPage,this.paginatorNavigator.totalPages=this.totalPages,this.label&&(this.paginatorNavigator.label=this.label),this.renderValues=(o=this.values)==null?void 0:o.slice(this.paginatorNavigator.getRangeStart(),this.paginatorNavigator.getRangeEnd())}startSparks(){this.sparks.startAnimation()}stopSparks(){this.sparks.stopAnimation()}render(){var e;return((e=this.renderValues)==null?void 0:e.length)===0||!this.renderValues?this.hideSparks?q`
                    <div class="no-values" style="position: relative">
                    </div>
                    `:q`
                    <div class="no-values ${this.invalid?"error":""}" style="position: relative">
                        <div style="position: absolute; width: 100%; top: -50px; left: 0;">${this.sparks}</div>
                        <sl-icon name="prescription2"></sl-icon>
                        <br/>
                        ${this.invalid?"invalid / error":"healthy!"}
                    </div>
                `:q`
            ${this.paginatorNavigator}
            <div class="paginator-values" part="values">
                ${this.renderValues}
            </div>
        `}};At.styles=[Ku],Wt([E({type:ht})],At.prototype,"values",2),Wt([E({type:Number})],At.prototype,"currentPage",2),Wt([E({type:Number})],At.prototype,"totalPages",2),Wt([E({type:Number})],At.prototype,"totalItems",2),Wt([E({type:Number})],At.prototype,"itemsPerPage",2),Wt([E()],At.prototype,"label",2),Wt([E()],At.prototype,"activeIndex",2),Wt([E({type:Boolean})],At.prototype,"invalid",2),Wt([E({type:Boolean})],At.prototype,"hideSparks",2),At=Wt([le("pb33f-paginator-navigation")],At);const up=k`
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
`,lo=k`
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
`;var pp=Object.defineProperty,hp=Object.getOwnPropertyDescriptor,Ki=(e,t,o,r)=>{for(var i=r>1?void 0:r?hp(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&pp(t,o,i),i};const Nn="pp-split-position",gp=20;u.PpLayout=class extends Q{constructor(){super(...arguments),this.title="",this.splitPos=gp}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const t=sessionStorage.getItem(Nn);t&&(this.splitPos=parseFloat(t))}onReposition(t){const o=t.target.position;typeof o=="number"&&(this.splitPos=o,sessionStorage.setItem(Nn,String(o)))}render(){return d`
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
    `}},u.PpLayout.styles=[up,lo],Ki([D()],u.PpLayout.prototype,"title",2),Ki([D()],u.PpLayout.prototype,"splitPos",2),u.PpLayout=Ki([X("pp-layout")],u.PpLayout);const mp=k`
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
`;var fp=Object.defineProperty,bp=Object.getOwnPropertyDescriptor,_o=(e,t,o,r)=>{for(var i=r>1?void 0:r?bp(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&fp(t,o,i),i};u.PpNav=class extends Q{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.webhooks=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)||[]}catch{}const o=this.getAttribute("data-models");if(o)try{this.modelGroups=JSON.parse(o)||[]}catch{}const r=this.getAttribute("data-webhooks");if(r)try{this.webhooks=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return d`
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
    `}},u.PpNav.styles=mp,_o([D()],u.PpNav.prototype,"tags",2),_o([D()],u.PpNav.prototype,"modelGroups",2),_o([D()],u.PpNav.prototype,"webhooks",2),_o([D()],u.PpNav.prototype,"activeSlug",2),u.PpNav=_o([X("pp-nav")],u.PpNav);const vp=k`
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
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
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
`;var yp=Object.defineProperty,Mp=Object.getOwnPropertyDescriptor,Tr=(e,t,o,r)=>{for(var i=r>1?void 0:r?Mp(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&yp(t,o,i),i};function qi(e,t){var o,r;return t?!!((o=e.operations)!=null&&o.some(i=>i.slug===t)||(r=e.children)!=null&&r.some(i=>qi(i,t))):!1}u.PpNavTag=class extends Q{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("tag")||t.has("activeSlug"))&&qi(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,a;const{tag:t,activeSlug:o,open:r}=this,i=qi(t,o);return d`
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
        `}},u.PpNavTag.styles=vp,Tr([p({type:Object})],u.PpNavTag.prototype,"tag",2),Tr([p()],u.PpNavTag.prototype,"activeSlug",2),Tr([D()],u.PpNavTag.prototype,"open",2),u.PpNavTag=Tr([X("pp-nav-tag")],u.PpNavTag);const wp=k`
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
`;var xp=Object.defineProperty,Lp=Object.getOwnPropertyDescriptor,Dr=(e,t,o,r)=>{for(var i=r>1?void 0:r?Lp(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&xp(t,o,i),i};function Sn(e,t){var o;return t?((o=e.models)==null?void 0:o.some(r=>r.typeSlug+"/"+r.slug===t))??!1:!1}u.PpNavModelGroup=class extends Q{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("group")||t.has("activeSlug"))&&Sn(this.group,this.activeSlug)&&(this.open=!0)}updated(t){(t.has("activeSlug")||t.has("group"))&&this.open&&this.activeSlug&&requestAnimationFrame(()=>{const o=this.renderRoot.querySelector("a.active");o==null||o.scrollIntoView({block:"center",behavior:"auto"})})}toggle(){this.open=!this.open}render(){var s;const{group:t,activeSlug:o,open:r}=this,i=Sn(t,o);return d`
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
        `}},u.PpNavModelGroup.styles=wp,Dr([p({type:Object})],u.PpNavModelGroup.prototype,"group",2),Dr([p()],u.PpNavModelGroup.prototype,"activeSlug",2),Dr([D()],u.PpNavModelGroup.prototype,"open",2),u.PpNavModelGroup=Dr([X("pp-nav-model-group")],u.PpNavModelGroup);const Ip=k`
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
`;var Cp=Object.defineProperty,Ap=Object.getOwnPropertyDescriptor,Po=(e,t,o,r)=>{for(var i=r>1?void 0:r?Ap(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Cp(t,o,i),i};u.PpNavOperation=class extends Q{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return d`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},u.PpNavOperation.styles=Ip,Po([p()],u.PpNavOperation.prototype,"method",2),Po([p()],u.PpNavOperation.prototype,"path",2),Po([p()],u.PpNavOperation.prototype,"slug",2),Po([p({type:Boolean})],u.PpNavOperation.prototype,"deprecated",2),u.PpNavOperation=Po([X("pp-nav-operation")],u.PpNavOperation);const Er=k`
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
`,kr=k`
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
`,jp=k`
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
`,Np={schemas:"schemas",responses:"responses",parameters:"parameters",requestBodies:"request-bodies",headers:"headers",securitySchemes:"security",examples:"examples",links:"links",callbacks:"callbacks",pathItems:"path-items"};function Sp(e){let t=e.replace(/([a-z0-9])([A-Z])/g,"$1-$2");return t=t.toLowerCase(),t=t.replace(/[/]/g,"-").replace(/[{}_.]/g,"-").replace(/ /g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-{2,}/g,"-"),t=t.replace(/^-|-$/g,""),t||"unnamed"}function Re(e){if(!e||!e.startsWith("#/components/"))return null;const t=e.replace("#/components/","").split("/");if(t.length!==2)return null;const[o,r]=t,i=Np[o];return i?{name:r,href:`models/${i}/${Sp(r)}.html`}:null}function Tp(e,t){if(!e)return[];const o=[];return t!=null&&t.includeExample&&(e.example!==void 0&&o.push({label:"example",value:JSON.stringify(e.example)}),e.default!==void 0&&o.push({label:"default",value:JSON.stringify(e.default)})),e.minimum!==void 0&&o.push({label:"min",value:e.minimum}),e.maximum!==void 0&&o.push({label:"max",value:e.maximum}),e.exclusiveMinimum!==void 0&&o.push({label:"exclusiveMin",value:e.exclusiveMinimum}),e.exclusiveMaximum!==void 0&&o.push({label:"exclusiveMax",value:e.exclusiveMaximum}),e.minLength!==void 0&&o.push({label:"minLength",value:e.minLength}),e.maxLength!==void 0&&o.push({label:"maxLength",value:e.maxLength}),e.minItems!==void 0&&o.push({label:"minItems",value:e.minItems}),e.maxItems!==void 0&&o.push({label:"maxItems",value:e.maxItems}),e.uniqueItems&&o.push({label:"uniqueItems",value:"true"}),e.pattern&&o.push({label:"pattern",value:e.pattern,isCode:!0}),e.multipleOf!==void 0&&o.push({label:"multipleOf",value:e.multipleOf}),o}function ts(e){var t;if(!e)return"";if(e.type==="array"&&e.items)return`Array<${e.items.type||((t=e.items.$ref)==null?void 0:t.split("/").pop())||"any"}>`;if(e.type){let o=Array.isArray(e.type)?e.type.join(" | "):e.type;return e.format&&(o+=` (${e.format})`),o}return e.oneOf?"oneOf":e.anyOf?"anyOf":e.allOf?"allOf":e.$ref?e.$ref.split("/").pop()??"":""}function es(e,t=!1){const o=d`<a class="ref-link" href="models/${e.typeSlug}/${e.slug}.html">\u279c ${e.name}</a>`;return t?d`<pp-ref-popover registry-key="${e.componentType}/${e.name}">${o}</pp-ref-popover>`:o}function Dp(e,t){var i,s;if(!e)return y;if(e.allOf&&Array.isArray(e.allOf)){const a=[];let n=!0;for(const l of e.allOf){if(!l.$ref){n=!1;continue}const c=Re(l.$ref);c&&a.push({ref:l.$ref,link:c})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">
                ${a.map((l,c)=>d`
                    ${c>0?d` <span class="composition-separator">+</span> `:y}
                    ${t(l.ref,l.link)}
                `)}
            </span>`}if(e.type==="array"&&((i=e.items)!=null&&i.allOf)&&Array.isArray(e.items.allOf)){const a=[];let n=!0;for(const l of e.items.allOf){if(!l.$ref){n=!1;continue}const c=Re(l.$ref);c&&a.push({ref:l.$ref,link:c})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">Array&lt;${a.map((l,c)=>d`
                ${c>0?d` <span class="composition-separator">+</span> `:y}
                ${t(l.ref,l.link)}
            `)}&gt;</span>`}if(e.type==="array"&&((s=e.items)!=null&&s.$ref)){const a=Re(e.items.$ref);if(a)return d`<span class="prop-type prop-type-link">Array&lt;${t(e.items.$ref,a)}&gt;</span>`}const o=e.oneOf??e.anyOf;if(o&&Array.isArray(o)){const a=[];let n=!0;for(const c of o){if(!c.$ref){n=!1;break}const g=Re(c.$ref);g&&a.push({ref:c.$ref,link:g})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">
                ${a.map((c,g)=>d`
                    ${g>0?d` <span class="composition-separator">|</span> `:y}
                    ${t(c.ref,c.link)}
                `)}
            </span>`;const l=o.map(c=>c.title).filter(Boolean);if(l.length===o.length)return d`<span class="prop-type">${l.join(" | ")}</span>`}if(e.$ref){const a=Re(e.$ref);if(a)return d`<span class="prop-type prop-type-link">${t(e.$ref,a)}</span>`}const r=ts(e);return r?d`<span class="prop-type">${r}</span>`:y}function co(e,t){var i,s;if(!e)return y;const o=Tp(e,{includeExample:t==null?void 0:t.includeExample});if(!o.length&&!((i=e.enum)!=null&&i.length))return y;const r=(t==null?void 0:t.labelSuffix)??"";return d`
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
    `}const Ep=k`
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
`,Tn=new Map;let Dn=!1;function kp(){if(Dn)return;Dn=!0;const e=document.getElementById("pp-schema-registry");if(e!=null&&e.textContent)try{const t=JSON.parse(e.textContent);for(const[o,r]of Object.entries(t))Tn.set(o,r)}catch{}}function En(e){return kp(),Tn.get(e)}function os(e){if(!(e!=null&&e.startsWith("#/components/")))return;const t=e.replace("#/components/","");return En(t)}var zp=k`
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
`,ut=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=e=>{this.open&&e.key==="Escape"&&(e.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=e=>{var t;if(e.key==="Escape"&&this.open&&!this.closeWatcher){e.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(e.key==="Tab"){if(this.open&&((t=document.activeElement)==null?void 0:t.tagName.toLowerCase())==="sl-menu-item"){e.preventDefault(),this.hide(),this.focusOnTrigger();return}const o=(r,i)=>{if(!r)return null;const s=r.closest(i);if(s)return s;const a=r.getRootNode();return a instanceof ShadowRoot?o(a.host,i):null};setTimeout(()=>{var r;const i=((r=this.containingElement)==null?void 0:r.getRootNode())instanceof ShadowRoot?ba():document.activeElement;(!this.containingElement||o(i,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=e=>{const t=e.composedPath();this.containingElement&&!t.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=e=>{const t=e.target;!this.stayOpenOnSelect&&t.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){const e=this.trigger.assignedElements({flatten:!0})[0];typeof(e==null?void 0:e.focus)=="function"&&e.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(e=>e.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(e){if([" ","Enter"].includes(e.key)){e.preventDefault(),this.handleTriggerClick();return}const t=this.getMenu();if(t){const o=t.getAllItems(),r=o[0],i=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(e.key)&&(e.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(e.key==="ArrowDown"||e.key==="Home")&&(t.setCurrentItem(r),r.focus()),(e.key==="ArrowUp"||e.key==="End")&&(t.setCurrentItem(i),i.focus())}))}}handleTriggerKeyUp(e){e.key===" "&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){const t=this.trigger.assignedElements({flatten:!0}).find(r=>Gc(r).start);let o;if(t){switch(t.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=t.button;break;default:o=t}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,ne(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,ne(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var e;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var e;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await Bt(this),this.panel.hidden=!1,this.popup.active=!0;const{keyframes:e,options:t}=vt(this,"dropdown.show",{dir:this.localize.dir()});await Tt(this.popup.popup,e,t),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await Bt(this);const{keyframes:e,options:t}=vt(this,"dropdown.hide",{dir:this.localize.dir()});await Tt(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return d`
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
        sync=${P(this.sync?this.sync:void 0)}
        class=${st({dropdown:!0,"dropdown--open":this.open})}
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
    `}};ut.styles=[rt,zp],ut.dependencies={"sl-popup":Z},h([B(".dropdown")],ut.prototype,"popup",2),h([B(".dropdown__trigger")],ut.prototype,"trigger",2),h([B(".dropdown__panel")],ut.prototype,"panel",2),h([p({type:Boolean,reflect:!0})],ut.prototype,"open",2),h([p({reflect:!0})],ut.prototype,"placement",2),h([p({type:Boolean,reflect:!0})],ut.prototype,"disabled",2),h([p({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],ut.prototype,"stayOpenOnSelect",2),h([p({attribute:!1})],ut.prototype,"containingElement",2),h([p({type:Number})],ut.prototype,"distance",2),h([p({type:Number})],ut.prototype,"skidding",2),h([p({type:Boolean})],ut.prototype,"hoist",2),h([p({reflect:!0})],ut.prototype,"sync",2),h([J("open",{waitUntilFirstUpdate:!0})],ut.prototype,"handleOpenChange",1),it("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}}),it("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}}),ut.define("sl-dropdown");var $p=k`
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
`,rs=class extends K{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(e){const t=["menuitem","menuitemcheckbox"],o=e.composedPath(),r=o.find(n=>{var l;return t.includes(((l=n==null?void 0:n.getAttribute)==null?void 0:l.call(n,"role"))||"")});if(!r||o.find(n=>{var l;return((l=n==null?void 0:n.getAttribute)==null?void 0:l.call(n,"role"))==="menu"})!==this)return;const a=r;a.type==="checkbox"&&(a.checked=!a.checked),this.emit("sl-select",{detail:{item:a}})}handleKeyDown(e){if(e.key==="Enter"||e.key===" "){const t=this.getCurrentItem();e.preventDefault(),e.stopPropagation(),t==null||t.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(e.key)){const t=this.getAllItems(),o=this.getCurrentItem();let r=o?t.indexOf(o):0;t.length>0&&(e.preventDefault(),e.stopPropagation(),e.key==="ArrowDown"?r++:e.key==="ArrowUp"?r--:e.key==="Home"?r=0:e.key==="End"&&(r=t.length-1),r<0&&(r=t.length-1),r>t.length-1&&(r=0),this.setCurrentItem(t[r]),t[r].focus())}}handleMouseDown(e){const t=e.target;this.isMenuItem(t)&&this.setCurrentItem(t)}handleSlotChange(){const e=this.getAllItems();e.length>0&&this.setCurrentItem(e[0])}isMenuItem(e){var t;return e.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((t=e.getAttribute("role"))!=null?t:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>!(e.inert||!this.isMenuItem(e)))}getCurrentItem(){return this.getAllItems().find(e=>e.getAttribute("tabindex")==="0")}setCurrentItem(e){this.getAllItems().forEach(o=>{o.setAttribute("tabindex",o===e?"0":"-1")})}render(){return d`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};rs.styles=[rt,$p],h([B("slot")],rs.prototype,"defaultSlot",2),rs.define("sl-menu");var Op=k`
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
 */const Ro=(e,t)=>{var r;const o=e._$AN;if(o===void 0)return!1;for(const i of o)(r=i._$AO)==null||r.call(i,t,!1),Ro(i,t);return!0},zr=e=>{let t,o;do{if((t=e._$AM)===void 0)break;o=t._$AN,o.delete(e),e=t}while((o==null?void 0:o.size)===0)},kn=e=>{for(let t;t=e._$AM;e=t){let o=t._$AN;if(o===void 0)t._$AN=o=new Set;else if(o.has(e))break;o.add(e),Rp(t)}};function _p(e){this._$AN!==void 0?(zr(this),this._$AM=e,kn(this)):this._$AM=e}function Pp(e,t=!1,o=0){const r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let s=o;s<r.length;s++)Ro(r[s],!1),zr(r[s]);else r!=null&&(Ro(r,!1),zr(r));else Ro(this,e)}const Rp=e=>{e.type==Jt.CHILD&&(e._$AP??(e._$AP=Pp),e._$AQ??(e._$AQ=_p))};class Up extends er{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,o,r){super._$AT(t,o,r),kn(this),this.isConnected=t._$AU}_$AO(t,o=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(i=this.disconnected)==null||i.call(this)),o&&(Ro(this,t),zr(this))}setValue(t){if(Ys(this._$Ct))this._$Ct._$AI(t,this);else{const o=[...this._$Ct._$AH];o[this._$Ci]=t,this._$Ct._$AI(o,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yp=()=>new Bp;class Bp{}const is=new WeakMap,Hp=tr(class extends Up{render(e){return y}update(e,[t]){var r;const o=t!==this.G;return o&&this.G!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.G=t,this.ht=(r=e.options)==null?void 0:r.host,this.rt(this.ct=e.element)),y}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let o=is.get(t);o===void 0&&(o=new WeakMap,is.set(t,o)),o.get(this.G)!==void 0&&this.G.call(this.ht,void 0),o.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){var e,t;return typeof this.G=="function"?(e=is.get(this.ht??globalThis))==null?void 0:e.get(this.G):(t=this.G)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var Qp=class{constructor(e,t){this.popupRef=Yp(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=o=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${o.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${o.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=o=>{switch(o.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":o.target!==this.host&&(o.preventDefault(),o.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(o);break}},this.handleClick=o=>{var r;o.target===this.host?(o.preventDefault(),o.stopPropagation()):o.target instanceof Element&&(o.target.tagName==="sl-menu-item"||(r=o.target.role)!=null&&r.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=o=>{o.relatedTarget&&o.relatedTarget instanceof Element&&this.host.contains(o.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=o=>{o.stopPropagation()},this.handlePopupReposition=()=>{const o=this.host.renderRoot.querySelector("slot[name='submenu']"),r=o==null?void 0:o.assignedElements({flatten:!0}).filter(c=>c.localName==="sl-menu")[0],i=getComputedStyle(this.host).direction==="rtl";if(!r)return;const{left:s,top:a,width:n,height:l}=r.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${i?s+n:s}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${a}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${i?s+n:s}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${a+l}px`)},(this.host=e).addController(this),this.hasSlotController=t}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(e){const t=this.host.renderRoot.querySelector("slot[name='submenu']");if(!t){console.error("Cannot activate a submenu if no corresponding menuitem can be found.",this);return}let o=null;for(const r of t.assignedElements())if(o=r.querySelectorAll("sl-menu-item, [role^='menuitem']"),o.length!==0)break;if(!(!o||o.length===0)){o[0].setAttribute("tabindex","0");for(let r=1;r!==o.length;++r)o[r].setAttribute("tabindex","-1");this.popupRef.value&&(e.preventDefault(),e.stopPropagation(),this.popupRef.value.active?o[0]instanceof HTMLElement&&o[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{o[0]instanceof HTMLElement&&o[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(e){this.popupRef.value&&this.popupRef.value.active!==e&&(this.popupRef.value.active=e,this.host.requestUpdate())}enableSubmenu(e=!0){e?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var e;if(!((e=this.host.parentElement)!=null&&e.computedStyleMap))return;const t=this.host.parentElement.computedStyleMap(),r=["padding-top","border-top-width","margin-top"].reduce((i,s)=>{var a;const n=(a=t.get(s))!=null?a:new CSSUnitValue(0,"px"),c=(n instanceof CSSUnitValue?n:new CSSUnitValue(0,"px")).to("px");return i-c.value},0);this.skidding=r}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){const e=getComputedStyle(this.host).direction==="rtl";return this.isConnected?d`
      <sl-popup
        ${Hp(this.popupRef)}
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
    `:d` <slot name="submenu" hidden></slot> `}},Zp=k`
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
`,ss=class extends K{constructor(){super(...arguments),this.localize=new gt(this)}render(){return d`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};ss.styles=[rt,Zp];var It=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new hr(this,"submenu"),this.submenuController=new Qp(this,this.hasSlotController),this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleMouseOver=e=>{this.focus(),e.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){const e=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=e;return}e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return ed(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){const e=this.localize.dir()==="rtl",t=this.submenuController.isExpanded();return d`
      <div
        id="anchor"
        part="base"
        class=${st({"menu-item":!0,"menu-item--rtl":e,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":t})}
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
    `}};It.styles=[rt,Op],It.dependencies={"sl-icon":pt,"sl-popup":Z,"sl-spinner":ss},h([B("slot:not([name])")],It.prototype,"defaultSlot",2),h([B(".menu-item")],It.prototype,"menuItem",2),h([p()],It.prototype,"type",2),h([p({type:Boolean,reflect:!0})],It.prototype,"checked",2),h([p()],It.prototype,"value",2),h([p({type:Boolean,reflect:!0})],It.prototype,"loading",2),h([p({type:Boolean,reflect:!0})],It.prototype,"disabled",2),h([J("checked")],It.prototype,"handleCheckedChange",1),h([J("disabled")],It.prototype,"handleDisabledChange",1),h([J("type")],It.prototype,"handleTypeChange",1),It.define("sl-menu-item");var Uo=new WeakMap,Yo=new WeakMap,Bo=new WeakMap,as=new WeakSet,$r=new WeakMap,zn=class{constructor(e,t){this.handleFormData=o=>{const r=this.options.disabled(this.host),i=this.options.name(this.host),s=this.options.value(this.host),a=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!r&&!a&&typeof i=="string"&&i.length>0&&typeof s<"u"&&(Array.isArray(s)?s.forEach(n=>{o.formData.append(i,n.toString())}):o.formData.append(i,s.toString()))},this.handleFormSubmit=o=>{var r;const i=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&((r=Uo.get(this.form))==null||r.forEach(a=>{this.setUserInteracted(a,!0)})),this.form&&!this.form.noValidate&&!i&&!s(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),$r.set(this.host,[])},this.handleInteraction=o=>{const r=$r.get(this.host);r.includes(o.type)||r.push(o.type),r.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const o=this.form.querySelectorAll("*");for(const r of o)if(typeof r.checkValidity=="function"&&!r.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const o=this.form.querySelectorAll("*");for(const r of o)if(typeof r.reportValidity=="function"&&!r.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=Vt({form:o=>{const r=o.form;if(r){const s=o.getRootNode().querySelector(`#${r}`);if(s)return s}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var r;return(r=o.disabled)!=null?r:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,r)=>o.value=r,assumeInteractionOn:["sl-input"]},t)}hostConnected(){const e=this.options.form(this.host);e&&this.attachForm(e),$r.set(this.host,[]),this.options.assumeInteractionOn.forEach(t=>{this.host.addEventListener(t,this.handleInteraction)})}hostDisconnected(){this.detachForm(),$r.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){const e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,Uo.has(this.form)?Uo.get(this.form).add(this.host):Uo.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),Yo.has(this.form)||(Yo.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Bo.has(this.form)||(Bo.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const e=Uo.get(this.form);e&&(e.delete(this.host),e.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),Yo.has(this.form)&&(this.form.reportValidity=Yo.get(this.form),Yo.delete(this.form)),Bo.has(this.form)&&(this.form.checkValidity=Bo.get(this.form),Bo.delete(this.form)),this.form=void 0))}setUserInteracted(e,t){t?as.add(e):as.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){const o=document.createElement("button");o.type=e,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",t&&(o.name=t.name,o.value=t.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(r=>{t.hasAttribute(r)&&o.setAttribute(r,t.getAttribute(r))})),this.form.append(o),o.click(),o.remove()}}getForm(){var e;return(e=this.form)!=null?e:null}reset(e){this.doAction("reset",e)}submit(e){this.doAction("submit",e)}setValidity(e){const t=this.host,o=!!as.has(t),r=!!t.required;t.toggleAttribute("data-required",r),t.toggleAttribute("data-optional",!r),t.toggleAttribute("data-invalid",!e),t.toggleAttribute("data-valid",e),t.toggleAttribute("data-user-invalid",!e&&o),t.toggleAttribute("data-user-valid",e&&o)}updateValidity(){const e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){const t=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||e==null||e.preventDefault()}},ns=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(bo(Vt({},ns),{valid:!1,valueMissing:!0})),Object.freeze(bo(Vt({},ns),{valid:!1,customError:!0}));var Wp=k`
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
`,W=class extends K{constructor(){super(...arguments),this.formControlController=new zn(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new hr(this,"[default]","prefix","suffix"),this.localize=new gt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:ns}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){const e=this.isLink(),t=e?or`a`:or`button`;return yo`
      <${t}
        part="base"
        class=${st({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${P(e?void 0:this.disabled)}
        type=${P(e?void 0:this.type)}
        title=${this.title}
        name=${P(e?void 0:this.name)}
        value=${P(e?void 0:this.value)}
        href=${P(e&&!this.disabled?this.href:void 0)}
        target=${P(e?this.target:void 0)}
        download=${P(e?this.download:void 0)}
        rel=${P(e?this.rel:void 0)}
        role=${P(e?void 0:"button")}
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
        ${this.caret?yo` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?yo`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${t}>
    `}};W.styles=[rt,Wp],W.dependencies={"sl-icon":pt,"sl-spinner":ss},h([B(".button")],W.prototype,"button",2),h([D()],W.prototype,"hasFocus",2),h([D()],W.prototype,"invalid",2),h([p()],W.prototype,"title",2),h([p({reflect:!0})],W.prototype,"variant",2),h([p({reflect:!0})],W.prototype,"size",2),h([p({type:Boolean,reflect:!0})],W.prototype,"caret",2),h([p({type:Boolean,reflect:!0})],W.prototype,"disabled",2),h([p({type:Boolean,reflect:!0})],W.prototype,"loading",2),h([p({type:Boolean,reflect:!0})],W.prototype,"outline",2),h([p({type:Boolean,reflect:!0})],W.prototype,"pill",2),h([p({type:Boolean,reflect:!0})],W.prototype,"circle",2),h([p()],W.prototype,"type",2),h([p()],W.prototype,"name",2),h([p()],W.prototype,"value",2),h([p()],W.prototype,"href",2),h([p()],W.prototype,"target",2),h([p()],W.prototype,"rel",2),h([p()],W.prototype,"download",2),h([p()],W.prototype,"form",2),h([p({attribute:"formaction"})],W.prototype,"formAction",2),h([p({attribute:"formenctype"})],W.prototype,"formEnctype",2),h([p({attribute:"formmethod"})],W.prototype,"formMethod",2),h([p({attribute:"formnovalidate",type:Boolean})],W.prototype,"formNoValidate",2),h([p({attribute:"formtarget"})],W.prototype,"formTarget",2),h([J("disabled",{waitUntilFirstUpdate:!0})],W.prototype,"handleDisabledChange",1),W.define("sl-button");var Fp=k`
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
`,Gp=k`
  :host {
    display: contents;
  }
`,Or=class extends K{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>{this.emit("sl-resize",{detail:{entries:e}})}),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){const e=this.shadowRoot.querySelector("slot");if(e!==null){const t=e.assignedElements({flatten:!0});this.observedElements.forEach(o=>this.resizeObserver.unobserve(o)),this.observedElements=[],t.forEach(o=>{this.resizeObserver.observe(o),this.observedElements.push(o)})}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return d` <slot @slotchange=${this.handleSlotChange}></slot> `}};Or.styles=[rt,Gp],h([p({type:Boolean,reflect:!0})],Or.prototype,"disabled",2),h([J("disabled",{waitUntilFirstUpdate:!0})],Or.prototype,"handleDisabledChange",1);var ct=class extends K{constructor(){super(...arguments),this.tabs=[],this.focusableTabs=[],this.panels=[],this.localize=new gt(this),this.hasScrollControls=!1,this.shouldHideScrollStartButton=!1,this.shouldHideScrollEndButton=!1,this.placement="top",this.activation="auto",this.noScrollControls=!1,this.fixedScrollControls=!1,this.scrollOffset=1}connectedCallback(){const e=Promise.all([customElements.whenDefined("sl-tab"),customElements.whenDefined("sl-tab-panel")]);super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(t=>{const o=t.filter(({target:r})=>{if(r===this)return!0;if(r.closest("sl-tab-group")!==this)return!1;const i=r.tagName.toLowerCase();return i==="sl-tab"||i==="sl-tab-panel"});if(o.length!==0){if(o.some(r=>!["aria-labelledby","aria-controls"].includes(r.attributeName))&&setTimeout(()=>this.setAriaLabels()),o.some(r=>r.attributeName==="disabled"))this.syncTabsAndPanels();else if(o.some(r=>r.attributeName==="active")){const i=o.filter(s=>s.attributeName==="active"&&s.target.tagName.toLowerCase()==="sl-tab").map(s=>s.target).find(s=>s.active);i&&this.setActiveTab(i)}}}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,attributeFilter:["active","disabled","name","panel"],childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),e.then(()=>{new IntersectionObserver((o,r)=>{var i;o[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab((i=this.getActiveTab())!=null?i:this.tabs[0],{emitEvents:!1}),r.unobserve(o[0].target))}).observe(this.tabGroup)})})}disconnectedCallback(){var e,t;super.disconnectedCallback(),(e=this.mutationObserver)==null||e.disconnect(),this.nav&&((t=this.resizeObserver)==null||t.unobserve(this.nav))}getAllTabs(){return this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()}getAllPanels(){return[...this.body.assignedElements()].filter(e=>e.tagName.toLowerCase()==="sl-tab-panel")}getActiveTab(){return this.tabs.find(e=>e.active)}handleClick(e){const o=e.target.closest("sl-tab");(o==null?void 0:o.closest("sl-tab-group"))===this&&o!==null&&this.setActiveTab(o,{scrollBehavior:"smooth"})}handleKeyDown(e){const o=e.target.closest("sl-tab");if((o==null?void 0:o.closest("sl-tab-group"))===this&&(["Enter"," "].includes(e.key)&&o!==null&&(this.setActiveTab(o,{scrollBehavior:"smooth"}),e.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))){const i=this.tabs.find(n=>n.matches(":focus")),s=this.localize.dir()==="rtl";let a=null;if((i==null?void 0:i.tagName.toLowerCase())==="sl-tab"){if(e.key==="Home")a=this.focusableTabs[0];else if(e.key==="End")a=this.focusableTabs[this.focusableTabs.length-1];else if(["top","bottom"].includes(this.placement)&&e.key===(s?"ArrowRight":"ArrowLeft")||["start","end"].includes(this.placement)&&e.key==="ArrowUp"){const n=this.tabs.findIndex(l=>l===i);a=this.findNextFocusableTab(n,"backward")}else if(["top","bottom"].includes(this.placement)&&e.key===(s?"ArrowLeft":"ArrowRight")||["start","end"].includes(this.placement)&&e.key==="ArrowDown"){const n=this.tabs.findIndex(l=>l===i);a=this.findNextFocusableTab(n,"forward")}if(!a)return;a.tabIndex=0,a.focus({preventScroll:!0}),this.activation==="auto"?this.setActiveTab(a,{scrollBehavior:"smooth"}):this.tabs.forEach(n=>{n.tabIndex=n===a?0:-1}),["top","bottom"].includes(this.placement)&&Ma(a,this.nav,"horizontal"),e.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:"smooth"})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:"smooth"})}setActiveTab(e,t){if(t=Vt({emitEvents:!0,scrollBehavior:"auto"},t),e!==this.activeTab&&!e.disabled){const o=this.activeTab;this.activeTab=e,this.tabs.forEach(r=>{r.active=r===this.activeTab,r.tabIndex=r===this.activeTab?0:-1}),this.panels.forEach(r=>{var i;return r.active=r.name===((i=this.activeTab)==null?void 0:i.panel)}),this.syncIndicator(),["top","bottom"].includes(this.placement)&&Ma(this.activeTab,this.nav,"horizontal",t.scrollBehavior),t.emitEvents&&(o&&this.emit("sl-tab-hide",{detail:{name:o.panel}}),this.emit("sl-tab-show",{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(e=>{const t=this.panels.find(o=>o.name===e.panel);t&&(e.setAttribute("aria-controls",t.getAttribute("id")),t.setAttribute("aria-labelledby",e.getAttribute("id")))})}repositionIndicator(){const e=this.getActiveTab();if(!e)return;const t=e.clientWidth,o=e.clientHeight,r=this.localize.dir()==="rtl",i=this.getAllTabs(),a=i.slice(0,i.indexOf(e)).reduce((n,l)=>({left:n.left+l.clientWidth,top:n.top+l.clientHeight}),{left:0,top:0});switch(this.placement){case"top":case"bottom":this.indicator.style.width=`${t}px`,this.indicator.style.height="auto",this.indicator.style.translate=r?`${-1*a.left}px`:`${a.left}px`;break;case"start":case"end":this.indicator.style.width="auto",this.indicator.style.height=`${o}px`,this.indicator.style.translate=`0 ${a.top}px`;break}}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.focusableTabs=this.tabs.filter(e=>!e.disabled),this.panels=this.getAllPanels(),this.syncIndicator(),this.updateComplete.then(()=>this.updateScrollControls())}findNextFocusableTab(e,t){let o=null;const r=t==="forward"?1:-1;let i=e+r;for(;e<this.tabs.length;){if(o=this.tabs[i]||null,o===null){t==="forward"?o=this.focusableTabs[0]:o=this.focusableTabs[this.focusableTabs.length-1];break}if(!o.disabled)break;i+=r}return o}updateScrollButtons(){this.hasScrollControls&&!this.fixedScrollControls&&(this.shouldHideScrollStartButton=this.scrollFromStart()<=this.scrollOffset,this.shouldHideScrollEndButton=this.isScrolledToEnd())}isScrolledToEnd(){return this.scrollFromStart()+this.nav.clientWidth>=this.nav.scrollWidth-this.scrollOffset}scrollFromStart(){return this.localize.dir()==="rtl"?-this.nav.scrollLeft:this.nav.scrollLeft}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=["top","bottom"].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth+1,this.updateScrollButtons()}syncIndicator(){this.getActiveTab()?(this.indicator.style.display="block",this.repositionIndicator()):this.indicator.style.display="none"}show(e){const t=this.tabs.find(o=>o.panel===e);t&&this.setActiveTab(t,{scrollBehavior:"smooth"})}render(){const e=this.localize.dir()==="rtl";return d`
      <div
        part="base"
        class=${st({"tab-group":!0,"tab-group--top":this.placement==="top","tab-group--bottom":this.placement==="bottom","tab-group--start":this.placement==="start","tab-group--end":this.placement==="end","tab-group--rtl":this.localize.dir()==="rtl","tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?d`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${st({"tab-group__scroll-button":!0,"tab-group__scroll-button--start":!0,"tab-group__scroll-button--start--hidden":this.shouldHideScrollStartButton})}
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
                  class=${st({"tab-group__scroll-button":!0,"tab-group__scroll-button--end":!0,"tab-group__scroll-button--end--hidden":this.shouldHideScrollEndButton})}
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
    `}};ct.styles=[rt,Fp],ct.dependencies={"sl-icon-button":lt,"sl-resize-observer":Or},h([B(".tab-group")],ct.prototype,"tabGroup",2),h([B(".tab-group__body")],ct.prototype,"body",2),h([B(".tab-group__nav")],ct.prototype,"nav",2),h([B(".tab-group__indicator")],ct.prototype,"indicator",2),h([D()],ct.prototype,"hasScrollControls",2),h([D()],ct.prototype,"shouldHideScrollStartButton",2),h([D()],ct.prototype,"shouldHideScrollEndButton",2),h([p()],ct.prototype,"placement",2),h([p()],ct.prototype,"activation",2),h([p({attribute:"no-scroll-controls",type:Boolean})],ct.prototype,"noScrollControls",2),h([p({attribute:"fixed-scroll-controls",type:Boolean})],ct.prototype,"fixedScrollControls",2),h([Ol({passive:!0})],ct.prototype,"updateScrollButtons",1),h([J("noScrollControls",{waitUntilFirstUpdate:!0})],ct.prototype,"updateScrollControls",1),h([J("placement",{waitUntilFirstUpdate:!0})],ct.prototype,"syncIndicator",1),ct.define("sl-tab-group");var Vp=(e,t)=>{let o=0;return function(...r){window.clearTimeout(o),o=window.setTimeout(()=>{e.call(this,...r)},t)}},$n=(e,t,o)=>{const r=e[t];e[t]=function(...i){r.call(this,...i),o.call(this,r,...i)}};(()=>{if(typeof window>"u")return;if(!("onscrollend"in window)){const t=new Set,o=new WeakMap,r=s=>{for(const a of s.changedTouches)t.add(a.identifier)},i=s=>{for(const a of s.changedTouches)t.delete(a.identifier)};document.addEventListener("touchstart",r,!0),document.addEventListener("touchend",i,!0),document.addEventListener("touchcancel",i,!0),$n(EventTarget.prototype,"addEventListener",function(s,a){if(a!=="scrollend")return;const n=Vp(()=>{t.size?n():this.dispatchEvent(new Event("scrollend"))},100);s.call(this,"scroll",n,{passive:!0}),o.set(this,n)}),$n(EventTarget.prototype,"removeEventListener",function(s,a){if(a!=="scrollend")return;const n=o.get(this);n&&s.call(this,"scroll",n,{passive:!0})})}})();var Jp=k`
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
`,Xp=0,$t=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.attrId=++Xp,this.componentId=`sl-tab-${this.attrId}`,this.panel="",this.active=!1,this.closable=!1,this.disabled=!1,this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}handleCloseClick(e){e.stopPropagation(),this.emit("sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false"),this.disabled&&!this.active?this.tabIndex=-1:this.tabIndex=0}render(){return this.id=this.id.length>0?this.id:this.componentId,d`
      <div
        part="base"
        class=${st({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
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
    `}};$t.styles=[rt,Jp],$t.dependencies={"sl-icon-button":lt},h([B(".tab")],$t.prototype,"tab",2),h([p({reflect:!0})],$t.prototype,"panel",2),h([p({type:Boolean,reflect:!0})],$t.prototype,"active",2),h([p({type:Boolean,reflect:!0})],$t.prototype,"closable",2),h([p({type:Boolean,reflect:!0})],$t.prototype,"disabled",2),h([p({type:Number,reflect:!0})],$t.prototype,"tabIndex",2),h([J("active")],$t.prototype,"handleActiveChange",1),h([J("disabled")],$t.prototype,"handleDisabledChange",1),$t.define("sl-tab");var Kp=k`
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
`,qp=0,Ho=class extends K{constructor(){super(...arguments),this.attrId=++qp,this.componentId=`sl-tab-panel-${this.attrId}`,this.name="",this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return d`
      <slot
        part="base"
        class=${st({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};Ho.styles=[rt,Kp],h([p({reflect:!0})],Ho.prototype,"name",2),h([p({type:Boolean,reflect:!0})],Ho.prototype,"active",2),h([J("active")],Ho.prototype,"handleActiveChange",1),Ho.define("sl-tab-panel");const ls=k`
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
`,th=[ls,k`
    :host {
        display: block;
        border: 1px dotted var(--hrcolor);
        margin-top: var(--global-padding);
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
        display: none;
    }

    .oneof-property {
        display: flex;
        align-items: stretch;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .oneof-property > .oneof-left {
        width: 200px;
        min-width: 200px;
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
        width: 200px;
        min-width: 200px;
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
        padding: 0;
    }

    .prop-type-col sl-dropdown {
        margin-top: 0;
    }

    .property-oneof {
        grid-column: 1 / -1;
    }

    :host([compact]) .property-oneof {
        display: none;
    }

    :host([compact]) .oneof-container {
        display: none;
    }
`];var eh=Object.defineProperty,oh=Object.getOwnPropertyDescriptor,_r=(e,t,o,r)=>{for(var i=r>1?void 0:r?oh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&eh(t,o,i),i};u.PpSchemaProperties=class extends Q{constructor(){super(...arguments),this.schemaJson="",this.compact=!1,this.schema=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.schema=JSON.parse(this.schemaJson)}catch{this.schema=null}}renderRefAnchor(t,o){const r=d`<a class="ref-type-link" href="${o.href}">\u279c ${o.name}</a>`;return this.compact?r:d`
            <pp-ref-popover schema-ref="${t}">${r}</pp-ref-popover>`}renderType(t){return Dp(t,(o,r)=>this.renderRefAnchor(o,r))}renderPropertyRow(t,o,r){return d`
            <div class="property">
                <div class="prop-name-col">
                    ${r.has(t)?d`<span class="required-badge">req</span>`:y}
                    <span class="prop-name">${t}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(o)}
                    ${co(o,{labelSuffix:":"})}
                </div>
                <div class="prop-desc-col">
                    ${o.description?o.description:y}
                </div>
            </div>
        `}renderPropertyTable(t,o){const r=Object.entries(t);return r.length?r.map(([i,s])=>{const a=s.oneOf??s.anyOf;return a&&Array.isArray(a)?this.compact?this.renderPropertyRow(i,s,o):d`
                    <div class="property-oneof">
                        ${this.renderOneOf(a,i,s.description,o.has(i),"polymorphic")}
                    </div>
                `:this.renderPropertyRow(i,s,o)}):y}renderCompositionRefs(t){return d`
            <div class="composition-refs">
                <span class="composition-label">Composed from</span>
                ${t.map(o=>{const r=Re(o.$ref);if(!r)return y;const i=os(o.$ref),s=(i==null?void 0:i.description)??"";return d`
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
        `:y}renderOneOfOption(t){if(t.$ref){const r=Re(t.$ref);if(!r)return y;const i=os(t.$ref);return d`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(t.$ref,r)}
                    ${i!=null&&i.description?d`<span class="oneof-option-desc">${i.description}</span>`:y}
                </div>
            `}const o=new Set(t.required||[]);return d`
            ${t.description?d`<div class="oneof-option-desc">${t.description}</div>`:y}
            ${t.properties?this.renderPropertyTable(t.properties,o):y}
        `}render(){var s,a,n,l;if(!this.schema)return y;const t=this.schema.type==="array"&&((s=this.schema.items)!=null&&s.properties||(a=this.schema.items)!=null&&a.allOf||(n=this.schema.items)!=null&&n.oneOf||(l=this.schema.items)!=null&&l.anyOf)?this.schema.items:this.schema;if(t.allOf&&Array.isArray(t.allOf))return this.renderComposition(t);if(t.oneOf&&Array.isArray(t.oneOf))return this.renderOneOf(t.oneOf,"ONE OF",void 0,void 0,"polymorphic");if(t.anyOf&&Array.isArray(t.anyOf))return this.renderOneOf(t.anyOf,"ANY OF",void 0,void 0,"polymorphic");const o=t.properties||{},r=new Set(t.required||[]);if(!Object.entries(o).length){const c=ts(t);return!c&&!t.description?y:d`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${c?d`<span class="prop-type">${c}</span>`:y}
                        ${co(t,{labelSuffix:":"})}
                    </div>
                    <div class="prop-desc-col">
                        ${t.description?t.description:y}
                    </div>
                </div>
            `}return this.renderPropertyTable(o,r)}},u.PpSchemaProperties.styles=[Er,...th],_r([p({attribute:"schema-json"})],u.PpSchemaProperties.prototype,"schemaJson",2),_r([p({type:Boolean,reflect:!0})],u.PpSchemaProperties.prototype,"compact",2),_r([D()],u.PpSchemaProperties.prototype,"schema",2),u.PpSchemaProperties=_r([X("pp-schema-properties")],u.PpSchemaProperties);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class cs extends er{constructor(t){if(super(t),this.it=y,t.type!==Jt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===y||t==null)return this._t=void 0,this.it=t;if(t===Ct)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}}cs.directiveName="unsafeHTML",cs.resultType=1;const Ue=tr(cs);var On=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function rh(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ds={exports:{}},_n;function ih(){return _n||(_n=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(r){var i=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,s=0,a={},n={manual:r.Prism&&r.Prism.manual,disableWorkerMessageHandler:r.Prism&&r.Prism.disableWorkerMessageHandler,util:{encode:function v(f){return f instanceof l?new l(f.type,v(f.content),f.alias):Array.isArray(f)?f.map(v):f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(v){return Object.prototype.toString.call(v).slice(8,-1)},objId:function(v){return v.__id||Object.defineProperty(v,"__id",{value:++s}),v.__id},clone:function v(f,x){x=x||{};var I,L;switch(n.util.type(f)){case"Object":if(L=n.util.objId(f),x[L])return x[L];I={},x[L]=I;for(var N in f)f.hasOwnProperty(N)&&(I[N]=v(f[N],x));return I;case"Array":return L=n.util.objId(f),x[L]?x[L]:(I=[],x[L]=I,f.forEach(function(z,S){I[S]=v(z,x)}),I);default:return f}},getLanguage:function(v){for(;v;){var f=i.exec(v.className);if(f)return f[1].toLowerCase();v=v.parentElement}return"none"},setLanguage:function(v,f){v.className=v.className.replace(RegExp(i,"gi"),""),v.classList.add("language-"+f)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(I){var v=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(I.stack)||[])[1];if(v){var f=document.getElementsByTagName("script");for(var x in f)if(f[x].src==v)return f[x]}return null}},isActive:function(v,f,x){for(var I="no-"+f;v;){var L=v.classList;if(L.contains(f))return!0;if(L.contains(I))return!1;v=v.parentElement}return!!x}},languages:{plain:a,plaintext:a,text:a,txt:a,extend:function(v,f){var x=n.util.clone(n.languages[v]);for(var I in f)x[I]=f[I];return x},insertBefore:function(v,f,x,I){I=I||n.languages;var L=I[v],N={};for(var z in L)if(L.hasOwnProperty(z)){if(z==f)for(var S in x)x.hasOwnProperty(S)&&(N[S]=x[S]);x.hasOwnProperty(z)||(N[z]=L[z])}var $=I[v];return I[v]=N,n.languages.DFS(n.languages,function(U,H){H===$&&U!=v&&(this[U]=N)}),N},DFS:function v(f,x,I,L){L=L||{};var N=n.util.objId;for(var z in f)if(f.hasOwnProperty(z)){x.call(f,z,f[z],I||z);var S=f[z],$=n.util.type(S);$==="Object"&&!L[N(S)]?(L[N(S)]=!0,v(S,x,null,L)):$==="Array"&&!L[N(S)]&&(L[N(S)]=!0,v(S,x,z,L))}}},plugins:{},highlightAll:function(v,f){n.highlightAllUnder(document,v,f)},highlightAllUnder:function(v,f,x){var I={callback:x,container:v,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};n.hooks.run("before-highlightall",I),I.elements=Array.prototype.slice.apply(I.container.querySelectorAll(I.selector)),n.hooks.run("before-all-elements-highlight",I);for(var L=0,N;N=I.elements[L++];)n.highlightElement(N,f===!0,I.callback)},highlightElement:function(v,f,x){var I=n.util.getLanguage(v),L=n.languages[I];n.util.setLanguage(v,I);var N=v.parentElement;N&&N.nodeName.toLowerCase()==="pre"&&n.util.setLanguage(N,I);var z=v.textContent,S={element:v,language:I,grammar:L,code:z};function $(H){S.highlightedCode=H,n.hooks.run("before-insert",S),S.element.innerHTML=S.highlightedCode,n.hooks.run("after-highlight",S),n.hooks.run("complete",S),x&&x.call(S.element)}if(n.hooks.run("before-sanity-check",S),N=S.element.parentElement,N&&N.nodeName.toLowerCase()==="pre"&&!N.hasAttribute("tabindex")&&N.setAttribute("tabindex","0"),!S.code){n.hooks.run("complete",S),x&&x.call(S.element);return}if(n.hooks.run("before-highlight",S),!S.grammar){$(n.util.encode(S.code));return}if(f&&r.Worker){var U=new Worker(n.filename);U.onmessage=function(H){$(H.data)},U.postMessage(JSON.stringify({language:S.language,code:S.code,immediateClose:!0}))}else $(n.highlight(S.code,S.grammar,S.language))},highlight:function(v,f,x){var I={code:v,grammar:f,language:x};if(n.hooks.run("before-tokenize",I),!I.grammar)throw new Error('The language "'+I.language+'" has no grammar.');return I.tokens=n.tokenize(I.code,I.grammar),n.hooks.run("after-tokenize",I),l.stringify(n.util.encode(I.tokens),I.language)},tokenize:function(v,f){var x=f.rest;if(x){for(var I in x)f[I]=x[I];delete f.rest}var L=new m;return M(L,L.head,v),g(v,L,f,L.head,0),w(L)},hooks:{all:{},add:function(v,f){var x=n.hooks.all;x[v]=x[v]||[],x[v].push(f)},run:function(v,f){var x=n.hooks.all[v];if(!(!x||!x.length))for(var I=0,L;L=x[I++];)L(f)}},Token:l};r.Prism=n;function l(v,f,x,I){this.type=v,this.content=f,this.alias=x,this.length=(I||"").length|0}l.stringify=function v(f,x){if(typeof f=="string")return f;if(Array.isArray(f)){var I="";return f.forEach(function($){I+=v($,x)}),I}var L={type:f.type,content:v(f.content,x),tag:"span",classes:["token",f.type],attributes:{},language:x},N=f.alias;N&&(Array.isArray(N)?Array.prototype.push.apply(L.classes,N):L.classes.push(N)),n.hooks.run("wrap",L);var z="";for(var S in L.attributes)z+=" "+S+'="'+(L.attributes[S]||"").replace(/"/g,"&quot;")+'"';return"<"+L.tag+' class="'+L.classes.join(" ")+'"'+z+">"+L.content+"</"+L.tag+">"};function c(v,f,x,I){v.lastIndex=f;var L=v.exec(x);if(L&&I&&L[1]){var N=L[1].length;L.index+=N,L[0]=L[0].slice(N)}return L}function g(v,f,x,I,L,N){for(var z in x)if(!(!x.hasOwnProperty(z)||!x[z])){var S=x[z];S=Array.isArray(S)?S:[S];for(var $=0;$<S.length;++$){if(N&&N.cause==z+","+$)return;var U=S[$],H=U.inside,ot=!!U.lookbehind,Y=!!U.greedy,dt=U.alias;if(Y&&!U.pattern.global){var tt=U.pattern.toString().match(/[imsuy]*$/)[0];U.pattern=RegExp(U.pattern.source,tt+"g")}for(var V=U.pattern||U,_=I.next,F=L;_!==f.tail&&!(N&&F>=N.reach);F+=_.value.length,_=_.next){var Gt=_.value;if(f.length>v.length)return;if(!(Gt instanceof l)){var Br=1,Rt;if(Y){if(Rt=c(V,F,v,ot),!Rt||Rt.index>=v.length)break;var Hr=Rt.index,gg=Rt.index+Rt[0].length,ye=F;for(ye+=_.value.length;Hr>=ye;)_=_.next,ye+=_.value.length;if(ye-=_.value.length,F=ye,_.value instanceof l)continue;for(var Wo=_;Wo!==f.tail&&(ye<gg||typeof Wo.value=="string");Wo=Wo.next)Br++,ye+=Wo.value.length;Br--,Gt=v.slice(F,ye),Rt.index-=F}else if(Rt=c(V,0,Gt,ot),!Rt)continue;var Hr=Rt.index,Qr=Rt[0],fs=Gt.slice(0,Hr),Qn=Gt.slice(Hr+Qr.length),bs=F+Gt.length;N&&bs>N.reach&&(N.reach=bs);var Zr=_.prev;fs&&(Zr=M(f,Zr,fs),F+=fs.length),b(f,Zr,Br);var mg=new l(z,H?n.tokenize(Qr,H):Qr,dt,Qr);if(_=M(f,Zr,mg),Qn&&M(f,_,Qn),Br>1){var vs={cause:z+","+$,reach:bs};g(v,f,x,_.prev,F,vs),N&&vs.reach>N.reach&&(N.reach=vs.reach)}}}}}}function m(){var v={value:null,prev:null,next:null},f={value:null,prev:v,next:null};v.next=f,this.head=v,this.tail=f,this.length=0}function M(v,f,x){var I=f.next,L={value:x,prev:f,next:I};return f.next=L,I.prev=L,v.length++,L}function b(v,f,x){for(var I=f.next,L=0;L<x&&I!==v.tail;L++)I=I.next;f.next=I,I.prev=f,v.length-=L}function w(v){for(var f=[],x=v.head.next;x!==v.tail;)f.push(x.value),x=x.next;return f}if(!r.document)return r.addEventListener&&(n.disableWorkerMessageHandler||r.addEventListener("message",function(v){var f=JSON.parse(v.data),x=f.language,I=f.code,L=f.immediateClose;r.postMessage(n.highlight(I,n.languages[x],x)),L&&r.close()},!1)),n;var C=n.util.currentScript();C&&(n.filename=C.src,C.hasAttribute("data-manual")&&(n.manual=!0));function j(){n.manual||n.highlightAll()}if(!n.manual){var A=document.readyState;A==="loading"||A==="interactive"&&C&&C.defer?document.addEventListener("DOMContentLoaded",j):window.requestAnimationFrame?window.requestAnimationFrame(j):window.setTimeout(j,16)}return n})(t);e.exports&&(e.exports=o),typeof On<"u"&&(On.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(r){r.type==="entity"&&(r.attributes.title=r.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(i,s){var a={};a["language-"+s]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[s]},a.cdata=/^<!\[CDATA\[|\]\]>$/i;var n={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:a}};n["language-"+s]={pattern:/[\s\S]+/,inside:o.languages[s]};var l={};l[i]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return i}),"i"),lookbehind:!0,greedy:!0,inside:n},o.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(r,i){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+r+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[i,"language-"+i],inside:o.languages[i]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(r){var i=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;r.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+i.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+i.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+i.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+i.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:i,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},r.languages.css.atrule.inside.rest=r.languages.css;var s=r.languages.markup;s&&(s.tag.addInlined("style","css"),s.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var r="Loading…",i=function(C,j){return"✖ Error "+C+" while fetching file: "+j},s="✖ Error: File does not exist or is empty",a={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},n="data-src-status",l="loading",c="loaded",g="failed",m="pre[data-src]:not(["+n+'="'+c+'"]):not(['+n+'="'+l+'"])';function M(C,j,A){var v=new XMLHttpRequest;v.open("GET",C,!0),v.onreadystatechange=function(){v.readyState==4&&(v.status<400&&v.responseText?j(v.responseText):v.status>=400?A(i(v.status,v.statusText)):A(s))},v.send(null)}function b(C){var j=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(C||"");if(j){var A=Number(j[1]),v=j[2],f=j[3];return v?f?[A,Number(f)]:[A,void 0]:[A,A]}}o.hooks.add("before-highlightall",function(C){C.selector+=", "+m}),o.hooks.add("before-sanity-check",function(C){var j=C.element;if(j.matches(m)){C.code="",j.setAttribute(n,l);var A=j.appendChild(document.createElement("CODE"));A.textContent=r;var v=j.getAttribute("data-src"),f=C.language;if(f==="none"){var x=(/\.(\w+)$/.exec(v)||[,"none"])[1];f=a[x]||x}o.util.setLanguage(A,f),o.util.setLanguage(j,f);var I=o.plugins.autoloader;I&&I.loadLanguages(f),M(v,function(L){j.setAttribute(n,c);var N=b(j.getAttribute("data-range"));if(N){var z=L.split(/\r\n?|\n/g),S=N[0],$=N[1]==null?z.length:N[1];S<0&&(S+=z.length),S=Math.max(0,Math.min(S-1,z.length)),$<0&&($+=z.length),$=Math.max(0,Math.min($,z.length)),L=z.slice(S,$).join(`
`),j.hasAttribute("data-start")||j.setAttribute("data-start",String(S+1))}A.textContent=L,o.highlightElement(A)},function(L){j.setAttribute(n,g),A.textContent=L})}}),o.plugins.fileHighlight={highlight:function(j){for(var A=(j||document).querySelectorAll(m),v=0,f;f=A[v++];)o.highlightElement(f)}};var w=!1;o.fileHighlight=function(){w||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),w=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(ds)),ds.exports}var sh=ih();const uo=rh(sh);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json,(function(e){var t=/[*&][^\s[\]{},]+/,o=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r="(?:"+o.source+"(?:[ 	]+"+t.source+")?|"+t.source+"(?:[ 	]+"+o.source+")?)",i=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),s=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function a(n,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return n});return RegExp(c,l)}e.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return"(?:"+i+"|"+s+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:a(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:a(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:a(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:a(s),lookbehind:!0,greedy:!0},number:{pattern:a(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:o,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism),Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))}),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var r={};r["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var s={};s[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:i},Prism.languages.insertBefore("markup","cdata",s)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;const ah=k`
    :host {
        display: block;
    }

    /* ── Plain mode (no line numbers) ── */

    pre {
        margin: 0;
        padding: var(--global-padding-double) var(--global-padding-double) var(--global-padding-double) 20px;
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
        border-bottom: 1px solid var(--hrcolor, #3d3d3d);
        color: var(--font-color-sub2, #555);
        font-family: var(--font-stack, monospace);
        font-size: 0.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;var nh=Object.defineProperty,lh=Object.getOwnPropertyDescriptor,Ot=(e,t,o,r)=>{for(var i=r>1?void 0:r?lh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&nh(t,o,i),i};uo.manual=!0,u.PpCodeViewer=class extends Q{constructor(){super(...arguments),this.code="",this.language="json",this.pretty=!1,this.lineNumbers=!1,this.highlightLines="",this.startLine=1,this.location="",this.embedded=!1,this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:"",language:"",segments:[]},this._highlightCache={spec:"",parsed:new Set}}get displayCode(){if(!this.code)return"";if(this.pretty&&this.language==="json")try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(t){const o=new Set;if(!t)return o;for(const r of t.split(",")){const s=r.trim().match(/^(\d+)(?:-(\d+))?$/);if(!s)continue;const a=parseInt(s[1],10),n=s[2]?parseInt(s[2],10):a;for(let l=Math.min(a,n);l<=Math.max(a,n);l++)o.add(l)}return o}highlightCode(){const t=this.displayCode;if(!t)return"";try{const o=this.language==="xml"?"markup":this.language;return uo.highlight(t,uo.languages[o],o)}catch{return t}}splitHighlightedLines(t){const o=[];let r="";const i=[];let s=0;for(;s<t.length;)if(t[s]===`
`){for(let a=i.length-1;a>=0;a--)r+="</span>";o.push(r),r=i.join(""),s++}else if(t[s]==="<")if(t.startsWith("</span>",s))r+="</span>",i.pop(),s+=7;else{const a=t.indexOf(">",s);if(a===-1){r+=t[s],s++;continue}const n=t.slice(s,a+1);r+=n,n.startsWith("</")||i.push(n),s=a+1}else r+=t[s],s++;for(let a=i.length-1;a>=0;a--)r+="</span>";return r&&o.push(r),o}getLineSegments(){const t=this.displayCode;if(t===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;const o=this.highlightCode(),r=o?this.splitHighlightedLines(o):[];return this._segmentCache={code:t,language:this.language,segments:r},r}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){const t=this.parsedHighlights;return t.size>0?t:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}handleLineClick(t,o){if(this.isLocked)return;const r=new Set;if(o.shiftKey&&this.lastClickedLine!==null){const i=Math.min(this.lastClickedLine,t),s=Math.max(this.lastClickedLine,t);for(let a=i;a<=s;a++)r.add(a)}else this.selectedLines.size===1&&this.selectedLines.has(t)||r.add(t);this.selectedLines=r,this.lastClickedLine=t}willUpdate(t){(t.has("code")||t.has("language"))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?d`<div class="location">${this.location}</div>`:y}render(){if(!this.lineNumbers)return d`
              ${this.renderLocation()}
              <pre class="language-${this.language}"><code>${Ue(this.highlightCode())}</code></pre>
            `;const t=this.getLineSegments(),o=Math.max(this.startLine,1),r=o+t.length-1,i=r>0?Math.floor(Math.log10(r))+1:1,s=this.effectiveHighlights,a=this.isLocked;return d`
          ${this.renderLocation()}
          <div class="lined-code${a?" locked":""}" style="--gutter-digits: ${i}">
            <pre class="language-${this.language}"><code>${t.map((n,l)=>{const c=o+l,g=s.has(c);return d`<span class="line${g?" highlighted":""}"
                ><span class="line-number"
                       @click=${m=>this.handleLineClick(c,m)}
                >${c}</span><span class="line-content">${Ue(n||" ")}</span>
</span>`})}</code></pre>
          </div>
        `}},u.PpCodeViewer.styles=[ah],Ot([p()],u.PpCodeViewer.prototype,"code",2),Ot([p()],u.PpCodeViewer.prototype,"language",2),Ot([p({type:Boolean})],u.PpCodeViewer.prototype,"pretty",2),Ot([p({attribute:"line-numbers",type:Boolean})],u.PpCodeViewer.prototype,"lineNumbers",2),Ot([p({attribute:"highlight-lines"})],u.PpCodeViewer.prototype,"highlightLines",2),Ot([p({attribute:"start-line",type:Number})],u.PpCodeViewer.prototype,"startLine",2),Ot([p()],u.PpCodeViewer.prototype,"location",2),Ot([p({type:Boolean,reflect:!0})],u.PpCodeViewer.prototype,"embedded",2),Ot([D()],u.PpCodeViewer.prototype,"selectedLines",2),Ot([D()],u.PpCodeViewer.prototype,"lastClickedLine",2),u.PpCodeViewer=Ot([X("pp-code-viewer")],u.PpCodeViewer);const ch=k`
    :host {
        display: flex;
        align-items: center;
        gap: var(--global-padding);
    }

    h1, h2, h3, h4 {
        margin: 0;
        padding: 0;
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        color: var(--pp-icon-title-color, inherit);
    }
`;var dh=Object.defineProperty,uh=Object.getOwnPropertyDescriptor,Qo=(e,t,o,r)=>{for(var i=r>1?void 0:r?uh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&dh(t,o,i),i};u.PpIconTitle=class extends Q{constructor(){super(...arguments),this.icon="",this.heading="",this.level=1,this.size="huge"}render(){if(!this.heading)return y;const t=Bl(`h${Math.min(Math.max(this.level,1),6)}`);return yo`
            <pb33f-model-icon icon=${this.icon} size=${this.size}></pb33f-model-icon>
            <${t}>${this.heading}</${t}>
        `}},u.PpIconTitle.styles=[ch],Qo([p()],u.PpIconTitle.prototype,"icon",2),Qo([p()],u.PpIconTitle.prototype,"heading",2),Qo([p({type:Number})],u.PpIconTitle.prototype,"level",2),Qo([p()],u.PpIconTitle.prototype,"size",2),u.PpIconTitle=Qo([X("pp-icon-title")],u.PpIconTitle);var ph=Object.defineProperty,hh=Object.getOwnPropertyDescriptor,Ye=(e,t,o,r)=>{for(var i=r>1?void 0:r?hh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&ph(t,o,i),i};u.PpRefPopover=class extends Q{constructor(){super(...arguments),this.registryKey="",this.schemaRef="",this.active=!1,this.entry=null,this.parsedData=null}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.showTimeout),clearTimeout(this.hideTimeout),this.active=!1}show(){clearTimeout(this.hideTimeout),this.showTimeout=window.setTimeout(()=>{if(this.entry=(this.registryKey?En(this.registryKey):os(this.schemaRef))??null,this.entry){try{this.parsedData=JSON.parse(this.entry.schemaJson)}catch{this.parsedData=null}this.active=!0}},300)}hide(){clearTimeout(this.showTimeout),this.hideTimeout=window.setTimeout(()=>{this.active=!1},200)}cancelHide(){clearTimeout(this.hideTimeout)}resolveExample(){var o,r;if((o=this.entry)!=null&&o.mockJson)return this.entry.mockJson;const t=this.parsedData;return t?((r=t.schema)==null?void 0:r.example)!==void 0?JSON.stringify(t.schema.example):t.example!==void 0?JSON.stringify(t.example):Array.isArray(t.examples)&&t.examples.length>0?JSON.stringify(t.examples[0]):null:null}getSchemaJson(){if(!this.entry)return"";const t=this.parsedData;return t?t.schema?JSON.stringify(t.schema):this.entry.schemaJson:this.entry.schemaJson}formatJson(t){try{return JSON.stringify(JSON.parse(t),null,2)}catch{return t}}render(){const t=this.resolveExample(),o=this.getSchemaJson();return d`
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
                            <pp-schema-properties compact schema-json=${o}></pp-schema-properties>
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
        `}},u.PpRefPopover.styles=Ep,Ye([p({attribute:"registry-key"})],u.PpRefPopover.prototype,"registryKey",2),Ye([p({attribute:"schema-ref"})],u.PpRefPopover.prototype,"schemaRef",2),Ye([D()],u.PpRefPopover.prototype,"active",2),Ye([D()],u.PpRefPopover.prototype,"entry",2),Ye([D()],u.PpRefPopover.prototype,"parsedData",2),Ye([B(".trigger")],u.PpRefPopover.prototype,"trigger",2),u.PpRefPopover=Ye([X("pp-ref-popover")],u.PpRefPopover);const gh=k`
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
`;var mh=Object.defineProperty,fh=Object.getOwnPropertyDescriptor,us=(e,t,o,r)=>{for(var i=r>1?void 0:r?fh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&mh(t,o,i),i};u.PpExtensions=class extends Q{constructor(){super(...arguments),this.extensionsJson="",this.extensions=[]}willUpdate(t){if(t.has("extensionsJson"))if(this.extensionsJson)try{this.extensions=JSON.parse(this.extensionsJson)}catch{this.extensions=[]}else this.extensions=[]}renderValue(t){return t==null?y:typeof t=="object"?d`<pp-code-viewer code=${JSON.stringify(t,null,2)} language="json"></pp-code-viewer>`:d`<span class="ext-scalar">${String(t)}</span>`}render(){return this.extensions.length?d`<div class="ext-grid">
      ${this.extensions.map(t=>d`
        <div class="ext-key">${t.key}</div>
        <div class="ext-value">${this.renderValue(t.value)}</div>
      `)}
    </div>`:y}},u.PpExtensions.styles=gh,us([p({attribute:"extensions-json"})],u.PpExtensions.prototype,"extensionsJson",2),us([D()],u.PpExtensions.prototype,"extensions",2),u.PpExtensions=us([X("pp-extensions")],u.PpExtensions);var bh=Object.defineProperty,vh=Object.getOwnPropertyDescriptor,ps=(e,t,o,r)=>{for(var i=r>1?void 0:r?vh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&bh(t,o,i),i};u.PpOperationParameters=class extends Q{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(t){if(t.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}inIcon(t){switch(t){case"cookie":return"cookie";case"header":return"envelope";case"path":return"signpost";case"query":return"question-diamond";default:return"question-diamond"}}parseSchema(t){if(!t)return null;try{return JSON.parse(t)}catch{return null}}render(){return this.params.length?d`
      ${this.params.map(t=>{var i;const o=this.parseSchema(t.schemaJson),r=ts(o);return d`
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
              ${co(o,{labelSuffix:":"})}
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
    `:y}},u.PpOperationParameters.styles=[lo,Er,kr,jp],ps([p({attribute:"parameters-json"})],u.PpOperationParameters.prototype,"parametersJson",2),ps([D()],u.PpOperationParameters.prototype,"params",2),u.PpOperationParameters=ps([X("pp-operation-parameters")],u.PpOperationParameters);const Pn=k`
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
`,yh=k`
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
        margin: var(--global-padding) 0;
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
`,Mh=k`
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
`;function hs(e){const t=parseInt(e,10);return t>=500?"status-error":t>=400?"status-warn":"status-ok"}const Pr={100:"Continue",101:"Switching Protocols",102:"Processing",103:"Early Hints",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Content Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a Teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Too Early",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",510:"Not Extended",511:"Network Authentication Required"};var wh=k`
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
`,nt=class extends K{constructor(){super(...arguments),this.localize=new gt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let e=this.value;if(this.from){const t=this.getRootNode(),o=this.from.includes("."),r=this.from.includes("[")&&this.from.includes("]");let i=this.from,s="";o?[i,s]=this.from.trim().split("."):r&&([i,s]=this.from.trim().replace(/\]$/,"").split("["));const a="getElementById"in t?t.getElementById(i):null;a?r?e=a.getAttribute(s)||"":o?e=a[s]||"":e=a.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!e)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(e),this.showStatus("success"),this.emit("sl-copy",{detail:{value:e}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(e){const t=this.copyLabel||this.localize.term("copy"),o=this.successLabel||this.localize.term("copied"),r=this.errorLabel||this.localize.term("error"),i=e==="success"?this.successIcon:this.errorIcon,s=vt(this,"copy.in",{dir:"ltr"}),a=vt(this,"copy.out",{dir:"ltr"});this.tooltip.content=e==="success"?o:r,await this.copyIcon.animate(a.keyframes,a.options).finished,this.copyIcon.hidden=!0,this.status=e,i.hidden=!1,await i.animate(s.keyframes,s.options).finished,setTimeout(async()=>{await i.animate(a.keyframes,a.options).finished,i.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(s.keyframes,s.options).finished,this.tooltip.content=t,this.isCopying=!1},this.feedbackDuration)}render(){const e=this.copyLabel||this.localize.term("copy");return d`
      <sl-tooltip
        class=${st({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
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
    `}};nt.styles=[rt,wh],nt.dependencies={"sl-icon":pt,"sl-tooltip":at},h([B('slot[name="copy-icon"]')],nt.prototype,"copyIcon",2),h([B('slot[name="success-icon"]')],nt.prototype,"successIcon",2),h([B('slot[name="error-icon"]')],nt.prototype,"errorIcon",2),h([B("sl-tooltip")],nt.prototype,"tooltip",2),h([D()],nt.prototype,"isCopying",2),h([D()],nt.prototype,"status",2),h([p()],nt.prototype,"value",2),h([p()],nt.prototype,"from",2),h([p({type:Boolean,reflect:!0})],nt.prototype,"disabled",2),h([p({attribute:"copy-label"})],nt.prototype,"copyLabel",2),h([p({attribute:"success-label"})],nt.prototype,"successLabel",2),h([p({attribute:"error-label"})],nt.prototype,"errorLabel",2),h([p({attribute:"feedback-duration",type:Number})],nt.prototype,"feedbackDuration",2),h([p({attribute:"tooltip-placement"})],nt.prototype,"tooltipPlacement",2),h([p({type:Boolean})],nt.prototype,"hoist",2),it("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}}),it("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}}),nt.define("sl-copy-button");const xh=[ls,k`
    :host {
        display: inline-block;
        margin: var(--global-padding) 0 var(--global-padding) 0;
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

    .code-container {
        position: relative;
    }

    .floating-copy {
        position: absolute;
        top: var(--global-padding);
        right: var(--global-padding);
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
        margin-top: var(--global-padding);
    }
`],Rr=k`
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
`;var Lh=Object.defineProperty,Ih=Object.getOwnPropertyDescriptor,fe=(e,t,o,r)=>{for(var i=r>1?void 0:r?Ih(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Lh(t,o,i),i};u.PpExampleSelector=class extends Q{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.mode="drawer",this.codeLanguage="json",this.entries=[],this.selectedIndex=0}willUpdate(t){(t.has("examplesData")||t.has("mockJson")||t.has("examplesJson"))&&this.buildEntries()}buildEntries(){const t=[];let o=this.mockJson,r={};if(this.examplesData)try{const i=JSON.parse(this.examplesData);i.mockJson&&(o=i.mockJson),i.examples&&(r=i.examples)}catch{}if(this.examplesJson)try{r={...r,...JSON.parse(this.examplesJson)}}catch{}for(const[i,s]of Object.entries(r))s&&t.push({key:i,json:s});o&&t.push({key:"",json:o}),this.entries=t,this.selectedIndex=0}showExample(t){let o=t.json;if(this.codeLanguage==="json")try{o=JSON.stringify(JSON.parse(t.json),null,2)}catch{}const r=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:t.key,json:o,language:this.codeLanguage}});this.dispatchEvent(r)}handleSelect(t){var i,s;const o=(s=(i=t.detail)==null?void 0:i.item)==null?void 0:s.value;if(o===void 0)return;const r=parseInt(o,10);r>=0&&r<this.entries.length&&this.showExample(this.entries[r])}render(){if(!this.entries.length)return y;if(this.mode==="inline")return this.renderInline();if(this.entries.length===1){const t=this.entries[0];return d`
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
    `}inlineLabel(t){return t.toLowerCase().includes("example")?t:`${t} Example`}renderCodeBlock(t){return d`
      <div class="code-container">
        <sl-copy-button .value=${t} class="floating-copy"></sl-copy-button>
        <pp-code-viewer .code=${t} .language=${this.codeLanguage}
            ?pretty=${this.codeLanguage==="json"}></pp-code-viewer>
      </div>
    `}renderInline(){const t=this.entries[this.selectedIndex];return this.entries.length===1?d`
        <div class="inline-example-label">${this.inlineLabel(t.key)}</div>
        ${this.renderCodeBlock(t.json)}
      `:d`
      ${this.renderCodeBlock(t.json)}
      <sl-dropdown skidding="5" distance="5">
        <sl-button slot="trigger" caret>${this.inlineLabel(t.key)}</sl-button>
        <sl-menu @sl-select=${this.handleInlineSelect}>
          ${this.entries.map((o,r)=>d`
            <sl-menu-item value="${r}">${this.inlineLabel(o.key)}</sl-menu-item>
          `)}
        </sl-menu>
      </sl-dropdown>
    `}handleInlineSelect(t){var r,i;const o=(i=(r=t.detail)==null?void 0:r.item)==null?void 0:i.value;o!==void 0&&(this.selectedIndex=parseInt(o,10))}},u.PpExampleSelector.styles=[...xh,Rr],fe([p({attribute:"examples-data"})],u.PpExampleSelector.prototype,"examplesData",2),fe([p({attribute:"mock-json"})],u.PpExampleSelector.prototype,"mockJson",2),fe([p({attribute:"examples-json"})],u.PpExampleSelector.prototype,"examplesJson",2),fe([p()],u.PpExampleSelector.prototype,"mode",2),fe([p({attribute:"code-language"})],u.PpExampleSelector.prototype,"codeLanguage",2),fe([D()],u.PpExampleSelector.prototype,"entries",2),fe([D()],u.PpExampleSelector.prototype,"selectedIndex",2),u.PpExampleSelector=fe([X("pp-example-selector")],u.PpExampleSelector);const Ch=[ls,k`
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
`];var Ah=Object.defineProperty,jh=Object.getOwnPropertyDescriptor,Zo=(e,t,o,r)=>{for(var i=r>1?void 0:r?jh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Ah(t,o,i),i};u.PpMediaTypeSelector=class extends Q{constructor(){super(...arguments),this.contentJson="",this.mediaTypes=[],this.selectedIndex=0,this.schemasIdentical=!1}willUpdate(t){if(t.has("contentJson")&&this.contentJson){try{this.mediaTypes=JSON.parse(this.contentJson)}catch{this.mediaTypes=[]}const o=this.mediaTypes.findIndex(r=>r.mediaType.toLowerCase()==="application/json");this.selectedIndex=o>=0?o:0,this.schemasIdentical=this.mediaTypes.length>1&&new Set(this.mediaTypes.map(r=>this.schemaFingerprint(r))).size===1}}schemaFingerprint(t){return t.isArray&&t.itemsRef?`array:${t.itemsRef.slug}:${t.itemsSchemaJson||t.schemaJson}`:t.schemaRef?`ref:${t.schemaRef.componentType}/${t.schemaRef.slug}`:`inline:${t.schemaJson}`}getMockAndLanguage(t){const o=t.mediaType.toLowerCase();return(o.includes("yaml")||o.includes("x-yaml"))&&t.mockYaml?{mock:t.mockYaml,language:"yaml"}:o.includes("xml")&&t.mockXml?{mock:t.mockXml,language:"xml"}:{mock:t.mockJson||"",language:"json"}}renderRefLink(t){return es(t)}renderSchemaHeader(t){return t.isArray&&t.itemsRef?d`
                <div class="media-type-ref">
                    <span class="media-type-label">${t.mediaType}</span>
                    <span class="array-type">Array&lt;${this.renderRefLink(t.itemsRef)}&gt;</span>
                </div>`:t.schemaRef?d`
                <div class="media-type-ref">
                    <span class="media-type-label">${t.mediaType}</span>
                    ${this.renderRefLink(t.schemaRef)}
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
        `:y}renderRefInfo(t){return t.isArray&&t.itemsRef?d`<span class="array-type">Array&lt;${this.renderRefLink(t.itemsRef)}&gt;</span>`:t.schemaRef?this.renderRefLink(t.schemaRef):y}renderDropdown(t){return d`
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
        `}handleSelect(t){var i,s;const o=(s=(i=t.detail)==null?void 0:i.item)==null?void 0:s.value;if(o===void 0)return;const r=parseInt(o,10);r>=0&&r<this.mediaTypes.length&&(this.selectedIndex=r)}render(){if(!this.mediaTypes.length)return y;if(this.mediaTypes.length===1){const i=this.mediaTypes[0],{mock:s,language:a}=this.getMockAndLanguage(i);return d`
                ${this.renderSchemaHeader(i)}
                ${this.renderInlineExamples(i,a,s)}
                ${this.renderSchemaProperties(i)}
                ${this.renderExtensions(i)}
            `}const t=this.mediaTypes[this.selectedIndex],{mock:o,language:r}=this.getMockAndLanguage(t);if(this.schemasIdentical){const i=this.mediaTypes[0];return d`
                ${this.renderDropdown(t)}
                ${this.renderInlineExamples(t,r,o)}
                ${this.renderSchemaProperties(i)}
                ${this.renderExtensions(t)}
            `}return d`
            ${this.renderDropdown(t)}
            ${this.renderInlineExamples(t,r,o)}
            ${this.renderSchemaProperties(t)}
            ${this.renderExtensions(t)}
        `}},u.PpMediaTypeSelector.styles=[lo,kr,Ch],Zo([p({attribute:"content-json"})],u.PpMediaTypeSelector.prototype,"contentJson",2),Zo([D()],u.PpMediaTypeSelector.prototype,"mediaTypes",2),Zo([D()],u.PpMediaTypeSelector.prototype,"selectedIndex",2),Zo([D()],u.PpMediaTypeSelector.prototype,"schemasIdentical",2),u.PpMediaTypeSelector=Zo([X("pp-media-type-selector")],u.PpMediaTypeSelector);var Nh=Object.defineProperty,Sh=Object.getOwnPropertyDescriptor,_t=(e,t,o,r)=>{for(var i=r>1?void 0:r?Sh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Nh(t,o,i),i};u.PpOperationResponses=class extends Q{constructor(){super(...arguments),this.responsesJson="",this.commonHeadersJson="",this.responses=[],this.commonResponseHeaders=[],this.commonHeaderNames=new Set,this.commonErrorKeys=new Set,this.commonErrorResponses=new Map,this.successResponses=[],this.redirectResponses=[],this.errorResponses=[]}willUpdate(t){if(t.has("responsesJson")&&this.responsesJson){try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}const o=[...this.responses].sort((l,c)=>parseInt(l.statusCode,10)-parseInt(c.statusCode,10)),r=[],i=[],s=[];for(const l of o){const c=parseInt(l.statusCode,10);c>=400?s.push(l):c>=300?i.push(l):r.push(l)}this.successResponses=r,this.redirectResponses=i,this.errorResponses=s;const{commonKeys:a,commonResponses:n}=this.computeCommonErrors(s);this.commonErrorKeys=a,this.commonErrorResponses=n}if(t.has("commonHeadersJson")&&this.commonHeadersJson){try{this.commonResponseHeaders=JSON.parse(this.commonHeadersJson)}catch{this.commonResponseHeaders=[]}this.commonHeaderNames=new Set(this.commonResponseHeaders.map(o=>o.name))}}getResponseNavItems(){const t=[];for(const o of[...this.successResponses,...this.redirectResponses,...this.errorResponses])t.push({label:`${o.statusCode} ${Pr[o.statusCode]||""}`.trim(),id:`response-${o.statusCode}`});return t}renderRefLink(t,o=!1){return es(t,o)}scrollToHeader(t){var i,s;const o=(i=this.shadowRoot)==null?void 0:i.getElementById("header-"+t);if(!o)return;const r=o.closest("sl-details");r&&!r.open?(r.open=!0,(s=r.updateComplete)==null||s.then(()=>{o.scrollIntoView({behavior:"auto",block:"center"})})):o.scrollIntoView({behavior:"auto",block:"center"})}renderHeaderEntry(t){var o;return d`
            <div class="header-entry">
                <div class="header-name-col">
                    ${t.ref?d`
                                <pp-ref-popover registry-key="${t.ref.componentType}/${t.ref.name}"><a
                                        class="ref-link header-name" href="models/${t.ref.typeSlug}/${t.ref.slug}.html">\u279c
                                    ${t.name}</a></pp-ref-popover>`:d`<span class="header-name">${t.name}</span>`}
                </div>
                <div class="header-type-col">
                    ${t.schemaType?d`<span class="header-type">${t.schemaType}</span>`:y}
                    ${co(t,{includeExample:!0})}
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
                    <h3><span class="status-code ${hs(t.statusCode)}">${t.statusCode}</span> ${Pr[t.statusCode]||""}
                        ${t.rawJson||t.rawYaml?d`
                                <pp-raw-viewer-btn
                                        title="Response ${t.statusCode}"
                                        raw-json=${t.rawJson||""}
                                        raw-yaml=${t.rawYaml||""}
                                        start-line=${t.sourceLine||1}
                                        location=${t.location||""}>
                                </pp-raw-viewer-btn>`:y}
                    </h3>
                    ${t.descHtml?d`<div class="response-desc">${Ue(t.descHtml)}</div>`:y}
              
                ${s?d`
                            <div class="common-error-link">
                                ${t.ref?this.renderRefLink(t.ref,!0):y}
                                ${!t.ref&&((a=t.content)!=null&&a.length)?this.renderMediaTypeHeader(t.content[0]):y}
                                <a class="error-anchor" @click=${c=>{c.preventDefault(),this.scrollToCommonError(i)}}>\u2191 see common example</a>
                            </div>`:t.ref?this.renderRefLink(t.ref,!0):(n=t.content)!=null&&n.length?d`<pp-media-type-selector content-json=${JSON.stringify(t.content)}></pp-media-type-selector>`:y}
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
                <span class="array-type">Array&lt;${this.renderRefLink(t.itemsRef)}&gt;</span>
            `:t.schemaRef?d`
                <span class="media-type-label">${t.mediaType}</span>
                ${this.renderRefLink(t.schemaRef)}
            `:y}renderCommonErrors(t,o){return t.size?d`
            <div class="response-group-heading"><h4>Common Error Responses</h4></div>
            ${[...t.entries()].map(([r,{resp:i,codeDescs:s}])=>{var a;return d`
                <div class="response common-error-response" id="common-error-${r}">
                    <div class="common-error-grid">
                        ${s.map(({code:n,description:l})=>d`
                            <div class="common-error-code"><span class="${hs(n)}">${n}</span> ${Pr[n]||""}</div>
                            <div class="common-error-desc">${l}</div>
                        `)}
                    </div>
                    ${i.ref?this.renderRefLink(i.ref,!0):(a=i.content)!=null&&a.length?d`<pp-media-type-selector content-json=${JSON.stringify(i.content)}></pp-media-type-selector>`:y}
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
        `}},u.PpOperationResponses.styles=[lo,Er,kr,Pn,yh,Mh],_t([p({attribute:"responses-json"})],u.PpOperationResponses.prototype,"responsesJson",2),_t([p({attribute:"common-headers-json"})],u.PpOperationResponses.prototype,"commonHeadersJson",2),_t([D()],u.PpOperationResponses.prototype,"responses",2),_t([D()],u.PpOperationResponses.prototype,"commonResponseHeaders",2),_t([D()],u.PpOperationResponses.prototype,"commonHeaderNames",2),_t([D()],u.PpOperationResponses.prototype,"commonErrorKeys",2),_t([D()],u.PpOperationResponses.prototype,"commonErrorResponses",2),_t([D()],u.PpOperationResponses.prototype,"successResponses",2),_t([D()],u.PpOperationResponses.prototype,"redirectResponses",2),_t([D()],u.PpOperationResponses.prototype,"errorResponses",2),u.PpOperationResponses=_t([X("pp-operation-responses")],u.PpOperationResponses);const Th=k`
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

`;var Dh=Object.defineProperty,Eh=Object.getOwnPropertyDescriptor,gs=(e,t,o,r)=>{for(var i=r>1?void 0:r?Eh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Dh(t,o,i),i};u.PpOperationCallbacks=class extends Q{constructor(){super(...arguments),this.callbacksJson="",this.callbacks=[]}willUpdate(t){if(t.has("callbacksJson")&&this.callbacksJson)try{this.callbacks=JSON.parse(this.callbacksJson)}catch{this.callbacks=[]}}renderRefLink(t){return es(t,!0)}renderRequestBody(t){var o;return t.ref?d`<div class="callback-section-label">Request Body</div>${this.renderRefLink(t.ref)}`:(o=t.content)!=null&&o.length?d`
            <div class="callback-section-label">Request Body${t.required?" (required)":""}</div>
            ${t.descHtml?d`<div class="callback-desc">${Ue(t.descHtml)}</div>`:y}
            <pp-media-type-selector content-json=${JSON.stringify(t.content)}></pp-media-type-selector>
        `:y}renderResponses(t){return t!=null&&t.length?d`
            <div class="callback-section-label">Responses</div>
            ${t.map(o=>{var r;return d`
                <div class="callback-response">
                    <span class="callback-response-code ${hs(o.statusCode)}">${o.statusCode}</span>
                    <span class="callback-response-code">${Pr[o.statusCode]||""}</span>
                    ${o.descHtml?d`<span class="callback-response-desc">${Ue(o.descHtml)}</span>`:o.description?d`<span class="callback-response-desc">${o.description}</span>`:y}
                </div>
                ${o.ref?this.renderRefLink(o.ref):y}
                ${!o.ref&&((r=o.content)!=null&&r.length)?d`<pp-media-type-selector content-json=${JSON.stringify(o.content)}></pp-media-type-selector>`:y}
            `})}
        `:y}renderCallbackOperation(t){return d`
            <div class="callback-operation">
                <div class="callback-method-expression">
                    <pb33f-http-method method=${t.method}></pb33f-http-method>
                    <span class="callback-expression">${t.expression}</span>
                </div>
                ${t.descHtml?d`<div class="callback-desc">${Ue(t.descHtml)}</div>`:y}
                ${t.requestBody?this.renderRequestBody(t.requestBody):y}
                ${this.renderResponses(t.responses??[])}
            </div>
        `}render(){return this.callbacks.length?d`
            ${this.callbacks.map(t=>d`
                <div class="callback-entry">
                    <div class="callback-name">
                        ${t.ref?this.renderRefLink(t.ref):y}
                        ${t.name}
                    </div>
                    ${t.operations.map(o=>this.renderCallbackOperation(o))}
                </div>
            `)}
        `:y}},u.PpOperationCallbacks.styles=[lo,kr,Pn,Th],gs([p({attribute:"callbacks-json"})],u.PpOperationCallbacks.prototype,"callbacksJson",2),gs([D()],u.PpOperationCallbacks.prototype,"callbacks",2),u.PpOperationCallbacks=gs([X("pp-operation-callbacks")],u.PpOperationCallbacks);const kh=k`
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
`,zh=k`
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
`;var $h=Object.defineProperty,Oh=Object.getOwnPropertyDescriptor,be=(e,t,o,r)=>{for(var i=r>1?void 0:r?Oh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&$h(t,o,i),i};u.PpInlineCode=class extends Q{constructor(){super(...arguments),this.rawJson="",this.rawYaml="",this.startLine=1,this.title="Schema",this.location="",this.noLineNumbers=!1,this.mode="yaml"}connectedCallback(){super.connectedCallback();const t=document.body.getAttribute("data-spec-format");(t==="json"||t==="yaml")&&(this.mode=t)}render(){if(!this.rawJson&&!this.rawYaml)return y;const t=!!this.rawJson,o=!!this.rawYaml,r=this.mode==="yaml"&&o?this.rawYaml:this.rawJson,i=this.mode==="yaml"&&o?"yaml":"json",s=t&&o;return d`
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
    `}},u.PpInlineCode.styles=[zh,Rr],be([p({attribute:"raw-json"})],u.PpInlineCode.prototype,"rawJson",2),be([p({attribute:"raw-yaml"})],u.PpInlineCode.prototype,"rawYaml",2),be([p({attribute:"start-line",type:Number})],u.PpInlineCode.prototype,"startLine",2),be([p()],u.PpInlineCode.prototype,"title",2),be([p()],u.PpInlineCode.prototype,"location",2),be([p({attribute:"no-line-numbers",type:Boolean})],u.PpInlineCode.prototype,"noLineNumbers",2),be([D()],u.PpInlineCode.prototype,"mode",2),u.PpInlineCode=be([X("pp-inline-code")],u.PpInlineCode);var _h=Object.defineProperty,Ph=Object.getOwnPropertyDescriptor,Pt=(e,t,o,r)=>{for(var i=r>1?void 0:r?Ph(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&_h(t,o,i),i};u.PpModelPage=class extends Q{constructor(){super(...arguments),this.modelJson="",this.name="",this.rawYaml="",this.schemaRawYaml="",this.schemaRawJson="",this.schemaStartLine=1,this.startLine=1,this.location="",this.mockJson="",this.parsed=null}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}renderExampleObjects(t){const o=Object.entries(t);return o.length?d`
      <h3>Examples</h3>
      ${o.map(([r,i])=>d`
        <div class="example-object">
          <div class="example-header">
            <span class="prop-name">${r}</span>
            ${i.summary?d`<span class="example-summary">${i.summary}</span>`:y}
          </div>
          ${i.description?d`<div class="prop-desc">${i.description}</div>`:y}
          ${i.value!==void 0?d`<pp-inline-code raw-json=${JSON.stringify(i.value,null,2)} title=${r} no-line-numbers></pp-inline-code>`:y}
          ${i.externalValue?d`<div class="example-external"><a href=${i.externalValue}>${i.externalValue}</a></div>`:y}
        </div>
      `)}
    `:y}renderComponentWithSchema(t,o){const r=t.schema||{},i=this.schemaRawJson||JSON.stringify(r,null,2),s=this.schemaRawYaml;return d`
      <div class="traits">
        <h3>Traits</h3>
        <div class="constraints">
          ${o}
          ${r.type?d`
            <span class="constraint-label">type</span>
            <span class="constraint-value">${r.type}${r.format?` (${r.format})`:""}</span>
          `:y}
        </div>
        ${co(r,{includeExample:!0})}
      </div>
      ${t.examples?this.renderExampleObjects(t.examples):y}
      ${!t.examples&&(t.example!==void 0||r.example!==void 0)?d`<pp-inline-code raw-json=${JSON.stringify(t.example??r.example,null,2)} title="" no-line-numbers></pp-inline-code>`:y}
      ${Object.keys(r).length?d`<pp-inline-code
            raw-json=${i}
            raw-yaml=${s}
            start-line=${this.schemaStartLine}
            title="Schema"></pp-inline-code>`:y}
    `}renderParameter(t){return this.renderComponentWithSchema(t,d`
      <span class="constraint-label">name</span>
      <span class="constraint-value">${t.name}</span>
      <span class="constraint-label">in</span>
      <span class="constraint-value">${t.in}</span>
      ${t.required!==void 0?d`
        <span class="constraint-label">required</span>
        <span class="constraint-value">${t.required}</span>
      `:y}
      ${t.deprecated?d`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:y}
    `)}renderHeader(t){return this.renderComponentWithSchema(t,d`
      ${t.required?d`
        <span class="constraint-label">required</span>
        <span class="constraint-value">true</span>
      `:y}
      ${t.deprecated?d`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:y}
    `)}renderSchema(t){const o=t.example!==void 0?JSON.stringify(t.example,null,2):this.mockJson||"",r=t.properties||t.allOf||t.oneOf||t.anyOf;return d`
      ${o?d`<pp-inline-code raw-json=${o} title="" no-line-numbers></pp-inline-code>`:y}
      ${!r&&t.type?d`<div><strong>Type:</strong> ${t.type}${t.format?d` <span class="prop-format">(${t.format})</span>`:y}</div>`:y}
      ${r?y:co(t)}
      ${r?d`
            <h3>${t.properties?"Properties":t.allOf?"Composition":"Variants"}</h3>
            <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
          `:y}
    `}render(){if(!this.parsed)return y;const t=this.parsed;return t.in?this.renderParameter(t):t.schema&&!t.properties&&!t.in?this.renderHeader(t):this.renderSchema(t)}},u.PpModelPage.styles=[lo,Er,kh],Pt([p({attribute:"model-json"})],u.PpModelPage.prototype,"modelJson",2),Pt([p()],u.PpModelPage.prototype,"name",2),Pt([p({attribute:"raw-yaml"})],u.PpModelPage.prototype,"rawYaml",2),Pt([p({attribute:"schema-raw-yaml"})],u.PpModelPage.prototype,"schemaRawYaml",2),Pt([p({attribute:"schema-raw-json"})],u.PpModelPage.prototype,"schemaRawJson",2),Pt([p({attribute:"schema-start-line",type:Number})],u.PpModelPage.prototype,"schemaStartLine",2),Pt([p({attribute:"start-line",type:Number})],u.PpModelPage.prototype,"startLine",2),Pt([p()],u.PpModelPage.prototype,"location",2),Pt([p({attribute:"mock-json"})],u.PpModelPage.prototype,"mockJson",2),Pt([D()],u.PpModelPage.prototype,"parsed",2),u.PpModelPage=Pt([X("pp-model-page")],u.PpModelPage);const Rh=k`
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
`;var Uh=Object.defineProperty,Yh=Object.getOwnPropertyDescriptor,Ur=(e,t,o,r)=>{for(var i=r>1?void 0:r?Yh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Uh(t,o,i),i};u.PpModelCard=class extends Q{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return d`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?d`<p>${this.description}</p>`:""}
      </a>
    `}},u.PpModelCard.styles=Rh,Ur([p()],u.PpModelCard.prototype,"name",2),Ur([p()],u.PpModelCard.prototype,"href",2),Ur([p()],u.PpModelCard.prototype,"description",2),u.PpModelCard=Ur([X("pp-model-card")],u.PpModelCard);const Bh=k`
    :host {
        display: block;
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
        padding-bottom: 50px;
        border-top: 1px dashed var(--secondary-color-dimmer);
    }
`,Hh=k`
    :host {
        display: block;
        margin-bottom: var(--global-padding);
        margin-top: var(--subheader-margin-top);
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
`;var Qh=k`
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
`,Zh=(e="value")=>(t,o)=>{const r=t.constructor,i=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(s,a,n){var l;const c=r.getPropertyOptions(e),g=typeof c.attribute=="string"?c.attribute:e;if(s===g){const m=c.converter||He,b=(typeof m=="function"?m:(l=m==null?void 0:m.fromAttribute)!=null?l:He.fromAttribute)(n,c.type);this[e]!==b&&(this[o]=b)}i.call(this,s,a,n)}},Wh=k`
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
 */const Fh=tr(class extends er{constructor(e){if(super(e),e.type!==Jt.PROPERTY&&e.type!==Jt.ATTRIBUTE&&e.type!==Jt.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Ys(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===Ct||t===y)return t;const o=e.element,r=e.name;if(e.type===Jt.PROPERTY){if(t===o[r])return Ct}else if(e.type===Jt.BOOLEAN_ATTRIBUTE){if(!!t===o.hasAttribute(r))return Ct}else if(e.type===Jt.ATTRIBUTE&&o.getAttribute(r)===t+"")return Ct;return Ul(e),t}});var O=class extends K{constructor(){super(...arguments),this.formControlController=new zn(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new hr(this,"help-text","label"),this.localize=new gt(this),this.hasFocus=!1,this.title="",this.__numberInput=Object.assign(document.createElement("input"),{type:"number"}),this.__dateInput=Object.assign(document.createElement("input"),{type:"date"}),this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.filled=!1,this.pill=!1,this.label="",this.helpText="",this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form="",this.required=!1,this.spellcheck=!0}get valueAsDate(){var e;return this.__dateInput.type=this.type,this.__dateInput.value=this.value,((e=this.input)==null?void 0:e.valueAsDate)||this.__dateInput.valueAsDate}set valueAsDate(e){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=e,this.value=this.__dateInput.value}get valueAsNumber(){var e;return this.__numberInput.value=this.value,((e=this.input)==null?void 0:e.valueAsNumber)||this.__numberInput.valueAsNumber}set valueAsNumber(e){this.__numberInput.valueAsNumber=e,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(e){e.preventDefault(),this.value!==""&&(this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleKeyDown(e){const t=e.metaKey||e.ctrlKey||e.shiftKey||e.altKey;e.key==="Enter"&&!t&&setTimeout(()=>{!e.defaultPrevented&&!e.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(e,t,o="none"){this.input.setSelectionRange(e,t,o)}setRangeText(e,t,o,r="preserve"){const i=t??this.input.selectionStart,s=o??this.input.selectionEnd;this.input.setRangeText(e,i,s,r),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){const e=this.hasSlotController.test("label"),t=this.hasSlotController.test("help-text"),o=this.label?!0:!!e,r=this.helpText?!0:!!t,s=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return d`
      <div
        part="form-control"
        class=${st({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":r})}
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
            class=${st({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
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
              name=${P(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${P(this.placeholder)}
              minlength=${P(this.minlength)}
              maxlength=${P(this.maxlength)}
              min=${P(this.min)}
              max=${P(this.max)}
              step=${P(this.step)}
              .value=${Fh(this.value)}
              autocapitalize=${P(this.autocapitalize)}
              autocomplete=${P(this.autocomplete)}
              autocorrect=${P(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${P(this.pattern)}
              enterkeyhint=${P(this.enterkeyhint)}
              inputmode=${P(this.inputmode)}
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
    `}};O.styles=[rt,Wh,Qh],O.dependencies={"sl-icon":pt},h([B(".input__control")],O.prototype,"input",2),h([D()],O.prototype,"hasFocus",2),h([p()],O.prototype,"title",2),h([p({reflect:!0})],O.prototype,"type",2),h([p()],O.prototype,"name",2),h([p()],O.prototype,"value",2),h([Zh()],O.prototype,"defaultValue",2),h([p({reflect:!0})],O.prototype,"size",2),h([p({type:Boolean,reflect:!0})],O.prototype,"filled",2),h([p({type:Boolean,reflect:!0})],O.prototype,"pill",2),h([p()],O.prototype,"label",2),h([p({attribute:"help-text"})],O.prototype,"helpText",2),h([p({type:Boolean})],O.prototype,"clearable",2),h([p({type:Boolean,reflect:!0})],O.prototype,"disabled",2),h([p()],O.prototype,"placeholder",2),h([p({type:Boolean,reflect:!0})],O.prototype,"readonly",2),h([p({attribute:"password-toggle",type:Boolean})],O.prototype,"passwordToggle",2),h([p({attribute:"password-visible",type:Boolean})],O.prototype,"passwordVisible",2),h([p({attribute:"no-spin-buttons",type:Boolean})],O.prototype,"noSpinButtons",2),h([p({reflect:!0})],O.prototype,"form",2),h([p({type:Boolean,reflect:!0})],O.prototype,"required",2),h([p()],O.prototype,"pattern",2),h([p({type:Number})],O.prototype,"minlength",2),h([p({type:Number})],O.prototype,"maxlength",2),h([p()],O.prototype,"min",2),h([p()],O.prototype,"max",2),h([p()],O.prototype,"step",2),h([p()],O.prototype,"autocapitalize",2),h([p()],O.prototype,"autocorrect",2),h([p()],O.prototype,"autocomplete",2),h([p({type:Boolean})],O.prototype,"autofocus",2),h([p()],O.prototype,"enterkeyhint",2),h([p({type:Boolean,converter:{fromAttribute:e=>!(!e||e==="false"),toAttribute:e=>e?"true":"false"}})],O.prototype,"spellcheck",2),h([p()],O.prototype,"inputmode",2),h([J("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1),h([J("step",{waitUntilFirstUpdate:!0})],O.prototype,"handleStepChange",1),h([J("value",{waitUntilFirstUpdate:!0})],O.prototype,"handleValueChange",1),O.define("sl-input");var Gh=Object.defineProperty,Vh=Object.getOwnPropertyDescriptor,ve=(e,t,o,r)=>{for(var i=r>1?void 0:r?Vh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Gh(t,o,i),i};const Rn={schemas:"Schemas",responses:"Responses",parameters:"Parameters",requestBodies:"Request Bodies",headers:"Headers",securitySchemes:"Security Schemes",examples:"Examples",links:"Links",callbacks:"Callbacks"},Jh=["GET","POST","PUT","DELETE","PATCH","OPTIONS","HEAD","QUERY"];u.PpRefList=class extends Q{constructor(){super(...arguments),this.type="operations",this.heading="",this.items=[],this.filterValue="",this.searchTerm="",this.filteredItems=[],this.filterOptions=[],this.handleClear=()=>{clearTimeout(this.searchTimeout),this.searchTerm=""}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.searchTimeout)}willUpdate(t){if(t.has("items")&&this.type==="components"){const o=new Set(this.items.map(r=>r.componentType));this.filterOptions=[...o].sort()}(t.has("items")||t.has("filterValue")||t.has("searchTerm"))&&(this.filteredItems=this.computeFiltered())}computeFiltered(){const t=this.searchTerm.toLowerCase();if(this.type==="operations"){let o=this.items;return this.filterValue&&(o=o.filter(r=>r.method.toUpperCase()===this.filterValue)),t&&(o=o.filter(r=>r.path.toLowerCase().includes(t))),o}else{let o=this.items;return this.filterValue&&(o=o.filter(r=>r.componentType===this.filterValue)),t&&(o=o.filter(r=>r.name.toLowerCase().includes(t))),o}}handleSearch(t){clearTimeout(this.searchTimeout);const o=t.target.value;this.searchTimeout=window.setTimeout(()=>{this.searchTerm=o},150)}handleFilter(t){var r,i;const o=(i=(r=t.detail)==null?void 0:r.item)==null?void 0:i.value;this.filterValue=o??""}renderToolbar(){var o,r;const t=this.type==="operations"?this.filterValue||"ALL METHODS":((o=Rn[this.filterValue])==null?void 0:o.toUpperCase())||((r=this.filterValue)==null?void 0:r.toUpperCase())||"ALL TYPES";return d`
            <div class="toolbar">
                <sl-dropdown>
                    <sl-button slot="trigger" class="filter-btn" caret size="small">
                        ${this.type==="operations"&&this.filterValue?d`<pb33f-http-method method=${this.filterValue} tiny></pb33f-http-method>`:t}
                    </sl-button>
                    <sl-menu @sl-select=${this.handleFilter}>
                        <sl-menu-item value="">
                            ${this.type==="operations"?"ALL METHODS":"ALL TYPES"}
                        </sl-menu-item>
                        ${this.type==="operations"?Jh.map(i=>d`
                                <sl-menu-item value=${i}><pb33f-http-method method=${i}></pb33f-http-method></sl-menu-item>`):this.filterOptions.map(i=>d`
                                <sl-menu-item value=${i}>
                                    ${Rn[i]||i}
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
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">
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
        `}},u.PpRefList.styles=Hh,ve([p()],u.PpRefList.prototype,"type",2),ve([p()],u.PpRefList.prototype,"heading",2),ve([p({type:Array})],u.PpRefList.prototype,"items",2),ve([D()],u.PpRefList.prototype,"filterValue",2),ve([D()],u.PpRefList.prototype,"searchTerm",2),ve([D()],u.PpRefList.prototype,"filteredItems",2),ve([D()],u.PpRefList.prototype,"filterOptions",2),u.PpRefList=ve([X("pp-ref-list")],u.PpRefList);var Xh=Object.defineProperty,Kh=Object.getOwnPropertyDescriptor,ms=(e,t,o,r)=>{for(var i=r>1?void 0:r?Kh(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&Xh(t,o,i),i};u.PpCrossRefs=class extends Q{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var s,a,n;const{refs:t}=this,o=(((s=t.usedByOperations)==null?void 0:s.length)??0)>0,r=(((a=t.usedByModels)==null?void 0:a.length)??0)>0,i=(((n=t.usesModels)==null?void 0:n.length)??0)>0;return!o&&!r&&!i?y:d`
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
        `}},u.PpCrossRefs.styles=Bh,ms([p({attribute:"refs-json"})],u.PpCrossRefs.prototype,"refsJson",2),ms([D()],u.PpCrossRefs.prototype,"refs",2),u.PpCrossRefs=ms([X("pp-cross-refs")],u.PpCrossRefs);const qh=k`
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
`,tg=mt`
  
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

 
`,eg=k`
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
`;var og=Object.defineProperty,rg=Object.getOwnPropertyDescriptor,Yr=(e,t,o,r)=>{for(var i=r>1?void 0:r?rg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&og(t,o,i),i};uo.manual=!0,u.PpExampleBlock=class extends Q{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{const o=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(o,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return y;let t;try{t=uo.highlight(this.formatted,uo.languages.json,"json")}catch{t=this.formatted}return d`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${Ue(t)}</code></pre>
      </details>
    `}},u.PpExampleBlock.styles=[qh,tg,eg],Yr([p()],u.PpExampleBlock.prototype,"name",2),Yr([p({attribute:"example-json"})],u.PpExampleBlock.prototype,"exampleJson",2),Yr([D()],u.PpExampleBlock.prototype,"formatted",2),u.PpExampleBlock=Yr([X("pp-example-block")],u.PpExampleBlock);const ig=k`
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
`;var sg=Object.defineProperty,ag=Object.getOwnPropertyDescriptor,jt=(e,t,o,r)=>{for(var i=r>1?void 0:r?ag(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&sg(t,o,i),i};u.PpExampleDrawer=class extends Q{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.rawMode=!1,this.highlightLines="",this.startLine=1,this.location="",this.method="",this.path="",this.handleShowExample=t=>{const o=t.detail;if(this.title=o.title,this.json=o.json,this.yaml=o.yaml||"",this.rawMode=o.rawMode??!1,this.highlightLines=o.highlightLines||"",this.startLine=o.startLine??1,this.location=o.location||"",this.method=o.method||"",this.path=o.path||"",o.language)this.format=o.language;else{const r=document.body.getAttribute("data-spec-format");r==="yaml"&&o.yaml?this.format="yaml":r==="json"&&o.json?this.format="json":this.format=o.yaml?"yaml":"json"}this.updateComplete.then(()=>{const r=this.drawer;r&&(r.updateComplete?r.updateComplete.then(()=>r.show()):r.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get copyText(){var o;const t=(o=this.shadowRoot)==null?void 0:o.querySelector("pp-code-viewer");return t?t.displayCode:this.format==="yaml"&&this.yaml?this.yaml:this.json}renderHeader(){return this.method&&this.path?d`
        <div class="rich-header">
          <pb33f-http-method method=${this.method}></pb33f-http-method>
          <pb33f-render-operation-path path=${this.path} nowrap></pb33f-render-operation-path>
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
    `}},u.PpExampleDrawer.styles=[ig,Rr],jt([D()],u.PpExampleDrawer.prototype,"title",2),jt([D()],u.PpExampleDrawer.prototype,"json",2),jt([D()],u.PpExampleDrawer.prototype,"yaml",2),jt([D()],u.PpExampleDrawer.prototype,"format",2),jt([D()],u.PpExampleDrawer.prototype,"rawMode",2),jt([D()],u.PpExampleDrawer.prototype,"highlightLines",2),jt([D()],u.PpExampleDrawer.prototype,"startLine",2),jt([D()],u.PpExampleDrawer.prototype,"location",2),jt([D()],u.PpExampleDrawer.prototype,"method",2),jt([D()],u.PpExampleDrawer.prototype,"path",2),jt([B("sl-drawer")],u.PpExampleDrawer.prototype,"drawer",2),u.PpExampleDrawer=jt([X("pp-example-drawer")],u.PpExampleDrawer);const ng=k`
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
`;var lg=Object.defineProperty,cg=Object.getOwnPropertyDescriptor,Ft=(e,t,o,r)=>{for(var i=r>1?void 0:r?cg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&lg(t,o,i),i};u.PpRawViewerBtn=class extends Q{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml="",this.highlightLines="",this.startLine=1,this.location="",this.method="",this.path="",this.showTextLabel=!1}showRaw(){const t=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0,method:this.method||void 0,path:this.path||void 0}});document.dispatchEvent(t)}render(){return!this.rawJson&&!this.rawYaml?y:d`
            <sl-tooltip content="VIEW RAW OBJECT">
                <sl-button variant="text" size="small" @click=${this.showRaw}>
                    <sl-icon slot="prefix" name="braces" label="VIEW RAW OBJECT" ></sl-icon>
                </sl-button>
            </sl-tooltip>`}},u.PpRawViewerBtn.styles=[ng,Rr],Ft([p({attribute:"title"})],u.PpRawViewerBtn.prototype,"btnTitle",2),Ft([p({attribute:"raw-json"})],u.PpRawViewerBtn.prototype,"rawJson",2),Ft([p({attribute:"raw-yaml"})],u.PpRawViewerBtn.prototype,"rawYaml",2),Ft([p({attribute:"highlight-lines"})],u.PpRawViewerBtn.prototype,"highlightLines",2),Ft([p({attribute:"start-line",type:Number})],u.PpRawViewerBtn.prototype,"startLine",2),Ft([p()],u.PpRawViewerBtn.prototype,"location",2),Ft([p()],u.PpRawViewerBtn.prototype,"method",2),Ft([p()],u.PpRawViewerBtn.prototype,"path",2),Ft([p({type:Boolean})],u.PpRawViewerBtn.prototype,"showTextLabel",2),u.PpRawViewerBtn=Ft([X("pp-raw-viewer-btn")],u.PpRawViewerBtn);const dg=k`
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
`;var ug=Object.defineProperty,pg=Object.getOwnPropertyDescriptor,Be=(e,t,o,r)=>{for(var i=r>1?void 0:r?pg(t,o):t,s=e.length-1,a;s>=0;s--)(a=e[s])&&(i=(r?a(t,o,i):a(i))||i);return r&&i&&ug(t,o,i),i};const Un="pp-page-nav-collapsed",Yn="pp-page-nav-hidden";u.PpPageNav=class extends Q{constructor(){super(...arguments),this.pageTitle="",this.sectionsJson="",this.sections=[],this.collapsed=!1,this.navHidden=!1,this.activeId="",this.scrollContainer=null,this.rafId=0,this.scrollSpySuppressed=!1,this.suppressionTimerId=0,this.boundScrollHandler=()=>this.onScroll()}connectedCallback(){super.connectedCallback(),this.collapsed=localStorage.getItem(Un)==="true",this.navHidden=localStorage.getItem(Yn)==="true"}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.scrollContainer)==null||t.removeEventListener("scroll",this.boundScrollHandler),this.clearSuppressionTimer()}clearSuppressionTimer(){this.suppressionTimerId&&(window.clearTimeout(this.suppressionTimerId),this.suppressionTimerId=0)}updated(t){t.has("navHidden")&&this.toggleAttribute("nav-hidden",this.navHidden)}willUpdate(t){if(t.has("sectionsJson")&&this.sectionsJson){try{this.sections=JSON.parse(this.sectionsJson)}catch{this.sections=[]}this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}}loadResponseChildren(){var r;const t=this.sections.find(i=>i.id==="section-responses");if(!t)return;const o=()=>{const i=document.getElementById("section-responses");i&&typeof i.getResponseNavItems=="function"&&(t.children=i.getResponseNavItems(),this.requestUpdate())};o(),(r=t.children)!=null&&r.length||customElements.whenDefined("pp-operation-responses").then(()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>o())})})}setupScrollSpy(){var o;const t=document.querySelector("pp-layout");this.scrollContainer=((o=t==null?void 0:t.shadowRoot)==null?void 0:o.querySelector(".content-panel"))||null,this.scrollContainer&&this.scrollContainer.addEventListener("scroll",this.boundScrollHandler,{passive:!0})}suppressScrollSpy(){this.scrollSpySuppressed=!0,this.clearSuppressionTimer()}scheduleScrollSpyResume(){this.clearSuppressionTimer(),this.suppressionTimerId=window.setTimeout(()=>{this.scrollSpySuppressed=!1,this.suppressionTimerId=0},150)}onScroll(){if(this.scrollSpySuppressed){this.scheduleScrollSpyResume();return}this.rafId||(this.rafId=requestAnimationFrame(()=>{this.rafId=0,this.updateActiveSection()}))}updateActiveSection(){let o="";for(const r of this.sections){const i=this.findElement(r.id);if(i&&i.getBoundingClientRect().top<=100&&(o=r.id),r.children)for(const s of r.children){const a=this.findElement(s.id);a&&a.getBoundingClientRect().top<=100&&(o=s.id)}}o&&o!==this.activeId&&(this.activeId=o)}findElement(t){const o=document.getElementById(t);if(o)return o;const r=document.getElementById("section-responses");return r!=null&&r.shadowRoot?r.shadowRoot.getElementById(t):null}navigateTo(t){this.suppressScrollSpy(),this.activeId=t;const o=this.findElement(t);if(!o)return;const r=o.closest("sl-details");r&&!r.open?(r.addEventListener("sl-after-show",()=>{o.scrollIntoView({behavior:"auto",block:"center"})},{once:!0}),r.open=!0):o.scrollIntoView({behavior:"auto",block:"center"})}toggleCollapsed(){this.collapsed=!this.collapsed,localStorage.setItem(Un,String(this.collapsed))}toggleNavHidden(){var r,i;const t=(r=this.shadowRoot)==null?void 0:r.querySelector(".collapse-tab");t&&(t.addEventListener("animationend",()=>t.classList.remove("flashing"),{once:!0}),t.classList.add("flashing"));const o=(i=this.shadowRoot)==null?void 0:i.querySelector(".nav-container");!this.navHidden&&o?o.style.height=o.offsetHeight+"px":this.navHidden&&o&&(o.style.height=""),this.navHidden=!this.navHidden,localStorage.setItem(Yn,String(this.navHidden))}handleTabKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.toggleNavHidden())}statusColorClass(t){const o=t.substring(0,1);return o==="2"?"status-2xx":o==="3"?"status-3xx":o==="4"?"status-4xx":o==="5"?"status-5xx":""}render(){return d`
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
        `}},u.PpPageNav.styles=[dg],Be([p({attribute:"page-title"})],u.PpPageNav.prototype,"pageTitle",2),Be([p({attribute:"sections-json"})],u.PpPageNav.prototype,"sectionsJson",2),Be([D()],u.PpPageNav.prototype,"sections",2),Be([D()],u.PpPageNav.prototype,"collapsed",2),Be([D()],u.PpPageNav.prototype,"navHidden",2),Be([D()],u.PpPageNav.prototype,"activeId",2),u.PpPageNav=Be([X("pp-page-nav")],u.PpPageNav),ri("static/shoelace");const hg={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',braces:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/></svg>',envelope:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>',"question-diamond":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/> <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>',cookie:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/> <path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/></svg>',signpost:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M12.532 5l1.666 2-1.666 2H2V5z"/></svg>',"shield-lock":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/> <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/></svg>',"person-lock":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/></svg>',key:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/> <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/> <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/> <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/> <path d="M3.902 4.222a5 5 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 4 4 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556m6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705M3.68 5.842a.5.5 0 0 1 .422.568q-.044.289-.044.59c0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.5 6.5 0 0 0 3.058 7q0-.375.054-.736a.5.5 0 0 1 .568-.422m8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.5 10.5 0 0 0 .584-2.678.5.5 0 0 1 .54-.456"/> <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865m-.89 1.257a.5.5 0 0 1 .04.706A5.48 5.48 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346m12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49"/></svg>',"x-lg":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>',"hdd-network":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"/></svg>',"box-arrow-up-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>',box:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>',"box-arrow-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/> <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>',"braces-asterisk":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z"/></svg>',"box-arrow-in-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/> <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/></svg>',"telephone-outbound":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"/></svg>',geo:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/></svg>',"chat-left-quote":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/></svg>',"arrow-clockwise":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>',"gear-wide-connected":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/></svg>',"chevron-double-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/> <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>',"chevron-double-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/> <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/></svg>'};return wl("default",{resolver:e=>{const t=hg[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}),u})({});
