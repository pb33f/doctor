var PrintingPress=(function(p){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var In,Cn;const zo=globalThis,Dr=zo.ShadowRoot&&(zo.ShadyCSS===void 0||zo.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Tr=Symbol(),li=new WeakMap;let ci=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==Tr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(Dr&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=li.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&li.set(o,t))}return t}toString(){return this.cssText}};const Sn=e=>new ci(typeof e=="string"?e:e+"",void 0,Tr),z=(e,...t)=>{const o=e.length===1?e[0]:t.reduce((r,s,i)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new ci(o,e,Tr)},Dn=(e,t)=>{if(Dr)e.adoptedStyleSheets=t.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of t){const r=document.createElement("style"),s=zo.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=o.cssText,e.appendChild(r)}},di=Dr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return Sn(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Tn,defineProperty:En,getOwnPropertyDescriptor:zn,getOwnPropertyNames:kn,getOwnPropertySymbols:$n,getPrototypeOf:On}=Object,Gt=globalThis,ui=Gt.trustedTypes,_n=ui?ui.emptyScript:"",Er=Gt.reactiveElementPolyfillSupport,Xe=(e,t)=>e,ko={toAttribute(e,t){switch(t){case Boolean:e=e?_n:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},zr=(e,t)=>!Tn(e,t),pi={attribute:!0,type:String,converter:ko,reflect:!1,useDefault:!1,hasChanged:zr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Gt.litPropertyMetadata??(Gt.litPropertyMetadata=new WeakMap);let Ee=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=pi){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,o);s!==void 0&&En(this.prototype,t,s)}}static getPropertyDescriptor(t,o,r){const{get:s,set:i}=zn(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:s,set(a){const n=s==null?void 0:s.call(this);i==null||i.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??pi}static _$Ei(){if(this.hasOwnProperty(Xe("elementProperties")))return;const t=On(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Xe("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Xe("properties"))){const o=this.properties,r=[...kn(o),...$n(o)];for(const s of r)this.createProperty(s,o[s])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,s]of o)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const s=this._$Eu(o,r);s!==void 0&&this._$Eh.set(s,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)o.unshift(di(s))}else t!==void 0&&o.push(di(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(o=>this.enableUpdating=o),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(o=>o(this))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Dn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)})}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var i;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const a=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:ko).toAttribute(o,r.type);this._$Em=t,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,o){var i,a;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=r.getPropertyOptions(s),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((i=n.converter)==null?void 0:i.fromAttribute)!==void 0?n.converter:ko;this._$Em=s;const c=l.fromAttribute(o,n.type);this[s]=c??((a=this._$Ej)==null?void 0:a.get(s))??c,this._$Em=null}}requestUpdate(t,o,r,s=!1,i){var a;if(t!==void 0){const n=this.constructor;if(s===!1&&(i=this[t]),r??(r=n.getPropertyOptions(t)),!((r.hasChanged??zr)(i,o)||r.useDefault&&r.reflect&&i===((a=this._$Ej)==null?void 0:a.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:s,wrapped:i},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:n}=a,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,a,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach(s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)}),this.update(o)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(o=>this._$ET(o,this[o]))),this._$EM()}updated(t){}firstUpdated(t){}};Ee.elementStyles=[],Ee.shadowRootOptions={mode:"open"},Ee[Xe("elementProperties")]=new Map,Ee[Xe("finalized")]=new Map,Er==null||Er({ReactiveElement:Ee}),(Gt.reactiveElementVersions??(Gt.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ke=globalThis,hi=e=>e,$o=Ke.trustedTypes,gi=$o?$o.createPolicy("lit-html",{createHTML:e=>e}):void 0,mi="$lit$",Jt=`lit$${Math.random().toFixed(9).slice(2)}$`,fi="?"+Jt,Pn=`<${fi}>`,ue=document,qe=()=>ue.createComment(""),to=e=>e===null||typeof e!="object"&&typeof e!="function",kr=Array.isArray,Rn=e=>kr(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",$r=`[ 	
\f\r]`,eo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bi=/-->/g,yi=/>/g,pe=RegExp(`>|${$r}(?:([^\\s"'>=/]+)(${$r}*=${$r}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vi=/'/g,Mi=/"/g,wi=/^(?:script|style|textarea|title)$/i,Un=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),d=Un(1),Vt=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Li=new WeakMap,he=ue.createTreeWalker(ue,129);function xi(e,t){if(!kr(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return gi!==void 0?gi.createHTML(t):t}const Yn=(e,t)=>{const o=e.length-1,r=[];let s,i=t===2?"<svg>":t===3?"<math>":"",a=eo;for(let n=0;n<o;n++){const l=e[n];let c,u,h=-1,M=0;for(;M<l.length&&(a.lastIndex=M,u=a.exec(l),u!==null);)M=a.lastIndex,a===eo?u[1]==="!--"?a=bi:u[1]!==void 0?a=yi:u[2]!==void 0?(wi.test(u[2])&&(s=RegExp("</"+u[2],"g")),a=pe):u[3]!==void 0&&(a=pe):a===pe?u[0]===">"?(a=s??eo,h=-1):u[1]===void 0?h=-2:(h=a.lastIndex-u[2].length,c=u[1],a=u[3]===void 0?pe:u[3]==='"'?Mi:vi):a===Mi||a===vi?a=pe:a===bi||a===yi?a=eo:(a=pe,s=void 0);const y=a===pe&&e[n+1].startsWith("/>")?" ":"";i+=a===eo?l+Pn:h>=0?(r.push(c),l.slice(0,h)+mi+l.slice(h)+Jt+y):l+Jt+(h===-2?n:y)}return[xi(e,i+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let Or=class jn{constructor({strings:t,_$litType$:o},r){let s;this.parts=[];let i=0,a=0;const n=t.length-1,l=this.parts,[c,u]=Yn(t,o);if(this.el=jn.createElement(c,r),he.currentNode=this.el.content,o===2||o===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=he.nextNode())!==null&&l.length<n;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(mi)){const M=u[a++],y=s.getAttribute(h).split(Jt),w=/([.?@])?(.*)/.exec(M);l.push({type:1,index:i,name:w[2],strings:y,ctor:w[1]==="."?Hn:w[1]==="?"?Qn:w[1]==="@"?Zn:Oo}),s.removeAttribute(h)}else h.startsWith(Jt)&&(l.push({type:6,index:i}),s.removeAttribute(h));if(wi.test(s.tagName)){const h=s.textContent.split(Jt),M=h.length-1;if(M>0){s.textContent=$o?$o.emptyScript:"";for(let y=0;y<M;y++)s.append(h[y],qe()),he.nextNode(),l.push({type:2,index:++i});s.append(h[M],qe())}}}else if(s.nodeType===8)if(s.data===fi)l.push({type:2,index:i});else{let h=-1;for(;(h=s.data.indexOf(Jt,h+1))!==-1;)l.push({type:7,index:i}),h+=Jt.length-1}i++}}static createElement(t,o){const r=ue.createElement("template");return r.innerHTML=t,r}};function ze(e,t,o=e,r){var a,n;if(t===Vt)return t;let s=r!==void 0?(a=o._$Co)==null?void 0:a[r]:o._$Cl;const i=to(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((n=s==null?void 0:s._$AO)==null||n.call(s,!1),i===void 0?s=void 0:(s=new i(e),s._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=s:o._$Cl=s),s!==void 0&&(t=ze(e,s._$AS(e,t.values),s,r)),t}let Bn=class{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??ue).importNode(o,!0);he.currentNode=s;let i=he.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new _r(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new Wn(i,this,t)),this._$AV.push(c),l=r[++n]}a!==(l==null?void 0:l.index)&&(i=he.nextNode(),a++)}return he.currentNode=ue,s}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}},_r=class Nn{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,s){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=ze(this,t,o),to(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==Vt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Rn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&to(this._$AH)?this._$AA.nextSibling.data=t:this.T(ue.createTextNode(t)),this._$AH=t}$(t){var i;const{values:o,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Or.createElement(xi(r.h,r.h[0]),this.options)),r);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(o);else{const a=new Bn(s,this),n=a.u(this.options);a.p(o),this.T(n),this._$AH=a}}_$AC(t){let o=Li.get(t.strings);return o===void 0&&Li.set(t.strings,o=new Or(t)),o}k(t){kr(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,s=0;for(const i of t)s===o.length?o.push(r=new Nn(this.O(qe()),this.O(qe()),this,this.options)):r=o[s],r._$AI(i),s++;s<o.length&&(this._$AR(r&&r._$AB.nextSibling,s),o.length=s)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const s=hi(t).nextSibling;hi(t).remove(),t=s}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}},Oo=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,s,i){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=o,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=v}_$AI(t,o=this,r,s){const i=this.strings;let a=!1;if(i===void 0)t=ze(this,t,o,0),a=!to(t)||t!==this._$AH&&t!==Vt,a&&(this._$AH=t);else{const n=t;let l,c;for(t=i[0],l=0;l<i.length-1;l++)c=ze(this,n[r+l],o,l),c===Vt&&(c=this._$AH[l]),a||(a=!to(c)||c!==this._$AH[l]),c===v?t=v:t!==v&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}a&&!s&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Hn=class extends Oo{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}},Qn=class extends Oo{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}},Zn=class extends Oo{constructor(t,o,r,s,i){super(t,o,r,s,i),this.type=5}_$AI(t,o=this){if((t=ze(this,t,o,0)??v)===Vt)return;const r=this._$AH,s=t===v&&r!==v||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==v&&(r===v||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}};class Wn{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){ze(this,t)}}const Pr=Ke.litHtmlPolyfillSupport;Pr==null||Pr(Or,_r),(Ke.litHtmlVersions??(Ke.litHtmlVersions=[])).push("3.3.2");const Fn=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const i=(o==null?void 0:o.renderBefore)??null;r._$litPart$=s=new _r(t.insertBefore(qe(),i),i,void 0,o??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ge=globalThis;let H=class extends Ee{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Fn(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Vt}};H._$litElement$=!0,H.finalized=!0,(In=ge.litElementHydrateSupport)==null||In.call(ge,{LitElement:H});const Rr=ge.litElementPolyfillSupport;Rr==null||Rr({LitElement:H}),(ge.litElementVersions??(ge.litElementVersions=[])).push("4.2.2");var Gn=z`
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
`,Jn=z`
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
`,Ur="";function Yr(e){Ur=e}function Vn(e=""){if(!Ur){const t=[...document.getElementsByTagName("script")],o=t.find(r=>r.hasAttribute("data-shoelace"));if(o)Yr(o.getAttribute("data-shoelace"));else{const r=t.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let s="";r&&(s=r.getAttribute("src")),Yr(s.split("/").slice(0,-1).join("/"))}}return Ur.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")}var Xn={name:"default",resolver:e=>Vn(`assets/icons/${e}.svg`)},Kn=Xn,Ii={caret:`
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
  `},qn={name:"system",resolver:e=>e in Ii?`data:image/svg+xml,${encodeURIComponent(Ii[e])}`:""},tl=qn,_o=[Kn,tl],Po=[];function el(e){Po.push(e)}function ol(e){Po=Po.filter(t=>t!==e)}function Ci(e){return _o.find(t=>t.name===e)}function rl(e,t){sl(e),_o.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),Po.forEach(o=>{o.library===e&&o.setIcon()})}function sl(e){_o=_o.filter(t=>t.name!==e)}var il=z`
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
`,Ai=Object.defineProperty,al=Object.defineProperties,nl=Object.getOwnPropertyDescriptor,ll=Object.getOwnPropertyDescriptors,ji=Object.getOwnPropertySymbols,cl=Object.prototype.hasOwnProperty,dl=Object.prototype.propertyIsEnumerable,Br=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),Hr=e=>{throw TypeError(e)},Ni=(e,t,o)=>t in e?Ai(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,Bt=(e,t)=>{for(var o in t||(t={}))cl.call(t,o)&&Ni(e,o,t[o]);if(ji)for(var o of ji(t))dl.call(t,o)&&Ni(e,o,t[o]);return e},oo=(e,t)=>al(e,ll(t)),m=(e,t,o,r)=>{for(var s=r>1?void 0:r?nl(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Ai(t,o,s),s},Si=(e,t,o)=>t.has(e)||Hr("Cannot "+o),ul=(e,t,o)=>(Si(e,t,"read from private field"),t.get(e)),pl=(e,t,o)=>t.has(e)?Hr("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),hl=(e,t,o,r)=>(Si(e,t,"write to private field"),t.set(e,o),o),gl=function(e,t){this[0]=e,this[1]=t},ml=e=>{var t=e[Br("asyncIterator")],o=!1,r,s={};return t==null?(t=e[Br("iterator")](),r=i=>s[i]=a=>t[i](a)):(t=t.call(e),r=i=>s[i]=a=>{if(o){if(o=!1,i==="throw")throw a;return a}return o=!0,{done:!1,value:new gl(new Promise(n=>{var l=t[i](a);l instanceof Object||Hr("Object expected"),n(l)}),1)}}),s[Br("iterator")]=()=>s,r("next"),"throw"in t?r("throw"):s.throw=i=>{throw i},"return"in t&&r("return"),s};function V(e,t){const o=Bt({waitUntilFirstUpdate:!1},t);return(r,s)=>{const{update:i}=r,a=Array.isArray(e)?e:[e];r.update=function(n){a.forEach(l=>{const c=l;if(n.has(c)){const u=n.get(c),h=this[c];u!==h&&(!o.waitUntilFirstUpdate||this.hasUpdated)&&this[s](u,h)}}),i.call(this,n)}}}var ot=z`
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
 */const G=e=>(t,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fl={attribute:!0,type:String,converter:ko,reflect:!1,hasChanged:zr},bl=(e=fl,t,o)=>{const{kind:r,metadata:s}=o;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(o.name,e),r==="accessor"){const{name:a}=o;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,e,!0,n)},init(n){return n!==void 0&&this.C(a,void 0,e,n),n}}}if(r==="setter"){const{name:a}=o;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,e,!0,n)}}throw Error("Unsupported decorator location: "+r)};function g(e){return(t,o)=>typeof o=="object"?bl(e,t,o):((r,s,i)=>{const a=s.hasOwnProperty(i);return s.constructor.createProperty(i,r),a?Object.getOwnPropertyDescriptor(s,i):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(e){return g({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function yl(e){return(t,o)=>{const r=typeof t=="function"?t:t[o];Object.assign(r,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vl=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function R(e,t){return(o,r,s)=>{const i=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(e))??null};return vl(o,r,{get(){return i(this)}})}}var Ro,X=class extends H{constructor(){super(),pl(this,Ro,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,o])=>{this.constructor.define(t,o)})}emit(t,o){const r=new CustomEvent(t,Bt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},o));return this.dispatchEvent(r),r}static define(t,o=this,r={}){const s=customElements.get(t);if(!s){try{customElements.define(t,o,r)}catch{customElements.define(t,class extends o{},r)}return}let i=" (unknown version)",a=i;"version"in o&&o.version&&(i=" v"+o.version),"version"in s&&s.version&&(a=" v"+s.version),!(i&&a&&i===a)&&console.warn(`Attempted to register <${t}>${i}, but <${t}>${a} has already been registered.`)}attributeChangedCallback(t,o,r){ul(this,Ro)||(this.constructor.elementProperties.forEach((s,i)=>{s.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),hl(this,Ro,!0)),super.attributeChangedCallback(t,o,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((o,r)=>{t.has(r)&&this[r]==null&&(this[r]=o)})}};Ro=new WeakMap,X.version="2.20.1",X.dependencies={},m([g()],X.prototype,"dir",2),m([g()],X.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ml=(e,t)=>(e==null?void 0:e._$litType$)!==void 0,wl=e=>e.strings===void 0;var ro=Symbol(),Uo=Symbol(),Qr,Zr=new Map,ut=class extends X{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(e,t){var o;let r;if(t!=null&&t.spriteSheet)return this.svg=d`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(r=await fetch(e,{mode:"cors"}),!r.ok)return r.status===410?ro:Uo}catch{return Uo}try{const s=document.createElement("div");s.innerHTML=await r.text();const i=s.firstElementChild;if(((o=i==null?void 0:i.tagName)==null?void 0:o.toLowerCase())!=="svg")return ro;Qr||(Qr=new DOMParser);const n=Qr.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return n?(n.part.add("svg"),document.adoptNode(n)):ro}catch{return ro}}connectedCallback(){super.connectedCallback(),el(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),ol(this)}getIconSource(){const e=Ci(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;const{url:t,fromLibrary:o}=this.getIconSource(),r=o?Ci(this.library):void 0;if(!t){this.svg=null;return}let s=Zr.get(t);if(s||(s=this.resolveIcon(t,r),Zr.set(t,s)),!this.initialRender)return;const i=await s;if(i===Uo&&Zr.delete(t),t===this.getIconSource().url){if(Ml(i)){if(this.svg=i,r){await this.updateComplete;const a=this.shadowRoot.querySelector("[part='svg']");typeof r.mutator=="function"&&a&&r.mutator(a)}return}switch(i){case Uo:case ro:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(e=r==null?void 0:r.mutator)==null||e.call(r,this.svg),this.emit("sl-load")}}}render(){return this.svg}};ut.styles=[ot,il],m([T()],ut.prototype,"svg",2),m([g({reflect:!0})],ut.prototype,"name",2),m([g()],ut.prototype,"src",2),m([g()],ut.prototype,"label",2),m([g({reflect:!0})],ut.prototype,"library",2),m([V("label")],ut.prototype,"handleLabelChange",1),m([V(["name","src","library"])],ut.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wr={ATTRIBUTE:1,CHILD:2},Fr=e=>(...t)=>({_$litDirective$:e,values:t});let Gr=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct=Fr(class extends Gr{constructor(e){var t;if(super(e),e.type!==Wr.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,s;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in t)t[i]&&!((r=this.nt)!=null&&r.has(i))&&this.st.add(i);return this.render(t)}const o=e.element.classList;for(const i of this.st)i in t||(o.remove(i),this.st.delete(i));for(const i in t){const a=!!t[i];a===this.st.has(i)||(s=this.nt)!=null&&s.has(i)||(a?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return Vt}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jr=Symbol.for(""),Ll=e=>{if((e==null?void 0:e.r)===Jr)return e==null?void 0:e._$litStatic$},xl=e=>({_$litStatic$:e,r:Jr}),Yo=(e,...t)=>({_$litStatic$:t.reduce((o,r,s)=>o+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(r)+e[s+1],e[0]),r:Jr}),Di=new Map,Il=e=>(t,...o)=>{const r=o.length;let s,i;const a=[],n=[];let l,c=0,u=!1;for(;c<r;){for(l=t[c];c<r&&(i=o[c],(s=Ll(i))!==void 0);)l+=s+t[++c],u=!0;c!==r&&n.push(i),a.push(l),c++}if(c===r&&a.push(t[r]),u){const h=a.join("$$lit$$");(t=Di.get(h))===void 0&&(a.raw=a,Di.set(h,t=a)),o=n}return e(t,...o)},so=Il(d);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const J=e=>e??v;var it=class extends X{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){const e=!!this.href,t=e?Yo`a`:Yo`button`;return so`
      <${t}
        part="base"
        class=${ct({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${J(e?void 0:this.disabled)}
        type=${J(e?void 0:"button")}
        href=${J(e?this.href:void 0)}
        target=${J(e?this.target:void 0)}
        download=${J(e?this.download:void 0)}
        rel=${J(e&&this.target?"noreferrer noopener":void 0)}
        role=${J(e?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${J(this.name)}
          library=${J(this.library)}
          src=${J(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};it.styles=[ot,Jn],it.dependencies={"sl-icon":ut},m([R(".icon-button")],it.prototype,"button",2),m([T()],it.prototype,"hasFocus",2),m([g()],it.prototype,"name",2),m([g()],it.prototype,"library",2),m([g()],it.prototype,"src",2),m([g()],it.prototype,"href",2),m([g()],it.prototype,"target",2),m([g()],it.prototype,"download",2),m([g()],it.prototype,"label",2),m([g({type:Boolean,reflect:!0})],it.prototype,"disabled",2);const Vr=new Set,ke=new Map;let me,Xr="ltr",Kr="en";const Ti=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Ti){const e=new MutationObserver(zi);Xr=document.documentElement.dir||"ltr",Kr=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Ei(...e){e.map(t=>{const o=t.$code.toLowerCase();ke.has(o)?ke.set(o,Object.assign(Object.assign({},ke.get(o)),t)):ke.set(o,t),me||(me=t)}),zi()}function zi(){Ti&&(Xr=document.documentElement.dir||"ltr",Kr=document.documentElement.lang||navigator.language),[...Vr.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let Cl=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Vr.add(this.host)}hostDisconnected(){Vr.delete(this.host)}dir(){return`${this.host.dir||Xr}`.toLowerCase()}lang(){return`${this.host.lang||Kr}`.toLowerCase()}getTranslationData(t){var o,r;const s=new Intl.Locale(t.replace(/_/g,"-")),i=s==null?void 0:s.language.toLowerCase(),a=(r=(o=s==null?void 0:s.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",n=ke.get(`${i}-${a}`),l=ke.get(i);return{locale:s,language:i,region:a,primary:n,secondary:l}}exists(t,o){var r;const{primary:s,secondary:i}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(s&&s[t]||i&&i[t]||o.includeFallback&&me&&me[t])}term(t,...o){const{primary:r,secondary:s}=this.getTranslationData(this.lang());let i;if(r&&r[t])i=r[t];else if(s&&s[t])i=s[t];else if(me&&me[t])i=me[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof i=="function"?i(...o):i}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var ki={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};Ei(ki);var Al=ki,pt=class extends Cl{};Ei(Al);var fe=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return d`
      <span
        part="base"
        class=${ct({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
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
    `}};fe.styles=[ot,Gn],fe.dependencies={"sl-icon-button":it},m([g({reflect:!0})],fe.prototype,"variant",2),m([g({reflect:!0})],fe.prototype,"size",2),m([g({type:Boolean,reflect:!0})],fe.prototype,"pill",2),m([g({type:Boolean})],fe.prototype,"removable",2),fe.define("sl-tag"),it.define("sl-icon-button");var jl=z`
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
`,Nl=z`
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
`;const Xt=Math.min,ht=Math.max,Bo=Math.round,Ho=Math.floor,zt=e=>({x:e,y:e}),Sl={left:"right",right:"left",bottom:"top",top:"bottom"};function qr(e,t,o){return ht(e,Xt(t,o))}function $e(e,t){return typeof e=="function"?e(t):e}function Kt(e){return e.split("-")[0]}function Oe(e){return e.split("-")[1]}function $i(e){return e==="x"?"y":"x"}function ts(e){return e==="y"?"height":"width"}function Ht(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function es(e){return $i(Ht(e))}function Dl(e,t,o){o===void 0&&(o=!1);const r=Oe(e),s=es(e),i=ts(s);let a=s==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(a=Qo(a)),[a,Qo(a)]}function Tl(e){const t=Qo(e);return[os(e),t,os(t)]}function os(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const Oi=["left","right"],_i=["right","left"],El=["top","bottom"],zl=["bottom","top"];function kl(e,t,o){switch(e){case"top":case"bottom":return o?t?_i:Oi:t?Oi:_i;case"left":case"right":return t?El:zl;default:return[]}}function $l(e,t,o,r){const s=Oe(e);let i=kl(Kt(e),o==="start",r);return s&&(i=i.map(a=>a+"-"+s),t&&(i=i.concat(i.map(os)))),i}function Qo(e){const t=Kt(e);return Sl[t]+e.slice(t.length)}function Ol(e){return{top:0,right:0,bottom:0,left:0,...e}}function Pi(e){return typeof e!="number"?Ol(e):{top:e,right:e,bottom:e,left:e}}function Zo(e){const{x:t,y:o,width:r,height:s}=e;return{width:r,height:s,top:o,left:t,right:t+r,bottom:o+s,x:t,y:o}}function Ri(e,t,o){let{reference:r,floating:s}=e;const i=Ht(t),a=es(t),n=ts(a),l=Kt(t),c=i==="y",u=r.x+r.width/2-s.width/2,h=r.y+r.height/2-s.height/2,M=r[n]/2-s[n]/2;let y;switch(l){case"top":y={x:u,y:r.y-s.height};break;case"bottom":y={x:u,y:r.y+r.height};break;case"right":y={x:r.x+r.width,y:h};break;case"left":y={x:r.x-s.width,y:h};break;default:y={x:r.x,y:r.y}}switch(Oe(t)){case"start":y[a]-=M*(o&&c?-1:1);break;case"end":y[a]+=M*(o&&c?-1:1);break}return y}async function _l(e,t){var o;t===void 0&&(t={});const{x:r,y:s,platform:i,rects:a,elements:n,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:h="floating",altBoundary:M=!1,padding:y=0}=$e(t,e),w=Pi(y),j=n[M?h==="floating"?"reference":"floating":h],A=Zo(await i.getClippingRect({element:(o=await(i.isElement==null?void 0:i.isElement(j)))==null||o?j:j.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(n.floating)),boundary:c,rootBoundary:u,strategy:l})),b=h==="floating"?{x:r,y:s,width:a.floating.width,height:a.floating.height}:a.reference,f=await(i.getOffsetParent==null?void 0:i.getOffsetParent(n.floating)),L=await(i.isElement==null?void 0:i.isElement(f))?await(i.getScale==null?void 0:i.getScale(f))||{x:1,y:1}:{x:1,y:1},I=Zo(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:b,offsetParent:f,strategy:l}):b);return{top:(A.top-I.top+w.top)/L.y,bottom:(I.bottom-A.bottom+w.bottom)/L.y,left:(A.left-I.left+w.left)/L.x,right:(I.right-A.right+w.right)/L.x}}const Pl=50,Rl=async(e,t,o)=>{const{placement:r="bottom",strategy:s="absolute",middleware:i=[],platform:a}=o,n=a.detectOverflow?a:{...a,detectOverflow:_l},l=await(a.isRTL==null?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:s}),{x:u,y:h}=Ri(c,r,l),M=r,y=0;const w={};for(let C=0;C<i.length;C++){const j=i[C];if(!j)continue;const{name:A,fn:b}=j,{x:f,y:L,data:I,reset:x}=await b({x:u,y:h,initialPlacement:r,placement:M,strategy:s,middlewareData:w,rects:c,platform:n,elements:{reference:e,floating:t}});u=f??u,h=L??h,w[A]={...w[A],...I},x&&y<Pl&&(y++,typeof x=="object"&&(x.placement&&(M=x.placement),x.rects&&(c=x.rects===!0?await a.getElementRects({reference:e,floating:t,strategy:s}):x.rects),{x:u,y:h}=Ri(c,M,l)),C=-1)}return{x:u,y:h,placement:M,strategy:s,middlewareData:w}},Ul=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:s,rects:i,platform:a,elements:n,middlewareData:l}=t,{element:c,padding:u=0}=$e(e,t)||{};if(c==null)return{};const h=Pi(u),M={x:o,y:r},y=es(s),w=ts(y),C=await a.getDimensions(c),j=y==="y",A=j?"top":"left",b=j?"bottom":"right",f=j?"clientHeight":"clientWidth",L=i.reference[w]+i.reference[y]-M[y]-i.floating[w],I=M[y]-i.reference[y],x=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let N=x?x[f]:0;(!N||!await(a.isElement==null?void 0:a.isElement(x)))&&(N=n.floating[f]||i.floating[w]);const E=L/2-I/2,S=N/2-C[w]/2-1,k=Xt(h[A],S),_=Xt(h[b],S),U=k,tt=N-C[w]-_,P=N/2-C[w]/2+E,lt=qr(U,P,tt),K=!l.arrow&&Oe(s)!=null&&P!==lt&&i.reference[w]/2-(P<U?k:_)-C[w]/2<0,F=K?P<U?P-U:P-tt:0;return{[y]:M[y]+F,data:{[y]:lt,centerOffset:P-lt-F,...K&&{alignmentOffset:F}},reset:K}}}),Yl=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:s,middlewareData:i,rects:a,initialPlacement:n,platform:l,elements:c}=t,{mainAxis:u=!0,crossAxis:h=!0,fallbackPlacements:M,fallbackStrategy:y="bestFit",fallbackAxisSideDirection:w="none",flipAlignment:C=!0,...j}=$e(e,t);if((o=i.arrow)!=null&&o.alignmentOffset)return{};const A=Kt(s),b=Ht(n),f=Kt(n)===n,L=await(l.isRTL==null?void 0:l.isRTL(c.floating)),I=M||(f||!C?[Qo(n)]:Tl(n)),x=w!=="none";!M&&x&&I.push(...$l(n,C,w,L));const N=[n,...I],E=await l.detectOverflow(t,j),S=[];let k=((r=i.flip)==null?void 0:r.overflows)||[];if(u&&S.push(E[A]),h){const P=Dl(s,a,L);S.push(E[P[0]],E[P[1]])}if(k=[...k,{placement:s,overflows:S}],!S.every(P=>P<=0)){var _,U;const P=(((_=i.flip)==null?void 0:_.index)||0)+1,lt=N[P];if(lt&&(!(h==="alignment"?b!==Ht(lt):!1)||k.every(O=>Ht(O.placement)===b?O.overflows[0]>0:!0)))return{data:{index:P,overflows:k},reset:{placement:lt}};let K=(U=k.filter(F=>F.overflows[0]<=0).sort((F,O)=>F.overflows[1]-O.overflows[1])[0])==null?void 0:U.placement;if(!K)switch(y){case"bestFit":{var tt;const F=(tt=k.filter(O=>{if(x){const Q=Ht(O.placement);return Q===b||Q==="y"}return!0}).map(O=>[O.placement,O.overflows.filter(Q=>Q>0).reduce((Q,Yt)=>Q+Yt,0)]).sort((O,Q)=>O[1]-Q[1])[0])==null?void 0:tt[0];F&&(K=F);break}case"initialPlacement":K=n;break}if(s!==K)return{reset:{placement:K}}}return{}}}},Bl=new Set(["left","top"]);async function Hl(e,t){const{placement:o,platform:r,elements:s}=e,i=await(r.isRTL==null?void 0:r.isRTL(s.floating)),a=Kt(o),n=Oe(o),l=Ht(o)==="y",c=Bl.has(a)?-1:1,u=i&&l?-1:1,h=$e(t,e);let{mainAxis:M,crossAxis:y,alignmentAxis:w}=typeof h=="number"?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:h.mainAxis||0,crossAxis:h.crossAxis||0,alignmentAxis:h.alignmentAxis};return n&&typeof w=="number"&&(y=n==="end"?w*-1:w),l?{x:y*u,y:M*c}:{x:M*c,y:y*u}}const Ql=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:s,y:i,placement:a,middlewareData:n}=t,l=await Hl(t,e);return a===((o=n.offset)==null?void 0:o.placement)&&(r=n.arrow)!=null&&r.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:a}}}}},Zl=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:s,platform:i}=t,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:A=>{let{x:b,y:f}=A;return{x:b,y:f}}},...c}=$e(e,t),u={x:o,y:r},h=await i.detectOverflow(t,c),M=Ht(Kt(s)),y=$i(M);let w=u[y],C=u[M];if(a){const A=y==="y"?"top":"left",b=y==="y"?"bottom":"right",f=w+h[A],L=w-h[b];w=qr(f,w,L)}if(n){const A=M==="y"?"top":"left",b=M==="y"?"bottom":"right",f=C+h[A],L=C-h[b];C=qr(f,C,L)}const j=l.fn({...t,[y]:w,[M]:C});return{...j,data:{x:j.x-o,y:j.y-r,enabled:{[y]:a,[M]:n}}}}}},Wl=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:s,rects:i,platform:a,elements:n}=t,{apply:l=()=>{},...c}=$e(e,t),u=await a.detectOverflow(t,c),h=Kt(s),M=Oe(s),y=Ht(s)==="y",{width:w,height:C}=i.floating;let j,A;h==="top"||h==="bottom"?(j=h,A=M===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(A=h,j=M==="end"?"top":"bottom");const b=C-u.top-u.bottom,f=w-u.left-u.right,L=Xt(C-u[j],b),I=Xt(w-u[A],f),x=!t.middlewareData.shift;let N=L,E=I;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(E=f),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(N=b),x&&!M){const k=ht(u.left,0),_=ht(u.right,0),U=ht(u.top,0),tt=ht(u.bottom,0);y?E=w-2*(k!==0||_!==0?k+_:ht(u.left,u.right)):N=C-2*(U!==0||tt!==0?U+tt:ht(u.top,u.bottom))}await l({...t,availableWidth:E,availableHeight:N});const S=await a.getDimensions(n.floating);return w!==S.width||C!==S.height?{reset:{rects:!0}}:{}}}};function Wo(){return typeof window<"u"}function _e(e){return Ui(e)?(e.nodeName||"").toLowerCase():"#document"}function gt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function kt(e){var t;return(t=(Ui(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Ui(e){return Wo()?e instanceof Node||e instanceof gt(e).Node:!1}function Lt(e){return Wo()?e instanceof Element||e instanceof gt(e).Element:!1}function Qt(e){return Wo()?e instanceof HTMLElement||e instanceof gt(e).HTMLElement:!1}function Yi(e){return!Wo()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof gt(e).ShadowRoot}function io(e){const{overflow:t,overflowX:o,overflowY:r,display:s}=xt(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&s!=="inline"&&s!=="contents"}function Fl(e){return/^(table|td|th)$/.test(_e(e))}function Fo(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const Gl=/transform|translate|scale|rotate|perspective|filter/,Jl=/paint|layout|strict|content/,be=e=>!!e&&e!=="none";let rs;function Go(e){const t=Lt(e)?xt(e):e;return be(t.transform)||be(t.translate)||be(t.scale)||be(t.rotate)||be(t.perspective)||!ss()&&(be(t.backdropFilter)||be(t.filter))||Gl.test(t.willChange||"")||Jl.test(t.contain||"")}function Vl(e){let t=qt(e);for(;Qt(t)&&!Pe(t);){if(Go(t))return t;if(Fo(t))return null;t=qt(t)}return null}function ss(){return rs==null&&(rs=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),rs}function Pe(e){return/^(html|body|#document)$/.test(_e(e))}function xt(e){return gt(e).getComputedStyle(e)}function Jo(e){return Lt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function qt(e){if(_e(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Yi(e)&&e.host||kt(e);return Yi(t)?t.host:t}function Bi(e){const t=qt(e);return Pe(t)?e.ownerDocument?e.ownerDocument.body:e.body:Qt(t)&&io(t)?t:Bi(t)}function ao(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const s=Bi(e),i=s===((r=e.ownerDocument)==null?void 0:r.body),a=gt(s);if(i){const n=is(a);return t.concat(a,a.visualViewport||[],io(s)?s:[],n&&o?ao(n):[])}else return t.concat(s,ao(s,[],o))}function is(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Hi(e){const t=xt(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const s=Qt(e),i=s?e.offsetWidth:o,a=s?e.offsetHeight:r,n=Bo(o)!==i||Bo(r)!==a;return n&&(o=i,r=a),{width:o,height:r,$:n}}function as(e){return Lt(e)?e:e.contextElement}function Re(e){const t=as(e);if(!Qt(t))return zt(1);const o=t.getBoundingClientRect(),{width:r,height:s,$:i}=Hi(t);let a=(i?Bo(o.width):o.width)/r,n=(i?Bo(o.height):o.height)/s;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const Xl=zt(0);function Qi(e){const t=gt(e);return!ss()||!t.visualViewport?Xl:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Kl(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==gt(e)?!1:t}function ye(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const s=e.getBoundingClientRect(),i=as(e);let a=zt(1);t&&(r?Lt(r)&&(a=Re(r)):a=Re(e));const n=Kl(i,o,r)?Qi(i):zt(0);let l=(s.left+n.x)/a.x,c=(s.top+n.y)/a.y,u=s.width/a.x,h=s.height/a.y;if(i){const M=gt(i),y=r&&Lt(r)?gt(r):r;let w=M,C=is(w);for(;C&&r&&y!==w;){const j=Re(C),A=C.getBoundingClientRect(),b=xt(C),f=A.left+(C.clientLeft+parseFloat(b.paddingLeft))*j.x,L=A.top+(C.clientTop+parseFloat(b.paddingTop))*j.y;l*=j.x,c*=j.y,u*=j.x,h*=j.y,l+=f,c+=L,w=gt(C),C=is(w)}}return Zo({width:u,height:h,x:l,y:c})}function Vo(e,t){const o=Jo(e).scrollLeft;return t?t.left+o:ye(kt(e)).left+o}function Zi(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-Vo(e,o),s=o.top+t.scrollTop;return{x:r,y:s}}function ql(e){let{elements:t,rect:o,offsetParent:r,strategy:s}=e;const i=s==="fixed",a=kt(r),n=t?Fo(t.floating):!1;if(r===a||n&&i)return o;let l={scrollLeft:0,scrollTop:0},c=zt(1);const u=zt(0),h=Qt(r);if((h||!h&&!i)&&((_e(r)!=="body"||io(a))&&(l=Jo(r)),h)){const y=ye(r);c=Re(r),u.x=y.x+r.clientLeft,u.y=y.y+r.clientTop}const M=a&&!h&&!i?Zi(a,l):zt(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+u.x+M.x,y:o.y*c.y-l.scrollTop*c.y+u.y+M.y}}function tc(e){return Array.from(e.getClientRects())}function ec(e){const t=kt(e),o=Jo(e),r=e.ownerDocument.body,s=ht(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),i=ht(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let a=-o.scrollLeft+Vo(e);const n=-o.scrollTop;return xt(r).direction==="rtl"&&(a+=ht(t.clientWidth,r.clientWidth)-s),{width:s,height:i,x:a,y:n}}const Wi=25;function oc(e,t){const o=gt(e),r=kt(e),s=o.visualViewport;let i=r.clientWidth,a=r.clientHeight,n=0,l=0;if(s){i=s.width,a=s.height;const u=ss();(!u||u&&t==="fixed")&&(n=s.offsetLeft,l=s.offsetTop)}const c=Vo(r);if(c<=0){const u=r.ownerDocument,h=u.body,M=getComputedStyle(h),y=u.compatMode==="CSS1Compat"&&parseFloat(M.marginLeft)+parseFloat(M.marginRight)||0,w=Math.abs(r.clientWidth-h.clientWidth-y);w<=Wi&&(i-=w)}else c<=Wi&&(i+=c);return{width:i,height:a,x:n,y:l}}function rc(e,t){const o=ye(e,!0,t==="fixed"),r=o.top+e.clientTop,s=o.left+e.clientLeft,i=Qt(e)?Re(e):zt(1),a=e.clientWidth*i.x,n=e.clientHeight*i.y,l=s*i.x,c=r*i.y;return{width:a,height:n,x:l,y:c}}function Fi(e,t,o){let r;if(t==="viewport")r=oc(e,o);else if(t==="document")r=ec(kt(e));else if(Lt(t))r=rc(t,o);else{const s=Qi(e);r={x:t.x-s.x,y:t.y-s.y,width:t.width,height:t.height}}return Zo(r)}function Gi(e,t){const o=qt(e);return o===t||!Lt(o)||Pe(o)?!1:xt(o).position==="fixed"||Gi(o,t)}function sc(e,t){const o=t.get(e);if(o)return o;let r=ao(e,[],!1).filter(n=>Lt(n)&&_e(n)!=="body"),s=null;const i=xt(e).position==="fixed";let a=i?qt(e):e;for(;Lt(a)&&!Pe(a);){const n=xt(a),l=Go(a);!l&&n.position==="fixed"&&(s=null),(i?!l&&!s:!l&&n.position==="static"&&!!s&&(s.position==="absolute"||s.position==="fixed")||io(a)&&!l&&Gi(e,a))?r=r.filter(u=>u!==a):s=n,a=qt(a)}return t.set(e,r),r}function ic(e){let{element:t,boundary:o,rootBoundary:r,strategy:s}=e;const a=[...o==="clippingAncestors"?Fo(t)?[]:sc(t,this._c):[].concat(o),r],n=Fi(t,a[0],s);let l=n.top,c=n.right,u=n.bottom,h=n.left;for(let M=1;M<a.length;M++){const y=Fi(t,a[M],s);l=ht(y.top,l),c=Xt(y.right,c),u=Xt(y.bottom,u),h=ht(y.left,h)}return{width:c-h,height:u-l,x:h,y:l}}function ac(e){const{width:t,height:o}=Hi(e);return{width:t,height:o}}function nc(e,t,o){const r=Qt(t),s=kt(t),i=o==="fixed",a=ye(e,!0,i,t);let n={scrollLeft:0,scrollTop:0};const l=zt(0);function c(){l.x=Vo(s)}if(r||!r&&!i)if((_e(t)!=="body"||io(s))&&(n=Jo(t)),r){const y=ye(t,!0,i,t);l.x=y.x+t.clientLeft,l.y=y.y+t.clientTop}else s&&c();i&&!r&&s&&c();const u=s&&!r&&!i?Zi(s,n):zt(0),h=a.left+n.scrollLeft-l.x-u.x,M=a.top+n.scrollTop-l.y-u.y;return{x:h,y:M,width:a.width,height:a.height}}function ns(e){return xt(e).position==="static"}function Ji(e,t){if(!Qt(e)||xt(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return kt(e)===o&&(o=o.ownerDocument.body),o}function Vi(e,t){const o=gt(e);if(Fo(e))return o;if(!Qt(e)){let s=qt(e);for(;s&&!Pe(s);){if(Lt(s)&&!ns(s))return s;s=qt(s)}return o}let r=Ji(e,t);for(;r&&Fl(r)&&ns(r);)r=Ji(r,t);return r&&Pe(r)&&ns(r)&&!Go(r)?o:r||Vl(e)||o}const lc=async function(e){const t=this.getOffsetParent||Vi,o=this.getDimensions,r=await o(e.floating);return{reference:nc(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function cc(e){return xt(e).direction==="rtl"}const Xo={convertOffsetParentRelativeRectToViewportRelativeRect:ql,getDocumentElement:kt,getClippingRect:ic,getOffsetParent:Vi,getElementRects:lc,getClientRects:tc,getDimensions:ac,getScale:Re,isElement:Lt,isRTL:cc};function Xi(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function dc(e,t){let o=null,r;const s=kt(e);function i(){var n;clearTimeout(r),(n=o)==null||n.disconnect(),o=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),i();const c=e.getBoundingClientRect(),{left:u,top:h,width:M,height:y}=c;if(n||t(),!M||!y)return;const w=Ho(h),C=Ho(s.clientWidth-(u+M)),j=Ho(s.clientHeight-(h+y)),A=Ho(u),f={rootMargin:-w+"px "+-C+"px "+-j+"px "+-A+"px",threshold:ht(0,Xt(1,l))||1};let L=!0;function I(x){const N=x[0].intersectionRatio;if(N!==l){if(!L)return a();N?a(!1,N):r=setTimeout(()=>{a(!1,1e-7)},1e3)}N===1&&!Xi(c,e.getBoundingClientRect())&&a(),L=!1}try{o=new IntersectionObserver(I,{...f,root:s.ownerDocument})}catch{o=new IntersectionObserver(I,f)}o.observe(e)}return a(!0),i}function uc(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=as(e),u=s||i?[...c?ao(c):[],...t?ao(t):[]]:[];u.forEach(A=>{s&&A.addEventListener("scroll",o,{passive:!0}),i&&A.addEventListener("resize",o)});const h=c&&n?dc(c,o):null;let M=-1,y=null;a&&(y=new ResizeObserver(A=>{let[b]=A;b&&b.target===c&&y&&t&&(y.unobserve(t),cancelAnimationFrame(M),M=requestAnimationFrame(()=>{var f;(f=y)==null||f.observe(t)})),o()}),c&&!l&&y.observe(c),t&&y.observe(t));let w,C=l?ye(e):null;l&&j();function j(){const A=ye(e);C&&!Xi(C,A)&&o(),C=A,w=requestAnimationFrame(j)}return o(),()=>{var A;u.forEach(b=>{s&&b.removeEventListener("scroll",o),i&&b.removeEventListener("resize",o)}),h==null||h(),(A=y)==null||A.disconnect(),y=null,l&&cancelAnimationFrame(w)}}const pc=Ql,hc=Zl,gc=Yl,Ki=Wl,mc=Ul,fc=(e,t,o)=>{const r=new Map,s={platform:Xo,...o},i={...s.platform,_c:r};return Rl(e,t,{...s,platform:i})};function bc(e){return yc(e)}function ls(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function yc(e){for(let t=e;t;t=ls(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=ls(e);t;t=ls(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||Go(o)||t.tagName==="BODY"))return t}return null}function vc(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var Y=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),o=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let s=0,i=0,a=0,n=0,l=0,c=0,u=0,h=0;r?t.top<o.top?(s=t.left,i=t.bottom,a=t.right,n=t.bottom,l=o.left,c=o.top,u=o.right,h=o.top):(s=o.left,i=o.bottom,a=o.right,n=o.bottom,l=t.left,c=t.top,u=t.right,h=t.top):t.left<o.left?(s=t.right,i=t.top,a=o.left,n=o.top,l=t.right,c=t.bottom,u=o.left,h=o.bottom):(s=o.right,i=o.top,a=t.left,n=t.top,l=o.right,c=o.bottom,u=t.left,h=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${s}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${a}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${l}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${u}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${h}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||vc(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=uc(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[pc({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Ki({apply:({rects:r})=>{const s=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=s?`${r.reference.width}px`:"",this.popup.style.height=i?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(gc({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(hc({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Ki({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:s})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${s}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(mc({element:this.arrowEl,padding:this.arrowPadding}));const o=this.strategy==="absolute"?r=>Xo.getOffsetParent(r,bc):Xo.getOffsetParent;fc(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:oo(Bt({},Xo),{getOffsetParent:o})}).then(({x:r,y:s,middlewareData:i,placement:a})=>{const n=this.localize.dir()==="rtl",l={top:"bottom",right:"left",bottom:"top",left:"right"}[a.split("-")[0]];if(this.setAttribute("data-current-placement",a),Object.assign(this.popup.style,{left:`${r}px`,top:`${s}px`}),this.arrow){const c=i.arrow.x,u=i.arrow.y;let h="",M="",y="",w="";if(this.arrowPlacement==="start"){const C=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",M=n?C:"",w=n?"":C}else if(this.arrowPlacement==="end"){const C=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";M=n?"":C,w=n?C:"",y=typeof u=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(w=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":"",h=typeof u=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(w=typeof c=="number"?`${c}px`:"",h=typeof u=="number"?`${u}px`:"");Object.assign(this.arrowEl.style,{top:h,right:M,bottom:y,left:w,[l]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return d`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${ct({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${ct({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?d`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};Y.styles=[ot,Nl],m([R(".popup")],Y.prototype,"popup",2),m([R(".popup__arrow")],Y.prototype,"arrowEl",2),m([g()],Y.prototype,"anchor",2),m([g({type:Boolean,reflect:!0})],Y.prototype,"active",2),m([g({reflect:!0})],Y.prototype,"placement",2),m([g({reflect:!0})],Y.prototype,"strategy",2),m([g({type:Number})],Y.prototype,"distance",2),m([g({type:Number})],Y.prototype,"skidding",2),m([g({type:Boolean})],Y.prototype,"arrow",2),m([g({attribute:"arrow-placement"})],Y.prototype,"arrowPlacement",2),m([g({attribute:"arrow-padding",type:Number})],Y.prototype,"arrowPadding",2),m([g({type:Boolean})],Y.prototype,"flip",2),m([g({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],Y.prototype,"flipFallbackPlacements",2),m([g({attribute:"flip-fallback-strategy"})],Y.prototype,"flipFallbackStrategy",2),m([g({type:Object})],Y.prototype,"flipBoundary",2),m([g({attribute:"flip-padding",type:Number})],Y.prototype,"flipPadding",2),m([g({type:Boolean})],Y.prototype,"shift",2),m([g({type:Object})],Y.prototype,"shiftBoundary",2),m([g({attribute:"shift-padding",type:Number})],Y.prototype,"shiftPadding",2),m([g({attribute:"auto-size"})],Y.prototype,"autoSize",2),m([g()],Y.prototype,"sync",2),m([g({type:Object})],Y.prototype,"autoSizeBoundary",2),m([g({attribute:"auto-size-padding",type:Number})],Y.prototype,"autoSizePadding",2),m([g({attribute:"hover-bridge",type:Boolean})],Y.prototype,"hoverBridge",2);var qi=new Map,Mc=new WeakMap;function wc(e){return e??{keyframes:[],options:{duration:0}}}function ta(e,t){return t.toLowerCase()==="rtl"?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function et(e,t){qi.set(e,wc(t))}function mt(e,t,o){const r=Mc.get(e);if(r!=null&&r[t])return ta(r[t],o.dir);const s=qi.get(t);return s?ta(s,o.dir):{keyframes:[],options:{duration:0}}}function te(e,t){return new Promise(o=>{function r(s){s.target===e&&(e.removeEventListener(t,r),o())}e.addEventListener(t,r)})}function It(e,t,o){return new Promise(r=>{if((o==null?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const s=e.animate(t,oo(Bt({},o),{duration:Lc()?0:o.duration}));s.addEventListener("cancel",r,{once:!0}),s.addEventListener("finish",r,{once:!0})})}function ea(e){return e=e.toString().toLowerCase(),e.indexOf("ms")>-1?parseFloat(e):e.indexOf("s")>-1?parseFloat(e)*1e3:parseFloat(e)}function Lc(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function $t(e){return Promise.all(e.getAnimations().map(t=>new Promise(o=>{t.cancel(),requestAnimationFrame(o)})))}function oa(e,t){return e.map(o=>oo(Bt({},o),{height:o.height==="auto"?`${t}px`:o.height}))}var rt=class extends X{constructor(){super(),this.localize=new pt(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{e.key==="Escape"&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const e=ea(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const e=ea(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await $t(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:o,options:r}=mt(this,"tooltip.show",{dir:this.localize.dir()});await It(this.popup.popup,o,r),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await $t(this.body);const{keyframes:o,options:r}=mt(this,"tooltip.hide",{dir:this.localize.dir()});await It(this.popup.popup,o,r),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,te(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,te(this,"sl-after-hide")}render(){return d`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${ct({tooltip:!0,"tooltip--open":this.open})}
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
    `}};rt.styles=[ot,jl],rt.dependencies={"sl-popup":Y},m([R("slot:not([name])")],rt.prototype,"defaultSlot",2),m([R(".tooltip__body")],rt.prototype,"body",2),m([R("sl-popup")],rt.prototype,"popup",2),m([g()],rt.prototype,"content",2),m([g()],rt.prototype,"placement",2),m([g({type:Boolean,reflect:!0})],rt.prototype,"disabled",2),m([g({type:Number})],rt.prototype,"distance",2),m([g({type:Boolean,reflect:!0})],rt.prototype,"open",2),m([g({type:Number})],rt.prototype,"skidding",2),m([g()],rt.prototype,"trigger",2),m([g({type:Boolean})],rt.prototype,"hoist",2),m([V("open",{waitUntilFirstUpdate:!0})],rt.prototype,"handleOpenChange",1),m([V(["content","distance","hoist","placement","skidding"])],rt.prototype,"handleOptionsChange",1),m([V("disabled")],rt.prototype,"handleDisabledChange",1),et("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),et("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),rt.define("sl-tooltip"),ut.define("sl-icon");var xc=z`
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
`;function Ic(e,t){function o(s){const i=e.getBoundingClientRect(),a=e.ownerDocument.defaultView,n=i.left+a.scrollX,l=i.top+a.scrollY,c=s.pageX-n,u=s.pageY-l;t!=null&&t.onMove&&t.onMove(c,u)}function r(){document.removeEventListener("pointermove",o),document.removeEventListener("pointerup",r),t!=null&&t.onStop&&t.onStop()}document.addEventListener("pointermove",o,{passive:!0}),document.addEventListener("pointerup",r),(t==null?void 0:t.initialEvent)instanceof PointerEvent&&o(t.initialEvent)}function ra(e,t,o){const r=s=>Object.is(s,-0)?0:s;return e<t?r(t):e>o?r(o):r(e)}var sa=()=>null,ft=class extends X{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new pt(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=sa,this.snapThreshold=12}toSnapFunction(e){const t=e.split(" ");return({pos:o,size:r,snapThreshold:s,isRtl:i,vertical:a})=>{let n=o,l=Number.POSITIVE_INFINITY;return t.forEach(c=>{let u;if(c.startsWith("repeat(")){const M=e.substring(7,e.length-1),y=M.endsWith("%"),w=Number.parseFloat(M),C=y?r*(w/100):w;u=Math.round((i&&!a?r-o:o)/C)*C}else c.endsWith("%")?u=r*(Number.parseFloat(c)/100):u=Number.parseFloat(c);i&&!a&&(u=r-u);const h=Math.abs(o-u);h<=s&&h<l&&(n=u,l=h)}),n}}set snap(e){this.snapValue=e??"",e?this.snapFunction=typeof e=="string"?this.toSnapFunction(e):e:this.snapFunction=sa}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){const{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){const t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),Ic(this,{onMove:(o,r)=>{var s;let i=this.vertical?r:o;this.primary==="end"&&(i=this.size-i),i=(s=this.snapFunction({pos:i,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical}))!=null?s:i,this.position=ra(this.pixelsToPercentage(i),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){let t=this.position;const o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);if(e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),e.key==="Enter")if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const r=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=r})}this.position=ra(t,0,100)}}handleResize(e){const{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",r=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,s="auto";return this.primary==="end"?o&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${s}`:this.style[e]=`${s} var(--divider-width) ${r}`:o&&!this.vertical?this.style[e]=`${s} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${s}`,this.style[t]="",d`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${J(this.disabled?void 0:"0")}
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
    `}};ft.styles=[ot,xc],m([R(".divider")],ft.prototype,"divider",2),m([g({type:Number,reflect:!0})],ft.prototype,"position",2),m([g({attribute:"position-in-pixels",type:Number})],ft.prototype,"positionInPixels",2),m([g({type:Boolean,reflect:!0})],ft.prototype,"vertical",2),m([g({type:Boolean,reflect:!0})],ft.prototype,"disabled",2),m([g()],ft.prototype,"primary",2),m([g({reflect:!0})],ft.prototype,"snap",1),m([g({type:Number,attribute:"snap-threshold"})],ft.prototype,"snapThreshold",2),m([V("position")],ft.prototype,"handlePositionChange",1),m([V("positionInPixels")],ft.prototype,"handlePositionInPixelsChange",1),m([V("vertical")],ft.prototype,"handleVerticalChange",1),ft.define("sl-split-panel");var Cc=z`
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
`;function*cs(e=document.activeElement){e!=null&&(yield e,"shadowRoot"in e&&e.shadowRoot&&e.shadowRoot.mode!=="closed"&&(yield*ml(cs(e.shadowRoot.activeElement))))}function ia(){return[...cs()].pop()}var aa=new WeakMap;function na(e){let t=aa.get(e);return t||(t=window.getComputedStyle(e,null),aa.set(e,t)),t}function Ac(e){if(typeof e.checkVisibility=="function")return e.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const t=na(e);return t.visibility!=="hidden"&&t.display!=="none"}function jc(e){const t=na(e),{overflowY:o,overflowX:r}=t;return o==="scroll"||r==="scroll"?!0:o!=="auto"||r!=="auto"?!1:e.scrollHeight>e.clientHeight&&o==="auto"||e.scrollWidth>e.clientWidth&&r==="auto"}function Nc(e){const t=e.tagName.toLowerCase(),o=Number(e.getAttribute("tabindex"));if(e.hasAttribute("tabindex")&&(isNaN(o)||o<=-1)||e.hasAttribute("disabled")||e.closest("[inert]"))return!1;if(t==="input"&&e.getAttribute("type")==="radio"){const i=e.getRootNode(),a=`input[type='radio'][name="${e.getAttribute("name")}"]`,n=i.querySelector(`${a}:checked`);return n?n===e:i.querySelector(a)===e}return Ac(e)?(t==="audio"||t==="video")&&e.hasAttribute("controls")||e.hasAttribute("tabindex")||e.hasAttribute("contenteditable")&&e.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(t)?!0:jc(e):!1}function Sc(e){var t,o;const r=ds(e),s=(t=r[0])!=null?t:null,i=(o=r[r.length-1])!=null?o:null;return{start:s,end:i}}function Dc(e,t){var o;return((o=e.getRootNode({composed:!0}))==null?void 0:o.host)!==t}function ds(e){const t=new WeakMap,o=[];function r(s){if(s instanceof Element){if(s.hasAttribute("inert")||s.closest("[inert]")||t.has(s))return;t.set(s,!0),!o.includes(s)&&Nc(s)&&o.push(s),s instanceof HTMLSlotElement&&Dc(s,e)&&s.assignedElements({flatten:!0}).forEach(i=>{r(i)}),s.shadowRoot!==null&&s.shadowRoot.mode==="open"&&r(s.shadowRoot)}for(const i of s.children)r(i)}return r(e),o.sort((s,i)=>{const a=Number(s.getAttribute("tabindex"))||0;return(Number(i.getAttribute("tabindex"))||0)-a})}var no=[],Tc=class{constructor(e){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=t=>{var o;if(t.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const r=ia();if(this.previousFocus=r,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;t.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const s=ds(this.element);let i=s.findIndex(n=>n===r);this.previousFocus=this.currentFocus;const a=this.tabDirection==="forward"?1:-1;for(;;){i+a>=s.length?i=0:i+a<0?i=s.length-1:i+=a,this.previousFocus=this.currentFocus;const n=s[i];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||n&&this.possiblyHasTabbableChildren(n))return;t.preventDefault(),this.currentFocus=n,(o=this.currentFocus)==null||o.focus({preventScroll:!1});const l=[...cs()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=e,this.elementsWithTabbableControls=["iframe"]}activate(){no.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){no=no.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return no[no.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const e=ds(this.element);if(!this.element.matches(":focus-within")){const t=e[0],o=e[e.length-1],r=this.tabDirection==="forward"?t:o;typeof(r==null?void 0:r.focus)=="function"&&(this.currentFocus=r,r.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute("controls")}};function Ec(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}var us=new Set;function zc(){const e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function kc(){const e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(e)||!e?0:e}function ps(e){if(us.add(e),!document.documentElement.classList.contains("sl-scroll-lock")){const t=zc()+kc();let o=getComputedStyle(document.documentElement).scrollbarGutter;(!o||o==="auto")&&(o="stable"),t<2&&(o=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",o),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${t}px`)}}function hs(e){us.delete(e),us.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}function la(e,t,o="vertical",r="smooth"){const s=Ec(e,t),i=s.top+t.scrollTop,a=s.left+t.scrollLeft,n=t.scrollLeft,l=t.scrollLeft+t.offsetWidth,c=t.scrollTop,u=t.scrollTop+t.offsetHeight;(o==="horizontal"||o==="both")&&(a<n?t.scrollTo({left:a,behavior:r}):a+e.clientWidth>l&&t.scrollTo({left:a-t.offsetWidth+e.clientWidth,behavior:r})),(o==="vertical"||o==="both")&&(i<c?t.scrollTo({top:i,behavior:r}):i+e.clientHeight>u&&t.scrollTo({top:i-t.offsetHeight+e.clientHeight,behavior:r}))}var $c=e=>{var t;const{activeElement:o}=document;o&&e.contains(o)&&((t=document.activeElement)==null||t.blur())},gs=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=o=>{const r=o.target;(this.slotNames.includes("[default]")&&!r.name||r.name&&this.slotNames.includes(r.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!=="")return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if(t.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!t.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function Oc(e){if(!e)return"";const t=e.assignedNodes({flatten:!0});let o="";return[...t].forEach(r=>{r.nodeType===Node.TEXT_NODE&&(o+=r.textContent)}),o}function ca(e){return e.charAt(0).toUpperCase()+e.slice(1)}var bt=class extends X{constructor(){super(...arguments),this.hasSlotController=new gs(this,"footer"),this.localize=new pt(this),this.modal=new Tc(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=e=>{this.contained||e.key==="Escape"&&this.modal.isActive()&&this.open&&(e.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),ps(this)))}disconnectedCallback(){super.disconnectedCallback(),hs(this),this.removeOpenListeners()}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){const o=mt(this,"drawer.denyClose",{dir:this.localize.dir()});It(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){var e;"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var e;document.removeEventListener("keydown",this.handleDocumentKeyDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),ps(this));const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([$t(this.drawer),$t(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});const t=mt(this,`drawer.show${ca(this.placement)}`,{dir:this.localize.dir()}),o=mt(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([It(this.panel,t.keyframes,t.options),It(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{$c(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),hs(this)),await Promise.all([$t(this.drawer),$t(this.overlay)]);const e=mt(this,`drawer.hide${ca(this.placement)}`,{dir:this.localize.dir()}),t=mt(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([It(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),It(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),ps(this)),this.open&&this.contained&&(this.modal.deactivate(),hs(this))}async show(){if(!this.open)return this.open=!0,te(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,te(this,"sl-after-hide")}render(){return d`
      <div
        part="base"
        class=${ct({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${J(this.noHeader?this.label:void 0)}
          aria-labelledby=${J(this.noHeader?void 0:"title")}
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
    `}};bt.styles=[ot,Cc],bt.dependencies={"sl-icon-button":it},m([R(".drawer")],bt.prototype,"drawer",2),m([R(".drawer__panel")],bt.prototype,"panel",2),m([R(".drawer__overlay")],bt.prototype,"overlay",2),m([g({type:Boolean,reflect:!0})],bt.prototype,"open",2),m([g({reflect:!0})],bt.prototype,"label",2),m([g({reflect:!0})],bt.prototype,"placement",2),m([g({type:Boolean,reflect:!0})],bt.prototype,"contained",2),m([g({attribute:"no-header",type:Boolean,reflect:!0})],bt.prototype,"noHeader",2),m([V("open",{waitUntilFirstUpdate:!0})],bt.prototype,"handleOpenChange",1),m([V("contained",{waitUntilFirstUpdate:!0})],bt.prototype,"handleNoModalChange",1),et("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),et("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),et("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),et("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),et("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),et("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),et("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),et("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),et("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),et("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),et("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),bt.define("sl-drawer");var _c=z`
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
`,Ct=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.style.height=this.open?"auto":"0",this.open&&(this.details.open=!0),this.detailsObserver=new MutationObserver(e=>{for(const t of e)t.type==="attributes"&&t.attributeName==="open"&&(this.details.open?this.show():this.hide())}),this.detailsObserver.observe(this.details,{attributes:!0})}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.detailsObserver)==null||e.disconnect()}handleSummaryClick(e){e.preventDefault(),this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key==="ArrowUp"||e.key==="ArrowLeft")&&(e.preventDefault(),this.hide()),(e.key==="ArrowDown"||e.key==="ArrowRight")&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.details.open=!0,this.emit("sl-show",{cancelable:!0}).defaultPrevented){this.open=!1,this.details.open=!1;return}await $t(this.body);const{keyframes:t,options:o}=mt(this,"details.show",{dir:this.localize.dir()});await It(this.body,oa(t,this.body.scrollHeight),o),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented){this.details.open=!0,this.open=!0;return}await $t(this.body);const{keyframes:t,options:o}=mt(this,"details.hide",{dir:this.localize.dir()});await It(this.body,oa(t,this.body.scrollHeight),o),this.body.style.height="auto",this.details.open=!1,this.emit("sl-after-hide")}}async show(){if(!(this.open||this.disabled))return this.open=!0,te(this,"sl-after-show")}async hide(){if(!(!this.open||this.disabled))return this.open=!1,te(this,"sl-after-hide")}render(){const e=this.localize.dir()==="rtl";return d`
      <details
        part="base"
        class=${ct({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
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
    `}};Ct.styles=[ot,_c],Ct.dependencies={"sl-icon":ut},m([R(".details")],Ct.prototype,"details",2),m([R(".details__header")],Ct.prototype,"header",2),m([R(".details__body")],Ct.prototype,"body",2),m([R(".details__expand-icon-slot")],Ct.prototype,"expandIconSlot",2),m([g({type:Boolean,reflect:!0})],Ct.prototype,"open",2),m([g()],Ct.prototype,"summary",2),m([g({type:Boolean,reflect:!0})],Ct.prototype,"disabled",2),m([V("open",{waitUntilFirstUpdate:!0})],Ct.prototype,"handleOpenChange",1),et("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}}),et("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}}),Ct.define("sl-details"),Y.define("sl-popup");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lo=e=>(t,o)=>{o!==void 0?o.addInitializer((()=>{customElements.define(e,t)})):customElements.define(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ko=globalThis,ms=Ko.ShadowRoot&&(Ko.ShadyCSS===void 0||Ko.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fs=Symbol(),da=new WeakMap;let ua=class{constructor(t,o,r){if(this._$cssResult$=!0,r!==fs)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=o}get styleSheet(){let t=this.o;const o=this.t;if(ms&&t===void 0){const r=o!==void 0&&o.length===1;r&&(t=da.get(o)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&da.set(o,t))}return t}toString(){return this.cssText}};const Pc=e=>new ua(typeof e=="string"?e:e+"",void 0,fs),At=(e,...t)=>{const o=e.length===1?e[0]:t.reduce(((r,s,i)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1]),e[0]);return new ua(o,e,fs)},Rc=(e,t)=>{if(ms)e.adoptedStyleSheets=t.map((o=>o instanceof CSSStyleSheet?o:o.styleSheet));else for(const o of t){const r=document.createElement("style"),s=Ko.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=o.cssText,e.appendChild(r)}},pa=ms?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let o="";for(const r of t.cssRules)o+=r.cssText;return Pc(o)})(e):e;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Uc,defineProperty:Yc,getOwnPropertyDescriptor:Bc,getOwnPropertyNames:Hc,getOwnPropertySymbols:Qc,getPrototypeOf:Zc}=Object,ee=globalThis,ha=ee.trustedTypes,Wc=ha?ha.emptyScript:"",bs=ee.reactiveElementPolyfillSupport,co=(e,t)=>e,qo={toAttribute(e,t){switch(t){case Boolean:e=e?Wc:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=e!==null;break;case Number:o=e===null?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch{o=null}}return o}},ys=(e,t)=>!Uc(e,t),ga={attribute:!0,type:String,converter:qo,reflect:!1,useDefault:!1,hasChanged:ys};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ee.litPropertyMetadata??(ee.litPropertyMetadata=new WeakMap);let Ue=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,o=ga){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(t,o),!o.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,o);s!==void 0&&Yc(this.prototype,t,s)}}static getPropertyDescriptor(t,o,r){const{get:s,set:i}=Bc(this.prototype,t)??{get(){return this[o]},set(a){this[o]=a}};return{get:s,set(a){const n=s==null?void 0:s.call(this);i==null||i.call(this,a),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ga}static _$Ei(){if(this.hasOwnProperty(co("elementProperties")))return;const t=Zc(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(co("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(co("properties"))){const o=this.properties,r=[...Hc(o),...Qc(o)];for(const s of r)this.createProperty(s,o[s])}const t=this[Symbol.metadata];if(t!==null){const o=litPropertyMetadata.get(t);if(o!==void 0)for(const[r,s]of o)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[o,r]of this.elementProperties){const s=this._$Eu(o,r);s!==void 0&&this._$Eh.set(s,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const o=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)o.unshift(pa(s))}else t!==void 0&&o.push(pa(t));return o}static _$Eu(t,o){const r=o.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((o=>this.enableUpdating=o)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((o=>o(this)))}addController(t){var o;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)==null||o.call(t))}removeController(t){var o;(o=this._$EO)==null||o.delete(t)}_$E_(){const t=new Map,o=this.constructor.elementProperties;for(const r of o.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Rc(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostConnected)==null?void 0:r.call(o)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((o=>{var r;return(r=o.hostDisconnected)==null?void 0:r.call(o)}))}attributeChangedCallback(t,o,r){this._$AK(t,r)}_$ET(t,o){var i;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const a=(((i=r.converter)==null?void 0:i.toAttribute)!==void 0?r.converter:qo).toAttribute(o,r.type);this._$Em=t,a==null?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,o){var i,a;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=r.getPropertyOptions(s),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((i=n.converter)==null?void 0:i.fromAttribute)!==void 0?n.converter:qo;this._$Em=s;const c=l.fromAttribute(o,n.type);this[s]=c??((a=this._$Ej)==null?void 0:a.get(s))??c,this._$Em=null}}requestUpdate(t,o,r){var s;if(t!==void 0){const i=this.constructor,a=this[t];if(r??(r=i.getPropertyOptions(t)),!((r.hasChanged??ys)(a,o)||r.useDefault&&r.reflect&&a===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(i._$Eu(t,r))))return;this.C(t,o,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,o,{useDefault:r,reflect:s,wrapped:i},a){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??o??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(o=void 0),this._$AL.set(t,o)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,a]of s){const{wrapped:n}=a,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,a,l)}}let t=!1;const o=this._$AL;try{t=this.shouldUpdate(o),t?(this.willUpdate(o),(r=this._$EO)==null||r.forEach((s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)})),this.update(o)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(o)}willUpdate(t){}_$AE(t){var o;(o=this._$EO)==null||o.forEach((r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((o=>this._$ET(o,this[o])))),this._$EM()}updated(t){}firstUpdated(t){}};Ue.elementStyles=[],Ue.shadowRootOptions={mode:"open"},Ue[co("elementProperties")]=new Map,Ue[co("finalized")]=new Map,bs==null||bs({ReactiveElement:Ue}),(ee.reactiveElementVersions??(ee.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fc={attribute:!0,type:String,converter:qo,reflect:!1,hasChanged:ys},Gc=(e=Fc,t,o)=>{const{kind:r,metadata:s}=o;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(o.name,e),r==="accessor"){const{name:a}=o;return{set(n){const l=t.get.call(this);t.set.call(this,n),this.requestUpdate(a,l,e)},init(n){return n!==void 0&&this.C(a,void 0,e,n),n}}}if(r==="setter"){const{name:a}=o;return function(n){const l=this[a];t.call(this,n),this.requestUpdate(a,l,e)}}throw Error("Unsupported decorator location: "+r)};function $(e){return(t,o)=>typeof o=="object"?Gc(e,t,o):((r,s,i)=>{const a=s.hasOwnProperty(i);return s.constructor.createProperty(i,r),a?Object.getOwnPropertyDescriptor(s,i):void 0})(e,t,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ma(e){return $({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jc=(e,t,o)=>(o.configurable=!0,o.enumerable=!0,Reflect.decorate&&typeof t!="object"&&Object.defineProperty(e,t,o),o);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function fa(e,t){return(o,r,s)=>{const i=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(e))??null};return Jc(o,r,{get(){return i(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const uo=globalThis,tr=uo.trustedTypes,ba=tr?tr.createPolicy("lit-html",{createHTML:e=>e}):void 0,ya="$lit$",oe=`lit$${Math.random().toFixed(9).slice(2)}$`,va="?"+oe,Vc=`<${va}>`,ve=document,po=()=>ve.createComment(""),ho=e=>e===null||typeof e!="object"&&typeof e!="function",vs=Array.isArray,Xc=e=>vs(e)||typeof(e==null?void 0:e[Symbol.iterator])=="function",Ms=`[ 	
\f\r]`,go=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ma=/-->/g,wa=/>/g,Me=RegExp(`>|${Ms}(?:([^\\s"'>=/]+)(${Ms}*=${Ms}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),La=/'/g,xa=/"/g,Ia=/^(?:script|style|textarea|title)$/i,Kc=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),at=Kc(1),re=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),Ca=new WeakMap,we=ve.createTreeWalker(ve,129);function Aa(e,t){if(!vs(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ba!==void 0?ba.createHTML(t):t}const qc=(e,t)=>{const o=e.length-1,r=[];let s,i=t===2?"<svg>":t===3?"<math>":"",a=go;for(let n=0;n<o;n++){const l=e[n];let c,u,h=-1,M=0;for(;M<l.length&&(a.lastIndex=M,u=a.exec(l),u!==null);)M=a.lastIndex,a===go?u[1]==="!--"?a=Ma:u[1]!==void 0?a=wa:u[2]!==void 0?(Ia.test(u[2])&&(s=RegExp("</"+u[2],"g")),a=Me):u[3]!==void 0&&(a=Me):a===Me?u[0]===">"?(a=s??go,h=-1):u[1]===void 0?h=-2:(h=a.lastIndex-u[2].length,c=u[1],a=u[3]===void 0?Me:u[3]==='"'?xa:La):a===xa||a===La?a=Me:a===Ma||a===wa?a=go:(a=Me,s=void 0);const y=a===Me&&e[n+1].startsWith("/>")?" ":"";i+=a===go?l+Vc:h>=0?(r.push(c),l.slice(0,h)+ya+l.slice(h)+oe+y):l+oe+(h===-2?n:y)}return[Aa(e,i+(e[o]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class mo{constructor({strings:t,_$litType$:o},r){let s;this.parts=[];let i=0,a=0;const n=t.length-1,l=this.parts,[c,u]=qc(t,o);if(this.el=mo.createElement(c,r),we.currentNode=this.el.content,o===2||o===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=we.nextNode())!==null&&l.length<n;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(ya)){const M=u[a++],y=s.getAttribute(h).split(oe),w=/([.?@])?(.*)/.exec(M);l.push({type:1,index:i,name:w[2],strings:y,ctor:w[1]==="."?ed:w[1]==="?"?od:w[1]==="@"?rd:er}),s.removeAttribute(h)}else h.startsWith(oe)&&(l.push({type:6,index:i}),s.removeAttribute(h));if(Ia.test(s.tagName)){const h=s.textContent.split(oe),M=h.length-1;if(M>0){s.textContent=tr?tr.emptyScript:"";for(let y=0;y<M;y++)s.append(h[y],po()),we.nextNode(),l.push({type:2,index:++i});s.append(h[M],po())}}}else if(s.nodeType===8)if(s.data===va)l.push({type:2,index:i});else{let h=-1;for(;(h=s.data.indexOf(oe,h+1))!==-1;)l.push({type:7,index:i}),h+=oe.length-1}i++}}static createElement(t,o){const r=ve.createElement("template");return r.innerHTML=t,r}}function Ye(e,t,o=e,r){var a,n;if(t===re)return t;let s=r!==void 0?(a=o._$Co)==null?void 0:a[r]:o._$Cl;const i=ho(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((n=s==null?void 0:s._$AO)==null||n.call(s,!1),i===void 0?s=void 0:(s=new i(e),s._$AT(e,o,r)),r!==void 0?(o._$Co??(o._$Co=[]))[r]=s:o._$Cl=s),s!==void 0&&(t=Ye(e,s._$AS(e,t.values),s,r)),t}class td{constructor(t,o){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:o},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??ve).importNode(o,!0);we.currentNode=s;let i=we.nextNode(),a=0,n=0,l=r[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new fo(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new sd(i,this,t)),this._$AV.push(c),l=r[++n]}a!==(l==null?void 0:l.index)&&(i=we.nextNode(),a++)}return we.currentNode=ve,s}p(t){let o=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,o),o+=r.strings.length-2):r._$AI(t[o])),o++}}class fo{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,o,r,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=o,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=o.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,o=this){t=Ye(this,t,o),ho(t)?t===q||t==null||t===""?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==re&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xc(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&ho(this._$AH)?this._$AA.nextSibling.data=t:this.T(ve.createTextNode(t)),this._$AH=t}$(t){var i;const{values:o,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=mo.createElement(Aa(r.h,r.h[0]),this.options)),r);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(o);else{const a=new td(s,this),n=a.u(this.options);a.p(o),this.T(n),this._$AH=a}}_$AC(t){let o=Ca.get(t.strings);return o===void 0&&Ca.set(t.strings,o=new mo(t)),o}k(t){vs(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let r,s=0;for(const i of t)s===o.length?o.push(r=new fo(this.O(po()),this.O(po()),this,this.options)):r=o[s],r._$AI(i),s++;s<o.length&&(this._$AR(r&&r._$AB.nextSibling,s),o.length=s)}_$AR(t=this._$AA.nextSibling,o){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,o);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var o;this._$AM===void 0&&(this._$Cv=t,(o=this._$AP)==null||o.call(this,t))}}class er{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,o,r,s,i){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=o,this._$AM=s,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=q}_$AI(t,o=this,r,s){const i=this.strings;let a=!1;if(i===void 0)t=Ye(this,t,o,0),a=!ho(t)||t!==this._$AH&&t!==re,a&&(this._$AH=t);else{const n=t;let l,c;for(t=i[0],l=0;l<i.length-1;l++)c=Ye(this,n[r+l],o,l),c===re&&(c=this._$AH[l]),a||(a=!ho(c)||c!==this._$AH[l]),c===q?t=q:t!==q&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}a&&!s&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ed extends er{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class od extends er{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class rd extends er{constructor(t,o,r,s,i){super(t,o,r,s,i),this.type=5}_$AI(t,o=this){if((t=Ye(this,t,o,0)??q)===re)return;const r=this._$AH,s=t===q&&r!==q||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==q&&(r===q||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var o;typeof this._$AH=="function"?this._$AH.call(((o=this.options)==null?void 0:o.host)??this.element,t):this._$AH.handleEvent(t)}}class sd{constructor(t,o,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=o,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Ye(this,t)}}const ws=uo.litHtmlPolyfillSupport;ws==null||ws(mo,fo),(uo.litHtmlVersions??(uo.litHtmlVersions=[])).push("3.3.1");const id=(e,t,o)=>{const r=(o==null?void 0:o.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const i=(o==null?void 0:o.renderBefore)??null;r._$litPart$=s=new fo(t.insertBefore(po(),i),i,void 0,o??{})}return s._$AI(e),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Le=globalThis;let Ot=class extends Ue{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var o;const t=super.createRenderRoot();return(o=this.renderOptions).renderBefore??(o.renderBefore=t.firstChild),t}update(t){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=id(o,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return re}};Ot._$litElement$=!0,Ot.finalized=!0,(Cn=Le.litElementHydrateSupport)==null||Cn.call(Le,{LitElement:Ot});const Ls=Le.litElementPolyfillSupport;Ls==null||Ls({LitElement:Ot}),(Le.litElementVersions??(Le.litElementVersions=[])).push("4.2.1");function ad(e){switch(e.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const nd=At`
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
`;var ld=Object.defineProperty,cd=Object.getOwnPropertyDescriptor,xe=(e,t,o,r)=>{for(var s=r>1?void 0:r?cd(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&ld(t,o,s),s};const dd={GET:"GET",POST:"POST",PUT:"PUT",DELETE:"DEL",PATCH:"PAT",OPTIONS:"OPT",HEAD:"HEAD",TRACE:"TRC"};let Zt=class extends Ot{constructor(){super(),this.mode="",this.lower=!1,this.method="GET"}render(){if(this.mode==="nav-naked"){const o=this.method.toUpperCase(),r=dd[o]??o,s=this.method.toLowerCase();return at`<span class="method-naked ${s}">${r}</span>`}let e="medium";this.large&&(e="large"),this.tiny&&(e="small"),this.micro&&(e="small");const t=this.micro?`method ${e} micro`:`method ${e}`;return at`
            <sl-tag variant="${ad(this.method)}" class="${t}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};Zt.styles=nd,xe([$()],Zt.prototype,"method",2),xe([$({type:Boolean})],Zt.prototype,"lower",2),xe([$({type:Boolean})],Zt.prototype,"large",2),xe([$({type:Boolean})],Zt.prototype,"tiny",2),xe([$({type:Boolean})],Zt.prototype,"micro",2),xe([$({reflect:!0})],Zt.prototype,"mode",2),Zt=xe([lo("pb33f-http-method")],Zt);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ja={ATTRIBUTE:1,CHILD:2},Na=e=>(...t)=>({_$litDirective$:e,values:t});let Sa=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,o,r){this._$Ct=t,this._$AM=o,this._$Ci=r}_$AS(t,o){return this.update(t,o)}update(t,o){return this.render(...o)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let xs=class extends Sa{constructor(t){if(super(t),this.it=q,t.type!==ja.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===q||t==null)return this._t=void 0,this.it=t;if(t===re)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}};xs.directiveName="unsafeHTML",xs.resultType=1;const Da=Na(xs),ud=At`
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
`;var pd=Object.defineProperty,hd=Object.getOwnPropertyDescriptor,Is=(e,t,o,r)=>{for(var s=r>1?void 0:r?hd(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&pd(t,o,s),s};let bo=class extends Ot{constructor(){super(),this.path="/",this.nowrap=!1}replaceBrackets(){const e=/\{([\w$.#/]+)\}/g,t=this.nowrap?" nowrap":"",o=this.formatSlashes(this.path).replace(e,(r,s)=>`<span class="bracket${t}">{</span><span class="param${t}">${s}</span><span class="bracket${t}">}</span>`);return this.nowrap?at`<div style="white-space: nowrap;">${Da(o)}</div>`:at`${Da(o)}`}formatSlashes(e){return e.replaceAll("/",'<span class="slash">/</span>')}render(){return at`${this.replaceBrackets()}`}};bo.styles=ud,Is([$()],bo.prototype,"path",2),Is([$({type:Boolean})],bo.prototype,"nowrap",2),bo=Is([lo("pb33f-render-operation-path")],bo);const gd=At`
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
    }`;var md=Object.defineProperty,fd=Object.getOwnPropertyDescriptor,yo=(e,t,o,r)=>{for(var s=r>1?void 0:r?fd(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&md(t,o,s),s};let Ie=class extends Ot{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1,this.fluid=!1}render(){const e=this.fluid?"fluid":this.wide?"wide":"";return at`
            <header class="pb33f-header">
                <div class="logo ${e}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};Ie.styles=gd,yo([$()],Ie.prototype,"name",2),yo([$()],Ie.prototype,"url",2),yo([$({type:Boolean})],Ie.prototype,"wide",2),yo([$({type:Boolean})],Ie.prototype,"fluid",2),Ie=yo([lo("pb33f-header")],Ie);const bd=At`

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

`,Ta=At`
    
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
 `,Cs="pb33f-theme-change";var yd=Object.defineProperty,vd=Object.getOwnPropertyDescriptor,As=(e,t,o,r)=>{for(var s=r>1?void 0:r?vd(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&yd(t,o,s),s};const js="dark",Md="light",wd="tektronix",Ea="pb33f-theme",za="pb33f-base-theme";let vo=class extends Ot{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?wd:this.baseTheme}connectedCallback(){super.connectedCallback();const e=localStorage.getItem(Ea);if(e==="tektronix"){this.tektronixActive=!0;const t=localStorage.getItem(za);this.baseTheme=t==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=e==="light"?"light":"dark";this.applyTheme()}applyTheme(){const e=this.activeTheme;localStorage.setItem(Ea,e),localStorage.setItem(za,this.baseTheme);const t=document.querySelector("html");t&&(t.setAttribute("theme",e),e===Md?t.classList.remove("sl-theme-dark"):t.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Cs,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===js?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const e=this.baseTheme===js?"sun":"moon",t=this.baseTheme===js?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",o=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return at`
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
        `}};vo.styles=[bd,Ta],As([ma()],vo.prototype,"baseTheme",2),As([ma()],vo.prototype,"tektronixActive",2),vo=As([lo("pb33f-theme-switcher")],vo);var Ld=At`
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
`;const Ns=new Set,Be=new Map;let Ce,Ss="ltr",Ds="en";const ka=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(ka){const e=new MutationObserver(Oa);Ss=document.documentElement.dir||"ltr",Ds=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function $a(...e){e.map(t=>{const o=t.$code.toLowerCase();Be.has(o)?Be.set(o,Object.assign(Object.assign({},Be.get(o)),t)):Be.set(o,t),Ce||(Ce=t)}),Oa()}function Oa(){ka&&(Ss=document.documentElement.dir||"ltr",Ds=document.documentElement.lang||navigator.language),[...Ns.keys()].map(e=>{typeof e.requestUpdate=="function"&&e.requestUpdate()})}let xd=class{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){Ns.add(this.host)}hostDisconnected(){Ns.delete(this.host)}dir(){return`${this.host.dir||Ss}`.toLowerCase()}lang(){return`${this.host.lang||Ds}`.toLowerCase()}getTranslationData(t){var o,r;const s=new Intl.Locale(t.replace(/_/g,"-")),i=s==null?void 0:s.language.toLowerCase(),a=(r=(o=s==null?void 0:s.region)===null||o===void 0?void 0:o.toLowerCase())!==null&&r!==void 0?r:"",n=Be.get(`${i}-${a}`),l=Be.get(i);return{locale:s,language:i,region:a,primary:n,secondary:l}}exists(t,o){var r;const{primary:s,secondary:i}=this.getTranslationData((r=o.lang)!==null&&r!==void 0?r:this.lang());return o=Object.assign({includeFallback:!1},o),!!(s&&s[t]||i&&i[t]||o.includeFallback&&Ce&&Ce[t])}term(t,...o){const{primary:r,secondary:s}=this.getTranslationData(this.lang());let i;if(r&&r[t])i=r[t];else if(s&&s[t])i=s[t];else if(Ce&&Ce[t])i=Ce[t];else return console.error(`No translation found for: ${String(t)}`),String(t);return typeof i=="function"?i(...o):i}date(t,o){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),o).format(t)}number(t,o){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),o).format(t)}relativeTime(t,o,r){return new Intl.RelativeTimeFormat(this.lang(),r).format(t,o)}};var _a={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>e===0?"No options selected":e===1?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"};$a(_a);var Id=_a,Cd=class extends xd{};$a(Id);var Ad=At`
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
`,Pa=Object.defineProperty,jd=Object.defineProperties,Nd=Object.getOwnPropertyDescriptors,Ra=Object.getOwnPropertySymbols,Sd=Object.prototype.hasOwnProperty,Dd=Object.prototype.propertyIsEnumerable,Ua=e=>{throw TypeError(e)},Ya=(e,t,o)=>t in e?Pa(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,Ba=(e,t)=>{for(var o in t||(t={}))Sd.call(t,o)&&Ya(e,o,t[o]);if(Ra)for(var o of Ra(t))Dd.call(t,o)&&Ya(e,o,t[o]);return e},Td=(e,t)=>jd(e,Nd(t)),Z=(e,t,o,r)=>{for(var s=void 0,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=a(t,o,s)||s);return s&&Pa(t,o,s),s},Ha=(e,t,o)=>t.has(e)||Ua("Cannot "+o),Ed=(e,t,o)=>(Ha(e,t,"read from private field"),t.get(e)),zd=(e,t,o)=>t.has(e)?Ua("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),kd=(e,t,o,r)=>(Ha(e,t,"write to private field"),t.set(e,o),o),or,Mo=class extends Ot{constructor(){super(),zd(this,or,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const o=new CustomEvent(e,Ba({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(o),o}static define(e,t=this,o={}){const r=customElements.get(e);if(!r){try{customElements.define(e,t,o)}catch{customElements.define(e,class extends t{},o)}return}let s=" (unknown version)",i=s;"version"in t&&t.version&&(s=" v"+t.version),"version"in r&&r.version&&(i=" v"+r.version),!(s&&i&&s===i)&&console.warn(`Attempted to register <${e}>${s}, but <${e}>${i} has already been registered.`)}attributeChangedCallback(e,t,o){Ed(this,or)||(this.constructor.elementProperties.forEach((r,s)=>{r.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),kd(this,or,!0)),super.attributeChangedCallback(e,t,o)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,o)=>{e.has(o)&&this[o]==null&&(this[o]=t)})}};or=new WeakMap,Mo.version="2.20.1",Mo.dependencies={},Z([$()],Mo.prototype,"dir"),Z([$()],Mo.prototype,"lang");const se=Math.min,yt=Math.max,rr=Math.round,sr=Math.floor,_t=e=>({x:e,y:e}),$d={left:"right",right:"left",bottom:"top",top:"bottom"};function Ts(e,t,o){return yt(e,se(t,o))}function He(e,t){return typeof e=="function"?e(t):e}function ie(e){return e.split("-")[0]}function Qe(e){return e.split("-")[1]}function Qa(e){return e==="x"?"y":"x"}function Es(e){return e==="y"?"height":"width"}function Wt(e){const t=e[0];return t==="t"||t==="b"?"y":"x"}function zs(e){return Qa(Wt(e))}function Od(e,t,o){o===void 0&&(o=!1);const r=Qe(e),s=zs(e),i=Es(s);let a=s==="x"?r===(o?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[i]>t.floating[i]&&(a=ir(a)),[a,ir(a)]}function _d(e){const t=ir(e);return[ks(e),t,ks(t)]}function ks(e){return e.includes("start")?e.replace("start","end"):e.replace("end","start")}const Za=["left","right"],Wa=["right","left"],Pd=["top","bottom"],Rd=["bottom","top"];function Ud(e,t,o){switch(e){case"top":case"bottom":return o?t?Wa:Za:t?Za:Wa;case"left":case"right":return t?Pd:Rd;default:return[]}}function Yd(e,t,o,r){const s=Qe(e);let i=Ud(ie(e),o==="start",r);return s&&(i=i.map(a=>a+"-"+s),t&&(i=i.concat(i.map(ks)))),i}function ir(e){const t=ie(e);return $d[t]+e.slice(t.length)}function Bd(e){return{top:0,right:0,bottom:0,left:0,...e}}function Fa(e){return typeof e!="number"?Bd(e):{top:e,right:e,bottom:e,left:e}}function ar(e){const{x:t,y:o,width:r,height:s}=e;return{width:r,height:s,top:o,left:t,right:t+r,bottom:o+s,x:t,y:o}}function Ga(e,t,o){let{reference:r,floating:s}=e;const i=Wt(t),a=zs(t),n=Es(a),l=ie(t),c=i==="y",u=r.x+r.width/2-s.width/2,h=r.y+r.height/2-s.height/2,M=r[n]/2-s[n]/2;let y;switch(l){case"top":y={x:u,y:r.y-s.height};break;case"bottom":y={x:u,y:r.y+r.height};break;case"right":y={x:r.x+r.width,y:h};break;case"left":y={x:r.x-s.width,y:h};break;default:y={x:r.x,y:r.y}}switch(Qe(t)){case"start":y[a]-=M*(o&&c?-1:1);break;case"end":y[a]+=M*(o&&c?-1:1);break}return y}async function Hd(e,t){var o;t===void 0&&(t={});const{x:r,y:s,platform:i,rects:a,elements:n,strategy:l}=e,{boundary:c="clippingAncestors",rootBoundary:u="viewport",elementContext:h="floating",altBoundary:M=!1,padding:y=0}=He(t,e),w=Fa(y),j=n[M?h==="floating"?"reference":"floating":h],A=ar(await i.getClippingRect({element:(o=await(i.isElement==null?void 0:i.isElement(j)))==null||o?j:j.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(n.floating)),boundary:c,rootBoundary:u,strategy:l})),b=h==="floating"?{x:r,y:s,width:a.floating.width,height:a.floating.height}:a.reference,f=await(i.getOffsetParent==null?void 0:i.getOffsetParent(n.floating)),L=await(i.isElement==null?void 0:i.isElement(f))?await(i.getScale==null?void 0:i.getScale(f))||{x:1,y:1}:{x:1,y:1},I=ar(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:b,offsetParent:f,strategy:l}):b);return{top:(A.top-I.top+w.top)/L.y,bottom:(I.bottom-A.bottom+w.bottom)/L.y,left:(A.left-I.left+w.left)/L.x,right:(I.right-A.right+w.right)/L.x}}const Qd=50,Zd=async(e,t,o)=>{const{placement:r="bottom",strategy:s="absolute",middleware:i=[],platform:a}=o,n=a.detectOverflow?a:{...a,detectOverflow:Hd},l=await(a.isRTL==null?void 0:a.isRTL(t));let c=await a.getElementRects({reference:e,floating:t,strategy:s}),{x:u,y:h}=Ga(c,r,l),M=r,y=0;const w={};for(let C=0;C<i.length;C++){const j=i[C];if(!j)continue;const{name:A,fn:b}=j,{x:f,y:L,data:I,reset:x}=await b({x:u,y:h,initialPlacement:r,placement:M,strategy:s,middlewareData:w,rects:c,platform:n,elements:{reference:e,floating:t}});u=f??u,h=L??h,w[A]={...w[A],...I},x&&y<Qd&&(y++,typeof x=="object"&&(x.placement&&(M=x.placement),x.rects&&(c=x.rects===!0?await a.getElementRects({reference:e,floating:t,strategy:s}):x.rects),{x:u,y:h}=Ga(c,M,l)),C=-1)}return{x:u,y:h,placement:M,strategy:s,middlewareData:w}},Wd=e=>({name:"arrow",options:e,async fn(t){const{x:o,y:r,placement:s,rects:i,platform:a,elements:n,middlewareData:l}=t,{element:c,padding:u=0}=He(e,t)||{};if(c==null)return{};const h=Fa(u),M={x:o,y:r},y=zs(s),w=Es(y),C=await a.getDimensions(c),j=y==="y",A=j?"top":"left",b=j?"bottom":"right",f=j?"clientHeight":"clientWidth",L=i.reference[w]+i.reference[y]-M[y]-i.floating[w],I=M[y]-i.reference[y],x=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let N=x?x[f]:0;(!N||!await(a.isElement==null?void 0:a.isElement(x)))&&(N=n.floating[f]||i.floating[w]);const E=L/2-I/2,S=N/2-C[w]/2-1,k=se(h[A],S),_=se(h[b],S),U=k,tt=N-C[w]-_,P=N/2-C[w]/2+E,lt=Ts(U,P,tt),K=!l.arrow&&Qe(s)!=null&&P!==lt&&i.reference[w]/2-(P<U?k:_)-C[w]/2<0,F=K?P<U?P-U:P-tt:0;return{[y]:M[y]+F,data:{[y]:lt,centerOffset:P-lt-F,...K&&{alignmentOffset:F}},reset:K}}}),Fd=function(e){return e===void 0&&(e={}),{name:"flip",options:e,async fn(t){var o,r;const{placement:s,middlewareData:i,rects:a,initialPlacement:n,platform:l,elements:c}=t,{mainAxis:u=!0,crossAxis:h=!0,fallbackPlacements:M,fallbackStrategy:y="bestFit",fallbackAxisSideDirection:w="none",flipAlignment:C=!0,...j}=He(e,t);if((o=i.arrow)!=null&&o.alignmentOffset)return{};const A=ie(s),b=Wt(n),f=ie(n)===n,L=await(l.isRTL==null?void 0:l.isRTL(c.floating)),I=M||(f||!C?[ir(n)]:_d(n)),x=w!=="none";!M&&x&&I.push(...Yd(n,C,w,L));const N=[n,...I],E=await l.detectOverflow(t,j),S=[];let k=((r=i.flip)==null?void 0:r.overflows)||[];if(u&&S.push(E[A]),h){const P=Od(s,a,L);S.push(E[P[0]],E[P[1]])}if(k=[...k,{placement:s,overflows:S}],!S.every(P=>P<=0)){var _,U;const P=(((_=i.flip)==null?void 0:_.index)||0)+1,lt=N[P];if(lt&&(!(h==="alignment"?b!==Wt(lt):!1)||k.every(O=>Wt(O.placement)===b?O.overflows[0]>0:!0)))return{data:{index:P,overflows:k},reset:{placement:lt}};let K=(U=k.filter(F=>F.overflows[0]<=0).sort((F,O)=>F.overflows[1]-O.overflows[1])[0])==null?void 0:U.placement;if(!K)switch(y){case"bestFit":{var tt;const F=(tt=k.filter(O=>{if(x){const Q=Wt(O.placement);return Q===b||Q==="y"}return!0}).map(O=>[O.placement,O.overflows.filter(Q=>Q>0).reduce((Q,Yt)=>Q+Yt,0)]).sort((O,Q)=>O[1]-Q[1])[0])==null?void 0:tt[0];F&&(K=F);break}case"initialPlacement":K=n;break}if(s!==K)return{reset:{placement:K}}}return{}}}},Gd=new Set(["left","top"]);async function Jd(e,t){const{placement:o,platform:r,elements:s}=e,i=await(r.isRTL==null?void 0:r.isRTL(s.floating)),a=ie(o),n=Qe(o),l=Wt(o)==="y",c=Gd.has(a)?-1:1,u=i&&l?-1:1,h=He(t,e);let{mainAxis:M,crossAxis:y,alignmentAxis:w}=typeof h=="number"?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:h.mainAxis||0,crossAxis:h.crossAxis||0,alignmentAxis:h.alignmentAxis};return n&&typeof w=="number"&&(y=n==="end"?w*-1:w),l?{x:y*u,y:M*c}:{x:M*c,y:y*u}}const Vd=function(e){return e===void 0&&(e=0),{name:"offset",options:e,async fn(t){var o,r;const{x:s,y:i,placement:a,middlewareData:n}=t,l=await Jd(t,e);return a===((o=n.offset)==null?void 0:o.placement)&&(r=n.arrow)!=null&&r.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:a}}}}},Xd=function(e){return e===void 0&&(e={}),{name:"shift",options:e,async fn(t){const{x:o,y:r,placement:s,platform:i}=t,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:A=>{let{x:b,y:f}=A;return{x:b,y:f}}},...c}=He(e,t),u={x:o,y:r},h=await i.detectOverflow(t,c),M=Wt(ie(s)),y=Qa(M);let w=u[y],C=u[M];if(a){const A=y==="y"?"top":"left",b=y==="y"?"bottom":"right",f=w+h[A],L=w-h[b];w=Ts(f,w,L)}if(n){const A=M==="y"?"top":"left",b=M==="y"?"bottom":"right",f=C+h[A],L=C-h[b];C=Ts(f,C,L)}const j=l.fn({...t,[y]:w,[M]:C});return{...j,data:{x:j.x-o,y:j.y-r,enabled:{[y]:a,[M]:n}}}}}},Kd=function(e){return e===void 0&&(e={}),{name:"size",options:e,async fn(t){var o,r;const{placement:s,rects:i,platform:a,elements:n}=t,{apply:l=()=>{},...c}=He(e,t),u=await a.detectOverflow(t,c),h=ie(s),M=Qe(s),y=Wt(s)==="y",{width:w,height:C}=i.floating;let j,A;h==="top"||h==="bottom"?(j=h,A=M===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(A=h,j=M==="end"?"top":"bottom");const b=C-u.top-u.bottom,f=w-u.left-u.right,L=se(C-u[j],b),I=se(w-u[A],f),x=!t.middlewareData.shift;let N=L,E=I;if((o=t.middlewareData.shift)!=null&&o.enabled.x&&(E=f),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(N=b),x&&!M){const k=yt(u.left,0),_=yt(u.right,0),U=yt(u.top,0),tt=yt(u.bottom,0);y?E=w-2*(k!==0||_!==0?k+_:yt(u.left,u.right)):N=C-2*(U!==0||tt!==0?U+tt:yt(u.top,u.bottom))}await l({...t,availableWidth:E,availableHeight:N});const S=await a.getDimensions(n.floating);return w!==S.width||C!==S.height?{reset:{rects:!0}}:{}}}};function nr(){return typeof window<"u"}function Ze(e){return Ja(e)?(e.nodeName||"").toLowerCase():"#document"}function vt(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Pt(e){var t;return(t=(Ja(e)?e.ownerDocument:e.document)||window.document)==null?void 0:t.documentElement}function Ja(e){return nr()?e instanceof Node||e instanceof vt(e).Node:!1}function jt(e){return nr()?e instanceof Element||e instanceof vt(e).Element:!1}function Ft(e){return nr()?e instanceof HTMLElement||e instanceof vt(e).HTMLElement:!1}function Va(e){return!nr()||typeof ShadowRoot>"u"?!1:e instanceof ShadowRoot||e instanceof vt(e).ShadowRoot}function wo(e){const{overflow:t,overflowX:o,overflowY:r,display:s}=Nt(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+o)&&s!=="inline"&&s!=="contents"}function qd(e){return/^(table|td|th)$/.test(Ze(e))}function lr(e){try{if(e.matches(":popover-open"))return!0}catch{}try{return e.matches(":modal")}catch{return!1}}const tu=/transform|translate|scale|rotate|perspective|filter/,eu=/paint|layout|strict|content/,Ae=e=>!!e&&e!=="none";let $s;function cr(e){const t=jt(e)?Nt(e):e;return Ae(t.transform)||Ae(t.translate)||Ae(t.scale)||Ae(t.rotate)||Ae(t.perspective)||!Os()&&(Ae(t.backdropFilter)||Ae(t.filter))||tu.test(t.willChange||"")||eu.test(t.contain||"")}function ou(e){let t=ae(e);for(;Ft(t)&&!We(t);){if(cr(t))return t;if(lr(t))return null;t=ae(t)}return null}function Os(){return $s==null&&($s=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),$s}function We(e){return/^(html|body|#document)$/.test(Ze(e))}function Nt(e){return vt(e).getComputedStyle(e)}function dr(e){return jt(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function ae(e){if(Ze(e)==="html")return e;const t=e.assignedSlot||e.parentNode||Va(e)&&e.host||Pt(e);return Va(t)?t.host:t}function Xa(e){const t=ae(e);return We(t)?e.ownerDocument?e.ownerDocument.body:e.body:Ft(t)&&wo(t)?t:Xa(t)}function Lo(e,t,o){var r;t===void 0&&(t=[]),o===void 0&&(o=!0);const s=Xa(e),i=s===((r=e.ownerDocument)==null?void 0:r.body),a=vt(s);if(i){const n=_s(a);return t.concat(a,a.visualViewport||[],wo(s)?s:[],n&&o?Lo(n):[])}else return t.concat(s,Lo(s,[],o))}function _s(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Ka(e){const t=Nt(e);let o=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const s=Ft(e),i=s?e.offsetWidth:o,a=s?e.offsetHeight:r,n=rr(o)!==i||rr(r)!==a;return n&&(o=i,r=a),{width:o,height:r,$:n}}function Ps(e){return jt(e)?e:e.contextElement}function Fe(e){const t=Ps(e);if(!Ft(t))return _t(1);const o=t.getBoundingClientRect(),{width:r,height:s,$:i}=Ka(t);let a=(i?rr(o.width):o.width)/r,n=(i?rr(o.height):o.height)/s;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const ru=_t(0);function qa(e){const t=vt(e);return!Os()||!t.visualViewport?ru:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function su(e,t,o){return t===void 0&&(t=!1),!o||t&&o!==vt(e)?!1:t}function je(e,t,o,r){t===void 0&&(t=!1),o===void 0&&(o=!1);const s=e.getBoundingClientRect(),i=Ps(e);let a=_t(1);t&&(r?jt(r)&&(a=Fe(r)):a=Fe(e));const n=su(i,o,r)?qa(i):_t(0);let l=(s.left+n.x)/a.x,c=(s.top+n.y)/a.y,u=s.width/a.x,h=s.height/a.y;if(i){const M=vt(i),y=r&&jt(r)?vt(r):r;let w=M,C=_s(w);for(;C&&r&&y!==w;){const j=Fe(C),A=C.getBoundingClientRect(),b=Nt(C),f=A.left+(C.clientLeft+parseFloat(b.paddingLeft))*j.x,L=A.top+(C.clientTop+parseFloat(b.paddingTop))*j.y;l*=j.x,c*=j.y,u*=j.x,h*=j.y,l+=f,c+=L,w=vt(C),C=_s(w)}}return ar({width:u,height:h,x:l,y:c})}function ur(e,t){const o=dr(e).scrollLeft;return t?t.left+o:je(Pt(e)).left+o}function tn(e,t){const o=e.getBoundingClientRect(),r=o.left+t.scrollLeft-ur(e,o),s=o.top+t.scrollTop;return{x:r,y:s}}function iu(e){let{elements:t,rect:o,offsetParent:r,strategy:s}=e;const i=s==="fixed",a=Pt(r),n=t?lr(t.floating):!1;if(r===a||n&&i)return o;let l={scrollLeft:0,scrollTop:0},c=_t(1);const u=_t(0),h=Ft(r);if((h||!h&&!i)&&((Ze(r)!=="body"||wo(a))&&(l=dr(r)),h)){const y=je(r);c=Fe(r),u.x=y.x+r.clientLeft,u.y=y.y+r.clientTop}const M=a&&!h&&!i?tn(a,l):_t(0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-l.scrollLeft*c.x+u.x+M.x,y:o.y*c.y-l.scrollTop*c.y+u.y+M.y}}function au(e){return Array.from(e.getClientRects())}function nu(e){const t=Pt(e),o=dr(e),r=e.ownerDocument.body,s=yt(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),i=yt(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let a=-o.scrollLeft+ur(e);const n=-o.scrollTop;return Nt(r).direction==="rtl"&&(a+=yt(t.clientWidth,r.clientWidth)-s),{width:s,height:i,x:a,y:n}}const en=25;function lu(e,t){const o=vt(e),r=Pt(e),s=o.visualViewport;let i=r.clientWidth,a=r.clientHeight,n=0,l=0;if(s){i=s.width,a=s.height;const u=Os();(!u||u&&t==="fixed")&&(n=s.offsetLeft,l=s.offsetTop)}const c=ur(r);if(c<=0){const u=r.ownerDocument,h=u.body,M=getComputedStyle(h),y=u.compatMode==="CSS1Compat"&&parseFloat(M.marginLeft)+parseFloat(M.marginRight)||0,w=Math.abs(r.clientWidth-h.clientWidth-y);w<=en&&(i-=w)}else c<=en&&(i+=c);return{width:i,height:a,x:n,y:l}}function cu(e,t){const o=je(e,!0,t==="fixed"),r=o.top+e.clientTop,s=o.left+e.clientLeft,i=Ft(e)?Fe(e):_t(1),a=e.clientWidth*i.x,n=e.clientHeight*i.y,l=s*i.x,c=r*i.y;return{width:a,height:n,x:l,y:c}}function on(e,t,o){let r;if(t==="viewport")r=lu(e,o);else if(t==="document")r=nu(Pt(e));else if(jt(t))r=cu(t,o);else{const s=qa(e);r={x:t.x-s.x,y:t.y-s.y,width:t.width,height:t.height}}return ar(r)}function rn(e,t){const o=ae(e);return o===t||!jt(o)||We(o)?!1:Nt(o).position==="fixed"||rn(o,t)}function du(e,t){const o=t.get(e);if(o)return o;let r=Lo(e,[],!1).filter(n=>jt(n)&&Ze(n)!=="body"),s=null;const i=Nt(e).position==="fixed";let a=i?ae(e):e;for(;jt(a)&&!We(a);){const n=Nt(a),l=cr(a);!l&&n.position==="fixed"&&(s=null),(i?!l&&!s:!l&&n.position==="static"&&!!s&&(s.position==="absolute"||s.position==="fixed")||wo(a)&&!l&&rn(e,a))?r=r.filter(u=>u!==a):s=n,a=ae(a)}return t.set(e,r),r}function uu(e){let{element:t,boundary:o,rootBoundary:r,strategy:s}=e;const a=[...o==="clippingAncestors"?lr(t)?[]:du(t,this._c):[].concat(o),r],n=on(t,a[0],s);let l=n.top,c=n.right,u=n.bottom,h=n.left;for(let M=1;M<a.length;M++){const y=on(t,a[M],s);l=yt(y.top,l),c=se(y.right,c),u=se(y.bottom,u),h=yt(y.left,h)}return{width:c-h,height:u-l,x:h,y:l}}function pu(e){const{width:t,height:o}=Ka(e);return{width:t,height:o}}function hu(e,t,o){const r=Ft(t),s=Pt(t),i=o==="fixed",a=je(e,!0,i,t);let n={scrollLeft:0,scrollTop:0};const l=_t(0);function c(){l.x=ur(s)}if(r||!r&&!i)if((Ze(t)!=="body"||wo(s))&&(n=dr(t)),r){const y=je(t,!0,i,t);l.x=y.x+t.clientLeft,l.y=y.y+t.clientTop}else s&&c();i&&!r&&s&&c();const u=s&&!r&&!i?tn(s,n):_t(0),h=a.left+n.scrollLeft-l.x-u.x,M=a.top+n.scrollTop-l.y-u.y;return{x:h,y:M,width:a.width,height:a.height}}function Rs(e){return Nt(e).position==="static"}function sn(e,t){if(!Ft(e)||Nt(e).position==="fixed")return null;if(t)return t(e);let o=e.offsetParent;return Pt(e)===o&&(o=o.ownerDocument.body),o}function an(e,t){const o=vt(e);if(lr(e))return o;if(!Ft(e)){let s=ae(e);for(;s&&!We(s);){if(jt(s)&&!Rs(s))return s;s=ae(s)}return o}let r=sn(e,t);for(;r&&qd(r)&&Rs(r);)r=sn(r,t);return r&&We(r)&&Rs(r)&&!cr(r)?o:r||ou(e)||o}const gu=async function(e){const t=this.getOffsetParent||an,o=this.getDimensions,r=await o(e.floating);return{reference:hu(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function mu(e){return Nt(e).direction==="rtl"}const pr={convertOffsetParentRelativeRectToViewportRelativeRect:iu,getDocumentElement:Pt,getClippingRect:uu,getOffsetParent:an,getElementRects:gu,getClientRects:au,getDimensions:pu,getScale:Fe,isElement:jt,isRTL:mu};function nn(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function fu(e,t){let o=null,r;const s=Pt(e);function i(){var n;clearTimeout(r),(n=o)==null||n.disconnect(),o=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),i();const c=e.getBoundingClientRect(),{left:u,top:h,width:M,height:y}=c;if(n||t(),!M||!y)return;const w=sr(h),C=sr(s.clientWidth-(u+M)),j=sr(s.clientHeight-(h+y)),A=sr(u),f={rootMargin:-w+"px "+-C+"px "+-j+"px "+-A+"px",threshold:yt(0,se(1,l))||1};let L=!0;function I(x){const N=x[0].intersectionRatio;if(N!==l){if(!L)return a();N?a(!1,N):r=setTimeout(()=>{a(!1,1e-7)},1e3)}N===1&&!nn(c,e.getBoundingClientRect())&&a(),L=!1}try{o=new IntersectionObserver(I,{...f,root:s.ownerDocument})}catch{o=new IntersectionObserver(I,f)}o.observe(e)}return a(!0),i}function bu(e,t,o,r){r===void 0&&(r={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=r,c=Ps(e),u=s||i?[...c?Lo(c):[],...t?Lo(t):[]]:[];u.forEach(A=>{s&&A.addEventListener("scroll",o,{passive:!0}),i&&A.addEventListener("resize",o)});const h=c&&n?fu(c,o):null;let M=-1,y=null;a&&(y=new ResizeObserver(A=>{let[b]=A;b&&b.target===c&&y&&t&&(y.unobserve(t),cancelAnimationFrame(M),M=requestAnimationFrame(()=>{var f;(f=y)==null||f.observe(t)})),o()}),c&&!l&&y.observe(c),t&&y.observe(t));let w,C=l?je(e):null;l&&j();function j(){const A=je(e);C&&!nn(C,A)&&o(),C=A,w=requestAnimationFrame(j)}return o(),()=>{var A;u.forEach(b=>{s&&b.removeEventListener("scroll",o),i&&b.removeEventListener("resize",o)}),h==null||h(),(A=y)==null||A.disconnect(),y=null,l&&cancelAnimationFrame(w)}}const yu=Vd,vu=Xd,Mu=Fd,ln=Kd,wu=Wd,Lu=(e,t,o)=>{const r=new Map,s={platform:pr,...o},i={...s.platform,_c:r};return Zd(e,t,{...s,platform:i})};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const cn=Na(class extends Sa{constructor(e){var t;if(super(e),e.type!==ja.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){var r,s;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter((i=>i!==""))));for(const i in t)t[i]&&!((r=this.nt)!=null&&r.has(i))&&this.st.add(i);return this.render(t)}const o=e.element.classList;for(const i of this.st)i in t||(o.remove(i),this.st.delete(i));for(const i in t){const a=!!t[i];a===this.st.has(i)||(s=this.nt)!=null&&s.has(i)||(a?(o.add(i),this.st.add(i)):(o.remove(i),this.st.delete(i)))}return re}});function xu(e){return Iu(e)}function Us(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Iu(e){for(let t=e;t;t=Us(t))if(t instanceof Element&&getComputedStyle(t).display==="none")return null;for(let t=Us(e);t;t=Us(t)){if(!(t instanceof Element))continue;const o=getComputedStyle(t);if(o.display!=="contents"&&(o.position!=="static"||cr(o)||t.tagName==="BODY"))return t}return null}function Cu(e){return e!==null&&typeof e=="object"&&"getBoundingClientRect"in e&&("contextElement"in e?e.contextElement instanceof Element:!0)}var W=class extends Mo{constructor(){super(...arguments),this.localize=new Cd(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),o=this.placement.includes("top")||this.placement.includes("bottom");let r=0,s=0,i=0,a=0,n=0,l=0,c=0,u=0;o?e.top<t.top?(r=e.left,s=e.bottom,i=e.right,a=e.bottom,n=t.left,l=t.top,c=t.right,u=t.top):(r=t.left,s=t.bottom,i=t.right,a=t.bottom,n=e.left,l=e.top,c=e.right,u=e.top):e.left<t.left?(r=e.right,s=e.top,i=t.left,a=t.top,n=e.right,l=e.bottom,c=t.left,u=t.bottom):(r=t.right,s=t.top,i=e.left,a=e.top,n=t.right,l=t.bottom,c=e.left,u=e.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${r}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchor instanceof Element||Cu(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=bu(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;const e=[yu({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(ln({apply:({rects:o})=>{const r=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=r?`${o.reference.width}px`:"",this.popup.style.height=s?`${o.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(Mu({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(vu({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(ln({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:o,availableHeight:r})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${r}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${o}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(wu({element:this.arrowEl,padding:this.arrowPadding}));const t=this.strategy==="absolute"?o=>pr.getOffsetParent(o,xu):pr.getOffsetParent;Lu(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:Td(Ba({},pr),{getOffsetParent:t})}).then(({x:o,y:r,middlewareData:s,placement:i})=>{const a=this.localize.dir()==="rtl",n={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${o}px`,top:`${r}px`}),this.arrow){const l=s.arrow.x,c=s.arrow.y;let u="",h="",M="",y="";if(this.arrowPlacement==="start"){const w=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",h=a?w:"",y=a?"":w}else if(this.arrowPlacement==="end"){const w=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";h=a?"":w,y=a?w:"",M=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(y=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",u=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(y=typeof l=="number"?`${l}px`:"",u=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:u,right:h,bottom:M,left:y,[n]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return at`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${cn({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${cn({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?at`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};W.styles=[Ad,Ld],Z([fa(".popup")],W.prototype,"popup"),Z([fa(".popup__arrow")],W.prototype,"arrowEl"),Z([$()],W.prototype,"anchor"),Z([$({type:Boolean,reflect:!0})],W.prototype,"active"),Z([$({reflect:!0})],W.prototype,"placement"),Z([$({reflect:!0})],W.prototype,"strategy"),Z([$({type:Number})],W.prototype,"distance"),Z([$({type:Number})],W.prototype,"skidding"),Z([$({type:Boolean})],W.prototype,"arrow"),Z([$({attribute:"arrow-placement"})],W.prototype,"arrowPlacement"),Z([$({attribute:"arrow-padding",type:Number})],W.prototype,"arrowPadding"),Z([$({type:Boolean})],W.prototype,"flip"),Z([$({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(t=>t.trim()).filter(t=>t!==""),toAttribute:e=>e.join(" ")}})],W.prototype,"flipFallbackPlacements"),Z([$({attribute:"flip-fallback-strategy"})],W.prototype,"flipFallbackStrategy"),Z([$({type:Object})],W.prototype,"flipBoundary"),Z([$({attribute:"flip-padding",type:Number})],W.prototype,"flipPadding"),Z([$({type:Boolean})],W.prototype,"shift"),Z([$({type:Object})],W.prototype,"shiftBoundary"),Z([$({attribute:"shift-padding",type:Number})],W.prototype,"shiftPadding"),Z([$({attribute:"auto-size"})],W.prototype,"autoSize"),Z([$()],W.prototype,"sync"),Z([$({type:Object})],W.prototype,"autoSizeBoundary"),Z([$({attribute:"auto-size-padding",type:Number})],W.prototype,"autoSizePadding"),Z([$({attribute:"hover-bridge",type:Boolean})],W.prototype,"hoverBridge"),W.define("sl-popup");const Au=At`

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
    
`,ju=At`
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
`,Nu=At`
    
    em, i {
        font-style: normal;
        font-family: var(--font-stack-italic), monospace;
    }
    
    strong {
        font-style: normal;
        font-family: var(--font-stack-bold), monospace;
    }
    

`;var D=(e=>(e.VERSION="version",e.SCHEMA="schema",e.SCHEMAS="schemas",e.SCHEMA_TYPES="types",e.MEDIA_TYPE="mediaType",e.HEADER="header",e.EXAMPLE="example",e.EXAMPLES="examples",e.ENCODING="encoding",e.REQUEST_BODY="requestBody",e.REQUEST_BODIES="requestBodies",e.PARAMETER="parameter",e.PARAMETER_QUERY="query",e.COOKIE="cookie",e.PARAMETERS="parameters",e.LINK="link",e.LINKS="links",e.RESPONSE="response",e.RESPONSES="responses",e.OPERATION="operation",e.OPERATIONS="operations",e.SECURITY_SCHEME="securityScheme",e.SECURITY_SCHEMES="securitySchemes",e.EXTERNAL_DOCS="externalDocs",e.SECURITY="security",e.CALLBACK="callback",e.CALLBACKS="callbacks",e.PATH_ITEM="pathItem",e.PATH_ITEMS="pathItems",e.XML="xml",e.HEADERS="headers",e.SERVER="server",e.SERVERS="servers",e.SERVER_VARIABLE="serverVariable",e.PATHS="paths",e.COMPONENTS="components",e.CONTACT="contact",e.LICENSE="license",e.INFO="info",e.TAG="tag",e.TAGS="tags",e.DOCUMENT="document",e.WEBHOOK="webhook",e.WEBHOOKS="webhooks",e.EXTENSIONS="extensions",e.EXTENSION="extension",e.NO_EXAMPLE="noExample",e.POLYMORPHIC="polymorphic",e.ERROR="error",e.WARNING="warning",e.ROLODEX_FILE="rolodex-file",e.ROLODEX_FOLDER="rolodex-dir",e.OPENAPI="openapi",e.UPLOAD="upload",e.ADD="add",e.UNKNOWN="unknown",e.EXPAND_NODE="expand-node",e.POV_MODE="pov-mode",e.JS="js",e.GO="go",e.TS="ts",e.CS="cs",e.C="c",e.CPP="cpp",e.PHP="php",e.PY="py",e.HTML="html",e.MD="md",e.JAVA="java",e.RS="rs",e.ZIG="zig",e.RB="rb",e.YAML="yaml",e.JSON="json",e))(D||{}),Su=Object.defineProperty,Du=Object.getOwnPropertyDescriptor,xo=(e,t,o,r)=>{for(var s=r>1?void 0:r?Du(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Su(t,o,s),s},dn=(e=>(e.tiny="tiny",e.small="small",e.smaller="smaller",e.medium="medium",e.large="large",e.huge="huge",e))(dn||{}),un=(e=>(e.primary="primary",e.secondary="secondary",e.inverse="inverse",e.font="font",e.warning="warning",e.polymorphic="polymorphic",e.error="error",e.filtered="filtered",e))(un||{});let ne=class extends Ot{constructor(){super(),this._themeHandler=()=>this.requestUpdate(),this.size="medium",this.color="primary"}getSize(){switch(this.size){case"tiny":return"0.8rem";case"smaller":return"1.2rem";case"medium":return"1.4rem";case"large":return"1.8rem";case"huge":return"2rem";case"small":default:return"1rem"}}getIconColor(){switch(this.color){case"primary":return"var(--primary-color)";case"secondary":return"var(--secondary-color)";case"warning":return"var(--warn-color);";case"polymorphic":return"var(--warn-color);";case"error":return"var(--error-color)";case"inverse":return"var(--background-color)";case"filtered":return"var(--font-color-sub2)";case"font":default:return"var(--font-color)"}}connectedCallback(){super.connectedCallback(),window.addEventListener(Cs,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(Cs,this._themeHandler)}isLightMode(){return document.documentElement.getAttribute("theme")==="light"}getNodeTypeFromIcon(e){return Object.values(D).includes(e)?e:D.SCHEMA}static getIconForType(e){switch(e){case D.DOCUMENT:return"stars";case D.SCHEMA:return"box";case D.SCHEMA_TYPES:return"diagram-3";case D.MEDIA_TYPE:case D.XML:return"code-slash";case D.HEADER:case D.HEADERS:return"envelope";case D.EXAMPLE:case D.EXAMPLES:return"chat-left-quote";case D.ENCODING:return"box-seam";case D.REQUEST_BODY:case D.REQUEST_BODIES:return"box-arrow-in-right";case D.PARAMETER:case D.PARAMETERS:case D.SERVER_VARIABLE:return"braces-asterisk";case D.PARAMETER_QUERY:return"question-lg";case D.COOKIE:return"cookie";case D.LINK:case D.LINKS:return"link";case D.RESPONSE:case D.RESPONSES:return"box-arrow-left";case D.OPERATION:case D.OPERATIONS:return"gear-wide-connected";case D.SECURITY_SCHEME:case D.SECURITY_SCHEMES:case D.SECURITY:return"shield-lock";case D.CALLBACK:case D.CALLBACKS:return"telephone-outbound";case D.PATH_ITEM:case D.PATH_ITEMS:return"geo";case D.SERVER:case D.SERVERS:return"hdd-network";case D.PATHS:return"compass";case D.COMPONENTS:return"boxes";case D.CONTACT:return"person-circle";case D.LICENSE:return"patch-check";case D.UPLOAD:return"upload";case D.INFO:return"info-square";case D.TAG:return"tag";case D.TAGS:return"tags";case D.VERSION:return"award";case D.EXTENSIONS:case D.EXTENSION:return"plug";case D.WEBHOOK:case D.WEBHOOKS:return"arrow-clockwise";case D.NO_EXAMPLE:return"exclamation-circle";case D.POLYMORPHIC:return"diagram-3";case D.ERROR:return"x-square";case D.WARNING:return"exclamation-triangle";case D.ROLODEX_FOLDER:return"folder";case D.ROLODEX_FILE:return"journal-code";case D.JS:return"filetype-js";case D.PHP:return"filetype-php";case D.PY:return"filetype-py";case D.HTML:return"filetype-html";case D.MD:return"markdown";case D.JAVA:return"filetype-java";case D.EXTERNAL_DOCS:return"journals";case D.RB:return"filetype-rb";case D.EXPAND_NODE:return"node-plus";case D.POV_MODE:return"binoculars";default:return"box"}}openapiIcon(){return this.isLightMode()?"PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogIzAwMDsiLz4KPC9zdmc+":"PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogI2ZmZjsiLz4KPC9zdmc+"}goIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIuMDAwMDAxIj4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMDIwLjM2MjIpIj4KICAgIDxlbGxpcHNlIGN4PSItOTA3LjM1NjU3IiBjeT0iNDc5LjkwMDA5IiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0ic2NhbGUoLTEgMSkgcm90YXRlKC02MC41NDgpIi8+CiAgICA8ZWxsaXBzZSBjeD0iLTg5MS41NzY1NCIgY3k9IjUwNy44NDYxIiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0icm90YXRlKC02MC41NDgpIi8+CiAgICA8cGF0aCBmaWxsPSIjMzg0ZTU0IiBkPSJNMTYuMDkxNjkzIDEwMjEuMzY0MmMtMS4xMDU3NDkuMDEtMi4yMTAzNDEuMDQ5LTMuMzE2MDkuMDlDNi44NDIyNTU4IDEwMjEuNjczOCAyIDEwMjYuMzk0MiAyIDEwMzIuMzYyMnYyMGgyOHYtMjBjMC01Ljk2ODMtNC42NjczNDUtMTAuNDkxMi0xMC41OTAyMy0xMC45MDgtMS4xMDU3NS0uMDc4LTIuMjEyMzI4LS4wOTktMy4zMTgwNzctLjA5eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNNC42MDc4ODY3IDEwMjUuMDQ2MmMuNDU5NTY0LjI1OTUgMS44MTgyNjIgMS4yMDEzIDEuOTgwOTgzIDEuNjQ4LjE4MzQwMS41MDM1LjE1OTM4NSAxLjA2NTctLjExNDYxNCAxLjU1MS0uMzQ2NjI3LjYxMzgtMS4wMDUzNDEuOTQ4Ny0xLjY5NjQyMS45MzY1LS4zMzk4ODYtLjAxLTEuNzIwMjgzLS42MzcyLTIuMDQyNTYxLS44MTkyLS45Nzc1NC0uNTUxOS0xLjM1MDc5NS0xLjc0MTgtLjgzMzY4Ni0yLjY1NzYuNTE3MTA5LS45MTU4IDEuNzI4NzQ5LTEuMjEwNyAyLjcwNjI5OS0uNjU4N3oiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuMDg2NjY1OSIgaGVpZ2h0PSIzLjUzMTM2NjMiIHg9IjE0LjQwNjIxMyIgeT0iMTAzNS42ODQyIiBmaWxsLW9wYWNpdHk9Ii4zMjg1MDI0NiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiByeT0iLjYyNDI2MzI5IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMTYgMTAyMy4zNjIyYy05IDAtMTIgMy43MTUzLTEyIDl2MjBoMjRjLS4wNDg4OS03LjM1NjIgMC0xOCAwLTIwIDAtNS4yODQ4LTMtOS0xMi05eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMjcuMDc0MDczIDEwMjUuMDQ2MmMtLjQ1OTU3LjI1OTUtMS44MTgyNTcgMS4yMDEzLTEuOTgwOTc5IDEuNjQ4LS4xODM0MDEuNTAzNS0uMTU5Mzg0IDEuMDY1Ny4xMTQ2MTQgMS41NTEuMzQ2NjI3LjYxMzggMS4wMDUzMzUuOTQ4NyAxLjY5NjQxNS45MzY1LjMzOTg4LS4wMSAxLjcyMDI5LS42MzcyIDIuMDQyNTYtLjgxOTIuOTc3NTQtLjU1MTkgMS4zNTA3OS0xLjc0MTguODMzNjktMi42NTc2LS41MTcxMS0uOTE1OC0xLjcyODc2LTEuMjEwNy0yLjcwNjMtLjY1ODd6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjE3NTczNCIgY3k9IjEwMzAuMzU0MiIgcj0iNC42NTM3NTQyIiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjEwLjMzOTQ4NiIgY3k9IjEwMzAuMzU0MiIgcj0iNC44MzE2MzQ1IiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxyZWN0IHdpZHRoPSIzLjY2NzM2ODciIGhlaWdodD0iNC4xMDYzNDA5IiB4PSIxNC4xMTU4NjMiIHk9IjEwMzUuOTE3NCIgZmlsbC1vcGFjaXR5PSIuMzI5NDExNzYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcnk9Ii43MjU5MDUzNiIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuNjY3MzY4NyIgaGVpZ2h0PSI0LjEwNjM0MDkiIHg9IjE0LjExNTg2MyIgeT0iMTAzNS4yMjUzIiBmaWxsPSIjZmZmY2ZiIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ5PSIuNzI1OTA1MzYiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjMyOTQxMTc2IiBkPSJNMTkuOTk5NzM1IDEwMzYuNTI4OWMwIC44MzgtLjg3MTIyOCAxLjI2ODItMi4xNDQ3NjYgMS4xNjU5LS4wMjM2NiAwLS4wNDc5NS0uNjAwNC0uMjU0MTQ3LS41ODMyLS41MDM2NjkuMDQyLTEuMDk1OTAyLS4wMi0xLjY4NTk2NC0uMDItLjYxMjkzOSAwLTEuMjA2MzQyLjE4MjYtMS42ODU0OS4wMTctLjExMDIzMy0uMDM4LS4xNzgyOTguNTgzOC0uMjYxNTMyLjU4MTYtMS4yNDM2ODUtLjAzMy0yLjA3ODgwMy0uMzM4My0yLjA3ODgwMy0xLjE2MTggMC0xLjIxMTggMS44MTU2MzUtMi4xOTQxIDQuMDU1MzUxLTIuMTk0MSAyLjIzOTcwNCAwIDQuMDU1MzUxLjk4MjMgNC4wNTUzNTEgMi4xOTQxeiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjYzM4Yzc0IiBkPSJNMTkuOTc3NDE0IDEwMzUuNzAwNGMwIC41Njg1LS40MzM2NTkuODU1NC0xLjEzODA5MSAxLjAwMDEtLjI5MTkzMy4wNi0uNjMwMzcxLjA5Ni0xLjAwMzcxOS4xMTY2LS41NjQwNS4wMzItMS4yMDc3ODIuMDMxLTEuODkxMjIuMDMxLS42NzI4MzQgMC0xLjMwNzE4MiAwLTEuODY0OTA0LS4wMjktLjMwNjI2OC0uMDE3LS41ODk0MjktLjA0My0uODQzMTY0LS4wODQtLjgxMzgzMy0uMTMxOC0xLjMyNDk2Mi0uNDE3LTEuMzI0OTYyLTEuMDM0NCAwLTEuMTYwMSAxLjgwNTY0Mi0yLjEwMDYgNC4wMzMwMy0yLjEwMDYgMi4yMjczNzcgMCA0LjAzMzAzLjk0MDUgNC4wMzMwMyAyLjEwMDZ6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxlbGxpcHNlIGN4PSIxNS45NDQzODIiIGN5PSIxMDMzLjg1MDEiIGZpbGw9IiMyMzIwMWYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcng9IjIuMDgwMTczMyIgcnk9IjEuMzQzNzQ3IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIxMi40MTQyMDEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIyMy4xMTAxMjEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzODRlNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIuMzk3MzA4NzQiIGQ9Ik01LjAwNTUzNzcgMTAyNy4yNzI3Yy0xLjE3MDQzNS0xLjA4MzUtMi4wMjY5NzMtLjc3MjEtMi4wNDQxNzItLjc0NjMiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4NGU1NCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9Ii4zOTczMDg3NCIgZD0iTTQuMzg1MjQ1NyAxMDI2LjkxNTJjLTEuMTU4NTU3LjAzNi0xLjM0NjcwNC42MzAzLTEuMzM4ODEuNjUyM20yMy41ODQwOTczLS4zOTUxYzEuMTcwNDMtMS4wODM1IDIuMDI2OTctLjc3MjEgMi4wNDQxNy0uNzQ2MyIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzg0ZTU0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iLjM5NzMwODc0IiBkPSJNMjcuMzIxNzczIDEwMjYuNjczYzEuMTU4NTYuMDM2IDEuMzQ2Ny42MzAyIDEuMzM4OC42NTIyIi8+CiAgPC9nPgo8L3N2Zz4="}typescriptIcon(){return"CjxzdmcgZmlsbD0ibm9uZSIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiMzMTc4YzYiIGhlaWdodD0iNTEyIiByeD0iNTAiIHdpZHRoPSI1MTIiLz48cmVjdCBmaWxsPSIjMzE3OGM2IiBoZWlnaHQ9IjUxMiIgcng9IjUwIiB3aWR0aD0iNTEyIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMzE2LjkzOSA0MDcuNDI0djUwLjA2MWM4LjEzOCA0LjE3MiAxNy43NjMgNy4zIDI4Ljg3NSA5LjM4NnMyMi44MjMgMy4xMjkgMzUuMTM1IDMuMTI5YzExLjk5OSAwIDIzLjM5Ny0xLjE0NyAzNC4xOTYtMy40NDIgMTAuNzk5LTIuMjk0IDIwLjI2OC02LjA3NSAyOC40MDYtMTEuMzQyIDguMTM4LTUuMjY2IDE0LjU4MS0xMi4xNSAxOS4zMjgtMjAuNjVzNy4xMjEtMTkuMDA3IDcuMTIxLTMxLjUyMmMwLTkuMDc0LTEuMzU2LTE3LjAyNi00LjA2OS0yMy44NTdzLTYuNjI1LTEyLjkwNi0xMS43MzgtMTguMjI1Yy01LjExMi01LjMxOS0xMS4yNDItMTAuMDkxLTE4LjM4OS0xNC4zMTVzLTE1LjIwNy04LjIxMy0yNC4xOC0xMS45NjdjLTYuNTczLTIuNzEyLTEyLjQ2OC01LjM0NS0xNy42ODUtNy45LTUuMjE3LTIuNTU2LTkuNjUxLTUuMTYzLTEzLjMwMy03LjgyMi0zLjY1Mi0yLjY2LTYuNDY5LTUuNDc2LTguNDUxLTguNDQ4LTEuOTgyLTIuOTczLTIuOTc0LTYuMzM2LTIuOTc0LTEwLjA5MSAwLTMuNDQxLjg4Ny02LjU0NCAyLjY2MS05LjMwOHM0LjI3OC01LjEzNiA3LjUxMi03LjExOGMzLjIzNS0xLjk4MSA3LjE5OS0zLjUyIDExLjg5NC00LjYxNSA0LjY5Ni0xLjA5NSA5LjkxMi0xLjY0MiAxNS42NTEtMS42NDIgNC4xNzMgMCA4LjU4MS4zMTMgMTMuMjI0LjkzOCA0LjY0My42MjYgOS4zMTIgMS41OTEgMTQuMDA4IDIuODk0IDQuNjk1IDEuMzA0IDkuMjU5IDIuOTQ3IDEzLjY5NCA0LjkyOCA0LjQzNCAxLjk4MiA4LjUyOSA0LjI3NiAxMi4yODUgNi44ODR2LTQ2Ljc3NmMtNy42MTYtMi45Mi0xNS45MzctNS4wODQtMjQuOTYyLTYuNDkycy0xOS4zODEtMi4xMTItMzEuMDY2LTIuMTEyYy0xMS44OTUgMC0yMy4xNjMgMS4yNzgtMzMuODA1IDMuODMzcy0yMC4wMDYgNi41NDQtMjguMDkzIDExLjk2N2MtOC4wODYgNS40MjQtMTQuNDc2IDEyLjMzMy0xOS4xNzEgMjAuNzI5LTQuNjk1IDguMzk1LTcuMDQzIDE4LjQzMy03LjA0MyAzMC4xMTQgMCAxNC45MTQgNC4zMDQgMjcuNjM4IDEyLjkxMiAzOC4xNzIgOC42MDcgMTAuNTMzIDIxLjY3NSAxOS40NSAzOS4yMDQgMjYuNzUxIDYuODg2IDIuODE2IDEzLjMwMyA1LjU3OSAxOS4yNSA4LjI5MXMxMS4wODYgNS41MjggMTUuNDE1IDguNDQ4YzQuMzMgMi45MiA3Ljc0NyA2LjEwMSAxMC4yNTIgOS41NDMgMi41MDQgMy40NDEgMy43NTYgNy4zNTIgMy43NTYgMTEuNzMzIDAgMy4yMzMtLjc4MyA2LjIzMS0yLjM0OCA4Ljk5NXMtMy45MzkgNS4xNjItNy4xMjEgNy4xOTYtNy4xNDcgMy42MjQtMTEuODk0IDQuNzcxYy00Ljc0OCAxLjE0OC0xMC4zMDMgMS43MjEtMTYuNjY4IDEuNzIxLTEwLjg1MSAwLTIxLjU5Ny0xLjkwMy0zMi4yNC01LjcxLTEwLjY0Mi0zLjgwNi0yMC41MDItOS41MTYtMjkuNTc5LTE3LjEzem0tODQuMTU5LTEyMy4zNDJoNjQuMjJ2LTQxLjA4MmgtMTc5djQxLjA4Mmg2My45MDZ2MTgyLjkxOGg1MC44NzR6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4="}csIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHdpZHRoPSIyMDQuOCIKICAgaGVpZ2h0PSIyMDQuOCIKICAgdmlld0JveD0iMCAwIDU0LjE4NjY2NiA1NC4xODY2NjciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImEiCiAgICAgICB4MT0iNDYuNzczIgogICAgICAgeDI9IjY5LjkwNyIKICAgICAgIHkxPSI4Ni40NjIiCiAgICAgICB5Mj0iMTI2LjczMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzMy45ODMgLTUxOC45NzQpIHNjYWxlKDguNzg5OTYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcAogICAgICAgICBzdG9wLWNvbG9yPSIjOTI3QkU1IgogICAgICAgICBpZD0ic3RvcDEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3RvcC1jb2xvcj0iIzUxMkJENCIKICAgICAgICAgaWQ9InN0b3AyIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxmaWx0ZXIKICAgICAgIGlkPSJiIgogICAgICAgd2lkdGg9IjQyLjg0NSIKICAgICAgIGhlaWdodD0iMzkuMTM2IgogICAgICAgeD0iNDQuNjI5IgogICAgICAgeT0iOTEuODkiCiAgICAgICBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiCiAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8ZmVGbG9vZAogICAgICAgICBmbG9vZC1vcGFjaXR5PSIwIgogICAgICAgICByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgaWQ9ImZlRmxvb2QyIiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MiIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGlkPSJmZU9mZnNldDIiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgzIiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIGlkPSJmZUJsZW5kMyIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgaW49IlNvdXJjZUFscGhhIgogICAgICAgICByZXN1bHQ9ImhhcmRBbHBoYSIKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIgogICAgICAgICBpZD0iZmVDb2xvck1hdHJpeDQiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMSIKICAgICAgICAgaWQ9ImZlT2Zmc2V0NCIgLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMi40OTkiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjQiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg1IiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgcmVzdWx0PSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBpZD0iZmVCbGVuZDUiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIGluPSJTb3VyY2VBbHBoYSIKICAgICAgICAgcmVzdWx0PSJoYXJkQWxwaGEiCiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg2IiAvPgogICAgICA8ZmVPZmZzZXQKICAgICAgICAgZHk9IjQiCiAgICAgICAgIGlkPSJmZU9mZnNldDYiIC8+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBzdGREZXZpYXRpb249IjIiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjYiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA5IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4NyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0M19kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ3IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OCIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGR5PSI5IgogICAgICAgICBpZD0iZmVPZmZzZXQ4IiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIyLjUiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjgiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA1IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QzX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NF9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MTAiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMTUiCiAgICAgICAgIGlkPSJmZU9mZnNldDEwIiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIzIgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxMCIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3Q0X2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9InNoYXBlIgogICAgICAgICBpZD0iZmVCbGVuZDEyIiAvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxwYXRoCiAgICAgZD0iTTEzNS43MzEgMjg1Ljg1djE3My45M2MwIDIxLjUxNyAxMS40NzggNDEuNDE4IDMwLjEyNSA1Mi4xNjhsMTUwLjYyNCA4Ni45NzZhNjAuMjIzIDYwLjIyMyAwIDAgMCA2MC4yNSAwbDE1MC42MjMtODYuOTc2YTYwLjIzNyA2MC4yMzcgMCAwIDAgMzAuMTI0LTUyLjE2OVYyODUuODUxYzAtMjEuNTI1LTExLjQ3Ny00MS40MjMtMzAuMTI0LTUyLjE3N0wzNzYuNzI5IDE0Ni43MmE2MC4yMSA2MC4yMSAwIDAgMC02MC4yNDkgMGwtMTUwLjYyNCA4Ni45NTRhNjAuMjQ1IDYwLjI0NSAwIDAgMC0zMC4xMjUgNTIuMTc3eiIKICAgICBmaWxsPSJ1cmwoI2EpIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KC4xIDAgMCAuMSAtNy41NjcgLTEwLjE4OSkiCiAgICAgaWQ9InBhdGgxMiIgLz4KICA8cGF0aAogICAgIGQ9Ik01NC4wNTYgOTguMDN2Ni44NTVhMS43MTEgMS43MTEgMCAwIDAgMS43MTQgMS43MTQgMS43MTMgMS43MTMgMCAwIDAgMS43MTQtMS43MTQgMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMCA1LjE0IDUuMTQgMCAxIDEtMTAuMjgyIDB2LTYuODU0YTUuMTQgNS4xNCAwIDEgMSAxMC4yODIgMCAxLjcxMiAxLjcxMiAwIDEgMS0zLjQyNyAwIDEuNzEyIDEuNzEyIDAgMSAwLTMuNDI3IDB6bTI3LjQxOCA2Ljg1NWExLjcxMiAxLjcxMiAwIDAgMS0xLjcxNCAxLjcxNGgtMS43MTR2MS43MTNjMCAuNDU1LS4xOC44OTEtLjUwMiAxLjIxMmExLjcxIDEuNzEgMCAwIDEtMi40MjMgMCAxLjcxOSAxLjcxOSAwIDAgMS0uNTAyLTEuMjEydi0xLjcxM2gtMy40Mjd2MS43MTNhMS43MSAxLjcxIDAgMCAxLTEuNzE0IDEuNzE0IDEuNzEgMS43MSAwIDAgMS0xLjcxMy0xLjcxNHYtMS43MTNINjYuMDVhMS43MTMgMS43MTMgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMy40MjdINjYuMDVhMS43MTIgMS43MTIgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMS43MTRhMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMHYxLjcxM2gzLjQyN3YtMS43MTNhMS43MTIgMS43MTIgMCAxIDEgMy40MjcgMHYxLjcxM2gxLjcxNGMuNDU0IDAgLjg5LjE4IDEuMjExLjUwMmExLjcxIDEuNzEgMCAwIDEgMCAyLjQyMyAxLjcxMiAxLjcxMiAwIDAgMS0xLjIxMS41MDNoLTEuNzE0djMuNDI3aDEuNzE0YTEuNzE4IDEuNzE4IDAgMCAxIDEuNzE0IDEuNzEzem0tNi44NTUtNS4xNGgtMy40Mjd2My40MjdoMy40Mjd6IgogICAgIGZpbGw9IiNmZmYiCiAgICAgZmlsdGVyPSJ1cmwoI2IpIgogICAgIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpzY3JlZW4iCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLjg3OSAwIDAgLjg3OSAtMzAuOTY1IC02Mi4wODYpIgogICAgIGlkPSJwYXRoMTMiIC8+Cjwvc3ZnPgo="}cIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHZpZXdCb3g9IjAgMCAzOC4wMDAwODkgNDIuMDAwMDMxIgogICB3aWR0aD0iMzgwLjAwMDg5IgogICBoZWlnaHQ9IjQyMC4wMDAzMSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMTAiCiAgIHNvZGlwb2RpOmRvY25hbWU9Imljb25zOC1jLXByb2dyYW1taW5nLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wLjEgKDNiYzJlODEzZjUsIDIwMjAtMDktMDcpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExNiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE0IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU2IgogICAgIGlkPSJuYW1lZHZpZXcxMiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMS40ODk1ODMzIgogICAgIGlua3NjYXBlOmN4PSIxOTAiCiAgICAgaW5rc2NhcGU6Y3k9IjIxMC4wMDI4MiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEwIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzI4MzU5MyIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAxNy45MDMsMC4yODYyODE2NiBjIDAuNjc5LC0wLjM4MSAxLjUxNSwtMC4zODEgMi4xOTMsMCBDIDIzLjQ1MSwyLjE2OTI4MTcgMzMuNTQ3LDcuODM3MjgxNyAzNi45MDMsOS43MjAyODE3IDM3LjU4MiwxMC4xMDAyODIgMzgsMTAuODA0MjgyIDM4LDExLjU2NjI4MiBjIDAsMy43NjYgMCwxNS4xMDEgMCwxOC44NjcgMCwwLjc2MiAtMC40MTgsMS40NjYgLTEuMDk3LDEuODQ3IC0zLjM1NSwxLjg4MyAtMTMuNDUxLDcuNTUxIC0xNi44MDcsOS40MzQgLTAuNjc5LDAuMzgxIC0xLjUxNSwwLjM4MSAtMi4xOTMsMCAtMy4zNTUsLTEuODgzIC0xMy40NTEsLTcuNTUxIC0xNi44MDcsLTkuNDM0IC0wLjY3OCwtMC4zODEgLTEuMDk2LC0xLjA4NCAtMS4wOTYsLTEuODQ2IDAsLTMuNzY2IDAsLTE1LjEwMSAwLC0xOC44NjcgMCwtMC43NjIgMC40MTgsLTEuNDY2IDEuMDk3LC0xLjg0NzAwMDMgMy4zNTQsLTEuODgzIDEzLjQ1MiwtNy41NTEgMTYuODA2LC05LjQzNDAwMDA0IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoMiIKICAgICBzdHlsZT0iZmlsbDojMDA0NDgyO2ZpbGwtb3BhY2l0eToxIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzVjNmJjMCIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAwLjMwNCwzMS40MDQyODIgYyAtMC4yNjYsLTAuMzU2IC0wLjMwNCwtMC42OTQgLTAuMzA0LC0xLjE0OSAwLC0zLjc0NCAwLC0xNS4wMTQgMCwtMTguNzU5IDAsLTAuNzU4IDAuNDE3LC0xLjQ1OCAxLjA5NCwtMS44MzYwMDAzIDMuMzQzLC0xLjg3MiAxMy40MDUsLTcuNTA3IDE2Ljc0OCwtOS4zODAwMDAwNCAwLjY3NywtMC4zNzkgMS41OTQsLTAuMzcxIDIuMjcxLDAuMDA4IDMuMzQzLDEuODcyMDAwMDQgMTMuMzcxLDcuNDU5MDAwMDQgMTYuNzE0LDkuMzMxMDAwMDQgMC4yNywwLjE1MiAwLjQ3NiwwLjMzNSAwLjY2LDAuNTc2MDAwMyB6IgogICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICBpZD0icGF0aDQiCiAgICAgc3R5bGU9ImZpbGw6IzY1OWFkMjtmaWxsLW9wYWNpdHk6MSIgLz4KICA8cGF0aAogICAgIGZpbGw9IiNmZmZmZmYiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMTksNy4wMDAyODE3IGMgNy43MjcsMCAxNCw2LjI3MzAwMDMgMTQsMTQuMDAwMDAwMyAwLDcuNzI3IC02LjI3MywxNCAtMTQsMTQgLTcuNzI3LDAgLTE0LC02LjI3MyAtMTQsLTE0IDAsLTcuNzI3IDYuMjczLC0xNC4wMDAwMDAzIDE0LC0xNC4wMDAwMDAzIHogbSAwLDcuMDAwMDAwMyBjIDMuODYzLDAgNywzLjEzNiA3LDcgMCwzLjg2MyAtMy4xMzcsNyAtNyw3IC0zLjg2MywwIC03LC0zLjEzNyAtNywtNyAwLC0zLjg2NCAzLjEzNiwtNyA3LC03IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoNiIgLz4KICA8cGF0aAogICAgIGZpbGw9IiMzOTQ5YWIiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMzcuNDg1LDEwLjIwNTI4MiBjIDAuNTE2LDAuNDgzIDAuNTA2LDEuMjExIDAuNTA2LDEuNzg0IDAsMy43OTUgLTAuMDMyLDE0LjU4OSAwLjAwOSwxOC4zODQgMC4wMDQsMC4zOTYgLTAuMTI3LDAuODEzIC0wLjMyMywxLjEyNyBsIC0xOS4wODQsLTEwLjUgeiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9InBhdGg4IgogICAgIHN0eWxlPSJmaWxsOiMwMDU5OWM7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo="}cppIcon(){return"Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9InV0Zi04Ij8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMzA2cHgiIGhlaWdodD0iMzQ0LjM1cHgiIHZpZXdCb3g9IjAgMCAzMDYgMzQ0LjM1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDYgMzQ0LjM1IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iIzAwNTk5QyIgZD0iTTMwMi4xMDcsMjU4LjI2MmMyLjQwMS00LjE1OSwzLjg5My04Ljg0NSwzLjg5My0xMy4wNTNWOTkuMTRjMC00LjIwOC0xLjQ5LTguODkzLTMuODkyLTEzLjA1MkwxNTMsMTcyLjE3NQoJTDMwMi4xMDcsMjU4LjI2MnoiLz4KPHBhdGggZmlsbD0iIzAwNDQ4MiIgZD0iTTE2Ni4yNSwzNDEuMTkzbDEyNi41LTczLjAzNGMzLjY0NC0yLjEwNCw2Ljk1Ni01LjczNyw5LjM1Ny05Ljg5N0wxNTMsMTcyLjE3NUwzLjg5MywyNTguMjYzCgljMi40MDEsNC4xNTksNS43MTQsNy43OTMsOS4zNTcsOS44OTZsMTI2LjUsNzMuMDM0QzE0Ny4wMzcsMzQ1LjQwMSwxNTguOTYzLDM0NS40MDEsMTY2LjI1LDM0MS4xOTN6Ii8+CjxwYXRoIGZpbGw9IiM2NTlBRDIiIGQ9Ik0zMDIuMTA4LDg2LjA4N2MtMi40MDItNC4xNi01LjcxNS03Ljc5My05LjM1OC05Ljg5N0wxNjYuMjUsMy4xNTZjLTcuMjg3LTQuMjA4LTE5LjIxMy00LjIwOC0yNi41LDAKCUwxMy4yNSw3Ni4xOUM1Ljk2Miw4MC4zOTcsMCw5MC43MjUsMCw5OS4xNHYxNDYuMDY5YzAsNC4yMDgsMS40OTEsOC44OTQsMy44OTMsMTMuMDUzTDE1MywxNzIuMTc1TDMwMi4xMDgsODYuMDg3eiIvPgo8Zz4KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNTMsMjc0LjE3NWMtNTYuMjQzLDAtMTAyLTQ1Ljc1Ny0xMDItMTAyczQ1Ljc1Ny0xMDIsMTAyLTEwMmMzNi4yOTIsMCw3MC4xMzksMTkuNTMsODguMzMxLDUwLjk2OAoJCWwtNDQuMTQzLDI1LjU0NGMtOS4xMDUtMTUuNzM2LTI2LjAzOC0yNS41MTItNDQuMTg4LTI1LjUxMmMtMjguMTIyLDAtNTEsMjIuODc4LTUxLDUxYzAsMjguMTIxLDIyLjg3OCw1MSw1MSw1MQoJCWMxOC4xNTIsMCwzNS4wODUtOS43NzYsNDQuMTkxLTI1LjUxNWw0NC4xNDMsMjUuNTQzQzIyMy4xNDIsMjU0LjY0NCwxODkuMjk0LDI3NC4xNzUsMTUzLDI3NC4xNzV6Ii8+CjwvZz4KPGc+Cgk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjI1NSwxNjYuNTA4IDI0My42NjYsMTY2LjUwOCAyNDMuNjY2LDE1NS4xNzUgMjMyLjMzNCwxNTUuMTc1IDIzMi4zMzQsMTY2LjUwOCAyMjEsMTY2LjUwOCAKCQkyMjEsMTc3Ljg0MSAyMzIuMzM0LDE3Ny44NDEgMjMyLjMzNCwxODkuMTc1IDI0My42NjYsMTg5LjE3NSAyNDMuNjY2LDE3Ny44NDEgMjU1LDE3Ny44NDEgCSIvPgo8L2c+CjxnPgoJPHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIyOTcuNSwxNjYuNTA4IDI4Ni4xNjYsMTY2LjUwOCAyODYuMTY2LDE1NS4xNzUgMjc0LjgzNCwxNTUuMTc1IDI3NC44MzQsMTY2LjUwOCAyNjMuNSwxNjYuNTA4IAoJCTI2My41LDE3Ny44NDEgMjc0LjgzNCwxNzcuODQxIDI3NC44MzQsMTg5LjE3NSAyODYuMTY2LDE4OS4xNzUgMjg2LjE2NiwxNzcuODQxIDI5Ny41LDE3Ny44NDEgCSIvPgo8L2c+Cjwvc3ZnPgo="}zigLogo(){return"CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTUzIDE0MCI+CjxnIGZpbGw9IiNmN2E0MWQiPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI0NiwyMiAyOCw0NCAxOSwzMCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNDYsMjIgMzMsMzMgMjgsNDQgMjIsNDQgMjIsOTUgMzEsOTUgMjAsMTAwIDEyLDExNyAwLDExNyAwLDIyIiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiLz4KCQk8cG9seWdvbiBwb2ludHM9IjMxLDk1IDEyLDExNyA0LDEwNiIvPgoJPC9nPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI1NiwyMiA2MiwzNiAzNyw0NCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNTYsMjIgMTExLDIyIDExMSw0NCAzNyw0NCA1NiwzMiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxMTYsOTUgOTcsMTE3IDkwLDEwNCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTE2LDk1IDEwMCwxMDQgOTcsMTE3IDQyLDExNyA0Miw5NSIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTAsMCA1MiwxMTcgMywxNDAgMTAxLDIyIi8+Cgk8L2c+Cgk8Zz4KCQk8cG9seWdvbiBwb2ludHM9IjE0MSwyMiAxNDAsNDAgMTIyLDQ1Ii8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTMsMjIgMTUzLDExNyAxMDYsMTE3IDEyMCwxMDUgMTI1LDk1IDEzMSw5NSAxMzEsNDUgMTIyLDQ1IDEzMiwzNiAxNDEsMjIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTI1LDk1IDEzMCwxMTAgMTA2LDExNyIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo="}render(){const e=ne.getIconForType(this.getNodeTypeFromIcon(this.icon));switch(this.icon){case D.OPENAPI:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.openapiIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}; ${this.isLightMode()?"filter: grayscale(100%)":""}"></sl-icon>`;case D.GO:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.goIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case D.TS:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.typescriptIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case D.CS:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.csIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case D.C:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case D.CPP:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cppIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case D.ZIG:return at`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.zigLogo()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}return at`
            <sl-icon exportparts="base" data-fresh="${this.icon}" name="${e}"
                     class="icon-vertical-no-margin"
                     style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}};ne.styles=[Au,ju,Nu,Ta],xo([$()],ne.prototype,"icon",2),xo([$({type:dn})],ne.prototype,"size",2),xo([$({type:un})],ne.prototype,"color",2),xo([$()],ne.prototype,"tooltip",2),ne=xo([lo("pb33f-model-icon")],ne);const Tu=z`
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
`,Ge=z`
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
`;var Eu=Object.defineProperty,zu=Object.getOwnPropertyDescriptor,Ys=(e,t,o,r)=>{for(var s=r>1?void 0:r?zu(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Eu(t,o,s),s};const pn="pp-split-position",ku=20;p.PpLayout=class extends H{constructor(){super(...arguments),this.title="",this.splitPos=ku}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const t=sessionStorage.getItem(pn);t&&(this.splitPos=parseFloat(t))}onReposition(t){const o=t.target.position;typeof o=="number"&&(this.splitPos=o,sessionStorage.setItem(pn,String(o)))}render(){return d`
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
    `}},p.PpLayout.styles=[Tu,Ge],Ys([T()],p.PpLayout.prototype,"title",2),Ys([T()],p.PpLayout.prototype,"splitPos",2),p.PpLayout=Ys([G("pp-layout")],p.PpLayout);const $u=z`
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
`;var Ou=Object.defineProperty,_u=Object.getOwnPropertyDescriptor,Io=(e,t,o,r)=>{for(var s=r>1?void 0:r?_u(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Ou(t,o,s),s};p.PpNav=class extends H{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.webhooks=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const t=this.getAttribute("data-nav");if(t)try{this.tags=JSON.parse(t)||[]}catch{}const o=this.getAttribute("data-models");if(o)try{this.modelGroups=JSON.parse(o)||[]}catch{}const r=this.getAttribute("data-webhooks");if(r)try{this.webhooks=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return d`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?d`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(t=>d`<pp-nav-tag .tag=${t} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:v}
      ${this.webhooks.length?d`
            <div class="nav-section">
              <h4>Webhooks</h4>
              <pp-nav-tag
                .tag=${{name:"Webhooks",summary:"Webhooks",children:null,operations:this.webhooks,isNavOnly:!1}}
                .activeSlug=${this.activeSlug}
              ></pp-nav-tag>
            </div>
          `:v}
      ${this.modelGroups.length?d`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(t=>d`<pp-nav-model-group .group=${t} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:v}
    `}},p.PpNav.styles=$u,Io([T()],p.PpNav.prototype,"tags",2),Io([T()],p.PpNav.prototype,"modelGroups",2),Io([T()],p.PpNav.prototype,"webhooks",2),Io([T()],p.PpNav.prototype,"activeSlug",2),p.PpNav=Io([G("pp-nav")],p.PpNav);const Pu=z`
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
`;var Ru=Object.defineProperty,Uu=Object.getOwnPropertyDescriptor,hr=(e,t,o,r)=>{for(var s=r>1?void 0:r?Uu(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Ru(t,o,s),s};function Bs(e,t){var o,r;return t?!!((o=e.operations)!=null&&o.some(s=>s.slug===t)||(r=e.children)!=null&&r.some(s=>Bs(s,t))):!1}p.PpNavTag=class extends H{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("tag")||t.has("activeSlug"))&&Bs(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var i,a;const{tag:t,activeSlug:o,open:r}=this,s=Bs(t,o);return d`
            <div class="tag-header ${s?"active":""}" @click=${this.toggle}>
                <sl-icon name=${r?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${t.summary||t.name}</span>
            </div>
            ${r?d`
                        <div class="tag-body">
                            ${(i=t.operations)!=null&&i.length?d`
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
                                    `:v}
                            ${(a=t.children)!=null&&a.length?d`
                                        <div class="children">
                                            ${t.children.map(n=>d`
                                                        <pp-nav-tag .tag=${n}
                                                                    .activeSlug=${o}></pp-nav-tag>`)}
                                        </div>
                                    `:v}
                        </div>
                    `:v}
        `}},p.PpNavTag.styles=Pu,hr([g({type:Object})],p.PpNavTag.prototype,"tag",2),hr([g()],p.PpNavTag.prototype,"activeSlug",2),hr([T()],p.PpNavTag.prototype,"open",2),p.PpNavTag=hr([G("pp-nav-tag")],p.PpNavTag);const Yu=z`
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
`;var Bu=Object.defineProperty,Hu=Object.getOwnPropertyDescriptor,gr=(e,t,o,r)=>{for(var s=r>1?void 0:r?Hu(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Bu(t,o,s),s};function hn(e,t){var o;return t?((o=e.models)==null?void 0:o.some(r=>r.typeSlug+"/"+r.slug===t))??!1:!1}p.PpNavModelGroup=class extends H{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(t){(t.has("group")||t.has("activeSlug"))&&hn(this.group,this.activeSlug)&&(this.open=!0)}updated(t){(t.has("activeSlug")||t.has("group"))&&this.open&&this.activeSlug&&requestAnimationFrame(()=>{const o=this.renderRoot.querySelector("a.active");o==null||o.scrollIntoView({block:"center",behavior:"smooth"})})}toggle(){this.open=!this.open}render(){var i;const{group:t,activeSlug:o,open:r}=this,s=hn(t,o);return d`
            <div class="group-header ${s?"active":""}" @click=${this.toggle}>
                <sl-icon name=${r?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${t.name}</span>
            </div>
            ${r&&((i=t.models)!=null&&i.length)?d`
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
                `:v}
        `}},p.PpNavModelGroup.styles=Yu,gr([g({type:Object})],p.PpNavModelGroup.prototype,"group",2),gr([g()],p.PpNavModelGroup.prototype,"activeSlug",2),gr([T()],p.PpNavModelGroup.prototype,"open",2),p.PpNavModelGroup=gr([G("pp-nav-model-group")],p.PpNavModelGroup);const Qu=z`
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
`;var Zu=Object.defineProperty,Wu=Object.getOwnPropertyDescriptor,Co=(e,t,o,r)=>{for(var s=r>1?void 0:r?Wu(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Zu(t,o,s),s};p.PpNavOperation=class extends H{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return d`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},p.PpNavOperation.styles=Qu,Co([g()],p.PpNavOperation.prototype,"method",2),Co([g()],p.PpNavOperation.prototype,"path",2),Co([g()],p.PpNavOperation.prototype,"slug",2),Co([g({type:Boolean})],p.PpNavOperation.prototype,"deprecated",2),p.PpNavOperation=Co([G("pp-nav-operation")],p.PpNavOperation);const mr=z`
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
`,fr=z`
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
`,Fu=z`
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
`,Gu={schemas:"schemas",responses:"responses",parameters:"parameters",requestBodies:"request-bodies",headers:"headers",securitySchemes:"security",examples:"examples",links:"links",callbacks:"callbacks",pathItems:"path-items"};function Ju(e){let t=e.replace(/([a-z0-9])([A-Z])/g,"$1-$2");return t=t.toLowerCase(),t=t.replace(/[/]/g,"-").replace(/[{}_.]/g,"-").replace(/ /g,"-"),t=t.replace(/[^a-z0-9-]/g,""),t=t.replace(/-{2,}/g,"-"),t=t.replace(/^-|-$/g,""),t||"unnamed"}function Ne(e){if(!e||!e.startsWith("#/components/"))return null;const t=e.replace("#/components/","").split("/");if(t.length!==2)return null;const[o,r]=t,s=Gu[o];return s?{name:r,href:`models/${s}/${Ju(r)}.html`}:null}function Vu(e,t){if(!e)return[];const o=[];return t!=null&&t.includeExample&&(e.example!==void 0&&o.push({label:"example",value:JSON.stringify(e.example)}),e.default!==void 0&&o.push({label:"default",value:JSON.stringify(e.default)})),e.minimum!==void 0&&o.push({label:"min",value:e.minimum}),e.maximum!==void 0&&o.push({label:"max",value:e.maximum}),e.exclusiveMinimum!==void 0&&o.push({label:"exclusiveMin",value:e.exclusiveMinimum}),e.exclusiveMaximum!==void 0&&o.push({label:"exclusiveMax",value:e.exclusiveMaximum}),e.minLength!==void 0&&o.push({label:"minLength",value:e.minLength}),e.maxLength!==void 0&&o.push({label:"maxLength",value:e.maxLength}),e.minItems!==void 0&&o.push({label:"minItems",value:e.minItems}),e.maxItems!==void 0&&o.push({label:"maxItems",value:e.maxItems}),e.uniqueItems&&o.push({label:"uniqueItems",value:"true"}),e.pattern&&o.push({label:"pattern",value:e.pattern,isCode:!0}),e.multipleOf!==void 0&&o.push({label:"multipleOf",value:e.multipleOf}),o}function Hs(e){var t;if(!e)return"";if(e.type==="array"&&e.items)return`Array<${e.items.type||((t=e.items.$ref)==null?void 0:t.split("/").pop())||"any"}>`;if(e.type){let o=Array.isArray(e.type)?e.type.join(" | "):e.type;return e.format&&(o+=` (${e.format})`),o}return e.oneOf?"oneOf":e.anyOf?"anyOf":e.allOf?"allOf":e.$ref?e.$ref.split("/").pop()??"":""}function Qs(e,t=!1){const o=d`<a class="ref-link" href="models/${e.typeSlug}/${e.slug}.html">\u279c ${e.name}</a>`;return t?d`<pp-ref-popover registry-key="${e.componentType}/${e.name}">${o}</pp-ref-popover>`:o}function Xu(e,t){var s,i;if(!e)return v;if(e.allOf&&Array.isArray(e.allOf)){const a=[];let n=!0;for(const l of e.allOf){if(!l.$ref){n=!1;continue}const c=Ne(l.$ref);c&&a.push({ref:l.$ref,link:c})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">
                ${a.map((l,c)=>d`
                    ${c>0?d` <span class="composition-separator">+</span> `:v}
                    ${t(l.ref,l.link)}
                `)}
            </span>`}if(e.type==="array"&&((s=e.items)!=null&&s.allOf)&&Array.isArray(e.items.allOf)){const a=[];let n=!0;for(const l of e.items.allOf){if(!l.$ref){n=!1;continue}const c=Ne(l.$ref);c&&a.push({ref:l.$ref,link:c})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">Array&lt;${a.map((l,c)=>d`
                ${c>0?d` <span class="composition-separator">+</span> `:v}
                ${t(l.ref,l.link)}
            `)}&gt;</span>`}if(e.type==="array"&&((i=e.items)!=null&&i.$ref)){const a=Ne(e.items.$ref);if(a)return d`<span class="prop-type prop-type-link">Array&lt;${t(e.items.$ref,a)}&gt;</span>`}const o=e.oneOf??e.anyOf;if(o&&Array.isArray(o)){const a=[];let n=!0;for(const c of o){if(!c.$ref){n=!1;break}const u=Ne(c.$ref);u&&a.push({ref:c.$ref,link:u})}if(n&&a.length>0)return d`<span class="prop-type prop-type-link">
                ${a.map((c,u)=>d`
                    ${u>0?d` <span class="composition-separator">|</span> `:v}
                    ${t(c.ref,c.link)}
                `)}
            </span>`;const l=o.map(c=>c.title).filter(Boolean);if(l.length===o.length)return d`<span class="prop-type">${l.join(" | ")}</span>`}if(e.$ref){const a=Ne(e.$ref);if(a)return d`<span class="prop-type prop-type-link">${t(e.$ref,a)}</span>`}const r=Hs(e);return r?d`<span class="prop-type">${r}</span>`:v}function Je(e,t){var s,i;if(!e)return v;const o=Vu(e,{includeExample:t==null?void 0:t.includeExample});if(!o.length&&!((s=e.enum)!=null&&s.length))return v;const r=(t==null?void 0:t.labelSuffix)??"";return d`
        <div class="constraints">
            ${o.map(a=>d`
                <span class="constraint-label">${a.label}${r}</span>
                <span class="constraint-value">${a.isCode?d`<code>${a.value}</code>`:a.value}</span>
            `)}
            ${(i=e.enum)!=null&&i.length?d`
                <div class="enum-section">
                    <span class="constraint-label">enum${r}</span>
                    <div class="enum-grid">${e.enum.map(a=>d`<span class="enum-value">${JSON.stringify(a)}</span>`)}</div>
                </div>
            `:v}
        </div>
    `}const Ku=z`
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
        padding: var(--global-padding);
        text-align: left;
    }

    .popover-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: var(--global-padding);
    }

    .type-badge {
        color: var(--secondary-color);
        background: var(--secondary-color-very-lowalpha);
        border: 1px solid var(--secondary-color-dimmer);
        padding: var(--global-padding) var(--global-padding-double);
        text-transform: uppercase;
        font-family: var(--font-stack-bold), monospace;
        letter-spacing: 0.05em;
        font-size: 0.8em;
    }

    .component-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
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
`,gn=new Map;let mn=!1;function qu(){if(mn)return;mn=!0;const e=document.getElementById("pp-schema-registry");if(e!=null&&e.textContent)try{const t=JSON.parse(e.textContent);for(const[o,r]of Object.entries(t))gn.set(o,r)}catch{}}function fn(e){return qu(),gn.get(e)}function Zs(e){if(!(e!=null&&e.startsWith("#/components/")))return;const t=e.replace("#/components/","");return fn(t)}var tp=z`
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
`,dt=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=e=>{this.open&&e.key==="Escape"&&(e.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=e=>{var t;if(e.key==="Escape"&&this.open&&!this.closeWatcher){e.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(e.key==="Tab"){if(this.open&&((t=document.activeElement)==null?void 0:t.tagName.toLowerCase())==="sl-menu-item"){e.preventDefault(),this.hide(),this.focusOnTrigger();return}const o=(r,s)=>{if(!r)return null;const i=r.closest(s);if(i)return i;const a=r.getRootNode();return a instanceof ShadowRoot?o(a.host,s):null};setTimeout(()=>{var r;const s=((r=this.containingElement)==null?void 0:r.getRootNode())instanceof ShadowRoot?ia():document.activeElement;(!this.containingElement||o(s,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=e=>{const t=e.composedPath();this.containingElement&&!t.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=e=>{const t=e.target;!this.stayOpenOnSelect&&t.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){const e=this.trigger.assignedElements({flatten:!0})[0];typeof(e==null?void 0:e.focus)=="function"&&e.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(e=>e.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(e){if([" ","Enter"].includes(e.key)){e.preventDefault(),this.handleTriggerClick();return}const t=this.getMenu();if(t){const o=t.getAllItems(),r=o[0],s=o[o.length-1];["ArrowDown","ArrowUp","Home","End"].includes(e.key)&&(e.preventDefault(),this.open||(this.show(),await this.updateComplete),o.length>0&&this.updateComplete.then(()=>{(e.key==="ArrowDown"||e.key==="Home")&&(t.setCurrentItem(r),r.focus()),(e.key==="ArrowUp"||e.key==="End")&&(t.setCurrentItem(s),s.focus())}))}}handleTriggerKeyUp(e){e.key===" "&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){const t=this.trigger.assignedElements({flatten:!0}).find(r=>Sc(r).start);let o;if(t){switch(t.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=t.button;break;default:o=t}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,te(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,te(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var e;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var e;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await $t(this),this.panel.hidden=!1,this.popup.active=!0;const{keyframes:e,options:t}=mt(this,"dropdown.show",{dir:this.localize.dir()});await It(this.popup.popup,e,t),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await $t(this);const{keyframes:e,options:t}=mt(this,"dropdown.hide",{dir:this.localize.dir()});await It(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return d`
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
        sync=${J(this.sync?this.sync:void 0)}
        class=${ct({dropdown:!0,"dropdown--open":this.open})}
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
    `}};dt.styles=[ot,tp],dt.dependencies={"sl-popup":Y},m([R(".dropdown")],dt.prototype,"popup",2),m([R(".dropdown__trigger")],dt.prototype,"trigger",2),m([R(".dropdown__panel")],dt.prototype,"panel",2),m([g({type:Boolean,reflect:!0})],dt.prototype,"open",2),m([g({reflect:!0})],dt.prototype,"placement",2),m([g({type:Boolean,reflect:!0})],dt.prototype,"disabled",2),m([g({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],dt.prototype,"stayOpenOnSelect",2),m([g({attribute:!1})],dt.prototype,"containingElement",2),m([g({type:Number})],dt.prototype,"distance",2),m([g({type:Number})],dt.prototype,"skidding",2),m([g({type:Boolean})],dt.prototype,"hoist",2),m([g({reflect:!0})],dt.prototype,"sync",2),m([V("open",{waitUntilFirstUpdate:!0})],dt.prototype,"handleOpenChange",1),et("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}}),et("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}}),dt.define("sl-dropdown");var ep=z`
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
`,Ws=class extends X{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(e){const t=["menuitem","menuitemcheckbox"],o=e.composedPath(),r=o.find(n=>{var l;return t.includes(((l=n==null?void 0:n.getAttribute)==null?void 0:l.call(n,"role"))||"")});if(!r||o.find(n=>{var l;return((l=n==null?void 0:n.getAttribute)==null?void 0:l.call(n,"role"))==="menu"})!==this)return;const a=r;a.type==="checkbox"&&(a.checked=!a.checked),this.emit("sl-select",{detail:{item:a}})}handleKeyDown(e){if(e.key==="Enter"||e.key===" "){const t=this.getCurrentItem();e.preventDefault(),e.stopPropagation(),t==null||t.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(e.key)){const t=this.getAllItems(),o=this.getCurrentItem();let r=o?t.indexOf(o):0;t.length>0&&(e.preventDefault(),e.stopPropagation(),e.key==="ArrowDown"?r++:e.key==="ArrowUp"?r--:e.key==="Home"?r=0:e.key==="End"&&(r=t.length-1),r<0&&(r=t.length-1),r>t.length-1&&(r=0),this.setCurrentItem(t[r]),t[r].focus())}}handleMouseDown(e){const t=e.target;this.isMenuItem(t)&&this.setCurrentItem(t)}handleSlotChange(){const e=this.getAllItems();e.length>0&&this.setCurrentItem(e[0])}isMenuItem(e){var t;return e.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((t=e.getAttribute("role"))!=null?t:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>!(e.inert||!this.isMenuItem(e)))}getCurrentItem(){return this.getAllItems().find(e=>e.getAttribute("tabindex")==="0")}setCurrentItem(e){this.getAllItems().forEach(o=>{o.setAttribute("tabindex",o===e?"0":"-1")})}render(){return d`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};Ws.styles=[ot,ep],m([R("slot")],Ws.prototype,"defaultSlot",2),Ws.define("sl-menu");var op=z`
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
 */const Ao=(e,t)=>{var r;const o=e._$AN;if(o===void 0)return!1;for(const s of o)(r=s._$AO)==null||r.call(s,t,!1),Ao(s,t);return!0},br=e=>{let t,o;do{if((t=e._$AM)===void 0)break;o=t._$AN,o.delete(e),e=t}while((o==null?void 0:o.size)===0)},bn=e=>{for(let t;t=e._$AM;e=t){let o=t._$AN;if(o===void 0)t._$AN=o=new Set;else if(o.has(e))break;o.add(e),ip(t)}};function rp(e){this._$AN!==void 0?(br(this),this._$AM=e,bn(this)):this._$AM=e}function sp(e,t=!1,o=0){const r=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(t)if(Array.isArray(r))for(let i=o;i<r.length;i++)Ao(r[i],!1),br(r[i]);else r!=null&&(Ao(r,!1),br(r));else Ao(this,e)}const ip=e=>{e.type==Wr.CHILD&&(e._$AP??(e._$AP=sp),e._$AQ??(e._$AQ=rp))};class ap extends Gr{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,o,r){super._$AT(t,o,r),bn(this),this.isConnected=t._$AU}_$AO(t,o=!0){var r,s;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(s=this.disconnected)==null||s.call(this)),o&&(Ao(this,t),br(this))}setValue(t){if(wl(this._$Ct))this._$Ct._$AI(t,this);else{const o=[...this._$Ct._$AH];o[this._$Ci]=t,this._$Ct._$AI(o,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const np=()=>new lp;class lp{}const Fs=new WeakMap,cp=Fr(class extends ap{render(e){return v}update(e,[t]){var r;const o=t!==this.G;return o&&this.G!==void 0&&this.rt(void 0),(o||this.lt!==this.ct)&&(this.G=t,this.ht=(r=e.options)==null?void 0:r.host,this.rt(this.ct=e.element)),v}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const t=this.ht??globalThis;let o=Fs.get(t);o===void 0&&(o=new WeakMap,Fs.set(t,o)),o.get(this.G)!==void 0&&this.G.call(this.ht,void 0),o.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){var e,t;return typeof this.G=="function"?(e=Fs.get(this.ht??globalThis))==null?void 0:e.get(this.G):(t=this.G)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var dp=class{constructor(e,t){this.popupRef=np(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=o=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${o.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${o.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=o=>{switch(o.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":o.target!==this.host&&(o.preventDefault(),o.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(o);break}},this.handleClick=o=>{var r;o.target===this.host?(o.preventDefault(),o.stopPropagation()):o.target instanceof Element&&(o.target.tagName==="sl-menu-item"||(r=o.target.role)!=null&&r.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=o=>{o.relatedTarget&&o.relatedTarget instanceof Element&&this.host.contains(o.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=o=>{o.stopPropagation()},this.handlePopupReposition=()=>{const o=this.host.renderRoot.querySelector("slot[name='submenu']"),r=o==null?void 0:o.assignedElements({flatten:!0}).filter(c=>c.localName==="sl-menu")[0],s=getComputedStyle(this.host).direction==="rtl";if(!r)return;const{left:i,top:a,width:n,height:l}=r.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${s?i+n:i}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${a}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${s?i+n:i}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${a+l}px`)},(this.host=e).addController(this),this.hasSlotController=t}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(e){const t=this.host.renderRoot.querySelector("slot[name='submenu']");if(!t){console.error("Cannot activate a submenu if no corresponding menuitem can be found.",this);return}let o=null;for(const r of t.assignedElements())if(o=r.querySelectorAll("sl-menu-item, [role^='menuitem']"),o.length!==0)break;if(!(!o||o.length===0)){o[0].setAttribute("tabindex","0");for(let r=1;r!==o.length;++r)o[r].setAttribute("tabindex","-1");this.popupRef.value&&(e.preventDefault(),e.stopPropagation(),this.popupRef.value.active?o[0]instanceof HTMLElement&&o[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{o[0]instanceof HTMLElement&&o[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(e){this.popupRef.value&&this.popupRef.value.active!==e&&(this.popupRef.value.active=e,this.host.requestUpdate())}enableSubmenu(e=!0){e?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var e;if(!((e=this.host.parentElement)!=null&&e.computedStyleMap))return;const t=this.host.parentElement.computedStyleMap(),r=["padding-top","border-top-width","margin-top"].reduce((s,i)=>{var a;const n=(a=t.get(i))!=null?a:new CSSUnitValue(0,"px"),c=(n instanceof CSSUnitValue?n:new CSSUnitValue(0,"px")).to("px");return s-c.value},0);this.skidding=r}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){const e=getComputedStyle(this.host).direction==="rtl";return this.isConnected?d`
      <sl-popup
        ${cp(this.popupRef)}
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
    `:d` <slot name="submenu" hidden></slot> `}},up=z`
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
`,Gs=class extends X{constructor(){super(...arguments),this.localize=new pt(this)}render(){return d`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};Gs.styles=[ot,up];var Mt=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new gs(this,"submenu"),this.submenuController=new dp(this,this.hasSlotController),this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleMouseOver=e=>{this.focus(),e.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){const e=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=e;return}e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return Oc(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){const e=this.localize.dir()==="rtl",t=this.submenuController.isExpanded();return d`
      <div
        id="anchor"
        part="base"
        class=${ct({"menu-item":!0,"menu-item--rtl":e,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":t})}
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
    `}};Mt.styles=[ot,op],Mt.dependencies={"sl-icon":ut,"sl-popup":Y,"sl-spinner":Gs},m([R("slot:not([name])")],Mt.prototype,"defaultSlot",2),m([R(".menu-item")],Mt.prototype,"menuItem",2),m([g()],Mt.prototype,"type",2),m([g({type:Boolean,reflect:!0})],Mt.prototype,"checked",2),m([g()],Mt.prototype,"value",2),m([g({type:Boolean,reflect:!0})],Mt.prototype,"loading",2),m([g({type:Boolean,reflect:!0})],Mt.prototype,"disabled",2),m([V("checked")],Mt.prototype,"handleCheckedChange",1),m([V("disabled")],Mt.prototype,"handleDisabledChange",1),m([V("type")],Mt.prototype,"handleTypeChange",1),Mt.define("sl-menu-item");var jo=new WeakMap,No=new WeakMap,So=new WeakMap,Js=new WeakSet,yr=new WeakMap,pp=class{constructor(e,t){this.handleFormData=o=>{const r=this.options.disabled(this.host),s=this.options.name(this.host),i=this.options.value(this.host),a=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!r&&!a&&typeof s=="string"&&s.length>0&&typeof i<"u"&&(Array.isArray(i)?i.forEach(n=>{o.formData.append(s,n.toString())}):o.formData.append(s,i.toString()))},this.handleFormSubmit=o=>{var r;const s=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&((r=jo.get(this.form))==null||r.forEach(a=>{this.setUserInteracted(a,!0)})),this.form&&!this.form.noValidate&&!s&&!i(this.host)&&(o.preventDefault(),o.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),yr.set(this.host,[])},this.handleInteraction=o=>{const r=yr.get(this.host);r.includes(o.type)||r.push(o.type),r.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const o=this.form.querySelectorAll("*");for(const r of o)if(typeof r.checkValidity=="function"&&!r.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const o=this.form.querySelectorAll("*");for(const r of o)if(typeof r.reportValidity=="function"&&!r.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=Bt({form:o=>{const r=o.form;if(r){const i=o.getRootNode().querySelector(`#${r}`);if(i)return i}return o.closest("form")},name:o=>o.name,value:o=>o.value,defaultValue:o=>o.defaultValue,disabled:o=>{var r;return(r=o.disabled)!=null?r:!1},reportValidity:o=>typeof o.reportValidity=="function"?o.reportValidity():!0,checkValidity:o=>typeof o.checkValidity=="function"?o.checkValidity():!0,setValue:(o,r)=>o.value=r,assumeInteractionOn:["sl-input"]},t)}hostConnected(){const e=this.options.form(this.host);e&&this.attachForm(e),yr.set(this.host,[]),this.options.assumeInteractionOn.forEach(t=>{this.host.addEventListener(t,this.handleInteraction)})}hostDisconnected(){this.detachForm(),yr.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){const e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,jo.has(this.form)?jo.get(this.form).add(this.host):jo.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),No.has(this.form)||(No.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),So.has(this.form)||(So.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const e=jo.get(this.form);e&&(e.delete(this.host),e.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),No.has(this.form)&&(this.form.reportValidity=No.get(this.form),No.delete(this.form)),So.has(this.form)&&(this.form.checkValidity=So.get(this.form),So.delete(this.form)),this.form=void 0))}setUserInteracted(e,t){t?Js.add(e):Js.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){const o=document.createElement("button");o.type=e,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",t&&(o.name=t.name,o.value=t.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(r=>{t.hasAttribute(r)&&o.setAttribute(r,t.getAttribute(r))})),this.form.append(o),o.click(),o.remove()}}getForm(){var e;return(e=this.form)!=null?e:null}reset(e){this.doAction("reset",e)}submit(e){this.doAction("submit",e)}setValidity(e){const t=this.host,o=!!Js.has(t),r=!!t.required;t.toggleAttribute("data-required",r),t.toggleAttribute("data-optional",!r),t.toggleAttribute("data-invalid",!e),t.toggleAttribute("data-valid",e),t.toggleAttribute("data-user-invalid",!e&&o),t.toggleAttribute("data-user-valid",e&&o)}updateValidity(){const e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){const t=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||e==null||e.preventDefault()}},Vs=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(oo(Bt({},Vs),{valid:!1,valueMissing:!0})),Object.freeze(oo(Bt({},Vs),{valid:!1,customError:!0}));var hp=z`
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
`,B=class extends X{constructor(){super(...arguments),this.formControlController=new pp(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new gs(this,"[default]","prefix","suffix"),this.localize=new pt(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:Vs}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){const e=this.isLink(),t=e?Yo`a`:Yo`button`;return so`
      <${t}
        part="base"
        class=${ct({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${J(e?void 0:this.disabled)}
        type=${J(e?void 0:this.type)}
        title=${this.title}
        name=${J(e?void 0:this.name)}
        value=${J(e?void 0:this.value)}
        href=${J(e&&!this.disabled?this.href:void 0)}
        target=${J(e?this.target:void 0)}
        download=${J(e?this.download:void 0)}
        rel=${J(e?this.rel:void 0)}
        role=${J(e?void 0:"button")}
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
        ${this.caret?so` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?so`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${t}>
    `}};B.styles=[ot,hp],B.dependencies={"sl-icon":ut,"sl-spinner":Gs},m([R(".button")],B.prototype,"button",2),m([T()],B.prototype,"hasFocus",2),m([T()],B.prototype,"invalid",2),m([g()],B.prototype,"title",2),m([g({reflect:!0})],B.prototype,"variant",2),m([g({reflect:!0})],B.prototype,"size",2),m([g({type:Boolean,reflect:!0})],B.prototype,"caret",2),m([g({type:Boolean,reflect:!0})],B.prototype,"disabled",2),m([g({type:Boolean,reflect:!0})],B.prototype,"loading",2),m([g({type:Boolean,reflect:!0})],B.prototype,"outline",2),m([g({type:Boolean,reflect:!0})],B.prototype,"pill",2),m([g({type:Boolean,reflect:!0})],B.prototype,"circle",2),m([g()],B.prototype,"type",2),m([g()],B.prototype,"name",2),m([g()],B.prototype,"value",2),m([g()],B.prototype,"href",2),m([g()],B.prototype,"target",2),m([g()],B.prototype,"rel",2),m([g()],B.prototype,"download",2),m([g()],B.prototype,"form",2),m([g({attribute:"formaction"})],B.prototype,"formAction",2),m([g({attribute:"formenctype"})],B.prototype,"formEnctype",2),m([g({attribute:"formmethod"})],B.prototype,"formMethod",2),m([g({attribute:"formnovalidate",type:Boolean})],B.prototype,"formNoValidate",2),m([g({attribute:"formtarget"})],B.prototype,"formTarget",2),m([V("disabled",{waitUntilFirstUpdate:!0})],B.prototype,"handleDisabledChange",1),B.define("sl-button");var gp=z`
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
`,mp=z`
  :host {
    display: contents;
  }
`,vr=class extends X{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>{this.emit("sl-resize",{detail:{entries:e}})}),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){const e=this.shadowRoot.querySelector("slot");if(e!==null){const t=e.assignedElements({flatten:!0});this.observedElements.forEach(o=>this.resizeObserver.unobserve(o)),this.observedElements=[],t.forEach(o=>{this.resizeObserver.observe(o),this.observedElements.push(o)})}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return d` <slot @slotchange=${this.handleSlotChange}></slot> `}};vr.styles=[ot,mp],m([g({type:Boolean,reflect:!0})],vr.prototype,"disabled",2),m([V("disabled",{waitUntilFirstUpdate:!0})],vr.prototype,"handleDisabledChange",1);var nt=class extends X{constructor(){super(...arguments),this.tabs=[],this.focusableTabs=[],this.panels=[],this.localize=new pt(this),this.hasScrollControls=!1,this.shouldHideScrollStartButton=!1,this.shouldHideScrollEndButton=!1,this.placement="top",this.activation="auto",this.noScrollControls=!1,this.fixedScrollControls=!1,this.scrollOffset=1}connectedCallback(){const e=Promise.all([customElements.whenDefined("sl-tab"),customElements.whenDefined("sl-tab-panel")]);super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(t=>{const o=t.filter(({target:r})=>{if(r===this)return!0;if(r.closest("sl-tab-group")!==this)return!1;const s=r.tagName.toLowerCase();return s==="sl-tab"||s==="sl-tab-panel"});if(o.length!==0){if(o.some(r=>!["aria-labelledby","aria-controls"].includes(r.attributeName))&&setTimeout(()=>this.setAriaLabels()),o.some(r=>r.attributeName==="disabled"))this.syncTabsAndPanels();else if(o.some(r=>r.attributeName==="active")){const s=o.filter(i=>i.attributeName==="active"&&i.target.tagName.toLowerCase()==="sl-tab").map(i=>i.target).find(i=>i.active);s&&this.setActiveTab(s)}}}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,attributeFilter:["active","disabled","name","panel"],childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),e.then(()=>{new IntersectionObserver((o,r)=>{var s;o[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab((s=this.getActiveTab())!=null?s:this.tabs[0],{emitEvents:!1}),r.unobserve(o[0].target))}).observe(this.tabGroup)})})}disconnectedCallback(){var e,t;super.disconnectedCallback(),(e=this.mutationObserver)==null||e.disconnect(),this.nav&&((t=this.resizeObserver)==null||t.unobserve(this.nav))}getAllTabs(){return this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()}getAllPanels(){return[...this.body.assignedElements()].filter(e=>e.tagName.toLowerCase()==="sl-tab-panel")}getActiveTab(){return this.tabs.find(e=>e.active)}handleClick(e){const o=e.target.closest("sl-tab");(o==null?void 0:o.closest("sl-tab-group"))===this&&o!==null&&this.setActiveTab(o,{scrollBehavior:"smooth"})}handleKeyDown(e){const o=e.target.closest("sl-tab");if((o==null?void 0:o.closest("sl-tab-group"))===this&&(["Enter"," "].includes(e.key)&&o!==null&&(this.setActiveTab(o,{scrollBehavior:"smooth"}),e.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))){const s=this.tabs.find(n=>n.matches(":focus")),i=this.localize.dir()==="rtl";let a=null;if((s==null?void 0:s.tagName.toLowerCase())==="sl-tab"){if(e.key==="Home")a=this.focusableTabs[0];else if(e.key==="End")a=this.focusableTabs[this.focusableTabs.length-1];else if(["top","bottom"].includes(this.placement)&&e.key===(i?"ArrowRight":"ArrowLeft")||["start","end"].includes(this.placement)&&e.key==="ArrowUp"){const n=this.tabs.findIndex(l=>l===s);a=this.findNextFocusableTab(n,"backward")}else if(["top","bottom"].includes(this.placement)&&e.key===(i?"ArrowLeft":"ArrowRight")||["start","end"].includes(this.placement)&&e.key==="ArrowDown"){const n=this.tabs.findIndex(l=>l===s);a=this.findNextFocusableTab(n,"forward")}if(!a)return;a.tabIndex=0,a.focus({preventScroll:!0}),this.activation==="auto"?this.setActiveTab(a,{scrollBehavior:"smooth"}):this.tabs.forEach(n=>{n.tabIndex=n===a?0:-1}),["top","bottom"].includes(this.placement)&&la(a,this.nav,"horizontal"),e.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:"smooth"})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:"smooth"})}setActiveTab(e,t){if(t=Bt({emitEvents:!0,scrollBehavior:"auto"},t),e!==this.activeTab&&!e.disabled){const o=this.activeTab;this.activeTab=e,this.tabs.forEach(r=>{r.active=r===this.activeTab,r.tabIndex=r===this.activeTab?0:-1}),this.panels.forEach(r=>{var s;return r.active=r.name===((s=this.activeTab)==null?void 0:s.panel)}),this.syncIndicator(),["top","bottom"].includes(this.placement)&&la(this.activeTab,this.nav,"horizontal",t.scrollBehavior),t.emitEvents&&(o&&this.emit("sl-tab-hide",{detail:{name:o.panel}}),this.emit("sl-tab-show",{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(e=>{const t=this.panels.find(o=>o.name===e.panel);t&&(e.setAttribute("aria-controls",t.getAttribute("id")),t.setAttribute("aria-labelledby",e.getAttribute("id")))})}repositionIndicator(){const e=this.getActiveTab();if(!e)return;const t=e.clientWidth,o=e.clientHeight,r=this.localize.dir()==="rtl",s=this.getAllTabs(),a=s.slice(0,s.indexOf(e)).reduce((n,l)=>({left:n.left+l.clientWidth,top:n.top+l.clientHeight}),{left:0,top:0});switch(this.placement){case"top":case"bottom":this.indicator.style.width=`${t}px`,this.indicator.style.height="auto",this.indicator.style.translate=r?`${-1*a.left}px`:`${a.left}px`;break;case"start":case"end":this.indicator.style.width="auto",this.indicator.style.height=`${o}px`,this.indicator.style.translate=`0 ${a.top}px`;break}}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.focusableTabs=this.tabs.filter(e=>!e.disabled),this.panels=this.getAllPanels(),this.syncIndicator(),this.updateComplete.then(()=>this.updateScrollControls())}findNextFocusableTab(e,t){let o=null;const r=t==="forward"?1:-1;let s=e+r;for(;e<this.tabs.length;){if(o=this.tabs[s]||null,o===null){t==="forward"?o=this.focusableTabs[0]:o=this.focusableTabs[this.focusableTabs.length-1];break}if(!o.disabled)break;s+=r}return o}updateScrollButtons(){this.hasScrollControls&&!this.fixedScrollControls&&(this.shouldHideScrollStartButton=this.scrollFromStart()<=this.scrollOffset,this.shouldHideScrollEndButton=this.isScrolledToEnd())}isScrolledToEnd(){return this.scrollFromStart()+this.nav.clientWidth>=this.nav.scrollWidth-this.scrollOffset}scrollFromStart(){return this.localize.dir()==="rtl"?-this.nav.scrollLeft:this.nav.scrollLeft}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=["top","bottom"].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth+1,this.updateScrollButtons()}syncIndicator(){this.getActiveTab()?(this.indicator.style.display="block",this.repositionIndicator()):this.indicator.style.display="none"}show(e){const t=this.tabs.find(o=>o.panel===e);t&&this.setActiveTab(t,{scrollBehavior:"smooth"})}render(){const e=this.localize.dir()==="rtl";return d`
      <div
        part="base"
        class=${ct({"tab-group":!0,"tab-group--top":this.placement==="top","tab-group--bottom":this.placement==="bottom","tab-group--start":this.placement==="start","tab-group--end":this.placement==="end","tab-group--rtl":this.localize.dir()==="rtl","tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?d`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${ct({"tab-group__scroll-button":!0,"tab-group__scroll-button--start":!0,"tab-group__scroll-button--start--hidden":this.shouldHideScrollStartButton})}
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
                  class=${ct({"tab-group__scroll-button":!0,"tab-group__scroll-button--end":!0,"tab-group__scroll-button--end--hidden":this.shouldHideScrollEndButton})}
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
    `}};nt.styles=[ot,gp],nt.dependencies={"sl-icon-button":it,"sl-resize-observer":vr},m([R(".tab-group")],nt.prototype,"tabGroup",2),m([R(".tab-group__body")],nt.prototype,"body",2),m([R(".tab-group__nav")],nt.prototype,"nav",2),m([R(".tab-group__indicator")],nt.prototype,"indicator",2),m([T()],nt.prototype,"hasScrollControls",2),m([T()],nt.prototype,"shouldHideScrollStartButton",2),m([T()],nt.prototype,"shouldHideScrollEndButton",2),m([g()],nt.prototype,"placement",2),m([g()],nt.prototype,"activation",2),m([g({attribute:"no-scroll-controls",type:Boolean})],nt.prototype,"noScrollControls",2),m([g({attribute:"fixed-scroll-controls",type:Boolean})],nt.prototype,"fixedScrollControls",2),m([yl({passive:!0})],nt.prototype,"updateScrollButtons",1),m([V("noScrollControls",{waitUntilFirstUpdate:!0})],nt.prototype,"updateScrollControls",1),m([V("placement",{waitUntilFirstUpdate:!0})],nt.prototype,"syncIndicator",1),nt.define("sl-tab-group");var fp=(e,t)=>{let o=0;return function(...r){window.clearTimeout(o),o=window.setTimeout(()=>{e.call(this,...r)},t)}},yn=(e,t,o)=>{const r=e[t];e[t]=function(...s){r.call(this,...s),o.call(this,r,...s)}};(()=>{if(typeof window>"u")return;if(!("onscrollend"in window)){const t=new Set,o=new WeakMap,r=i=>{for(const a of i.changedTouches)t.add(a.identifier)},s=i=>{for(const a of i.changedTouches)t.delete(a.identifier)};document.addEventListener("touchstart",r,!0),document.addEventListener("touchend",s,!0),document.addEventListener("touchcancel",s,!0),yn(EventTarget.prototype,"addEventListener",function(i,a){if(a!=="scrollend")return;const n=fp(()=>{t.size?n():this.dispatchEvent(new Event("scrollend"))},100);i.call(this,"scroll",n,{passive:!0}),o.set(this,n)}),yn(EventTarget.prototype,"removeEventListener",function(i,a){if(a!=="scrollend")return;const n=o.get(this);n&&i.call(this,"scroll",n,{passive:!0})})}})();var bp=z`
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
`,yp=0,St=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.attrId=++yp,this.componentId=`sl-tab-${this.attrId}`,this.panel="",this.active=!1,this.closable=!1,this.disabled=!1,this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}handleCloseClick(e){e.stopPropagation(),this.emit("sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false"),this.disabled&&!this.active?this.tabIndex=-1:this.tabIndex=0}render(){return this.id=this.id.length>0?this.id:this.componentId,d`
      <div
        part="base"
        class=${ct({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
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
    `}};St.styles=[ot,bp],St.dependencies={"sl-icon-button":it},m([R(".tab")],St.prototype,"tab",2),m([g({reflect:!0})],St.prototype,"panel",2),m([g({type:Boolean,reflect:!0})],St.prototype,"active",2),m([g({type:Boolean,reflect:!0})],St.prototype,"closable",2),m([g({type:Boolean,reflect:!0})],St.prototype,"disabled",2),m([g({type:Number,reflect:!0})],St.prototype,"tabIndex",2),m([V("active")],St.prototype,"handleActiveChange",1),m([V("disabled")],St.prototype,"handleDisabledChange",1),St.define("sl-tab");var vp=z`
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
`,Mp=0,Do=class extends X{constructor(){super(...arguments),this.attrId=++Mp,this.componentId=`sl-tab-panel-${this.attrId}`,this.name="",this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return d`
      <slot
        part="base"
        class=${ct({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};Do.styles=[ot,vp],m([g({reflect:!0})],Do.prototype,"name",2),m([g({type:Boolean,reflect:!0})],Do.prototype,"active",2),m([V("active")],Do.prototype,"handleActiveChange",1),Do.define("sl-tab-panel");const Xs=z`
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
`,wp=[Xs,z`
    :host {
        display: block;
        border: 1px dotted var(--hrcolor);
        margin-top: var(--global-padding);
    }

    .property {
        display: grid;
        grid-template-columns: 200px 200px 1fr;
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
        grid-template-columns: 200px 200px 1fr;
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
`];var Lp=Object.defineProperty,xp=Object.getOwnPropertyDescriptor,Mr=(e,t,o,r)=>{for(var s=r>1?void 0:r?xp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Lp(t,o,s),s};p.PpSchemaProperties=class extends H{constructor(){super(...arguments),this.schemaJson="",this.compact=!1,this.schema=null}willUpdate(t){if(t.has("schemaJson")&&this.schemaJson)try{this.schema=JSON.parse(this.schemaJson)}catch{this.schema=null}}renderRefAnchor(t,o){const r=d`<a class="ref-type-link" href="${o.href}">\u279c ${o.name}</a>`;return this.compact?r:d`
            <pp-ref-popover schema-ref="${t}">${r}</pp-ref-popover>`}renderType(t){return Xu(t,(o,r)=>this.renderRefAnchor(o,r))}renderPropertyRow(t,o,r){return d`
            <div class="property">
                <div class="prop-name-col">
                    ${r.has(t)?d`<span class="required-badge">req</span>`:v}
                    <span class="prop-name">${t}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(o)}
                    ${Je(o,{labelSuffix:":"})}
                </div>
                <div class="prop-desc-col">
                    ${o.description?o.description:v}
                </div>
            </div>
        `}renderPropertyTable(t,o){const r=Object.entries(t);return r.length?r.map(([s,i])=>{const a=i.oneOf??i.anyOf;return a&&Array.isArray(a)?this.compact?this.renderPropertyRow(s,i,o):d`
                    <div class="property-oneof">
                        ${this.renderOneOf(a,s,i.description,o.has(s),"polymorphic")}
                    </div>
                `:this.renderPropertyRow(s,i,o)}):v}renderCompositionRefs(t){return d`
            <div class="composition-refs">
                <span class="composition-label">Composed from</span>
                ${t.map(o=>{const r=Ne(o.$ref);if(!r)return v;const s=Zs(o.$ref),i=(s==null?void 0:s.description)??"";return d`
                        <div class="composition-ref-entry">
                            <span class="composition-ref-link">${this.renderRefAnchor(o.$ref,r)}</span>
                            ${i?d`<span class="composition-ref-desc">${i}</span>`:v}
                        </div>
                    `})}
            </div>
        `}renderComposition(t){const o=t.allOf,r=[],s=new Set(t.required||[]),i={};t.properties&&Object.assign(i,t.properties);for(const a of o)if(a.$ref)r.push(a);else if(a.properties&&Object.assign(i,a.properties),a.required)for(const n of a.required)s.add(n);return d`
            ${r.length?this.renderCompositionRefs(r):v}
            ${Object.keys(i).length?this.renderPropertyTable(i,s):v}
        `}renderOneOf(t,o,r,s,i){return t.length?d`
            <div class="oneof-property">
                <div class="oneof-left">
                    ${o?d`
                        <div class="oneof-prop-name">
                            ${s?d`<span class="required-badge">req</span>`:v}
                            <span class="prop-name">${o}</span>
                            ${i?d`<div class="composition-label polymorphic">(${i})</div>`:v}
                        </div>
                    `:v}
                    ${r?d`<div class="oneof-prop-desc">${r}</div>`:v}
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
        `:v}renderOneOfOption(t){if(t.$ref){const r=Ne(t.$ref);if(!r)return v;const s=Zs(t.$ref);return d`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(t.$ref,r)}
                    ${s!=null&&s.description?d`<span class="oneof-option-desc">${s.description}</span>`:v}
                </div>
            `}const o=new Set(t.required||[]);return d`
            ${t.description?d`<div class="oneof-option-desc">${t.description}</div>`:v}
            ${t.properties?this.renderPropertyTable(t.properties,o):v}
        `}render(){var i,a,n,l;if(!this.schema)return v;const t=this.schema.type==="array"&&((i=this.schema.items)!=null&&i.properties||(a=this.schema.items)!=null&&a.allOf||(n=this.schema.items)!=null&&n.oneOf||(l=this.schema.items)!=null&&l.anyOf)?this.schema.items:this.schema;if(t.allOf&&Array.isArray(t.allOf))return this.renderComposition(t);if(t.oneOf&&Array.isArray(t.oneOf))return this.renderOneOf(t.oneOf,"ONE OF",void 0,void 0,"polymorphic");if(t.anyOf&&Array.isArray(t.anyOf))return this.renderOneOf(t.anyOf,"ANY OF",void 0,void 0,"polymorphic");const o=t.properties||{},r=new Set(t.required||[]);if(!Object.entries(o).length){const c=Hs(t);return!c&&!t.description?v:d`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${c?d`<span class="prop-type">${c}</span>`:v}
                        ${Je(t,{labelSuffix:":"})}
                    </div>
                    <div class="prop-desc-col">
                        ${t.description?t.description:v}
                    </div>
                </div>
            `}return this.renderPropertyTable(o,r)}},p.PpSchemaProperties.styles=[mr,...wp],Mr([g({attribute:"schema-json"})],p.PpSchemaProperties.prototype,"schemaJson",2),Mr([g({type:Boolean,reflect:!0})],p.PpSchemaProperties.prototype,"compact",2),Mr([T()],p.PpSchemaProperties.prototype,"schema",2),p.PpSchemaProperties=Mr([G("pp-schema-properties")],p.PpSchemaProperties);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Ks extends Gr{constructor(t){if(super(t),this.it=v,t.type!==Wr.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===v||t==null)return this._t=void 0,this.it=t;if(t===Vt)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const o=[t];return o.raw=o,this._t={_$litType$:this.constructor.resultType,strings:o,values:[]}}}Ks.directiveName="unsafeHTML",Ks.resultType=1;const Se=Fr(Ks);var vn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Ip(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var qs={exports:{}},Mn;function Cp(){return Mn||(Mn=1,(function(e){var t=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var o=(function(r){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,i=0,a={},n={manual:r.Prism&&r.Prism.manual,disableWorkerMessageHandler:r.Prism&&r.Prism.disableWorkerMessageHandler,util:{encode:function b(f){return f instanceof l?new l(f.type,b(f.content),f.alias):Array.isArray(f)?f.map(b):f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(b){return Object.prototype.toString.call(b).slice(8,-1)},objId:function(b){return b.__id||Object.defineProperty(b,"__id",{value:++i}),b.__id},clone:function b(f,L){L=L||{};var I,x;switch(n.util.type(f)){case"Object":if(x=n.util.objId(f),L[x])return L[x];I={},L[x]=I;for(var N in f)f.hasOwnProperty(N)&&(I[N]=b(f[N],L));return I;case"Array":return x=n.util.objId(f),L[x]?L[x]:(I=[],L[x]=I,f.forEach(function(E,S){I[S]=b(E,L)}),I);default:return f}},getLanguage:function(b){for(;b;){var f=s.exec(b.className);if(f)return f[1].toLowerCase();b=b.parentElement}return"none"},setLanguage:function(b,f){b.className=b.className.replace(RegExp(s,"gi"),""),b.classList.add("language-"+f)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(I){var b=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(I.stack)||[])[1];if(b){var f=document.getElementsByTagName("script");for(var L in f)if(f[L].src==b)return f[L]}return null}},isActive:function(b,f,L){for(var I="no-"+f;b;){var x=b.classList;if(x.contains(f))return!0;if(x.contains(I))return!1;b=b.parentElement}return!!L}},languages:{plain:a,plaintext:a,text:a,txt:a,extend:function(b,f){var L=n.util.clone(n.languages[b]);for(var I in f)L[I]=f[I];return L},insertBefore:function(b,f,L,I){I=I||n.languages;var x=I[b],N={};for(var E in x)if(x.hasOwnProperty(E)){if(E==f)for(var S in L)L.hasOwnProperty(S)&&(N[S]=L[S]);L.hasOwnProperty(E)||(N[E]=x[E])}var k=I[b];return I[b]=N,n.languages.DFS(n.languages,function(_,U){U===k&&_!=b&&(this[_]=N)}),N},DFS:function b(f,L,I,x){x=x||{};var N=n.util.objId;for(var E in f)if(f.hasOwnProperty(E)){L.call(f,E,f[E],I||E);var S=f[E],k=n.util.type(S);k==="Object"&&!x[N(S)]?(x[N(S)]=!0,b(S,L,null,x)):k==="Array"&&!x[N(S)]&&(x[N(S)]=!0,b(S,L,E,x))}}},plugins:{},highlightAll:function(b,f){n.highlightAllUnder(document,b,f)},highlightAllUnder:function(b,f,L){var I={callback:L,container:b,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};n.hooks.run("before-highlightall",I),I.elements=Array.prototype.slice.apply(I.container.querySelectorAll(I.selector)),n.hooks.run("before-all-elements-highlight",I);for(var x=0,N;N=I.elements[x++];)n.highlightElement(N,f===!0,I.callback)},highlightElement:function(b,f,L){var I=n.util.getLanguage(b),x=n.languages[I];n.util.setLanguage(b,I);var N=b.parentElement;N&&N.nodeName.toLowerCase()==="pre"&&n.util.setLanguage(N,I);var E=b.textContent,S={element:b,language:I,grammar:x,code:E};function k(U){S.highlightedCode=U,n.hooks.run("before-insert",S),S.element.innerHTML=S.highlightedCode,n.hooks.run("after-highlight",S),n.hooks.run("complete",S),L&&L.call(S.element)}if(n.hooks.run("before-sanity-check",S),N=S.element.parentElement,N&&N.nodeName.toLowerCase()==="pre"&&!N.hasAttribute("tabindex")&&N.setAttribute("tabindex","0"),!S.code){n.hooks.run("complete",S),L&&L.call(S.element);return}if(n.hooks.run("before-highlight",S),!S.grammar){k(n.util.encode(S.code));return}if(f&&r.Worker){var _=new Worker(n.filename);_.onmessage=function(U){k(U.data)},_.postMessage(JSON.stringify({language:S.language,code:S.code,immediateClose:!0}))}else k(n.highlight(S.code,S.grammar,S.language))},highlight:function(b,f,L){var I={code:b,grammar:f,language:L};if(n.hooks.run("before-tokenize",I),!I.grammar)throw new Error('The language "'+I.language+'" has no grammar.');return I.tokens=n.tokenize(I.code,I.grammar),n.hooks.run("after-tokenize",I),l.stringify(n.util.encode(I.tokens),I.language)},tokenize:function(b,f){var L=f.rest;if(L){for(var I in L)f[I]=L[I];delete f.rest}var x=new h;return M(x,x.head,b),u(b,x,f,x.head,0),w(x)},hooks:{all:{},add:function(b,f){var L=n.hooks.all;L[b]=L[b]||[],L[b].push(f)},run:function(b,f){var L=n.hooks.all[b];if(!(!L||!L.length))for(var I=0,x;x=L[I++];)x(f)}},Token:l};r.Prism=n;function l(b,f,L,I){this.type=b,this.content=f,this.alias=L,this.length=(I||"").length|0}l.stringify=function b(f,L){if(typeof f=="string")return f;if(Array.isArray(f)){var I="";return f.forEach(function(k){I+=b(k,L)}),I}var x={type:f.type,content:b(f.content,L),tag:"span",classes:["token",f.type],attributes:{},language:L},N=f.alias;N&&(Array.isArray(N)?Array.prototype.push.apply(x.classes,N):x.classes.push(N)),n.hooks.run("wrap",x);var E="";for(var S in x.attributes)E+=" "+S+'="'+(x.attributes[S]||"").replace(/"/g,"&quot;")+'"';return"<"+x.tag+' class="'+x.classes.join(" ")+'"'+E+">"+x.content+"</"+x.tag+">"};function c(b,f,L,I){b.lastIndex=f;var x=b.exec(L);if(x&&I&&x[1]){var N=x[1].length;x.index+=N,x[0]=x[0].slice(N)}return x}function u(b,f,L,I,x,N){for(var E in L)if(!(!L.hasOwnProperty(E)||!L[E])){var S=L[E];S=Array.isArray(S)?S:[S];for(var k=0;k<S.length;++k){if(N&&N.cause==E+","+k)return;var _=S[k],U=_.inside,tt=!!_.lookbehind,P=!!_.greedy,lt=_.alias;if(P&&!_.pattern.global){var K=_.pattern.toString().match(/[imsuy]*$/)[0];_.pattern=RegExp(_.pattern.source,K+"g")}for(var F=_.pattern||_,O=I.next,Q=x;O!==f.tail&&!(N&&Q>=N.reach);Q+=O.value.length,O=O.next){var Yt=O.value;if(f.length>b.length)return;if(!(Yt instanceof l)){var Ar=1,Et;if(P){if(Et=c(F,Q,b,tt),!Et||Et.index>=b.length)break;var jr=Et.index,jh=Et.index+Et[0].length,de=Q;for(de+=O.value.length;jr>=de;)O=O.next,de+=O.value.length;if(de-=O.value.length,Q=de,O.value instanceof l)continue;for(var Eo=O;Eo!==f.tail&&(de<jh||typeof Eo.value=="string");Eo=Eo.next)Ar++,de+=Eo.value.length;Ar--,Yt=b.slice(Q,de),Et.index-=Q}else if(Et=c(F,0,Yt,tt),!Et)continue;var jr=Et.index,Nr=Et[0],ii=Yt.slice(0,jr),An=Yt.slice(jr+Nr.length),ai=Q+Yt.length;N&&ai>N.reach&&(N.reach=ai);var Sr=O.prev;ii&&(Sr=M(f,Sr,ii),Q+=ii.length),y(f,Sr,Ar);var Nh=new l(E,U?n.tokenize(Nr,U):Nr,lt,Nr);if(O=M(f,Sr,Nh),An&&M(f,O,An),Ar>1){var ni={cause:E+","+k,reach:ai};u(b,f,L,O.prev,Q,ni),N&&ni.reach>N.reach&&(N.reach=ni.reach)}}}}}}function h(){var b={value:null,prev:null,next:null},f={value:null,prev:b,next:null};b.next=f,this.head=b,this.tail=f,this.length=0}function M(b,f,L){var I=f.next,x={value:L,prev:f,next:I};return f.next=x,I.prev=x,b.length++,x}function y(b,f,L){for(var I=f.next,x=0;x<L&&I!==b.tail;x++)I=I.next;f.next=I,I.prev=f,b.length-=x}function w(b){for(var f=[],L=b.head.next;L!==b.tail;)f.push(L.value),L=L.next;return f}if(!r.document)return r.addEventListener&&(n.disableWorkerMessageHandler||r.addEventListener("message",function(b){var f=JSON.parse(b.data),L=f.language,I=f.code,x=f.immediateClose;r.postMessage(n.highlight(I,n.languages[L],L)),x&&r.close()},!1)),n;var C=n.util.currentScript();C&&(n.filename=C.src,C.hasAttribute("data-manual")&&(n.manual=!0));function j(){n.manual||n.highlightAll()}if(!n.manual){var A=document.readyState;A==="loading"||A==="interactive"&&C&&C.defer?document.addEventListener("DOMContentLoaded",j):window.requestAnimationFrame?window.requestAnimationFrame(j):window.setTimeout(j,16)}return n})(t);e.exports&&(e.exports=o),typeof vn<"u"&&(vn.Prism=o),o.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},o.languages.markup.tag.inside["attr-value"].inside.entity=o.languages.markup.entity,o.languages.markup.doctype.inside["internal-subset"].inside=o.languages.markup,o.hooks.add("wrap",function(r){r.type==="entity"&&(r.attributes.title=r.content.replace(/&amp;/,"&"))}),Object.defineProperty(o.languages.markup.tag,"addInlined",{value:function(s,i){var a={};a["language-"+i]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:o.languages[i]},a.cdata=/^<!\[CDATA\[|\]\]>$/i;var n={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:a}};n["language-"+i]={pattern:/[\s\S]+/,inside:o.languages[i]};var l={};l[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:n},o.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(o.languages.markup.tag,"addAttribute",{value:function(r,s){o.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+r+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:o.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),o.languages.html=o.languages.markup,o.languages.mathml=o.languages.markup,o.languages.svg=o.languages.markup,o.languages.xml=o.languages.extend("markup",{}),o.languages.ssml=o.languages.xml,o.languages.atom=o.languages.xml,o.languages.rss=o.languages.xml,(function(r){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;r.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},r.languages.css.atrule.inside.rest=r.languages.css;var i=r.languages.markup;i&&(i.tag.addInlined("style","css"),i.tag.addAttribute("style","css"))})(o),o.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},o.languages.javascript=o.languages.extend("clike",{"class-name":[o.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),o.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,o.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:o.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:o.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:o.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:o.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:o.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),o.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:o.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),o.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),o.languages.markup&&(o.languages.markup.tag.addInlined("script","javascript"),o.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),o.languages.js=o.languages.javascript,(function(){if(typeof o>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var r="Loading…",s=function(C,j){return"✖ Error "+C+" while fetching file: "+j},i="✖ Error: File does not exist or is empty",a={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},n="data-src-status",l="loading",c="loaded",u="failed",h="pre[data-src]:not(["+n+'="'+c+'"]):not(['+n+'="'+l+'"])';function M(C,j,A){var b=new XMLHttpRequest;b.open("GET",C,!0),b.onreadystatechange=function(){b.readyState==4&&(b.status<400&&b.responseText?j(b.responseText):b.status>=400?A(s(b.status,b.statusText)):A(i))},b.send(null)}function y(C){var j=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(C||"");if(j){var A=Number(j[1]),b=j[2],f=j[3];return b?f?[A,Number(f)]:[A,void 0]:[A,A]}}o.hooks.add("before-highlightall",function(C){C.selector+=", "+h}),o.hooks.add("before-sanity-check",function(C){var j=C.element;if(j.matches(h)){C.code="",j.setAttribute(n,l);var A=j.appendChild(document.createElement("CODE"));A.textContent=r;var b=j.getAttribute("data-src"),f=C.language;if(f==="none"){var L=(/\.(\w+)$/.exec(b)||[,"none"])[1];f=a[L]||L}o.util.setLanguage(A,f),o.util.setLanguage(j,f);var I=o.plugins.autoloader;I&&I.loadLanguages(f),M(b,function(x){j.setAttribute(n,c);var N=y(j.getAttribute("data-range"));if(N){var E=x.split(/\r\n?|\n/g),S=N[0],k=N[1]==null?E.length:N[1];S<0&&(S+=E.length),S=Math.max(0,Math.min(S-1,E.length)),k<0&&(k+=E.length),k=Math.max(0,Math.min(k,E.length)),x=E.slice(S,k).join(`
`),j.hasAttribute("data-start")||j.setAttribute("data-start",String(S+1))}A.textContent=x,o.highlightElement(A)},function(x){j.setAttribute(n,u),A.textContent=x})}}),o.plugins.fileHighlight={highlight:function(j){for(var A=(j||document).querySelectorAll(h),b=0,f;f=A[b++];)o.highlightElement(f)}};var w=!1;o.fileHighlight=function(){w||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),w=!0),o.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(qs)),qs.exports}var Ap=Cp();const Ve=Ip(Ap);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json,(function(e){var t=/[*&][^\s[\]{},]+/,o=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r="(?:"+o.source+"(?:[ 	]+"+t.source+")?|"+t.source+"(?:[ 	]+"+o.source+")?)",s=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),i=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function a(n,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return n});return RegExp(c,l)}e.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return"(?:"+s+"|"+i+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:a(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:a(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:a(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:a(i),lookbehind:!0,greedy:!0},number:{pattern:a(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:o,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism),Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",function(e){e.type==="entity"&&(e.attributes.title=e.content.replace(/&amp;/,"&"))}),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(t,o){var r={};r["language-"+o]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[o]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var s={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};s["language-"+o]={pattern:/[\s\S]+/,inside:Prism.languages[o]};var i={};i[t]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return t}),"i"),lookbehind:!0,greedy:!0,inside:s},Prism.languages.insertBefore("markup","cdata",i)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(e,t){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+e+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;const jp=z`
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
`;var Np=Object.defineProperty,Sp=Object.getOwnPropertyDescriptor,Dt=(e,t,o,r)=>{for(var s=r>1?void 0:r?Sp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Np(t,o,s),s};Ve.manual=!0,p.PpCodeViewer=class extends H{constructor(){super(...arguments),this.code="",this.language="json",this.pretty=!1,this.lineNumbers=!1,this.highlightLines="",this.startLine=1,this.location="",this.embedded=!1,this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:"",language:"",segments:[]},this._highlightCache={spec:"",parsed:new Set}}get displayCode(){if(!this.code)return"";if(this.pretty&&this.language==="json")try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(t){const o=new Set;if(!t)return o;for(const r of t.split(",")){const i=r.trim().match(/^(\d+)(?:-(\d+))?$/);if(!i)continue;const a=parseInt(i[1],10),n=i[2]?parseInt(i[2],10):a;for(let l=Math.min(a,n);l<=Math.max(a,n);l++)o.add(l)}return o}highlightCode(){const t=this.displayCode;if(!t)return"";try{const o=this.language==="xml"?"markup":this.language;return Ve.highlight(t,Ve.languages[o],o)}catch{return t}}splitHighlightedLines(t){const o=[];let r="";const s=[];let i=0;for(;i<t.length;)if(t[i]===`
`){for(let a=s.length-1;a>=0;a--)r+="</span>";o.push(r),r=s.join(""),i++}else if(t[i]==="<")if(t.startsWith("</span>",i))r+="</span>",s.pop(),i+=7;else{const a=t.indexOf(">",i);if(a===-1){r+=t[i],i++;continue}const n=t.slice(i,a+1);r+=n,n.startsWith("</")||s.push(n),i=a+1}else r+=t[i],i++;for(let a=s.length-1;a>=0;a--)r+="</span>";return r&&o.push(r),o}getLineSegments(){const t=this.displayCode;if(t===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;const o=this.highlightCode(),r=o?this.splitHighlightedLines(o):[];return this._segmentCache={code:t,language:this.language,segments:r},r}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){const t=this.parsedHighlights;return t.size>0?t:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}handleLineClick(t,o){if(this.isLocked)return;const r=new Set;if(o.shiftKey&&this.lastClickedLine!==null){const s=Math.min(this.lastClickedLine,t),i=Math.max(this.lastClickedLine,t);for(let a=s;a<=i;a++)r.add(a)}else this.selectedLines.size===1&&this.selectedLines.has(t)||r.add(t);this.selectedLines=r,this.lastClickedLine=t}willUpdate(t){(t.has("code")||t.has("language"))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?d`<div class="location">${this.location}</div>`:v}render(){if(!this.lineNumbers)return d`
              ${this.renderLocation()}
              <pre class="language-${this.language}"><code>${Se(this.highlightCode())}</code></pre>
            `;const t=this.getLineSegments(),o=Math.max(this.startLine,1),r=o+t.length-1,s=r>0?Math.floor(Math.log10(r))+1:1,i=this.effectiveHighlights,a=this.isLocked;return d`
          ${this.renderLocation()}
          <div class="lined-code${a?" locked":""}" style="--gutter-digits: ${s}">
            <pre class="language-${this.language}"><code>${t.map((n,l)=>{const c=o+l,u=i.has(c);return d`<span class="line${u?" highlighted":""}"
                ><span class="line-number"
                       @click=${h=>this.handleLineClick(c,h)}
                >${c}</span><span class="line-content">${Se(n||" ")}</span>
</span>`})}</code></pre>
          </div>
        `}},p.PpCodeViewer.styles=[jp],Dt([g()],p.PpCodeViewer.prototype,"code",2),Dt([g()],p.PpCodeViewer.prototype,"language",2),Dt([g({type:Boolean})],p.PpCodeViewer.prototype,"pretty",2),Dt([g({attribute:"line-numbers",type:Boolean})],p.PpCodeViewer.prototype,"lineNumbers",2),Dt([g({attribute:"highlight-lines"})],p.PpCodeViewer.prototype,"highlightLines",2),Dt([g({attribute:"start-line",type:Number})],p.PpCodeViewer.prototype,"startLine",2),Dt([g()],p.PpCodeViewer.prototype,"location",2),Dt([g({type:Boolean,reflect:!0})],p.PpCodeViewer.prototype,"embedded",2),Dt([T()],p.PpCodeViewer.prototype,"selectedLines",2),Dt([T()],p.PpCodeViewer.prototype,"lastClickedLine",2),p.PpCodeViewer=Dt([G("pp-code-viewer")],p.PpCodeViewer);var Dp=Object.defineProperty,Tp=Object.getOwnPropertyDescriptor,De=(e,t,o,r)=>{for(var s=r>1?void 0:r?Tp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Dp(t,o,s),s};p.PpRefPopover=class extends H{constructor(){super(...arguments),this.registryKey="",this.schemaRef="",this.active=!1,this.entry=null,this.parsedData=null}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.showTimeout),clearTimeout(this.hideTimeout),this.active=!1}show(){clearTimeout(this.hideTimeout),this.showTimeout=window.setTimeout(()=>{if(this.entry=(this.registryKey?fn(this.registryKey):Zs(this.schemaRef))??null,this.entry){try{this.parsedData=JSON.parse(this.entry.schemaJson)}catch{this.parsedData=null}this.active=!0}},300)}hide(){clearTimeout(this.showTimeout),this.hideTimeout=window.setTimeout(()=>{this.active=!1},200)}cancelHide(){clearTimeout(this.hideTimeout)}resolveExample(){var o,r;if((o=this.entry)!=null&&o.mockJson)return this.entry.mockJson;const t=this.parsedData;return t?((r=t.schema)==null?void 0:r.example)!==void 0?JSON.stringify(t.schema.example):t.example!==void 0?JSON.stringify(t.example):Array.isArray(t.examples)&&t.examples.length>0?JSON.stringify(t.examples[0]):null:null}getSchemaJson(){if(!this.entry)return"";const t=this.parsedData;return t?t.schema?JSON.stringify(t.schema):this.entry.schemaJson:this.entry.schemaJson}formatJson(t){try{return JSON.stringify(JSON.parse(t),null,2)}catch{return t}}render(){const t=this.resolveExample(),o=this.getSchemaJson();return d`
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
                            <span class="type-badge">${this.entry.componentType}</span>
                            <span class="component-name">${this.entry.name}</span>
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
                        `:v}
                    </div>
                </sl-popup>
            `:v}
        `}},p.PpRefPopover.styles=Ku,De([g({attribute:"registry-key"})],p.PpRefPopover.prototype,"registryKey",2),De([g({attribute:"schema-ref"})],p.PpRefPopover.prototype,"schemaRef",2),De([T()],p.PpRefPopover.prototype,"active",2),De([T()],p.PpRefPopover.prototype,"entry",2),De([T()],p.PpRefPopover.prototype,"parsedData",2),De([R(".trigger")],p.PpRefPopover.prototype,"trigger",2),p.PpRefPopover=De([G("pp-ref-popover")],p.PpRefPopover);const Ep=z`
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
`;var zp=Object.defineProperty,kp=Object.getOwnPropertyDescriptor,ti=(e,t,o,r)=>{for(var s=r>1?void 0:r?kp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&zp(t,o,s),s};p.PpExtensions=class extends H{constructor(){super(...arguments),this.extensionsJson="",this.extensions=[]}willUpdate(t){if(t.has("extensionsJson"))if(this.extensionsJson)try{this.extensions=JSON.parse(this.extensionsJson)}catch{this.extensions=[]}else this.extensions=[]}renderValue(t){return t==null?v:typeof t=="object"?d`<pp-code-viewer code=${JSON.stringify(t,null,2)} language="json"></pp-code-viewer>`:d`<span class="ext-scalar">${String(t)}</span>`}render(){return this.extensions.length?d`<div class="ext-grid">
      ${this.extensions.map(t=>d`
        <div class="ext-key">${t.key}</div>
        <div class="ext-value">${this.renderValue(t.value)}</div>
      `)}
    </div>`:v}},p.PpExtensions.styles=Ep,ti([g({attribute:"extensions-json"})],p.PpExtensions.prototype,"extensionsJson",2),ti([T()],p.PpExtensions.prototype,"extensions",2),p.PpExtensions=ti([G("pp-extensions")],p.PpExtensions);var $p=Object.defineProperty,Op=Object.getOwnPropertyDescriptor,ei=(e,t,o,r)=>{for(var s=r>1?void 0:r?Op(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&$p(t,o,s),s};p.PpOperationParameters=class extends H{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(t){if(t.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}inIcon(t){switch(t){case"cookie":return"cookie";case"header":return"envelope";case"path":return"signpost";case"query":return"question-diamond";default:return"question-diamond"}}parseSchema(t){if(!t)return null;try{return JSON.parse(t)}catch{return null}}render(){return this.params.length?d`
      ${this.params.map(t=>{var s;const o=this.parseSchema(t.schemaJson),r=Hs(o);return d`
          <div class="parameter">
            <div class="param-name-col">
              ${t.required?d`<span class="required-badge">req</span>`:v}
              ${t.ref?d`
                    <pp-ref-popover registry-key="${t.ref.componentType}/${t.ref.name}"><a
                        class="ref-link param-name" href="models/${t.ref.typeSlug}/${t.ref.slug}.html">\u279c
                      ${t.name}</a></pp-ref-popover>`:d`<span class="param-name">${t.name}</span>`}

              ${t.deprecated?d`<span class="deprecated-badge">deprecated</span>`:v}
            </div>
            <div class="param-type-col">
              ${r?d`<span class="param-type">${r}</span>`:v}
              ${Je(o,{labelSuffix:":"})}
            </div>
            <div class="param-in-col">
              <sl-icon class="param-in-icon" name="${this.inIcon(t.in)}"></sl-icon>
              <span class="param-in">${t.in}</span>
            </div>
            <div class="param-desc-col">
              ${t.description||v}
              ${!t.ref&&(t.rawJson||t.rawYaml)?d`
                    <pp-raw-viewer-btn
                        title="${t.name} (${t.in})"
                        raw-json=${t.rawJson||""}
                        raw-yaml=${t.rawYaml||""}
                        start-line=${t.sourceLine||1}
                        location=${t.location||""}>
                    </pp-raw-viewer-btn>`:v}
            </div>
            ${!t.ref&&(t.rawJson||t.rawYaml)||t.mockJson||t.examples&&Object.keys(t.examples).length>0?d`
                  <div class="param-extras">
                    ${t.mockJson||t.examples&&Object.keys(t.examples).length>0?d`
                          <pp-example-selector
                              mock-json=${t.mockJson||""}
                              examples-json=${t.examples?JSON.stringify(t.examples):""}>
                          </pp-example-selector>`:v}
                  </div>
                `:v}
          </div>
          ${(s=t.extensions)!=null&&s.length?d`
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
            </div>`:v}
          
        `})}
    `:v}},p.PpOperationParameters.styles=[Ge,mr,fr,Fu],ei([g({attribute:"parameters-json"})],p.PpOperationParameters.prototype,"parametersJson",2),ei([T()],p.PpOperationParameters.prototype,"params",2),p.PpOperationParameters=ei([G("pp-operation-parameters")],p.PpOperationParameters);const wn=z`
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
`,_p=z`
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

    /* ── Inline examples ── */

    .inline-example {
        margin-top: 20px;
    }

    .inline-example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding);
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

    .header-extensions {
        padding: 0;
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
`,Pp=z`
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
`;function oi(e){const t=parseInt(e,10);return t>=500?"status-error":t>=400?"status-warn":"status-ok"}const wr={100:"Continue",101:"Switching Protocols",102:"Processing",103:"Early Hints",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Content Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a Teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Too Early",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",510:"Not Extended",511:"Network Authentication Required"};var Rp=z`
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
`,st=class extends X{constructor(){super(...arguments),this.localize=new pt(this),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let e=this.value;if(this.from){const t=this.getRootNode(),o=this.from.includes("."),r=this.from.includes("[")&&this.from.includes("]");let s=this.from,i="";o?[s,i]=this.from.trim().split("."):r&&([s,i]=this.from.trim().replace(/\]$/,"").split("["));const a="getElementById"in t?t.getElementById(s):null;a?r?e=a.getAttribute(i)||"":o?e=a[i]||"":e=a.textContent||"":(this.showStatus("error"),this.emit("sl-error"))}if(!e)this.showStatus("error"),this.emit("sl-error");else try{await navigator.clipboard.writeText(e),this.showStatus("success"),this.emit("sl-copy",{detail:{value:e}})}catch{this.showStatus("error"),this.emit("sl-error")}}async showStatus(e){const t=this.copyLabel||this.localize.term("copy"),o=this.successLabel||this.localize.term("copied"),r=this.errorLabel||this.localize.term("error"),s=e==="success"?this.successIcon:this.errorIcon,i=mt(this,"copy.in",{dir:"ltr"}),a=mt(this,"copy.out",{dir:"ltr"});this.tooltip.content=e==="success"?o:r,await this.copyIcon.animate(a.keyframes,a.options).finished,this.copyIcon.hidden=!0,this.status=e,s.hidden=!1,await s.animate(i.keyframes,i.options).finished,setTimeout(async()=>{await s.animate(a.keyframes,a.options).finished,s.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(i.keyframes,i.options).finished,this.tooltip.content=t,this.isCopying=!1},this.feedbackDuration)}render(){const e=this.copyLabel||this.localize.term("copy");return d`
      <sl-tooltip
        class=${ct({"copy-button":!0,"copy-button--success":this.status==="success","copy-button--error":this.status==="error"})}
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
    `}};st.styles=[ot,Rp],st.dependencies={"sl-icon":ut,"sl-tooltip":rt},m([R('slot[name="copy-icon"]')],st.prototype,"copyIcon",2),m([R('slot[name="success-icon"]')],st.prototype,"successIcon",2),m([R('slot[name="error-icon"]')],st.prototype,"errorIcon",2),m([R("sl-tooltip")],st.prototype,"tooltip",2),m([T()],st.prototype,"isCopying",2),m([T()],st.prototype,"status",2),m([g()],st.prototype,"value",2),m([g()],st.prototype,"from",2),m([g({type:Boolean,reflect:!0})],st.prototype,"disabled",2),m([g({attribute:"copy-label"})],st.prototype,"copyLabel",2),m([g({attribute:"success-label"})],st.prototype,"successLabel",2),m([g({attribute:"error-label"})],st.prototype,"errorLabel",2),m([g({attribute:"feedback-duration",type:Number})],st.prototype,"feedbackDuration",2),m([g({attribute:"tooltip-placement"})],st.prototype,"tooltipPlacement",2),m([g({type:Boolean})],st.prototype,"hoist",2),et("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}}),et("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}}),st.define("sl-copy-button");const Up=[Xs,z`
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
`],Lr=z`
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
`;var Yp=Object.defineProperty,Bp=Object.getOwnPropertyDescriptor,le=(e,t,o,r)=>{for(var s=r>1?void 0:r?Bp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Yp(t,o,s),s};p.PpExampleSelector=class extends H{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.mode="drawer",this.codeLanguage="json",this.entries=[],this.selectedIndex=0}willUpdate(t){(t.has("examplesData")||t.has("mockJson")||t.has("examplesJson"))&&this.buildEntries()}buildEntries(){const t=[];let o=this.mockJson,r={};if(this.examplesData)try{const s=JSON.parse(this.examplesData);s.mockJson&&(o=s.mockJson),s.examples&&(r=s.examples)}catch{}if(this.examplesJson)try{r={...r,...JSON.parse(this.examplesJson)}}catch{}for(const[s,i]of Object.entries(r))i&&t.push({key:s,json:i});o&&t.push({key:"",json:o}),this.entries=t,this.selectedIndex=0}showExample(t){let o=t.json;if(this.codeLanguage==="json")try{o=JSON.stringify(JSON.parse(t.json),null,2)}catch{}const r=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:t.key,json:o,language:this.codeLanguage}});document.dispatchEvent(r)}handleSelect(t){var s,i;const o=(i=(s=t.detail)==null?void 0:s.item)==null?void 0:i.value;if(o===void 0)return;const r=parseInt(o,10);r>=0&&r<this.entries.length&&this.showExample(this.entries[r])}render(){if(!this.entries.length)return v;if(this.mode==="inline")return this.renderInline();if(this.entries.length===1){const t=this.entries[0];return d`
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
    `}handleInlineSelect(t){var r,s;const o=(s=(r=t.detail)==null?void 0:r.item)==null?void 0:s.value;o!==void 0&&(this.selectedIndex=parseInt(o,10))}},p.PpExampleSelector.styles=[...Up,Lr],le([g({attribute:"examples-data"})],p.PpExampleSelector.prototype,"examplesData",2),le([g({attribute:"mock-json"})],p.PpExampleSelector.prototype,"mockJson",2),le([g({attribute:"examples-json"})],p.PpExampleSelector.prototype,"examplesJson",2),le([g()],p.PpExampleSelector.prototype,"mode",2),le([g({attribute:"code-language"})],p.PpExampleSelector.prototype,"codeLanguage",2),le([T()],p.PpExampleSelector.prototype,"entries",2),le([T()],p.PpExampleSelector.prototype,"selectedIndex",2),p.PpExampleSelector=le([G("pp-example-selector")],p.PpExampleSelector);const Hp=[Xs,z`
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
`];var Qp=Object.defineProperty,Zp=Object.getOwnPropertyDescriptor,To=(e,t,o,r)=>{for(var s=r>1?void 0:r?Zp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Qp(t,o,s),s};p.PpMediaTypeSelector=class extends H{constructor(){super(...arguments),this.contentJson="",this.mediaTypes=[],this.selectedIndex=0,this.schemasIdentical=!1}willUpdate(t){if(t.has("contentJson")&&this.contentJson){try{this.mediaTypes=JSON.parse(this.contentJson)}catch{this.mediaTypes=[]}const o=this.mediaTypes.findIndex(r=>r.mediaType.toLowerCase()==="application/json");this.selectedIndex=o>=0?o:0,this.schemasIdentical=this.mediaTypes.length>1&&new Set(this.mediaTypes.map(r=>this.schemaFingerprint(r))).size===1}}schemaFingerprint(t){return t.isArray&&t.itemsRef?`array:${t.itemsRef.slug}:${t.itemsSchemaJson||t.schemaJson}`:t.schemaRef?`ref:${t.schemaRef.slug}`:`inline:${t.schemaJson}`}getMockAndLanguage(t){const o=t.mediaType.toLowerCase();return(o.includes("yaml")||o.includes("x-yaml"))&&t.mockYaml?{mock:t.mockYaml,language:"yaml"}:o.includes("xml")&&t.mockXml?{mock:t.mockXml,language:"xml"}:{mock:t.mockJson||"",language:"json"}}renderRefLink(t){return Qs(t)}renderSchemaHeader(t){return t.isArray&&t.itemsRef?d`
                <div class="media-type-ref">
                    <span class="media-type-label">${t.mediaType}</span>
                    <span class="array-type">Array&lt;${this.renderRefLink(t.itemsRef)}&gt;</span>
                </div>`:t.schemaRef?d`
                <div class="media-type-ref">
                    <span class="media-type-label">${t.mediaType}</span>
                    ${this.renderRefLink(t.schemaRef)}
                </div>`:t.schemaJson?d`<div class="media-type-label">${t.mediaType}</div>`:v}renderSchemaProperties(t){if(t.isArray&&t.itemsRef){const o=t.itemsSchemaJson||t.schemaJson;return o?d`<pp-schema-properties schema-json=${o}></pp-schema-properties>`:v}return t.schemaRef?t.schemaJson?d`<pp-schema-properties schema-json=${t.schemaJson}></pp-schema-properties>`:v:t.schemaJson?d`<pp-schema-properties schema-json=${t.schemaJson}></pp-schema-properties>`:v}renderInlineExamples(t,o,r){const s=t.examples&&Object.keys(t.examples).length>0;return!s&&!r?v:d`
            <pp-example-selector mode="inline" code-language=${o}
                examples-json=${s?JSON.stringify(t.examples):""}
                mock-json=${r}>
            </pp-example-selector>
        `}renderExtensions(t){var o;return(o=t.extensions)!=null&&o.length?d`
            <div class="media-type-extensions">
                <h4>${t.mediaType} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(t.extensions)}></pp-extensions>
            </div>
        `:v}renderRefInfo(t){return t.isArray&&t.itemsRef?d`<span class="array-type">Array&lt;${this.renderRefLink(t.itemsRef)}&gt;</span>`:t.schemaRef?this.renderRefLink(t.schemaRef):v}renderDropdown(t){return d`
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
        `}handleSelect(t){var s,i;const o=(i=(s=t.detail)==null?void 0:s.item)==null?void 0:i.value;if(o===void 0)return;const r=parseInt(o,10);r>=0&&r<this.mediaTypes.length&&(this.selectedIndex=r)}render(){if(!this.mediaTypes.length)return v;if(this.mediaTypes.length===1){const s=this.mediaTypes[0],{mock:i,language:a}=this.getMockAndLanguage(s);return d`
                ${this.renderSchemaHeader(s)}
                ${this.renderInlineExamples(s,a,i)}
                ${this.renderSchemaProperties(s)}
                ${this.renderExtensions(s)}
            `}const t=this.mediaTypes[this.selectedIndex],{mock:o,language:r}=this.getMockAndLanguage(t);if(this.schemasIdentical){const s=this.mediaTypes[0];return d`
                ${this.renderDropdown(t)}
                ${this.renderInlineExamples(t,r,o)}
                ${this.renderSchemaProperties(s)}
                ${this.renderExtensions(t)}
            `}return d`
            ${this.renderDropdown(t)}
            ${this.renderInlineExamples(t,r,o)}
            ${this.renderSchemaProperties(t)}
            ${this.renderExtensions(t)}
        `}},p.PpMediaTypeSelector.styles=[Ge,fr,Hp],To([g({attribute:"content-json"})],p.PpMediaTypeSelector.prototype,"contentJson",2),To([T()],p.PpMediaTypeSelector.prototype,"mediaTypes",2),To([T()],p.PpMediaTypeSelector.prototype,"selectedIndex",2),To([T()],p.PpMediaTypeSelector.prototype,"schemasIdentical",2),p.PpMediaTypeSelector=To([G("pp-media-type-selector")],p.PpMediaTypeSelector);var Wp=Object.defineProperty,Fp=Object.getOwnPropertyDescriptor,Tt=(e,t,o,r)=>{for(var s=r>1?void 0:r?Fp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Wp(t,o,s),s};p.PpOperationResponses=class extends H{constructor(){super(...arguments),this.responsesJson="",this.commonHeadersJson="",this.responses=[],this.commonResponseHeaders=[],this.commonHeaderNames=new Set,this.commonErrorKeys=new Set,this.commonErrorResponses=new Map,this.successResponses=[],this.redirectResponses=[],this.errorResponses=[]}willUpdate(t){if(t.has("responsesJson")&&this.responsesJson){try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}const o=[...this.responses].sort((l,c)=>parseInt(l.statusCode,10)-parseInt(c.statusCode,10)),r=[],s=[],i=[];for(const l of o){const c=parseInt(l.statusCode,10);c>=400?i.push(l):c>=300?s.push(l):r.push(l)}this.successResponses=r,this.redirectResponses=s,this.errorResponses=i;const{commonKeys:a,commonResponses:n}=this.computeCommonErrors(i);this.commonErrorKeys=a,this.commonErrorResponses=n}if(t.has("commonHeadersJson")&&this.commonHeadersJson){try{this.commonResponseHeaders=JSON.parse(this.commonHeadersJson)}catch{this.commonResponseHeaders=[]}this.commonHeaderNames=new Set(this.commonResponseHeaders.map(o=>o.name))}}getResponseNavItems(){const t=[];for(const o of[...this.successResponses,...this.redirectResponses,...this.errorResponses])t.push({label:`${o.statusCode} ${wr[o.statusCode]||""}`.trim(),id:`response-${o.statusCode}`});return t}renderRefLink(t,o=!1){return Qs(t,o)}scrollToHeader(t){var s,i;const o=(s=this.shadowRoot)==null?void 0:s.getElementById("header-"+t);if(!o)return;const r=o.closest("sl-details");r&&!r.open?(r.open=!0,(i=r.updateComplete)==null||i.then(()=>{o.scrollIntoView({behavior:"smooth",block:"center"})})):o.scrollIntoView({behavior:"smooth",block:"center"})}renderHeaderEntry(t){var o;return d`
            <div class="header-entry">
                <div class="header-name-col">
                    ${t.ref?d`
                                <pp-ref-popover registry-key="${t.ref.componentType}/${t.ref.name}"><a
                                        class="ref-link header-name" href="models/${t.ref.typeSlug}/${t.ref.slug}.html">\u279c
                                    ${t.name}</a></pp-ref-popover>`:d`<span class="header-name">${t.name}</span>`}
                </div>
                <div class="header-type-col">
                    ${t.schemaType?d`<span class="header-type">${t.schemaType}</span>`:v}
                    ${Je(t,{includeExample:!0})}
                </div>
                <div class="header-desc-col">
                    ${t.description||v}
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
            `:v}
        `}renderHeaders(t,o){if(!t||!t.length)return v;const r=t.filter(i=>!o.has(i.name)),s=t.filter(i=>o.has(i.name));return!r.length&&!s.length?v:d`
            <div class="headers-section">
                <h4 class="headers-label">Response Headers</h4>
                    ${r.length?d`
                        <div class="headers-values">
                            ${r.map(i=>this.renderHeaderEntry(i))}
                        </div>`:v}
                ${s.length?d`
                    <div class="common-link-label">\u2191 common headers</div>
                    <ul class="common-header-list">
                        ${s.map(i=>d`
                            <li><a class="header-anchor" @click=${a=>{a.preventDefault(),this.scrollToHeader(i.name)}}>${i.name}</a></li>
                        `)}
                    </ul>
                `:v}
            </div>
        `}renderLinks(t){return t!=null&&t.length?d`
            <div class="links-section">
                <h4 class="links-label">Response Links</h4>
                ${t.map(o=>d`
                    <div class="link-entry">
                        <span class="link-name">${o.ref?d`<pp-ref-popover registry-key="links/${o.ref.name}"><a class="ref-link" href="models/${o.ref.typeSlug}/${o.ref.slug}.html">\u279c ${o.name}</a></pp-ref-popover>`:o.name}</span>
                        ${o.operationId?d`<span class="link-target">\u2192 ${o.operationSlug?d`<a class="ref-link" href="operations/${o.operationSlug}.html">${o.operationId}</a>`:o.operationId}</span>`:v}
                        ${o.operationRef?d`<span class="link-target">\u2192 ${o.operationRef}</span>`:v}
                        ${o.description?d`<span class="link-desc">${o.description}</span>`:v}
                    </div>
                `)}
            </div>
        `:v}errorRefKey(t){var o;if(t.ref)return`ref:${t.ref.slug}`;if((o=t.content)!=null&&o.length){const r=t.content[0];if(r.schemaRef)return`schema:${r.schemaRef.slug}`;if(r.isArray&&r.itemsRef)return`items:${r.itemsRef.slug}`}return null}computeCommonErrors(t){const o=new Map;for(const i of t){const a=this.errorRefKey(i);if(!a)continue;const n=o.get(a);n?n.codeDescs.push({code:i.statusCode,description:i.description}):o.set(a,{resp:i,codeDescs:[{code:i.statusCode,description:i.description}]})}const r=new Set,s=new Map;for(const[i,a]of o)a.codeDescs.length>=2&&(r.add(i),s.set(i,a));return{commonKeys:r,commonResponses:s}}scrollToCommonError(t){var r;const o=(r=this.shadowRoot)==null?void 0:r.getElementById("common-error-"+t);o==null||o.scrollIntoView({behavior:"smooth",block:"nearest"})}renderResponse(t,o,r){var a,n,l;const s=r?this.errorRefKey(t):null,i=s!=null&&(r==null?void 0:r.has(s));return d`
            <div class="response" id="response-${t.statusCode}">
                    <h3><span class="status-code ${oi(t.statusCode)}">${t.statusCode}</span> ${wr[t.statusCode]||""}
                        ${t.rawJson||t.rawYaml?d`
                                <pp-raw-viewer-btn
                                        title="Response ${t.statusCode}"
                                        raw-json=${t.rawJson||""}
                                        raw-yaml=${t.rawYaml||""}
                                        start-line=${t.sourceLine||1}
                                        location=${t.location||""}>
                                </pp-raw-viewer-btn>`:v}
                    </h3>
                    ${t.descHtml?d`<div class="response-desc">${Se(t.descHtml)}</div>`:v}
              
                ${i?d`
                            <div class="common-error-link">
                                ${t.ref?this.renderRefLink(t.ref,!0):v}
                                ${!t.ref&&((a=t.content)!=null&&a.length)?this.renderMediaTypeHeader(t.content[0]):v}
                                <a class="error-anchor" @click=${c=>{c.preventDefault(),this.scrollToCommonError(s)}}>\u2191 see common example</a>
                            </div>`:t.ref?this.renderRefLink(t.ref,!0):(n=t.content)!=null&&n.length?d`<pp-media-type-selector content-json=${JSON.stringify(t.content)}></pp-media-type-selector>`:v}
                ${this.renderHeaders(t.headers??[],o)}
                ${this.renderLinks(t.links??[])}
                ${(l=t.extensions)!=null&&l.length?d`
                    <div class="response-extensions">
                        <h4>Response ${t.statusCode} Extensions</h4>
                        <pp-extensions extensions-json=${JSON.stringify(t.extensions)}></pp-extensions>
                    </div>`:v}
            </div>
        `}renderMediaTypeHeader(t){return t.isArray&&t.itemsRef?d`
                <span class="media-type-label">${t.mediaType}</span>
                <span class="array-type">Array&lt;${this.renderRefLink(t.itemsRef)}&gt;</span>
            `:t.schemaRef?d`
                <span class="media-type-label">${t.mediaType}</span>
                ${this.renderRefLink(t.schemaRef)}
            `:v}renderCommonErrors(t,o){return t.size?d`
            <div class="response-group-heading"><h4>Common Error Responses</h4></div>
            ${[...t.entries()].map(([r,{resp:s,codeDescs:i}])=>{var a;return d`
                <div class="response common-error-response" id="common-error-${r}">
                    <div class="common-error-grid">
                        ${i.map(({code:n,description:l})=>d`
                            <div class="common-error-code"><span class="${oi(n)}">${n}</span> ${wr[n]||""}</div>
                            <div class="common-error-desc">${l}</div>
                        `)}
                    </div>
                    ${s.ref?this.renderRefLink(s.ref,!0):(a=s.content)!=null&&a.length?d`<pp-media-type-selector content-json=${JSON.stringify(s.content)}></pp-media-type-selector>`:v}
                    ${this.renderHeaders(s.headers??[],o)}
                </div>
            `})}
        `:v}render(){if(!this.responses.length)return v;const t=this.commonHeaderNames,o=this.commonErrorKeys,r=this.commonErrorResponses;return d`
            <h2>Responses</h2>
            ${this.successResponses.map(s=>this.renderResponse(s,t))}
            ${this.redirectResponses.length?d`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Redirect Responses</h3></span>
                    ${this.redirectResponses.map(s=>this.renderResponse(s,t))}
                </sl-details>
            `:v}
            ${this.commonResponseHeaders.length?d`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Common Response Headers</h3></span>
                    <div class="property-box">
                        ${this.commonResponseHeaders.map(s=>d`
                            <div id="header-${s.name}">${this.renderHeaderEntry(s)}</div>
                        `)}
                    </div>
                </sl-details>
            `:v}
            ${this.errorResponses.length||r.size?d`
                <sl-details class="pp-details">
                    <div slot="summary" class="pp-details-summary"><h3>Error Responses</h3></div>
                    ${this.renderCommonErrors(r,t)}
                    ${this.errorResponses.map(s=>this.renderResponse(s,t,o))}
                </sl-details>
            `:v}
        `}},p.PpOperationResponses.styles=[Ge,mr,fr,wn,_p,Pp],Tt([g({attribute:"responses-json"})],p.PpOperationResponses.prototype,"responsesJson",2),Tt([g({attribute:"common-headers-json"})],p.PpOperationResponses.prototype,"commonHeadersJson",2),Tt([T()],p.PpOperationResponses.prototype,"responses",2),Tt([T()],p.PpOperationResponses.prototype,"commonResponseHeaders",2),Tt([T()],p.PpOperationResponses.prototype,"commonHeaderNames",2),Tt([T()],p.PpOperationResponses.prototype,"commonErrorKeys",2),Tt([T()],p.PpOperationResponses.prototype,"commonErrorResponses",2),Tt([T()],p.PpOperationResponses.prototype,"successResponses",2),Tt([T()],p.PpOperationResponses.prototype,"redirectResponses",2),Tt([T()],p.PpOperationResponses.prototype,"errorResponses",2),p.PpOperationResponses=Tt([G("pp-operation-responses")],p.PpOperationResponses);const Gp=z`
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

`;var Jp=Object.defineProperty,Vp=Object.getOwnPropertyDescriptor,ri=(e,t,o,r)=>{for(var s=r>1?void 0:r?Vp(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Jp(t,o,s),s};p.PpOperationCallbacks=class extends H{constructor(){super(...arguments),this.callbacksJson="",this.callbacks=[]}willUpdate(t){if(t.has("callbacksJson")&&this.callbacksJson)try{this.callbacks=JSON.parse(this.callbacksJson)}catch{this.callbacks=[]}}renderRefLink(t){return Qs(t,!0)}renderRequestBody(t){var o;return t.ref?d`<div class="callback-section-label">Request Body</div>${this.renderRefLink(t.ref)}`:(o=t.content)!=null&&o.length?d`
            <div class="callback-section-label">Request Body${t.required?" (required)":""}</div>
            ${t.descHtml?d`<div class="callback-desc">${Se(t.descHtml)}</div>`:v}
            <pp-media-type-selector content-json=${JSON.stringify(t.content)}></pp-media-type-selector>
        `:v}renderResponses(t){return t!=null&&t.length?d`
            <div class="callback-section-label">Responses</div>
            ${t.map(o=>{var r;return d`
                <div class="callback-response">
                    <span class="callback-response-code ${oi(o.statusCode)}">${o.statusCode}</span>
                    <span class="callback-response-code">${wr[o.statusCode]||""}</span>
                    ${o.descHtml?d`<span class="callback-response-desc">${Se(o.descHtml)}</span>`:o.description?d`<span class="callback-response-desc">${o.description}</span>`:v}
                </div>
                ${o.ref?this.renderRefLink(o.ref):v}
                ${!o.ref&&((r=o.content)!=null&&r.length)?d`<pp-media-type-selector content-json=${JSON.stringify(o.content)}></pp-media-type-selector>`:v}
            `})}
        `:v}renderCallbackOperation(t){return d`
            <div class="callback-operation">
                <div class="callback-method-expression">
                    <pb33f-http-method method=${t.method}></pb33f-http-method>
                    <span class="callback-expression">${t.expression}</span>
                </div>
                ${t.descHtml?d`<div class="callback-desc">${Se(t.descHtml)}</div>`:v}
                ${t.requestBody?this.renderRequestBody(t.requestBody):v}
                ${this.renderResponses(t.responses??[])}
            </div>
        `}render(){return this.callbacks.length?d`
            ${this.callbacks.map(t=>d`
                <div class="callback-entry">
                    <div class="callback-name">
                        ${t.ref?this.renderRefLink(t.ref):v}
                        ${t.name}
                    </div>
                    ${t.operations.map(o=>this.renderCallbackOperation(o))}
                </div>
            `)}
        `:v}},p.PpOperationCallbacks.styles=[Ge,fr,wn,Gp],ri([g({attribute:"callbacks-json"})],p.PpOperationCallbacks.prototype,"callbacksJson",2),ri([T()],p.PpOperationCallbacks.prototype,"callbacks",2),p.PpOperationCallbacks=ri([G("pp-operation-callbacks")],p.PpOperationCallbacks);const Xp=z`
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
`,Kp=z`
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
`;var qp=Object.defineProperty,th=Object.getOwnPropertyDescriptor,ce=(e,t,o,r)=>{for(var s=r>1?void 0:r?th(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&qp(t,o,s),s};p.PpInlineCode=class extends H{constructor(){super(...arguments),this.rawJson="",this.rawYaml="",this.startLine=1,this.title="Schema",this.location="",this.noLineNumbers=!1,this.mode="yaml"}connectedCallback(){super.connectedCallback();const t=document.body.getAttribute("data-spec-format");(t==="json"||t==="yaml")&&(this.mode=t)}render(){if(!this.rawJson&&!this.rawYaml)return v;const t=!!this.rawJson,o=!!this.rawYaml,r=this.mode==="yaml"&&o?this.rawYaml:this.rawJson,s=this.mode==="yaml"&&o?"yaml":"json",i=t&&o;return d`
      ${this.title||i?d`
      <div class="toolbar">
        ${this.title?d`<h3>${this.title}</h3>`:v}
        ${i?d`
          <div class="toggle-group">
            <button class="toggle-btn ${this.mode==="json"?"active":""}"
                    @click=${()=>this.mode="json"}>JSON</button>
            <button class="toggle-btn ${this.mode==="yaml"?"active":""}"
                    @click=${()=>this.mode="yaml"}>YAML</button>
          </div>
        `:v}
      </div>
      `:v}
      <div class="code-container">
        <sl-copy-button .value=${r} class="floating-copy"></sl-copy-button>
        <pp-code-viewer
          code=${r}
          language=${s}
          ?pretty=${s==="json"}
          ?line-numbers=${!this.noLineNumbers&&(s==="json"?r.includes(`
`)||r.startsWith("{")||r.startsWith("["):r.indexOf(`
`)!==-1)}
          start-line=${this.startLine}
          location=${this.location}>
        </pp-code-viewer>
      </div>
    `}},p.PpInlineCode.styles=[Kp,Lr],ce([g({attribute:"raw-json"})],p.PpInlineCode.prototype,"rawJson",2),ce([g({attribute:"raw-yaml"})],p.PpInlineCode.prototype,"rawYaml",2),ce([g({attribute:"start-line",type:Number})],p.PpInlineCode.prototype,"startLine",2),ce([g()],p.PpInlineCode.prototype,"title",2),ce([g()],p.PpInlineCode.prototype,"location",2),ce([g({attribute:"no-line-numbers",type:Boolean})],p.PpInlineCode.prototype,"noLineNumbers",2),ce([T()],p.PpInlineCode.prototype,"mode",2),p.PpInlineCode=ce([G("pp-inline-code")],p.PpInlineCode);var eh=Object.defineProperty,oh=Object.getOwnPropertyDescriptor,Rt=(e,t,o,r)=>{for(var s=r>1?void 0:r?oh(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&eh(t,o,s),s};p.PpModelPage=class extends H{constructor(){super(...arguments),this.modelJson="",this.name="",this.rawYaml="",this.schemaRawYaml="",this.schemaRawJson="",this.schemaStartLine=1,this.startLine=1,this.location="",this.parsed=null}willUpdate(t){if(t.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}renderExampleObjects(t){const o=Object.entries(t);return o.length?d`
      <h3>Examples</h3>
      ${o.map(([r,s])=>d`
        <div class="example-object">
          <div class="example-header">
            <span class="prop-name">${r}</span>
            ${s.summary?d`<span class="example-summary">${s.summary}</span>`:v}
          </div>
          ${s.description?d`<div class="prop-desc">${s.description}</div>`:v}
          ${s.value!==void 0?d`<pp-inline-code raw-json=${JSON.stringify(s.value,null,2)} title=${r} no-line-numbers></pp-inline-code>`:v}
          ${s.externalValue?d`<div class="example-external"><a href=${s.externalValue}>${s.externalValue}</a></div>`:v}
        </div>
      `)}
    `:v}renderComponentWithSchema(t,o){const r=t.schema||{},s=this.schemaRawJson||JSON.stringify(r,null,2),i=this.schemaRawYaml;return d`
      <div class="traits">
        <h3>Traits</h3>
        <div class="constraints">
          ${o}
          ${r.type?d`
            <span class="constraint-label">type</span>
            <span class="constraint-value">${r.type}${r.format?` (${r.format})`:""}</span>
          `:v}
        </div>
        ${Je(r,{includeExample:!0})}
      </div>
      ${t.examples?this.renderExampleObjects(t.examples):v}
      ${!t.examples&&(t.example!==void 0||r.example!==void 0)?d`<pp-inline-code raw-json=${JSON.stringify(t.example??r.example,null,2)} title="" no-line-numbers></pp-inline-code>`:v}
      ${Object.keys(r).length?d`<pp-inline-code
            raw-json=${s}
            raw-yaml=${i}
            start-line=${this.schemaStartLine}
            title="Schema"></pp-inline-code>`:v}
    `}renderParameter(t){return this.renderComponentWithSchema(t,d`
      <span class="constraint-label">name</span>
      <span class="constraint-value">${t.name}</span>
      <span class="constraint-label">in</span>
      <span class="constraint-value">${t.in}</span>
      ${t.required!==void 0?d`
        <span class="constraint-label">required</span>
        <span class="constraint-value">${t.required}</span>
      `:v}
      ${t.deprecated?d`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:v}
    `)}renderHeader(t){return this.renderComponentWithSchema(t,d`
      ${t.required?d`
        <span class="constraint-label">required</span>
        <span class="constraint-value">true</span>
      `:v}
      ${t.deprecated?d`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:v}
    `)}renderSchema(t){const o=t.example!==void 0?JSON.stringify(t.example,null,2):"",r=t.properties||t.allOf||t.oneOf||t.anyOf;return d`
      ${o?d`<pp-inline-code raw-json=${o} title="" no-line-numbers></pp-inline-code>`:v}
      ${!r&&t.type?d`<div><strong>Type:</strong> ${t.type}${t.format?d` <span class="prop-format">(${t.format})</span>`:v}</div>`:v}
      ${r?v:Je(t)}
      ${r?d`
            <h3>${t.properties?"Properties":t.allOf?"Composition":"Variants"}</h3>
            <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
          `:v}
    `}render(){if(!this.parsed)return v;const t=this.parsed;return t.in?this.renderParameter(t):t.schema&&!t.properties&&!t.in?this.renderHeader(t):this.renderSchema(t)}},p.PpModelPage.styles=[Ge,mr,Xp],Rt([g({attribute:"model-json"})],p.PpModelPage.prototype,"modelJson",2),Rt([g()],p.PpModelPage.prototype,"name",2),Rt([g({attribute:"raw-yaml"})],p.PpModelPage.prototype,"rawYaml",2),Rt([g({attribute:"schema-raw-yaml"})],p.PpModelPage.prototype,"schemaRawYaml",2),Rt([g({attribute:"schema-raw-json"})],p.PpModelPage.prototype,"schemaRawJson",2),Rt([g({attribute:"schema-start-line",type:Number})],p.PpModelPage.prototype,"schemaStartLine",2),Rt([g({attribute:"start-line",type:Number})],p.PpModelPage.prototype,"startLine",2),Rt([g()],p.PpModelPage.prototype,"location",2),Rt([T()],p.PpModelPage.prototype,"parsed",2),p.PpModelPage=Rt([G("pp-model-page")],p.PpModelPage);const rh=z`
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
`;var sh=Object.defineProperty,ih=Object.getOwnPropertyDescriptor,xr=(e,t,o,r)=>{for(var s=r>1?void 0:r?ih(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&sh(t,o,s),s};p.PpModelCard=class extends H{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return d`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?d`<p>${this.description}</p>`:""}
      </a>
    `}},p.PpModelCard.styles=rh,xr([g()],p.PpModelCard.prototype,"name",2),xr([g()],p.PpModelCard.prototype,"href",2),xr([g()],p.PpModelCard.prototype,"description",2),p.PpModelCard=xr([G("pp-model-card")],p.PpModelCard);const ah=z`
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
`;var nh=Object.defineProperty,lh=Object.getOwnPropertyDescriptor,si=(e,t,o,r)=>{for(var s=r>1?void 0:r?lh(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&nh(t,o,s),s};p.PpCrossRefs=class extends H{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(t){if(t.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var r,s,i,a,n,l;const{refs:t}=this;return((r=t.UsedByOperations)==null?void 0:r.length)||((s=t.UsedByModels)==null?void 0:s.length)||((i=t.UsesModels)==null?void 0:i.length)?d`
      ${(a=t.UsedByOperations)!=null&&a.length?d`
            <h3>Used by Operations</h3>
            <ul>
              ${t.UsedByOperations.map(c=>d`
                  <li>
                    <a href="operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:v}
      ${(n=t.UsedByModels)!=null&&n.length?d`
            <h3>Referenced by</h3>
            <ul>
              ${t.UsedByModels.map(c=>d`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:v}
      ${(l=t.UsesModels)!=null&&l.length?d`
            <h3>References</h3>
            <ul>
              ${t.UsesModels.map(c=>d`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:v}
    `:v}},p.PpCrossRefs.styles=ah,si([g({attribute:"refs-json"})],p.PpCrossRefs.prototype,"refsJson",2),si([T()],p.PpCrossRefs.prototype,"refs",2),p.PpCrossRefs=si([G("pp-cross-refs")],p.PpCrossRefs);const ch=z`
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
`,dh=At`
  
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

 
`,uh=z`
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
`;var ph=Object.defineProperty,hh=Object.getOwnPropertyDescriptor,Ir=(e,t,o,r)=>{for(var s=r>1?void 0:r?hh(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&ph(t,o,s),s};Ve.manual=!0,p.PpExampleBlock=class extends H{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(t){if(t.has("exampleJson")&&this.exampleJson)try{const o=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(o,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return v;let t;try{t=Ve.highlight(this.formatted,Ve.languages.json,"json")}catch{t=this.formatted}return d`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${Se(t)}</code></pre>
      </details>
    `}},p.PpExampleBlock.styles=[ch,dh,uh],Ir([g()],p.PpExampleBlock.prototype,"name",2),Ir([g({attribute:"example-json"})],p.PpExampleBlock.prototype,"exampleJson",2),Ir([T()],p.PpExampleBlock.prototype,"formatted",2),p.PpExampleBlock=Ir([G("pp-example-block")],p.PpExampleBlock);const gh=z`
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
`;var mh=Object.defineProperty,fh=Object.getOwnPropertyDescriptor,wt=(e,t,o,r)=>{for(var s=r>1?void 0:r?fh(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&mh(t,o,s),s};p.PpExampleDrawer=class extends H{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.rawMode=!1,this.highlightLines="",this.startLine=1,this.location="",this.method="",this.path="",this.handleShowExample=t=>{const o=t.detail;if(this.title=o.title,this.json=o.json,this.yaml=o.yaml||"",this.rawMode=o.rawMode??!1,this.highlightLines=o.highlightLines||"",this.startLine=o.startLine??1,this.location=o.location||"",this.method=o.method||"",this.path=o.path||"",o.language)this.format=o.language;else{const r=document.body.getAttribute("data-spec-format");r==="yaml"&&o.yaml?this.format="yaml":r==="json"&&o.json?this.format="json":this.format=o.yaml?"yaml":"json"}this.updateComplete.then(()=>{const r=this.drawer;r&&(r.updateComplete?r.updateComplete.then(()=>r.show()):r.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get copyText(){var o;const t=(o=this.shadowRoot)==null?void 0:o.querySelector("pp-code-viewer");return t?t.displayCode:this.format==="yaml"&&this.yaml?this.yaml:this.json}renderHeader(){return this.method&&this.path?d`
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
    `}},p.PpExampleDrawer.styles=[gh,Lr],wt([T()],p.PpExampleDrawer.prototype,"title",2),wt([T()],p.PpExampleDrawer.prototype,"json",2),wt([T()],p.PpExampleDrawer.prototype,"yaml",2),wt([T()],p.PpExampleDrawer.prototype,"format",2),wt([T()],p.PpExampleDrawer.prototype,"rawMode",2),wt([T()],p.PpExampleDrawer.prototype,"highlightLines",2),wt([T()],p.PpExampleDrawer.prototype,"startLine",2),wt([T()],p.PpExampleDrawer.prototype,"location",2),wt([T()],p.PpExampleDrawer.prototype,"method",2),wt([T()],p.PpExampleDrawer.prototype,"path",2),wt([R("sl-drawer")],p.PpExampleDrawer.prototype,"drawer",2),p.PpExampleDrawer=wt([G("pp-example-drawer")],p.PpExampleDrawer);const bh=z`
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
`;var yh=Object.defineProperty,vh=Object.getOwnPropertyDescriptor,Ut=(e,t,o,r)=>{for(var s=r>1?void 0:r?vh(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&yh(t,o,s),s};p.PpRawViewerBtn=class extends H{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml="",this.highlightLines="",this.startLine=1,this.location="",this.method="",this.path="",this.showTextLabel=!1}showRaw(){const t=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0,method:this.method||void 0,path:this.path||void 0}});document.dispatchEvent(t)}render(){return!this.rawJson&&!this.rawYaml?v:d`
            <sl-tooltip content="VIEW RAW OBJECT">
                <sl-button variant="text" size="small" @click=${this.showRaw}>
                    <sl-icon slot="prefix" name="braces" label="VIEW RAW OBJECT" ></sl-icon>
                </sl-button>
            </sl-tooltip>`}},p.PpRawViewerBtn.styles=[bh,Lr],Ut([g({attribute:"title"})],p.PpRawViewerBtn.prototype,"btnTitle",2),Ut([g({attribute:"raw-json"})],p.PpRawViewerBtn.prototype,"rawJson",2),Ut([g({attribute:"raw-yaml"})],p.PpRawViewerBtn.prototype,"rawYaml",2),Ut([g({attribute:"highlight-lines"})],p.PpRawViewerBtn.prototype,"highlightLines",2),Ut([g({attribute:"start-line",type:Number})],p.PpRawViewerBtn.prototype,"startLine",2),Ut([g()],p.PpRawViewerBtn.prototype,"location",2),Ut([g()],p.PpRawViewerBtn.prototype,"method",2),Ut([g()],p.PpRawViewerBtn.prototype,"path",2),Ut([g({type:Boolean})],p.PpRawViewerBtn.prototype,"showTextLabel",2),p.PpRawViewerBtn=Ut([G("pp-raw-viewer-btn")],p.PpRawViewerBtn);const Mh=z`
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
`;var wh=Object.defineProperty,Lh=Object.getOwnPropertyDescriptor,Te=(e,t,o,r)=>{for(var s=r>1?void 0:r?Lh(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&wh(t,o,s),s};const Ln="pp-page-nav-collapsed",xn="pp-page-nav-hidden";p.PpPageNav=class extends H{constructor(){super(...arguments),this.pageTitle="",this.sectionsJson="",this.sections=[],this.collapsed=!1,this.navHidden=!1,this.activeId="",this.scrollContainer=null,this.rafId=0,this.scrollSpySuppressed=!1,this.suppressionTimerId=0,this.boundScrollHandler=()=>this.onScroll()}connectedCallback(){super.connectedCallback(),this.collapsed=localStorage.getItem(Ln)==="true",this.navHidden=localStorage.getItem(xn)==="true"}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.scrollContainer)==null||t.removeEventListener("scroll",this.boundScrollHandler),this.clearSuppressionTimer()}clearSuppressionTimer(){this.suppressionTimerId&&(window.clearTimeout(this.suppressionTimerId),this.suppressionTimerId=0)}updated(t){t.has("navHidden")&&this.toggleAttribute("nav-hidden",this.navHidden)}willUpdate(t){if(t.has("sectionsJson")&&this.sectionsJson){try{this.sections=JSON.parse(this.sectionsJson)}catch{this.sections=[]}this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}}loadResponseChildren(){var r;const t=this.sections.find(s=>s.id==="section-responses");if(!t)return;const o=()=>{const s=document.getElementById("section-responses");s&&typeof s.getResponseNavItems=="function"&&(t.children=s.getResponseNavItems(),this.requestUpdate())};o(),(r=t.children)!=null&&r.length||customElements.whenDefined("pp-operation-responses").then(()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>o())})})}setupScrollSpy(){var o;const t=document.querySelector("pp-layout");this.scrollContainer=((o=t==null?void 0:t.shadowRoot)==null?void 0:o.querySelector(".content-panel"))||null,this.scrollContainer&&this.scrollContainer.addEventListener("scroll",this.boundScrollHandler,{passive:!0})}suppressScrollSpy(){this.scrollSpySuppressed=!0,this.clearSuppressionTimer()}scheduleScrollSpyResume(){this.clearSuppressionTimer(),this.suppressionTimerId=window.setTimeout(()=>{this.scrollSpySuppressed=!1,this.suppressionTimerId=0},150)}onScroll(){if(this.scrollSpySuppressed){this.scheduleScrollSpyResume();return}this.rafId||(this.rafId=requestAnimationFrame(()=>{this.rafId=0,this.updateActiveSection()}))}updateActiveSection(){let o="";for(const r of this.sections){const s=this.findElement(r.id);if(s&&s.getBoundingClientRect().top<=100&&(o=r.id),r.children)for(const i of r.children){const a=this.findElement(i.id);a&&a.getBoundingClientRect().top<=100&&(o=i.id)}}o&&o!==this.activeId&&(this.activeId=o)}findElement(t){const o=document.getElementById(t);if(o)return o;const r=document.getElementById("section-responses");return r!=null&&r.shadowRoot?r.shadowRoot.getElementById(t):null}navigateTo(t){this.suppressScrollSpy(),this.activeId=t;const o=this.findElement(t);if(!o)return;const s=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",i=o.closest("sl-details");i&&!i.open?(i.addEventListener("sl-after-show",()=>{o.scrollIntoView({behavior:s,block:"center"})},{once:!0}),i.open=!0):o.scrollIntoView({behavior:s,block:"center"})}toggleCollapsed(){this.collapsed=!this.collapsed,localStorage.setItem(Ln,String(this.collapsed))}toggleNavHidden(){var r,s;const t=(r=this.shadowRoot)==null?void 0:r.querySelector(".collapse-tab");t&&(t.addEventListener("animationend",()=>t.classList.remove("flashing"),{once:!0}),t.classList.add("flashing"));const o=(s=this.shadowRoot)==null?void 0:s.querySelector(".nav-container");!this.navHidden&&o?o.style.height=o.offsetHeight+"px":this.navHidden&&o&&(o.style.height=""),this.navHidden=!this.navHidden,localStorage.setItem(xn,String(this.navHidden))}handleTabKeydown(t){(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.toggleNavHidden())}statusColorClass(t){const o=t.substring(0,1);return o==="2"?"status-2xx":o==="3"?"status-3xx":o==="4"?"status-4xx":o==="5"?"status-5xx":""}render(){return d`
            <div class="nav-container">
                <nav aria-label="Page sections">
                    <div class="nav-header" @click=${this.toggleCollapsed}
                         aria-expanded=${!this.collapsed}>
                        <span class="nav-title">${this.pageTitle}</span>
                        <sl-icon name=${this.collapsed?"chevron-right":"chevron-down"}></sl-icon>
                    </div>
                    ${this.collapsed?v:d`
                        <ul class="nav-sections">
                            ${this.sections.map(t=>{var o;return d`
                                <li>
                                    <a href="#${t.id}"
                                       class=${t.id===this.activeId?"active":""}
                                       aria-current=${t.id===this.activeId?"true":v}
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
                                                       @click=${s=>{s.preventDefault(),this.navigateTo(r.id)}}>
                                                        ${r.label}
                                                    </a>
                                                </li>
                                            `)}
                                        </ul>
                                    `:v}
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
        `}},p.PpPageNav.styles=[Mh],Te([g({attribute:"page-title"})],p.PpPageNav.prototype,"pageTitle",2),Te([g({attribute:"sections-json"})],p.PpPageNav.prototype,"sectionsJson",2),Te([T()],p.PpPageNav.prototype,"sections",2),Te([T()],p.PpPageNav.prototype,"collapsed",2),Te([T()],p.PpPageNav.prototype,"navHidden",2),Te([T()],p.PpPageNav.prototype,"activeId",2),p.PpPageNav=Te([G("pp-page-nav")],p.PpPageNav);const xh=z`
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
    }
`;var Ih=Object.defineProperty,Ch=Object.getOwnPropertyDescriptor,Cr=(e,t,o,r)=>{for(var s=r>1?void 0:r?Ch(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(r?a(t,o,s):a(s))||s);return r&&s&&Ih(t,o,s),s};p.PpIconTitle=class extends H{constructor(){super(...arguments),this.icon="",this.heading="",this.level=1}render(){if(!this.heading)return v;const t=xl(`h${Math.min(Math.max(this.level,1),6)}`);return so`
            <pb33f-model-icon icon=${this.icon} size="huge"></pb33f-model-icon>
            <${t}>${this.heading}</${t}>
        `}},p.PpIconTitle.styles=[xh],Cr([g()],p.PpIconTitle.prototype,"icon",2),Cr([g()],p.PpIconTitle.prototype,"heading",2),Cr([g({type:Number})],p.PpIconTitle.prototype,"level",2),p.PpIconTitle=Cr([G("pp-icon-title")],p.PpIconTitle),Yr("static/shoelace");const Ah={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',braces:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/></svg>',envelope:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>',"question-diamond":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/> <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>',cookie:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/> <path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/></svg>',signpost:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M12.532 5l1.666 2-1.666 2H2V5z"/></svg>',"shield-lock":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/> <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/></svg>',"person-lock":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/></svg>',lock:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/></svg>',key:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/> <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>',fingerprint:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/> <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/> <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/> <path d="M3.902 4.222a5 5 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 4 4 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556m6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705M3.68 5.842a.5.5 0 0 1 .422.568q-.044.289-.044.59c0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.5 6.5 0 0 0 3.058 7q0-.375.054-.736a.5.5 0 0 1 .568-.422m8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.5 10.5 0 0 0 .584-2.678.5.5 0 0 1 .54-.456"/> <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865m-.89 1.257a.5.5 0 0 1 .04.706A5.48 5.48 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346m12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49"/></svg>',"x-lg":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>',"hdd-network":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"/></svg>',"box-arrow-up-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>',box:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>',"box-arrow-left":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/> <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>',"braces-asterisk":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z"/></svg>',"box-arrow-in-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/> <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>',link:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/></svg>',"telephone-outbound":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"/></svg>',geo:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/></svg>',"chat-left-quote":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/></svg>',"arrow-clockwise":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>',"gear-wide-connected":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/></svg>'};return rl("default",{resolver:e=>{const t=Ah[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),Object.defineProperty(p,Symbol.toStringTag,{value:"Module"}),p})({});
