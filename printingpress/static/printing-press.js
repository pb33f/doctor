var PrintingPress=(function(f){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ui,Hi;const Pt=globalThis,lr=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,cr=Symbol(),po=new WeakMap;let uo=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==cr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(lr&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=po.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&po.set(r,e))}return e}toString(){return this.cssText}};const qi=t=>new uo(typeof t=="string"?t:t+"",void 0,cr),z=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,i,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new uo(r,t,cr)},Ji=(t,e)=>{if(lr)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const o=document.createElement("style"),i=Pt.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},fo=lr?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return qi(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Yi,defineProperty:Gi,getOwnPropertyDescriptor:Ki,getOwnPropertyNames:Xi,getOwnPropertySymbols:Zi,getPrototypeOf:Qi}=Object,ge=globalThis,go=ge.trustedTypes,es=go?go.emptyScript:"",dr=ge.reactiveElementPolyfillSupport,st=(t,e)=>t,Ct={toAttribute(t,e){switch(e){case Boolean:t=t?es:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},hr=(t,e)=>!Yi(t,e),mo={attribute:!0,type:String,converter:Ct,reflect:!1,useDefault:!1,hasChanged:hr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ge.litPropertyMetadata??(ge.litPropertyMetadata=new WeakMap);let Ie=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=mo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&Gi(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:s}=Ki(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:i,set(n){const a=i==null?void 0:i.call(this);s==null||s.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??mo}static _$Ei(){if(this.hasOwnProperty(st("elementProperties")))return;const e=Qi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(st("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(st("properties"))){const r=this.properties,o=[...Xi(r),...Zi(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(fo(i))}else e!==void 0&&r.push(fo(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(r=>r(this))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ji(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var s;const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const n=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:Ct).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,r){var s,n;const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=o.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:Ct;this._$Em=i;const c=l.fromAttribute(r,a.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(e,r,o,i=!1,s){var n;if(e!==void 0){const a=this.constructor;if(i===!1&&(s=this[e]),o??(o=a.getPropertyOptions(e)),!((o.hasChanged??hr)(s,r)||o.useDefault&&o.reflect&&s===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(a._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach(o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[st("elementProperties")]=new Map,Ie[st("finalized")]=new Map,dr==null||dr({ReactiveElement:Ie}),(ge.reactiveElementVersions??(ge.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=globalThis,vo=t=>t,St=nt.trustedTypes,yo=St?St.createPolicy("lit-html",{createHTML:t=>t}):void 0,bo="$lit$",me=`lit$${Math.random().toFixed(9).slice(2)}$`,wo="?"+me,ts=`<${wo}>`,Pe=document,at=()=>Pe.createComment(""),lt=t=>t===null||typeof t!="object"&&typeof t!="function",pr=Array.isArray,rs=t=>pr(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",ur=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$o=/-->/g,xo=/>/g,Ce=RegExp(`>|${ur}(?:([^\\s"'>=/]+)(${ur}*=${ur}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_o=/'/g,ko=/"/g,Ao=/^(?:script|style|textarea|title)$/i,os=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),x=os(1),ve=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Po=new WeakMap,Se=Pe.createTreeWalker(Pe,129);function Co(t,e){if(!pr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return yo!==void 0?yo.createHTML(e):e}const is=(t,e)=>{const r=t.length-1,o=[];let i,s=e===2?"<svg>":e===3?"<math>":"",n=ct;for(let a=0;a<r;a++){const l=t[a];let c,p,u=-1,w=0;for(;w<l.length&&(n.lastIndex=w,p=n.exec(l),p!==null);)w=n.lastIndex,n===ct?p[1]==="!--"?n=$o:p[1]!==void 0?n=xo:p[2]!==void 0?(Ao.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=Ce):p[3]!==void 0&&(n=Ce):n===Ce?p[0]===">"?(n=i??ct,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?Ce:p[3]==='"'?ko:_o):n===ko||n===_o?n=Ce:n===$o||n===xo?n=ct:(n=Ce,i=void 0);const v=n===Ce&&t[a+1].startsWith("/>")?" ":"";s+=n===ct?l+ts:u>=0?(o.push(c),l.slice(0,u)+bo+l.slice(u)+me+v):l+me+(u===-2?a:v)}return[Co(t,s+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};let fr=class Vi{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let s=0,n=0;const a=e.length-1,l=this.parts,[c,p]=is(e,r);if(this.el=Vi.createElement(c,o),Se.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Se.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(bo)){const w=p[n++],v=i.getAttribute(u).split(me),_=/([.?@])?(.*)/.exec(w);l.push({type:1,index:s,name:_[2],strings:v,ctor:_[1]==="."?ns:_[1]==="?"?as:_[1]==="@"?ls:Et}),i.removeAttribute(u)}else u.startsWith(me)&&(l.push({type:6,index:s}),i.removeAttribute(u));if(Ao.test(i.tagName)){const u=i.textContent.split(me),w=u.length-1;if(w>0){i.textContent=St?St.emptyScript:"";for(let v=0;v<w;v++)i.append(u[v],at()),Se.nextNode(),l.push({type:2,index:++s});i.append(u[w],at())}}}else if(i.nodeType===8)if(i.data===wo)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(me,u+1))!==-1;)l.push({type:7,index:s}),u+=me.length-1}s++}}static createElement(e,r){const o=Pe.createElement("template");return o.innerHTML=e,o}};function Ve(t,e,r=t,o){var n,a;if(e===ve)return e;let i=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const s=lt(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(e=Ve(t,i._$AS(t,e.values),i,o)),e}let ss=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=((e==null?void 0:e.creationScope)??Pe).importNode(r,!0);Se.currentNode=i;let s=Se.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new gr(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new cs(s,this,e)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(s=Se.nextNode(),n++)}return Se.currentNode=Pe,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}},gr=class Wi{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=Ve(this,e,r),lt(e)?e===A||e==null||e===""?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==ve&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):rs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&lt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Pe.createTextNode(e)),this._$AH=e}$(e){var s;const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=fr.createElement(Co(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(r);else{const n=new ss(i,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=Po.get(e.strings);return r===void 0&&Po.set(e.strings,r=new fr(e)),r}k(e){pr(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of e)i===r.length?r.push(o=new Wi(this.O(at()),this.O(at()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const i=vo(e).nextSibling;vo(e).remove(),e=i}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}},Et=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,s){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=A}_$AI(e,r=this,o,i){const s=this.strings;let n=!1;if(s===void 0)e=Ve(this,e,r,0),n=!lt(e)||e!==this._$AH&&e!==ve,n&&(this._$AH=e);else{const a=e;let l,c;for(e=s[0],l=0;l<s.length-1;l++)c=Ve(this,a[o+l],r,l),c===ve&&(c=this._$AH[l]),n||(n=!lt(c)||c!==this._$AH[l]),c===A?e=A:e!==A&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ns=class extends Et{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}},as=class extends Et{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}},ls=class extends Et{constructor(e,r,o,i,s){super(e,r,o,i,s),this.type=5}_$AI(e,r=this){if((e=Ve(this,e,r,0)??A)===ve)return;const o=this._$AH,i=e===A&&o!==A||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==A&&(o===A||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}};class cs{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){Ve(this,e)}}const mr=nt.litHtmlPolyfillSupport;mr==null||mr(fr,gr),(nt.litHtmlVersions??(nt.litHtmlVersions=[])).push("3.3.2");const ds=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let i=o._$litPart$;if(i===void 0){const s=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new gr(e.insertBefore(at(),s),s,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=globalThis;let N=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ds(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return ve}};N._$litElement$=!0,N.finalized=!0,(Ui=Ee.litElementHydrateSupport)==null||Ui.call(Ee,{LitElement:N});const vr=Ee.litElementPolyfillSupport;vr==null||vr({LitElement:N}),(Ee.litElementVersions??(Ee.litElementVersions=[])).push("4.2.2");var hs=z`
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
`,ps=z`
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
`,yr="";function br(t){yr=t}function us(t=""){if(!yr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)br(r.getAttribute("data-shoelace"));else{const o=e.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";o&&(i=o.getAttribute("src")),br(i.split("/").slice(0,-1).join("/"))}}return yr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var fs={name:"default",resolver:t=>us(`assets/icons/${t}.svg`)},gs=fs,So={caret:`
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
  `},ms={name:"system",resolver:t=>t in So?`data:image/svg+xml,${encodeURIComponent(So[t])}`:""},vs=ms,Ot=[gs,vs],Tt=[];function ys(t){Tt.push(t)}function bs(t){Tt=Tt.filter(e=>e!==t)}function Eo(t){return Ot.find(e=>e.name===t)}function ws(t,e){$s(t),Ot.push({name:t,resolver:e.resolver,mutator:e.mutator,spriteSheet:e.spriteSheet}),Tt.forEach(r=>{r.library===t&&r.setIcon()})}function $s(t){Ot=Ot.filter(e=>e.name!==t)}var xs=z`
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
`,Oo=Object.defineProperty,_s=Object.defineProperties,ks=Object.getOwnPropertyDescriptor,As=Object.getOwnPropertyDescriptors,To=Object.getOwnPropertySymbols,Ps=Object.prototype.hasOwnProperty,Cs=Object.prototype.propertyIsEnumerable,wr=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),$r=t=>{throw TypeError(t)},Lo=(t,e,r)=>e in t?Oo(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Lt=(t,e)=>{for(var r in e||(e={}))Ps.call(e,r)&&Lo(t,r,e[r]);if(To)for(var r of To(e))Cs.call(e,r)&&Lo(t,r,e[r]);return t},Ro=(t,e)=>_s(t,As(e)),$=(t,e,r,o)=>{for(var i=o>1?void 0:o?ks(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Oo(e,r,i),i},Mo=(t,e,r)=>e.has(t)||$r("Cannot "+r),Ss=(t,e,r)=>(Mo(t,e,"read from private field"),e.get(t)),Es=(t,e,r)=>e.has(t)?$r("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Os=(t,e,r,o)=>(Mo(t,e,"write to private field"),e.set(t,r),r),Ts=function(t,e){this[0]=t,this[1]=e},Ls=t=>{var e=t[wr("asyncIterator")],r=!1,o,i={};return e==null?(e=t[wr("iterator")](),o=s=>i[s]=n=>e[s](n)):(e=e.call(t),o=s=>i[s]=n=>{if(r){if(r=!1,s==="throw")throw n;return n}return r=!0,{done:!1,value:new Ts(new Promise(a=>{var l=e[s](n);l instanceof Object||$r("Object expected"),a(l)}),1)}}),i[wr("iterator")]=()=>i,o("next"),"throw"in e?o("throw"):i.throw=s=>{throw s},"return"in e&&o("return"),i};function ne(t,e){const r=Lt({waitUntilFirstUpdate:!1},e);return(o,i)=>{const{update:s}=o,n=Array.isArray(t)?t:[t];o.update=function(a){n.forEach(l=>{const c=l;if(a.has(c)){const p=a.get(c),u=this[c];p!==u&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[i](p,u)}}),s.call(this,a)}}}var Oe=z`
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
 */const I=t=>(e,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rs={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:hr},Ms=(t=Rs,e,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t,!0,a)}}throw Error("Unsupported decorator location: "+o)};function m(t){return(e,r)=>typeof r=="object"?Ms(t,e,r):((o,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),n?Object.getOwnPropertyDescriptor(i,s):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function R(t){return m({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zs=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Z(t,e){return(r,o,i)=>{const s=n=>{var a;return((a=n.renderRoot)==null?void 0:a.querySelector(t))??null};return zs(r,o,{get(){return s(this)}})}}var Rt,Q=class extends N{constructor(){super(),Es(this,Rt,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Lt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let i=" (unknown version)",s=i;"version"in e&&e.version&&(i=" v"+e.version),"version"in o&&o.version&&(s=" v"+o.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${t}>${i}, but <${t}>${s} has already been registered.`)}attributeChangedCallback(t,e,r){Ss(this,Rt)||(this.constructor.elementProperties.forEach((o,i)=>{o.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Os(this,Rt,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Rt=new WeakMap,Q.version="2.20.1",Q.dependencies={},$([m()],Q.prototype,"dir",2),$([m()],Q.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ds=(t,e)=>(t==null?void 0:t._$litType$)!==void 0;var dt=Symbol(),Mt=Symbol(),xr,_r=new Map,ae=class extends Q{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e!=null&&e.spriteSheet)return this.svg=x`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?dt:Mt}catch{return Mt}try{const i=document.createElement("div");i.innerHTML=await o.text();const s=i.firstElementChild;if(((r=s==null?void 0:s.tagName)==null?void 0:r.toLowerCase())!=="svg")return dt;xr||(xr=new DOMParser);const a=xr.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return a?(a.part.add("svg"),document.adoptNode(a)):dt}catch{return dt}}connectedCallback(){super.connectedCallback(),ys(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),bs(this)}getIconSource(){const t=Eo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?Eo(this.library):void 0;if(!e){this.svg=null;return}let i=_r.get(e);if(i||(i=this.resolveIcon(e,o),_r.set(e,i)),!this.initialRender)return;const s=await i;if(s===Mt&&_r.delete(e),e===this.getIconSource().url){if(Ds(s)){if(this.svg=s,o){await this.updateComplete;const n=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&n&&o.mutator(n)}return}switch(s){case Mt:case dt:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(t=o==null?void 0:o.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};ae.styles=[Oe,xs],$([R()],ae.prototype,"svg",2),$([m({reflect:!0})],ae.prototype,"name",2),$([m()],ae.prototype,"src",2),$([m()],ae.prototype,"label",2),$([m({reflect:!0})],ae.prototype,"library",2),$([ne("label")],ae.prototype,"handleLabelChange",1),$([ne(["name","src","library"])],ae.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zo={ATTRIBUTE:1,CHILD:2},Do=t=>(...e)=>({_$litDirective$:t,values:e});let No=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const We=Do(class extends No{constructor(t){var e;if(super(t),t.type!==zo.ATTRIBUTE||t.name!=="class"||((e=t.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var o,i;if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in e)e[s]&&!((o=this.nt)!=null&&o.has(s))&&this.st.add(s);return this.render(e)}const r=t.element.classList;for(const s of this.st)s in e||(r.remove(s),this.st.delete(s));for(const s in e){const n=!!e[s];n===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(n?(r.add(s),this.st.add(s)):(r.remove(s),this.st.delete(s)))}return ve}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fo=Symbol.for(""),Ns=t=>{if((t==null?void 0:t.r)===Fo)return t==null?void 0:t._$litStatic$},jo=(t,...e)=>({_$litStatic$:e.reduce((r,o,i)=>r+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[i+1],t[0]),r:Fo}),Bo=new Map,Fs=t=>(e,...r)=>{const o=r.length;let i,s;const n=[],a=[];let l,c=0,p=!1;for(;c<o;){for(l=e[c];c<o&&(s=r[c],(i=Ns(s))!==void 0);)l+=i+e[++c],p=!0;c!==o&&a.push(s),n.push(l),c++}if(c===o&&n.push(e[o]),p){const u=n.join("$$lit$$");(e=Bo.get(u))===void 0&&(n.raw=n,Bo.set(u,e=n)),r=a}return t(e,...r)},js=Fs(x);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=t=>t??A;var V=class extends Q{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?jo`a`:jo`button`;return js`
      <${e}
        part="base"
        class=${We({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${q(t?void 0:this.disabled)}
        type=${q(t?void 0:"button")}
        href=${q(t?this.href:void 0)}
        target=${q(t?this.target:void 0)}
        download=${q(t?this.download:void 0)}
        rel=${q(t&&this.target?"noreferrer noopener":void 0)}
        role=${q(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${q(this.name)}
          library=${q(this.library)}
          src=${q(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};V.styles=[Oe,ps],V.dependencies={"sl-icon":ae},$([Z(".icon-button")],V.prototype,"button",2),$([R()],V.prototype,"hasFocus",2),$([m()],V.prototype,"name",2),$([m()],V.prototype,"library",2),$([m()],V.prototype,"src",2),$([m()],V.prototype,"href",2),$([m()],V.prototype,"target",2),$([m()],V.prototype,"download",2),$([m()],V.prototype,"label",2),$([m({type:Boolean,reflect:!0})],V.prototype,"disabled",2);const kr=new Set,qe=new Map;let Te,Ar="ltr",Pr="en";const Uo=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(Uo){const t=new MutationObserver(Io);Ar=document.documentElement.dir||"ltr",Pr=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Ho(...t){t.map(e=>{const r=e.$code.toLowerCase();qe.has(r)?qe.set(r,Object.assign(Object.assign({},qe.get(r)),e)):qe.set(r,e),Te||(Te=e)}),Io()}function Io(){Uo&&(Ar=document.documentElement.dir||"ltr",Pr=document.documentElement.lang||navigator.language),[...kr.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let Bs=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){kr.add(this.host)}hostDisconnected(){kr.delete(this.host)}dir(){return`${this.host.dir||Ar}`.toLowerCase()}lang(){return`${this.host.lang||Pr}`.toLowerCase()}getTranslationData(e){var r,o;const i=new Intl.Locale(e.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),n=(o=(r=i==null?void 0:i.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",a=qe.get(`${s}-${n}`),l=qe.get(s);return{locale:i,language:s,region:n,primary:a,secondary:l}}exists(e,r){var o;const{primary:i,secondary:s}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(i&&i[e]||s&&s[e]||r.includeFallback&&Te&&Te[e])}term(e,...r){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let s;if(o&&o[e])s=o[e];else if(i&&i[e])s=i[e];else if(Te&&Te[e])s=Te[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof s=="function"?s(...r):s}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Vo={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Ho(Vo);var Us=Vo,ht=class extends Bs{};Ho(Us);var Le=class extends Q{constructor(){super(...arguments),this.localize=new ht(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return x`
      <span
        part="base"
        class=${We({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?x`
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
    `}};Le.styles=[Oe,hs],Le.dependencies={"sl-icon-button":V},$([m({reflect:!0})],Le.prototype,"variant",2),$([m({reflect:!0})],Le.prototype,"size",2),$([m({type:Boolean,reflect:!0})],Le.prototype,"pill",2),$([m({type:Boolean})],Le.prototype,"removable",2),Le.define("sl-tag"),V.define("sl-icon-button");var Hs=z`
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
`,Is=z`
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
`;const ye=Math.min,J=Math.max,zt=Math.round,Dt=Math.floor,le=t=>({x:t,y:t}),Vs={left:"right",right:"left",bottom:"top",top:"bottom"};function Cr(t,e,r){return J(t,ye(e,r))}function Je(t,e){return typeof t=="function"?t(e):t}function be(t){return t.split("-")[0]}function Ye(t){return t.split("-")[1]}function Wo(t){return t==="x"?"y":"x"}function Sr(t){return t==="y"?"height":"width"}function he(t){const e=t[0];return e==="t"||e==="b"?"y":"x"}function Er(t){return Wo(he(t))}function Ws(t,e,r){r===void 0&&(r=!1);const o=Ye(t),i=Er(t),s=Sr(i);let n=i==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[s]>e.floating[s]&&(n=Nt(n)),[n,Nt(n)]}function qs(t){const e=Nt(t);return[Or(t),e,Or(e)]}function Or(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}const qo=["left","right"],Jo=["right","left"],Js=["top","bottom"],Ys=["bottom","top"];function Gs(t,e,r){switch(t){case"top":case"bottom":return r?e?Jo:qo:e?qo:Jo;case"left":case"right":return e?Js:Ys;default:return[]}}function Ks(t,e,r,o){const i=Ye(t);let s=Gs(be(t),r==="start",o);return i&&(s=s.map(n=>n+"-"+i),e&&(s=s.concat(s.map(Or)))),s}function Nt(t){const e=be(t);return Vs[e]+t.slice(e.length)}function Xs(t){return{top:0,right:0,bottom:0,left:0,...t}}function Yo(t){return typeof t!="number"?Xs(t):{top:t,right:t,bottom:t,left:t}}function Ft(t){const{x:e,y:r,width:o,height:i}=t;return{width:o,height:i,top:r,left:e,right:e+o,bottom:r+i,x:e,y:r}}function Go(t,e,r){let{reference:o,floating:i}=t;const s=he(e),n=Er(e),a=Sr(n),l=be(e),c=s==="y",p=o.x+o.width/2-i.width/2,u=o.y+o.height/2-i.height/2,w=o[a]/2-i[a]/2;let v;switch(l){case"top":v={x:p,y:o.y-i.height};break;case"bottom":v={x:p,y:o.y+o.height};break;case"right":v={x:o.x+o.width,y:u};break;case"left":v={x:o.x-i.width,y:u};break;default:v={x:o.x,y:o.y}}switch(Ye(e)){case"start":v[n]-=w*(r&&c?-1:1);break;case"end":v[n]+=w*(r&&c?-1:1);break}return v}async function Zs(t,e){var r;e===void 0&&(e={});const{x:o,y:i,platform:s,rects:n,elements:a,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:p="viewport",elementContext:u="floating",altBoundary:w=!1,padding:v=0}=Je(e,t),_=Yo(v),S=a[w?u==="floating"?"reference":"floating":u],E=Ft(await s.getClippingRect({element:(r=await(s.isElement==null?void 0:s.isElement(S)))==null||r?S:S.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(a.floating)),boundary:c,rootBoundary:p,strategy:l})),h=u==="floating"?{x:o,y:i,width:n.floating.width,height:n.floating.height}:n.reference,d=await(s.getOffsetParent==null?void 0:s.getOffsetParent(a.floating)),g=await(s.isElement==null?void 0:s.isElement(d))?await(s.getScale==null?void 0:s.getScale(d))||{x:1,y:1}:{x:1,y:1},b=Ft(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:h,offsetParent:d,strategy:l}):h);return{top:(E.top-b.top+_.top)/g.y,bottom:(b.bottom-E.bottom+_.bottom)/g.y,left:(E.left-b.left+_.left)/g.x,right:(b.right-E.right+_.right)/g.x}}const Qs=50,en=async(t,e,r)=>{const{placement:o="bottom",strategy:i="absolute",middleware:s=[],platform:n}=r,a=n.detectOverflow?n:{...n,detectOverflow:Zs},l=await(n.isRTL==null?void 0:n.isRTL(e));let c=await n.getElementRects({reference:t,floating:e,strategy:i}),{x:p,y:u}=Go(c,o,l),w=o,v=0;const _={};for(let C=0;C<s.length;C++){const S=s[C];if(!S)continue;const{name:E,fn:h}=S,{x:d,y:g,data:b,reset:y}=await h({x:p,y:u,initialPlacement:o,placement:w,strategy:i,middlewareData:_,rects:c,platform:a,elements:{reference:t,floating:e}});p=d??p,u=g??u,_[E]={..._[E],...b},y&&v<Qs&&(v++,typeof y=="object"&&(y.placement&&(w=y.placement),y.rects&&(c=y.rects===!0?await n.getElementRects({reference:t,floating:e,strategy:i}):y.rects),{x:p,y:u}=Go(c,w,l)),C=-1)}return{x:p,y:u,placement:w,strategy:i,middlewareData:_}},tn=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:i,rects:s,platform:n,elements:a,middlewareData:l}=e,{element:c,padding:p=0}=Je(t,e)||{};if(c==null)return{};const u=Yo(p),w={x:r,y:o},v=Er(i),_=Sr(v),C=await n.getDimensions(c),S=v==="y",E=S?"top":"left",h=S?"bottom":"right",d=S?"clientHeight":"clientWidth",g=s.reference[_]+s.reference[v]-w[v]-s.floating[_],b=w[v]-s.reference[v],y=await(n.getOffsetParent==null?void 0:n.getOffsetParent(c));let k=y?y[d]:0;(!k||!await(n.isElement==null?void 0:n.isElement(y)))&&(k=a.floating[d]||s.floating[_]);const O=g/2-b/2,P=k/2-C[_]/2-1,T=ye(u[E],P),D=ye(u[h],P),F=T,oe=k-C[_]-D,U=k/2-C[_]/2+O,fe=Cr(F,U,oe),ie=!l.arrow&&Ye(i)!=null&&U!==fe&&s.reference[_]/2-(U<F?T:D)-C[_]/2<0,W=ie?U<F?U-F:U-oe:0;return{[v]:w[v]+W,data:{[v]:fe,centerOffset:U-fe-W,...ie&&{alignmentOffset:W}},reset:ie}}}),rn=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:i,middlewareData:s,rects:n,initialPlacement:a,platform:l,elements:c}=e,{mainAxis:p=!0,crossAxis:u=!0,fallbackPlacements:w,fallbackStrategy:v="bestFit",fallbackAxisSideDirection:_="none",flipAlignment:C=!0,...S}=Je(t,e);if((r=s.arrow)!=null&&r.alignmentOffset)return{};const E=be(i),h=he(a),d=be(a)===a,g=await(l.isRTL==null?void 0:l.isRTL(c.floating)),b=w||(d||!C?[Nt(a)]:qs(a)),y=_!=="none";!w&&y&&b.push(...Ks(a,C,_,g));const k=[a,...b],O=await l.detectOverflow(e,S),P=[];let T=((o=s.flip)==null?void 0:o.overflows)||[];if(p&&P.push(O[E]),u){const U=Ws(i,n,g);P.push(O[U[0]],O[U[1]])}if(T=[...T,{placement:i,overflows:P}],!P.every(U=>U<=0)){var D,F;const U=(((D=s.flip)==null?void 0:D.index)||0)+1,fe=k[U];if(fe&&(!(u==="alignment"?h!==he(fe):!1)||T.every(L=>he(L.placement)===h?L.overflows[0]>0:!0)))return{data:{index:U,overflows:T},reset:{placement:fe}};let ie=(F=T.filter(W=>W.overflows[0]<=0).sort((W,L)=>W.overflows[1]-L.overflows[1])[0])==null?void 0:F.placement;if(!ie)switch(v){case"bestFit":{var oe;const W=(oe=T.filter(L=>{if(y){const j=he(L.placement);return j===h||j==="y"}return!0}).map(L=>[L.placement,L.overflows.filter(j=>j>0).reduce((j,ke)=>j+ke,0)]).sort((L,j)=>L[1]-j[1])[0])==null?void 0:oe[0];W&&(ie=W);break}case"initialPlacement":ie=a;break}if(i!==ie)return{reset:{placement:ie}}}return{}}}},on=new Set(["left","top"]);async function sn(t,e){const{placement:r,platform:o,elements:i}=t,s=await(o.isRTL==null?void 0:o.isRTL(i.floating)),n=be(r),a=Ye(r),l=he(r)==="y",c=on.has(n)?-1:1,p=s&&l?-1:1,u=Je(e,t);let{mainAxis:w,crossAxis:v,alignmentAxis:_}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return a&&typeof _=="number"&&(v=a==="end"?_*-1:_),l?{x:v*p,y:w*c}:{x:w*c,y:v*p}}const nn=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:i,y:s,placement:n,middlewareData:a}=e,l=await sn(e,t);return n===((r=a.offset)==null?void 0:r.placement)&&(o=a.arrow)!=null&&o.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:n}}}}},an=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:i,platform:s}=e,{mainAxis:n=!0,crossAxis:a=!1,limiter:l={fn:E=>{let{x:h,y:d}=E;return{x:h,y:d}}},...c}=Je(t,e),p={x:r,y:o},u=await s.detectOverflow(e,c),w=he(be(i)),v=Wo(w);let _=p[v],C=p[w];if(n){const E=v==="y"?"top":"left",h=v==="y"?"bottom":"right",d=_+u[E],g=_-u[h];_=Cr(d,_,g)}if(a){const E=w==="y"?"top":"left",h=w==="y"?"bottom":"right",d=C+u[E],g=C-u[h];C=Cr(d,C,g)}const S=l.fn({...e,[v]:_,[w]:C});return{...S,data:{x:S.x-r,y:S.y-o,enabled:{[v]:n,[w]:a}}}}}},ln=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:i,rects:s,platform:n,elements:a}=e,{apply:l=()=>{},...c}=Je(t,e),p=await n.detectOverflow(e,c),u=be(i),w=Ye(i),v=he(i)==="y",{width:_,height:C}=s.floating;let S,E;u==="top"||u==="bottom"?(S=u,E=w===(await(n.isRTL==null?void 0:n.isRTL(a.floating))?"start":"end")?"left":"right"):(E=u,S=w==="end"?"top":"bottom");const h=C-p.top-p.bottom,d=_-p.left-p.right,g=ye(C-p[S],h),b=ye(_-p[E],d),y=!e.middlewareData.shift;let k=g,O=b;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(O=d),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(k=h),y&&!w){const T=J(p.left,0),D=J(p.right,0),F=J(p.top,0),oe=J(p.bottom,0);v?O=_-2*(T!==0||D!==0?T+D:J(p.left,p.right)):k=C-2*(F!==0||oe!==0?F+oe:J(p.top,p.bottom))}await l({...e,availableWidth:O,availableHeight:k});const P=await n.getDimensions(a.floating);return _!==P.width||C!==P.height?{reset:{rects:!0}}:{}}}};function jt(){return typeof window<"u"}function Ge(t){return Ko(t)?(t.nodeName||"").toLowerCase():"#document"}function Y(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function ce(t){var e;return(e=(Ko(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Ko(t){return jt()?t instanceof Node||t instanceof Y(t).Node:!1}function ee(t){return jt()?t instanceof Element||t instanceof Y(t).Element:!1}function pe(t){return jt()?t instanceof HTMLElement||t instanceof Y(t).HTMLElement:!1}function Xo(t){return!jt()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof Y(t).ShadowRoot}function pt(t){const{overflow:e,overflowX:r,overflowY:o,display:i}=te(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&i!=="inline"&&i!=="contents"}function cn(t){return/^(table|td|th)$/.test(Ge(t))}function Bt(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}const dn=/transform|translate|scale|rotate|perspective|filter/,hn=/paint|layout|strict|content/,Re=t=>!!t&&t!=="none";let Tr;function Ut(t){const e=ee(t)?te(t):t;return Re(e.transform)||Re(e.translate)||Re(e.scale)||Re(e.rotate)||Re(e.perspective)||!Lr()&&(Re(e.backdropFilter)||Re(e.filter))||dn.test(e.willChange||"")||hn.test(e.contain||"")}function pn(t){let e=we(t);for(;pe(e)&&!Ke(e);){if(Ut(e))return e;if(Bt(e))return null;e=we(e)}return null}function Lr(){return Tr==null&&(Tr=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Tr}function Ke(t){return/^(html|body|#document)$/.test(Ge(t))}function te(t){return Y(t).getComputedStyle(t)}function Ht(t){return ee(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function we(t){if(Ge(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Xo(t)&&t.host||ce(t);return Xo(e)?e.host:e}function Zo(t){const e=we(t);return Ke(e)?t.ownerDocument?t.ownerDocument.body:t.body:pe(e)&&pt(e)?e:Zo(e)}function ut(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const i=Zo(t),s=i===((o=t.ownerDocument)==null?void 0:o.body),n=Y(i);if(s){const a=Rr(n);return e.concat(n,n.visualViewport||[],pt(i)?i:[],a&&r?ut(a):[])}else return e.concat(i,ut(i,[],r))}function Rr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Qo(t){const e=te(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const i=pe(t),s=i?t.offsetWidth:r,n=i?t.offsetHeight:o,a=zt(r)!==s||zt(o)!==n;return a&&(r=s,o=n),{width:r,height:o,$:a}}function Mr(t){return ee(t)?t:t.contextElement}function Xe(t){const e=Mr(t);if(!pe(e))return le(1);const r=e.getBoundingClientRect(),{width:o,height:i,$:s}=Qo(e);let n=(s?zt(r.width):r.width)/o,a=(s?zt(r.height):r.height)/i;return(!n||!Number.isFinite(n))&&(n=1),(!a||!Number.isFinite(a))&&(a=1),{x:n,y:a}}const un=le(0);function ei(t){const e=Y(t);return!Lr()||!e.visualViewport?un:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function fn(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==Y(t)?!1:e}function Me(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const i=t.getBoundingClientRect(),s=Mr(t);let n=le(1);e&&(o?ee(o)&&(n=Xe(o)):n=Xe(t));const a=fn(s,r,o)?ei(s):le(0);let l=(i.left+a.x)/n.x,c=(i.top+a.y)/n.y,p=i.width/n.x,u=i.height/n.y;if(s){const w=Y(s),v=o&&ee(o)?Y(o):o;let _=w,C=Rr(_);for(;C&&o&&v!==_;){const S=Xe(C),E=C.getBoundingClientRect(),h=te(C),d=E.left+(C.clientLeft+parseFloat(h.paddingLeft))*S.x,g=E.top+(C.clientTop+parseFloat(h.paddingTop))*S.y;l*=S.x,c*=S.y,p*=S.x,u*=S.y,l+=d,c+=g,_=Y(C),C=Rr(_)}}return Ft({width:p,height:u,x:l,y:c})}function It(t,e){const r=Ht(t).scrollLeft;return e?e.left+r:Me(ce(t)).left+r}function ti(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-It(t,r),i=r.top+e.scrollTop;return{x:o,y:i}}function gn(t){let{elements:e,rect:r,offsetParent:o,strategy:i}=t;const s=i==="fixed",n=ce(o),a=e?Bt(e.floating):!1;if(o===n||a&&s)return r;let l={scrollLeft:0,scrollTop:0},c=le(1);const p=le(0),u=pe(o);if((u||!u&&!s)&&((Ge(o)!=="body"||pt(n))&&(l=Ht(o)),u)){const v=Me(o);c=Xe(o),p.x=v.x+o.clientLeft,p.y=v.y+o.clientTop}const w=n&&!u&&!s?ti(n,l):le(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+p.x+w.x,y:r.y*c.y-l.scrollTop*c.y+p.y+w.y}}function mn(t){return Array.from(t.getClientRects())}function vn(t){const e=ce(t),r=Ht(t),o=t.ownerDocument.body,i=J(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),s=J(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let n=-r.scrollLeft+It(t);const a=-r.scrollTop;return te(o).direction==="rtl"&&(n+=J(e.clientWidth,o.clientWidth)-i),{width:i,height:s,x:n,y:a}}const ri=25;function yn(t,e){const r=Y(t),o=ce(t),i=r.visualViewport;let s=o.clientWidth,n=o.clientHeight,a=0,l=0;if(i){s=i.width,n=i.height;const p=Lr();(!p||p&&e==="fixed")&&(a=i.offsetLeft,l=i.offsetTop)}const c=It(o);if(c<=0){const p=o.ownerDocument,u=p.body,w=getComputedStyle(u),v=p.compatMode==="CSS1Compat"&&parseFloat(w.marginLeft)+parseFloat(w.marginRight)||0,_=Math.abs(o.clientWidth-u.clientWidth-v);_<=ri&&(s-=_)}else c<=ri&&(s+=c);return{width:s,height:n,x:a,y:l}}function bn(t,e){const r=Me(t,!0,e==="fixed"),o=r.top+t.clientTop,i=r.left+t.clientLeft,s=pe(t)?Xe(t):le(1),n=t.clientWidth*s.x,a=t.clientHeight*s.y,l=i*s.x,c=o*s.y;return{width:n,height:a,x:l,y:c}}function oi(t,e,r){let o;if(e==="viewport")o=yn(t,r);else if(e==="document")o=vn(ce(t));else if(ee(e))o=bn(e,r);else{const i=ei(t);o={x:e.x-i.x,y:e.y-i.y,width:e.width,height:e.height}}return Ft(o)}function ii(t,e){const r=we(t);return r===e||!ee(r)||Ke(r)?!1:te(r).position==="fixed"||ii(r,e)}function wn(t,e){const r=e.get(t);if(r)return r;let o=ut(t,[],!1).filter(a=>ee(a)&&Ge(a)!=="body"),i=null;const s=te(t).position==="fixed";let n=s?we(t):t;for(;ee(n)&&!Ke(n);){const a=te(n),l=Ut(n);!l&&a.position==="fixed"&&(i=null),(s?!l&&!i:!l&&a.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||pt(n)&&!l&&ii(t,n))?o=o.filter(p=>p!==n):i=a,n=we(n)}return e.set(t,o),o}function $n(t){let{element:e,boundary:r,rootBoundary:o,strategy:i}=t;const n=[...r==="clippingAncestors"?Bt(e)?[]:wn(e,this._c):[].concat(r),o],a=oi(e,n[0],i);let l=a.top,c=a.right,p=a.bottom,u=a.left;for(let w=1;w<n.length;w++){const v=oi(e,n[w],i);l=J(v.top,l),c=ye(v.right,c),p=ye(v.bottom,p),u=J(v.left,u)}return{width:c-u,height:p-l,x:u,y:l}}function xn(t){const{width:e,height:r}=Qo(t);return{width:e,height:r}}function _n(t,e,r){const o=pe(e),i=ce(e),s=r==="fixed",n=Me(t,!0,s,e);let a={scrollLeft:0,scrollTop:0};const l=le(0);function c(){l.x=It(i)}if(o||!o&&!s)if((Ge(e)!=="body"||pt(i))&&(a=Ht(e)),o){const v=Me(e,!0,s,e);l.x=v.x+e.clientLeft,l.y=v.y+e.clientTop}else i&&c();s&&!o&&i&&c();const p=i&&!o&&!s?ti(i,a):le(0),u=n.left+a.scrollLeft-l.x-p.x,w=n.top+a.scrollTop-l.y-p.y;return{x:u,y:w,width:n.width,height:n.height}}function zr(t){return te(t).position==="static"}function si(t,e){if(!pe(t)||te(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return ce(t)===r&&(r=r.ownerDocument.body),r}function ni(t,e){const r=Y(t);if(Bt(t))return r;if(!pe(t)){let i=we(t);for(;i&&!Ke(i);){if(ee(i)&&!zr(i))return i;i=we(i)}return r}let o=si(t,e);for(;o&&cn(o)&&zr(o);)o=si(o,e);return o&&Ke(o)&&zr(o)&&!Ut(o)?r:o||pn(t)||r}const kn=async function(t){const e=this.getOffsetParent||ni,r=this.getDimensions,o=await r(t.floating);return{reference:_n(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function An(t){return te(t).direction==="rtl"}const Vt={convertOffsetParentRelativeRectToViewportRelativeRect:gn,getDocumentElement:ce,getClippingRect:$n,getOffsetParent:ni,getElementRects:kn,getClientRects:mn,getDimensions:xn,getScale:Xe,isElement:ee,isRTL:An};function ai(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Pn(t,e){let r=null,o;const i=ce(t);function s(){var a;clearTimeout(o),(a=r)==null||a.disconnect(),r=null}function n(a,l){a===void 0&&(a=!1),l===void 0&&(l=1),s();const c=t.getBoundingClientRect(),{left:p,top:u,width:w,height:v}=c;if(a||e(),!w||!v)return;const _=Dt(u),C=Dt(i.clientWidth-(p+w)),S=Dt(i.clientHeight-(u+v)),E=Dt(p),d={rootMargin:-_+"px "+-C+"px "+-S+"px "+-E+"px",threshold:J(0,ye(1,l))||1};let g=!0;function b(y){const k=y[0].intersectionRatio;if(k!==l){if(!g)return n();k?n(!1,k):o=setTimeout(()=>{n(!1,1e-7)},1e3)}k===1&&!ai(c,t.getBoundingClientRect())&&n(),g=!1}try{r=new IntersectionObserver(b,{...d,root:i.ownerDocument})}catch{r=new IntersectionObserver(b,d)}r.observe(t)}return n(!0),s}function Cn(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:n=typeof ResizeObserver=="function",layoutShift:a=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=Mr(t),p=i||s?[...c?ut(c):[],...e?ut(e):[]]:[];p.forEach(E=>{i&&E.addEventListener("scroll",r,{passive:!0}),s&&E.addEventListener("resize",r)});const u=c&&a?Pn(c,r):null;let w=-1,v=null;n&&(v=new ResizeObserver(E=>{let[h]=E;h&&h.target===c&&v&&e&&(v.unobserve(e),cancelAnimationFrame(w),w=requestAnimationFrame(()=>{var d;(d=v)==null||d.observe(e)})),r()}),c&&!l&&v.observe(c),e&&v.observe(e));let _,C=l?Me(t):null;l&&S();function S(){const E=Me(t);C&&!ai(C,E)&&r(),C=E,_=requestAnimationFrame(S)}return r(),()=>{var E;p.forEach(h=>{i&&h.removeEventListener("scroll",r),s&&h.removeEventListener("resize",r)}),u==null||u(),(E=v)==null||E.disconnect(),v=null,l&&cancelAnimationFrame(_)}}const Sn=nn,En=an,On=rn,li=ln,Tn=tn,Ln=(t,e,r)=>{const o=new Map,i={platform:Vt,...r},s={...i.platform,_c:o};return en(t,e,{...i,platform:s})};function Rn(t){return Mn(t)}function Dr(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Mn(t){for(let e=t;e;e=Dr(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Dr(t);e;e=Dr(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||Ut(r)||e.tagName==="BODY"))return e}return null}function zn(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var M=class extends Q{constructor(){super(...arguments),this.localize=new ht(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,i=0,s=0,n=0,a=0,l=0,c=0,p=0;r?t.top<e.top?(o=t.left,i=t.bottom,s=t.right,n=t.bottom,a=e.left,l=e.top,c=e.right,p=e.top):(o=e.left,i=e.bottom,s=e.right,n=e.bottom,a=t.left,l=t.top,c=t.right,p=t.top):t.left<e.left?(o=t.right,i=t.top,s=e.left,n=e.top,a=t.right,l=t.bottom,c=e.left,p=e.bottom):(o=e.right,i=e.top,s=t.left,n=t.top,a=e.right,l=e.bottom,c=t.left,p=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${p}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||zn(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Cn(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Sn({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(li({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=i?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(On({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(En({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(li({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Tn({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>Vt.getOffsetParent(r,Rn):Vt.getOffsetParent;Ln(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:Ro(Lt({},Vt),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:i,placement:s})=>{const n=this.localize.dir()==="rtl",a={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let p="",u="",w="",v="";if(this.arrowPlacement==="start"){const _=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";p=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",u=n?_:"",v=n?"":_}else if(this.arrowPlacement==="end"){const _=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=n?"":_,v=n?_:"",w=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(v=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",p=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(v=typeof l=="number"?`${l}px`:"",p=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:p,right:u,bottom:w,left:v,[a]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return x`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${We({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${We({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?x`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};M.styles=[Oe,Is],$([Z(".popup")],M.prototype,"popup",2),$([Z(".popup__arrow")],M.prototype,"arrowEl",2),$([m()],M.prototype,"anchor",2),$([m({type:Boolean,reflect:!0})],M.prototype,"active",2),$([m({reflect:!0})],M.prototype,"placement",2),$([m({reflect:!0})],M.prototype,"strategy",2),$([m({type:Number})],M.prototype,"distance",2),$([m({type:Number})],M.prototype,"skidding",2),$([m({type:Boolean})],M.prototype,"arrow",2),$([m({attribute:"arrow-placement"})],M.prototype,"arrowPlacement",2),$([m({attribute:"arrow-padding",type:Number})],M.prototype,"arrowPadding",2),$([m({type:Boolean})],M.prototype,"flip",2),$([m({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],M.prototype,"flipFallbackPlacements",2),$([m({attribute:"flip-fallback-strategy"})],M.prototype,"flipFallbackStrategy",2),$([m({type:Object})],M.prototype,"flipBoundary",2),$([m({attribute:"flip-padding",type:Number})],M.prototype,"flipPadding",2),$([m({type:Boolean})],M.prototype,"shift",2),$([m({type:Object})],M.prototype,"shiftBoundary",2),$([m({attribute:"shift-padding",type:Number})],M.prototype,"shiftPadding",2),$([m({attribute:"auto-size"})],M.prototype,"autoSize",2),$([m()],M.prototype,"sync",2),$([m({type:Object})],M.prototype,"autoSizeBoundary",2),$([m({attribute:"auto-size-padding",type:Number})],M.prototype,"autoSizePadding",2),$([m({attribute:"hover-bridge",type:Boolean})],M.prototype,"hoverBridge",2);var ci=new Map,Dn=new WeakMap;function Nn(t){return t??{keyframes:[],options:{duration:0}}}function di(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function G(t,e){ci.set(t,Nn(e))}function ze(t,e,r){const o=Dn.get(t);if(o!=null&&o[e])return di(o[e],r.dir);const i=ci.get(e);return i?di(i,r.dir):{keyframes:[],options:{duration:0}}}function Wt(t,e){return new Promise(r=>{function o(i){i.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function De(t,e,r){return new Promise(o=>{if((r==null?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=t.animate(e,Ro(Lt({},r),{duration:Fn()?0:r.duration}));i.addEventListener("cancel",o,{once:!0}),i.addEventListener("finish",o,{once:!0})})}function hi(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function Fn(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Ze(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var H=class extends Q{constructor(){super(),this.localize=new ht(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=hi(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=hi(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Ze(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=ze(this,"tooltip.show",{dir:this.localize.dir()});await De(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Ze(this.body);const{keyframes:r,options:o}=ze(this,"tooltip.hide",{dir:this.localize.dir()});await De(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Wt(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Wt(this,"sl-after-hide")}render(){return x`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${We({tooltip:!0,"tooltip--open":this.open})}
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
    `}};H.styles=[Oe,Hs],H.dependencies={"sl-popup":M},$([Z("slot:not([name])")],H.prototype,"defaultSlot",2),$([Z(".tooltip__body")],H.prototype,"body",2),$([Z("sl-popup")],H.prototype,"popup",2),$([m()],H.prototype,"content",2),$([m()],H.prototype,"placement",2),$([m({type:Boolean,reflect:!0})],H.prototype,"disabled",2),$([m({type:Number})],H.prototype,"distance",2),$([m({type:Boolean,reflect:!0})],H.prototype,"open",2),$([m({type:Number})],H.prototype,"skidding",2),$([m()],H.prototype,"trigger",2),$([m({type:Boolean})],H.prototype,"hoist",2),$([ne("open",{waitUntilFirstUpdate:!0})],H.prototype,"handleOpenChange",1),$([ne(["content","distance","hoist","placement","skidding"])],H.prototype,"handleOptionsChange",1),$([ne("disabled")],H.prototype,"handleDisabledChange",1),G("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),G("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),H.define("sl-tooltip"),ae.define("sl-icon");var jn=z`
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
`;function Bn(t,e){function r(i){const s=t.getBoundingClientRect(),n=t.ownerDocument.defaultView,a=s.left+n.scrollX,l=s.top+n.scrollY,c=i.pageX-a,p=i.pageY-l;e!=null&&e.onMove&&e.onMove(c,p)}function o(){document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o),e!=null&&e.onStop&&e.onStop()}document.addEventListener("pointermove",r,{passive:!0}),document.addEventListener("pointerup",o),(e==null?void 0:e.initialEvent)instanceof PointerEvent&&r(e.initialEvent)}function pi(t,e,r){const o=i=>Object.is(i,-0)?0:i;return t<e?o(e):t>r?o(r):o(t)}var ui=()=>null,K=class extends Q{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new ht(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=ui,this.snapThreshold=12}toSnapFunction(t){const e=t.split(" ");return({pos:r,size:o,snapThreshold:i,isRtl:s,vertical:n})=>{let a=r,l=Number.POSITIVE_INFINITY;return e.forEach(c=>{let p;if(c.startsWith("repeat(")){const w=t.substring(7,t.length-1),v=w.endsWith("%"),_=Number.parseFloat(w),C=v?o*(_/100):_;p=Math.round((s&&!n?o-r:r)/C)*C}else c.endsWith("%")?p=o*(Number.parseFloat(c)/100):p=Number.parseFloat(c);s&&!n&&(p=o-p);const u=Math.abs(r-p);u<=i&&u<l&&(a=p,l=u)}),a}}set snap(t){this.snapValue=t??"",t?this.snapFunction=typeof t=="string"?this.toSnapFunction(t):t:this.snapFunction=ui}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(t=>this.handleResize(t)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this)}detectSize(){const{width:t,height:e}=this.getBoundingClientRect();this.size=this.vertical?e:t}percentageToPixels(t){return this.size*(t/100)}pixelsToPercentage(t){return t/this.size*100}handleDrag(t){const e=this.localize.dir()==="rtl";this.disabled||(t.cancelable&&t.preventDefault(),Bn(this,{onMove:(r,o)=>{var i;let s=this.vertical?o:r;this.primary==="end"&&(s=this.size-s),s=(i=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:e,vertical:this.vertical}))!=null?i:s,this.position=pi(this.pixelsToPercentage(s),0,100)},initialEvent:t}))}handleKeyDown(t){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(t.key)){let e=this.position;const r=(t.shiftKey?10:1)*(this.primary==="end"?-1:1);if(t.preventDefault(),(t.key==="ArrowLeft"&&!this.vertical||t.key==="ArrowUp"&&this.vertical)&&(e-=r),(t.key==="ArrowRight"&&!this.vertical||t.key==="ArrowDown"&&this.vertical)&&(e+=r),t.key==="Home"&&(e=this.primary==="end"?100:0),t.key==="End"&&(e=this.primary==="end"?0:100),t.key==="Enter")if(this.isCollapsed)e=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const o=this.position;e=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=o})}this.position=pi(e,0,100)}}handleResize(t){const{width:e,height:r}=t[0].contentRect;this.size=this.vertical?r:e,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const t=this.vertical?"gridTemplateRows":"gridTemplateColumns",e=this.vertical?"gridTemplateColumns":"gridTemplateRows",r=this.localize.dir()==="rtl",o=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,i="auto";return this.primary==="end"?r&&!this.vertical?this.style[t]=`${o} var(--divider-width) ${i}`:this.style[t]=`${i} var(--divider-width) ${o}`:r&&!this.vertical?this.style[t]=`${i} var(--divider-width) ${o}`:this.style[t]=`${o} var(--divider-width) ${i}`,this.style[e]="",x`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${q(this.disabled?void 0:"0")}
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
    `}};K.styles=[Oe,jn],$([Z(".divider")],K.prototype,"divider",2),$([m({type:Number,reflect:!0})],K.prototype,"position",2),$([m({attribute:"position-in-pixels",type:Number})],K.prototype,"positionInPixels",2),$([m({type:Boolean,reflect:!0})],K.prototype,"vertical",2),$([m({type:Boolean,reflect:!0})],K.prototype,"disabled",2),$([m()],K.prototype,"primary",2),$([m({reflect:!0})],K.prototype,"snap",1),$([m({type:Number,attribute:"snap-threshold"})],K.prototype,"snapThreshold",2),$([ne("position")],K.prototype,"handlePositionChange",1),$([ne("positionInPixels")],K.prototype,"handlePositionInPixelsChange",1),$([ne("vertical")],K.prototype,"handleVerticalChange",1),K.define("sl-split-panel");var Un=z`
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
`;function*Nr(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*Ls(Nr(t.shadowRoot.activeElement))))}function Hn(){return[...Nr()].pop()}var fi=new WeakMap;function gi(t){let e=fi.get(t);return e||(e=window.getComputedStyle(t,null),fi.set(t,e)),e}function In(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const e=gi(t);return e.visibility!=="hidden"&&e.display!=="none"}function Vn(t){const e=gi(t),{overflowY:r,overflowX:o}=e;return r==="scroll"||o==="scroll"?!0:r!=="auto"||o!=="auto"?!1:t.scrollHeight>t.clientHeight&&r==="auto"||t.scrollWidth>t.clientWidth&&o==="auto"}function Wn(t){const e=t.tagName.toLowerCase(),r=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(r)||r<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){const s=t.getRootNode(),n=`input[type='radio'][name="${t.getAttribute("name")}"]`,a=s.querySelector(`${n}:checked`);return a?a===t:s.querySelector(n)===t}return In(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:Vn(t):!1}function qn(t,e){var r;return((r=t.getRootNode({composed:!0}))==null?void 0:r.host)!==e}function mi(t){const e=new WeakMap,r=[];function o(i){if(i instanceof Element){if(i.hasAttribute("inert")||i.closest("[inert]")||e.has(i))return;e.set(i,!0),!r.includes(i)&&Wn(i)&&r.push(i),i instanceof HTMLSlotElement&&qn(i,t)&&i.assignedElements({flatten:!0}).forEach(s=>{o(s)}),i.shadowRoot!==null&&i.shadowRoot.mode==="open"&&o(i.shadowRoot)}for(const s of i.children)o(s)}return o(t),r.sort((i,s)=>{const n=Number(i.getAttribute("tabindex"))||0;return(Number(s.getAttribute("tabindex"))||0)-n})}var ft=[],Jn=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var r;if(e.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const o=Hn();if(this.previousFocus=o,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const i=mi(this.element);let s=i.findIndex(a=>a===o);this.previousFocus=this.currentFocus;const n=this.tabDirection==="forward"?1:-1;for(;;){s+n>=i.length?s=0:s+n<0?s=i.length-1:s+=n,this.previousFocus=this.currentFocus;const a=i[s];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||a&&this.possiblyHasTabbableChildren(a))return;e.preventDefault(),this.currentFocus=a,(r=this.currentFocus)==null||r.focus({preventScroll:!1});const l=[...Nr()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){ft.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){ft=ft.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return ft[ft.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const t=mi(this.element);if(!this.element.matches(":focus-within")){const e=t[0],r=t[t.length-1],o=this.tabDirection==="forward"?e:r;typeof(o==null?void 0:o.focus)=="function"&&(this.currentFocus=o,o.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}},Fr=new Set;function Yn(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}function Gn(){const t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}function jr(t){if(Fr.add(t),!document.documentElement.classList.contains("sl-scroll-lock")){const e=Yn()+Gn();let r=getComputedStyle(document.documentElement).scrollbarGutter;(!r||r==="auto")&&(r="stable"),e<2&&(r=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",r),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function Br(t){Fr.delete(t),Fr.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}var Kn=t=>{var e;const{activeElement:r}=document;r&&t.contains(r)&&((e=document.activeElement)==null||e.blur())},Xn=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function vi(t){return t.charAt(0).toUpperCase()+t.slice(1)}var X=class extends Q{constructor(){super(...arguments),this.hasSlotController=new Xn(this,"footer"),this.localize=new ht(this),this.modal=new Jn(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=t=>{this.contained||t.key==="Escape"&&this.modal.isActive()&&this.open&&(t.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),jr(this)))}disconnectedCallback(){super.disconnectedCallback(),Br(this),this.removeOpenListeners()}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){const r=ze(this,"drawer.denyClose",{dir:this.localize.dir()});De(this.panel,r.keyframes,r.options);return}this.hide()}addOpenListeners(){var t;"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;document.removeEventListener("keydown",this.handleDocumentKeyDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),jr(this));const t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([Ze(this.drawer),Ze(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});const e=ze(this,`drawer.show${vi(this.placement)}`,{dir:this.localize.dir()}),r=ze(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([De(this.panel,e.keyframes,e.options),De(this.overlay,r.keyframes,r.options)]),this.emit("sl-after-show")}else{Kn(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),Br(this)),await Promise.all([Ze(this.drawer),Ze(this.overlay)]);const t=ze(this,`drawer.hide${vi(this.placement)}`,{dir:this.localize.dir()}),e=ze(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([De(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),De(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const r=this.originalTrigger;typeof(r==null?void 0:r.focus)=="function"&&setTimeout(()=>r.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),jr(this)),this.open&&this.contained&&(this.modal.deactivate(),Br(this))}async show(){if(!this.open)return this.open=!0,Wt(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Wt(this,"sl-after-hide")}render(){return x`
      <div
        part="base"
        class=${We({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${q(this.noHeader?this.label:void 0)}
          aria-labelledby=${q(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":x`
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
    `}};X.styles=[Oe,Un],X.dependencies={"sl-icon-button":V},$([Z(".drawer")],X.prototype,"drawer",2),$([Z(".drawer__panel")],X.prototype,"panel",2),$([Z(".drawer__overlay")],X.prototype,"overlay",2),$([m({type:Boolean,reflect:!0})],X.prototype,"open",2),$([m({reflect:!0})],X.prototype,"label",2),$([m({reflect:!0})],X.prototype,"placement",2),$([m({type:Boolean,reflect:!0})],X.prototype,"contained",2),$([m({attribute:"no-header",type:Boolean,reflect:!0})],X.prototype,"noHeader",2),$([ne("open",{waitUntilFirstUpdate:!0})],X.prototype,"handleOpenChange",1),$([ne("contained",{waitUntilFirstUpdate:!0})],X.prototype,"handleNoModalChange",1),G("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),G("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),G("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),G("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),G("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),G("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),G("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),X.define("sl-drawer");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ur=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qt=globalThis,Hr=qt.ShadowRoot&&(qt.ShadyCSS===void 0||qt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ir=Symbol(),yi=new WeakMap;let bi=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==Ir)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(Hr&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=yi.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&yi.set(r,e))}return e}toString(){return this.cssText}};const Zn=t=>new bi(typeof t=="string"?t:t+"",void 0,Ir),Jt=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,i,s)=>o+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new bi(r,t,Ir)},Qn=(t,e)=>{if(Hr)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),i=qt.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},wi=Hr?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Zn(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ea,defineProperty:ta,getOwnPropertyDescriptor:ra,getOwnPropertyNames:oa,getOwnPropertySymbols:ia,getPrototypeOf:sa}=Object,$e=globalThis,$i=$e.trustedTypes,na=$i?$i.emptyScript:"",Vr=$e.reactiveElementPolyfillSupport,gt=(t,e)=>t,Yt={toAttribute(t,e){switch(e){case Boolean:t=t?na:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Wr=(t,e)=>!ea(t,e),xi={attribute:!0,type:String,converter:Yt,reflect:!1,useDefault:!1,hasChanged:Wr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),$e.litPropertyMetadata??($e.litPropertyMetadata=new WeakMap);let Qe=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=xi){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&ta(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:s}=ra(this.prototype,e)??{get(){return this[r]},set(n){this[r]=n}};return{get:i,set(n){const a=i==null?void 0:i.call(this);s==null||s.call(this,n),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??xi}static _$Ei(){if(this.hasOwnProperty(gt("elementProperties")))return;const e=sa(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(gt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(gt("properties"))){const r=this.properties,o=[...oa(r),...ia(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(wi(i))}else e!==void 0&&r.push(wi(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise((r=>this.enableUpdating=r)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach((r=>r(this)))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Qn(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)}))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var s;const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const n=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:Yt).toAttribute(r,o.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,r){var s,n;const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=o.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((s=a.converter)==null?void 0:s.fromAttribute)!==void 0?a.converter:Yt;this._$Em=i;const c=l.fromAttribute(r,a.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(e,r,o){var i;if(e!==void 0){const s=this.constructor,n=this[e];if(o??(o=s.getPropertyOptions(e)),!((o.hasChanged??Wr)(n,r)||o.useDefault&&o.reflect&&n===((i=this._$Ej)==null?void 0:i.get(e))&&!this.hasAttribute(s._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??r??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach((i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)})),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach((o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach((r=>this._$ET(r,this[r])))),this._$EM()}updated(e){}firstUpdated(e){}};Qe.elementStyles=[],Qe.shadowRootOptions={mode:"open"},Qe[gt("elementProperties")]=new Map,Qe[gt("finalized")]=new Map,Vr==null||Vr({ReactiveElement:Qe}),($e.reactiveElementVersions??($e.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const aa={attribute:!0,type:String,converter:Yt,reflect:!1,hasChanged:Wr},la=(t=aa,e,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),o==="accessor"){const{name:n}=r;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,t)},init(a){return a!==void 0&&this.C(n,void 0,t,a),a}}}if(o==="setter"){const{name:n}=r;return function(a){const l=this[n];e.call(this,a),this.requestUpdate(n,l,t)}}throw Error("Unsupported decorator location: "+o)};function ue(t){return(e,r)=>typeof r=="object"?la(t,e,r):((o,i,s)=>{const n=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),n?Object.getOwnPropertyDescriptor(i,s):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _i(t){return ue({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Gt=mt.trustedTypes,ki=Gt?Gt.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ai="$lit$",xe=`lit$${Math.random().toFixed(9).slice(2)}$`,Pi="?"+xe,ca=`<${Pi}>`,Ne=document,vt=()=>Ne.createComment(""),yt=t=>t===null||typeof t!="object"&&typeof t!="function",qr=Array.isArray,da=t=>qr(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Jr=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ci=/-->/g,Si=/>/g,Fe=RegExp(`>|${Jr}(?:([^\\s"'>=/]+)(${Jr}*=${Jr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ei=/'/g,Oi=/"/g,Ti=/^(?:script|style|textarea|title)$/i,ha=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),Yr=ha(1),et=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),Li=new WeakMap,je=Ne.createTreeWalker(Ne,129);function Ri(t,e){if(!qr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return ki!==void 0?ki.createHTML(e):e}const pa=(t,e)=>{const r=t.length-1,o=[];let i,s=e===2?"<svg>":e===3?"<math>":"",n=bt;for(let a=0;a<r;a++){const l=t[a];let c,p,u=-1,w=0;for(;w<l.length&&(n.lastIndex=w,p=n.exec(l),p!==null);)w=n.lastIndex,n===bt?p[1]==="!--"?n=Ci:p[1]!==void 0?n=Si:p[2]!==void 0?(Ti.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=Fe):p[3]!==void 0&&(n=Fe):n===Fe?p[0]===">"?(n=i??bt,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?Fe:p[3]==='"'?Oi:Ei):n===Oi||n===Ei?n=Fe:n===Ci||n===Si?n=bt:(n=Fe,i=void 0);const v=n===Fe&&t[a+1].startsWith("/>")?" ":"";s+=n===bt?l+ca:u>=0?(o.push(c),l.slice(0,u)+Ai+l.slice(u)+xe+v):l+xe+(u===-2?a:v)}return[Ri(t,s+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class wt{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let s=0,n=0;const a=e.length-1,l=this.parts,[c,p]=pa(e,r);if(this.el=wt.createElement(c,o),je.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=je.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ai)){const w=p[n++],v=i.getAttribute(u).split(xe),_=/([.?@])?(.*)/.exec(w);l.push({type:1,index:s,name:_[2],strings:v,ctor:_[1]==="."?fa:_[1]==="?"?ga:_[1]==="@"?ma:Kt}),i.removeAttribute(u)}else u.startsWith(xe)&&(l.push({type:6,index:s}),i.removeAttribute(u));if(Ti.test(i.tagName)){const u=i.textContent.split(xe),w=u.length-1;if(w>0){i.textContent=Gt?Gt.emptyScript:"";for(let v=0;v<w;v++)i.append(u[v],vt()),je.nextNode(),l.push({type:2,index:++s});i.append(u[w],vt())}}}else if(i.nodeType===8)if(i.data===Pi)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(xe,u+1))!==-1;)l.push({type:7,index:s}),u+=xe.length-1}s++}}static createElement(e,r){const o=Ne.createElement("template");return o.innerHTML=e,o}}function tt(t,e,r=t,o){var n,a;if(e===et)return e;let i=o!==void 0?(n=r._$Co)==null?void 0:n[o]:r._$Cl;const s=yt(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(e=tt(t,i._$AS(t,e.values),i,o)),e}class ua{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=((e==null?void 0:e.creationScope)??Ne).importNode(r,!0);je.currentNode=i;let s=je.nextNode(),n=0,a=0,l=o[0];for(;l!==void 0;){if(n===l.index){let c;l.type===2?c=new $t(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new va(s,this,e)),this._$AV.push(c),l=o[++a]}n!==(l==null?void 0:l.index)&&(s=je.nextNode(),n++)}return je.currentNode=Ne,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}}class $t{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=tt(this,e,r),yt(e)?e===B||e==null||e===""?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==et&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):da(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&yt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ne.createTextNode(e)),this._$AH=e}$(e){var s;const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=wt.createElement(Ri(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(r);else{const n=new ua(i,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=Li.get(e.strings);return r===void 0&&Li.set(e.strings,r=new wt(e)),r}k(e){qr(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of e)i===r.length?r.push(o=new $t(this.O(vt()),this.O(vt()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}}class Kt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,s){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=B}_$AI(e,r=this,o,i){const s=this.strings;let n=!1;if(s===void 0)e=tt(this,e,r,0),n=!yt(e)||e!==this._$AH&&e!==et,n&&(this._$AH=e);else{const a=e;let l,c;for(e=s[0],l=0;l<s.length-1;l++)c=tt(this,a[o+l],r,l),c===et&&(c=this._$AH[l]),n||(n=!yt(c)||c!==this._$AH[l]),c===B?e=B:e!==B&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}n&&!i&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class fa extends Kt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class ga extends Kt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class ma extends Kt{constructor(e,r,o,i,s){super(e,r,o,i,s),this.type=5}_$AI(e,r=this){if((e=tt(this,e,r,0)??B)===et)return;const o=this._$AH,i=e===B&&o!==B||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==B&&(o===B||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}}class va{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){tt(this,e)}}const Gr=mt.litHtmlPolyfillSupport;Gr==null||Gr(wt,$t),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.3.1");const ya=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let i=o._$litPart$;if(i===void 0){const s=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new $t(e.insertBefore(vt(),s),s,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Be=globalThis;class Ue extends Qe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ya(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return et}}Ue._$litElement$=!0,Ue.finalized=!0,(Hi=Be.litElementHydrateSupport)==null||Hi.call(Be,{LitElement:Ue});const Kr=Be.litElementPolyfillSupport;Kr==null||Kr({LitElement:Ue}),(Be.litElementVersions??(Be.litElementVersions=[])).push("4.2.1");function ba(t){switch(t.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const wa=Jt`
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
`;var $a=Object.defineProperty,xa=Object.getOwnPropertyDescriptor,rt=(t,e,r,o)=>{for(var i=o>1?void 0:o?xa(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&$a(e,r,i),i};let _e=class extends Ue{constructor(){super(),this.lower=!1,this.method="GET"}render(){let t="medium";this.large&&(t="large"),this.tiny&&(t="small"),this.micro&&(t="small");const e=this.micro?`method ${t} micro`:`method ${t}`;return Yr`
            <sl-tag variant="${ba(this.method)}" class="${e}"
                    size="${t}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};_e.styles=wa,rt([ue()],_e.prototype,"method",2),rt([ue({type:Boolean})],_e.prototype,"lower",2),rt([ue({type:Boolean})],_e.prototype,"large",2),rt([ue({type:Boolean})],_e.prototype,"tiny",2),rt([ue({type:Boolean})],_e.prototype,"micro",2),_e=rt([Ur("pb33f-http-method")],_e);const _a=Jt`
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
    }`;var ka=Object.defineProperty,Aa=Object.getOwnPropertyDescriptor,Xt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Aa(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&ka(e,r,i),i};let ot=class extends Ue{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return Yr` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};ot.styles=_a,Xt([ue()],ot.prototype,"name",2),Xt([ue()],ot.prototype,"url",2),Xt([ue({type:Boolean})],ot.prototype,"wide",2),ot=Xt([Ur("pb33f-header")],ot);const Pa=Jt`

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

`,Ca=Jt`
    
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
 `,Sa="pb33f-theme-change";var Ea=Object.defineProperty,Oa=Object.getOwnPropertyDescriptor,Xr=(t,e,r,o)=>{for(var i=o>1?void 0:o?Oa(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Ea(e,r,i),i};const Zr="dark",Ta="light",La="tektronix",Mi="pb33f-theme",zi="pb33f-base-theme";let xt=class extends Ue{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?La:this.baseTheme}connectedCallback(){super.connectedCallback();const t=localStorage.getItem(Mi);if(t==="tektronix"){this.tektronixActive=!0;const e=localStorage.getItem(zi);this.baseTheme=e==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=t==="light"?"light":"dark";this.applyTheme()}applyTheme(){const t=this.activeTheme;localStorage.setItem(Mi,t),localStorage.setItem(zi,this.baseTheme);const e=document.querySelector("html");e&&(e.setAttribute("theme",t),t===Ta?e.classList.remove("sl-theme-dark"):e.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Sa,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Zr?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const t=this.baseTheme===Zr?"sun":"moon",e=this.baseTheme===Zr?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",r=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return Yr`
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
        `}};xt.styles=[Pa,Ca],Xr([_i()],xt.prototype,"baseTheme",2),Xr([_i()],xt.prototype,"tektronixActive",2),xt=Xr([Ur("pb33f-theme-switcher")],xt);const Ra=z`
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
`;var Ma=Object.defineProperty,za=Object.getOwnPropertyDescriptor,Qr=(t,e,r,o)=>{for(var i=o>1?void 0:o?za(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Ma(e,r,i),i};const Di="pp-split-position",Da=20;f.PpLayout=class extends N{constructor(){super(...arguments),this.title="",this.splitPos=Da}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const e=sessionStorage.getItem(Di);e&&(this.splitPos=parseFloat(e))}onReposition(e){const r=e.target.position;typeof r=="number"&&(this.splitPos=r,sessionStorage.setItem(Di,String(r)))}render(){return x`
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
    `}},f.PpLayout.styles=Ra,Qr([R()],f.PpLayout.prototype,"title",2),Qr([R()],f.PpLayout.prototype,"splitPos",2),f.PpLayout=Qr([I("pp-layout")],f.PpLayout);const Na=z`
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
`;var Fa=Object.defineProperty,ja=Object.getOwnPropertyDescriptor,Zt=(t,e,r,o)=>{for(var i=o>1?void 0:o?ja(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Fa(e,r,i),i};f.PpNav=class extends N{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const e=this.getAttribute("data-nav");if(e)try{this.tags=JSON.parse(e)||[]}catch{}const r=this.getAttribute("data-models");if(r)try{this.modelGroups=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return x`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?x`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(e=>x`<pp-nav-tag .tag=${e} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:A}
      ${this.modelGroups.length?x`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(e=>x`<pp-nav-model-group .group=${e} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:A}
    `}},f.PpNav.styles=Na,Zt([R()],f.PpNav.prototype,"tags",2),Zt([R()],f.PpNav.prototype,"modelGroups",2),Zt([R()],f.PpNav.prototype,"activeSlug",2),f.PpNav=Zt([I("pp-nav")],f.PpNav);const Ba=z`
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
`;var Ua=Object.defineProperty,Ha=Object.getOwnPropertyDescriptor,Qt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Ha(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Ua(e,r,i),i};function eo(t,e){var r,o;return e?!!((r=t.operations)!=null&&r.some(i=>i.slug===e)||(o=t.children)!=null&&o.some(i=>eo(i,e))):!1}f.PpNavTag=class extends N{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("tag")||e.has("activeSlug"))&&eo(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,n;const{tag:e,activeSlug:r,open:o}=this,i=eo(e,r);return x`
            <div class="tag-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${e.summary||e.name}</span>
            </div>
            ${o?x`
                        <div class="tag-body">
                            ${(s=e.operations)!=null&&s.length?x`
                                        <ul>
                                            ${e.operations.map(a=>x`
                                                        <li>
                                                            <a href="operations/${a.slug}.html" class="${a.deprecated?"deprecated":""} ${a.slug===r?"active":""}">
                                                                <pb33f-http-method tiny
                                                                        method=${a.method}></pb33f-http-method>
                                                                <span class="op-title">${a.summary||a.path}</span>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:A}
                            ${(n=e.children)!=null&&n.length?x`
                                        <div class="children">
                                            ${e.children.map(a=>x`
                                                        <pp-nav-tag .tag=${a}
                                                                    .activeSlug=${r}></pp-nav-tag>`)}
                                        </div>
                                    `:A}
                        </div>
                    `:A}
        `}},f.PpNavTag.styles=Ba,Qt([m({type:Object})],f.PpNavTag.prototype,"tag",2),Qt([m()],f.PpNavTag.prototype,"activeSlug",2),Qt([R()],f.PpNavTag.prototype,"open",2),f.PpNavTag=Qt([I("pp-nav-tag")],f.PpNavTag);const Ia=z`
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
`;var Va=Object.defineProperty,Wa=Object.getOwnPropertyDescriptor,er=(t,e,r,o)=>{for(var i=o>1?void 0:o?Wa(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Va(e,r,i),i};function Ni(t,e){var r;return e?((r=t.models)==null?void 0:r.some(o=>o.typeSlug+"/"+o.slug===e))??!1:!1}f.PpNavModelGroup=class extends N{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("group")||e.has("activeSlug"))&&Ni(this.group,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s;const{group:e,activeSlug:r,open:o}=this,i=Ni(e,r);return x`
            <div class="group-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${e.name}</span>
            </div>
            ${o&&((s=e.models)!=null&&s.length)?x`
                    <div class="group-body">
                        <ul>
                            ${e.models.map(n=>{const a=n.typeSlug+"/"+n.slug;return x`
                                        <li>
                                            <a href="models/${n.typeSlug}/${n.slug}.html"
                                               class="${a===r?"active":""}">
                                                <span class="model-name">${n.name}</span>
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:A}
        `}},f.PpNavModelGroup.styles=Ia,er([m({type:Object})],f.PpNavModelGroup.prototype,"group",2),er([m()],f.PpNavModelGroup.prototype,"activeSlug",2),er([R()],f.PpNavModelGroup.prototype,"open",2),f.PpNavModelGroup=er([I("pp-nav-model-group")],f.PpNavModelGroup);const qa=z`
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
`;var Ja=Object.defineProperty,Ya=Object.getOwnPropertyDescriptor,_t=(t,e,r,o)=>{for(var i=o>1?void 0:o?Ya(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Ja(e,r,i),i};f.PpNavOperation=class extends N{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return x`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},f.PpNavOperation.styles=qa,_t([m()],f.PpNavOperation.prototype,"method",2),_t([m()],f.PpNavOperation.prototype,"path",2),_t([m()],f.PpNavOperation.prototype,"slug",2),_t([m({type:Boolean})],f.PpNavOperation.prototype,"deprecated",2),f.PpNavOperation=_t([I("pp-nav-operation")],f.PpNavOperation);const to=z`
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
`,Ga=z`
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
`;var Ka=Object.defineProperty,Xa=Object.getOwnPropertyDescriptor,ro=(t,e,r,o)=>{for(var i=o>1?void 0:o?Xa(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Ka(e,r,i),i};function Za(t){var e;if(!t)return{type:"",enumValues:null};try{const r=JSON.parse(t);let o="";return r.type==="array"&&r.items?o=`array<${r.items.type||((e=r.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`:r.type?(o=Array.isArray(r.type)?r.type.join(" | "):r.type,r.format&&(o+=` (${r.format})`)):r.oneOf?o="oneOf":r.anyOf?o="anyOf":r.allOf?o="allOf":r.$ref&&(o=r.$ref.split("/").pop()),{type:o,enumValues:Array.isArray(r.enum)?r.enum:null}}catch{return{type:"",enumValues:null}}}f.PpOperationParameters=class extends N{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(e){if(e.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}render(){return this.params.length?x`
      <h3>Parameters</h3>
      ${this.params.map(e=>{const r=e.ref?null:Za(e.schemaJson),o=e.ref?e.ref.name:(r==null?void 0:r.type)||"";return x`
          <div class="parameter">
            <span class="param-name">${e.name}</span>
            ${o?e.ref?x`<span class="param-type"><a href="models/${e.ref.typeSlug}/${e.ref.slug}.html">${o}</a></span>`:x`<span class="param-type">${o}</span>`:A}
            <span class="param-in">${e.in}</span>
            ${e.required?x`<span class="required-badge">required</span>`:A}
            ${e.deprecated?x`<span class="deprecated-badge">deprecated</span>`:A}
            ${e.description?x`<div class="param-desc">${e.description}</div>`:A}
            ${r!=null&&r.enumValues?x`<div class="enum-values">Enum: ${r.enumValues.map((i,s)=>x`${s>0?", ":""}<span class="enum-value">${i}</span>`)}</div>`:A}
            ${e.rawJson||e.rawYaml?x`<pp-raw-viewer-btn
                  title="${e.name} (${e.in})"
                  raw-json=${e.rawJson||""}
                  raw-yaml=${e.rawYaml||""}
                  start-line=${e.sourceLine||1}>
                </pp-raw-viewer-btn>`:A}
            ${e.mockJson||e.examples&&Object.keys(e.examples).length>0?x`<pp-example-selector
                  mock-json=${e.mockJson||""}
                  examples-json=${e.examples?JSON.stringify(e.examples):""}>
                </pp-example-selector>`:A}
          </div>
        `})}
    `:A}},f.PpOperationParameters.styles=[to,Ga],ro([m({attribute:"parameters-json"})],f.PpOperationParameters.prototype,"parametersJson",2),ro([R()],f.PpOperationParameters.prototype,"params",2),f.PpOperationParameters=ro([I("pp-operation-parameters")],f.PpOperationParameters);const Qa=z`
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
`;var el=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,oo=(t,e,r,o)=>{for(var i=o>1?void 0:o?tl(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&el(e,r,i),i};function Fi(t){var e;if(!t)return"";if(t.type==="array"&&t.items)return`array<${t.items.type||((e=t.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`;if(t.type){let r=Array.isArray(t.type)?t.type.join(" | "):t.type;return t.format&&(r+=` (${t.format})`),r}return t.oneOf?"oneOf":t.anyOf?"anyOf":t.allOf?"allOf":t.$ref?t.$ref.split("/").pop():""}function rl(t){var e;return t?t.properties?t:t.type==="array"&&((e=t.items)!=null&&e.properties)?t.items:null:null}f.PpOperationResponses=class extends N{constructor(){super(...arguments),this.responsesJson="",this.responses=[]}willUpdate(e){if(e.has("responsesJson")&&this.responsesJson)try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}}renderProperty(e,r,o,i){const s=Fi(r),n=rl(r),a=(r==null?void 0:r.type)==="array"&&n;return x`
      <div class="property">
        <span class="prop-name">${e}</span>
        ${s?x`<span class="prop-type">${s}</span>`:A}
        ${o.has(e)?x`<span class="required-badge">required</span>`:A}
        ${r.description?x`<div class="prop-desc">${r.description}</div>`:A}
        ${r.enum?x`<div class="enum-values">Enum: ${r.enum.map((l,c)=>x`${c>0?", ":""}<span class="enum-value">${l}</span>`)}</div>`:A}
      </div>
      ${n&&i<4?x`
            <div class="nested">
              ${a?x`<div class="items-label">items</div>`:A}
              ${this.renderSchemaProperties(n,i+1)}
            </div>
          `:A}
    `}renderSchemaProperties(e,r=0){if(!e)return A;const o=e.properties||{},i=new Set(e.required||[]),s=Object.entries(o);if(!s.length){const n=Fi(e);return n?x`<div class="schema-type">Type: ${n}</div>`:A}return s.map(([n,a])=>this.renderProperty(n,a,i,r))}renderMediaType(e){if(e.schemaRef)return x`
        <div class="media-type-ref">
          <span class="media-type-label">${e.mediaType}</span>
          <a class="ref-link" href="models/${e.schemaRef.typeSlug}/${e.schemaRef.slug}.html">
            ${e.schemaRef.name}
          </a>
        </div>
      `;if(!e.schemaJson)return A;let r;try{r=JSON.parse(e.schemaJson)}catch{return A}const o=e.mockJson||e.examples&&Object.keys(e.examples).length>0;return x`
      <div class="media-type-label">${e.mediaType}</div>
      ${this.renderSchemaProperties(r)}
      ${o?x`<pp-example-selector
            mock-json=${e.mockJson||""}
            examples-json=${e.examples?JSON.stringify(e.examples):""}>
          </pp-example-selector>`:A}
    `}renderResponse(e){var r;return x`
      <div class="response">
        <h4>
          <span class="status-code">${e.statusCode}</span>
          ${e.description}
          ${e.rawJson||e.rawYaml?x`<pp-raw-viewer-btn
                title="Response ${e.statusCode}"
                raw-json=${e.rawJson||""}
                raw-yaml=${e.rawYaml||""}
                start-line=${e.sourceLine||1}>
              </pp-raw-viewer-btn>`:A}
        </h4>
        ${e.ref?x`<a class="ref-link" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">${e.ref.name}</a>`:((r=e.content)==null?void 0:r.map(o=>this.renderMediaType(o)))??A}
      </div>
    `}render(){return this.responses.length?x`
      <h3>Responses</h3>
      ${this.responses.map(e=>this.renderResponse(e))}
    `:A}},f.PpOperationResponses.styles=[to,Qa],oo([m({attribute:"responses-json"})],f.PpOperationResponses.prototype,"responsesJson",2),oo([R()],f.PpOperationResponses.prototype,"responses",2),f.PpOperationResponses=oo([I("pp-operation-responses")],f.PpOperationResponses);const ol=z`
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
`;var il=Object.defineProperty,sl=Object.getOwnPropertyDescriptor,tr=(t,e,r,o)=>{for(var i=o>1?void 0:o?sl(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&il(e,r,i),i};f.PpModelPage=class extends N{constructor(){super(...arguments),this.modelJson="",this.name="",this.parsed=null}willUpdate(e){if(e.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}render(){if(!this.parsed)return A;const e=this.parsed,r=e.properties||{},o=new Set(e.required||[]),i=Object.entries(r);return x`
      ${e.type?x`<div><strong>Type:</strong> ${e.type}</div>`:A}
      ${i.length?x`
            <h3>Properties</h3>
            ${i.map(([s,n])=>x`
                <div class="property">
                  <span class="prop-name">${s}</span>
                  ${n.type?x`<span class="prop-type">${n.type}</span>`:A}
                  ${o.has(s)?x`<span class="required-badge">required</span>`:A}
                  ${n.description?x`<div class="prop-desc">${n.description}</div>`:A}
                </div>
              `)}
          `:A}
    `}},f.PpModelPage.styles=[to,ol],tr([m({attribute:"model-json"})],f.PpModelPage.prototype,"modelJson",2),tr([m()],f.PpModelPage.prototype,"name",2),tr([R()],f.PpModelPage.prototype,"parsed",2),f.PpModelPage=tr([I("pp-model-page")],f.PpModelPage);const nl=z`
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
`;var al=Object.defineProperty,ll=Object.getOwnPropertyDescriptor,rr=(t,e,r,o)=>{for(var i=o>1?void 0:o?ll(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&al(e,r,i),i};f.PpModelCard=class extends N{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return x`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?x`<p>${this.description}</p>`:""}
      </a>
    `}},f.PpModelCard.styles=nl,rr([m()],f.PpModelCard.prototype,"name",2),rr([m()],f.PpModelCard.prototype,"href",2),rr([m()],f.PpModelCard.prototype,"description",2),f.PpModelCard=rr([I("pp-model-card")],f.PpModelCard);const cl=z`
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
`;var dl=Object.defineProperty,hl=Object.getOwnPropertyDescriptor,io=(t,e,r,o)=>{for(var i=o>1?void 0:o?hl(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&dl(e,r,i),i};f.PpCrossRefs=class extends N{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(e){if(e.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var o,i,s,n,a,l;const{refs:e}=this;return((o=e.UsedByOperations)==null?void 0:o.length)||((i=e.UsedByModels)==null?void 0:i.length)||((s=e.UsesModels)==null?void 0:s.length)?x`
      ${(n=e.UsedByOperations)!=null&&n.length?x`
            <h3>Used by Operations</h3>
            <ul>
              ${e.UsedByOperations.map(c=>x`
                  <li>
                    <a href="operations/${c.Slug}.html">
                      <pb33f-http-method method=${c.Method}></pb33f-http-method>
                      ${c.Path}
                    </a>
                  </li>
                `)}
            </ul>
          `:A}
      ${(a=e.UsedByModels)!=null&&a.length?x`
            <h3>Referenced by</h3>
            <ul>
              ${e.UsedByModels.map(c=>x`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:A}
      ${(l=e.UsesModels)!=null&&l.length?x`
            <h3>References</h3>
            <ul>
              ${e.UsesModels.map(c=>x`
                  <li>
                    <a href="models/${c.TypeSlug}/${c.Slug}.html">
                      ${c.Name}
                    </a>
                    <span class="type-badge">${c.ComponentType}</span>
                  </li>
                `)}
            </ul>
          `:A}
    `:A}},f.PpCrossRefs.styles=cl,io([m({attribute:"refs-json"})],f.PpCrossRefs.prototype,"refsJson",2),io([R()],f.PpCrossRefs.prototype,"refs",2),f.PpCrossRefs=io([I("pp-cross-refs")],f.PpCrossRefs);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class so extends No{constructor(e){if(super(e),this.it=A,e.type!==zo.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===A||e==null)return this._t=void 0,this.it=e;if(e===ve)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}so.directiveName="unsafeHTML",so.resultType=1;const no=Do(so);var ji=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function pl(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ao={exports:{}},Bi;function ul(){return Bi||(Bi=1,(function(t){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var r=(function(o){var i=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,s=0,n={},a={manual:o.Prism&&o.Prism.manual,disableWorkerMessageHandler:o.Prism&&o.Prism.disableWorkerMessageHandler,util:{encode:function h(d){return d instanceof l?new l(d.type,h(d.content),d.alias):Array.isArray(d)?d.map(h):d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(h){return Object.prototype.toString.call(h).slice(8,-1)},objId:function(h){return h.__id||Object.defineProperty(h,"__id",{value:++s}),h.__id},clone:function h(d,g){g=g||{};var b,y;switch(a.util.type(d)){case"Object":if(y=a.util.objId(d),g[y])return g[y];b={},g[y]=b;for(var k in d)d.hasOwnProperty(k)&&(b[k]=h(d[k],g));return b;case"Array":return y=a.util.objId(d),g[y]?g[y]:(b=[],g[y]=b,d.forEach(function(O,P){b[P]=h(O,g)}),b);default:return d}},getLanguage:function(h){for(;h;){var d=i.exec(h.className);if(d)return d[1].toLowerCase();h=h.parentElement}return"none"},setLanguage:function(h,d){h.className=h.className.replace(RegExp(i,"gi"),""),h.classList.add("language-"+d)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(b){var h=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(b.stack)||[])[1];if(h){var d=document.getElementsByTagName("script");for(var g in d)if(d[g].src==h)return d[g]}return null}},isActive:function(h,d,g){for(var b="no-"+d;h;){var y=h.classList;if(y.contains(d))return!0;if(y.contains(b))return!1;h=h.parentElement}return!!g}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(h,d){var g=a.util.clone(a.languages[h]);for(var b in d)g[b]=d[b];return g},insertBefore:function(h,d,g,b){b=b||a.languages;var y=b[h],k={};for(var O in y)if(y.hasOwnProperty(O)){if(O==d)for(var P in g)g.hasOwnProperty(P)&&(k[P]=g[P]);g.hasOwnProperty(O)||(k[O]=y[O])}var T=b[h];return b[h]=k,a.languages.DFS(a.languages,function(D,F){F===T&&D!=h&&(this[D]=k)}),k},DFS:function h(d,g,b,y){y=y||{};var k=a.util.objId;for(var O in d)if(d.hasOwnProperty(O)){g.call(d,O,d[O],b||O);var P=d[O],T=a.util.type(P);T==="Object"&&!y[k(P)]?(y[k(P)]=!0,h(P,g,null,y)):T==="Array"&&!y[k(P)]&&(y[k(P)]=!0,h(P,g,O,y))}}},plugins:{},highlightAll:function(h,d){a.highlightAllUnder(document,h,d)},highlightAllUnder:function(h,d,g){var b={callback:g,container:h,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",b),b.elements=Array.prototype.slice.apply(b.container.querySelectorAll(b.selector)),a.hooks.run("before-all-elements-highlight",b);for(var y=0,k;k=b.elements[y++];)a.highlightElement(k,d===!0,b.callback)},highlightElement:function(h,d,g){var b=a.util.getLanguage(h),y=a.languages[b];a.util.setLanguage(h,b);var k=h.parentElement;k&&k.nodeName.toLowerCase()==="pre"&&a.util.setLanguage(k,b);var O=h.textContent,P={element:h,language:b,grammar:y,code:O};function T(F){P.highlightedCode=F,a.hooks.run("before-insert",P),P.element.innerHTML=P.highlightedCode,a.hooks.run("after-highlight",P),a.hooks.run("complete",P),g&&g.call(P.element)}if(a.hooks.run("before-sanity-check",P),k=P.element.parentElement,k&&k.nodeName.toLowerCase()==="pre"&&!k.hasAttribute("tabindex")&&k.setAttribute("tabindex","0"),!P.code){a.hooks.run("complete",P),g&&g.call(P.element);return}if(a.hooks.run("before-highlight",P),!P.grammar){T(a.util.encode(P.code));return}if(d&&o.Worker){var D=new Worker(a.filename);D.onmessage=function(F){T(F.data)},D.postMessage(JSON.stringify({language:P.language,code:P.code,immediateClose:!0}))}else T(a.highlight(P.code,P.grammar,P.language))},highlight:function(h,d,g){var b={code:h,grammar:d,language:g};if(a.hooks.run("before-tokenize",b),!b.grammar)throw new Error('The language "'+b.language+'" has no grammar.');return b.tokens=a.tokenize(b.code,b.grammar),a.hooks.run("after-tokenize",b),l.stringify(a.util.encode(b.tokens),b.language)},tokenize:function(h,d){var g=d.rest;if(g){for(var b in g)d[b]=g[b];delete d.rest}var y=new u;return w(y,y.head,h),p(h,y,d,y.head,0),_(y)},hooks:{all:{},add:function(h,d){var g=a.hooks.all;g[h]=g[h]||[],g[h].push(d)},run:function(h,d){var g=a.hooks.all[h];if(!(!g||!g.length))for(var b=0,y;y=g[b++];)y(d)}},Token:l};o.Prism=a;function l(h,d,g,b){this.type=h,this.content=d,this.alias=g,this.length=(b||"").length|0}l.stringify=function h(d,g){if(typeof d=="string")return d;if(Array.isArray(d)){var b="";return d.forEach(function(T){b+=h(T,g)}),b}var y={type:d.type,content:h(d.content,g),tag:"span",classes:["token",d.type],attributes:{},language:g},k=d.alias;k&&(Array.isArray(k)?Array.prototype.push.apply(y.classes,k):y.classes.push(k)),a.hooks.run("wrap",y);var O="";for(var P in y.attributes)O+=" "+P+'="'+(y.attributes[P]||"").replace(/"/g,"&quot;")+'"';return"<"+y.tag+' class="'+y.classes.join(" ")+'"'+O+">"+y.content+"</"+y.tag+">"};function c(h,d,g,b){h.lastIndex=d;var y=h.exec(g);if(y&&b&&y[1]){var k=y[1].length;y.index+=k,y[0]=y[0].slice(k)}return y}function p(h,d,g,b,y,k){for(var O in g)if(!(!g.hasOwnProperty(O)||!g[O])){var P=g[O];P=Array.isArray(P)?P:[P];for(var T=0;T<P.length;++T){if(k&&k.cause==O+","+T)return;var D=P[T],F=D.inside,oe=!!D.lookbehind,U=!!D.greedy,fe=D.alias;if(U&&!D.pattern.global){var ie=D.pattern.toString().match(/[imsuy]*$/)[0];D.pattern=RegExp(D.pattern.source,ie+"g")}for(var W=D.pattern||D,L=b.next,j=y;L!==d.tail&&!(k&&j>=k.reach);j+=L.value.length,L=L.next){var ke=L.value;if(d.length>h.length)return;if(!(ke instanceof l)){var ir=1,se;if(U){if(se=c(W,j,h,oe),!se||se.index>=h.length)break;var sr=se.index,Ll=se.index+se[0].length,Ae=j;for(Ae+=L.value.length;sr>=Ae;)L=L.next,Ae+=L.value.length;if(Ae-=L.value.length,j=Ae,L.value instanceof l)continue;for(var At=L;At!==d.tail&&(Ae<Ll||typeof At.value=="string");At=At.next)ir++,Ae+=At.value.length;ir--,ke=h.slice(j,Ae),se.index-=j}else if(se=c(W,0,ke,oe),!se)continue;var sr=se.index,nr=se[0],lo=ke.slice(0,sr),Ii=ke.slice(sr+nr.length),co=j+ke.length;k&&co>k.reach&&(k.reach=co);var ar=L.prev;lo&&(ar=w(d,ar,lo),j+=lo.length),v(d,ar,ir);var Rl=new l(O,F?a.tokenize(nr,F):nr,fe,nr);if(L=w(d,ar,Rl),Ii&&w(d,L,Ii),ir>1){var ho={cause:O+","+T,reach:co};p(h,d,g,L.prev,j,ho),k&&ho.reach>k.reach&&(k.reach=ho.reach)}}}}}}function u(){var h={value:null,prev:null,next:null},d={value:null,prev:h,next:null};h.next=d,this.head=h,this.tail=d,this.length=0}function w(h,d,g){var b=d.next,y={value:g,prev:d,next:b};return d.next=y,b.prev=y,h.length++,y}function v(h,d,g){for(var b=d.next,y=0;y<g&&b!==h.tail;y++)b=b.next;d.next=b,b.prev=d,h.length-=y}function _(h){for(var d=[],g=h.head.next;g!==h.tail;)d.push(g.value),g=g.next;return d}if(!o.document)return o.addEventListener&&(a.disableWorkerMessageHandler||o.addEventListener("message",function(h){var d=JSON.parse(h.data),g=d.language,b=d.code,y=d.immediateClose;o.postMessage(a.highlight(b,a.languages[g],g)),y&&o.close()},!1)),a;var C=a.util.currentScript();C&&(a.filename=C.src,C.hasAttribute("data-manual")&&(a.manual=!0));function S(){a.manual||a.highlightAll()}if(!a.manual){var E=document.readyState;E==="loading"||E==="interactive"&&C&&C.defer?document.addEventListener("DOMContentLoaded",S):window.requestAnimationFrame?window.requestAnimationFrame(S):window.setTimeout(S,16)}return a})(e);t.exports&&(t.exports=r),typeof ji<"u"&&(ji.Prism=r),r.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},r.languages.markup.tag.inside["attr-value"].inside.entity=r.languages.markup.entity,r.languages.markup.doctype.inside["internal-subset"].inside=r.languages.markup,r.hooks.add("wrap",function(o){o.type==="entity"&&(o.attributes.title=o.content.replace(/&amp;/,"&"))}),Object.defineProperty(r.languages.markup.tag,"addInlined",{value:function(i,s){var n={};n["language-"+s]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:r.languages[s]},n.cdata=/^<!\[CDATA\[|\]\]>$/i;var a={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:n}};a["language-"+s]={pattern:/[\s\S]+/,inside:r.languages[s]};var l={};l[i]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return i}),"i"),lookbehind:!0,greedy:!0,inside:a},r.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(r.languages.markup.tag,"addAttribute",{value:function(o,i){r.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+o+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[i,"language-"+i],inside:r.languages[i]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),r.languages.html=r.languages.markup,r.languages.mathml=r.languages.markup,r.languages.svg=r.languages.markup,r.languages.xml=r.languages.extend("markup",{}),r.languages.ssml=r.languages.xml,r.languages.atom=r.languages.xml,r.languages.rss=r.languages.xml,(function(o){var i=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;o.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+i.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+i.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+i.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+i.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:i,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},o.languages.css.atrule.inside.rest=o.languages.css;var s=o.languages.markup;s&&(s.tag.addInlined("style","css"),s.tag.addAttribute("style","css"))})(r),r.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},r.languages.javascript=r.languages.extend("clike",{"class-name":[r.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),r.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,r.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:r.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:r.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:r.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:r.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:r.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),r.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:r.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),r.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),r.languages.markup&&(r.languages.markup.tag.addInlined("script","javascript"),r.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),r.languages.js=r.languages.javascript,(function(){if(typeof r>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var o="Loading…",i=function(C,S){return"✖ Error "+C+" while fetching file: "+S},s="✖ Error: File does not exist or is empty",n={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},a="data-src-status",l="loading",c="loaded",p="failed",u="pre[data-src]:not(["+a+'="'+c+'"]):not(['+a+'="'+l+'"])';function w(C,S,E){var h=new XMLHttpRequest;h.open("GET",C,!0),h.onreadystatechange=function(){h.readyState==4&&(h.status<400&&h.responseText?S(h.responseText):h.status>=400?E(i(h.status,h.statusText)):E(s))},h.send(null)}function v(C){var S=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(C||"");if(S){var E=Number(S[1]),h=S[2],d=S[3];return h?d?[E,Number(d)]:[E,void 0]:[E,E]}}r.hooks.add("before-highlightall",function(C){C.selector+=", "+u}),r.hooks.add("before-sanity-check",function(C){var S=C.element;if(S.matches(u)){C.code="",S.setAttribute(a,l);var E=S.appendChild(document.createElement("CODE"));E.textContent=o;var h=S.getAttribute("data-src"),d=C.language;if(d==="none"){var g=(/\.(\w+)$/.exec(h)||[,"none"])[1];d=n[g]||g}r.util.setLanguage(E,d),r.util.setLanguage(S,d);var b=r.plugins.autoloader;b&&b.loadLanguages(d),w(h,function(y){S.setAttribute(a,c);var k=v(S.getAttribute("data-range"));if(k){var O=y.split(/\r\n?|\n/g),P=k[0],T=k[1]==null?O.length:k[1];P<0&&(P+=O.length),P=Math.max(0,Math.min(P-1,O.length)),T<0&&(T+=O.length),T=Math.max(0,Math.min(T,O.length)),y=O.slice(P,T).join(`
`),S.hasAttribute("data-start")||S.setAttribute("data-start",String(P+1))}E.textContent=y,r.highlightElement(E)},function(y){S.setAttribute(a,p),E.textContent=y})}}),r.plugins.fileHighlight={highlight:function(S){for(var E=(S||document).querySelectorAll(u),h=0,d;d=E[h++];)r.highlightElement(d)}};var _=!1;r.fileHighlight=function(){_||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),_=!0),r.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(ao)),ao.exports}var fl=ul();const it=pl(fl);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json;const gl=z`
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
`,ml=z`
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
`;var vl=Object.defineProperty,yl=Object.getOwnPropertyDescriptor,or=(t,e,r,o)=>{for(var i=o>1?void 0:o?yl(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&vl(e,r,i),i};it.manual=!0,f.PpExampleBlock=class extends N{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(e){if(e.has("exampleJson")&&this.exampleJson)try{const r=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(r,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return A;let e;try{e=it.highlight(this.formatted,it.languages.json,"json")}catch{e=this.formatted}return x`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${no(e)}</code></pre>
      </details>
    `}},f.PpExampleBlock.styles=[gl,ml],or([m()],f.PpExampleBlock.prototype,"name",2),or([m({attribute:"example-json"})],f.PpExampleBlock.prototype,"exampleJson",2),or([R()],f.PpExampleBlock.prototype,"formatted",2),f.PpExampleBlock=or([I("pp-example-block")],f.PpExampleBlock),(function(t){var e=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,o="(?:"+r.source+"(?:[ 	]+"+e.source+")?|"+e.source+"(?:[ 	]+"+r.source+")?)",i=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),s=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function n(a,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<value>>/g,function(){return a});return RegExp(c,l)}t.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return o})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<key>>/g,function(){return"(?:"+i+"|"+s+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:n(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:n(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:n(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:n(s),lookbehind:!0,greedy:!0},number:{pattern:n(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:e,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},t.languages.yml=t.languages.yaml})(Prism);const bl=z`
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
`;var wl=Object.defineProperty,$l=Object.getOwnPropertyDescriptor,de=(t,e,r,o)=>{for(var i=o>1?void 0:o?$l(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&wl(e,r,i),i};it.manual=!0,f.PpCodeViewer=class extends N{constructor(){super(...arguments),this.code="",this.language="json",this.pretty=!1,this.lineNumbers=!1,this.highlightLines="",this.startLine=1,this.location="",this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:"",language:"",segments:[]}}get displayCode(){if(!this.code)return"";if(this.pretty&&this.language==="json")try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(e){const r=new Set;if(!e)return r;for(const o of e.split(",")){const s=o.trim().match(/^(\d+)(?:-(\d+))?$/);if(!s)continue;const n=parseInt(s[1],10),a=s[2]?parseInt(s[2],10):n;for(let l=Math.min(n,a);l<=Math.max(n,a);l++)r.add(l)}return r}highlightCode(){const e=this.displayCode;if(!e)return"";try{return it.highlight(e,it.languages[this.language],this.language)}catch{return e}}splitHighlightedLines(e){const r=[];let o="";const i=[];let s=0;for(;s<e.length;)if(e[s]===`
`){for(let n=i.length-1;n>=0;n--)o+="</span>";r.push(o),o=i.join(""),s++}else if(e[s]==="<")if(e.startsWith("</span>",s))o+="</span>",i.pop(),s+=7;else{const n=e.indexOf(">",s);if(n===-1){o+=e[s],s++;continue}const a=e.slice(s,n+1);o+=a,a.startsWith("</")||i.push(a),s=n+1}else o+=e[s],s++;for(let n=i.length-1;n>=0;n--)o+="</span>";return o&&r.push(o),r}getLineSegments(){const e=this.displayCode;if(e===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;const r=this.highlightCode(),o=r?this.splitHighlightedLines(r):[];return this._segmentCache={code:e,language:this.language,segments:o},o}get effectiveHighlights(){const e=this.parseHighlightSpec(this.highlightLines);return e.size>0?e:this.selectedLines}get isLocked(){return this.parseHighlightSpec(this.highlightLines).size>0}handleLineClick(e,r){if(this.isLocked)return;const o=new Set;if(r.shiftKey&&this.lastClickedLine!==null){const i=Math.min(this.lastClickedLine,e),s=Math.max(this.lastClickedLine,e);for(let n=i;n<=s;n++)o.add(n)}else this.selectedLines.size===1&&this.selectedLines.has(e)||o.add(e);this.selectedLines=o,this.lastClickedLine=e}willUpdate(e){(e.has("code")||e.has("language"))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?x`<div class="location">${this.location}</div>`:A}render(){if(!this.lineNumbers)return x`
              <pre class="language-${this.language}"><code>${no(this.highlightCode())}</code></pre>
              ${this.renderLocation()}
            `;const e=this.getLineSegments(),r=Math.max(this.startLine,1),o=r+e.length-1,i=o>0?Math.floor(Math.log10(o))+1:1,s=this.effectiveHighlights,n=this.isLocked;return x`
          <div class="lined-code${n?" locked":""}" style="--gutter-digits: ${i}">
            <pre class="language-${this.language}"><code>${e.map((a,l)=>{const c=r+l,p=s.has(c);return x`<span class="line${p?" highlighted":""}"
                ><span class="line-number"
                       @click=${u=>this.handleLineClick(c,u)}
                >${c}</span><span class="line-content">${no(a||" ")}</span>
</span>`})}</code></pre>
          </div>
          ${this.renderLocation()}
        `}},f.PpCodeViewer.styles=[bl],de([m()],f.PpCodeViewer.prototype,"code",2),de([m()],f.PpCodeViewer.prototype,"language",2),de([m({type:Boolean})],f.PpCodeViewer.prototype,"pretty",2),de([m({attribute:"line-numbers",type:Boolean})],f.PpCodeViewer.prototype,"lineNumbers",2),de([m({attribute:"highlight-lines"})],f.PpCodeViewer.prototype,"highlightLines",2),de([m({attribute:"start-line",type:Number})],f.PpCodeViewer.prototype,"startLine",2),de([m()],f.PpCodeViewer.prototype,"location",2),de([R()],f.PpCodeViewer.prototype,"selectedLines",2),de([R()],f.PpCodeViewer.prototype,"lastClickedLine",2),f.PpCodeViewer=de([I("pp-code-viewer")],f.PpCodeViewer);const xl=z`
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
`;var _l=Object.defineProperty,kl=Object.getOwnPropertyDescriptor,re=(t,e,r,o)=>{for(var i=o>1?void 0:o?kl(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&_l(e,r,i),i};f.PpExampleDrawer=class extends N{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.copied=!1,this.rawMode=!1,this.highlightLines="",this.startLine=1,this.location="",this.handleShowExample=e=>{const r=e.detail;this.title=r.title,this.json=r.json,this.yaml=r.yaml||"",this.rawMode=r.rawMode??!1,this.highlightLines=r.highlightLines||"",this.startLine=r.startLine??1,this.location=r.location||"",this.format=r.json?"json":r.yaml?"yaml":"json",this.updateComplete.then(()=>{const o=this.drawer;o&&(o.updateComplete?o.updateComplete.then(()=>o.show()):o.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get copyText(){var r;const e=(r=this.shadowRoot)==null?void 0:r.querySelector("pp-code-viewer");return e?e.displayCode:this.format==="yaml"&&this.yaml?this.yaml:this.json}async copyToClipboard(){const e=this.copyText;if(e)try{await navigator.clipboard.writeText(e),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}catch{}}render(){const e=this.format==="yaml"&&this.yaml?this.yaml:this.json,r=this.format==="yaml"?"yaml":"json";return x`
      <sl-drawer label=${this.title||"Example"} placement="end">
        ${this.yaml?x`
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
    `}},f.PpExampleDrawer.styles=[xl],re([R()],f.PpExampleDrawer.prototype,"title",2),re([R()],f.PpExampleDrawer.prototype,"json",2),re([R()],f.PpExampleDrawer.prototype,"yaml",2),re([R()],f.PpExampleDrawer.prototype,"format",2),re([R()],f.PpExampleDrawer.prototype,"copied",2),re([R()],f.PpExampleDrawer.prototype,"rawMode",2),re([R()],f.PpExampleDrawer.prototype,"highlightLines",2),re([R()],f.PpExampleDrawer.prototype,"startLine",2),re([R()],f.PpExampleDrawer.prototype,"location",2),re([Z("sl-drawer")],f.PpExampleDrawer.prototype,"drawer",2),f.PpExampleDrawer=re([I("pp-example-drawer")],f.PpExampleDrawer);const Al=z`
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
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 0.3rem 0.6rem;
    font-family: var(--font-stack-bold, monospace);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--font-color-sub1, #a7a7a7);
    transition: color 0.15s, border-color 0.15s;
  }
  button:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    border-color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  select {
    cursor: pointer;
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 0.3rem 0.6rem;
    font-family: var(--font-stack-bold, monospace);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--font-color-sub1, #a7a7a7);
  }
  select:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    border-color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  option {
    background: var(--card-background-color, #1a1a1a);
    color: var(--font-color, #e8e9ed);
  }
`;var Pl=Object.defineProperty,Cl=Object.getOwnPropertyDescriptor,kt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Cl(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&Pl(e,r,i),i};f.PpExampleSelector=class extends N{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.entries=[]}willUpdate(e){(e.has("examplesData")||e.has("mockJson")||e.has("examplesJson"))&&this.buildEntries()}buildEntries(){const e=[];let r=this.mockJson,o={};if(this.examplesData)try{const i=JSON.parse(this.examplesData);i.mockJson&&(r=i.mockJson),i.examples&&(o=i.examples)}catch{}if(this.examplesJson)try{o={...o,...JSON.parse(this.examplesJson)}}catch{}for(const[i,s]of Object.entries(o))s&&e.push({key:i,json:s});r&&e.push({key:"Generated Example",json:r}),this.entries=e}showExample(e){let r=e.json;try{r=JSON.stringify(JSON.parse(e.json),null,2)}catch{}const o=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:e.key,json:r}});document.dispatchEvent(o)}render(){if(!this.entries.length)return A;if(this.entries.length===1){const e=this.entries[0];return x`
        <div class="selector">
          <button @click=${()=>this.showExample(e)}>${e.key}</button>
        </div>
      `}return x`
      <div class="selector">
        <select @change=${e=>{const r=e.target.selectedIndex-1;r>=0&&r<this.entries.length&&(this.showExample(this.entries[r]),e.target.selectedIndex=0)}}>
          <option disabled selected>View Example...</option>
          ${this.entries.map(e=>x`<option>${e.key}</option>`)}
        </select>
      </div>
    `}},f.PpExampleSelector.styles=Al,kt([m({attribute:"examples-data"})],f.PpExampleSelector.prototype,"examplesData",2),kt([m({attribute:"mock-json"})],f.PpExampleSelector.prototype,"mockJson",2),kt([m({attribute:"examples-json"})],f.PpExampleSelector.prototype,"examplesJson",2),kt([R()],f.PpExampleSelector.prototype,"entries",2),f.PpExampleSelector=kt([I("pp-example-selector")],f.PpExampleSelector);const Sl=z`
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
`;var El=Object.defineProperty,Ol=Object.getOwnPropertyDescriptor,He=(t,e,r,o)=>{for(var i=o>1?void 0:o?Ol(e,r):e,s=t.length-1,n;s>=0;s--)(n=t[s])&&(i=(o?n(e,r,i):n(i))||i);return o&&i&&El(e,r,i),i};f.PpRawViewerBtn=class extends N{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml="",this.highlightLines="",this.startLine=1,this.location=""}showRaw(){const e=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0}});document.dispatchEvent(e)}render(){return!this.rawJson&&!this.rawYaml?A:x`<button @click=${this.showRaw}>View Raw</button>`}},f.PpRawViewerBtn.styles=[Sl],He([m({attribute:"title"})],f.PpRawViewerBtn.prototype,"btnTitle",2),He([m({attribute:"raw-json"})],f.PpRawViewerBtn.prototype,"rawJson",2),He([m({attribute:"raw-yaml"})],f.PpRawViewerBtn.prototype,"rawYaml",2),He([m({attribute:"highlight-lines"})],f.PpRawViewerBtn.prototype,"highlightLines",2),He([m({attribute:"start-line",type:Number})],f.PpRawViewerBtn.prototype,"startLine",2),He([m()],f.PpRawViewerBtn.prototype,"location",2),f.PpRawViewerBtn=He([I("pp-raw-viewer-btn")],f.PpRawViewerBtn),br("static/shoelace");const Tl={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'};return ws("default",{resolver:t=>{const e=Tl[t];return e?`data:image/svg+xml,${encodeURIComponent(e)}`:`static/shoelace/assets/icons/${t}.svg`}}),Object.defineProperty(f,Symbol.toStringTag,{value:"Module"}),f})({});
