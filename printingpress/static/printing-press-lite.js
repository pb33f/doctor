var PrintingPress=(function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=Object.create,n=Object.defineProperty,r=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,a=Object.getPrototypeOf,o=Object.prototype.hasOwnProperty,s=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),c=(e,t,a,s)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var c=i(t),l=0,u=c.length,d;l<u;l++)d=c[l],!o.call(e,d)&&d!==a&&n(e,d,{get:(e=>t[e]).bind(null,d),enumerable:!(s=r(t,d))||s.enumerable});return e},l=(e,r,i)=>(i=e==null?{}:t(a(e)),c(r||!e||!e.__esModule?n(i,`default`,{value:e,enumerable:!0}):i,e)),u=new Map,d=!1;function f(){if(d)return;let e=document.getElementById(`pp-schema-registry`);if(e?.textContent)try{p(JSON.parse(e.textContent))}catch{}}function p(e){u.clear();for(let[t,n]of Object.entries(e))u.set(t,n);d=!0}function m(e){return f(),u.get(e)}function h(e){if(e?.startsWith(`#/components/`))return m(e.replace(`#/components/`,``))}var g=`__PP_SHARED_DATA__`,_=`__PP_PAGE_DATA__`;function v(e){return document.body?.dataset?.[e]||``}async function y(e,t){await new Promise((t,n)=>{let r=document.createElement(`script`);r.src=`${e}.js`,r.async=!1,r.onload=()=>{r.remove(),t()},r.onerror=()=>{r.remove(),n(Error(`unable to load script payload: ${e}.js`))},document.head.appendChild(r)});let n=globalThis[t];return delete globalThis[t],n||null}async function ee(e){let t=await fetch(`${e}.json`);if(!t.ok)throw Error(`unable to fetch hydration payload: ${e}.json (${t.status})`);return await t.json()}async function b(e,t){return e?window.location.protocol===`file:`?y(e,t):ee(e):null}function x(e){for(let[t,n]of Object.entries(e)){let e=document.getElementById(t);if(e)for(let[t,r]of Object.entries(n))e.setAttribute(t,r)}}function S(e){e.querySelectorAll(`:scope > [data-pp-hydrated="true"]`).forEach(e=>e.remove())}function C(e){let t=document.createElement(e.tag);return t.setAttribute(`data-pp-hydrated`,`true`),e.id&&(t.id=e.id),e.class&&(t.className=e.class),e.type&&e.tag===`script`&&(t.type=e.type),e.tag===`template`?t.innerHTML=e.html||``:t.textContent=e.text||``,t}function w(e){for(let[t,n]of Object.entries(e)){let e=document.getElementById(t);if(e){S(e);for(let t of n)e.appendChild(C(t))}}}function te(e){e&&(e.schemaRegistry&&p(e.schemaRegistry),e.attributes&&x(e.attributes),e.children&&w(e.children))}function ne(){document.dispatchEvent(new CustomEvent(`pp:hydrated`))}async function re(){try{let e=v(`ppShared`),t=v(`ppPage`);te(await b(e,g)),te(await b(t,_)),ne()}catch(e){console.error(`printing-press hydration failed`,e)}}var ie=globalThis,T=ie.ShadowRoot&&(ie.ShadyCSS===void 0||ie.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,ae=Symbol(),oe=new WeakMap,se=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(T&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=oe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&oe.set(t,e))}return e}toString(){return this.cssText}},ce=e=>new se(typeof e==`string`?e:e+``,void 0,ae),E=(e,...t)=>new se(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,ae),le=(e,t)=>{if(T)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=ie.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},ue=T?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return ce(t)})(e):e,{is:de,defineProperty:fe,getOwnPropertyDescriptor:pe,getOwnPropertyNames:me,getOwnPropertySymbols:he,getPrototypeOf:ge}=Object,_e=globalThis,ve=_e.trustedTypes,ye=ve?ve.emptyScript:``,be=_e.reactiveElementPolyfillSupport,xe=(e,t)=>e,Se={toAttribute(e,t){switch(t){case Boolean:e=e?ye:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},Ce=(e,t)=>!de(e,t),we={attribute:!0,type:String,converter:Se,reflect:!1,useDefault:!1,hasChanged:Ce};Symbol.metadata??=Symbol(`metadata`),_e.litPropertyMetadata??=new WeakMap;var Te=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=we){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&fe(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=pe(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??we}static _$Ei(){if(this.hasOwnProperty(xe(`elementProperties`)))return;let e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(xe(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(xe(`properties`))){let e=this.properties,t=[...me(e),...he(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(ue(e))}else e!==void 0&&t.push(ue(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return le(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?Se:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?Se:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??Ce)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};Te.elementStyles=[],Te.shadowRootOptions={mode:`open`},Te[xe(`elementProperties`)]=new Map,Te[xe(`finalized`)]=new Map,be?.({ReactiveElement:Te}),(_e.reactiveElementVersions??=[]).push(`2.1.2`);var Ee=globalThis,De=e=>e,Oe=Ee.trustedTypes,ke=Oe?Oe.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,Ae=`$lit$`,je=`lit$${Math.random().toFixed(9).slice(2)}$`,Me=`?`+je,Ne=`<${Me}>`,Pe=document,Fe=()=>Pe.createComment(``),Ie=e=>e===null||typeof e!=`object`&&typeof e!=`function`,Le=Array.isArray,Re=e=>Le(e)||typeof e?.[Symbol.iterator]==`function`,ze=`[ 	
\f\r]`,Be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,He=/>/g,Ue=RegExp(`>|${ze}(?:([^\\s"'>=/]+)(${ze}*=${ze}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),We=/'/g,Ge=/"/g,Ke=/^(?:script|style|textarea|title)$/i,D=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),qe=Symbol.for(`lit-noChange`),O=Symbol.for(`lit-nothing`),Je=new WeakMap,Ye=Pe.createTreeWalker(Pe,129);function Xe(e,t){if(!Le(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ke===void 0?t:ke.createHTML(t)}var Ze=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=Be;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===Be?c[1]===`!--`?o=Ve:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=Ue):(Ke.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=Ue):o=He:o===Ue?c[0]===`>`?(o=i??Be,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?Ue:c[3]===`"`?Ge:We):o===Ge||o===We?o=Ue:o===Ve||o===He?o=Be:(o=Ue,i=void 0);let d=o===Ue&&e[t+1].startsWith(`/>`)?` `:``;a+=o===Be?n+Ne:l>=0?(r.push(s),n.slice(0,l)+Ae+n.slice(l)+je+d):n+je+(l===-2?t:d)}return[Xe(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Qe=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Ze(t,n);if(this.el=e.createElement(l,r),Ye.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Ye.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(Ae)){let t=u[o++],n=i.getAttribute(e).split(je),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?rt:r[1]===`?`?it:r[1]===`@`?at:nt}),i.removeAttribute(e)}else e.startsWith(je)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Ke.test(i.tagName)){let e=i.textContent.split(je),t=e.length-1;if(t>0){i.textContent=Oe?Oe.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],Fe()),Ye.nextNode(),c.push({type:2,index:++a});i.append(e[t],Fe())}}}else if(i.nodeType===8)if(i.data===Me)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(je,e+1))!==-1;)c.push({type:7,index:a}),e+=je.length-1}a++}}static createElement(e,t){let n=Pe.createElement(`template`);return n.innerHTML=e,n}};function $e(e,t,n=e,r){if(t===qe)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=Ie(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=$e(e,i._$AS(e,t.values),i,r)),t}var et=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??Pe).importNode(t,!0);Ye.currentNode=r;let i=Ye.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new tt(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new ot(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Ye.nextNode(),a++)}return Ye.currentNode=Pe,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},tt=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=$e(this,e,t),Ie(e)?e===O||e==null||e===``?(this._$AH!==O&&this._$AR(),this._$AH=O):e!==this._$AH&&e!==qe&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Re(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==O&&Ie(this._$AH)?this._$AA.nextSibling.data=e:this.T(Pe.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Qe.createElement(Xe(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new et(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Je.get(e.strings);return t===void 0&&Je.set(e.strings,t=new Qe(e)),t}k(t){Le(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(Fe()),this.O(Fe()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=De(e).nextSibling;De(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},nt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=O,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=O}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=$e(this,e,t,0),a=!Ie(e)||e!==this._$AH&&e!==qe,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=$e(this,r[n+o],t,o),s===qe&&(s=this._$AH[o]),a||=!Ie(s)||s!==this._$AH[o],s===O?e=O:e!==O&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},rt=class extends nt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===O?void 0:e}},it=class extends nt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==O)}},at=class extends nt{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=$e(this,e,t,0)??O)===qe)return;let n=this._$AH,r=e===O&&n!==O||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==O&&(n===O||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ot=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){$e(this,e)}},st={M:Ae,P:je,A:Me,C:1,L:Ze,R:et,D:Re,V:$e,I:tt,H:nt,N:it,U:at,B:rt,F:ot},ct=Ee.litHtmlPolyfillSupport;ct?.(Qe,tt),(Ee.litHtmlVersions??=[]).push(`3.3.2`);var lt=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new tt(t.insertBefore(Fe(),e),e,void 0,n??{})}return i._$AI(e),i},ut=globalThis,k=class extends Te{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=lt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return qe}};k._$litElement$=!0,k.finalized=!0,ut.litElementHydrateSupport?.({LitElement:k});var dt=ut.litElementPolyfillSupport;dt?.({LitElement:k}),(ut.litElementVersions??=[]).push(`4.2.2`);var ft=E`
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
`,pt=E`
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
`,mt=``;function ht(e){mt=e}function gt(e=``){if(!mt){let e=[...document.getElementsByTagName(`script`)],t=e.find(e=>e.hasAttribute(`data-shoelace`));if(t)ht(t.getAttribute(`data-shoelace`));else{let t=e.find(e=>/shoelace(\.min)?\.js($|\?)/.test(e.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(e.src)),n=``;t&&(n=t.getAttribute(`src`)),ht(n.split(`/`).slice(0,-1).join(`/`))}}return mt.replace(/\/$/,``)+(e?`/${e.replace(/^\//,``)}`:``)}var _t={name:`default`,resolver:e=>gt(`assets/icons/${e}.svg`)},vt={caret:`
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
  `},yt=[_t,{name:`system`,resolver:e=>e in vt?`data:image/svg+xml,${encodeURIComponent(vt[e])}`:``}],bt=[];function xt(e){bt.push(e)}function St(e){bt=bt.filter(t=>t!==e)}function Ct(e){return yt.find(t=>t.name===e)}function wt(e,t){Tt(e),yt.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),bt.forEach(t=>{t.library===e&&t.setIcon()})}function Tt(e){yt=yt.filter(t=>t.name!==e)}var Et=E`
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
`,Dt=Object.defineProperty,Ot=Object.defineProperties,kt=Object.getOwnPropertyDescriptor,At=Object.getOwnPropertyDescriptors,jt=Object.getOwnPropertySymbols,Mt=Object.prototype.hasOwnProperty,Nt=Object.prototype.propertyIsEnumerable,Pt=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Ft=e=>{throw TypeError(e)},It=(e,t,n)=>t in e?Dt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Lt=(e,t)=>{for(var n in t||={})Mt.call(t,n)&&It(e,n,t[n]);if(jt)for(var n of jt(t))Nt.call(t,n)&&It(e,n,t[n]);return e},Rt=(e,t)=>Ot(e,At(t)),A=(e,t,n,r)=>{for(var i=r>1?void 0:r?kt(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&Dt(t,n,i),i},zt=(e,t,n)=>t.has(e)||Ft(`Cannot `+n),Bt=(e,t,n)=>(zt(e,t,`read from private field`),n?n.call(e):t.get(e)),Vt=(e,t,n)=>t.has(e)?Ft(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ht=(e,t,n,r)=>(zt(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ut=function(e,t){this[0]=e,this[1]=t},Wt=e=>{var t=e[Pt(`asyncIterator`)],n=!1,r,i={};return t==null?(t=e[Pt(`iterator`)](),r=e=>i[e]=n=>t[e](n)):(t=t.call(e),r=e=>i[e]=r=>{if(n){if(n=!1,e===`throw`)throw r;return r}return n=!0,{done:!1,value:new Ut(new Promise(n=>{var i=t[e](r);i instanceof Object||Ft(`Object expected`),n(i)}),1)}}),i[Pt(`iterator`)]=()=>i,r(`next`),`throw`in t?r(`throw`):i.throw=e=>{throw e},`return`in t&&r(`return`),i};function j(e,t){let n=Lt({waitUntilFirstUpdate:!1},t);return(t,r)=>{let{update:i}=t,a=Array.isArray(e)?e:[e];t.update=function(e){a.forEach(t=>{let i=t;if(e.has(i)){let t=e.get(i),a=this[i];t!==a&&(!n.waitUntilFirstUpdate||this.hasUpdated)&&this[r](t,a)}}),i.call(this,e)}}}var M=E`
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
`,N=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Gt={attribute:!0,type:String,converter:Se,reflect:!1,hasChanged:Ce},Kt=(e=Gt,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function P(e){return(t,n)=>typeof n==`object`?Kt(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function F(e){return P({...e,state:!0,attribute:!1})}function qt(e){return(t,n)=>{let r=typeof t==`function`?t:t[n];Object.assign(r,e)}}var Jt=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function I(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Jt(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Jt(n,r,{get(){return a(this)}})}}var Yt,L=class extends k{constructor(){super(),Vt(this,Yt,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){let n=new CustomEvent(e,Lt({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(n),n}static define(e,t=this,n={}){let r=customElements.get(e);if(!r){try{customElements.define(e,t,n)}catch{customElements.define(e,class extends t{},n)}return}let i=` (unknown version)`,a=i;`version`in t&&t.version&&(i=` v`+t.version),`version`in r&&r.version&&(a=` v`+r.version),!(i&&a&&i===a)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${a} has already been registered.`)}attributeChangedCallback(e,t,n){Bt(this,Yt)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),Ht(this,Yt,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}};Yt=new WeakMap,L.version=`2.20.1`,L.dependencies={},A([P()],L.prototype,`dir`,2),A([P()],L.prototype,`lang`,2);var{I:Xt}=st,Zt=(e,t)=>t===void 0?e?._$litType$!==void 0:e?._$litType$===t,Qt=e=>e.strings===void 0,$t={},en=(e,t=$t)=>e._$AH=t,tn=Symbol(),nn=Symbol(),rn,an=new Map,on=class extends L{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label=``,this.library=`default`}async resolveIcon(e,t){let n;if(t?.spriteSheet)return this.svg=D`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(n=await fetch(e,{mode:`cors`}),!n.ok)return n.status===410?tn:nn}catch{return nn}try{let e=document.createElement(`div`);e.innerHTML=await n.text();let t=e.firstElementChild;if((t?.tagName)?.toLowerCase()!==`svg`)return tn;rn||=new DOMParser;let r=rn.parseFromString(t.outerHTML,`text/html`).body.querySelector(`svg`);return r?(r.part.add(`svg`),document.adoptNode(r)):tn}catch{return tn}}connectedCallback(){super.connectedCallback(),xt(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),St(this)}getIconSource(){let e=Ct(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label==`string`&&this.label.length>0?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,this.label),this.removeAttribute(`aria-hidden`)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`),this.setAttribute(`aria-hidden`,`true`))}async setIcon(){var e;let{url:t,fromLibrary:n}=this.getIconSource(),r=n?Ct(this.library):void 0;if(!t){this.svg=null;return}let i=an.get(t);if(i||(i=this.resolveIcon(t,r),an.set(t,i)),!this.initialRender)return;let a=await i;if(a===nn&&an.delete(t),t===this.getIconSource().url){if(Zt(a)){if(this.svg=a,r){await this.updateComplete;let e=this.shadowRoot.querySelector(`[part='svg']`);typeof r.mutator==`function`&&e&&r.mutator(e)}return}switch(a){case nn:case tn:this.svg=null,this.emit(`sl-error`);break;default:this.svg=a.cloneNode(!0),(e=r?.mutator)==null||e.call(r,this.svg),this.emit(`sl-load`)}}}render(){return this.svg}};on.styles=[M,Et],A([F()],on.prototype,`svg`,2),A([P({reflect:!0})],on.prototype,`name`,2),A([P()],on.prototype,`src`,2),A([P()],on.prototype,`label`,2),A([P({reflect:!0})],on.prototype,`library`,2),A([j(`label`)],on.prototype,`handleLabelChange`,1),A([j([`name`,`src`,`library`])],on.prototype,`setIcon`,1);var sn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},cn=e=>(...t)=>({_$litDirective$:e,values:t}),ln=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},R=cn(class extends ln{constructor(e){if(super(e),e.type!==sn.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return qe}}),un=Symbol.for(``),dn=e=>{if(e?.r===un)return e?._$litStatic$},fn=e=>({_$litStatic$:e,r:un}),pn=(e,...t)=>({_$litStatic$:t.reduce((t,n,r)=>t+(e=>{if(e._$litStatic$!==void 0)return e._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${e}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+e[r+1],e[0]),r:un}),mn=new Map,hn=(e=>(t,...n)=>{let r=n.length,i,a,o=[],s=[],c,l=0,u=!1;for(;l<r;){for(c=t[l];l<r&&(a=n[l],i=dn(a))!==void 0;)c+=i+t[++l],u=!0;l!==r&&s.push(a),o.push(c),l++}if(l===r&&o.push(t[r]),u){let e=o.join(`$$lit$$`);(t=mn.get(e))===void 0&&(o.raw=o,mn.set(e,t=o)),n=s}return e(t,...n)})(D),z=e=>e??O,B=class extends L{constructor(){super(...arguments),this.hasFocus=!1,this.label=``,this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){let e=!!this.href,t=e?pn`a`:pn`button`;return hn`
      <${t}
        part="base"
        class=${R({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${z(e?void 0:this.disabled)}
        type=${z(e?void 0:`button`)}
        href=${z(e?this.href:void 0)}
        target=${z(e?this.target:void 0)}
        download=${z(e?this.download:void 0)}
        rel=${z(e&&this.target?`noreferrer noopener`:void 0)}
        role=${z(e?void 0:`button`)}
        aria-disabled=${this.disabled?`true`:`false`}
        aria-label="${this.label}"
        tabindex=${this.disabled?`-1`:`0`}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${z(this.name)}
          library=${z(this.library)}
          src=${z(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};B.styles=[M,pt],B.dependencies={"sl-icon":on},A([I(`.icon-button`)],B.prototype,`button`,2),A([F()],B.prototype,`hasFocus`,2),A([P()],B.prototype,`name`,2),A([P()],B.prototype,`library`,2),A([P()],B.prototype,`src`,2),A([P()],B.prototype,`href`,2),A([P()],B.prototype,`target`,2),A([P()],B.prototype,`download`,2),A([P()],B.prototype,`label`,2),A([P({type:Boolean,reflect:!0})],B.prototype,`disabled`,2);var gn=new Set,_n=new Map,vn,yn=`ltr`,bn=`en`,xn=typeof MutationObserver<`u`&&typeof document<`u`&&document.documentElement!==void 0;if(xn){let e=new MutationObserver(Cn);yn=document.documentElement.dir||`ltr`,bn=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:[`dir`,`lang`]})}function Sn(...e){e.map(e=>{let t=e.$code.toLowerCase();_n.has(t)?_n.set(t,Object.assign(Object.assign({},_n.get(t)),e)):_n.set(t,e),vn||=e}),Cn()}function Cn(){xn&&(yn=document.documentElement.dir||`ltr`,bn=document.documentElement.lang||navigator.language),[...gn.keys()].map(e=>{typeof e.requestUpdate==`function`&&e.requestUpdate()})}var wn=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){gn.add(this.host)}hostDisconnected(){gn.delete(this.host)}dir(){return`${this.host.dir||yn}`.toLowerCase()}lang(){return`${this.host.lang||bn}`.toLowerCase()}getTranslationData(e){let t=new Intl.Locale(e.replace(/_/g,`-`)),n=t?.language.toLowerCase(),r=(t?.region)?.toLowerCase()??``;return{locale:t,language:n,region:r,primary:_n.get(`${n}-${r}`),secondary:_n.get(n)}}exists(e,t){let{primary:n,secondary:r}=this.getTranslationData(t.lang??this.lang());return t=Object.assign({includeFallback:!1},t),!!(n&&n[e]||r&&r[e]||t.includeFallback&&vn&&vn[e])}term(e,...t){let{primary:n,secondary:r}=this.getTranslationData(this.lang()),i;if(n&&n[e])i=n[e];else if(r&&r[e])i=r[e];else if(vn&&vn[e])i=vn[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i==`function`?i(...t):i}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?``:new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}},Tn={$code:`en`,$name:`English`,$dir:`ltr`,carousel:`Carousel`,clearEntry:`Clear entry`,close:`Close`,copied:`Copied`,copy:`Copy`,currentValue:`Current value`,error:`Error`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:`Hide password`,loading:`Loading`,nextSlide:`Next slide`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,previousSlide:`Previous slide`,progress:`Progress`,remove:`Remove`,resize:`Resize`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,selectAColorFromTheScreen:`Select a color from the screen`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,toggleColorFormat:`Toggle color format`};Sn(Tn);var En=Tn,Dn=class extends wn{};Sn(En);var On=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.variant=`neutral`,this.size=`medium`,this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit(`sl-remove`)}render(){return D`
      <span
        part="base"
        class=${R({tag:!0,"tag--primary":this.variant===`primary`,"tag--success":this.variant===`success`,"tag--neutral":this.variant===`neutral`,"tag--warning":this.variant===`warning`,"tag--danger":this.variant===`danger`,"tag--text":this.variant===`text`,"tag--small":this.size===`small`,"tag--medium":this.size===`medium`,"tag--large":this.size===`large`,"tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?D`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term(`remove`)}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `:``}
      </span>
    `}};On.styles=[M,ft],On.dependencies={"sl-icon-button":B},A([P({reflect:!0})],On.prototype,`variant`,2),A([P({reflect:!0})],On.prototype,`size`,2),A([P({type:Boolean,reflect:!0})],On.prototype,`pill`,2),A([P({type:Boolean})],On.prototype,`removable`,2),On.define(`sl-tag`),B.define(`sl-icon-button`);var kn=E`
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
`,An=E`
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
`,jn=Math.min,Mn=Math.max,Nn=Math.round,Pn=Math.floor,Fn=e=>({x:e,y:e}),In={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function Ln(e,t,n){return Mn(e,jn(t,n))}function Rn(e,t){return typeof e==`function`?e(t):e}function zn(e){return e.split(`-`)[0]}function Bn(e){return e.split(`-`)[1]}function Vn(e){return e===`x`?`y`:`x`}function Hn(e){return e===`y`?`height`:`width`}function Un(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function Wn(e){return Vn(Un(e))}function Gn(e,t,n){n===void 0&&(n=!1);let r=Bn(e),i=Wn(e),a=Hn(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=er(o)),[o,er(o)]}function Kn(e){let t=er(e);return[qn(e),t,qn(t)]}function qn(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var Jn=[`left`,`right`],Yn=[`right`,`left`],Xn=[`top`,`bottom`],Zn=[`bottom`,`top`];function Qn(e,t,n){switch(e){case`top`:case`bottom`:return n?t?Yn:Jn:t?Jn:Yn;case`left`:case`right`:return t?Xn:Zn;default:return[]}}function $n(e,t,n,r){let i=Bn(e),a=Qn(zn(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(qn)))),a}function er(e){let t=zn(e);return In[t]+e.slice(t.length)}function tr(e){return{top:0,right:0,bottom:0,left:0,...e}}function nr(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:tr(e)}function rr(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function ir(e,t,n){let{reference:r,floating:i}=e,a=Un(t),o=Wn(t),s=Hn(o),c=zn(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(Bn(t)){case`start`:p[o]-=f*(n&&l?-1:1);break;case`end`:p[o]+=f*(n&&l?-1:1);break}return p}async function ar(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=Rn(t,e),p=nr(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=rr(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=rr(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}var or=50,sr=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:ar},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=ir(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:ee,reset:b}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...ee},b&&p<or&&(p++,typeof b==`object`&&(b.placement&&(f=b.placement),b.rects&&(l=b.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):b.rects),{x:u,y:d}=ir(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},cr=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=Rn(e,t)||{};if(l==null)return{};let d=nr(u),f={x:n,y:r},p=Wn(i),m=Hn(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,ee=a.reference[m]+a.reference[p]-f[p]-a.floating[m],b=f[p]-a.reference[p],x=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),S=x?x[y]:0;(!S||!await(o.isElement==null?void 0:o.isElement(x)))&&(S=s.floating[y]||a.floating[m]);let C=ee/2-b/2,w=S/2-h[m]/2-1,te=jn(d[_],w),ne=jn(d[v],w),re=te,ie=S-h[m]-ne,T=S/2-h[m]/2+C,ae=Ln(re,T,ie),oe=!c.arrow&&Bn(i)!=null&&T!==ae&&a.reference[m]/2-(T<re?te:ne)-h[m]/2<0,se=oe?T<re?T-re:T-ie:0;return{[p]:f[p]+se,data:{[p]:ae,centerOffset:T-ae-se,...oe&&{alignmentOffset:se}},reset:oe}}}),lr=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=Rn(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=zn(r),_=Un(o),v=zn(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),ee=d||(v||!m?[er(o)]:Kn(o)),b=p!==`none`;!d&&b&&ee.push(...$n(o,m,p,y));let x=[o,...ee],S=await s.detectOverflow(t,h),C=[],w=i.flip?.overflows||[];if(l&&C.push(S[g]),u){let e=Gn(r,a,y);C.push(S[e[0]],S[e[1]])}if(w=[...w,{placement:r,overflows:C}],!C.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=x[e];if(t&&(!(u===`alignment`&&_!==Un(t))||w.every(e=>Un(e.placement)===_?e.overflows[0]>0:!0)))return{data:{index:e,overflows:w},reset:{placement:t}};let n=w.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=w.filter(e=>{if(b){let t=Un(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o;break}if(r!==n)return{reset:{placement:n}}}return{}}}},ur=new Set([`left`,`top`]);async function dr(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=zn(n),s=Bn(n),c=Un(n)===`y`,l=ur.has(o)?-1:1,u=a&&c?-1:1,d=Rn(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var fr=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await dr(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},pr=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Rn(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=Un(zn(i)),p=Vn(f),m=u[p],h=u[f];if(o){let e=p===`y`?`top`:`left`,t=p===`y`?`bottom`:`right`,n=m+d[e],r=m-d[t];m=Ln(n,m,r)}if(s){let e=f===`y`?`top`:`left`,t=f===`y`?`bottom`:`right`,n=h+d[e],r=h-d[t];h=Ln(n,h,r)}let g=c.fn({...t,[p]:m,[f]:h});return{...g,data:{x:g.x-n,y:g.y-r,enabled:{[p]:o,[f]:s}}}}}},mr=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){var n,r;let{placement:i,rects:a,platform:o,elements:s}=t,{apply:c=()=>{},...l}=Rn(e,t),u=await o.detectOverflow(t,l),d=zn(i),f=Bn(i),p=Un(i)===`y`,{width:m,height:h}=a.floating,g,_;d===`top`||d===`bottom`?(g=d,_=f===(await(o.isRTL==null?void 0:o.isRTL(s.floating))?`start`:`end`)?`left`:`right`):(_=d,g=f===`end`?`top`:`bottom`);let v=h-u.top-u.bottom,y=m-u.left-u.right,ee=jn(h-u[g],v),b=jn(m-u[_],y),x=!t.middlewareData.shift,S=ee,C=b;if((n=t.middlewareData.shift)!=null&&n.enabled.x&&(C=y),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(S=v),x&&!f){let e=Mn(u.left,0),t=Mn(u.right,0),n=Mn(u.top,0),r=Mn(u.bottom,0);p?C=m-2*(e!==0||t!==0?e+t:Mn(u.left,u.right)):S=h-2*(n!==0||r!==0?n+r:Mn(u.top,u.bottom))}await c({...t,availableWidth:C,availableHeight:S});let w=await o.getDimensions(s.floating);return m!==w.width||h!==w.height?{reset:{rects:!0}}:{}}}};function hr(){return typeof window<`u`}function gr(e){return yr(e)?(e.nodeName||``).toLowerCase():`#document`}function _r(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function vr(e){return((yr(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function yr(e){return hr()?e instanceof Node||e instanceof _r(e).Node:!1}function br(e){return hr()?e instanceof Element||e instanceof _r(e).Element:!1}function xr(e){return hr()?e instanceof HTMLElement||e instanceof _r(e).HTMLElement:!1}function Sr(e){return!hr()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof _r(e).ShadowRoot}function Cr(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Pr(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function wr(e){return/^(table|td|th)$/.test(gr(e))}function Tr(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var Er=/transform|translate|scale|rotate|perspective|filter/,Dr=/paint|layout|strict|content/,Or=e=>!!e&&e!==`none`,kr;function Ar(e){let t=br(e)?Pr(e):e;return Or(t.transform)||Or(t.translate)||Or(t.scale)||Or(t.rotate)||Or(t.perspective)||!Mr()&&(Or(t.backdropFilter)||Or(t.filter))||Er.test(t.willChange||``)||Dr.test(t.contain||``)}function jr(e){let t=Ir(e);for(;xr(t)&&!Nr(t);){if(Ar(t))return t;if(Tr(t))return null;t=Ir(t)}return null}function Mr(){return kr??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),kr}function Nr(e){return/^(html|body|#document)$/.test(gr(e))}function Pr(e){return _r(e).getComputedStyle(e)}function Fr(e){return br(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Ir(e){if(gr(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||Sr(e)&&e.host||vr(e);return Sr(t)?t.host:t}function Lr(e){let t=Ir(e);return Nr(t)?e.ownerDocument?e.ownerDocument.body:e.body:xr(t)&&Cr(t)?t:Lr(t)}function Rr(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Lr(e),i=r===e.ownerDocument?.body,a=_r(r);if(i){let e=zr(a);return t.concat(a,a.visualViewport||[],Cr(r)?r:[],e&&n?Rr(e):[])}else return t.concat(r,Rr(r,[],n))}function zr(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Br(e){let t=Pr(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=xr(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=Nn(n)!==a||Nn(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function Vr(e){return br(e)?e:e.contextElement}function Hr(e){let t=Vr(e);if(!xr(t))return Fn(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=Br(t),o=(a?Nn(n.width):n.width)/r,s=(a?Nn(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}var Ur=Fn(0);function Wr(e){let t=_r(e);return!Mr()||!t.visualViewport?Ur:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Gr(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==_r(e)?!1:t}function Kr(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=Vr(e),o=Fn(1);t&&(r?br(r)&&(o=Hr(r)):o=Hr(e));let s=Gr(a,n,r)?Wr(a):Fn(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a){let e=_r(a),t=r&&br(r)?_r(r):r,n=e,i=zr(n);for(;i&&r&&t!==n;){let e=Hr(i),t=i.getBoundingClientRect(),r=Pr(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=_r(i),i=zr(n)}}return rr({width:u,height:d,x:c,y:l})}function qr(e,t){let n=Fr(e).scrollLeft;return t?t.left+n:Kr(vr(e)).left+n}function Jr(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-qr(e,n),y:n.top+t.scrollTop}}function Yr(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=vr(r),s=t?Tr(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=Fn(1),u=Fn(0),d=xr(r);if((d||!d&&!a)&&((gr(r)!==`body`||Cr(o))&&(c=Fr(r)),d)){let e=Kr(r);l=Hr(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?Jr(o,c):Fn(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function Xr(e){return Array.from(e.getClientRects())}function Zr(e){let t=vr(e),n=Fr(e),r=e.ownerDocument.body,i=Mn(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=Mn(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),o=-n.scrollLeft+qr(e),s=-n.scrollTop;return Pr(r).direction===`rtl`&&(o+=Mn(t.clientWidth,r.clientWidth)-i),{width:i,height:a,x:o,y:s}}var Qr=25;function $r(e,t){let n=_r(e),r=vr(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;let e=Mr();(!e||e&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}let l=qr(r);if(l<=0){let e=r.ownerDocument,t=e.body,n=getComputedStyle(t),i=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,o=Math.abs(r.clientWidth-t.clientWidth-i);o<=Qr&&(a-=o)}else l<=Qr&&(a+=l);return{width:a,height:o,x:s,y:c}}function ei(e,t){let n=Kr(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=xr(e)?Hr(e):Fn(1);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function ti(e,t,n){let r;if(t===`viewport`)r=$r(e,n);else if(t===`document`)r=Zr(vr(e));else if(br(t))r=ei(t,n);else{let n=Wr(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return rr(r)}function ni(e,t){let n=Ir(e);return n===t||!br(n)||Nr(n)?!1:Pr(n).position===`fixed`||ni(n,t)}function ri(e,t){let n=t.get(e);if(n)return n;let r=Rr(e,[],!1).filter(e=>br(e)&&gr(e)!==`body`),i=null,a=Pr(e).position===`fixed`,o=a?Ir(e):e;for(;br(o)&&!Nr(o);){let t=Pr(o),n=Ar(o);!n&&t.position===`fixed`&&(i=null),(a?!n&&!i:!n&&t.position===`static`&&i&&(i.position===`absolute`||i.position===`fixed`)||Cr(o)&&!n&&ni(e,o))?r=r.filter(e=>e!==o):i=t,o=Ir(o)}return t.set(e,r),r}function ii(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?Tr(t)?[]:ri(t,this._c):[].concat(n),r],o=ti(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=ti(t,a[e],i);s=Mn(n.top,s),c=jn(n.right,c),l=jn(n.bottom,l),u=Mn(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function ai(e){let{width:t,height:n}=Br(e);return{width:t,height:n}}function oi(e,t,n){let r=xr(t),i=vr(t),a=n===`fixed`,o=Kr(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=Fn(0);function l(){c.x=qr(i)}if(r||!r&&!a)if((gr(t)!==`body`||Cr(i))&&(s=Fr(t)),r){let e=Kr(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else i&&l();a&&!r&&i&&l();let u=i&&!r&&!a?Jr(i,s):Fn(0);return{x:o.left+s.scrollLeft-c.x-u.x,y:o.top+s.scrollTop-c.y-u.y,width:o.width,height:o.height}}function si(e){return Pr(e).position===`static`}function ci(e,t){if(!xr(e)||Pr(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return vr(e)===n&&(n=n.ownerDocument.body),n}function li(e,t){let n=_r(e);if(Tr(e))return n;if(!xr(e)){let t=Ir(e);for(;t&&!Nr(t);){if(br(t)&&!si(t))return t;t=Ir(t)}return n}let r=ci(e,t);for(;r&&wr(r)&&si(r);)r=ci(r,t);return r&&Nr(r)&&si(r)&&!Ar(r)?n:r||jr(e)||n}var ui=async function(e){let t=this.getOffsetParent||li,n=this.getDimensions,r=await n(e.floating);return{reference:oi(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function di(e){return Pr(e).direction===`rtl`}var fi={convertOffsetParentRelativeRectToViewportRelativeRect:Yr,getDocumentElement:vr,getClippingRect:ii,getOffsetParent:li,getElementRects:ui,getClientRects:Xr,getDimensions:ai,getScale:Hr,isElement:br,isRTL:di};function pi(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function mi(e,t){let n=null,r,i=vr(e);function a(){var e;clearTimeout(r),(e=n)==null||e.disconnect(),n=null}function o(s,c){s===void 0&&(s=!1),c===void 0&&(c=1),a();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(s||t(),!f||!p)return;let m=Pn(d),h=Pn(i.clientWidth-(u+f)),g=Pn(i.clientHeight-(d+p)),_=Pn(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:Mn(0,jn(1,c))||1},y=!0;function ee(t){let n=t[0].intersectionRatio;if(n!==c){if(!y)return o();n?o(!1,n):r=setTimeout(()=>{o(!1,1e-7)},1e3)}n===1&&!pi(l,e.getBoundingClientRect())&&o(),y=!1}try{n=new IntersectionObserver(ee,{...v,root:i.ownerDocument})}catch{n=new IntersectionObserver(ee,v)}n.observe(e)}return o(!0),a}function hi(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=Vr(e),u=i||a?[...l?Rr(l):[],...t?Rr(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n,{passive:!0}),a&&e.addEventListener(`resize`,n)});let d=l&&s?mi(l,n):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Kr(e):null;c&&g();function g(){let t=Kr(e);h&&!pi(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var gi=fr,_i=pr,vi=lr,yi=mr,bi=cr,xi=(e,t,n)=>{let r=new Map,i={platform:fi,...n},a={...i.platform,_c:r};return sr(e,t,{...i,platform:a})};function Si(e){return wi(e)}function Ci(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function wi(e){for(let t=e;t;t=Ci(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=Ci(e);t;t=Ci(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||Ar(e)||t.tagName===`BODY`))return t}return null}function Ti(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e&&(`contextElement`in e?e.contextElement instanceof Element:!0)}var V=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.active=!1,this.placement=`top`,this.strategy=`absolute`,this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),n=this.placement.includes(`top`)||this.placement.includes(`bottom`),r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0;n?e.top<t.top?(r=e.left,i=e.bottom,a=e.right,o=e.bottom,s=t.left,c=t.top,l=t.right,u=t.top):(r=t.left,i=t.bottom,a=t.right,o=t.bottom,s=e.left,c=e.top,l=e.right,u=e.top):e.left<t.left?(r=e.right,i=e.top,a=t.left,o=t.top,s=e.right,c=e.bottom,l=t.left,u=t.bottom):(r=t.right,i=t.top,a=e.left,o=e.top,s=t.right,c=t.bottom,l=e.left,u=e.bottom),this.style.setProperty(`--hover-bridge-top-left-x`,`${r}px`),this.style.setProperty(`--hover-bridge-top-left-y`,`${i}px`),this.style.setProperty(`--hover-bridge-top-right-x`,`${a}px`),this.style.setProperty(`--hover-bridge-top-right-y`,`${o}px`),this.style.setProperty(`--hover-bridge-bottom-left-x`,`${s}px`),this.style.setProperty(`--hover-bridge-bottom-left-y`,`${c}px`),this.style.setProperty(`--hover-bridge-bottom-right-x`,`${l}px`),this.style.setProperty(`--hover-bridge-bottom-right-y`,`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has(`active`)&&(this.active?this.start():this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){await this.stop(),this.anchor&&typeof this.anchor==`string`?this.anchorEl=this.getRootNode().getElementById(this.anchor):this.anchor instanceof Element||Ti(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector(`[slot="anchor"]`),this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=hi(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute(`data-current-placement`),this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;let e=[gi({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(yi({apply:({rects:e})=>{let t=this.sync===`width`||this.sync===`both`,n=this.sync===`height`||this.sync===`both`;this.popup.style.width=t?`${e.reference.width}px`:``,this.popup.style.height=n?`${e.reference.height}px`:``}})):(this.popup.style.width=``,this.popup.style.height=``),this.flip&&e.push(vi({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&e.push(_i({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(yi({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{this.autoSize===`vertical`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-height`,`${t}px`):this.style.removeProperty(`--auto-size-available-height`),this.autoSize===`horizontal`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-width`,`${e}px`):this.style.removeProperty(`--auto-size-available-width`)}})):(this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`)),this.arrow&&e.push(bi({element:this.arrowEl,padding:this.arrowPadding}));let t=this.strategy===`absolute`?e=>fi.getOffsetParent(e,Si):fi.getOffsetParent;xi(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:Rt(Lt({},fi),{getOffsetParent:t})}).then(({x:e,y:t,middlewareData:n,placement:r})=>{let i=this.localize.dir()===`rtl`,a={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[r.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,r),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){let e=n.arrow.x,t=n.arrow.y,r=``,o=``,s=``,c=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;r=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``,o=i?n:``,c=i?``:n}else if(this.arrowPlacement===`end`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;o=i?``:n,c=i?n:``,s=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``}else this.arrowPlacement===`center`?(c=typeof e==`number`?`calc(50% - var(--arrow-size-diagonal))`:``,r=typeof t==`number`?`calc(50% - var(--arrow-size-diagonal))`:``):(c=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(this.arrowEl.style,{top:r,right:o,bottom:s,left:c,[a]:`calc(var(--arrow-size-diagonal) * -1)`})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit(`sl-reposition`)}render(){return D`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${R({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${R({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy===`fixed`,"popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?D`<div part="arrow" class="popup__arrow" role="presentation"></div>`:``}
      </div>
    `}};V.styles=[M,An],A([I(`.popup`)],V.prototype,`popup`,2),A([I(`.popup__arrow`)],V.prototype,`arrowEl`,2),A([P()],V.prototype,`anchor`,2),A([P({type:Boolean,reflect:!0})],V.prototype,`active`,2),A([P({reflect:!0})],V.prototype,`placement`,2),A([P({reflect:!0})],V.prototype,`strategy`,2),A([P({type:Number})],V.prototype,`distance`,2),A([P({type:Number})],V.prototype,`skidding`,2),A([P({type:Boolean})],V.prototype,`arrow`,2),A([P({attribute:`arrow-placement`})],V.prototype,`arrowPlacement`,2),A([P({attribute:`arrow-padding`,type:Number})],V.prototype,`arrowPadding`,2),A([P({type:Boolean})],V.prototype,`flip`,2),A([P({attribute:`flip-fallback-placements`,converter:{fromAttribute:e=>e.split(` `).map(e=>e.trim()).filter(e=>e!==``),toAttribute:e=>e.join(` `)}})],V.prototype,`flipFallbackPlacements`,2),A([P({attribute:`flip-fallback-strategy`})],V.prototype,`flipFallbackStrategy`,2),A([P({type:Object})],V.prototype,`flipBoundary`,2),A([P({attribute:`flip-padding`,type:Number})],V.prototype,`flipPadding`,2),A([P({type:Boolean})],V.prototype,`shift`,2),A([P({type:Object})],V.prototype,`shiftBoundary`,2),A([P({attribute:`shift-padding`,type:Number})],V.prototype,`shiftPadding`,2),A([P({attribute:`auto-size`})],V.prototype,`autoSize`,2),A([P()],V.prototype,`sync`,2),A([P({type:Object})],V.prototype,`autoSizeBoundary`,2),A([P({attribute:`auto-size-padding`,type:Number})],V.prototype,`autoSizePadding`,2),A([P({attribute:`hover-bridge`,type:Boolean})],V.prototype,`hoverBridge`,2);var Ei=new Map,Di=new WeakMap;function Oi(e){return e??{keyframes:[],options:{duration:0}}}function ki(e,t){return t.toLowerCase()===`rtl`?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function H(e,t){Ei.set(e,Oi(t))}function Ai(e,t,n){let r=Di.get(e);if(r?.[t])return ki(r[t],n.dir);let i=Ei.get(t);return i?ki(i,n.dir):{keyframes:[],options:{duration:0}}}function ji(e,t){return new Promise(n=>{function r(i){i.target===e&&(e.removeEventListener(t,r),n())}e.addEventListener(t,r)})}function Mi(e,t,n){return new Promise(r=>{if(n?.duration===1/0)throw Error(`Promise-based animations must be finite.`);let i=e.animate(t,Rt(Lt({},n),{duration:Pi()?0:n.duration}));i.addEventListener(`cancel`,r,{once:!0}),i.addEventListener(`finish`,r,{once:!0})})}function Ni(e){return e=e.toString().toLowerCase(),e.indexOf(`ms`)>-1?parseFloat(e):e.indexOf(`s`)>-1?parseFloat(e)*1e3:parseFloat(e)}function Pi(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function Fi(e){return Promise.all(e.getAnimations().map(e=>new Promise(t=>{e.cancel(),requestAnimationFrame(t)})))}function Ii(e,t){return e.map(e=>Rt(Lt({},e),{height:e.height===`auto`?`${t}px`:e.height}))}var Li=class extends L{constructor(){super(),this.localize=new Dn(this),this.content=``,this.placement=`top`,this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger=`hover focus`,this.hoist=!1,this.handleBlur=()=>{this.hasTrigger(`focus`)&&this.hide()},this.handleClick=()=>{this.hasTrigger(`click`)&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger(`focus`)&&this.show()},this.handleDocumentKeyDown=e=>{e.key===`Escape`&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger(`hover`)){let e=Ni(getComputedStyle(this).getPropertyValue(`--show-delay`));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger(`hover`)){let e=Ni(getComputedStyle(this).getPropertyValue(`--hide-delay`));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener(`blur`,this.handleBlur,!0),this.addEventListener(`focus`,this.handleFocus,!0),this.addEventListener(`click`,this.handleClick),this.addEventListener(`mouseover`,this.handleMouseOver),this.addEventListener(`mouseout`,this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(` `).includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit(`sl-show`),`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener(`keydown`,this.handleDocumentKeyDown),await Fi(this.body),this.body.hidden=!1,this.popup.active=!0;let{keyframes:t,options:n}=Ai(this,`tooltip.show`,{dir:this.localize.dir()});await Mi(this.popup.popup,t,n),this.popup.reposition(),this.emit(`sl-after-show`)}else{this.emit(`sl-hide`),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),await Fi(this.body);let{keyframes:e,options:n}=Ai(this,`tooltip.hide`,{dir:this.localize.dir()});await Mi(this.popup.popup,e,n),this.popup.active=!1,this.body.hidden=!0,this.emit(`sl-after-hide`)}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,ji(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ji(this,`sl-after-hide`)}render(){return D`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${R({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?`fixed`:`absolute`}
        flip
        shift
        arrow
        hover-bridge
      >
        ${``}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${``}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?`polite`:`off`}>
          <slot name="content">${this.content}</slot>
        </div>
      </sl-popup>
    `}};Li.styles=[M,kn],Li.dependencies={"sl-popup":V},A([I(`slot:not([name])`)],Li.prototype,`defaultSlot`,2),A([I(`.tooltip__body`)],Li.prototype,`body`,2),A([I(`sl-popup`)],Li.prototype,`popup`,2),A([P()],Li.prototype,`content`,2),A([P()],Li.prototype,`placement`,2),A([P({type:Boolean,reflect:!0})],Li.prototype,`disabled`,2),A([P({type:Number})],Li.prototype,`distance`,2),A([P({type:Boolean,reflect:!0})],Li.prototype,`open`,2),A([P({type:Number})],Li.prototype,`skidding`,2),A([P()],Li.prototype,`trigger`,2),A([P({type:Boolean})],Li.prototype,`hoist`,2),A([j(`open`,{waitUntilFirstUpdate:!0})],Li.prototype,`handleOpenChange`,1),A([j([`content`,`distance`,`hoist`,`placement`,`skidding`])],Li.prototype,`handleOptionsChange`,1),A([j(`disabled`)],Li.prototype,`handleDisabledChange`,1),H(`tooltip.show`,{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:`ease`}}),H(`tooltip.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:`ease`}}),Li.define(`sl-tooltip`),on.define(`sl-icon`);var Ri=E`
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
`;function zi(e,t){function n(n){let r=e.getBoundingClientRect(),i=e.ownerDocument.defaultView,a=r.left+i.scrollX,o=r.top+i.scrollY,s=n.pageX-a,c=n.pageY-o;t?.onMove&&t.onMove(s,c)}function r(){document.removeEventListener(`pointermove`,n),document.removeEventListener(`pointerup`,r),t?.onStop&&t.onStop()}document.addEventListener(`pointermove`,n,{passive:!0}),document.addEventListener(`pointerup`,r),t?.initialEvent instanceof PointerEvent&&n(t.initialEvent)}function Bi(e,t,n){return(e=>Object.is(e,-0)?0:e)(e<t?t:e>n?n:e)}var Vi=()=>null,Hi=class extends L{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new Dn(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue=``,this.snapFunction=Vi,this.snapThreshold=12}toSnapFunction(e){let t=e.split(` `);return({pos:n,size:r,snapThreshold:i,isRtl:a,vertical:o})=>{let s=n,c=1/0;return t.forEach(t=>{let l;if(t.startsWith(`repeat(`)){let t=e.substring(7,e.length-1),i=t.endsWith(`%`),s=Number.parseFloat(t),c=i?s/100*r:s;l=Math.round((a&&!o?r-n:n)/c)*c}else l=t.endsWith(`%`)?Number.parseFloat(t)/100*r:Number.parseFloat(t);a&&!o&&(l=r-l);let u=Math.abs(n-l);u<=i&&u<c&&(s=l,c=u)}),s}}set snap(e){this.snapValue=e??``,e?this.snapFunction=typeof e==`string`?this.toSnapFunction(e):e:this.snapFunction=Vi}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){let{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){let t=this.localize.dir()===`rtl`;this.disabled||(e.cancelable&&e.preventDefault(),zi(this,{onMove:(e,n)=>{let r=this.vertical?n:e;this.primary===`end`&&(r=this.size-r),r=this.snapFunction({pos:r,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical})??r,this.position=Bi(this.pixelsToPercentage(r),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`Enter`].includes(e.key)){let t=this.position,n=(e.shiftKey?10:1)*(this.primary===`end`?-1:1);if(e.preventDefault(),(e.key===`ArrowLeft`&&!this.vertical||e.key===`ArrowUp`&&this.vertical)&&(t-=n),(e.key===`ArrowRight`&&!this.vertical||e.key===`ArrowDown`&&this.vertical)&&(t+=n),e.key===`Home`&&(t=this.primary===`end`?100:0),e.key===`End`&&(t=this.primary===`end`?0:100),e.key===`Enter`)if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{let e=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=e})}this.position=Bi(t,0,100)}}handleResize(e){let{width:t,height:n}=e[0].contentRect;this.size=this.vertical?n:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute(`position-in-pixels`)),this.positionInPixels=Number(this.getAttribute(`position-in-pixels`)),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit(`sl-reposition`)}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){let e=this.vertical?`gridTemplateRows`:`gridTemplateColumns`,t=this.vertical?`gridTemplateColumns`:`gridTemplateRows`,n=this.localize.dir()===`rtl`,r=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,i=`auto`;return this.primary===`end`?n&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${i}`:this.style[e]=`${i} var(--divider-width) ${r}`:n&&!this.vertical?this.style[e]=`${i} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${i}`,this.style[t]=``,D`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${z(this.disabled?void 0:`0`)}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term(`resize`)}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `}};Hi.styles=[M,Ri],A([I(`.divider`)],Hi.prototype,`divider`,2),A([P({type:Number,reflect:!0})],Hi.prototype,`position`,2),A([P({attribute:`position-in-pixels`,type:Number})],Hi.prototype,`positionInPixels`,2),A([P({type:Boolean,reflect:!0})],Hi.prototype,`vertical`,2),A([P({type:Boolean,reflect:!0})],Hi.prototype,`disabled`,2),A([P()],Hi.prototype,`primary`,2),A([P({reflect:!0})],Hi.prototype,`snap`,1),A([P({type:Number,attribute:`snap-threshold`})],Hi.prototype,`snapThreshold`,2),A([j(`position`)],Hi.prototype,`handlePositionChange`,1),A([j(`positionInPixels`)],Hi.prototype,`handlePositionInPixelsChange`,1),A([j(`vertical`)],Hi.prototype,`handleVerticalChange`,1),Hi.define(`sl-split-panel`);var Ui=E`
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
`;function*Wi(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*Wt(Wi(e.shadowRoot.activeElement))))}function Gi(){return[...Wi()].pop()}var Ki=new WeakMap;function qi(e){let t=Ki.get(e);return t||(t=window.getComputedStyle(e,null),Ki.set(e,t)),t}function Ji(e){if(typeof e.checkVisibility==`function`)return e.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let t=qi(e);return t.visibility!==`hidden`&&t.display!==`none`}function Yi(e){let{overflowY:t,overflowX:n}=qi(e);return t===`scroll`||n===`scroll`?!0:t!==`auto`||n!==`auto`?!1:e.scrollHeight>e.clientHeight&&t===`auto`||e.scrollWidth>e.clientWidth&&n===`auto`}function Xi(e){let t=e.tagName.toLowerCase(),n=Number(e.getAttribute(`tabindex`));if(e.hasAttribute(`tabindex`)&&(isNaN(n)||n<=-1)||e.hasAttribute(`disabled`)||e.closest(`[inert]`))return!1;if(t===`input`&&e.getAttribute(`type`)===`radio`){let t=e.getRootNode(),n=`input[type='radio'][name="${e.getAttribute(`name`)}"]`,r=t.querySelector(`${n}:checked`);return r?r===e:t.querySelector(n)===e}return Ji(e)?(t===`audio`||t===`video`)&&e.hasAttribute(`controls`)||e.hasAttribute(`tabindex`)||e.hasAttribute(`contenteditable`)&&e.getAttribute(`contenteditable`)!==`false`||[`button`,`input`,`select`,`textarea`,`a`,`audio`,`video`,`summary`,`iframe`].includes(t)?!0:Yi(e):!1}function Zi(e){let t=$i(e);return{start:t[0]??null,end:t[t.length-1]??null}}function Qi(e,t){return e.getRootNode({composed:!0})?.host!==t}function $i(e){let t=new WeakMap,n=[];function r(i){if(i instanceof Element){if(i.hasAttribute(`inert`)||i.closest(`[inert]`)||t.has(i))return;t.set(i,!0),!n.includes(i)&&Xi(i)&&n.push(i),i instanceof HTMLSlotElement&&Qi(i,e)&&i.assignedElements({flatten:!0}).forEach(e=>{r(e)}),i.shadowRoot!==null&&i.shadowRoot.mode===`open`&&r(i.shadowRoot)}for(let e of i.children)r(e)}return r(e),n.sort((e,t)=>{let n=Number(e.getAttribute(`tabindex`))||0;return(Number(t.getAttribute(`tabindex`))||0)-n})}var ea=[],ta=class{constructor(e){this.tabDirection=`forward`,this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var t;if(e.key!==`Tab`||this.isExternalActivated||!this.isActive())return;let n=Gi();if(this.previousFocus=n,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection=`backward`:this.tabDirection=`forward`;let r=$i(this.element),i=r.findIndex(e=>e===n);this.previousFocus=this.currentFocus;let a=this.tabDirection===`forward`?1:-1;for(;;){i+a>=r.length?i=0:i+a<0?i=r.length-1:i+=a,this.previousFocus=this.currentFocus;let n=r[i];if(this.tabDirection===`backward`&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||n&&this.possiblyHasTabbableChildren(n))return;e.preventDefault(),this.currentFocus=n,(t=this.currentFocus)==null||t.focus({preventScroll:!1});let o=[...Wi()];if(o.includes(this.currentFocus)||!o.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection=`forward`},this.element=e,this.elementsWithTabbableControls=[`iframe`]}activate(){ea.push(this.element),document.addEventListener(`focusin`,this.handleFocusIn),document.addEventListener(`keydown`,this.handleKeyDown),document.addEventListener(`keyup`,this.handleKeyUp)}deactivate(){ea=ea.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener(`focusin`,this.handleFocusIn),document.removeEventListener(`keydown`,this.handleKeyDown),document.removeEventListener(`keyup`,this.handleKeyUp)}isActive(){return ea[ea.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){let e=$i(this.element);if(!this.element.matches(`:focus-within`)){let t=e[0],n=e[e.length-1],r=this.tabDirection===`forward`?t:n;typeof r?.focus==`function`&&(this.currentFocus=r,r.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute(`controls`)}};function na(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}var ra=new Set;function ia(){let e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function aa(){let e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,``));return isNaN(e)||!e?0:e}function oa(e){if(ra.add(e),!document.documentElement.classList.contains(`sl-scroll-lock`)){let e=ia()+aa(),t=getComputedStyle(document.documentElement).scrollbarGutter;(!t||t===`auto`)&&(t=`stable`),e<2&&(t=``),document.documentElement.style.setProperty(`--sl-scroll-lock-gutter`,t),document.documentElement.classList.add(`sl-scroll-lock`),document.documentElement.style.setProperty(`--sl-scroll-lock-size`,`${e}px`)}}function sa(e){ra.delete(e),ra.size===0&&(document.documentElement.classList.remove(`sl-scroll-lock`),document.documentElement.style.removeProperty(`--sl-scroll-lock-size`))}function ca(e,t,n=`vertical`,r=`smooth`){let i=na(e,t),a=i.top+t.scrollTop,o=i.left+t.scrollLeft,s=t.scrollLeft,c=t.scrollLeft+t.offsetWidth,l=t.scrollTop,u=t.scrollTop+t.offsetHeight;(n===`horizontal`||n===`both`)&&(o<s?t.scrollTo({left:o,behavior:r}):o+e.clientWidth>c&&t.scrollTo({left:o-t.offsetWidth+e.clientWidth,behavior:r})),(n===`vertical`||n===`both`)&&(a<l?t.scrollTo({top:a,behavior:r}):a+e.clientHeight>u&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:r}))}var la=e=>{var t;let{activeElement:n}=document;n&&e.contains(n)&&((t=document.activeElement)==null||t.blur())},ua=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{let t=e.target;(this.slotNames.includes(`[default]`)&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!==``)return!0;if(e.nodeType===e.ELEMENT_NODE){let t=e;if(t.tagName.toLowerCase()===`sl-visually-hidden`)return!1;if(!t.hasAttribute(`slot`))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e===`[default]`?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener(`slotchange`,this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener(`slotchange`,this.handleSlotChange)}};function da(e){if(!e)return``;let t=e.assignedNodes({flatten:!0}),n=``;return[...t].forEach(e=>{e.nodeType===Node.TEXT_NODE&&(n+=e.textContent)}),n}function fa(e){return e.charAt(0).toUpperCase()+e.slice(1)}var pa=class extends L{constructor(){super(...arguments),this.hasSlotController=new ua(this,`footer`),this.localize=new Dn(this),this.modal=new ta(this),this.open=!1,this.label=``,this.placement=`end`,this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=e=>{this.contained||e.key===`Escape`&&this.modal.isActive()&&this.open&&(e.stopImmediatePropagation(),this.requestClose(`keyboard`))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),oa(this)))}disconnectedCallback(){super.disconnectedCallback(),sa(this),this.removeOpenListeners()}requestClose(e){if(this.emit(`sl-request-close`,{cancelable:!0,detail:{source:e}}).defaultPrevented){let e=Ai(this,`drawer.denyClose`,{dir:this.localize.dir()});Mi(this.panel,e.keyframes,e.options);return}this.hide()}addOpenListeners(){var e;`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose(`keyboard`))):document.addEventListener(`keydown`,this.handleDocumentKeyDown)}removeOpenListeners(){var e;document.removeEventListener(`keydown`,this.handleDocumentKeyDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.open){this.emit(`sl-show`),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),oa(this));let e=this.querySelector(`[autofocus]`);e&&e.removeAttribute(`autofocus`),await Promise.all([Fi(this.drawer),Fi(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit(`sl-initial-focus`,{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute(`autofocus`,``)});let t=Ai(this,`drawer.show${fa(this.placement)}`,{dir:this.localize.dir()}),n=Ai(this,`drawer.overlay.show`,{dir:this.localize.dir()});await Promise.all([Mi(this.panel,t.keyframes,t.options),Mi(this.overlay,n.keyframes,n.options)]),this.emit(`sl-after-show`)}else{la(this),this.emit(`sl-hide`),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),sa(this)),await Promise.all([Fi(this.drawer),Fi(this.overlay)]);let e=Ai(this,`drawer.hide${fa(this.placement)}`,{dir:this.localize.dir()}),t=Ai(this,`drawer.overlay.hide`,{dir:this.localize.dir()});await Promise.all([Mi(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),Mi(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;let n=this.originalTrigger;typeof n?.focus==`function`&&setTimeout(()=>n.focus()),this.emit(`sl-after-hide`)}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),oa(this)),this.open&&this.contained&&(this.modal.deactivate(),sa(this))}async show(){if(!this.open)return this.open=!0,ji(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ji(this,`sl-after-hide`)}render(){return D`
      <div
        part="base"
        class=${R({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement===`top`,"drawer--end":this.placement===`end`,"drawer--bottom":this.placement===`bottom`,"drawer--start":this.placement===`start`,"drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()===`rtl`,"drawer--has-footer":this.hasSlotController.test(`footer`)})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose(`overlay`)} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?`false`:`true`}
          aria-label=${z(this.noHeader?this.label:void 0)}
          aria-labelledby=${z(this.noHeader?void 0:`title`)}
          tabindex="0"
        >
          ${this.noHeader?``:D`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length>0?this.label:`﻿`} </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="x-lg"
                      label=${this.localize.term(`close`)}
                      library="system"
                      @click=${()=>this.requestClose(`close-button`)}
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
    `}};pa.styles=[M,Ui],pa.dependencies={"sl-icon-button":B},A([I(`.drawer`)],pa.prototype,`drawer`,2),A([I(`.drawer__panel`)],pa.prototype,`panel`,2),A([I(`.drawer__overlay`)],pa.prototype,`overlay`,2),A([P({type:Boolean,reflect:!0})],pa.prototype,`open`,2),A([P({reflect:!0})],pa.prototype,`label`,2),A([P({reflect:!0})],pa.prototype,`placement`,2),A([P({type:Boolean,reflect:!0})],pa.prototype,`contained`,2),A([P({attribute:`no-header`,type:Boolean,reflect:!0})],pa.prototype,`noHeader`,2),A([j(`open`,{waitUntilFirstUpdate:!0})],pa.prototype,`handleOpenChange`,1),A([j(`contained`,{waitUntilFirstUpdate:!0})],pa.prototype,`handleNoModalChange`,1),H(`drawer.showTop`,{keyframes:[{opacity:0,translate:`0 -100%`},{opacity:1,translate:`0 0`}],options:{duration:250,easing:`ease`}}),H(`drawer.hideTop`,{keyframes:[{opacity:1,translate:`0 0`},{opacity:0,translate:`0 -100%`}],options:{duration:250,easing:`ease`}}),H(`drawer.showEnd`,{keyframes:[{opacity:0,translate:`100%`},{opacity:1,translate:`0`}],rtlKeyframes:[{opacity:0,translate:`-100%`},{opacity:1,translate:`0`}],options:{duration:250,easing:`ease`}}),H(`drawer.hideEnd`,{keyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`100%`}],rtlKeyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`-100%`}],options:{duration:250,easing:`ease`}}),H(`drawer.showBottom`,{keyframes:[{opacity:0,translate:`0 100%`},{opacity:1,translate:`0 0`}],options:{duration:250,easing:`ease`}}),H(`drawer.hideBottom`,{keyframes:[{opacity:1,translate:`0 0`},{opacity:0,translate:`0 100%`}],options:{duration:250,easing:`ease`}}),H(`drawer.showStart`,{keyframes:[{opacity:0,translate:`-100%`},{opacity:1,translate:`0`}],rtlKeyframes:[{opacity:0,translate:`100%`},{opacity:1,translate:`0`}],options:{duration:250,easing:`ease`}}),H(`drawer.hideStart`,{keyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`-100%`}],rtlKeyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`100%`}],options:{duration:250,easing:`ease`}}),H(`drawer.denyClose`,{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),H(`drawer.overlay.show`,{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),H(`drawer.overlay.hide`,{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),pa.define(`sl-drawer`);var ma=E`
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
`,ha=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.style.height=this.open?`auto`:`0`,this.open&&(this.details.open=!0),this.detailsObserver=new MutationObserver(e=>{for(let t of e)t.type===`attributes`&&t.attributeName===`open`&&(this.details.open?this.show():this.hide())}),this.detailsObserver.observe(this.details,{attributes:!0})}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.detailsObserver)==null||e.disconnect()}handleSummaryClick(e){e.preventDefault(),this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key===`ArrowUp`||e.key===`ArrowLeft`)&&(e.preventDefault(),this.hide()),(e.key===`ArrowDown`||e.key===`ArrowRight`)&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.details.open=!0,this.emit(`sl-show`,{cancelable:!0}).defaultPrevented){this.open=!1,this.details.open=!1;return}await Fi(this.body);let{keyframes:e,options:t}=Ai(this,`details.show`,{dir:this.localize.dir()});await Mi(this.body,Ii(e,this.body.scrollHeight),t),this.body.style.height=`auto`,this.emit(`sl-after-show`)}else{if(this.emit(`sl-hide`,{cancelable:!0}).defaultPrevented){this.details.open=!0,this.open=!0;return}await Fi(this.body);let{keyframes:e,options:t}=Ai(this,`details.hide`,{dir:this.localize.dir()});await Mi(this.body,Ii(e,this.body.scrollHeight),t),this.body.style.height=`auto`,this.details.open=!1,this.emit(`sl-after-hide`)}}async show(){if(!(this.open||this.disabled))return this.open=!0,ji(this,`sl-after-show`)}async hide(){if(!(!this.open||this.disabled))return this.open=!1,ji(this,`sl-after-hide`)}render(){let e=this.localize.dir()===`rtl`;return D`
      <details
        part="base"
        class=${R({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
      >
        <summary
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open?`true`:`false`}
          aria-controls="content"
          aria-disabled=${this.disabled?`true`:`false`}
          tabindex=${this.disabled?`-1`:`0`}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${e?`chevron-left`:`chevron-right`}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${e?`chevron-left`:`chevron-right`}></sl-icon>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </details>
    `}};ha.styles=[M,ma],ha.dependencies={"sl-icon":on},A([I(`.details`)],ha.prototype,`details`,2),A([I(`.details__header`)],ha.prototype,`header`,2),A([I(`.details__body`)],ha.prototype,`body`,2),A([I(`.details__expand-icon-slot`)],ha.prototype,`expandIconSlot`,2),A([P({type:Boolean,reflect:!0})],ha.prototype,`open`,2),A([P()],ha.prototype,`summary`,2),A([P({type:Boolean,reflect:!0})],ha.prototype,`disabled`,2),A([j(`open`,{waitUntilFirstUpdate:!0})],ha.prototype,`handleOpenChange`,1),H(`details.show`,{keyframes:[{height:`0`,opacity:`0`},{height:`auto`,opacity:`1`}],options:{duration:250,easing:`linear`}}),H(`details.hide`,{keyframes:[{height:`auto`,opacity:`1`},{height:`0`,opacity:`0`}],options:{duration:250,easing:`linear`}}),ha.define(`sl-details`),V.define(`sl-popup`);var ga=E`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`,_a=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.separatorDir=this.localize.dir(),this.label=``}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll(`[id]`)].forEach(e=>e.removeAttribute(`id`)),e.setAttribute(`data-default`,``),e.slot=`separator`,e}handleSlotChange(){let e=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()===`sl-breadcrumb-item`);e.forEach((t,n)=>{let r=t.querySelector(`[slot="separator"]`);r===null?t.append(this.getSeparator()):r.hasAttribute(`data-default`)&&r.replaceWith(this.getSeparator()),n===e.length-1?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),D`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true">
        <slot name="separator">
          <sl-icon name=${this.localize.dir()===`rtl`?`chevron-left`:`chevron-right`} library="system"></sl-icon>
        </slot>
      </span>
    `}};_a.styles=[M,ga],_a.dependencies={"sl-icon":on},A([I(`slot`)],_a.prototype,`defaultSlot`,2),A([I(`slot[name="separator"]`)],_a.prototype,`separatorSlot`,2),A([P()],_a.prototype,`label`,2),_a.define(`sl-breadcrumb`);var va=E`
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
`,ya=class extends L{constructor(){super(...arguments),this.hasSlotController=new ua(this,`prefix`,`suffix`),this.renderType=`button`,this.rel=`noreferrer noopener`}setRenderType(){let e=this.defaultSlot.assignedElements({flatten:!0}).filter(e=>e.tagName.toLowerCase()===`sl-dropdown`).length>0;if(this.href){this.renderType=`link`;return}if(e){this.renderType=`dropdown`;return}this.renderType=`button`}hrefChanged(){this.setRenderType()}handleSlotChange(){this.setRenderType()}render(){return D`
      <div
        part="base"
        class=${R({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test(`prefix`),"breadcrumb-item--has-suffix":this.hasSlotController.test(`suffix`)})}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${this.renderType===`link`?D`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${z(this.target?this.target:void 0)}"
                rel=${z(this.target?this.rel:void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            `:``}
        ${this.renderType===`button`?D`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            `:``}
        ${this.renderType===`dropdown`?D`
              <div part="label" class="breadcrumb-item__label breadcrumb-item__label--drop-down">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            `:``}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `}};ya.styles=[M,va],A([I(`slot:not([name])`)],ya.prototype,`defaultSlot`,2),A([F()],ya.prototype,`renderType`,2),A([P()],ya.prototype,`href`,2),A([P()],ya.prototype,`target`,2),A([P()],ya.prototype,`rel`,2),A([j(`href`,{waitUntilFirstUpdate:!0})],ya.prototype,`hrefChanged`,1),ya.define(`sl-breadcrumb-item`);var ba=E`
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
`,xa=class extends L{constructor(){super(...arguments),this.localize=new Dn(this)}render(){return D`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term(`loading`)}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};xa.styles=[M,ba],xa.define(`sl-spinner`);var Sa=new WeakMap,Ca=new WeakMap,wa=new WeakMap,Ta=new WeakSet,Ea=new WeakMap,Da=class{constructor(e,t){this.handleFormData=e=>{let t=this.options.disabled(this.host),n=this.options.name(this.host),r=this.options.value(this.host),i=this.host.tagName.toLowerCase()===`sl-button`;this.host.isConnected&&!t&&!i&&typeof n==`string`&&n.length>0&&r!==void 0&&(Array.isArray(r)?r.forEach(t=>{e.formData.append(n,t.toString())}):e.formData.append(n,r.toString()))},this.handleFormSubmit=e=>{var t;let n=this.options.disabled(this.host),r=this.options.reportValidity;this.form&&!this.form.noValidate&&((t=Sa.get(this.form))==null||t.forEach(e=>{this.setUserInteracted(e,!0)})),this.form&&!this.form.noValidate&&!n&&!r(this.host)&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Ea.set(this.host,[])},this.handleInteraction=e=>{let t=Ea.get(this.host);t.includes(e.type)||t.push(e.type),t.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let e=this.form.querySelectorAll(`*`);for(let t of e)if(typeof t.checkValidity==`function`&&!t.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let e=this.form.querySelectorAll(`*`);for(let t of e)if(typeof t.reportValidity==`function`&&!t.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=Lt({form:e=>{let t=e.form;if(t){let n=e.getRootNode().querySelector(`#${t}`);if(n)return n}return e.closest(`form`)},name:e=>e.name,value:e=>e.value,defaultValue:e=>e.defaultValue,disabled:e=>e.disabled??!1,reportValidity:e=>typeof e.reportValidity==`function`?e.reportValidity():!0,checkValidity:e=>typeof e.checkValidity==`function`?e.checkValidity():!0,setValue:(e,t)=>e.value=t,assumeInteractionOn:[`sl-input`]},t)}hostConnected(){let e=this.options.form(this.host);e&&this.attachForm(e),Ea.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Ea.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){let e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,Sa.has(this.form)?Sa.get(this.form).add(this.host):Sa.set(this.form,new Set([this.host])),this.form.addEventListener(`formdata`,this.handleFormData),this.form.addEventListener(`submit`,this.handleFormSubmit),this.form.addEventListener(`reset`,this.handleFormReset),Ca.has(this.form)||(Ca.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),wa.has(this.form)||(wa.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let e=Sa.get(this.form);e&&(e.delete(this.host),e.size<=0&&(this.form.removeEventListener(`formdata`,this.handleFormData),this.form.removeEventListener(`submit`,this.handleFormSubmit),this.form.removeEventListener(`reset`,this.handleFormReset),Ca.has(this.form)&&(this.form.reportValidity=Ca.get(this.form),Ca.delete(this.form)),wa.has(this.form)&&(this.form.checkValidity=wa.get(this.form),wa.delete(this.form)),this.form=void 0))}setUserInteracted(e,t){t?Ta.add(e):Ta.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){let n=document.createElement(`button`);n.type=e,n.style.position=`absolute`,n.style.width=`0`,n.style.height=`0`,n.style.clipPath=`inset(50%)`,n.style.overflow=`hidden`,n.style.whiteSpace=`nowrap`,t&&(n.name=t.name,n.value=t.value,[`formaction`,`formenctype`,`formmethod`,`formnovalidate`,`formtarget`].forEach(e=>{t.hasAttribute(e)&&n.setAttribute(e,t.getAttribute(e))})),this.form.append(n),n.click(),n.remove()}}getForm(){return this.form??null}reset(e){this.doAction(`reset`,e)}submit(e){this.doAction(`submit`,e)}setValidity(e){let t=this.host,n=!!Ta.has(t),r=!!t.required;t.toggleAttribute(`data-required`,r),t.toggleAttribute(`data-optional`,!r),t.toggleAttribute(`data-invalid`,!e),t.toggleAttribute(`data-valid`,e),t.toggleAttribute(`data-user-invalid`,!e&&n),t.toggleAttribute(`data-user-valid`,e&&n)}updateValidity(){let e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){let t=new CustomEvent(`sl-invalid`,{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||e?.preventDefault()}},Oa=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(Rt(Lt({},Oa),{valid:!1,valueMissing:!0})),Object.freeze(Rt(Lt({},Oa),{valid:!1,customError:!0}));var ka=E`
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
`,U=class extends L{constructor(){super(...arguments),this.formControlController=new Da(this,{assumeInteractionOn:[`click`]}),this.hasSlotController=new ua(this,`[default]`,`prefix`,`suffix`),this.localize=new Dn(this),this.hasFocus=!1,this.invalid=!1,this.title=``,this.variant=`default`,this.size=`medium`,this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type=`button`,this.name=``,this.value=``,this.href=``,this.rel=`noreferrer noopener`}get validity(){return this.isButton()?this.button.validity:Oa}get validationMessage(){return this.isButton()?this.button.validationMessage:``}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleClick(){this.type===`submit`&&this.formControlController.submit(this),this.type===`reset`&&this.formControlController.reset(this)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){let e=this.isLink(),t=e?pn`a`:pn`button`;return hn`
      <${t}
        part="base"
        class=${R({button:!0,"button--default":this.variant===`default`,"button--primary":this.variant===`primary`,"button--success":this.variant===`success`,"button--neutral":this.variant===`neutral`,"button--warning":this.variant===`warning`,"button--danger":this.variant===`danger`,"button--text":this.variant===`text`,"button--small":this.size===`small`,"button--medium":this.size===`medium`,"button--large":this.size===`large`,"button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()===`rtl`,"button--has-label":this.hasSlotController.test(`[default]`),"button--has-prefix":this.hasSlotController.test(`prefix`),"button--has-suffix":this.hasSlotController.test(`suffix`)})}
        ?disabled=${z(e?void 0:this.disabled)}
        type=${z(e?void 0:this.type)}
        title=${this.title}
        name=${z(e?void 0:this.name)}
        value=${z(e?void 0:this.value)}
        href=${z(e&&!this.disabled?this.href:void 0)}
        target=${z(e?this.target:void 0)}
        download=${z(e?this.download:void 0)}
        rel=${z(e?this.rel:void 0)}
        role=${z(e?void 0:`button`)}
        aria-disabled=${this.disabled?`true`:`false`}
        tabindex=${this.disabled?`-1`:`0`}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret?hn` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:``}
        ${this.loading?hn`<sl-spinner part="spinner"></sl-spinner>`:``}
      </${t}>
    `}};U.styles=[M,ka],U.dependencies={"sl-icon":on,"sl-spinner":xa},A([I(`.button`)],U.prototype,`button`,2),A([F()],U.prototype,`hasFocus`,2),A([F()],U.prototype,`invalid`,2),A([P()],U.prototype,`title`,2),A([P({reflect:!0})],U.prototype,`variant`,2),A([P({reflect:!0})],U.prototype,`size`,2),A([P({type:Boolean,reflect:!0})],U.prototype,`caret`,2),A([P({type:Boolean,reflect:!0})],U.prototype,`disabled`,2),A([P({type:Boolean,reflect:!0})],U.prototype,`loading`,2),A([P({type:Boolean,reflect:!0})],U.prototype,`outline`,2),A([P({type:Boolean,reflect:!0})],U.prototype,`pill`,2),A([P({type:Boolean,reflect:!0})],U.prototype,`circle`,2),A([P()],U.prototype,`type`,2),A([P()],U.prototype,`name`,2),A([P()],U.prototype,`value`,2),A([P()],U.prototype,`href`,2),A([P()],U.prototype,`target`,2),A([P()],U.prototype,`rel`,2),A([P()],U.prototype,`download`,2),A([P()],U.prototype,`form`,2),A([P({attribute:`formaction`})],U.prototype,`formAction`,2),A([P({attribute:`formenctype`})],U.prototype,`formEnctype`,2),A([P({attribute:`formmethod`})],U.prototype,`formMethod`,2),A([P({attribute:`formnovalidate`,type:Boolean})],U.prototype,`formNoValidate`,2),A([P({attribute:`formtarget`})],U.prototype,`formTarget`,2),A([j(`disabled`,{waitUntilFirstUpdate:!0})],U.prototype,`handleDisabledChange`,1),U.define(`sl-button`);var Aa=E`
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
`,ja=class extends L{constructor(){super(...arguments),this.hasSlotController=new ua(this,`footer`),this.localize=new Dn(this),this.modal=new ta(this),this.open=!1,this.label=``,this.noHeader=!1,this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.modal.isActive()&&this.open&&(e.stopPropagation(),this.requestClose(`keyboard`))}}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),oa(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),sa(this),this.removeOpenListeners()}requestClose(e){if(this.emit(`sl-request-close`,{cancelable:!0,detail:{source:e}}).defaultPrevented){let e=Ai(this,`dialog.denyClose`,{dir:this.localize.dir()});Mi(this.panel,e.keyframes,e.options);return}this.hide()}addOpenListeners(){var e;`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose(`keyboard`)):document.addEventListener(`keydown`,this.handleDocumentKeyDown)}removeOpenListeners(){var e;(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown)}async handleOpenChange(){if(this.open){this.emit(`sl-show`),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),oa(this);let e=this.querySelector(`[autofocus]`);e&&e.removeAttribute(`autofocus`),await Promise.all([Fi(this.dialog),Fi(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit(`sl-initial-focus`,{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute(`autofocus`,``)});let t=Ai(this,`dialog.show`,{dir:this.localize.dir()}),n=Ai(this,`dialog.overlay.show`,{dir:this.localize.dir()});await Promise.all([Mi(this.panel,t.keyframes,t.options),Mi(this.overlay,n.keyframes,n.options)]),this.emit(`sl-after-show`)}else{la(this),this.emit(`sl-hide`),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([Fi(this.dialog),Fi(this.overlay)]);let e=Ai(this,`dialog.hide`,{dir:this.localize.dir()}),t=Ai(this,`dialog.overlay.hide`,{dir:this.localize.dir()});await Promise.all([Mi(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),Mi(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,sa(this);let n=this.originalTrigger;typeof n?.focus==`function`&&setTimeout(()=>n.focus()),this.emit(`sl-after-hide`)}}async show(){if(!this.open)return this.open=!0,ji(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ji(this,`sl-after-hide`)}render(){return D`
      <div
        part="base"
        class=${R({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test(`footer`)})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose(`overlay`)} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?`false`:`true`}
          aria-label=${z(this.noHeader?this.label:void 0)}
          aria-labelledby=${z(this.noHeader?void 0:`title`)}
          tabindex="-1"
        >
          ${this.noHeader?``:D`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:`﻿`} </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="x-lg"
                      label=${this.localize.term(`close`)}
                      library="system"
                      @click="${()=>this.requestClose(`close-button`)}"
                    ></sl-icon-button>
                  </div>
                </header>
              `}
          ${``}
          <div part="body" class="dialog__body" tabindex="-1"><slot></slot></div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};ja.styles=[M,Aa],ja.dependencies={"sl-icon-button":B},A([I(`.dialog`)],ja.prototype,`dialog`,2),A([I(`.dialog__panel`)],ja.prototype,`panel`,2),A([I(`.dialog__overlay`)],ja.prototype,`overlay`,2),A([P({type:Boolean,reflect:!0})],ja.prototype,`open`,2),A([P({reflect:!0})],ja.prototype,`label`,2),A([P({attribute:`no-header`,type:Boolean,reflect:!0})],ja.prototype,`noHeader`,2),A([j(`open`,{waitUntilFirstUpdate:!0})],ja.prototype,`handleOpenChange`,1),H(`dialog.show`,{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:`ease`}}),H(`dialog.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:`ease`}}),H(`dialog.denyClose`,{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}}),H(`dialog.overlay.show`,{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),H(`dialog.overlay.hide`,{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),ja.define(`sl-dialog`);var Ma=E`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--sl-font-weight-semibold);
    letter-spacing: var(--sl-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--sl-border-radius-small);
    border: solid 1px var(--sl-color-neutral-0);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--success {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--warning {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`,Na=class extends L{constructor(){super(...arguments),this.variant=`primary`,this.pill=!1,this.pulse=!1}render(){return D`
      <span
        part="base"
        class=${R({badge:!0,"badge--primary":this.variant===`primary`,"badge--success":this.variant===`success`,"badge--neutral":this.variant===`neutral`,"badge--warning":this.variant===`warning`,"badge--danger":this.variant===`danger`,"badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      >
        <slot></slot>
      </span>
    `}};Na.styles=[M,Ma],A([P({reflect:!0})],Na.prototype,`variant`,2),A([P({type:Boolean,reflect:!0})],Na.prototype,`pill`,2),A([P({type:Boolean,reflect:!0})],Na.prototype,`pulse`,2),Na.define(`sl-badge`);var Pa=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.value=0,this.type=`decimal`,this.noGrouping=!1,this.currency=`USD`,this.currencyDisplay=`symbol`}render(){return isNaN(this.value)?``:this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.noGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};A([P({type:Number})],Pa.prototype,`value`,2),A([P()],Pa.prototype,`type`,2),A([P({attribute:`no-grouping`,type:Boolean})],Pa.prototype,`noGrouping`,2),A([P()],Pa.prototype,`currency`,2),A([P({attribute:`currency-display`})],Pa.prototype,`currencyDisplay`,2),A([P({attribute:`minimum-integer-digits`,type:Number})],Pa.prototype,`minimumIntegerDigits`,2),A([P({attribute:`minimum-fraction-digits`,type:Number})],Pa.prototype,`minimumFractionDigits`,2),A([P({attribute:`maximum-fraction-digits`,type:Number})],Pa.prototype,`maximumFractionDigits`,2),A([P({attribute:`minimum-significant-digits`,type:Number})],Pa.prototype,`minimumSignificantDigits`,2),A([P({attribute:`maximum-significant-digits`,type:Number})],Pa.prototype,`maximumSignificantDigits`,2),Pa.define(`sl-format-number`);var Fa=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer((()=>{customElements.define(e,t)}))},Ia=globalThis,La=Ia.ShadowRoot&&(Ia.ShadyCSS===void 0||Ia.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,Ra=Symbol(),za=new WeakMap,Ba=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==Ra)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(La&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=za.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&za.set(t,e))}return e}toString(){return this.cssText}},Va=e=>new Ba(typeof e==`string`?e:e+``,void 0,Ra),Ha=(e,...t)=>new Ba(e.length===1?e[0]:t.reduce(((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1]),e[0]),e,Ra),Ua=(e,t)=>{if(La)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let n of t){let t=document.createElement(`style`),r=Ia.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},Wa=La?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return Va(t)})(e):e,{is:Ga,defineProperty:Ka,getOwnPropertyDescriptor:qa,getOwnPropertyNames:Ja,getOwnPropertySymbols:Ya,getPrototypeOf:Xa}=Object,Za=globalThis,Qa=Za.trustedTypes,$a=Qa?Qa.emptyScript:``,eo=Za.reactiveElementPolyfillSupport,to=(e,t)=>e,no={toAttribute(e,t){switch(t){case Boolean:e=e?$a:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ro=(e,t)=>!Ga(e,t),io={attribute:!0,type:String,converter:no,reflect:!1,useDefault:!1,hasChanged:ro};Symbol.metadata??=Symbol(`metadata`),Za.litPropertyMetadata??=new WeakMap;var ao=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=io){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&Ka(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=qa(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??io}static _$Ei(){if(this.hasOwnProperty(to(`elementProperties`)))return;let e=Xa(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(to(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(to(`properties`))){let e=this.properties,t=[...Ja(e),...Ya(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(Wa(e))}else e!==void 0&&t.push(Wa(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ua(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?no:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?no:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n){if(e!==void 0){let r=this.constructor,i=this[e];if(n??=r.getPropertyOptions(e),!((n.hasChanged??ro)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};ao.elementStyles=[],ao.shadowRootOptions={mode:`open`},ao[to(`elementProperties`)]=new Map,ao[to(`finalized`)]=new Map,eo?.({ReactiveElement:ao}),(Za.reactiveElementVersions??=[]).push(`2.1.1`);var oo={attribute:!0,type:String,converter:no,reflect:!1,hasChanged:ro},so=(e=oo,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e)}}throw Error(`Unsupported decorator location: `+r)};function W(e){return(t,n)=>typeof n==`object`?so(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function co(e){return W({...e,state:!0,attribute:!1})}var lo=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function uo(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return lo(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return lo(n,r,{get(){return a(this)}})}}var fo=globalThis,po=fo.trustedTypes,mo=po?po.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,ho=`$lit$`,go=`lit$${Math.random().toFixed(9).slice(2)}$`,_o=`?`+go,vo=`<${_o}>`,yo=document,bo=()=>yo.createComment(``),xo=e=>e===null||typeof e!=`object`&&typeof e!=`function`,So=Array.isArray,Co=e=>So(e)||typeof e?.[Symbol.iterator]==`function`,wo=`[ 	
\f\r]`,To=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Eo=/-->/g,Do=/>/g,Oo=RegExp(`>|${wo}(?:([^\\s"'>=/]+)(${wo}*=${wo}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ko=/'/g,Ao=/"/g,jo=/^(?:script|style|textarea|title)$/i,G=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),Mo=Symbol.for(`lit-noChange`),K=Symbol.for(`lit-nothing`),No=new WeakMap,Po=yo.createTreeWalker(yo,129);function Fo(e,t){if(!So(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return mo===void 0?t:mo.createHTML(t)}var Io=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=To;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===To?c[1]===`!--`?o=Eo:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=Oo):(jo.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=Oo):o=Do:o===Oo?c[0]===`>`?(o=i??To,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?Oo:c[3]===`"`?Ao:ko):o===Ao||o===ko?o=Oo:o===Eo||o===Do?o=To:(o=Oo,i=void 0);let d=o===Oo&&e[t+1].startsWith(`/>`)?` `:``;a+=o===To?n+vo:l>=0?(r.push(s),n.slice(0,l)+ho+n.slice(l)+go+d):n+go+(l===-2?t:d)}return[Fo(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Lo=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Io(t,n);if(this.el=e.createElement(l,r),Po.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Po.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(ho)){let t=u[o++],n=i.getAttribute(e).split(go),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ho:r[1]===`?`?Uo:r[1]===`@`?Wo:Vo}),i.removeAttribute(e)}else e.startsWith(go)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(jo.test(i.tagName)){let e=i.textContent.split(go),t=e.length-1;if(t>0){i.textContent=po?po.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],bo()),Po.nextNode(),c.push({type:2,index:++a});i.append(e[t],bo())}}}else if(i.nodeType===8)if(i.data===_o)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(go,e+1))!==-1;)c.push({type:7,index:a}),e+=go.length-1}a++}}static createElement(e,t){let n=yo.createElement(`template`);return n.innerHTML=e,n}};function Ro(e,t,n=e,r){if(t===Mo)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=xo(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=Ro(e,i._$AS(e,t.values),i,r)),t}var zo=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??yo).importNode(t,!0);Po.currentNode=r;let i=Po.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new Bo(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Go(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Po.nextNode(),a++)}return Po.currentNode=yo,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},Bo=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Ro(this,e,t),xo(e)?e===K||e==null||e===``?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==Mo&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Co(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&xo(this._$AH)?this._$AA.nextSibling.data=e:this.T(yo.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Lo.createElement(Fo(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new zo(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=No.get(e.strings);return t===void 0&&No.set(e.strings,t=new Lo(e)),t}k(t){So(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(bo()),this.O(bo()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Vo=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=K}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=Ro(this,e,t,0),a=!xo(e)||e!==this._$AH&&e!==Mo,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=Ro(this,r[n+o],t,o),s===Mo&&(s=this._$AH[o]),a||=!xo(s)||s!==this._$AH[o],s===K?e=K:e!==K&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ho=class extends Vo{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}},Uo=class extends Vo{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}},Wo=class extends Vo{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=Ro(this,e,t,0)??K)===Mo)return;let n=this._$AH,r=e===K&&n!==K||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==K&&(n===K||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Go=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){Ro(this,e)}},Ko=fo.litHtmlPolyfillSupport;Ko?.(Lo,Bo),(fo.litHtmlVersions??=[]).push(`3.3.1`);var qo=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new Bo(t.insertBefore(bo(),e),e,void 0,n??{})}return i._$AI(e),i},Jo=globalThis,Yo=class extends ao{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=qo(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Mo}};Yo._$litElement$=!0,Yo.finalized=!0,Jo.litElementHydrateSupport?.({LitElement:Yo});var Xo=Jo.litElementPolyfillSupport;Xo?.({LitElement:Yo}),(Jo.litElementVersions??=[]).push(`4.2.1`);function Zo(e){switch(e.toLowerCase()){case`get`:return`success`;case`post`:return`primary`;case`put`:return`primary`;case`delete`:return`danger`;case`patch`:return`warning`;case`query`:return`primary`;default:return`neutral`}}var Qo=Ha`
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
`;function q(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var $o={GET:`GET`,POST:`POST`,PUT:`PUT`,DELETE:`DEL`,PATCH:`PAT`,OPTIONS:`OPT`,HEAD:`HEAD`,TRACE:`TRC`,QUERY:`QRY`},es=class extends Yo{static{this.styles=Qo}constructor(){super(),this.mode=``,this.lower=!1,this.method=`GET`}render(){if(this.mode===`nav-naked`){let e=this.method.toUpperCase(),t=$o[e]??e;return G`<span class="method-naked ${this.method.toLowerCase()}">${t}</span>`}let e=`medium`;this.large&&(e=`large`),this.tiny&&(e=`small`),this.micro&&(e=`small`);let t=this.method.toLowerCase(),n=this.micro?`method ${e} micro ${t}`:`method ${e} ${t}`;return G`
            <sl-tag variant="${Zo(this.method)}" class="${n}"
                    size="${e}">
                ${this.lower?this.method.toLowerCase():this.method.toUpperCase()}</sl-tag>
        `}};q([W()],es.prototype,`method`,void 0),q([W({type:Boolean})],es.prototype,`lower`,void 0),q([W({type:Boolean})],es.prototype,`large`,void 0),q([W({type:Boolean})],es.prototype,`tiny`,void 0),q([W({type:Boolean})],es.prototype,`micro`,void 0),q([W({reflect:!0})],es.prototype,`mode`,void 0),es=q([Fa(`pb33f-http-method`)],es);var ts={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ns=e=>(...t)=>({_$litDirective$:e,values:t}),rs=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},is=class extends rs{constructor(e){if(super(e),this.it=K,e.type!==ts.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===K||e==null)return this._t=void 0,this.it=e;if(e===Mo)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};is.directiveName=`unsafeHTML`,is.resultType=1;var as=ns(is),os=Ha`
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
`,ss=class extends Yo{static{this.styles=os}constructor(){super(),this.path=`/`,this.nowrap=!1}replaceBrackets(){let e=/\{([\w$.#/]+)\}/g,t=this.nowrap?` nowrap`:``,n=this.formatSlashes(this.path).replace(e,(e,n)=>`<span class="bracket${t}">{</span><span class="param${t}">${n}</span><span class="bracket${t}">}</span>`);return this.nowrap?G`<div style="white-space: nowrap;">${as(n)}</div>`:G`${as(n)}`}formatSlashes(e){return e.replaceAll(`/`,`<span class="slash">/</span>`)}render(){return G`${this.replaceBrackets()}`}};q([W()],ss.prototype,`path`,void 0),q([W({type:Boolean})],ss.prototype,`nowrap`,void 0),ss=q([Fa(`pb33f-render-operation-path`)],ss);var cs=Ha`
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
    }`,ls=class extends Yo{static{this.styles=cs}constructor(){super(),this.name=`pb33f`,this.url=`https://pb33f.io`,this.wide=!1,this.fluid=!1}render(){return G`
            <header class="pb33f-header">
                <div class="logo ${this.fluid?`fluid`:this.wide?`wide`:``}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};q([W()],ls.prototype,`name`,void 0),q([W()],ls.prototype,`url`,void 0),q([W({type:Boolean})],ls.prototype,`wide`,void 0),q([W({type:Boolean})],ls.prototype,`fluid`,void 0),ls=q([Fa(`pb33f-header`)],ls);var us=Ha`

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

`,ds=Ha`
    
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
 `,fs=`pb33f-theme-change`,ps=`tektronix`,ms=`pb33f-theme`,hs=`pb33f-base-theme`,gs=class extends Yo{constructor(...e){super(...e),this.baseTheme=`dark`,this.tektronixActive=!1}static{this.styles=[us,ds]}get activeTheme(){return this.tektronixActive?ps:this.baseTheme}connectedCallback(){super.connectedCallback();let e=localStorage.getItem(ms);e===`tektronix`?(this.tektronixActive=!0,this.baseTheme=localStorage.getItem(hs)===`light`?`light`:`dark`):(this.tektronixActive=!1,this.baseTheme=e===`light`?`light`:`dark`),this.applyTheme()}applyTheme(){let e=this.activeTheme;localStorage.setItem(ms,e),localStorage.setItem(hs,this.baseTheme);let t=document.querySelector(`html`);t&&(t.setAttribute(`theme`,e),e===`light`?t.classList.remove(`sl-theme-dark`):t.classList.add(`sl-theme-dark`))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(fs,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===`dark`?`light`:`dark`,this.tektronixActive&&=!1,this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){let e=this.baseTheme===`dark`?`sun`:`moon`,t=this.baseTheme===`dark`?`Switch to Roger Mode (light)`:`Switch to PB33F Mode (dark)`,n=this.tektronixActive?`Disable Tektronix 4010 Mode`:`Enable Tektronix 4010 Mode`;return G`
            <sl-tooltip content="${t}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTheme}
                    name="${e}"
                    label="Toggle dark/light">
                </sl-icon-button>
            </sl-tooltip>
            <sl-tooltip content="${n}" placement="top">
                <sl-icon-button
                    @click=${this.toggleTektronix}
                    name="display"
                    class="${this.tektronixActive?`tek-active`:``}"
                    label="Toggle Tektronix">
                </sl-icon-button>
            </sl-tooltip>
        `}};q([co()],gs.prototype,`baseTheme`,void 0),q([co()],gs.prototype,`tektronixActive`,void 0),gs=q([Fa(`pb33f-theme-switcher`)],gs);var _s=Ha`
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
`,vs=new Set,ys=new Map,bs,xs=`ltr`,Ss=`en`,Cs=typeof MutationObserver<`u`&&typeof document<`u`&&document.documentElement!==void 0;if(Cs){let e=new MutationObserver(Ts);xs=document.documentElement.dir||`ltr`,Ss=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:[`dir`,`lang`]})}function ws(...e){e.map(e=>{let t=e.$code.toLowerCase();ys.has(t)?ys.set(t,Object.assign(Object.assign({},ys.get(t)),e)):ys.set(t,e),bs||=e}),Ts()}function Ts(){Cs&&(xs=document.documentElement.dir||`ltr`,Ss=document.documentElement.lang||navigator.language),[...vs.keys()].map(e=>{typeof e.requestUpdate==`function`&&e.requestUpdate()})}var Es=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){vs.add(this.host)}hostDisconnected(){vs.delete(this.host)}dir(){return`${this.host.dir||xs}`.toLowerCase()}lang(){return`${this.host.lang||Ss}`.toLowerCase()}getTranslationData(e){let t=new Intl.Locale(e.replace(/_/g,`-`)),n=t?.language.toLowerCase(),r=(t?.region)?.toLowerCase()??``;return{locale:t,language:n,region:r,primary:ys.get(`${n}-${r}`),secondary:ys.get(n)}}exists(e,t){let{primary:n,secondary:r}=this.getTranslationData(t.lang??this.lang());return t=Object.assign({includeFallback:!1},t),!!(n&&n[e]||r&&r[e]||t.includeFallback&&bs&&bs[e])}term(e,...t){let{primary:n,secondary:r}=this.getTranslationData(this.lang()),i;if(n&&n[e])i=n[e];else if(r&&r[e])i=r[e];else if(bs&&bs[e])i=bs[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i==`function`?i(...t):i}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?``:new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}},Ds={$code:`en`,$name:`English`,$dir:`ltr`,carousel:`Carousel`,clearEntry:`Clear entry`,close:`Close`,copied:`Copied`,copy:`Copy`,currentValue:`Current value`,error:`Error`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:`Hide password`,loading:`Loading`,nextSlide:`Next slide`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,previousSlide:`Previous slide`,progress:`Progress`,remove:`Remove`,resize:`Resize`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,selectAColorFromTheScreen:`Select a color from the screen`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,toggleColorFormat:`Toggle color format`};ws(Ds);var Os=Ds,ks=class extends Es{};ws(Os);var As=Ha`
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
`,js=Object.defineProperty,Ms=Object.defineProperties,Ns=Object.getOwnPropertyDescriptor,Ps=Object.getOwnPropertyDescriptors,Fs=Object.getOwnPropertySymbols,Is=Object.prototype.hasOwnProperty,Ls=Object.prototype.propertyIsEnumerable,Rs=e=>{throw TypeError(e)},zs=(e,t,n)=>t in e?js(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Bs=(e,t)=>{for(var n in t||={})Is.call(t,n)&&zs(e,n,t[n]);if(Fs)for(var n of Fs(t))Ls.call(t,n)&&zs(e,n,t[n]);return e},Vs=(e,t)=>Ms(e,Ps(t)),J=(e,t,n,r)=>{for(var i=r>1?void 0:r?Ns(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&js(t,n,i),i},Hs=(e,t,n)=>t.has(e)||Rs(`Cannot `+n),Us=(e,t,n)=>(Hs(e,t,`read from private field`),n?n.call(e):t.get(e)),Ws=(e,t,n)=>t.has(e)?Rs(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Gs=(e,t,n,r)=>(Hs(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ks,qs=class extends Yo{constructor(){super(),Ws(this,Ks,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){let n=new CustomEvent(e,Bs({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(n),n}static define(e,t=this,n={}){let r=customElements.get(e);if(!r){try{customElements.define(e,t,n)}catch{customElements.define(e,class extends t{},n)}return}let i=` (unknown version)`,a=i;`version`in t&&t.version&&(i=` v`+t.version),`version`in r&&r.version&&(a=` v`+r.version),!(i&&a&&i===a)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${a} has already been registered.`)}attributeChangedCallback(e,t,n){Us(this,Ks)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),Gs(this,Ks,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}};Ks=new WeakMap,qs.version=`2.20.1`,qs.dependencies={},J([W()],qs.prototype,`dir`,2),J([W()],qs.prototype,`lang`,2);var Js=Math.min,Ys=Math.max,Xs=Math.round,Zs=Math.floor,Qs=e=>({x:e,y:e}),$s={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function ec(e,t,n){return Ys(e,Js(t,n))}function tc(e,t){return typeof e==`function`?e(t):e}function nc(e){return e.split(`-`)[0]}function rc(e){return e.split(`-`)[1]}function ic(e){return e===`x`?`y`:`x`}function ac(e){return e===`y`?`height`:`width`}function oc(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function sc(e){return ic(oc(e))}function cc(e,t,n){n===void 0&&(n=!1);let r=rc(e),i=sc(e),a=ac(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=_c(o)),[o,_c(o)]}function lc(e){let t=_c(e);return[uc(e),t,uc(t)]}function uc(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var dc=[`left`,`right`],fc=[`right`,`left`],pc=[`top`,`bottom`],mc=[`bottom`,`top`];function hc(e,t,n){switch(e){case`top`:case`bottom`:return n?t?fc:dc:t?dc:fc;case`left`:case`right`:return t?pc:mc;default:return[]}}function gc(e,t,n,r){let i=rc(e),a=hc(nc(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(uc)))),a}function _c(e){let t=nc(e);return $s[t]+e.slice(t.length)}function vc(e){return{top:0,right:0,bottom:0,left:0,...e}}function yc(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:vc(e)}function bc(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function xc(e,t,n){let{reference:r,floating:i}=e,a=oc(t),o=sc(t),s=ac(o),c=nc(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(rc(t)){case`start`:p[o]-=f*(n&&l?-1:1);break;case`end`:p[o]+=f*(n&&l?-1:1);break}return p}async function Sc(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=tc(t,e),p=yc(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=bc(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=bc(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}var Cc=50,wc=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:Sc},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=xc(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:ee,reset:b}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...ee},b&&p<Cc&&(p++,typeof b==`object`&&(b.placement&&(f=b.placement),b.rects&&(l=b.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):b.rects),{x:u,y:d}=xc(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},Tc=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=tc(e,t)||{};if(l==null)return{};let d=yc(u),f={x:n,y:r},p=sc(i),m=ac(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,ee=a.reference[m]+a.reference[p]-f[p]-a.floating[m],b=f[p]-a.reference[p],x=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),S=x?x[y]:0;(!S||!await(o.isElement==null?void 0:o.isElement(x)))&&(S=s.floating[y]||a.floating[m]);let C=ee/2-b/2,w=S/2-h[m]/2-1,te=Js(d[_],w),ne=Js(d[v],w),re=te,ie=S-h[m]-ne,T=S/2-h[m]/2+C,ae=ec(re,T,ie),oe=!c.arrow&&rc(i)!=null&&T!==ae&&a.reference[m]/2-(T<re?te:ne)-h[m]/2<0,se=oe?T<re?T-re:T-ie:0;return{[p]:f[p]+se,data:{[p]:ae,centerOffset:T-ae-se,...oe&&{alignmentOffset:se}},reset:oe}}}),Ec=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=tc(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=nc(r),_=oc(o),v=nc(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),ee=d||(v||!m?[_c(o)]:lc(o)),b=p!==`none`;!d&&b&&ee.push(...gc(o,m,p,y));let x=[o,...ee],S=await s.detectOverflow(t,h),C=[],w=i.flip?.overflows||[];if(l&&C.push(S[g]),u){let e=cc(r,a,y);C.push(S[e[0]],S[e[1]])}if(w=[...w,{placement:r,overflows:C}],!C.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=x[e];if(t&&(!(u===`alignment`&&_!==oc(t))||w.every(e=>oc(e.placement)===_?e.overflows[0]>0:!0)))return{data:{index:e,overflows:w},reset:{placement:t}};let n=w.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=w.filter(e=>{if(b){let t=oc(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o;break}if(r!==n)return{reset:{placement:n}}}return{}}}},Dc=new Set([`left`,`top`]);async function Oc(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=nc(n),s=rc(n),c=oc(n)===`y`,l=Dc.has(o)?-1:1,u=a&&c?-1:1,d=tc(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var kc=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await Oc(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},Ac=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=tc(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=oc(nc(i)),p=ic(f),m=u[p],h=u[f];if(o){let e=p===`y`?`top`:`left`,t=p===`y`?`bottom`:`right`,n=m+d[e],r=m-d[t];m=ec(n,m,r)}if(s){let e=f===`y`?`top`:`left`,t=f===`y`?`bottom`:`right`,n=h+d[e],r=h-d[t];h=ec(n,h,r)}let g=c.fn({...t,[p]:m,[f]:h});return{...g,data:{x:g.x-n,y:g.y-r,enabled:{[p]:o,[f]:s}}}}}},jc=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){var n,r;let{placement:i,rects:a,platform:o,elements:s}=t,{apply:c=()=>{},...l}=tc(e,t),u=await o.detectOverflow(t,l),d=nc(i),f=rc(i),p=oc(i)===`y`,{width:m,height:h}=a.floating,g,_;d===`top`||d===`bottom`?(g=d,_=f===(await(o.isRTL==null?void 0:o.isRTL(s.floating))?`start`:`end`)?`left`:`right`):(_=d,g=f===`end`?`top`:`bottom`);let v=h-u.top-u.bottom,y=m-u.left-u.right,ee=Js(h-u[g],v),b=Js(m-u[_],y),x=!t.middlewareData.shift,S=ee,C=b;if((n=t.middlewareData.shift)!=null&&n.enabled.x&&(C=y),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(S=v),x&&!f){let e=Ys(u.left,0),t=Ys(u.right,0),n=Ys(u.top,0),r=Ys(u.bottom,0);p?C=m-2*(e!==0||t!==0?e+t:Ys(u.left,u.right)):S=h-2*(n!==0||r!==0?n+r:Ys(u.top,u.bottom))}await c({...t,availableWidth:C,availableHeight:S});let w=await o.getDimensions(s.floating);return m!==w.width||h!==w.height?{reset:{rects:!0}}:{}}}};function Mc(){return typeof window<`u`}function Nc(e){return Ic(e)?(e.nodeName||``).toLowerCase():`#document`}function Pc(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function Fc(e){return((Ic(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function Ic(e){return Mc()?e instanceof Node||e instanceof Pc(e).Node:!1}function Lc(e){return Mc()?e instanceof Element||e instanceof Pc(e).Element:!1}function Rc(e){return Mc()?e instanceof HTMLElement||e instanceof Pc(e).HTMLElement:!1}function zc(e){return!Mc()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof Pc(e).ShadowRoot}function Bc(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Zc(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function Vc(e){return/^(table|td|th)$/.test(Nc(e))}function Hc(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var Uc=/transform|translate|scale|rotate|perspective|filter/,Wc=/paint|layout|strict|content/,Gc=e=>!!e&&e!==`none`,Kc;function qc(e){let t=Lc(e)?Zc(e):e;return Gc(t.transform)||Gc(t.translate)||Gc(t.scale)||Gc(t.rotate)||Gc(t.perspective)||!Yc()&&(Gc(t.backdropFilter)||Gc(t.filter))||Uc.test(t.willChange||``)||Wc.test(t.contain||``)}function Jc(e){let t=$c(e);for(;Rc(t)&&!Xc(t);){if(qc(t))return t;if(Hc(t))return null;t=$c(t)}return null}function Yc(){return Kc??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Kc}function Xc(e){return/^(html|body|#document)$/.test(Nc(e))}function Zc(e){return Pc(e).getComputedStyle(e)}function Qc(e){return Lc(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function $c(e){if(Nc(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||zc(e)&&e.host||Fc(e);return zc(t)?t.host:t}function el(e){let t=$c(e);return Xc(t)?e.ownerDocument?e.ownerDocument.body:e.body:Rc(t)&&Bc(t)?t:el(t)}function tl(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=el(e),i=r===e.ownerDocument?.body,a=Pc(r);if(i){let e=nl(a);return t.concat(a,a.visualViewport||[],Bc(r)?r:[],e&&n?tl(e):[])}else return t.concat(r,tl(r,[],n))}function nl(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function rl(e){let t=Zc(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=Rc(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=Xs(n)!==a||Xs(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function il(e){return Lc(e)?e:e.contextElement}function al(e){let t=il(e);if(!Rc(t))return Qs(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=rl(t),o=(a?Xs(n.width):n.width)/r,s=(a?Xs(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}var ol=Qs(0);function sl(e){let t=Pc(e);return!Yc()||!t.visualViewport?ol:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function cl(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==Pc(e)?!1:t}function ll(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=il(e),o=Qs(1);t&&(r?Lc(r)&&(o=al(r)):o=al(e));let s=cl(a,n,r)?sl(a):Qs(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a){let e=Pc(a),t=r&&Lc(r)?Pc(r):r,n=e,i=nl(n);for(;i&&r&&t!==n;){let e=al(i),t=i.getBoundingClientRect(),r=Zc(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=Pc(i),i=nl(n)}}return bc({width:u,height:d,x:c,y:l})}function ul(e,t){let n=Qc(e).scrollLeft;return t?t.left+n:ll(Fc(e)).left+n}function dl(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-ul(e,n),y:n.top+t.scrollTop}}function fl(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=Fc(r),s=t?Hc(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=Qs(1),u=Qs(0),d=Rc(r);if((d||!d&&!a)&&((Nc(r)!==`body`||Bc(o))&&(c=Qc(r)),d)){let e=ll(r);l=al(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?dl(o,c):Qs(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function pl(e){return Array.from(e.getClientRects())}function ml(e){let t=Fc(e),n=Qc(e),r=e.ownerDocument.body,i=Ys(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=Ys(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),o=-n.scrollLeft+ul(e),s=-n.scrollTop;return Zc(r).direction===`rtl`&&(o+=Ys(t.clientWidth,r.clientWidth)-i),{width:i,height:a,x:o,y:s}}var hl=25;function gl(e,t){let n=Pc(e),r=Fc(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;let e=Yc();(!e||e&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}let l=ul(r);if(l<=0){let e=r.ownerDocument,t=e.body,n=getComputedStyle(t),i=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,o=Math.abs(r.clientWidth-t.clientWidth-i);o<=hl&&(a-=o)}else l<=hl&&(a+=l);return{width:a,height:o,x:s,y:c}}function _l(e,t){let n=ll(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=Rc(e)?al(e):Qs(1);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function vl(e,t,n){let r;if(t===`viewport`)r=gl(e,n);else if(t===`document`)r=ml(Fc(e));else if(Lc(t))r=_l(t,n);else{let n=sl(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return bc(r)}function yl(e,t){let n=$c(e);return n===t||!Lc(n)||Xc(n)?!1:Zc(n).position===`fixed`||yl(n,t)}function bl(e,t){let n=t.get(e);if(n)return n;let r=tl(e,[],!1).filter(e=>Lc(e)&&Nc(e)!==`body`),i=null,a=Zc(e).position===`fixed`,o=a?$c(e):e;for(;Lc(o)&&!Xc(o);){let t=Zc(o),n=qc(o);!n&&t.position===`fixed`&&(i=null),(a?!n&&!i:!n&&t.position===`static`&&i&&(i.position===`absolute`||i.position===`fixed`)||Bc(o)&&!n&&yl(e,o))?r=r.filter(e=>e!==o):i=t,o=$c(o)}return t.set(e,r),r}function xl(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?Hc(t)?[]:bl(t,this._c):[].concat(n),r],o=vl(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=vl(t,a[e],i);s=Ys(n.top,s),c=Js(n.right,c),l=Js(n.bottom,l),u=Ys(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function Sl(e){let{width:t,height:n}=rl(e);return{width:t,height:n}}function Cl(e,t,n){let r=Rc(t),i=Fc(t),a=n===`fixed`,o=ll(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=Qs(0);function l(){c.x=ul(i)}if(r||!r&&!a)if((Nc(t)!==`body`||Bc(i))&&(s=Qc(t)),r){let e=ll(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else i&&l();a&&!r&&i&&l();let u=i&&!r&&!a?dl(i,s):Qs(0);return{x:o.left+s.scrollLeft-c.x-u.x,y:o.top+s.scrollTop-c.y-u.y,width:o.width,height:o.height}}function wl(e){return Zc(e).position===`static`}function Tl(e,t){if(!Rc(e)||Zc(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return Fc(e)===n&&(n=n.ownerDocument.body),n}function El(e,t){let n=Pc(e);if(Hc(e))return n;if(!Rc(e)){let t=$c(e);for(;t&&!Xc(t);){if(Lc(t)&&!wl(t))return t;t=$c(t)}return n}let r=Tl(e,t);for(;r&&Vc(r)&&wl(r);)r=Tl(r,t);return r&&Xc(r)&&wl(r)&&!qc(r)?n:r||Jc(e)||n}var Dl=async function(e){let t=this.getOffsetParent||El,n=this.getDimensions,r=await n(e.floating);return{reference:Cl(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function Ol(e){return Zc(e).direction===`rtl`}var kl={convertOffsetParentRelativeRectToViewportRelativeRect:fl,getDocumentElement:Fc,getClippingRect:xl,getOffsetParent:El,getElementRects:Dl,getClientRects:pl,getDimensions:Sl,getScale:al,isElement:Lc,isRTL:Ol};function Al(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function jl(e,t){let n=null,r,i=Fc(e);function a(){var e;clearTimeout(r),(e=n)==null||e.disconnect(),n=null}function o(s,c){s===void 0&&(s=!1),c===void 0&&(c=1),a();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(s||t(),!f||!p)return;let m=Zs(d),h=Zs(i.clientWidth-(u+f)),g=Zs(i.clientHeight-(d+p)),_=Zs(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:Ys(0,Js(1,c))||1},y=!0;function ee(t){let n=t[0].intersectionRatio;if(n!==c){if(!y)return o();n?o(!1,n):r=setTimeout(()=>{o(!1,1e-7)},1e3)}n===1&&!Al(l,e.getBoundingClientRect())&&o(),y=!1}try{n=new IntersectionObserver(ee,{...v,root:i.ownerDocument})}catch{n=new IntersectionObserver(ee,v)}n.observe(e)}return o(!0),a}function Ml(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=il(e),u=i||a?[...l?tl(l):[],...t?tl(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n,{passive:!0}),a&&e.addEventListener(`resize`,n)});let d=l&&s?jl(l,n):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?ll(e):null;c&&g();function g(){let t=ll(e);h&&!Al(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var Nl=kc,Pl=Ac,Fl=Ec,Il=jc,Ll=Tc,Rl=(e,t,n)=>{let r=new Map,i={platform:kl,...n},a={...i.platform,_c:r};return wc(e,t,{...i,platform:a})},zl=ns(class extends rs{constructor(e){if(super(e),e.type!==ts.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter((t=>e[t])).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter((e=>e!==``))));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return Mo}});function Bl(e){return Hl(e)}function Vl(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Hl(e){for(let t=e;t;t=Vl(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=Vl(e);t;t=Vl(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||qc(e)||t.tagName===`BODY`))return t}return null}function Ul(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e&&(`contextElement`in e?e.contextElement instanceof Element:!0)}var Y=class extends qs{constructor(){super(...arguments),this.localize=new ks(this),this.active=!1,this.placement=`top`,this.strategy=`absolute`,this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),n=this.placement.includes(`top`)||this.placement.includes(`bottom`),r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0;n?e.top<t.top?(r=e.left,i=e.bottom,a=e.right,o=e.bottom,s=t.left,c=t.top,l=t.right,u=t.top):(r=t.left,i=t.bottom,a=t.right,o=t.bottom,s=e.left,c=e.top,l=e.right,u=e.top):e.left<t.left?(r=e.right,i=e.top,a=t.left,o=t.top,s=e.right,c=e.bottom,l=t.left,u=t.bottom):(r=t.right,i=t.top,a=e.left,o=e.top,s=t.right,c=t.bottom,l=e.left,u=e.bottom),this.style.setProperty(`--hover-bridge-top-left-x`,`${r}px`),this.style.setProperty(`--hover-bridge-top-left-y`,`${i}px`),this.style.setProperty(`--hover-bridge-top-right-x`,`${a}px`),this.style.setProperty(`--hover-bridge-top-right-y`,`${o}px`),this.style.setProperty(`--hover-bridge-bottom-left-x`,`${s}px`),this.style.setProperty(`--hover-bridge-bottom-left-y`,`${c}px`),this.style.setProperty(`--hover-bridge-bottom-right-x`,`${l}px`),this.style.setProperty(`--hover-bridge-bottom-right-y`,`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has(`active`)&&(this.active?this.start():this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){await this.stop(),this.anchor&&typeof this.anchor==`string`?this.anchorEl=this.getRootNode().getElementById(this.anchor):this.anchor instanceof Element||Ul(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector(`[slot="anchor"]`),this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=Ml(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute(`data-current-placement`),this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;let e=[Nl({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(Il({apply:({rects:e})=>{let t=this.sync===`width`||this.sync===`both`,n=this.sync===`height`||this.sync===`both`;this.popup.style.width=t?`${e.reference.width}px`:``,this.popup.style.height=n?`${e.reference.height}px`:``}})):(this.popup.style.width=``,this.popup.style.height=``),this.flip&&e.push(Fl({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&e.push(Pl({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(Il({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{this.autoSize===`vertical`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-height`,`${t}px`):this.style.removeProperty(`--auto-size-available-height`),this.autoSize===`horizontal`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-width`,`${e}px`):this.style.removeProperty(`--auto-size-available-width`)}})):(this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`)),this.arrow&&e.push(Ll({element:this.arrowEl,padding:this.arrowPadding}));let t=this.strategy===`absolute`?e=>kl.getOffsetParent(e,Bl):kl.getOffsetParent;Rl(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:Vs(Bs({},kl),{getOffsetParent:t})}).then(({x:e,y:t,middlewareData:n,placement:r})=>{let i=this.localize.dir()===`rtl`,a={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[r.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,r),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){let e=n.arrow.x,t=n.arrow.y,r=``,o=``,s=``,c=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;r=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``,o=i?n:``,c=i?``:n}else if(this.arrowPlacement===`end`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;o=i?``:n,c=i?n:``,s=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``}else this.arrowPlacement===`center`?(c=typeof e==`number`?`calc(50% - var(--arrow-size-diagonal))`:``,r=typeof t==`number`?`calc(50% - var(--arrow-size-diagonal))`:``):(c=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(this.arrowEl.style,{top:r,right:o,bottom:s,left:c,[a]:`calc(var(--arrow-size-diagonal) * -1)`})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit(`sl-reposition`)}render(){return G`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${zl({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${zl({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy===`fixed`,"popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?G`<div part="arrow" class="popup__arrow" role="presentation"></div>`:``}
      </div>
    `}};Y.styles=[As,_s],J([uo(`.popup`)],Y.prototype,`popup`,2),J([uo(`.popup__arrow`)],Y.prototype,`arrowEl`,2),J([W()],Y.prototype,`anchor`,2),J([W({type:Boolean,reflect:!0})],Y.prototype,`active`,2),J([W({reflect:!0})],Y.prototype,`placement`,2),J([W({reflect:!0})],Y.prototype,`strategy`,2),J([W({type:Number})],Y.prototype,`distance`,2),J([W({type:Number})],Y.prototype,`skidding`,2),J([W({type:Boolean})],Y.prototype,`arrow`,2),J([W({attribute:`arrow-placement`})],Y.prototype,`arrowPlacement`,2),J([W({attribute:`arrow-padding`,type:Number})],Y.prototype,`arrowPadding`,2),J([W({type:Boolean})],Y.prototype,`flip`,2),J([W({attribute:`flip-fallback-placements`,converter:{fromAttribute:e=>e.split(` `).map(e=>e.trim()).filter(e=>e!==``),toAttribute:e=>e.join(` `)}})],Y.prototype,`flipFallbackPlacements`,2),J([W({attribute:`flip-fallback-strategy`})],Y.prototype,`flipFallbackStrategy`,2),J([W({type:Object})],Y.prototype,`flipBoundary`,2),J([W({attribute:`flip-padding`,type:Number})],Y.prototype,`flipPadding`,2),J([W({type:Boolean})],Y.prototype,`shift`,2),J([W({type:Object})],Y.prototype,`shiftBoundary`,2),J([W({attribute:`shift-padding`,type:Number})],Y.prototype,`shiftPadding`,2),J([W({attribute:`auto-size`})],Y.prototype,`autoSize`,2),J([W()],Y.prototype,`sync`,2),J([W({type:Object})],Y.prototype,`autoSizeBoundary`,2),J([W({attribute:`auto-size-padding`,type:Number})],Y.prototype,`autoSizePadding`,2),J([W({attribute:`hover-bridge`,type:Boolean})],Y.prototype,`hoverBridge`,2),Y.define(`sl-popup`);var Wl=Ha`

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
    
`,Gl=Ha`
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
`,Kl=Ha`
    
    em, i {
        font-style: normal;
        font-family: var(--font-stack-italic), monospace;
    }
    
    strong {
        font-style: normal;
        font-family: var(--font-stack-bold), monospace;
    }
    

`,X=function(e){return e.VERSION=`version`,e.SCHEMA=`schema`,e.SCHEMAS=`schemas`,e.SCHEMA_TYPES=`types`,e.MEDIA_TYPE=`mediaType`,e.HEADER=`header`,e.EXAMPLE=`example`,e.EXAMPLES=`examples`,e.ENCODING=`encoding`,e.REQUEST_BODY=`requestBody`,e.REQUEST_BODIES=`requestBodies`,e.PARAMETER=`parameter`,e.PARAMETER_QUERY=`query`,e.COOKIE=`cookie`,e.PARAMETERS=`parameters`,e.LINK=`link`,e.LINKS=`links`,e.RESPONSE=`response`,e.RESPONSES=`responses`,e.OPERATION=`operation`,e.OPERATIONS=`operations`,e.SECURITY_SCHEME=`securityScheme`,e.SECURITY_SCHEMES=`securitySchemes`,e.EXTERNAL_DOCS=`externalDocs`,e.SECURITY=`security`,e.CALLBACK=`callback`,e.CALLBACKS=`callbacks`,e.PATH_ITEM=`pathItem`,e.PATH_ITEMS=`pathItems`,e.XML=`xml`,e.HEADERS=`headers`,e.SERVER=`server`,e.SERVERS=`servers`,e.SERVER_VARIABLE=`serverVariable`,e.PATHS=`paths`,e.COMPONENTS=`components`,e.CONTACT=`contact`,e.LICENSE=`license`,e.INFO=`info`,e.TAG=`tag`,e.TAGS=`tags`,e.DOCUMENT=`document`,e.WEBHOOK=`webhook`,e.WEBHOOKS=`webhooks`,e.EXTENSIONS=`extensions`,e.EXTENSION=`extension`,e.NO_EXAMPLE=`noExample`,e.POLYMORPHIC=`polymorphic`,e.ERROR=`error`,e.WARNING=`warning`,e.ROLODEX_FILE=`rolodex-file`,e.ROLODEX_FOLDER=`rolodex-dir`,e.OPENAPI=`openapi`,e.UPLOAD=`upload`,e.ADD=`add`,e.UNKNOWN=`unknown`,e.EXPAND_NODE=`expand-node`,e.POV_MODE=`pov-mode`,e.JS=`js`,e.GO=`go`,e.TS=`ts`,e.CS=`cs`,e.C=`c`,e.CPP=`cpp`,e.PHP=`php`,e.PY=`py`,e.HTML=`html`,e.MD=`md`,e.JAVA=`java`,e.RS=`rs`,e.ZIG=`zig`,e.RB=`rb`,e.YAML=`yaml`,e.JSON=`json`,e}({}),ql,Jl=function(e){return e.tiny=`tiny`,e.small=`small`,e.smaller=`smaller`,e.medium=`medium`,e.large=`large`,e.huge=`huge`,e}({}),Yl=function(e){return e.primary=`primary`,e.secondary=`secondary`,e.inverse=`inverse`,e.font=`font`,e.warning=`warning`,e.polymorphic=`polymorphic`,e.error=`error`,e.filtered=`filtered`,e}({}),Xl=class extends Yo{static{ql=this}static{this.styles=[Wl,Gl,Kl,ds]}getSize(){switch(this.size){case Jl.tiny:return`0.8rem`;case Jl.smaller:return`1.2rem`;case Jl.medium:return`1.4rem`;case Jl.large:return`1.8rem`;case Jl.huge:return`2rem`;default:return`1rem`}}getIconColor(){switch(this.color){case Yl.primary:return`var(--primary-color)`;case Yl.secondary:return`var(--secondary-color)`;case Yl.warning:return`var(--warn-color)`;case Yl.polymorphic:return`var(--warn-color)`;case Yl.error:return`var(--error-color)`;case Yl.inverse:return`var(--background-color)`;case Yl.filtered:return`var(--font-color-sub2)`;case Yl.font:default:return`var(--font-color)`}}constructor(){super(),this._themeHandler=()=>this.requestUpdate(),this.size=Jl.medium,this.color=Yl.primary}connectedCallback(){super.connectedCallback(),window.addEventListener(fs,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(fs,this._themeHandler)}isLightMode(){return document.documentElement.getAttribute(`theme`)===`light`}getNodeTypeFromIcon(e){return Object.values(X).includes(e)?e:X.SCHEMA}static getIconForType(e){switch(e){case X.DOCUMENT:return`stars`;case X.SCHEMA:return`box`;case X.SCHEMA_TYPES:return`diagram-3`;case X.MEDIA_TYPE:case X.XML:return`code-slash`;case X.HEADER:case X.HEADERS:return`envelope`;case X.EXAMPLE:case X.EXAMPLES:return`chat-left-quote`;case X.ENCODING:return`box-seam`;case X.REQUEST_BODY:case X.REQUEST_BODIES:return`box-arrow-in-right`;case X.PARAMETER:case X.PARAMETERS:case X.SERVER_VARIABLE:return`braces-asterisk`;case X.PARAMETER_QUERY:return`question-lg`;case X.COOKIE:return`cookie`;case X.LINK:case X.LINKS:return`link`;case X.RESPONSE:case X.RESPONSES:return`box-arrow-left`;case X.OPERATION:case X.OPERATIONS:return`gear-wide-connected`;case X.SECURITY_SCHEME:case X.SECURITY_SCHEMES:case X.SECURITY:return`shield-lock`;case X.CALLBACK:case X.CALLBACKS:return`telephone-outbound`;case X.PATH_ITEM:case X.PATH_ITEMS:return`geo`;case X.SERVER:case X.SERVERS:return`hdd-network`;case X.PATHS:return`compass`;case X.COMPONENTS:return`boxes`;case X.CONTACT:return`person-circle`;case X.LICENSE:return`patch-check`;case X.UPLOAD:return`upload`;case X.INFO:return`info-square`;case X.TAG:return`tag`;case X.TAGS:return`tags`;case X.VERSION:return`award`;case X.EXTENSIONS:case X.EXTENSION:return`plug`;case X.WEBHOOK:case X.WEBHOOKS:return`arrow-clockwise`;case X.NO_EXAMPLE:return`exclamation-circle`;case X.POLYMORPHIC:return`diagram-3`;case X.ERROR:return`x-square`;case X.WARNING:return`exclamation-triangle`;case X.ROLODEX_FOLDER:return`folder`;case X.ROLODEX_FILE:return`journal-code`;case X.JS:return`filetype-js`;case X.PHP:return`filetype-php`;case X.PY:return`filetype-py`;case X.HTML:return`filetype-html`;case X.MD:return`markdown`;case X.JAVA:return`filetype-java`;case X.EXTERNAL_DOCS:return`journals`;case X.RB:return`filetype-rb`;case X.EXPAND_NODE:return`node-plus`;case X.POV_MODE:return`binoculars`;default:return`box`}}openapiIcon(){return this.isLightMode()?`PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogIzAwMDsiLz4KPC9zdmc+`:`PHN2ZyBpZD0icGIzM2Zfb3BlbmFwaSIgZGF0YS1uYW1lPSJwYjMzZl9vcGVuYXBpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3ODQuMzcgNzg0LjI5Ij4KICA8cGF0aCBkPSJNMjA3LjI4LDQ1MC45N0guMzFjLjA0LDEuMDIuMDcsMi4wMy4xMiwzLjAzLjA4LDEuOTUuMjIsMy44OC4zNCw1LjgzLjA1Ljg0LjA5LDEuNjcuMTYsMi41LjE2LDIuMjUuMzUsNC41LjU2LDYuNzMuMDUuNTEuMDksMS4wMi4xNCwxLjUuMjQsMi41LjUxLDQuOTkuOCw3LjQ3LjAxLjI0LjA0LjQ4LjA4LjcyLjMzLDIuNjcuNjcsNS4zNSwxLjA2LDgsMCwuMDQsMCwuMDguMDEuMSwyLjM5LDE2LjU0LDUuOTYsMzIuODgsMTAuNyw0OC45LjAzLjA3LjA1LjEzLjA3LjIuNzUsMi41NCwxLjUzLDUuMDUsMi4zMyw3LjU0LjA1LjE0LjEuMy4xNC40NHMuMDkuMjkuMTQuNDRjLjczLDIuMjYsMS41LDQuNTEsMi4yOCw2Ljc3LjIuNTYuMzksMS4xNC42LDEuNzEuNjksMS45NSwxLjQsMy45LDIuMTMsNS44Ni4zNC44OC42NywxLjc1Ljk5LDIuNjQuNjQsMS42MiwxLjI2LDMuMjMsMS45LDQuODQuNDgsMS4yMi45OCwyLjQzLDEuNDksMy42My41MiwxLjI3LDEuMDUsMi41MSwxLjU4LDMuNzguNjUsMS41NCwxLjM1LDMuMDcsMi4wMyw0LjYyLjQxLjkyLjgyLDEuODIsMS4yMywyLjczLjg0LDEuODQsMS43LDMuNjksMi41OCw1LjUyLjI5LjU5LjU2LDEuMTguODUsMS43NSwxLjAyLDIuMTIsMi4wNSw0LjIsMy4xLDYuMjguMTguMzEuMzMuNjQuNS45NSwxLjE4LDIuMywyLjM4LDQuNTksMy42Miw2Ljg2LjA1LjEuMTIuMi4xNi4zMS4yNi40Ny41NS45My44MSwxLjRsMTc2Ljc2LTEwNi40Ny42NS0uMzljLTYuOTctMTQuNy0xMS4zMS0zMC4zMy0xMi45My00Ni4yMmgwWiIgc3R5bGU9ImZpbGw6ICMzNTllZDM7Ii8+CiAgPHBhdGggZD0iTTI1OC4xNSw1NDUuOTlsLS41LjUtMTQ1Ljc5LDE0NS43N2MuNzUuNjksMS40OSwxLjQxLDIuMjYsMi4wOCwxLjM2LDEuMjQsMi43NSwyLjQ2LDQuMTIsMy42Ny43Mi42MywxLjQxLDEuMjYsMi4xMywxLjg4LDEuNjUsMS40MywzLjMyLDIuODEsNC45OCw0LjIxLjQ2LjM4Ljg5Ljc1LDEuMzUsMS4xMiwyLjEyLDEuNzQsNC4yNiwzLjQ2LDYuNDIsNS4xNSwyLjA3LDEuNjMsNC4xNCwzLjIyLDYuMjYsNC44MS4wOS4wNS4xNi4xLjI0LjE3LDguOCw2LjU3LDE3LjksMTIuNzIsMjcuMjcsMTguNDQuMzEuMjEuNjQuMzkuOTcuNiwxLjc5LDEuMDYsMy41NywyLjEyLDUuMzcsMy4xNmwzLjI5LDEuODhjMS4wNS42LDIuMDgsMS4xOCwzLjEyLDEuNzUsMS45LDEuMDMsMy43OSwyLjA3LDUuNywzLjA3LjI2LjE0LjUyLjI5LjguNDIsNS4zLDIuNzcsMTAuNjgsNS4zNSwxNi4xMiw3LjgzbDUuMTgtMTIuNTcsNzMuMzMtMTc4LjA0LjI2LS42NWMtOC00LjI5LTE1LjY4LTkuMzYtMjIuODktMTUuMjdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik0yNDIuOTcsNTMxLjQ2Yy0xLjU3LTEuNzQtMy4wOC0zLjUzLTQuNTUtNS4zNi0xLjMxLTEuNjEtMi41Ni0zLjIzLTMuNzgtNC44OC0xLjQtMS44OC0yLjc2LTMuNzktNC4wNS01LjczLTEuMjktMS45NS0yLjU4LTMuOTEtMy43OC01LjlsLTE3Ni45OCwxMDYuNmMyLjcyLDQuNTIsNS41NCw4LjkyLDguNDUsMTMuMjYuMDkuMTYuMTguMzEuMjkuNDYuMDMuMDcuMDcuMS4xLjE3LjA5LjEzLjE4LjI5LjI3LjQzLjAxLjAxLjAzLjAzLjAzLjA1LjI0LjM0LjQ3LjY4LjcxLDEuMDMuMDEuMDEuMDMuMDQuMDUuMDdzLjAxLjAxLjAxLjAzYzMuMDcsNC41NCw2LjI0LDkuMDEsOS40OSwxMy4zOC4wNy4wOS4xNC4xOC4yMS4yNy4wOC4wOS4xNC4xOC4yMS4yNywxLjQzLDEuODcsMi44NCwzLjc0LDQuMyw1LjYuMi4yNS4zOC40OC41OS43MiwxLjQ5LDEuOTIsMy4wMiwzLjgyLDQuNTgsNS42OS4zNy40NC43NS44OSwxLjExLDEuMzUsMS40LDEuNjcsMi44LDMuMzMsNC4yMiw0Ljk4LjYxLjcxLDEuMjQsMS40MywxLjg3LDIuMTIsMS4yMiwxLjM5LDIuNDIsMi43NywzLjY2LDQuMTMuNjguNzUsMS4zOSwxLjUsMi4wOCwyLjI1LjMxLjM1LjYzLjY4Ljk1LDEuMDMuOS45OCwxLjgsMS45NiwyLjcyLDIuOTMuMzcuMzguNzYuNzYsMS4xMiwxLjE1LDEuNjEsMS42NywzLjI0LDMuMzYsNC44OSw1LjAxbDE0Ni4wMS0xNDUuOThjLTEuNjctMS42Ny0zLjI0LTMuNC00Ljc5LTUuMTNoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik00MzYuNSw1NDUuOTFjLTEuNjEsMS4yOS0zLjIzLDIuNTYtNC44OCwzLjc4bC4zNS42MSwxMDYuNDYsMTc2LjY4YzQuOTMtMy4yMiw5LjgxLTYuNTQsMTQuNTctMTAuMDMsMTAuMy03LjYsMjAuMjctMTUuODMsMjkuODgtMjQuN2wtMTQ1LjgtMTQ1Ljc3LS41OC0uNThaIiBzdHlsZT0iZmlsbDogIzYyYzRmZjsiLz4KICA8cGF0aCBkPSJNNTIyLjk2LDcyOC40NGwtMy42MS02LTk5LjM3LTE2NC45MmMtMi4wMSwxLjItNC4wNywyLjMtNi4xMiwzLjQtMi4wOCwxLjEyLTQuMTYsMi4xNi02LjI4LDMuMTYtMTkuMDksOS4wNS0zOS43NSwxMy42OC02MC40NSwxMy42OC0xMy41NiwwLTI3LjEtMS45Ni00MC4yMS01Ljg3LTIuMjQtLjY3LTQuNDItMS41NC02LjYyLTIuMzMtMi4yMS0uNzctNC40NS0xLjQ1LTYuNjItMi4zNGwtNzMuMjcsMTc3LjkzLTIuODYsNi45Ny0yLjQ2LDUuOTh2LjAzYy4xNy4wOC4zNy4xNC41NS4yMi4yMS4wOC40MS4xNC42LjI0aC4wM2MuMDUuMDMuMS4wNC4xNC4wNSwxLjczLjcyLDMuNDYsMS4zMiw1LjIsMiwyLjE4Ljg1LDQuMzUsMS43MSw2LjU0LDIuNTEsMS4xMi40MSwyLjIyLjg4LDMuMzMsMS4yN2guMDFjMjIuOTYsOC4xLDQ2LjcxLDEzLjc5LDcwLjg1LDE2Ljk2Ljk1LjEyLDEuODguMjUsMi44NC4zOC45OC4xMiwxLjk3LjIxLDIuOTcuMzMsMS44Ni4yMSwzLjcxLjQyLDUuNTguNmwxLjM5LjEyYzIuMjkuMjIsNC41OC40Miw2Ljg1LjU4Ljc4LjA3LDEuNTcuMDksMi4zNC4xNiwyLC4xMyw0LC4yNSw2LC4zNCwxLjIzLjA4LDIuNDYuMSwzLjY5LjE2LDEuNi4wNSwzLjE4LjEyLDQuNzcuMTcsMi4yOS4wNSw0LjYuMDcsNi45LjA4LjU1LDAsMS4wOS4wMSwxLjYzLjAzLDE5LjI5LDAsMzguNTctMS42MSw1Ny42NS00LjgxLjMxLS4wNS42NC0uMS45Ny0uMTQsMi4wMS0uMzUsNC4wMy0uNzMsNi4wNC0xLjEsMS4xNS0uMjIsMi4zMS0uNDQsMy40NC0uNjcsMS4xOC0uMjUsMi4zNy0uNDgsMy41NC0uNzUsMS45Ni0uNDEsMy45Mi0uODQsNS45LTEuMjkuMzUtLjA4LjcxLS4xNCwxLjA2LS4yNSwyOS02Ljc1LDU3LjAxLTE3LjIxLDgzLjMxLTMxLjA1aDBjMS43My0uOTIsMy40MS0xLjk1LDUuMTMtMi44OSwyLjA0LTEuMTEsNC4wNy0yLjI4LDYuMTEtMy40NCwxLjQtLjgsMi44Mi0xLjU0LDQuMjItMi4zOC4wMS0uMDEuMDMtLjAzLjA0LS4wM2guMDFzLjA0LS4wMy4wNy0uMDRsLjAzLS4wMy0uMjYtLjQzLjI2LjQzcy4wMy0uMDEuMDQtLjAxYy4wMy0uMDEuMDQtLjAzLjA3LS4wNC4wOC0uMDUuMTYtLjA5LjI0LS4xNC40NC0uMjcuOS0uNTQsMS4zNi0uODFsLTMuNTgtNS45OVpNMjU4LjIzLDMyOC4wNWMxLjYxLTEuMzEsMy4yNC0yLjU2LDQuODgtMy43OWwtLjM1LS42LTEwNi40Ni0xNzYuN2MtNC45NCwzLjIzLTkuODIsNi41Ni0xNC41OSwxMC4wNS0xMC4yOSw3LjU4LTIwLjI3LDE1LjgxLTI5Ljg1LDI0LjY2bDE0NS44LDE0NS43OS41OC41OVoiIHN0eWxlPSJmaWxsOiAjMzU5ZWQzOyIvPgogIDxwYXRoIGQ9Ik0xMDEuNzUsMTkxLjM5Yy0xLjY2LDEuNjYtMy4yMywzLjM3LTQuODUsNS4wNS0xLjYxLDEuNjktMy4yNiwzLjM2LTQuODQsNS4wNi0xMC42NCwxMS41MS0yMC41LDIzLjcyLTI5LjUsMzYuNTYtLjQzLjU5LS44NSwxLjIyLTEuMjgsMS44Mi0uOTksMS40Ni0xLjk5LDIuOTItMi45NSw0LjM4LTEuMDIsMS41Mi0yLjAzLDMuMDYtMy4wMSw0LjU5LS4zNy41Ni0uNzMsMS4xNC0xLjA5LDEuN0MyMC43LDMwMy4xNCwyLjczLDM2Mi44LjMxLDQyMi45NmMtLjA5LDIuMzQtLjE0LDQuNjgtLjIsNy4wMS0uMDQsMi4zMy0uMTIsNC42Ny0uMTIsN2gyMDYuNDljMC0yLjMzLjIxLTQuNjUuMzQtNywuMTItMi4zNC4xNC00LjY4LjM4LTcuMDEsMi42Ny0yNi44OCwxMy4wNS01My4xNCwzMS4xNC03NS4xOCwxLjQ2LTEuNzksMy4xMi0zLjQ4LDQuNzEtNS4yLDEuNTYtMS43NCwzLjAyLTMuNTMsNC42OS01LjJMMTAxLjc1LDE5MS4zOVpNNTI3LjgsMTQwLjE0Yy0uMjctLjE3LS41OC0uMzQtLjg1LS41MS0xLjgyLTEuMTEtMy42NS0yLjE4LTUuNDktMy4yNi0xLjA2LS42MS0yLjEzLTEuMjItMy4xOS0xLjgyLTEuMDktLjYtMi4xNC0xLjItMy4yMy0xLjc5LTEuODctMS4wMi0zLjc0LTIuMDMtNS42MS0zLjAzLS4zLS4xNC0uNTktLjMtLjg5LS40Ni0xMi4xMS02LjMzLTI0LjU0LTExLjktMzcuMjQtMTYuNzQtLjMzLS4xMy0uNjUtLjI2LS45OC0uMzgtMi43Ny0xLjAzLTUuNTQtMi4wNy04LjM0LTMuMDMtMjIuNTYtNy44Ny00NS44OC0xMy40LTY5LjU3LTE2LjUxbC0yLjktLjM5Yy0uOTgtLjEyLTEuOTUtLjIxLTIuOTItLjMxLTEuODctLjIyLTMuNzMtLjQzLTUuNjEtLjYxLS41MS0uMDUtMS4wMy0uMDgtMS41Ny0uMTQtMi4yMS0uMi00LjQ1LS4zOS02LjY3LS41NmwtMi42LS4xNmMtMS45LS4xMi0zLjgzLS4yNi01LjczLS4zNC0xLjAyLS4wNS0yLjA0LS4wOS0zLjA1LS4xMnYyMDYuOTdjMTAuNjIsMS4xLDIxLjE0LDMuMzYsMzEuMzUsNi44M2wxNTIuMzQtMTUyLjMxYy01LjY2LTMuOTItMTEuMzgtNy43NC0xNy4yNi0xMS4zMWgwWiIgc3R5bGU9ImZpbGw6ICM2MmM0ZmY7Ii8+CiAgPHBhdGggZD0iTTM0MC4zNyw4OS44Yy0yLjM0LjA1LTQuNjguMDUtNy4wMS4xNC0xNC42LjU5LTI5LjE4LDIuMDgtNDMuNjQsNC41MS0uMzEuMDUtLjYzLjEtLjk1LjE2LTIuMDMuMzUtNC4wNC43Mi02LjA1LDEuMS0xLjE0LjIyLTIuMjkuNDMtMy40NC42NS0xLjE5LjI0LTIuMzcuNDgtMy41Ni43NS0xLjk2LjQxLTMuOTIuODQtNS44NywxLjI5LS4zNy4wNy0uNzIuMTYtMS4wNy4yNC0yOC45OCw2Ljc3LTU2Ljk5LDE3LjIxLTgzLjMzLDMxLjA3LTEuNzEuOTItMy4zOSwxLjk1LTUuMSwyLjg4LTIuMDQsMS4xMi00LjA4LDIuMjgtNi4xMSwzLjQ0LTEuNS44OC0zLjAzLDEuNjctNC41NCwyLjU2LS4wMS4wMS0uMDQuMDMtLjA1LjAzLS4xLjA3LS4yMS4xMy0uMzEuMTgtLjM5LjI1LS44LjQ0LTEuMTkuNjh2LjAzczMuNjMsNiwzLjYzLDZsMTAyLjk3LDE3MC45M2MyLjAxLTEuMiw0LjA3LTIuMzEsNi4xMi0zLjQxLDIuMDctMS4xMSw0LjE2LTIuMTYsNi4yNi0zLjE1LDE0LjU1LTYuOTUsMzAuMTktMTEuMzMsNDYuMjMtMTIuOTYsMi4zMy0uMjQsNC42NS0uNDMsNy0uNTUsMi4zMy0uMTIsNC42Ny0uMjQsNy4wMS0uMjRWODkuNjVjLTIuMzQsMC00LjY3LjEtNywuMTRoMFoiIHN0eWxlPSJmaWxsOiAjZjZmOyIvPgogIDxwYXRoIGQ9Ik02OTQuMyw0MTkuOWMtLjEtMS44Ni0uMjEtMy43LS4zNC01LjU3LS4wNS0uOTItLjExLTEuODUtLjE4LTIuNzctLjE0LTIuMTgtLjMzLTQuMzctLjU0LTYuNTUtLjA0LS41Ni0uMDktMS4xMi0uMTQtMS42OS0uMjQtMi40NS0uNS00Ljg4LS43OC03LjMxLS4wMy0uMi0uMDQtLjM5LS4wNy0uNTlsLS4wNC0uMjdjLS4zMS0yLjYzLS42Ny01LjI2LTEuMDMtNy44N2wtLjA0LS4yNWMtMi4zOC0xNi41LTUuOTUtMzIuODItMTAuNjctNDguODEtLjA0LS4xMi0uMDctLjIxLS4xLS4zMS0uNzUtMi41LTEuNTItNC45Ny0yLjI5LTcuNDQtLjEyLS4zMy0uMjItLjY1LS4zMy0uOTgtLjczLTIuMjQtMS40OC00LjQ2LTIuMjUtNi42OGwtLjYzLTEuOGMtLjY4LTEuOTItMS4zOS0zLjg0LTIuMDktNS43Ny0uMzUtLjkyLS42OS0xLjgzLTEuMDYtMi43My0uNi0xLjYtMS4yMi0zLjE4LTEuODYtNC43NS0uNS0xLjI3LTEuMDEtMi41MS0xLjUyLTMuNzQtLjUxLTEuMjQtMS4wMy0yLjQ2LTEuNTQtMy42OS0uNjgtMS41Ny0xLjM3LTMuMTQtMi4wNy00LjY5LS4zOS0uODgtLjc4LTEuNzctMS4xOS0yLjY1LS44NS0xLjg2LTEuNzMtMy43My0yLjYtNS41OC0uMjctLjU1LS41NS0xLjEyLS44Mi0xLjY5LTEuMDItMi4xMi0yLjA3LTQuMjUtMy4xNC02LjM0LS4xNC0uMjktLjMtLjU5LS40NC0uODgtMS4xOS0yLjMxLTIuNDItNC42NC0zLjY1LTYuOTMtLjA1LS4wOC0uMDktLjE3LS4xNC0uMjUtNi0xMS4wMy0xMi42LTIxLjc0LTE5Ljc2LTMyLjA2bC0xNTIuMzgsMTUyLjM4YzMuNDYsMTAuMjEsNS43MSwyMC43NCw2LjgxLDMxLjM0aDIwN2MtLjA1LTEuMDMtLjA4LTIuMDctLjEzLTMuMDdoMFoiIHN0eWxlPSJmaWxsOiAjNjJjNGZmOyIvPgogIDxwYXRoIGQ9Ik00ODguMjQsNDM2Ljk3YzAsMi4zNC0uMjIsNC42Ny0uMzQsNy4wMXMtLjE2LDQuNjgtLjM5LDdjLTIuNjcsMjYuOS0xMy4wNCw1My4xNS0zMS4xMyw3NS4yMS0xLjQ2LDEuNzktMy4xMiwzLjQ2LTQuNzEsNS4yLTEuNTcsMS43My0zLjAyLDMuNTItNC42OSw1LjE5bDE0Ni4wMSwxNDUuOThjMS42Ni0xLjY2LDMuMjItMy4zNyw0Ljg0LTUuMDZzMy4yNy0zLjM1LDQuODQtNS4wNmMxMC44LTExLjcsMjAuNjgtMjMuOTQsMjkuNTgtMzYuNjYuMzctLjUxLjY5LTEuMDEsMS4wNS0xLjUsMS4wOS0xLjU2LDIuMTMtMy4xNCwzLjItNC43MS45My0xLjQxLDEuODYtMi44MSwyLjc2LTQuMjQuNDYtLjY4LjktMS4zOSwxLjMzLTIuMDcsMzMuNDktNTIuNTcsNTEuNDEtMTEyLjE3LDUzLjgyLTE3Mi4yOS4wOS0yLjMzLjE0LTQuNjcuMTgtNy4wMS4wNS0yLjMzLjEyLTQuNjUuMTItN2gtMjA2LjQ2WiIgc3R5bGU9ImZpbGw6ICNmNmY7Ii8+CiAgPHBhdGggZD0iTTc1Ni4wNCwyOC4zM2MtMzcuNzctMzcuNzctOTkuMDItMzcuNzctMTM2Ljc5LDAtMzAuMTQsMzAuMTItMzYuMTcsNzUuMTctMTguMjEsMTExLjMzbC0yMTAuNzIsMjEwLjdjLTM2LjE3LTE3Ljk0LTgxLjIyLTExLjkyLTExMS4zNiwxOC4yLTM3Ljc3LDM3Ljc3LTM3Ljc2LDk5LjAyLDAsMTM2Ljc5LDM3Ljc5LDM3Ljc3LDk5LjA0LDM3Ljc2LDEzNi44MiwwLDMwLjE0LTMwLjE0LDM2LjE1LTc1LjE4LDE4LjItMTExLjM1bDIxMC43Mi0yMTAuNjljMzYuMTgsMTcuOTQsODEuMjEsMTEuOTIsMTExLjM1LTE4LjIxLDM3Ljc3LTM3Ljc2LDM3Ljc3LTk5LDAtMTM2Ljc4aDBaIiBzdHlsZT0iZmlsbDogI2ZmZjsiLz4KPC9zdmc+`}goIcon(){return`Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIuMDAwMDAxIj4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMDIwLjM2MjIpIj4KICAgIDxlbGxpcHNlIGN4PSItOTA3LjM1NjU3IiBjeT0iNDc5LjkwMDA5IiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0ic2NhbGUoLTEgMSkgcm90YXRlKC02MC41NDgpIi8+CiAgICA8ZWxsaXBzZSBjeD0iLTg5MS41NzY1NCIgY3k9IjUwNy44NDYxIiBmaWxsPSIjMzg0ZTU0IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ4PSIzLjU3OTM5OTYiIHJ5PSIzLjgyMDc5NTMiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIHRyYW5zZm9ybT0icm90YXRlKC02MC41NDgpIi8+CiAgICA8cGF0aCBmaWxsPSIjMzg0ZTU0IiBkPSJNMTYuMDkxNjkzIDEwMjEuMzY0MmMtMS4xMDU3NDkuMDEtMi4yMTAzNDEuMDQ5LTMuMzE2MDkuMDlDNi44NDIyNTU4IDEwMjEuNjczOCAyIDEwMjYuMzk0MiAyIDEwMzIuMzYyMnYyMGgyOHYtMjBjMC01Ljk2ODMtNC42NjczNDUtMTAuNDkxMi0xMC41OTAyMy0xMC45MDgtMS4xMDU3NS0uMDc4LTIuMjEyMzI4LS4wOTktMy4zMTgwNzctLjA5eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNNC42MDc4ODY3IDEwMjUuMDQ2MmMuNDU5NTY0LjI1OTUgMS44MTgyNjIgMS4yMDEzIDEuOTgwOTgzIDEuNjQ4LjE4MzQwMS41MDM1LjE1OTM4NSAxLjA2NTctLjExNDYxNCAxLjU1MS0uMzQ2NjI3LjYxMzgtMS4wMDUzNDEuOTQ4Ny0xLjY5NjQyMS45MzY1LS4zMzk4ODYtLjAxLTEuNzIwMjgzLS42MzcyLTIuMDQyNTYxLS44MTkyLS45Nzc1NC0uNTUxOS0xLjM1MDc5NS0xLjc0MTgtLjgzMzY4Ni0yLjY1NzYuNTE3MTA5LS45MTU4IDEuNzI4NzQ5LTEuMjEwNyAyLjcwNjI5OS0uNjU4N3oiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuMDg2NjY1OSIgaGVpZ2h0PSIzLjUzMTM2NjMiIHg9IjE0LjQwNjIxMyIgeT0iMTAzNS42ODQyIiBmaWxsLW9wYWNpdHk9Ii4zMjg1MDI0NiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiByeT0iLjYyNDI2MzI5IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMTYgMTAyMy4zNjIyYy05IDAtMTIgMy43MTUzLTEyIDl2MjBoMjRjLS4wNDg4OS03LjM1NjIgMC0xOCAwLTIwIDAtNS4yODQ4LTMtOS0xMi05eiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjNzZlMWZlIiBkPSJNMjcuMDc0MDczIDEwMjUuMDQ2MmMtLjQ1OTU3LjI1OTUtMS44MTgyNTcgMS4yMDEzLTEuOTgwOTc5IDEuNjQ4LS4xODM0MDEuNTAzNS0uMTU5Mzg0IDEuMDY1Ny4xMTQ2MTQgMS41NTEuMzQ2NjI3LjYxMzggMS4wMDUzMzUuOTQ4NyAxLjY5NjQxNS45MzY1LjMzOTg4LS4wMSAxLjcyMDI5LS42MzcyIDIuMDQyNTYtLjgxOTIuOTc3NTQtLjU1MTkgMS4zNTA3OS0xLjc0MTguODMzNjktMi42NTc2LS41MTcxMS0uOTE1OC0xLjcyODc2LTEuMjEwNy0yLjcwNjMtLjY1ODd6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjIxLjE3NTczNCIgY3k9IjEwMzAuMzU0MiIgcj0iNC42NTM3NTQyIiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxjaXJjbGUgY3g9IjEwLjMzOTQ4NiIgY3k9IjEwMzAuMzU0MiIgcj0iNC44MzE2MzQ1IiBmaWxsPSIjZmZmIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxyZWN0IHdpZHRoPSIzLjY2NzM2ODciIGhlaWdodD0iNC4xMDYzNDA5IiB4PSIxNC4xMTU4NjMiIHk9IjEwMzUuOTE3NCIgZmlsbC1vcGFjaXR5PSIuMzI5NDExNzYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcnk9Ii43MjU5MDUzNiIgc3R5bGU9Imlzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzb2xpZC1jb2xvcjojMDAwO3NvbGlkLW9wYWNpdHk6MSIvPgogICAgPHJlY3Qgd2lkdGg9IjMuNjY3MzY4NyIgaGVpZ2h0PSI0LjEwNjM0MDkiIHg9IjE0LjExNTg2MyIgeT0iMTAzNS4yMjUzIiBmaWxsPSIjZmZmY2ZiIiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHJ5PSIuNzI1OTA1MzYiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjMyOTQxMTc2IiBkPSJNMTkuOTk5NzM1IDEwMzYuNTI4OWMwIC44MzgtLjg3MTIyOCAxLjI2ODItMi4xNDQ3NjYgMS4xNjU5LS4wMjM2NiAwLS4wNDc5NS0uNjAwNC0uMjU0MTQ3LS41ODMyLS41MDM2NjkuMDQyLTEuMDk1OTAyLS4wMi0xLjY4NTk2NC0uMDItLjYxMjkzOSAwLTEuMjA2MzQyLjE4MjYtMS42ODU0OS4wMTctLjExMDIzMy0uMDM4LS4xNzgyOTguNTgzOC0uMjYxNTMyLjU4MTYtMS4yNDM2ODUtLjAzMy0yLjA3ODgwMy0uMzM4My0yLjA3ODgwMy0xLjE2MTggMC0xLjIxMTggMS44MTU2MzUtMi4xOTQxIDQuMDU1MzUxLTIuMTk0MSAyLjIzOTcwNCAwIDQuMDU1MzUxLjk4MjMgNC4wNTUzNTEgMi4xOTQxeiIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSIjYzM4Yzc0IiBkPSJNMTkuOTc3NDE0IDEwMzUuNzAwNGMwIC41Njg1LS40MzM2NTkuODU1NC0xLjEzODA5MSAxLjAwMDEtLjI5MTkzMy4wNi0uNjMwMzcxLjA5Ni0xLjAwMzcxOS4xMTY2LS41NjQwNS4wMzItMS4yMDc3ODIuMDMxLTEuODkxMjIuMDMxLS42NzI4MzQgMC0xLjMwNzE4MiAwLTEuODY0OTA0LS4wMjktLjMwNjI2OC0uMDE3LS41ODk0MjktLjA0My0uODQzMTY0LS4wODQtLjgxMzgzMy0uMTMxOC0xLjMyNDk2Mi0uNDE3LTEuMzI0OTYyLTEuMDM0NCAwLTEuMTYwMSAxLjgwNTY0Mi0yLjEwMDYgNC4wMzMwMy0yLjEwMDYgMi4yMjczNzcgMCA0LjAzMzAzLjk0MDUgNC4wMzMwMyAyLjEwMDZ6IiBjb2xvcj0iIzAwMCIgb3ZlcmZsb3c9InZpc2libGUiIHN0eWxlPSJpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiLz4KICAgIDxlbGxpcHNlIGN4PSIxNS45NDQzODIiIGN5PSIxMDMzLjg1MDEiIGZpbGw9IiMyMzIwMWYiIGNvbG9yPSIjMDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgcng9IjIuMDgwMTczMyIgcnk9IjEuMzQzNzQ3IiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIxMi40MTQyMDEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8Y2lyY2xlIGN4PSIyMy4xMTAxMjEiIGN5PSIxMDMwLjM1NDIiIHI9IjEuOTYzMDYzNCIgZmlsbD0iIzE3MTMxMSIgY29sb3I9IiMwMDAiIG92ZXJmbG93PSJ2aXNpYmxlIiBzdHlsZT0iaXNvbGF0aW9uOmF1dG87bWl4LWJsZW5kLW1vZGU6bm9ybWFsO3NvbGlkLWNvbG9yOiMwMDA7c29saWQtb3BhY2l0eToxIi8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMzODRlNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIuMzk3MzA4NzQiIGQ9Ik01LjAwNTUzNzcgMTAyNy4yNzI3Yy0xLjE3MDQzNS0xLjA4MzUtMi4wMjY5NzMtLjc3MjEtMi4wNDQxNzItLjc0NjMiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM4NGU1NCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9Ii4zOTczMDg3NCIgZD0iTTQuMzg1MjQ1NyAxMDI2LjkxNTJjLTEuMTU4NTU3LjAzNi0xLjM0NjcwNC42MzAzLTEuMzM4ODEuNjUyM20yMy41ODQwOTczLS4zOTUxYzEuMTcwNDMtMS4wODM1IDIuMDI2OTctLjc3MjEgMi4wNDQxNy0uNzQ2MyIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzg0ZTU0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iLjM5NzMwODc0IiBkPSJNMjcuMzIxNzczIDEwMjYuNjczYzEuMTU4NTYuMDM2IDEuMzQ2Ny42MzAyIDEuMzM4OC42NTIyIi8+CiAgPC9nPgo8L3N2Zz4=`}typescriptIcon(){return`CjxzdmcgZmlsbD0ibm9uZSIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiMzMTc4YzYiIGhlaWdodD0iNTEyIiByeD0iNTAiIHdpZHRoPSI1MTIiLz48cmVjdCBmaWxsPSIjMzE3OGM2IiBoZWlnaHQ9IjUxMiIgcng9IjUwIiB3aWR0aD0iNTEyIi8+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJtMzE2LjkzOSA0MDcuNDI0djUwLjA2MWM4LjEzOCA0LjE3MiAxNy43NjMgNy4zIDI4Ljg3NSA5LjM4NnMyMi44MjMgMy4xMjkgMzUuMTM1IDMuMTI5YzExLjk5OSAwIDIzLjM5Ny0xLjE0NyAzNC4xOTYtMy40NDIgMTAuNzk5LTIuMjk0IDIwLjI2OC02LjA3NSAyOC40MDYtMTEuMzQyIDguMTM4LTUuMjY2IDE0LjU4MS0xMi4xNSAxOS4zMjgtMjAuNjVzNy4xMjEtMTkuMDA3IDcuMTIxLTMxLjUyMmMwLTkuMDc0LTEuMzU2LTE3LjAyNi00LjA2OS0yMy44NTdzLTYuNjI1LTEyLjkwNi0xMS43MzgtMTguMjI1Yy01LjExMi01LjMxOS0xMS4yNDItMTAuMDkxLTE4LjM4OS0xNC4zMTVzLTE1LjIwNy04LjIxMy0yNC4xOC0xMS45NjdjLTYuNTczLTIuNzEyLTEyLjQ2OC01LjM0NS0xNy42ODUtNy45LTUuMjE3LTIuNTU2LTkuNjUxLTUuMTYzLTEzLjMwMy03LjgyMi0zLjY1Mi0yLjY2LTYuNDY5LTUuNDc2LTguNDUxLTguNDQ4LTEuOTgyLTIuOTczLTIuOTc0LTYuMzM2LTIuOTc0LTEwLjA5MSAwLTMuNDQxLjg4Ny02LjU0NCAyLjY2MS05LjMwOHM0LjI3OC01LjEzNiA3LjUxMi03LjExOGMzLjIzNS0xLjk4MSA3LjE5OS0zLjUyIDExLjg5NC00LjYxNSA0LjY5Ni0xLjA5NSA5LjkxMi0xLjY0MiAxNS42NTEtMS42NDIgNC4xNzMgMCA4LjU4MS4zMTMgMTMuMjI0LjkzOCA0LjY0My42MjYgOS4zMTIgMS41OTEgMTQuMDA4IDIuODk0IDQuNjk1IDEuMzA0IDkuMjU5IDIuOTQ3IDEzLjY5NCA0LjkyOCA0LjQzNCAxLjk4MiA4LjUyOSA0LjI3NiAxMi4yODUgNi44ODR2LTQ2Ljc3NmMtNy42MTYtMi45Mi0xNS45MzctNS4wODQtMjQuOTYyLTYuNDkycy0xOS4zODEtMi4xMTItMzEuMDY2LTIuMTEyYy0xMS44OTUgMC0yMy4xNjMgMS4yNzgtMzMuODA1IDMuODMzcy0yMC4wMDYgNi41NDQtMjguMDkzIDExLjk2N2MtOC4wODYgNS40MjQtMTQuNDc2IDEyLjMzMy0xOS4xNzEgMjAuNzI5LTQuNjk1IDguMzk1LTcuMDQzIDE4LjQzMy03LjA0MyAzMC4xMTQgMCAxNC45MTQgNC4zMDQgMjcuNjM4IDEyLjkxMiAzOC4xNzIgOC42MDcgMTAuNTMzIDIxLjY3NSAxOS40NSAzOS4yMDQgMjYuNzUxIDYuODg2IDIuODE2IDEzLjMwMyA1LjU3OSAxOS4yNSA4LjI5MXMxMS4wODYgNS41MjggMTUuNDE1IDguNDQ4YzQuMzMgMi45MiA3Ljc0NyA2LjEwMSAxMC4yNTIgOS41NDMgMi41MDQgMy40NDEgMy43NTYgNy4zNTIgMy43NTYgMTEuNzMzIDAgMy4yMzMtLjc4MyA2LjIzMS0yLjM0OCA4Ljk5NXMtMy45MzkgNS4xNjItNy4xMjEgNy4xOTYtNy4xNDcgMy42MjQtMTEuODk0IDQuNzcxYy00Ljc0OCAxLjE0OC0xMC4zMDMgMS43MjEtMTYuNjY4IDEuNzIxLTEwLjg1MSAwLTIxLjU5Ny0xLjkwMy0zMi4yNC01LjcxLTEwLjY0Mi0zLjgwNi0yMC41MDItOS41MTYtMjkuNTc5LTE3LjEzem0tODQuMTU5LTEyMy4zNDJoNjQuMjJ2LTQxLjA4MmgtMTc5djQxLjA4Mmg2My45MDZ2MTgyLjkxOGg1MC44NzR6IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=`}csIcon(){return`Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHdpZHRoPSIyMDQuOCIKICAgaGVpZ2h0PSIyMDQuOCIKICAgdmlld0JveD0iMCAwIDU0LjE4NjY2NiA1NC4xODY2NjciCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImEiCiAgICAgICB4MT0iNDYuNzczIgogICAgICAgeDI9IjY5LjkwNyIKICAgICAgIHkxPSI4Ni40NjIiCiAgICAgICB5Mj0iMTI2LjczMiIKICAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzMy45ODMgLTUxOC45NzQpIHNjYWxlKDguNzg5OTYpIgogICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcAogICAgICAgICBzdG9wLWNvbG9yPSIjOTI3QkU1IgogICAgICAgICBpZD0ic3RvcDEiIC8+CiAgICAgIDxzdG9wCiAgICAgICAgIG9mZnNldD0iMSIKICAgICAgICAgc3RvcC1jb2xvcj0iIzUxMkJENCIKICAgICAgICAgaWQ9InN0b3AyIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxmaWx0ZXIKICAgICAgIGlkPSJiIgogICAgICAgd2lkdGg9IjQyLjg0NSIKICAgICAgIGhlaWdodD0iMzkuMTM2IgogICAgICAgeD0iNDQuNjI5IgogICAgICAgeT0iOTEuODkiCiAgICAgICBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiCiAgICAgICBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8ZmVGbG9vZAogICAgICAgICBmbG9vZC1vcGFjaXR5PSIwIgogICAgICAgICByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgaWQ9ImZlRmxvb2QyIiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MiIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGlkPSJmZU9mZnNldDIiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgzIiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIGlkPSJmZUJsZW5kMyIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgaW49IlNvdXJjZUFscGhhIgogICAgICAgICByZXN1bHQ9ImhhcmRBbHBoYSIKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIgogICAgICAgICBpZD0iZmVDb2xvck1hdHJpeDQiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMSIKICAgICAgICAgaWQ9ImZlT2Zmc2V0NCIgLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMi40OTkiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjQiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg1IiAvPgogICAgICA8ZmVCbGVuZAogICAgICAgICBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yMDM3XzI4MDAiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgcmVzdWx0PSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBpZD0iZmVCbGVuZDUiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIGluPSJTb3VyY2VBbHBoYSIKICAgICAgICAgcmVzdWx0PSJoYXJkQWxwaGEiCiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXg2IiAvPgogICAgICA8ZmVPZmZzZXQKICAgICAgICAgZHk9IjQiCiAgICAgICAgIGlkPSJmZU9mZnNldDYiIC8+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBzdGREZXZpYXRpb249IjIiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjYiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA5IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4NyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QyX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0M19kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ3IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OCIgLz4KICAgICAgPGZlT2Zmc2V0CiAgICAgICAgIGR5PSI5IgogICAgICAgICBpZD0iZmVPZmZzZXQ4IiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIyLjUiCiAgICAgICAgIGlkPSJmZUdhdXNzaWFuQmx1cjgiIC8+CiAgICAgIDxmZUNvbG9yTWF0cml4CiAgICAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgICAgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA1IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4OSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3QzX2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NF9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgICA8ZmVDb2xvck1hdHJpeAogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iaGFyZEFscGhhIgogICAgICAgICB0eXBlPSJtYXRyaXgiCiAgICAgICAgIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiCiAgICAgICAgIGlkPSJmZUNvbG9yTWF0cml4MTAiIC8+CiAgICAgIDxmZU9mZnNldAogICAgICAgICBkeT0iMTUiCiAgICAgICAgIGlkPSJmZU9mZnNldDEwIiAvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIKICAgICAgICAgc3RkRGV2aWF0aW9uPSIzIgogICAgICAgICBpZD0iZmVHYXVzc2lhbkJsdXIxMCIgLz4KICAgICAgPGZlQ29sb3JNYXRyaXgKICAgICAgICAgdHlwZT0ibWF0cml4IgogICAgICAgICB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDEgMCIKICAgICAgICAgaWQ9ImZlQ29sb3JNYXRyaXgxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW4yPSJlZmZlY3Q0X2Ryb3BTaGFkb3dfMjAzN18yODAwIgogICAgICAgICBtb2RlPSJub3JtYWwiCiAgICAgICAgIHJlc3VsdD0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgaWQ9ImZlQmxlbmQxMSIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iZWZmZWN0NV9kcm9wU2hhZG93XzIwMzdfMjgwMCIKICAgICAgICAgbW9kZT0ibm9ybWFsIgogICAgICAgICByZXN1bHQ9InNoYXBlIgogICAgICAgICBpZD0iZmVCbGVuZDEyIiAvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxwYXRoCiAgICAgZD0iTTEzNS43MzEgMjg1Ljg1djE3My45M2MwIDIxLjUxNyAxMS40NzggNDEuNDE4IDMwLjEyNSA1Mi4xNjhsMTUwLjYyNCA4Ni45NzZhNjAuMjIzIDYwLjIyMyAwIDAgMCA2MC4yNSAwbDE1MC42MjMtODYuOTc2YTYwLjIzNyA2MC4yMzcgMCAwIDAgMzAuMTI0LTUyLjE2OVYyODUuODUxYzAtMjEuNTI1LTExLjQ3Ny00MS40MjMtMzAuMTI0LTUyLjE3N0wzNzYuNzI5IDE0Ni43MmE2MC4yMSA2MC4yMSAwIDAgMC02MC4yNDkgMGwtMTUwLjYyNCA4Ni45NTRhNjAuMjQ1IDYwLjI0NSAwIDAgMC0zMC4xMjUgNTIuMTc3eiIKICAgICBmaWxsPSJ1cmwoI2EpIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KC4xIDAgMCAuMSAtNy41NjcgLTEwLjE4OSkiCiAgICAgaWQ9InBhdGgxMiIgLz4KICA8cGF0aAogICAgIGQ9Ik01NC4wNTYgOTguMDN2Ni44NTVhMS43MTEgMS43MTEgMCAwIDAgMS43MTQgMS43MTQgMS43MTMgMS43MTMgMCAwIDAgMS43MTQtMS43MTQgMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMCA1LjE0IDUuMTQgMCAxIDEtMTAuMjgyIDB2LTYuODU0YTUuMTQgNS4xNCAwIDEgMSAxMC4yODIgMCAxLjcxMiAxLjcxMiAwIDEgMS0zLjQyNyAwIDEuNzEyIDEuNzEyIDAgMSAwLTMuNDI3IDB6bTI3LjQxOCA2Ljg1NWExLjcxMiAxLjcxMiAwIDAgMS0xLjcxNCAxLjcxNGgtMS43MTR2MS43MTNjMCAuNDU1LS4xOC44OTEtLjUwMiAxLjIxMmExLjcxIDEuNzEgMCAwIDEtMi40MjMgMCAxLjcxOSAxLjcxOSAwIDAgMS0uNTAyLTEuMjEydi0xLjcxM2gtMy40Mjd2MS43MTNhMS43MSAxLjcxIDAgMCAxLTEuNzE0IDEuNzE0IDEuNzEgMS43MSAwIDAgMS0xLjcxMy0xLjcxNHYtMS43MTNINjYuMDVhMS43MTMgMS43MTMgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMy40MjdINjYuMDVhMS43MTIgMS43MTIgMCAxIDEgMC0zLjQyN2gxLjcxNHYtMS43MTRhMS43MTMgMS43MTMgMCAxIDEgMy40MjcgMHYxLjcxM2gzLjQyN3YtMS43MTNhMS43MTIgMS43MTIgMCAxIDEgMy40MjcgMHYxLjcxM2gxLjcxNGMuNDU0IDAgLjg5LjE4IDEuMjExLjUwMmExLjcxIDEuNzEgMCAwIDEgMCAyLjQyMyAxLjcxMiAxLjcxMiAwIDAgMS0xLjIxMS41MDNoLTEuNzE0djMuNDI3aDEuNzE0YTEuNzE4IDEuNzE4IDAgMCAxIDEuNzE0IDEuNzEzem0tNi44NTUtNS4xNGgtMy40Mjd2My40MjdoMy40Mjd6IgogICAgIGZpbGw9IiNmZmYiCiAgICAgZmlsdGVyPSJ1cmwoI2IpIgogICAgIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTpzY3JlZW4iCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoLjg3OSAwIDAgLjg3OSAtMzAuOTY1IC02Mi4wODYpIgogICAgIGlkPSJwYXRoMTMiIC8+Cjwvc3ZnPgo=`}cIcon(){return`Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIKICAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHZpZXdCb3g9IjAgMCAzOC4wMDAwODkgNDIuMDAwMDMxIgogICB3aWR0aD0iMzgwLjAwMDg5IgogICBoZWlnaHQ9IjQyMC4wMDAzMSIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnMTAiCiAgIHNvZGlwb2RpOmRvY25hbWU9Imljb25zOC1jLXByb2dyYW1taW5nLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wLjEgKDNiYzJlODEzZjUsIDIwMjAtMDktMDcpIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExNiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczE0IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDU2IgogICAgIGlkPSJuYW1lZHZpZXcxMiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgZml0LW1hcmdpbi10b3A9IjAiCiAgICAgZml0LW1hcmdpbi1sZWZ0PSIwIgogICAgIGZpdC1tYXJnaW4tcmlnaHQ9IjAiCiAgICAgZml0LW1hcmdpbi1ib3R0b209IjAiCiAgICAgaW5rc2NhcGU6em9vbT0iMS40ODk1ODMzIgogICAgIGlua3NjYXBlOmN4PSIxOTAiCiAgICAgaW5rc2NhcGU6Y3k9IjIxMC4wMDI4MiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEwIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzI4MzU5MyIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAxNy45MDMsMC4yODYyODE2NiBjIDAuNjc5LC0wLjM4MSAxLjUxNSwtMC4zODEgMi4xOTMsMCBDIDIzLjQ1MSwyLjE2OTI4MTcgMzMuNTQ3LDcuODM3MjgxNyAzNi45MDMsOS43MjAyODE3IDM3LjU4MiwxMC4xMDAyODIgMzgsMTAuODA0MjgyIDM4LDExLjU2NjI4MiBjIDAsMy43NjYgMCwxNS4xMDEgMCwxOC44NjcgMCwwLjc2MiAtMC40MTgsMS40NjYgLTEuMDk3LDEuODQ3IC0zLjM1NSwxLjg4MyAtMTMuNDUxLDcuNTUxIC0xNi44MDcsOS40MzQgLTAuNjc5LDAuMzgxIC0xLjUxNSwwLjM4MSAtMi4xOTMsMCAtMy4zNTUsLTEuODgzIC0xMy40NTEsLTcuNTUxIC0xNi44MDcsLTkuNDM0IC0wLjY3OCwtMC4zODEgLTEuMDk2LC0xLjA4NCAtMS4wOTYsLTEuODQ2IDAsLTMuNzY2IDAsLTE1LjEwMSAwLC0xOC44NjcgMCwtMC43NjIgMC40MTgsLTEuNDY2IDEuMDk3LC0xLjg0NzAwMDMgMy4zNTQsLTEuODgzIDEzLjQ1MiwtNy41NTEgMTYuODA2LC05LjQzNDAwMDA0IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoMiIKICAgICBzdHlsZT0iZmlsbDojMDA0NDgyO2ZpbGwtb3BhY2l0eToxIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iIzVjNmJjMCIKICAgICBmaWxsLXJ1bGU9ImV2ZW5vZGQiCiAgICAgZD0ibSAwLjMwNCwzMS40MDQyODIgYyAtMC4yNjYsLTAuMzU2IC0wLjMwNCwtMC42OTQgLTAuMzA0LC0xLjE0OSAwLC0zLjc0NCAwLC0xNS4wMTQgMCwtMTguNzU5IDAsLTAuNzU4IDAuNDE3LC0xLjQ1OCAxLjA5NCwtMS44MzYwMDAzIDMuMzQzLC0xLjg3MiAxMy40MDUsLTcuNTA3IDE2Ljc0OCwtOS4zODAwMDAwNCAwLjY3NywtMC4zNzkgMS41OTQsLTAuMzcxIDIuMjcxLDAuMDA4IDMuMzQzLDEuODcyMDAwMDQgMTMuMzcxLDcuNDU5MDAwMDQgMTYuNzE0LDkuMzMxMDAwMDQgMC4yNywwLjE1MiAwLjQ3NiwwLjMzNSAwLjY2LDAuNTc2MDAwMyB6IgogICAgIGNsaXAtcnVsZT0iZXZlbm9kZCIKICAgICBpZD0icGF0aDQiCiAgICAgc3R5bGU9ImZpbGw6IzY1OWFkMjtmaWxsLW9wYWNpdHk6MSIgLz4KICA8cGF0aAogICAgIGZpbGw9IiNmZmZmZmYiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMTksNy4wMDAyODE3IGMgNy43MjcsMCAxNCw2LjI3MzAwMDMgMTQsMTQuMDAwMDAwMyAwLDcuNzI3IC02LjI3MywxNCAtMTQsMTQgLTcuNzI3LDAgLTE0LC02LjI3MyAtMTQsLTE0IDAsLTcuNzI3IDYuMjczLC0xNC4wMDAwMDAzIDE0LC0xNC4wMDAwMDAzIHogbSAwLDcuMDAwMDAwMyBjIDMuODYzLDAgNywzLjEzNiA3LDcgMCwzLjg2MyAtMy4xMzcsNyAtNyw3IC0zLjg2MywwIC03LC0zLjEzNyAtNywtNyAwLC0zLjg2NCAzLjEzNiwtNyA3LC03IHoiCiAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgIGlkPSJwYXRoNiIgLz4KICA8cGF0aAogICAgIGZpbGw9IiMzOTQ5YWIiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIgogICAgIGQ9Im0gMzcuNDg1LDEwLjIwNTI4MiBjIDAuNTE2LDAuNDgzIDAuNTA2LDEuMjExIDAuNTA2LDEuNzg0IDAsMy43OTUgLTAuMDMyLDE0LjU4OSAwLjAwOSwxOC4zODQgMC4wMDQsMC4zOTYgLTAuMTI3LDAuODEzIC0wLjMyMywxLjEyNyBsIC0xOS4wODQsLTEwLjUgeiIKICAgICBjbGlwLXJ1bGU9ImV2ZW5vZGQiCiAgICAgaWQ9InBhdGg4IgogICAgIHN0eWxlPSJmaWxsOiMwMDU5OWM7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo=`}cppIcon(){return`Cjw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9InV0Zi04Ij8+CjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iMzA2cHgiIGhlaWdodD0iMzQ0LjM1cHgiIHZpZXdCb3g9IjAgMCAzMDYgMzQ0LjM1IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzMDYgMzQ0LjM1IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZmlsbD0iIzAwNTk5QyIgZD0iTTMwMi4xMDcsMjU4LjI2MmMyLjQwMS00LjE1OSwzLjg5My04Ljg0NSwzLjg5My0xMy4wNTNWOTkuMTRjMC00LjIwOC0xLjQ5LTguODkzLTMuODkyLTEzLjA1MkwxNTMsMTcyLjE3NQoJTDMwMi4xMDcsMjU4LjI2MnoiLz4KPHBhdGggZmlsbD0iIzAwNDQ4MiIgZD0iTTE2Ni4yNSwzNDEuMTkzbDEyNi41LTczLjAzNGMzLjY0NC0yLjEwNCw2Ljk1Ni01LjczNyw5LjM1Ny05Ljg5N0wxNTMsMTcyLjE3NUwzLjg5MywyNTguMjYzCgljMi40MDEsNC4xNTksNS43MTQsNy43OTMsOS4zNTcsOS44OTZsMTI2LjUsNzMuMDM0QzE0Ny4wMzcsMzQ1LjQwMSwxNTguOTYzLDM0NS40MDEsMTY2LjI1LDM0MS4xOTN6Ii8+CjxwYXRoIGZpbGw9IiM2NTlBRDIiIGQ9Ik0zMDIuMTA4LDg2LjA4N2MtMi40MDItNC4xNi01LjcxNS03Ljc5My05LjM1OC05Ljg5N0wxNjYuMjUsMy4xNTZjLTcuMjg3LTQuMjA4LTE5LjIxMy00LjIwOC0yNi41LDAKCUwxMy4yNSw3Ni4xOUM1Ljk2Miw4MC4zOTcsMCw5MC43MjUsMCw5OS4xNHYxNDYuMDY5YzAsNC4yMDgsMS40OTEsOC44OTQsMy44OTMsMTMuMDUzTDE1MywxNzIuMTc1TDMwMi4xMDgsODYuMDg3eiIvPgo8Zz4KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xNTMsMjc0LjE3NWMtNTYuMjQzLDAtMTAyLTQ1Ljc1Ny0xMDItMTAyczQ1Ljc1Ny0xMDIsMTAyLTEwMmMzNi4yOTIsMCw3MC4xMzksMTkuNTMsODguMzMxLDUwLjk2OAoJCWwtNDQuMTQzLDI1LjU0NGMtOS4xMDUtMTUuNzM2LTI2LjAzOC0yNS41MTItNDQuMTg4LTI1LjUxMmMtMjguMTIyLDAtNTEsMjIuODc4LTUxLDUxYzAsMjguMTIxLDIyLjg3OCw1MSw1MSw1MQoJCWMxOC4xNTIsMCwzNS4wODUtOS43NzYsNDQuMTkxLTI1LjUxNWw0NC4xNDMsMjUuNTQzQzIyMy4xNDIsMjU0LjY0NCwxODkuMjk0LDI3NC4xNzUsMTUzLDI3NC4xNzV6Ii8+CjwvZz4KPGc+Cgk8cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjI1NSwxNjYuNTA4IDI0My42NjYsMTY2LjUwOCAyNDMuNjY2LDE1NS4xNzUgMjMyLjMzNCwxNTUuMTc1IDIzMi4zMzQsMTY2LjUwOCAyMjEsMTY2LjUwOCAKCQkyMjEsMTc3Ljg0MSAyMzIuMzM0LDE3Ny44NDEgMjMyLjMzNCwxODkuMTc1IDI0My42NjYsMTg5LjE3NSAyNDMuNjY2LDE3Ny44NDEgMjU1LDE3Ny44NDEgCSIvPgo8L2c+CjxnPgoJPHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIyOTcuNSwxNjYuNTA4IDI4Ni4xNjYsMTY2LjUwOCAyODYuMTY2LDE1NS4xNzUgMjc0LjgzNCwxNTUuMTc1IDI3NC44MzQsMTY2LjUwOCAyNjMuNSwxNjYuNTA4IAoJCTI2My41LDE3Ny44NDEgMjc0LjgzNCwxNzcuODQxIDI3NC44MzQsMTg5LjE3NSAyODYuMTY2LDE4OS4xNzUgMjg2LjE2NiwxNzcuODQxIDI5Ny41LDE3Ny44NDEgCSIvPgo8L2c+Cjwvc3ZnPgo=`}zigLogo(){return`CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTUzIDE0MCI+CjxnIGZpbGw9IiNmN2E0MWQiPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI0NiwyMiAyOCw0NCAxOSwzMCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNDYsMjIgMzMsMzMgMjgsNDQgMjIsNDQgMjIsOTUgMzEsOTUgMjAsMTAwIDEyLDExNyAwLDExNyAwLDIyIiBzaGFwZS1yZW5kZXJpbmc9ImNyaXNwRWRnZXMiLz4KCQk8cG9seWdvbiBwb2ludHM9IjMxLDk1IDEyLDExNyA0LDEwNiIvPgoJPC9nPgoJPGc+CgkJPHBvbHlnb24gcG9pbnRzPSI1NiwyMiA2MiwzNiAzNyw0NCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iNTYsMjIgMTExLDIyIDExMSw0NCAzNyw0NCA1NiwzMiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxMTYsOTUgOTcsMTE3IDkwLDEwNCIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTE2LDk1IDEwMCwxMDQgOTcsMTE3IDQyLDExNyA0Miw5NSIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTAsMCA1MiwxMTcgMywxNDAgMTAxLDIyIi8+Cgk8L2c+Cgk8Zz4KCQk8cG9seWdvbiBwb2ludHM9IjE0MSwyMiAxNDAsNDAgMTIyLDQ1Ii8+CgkJPHBvbHlnb24gcG9pbnRzPSIxNTMsMjIgMTUzLDExNyAxMDYsMTE3IDEyMCwxMDUgMTI1LDk1IDEzMSw5NSAxMzEsNDUgMTIyLDQ1IDEzMiwzNiAxNDEsMjIiIHNoYXBlLXJlbmRlcmluZz0iY3Jpc3BFZGdlcyIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTI1LDk1IDEzMCwxMTAgMTA2LDExNyIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=`}render(){let e=ql.getIconForType(this.getNodeTypeFromIcon(this.icon));switch(this.icon){case X.OPENAPI:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.openapiIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}; ${this.isLightMode()?`filter: grayscale(100%)`:``}"></sl-icon>`;case X.GO:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.goIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case X.TS:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.typescriptIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case X.CS:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.csIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case X.C:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case X.CPP:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.cppIcon()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`;case X.ZIG:return G`<sl-icon exportparts="base" src="data:image/svg+xml;base64,${this.zigLogo()}" style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}return G`
            <sl-icon exportparts="base" data-fresh="${this.icon}" name="${e}"
                     class="icon-vertical-no-margin"
                     style="font-size: ${this.getSize()}; color: ${this.getIconColor()}"></sl-icon>`}};q([W()],Xl.prototype,`icon`,void 0),q([W({type:Jl})],Xl.prototype,`size`,void 0),q([W({type:Yl})],Xl.prototype,`color`,void 0),q([W()],Xl.prototype,`tooltip`,void 0),Xl=ql=q([Fa(`pb33f-model-icon`)],Xl);var Zl=class extends qs{constructor(){super(...arguments),this.localize=new ks(this),this.value=0,this.type=`decimal`,this.noGrouping=!1,this.currency=`USD`,this.currencyDisplay=`symbol`}render(){return isNaN(this.value)?``:this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.noGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};J([W({type:Number})],Zl.prototype,`value`,2),J([W()],Zl.prototype,`type`,2),J([W({attribute:`no-grouping`,type:Boolean})],Zl.prototype,`noGrouping`,2),J([W()],Zl.prototype,`currency`,2),J([W({attribute:`currency-display`})],Zl.prototype,`currencyDisplay`,2),J([W({attribute:`minimum-integer-digits`,type:Number})],Zl.prototype,`minimumIntegerDigits`,2),J([W({attribute:`minimum-fraction-digits`,type:Number})],Zl.prototype,`minimumFractionDigits`,2),J([W({attribute:`maximum-fraction-digits`,type:Number})],Zl.prototype,`maximumFractionDigits`,2),J([W({attribute:`minimum-significant-digits`,type:Number})],Zl.prototype,`minimumSignificantDigits`,2),J([W({attribute:`maximum-significant-digits`,type:Number})],Zl.prototype,`maximumSignificantDigits`,2),Zl.define(`sl-format-number`);var Ql=Ha`
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
    
`,$l=`paginatorFirstPage`,eu=`paginatorLastPage`,tu=`paginatorNextPage`,nu=`paginatorPreviousPage`,ru=class extends Yo{static{this.styles=[Ql]}get hide(){return this.totalItems<=this.itemsPerPage}constructor(){super(),this.currentPage=1,this.totalPages=0,this.totalItems=0,this.itemsPerPage=20,this.label=`Problems`}getRangeStart(){let e=this.currentPage*this.itemsPerPage-this.itemsPerPage;return e==0?0:e>0?e:0}getPagesRemaining(){let e=this.totalItems-this.currentPage*this.itemsPerPage;return e>0?e:0}getRangeEnd(){let e=this.getRangeStart();e==1&&(e=0);let t=e+this.itemsPerPage;return t>this.totalItems?this.totalItems:t>=0?t:0}nextPage(){this.currentPage<this.totalPages&&this.dispatchEvent(new CustomEvent(tu,{composed:!0}))}previousPage(){this.currentPage>1&&this.dispatchEvent(new CustomEvent(nu,{composed:!0}))}lastPage(){this.currentPage<this.totalPages&&this.dispatchEvent(new CustomEvent(eu,{composed:!0}))}firstPage(){this.currentPage>1&&this.dispatchEvent(new CustomEvent($l,{composed:!0}))}togglePrev(e){this.homeButton&&(this.prevButton.disabled=e,this.homeButton.disabled=e)}toggleNext(e){this.endButton&&(this.nextButton.disabled=e,this.endButton.disabled=e)}updated(){this.togglePrev(this.currentPage===1),this.toggleNext(this.currentPage===this.totalPages)}render(){return this.totalItems==0?G``:G`
            <div class="paginator-navigation ${this.hide?`hide`:``}">
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
        `}};q([co()],ru.prototype,`currentPage`,void 0),q([co()],ru.prototype,`totalPages`,void 0),q([co()],ru.prototype,`totalItems`,void 0),q([co()],ru.prototype,`itemsPerPage`,void 0),q([uo(`.home`)],ru.prototype,`homeButton`,void 0),q([uo(`.previous`)],ru.prototype,`prevButton`,void 0),q([uo(`.next`)],ru.prototype,`nextButton`,void 0),q([uo(`.end`)],ru.prototype,`endButton`,void 0),q([W()],ru.prototype,`label`,void 0),ru=q([Fa(`pb33f-paginator`)],ru);var iu=Ha`

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
   
`,au={size:15,family:`BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial`,lineHeight:2,weight:`normal`,style:`normal`},ou={size:10,family:`BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial`,lineHeight:2,weight:`normal`,style:`normal`},su={size:12,family:`BerkeleyMono-Regular, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial`,lineHeight:2,weight:`normal`,style:`normal`},cu={size:15,family:`BerkeleyMono-Bold, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial`,lineHeight:2,weight:`bold`,style:`normal`},lu={size:25,family:`BerkeleyMono-Bold, Roboto Mono, Monaco, Menlo, Helvetica Neue,Helvetica,Verdana,Tahoma, Arial`,weight:`bold`,style:`normal`,lineHeight:3},uu=class extends Yo{constructor(){super(),this.currentTheme=`dark`,this._themeHandler=()=>{this.readColors(),this.currentTheme=du()}}readColors(){let e=getComputedStyle(this);this.primary=e.getPropertyValue(`--primary-color`).trim(),this.secondary=e.getPropertyValue(`--secondary-color`).trim(),this.tertiary=e.getPropertyValue(`--tertiary-color`).trim(),this.background=e.getPropertyValue(`--background-color`).trim(),this.error=e.getPropertyValue(`--error-color`).trim(),this.ok=e.getPropertyValue(`--terminal-text`).trim(),this.warn=e.getPropertyValue(`--warn-color`).trim(),this.color1=e.getPropertyValue(`--chart-color1`).trim(),this.color2=e.getPropertyValue(`--chart-color2`).trim(),this.color3=e.getPropertyValue(`--chart-color3`).trim(),this.color4=e.getPropertyValue(`--chart-color4`).trim(),this.color5=e.getPropertyValue(`--chart-color5`).trim()}firstUpdated(){this.readColors(),this.currentTheme=du(),this.font=au,this.smallFont=ou,this.mediumFont=su,this.titleFont=lu,this.fontBold=cu,window.addEventListener(fs,this._themeHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(fs,this._themeHandler)}};q([co()],uu.prototype,`currentTheme`,void 0);function du(){let e=document.documentElement.getAttribute(`theme`);return e===`light`?`light`:e===`tektronix`?`tektronix`:`dark`}var fu=class extends Yo{static{this.styles=Ha`
        canvas {
            width: 100%;
            height: 100%;
            image-rendering: pixelated; /* Ensures pixelated appearance */
        }
    `}constructor(){super(),this.animationFrameId=null,this._currentTheme=`dark`,this._themeHandler=()=>{this._currentTheme=du()},this.sparkArray=[],this.gravity=.005,this.spawnRate=50,this.isError=!1,this.animating=!1}firstUpdated(){this._currentTheme=du(),window.addEventListener(fs,this._themeHandler);let e=this.renderRoot.querySelector(`canvas`);if(e){this.canvas=e;let t=this.canvas?.getContext(`2d`);t&&(this.ctx=t)}}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(fs,this._themeHandler)}startAnimation(){this.animating||(this.animationTimer=setInterval(()=>this.spawnSpark(),1e3/this.spawnRate),this.animating=!0,this.animateSparks())}stopAnimation(){this.animating=!1,clearInterval(this.animationTimer),this.animationFrameId!==null&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.sparkArray=[],this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}getRandomBetween(e,t){return Math.random()*(t-e)+e}spawnSpark(){if(this.animating){let e;e=this._currentTheme===`light`?this.isError?Math.random()>.5?`rgb(60, 60, 60)`:`rgb(120, 120, 120)`:Math.random()>.5?`rgb(80, 80, 80)`:`rgb(160, 160, 160)`:this._currentTheme===`tektronix`?this.isError?Math.random()>.5?`rgb(102, 255, 102)`:`rgb(34, 204, 34)`:Math.random()>.5?`rgb(51, 255, 51)`:`rgb(26, 153, 26)`:this.isError?Math.random()>.5?`rgb(255, 60, 116)`:`rgb(157, 26, 65)`:Math.random()>.5?`rgb(248, 58, 255)`:`rgb(98, 196, 255)`,this.sparkArray.push({x:Math.random()*this.canvas.width,y:-2,size:1,color:e,velocityY:this.getRandomBetween(.05,.3),lifetime:150,initialLifetime:150,opacity:1})}}animateSparks(){if(this.animating){this.ctx?.clearRect(0,0,this.canvas?.width,this.canvas?.height),this.sparkArray=this.sparkArray.filter(e=>e.lifetime>0);for(let e of this.sparkArray)this.drawSpark(e),e.y+=e.velocityY,e.velocityY+=this.gravity,e.lifetime--,e.opacity=e.lifetime/e.initialLifetime;this.animationFrameId=requestAnimationFrame(()=>this.animateSparks())}}drawSpark(e){this.ctx.globalAlpha=e.opacity,this.ctx.fillStyle=e.color,/Safari/.test(navigator.userAgent)||(this.ctx.shadowColor=e.color,this.ctx.shadowBlur=8),this.ctx.fillRect(e.x,e.y,e.size,e.size),this.ctx.globalAlpha=1}render(){return G`
            <canvas width="100%" height="100%"></canvas>`}};q([W({type:Boolean})],fu.prototype,`isError`,void 0),fu=q([Fa(`pb33f-pixel-sparks`)],fu);function pu(e){return e}var mu=class extends Yo{static{this.styles=[iu]}constructor(){super(),this.sparks=new fu,this.currentPage=1,this.totalPages=1,this.totalItems=0,this.itemsPerPage=20,this.activeIndex=0,this.invalid=!1,this.hideSparks=!1,this.paginatorNavigator=new ru,this.paginatorNavigator.currentPage=this.currentPage,this.paginatorNavigator.totalPages=this.totalPages,this.paginatorNavigator.totalItems=this.totalItems,this.paginatorNavigator.itemsPerPage=this.itemsPerPage,this.addEventListener($l,pu(this.firstPage.bind(this))),this.addEventListener(eu,pu(this.lastPage.bind(this))),this.addEventListener(tu,pu(this.nextPage.bind(this))),this.addEventListener(nu,pu(this.previousPage.bind(this)))}nextPage(e){e.stopPropagation(),this.currentPage<this.totalPages&&this.currentPage++}lastPage(e){e.stopPropagation(),this.currentPage<this.totalPages&&(this.currentPage=this.totalPages)}firstPage(e){e.stopPropagation(),this.currentPage>1&&(this.currentPage=1)}setPage(e){this.currentPage=Math.ceil(e/this.itemsPerPage),this.activeIndex=e}previousPage(e){e.stopPropagation(),this.currentPage>1&&this.currentPage--}calcTotalPages(){return Math.ceil(this.totalItems/this.itemsPerPage)}willUpdate(){this.totalItems=this.values?.length,this.totalPages=this.calcTotalPages(),this.currentPage>this.totalPages&&(this.currentPage=Math.max(1,this.totalPages)),this.sparks.isError=this.invalid,this.paginatorNavigator.currentPage=this.currentPage,this.paginatorNavigator.totalItems=this.values?.length,this.paginatorNavigator.itemsPerPage=this.itemsPerPage,this.paginatorNavigator.totalPages=this.totalPages,this.label&&(this.paginatorNavigator.label=this.label),this.renderValues=this.values?.slice(this.paginatorNavigator.getRangeStart(),this.paginatorNavigator.getRangeEnd())}startSparks(){this.sparks.startAnimation()}stopSparks(){this.sparks.stopAnimation()}render(){return this.renderValues?.length===0||!this.renderValues?this.hideSparks?G`
                    <div class="no-values" style="position: relative">
                    </div>
                    `:G`
                    <div class="no-values ${this.invalid?`error`:``}" style="position: relative">
                        <div style="position: absolute; width: 100%; top: -50px; left: 0;">${this.sparks}</div>
                        <sl-icon name="prescription2"></sl-icon>
                        <br/>
                        ${this.invalid?`invalid / error`:`healthy!`}
                    </div>
                `:G`
            ${this.paginatorNavigator}
            <div class="paginator-values" part="values">
                ${this.renderValues}
            </div>
        `}};q([W({type:Yo})],mu.prototype,`values`,void 0),q([W({type:Number})],mu.prototype,`currentPage`,void 0),q([W({type:Number})],mu.prototype,`totalPages`,void 0),q([W({type:Number})],mu.prototype,`totalItems`,void 0),q([W({type:Number})],mu.prototype,`itemsPerPage`,void 0),q([W()],mu.prototype,`label`,void 0),q([W()],mu.prototype,`activeIndex`,void 0),q([W({type:Boolean})],mu.prototype,`invalid`,void 0),q([W({type:Boolean})],mu.prototype,`hideSparks`,void 0),mu=q([Fa(`pb33f-paginator-navigation`)],mu);var hu=Ha`
    :host {
        display: flex;
        column-gap: 10px;
        position: relative;
        background-color: var(--terminal-background);
        margin: 0;
        overflow: hidden;
        padding: 1rem 0 1rem 0;
        border: 1px dashed var(--code-border);
        color: var(--terminal-text);
        text-shadow: 0 0 10px var(--terminal-text-shadow);
        overflow-x: auto;
    }

    :host-context(html[theme="light"]) :host {
        text-shadow: none;
    }

    pre {
        margin: 0;
        padding-left: 0;
        overflow-x: auto;
    }

    :host::before {
        padding-left: 1rem;
        content: ">";
        font-family: var(--font-stack-bold);
        color: var(--secondary-color)
    }

    sl-button.copy {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    sl-button.copy::part(base) {
        color: var(--primary-color);
        border: 1px solid var(--code-border);
        font-family: var(--font-stack), serif;
        border-radius: 0;
        text-transform: uppercase;
    }

    @media only screen and (max-width: 1000px) {
        
        sl-button {
            display: none;
        }
    }
    
`,gu=class extends Yo{static{this.styles=hu}getValue(){let e=(this.shadowRoot?.querySelector(`slot.command`))?.assignedNodes({flatten:!0});return e&&e[0]?e[0].data?.trim()??``:``}copyToClipboard(){navigator.clipboard.writeText(this.getValue())}render(){return G`
            <sl-button class="copy" size="small" @click=${this.copyToClipboard}>copy</sl-button>
            <pre><slot class="command"></slot></pre>
        `}};gu=q([Fa(`terminal-example`)],gu);var _u=E`
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
`,vu=E`
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
`,yu=`pp-split-position`,bu=20,xu=class extends k{constructor(...e){super(...e),this.title=``,this.splitPos=bu}static{this.styles=[_u,vu]}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute(`data-title`)||document.title||`API Documentation`;let e=sessionStorage.getItem(yu);e&&(this.splitPos=parseFloat(e))}onReposition(e){let t=e.target.position;typeof t==`number`&&(this.splitPos=t,sessionStorage.setItem(yu,String(t)))}render(){return D`
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
    `}};q([F()],xu.prototype,`title`,void 0),q([F()],xu.prototype,`splitPos`,void 0),xu=q([N(`pp-layout`)],xu);var Su=E`
    :host {
        display: block;
        padding: var(--global-padding);
        font-family: var(--font-stack), monospace;
    }

    .nav-home {
        display: flex;
        align-items: center;
        padding: var(--global-padding) 0 var(--global-padding) 0;
        font-family: var(--font-stack), monospace;
        color: var(--font-color);
        text-decoration: none;
        cursor: pointer;
    }

    .nav-home-chevron {
        color: var(--secondary-color);
        margin-right: var(--global-padding);
        padding-left: var(--global-padding);
    }

    .nav-home:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
        text-decoration: none;
    }

    .nav-home:hover .nav-home-chevron {
        color: var(--primary-color);
    }

    .nav-home.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }

    .nav-home.active .nav-home-chevron {
        color: var(--primary-color);
    }

    .nav-section {
        margin-bottom: var(--global-padding);
    }

    h4 {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 1.3rem;
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        margin: 0 0 var(--global-padding) 0;
        padding-bottom: var(--global-padding);
        border-bottom: 1px dashed var(--primary-color-lowalpha);
    }

    .nav-models-section {
        margin-top: var(--global-padding-double);
    }
    
    .nav-webhooks-section {
        margin-top: var(--global-padding-double);
    }
    
    .nav-operations-section {
        margin-top: var(--global-padding-double);
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
`,Cu=class extends k{constructor(...e){super(...e),this.navJson=``,this.modelsJson=``,this.webhooksJson=``,this.activeSlug=``,this.tags=[],this.modelGroups=[],this.webhooks=[]}static{this.styles=Su}willUpdate(e){if(e.has(`navJson`))try{this.tags=this.navJson&&JSON.parse(this.navJson)||[]}catch{this.tags=[]}if(e.has(`modelsJson`))try{this.modelGroups=this.modelsJson&&JSON.parse(this.modelsJson)||[]}catch{this.modelGroups=[]}if(e.has(`webhooksJson`))try{this.webhooks=this.webhooksJson&&JSON.parse(this.webhooksJson)||[]}catch{this.webhooks=[]}}render(){return D`
      <a class="nav-home ${this.activeSlug?``:`active`}" href="index.html">
        <sl-icon name="chevron-right" class="nav-home-chevron"></sl-icon>
        API OVERVIEW
      </a>
      ${this.tags.length?D`
            <div class="nav-section nav-operations-section">
              <h4>Operations</h4>
              ${this.tags.map(e=>D`<pp-nav-tag .tag=${e} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
            </div>
          `:O}
      ${this.modelGroups.length?D`
            <div class="nav-section nav-models-section">
              <h4>Models</h4>
              ${this.modelGroups.map(e=>D`<pp-nav-model-group .group=${e} .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
            </div>
          `:O}
      ${this.webhooks.length?D`
            <div class="nav-section nav-webhooks-section">
              <h4>Webhooks</h4>
              <pp-nav-tag
                .tag=${{name:`Webhooks`,summary:`Webhooks`,children:null,operations:this.webhooks,isNavOnly:!1}}
                .activeSlug=${this.activeSlug}
              ></pp-nav-tag>
            </div>
          `:O}
    `}};q([P({attribute:`data-nav`})],Cu.prototype,`navJson`,void 0),q([P({attribute:`data-models`})],Cu.prototype,`modelsJson`,void 0),q([P({attribute:`data-webhooks`})],Cu.prototype,`webhooksJson`,void 0),q([P({attribute:`data-active`})],Cu.prototype,`activeSlug`,void 0),q([F()],Cu.prototype,`tags`,void 0),q([F()],Cu.prototype,`modelGroups`,void 0),q([F()],Cu.prototype,`webhooks`,void 0),Cu=q([N(`pp-nav`)],Cu);var wu=E`
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
`;function Tu(e,t){return t?!!(e.operations?.some(e=>e.slug===t)||e.children?.some(e=>Tu(e,t))):!1}var Eu=class extends k{constructor(...e){super(...e),this.tag={name:``,summary:``,children:null,operations:null,isNavOnly:!1},this.activeSlug=``,this.open=!1}static{this.styles=wu}willUpdate(e){(e.has(`tag`)||e.has(`activeSlug`))&&Tu(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}render(){let{tag:e,activeSlug:t,open:n}=this;return D`
            <div class="tag-header ${Tu(e,t)?`active`:``}" @click=${this.toggle}>
                <sl-icon name=${n?`chevron-down`:`chevron-right`} class="chevron"></sl-icon>
                <span class="tag-name">${e.summary||e.name}</span>
            </div>
            ${n?D`
                        <div class="tag-body">
                            ${e.operations?.length?D`
                                        <ul>
                                            ${e.operations.map(e=>D`
                                                        <li>
                                                            <a href="operations/${e.slug}.html" class="${e.deprecated?`deprecated`:``} ${e.slug===t?`active`:``}">
                                                                <span class="op-title">${e.summary||e.path}</span>
                                                                <pb33f-http-method mode="nav-naked"
                                                                        method=${e.method}></pb33f-http-method>
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:O}
                            ${e.children?.length?D`
                                        <div class="children">
                                            ${e.children.map(e=>D`
                                                        <pp-nav-tag .tag=${e}
                                                                    .activeSlug=${t}></pp-nav-tag>`)}
                                        </div>
                                    `:O}
                        </div>
                    `:O}
        `}};q([P({type:Object})],Eu.prototype,`tag`,void 0),q([P()],Eu.prototype,`activeSlug`,void 0),q([F()],Eu.prototype,`open`,void 0),Eu=q([N(`pp-nav-tag`)],Eu);var Du=E`
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
`;function Ou(e,t){return t?e.models?.some(e=>e.typeSlug+`/`+e.slug===t)??!1:!1}var ku=class extends k{constructor(...e){super(...e),this.group={name:``,typeSlug:``,models:null},this.activeSlug=``,this.open=!1}static{this.styles=Du}willUpdate(e){(e.has(`group`)||e.has(`activeSlug`))&&Ou(this.group,this.activeSlug)&&(this.open=!0)}updated(e){(e.has(`activeSlug`)||e.has(`group`))&&this.open&&this.activeSlug&&requestAnimationFrame(()=>{this.renderRoot.querySelector(`a.active`)?.scrollIntoView({block:`center`,behavior:`auto`})})}toggle(){this.open=!this.open}render(){let{group:e,activeSlug:t,open:n}=this;return D`
            <div class="group-header ${Ou(e,t)?`active`:``}" @click=${this.toggle}>
                <sl-icon name=${n?`chevron-down`:`chevron-right`} class="chevron"></sl-icon>
                <span>${e.name}</span>
            </div>
            ${n&&e.models?.length?D`
                    <div class="group-body">
                        <ul>
                            ${e.models.map(e=>{let n=e.typeSlug+`/`+e.slug;return D`
                                        <li>
                                            <a href="models/${e.typeSlug}/${e.slug}.html"
                                               class="${n===t?`active`:``}">
                                                <span class="model-name">${e.name}</span>
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:O}
        `}};q([P({type:Object})],ku.prototype,`group`,void 0),q([P()],ku.prototype,`activeSlug`,void 0),q([F()],ku.prototype,`open`,void 0),ku=q([N(`pp-nav-model-group`)],ku);var Au=E`
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
`,ju=class extends k{constructor(...e){super(...e),this.method=``,this.path=``,this.slug=``,this.deprecated=!1}static{this.styles=Au}render(){return D`
      <a
        href="operations/${this.slug}.html"
        class=${this.deprecated?`deprecated`:``}
      >
        <pb33f-http-method method=${this.method}></pb33f-http-method>
        <span class="path">${this.path}</span>
      </a>
    `}};q([P()],ju.prototype,`method`,void 0),q([P()],ju.prototype,`path`,void 0),q([P()],ju.prototype,`slug`,void 0),q([P({type:Boolean})],ju.prototype,`deprecated`,void 0),ju=q([N(`pp-nav-operation`)],ju);var Mu=E`
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
`,Nu=[Mu,E`
    :host {
        display: block;
    }

    .selector-row {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-bottom: var(--global-padding);
    }

    .selector {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }

    sl-dropdown {
        margin-top: 0;
    }

`],Pu=E`
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
`,Fu=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.open=!1,this.placement=`bottom-start`,this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=e=>{this.open&&e.key===`Escape`&&(e.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=e=>{if(e.key===`Escape`&&this.open&&!this.closeWatcher){e.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(e.key===`Tab`){if(this.open&&document.activeElement?.tagName.toLowerCase()===`sl-menu-item`){e.preventDefault(),this.hide(),this.focusOnTrigger();return}let t=(e,n)=>{if(!e)return null;let r=e.closest(n);if(r)return r;let i=e.getRootNode();return i instanceof ShadowRoot?t(i.host,n):null};setTimeout(()=>{let e=this.containingElement?.getRootNode()instanceof ShadowRoot?Gi():document.activeElement;(!this.containingElement||t(e,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=e=>{let t=e.composedPath();this.containingElement&&!t.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=e=>{let t=e.target;!this.stayOpenOnSelect&&t.tagName.toLowerCase()===`sl-menu`&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||=this}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let e=this.trigger.assignedElements({flatten:!0})[0];typeof e?.focus==`function`&&e.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(e=>e.tagName.toLowerCase()===`sl-menu`)}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(e){if([` `,`Enter`].includes(e.key)){e.preventDefault(),this.handleTriggerClick();return}let t=this.getMenu();if(t){let n=t.getAllItems(),r=n[0],i=n[n.length-1];[`ArrowDown`,`ArrowUp`,`Home`,`End`].includes(e.key)&&(e.preventDefault(),this.open||(this.show(),await this.updateComplete),n.length>0&&this.updateComplete.then(()=>{(e.key===`ArrowDown`||e.key===`Home`)&&(t.setCurrentItem(r),r.focus()),(e.key===`ArrowUp`||e.key===`End`)&&(t.setCurrentItem(i),i.focus())}))}}handleTriggerKeyUp(e){e.key===` `&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(e=>Zi(e).start),t;if(e){switch(e.tagName.toLowerCase()){case`sl-button`:case`sl-icon-button`:t=e.button;break;default:t=e}t.setAttribute(`aria-haspopup`,`true`),t.setAttribute(`aria-expanded`,this.open?`true`:`false`)}}async show(){if(!this.open)return this.open=!0,ji(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ji(this,`sl-after-hide`)}reposition(){this.popup.reposition()}addOpenListeners(){var e;this.panel.addEventListener(`sl-select`,this.handlePanelSelect),`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener(`keydown`,this.handleKeyDown),document.addEventListener(`keydown`,this.handleDocumentKeyDown),document.addEventListener(`mousedown`,this.handleDocumentMouseDown)}removeOpenListeners(){var e;this.panel&&(this.panel.removeEventListener(`sl-select`,this.handlePanelSelect),this.panel.removeEventListener(`keydown`,this.handleKeyDown)),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`mousedown`,this.handleDocumentMouseDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit(`sl-show`),this.addOpenListeners(),await Fi(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:e,options:t}=Ai(this,`dropdown.show`,{dir:this.localize.dir()});await Mi(this.popup.popup,e,t),this.emit(`sl-after-show`)}else{this.emit(`sl-hide`),this.removeOpenListeners(),await Fi(this);let{keyframes:e,options:t}=Ai(this,`dropdown.hide`,{dir:this.localize.dir()});await Mi(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,this.emit(`sl-after-hide`)}}render(){return D`
      <sl-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?`fixed`:`absolute`}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${z(this.sync?this.sync:void 0)}
        class=${R({dropdown:!0,"dropdown--open":this.open})}
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

        <div aria-hidden=${this.open?`false`:`true`} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `}};Fu.styles=[M,Pu],Fu.dependencies={"sl-popup":V},A([I(`.dropdown`)],Fu.prototype,`popup`,2),A([I(`.dropdown__trigger`)],Fu.prototype,`trigger`,2),A([I(`.dropdown__panel`)],Fu.prototype,`panel`,2),A([P({type:Boolean,reflect:!0})],Fu.prototype,`open`,2),A([P({reflect:!0})],Fu.prototype,`placement`,2),A([P({type:Boolean,reflect:!0})],Fu.prototype,`disabled`,2),A([P({attribute:`stay-open-on-select`,type:Boolean,reflect:!0})],Fu.prototype,`stayOpenOnSelect`,2),A([P({attribute:!1})],Fu.prototype,`containingElement`,2),A([P({type:Number})],Fu.prototype,`distance`,2),A([P({type:Number})],Fu.prototype,`skidding`,2),A([P({type:Boolean})],Fu.prototype,`hoist`,2),A([P({reflect:!0})],Fu.prototype,`sync`,2),A([j(`open`,{waitUntilFirstUpdate:!0})],Fu.prototype,`handleOpenChange`,1),H(`dropdown.show`,{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:`ease`}}),H(`dropdown.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:`ease`}}),Fu.define(`sl-dropdown`);var Iu=E`
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
`,Lu=class extends L{connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`menu`)}handleClick(e){let t=[`menuitem`,`menuitemcheckbox`],n=e.composedPath(),r=n.find(e=>t.includes((e?.getAttribute)?.call(e,`role`)||``));if(!r||n.find(e=>(e?.getAttribute)?.call(e,`role`)===`menu`)!==this)return;let i=r;i.type===`checkbox`&&(i.checked=!i.checked),this.emit(`sl-select`,{detail:{item:i}})}handleKeyDown(e){if(e.key===`Enter`||e.key===` `){let t=this.getCurrentItem();e.preventDefault(),e.stopPropagation(),t?.click()}else if([`ArrowDown`,`ArrowUp`,`Home`,`End`].includes(e.key)){let t=this.getAllItems(),n=this.getCurrentItem(),r=n?t.indexOf(n):0;t.length>0&&(e.preventDefault(),e.stopPropagation(),e.key===`ArrowDown`?r++:e.key===`ArrowUp`?r--:e.key===`Home`?r=0:e.key===`End`&&(r=t.length-1),r<0&&(r=t.length-1),r>t.length-1&&(r=0),this.setCurrentItem(t[r]),t[r].focus())}}handleMouseDown(e){let t=e.target;this.isMenuItem(t)&&this.setCurrentItem(t)}handleSlotChange(){let e=this.getAllItems();e.length>0&&this.setCurrentItem(e[0])}isMenuItem(e){return e.tagName.toLowerCase()===`sl-menu-item`||[`menuitem`,`menuitemcheckbox`,`menuitemradio`].includes(e.getAttribute(`role`)??``)}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>!(e.inert||!this.isMenuItem(e)))}getCurrentItem(){return this.getAllItems().find(e=>e.getAttribute(`tabindex`)===`0`)}setCurrentItem(e){this.getAllItems().forEach(t=>{t.setAttribute(`tabindex`,t===e?`0`:`-1`)})}render(){return D`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};Lu.styles=[M,Iu],A([I(`slot`)],Lu.prototype,`defaultSlot`,2),Lu.define(`sl-menu`);var Ru=E`
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
`,zu=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),zu(e,t);return!0},Bu=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Vu=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Wu(t)}};function Hu(e){this._$AN===void 0?this._$AM=e:(Bu(this),this._$AM=e,Vu(this))}function Uu(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)zu(r[e],!1),Bu(r[e]);else r!=null&&(zu(r,!1),Bu(r));else zu(this,e)}var Wu=e=>{e.type==sn.CHILD&&(e._$AP??=Uu,e._$AQ??=Hu)},Gu=class extends ln{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),Vu(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(zu(this,e),Bu(this))}setValue(e){if(Qt(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},Ku=()=>new qu,qu=class{},Ju=new WeakMap,Yu=cn(class extends Gu{render(e){return O}update(e,[t]){let n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),O}rt(e){if(this.isConnected||(e=void 0),typeof this.G==`function`){let t=this.ht??globalThis,n=Ju.get(t);n===void 0&&(n=new WeakMap,Ju.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G==`function`?Ju.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),Xu=class{constructor(e,t){this.popupRef=Ku(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=e=>{this.host.style.setProperty(`--safe-triangle-cursor-x`,`${e.clientX}px`),this.host.style.setProperty(`--safe-triangle-cursor-y`,`${e.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test(`submenu`)&&this.enableSubmenu()},this.handleKeyDown=e=>{switch(e.key){case`Escape`:case`Tab`:this.disableSubmenu();break;case`ArrowLeft`:e.target!==this.host&&(e.preventDefault(),e.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case`ArrowRight`:case`Enter`:case` `:this.handleSubmenuEntry(e);break;default:break}},this.handleClick=e=>{e.target===this.host?(e.preventDefault(),e.stopPropagation()):e.target instanceof Element&&(e.target.tagName===`sl-menu-item`||e.target.role?.startsWith(`menuitem`))&&this.disableSubmenu()},this.handleFocusOut=e=>{e.relatedTarget&&e.relatedTarget instanceof Element&&this.host.contains(e.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=e=>{e.stopPropagation()},this.handlePopupReposition=()=>{let e=this.host.renderRoot.querySelector(`slot[name='submenu']`)?.assignedElements({flatten:!0}).filter(e=>e.localName===`sl-menu`)[0],t=getComputedStyle(this.host).direction===`rtl`;if(!e)return;let{left:n,top:r,width:i,height:a}=e.getBoundingClientRect();this.host.style.setProperty(`--safe-triangle-submenu-start-x`,`${t?n+i:n}px`),this.host.style.setProperty(`--safe-triangle-submenu-start-y`,`${r}px`),this.host.style.setProperty(`--safe-triangle-submenu-end-x`,`${t?n+i:n}px`),this.host.style.setProperty(`--safe-triangle-submenu-end-y`,`${r+a}px`)},(this.host=e).addController(this),this.hasSlotController=t}hostConnected(){this.hasSlotController.test(`submenu`)&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test(`submenu`)&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||=(this.host.addEventListener(`mousemove`,this.handleMouseMove),this.host.addEventListener(`mouseover`,this.handleMouseOver),this.host.addEventListener(`keydown`,this.handleKeyDown),this.host.addEventListener(`click`,this.handleClick),this.host.addEventListener(`focusout`,this.handleFocusOut),!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener(`mouseover`,this.handlePopupMouseover),this.popupRef.value.addEventListener(`sl-reposition`,this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&=(this.host.removeEventListener(`mousemove`,this.handleMouseMove),this.host.removeEventListener(`mouseover`,this.handleMouseOver),this.host.removeEventListener(`keydown`,this.handleKeyDown),this.host.removeEventListener(`click`,this.handleClick),this.host.removeEventListener(`focusout`,this.handleFocusOut),!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener(`mouseover`,this.handlePopupMouseover),this.popupRef.value.removeEventListener(`sl-reposition`,this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(e){let t=this.host.renderRoot.querySelector(`slot[name='submenu']`);if(!t){console.error(`Cannot activate a submenu if no corresponding menuitem can be found.`,this);return}let n=null;for(let e of t.assignedElements())if(n=e.querySelectorAll(`sl-menu-item, [role^='menuitem']`),n.length!==0)break;if(!(!n||n.length===0)){n[0].setAttribute(`tabindex`,`0`);for(let e=1;e!==n.length;++e)n[e].setAttribute(`tabindex`,`-1`);this.popupRef.value&&(e.preventDefault(),e.stopPropagation(),this.popupRef.value.active?n[0]instanceof HTMLElement&&n[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{n[0]instanceof HTMLElement&&n[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(e){this.popupRef.value&&this.popupRef.value.active!==e&&(this.popupRef.value.active=e,this.host.requestUpdate())}enableSubmenu(e=!0){e?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){if(!this.host.parentElement?.computedStyleMap)return;let e=this.host.parentElement.computedStyleMap();this.skidding=[`padding-top`,`border-top-width`,`margin-top`].reduce((t,n)=>{let r=e.get(n)??new CSSUnitValue(0,`px`);return t-(r instanceof CSSUnitValue?r:new CSSUnitValue(0,`px`)).to(`px`).value},0)}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){let e=getComputedStyle(this.host).direction===`rtl`;return this.isConnected?D`
      <sl-popup
        ${Yu(this.popupRef)}
        placement=${e?`left-start`:`right-start`}
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
    `:D` <slot name="submenu" hidden></slot> `}},Zu=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.type=`normal`,this.checked=!1,this.value=``,this.loading=!1,this.disabled=!1,this.hasSlotController=new ua(this,`submenu`),this.submenuController=new Xu(this,this.hasSlotController),this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleMouseOver=e=>{this.focus(),e.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this.handleHostClick),this.addEventListener(`mouseover`,this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`click`,this.handleHostClick),this.removeEventListener(`mouseover`,this.handleMouseOver)}handleDefaultSlotChange(){let e=this.getTextLabel();if(this.cachedTextLabel===void 0){this.cachedTextLabel=e;return}e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit(`slotchange`,{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!==`checkbox`){this.checked=!1,console.error(`The checked attribute can only be used on menu items with type="checkbox"`,this);return}this.type===`checkbox`?this.setAttribute(`aria-checked`,this.checked?`true`:`false`):this.removeAttribute(`aria-checked`)}handleDisabledChange(){this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`)}handleTypeChange(){this.type===`checkbox`?(this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`)):(this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`))}getTextLabel(){return da(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test(`submenu`)}render(){let e=this.localize.dir()===`rtl`,t=this.submenuController.isExpanded();return D`
      <div
        id="anchor"
        part="base"
        class=${R({"menu-item":!0,"menu-item--rtl":e,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":t})}
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
          <sl-icon name=${e?`chevron-left`:`chevron-right`} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading?D` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:``}
      </div>
    `}};Zu.styles=[M,Ru],Zu.dependencies={"sl-icon":on,"sl-popup":V,"sl-spinner":xa},A([I(`slot:not([name])`)],Zu.prototype,`defaultSlot`,2),A([I(`.menu-item`)],Zu.prototype,`menuItem`,2),A([P()],Zu.prototype,`type`,2),A([P({type:Boolean,reflect:!0})],Zu.prototype,`checked`,2),A([P()],Zu.prototype,`value`,2),A([P({type:Boolean,reflect:!0})],Zu.prototype,`loading`,2),A([P({type:Boolean,reflect:!0})],Zu.prototype,`disabled`,2),A([j(`checked`)],Zu.prototype,`handleCheckedChange`,1),A([j(`disabled`)],Zu.prototype,`handleDisabledChange`,1),A([j(`type`)],Zu.prototype,`handleTypeChange`,1),Zu.define(`sl-menu-item`);var Qu=class extends k{constructor(...e){super(...e),this.curlJson=``,this.variants=[],this.selectedIndex=0}static{this.styles=[Nu]}willUpdate(e){if(e.has(`curlJson`)){try{let e=JSON.parse(this.curlJson);this.variants=Array.isArray(e)?e:[]}catch{this.variants=[]}this.selectedIndex=0}}renderSelector(){if(this.variants.length<=1)return O;let e=this.variants[this.selectedIndex]||this.variants[0];return e?D`
      <div class="selector-row">
        <div class="selector">
          <sl-dropdown skidding="5" distance="5">
            <sl-button slot="trigger" caret>${e.label||`Variant ${this.selectedIndex+1}`}</sl-button>
            <sl-menu @sl-select=${this.handleSelect}>
              ${this.variants.map((e,t)=>D`
                <sl-menu-item value="${t}">${e.label||`Variant ${t+1}`}</sl-menu-item>
              `)}
            </sl-menu>
          </sl-dropdown>
        </div>
      </div>
    `:O}handleSelect(e){let t=e.detail?.item?.value;if(t===void 0)return;let n=parseInt(t,10);n>=0&&n<this.variants.length&&(this.selectedIndex=n)}render(){if(this.variants.length===0)return O;let e=this.variants[this.selectedIndex]||this.variants[0];return e?D`
      ${this.renderSelector()}
      <terminal-example>${e.command}</terminal-example>
    `:O}};q([P({attribute:`curl-json`})],Qu.prototype,`curlJson`,void 0),q([F()],Qu.prototype,`variants`,void 0),q([F()],Qu.prototype,`selectedIndex`,void 0),Qu=q([N(`pp-curl-command`)],Qu);var $u=E`
    .constraints {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.1rem 0.75rem;
        margin-top: 0.3rem;
        font-size: 0.85em;
        font-family: var(--font-stack), monospace;
    }

    .constraint-label {
        color: var(--font-color-sub2);
        text-align: right;
    }

    .constraint-value {
        color: var(--font-color-sub1);
    }

    .constraint-value code {
        color: var(--secondary-color);
    }

    .enum-section {
        grid-column: 1 / -1;
        margin-top: var(--global-padding);
    }

    .enum-grid {
        display: flex;
        flex-wrap: wrap;
        gap: var(--global-padding-half);
        margin-top: var(--global-padding);
    }

    .enum-value {
        color: var(--tertiary-color);
        font-family: var(--font-stack), monospace;
        padding: 0 var(--global-padding-half);
        white-space: nowrap;
    }
`,ed=E`
  .pp-markdown,
  .pp-markdown-inline {
    color: var(--font-color-sub1);
  }

  .pp-markdown > :first-child,
  .pp-markdown-inline > :first-child {
    margin-top: 0;
  }

  .pp-markdown > :last-child,
  .pp-markdown-inline > :last-child {
    margin-bottom: 0;
  }

  .pp-markdown p,
  .pp-markdown ul,
  .pp-markdown ol,
  .pp-markdown pre,
  .pp-markdown blockquote {
    margin: 0 0 var(--global-padding) 0;
  }

  .pp-markdown ul,
  .pp-markdown ol {
    padding-left: 1.35rem;
  }

  .pp-markdown li + li {
    margin-top: calc(var(--global-padding) / 2);
  }

  .pp-markdown a,
  .pp-markdown-inline a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .pp-markdown a:hover,
  .pp-markdown-inline a:hover {
    text-decoration: underline;
  }

  .pp-markdown code,
  .pp-markdown-inline code {
    font-family: var(--font-stack), monospace;
    color: var(--primary-color);
    background: color-mix(in srgb, var(--background-color) 80%, black);
    border: 1px dotted var(--secondary-color-dimmer);
    padding: 0 0.25rem;
  }

  .pp-markdown pre {
    overflow-x: auto;
    padding: var(--global-padding);
    border-left: 2px solid var(--secondary-color);
    background: color-mix(in srgb, var(--background-color) 88%, black);
  }

  .pp-markdown pre code {
    border: none;
    padding: 0;
    background: transparent;
  }

  .pp-markdown blockquote {
    margin-left: 0;
    padding-left: var(--global-padding-double);
    border-left: 2px solid var(--warn-color);
    color: var(--font-color-sub2);
  }

  .pp-markdown-inline {
    display: inline-block;
  }

  .pp-markdown-inline p {
    display: inline;
    margin: 0;
  }
`,td=E`
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
`,nd=E`
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
`,rd={schemas:`schemas`,responses:`responses`,parameters:`parameters`,requestBodies:`request-bodies`,headers:`headers`,securitySchemes:`security`,examples:`examples`,links:`links`,callbacks:`callbacks`,pathItems:`path-items`};function id(e){let t=e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`);return t=t.toLowerCase(),t=t.replace(/[/]/g,`-`).replace(/[{}_.]/g,`-`).replace(/ /g,`-`),t=t.replace(/[^a-z0-9-]/g,``),t=t.replace(/-{2,}/g,`-`),t=t.replace(/^-|-$/g,``),t||`unnamed`}function ad(e){if(!e||!e.startsWith(`#/components/`))return null;let t=e.replace(`#/components/`,``).split(`/`);if(t.length!==2)return null;let[n,r]=t,i=rd[n];return i?{name:r,href:`models/${i}/${id(r)}.html`}:null}function od(e,t){if(!e)return[];let n=[];return t?.includeExample&&(e.example!==void 0&&n.push({label:`example`,value:JSON.stringify(e.example)}),e.default!==void 0&&n.push({label:`default`,value:JSON.stringify(e.default)})),e.minimum!==void 0&&n.push({label:`min`,value:e.minimum}),e.maximum!==void 0&&n.push({label:`max`,value:e.maximum}),e.exclusiveMinimum!==void 0&&n.push({label:`exclusiveMin`,value:e.exclusiveMinimum}),e.exclusiveMaximum!==void 0&&n.push({label:`exclusiveMax`,value:e.exclusiveMaximum}),e.minLength!==void 0&&n.push({label:`minLength`,value:e.minLength}),e.maxLength!==void 0&&n.push({label:`maxLength`,value:e.maxLength}),e.minItems!==void 0&&n.push({label:`minItems`,value:e.minItems}),e.maxItems!==void 0&&n.push({label:`maxItems`,value:e.maxItems}),e.uniqueItems&&n.push({label:`uniqueItems`,value:`true`}),e.pattern&&n.push({label:`pattern`,value:e.pattern,isCode:!0}),e.multipleOf!==void 0&&n.push({label:`multipleOf`,value:e.multipleOf}),n}function sd(e){if(!e)return``;if(e.type===`array`&&e.items)return`Array<${e.items.type||e.items.$ref?.split(`/`).pop()||`any`}>`;if(e.type){let t=Array.isArray(e.type)?e.type.join(` | `):e.type;return e.format&&(t+=` (${e.format})`),t}return e.oneOf?`oneOf`:e.anyOf?`anyOf`:e.allOf?`allOf`:e.$ref?e.$ref.split(`/`).pop()??``:``}var cd=class extends ln{constructor(e){if(super(e),this.it=O,e.type!==sn.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===O||e==null)return this._t=void 0,this.it=e;if(e===qe)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};cd.directiveName=`unsafeHTML`,cd.resultType=1;var ld=cn(cd);function ud(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var dd=ud();function fd(e){dd=e}var pd={exec:()=>null};function Z(e,t=``){let n=typeof e==`string`?e:e.source,r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(hd.caret,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}var md=(()=>{try{return!0}catch{return!1}})(),hd={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,`i`)},gd=/^(?:[ \t]*(?:\n|$))+/,_d=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,vd=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,yd=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,bd=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xd=/(?:[*+-]|\d{1,9}[.)])/,Sd=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Cd=Z(Sd).replace(/bull/g,xd).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,``).getRegex(),wd=Z(Sd).replace(/bull/g,xd).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Td=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ed=/^[^\n]+/,Dd=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Od=Z(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace(`label`,Dd).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),kd=Z(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xd).getRegex(),Ad=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,jd=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Md=Z(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,`i`).replace(`comment`,jd).replace(`tag`,Ad).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Nd=Z(Td).replace(`hr`,yd).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ad).getRegex(),Pd={blockquote:Z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,Nd).getRegex(),code:_d,def:Od,fences:vd,heading:bd,hr:yd,html:Md,lheading:Cd,list:kd,newline:gd,paragraph:Nd,table:pd,text:Ed},Fd=Z(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,yd).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,`(?: {4}| {0,3}	)[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ad).getRegex(),Id={...Pd,lheading:wd,table:Fd,paragraph:Z(Td).replace(`hr`,yd).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,Fd).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ad).getRegex()},Ld={...Pd,html:Z(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,jd).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:pd,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Z(Td).replace(`hr`,yd).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,Cd).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},Rd=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,zd=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Bd=/^( {2,}|\\)\n(?!\s*$)/,Vd=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Hd=/[\p{P}\p{S}]/u,Ud=/[\s\p{P}\p{S}]/u,Wd=/[^\s\p{P}\p{S}]/u,Gd=Z(/^((?![*_])punctSpace)/,`u`).replace(/punctSpace/g,Ud).getRegex(),Kd=/(?!~)[\p{P}\p{S}]/u,qd=/(?!~)[\s\p{P}\p{S}]/u,Jd=/(?:[^\s\p{P}\p{S}]|~)/u,Yd=Z(/link|precode-code|html/,`g`).replace(`link`,/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace(`precode-`,md?"(?<!`)()":"(^^|[^`])").replace(`code`,/(?<b>`+)[^`]+\k<b>(?!`)/).replace(`html`,/<(?! )[^<>]*?>/).getRegex(),Xd=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Zd=Z(Xd,`u`).replace(/punct/g,Hd).getRegex(),Qd=Z(Xd,`u`).replace(/punct/g,Kd).getRegex(),$d=`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`,ef=Z($d,`gu`).replace(/notPunctSpace/g,Wd).replace(/punctSpace/g,Ud).replace(/punct/g,Hd).getRegex(),tf=Z($d,`gu`).replace(/notPunctSpace/g,Jd).replace(/punctSpace/g,qd).replace(/punct/g,Kd).getRegex(),nf=Z(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,`gu`).replace(/notPunctSpace/g,Wd).replace(/punctSpace/g,Ud).replace(/punct/g,Hd).getRegex(),rf=Z(/\\(punct)/,`gu`).replace(/punct/g,Hd).getRegex(),af=Z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),of=Z(jd).replace(`(?:-->|$)`,`-->`).getRegex(),sf=Z(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,of).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),cf=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,lf=Z(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace(`label`,cf).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),uf=Z(/^!?\[(label)\]\[(ref)\]/).replace(`label`,cf).replace(`ref`,Dd).getRegex(),df=Z(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,Dd).getRegex(),ff=Z(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,uf).replace(`nolink`,df).getRegex(),pf=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,mf={_backpedal:pd,anyPunctuation:rf,autolink:af,blockSkip:Yd,br:Bd,code:zd,del:pd,emStrongLDelim:Zd,emStrongRDelimAst:ef,emStrongRDelimUnd:nf,escape:Rd,link:lf,nolink:df,punctuation:Gd,reflink:uf,reflinkSearch:ff,tag:sf,text:Vd,url:pd},hf={...mf,link:Z(/^!?\[(label)\]\((.*?)\)/).replace(`label`,cf).getRegex(),reflink:Z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,cf).getRegex()},gf={...mf,emStrongRDelimAst:tf,emStrongLDelim:Qd,url:Z(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace(`protocol`,pf).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Z(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace(`protocol`,pf).getRegex()},_f={...gf,br:Z(Bd).replace(`{2,}`,`*`).getRegex(),text:Z(gf.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},vf={normal:Pd,gfm:Id,pedantic:Ld},yf={normal:mf,gfm:gf,breaks:_f,pedantic:hf},bf={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},xf=e=>bf[e];function Sf(e,t){if(t){if(hd.escapeTest.test(e))return e.replace(hd.escapeReplace,xf)}else if(hd.escapeTestNoEncode.test(e))return e.replace(hd.escapeReplaceNoEncode,xf);return e}function Cf(e){try{e=encodeURI(e).replace(hd.percentDecode,`%`)}catch{return null}return e}function wf(e,t){let n=e.replace(hd.findPipe,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(hd.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``);for(;r<n.length;r++)n[r]=n[r].trim().replace(hd.slashPipe,`|`);return n}function Tf(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function Ef(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return n>0?-2:-1}function Df(e,t,n,r,i){let a=t.href,o=t.title||null,s=e[1].replace(i.other.outputLinkReplace,`$1`);r.state.inLink=!0;let c={type:e[0].charAt(0)===`!`?`image`:`link`,raw:n,href:a,title:o,text:s,tokens:r.inlineTokens(s)};return r.state.inLink=!1,c}function Of(e,t,n){let r=e.match(n.other.indentCodeCompensation);if(r===null)return t;let i=r[1];return t.split(`
`).map(e=>{let t=e.match(n.other.beginningSpace);if(t===null)return e;let[r]=t;return r.length>=i.length?e.slice(i.length):e}).join(`
`)}var kf=class{options;rules;lexer;constructor(e){this.options=e||dd}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=t[0].replace(this.rules.other.codeRemoveIndent,``);return{type:`code`,raw:t[0],codeBlockStyle:`indented`,text:this.options.pedantic?e:Tf(e,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=Of(e,t[3]||``,this.rules);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=Tf(e,`#`);(this.options.pedantic||!t||this.rules.other.endingSpaceChar.test(t))&&(e=t.trim())}return{type:`heading`,raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:Tf(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=Tf(t[0],`
`).split(`
`),n=``,r=``,i=[];for(;e.length>0;){let t=!1,a=[],o;for(o=0;o<e.length;o++)if(this.rules.other.blockquoteStart.test(e[o]))a.push(e[o]),t=!0;else if(!t)a.push(e[o]);else break;e=e.slice(o);let s=a.join(`
`),c=s.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,``);n=n?`${n}
${s}`:s,r=r?`${r}
${c}`:c;let l=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=l,e.length===0)break;let u=i.at(-1);if(u?.type===`code`)break;if(u?.type===`blockquote`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.blockquote(a);i[i.length-1]=o,n=n.substring(0,n.length-t.raw.length)+o.raw,r=r.substring(0,r.length-t.text.length)+o.text;break}else if(u?.type===`list`){let t=u,a=t.raw+`
`+e.join(`
`),o=this.list(a);i[i.length-1]=o,n=n.substring(0,n.length-u.raw.length)+o.raw,r=r.substring(0,r.length-t.raw.length)+o.raw,e=a.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:`blockquote`,raw:n,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=this.rules.other.listItemRegex(n),o=!1;for(;e;){let n=!1,r=``,s=``;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;r=t[0],e=e.substring(r.length);let c=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,e=>` `.repeat(3*e.length)),l=e.split(`
`,1)[0],u=!c.trim(),d=0;if(this.options.pedantic?(d=2,s=c.trimStart()):u?d=t[1].length+1:(d=t[2].search(this.rules.other.nonSpaceChar),d=d>4?1:d,s=c.slice(d),d+=t[1].length),u&&this.rules.other.blankLine.test(l)&&(r+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=this.rules.other.nextBulletRegex(d),n=this.rules.other.hrRegex(d),i=this.rules.other.fencesBeginRegex(d),a=this.rules.other.headingBeginRegex(d),o=this.rules.other.htmlBeginRegex(d);for(;e;){let f=e.split(`
`,1)[0],p;if(l=f,this.options.pedantic?(l=l.replace(this.rules.other.listReplaceNesting,`  `),p=l):p=l.replace(this.rules.other.tabCharGlobal,`    `),i.test(l)||a.test(l)||o.test(l)||t.test(l)||n.test(l))break;if(p.search(this.rules.other.nonSpaceChar)>=d||!l.trim())s+=`
`+p.slice(d);else{if(u||c.replace(this.rules.other.tabCharGlobal,`    `).search(this.rules.other.nonSpaceChar)>=4||i.test(c)||a.test(c)||n.test(c))break;s+=`
`+l}!u&&!l.trim()&&(u=!0),r+=f+`
`,e=e.substring(f.length+1),c=p.slice(d)}}i.loose||(o?i.loose=!0:this.rules.other.doubleBlankLine.test(r)&&(o=!0));let f=null,p;this.options.gfm&&(f=this.rules.other.listIsTask.exec(s),f&&(p=f[0]!==`[ ] `,s=s.replace(this.rules.other.listReplaceTask,``))),i.items.push({type:`list_item`,raw:r,task:!!f,checked:p,loose:!1,text:s,tokens:[]}),i.raw+=r}let s=i.items.at(-1);if(s)s.raw=s.raw.trimEnd(),s.text=s.text.trimEnd();else return;i.raw=i.raw.trimEnd();for(let e=0;e<i.items.length;e++)if(this.lexer.state.top=!1,i.items[e].tokens=this.lexer.blockTokens(i.items[e].text,[]),!i.loose){let t=i.items[e].tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw))}if(i.loose)for(let e=0;e<i.items.length;e++)i.items[e].loose=!0;return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:`html`,block:!0,raw:t[0],pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal,` `),n=t[2]?t[2].replace(this.rules.other.hrefBrackets,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:t[0],href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=wf(t[1]),r=t[2].replace(this.rules.other.tableAlignChars,``).split(`|`),i=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,``).split(`
`):[],a={type:`table`,raw:t[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)this.rules.other.tableAlignRight.test(e)?a.align.push(`right`):this.rules.other.tableAlignCenter.test(e)?a.align.push(`center`):this.rules.other.tableAlignLeft.test(e)?a.align.push(`left`):a.align.push(null);for(let e=0;e<n.length;e++)a.header.push({text:n[e],tokens:this.lexer.inline(n[e]),header:!0,align:a.align[e]});for(let e of i)a.rows.push(wf(e,a.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:a.align[t]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:`heading`,raw:t[0],depth:t[2].charAt(0)===`=`?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(e)){if(!this.rules.other.endAngleBracket.test(e))return;let t=Tf(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=Ef(t[2],`()`);if(e===-2)return;if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(n=this.options.pedantic&&!this.rules.other.endAngleBracket.test(e)?n.slice(1):n.slice(1,-1)),Df(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=t[(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal,` `).toLowerCase()];if(!e){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return Df(n,e,n[0],this.lexer,this.rules)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(!(!r||r[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!=null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal,` `),n=this.rules.other.nonSpaceChar.test(e),r=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return n&&r&&(e=e.substring(1,e.length-1)),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:`del`,raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=t[1],n=`mailto:`+e):(e=t[1],n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=t[0],n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=t[0],n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:`text`,raw:t[0],text:t[0],escaped:e}}}},Af=class e{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||dd,this.options.tokenizer=this.options.tokenizer||new kf,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:hd,block:vf.normal,inline:yf.normal};this.options.pedantic?(t.block=vf.pedantic,t.inline=yf.pedantic):this.options.gfm&&(t.block=vf.gfm,this.options.breaks?t.inline=yf.breaks:t.inline=yf.gfm),this.tokenizer.rules=t}static get rules(){return{block:vf,inline:yf}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(hd.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.options.pedantic&&(e=e.replace(hd.tabCharGlobal,`    `).replace(hd.spaceLine,``));e;){let r;if(this.options.extensions?.block?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let n=t.at(-1);r.raw.length===1&&n!==void 0?n.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`paragraph`||n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.raw,this.inlineQueue.at(-1).src=n.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=t.at(-1);n&&a?.type===`paragraph`?(a.raw+=(a.raw.endsWith(`
`)?``:`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let n=t.at(-1);n?.type===`text`?(n.raw+=(n.raw.endsWith(`
`)?``:`
`)+r.raw,n.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let e=Object.keys(this.tokens.links);if(e.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)e.includes(r[0].slice(r[0].lastIndexOf(`[`)+1,-1))&&(n=n.slice(0,r.index)+`[`+`a`.repeat(r[0].length-2)+`]`+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+`++`+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+`[`+`a`.repeat(r[0].length-i-2)+`]`+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let a=!1,o=``;for(;e;){a||(o=``),a=!1;let r;if(this.options.extensions?.inline?.some(n=>(r=n.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.escape(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.tag(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.link(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(r.raw.length);let n=t.at(-1);r.type===`text`&&n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(r=this.tokenizer.emStrong(e,n,o)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.codespan(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.br(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.del(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.autolink(e)){e=e.substring(r.raw.length),t.push(r);continue}if(!this.state.inLink&&(r=this.tokenizer.url(e))){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(r=this.tokenizer.inlineText(i)){e=e.substring(r.raw.length),r.raw.slice(-1)!==`_`&&(o=r.raw.slice(-1)),a=!0;let n=t.at(-1);n?.type===`text`?(n.raw+=r.raw,n.text+=r.text):t.push(r);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return t}},jf=class{options;parser;constructor(e){this.options=e||dd}space(e){return``}code({text:e,lang:t,escaped:n}){let r=(t||``).match(hd.notSpaceStart)?.[0],i=e.replace(hd.endingNewline,``)+`
`;return r?`<pre><code class="language-`+Sf(r)+`">`+(n?i:Sf(i,!0))+`</code></pre>
`:`<pre><code>`+(n?i:Sf(i,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return``}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,r=``;for(let t=0;t<e.items.length;t++){let n=e.items[t];r+=this.listitem(n)}let i=t?`ol`:`ul`,a=t&&n!==1?` start="`+n+`"`:``;return`<`+i+a+`>
`+r+`</`+i+`>
`}listitem(e){let t=``;if(e.task){let n=this.checkbox({checked:!!e.checked});e.loose?e.tokens[0]?.type===`paragraph`?(e.tokens[0].text=n+` `+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type===`text`&&(e.tokens[0].tokens[0].text=n+` `+Sf(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:`text`,raw:n+` `,text:n+` `,escaped:!0}):t+=n+` `}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox">`}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t=``,n=``;for(let t=0;t<e.header.length;t++)n+=this.tablecell(e.header[t]);t+=this.tablerow({text:n});let r=``;for(let t=0;t<e.rows.length;t++){let i=e.rows[t];n=``;for(let e=0;e<i.length;e++)n+=this.tablecell(i[e]);r+=this.tablerow({text:n})}return r&&=`<tbody>${r}</tbody>`,`<table>
<thead>
`+t+`</thead>
`+r+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?`th`:`td`;return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Sf(e,!0)}</code>`}br(e){return`<br>`}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let r=this.parser.parseInline(n),i=Cf(e);if(i===null)return r;e=i;let a=`<a href="`+e+`"`;return t&&(a+=` title="`+Sf(t)+`"`),a+=`>`+r+`</a>`,a}image({href:e,title:t,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let i=Cf(e);if(i===null)return Sf(n);e=i;let a=`<img src="${e}" alt="${n}"`;return t&&(a+=` title="${Sf(t)}"`),a+=`>`,a}text(e){return`tokens`in e&&e.tokens?this.parser.parseInline(e.tokens):`escaped`in e&&e.escaped?e.text:Sf(e.text)}},Mf=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return``+e}image({text:e}){return``+e}br(){return``}},Nf=class e{options;renderer;textRenderer;constructor(e){this.options=e||dd,this.options.renderer=this.options.renderer||new jf,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Mf}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e,t=!0){let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=i,t=this.options.extensions.renderers[e.type].call({parser:this},e);if(t!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`def`,`paragraph`,`text`].includes(e.type)){n+=t||``;continue}}let a=i;switch(a.type){case`space`:n+=this.renderer.space(a);continue;case`hr`:n+=this.renderer.hr(a);continue;case`heading`:n+=this.renderer.heading(a);continue;case`code`:n+=this.renderer.code(a);continue;case`table`:n+=this.renderer.table(a);continue;case`blockquote`:n+=this.renderer.blockquote(a);continue;case`list`:n+=this.renderer.list(a);continue;case`html`:n+=this.renderer.html(a);continue;case`def`:n+=this.renderer.def(a);continue;case`paragraph`:n+=this.renderer.paragraph(a);continue;case`text`:{let i=a,o=this.renderer.text(i);for(;r+1<e.length&&e[r+1].type===`text`;)i=e[++r],o+=`
`+this.renderer.text(i);t?n+=this.renderer.paragraph({type:`paragraph`,raw:o,text:o,tokens:[{type:`text`,raw:o,text:o,escaped:!0}]}):n+=o;continue}default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}parseInline(e,t=this.renderer){let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}let a=i;switch(a.type){case`escape`:n+=t.text(a);break;case`html`:n+=t.html(a);break;case`link`:n+=t.link(a);break;case`image`:n+=t.image(a);break;case`strong`:n+=t.strong(a);break;case`em`:n+=t.em(a);break;case`codespan`:n+=t.codespan(a);break;case`br`:n+=t.br(a);break;case`del`:n+=t.del(a);break;case`text`:n+=t.text(a);break;default:{let e=`Token with "`+a.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},Pf=class{options;block;constructor(e){this.options=e||dd}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`,`emStrongMask`]);static passThroughHooksRespectAsync=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?Af.lex:Af.lexInline}provideParser(){return this.block?Nf.parse:Nf.parseInline}},Ff=new class{defaults=ud();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Nf;Renderer=jf;TextRenderer=Mf;Lexer=Af;Tokenizer=kf;Hooks=Pf;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new jf(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if([`options`,`parser`].includes(n))continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new kf(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new Pf;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if([`options`,`block`].includes(n))continue;let r=n,i=e.hooks[r],a=t[r];Pf.passThroughHooks.has(n)?t[r]=e=>{if(this.defaults.async&&Pf.passThroughHooksRespectAsync.has(n))return(async()=>{let n=await i.call(t,e);return a.call(t,n)})();let r=i.call(t,e);return a.call(t,r)}:t[r]=(...e)=>{if(this.defaults.async)return(async()=>{let n=await i.apply(t,e);return n===!1&&(n=await a.apply(t,e)),n})();let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Af.lex(e,t??this.defaults)}parser(e,t){return Nf.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let r={...n},i={...this.defaults,...r},a=this.onError(!!i.silent,!!i.async);if(this.defaults.async===!0&&r.async===!1)return a(Error(`marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`));if(typeof t>`u`||t===null)return a(Error(`marked(): input parameter is undefined or null`));if(typeof t!=`string`)return a(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(t)+`, string expected`));if(i.hooks&&(i.hooks.options=i,i.hooks.block=e),i.async)return(async()=>{let n=i.hooks?await i.hooks.preprocess(t):t,r=await(i.hooks?await i.hooks.provideLexer():e?Af.lex:Af.lexInline)(n,i),a=i.hooks?await i.hooks.processAllTokens(r):r;i.walkTokens&&await Promise.all(this.walkTokens(a,i.walkTokens));let o=await(i.hooks?await i.hooks.provideParser():e?Nf.parse:Nf.parseInline)(a,i);return i.hooks?await i.hooks.postprocess(o):o})().catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let n=(i.hooks?i.hooks.provideLexer():e?Af.lex:Af.lexInline)(t,i);i.hooks&&(n=i.hooks.processAllTokens(n)),i.walkTokens&&this.walkTokens(n,i.walkTokens);let r=(i.hooks?i.hooks.provideParser():e?Nf.parse:Nf.parseInline)(n,i);return i.hooks&&(r=i.hooks.postprocess(r)),r}catch(e){return a(e)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+Sf(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}};function Q(e,t){return Ff.parse(e,t)}Q.options=Q.setOptions=function(e){return Ff.setOptions(e),Q.defaults=Ff.defaults,fd(Q.defaults),Q},Q.getDefaults=ud,Q.defaults=dd,Q.use=function(...e){return Ff.use(...e),Q.defaults=Ff.defaults,fd(Q.defaults),Q},Q.walkTokens=function(e,t){return Ff.walkTokens(e,t)},Q.parseInline=Ff.parseInline,Q.Parser=Nf,Q.parser=Nf.parse,Q.Renderer=jf,Q.TextRenderer=Mf,Q.Lexer=Af,Q.lexer=Af.lex,Q.Tokenizer=kf,Q.Hooks=Pf,Q.parse=Q,Q.options,Q.setOptions,Q.use,Q.walkTokens,Q.parseInline,Nf.parse,Af.lex,Q.use({gfm:!0,breaks:!1});function If(e,t={}){if(!e)return O;let n=t.inline?Q.parseInline(e,{async:!1}):Q.parse(e,{async:!1}),r=t.className??(t.inline?`pp-markdown-inline`:`pp-markdown`);return t.inline?D`<span class=${r}>${ld(String(n))}</span>`:D`<div class=${r}>${ld(String(n))}</div>`}function Lf(e,t=!1){let n=D`<a class="ref-link" href="models/${e.typeSlug}/${e.slug}.html">\u279c ${e.name}</a>`;return t?D`<pp-ref-popover registry-key="${e.componentType}/${e.name}">${n}</pp-ref-popover>`:n}function Rf(e,t){if(!e)return O;if(e.allOf&&Array.isArray(e.allOf)){let n=[],r=!0;for(let t of e.allOf){if(!t.$ref){r=!1;continue}let e=ad(t.$ref);e&&n.push({ref:t.$ref,link:e})}if(r&&n.length>0)return D`<span class="prop-type prop-type-link">
                ${n.map((e,n)=>D`
                    ${n>0?D` <span class="composition-separator">+</span> `:O}
                    ${t(e.ref,e.link)}
                `)}
            </span>`}if(e.type===`array`&&e.items?.allOf&&Array.isArray(e.items.allOf)){let n=[],r=!0;for(let t of e.items.allOf){if(!t.$ref){r=!1;continue}let e=ad(t.$ref);e&&n.push({ref:t.$ref,link:e})}if(r&&n.length>0)return D`<span class="prop-type prop-type-link">Array&lt;${n.map((e,n)=>D`
                ${n>0?D` <span class="composition-separator">+</span> `:O}
                ${t(e.ref,e.link)}
            `)}&gt;</span>`}if(e.type===`array`&&e.items?.$ref){let n=ad(e.items.$ref);if(n)return D`<span class="prop-type prop-type-link">Array&lt;${t(e.items.$ref,n)}&gt;</span>`}let n=e.oneOf??e.anyOf;if(n&&Array.isArray(n)){let e=[],r=!0;for(let t of n){if(!t.$ref){r=!1;break}let n=ad(t.$ref);n&&e.push({ref:t.$ref,link:n})}if(r&&e.length>0)return D`<span class="prop-type prop-type-link">
                ${e.map((e,n)=>D`
                    ${n>0?D` <span class="composition-separator">|</span> `:O}
                    ${t(e.ref,e.link)}
                `)}
            </span>`;let i=n.map(e=>e.title).filter(Boolean);if(i.length===n.length)return D`<span class="prop-type">${i.join(` | `)}</span>`}if(e.$ref){let n=ad(e.$ref);if(n)return D`<span class="prop-type prop-type-link">${t(e.$ref,n)}</span>`}let r=sd(e);return r?D`<span class="prop-type">${r}</span>`:O}function zf(e,t){if(!e)return O;let n=od(e,{includeExample:t?.includeExample});if(!n.length&&!e.enum?.length)return O;let r=t?.labelSuffix??``;return D`
        <div class="constraints">
            ${n.map(e=>D`
                <span class="constraint-label">${e.label}${r}</span>
                <span class="constraint-value">${e.isCode?D`<code>${e.value}</code>`:e.value}</span>
            `)}
            ${e.enum?.length?D`
                <div class="enum-section">
                    <span class="constraint-label">enum${r}</span>
                    <div class="enum-grid">${e.enum.map(e=>D`<span class="enum-value">${JSON.stringify(e)}</span>`)}</div>
                </div>
            `:O}
        </div>
    `}var Bf=E`
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
`,Vf=E`
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
`,Hf=E`
  :host {
    display: contents;
  }
`,Uf=class extends L{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>{this.emit(`sl-resize`,{detail:{entries:e}})}),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){let e=this.shadowRoot.querySelector(`slot`);if(e!==null){let t=e.assignedElements({flatten:!0});this.observedElements.forEach(e=>this.resizeObserver.unobserve(e)),this.observedElements=[],t.forEach(e=>{this.resizeObserver.observe(e),this.observedElements.push(e)})}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return D` <slot @slotchange=${this.handleSlotChange}></slot> `}};Uf.styles=[M,Hf],A([P({type:Boolean,reflect:!0})],Uf.prototype,`disabled`,2),A([j(`disabled`,{waitUntilFirstUpdate:!0})],Uf.prototype,`handleDisabledChange`,1);var Wf=class extends L{constructor(){super(...arguments),this.tabs=[],this.focusableTabs=[],this.panels=[],this.localize=new Dn(this),this.hasScrollControls=!1,this.shouldHideScrollStartButton=!1,this.shouldHideScrollEndButton=!1,this.placement=`top`,this.activation=`auto`,this.noScrollControls=!1,this.fixedScrollControls=!1,this.scrollOffset=1}connectedCallback(){let e=Promise.all([customElements.whenDefined(`sl-tab`),customElements.whenDefined(`sl-tab-panel`)]);super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(e=>{let t=e.filter(({target:e})=>{if(e===this)return!0;if(e.closest(`sl-tab-group`)!==this)return!1;let t=e.tagName.toLowerCase();return t===`sl-tab`||t===`sl-tab-panel`});if(t.length!==0){if(t.some(e=>![`aria-labelledby`,`aria-controls`].includes(e.attributeName))&&setTimeout(()=>this.setAriaLabels()),t.some(e=>e.attributeName===`disabled`))this.syncTabsAndPanels();else if(t.some(e=>e.attributeName===`active`)){let e=t.filter(e=>e.attributeName===`active`&&e.target.tagName.toLowerCase()===`sl-tab`).map(e=>e.target).find(e=>e.active);e&&this.setActiveTab(e)}}}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,attributeFilter:[`active`,`disabled`,`name`,`panel`],childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),e.then(()=>{new IntersectionObserver((e,t)=>{e[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab(this.getActiveTab()??this.tabs[0],{emitEvents:!1}),t.unobserve(e[0].target))}).observe(this.tabGroup)})})}disconnectedCallback(){var e,t;super.disconnectedCallback(),(e=this.mutationObserver)==null||e.disconnect(),this.nav&&((t=this.resizeObserver)==null||t.unobserve(this.nav))}getAllTabs(){return this.shadowRoot.querySelector(`slot[name="nav"]`).assignedElements()}getAllPanels(){return[...this.body.assignedElements()].filter(e=>e.tagName.toLowerCase()===`sl-tab-panel`)}getActiveTab(){return this.tabs.find(e=>e.active)}handleClick(e){let t=e.target.closest(`sl-tab`);t?.closest(`sl-tab-group`)===this&&t!==null&&this.setActiveTab(t,{scrollBehavior:`smooth`})}handleKeyDown(e){let t=e.target.closest(`sl-tab`);if(t?.closest(`sl-tab-group`)===this&&([`Enter`,` `].includes(e.key)&&t!==null&&(this.setActiveTab(t,{scrollBehavior:`smooth`}),e.preventDefault()),[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`].includes(e.key))){let t=this.tabs.find(e=>e.matches(`:focus`)),n=this.localize.dir()===`rtl`,r=null;if(t?.tagName.toLowerCase()===`sl-tab`){if(e.key===`Home`)r=this.focusableTabs[0];else if(e.key===`End`)r=this.focusableTabs[this.focusableTabs.length-1];else if([`top`,`bottom`].includes(this.placement)&&e.key===(n?`ArrowRight`:`ArrowLeft`)||[`start`,`end`].includes(this.placement)&&e.key===`ArrowUp`){let e=this.tabs.findIndex(e=>e===t);r=this.findNextFocusableTab(e,`backward`)}else if([`top`,`bottom`].includes(this.placement)&&e.key===(n?`ArrowLeft`:`ArrowRight`)||[`start`,`end`].includes(this.placement)&&e.key===`ArrowDown`){let e=this.tabs.findIndex(e=>e===t);r=this.findNextFocusableTab(e,`forward`)}if(!r)return;r.tabIndex=0,r.focus({preventScroll:!0}),this.activation===`auto`?this.setActiveTab(r,{scrollBehavior:`smooth`}):this.tabs.forEach(e=>{e.tabIndex=e===r?0:-1}),[`top`,`bottom`].includes(this.placement)&&ca(r,this.nav,`horizontal`),e.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()===`rtl`?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:`smooth`})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()===`rtl`?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:`smooth`})}setActiveTab(e,t){if(t=Lt({emitEvents:!0,scrollBehavior:`auto`},t),e!==this.activeTab&&!e.disabled){let n=this.activeTab;this.activeTab=e,this.tabs.forEach(e=>{e.active=e===this.activeTab,e.tabIndex=e===this.activeTab?0:-1}),this.panels.forEach(e=>e.active=e.name===this.activeTab?.panel),this.syncIndicator(),[`top`,`bottom`].includes(this.placement)&&ca(this.activeTab,this.nav,`horizontal`,t.scrollBehavior),t.emitEvents&&(n&&this.emit(`sl-tab-hide`,{detail:{name:n.panel}}),this.emit(`sl-tab-show`,{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(e=>{let t=this.panels.find(t=>t.name===e.panel);t&&(e.setAttribute(`aria-controls`,t.getAttribute(`id`)),t.setAttribute(`aria-labelledby`,e.getAttribute(`id`)))})}repositionIndicator(){let e=this.getActiveTab();if(!e)return;let t=e.clientWidth,n=e.clientHeight,r=this.localize.dir()===`rtl`,i=this.getAllTabs(),a=i.slice(0,i.indexOf(e)).reduce((e,t)=>({left:e.left+t.clientWidth,top:e.top+t.clientHeight}),{left:0,top:0});switch(this.placement){case`top`:case`bottom`:this.indicator.style.width=`${t}px`,this.indicator.style.height=`auto`,this.indicator.style.translate=r?`${-1*a.left}px`:`${a.left}px`;break;case`start`:case`end`:this.indicator.style.width=`auto`,this.indicator.style.height=`${n}px`,this.indicator.style.translate=`0 ${a.top}px`;break}}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.focusableTabs=this.tabs.filter(e=>!e.disabled),this.panels=this.getAllPanels(),this.syncIndicator(),this.updateComplete.then(()=>this.updateScrollControls())}findNextFocusableTab(e,t){let n=null,r=t===`forward`?1:-1,i=e+r;for(;e<this.tabs.length;){if(n=this.tabs[i]||null,n===null){n=t===`forward`?this.focusableTabs[0]:this.focusableTabs[this.focusableTabs.length-1];break}if(!n.disabled)break;i+=r}return n}updateScrollButtons(){this.hasScrollControls&&!this.fixedScrollControls&&(this.shouldHideScrollStartButton=this.scrollFromStart()<=this.scrollOffset,this.shouldHideScrollEndButton=this.isScrolledToEnd())}isScrolledToEnd(){return this.scrollFromStart()+this.nav.clientWidth>=this.nav.scrollWidth-this.scrollOffset}scrollFromStart(){return this.localize.dir()===`rtl`?-this.nav.scrollLeft:this.nav.scrollLeft}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=[`top`,`bottom`].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth+1,this.updateScrollButtons()}syncIndicator(){this.getActiveTab()?(this.indicator.style.display=`block`,this.repositionIndicator()):this.indicator.style.display=`none`}show(e){let t=this.tabs.find(t=>t.panel===e);t&&this.setActiveTab(t,{scrollBehavior:`smooth`})}render(){let e=this.localize.dir()===`rtl`;return D`
      <div
        part="base"
        class=${R({"tab-group":!0,"tab-group--top":this.placement===`top`,"tab-group--bottom":this.placement===`bottom`,"tab-group--start":this.placement===`start`,"tab-group--end":this.placement===`end`,"tab-group--rtl":this.localize.dir()===`rtl`,"tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?D`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${R({"tab-group__scroll-button":!0,"tab-group__scroll-button--start":!0,"tab-group__scroll-button--start--hidden":this.shouldHideScrollStartButton})}
                  name=${e?`chevron-right`:`chevron-left`}
                  library="system"
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term(`scrollToStart`)}
                  @click=${this.handleScrollToStart}
                ></sl-icon-button>
              `:``}

          <div class="tab-group__nav" @scrollend=${this.updateScrollButtons}>
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <sl-resize-observer @sl-resize=${this.syncIndicator}>
                <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
              </sl-resize-observer>
            </div>
          </div>

          ${this.hasScrollControls?D`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class=${R({"tab-group__scroll-button":!0,"tab-group__scroll-button--end":!0,"tab-group__scroll-button--end--hidden":this.shouldHideScrollEndButton})}
                  name=${e?`chevron-left`:`chevron-right`}
                  library="system"
                  tabindex="-1"
                  aria-hidden="true"
                  label=${this.localize.term(`scrollToEnd`)}
                  @click=${this.handleScrollToEnd}
                ></sl-icon-button>
              `:``}
        </div>

        <slot part="body" class="tab-group__body" @slotchange=${this.syncTabsAndPanels}></slot>
      </div>
    `}};Wf.styles=[M,Vf],Wf.dependencies={"sl-icon-button":B,"sl-resize-observer":Uf},A([I(`.tab-group`)],Wf.prototype,`tabGroup`,2),A([I(`.tab-group__body`)],Wf.prototype,`body`,2),A([I(`.tab-group__nav`)],Wf.prototype,`nav`,2),A([I(`.tab-group__indicator`)],Wf.prototype,`indicator`,2),A([F()],Wf.prototype,`hasScrollControls`,2),A([F()],Wf.prototype,`shouldHideScrollStartButton`,2),A([F()],Wf.prototype,`shouldHideScrollEndButton`,2),A([P()],Wf.prototype,`placement`,2),A([P()],Wf.prototype,`activation`,2),A([P({attribute:`no-scroll-controls`,type:Boolean})],Wf.prototype,`noScrollControls`,2),A([P({attribute:`fixed-scroll-controls`,type:Boolean})],Wf.prototype,`fixedScrollControls`,2),A([qt({passive:!0})],Wf.prototype,`updateScrollButtons`,1),A([j(`noScrollControls`,{waitUntilFirstUpdate:!0})],Wf.prototype,`updateScrollControls`,1),A([j(`placement`,{waitUntilFirstUpdate:!0})],Wf.prototype,`syncIndicator`,1),Wf.define(`sl-tab-group`);var Gf=(e,t)=>{let n=0;return function(...r){window.clearTimeout(n),n=window.setTimeout(()=>{e.call(this,...r)},t)}},Kf=(e,t,n)=>{let r=e[t];e[t]=function(...e){r.call(this,...e),n.call(this,r,...e)}};(()=>{if(!(typeof window>`u`)&&!(`onscrollend`in window)){let e=new Set,t=new WeakMap,n=t=>{for(let n of t.changedTouches)e.add(n.identifier)},r=t=>{for(let n of t.changedTouches)e.delete(n.identifier)};document.addEventListener(`touchstart`,n,!0),document.addEventListener(`touchend`,r,!0),document.addEventListener(`touchcancel`,r,!0),Kf(EventTarget.prototype,`addEventListener`,function(n,r){if(r!==`scrollend`)return;let i=Gf(()=>{e.size?i():this.dispatchEvent(new Event(`scrollend`))},100);n.call(this,`scroll`,i,{passive:!0}),t.set(this,i)}),Kf(EventTarget.prototype,`removeEventListener`,function(e,n){if(n!==`scrollend`)return;let r=t.get(this);r&&e.call(this,`scroll`,r,{passive:!0})})}})();var qf=E`
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
`,Jf=0,Yf=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.attrId=++Jf,this.componentId=`sl-tab-${this.attrId}`,this.panel=``,this.active=!1,this.closable=!1,this.disabled=!1,this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`tab`)}handleCloseClick(e){e.stopPropagation(),this.emit(`sl-close`)}handleActiveChange(){this.setAttribute(`aria-selected`,this.active?`true`:`false`)}handleDisabledChange(){this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`),this.disabled&&!this.active?this.tabIndex=-1:this.tabIndex=0}render(){return this.id=this.id.length>0?this.id:this.componentId,D`
      <div
        part="base"
        class=${R({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
      >
        <slot></slot>
        ${this.closable?D`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term(`close`)}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            `:``}
      </div>
    `}};Yf.styles=[M,qf],Yf.dependencies={"sl-icon-button":B},A([I(`.tab`)],Yf.prototype,`tab`,2),A([P({reflect:!0})],Yf.prototype,`panel`,2),A([P({type:Boolean,reflect:!0})],Yf.prototype,`active`,2),A([P({type:Boolean,reflect:!0})],Yf.prototype,`closable`,2),A([P({type:Boolean,reflect:!0})],Yf.prototype,`disabled`,2),A([P({type:Number,reflect:!0})],Yf.prototype,`tabIndex`,2),A([j(`active`)],Yf.prototype,`handleActiveChange`,1),A([j(`disabled`)],Yf.prototype,`handleDisabledChange`,1),Yf.define(`sl-tab`);var Xf=E`
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
`,Zf=0,Qf=class extends L{constructor(){super(...arguments),this.attrId=++Zf,this.componentId=`sl-tab-panel-${this.attrId}`,this.name=``,this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute(`role`,`tabpanel`)}handleActiveChange(){this.setAttribute(`aria-hidden`,this.active?`false`:`true`)}render(){return D`
      <slot
        part="base"
        class=${R({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};Qf.styles=[M,Xf],A([P({reflect:!0})],Qf.prototype,`name`,2),A([P({type:Boolean,reflect:!0})],Qf.prototype,`active`,2),A([j(`active`)],Qf.prototype,`handleActiveChange`,1),Qf.define(`sl-tab-panel`);var $f=[Mu,E`
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
`],ep=class extends k{constructor(...e){super(...e),this.schemaJson=``,this.compact=!1,this.condensed=!1,this.schema=null}static{this.styles=[$u,ed,...$f]}willUpdate(e){if(e.has(`schemaJson`)&&this.schemaJson)try{this.schema=JSON.parse(this.schemaJson),this.computeNameColumnWidth()}catch{this.schema=null}}parseRegistrySchema(e,t){if(t.has(e))return null;let n=h(e);if(!n?.schemaJson)return null;try{return t.add(e),JSON.parse(n.schemaJson)}catch{return null}}collectRenderedNameMetrics(e,t=new Set){if(!e||typeof e!=`object`)return{maxLen:0,hasRequired:!1};let n=0,r=!1,i=e.properties,a=new Set(e.required??[]);if(i&&typeof i==`object`)for(let[e,o]of Object.entries(i)){n=Math.max(n,e.length),a.has(e)&&(r=!0);let i=this.collectRenderedNameMetrics(o,t);n=Math.max(n,i.maxLen),r||=i.hasRequired}for(let i of[`allOf`,`oneOf`,`anyOf`]){let a=e[i];if(Array.isArray(a))for(let e of a){if(e?.$ref){let i=this.parseRegistrySchema(e.$ref,t);if(!i)continue;let a=this.collectRenderedNameMetrics(i,t);n=Math.max(n,a.maxLen),r||=a.hasRequired;continue}let i=this.collectRenderedNameMetrics(e,t);n=Math.max(n,i.maxLen),r||=i.hasRequired}}if(e.items){let i=e.items;if(i.$ref){let e=this.parseRegistrySchema(i.$ref,t);if(e){let i=this.collectRenderedNameMetrics(e,t);n=Math.max(n,i.maxLen),r||=i.hasRequired}}else{let e=this.collectRenderedNameMetrics(i,t);n=Math.max(n,e.maxLen),r||=e.hasRequired}}return{maxLen:n,hasRequired:r}}computeNameColumnWidth(){if(!this.schema)return;let{maxLen:e,hasRequired:t}=this.collectRenderedNameMetrics(this.schema),n=t?70:0,r=Math.max(150,e*8.5+n+16);this.style.setProperty(`--compact-name-width`,`${Math.round(r)}px`)}renderRefAnchor(e,t){return D`
            <pp-ref-popover schema-ref="${e}">${D`<a class="ref-type-link" href="${t.href}">\u279c ${t.name}</a>`}</pp-ref-popover>`}renderType(e){return Rf(e,(e,t)=>this.renderRefAnchor(e,t))}renderPropertyRow(e,t,n){return D`
            <div class="property">
                <div class="prop-name-col">
                    ${n.has(e)?D`<span class="required-badge">req</span>`:O}
                    <span class="prop-name ${n.has(e)?`required`:``}">${e}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(t)}
                    ${zf(t,{labelSuffix:`:`})}
                </div>
                <div class="prop-desc-col">
                    ${If(t.description)}
                </div>
            </div>
        `}renderPropertyTable(e,t){let n=Object.entries(e);return n.length?n.map(([e,n])=>{let r=n.oneOf??n.anyOf;return r&&Array.isArray(r)?D`
                    <div class="property-oneof">
                        ${this.renderOneOf(r,e,n.description,t.has(e),`polymorphic`)}
                    </div>
                `:this.renderPropertyRow(e,n,t)}):O}renderCompositionRefs(e){return D`
            <div class="composition-refs">
                <span class="composition-label">Composed from</span>
                ${e.map(e=>{let t=ad(e.$ref);if(!t)return O;let n=h(e.$ref)?.description??``;return D`
                        <div class="composition-ref-entry">
                            <span class="composition-ref-link">${this.renderRefAnchor(e.$ref,t)}</span>
                            ${n?If(n,{className:`composition-ref-desc pp-markdown`}):O}
                        </div>
                    `})}
            </div>
        `}mergePropertyMaps(e,t){for(let[n,r]of Object.entries(t))e[n]=r}collectCompositionData(e,t=new Set){let n=[],r=new Set(e?.required||[]),i={};e?.properties&&this.mergePropertyMaps(i,e.properties);let a=Array.isArray(e?.allOf)?e.allOf:[];for(let e of a){if(e?.$ref){n.push(e);let a=this.parseRegistrySchema(e.$ref,t);if(!a)continue;let o=this.collectCompositionData(a,t);o.refEntries.length&&n.push(...o.refEntries),this.mergePropertyMaps(i,o.mergedProperties);for(let e of o.mergedRequired)r.add(e);continue}if(e?.allOf&&Array.isArray(e.allOf)){let a=this.collectCompositionData(e,t);a.refEntries.length&&n.push(...a.refEntries),this.mergePropertyMaps(i,a.mergedProperties);for(let e of a.mergedRequired)r.add(e);continue}if(e?.properties&&this.mergePropertyMaps(i,e.properties),e?.required)for(let t of e.required)r.add(t)}return{refEntries:n,mergedRequired:r,mergedProperties:i}}renderComposition(e){let{refEntries:t,mergedRequired:n,mergedProperties:r}=this.collectCompositionData(e),i=t.filter((e,n)=>e?.$ref&&t.findIndex(t=>t?.$ref===e.$ref)===n);return D`
            ${i.length?this.renderCompositionRefs(i):O}
            ${Object.keys(r).length?this.renderPropertyTable(r,n):O}
        `}renderOneOf(e,t,n,r,i){return e.length?D`
            <div class="oneof-property">
                <div class="oneof-left">
                    ${t?D`
                        <div class="oneof-prop-name">
                            ${r?D`<span class="required-badge">req</span>`:O}
                            <span class="prop-name">${t}</span>
                            ${i?D`<div class="composition-label polymorphic">(${i})</div>`:O}
                        </div>
                    `:O}
                    ${n?If(n,{className:`oneof-prop-desc pp-markdown`}):O}
                </div>
                <div class="oneof-desc-container">
                    <sl-tab-group class="oneof-tabs" placement="start">
                        ${e.map((e,t)=>D`
                            <sl-tab slot="nav" panel="oneof-${t}" class="oneof-tab" ?active=${t===0}>
                                \u203A ${e.title||e.$ref?.split(`/`).pop()||`Option ${t+1}`}
                            </sl-tab>
                        `)}
                        ${e.map((e,t)=>D`
                            <sl-tab-panel name="oneof-${t}" ?active=${t===0}>
                                ${this.renderOneOfOption(e)}
                            </sl-tab-panel>
                        `)}
                    </sl-tab-group>
                </div>
            </div>
        `:O}renderOneOfOption(e){if(e.$ref){let t=ad(e.$ref);if(!t)return O;let n=h(e.$ref);return D`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(e.$ref,t)}
                    ${n?.description?If(n.description,{className:`oneof-option-desc pp-markdown`}):O}
                </div>
            `}let t=new Set(e.required||[]),n=sd(e);return D`
            ${e.description?If(e.description,{className:`oneof-option-desc pp-markdown`}):O}
            ${e.properties?this.renderPropertyTable(e.properties,t):n?D`<div class="oneof-option-scalar"><span class="prop-type">${n}</span>${zf(e,{labelSuffix:`:`})}</div>`:O}
        `}render(){if(!this.schema)return O;let e=this.schema.type===`array`&&(this.schema.items?.properties||this.schema.items?.allOf||this.schema.items?.oneOf||this.schema.items?.anyOf)?this.schema.items:this.schema;if(e.allOf&&Array.isArray(e.allOf))return this.renderComposition(e);if(e.oneOf&&Array.isArray(e.oneOf))return this.renderOneOf(e.oneOf,`ONE OF`,void 0,void 0,`polymorphic`);if(e.anyOf&&Array.isArray(e.anyOf))return this.renderOneOf(e.anyOf,`ANY OF`,void 0,void 0,`polymorphic`);let t=e.properties||{},n=new Set(e.required||[]);if(!Object.entries(t).length){let t=sd(e);return!t&&!e.description?O:D`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${t?D`<span class="prop-type">${t}</span>`:O}
                        ${zf(e,{labelSuffix:`:`})}
                    </div>
                    <div class="prop-desc-col">
                        ${If(e.description)}
                    </div>
                </div>
            `}return this.renderPropertyTable(t,n)}};q([P({attribute:`schema-json`})],ep.prototype,`schemaJson`,void 0),q([P({type:Boolean,reflect:!0})],ep.prototype,`compact`,void 0),q([P({type:Boolean,reflect:!0})],ep.prototype,`condensed`,void 0),q([F()],ep.prototype,`schema`,void 0),ep=q([N(`pp-schema-properties`)],ep);var tp=l(s(((e,t)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,r={},i={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/\u00a0/g,` `)},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,`__id`,{value:++n}),e.__id},clone:function e(t,n){n||={};var r,a;switch(i.util.type(t)){case`Object`:if(a=i.util.objId(t),n[a])return n[a];for(var o in r={},n[a]=r,t)t.hasOwnProperty(o)&&(r[o]=e(t[o],n));return r;case`Array`:return a=i.util.objId(t),n[a]?n[a]:(r=[],n[a]=r,t.forEach(function(t,i){r[i]=e(t,n)}),r);default:return t}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return`none`},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,`gi`),``),e.classList.add(`language-`+n)},currentScript:function(){if(typeof document>`u`)return null;if(document.currentScript&&document.currentScript.tagName===`SCRIPT`)return document.currentScript;try{throw Error()}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var t=document.getElementsByTagName(`script`);for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var r=`no-`+t;e;){var i=e.classList;if(i.contains(t))return!0;if(i.contains(r))return!1;e=e.parentElement}return!!n}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,t){var n=i.util.clone(i.languages[e]);for(var r in t)n[r]=t[r];return n},insertBefore:function(e,t,n,r){r||=i.languages;var a=r[e],o={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var c in n)n.hasOwnProperty(c)&&(o[c]=n[c]);n.hasOwnProperty(s)||(o[s]=a[s])}var l=r[e];return r[e]=o,i.languages.DFS(i.languages,function(t,n){n===l&&t!=e&&(this[t]=o)}),o},DFS:function e(t,n,r,a){a||={};var o=i.util.objId;for(var s in t)if(t.hasOwnProperty(s)){n.call(t,s,t[s],r||s);var c=t[s],l=i.util.type(c);l===`Object`&&!a[o(c)]?(a[o(c)]=!0,e(c,n,null,a)):l===`Array`&&!a[o(c)]&&(a[o(c)]=!0,e(c,n,s,a))}}},plugins:{},highlightAll:function(e,t){i.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var r={callback:n,container:e,selector:`code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code`};i.hooks.run(`before-highlightall`,r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),i.hooks.run(`before-all-elements-highlight`,r);for(var a=0,o;o=r.elements[a++];)i.highlightElement(o,t===!0,r.callback)},highlightElement:function(t,n,r){var a=i.util.getLanguage(t),o=i.languages[a];i.util.setLanguage(t,a);var s=t.parentElement;s&&s.nodeName.toLowerCase()===`pre`&&i.util.setLanguage(s,a);var c={element:t,language:a,grammar:o,code:t.textContent};function l(e){c.highlightedCode=e,i.hooks.run(`before-insert`,c),c.element.innerHTML=c.highlightedCode,i.hooks.run(`after-highlight`,c),i.hooks.run(`complete`,c),r&&r.call(c.element)}if(i.hooks.run(`before-sanity-check`,c),s=c.element.parentElement,s&&s.nodeName.toLowerCase()===`pre`&&!s.hasAttribute(`tabindex`)&&s.setAttribute(`tabindex`,`0`),!c.code){i.hooks.run(`complete`,c),r&&r.call(c.element);return}if(i.hooks.run(`before-highlight`,c),!c.grammar){l(i.util.encode(c.code));return}if(n&&e.Worker){var u=new Worker(i.filename);u.onmessage=function(e){l(e.data)},u.postMessage(JSON.stringify({language:c.language,code:c.code,immediateClose:!0}))}else l(i.highlight(c.code,c.grammar,c.language))},highlight:function(e,t,n){var r={code:e,grammar:t,language:n};if(i.hooks.run(`before-tokenize`,r),!r.grammar)throw Error(`The language "`+r.language+`" has no grammar.`);return r.tokens=i.tokenize(r.code,r.grammar),i.hooks.run(`after-tokenize`,r),a.stringify(i.util.encode(r.tokens),r.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var r in n)t[r]=n[r];delete t.rest}var i=new c;return l(i,i.head,e),s(e,i,t,i.head,0),d(i)},hooks:{all:{},add:function(e,t){var n=i.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=i.hooks.all[e];if(!(!n||!n.length))for(var r=0,a;a=n[r++];)a(t)}},Token:a};e.Prism=i;function a(e,t,n,r){this.type=e,this.content=t,this.alias=n,this.length=(r||``).length|0}a.stringify=function e(t,n){if(typeof t==`string`)return t;if(Array.isArray(t)){var r=``;return t.forEach(function(t){r+=e(t,n)}),r}var a={type:t.type,content:e(t.content,n),tag:`span`,classes:[`token`,t.type],attributes:{},language:n},o=t.alias;o&&(Array.isArray(o)?Array.prototype.push.apply(a.classes,o):a.classes.push(o)),i.hooks.run(`wrap`,a);var s=``;for(var c in a.attributes)s+=` `+c+`="`+(a.attributes[c]||``).replace(/"/g,`&quot;`)+`"`;return`<`+a.tag+` class="`+a.classes.join(` `)+`"`+s+`>`+a.content+`</`+a.tag+`>`};function o(e,t,n,r){e.lastIndex=t;var i=e.exec(n);if(i&&r&&i[1]){var a=i[1].length;i.index+=a,i[0]=i[0].slice(a)}return i}function s(e,t,n,r,c,d){for(var f in n)if(!(!n.hasOwnProperty(f)||!n[f])){var p=n[f];p=Array.isArray(p)?p:[p];for(var m=0;m<p.length;++m){if(d&&d.cause==f+`,`+m)return;var h=p[m],g=h.inside,_=!!h.lookbehind,v=!!h.greedy,y=h.alias;if(v&&!h.pattern.global){var ee=h.pattern.toString().match(/[imsuy]*$/)[0];h.pattern=RegExp(h.pattern.source,ee+`g`)}for(var b=h.pattern||h,x=r.next,S=c;x!==t.tail&&!(d&&S>=d.reach);S+=x.value.length,x=x.next){var C=x.value;if(t.length>e.length)return;if(!(C instanceof a)){var w=1,te;if(v){if(te=o(b,S,e,_),!te||te.index>=e.length)break;var ne=te.index,re=te.index+te[0].length,ie=S;for(ie+=x.value.length;ne>=ie;)x=x.next,ie+=x.value.length;if(ie-=x.value.length,S=ie,x.value instanceof a)continue;for(var T=x;T!==t.tail&&(ie<re||typeof T.value==`string`);T=T.next)w++,ie+=T.value.length;w--,C=e.slice(S,ie),te.index-=S}else if(te=o(b,0,C,_),!te)continue;var ne=te.index,ae=te[0],oe=C.slice(0,ne),se=C.slice(ne+ae.length),ce=S+C.length;d&&ce>d.reach&&(d.reach=ce);var E=x.prev;oe&&(E=l(t,E,oe),S+=oe.length),u(t,E,w);var le=new a(f,g?i.tokenize(ae,g):ae,y,ae);if(x=l(t,E,le),se&&l(t,x,se),w>1){var ue={cause:f+`,`+m,reach:ce};s(e,t,n,x.prev,S,ue),d&&ue.reach>d.reach&&(d.reach=ue.reach)}}}}}}function c(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function l(e,t,n){var r=t.next,i={value:n,prev:t,next:r};return t.next=i,r.prev=i,e.length++,i}function u(e,t,n){for(var r=t.next,i=0;i<n&&r!==e.tail;i++)r=r.next;t.next=r,r.prev=t,e.length-=i}function d(e){for(var t=[],n=e.head.next;n!==e.tail;)t.push(n.value),n=n.next;return t}if(!e.document)return e.addEventListener&&(i.disableWorkerMessageHandler||e.addEventListener(`message`,function(t){var n=JSON.parse(t.data),r=n.language,a=n.code,o=n.immediateClose;e.postMessage(i.highlight(a,i.languages[r],r)),o&&e.close()},!1)),i;var f=i.util.currentScript();f&&(i.filename=f.src,f.hasAttribute(`data-manual`)&&(i.manual=!0));function p(){i.manual||i.highlightAll()}if(!i.manual){var m=document.readyState;m===`loading`||m===`interactive`&&f&&f.defer?document.addEventListener(`DOMContentLoaded`,p):window.requestAnimationFrame?window.requestAnimationFrame(p):window.setTimeout(p,16)}return i}(typeof window<`u`?window:typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope?self:{});t!==void 0&&t.exports&&(t.exports=n),typeof global<`u`&&(global.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside[`attr-value`].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside[`internal-subset`].inside=n.languages.markup,n.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(n.languages.markup.tag,`addInlined`,{value:function(e,t){var r={};r[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i[`language-`+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var a={};a[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:i},n.languages.insertBefore(`markup`,`cdata`,a)}}),Object.defineProperty(n.languages.markup.tag,`addAttribute`,{value:function(e,t){n.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend(`markup`,{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,(function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|`+t.source+`)*?(?:;|(?=\\s*\\{))`),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:`selector`},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp(`\\burl\\((?:`+t.source+`|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`,`i`),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp(`^`+t.source+`$`),alias:`url`}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+t.source+`)*(?=\\s*\\{)`),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined(`style`,`css`),n.tag.addAttribute(`style`,`css`))})(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend(`clike`,{"class-name":[n.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),n.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),n.languages.markup&&(n.languages.markup.tag.addInlined(`script`,`javascript`),n.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),n.languages.js=n.languages.javascript,(function(){if(n===void 0||typeof document>`u`)return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e=`Loading…`,t=function(e,t){return`✖ Error `+e+` while fetching file: `+t},r=`✖ Error: File does not exist or is empty`,i={js:`javascript`,py:`python`,rb:`ruby`,ps1:`powershell`,psm1:`powershell`,sh:`bash`,bat:`batch`,h:`c`,tex:`latex`},a=`data-src-status`,o=`loading`,s=`loaded`,c=`failed`,l=`pre[data-src]:not([`+a+`="`+s+`"]):not([`+a+`="`+o+`"])`;function u(e,n,i){var a=new XMLHttpRequest;a.open(`GET`,e,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?n(a.responseText):a.status>=400?i(t(a.status,a.statusText)):i(r))},a.send(null)}function d(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||``);if(t){var n=Number(t[1]),r=t[2],i=t[3];return r?i?[n,Number(i)]:[n,void 0]:[n,n]}}n.hooks.add(`before-highlightall`,function(e){e.selector+=`, `+l}),n.hooks.add(`before-sanity-check`,function(t){var r=t.element;if(r.matches(l)){t.code=``,r.setAttribute(a,o);var f=r.appendChild(document.createElement(`CODE`));f.textContent=e;var p=r.getAttribute(`data-src`),m=t.language;if(m===`none`){var h=(/\.(\w+)$/.exec(p)||[,`none`])[1];m=i[h]||h}n.util.setLanguage(f,m),n.util.setLanguage(r,m);var g=n.plugins.autoloader;g&&g.loadLanguages(m),u(p,function(e){r.setAttribute(a,s);var t=d(r.getAttribute(`data-range`));if(t){var i=e.split(/\r\n?|\n/g),o=t[0],c=t[1]==null?i.length:t[1];o<0&&(o+=i.length),o=Math.max(0,Math.min(o-1,i.length)),c<0&&(c+=i.length),c=Math.max(0,Math.min(c,i.length)),e=i.slice(o,c).join(`
`),r.hasAttribute(`data-start`)||r.setAttribute(`data-start`,String(o+1))}f.textContent=e,n.highlightElement(f)},function(e){r.setAttribute(a,c),f.textContent=e})}}),n.plugins.fileHighlight={highlight:function(e){for(var t=(e||document).querySelectorAll(l),r=0,i;i=t[r++];)n.highlightElement(i)}};var f=!1;n.fileHighlight=function(){f||=(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}})()}))(),1);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:`keyword`}},Prism.languages.webmanifest=Prism.languages.json,(function(e){var t=/[*&][^\s[\]{},]+/,n=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r=`(?:`+n.source+`(?:[ 	]+`+t.source+`)?|`+t.source+`(?:[ 	]+`+n.source+`)?)`,i=`(?:[^\\s\\x00-\\x08\\x0e-\\x1f!"#%&'*,\\-:>?@[\\]\`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \\t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*`.replace(/<PLAIN>/g,function(){return`[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]`}),a=`"(?:[^"\\\\\\r\\n]|\\\\.)*"|'(?:[^'\\\\\\r\\n]|\\\\.)*'`;function o(e,t){t=(t||``).replace(/m/g,``)+`m`;var n=`([:\\-,[{]\\s*(?:\\s<<prop>>[ \\t]+)?)(?:<<value>>)(?=[ \\t]*(?:$|,|\\]|\\}|(?:[\\r\\n]\\s*)?#))`.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return e});return RegExp(n,t)}e.languages.yaml={scalar:{pattern:RegExp(`([\\-:]\\s*(?:\\s<<prop>>[ \\t]+)?[|>])[ \\t]*(?:((?:\\r?\\n|\\r)[ \\t]+)\\S[^\\r\\n]*(?:\\2[^\\r\\n]+)*)`.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:`string`},comment:/#.*/,key:{pattern:RegExp(`((?:^|[:\\-,[{\\r\\n?])[ \\t]*(?:<<prop>>[ \\t]+)?)<<key>>(?=\\s*:\\s)`.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return`(?:`+i+`|`+a+`)`})),lookbehind:!0,greedy:!0,alias:`atrule`},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:`important`},datetime:{pattern:o(`\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \\t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \\t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?`),lookbehind:!0,alias:`number`},boolean:{pattern:o(`false|true`,`i`),lookbehind:!0,alias:`important`},null:{pattern:o(`null|~`,`i`),lookbehind:!0,alias:`important`},string:{pattern:o(a),lookbehind:!0,greedy:!0},number:{pattern:o(`[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)`,`i`),lookbehind:!0},tag:n,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism),Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside[`attr-value`].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside[`internal-subset`].inside=Prism.languages.markup,Prism.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(Prism.languages.markup.tag,`addInlined`,{value:function(e,t){var n={};n[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[t]},n.cdata=/^<!\[CDATA\[|\]\]>$/i;var r={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:n}};r[`language-`+t]={pattern:/[\s\S]+/,inside:Prism.languages[t]};var i={};i[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:r},Prism.languages.insertBefore(`markup`,`cdata`,i)}}),Object.defineProperty(Prism.languages.markup.tag,`addAttribute`,{value:function(e,t){Prism.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend(`markup`,{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;var np=E`
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
`;tp.default.manual=!0;var rp=class extends k{constructor(...e){super(...e),this.code=``,this.language=`json`,this.pretty=!1,this.lineNumbers=!1,this.highlightLines=``,this.startLine=1,this.location=``,this.embedded=!1,this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:``,language:``,segments:[]},this._highlightCache={spec:``,parsed:new Set}}static{this.styles=[np]}get displayCode(){if(!this.code)return``;if(this.pretty&&this.language===`json`)try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(e){let t=new Set;if(!e)return t;for(let n of e.split(`,`)){let e=n.trim().match(/^(\d+)(?:-(\d+))?$/);if(!e)continue;let r=parseInt(e[1],10),i=e[2]?parseInt(e[2],10):r;for(let e=Math.min(r,i);e<=Math.max(r,i);e++)t.add(e)}return t}highlightCode(){let e=this.displayCode;if(!e)return``;try{let t=this.language===`xml`?`markup`:this.language;return tp.default.highlight(e,tp.default.languages[t],t)}catch{return e}}splitHighlightedLines(e){let t=[],n=``,r=[],i=0;for(;i<e.length;)if(e[i]===`
`){for(let e=r.length-1;e>=0;e--)n+=`</span>`;t.push(n),n=r.join(``),i++}else if(e[i]===`<`)if(e.startsWith(`</span>`,i))n+=`</span>`,r.pop(),i+=7;else{let t=e.indexOf(`>`,i);if(t===-1){n+=e[i],i++;continue}let a=e.slice(i,t+1);n+=a,a.startsWith(`</`)||r.push(a),i=t+1}else n+=e[i],i++;for(let e=r.length-1;e>=0;e--)n+=`</span>`;return n&&t.push(n),t}getLineSegments(){let e=this.displayCode;if(e===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;let t=this.highlightCode(),n=t?this.splitHighlightedLines(t):[];return this._segmentCache={code:e,language:this.language,segments:n},n}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){let e=this.parsedHighlights;return e.size>0?e:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}handleLineClick(e,t){if(this.isLocked)return;let n=new Set;if(t.shiftKey&&this.lastClickedLine!==null){let t=Math.min(this.lastClickedLine,e),r=Math.max(this.lastClickedLine,e);for(let e=t;e<=r;e++)n.add(e)}else this.selectedLines.size===1&&this.selectedLines.has(e)||n.add(e);this.selectedLines=n,this.lastClickedLine=e}willUpdate(e){(e.has(`code`)||e.has(`language`))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return this.location?D`<div class="location">${this.location}</div>`:O}render(){if(!this.lineNumbers)return D`
              ${this.renderLocation()}
              <pre class="language-${this.language}"><code>${ld(this.highlightCode())}</code></pre>
            `;let e=this.getLineSegments(),t=Math.max(this.startLine,1),n=t+e.length-1,r=n>0?Math.floor(Math.log10(n))+1:1,i=this.effectiveHighlights,a=this.isLocked;return D`
          ${this.renderLocation()}
          <div class="lined-code${a?` locked`:``}" style="--gutter-digits: ${r}">
            <pre class="language-${this.language}"><code>${e.map((e,n)=>{let r=t+n;return D`<span class="line${i.has(r)?` highlighted`:``}"
                ><span class="line-number"
                       @click=${e=>this.handleLineClick(r,e)}
                >${r}</span><span class="line-content">${ld(e||` `)}</span>
</span>`})}</code></pre>
          </div>
        `}};q([P()],rp.prototype,`code`,void 0),q([P()],rp.prototype,`language`,void 0),q([P({type:Boolean})],rp.prototype,`pretty`,void 0),q([P({attribute:`line-numbers`,type:Boolean})],rp.prototype,`lineNumbers`,void 0),q([P({attribute:`highlight-lines`})],rp.prototype,`highlightLines`,void 0),q([P({attribute:`start-line`,type:Number})],rp.prototype,`startLine`,void 0),q([P()],rp.prototype,`location`,void 0),q([P({type:Boolean,reflect:!0})],rp.prototype,`embedded`,void 0),q([F()],rp.prototype,`selectedLines`,void 0),q([F()],rp.prototype,`lastClickedLine`,void 0),rp=q([N(`pp-code-viewer`)],rp);var ip=E`
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
`,ap=class extends k{constructor(...e){super(...e),this.icon=``,this.heading=``,this.level=1,this.size=`huge`}static{this.styles=[ip]}render(){if(!this.heading)return O;let e=fn(`h${Math.min(Math.max(this.level,1),6)}`);return hn`
            <pb33f-model-icon icon=${this.icon} size=${this.size}></pb33f-model-icon>
            <${e}>${this.heading}</${e}>
        `}};q([P()],ap.prototype,`icon`,void 0),q([P()],ap.prototype,`heading`,void 0),q([P({type:Number})],ap.prototype,`level`,void 0),q([P()],ap.prototype,`size`,void 0),ap=q([N(`pp-icon-title`)],ap);var op=class extends k{constructor(...e){super(...e),this.registryKey=``,this.schemaRef=``,this.active=!1,this.entry=null,this.parsedData=null}static{this.styles=Bf}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.showTimeout),clearTimeout(this.hideTimeout),this.active=!1}show(){clearTimeout(this.hideTimeout),this.showTimeout=window.setTimeout(()=>{if(this.entry=(this.registryKey?m(this.registryKey):h(this.schemaRef))??null,this.entry){try{this.parsedData=JSON.parse(this.entry.schemaJson)}catch{this.parsedData=null}this.active=!0}},300)}hide(){clearTimeout(this.showTimeout),this.hideTimeout=window.setTimeout(()=>{this.active=!1},200)}cancelHide(){clearTimeout(this.hideTimeout)}resolveExample(){if(this.entry?.mockJson)return this.entry.mockJson;let e=this.parsedData;return e?e.schema?.example===void 0?e.example===void 0?Array.isArray(e.examples)&&e.examples.length>0?JSON.stringify(e.examples[0]):null:JSON.stringify(e.example):JSON.stringify(e.schema.example):null}getSchemaJson(){if(!this.entry)return``;let e=this.parsedData;return e&&e.schema?JSON.stringify(e.schema):this.entry.schemaJson}formatJson(e){try{return JSON.stringify(JSON.parse(e),null,2)}catch{return e}}render(){let e=this.resolveExample(),t=this.getSchemaJson();return D`
            <span class="trigger"
                @mouseenter=${this.show}
                @mouseleave=${this.hide}
                @click=${()=>{this.active=!1}}>
                <slot></slot>
            </span>
            ${this.active&&this.entry?D`
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
                            <pp-schema-properties compact condensed schema-json=${t}></pp-schema-properties>
                        </div>
                        ${e?D`
                            <div class="popover-example">
                                <div class="example-label">Example</div>
                                <pp-code-viewer
                                    .code=${this.formatJson(e)}
                                    language="json">
                                </pp-code-viewer>
                            </div>
                        `:O}
                    </div>
                </sl-popup>
            `:O}
        `}};q([P({attribute:`registry-key`})],op.prototype,`registryKey`,void 0),q([P({attribute:`schema-ref`})],op.prototype,`schemaRef`,void 0),q([F()],op.prototype,`active`,void 0),q([F()],op.prototype,`entry`,void 0),q([F()],op.prototype,`parsedData`,void 0),q([I(`.trigger`)],op.prototype,`trigger`,void 0),op=q([N(`pp-ref-popover`)],op);var sp=E`
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
`,cp=class extends k{constructor(...e){super(...e),this.extensionsJson=``,this.extensions=[]}static{this.styles=sp}willUpdate(e){if(e.has(`extensionsJson`))if(this.extensionsJson)try{this.extensions=JSON.parse(this.extensionsJson)}catch{this.extensions=[]}else this.extensions=[]}renderValue(e){return e==null?O:typeof e==`object`?D`<pp-code-viewer code=${JSON.stringify(e,null,2)} language="json"></pp-code-viewer>`:D`<span class="ext-scalar">${String(e)}</span>`}render(){return this.extensions.length?D`<div class="ext-grid">
      ${this.extensions.map(e=>D`
        <div class="ext-key">${e.key}</div>
        <div class="ext-value">${this.renderValue(e.value)}</div>
      `)}
    </div>`:O}};q([P({attribute:`extensions-json`})],cp.prototype,`extensionsJson`,void 0),q([F()],cp.prototype,`extensions`,void 0),cp=q([N(`pp-extensions`)],cp);var lp=class extends k{constructor(...e){super(...e),this.parametersJson=``,this.params=[]}static{this.styles=[vu,$u,ed,td,nd]}willUpdate(e){if(e.has(`parametersJson`)&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}inIcon(e){switch(e){case`cookie`:return`cookie`;case`header`:return`envelope`;case`path`:return`signpost`;case`query`:return`question-diamond`;default:return`question-diamond`}}parseSchema(e){if(!e)return null;try{return JSON.parse(e)}catch{return null}}render(){return this.params.length?D`
      ${this.params.map(e=>{let t=this.parseSchema(e.schemaJson),n=sd(t);return D`
          <div class="parameter">
            <div class="param-name-col">
              ${e.required?D`<span class="required-badge">req</span>`:O}
              ${e.ref?D`
                    <pp-ref-popover registry-key="${e.ref.componentType}/${e.ref.name}"><a
                        class="ref-link param-name" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c
                      ${e.name}</a></pp-ref-popover>`:D`<span class="param-name">${e.name}</span>`}

              ${e.deprecated?D`<span class="deprecated-badge">deprecated</span>`:O}
            </div>
            <div class="param-type-col">
              ${n?D`<span class="param-type">${n}</span>`:O}
              ${zf(t,{labelSuffix:`:`})}
            </div>
            <div class="param-in-col">
              <sl-icon class="param-in-icon" name="${this.inIcon(e.in)}"></sl-icon>
              <span class="param-in">${e.in}</span>
            </div>
            <div class="param-desc-col">
              ${If(e.description)}
              ${!e.ref&&(e.rawJson||e.rawYaml)?D`
                    <pp-raw-viewer-btn
                        title="${e.name} (${e.in})"
                        raw-json=${e.rawJson||``}
                        raw-yaml=${e.rawYaml||``}
                        start-line=${e.sourceLine||1}
                        location=${e.location||``}>
                    </pp-raw-viewer-btn>`:O}
            </div>
            ${!e.ref&&(e.rawJson||e.rawYaml)||e.mockJson||e.examples&&Object.keys(e.examples).length>0?D`
                  <div class="param-extras">
                    ${e.mockJson||e.examples&&Object.keys(e.examples).length>0?D`
                          <pp-example-selector
                              mock-json=${e.mockJson||``}
                              examples-json=${e.examples?JSON.stringify(e.examples):``}>
                          </pp-example-selector>`:O}
                  </div>
                `:O}
          </div>
          ${e.extensions?.length?D`
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
                <h4>${e.name} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(e.extensions)}></pp-extensions>
            </div>
            </div>`:O}
          
        `})}
    `:O}};q([P({attribute:`parameters-json`})],lp.prototype,`parametersJson`,void 0),q([F()],lp.prototype,`params`,void 0),lp=q([N(`pp-operation-parameters`)],lp);var up=E`
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
`,dp=E`
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
`,fp=E`
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
`;function pp(e){let t=parseInt(e,10);return t>=500?`status-error`:t>=400?`status-warn`:`status-ok`}var mp={100:`Continue`,101:`Switching Protocols`,102:`Processing`,103:`Early Hints`,200:`OK`,201:`Created`,202:`Accepted`,203:`Non-Authoritative Information`,204:`No Content`,205:`Reset Content`,206:`Partial Content`,207:`Multi-Status`,208:`Already Reported`,226:`IM Used`,300:`Multiple Choices`,301:`Moved Permanently`,302:`Found`,303:`See Other`,304:`Not Modified`,305:`Use Proxy`,307:`Temporary Redirect`,308:`Permanent Redirect`,400:`Bad Request`,401:`Unauthorized`,402:`Payment Required`,403:`Forbidden`,404:`Not Found`,405:`Method Not Allowed`,406:`Not Acceptable`,407:`Proxy Authentication Required`,408:`Request Timeout`,409:`Conflict`,410:`Gone`,411:`Length Required`,412:`Precondition Failed`,413:`Content Too Large`,414:`URI Too Long`,415:`Unsupported Media Type`,416:`Range Not Satisfiable`,417:`Expectation Failed`,418:`I'm a Teapot`,421:`Misdirected Request`,422:`Unprocessable Entity`,423:`Locked`,424:`Failed Dependency`,425:`Too Early`,426:`Upgrade Required`,428:`Precondition Required`,429:`Too Many Requests`,431:`Request Header Fields Too Large`,451:`Unavailable For Legal Reasons`,500:`Internal Server Error`,501:`Not Implemented`,502:`Bad Gateway`,503:`Service Unavailable`,504:`Gateway Timeout`,505:`HTTP Version Not Supported`,506:`Variant Also Negotiates`,507:`Insufficient Storage`,508:`Loop Detected`,510:`Not Extended`,511:`Network Authentication Required`},hp=E`
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
`,gp=class extends L{constructor(){super(...arguments),this.localize=new Dn(this),this.isCopying=!1,this.status=`rest`,this.value=``,this.from=``,this.disabled=!1,this.copyLabel=``,this.successLabel=``,this.errorLabel=``,this.feedbackDuration=1e3,this.tooltipPlacement=`top`,this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let e=this.value;if(this.from){let t=this.getRootNode(),n=this.from.includes(`.`),r=this.from.includes(`[`)&&this.from.includes(`]`),i=this.from,a=``;n?[i,a]=this.from.trim().split(`.`):r&&([i,a]=this.from.trim().replace(/\]$/,``).split(`[`));let o=`getElementById`in t?t.getElementById(i):null;o?e=r?o.getAttribute(a)||``:n?o[a]||``:o.textContent||``:(this.showStatus(`error`),this.emit(`sl-error`))}if(!e)this.showStatus(`error`),this.emit(`sl-error`);else try{await navigator.clipboard.writeText(e),this.showStatus(`success`),this.emit(`sl-copy`,{detail:{value:e}})}catch{this.showStatus(`error`),this.emit(`sl-error`)}}async showStatus(e){let t=this.copyLabel||this.localize.term(`copy`),n=this.successLabel||this.localize.term(`copied`),r=this.errorLabel||this.localize.term(`error`),i=e===`success`?this.successIcon:this.errorIcon,a=Ai(this,`copy.in`,{dir:`ltr`}),o=Ai(this,`copy.out`,{dir:`ltr`});this.tooltip.content=e===`success`?n:r,await this.copyIcon.animate(o.keyframes,o.options).finished,this.copyIcon.hidden=!0,this.status=e,i.hidden=!1,await i.animate(a.keyframes,a.options).finished,setTimeout(async()=>{await i.animate(o.keyframes,o.options).finished,i.hidden=!0,this.status=`rest`,this.copyIcon.hidden=!1,await this.copyIcon.animate(a.keyframes,a.options).finished,this.tooltip.content=t,this.isCopying=!1},this.feedbackDuration)}render(){let e=this.copyLabel||this.localize.term(`copy`);return D`
      <sl-tooltip
        class=${R({"copy-button":!0,"copy-button--success":this.status===`success`,"copy-button--error":this.status===`error`})}
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
    `}};gp.styles=[M,hp],gp.dependencies={"sl-icon":on,"sl-tooltip":Li},A([I(`slot[name="copy-icon"]`)],gp.prototype,`copyIcon`,2),A([I(`slot[name="success-icon"]`)],gp.prototype,`successIcon`,2),A([I(`slot[name="error-icon"]`)],gp.prototype,`errorIcon`,2),A([I(`sl-tooltip`)],gp.prototype,`tooltip`,2),A([F()],gp.prototype,`isCopying`,2),A([F()],gp.prototype,`status`,2),A([P()],gp.prototype,`value`,2),A([P()],gp.prototype,`from`,2),A([P({type:Boolean,reflect:!0})],gp.prototype,`disabled`,2),A([P({attribute:`copy-label`})],gp.prototype,`copyLabel`,2),A([P({attribute:`success-label`})],gp.prototype,`successLabel`,2),A([P({attribute:`error-label`})],gp.prototype,`errorLabel`,2),A([P({attribute:`feedback-duration`,type:Number})],gp.prototype,`feedbackDuration`,2),A([P({attribute:`tooltip-placement`})],gp.prototype,`tooltipPlacement`,2),A([P({type:Boolean})],gp.prototype,`hoist`,2),H(`copy.in`,{keyframes:[{scale:`.25`,opacity:`.25`},{scale:`1`,opacity:`1`}],options:{duration:100}}),H(`copy.out`,{keyframes:[{scale:`1`,opacity:`1`},{scale:`.25`,opacity:`0`}],options:{duration:100}}),gp.define(`sl-copy-button`);var _p=[Mu,E`
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
        align-items: flex-start;
        gap: var(--global-padding-double);
        margin-top: var(--global-padding-double);
    }

    .inline-example-desc {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        display: block;
        flex: 1;
        min-width: 0;
        border-left: 2px solid var(--secondary-color);
        padding-left: var(--global-padding-double);
        padding-top: 0;
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
`],vp=E`
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
`,yp=class extends k{constructor(...e){super(...e),this.examplesData=``,this.mockJson=``,this.examplesJson=``,this.descriptionsJson=``,this.mode=`drawer`,this.codeLanguage=`json`,this.hideLabel=!1,this.showExpand=!1,this.exampleTitle=`Example`,this.entries=[],this.descriptions={},this.selectedIndex=0}static{this.styles=[..._p,ed,vp]}willUpdate(e){(e.has(`examplesData`)||e.has(`mockJson`)||e.has(`examplesJson`)||e.has(`descriptionsJson`))&&this.buildEntries()}buildEntries(){let e=[],t=this.mockJson,n={};if(this.examplesData)try{let e=JSON.parse(this.examplesData);e.mockJson&&(t=e.mockJson),e.examples&&(n=e.examples)}catch{}if(this.examplesJson)try{n={...n,...JSON.parse(this.examplesJson)}}catch{}for(let[t,r]of Object.entries(n))r&&e.push({key:t,json:r});if(t&&e.push({key:``,json:t}),this.entries=e,this.selectedIndex=0,this.descriptionsJson)try{this.descriptions=JSON.parse(this.descriptionsJson)}catch{this.descriptions={}}else this.descriptions={}}showExample(e){let t=e.json;if(this.codeLanguage===`json`)try{t=JSON.stringify(JSON.parse(e.json),null,2)}catch{}let n=new CustomEvent(`pp-show-example`,{bubbles:!0,composed:!0,detail:{title:e.key,json:t,language:this.codeLanguage}});this.dispatchEvent(n)}handleSelect(e){let t=e.detail?.item?.value;if(t===void 0)return;let n=parseInt(t,10);n>=0&&n<this.entries.length&&this.showExample(this.entries[n])}render(){if(!this.entries.length)return O;if(this.mode===`inline`)return this.renderInline();if(this.entries.length===1){let e=this.entries[0];return D`
        <div class="selector">
          <button @click=${()=>this.showExample(e)}>${e.key}</button>
        </div>
      `}return D`
      <div class="selector">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>View Example...</sl-button>
          <sl-menu @sl-select=${this.handleSelect}>
            ${this.entries.map((e,t)=>D`
              <sl-menu-item value="${t}">${e.key}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `}inlineLabel(e){return e.toLowerCase().includes(`example`)?e:`${e} Example`}expandToDrawer(e){this.dispatchEvent(new CustomEvent(`pp-show-example`,{bubbles:!0,composed:!0,detail:{title:this.exampleTitle,json:e,language:this.codeLanguage}}))}renderCodeBlock(e){return D`
      <div class="code-container">
        <div class="floating-actions">
          ${this.showExpand?D`
            <sl-tooltip content="view expanded example">
              <sl-icon-button name="arrows-fullscreen" label="Expand"
                class="floating-expand"
                @click=${()=>this.expandToDrawer(e)}></sl-icon-button>
            </sl-tooltip>
          `:O}
          <sl-copy-button .value=${e} class="floating-copy"></sl-copy-button>
        </div>
        <pp-code-viewer .code=${e} .language=${this.codeLanguage}
            ?pretty=${this.codeLanguage===`json`}></pp-code-viewer>
      </div>
    `}renderInline(){let e=this.entries[this.selectedIndex];if(this.entries.length===1)return D`
        ${this.hideLabel?O:D`<div class="inline-example-label">${this.inlineLabel(e.key)}</div>`}
        ${this.renderCodeBlock(e.json)}
      `;let t=this.descriptions[e.key];return D`
      ${this.hideLabel?O:D`<div class="inline-example-label">Example</div>`}
      ${this.renderCodeBlock(e.json)}
      <div class="inline-selector-row">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>${this.inlineLabel(e.key)}</sl-button>
          <sl-menu @sl-select=${this.handleInlineSelect}>
            ${this.entries.map((e,t)=>D`
              <sl-menu-item value="${t}">${this.inlineLabel(e.key)}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
        ${t?If(t,{className:`inline-example-desc pp-markdown`}):O}
      </div>
    `}handleInlineSelect(e){let t=e.detail?.item?.value;t!==void 0&&(this.selectedIndex=parseInt(t,10))}};q([P({attribute:`examples-data`})],yp.prototype,`examplesData`,void 0),q([P({attribute:`mock-json`})],yp.prototype,`mockJson`,void 0),q([P({attribute:`examples-json`})],yp.prototype,`examplesJson`,void 0),q([P({attribute:`descriptions-json`})],yp.prototype,`descriptionsJson`,void 0),q([P()],yp.prototype,`mode`,void 0),q([P({attribute:`code-language`})],yp.prototype,`codeLanguage`,void 0),q([P({type:Boolean,attribute:`hide-label`})],yp.prototype,`hideLabel`,void 0),q([P({type:Boolean,attribute:`show-expand`})],yp.prototype,`showExpand`,void 0),q([P({attribute:`example-title`})],yp.prototype,`exampleTitle`,void 0),q([F()],yp.prototype,`entries`,void 0),q([F()],yp.prototype,`descriptions`,void 0),q([F()],yp.prototype,`selectedIndex`,void 0),yp=q([N(`pp-example-selector`)],yp);var bp=[Mu,E`
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
`],xp=class extends k{constructor(...e){super(...e),this.contentJson=``,this.mediaTypes=[],this.selectedIndex=0,this.schemasIdentical=!1,this.wide=!1,this.resizeObserver=null,this.paneResizeObserver=null,this._sizePending=!1,this._rafId=0,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}static{this.styles=[vu,td,bp]}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.wide=this.offsetWidth>=900,!(typeof ResizeObserver>`u`)&&(this.resizeObserver=new ResizeObserver(e=>{for(let t of e)this.wide=t.contentRect.width>=900}),this.resizeObserver.observe(this),this.paneResizeObserver=new ResizeObserver(()=>{this.sizeSplitPanel()}))},0)}disconnectedCallback(){super.disconnectedCallback(),cancelAnimationFrame(this._rafId),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.paneResizeObserver?.disconnect(),this.paneResizeObserver=null,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}updated(e){(e.has(`wide`)||e.has(`selectedIndex`)||e.has(`mediaTypes`))&&this.sizeSplitPanel(),this.syncPaneObservers()}sizeSplitPanel(){!this.splitPanel||!this.propsPane||!this.examplePane||this._sizePending||(this._sizePending=!0,this._rafId=requestAnimationFrame(()=>{if(this._sizePending=!1,!this.splitPanel||!this.propsPane||!this.examplePane)return;let e=this.measurePaneContentHeight(this.propsPane),t=this.measurePaneContentHeight(this.examplePane),n=document.documentElement.clientHeight||800,r=this.mediaTypes[this.selectedIndex],i=this.getPropCount(r),a=Math.max(e,t),o=i>=6?300:220,s=n*.75,c=Math.max(o,Math.min(a,s)),l=getComputedStyle(this.splitPanel),u=parseFloat(l.paddingTop)+parseFloat(l.paddingBottom);this.splitPanel.style.height=`${c+u}px`}))}measurePaneContentHeight(e){let t=Array.from(e.children).reduce((e,t)=>e+Math.max(t.offsetHeight,t.scrollHeight),0),n=getComputedStyle(e);return t+(parseFloat(n.paddingTop)+parseFloat(n.paddingBottom))}syncPaneObservers(){if(!this.paneResizeObserver||typeof ResizeObserver>`u`)return;let e=this.propsPane??null,t=this.examplePane??null,n=e?.firstElementChild??null,r=t?.firstElementChild??null;this.observedPropsPane!==e&&(this.observedPropsPane&&this.paneResizeObserver.unobserve(this.observedPropsPane),e&&this.paneResizeObserver.observe(e),this.observedPropsPane=e),this.observedExamplePane!==t&&(this.observedExamplePane&&this.paneResizeObserver.unobserve(this.observedExamplePane),t&&this.paneResizeObserver.observe(t),this.observedExamplePane=t),this.observedPropsContent!==n&&(this.observedPropsContent&&this.paneResizeObserver.unobserve(this.observedPropsContent),n instanceof Element&&this.paneResizeObserver.observe(n),this.observedPropsContent=n),this.observedExampleContent!==r&&(this.observedExampleContent&&this.paneResizeObserver.unobserve(this.observedExampleContent),r instanceof Element&&this.paneResizeObserver.observe(r),this.observedExampleContent=r)}getPropCount(e){let t=e?.isArray&&e?.itemsSchemaJson?e.itemsSchemaJson:e?.schemaJson;if(!t)return 0;try{let e=JSON.parse(t);return e.properties?Object.keys(e.properties).length:0}catch{return 0}}isComplexWithExample(e){if(!e.schemaJson&&!(e.isArray&&e.itemsSchemaJson))return!1;let t=e.isArray&&e.itemsSchemaJson?e.itemsSchemaJson:e.schemaJson;if(!t)return!1;try{let n=JSON.parse(t),r=n.properties||n.allOf||n.oneOf||n.anyOf,i=!!(e.mockJson||e.mockYaml||e.mockXml||e.examples&&Object.keys(e.examples).length);return!!r&&i}catch{return!1}}willUpdate(e){if(e.has(`contentJson`)&&this.contentJson){try{this.mediaTypes=JSON.parse(this.contentJson)}catch{this.mediaTypes=[]}let e=this.mediaTypes.findIndex(e=>e.mediaType.toLowerCase()===`application/json`);this.selectedIndex=e>=0?e:0,this.schemasIdentical=this.mediaTypes.length>1&&new Set(this.mediaTypes.map(e=>this.schemaFingerprint(e))).size===1}}schemaFingerprint(e){return e.isArray&&e.itemsRef?`array:${e.itemsRef.slug}:${e.itemsSchemaJson||e.schemaJson}`:e.schemaRef?`ref:${e.schemaRef.componentType}/${e.schemaRef.slug}`:`inline:${e.schemaJson}`}getMockAndLanguage(e){let t=e.mediaType.toLowerCase();return(t.includes(`yaml`)||t.includes(`x-yaml`))&&e.mockYaml?{mock:e.mockYaml,language:`yaml`}:t.includes(`xml`)&&e.mockXml?{mock:e.mockXml,language:`xml`}:{mock:e.mockJson||``,language:`json`}}renderSchemaHeader(e){return e.isArray&&e.itemsRef?D`
                <div class="media-type-ref">
                    <span class="media-type-label">${e.mediaType}</span>
                    <span class="array-type">Array&lt;${Lf(e.itemsRef)}&gt;</span>
                </div>`:e.schemaRef?D`
                <div class="media-type-ref">
                    <span class="media-type-label">${e.mediaType}</span>
                    ${Lf(e.schemaRef)}
                </div>`:e.schemaJson?D`<div class="media-type-label">${e.mediaType}</div>`:O}renderSchemaProperties(e){if(e.isArray&&e.itemsRef){let t=e.itemsSchemaJson||e.schemaJson;return t?D`<pp-schema-properties schema-json=${t}></pp-schema-properties>`:O}return e.schemaRef,e.schemaJson?D`<pp-schema-properties schema-json=${e.schemaJson}></pp-schema-properties>`:O}renderInlineExamples(e,t,n){let r=e.examples&&Object.keys(e.examples).length>0;return!r&&!n?O:D`
            <pp-example-selector mode="inline" code-language=${t}
                examples-json=${r?JSON.stringify(e.examples):``}
                mock-json=${n}>
            </pp-example-selector>
        `}renderExtensions(e){return e.extensions?.length?D`
            <div class="media-type-extensions">
                <h4>${e.mediaType} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(e.extensions)}></pp-extensions>
            </div>
        `:O}renderRefInfo(e){return e.isArray&&e.itemsRef?D`<span class="array-type">Array&lt;${Lf(e.itemsRef)}&gt;</span>`:e.schemaRef?Lf(e.schemaRef):O}renderDropdown(e){return D`
            <div class="media-type-ref">
                <sl-dropdown skidding="5" distance="5">
                    <sl-button slot="trigger" caret>${e.mediaType}</sl-button>
                    <sl-menu @sl-select=${this.handleSelect}>
                        ${this.mediaTypes.map((e,t)=>D`
                            <sl-menu-item value="${t}">${e.mediaType}</sl-menu-item>
                        `)}
                    </sl-menu>
                </sl-dropdown>
                ${this.renderRefInfo(e)}
            </div>
        `}handleSelect(e){let t=e.detail?.item?.value;if(t===void 0)return;let n=parseInt(t,10);n>=0&&n<this.mediaTypes.length&&(this.selectedIndex=n)}renderSplit(e){let t=e.isArray&&e.itemsSchemaJson?e.itemsSchemaJson:e.schemaJson,{mock:n,language:r}=this.getMockAndLanguage(e),i=e.examples&&Object.keys(e.examples).length>0,a=e.mediaType||`Example`;return D`
            <sl-split-panel class="schema-split" position="60">
                <div slot="start" class="split-pane schema-props-pane">
                    <pp-schema-properties schema-json=${t||``} compact></pp-schema-properties>
                </div>
                <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                <div slot="end" class="split-pane schema-example-pane">
                    <pp-example-selector mode="inline" code-language=${r}
                        mock-json=${n}
                        examples-json=${i?JSON.stringify(e.examples):``}
                        hide-label show-expand
                        example-title=${a}></pp-example-selector>
                </div>
            </sl-split-panel>
        `}render(){if(!this.mediaTypes.length)return O;if(this.mediaTypes.length===1){let e=this.mediaTypes[0];if(this.wide&&this.isComplexWithExample(e))return D`
                    ${this.renderSchemaHeader(e)}
                    ${this.renderSplit(e)}
                    ${this.renderExtensions(e)}
                `;let{mock:t,language:n}=this.getMockAndLanguage(e);return D`
                ${this.renderSchemaHeader(e)}
                ${this.renderInlineExamples(e,n,t)}
                ${this.renderSchemaProperties(e)}
                ${this.renderExtensions(e)}
            `}let e=this.mediaTypes[this.selectedIndex];if(this.schemasIdentical){let t=this.mediaTypes[0];if(this.wide&&this.isComplexWithExample(e))return D`
                    ${this.renderDropdown(e)}
                    ${this.renderSplit(e)}
                    ${this.renderExtensions(e)}
                `;let{mock:n,language:r}=this.getMockAndLanguage(e);return D`
                ${this.renderDropdown(e)}
                ${this.renderInlineExamples(e,r,n)}
                ${this.renderSchemaProperties(t)}
                ${this.renderExtensions(e)}
            `}if(this.wide&&this.isComplexWithExample(e))return D`
                ${this.renderDropdown(e)}
                ${this.renderSplit(e)}
                ${this.renderExtensions(e)}
            `;let{mock:t,language:n}=this.getMockAndLanguage(e);return D`
            ${this.renderDropdown(e)}
            ${this.renderInlineExamples(e,n,t)}
            ${this.renderSchemaProperties(e)}
            ${this.renderExtensions(e)}
        `}};q([P({attribute:`content-json`})],xp.prototype,`contentJson`,void 0),q([F()],xp.prototype,`mediaTypes`,void 0),q([F()],xp.prototype,`selectedIndex`,void 0),q([F()],xp.prototype,`schemasIdentical`,void 0),q([F()],xp.prototype,`wide`,void 0),q([I(`.schema-split`)],xp.prototype,`splitPanel`,void 0),q([I(`.schema-props-pane`)],xp.prototype,`propsPane`,void 0),q([I(`.schema-example-pane`)],xp.prototype,`examplePane`,void 0),xp=q([N(`pp-media-type-selector`)],xp);var Sp=class extends k{constructor(...e){super(...e),this.responsesJson=``,this.commonHeadersJson=``,this.responses=[],this.commonResponseHeaders=[],this.commonHeaderNames=new Set,this.commonErrorKeys=new Set,this.commonErrorResponses=new Map,this.successResponses=[],this.redirectResponses=[],this.errorResponses=[]}static{this.styles=[vu,$u,ed,td,up,dp,fp]}willUpdate(e){if(e.has(`responsesJson`)&&this.responsesJson){try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}let e=[...this.responses].sort((e,t)=>parseInt(e.statusCode,10)-parseInt(t.statusCode,10)),t=[],n=[],r=[];for(let i of e){let e=parseInt(i.statusCode,10);e>=400?r.push(i):e>=300?n.push(i):t.push(i)}this.successResponses=t,this.redirectResponses=n,this.errorResponses=r;let{commonKeys:i,commonResponses:a}=this.computeCommonErrors(r);this.commonErrorKeys=i,this.commonErrorResponses=a}if(e.has(`commonHeadersJson`)&&this.commonHeadersJson){try{this.commonResponseHeaders=JSON.parse(this.commonHeadersJson)}catch{this.commonResponseHeaders=[]}this.commonHeaderNames=new Set(this.commonResponseHeaders.map(e=>e.name))}}getResponseNavItems(){let e=[];for(let t of[...this.successResponses,...this.redirectResponses,...this.errorResponses])e.push({label:`${t.statusCode} ${mp[t.statusCode]||``}`.trim(),id:`response-${t.statusCode}`});return e}scrollToHeader(e){let t=this.shadowRoot?.getElementById(`header-`+e);if(!t)return;let n=t.closest(`sl-details`);n&&!n.open?(n.open=!0,n.updateComplete?.then(()=>{t.scrollIntoView({behavior:`auto`,block:`center`})})):t.scrollIntoView({behavior:`auto`,block:`center`})}renderHeaderEntry(e){return D`
            <div class="header-entry">
                <div class="header-name-col">
                    ${e.ref?D`
                                <pp-ref-popover registry-key="${e.ref.componentType}/${e.ref.name}"><a
                                        class="ref-link header-name" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c
                                    ${e.name}</a></pp-ref-popover>`:D`<span class="header-name">${e.name}</span>`}
                </div>
                <div class="header-type-col">
                    ${e.schemaType?D`<span class="header-type">${e.schemaType}</span>`:O}
                    ${zf(e,{includeExample:!0})}
                </div>
                <div class="header-desc-col">
                    ${If(e.description)}
                </div>
            </div>
            ${e.extensions?.length?D`
                <div class="header-entry header-entry-extensions">
                    <div class="header-name-col">
                        &nbsp;    
                    </div>
                    <div class="header-type-col">
                        &nbsp;
                    </div>
                    <div class="header-desc-col">
                        <div class="header-extensions">
                            <h4>${e.name} Header Extensions</h4>
                            <pp-extensions extensions-json=${JSON.stringify(e.extensions)}></pp-extensions>
                        </div>
                    </div>
                </div>    
            `:O}
        `}renderHeaders(e,t){if(!e||!e.length)return O;let n=e.filter(e=>!t.has(e.name)),r=e.filter(e=>t.has(e.name));return!n.length&&!r.length?O:D`
            <div class="headers-section">
                <h4 class="headers-label">Response Headers</h4>
                    ${n.length?D`
                        <div class="headers-values">
                            ${n.map(e=>this.renderHeaderEntry(e))}
                        </div>`:O}
                ${r.length?D`
                    <div class="common-link-label">\u2191 common headers</div>
                    <ul class="common-header-list">
                        ${r.map(e=>D`
                            <li><a class="header-anchor" @click=${t=>{t.preventDefault(),this.scrollToHeader(e.name)}}>${e.name}</a></li>
                        `)}
                    </ul>
                `:O}
            </div>
        `}renderLinks(e){return e?.length?D`
            <div class="links-section">
                <h4 class="links-label">Response Links</h4>
                ${e.map(e=>D`
                    <div class="link-entry">
                        <span class="link-name">${e.ref?D`<pp-ref-popover registry-key="links/${e.ref.name}"><a class="ref-link" href="models/${e.ref.typeSlug}/${e.ref.slug}.html">\u279c ${e.name}</a></pp-ref-popover>`:e.name}</span>
                        ${e.operationId?D`<span class="link-target">\u2192 ${e.operationSlug?D`<a class="ref-link" href="operations/${e.operationSlug}.html">${e.operationId}</a>`:e.operationId}</span>`:O}
                        ${e.operationRef?D`<span class="link-target">\u2192 ${e.operationRef}</span>`:O}
                        ${e.description?If(e.description,{className:`link-desc pp-markdown`}):O}
                    </div>
                `)}
            </div>
        `:O}errorRefKey(e){if(e.ref)return`ref:${e.ref.slug}`;if(e.content?.length){let t=e.content[0];if(t.schemaRef)return`schema:${t.schemaRef.slug}`;if(t.isArray&&t.itemsRef)return`items:${t.itemsRef.slug}`}return null}computeCommonErrors(e){let t=new Map;for(let n of e){let e=this.errorRefKey(n);if(!e)continue;let r=t.get(e);r?r.codeDescs.push({code:n.statusCode,description:n.description}):t.set(e,{resp:n,codeDescs:[{code:n.statusCode,description:n.description}]})}let n=new Set,r=new Map;for(let[e,i]of t)i.codeDescs.length>=2&&(n.add(e),r.set(e,i));return{commonKeys:n,commonResponses:r}}scrollToCommonError(e){(this.shadowRoot?.getElementById(`common-error-`+e))?.scrollIntoView({behavior:`auto`,block:`nearest`})}renderResponse(e,t,n){let r=n?this.errorRefKey(e):null,i=r!=null&&n?.has(r);return D`
            <div class="response" id="response-${e.statusCode}">
                    <h3><span class="status-code ${pp(e.statusCode)}">${e.statusCode}</span> ${mp[e.statusCode]||``}
                        ${e.rawJson||e.rawYaml?D`
                                <pp-raw-viewer-btn
                                        title="Response ${e.statusCode}"
                                        raw-json=${e.rawJson||``}
                                        raw-yaml=${e.rawYaml||``}
                                        start-line=${e.sourceLine||1}
                                        location=${e.location||``}>
                                </pp-raw-viewer-btn>`:O}
                    </h3>
                    ${e.descHtml?D`<div class="response-desc">${ld(e.descHtml)}</div>`:If(e.description,{className:`response-desc pp-markdown`})}
              
                ${i?D`
                            <div class="common-error-link">
                                ${e.ref?Lf(e.ref,!0):O}
                                ${!e.ref&&e.content?.length?this.renderMediaTypeHeader(e.content[0]):O}
                                <a class="error-anchor" @click=${e=>{e.preventDefault(),this.scrollToCommonError(r)}}>\u2191 see common example</a>
                            </div>`:e.ref?Lf(e.ref,!0):e.content?.length?D`<pp-media-type-selector content-json=${JSON.stringify(e.content)}></pp-media-type-selector>`:O}
                ${this.renderHeaders(e.headers??[],t)}
                ${this.renderLinks(e.links??[])}
                ${e.extensions?.length?D`
                    <div class="response-extensions">
                        <h4>Response ${e.statusCode} Extensions</h4>
                        <pp-extensions extensions-json=${JSON.stringify(e.extensions)}></pp-extensions>
                    </div>`:O}
            </div>
        `}renderMediaTypeHeader(e){return e.isArray&&e.itemsRef?D`
                <span class="media-type-label">${e.mediaType}</span>
                <span class="array-type">Array&lt;${Lf(e.itemsRef)}&gt;</span>
            `:e.schemaRef?D`
                <span class="media-type-label">${e.mediaType}</span>
                ${Lf(e.schemaRef)}
            `:O}renderCommonErrors(e,t){return e.size?D`
            <div class="response-group-heading"><h4>Common Error Responses</h4></div>
            ${[...e.entries()].map(([e,{resp:n,codeDescs:r}])=>D`
                <div class="response common-error-response" id="common-error-${e}">
                    <div class="common-error-grid">
                        ${r.map(({code:e,description:t})=>D`
                            <div class="common-error-code"><span class="${pp(e)}">${e}</span> ${mp[e]||``}</div>
                            ${If(t,{className:`common-error-desc pp-markdown`})}
                        `)}
                    </div>
                    ${n.ref?Lf(n.ref,!0):n.content?.length?D`<pp-media-type-selector content-json=${JSON.stringify(n.content)}></pp-media-type-selector>`:O}
                    ${this.renderHeaders(n.headers??[],t)}
                </div>
            `)}
        `:O}render(){if(!this.responses.length)return O;let e=this.commonHeaderNames,t=this.commonErrorKeys,n=this.commonErrorResponses;return D`
            <h2>Responses</h2>
            ${this.successResponses.map(t=>this.renderResponse(t,e))}
            ${this.redirectResponses.length?D`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Redirect Responses</h3></span>
                    ${this.redirectResponses.map(t=>this.renderResponse(t,e))}
                </sl-details>
            `:O}
            ${this.commonResponseHeaders.length?D`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Common Response Headers</h3></span>
                    <div class="property-box">
                        ${this.commonResponseHeaders.map(e=>D`
                            <div id="header-${e.name}">${this.renderHeaderEntry(e)}</div>
                        `)}
                    </div>
                </sl-details>
            `:O}
            ${this.errorResponses.length||n.size?D`
                <sl-details class="pp-details">
                    <div slot="summary" class="pp-details-summary"><h3>Error Responses</h3></div>
                    ${this.renderCommonErrors(n,e)}
                    ${this.errorResponses.map(n=>this.renderResponse(n,e,t))}
                </sl-details>
            `:O}
        `}};q([P({attribute:`responses-json`})],Sp.prototype,`responsesJson`,void 0),q([P({attribute:`common-headers-json`})],Sp.prototype,`commonHeadersJson`,void 0),q([F()],Sp.prototype,`responses`,void 0),q([F()],Sp.prototype,`commonResponseHeaders`,void 0),q([F()],Sp.prototype,`commonHeaderNames`,void 0),q([F()],Sp.prototype,`commonErrorKeys`,void 0),q([F()],Sp.prototype,`commonErrorResponses`,void 0),q([F()],Sp.prototype,`successResponses`,void 0),q([F()],Sp.prototype,`redirectResponses`,void 0),q([F()],Sp.prototype,`errorResponses`,void 0),Sp=q([N(`pp-operation-responses`)],Sp);var Cp=E`
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

`,wp=class extends k{constructor(...e){super(...e),this.callbacksJson=``,this.callbacks=[]}static{this.styles=[vu,ed,td,up,Cp]}willUpdate(e){if(e.has(`callbacksJson`)&&this.callbacksJson)try{this.callbacks=JSON.parse(this.callbacksJson)}catch{this.callbacks=[]}}renderRequestBody(e){return e.ref?D`<div class="callback-section-label">Request Body</div>${Lf(e.ref,!0)}`:e.content?.length?D`
            <div class="callback-section-label">Request Body${e.required?` (required)`:``}</div>
            ${e.descHtml?D`<div class="callback-desc">${ld(e.descHtml)}</div>`:If(e.description,{className:`callback-desc pp-markdown`})}
            <pp-media-type-selector content-json=${JSON.stringify(e.content)}></pp-media-type-selector>
        `:O}renderResponses(e){return e?.length?D`
            <div class="callback-section-label">Responses</div>
            ${e.map(e=>D`
                <div class="callback-response">
                    <span class="callback-response-code ${pp(e.statusCode)}">${e.statusCode}</span>
                    <span class="callback-response-code">${mp[e.statusCode]||``}</span>
                    ${e.descHtml?D`<span class="callback-response-desc">${ld(e.descHtml)}</span>`:e.description?If(e.description,{className:`callback-response-desc pp-markdown-inline`,inline:!0}):O}
                </div>
                ${e.ref?Lf(e.ref,!0):O}
                ${!e.ref&&e.content?.length?D`<pp-media-type-selector content-json=${JSON.stringify(e.content)}></pp-media-type-selector>`:O}
            `)}
        `:O}renderCallbackOperation(e){return D`
            <div class="callback-operation">
                <div class="callback-method-expression">
                    <pb33f-http-method method=${e.method}></pb33f-http-method>
                    <span class="callback-expression">${e.expression}</span>
                </div>
                ${e.descHtml?D`<div class="callback-desc">${ld(e.descHtml)}</div>`:If(e.description,{className:`callback-desc pp-markdown`})}
                ${e.requestBody?this.renderRequestBody(e.requestBody):O}
                ${this.renderResponses(e.responses??[])}
            </div>
        `}render(){return this.callbacks.length?D`
            ${this.callbacks.map(e=>D`
                <div class="callback-entry">
                    <div class="callback-name">
                        ${e.ref?Lf(e.ref,!0):O}
                        ${e.name}
                    </div>
                    ${e.operations.map(e=>this.renderCallbackOperation(e))}
                </div>
            `)}
        `:O}};q([P({attribute:`callbacks-json`})],wp.prototype,`callbacksJson`,void 0),q([F()],wp.prototype,`callbacks`,void 0),wp=q([N(`pp-operation-callbacks`)],wp);var Tp=E`
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
        color: var(--tertiary-color);
        font-family: var(--font-stack), monospace;
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

`,Ep=E`
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
`,Dp=class extends k{constructor(...e){super(...e),this.rawJson=``,this.rawYaml=``,this.startLine=1,this.title=`Schema`,this.location=``,this.noLineNumbers=!1,this.mode=`yaml`}static{this.styles=[Ep,vp]}connectedCallback(){super.connectedCallback();let e=document.body.getAttribute(`data-spec-format`);(e===`json`||e===`yaml`)&&(this.mode=e)}render(){if(!this.rawJson&&!this.rawYaml)return O;let e=!!this.rawJson,t=!!this.rawYaml,n=this.mode===`yaml`&&t?this.rawYaml:this.rawJson,r=this.mode===`yaml`&&t?`yaml`:`json`,i=e&&t;return D`
      ${this.title||i?D`
      <div class="toolbar">
        ${this.title?D`<h3>${this.title}</h3>`:O}
        ${i?D`
          <div class="toggle-group">
            <button class="toggle-btn ${this.mode===`json`?`active`:``}"
                    @click=${()=>this.mode=`json`}>JSON</button>
            <button class="toggle-btn ${this.mode===`yaml`?`active`:``}"
                    @click=${()=>this.mode=`yaml`}>YAML</button>
          </div>
        `:O}
      </div>
      `:O}
      <div class="code-container">
        <sl-copy-button .value=${n} class="floating-copy"></sl-copy-button>
        <pp-code-viewer
          code=${n}
          language=${r}
          ?pretty=${r===`json`}
          ?line-numbers=${!this.noLineNumbers&&(r===`json`?n.includes(`
`)||n.startsWith(`{`)||n.startsWith(`[`):n.indexOf(`
`)!==-1)}
          start-line=${this.startLine}
          location=${this.location}>
        </pp-code-viewer>
      </div>
    `}};q([P({attribute:`raw-json`})],Dp.prototype,`rawJson`,void 0),q([P({attribute:`raw-yaml`})],Dp.prototype,`rawYaml`,void 0),q([P({attribute:`start-line`,type:Number})],Dp.prototype,`startLine`,void 0),q([P()],Dp.prototype,`title`,void 0),q([P()],Dp.prototype,`location`,void 0),q([P({attribute:`no-line-numbers`,type:Boolean})],Dp.prototype,`noLineNumbers`,void 0),q([F()],Dp.prototype,`mode`,void 0),Dp=q([N(`pp-inline-code`)],Dp);var Op=class extends k{constructor(...e){super(...e),this.modelJson=``,this.name=``,this.rawYaml=``,this.schemaRawYaml=``,this.schemaRawJson=``,this.schemaStartLine=1,this.startLine=1,this.location=``,this.mockJson=``,this.parsed=null,this.wide=!1,this.exampleJson=``,this.resizeObserver=null,this.paneResizeObserver=null,this._sizePending=!1,this._rafId=0,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}static{this.styles=[vu,$u,Tp]}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.wide=this.offsetWidth>=900,!(typeof ResizeObserver>`u`)&&(this.resizeObserver=new ResizeObserver(e=>{for(let t of e)this.wide=t.contentRect.width>=900}),this.resizeObserver.observe(this),this.paneResizeObserver=new ResizeObserver(()=>{this.sizeSplitPanel()}))},0)}disconnectedCallback(){super.disconnectedCallback(),cancelAnimationFrame(this._rafId),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.paneResizeObserver?.disconnect(),this.paneResizeObserver=null,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}updated(e){(e.has(`wide`)||e.has(`parsed`)||e.has(`exampleJson`))&&this.sizeSplitPanel(),this.syncPaneObservers()}sizeSplitPanel(){!this.splitPanel||!this.propsPane||!this.examplePane||this._sizePending||(this._sizePending=!0,this._rafId=requestAnimationFrame(()=>{if(this._sizePending=!1,!this.splitPanel||!this.propsPane||!this.examplePane)return;let e=this.measurePaneContentHeight(this.propsPane),t=this.measurePaneContentHeight(this.examplePane),n=document.documentElement.clientHeight||800,r=this.parsed?.properties?Object.keys(this.parsed.properties).length:0,i=Math.max(r>=6?300:220,Math.min(Math.max(e,t),n*.75)),a=getComputedStyle(this.splitPanel),o=parseFloat(a.paddingTop)+parseFloat(a.paddingBottom);this.splitPanel.style.height=`${i+o}px`}))}measurePaneContentHeight(e){let t=Array.from(e.children).reduce((e,t)=>e+Math.max(t.offsetHeight,t.scrollHeight),0),n=getComputedStyle(e);return t+(parseFloat(n.paddingTop)+parseFloat(n.paddingBottom))}syncPaneObservers(){if(!this.paneResizeObserver||typeof ResizeObserver>`u`)return;let e=this.propsPane??null,t=this.examplePane??null,n=e?.firstElementChild??null,r=t?.firstElementChild??null;this.observedPropsPane!==e&&(this.observedPropsPane&&this.paneResizeObserver.unobserve(this.observedPropsPane),e&&this.paneResizeObserver.observe(e),this.observedPropsPane=e),this.observedExamplePane!==t&&(this.observedExamplePane&&this.paneResizeObserver.unobserve(this.observedExamplePane),t&&this.paneResizeObserver.observe(t),this.observedExamplePane=t),this.observedPropsContent!==n&&(this.observedPropsContent&&this.paneResizeObserver.unobserve(this.observedPropsContent),n instanceof Element&&this.paneResizeObserver.observe(n),this.observedPropsContent=n),this.observedExampleContent!==r&&(this.observedExampleContent&&this.paneResizeObserver.unobserve(this.observedExampleContent),r instanceof Element&&this.paneResizeObserver.observe(r),this.observedExampleContent=r)}willUpdate(e){if(e.has(`modelJson`)&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}if(e.has(`parsed`)||e.has(`mockJson`)){let e=this.parsed;e?.example===void 0?this.exampleJson=this.mockJson||``:this.exampleJson=JSON.stringify(e.example,null,2)}}renderExamples(e,t){if(e.examples){let t={},n={};for(let[r,i]of Object.entries(e.examples)){i.value!==void 0&&(t[r]=JSON.stringify(i.value,null,2));let e=i.description||i.summary||``;e&&(n[r]=e)}if(!Object.keys(t).length)return O;let r=Object.keys(n).length?JSON.stringify(n):``;return D`<pp-example-selector mode="inline"
        examples-json=${JSON.stringify(t)}
        descriptions-json=${r}></pp-example-selector>`}let n=e.example??t?.example;return n===void 0?O:D`<pp-example-selector mode="inline" mock-json=${JSON.stringify(n,null,2)}></pp-example-selector>`}collectSchemaEntries(e){let t=[];e.type&&t.push({label:`type`,value:e.type+(e.format?` (${e.format})`:``),isCode:!0}),e.default!==void 0&&t.push({label:`default`,value:JSON.stringify(e.default),isCode:!0});for(let n of od(e))t.push(n);return e.enum?.length&&t.push({label:`enum`,value:D`<div class="enum-grid">${e.enum.map(e=>D`<span class="enum-value">${JSON.stringify(e)}</span>`)}</div>`}),t}renderPropertyGrid(e){return e.length?D`
      <div class="property-grid">
        ${e.map(e=>D`
          <div class="property-grid-entry">
            <span class="property-grid-label">${e.label}</span>
            <span class="property-grid-value">${e.isCode?D`<code>${e.value}</code>`:e.value}</span>
          </div>
        `)}
      </div>
    `:O}renderParameter(e){let t=e.schema||{},n=[{label:`name`,value:e.name},{label:`in`,value:e.in}];return e.required!==void 0&&n.push({label:`required`,value:String(e.required)}),e.deprecated&&n.push({label:`deprecated`,value:`true`}),n.push(...this.collectSchemaEntries(t)),D`
      ${t.type===`boolean`?O:this.renderExamples(e,t)}
      ${this.renderPropertyGrid(n)}
    `}renderHeader(e){let t=e.schema||{},n=[];return e.required&&n.push({label:`required`,value:`true`}),e.deprecated&&n.push({label:`deprecated`,value:`true`}),n.push(...this.collectSchemaEntries(t)),D`
      ${this.renderExamples(e,t)}
      ${this.renderPropertyGrid(n)}
    `}renderSchema(e){if(!(e.properties||e.allOf||e.oneOf||e.anyOf)){let t=this.collectSchemaEntries(e);return D`
        ${e.type!==`boolean`&&this.exampleJson?D`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`:O}
        ${this.renderPropertyGrid(t)}
      `}let t=e.properties?`Properties`:e.allOf?`Composition`:`Variants`;return this.wide&&this.exampleJson?this.renderSchemaSplit(t):this.renderSchemaStacked(t)}renderSchemaSplit(e){return D`
      <sl-split-panel class="schema-split" position="60">
        <div slot="start" class="split-pane schema-props-pane">
          <h3>${e}</h3>
          <pp-schema-properties schema-json=${this.modelJson} compact></pp-schema-properties>
        </div>
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>
        <div slot="end" class="split-pane schema-example-pane">
          <pp-example-selector mode="inline" mock-json=${this.exampleJson} hide-label show-expand
            example-title="${this.name} Example"></pp-example-selector>
        </div>
      </sl-split-panel>
    `}renderSchemaStacked(e){return D`
      ${this.exampleJson?D`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`:O}
      <h3>${e}</h3>
      <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
    `}render(){if(!this.parsed)return O;let e=this.parsed;return e.in?this.renderParameter(e):e.schema&&!e.properties&&!e.in?this.renderHeader(e):this.renderSchema(e)}};q([P({attribute:`model-json`})],Op.prototype,`modelJson`,void 0),q([P()],Op.prototype,`name`,void 0),q([P({attribute:`raw-yaml`})],Op.prototype,`rawYaml`,void 0),q([P({attribute:`schema-raw-yaml`})],Op.prototype,`schemaRawYaml`,void 0),q([P({attribute:`schema-raw-json`})],Op.prototype,`schemaRawJson`,void 0),q([P({attribute:`schema-start-line`,type:Number})],Op.prototype,`schemaStartLine`,void 0),q([P({attribute:`start-line`,type:Number})],Op.prototype,`startLine`,void 0),q([P()],Op.prototype,`location`,void 0),q([P({attribute:`mock-json`})],Op.prototype,`mockJson`,void 0),q([F()],Op.prototype,`parsed`,void 0),q([F()],Op.prototype,`wide`,void 0),q([F()],Op.prototype,`exampleJson`,void 0),q([I(`.schema-split`)],Op.prototype,`splitPanel`,void 0),q([I(`.schema-props-pane`)],Op.prototype,`propsPane`,void 0),q([I(`.schema-example-pane`)],Op.prototype,`examplePane`,void 0),Op=q([N(`pp-model-page`)],Op);var kp=E`
  :host {
    display: block;
  }
  a {
    display: flex;
    flex-direction: column;
    min-width: 0;
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
    min-width: 0;
    line-height: 1.25;
    overflow-wrap: anywhere;
    word-break: normal;
    hyphens: none;
  }
  p {
    color: var(--font-color-sub1);
    margin: 0;
    overflow-wrap: break-word;
  }
`,Ap=class extends k{constructor(...e){super(...e),this.name=``,this.href=``,this.description=``}static{this.styles=[ed,kp]}render(){return D`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${If(this.description)}
      </a>
    `}};q([P()],Ap.prototype,`name`,void 0),q([P()],Ap.prototype,`href`,void 0),q([P()],Ap.prototype,`description`,void 0),Ap=q([N(`pp-model-card`)],Ap);var jp=E`
    :host {
        display: block;
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
        border-top: 1px dashed var(--secondary-color-dimmer);
    }
`,Mp=E`
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
`,Np=E`
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
`,Pp=(e=`value`)=>(t,n)=>{let r=t.constructor,i=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(t,a,o){let s=r.getPropertyOptions(e);if(t===(typeof s.attribute==`string`?s.attribute:e)){let t=s.converter||Se,r=(typeof t==`function`?t:t?.fromAttribute??Se.fromAttribute)(o,s.type);this[e]!==r&&(this[n]=r)}i.call(this,t,a,o)}},Fp=E`
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
`,Ip=cn(class extends ln{constructor(e){if(super(e),e.type!==sn.PROPERTY&&e.type!==sn.ATTRIBUTE&&e.type!==sn.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Qt(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===qe||t===O)return t;let n=e.element,r=e.name;if(e.type===sn.PROPERTY){if(t===n[r])return qe}else if(e.type===sn.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(r))return qe}else if(e.type===sn.ATTRIBUTE&&n.getAttribute(r)===t+``)return qe;return en(e),t}}),$=class extends L{constructor(){super(...arguments),this.formControlController=new Da(this,{assumeInteractionOn:[`sl-blur`,`sl-input`]}),this.hasSlotController=new ua(this,`help-text`,`label`),this.localize=new Dn(this),this.hasFocus=!1,this.title=``,this.__numberInput=Object.assign(document.createElement(`input`),{type:`number`}),this.__dateInput=Object.assign(document.createElement(`input`),{type:`date`}),this.type=`text`,this.name=``,this.value=``,this.defaultValue=``,this.size=`medium`,this.filled=!1,this.pill=!1,this.label=``,this.helpText=``,this.clearable=!1,this.disabled=!1,this.placeholder=``,this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form=``,this.required=!1,this.spellcheck=!0}get valueAsDate(){return this.__dateInput.type=this.type,this.__dateInput.value=this.value,this.input?.valueAsDate||this.__dateInput.valueAsDate}set valueAsDate(e){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=e,this.value=this.__dateInput.value}get valueAsNumber(){return this.__numberInput.value=this.value,this.input?.valueAsNumber||this.__numberInput.valueAsNumber}set valueAsNumber(e){this.__numberInput.valueAsNumber=e,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleChange(){this.value=this.input.value,this.emit(`sl-change`)}handleClearClick(e){e.preventDefault(),this.value!==``&&(this.value=``,this.emit(`sl-clear`),this.emit(`sl-input`),this.emit(`sl-change`)),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit(`sl-input`)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleKeyDown(e){let t=e.metaKey||e.ctrlKey||e.shiftKey||e.altKey;e.key===`Enter`&&!t&&setTimeout(()=>{!e.defaultPrevented&&!e.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(e,t,n=`none`){this.input.setSelectionRange(e,t,n)}setRangeText(e,t,n,r=`preserve`){let i=t??this.input.selectionStart,a=n??this.input.selectionEnd;this.input.setRangeText(e,i,a,r),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){`showPicker`in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){let e=this.hasSlotController.test(`label`),t=this.hasSlotController.test(`help-text`),n=this.label?!0:!!e,r=this.helpText?!0:!!t,i=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value==`number`||this.value.length>0);return D`
      <div
        part="form-control"
        class=${R({"form-control":!0,"form-control--small":this.size===`small`,"form-control--medium":this.size===`medium`,"form-control--large":this.size===`large`,"form-control--has-label":n,"form-control--has-help-text":r})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${n?`false`:`true`}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${R({input:!0,"input--small":this.size===`small`,"input--medium":this.size===`medium`,"input--large":this.size===`large`,"input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type===`password`&&this.passwordVisible?`text`:this.type}
              title=${this.title}
              name=${z(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${z(this.placeholder)}
              minlength=${z(this.minlength)}
              maxlength=${z(this.maxlength)}
              min=${z(this.min)}
              max=${z(this.max)}
              step=${z(this.step)}
              .value=${Ip(this.value)}
              autocapitalize=${z(this.autocapitalize)}
              autocomplete=${z(this.autocomplete)}
              autocorrect=${z(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${z(this.pattern)}
              enterkeyhint=${z(this.enterkeyhint)}
              inputmode=${z(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${i?D`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term(`clearEntry`)}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `:``}
            ${this.passwordToggle&&!this.disabled?D`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?`hidePassword`:`showPassword`)}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?D`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:D`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                `:``}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?`false`:`true`}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};$.styles=[M,Fp,Np],$.dependencies={"sl-icon":on},A([I(`.input__control`)],$.prototype,`input`,2),A([F()],$.prototype,`hasFocus`,2),A([P()],$.prototype,`title`,2),A([P({reflect:!0})],$.prototype,`type`,2),A([P()],$.prototype,`name`,2),A([P()],$.prototype,`value`,2),A([Pp()],$.prototype,`defaultValue`,2),A([P({reflect:!0})],$.prototype,`size`,2),A([P({type:Boolean,reflect:!0})],$.prototype,`filled`,2),A([P({type:Boolean,reflect:!0})],$.prototype,`pill`,2),A([P()],$.prototype,`label`,2),A([P({attribute:`help-text`})],$.prototype,`helpText`,2),A([P({type:Boolean})],$.prototype,`clearable`,2),A([P({type:Boolean,reflect:!0})],$.prototype,`disabled`,2),A([P()],$.prototype,`placeholder`,2),A([P({type:Boolean,reflect:!0})],$.prototype,`readonly`,2),A([P({attribute:`password-toggle`,type:Boolean})],$.prototype,`passwordToggle`,2),A([P({attribute:`password-visible`,type:Boolean})],$.prototype,`passwordVisible`,2),A([P({attribute:`no-spin-buttons`,type:Boolean})],$.prototype,`noSpinButtons`,2),A([P({reflect:!0})],$.prototype,`form`,2),A([P({type:Boolean,reflect:!0})],$.prototype,`required`,2),A([P()],$.prototype,`pattern`,2),A([P({type:Number})],$.prototype,`minlength`,2),A([P({type:Number})],$.prototype,`maxlength`,2),A([P()],$.prototype,`min`,2),A([P()],$.prototype,`max`,2),A([P()],$.prototype,`step`,2),A([P()],$.prototype,`autocapitalize`,2),A([P()],$.prototype,`autocorrect`,2),A([P()],$.prototype,`autocomplete`,2),A([P({type:Boolean})],$.prototype,`autofocus`,2),A([P()],$.prototype,`enterkeyhint`,2),A([P({type:Boolean,converter:{fromAttribute:e=>!(!e||e===`false`),toAttribute:e=>e?`true`:`false`}})],$.prototype,`spellcheck`,2),A([P()],$.prototype,`inputmode`,2),A([j(`disabled`,{waitUntilFirstUpdate:!0})],$.prototype,`handleDisabledChange`,1),A([j(`step`,{waitUntilFirstUpdate:!0})],$.prototype,`handleStepChange`,1),A([j(`value`,{waitUntilFirstUpdate:!0})],$.prototype,`handleValueChange`,1),$.define(`sl-input`);var Lp={schemas:`Schemas`,responses:`Responses`,parameters:`Parameters`,requestBodies:`Request Bodies`,headers:`Headers`,securitySchemes:`Security Schemes`,examples:`Examples`,links:`Links`,callbacks:`Callbacks`},Rp=[`GET`,`POST`,`PUT`,`DELETE`,`PATCH`,`OPTIONS`,`HEAD`,`QUERY`],zp=class extends k{constructor(...e){super(...e),this.type=`operations`,this.heading=``,this.items=[],this.filterValue=``,this.searchTerm=``,this.filteredItems=[],this.filterOptions=[],this.handleClear=()=>{clearTimeout(this.searchTimeout),this.searchTerm=``}}static{this.styles=Mp}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.searchTimeout)}willUpdate(e){e.has(`items`)&&this.type===`components`&&(this.filterOptions=[...new Set(this.items.map(e=>e.componentType))].sort()),(e.has(`items`)||e.has(`filterValue`)||e.has(`searchTerm`))&&(this.filteredItems=this.computeFiltered())}computeFiltered(){let e=this.searchTerm.toLowerCase();if(this.type===`operations`){let t=this.items;return this.filterValue&&(t=t.filter(e=>e.method.toUpperCase()===this.filterValue)),e&&(t=t.filter(t=>t.path.toLowerCase().includes(e))),t}else{let t=this.items;return this.filterValue&&(t=t.filter(e=>e.componentType===this.filterValue)),e&&(t=t.filter(t=>t.name.toLowerCase().includes(e))),t}}handleSearch(e){clearTimeout(this.searchTimeout);let t=e.target.value;this.searchTimeout=window.setTimeout(()=>{this.searchTerm=t},150)}handleFilter(e){this.filterValue=e.detail?.item?.value??``}renderToolbar(){let e=this.type===`operations`?this.filterValue||`ALL METHODS`:Lp[this.filterValue]?.toUpperCase()||this.filterValue?.toUpperCase()||`ALL TYPES`;return D`
            <div class="toolbar">
                <sl-dropdown>
                    <sl-button slot="trigger" class="filter-btn" caret size="small">
                        ${this.type===`operations`&&this.filterValue?D`<pb33f-http-method method=${this.filterValue} tiny></pb33f-http-method>`:e}
                    </sl-button>
                    <sl-menu @sl-select=${this.handleFilter}>
                        <sl-menu-item value="">
                            ${this.type===`operations`?`ALL METHODS`:`ALL TYPES`}
                        </sl-menu-item>
                        ${this.type===`operations`?Rp.map(e=>D`
                                <sl-menu-item value=${e}><pb33f-http-method method=${e}></pb33f-http-method></sl-menu-item>`):this.filterOptions.map(e=>D`
                                <sl-menu-item value=${e}>
                                    ${Lp[e]||e}
                                </sl-menu-item>`)}
                    </sl-menu>
                </sl-dropdown>
                <sl-input
                    size="small"
                    placeholder=${this.type===`operations`?`SEARCH PATHS...`:`SEARCH NAMES...`}
                    aria-label=${this.type===`operations`?`Filter by path`:`Search components`}
                    clearable
                    @sl-input=${this.handleSearch}
                    @sl-clear=${this.handleClear}>
                </sl-input>
            </div>
        `}renderOperationItem(e){return D`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:var(--global-padding-half) 0">
                <pb33f-http-method method=${e.method} tiny></pb33f-http-method>
                <a style="color:var(--font-color);text-decoration:none;font-family:var(--font-stack),monospace;--op-path-text-decoration:none"
                   @mouseenter=${e=>e.target.style.setProperty(`--op-path-text-decoration`,`underline`)}
                   @mouseleave=${e=>e.target.style.setProperty(`--op-path-text-decoration`,`none`)}
                   @focus=${e=>e.target.style.setProperty(`--op-path-text-decoration`,`underline`)}
                   @blur=${e=>e.target.style.setProperty(`--op-path-text-decoration`,`none`)}
                   href="operations/${e.slug}.html">
                    <pb33f-render-operation-path path=${e.path} nowrap></pb33f-render-operation-path>
                </a>
            </div>
        `}renderComponentItem(e){return D`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">
                <pb33f-model-icon icon=${e.componentType} size="medium"></pb33f-model-icon>
                <a style="color:var(--terminal-text);text-decoration:none;font-family:var(--font-stack),monospace"
                   @mouseenter=${e=>e.target.style.textDecoration=`underline`}
                   @mouseleave=${e=>e.target.style.textDecoration=`none`}
                   href="models/${e.typeSlug}/${e.slug}.html"><span aria-hidden="true">\u279c</span> ${e.name}</a>
            </div>
        `}render(){if(!this.items.length)return O;let e=this.type===`operations`?this.filteredItems.map(e=>this.renderOperationItem(e)):this.filteredItems.map(e=>this.renderComponentItem(e)),t=this.items.length>20;return D`
            <h3>${this.heading}</h3>
            ${t?this.renderToolbar():O}
            ${this.filteredItems.length?D`<pb33f-paginator-navigation
                            .values=${e}
                            .label=${this.heading}
                            hideSparks>
                        </pb33f-paginator-navigation>`:D`<div class="empty-state">No matching references</div>`}
        `}};q([P()],zp.prototype,`type`,void 0),q([P()],zp.prototype,`heading`,void 0),q([P({type:Array})],zp.prototype,`items`,void 0),q([F()],zp.prototype,`filterValue`,void 0),q([F()],zp.prototype,`searchTerm`,void 0),q([F()],zp.prototype,`filteredItems`,void 0),q([F()],zp.prototype,`filterOptions`,void 0),zp=q([N(`pp-ref-list`)],zp);var Bp=class extends k{constructor(...e){super(...e),this.refsJson=``,this.refs={}}static{this.styles=jp}willUpdate(e){if(e.has(`refsJson`)&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){let{refs:e}=this,t=(e.usedByOperations?.length??0)>0,n=(e.usedByModels?.length??0)>0,r=(e.usesModels?.length??0)>0;return!t&&!n&&!r?O:D`
            ${t?D`
                <pp-ref-list
                    type="operations"
                    heading="Consumed By"
                    .items=${e.usedByOperations}>
                </pp-ref-list>`:O}
            ${n?D`
                <pp-ref-list
                    type="components"
                    heading="Referenced By"
                    .items=${e.usedByModels}>
                </pp-ref-list>`:O}
            ${r?D`
                <pp-ref-list
                    type="components"
                    heading="References"
                    .items=${e.usesModels}>
                </pp-ref-list>`:O}
        `}};q([P({attribute:`refs-json`})],Bp.prototype,`refsJson`,void 0),q([F()],Bp.prototype,`refs`,void 0),Bp=q([N(`pp-cross-refs`)],Bp);var Vp=E`
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
`,Hp=Ha`
  
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

 
`,Up=E`
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
`;tp.default.manual=!0;var Wp=class extends k{constructor(...e){super(...e),this.name=``,this.exampleJson=``,this.formatted=``}static{this.styles=[Vp,Hp,Up]}willUpdate(e){if(e.has(`exampleJson`)&&this.exampleJson)try{let e=JSON.parse(this.exampleJson);this.formatted=JSON.stringify(e,null,2)}catch{this.formatted=``}}render(){if(!this.formatted)return O;let e;try{e=tp.default.highlight(this.formatted,tp.default.languages.json,`json`)}catch{e=this.formatted}return D`
      <details>
        <summary>${this.name||`Example`}</summary>
        <pre class="json"><code>${ld(e)}</code></pre>
      </details>
    `}};q([P()],Wp.prototype,`name`,void 0),q([P({attribute:`example-json`})],Wp.prototype,`exampleJson`,void 0),q([F()],Wp.prototype,`formatted`,void 0),Wp=q([N(`pp-example-block`)],Wp);var Gp=E`
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
`,Kp=class extends k{constructor(...e){super(...e),this.title=``,this.json=``,this.yaml=``,this.format=`json`,this.rawMode=!1,this.highlightLines=``,this.startLine=1,this.location=``,this.method=``,this.path=``,this.componentType=``,this.handleShowExample=e=>{let t=e.detail;if(this.title=t.title,this.json=t.json,this.yaml=t.yaml||``,this.rawMode=t.rawMode??!1,this.highlightLines=t.highlightLines||``,this.startLine=t.startLine??1,this.location=t.location||``,this.method=t.method||``,this.path=t.path||``,this.componentType=t.componentType||``,t.language)this.format=t.language;else{let e=document.body.getAttribute(`data-spec-format`);e===`yaml`&&t.yaml?this.format=`yaml`:e===`json`&&t.json?this.format=`json`:this.format=t.yaml?`yaml`:`json`}this.updateComplete.then(()=>{let e=this.drawer;e&&typeof e.show==`function`&&(e.updateComplete?e.updateComplete.then(()=>e.show()):e.show())})}}static{this.styles=[Gp,vp]}connectedCallback(){super.connectedCallback(),document.addEventListener(`pp-show-example`,this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`pp-show-example`,this.handleShowExample)}get copyText(){let e=this.shadowRoot?.querySelector(`pp-code-viewer`);return e?e.displayCode:this.format===`yaml`&&this.yaml?this.yaml:this.json}renderHeader(){return this.method&&this.path?D`
        <div class="rich-header">
          <pb33f-http-method method=${this.method}></pb33f-http-method>
          <pb33f-render-operation-path path=${this.path} nowrap></pb33f-render-operation-path>
        </div>
      `:this.componentType?D`
        <div class="component-header">
          <pb33f-model-icon icon=${this.componentType} size="large"></pb33f-model-icon>
          <span class="drawer-component-title">${this.title}</span>
        </div>
      `:D`<h3 class="drawer-title">${this.title||`Example`}</h3>`}render(){let e=this.format===`yaml`&&this.yaml?this.yaml:this.json,t=this.format;return D`
      <sl-drawer placement="end" no-header>
        <div class="drawer-header">
          ${this.renderHeader()}
          <div class="header-actions">
            ${this.yaml?D`
              <div class="format-toggle">
                <button class="${this.format===`json`?`active`:``}"
                        ?disabled=${!this.json}
                        @click=${()=>this.format=`json`}>JSON</button>
                <button class="${this.format===`yaml`?`active`:``}"
                        @click=${()=>this.format=`yaml`}>YAML</button>
              </div>
            `:``}
            <sl-icon-button name="x-lg" label="Close" class="close-btn"
                @click=${()=>this.drawer?.hide()}></sl-icon-button>
          </div>
        </div>
        <div class="code-container">
          <sl-copy-button .value=${e} class="floating-copy"></sl-copy-button>
          <pp-code-viewer
            .code=${e}
            .language=${t}
            ?line-numbers=${this.rawMode}
            .pretty=${t===`json`}
            .startLine=${this.startLine}
            .location=${this.location}
            highlight-lines=${this.highlightLines}
            embedded>
          </pp-code-viewer>
        </div>
      </sl-drawer>
    `}};q([F()],Kp.prototype,`title`,void 0),q([F()],Kp.prototype,`json`,void 0),q([F()],Kp.prototype,`yaml`,void 0),q([F()],Kp.prototype,`format`,void 0),q([F()],Kp.prototype,`rawMode`,void 0),q([F()],Kp.prototype,`highlightLines`,void 0),q([F()],Kp.prototype,`startLine`,void 0),q([F()],Kp.prototype,`location`,void 0),q([F()],Kp.prototype,`method`,void 0),q([F()],Kp.prototype,`path`,void 0),q([F()],Kp.prototype,`componentType`,void 0),q([I(`sl-drawer`)],Kp.prototype,`drawer`,void 0),Kp=q([N(`pp-example-drawer`)],Kp);var qp=E`
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
`,Jp=class extends k{constructor(...e){super(...e),this.btnTitle=``,this.rawJson=``,this.rawYaml=``,this.highlightLines=``,this.startLine=1,this.location=``,this.method=``,this.path=``,this.componentType=``,this.showTextLabel=!1}static{this.styles=[qp,vp]}showRaw(){let e=new CustomEvent(`pp-show-example`,{bubbles:!0,composed:!0,detail:{title:this.btnTitle||`Raw Object`,json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0,method:this.method||void 0,path:this.path||void 0,componentType:this.componentType||void 0}});this.dispatchEvent(e)}render(){return!this.rawJson&&!this.rawYaml?O:D`
            <sl-tooltip content="VIEW RAW OBJECT">
                <sl-button variant="text" size="small" @click=${this.showRaw}>
                    <sl-icon slot="prefix" name="braces" label="VIEW RAW OBJECT" ></sl-icon>
                </sl-button>
            </sl-tooltip>`}};q([P({attribute:`title`})],Jp.prototype,`btnTitle`,void 0),q([P({attribute:`raw-json`})],Jp.prototype,`rawJson`,void 0),q([P({attribute:`raw-yaml`})],Jp.prototype,`rawYaml`,void 0),q([P({attribute:`highlight-lines`})],Jp.prototype,`highlightLines`,void 0),q([P({attribute:`start-line`,type:Number})],Jp.prototype,`startLine`,void 0),q([P()],Jp.prototype,`location`,void 0),q([P()],Jp.prototype,`method`,void 0),q([P()],Jp.prototype,`path`,void 0),q([P({attribute:`component-type`})],Jp.prototype,`componentType`,void 0),q([P({type:Boolean})],Jp.prototype,`showTextLabel`,void 0),Jp=q([N(`pp-raw-viewer-btn`)],Jp);var Yp=E`
    :host {
        display: block;
        margin-top: var(--global-padding);
    }

    .scheme-properties {
        border: 1px dashed var(--hrcolor);
    }

    .property {
        display: grid;
        grid-template-columns: 200px minmax(0, 1fr);
        gap: 0 1rem;
        padding: var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
        align-items: baseline;
    }

    .prop-name-col {
        text-align: right;
    }

    .prop-name {
        font-family: var(--font-stack-bold), monospace;
    }

    .prop-type-col {
        display: flex;
        align-items: baseline;
        gap: var(--global-padding-half);
    }

    .prop-type {
        font-family: var(--font-stack), monospace;
        color: var(--primary-color);
    }

    .type-icon {
        color: var(--primary-color);
    }

    .url-link {
        font-family: var(--font-stack), monospace;
        color: var(--primary-color);
        text-decoration: none;
        overflow-wrap: anywhere;
    }

    .url-link:hover {
        text-decoration: underline;
    }

    /* Flow sections */
    .flow-section {
        border-top: 1px dashed var(--hrcolor);
    }

    .flow-heading {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        padding: var(--global-padding);
    }

    /* Scopes — reuse the same .property grid for alignment */
    .scopes-section {
        border-top: 1px dotted var(--hrcolor);
    }

    .scope-header {
        border-bottom: none;
    }

    .scope-heading {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
    }

    .scope-row .prop-name-col {
        text-align: right;
    }

    .scope-name {
        font-family: var(--font-stack), monospace;
        color: var(--warn-400);
        overflow-wrap: anywhere;
    }

    .scope-desc {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
    }
`,Xp={implicit:`IMPLICIT`,authorizationCode:`AUTHORIZATION CODE`,clientCredentials:`CLIENT CREDENTIALS`,password:`PASSWORD`};function Zp(e,t,n){switch(e){case`apiKey`:switch(t){case`cookie`:return`cookie`;case`header`:return`envelope`;case`query`:return`signpost`;default:return`key`}case`http`:switch(n){case`bearer`:return`shield-lock`;case`basic`:return`person-lock`;default:return`lock`}case`oauth2`:return`key`;case`openIdConnect`:return`fingerprint`;default:return`lock`}}var Qp=class extends k{constructor(...e){super(...e),this.schemeJson=``,this.scheme=null}static{this.styles=[vu,Yp]}willUpdate(e){if(e.has(`schemeJson`)&&this.schemeJson)try{this.scheme=JSON.parse(this.schemeJson)}catch{this.scheme=null}}renderProperty(e,t){return D`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">${e}</span></div>
                <div class="prop-type-col"><span class="prop-type">${t}</span></div>
            </div>
        `}renderTypeProperty(e,t){return D`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">type</span></div>
                <div class="prop-type-col">
                    <sl-icon name=${t} class="type-icon"></sl-icon>
                    <span class="prop-type">${e.toUpperCase()}</span>
                </div>
            </div>
        `}renderUrlProperty(e,t){return D`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">${e}</span></div>
                <div class="prop-type-col">
                    <a class="url-link" href=${t} target="_blank" rel="noopener noreferrer">${t}</a>
                </div>
            </div>
        `}renderScopes(e){let t=Object.entries(e);return t.length===0?O:D`
            <div class="scopes-section">
                <div class="property scope-header">
                    <div class="prop-name-col"><span class="scope-heading">SCOPES</span></div>
                    <div class="prop-type-col"></div>
                </div>
                ${t.map(([e,t])=>D`
                    <div class="property scope-row">
                        <div class="prop-name-col"><code class="scope-name">${e}</code></div>
                        <div class="prop-type-col"><span class="scope-desc">${t}</span></div>
                    </div>
                `)}
            </div>
        `}renderFlow(e,t){return t?D`
            <div class="flow-section">
                <div class="flow-heading">${Xp[e]||e.toUpperCase()}</div>
                ${t.authorizationUrl?this.renderUrlProperty(`authorizationUrl`,t.authorizationUrl):O}
                ${t.tokenUrl?this.renderUrlProperty(`tokenUrl`,t.tokenUrl):O}
                ${t.refreshUrl?this.renderUrlProperty(`refreshUrl`,t.refreshUrl):O}
                ${t.scopes&&Object.keys(t.scopes).length>0?this.renderScopes(t.scopes):O}
            </div>
        `:O}renderFlows(e){if(!e||typeof e!=`object`)return O;let t=Object.keys(e);return t.length===0?O:t.map(t=>this.renderFlow(t,e[t]))}render(){if(!this.scheme)return O;let{type:e,name:t,scheme:n,bearerFormat:r,openIdConnectUrl:i,flows:a}=this.scheme,o=Zp(e,this.scheme.in,n);return D`
            <div class="scheme-properties">
                ${e?this.renderTypeProperty(e,o):O}
                ${t?this.renderProperty(`name`,t):O}
                ${this.scheme.in?this.renderProperty(`in`,this.scheme.in):O}
                ${n?this.renderProperty(`scheme`,n):O}
                ${r?this.renderProperty(`bearerFormat`,r):O}
                ${i?this.renderUrlProperty(`openIdConnectUrl`,i):O}
                ${e===`oauth2`?this.renderFlows(a):O}
            </div>
        `}};q([P({attribute:`scheme-json`})],Qp.prototype,`schemeJson`,void 0),q([F()],Qp.prototype,`scheme`,void 0),Qp=q([N(`pp-security-scheme`)],Qp);var $p=E`
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
`,em=`pp-page-nav-collapsed`,tm=`pp-page-nav-hidden`,nm=class extends k{constructor(...e){super(...e),this.pageTitle=``,this.sectionsJson=``,this.sections=[],this.collapsed=!1,this.navHidden=!1,this.activeId=``,this.scrollContainer=null,this.rafId=0,this.scrollSpySuppressed=!1,this.suppressionTimerId=0,this.boundScrollHandler=()=>this.onScroll(),this.boundHydrationHandler=()=>this.handleHydrationComplete()}static{this.styles=[$p]}connectedCallback(){super.connectedCallback(),this.collapsed=localStorage.getItem(em)===`true`,this.navHidden=localStorage.getItem(tm)===`true`,document.addEventListener(`pp:hydrated`,this.boundHydrationHandler)}disconnectedCallback(){super.disconnectedCallback(),this.scrollContainer?.removeEventListener(`scroll`,this.boundScrollHandler),this.clearSuppressionTimer(),document.removeEventListener(`pp:hydrated`,this.boundHydrationHandler)}clearSuppressionTimer(){this.suppressionTimerId&&=(window.clearTimeout(this.suppressionTimerId),0)}updated(e){e.has(`navHidden`)&&this.toggleAttribute(`nav-hidden`,this.navHidden)}willUpdate(e){if(e.has(`sectionsJson`)&&this.sectionsJson){try{this.sections=JSON.parse(this.sectionsJson)}catch{this.sections=[]}this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}}loadResponseChildren(){let e=this.sections.find(e=>e.id===`section-responses`);if(!e)return;let t=()=>{let t=document.getElementById(`section-responses`);t&&typeof t.getResponseNavItems==`function`&&(e.children=t.getResponseNavItems(),this.requestUpdate())};t(),e.children?.length||customElements.whenDefined(`pp-operation-responses`).then(()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>t())})})}setupScrollSpy(){this.scrollContainer?.removeEventListener(`scroll`,this.boundScrollHandler),this.scrollContainer=document.querySelector(`pp-layout`)?.shadowRoot?.querySelector(`.content-panel`)||null,this.scrollContainer&&this.scrollContainer.addEventListener(`scroll`,this.boundScrollHandler,{passive:!0})}handleHydrationComplete(){this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}suppressScrollSpy(){this.scrollSpySuppressed=!0,this.clearSuppressionTimer()}scheduleScrollSpyResume(){this.clearSuppressionTimer(),this.suppressionTimerId=window.setTimeout(()=>{this.scrollSpySuppressed=!1,this.suppressionTimerId=0},150)}onScroll(){if(this.scrollSpySuppressed){this.scheduleScrollSpyResume();return}this.rafId||=requestAnimationFrame(()=>{this.rafId=0,this.updateActiveSection()})}updateActiveSection(){let e=``;for(let t of this.sections){let n=this.findElement(t.id);if(n&&n.getBoundingClientRect().top<=100&&(e=t.id),t.children)for(let n of t.children){let t=this.findElement(n.id);t&&t.getBoundingClientRect().top<=100&&(e=n.id)}}e&&e!==this.activeId&&(this.activeId=e)}findElement(e){let t=document.getElementById(e);if(t)return t;let n=document.getElementById(`section-responses`);return n?.shadowRoot?n.shadowRoot.getElementById(e):null}navigateTo(e){this.suppressScrollSpy(),this.activeId=e;let t=this.findElement(e);if(!t)return;let n=t.closest(`sl-details`);n&&!n.open?(n.addEventListener(`sl-after-show`,()=>{t.scrollIntoView({behavior:`auto`,block:`center`})},{once:!0}),n.open=!0):t.scrollIntoView({behavior:`auto`,block:`center`})}toggleCollapsed(){this.collapsed=!this.collapsed,localStorage.setItem(em,String(this.collapsed))}toggleNavHidden(){let e=this.shadowRoot?.querySelector(`.collapse-tab`);e&&(e.addEventListener(`animationend`,()=>e.classList.remove(`flashing`),{once:!0}),e.classList.add(`flashing`));let t=this.shadowRoot?.querySelector(`.nav-container`);!this.navHidden&&t?t.style.height=t.offsetHeight+`px`:this.navHidden&&t&&(t.style.height=``),this.navHidden=!this.navHidden,localStorage.setItem(tm,String(this.navHidden))}handleTabKeydown(e){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.toggleNavHidden())}statusColorClass(e){let t=e.substring(0,1);return t===`2`?`status-2xx`:t===`3`?`status-3xx`:t===`4`?`status-4xx`:t===`5`?`status-5xx`:``}render(){return D`
            <div class="nav-container">
                <nav aria-label="Page sections">
                    <div class="nav-header" @click=${this.toggleCollapsed}
                         aria-expanded=${!this.collapsed}>
                        <span class="nav-title">${this.pageTitle}</span>
                        <sl-icon name=${this.collapsed?`chevron-right`:`chevron-down`}></sl-icon>
                    </div>
                    ${this.collapsed?O:D`
                        <ul class="nav-sections">
                            ${this.sections.map(e=>D`
                                <li>
                                    <a href="#${e.id}"
                                       class=${e.id===this.activeId?`active`:``}
                                       aria-current=${e.id===this.activeId?`true`:O}
                                       @click=${t=>{t.preventDefault(),this.navigateTo(e.id)}}>
                                        ${e.label}
                                    </a>
                                    ${e.children?.length?D`
                                        <ul class="nav-children">
                                            ${e.children.map(e=>D`
                                                <li>
                                                    <sl-icon name="chevron-right"></sl-icon>
                                                    <a href="#${e.id}"
                                                       class="${e.id===this.activeId?`active`:``} ${this.statusColorClass(e.label)}"
                                                       @click=${t=>{t.preventDefault(),this.navigateTo(e.id)}}>
                                                        ${e.label}
                                                    </a>
                                                </li>
                                            `)}
                                        </ul>
                                    `:O}
                                </li>
                            `)}
                        </ul>
                    `}
                </nav>
                <div class="collapse-tab"
                     role="button"
                     tabindex="0"
                     aria-label=${this.navHidden?`Expand navigation`:`Collapse navigation`}
                     @click=${this.toggleNavHidden}
                     @keydown=${this.handleTabKeydown}>
                    <sl-icon name=${this.navHidden?`chevron-left`:`chevron-right`}></sl-icon>
                </div>
            </div>
        `}};q([P({attribute:`page-title`})],nm.prototype,`pageTitle`,void 0),q([P({attribute:`sections-json`})],nm.prototype,`sectionsJson`,void 0),q([F()],nm.prototype,`sections`,void 0),q([F()],nm.prototype,`collapsed`,void 0),q([F()],nm.prototype,`navHidden`,void 0),q([F()],nm.prototype,`activeId`,void 0),nm=q([N(`pp-page-nav`)],nm),ht(`static/shoelace`);var rm={sun:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>`,moon:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>`,display:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>`,"chevron-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>`,"chevron-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>`,"chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>`,"grip-vertical":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>`,braces:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/></svg>`,envelope:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>`,"question-diamond":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/> <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>`,cookie:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/> <path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/></svg>`,signpost:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M12.532 5l1.666 2-1.666 2H2V5z"/></svg>`,"shield-lock":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/> <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/></svg>`,"person-lock":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/></svg>`,lock:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/></svg>`,key:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/> <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>`,plug:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plug" viewBox="0 0 16 16"><path d="M6 0a.5.5 0 0 1 .5.5V3h3V.5a.5.5 0 0 1 1 0V3h1a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 10c-.002.434-.01.845-.04 1.22-.041.514-.126 1.003-.317 1.424a2.08 2.08 0 0 1-.97 1.028C6.725 13.9 6.169 14 5.5 14c-.998 0-1.61.33-1.974.718A1.92 1.92 0 0 0 3 16H2c0-.616.232-1.367.797-1.968C3.374 13.42 4.261 13 5.5 13c.581 0 .962-.088 1.218-.219.241-.123.4-.3.514-.55.121-.266.193-.621.23-1.09.027-.34.035-.718.037-1.141A3.5 3.5 0 0 1 4 6.5v-3a.5.5 0 0 1 .5-.5h1V.5A.5.5 0 0 1 6 0M5 4v2.5A2.5 2.5 0 0 0 7.5 9h1A2.5 2.5 0 0 0 11 6.5V4z"/></svg>`,fingerprint:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/> <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/> <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/> <path d="M3.902 4.222a5 5 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 4 4 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556m6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705M3.68 5.842a.5.5 0 0 1 .422.568q-.044.289-.044.59c0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.5 6.5 0 0 0 3.058 7q0-.375.054-.736a.5.5 0 0 1 .568-.422m8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.5 10.5 0 0 0 .584-2.678.5.5 0 0 1 .54-.456"/> <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865m-.89 1.257a.5.5 0 0 1 .04.706A5.48 5.48 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346m12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49"/></svg>`,"x-lg":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`,"hdd-network":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"/></svg>`,"box-arrow-up-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>`,box:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>`,"box-arrow-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/> <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>`,"braces-asterisk":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z"/></svg>`,"box-arrow-in-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/> <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>`,link:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/></svg>`,"telephone-outbound":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"/></svg>`,geo:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/></svg>`,"chat-left-quote":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/></svg>`,"arrow-clockwise":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>`,"arrow-counterclockwise":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308c-.12.1-.12.284 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/></svg>`,"x-diamond":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.987 16a1.53 1.53 0 0 1-1.07-.448L.45 9.082a1.53 1.53 0 0 1 0-2.165L6.917.45a1.53 1.53 0 0 1 2.166 0l6.469 6.468a1.53 1.53 0 0 1 0 2.164l-6.48 6.48a1.53 1.53 0 0 1-1.085.448M.879 8l7.108 7.108L15.096 8 7.987.879zM5.846 4.553a.5.5 0 1 0-.708.708L7.293 7.41 5.138 9.564a.5.5 0 0 0 .708.708L8 8.118l2.154 2.154a.5.5 0 0 0 .708-.708L8.708 7.41l2.154-2.149a.5.5 0 1 0-.708-.708L8 6.702z"/></svg>`,"gear-wide-connected":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/></svg>`,"chevron-double-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/> <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>`,"chevron-double-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/> <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/></svg>`,"zoom-in":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"/></svg>`,"zoom-out":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/></svg>`,"image-alt":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5z"/></svg>`,image:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/></svg>`,eye:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>`,"eye-slash":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>`,"arrows-fullscreen":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"/></svg>`,"filetype-svg":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM0 14.841a1.13 1.13 0 0 0 .401.823q.194.162.478.252.285.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357a2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.187-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566a1.2 1.2 0 0 0-.5-.41a1.8 1.8 0 0 0-.78-.152q-.44 0-.776.15-.337.149-.528.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.256.193q-.167.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zm4.575 1.09h.952l1.327-3.999h-.879l-.887 3.138H5.05l-.897-3.138h-.917zm5.483-3.293q.114.228.14.492h-.776a.8.8 0 0 0-.096-.249.7.7 0 0 0-.17-.19.7.7 0 0 0-.237-.126 1 1 0 0 0-.3-.044q-.427 0-.664.302-.235.3-.235.85v.497q0 .352.097.616a.9.9 0 0 0 .305.413.87.87 0 0 0 .518.146 1 1 0 0 0 .457-.097.67.67 0 0 0 .273-.263q.09-.164.09-.364v-.254h-.823v-.59h1.576v.798q0 .29-.096.55a1.3 1.3 0 0 1-.293.457 1.4 1.4 0 0 1-.495.314q-.296.111-.698.111a2 2 0 0 1-.752-.132 1.45 1.45 0 0 1-.534-.377 1.6 1.6 0 0 1-.319-.58 2.5 2.5 0 0 1-.105-.745v-.507q0-.54.199-.949.202-.406.583-.633.383-.228.926-.228.357 0 .635.1.282.1.48.275.2.176.314.407"/></svg>`};return wt(`default`,{resolver:e=>{let t=rm[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:`static/shoelace/assets/icons/${e}.svg`}}),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{re()},{once:!0}):re(),Object.defineProperty(e,`PpCodeViewer`,{enumerable:!0,get:function(){return rp}}),Object.defineProperty(e,`PpCrossRefs`,{enumerable:!0,get:function(){return Bp}}),Object.defineProperty(e,`PpCurlCommand`,{enumerable:!0,get:function(){return Qu}}),Object.defineProperty(e,`PpExampleBlock`,{enumerable:!0,get:function(){return Wp}}),Object.defineProperty(e,`PpExampleDrawer`,{enumerable:!0,get:function(){return Kp}}),Object.defineProperty(e,`PpExampleSelector`,{enumerable:!0,get:function(){return yp}}),Object.defineProperty(e,`PpExtensions`,{enumerable:!0,get:function(){return cp}}),Object.defineProperty(e,`PpIconTitle`,{enumerable:!0,get:function(){return ap}}),Object.defineProperty(e,`PpInlineCode`,{enumerable:!0,get:function(){return Dp}}),Object.defineProperty(e,`PpLayout`,{enumerable:!0,get:function(){return xu}}),Object.defineProperty(e,`PpMediaTypeSelector`,{enumerable:!0,get:function(){return xp}}),Object.defineProperty(e,`PpModelCard`,{enumerable:!0,get:function(){return Ap}}),Object.defineProperty(e,`PpModelPage`,{enumerable:!0,get:function(){return Op}}),Object.defineProperty(e,`PpNav`,{enumerable:!0,get:function(){return Cu}}),Object.defineProperty(e,`PpNavModelGroup`,{enumerable:!0,get:function(){return ku}}),Object.defineProperty(e,`PpNavOperation`,{enumerable:!0,get:function(){return ju}}),Object.defineProperty(e,`PpNavTag`,{enumerable:!0,get:function(){return Eu}}),Object.defineProperty(e,`PpOperationCallbacks`,{enumerable:!0,get:function(){return wp}}),Object.defineProperty(e,`PpOperationParameters`,{enumerable:!0,get:function(){return lp}}),Object.defineProperty(e,`PpOperationResponses`,{enumerable:!0,get:function(){return Sp}}),Object.defineProperty(e,`PpPageNav`,{enumerable:!0,get:function(){return nm}}),Object.defineProperty(e,`PpRawViewerBtn`,{enumerable:!0,get:function(){return Jp}}),Object.defineProperty(e,`PpRefList`,{enumerable:!0,get:function(){return zp}}),Object.defineProperty(e,`PpRefPopover`,{enumerable:!0,get:function(){return op}}),Object.defineProperty(e,`PpSchemaProperties`,{enumerable:!0,get:function(){return ep}}),Object.defineProperty(e,`PpSecurityScheme`,{enumerable:!0,get:function(){return Qp}}),e})({});