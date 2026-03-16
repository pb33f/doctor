var PrintingPress=(function(h){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var di,hi;const Bt=globalThis,kr=Bt.ShadowRoot&&(Bt.ShadyCSS===void 0||Bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Cr=Symbol(),Io=new WeakMap;let Bo=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==Cr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(kr&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Io.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Io.set(r,e))}return e}toString(){return this.cssText}};const mi=t=>new Bo(typeof t=="string"?t:t+"",void 0,Cr),L=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new Bo(r,t,Cr)},gi=(t,e)=>{if(kr)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const o=document.createElement("style"),s=Bt.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},jo=kr?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return mi(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:vi,defineProperty:bi,getOwnPropertyDescriptor:yi,getOwnPropertyNames:wi,getOwnPropertySymbols:$i,getPrototypeOf:xi}=Object,ke=globalThis,Ho=ke.trustedTypes,_i=Ho?Ho.emptyScript:"",Ar=ke.reactiveElementPolyfillSupport,ft=(t,e)=>t,jt={toAttribute(t,e){switch(e){case Boolean:t=t?_i:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Pr=(t,e)=>!vi(t,e),Uo={attribute:!0,type:String,converter:jt,reflect:!1,useDefault:!1,hasChanged:Pr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ke.litPropertyMetadata??(ke.litPropertyMetadata=new WeakMap);let Qe=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Uo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&bi(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=yi(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:s,set(n){const a=s==null?void 0:s.call(this);i==null||i.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Uo}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const e=xi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const r=this.properties,o=[...wi(r),...$i(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(jo(s))}else e!==void 0&&r.push(jo(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(r=>r(this))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gi(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var i;const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const n=(((i=o.converter)==null?void 0:i.toAttribute)!==void 0?o.converter:jt).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,r){var i,n;const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const a=o.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:jt;this._$Em=s;const c=l.fromAttribute(r,a.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(e,r,o,s=!1,i){var n;if(e!==void 0){const a=this.constructor;if(s===!1&&(i=this[e]),o??(o=a.getPropertyOptions(e)),!((o.hasChanged??Pr)(i,r)||o.useDefault&&o.reflect&&i===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(a._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)}),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach(o=>{var s;return(s=o.hostUpdated)==null?void 0:s.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Qe.elementStyles=[],Qe.shadowRootOptions={mode:"open"},Qe[ft("elementProperties")]=new Map,Qe[ft("finalized")]=new Map,Ar==null||Ar({ReactiveElement:Qe}),(ke.reactiveElementVersions??(ke.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Vo=t=>t,Ht=mt.trustedTypes,Wo=Ht?Ht.createPolicy("lit-html",{createHTML:t=>t}):void 0,qo="$lit$",Ce=`lit$${Math.random().toFixed(9).slice(2)}$`,Jo="?"+Ce,ki=`<${Jo}>`,Ne=document,gt=()=>Ne.createComment(""),vt=t=>t===null||typeof t!="object"&&typeof t!="function",Sr=Array.isArray,Ci=t=>Sr(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Er=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yo=/-->/g,Go=/>/g,Fe=RegExp(`>|${Er}(?:([^\\s"'>=/]+)(${Er}*=${Er}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ko=/'/g,Xo=/"/g,Zo=/^(?:script|style|textarea|title)$/i,Ai=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),u=Ai(1),Ae=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Qo=new WeakMap,Ie=Ne.createTreeWalker(Ne,129);function es(t,e){if(!Sr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wo!==void 0?Wo.createHTML(e):e}const Pi=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=bt;for(let a=0;a<r;a++){const l=t[a];let c,g,v=-1,_=0;for(;_<l.length&&(n.lastIndex=_,g=n.exec(l),g!==null);)_=n.lastIndex,n===bt?g[1]==="!--"?n=Yo:g[1]!==void 0?n=Go:g[2]!==void 0?(Zo.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=Fe):g[3]!==void 0&&(n=Fe):n===Fe?g[0]===">"?(n=s??bt,v=-1):g[1]===void 0?v=-2:(v=n.lastIndex-g[2].length,c=g[1],n=g[3]===void 0?Fe:g[3]==='"'?Xo:Ko):n===Xo||n===Ko?n=Fe:n===Yo||n===Go?n=bt:(n=Fe,s=void 0);const w=n===Fe&&t[a+1].startsWith("/>")?" ":"";i+=n===bt?l+ki:v>=0?(o.push(c),l.slice(0,v)+qo+l.slice(v)+Ce+w):l+Ce+(v===-2?a:w)}return[es(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};let Or=class pi{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,n=0;const a=e.length-1,l=this.parts,[c,g]=Pi(e,r);if(this.el=pi.createElement(c,o),Ie.currentNode=this.el.content,r===2||r===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(s=Ie.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const v of s.getAttributeNames())if(v.endsWith(qo)){const _=g[n++],w=s.getAttribute(v).split(Ce),k=/([.?@])?(.*)/.exec(_);l.push({type:1,index:i,name:k[2],strings:w,ctor:k[1]==="."?Ei:k[1]==="?"?Oi:k[1]==="@"?Ti:Ut}),s.removeAttribute(v)}else v.startsWith(Ce)&&(l.push({type:6,index:i}),s.removeAttribute(v));if(Zo.test(s.tagName)){const v=s.textContent.split(Ce),_=v.length-1;if(_>0){s.textContent=Ht?Ht.emptyScript:"";for(let w=0;w<_;w++)s.append(v[w],gt()),Ie.nextNode(),l.push({type:2,index:++i});s.append(v[_],gt())}}}else if(s.nodeType===8)if(s.data===Jo)l.push({type:2,index:i});else{let v=-1;for(;(v=s.data.indexOf(Ce,v+1))!==-1;)l.push({type:7,index:i}),v+=Ce.length-1}i++}}static createElement(e,r){const o=Ne.createElement("template");return o.innerHTML=e,o}};function et(t,e,r=t,o){var n,a;if(e===Ae)return e;let s=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const i=vt(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=s:r._$Cl=s),s!==void 0&&(e=et(t,s._$AS(t,e.values),s,o)),e}let Si=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=((e==null?void 0:e.creationScope)??Ne).importNode(r,!0);Ie.currentNode=s;let i=Ie.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Tr(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new Li(i,this,e)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(i=Ie.nextNode(),n++)}return Ie.currentNode=Ne,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}},Tr=class fi{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=et(this,e,r),vt(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==Ae&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ci(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ne.createTextNode(e)),this._$AH=e}$(e){var i;const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Or.createElement(es(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const n=new Si(s,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=Qo.get(e.strings);return r===void 0&&Qo.set(e.strings,r=new Or(e)),r}k(e){Sr(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new fi(this.O(gt()),this.O(gt()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const s=Vo(e).nextSibling;Vo(e).remove(),e=s}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}},Ut=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=b}_$AI(e,r=this,o,s){const i=this.strings;let n=!1;if(i===void 0)e=et(this,e,r,0),n=!vt(e)||e!==this._$AH&&e!==Ae,n&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=et(this,a[o+l],r,l),c===Ae&&(c=this._$AH[l]),n||(n=!vt(c)||c!==this._$AH[l]),c===b?e=b:e!==b&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ei=class extends Ut{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},Oi=class extends Ut{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},Ti=class extends Ut{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=et(this,e,r,0)??b)===Ae)return;const o=this._$AH,s=e===b&&o!==b||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==b&&(o===b||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}};class Li{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){et(this,e)}}const Lr=mt.litHtmlPolyfillSupport;Lr==null||Lr(Or,Tr),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.3.2");const Ri=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let s=o._$litPart$;if(s===void 0){const i=(r==null?void 0:r.renderBefore)??null;o._$litPart$=s=new Tr(e.insertBefore(gt(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Be=globalThis;let I=class extends Qe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ri(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ae}};I._$litElement$=!0,I.finalized=!0,(di=Be.litElementHydrateSupport)==null||di.call(Be,{LitElement:I});const Rr=Be.litElementPolyfillSupport;Rr==null||Rr({LitElement:I}),(Be.litElementVersions??(Be.litElementVersions=[])).push("4.2.2");var Mi=L`
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
`,zi=L`
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
`,Mr="";function zr(t){Mr=t}function Di(t=""){if(!Mr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)zr(r.getAttribute("data-shoelace"));else{const o=e.find(i=>/shoelace(\.min)?\.js($|\?)/.test(i.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(i.src));let s="";o&&(s=o.getAttribute("src")),zr(s.split("/").slice(0,-1).join("/"))}}return Mr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Ni={name:"default",resolver:t=>Di(`assets/icons/${t}.svg`)},Fi=Ni,ts={caret:`
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
  `},Ii={name:"system",resolver:t=>t in ts?`data:image/svg+xml,${encodeURIComponent(ts[t])}`:""},Bi=Ii,Vt=[Fi,Bi],Wt=[];function ji(t){Wt.push(t)}function Hi(t){Wt=Wt.filter(e=>e!==t)}function rs(t){return Vt.find(e=>e.name===t)}function Ui(t,e){Vi(t),Vt.push({name:t,resolver:e.resolver,mutator:e.mutator,spriteSheet:e.spriteSheet}),Wt.forEach(r=>{r.library===t&&r.setIcon()})}function Vi(t){Vt=Vt.filter(e=>e.name!==t)}var Wi=L`
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
`,os=Object.defineProperty,qi=Object.defineProperties,Ji=Object.getOwnPropertyDescriptor,Yi=Object.getOwnPropertyDescriptors,ss=Object.getOwnPropertySymbols,Gi=Object.prototype.hasOwnProperty,Ki=Object.prototype.propertyIsEnumerable,Dr=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),Nr=t=>{throw TypeError(t)},is=(t,e,r)=>e in t?os(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,je=(t,e)=>{for(var r in e||(e={}))Gi.call(e,r)&&is(t,r,e[r]);if(ss)for(var r of ss(e))Ki.call(e,r)&&is(t,r,e[r]);return t},qt=(t,e)=>qi(t,Yi(e)),m=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ji(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&os(e,r,s),s},ns=(t,e,r)=>e.has(t)||Nr("Cannot "+r),Xi=(t,e,r)=>(ns(t,e,"read from private field"),e.get(t)),Zi=(t,e,r)=>e.has(t)?Nr("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Qi=(t,e,r,o)=>(ns(t,e,"write to private field"),e.set(t,r),r),en=function(t,e){this[0]=t,this[1]=e},tn=t=>{var e=t[Dr("asyncIterator")],r=!1,o,s={};return e==null?(e=t[Dr("iterator")](),o=i=>s[i]=n=>e[i](n)):(e=e.call(t),o=i=>s[i]=n=>{if(r){if(r=!1,i==="throw")throw n;return n}return r=!0,{done:!1,value:new en(new Promise(a=>{var l=e[i](n);l instanceof Object||Nr("Object expected"),a(l)}),1)}}),s[Dr("iterator")]=()=>s,o("next"),"throw"in e?o("throw"):s.throw=i=>{throw i},"return"in e&&o("return"),s};function G(t,e){const r=je({waitUntilFirstUpdate:!1},e);return(o,s)=>{const{update:i}=o,n=Array.isArray(t)?t:[t];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const g=a.get(c),v=this[c];g!==v&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[s](g,v)}}),i.call(this,a)}}}var se=L`
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
 */const q=t=>(e,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rn={attribute:!0,type:String,converter:jt,reflect:!1,hasChanged:Pr},on=(t=rn,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t,!0,a)}}throw Error("Unsupported decorator location: "+o)};function d(t){return(e,r)=>typeof r=="object"?on(t,e,r):((o,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function R(t){return d({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const sn=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function U(t,e){return(r,o,s)=>{const i=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(t))??null};return sn(r,o,{get(){return i(this)}})}}var Jt,J=class extends I{constructor(){super(),Zi(this,Jt,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,je({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let s=" (unknown version)",i=s;"version"in e&&e.version&&(s=" v"+e.version),"version"in o&&o.version&&(i=" v"+o.version),!(s&&i&&s===i)&&console.warn(`Attempted to register <${t}>${s}, but <${t}>${i} has already been registered.`)}attributeChangedCallback(t,e,r){Xi(this,Jt)||(this.constructor.elementProperties.forEach((o,s)=>{o.reflect&&this[s]!=null&&this.initialReflectedProperties.set(s,this[s])}),Qi(this,Jt,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Jt=new WeakMap,J.version="2.20.1",J.dependencies={},m([d()],J.prototype,"dir",2),m([d()],J.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nn=(t,e)=>(t==null?void 0:t._$litType$)!==void 0,an=t=>t.strings===void 0;var yt=Symbol(),Yt=Symbol(),Fr,Ir=new Map,ie=class extends J{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e!=null&&e.spriteSheet)return this.svg=u`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?yt:Yt}catch{return Yt}try{const s=document.createElement("div");s.innerHTML=await o.text();const i=s.firstElementChild;if(((r=i==null?void 0:i.tagName)==null?void 0:r.toLowerCase())!=="svg")return yt;Fr||(Fr=new DOMParser);const a=Fr.parseFromString(i.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):yt}catch{return yt}}connectedCallback(){super.connectedCallback(),ji(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Hi(this)}getIconSource(){const t=rs(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?rs(this.library):void 0;if(!e){this.svg=null;return}let s=Ir.get(e);if(s||(s=this.resolveIcon(e,o),Ir.set(e,s)),!this.initialRender)return;const i=await s;if(i===Yt&&Ir.delete(e),e===this.getIconSource().url){if(nn(i)){if(this.svg=i,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(i){case Yt:case yt:this.svg=null,this.emit("sl-error");break;default:this.svg=i.cloneNode(!0),(t=o==null?void 0:o.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};ie.styles=[se,Wi],m([R()],ie.prototype,"svg",2),m([d({reflect:!0})],ie.prototype,"name",2),m([d()],ie.prototype,"src",2),m([d()],ie.prototype,"label",2),m([d({reflect:!0})],ie.prototype,"library",2),m([G("label")],ie.prototype,"handleLabelChange",1),m([G(["name","src","library"])],ie.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Br={ATTRIBUTE:1,CHILD:2},jr=t=>(...e)=>({_$litDirective$:t,values:e});let Hr=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ve=jr(class extends Hr{constructor(t){var e;if(super(t),t.type!==Br.ATTRIBUTE||t.name!=="class"||((e=t.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var o,s;if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in e)e[i]&&!((o=this.nt)!=null&&o.has(i))&&this.st.add(i);return this.render(e)}const r=t.element.classList;for(const i of this.st)i in e||(r.remove(i),this.st.delete(i));for(const i in e){const n=!!e[i];n===this.st.has(i)||(s=this.nt)!=null&&s.has(i)||(n?(r.add(i),this.st.add(i)):(r.remove(i),this.st.delete(i)))}return Ae}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const as=Symbol.for(""),ln=t=>{if((t==null?void 0:t.r)===as)return t==null?void 0:t._$litStatic$},Gt=(t,...e)=>({_$litStatic$:e.reduce((r,o,s)=>r+(i=>{if(i._$litStatic$!==void 0)return i._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${i}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[s+1],t[0]),r:as}),ls=new Map,cn=t=>(e,...r)=>{const o=r.length;let s,i;const n=[],a=[];let l,c=0,g=!1;for(;c<o;){for(l=e[c];c<o&&(i=r[c],(s=ln(i))!==void 0);)l+=s+e[++c],g=!0;c!==o&&a.push(i),n.push(l),c++}if(c===o&&n.push(e[o]),g){const v=n.join("$$lit$$");(e=ls.get(v))===void 0&&(n.raw=n,ls.set(v,e=n)),r=a}return t(e,...r)},Kt=cn(u);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const F=t=>t??b;var K=class extends J{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Gt`a`:Gt`button`;return Kt`
      <${e}
        part="base"
        class=${ve({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${F(t?void 0:this.disabled)}
        type=${F(t?void 0:"button")}
        href=${F(t?this.href:void 0)}
        target=${F(t?this.target:void 0)}
        download=${F(t?this.download:void 0)}
        rel=${F(t&&this.target?"noreferrer noopener":void 0)}
        role=${F(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${F(this.name)}
          library=${F(this.library)}
          src=${F(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};K.styles=[se,zi],K.dependencies={"sl-icon":ie},m([U(".icon-button")],K.prototype,"button",2),m([R()],K.prototype,"hasFocus",2),m([d()],K.prototype,"name",2),m([d()],K.prototype,"library",2),m([d()],K.prototype,"src",2),m([d()],K.prototype,"href",2),m([d()],K.prototype,"target",2),m([d()],K.prototype,"download",2),m([d()],K.prototype,"label",2),m([d({type:Boolean,reflect:!0})],K.prototype,"disabled",2);const Ur=new Set,tt=new Map;let He,Vr="ltr",Wr="en";const cs=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(cs){const t=new MutationObserver(hs);Vr=document.documentElement.dir||"ltr",Wr=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function ds(...t){t.map(e=>{const r=e.$code.toLowerCase();tt.has(r)?tt.set(r,Object.assign(Object.assign({},tt.get(r)),e)):tt.set(r,e),He||(He=e)}),hs()}function hs(){cs&&(Vr=document.documentElement.dir||"ltr",Wr=document.documentElement.lang||navigator.language),[...Ur.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let dn=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Ur.add(this.host)}hostDisconnected(){Ur.delete(this.host)}dir(){return`${this.host.dir||Vr}`.toLowerCase()}lang(){return`${this.host.lang||Wr}`.toLowerCase()}getTranslationData(e){var r,o;const s=new Intl.Locale(e.replace(/_/g,"-")),i=s==null?void 0:s.language.toLowerCase(),n=(o=(r=s==null?void 0:s.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=tt.get(`${i}-${n}`),l=tt.get(i);return{locale:s,language:i,region:n,primary:a,secondary:l}}exists(e,r){var o;const{primary:s,secondary:i}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(s&&s[e]||i&&i[e]||r.includeFallback&&He&&He[e])}term(e,...r){const{primary:o,secondary:s}=this.getTranslationData(this.lang());let i;if(o&&o[e])i=o[e];else if(s&&s[e])i=s[e];else if(He&&He[e])i=He[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i=="function"?i(...r):i}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var us={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};ds(us);var hn=us,be=class extends dn{};ds(hn);var Ue=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return u`
      <span
        part="base"
        class=${ve({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?u`
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
    `}};Ue.styles=[se,Mi],Ue.dependencies={"sl-icon-button":K},m([d({reflect:!0})],Ue.prototype,"variant",2),m([d({reflect:!0})],Ue.prototype,"size",2),m([d({type:Boolean,reflect:!0})],Ue.prototype,"pill",2),m([d({type:Boolean})],Ue.prototype,"removable",2),Ue.define("sl-tag"),K.define("sl-icon-button");var un=L`
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
`,pn=L`
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
`;const Pe=Math.min,Q=Math.max,Xt=Math.round,Zt=Math.floor,pe=t=>({x:t,y:t}),fn={left:"right",right:"left",bottom:"top",top:"bottom"};function qr(t,e,r){return Q(t,Pe(e,r))}function rt(t,e){return typeof t=="function"?t(e):t}function Se(t){return t.split("-")[0]}function ot(t){return t.split("-")[1]}function ps(t){return t==="x"?"y":"x"}function Jr(t){return t==="y"?"height":"width"}function ye(t){const e=t[0];return e==="t"||e==="b"?"y":"x"}function Yr(t){return ps(ye(t))}function mn(t,e,r){r===void 0&&(r=!1);const o=ot(t),s=Yr(t),i=Jr(s);let n=s==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[i]>e.floating[i]&&(n=Qt(n)),[n,Qt(n)]}function gn(t){const e=Qt(t);return[Gr(t),e,Gr(e)]}function Gr(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}const fs=["left","right"],ms=["right","left"],vn=["top","bottom"],bn=["bottom","top"];function yn(t,e,r){switch(t){case"top":case"bottom":return r?e?ms:fs:e?fs:ms;case"left":case"right":return e?vn:bn;default:return[]}}function wn(t,e,r,o){const s=ot(t);let i=yn(Se(t),r==="start",o);return s&&(i=i.map(n=>n+"-"+s),e&&(i=i.concat(i.map(Gr)))),i}function Qt(t){const e=Se(t);return fn[e]+t.slice(e.length)}function $n(t){return{top:0,right:0,bottom:0,left:0,...t}}function gs(t){return typeof t!="number"?$n(t):{top:t,right:t,bottom:t,left:t}}function er(t){const{x:e,y:r,width:o,height:s}=t;return{width:o,height:s,top:r,left:e,right:e+o,bottom:r+s,x:e,y:r}}function vs(t,e,r){let{reference:o,floating:s}=t;const i=ye(e),n=Yr(e),a=Jr(n),l=Se(e),c=i==="y",g=o.x+o.width/2-s.width/2,v=o.y+o.height/2-s.height/2,_=o[a]/2-s[a]/2;let w;switch(l){case"top":w={x:g,y:o.y-s.height};break;case"bottom":w={x:g,y:o.y+o.height};break;case"right":w={x:o.x+o.width,y:v};break;case"left":w={x:o.x-s.width,y:v};break;default:w={x:o.x,y:o.y}}switch(ot(e)){case"start":w[n]-=_*(r&&c?-1:1);break;case"end":w[n]+=_*(r&&c?-1:1);break}return w}async function xn(t,e){var r;e===void 0&&(e={});const{x:o,y:s,platform:i,rects:n,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:g="viewport",elementContext:v="floating",altBoundary:_=!1,padding:w=0}=rt(e,t),k=gs(w),S=a[_?v==="floating"?"reference":"floating":v],E=er(await i.getClippingRect({element:(r=await(i.isElement==null?void 0:i.isElement(S)))==null||r?S:S.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(a.floating)),boundary:c,rootBoundary:g,strategy:l})),f=v==="floating"?{x:o,y:s,width:n.floating.width,height:n.floating.height}:n.reference,p=await(i.getOffsetParent==null?void 0:i.getOffsetParent(a.floating)),y=await(i.isElement==null?void 0:i.isElement(p))?await(i.getScale==null?void 0:i.getScale(p))||{x:1,y:1}:{x:1,y:1},x=er(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:f,offsetParent:p,strategy:l}):f);return{top:(E.top-x.top+k.top)/y.y,bottom:(x.bottom-E.bottom+k.bottom)/y.y,left:(E.left-x.left+k.left)/y.x,right:(x.right-E.right+k.right)/y.x}}const _n=50,kn=async(t,e,r)=>{const{placement:o="bottom",strategy:s="absolute",middleware:i=[],platform:n}=r,a=n.detectOverflow?n:{...n,detectOverflow:xn},l=await(n.isRTL==null?void 0:n.isRTL(e));let c=await n.getElementRects({reference:t,floating:e,strategy:s}),{x:g,y:v}=vs(c,o,l),_=o,w=0;const k={};for(let P=0;P<i.length;P++){const S=i[P];if(!S)continue;const{name:E,fn:f}=S,{x:p,y,data:x,reset:$}=await f({x:g,y:v,initialPlacement:o,placement:_,strategy:s,middlewareData:k,rects:c,platform:a,elements:{reference:t,floating:e}});g=p??g,v=y??v,k[E]={...k[E],...x},$&&w<_n&&(w++,typeof $=="object"&&($.placement&&(_=$.placement),$.rects&&(c=$.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:s}):$.rects),{x:g,y:v}=vs(c,_,l)),P=-1)}return{x:g,y:v,placement:_,strategy:s,middlewareData:k}},Cn=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:s,rects:i,platform:n,elements:a,middlewareData:l}=e,{element:c,padding:g=0}=rt(t,e)||{};if(c==null)return{};const v=gs(g),_={x:r,y:o},w=Yr(s),k=Jr(w),P=await n.getDimensions(c),S=w==="y",E=S?"top":"left",f=S?"bottom":"right",p=S?"clientHeight":"clientWidth",y=i.reference[k]+i.reference[w]-_[w]-i.floating[k],x=_[w]-i.reference[w],$=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let C=$?$[p]:0;(!C||!await(n.isElement==null?void 0:n.isElement($)))&&(C=a.floating[p]||i.floating[k]);const O=y/2-x/2,A=C/2-P[k]/2-1,T=Pe(v[E],A),N=Pe(v[f],A),j=T,de=C-P[k]-N,V=C/2-P[k]/2+O,_e=qr(j,V,de),he=!l.arrow&&ot(s)!=null&&V!==_e&&i.reference[k]/2-(V<j?T:N)-P[k]/2<0,Z=he?V<j?V-j:V-de:0;return{[w]:_[w]+Z,data:{[w]:_e,centerOffset:V-_e-Z,...he&&{alignmentOffset:Z}},reset:he}}}),An=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:s,middlewareData:i,rects:n,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:g=!0,crossAxis:v=!0,fallbackPlacements:_,fallbackStrategy:w="bestFit",fallbackAxisSideDirection:k="none",flipAlignment:P=!0,...S}=rt(t,e);if((r=i.arrow)!=null&&r.alignmentOffset)return{};const E=Se(s),f=ye(a),p=Se(a)===a,y=await(l.isRTL==null?void 0:l.isRTL(c.floating)),x=_||(p||!P?[Qt(a)]:gn(a)),$=k!=="none";!_&&$&&x.push(...wn(a,P,k,y));const C=[a,...x],O=await l.detectOverflow(e,S),A=[];let T=((o=i.flip)==null?void 0:o.overflows)||[];if(g&&A.push(O[E]),v){const V=mn(s,n,y);A.push(O[V[0]],O[V[1]])}if(T=[...T,{placement:s,overflows:A}],!A.every(V=>V<=0)){var N,j;const V=(((N=i.flip)==null?void 0:N.index)||0)+1,_e=C[V];if(_e&&(!(v==="alignment"?f!==ye(_e):!1)||T.every(D=>ye(D.placement)===f?D.overflows[0]>0:!0)))return{data:{index:V,overflows:T},reset:{placement:_e}};let he=(j=T.filter(Z=>Z.overflows[0]<=0).sort((Z,D)=>Z.overflows[1]-D.overflows[1])[0])==null?void 0:j.placement;if(!he)switch(w){case"bestFit":{var de;const Z=(de=T.filter(D=>{if($){const H=ye(D.placement);return H===f||H==="y"}return!0}).map(D=>[D.placement,D.overflows.filter(H=>H>0).reduce((H,ze)=>H+ze,0)]).sort((D,H)=>D[1]-H[1])[0])==null?void 0:de[0];Z&&(he=Z);break}case"initialPlacement":he=a;break}if(s!==he)return{reset:{placement:he}}}return{}}}},Pn=new Set(["left","top"]);async function Sn(t,e){const{placement:r,platform:o,elements:s}=t,i=await(o.isRTL==null?void 0:o.isRTL(s.floating)),n=Se(r),a=ot(r),l=ye(r)==="y",c=Pn.has(n)?-1:1,g=i&&l?-1:1,v=rt(e,t);let{mainAxis:_,crossAxis:w,alignmentAxis:k}=typeof v=="number"?{mainAxis:v,crossAxis:0,alignmentAxis:null}:{mainAxis:v.mainAxis||0,crossAxis:v.crossAxis||0,alignmentAxis:v.alignmentAxis};return a&&typeof k=="number"&&(w=a==="end"?k*-1:k),l?{x:w*g,y:_*c}:{x:_*c,y:w*g}}const En=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:s,y:i,placement:n,middlewareData:a}=e,l=await Sn(e,t);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:s+l.x,y:i+l.y,data:{...l,placement:n}}}}},On=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:s,platform:i}=e,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:E=>{let{x:f,y:p}=E;return{x:f,y:p}}},...c}=rt(t,e),g={x:r,y:o},v=await i.detectOverflow(e,c),_=ye(Se(s)),w=ps(_);let k=g[w],P=g[_];if(n){const E=w==="y"?"top":"left",f=w==="y"?"bottom":"right",p=k+v[E],y=k-v[f];k=qr(p,k,y)}if(a){const E=_==="y"?"top":"left",f=_==="y"?"bottom":"right",p=P+v[E],y=P-v[f];P=qr(p,P,y)}const S=l.fn({...e,[w]:k,[_]:P});return{...S,data:{x:S.x-r,y:S.y-o,enabled:{[w]:n,[_]:a}}}}}},Tn=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:s,rects:i,platform:n,elements:a}=e,{apply:l=()=>{},...c}=rt(t,e),g=await n.detectOverflow(e,c),v=Se(s),_=ot(s),w=ye(s)==="y",{width:k,height:P}=i.floating;let S,E;v==="top"||v==="bottom"?(S=v,E=_===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):(E=v,S=_==="end"?"top":"bottom");const f=P-g.top-g.bottom,p=k-g.left-g.right,y=Pe(P-g[S],f),x=Pe(k-g[E],p),$=!e.middlewareData.shift;let C=y,O=x;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(O=p),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(C=f),$&&!_){const T=Q(g.left,0),N=Q(g.right,0),j=Q(g.top,0),de=Q(g.bottom,0);w?O=k-2*(T!==0||N!==0?T+N:Q(g.left,g.right)):C=P-2*(j!==0||de!==0?j+de:Q(g.top,g.bottom))}await l({...e,availableWidth:O,availableHeight:C});const A=await n.getDimensions(a.floating);return k!==A.width||P!==A.height?{reset:{rects:!0}}:{}}}};function tr(){return typeof window<"u"}function st(t){return bs(t)?(t.nodeName||"").toLowerCase():"#document"}function ee(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function fe(t){var e;return(e=(bs(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function bs(t){return tr()?t instanceof Node||t instanceof ee(t).Node:!1}function ne(t){return tr()?t instanceof Element||t instanceof ee(t).Element:!1}function we(t){return tr()?t instanceof HTMLElement||t instanceof ee(t).HTMLElement:!1}function ys(t){return!tr()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof ee(t).ShadowRoot}function wt(t){const{overflow:e,overflowX:r,overflowY:o,display:s}=ae(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&s!=="inline"&&s!=="contents"}function Ln(t){return/^(table|td|th)$/.test(st(t))}function rr(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}const Rn=/transform|translate|scale|rotate|perspective|filter/,Mn=/paint|layout|strict|content/,Ve=t=>!!t&&t!=="none";let Kr;function or(t){const e=ne(t)?ae(t):t;return Ve(e.transform)||Ve(e.translate)||Ve(e.scale)||Ve(e.rotate)||Ve(e.perspective)||!Xr()&&(Ve(e.backdropFilter)||Ve(e.filter))||Rn.test(e.willChange||"")||Mn.test(e.contain||"")}function zn(t){let e=Ee(t);for(;we(e)&&!it(e);){if(or(e))return e;if(rr(e))return null;e=Ee(e)}return null}function Xr(){return Kr==null&&(Kr=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Kr}function it(t){return/^(html|body|#document)$/.test(st(t))}function ae(t){return ee(t).getComputedStyle(t)}function sr(t){return ne(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function Ee(t){if(st(t)==="html")return t;const e=t.assignedSlot||t.parentNode||ys(t)&&t.host||fe(t);return ys(e)?e.host:e}function ws(t){const e=Ee(t);return it(e)?t.ownerDocument?t.ownerDocument.body:t.body:we(e)&&wt(e)?e:ws(e)}function $t(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const s=ws(t),i=s===((o=t.ownerDocument)==null?void 0:o.body),n=ee(s);if(i){const a=Zr(n);return e.concat(n,n.visualViewport||[],wt(s)?s:[],a&&r?$t(a):[])}else return e.concat(s,$t(s,[],r))}function Zr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function $s(t){const e=ae(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const s=we(t),i=s?t.offsetWidth:r,n=s?t.offsetHeight:o,a=Xt(r)!==i||Xt(o)!==n;return a&&(r=i,o=n),{width:r,height:o,$:a}}function Qr(t){return ne(t)?t:t.contextElement}function nt(t){const e=Qr(t);if(!we(e))return pe(1);const r=e.getBoundingClientRect(),{width:o,height:s,$:i}=$s(e);let n=(i?Xt(r.width):r.width)/o,a=(i?Xt(r.height):r.height)/s;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const Dn=pe(0);function xs(t){const e=ee(t);return!Xr()||!e.visualViewport?Dn:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Nn(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==ee(t)?!1:e}function We(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const s=t.getBoundingClientRect(),i=Qr(t);let n=pe(1);e&&(o?ne(o)&&(n=nt(o)):n=nt(t));const a=Nn(i,r,o)?xs(i):pe(0);let l=(s.left+a.x)/n.x,c=(s.top+a.y)/n.y,g=s.width/n.x,v=s.height/n.y;if(i){const _=ee(i),w=o&&ne(o)?ee(o):o;let k=_,P=Zr(k);for(;P&&o&&w!==k;){const S=nt(P),E=P.getBoundingClientRect(),f=ae(P),p=E.left+(P.clientLeft+parseFloat(f.paddingLeft))*S.x,y=E.top+(P.clientTop+parseFloat(f.paddingTop))*S.y;l*=S.x,c*=S.y,g*=S.x,v*=S.y,l+=p,c+=y,k=ee(P),P=Zr(k)}}return er({width:g,height:v,x:l,y:c})}function ir(t,e){const r=sr(t).scrollLeft;return e?e.left+r:We(fe(t)).left+r}function _s(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-ir(t,r),s=r.top+e.scrollTop;return{x:o,y:s}}function Fn(t){let{elements:e,rect:r,offsetParent:o,strategy:s}=t;const i=s==="fixed",n=fe(o),a=e?rr(e.floating):!1;if(o===n||a&&i)return r;let l={scrollLeft:0,scrollTop:0},c=pe(1);const g=pe(0),v=we(o);if((v||!v&&!i)&&((st(o)!=="body"||wt(n))&&(l=sr(o)),v)){const w=We(o);c=nt(o),g.x=w.x+o.clientLeft,g.y=w.y+o.clientTop}const _=n&&!v&&!i?_s(n,l):pe(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+g.x+_.x,y:r.y*c.y-l.scrollTop*c.y+g.y+_.y}}function In(t){return Array.from(t.getClientRects())}function Bn(t){const e=fe(t),r=sr(t),o=t.ownerDocument.body,s=Q(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),i=Q(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+ir(t);const a=-r.scrollTop;return ae(o).direction==="rtl"&&(n+=Q(e.clientWidth,o.clientWidth)-s),{width:s,height:i,x:n,y:a}}const ks=25;function jn(t,e){const r=ee(t),o=fe(t),s=r.visualViewport;let i=o.clientWidth,n=o.clientHeight,a=0,l=0;if(s){i=s.width,n=s.height;const g=Xr();(!g||g&&e==="fixed")&&(a=s.offsetLeft,l=s.offsetTop)}const c=ir(o);if(c<=0){const g=o.ownerDocument,v=g.body,_=getComputedStyle(v),w=g.compatMode==="CSS1Compat"&&parseFloat(_.marginLeft)+parseFloat(_.marginRight)||0,k=Math.abs(o.clientWidth-v.clientWidth-w);k<=ks&&(i-=k)}else c<=ks&&(i+=c);return{width:i,height:n,x:a,y:l}}function Hn(t,e){const r=We(t,!0,e==="fixed"),o=r.top+t.clientTop,s=r.left+t.clientLeft,i=we(t)?nt(t):pe(1),n=t.clientWidth*i.x,a=t.clientHeight*i.y,l=s*i.x,c=o*i.y;return{width:n,height:a,x:l,y:c}}function Cs(t,e,r){let o;if(e==="viewport")o=jn(t,r);else if(e==="document")o=Bn(fe(t));else if(ne(e))o=Hn(e,r);else{const s=xs(t);o={x:e.x-s.x,y:e.y-s.y,width:e.width,height:e.height}}return er(o)}function As(t,e){const r=Ee(t);return r===e||!ne(r)||it(r)?!1:ae(r).position==="fixed"||As(r,e)}function Un(t,e){const r=e.get(t);if(r)return r;let o=$t(t,[],!1).filter(a=>ne(a)&&st(a)!=="body"),s=null;const i=ae(t).position==="fixed";let n=i?Ee(t):t;for(;ne(n)&&!it(n);){const a=ae(n),l=or(n);!l&&a.position==="fixed"&&(s=null),(i?!l&&!s:!l&&a.position==="static"&&!!s&&(s.position==="absolute"||s.position==="fixed")||wt(n)&&!l&&As(t,n))?o=o.filter(g=>g!==n):s=a,n=Ee(n)}return e.set(t,o),o}function Vn(t){let{element:e,boundary:r,rootBoundary:o,strategy:s}=t;const n=[...r==="clippingAncestors"?rr(e)?[]:Un(e,this._c):[].concat(r),o],a=Cs(e,n[0],s);let l=a.top,c=a.right,g=a.bottom,v=a.left;for(let _=1;_<n.length;_++){const w=Cs(e,n[_],s);l=Q(w.top,l),c=Pe(w.right,c),g=Pe(w.bottom,g),v=Q(w.left,v)}return{width:c-v,height:g-l,x:v,y:l}}function Wn(t){const{width:e,height:r}=$s(t);return{width:e,height:r}}function qn(t,e,r){const o=we(e),s=fe(e),i=r==="fixed",n=We(t,!0,i,e);let a={scrollLeft:0,scrollTop:0};const l=pe(0);function c(){l.x=ir(s)}if(o||!o&&!i)if((st(e)!=="body"||wt(s))&&(a=sr(e)),o){const w=We(e,!0,i,e);l.x=w.x+e.clientLeft,l.y=w.y+e.clientTop}else s&&c();i&&!o&&s&&c();const g=s&&!o&&!i?_s(s,a):pe(0),v=n.left+a.scrollLeft-l.x-g.x,_=n.top+a.scrollTop-l.y-g.y;return{x:v,y:_,width:n.width,height:n.height}}function eo(t){return ae(t).position==="static"}function Ps(t,e){if(!we(t)||ae(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return fe(t)===r&&(r=r.ownerDocument.body),r}function Ss(t,e){const r=ee(t);if(rr(t))return r;if(!we(t)){let s=Ee(t);for(;s&&!it(s);){if(ne(s)&&!eo(s))return s;s=Ee(s)}return r}let o=Ps(t,e);for(;o&&Ln(o)&&eo(o);)o=Ps(o,e);return o&&it(o)&&eo(o)&&!or(o)?r:o||zn(t)||r}const Jn=async function(t){const e=this.getOffsetParent||Ss,r=this.getDimensions,o=await r(t.floating);return{reference:qn(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function Yn(t){return ae(t).direction==="rtl"}const nr={convertOffsetParentRelativeRectToViewportRelativeRect:Fn,getDocumentElement:fe,getClippingRect:Vn,getOffsetParent:Ss,getElementRects:Jn,getClientRects:In,getDimensions:Wn,getScale:nt,isElement:ne,isRTL:Yn};function Es(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Gn(t,e){let r=null,o;const s=fe(t);function i(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),i();const c=t.getBoundingClientRect(),{left:g,top:v,width:_,height:w}=c;if(a||e(),!_||!w)return;const k=Zt(v),P=Zt(s.clientWidth-(g+_)),S=Zt(s.clientHeight-(v+w)),E=Zt(g),p={rootMargin:-k+"px "+-P+"px "+-S+"px "+-E+"px",threshold:Q(0,Pe(1,l))||1};let y=!0;function x($){const C=$[0].intersectionRatio;if(C!==l){if(!y)return n();C?n(!1,C):o=setTimeout(()=>{n(!1,1e-7)},1e3)}C===1&&!Es(c,t.getBoundingClientRect())&&n(),y=!1}try{r=new IntersectionObserver(x,{...p,root:s.ownerDocument})}catch{r=new IntersectionObserver(x,p)}r.observe(t)}return n(!0),i}function Kn(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:s=!0,ancestorResize:i=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=Qr(t),g=s||i?[...c?$t(c):[],...e?$t(e):[]]:[];g.forEach(E=>{s&&E.addEventListener("scroll",r,{passive:!0}),i&&E.addEventListener("resize",r)});const v=c&&a?Gn(c,r):null;let _=-1,w=null;n&&(w=new ResizeObserver(E=>{let[f]=E;f&&f.target===c&&w&&e&&(w.unobserve(e),cancelAnimationFrame(_),_=requestAnimationFrame(()=>{var p;(p=w)==null||p.observe(e)})),r()}),c&&!l&&w.observe(c),e&&w.observe(e));let k,P=l?We(t):null;l&&S();function S(){const E=We(t);P&&!Es(P,E)&&r(),P=E,k=requestAnimationFrame(S)}return r(),()=>{var E;g.forEach(f=>{s&&f.removeEventListener("scroll",r),i&&f.removeEventListener("resize",r)}),v==null||v(),(E=w)==null||E.disconnect(),w=null,l&&cancelAnimationFrame(k)}}const Xn=En,Zn=On,Qn=An,Os=Tn,ea=Cn,ta=(t,e,r)=>{const o=new Map,s={platform:nr,...r},i={...s.platform,_c:o};return kn(t,e,{...s,platform:i})};function ra(t){return oa(t)}function to(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function oa(t){for(let e=t;e;e=to(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=to(t);e;e=to(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||or(r)||e.tagName==="BODY"))return e}return null}function sa(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var z=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,s=0,i=0,n=0,a=0,l=0,c=0,g=0;r?t.top<e.top?(o=t.left,s=t.bottom,i=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,g=e.top):(o=e.left,s=e.bottom,i=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,g=t.top):t.left<e.left?(o=t.right,s=t.top,i=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,g=e.bottom):(o=e.right,s=e.top,i=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,g=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${s}px`),this.style.setProperty("--hover-bridge-top-right-x",`${i}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${g}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||sa(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Kn(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Xn({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Os({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",s=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=s?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Qn({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Zn({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Os({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(ea({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>nr.getOffsetParent(r,ra):nr.getOffsetParent;ta(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:qt(je({},nr),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:s,placement:i})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=s.arrow.x,c=s.arrow.y;let g="",v="",_="",w="";if(this.arrowPlacement==="start"){const k=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";g=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",v=n?k:"",w=n?"":k}else if(this.arrowPlacement==="end"){const k=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";v=n?"":k,w=n?k:"",_=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(w=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",g=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(w=typeof l=="number"?`${l}px`:"",g=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:g,right:v,bottom:_,left:w,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return u`
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
        ${this.arrow?u`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};z.styles=[se,pn],m([U(".popup")],z.prototype,"popup",2),m([U(".popup__arrow")],z.prototype,"arrowEl",2),m([d()],z.prototype,"anchor",2),m([d({type:Boolean,reflect:!0})],z.prototype,"active",2),m([d({reflect:!0})],z.prototype,"placement",2),m([d({reflect:!0})],z.prototype,"strategy",2),m([d({type:Number})],z.prototype,"distance",2),m([d({type:Number})],z.prototype,"skidding",2),m([d({type:Boolean})],z.prototype,"arrow",2),m([d({attribute:"arrow-placement"})],z.prototype,"arrowPlacement",2),m([d({attribute:"arrow-padding",type:Number})],z.prototype,"arrowPadding",2),m([d({type:Boolean})],z.prototype,"flip",2),m([d({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],z.prototype,"flipFallbackPlacements",2),m([d({attribute:"flip-fallback-strategy"})],z.prototype,"flipFallbackStrategy",2),m([d({type:Object})],z.prototype,"flipBoundary",2),m([d({attribute:"flip-padding",type:Number})],z.prototype,"flipPadding",2),m([d({type:Boolean})],z.prototype,"shift",2),m([d({type:Object})],z.prototype,"shiftBoundary",2),m([d({attribute:"shift-padding",type:Number})],z.prototype,"shiftPadding",2),m([d({attribute:"auto-size"})],z.prototype,"autoSize",2),m([d()],z.prototype,"sync",2),m([d({type:Object})],z.prototype,"autoSizeBoundary",2),m([d({attribute:"auto-size-padding",type:Number})],z.prototype,"autoSizePadding",2),m([d({attribute:"hover-bridge",type:Boolean})],z.prototype,"hoverBridge",2);var Ts=new Map,ia=new WeakMap;function na(t){return t??{keyframes:[],options:{duration:0}}}function Ls(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function X(t,e){Ts.set(t,na(e))}function $e(t,e,r){const o=ia.get(t);if(o!=null&&o[e])return Ls(o[e],r.dir);const s=Ts.get(e);return s?Ls(s,r.dir):{keyframes:[],options:{duration:0}}}function at(t,e){return new Promise(r=>{function o(s){s.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function xe(t,e,r){return new Promise(o=>{if((r==null?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");const s=t.animate(e,qt(je({},r),{duration:aa()?0:r.duration}));s.addEventListener("cancel",o,{once:!0}),s.addEventListener("finish",o,{once:!0})})}function Rs(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function aa(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Oe(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var W=class extends J{constructor(){super(),this.localize=new be(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=Rs(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=Rs(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Oe(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=$e(this,"tooltip.show",{dir:this.localize.dir()});await xe(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Oe(this.body);const{keyframes:r,options:o}=$e(this,"tooltip.hide",{dir:this.localize.dir()});await xe(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,at(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,at(this,"sl-after-hide")}render(){return u`
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
    `}};W.styles=[se,un],W.dependencies={"sl-popup":z},m([U("slot:not([name])")],W.prototype,"defaultSlot",2),m([U(".tooltip__body")],W.prototype,"body",2),m([U("sl-popup")],W.prototype,"popup",2),m([d()],W.prototype,"content",2),m([d()],W.prototype,"placement",2),m([d({type:Boolean,reflect:!0})],W.prototype,"disabled",2),m([d({type:Number})],W.prototype,"distance",2),m([d({type:Boolean,reflect:!0})],W.prototype,"open",2),m([d({type:Number})],W.prototype,"skidding",2),m([d()],W.prototype,"trigger",2),m([d({type:Boolean})],W.prototype,"hoist",2),m([G("open",{waitUntilFirstUpdate:!0})],W.prototype,"handleOpenChange",1),m([G(["content","distance","hoist","placement","skidding"])],W.prototype,"handleOptionsChange",1),m([G("disabled")],W.prototype,"handleDisabledChange",1),X("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),X("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),W.define("sl-tooltip"),ie.define("sl-icon");var la=L`
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
`;function ca(t,e){function r(s){const i=t.getBoundingClientRect(),n=t.ownerDocument.defaultView,a=i.left+n.scrollX,l=i.top+n.scrollY,c=s.pageX-a,g=s.pageY-l;e!=null&&e.onMove&&e.onMove(c,g)}function o(){document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o),e!=null&&e.onStop&&e.onStop()}document.addEventListener("pointermove",r,{passive:!0}),document.addEventListener("pointerup",o),(e==null?void 0:e.initialEvent)instanceof PointerEvent&&r(e.initialEvent)}function Ms(t,e,r){const o=s=>Object.is(s,-0)?0:s;return t<e?o(e):t>r?o(r):o(t)}var zs=()=>null,te=class extends J{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new be(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=zs,this.snapThreshold=12}toSnapFunction(t){const e=t.split(" ");return({pos:r,size:o,snapThreshold:s,isRtl:i,vertical:n})=>{let a=r,l=Number.POSITIVE_INFINITY;return e.forEach(c=>{let g;if(c.startsWith("repeat(")){const _=t.substring(7,t.length-1),w=_.endsWith("%"),k=Number.parseFloat(_),P=w?o*(k/100):k;g=Math.round((i&&!n?o-r:r)/P)*P}else c.endsWith("%")?g=o*(Number.parseFloat(c)/100):g=Number.parseFloat(c);i&&!n&&(g=o-g);const v=Math.abs(r-g);v<=s&&v<l&&(a=g,l=v)}),a}}set snap(t){this.snapValue=t??"",t?this.snapFunction=typeof t=="string"?this.toSnapFunction(t):t:this.snapFunction=zs}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(t=>this.handleResize(t)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this)}detectSize(){const{width:t,height:e}=this.getBoundingClientRect();this.size=this.vertical?e:t}percentageToPixels(t){return this.size*(t/100)}pixelsToPercentage(t){return t/this.size*100}handleDrag(t){const e=this.localize.dir()==="rtl";this.disabled||(t.cancelable&&t.preventDefault(),ca(this,{onMove:(r,o)=>{var s;let i=this.vertical?o:r;this.primary==="end"&&(i=this.size-i),i=(s=this.snapFunction({pos:i,size:this.size,snapThreshold:this.snapThreshold,isRtl:e,vertical:this.vertical}))!=null?s:i,this.position=Ms(this.pixelsToPercentage(i),0,100)},initialEvent:t}))}handleKeyDown(t){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(t.key)){let e=this.position;const r=(t.shiftKey?10:1)*(this.primary==="end"?-1:1);if(t.preventDefault(),(t.key==="ArrowLeft"&&!this.vertical||t.key==="ArrowUp"&&this.vertical)&&(e-=r),(t.key==="ArrowRight"&&!this.vertical||t.key==="ArrowDown"&&this.vertical)&&(e+=r),t.key==="Home"&&(e=this.primary==="end"?100:0),t.key==="End"&&(e=this.primary==="end"?0:100),t.key==="Enter")if(this.isCollapsed)e=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const o=this.position;e=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=o})}this.position=Ms(e,0,100)}}handleResize(t){const{width:e,height:r}=t[0].contentRect;this.size=this.vertical?r:e,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const t=this.vertical?"gridTemplateRows":"gridTemplateColumns",e=this.vertical?"gridTemplateColumns":"gridTemplateRows",r=this.localize.dir()==="rtl",o=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,s="auto";return this.primary==="end"?r&&!this.vertical?this.style[t]=`${o} var(--divider-width) ${s}`:this.style[t]=`${s} var(--divider-width) ${o}`:r&&!this.vertical?this.style[t]=`${s} var(--divider-width) ${o}`:this.style[t]=`${o} var(--divider-width) ${s}`,this.style[e]="",u`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${F(this.disabled?void 0:"0")}
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
    `}};te.styles=[se,la],m([U(".divider")],te.prototype,"divider",2),m([d({type:Number,reflect:!0})],te.prototype,"position",2),m([d({attribute:"position-in-pixels",type:Number})],te.prototype,"positionInPixels",2),m([d({type:Boolean,reflect:!0})],te.prototype,"vertical",2),m([d({type:Boolean,reflect:!0})],te.prototype,"disabled",2),m([d()],te.prototype,"primary",2),m([d({reflect:!0})],te.prototype,"snap",1),m([d({type:Number,attribute:"snap-threshold"})],te.prototype,"snapThreshold",2),m([G("position")],te.prototype,"handlePositionChange",1),m([G("positionInPixels")],te.prototype,"handlePositionInPixelsChange",1),m([G("vertical")],te.prototype,"handleVerticalChange",1),te.define("sl-split-panel");var da=L`
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
`;function*ro(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*tn(ro(t.shadowRoot.activeElement))))}function Ds(){return[...ro()].pop()}var Ns=new WeakMap;function Fs(t){let e=Ns.get(t);return e||(e=window.getComputedStyle(t,null),Ns.set(t,e)),e}function ha(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const e=Fs(t);return e.visibility!=="hidden"&&e.display!=="none"}function ua(t){const e=Fs(t),{overflowY:r,overflowX:o}=e;return r==="scroll"||o==="scroll"?!0:r!=="auto"||o!=="auto"?!1:t.scrollHeight>t.clientHeight&&r==="auto"||t.scrollWidth>t.clientWidth&&o==="auto"}function pa(t){const e=t.tagName.toLowerCase(),r=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(r)||r<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){const i=t.getRootNode(),n=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=i.querySelector(`${n}:checked`);return a?a===t:i.querySelector(n)===t}return ha(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:ua(t):!1}function fa(t){var e,r;const o=oo(t),s=(e=o[0])!=null?e:null,i=(r=o[o.length-1])!=null?r:null;return{start:s,end:i}}function ma(t,e){var r;return((r=t.getRootNode({composed:!0}))==null?void 0:r.host)!==e}function oo(t){const e=new WeakMap,r=[];function o(s){if(s instanceof Element){if(s.hasAttribute("inert")||s.closest("[inert]")||e.has(s))return;e.set(s,!0),!r.includes(s)&&pa(s)&&r.push(s),s instanceof HTMLSlotElement&&ma(s,t)&&s.assignedElements({flatten:!0}).forEach(i=>{o(i)}),s.shadowRoot!==null&&s.shadowRoot.mode==="open"&&o(s.shadowRoot)}for(const i of s.children)o(i)}return o(t),r.sort((s,i)=>{const n=Number(s.getAttribute("tabindex"))||0;return(Number(i.getAttribute("tabindex"))||0)-n})}var xt=[],ga=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var r;if(e.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const o=Ds();if(this.previousFocus=o,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const s=oo(this.element);let i=s.findIndex(a=>a===o);this.previousFocus=this.currentFocus;const n=this.tabDirection==="forward"?1:-1;for(;;){i+n>=s.length?i=0:i+n<0?i=s.length-1:i+=n,this.previousFocus=this.currentFocus;const a=s[i];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||a&&this.possiblyHasTabbableChildren(a))return;e.preventDefault(),this.currentFocus=a,(r=this.currentFocus)==null||r.focus({preventScroll:!1});const l=[...ro()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){xt.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){xt=xt.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return xt[xt.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const t=oo(this.element);if(!this.element.matches(":focus-within")){const e=t[0],r=t[t.length-1],o=this.tabDirection==="forward"?e:r;typeof(o==null?void 0:o.focus)=="function"&&(this.currentFocus=o,o.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}},so=new Set;function va(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}function ba(){const t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}function io(t){if(so.add(t),!document.documentElement.classList.contains("sl-scroll-lock")){const e=va()+ba();let r=getComputedStyle(document.documentElement).scrollbarGutter;(!r||r==="auto")&&(r="stable"),e<2&&(r=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",r),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function no(t){so.delete(t),so.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}var ya=t=>{var e;const{activeElement:r}=document;r&&t.contains(r)&&((e=document.activeElement)==null||e.blur())},ao=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function wa(t){if(!t)return"";const e=t.assignedNodes({flatten:!0});let r="";return[...e].forEach(o=>{o.nodeType===Node.TEXT_NODE&&(r+=o.textContent)}),r}function Is(t){return t.charAt(0).toUpperCase()+t.slice(1)}var re=class extends J{constructor(){super(...arguments),this.hasSlotController=new ao(this,"footer"),this.localize=new be(this),this.modal=new ga(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=t=>{this.contained||t.key==="Escape"&&this.modal.isActive()&&this.open&&(t.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),io(this)))}disconnectedCallback(){super.disconnectedCallback(),no(this),this.removeOpenListeners()}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){const r=$e(this,"drawer.denyClose",{dir:this.localize.dir()});xe(this.panel,r.keyframes,r.options);return}this.hide()}addOpenListeners(){var t;"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;document.removeEventListener("keydown",this.handleDocumentKeyDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),io(this));const t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([Oe(this.drawer),Oe(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});const e=$e(this,`drawer.show${Is(this.placement)}`,{dir:this.localize.dir()}),r=$e(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([xe(this.panel,e.keyframes,e.options),xe(this.overlay,r.keyframes,r.options)]),this.emit("sl-after-show")}else{ya(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),no(this)),await Promise.all([Oe(this.drawer),Oe(this.overlay)]);const t=$e(this,`drawer.hide${Is(this.placement)}`,{dir:this.localize.dir()}),e=$e(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([xe(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),xe(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const r=this.originalTrigger;typeof(r==null?void 0:r.focus)=="function"&&setTimeout(()=>r.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),io(this)),this.open&&this.contained&&(this.modal.deactivate(),no(this))}async show(){if(!this.open)return this.open=!0,at(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,at(this,"sl-after-hide")}render(){return u`
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
          aria-label=${F(this.noHeader?this.label:void 0)}
          aria-labelledby=${F(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":u`
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
    `}};re.styles=[se,da],re.dependencies={"sl-icon-button":K},m([U(".drawer")],re.prototype,"drawer",2),m([U(".drawer__panel")],re.prototype,"panel",2),m([U(".drawer__overlay")],re.prototype,"overlay",2),m([d({type:Boolean,reflect:!0})],re.prototype,"open",2),m([d({reflect:!0})],re.prototype,"label",2),m([d({reflect:!0})],re.prototype,"placement",2),m([d({type:Boolean,reflect:!0})],re.prototype,"contained",2),m([d({attribute:"no-header",type:Boolean,reflect:!0})],re.prototype,"noHeader",2),m([G("open",{waitUntilFirstUpdate:!0})],re.prototype,"handleOpenChange",1),m([G("contained",{waitUntilFirstUpdate:!0})],re.prototype,"handleNoModalChange",1),X("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),X("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),X("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),X("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),X("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),X("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),X("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),X("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),X("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),X("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),X("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),re.define("sl-drawer");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ar=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lr=globalThis,lo=lr.ShadowRoot&&(lr.ShadyCSS===void 0||lr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,co=Symbol(),Bs=new WeakMap;let js=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==co)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(lo&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=Bs.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&Bs.set(r,e))}return e}toString(){return this.cssText}};const $a=t=>new js(typeof t=="string"?t:t+"",void 0,co),_t=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,s,i)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new js(r,t,co)},xa=(t,e)=>{if(lo)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),s=lr.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=r.cssText,t.appendChild(o)}},Hs=lo?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return $a(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_a,defineProperty:ka,getOwnPropertyDescriptor:Ca,getOwnPropertyNames:Aa,getOwnPropertySymbols:Pa,getPrototypeOf:Sa}=Object,Te=globalThis,Us=Te.trustedTypes,Ea=Us?Us.emptyScript:"",ho=Te.reactiveElementPolyfillSupport,kt=(t,e)=>t,cr={toAttribute(t,e){switch(e){case Boolean:t=t?Ea:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},uo=(t,e)=>!_a(t,e),Vs={attribute:!0,type:String,converter:cr,reflect:!1,useDefault:!1,hasChanged:uo};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Te.litPropertyMetadata??(Te.litPropertyMetadata=new WeakMap);let lt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=Vs){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),s=this.getPropertyDescriptor(e,o,r);s!==void 0&&ka(this.prototype,e,s)}}static getPropertyDescriptor(e,r,o){const{get:s,set:i}=Ca(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:s,set(n){const a=s==null?void 0:s.call(this);i==null||i.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Vs}static _$Ei(){if(this.hasOwnProperty(kt("elementProperties")))return;const e=Sa(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(kt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(kt("properties"))){const r=this.properties,o=[...Aa(r),...Pa(r)];for(const s of o)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,s]of r)this.elementProperties.set(o,s)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const s=this._$Eu(r,o);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const s of o)r.unshift(Hs(s))}else e!==void 0&&r.push(Hs(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise((r=>this.enableUpdating=r)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach((r=>r(this)))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xa(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)}))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var i;const o=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,o);if(s!==void 0&&o.reflect===!0){const n=(((i=o.converter)==null?void 0:i.toAttribute)!==void 0?o.converter:cr).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,r){var i,n;const o=this.constructor,s=o._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const a=o.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)==null?void 0:i.fromAttribute)!==void 0?a.converter:cr;this._$Em=s;const c=l.fromAttribute(r,a.type);this[s]=c??((n=this._$Ej)==null?void 0:n.get(s))??c,this._$Em=null}}requestUpdate(e,r,o){var s;if(e!==void 0){const i=this.constructor,n=this[e];if(o??(o=i.getPropertyOptions(e)),!((o.hasChanged??uo)(n,r)||o.useDefault&&o.reflect&&n===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(i._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:s,wrapped:i},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),i!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach((s=>{var i;return(i=s.hostUpdate)==null?void 0:i.call(s)})),this.update(r)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach((o=>{var s;return(s=o.hostUpdated)==null?void 0:s.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach((r=>this._$ET(r,this[r])))),this._$EM()}updated(e){}firstUpdated(e){}};lt.elementStyles=[],lt.shadowRootOptions={mode:"open"},lt[kt("elementProperties")]=new Map,lt[kt("finalized")]=new Map,ho==null||ho({ReactiveElement:lt}),(Te.reactiveElementVersions??(Te.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oa={attribute:!0,type:String,converter:cr,reflect:!1,hasChanged:uo},Ta=(t=Oa,e,r)=>{const{kind:o,metadata:s}=r;let i=globalThis.litPropertyMetadata.get(s);if(i===void 0&&globalThis.litPropertyMetadata.set(s,i=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),i.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+o)};function le(t){return(e,r)=>typeof r=="object"?Ta(t,e,r):((o,s,i)=>{const n=s.hasOwnProperty(i);return s.constructor.createProperty(i,o),n?Object.getOwnPropertyDescriptor(s,i):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ws(t){return le({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,dr=Ct.trustedTypes,qs=dr?dr.createPolicy("lit-html",{createHTML:t=>t}):void 0,Js="$lit$",Le=`lit$${Math.random().toFixed(9).slice(2)}$`,Ys="?"+Le,La=`<${Ys}>`,qe=document,At=()=>qe.createComment(""),Pt=t=>t===null||typeof t!="object"&&typeof t!="function",po=Array.isArray,Ra=t=>po(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",fo=`[ 	
\f\r]`,St=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Gs=/-->/g,Ks=/>/g,Je=RegExp(`>|${fo}(?:([^\\s"'>=/]+)(${fo}*=${fo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xs=/'/g,Zs=/"/g,Qs=/^(?:script|style|textarea|title)$/i,Ma=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),ct=Ma(1),Ye=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),ei=new WeakMap,Ge=qe.createTreeWalker(qe,129);function ti(t,e){if(!po(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return qs!==void 0?qs.createHTML(e):e}const za=(t,e)=>{const r=t.length-1,o=[];let s,i=e===2?"<svg>":e===3?"<math>":"",n=St;for(let a=0;a<r;a++){const l=t[a];let c,g,v=-1,_=0;for(;_<l.length&&(n.lastIndex=_,g=n.exec(l),g!==null);)_=n.lastIndex,n===St?g[1]==="!--"?n=Gs:g[1]!==void 0?n=Ks:g[2]!==void 0?(Qs.test(g[2])&&(s=RegExp("</"+g[2],"g")),n=Je):g[3]!==void 0&&(n=Je):n===Je?g[0]===">"?(n=s??St,v=-1):g[1]===void 0?v=-2:(v=n.lastIndex-g[2].length,c=g[1],n=g[3]===void 0?Je:g[3]==='"'?Zs:Xs):n===Zs||n===Xs?n=Je:n===Gs||n===Ks?n=St:(n=Je,s=void 0);const w=n===Je&&t[a+1].startsWith("/>")?" ":"";i+=n===St?l+La:v>=0?(o.push(c),l.slice(0,v)+Js+l.slice(v)+Le+w):l+Le+(v===-2?a:w)}return[ti(t,i+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class Et{constructor({strings:e,_$litType$:r},o){let s;this.parts=[];let i=0,n=0;const a=e.length-1,l=this.parts,[c,g]=za(e,r);if(this.el=Et.createElement(c,o),Ge.currentNode=this.el.content,r===2||r===3){const v=this.el.content.firstChild;v.replaceWith(...v.childNodes)}for(;(s=Ge.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(const v of s.getAttributeNames())if(v.endsWith(Js)){const _=g[n++],w=s.getAttribute(v).split(Le),k=/([.?@])?(.*)/.exec(_);l.push({type:1,index:i,name:k[2],strings:w,ctor:k[1]==="."?Na:k[1]==="?"?Fa:k[1]==="@"?Ia:hr}),s.removeAttribute(v)}else v.startsWith(Le)&&(l.push({type:6,index:i}),s.removeAttribute(v));if(Qs.test(s.tagName)){const v=s.textContent.split(Le),_=v.length-1;if(_>0){s.textContent=dr?dr.emptyScript:"";for(let w=0;w<_;w++)s.append(v[w],At()),Ge.nextNode(),l.push({type:2,index:++i});s.append(v[_],At())}}}else if(s.nodeType===8)if(s.data===Ys)l.push({type:2,index:i});else{let v=-1;for(;(v=s.data.indexOf(Le,v+1))!==-1;)l.push({type:7,index:i}),v+=Le.length-1}i++}}static createElement(e,r){const o=qe.createElement("template");return o.innerHTML=e,o}}function dt(t,e,r=t,o){var n,a;if(e===Ye)return e;let s=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const i=Pt(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==i&&((a=s==null?void 0:s._$AO)==null||a.call(s,!1),i===void 0?s=void 0:(s=new i(t),s._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=s:r._$Cl=s),s!==void 0&&(e=dt(t,s._$AS(t,e.values),s,o)),e}class Da{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,s=((e==null?void 0:e.creationScope)??qe).importNode(r,!0);Ge.currentNode=s;let i=Ge.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new Ot(i,i.nextSibling,this,e):l.type===1?c=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(c=new Ba(i,this,e)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(i=Ge.nextNode(),n++)}return Ge.currentNode=qe,s}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}}class Ot{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=dt(this,e,r),Pt(e)?e===B||e==null||e===""?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==Ye&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ra(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&Pt(this._$AH)?this._$AA.nextSibling.data=e:this.T(qe.createTextNode(e)),this._$AH=e}$(e){var i;const{values:r,_$litType$:o}=e,s=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Et.createElement(ti(o.h,o.h[0]),this.options)),o);if(((i=this._$AH)==null?void 0:i._$AD)===s)this._$AH.p(r);else{const n=new Da(s,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=ei.get(e.strings);return r===void 0&&ei.set(e.strings,r=new Et(e)),r}k(e){po(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,s=0;for(const i of e)s===r.length?r.push(o=new Ot(this.O(At()),this.O(At()),this,this.options)):o=r[s],o._$AI(i),s++;s<r.length&&(this._$AR(o&&o._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}}class hr{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,s,i){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=B}_$AI(e,r=this,o,s){const i=this.strings;let n=!1;if(i===void 0)e=dt(this,e,r,0),n=!Pt(e)||e!==this._$AH&&e!==Ye,n&&(this._$AH=e);else{const a=e;let l,c;for(e=i[0],l=0;l<i.length-1;l++)c=dt(this,a[o+l],r,l),c===Ye&&(c=this._$AH[l]),n||(n=!Pt(c)||c!==this._$AH[l]),c===B?e=B:e!==B&&(e+=(c??"")+i[l+1]),this._$AH[l]=c}n&&!s&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Na extends hr{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class Fa extends hr{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class Ia extends hr{constructor(e,r,o,s,i){super(e,r,o,s,i),this.type=5}_$AI(e,r=this){if((e=dt(this,e,r,0)??B)===Ye)return;const o=this._$AH,s=e===B&&o!==B||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,i=e!==B&&(o===B||s);s&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}}class Ba{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){dt(this,e)}}const mo=Ct.litHtmlPolyfillSupport;mo==null||mo(Et,Ot),(Ct.litHtmlVersions??(Ct.litHtmlVersions=[])).push("3.3.1");const ja=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let s=o._$litPart$;if(s===void 0){const i=(r==null?void 0:r.renderBefore)??null;o._$litPart$=s=new Ot(e.insertBefore(At(),i),i,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ke=globalThis;let Re=class extends lt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ja(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ye}};Re._$litElement$=!0,Re.finalized=!0,(hi=Ke.litElementHydrateSupport)==null||hi.call(Ke,{LitElement:Re});const go=Ke.litElementPolyfillSupport;go==null||go({LitElement:Re}),(Ke.litElementVersions??(Ke.litElementVersions=[])).push("4.2.1");function Ha(t){switch(t.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const Ua=_t`
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
`;var Va=Object.defineProperty,Wa=Object.getOwnPropertyDescriptor,ht=(t,e,r,o)=>{for(var s=o>1?void 0:o?Wa(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Va(e,r,s),s};let Me=class extends Re{constructor(){super(),this.lower=!1,this.method="GET"}render(){let t="medium";this.large&&(t="large"),this.tiny&&(t="small"),this.micro&&(t="small");const e=this.micro?`method ${t} micro`:`method ${t}`;return ct`
            <sl-tag variant="${Ha(this.method)}" class="${e}"
                    size="${t}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};Me.styles=Ua,ht([le()],Me.prototype,"method",2),ht([le({type:Boolean})],Me.prototype,"lower",2),ht([le({type:Boolean})],Me.prototype,"large",2),ht([le({type:Boolean})],Me.prototype,"tiny",2),ht([le({type:Boolean})],Me.prototype,"micro",2),Me=ht([ar("pb33f-http-method")],Me);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qa={CHILD:2},Ja=t=>(...e)=>({_$litDirective$:t,values:e});class Ya{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let vo=class extends Ya{constructor(e){if(super(e),this.it=B,e.type!==qa.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===B||e==null)return this._t=void 0,this.it=e;if(e===Ye)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}};vo.directiveName="unsafeHTML",vo.resultType=1;const ri=Ja(vo),Ga=_t`
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
`;var Ka=Object.defineProperty,Xa=Object.getOwnPropertyDescriptor,bo=(t,e,r,o)=>{for(var s=o>1?void 0:o?Xa(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Ka(e,r,s),s};let Tt=class extends Re{constructor(){super(),this.path="/",this.nowrap=!1}replaceBrackets(){const t=/\{([\w$.#/]+)\}/g,e=this.nowrap?" nowrap":"",r=this.formatSlashes(this.path).replace(t,(o,s)=>`<span class="bracket${e}">{</span><span class="param${e}">${s}</span><span class="bracket${e}">}</span>`);return this.nowrap?ct`<div style="white-space: nowrap;">${ri(r)}</div>`:ct`${ri(r)}`}formatSlashes(t){return t.replaceAll("/",'<span class="slash">/</span>')}render(){return ct`${this.replaceBrackets()}`}};Tt.styles=Ga,bo([le()],Tt.prototype,"path",2),bo([le({type:Boolean})],Tt.prototype,"nowrap",2),Tt=bo([ar("pb33f-render-operation-path")],Tt);const Za=_t`
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
    }`;var Qa=Object.defineProperty,el=Object.getOwnPropertyDescriptor,ur=(t,e,r,o)=>{for(var s=o>1?void 0:o?el(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Qa(e,r,s),s};let ut=class extends Re{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return ct` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};ut.styles=Za,ur([le()],ut.prototype,"name",2),ur([le()],ut.prototype,"url",2),ur([le({type:Boolean})],ut.prototype,"wide",2),ut=ur([ar("pb33f-header")],ut);const tl=_t`

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

`,rl=_t`
    
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
 `,ol="pb33f-theme-change";var sl=Object.defineProperty,il=Object.getOwnPropertyDescriptor,yo=(t,e,r,o)=>{for(var s=o>1?void 0:o?il(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&sl(e,r,s),s};const wo="dark",nl="light",al="tektronix",oi="pb33f-theme",si="pb33f-base-theme";let Lt=class extends Re{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?al:this.baseTheme}connectedCallback(){super.connectedCallback();const t=localStorage.getItem(oi);if(t==="tektronix"){this.tektronixActive=!0;const e=localStorage.getItem(si);this.baseTheme=e==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=t==="light"?"light":"dark";this.applyTheme()}applyTheme(){const t=this.activeTheme;localStorage.setItem(oi,t),localStorage.setItem(si,this.baseTheme);const e=document.querySelector("html");e&&(e.setAttribute("theme",t),t===nl?e.classList.remove("sl-theme-dark"):e.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(ol,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===wo?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const t=this.baseTheme===wo?"sun":"moon",e=this.baseTheme===wo?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",r=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return ct`
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
        `}};Lt.styles=[tl,rl],yo([Ws()],Lt.prototype,"baseTheme",2),yo([Ws()],Lt.prototype,"tektronixActive",2),Lt=yo([ar("pb33f-theme-switcher")],Lt);const ll=L`
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
`;var cl=Object.defineProperty,dl=Object.getOwnPropertyDescriptor,$o=(t,e,r,o)=>{for(var s=o>1?void 0:o?dl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&cl(e,r,s),s};const ii="pp-split-position",hl=20;h.PpLayout=class extends I{constructor(){super(...arguments),this.title="",this.splitPos=hl}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const e=sessionStorage.getItem(ii);e&&(this.splitPos=parseFloat(e))}onReposition(e){const r=e.target.position;typeof r=="number"&&(this.splitPos=r,sessionStorage.setItem(ii,String(r)))}render(){return u`
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
    `}},h.PpLayout.styles=ll,$o([R()],h.PpLayout.prototype,"title",2),$o([R()],h.PpLayout.prototype,"splitPos",2),h.PpLayout=$o([q("pp-layout")],h.PpLayout);const ul=L`
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
`;var pl=Object.defineProperty,fl=Object.getOwnPropertyDescriptor,pr=(t,e,r,o)=>{for(var s=o>1?void 0:o?fl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&pl(e,r,s),s};h.PpNav=class extends I{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const e=this.getAttribute("data-nav");if(e)try{this.tags=JSON.parse(e)||[]}catch{}const r=this.getAttribute("data-models");if(r)try{this.modelGroups=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return u`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?u`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(e=>u`<pp-nav-tag .tag=${e} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:b}
      ${this.modelGroups.length?u`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(e=>u`<pp-nav-model-group .group=${e} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:b}
    `}},h.PpNav.styles=ul,pr([R()],h.PpNav.prototype,"tags",2),pr([R()],h.PpNav.prototype,"modelGroups",2),pr([R()],h.PpNav.prototype,"activeSlug",2),h.PpNav=pr([q("pp-nav")],h.PpNav);const ml=L`
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
`;var gl=Object.defineProperty,vl=Object.getOwnPropertyDescriptor,fr=(t,e,r,o)=>{for(var s=o>1?void 0:o?vl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&gl(e,r,s),s};function xo(t,e){var r,o;return e?!!((r=t.operations)!=null&&r.some(s=>s.slug===e)||(o=t.children)!=null&&o.some(s=>xo(s,e))):!1}h.PpNavTag=class extends I{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("tag")||e.has("activeSlug"))&&xo(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var i,n;const{tag:e,activeSlug:r,open:o}=this,s=xo(e,r);return u`
            <div class="tag-header ${s?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${e.summary||e.name}</span>
            </div>
            ${o?u`
                        <div class="tag-body">
                            ${(i=e.operations)!=null&&i.length?u`
                                        <ul>
                                            ${e.operations.map(a=>u`
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
                            ${(n=e.children)!=null&&n.length?u`
                                        <div class="children">
                                            ${e.children.map(a=>u`
                                                        <pp-nav-tag .tag=${a}
                                                                    .activeSlug=${r}></pp-nav-tag>`)}
                                        </div>
                                    `:b}
                        </div>
                    `:b}
        `}},h.PpNavTag.styles=ml,fr([d({type:Object})],h.PpNavTag.prototype,"tag",2),fr([d()],h.PpNavTag.prototype,"activeSlug",2),fr([R()],h.PpNavTag.prototype,"open",2),h.PpNavTag=fr([q("pp-nav-tag")],h.PpNavTag);const bl=L`
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
`;var yl=Object.defineProperty,wl=Object.getOwnPropertyDescriptor,mr=(t,e,r,o)=>{for(var s=o>1?void 0:o?wl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&yl(e,r,s),s};function ni(t,e){var r;return e?((r=t.models)==null?void 0:r.some(o=>o.typeSlug+"/"+o.slug===e))??!1:!1}h.PpNavModelGroup=class extends I{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("group")||e.has("activeSlug"))&&ni(this.group,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var i;const{group:e,activeSlug:r,open:o}=this,s=ni(e,r);return u`
            <div class="group-header ${s?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${e.name}</span>
            </div>
            ${o&&((i=e.models)!=null&&i.length)?u`
                    <div class="group-body">
                        <ul>
                            ${e.models.map(n=>{const a=n.typeSlug+"/"+n.slug;return u`
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
        `}},h.PpNavModelGroup.styles=bl,mr([d({type:Object})],h.PpNavModelGroup.prototype,"group",2),mr([d()],h.PpNavModelGroup.prototype,"activeSlug",2),mr([R()],h.PpNavModelGroup.prototype,"open",2),h.PpNavModelGroup=mr([q("pp-nav-model-group")],h.PpNavModelGroup);const $l=L`
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
`;var xl=Object.defineProperty,_l=Object.getOwnPropertyDescriptor,Rt=(t,e,r,o)=>{for(var s=o>1?void 0:o?_l(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&xl(e,r,s),s};h.PpNavOperation=class extends I{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return u`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},h.PpNavOperation.styles=$l,Rt([d()],h.PpNavOperation.prototype,"method",2),Rt([d()],h.PpNavOperation.prototype,"path",2),Rt([d()],h.PpNavOperation.prototype,"slug",2),Rt([d({type:Boolean})],h.PpNavOperation.prototype,"deprecated",2),h.PpNavOperation=Rt([q("pp-nav-operation")],h.PpNavOperation);const _o=L`
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
`,kl=L`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color);
    font-family: var(--font-stack-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .parameter {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer);
  }
  .param-name {
    font-family: var(--font-stack-bold);
    color: var(--font-color);
  }
  .param-type {
    color: var(--primary-color);
    margin-left: 0.5rem;
    font-family: var(--font-stack);
  }
  a.ref-link,
  a.ref-link:hover {
    color: var(--terminal-text);
    font-family: var(--font-stack);
  }
  a.ref-link {
    text-decoration: none;
  }
  a.ref-link:hover {
    text-decoration: underline;
  }
  a.ref-link.param-name {
    font-family: var(--font-stack-bold);
  }
  .param-in {
    color: var(--font-color-sub2);
    margin-left: 0.5rem;
    font-size: 0.8em;
    font-family: var(--font-stack);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .required-badge {
    color: var(--error-color);
    font-family: var(--font-stack-bold);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .deprecated-badge {
    color: var(--warn-400);
    font-family: var(--font-stack-bold);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .param-desc {
    color: var(--font-color-sub1);
    margin-top: 0.2rem;
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
`;var Cl=Object.defineProperty,Al=Object.getOwnPropertyDescriptor,ko=(t,e,r,o)=>{for(var s=o>1?void 0:o?Al(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Cl(e,r,s),s};function Pl(t){var e;if(!t)return{type:"",enumValues:null};try{const r=JSON.parse(t);let o="";return r.type==="array"&&r.items?o=`array<${r.items.type||((e=r.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`:r.type?(o=Array.isArray(r.type)?r.type.join(" | "):r.type,r.format&&(o+=` (${r.format})`)):r.oneOf?o="oneOf":r.anyOf?o="anyOf":r.allOf?o="allOf":r.$ref&&(o=r.$ref.split("/").pop()),{type:o,enumValues:Array.isArray(r.enum)?r.enum:null}}catch{return{type:"",enumValues:null}}}h.PpOperationParameters=class extends I{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(e){if(e.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}render(){return this.params.length?u`
      <h3>Parameters</h3>
      ${this.params.map(e=>{const r=Pl(e.schemaJson),o=(r==null?void 0:r.type)||"";return u`
          <div class="parameter">
            ${e.ref?u`<a class="ref-link param-name" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c ${e.name}</a>`:u`<span class="param-name">${e.name}</span>`}
            ${o?u`<span class="param-type">${o}</span>`:b}
            <span class="param-in">${e.in}</span>
            ${e.required?u`<span class="required-badge">required</span>`:b}
            ${e.deprecated?u`<span class="deprecated-badge">deprecated</span>`:b}
            ${e.description?u`<div class="param-desc">${e.description}</div>`:b}
            ${r!=null&&r.enumValues?u`<div class="enum-values">Enum: ${r.enumValues.map((s,i)=>u`${i>0?", ":""}<span class="enum-value">${s}</span>`)}</div>`:b}
            ${!e.ref&&(e.rawJson||e.rawYaml)?u`<pp-raw-viewer-btn
                  title="${e.name} (${e.in})"
                  raw-json=${e.rawJson||""}
                  raw-yaml=${e.rawYaml||""}
                  start-line=${e.sourceLine||1}>
                </pp-raw-viewer-btn>`:b}
            ${e.mockJson||e.examples&&Object.keys(e.examples).length>0?u`<pp-example-selector
                  mock-json=${e.mockJson||""}
                  examples-json=${e.examples?JSON.stringify(e.examples):""}>
                </pp-example-selector>`:b}
          </div>
        `})}
    `:b}},h.PpOperationParameters.styles=[_o,kl],ko([d({attribute:"parameters-json"})],h.PpOperationParameters.prototype,"parametersJson",2),ko([R()],h.PpOperationParameters.prototype,"params",2),h.PpOperationParameters=ko([q("pp-operation-parameters")],h.PpOperationParameters);const Sl=L`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color);
    font-family: var(--font-stack-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .response {
    margin-bottom: 1.5rem;
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
    padding: 1rem;
    background: rgba(35, 35, 35, 0.2);
  }
  h4 {
    margin: 0 0 0.5rem 0;
  }
  .status-code {
    font-family: var(--font-stack-bold);
    font-weight: 700;
    margin-right: 0.5em;
    color: var(--primary-color);
  }
  a.ref-link,
  a.ref-link:hover {
    color: var(--terminal-text);
    font-family: var(--font-stack);
  }
  a.ref-link {
    text-decoration: none;
  }
  a.ref-link:hover {
    text-decoration: underline;
  }
  .media-type-ref {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
  .media-type-label {
    font-family: var(--font-stack-bold);
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 0.85em;
  }
  .array-type {
    font-family: var(--font-stack);
    color: var(--font-color-sub1);
  }
  .schema-type {
    color: var(--font-color-sub2);
    font-family: var(--font-stack);
    font-size: 0.85em;
    margin-top: 0.25rem;
  }
  .property {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer);
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
  .nested {
    margin-left: 1rem;
    border-left: 1px dashed var(--secondary-color-dimmer);
  }
  .items-label {
    font-family: var(--font-stack);
    font-size: 0.8em;
    color: var(--font-color-sub2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.3rem 0.75rem 0;
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
  /* ── Header constraints ── */
  .header-constraints {
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
    margin-top: 0.5rem;
  }
  .inline-example-label {
    font-family: var(--font-stack);
    color: var(--font-color-sub2);
    font-size: 0.8em;
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
    font-family: var(--font-stack);
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
`;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Co=class extends Hr{constructor(e){if(super(e),this.it=b,e.type!==Br.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===b||e==null)return this._t=void 0,this.it=e;if(e===Ae)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}};Co.directiveName="unsafeHTML",Co.resultType=1;const Ao=jr(Co);var ai=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function El(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Po={exports:{}},li;function Ol(){return li||(li=1,(function(t){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var r=(function(o){var s=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,i=0,n={},a={manual:o.Prism&&o.Prism.manual,disableWorkerMessageHandler:o.Prism&&o.Prism.disableWorkerMessageHandler,util:{encode:function f(p){return p instanceof l?new l(p.type,f(p.content),p.alias):Array.isArray(p)?p.map(f):p.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(f){return Object.prototype.toString.call(f).slice(8,-1)},objId:function(f){return f.__id||Object.defineProperty(f,"__id",{value:++i}),f.__id},clone:function f(p,y){y=y||{};var x,$;switch(a.util.type(p)){case"Object":if($=a.util.objId(p),y[$])return y[$];x={},y[$]=x;for(var C in p)p.hasOwnProperty(C)&&(x[C]=f(p[C],y));return x;case"Array":return $=a.util.objId(p),y[$]?y[$]:(x=[],y[$]=x,p.forEach(function(O,A){x[A]=f(O,y)}),x);default:return p}},getLanguage:function(f){for(;f;){var p=s.exec(f.className);if(p)return p[1].toLowerCase();f=f.parentElement}return"none"},setLanguage:function(f,p){f.className=f.className.replace(RegExp(s,"gi"),""),f.classList.add("language-"+p)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(x){var f=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(x.stack)||[])[1];if(f){var p=document.getElementsByTagName("script");for(var y in p)if(p[y].src==f)return p[y]}return null}},isActive:function(f,p,y){for(var x="no-"+p;f;){var $=f.classList;if($.contains(p))return!0;if($.contains(x))return!1;f=f.parentElement}return!!y}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(f,p){var y=a.util.clone(a.languages[f]);for(var x in p)y[x]=p[x];return y},insertBefore:function(f,p,y,x){x=x||a.languages;var $=x[f],C={};for(var O in $)if($.hasOwnProperty(O)){if(O==p)for(var A in y)y.hasOwnProperty(A)&&(C[A]=y[A]);y.hasOwnProperty(O)||(C[O]=$[O])}var T=x[f];return x[f]=C,a.languages.DFS(a.languages,function(N,j){j===T&&N!=f&&(this[N]=C)}),C},DFS:function f(p,y,x,$){$=$||{};var C=a.util.objId;for(var O in p)if(p.hasOwnProperty(O)){y.call(p,O,p[O],x||O);var A=p[O],T=a.util.type(A);T==="Object"&&!$[C(A)]?($[C(A)]=!0,f(A,y,null,$)):T==="Array"&&!$[C(A)]&&($[C(A)]=!0,f(A,y,O,$))}}},plugins:{},highlightAll:function(f,p){a.highlightAllUnder(document,f,p)},highlightAllUnder:function(f,p,y){var x={callback:y,container:f,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",x),x.elements=Array.prototype.slice.apply(x.container.querySelectorAll(x.selector)),a.hooks.run("before-all-elements-highlight",x);for(var $=0,C;C=x.elements[$++];)a.highlightElement(C,p===!0,x.callback)},highlightElement:function(f,p,y){var x=a.util.getLanguage(f),$=a.languages[x];a.util.setLanguage(f,x);var C=f.parentElement;C&&C.nodeName.toLowerCase()==="pre"&&a.util.setLanguage(C,x);var O=f.textContent,A={element:f,language:x,grammar:$,code:O};function T(j){A.highlightedCode=j,a.hooks.run("before-insert",A),A.element.innerHTML=A.highlightedCode,a.hooks.run("after-highlight",A),a.hooks.run("complete",A),y&&y.call(A.element)}if(a.hooks.run("before-sanity-check",A),C=A.element.parentElement,C&&C.nodeName.toLowerCase()==="pre"&&!C.hasAttribute("tabindex")&&C.setAttribute("tabindex","0"),!A.code){a.hooks.run("complete",A),y&&y.call(A.element);return}if(a.hooks.run("before-highlight",A),!A.grammar){T(a.util.encode(A.code));return}if(p&&o.Worker){var N=new Worker(a.filename);N.onmessage=function(j){T(j.data)},N.postMessage(JSON.stringify({language:A.language,code:A.code,immediateClose:!0}))}else T(a.highlight(A.code,A.grammar,A.language))},highlight:function(f,p,y){var x={code:f,grammar:p,language:y};if(a.hooks.run("before-tokenize",x),!x.grammar)throw new Error('The language "'+x.language+'" has no grammar.');return x.tokens=a.tokenize(x.code,x.grammar),a.hooks.run("after-tokenize",x),l.stringify(a.util.encode(x.tokens),x.language)},tokenize:function(f,p){var y=p.rest;if(y){for(var x in y)p[x]=y[x];delete p.rest}var $=new v;return _($,$.head,f),g(f,$,p,$.head,0),k($)},hooks:{all:{},add:function(f,p){var y=a.hooks.all;y[f]=y[f]||[],y[f].push(p)},run:function(f,p){var y=a.hooks.all[f];if(!(!y||!y.length))for(var x=0,$;$=y[x++];)$(p)}},Token:l};o.Prism=a;function l(f,p,y,x){this.type=f,this.content=p,this.alias=y,this.length=(x||"").length|0}l.stringify=function f(p,y){if(typeof p=="string")return p;if(Array.isArray(p)){var x="";return p.forEach(function(T){x+=f(T,y)}),x}var $={type:p.type,content:f(p.content,y),tag:"span",classes:["token",p.type],attributes:{},language:y},C=p.alias;C&&(Array.isArray(C)?Array.prototype.push.apply($.classes,C):$.classes.push(C)),a.hooks.run("wrap",$);var O="";for(var A in $.attributes)O+=" "+A+'="'+($.attributes[A]||"").replace(/"/g,"&quot;")+'"';return"<"+$.tag+' class="'+$.classes.join(" ")+'"'+O+">"+$.content+"</"+$.tag+">"};function c(f,p,y,x){f.lastIndex=p;var $=f.exec(y);if($&&x&&$[1]){var C=$[1].length;$.index+=C,$[0]=$[0].slice(C)}return $}function g(f,p,y,x,$,C){for(var O in y)if(!(!y.hasOwnProperty(O)||!y[O])){var A=y[O];A=Array.isArray(A)?A:[A];for(var T=0;T<A.length;++T){if(C&&C.cause==O+","+T)return;var N=A[T],j=N.inside,de=!!N.lookbehind,V=!!N.greedy,_e=N.alias;if(V&&!N.pattern.global){var he=N.pattern.toString().match(/[imsuy]*$/)[0];N.pattern=RegExp(N.pattern.source,he+"g")}for(var Z=N.pattern||N,D=x.next,H=$;D!==p.tail&&!(C&&H>=C.reach);H+=D.value.length,D=D.next){var ze=D.value;if(p.length>f.length)return;if(!(ze instanceof l)){var wr=1,ue;if(V){if(ue=c(Z,H,f,de),!ue||ue.index>=f.length)break;var $r=ue.index,kc=ue.index+ue[0].length,De=H;for(De+=D.value.length;$r>=De;)D=D.next,De+=D.value.length;if(De-=D.value.length,H=De,D.value instanceof l)continue;for(var It=D;It!==p.tail&&(De<kc||typeof It.value=="string");It=It.next)wr++,De+=It.value.length;wr--,ze=f.slice(H,De),ue.index-=H}else if(ue=c(Z,0,ze,de),!ue)continue;var $r=ue.index,xr=ue[0],Do=ze.slice(0,$r),ui=ze.slice($r+xr.length),No=H+ze.length;C&&No>C.reach&&(C.reach=No);var _r=D.prev;Do&&(_r=_(p,_r,Do),H+=Do.length),w(p,_r,wr);var Cc=new l(O,j?a.tokenize(xr,j):xr,_e,xr);if(D=_(p,_r,Cc),ui&&_(p,D,ui),wr>1){var Fo={cause:O+","+T,reach:No};g(f,p,y,D.prev,H,Fo),C&&Fo.reach>C.reach&&(C.reach=Fo.reach)}}}}}}function v(){var f={value:null,prev:null,next:null},p={value:null,prev:f,next:null};f.next=p,this.head=f,this.tail=p,this.length=0}function _(f,p,y){var x=p.next,$={value:y,prev:p,next:x};return p.next=$,x.prev=$,f.length++,$}function w(f,p,y){for(var x=p.next,$=0;$<y&&x!==f.tail;$++)x=x.next;p.next=x,x.prev=p,f.length-=$}function k(f){for(var p=[],y=f.head.next;y!==f.tail;)p.push(y.value),y=y.next;return p}if(!o.document)return o.addEventListener&&(a.disableWorkerMessageHandler||o.addEventListener("message",function(f){var p=JSON.parse(f.data),y=p.language,x=p.code,$=p.immediateClose;o.postMessage(a.highlight(x,a.languages[y],y)),$&&o.close()},!1)),a;var P=a.util.currentScript();P&&(a.filename=P.src,P.hasAttribute("data-manual")&&(a.manual=!0));function S(){a.manual||a.highlightAll()}if(!a.manual){var E=document.readyState;E==="loading"||E==="interactive"&&P&&P.defer?document.addEventListener("DOMContentLoaded",S):window.requestAnimationFrame?window.requestAnimationFrame(S):window.setTimeout(S,16)}return a})(e);t.exports&&(t.exports=r),typeof ai<"u"&&(ai.Prism=r),r.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},r.languages.markup.tag.inside["attr-value"].inside.entity=r.languages.markup.entity,r.languages.markup.doctype.inside["internal-subset"].inside=r.languages.markup,r.hooks.add("wrap",function(o){o.type==="entity"&&(o.attributes.title=o.content.replace(/&amp;/,"&"))}),Object.defineProperty(r.languages.markup.tag,"addInlined",{value:function(s,i){var n={};n["language-"+i]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:r.languages[i]},n.cdata=/^<!\[CDATA\[|\]\]>$/i;var a={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:n}};a["language-"+i]={pattern:/[\s\S]+/,inside:r.languages[i]};var l={};l[s]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return s}),"i"),lookbehind:!0,greedy:!0,inside:a},r.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(r.languages.markup.tag,"addAttribute",{value:function(o,s){r.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+o+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[s,"language-"+s],inside:r.languages[s]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),r.languages.html=r.languages.markup,r.languages.mathml=r.languages.markup,r.languages.svg=r.languages.markup,r.languages.xml=r.languages.extend("markup",{}),r.languages.ssml=r.languages.xml,r.languages.atom=r.languages.xml,r.languages.rss=r.languages.xml,(function(o){var s=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;o.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+s.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+s.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+s.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+s.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:s,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},o.languages.css.atrule.inside.rest=o.languages.css;var i=o.languages.markup;i&&(i.tag.addInlined("style","css"),i.tag.addAttribute("style","css"))})(r),r.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},r.languages.javascript=r.languages.extend("clike",{"class-name":[r.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),r.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,r.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:r.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:r.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:r.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:r.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:r.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),r.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:r.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),r.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),r.languages.markup&&(r.languages.markup.tag.addInlined("script","javascript"),r.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),r.languages.js=r.languages.javascript,(function(){if(typeof r>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var o="Loading…",s=function(P,S){return"✖ Error "+P+" while fetching file: "+S},i="✖ Error: File does not exist or is empty",n={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},a="data-src-status",l="loading",c="loaded",g="failed",v="pre[data-src]:not(["+a+'="'+c+'"]):not(['+a+'="'+l+'"])';function _(P,S,E){var f=new XMLHttpRequest;f.open("GET",P,!0),f.onreadystatechange=function(){f.readyState==4&&(f.status<400&&f.responseText?S(f.responseText):f.status>=400?E(s(f.status,f.statusText)):E(i))},f.send(null)}function w(P){var S=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(P||"");if(S){var E=Number(S[1]),f=S[2],p=S[3];return f?p?[E,Number(p)]:[E,void 0]:[E,E]}}r.hooks.add("before-highlightall",function(P){P.selector+=", "+v}),r.hooks.add("before-sanity-check",function(P){var S=P.element;if(S.matches(v)){P.code="",S.setAttribute(a,l);var E=S.appendChild(document.createElement("CODE"));E.textContent=o;var f=S.getAttribute("data-src"),p=P.language;if(p==="none"){var y=(/\.(\w+)$/.exec(f)||[,"none"])[1];p=n[y]||y}r.util.setLanguage(E,p),r.util.setLanguage(S,p);var x=r.plugins.autoloader;x&&x.loadLanguages(p),_(f,function($){S.setAttribute(a,c);var C=w(S.getAttribute("data-range"));if(C){var O=$.split(/\r\n?|\n/g),A=C[0],T=C[1]==null?O.length:C[1];A<0&&(A+=O.length),A=Math.max(0,Math.min(A-1,O.length)),T<0&&(T+=O.length),T=Math.max(0,Math.min(T,O.length)),$=O.slice(A,T).join(`
`),S.hasAttribute("data-start")||S.setAttribute("data-start",String(A+1))}E.textContent=$,r.highlightElement(E)},function($){S.setAttribute(a,g),E.textContent=$})}}),r.plugins.fileHighlight={highlight:function(S){for(var E=(S||document).querySelectorAll(v),f=0,p;p=E[f++];)r.highlightElement(p)}};var k=!1;r.fileHighlight=function(){k||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),k=!0),r.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(Po)),Po.exports}var Tl=Ol();const pt=El(Tl);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json,(function(t){var e=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,o="(?:"+r.source+"(?:[ 	]+"+e.source+")?|"+e.source+"(?:[ 	]+"+r.source+")?)",s=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),i=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function n(a,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<value>>/g,function(){return a});return RegExp(c,l)}t.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return o})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<key>>/g,function(){return"(?:"+s+"|"+i+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:n(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:n(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:n(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:n(i),lookbehind:!0,greedy:!0},number:{pattern:n(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:e,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},t.languages.yml=t.languages.yaml})(Prism);const Ll=L`
  :host {
    display: block;
  }

  /* ── Plain mode (no line numbers) ── */
  pre {
    margin: 0;
    padding: 1.5rem;
    overflow-x: auto;
    background: var(--terminal-background, #0a0a0a);
    color: var(--font-color, #e8e9ed);
    font-family: var(--font-stack, monospace);
    font-size: 0.8rem;
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
`;var Rl=Object.defineProperty,Ml=Object.getOwnPropertyDescriptor,me=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ml(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Rl(e,r,s),s};pt.manual=!0,h.PpCodeViewer=class extends I{constructor(){super(...arguments),this.code="",this.language="json",this.pretty=!1,this.lineNumbers=!1,this.highlightLines="",this.startLine=1,this.location="",this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:"",language:"",segments:[]},this._highlightCache={spec:"",parsed:new Set}}get displayCode(){if(!this.code)return"";if(this.pretty&&this.language==="json")try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(e){const r=new Set;if(!e)return r;for(const o of e.split(",")){const i=o.trim().match(/^(\d+)(?:-(\d+))?$/);if(!i)continue;const n=parseInt(i[1],10),a=i[2]?parseInt(i[2],10):n;for(let l=Math.min(n,a);l<=Math.max(n,a);l++)r.add(l)}return r}highlightCode(){const e=this.displayCode;if(!e)return"";try{return pt.highlight(e,pt.languages[this.language],this.language)}catch{return e}}splitHighlightedLines(e){const r=[];let o="";const s=[];let i=0;for(;i<e.length;)if(e[i]===`
`){for(let n=s.length-1;n>=0;n--)o+="</span>";r.push(o),o=s.join(""),i++}else if(e[i]==="<")if(e.startsWith("</span>",i))o+="</span>",s.pop(),i+=7;else{const n=e.indexOf(">",i);if(n===-1){o+=e[i],i++;continue}const a=e.slice(i,n+1);o+=a,a.startsWith("</")||s.push(a),i=n+1}else o+=e[i],i++;for(let n=s.length-1;n>=0;n--)o+="</span>";return o&&r.push(o),r}getLineSegments(){const e=this.displayCode;if(e===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;const r=this.highlightCode(),o=r?this.splitHighlightedLines(r):[];return this._segmentCache={code:e,language:this.language,segments:o},o}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){const e=this.parsedHighlights;return e.size>0?e:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}handleLineClick(e,r){if(this.isLocked)return;const o=new Set;if(r.shiftKey&&this.lastClickedLine!==null){const s=Math.min(this.lastClickedLine,e),i=Math.max(this.lastClickedLine,e);for(let n=s;n<=i;n++)o.add(n)}else this.selectedLines.size===1&&this.selectedLines.has(e)||o.add(e);this.selectedLines=o,this.lastClickedLine=e}willUpdate(e){(e.has("code")||e.has("language"))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?u`<div class="location">${this.location}</div>`:b}render(){if(!this.lineNumbers)return u`
              <pre class="language-${this.language}"><code>${Ao(this.highlightCode())}</code></pre>
              ${this.renderLocation()}
            `;const e=this.getLineSegments(),r=Math.max(this.startLine,1),o=r+e.length-1,s=o>0?Math.floor(Math.log10(o))+1:1,i=this.effectiveHighlights,n=this.isLocked;return u`
          <div class="lined-code${n?" locked":""}" style="--gutter-digits: ${s}">
            <pre class="language-${this.language}"><code>${e.map((a,l)=>{const c=r+l,g=i.has(c);return u`<span class="line${g?" highlighted":""}"
                ><span class="line-number"
                       @click=${v=>this.handleLineClick(c,v)}
                >${c}</span><span class="line-content">${Ao(a||" ")}</span>
</span>`})}</code></pre>
          </div>
          ${this.renderLocation()}
        `}},h.PpCodeViewer.styles=[Ll],me([d()],h.PpCodeViewer.prototype,"code",2),me([d()],h.PpCodeViewer.prototype,"language",2),me([d({type:Boolean})],h.PpCodeViewer.prototype,"pretty",2),me([d({attribute:"line-numbers",type:Boolean})],h.PpCodeViewer.prototype,"lineNumbers",2),me([d({attribute:"highlight-lines"})],h.PpCodeViewer.prototype,"highlightLines",2),me([d({attribute:"start-line",type:Number})],h.PpCodeViewer.prototype,"startLine",2),me([d()],h.PpCodeViewer.prototype,"location",2),me([R()],h.PpCodeViewer.prototype,"selectedLines",2),me([R()],h.PpCodeViewer.prototype,"lastClickedLine",2),h.PpCodeViewer=me([q("pp-code-viewer")],h.PpCodeViewer);function So(t){var e;if(!t)return"";if(t.type==="array"&&t.items)return`array<${t.items.type||((e=t.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`;if(t.type){let r=Array.isArray(t.type)?t.type.join(" | "):t.type;return t.format&&(r+=` (${t.format})`),r}return t.oneOf?"oneOf":t.anyOf?"anyOf":t.allOf?"allOf":t.$ref?t.$ref.split("/").pop()??"":""}var zl=Object.defineProperty,Dl=Object.getOwnPropertyDescriptor,Eo=(t,e,r,o)=>{for(var s=o>1?void 0:o?Dl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&zl(e,r,s),s};function Nl(t){var e;return t?t.properties?t:t.type==="array"&&((e=t.items)!=null&&e.properties)?t.items:null:null}h.PpOperationResponses=class extends I{constructor(){super(...arguments),this.responsesJson="",this.responses=[]}willUpdate(e){if(e.has("responsesJson")&&this.responsesJson)try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}}renderProperty(e,r,o,s){const i=So(r),n=Nl(r),a=(r==null?void 0:r.type)==="array"&&n;return u`
      <div class="property">
        <span class="prop-name">${e}</span>
        ${i?u`<span class="prop-type">${i}</span>`:b}
        ${o.has(e)?u`<span class="required-badge">required</span>`:b}
        ${r.description?u`<div class="prop-desc">${r.description}</div>`:b}
        ${r.enum?u`<div class="enum-values">Enum: ${r.enum.map((l,c)=>u`${c>0?", ":""}<span class="enum-value">${l}</span>`)}</div>`:b}
      </div>
      ${n&&s<4?u`
            <div class="nested">
              ${a?u`<div class="items-label">items</div>`:b}
              ${this.renderSchemaProperties(n,s+1)}
            </div>
          `:b}
    `}renderSchemaProperties(e,r=0){if(!e)return b;const o=e.properties||{},s=new Set(e.required||[]),i=Object.entries(o);if(!i.length){const n=So(e);return n?u`<div class="schema-type">Type: ${n}</div>`:b}return i.map(([n,a])=>this.renderProperty(n,a,s,r))}renderRefLink(e){return u`<a class="ref-link" href="models/${e.typeSlug}/${e.slug}.html">\u279c ${e.name}</a>`}renderInlineExamples(e){const r=[];if(e.examples)for(const[o,s]of Object.entries(e.examples))s&&r.push({key:o,json:s});return e.mockJson&&r.push({key:"Generated Example",json:e.mockJson}),r.length?r.map(o=>{let s=o.json;try{s=JSON.stringify(JSON.parse(o.json),null,2)}catch{}return u`
        <div class="inline-example">
          <div class="inline-example-label">${o.key}</div>
          <pp-code-viewer
            .code=${s}
            language="json">
          </pp-code-viewer>
        </div>
      `}):b}renderMediaType(e){if(e.isArray&&e.itemsRef)return u`
        <div class="media-type-ref">
          <span class="media-type-label">${e.mediaType}</span>
          <span class="array-type">Array&lt;${this.renderRefLink(e.itemsRef)}&gt;</span>
        </div>
        ${this.renderInlineExamples(e)}
      `;if(e.schemaRef)return u`
        <div class="media-type-ref">
          <span class="media-type-label">${e.mediaType}</span>
          ${this.renderRefLink(e.schemaRef)}
        </div>
        ${this.renderInlineExamples(e)}
      `;if(!e.schemaJson)return b;let r;try{r=JSON.parse(e.schemaJson)}catch{return b}return u`
      <div class="media-type-label">${e.mediaType}</div>
      ${this.renderSchemaProperties(r)}
      ${this.renderInlineExamples(e)}
    `}computeCommonHeaders(){const e=new Map,r=new Map;for(const i of this.responses)for(const n of i.headers??[])e.set(n.name,(e.get(n.name)??0)+1),r.has(n.name)||r.set(n.name,n);const o=[],s=new Set;for(const[i,n]of e)n>=2&&(o.push(r.get(i)),s.add(i));return{common:o,commonNames:s}}scrollToHeader(e){const r=document.getElementById("header-"+e);r==null||r.scrollIntoView({behavior:"smooth",block:"nearest"})}renderHeaderConstraints(e){var o,s;return e.example!==void 0||e.minimum!==void 0||e.maximum!==void 0||e.default!==void 0||e.pattern||((o=e.enum)==null?void 0:o.length)?u`
      <div class="header-constraints">
        ${e.example!==void 0?u`<span class="constraint-label">example</span><span class="constraint-value">${e.example}</span>`:b}
        ${e.default!==void 0?u`<span class="constraint-label">default</span><span class="constraint-value">${e.default}</span>`:b}
        ${e.minimum!==void 0?u`<span class="constraint-label">min</span><span class="constraint-value">${e.minimum}</span>`:b}
        ${e.maximum!==void 0?u`<span class="constraint-label">max</span><span class="constraint-value">${e.maximum}</span>`:b}
        ${e.pattern?u`<span class="constraint-label">pattern</span><span class="constraint-value"><code>${e.pattern}</code></span>`:b}
        ${(s=e.enum)!=null&&s.length?u`<span class="constraint-label">enum</span><span class="constraint-value">${e.enum.map((i,n)=>u`${n>0?", ":""}<span class="enum-value">${i}</span>`)}</span>`:b}
      </div>
    `:b}renderHeaderEntry(e){return u`
      <div class="header-entry">
        ${e.ref?u`<a class="ref-link header-name" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c ${e.name}</a>`:u`<span class="header-name">${e.name}</span>`}
        ${e.schemaType?u`<span class="header-type">${e.schemaType}</span>`:b}
        ${e.description?u`<div class="header-desc">${e.description}</div>`:b}
        ${this.renderHeaderConstraints(e)}
      </div>
    `}renderHeaders(e,r){if(!e||!e.length)return b;const o=e.filter(i=>!r.has(i.name)),s=e.filter(i=>r.has(i.name));return!o.length&&!s.length?b:u`
      <div class="headers-section">
        <div class="headers-label">Headers</div>
        ${s.length?u`
          <div class="common-header-grid">
            <div class="common-link-label">\u2191 common</div>
            ${s.map(i=>u`
              <a class="header-anchor" @click=${n=>{n.preventDefault(),this.scrollToHeader(i.name)}}>${i.name}</a>
              <span class="common-header-desc">${i.description||""}</span>
            `)}
          </div>
        `:b}
        ${o.map(i=>this.renderHeaderEntry(i))}
      </div>
    `}errorRefKey(e){var r;if(e.ref)return`ref:${e.ref.slug}`;if((r=e.content)!=null&&r.length){const o=e.content[0];if(o.schemaRef)return`schema:${o.schemaRef.slug}`;if(o.isArray&&o.itemsRef)return`items:${o.itemsRef.slug}`}return null}computeCommonErrors(e){const r=new Map;for(const i of e){const n=this.errorRefKey(i);if(!n)continue;const a=r.get(n);a?a.codeDescs.push({code:i.statusCode,description:i.description}):r.set(n,{resp:i,codeDescs:[{code:i.statusCode,description:i.description}]})}const o=new Set,s=new Map;for(const[i,n]of r)n.codeDescs.length>=2&&(o.add(i),s.set(i,n));return{commonKeys:o,commonResponses:s}}scrollToCommonError(e){var o;const r=(o=this.shadowRoot)==null?void 0:o.getElementById("common-error-"+e);r==null||r.scrollIntoView({behavior:"smooth",block:"nearest"})}renderResponse(e,r,o){var n,a;const s=o?this.errorRefKey(e):null,i=s!=null&&(o==null?void 0:o.has(s));return u`
      <div class="response">
        <h4>
          <span class="status-code">${e.statusCode}</span>
          ${e.description}
          ${e.rawJson||e.rawYaml?u`<pp-raw-viewer-btn
                title="Response ${e.statusCode}"
                raw-json=${e.rawJson||""}
                raw-yaml=${e.rawYaml||""}
                start-line=${e.sourceLine||1}>
              </pp-raw-viewer-btn>`:b}
        </h4>
        ${i?u`
              <div class="common-error-link">
                ${e.ref?this.renderRefLink(e.ref):b}
                ${!e.ref&&((n=e.content)!=null&&n.length)?this.renderMediaTypeHeader(e.content[0]):b}
                <a class="error-anchor" @click=${l=>{l.preventDefault(),this.scrollToCommonError(s)}}>\u2191 see common example</a>
              </div>`:e.ref?this.renderRefLink(e.ref):((a=e.content)==null?void 0:a.map(l=>this.renderMediaType(l)))??b}
        ${this.renderHeaders(e.headers??[],r)}
      </div>
    `}renderMediaTypeHeader(e){return e.isArray&&e.itemsRef?u`
        <span class="media-type-label">${e.mediaType}</span>
        <span class="array-type">Array&lt;${this.renderRefLink(e.itemsRef)}&gt;</span>
      `:e.schemaRef?u`
        <span class="media-type-label">${e.mediaType}</span>
        ${this.renderRefLink(e.schemaRef)}
      `:b}renderCommonErrors(e,r){return e.size?u`
      <h3 class="response-group-heading">Common Error Responses</h3>
      ${[...e.entries()].map(([o,{resp:s,codeDescs:i}])=>{var n;return u`
        <div class="response common-error-response" id="common-error-${o}">
          <div class="common-error-grid">
            ${i.map(({code:a,description:l})=>u`
              <span class="common-error-code">${a}</span>
              <span class="common-error-desc">${l}</span>
            `)}
          </div>
          ${s.ref?this.renderRefLink(s.ref):((n=s.content)==null?void 0:n.map(a=>this.renderMediaType(a)))??b}
          ${this.renderHeaders(s.headers??[],r)}
        </div>
      `})}
    `:b}render(){if(!this.responses.length)return b;const{commonNames:e}=this.computeCommonHeaders(),r=[...this.responses].sort((l,c)=>parseInt(l.statusCode,10)-parseInt(c.statusCode,10)),o=[],s=[],i=[];for(const l of r){const c=parseInt(l.statusCode,10);c>=400?i.push(l):c>=300?s.push(l):o.push(l)}const{commonKeys:n,commonResponses:a}=this.computeCommonErrors(i);return u`
      <h3>Responses</h3>
      ${o.map(l=>this.renderResponse(l,e))}
      ${s.length?u`
        <h3 class="response-group-heading">Redirect Responses</h3>
        ${s.map(l=>this.renderResponse(l,e))}
      `:b}
      ${this.renderCommonErrors(a,e)}
      ${i.length?u`
        <h3 class="response-group-heading">Error Responses</h3>
        ${i.map(l=>this.renderResponse(l,e,n))}
      `:b}
    `}},h.PpOperationResponses.styles=[_o,Sl],Eo([d({attribute:"responses-json"})],h.PpOperationResponses.prototype,"responsesJson",2),Eo([R()],h.PpOperationResponses.prototype,"responses",2),h.PpOperationResponses=Eo([q("pp-operation-responses")],h.PpOperationResponses);const Fl=L`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color);
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
    border-bottom: 1px dotted var(--secondary-color-dimmer);
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
`,Il=L`
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
`;var Bl=Object.defineProperty,jl=Object.getOwnPropertyDescriptor,Xe=(t,e,r,o)=>{for(var s=o>1?void 0:o?jl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Bl(e,r,s),s};h.PpInlineCode=class extends I{constructor(){super(...arguments),this.rawJson="",this.rawYaml="",this.startLine=1,this.title="Schema",this.location="",this.mode="yaml"}connectedCallback(){super.connectedCallback();const e=document.body.getAttribute("data-spec-format");(e==="json"||e==="yaml")&&(this.mode=e)}render(){if(!this.rawJson&&!this.rawYaml)return b;const e=!!this.rawJson,r=!!this.rawYaml,o=this.mode==="yaml"&&r?this.rawYaml:this.rawJson,s=this.mode==="yaml"&&r?"yaml":"json";return u`
      <div class="toolbar">
        <h3>${this.title}</h3>
        ${e&&r?u`
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
    `}},h.PpInlineCode.styles=[Il],Xe([d({attribute:"raw-json"})],h.PpInlineCode.prototype,"rawJson",2),Xe([d({attribute:"raw-yaml"})],h.PpInlineCode.prototype,"rawYaml",2),Xe([d({attribute:"start-line",type:Number})],h.PpInlineCode.prototype,"startLine",2),Xe([d()],h.PpInlineCode.prototype,"title",2),Xe([d()],h.PpInlineCode.prototype,"location",2),Xe([R()],h.PpInlineCode.prototype,"mode",2),h.PpInlineCode=Xe([q("pp-inline-code")],h.PpInlineCode);var Hl=Object.defineProperty,Ul=Object.getOwnPropertyDescriptor,ge=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ul(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Hl(e,r,s),s};h.PpModelPage=class extends I{constructor(){super(...arguments),this.modelJson="",this.name="",this.rawYaml="",this.schemaRawYaml="",this.schemaRawJson="",this.schemaStartLine=1,this.startLine=1,this.location="",this.parsed=null}willUpdate(e){if(e.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}renderConstraints(e){var o,s;const r=[];return e.example!==void 0&&r.push({label:"example",value:JSON.stringify(e.example)}),e.default!==void 0&&r.push({label:"default",value:JSON.stringify(e.default)}),e.minimum!==void 0&&r.push({label:"min",value:e.minimum}),e.maximum!==void 0&&r.push({label:"max",value:e.maximum}),e.exclusiveMinimum!==void 0&&r.push({label:"exclusiveMin",value:e.exclusiveMinimum}),e.exclusiveMaximum!==void 0&&r.push({label:"exclusiveMax",value:e.exclusiveMaximum}),e.minLength!==void 0&&r.push({label:"minLength",value:e.minLength}),e.maxLength!==void 0&&r.push({label:"maxLength",value:e.maxLength}),e.minItems!==void 0&&r.push({label:"minItems",value:e.minItems}),e.maxItems!==void 0&&r.push({label:"maxItems",value:e.maxItems}),e.uniqueItems&&r.push({label:"uniqueItems",value:"true"}),e.pattern&&r.push({label:"pattern",value:e.pattern,isCode:!0}),e.multipleOf!==void 0&&r.push({label:"multipleOf",value:e.multipleOf}),!r.length&&!((o=e.enum)!=null&&o.length)?b:u`
      <div class="constraints">
        ${r.map(i=>u`
          <span class="constraint-label">${i.label}</span>
          <span class="constraint-value">${i.isCode?u`<code>${i.value}</code>`:i.value}</span>
        `)}
        ${(s=e.enum)!=null&&s.length?u`
          <span class="constraint-label">enum</span>
          <span class="constraint-value">${e.enum.map((i,n)=>u`${n>0?", ":""}<span class="enum-value">${JSON.stringify(i)}</span>`)}</span>
        `:b}
      </div>
    `}renderType(e){if(!e)return b;const r=So(e);return r?u`<span class="prop-type">${r}</span>`:b}renderExampleObjects(e){const r=Object.entries(e);return r.length?u`
      <h3>Examples</h3>
      ${r.map(([o,s])=>u`
        <div class="example-object">
          <div class="example-header">
            <span class="prop-name">${o}</span>
            ${s.summary?u`<span class="example-summary">${s.summary}</span>`:b}
          </div>
          ${s.description?u`<div class="prop-desc">${s.description}</div>`:b}
          ${s.value!==void 0?u`<pp-inline-code raw-json=${JSON.stringify(s.value,null,2)} title=${o}></pp-inline-code>`:b}
          ${s.externalValue?u`<div class="example-external"><a href=${s.externalValue}>${s.externalValue}</a></div>`:b}
        </div>
      `)}
    `:b}renderComponentWithSchema(e,r){const o=e.schema||{},s=this.schemaRawJson||JSON.stringify(o,null,2),i=this.schemaRawYaml;return u`
      <div class="traits">
        <h3>Traits</h3>
        <div class="constraints">
          ${r}
          ${o.type?u`
            <span class="constraint-label">type</span>
            <span class="constraint-value">${o.type}${o.format?` (${o.format})`:""}</span>
          `:b}
        </div>
        ${this.renderConstraints(o)}
      </div>
      ${e.examples?this.renderExampleObjects(e.examples):b}
      ${!e.examples&&e.example!==void 0?u`<pp-inline-code raw-json=${JSON.stringify(e.example,null,2)} title="Example"></pp-inline-code>`:b}
      ${Object.keys(o).length?u`<pp-inline-code
            raw-json=${s}
            raw-yaml=${i}
            start-line=${this.schemaStartLine}
            title="Schema"></pp-inline-code>`:b}
    `}renderParameter(e){return this.renderComponentWithSchema(e,u`
      <span class="constraint-label">name</span>
      <span class="constraint-value">${e.name}</span>
      <span class="constraint-label">in</span>
      <span class="constraint-value">${e.in}</span>
      ${e.required!==void 0?u`
        <span class="constraint-label">required</span>
        <span class="constraint-value">${e.required}</span>
      `:b}
      ${e.deprecated?u`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:b}
    `)}renderHeader(e){return this.renderComponentWithSchema(e,u`
      ${e.required?u`
        <span class="constraint-label">required</span>
        <span class="constraint-value">true</span>
      `:b}
      ${e.deprecated?u`
        <span class="constraint-label">deprecated</span>
        <span class="constraint-value">true</span>
      `:b}
    `)}renderSchema(e){const r=e.properties||{},o=new Set(e.required||[]),s=Object.entries(r),i=e.example!==void 0?JSON.stringify(e.example,null,2):"";return u`
      ${e.type?u`<div><strong>Type:</strong> ${e.type}</div>`:b}
      ${s.length?u`
            <h3>Properties</h3>
            ${s.map(([n,a])=>u`
                <div class="property">
                  <span class="prop-name">${n}</span>
                  ${this.renderType(a)}
                  ${o.has(n)?u`<span class="required-badge">required</span>`:b}
                  ${a.description?u`<div class="prop-desc">${a.description}</div>`:b}
                  ${this.renderConstraints(a)}
                </div>
              `)}
          `:b}
      ${i?u`<pp-inline-code raw-json=${i} title="Example"></pp-inline-code>`:b}
      <pp-inline-code
        raw-json=${this.modelJson}
        raw-yaml=${this.rawYaml}
        start-line=${this.startLine}
        location=${this.location}
        title="Schema"></pp-inline-code>
    `}render(){if(!this.parsed)return b;const e=this.parsed;return e.in?this.renderParameter(e):e.schema&&!e.properties&&!e.in?this.renderHeader(e):this.renderSchema(e)}},h.PpModelPage.styles=[_o,Fl],ge([d({attribute:"model-json"})],h.PpModelPage.prototype,"modelJson",2),ge([d()],h.PpModelPage.prototype,"name",2),ge([d({attribute:"raw-yaml"})],h.PpModelPage.prototype,"rawYaml",2),ge([d({attribute:"schema-raw-yaml"})],h.PpModelPage.prototype,"schemaRawYaml",2),ge([d({attribute:"schema-raw-json"})],h.PpModelPage.prototype,"schemaRawJson",2),ge([d({attribute:"schema-start-line",type:Number})],h.PpModelPage.prototype,"schemaStartLine",2),ge([d({attribute:"start-line",type:Number})],h.PpModelPage.prototype,"startLine",2),ge([d()],h.PpModelPage.prototype,"location",2),ge([R()],h.PpModelPage.prototype,"parsed",2),h.PpModelPage=ge([q("pp-model-page")],h.PpModelPage);const Vl=L`
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
`;var Wl=Object.defineProperty,ql=Object.getOwnPropertyDescriptor,gr=(t,e,r,o)=>{for(var s=o>1?void 0:o?ql(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Wl(e,r,s),s};h.PpModelCard=class extends I{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return u`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?u`<p>${this.description}</p>`:""}
      </a>
    `}},h.PpModelCard.styles=Vl,gr([d()],h.PpModelCard.prototype,"name",2),gr([d()],h.PpModelCard.prototype,"href",2),gr([d()],h.PpModelCard.prototype,"description",2),h.PpModelCard=gr([q("pp-model-card")],h.PpModelCard);const Jl=L`
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
`;var Yl=Object.defineProperty,Gl=Object.getOwnPropertyDescriptor,Oo=(t,e,r,o)=>{for(var s=o>1?void 0:o?Gl(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Yl(e,r,s),s};h.PpCrossRefs=class extends I{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(e){if(e.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var o,s,i,n,a,l;const{refs:e}=this;return((o=e.UsedByOperations)==null?void 0:o.length)||((s=e.UsedByModels)==null?void 0:s.length)||((i=e.UsesModels)==null?void 0:i.length)?u`
      ${(n=e.UsedByOperations)!=null&&n.length?u`
            <h3>Used by Operations</h3>
            <ul>
              ${e.UsedByOperations.map(c=>u`
                  <li>
                    <a href="operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:b}
      ${(a=e.UsedByModels)!=null&&a.length?u`
            <h3>Referenced by</h3>
            <ul>
              ${e.UsedByModels.map(c=>u`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:b}
      ${(l=e.UsesModels)!=null&&l.length?u`
            <h3>References</h3>
            <ul>
              ${e.UsesModels.map(c=>u`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:b}
    `:b}},h.PpCrossRefs.styles=Jl,Oo([d({attribute:"refs-json"})],h.PpCrossRefs.prototype,"refsJson",2),Oo([R()],h.PpCrossRefs.prototype,"refs",2),h.PpCrossRefs=Oo([q("pp-cross-refs")],h.PpCrossRefs);const Kl=L`
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
`,Xl=L`
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
`;var Zl=Object.defineProperty,Ql=Object.getOwnPropertyDescriptor,vr=(t,e,r,o)=>{for(var s=o>1?void 0:o?Ql(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&Zl(e,r,s),s};pt.manual=!0,h.PpExampleBlock=class extends I{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(e){if(e.has("exampleJson")&&this.exampleJson)try{const r=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(r,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return b;let e;try{e=pt.highlight(this.formatted,pt.languages.json,"json")}catch{e=this.formatted}return u`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${Ao(e)}</code></pre>
      </details>
    `}},h.PpExampleBlock.styles=[Kl,Xl],vr([d()],h.PpExampleBlock.prototype,"name",2),vr([d({attribute:"example-json"})],h.PpExampleBlock.prototype,"exampleJson",2),vr([R()],h.PpExampleBlock.prototype,"formatted",2),h.PpExampleBlock=vr([q("pp-example-block")],h.PpExampleBlock);const ec=L`
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
`;var tc=Object.defineProperty,rc=Object.getOwnPropertyDescriptor,ce=(t,e,r,o)=>{for(var s=o>1?void 0:o?rc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&tc(e,r,s),s};h.PpExampleDrawer=class extends I{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.copied=!1,this.rawMode=!1,this.highlightLines="",this.startLine=1,this.location="",this.handleShowExample=e=>{const r=e.detail;this.title=r.title,this.json=r.json,this.yaml=r.yaml||"",this.rawMode=r.rawMode??!1,this.highlightLines=r.highlightLines||"",this.startLine=r.startLine??1,this.location=r.location||"";const o=document.body.getAttribute("data-spec-format");o==="yaml"&&r.yaml?this.format="yaml":o==="json"&&r.json?this.format="json":this.format=r.yaml?"yaml":"json",this.updateComplete.then(()=>{const s=this.drawer;s&&(s.updateComplete?s.updateComplete.then(()=>s.show()):s.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get copyText(){var r;const e=(r=this.shadowRoot)==null?void 0:r.querySelector("pp-code-viewer");return e?e.displayCode:this.format==="yaml"&&this.yaml?this.yaml:this.json}async copyToClipboard(){const e=this.copyText;if(e)try{await navigator.clipboard.writeText(e),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}catch{}}render(){const e=this.format==="yaml"&&this.yaml?this.yaml:this.json,r=this.format==="yaml"?"yaml":"json";return u`
      <sl-drawer label=${this.title||"Example"} placement="end">
        ${this.yaml?u`
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
    `}},h.PpExampleDrawer.styles=[ec],ce([R()],h.PpExampleDrawer.prototype,"title",2),ce([R()],h.PpExampleDrawer.prototype,"json",2),ce([R()],h.PpExampleDrawer.prototype,"yaml",2),ce([R()],h.PpExampleDrawer.prototype,"format",2),ce([R()],h.PpExampleDrawer.prototype,"copied",2),ce([R()],h.PpExampleDrawer.prototype,"rawMode",2),ce([R()],h.PpExampleDrawer.prototype,"highlightLines",2),ce([R()],h.PpExampleDrawer.prototype,"startLine",2),ce([R()],h.PpExampleDrawer.prototype,"location",2),ce([U("sl-drawer")],h.PpExampleDrawer.prototype,"drawer",2),h.PpExampleDrawer=ce([q("pp-example-drawer")],h.PpExampleDrawer);var oc=L`
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
`,Y=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=t=>{this.open&&t.key==="Escape"&&(t.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=t=>{var e;if(t.key==="Escape"&&this.open&&!this.closeWatcher){t.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(t.key==="Tab"){if(this.open&&((e=document.activeElement)==null?void 0:e.tagName.toLowerCase())==="sl-menu-item"){t.preventDefault(),this.hide(),this.focusOnTrigger();return}const r=(o,s)=>{if(!o)return null;const i=o.closest(s);if(i)return i;const n=o.getRootNode();return n instanceof ShadowRoot?r(n.host,s):null};setTimeout(()=>{var o;const s=((o=this.containingElement)==null?void 0:o.getRootNode())instanceof ShadowRoot?Ds():document.activeElement;(!this.containingElement||r(s,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=t=>{const e=t.composedPath();this.containingElement&&!e.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=t=>{const e=t.target;!this.stayOpenOnSelect&&e.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){const t=this.trigger.assignedElements({flatten:!0})[0];typeof(t==null?void 0:t.focus)=="function"&&t.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(t){if([" ","Enter"].includes(t.key)){t.preventDefault(),this.handleTriggerClick();return}const e=this.getMenu();if(e){const r=e.getAllItems(),o=r[0],s=r[r.length-1];["ArrowDown","ArrowUp","Home","End"].includes(t.key)&&(t.preventDefault(),this.open||(this.show(),await this.updateComplete),r.length>0&&this.updateComplete.then(()=>{(t.key==="ArrowDown"||t.key==="Home")&&(e.setCurrentItem(o),o.focus()),(t.key==="ArrowUp"||t.key==="End")&&(e.setCurrentItem(s),s.focus())}))}}handleTriggerKeyUp(t){t.key===" "&&t.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){const e=this.trigger.assignedElements({flatten:!0}).find(o=>fa(o).start);let r;if(e){switch(e.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":r=e.button;break;default:r=e}r.setAttribute("aria-haspopup","true"),r.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,at(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,at(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){var t;this.panel.addEventListener("sl-select",this.handlePanelSelect),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){var t;this.panel&&(this.panel.removeEventListener("sl-select",this.handlePanelSelect),this.panel.removeEventListener("keydown",this.handleKeyDown)),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit("sl-show"),this.addOpenListeners(),await Oe(this),this.panel.hidden=!1,this.popup.active=!0;const{keyframes:t,options:e}=$e(this,"dropdown.show",{dir:this.localize.dir()});await xe(this.popup.popup,t,e),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await Oe(this);const{keyframes:t,options:e}=$e(this,"dropdown.hide",{dir:this.localize.dir()});await xe(this.popup.popup,t,e),this.panel.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}render(){return u`
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
        sync=${F(this.sync?this.sync:void 0)}
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
    `}};Y.styles=[se,oc],Y.dependencies={"sl-popup":z},m([U(".dropdown")],Y.prototype,"popup",2),m([U(".dropdown__trigger")],Y.prototype,"trigger",2),m([U(".dropdown__panel")],Y.prototype,"panel",2),m([d({type:Boolean,reflect:!0})],Y.prototype,"open",2),m([d({reflect:!0})],Y.prototype,"placement",2),m([d({type:Boolean,reflect:!0})],Y.prototype,"disabled",2),m([d({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],Y.prototype,"stayOpenOnSelect",2),m([d({attribute:!1})],Y.prototype,"containingElement",2),m([d({type:Number})],Y.prototype,"distance",2),m([d({type:Number})],Y.prototype,"skidding",2),m([d({type:Boolean})],Y.prototype,"hoist",2),m([d({reflect:!0})],Y.prototype,"sync",2),m([G("open",{waitUntilFirstUpdate:!0})],Y.prototype,"handleOpenChange",1),X("dropdown.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}}),X("dropdown.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}}),Y.define("sl-dropdown");var sc=L`
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
`,To=class extends J{connectedCallback(){super.connectedCallback(),this.setAttribute("role","menu")}handleClick(t){const e=["menuitem","menuitemcheckbox"],r=t.composedPath(),o=r.find(a=>{var l;return e.includes(((l=a==null?void 0:a.getAttribute)==null?void 0:l.call(a,"role"))||"")});if(!o||r.find(a=>{var l;return((l=a==null?void 0:a.getAttribute)==null?void 0:l.call(a,"role"))==="menu"})!==this)return;const n=o;n.type==="checkbox"&&(n.checked=!n.checked),this.emit("sl-select",{detail:{item:n}})}handleKeyDown(t){if(t.key==="Enter"||t.key===" "){const e=this.getCurrentItem();t.preventDefault(),t.stopPropagation(),e==null||e.click()}else if(["ArrowDown","ArrowUp","Home","End"].includes(t.key)){const e=this.getAllItems(),r=this.getCurrentItem();let o=r?e.indexOf(r):0;e.length>0&&(t.preventDefault(),t.stopPropagation(),t.key==="ArrowDown"?o++:t.key==="ArrowUp"?o--:t.key==="Home"?o=0:t.key==="End"&&(o=e.length-1),o<0&&(o=e.length-1),o>e.length-1&&(o=0),this.setCurrentItem(e[o]),e[o].focus())}}handleMouseDown(t){const e=t.target;this.isMenuItem(e)&&this.setCurrentItem(e)}handleSlotChange(){const t=this.getAllItems();t.length>0&&this.setCurrentItem(t[0])}isMenuItem(t){var e;return t.tagName.toLowerCase()==="sl-menu-item"||["menuitem","menuitemcheckbox","menuitemradio"].includes((e=t.getAttribute("role"))!=null?e:"")}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(t=>!(t.inert||!this.isMenuItem(t)))}getCurrentItem(){return this.getAllItems().find(t=>t.getAttribute("tabindex")==="0")}setCurrentItem(t){this.getAllItems().forEach(r=>{r.setAttribute("tabindex",r===t?"0":"-1")})}render(){return u`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};To.styles=[se,sc],m([U("slot")],To.prototype,"defaultSlot",2),To.define("sl-menu");var ic=L`
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
 */const Mt=(t,e)=>{var o;const r=t._$AN;if(r===void 0)return!1;for(const s of r)(o=s._$AO)==null||o.call(s,e,!1),Mt(s,e);return!0},br=t=>{let e,r;do{if((e=t._$AM)===void 0)break;r=e._$AN,r.delete(t),t=e}while((r==null?void 0:r.size)===0)},ci=t=>{for(let e;e=t._$AM;t=e){let r=e._$AN;if(r===void 0)e._$AN=r=new Set;else if(r.has(t))break;r.add(t),lc(e)}};function nc(t){this._$AN!==void 0?(br(this),this._$AM=t,ci(this)):this._$AM=t}function ac(t,e=!1,r=0){const o=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(e)if(Array.isArray(o))for(let i=r;i<o.length;i++)Mt(o[i],!1),br(o[i]);else o!=null&&(Mt(o,!1),br(o));else Mt(this,t)}const lc=t=>{t.type==Br.CHILD&&(t._$AP??(t._$AP=ac),t._$AQ??(t._$AQ=nc))};class cc extends Hr{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,r,o){super._$AT(e,r,o),ci(this),this.isConnected=e._$AU}_$AO(e,r=!0){var o,s;e!==this.isConnected&&(this.isConnected=e,e?(o=this.reconnected)==null||o.call(this):(s=this.disconnected)==null||s.call(this)),r&&(Mt(this,e),br(this))}setValue(e){if(an(this._$Ct))this._$Ct._$AI(e,this);else{const r=[...this._$Ct._$AH];r[this._$Ci]=e,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dc=()=>new hc;class hc{}const Lo=new WeakMap,uc=jr(class extends cc{render(t){return b}update(t,[e]){var o;const r=e!==this.G;return r&&this.G!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.G=e,this.ht=(o=t.options)==null?void 0:o.host,this.rt(this.ct=t.element)),b}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let r=Lo.get(e);r===void 0&&(r=new WeakMap,Lo.set(e,r)),r.get(this.G)!==void 0&&this.G.call(this.ht,void 0),r.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){var t,e;return typeof this.G=="function"?(t=Lo.get(this.ht??globalThis))==null?void 0:t.get(this.G):(e=this.G)==null?void 0:e.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var pc=class{constructor(t,e){this.popupRef=dc(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=r=>{this.host.style.setProperty("--safe-triangle-cursor-x",`${r.clientX}px`),this.host.style.setProperty("--safe-triangle-cursor-y",`${r.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test("submenu")&&this.enableSubmenu()},this.handleKeyDown=r=>{switch(r.key){case"Escape":case"Tab":this.disableSubmenu();break;case"ArrowLeft":r.target!==this.host&&(r.preventDefault(),r.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case"ArrowRight":case"Enter":case" ":this.handleSubmenuEntry(r);break}},this.handleClick=r=>{var o;r.target===this.host?(r.preventDefault(),r.stopPropagation()):r.target instanceof Element&&(r.target.tagName==="sl-menu-item"||(o=r.target.role)!=null&&o.startsWith("menuitem"))&&this.disableSubmenu()},this.handleFocusOut=r=>{r.relatedTarget&&r.relatedTarget instanceof Element&&this.host.contains(r.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=r=>{r.stopPropagation()},this.handlePopupReposition=()=>{const r=this.host.renderRoot.querySelector("slot[name='submenu']"),o=r==null?void 0:r.assignedElements({flatten:!0}).filter(c=>c.localName==="sl-menu")[0],s=getComputedStyle(this.host).direction==="rtl";if(!o)return;const{left:i,top:n,width:a,height:l}=o.getBoundingClientRect();this.host.style.setProperty("--safe-triangle-submenu-start-x",`${s?i+a:i}px`),this.host.style.setProperty("--safe-triangle-submenu-start-y",`${n}px`),this.host.style.setProperty("--safe-triangle-submenu-end-x",`${s?i+a:i}px`),this.host.style.setProperty("--safe-triangle-submenu-end-y",`${n+l}px`)},(this.host=t).addController(this),this.hasSlotController=e}hostConnected(){this.hasSlotController.test("submenu")&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test("submenu")&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||(this.host.addEventListener("mousemove",this.handleMouseMove),this.host.addEventListener("mouseover",this.handleMouseOver),this.host.addEventListener("keydown",this.handleKeyDown),this.host.addEventListener("click",this.handleClick),this.host.addEventListener("focusout",this.handleFocusOut),this.isConnected=!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.addEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&(this.host.removeEventListener("mousemove",this.handleMouseMove),this.host.removeEventListener("mouseover",this.handleMouseOver),this.host.removeEventListener("keydown",this.handleKeyDown),this.host.removeEventListener("click",this.handleClick),this.host.removeEventListener("focusout",this.handleFocusOut),this.isConnected=!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener("mouseover",this.handlePopupMouseover),this.popupRef.value.removeEventListener("sl-reposition",this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(t){const e=this.host.renderRoot.querySelector("slot[name='submenu']");if(!e){console.error("Cannot activate a submenu if no corresponding menuitem can be found.",this);return}let r=null;for(const o of e.assignedElements())if(r=o.querySelectorAll("sl-menu-item, [role^='menuitem']"),r.length!==0)break;if(!(!r||r.length===0)){r[0].setAttribute("tabindex","0");for(let o=1;o!==r.length;++o)r[o].setAttribute("tabindex","-1");this.popupRef.value&&(t.preventDefault(),t.stopPropagation(),this.popupRef.value.active?r[0]instanceof HTMLElement&&r[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{r[0]instanceof HTMLElement&&r[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(t){this.popupRef.value&&this.popupRef.value.active!==t&&(this.popupRef.value.active=t,this.host.requestUpdate())}enableSubmenu(t=!0){t?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){var t;if(!((t=this.host.parentElement)!=null&&t.computedStyleMap))return;const e=this.host.parentElement.computedStyleMap(),o=["padding-top","border-top-width","margin-top"].reduce((s,i)=>{var n;const a=(n=e.get(i))!=null?n:new CSSUnitValue(0,"px"),c=(a instanceof CSSUnitValue?a:new CSSUnitValue(0,"px")).to("px");return s-c.value},0);this.skidding=o}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){const t=getComputedStyle(this.host).direction==="rtl";return this.isConnected?u`
      <sl-popup
        ${uc(this.popupRef)}
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
    `:u` <slot name="submenu" hidden></slot> `}},fc=L`
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
`,Ro=class extends J{constructor(){super(...arguments),this.localize=new be(this)}render(){return u`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};Ro.styles=[se,fc];var oe=class extends J{constructor(){super(...arguments),this.localize=new be(this),this.type="normal",this.checked=!1,this.value="",this.loading=!1,this.disabled=!1,this.hasSlotController=new ao(this,"submenu"),this.submenuController=new pc(this,this.hasSlotController),this.handleHostClick=t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())},this.handleMouseOver=t=>{this.focus(),t.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleHostClick),this.addEventListener("mouseover",this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick),this.removeEventListener("mouseover",this.handleMouseOver)}handleDefaultSlotChange(){const t=this.getTextLabel();if(typeof this.cachedTextLabel>"u"){this.cachedTextLabel=t;return}t!==this.cachedTextLabel&&(this.cachedTextLabel=t,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return wa(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test("submenu")}render(){const t=this.localize.dir()==="rtl",e=this.submenuController.isExpanded();return u`
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
        ${this.loading?u` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:""}
      </div>
    `}};oe.styles=[se,ic],oe.dependencies={"sl-icon":ie,"sl-popup":z,"sl-spinner":Ro},m([U("slot:not([name])")],oe.prototype,"defaultSlot",2),m([U(".menu-item")],oe.prototype,"menuItem",2),m([d()],oe.prototype,"type",2),m([d({type:Boolean,reflect:!0})],oe.prototype,"checked",2),m([d()],oe.prototype,"value",2),m([d({type:Boolean,reflect:!0})],oe.prototype,"loading",2),m([d({type:Boolean,reflect:!0})],oe.prototype,"disabled",2),m([G("checked")],oe.prototype,"handleCheckedChange",1),m([G("disabled")],oe.prototype,"handleDisabledChange",1),m([G("type")],oe.prototype,"handleTypeChange",1),oe.define("sl-menu-item");var zt=new WeakMap,Dt=new WeakMap,Nt=new WeakMap,Mo=new WeakSet,yr=new WeakMap,mc=class{constructor(t,e){this.handleFormData=r=>{const o=this.options.disabled(this.host),s=this.options.name(this.host),i=this.options.value(this.host),n=this.host.tagName.toLowerCase()==="sl-button";this.host.isConnected&&!o&&!n&&typeof s=="string"&&s.length>0&&typeof i<"u"&&(Array.isArray(i)?i.forEach(a=>{r.formData.append(s,a.toString())}):r.formData.append(s,i.toString()))},this.handleFormSubmit=r=>{var o;const s=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&((o=zt.get(this.form))==null||o.forEach(n=>{this.setUserInteracted(n,!0)})),this.form&&!this.form.noValidate&&!s&&!i(this.host)&&(r.preventDefault(),r.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),yr.set(this.host,[])},this.handleInteraction=r=>{const o=yr.get(this.host);o.includes(r.type)||o.push(r.type),o.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.checkValidity=="function"&&!o.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const r=this.form.querySelectorAll("*");for(const o of r)if(typeof o.reportValidity=="function"&&!o.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=je({form:r=>{const o=r.form;if(o){const i=r.getRootNode().querySelector(`#${o}`);if(i)return i}return r.closest("form")},name:r=>r.name,value:r=>r.value,defaultValue:r=>r.defaultValue,disabled:r=>{var o;return(o=r.disabled)!=null?o:!1},reportValidity:r=>typeof r.reportValidity=="function"?r.reportValidity():!0,checkValidity:r=>typeof r.checkValidity=="function"?r.checkValidity():!0,setValue:(r,o)=>r.value=o,assumeInteractionOn:["sl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),yr.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),yr.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,zt.has(this.form)?zt.get(this.form).add(this.host):zt.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),Dt.has(this.form)||(Dt.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Nt.has(this.form)||(Nt.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=zt.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),Dt.has(this.form)&&(this.form.reportValidity=Dt.get(this.form),Dt.delete(this.form)),Nt.has(this.form)&&(this.form.checkValidity=Nt.get(this.form),Nt.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Mo.add(t):Mo.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const r=document.createElement("button");r.type=t,r.style.position="absolute",r.style.width="0",r.style.height="0",r.style.clipPath="inset(50%)",r.style.overflow="hidden",r.style.whiteSpace="nowrap",e&&(r.name=e.name,r.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(o=>{e.hasAttribute(o)&&r.setAttribute(o,e.getAttribute(o))})),this.form.append(r),r.click(),r.remove()}}getForm(){var t;return(t=this.form)!=null?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,r=!!Mo.has(e),o=!!e.required;e.toggleAttribute("data-required",o),e.toggleAttribute("data-optional",!o),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&r),e.toggleAttribute("data-user-valid",t&&r)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||t==null||t.preventDefault()}},zo=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(qt(je({},zo),{valid:!1,valueMissing:!0})),Object.freeze(qt(je({},zo),{valid:!1,customError:!0}));var gc=L`
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
`,M=class extends J{constructor(){super(...arguments),this.formControlController=new mc(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new ao(this,"[default]","prefix","suffix"),this.localize=new be(this),this.hasFocus=!1,this.invalid=!1,this.title="",this.variant="default",this.size="medium",this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get validity(){return this.isButton()?this.button.validity:zo}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(){this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?Gt`a`:Gt`button`;return Kt`
      <${e}
        part="base"
        class=${ve({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${F(t?void 0:this.disabled)}
        type=${F(t?void 0:this.type)}
        title=${this.title}
        name=${F(t?void 0:this.name)}
        value=${F(t?void 0:this.value)}
        href=${F(t&&!this.disabled?this.href:void 0)}
        target=${F(t?this.target:void 0)}
        download=${F(t?this.download:void 0)}
        rel=${F(t?this.rel:void 0)}
        role=${F(t?void 0:"button")}
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
        ${this.caret?Kt` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?Kt`<sl-spinner part="spinner"></sl-spinner>`:""}
      </${e}>
    `}};M.styles=[se,gc],M.dependencies={"sl-icon":ie,"sl-spinner":Ro},m([U(".button")],M.prototype,"button",2),m([R()],M.prototype,"hasFocus",2),m([R()],M.prototype,"invalid",2),m([d()],M.prototype,"title",2),m([d({reflect:!0})],M.prototype,"variant",2),m([d({reflect:!0})],M.prototype,"size",2),m([d({type:Boolean,reflect:!0})],M.prototype,"caret",2),m([d({type:Boolean,reflect:!0})],M.prototype,"disabled",2),m([d({type:Boolean,reflect:!0})],M.prototype,"loading",2),m([d({type:Boolean,reflect:!0})],M.prototype,"outline",2),m([d({type:Boolean,reflect:!0})],M.prototype,"pill",2),m([d({type:Boolean,reflect:!0})],M.prototype,"circle",2),m([d()],M.prototype,"type",2),m([d()],M.prototype,"name",2),m([d()],M.prototype,"value",2),m([d()],M.prototype,"href",2),m([d()],M.prototype,"target",2),m([d()],M.prototype,"rel",2),m([d()],M.prototype,"download",2),m([d()],M.prototype,"form",2),m([d({attribute:"formaction"})],M.prototype,"formAction",2),m([d({attribute:"formenctype"})],M.prototype,"formEnctype",2),m([d({attribute:"formmethod"})],M.prototype,"formMethod",2),m([d({attribute:"formnovalidate",type:Boolean})],M.prototype,"formNoValidate",2),m([d({attribute:"formtarget"})],M.prototype,"formTarget",2),m([G("disabled",{waitUntilFirstUpdate:!0})],M.prototype,"handleDisabledChange",1),M.define("sl-button");const vc=L`
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
`;var bc=Object.defineProperty,yc=Object.getOwnPropertyDescriptor,Ft=(t,e,r,o)=>{for(var s=o>1?void 0:o?yc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&bc(e,r,s),s};h.PpExampleSelector=class extends I{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.entries=[]}willUpdate(e){(e.has("examplesData")||e.has("mockJson")||e.has("examplesJson"))&&this.buildEntries()}buildEntries(){const e=[];let r=this.mockJson,o={};if(this.examplesData)try{const s=JSON.parse(this.examplesData);s.mockJson&&(r=s.mockJson),s.examples&&(o=s.examples)}catch{}if(this.examplesJson)try{o={...o,...JSON.parse(this.examplesJson)}}catch{}for(const[s,i]of Object.entries(o))i&&e.push({key:s,json:i});r&&e.push({key:"Generated Example",json:r}),this.entries=e}showExample(e){let r=e.json;try{r=JSON.stringify(JSON.parse(e.json),null,2)}catch{}const o=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:e.key,json:r}});document.dispatchEvent(o)}handleSelect(e){var s,i;const r=(i=(s=e.detail)==null?void 0:s.item)==null?void 0:i.value;if(r===void 0)return;const o=parseInt(r,10);o>=0&&o<this.entries.length&&this.showExample(this.entries[o])}render(){if(!this.entries.length)return b;if(this.entries.length===1){const e=this.entries[0];return u`
        <div class="selector">
          <button @click=${()=>this.showExample(e)}>${e.key}</button>
        </div>
      `}return u`
      <div class="selector">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>View Example...</sl-button>
          <sl-menu @sl-select=${this.handleSelect}>
            ${this.entries.map((e,r)=>u`
              <sl-menu-item value="${r}">${e.key}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `}},h.PpExampleSelector.styles=vc,Ft([d({attribute:"examples-data"})],h.PpExampleSelector.prototype,"examplesData",2),Ft([d({attribute:"mock-json"})],h.PpExampleSelector.prototype,"mockJson",2),Ft([d({attribute:"examples-json"})],h.PpExampleSelector.prototype,"examplesJson",2),Ft([R()],h.PpExampleSelector.prototype,"entries",2),h.PpExampleSelector=Ft([q("pp-example-selector")],h.PpExampleSelector);const wc=L`
  :host { display: inline-block; }
  button {
    cursor: pointer;
    background: none;
    border: 1px dashed var(--hrcolor, #3d3d3d);
    color: var(--font-color-sub1, #a7a7a7);
    font-family: var(--font-stack, monospace);
    font-size: 0.75rem;
    padding: 0.35rem 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.15s, border-color 0.15s;
  }
  button:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    border-color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
`;var $c=Object.defineProperty,xc=Object.getOwnPropertyDescriptor,Ze=(t,e,r,o)=>{for(var s=o>1?void 0:o?xc(e,r):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(s=(o?n(e,r,s):n(s))||s);return o&&s&&$c(e,r,s),s};h.PpRawViewerBtn=class extends I{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml="",this.highlightLines="",this.startLine=1,this.location=""}showRaw(){const e=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0}});document.dispatchEvent(e)}render(){return!this.rawJson&&!this.rawYaml?b:u`<button @click=${this.showRaw}>View Raw</button>`}},h.PpRawViewerBtn.styles=[wc],Ze([d({attribute:"title"})],h.PpRawViewerBtn.prototype,"btnTitle",2),Ze([d({attribute:"raw-json"})],h.PpRawViewerBtn.prototype,"rawJson",2),Ze([d({attribute:"raw-yaml"})],h.PpRawViewerBtn.prototype,"rawYaml",2),Ze([d({attribute:"highlight-lines"})],h.PpRawViewerBtn.prototype,"highlightLines",2),Ze([d({attribute:"start-line",type:Number})],h.PpRawViewerBtn.prototype,"startLine",2),Ze([d()],h.PpRawViewerBtn.prototype,"location",2),h.PpRawViewerBtn=Ze([q("pp-raw-viewer-btn")],h.PpRawViewerBtn),zr("static/shoelace");const _c={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'};return Ui("default",{resolver:t=>{const e=_c[t];return e?`data:image/svg+xml,${encodeURIComponent(e)}`:`static/shoelace/assets/icons/${t}.svg`}}),Object.defineProperty(h,Symbol.toStringTag,{value:"Module"}),h})({});
