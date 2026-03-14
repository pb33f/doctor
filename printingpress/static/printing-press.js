var PrintingPress=(function(f){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ui,Hi;const At=globalThis,nr=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,lr=Symbol(),co=new WeakMap;let ho=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==lr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(nr&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=co.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&co.set(r,e))}return e}toString(){return this.cssText}};const Ji=t=>new ho(typeof t=="string"?t:t+"",void 0,lr),L=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((o,i,s)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new ho(r,t,lr)},qi=(t,e)=>{if(nr)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const o=document.createElement("style"),i=At.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},po=nr?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Ji(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Yi,defineProperty:Gi,getOwnPropertyDescriptor:Ki,getOwnPropertyNames:Xi,getOwnPropertySymbols:Zi,getPrototypeOf:Qi}=Object,ue=globalThis,uo=ue.trustedTypes,es=uo?uo.emptyScript:"",cr=ue.reactiveElementPolyfillSupport,ot=(t,e)=>t,Pt={toAttribute(t,e){switch(e){case Boolean:t=t?es:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},dr=(t,e)=>!Yi(t,e),fo={attribute:!0,type:String,converter:Pt,reflect:!1,useDefault:!1,hasChanged:dr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ue.litPropertyMetadata??(ue.litPropertyMetadata=new WeakMap);let Ue=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=fo){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&Gi(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:s}=Ki(this.prototype,e)??{get(){return this[r]},set(a){this[r]=a}};return{get:i,set(a){const n=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??fo}static _$Ei(){if(this.hasOwnProperty(ot("elementProperties")))return;const e=Qi(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ot("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ot("properties"))){const r=this.properties,o=[...Xi(r),...Zi(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(po(i))}else e!==void 0&&r.push(po(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(r=>r(this))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qi(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)})}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var s;const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const a=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:Pt).toAttribute(r,o.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,r){var s,a;const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const n=o.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Pt;this._$Em=i;const c=l.fromAttribute(r,n.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(e,r,o,i=!1,s){var a;if(e!==void 0){const n=this.constructor;if(i===!1&&(s=this[e]),o??(o=n.getPropertyOptions(e)),!((o.hasChanged??dr)(s,r)||o.useDefault&&o.reflect&&s===((a=this._$Ej)==null?void 0:a.get(e))&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:s},a){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??r??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:n}=a,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach(i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)}),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach(o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(r=>this._$ET(r,this[r]))),this._$EM()}updated(e){}firstUpdated(e){}};Ue.elementStyles=[],Ue.shadowRootOptions={mode:"open"},Ue[ot("elementProperties")]=new Map,Ue[ot("finalized")]=new Map,cr==null||cr({ReactiveElement:Ue}),(ue.reactiveElementVersions??(ue.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const it=globalThis,mo=t=>t,kt=it.trustedTypes,go=kt?kt.createPolicy("lit-html",{createHTML:t=>t}):void 0,vo="$lit$",fe=`lit$${Math.random().toFixed(9).slice(2)}$`,yo="?"+fe,ts=`<${yo}>`,Ae=document,st=()=>Ae.createComment(""),at=t=>t===null||typeof t!="object"&&typeof t!="function",hr=Array.isArray,rs=t=>hr(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",pr=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bo=/-->/g,wo=/>/g,Pe=RegExp(`>|${pr}(?:([^\\s"'>=/]+)(${pr}*=${pr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$o=/'/g,xo=/"/g,_o=/^(?:script|style|textarea|title)$/i,os=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),x=os(1),me=Symbol.for("lit-noChange"),P=Symbol.for("lit-nothing"),Ao=new WeakMap,ke=Ae.createTreeWalker(Ae,129);function Po(t,e){if(!hr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return go!==void 0?go.createHTML(e):e}const is=(t,e)=>{const r=t.length-1,o=[];let i,s=e===2?"<svg>":e===3?"<math>":"",a=nt;for(let n=0;n<r;n++){const l=t[n];let c,p,u=-1,w=0;for(;w<l.length&&(a.lastIndex=w,p=a.exec(l),p!==null);)w=a.lastIndex,a===nt?p[1]==="!--"?a=bo:p[1]!==void 0?a=wo:p[2]!==void 0?(_o.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=Pe):p[3]!==void 0&&(a=Pe):a===Pe?p[0]===">"?(a=i??nt,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,c=p[1],a=p[3]===void 0?Pe:p[3]==='"'?xo:$o):a===xo||a===$o?a=Pe:a===bo||a===wo?a=nt:(a=Pe,i=void 0);const g=a===Pe&&t[n+1].startsWith("/>")?" ":"";s+=a===nt?l+ts:u>=0?(o.push(c),l.slice(0,u)+vo+l.slice(u)+fe+g):l+fe+(u===-2?n:g)}return[Po(t,s+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};let ur=class Vi{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let s=0,a=0;const n=e.length-1,l=this.parts,[c,p]=is(e,r);if(this.el=Vi.createElement(c,o),ke.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=ke.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(vo)){const w=p[a++],g=i.getAttribute(u).split(fe),_=/([.?@])?(.*)/.exec(w);l.push({type:1,index:s,name:_[2],strings:g,ctor:_[1]==="."?as:_[1]==="?"?ns:_[1]==="@"?ls:Et}),i.removeAttribute(u)}else u.startsWith(fe)&&(l.push({type:6,index:s}),i.removeAttribute(u));if(_o.test(i.tagName)){const u=i.textContent.split(fe),w=u.length-1;if(w>0){i.textContent=kt?kt.emptyScript:"";for(let g=0;g<w;g++)i.append(u[g],st()),ke.nextNode(),l.push({type:2,index:++s});i.append(u[w],st())}}}else if(i.nodeType===8)if(i.data===yo)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(fe,u+1))!==-1;)l.push({type:7,index:s}),u+=fe.length-1}s++}}static createElement(e,r){const o=Ae.createElement("template");return o.innerHTML=e,o}};function He(t,e,r=t,o){var a,n;if(e===me)return e;let i=o!==void 0?(a=r._$Co)==null?void 0:a[o]:r._$Cl;const s=at(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(e=He(t,i._$AS(t,e.values),i,o)),e}let ss=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=((e==null?void 0:e.creationScope)??Ae).importNode(r,!0);ke.currentNode=i;let s=ke.nextNode(),a=0,n=0,l=o[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new fr(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new cs(s,this,e)),this._$AV.push(c),l=o[++n]}a!==(l==null?void 0:l.index)&&(s=ke.nextNode(),a++)}return ke.currentNode=Ae,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}},fr=class Wi{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=He(this,e,r),at(e)?e===P||e==null||e===""?(this._$AH!==P&&this._$AR(),this._$AH=P):e!==this._$AH&&e!==me&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):rs(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==P&&at(this._$AH)?this._$AA.nextSibling.data=e:this.T(Ae.createTextNode(e)),this._$AH=e}$(e){var s;const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=ur.createElement(Po(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(r);else{const a=new ss(i,this),n=a.u(this.options);a.p(r),this.T(n),this._$AH=a}}_$AC(e){let r=Ao.get(e.strings);return r===void 0&&Ao.set(e.strings,r=new ur(e)),r}k(e){hr(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of e)i===r.length?r.push(o=new Wi(this.O(st()),this.O(st()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const i=mo(e).nextSibling;mo(e).remove(),e=i}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}},Et=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,s){this.type=1,this._$AH=P,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=P}_$AI(e,r=this,o,i){const s=this.strings;let a=!1;if(s===void 0)e=He(this,e,r,0),a=!at(e)||e!==this._$AH&&e!==me,a&&(this._$AH=e);else{const n=e;let l,c;for(e=s[0],l=0;l<s.length-1;l++)c=He(this,n[o+l],r,l),c===me&&(c=this._$AH[l]),a||(a=!at(c)||c!==this._$AH[l]),c===P?e=P:e!==P&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(e)}j(e){e===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},as=class extends Et{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===P?void 0:e}},ns=class extends Et{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==P)}},ls=class extends Et{constructor(e,r,o,i,s){super(e,r,o,i,s),this.type=5}_$AI(e,r=this){if((e=He(this,e,r,0)??P)===me)return;const o=this._$AH,i=e===P&&o!==P||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==P&&(o===P||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}};class cs{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){He(this,e)}}const mr=it.litHtmlPolyfillSupport;mr==null||mr(ur,fr),(it.litHtmlVersions??(it.litHtmlVersions=[])).push("3.3.2");const ds=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let i=o._$litPart$;if(i===void 0){const s=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new fr(e.insertBefore(st(),s),s,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ee=globalThis;let F=class extends Ue{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ds(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return me}};F._$litElement$=!0,F.finalized=!0,(Ui=Ee.litElementHydrateSupport)==null||Ui.call(Ee,{LitElement:F});const gr=Ee.litElementPolyfillSupport;gr==null||gr({LitElement:F}),(Ee.litElementVersions??(Ee.litElementVersions=[])).push("4.2.2");var hs=L`
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
`,ps=L`
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
`,vr="";function yr(t){vr=t}function us(t=""){if(!vr){const e=[...document.getElementsByTagName("script")],r=e.find(o=>o.hasAttribute("data-shoelace"));if(r)yr(r.getAttribute("data-shoelace"));else{const o=e.find(s=>/shoelace(\.min)?\.js($|\?)/.test(s.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(s.src));let i="";o&&(i=o.getAttribute("src")),yr(i.split("/").slice(0,-1).join("/"))}}return vr.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var fs={name:"default",resolver:t=>us(`assets/icons/${t}.svg`)},ms=fs,ko={caret:`
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
  `},gs={name:"system",resolver:t=>t in ko?`data:image/svg+xml,${encodeURIComponent(ko[t])}`:""},vs=gs,St=[ms,vs],Ct=[];function ys(t){Ct.push(t)}function bs(t){Ct=Ct.filter(e=>e!==t)}function Eo(t){return St.find(e=>e.name===t)}function ws(t,e){$s(t),St.push({name:t,resolver:e.resolver,mutator:e.mutator,spriteSheet:e.spriteSheet}),Ct.forEach(r=>{r.library===t&&r.setIcon()})}function $s(t){St=St.filter(e=>e.name!==t)}var xs=L`
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
`,So=Object.defineProperty,_s=Object.defineProperties,As=Object.getOwnPropertyDescriptor,Ps=Object.getOwnPropertyDescriptors,Co=Object.getOwnPropertySymbols,ks=Object.prototype.hasOwnProperty,Es=Object.prototype.propertyIsEnumerable,br=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),wr=t=>{throw TypeError(t)},Oo=(t,e,r)=>e in t?So(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,Ot=(t,e)=>{for(var r in e||(e={}))ks.call(e,r)&&Oo(t,r,e[r]);if(Co)for(var r of Co(e))Es.call(e,r)&&Oo(t,r,e[r]);return t},To=(t,e)=>_s(t,Ps(e)),$=(t,e,r,o)=>{for(var i=o>1?void 0:o?As(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&So(e,r,i),i},Ro=(t,e,r)=>e.has(t)||wr("Cannot "+r),Ss=(t,e,r)=>(Ro(t,e,"read from private field"),e.get(t)),Cs=(t,e,r)=>e.has(t)?wr("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Os=(t,e,r,o)=>(Ro(t,e,"write to private field"),e.set(t,r),r),Ts=function(t,e){this[0]=t,this[1]=e},Rs=t=>{var e=t[br("asyncIterator")],r=!1,o,i={};return e==null?(e=t[br("iterator")](),o=s=>i[s]=a=>e[s](a)):(e=e.call(t),o=s=>i[s]=a=>{if(r){if(r=!1,s==="throw")throw a;return a}return r=!0,{done:!1,value:new Ts(new Promise(n=>{var l=e[s](a);l instanceof Object||wr("Object expected"),n(l)}),1)}}),i[br("iterator")]=()=>i,o("next"),"throw"in e?o("throw"):i.throw=s=>{throw s},"return"in e&&o("return"),i};function se(t,e){const r=Ot({waitUntilFirstUpdate:!1},e);return(o,i)=>{const{update:s}=o,a=Array.isArray(t)?t:[t];o.update=function(n){a.forEach(l=>{const c=l;if(n.has(c)){const p=n.get(c),u=this[c];p!==u&&(!r.waitUntilFirstUpdate||this.hasUpdated)&&this[i](p,u)}}),s.call(this,n)}}}var Se=L`
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
 */const V=t=>(e,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ms={attribute:!0,type:String,converter:Pt,reflect:!1,hasChanged:dr},zs=(t=Ms,e,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),o==="accessor"){const{name:a}=r;return{set(n){const l=e.get.call(this);e.set.call(this,n),this.requestUpdate(a,l,t,!0,n)},init(n){return n!==void 0&&this.C(a,void 0,t,n),n}}}if(o==="setter"){const{name:a}=r;return function(n){const l=this[a];e.call(this,n),this.requestUpdate(a,l,t,!0,n)}}throw Error("Unsupported decorator location: "+o)};function b(t){return(e,r)=>typeof r=="object"?zs(t,e,r):((o,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),a?Object.getOwnPropertyDescriptor(i,s):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function N(t){return b({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ls=(t,e,r)=>(r.configurable=!0,r.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(t,e,r),r);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Z(t,e){return(r,o,i)=>{const s=a=>{var n;return((n=a.renderRoot)==null?void 0:n.querySelector(t))??null};return Ls(r,o,{get(){return s(this)}})}}var Tt,Q=class extends F{constructor(){super(),Cs(this,Tt,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([t,e])=>{this.constructor.define(t,e)})}emit(t,e){const r=new CustomEvent(t,Ot({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(r),r}static define(t,e=this,r={}){const o=customElements.get(t);if(!o){try{customElements.define(t,e,r)}catch{customElements.define(t,class extends e{},r)}return}let i=" (unknown version)",s=i;"version"in e&&e.version&&(i=" v"+e.version),"version"in o&&o.version&&(s=" v"+o.version),!(i&&s&&i===s)&&console.warn(`Attempted to register <${t}>${i}, but <${t}>${s} has already been registered.`)}attributeChangedCallback(t,e,r){Ss(this,Tt)||(this.constructor.elementProperties.forEach((o,i)=>{o.reflect&&this[i]!=null&&this.initialReflectedProperties.set(i,this[i])}),Os(this,Tt,!0)),super.attributeChangedCallback(t,e,r)}willUpdate(t){super.willUpdate(t),this.initialReflectedProperties.forEach((e,r)=>{t.has(r)&&this[r]==null&&(this[r]=e)})}};Tt=new WeakMap,Q.version="2.20.1",Q.dependencies={},$([b()],Q.prototype,"dir",2),$([b()],Q.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ns=(t,e)=>(t==null?void 0:t._$litType$)!==void 0;var lt=Symbol(),Rt=Symbol(),$r,xr=new Map,ae=class extends Q{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var r;let o;if(e!=null&&e.spriteSheet)return this.svg=x`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`,this.svg;try{if(o=await fetch(t,{mode:"cors"}),!o.ok)return o.status===410?lt:Rt}catch{return Rt}try{const i=document.createElement("div");i.innerHTML=await o.text();const s=i.firstElementChild;if(((r=s==null?void 0:s.tagName)==null?void 0:r.toLowerCase())!=="svg")return lt;$r||($r=new DOMParser);const n=$r.parseFromString(s.outerHTML,"text/html").body.querySelector("svg");return n?(n.part.add("svg"),document.adoptNode(n)):lt}catch{return lt}}connectedCallback(){super.connectedCallback(),ys(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),bs(this)}getIconSource(){const t=Eo(this.library);return this.name&&t?{url:t.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label=="string"&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const{url:e,fromLibrary:r}=this.getIconSource(),o=r?Eo(this.library):void 0;if(!e){this.svg=null;return}let i=xr.get(e);if(i||(i=this.resolveIcon(e,o),xr.set(e,i)),!this.initialRender)return;const s=await i;if(s===Rt&&xr.delete(e),e===this.getIconSource().url){if(Ns(s)){if(this.svg=s,o){await this.updateComplete;const a=this.shadowRoot.querySelector("[part='svg']");typeof o.mutator=="function"&&a&&o.mutator(a)}return}switch(s){case Rt:case lt:this.svg=null,this.emit("sl-error");break;default:this.svg=s.cloneNode(!0),(t=o==null?void 0:o.mutator)==null||t.call(o,this.svg),this.emit("sl-load")}}}render(){return this.svg}};ae.styles=[Se,xs],$([N()],ae.prototype,"svg",2),$([b({reflect:!0})],ae.prototype,"name",2),$([b()],ae.prototype,"src",2),$([b()],ae.prototype,"label",2),$([b({reflect:!0})],ae.prototype,"library",2),$([se("label")],ae.prototype,"handleLabelChange",1),$([se(["name","src","library"])],ae.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Mo={ATTRIBUTE:1,CHILD:2},zo=t=>(...e)=>({_$litDirective$:t,values:e});let Lo=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,r,o){this._$Ct=e,this._$AM=r,this._$Ci=o}_$AS(e,r){return this.update(e,r)}update(e,r){return this.render(...r)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie=zo(class extends Lo{constructor(t){var e;if(super(t),t.type!==Mo.ATTRIBUTE||t.name!=="class"||((e=t.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var o,i;if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(s=>s!=="")));for(const s in e)e[s]&&!((o=this.nt)!=null&&o.has(s))&&this.st.add(s);return this.render(e)}const r=t.element.classList;for(const s of this.st)s in e||(r.remove(s),this.st.delete(s));for(const s in e){const a=!!e[s];a===this.st.has(s)||(i=this.nt)!=null&&i.has(s)||(a?(r.add(s),this.st.add(s)):(r.remove(s),this.st.delete(s)))}return me}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const No=Symbol.for(""),Fs=t=>{if((t==null?void 0:t.r)===No)return t==null?void 0:t._$litStatic$},Fo=(t,...e)=>({_$litStatic$:e.reduce((r,o,i)=>r+(s=>{if(s._$litStatic$!==void 0)return s._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${s}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+t[i+1],t[0]),r:No}),Do=new Map,Ds=t=>(e,...r)=>{const o=r.length;let i,s;const a=[],n=[];let l,c=0,p=!1;for(;c<o;){for(l=e[c];c<o&&(s=r[c],(i=Fs(s))!==void 0);)l+=i+e[++c],p=!0;c!==o&&n.push(s),a.push(l),c++}if(c===o&&a.push(e[o]),p){const u=a.join("$$lit$$");(e=Do.get(u))===void 0&&(a.raw=a,Do.set(u,e=a)),r=n}return t(e,...r)},js=Ds(x);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const J=t=>t??P;var I=class extends Q{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Fo`a`:Fo`button`;return js`
      <${e}
        part="base"
        class=${Ie({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${J(t?void 0:this.disabled)}
        type=${J(t?void 0:"button")}
        href=${J(t?this.href:void 0)}
        target=${J(t?this.target:void 0)}
        download=${J(t?this.download:void 0)}
        rel=${J(t&&this.target?"noreferrer noopener":void 0)}
        role=${J(t?void 0:"button")}
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
      </${e}>
    `}};I.styles=[Se,ps],I.dependencies={"sl-icon":ae},$([Z(".icon-button")],I.prototype,"button",2),$([N()],I.prototype,"hasFocus",2),$([b()],I.prototype,"name",2),$([b()],I.prototype,"library",2),$([b()],I.prototype,"src",2),$([b()],I.prototype,"href",2),$([b()],I.prototype,"target",2),$([b()],I.prototype,"download",2),$([b()],I.prototype,"label",2),$([b({type:Boolean,reflect:!0})],I.prototype,"disabled",2);const _r=new Set,Ve=new Map;let Ce,Ar="ltr",Pr="en";const jo=typeof MutationObserver<"u"&&typeof document<"u"&&typeof document.documentElement<"u";if(jo){const t=new MutationObserver(Uo);Ar=document.documentElement.dir||"ltr",Pr=document.documentElement.lang||navigator.language,t.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]})}function Bo(...t){t.map(e=>{const r=e.$code.toLowerCase();Ve.has(r)?Ve.set(r,Object.assign(Object.assign({},Ve.get(r)),e)):Ve.set(r,e),Ce||(Ce=e)}),Uo()}function Uo(){jo&&(Ar=document.documentElement.dir||"ltr",Pr=document.documentElement.lang||navigator.language),[..._r.keys()].map(t=>{typeof t.requestUpdate=="function"&&t.requestUpdate()})}let Bs=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){_r.add(this.host)}hostDisconnected(){_r.delete(this.host)}dir(){return`${this.host.dir||Ar}`.toLowerCase()}lang(){return`${this.host.lang||Pr}`.toLowerCase()}getTranslationData(e){var r,o;const i=new Intl.Locale(e.replace(/_/g,"-")),s=i==null?void 0:i.language.toLowerCase(),a=(o=(r=i==null?void 0:i.region)===null||r===void 0?void 0:r.toLowerCase())!==null&&o!==void 0?o:"",n=Ve.get(`${s}-${a}`),l=Ve.get(s);return{locale:i,language:s,region:a,primary:n,secondary:l}}exists(e,r){var o;const{primary:i,secondary:s}=this.getTranslationData((o=r.lang)!==null&&o!==void 0?o:this.lang());return r=Object.assign({includeFallback:!1},r),!!(i&&i[e]||s&&s[e]||r.includeFallback&&Ce&&Ce[e])}term(e,...r){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let s;if(o&&o[e])s=o[e];else if(i&&i[e])s=i[e];else if(Ce&&Ce[e])s=Ce[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof s=="function"?s(...r):s}date(e,r){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),r).format(e)}number(e,r){return e=Number(e),isNaN(e)?"":new Intl.NumberFormat(this.lang(),r).format(e)}relativeTime(e,r,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(e,r)}};var Ho={$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>t===0?"No options selected":t===1?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"};Bo(Ho);var Us=Ho,ct=class extends Bs{};Bo(Us);var Oe=class extends Q{constructor(){super(...arguments),this.localize=new ct(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return x`
      <span
        part="base"
        class=${Ie({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
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
    `}};Oe.styles=[Se,hs],Oe.dependencies={"sl-icon-button":I},$([b({reflect:!0})],Oe.prototype,"variant",2),$([b({reflect:!0})],Oe.prototype,"size",2),$([b({type:Boolean,reflect:!0})],Oe.prototype,"pill",2),$([b({type:Boolean})],Oe.prototype,"removable",2),Oe.define("sl-tag"),I.define("sl-icon-button");var Hs=L`
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
`,Is=L`
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
`;const ge=Math.min,q=Math.max,Mt=Math.round,zt=Math.floor,ne=t=>({x:t,y:t}),Vs={left:"right",right:"left",bottom:"top",top:"bottom"};function kr(t,e,r){return q(t,ge(e,r))}function We(t,e){return typeof t=="function"?t(e):t}function ve(t){return t.split("-")[0]}function Je(t){return t.split("-")[1]}function Io(t){return t==="x"?"y":"x"}function Er(t){return t==="y"?"height":"width"}function ce(t){const e=t[0];return e==="t"||e==="b"?"y":"x"}function Sr(t){return Io(ce(t))}function Ws(t,e,r){r===void 0&&(r=!1);const o=Je(t),i=Sr(t),s=Er(i);let a=i==="x"?o===(r?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[s]>e.floating[s]&&(a=Lt(a)),[a,Lt(a)]}function Js(t){const e=Lt(t);return[Cr(t),e,Cr(e)]}function Cr(t){return t.includes("start")?t.replace("start","end"):t.replace("end","start")}const Vo=["left","right"],Wo=["right","left"],qs=["top","bottom"],Ys=["bottom","top"];function Gs(t,e,r){switch(t){case"top":case"bottom":return r?e?Wo:Vo:e?Vo:Wo;case"left":case"right":return e?qs:Ys;default:return[]}}function Ks(t,e,r,o){const i=Je(t);let s=Gs(ve(t),r==="start",o);return i&&(s=s.map(a=>a+"-"+i),e&&(s=s.concat(s.map(Cr)))),s}function Lt(t){const e=ve(t);return Vs[e]+t.slice(e.length)}function Xs(t){return{top:0,right:0,bottom:0,left:0,...t}}function Jo(t){return typeof t!="number"?Xs(t):{top:t,right:t,bottom:t,left:t}}function Nt(t){const{x:e,y:r,width:o,height:i}=t;return{width:o,height:i,top:r,left:e,right:e+o,bottom:r+i,x:e,y:r}}function qo(t,e,r){let{reference:o,floating:i}=t;const s=ce(e),a=Sr(e),n=Er(a),l=ve(e),c=s==="y",p=o.x+o.width/2-i.width/2,u=o.y+o.height/2-i.height/2,w=o[n]/2-i[n]/2;let g;switch(l){case"top":g={x:p,y:o.y-i.height};break;case"bottom":g={x:p,y:o.y+o.height};break;case"right":g={x:o.x+o.width,y:u};break;case"left":g={x:o.x-i.width,y:u};break;default:g={x:o.x,y:o.y}}switch(Je(e)){case"start":g[a]-=w*(r&&c?-1:1);break;case"end":g[a]+=w*(r&&c?-1:1);break}return g}async function Zs(t,e){var r;e===void 0&&(e={});const{x:o,y:i,platform:s,rects:a,elements:n,strategy:l}=t,{boundary:c="clippingAncestors",rootBoundary:p="viewport",elementContext:u="floating",altBoundary:w=!1,padding:g=0}=We(e,t),_=Jo(g),S=n[w?u==="floating"?"reference":"floating":u],C=Nt(await s.getClippingRect({element:(r=await(s.isElement==null?void 0:s.isElement(S)))==null||r?S:S.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(n.floating)),boundary:c,rootBoundary:p,strategy:l})),h=u==="floating"?{x:o,y:i,width:a.floating.width,height:a.floating.height}:a.reference,d=await(s.getOffsetParent==null?void 0:s.getOffsetParent(n.floating)),m=await(s.isElement==null?void 0:s.isElement(d))?await(s.getScale==null?void 0:s.getScale(d))||{x:1,y:1}:{x:1,y:1},y=Nt(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:h,offsetParent:d,strategy:l}):h);return{top:(C.top-y.top+_.top)/m.y,bottom:(y.bottom-C.bottom+_.bottom)/m.y,left:(C.left-y.left+_.left)/m.x,right:(y.right-C.right+_.right)/m.x}}const Qs=50,ea=async(t,e,r)=>{const{placement:o="bottom",strategy:i="absolute",middleware:s=[],platform:a}=r,n=a.detectOverflow?a:{...a,detectOverflow:Zs},l=await(a.isRTL==null?void 0:a.isRTL(e));let c=await a.getElementRects({reference:t,floating:e,strategy:i}),{x:p,y:u}=qo(c,o,l),w=o,g=0;const _={};for(let E=0;E<s.length;E++){const S=s[E];if(!S)continue;const{name:C,fn:h}=S,{x:d,y:m,data:y,reset:v}=await h({x:p,y:u,initialPlacement:o,placement:w,strategy:i,middlewareData:_,rects:c,platform:n,elements:{reference:t,floating:e}});p=d??p,u=m??u,_[C]={..._[C],...y},v&&g<Qs&&(g++,typeof v=="object"&&(v.placement&&(w=v.placement),v.rects&&(c=v.rects===!0?await a.getElementRects({reference:t,floating:e,strategy:i}):v.rects),{x:p,y:u}=qo(c,w,l)),E=-1)}return{x:p,y:u,placement:w,strategy:i,middlewareData:_}},ta=t=>({name:"arrow",options:t,async fn(e){const{x:r,y:o,placement:i,rects:s,platform:a,elements:n,middlewareData:l}=e,{element:c,padding:p=0}=We(t,e)||{};if(c==null)return{};const u=Jo(p),w={x:r,y:o},g=Sr(i),_=Er(g),E=await a.getDimensions(c),S=g==="y",C=S?"top":"left",h=S?"bottom":"right",d=S?"clientHeight":"clientWidth",m=s.reference[_]+s.reference[g]-w[g]-s.floating[_],y=w[g]-s.reference[g],v=await(a.getOffsetParent==null?void 0:a.getOffsetParent(c));let A=v?v[d]:0;(!A||!await(a.isElement==null?void 0:a.isElement(v)))&&(A=n.floating[d]||s.floating[_]);const O=m/2-y/2,k=A/2-E[_]/2-1,T=ge(u[C],k),z=ge(u[h],k),D=T,re=A-E[_]-z,U=A/2-E[_]/2+O,pe=kr(D,U,re),oe=!l.arrow&&Je(i)!=null&&U!==pe&&s.reference[_]/2-(U<D?T:z)-E[_]/2<0,W=oe?U<D?U-D:U-re:0;return{[g]:w[g]+W,data:{[g]:pe,centerOffset:U-pe-W,...oe&&{alignmentOffset:W}},reset:oe}}}),ra=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var r,o;const{placement:i,middlewareData:s,rects:a,initialPlacement:n,platform:l,elements:c}=e,{mainAxis:p=!0,crossAxis:u=!0,fallbackPlacements:w,fallbackStrategy:g="bestFit",fallbackAxisSideDirection:_="none",flipAlignment:E=!0,...S}=We(t,e);if((r=s.arrow)!=null&&r.alignmentOffset)return{};const C=ve(i),h=ce(n),d=ve(n)===n,m=await(l.isRTL==null?void 0:l.isRTL(c.floating)),y=w||(d||!E?[Lt(n)]:Js(n)),v=_!=="none";!w&&v&&y.push(...Ks(n,E,_,m));const A=[n,...y],O=await l.detectOverflow(e,S),k=[];let T=((o=s.flip)==null?void 0:o.overflows)||[];if(p&&k.push(O[C]),u){const U=Ws(i,a,m);k.push(O[U[0]],O[U[1]])}if(T=[...T,{placement:i,overflows:k}],!k.every(U=>U<=0)){var z,D;const U=(((z=s.flip)==null?void 0:z.index)||0)+1,pe=A[U];if(pe&&(!(u==="alignment"?h!==ce(pe):!1)||T.every(R=>ce(R.placement)===h?R.overflows[0]>0:!0)))return{data:{index:U,overflows:T},reset:{placement:pe}};let oe=(D=T.filter(W=>W.overflows[0]<=0).sort((W,R)=>W.overflows[1]-R.overflows[1])[0])==null?void 0:D.placement;if(!oe)switch(g){case"bestFit":{var re;const W=(re=T.filter(R=>{if(v){const j=ce(R.placement);return j===h||j==="y"}return!0}).map(R=>[R.placement,R.overflows.filter(j=>j>0).reduce((j,xe)=>j+xe,0)]).sort((R,j)=>R[1]-j[1])[0])==null?void 0:re[0];W&&(oe=W);break}case"initialPlacement":oe=n;break}if(i!==oe)return{reset:{placement:oe}}}return{}}}},oa=new Set(["left","top"]);async function ia(t,e){const{placement:r,platform:o,elements:i}=t,s=await(o.isRTL==null?void 0:o.isRTL(i.floating)),a=ve(r),n=Je(r),l=ce(r)==="y",c=oa.has(a)?-1:1,p=s&&l?-1:1,u=We(e,t);let{mainAxis:w,crossAxis:g,alignmentAxis:_}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:u.mainAxis||0,crossAxis:u.crossAxis||0,alignmentAxis:u.alignmentAxis};return n&&typeof _=="number"&&(g=n==="end"?_*-1:_),l?{x:g*p,y:w*c}:{x:w*c,y:g*p}}const sa=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var r,o;const{x:i,y:s,placement:a,middlewareData:n}=e,l=await ia(e,t);return a===((r=n.offset)==null?void 0:r.placement)&&(o=n.arrow)!=null&&o.alignmentOffset?{}:{x:i+l.x,y:s+l.y,data:{...l,placement:a}}}}},aa=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:r,y:o,placement:i,platform:s}=e,{mainAxis:a=!0,crossAxis:n=!1,limiter:l={fn:C=>{let{x:h,y:d}=C;return{x:h,y:d}}},...c}=We(t,e),p={x:r,y:o},u=await s.detectOverflow(e,c),w=ce(ve(i)),g=Io(w);let _=p[g],E=p[w];if(a){const C=g==="y"?"top":"left",h=g==="y"?"bottom":"right",d=_+u[C],m=_-u[h];_=kr(d,_,m)}if(n){const C=w==="y"?"top":"left",h=w==="y"?"bottom":"right",d=E+u[C],m=E-u[h];E=kr(d,E,m)}const S=l.fn({...e,[g]:_,[w]:E});return{...S,data:{x:S.x-r,y:S.y-o,enabled:{[g]:a,[w]:n}}}}}},na=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){var r,o;const{placement:i,rects:s,platform:a,elements:n}=e,{apply:l=()=>{},...c}=We(t,e),p=await a.detectOverflow(e,c),u=ve(i),w=Je(i),g=ce(i)==="y",{width:_,height:E}=s.floating;let S,C;u==="top"||u==="bottom"?(S=u,C=w===(await(a.isRTL==null?void 0:a.isRTL(n.floating))?"start":"end")?"left":"right"):(C=u,S=w==="end"?"top":"bottom");const h=E-p.top-p.bottom,d=_-p.left-p.right,m=ge(E-p[S],h),y=ge(_-p[C],d),v=!e.middlewareData.shift;let A=m,O=y;if((r=e.middlewareData.shift)!=null&&r.enabled.x&&(O=d),(o=e.middlewareData.shift)!=null&&o.enabled.y&&(A=h),v&&!w){const T=q(p.left,0),z=q(p.right,0),D=q(p.top,0),re=q(p.bottom,0);g?O=_-2*(T!==0||z!==0?T+z:q(p.left,p.right)):A=E-2*(D!==0||re!==0?D+re:q(p.top,p.bottom))}await l({...e,availableWidth:O,availableHeight:A});const k=await a.getDimensions(n.floating);return _!==k.width||E!==k.height?{reset:{rects:!0}}:{}}}};function Ft(){return typeof window<"u"}function qe(t){return Yo(t)?(t.nodeName||"").toLowerCase():"#document"}function Y(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function le(t){var e;return(e=(Yo(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Yo(t){return Ft()?t instanceof Node||t instanceof Y(t).Node:!1}function ee(t){return Ft()?t instanceof Element||t instanceof Y(t).Element:!1}function de(t){return Ft()?t instanceof HTMLElement||t instanceof Y(t).HTMLElement:!1}function Go(t){return!Ft()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof Y(t).ShadowRoot}function dt(t){const{overflow:e,overflowX:r,overflowY:o,display:i}=te(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+r)&&i!=="inline"&&i!=="contents"}function la(t){return/^(table|td|th)$/.test(qe(t))}function Dt(t){try{if(t.matches(":popover-open"))return!0}catch{}try{return t.matches(":modal")}catch{return!1}}const ca=/transform|translate|scale|rotate|perspective|filter/,da=/paint|layout|strict|content/,Te=t=>!!t&&t!=="none";let Or;function jt(t){const e=ee(t)?te(t):t;return Te(e.transform)||Te(e.translate)||Te(e.scale)||Te(e.rotate)||Te(e.perspective)||!Tr()&&(Te(e.backdropFilter)||Te(e.filter))||ca.test(e.willChange||"")||da.test(e.contain||"")}function ha(t){let e=ye(t);for(;de(e)&&!Ye(e);){if(jt(e))return e;if(Dt(e))return null;e=ye(e)}return null}function Tr(){return Or==null&&(Or=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Or}function Ye(t){return/^(html|body|#document)$/.test(qe(t))}function te(t){return Y(t).getComputedStyle(t)}function Bt(t){return ee(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function ye(t){if(qe(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Go(t)&&t.host||le(t);return Go(e)?e.host:e}function Ko(t){const e=ye(t);return Ye(e)?t.ownerDocument?t.ownerDocument.body:t.body:de(e)&&dt(e)?e:Ko(e)}function ht(t,e,r){var o;e===void 0&&(e=[]),r===void 0&&(r=!0);const i=Ko(t),s=i===((o=t.ownerDocument)==null?void 0:o.body),a=Y(i);if(s){const n=Rr(a);return e.concat(a,a.visualViewport||[],dt(i)?i:[],n&&r?ht(n):[])}else return e.concat(i,ht(i,[],r))}function Rr(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function Xo(t){const e=te(t);let r=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const i=de(t),s=i?t.offsetWidth:r,a=i?t.offsetHeight:o,n=Mt(r)!==s||Mt(o)!==a;return n&&(r=s,o=a),{width:r,height:o,$:n}}function Mr(t){return ee(t)?t:t.contextElement}function Ge(t){const e=Mr(t);if(!de(e))return ne(1);const r=e.getBoundingClientRect(),{width:o,height:i,$:s}=Xo(e);let a=(s?Mt(r.width):r.width)/o,n=(s?Mt(r.height):r.height)/i;return(!a||!Number.isFinite(a))&&(a=1),(!n||!Number.isFinite(n))&&(n=1),{x:a,y:n}}const pa=ne(0);function Zo(t){const e=Y(t);return!Tr()||!e.visualViewport?pa:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function ua(t,e,r){return e===void 0&&(e=!1),!r||e&&r!==Y(t)?!1:e}function Re(t,e,r,o){e===void 0&&(e=!1),r===void 0&&(r=!1);const i=t.getBoundingClientRect(),s=Mr(t);let a=ne(1);e&&(o?ee(o)&&(a=Ge(o)):a=Ge(t));const n=ua(s,r,o)?Zo(s):ne(0);let l=(i.left+n.x)/a.x,c=(i.top+n.y)/a.y,p=i.width/a.x,u=i.height/a.y;if(s){const w=Y(s),g=o&&ee(o)?Y(o):o;let _=w,E=Rr(_);for(;E&&o&&g!==_;){const S=Ge(E),C=E.getBoundingClientRect(),h=te(E),d=C.left+(E.clientLeft+parseFloat(h.paddingLeft))*S.x,m=C.top+(E.clientTop+parseFloat(h.paddingTop))*S.y;l*=S.x,c*=S.y,p*=S.x,u*=S.y,l+=d,c+=m,_=Y(E),E=Rr(_)}}return Nt({width:p,height:u,x:l,y:c})}function Ut(t,e){const r=Bt(t).scrollLeft;return e?e.left+r:Re(le(t)).left+r}function Qo(t,e){const r=t.getBoundingClientRect(),o=r.left+e.scrollLeft-Ut(t,r),i=r.top+e.scrollTop;return{x:o,y:i}}function fa(t){let{elements:e,rect:r,offsetParent:o,strategy:i}=t;const s=i==="fixed",a=le(o),n=e?Dt(e.floating):!1;if(o===a||n&&s)return r;let l={scrollLeft:0,scrollTop:0},c=ne(1);const p=ne(0),u=de(o);if((u||!u&&!s)&&((qe(o)!=="body"||dt(a))&&(l=Bt(o)),u)){const g=Re(o);c=Ge(o),p.x=g.x+o.clientLeft,p.y=g.y+o.clientTop}const w=a&&!u&&!s?Qo(a,l):ne(0);return{width:r.width*c.x,height:r.height*c.y,x:r.x*c.x-l.scrollLeft*c.x+p.x+w.x,y:r.y*c.y-l.scrollTop*c.y+p.y+w.y}}function ma(t){return Array.from(t.getClientRects())}function ga(t){const e=le(t),r=Bt(t),o=t.ownerDocument.body,i=q(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),s=q(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let a=-r.scrollLeft+Ut(t);const n=-r.scrollTop;return te(o).direction==="rtl"&&(a+=q(e.clientWidth,o.clientWidth)-i),{width:i,height:s,x:a,y:n}}const ei=25;function va(t,e){const r=Y(t),o=le(t),i=r.visualViewport;let s=o.clientWidth,a=o.clientHeight,n=0,l=0;if(i){s=i.width,a=i.height;const p=Tr();(!p||p&&e==="fixed")&&(n=i.offsetLeft,l=i.offsetTop)}const c=Ut(o);if(c<=0){const p=o.ownerDocument,u=p.body,w=getComputedStyle(u),g=p.compatMode==="CSS1Compat"&&parseFloat(w.marginLeft)+parseFloat(w.marginRight)||0,_=Math.abs(o.clientWidth-u.clientWidth-g);_<=ei&&(s-=_)}else c<=ei&&(s+=c);return{width:s,height:a,x:n,y:l}}function ya(t,e){const r=Re(t,!0,e==="fixed"),o=r.top+t.clientTop,i=r.left+t.clientLeft,s=de(t)?Ge(t):ne(1),a=t.clientWidth*s.x,n=t.clientHeight*s.y,l=i*s.x,c=o*s.y;return{width:a,height:n,x:l,y:c}}function ti(t,e,r){let o;if(e==="viewport")o=va(t,r);else if(e==="document")o=ga(le(t));else if(ee(e))o=ya(e,r);else{const i=Zo(t);o={x:e.x-i.x,y:e.y-i.y,width:e.width,height:e.height}}return Nt(o)}function ri(t,e){const r=ye(t);return r===e||!ee(r)||Ye(r)?!1:te(r).position==="fixed"||ri(r,e)}function ba(t,e){const r=e.get(t);if(r)return r;let o=ht(t,[],!1).filter(n=>ee(n)&&qe(n)!=="body"),i=null;const s=te(t).position==="fixed";let a=s?ye(t):t;for(;ee(a)&&!Ye(a);){const n=te(a),l=jt(a);!l&&n.position==="fixed"&&(i=null),(s?!l&&!i:!l&&n.position==="static"&&!!i&&(i.position==="absolute"||i.position==="fixed")||dt(a)&&!l&&ri(t,a))?o=o.filter(p=>p!==a):i=n,a=ye(a)}return e.set(t,o),o}function wa(t){let{element:e,boundary:r,rootBoundary:o,strategy:i}=t;const a=[...r==="clippingAncestors"?Dt(e)?[]:ba(e,this._c):[].concat(r),o],n=ti(e,a[0],i);let l=n.top,c=n.right,p=n.bottom,u=n.left;for(let w=1;w<a.length;w++){const g=ti(e,a[w],i);l=q(g.top,l),c=ge(g.right,c),p=ge(g.bottom,p),u=q(g.left,u)}return{width:c-u,height:p-l,x:u,y:l}}function $a(t){const{width:e,height:r}=Xo(t);return{width:e,height:r}}function xa(t,e,r){const o=de(e),i=le(e),s=r==="fixed",a=Re(t,!0,s,e);let n={scrollLeft:0,scrollTop:0};const l=ne(0);function c(){l.x=Ut(i)}if(o||!o&&!s)if((qe(e)!=="body"||dt(i))&&(n=Bt(e)),o){const g=Re(e,!0,s,e);l.x=g.x+e.clientLeft,l.y=g.y+e.clientTop}else i&&c();s&&!o&&i&&c();const p=i&&!o&&!s?Qo(i,n):ne(0),u=a.left+n.scrollLeft-l.x-p.x,w=a.top+n.scrollTop-l.y-p.y;return{x:u,y:w,width:a.width,height:a.height}}function zr(t){return te(t).position==="static"}function oi(t,e){if(!de(t)||te(t).position==="fixed")return null;if(e)return e(t);let r=t.offsetParent;return le(t)===r&&(r=r.ownerDocument.body),r}function ii(t,e){const r=Y(t);if(Dt(t))return r;if(!de(t)){let i=ye(t);for(;i&&!Ye(i);){if(ee(i)&&!zr(i))return i;i=ye(i)}return r}let o=oi(t,e);for(;o&&la(o)&&zr(o);)o=oi(o,e);return o&&Ye(o)&&zr(o)&&!jt(o)?r:o||ha(t)||r}const _a=async function(t){const e=this.getOffsetParent||ii,r=this.getDimensions,o=await r(t.floating);return{reference:xa(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}};function Aa(t){return te(t).direction==="rtl"}const Ht={convertOffsetParentRelativeRectToViewportRelativeRect:fa,getDocumentElement:le,getClippingRect:wa,getOffsetParent:ii,getElementRects:_a,getClientRects:ma,getDimensions:$a,getScale:Ge,isElement:ee,isRTL:Aa};function si(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}function Pa(t,e){let r=null,o;const i=le(t);function s(){var n;clearTimeout(o),(n=r)==null||n.disconnect(),r=null}function a(n,l){n===void 0&&(n=!1),l===void 0&&(l=1),s();const c=t.getBoundingClientRect(),{left:p,top:u,width:w,height:g}=c;if(n||e(),!w||!g)return;const _=zt(u),E=zt(i.clientWidth-(p+w)),S=zt(i.clientHeight-(u+g)),C=zt(p),d={rootMargin:-_+"px "+-E+"px "+-S+"px "+-C+"px",threshold:q(0,ge(1,l))||1};let m=!0;function y(v){const A=v[0].intersectionRatio;if(A!==l){if(!m)return a();A?a(!1,A):o=setTimeout(()=>{a(!1,1e-7)},1e3)}A===1&&!si(c,t.getBoundingClientRect())&&a(),m=!1}try{r=new IntersectionObserver(y,{...d,root:i.ownerDocument})}catch{r=new IntersectionObserver(y,d)}r.observe(t)}return a(!0),s}function ka(t,e,r,o){o===void 0&&(o={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:a=typeof ResizeObserver=="function",layoutShift:n=typeof IntersectionObserver=="function",animationFrame:l=!1}=o,c=Mr(t),p=i||s?[...c?ht(c):[],...e?ht(e):[]]:[];p.forEach(C=>{i&&C.addEventListener("scroll",r,{passive:!0}),s&&C.addEventListener("resize",r)});const u=c&&n?Pa(c,r):null;let w=-1,g=null;a&&(g=new ResizeObserver(C=>{let[h]=C;h&&h.target===c&&g&&e&&(g.unobserve(e),cancelAnimationFrame(w),w=requestAnimationFrame(()=>{var d;(d=g)==null||d.observe(e)})),r()}),c&&!l&&g.observe(c),e&&g.observe(e));let _,E=l?Re(t):null;l&&S();function S(){const C=Re(t);E&&!si(E,C)&&r(),E=C,_=requestAnimationFrame(S)}return r(),()=>{var C;p.forEach(h=>{i&&h.removeEventListener("scroll",r),s&&h.removeEventListener("resize",r)}),u==null||u(),(C=g)==null||C.disconnect(),g=null,l&&cancelAnimationFrame(_)}}const Ea=sa,Sa=aa,Ca=ra,ai=na,Oa=ta,Ta=(t,e,r)=>{const o=new Map,i={platform:Ht,...r},s={...i.platform,_c:o};return ea(t,e,{...i,platform:s})};function Ra(t){return Ma(t)}function Lr(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function Ma(t){for(let e=t;e;e=Lr(e))if(e instanceof Element&&getComputedStyle(e).display==="none")return null;for(let e=Lr(t);e;e=Lr(e)){if(!(e instanceof Element))continue;const r=getComputedStyle(e);if(r.display!=="contents"&&(r.position!=="static"||jt(r)||e.tagName==="BODY"))return e}return null}function za(t){return t!==null&&typeof t=="object"&&"getBoundingClientRect"in t&&("contextElement"in t?t.contextElement instanceof Element:!0)}var M=class extends Q{constructor(){super(...arguments),this.localize=new ct(this),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),r=this.placement.includes("top")||this.placement.includes("bottom");let o=0,i=0,s=0,a=0,n=0,l=0,c=0,p=0;r?t.top<e.top?(o=t.left,i=t.bottom,s=t.right,a=t.bottom,n=e.left,l=e.top,c=e.right,p=e.top):(o=e.left,i=e.bottom,s=e.right,a=e.bottom,n=t.left,l=t.top,c=t.right,p=t.top):t.left<e.left?(o=t.right,i=t.top,s=e.left,a=e.top,n=t.right,l=t.bottom,c=e.left,p=e.bottom):(o=e.right,i=e.top,s=t.left,a=t.top,n=e.right,l=e.bottom,c=t.left,p=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${o}px`),this.style.setProperty("--hover-bridge-top-left-y",`${i}px`),this.style.setProperty("--hover-bridge-top-right-x",`${s}px`),this.style.setProperty("--hover-bridge-top-right-y",`${a}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${l}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${p}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor=="string"){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||za(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=ka(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[Ea({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(ai({apply:({rects:r})=>{const o=this.sync==="width"||this.sync==="both",i=this.sync==="height"||this.sync==="both";this.popup.style.width=o?`${r.reference.width}px`:"",this.popup.style.height=i?`${r.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(Ca({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy==="best-fit"?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Sa({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(ai({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:r,availableHeight:o})=>{this.autoSize==="vertical"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-height",`${o}px`):this.style.removeProperty("--auto-size-available-height"),this.autoSize==="horizontal"||this.autoSize==="both"?this.style.setProperty("--auto-size-available-width",`${r}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Oa({element:this.arrowEl,padding:this.arrowPadding}));const e=this.strategy==="absolute"?r=>Ht.getOffsetParent(r,Ra):Ht.getOffsetParent;Ta(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:To(Ot({},Ht),{getOffsetParent:e})}).then(({x:r,y:o,middlewareData:i,placement:s})=>{const a=this.localize.dir()==="rtl",n={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:`${r}px`,top:`${o}px`}),this.arrow){const l=i.arrow.x,c=i.arrow.y;let p="",u="",w="",g="";if(this.arrowPlacement==="start"){const _=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";p=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",u=a?_:"",g=a?"":_}else if(this.arrowPlacement==="end"){const _=typeof l=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";u=a?"":_,g=a?_:"",w=typeof c=="number"?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else this.arrowPlacement==="center"?(g=typeof l=="number"?"calc(50% - var(--arrow-size-diagonal))":"",p=typeof c=="number"?"calc(50% - var(--arrow-size-diagonal))":""):(g=typeof l=="number"?`${l}px`:"",p=typeof c=="number"?`${c}px`:"");Object.assign(this.arrowEl.style,{top:p,right:u,bottom:w,left:g,[n]:"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("sl-reposition")}render(){return x`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${Ie({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${Ie({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy==="fixed","popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?x`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};M.styles=[Se,Is],$([Z(".popup")],M.prototype,"popup",2),$([Z(".popup__arrow")],M.prototype,"arrowEl",2),$([b()],M.prototype,"anchor",2),$([b({type:Boolean,reflect:!0})],M.prototype,"active",2),$([b({reflect:!0})],M.prototype,"placement",2),$([b({reflect:!0})],M.prototype,"strategy",2),$([b({type:Number})],M.prototype,"distance",2),$([b({type:Number})],M.prototype,"skidding",2),$([b({type:Boolean})],M.prototype,"arrow",2),$([b({attribute:"arrow-placement"})],M.prototype,"arrowPlacement",2),$([b({attribute:"arrow-padding",type:Number})],M.prototype,"arrowPadding",2),$([b({type:Boolean})],M.prototype,"flip",2),$([b({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(e=>e.trim()).filter(e=>e!==""),toAttribute:t=>t.join(" ")}})],M.prototype,"flipFallbackPlacements",2),$([b({attribute:"flip-fallback-strategy"})],M.prototype,"flipFallbackStrategy",2),$([b({type:Object})],M.prototype,"flipBoundary",2),$([b({attribute:"flip-padding",type:Number})],M.prototype,"flipPadding",2),$([b({type:Boolean})],M.prototype,"shift",2),$([b({type:Object})],M.prototype,"shiftBoundary",2),$([b({attribute:"shift-padding",type:Number})],M.prototype,"shiftPadding",2),$([b({attribute:"auto-size"})],M.prototype,"autoSize",2),$([b()],M.prototype,"sync",2),$([b({type:Object})],M.prototype,"autoSizeBoundary",2),$([b({attribute:"auto-size-padding",type:Number})],M.prototype,"autoSizePadding",2),$([b({attribute:"hover-bridge",type:Boolean})],M.prototype,"hoverBridge",2);var ni=new Map,La=new WeakMap;function Na(t){return t??{keyframes:[],options:{duration:0}}}function li(t,e){return e.toLowerCase()==="rtl"?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function G(t,e){ni.set(t,Na(e))}function Me(t,e,r){const o=La.get(t);if(o!=null&&o[e])return li(o[e],r.dir);const i=ni.get(e);return i?li(i,r.dir):{keyframes:[],options:{duration:0}}}function It(t,e){return new Promise(r=>{function o(i){i.target===t&&(t.removeEventListener(e,o),r())}t.addEventListener(e,o)})}function ze(t,e,r){return new Promise(o=>{if((r==null?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");const i=t.animate(e,To(Ot({},r),{duration:Fa()?0:r.duration}));i.addEventListener("cancel",o,{once:!0}),i.addEventListener("finish",o,{once:!0})})}function ci(t){return t=t.toString().toLowerCase(),t.indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?parseFloat(t)*1e3:parseFloat(t)}function Fa(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Ke(t){return Promise.all(t.getAnimations().map(e=>new Promise(r=>{e.cancel(),requestAnimationFrame(r)})))}var H=class extends Q{constructor(){super(),this.localize=new ct(this),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{t.key==="Escape"&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=ci(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=ci(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("sl-show"),"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Ke(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:r,options:o}=Me(this,"tooltip.show",{dir:this.localize.dir()});await ze(this.popup.popup,r,o),this.popup.reposition(),this.emit("sl-after-show")}else{this.emit("sl-hide"),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Ke(this.body);const{keyframes:r,options:o}=Me(this,"tooltip.hide",{dir:this.localize.dir()});await ze(this.popup.popup,r,o),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,It(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,It(this,"sl-after-hide")}render(){return x`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${Ie({tooltip:!0,"tooltip--open":this.open})}
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
    `}};H.styles=[Se,Hs],H.dependencies={"sl-popup":M},$([Z("slot:not([name])")],H.prototype,"defaultSlot",2),$([Z(".tooltip__body")],H.prototype,"body",2),$([Z("sl-popup")],H.prototype,"popup",2),$([b()],H.prototype,"content",2),$([b()],H.prototype,"placement",2),$([b({type:Boolean,reflect:!0})],H.prototype,"disabled",2),$([b({type:Number})],H.prototype,"distance",2),$([b({type:Boolean,reflect:!0})],H.prototype,"open",2),$([b({type:Number})],H.prototype,"skidding",2),$([b()],H.prototype,"trigger",2),$([b({type:Boolean})],H.prototype,"hoist",2),$([se("open",{waitUntilFirstUpdate:!0})],H.prototype,"handleOpenChange",1),$([se(["content","distance","hoist","placement","skidding"])],H.prototype,"handleOptionsChange",1),$([se("disabled")],H.prototype,"handleDisabledChange",1),G("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),G("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),H.define("sl-tooltip"),ae.define("sl-icon");var Da=L`
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
`;function ja(t,e){function r(i){const s=t.getBoundingClientRect(),a=t.ownerDocument.defaultView,n=s.left+a.scrollX,l=s.top+a.scrollY,c=i.pageX-n,p=i.pageY-l;e!=null&&e.onMove&&e.onMove(c,p)}function o(){document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",o),e!=null&&e.onStop&&e.onStop()}document.addEventListener("pointermove",r,{passive:!0}),document.addEventListener("pointerup",o),(e==null?void 0:e.initialEvent)instanceof PointerEvent&&r(e.initialEvent)}function di(t,e,r){const o=i=>Object.is(i,-0)?0:i;return t<e?o(e):t>r?o(r):o(t)}var hi=()=>null,K=class extends Q{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new ct(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue="",this.snapFunction=hi,this.snapThreshold=12}toSnapFunction(t){const e=t.split(" ");return({pos:r,size:o,snapThreshold:i,isRtl:s,vertical:a})=>{let n=r,l=Number.POSITIVE_INFINITY;return e.forEach(c=>{let p;if(c.startsWith("repeat(")){const w=t.substring(7,t.length-1),g=w.endsWith("%"),_=Number.parseFloat(w),E=g?o*(_/100):_;p=Math.round((s&&!a?o-r:r)/E)*E}else c.endsWith("%")?p=o*(Number.parseFloat(c)/100):p=Number.parseFloat(c);s&&!a&&(p=o-p);const u=Math.abs(r-p);u<=i&&u<l&&(n=p,l=u)}),n}}set snap(t){this.snapValue=t??"",t?this.snapFunction=typeof t=="string"?this.toSnapFunction(t):t:this.snapFunction=hi}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(t=>this.handleResize(t)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.resizeObserver)==null||t.unobserve(this)}detectSize(){const{width:t,height:e}=this.getBoundingClientRect();this.size=this.vertical?e:t}percentageToPixels(t){return this.size*(t/100)}pixelsToPercentage(t){return t/this.size*100}handleDrag(t){const e=this.localize.dir()==="rtl";this.disabled||(t.cancelable&&t.preventDefault(),ja(this,{onMove:(r,o)=>{var i;let s=this.vertical?o:r;this.primary==="end"&&(s=this.size-s),s=(i=this.snapFunction({pos:s,size:this.size,snapThreshold:this.snapThreshold,isRtl:e,vertical:this.vertical}))!=null?i:s,this.position=di(this.pixelsToPercentage(s),0,100)},initialEvent:t}))}handleKeyDown(t){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(t.key)){let e=this.position;const r=(t.shiftKey?10:1)*(this.primary==="end"?-1:1);if(t.preventDefault(),(t.key==="ArrowLeft"&&!this.vertical||t.key==="ArrowUp"&&this.vertical)&&(e-=r),(t.key==="ArrowRight"&&!this.vertical||t.key==="ArrowDown"&&this.vertical)&&(e+=r),t.key==="Home"&&(e=this.primary==="end"?100:0),t.key==="End"&&(e=this.primary==="end"?0:100),t.key==="Enter")if(this.isCollapsed)e=this.positionBeforeCollapsing,this.isCollapsed=!1;else{const o=this.position;e=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=o})}this.position=di(e,0,100)}}handleResize(t){const{width:e,height:r}=t[0].contentRect;this.size=this.vertical?r:e,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute("position-in-pixels")),this.positionInPixels=Number(this.getAttribute("position-in-pixels")),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){const t=this.vertical?"gridTemplateRows":"gridTemplateColumns",e=this.vertical?"gridTemplateColumns":"gridTemplateRows",r=this.localize.dir()==="rtl",o=`
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
    `}};K.styles=[Se,Da],$([Z(".divider")],K.prototype,"divider",2),$([b({type:Number,reflect:!0})],K.prototype,"position",2),$([b({attribute:"position-in-pixels",type:Number})],K.prototype,"positionInPixels",2),$([b({type:Boolean,reflect:!0})],K.prototype,"vertical",2),$([b({type:Boolean,reflect:!0})],K.prototype,"disabled",2),$([b()],K.prototype,"primary",2),$([b({reflect:!0})],K.prototype,"snap",1),$([b({type:Number,attribute:"snap-threshold"})],K.prototype,"snapThreshold",2),$([se("position")],K.prototype,"handlePositionChange",1),$([se("positionInPixels")],K.prototype,"handlePositionInPixelsChange",1),$([se("vertical")],K.prototype,"handleVerticalChange",1),K.define("sl-split-panel");var Ba=L`
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
`;function*Nr(t=document.activeElement){t!=null&&(yield t,"shadowRoot"in t&&t.shadowRoot&&t.shadowRoot.mode!=="closed"&&(yield*Rs(Nr(t.shadowRoot.activeElement))))}function Ua(){return[...Nr()].pop()}var pi=new WeakMap;function ui(t){let e=pi.get(t);return e||(e=window.getComputedStyle(t,null),pi.set(t,e)),e}function Ha(t){if(typeof t.checkVisibility=="function")return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const e=ui(t);return e.visibility!=="hidden"&&e.display!=="none"}function Ia(t){const e=ui(t),{overflowY:r,overflowX:o}=e;return r==="scroll"||o==="scroll"?!0:r!=="auto"||o!=="auto"?!1:t.scrollHeight>t.clientHeight&&r==="auto"||t.scrollWidth>t.clientWidth&&o==="auto"}function Va(t){const e=t.tagName.toLowerCase(),r=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(r)||r<=-1)||t.hasAttribute("disabled")||t.closest("[inert]"))return!1;if(e==="input"&&t.getAttribute("type")==="radio"){const s=t.getRootNode(),a=`input[type='radio'][name="${t.getAttribute("name")}"]`,n=s.querySelector(`${a}:checked`);return n?n===t:s.querySelector(a)===t}return Ha(t)?(e==="audio"||e==="video")&&t.hasAttribute("controls")||t.hasAttribute("tabindex")||t.hasAttribute("contenteditable")&&t.getAttribute("contenteditable")!=="false"||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)?!0:Ia(t):!1}function Wa(t,e){var r;return((r=t.getRootNode({composed:!0}))==null?void 0:r.host)!==e}function fi(t){const e=new WeakMap,r=[];function o(i){if(i instanceof Element){if(i.hasAttribute("inert")||i.closest("[inert]")||e.has(i))return;e.set(i,!0),!r.includes(i)&&Va(i)&&r.push(i),i instanceof HTMLSlotElement&&Wa(i,t)&&i.assignedElements({flatten:!0}).forEach(s=>{o(s)}),i.shadowRoot!==null&&i.shadowRoot.mode==="open"&&o(i.shadowRoot)}for(const s of i.children)o(s)}return o(t),r.sort((i,s)=>{const a=Number(i.getAttribute("tabindex"))||0;return(Number(s.getAttribute("tabindex"))||0)-a})}var pt=[],Ja=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var r;if(e.key!=="Tab"||this.isExternalActivated||!this.isActive())return;const o=Ua();if(this.previousFocus=o,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const i=fi(this.element);let s=i.findIndex(n=>n===o);this.previousFocus=this.currentFocus;const a=this.tabDirection==="forward"?1:-1;for(;;){s+a>=i.length?s=0:s+a<0?s=i.length-1:s+=a,this.previousFocus=this.currentFocus;const n=i[s];if(this.tabDirection==="backward"&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||n&&this.possiblyHasTabbableChildren(n))return;e.preventDefault(),this.currentFocus=n,(r=this.currentFocus)==null||r.focus({preventScroll:!1});const l=[...Nr()];if(l.includes(this.currentFocus)||!l.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){pt.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){pt=pt.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return pt[pt.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const t=fi(this.element);if(!this.element.matches(":focus-within")){const e=t[0],r=t[t.length-1],o=this.tabDirection==="forward"?e:r;typeof(o==null?void 0:o.focus)=="function"&&(this.currentFocus=o,o.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}},Fr=new Set;function qa(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}function Ya(){const t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}function Dr(t){if(Fr.add(t),!document.documentElement.classList.contains("sl-scroll-lock")){const e=qa()+Ya();let r=getComputedStyle(document.documentElement).scrollbarGutter;(!r||r==="auto")&&(r="stable"),e<2&&(r=""),document.documentElement.style.setProperty("--sl-scroll-lock-gutter",r),document.documentElement.classList.add("sl-scroll-lock"),document.documentElement.style.setProperty("--sl-scroll-lock-size",`${e}px`)}}function jr(t){Fr.delete(t),Fr.size===0&&(document.documentElement.classList.remove("sl-scroll-lock"),document.documentElement.style.removeProperty("--sl-scroll-lock-size"))}var Ga=t=>{var e;const{activeElement:r}=document;r&&t.contains(r)&&((e=document.activeElement)==null||e.blur())},Ka=class{constructor(t,...e){this.slotNames=[],this.handleSlotChange=r=>{const o=r.target;(this.slotNames.includes("[default]")&&!o.name||o.name&&this.slotNames.includes(o.name))&&this.host.requestUpdate()},(this.host=t).addController(this),this.slotNames=e}hasDefaultSlot(){return[...this.host.childNodes].some(t=>{if(t.nodeType===t.TEXT_NODE&&t.textContent.trim()!=="")return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if(e.tagName.toLowerCase()==="sl-visually-hidden")return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(t){return this.host.querySelector(`:scope > [slot="${t}"]`)!==null}test(t){return t==="[default]"?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}};function mi(t){return t.charAt(0).toUpperCase()+t.slice(1)}var X=class extends Q{constructor(){super(...arguments),this.hasSlotController=new Ka(this,"footer"),this.localize=new ct(this),this.modal=new Ja(this),this.open=!1,this.label="",this.placement="end",this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=t=>{this.contained||t.key==="Escape"&&this.modal.isActive()&&this.open&&(t.stopImmediatePropagation(),this.requestClose("keyboard"))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),Dr(this)))}disconnectedCallback(){super.disconnectedCallback(),jr(this),this.removeOpenListeners()}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){const r=Me(this,"drawer.denyClose",{dir:this.localize.dir()});ze(this.panel,r.keyframes,r.options);return}this.hide()}addOpenListeners(){var t;"CloseWatcher"in window?((t=this.closeWatcher)==null||t.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose("keyboard"))):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;document.removeEventListener("keydown",this.handleDocumentKeyDown),(t=this.closeWatcher)==null||t.destroy()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),Dr(this));const t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([Ke(this.drawer),Ke(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});const e=Me(this,`drawer.show${mi(this.placement)}`,{dir:this.localize.dir()}),r=Me(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([ze(this.panel,e.keyframes,e.options),ze(this.overlay,r.keyframes,r.options)]),this.emit("sl-after-show")}else{Ga(this),this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),jr(this)),await Promise.all([Ke(this.drawer),Ke(this.overlay)]);const t=Me(this,`drawer.hide${mi(this.placement)}`,{dir:this.localize.dir()}),e=Me(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([ze(this.overlay,e.keyframes,e.options).then(()=>{this.overlay.hidden=!0}),ze(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;const r=this.originalTrigger;typeof(r==null?void 0:r.focus)=="function"&&setTimeout(()=>r.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),Dr(this)),this.open&&this.contained&&(this.modal.deactivate(),jr(this))}async show(){if(!this.open)return this.open=!0,It(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,It(this,"sl-after-hide")}render(){return x`
      <div
        part="base"
        class=${Ie({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
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
    `}};X.styles=[Se,Ba],X.dependencies={"sl-icon-button":I},$([Z(".drawer")],X.prototype,"drawer",2),$([Z(".drawer__panel")],X.prototype,"panel",2),$([Z(".drawer__overlay")],X.prototype,"overlay",2),$([b({type:Boolean,reflect:!0})],X.prototype,"open",2),$([b({reflect:!0})],X.prototype,"label",2),$([b({reflect:!0})],X.prototype,"placement",2),$([b({type:Boolean,reflect:!0})],X.prototype,"contained",2),$([b({attribute:"no-header",type:Boolean,reflect:!0})],X.prototype,"noHeader",2),$([se("open",{waitUntilFirstUpdate:!0})],X.prototype,"handleOpenChange",1),$([se("contained",{waitUntilFirstUpdate:!0})],X.prototype,"handleNoModalChange",1),G("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}}),G("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}}),G("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}}),G("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}}),G("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}}),G("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),G("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),G("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),X.define("sl-drawer");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Br=t=>(e,r)=>{r!==void 0?r.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vt=globalThis,Ur=Vt.ShadowRoot&&(Vt.ShadyCSS===void 0||Vt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Hr=Symbol(),gi=new WeakMap;let vi=class{constructor(e,r,o){if(this._$cssResult$=!0,o!==Hr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(Ur&&e===void 0){const o=r!==void 0&&r.length===1;o&&(e=gi.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&gi.set(r,e))}return e}toString(){return this.cssText}};const Xa=t=>new vi(typeof t=="string"?t:t+"",void 0,Hr),Wt=(t,...e)=>{const r=t.length===1?t[0]:e.reduce(((o,i,s)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new vi(r,t,Hr)},Za=(t,e)=>{if(Ur)t.adoptedStyleSheets=e.map((r=>r instanceof CSSStyleSheet?r:r.styleSheet));else for(const r of e){const o=document.createElement("style"),i=Vt.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=r.cssText,t.appendChild(o)}},yi=Ur?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const o of e.cssRules)r+=o.cssText;return Xa(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Qa,defineProperty:en,getOwnPropertyDescriptor:tn,getOwnPropertyNames:rn,getOwnPropertySymbols:on,getPrototypeOf:sn}=Object,be=globalThis,bi=be.trustedTypes,an=bi?bi.emptyScript:"",Ir=be.reactiveElementPolyfillSupport,ut=(t,e)=>t,Jt={toAttribute(t,e){switch(e){case Boolean:t=t?an:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Vr=(t,e)=>!Qa(t,e),wi={attribute:!0,type:String,converter:Jt,reflect:!1,useDefault:!1,hasChanged:Vr};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),be.litPropertyMetadata??(be.litPropertyMetadata=new WeakMap);let Xe=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=wi){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,r);i!==void 0&&en(this.prototype,e,i)}}static getPropertyDescriptor(e,r,o){const{get:i,set:s}=tn(this.prototype,e)??{get(){return this[r]},set(a){this[r]=a}};return{get:i,set(a){const n=i==null?void 0:i.call(this);s==null||s.call(this,a),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??wi}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const e=sn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const r=this.properties,o=[...rn(r),...on(r)];for(const i of o)this.createProperty(i,r[i])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[o,i]of r)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[r,o]of this.elementProperties){const i=this._$Eu(r,o);i!==void 0&&this._$Eh.set(i,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)r.unshift(yi(i))}else e!==void 0&&r.push(yi(e));return r}static _$Eu(e,r){const o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise((r=>this.enableUpdating=r)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach((r=>r(this)))}addController(e){var r;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var r;(r=this._$EO)==null||r.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const o of r.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Za(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostConnected)==null?void 0:o.call(r)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach((r=>{var o;return(o=r.hostDisconnected)==null?void 0:o.call(r)}))}attributeChangedCallback(e,r,o){this._$AK(e,o)}_$ET(e,r){var s;const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const a=(((s=o.converter)==null?void 0:s.toAttribute)!==void 0?o.converter:Jt).toAttribute(r,o.type);this._$Em=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(e,r){var s,a;const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const n=o.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Jt;this._$Em=i;const c=l.fromAttribute(r,n.type);this[i]=c??((a=this._$Ej)==null?void 0:a.get(i))??c,this._$Em=null}}requestUpdate(e,r,o){var i;if(e!==void 0){const s=this.constructor,a=this[e];if(o??(o=s.getPropertyOptions(e)),!((o.hasChanged??Vr)(a,r)||o.useDefault&&o.reflect&&a===((i=this._$Ej)==null?void 0:i.get(e))&&!this.hasAttribute(s._$Eu(e,o))))return;this.C(e,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:o,reflect:i,wrapped:s},a){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??r??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(r=void 0),this._$AL.set(e,r)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[s,a]of this._$Ep)this[s]=a;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,a]of i){const{wrapped:n}=a,l=this[s];n!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,a,l)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(o=this._$EO)==null||o.forEach((i=>{var s;return(s=i.hostUpdate)==null?void 0:s.call(i)})),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){var r;(r=this._$EO)==null||r.forEach((o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach((r=>this._$ET(r,this[r])))),this._$EM()}updated(e){}firstUpdated(e){}};Xe.elementStyles=[],Xe.shadowRootOptions={mode:"open"},Xe[ut("elementProperties")]=new Map,Xe[ut("finalized")]=new Map,Ir==null||Ir({ReactiveElement:Xe}),(be.reactiveElementVersions??(be.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nn={attribute:!0,type:String,converter:Jt,reflect:!1,hasChanged:Vr},ln=(t=nn,e,r)=>{const{kind:o,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(s===void 0&&globalThis.litPropertyMetadata.set(i,s=new Map),o==="setter"&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),o==="accessor"){const{name:a}=r;return{set(n){const l=e.get.call(this);e.set.call(this,n),this.requestUpdate(a,l,t)},init(n){return n!==void 0&&this.C(a,void 0,t,n),n}}}if(o==="setter"){const{name:a}=r;return function(n){const l=this[a];e.call(this,n),this.requestUpdate(a,l,t)}}throw Error("Unsupported decorator location: "+o)};function he(t){return(e,r)=>typeof r=="object"?ln(t,e,r):((o,i,s)=>{const a=i.hasOwnProperty(s);return i.constructor.createProperty(s,o),a?Object.getOwnPropertyDescriptor(i,s):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $i(t){return he({...t,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=globalThis,qt=ft.trustedTypes,xi=qt?qt.createPolicy("lit-html",{createHTML:t=>t}):void 0,_i="$lit$",we=`lit$${Math.random().toFixed(9).slice(2)}$`,Ai="?"+we,cn=`<${Ai}>`,Le=document,mt=()=>Le.createComment(""),gt=t=>t===null||typeof t!="object"&&typeof t!="function",Wr=Array.isArray,dn=t=>Wr(t)||typeof(t==null?void 0:t[Symbol.iterator])=="function",Jr=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pi=/-->/g,ki=/>/g,Ne=RegExp(`>|${Jr}(?:([^\\s"'>=/]+)(${Jr}*=${Jr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ei=/'/g,Si=/"/g,Ci=/^(?:script|style|textarea|title)$/i,hn=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),qr=hn(1),Ze=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),Oi=new WeakMap,Fe=Le.createTreeWalker(Le,129);function Ti(t,e){if(!Wr(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return xi!==void 0?xi.createHTML(e):e}const pn=(t,e)=>{const r=t.length-1,o=[];let i,s=e===2?"<svg>":e===3?"<math>":"",a=vt;for(let n=0;n<r;n++){const l=t[n];let c,p,u=-1,w=0;for(;w<l.length&&(a.lastIndex=w,p=a.exec(l),p!==null);)w=a.lastIndex,a===vt?p[1]==="!--"?a=Pi:p[1]!==void 0?a=ki:p[2]!==void 0?(Ci.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=Ne):p[3]!==void 0&&(a=Ne):a===Ne?p[0]===">"?(a=i??vt,u=-1):p[1]===void 0?u=-2:(u=a.lastIndex-p[2].length,c=p[1],a=p[3]===void 0?Ne:p[3]==='"'?Si:Ei):a===Si||a===Ei?a=Ne:a===Pi||a===ki?a=vt:(a=Ne,i=void 0);const g=a===Ne&&t[n+1].startsWith("/>")?" ":"";s+=a===vt?l+cn:u>=0?(o.push(c),l.slice(0,u)+_i+l.slice(u)+we+g):l+we+(u===-2?n:g)}return[Ti(t,s+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};class yt{constructor({strings:e,_$litType$:r},o){let i;this.parts=[];let s=0,a=0;const n=e.length-1,l=this.parts,[c,p]=pn(e,r);if(this.el=yt.createElement(c,o),Fe.currentNode=this.el.content,r===2||r===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=Fe.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(_i)){const w=p[a++],g=i.getAttribute(u).split(we),_=/([.?@])?(.*)/.exec(w);l.push({type:1,index:s,name:_[2],strings:g,ctor:_[1]==="."?fn:_[1]==="?"?mn:_[1]==="@"?gn:Yt}),i.removeAttribute(u)}else u.startsWith(we)&&(l.push({type:6,index:s}),i.removeAttribute(u));if(Ci.test(i.tagName)){const u=i.textContent.split(we),w=u.length-1;if(w>0){i.textContent=qt?qt.emptyScript:"";for(let g=0;g<w;g++)i.append(u[g],mt()),Fe.nextNode(),l.push({type:2,index:++s});i.append(u[w],mt())}}}else if(i.nodeType===8)if(i.data===Ai)l.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(we,u+1))!==-1;)l.push({type:7,index:s}),u+=we.length-1}s++}}static createElement(e,r){const o=Le.createElement("template");return o.innerHTML=e,o}}function Qe(t,e,r=t,o){var a,n;if(e===Ze)return e;let i=o!==void 0?(a=r._$Co)==null?void 0:a[o]:r._$Cl;const s=gt(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==s&&((n=i==null?void 0:i._$AO)==null||n.call(i,!1),s===void 0?i=void 0:(i=new s(t),i._$AT(t,r,o)),o!==void 0?(r._$Co??(r._$Co=[]))[o]=i:r._$Cl=i),i!==void 0&&(e=Qe(t,i._$AS(t,e.values),i,o)),e}class un{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:o}=this._$AD,i=((e==null?void 0:e.creationScope)??Le).importNode(r,!0);Fe.currentNode=i;let s=Fe.nextNode(),a=0,n=0,l=o[0];for(;l!==void 0;){if(a===l.index){let c;l.type===2?c=new bt(s,s.nextSibling,this,e):l.type===1?c=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(c=new vn(s,this,e)),this._$AV.push(c),l=o[++n]}a!==(l==null?void 0:l.index)&&(s=Fe.nextNode(),a++)}return Fe.currentNode=Le,i}p(e){let r=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,r),r+=o.strings.length-2):o._$AI(e[r])),r++}}class bt{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,r,o,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=Qe(this,e,r),gt(e)?e===B||e==null||e===""?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==Ze&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):dn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&gt(this._$AH)?this._$AA.nextSibling.data=e:this.T(Le.createTextNode(e)),this._$AH=e}$(e){var s;const{values:r,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=yt.createElement(Ti(o.h,o.h[0]),this.options)),o);if(((s=this._$AH)==null?void 0:s._$AD)===i)this._$AH.p(r);else{const a=new un(i,this),n=a.u(this.options);a.p(r),this.T(n),this._$AH=a}}_$AC(e){let r=Oi.get(e.strings);return r===void 0&&Oi.set(e.strings,r=new yt(e)),r}k(e){Wr(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,i=0;for(const s of e)i===r.length?r.push(o=new bt(this.O(mt()),this.O(mt()),this,this.options)):o=r[i],o._$AI(s),i++;i<r.length&&(this._$AR(o&&o._$AB.nextSibling,i),r.length=i)}_$AR(e=this._$AA.nextSibling,r){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,r);e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var r;this._$AM===void 0&&(this._$Cv=e,(r=this._$AP)==null||r.call(this,e))}}class Yt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,o,i,s){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=r,this._$AM=i,this.options=s,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=B}_$AI(e,r=this,o,i){const s=this.strings;let a=!1;if(s===void 0)e=Qe(this,e,r,0),a=!gt(e)||e!==this._$AH&&e!==Ze,a&&(this._$AH=e);else{const n=e;let l,c;for(e=s[0],l=0;l<s.length-1;l++)c=Qe(this,n[o+l],r,l),c===Ze&&(c=this._$AH[l]),a||(a=!gt(c)||c!==this._$AH[l]),c===B?e=B:e!==B&&(e+=(c??"")+s[l+1]),this._$AH[l]=c}a&&!i&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class fn extends Yt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class mn extends Yt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class gn extends Yt{constructor(e,r,o,i,s){super(e,r,o,i,s),this.type=5}_$AI(e,r=this){if((e=Qe(this,e,r,0)??B)===Ze)return;const o=this._$AH,i=e===B&&o!==B||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==B&&(o===B||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r;typeof this._$AH=="function"?this._$AH.call(((r=this.options)==null?void 0:r.host)??this.element,e):this._$AH.handleEvent(e)}}class vn{constructor(e,r,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){Qe(this,e)}}const Yr=ft.litHtmlPolyfillSupport;Yr==null||Yr(yt,bt),(ft.litHtmlVersions??(ft.litHtmlVersions=[])).push("3.3.1");const yn=(t,e,r)=>{const o=(r==null?void 0:r.renderBefore)??e;let i=o._$litPart$;if(i===void 0){const s=(r==null?void 0:r.renderBefore)??null;o._$litPart$=i=new bt(e.insertBefore(mt(),s),s,void 0,r??{})}return i._$AI(t),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const De=globalThis;class je extends Xe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var r;const e=super.createRenderRoot();return(r=this.renderOptions).renderBefore??(r.renderBefore=e.firstChild),e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=yn(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Ze}}je._$litElement$=!0,je.finalized=!0,(Hi=De.litElementHydrateSupport)==null||Hi.call(De,{LitElement:je});const Gr=De.litElementPolyfillSupport;Gr==null||Gr({LitElement:je}),(De.litElementVersions??(De.litElementVersions=[])).push("4.2.1");function bn(t){switch(t.toLowerCase()){case"get":return"success";case"post":return"primary";case"put":return"primary";case"delete":return"danger";case"patch":return"warning";default:return"neutral"}}const wn=Wt`
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
`;var $n=Object.defineProperty,xn=Object.getOwnPropertyDescriptor,et=(t,e,r,o)=>{for(var i=o>1?void 0:o?xn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&$n(e,r,i),i};let $e=class extends je{constructor(){super(),this.lower=!1,this.method="GET"}render(){let t="medium";this.large&&(t="large"),this.tiny&&(t="small"),this.micro&&(t="small");const e=this.micro?`method ${t} micro`:`method ${t}`;return qr`
            <sl-tag variant="${bn(this.method)}" class="${e}"
                    size="${t}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};$e.styles=wn,et([he()],$e.prototype,"method",2),et([he({type:Boolean})],$e.prototype,"lower",2),et([he({type:Boolean})],$e.prototype,"large",2),et([he({type:Boolean})],$e.prototype,"tiny",2),et([he({type:Boolean})],$e.prototype,"micro",2),$e=et([Br("pb33f-http-method")],$e);const _n=Wt`
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
    }`;var An=Object.defineProperty,Pn=Object.getOwnPropertyDescriptor,Gt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Pn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&An(e,r,i),i};let tt=class extends je{constructor(){super(),this.name="pb33f",this.url="https://pb33f.io",this.wide=!1}render(){return qr` 
            <header class="pb33f-header">
                <div class="logo ${this.wide?"wide":""}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};tt.styles=_n,Gt([he()],tt.prototype,"name",2),Gt([he()],tt.prototype,"url",2),Gt([he({type:Boolean})],tt.prototype,"wide",2),tt=Gt([Br("pb33f-header")],tt);const kn=Wt`

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

`,En=Wt`
    
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
 `,Sn="pb33f-theme-change";var Cn=Object.defineProperty,On=Object.getOwnPropertyDescriptor,Kr=(t,e,r,o)=>{for(var i=o>1?void 0:o?On(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&Cn(e,r,i),i};const Xr="dark",Tn="light",Rn="tektronix",Ri="pb33f-theme",Mi="pb33f-base-theme";let wt=class extends je{constructor(){super(...arguments),this.baseTheme="dark",this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Rn:this.baseTheme}connectedCallback(){super.connectedCallback();const t=localStorage.getItem(Ri);if(t==="tektronix"){this.tektronixActive=!0;const e=localStorage.getItem(Mi);this.baseTheme=e==="light"?"light":"dark"}else this.tektronixActive=!1,this.baseTheme=t==="light"?"light":"dark";this.applyTheme()}applyTheme(){const t=this.activeTheme;localStorage.setItem(Ri,t),localStorage.setItem(Mi,this.baseTheme);const e=document.querySelector("html");e&&(e.setAttribute("theme",t),t===Tn?e.classList.remove("sl-theme-dark"):e.classList.add("sl-theme-dark"))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Sn,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===Xr?"light":"dark",this.tektronixActive&&(this.tektronixActive=!1),this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){const t=this.baseTheme===Xr?"sun":"moon",e=this.baseTheme===Xr?"Switch to Roger Mode (light)":"Switch to PB33F Mode (dark)",r=this.tektronixActive?"Disable Tektronix 4010 Mode":"Enable Tektronix 4010 Mode";return qr`
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
        `}};wt.styles=[kn,En],Kr([$i()],wt.prototype,"baseTheme",2),Kr([$i()],wt.prototype,"tektronixActive",2),wt=Kr([Br("pb33f-theme-switcher")],wt);const Mn=L`
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
`;var zn=Object.defineProperty,Ln=Object.getOwnPropertyDescriptor,Zr=(t,e,r,o)=>{for(var i=o>1?void 0:o?Ln(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&zn(e,r,i),i};const zi="pp-split-position",Nn=20;f.PpLayout=class extends F{constructor(){super(...arguments),this.title="",this.splitPos=Nn}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute("data-title")||document.title||"API Documentation";const e=sessionStorage.getItem(zi);e&&(this.splitPos=parseFloat(e))}onReposition(e){const r=e.target.position;typeof r=="number"&&(this.splitPos=r,sessionStorage.setItem(zi,String(r)))}render(){return x`
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
    `}},f.PpLayout.styles=Mn,Zr([N()],f.PpLayout.prototype,"title",2),Zr([N()],f.PpLayout.prototype,"splitPos",2),f.PpLayout=Zr([V("pp-layout")],f.PpLayout);const Fn=L`
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
`;var Dn=Object.defineProperty,jn=Object.getOwnPropertyDescriptor,Kt=(t,e,r,o)=>{for(var i=o>1?void 0:o?jn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&Dn(e,r,i),i};f.PpNav=class extends F{constructor(){super(...arguments),this.tags=[],this.modelGroups=[],this.activeSlug=""}connectedCallback(){super.connectedCallback();const e=this.getAttribute("data-nav");if(e)try{this.tags=JSON.parse(e)||[]}catch{}const r=this.getAttribute("data-models");if(r)try{this.modelGroups=JSON.parse(r)||[]}catch{}this.activeSlug=this.getAttribute("data-active")||""}render(){return x`
      <a class="nav-home" href="index.html">Overview</a>
      ${this.tags.length?x`
            <div class="nav-section">
              <h4>Operations</h4>
              ${this.tags.map(e=>x`<pp-nav-tag .tag=${e} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:P}
      ${this.modelGroups.length?x`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(e=>x`<pp-nav-model-group .group=${e} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:P}
    `}},f.PpNav.styles=Fn,Kt([N()],f.PpNav.prototype,"tags",2),Kt([N()],f.PpNav.prototype,"modelGroups",2),Kt([N()],f.PpNav.prototype,"activeSlug",2),f.PpNav=Kt([V("pp-nav")],f.PpNav);const Bn=L`
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
`;var Un=Object.defineProperty,Hn=Object.getOwnPropertyDescriptor,Xt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Hn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&Un(e,r,i),i};function Qr(t,e){var r,o;return e?!!((r=t.operations)!=null&&r.some(i=>i.slug===e)||(o=t.children)!=null&&o.some(i=>Qr(i,e))):!1}f.PpNavTag=class extends F{constructor(){super(...arguments),this.tag={name:"",summary:"",children:null,operations:null,isNavOnly:!1},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("tag")||e.has("activeSlug"))&&Qr(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s,a;const{tag:e,activeSlug:r,open:o}=this,i=Qr(e,r);return x`
            <div class="tag-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span class="tag-name">${e.summary||e.name}</span>
            </div>
            ${o?x`
                        <div class="tag-body">
                            ${(s=e.operations)!=null&&s.length?x`
                                        <ul>
                                            ${e.operations.map(n=>x`
                                                        <li>
                                                            <a href="operations/${n.slug}.html" class="${n.deprecated?"deprecated":""} ${n.slug===r?"active":""}">
                                                                <pb33f-http-method tiny
                                                                        method=${n.method}></pb33f-http-method>
                                                                <span class="op-title">${n.summary||n.path}</span>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:P}
                            ${(a=e.children)!=null&&a.length?x`
                                        <div class="children">
                                            ${e.children.map(n=>x`
                                                        <pp-nav-tag .tag=${n}
                                                                    .activeSlug=${r}></pp-nav-tag>`)}
                                        </div>
                                    `:P}
                        </div>
                    `:P}
        `}},f.PpNavTag.styles=Bn,Xt([b({type:Object})],f.PpNavTag.prototype,"tag",2),Xt([b()],f.PpNavTag.prototype,"activeSlug",2),Xt([N()],f.PpNavTag.prototype,"open",2),f.PpNavTag=Xt([V("pp-nav-tag")],f.PpNavTag);const In=L`
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
`;var Vn=Object.defineProperty,Wn=Object.getOwnPropertyDescriptor,Zt=(t,e,r,o)=>{for(var i=o>1?void 0:o?Wn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&Vn(e,r,i),i};function Li(t,e){var r;return e?((r=t.models)==null?void 0:r.some(o=>o.typeSlug+"/"+o.slug===e))??!1:!1}f.PpNavModelGroup=class extends F{constructor(){super(...arguments),this.group={name:"",typeSlug:"",models:null},this.activeSlug="",this.open=!1}willUpdate(e){(e.has("group")||e.has("activeSlug"))&&Li(this.group,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){var s;const{group:e,activeSlug:r,open:o}=this,i=Li(e,r);return x`
            <div class="group-header ${i?"active":""}" @click=${this.toggle}>
                <sl-icon name=${o?"chevron-down":"chevron-right"} class="chevron"></sl-icon>
                <span>${e.name}</span>
            </div>
            ${o&&((s=e.models)!=null&&s.length)?x`
                    <div class="group-body">
                        <ul>
                            ${e.models.map(a=>{const n=a.typeSlug+"/"+a.slug;return x`
                                        <li>
                                            <a href="models/${a.typeSlug}/${a.slug}.html"
                                               class="${n===r?"active":""}">
                                                <span class="model-name">${a.name}</span>
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:P}
        `}},f.PpNavModelGroup.styles=In,Zt([b({type:Object})],f.PpNavModelGroup.prototype,"group",2),Zt([b()],f.PpNavModelGroup.prototype,"activeSlug",2),Zt([N()],f.PpNavModelGroup.prototype,"open",2),f.PpNavModelGroup=Zt([V("pp-nav-model-group")],f.PpNavModelGroup);const Jn=L`
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
`;var qn=Object.defineProperty,Yn=Object.getOwnPropertyDescriptor,$t=(t,e,r,o)=>{for(var i=o>1?void 0:o?Yn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&qn(e,r,i),i};f.PpNavOperation=class extends F{constructor(){super(...arguments),this.method="",this.path="",this.slug="",this.deprecated=!1}render(){return x`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?"deprecated":""}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}},f.PpNavOperation.styles=Jn,$t([b()],f.PpNavOperation.prototype,"method",2),$t([b()],f.PpNavOperation.prototype,"path",2),$t([b()],f.PpNavOperation.prototype,"slug",2),$t([b({type:Boolean})],f.PpNavOperation.prototype,"deprecated",2),f.PpNavOperation=$t([V("pp-nav-operation")],f.PpNavOperation);const eo=L`
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
`,Gn=L`
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
`;var Kn=Object.defineProperty,Xn=Object.getOwnPropertyDescriptor,to=(t,e,r,o)=>{for(var i=o>1?void 0:o?Xn(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&Kn(e,r,i),i};function Zn(t){var e;if(!t)return{type:"",enumValues:null};try{const r=JSON.parse(t);let o="";return r.type==="array"&&r.items?o=`array<${r.items.type||((e=r.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`:r.type?(o=Array.isArray(r.type)?r.type.join(" | "):r.type,r.format&&(o+=` (${r.format})`)):r.oneOf?o="oneOf":r.anyOf?o="anyOf":r.allOf?o="allOf":r.$ref&&(o=r.$ref.split("/").pop()),{type:o,enumValues:Array.isArray(r.enum)?r.enum:null}}catch{return{type:"",enumValues:null}}}f.PpOperationParameters=class extends F{constructor(){super(...arguments),this.parametersJson="",this.params=[]}willUpdate(e){if(e.has("parametersJson")&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}render(){return this.params.length?x`
      <h3>Parameters</h3>
      ${this.params.map(e=>{const r=e.ref?null:Zn(e.schemaJson),o=e.ref?e.ref.name:(r==null?void 0:r.type)||"";return x`
          <div class="parameter">
            <span class="param-name">${e.name}</span>
            ${o?e.ref?x`<span class="param-type"><a href="models/${e.ref.typeSlug}/${e.ref.slug}.html">${o}</a></span>`:x`<span class="param-type">${o}</span>`:P}
            <span class="param-in">${e.in}</span>
            ${e.required?x`<span class="required-badge">required</span>`:P}
            ${e.deprecated?x`<span class="deprecated-badge">deprecated</span>`:P}
            ${e.description?x`<div class="param-desc">${e.description}</div>`:P}
            ${r!=null&&r.enumValues?x`<div class="enum-values">Enum: ${r.enumValues.map((i,s)=>x`${s>0?", ":""}<span class="enum-value">${i}</span>`)}</div>`:P}
            ${e.rawJson||e.rawYaml?x`<pp-raw-viewer-btn
                  title="${e.name} (${e.in})"
                  raw-json=${e.rawJson||""}
                  raw-yaml=${e.rawYaml||""}>
                </pp-raw-viewer-btn>`:P}
            ${e.mockJson||e.examples&&Object.keys(e.examples).length>0?x`<pp-example-selector
                  mock-json=${e.mockJson||""}
                  examples-json=${e.examples?JSON.stringify(e.examples):""}>
                </pp-example-selector>`:P}
          </div>
        `})}
    `:P}},f.PpOperationParameters.styles=[eo,Gn],to([b({attribute:"parameters-json"})],f.PpOperationParameters.prototype,"parametersJson",2),to([N()],f.PpOperationParameters.prototype,"params",2),f.PpOperationParameters=to([V("pp-operation-parameters")],f.PpOperationParameters);const Qn=L`
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
`;var el=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,ro=(t,e,r,o)=>{for(var i=o>1?void 0:o?tl(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&el(e,r,i),i};function Ni(t){var e;if(!t)return"";if(t.type==="array"&&t.items)return`array<${t.items.type||((e=t.items.$ref)==null?void 0:e.split("/").pop())||"any"}>`;if(t.type){let r=Array.isArray(t.type)?t.type.join(" | "):t.type;return t.format&&(r+=` (${t.format})`),r}return t.oneOf?"oneOf":t.anyOf?"anyOf":t.allOf?"allOf":t.$ref?t.$ref.split("/").pop():""}function rl(t){var e;return t?t.properties?t:t.type==="array"&&((e=t.items)!=null&&e.properties)?t.items:null:null}f.PpOperationResponses=class extends F{constructor(){super(...arguments),this.responsesJson="",this.responses=[]}willUpdate(e){if(e.has("responsesJson")&&this.responsesJson)try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}}renderProperty(e,r,o,i){const s=Ni(r),a=rl(r),n=(r==null?void 0:r.type)==="array"&&a;return x`
      <div class="property">
        <span class="prop-name">${e}</span>
        ${s?x`<span class="prop-type">${s}</span>`:P}
        ${o.has(e)?x`<span class="required-badge">required</span>`:P}
        ${r.description?x`<div class="prop-desc">${r.description}</div>`:P}
        ${r.enum?x`<div class="enum-values">Enum: ${r.enum.map((l,c)=>x`${c>0?", ":""}<span class="enum-value">${l}</span>`)}</div>`:P}
      </div>
      ${a&&i<4?x`
            <div class="nested">
              ${n?x`<div class="items-label">items</div>`:P}
              ${this.renderSchemaProperties(a,i+1)}
            </div>
          `:P}
    `}renderSchemaProperties(e,r=0){if(!e)return P;const o=e.properties||{},i=new Set(e.required||[]),s=Object.entries(o);if(!s.length){const a=Ni(e);return a?x`<div class="schema-type">Type: ${a}</div>`:P}return s.map(([a,n])=>this.renderProperty(a,n,i,r))}renderMediaType(e){if(e.schemaRef)return x`
        <div class="media-type-ref">
          <span class="media-type-label">${e.mediaType}</span>
          <a class="ref-link" href="models/${e.schemaRef.typeSlug}/${e.schemaRef.slug}.html">
            ${e.schemaRef.name}
          </a>
        </div>
      `;if(!e.schemaJson)return P;let r;try{r=JSON.parse(e.schemaJson)}catch{return P}const o=e.mockJson||e.examples&&Object.keys(e.examples).length>0;return x`
      <div class="media-type-label">${e.mediaType}</div>
      ${this.renderSchemaProperties(r)}
      ${o?x`<pp-example-selector
            mock-json=${e.mockJson||""}
            examples-json=${e.examples?JSON.stringify(e.examples):""}>
          </pp-example-selector>`:P}
    `}renderResponse(e){var r;return x`
      <div class="response">
        <h4>
          <span class="status-code">${e.statusCode}</span>
          ${e.description}
          ${e.rawJson||e.rawYaml?x`<pp-raw-viewer-btn
                title="Response ${e.statusCode}"
                raw-json=${e.rawJson||""}
                raw-yaml=${e.rawYaml||""}>
              </pp-raw-viewer-btn>`:P}
        </h4>
        ${e.ref?x`<a class="ref-link" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">${e.ref.name}</a>`:((r=e.content)==null?void 0:r.map(o=>this.renderMediaType(o)))??P}
      </div>
    `}render(){return this.responses.length?x`
      <h3>Responses</h3>
      ${this.responses.map(e=>this.renderResponse(e))}
    `:P}},f.PpOperationResponses.styles=[eo,Qn],ro([b({attribute:"responses-json"})],f.PpOperationResponses.prototype,"responsesJson",2),ro([N()],f.PpOperationResponses.prototype,"responses",2),f.PpOperationResponses=ro([V("pp-operation-responses")],f.PpOperationResponses);const ol=L`
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
`;var il=Object.defineProperty,sl=Object.getOwnPropertyDescriptor,Qt=(t,e,r,o)=>{for(var i=o>1?void 0:o?sl(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&il(e,r,i),i};f.PpModelPage=class extends F{constructor(){super(...arguments),this.modelJson="",this.name="",this.parsed=null}willUpdate(e){if(e.has("modelJson")&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}}render(){if(!this.parsed)return P;const e=this.parsed,r=e.properties||{},o=new Set(e.required||[]),i=Object.entries(r);return x`
      ${e.type?x`<div><strong>Type:</strong> ${e.type}</div>`:P}
      ${i.length?x`
            <h3>Properties</h3>
            ${i.map(([s,a])=>x`
                <div class="property">
                  <span class="prop-name">${s}</span>
                  ${a.type?x`<span class="prop-type">${a.type}</span>`:P}
                  ${o.has(s)?x`<span class="required-badge">required</span>`:P}
                  ${a.description?x`<div class="prop-desc">${a.description}</div>`:P}
                </div>
              `)}
          `:P}
    `}},f.PpModelPage.styles=[eo,ol],Qt([b({attribute:"model-json"})],f.PpModelPage.prototype,"modelJson",2),Qt([b()],f.PpModelPage.prototype,"name",2),Qt([N()],f.PpModelPage.prototype,"parsed",2),f.PpModelPage=Qt([V("pp-model-page")],f.PpModelPage);const al=L`
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
`;var nl=Object.defineProperty,ll=Object.getOwnPropertyDescriptor,er=(t,e,r,o)=>{for(var i=o>1?void 0:o?ll(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&nl(e,r,i),i};f.PpModelCard=class extends F{constructor(){super(...arguments),this.name="",this.href="",this.description=""}render(){return x`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${this.description?x`<p>${this.description}</p>`:""}
      </a>
    `}},f.PpModelCard.styles=al,er([b()],f.PpModelCard.prototype,"name",2),er([b()],f.PpModelCard.prototype,"href",2),er([b()],f.PpModelCard.prototype,"description",2),f.PpModelCard=er([V("pp-model-card")],f.PpModelCard);const cl=L`
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
`;var dl=Object.defineProperty,hl=Object.getOwnPropertyDescriptor,oo=(t,e,r,o)=>{for(var i=o>1?void 0:o?hl(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&dl(e,r,i),i};f.PpCrossRefs=class extends F{constructor(){super(...arguments),this.refsJson="",this.refs={}}willUpdate(e){if(e.has("refsJson")&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){var o,i,s,a,n,l;const{refs:e}=this;return((o=e.UsedByOperations)==null?void 0:o.length)||((i=e.UsedByModels)==null?void 0:i.length)||((s=e.UsesModels)==null?void 0:s.length)?x`
      ${(a=e.UsedByOperations)!=null&&a.length?x`
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
          `:P}
      ${(n=e.UsedByModels)!=null&&n.length?x`
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
          `:P}
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
          `:P}
    `:P}},f.PpCrossRefs.styles=cl,oo([b({attribute:"refs-json"})],f.PpCrossRefs.prototype,"refsJson",2),oo([N()],f.PpCrossRefs.prototype,"refs",2),f.PpCrossRefs=oo([V("pp-cross-refs")],f.PpCrossRefs);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class io extends Lo{constructor(e){if(super(e),this.it=P,e.type!==Mo.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===P||e==null)return this._t=void 0,this.it=e;if(e===me)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const r=[e];return r.raw=r,this._t={_$litType$:this.constructor.resultType,strings:r,values:[]}}}io.directiveName="unsafeHTML",io.resultType=1;const Fi=zo(io);var Di=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function pl(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var so={exports:{}},ji;function ul(){return ji||(ji=1,(function(t){var e=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var r=(function(o){var i=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,s=0,a={},n={manual:o.Prism&&o.Prism.manual,disableWorkerMessageHandler:o.Prism&&o.Prism.disableWorkerMessageHandler,util:{encode:function h(d){return d instanceof l?new l(d.type,h(d.content),d.alias):Array.isArray(d)?d.map(h):d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(h){return Object.prototype.toString.call(h).slice(8,-1)},objId:function(h){return h.__id||Object.defineProperty(h,"__id",{value:++s}),h.__id},clone:function h(d,m){m=m||{};var y,v;switch(n.util.type(d)){case"Object":if(v=n.util.objId(d),m[v])return m[v];y={},m[v]=y;for(var A in d)d.hasOwnProperty(A)&&(y[A]=h(d[A],m));return y;case"Array":return v=n.util.objId(d),m[v]?m[v]:(y=[],m[v]=y,d.forEach(function(O,k){y[k]=h(O,m)}),y);default:return d}},getLanguage:function(h){for(;h;){var d=i.exec(h.className);if(d)return d[1].toLowerCase();h=h.parentElement}return"none"},setLanguage:function(h,d){h.className=h.className.replace(RegExp(i,"gi"),""),h.classList.add("language-"+d)},currentScript:function(){if(typeof document>"u")return null;if(document.currentScript&&document.currentScript.tagName==="SCRIPT")return document.currentScript;try{throw new Error}catch(y){var h=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(y.stack)||[])[1];if(h){var d=document.getElementsByTagName("script");for(var m in d)if(d[m].src==h)return d[m]}return null}},isActive:function(h,d,m){for(var y="no-"+d;h;){var v=h.classList;if(v.contains(d))return!0;if(v.contains(y))return!1;h=h.parentElement}return!!m}},languages:{plain:a,plaintext:a,text:a,txt:a,extend:function(h,d){var m=n.util.clone(n.languages[h]);for(var y in d)m[y]=d[y];return m},insertBefore:function(h,d,m,y){y=y||n.languages;var v=y[h],A={};for(var O in v)if(v.hasOwnProperty(O)){if(O==d)for(var k in m)m.hasOwnProperty(k)&&(A[k]=m[k]);m.hasOwnProperty(O)||(A[O]=v[O])}var T=y[h];return y[h]=A,n.languages.DFS(n.languages,function(z,D){D===T&&z!=h&&(this[z]=A)}),A},DFS:function h(d,m,y,v){v=v||{};var A=n.util.objId;for(var O in d)if(d.hasOwnProperty(O)){m.call(d,O,d[O],y||O);var k=d[O],T=n.util.type(k);T==="Object"&&!v[A(k)]?(v[A(k)]=!0,h(k,m,null,v)):T==="Array"&&!v[A(k)]&&(v[A(k)]=!0,h(k,m,O,v))}}},plugins:{},highlightAll:function(h,d){n.highlightAllUnder(document,h,d)},highlightAllUnder:function(h,d,m){var y={callback:m,container:h,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};n.hooks.run("before-highlightall",y),y.elements=Array.prototype.slice.apply(y.container.querySelectorAll(y.selector)),n.hooks.run("before-all-elements-highlight",y);for(var v=0,A;A=y.elements[v++];)n.highlightElement(A,d===!0,y.callback)},highlightElement:function(h,d,m){var y=n.util.getLanguage(h),v=n.languages[y];n.util.setLanguage(h,y);var A=h.parentElement;A&&A.nodeName.toLowerCase()==="pre"&&n.util.setLanguage(A,y);var O=h.textContent,k={element:h,language:y,grammar:v,code:O};function T(D){k.highlightedCode=D,n.hooks.run("before-insert",k),k.element.innerHTML=k.highlightedCode,n.hooks.run("after-highlight",k),n.hooks.run("complete",k),m&&m.call(k.element)}if(n.hooks.run("before-sanity-check",k),A=k.element.parentElement,A&&A.nodeName.toLowerCase()==="pre"&&!A.hasAttribute("tabindex")&&A.setAttribute("tabindex","0"),!k.code){n.hooks.run("complete",k),m&&m.call(k.element);return}if(n.hooks.run("before-highlight",k),!k.grammar){T(n.util.encode(k.code));return}if(d&&o.Worker){var z=new Worker(n.filename);z.onmessage=function(D){T(D.data)},z.postMessage(JSON.stringify({language:k.language,code:k.code,immediateClose:!0}))}else T(n.highlight(k.code,k.grammar,k.language))},highlight:function(h,d,m){var y={code:h,grammar:d,language:m};if(n.hooks.run("before-tokenize",y),!y.grammar)throw new Error('The language "'+y.language+'" has no grammar.');return y.tokens=n.tokenize(y.code,y.grammar),n.hooks.run("after-tokenize",y),l.stringify(n.util.encode(y.tokens),y.language)},tokenize:function(h,d){var m=d.rest;if(m){for(var y in m)d[y]=m[y];delete d.rest}var v=new u;return w(v,v.head,h),p(h,v,d,v.head,0),_(v)},hooks:{all:{},add:function(h,d){var m=n.hooks.all;m[h]=m[h]||[],m[h].push(d)},run:function(h,d){var m=n.hooks.all[h];if(!(!m||!m.length))for(var y=0,v;v=m[y++];)v(d)}},Token:l};o.Prism=n;function l(h,d,m,y){this.type=h,this.content=d,this.alias=m,this.length=(y||"").length|0}l.stringify=function h(d,m){if(typeof d=="string")return d;if(Array.isArray(d)){var y="";return d.forEach(function(T){y+=h(T,m)}),y}var v={type:d.type,content:h(d.content,m),tag:"span",classes:["token",d.type],attributes:{},language:m},A=d.alias;A&&(Array.isArray(A)?Array.prototype.push.apply(v.classes,A):v.classes.push(A)),n.hooks.run("wrap",v);var O="";for(var k in v.attributes)O+=" "+k+'="'+(v.attributes[k]||"").replace(/"/g,"&quot;")+'"';return"<"+v.tag+' class="'+v.classes.join(" ")+'"'+O+">"+v.content+"</"+v.tag+">"};function c(h,d,m,y){h.lastIndex=d;var v=h.exec(m);if(v&&y&&v[1]){var A=v[1].length;v.index+=A,v[0]=v[0].slice(A)}return v}function p(h,d,m,y,v,A){for(var O in m)if(!(!m.hasOwnProperty(O)||!m[O])){var k=m[O];k=Array.isArray(k)?k:[k];for(var T=0;T<k.length;++T){if(A&&A.cause==O+","+T)return;var z=k[T],D=z.inside,re=!!z.lookbehind,U=!!z.greedy,pe=z.alias;if(U&&!z.pattern.global){var oe=z.pattern.toString().match(/[imsuy]*$/)[0];z.pattern=RegExp(z.pattern.source,oe+"g")}for(var W=z.pattern||z,R=y.next,j=v;R!==d.tail&&!(A&&j>=A.reach);j+=R.value.length,R=R.next){var xe=R.value;if(d.length>h.length)return;if(!(xe instanceof l)){var or=1,ie;if(U){if(ie=c(W,j,h,re),!ie||ie.index>=h.length)break;var ir=ie.index,Sl=ie.index+ie[0].length,_e=j;for(_e+=R.value.length;ir>=_e;)R=R.next,_e+=R.value.length;if(_e-=R.value.length,j=_e,R.value instanceof l)continue;for(var _t=R;_t!==d.tail&&(_e<Sl||typeof _t.value=="string");_t=_t.next)or++,_e+=_t.value.length;or--,xe=h.slice(j,_e),ie.index-=j}else if(ie=c(W,0,xe,re),!ie)continue;var ir=ie.index,sr=ie[0],ao=xe.slice(0,ir),Ii=xe.slice(ir+sr.length),no=j+xe.length;A&&no>A.reach&&(A.reach=no);var ar=R.prev;ao&&(ar=w(d,ar,ao),j+=ao.length),g(d,ar,or);var Cl=new l(O,D?n.tokenize(sr,D):sr,pe,sr);if(R=w(d,ar,Cl),Ii&&w(d,R,Ii),or>1){var lo={cause:O+","+T,reach:no};p(h,d,m,R.prev,j,lo),A&&lo.reach>A.reach&&(A.reach=lo.reach)}}}}}}function u(){var h={value:null,prev:null,next:null},d={value:null,prev:h,next:null};h.next=d,this.head=h,this.tail=d,this.length=0}function w(h,d,m){var y=d.next,v={value:m,prev:d,next:y};return d.next=v,y.prev=v,h.length++,v}function g(h,d,m){for(var y=d.next,v=0;v<m&&y!==h.tail;v++)y=y.next;d.next=y,y.prev=d,h.length-=v}function _(h){for(var d=[],m=h.head.next;m!==h.tail;)d.push(m.value),m=m.next;return d}if(!o.document)return o.addEventListener&&(n.disableWorkerMessageHandler||o.addEventListener("message",function(h){var d=JSON.parse(h.data),m=d.language,y=d.code,v=d.immediateClose;o.postMessage(n.highlight(y,n.languages[m],m)),v&&o.close()},!1)),n;var E=n.util.currentScript();E&&(n.filename=E.src,E.hasAttribute("data-manual")&&(n.manual=!0));function S(){n.manual||n.highlightAll()}if(!n.manual){var C=document.readyState;C==="loading"||C==="interactive"&&E&&E.defer?document.addEventListener("DOMContentLoaded",S):window.requestAnimationFrame?window.requestAnimationFrame(S):window.setTimeout(S,16)}return n})(e);t.exports&&(t.exports=r),typeof Di<"u"&&(Di.Prism=r),r.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},r.languages.markup.tag.inside["attr-value"].inside.entity=r.languages.markup.entity,r.languages.markup.doctype.inside["internal-subset"].inside=r.languages.markup,r.hooks.add("wrap",function(o){o.type==="entity"&&(o.attributes.title=o.content.replace(/&amp;/,"&"))}),Object.defineProperty(r.languages.markup.tag,"addInlined",{value:function(i,s){var a={};a["language-"+s]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:r.languages[s]},a.cdata=/^<!\[CDATA\[|\]\]>$/i;var n={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:a}};n["language-"+s]={pattern:/[\s\S]+/,inside:r.languages[s]};var l={};l[i]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return i}),"i"),lookbehind:!0,greedy:!0,inside:n},r.languages.insertBefore("markup","cdata",l)}}),Object.defineProperty(r.languages.markup.tag,"addAttribute",{value:function(o,i){r.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+o+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[i,"language-"+i],inside:r.languages[i]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),r.languages.html=r.languages.markup,r.languages.mathml=r.languages.markup,r.languages.svg=r.languages.markup,r.languages.xml=r.languages.extend("markup",{}),r.languages.ssml=r.languages.xml,r.languages.atom=r.languages.xml,r.languages.rss=r.languages.xml,(function(o){var i=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;o.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+i.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+i.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+i.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+i.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:i,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},o.languages.css.atrule.inside.rest=o.languages.css;var s=o.languages.markup;s&&(s.tag.addInlined("style","css"),s.tag.addAttribute("style","css"))})(r),r.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},r.languages.javascript=r.languages.extend("clike",{"class-name":[r.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),r.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,r.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:r.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:r.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:r.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:r.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:r.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),r.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:r.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),r.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),r.languages.markup&&(r.languages.markup.tag.addInlined("script","javascript"),r.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),r.languages.js=r.languages.javascript,(function(){if(typeof r>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var o="Loading…",i=function(E,S){return"✖ Error "+E+" while fetching file: "+S},s="✖ Error: File does not exist or is empty",a={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},n="data-src-status",l="loading",c="loaded",p="failed",u="pre[data-src]:not(["+n+'="'+c+'"]):not(['+n+'="'+l+'"])';function w(E,S,C){var h=new XMLHttpRequest;h.open("GET",E,!0),h.onreadystatechange=function(){h.readyState==4&&(h.status<400&&h.responseText?S(h.responseText):h.status>=400?C(i(h.status,h.statusText)):C(s))},h.send(null)}function g(E){var S=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(E||"");if(S){var C=Number(S[1]),h=S[2],d=S[3];return h?d?[C,Number(d)]:[C,void 0]:[C,C]}}r.hooks.add("before-highlightall",function(E){E.selector+=", "+u}),r.hooks.add("before-sanity-check",function(E){var S=E.element;if(S.matches(u)){E.code="",S.setAttribute(n,l);var C=S.appendChild(document.createElement("CODE"));C.textContent=o;var h=S.getAttribute("data-src"),d=E.language;if(d==="none"){var m=(/\.(\w+)$/.exec(h)||[,"none"])[1];d=a[m]||m}r.util.setLanguage(C,d),r.util.setLanguage(S,d);var y=r.plugins.autoloader;y&&y.loadLanguages(d),w(h,function(v){S.setAttribute(n,c);var A=g(S.getAttribute("data-range"));if(A){var O=v.split(/\r\n?|\n/g),k=A[0],T=A[1]==null?O.length:A[1];k<0&&(k+=O.length),k=Math.max(0,Math.min(k-1,O.length)),T<0&&(T+=O.length),T=Math.max(0,Math.min(T,O.length)),v=O.slice(k,T).join(`
`),S.hasAttribute("data-start")||S.setAttribute("data-start",String(k+1))}C.textContent=v,r.highlightElement(C)},function(v){S.setAttribute(n,p),C.textContent=v})}}),r.plugins.fileHighlight={highlight:function(S){for(var C=(S||document).querySelectorAll(u),h=0,d;d=C[h++];)r.highlightElement(d)}};var _=!1;r.fileHighlight=function(){_||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),_=!0),r.plugins.fileHighlight.highlight.apply(this,arguments)}})()})(so)),so.exports}var fl=ul();const rt=pl(fl);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json;const ml=L`
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
`,Bi=L`
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
`;var gl=Object.defineProperty,vl=Object.getOwnPropertyDescriptor,tr=(t,e,r,o)=>{for(var i=o>1?void 0:o?vl(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&gl(e,r,i),i};rt.manual=!0,f.PpExampleBlock=class extends F{constructor(){super(...arguments),this.name="",this.exampleJson="",this.formatted=""}willUpdate(e){if(e.has("exampleJson")&&this.exampleJson)try{const r=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(r,null,2)}catch{this.formatted=""}}render(){if(!this.formatted)return P;let e;try{e=rt.highlight(this.formatted,rt.languages.json,"json")}catch{e=this.formatted}return x`
      <details>
        <summary>${this.name||"Example"}</summary>
        <pre class="json"><code>${Fi(e)}</code></pre>
      </details>
    `}},f.PpExampleBlock.styles=[ml,Bi],tr([b()],f.PpExampleBlock.prototype,"name",2),tr([b({attribute:"example-json"})],f.PpExampleBlock.prototype,"exampleJson",2),tr([N()],f.PpExampleBlock.prototype,"formatted",2),f.PpExampleBlock=tr([V("pp-example-block")],f.PpExampleBlock),(function(t){var e=/[*&][^\s[\]{},]+/,r=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,o="(?:"+r.source+"(?:[ 	]+"+e.source+")?|"+e.source+"(?:[ 	]+"+r.source+")?)",i=/(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g,function(){return/[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source}),s=/"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;function a(n,l){l=(l||"").replace(/m/g,"")+"m";var c=/([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<value>>/g,function(){return n});return RegExp(c,l)}t.languages.yaml={scalar:{pattern:RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g,function(){return o})),lookbehind:!0,alias:"string"},comment:/#.*/,key:{pattern:RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g,function(){return o}).replace(/<<key>>/g,function(){return"(?:"+i+"|"+s+")"})),lookbehind:!0,greedy:!0,alias:"atrule"},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:"important"},datetime:{pattern:a(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),lookbehind:!0,alias:"number"},boolean:{pattern:a(/false|true/.source,"i"),lookbehind:!0,alias:"important"},null:{pattern:a(/null|~/.source,"i"),lookbehind:!0,alias:"important"},string:{pattern:a(s),lookbehind:!0,greedy:!0},number:{pattern:a(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,"i"),lookbehind:!0},tag:r,important:e,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},t.languages.yml=t.languages.yaml})(Prism);const yl=L`
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
`;var bl=Object.defineProperty,wl=Object.getOwnPropertyDescriptor,Be=(t,e,r,o)=>{for(var i=o>1?void 0:o?wl(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&bl(e,r,i),i};rt.manual=!0,f.PpExampleDrawer=class extends F{constructor(){super(...arguments),this.title="",this.json="",this.yaml="",this.format="json",this.copied=!1,this.handleShowExample=e=>{const r=e.detail;this.title=r.title,this.json=r.json,this.yaml=r.yaml||"",this.format=r.json?"json":r.yaml?"yaml":"json",this.updateComplete.then(()=>{const o=this.drawer;o&&(o.updateComplete?o.updateComplete.then(()=>o.show()):o.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener("pp-show-example",this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pp-show-example",this.handleShowExample)}get displayJson(){if(!this.json)return"";try{return JSON.stringify(JSON.parse(this.json),null,2)}catch{return this.json}}highlighted(){const e=this.format==="yaml"&&this.yaml,r=e?this.yaml:this.displayJson;if(!r)return"";const o=e?"yaml":"json";try{return rt.highlight(r,rt.languages[o],o)}catch{return r}}get copyText(){return this.format==="yaml"&&this.yaml?this.yaml:this.displayJson}async copyToClipboard(){const e=this.copyText;if(e)try{await navigator.clipboard.writeText(e),this.copied=!0,setTimeout(()=>{this.copied=!1},2e3)}catch{}}render(){return x`
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
        <pre class="${this.format}"><code>${Fi(this.highlighted())}</code></pre>
        <button
          slot="footer"
          class="copy-btn ${this.copied?"copied":""}"
          @click=${this.copyToClipboard}>
          ${this.copied?"Copied!":"Copy to Clipboard"}
        </button>
      </sl-drawer>
    `}},f.PpExampleDrawer.styles=[yl,Bi],Be([N()],f.PpExampleDrawer.prototype,"title",2),Be([N()],f.PpExampleDrawer.prototype,"json",2),Be([N()],f.PpExampleDrawer.prototype,"yaml",2),Be([N()],f.PpExampleDrawer.prototype,"format",2),Be([N()],f.PpExampleDrawer.prototype,"copied",2),Be([Z("sl-drawer")],f.PpExampleDrawer.prototype,"drawer",2),f.PpExampleDrawer=Be([V("pp-example-drawer")],f.PpExampleDrawer);const $l=L`
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
`;var xl=Object.defineProperty,_l=Object.getOwnPropertyDescriptor,xt=(t,e,r,o)=>{for(var i=o>1?void 0:o?_l(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&xl(e,r,i),i};f.PpExampleSelector=class extends F{constructor(){super(...arguments),this.examplesData="",this.mockJson="",this.examplesJson="",this.entries=[]}willUpdate(e){(e.has("examplesData")||e.has("mockJson")||e.has("examplesJson"))&&this.buildEntries()}buildEntries(){const e=[];let r=this.mockJson,o={};if(this.examplesData)try{const i=JSON.parse(this.examplesData);i.mockJson&&(r=i.mockJson),i.examples&&(o=i.examples)}catch{}if(this.examplesJson)try{o={...o,...JSON.parse(this.examplesJson)}}catch{}for(const[i,s]of Object.entries(o))s&&e.push({key:i,json:s});r&&e.push({key:"Generated Example",json:r}),this.entries=e}showExample(e){let r=e.json;try{r=JSON.stringify(JSON.parse(e.json),null,2)}catch{}const o=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:e.key,json:r}});document.dispatchEvent(o)}render(){if(!this.entries.length)return P;if(this.entries.length===1){const e=this.entries[0];return x`
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
    `}},f.PpExampleSelector.styles=$l,xt([b({attribute:"examples-data"})],f.PpExampleSelector.prototype,"examplesData",2),xt([b({attribute:"mock-json"})],f.PpExampleSelector.prototype,"mockJson",2),xt([b({attribute:"examples-json"})],f.PpExampleSelector.prototype,"examplesJson",2),xt([N()],f.PpExampleSelector.prototype,"entries",2),f.PpExampleSelector=xt([V("pp-example-selector")],f.PpExampleSelector);const Al=L`
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
`;var Pl=Object.defineProperty,kl=Object.getOwnPropertyDescriptor,rr=(t,e,r,o)=>{for(var i=o>1?void 0:o?kl(e,r):e,s=t.length-1,a;s>=0;s--)(a=t[s])&&(i=(o?a(e,r,i):a(i))||i);return o&&i&&Pl(e,r,i),i};f.PpRawViewerBtn=class extends F{constructor(){super(...arguments),this.btnTitle="",this.rawJson="",this.rawYaml=""}showRaw(){const e=new CustomEvent("pp-show-example",{bubbles:!0,composed:!0,detail:{title:this.btnTitle||"Raw Object",json:this.rawJson,yaml:this.rawYaml}});document.dispatchEvent(e)}render(){return!this.rawJson&&!this.rawYaml?P:x`<button @click=${this.showRaw}>View Raw</button>`}},f.PpRawViewerBtn.styles=[Al],rr([b({attribute:"title"})],f.PpRawViewerBtn.prototype,"btnTitle",2),rr([b({attribute:"raw-json"})],f.PpRawViewerBtn.prototype,"rawJson",2),rr([b({attribute:"raw-yaml"})],f.PpRawViewerBtn.prototype,"rawYaml",2),f.PpRawViewerBtn=rr([V("pp-raw-viewer-btn")],f.PpRawViewerBtn),yr("static/shoelace");const El={sun:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>',display:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>',"chevron-right":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>',"chevron-down":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>',"grip-vertical":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'};return ws("default",{resolver:t=>{const e=El[t];return e?`data:image/svg+xml,${encodeURIComponent(e)}`:`static/shoelace/assets/icons/${t}.svg`}}),Object.defineProperty(f,Symbol.toStringTag,{value:"Module"}),f})({});
