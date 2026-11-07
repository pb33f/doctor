var PrintingPress=(function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=Object.create,n=Object.defineProperty,r=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,a=Object.getPrototypeOf,o=Object.prototype.hasOwnProperty,s=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),c=(e,t,a,s)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var c=i(t),l=0,u=c.length,d;l<u;l++)d=c[l],!o.call(e,d)&&d!==a&&n(e,d,{get:(e=>t[e]).bind(null,d),enumerable:!(s=r(t,d))||s.enumerable});return e},l=(e,r,i)=>(i=e==null?{}:t(a(e)),c(r||!e||!e.__esModule?n(i,`default`,{value:e,enumerable:!0}):i,e)),u=/^[a-zA-Z][a-zA-Z\d+.-]*:/;function d(e){return document.body?.dataset?.[e]||``}function f(){return d(`ppAssetMode`)===`served`?`served`:`portable`}function p(e,t){let n=`${e}${t}`,r=d(`ppBaseUrl`);if(!r||n.startsWith(`#`)||n.startsWith(`data:`)||u.test(n))return n;try{return new URL(n,new URL(r,window.location.href)).toString()}catch{return n}}async function m(e,t,n=f()){return e?n===`portable`?h(e,t):g(e):null}async function h(e,t){await new Promise((t,n)=>{let r=document.createElement(`script`);r.src=p(e,`.js`),r.async=!1,r.onload=()=>{r.remove(),t()},r.onerror=()=>{r.remove(),n(Error(`unable to load script asset: ${e}.js`))},document.head.appendChild(r)});let n=globalThis[t];return delete globalThis[t],n||null}async function g(e){let t=p(e,`.json`),n=await fetch(t);if(!n.ok)throw Error(`unable to fetch asset: ${t} (${n.status})`);return await n.json()}var _=new Map,ee=new Map,te=`__PP_PAGE_DATA__`;function ne(e){_.clear();for(let[t,n]of Object.entries(e))_.set(t,n)}function re(e){return _.get(e)}function v(e){if(e?.startsWith(`#/components/`))return re(e.replace(`#/components/`,``))}function y(e){return ee.get(e)}function ie(e){if(e?.startsWith(`#/components/`))return y(e.replace(`#/components/`,``))}async function ae(e){let t=ee.get(e);if(t)return t;let n=re(e);if(!n?.pageDataBase)return;let r=await m(n.pageDataBase,te);if(r?.model)return ee.set(e,r.model),r.model}async function oe(e){if(e?.startsWith(`#/components/`))return ae(e.replace(`#/components/`,``))}async function se(e,t=new Set){let n=ce(e);for(let e of n){if(t.has(e))continue;t.add(e);let n=await oe(e);if(n?.schemaJson)try{await se(JSON.parse(n.schemaJson),t)}catch{}}}function ce(e,t=new Set){if(!e||typeof e!=`object`)return t;if(Array.isArray(e)){for(let n of e)ce(n,t);return t}typeof e.$ref==`string`&&t.add(e.$ref);for(let n of Object.values(e))ce(n,t);return t}var le=`bags`,ue=`saddlebag`,de=class{_bags;_stateful;_db;constructor(e){this._bags=new Map,this._stateful=e}loadStatefulBags(){return new Promise(e=>{let t=indexedDB.open(ue,1);t.onupgradeneeded=()=>{this._db=t.result,this._db.createObjectStore(le)},t.onsuccess=()=>{if(this._db=t.result,this._db){this._bags.forEach(e=>{e.db||=this._db});let t=this._db.transaction(le).objectStore(le).openCursor();t.onsuccess=t=>{let n=t.target.result;if(n){let e=n.primaryKey,t=n.value,r=this.getBag(e);r&&!r.db&&(r.db=this._db),r?.populate(t),r&&this._bags.set(e,r),n.continue()}else e({db:this._db})}}}})}get db(){return this._db?this._db:null}createBag(e){if(this._bags.has(e))return this._bags.get(e);let t=me(e,this._stateful);return t.db=this._db,this._bags.set(e,t),t}getBag(e){return this._bags.has(e)?this._bags.get(e):this.createBag(e)}resetBags(){this._bags.forEach(e=>{e.reset()})}},fe;function pe(e){return fe||=new de(e||!1),fe}function me(e,t){return new ge(e,t)}var he=class{_allChangesBit;_key;_subFunction;_allChangesFunction;_populatedFunction;_bag;constructor(e,t){this._bag=e,this._allChangesBit=t,this._key=``,this._subFunction=void 0,this._allChangesFunction=void 0,this._populatedFunction=void 0}set allChangeFunction(e){this._allChangesFunction=e}set populatedFunction(e){this._populatedFunction=e}set subscriptionFunction(e){this._subFunction=e}set key(e){this._key=e}unsubscribe(){switch(this._allChangesBit){case 0:let e=this._bag._subscriptions.get(this._key);e&&this._bag._subscriptions.set(this._key,e.filter(e=>e!==this._subFunction));break;case 1:this._bag._allChangesSubscriptions=this._bag._allChangesSubscriptions.filter(e=>e!==this._allChangesFunction);break;case 2:this._bag._storePopulatedSubscriptions=this._bag._storePopulatedSubscriptions.filter(e=>e!==this._populatedFunction)}}},ge=class{_id;_stateful;_values;_db;_subscriptions;_allChangesSubscriptions;_storePopulatedSubscriptions;constructor(e,t){this._values=new Map,this._subscriptions=new Map,this._allChangesSubscriptions=[],this._storePopulatedSubscriptions=[],this._stateful=t||!1,this._id=e}set(e,t){this._values.set(e,structuredClone(t)),this.alertSubscribers(e,t),this._stateful&&this._db&&this._db.transaction([`bags`],`readwrite`).objectStore(`bags`).put(this._values,this._id),this._stateful&&!this._db&&console.error(`db not available, cannot write to db for key:`,e)}get id(){return this._id}get db(){return this._db}set db(e){this._db=e}reset(){this._values.forEach((e,t)=>{this.alertSubscribers(t,void 0)}),this._values=new Map,this._stateful&&this._db&&this._db.transaction([`bags`],`readwrite`).objectStore(`bags`).delete(this._id)}alertSubscribers(e,t){this._subscriptions.has(e)&&this._subscriptions.get(e)?.forEach(e=>e(t)),this._allChangesSubscriptions.length>0&&this._allChangesSubscriptions.forEach(n=>n(e,t))}get(e){return this._values.get(e)}populate(e){e&&e.size>0&&(this._values=structuredClone(e),this._storePopulatedSubscriptions.length>0&&this._storePopulatedSubscriptions.forEach(t=>t(e)))}export(){return this._values}subscribe(e,t){if(!this._subscriptions.has(e))this._subscriptions.set(e,[t]);else{let n=this._subscriptions.get(e);n&&this._subscriptions.set(e,[...n,t])}let n=new he(this,0);return n.key=e,n.subscriptionFunction=t,n}onAllChanges(e){this._allChangesSubscriptions.push(e);let t=new he(this,1);return t.allChangeFunction=e,t}onPopulated(e){this._storePopulatedSubscriptions.push(e);let t=new he(this,2);return t.populatedFunction=e,t}},_e=`__PP_SHARED_DATA__`,ve=`__PP_PAGE_DATA__`,ye=`shared-payload`,be=`printing-press:shared:`,xe=`saddlebag`,Se=`bags`,Ce=null,we=null;function b(e,t){let n=globalThis.__PP_LOG;typeof n==`function`&&n(e,t)}function Te(){return globalThis.__PP_BOOTSTRAP__||null}function Ee(){let e=globalThis,t=e.__PP_BOOTSTRAP__;if(t)return t;let n={};return e.__PP_BOOTSTRAP__=n,n}function De(){return Te()?.stopAtPreview===!0}async function Oe(e,t,n){let r=Te(),i=n===`shared`?r?.sharedPromise:r?.pagePromise;if(i){b(`${n}-payload:await-bootstrap-promise`,{assetBase:e});try{let t=await i;if(t)return b(`${n}-payload:resolved-from-bootstrap-promise`,{assetBase:e,hasPayload:!0}),t;b(`${n}-payload:bootstrap-promise-empty`,{assetBase:e})}catch{let t=r?.[n];if(t)return b(`${n}-payload:bootstrap-promise-failed-using-store`,{assetBase:e}),t||null;b(`${n}-payload:bootstrap-promise-failed`,{assetBase:e})}}if(r?.[n])return b(`${n}-payload:resolved-from-store`,{assetBase:e}),r[n]||null;b(`${n}-payload:load-asset:start`,{assetBase:e});let a=await m(e,t);return b(`${n}-payload:load-asset:done`,{assetBase:e,hasPayload:!!a}),a}function ke(e){try{return`${be}${new URL(p(e,``),document.baseURI).href}`}catch{return`${be}${e}`}}function Ae(){return new Promise(e=>{try{let t=indexedDB.open(xe,1);t.onerror=()=>e(null),t.onupgradeneeded=()=>{let e=t.result;e.objectStoreNames.contains(Se)||e.createObjectStore(Se)},t.onsuccess=()=>e(t.result)}catch{e(null)}})}function je(){return new Promise(e=>{try{let t=indexedDB.deleteDatabase(xe);t.onsuccess=()=>e(),t.onerror=()=>e(),t.onblocked=()=>e()}catch{e()}})}async function Me(){if(typeof indexedDB>`u`)return b(`shared-cache:indexeddb-unavailable`),!1;we||=(async()=>{let e=await Ae();if(!e)return b(`shared-cache:db-open-failed`),!1;if(e.objectStoreNames.contains(Se))return e.close(),b(`shared-cache:db-ready`),!0;if(e.close(),b(`shared-cache:missing-store-reset`),await je(),e=await Ae(),!e)return b(`shared-cache:db-reopen-failed`),!1;let t=e.objectStoreNames.contains(Se);return e.close(),b(`shared-cache:db-reset-result`,{ready:t}),t})();let e=await we;return e||(we=null),e}async function Ne(e){return!e||!await Me()?(b(`shared-cache:bag-unavailable`,{assetBase:e}),null):(Ce||=(async()=>{try{let e=pe(!0);return await e.loadStatefulBags(),b(`shared-cache:bag-manager-ready`),e}catch{return b(`shared-cache:bag-manager-failed`),null}})(),(await Ce)?.getBag(ke(e))??null)}async function Pe(e,t){if(!e||!t)return null;let n=await Ne(e),r=n?.get(ye);return r?r.hash===t?(b(`shared-cache:hit`,{assetBase:e}),r.payload??null):(n?.reset(),b(`shared-cache:stale`,{assetBase:e,cachedHash:r.hash,expectedHash:t}),null):(b(`shared-cache:miss`,{assetBase:e}),null)}async function Fe(e,t,n){!e||!t||!n||((await Ne(e))?.set(ye,{hash:t,payload:n}),b(`shared-cache:write`,{assetBase:e,expectedHash:t}))}function Ie(e){for(let[t,n]of Object.entries(e)){let e=document.getElementById(t);if(e){for(let[t,r]of Object.entries(n))e.setAttribute(t,r);t===`pp-nav`&&b(`nav-attributes:applied`,{nav:!!n[`data-nav`],models:!!n[`data-models`],webhooks:!!n[`data-webhooks`]})}}}function Le(e){e.querySelectorAll(`:scope > [data-pp-hydrated="true"]`).forEach(e=>e.remove())}function Re(e){let t=document.createElement(e.tag);return t.setAttribute(`data-pp-hydrated`,`true`),e.id&&(t.id=e.id),e.class&&(t.className=e.class),e.type&&e.tag===`script`&&(t.type=e.type),e.tag===`template`?t.innerHTML=e.html||``:t.textContent=e.text||``,t}function ze(e){for(let[t,n]of Object.entries(e)){let e=document.getElementById(t);if(e){Le(e);for(let t of n)e.appendChild(Re(t))}}}function Be(e,t={}){if(!e)return;let n=t.includeModel??!0;e.schemaRegistry&&ne(e.schemaRegistry),e.attributes&&Ie(e.attributes),e.children&&ze(e.children),n&&e.model&&Ve(e.model)}function Ve(e){let t=document.getElementById(`pp-model-page`);t&&(t.setAttribute(`model-json`,e.schemaJson),e.mockJson&&t.setAttribute(`mock-json`,e.mockJson),e.rawYaml&&t.setAttribute(`raw-yaml`,e.rawYaml),e.schemaRawYaml&&t.setAttribute(`schema-raw-yaml`,e.schemaRawYaml),e.schemaRawJson&&t.setAttribute(`schema-raw-json`,e.schemaRawJson));let n=document.getElementById(`pp-model-security-scheme`);n&&n.setAttribute(`scheme-json`,e.schemaJson)}function He(){document.body&&(document.body.dataset.ppHydrated=`true`),document.dispatchEvent(new CustomEvent(`pp:hydrated`))}async function Ue(){if(De()){b(`hydrate:skipped`,{reason:`preview-hold`});return}let e=d(`ppShared`),t=d(`ppSharedHash`),n=d(`ppPage`),r=Te();b(`hydrate:start`,{sharedAssetBase:e,pageAssetBase:n,hasBootstrapShared:!!r?.shared,hasBootstrapSharedPromise:!!r?.sharedPromise});let i=r?.shared||(r?.sharedPromise?null:await Pe(e,t));i&&!r?.shared&&(Ee().shared=i,b(`shared-cache:seeded-bootstrap-store`));let a=Oe(e,_e,`shared`).then(async n=>(i||await Fe(e,t,n),Be(n),b(`shared-payload:applied`,{hasPayload:!!n}),n)),o=Oe(n,ve,`page`).then(async e=>{try{await a}catch{}return Be(e,{includeModel:!1}),b(`page-payload:applied`,{hasPayload:!!e}),e}),[s,c]=await Promise.allSettled([a,o]),l=[s,c];for(let e of l)e.status===`rejected`&&console.error(`printing-press hydration failed`,e.reason);c.status===`fulfilled`&&c.value?.model&&(Ve(c.value.model),b(`model-payload:applied`)),b(`hydrate:complete`),He()}var We={"info-square":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M8 7.15v3.35"/><circle cx="8" cy="5.2" r=".55" fill="currentColor" stroke="none"/></svg>`,"exclamation-triangle":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.1 13.8 12.9H2.2L8 2.1Z"/><path d="M8 6.1v3.45"/><circle cx="8" cy="11.35" r=".55" fill="currentColor" stroke="none"/></svg>`,"exclamation-square":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M8 5.35v4.1"/><circle cx="8" cy="11.35" r=".55" fill="currentColor" stroke="none"/></svg>`,"check-square":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M5.05 8.2 7.1 10.25 11.05 6.3"/></svg>`,"question-square":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M6.4 6.15A1.66 1.66 0 0 1 8 5.2c1.02 0 1.85.72 1.85 1.72 0 1.25-1.35 1.55-1.85 2.55"/><circle cx="8" cy="11.35" r=".55" fill="currentColor" stroke="none"/></svg>`},Ge=`.pp-content-page-markdown pre`,Ke=`data-pp-copy-ready`;function qe(e,t){e.setAttribute(`aria-label`,t),e.setAttribute(`label`,t),e.setAttribute(`title`,t)}function Je(e){if(typeof document.execCommand!=`function`)throw Error(`copy command unavailable`);let t=document.createElement(`textarea`);t.value=e,t.setAttribute(`readonly`,``),t.style.position=`fixed`,t.style.left=`-9999px`,document.body.appendChild(t),t.select();let n=t=>{t.clipboardData?.setData(`text/plain`,e),t.preventDefault()};document.addEventListener(`copy`,n,{once:!0});let r=document.execCommand(`copy`);if(document.removeEventListener(`copy`,n),t.remove(),!r)throw Error(`copy command failed`)}async function Ye(e){if(navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(e);return}catch{}Je(e)}async function Xe(e,t){let n=`Copy code to clipboard`;try{await Ye(e.textContent||``),qe(t,`Copied`),window.setTimeout(()=>qe(t,n),1200)}catch{qe(t,`Copy failed`),window.setTimeout(()=>qe(t,n),1200)}}function Ze(e=document){let t=Array.from(e.querySelectorAll(Ge));for(let e of t){if(e.hasAttribute(Ke)||(e.setAttribute(Ke,`true`),e.closest(`.pp-content-code-block`)))continue;let t=e.parentNode;if(!t)continue;let n=document.createElement(`div`);n.className=`pp-content-code-block`,t.insertBefore(n,e),n.appendChild(e);let r=document.createElement(`button`);r.className=`pp-content-code-copy`,r.type=`button`,qe(r,`Copy code to clipboard`),r.addEventListener(`click`,()=>{Xe(e,r)});let i=document.createElement(`sl-icon`);i.setAttribute(`name`,`copy`),i.setAttribute(`aria-hidden`,`true`),r.appendChild(i),n.appendChild(r)}}var Qe=`data-pp-shared-asset-base-url`;function $e(e){let t=(e??``).trim();return t?t.replace(/\/+$/,``)||`/`:``}function et(){if(typeof document>`u`)return``;let e=document.documentElement.getAttribute(Qe);return e&&e.trim()?$e(e):$e(document.body?.getAttribute(Qe))}function tt(e,t=et()){let n=e.replace(/^\/+/,``),r=$e(t);return r===`/`?`/${n}`:r?`${r}/${n}`:`static/${n}`}var nt=globalThis,rt=nt.ShadowRoot&&(nt.ShadyCSS===void 0||nt.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,it=Symbol(),at=new WeakMap,ot=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==it)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(rt&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=at.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&at.set(t,e))}return e}toString(){return this.cssText}},st=e=>new ot(typeof e==`string`?e:e+``,void 0,it),x=(e,...t)=>new ot(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,it),ct=(e,t)=>{if(rt)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=nt.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},lt=rt?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return st(t)})(e):e,{is:ut,defineProperty:dt,getOwnPropertyDescriptor:ft,getOwnPropertyNames:pt,getOwnPropertySymbols:mt,getPrototypeOf:ht}=Object,gt=globalThis,_t=gt.trustedTypes,vt=_t?_t.emptyScript:``,yt=gt.reactiveElementPolyfillSupport,bt=(e,t)=>e,xt={toAttribute(e,t){switch(t){case Boolean:e=e?vt:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},St=(e,t)=>!ut(e,t),Ct={attribute:!0,type:String,converter:xt,reflect:!1,useDefault:!1,hasChanged:St};Symbol.metadata??=Symbol(`metadata`),gt.litPropertyMetadata??=new WeakMap;var wt=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ct){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&dt(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=ft(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ct}static _$Ei(){if(this.hasOwnProperty(bt(`elementProperties`)))return;let e=ht(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(bt(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(bt(`properties`))){let e=this.properties,t=[...pt(e),...mt(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(lt(e))}else e!==void 0&&t.push(lt(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?xt:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?xt:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??St)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};wt.elementStyles=[],wt.shadowRootOptions={mode:`open`},wt[bt(`elementProperties`)]=new Map,wt[bt(`finalized`)]=new Map,yt?.({ReactiveElement:wt}),(gt.reactiveElementVersions??=[]).push(`2.1.2`);var Tt=globalThis,Et=e=>e,Dt=Tt.trustedTypes,Ot=Dt?Dt.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,kt=`$lit$`,At=`lit$${Math.random().toFixed(9).slice(2)}$`,jt=`?`+At,Mt=`<${jt}>`,Nt=document,Pt=()=>Nt.createComment(``),Ft=e=>e===null||typeof e!=`object`&&typeof e!=`function`,It=Array.isArray,Lt=e=>It(e)||typeof e?.[Symbol.iterator]==`function`,Rt=`[ 	
\f\r]`,zt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bt=/-->/g,Vt=/>/g,Ht=RegExp(`>|${Rt}(?:([^\\s"'>=/]+)(${Rt}*=${Rt}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Ut=/'/g,Wt=/"/g,Gt=/^(?:script|style|textarea|title)$/i,S=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),Kt=Symbol.for(`lit-noChange`),C=Symbol.for(`lit-nothing`),qt=new WeakMap,Jt=Nt.createTreeWalker(Nt,129);function Yt(e,t){if(!It(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return Ot===void 0?t:Ot.createHTML(t)}var Xt=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=zt;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===zt?c[1]===`!--`?o=Bt:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=Ht):(Gt.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=Ht):o=Vt:o===Ht?c[0]===`>`?(o=i??zt,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?Ht:c[3]===`"`?Wt:Ut):o===Wt||o===Ut?o=Ht:o===Bt||o===Vt?o=zt:(o=Ht,i=void 0);let d=o===Ht&&e[t+1].startsWith(`/>`)?` `:``;a+=o===zt?n+Mt:l>=0?(r.push(s),n.slice(0,l)+kt+n.slice(l)+At+d):n+At+(l===-2?t:d)}return[Yt(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},Zt=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Xt(t,n);if(this.el=e.createElement(l,r),Jt.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=Jt.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(kt)){let t=u[o++],n=i.getAttribute(e).split(At),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?nn:r[1]===`?`?rn:r[1]===`@`?an:tn}),i.removeAttribute(e)}else e.startsWith(At)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Gt.test(i.tagName)){let e=i.textContent.split(At),t=e.length-1;if(t>0){i.textContent=Dt?Dt.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],Pt()),Jt.nextNode(),c.push({type:2,index:++a});i.append(e[t],Pt())}}}else if(i.nodeType===8)if(i.data===jt)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(At,e+1))!==-1;)c.push({type:7,index:a}),e+=At.length-1}a++}}static createElement(e,t){let n=Nt.createElement(`template`);return n.innerHTML=e,n}};function Qt(e,t,n=e,r){if(t===Kt)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=Ft(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=Qt(e,i._$AS(e,t.values),i,r)),t}var $t=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??Nt).importNode(t,!0);Jt.currentNode=r;let i=Jt.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new en(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new on(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=Jt.nextNode(),a++)}return Jt.currentNode=Nt,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},en=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Qt(this,e,t),Ft(e)?e===C||e==null||e===``?(this._$AH!==C&&this._$AR(),this._$AH=C):e!==this._$AH&&e!==Kt&&this._(e):e._$litType$===void 0?e.nodeType===void 0?Lt(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==C&&Ft(this._$AH)?this._$AA.nextSibling.data=e:this.T(Nt.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=Zt.createElement(Yt(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new $t(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=qt.get(e.strings);return t===void 0&&qt.set(e.strings,t=new Zt(e)),t}k(t){It(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(Pt()),this.O(Pt()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=Et(e).nextSibling;Et(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},tn=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=C,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=C}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=Qt(this,e,t,0),a=!Ft(e)||e!==this._$AH&&e!==Kt,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=Qt(this,r[n+o],t,o),s===Kt&&(s=this._$AH[o]),a||=!Ft(s)||s!==this._$AH[o],s===C?e=C:e!==C&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},nn=class extends tn{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===C?void 0:e}},rn=class extends tn{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==C)}},an=class extends tn{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=Qt(this,e,t,0)??C)===Kt)return;let n=this._$AH,r=e===C&&n!==C||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==C&&(n===C||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},on=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){Qt(this,e)}},sn={M:kt,P:At,A:jt,C:1,L:Xt,R:$t,D:Lt,V:Qt,I:en,H:tn,N:rn,U:an,B:nn,F:on},cn=Tt.litHtmlPolyfillSupport;cn?.(Zt,en),(Tt.litHtmlVersions??=[]).push(`3.3.2`);var ln=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new en(t.insertBefore(Pt(),e),e,void 0,n??{})}return i._$AI(e),i},un=globalThis,dn=class extends wt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ln(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Kt}};dn._$litElement$=!0,dn.finalized=!0,un.litElementHydrateSupport?.({LitElement:dn});var fn=un.litElementPolyfillSupport;fn?.({LitElement:dn}),(un.litElementVersions??=[]).push(`4.2.2`);var pn=x`
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
`,mn=x`
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
`,hn=``;function gn(e){hn=e}function _n(e=``){if(!hn){let e=[...document.getElementsByTagName(`script`)],t=e.find(e=>e.hasAttribute(`data-shoelace`));if(t)gn(t.getAttribute(`data-shoelace`));else{let t=e.find(e=>/shoelace(\.min)?\.js($|\?)/.test(e.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(e.src)),n=``;t&&(n=t.getAttribute(`src`)),gn(n.split(`/`).slice(0,-1).join(`/`))}}return hn.replace(/\/$/,``)+(e?`/${e.replace(/^\//,``)}`:``)}var vn={name:`default`,resolver:e=>_n(`assets/icons/${e}.svg`)},yn={caret:`
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
  `},bn=[vn,{name:`system`,resolver:e=>e in yn?`data:image/svg+xml,${encodeURIComponent(yn[e])}`:``}],xn=[];function Sn(e){xn.push(e)}function Cn(e){xn=xn.filter(t=>t!==e)}function wn(e){return bn.find(t=>t.name===e)}function Tn(e,t){En(e),bn.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),xn.forEach(t=>{t.library===e&&t.setIcon()})}function En(e){bn=bn.filter(t=>t.name!==e)}var Dn=x`
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
`,On=Object.defineProperty,kn=Object.defineProperties,An=Object.getOwnPropertyDescriptor,jn=Object.getOwnPropertyDescriptors,Mn=Object.getOwnPropertySymbols,Nn=Object.prototype.hasOwnProperty,Pn=Object.prototype.propertyIsEnumerable,Fn=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),In=e=>{throw TypeError(e)},Ln=(e,t,n)=>t in e?On(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Rn=(e,t)=>{for(var n in t||={})Nn.call(t,n)&&Ln(e,n,t[n]);if(Mn)for(var n of Mn(t))Pn.call(t,n)&&Ln(e,n,t[n]);return e},zn=(e,t)=>kn(e,jn(t)),w=(e,t,n,r)=>{for(var i=r>1?void 0:r?An(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&On(t,n,i),i},Bn=(e,t,n)=>t.has(e)||In(`Cannot `+n),Vn=(e,t,n)=>(Bn(e,t,`read from private field`),n?n.call(e):t.get(e)),Hn=(e,t,n)=>t.has(e)?In(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Un=(e,t,n,r)=>(Bn(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Wn=function(e,t){this[0]=e,this[1]=t},Gn=e=>{var t=e[Fn(`asyncIterator`)],n=!1,r,i={};return t==null?(t=e[Fn(`iterator`)](),r=e=>i[e]=n=>t[e](n)):(t=t.call(e),r=e=>i[e]=r=>{if(n){if(n=!1,e===`throw`)throw r;return r}return n=!0,{done:!1,value:new Wn(new Promise(n=>{var i=t[e](r);i instanceof Object||In(`Object expected`),n(i)}),1)}}),i[Fn(`iterator`)]=()=>i,r(`next`),`throw`in t?r(`throw`):i.throw=e=>{throw e},`return`in t&&r(`return`),i};function T(e,t){let n=Rn({waitUntilFirstUpdate:!1},t);return(t,r)=>{let{update:i}=t,a=Array.isArray(e)?e:[e];t.update=function(e){a.forEach(t=>{let i=t;if(e.has(i)){let t=e.get(i),a=this[i];t!==a&&(!n.waitUntilFirstUpdate||this.hasUpdated)&&this[r](t,a)}}),i.call(this,e)}}}var E=x`
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
`,D=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Kn={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:St},qn=(e=Kn,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function O(e){return(t,n)=>typeof n==`object`?qn(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function k(e){return O({...e,state:!0,attribute:!1})}function Jn(e){return(t,n)=>{let r=typeof t==`function`?t:t[n];Object.assign(r,e)}}var Yn=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function A(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Yn(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Yn(n,r,{get(){return a(this)}})}}var Xn,j=class extends dn{constructor(){super(),Hn(this,Xn,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){let n=new CustomEvent(e,Rn({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(n),n}static define(e,t=this,n={}){let r=customElements.get(e);if(!r){try{customElements.define(e,t,n)}catch{customElements.define(e,class extends t{},n)}return}let i=` (unknown version)`,a=i;`version`in t&&t.version&&(i=` v`+t.version),`version`in r&&r.version&&(a=` v`+r.version),!(i&&a&&i===a)&&console.warn(`Attempted to register <${e}>${i}, but <${e}>${a} has already been registered.`)}attributeChangedCallback(e,t,n){Vn(this,Xn)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),Un(this,Xn,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}};Xn=new WeakMap,j.version=`2.20.1`,j.dependencies={},w([O()],j.prototype,`dir`,2),w([O()],j.prototype,`lang`,2);var{I:Zn}=sn,Qn=(e,t)=>t===void 0?e?._$litType$!==void 0:e?._$litType$===t,$n=e=>e.strings===void 0,er={},tr=(e,t=er)=>e._$AH=t,nr=Symbol(),rr=Symbol(),ir,ar=new Map,or=class extends j{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label=``,this.library=`default`}async resolveIcon(e,t){let n;if(t?.spriteSheet)return this.svg=S`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(n=await fetch(e,{mode:`cors`}),!n.ok)return n.status===410?nr:rr}catch{return rr}try{let e=document.createElement(`div`);e.innerHTML=await n.text();let t=e.firstElementChild;if((t?.tagName)?.toLowerCase()!==`svg`)return nr;ir||=new DOMParser;let r=ir.parseFromString(t.outerHTML,`text/html`).body.querySelector(`svg`);return r?(r.part.add(`svg`),document.adoptNode(r)):nr}catch{return nr}}connectedCallback(){super.connectedCallback(),Sn(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Cn(this)}getIconSource(){let e=wn(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label==`string`&&this.label.length>0?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,this.label),this.removeAttribute(`aria-hidden`)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`),this.setAttribute(`aria-hidden`,`true`))}async setIcon(){var e;let{url:t,fromLibrary:n}=this.getIconSource(),r=n?wn(this.library):void 0;if(!t){this.svg=null;return}let i=ar.get(t);if(i||(i=this.resolveIcon(t,r),ar.set(t,i)),!this.initialRender)return;let a=await i;if(a===rr&&ar.delete(t),t===this.getIconSource().url){if(Qn(a)){if(this.svg=a,r){await this.updateComplete;let e=this.shadowRoot.querySelector(`[part='svg']`);typeof r.mutator==`function`&&e&&r.mutator(e)}return}switch(a){case rr:case nr:this.svg=null,this.emit(`sl-error`);break;default:this.svg=a.cloneNode(!0),(e=r?.mutator)==null||e.call(r,this.svg),this.emit(`sl-load`)}}}render(){return this.svg}};or.styles=[E,Dn],w([k()],or.prototype,`svg`,2),w([O({reflect:!0})],or.prototype,`name`,2),w([O()],or.prototype,`src`,2),w([O()],or.prototype,`label`,2),w([O({reflect:!0})],or.prototype,`library`,2),w([T(`label`)],or.prototype,`handleLabelChange`,1),w([T([`name`,`src`,`library`])],or.prototype,`setIcon`,1);var sr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},cr=e=>(...t)=>({_$litDirective$:e,values:t}),lr=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},M=cr(class extends lr{constructor(e){if(super(e),e.type!==sr.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return Kt}}),ur=Symbol.for(``),dr=e=>{if(e?.r===ur)return e?._$litStatic$},fr=e=>({_$litStatic$:e,r:ur}),pr=(e,...t)=>({_$litStatic$:t.reduce((t,n,r)=>t+(e=>{if(e._$litStatic$!==void 0)return e._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${e}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+e[r+1],e[0]),r:ur}),mr=new Map,hr=(e=>(t,...n)=>{let r=n.length,i,a,o=[],s=[],c,l=0,u=!1;for(;l<r;){for(c=t[l];l<r&&(a=n[l],i=dr(a))!==void 0;)c+=i+t[++l],u=!0;l!==r&&s.push(a),o.push(c),l++}if(l===r&&o.push(t[r]),u){let e=o.join(`$$lit$$`);(t=mr.get(e))===void 0&&(o.raw=o,mr.set(e,t=o)),n=s}return e(t,...n)})(S),N=e=>e??C,P=class extends j{constructor(){super(...arguments),this.hasFocus=!1,this.label=``,this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){let e=!!this.href,t=e?pr`a`:pr`button`;return hr`
      <${t}
        part="base"
        class=${M({"icon-button":!0,"icon-button--disabled":!e&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${N(e?void 0:this.disabled)}
        type=${N(e?void 0:`button`)}
        href=${N(e?this.href:void 0)}
        target=${N(e?this.target:void 0)}
        download=${N(e?this.download:void 0)}
        rel=${N(e&&this.target?`noreferrer noopener`:void 0)}
        role=${N(e?void 0:`button`)}
        aria-disabled=${this.disabled?`true`:`false`}
        aria-label="${this.label}"
        tabindex=${this.disabled?`-1`:`0`}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${N(this.name)}
          library=${N(this.library)}
          src=${N(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${t}>
    `}};P.styles=[E,mn],P.dependencies={"sl-icon":or},w([A(`.icon-button`)],P.prototype,`button`,2),w([k()],P.prototype,`hasFocus`,2),w([O()],P.prototype,`name`,2),w([O()],P.prototype,`library`,2),w([O()],P.prototype,`src`,2),w([O()],P.prototype,`href`,2),w([O()],P.prototype,`target`,2),w([O()],P.prototype,`download`,2),w([O()],P.prototype,`label`,2),w([O({type:Boolean,reflect:!0})],P.prototype,`disabled`,2);var gr=new Set,_r=new Map,vr,yr=`ltr`,br=`en`,xr=typeof MutationObserver<`u`&&typeof document<`u`&&document.documentElement!==void 0;if(xr){let e=new MutationObserver(Cr);yr=document.documentElement.dir||`ltr`,br=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:[`dir`,`lang`]})}function Sr(...e){e.map(e=>{let t=e.$code.toLowerCase();_r.has(t)?_r.set(t,Object.assign(Object.assign({},_r.get(t)),e)):_r.set(t,e),vr||=e}),Cr()}function Cr(){xr&&(yr=document.documentElement.dir||`ltr`,br=document.documentElement.lang||navigator.language),[...gr.keys()].map(e=>{typeof e.requestUpdate==`function`&&e.requestUpdate()})}var wr=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){gr.add(this.host)}hostDisconnected(){gr.delete(this.host)}dir(){return`${this.host.dir||yr}`.toLowerCase()}lang(){let e=`${this.host.lang||br}`.toLowerCase().replace(/_/g,`-`);try{return new Intl.Locale(e),e}catch{return vr?vr.$code.toLowerCase():`en`}}getTranslationData(e){let t;try{t=new Intl.Locale(e.replace(/_/g,`-`))}catch{return{locale:void 0,language:``,region:``,primary:void 0,secondary:void 0}}let n=t.language.toLowerCase(),r=t.region?.toLowerCase()??``,i=_r.get(`${n}-${r}`),a=_r.get(n);return{locale:t,language:n,region:r,primary:i,secondary:a}}exists(e,t){let{primary:n,secondary:r}=this.getTranslationData(t.lang??this.lang());return t=Object.assign({includeFallback:!1},t),!!(n&&n[e]||r&&r[e]||t.includeFallback&&vr&&vr[e])}term(e,...t){let{primary:n,secondary:r}=this.getTranslationData(this.lang()),i;if(n&&n[e])i=n[e];else if(r&&r[e])i=r[e];else if(vr&&vr[e])i=vr[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i==`function`?i(...t):i}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?``:new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}},Tr={$code:`en`,$name:`English`,$dir:`ltr`,carousel:`Carousel`,clearEntry:`Clear entry`,close:`Close`,copied:`Copied`,copy:`Copy`,currentValue:`Current value`,error:`Error`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:`Hide password`,loading:`Loading`,nextSlide:`Next slide`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,previousSlide:`Previous slide`,progress:`Progress`,remove:`Remove`,resize:`Resize`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,selectAColorFromTheScreen:`Select a color from the screen`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,toggleColorFormat:`Toggle color format`};Sr(Tr);var Er=Tr,F=class extends wr{};Sr(Er);var Dr=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.variant=`neutral`,this.size=`medium`,this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit(`sl-remove`)}render(){return S`
      <span
        part="base"
        class=${M({tag:!0,"tag--primary":this.variant===`primary`,"tag--success":this.variant===`success`,"tag--neutral":this.variant===`neutral`,"tag--warning":this.variant===`warning`,"tag--danger":this.variant===`danger`,"tag--text":this.variant===`text`,"tag--small":this.size===`small`,"tag--medium":this.size===`medium`,"tag--large":this.size===`large`,"tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?S`
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
    `}};Dr.styles=[E,pn],Dr.dependencies={"sl-icon-button":P},w([O({reflect:!0})],Dr.prototype,`variant`,2),w([O({reflect:!0})],Dr.prototype,`size`,2),w([O({type:Boolean,reflect:!0})],Dr.prototype,`pill`,2),w([O({type:Boolean})],Dr.prototype,`removable`,2),Dr.define(`sl-tag`),P.define(`sl-icon-button`);var Or=x`
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
`,kr=x`
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
`,Ar=Math.min,jr=Math.max,Mr=Math.round,Nr=Math.floor,Pr=e=>({x:e,y:e}),Fr={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function Ir(e,t,n){return jr(e,Ar(t,n))}function Lr(e,t){return typeof e==`function`?e(t):e}function Rr(e){return e.split(`-`)[0]}function zr(e){return e.split(`-`)[1]}function Br(e){return e===`x`?`y`:`x`}function Vr(e){return e===`y`?`height`:`width`}function Hr(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function Ur(e){return Br(Hr(e))}function Wr(e,t,n){n===void 0&&(n=!1);let r=zr(e),i=Ur(e),a=Vr(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=$r(o)),[o,$r(o)]}function Gr(e){let t=$r(e);return[Kr(e),t,Kr(t)]}function Kr(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var qr=[`left`,`right`],Jr=[`right`,`left`],Yr=[`top`,`bottom`],Xr=[`bottom`,`top`];function Zr(e,t,n){switch(e){case`top`:case`bottom`:return n?t?Jr:qr:t?qr:Jr;case`left`:case`right`:return t?Yr:Xr;default:return[]}}function Qr(e,t,n,r){let i=zr(e),a=Zr(Rr(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(Kr)))),a}function $r(e){let t=Rr(e);return Fr[t]+e.slice(t.length)}function ei(e){return{top:0,right:0,bottom:0,left:0,...e}}function ti(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:ei(e)}function ni(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function ri(e,t,n){let{reference:r,floating:i}=e,a=Hr(t),o=Ur(t),s=Vr(o),c=Rr(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(zr(t)){case`start`:p[o]-=f*(n&&l?-1:1);break;case`end`:p[o]+=f*(n&&l?-1:1);break}return p}async function ii(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=Lr(t,e),p=ti(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=ni(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),ee=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},te=ni(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-te.top+p.top)/ee.y,bottom:(te.bottom-h.bottom+p.bottom)/ee.y,left:(h.left-te.left+p.left)/ee.x,right:(te.right-h.right+p.right)/ee.x}}var ai=50,oi=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:ii},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=ri(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:ee,y:te,data:ne,reset:re}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=ee??u,d=te??d,m[g]={...m[g],...ne},re&&p<ai&&(p++,typeof re==`object`&&(re.placement&&(f=re.placement),re.rects&&(l=re.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):re.rects),{x:u,y:d}=ri(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},si=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=Lr(e,t)||{};if(l==null)return{};let d=ti(u),f={x:n,y:r},p=Ur(i),m=Vr(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,ee=g?`bottom`:`right`,te=g?`clientHeight`:`clientWidth`,ne=a.reference[m]+a.reference[p]-f[p]-a.floating[m],re=f[p]-a.reference[p],v=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),y=v?v[te]:0;(!y||!await(o.isElement==null?void 0:o.isElement(v)))&&(y=s.floating[te]||a.floating[m]);let ie=ne/2-re/2,ae=y/2-h[m]/2-1,oe=Ar(d[_],ae),se=Ar(d[ee],ae),ce=oe,le=y-h[m]-se,ue=y/2-h[m]/2+ie,de=Ir(ce,ue,le),fe=!c.arrow&&zr(i)!=null&&ue!==de&&a.reference[m]/2-(ue<ce?oe:se)-h[m]/2<0,pe=fe?ue<ce?ue-ce:ue-le:0;return{[p]:f[p]+pe,data:{[p]:de,centerOffset:ue-de-pe,...fe&&{alignmentOffset:pe}},reset:fe}}}),ci=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=Lr(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=Rr(r),_=Hr(o),ee=Rr(o)===o,te=await(s.isRTL==null?void 0:s.isRTL(c.floating)),ne=d||(ee||!m?[$r(o)]:Gr(o)),re=p!==`none`;!d&&re&&ne.push(...Qr(o,m,p,te));let v=[o,...ne],y=await s.detectOverflow(t,h),ie=[],ae=i.flip?.overflows||[];if(l&&ie.push(y[g]),u){let e=Wr(r,a,te);ie.push(y[e[0]],y[e[1]])}if(ae=[...ae,{placement:r,overflows:ie}],!ie.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=v[e];if(t&&(!(u===`alignment`&&_!==Hr(t))||ae.every(e=>Hr(e.placement)===_?e.overflows[0]>0:!0)))return{data:{index:e,overflows:ae},reset:{placement:t}};let n=ae.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=ae.filter(e=>{if(re){let t=Hr(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o;break}if(r!==n)return{reset:{placement:n}}}return{}}}},li=new Set([`left`,`top`]);async function ui(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=Rr(n),s=zr(n),c=Hr(n)===`y`,l=li.has(o)?-1:1,u=a&&c?-1:1,d=Lr(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var di=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await ui(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},fi=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Lr(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=Hr(Rr(i)),p=Br(f),m=u[p],h=u[f];if(o){let e=p===`y`?`top`:`left`,t=p===`y`?`bottom`:`right`,n=m+d[e],r=m-d[t];m=Ir(n,m,r)}if(s){let e=f===`y`?`top`:`left`,t=f===`y`?`bottom`:`right`,n=h+d[e],r=h-d[t];h=Ir(n,h,r)}let g=c.fn({...t,[p]:m,[f]:h});return{...g,data:{x:g.x-n,y:g.y-r,enabled:{[p]:o,[f]:s}}}}}},pi=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){var n,r;let{placement:i,rects:a,platform:o,elements:s}=t,{apply:c=()=>{},...l}=Lr(e,t),u=await o.detectOverflow(t,l),d=Rr(i),f=zr(i),p=Hr(i)===`y`,{width:m,height:h}=a.floating,g,_;d===`top`||d===`bottom`?(g=d,_=f===(await(o.isRTL==null?void 0:o.isRTL(s.floating))?`start`:`end`)?`left`:`right`):(_=d,g=f===`end`?`top`:`bottom`);let ee=h-u.top-u.bottom,te=m-u.left-u.right,ne=Ar(h-u[g],ee),re=Ar(m-u[_],te),v=!t.middlewareData.shift,y=ne,ie=re;if((n=t.middlewareData.shift)!=null&&n.enabled.x&&(ie=te),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(y=ee),v&&!f){let e=jr(u.left,0),t=jr(u.right,0),n=jr(u.top,0),r=jr(u.bottom,0);p?ie=m-2*(e!==0||t!==0?e+t:jr(u.left,u.right)):y=h-2*(n!==0||r!==0?n+r:jr(u.top,u.bottom))}await c({...t,availableWidth:ie,availableHeight:y});let ae=await o.getDimensions(s.floating);return m!==ae.width||h!==ae.height?{reset:{rects:!0}}:{}}}};function mi(){return typeof window<`u`}function hi(e){return vi(e)?(e.nodeName||``).toLowerCase():`#document`}function gi(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function _i(e){return((vi(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function vi(e){return mi()?e instanceof Node||e instanceof gi(e).Node:!1}function yi(e){return mi()?e instanceof Element||e instanceof gi(e).Element:!1}function bi(e){return mi()?e instanceof HTMLElement||e instanceof gi(e).HTMLElement:!1}function xi(e){return!mi()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof gi(e).ShadowRoot}function Si(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Ni(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function Ci(e){return/^(table|td|th)$/.test(hi(e))}function wi(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var Ti=/transform|translate|scale|rotate|perspective|filter/,Ei=/paint|layout|strict|content/,Di=e=>!!e&&e!==`none`,Oi;function ki(e){let t=yi(e)?Ni(e):e;return Di(t.transform)||Di(t.translate)||Di(t.scale)||Di(t.rotate)||Di(t.perspective)||!ji()&&(Di(t.backdropFilter)||Di(t.filter))||Ti.test(t.willChange||``)||Ei.test(t.contain||``)}function Ai(e){let t=Fi(e);for(;bi(t)&&!Mi(t);){if(ki(t))return t;if(wi(t))return null;t=Fi(t)}return null}function ji(){return Oi??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Oi}function Mi(e){return/^(html|body|#document)$/.test(hi(e))}function Ni(e){return gi(e).getComputedStyle(e)}function Pi(e){return yi(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Fi(e){if(hi(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||xi(e)&&e.host||_i(e);return xi(t)?t.host:t}function Ii(e){let t=Fi(e);return Mi(t)?e.ownerDocument?e.ownerDocument.body:e.body:bi(t)&&Si(t)?t:Ii(t)}function Li(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Ii(e),i=r===e.ownerDocument?.body,a=gi(r);if(i){let e=Ri(a);return t.concat(a,a.visualViewport||[],Si(r)?r:[],e&&n?Li(e):[])}else return t.concat(r,Li(r,[],n))}function Ri(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function zi(e){let t=Ni(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=bi(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=Mr(n)!==a||Mr(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function Bi(e){return yi(e)?e:e.contextElement}function Vi(e){let t=Bi(e);if(!bi(t))return Pr(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=zi(t),o=(a?Mr(n.width):n.width)/r,s=(a?Mr(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}var Hi=Pr(0);function Ui(e){let t=gi(e);return!ji()||!t.visualViewport?Hi:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Wi(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==gi(e)?!1:t}function Gi(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=Bi(e),o=Pr(1);t&&(r?yi(r)&&(o=Vi(r)):o=Vi(e));let s=Wi(a,n,r)?Ui(a):Pr(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a){let e=gi(a),t=r&&yi(r)?gi(r):r,n=e,i=Ri(n);for(;i&&r&&t!==n;){let e=Vi(i),t=i.getBoundingClientRect(),r=Ni(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=gi(i),i=Ri(n)}}return ni({width:u,height:d,x:c,y:l})}function Ki(e,t){let n=Pi(e).scrollLeft;return t?t.left+n:Gi(_i(e)).left+n}function qi(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Ki(e,n),y:n.top+t.scrollTop}}function Ji(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=_i(r),s=t?wi(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=Pr(1),u=Pr(0),d=bi(r);if((d||!d&&!a)&&((hi(r)!==`body`||Si(o))&&(c=Pi(r)),d)){let e=Gi(r);l=Vi(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?qi(o,c):Pr(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function Yi(e){return Array.from(e.getClientRects())}function Xi(e){let t=_i(e),n=Pi(e),r=e.ownerDocument.body,i=jr(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=jr(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),o=-n.scrollLeft+Ki(e),s=-n.scrollTop;return Ni(r).direction===`rtl`&&(o+=jr(t.clientWidth,r.clientWidth)-i),{width:i,height:a,x:o,y:s}}var Zi=25;function Qi(e,t){let n=gi(e),r=_i(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;let e=ji();(!e||e&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}let l=Ki(r);if(l<=0){let e=r.ownerDocument,t=e.body,n=getComputedStyle(t),i=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,o=Math.abs(r.clientWidth-t.clientWidth-i);o<=Zi&&(a-=o)}else l<=Zi&&(a+=l);return{width:a,height:o,x:s,y:c}}function $i(e,t){let n=Gi(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=bi(e)?Vi(e):Pr(1);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function ea(e,t,n){let r;if(t===`viewport`)r=Qi(e,n);else if(t===`document`)r=Xi(_i(e));else if(yi(t))r=$i(t,n);else{let n=Ui(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return ni(r)}function ta(e,t){let n=Fi(e);return n===t||!yi(n)||Mi(n)?!1:Ni(n).position===`fixed`||ta(n,t)}function na(e,t){let n=t.get(e);if(n)return n;let r=Li(e,[],!1).filter(e=>yi(e)&&hi(e)!==`body`),i=null,a=Ni(e).position===`fixed`,o=a?Fi(e):e;for(;yi(o)&&!Mi(o);){let t=Ni(o),n=ki(o);!n&&t.position===`fixed`&&(i=null),(a?!n&&!i:!n&&t.position===`static`&&i&&(i.position===`absolute`||i.position===`fixed`)||Si(o)&&!n&&ta(e,o))?r=r.filter(e=>e!==o):i=t,o=Fi(o)}return t.set(e,r),r}function ra(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?wi(t)?[]:na(t,this._c):[].concat(n),r],o=ea(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=ea(t,a[e],i);s=jr(n.top,s),c=Ar(n.right,c),l=Ar(n.bottom,l),u=jr(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function ia(e){let{width:t,height:n}=zi(e);return{width:t,height:n}}function aa(e,t,n){let r=bi(t),i=_i(t),a=n===`fixed`,o=Gi(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=Pr(0);function l(){c.x=Ki(i)}if(r||!r&&!a)if((hi(t)!==`body`||Si(i))&&(s=Pi(t)),r){let e=Gi(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else i&&l();a&&!r&&i&&l();let u=i&&!r&&!a?qi(i,s):Pr(0);return{x:o.left+s.scrollLeft-c.x-u.x,y:o.top+s.scrollTop-c.y-u.y,width:o.width,height:o.height}}function oa(e){return Ni(e).position===`static`}function sa(e,t){if(!bi(e)||Ni(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return _i(e)===n&&(n=n.ownerDocument.body),n}function ca(e,t){let n=gi(e);if(wi(e))return n;if(!bi(e)){let t=Fi(e);for(;t&&!Mi(t);){if(yi(t)&&!oa(t))return t;t=Fi(t)}return n}let r=sa(e,t);for(;r&&Ci(r)&&oa(r);)r=sa(r,t);return r&&Mi(r)&&oa(r)&&!ki(r)?n:r||Ai(e)||n}var la=async function(e){let t=this.getOffsetParent||ca,n=this.getDimensions,r=await n(e.floating);return{reference:aa(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function ua(e){return Ni(e).direction===`rtl`}var da={convertOffsetParentRelativeRectToViewportRelativeRect:Ji,getDocumentElement:_i,getClippingRect:ra,getOffsetParent:ca,getElementRects:la,getClientRects:Yi,getDimensions:ia,getScale:Vi,isElement:yi,isRTL:ua};function fa(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function pa(e,t){let n=null,r,i=_i(e);function a(){var e;clearTimeout(r),(e=n)==null||e.disconnect(),n=null}function o(s,c){s===void 0&&(s=!1),c===void 0&&(c=1),a();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(s||t(),!f||!p)return;let m=Nr(d),h=Nr(i.clientWidth-(u+f)),g=Nr(i.clientHeight-(d+p)),_=Nr(u),ee={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:jr(0,Ar(1,c))||1},te=!0;function ne(t){let n=t[0].intersectionRatio;if(n!==c){if(!te)return o();n?o(!1,n):r=setTimeout(()=>{o(!1,1e-7)},1e3)}n===1&&!fa(l,e.getBoundingClientRect())&&o(),te=!1}try{n=new IntersectionObserver(ne,{...ee,root:i.ownerDocument})}catch{n=new IntersectionObserver(ne,ee)}n.observe(e)}return o(!0),a}function ma(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=Bi(e),u=i||a?[...l?Li(l):[],...t?Li(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n,{passive:!0}),a&&e.addEventListener(`resize`,n)});let d=l&&s?pa(l,n):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Gi(e):null;c&&g();function g(){let t=Gi(e);h&&!fa(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var ha=di,ga=fi,_a=ci,va=pi,ya=si,ba=(e,t,n)=>{let r=new Map,i={platform:da,...n},a={...i.platform,_c:r};return oi(e,t,{...i,platform:a})};function xa(e){return Ca(e)}function Sa(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Ca(e){for(let t=e;t;t=Sa(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=Sa(e);t;t=Sa(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||ki(e)||t.tagName===`BODY`))return t}return null}function wa(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e&&(`contextElement`in e?e.contextElement instanceof Element:!0)}var I=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.active=!1,this.placement=`top`,this.strategy=`absolute`,this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){let e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),n=this.placement.includes(`top`)||this.placement.includes(`bottom`),r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0;n?e.top<t.top?(r=e.left,i=e.bottom,a=e.right,o=e.bottom,s=t.left,c=t.top,l=t.right,u=t.top):(r=t.left,i=t.bottom,a=t.right,o=t.bottom,s=e.left,c=e.top,l=e.right,u=e.top):e.left<t.left?(r=e.right,i=e.top,a=t.left,o=t.top,s=e.right,c=e.bottom,l=t.left,u=t.bottom):(r=t.right,i=t.top,a=e.left,o=e.top,s=t.right,c=t.bottom,l=e.left,u=e.bottom),this.style.setProperty(`--hover-bridge-top-left-x`,`${r}px`),this.style.setProperty(`--hover-bridge-top-left-y`,`${i}px`),this.style.setProperty(`--hover-bridge-top-right-x`,`${a}px`),this.style.setProperty(`--hover-bridge-top-right-y`,`${o}px`),this.style.setProperty(`--hover-bridge-bottom-left-x`,`${s}px`),this.style.setProperty(`--hover-bridge-bottom-left-y`,`${c}px`),this.style.setProperty(`--hover-bridge-bottom-right-x`,`${l}px`),this.style.setProperty(`--hover-bridge-bottom-right-y`,`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has(`active`)&&(this.active?this.start():this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){await this.stop(),this.anchor&&typeof this.anchor==`string`?this.anchorEl=this.getRootNode().getElementById(this.anchor):this.anchor instanceof Element||wa(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector(`[slot="anchor"]`),this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){!this.anchorEl||!this.active||(this.cleanup=ma(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute(`data-current-placement`),this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl)return;let e=[ha({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(va({apply:({rects:e})=>{let t=this.sync===`width`||this.sync===`both`,n=this.sync===`height`||this.sync===`both`;this.popup.style.width=t?`${e.reference.width}px`:``,this.popup.style.height=n?`${e.reference.height}px`:``}})):(this.popup.style.width=``,this.popup.style.height=``),this.flip&&e.push(_a({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&e.push(ga({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(va({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{this.autoSize===`vertical`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-height`,`${t}px`):this.style.removeProperty(`--auto-size-available-height`),this.autoSize===`horizontal`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-width`,`${e}px`):this.style.removeProperty(`--auto-size-available-width`)}})):(this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`)),this.arrow&&e.push(ya({element:this.arrowEl,padding:this.arrowPadding}));let t=this.strategy===`absolute`?e=>da.getOffsetParent(e,xa):da.getOffsetParent;ba(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:zn(Rn({},da),{getOffsetParent:t})}).then(({x:e,y:t,middlewareData:n,placement:r})=>{let i=this.localize.dir()===`rtl`,a={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[r.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,r),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){let e=n.arrow.x,t=n.arrow.y,r=``,o=``,s=``,c=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;r=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``,o=i?n:``,c=i?``:n}else if(this.arrowPlacement===`end`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;o=i?``:n,c=i?n:``,s=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``}else this.arrowPlacement===`center`?(c=typeof e==`number`?`calc(50% - var(--arrow-size-diagonal))`:``,r=typeof t==`number`?`calc(50% - var(--arrow-size-diagonal))`:``):(c=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(this.arrowEl.style,{top:r,right:o,bottom:s,left:c,[a]:`calc(var(--arrow-size-diagonal) * -1)`})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit(`sl-reposition`)}render(){return S`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${M({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${M({popup:!0,"popup--active":this.active,"popup--fixed":this.strategy===`fixed`,"popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?S`<div part="arrow" class="popup__arrow" role="presentation"></div>`:``}
      </div>
    `}};I.styles=[E,kr],w([A(`.popup`)],I.prototype,`popup`,2),w([A(`.popup__arrow`)],I.prototype,`arrowEl`,2),w([O()],I.prototype,`anchor`,2),w([O({type:Boolean,reflect:!0})],I.prototype,`active`,2),w([O({reflect:!0})],I.prototype,`placement`,2),w([O({reflect:!0})],I.prototype,`strategy`,2),w([O({type:Number})],I.prototype,`distance`,2),w([O({type:Number})],I.prototype,`skidding`,2),w([O({type:Boolean})],I.prototype,`arrow`,2),w([O({attribute:`arrow-placement`})],I.prototype,`arrowPlacement`,2),w([O({attribute:`arrow-padding`,type:Number})],I.prototype,`arrowPadding`,2),w([O({type:Boolean})],I.prototype,`flip`,2),w([O({attribute:`flip-fallback-placements`,converter:{fromAttribute:e=>e.split(` `).map(e=>e.trim()).filter(e=>e!==``),toAttribute:e=>e.join(` `)}})],I.prototype,`flipFallbackPlacements`,2),w([O({attribute:`flip-fallback-strategy`})],I.prototype,`flipFallbackStrategy`,2),w([O({type:Object})],I.prototype,`flipBoundary`,2),w([O({attribute:`flip-padding`,type:Number})],I.prototype,`flipPadding`,2),w([O({type:Boolean})],I.prototype,`shift`,2),w([O({type:Object})],I.prototype,`shiftBoundary`,2),w([O({attribute:`shift-padding`,type:Number})],I.prototype,`shiftPadding`,2),w([O({attribute:`auto-size`})],I.prototype,`autoSize`,2),w([O()],I.prototype,`sync`,2),w([O({type:Object})],I.prototype,`autoSizeBoundary`,2),w([O({attribute:`auto-size-padding`,type:Number})],I.prototype,`autoSizePadding`,2),w([O({attribute:`hover-bridge`,type:Boolean})],I.prototype,`hoverBridge`,2);var Ta=new Map,Ea=new WeakMap;function Da(e){return e??{keyframes:[],options:{duration:0}}}function Oa(e,t){return t.toLowerCase()===`rtl`?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function L(e,t){Ta.set(e,Da(t))}function R(e,t,n){let r=Ea.get(e);if(r?.[t])return Oa(r[t],n.dir);let i=Ta.get(t);return i?Oa(i,n.dir):{keyframes:[],options:{duration:0}}}function ka(e,t){return new Promise(n=>{function r(i){i.target===e&&(e.removeEventListener(t,r),n())}e.addEventListener(t,r)})}function z(e,t,n){return new Promise(r=>{if(n?.duration===1/0)throw Error(`Promise-based animations must be finite.`);let i=e.animate(t,zn(Rn({},n),{duration:ja()?0:n.duration}));i.addEventListener(`cancel`,r,{once:!0}),i.addEventListener(`finish`,r,{once:!0})})}function Aa(e){return e=e.toString().toLowerCase(),e.indexOf(`ms`)>-1?parseFloat(e):e.indexOf(`s`)>-1?parseFloat(e)*1e3:parseFloat(e)}function ja(){return window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function Ma(e){return Promise.all(e.getAnimations().map(e=>new Promise(t=>{e.cancel(),requestAnimationFrame(t)})))}function Na(e,t){return e.map(e=>zn(Rn({},e),{height:e.height===`auto`?`${t}px`:e.height}))}var B=class extends j{constructor(){super(),this.localize=new F(this),this.content=``,this.placement=`top`,this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger=`hover focus`,this.hoist=!1,this.handleBlur=()=>{this.hasTrigger(`focus`)&&this.hide()},this.handleClick=()=>{this.hasTrigger(`click`)&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger(`focus`)&&this.show()},this.handleDocumentKeyDown=e=>{e.key===`Escape`&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger(`hover`)){let e=Aa(getComputedStyle(this).getPropertyValue(`--show-delay`));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e)}},this.handleMouseOut=()=>{if(this.hasTrigger(`hover`)){let e=Aa(getComputedStyle(this).getPropertyValue(`--hide-delay`));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e)}},this.addEventListener(`blur`,this.handleBlur,!0),this.addEventListener(`focus`,this.handleFocus,!0),this.addEventListener(`click`,this.handleClick),this.addEventListener(`mouseover`,this.handleMouseOver),this.addEventListener(`mouseout`,this.handleMouseOut)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(` `).includes(e)}async handleOpenChange(){var e,t;if(this.open){if(this.disabled)return;this.emit(`sl-show`),`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener(`keydown`,this.handleDocumentKeyDown),await Ma(this.body),this.body.hidden=!1,this.popup.active=!0;let{keyframes:t,options:n}=R(this,`tooltip.show`,{dir:this.localize.dir()});await z(this.popup.popup,t,n),this.popup.reposition(),this.emit(`sl-after-show`)}else{this.emit(`sl-hide`),(t=this.closeWatcher)==null||t.destroy(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),await Ma(this.body);let{keyframes:e,options:n}=R(this,`tooltip.hide`,{dir:this.localize.dir()});await z(this.popup.popup,e,n),this.popup.active=!1,this.body.hidden=!0,this.emit(`sl-after-hide`)}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,ka(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ka(this,`sl-after-hide`)}render(){return S`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${M({tooltip:!0,"tooltip--open":this.open})}
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
    `}};B.styles=[E,Or],B.dependencies={"sl-popup":I},w([A(`slot:not([name])`)],B.prototype,`defaultSlot`,2),w([A(`.tooltip__body`)],B.prototype,`body`,2),w([A(`sl-popup`)],B.prototype,`popup`,2),w([O()],B.prototype,`content`,2),w([O()],B.prototype,`placement`,2),w([O({type:Boolean,reflect:!0})],B.prototype,`disabled`,2),w([O({type:Number})],B.prototype,`distance`,2),w([O({type:Boolean,reflect:!0})],B.prototype,`open`,2),w([O({type:Number})],B.prototype,`skidding`,2),w([O()],B.prototype,`trigger`,2),w([O({type:Boolean})],B.prototype,`hoist`,2),w([T(`open`,{waitUntilFirstUpdate:!0})],B.prototype,`handleOpenChange`,1),w([T([`content`,`distance`,`hoist`,`placement`,`skidding`])],B.prototype,`handleOptionsChange`,1),w([T(`disabled`)],B.prototype,`handleDisabledChange`,1),L(`tooltip.show`,{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:`ease`}}),L(`tooltip.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:`ease`}}),B.define(`sl-tooltip`),or.define(`sl-icon`);var Pa=x`
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
`;function Fa(e,t){function n(n){let r=e.getBoundingClientRect(),i=e.ownerDocument.defaultView,a=r.left+i.scrollX,o=r.top+i.scrollY,s=n.pageX-a,c=n.pageY-o;t?.onMove&&t.onMove(s,c)}function r(){document.removeEventListener(`pointermove`,n),document.removeEventListener(`pointerup`,r),t?.onStop&&t.onStop()}document.addEventListener(`pointermove`,n,{passive:!0}),document.addEventListener(`pointerup`,r),t?.initialEvent instanceof PointerEvent&&n(t.initialEvent)}function Ia(e,t,n){return(e=>Object.is(e,-0)?0:e)(e<t?t:e>n?n:e)}var La=()=>null,Ra=class extends j{constructor(){super(...arguments),this.isCollapsed=!1,this.localize=new F(this),this.positionBeforeCollapsing=0,this.position=50,this.vertical=!1,this.disabled=!1,this.snapValue=``,this.snapFunction=La,this.snapThreshold=12}toSnapFunction(e){let t=e.split(` `);return({pos:n,size:r,snapThreshold:i,isRtl:a,vertical:o})=>{let s=n,c=1/0;return t.forEach(t=>{let l;if(t.startsWith(`repeat(`)){let t=e.substring(7,e.length-1),i=t.endsWith(`%`),s=Number.parseFloat(t),c=i?s/100*r:s;l=Math.round((a&&!o?r-n:n)/c)*c}else l=t.endsWith(`%`)?Number.parseFloat(t)/100*r:Number.parseFloat(t);a&&!o&&(l=r-l);let u=Math.abs(n-l);u<=i&&u<c&&(s=l,c=u)}),s}}set snap(e){this.snapValue=e??``,e?this.snapFunction=typeof e==`string`?this.toSnapFunction(e):e:this.snapFunction=La}get snap(){return this.snapValue}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.resizeObserver)==null||e.unobserve(this)}detectSize(){let{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){let t=this.localize.dir()===`rtl`;this.disabled||(e.cancelable&&e.preventDefault(),Fa(this,{onMove:(e,n)=>{let r=this.vertical?n:e;this.primary===`end`&&(r=this.size-r),r=this.snapFunction({pos:r,size:this.size,snapThreshold:this.snapThreshold,isRtl:t,vertical:this.vertical})??r,this.position=Ia(this.pixelsToPercentage(r),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`Enter`].includes(e.key)){let t=this.position,n=(e.shiftKey?10:1)*(this.primary===`end`?-1:1);if(e.preventDefault(),(e.key===`ArrowLeft`&&!this.vertical||e.key===`ArrowUp`&&this.vertical)&&(t-=n),(e.key===`ArrowRight`&&!this.vertical||e.key===`ArrowDown`&&this.vertical)&&(t+=n),e.key===`Home`&&(t=this.primary===`end`?100:0),e.key===`End`&&(t=this.primary===`end`?0:100),e.key===`Enter`)if(this.isCollapsed)t=this.positionBeforeCollapsing,this.isCollapsed=!1;else{let e=this.position;t=0,requestAnimationFrame(()=>{this.isCollapsed=!0,this.positionBeforeCollapsing=e})}this.position=Ia(t,0,100)}}handleResize(e){let{width:t,height:n}=e[0].contentRect;this.size=this.vertical?n:t,(isNaN(this.cachedPositionInPixels)||this.position===1/0)&&(this.cachedPositionInPixels=Number(this.getAttribute(`position-in-pixels`)),this.positionInPixels=Number(this.getAttribute(`position-in-pixels`)),this.position=this.pixelsToPercentage(this.positionInPixels)),this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.isCollapsed=!1,this.positionBeforeCollapsing=0,this.positionInPixels=this.percentageToPixels(this.position),this.emit(`sl-reposition`)}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){let e=this.vertical?`gridTemplateRows`:`gridTemplateColumns`,t=this.vertical?`gridTemplateColumns`:`gridTemplateRows`,n=this.localize.dir()===`rtl`,r=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,i=`auto`;return this.primary===`end`?n&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${i}`:this.style[e]=`${i} var(--divider-width) ${r}`:n&&!this.vertical?this.style[e]=`${i} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${i}`,this.style[t]=``,S`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${N(this.disabled?void 0:`0`)}
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
    `}};Ra.styles=[E,Pa],w([A(`.divider`)],Ra.prototype,`divider`,2),w([O({type:Number,reflect:!0})],Ra.prototype,`position`,2),w([O({attribute:`position-in-pixels`,type:Number})],Ra.prototype,`positionInPixels`,2),w([O({type:Boolean,reflect:!0})],Ra.prototype,`vertical`,2),w([O({type:Boolean,reflect:!0})],Ra.prototype,`disabled`,2),w([O()],Ra.prototype,`primary`,2),w([O({reflect:!0})],Ra.prototype,`snap`,1),w([O({type:Number,attribute:`snap-threshold`})],Ra.prototype,`snapThreshold`,2),w([T(`position`)],Ra.prototype,`handlePositionChange`,1),w([T(`positionInPixels`)],Ra.prototype,`handlePositionInPixelsChange`,1),w([T(`vertical`)],Ra.prototype,`handleVerticalChange`,1),Ra.define(`sl-split-panel`);var za=x`
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
`;function*Ba(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*Gn(Ba(e.shadowRoot.activeElement))))}function Va(){return[...Ba()].pop()}var Ha=new WeakMap;function Ua(e){let t=Ha.get(e);return t||(t=window.getComputedStyle(e,null),Ha.set(e,t)),t}function Wa(e){if(typeof e.checkVisibility==`function`)return e.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});let t=Ua(e);return t.visibility!==`hidden`&&t.display!==`none`}function Ga(e){let{overflowY:t,overflowX:n}=Ua(e);return t===`scroll`||n===`scroll`?!0:t!==`auto`||n!==`auto`?!1:e.scrollHeight>e.clientHeight&&t===`auto`||e.scrollWidth>e.clientWidth&&n===`auto`}function Ka(e){let t=e.tagName.toLowerCase(),n=Number(e.getAttribute(`tabindex`));if(e.hasAttribute(`tabindex`)&&(isNaN(n)||n<=-1)||e.hasAttribute(`disabled`)||e.closest(`[inert]`))return!1;if(t===`input`&&e.getAttribute(`type`)===`radio`){let t=e.getRootNode(),n=`input[type='radio'][name="${e.getAttribute(`name`)}"]`,r=t.querySelector(`${n}:checked`);return r?r===e:t.querySelector(n)===e}return Wa(e)?(t===`audio`||t===`video`)&&e.hasAttribute(`controls`)||e.hasAttribute(`tabindex`)||e.hasAttribute(`contenteditable`)&&e.getAttribute(`contenteditable`)!==`false`||[`button`,`input`,`select`,`textarea`,`a`,`audio`,`video`,`summary`,`iframe`].includes(t)?!0:Ga(e):!1}function qa(e){let t=Ya(e);return{start:t[0]??null,end:t[t.length-1]??null}}function Ja(e,t){return e.getRootNode({composed:!0})?.host!==t}function Ya(e){let t=new WeakMap,n=[];function r(i){if(i instanceof Element){if(i.hasAttribute(`inert`)||i.closest(`[inert]`)||t.has(i))return;t.set(i,!0),!n.includes(i)&&Ka(i)&&n.push(i),i instanceof HTMLSlotElement&&Ja(i,e)&&i.assignedElements({flatten:!0}).forEach(e=>{r(e)}),i.shadowRoot!==null&&i.shadowRoot.mode===`open`&&r(i.shadowRoot)}for(let e of i.children)r(e)}return r(e),n.sort((e,t)=>{let n=Number(e.getAttribute(`tabindex`))||0;return(Number(t.getAttribute(`tabindex`))||0)-n})}var Xa=[],Za=class{constructor(e){this.tabDirection=`forward`,this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=e=>{var t;if(e.key!==`Tab`||this.isExternalActivated||!this.isActive())return;let n=Va();if(this.previousFocus=n,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;e.shiftKey?this.tabDirection=`backward`:this.tabDirection=`forward`;let r=Ya(this.element),i=r.findIndex(e=>e===n);this.previousFocus=this.currentFocus;let a=this.tabDirection===`forward`?1:-1;for(;;){i+a>=r.length?i=0:i+a<0?i=r.length-1:i+=a,this.previousFocus=this.currentFocus;let n=r[i];if(this.tabDirection===`backward`&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus)||n&&this.possiblyHasTabbableChildren(n))return;e.preventDefault(),this.currentFocus=n,(t=this.currentFocus)==null||t.focus({preventScroll:!1});let o=[...Ba()];if(o.includes(this.currentFocus)||!o.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection=`forward`},this.element=e,this.elementsWithTabbableControls=[`iframe`]}activate(){Xa.push(this.element),document.addEventListener(`focusin`,this.handleFocusIn),document.addEventListener(`keydown`,this.handleKeyDown),document.addEventListener(`keyup`,this.handleKeyUp)}deactivate(){Xa=Xa.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener(`focusin`,this.handleFocusIn),document.removeEventListener(`keydown`,this.handleKeyDown),document.removeEventListener(`keyup`,this.handleKeyUp)}isActive(){return Xa[Xa.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){let e=Ya(this.element);if(!this.element.matches(`:focus-within`)){let t=e[0],n=e[e.length-1],r=this.tabDirection===`forward`?t:n;typeof r?.focus==`function`&&(this.currentFocus=r,r.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute(`controls`)}};function Qa(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}var $a=new Set;function eo(){let e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function to(){let e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,``));return isNaN(e)||!e?0:e}function no(e){if($a.add(e),!document.documentElement.classList.contains(`sl-scroll-lock`)){let e=eo()+to(),t=getComputedStyle(document.documentElement).scrollbarGutter;(!t||t===`auto`)&&(t=`stable`),e<2&&(t=``),document.documentElement.style.setProperty(`--sl-scroll-lock-gutter`,t),document.documentElement.classList.add(`sl-scroll-lock`),document.documentElement.style.setProperty(`--sl-scroll-lock-size`,`${e}px`)}}function ro(e){$a.delete(e),$a.size===0&&(document.documentElement.classList.remove(`sl-scroll-lock`),document.documentElement.style.removeProperty(`--sl-scroll-lock-size`))}function io(e,t,n=`vertical`,r=`smooth`){let i=Qa(e,t),a=i.top+t.scrollTop,o=i.left+t.scrollLeft,s=t.scrollLeft,c=t.scrollLeft+t.offsetWidth,l=t.scrollTop,u=t.scrollTop+t.offsetHeight;(n===`horizontal`||n===`both`)&&(o<s?t.scrollTo({left:o,behavior:r}):o+e.clientWidth>c&&t.scrollTo({left:o-t.offsetWidth+e.clientWidth,behavior:r})),(n===`vertical`||n===`both`)&&(a<l?t.scrollTo({top:a,behavior:r}):a+e.clientHeight>u&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:r}))}var ao=e=>{var t;let{activeElement:n}=document;n&&e.contains(n)&&((t=document.activeElement)==null||t.blur())},oo=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{let t=e.target;(this.slotNames.includes(`[default]`)&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&e.textContent.trim()!==``)return!0;if(e.nodeType===e.ELEMENT_NODE){let t=e;if(t.tagName.toLowerCase()===`sl-visually-hidden`)return!1;if(!t.hasAttribute(`slot`))return!0}return!1})}hasNamedSlot(e){return this.host.querySelector(`:scope > [slot="${e}"]`)!==null}test(e){return e===`[default]`?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener(`slotchange`,this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener(`slotchange`,this.handleSlotChange)}};function so(e){if(!e)return``;let t=e.assignedNodes({flatten:!0}),n=``;return[...t].forEach(e=>{e.nodeType===Node.TEXT_NODE&&(n+=e.textContent)}),n}function co(e){return e.charAt(0).toUpperCase()+e.slice(1)}var lo=class extends j{constructor(){super(...arguments),this.hasSlotController=new oo(this,`footer`),this.localize=new F(this),this.modal=new Za(this),this.open=!1,this.label=``,this.placement=`end`,this.contained=!1,this.noHeader=!1,this.handleDocumentKeyDown=e=>{this.contained||e.key===`Escape`&&this.modal.isActive()&&this.open&&(e.stopImmediatePropagation(),this.requestClose(`keyboard`))}}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),no(this)))}disconnectedCallback(){super.disconnectedCallback(),ro(this),this.removeOpenListeners()}requestClose(e){if(this.emit(`sl-request-close`,{cancelable:!0,detail:{source:e}}).defaultPrevented){let e=R(this,`drawer.denyClose`,{dir:this.localize.dir()});z(this.panel,e.keyframes,e.options);return}this.hide()}addOpenListeners(){var e;`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.contained||(this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose(`keyboard`))):document.addEventListener(`keydown`,this.handleDocumentKeyDown)}removeOpenListeners(){var e;document.removeEventListener(`keydown`,this.handleDocumentKeyDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.open){this.emit(`sl-show`),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),no(this));let e=this.querySelector(`[autofocus]`);e&&e.removeAttribute(`autofocus`),await Promise.all([Ma(this.drawer),Ma(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit(`sl-initial-focus`,{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute(`autofocus`,``)});let t=R(this,`drawer.show${co(this.placement)}`,{dir:this.localize.dir()}),n=R(this,`drawer.overlay.show`,{dir:this.localize.dir()});await Promise.all([z(this.panel,t.keyframes,t.options),z(this.overlay,n.keyframes,n.options)]),this.emit(`sl-after-show`)}else{ao(this),this.emit(`sl-hide`),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),ro(this)),await Promise.all([Ma(this.drawer),Ma(this.overlay)]);let e=R(this,`drawer.hide${co(this.placement)}`,{dir:this.localize.dir()}),t=R(this,`drawer.overlay.hide`,{dir:this.localize.dir()});await Promise.all([z(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),z(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;let n=this.originalTrigger;typeof n?.focus==`function`&&setTimeout(()=>n.focus()),this.emit(`sl-after-hide`)}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),no(this)),this.open&&this.contained&&(this.modal.deactivate(),ro(this))}async show(){if(!this.open)return this.open=!0,ka(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ka(this,`sl-after-hide`)}render(){return S`
      <div
        part="base"
        class=${M({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement===`top`,"drawer--end":this.placement===`end`,"drawer--bottom":this.placement===`bottom`,"drawer--start":this.placement===`start`,"drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()===`rtl`,"drawer--has-footer":this.hasSlotController.test(`footer`)})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose(`overlay`)} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?`false`:`true`}
          aria-label=${N(this.noHeader?this.label:void 0)}
          aria-labelledby=${N(this.noHeader?void 0:`title`)}
          tabindex="0"
        >
          ${this.noHeader?``:S`
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
    `}};lo.styles=[E,za],lo.dependencies={"sl-icon-button":P},w([A(`.drawer`)],lo.prototype,`drawer`,2),w([A(`.drawer__panel`)],lo.prototype,`panel`,2),w([A(`.drawer__overlay`)],lo.prototype,`overlay`,2),w([O({type:Boolean,reflect:!0})],lo.prototype,`open`,2),w([O({reflect:!0})],lo.prototype,`label`,2),w([O({reflect:!0})],lo.prototype,`placement`,2),w([O({type:Boolean,reflect:!0})],lo.prototype,`contained`,2),w([O({attribute:`no-header`,type:Boolean,reflect:!0})],lo.prototype,`noHeader`,2),w([T(`open`,{waitUntilFirstUpdate:!0})],lo.prototype,`handleOpenChange`,1),w([T(`contained`,{waitUntilFirstUpdate:!0})],lo.prototype,`handleNoModalChange`,1),L(`drawer.showTop`,{keyframes:[{opacity:0,translate:`0 -100%`},{opacity:1,translate:`0 0`}],options:{duration:250,easing:`ease`}}),L(`drawer.hideTop`,{keyframes:[{opacity:1,translate:`0 0`},{opacity:0,translate:`0 -100%`}],options:{duration:250,easing:`ease`}}),L(`drawer.showEnd`,{keyframes:[{opacity:0,translate:`100%`},{opacity:1,translate:`0`}],rtlKeyframes:[{opacity:0,translate:`-100%`},{opacity:1,translate:`0`}],options:{duration:250,easing:`ease`}}),L(`drawer.hideEnd`,{keyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`100%`}],rtlKeyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`-100%`}],options:{duration:250,easing:`ease`}}),L(`drawer.showBottom`,{keyframes:[{opacity:0,translate:`0 100%`},{opacity:1,translate:`0 0`}],options:{duration:250,easing:`ease`}}),L(`drawer.hideBottom`,{keyframes:[{opacity:1,translate:`0 0`},{opacity:0,translate:`0 100%`}],options:{duration:250,easing:`ease`}}),L(`drawer.showStart`,{keyframes:[{opacity:0,translate:`-100%`},{opacity:1,translate:`0`}],rtlKeyframes:[{opacity:0,translate:`100%`},{opacity:1,translate:`0`}],options:{duration:250,easing:`ease`}}),L(`drawer.hideStart`,{keyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`-100%`}],rtlKeyframes:[{opacity:1,translate:`0`},{opacity:0,translate:`100%`}],options:{duration:250,easing:`ease`}}),L(`drawer.denyClose`,{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}}),L(`drawer.overlay.show`,{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),L(`drawer.overlay.hide`,{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),lo.define(`sl-drawer`);var uo=x`
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
`,fo=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.open=!1,this.disabled=!1}firstUpdated(){this.body.style.height=this.open?`auto`:`0`,this.open&&(this.details.open=!0),this.detailsObserver=new MutationObserver(e=>{for(let t of e)t.type===`attributes`&&t.attributeName===`open`&&(this.details.open?this.show():this.hide())}),this.detailsObserver.observe(this.details,{attributes:!0})}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.detailsObserver)==null||e.disconnect()}handleSummaryClick(e){e.preventDefault(),this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key===`ArrowUp`||e.key===`ArrowLeft`)&&(e.preventDefault(),this.hide()),(e.key===`ArrowDown`||e.key===`ArrowRight`)&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.details.open=!0,this.emit(`sl-show`,{cancelable:!0}).defaultPrevented){this.open=!1,this.details.open=!1;return}await Ma(this.body);let{keyframes:e,options:t}=R(this,`details.show`,{dir:this.localize.dir()});await z(this.body,Na(e,this.body.scrollHeight),t),this.body.style.height=`auto`,this.emit(`sl-after-show`)}else{if(this.emit(`sl-hide`,{cancelable:!0}).defaultPrevented){this.details.open=!0,this.open=!0;return}await Ma(this.body);let{keyframes:e,options:t}=R(this,`details.hide`,{dir:this.localize.dir()});await z(this.body,Na(e,this.body.scrollHeight),t),this.body.style.height=`auto`,this.details.open=!1,this.emit(`sl-after-hide`)}}async show(){if(!(this.open||this.disabled))return this.open=!0,ka(this,`sl-after-show`)}async hide(){if(!(!this.open||this.disabled))return this.open=!1,ka(this,`sl-after-hide`)}render(){let e=this.localize.dir()===`rtl`;return S`
      <details
        part="base"
        class=${M({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
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
    `}};fo.styles=[E,uo],fo.dependencies={"sl-icon":or},w([A(`.details`)],fo.prototype,`details`,2),w([A(`.details__header`)],fo.prototype,`header`,2),w([A(`.details__body`)],fo.prototype,`body`,2),w([A(`.details__expand-icon-slot`)],fo.prototype,`expandIconSlot`,2),w([O({type:Boolean,reflect:!0})],fo.prototype,`open`,2),w([O()],fo.prototype,`summary`,2),w([O({type:Boolean,reflect:!0})],fo.prototype,`disabled`,2),w([T(`open`,{waitUntilFirstUpdate:!0})],fo.prototype,`handleOpenChange`,1),L(`details.show`,{keyframes:[{height:`0`,opacity:`0`},{height:`auto`,opacity:`1`}],options:{duration:250,easing:`linear`}}),L(`details.hide`,{keyframes:[{height:`auto`,opacity:`1`},{height:`0`,opacity:`0`}],options:{duration:250,easing:`linear`}}),fo.define(`sl-details`),I.define(`sl-popup`);var po=x`
  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
`,mo=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.separatorDir=this.localize.dir(),this.label=``}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll(`[id]`)].forEach(e=>e.removeAttribute(`id`)),e.setAttribute(`data-default`,``),e.slot=`separator`,e}handleSlotChange(){let e=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()===`sl-breadcrumb-item`);e.forEach((t,n)=>{let r=t.querySelector(`[slot="separator"]`);r===null?t.append(this.getSeparator()):r.hasAttribute(`data-default`)&&r.replaceWith(this.getSeparator()),n===e.length-1?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),S`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <span hidden aria-hidden="true">
        <slot name="separator">
          <sl-icon name=${this.localize.dir()===`rtl`?`chevron-left`:`chevron-right`} library="system"></sl-icon>
        </slot>
      </span>
    `}};mo.styles=[E,po],mo.dependencies={"sl-icon":or},w([A(`slot`)],mo.prototype,`defaultSlot`,2),w([A(`slot[name="separator"]`)],mo.prototype,`separatorSlot`,2),w([O()],mo.prototype,`label`,2),mo.define(`sl-breadcrumb`);var ho=x`
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
`,go=class extends j{constructor(){super(...arguments),this.hasSlotController=new oo(this,`prefix`,`suffix`),this.renderType=`button`,this.rel=`noreferrer noopener`}setRenderType(){let e=this.defaultSlot.assignedElements({flatten:!0}).filter(e=>e.tagName.toLowerCase()===`sl-dropdown`).length>0;if(this.href){this.renderType=`link`;return}if(e){this.renderType=`dropdown`;return}this.renderType=`button`}hrefChanged(){this.setRenderType()}handleSlotChange(){this.setRenderType()}render(){return S`
      <div
        part="base"
        class=${M({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test(`prefix`),"breadcrumb-item--has-suffix":this.hasSlotController.test(`suffix`)})}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${this.renderType===`link`?S`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${N(this.target?this.target:void 0)}"
                rel=${N(this.target?this.rel:void 0)}
              >
                <slot @slotchange=${this.handleSlotChange}></slot>
              </a>
            `:``}
        ${this.renderType===`button`?S`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </button>
            `:``}
        ${this.renderType===`dropdown`?S`
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
    `}};go.styles=[E,ho],w([A(`slot:not([name])`)],go.prototype,`defaultSlot`,2),w([k()],go.prototype,`renderType`,2),w([O()],go.prototype,`href`,2),w([O()],go.prototype,`target`,2),w([O()],go.prototype,`rel`,2),w([T(`href`,{waitUntilFirstUpdate:!0})],go.prototype,`hrefChanged`,1),go.define(`sl-breadcrumb-item`);var _o=x`
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
`,vo=class extends j{constructor(){super(...arguments),this.localize=new F(this)}render(){return S`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term(`loading`)}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};vo.styles=[E,_o],vo.define(`sl-spinner`);var yo=new WeakMap,bo=new WeakMap,xo=new WeakMap,So=new WeakSet,Co=new WeakMap,wo=class{constructor(e,t){this.handleFormData=e=>{let t=this.options.disabled(this.host),n=this.options.name(this.host),r=this.options.value(this.host),i=this.host.tagName.toLowerCase()===`sl-button`;this.host.isConnected&&!t&&!i&&typeof n==`string`&&n.length>0&&r!==void 0&&(Array.isArray(r)?r.forEach(t=>{e.formData.append(n,t.toString())}):e.formData.append(n,r.toString()))},this.handleFormSubmit=e=>{var t;let n=this.options.disabled(this.host),r=this.options.reportValidity;this.form&&!this.form.noValidate&&((t=yo.get(this.form))==null||t.forEach(e=>{this.setUserInteracted(e,!0)})),this.form&&!this.form.noValidate&&!n&&!r(this.host)&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Co.set(this.host,[])},this.handleInteraction=e=>{let t=Co.get(this.host);t.includes(e.type)||t.push(e.type),t.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){let e=this.form.querySelectorAll(`*`);for(let t of e)if(typeof t.checkValidity==`function`&&!t.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let e=this.form.querySelectorAll(`*`);for(let t of e)if(typeof t.reportValidity==`function`&&!t.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=Rn({form:e=>{let t=e.form;if(t){let n=e.getRootNode().querySelector(`#${t}`);if(n)return n}return e.closest(`form`)},name:e=>e.name,value:e=>e.value,defaultValue:e=>e.defaultValue,disabled:e=>e.disabled??!1,reportValidity:e=>typeof e.reportValidity==`function`?e.reportValidity():!0,checkValidity:e=>typeof e.checkValidity==`function`?e.checkValidity():!0,setValue:(e,t)=>e.value=t,assumeInteractionOn:[`sl-input`]},t)}hostConnected(){let e=this.options.form(this.host);e&&this.attachForm(e),Co.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Co.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){let e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,yo.has(this.form)?yo.get(this.form).add(this.host):yo.set(this.form,new Set([this.host])),this.form.addEventListener(`formdata`,this.handleFormData),this.form.addEventListener(`submit`,this.handleFormSubmit),this.form.addEventListener(`reset`,this.handleFormReset),bo.has(this.form)||(bo.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),xo.has(this.form)||(xo.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;let e=yo.get(this.form);e&&(e.delete(this.host),e.size<=0&&(this.form.removeEventListener(`formdata`,this.handleFormData),this.form.removeEventListener(`submit`,this.handleFormSubmit),this.form.removeEventListener(`reset`,this.handleFormReset),bo.has(this.form)&&(this.form.reportValidity=bo.get(this.form),bo.delete(this.form)),xo.has(this.form)&&(this.form.checkValidity=xo.get(this.form),xo.delete(this.form)),this.form=void 0))}setUserInteracted(e,t){t?So.add(e):So.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){let n=document.createElement(`button`);n.type=e,n.style.position=`absolute`,n.style.width=`0`,n.style.height=`0`,n.style.clipPath=`inset(50%)`,n.style.overflow=`hidden`,n.style.whiteSpace=`nowrap`,t&&(n.name=t.name,n.value=t.value,[`formaction`,`formenctype`,`formmethod`,`formnovalidate`,`formtarget`].forEach(e=>{t.hasAttribute(e)&&n.setAttribute(e,t.getAttribute(e))})),this.form.append(n),n.click(),n.remove()}}getForm(){return this.form??null}reset(e){this.doAction(`reset`,e)}submit(e){this.doAction(`submit`,e)}setValidity(e){let t=this.host,n=!!So.has(t),r=!!t.required;t.toggleAttribute(`data-required`,r),t.toggleAttribute(`data-optional`,!r),t.toggleAttribute(`data-invalid`,!e),t.toggleAttribute(`data-valid`,e),t.toggleAttribute(`data-user-invalid`,!e&&n),t.toggleAttribute(`data-user-valid`,e&&n)}updateValidity(){let e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){let t=new CustomEvent(`sl-invalid`,{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||e?.preventDefault()}},To=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(zn(Rn({},To),{valid:!1,valueMissing:!0})),Object.freeze(zn(Rn({},To),{valid:!1,customError:!0}));var Eo=x`
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
`,V=class extends j{constructor(){super(...arguments),this.formControlController=new wo(this,{assumeInteractionOn:[`click`]}),this.hasSlotController=new oo(this,`[default]`,`prefix`,`suffix`),this.localize=new F(this),this.hasFocus=!1,this.invalid=!1,this.title=``,this.variant=`default`,this.size=`medium`,this.caret=!1,this.disabled=!1,this.loading=!1,this.outline=!1,this.pill=!1,this.circle=!1,this.type=`button`,this.name=``,this.value=``,this.href=``,this.rel=`noreferrer noopener`}get validity(){return this.isButton()?this.button.validity:To}get validationMessage(){return this.isButton()?this.button.validationMessage:``}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleClick(){this.type===`submit`&&this.formControlController.submit(this),this.type===`reset`&&this.formControlController.reset(this)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}getForm(){return this.formControlController.getForm()}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){let e=this.isLink(),t=e?pr`a`:pr`button`;return hr`
      <${t}
        part="base"
        class=${M({button:!0,"button--default":this.variant===`default`,"button--primary":this.variant===`primary`,"button--success":this.variant===`success`,"button--neutral":this.variant===`neutral`,"button--warning":this.variant===`warning`,"button--danger":this.variant===`danger`,"button--text":this.variant===`text`,"button--small":this.size===`small`,"button--medium":this.size===`medium`,"button--large":this.size===`large`,"button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()===`rtl`,"button--has-label":this.hasSlotController.test(`[default]`),"button--has-prefix":this.hasSlotController.test(`prefix`),"button--has-suffix":this.hasSlotController.test(`suffix`)})}
        ?disabled=${N(e?void 0:this.disabled)}
        type=${N(e?void 0:this.type)}
        title=${this.title}
        name=${N(e?void 0:this.name)}
        value=${N(e?void 0:this.value)}
        href=${N(e&&!this.disabled?this.href:void 0)}
        target=${N(e?this.target:void 0)}
        download=${N(e?this.download:void 0)}
        rel=${N(e?this.rel:void 0)}
        role=${N(e?void 0:`button`)}
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
        ${this.caret?hr` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:``}
        ${this.loading?hr`<sl-spinner part="spinner"></sl-spinner>`:``}
      </${t}>
    `}};V.styles=[E,Eo],V.dependencies={"sl-icon":or,"sl-spinner":vo},w([A(`.button`)],V.prototype,`button`,2),w([k()],V.prototype,`hasFocus`,2),w([k()],V.prototype,`invalid`,2),w([O()],V.prototype,`title`,2),w([O({reflect:!0})],V.prototype,`variant`,2),w([O({reflect:!0})],V.prototype,`size`,2),w([O({type:Boolean,reflect:!0})],V.prototype,`caret`,2),w([O({type:Boolean,reflect:!0})],V.prototype,`disabled`,2),w([O({type:Boolean,reflect:!0})],V.prototype,`loading`,2),w([O({type:Boolean,reflect:!0})],V.prototype,`outline`,2),w([O({type:Boolean,reflect:!0})],V.prototype,`pill`,2),w([O({type:Boolean,reflect:!0})],V.prototype,`circle`,2),w([O()],V.prototype,`type`,2),w([O()],V.prototype,`name`,2),w([O()],V.prototype,`value`,2),w([O()],V.prototype,`href`,2),w([O()],V.prototype,`target`,2),w([O()],V.prototype,`rel`,2),w([O()],V.prototype,`download`,2),w([O()],V.prototype,`form`,2),w([O({attribute:`formaction`})],V.prototype,`formAction`,2),w([O({attribute:`formenctype`})],V.prototype,`formEnctype`,2),w([O({attribute:`formmethod`})],V.prototype,`formMethod`,2),w([O({attribute:`formnovalidate`,type:Boolean})],V.prototype,`formNoValidate`,2),w([O({attribute:`formtarget`})],V.prototype,`formTarget`,2),w([T(`disabled`,{waitUntilFirstUpdate:!0})],V.prototype,`handleDisabledChange`,1),V.define(`sl-button`);var Do=x`
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
`,Oo=class extends j{constructor(){super(...arguments),this.hasSlotController=new oo(this,`footer`),this.localize=new F(this),this.modal=new Za(this),this.open=!1,this.label=``,this.noHeader=!1,this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.modal.isActive()&&this.open&&(e.stopPropagation(),this.requestClose(`keyboard`))}}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),no(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),ro(this),this.removeOpenListeners()}requestClose(e){if(this.emit(`sl-request-close`,{cancelable:!0,detail:{source:e}}).defaultPrevented){let e=R(this,`dialog.denyClose`,{dir:this.localize.dir()});z(this.panel,e.keyframes,e.options);return}this.hide()}addOpenListeners(){var e;`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>this.requestClose(`keyboard`)):document.addEventListener(`keydown`,this.handleDocumentKeyDown)}removeOpenListeners(){var e;(e=this.closeWatcher)==null||e.destroy(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown)}async handleOpenChange(){if(this.open){this.emit(`sl-show`),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),no(this);let e=this.querySelector(`[autofocus]`);e&&e.removeAttribute(`autofocus`),await Promise.all([Ma(this.dialog),Ma(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit(`sl-initial-focus`,{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute(`autofocus`,``)});let t=R(this,`dialog.show`,{dir:this.localize.dir()}),n=R(this,`dialog.overlay.show`,{dir:this.localize.dir()});await Promise.all([z(this.panel,t.keyframes,t.options),z(this.overlay,n.keyframes,n.options)]),this.emit(`sl-after-show`)}else{ao(this),this.emit(`sl-hide`),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([Ma(this.dialog),Ma(this.overlay)]);let e=R(this,`dialog.hide`,{dir:this.localize.dir()}),t=R(this,`dialog.overlay.hide`,{dir:this.localize.dir()});await Promise.all([z(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),z(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,ro(this);let n=this.originalTrigger;typeof n?.focus==`function`&&setTimeout(()=>n.focus()),this.emit(`sl-after-hide`)}}async show(){if(!this.open)return this.open=!0,ka(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ka(this,`sl-after-hide`)}render(){return S`
      <div
        part="base"
        class=${M({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test(`footer`)})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose(`overlay`)} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?`false`:`true`}
          aria-label=${N(this.noHeader?this.label:void 0)}
          aria-labelledby=${N(this.noHeader?void 0:`title`)}
          tabindex="-1"
        >
          ${this.noHeader?``:S`
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
    `}};Oo.styles=[E,Do],Oo.dependencies={"sl-icon-button":P},w([A(`.dialog`)],Oo.prototype,`dialog`,2),w([A(`.dialog__panel`)],Oo.prototype,`panel`,2),w([A(`.dialog__overlay`)],Oo.prototype,`overlay`,2),w([O({type:Boolean,reflect:!0})],Oo.prototype,`open`,2),w([O({reflect:!0})],Oo.prototype,`label`,2),w([O({attribute:`no-header`,type:Boolean,reflect:!0})],Oo.prototype,`noHeader`,2),w([T(`open`,{waitUntilFirstUpdate:!0})],Oo.prototype,`handleOpenChange`,1),L(`dialog.show`,{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:`ease`}}),L(`dialog.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:`ease`}}),L(`dialog.denyClose`,{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}}),L(`dialog.overlay.show`,{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),L(`dialog.overlay.hide`,{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),Oo.define(`sl-dialog`);var ko=x`
  :host {
    display: contents;

    /* For better DX, we'll reset the margin here so the base part can inherit it */
    margin: 0;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: stretch;
    background-color: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-top-width: calc(var(--sl-panel-border-width) * 3);
    border-radius: var(--sl-border-radius-medium);
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-normal);
    line-height: 1.6;
    color: var(--sl-color-neutral-700);
    margin: inherit;
    overflow: hidden;
  }

  .alert:not(.alert--has-icon) .alert__icon,
  .alert:not(.alert--closable) .alert__close-button {
    display: none;
  }

  .alert__icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-large);
    padding-inline-start: var(--sl-spacing-large);
  }

  .alert--has-countdown {
    border-bottom: none;
  }

  .alert--primary {
    border-top-color: var(--sl-color-primary-600);
  }

  .alert--primary .alert__icon {
    color: var(--sl-color-primary-600);
  }

  .alert--success {
    border-top-color: var(--sl-color-success-600);
  }

  .alert--success .alert__icon {
    color: var(--sl-color-success-600);
  }

  .alert--neutral {
    border-top-color: var(--sl-color-neutral-600);
  }

  .alert--neutral .alert__icon {
    color: var(--sl-color-neutral-600);
  }

  .alert--warning {
    border-top-color: var(--sl-color-warning-600);
  }

  .alert--warning .alert__icon {
    color: var(--sl-color-warning-600);
  }

  .alert--danger {
    border-top-color: var(--sl-color-danger-600);
  }

  .alert--danger .alert__icon {
    color: var(--sl-color-danger-600);
  }

  .alert__message {
    flex: 1 1 auto;
    display: block;
    padding: var(--sl-spacing-large);
    overflow: hidden;
  }

  .alert__close-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: var(--sl-font-size-medium);
    margin-inline-end: var(--sl-spacing-medium);
    align-self: center;
  }

  .alert__countdown {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(var(--sl-panel-border-width) * 3);
    background-color: var(--sl-panel-border-color);
    display: flex;
  }

  .alert__countdown--ltr {
    justify-content: flex-end;
  }

  .alert__countdown .alert__countdown-elapsed {
    height: 100%;
    width: 0;
  }

  .alert--primary .alert__countdown-elapsed {
    background-color: var(--sl-color-primary-600);
  }

  .alert--success .alert__countdown-elapsed {
    background-color: var(--sl-color-success-600);
  }

  .alert--neutral .alert__countdown-elapsed {
    background-color: var(--sl-color-neutral-600);
  }

  .alert--warning .alert__countdown-elapsed {
    background-color: var(--sl-color-warning-600);
  }

  .alert--danger .alert__countdown-elapsed {
    background-color: var(--sl-color-danger-600);
  }

  .alert__timer {
    display: none;
  }
`,Ao=class e extends j{constructor(){super(...arguments),this.hasSlotController=new oo(this,`icon`,`suffix`),this.localize=new F(this),this.open=!1,this.closable=!1,this.variant=`primary`,this.duration=1/0,this.remainingTime=this.duration}static get toastStack(){return this.currentToastStack||=Object.assign(document.createElement(`div`),{className:`sl-toast-stack`}),this.currentToastStack}firstUpdated(){this.base.hidden=!this.open}restartAutoHide(){this.handleCountdownChange(),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.duration),this.remainingTime=this.duration,this.remainingTimeInterval=window.setInterval(()=>{this.remainingTime-=100},100))}pauseAutoHide(){var e;(e=this.countdownAnimation)==null||e.pause(),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval)}resumeAutoHide(){var e;this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.remainingTime),this.remainingTimeInterval=window.setInterval(()=>{this.remainingTime-=100},100),(e=this.countdownAnimation)==null||e.play())}handleCountdownChange(){if(this.open&&this.duration<1/0&&this.countdown){let{countdownElement:e}=this;this.countdownAnimation=e.animate([{width:`100%`},{width:`0`}],{duration:this.duration,easing:`linear`})}}handleCloseClick(){this.hide()}async handleOpenChange(){if(this.open){this.emit(`sl-show`),this.duration<1/0&&this.restartAutoHide(),await Ma(this.base),this.base.hidden=!1;let{keyframes:e,options:t}=R(this,`alert.show`,{dir:this.localize.dir()});await z(this.base,e,t),this.emit(`sl-after-show`)}else{ao(this),this.emit(`sl-hide`),clearTimeout(this.autoHideTimeout),clearInterval(this.remainingTimeInterval),await Ma(this.base);let{keyframes:e,options:t}=R(this,`alert.hide`,{dir:this.localize.dir()});await z(this.base,e,t),this.base.hidden=!0,this.emit(`sl-after-hide`)}}handleDurationChange(){this.restartAutoHide()}async show(){if(!this.open)return this.open=!0,ka(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ka(this,`sl-after-hide`)}async toast(){return new Promise(t=>{this.handleCountdownChange(),e.toastStack.parentElement===null&&document.body.append(e.toastStack),e.toastStack.appendChild(this),requestAnimationFrame(()=>{this.clientWidth,this.show()}),this.addEventListener(`sl-after-hide`,()=>{e.toastStack.removeChild(this),t(),e.toastStack.querySelector(`sl-alert`)===null&&e.toastStack.remove()},{once:!0})})}render(){return S`
      <div
        part="base"
        class=${M({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-countdown":!!this.countdown,"alert--has-icon":this.hasSlotController.test(`icon`),"alert--primary":this.variant===`primary`,"alert--success":this.variant===`success`,"alert--neutral":this.variant===`neutral`,"alert--warning":this.variant===`warning`,"alert--danger":this.variant===`danger`})}
        role="alert"
        aria-hidden=${this.open?`false`:`true`}
        @mouseenter=${this.pauseAutoHide}
        @mouseleave=${this.resumeAutoHide}
      >
        <div part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </div>

        <div part="message" class="alert__message" aria-live="polite">
          <slot></slot>
        </div>

        ${this.closable?S`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x-lg"
                library="system"
                label=${this.localize.term(`close`)}
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `:``}

        <div role="timer" class="alert__timer">${this.remainingTime}</div>

        ${this.countdown?S`
              <div
                class=${M({alert__countdown:!0,"alert__countdown--ltr":this.countdown===`ltr`})}
              >
                <div class="alert__countdown-elapsed"></div>
              </div>
            `:``}
      </div>
    `}};Ao.styles=[E,ko],Ao.dependencies={"sl-icon-button":P},w([A(`[part~="base"]`)],Ao.prototype,`base`,2),w([A(`.alert__countdown-elapsed`)],Ao.prototype,`countdownElement`,2),w([O({type:Boolean,reflect:!0})],Ao.prototype,`open`,2),w([O({type:Boolean,reflect:!0})],Ao.prototype,`closable`,2),w([O({reflect:!0})],Ao.prototype,`variant`,2),w([O({type:Number})],Ao.prototype,`duration`,2),w([O({type:String,reflect:!0})],Ao.prototype,`countdown`,2),w([k()],Ao.prototype,`remainingTime`,2),w([T(`open`,{waitUntilFirstUpdate:!0})],Ao.prototype,`handleOpenChange`,1),w([T(`duration`)],Ao.prototype,`handleDurationChange`,1);var jo=Ao;L(`alert.show`,{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:`ease`}}),L(`alert.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:`ease`}}),jo.define(`sl-alert`);var Mo=x`
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
`,No=class extends j{constructor(){super(...arguments),this.variant=`primary`,this.pill=!1,this.pulse=!1}render(){return S`
      <span
        part="base"
        class=${M({badge:!0,"badge--primary":this.variant===`primary`,"badge--success":this.variant===`success`,"badge--neutral":this.variant===`neutral`,"badge--warning":this.variant===`warning`,"badge--danger":this.variant===`danger`,"badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      >
        <slot></slot>
      </span>
    `}};No.styles=[E,Mo],w([O({reflect:!0})],No.prototype,`variant`,2),w([O({type:Boolean,reflect:!0})],No.prototype,`pill`,2),w([O({type:Boolean,reflect:!0})],No.prototype,`pulse`,2),No.define(`sl-badge`);var Po=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.value=0,this.type=`decimal`,this.noGrouping=!1,this.currency=`USD`,this.currencyDisplay=`symbol`}render(){return isNaN(this.value)?``:this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.noGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};w([O({type:Number})],Po.prototype,`value`,2),w([O()],Po.prototype,`type`,2),w([O({attribute:`no-grouping`,type:Boolean})],Po.prototype,`noGrouping`,2),w([O()],Po.prototype,`currency`,2),w([O({attribute:`currency-display`})],Po.prototype,`currencyDisplay`,2),w([O({attribute:`minimum-integer-digits`,type:Number})],Po.prototype,`minimumIntegerDigits`,2),w([O({attribute:`minimum-fraction-digits`,type:Number})],Po.prototype,`minimumFractionDigits`,2),w([O({attribute:`maximum-fraction-digits`,type:Number})],Po.prototype,`maximumFractionDigits`,2),w([O({attribute:`minimum-significant-digits`,type:Number})],Po.prototype,`minimumSignificantDigits`,2),w([O({attribute:`maximum-significant-digits`,type:Number})],Po.prototype,`maximumSignificantDigits`,2),Po.define(`sl-format-number`);var Fo=``,Io=``;function Lo(){return Fo.replace(/\/$/,``)}function Ro(e){Io=e}function zo(){if(!Io){let e=document.querySelector(`[data-fa-kit-code]`);e&&Ro(e.getAttribute(`data-fa-kit-code`)||``)}return Io}var Bo=`7.3.0`;function Vo(e,t,n){let r=`solid`;return t===`chisel`&&(r=`chisel-regular`),t===`etch`&&(r=`etch-solid`),t===`graphite`&&(r=`graphite-thin`),t===`jelly`&&(r=`jelly-regular`,n===`duo-regular`&&(r=`jelly-duo-regular`),n===`fill-regular`&&(r=`jelly-fill-regular`)),t===`jelly-duo`&&(r=`jelly-duo-regular`),t===`jelly-fill`&&(r=`jelly-fill-regular`),t===`notdog`&&(n===`solid`&&(r=`notdog-solid`),n===`duo-solid`&&(r=`notdog-duo-solid`)),t===`notdog-duo`&&(r=`notdog-duo-solid`),t===`slab`&&((n===`solid`||n===`regular`)&&(r=`slab-regular`),n===`press-regular`&&(r=`slab-press-regular`)),t===`slab-press`&&(r=`slab-press-regular`),t===`slab-duo`&&(r=`slab-duo-regular`),t===`slab-press-duo`&&(r=`slab-press-duo-regular`),t===`thumbprint`&&(r=`thumbprint-light`),t===`utility`&&(r=`utility-semibold`),t===`utility-duo`&&(r=`utility-duo-semibold`),t===`utility-fill`&&(r=`utility-fill-semibold`),t===`whiteboard`&&(r=`whiteboard-semibold`),t===`mosaic`&&(r=`mosaic-solid`),t===`pixel`&&(r=`pixel-regular`),t===`vellum`&&(r=`vellum-solid`),t===`classic`&&(n===`thin`&&(r=`thin`),n===`light`&&(r=`light`),n===`regular`&&(r=`regular`),n===`solid`&&(r=`solid`)),t===`duotone`&&(n===`thin`&&(r=`duotone-thin`),n===`light`&&(r=`duotone-light`),n===`regular`&&(r=`duotone-regular`),n===`solid`&&(r=`duotone`)),t===`sharp`&&(n===`thin`&&(r=`sharp-thin`),n===`light`&&(r=`sharp-light`),n===`regular`&&(r=`sharp-regular`),n===`solid`&&(r=`sharp-solid`)),t===`sharp-duotone`&&(n===`thin`&&(r=`sharp-duotone-thin`),n===`light`&&(r=`sharp-duotone-light`),n===`regular`&&(r=`sharp-duotone-regular`),n===`solid`&&(r=`sharp-duotone-solid`)),t===`brands`&&(r=`brands`),r}function Ho(e,t,n){let r=Vo(e,t,n),i=Lo();if(i)return`${i}/${r}/${e}.svg`;let a=zo();return a.length>0?`https://ka-p.fontawesome.com/releases/v${Bo}/svgs/${r}/${e}.svg?token=${encodeURIComponent(a)}`:`https://ka-f.fontawesome.com/releases/v${Bo}/svgs/${r}/${e}.svg`}var Uo={name:`default`,resolver:(e,t=`classic`,n=`solid`)=>Ho(e,t,n),mutator:(e,t)=>{if(e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`),t?.family&&!e.hasAttribute(`data-duotone-initialized`)){let{family:n,variant:r}=t;if(n===`duotone`||n===`sharp-duotone`||n===`notdog-duo`||n===`notdog`&&r===`duo-solid`||n===`jelly-duo`||n===`jelly`&&r===`duo-regular`||n===`utility-duo`||n===`slab-duo`||n===`slab-press-duo`||n===`thumbprint`){let n=[...e.querySelectorAll(`path`)],r=n.find(e=>!e.hasAttribute(`opacity`)),i=n.find(e=>e.hasAttribute(`opacity`));if(!r||!i)return;if(r.setAttribute(`data-duotone-primary`,``),i.setAttribute(`data-duotone-secondary`,``),t.swapOpacity&&r&&i){let e=i.getAttribute(`opacity`)||`0.4`;r.style.setProperty(`--path-opacity`,e),i.style.setProperty(`--path-opacity`,`1`)}e.setAttribute(`data-duotone-initialized`,``)}}}};function Wo(e){return`data:image/svg+xml,${encodeURIComponent(e)}`}var Go={solid:{"arrow-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`,"arrow-up":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`,backward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/></svg>`,"backward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z"/></svg>`,bars:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>`,"angles-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M77.3 256 214.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256zm192 0L406.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256z"/></svg>`,"angles-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.7 256 297.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L434.7 256zm-192 0L105.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256z"/></svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>`,"chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,"chevron-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,"chevron-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,circle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>`,"closed-captioning":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM216 272L248 272C252.4 272 256 275.6 256 280C256 293.3 266.7 304 280 304C293.3 304 304 293.3 304 280C304 249.1 278.9 224 248 224L216 224C185.1 224 160 249.1 160 280L160 360C160 390.9 185.1 416 216 416L248 416C278.9 416 304 390.9 304 360C304 346.7 293.3 336 280 336C266.7 336 256 346.7 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 280C208 275.6 211.6 272 216 272zM384 280C384 275.6 387.6 272 392 272L424 272C428.4 272 432 275.6 432 280C432 293.3 442.7 304 456 304C469.3 304 480 293.3 480 280C480 249.1 454.9 224 424 224L392 224C361.1 224 336 249.1 336 280L336 360C336 390.9 361.1 416 392 416L424 416C454.9 416 480 390.9 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 364.4 428.4 368 424 368L392 368C387.6 368 384 364.4 384 360L384 280z"/></svg>`,"closed-captioning-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L161.8 128L512 128C547.3 128 576 156.7 576 192L576 448C576 473.5 561.1 495.4 539.6 505.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM384 350.1L384 279.9C384 275.5 387.6 271.9 392 271.9L424 271.9C428.4 271.9 432 275.5 432 279.9C432 293.2 442.7 303.9 456 303.9C469.3 303.9 480 293.2 480 279.9C480 249 454.9 223.9 424 223.9L392 223.9C361.1 223.9 336 249 336 279.9L336 302.1L384 350.1zM445.5 411.6C465.7 403.2 480 383.2 480 359.9C480 346.6 469.3 335.9 456 335.9C442.7 335.9 432 346.6 432 359.9C432 364.3 428.4 367.9 424 367.9L401.8 367.9L445.5 411.6zM162.3 264.1C160.8 269.1 160 274.5 160 280L160 360C160 390.9 185.1 416 216 416L248 416C266.1 416 282.1 407.5 292.4 394.2L410.2 512L128 512C92.7 512 64 483.3 64 448L64 192C64 184.2 65.4 176.7 68 169.8L162.3 264.1zM256.1 357.9C256 358.6 256 359.3 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 309.8L256.1 357.9z"/></svg>`,compress:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>`,ellipsis:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>`,"ellipsis-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`,expand:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>`,eyedropper:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>`,filter:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"/></svg>`,forward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>`,file:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>`,"file-audio":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>`,"file-code":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>`,"file-excel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>`,"file-image":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>`,"file-pdf":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>`,"file-powerpoint":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>`,"file-video":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>`,"file-word":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>`,"file-zipper":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>`,"forward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M21 36.8c12.9-7 28.7-6.3 41 1.8L320 208.1 320 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-144.1-258 169.6c-12.3 8.1-28 8.8-41 1.8S0 454.7 0 440L0 72C0 57.3 8.1 43.8 21 36.8z"/></svg>`,gauge:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,gear:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`,"grip-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>`,indeterminate:`<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>`,"magnifying-glass":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,minus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>`,pause:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>`,"picture-in-picture":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M448 32c35.3 0 64 28.7 64 64l0 112-64 0 0-112-384 0 0 320 144 0 0 64-144 0-6.5-.3c-30.1-3.1-54.1-27-57.1-57.1L0 416 0 96C0 62.9 25.2 35.6 57.5 32.3L64 32 448 32zm16 224c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48l-160 0c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48l160 0z"/></svg>`,play:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>`,"play-circle":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>`,plus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>`,"table-columns":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64l0 256 128 0 0-256-128 0zm320 0l-128 0 0 256 128 0 0-256z"/></svg>`,thumbtack:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 10.3 134.1c37.1 21.2 65.8 56.4 78.2 99.7l3.8 13.4c2.8 9.7 .8 20-5.2 28.1S362 352 352 352L32 352c-10 0-19.5-4.7-25.5-12.7s-8-18.4-5.2-28.1L5 297.8c12.4-43.3 41-78.5 78.2-99.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 400l64 0 0 112c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-112z"/></svg>`,"up-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M406.6 502.6l96-96c9.2-9.2 11.9-22.9 6.9-34.9S492.9 352 480 352l-64 0 0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 320-64 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l96 96c12.5 12.5 32.8 12.5 45.3 0zM150.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 160 32 160l64 0 0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320 64 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-96-96z"/></svg>`,upload:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>`,user:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>`,volume:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM441.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C443.3 170.7 464 210.9 464 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-low":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM380.6 181.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,xmark:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`},regular:{calendar:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/></svg>`,"circle-question":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,"circle-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,clock:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>`,copy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>`,eye:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>`,"eye-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>`}},Ko={name:`system`,resolver:(e,t=`classic`,n=`solid`)=>{let r=Go[n][e]??Go.regular[e]??Go.regular[`circle-question`];return r?Wo(r):``},mutator:e=>{e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`)}},qo=`classic`,Jo=[Uo,Ko],Yo=new Set;function Xo(e){Yo.add(e)}function Zo(e){Yo.delete(e)}function Qo(e){return Jo.find(t=>t.name===e)}function $o(e,t){es(e),Jo.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),Yo.forEach(t=>{t.library===e&&t.setIcon()})}function es(e){Jo=Jo.filter(t=>t.name!==e)}function ts(){return qo}var ns=Object.defineProperty,rs=Object.getOwnPropertyDescriptor,is=e=>{throw TypeError(e)},H=(e,t,n,r)=>{for(var i=r>1?void 0:r?rs(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&ns(t,n,i),i},as=(e,t,n)=>t.has(e)||is(`Cannot `+n),os=(e,t,n)=>(as(e,t,`read from private field`),n?n.call(e):t.get(e)),ss=(e,t,n)=>t.has(e)?is(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),cs=(e,t,n,r)=>(as(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n);function ls(e,t={}){let n=e.replace(/\/+$/,``);$o(`default`,{resolver:e=>{let r=t[e];return r?`data:image/svg+xml,${encodeURIComponent(r)}`:`${n}/${e}.svg`}})}function us(e){let t=e.parentElement;for(;t;){if(t.localName===`pp-slot`)return t.getAttribute(`data-pp-owner`)??`page`;if(t instanceof U)return t.hasUpdated?t.localName:us(t);t=t.parentElement}return`page`}var U=class extends dn{constructor(){super(...arguments),this.authored=[],this.captured=!1}createRenderRoot(){if(this.constructor.keepChildren){let e=document.createComment(`pp-render-end`);this.prepend(e),this.renderOptions.renderBefore=e}return this}connectedCallback(){if(!this.captured&&(this.captured=!0,!this.constructor.keepChildren)){this.authored=Array.from(this.childNodes);for(let e of this.authored)this.removeChild(e)}super.connectedCallback(),this.hasAttribute(`data-pp-owner`)||queueMicrotask(()=>this.setAttribute(`data-pp-owner`,us(this)))}slotted(e){let t=this.authored.filter(t=>{let n=t instanceof Element?t.getAttribute(`slot`):null;return e?n===e:!n});return S`<pp-slot name=${e??`default`} data-pp-owner=${us(this)}>${t}</pp-slot>`}authoredText(){return this.authored.map(e=>e.textContent??``).join(``).trim()}};U.keepChildren=!1;var ds=class extends Event{constructor(){super(`wa-remove`,{bubbles:!0,cancelable:!1,composed:!0})}},fs=x`
  @layer wa-component {
    :host {
      display: inline-flex;
      gap: 0.5em;
      border-radius: var(--wa-border-radius-m);
      align-items: center;
      background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
      border-style: var(--wa-border-style);
      border-width: var(--wa-border-width-s);
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      font-size: inherit;
      line-height: 1;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
      height: calc(var(--wa-form-control-height) * 0.8);
      line-height: calc(var(--wa-form-control-height) - var(--wa-form-control-border-width) * 2);
      padding: 0 0.75em;
    }

    /* Appearance modifiers */
    :host([appearance='outlined']) {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }

    :host([appearance='filled']) {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      border-color: transparent;
    }

    :host([appearance='filled-outlined']) {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }

    :host([appearance='accent']) {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
  }

  .content {
    font-size: var(--wa-font-size-smaller);
  }

  [part='remove-button'] {
    line-height: 1;
  }

  [part='remove-button']::part(base) {
    padding: 0;
    height: 1em;
    width: 1em;
    color: currentColor;
  }

  @media (hover: hover) {
    :host(:hover) > [part='remove-button']::part(base) {
      background-color: transparent;
      color: color-mix(in oklab, currentColor, var(--wa-color-mix-hover));
    }
  }

  :host(:active) > [part='remove-button']::part(base) {
    background-color: transparent;
    color: color-mix(in oklab, currentColor, var(--wa-color-mix-active));
  }

  /*
   * Pill modifier
   */
  :host([pill]) {
    border-radius: var(--wa-border-radius-pill);
  }
`,ps={small:`s`,medium:`m`,large:`l`},ms=new Set;function hs(e,t){t in ps&&!ms.has(`${e}:${t}`)&&(ms.add(`${e}:${t}`),console.warn(`[${e}] size="${t}" is deprecated. Use size="${ps[t]}" instead. The long-form value will be removed in the next major version.`))}var gs=x`
  :host([size='xs']) {
    font-size: var(--wa-font-size-xs);
  }

  :host([size='s']),
  :host([size='small']) {
    font-size: var(--wa-font-size-s);
  }

  :host([size='m']),
  :host([size='medium']) {
    font-size: var(--wa-font-size-m);
  }

  :host([size='l']),
  :host([size='large']) {
    font-size: var(--wa-font-size-l);
  }

  :host([size='xl']) {
    font-size: var(--wa-font-size-xl);
  }
`,_s=x`
  :where(:root),
  .wa-neutral,
  :host([variant='neutral']) {
    --wa-color-fill-loud: var(--wa-color-neutral-fill-loud);
    --wa-color-fill-normal: var(--wa-color-neutral-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-neutral-fill-quiet);
    --wa-color-border-loud: var(--wa-color-neutral-border-loud);
    --wa-color-border-normal: var(--wa-color-neutral-border-normal);
    --wa-color-border-quiet: var(--wa-color-neutral-border-quiet);
    --wa-color-on-loud: var(--wa-color-neutral-on-loud);
    --wa-color-on-normal: var(--wa-color-neutral-on-normal);
    --wa-color-on-quiet: var(--wa-color-neutral-on-quiet);
  }

  .wa-brand,
  :host([variant='brand']) {
    --wa-color-fill-loud: var(--wa-color-brand-fill-loud);
    --wa-color-fill-normal: var(--wa-color-brand-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-brand-fill-quiet);
    --wa-color-border-loud: var(--wa-color-brand-border-loud);
    --wa-color-border-normal: var(--wa-color-brand-border-normal);
    --wa-color-border-quiet: var(--wa-color-brand-border-quiet);
    --wa-color-on-loud: var(--wa-color-brand-on-loud);
    --wa-color-on-normal: var(--wa-color-brand-on-normal);
    --wa-color-on-quiet: var(--wa-color-brand-on-quiet);
  }

  .wa-success,
  :host([variant='success']) {
    --wa-color-fill-loud: var(--wa-color-success-fill-loud);
    --wa-color-fill-normal: var(--wa-color-success-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-success-fill-quiet);
    --wa-color-border-loud: var(--wa-color-success-border-loud);
    --wa-color-border-normal: var(--wa-color-success-border-normal);
    --wa-color-border-quiet: var(--wa-color-success-border-quiet);
    --wa-color-on-loud: var(--wa-color-success-on-loud);
    --wa-color-on-normal: var(--wa-color-success-on-normal);
    --wa-color-on-quiet: var(--wa-color-success-on-quiet);
  }

  .wa-warning,
  :host([variant='warning']) {
    --wa-color-fill-loud: var(--wa-color-warning-fill-loud);
    --wa-color-fill-normal: var(--wa-color-warning-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-warning-fill-quiet);
    --wa-color-border-loud: var(--wa-color-warning-border-loud);
    --wa-color-border-normal: var(--wa-color-warning-border-normal);
    --wa-color-border-quiet: var(--wa-color-warning-border-quiet);
    --wa-color-on-loud: var(--wa-color-warning-on-loud);
    --wa-color-on-normal: var(--wa-color-warning-on-normal);
    --wa-color-on-quiet: var(--wa-color-warning-on-quiet);
  }

  .wa-danger,
  :host([variant='danger']) {
    --wa-color-fill-loud: var(--wa-color-danger-fill-loud);
    --wa-color-fill-normal: var(--wa-color-danger-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-danger-fill-quiet);
    --wa-color-border-loud: var(--wa-color-danger-border-loud);
    --wa-color-border-normal: var(--wa-color-danger-border-normal);
    --wa-color-border-quiet: var(--wa-color-danger-border-quiet);
    --wa-color-on-loud: var(--wa-color-danger-on-loud);
    --wa-color-on-normal: var(--wa-color-danger-on-normal);
    --wa-color-on-quiet: var(--wa-color-danger-on-quiet);
  }
`;function vs(e,t){let n={waitUntilFirstUpdate:!1,...t};return(t,r)=>{let{update:i}=t,a=Array.isArray(e)?e:[e];t.update=function(e){a.forEach(t=>{let i=t;if(e.has(i)){let t=e.get(i),a=this[i];t!==a&&(!n.waitUntilFirstUpdate||this.hasUpdated)&&this[r](t,a)}}),i.call(this,e)}}}var ys=x`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`,bs=/;\s+$/;function xs(e){return e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}function Ss(e){let{property:t,value:n,element:r}=e;if(n){let e=r.getAttribute(`style`)||``;e&&(e.match(bs)||(e+=`;`),e+=` `);let i=`${t}: ${n}`;return e.includes(i)?void 0:`${e}${i};`}return null}var Cs,ws=class extends dn{constructor(){super(),ss(this,Cs,!1),this.initialReflectedProperties=new Map,this.didSSR=!!this.shadowRoot,this.customStates={set:(e,t)=>{if(this.internals?.states)try{t?this.internals.states.add(e):this.internals.states.delete(e)}catch(e){if(String(e).includes(`must start with '--'`))console.error(`Your browser implements an outdated version of CustomStateSet. Consider using a polyfill`);else throw e}},has:e=>{if(!this.internals?.states)return!1;try{return this.internals.states.has(e)}catch{return!1}}};try{this.internals=this.attachInternals()}catch{console.error(`Element internals are not supported in your browser. Consider using a polyfill`)}this.customStates.set(`wa-defined`,!0);let e=this.constructor;for(let[t,n]of e.elementProperties)n.default===`inherit`&&n.initial!==void 0&&typeof t==`string`&&this.customStates.set(`initial-${t}-${n.initial}`,!0)}static get styles(){return[ys,...Array.isArray(this.css)?this.css:this.css?[this.css]:[]]}connectedCallback(){super.connectedCallback(),this.didSSR||this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `)),this.didSSR&&this.updateComplete.then(()=>{this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `))})}attributeChangedCallback(e,t,n){os(this,Cs)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),cs(this,Cs,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}firstUpdated(e){super.firstUpdated(e),this.didSSR&&this.shadowRoot?.querySelectorAll(`slot`).forEach(e=>{e.dispatchEvent(new Event(`slotchange`,{bubbles:!0,composed:!1,cancelable:!1}))})}update(e){try{super.update(e)}catch(e){if(this.didSSR&&!this.hasUpdated){let t=new Event(`lit-hydration-error`,{bubbles:!0,composed:!0,cancelable:!1});t.error=e,this.dispatchEvent(t)}throw e}}setStyle(e,t){if(!this.style){let n=Ss({property:xs(e),value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style[e]=t}setStyleProperty(e,t){if(!this.style){let n=Ss({property:e,value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style.setProperty(e,t)}relayNativeEvent(e,t){e.stopImmediatePropagation(),this.dispatchEvent(new e.constructor(e.type,{...e,...t}))}};Cs=new WeakMap,H([O()],ws.prototype,`dir`,2),H([O()],ws.prototype,`lang`,2),H([O({type:Boolean,reflect:!0,attribute:`did-ssr`})],ws.prototype,`didSSR`,2);var Ts={$code:`en`,$name:`English`,$dir:`ltr`,allTagsRemoved:`All tags removed`,am:`AM`,autosizeColumn:`Autosize column`,captions:`Captions`,carousel:`Carousel`,chooseDate:`Choose date`,chooseDecade:`Choose decade`,chooseMonth:`Choose month`,chooseTime:`Choose time`,chooseYear:`Choose year`,clearEntry:`Clear entry`,clearFilter:`Clear filter`,clearSort:`Clear sort`,close:`Close`,closeCalendar:`Close calendar`,closeTimeInput:`Close time picker`,collapseRow:`Collapse row`,columnMenu:`Column options`,columnMovedToPosition:(e,t,n)=>`${e} moved to position ${t} of ${n}`,columns:`Columns`,compactPageXOfY:(e,t)=>`${e} of ${t}`,completed:`Completed`,copied:`Copied`,copy:`Copy`,createOption:e=>`Create "${e}"`,currentlyPlaying:`currently playing`,currentValue:`Current value`,date:`Date`,datePickerKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the calendar.`,day:`Day`,dayPeriod:`AM/PM`,decrement:`Decrement`,deselectAllRows:`Deselect all rows`,disabled:`Disabled`,dropFileHere:`Drop file here or click to browse`,dropFilesHere:`Drop files here or click to browse`,empty:`Empty`,endDate:`End date`,enterFullscreen:`Enter fullscreen`,error:`Error`,exitFullscreen:`Exit fullscreen`,expandRow:`Expand row`,filterByColumn:e=>`Filter by ${e}`,filterFrom:`From`,filterMax:`Max`,filterMin:`Min`,filterTo:`To`,firstPage:`First page`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hideColumn:`Hide column`,hidePassword:`Hide password`,hour:`Hour`,incompleteDate:`Enter a valid date.`,increment:`Increment`,jumpBackwardX:e=>`Jump back ${e} pages`,jumpForwardX:e=>`Jump forward ${e} pages`,lastPage:`Last page`,loading:`Loading`,locked:`Locked`,minute:`Minute`,month:`Month`,moreOptions:`More Options`,mute:`Mute`,nextDecade:`Next decade`,nextMonth:`Next month`,nextPage:`Next page`,nextSlide:`Next slide`,nextVideo:`Next Video`,nextYear:`Next year`,noData:`No data`,noOptions:`No options`,noResults:`No matching results`,notCompleted:`Not completed`,now:`Now`,numCharacters:e=>e===1?`1 character`:`${e} characters`,numCharactersRemaining:e=>e===1?`1 character remaining`:`${e} characters remaining`,numOptionsAvailable:e=>e===0?`No options available`:e===1?`1 option available`:`${e} options available`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,numRowsCopied:e=>e===1?`1 row copied`:`${e} rows copied`,numRowsSelected:e=>e===1?`1 row selected`:`${e} rows selected`,optionPosition:(e,t,n)=>`${e}, ${t} of ${n}`,optionsLoadError:`Options could not be loaded`,pageXOfY:(e,t)=>`Page ${e} of ${t}`,pagination:`Pagination`,pause:`Pause`,pauseAnimation:`Pause animation`,pictureInPicture:`Picture in picture`,pinLeft:`Pin left`,pinRight:`Pin right`,play:`Play`,playAnimation:`Play animation`,playbackSpeed:`Playback speed`,playlist:`Playlist`,pm:`PM`,previousDecade:`Previous decade`,previousMonth:`Previous month`,previousPage:`Previous page`,previousSlide:`Previous slide`,previousVideo:`Previous video`,previousYear:`Previous year`,progress:`Progress`,rangeTooLong:e=>e===1?`Select a range no longer than 1 day`:`Select a range no longer than ${e} days`,rangeTooShort:e=>e===1?`Select a range at least 1 day long`:`Select a range at least ${e} days long`,readonly:`Read-only`,remove:`Remove`,resetColumns:`Reset columns`,resize:`Resize`,resizeColumn:`Resize column`,rowsPerPage:`Rows per page`,scrollableRegion:`Scrollable region`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,search:`Search`,second:`Second`,seek:`Seek`,seekProgress:(e,t)=>`${e} of ${t}`,selectAColorFromTheScreen:`Select a color from the screen`,selectAllRows:`Select all rows`,selected:`Selected`,selectedDateLabel:e=>`Selected: ${e}`,selectedRangeLabel:e=>`Selected range: ${e}`,selectGroup:`Select group`,selectionCleared:`Selection cleared`,selectRow:`Select row`,showingNofMRows:(e,t)=>`Showing ${e} of ${t} rows`,showingXtoYofZ:(e,t,n)=>`${e}\u2013${t} of ${n}`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,sortAscending:`Sort ascending`,sortColumn:`Sort column`,sortDescending:`Sort descending`,startDate:`Start date`,steps:`Steps`,stepXOfY:(e,t)=>`Step ${e} of ${t}`,tagAdded:e=>`${e} added`,tagAlreadyAdded:e=>`${e} is already added`,tagInputKeyboardHelp:`Press Backspace or Delete to remove this tag.`,tagRemoved:e=>`${e} removed`,time:`Time`,timeInputKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the time picker.`,today:`Today`,toggleColorFormat:`Toggle color format`,tooFewTags:e=>e===1?`Add at least 1 tag`:`Add at least ${e} tags`,tooManyTags:e=>e===1?`Add no more than 1 tag`:`Add no more than ${e} tags`,unmute:`Unmute`,unpin:`Unpin`,unpinColumn:`Unpin column`,videoPlayer:`Video player`,volume:`Volume`,year:`Year`,zoomIn:`Zoom in`,zoomOut:`Zoom out`};Sr(Ts);var Es=Ts,Ds=class extends wr{lang(){return this.host.didSSR&&!this.host.hasUpdated?this.host.lang||`en`:super.lang()}};Sr(Es);var Os=class extends ws{constructor(){super(...arguments),this.localize=new Ds(this),this.variant=`neutral`,this.appearance=`filled-outlined`,this.size=`m`,this.pill=!1,this.withRemove=!1}handleSizeChange(){hs(this.localName,this.size)}handleRemoveClick(){this.dispatchEvent(new ds)}render(){return S`
      <slot part="content" class="content"></slot>

      ${this.withRemove?S`
            <wa-button
              part="remove-button"
              exportparts="base:remove-button__base"
              class="remove"
              appearance="plain"
              size=${this.size}
              @click=${this.handleRemoveClick}
              tabindex="-1"
            >
              <wa-icon name="xmark" library="system" variant="solid" label=${this.localize.term(`remove`)}></wa-icon>
            </wa-button>
          `:``}
    `}};Os.css=[fs,_s,gs],H([O({reflect:!0})],Os.prototype,`variant`,2),H([O({reflect:!0})],Os.prototype,`appearance`,2),H([O({reflect:!0})],Os.prototype,`size`,2),H([vs(`size`)],Os.prototype,`handleSizeChange`,1),H([O({type:Boolean,reflect:!0})],Os.prototype,`pill`,2),H([O({attribute:`with-remove`,type:Boolean})],Os.prototype,`withRemove`,2),Os=H([D(`wa-tag`)],Os);var ks=()=>({checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&(n.message=t.validationMessage),!(`validity`in t))return n.invalidKeys.push(`customError`),n;for(let e in t.validity){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}}),As=class extends Event{constructor(){super(`wa-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}},js=()=>({observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys=[`customError`]),t}}),Ms=class extends ws{constructor(){super(),this.name=null,this.disabled=!1,this.required=!1,this.assumeInteractionOn=[`input`],this.validators=[],this.valueHasChanged=!1,this.hasInteracted=!1,this.customError=null,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new As))},this.handleInteraction=e=>{let t=this.emittedEvents;t.includes(e.type)||t.push(e.type),t.length===this.assumeInteractionOn?.length&&(this.hasInteracted=!0)},`addEventListener`in this&&this.addEventListener(`invalid`,this.emitInvalid)}static get validators(){return[js()]}static get observedAttributes(){let e=new Set(super.observedAttributes||[]);for(let t of this.validators)if(t.observedAttributes)for(let n of t.observedAttributes)e.add(n);return[...e]}connectedCallback(){super.connectedCallback(),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.updateValidity()}):this.updateValidity(),this.assumeInteractionOn.forEach(e=>{this.addEventListener?.(e,this.handleInteraction)})}firstUpdated(...e){super.firstUpdated(...e),this.updateValidity()}willUpdate(e){if(e.has(`customError`)&&(this.customError||=null,this.setCustomValidity(this.customError||``)),e.has(`value`)||e.has(`disabled`)||e.has(`defaultValue`)){let e=this.value;this.updateFormValue(e)}e.has(`disabled`)&&(this.customStates.set(`disabled`,this.disabled),(this.hasAttribute(`disabled`)||!this.matches(`:disabled`))&&this.toggleAttribute(`disabled`,this.disabled)),super.willUpdate(e),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>this.updateValidity()):this.updateValidity()}updateFormValue(e){if(Array.isArray(e)){if(this.name){let t=new FormData;for(let n of e)t.append(this.name,n);this.setValue(t,t)}}else this.setValue(e,e)}get labels(){return this.internals.labels}getForm(){return this.internals.form}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}get validationTarget(){return this.input||void 0}setValidity(...e){let t=e[0],n=e[1],r=e[2];r||=this.validationTarget,this.internals.setValidity(t,n,r||void 0),this.requestUpdate(`validity`),this.setCustomStates()}setCustomStates(){let e=!!this.required,t=this.internals.validity.valid,n=this.hasInteracted;this.customStates.set(`required`,e),this.customStates.set(`optional`,!e),this.customStates.set(`invalid`,!t),this.customStates.set(`valid`,t),this.customStates.set(`user-invalid`,!t&&n),this.customStates.set(`user-valid`,t&&n)}setCustomValidity(e){if(!e){this.customError=null,this.setValidity({});return}this.customError=e,this.setValidity({customError:!0},e,this.validationTarget)}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity()}):(this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity())}setValue(...e){let[t,n]=e;this.internals.setFormValue(t,n)}get allValidators(){let e=this.constructor.validators||[],t=this.validators||[];return[...e,...t]}resetValidity(){this.setCustomValidity(``),this.setValidity({})}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.resetValidity();return}let e=this.allValidators;if(!e?.length)return;let t={customError:!!this.customError},n=this.validationTarget||this.input||void 0,r=``;for(let n of e){let{isValid:e,message:i,invalidKeys:a}=n.checkValidity(this);e||(r||=i,a?.length>=0&&a.forEach(e=>t[e]=!0))}r||=this.validationMessage,this.setValidity(t,r,n)}};Ms.formAssociated=!0,H([O({reflect:!0})],Ms.prototype,`name`,2),H([O({type:Boolean})],Ms.prototype,`disabled`,2),H([O({state:!0,attribute:!1})],Ms.prototype,`valueHasChanged`,2),H([O({state:!0,attribute:!1})],Ms.prototype,`hasInteracted`,2),H([O({attribute:`custom-error`,reflect:!0})],Ms.prototype,`customError`,2),H([O({attribute:!1,state:!0,type:Object})],Ms.prototype,`validity`,1);var Ns=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{let t=e.target;(this.slotNames.includes(`[default]`)&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return this.host.childNodes?[...this.host.childNodes].some(e=>{if(e.nodeType===Node.TEXT_NODE&&e.textContent.trim()!==``)return!0;if(e.nodeType===Node.ELEMENT_NODE){let t=e;if(t.tagName.toLowerCase()===`wa-visually-hidden`)return!1;if(!t.hasAttribute(`slot`))return!0}return!1}):!1}hasNamedSlot(e){return this.host.querySelector?.(`:scope > [slot="${e}"]`)!==null}test(e,t){return t&&this.host.didSSR&&!this.host.hasUpdated?!!this.host[t]:e===`[default]`?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){let e=this.host.shadowRoot;e&&`addEventListener`in e&&e.addEventListener(`slotchange`,this.handleSlotChange)}hostDisconnected(){let e=this.host.shadowRoot;e&&`removeEventListener`in e&&e.removeEventListener(`slotchange`,this.handleSlotChange)}},Ps=x`
  @layer wa-component {
    :host {
      display: inline-block;

      /* Workaround because Chrome doesn't like :host(:has()) below
       * https://issues.chromium.org/issues/40062355
       * Firefox doesn't like this nested rule, so both are needed */
      &:has(wa-badge) {
        position: relative;
      }
    }

    /* Apply relative positioning only when needed to position wa-badge
     * This avoids creating a new stacking context for every button */
    :host(:has(wa-badge)) {
      position: relative;
    }
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    transition-property: background, border, box-shadow, color, opacity, transform;
    transition-duration: var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    transform-origin: center;
    cursor: pointer;
    padding: 0 var(--wa-form-control-padding-inline);
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--wa-font-weight-action);
    height: var(--wa-form-control-height);
    width: 100%;

    background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));

    border-color: transparent;
    color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-form-control-border-radius));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-form-control-border-radius));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-form-control-border-radius));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-form-control-border-radius));
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
  }

  /* Hover and active transforms */
  .button:not(.disabled):not(.loading) {
    @media (hover: hover) {
      &:hover {
        transform: var(--wa-button-transform-hover);
      }
    }
    &:active {
      transform: var(--wa-button-transform-active);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled-outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='accent']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
        var(--wa-color-mix-active)
      );
    }
  }

  /* Focus states */
  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    /* When disabled, prevent mouse events from bubbling up from children */
    .button {
      pointer-events: none;
    }
  }

  /* Keep it last so Safari doesn't stop parsing this block */
  .button::-moz-focus-inner {
    border: 0;
  }

  /* Icon buttons */
  .button.is-icon-button {
    outline-offset: 2px;
    width: var(--wa-form-control-height);
    aspect-ratio: 1;
  }

  /* Icon buttons with a caret need to grow to fit both the icon and the caret */
  .button.is-icon-button.caret {
    width: auto;
    aspect-ratio: auto;
    min-width: var(--wa-form-control-height);
  }

  /* Pill modifier */
  :host([pill]) .button {
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-border-radius-pill));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-border-radius-pill));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-border-radius-pill));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-border-radius-pill));
  }

  /*
   * Label
   */

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .label {
    display: inline-block;
  }

  .is-icon-button .label {
    display: flex;
    justify-content: center;
  }

  .label::slotted(wa-icon) {
    align-self: center;
  }

  /*
   * Caret modifier
   */

  wa-icon[part='caret'] {
    display: flex;
    align-self: center;
    align-items: center;

    &::part(svg) {
      width: 0.875em;
      height: 0.875em;
    }

    .button:has(&) .end {
      display: none;
    }
  }

  /*
   * Loading modifier
   */

  .loading {
    position: relative;
    cursor: wait;

    .start,
    .label,
    .end,
    .caret {
      /* Hidden with opacity, not visibility, so the label stays in the accessibility tree */
      opacity: 0;

      /* Unlike visibility: hidden, opacity leaves the content clickable */
      pointer-events: none;
    }

    wa-spinner {
      --indicator-color: currentColor;
      --track-color: color-mix(in oklab, currentColor, transparent 90%);

      position: absolute;
      font-size: 1em;
      height: 1em;
      width: 1em;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  }

  /*
   * Badges
   */

  .button ::slotted(wa-badge) {
    border-color: var(--wa-color-surface-default);
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  :host(:dir(rtl)) ::slotted(wa-badge) {
    translate: -50% -50%;
  }

  /*
  * Button spacing
  */

  slot[name='start']::slotted(*) {
    margin-inline-end: 0.75em;
  }

  slot[name='end']::slotted(*),
  .button:not(.visually-hidden-label) [part='caret'] {
    margin-inline-start: 0.75em;
  }
`,W=class extends Ms{constructor(){super(...arguments),this.assumeInteractionOn=[`click`],this.hasSlotController=new Ns(this,`[default]`,`start`,`end`),this.localize=new Ds(this),this.invalid=!1,this.isIconButton=!1,this.title=``,this.variant=`neutral`,this.appearance=`accent`,this.size=`m`,this.withCaret=!1,this.withStart=!1,this.withEnd=!1,this.disabled=!1,this.loading=!1,this.pill=!1,this.type=`button`}static get validators(){return[...super.validators,ks()]}handleSizeChange(){hs(this.localName,this.size)}constructLightDOMButton(){let e=document.createElement(`button`);for(let t of this.attributes)t.name!==`style`&&e.setAttribute(t.name,t.value);return e.type=this.type,e.style.position=`absolute !important`,e.style.width=`0 !important`,e.style.height=`0 !important`,e.style.clipPath=`inset(50%) !important`,e.style.overflow=`hidden !important`,e.style.whiteSpace=`nowrap !important`,this.name&&(e.name=this.name),e.value=this.value||``,e}handleClick(e){if(this.disabled||this.loading){e.preventDefault(),e.stopImmediatePropagation();return}if(this.type!==`submit`&&this.type!==`reset`||!this.getForm())return;let t=this.constructLightDOMButton();this.parentElement?.append(t),t.click(),t.remove()}handleInvalid(){this.dispatchEvent(new As)}handleLabelSlotChange(){let e=this.labelSlot.assignedNodes({flatten:!0}),t=!1,n=!1,r=!1,i=!1;[...e].forEach(e=>{if(e.nodeType===Node.ELEMENT_NODE){let r=e;r.localName===`wa-icon`?(n=!0,t||=r.label!==void 0):i=!0}else e.nodeType===Node.TEXT_NODE&&(e.textContent?.trim()||``).length>0&&(r=!0)}),this.isIconButton=n&&!r&&!i,this.customStates.set(`icon-button`,this.isIconButton),this.isIconButton&&!t&&console.warn(`Icon buttons must have a label for screen readers. Add <wa-icon label="..."> to remove this warning.`,this)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.customStates.set(`disabled`,this.disabled),this.updateValidity()}handleHrefChange(){this.customStates.set(`link`,this.isLink())}handleLoadingChange(){this.customStates.set(`loading`,this.loading)}setValue(...e){}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){let e=this.isLink(),t=e?pr`a`:pr`button`;return hr`
      <${t}
        part="base button"
        class=${M({button:!0,caret:this.withCaret,disabled:this.disabled,loading:this.loading,rtl:this.localize.dir()===`rtl`,"has-label":this.hasSlotController.test(`[default]`),"has-start":this.hasSlotController.test(`start`,`withStart`),"has-end":this.hasSlotController.test(`end`,`withEnd`),"is-icon-button":this.isIconButton})}
        ?disabled=${N(e?void 0:this.disabled)}
        type=${N(e?void 0:this.type)}
        title=${this.title}
        name=${N(e?void 0:this.name)}
        value=${N(e?void 0:this.value)}
        href=${N(e?this.href:void 0)}
        target=${N(e?this.target:void 0)}
        download=${N(e?this.download:void 0)}
        rel=${N(e&&this.rel?this.rel:void 0)}
        role=${N(e?void 0:`button`)}
        aria-disabled=${N(e&&this.disabled?`true`:void 0)}
        aria-busy=${this.loading?`true`:`false`}
        tabindex=${this.disabled?`-1`:`0`}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="start" part="start" class="start"></slot>
        <slot part="label" class="label" @slotchange=${this.handleLabelSlotChange}></slot>
        <slot name="end" part="end" class="end"></slot>
        ${this.withCaret?hr`
                <wa-icon part="caret" class="caret" library="system" name="chevron-down" variant="solid"></wa-icon>
              `:``}
        ${this.loading?hr`<wa-spinner part="spinner"></wa-spinner>`:``}
      </${t}>
    `}};W.shadowRootOptions={...Ms.shadowRootOptions,delegatesFocus:!0},W.css=[Ps,_s,gs],H([A(`.button`)],W.prototype,`button`,2),H([A(`slot:not([name])`)],W.prototype,`labelSlot`,2),H([k()],W.prototype,`invalid`,2),H([k()],W.prototype,`isIconButton`,2),H([O()],W.prototype,`title`,2),H([O({reflect:!0})],W.prototype,`variant`,2),H([O({reflect:!0})],W.prototype,`appearance`,2),H([O({reflect:!0})],W.prototype,`size`,2),H([vs(`size`)],W.prototype,`handleSizeChange`,1),H([O({attribute:`with-caret`,type:Boolean,reflect:!0})],W.prototype,`withCaret`,2),H([O({attribute:`with-start`,type:Boolean})],W.prototype,`withStart`,2),H([O({attribute:`with-end`,type:Boolean})],W.prototype,`withEnd`,2),H([O({type:Boolean})],W.prototype,`disabled`,2),H([O({type:Boolean,reflect:!0})],W.prototype,`loading`,2),H([O({type:Boolean,reflect:!0})],W.prototype,`pill`,2),H([O()],W.prototype,`type`,2),H([O({reflect:!0})],W.prototype,`name`,2),H([O({reflect:!0})],W.prototype,`value`,2),H([O({reflect:!0})],W.prototype,`href`,2),H([O()],W.prototype,`target`,2),H([O()],W.prototype,`rel`,2),H([O()],W.prototype,`download`,2),H([O({attribute:`formaction`})],W.prototype,`formAction`,2),H([O({attribute:`formenctype`})],W.prototype,`formEnctype`,2),H([O({attribute:`formmethod`})],W.prototype,`formMethod`,2),H([O({attribute:`formnovalidate`,type:Boolean})],W.prototype,`formNoValidate`,2),H([O({attribute:`formtarget`})],W.prototype,`formTarget`,2),H([vs(`disabled`,{waitUntilFirstUpdate:!0})],W.prototype,`handleDisabledChange`,1),H([vs(`href`)],W.prototype,`handleHrefChange`,1),H([vs(`loading`,{waitUntilFirstUpdate:!0})],W.prototype,`handleLoadingChange`,1),W=H([D(`wa-button`)],W),W.disableWarning?.(`change-in-update`);var Fs=x`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;
    --size: 1em;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track,
  .indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) / 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
    r: var(--radius);
    fill: none;
    stroke-width: var(--track-width);
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: calc(0.597 * var(--circumference)), calc(0.796 * var(--circumference));
    stroke-dashoffset: calc(-0.04 * var(--circumference));
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: calc(0.008 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.278 * var(--circumference));
    }
    100% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.987 * var(--circumference));
    }
  }
`,Is=class extends ws{constructor(){super(...arguments),this.localize=new Ds(this)}render(){return S`
      <svg
        part="base spinner"
        role="progressbar"
        aria-label=${this.localize.term(`loading`)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `}};Is.css=Fs,Is=H([D(`wa-spinner`)],Is);var Ls=class extends Event{constructor(){super(`wa-error`,{bubbles:!0,cancelable:!1,composed:!0})}},Rs=class extends Event{constructor(){super(`wa-load`,{bubbles:!0,cancelable:!1,composed:!0})}},zs=x`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* #region Canvas — the box the icon is centered within (mirrors Font Awesome's icon canvas). Orthogonal to font-size. */

  /* Fixed width (default): 1.25em × 1em (20 × 16px) */
  :host(:not([canvas])),
  :host([canvas='fixed']) {
    width: 1.25em;
    height: 1em;
    min-width: 1.25em; /* <-- this is what Safari respects for intrinsic */
    min-height: 1em;
  }

  /* Auto: hug the icon's width. \`auto-width\` is the deprecated alias for canvas="auto". */
  :host([canvas='auto']),
  :host([auto-width]:not([canvas])) {
    width: auto;
    height: 1em;
  }

  /* Square: 1.25em × 1.25em (20 × 20px) */
  :host([canvas='square']) {
    width: 1.25em;
    height: 1.25em;
    min-width: 1.25em;
    min-height: 1.25em;
  }

  /* Roomy: 1.5em × 1.5em (24 × 24px) */
  :host([canvas='roomy']) {
    width: 1.5em;
    height: 1.5em;
    min-width: 1.5em;
    min-height: 1.5em;
  }

  /* #endregion */

  svg {
    /* NOTE: Avoid setting fill here. A stylesheet rule beats SVG presentation attributes, breaking stroke-based
       libraries like Lucide (fill="none" stroke="currentColor") and attribute-based mutators (issue #1733). The default
       library applies fill="currentColor" in its mutator instead. */
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* #region Animations — ported from Font Awesome 7.3 (--fa-* props mapped to wa-icon's --* names) */

  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.5s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip-360']) {
    animation-name: flip-360;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.75s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  /* spin-reverse is FA's reverse modifier expressed as a standalone value; reverse any spin via --animation-direction: reverse */
  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap']) {
    animation-name: spin-snap;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-4']) {
    animation-name: spin-snap-4;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2.4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-8']) {
    animation-name: spin-snap-8;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='buzz']) {
    animation-name: buzz;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.6s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='wag']) {
    animation-name: wag;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: bottom center;
  }

  :host([animation='float']) {
    animation-name: float;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
    will-change: transform;
  }

  :host([animation='swing']) {
    animation-name: swing;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: top center;
  }

  :host([animation='jello']) {
    animation-name: jello;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='flip-360']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']),
    :host([animation='spin-snap']),
    :host([animation='spin-snap-4']),
    :host([animation='spin-snap-8']),
    :host([animation='buzz']),
    :host([animation='wag']),
    :host([animation='float']),
    :host([animation='swing']),
    :host([animation='jello']) {
      animation: none !important;
      transition: none !important;
    }
  }

  /* #endregion */

  /* #region Keyframes — ported verbatim from Font Awesome 7.3 */

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    45% {
      transform: scale(calc(1.22 * var(--beat-scale, 1.22)));
    }
    65% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    90% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
      /* No fallback by design (ported from FA 7.3): the first segment uses the user's --animation-timing or the CSS
         initial ease, while the explicit cubic-beziers on later stops drive the bounce physics. */
      animation-timing-function: var(--animation-timing);
    }
    14% {
      transform: scale(var(--bounce-start-scale-x, 1.06), var(--bounce-start-scale-y, 0.94))
        translateY(var(--bounce-anticipation, 3px));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    32% {
      transform: scale(var(--bounce-jump-scale-x, 0.94), var(--bounce-jump-scale-y, 1.12))
        translateY(calc(-1 * var(--bounce-height, 0.5em)));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    52% {
      transform: scale(1, 1) translateY(calc(-1 * var(--bounce-height, 0.5em) * 1.1));
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    70% {
      transform: scale(var(--bounce-land-scale-x, 1.06), var(--bounce-land-scale-y, 0.92)) translateY(0);
      animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
    }
    85% {
      transform: scale(0.98, 1.04) translateY(calc(-2px * var(--bounce-rebound, 1)));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    40% {
      opacity: var(--fade-opacity, 0.4);
      transform: scale(0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes beat-fade {
    0% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    25% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    45% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    65% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    35% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: linear;
    }
    65% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.5));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    92% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes flip-360 {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    50% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    80% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(35deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    20% {
      transform: rotate(-22deg) translateX(-1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    35% {
      transform: rotate(15deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    50% {
      transform: rotate(-9deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    65% {
      transform: rotate(5deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    78% {
      transform: rotate(-3deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    90% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    12% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    16.67% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    28.67% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    33.33% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    45.33% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    62% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    66.67% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    78.67% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    83.33% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    95.33% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-4 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    15% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    40% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    65% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    90% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-8 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    9% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    12.5% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    21.5% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    34% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    37.5% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    46.5% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    59% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    62.5% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    71.5% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    84% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    87.5% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    96.5% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes buzz {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
    }
    5% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.5deg);
    }
    10% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.5deg);
    }
    15% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.3deg);
    }
    20% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.3deg);
    }
    25% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.7)) rotate(0.2deg);
    }
    30% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
    }
    35% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.4)) rotate(0.1deg);
    }
    40% {
      transform: translateX(0) rotate(0deg);
    }
    100% {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes wag {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    12% {
      transform: rotate(var(--wag-angle, 12deg));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    24% {
      transform: rotate(2deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    36% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.85));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    48% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    58% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.6));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    15% {
      transform: translateY(calc(-0.4 * var(--float-height, 6px))) translateX(var(--float-drift, 1px))
        rotate(var(--float-tilt, 1deg)) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    35% {
      transform: translateY(calc(-1 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-stretch-x, 0.98), var(--float-stretch-y, 1.03));
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
    }
    50% {
      transform: translateY(calc(-0.92 * var(--float-height, 6px))) translateX(calc(-0.5 * var(--float-drift, 1px)))
        rotate(calc(-0.5 * var(--float-tilt, 1deg))) scale(0.995, 1.01);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    70% {
      transform: translateY(calc(-0.3 * var(--float-height, 6px))) translateX(calc(-1 * var(--float-drift, 1px)))
        rotate(calc(-1 * var(--float-tilt, 1deg))) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    90% {
      transform: translateY(calc(0.05 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(var(--swing-angle, 22deg));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    18% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.85));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    28% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.65));
      animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
    }
    38% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.45));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    56% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.1));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    64% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes jello {
    0% {
      transform: scale(1, 1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    12% {
      transform: scale(var(--jello-scale-x, 1.15), calc(2 - var(--jello-scale-x, 1.15)));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    24% {
      transform: scale(calc(2 - var(--jello-scale-y, 1.12)), var(--jello-scale-y, 1.12));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    36% {
      transform: scale(
        calc(1 + (var(--jello-scale-x, 1.15) - 1) * 0.5),
        calc(2 - (1 + (var(--jello-scale-x, 1.15) - 1) * 0.5))
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: scale(
        calc(2 - (1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)),
        calc(1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    58% {
      transform: scale(1.02, 0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  /* #endregion */
`,Bs=Symbol(),Vs=Symbol(),Hs,Us=new Map,G=class extends ws{constructor(){super(...arguments),this.svg=null,this.autoWidth=!1,this.swapOpacity=!1,this.label=``,this.library=`default`,this.rotate=0,this.resolveIcon=async(e,t)=>{let n;if(t?.spriteSheet){this.hasUpdated||await this.updateComplete,this.svg=S`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,await this.updateComplete;let n=this.shadowRoot.querySelector(`[part='svg']`);return typeof t.mutator==`function`&&t.mutator(n,this),this.svg}try{if(n=await fetch(e,{mode:`cors`}),!n.ok)return n.status===410?Bs:Vs}catch{return Vs}try{let e=document.createElement(`div`);e.innerHTML=await n.text();let t=e.firstElementChild;if(t?.tagName?.toLowerCase()!==`svg`)return Bs;Hs||=new DOMParser;let r=Hs.parseFromString(t.outerHTML,`text/html`).body.querySelector(`svg`);return r?(r.part.add(`svg`),document.adoptNode(r)):Bs}catch{return Bs}}}connectedCallback(){super.connectedCallback(),Xo(this)}firstUpdated(e){super.firstUpdated(e),this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`),this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Zo(this)}async getIconSource(){let e=Qo(this.library),t=this.family||ts();if(this.name&&e){let n=this.canvas===`auto`||this.autoWidth,r;try{r=await e.resolver(this.name,t,this.variant,n)}catch{r=void 0}return{url:r,fromLibrary:!0}}return{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label==`string`&&this.label.length>0?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,this.label),this.removeAttribute(`aria-hidden`)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`),this.setAttribute(`aria-hidden`,`true`))}async setIcon(){let{url:e,fromLibrary:t}=await this.getIconSource(),n=t?Qo(this.library):void 0;if(!e){this.svg=null;return}let r=Us.get(e);r||(r=this.resolveIcon(e,n),Us.set(e,r));let i=await r;if(i===Vs&&Us.delete(e),e===(await this.getIconSource()).url){if(Qn(i)){this.svg=i;return}switch(i){case Vs:case Bs:this.svg=null,this.dispatchEvent(new Ls);break;default:this.svg=i.cloneNode(!0),n?.mutator?.(this.svg,this),this.dispatchEvent(new Rs)}}}willUpdate(e){return this.style||this.setStyleProperty(`--rotate-angle`,`${this.rotate}deg`),super.willUpdate(e)}updated(e){super.updated(e);let t=Qo(this.library);this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`);let n=this.shadowRoot?.querySelector(`svg`);n&&t?.mutator?.(n,this)}render(){return this.hasUpdated?this.svg:S`<svg part="svg" width="16" height="16" viewBox="0 0 16 16"></svg>`}};G.css=zs,H([k()],G.prototype,`svg`,2),H([O({reflect:!0})],G.prototype,`name`,2),H([O({reflect:!0})],G.prototype,`family`,2),H([O({reflect:!0})],G.prototype,`variant`,2),H([O({reflect:!0})],G.prototype,`canvas`,2),H([O({attribute:`auto-width`,type:Boolean,reflect:!0})],G.prototype,`autoWidth`,2),H([O({attribute:`swap-opacity`,type:Boolean,reflect:!0})],G.prototype,`swapOpacity`,2),H([O()],G.prototype,`src`,2),H([O()],G.prototype,`label`,2),H([O({reflect:!0})],G.prototype,`library`,2),H([O({type:Number,reflect:!0})],G.prototype,`rotate`,2),H([O({type:String,reflect:!0})],G.prototype,`flip`,2),H([O({type:String,reflect:!0})],G.prototype,`animation`,2),H([vs(`label`)],G.prototype,`handleLabelChange`,1),H([vs([`family`,`name`,`library`,`variant`,`src`,`autoWidth`,`canvas`,`swapOpacity`],{waitUntilFirstUpdate:!0})],G.prototype,`setIcon`,1),G=H([D(`wa-icon`)],G);var Ws=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Gs={GET:`GET`,POST:`POST`,PUT:`PUT`,DELETE:`DEL`,PATCH:`PAT`,OPTIONS:`OPT`,HEAD:`HEAD`,TRACE:`TRC`,QUERY:`QRY`};function Ks(e){switch(e.toLowerCase()){case`get`:return`success`;case`post`:case`put`:case`query`:return`brand`;case`delete`:return`danger`;case`patch`:return`warning`;default:return`neutral`}}var qs=class extends U{constructor(){super(...arguments),this.method=`GET`,this.lower=!1,this.large=!1,this.tiny=!1,this.micro=!1,this.mode=``}render(){let e=this.method.toLowerCase();if(this.mode===`nav-naked`){let t=this.method.toUpperCase();return S`<span class="pp-http-method__naked ${e}">${Gs[t]??t}</span>`}let t=`medium`;this.large&&(t=`large`),(this.tiny||this.micro)&&(t=`small`);let n=`pp-http-method__tag ${t}${this.micro?` micro`:``} ${e}`;return S`<wa-tag variant=${Ks(this.method)} appearance="outlined" size=${t} class=${n}>${this.lower?e:this.method.toUpperCase()}</wa-tag>`}};Ws([O()],qs.prototype,`method`,void 0),Ws([O({type:Boolean})],qs.prototype,`lower`,void 0),Ws([O({type:Boolean})],qs.prototype,`large`,void 0),Ws([O({type:Boolean})],qs.prototype,`tiny`,void 0),Ws([O({type:Boolean})],qs.prototype,`micro`,void 0),Ws([O({reflect:!0})],qs.prototype,`mode`,void 0),qs=Ws([D(`pp-http-method`)],qs);var Js=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Ys=/\{([\w$.#/]+)\}/g,Xs=class extends U{constructor(){super(...arguments),this.path=`/`,this.nowrap=!1}render(){let e=[],t=0;for(let n of this.path.matchAll(Ys))e.push(this.withSlashes(this.path.slice(t,n.index))),e.push(S`<span class="bracket">{</span><span class="param">${n[1]}</span><span class="bracket">}</span>`),t=(n.index??0)+n[0].length;return e.push(this.withSlashes(this.path.slice(t))),this.nowrap?S`<div class="pp-render-operation-path__nowrap">${e}</div>`:S`${e}`}withSlashes(e){return S`${e.split(`/`).map((e,t)=>t===0?e:S`<span class="slash">/</span>${e}`)}`}};Js([O()],Xs.prototype,`path`,void 0),Js([O({type:Boolean})],Xs.prototype,`nowrap`,void 0),Xs=Js([D(`pp-render-operation-path`)],Xs);var Zs={document:`stars`,schema:`box`,schemas:`box`,types:`diagram-3`,mediaType:`code-slash`,xml:`code-slash`,header:`envelope`,headers:`envelope`,example:`chat-left-quote`,examples:`chat-left-quote`,encoding:`box-seam`,requestBody:`box-arrow-in-right`,requestBodies:`box-arrow-in-right`,parameter:`braces-asterisk`,parameters:`braces-asterisk`,serverVariable:`braces-asterisk`,query:`question-lg`,cookie:`cookie`,link:`link`,links:`link`,response:`box-arrow-left`,responses:`box-arrow-left`,operation:`gear-wide-connected`,operations:`gear-wide-connected`,securityScheme:`shield-lock`,securitySchemes:`shield-lock`,security:`shield-lock`,callback:`telephone-outbound`,callbacks:`telephone-outbound`,pathItem:`geo`,pathItems:`geo`,server:`hdd-network`,servers:`hdd-network`,paths:`compass`,components:`boxes`,contact:`person-circle`,license:`patch-check`,upload:`upload`,info:`info-square`,tag:`tag`,tags:`tags`,version:`award`,extensions:`plug`,extension:`plug`,webhook:`arrow-clockwise`,webhooks:`arrow-clockwise`,noExample:`exclamation-circle`,polymorphic:`diagram-3`,error:`x-square`,warning:`exclamation-triangle`,"rolodex-dir":`folder`,"rolodex-file":`journal-code`,js:`filetype-js`,php:`filetype-php`,py:`filetype-py`,html:`filetype-html`,md:`markdown`,java:`filetype-java`,externalDocs:`journals`,rb:`filetype-rb`,"expand-node":`node-plus`,"pov-mode":`binoculars`};function Qs(e){return e&&Zs[e]||`box`}var $s=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ec=class extends U{constructor(){super(...arguments),this.icon=``,this.size=`medium`,this.color=`primary`}render(){return S`<wa-icon name=${Qs(this.icon)} data-fresh=${this.icon} class="pp-model-icon__icon ${this.size} ${this.color}"></wa-icon>`}};$s([O()],ec.prototype,`icon`,void 0),$s([O()],ec.prototype,`size`,void 0),$s([O()],ec.prototype,`color`,void 0),ec=$s([D(`pp-model-icon`)],ec);var tc=x`
  :host {
    display: flex;
    position: relative;
    align-items: stretch;
    border-radius: var(--wa-panel-border-radius);
    background-color: var(--wa-color-fill-quiet, var(--wa-color-brand-fill-quiet));
    border-color: var(--wa-color-border-quiet, var(--wa-color-brand-border-quiet));
    border-style: var(--wa-panel-border-style);
    border-width: var(--wa-panel-border-width);
    color: var(--wa-color-text-normal);
    padding: 1em;
  }

  /* Appearance modifiers */
  :host([appearance~='plain']) {
    background-color: transparent;
    border-color: transparent;
  }

  :host([appearance~='outlined']) {
    background-color: transparent;
    border-color: var(--wa-color-border-loud, var(--wa-color-brand-border-loud));
  }

  :host([appearance~='filled']) {
    background-color: var(--wa-color-fill-quiet, var(--wa-color-brand-fill-quiet));
    border-color: transparent;
  }

  :host([appearance~='filled-outlined']) {
    border-color: var(--wa-color-border-quiet, var(--wa-color-brand-border-quiet));
  }

  :host([appearance~='accent']) {
    color: var(--wa-color-on-loud, var(--wa-color-brand-on-loud));
    background-color: var(--wa-color-fill-loud, var(--wa-color-brand-fill-loud));
    border-color: transparent;

    [part~='icon'] {
      color: currentColor;
    }
  }

  [part~='icon'] {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--wa-color-on-quiet);
    font-size: 1.25em;
  }

  ::slotted([slot='icon']) {
    margin-inline-end: var(--wa-form-control-padding-inline);
  }

  [part~='message'] {
    flex: 1 1 auto;
    display: block;
    overflow: hidden;
  }
`,nc=class extends ws{constructor(){super(...arguments),this.variant=`brand`,this.size=`m`}handleSizeChange(){hs(this.localName,this.size)}render(){return S`
      <div part="icon">
        <slot name="icon"></slot>
      </div>

      <div part="message">
        <slot></slot>
      </div>
    `}};nc.css=[tc,_s,gs],H([O({reflect:!0})],nc.prototype,`variant`,2),H([O({reflect:!0})],nc.prototype,`appearance`,2),H([O({reflect:!0})],nc.prototype,`size`,2),H([vs(`size`)],nc.prototype,`handleSizeChange`,1),nc=H([D(`wa-callout`)],nc);var rc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},ic={context:`braces-asterisk`,info:`info-square`,warning:`exclamation-triangle`,error:`exclamation-square`,success:`check-square`,question:`question-square`},ac={context:`neutral`,info:`brand`,warning:`warning`,error:`danger`,success:`success`,question:`neutral`},oc=class extends U{constructor(){super(...arguments),this.type=`context`,this.headerText=``}render(){let e=this.type===`danger`?`error`:ic[this.type]?this.type:`context`;return S`<div class="pp-attention-box__frame ${e}">
            <wa-callout variant=${ac[e]} appearance="outlined" class=${e}>
                <wa-icon slot="icon" name=${ic[e]} class=${this.headerText?``:`noheader`}></wa-icon>
                ${this.headerText?S`<strong>${this.headerText}</strong>`:C}
                ${this.slotted()}
            </wa-callout>
        </div>`}};rc([O()],oc.prototype,`type`,void 0),rc([O()],oc.prototype,`headerText`,void 0),oc=rc([D(`pp-attention-box`)],oc);var sc=class extends ws{constructor(){super(...arguments),this.localize=new Ds(this),this.value=0,this.type=`decimal`,this.withoutGrouping=!1,this.currency=`USD`,this.currencyDisplay=`symbol`}static get styles(){return[]}render(){return isNaN(this.value)?``:this.localize.number(this.value,{style:this.type,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:!this.withoutGrouping,minimumIntegerDigits:this.minimumIntegerDigits,minimumFractionDigits:this.minimumFractionDigits,maximumFractionDigits:this.maximumFractionDigits,minimumSignificantDigits:this.minimumSignificantDigits,maximumSignificantDigits:this.maximumSignificantDigits})}};H([O({type:Number})],sc.prototype,`value`,2),H([O()],sc.prototype,`type`,2),H([O({attribute:`without-grouping`,type:Boolean})],sc.prototype,`withoutGrouping`,2),H([O()],sc.prototype,`currency`,2),H([O({attribute:`currency-display`})],sc.prototype,`currencyDisplay`,2),H([O({attribute:`minimum-integer-digits`,type:Number})],sc.prototype,`minimumIntegerDigits`,2),H([O({attribute:`minimum-fraction-digits`,type:Number})],sc.prototype,`minimumFractionDigits`,2),H([O({attribute:`maximum-fraction-digits`,type:Number})],sc.prototype,`maximumFractionDigits`,2),H([O({attribute:`minimum-significant-digits`,type:Number})],sc.prototype,`minimumSignificantDigits`,2),H([O({attribute:`maximum-significant-digits`,type:Number})],sc.prototype,`maximumSignificantDigits`,2),sc=H([D(`wa-format-number`)],sc);var cc=`paginatorFirstPage`,lc=`paginatorLastPage`,uc=`paginatorNextPage`,dc=`paginatorPreviousPage`,fc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},pc=class extends U{constructor(){super(...arguments),this.currentPage=1,this.totalPages=0,this.totalItems=0,this.itemsPerPage=20,this.label=`Problems`}rangeStart(){return Math.max(0,this.currentPage*this.itemsPerPage-this.itemsPerPage)}rangeEnd(){return Math.max(0,Math.min(this.rangeStart()+this.itemsPerPage,this.totalItems))}send(e,t){t&&this.dispatchEvent(new CustomEvent(e,{composed:!0}))}render(){if(this.totalItems===0)return C;let e=this.currentPage<=1,t=this.currentPage>=this.totalPages;return S`<div class="pp-paginator__bar${this.totalItems<=this.itemsPerPage?` hide`:``}">
            <div>
                <wa-button appearance="plain" size="small" class="home" title="first page" ?disabled=${e} @click=${()=>this.send(cc,!e)}><wa-icon name="chevron-double-left" label="First page"></wa-icon></wa-button>
                <wa-button appearance="plain" size="small" class="previous" title="previous page" ?disabled=${e} @click=${()=>this.send(dc,!e)}><wa-icon name="chevron-left" label="Previous page"></wa-icon></wa-button>
            </div>
            <div class="location" aria-current="page">Page <strong class="current-page">${this.currentPage}</strong> of <strong class="total-pages">${this.totalPages}</strong></div>
            <div class="result-range">${this.label} ${this.rangeStart()+1} - ${this.rangeEnd()} of <strong class="total"><wa-format-number value=${this.totalItems}></wa-format-number></strong></div>
            <div>
                <wa-button appearance="plain" size="small" class="next" title="next page" ?disabled=${t} @click=${()=>this.send(uc,!t)}><wa-icon name="chevron-right" label="Next page"></wa-icon></wa-button>
                <wa-button appearance="plain" size="small" class="end" title="last page" ?disabled=${t} @click=${()=>this.send(lc,!t)}><wa-icon name="chevron-double-right" label="Last page"></wa-icon></wa-button>
            </div>
        </div>`}};fc([O({type:Number})],pc.prototype,`currentPage`,void 0),fc([O({type:Number})],pc.prototype,`totalPages`,void 0),fc([O({type:Number})],pc.prototype,`totalItems`,void 0),fc([O({type:Number})],pc.prototype,`itemsPerPage`,void 0),fc([O()],pc.prototype,`label`,void 0),pc=fc([D(`pp-paginator`)],pc);var mc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},hc=class extends U{constructor(){super(...arguments),this.values=[],this.currentPage=1,this.itemsPerPage=20,this.label=``}get totalPages(){return Math.ceil((this.values?.length??0)/this.itemsPerPage)}willUpdate(){this.currentPage>this.totalPages&&(this.currentPage=Math.max(1,this.totalPages))}go(e){this.currentPage=Math.min(Math.max(1,e),Math.max(1,this.totalPages))}render(){let e=this.values??[];if(e.length===0)return S`<div class="no-values"></div>`;let t=(this.currentPage-1)*this.itemsPerPage;return S`<pp-paginator
                .currentPage=${this.currentPage}
                .totalPages=${this.totalPages}
                .totalItems=${e.length}
                .itemsPerPage=${this.itemsPerPage}
                label=${this.label||C}
                @paginatorFirstPage=${()=>this.go(1)}
                @paginatorPreviousPage=${()=>this.go(this.currentPage-1)}
                @paginatorNextPage=${()=>this.go(this.currentPage+1)}
                @paginatorLastPage=${()=>this.go(this.totalPages)}></pp-paginator>
            <div class="pp-paginated-list__values">${e.slice(t,t+this.itemsPerPage)}</div>`}};mc([O({attribute:!1})],hc.prototype,`values`,void 0),mc([O({type:Number})],hc.prototype,`currentPage`,void 0),mc([O({type:Number})],hc.prototype,`itemsPerPage`,void 0),mc([O()],hc.prototype,`label`,void 0),hc=mc([D(`pp-paginated-list`)],hc);var gc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},_c=class extends U{constructor(){super(...arguments),this.command=``}connectedCallback(){super.connectedCallback(),this.command||=this.authoredText()}copy(){navigator.clipboard?.writeText(this.command.trim())}render(){return S`<wa-button class="pp-terminal-example__copy" appearance="outlined" size="small" @click=${this.copy}>copy</wa-button><pre>${this.command}</pre>`}};gc([O()],_c.prototype,`command`,void 0),_c=gc([D(`pp-terminal-example`)],_c);var vc=x`
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
    }`,yc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},bc=class extends dn{constructor(){super(),this.name=`pb33f`,this.url=`https://pb33f.io`,this.wide=!1,this.fluid=!1}render(){return S`
            <header class="pb33f-header">
                <div class="logo ${this.fluid?`fluid`:this.wide?`wide`:``}">
                    <span class="caret">$</span>
                    <span class="name"><a href="${this.url}">${this.name}</a></span>
                </div>
                <div class="header-space">
                    <slot></slot>
                </div>
            </header>`}};bc.styles=vc,yc([O()],bc.prototype,`name`,void 0),yc([O()],bc.prototype,`url`,void 0),yc([O({type:Boolean})],bc.prototype,`wide`,void 0),yc([O({type:Boolean})],bc.prototype,`fluid`,void 0),bc=yc([D(`pb33f-header`)],bc);var xc=x`

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

`,Sc=x`
    
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
 `,Cc=`pb33f-theme-change`,wc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Tc=`tektronix`,Ec=`pb33f-theme`,Dc=`pb33f-base-theme`,Oc=class extends dn{constructor(){super(...arguments),this.baseTheme=`dark`,this.tektronixActive=!1}get activeTheme(){return this.tektronixActive?Tc:this.baseTheme}connectedCallback(){super.connectedCallback();let e=localStorage.getItem(Ec);e===`tektronix`?(this.tektronixActive=!0,this.baseTheme=localStorage.getItem(Dc)===`light`?`light`:`dark`):(this.tektronixActive=!1,this.baseTheme=e===`light`?`light`:`dark`),this.applyTheme()}applyTheme(){let e=this.activeTheme;localStorage.setItem(Ec,e),localStorage.setItem(Dc,this.baseTheme);let t=document.querySelector(`html`);t&&(t.setAttribute(`theme`,e),e===`light`?t.classList.remove(`sl-theme-dark`):t.classList.add(`sl-theme-dark`))}dispatchThemeChange(){window.dispatchEvent(new CustomEvent(Cc,{detail:{theme:this.activeTheme}}))}toggleTheme(){this.baseTheme=this.baseTheme===`dark`?`light`:`dark`,this.tektronixActive&&=!1,this.applyTheme(),this.dispatchThemeChange()}toggleTektronix(){this.tektronixActive=!this.tektronixActive,this.applyTheme(),this.dispatchThemeChange()}render(){let e=this.baseTheme===`dark`?`sun`:`moon`,t=this.baseTheme===`dark`?`Switch to Roger Mode (light)`:`Switch to PB33F Mode (dark)`,n=this.tektronixActive?`Disable Tektronix 4010 Mode`:`Enable Tektronix 4010 Mode`;return S`
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
        `}};Oc.styles=[xc,Sc],wc([k()],Oc.prototype,`baseTheme`,void 0),wc([k()],Oc.prototype,`tektronixActive`,void 0),Oc=wc([D(`pb33f-theme-switcher`)],Oc);var kc=x`
    footer {
        padding: var(--footer-padding);
        width: 100vw;
        font-size: var(--footer-font-size);
        height: var(--footer-height);
        position: fixed;
        bottom: 0;
        background-color: var(--background-color);
        z-index: 10;
        border-top: 1px dashed var(--secondary-color);
    }

    :host([fluid]) footer {
        position: static;
        width: 100%;
        z-index: auto;
    }

    footer > .generated-timestamp {
        float: right;
        margin-right: 15px;
        font-weight: normal;
        color: var(--font-color-sub2);
    }
`,Ac=x`
   a {
         color: var(--primary-color);
         text-decoration: none;
   }
    a:hover {
        color: var(--primary-color);
        text-decoration: underline;
    }
    a:visited {
        color: var(--primary-color);
    }
    a:active {
        color: var(--primary-color);
    }
`,jc=function(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a},Mc=class extends dn{constructor(){super(),this.url=`https://pb33f.io`,this.build=``,this.fluid=!1}render(){return S`
            <footer>
                &copy;${new Date().getFullYear()} <a href="${this.url}">princess b33f heavy industries</a>
                <span class="generated-timestamp">${this.build}</span>
            </footer>`}};Mc.styles=[kc,Ac],jc([O()],Mc.prototype,`build`,void 0),jc([O()],Mc.prototype,`url`,void 0),jc([O({type:Boolean,reflect:!0})],Mc.prototype,`fluid`,void 0),Mc=jc([D(`pb33f-footer`)],Mc);var Nc=/^[a-zA-Z][a-zA-Z\d+.-]*:/;function Pc(e){return!e||e.startsWith(`/`)||e.startsWith(`#`)||e.startsWith(`data:`)||Nc.test(e)}function Fc(){let e=document.body?.dataset.ppBaseUrl;if(!e)return document.baseURI;try{return new URL(e,window.location.href).toString()}catch{return document.baseURI}}function Ic(e){if(Pc(e))return e;try{return new URL(e,Fc()).toString()}catch{return e}}function Lc(){let e=document.body?.dataset.ppOverviewHref;return Ic(e||`index.html`)}function Rc(){let e=document.body?.dataset.ppCatalogHref;return e?Ic(e):Lc()}function zc(e){return Ic(`operations/${e}.html`)}function Bc(e,t){return Ic(`models/${e}/${t}.html`)}function Vc(e){return typeof e==`string`&&e.trim()!==``}function Hc(e){if(typeof e!=`string`)return e;if(e.trim()===``)return[];try{return JSON.parse(e)}catch{return[]}}function Uc(e,t){if(!Array.isArray(e))return[];let n=e.flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e;return!Vc(t.label)||!Vc(t.href)?[]:[{label:t.label,href:t.href,active:t.active===!0}]});if(!n.length)return n;let r=n.findIndex(e=>e.active);return r<0&&t&&(r=n.findIndex(e=>e.label===t)),r<0&&(r=0),n.map((e,t)=>({...e,active:t===r}))}function Wc(e){let t=Hc(e);return Array.isArray(t)?t.flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e;if(!Vc(t.role)||!Vc(t.label)||!Array.isArray(t.contracts))return[];let n=t.contracts.flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e;if(!Vc(t.id)||!Vc(t.label)||!Vc(t.specKind)||!Vc(t.href))return[];let n=Vc(t.currentVersion)?t.currentVersion:void 0,r=Uc(t.versions,n),i=r.find(e=>e.active);return[{id:t.id,label:t.label,specKind:t.specKind,href:t.href,active:t.active===!0,currentVersion:i?.label??n,versions:r}]});return n.length?[{role:t.role,label:t.label,contracts:n}]:[]}):[]}function Gc(e){let t=Wc(e),n=t.reduce((e,t)=>e+t.contracts.length,0),r=t.reduce((e,t)=>e+t.contracts.filter(e=>e.active).length,0);return n>1&&r===1?t:[]}var Kc=x`
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
`,qc=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.open=!1,this.placement=`bottom-start`,this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=0,this.skidding=0,this.hoist=!1,this.sync=void 0,this.handleKeyDown=e=>{this.open&&e.key===`Escape`&&(e.stopPropagation(),this.hide(),this.focusOnTrigger())},this.handleDocumentKeyDown=e=>{if(e.key===`Escape`&&this.open&&!this.closeWatcher){e.stopPropagation(),this.focusOnTrigger(),this.hide();return}if(e.key===`Tab`){if(this.open&&document.activeElement?.tagName.toLowerCase()===`sl-menu-item`){e.preventDefault(),this.hide(),this.focusOnTrigger();return}let t=(e,n)=>{if(!e)return null;let r=e.closest(n);if(r)return r;let i=e.getRootNode();return i instanceof ShadowRoot?t(i.host,n):null};setTimeout(()=>{let e=this.containingElement?.getRootNode()instanceof ShadowRoot?Va():document.activeElement;(!this.containingElement||t(e,this.containingElement.tagName.toLowerCase())!==this.containingElement)&&this.hide()})}},this.handleDocumentMouseDown=e=>{let t=e.composedPath();this.containingElement&&!t.includes(this.containingElement)&&this.hide()},this.handlePanelSelect=e=>{let t=e.target;!this.stayOpenOnSelect&&t.tagName.toLowerCase()===`sl-menu`&&(this.hide(),this.focusOnTrigger())}}connectedCallback(){super.connectedCallback(),this.containingElement||=this}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let e=this.trigger.assignedElements({flatten:!0})[0];typeof e?.focus==`function`&&e.focus()}getMenu(){return this.panel.assignedElements({flatten:!0}).find(e=>e.tagName.toLowerCase()===`sl-menu`)}handleTriggerClick(){this.open?this.hide():(this.show(),this.focusOnTrigger())}async handleTriggerKeyDown(e){if([` `,`Enter`].includes(e.key)){e.preventDefault(),this.handleTriggerClick();return}let t=this.getMenu();if(t){let n=t.getAllItems(),r=n[0],i=n[n.length-1];[`ArrowDown`,`ArrowUp`,`Home`,`End`].includes(e.key)&&(e.preventDefault(),this.open||(this.show(),await this.updateComplete),n.length>0&&this.updateComplete.then(()=>{(e.key===`ArrowDown`||e.key===`Home`)&&(t.setCurrentItem(r),r.focus()),(e.key===`ArrowUp`||e.key===`End`)&&(t.setCurrentItem(i),i.focus())}))}}handleTriggerKeyUp(e){e.key===` `&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let e=this.trigger.assignedElements({flatten:!0}).find(e=>qa(e).start),t;if(e){switch(e.tagName.toLowerCase()){case`sl-button`:case`sl-icon-button`:t=e.button;break;default:t=e}t.setAttribute(`aria-haspopup`,`true`),t.setAttribute(`aria-expanded`,this.open?`true`:`false`)}}async show(){if(!this.open)return this.open=!0,ka(this,`sl-after-show`)}async hide(){if(this.open)return this.open=!1,ka(this,`sl-after-hide`)}reposition(){this.popup.reposition()}addOpenListeners(){var e;this.panel.addEventListener(`sl-select`,this.handlePanelSelect),`CloseWatcher`in window?((e=this.closeWatcher)==null||e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide(),this.focusOnTrigger()}):this.panel.addEventListener(`keydown`,this.handleKeyDown),document.addEventListener(`keydown`,this.handleDocumentKeyDown),document.addEventListener(`mousedown`,this.handleDocumentMouseDown)}removeOpenListeners(){var e;this.panel&&(this.panel.removeEventListener(`sl-select`,this.handlePanelSelect),this.panel.removeEventListener(`keydown`,this.handleKeyDown)),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`mousedown`,this.handleDocumentMouseDown),(e=this.closeWatcher)==null||e.destroy()}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){this.emit(`sl-show`),this.addOpenListeners(),await Ma(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:e,options:t}=R(this,`dropdown.show`,{dir:this.localize.dir()});await z(this.popup.popup,e,t),this.emit(`sl-after-show`)}else{this.emit(`sl-hide`),this.removeOpenListeners(),await Ma(this);let{keyframes:e,options:t}=R(this,`dropdown.hide`,{dir:this.localize.dir()});await z(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,this.emit(`sl-after-hide`)}}render(){return S`
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
        sync=${N(this.sync?this.sync:void 0)}
        class=${M({dropdown:!0,"dropdown--open":this.open})}
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
    `}};qc.styles=[E,Kc],qc.dependencies={"sl-popup":I},w([A(`.dropdown`)],qc.prototype,`popup`,2),w([A(`.dropdown__trigger`)],qc.prototype,`trigger`,2),w([A(`.dropdown__panel`)],qc.prototype,`panel`,2),w([O({type:Boolean,reflect:!0})],qc.prototype,`open`,2),w([O({reflect:!0})],qc.prototype,`placement`,2),w([O({type:Boolean,reflect:!0})],qc.prototype,`disabled`,2),w([O({attribute:`stay-open-on-select`,type:Boolean,reflect:!0})],qc.prototype,`stayOpenOnSelect`,2),w([O({attribute:!1})],qc.prototype,`containingElement`,2),w([O({type:Number})],qc.prototype,`distance`,2),w([O({type:Number})],qc.prototype,`skidding`,2),w([O({type:Boolean})],qc.prototype,`hoist`,2),w([O({reflect:!0})],qc.prototype,`sync`,2),w([T(`open`,{waitUntilFirstUpdate:!0})],qc.prototype,`handleOpenChange`,1),L(`dropdown.show`,{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:`ease`}}),L(`dropdown.hide`,{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:`ease`}}),qc.define(`sl-dropdown`);var Jc=x`
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
`,Yc=class extends j{connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`menu`)}handleClick(e){let t=[`menuitem`,`menuitemcheckbox`],n=e.composedPath(),r=n.find(e=>t.includes((e?.getAttribute)?.call(e,`role`)||``));if(!r||n.find(e=>(e?.getAttribute)?.call(e,`role`)===`menu`)!==this)return;let i=r;i.type===`checkbox`&&(i.checked=!i.checked),this.emit(`sl-select`,{detail:{item:i}})}handleKeyDown(e){if(e.key===`Enter`||e.key===` `){let t=this.getCurrentItem();e.preventDefault(),e.stopPropagation(),t?.click()}else if([`ArrowDown`,`ArrowUp`,`Home`,`End`].includes(e.key)){let t=this.getAllItems(),n=this.getCurrentItem(),r=n?t.indexOf(n):0;t.length>0&&(e.preventDefault(),e.stopPropagation(),e.key===`ArrowDown`?r++:e.key===`ArrowUp`?r--:e.key===`Home`?r=0:e.key===`End`&&(r=t.length-1),r<0&&(r=t.length-1),r>t.length-1&&(r=0),this.setCurrentItem(t[r]),t[r].focus())}}handleMouseDown(e){let t=e.target;this.isMenuItem(t)&&this.setCurrentItem(t)}handleSlotChange(){let e=this.getAllItems();e.length>0&&this.setCurrentItem(e[0])}isMenuItem(e){return e.tagName.toLowerCase()===`sl-menu-item`||[`menuitem`,`menuitemcheckbox`,`menuitemradio`].includes(e.getAttribute(`role`)??``)}getAllItems(){return[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>!(e.inert||!this.isMenuItem(e)))}getCurrentItem(){return this.getAllItems().find(e=>e.getAttribute(`tabindex`)===`0`)}setCurrentItem(e){this.getAllItems().forEach(t=>{t.setAttribute(`tabindex`,t===e?`0`:`-1`)})}render(){return S`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `}};Yc.styles=[E,Jc],w([A(`slot`)],Yc.prototype,`defaultSlot`,2),Yc.define(`sl-menu`);var Xc=x`
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
`,Zc=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),Zc(e,t);return!0},Qc=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},$c=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),nl(t)}};function el(e){this._$AN===void 0?this._$AM=e:(Qc(this),this._$AM=e,$c(this))}function tl(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)Zc(r[e],!1),Qc(r[e]);else r!=null&&(Zc(r,!1),Qc(r));else Zc(this,e)}var nl=e=>{e.type==sr.CHILD&&(e._$AP??=tl,e._$AQ??=el)},rl=class extends lr{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),$c(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Zc(this,e),Qc(this))}setValue(e){if($n(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},il=()=>new al,al=class{},ol=new WeakMap,sl=cr(class extends rl{render(e){return C}update(e,[t]){let n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),C}rt(e){if(this.isConnected||(e=void 0),typeof this.G==`function`){let t=this.ht??globalThis,n=ol.get(t);n===void 0&&(n=new WeakMap,ol.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G==`function`?ol.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),cl=class{constructor(e,t){this.popupRef=il(),this.enableSubmenuTimer=-1,this.isConnected=!1,this.isPopupConnected=!1,this.skidding=0,this.submenuOpenDelay=100,this.handleMouseMove=e=>{this.host.style.setProperty(`--safe-triangle-cursor-x`,`${e.clientX}px`),this.host.style.setProperty(`--safe-triangle-cursor-y`,`${e.clientY}px`)},this.handleMouseOver=()=>{this.hasSlotController.test(`submenu`)&&this.enableSubmenu()},this.handleKeyDown=e=>{switch(e.key){case`Escape`:case`Tab`:this.disableSubmenu();break;case`ArrowLeft`:e.target!==this.host&&(e.preventDefault(),e.stopPropagation(),this.host.focus(),this.disableSubmenu());break;case`ArrowRight`:case`Enter`:case` `:this.handleSubmenuEntry(e);break;default:break}},this.handleClick=e=>{e.target===this.host?(e.preventDefault(),e.stopPropagation()):e.target instanceof Element&&(e.target.tagName===`sl-menu-item`||e.target.role?.startsWith(`menuitem`))&&this.disableSubmenu()},this.handleFocusOut=e=>{e.relatedTarget&&e.relatedTarget instanceof Element&&this.host.contains(e.relatedTarget)||this.disableSubmenu()},this.handlePopupMouseover=e=>{e.stopPropagation()},this.handlePopupReposition=()=>{let e=this.host.renderRoot.querySelector(`slot[name='submenu']`)?.assignedElements({flatten:!0}).filter(e=>e.localName===`sl-menu`)[0],t=getComputedStyle(this.host).direction===`rtl`;if(!e)return;let{left:n,top:r,width:i,height:a}=e.getBoundingClientRect();this.host.style.setProperty(`--safe-triangle-submenu-start-x`,`${t?n+i:n}px`),this.host.style.setProperty(`--safe-triangle-submenu-start-y`,`${r}px`),this.host.style.setProperty(`--safe-triangle-submenu-end-x`,`${t?n+i:n}px`),this.host.style.setProperty(`--safe-triangle-submenu-end-y`,`${r+a}px`)},(this.host=e).addController(this),this.hasSlotController=t}hostConnected(){this.hasSlotController.test(`submenu`)&&!this.host.disabled&&this.addListeners()}hostDisconnected(){this.removeListeners()}hostUpdated(){this.hasSlotController.test(`submenu`)&&!this.host.disabled?(this.addListeners(),this.updateSkidding()):this.removeListeners()}addListeners(){this.isConnected||=(this.host.addEventListener(`mousemove`,this.handleMouseMove),this.host.addEventListener(`mouseover`,this.handleMouseOver),this.host.addEventListener(`keydown`,this.handleKeyDown),this.host.addEventListener(`click`,this.handleClick),this.host.addEventListener(`focusout`,this.handleFocusOut),!0),this.isPopupConnected||this.popupRef.value&&(this.popupRef.value.addEventListener(`mouseover`,this.handlePopupMouseover),this.popupRef.value.addEventListener(`sl-reposition`,this.handlePopupReposition),this.isPopupConnected=!0)}removeListeners(){this.isConnected&&=(this.host.removeEventListener(`mousemove`,this.handleMouseMove),this.host.removeEventListener(`mouseover`,this.handleMouseOver),this.host.removeEventListener(`keydown`,this.handleKeyDown),this.host.removeEventListener(`click`,this.handleClick),this.host.removeEventListener(`focusout`,this.handleFocusOut),!1),this.isPopupConnected&&this.popupRef.value&&(this.popupRef.value.removeEventListener(`mouseover`,this.handlePopupMouseover),this.popupRef.value.removeEventListener(`sl-reposition`,this.handlePopupReposition),this.isPopupConnected=!1)}handleSubmenuEntry(e){let t=this.host.renderRoot.querySelector(`slot[name='submenu']`);if(!t){console.error(`Cannot activate a submenu if no corresponding menuitem can be found.`,this);return}let n=null;for(let e of t.assignedElements())if(n=e.querySelectorAll(`sl-menu-item, [role^='menuitem']`),n.length!==0)break;if(!(!n||n.length===0)){n[0].setAttribute(`tabindex`,`0`);for(let e=1;e!==n.length;++e)n[e].setAttribute(`tabindex`,`-1`);this.popupRef.value&&(e.preventDefault(),e.stopPropagation(),this.popupRef.value.active?n[0]instanceof HTMLElement&&n[0].focus():(this.enableSubmenu(!1),this.host.updateComplete.then(()=>{n[0]instanceof HTMLElement&&n[0].focus()}),this.host.requestUpdate()))}}setSubmenuState(e){this.popupRef.value&&this.popupRef.value.active!==e&&(this.popupRef.value.active=e,this.host.requestUpdate())}enableSubmenu(e=!0){e?(window.clearTimeout(this.enableSubmenuTimer),this.enableSubmenuTimer=window.setTimeout(()=>{this.setSubmenuState(!0)},this.submenuOpenDelay)):this.setSubmenuState(!0)}disableSubmenu(){window.clearTimeout(this.enableSubmenuTimer),this.setSubmenuState(!1)}updateSkidding(){if(!this.host.parentElement?.computedStyleMap)return;let e=this.host.parentElement.computedStyleMap();this.skidding=[`padding-top`,`border-top-width`,`margin-top`].reduce((t,n)=>{let r=e.get(n)??new CSSUnitValue(0,`px`);return t-(r instanceof CSSUnitValue?r:new CSSUnitValue(0,`px`)).to(`px`).value},0)}isExpanded(){return this.popupRef.value?this.popupRef.value.active:!1}renderSubmenu(){let e=getComputedStyle(this.host).direction===`rtl`;return this.isConnected?S`
      <sl-popup
        ${sl(this.popupRef)}
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
    `:S` <slot name="submenu" hidden></slot> `}},ll=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.type=`normal`,this.checked=!1,this.value=``,this.loading=!1,this.disabled=!1,this.hasSlotController=new oo(this,`submenu`),this.submenuController=new cl(this,this.hasSlotController),this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleMouseOver=e=>{this.focus(),e.stopPropagation()}}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this.handleHostClick),this.addEventListener(`mouseover`,this.handleMouseOver)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(`click`,this.handleHostClick),this.removeEventListener(`mouseover`,this.handleMouseOver)}handleDefaultSlotChange(){let e=this.getTextLabel();if(this.cachedTextLabel===void 0){this.cachedTextLabel=e;return}e!==this.cachedTextLabel&&(this.cachedTextLabel=e,this.emit(`slotchange`,{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!==`checkbox`){this.checked=!1,console.error(`The checked attribute can only be used on menu items with type="checkbox"`,this);return}this.type===`checkbox`?this.setAttribute(`aria-checked`,this.checked?`true`:`false`):this.removeAttribute(`aria-checked`)}handleDisabledChange(){this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`)}handleTypeChange(){this.type===`checkbox`?(this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`)):(this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`))}getTextLabel(){return so(this.defaultSlot)}isSubmenu(){return this.hasSlotController.test(`submenu`)}render(){let e=this.localize.dir()===`rtl`,t=this.submenuController.isExpanded();return S`
      <div
        id="anchor"
        part="base"
        class=${M({"menu-item":!0,"menu-item--rtl":e,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--loading":this.loading,"menu-item--has-submenu":this.isSubmenu(),"menu-item--submenu-expanded":t})}
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
        ${this.loading?S` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> `:``}
      </div>
    `}};ll.styles=[E,Xc],ll.dependencies={"sl-icon":or,"sl-popup":I,"sl-spinner":vo},w([A(`slot:not([name])`)],ll.prototype,`defaultSlot`,2),w([A(`.menu-item`)],ll.prototype,`menuItem`,2),w([O()],ll.prototype,`type`,2),w([O({type:Boolean,reflect:!0})],ll.prototype,`checked`,2),w([O()],ll.prototype,`value`,2),w([O({type:Boolean,reflect:!0})],ll.prototype,`loading`,2),w([O({type:Boolean,reflect:!0})],ll.prototype,`disabled`,2),w([T(`checked`)],ll.prototype,`handleCheckedChange`,1),w([T(`disabled`)],ll.prototype,`handleDisabledChange`,1),w([T(`type`)],ll.prototype,`handleTypeChange`,1),ll.define(`sl-menu-item`);function K(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var ul=`pp-split-position`,dl=20,fl=1,pl=`pb33f-theme`,ml=`pb33f-base-theme`,hl=`pb33f-theme-change`;function gl(e){try{return localStorage.getItem(e)}catch{return null}}function _l(e,t){try{localStorage.setItem(e,t)}catch{}}function vl(e,t){e.setAttribute(`label`,t),e.setAttribute(`title`,t),e.setAttribute(`aria-label`,t)}function yl(){try{let e=sessionStorage.getItem(ul);return xl(e?parseFloat(e):dl)}catch{return dl}}function bl(e){try{sessionStorage.setItem(ul,String(e))}catch{}}function xl(e){return!Number.isFinite(e)||e<fl||e>100?dl:e}function Sl(e){return Number.isFinite(e)?Math.min(100,Math.max(fl,e)):dl}var Cl=class extends U{constructor(...e){super(...e),this.title=``,this.splitPos=dl,this.currentVersion=``,this.versions=[],this.embedded=!1,this.splitPanel=null,this.splitDivider=null,this.splitHandle=null,this.handleSplitReposition=e=>this.onReposition(e),this.handleSplitHostPointerDown=e=>this.startHostPointerSplitDrag(e),this.handleSplitHostMouseDown=e=>this.startHostMouseSplitDrag(e),this.handleSplitPointerDown=e=>this.startPointerSplitDrag(e),this.handleSplitMouseDown=e=>this.startMouseSplitDrag(e),this.handleSplitTouchStart=e=>this.startTouchSplitDrag(e)}connectedCallback(){super.connectedCallback(),this.title=this.getAttribute(`data-title`)||document.title||`API Documentation`,this.currentVersion=document.body?.dataset.ppCurrentVersion||``,this.versions=this.parseVersions(document.body?.dataset.ppVersions),this.embedded=document.documentElement.hasAttribute(`data-pp-embedded-docs`)||document.body?.dataset.ppEmbeddedDocs===`true`,this.toggleAttribute(`embedded`,this.embedded),this.splitPos=yl()}disconnectedCallback(){this.splitPanel?.removeEventListener(`sl-reposition`,this.handleSplitReposition),this.splitPanel?.removeEventListener(`pointerdown`,this.handleSplitHostPointerDown),this.splitPanel?.removeEventListener(`mousedown`,this.handleSplitHostMouseDown),this.detachSplitDragTarget(this.splitDivider),this.detachSplitDragTarget(this.splitHandle),this.splitPanel=null,this.splitDivider=null,this.splitHandle=null,super.disconnectedCallback()}updated(){this.syncHeader(),this.syncThemeControls(),this.syncSplitPanel()}syncHeader(){let e=this.renderRoot?.querySelector(`.doc-logo-link`);e&&(e.href=Rc())}activeTheme(){let e=gl(pl);if(e===`light`||e===`tektronix`)return e;let t=document.documentElement.getAttribute(`theme`);return t===`light`||t===`tektronix`?t:`dark`}baseTheme(){let e=gl(ml);return e===`light`?`light`:e===`dark`?`dark`:this.activeTheme()===`light`?`light`:`dark`}applyTheme(e,t=this.baseTheme()){let n=e===`tektronix`?t:e;_l(pl,e),_l(ml,n),document.documentElement.setAttribute(`theme`,e),e===`light`?document.documentElement.classList.remove(`sl-theme-dark`):document.documentElement.classList.add(`sl-theme-dark`),window.dispatchEvent(new CustomEvent(hl,{detail:{theme:e}})),this.syncThemeControls()}toggleBaseTheme(){let e=this.baseTheme()===`dark`?`light`:`dark`;this.applyTheme(e,e)}toggleTektronix(){let e=this.baseTheme();this.applyTheme(this.activeTheme()===`tektronix`?e:`tektronix`,e)}syncThemeControls(){let e=this.renderRoot?.querySelector(`.theme-mode-toggle`),t=this.renderRoot?.querySelector(`.theme-tektronix-toggle`),n=this.baseTheme(),r=this.activeTheme();if(e){let t=n===`dark`?`Switch to Roger Mode (light)`:`Switch to PB33F Mode (dark)`;e.querySelector(`sl-icon`)?.setAttribute(`name`,n===`dark`?`sun`:`moon`),vl(e,t),e.onclick=()=>this.toggleBaseTheme()}t&&(vl(t,r===`tektronix`?`Disable Tektronix 4010 Mode`:`Enable Tektronix 4010 Mode`),t.classList.toggle(`tek-active`,r===`tektronix`),t.onclick=()=>this.toggleTektronix())}syncSplitPanel(){let e=this.renderRoot?.querySelector(`sl-split-panel`);e&&(this.splitPanel!==e&&(this.splitPanel?.removeEventListener(`sl-reposition`,this.handleSplitReposition),this.splitPanel?.removeEventListener(`pointerdown`,this.handleSplitHostPointerDown),this.splitPanel?.removeEventListener(`mousedown`,this.handleSplitHostMouseDown),e.addEventListener(`sl-reposition`,this.handleSplitReposition),e.addEventListener(`pointerdown`,this.handleSplitHostPointerDown),e.addEventListener(`mousedown`,this.handleSplitHostMouseDown),this.splitPanel=e),e.position!==this.splitPos&&(e.position=this.splitPos),e.getAttribute(`position`)!==String(this.splitPos)&&e.setAttribute(`position`,String(this.splitPos)),this.syncSplitDivider(e),e.updateComplete?.then(()=>this.syncSplitDivider(e)),this.syncSplitHandle())}syncSplitDivider(e){let t=e.shadowRoot?.querySelector(`.divider`);!t||this.splitDivider===t||(this.detachSplitDragTarget(this.splitDivider),this.attachSplitDragTarget(t),this.splitDivider=t)}syncSplitHandle(){let e=this.renderRoot?.querySelector(`sl-icon.divider-vert`);!e||this.splitHandle===e||(this.detachSplitDragTarget(this.splitHandle),this.attachSplitDragTarget(e),this.splitHandle=e)}attachSplitDragTarget(e){e.addEventListener(`pointerdown`,this.handleSplitPointerDown),e.addEventListener(`mousedown`,this.handleSplitMouseDown),e.addEventListener(`touchstart`,this.handleSplitTouchStart,{passive:!1}),e.setAttribute(`data-pp-resize-ready`,`true`)}detachSplitDragTarget(e){e?.removeEventListener(`pointerdown`,this.handleSplitPointerDown),e?.removeEventListener(`mousedown`,this.handleSplitMouseDown),e?.removeEventListener(`touchstart`,this.handleSplitTouchStart),e?.removeAttribute(`data-pp-resize-ready`)}isNearSplitDivider(e){let t=this.splitDivider?.getBoundingClientRect()||this.splitHandle?.getBoundingClientRect();return t?e>=t.left-8&&e<=t.right+8:!1}startHostPointerSplitDrag(e){this.isNearSplitDivider(e.clientX)&&this.startPointerSplitDrag(e)}startHostMouseSplitDrag(e){this.isNearSplitDivider(e.clientX)&&this.startMouseSplitDrag(e)}startPointerSplitDrag(e){if(e.button!==0)return;e.preventDefault(),e.stopPropagation(),e.currentTarget?.setPointerCapture?.(e.pointerId),this.setSplitPositionFromClientX(e.clientX);let t=e=>{e.preventDefault(),this.setSplitPositionFromClientX(e.clientX)},n=()=>{document.removeEventListener(`pointermove`,t),document.removeEventListener(`pointerup`,n),document.removeEventListener(`pointercancel`,n)};document.addEventListener(`pointermove`,t),document.addEventListener(`pointerup`,n),document.addEventListener(`pointercancel`,n)}startMouseSplitDrag(e){if(e.button!==0)return;e.preventDefault(),e.stopPropagation(),this.setSplitPositionFromClientX(e.clientX);let t=e=>{e.preventDefault(),this.setSplitPositionFromClientX(e.clientX)},n=()=>{document.removeEventListener(`mousemove`,t),document.removeEventListener(`mouseup`,n)};document.addEventListener(`mousemove`,t),document.addEventListener(`mouseup`,n)}startTouchSplitDrag(e){let t=e.touches[0];if(!t)return;e.preventDefault(),e.stopPropagation(),this.setSplitPositionFromClientX(t.clientX);let n=e=>{let t=e.touches[0];t&&(e.preventDefault(),this.setSplitPositionFromClientX(t.clientX))},r=()=>{document.removeEventListener(`touchmove`,n),document.removeEventListener(`touchend`,r),document.removeEventListener(`touchcancel`,r)};document.addEventListener(`touchmove`,n,{passive:!1}),document.addEventListener(`touchend`,r),document.addEventListener(`touchcancel`,r)}setSplitPositionFromClientX(e){if(!this.splitPanel)return;let t=this.splitPanel.getBoundingClientRect();if(t.width<=0)return;let n=Sl((e-t.left)/t.width*100);this.splitPos=n,this.splitPanel.position=n,this.splitPanel.setAttribute(`position`,String(n)),bl(n)}onReposition(e){if(e.target!==this.splitPanel)return;let t=Sl(e.target.position??dl);typeof t==`number`&&(this.splitPos=t,bl(t))}parseVersions(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!e&&typeof e.label==`string`&&typeof e.href==`string`):[]}catch{return[]}}hasMultiContractNavigation(){return Gc(document.body?.dataset.ppContracts).length>0}onVersionChange(e){let t=e.detail?.item;t?.value&&(window.location.href=t.value)}currentVersionLabel(){return this.versions.find(e=>e.active||e.label===this.currentVersion)?.label||this.currentVersion||this.versions[0]?.label||`Version`}currentVersionTriggerLabel(){return`Version: ${this.currentVersionLabel()}`}render(){return S`
      ${this.embedded?null:S`
        <header class="pp-doc-header">
          <div class="logo">
            <span class="caret">$</span>
            <span class="name"><a class="doc-logo-link">${this.title}</a></span>
          </div>
          <div class="header-space">
            <div class="header-tools">
              ${this.versions.length&&!this.hasMultiContractNavigation()?S`
                    <div class="header-context">
                      <div class="version-picker">
                        <sl-dropdown skidding="5" distance="5">
                          <sl-button slot="trigger" caret>${this.currentVersionTriggerLabel()}</sl-button>
                          <sl-menu @sl-select=${this.onVersionChange}>
                            ${this.versions.map(e=>S`
                                <sl-menu-item value=${Ic(e.href)}>
                                  ${e.label}
                                </sl-menu-item>
                              `)}
                          </sl-menu>
                        </sl-dropdown>
                      </div>
                    </div>
                  `:null}
              <div class="theme-controls">
                <button type="button" class="theme-icon-button theme-mode-toggle" aria-label="Toggle dark/light" title="Toggle dark/light">
                  <sl-icon name="sun" aria-hidden="true"></sl-icon>
                </button>
                <button type="button" class="theme-icon-button theme-tektronix-toggle" aria-label="Toggle Tektronix" title="Toggle Tektronix">
                  <sl-icon name="display" aria-hidden="true"></sl-icon>
                </button>
              </div>
            </div>
          </div>
        </header>
      `}
      <sl-split-panel position="20">
        <sl-icon slot="divider" name="grip-vertical" class="divider-vert" aria-hidden="true"></sl-icon>
        <div slot="start" class="nav-panel">
          ${this.slotted(`nav`)}
        </div>
        <div slot="end" class="content-panel">
          ${this.slotted(`content`)}
        </div>
      </sl-split-panel>
    `}};K([k()],Cl.prototype,`title`,void 0),K([k()],Cl.prototype,`splitPos`,void 0),K([k()],Cl.prototype,`currentVersion`,void 0),K([k()],Cl.prototype,`versions`,void 0),K([k()],Cl.prototype,`embedded`,void 0),Cl=K([D(`pp-layout`)],Cl);var wl=x`
  :host {
    display: inline-block;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 2px;
    background-color: var(--sl-input-background-color);
    color: var(--sl-color-neutral-0);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .checkbox__label::after {
    content: var(--sl-input-required-content);
    color: var(--sl-input-required-content-color);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`,Tl=(e=`value`)=>(t,n)=>{let r=t.constructor,i=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(t,a,o){let s=r.getPropertyOptions(e);if(t===(typeof s.attribute==`string`?s.attribute:e)){let t=s.converter||xt,r=(typeof t==`function`?t:t?.fromAttribute??xt.fromAttribute)(o,s.type);this[e]!==r&&(this[n]=r)}i.call(this,t,a,o)}},El=x`
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
`,Dl=cr(class extends lr{constructor(e){if(super(e),e.type!==sr.PROPERTY&&e.type!==sr.ATTRIBUTE&&e.type!==sr.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!$n(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===Kt||t===C)return t;let n=e.element,r=e.name;if(e.type===sr.PROPERTY){if(t===n[r])return Kt}else if(e.type===sr.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(r))return Kt}else if(e.type===sr.ATTRIBUTE&&n.getAttribute(r)===t+``)return Kt;return tr(e),t}}),q=class extends j{constructor(){super(...arguments),this.formControlController=new wo(this,{value:e=>e.checked?e.value||`on`:void 0,defaultValue:e=>e.defaultChecked,setValue:(e,t)=>e.checked=t}),this.hasSlotController=new oo(this,`help-text`),this.hasFocus=!1,this.title=``,this.name=``,this.size=`medium`,this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form=``,this.required=!1,this.helpText=``}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit(`sl-change`)}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleInput(){this.emit(`sl-input`)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){let e=this.hasSlotController.test(`help-text`),t=this.helpText?!0:!!e;return S`
      <div
        class=${M({"form-control":!0,"form-control--small":this.size===`small`,"form-control--medium":this.size===`medium`,"form-control--large":this.size===`large`,"form-control--has-help-text":t})}
      >
        <label
          part="base"
          class=${M({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":this.size===`small`,"checkbox--medium":this.size===`medium`,"checkbox--large":this.size===`large`})}
        >
          <input
            class="checkbox__input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${N(this.value)}
            .indeterminate=${Dl(this.indeterminate)}
            .checked=${Dl(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            aria-checked=${this.checked?`true`:`false`}
            aria-describedby="help-text"
            @click=${this.handleClick}
            @input=${this.handleInput}
            @invalid=${this.handleInvalid}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
          />

          <span
            part="control${this.checked?` control--checked`:``}${this.indeterminate?` control--indeterminate`:``}"
            class="checkbox__control"
          >
            ${this.checked?S`
                  <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
                `:``}
            ${!this.checked&&this.indeterminate?S`
                  <sl-icon
                    part="indeterminate-icon"
                    class="checkbox__indeterminate-icon"
                    library="system"
                    name="indeterminate"
                  ></sl-icon>
                `:``}
          </span>

          <div part="label" class="checkbox__label">
            <slot></slot>
          </div>
        </label>

        <div
          aria-hidden=${t?`false`:`true`}
          class="form-control__help-text"
          id="help-text"
          part="form-control-help-text"
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};q.styles=[E,El,wl],q.dependencies={"sl-icon":or},w([A(`input[type="checkbox"]`)],q.prototype,`input`,2),w([k()],q.prototype,`hasFocus`,2),w([O()],q.prototype,`title`,2),w([O()],q.prototype,`name`,2),w([O()],q.prototype,`value`,2),w([O({reflect:!0})],q.prototype,`size`,2),w([O({type:Boolean,reflect:!0})],q.prototype,`disabled`,2),w([O({type:Boolean,reflect:!0})],q.prototype,`checked`,2),w([O({type:Boolean,reflect:!0})],q.prototype,`indeterminate`,2),w([Tl(`checked`)],q.prototype,`defaultChecked`,2),w([O({reflect:!0})],q.prototype,`form`,2),w([O({type:Boolean,reflect:!0})],q.prototype,`required`,2),w([O({attribute:`help-text`})],q.prototype,`helpText`,2),w([T(`disabled`,{waitUntilFirstUpdate:!0})],q.prototype,`handleDisabledChange`,1),w([T([`checked`,`indeterminate`],{waitUntilFirstUpdate:!0})],q.prototype,`handleStateChange`,1),q.define(`sl-checkbox`);var Ol=0,J=class extends U{constructor(...e){super(...e),this.navJson=``,this.pagesJson=``,this.modelsJson=``,this.webhooksJson=``,this.activeSlug=``,this.docsExpiresAt=``,this.archiveExportUrl=``,this.hasContentPagesFallback=!1,this.tags=[],this.pages=[],this.modelGroups=[],this.webhooks=[],this.expiryTick=0,this.hostedArchiveControls=!1,this.archiveFormat=`zip`,this.includeDiagnostics=!1,this.includeAIDocs=!1,this.archiveExporting=!1,this.archiveExportTargetOrigin=``,this.archiveExportRequestId=0,this.activeArchiveExportRequestId=0,this.loggedEmptyState=!1,this.loggedContentState=!1,this.hostMessageHandler=e=>this.handleHostMessage(e),this.contractNavigationID=`pp-contract-navigation-${++Ol}`}logPerf(e,t){let n=globalThis.__PP_LOG;typeof n==`function`&&n(e,t)}previewHoldEnabled(){return this.getAttribute(`data-pp-preview-hold`)===`true`}developerMode(){return document.body?.dataset.ppDeveloperMode===`true`}hasHydratedNav(){return this.hasAttribute(`data-nav`)||this.hasAttribute(`data-pages`)||this.hasAttribute(`data-models`)||this.hasAttribute(`data-webhooks`)||this.hasAttribute(`data-pp-nav-cached`)}hasNavContent(){return this.tags.length>0||this.pages.length>0||this.modelGroups.length>0||this.webhooks.length>0}archiveControlsEnabled(){return this.hostedArchiveControls||this.archiveExportUrl.trim()!==``}ensureExpiryTimer(){let e=Date.parse(this.docsExpiresAt);if(Number.isNaN(e)){this.stopExpiryTimer();return}if(Date.now()>=e){this.stopExpiryTimer();return}this.expiryTimer===void 0&&(this.expiryTimer=window.setInterval(()=>{this.expiryTick++,Date.now()>=e&&this.stopExpiryTimer()},1e3))}stopExpiryTimer(){this.expiryTimer!==void 0&&(window.clearInterval(this.expiryTimer),this.expiryTimer=void 0)}docsExpiryLabel(e){this.expiryTick;let t=Math.floor(Math.max(0,e-Date.now())/1e3);if(t<=0)return S`docs expired!`;let n=Math.floor(t/60);return n>=2?S`docs expire in <strong>${n}</strong> minutes`:n===1?S`docs expire in <strong>under two minutes</strong>`:S`docs expiring in <strong>${t} second${t===1?``:`s`}</strong>`}renderDocsExpiry(){let e=Date.parse(this.docsExpiresAt);if(Number.isNaN(e))return C;let t=this.docsExpiryLabel(e),n=e-Date.now(),r=n<=0;return S`
            <div class="docs-expiry ${!r&&n<6e4?`critical`:``} ${r?`expired`:``}" aria-live="polite">${t}</div>`}renderHostedArchiveControls(){return this.archiveControlsEnabled()?S`
            <div class="host-archive-controls" aria-label="Documentation archive export">
                <div class="host-archive-controls-title">export documentation</div>
                <div class="host-archive-control-row">
                    <sl-tooltip
                        class="archive-option-tooltip"
                        content="INCLUDE QUALITY DIAGNOSTICS IN GENERATED DOCS"
                        placement="top">
                        <sl-checkbox
                            ?checked=${this.includeDiagnostics}
                            @sl-change=${this.handleIncludeDiagnosticsChange}>
                            diagnostics?
                        </sl-checkbox>
                    </sl-tooltip>
                    <sl-tooltip
                        class="archive-option-tooltip"
                        content="INCLUDE llms.txt & AGENTIC READY VERSION OF DOCUMENTATION"
                        placement="top">
                        <sl-checkbox
                            ?checked=${this.includeAIDocs}
                            @sl-change=${this.handleIncludeAIDocsChange}>
                            AI docs?
                        </sl-checkbox>
                    </sl-tooltip>
                    <sl-dropdown class="archive-format-dropdown" skidding="0" distance="4" hoist>
                        <sl-button slot="trigger" class="archive-format-trigger" size="small" caret>
                            <sl-icon slot="prefix" name="download"></sl-icon>
                            ${this.archiveFormat}
                        </sl-button>
                        <sl-menu @sl-select=${this.handleArchiveFormatSelect}>
                            <sl-menu-item value="zip" type="checkbox" .checked=${this.archiveFormat===`zip`}>
                                zip
                            </sl-menu-item>
                            <sl-menu-item value="tar.gz" type="checkbox" .checked=${this.archiveFormat===`tar.gz`}>
                                tar.gz
                            </sl-menu-item>
                        </sl-menu>
                    </sl-dropdown>
                    <sl-button
                        class="archive-download-button"
                        ?disabled=${this.archiveExporting}
                        aria-busy=${this.archiveExporting?`true`:`false`}
                        @click=${this.requestArchiveExport}
                        aria-label=${this.archiveExporting?`Exporting documentation archive`:`Download documentation archive`}>
                        ${this.archiveExporting?S`<sl-spinner></sl-spinner>`:`export`}
                    </sl-button>
                </div>
            </div>
        `:C}handleArchiveFormatSelect(e){let t=e.detail?.item?.value;(t===`zip`||t===`tar.gz`)&&(this.archiveFormat=t)}handleIncludeDiagnosticsChange(e){this.includeDiagnostics=!!e.target?.checked}handleIncludeAIDocsChange(e){this.includeAIDocs=!!e.target?.checked}canRequestHostedArchiveExport(){return this.hostedArchiveControls&&this.archiveExportTargetOrigin!==``&&!!window.parent}isEmbeddedInHost(){return!!(window.parent&&window.parent!==window)}postHostedArchiveExport(e){return this.canRequestHostedArchiveExport()?(window.parent.postMessage({type:`ppress:export`,requestId:e,format:this.archiveFormat,diagnostics:this.includeDiagnostics,llm:this.includeAIDocs},this.archiveExportTargetOrigin),!0):!1}archiveExportURL(e){let t=new URL(e,window.location.href);return t.searchParams.set(`format`,this.archiveFormat),this.includeDiagnostics&&t.searchParams.set(`diagnostics`,`1`),this.includeAIDocs&&t.searchParams.set(`llm`,`1`),t}archiveFilenameFromResponse(e,t){let n=e.headers.get(`content-disposition`)||``,r=n.match(/filename\*=UTF-8''([^;]+)/i);if(r?.[1])try{return decodeURIComponent(r[1].replace(/^"|"$/g,``))}catch{return r[1].replace(/^"|"$/g,``)}let i=n.match(/filename="?([^";]+)"?/i);return i?.[1]?i[1]:`printing-press-docs.${t}`}async archiveErrorFromResponse(e){let t=await e.text();try{return JSON.parse(t)}catch{return Error(t||e.statusText||`Unable to export documentation archive.`)}}downloadArchiveBlob(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.click(),window.setTimeout(()=>URL.revokeObjectURL(n),500)}async requestDirectArchiveExport(e){let t=this.archiveFormat,n=this.archiveExportURL(e),r=await fetch(n.toString(),{method:`GET`,credentials:`include`});if(!r.ok)throw await this.archiveErrorFromResponse(r);let i=await r.blob();this.downloadArchiveBlob(i,this.archiveFilenameFromResponse(r,t))}beginArchiveExport(){return this.archiveExporting=!0,this.activeArchiveExportRequestId=++this.archiveExportRequestId,this.activeArchiveExportRequestId}completeArchiveExport(e){e!==void 0&&this.activeArchiveExportRequestId!==e||(this.archiveExporting=!1,this.activeArchiveExportRequestId=0)}async requestArchiveExport(){if(this.archiveExporting)return;if(this.canRequestHostedArchiveExport()){let e=this.beginArchiveExport();this.postHostedArchiveExport(e)||this.completeArchiveExport(e);return}let e=this.archiveExportUrl.trim();if(e&&!this.isEmbeddedInHost()){let t=this.beginArchiveExport();try{await this.requestDirectArchiveExport(e)}catch(e){console.error(`Unable to export documentation archive:`,e)}finally{this.completeArchiveExport(t)}}}handleHostMessage(e){if(e.source!==window.parent)return;let t=e.data;if(!(!t||typeof t!=`object`)){if(t.type===`doctor:archive-controls`){this.hostedArchiveControls=t.enabled===!0,this.archiveExportTargetOrigin=this.hostedArchiveControls?e.origin:``;return}if(t.type===`doctor:archive-export-complete`||t.type===`doctor:archive-export-error`){if(this.archiveExportTargetOrigin&&e.origin!==this.archiveExportTargetOrigin)return;this.completeArchiveExport(typeof t.requestId==`number`?t.requestId:void 0),t.type===`doctor:archive-export-error`&&t.message&&console.error(`Unable to export documentation archive:`,t.message)}}}renderFallbackNav(){let e=S`
            <div class="pp-nav-fallback-home">${this.overviewLabel()}</div>
            ${this.developerMode()?S`<div class="pp-nav-fallback-home diagnostics">DIAGNOSTICS</div>`:C}
            ${this.hasContentPagesFallback?S`
                    <div class="pp-nav-fallback-section pp-nav-fallback-guides">
                        <h4>Guides</h4>
                        <div class="pp-nav-fallback-list">
                            ${[74,66,58,70].map(e=>S`
                                <div class="pp-nav-fallback-row" style=${`width:${e}%;`}></div>`)}
                        </div>
                    </div>
                `:C}
            <div class="pp-nav-fallback-section">
                <h4>Operations</h4>
                <div class="pp-nav-fallback-list">
                    ${[100,92,84,78,88,74].map(e=>S`
                        <div class="pp-nav-fallback-row" style=${`width:${e}%;`}></div>`)}
                </div>
            </div>
            <div class="pp-nav-fallback-section">
                <h4>Models</h4>
                <div class="pp-nav-fallback-list">
                    ${[96,86,82,90,76,88,80,72].map(e=>S`
                        <div class="pp-nav-fallback-row" style=${`width:${e}%;`}></div>`)}
                </div>
            </div>`,t=this.contractGroups();return S`
            <div class="pp-nav-fallback" aria-hidden="true">
                ${this.renderHostedArchiveControls()}
                ${this.renderDocsExpiry()}
                ${t.length?this.renderContractNavigation(t,e,!0):e}
            </div>
        `}overviewLabel(){return document.body?.dataset.ppOverviewLabel?.trim()||`API OVERVIEW`}contractGroups(){return Gc(document.body?.dataset.ppContracts)}handleContractVersionSelect(e){let t=e.detail?.item?.value;typeof t==`string`&&t!==``&&(window.location.href=t)}renderContractVersionPicker(e){let t=e.versions;if(!e.active||t.length<=1)return C;let n=e.currentVersion||t.find(e=>e.active)?.label||``;return S`
            <sl-dropdown class="contract-version-dropdown" skidding="0" distance="4" hoist>
                <sl-button
                    slot="trigger"
                    class="contract-version-trigger"
                    size="small"
                    caret
                    aria-label=${`Select version for ${e.label}, current version ${n}`}>
                    ${n}
                </sl-button>
                <sl-menu
                    class="contract-version-menu"
                    aria-label=${`Versions for ${e.label}`}
                    @sl-select=${this.handleContractVersionSelect}>
                    ${t.map(e=>S`
                        <sl-menu-item
                            value=${Ic(e.href)}
                            type="checkbox"
                            .checked=${!!e.active}
                            aria-current=${e.active?`page`:C}>
                            ${e.label}
                        </sl-menu-item>`)}
                </sl-menu>
            </sl-dropdown>`}renderContractNavigation(e,t,n=!1){return S`
            <nav class="contract-navigation ${n?`pp-nav-fallback-contracts`:``}" aria-label="Service contracts">
                ${document.body?.dataset.ppServiceName?.trim()?S`<div class="contract-service-name">${document.body.dataset.ppServiceName}</div>`:C}
                ${e.map((e,r)=>{let i=`${this.contractNavigationID}-${r}`;return S`
                        <section class="contract-group" aria-labelledby=${i}>
                            <h4 id=${i} class="contract-role-heading">${e.label}</h4>
                            <ul class="contract-list" aria-labelledby=${i}>
                                ${e.contracts.map(e=>S`
                                    <li class="contract-item ${e.active?`active`:``}">
                                        <div class="contract-row">
                                            <a
                                                class="contract-link ${e.active?`active`:``}"
                                                href=${Ic(e.href)}
                                                aria-current=${e.active?`page`:C}>
                                                ${e.label}
                                            </a>
                                            ${n?C:this.renderContractVersionPicker(e)}
                                        </div>
                                        ${e.active?S`<div class="contract-local-navigation">${t}</div>`:C}
                                    </li>`)}
                            </ul>
                        </section>`})}
            </nav>`}authoredPreview(){for(let e of this.authored)if(e instanceof Element){let t=e.matches(`.pp-nav-preview`)?e:e.querySelector(`.pp-nav-preview`);if(t)return t}return null}connectedCallback(){super.connectedCallback(),window.addEventListener(`message`,this.hostMessageHandler),this.ensureExpiryTimer();let e=this.authoredPreview();this.logPerf(`nav:connected`,{activeSlug:this.activeSlug,cached:this.hasAttribute(`data-pp-nav-cached`),preview:!!e,previewHold:this.previewHoldEnabled()})}disconnectedCallback(){window.removeEventListener(`message`,this.hostMessageHandler),this.stopExpiryTimer(),super.disconnectedCallback()}willUpdate(e){if(e.has(`navJson`))try{this.tags=this.navJson&&JSON.parse(this.navJson)||[]}catch{this.tags=[]}if(e.has(`pagesJson`))try{this.pages=this.pagesJson&&JSON.parse(this.pagesJson)||[]}catch{this.pages=[]}if(e.has(`modelsJson`))try{this.modelGroups=this.modelsJson&&JSON.parse(this.modelsJson)||[]}catch{this.modelGroups=[]}if(e.has(`webhooksJson`))try{this.webhooks=this.webhooksJson&&JSON.parse(this.webhooksJson)||[]}catch{this.webhooks=[]}e.has(`docsExpiresAt`)&&this.ensureExpiryTimer()}updated(){let e=this.tags.length>0||this.pages.length>0||this.modelGroups.length>0||this.webhooks.length>0;if(!e&&!this.loggedEmptyState&&(this.loggedEmptyState=!0,this.logPerf(`nav:empty-render`)),e&&!this.loggedContentState){if(this.loggedContentState=!0,this.logPerf(`nav:content-render`,{tags:this.tags.length,pages:this.pages.length,modelGroups:this.modelGroups.length,webhooks:this.webhooks.length}),this.previewHoldEnabled()){this.logPerf(`nav-preview:hold-active`,{source:`shadow-nav`});return}let e=this.authoredPreview();e&&(e.remove(),this.logPerf(`nav-preview:removed`,{source:`shadow-nav`}))}}renderLocalNavigation(){return S`
            <a class="nav-home ${this.activeSlug?``:`active`}" href=${Lc()}>
                <sl-icon name="chevron-right" class="nav-home-chevron"></sl-icon>
                ${this.overviewLabel()}
            </a>
            ${this.developerMode()?S`
                    <a class="nav-home diagnostics ${this.activeSlug===`diagnostics`?`active`:``}"
                       href=${Ic(`diagnostics.html`)}>
                        <sl-icon name="chevron-right" class="nav-home-chevron"></sl-icon>
                        DIAGNOSTICS
                    </a>
                `:C}
            ${this.pages.length?S`
                    <div class="nav-section nav-pages-section">
                        <h4>Guides</h4>
                        <ul class="nav-pages-list">
                            ${this.pages.map(e=>S`
                                    <li>
                                        <a class="nav-page-link ${this.activeSlug===`content/${e.slug}`?`active`:``}" href=${Ic(e.href||``)}>
                                            <sl-icon name="chevron-right" class="nav-page-chevron"></sl-icon>
                                            <span>${e.label||e.title||e.slug}</span>
                                        </a>
                                    </li>
                                `)}
                        </ul>
                    </div>
                `:C}
            ${this.tags.length?S`
                    <div class="nav-section nav-operations-section">
                        <h4>Operations</h4>
                        ${this.tags.map(e=>S`
                            <pp-nav-tag .tag=${e} .activeSlug=${this.activeSlug}></pp-nav-tag>`)}
                    </div>
                `:C}
            ${this.modelGroups.length?S`
                    <div class="nav-section nav-models-section">
                        <h4>Models</h4>
                        ${this.modelGroups.map(e=>S`
                            <pp-nav-model-group .group=${e}
                                                .activeSlug=${this.activeSlug}></pp-nav-model-group>`)}
                    </div>
                `:C}
            ${this.webhooks.length?S`
                    <div class="nav-section nav-webhooks-section">
                        <h4>Webhooks</h4>
                        <pp-nav-tag
                            .tag=${{name:`Webhooks`,summary:`Webhooks`,children:null,operations:this.webhooks,isNavOnly:!1}}
                            .activeSlug=${this.activeSlug}
                        ></pp-nav-tag>
                    </div>
                `:C}
        `}render(){if(this.previewHoldEnabled())return this.slotted();if(!this.hasNavContent()&&!this.hasHydratedNav())return this.renderFallbackNav();let e=this.renderLocalNavigation(),t=this.contractGroups();return S`
            ${this.renderHostedArchiveControls()}
            ${this.renderDocsExpiry()}
            ${t.length?this.renderContractNavigation(t,e):e}
        `}};K([O({attribute:`data-nav`})],J.prototype,`navJson`,void 0),K([O({attribute:`data-pages`})],J.prototype,`pagesJson`,void 0),K([O({attribute:`data-models`})],J.prototype,`modelsJson`,void 0),K([O({attribute:`data-webhooks`})],J.prototype,`webhooksJson`,void 0),K([O({attribute:`data-active`})],J.prototype,`activeSlug`,void 0),K([O({attribute:`data-docs-expires-at`})],J.prototype,`docsExpiresAt`,void 0),K([O({attribute:`data-archive-export-url`})],J.prototype,`archiveExportUrl`,void 0),K([O({attribute:`data-has-content-pages`,type:Boolean})],J.prototype,`hasContentPagesFallback`,void 0),K([k()],J.prototype,`tags`,void 0),K([k()],J.prototype,`pages`,void 0),K([k()],J.prototype,`modelGroups`,void 0),K([k()],J.prototype,`webhooks`,void 0),K([k()],J.prototype,`expiryTick`,void 0),K([k()],J.prototype,`hostedArchiveControls`,void 0),K([k()],J.prototype,`archiveFormat`,void 0),K([k()],J.prototype,`includeDiagnostics`,void 0),K([k()],J.prototype,`includeAIDocs`,void 0),K([k()],J.prototype,`archiveExporting`,void 0),J=K([D(`pp-nav`)],J);function kl(e){return e?(e.errors||0)+(e.warns||0)+(e.infos||0):0}function Al(e,t,n=`${t}s`){return e===1?t:n}function jl(e){return e===8?`err`:e===4?`warn`:`info`}function Ml(e){return e===8?`exclamation-square`:e===4?`exclamation-triangle`:`info-square`}function Nl(e){return e===8?`Error`:e===4?`Warning`:`Info`}function Pl(e){return!e||kl(e)<=0?C:S`
    <span class="violation-badges">
      ${[{severity:`error`,count:e.errors||0,noun:`error`},{severity:`warn`,count:e.warns||0,noun:`warning`},{severity:`info`,count:e.infos||0,noun:`info`}].map(({severity:e,count:t,noun:n})=>{if(t<=0)return C;let r=t>99?`99+`:String(t),i=`${t} ${n}${t===1?``:`s`}`;return S`<sl-badge class=${`violation-badge ${e}`}>
          ${r}<span class="sr-only"> ${i}</span>
        </sl-badge>`})}
    </span>
  `}function Fl(e){return e.trim().toLowerCase()}function Il(e){switch(Fl(e)){case`receive`:return`RCV`;case`send`:return`SND`;default:return e.trim().toUpperCase()}}function Ll(e){switch(Fl(e)){case`receive`:return`arrow-left`;case`send`:return`arrow-right`;default:return`arrow-right`}}function Rl(e){switch(Fl(e)){case`receive`:return`Receive`;case`send`:return`Send`;default:return e.trim()}}var zl=class extends U{constructor(...e){super(...e),this.action=``,this.size=`small`}render(){let e=Fl(this.action);return S`
      <span class="action ${this.size} ${e}" aria-label=${Rl(this.action)}>
        <sl-icon name=${Ll(this.action)}></sl-icon>
        <span>${Il(this.action)}</span>
      </span>
    `}};K([O({reflect:!0})],zl.prototype,`action`,void 0),K([O({reflect:!0})],zl.prototype,`size`,void 0),zl=K([D(`pp-asyncapi-action`)],zl);var Bl={amqp:{label:`AMQP`,mark:`amqp`},amqp1:{label:`AMQP 1.0`,mark:`amqp`},amqps:{label:`AMQPS`,mark:`amqp`},anypointmq:{label:`ANYPOINT MQ`,mark:`anypointmq`},gcppubsub:{label:`GOOGLE PUB/SUB`,mark:`googlepubsub`},googlepubsub:{label:`GOOGLE PUB/SUB`,mark:`googlepubsub`},http:{label:`HTTP`,mark:`globe`},https:{label:`HTTPS`,mark:`globe`},ibmmq:{label:`IBM MQ`,mark:`ibmmq`},jms:{label:`JMS`,mark:`queue`},kafka:{label:`KAFKA`,mark:`kafka`},kafkasecure:{label:`KAFKA`,mark:`kafka`},mercure:{label:`MERCURE`,mark:`broadcast`},mqtt:{label:`MQTT`,mark:`mqtt`},mqtt5:{label:`MQTT 5`,mark:`mqtt`},mqtts:{label:`MQTTS`,mark:`mqtt`},mqttsecure:{label:`MQTT`,mark:`mqtt`},securemqtt:{label:`MQTT`,mark:`mqtt`},nats:{label:`NATS`,mark:`nats`},pulsar:{label:`PULSAR`,mark:`pulsar`},redis:{label:`REDIS`,mark:`redis`},sns:{label:`SNS`,mark:`sns`},solace:{label:`SOLACE`,mark:`solace`},sqs:{label:`SQS`,mark:`sqs`},stomp:{label:`STOMP`,mark:`stomp`},stomps:{label:`STOMPS`,mark:`stomp`},websocket:{label:`WEBSOCKET`,mark:`websocket`},websockets:{label:`WEBSOCKET`,mark:`websocket`},ws:{label:`WEBSOCKET`,mark:`websocket`},wss:{label:`WEBSOCKET`,mark:`websocket`}};function Vl(e){return e.trim().toLowerCase().replace(/[-_.\s]+/g,``)}function Hl(e){return Bl[Vl(e)]??{label:e.trim().toUpperCase(),mark:`topology`}}var Ul=class extends U{constructor(...e){super(...e),this.protocol=``,this.size=`medium`,this.heading=!1}renderMark(e){switch(e){case`amqp`:return S`<svg data-brand="amqp" viewBox="0 0 72 72" fill="currentColor" aria-hidden="true">
          <path d="M14.13 14.18h12.24v12.45H14.13V14.18Zm0 15.75h15.54V14.18h12.35v28.2H14.13V29.93Zm43.74-3.51v31.4H14.24V45.47h31.29V14.18h12.35v12.24Z"></path>
        </svg>`;case`anypointmq`:return S`<svg data-brand="mulesoft" viewBox="0 0 72 72" fill="currentColor" aria-hidden="true">
          <path d="m47.93 16.51-11.74 18.04-11.62-18.16c-6.78 4-11.38 11.38-11.38 19.86 0 9.2 5.45 17.19 13.32 20.83l1.94-7.39c-4.6-2.18-7.87-7.14-7.87-12.83 0-3.03.85-5.81 2.42-8.11l10.05 15.01h6.05l10.05-15.01c1.57 2.3 2.42 5.09 2.42 8.11 0 5.33-2.78 9.93-6.9 12.35l1.94 7.51c7.39-3.87 12.35-11.62 12.59-20.46 0-8.35-4.48-15.74-11.26-19.74Z"></path>
        </svg>`;case`broadcast`:return S`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"></circle>
          <path d="M10 8a5.7 5.7 0 0 1 0 8M14 5a10 10 0 0 1 0 14"></path>
        </svg>`;case`globe`:return S`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
          <circle cx="12" cy="12" r="8"></circle>
          <path d="M4 12h16M12 4c2.6 2.4 3.8 5.1 3.8 8S14.6 17.6 12 20M12 4c-2.6 2.4-3.8 5.1-3.8 8S9.4 17.6 12 20"></path>
        </svg>`;case`kafka`:return S`<svg data-brand="apache-kafka" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9.71 2.136a1.43 1.43 0 0 0-2.047 0h-.007a1.48 1.48 0 0 0-.421 1.042c0 .41.161.777.422 1.039l.007.007c.257.264.616.426 1.019.426.404 0 .766-.162 1.027-.426l.003-.007c.261-.262.421-.629.421-1.039 0-.408-.159-.777-.421-1.042H9.71zM8.683 22.295c.404 0 .766-.167 1.027-.429l.003-.008c.261-.261.421-.631.421-1.036 0-.41-.159-.778-.421-1.044H9.71a1.42 1.42 0 0 0-1.027-.432 1.4 1.4 0 0 0-1.02.432h-.007c-.26.266-.422.634-.422 1.044 0 .406.161.775.422 1.036l.007.008c.258.262.617.429 1.02.429zm7.89-4.462c.359-.096.683-.33.882-.684l.027-.052a1.47 1.47 0 0 0 .114-1.067 1.454 1.454 0 0 0-.675-.896l-.021-.014a1.425 1.425 0 0 0-1.078-.132c-.36.091-.684.335-.881.686-.2.349-.241.75-.146 1.119.099.363.33.691.675.896h.002c.346.203.737.239 1.101.144zm-6.405-7.342a2.083 2.083 0 0 0-1.485-.627c-.58 0-1.103.242-1.482.627-.378.385-.612.916-.612 1.507s.233 1.124.612 1.514a2.08 2.08 0 0 0 2.967 0c.379-.39.612-.923.612-1.514s-.233-1.122-.612-1.507zm-.835-2.51c.843.141 1.6.552 2.178 1.144h.004c.092.093.182.196.265.299l1.446-.851a3.176 3.176 0 0 1-.047-1.808 3.149 3.149 0 0 1 1.456-1.926l.025-.016a3.062 3.062 0 0 1 2.345-.306c.77.21 1.465.721 1.898 1.482v.002c.431.757.518 1.626.313 2.408a3.145 3.145 0 0 1-1.456 1.928l-.198.118h-.02a3.095 3.095 0 0 1-2.154.201 3.127 3.127 0 0 1-1.514-.944l-1.444.848a4.162 4.162 0 0 1 0 2.879l1.444.846c.413-.47.939-.789 1.514-.944a3.041 3.041 0 0 1 2.371.319l.048.023v.002a3.17 3.17 0 0 1 1.408 1.906 3.215 3.215 0 0 1-.313 2.405l-.026.053-.003-.005a3.147 3.147 0 0 1-1.867 1.436 3.096 3.096 0 0 1-2.371-.318v-.006a3.156 3.156 0 0 1-1.456-1.927 3.175 3.175 0 0 1 .047-1.805l-1.446-.848a3.905 3.905 0 0 1-.265.294l-.004.005a3.938 3.938 0 0 1-2.178 1.138v1.699a3.09 3.09 0 0 1 1.56.862l.002.004c.565.572.914 1.368.914 2.243 0 .873-.35 1.664-.914 2.239l-.002.009a3.1 3.1 0 0 1-2.21.931 3.1 3.1 0 0 1-2.206-.93h-.002v-.009a3.186 3.186 0 0 1-.916-2.239c0-.875.35-1.672.916-2.243v-.004h.002a3.1 3.1 0 0 1 1.558-.862v-1.699a3.926 3.926 0 0 1-2.176-1.138l-.006-.005a4.098 4.098 0 0 1-1.173-2.874c0-1.122.452-2.136 1.173-2.872h.006a3.947 3.947 0 0 1 2.176-1.144V6.289a3.137 3.137 0 0 1-1.558-.864h-.002v-.004a3.192 3.192 0 0 1-.916-2.243c0-.871.35-1.669.916-2.243l.002-.002A3.084 3.084 0 0 1 8.683 0c.861 0 1.641.355 2.21.932v.002h.002c.565.574.914 1.372.914 2.243 0 .876-.35 1.667-.914 2.243l-.002.005a3.142 3.142 0 0 1-1.56.864v1.692zm8.121-1.129-.012-.019a1.452 1.452 0 0 0-.87-.668 1.43 1.43 0 0 0-1.103.146h.002c-.347.2-.58.529-.677.896-.095.365-.054.768.146 1.119l.007.009c.2.347.519.579.874.673.357.103.755.059 1.098-.144l.019-.009a1.47 1.47 0 0 0 .657-.885 1.493 1.493 0 0 0-.141-1.118"></path>
        </svg>`;case`googlepubsub`:return S`<svg data-brand="google-pubsub" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.3 7.452a2.064 2.064 0 1 1 4.128 0 2.064 2.064 0 0 1-4.128 0ZM3.636 9.516a2.064 2.064 0 1 0 0-4.128 2.064 2.064 0 0 0 0 4.128ZM12 19.872A2.064 2.064 0 1 0 12 24a2.064 2.064 0 0 0 0-4.128Zm-6.262-5.073a2.628 2.628 0 1 0 .526 2.301c0-.13-.02-.254-.038-.38a2.59 2.59 0 0 0-.488-1.921Zm8.987-.608a3.32 3.32 0 1 0-5.369.098 3.314 3.314 0 0 0 5.369-.098Zm-8.987.608.956 1.651 2.575-1.486a3.83 3.83 0 0 1-.946-1.657L5.738 14.8ZM11.04 5.59v2.987A3.79 3.79 0 0 1 12 8.44c.329 0 .643.055.948.133v-2.98c-.3.097-.615.166-.948.166-.337 0-.656-.07-.96-.169Zm7.317 9.131-2.646-1.521a3.818 3.818 0 0 1-.914 1.683l2.542 1.46a3.115 3.115 0 0 1 1.018-1.622Zm2.007-.249a2.628 2.628 0 1 0 0 5.256 2.628 2.628 0 0 0 0-5.256ZM11.502 5.206a2.626 2.626 0 1 0 .99 0 2.52 2.52 0 0 1-.99 0Z"></path>
        </svg>`;case`ibmmq`:return S`<svg data-brand="ibm-mq" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="m22.5 28.4-.9-1.8c4-2.1 6.5-6.2 6.5-10.6 0-6.6-5.4-12-12-12-1.3 0-2.5.2-3.7.6l-.6-1.9c1.3-.5 2.7-.7 4.2-.7 7.7 0 14 6.3 14 14 0 5.2-2.9 10-7.5 12.4ZM20.5 23.8l-1-1.7c2.2-1.2 3.5-3.6 3.5-6.1 0-3.9-3.1-7-7-7-.6 0-1.2.1-1.8.2l-.5-1.9c.8-.2 1.5-.3 2.3-.3 5 0 9 4 9 9 0 3.2-1.7 6.2-4.5 7.8Zm-11 4.6C4.9 26 2 21.2 2 16c0-1.5.2-2.9.7-4.3l1.9.6C4.2 13.5 4 14.7 4 16c0 4.5 2.5 8.6 6.5 10.6l-1 1.8Zm2-4.6C8.7 22.2 7 19.2 7 16c0-.8.1-1.5.3-2.2l1.9.5c-.1.5-.2 1.1-.2 1.7 0 2.5 1.3 4.8 3.5 6.1l-1 1.7ZM20 16c0-2.2-1.8-4-4-4-.7 0-1.4.2-2 .6L8.9 7.5c.1-.2.1-.3.1-.5 0-1.1-.9-2-2-2S5 5.9 5 7s.9 2 2 2c.2 0 .3 0 .5-.1l5.1 5.1c-.4.6-.6 1.3-.6 2 0 1.9 1.3 3.4 3 3.9v7.4c-.6.3-1 1-1 1.7 0 1.1.9 2 2 2s2-.9 2-2c0-.7-.4-1.4-1-1.7v-7.4c1.7-.5 3-2 3-3.9Zm-4 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z"></path>
        </svg>`;case`mqtt`:return S`<svg data-brand="mqtt" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10.657 23.994h-9.45A1.212 1.212 0 0 1 0 22.788v-9.18h.071c5.784 0 10.504 4.65 10.586 10.386Zm7.606 0h-4.045C14.135 16.246 7.795 9.977 0 9.942V6.038h.071c9.983 0 18.121 8.044 18.192 17.956Zm4.53 0h-.97C21.754 12.071 11.995 2.407 0 2.372v-1.16C0 .55.544.006 1.207.006h7.64C15.733 2.49 21.257 7.789 24 14.508v8.291c0 .663-.544 1.195-1.207 1.195ZM16.713.006h6.092A1.19 1.19 0 0 1 24 1.2v5.914c-.91-1.242-2.046-2.65-3.158-3.762C19.588 2.11 18.122.987 16.714.005Z"></path>
        </svg>`;case`nats`:return S`<svg data-brand="nats" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.004 0H.404v18.807h9.938l1.714 1.602v-.026L15.966 24v-5.193h7.63V0H12.003Zm7.578 14.45H15.38L6.898 6.519v7.93H4.116V4.376h4.349l8.344 7.784V4.375h2.773V14.45Z"></path>
        </svg>`;case`pulsar`:return S`<svg data-brand="apache-pulsar" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 8.925h-5.866c-1.586-3.041-3.262-5.402-5.544-5.402-2.97 0-4.367 2.593-5.717 5.115l-.118.22H0v1.5h3.934c1.39 0 1.673.468 1.673.468-1.09 1.691-2.4 3.363-4.584 3.363H0v1.574h1.03c4.234 0 6.083-3.434 7.567-6.193 1.361-2.541 2.31-4.08 3.993-4.08 1.747 0 3.584 3.801 5.201 7.157.237.488.477.988.72 1.483-6.2.197-9.155 1.649-11.559 2.833-1.759.866-3.147 1.94-5.433 1.94H0v1.574h1.507c2.754 0 4.47-.85 6.295-1.751 2.53-1.243 5.398-2.652 12.157-2.652h3.907V14.5H21.66a1.18 1.18 0 0 1-.972-.393 70.83 70.83 0 0 1-1.133-2.321l-.511-1.047s.366-.393 1.38-.393H24Z"></path>
        </svg>`;case`queue`:return S`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h12M4 12h16M4 17h12M14 4l3 3-3 3M14 14l3 3-3 3"></path>
        </svg>`;case`redis`:return S`<svg data-brand="redis" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22.71 13.145c-1.66 2.092-3.452 4.483-7.038 4.483-3.203 0-4.397-2.825-4.48-5.12.701 1.484 2.073 2.685 4.214 2.63 4.117-.133 6.94-3.852 6.94-7.239 0-4.05-3.022-6.972-8.268-6.972-3.752 0-8.4 1.428-11.455 3.685C2.59 6.937 3.885 9.958 4.35 9.626c2.648-1.904 4.748-3.13 6.784-3.744C8.12 9.244.886 17.05 0 18.425c.1 1.261 1.66 4.648 2.424 4.648.232 0 .431-.133.664-.365a100.49 100.49 0 0 0 5.54-6.765c.222 3.104 1.748 6.898 6.014 6.898 3.819 0 7.604-2.756 9.33-8.965.2-.764-.73-1.361-1.261-.73Zm-4.349-5.013c0 1.959-1.926 2.922-3.685 2.922-.941 0-1.664-.247-2.235-.568 1.051-1.592 2.092-3.225 3.21-4.973 1.972.334 2.71 1.43 2.71 2.619Z"></path>
        </svg>`;case`sns`:return S`<svg data-brand="aws-sns" viewBox="40 40 180 180" fill="currentColor" aria-hidden="true">
          <path d="M54.4 121.6a6.4 6.4 0 1 1 0 12.8 6.4 6.4 0 0 1 0-12.8Zm76.8 83.2c-37.395 0-69.475-27.309-76.18-64.064 5.668-.275 10.346-4.227 11.722-9.536H86.4v-6.4H66.742c-1.376-5.306-6.05-9.258-11.718-9.536C61.712 79.072 94.435 51.2 131.2 51.2c13.802 0 28.262 5.19 42.973 15.427l3.654-5.254C162.026 50.378 146.336 44.8 131.2 44.8c-40.736 0-76.963 31.568-82.998 72.067C44.285 119.062 41.6 123.2 41.6 128s2.685 8.938 6.602 11.13c6.102 41.161 41.577 72.07 82.998 72.07 17.302 0 35.014-5.898 49.872-16.605l-3.744-5.19c-13.776 9.93-30.157 15.395-46.128 15.395Zm-34.877-88.186c5.933 1.45 13.357 1.786 18.877 1.786 5.254 0 12.234-.304 18.013-1.58l-14.477 28.95a3.2 3.2 0 0 0-.336 1.43v14.25c-2.563 1.635-6.934 4.348-9.6 4.905V147.2c0-.422-.083-.842-.246-1.232l-12.23-29.354Zm18.877-11.014c12.88 0 19.757 1.933 21.891 3.2-2.134 1.267-9.011 3.2-21.891 3.2s-19.757-1.933-21.891-3.2c2.134-1.267 9.011-3.2 21.891-3.2Zm57.6 25.6h19.658c1.427 5.504 6.396 9.6 12.342 9.6 7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8c-5.946 0-10.915 4.096-12.342 9.6H172.8V83.2h13.258c1.427 5.504 6.396 9.6 12.342 9.6 7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8c-5.946 0-10.915 4.096-12.342 9.6H169.6a3.2 3.2 0 0 0-3.2 3.2v44.8H144v6.4h22.4V176a3.2 3.2 0 0 0 3.2 3.2h16.458c1.427 5.504 6.396 9.6 12.342 9.6 7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8c-5.946 0-10.915 4.096-12.342 9.6H172.8v-41.6Z"></path>
        </svg>`;case`solace`:return S`<svg data-brand="solace-pubsub" viewBox="0 0 72 72" fill="currentColor" aria-hidden="true">
          <path d="M61.37 28.2H53.9v-7.99c1.8-.59 3.1-2.26 3.1-4.26a4.5 4.5 0 1 0-5.7 4.32v7.93H37.1V12.94a4.5 4.5 0 1 0-2.6 0V28.2H20.4v-7.96a4.5 4.5 0 1 0-2.6 0v7.96h-7.05a4.39 4.39 0 0 0-4.39 4.39v9.23a4.39 4.39 0 0 0 4.39 4.39h7.05v5.56a4.5 4.5 0 1 0 2.6 0v-5.56h14.1v12.86a4.5 4.5 0 1 0 2.6 0V46.21h14.2v5.53a4.5 4.5 0 1 0 2.6.06v-5.59h7.47a4.39 4.39 0 0 0 4.39-4.39v-9.23a4.39 4.39 0 0 0-4.39-4.39Z"></path>
        </svg>`;case`sqs`:return S`<svg data-brand="aws-sqs" viewBox="40 50 180 155" fill="currentColor" aria-hidden="true">
          <path d="m91.894 139.8 9.607-9.49a3.18 3.18 0 0 0 .012-4.499l-9.606-9.599-4.54 4.486 4.12 4.12H76.83v6.364h14.71l-4.16 4.107 4.515 4.511Zm73.315.29 12.808-9.551a3.19 3.19 0 0 0-.003-5.091l-12.808-9.538-3.843 5.09 5.123 3.818h-12.808v6.364h12.805L161.36 135l3.849 5.09ZM112.666 128c0 6.755-1.169 13.124-3.352 18.666 11.52-4.428 25.974-4.428 37.492 0-4.465-11.084-4.465-26.248 0-37.332-11.518 4.425-25.972 4.425-37.492 0 2.183 5.545 3.352 11.911 3.352 18.666Zm-15.687 30.884a3.163 3.163 0 0 1 0-4.499c12.408-12.329 12.408-40.441 0-52.77a3.163 3.163 0 0 1 0-4.499 3.213 3.213 0 0 1 4.528 0c12.408 12.329 40.701 12.329 53.11 0a3.213 3.213 0 0 1 4.527 0 3.163 3.163 0 0 1 0 4.499c-12.408 12.329-12.408 40.441 0 52.77a3.163 3.163 0 0 1 0 4.499 3.2 3.2 0 0 1-4.528 0c-12.408-12.329-40.701-12.329-53.109 0a3.213 3.213 0 0 1-4.528 0Zm78.688 16.655c-26.42 26.25-69.31 26.25-95.726 0-8.767-8.708-13.593-19.115-16.097-26.308l-6.052 2.08c2.725 7.827 7.993 19.163 17.621 28.727 28.94 28.76 75.626 28.76 104.782 0 8.085-8.027 14.524-18.233 18.139-28.736l-6.058-2.062c-3.305 9.602-9.203 18.944-16.61 26.3Zm-111.827-68.767-6.045-2.087c3.874-11.084 10.137-21.291 17.637-28.74 28.93-28.72 75.59-28.72 104.743 0 7.893 7.842 14.512 18.316 18.153 28.74l-6.046 2.087c-3.34-9.545-9.401-19.14-16.635-26.327-26.4-26.22-69.29-26.22-95.687 0-6.826 6.786-12.552 16.137-16.119 26.327Z"></path>
        </svg>`;case`stomp`:return S`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 8h13M14 5l3 3-3 3M20 16H7M10 13l-3 3 3 3"></path>
        </svg>`;case`websocket`:return S`<svg data-brand="websocket" viewBox="0 0 72 72" fill="currentColor" aria-hidden="true">
          <path d="m48.38 23.39 7.48 7.48v15.98h-6.69V33.7l-5.55-5.55 4.76-4.76Zm-7.14 33.55H29.79l-7.48-7.48 4.65-4.65L15.4 33.25v-6.57h6.69v3.74l4.87 4.87 7.14-7.14-4.87-4.87H15.4l-6.69-6.69h23.23L43.5 28.26l-2.38 2.38 4.53 4.53v9.41l-9.29-9.29-2.38 2.38 9.29 9.29h-9.41l-4.65-4.65-2.38 2.38 5.55 5.55h23.35l6.69 6.57-21.19.11Z"></path>
        </svg>`;default:return S`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <path d="M12 12 6 6m6 6 6-6m-6 6-6 6m6-6 6 6"></path>
          <circle cx="12" cy="12" r="2.3" fill="currentColor" stroke="none"></circle>
          <circle cx="6" cy="6" r="2"></circle><circle cx="18" cy="6" r="2"></circle>
          <circle cx="6" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>
        </svg>`}}render(){let e=Hl(this.protocol),t=S`
      <span class="mark ${e.mark}" aria-hidden="true">${this.renderMark(e.mark)}</span>
      <span class="label">${e.label}</span>
    `;return this.heading?S`<h1 class=${this.size}>${t}</h1>`:S`<span class="protocol ${this.size}">${t}</span>`}};K([O()],Ul.prototype,`protocol`,void 0),K([O()],Ul.prototype,`size`,void 0),K([O({type:Boolean})],Ul.prototype,`heading`,void 0),Ul=K([D(`pp-asyncapi-protocol`)],Ul);function Wl(e){return e.specKind===`asyncapi`}function Gl(e,t){return t?!!(e.operations?.some(e=>e.slug===t)||e.children?.some(e=>Gl(e,t))):!1}var Kl=class extends U{constructor(...e){super(...e),this.tag={name:``,summary:``,children:null,operations:null,isNavOnly:!1},this.activeSlug=``,this.open=!1}willUpdate(e){(e.has(`tag`)||e.has(`activeSlug`))&&Gl(this.tag,this.activeSlug)&&(this.open=!0)}toggle(){this.open=!this.open}developerMode(){return document.body?.dataset.ppDeveloperMode===`true`}render(){let{tag:e,activeSlug:t,open:n}=this,r=Gl(e,t),i=this.developerMode();return S`
            <div class="tag-header ${r?`active`:``} ${i?`developer`:``}" @click=${this.toggle}>
                <sl-icon name=${n?`chevron-down`:`chevron-right`} class="chevron"></sl-icon>
                <span class="tag-name">
                    ${e.protocol?S`<pp-asyncapi-protocol protocol=${e.protocol} size="nav"></pp-asyncapi-protocol>`:S`
                            <span>${e.summary||e.name}</span>
                            ${e.protocols?.length?S`<span class="tag-protocols">
                                    ${e.protocols.map(e=>S`
                                        <pp-asyncapi-protocol protocol=${e} size="nav"></pp-asyncapi-protocol>`)}
                                  </span>`:C}
                          `}
                </span>
                ${i?Pl(e.counts):C}
            </div>
            ${n?S`
                        <div class="tag-body">
                            ${e.operations?.length?S`
                                        <ul>
                                            ${e.operations.map(e=>S`
                                                        <li>
                                                            <a href=${zc(e.slug)} class="${e.deprecated?`deprecated`:``} ${e.slug===t?`active`:``} ${i?`developer`:``}">
                                                                <span class="op-title">${e.summary||e.path}</span>
                                                                ${Wl(e)?S`<pp-asyncapi-action action=${e.method} size="small"></pp-asyncapi-action>`:S`<pp-http-method mode="nav-naked"
                                                                                method=${e.method}></pp-http-method>`}
                                                                ${i?Pl(e.counts):C}
                                                            </a>
                                                        </li>
                                                    `)}
                                        </ul>
                                    `:C}
                            ${e.children?.length?S`
                                        <div class="children">
                                            ${e.children.map(e=>S`
                                                        <pp-nav-tag .tag=${e}
                                                                    .activeSlug=${t}></pp-nav-tag>`)}
                                        </div>
                                    `:C}
                        </div>
                    `:C}
        `}};K([O({type:Object})],Kl.prototype,`tag`,void 0),K([O()],Kl.prototype,`activeSlug`,void 0),K([k()],Kl.prototype,`open`,void 0),Kl=K([D(`pp-nav-tag`)],Kl);function ql(e,t){return t?e.models?.some(e=>e.typeSlug+`/`+e.slug===t)??!1:!1}var Jl=class extends U{constructor(...e){super(...e),this.group={name:``,typeSlug:``,models:null},this.activeSlug=``,this.open=!1}willUpdate(e){(e.has(`group`)||e.has(`activeSlug`))&&ql(this.group,this.activeSlug)&&(this.open=!0)}updated(e){(e.has(`activeSlug`)||e.has(`group`))&&this.open&&this.activeSlug&&requestAnimationFrame(()=>{this.renderRoot.querySelector(`a.active`)?.scrollIntoView?.({block:`center`,behavior:`auto`})})}toggle(){this.open=!this.open}developerMode(){return document.body?.dataset.ppDeveloperMode===`true`}render(){let{group:e,activeSlug:t,open:n}=this,r=ql(e,t),i=this.developerMode();return S`
            <div class="group-header ${r?`active`:``} ${i?`developer`:``}" @click=${this.toggle}>
                <sl-icon name=${n?`chevron-down`:`chevron-right`} class="chevron"></sl-icon>
                <span>${e.name}</span>
                ${i?Pl(e.counts):C}
            </div>
            ${n&&e.models?.length?S`
                    <div class="group-body">
                        <ul>
                            ${e.models.map(e=>{let n=e.typeSlug+`/`+e.slug;return S`
                                        <li>
                                            <a href=${Bc(e.typeSlug,e.slug)}
                                               class="${n===t?`active`:``} ${i?`developer`:``}">
                                                <span class="model-name">
                                                    ${e.protocol?S`<pp-asyncapi-protocol protocol=${e.protocol} size="nav"></pp-asyncapi-protocol>`:S`
                                                            <span>${e.name}</span>
                                                            ${e.protocols?.length?S`<span class="model-protocols">
                                                                    ${e.protocols.map(e=>S`
                                                                        <pp-asyncapi-protocol protocol=${e} size="nav"></pp-asyncapi-protocol>`)}
                                                                  </span>`:C}
                                                          `}
                                                </span>
                                                ${i?Pl(e.counts):C}
                                            </a>
                                        </li>
                                    `})}
                        </ul>
                    </div>
                `:C}
        `}};K([O({type:Object})],Jl.prototype,`group`,void 0),K([O()],Jl.prototype,`activeSlug`,void 0),K([k()],Jl.prototype,`open`,void 0),Jl=K([D(`pp-nav-model-group`)],Jl);var Yl=class extends U{constructor(...e){super(...e),this.specKind=``,this.method=``,this.path=``,this.slug=``,this.deprecated=!1}render(){return S`
      <a
        href=${zc(this.slug)}
        class=${this.deprecated?`deprecated`:``}
      >
        ${this.specKind===`asyncapi`?S`<pp-asyncapi-action action=${this.method} size="small"></pp-asyncapi-action>`:S`<pp-http-method method=${this.method}></pp-http-method>`}
        <span class="path">${this.path}</span>
      </a>
    `}};K([O()],Yl.prototype,`specKind`,void 0),K([O()],Yl.prototype,`method`,void 0),K([O()],Yl.prototype,`path`,void 0),K([O()],Yl.prototype,`slug`,void 0),K([O({type:Boolean})],Yl.prototype,`deprecated`,void 0),Yl=K([D(`pp-nav-operation`)],Yl);var Xl=class extends U{constructor(...e){super(...e),this.curlJson=``,this.variants=[],this.selectedIndex=0}willUpdate(e){if(e.has(`curlJson`)){try{let e=JSON.parse(this.curlJson);this.variants=Array.isArray(e)?e:[]}catch{this.variants=[]}this.selectedIndex=0}}renderSelector(){if(this.variants.length<=1)return C;let e=this.variants[this.selectedIndex]||this.variants[0];return e?S`
      <div class="selector-row">
        <div class="selector">
          <sl-dropdown skidding="5" distance="5">
            <sl-button slot="trigger" caret>${e.label||`Variant ${this.selectedIndex+1}`}</sl-button>
            <sl-menu @sl-select=${this.handleSelect}>
              ${this.variants.map((e,t)=>S`
                <sl-menu-item value="${t}">${e.label||`Variant ${t+1}`}</sl-menu-item>
              `)}
            </sl-menu>
          </sl-dropdown>
        </div>
      </div>
    `:C}handleSelect(e){let t=e.detail?.item?.value;if(t===void 0)return;let n=parseInt(t,10);n>=0&&n<this.variants.length&&(this.selectedIndex=n)}renderSkeleton(){return S`
      <div class="selector-row curl-skeleton-row" aria-hidden="true">
        <div class="curl-skeleton-button"></div>
      </div>
      <div class="curl-skeleton-terminal" aria-hidden="true">
        <div class="curl-skeleton-line short"></div>
        <div class="curl-skeleton-line"></div>
        <div class="curl-skeleton-line mid"></div>
      </div>
    `}render(){if(this.variants.length===0)return this.renderSkeleton();let e=this.variants[this.selectedIndex]||this.variants[0];return e?S`
      ${this.renderSelector()}
      <pp-terminal-example .command=${e.command}></pp-terminal-example>
    `:C}};K([O({attribute:`curl-json`})],Xl.prototype,`curlJson`,void 0),K([k()],Xl.prototype,`variants`,void 0),K([k()],Xl.prototype,`selectedIndex`,void 0),Xl=K([D(`pp-curl-command`)],Xl);var Zl=`path-items`,Ql={schemas:`schemas`,responses:`responses`,parameters:`parameters`,requestBodies:`request-bodies`,headers:`headers`,securitySchemes:`security`,examples:`examples`,links:`links`,callbacks:`callbacks`,pathItems:Zl};function $l(e){let t=e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`);return t=t.toLowerCase(),t=t.replace(/[/]/g,`-`).replace(/[{}_.]/g,`-`).replace(/ /g,`-`),t=t.replace(/[^a-z0-9-]/g,``),t=t.replace(/-{2,}/g,`-`),t=t.replace(/^-|-$/g,``),t||`unnamed`}function eu(e){if(!e||!e.startsWith(`#/components/`))return null;let t=e.replace(`#/components/`,``).split(`/`);if(t.length!==2)return null;let[n,r]=t,i=Ql[n];return i?{name:r,href:Bc(i,$l(r))}:null}function tu(e,t){if(!e)return[];let n=[];return t?.includeExample&&(e.example!==void 0&&n.push({label:`example`,value:JSON.stringify(e.example)}),e.default!==void 0&&n.push({label:`default`,value:JSON.stringify(e.default)})),e.minimum!==void 0&&n.push({label:`min`,value:e.minimum}),e.maximum!==void 0&&n.push({label:`max`,value:e.maximum}),e.exclusiveMinimum!==void 0&&n.push({label:`exclusiveMin`,value:e.exclusiveMinimum}),e.exclusiveMaximum!==void 0&&n.push({label:`exclusiveMax`,value:e.exclusiveMaximum}),e.minLength!==void 0&&n.push({label:`minLength`,value:e.minLength}),e.maxLength!==void 0&&n.push({label:`maxLength`,value:e.maxLength}),e.minItems!==void 0&&n.push({label:`minItems`,value:e.minItems}),e.maxItems!==void 0&&n.push({label:`maxItems`,value:e.maxItems}),e.uniqueItems&&n.push({label:`uniqueItems`,value:`true`}),e.pattern&&n.push({label:`pattern`,value:e.pattern,isCode:!0}),e.multipleOf!==void 0&&n.push({label:`multipleOf`,value:e.multipleOf}),n}function nu(e){if(!e)return``;if(e.type===`array`&&e.items)return`Array<${e.items.type||e.items.$ref?.split(`/`).pop()||`any`}>`;if(e.type){let t=Array.isArray(e.type)?e.type.join(` | `):e.type;return e.format&&(t+=` (${e.format})`),t}return e.oneOf?`oneOf`:e.anyOf?`anyOf`:e.allOf?`allOf`:e.$ref?e.$ref.split(`/`).pop()??``:``}var ru=class extends lr{constructor(e){if(super(e),this.it=C,e.type!==sr.CHILD)throw Error(this.constructor.directiveName+`() can only be used in child bindings`)}render(e){if(e===C||e==null)return this._t=void 0,this.it=e;if(e===Kt)return e;if(typeof e!=`string`)throw Error(this.constructor.directiveName+`() called with a non-string value`);if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};ru.directiveName=`unsafeHTML`,ru.resultType=1;var iu=cr(ru);function au(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ou=au();function su(e){ou=e}var cu=/[&<>"']/,lu=new RegExp(cu.source,`g`),uu=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,du=new RegExp(uu.source,`g`),fu={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`},pu=e=>fu[e];function mu(e,t){if(t){if(cu.test(e))return e.replace(lu,pu)}else if(uu.test(e))return e.replace(du,pu);return e}var hu=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function gu(e){return e.replace(hu,(e,t)=>(t=t.toLowerCase(),t===`colon`?`:`:t.charAt(0)===`#`?t.charAt(1)===`x`?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):``))}var _u=/(^|[^\[])\^/g;function Y(e,t){let n=typeof e==`string`?e:e.source;t||=``;let r={replace:(e,t)=>{let i=typeof t==`string`?t:t.source;return i=i.replace(_u,`$1`),n=n.replace(e,i),r},getRegex:()=>new RegExp(n,t)};return r}function vu(e){try{e=encodeURI(e).replace(/%25/g,`%`)}catch{return null}return e}var yu={exec:()=>null};function bu(e,t){let n=e.replace(/\|/g,(e,t,n)=>{let r=!1,i=t;for(;--i>=0&&n[i]===`\\`;)r=!r;return r?`|`:` |`}).split(/ \|/),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push(``);for(;r<n.length;r++)n[r]=n[r].trim().replace(/\\\|/g,`|`);return n}function xu(e,t,n){let r=e.length;if(r===0)return``;let i=0;for(;i<r;){let a=e.charAt(r-i-1);if(a===t&&!n)i++;else if(a!==t&&n)i++;else break}return e.slice(0,r-i)}function Su(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let r=0;r<e.length;r++)if(e[r]===`\\`)r++;else if(e[r]===t[0])n++;else if(e[r]===t[1]&&(n--,n<0))return r;return-1}function Cu(e,t,n,r){let i=t.href,a=t.title?mu(t.title):null,o=e[1].replace(/\\([\[\]])/g,`$1`);if(e[0].charAt(0)!==`!`){r.state.inLink=!0;let e={type:`link`,raw:n,href:i,title:a,text:o,tokens:r.inlineTokens(o)};return r.state.inLink=!1,e}return{type:`image`,raw:n,href:i,title:a,text:mu(o)}}function wu(e,t){let n=e.match(/^(\s+)(?:```)/);if(n===null)return t;let r=n[1];return t.split(`
`).map(e=>{let t=e.match(/^\s+/);if(t===null)return e;let[n]=t;return n.length>=r.length?e.slice(r.length):e}).join(`
`)}var Tu=class{options;rules;lexer;constructor(e){this.options=e||ou}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:`space`,raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=t[0].replace(/^ {1,4}/gm,``);return{type:`code`,raw:t[0],codeBlockStyle:`indented`,text:this.options.pedantic?e:xu(e,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],n=wu(e,t[3]||``);return{type:`code`,raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,`$1`):t[2],text:n}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){let t=xu(e,`#`);(this.options.pedantic||!t||/ $/.test(t))&&(e=t.trim())}return{type:`heading`,raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:`hr`,raw:t[0]}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=xu(t[0].replace(/^ *>[ \t]?/gm,``),`
`),n=this.lexer.state.top;this.lexer.state.top=!0;let r=this.lexer.blockTokens(e);return this.lexer.state.top=n,{type:`blockquote`,raw:t[0],tokens:r,text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),r=n.length>1,i={type:`list`,raw:``,ordered:r,start:r?+n.slice(0,-1):``,loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:`[*+-]`);let a=RegExp(`^( {0,3}${n})((?:[\t ][^\\n]*)?(?:\\n|$))`),o=``,s=``,c=!1;for(;e;){let n=!1;if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;o=t[0],e=e.substring(o.length);let r=t[2].split(`
`,1)[0].replace(/^\t+/,e=>` `.repeat(3*e.length)),l=e.split(`
`,1)[0],u=0;this.options.pedantic?(u=2,s=r.trimStart()):(u=t[2].search(/[^ ]/),u=u>4?1:u,s=r.slice(u),u+=t[1].length);let d=!1;if(!r&&/^ *$/.test(l)&&(o+=l+`
`,e=e.substring(l.length+1),n=!0),!n){let t=RegExp(`^ {0,${Math.min(3,u-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),n=RegExp(`^ {0,${Math.min(3,u-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),i=RegExp(`^ {0,${Math.min(3,u-1)}}(?:\`\`\`|~~~)`),a=RegExp(`^ {0,${Math.min(3,u-1)}}#`);for(;e;){let c=e.split(`
`,1)[0];if(l=c,this.options.pedantic&&(l=l.replace(/^ {1,4}(?=( {4})*[^ ])/g,`  `)),i.test(l)||a.test(l)||t.test(l)||n.test(e))break;if(l.search(/[^ ]/)>=u||!l.trim())s+=`
`+l.slice(u);else{if(d||r.search(/[^ ]/)>=4||i.test(r)||a.test(r)||n.test(r))break;s+=`
`+l}!d&&!l.trim()&&(d=!0),o+=c+`
`,e=e.substring(c.length+1),r=l.slice(u)}}i.loose||(c?i.loose=!0:/\n *\n *$/.test(o)&&(c=!0));let f=null,p;this.options.gfm&&(f=/^\[[ xX]\] /.exec(s),f&&(p=f[0]!==`[ ] `,s=s.replace(/^\[[ xX]\] +/,``))),i.items.push({type:`list_item`,raw:o,task:!!f,checked:p,loose:!1,text:s,tokens:[]}),i.raw+=o}i.items[i.items.length-1].raw=o.trimEnd(),i.items[i.items.length-1].text=s.trimEnd(),i.raw=i.raw.trimEnd();for(let e=0;e<i.items.length;e++)if(this.lexer.state.top=!1,i.items[e].tokens=this.lexer.blockTokens(i.items[e].text,[]),!i.loose){let t=i.items[e].tokens.filter(e=>e.type===`space`);i.loose=t.length>0&&t.some(e=>/\n.*\n/.test(e.raw))}if(i.loose)for(let e=0;e<i.items.length;e++)i.items[e].loose=!0;return i}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:`html`,block:!0,raw:t[0],pre:t[1]===`pre`||t[1]===`script`||t[1]===`style`,text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let e=t[1].toLowerCase().replace(/\s+/g,` `),n=t[2]?t[2].replace(/^<(.*)>$/,`$1`).replace(this.rules.inline.anyPunctuation,`$1`):``,r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,`$1`):t[3];return{type:`def`,tag:e,raw:t[0],href:n,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!/[:|]/.test(t[2]))return;let n=bu(t[1]),r=t[2].replace(/^\||\| *$/g,``).split(`|`),i=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,``).split(`
`):[],a={type:`table`,raw:t[0],header:[],align:[],rows:[]};if(n.length===r.length){for(let e of r)/^ *-+: *$/.test(e)?a.align.push(`right`):/^ *:-+: *$/.test(e)?a.align.push(`center`):/^ *:-+ *$/.test(e)?a.align.push(`left`):a.align.push(null);for(let e of n)a.header.push({text:e,tokens:this.lexer.inline(e)});for(let e of i)a.rows.push(bu(e,a.header.length).map(e=>({text:e,tokens:this.lexer.inline(e)})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:`heading`,raw:t[0],depth:t[2].charAt(0)===`=`?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:`paragraph`,raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:`text`,raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:`escape`,raw:t[0],text:mu(t[1])}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:`html`,raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;let t=xu(e.slice(0,-1),`\\`);if((e.length-t.length)%2==0)return}else{let e=Su(t[2],`()`);if(e>-1){let n=(t[0].indexOf(`!`)===0?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,n).trim(),t[3]=``}}let n=t[2],r=``;if(this.options.pedantic){let e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);e&&(n=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):``;return n=n.trim(),/^</.test(n)&&(n=this.options.pedantic&&!/>$/.test(e)?n.slice(1):n.slice(1,-1)),Cu(t,{href:n&&n.replace(this.rules.inline.anyPunctuation,`$1`),title:r&&r.replace(this.rules.inline.anyPunctuation,`$1`)},t[0],this.lexer)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let e=t[(n[2]||n[1]).replace(/\s+/g,` `).toLowerCase()];if(!e){let e=n[0].charAt(0);return{type:`text`,raw:e,text:e}}return Cu(n,e,n[0],this.lexer)}}emStrong(e,t,n=``){let r=this.rules.inline.emStrongLDelim.exec(e);if(r&&!(r[3]&&n.match(/[\p{L}\p{N}]/u))&&(!(r[1]||r[2])||!n||this.rules.inline.punctuation.exec(n))){let n=[...r[0]].length-1,i,a,o=n,s=0,c=r[0][0]===`*`?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,t=t.slice(-1*e.length+n);(r=c.exec(t))!=null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(a=[...i].length,r[3]||r[4]){o+=a;continue}else if((r[5]||r[6])&&n%3&&!((n+a)%3)){s+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+s);let t=[...r[0]][0].length,c=e.slice(0,n+r.index+t+a);if(Math.min(n,a)%2){let e=c.slice(1,-1);return{type:`em`,raw:c,text:e,tokens:this.lexer.inlineTokens(e)}}let l=c.slice(2,-2);return{type:`strong`,raw:c,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g,` `),n=/[^ ]/.test(e),r=/^ /.test(e)&&/ $/.test(e);return n&&r&&(e=e.substring(1,e.length-1)),e=mu(e,!0),{type:`codespan`,raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:`br`,raw:t[0]}}del(e){let t=this.rules.inline.del.exec(e);if(t)return{type:`del`,raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,n;return t[2]===`@`?(e=mu(t[1]),n=`mailto:`+e):(e=mu(t[1]),n=e),{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,n;if(t[2]===`@`)e=mu(t[0]),n=`mailto:`+e;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??``;while(r!==t[0]);e=mu(t[0]),n=t[1]===`www.`?`http://`+t[0]:t[0]}return{type:`link`,raw:t[0],text:e,href:n,tokens:[{type:`text`,raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e;return e=this.lexer.state.inRawBlock?t[0]:mu(t[0]),{type:`text`,raw:t[0],text:e}}}},Eu=/^(?: *(?:\n|$))+/,Du=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,Ou=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,ku=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Au=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,ju=/(?:[*+-]|\d{1,9}[.)])/,Mu=Y(/^(?!bull )((?:.|\n(?!\s*?\n|bull ))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,ju).getRegex(),Nu=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Pu=/^[^\n]+/,Fu=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Iu=Y(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace(`label`,Fu).replace(`title`,/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Lu=Y(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ju).getRegex(),Ru=`address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`,zu=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,Bu=Y(`^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))`,`i`).replace(`comment`,zu).replace(`tag`,Ru).replace(`attribute`,/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Vu=Y(Nu).replace(`hr`,ku).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ru).getRegex(),Hu={blockquote:Y(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace(`paragraph`,Vu).getRegex(),code:Du,def:Iu,fences:Ou,heading:Au,hr:ku,html:Bu,lheading:Mu,list:Lu,newline:Eu,paragraph:Vu,table:yu,text:Pu},Uu=Y(`^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`).replace(`hr`,ku).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`blockquote`,` {0,3}>`).replace(`code`,` {4}[^\\n]`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ru).getRegex(),Wu={...Hu,table:Uu,paragraph:Y(Nu).replace(`hr`,ku).replace(`heading`,` {0,3}#{1,6}(?:\\s|$)`).replace(`|lheading`,``).replace(`table`,Uu).replace(`blockquote`,` {0,3}>`).replace(`fences`," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace(`list`,` {0,3}(?:[*+-]|1[.)]) `).replace(`html`,`</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`).replace(`tag`,Ru).getRegex()},Gu={...Hu,html:Y(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace(`comment`,zu).replace(/tag/g,`(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`).getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:yu,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Y(Nu).replace(`hr`,ku).replace(`heading`,` *#{1,6} *[^
]`).replace(`lheading`,Mu).replace(`|table`,``).replace(`blockquote`,` {0,3}>`).replace(`|fences`,``).replace(`|list`,``).replace(`|html`,``).replace(`|tag`,``).getRegex()},Ku=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,qu=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ju=/^( {2,}|\\)\n(?!\s*$)/,Yu=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Xu="\\p{P}$+<=>`^|~",Zu=Y(/^((?![*_])[\spunctuation])/,`u`).replace(/punctuation/g,Xu).getRegex(),Qu=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,$u=Y(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,`u`).replace(/punct/g,Xu).getRegex(),ed=Y(`^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])`,`gu`).replace(/punct/g,Xu).getRegex(),td=Y(`^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])`,`gu`).replace(/punct/g,Xu).getRegex(),nd=Y(/\\([punct])/,`gu`).replace(/punct/g,Xu).getRegex(),rd=Y(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace(`scheme`,/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace(`email`,/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),id=Y(zu).replace(`(?:-->|$)`,`-->`).getRegex(),ad=Y(`^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`).replace(`comment`,id).replace(`attribute`,/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),od=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,sd=Y(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace(`label`,od).replace(`href`,/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace(`title`,/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),cd=Y(/^!?\[(label)\]\[(ref)\]/).replace(`label`,od).replace(`ref`,Fu).getRegex(),ld=Y(/^!?\[(ref)\](?:\[\])?/).replace(`ref`,Fu).getRegex(),ud={_backpedal:yu,anyPunctuation:nd,autolink:rd,blockSkip:Qu,br:Ju,code:qu,del:yu,emStrongLDelim:$u,emStrongRDelimAst:ed,emStrongRDelimUnd:td,escape:Ku,link:sd,nolink:ld,punctuation:Zu,reflink:cd,reflinkSearch:Y(`reflink|nolink(?!\\()`,`g`).replace(`reflink`,cd).replace(`nolink`,ld).getRegex(),tag:ad,text:Yu,url:yu},dd={...ud,link:Y(/^!?\[(label)\]\((.*?)\)/).replace(`label`,od).getRegex(),reflink:Y(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace(`label`,od).getRegex()},fd={...ud,escape:Y(Ku).replace(`])`,`~|])`).getRegex(),url:Y(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,`i`).replace(`email`,/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},pd={...fd,br:Y(Ju).replace(`{2,}`,`*`).getRegex(),text:Y(fd.text).replace(`\\b_`,`\\b_| {2,}\\n`).replace(/\{2,\}/g,`*`).getRegex()},md={normal:Hu,gfm:Wu,pedantic:Gu},hd={normal:ud,gfm:fd,breaks:pd,pedantic:dd},gd=class e{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ou,this.options.tokenizer=this.options.tokenizer||new Tu,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={block:md.normal,inline:hd.normal};this.options.pedantic?(t.block=md.pedantic,t.inline=hd.pedantic):this.options.gfm&&(t.block=md.gfm,this.options.breaks?t.inline=hd.breaks:t.inline=hd.gfm),this.tokenizer.rules=t}static get rules(){return{block:md,inline:hd}}static lex(t,n){return new e(n).lex(t)}static lexInline(t,n){return new e(n).inlineTokens(t)}lex(e){e=e.replace(/\r\n|\r/g,`
`),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){e=this.options.pedantic?e.replace(/\t/g,`    `).replace(/^ +$/gm,``):e.replace(/^( *)(\t+)/gm,(e,t,n)=>t+`    `.repeat(n.length));let n,r,i,a;for(;e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(r=>(n=r.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length),n.raw.length===1&&t.length>0?t[t.length-1].raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length),r=t[t.length-1],r&&(r.type===`paragraph`||r.type===`text`)?(r.raw+=`
`+n.raw,r.text+=`
`+n.text,this.inlineQueue[this.inlineQueue.length-1].src=r.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length),r=t[t.length-1],r&&(r.type===`paragraph`||r.type===`text`)?(r.raw+=`
`+n.raw,r.text+=`
`+n.raw,this.inlineQueue[this.inlineQueue.length-1].src=r.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title});continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(i=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0,n=e.slice(1),r;this.options.extensions.startBlock.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(this.state.top&&(n=this.tokenizer.paragraph(i))){r=t[t.length-1],a&&r.type===`paragraph`?(r.raw+=`
`+n.raw,r.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=r.text):t.push(n),a=i.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length),r=t[t.length-1],r&&r.type===`text`?(r.raw+=`
`+n.raw,r.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=r.text):t.push(n);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n,r,i,a=e,o,s,c;if(this.tokens.links){let e=Object.keys(this.tokens.links);if(e.length>0)for(;(o=this.tokenizer.rules.inline.reflinkSearch.exec(a))!=null;)e.includes(o[0].slice(o[0].lastIndexOf(`[`)+1,-1))&&(a=a.slice(0,o.index)+`[`+`a`.repeat(o[0].length-2)+`]`+a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(o=this.tokenizer.rules.inline.blockSkip.exec(a))!=null;)a=a.slice(0,o.index)+`[`+`a`.repeat(o[0].length-2)+`]`+a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(o=this.tokenizer.rules.inline.anyPunctuation.exec(a))!=null;)a=a.slice(0,o.index)+`++`+a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(s||(c=``),s=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(r=>(n=r.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))){if(n=this.tokenizer.escape(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.tag(e)){e=e.substring(n.raw.length),r=t[t.length-1],r&&n.type===`text`&&r.type===`text`?(r.raw+=n.raw,r.text+=n.text):t.push(n);continue}if(n=this.tokenizer.link(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(n.raw.length),r=t[t.length-1],r&&n.type===`text`&&r.type===`text`?(r.raw+=n.raw,r.text+=n.text):t.push(n);continue}if(n=this.tokenizer.emStrong(e,a,c)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.codespan(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.br(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.del(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.autolink(e)){e=e.substring(n.raw.length),t.push(n);continue}if(!this.state.inLink&&(n=this.tokenizer.url(e))){e=e.substring(n.raw.length),t.push(n);continue}if(i=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0,n=e.slice(1),r;this.options.extensions.startInline.forEach(e=>{r=e.call({lexer:this},n),typeof r==`number`&&r>=0&&(t=Math.min(t,r))}),t<1/0&&t>=0&&(i=e.substring(0,t+1))}if(n=this.tokenizer.inlineText(i)){e=e.substring(n.raw.length),n.raw.slice(-1)!==`_`&&(c=n.raw.slice(-1)),s=!0,r=t[t.length-1],r&&r.type===`text`?(r.raw+=n.raw,r.text+=n.text):t.push(n);continue}if(e){let t=`Infinite loop on byte: `+e.charCodeAt(0);if(this.options.silent){console.error(t);break}else throw Error(t)}}return t}},_d=class{options;constructor(e){this.options=e||ou}code(e,t,n){let r=(t||``).match(/^\S*/)?.[0];return e=e.replace(/\n$/,``)+`
`,r?`<pre><code class="language-`+mu(r)+`">`+(n?e:mu(e,!0))+`</code></pre>
`:`<pre><code>`+(n?e:mu(e,!0))+`</code></pre>
`}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e,t){return e}heading(e,t,n){return`<h${t}>${e}</h${t}>\n`}hr(){return`<hr>
`}list(e,t,n){let r=t?`ol`:`ul`,i=t&&n!==1?` start="`+n+`"`:``;return`<`+r+i+`>
`+e+`</`+r+`>
`}listitem(e,t,n){return`<li>${e}</li>\n`}checkbox(e){return`<input `+(e?`checked="" `:``)+`disabled="" type="checkbox">`}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&=`<tbody>${t}</tbody>`,`<table>
<thead>
`+e+`</thead>
`+t+`</table>
`}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){let n=t.header?`th`:`td`;return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return`<br>`}del(e){return`<del>${e}</del>`}link(e,t,n){let r=vu(e);if(r===null)return n;e=r;let i=`<a href="`+e+`"`;return t&&(i+=` title="`+t+`"`),i+=`>`+n+`</a>`,i}image(e,t,n){let r=vu(e);if(r===null)return n;e=r;let i=`<img src="${e}" alt="${n}"`;return t&&(i+=` title="${t}"`),i+=`>`,i}text(e){return e}},vd=class{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,n){return``+n}image(e,t,n){return``+n}br(){return``}},yd=class e{options;renderer;textRenderer;constructor(e){this.options=e||ou,this.options.renderer=this.options.renderer||new _d,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new vd}static parse(t,n){return new e(n).parse(t)}static parseInline(t,n){return new e(n).parseInline(t)}parse(e,t=!0){let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[i.type]){let e=i,t=this.options.extensions.renderers[e.type].call({parser:this},e);if(t!==!1||![`space`,`hr`,`heading`,`code`,`table`,`blockquote`,`list`,`html`,`paragraph`,`text`].includes(e.type)){n+=t||``;continue}}switch(i.type){case`space`:continue;case`hr`:n+=this.renderer.hr();continue;case`heading`:{let e=i;n+=this.renderer.heading(this.parseInline(e.tokens),e.depth,gu(this.parseInline(e.tokens,this.textRenderer)));continue}case`code`:{let e=i;n+=this.renderer.code(e.text,e.lang,!!e.escaped);continue}case`table`:{let e=i,t=``,r=``;for(let t=0;t<e.header.length;t++)r+=this.renderer.tablecell(this.parseInline(e.header[t].tokens),{header:!0,align:e.align[t]});t+=this.renderer.tablerow(r);let a=``;for(let t=0;t<e.rows.length;t++){let n=e.rows[t];r=``;for(let t=0;t<n.length;t++)r+=this.renderer.tablecell(this.parseInline(n[t].tokens),{header:!1,align:e.align[t]});a+=this.renderer.tablerow(r)}n+=this.renderer.table(t,a);continue}case`blockquote`:{let e=i,t=this.parse(e.tokens);n+=this.renderer.blockquote(t);continue}case`list`:{let e=i,t=e.ordered,r=e.start,a=e.loose,o=``;for(let t=0;t<e.items.length;t++){let n=e.items[t],r=n.checked,i=n.task,s=``;if(n.task){let e=this.renderer.checkbox(!!r);a?n.tokens.length>0&&n.tokens[0].type===`paragraph`?(n.tokens[0].text=e+` `+n.tokens[0].text,n.tokens[0].tokens&&n.tokens[0].tokens.length>0&&n.tokens[0].tokens[0].type===`text`&&(n.tokens[0].tokens[0].text=e+` `+n.tokens[0].tokens[0].text)):n.tokens.unshift({type:`text`,text:e+` `}):s+=e+` `}s+=this.parse(n.tokens,a),o+=this.renderer.listitem(s,i,!!r)}n+=this.renderer.list(o,t,r);continue}case`html`:{let e=i;n+=this.renderer.html(e.text,e.block);continue}case`paragraph`:{let e=i;n+=this.renderer.paragraph(this.parseInline(e.tokens));continue}case`text`:{let a=i,o=a.tokens?this.parseInline(a.tokens):a.text;for(;r+1<e.length&&e[r+1].type===`text`;)a=e[++r],o+=`
`+(a.tokens?this.parseInline(a.tokens):a.text);n+=t?this.renderer.paragraph(o):o;continue}default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}parseInline(e,t){t||=this.renderer;let n=``;for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[i.type]){let e=this.options.extensions.renderers[i.type].call({parser:this},i);if(e!==!1||![`escape`,`html`,`link`,`image`,`strong`,`em`,`codespan`,`br`,`del`,`text`].includes(i.type)){n+=e||``;continue}}switch(i.type){case`escape`:{let e=i;n+=t.text(e.text);break}case`html`:{let e=i;n+=t.html(e.text);break}case`link`:{let e=i;n+=t.link(e.href,e.title,this.parseInline(e.tokens,t));break}case`image`:{let e=i;n+=t.image(e.href,e.title,e.text);break}case`strong`:{let e=i;n+=t.strong(this.parseInline(e.tokens,t));break}case`em`:{let e=i;n+=t.em(this.parseInline(e.tokens,t));break}case`codespan`:{let e=i;n+=t.codespan(e.text);break}case`br`:n+=t.br();break;case`del`:{let e=i;n+=t.del(this.parseInline(e.tokens,t));break}case`text`:{let e=i;n+=t.text(e.text);break}default:{let e=`Token with "`+i.type+`" type was not found.`;if(this.options.silent)return console.error(e),``;throw Error(e)}}}return n}},bd=class{options;constructor(e){this.options=e||ou}static passThroughHooks=new Set([`preprocess`,`postprocess`,`processAllTokens`]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}},xd=new class{defaults=au();options=this.setOptions;parse=this.#e(gd.lex,yd.parse);parseInline=this.#e(gd.lexInline,yd.parseInline);Parser=yd;Renderer=_d;TextRenderer=vd;Lexer=gd;Tokenizer=Tu;Hooks=bd;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let r of e)switch(n=n.concat(t.call(this,r)),r.type){case`table`:{let e=r;for(let r of e.header)n=n.concat(this.walkTokens(r.tokens,t));for(let r of e.rows)for(let e of r)n=n.concat(this.walkTokens(e.tokens,t));break}case`list`:{let e=r;n=n.concat(this.walkTokens(e.items,t));break}default:{let e=r;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(r=>{let i=e[r].flat(1/0);n=n.concat(this.walkTokens(i,t))}):e.tokens&&(n=n.concat(this.walkTokens(e.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let n={...e};if(n.async=this.defaults.async||n.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw Error(`extension name required`);if(`renderer`in e){let n=t.renderers[e.name];n?t.renderers[e.name]=function(...t){let r=e.renderer.apply(this,t);return r===!1&&(r=n.apply(this,t)),r}:t.renderers[e.name]=e.renderer}if(`tokenizer`in e){if(!e.level||e.level!==`block`&&e.level!==`inline`)throw Error(`extension level must be 'block' or 'inline'`);let n=t[e.level];n?n.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&(e.level===`block`?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:e.level===`inline`&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}`childTokens`in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),n.extensions=t),e.renderer){let t=this.defaults.renderer||new _d(this.defaults);for(let n in e.renderer){if(!(n in t))throw Error(`renderer '${n}' does not exist`);if(n===`options`)continue;let r=n,i=e.renderer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n||``}}n.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new Tu(this.defaults);for(let n in e.tokenizer){if(!(n in t))throw Error(`tokenizer '${n}' does not exist`);if([`options`,`rules`,`lexer`].includes(n))continue;let r=n,i=e.tokenizer[r],a=t[r];t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new bd;for(let n in e.hooks){if(!(n in t))throw Error(`hook '${n}' does not exist`);if(n===`options`)continue;let r=n,i=e.hooks[r],a=t[r];bd.passThroughHooks.has(n)?t[r]=e=>{if(this.defaults.async)return Promise.resolve(i.call(t,e)).then(e=>a.call(t,e));let n=i.call(t,e);return a.call(t,n)}:t[r]=(...e)=>{let n=i.apply(t,e);return n===!1&&(n=a.apply(t,e)),n}}n.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,r=e.walkTokens;n.walkTokens=function(e){let n=[];return n.push(r.call(this,e)),t&&(n=n.concat(t.call(this,e))),n}}this.defaults={...this.defaults,...n}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return gd.lex(e,t??this.defaults)}parser(e,t){return yd.parse(e,t??this.defaults)}#e(e,t){return(n,r)=>{let i={...r},a={...this.defaults,...i};this.defaults.async===!0&&i.async===!1&&(a.silent||console.warn(`marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored.`),a.async=!0);let o=this.#t(!!a.silent,!!a.async);if(n==null)return o(Error(`marked(): input parameter is undefined or null`));if(typeof n!=`string`)return o(Error(`marked(): input parameter is of type `+Object.prototype.toString.call(n)+`, string expected`));if(a.hooks&&(a.hooks.options=a),a.async)return Promise.resolve(a.hooks?a.hooks.preprocess(n):n).then(t=>e(t,a)).then(e=>a.hooks?a.hooks.processAllTokens(e):e).then(e=>a.walkTokens?Promise.all(this.walkTokens(e,a.walkTokens)).then(()=>e):e).then(e=>t(e,a)).then(e=>a.hooks?a.hooks.postprocess(e):e).catch(o);try{a.hooks&&(n=a.hooks.preprocess(n));let r=e(n,a);a.hooks&&(r=a.hooks.processAllTokens(r)),a.walkTokens&&this.walkTokens(r,a.walkTokens);let i=t(r,a);return a.hooks&&(i=a.hooks.postprocess(i)),i}catch(e){return o(e)}}}#t(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let e=`<p>An error occurred:</p><pre>`+mu(n.message+``,!0)+`</pre>`;return t?Promise.resolve(e):e}if(t)return Promise.reject(n);throw n}}};function X(e,t){return xd.parse(e,t)}X.options=X.setOptions=function(e){return xd.setOptions(e),X.defaults=xd.defaults,su(X.defaults),X},X.getDefaults=au,X.defaults=ou,X.use=function(...e){return xd.use(...e),X.defaults=xd.defaults,su(X.defaults),X},X.walkTokens=function(e,t){return xd.walkTokens(e,t)},X.parseInline=xd.parseInline,X.Parser=yd,X.parser=yd.parse,X.Renderer=_d,X.TextRenderer=vd,X.Lexer=gd,X.lexer=gd.lex,X.Tokenizer=Tu,X.Hooks=bd,X.parse=X,X.options,X.setOptions,X.use,X.walkTokens,X.parseInline,yd.parse,gd.lex,X.use({gfm:!0,breaks:!1,renderer:void 0});function Z(e,t={}){if(!e)return C;let n=t.inline?X.parseInline(e,{async:!1}):X.parse(e,{async:!1}),r=t.className??(t.inline?`pp-markdown-inline`:`pp-markdown`);return t.inline?S`<span class=${r}>${iu(String(n))}</span>`:S`<div class=${r}>${iu(String(n))}</div>`}function Sd(e,t=!1){let n=S`<a class="ref-link" href=${Bc(e.typeSlug,e.slug)}>\u279c ${e.name}</a>`;return t?S`<pp-ref-popover registry-key="${e.componentType}/${e.name}">${n}</pp-ref-popover>`:n}function Cd(e,t){if(!e)return C;if(e.allOf&&Array.isArray(e.allOf)){let n=[],r=!0;for(let t of e.allOf){if(!t.$ref){r=!1;continue}let e=eu(t.$ref);e&&n.push({ref:t.$ref,link:e})}if(r&&n.length>0)return S`<span class="prop-type prop-type-link">
                ${n.map((e,n)=>S`
                    ${n>0?S` <span class="composition-separator">+</span> `:C}
                    ${t(e.ref,e.link)}
                `)}
            </span>`}if(e.type===`array`&&e.items?.allOf&&Array.isArray(e.items.allOf)){let n=[],r=!0;for(let t of e.items.allOf){if(!t.$ref){r=!1;continue}let e=eu(t.$ref);e&&n.push({ref:t.$ref,link:e})}if(r&&n.length>0)return S`<span class="prop-type prop-type-link">Array&lt;${n.map((e,n)=>S`
                ${n>0?S` <span class="composition-separator">+</span> `:C}
                ${t(e.ref,e.link)}
            `)}&gt;</span>`}if(e.type===`array`&&e.items?.$ref){let n=eu(e.items.$ref);if(n)return S`<span class="prop-type prop-type-link">Array&lt;${t(e.items.$ref,n)}&gt;</span>`}let n=e.oneOf??e.anyOf;if(n&&Array.isArray(n)){let e=[],r=!0;for(let t of n){if(!t.$ref){r=!1;break}let n=eu(t.$ref);n&&e.push({ref:t.$ref,link:n})}if(r&&e.length>0)return S`<span class="prop-type prop-type-link">
                ${e.map((e,n)=>S`
                    ${n>0?S` <span class="composition-separator">|</span> `:C}
                    ${t(e.ref,e.link)}
                `)}
            </span>`;let i=n.map(e=>e.title).filter(Boolean);if(i.length===n.length)return S`<span class="prop-type">${i.join(` | `)}</span>`}if(e.$ref){let n=eu(e.$ref);if(n)return S`<span class="prop-type prop-type-link">${t(e.$ref,n)}</span>`}let r=nu(e);return r?S`<span class="prop-type">${r}</span>`:C}function wd(e,t){if(!e)return C;let n=tu(e,{includeExample:t?.includeExample});if(!n.length&&!e.enum?.length)return C;let r=t?.labelSuffix??``;return S`
        <div class="constraints">
            ${n.map(e=>S`
                <span class="constraint-label">${e.label}${r}</span>
                <span class="constraint-value">${e.isCode?S`<code>${e.value}</code>`:e.value}</span>
            `)}
            ${e.enum?.length?S`
                <div class="enum-section">
                    <span class="constraint-label">enum${r}</span>
                    <div class="enum-grid">${e.enum.map(e=>S`<span class="enum-value">${JSON.stringify(e)}</span>`)}</div>
                </div>
            `:C}
        </div>
    `}var Td=x`
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
`,Ed=x`
  :host {
    display: contents;
  }
`,Dd=class extends j{constructor(){super(...arguments),this.observedElements=[],this.disabled=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>{this.emit(`sl-resize`,{detail:{entries:e}})}),this.disabled||this.startObserver()}disconnectedCallback(){super.disconnectedCallback(),this.stopObserver()}handleSlotChange(){this.disabled||this.startObserver()}startObserver(){let e=this.shadowRoot.querySelector(`slot`);if(e!==null){let t=e.assignedElements({flatten:!0});this.observedElements.forEach(e=>this.resizeObserver.unobserve(e)),this.observedElements=[],t.forEach(e=>{this.resizeObserver.observe(e),this.observedElements.push(e)})}}stopObserver(){this.resizeObserver.disconnect()}handleDisabledChange(){this.disabled?this.stopObserver():this.startObserver()}render(){return S` <slot @slotchange=${this.handleSlotChange}></slot> `}};Dd.styles=[E,Ed],w([O({type:Boolean,reflect:!0})],Dd.prototype,`disabled`,2),w([T(`disabled`,{waitUntilFirstUpdate:!0})],Dd.prototype,`handleDisabledChange`,1);var Od=class extends j{constructor(){super(...arguments),this.tabs=[],this.focusableTabs=[],this.panels=[],this.localize=new F(this),this.hasScrollControls=!1,this.shouldHideScrollStartButton=!1,this.shouldHideScrollEndButton=!1,this.placement=`top`,this.activation=`auto`,this.noScrollControls=!1,this.fixedScrollControls=!1,this.scrollOffset=1}connectedCallback(){let e=Promise.all([customElements.whenDefined(`sl-tab`),customElements.whenDefined(`sl-tab-panel`)]);super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(e=>{let t=e.filter(({target:e})=>{if(e===this)return!0;if(e.closest(`sl-tab-group`)!==this)return!1;let t=e.tagName.toLowerCase();return t===`sl-tab`||t===`sl-tab-panel`});if(t.length!==0){if(t.some(e=>![`aria-labelledby`,`aria-controls`].includes(e.attributeName))&&setTimeout(()=>this.setAriaLabels()),t.some(e=>e.attributeName===`disabled`))this.syncTabsAndPanels();else if(t.some(e=>e.attributeName===`active`)){let e=t.filter(e=>e.attributeName===`active`&&e.target.tagName.toLowerCase()===`sl-tab`).map(e=>e.target).find(e=>e.active);e&&this.setActiveTab(e)}}}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,attributeFilter:[`active`,`disabled`,`name`,`panel`],childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),e.then(()=>{new IntersectionObserver((e,t)=>{e[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab(this.getActiveTab()??this.tabs[0],{emitEvents:!1}),t.unobserve(e[0].target))}).observe(this.tabGroup)})})}disconnectedCallback(){var e,t;super.disconnectedCallback(),(e=this.mutationObserver)==null||e.disconnect(),this.nav&&((t=this.resizeObserver)==null||t.unobserve(this.nav))}getAllTabs(){return this.shadowRoot.querySelector(`slot[name="nav"]`).assignedElements()}getAllPanels(){return[...this.body.assignedElements()].filter(e=>e.tagName.toLowerCase()===`sl-tab-panel`)}getActiveTab(){return this.tabs.find(e=>e.active)}handleClick(e){let t=e.target.closest(`sl-tab`);t?.closest(`sl-tab-group`)===this&&t!==null&&this.setActiveTab(t,{scrollBehavior:`smooth`})}handleKeyDown(e){let t=e.target.closest(`sl-tab`);if(t?.closest(`sl-tab-group`)===this&&([`Enter`,` `].includes(e.key)&&t!==null&&(this.setActiveTab(t,{scrollBehavior:`smooth`}),e.preventDefault()),[`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`].includes(e.key))){let t=this.tabs.find(e=>e.matches(`:focus`)),n=this.localize.dir()===`rtl`,r=null;if(t?.tagName.toLowerCase()===`sl-tab`){if(e.key===`Home`)r=this.focusableTabs[0];else if(e.key===`End`)r=this.focusableTabs[this.focusableTabs.length-1];else if([`top`,`bottom`].includes(this.placement)&&e.key===(n?`ArrowRight`:`ArrowLeft`)||[`start`,`end`].includes(this.placement)&&e.key===`ArrowUp`){let e=this.tabs.findIndex(e=>e===t);r=this.findNextFocusableTab(e,`backward`)}else if([`top`,`bottom`].includes(this.placement)&&e.key===(n?`ArrowLeft`:`ArrowRight`)||[`start`,`end`].includes(this.placement)&&e.key===`ArrowDown`){let e=this.tabs.findIndex(e=>e===t);r=this.findNextFocusableTab(e,`forward`)}if(!r)return;r.tabIndex=0,r.focus({preventScroll:!0}),this.activation===`auto`?this.setActiveTab(r,{scrollBehavior:`smooth`}):this.tabs.forEach(e=>{e.tabIndex=e===r?0:-1}),[`top`,`bottom`].includes(this.placement)&&io(r,this.nav,`horizontal`),e.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()===`rtl`?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:`smooth`})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()===`rtl`?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:`smooth`})}setActiveTab(e,t){if(t=Rn({emitEvents:!0,scrollBehavior:`auto`},t),e!==this.activeTab&&!e.disabled){let n=this.activeTab;this.activeTab=e,this.tabs.forEach(e=>{e.active=e===this.activeTab,e.tabIndex=e===this.activeTab?0:-1}),this.panels.forEach(e=>e.active=e.name===this.activeTab?.panel),this.syncIndicator(),[`top`,`bottom`].includes(this.placement)&&io(this.activeTab,this.nav,`horizontal`,t.scrollBehavior),t.emitEvents&&(n&&this.emit(`sl-tab-hide`,{detail:{name:n.panel}}),this.emit(`sl-tab-show`,{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(e=>{let t=this.panels.find(t=>t.name===e.panel);t&&(e.setAttribute(`aria-controls`,t.getAttribute(`id`)),t.setAttribute(`aria-labelledby`,e.getAttribute(`id`)))})}repositionIndicator(){let e=this.getActiveTab();if(!e)return;let t=e.clientWidth,n=e.clientHeight,r=this.localize.dir()===`rtl`,i=this.getAllTabs(),a=i.slice(0,i.indexOf(e)).reduce((e,t)=>({left:e.left+t.clientWidth,top:e.top+t.clientHeight}),{left:0,top:0});switch(this.placement){case`top`:case`bottom`:this.indicator.style.width=`${t}px`,this.indicator.style.height=`auto`,this.indicator.style.translate=r?`${-1*a.left}px`:`${a.left}px`;break;case`start`:case`end`:this.indicator.style.width=`auto`,this.indicator.style.height=`${n}px`,this.indicator.style.translate=`0 ${a.top}px`;break}}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.focusableTabs=this.tabs.filter(e=>!e.disabled),this.panels=this.getAllPanels(),this.syncIndicator(),this.updateComplete.then(()=>this.updateScrollControls())}findNextFocusableTab(e,t){let n=null,r=t===`forward`?1:-1,i=e+r;for(;e<this.tabs.length;){if(n=this.tabs[i]||null,n===null){n=t===`forward`?this.focusableTabs[0]:this.focusableTabs[this.focusableTabs.length-1];break}if(!n.disabled)break;i+=r}return n}updateScrollButtons(){this.hasScrollControls&&!this.fixedScrollControls&&(this.shouldHideScrollStartButton=this.scrollFromStart()<=this.scrollOffset,this.shouldHideScrollEndButton=this.isScrolledToEnd())}isScrolledToEnd(){return this.scrollFromStart()+this.nav.clientWidth>=this.nav.scrollWidth-this.scrollOffset}scrollFromStart(){return this.localize.dir()===`rtl`?-this.nav.scrollLeft:this.nav.scrollLeft}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=[`top`,`bottom`].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth+1,this.updateScrollButtons()}syncIndicator(){this.getActiveTab()?(this.indicator.style.display=`block`,this.repositionIndicator()):this.indicator.style.display=`none`}show(e){let t=this.tabs.find(t=>t.panel===e);t&&this.setActiveTab(t,{scrollBehavior:`smooth`})}render(){let e=this.localize.dir()===`rtl`;return S`
      <div
        part="base"
        class=${M({"tab-group":!0,"tab-group--top":this.placement===`top`,"tab-group--bottom":this.placement===`bottom`,"tab-group--start":this.placement===`start`,"tab-group--end":this.placement===`end`,"tab-group--rtl":this.localize.dir()===`rtl`,"tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?S`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class=${M({"tab-group__scroll-button":!0,"tab-group__scroll-button--start":!0,"tab-group__scroll-button--start--hidden":this.shouldHideScrollStartButton})}
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

          ${this.hasScrollControls?S`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class=${M({"tab-group__scroll-button":!0,"tab-group__scroll-button--end":!0,"tab-group__scroll-button--end--hidden":this.shouldHideScrollEndButton})}
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
    `}};Od.styles=[E,Td],Od.dependencies={"sl-icon-button":P,"sl-resize-observer":Dd},w([A(`.tab-group`)],Od.prototype,`tabGroup`,2),w([A(`.tab-group__body`)],Od.prototype,`body`,2),w([A(`.tab-group__nav`)],Od.prototype,`nav`,2),w([A(`.tab-group__indicator`)],Od.prototype,`indicator`,2),w([k()],Od.prototype,`hasScrollControls`,2),w([k()],Od.prototype,`shouldHideScrollStartButton`,2),w([k()],Od.prototype,`shouldHideScrollEndButton`,2),w([O()],Od.prototype,`placement`,2),w([O()],Od.prototype,`activation`,2),w([O({attribute:`no-scroll-controls`,type:Boolean})],Od.prototype,`noScrollControls`,2),w([O({attribute:`fixed-scroll-controls`,type:Boolean})],Od.prototype,`fixedScrollControls`,2),w([Jn({passive:!0})],Od.prototype,`updateScrollButtons`,1),w([T(`noScrollControls`,{waitUntilFirstUpdate:!0})],Od.prototype,`updateScrollControls`,1),w([T(`placement`,{waitUntilFirstUpdate:!0})],Od.prototype,`syncIndicator`,1),Od.define(`sl-tab-group`);var kd=(e,t)=>{let n=0;return function(...r){window.clearTimeout(n),n=window.setTimeout(()=>{e.call(this,...r)},t)}},Ad=(e,t,n)=>{let r=e[t];e[t]=function(...e){r.call(this,...e),n.call(this,r,...e)}};(()=>{if(!(typeof window>`u`)&&!(`onscrollend`in window)){let e=new Set,t=new WeakMap,n=t=>{for(let n of t.changedTouches)e.add(n.identifier)},r=t=>{for(let n of t.changedTouches)e.delete(n.identifier)};document.addEventListener(`touchstart`,n,!0),document.addEventListener(`touchend`,r,!0),document.addEventListener(`touchcancel`,r,!0),Ad(EventTarget.prototype,`addEventListener`,function(n,r){if(r!==`scrollend`)return;let i=kd(()=>{e.size?i():this.dispatchEvent(new Event(`scrollend`))},100);n.call(this,`scroll`,i,{passive:!0}),t.set(this,i)}),Ad(EventTarget.prototype,`removeEventListener`,function(e,n){if(n!==`scrollend`)return;let r=t.get(this);r&&e.call(this,`scroll`,r,{passive:!0})})}})();var jd=x`
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
`,Md=0,Nd=class extends j{constructor(){super(...arguments),this.localize=new F(this),this.attrId=++Md,this.componentId=`sl-tab-${this.attrId}`,this.panel=``,this.active=!1,this.closable=!1,this.disabled=!1,this.tabIndex=0}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`tab`)}handleCloseClick(e){e.stopPropagation(),this.emit(`sl-close`)}handleActiveChange(){this.setAttribute(`aria-selected`,this.active?`true`:`false`)}handleDisabledChange(){this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`),this.disabled&&!this.active?this.tabIndex=-1:this.tabIndex=0}render(){return this.id=this.id.length>0?this.id:this.componentId,S`
      <div
        part="base"
        class=${M({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
      >
        <slot></slot>
        ${this.closable?S`
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
    `}};Nd.styles=[E,jd],Nd.dependencies={"sl-icon-button":P},w([A(`.tab`)],Nd.prototype,`tab`,2),w([O({reflect:!0})],Nd.prototype,`panel`,2),w([O({type:Boolean,reflect:!0})],Nd.prototype,`active`,2),w([O({type:Boolean,reflect:!0})],Nd.prototype,`closable`,2),w([O({type:Boolean,reflect:!0})],Nd.prototype,`disabled`,2),w([O({type:Number,reflect:!0})],Nd.prototype,`tabIndex`,2),w([T(`active`)],Nd.prototype,`handleActiveChange`,1),w([T(`disabled`)],Nd.prototype,`handleDisabledChange`,1),Nd.define(`sl-tab`);var Pd=x`
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
`,Fd=0,Id=class extends j{constructor(){super(...arguments),this.attrId=++Fd,this.componentId=`sl-tab-panel-${this.attrId}`,this.name=``,this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute(`role`,`tabpanel`)}handleActiveChange(){this.setAttribute(`aria-hidden`,this.active?`false`:`true`)}render(){return S`
      <slot
        part="base"
        class=${M({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};Id.styles=[E,Pd],w([O({reflect:!0})],Id.prototype,`name`,2),w([O({type:Boolean,reflect:!0})],Id.prototype,`active`,2),w([T(`active`)],Id.prototype,`handleActiveChange`,1),Id.define(`sl-tab-panel`);var Ld=200,Rd=180,zd=52,Bd=10,Vd=20,Hd=10.5,Ud=16,Wd=224,Gd=160,Kd=260,qd=340,Jd=56,Yd=9.5,Xd=32,Zd=340,Qd=40,$d=72,ef=250,tf=170,nf=208,rf=class extends U{constructor(...e){super(...e),this.schemaJson=``,this.compact=!1,this.condensed=!1,this.constrained=!1,this.popoverContext=!1,this.schema=null,this.availableWidth=0,this.polymorphicSelections={},this.resizeObserver=null}connectedCallback(){super.connectedCallback(),this.updateAvailableWidth(),!(typeof ResizeObserver>`u`)&&(this.resizeObserver=new ResizeObserver(e=>{let t=e[0]?.contentRect?.width??this.getBoundingClientRect().width;this.setAvailableWidth(t)}),this.resizeObserver.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver?.disconnect(),this.resizeObserver=null}willUpdate(e){if(e.has(`schemaJson`)&&this.schemaJson)try{this.schema=JSON.parse(this.schemaJson),this.polymorphicSelections={},this.computeNameColumnWidth(),this.primeReferencedSchemas(this.schema)}catch{this.schema=null}}updateAvailableWidth(){this.setAvailableWidth(this.getBoundingClientRect().width)}setAvailableWidth(e){if(!Number.isFinite(e))return;let t=Math.round(e);t!==this.availableWidth&&(this.availableWidth=t)}async primeReferencedSchemas(e){await se(e),this.requestUpdate()}parseRegistrySchema(e,t){if(t.has(e))return null;let n=ie(e);if(!n?.schemaJson)return null;try{return t.add(e),JSON.parse(n.schemaJson)}catch{return null}}resolveRenderableTarget(e,t=new Set){return e?.$ref?this.parseRegistrySchema(e.$ref,t)??e:e}collectRenderedNameMetrics(e,t=new Set){if(!e||typeof e!=`object`)return{maxLen:0,hasRequired:!1};let n=0,r=!1,i=e.properties,a=new Set(e.required??[]);if(i&&typeof i==`object`)for(let[e,o]of Object.entries(i)){n=Math.max(n,e.length),a.has(e)&&(r=!0);let i=this.collectRenderedNameMetrics(o,t);n=Math.max(n,i.maxLen),r||=i.hasRequired}for(let i of[`allOf`,`oneOf`,`anyOf`]){let a=e[i];if(Array.isArray(a))for(let e of a){if(e?.$ref){if(i!==`allOf`)continue;let a=this.parseRegistrySchema(e.$ref,t);if(!a)continue;let o=this.collectRenderedNameMetrics(a,t);n=Math.max(n,o.maxLen),r||=o.hasRequired;continue}let a=this.collectRenderedNameMetrics(e,t);n=Math.max(n,a.maxLen),r||=a.hasRequired}}if(e.items){let i=e.items;if(i.$ref){let e=this.parseRegistrySchema(i.$ref,t);if(e){let i=this.collectRenderedNameMetrics(e,t);n=Math.max(n,i.maxLen),r||=i.hasRequired}}else{let e=this.collectRenderedNameMetrics(i,t);n=Math.max(n,e.maxLen),r||=e.hasRequired}}return{maxLen:n,hasRequired:r}}computeNameColumnWidth(){if(!this.schema)return;let{maxLen:e}=this.collectRenderedNameMetrics(this.schema),t=e*Hd,n=Math.max(Rd,zd+Bd+t+Vd);this.style.setProperty(`--compact-name-width`,`${Math.round(n)}px`)}renderRefAnchor(e,t){return S`
            <pp-ref-popover schema-ref="${e}">${S`<a class="ref-type-link" href="${t.href}">\u279c ${t.name}</a>`}</pp-ref-popover>`}renderType(e){return Cd(e,(e,t)=>this.renderRefAnchor(e,t))}renderPropertyRow(e,t,n){let r=n.has(e);return S`
            <div class="property">
                <div class="prop-name-col">
                    <span class="required-badge ${r?``:`required-badge-placeholder`}" aria-hidden=${r?`false`:`true`}>${`req`}</span>
                    <span class="prop-name ${r?`required`:``}">${e}</span>
                </div>
                <div class="prop-type-col">
                    ${this.renderType(t)}
                    ${wd(t,{labelSuffix:`:`})}
                </div>
                <div class="prop-desc-col">
                    ${Z(t.description)}
                </div>
            </div>
        `}renderPropertyTable(e,t,n=`$.properties`){let r=Object.entries(e);return r.length?r.map(([e,r])=>{let i=r.oneOf??r.anyOf;return i&&Array.isArray(i)?S`
                    <div class="property-oneof">
                        ${this.renderOneOf(i,e,r.description,t.has(e),`polymorphic`,`${n}.${e}`)}
                    </div>
                `:this.renderPropertyRow(e,r,t)}):C}renderCompositionRefs(e){return S`
            <div class="composition-refs">
                <span class="composition-label">Composed from</span>
                ${e.map(e=>{let t=eu(e.$ref);if(!t)return C;let n=v(e.$ref)?.description??``;return S`
                        <div class="composition-ref-entry">
                            <span class="composition-ref-link">${this.renderRefAnchor(e.$ref,t)}</span>
                            ${n?Z(n,{className:`composition-ref-desc pp-markdown`}):C}
                        </div>
                    `})}
            </div>
        `}mergePropertyMaps(e,t){for(let[n,r]of Object.entries(t))e[n]=r}collectCompositionData(e,t=new Set){let n=[],r=new Set(e?.required||[]),i={};e?.properties&&this.mergePropertyMaps(i,e.properties);let a=Array.isArray(e?.allOf)?e.allOf:[];for(let e of a){if(e?.$ref){n.push(e);let a=this.parseRegistrySchema(e.$ref,t);if(!a)continue;let o=this.collectCompositionData(a,t);o.refEntries.length&&n.push(...o.refEntries),this.mergePropertyMaps(i,o.mergedProperties);for(let e of o.mergedRequired)r.add(e);continue}if(e?.allOf&&Array.isArray(e.allOf)){let a=this.collectCompositionData(e,t);a.refEntries.length&&n.push(...a.refEntries),this.mergePropertyMaps(i,a.mergedProperties);for(let e of a.mergedRequired)r.add(e);continue}if(e?.properties&&this.mergePropertyMaps(i,e.properties),e?.required)for(let t of e.required)r.add(t)}return{refEntries:n,mergedRequired:r,mergedProperties:i}}renderComposition(e){let{refEntries:t,mergedRequired:n,mergedProperties:r}=this.collectCompositionData(e),i=t.filter((e,n)=>e?.$ref&&t.findIndex(t=>t?.$ref===e.$ref)===n);return S`
            ${i.length?this.renderCompositionRefs(i):C}
            ${Object.keys(r).length?this.renderPropertyTable(r,n,`$.allOf.properties`):C}
        `}renderOneOf(e,t,n,r,i,a=`$.oneOf`){if(!e.length)return C;let o=this.getPolymorphicSelectionKey(a,e),s=this.getSelectedPolymorphicIndex(o,e),c=e[s],l=this.getPolymorphicOptionLabel(c,s),u=this.shouldUsePolymorphicDropdown(e,t),d=e.length>1;return S`
            <div class=${[`oneof-property`,d?``:`oneof-property-single`,d&&u&&this.popoverContext?`oneof-property-popover-dropdown`:``].filter(Boolean).join(` `)}>
                <div class="oneof-left">
                    ${t?S`
                        <div class="oneof-prop-name">
                            <span class="required-badge ${r?``:`required-badge-placeholder`}" aria-hidden=${r?`false`:`true`}>req</span>
                            <span class="prop-name">${t}</span>
                            ${i?S`<div class="composition-label polymorphic">(${i})</div>`:C}
                        </div>
                    `:C}
                    ${n?Z(n,{className:`oneof-prop-desc pp-markdown`}):C}
                </div>
                ${d?S`
                        <div class="oneof-desc-container">
                            ${u?S`
                            <div class="polymorphic-dropdown-row">
                                <sl-dropdown class="polymorphic-dropdown" skidding="5" distance="5">
                                    <sl-button slot="trigger" caret>${l}</sl-button>
                                    <sl-menu @sl-select=${t=>this.handlePolymorphicSelect(t,o,e.length)}>
                                        ${e.map((e,t)=>S`
                                            <sl-menu-item value="${t}">${this.getPolymorphicOptionLabel(e,t)}</sl-menu-item>
                                        `)}
                                    </sl-menu>
                                </sl-dropdown>
                            </div>
                            <div class="oneof-dropdown-panel">
                                ${this.renderOneOfOption(c,`${a}[${s}]`)}
                            </div>
                        `:S`
                            <sl-tab-group class="oneof-tabs" placement="start">
                                ${e.map((e,t)=>S`
                                    <sl-tab slot="nav" panel="${o}-${t}" class="oneof-tab" ?active=${t===s}>
                                        \u203A ${this.getPolymorphicOptionLabel(e,t)}
                                    </sl-tab>
                                `)}
                                ${e.map((e,t)=>S`
                                    <sl-tab-panel name="${o}-${t}" ?active=${t===s}>
                                        ${this.renderOneOfOption(e,`${a}[${t}]`)}
                                    </sl-tab-panel>
                                `)}
                            </sl-tab-group>
                        `}
                        </div>
                    `:S`
                        <div class="oneof-single-value">
                            ${this.renderOneOfSingleValue(c)}
                        </div>
                        ${this.renderOneOfSingleBody(c,`${a}[${s}]`)}
                    `}
            </div>
        `}getPolymorphicOptionLabel(e,t){return e?.title||e?.$ref?.split(`/`).pop()||`Option ${t+1}`}getPolymorphicSelectionKey(e,t){return`${e}:${t.map((e,t)=>this.getPolymorphicOptionLabel(e,t)).join(`|`)}`}getSelectedPolymorphicIndex(e,t){let n=this.polymorphicSelections[e]??0;return n>=0&&n<t.length?n:0}handlePolymorphicSelect(e,t,n){let r=e.detail?.item?.value;if(r===void 0)return;let i=parseInt(r,10);!Number.isFinite(i)||i<0||i>=n||(this.polymorphicSelections={...this.polymorphicSelections,[t]:i})}getCompactNameWidth(){let e=parseFloat(this.style.getPropertyValue(`--compact-name-width`));return Number.isFinite(e)?e:Ld}getCssLengthPx(e,t){let n=e.trim(),r=parseFloat(n);if(!Number.isFinite(r))return t;if(n.endsWith(`rem`)){let e=parseFloat(getComputedStyle(document.documentElement).fontSize);return r*(Number.isFinite(e)?e:Ud)}if(n.endsWith(`em`)){let e=parseFloat(getComputedStyle(this).fontSize);return r*(Number.isFinite(e)?e:Ud)}return r}getPolymorphicConstrainedLeftWidth(){return this.getCssLengthPx(getComputedStyle(this).getPropertyValue(`--polymorphic-constrained-left-width`),Wd)}getPolymorphicVerticalTabRailWidth(){let e=getComputedStyle(this);return this.compact?this.getCssLengthPx(e.getPropertyValue(`--polymorphic-compact-tab-rail-width`),nf):this.condensed?this.getCssLengthPx(e.getPropertyValue(`--polymorphic-condensed-tab-rail-width`),tf):this.getCssLengthPx(e.getPropertyValue(`--polymorphic-tab-rail-width`),ef)}getPolymorphicLeftWidth(e){if(!e)return 0;let t=zd+e.length*Hd,n=Math.max(this.getCompactNameWidth(),t);return this.constrained?Math.min(n,this.getPolymorphicConstrainedLeftWidth()):n}shouldUsePolymorphicDropdown(e,t){if(this.popoverContext)return!0;let n=this.availableWidth||this.getBoundingClientRect().width||this.offsetWidth;if(!n)return!1;let r=e.reduce((e,t,n)=>Math.max(e,this.getPolymorphicOptionLabel(t,n).length),0),i=this.condensed?Kd:qd,a=Math.max(Gd,Math.min(i,Jd+r*Yd)),o=this.getPolymorphicVerticalTabRailWidth();if(a>o)return!0;let s=this.getPolymorphicLeftWidth(t),c=this.constrained?Qd:$d;return this.constrained?s+o+Xd+c>n:s+a+Zd+c>n}renderOneOfSingleValue(e){return S`
            ${this.renderType(e)}
            ${wd(e,{labelSuffix:`:`})}
        `}renderOneOfSingleBody(e,t=`$.oneOf[0]`){if(e.$ref)return C;let n=new Set(e.required||[]);return!e.description&&!e.properties?C:S`
            <div class="oneof-single-panel">
                ${e.description?Z(e.description,{className:`oneof-option-desc pp-markdown`}):C}
                ${e.properties?this.renderPropertyTable(e.properties,n,`${t}.properties`):C}
            </div>
        `}renderOneOfOption(e,t=`$.oneOf[0]`){if(e.$ref){let t=eu(e.$ref);if(!t)return C;let n=v(e.$ref);return S`
                <div class="oneof-option-header">
                    ${this.renderRefAnchor(e.$ref,t)}
                    ${n?.description?Z(n.description,{className:`oneof-option-desc pp-markdown`}):C}
                </div>
            `}let n=new Set(e.required||[]),r=nu(e);return S`
            ${e.description?Z(e.description,{className:`oneof-option-desc pp-markdown`}):C}
            ${e.properties?this.renderPropertyTable(e.properties,n,`${t}.properties`):r?S`<div class="oneof-option-scalar"><span class="prop-type">${r}</span>${wd(e,{labelSuffix:`:`})}</div>`:C}
        `}render(){if(!this.schema)return C;let e=this.schema.type===`array`&&(this.schema.items?.properties||this.schema.items?.allOf||this.schema.items?.oneOf||this.schema.items?.anyOf)?this.schema.items:this.schema,t=this.resolveRenderableTarget(e);if(t.allOf&&Array.isArray(t.allOf))return this.renderComposition(t);if(t.oneOf&&Array.isArray(t.oneOf))return this.renderOneOf(t.oneOf,`ONE OF`,void 0,void 0,`polymorphic`,`$.oneOf`);if(t.anyOf&&Array.isArray(t.anyOf))return this.renderOneOf(t.anyOf,`ANY OF`,void 0,void 0,`polymorphic`,`$.anyOf`);let n=t.properties||{},r=new Set(t.required||[]);if(!Object.entries(n).length){let e=nu(t);return!e&&!t.description?C:S`
                <div class="property scalar">
                    <div class="prop-type-col">
                        ${e?S`<span class="prop-type">${e}</span>`:C}
                        ${wd(t,{labelSuffix:`:`})}
                    </div>
                    <div class="prop-desc-col">
                        ${Z(t.description)}
                    </div>
                </div>
            `}return this.renderPropertyTable(n,r)}};K([O({attribute:`schema-json`})],rf.prototype,`schemaJson`,void 0),K([O({type:Boolean,reflect:!0})],rf.prototype,`compact`,void 0),K([O({type:Boolean,reflect:!0})],rf.prototype,`condensed`,void 0),K([O({type:Boolean,reflect:!0})],rf.prototype,`constrained`,void 0),K([O({attribute:`popover-context`,type:Boolean,reflect:!0})],rf.prototype,`popoverContext`,void 0),K([k()],rf.prototype,`schema`,void 0),K([k()],rf.prototype,`availableWidth`,void 0),K([k()],rf.prototype,`polymorphicSelections`,void 0),rf=K([D(`pp-schema-properties`)],rf);var af=l(s(((e,t)=>{var n=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,r={},i={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/\u00a0/g,` `)},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,`__id`,{value:++n}),e.__id},clone:function e(t,n){n||={};var r,a;switch(i.util.type(t)){case`Object`:if(a=i.util.objId(t),n[a])return n[a];for(var o in r={},n[a]=r,t)t.hasOwnProperty(o)&&(r[o]=e(t[o],n));return r;case`Array`:return a=i.util.objId(t),n[a]?n[a]:(r=[],n[a]=r,t.forEach(function(t,i){r[i]=e(t,n)}),r);default:return t}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return`none`},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,`gi`),``),e.classList.add(`language-`+n)},currentScript:function(){if(typeof document>`u`)return null;if(document.currentScript&&document.currentScript.tagName===`SCRIPT`)return document.currentScript;try{throw Error()}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var t=document.getElementsByTagName(`script`);for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var r=`no-`+t;e;){var i=e.classList;if(i.contains(t))return!0;if(i.contains(r))return!1;e=e.parentElement}return!!n}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,t){var n=i.util.clone(i.languages[e]);for(var r in t)n[r]=t[r];return n},insertBefore:function(e,t,n,r){r||=i.languages;var a=r[e],o={};for(var s in a)if(a.hasOwnProperty(s)){if(s==t)for(var c in n)n.hasOwnProperty(c)&&(o[c]=n[c]);n.hasOwnProperty(s)||(o[s]=a[s])}var l=r[e];return r[e]=o,i.languages.DFS(i.languages,function(t,n){n===l&&t!=e&&(this[t]=o)}),o},DFS:function e(t,n,r,a){a||={};var o=i.util.objId;for(var s in t)if(t.hasOwnProperty(s)){n.call(t,s,t[s],r||s);var c=t[s],l=i.util.type(c);l===`Object`&&!a[o(c)]?(a[o(c)]=!0,e(c,n,null,a)):l===`Array`&&!a[o(c)]&&(a[o(c)]=!0,e(c,n,s,a))}}},plugins:{},highlightAll:function(e,t){i.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var r={callback:n,container:e,selector:`code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code`};i.hooks.run(`before-highlightall`,r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),i.hooks.run(`before-all-elements-highlight`,r);for(var a=0,o;o=r.elements[a++];)i.highlightElement(o,t===!0,r.callback)},highlightElement:function(t,n,r){var a=i.util.getLanguage(t),o=i.languages[a];i.util.setLanguage(t,a);var s=t.parentElement;s&&s.nodeName.toLowerCase()===`pre`&&i.util.setLanguage(s,a);var c={element:t,language:a,grammar:o,code:t.textContent};function l(e){c.highlightedCode=e,i.hooks.run(`before-insert`,c),c.element.innerHTML=c.highlightedCode,i.hooks.run(`after-highlight`,c),i.hooks.run(`complete`,c),r&&r.call(c.element)}if(i.hooks.run(`before-sanity-check`,c),s=c.element.parentElement,s&&s.nodeName.toLowerCase()===`pre`&&!s.hasAttribute(`tabindex`)&&s.setAttribute(`tabindex`,`0`),!c.code){i.hooks.run(`complete`,c),r&&r.call(c.element);return}if(i.hooks.run(`before-highlight`,c),!c.grammar){l(i.util.encode(c.code));return}if(n&&e.Worker){var u=new Worker(i.filename);u.onmessage=function(e){l(e.data)},u.postMessage(JSON.stringify({language:c.language,code:c.code,immediateClose:!0}))}else l(i.highlight(c.code,c.grammar,c.language))},highlight:function(e,t,n){var r={code:e,grammar:t,language:n};if(i.hooks.run(`before-tokenize`,r),!r.grammar)throw Error(`The language "`+r.language+`" has no grammar.`);return r.tokens=i.tokenize(r.code,r.grammar),i.hooks.run(`after-tokenize`,r),a.stringify(i.util.encode(r.tokens),r.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var r in n)t[r]=n[r];delete t.rest}var i=new c;return l(i,i.head,e),s(e,i,t,i.head,0),d(i)},hooks:{all:{},add:function(e,t){var n=i.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=i.hooks.all[e];if(!(!n||!n.length))for(var r=0,a;a=n[r++];)a(t)}},Token:a};e.Prism=i;function a(e,t,n,r){this.type=e,this.content=t,this.alias=n,this.length=(r||``).length|0}a.stringify=function e(t,n){if(typeof t==`string`)return t;if(Array.isArray(t)){var r=``;return t.forEach(function(t){r+=e(t,n)}),r}var a={type:t.type,content:e(t.content,n),tag:`span`,classes:[`token`,t.type],attributes:{},language:n},o=t.alias;o&&(Array.isArray(o)?Array.prototype.push.apply(a.classes,o):a.classes.push(o)),i.hooks.run(`wrap`,a);var s=``;for(var c in a.attributes)s+=` `+c+`="`+(a.attributes[c]||``).replace(/"/g,`&quot;`)+`"`;return`<`+a.tag+` class="`+a.classes.join(` `)+`"`+s+`>`+a.content+`</`+a.tag+`>`};function o(e,t,n,r){e.lastIndex=t;var i=e.exec(n);if(i&&r&&i[1]){var a=i[1].length;i.index+=a,i[0]=i[0].slice(a)}return i}function s(e,t,n,r,c,d){for(var f in n)if(!(!n.hasOwnProperty(f)||!n[f])){var p=n[f];p=Array.isArray(p)?p:[p];for(var m=0;m<p.length;++m){if(d&&d.cause==f+`,`+m)return;var h=p[m],g=h.inside,_=!!h.lookbehind,ee=!!h.greedy,te=h.alias;if(ee&&!h.pattern.global){var ne=h.pattern.toString().match(/[imsuy]*$/)[0];h.pattern=RegExp(h.pattern.source,ne+`g`)}for(var re=h.pattern||h,v=r.next,y=c;v!==t.tail&&!(d&&y>=d.reach);y+=v.value.length,v=v.next){var ie=v.value;if(t.length>e.length)return;if(!(ie instanceof a)){var ae=1,oe;if(ee){if(oe=o(re,y,e,_),!oe||oe.index>=e.length)break;var se=oe.index,ce=oe.index+oe[0].length,le=y;for(le+=v.value.length;se>=le;)v=v.next,le+=v.value.length;if(le-=v.value.length,y=le,v.value instanceof a)continue;for(var ue=v;ue!==t.tail&&(le<ce||typeof ue.value==`string`);ue=ue.next)ae++,le+=ue.value.length;ae--,ie=e.slice(y,le),oe.index-=y}else if(oe=o(re,0,ie,_),!oe)continue;var se=oe.index,de=oe[0],fe=ie.slice(0,se),pe=ie.slice(se+de.length),me=y+ie.length;d&&me>d.reach&&(d.reach=me);var he=v.prev;fe&&(he=l(t,he,fe),y+=fe.length),u(t,he,ae);var ge=new a(f,g?i.tokenize(de,g):de,te,de);if(v=l(t,he,ge),pe&&l(t,v,pe),ae>1){var _e={cause:f+`,`+m,reach:me};s(e,t,n,v.prev,y,_e),d&&_e.reach>d.reach&&(d.reach=_e.reach)}}}}}}function c(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function l(e,t,n){var r=t.next,i={value:n,prev:t,next:r};return t.next=i,r.prev=i,e.length++,i}function u(e,t,n){for(var r=t.next,i=0;i<n&&r!==e.tail;i++)r=r.next;t.next=r,r.prev=t,e.length-=i}function d(e){for(var t=[],n=e.head.next;n!==e.tail;)t.push(n.value),n=n.next;return t}if(!e.document)return e.addEventListener&&(i.disableWorkerMessageHandler||e.addEventListener(`message`,function(t){var n=JSON.parse(t.data),r=n.language,a=n.code,o=n.immediateClose;e.postMessage(i.highlight(a,i.languages[r],r)),o&&e.close()},!1)),i;var f=i.util.currentScript();f&&(i.filename=f.src,f.hasAttribute(`data-manual`)&&(i.manual=!0));function p(){i.manual||i.highlightAll()}if(!i.manual){var m=document.readyState;m===`loading`||m===`interactive`&&f&&f.defer?document.addEventListener(`DOMContentLoaded`,p):window.requestAnimationFrame?window.requestAnimationFrame(p):window.setTimeout(p,16)}return i}(typeof window<`u`?window:typeof WorkerGlobalScope<`u`&&self instanceof WorkerGlobalScope?self:{});t!==void 0&&t.exports&&(t.exports=n),typeof global<`u`&&(global.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside[`attr-value`].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside[`internal-subset`].inside=n.languages.markup,n.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(n.languages.markup.tag,`addInlined`,{value:function(e,t){var r={};r[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[t]},r.cdata=/^<!\[CDATA\[|\]\]>$/i;var i={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:r}};i[`language-`+t]={pattern:/[\s\S]+/,inside:n.languages[t]};var a={};a[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:i},n.languages.insertBefore(`markup`,`cdata`,a)}}),Object.defineProperty(n.languages.markup.tag,`addAttribute`,{value:function(e,t){n.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:n.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend(`markup`,{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,(function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|`+t.source+`)*?(?:;|(?=\\s*\\{))`),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:`selector`},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp(`\\burl\\((?:`+t.source+`|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`,`i`),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp(`^`+t.source+`$`),alias:`url`}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+t.source+`)*(?=\\s*\\{)`),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined(`style`,`css`),n.tag.addAttribute(`style`,`css`))})(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend(`clike`,{"class-name":[n.languages.clike[`class-name`],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(`(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])`),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript[`class-name`][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore(`javascript`,`keyword`,{regex:{pattern:RegExp(`((?:^|[^$\\w\\xA0-\\uFFFF."'\\])\\s]|\\b(?:return|yield))\\s*)\\/(?:(?:\\[(?:[^\\]\\\\\\r\\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.|\\[(?:[^[\\]\\\\\\r\\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\\r\\n])+\\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|\\/\\*(?:[^*]|\\*(?!\\/))*\\*\\/)*(?:$|[\\r\\n,.;:})\\]]|\\/\\/))`),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:`language-regex`,inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:`function`},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore(`javascript`,`string`,{hashbang:{pattern:/^#!.*/,greedy:!0,alias:`comment`},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:`string`},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:`punctuation`},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:`property`}}),n.languages.insertBefore(`javascript`,`operator`,{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:`property`}}),n.languages.markup&&(n.languages.markup.tag.addInlined(`script`,`javascript`),n.languages.markup.tag.addAttribute(`on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)`,`javascript`)),n.languages.js=n.languages.javascript,(function(){if(n===void 0||typeof document>`u`)return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var e=`Loading…`,t=function(e,t){return`✖ Error `+e+` while fetching file: `+t},r=`✖ Error: File does not exist or is empty`,i={js:`javascript`,py:`python`,rb:`ruby`,ps1:`powershell`,psm1:`powershell`,sh:`bash`,bat:`batch`,h:`c`,tex:`latex`},a=`data-src-status`,o=`loading`,s=`loaded`,c=`failed`,l=`pre[data-src]:not([`+a+`="`+s+`"]):not([`+a+`="`+o+`"])`;function u(e,n,i){var a=new XMLHttpRequest;a.open(`GET`,e,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?n(a.responseText):a.status>=400?i(t(a.status,a.statusText)):i(r))},a.send(null)}function d(e){var t=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e||``);if(t){var n=Number(t[1]),r=t[2],i=t[3];return r?i?[n,Number(i)]:[n,void 0]:[n,n]}}n.hooks.add(`before-highlightall`,function(e){e.selector+=`, `+l}),n.hooks.add(`before-sanity-check`,function(t){var r=t.element;if(r.matches(l)){t.code=``,r.setAttribute(a,o);var f=r.appendChild(document.createElement(`CODE`));f.textContent=e;var p=r.getAttribute(`data-src`),m=t.language;if(m===`none`){var h=(/\.(\w+)$/.exec(p)||[,`none`])[1];m=i[h]||h}n.util.setLanguage(f,m),n.util.setLanguage(r,m);var g=n.plugins.autoloader;g&&g.loadLanguages(m),u(p,function(e){r.setAttribute(a,s);var t=d(r.getAttribute(`data-range`));if(t){var i=e.split(/\r\n?|\n/g),o=t[0],c=t[1]==null?i.length:t[1];o<0&&(o+=i.length),o=Math.max(0,Math.min(o-1,i.length)),c<0&&(c+=i.length),c=Math.max(0,Math.min(c,i.length)),e=i.slice(o,c).join(`
`),r.hasAttribute(`data-start`)||r.setAttribute(`data-start`,String(o+1))}f.textContent=e,n.highlightElement(f)},function(e){r.setAttribute(a,c),f.textContent=e})}}),n.plugins.fileHighlight={highlight:function(e){for(var t=(e||document).querySelectorAll(l),r=0,i;i=t[r++];)n.highlightElement(i)}};var f=!1;n.fileHighlight=function(){f||=(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}})()}))(),1);Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:`keyword`}},Prism.languages.webmanifest=Prism.languages.json,(function(e){var t=/[*&][^\s[\]{},]+/,n=/!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,r=`(?:`+n.source+`(?:[ 	]+`+t.source+`)?|`+t.source+`(?:[ 	]+`+n.source+`)?)`,i=`(?:[^\\s\\x00-\\x08\\x0e-\\x1f!"#%&'*,\\-:>?@[\\]\`{|}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]|[?:-]<PLAIN>)(?:[ \\t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*`.replace(/<PLAIN>/g,function(){return`[^\\s\\x00-\\x08\\x0e-\\x1f,[\\]{}\\x7f-\\x84\\x86-\\x9f\\ud800-\\udfff\\ufffe\\uffff]`}),a=`"(?:[^"\\\\\\r\\n]|\\\\.)*"|'(?:[^'\\\\\\r\\n]|\\\\.)*'`;function o(e,t){t=(t||``).replace(/m/g,``)+`m`;var n=`([:\\-,[{]\\s*(?:\\s<<prop>>[ \\t]+)?)(?:<<value>>)(?=[ \\t]*(?:$|,|\\]|\\}|(?:[\\r\\n]\\s*)?#))`.replace(/<<prop>>/g,function(){return r}).replace(/<<value>>/g,function(){return e});return RegExp(n,t)}e.languages.yaml={scalar:{pattern:RegExp(`([\\-:]\\s*(?:\\s<<prop>>[ \\t]+)?[|>])[ \\t]*(?:((?:\\r?\\n|\\r)[ \\t]+)\\S[^\\r\\n]*(?:\\2[^\\r\\n]+)*)`.replace(/<<prop>>/g,function(){return r})),lookbehind:!0,alias:`string`},comment:/#.*/,key:{pattern:RegExp(`((?:^|[:\\-,[{\\r\\n?])[ \\t]*(?:<<prop>>[ \\t]+)?)<<key>>(?=\\s*:\\s)`.replace(/<<prop>>/g,function(){return r}).replace(/<<key>>/g,function(){return`(?:`+i+`|`+a+`)`})),lookbehind:!0,greedy:!0,alias:`atrule`},directive:{pattern:/(^[ \t]*)%.+/m,lookbehind:!0,alias:`important`},datetime:{pattern:o(`\\d{4}-\\d\\d?-\\d\\d?(?:[tT]|[ \\t]+)\\d\\d?:\\d{2}:\\d{2}(?:\\.\\d*)?(?:[ \\t]*(?:Z|[-+]\\d\\d?(?::\\d{2})?))?|\\d{4}-\\d{2}-\\d{2}|\\d\\d?:\\d{2}(?::\\d{2}(?:\\.\\d*)?)?`),lookbehind:!0,alias:`number`},boolean:{pattern:o(`false|true`,`i`),lookbehind:!0,alias:`important`},null:{pattern:o(`null|~`,`i`),lookbehind:!0,alias:`important`},string:{pattern:o(a),lookbehind:!0,greedy:!0},number:{pattern:o(`[+-]?(?:0x[\\da-f]+|0o[0-7]+|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?|\\.inf|\\.nan)`,`i`),lookbehind:!0},tag:n,important:t,punctuation:/---|[:[\]{}\-,|>?]|\.\.\./},e.languages.yml=e.languages.yaml})(Prism),Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:`attr-equals`},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:`named-entity`},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside[`attr-value`].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside[`internal-subset`].inside=Prism.languages.markup,Prism.hooks.add(`wrap`,function(e){e.type===`entity`&&(e.attributes.title=e.content.replace(/&amp;/,`&`))}),Object.defineProperty(Prism.languages.markup.tag,`addInlined`,{value:function(e,t){var n={};n[`language-`+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[t]},n.cdata=/^<!\[CDATA\[|\]\]>$/i;var r={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:n}};r[`language-`+t]={pattern:/[\s\S]+/,inside:Prism.languages[t]};var i={};i[e]={pattern:RegExp(`(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/__>)`.replace(/__/g,function(){return e}),`i`),lookbehind:!0,greedy:!0,inside:r},Prism.languages.insertBefore(`markup`,`cdata`,i)}}),Object.defineProperty(Prism.languages.markup.tag,`addAttribute`,{value:function(e,t){Prism.languages.markup.tag.inside[`special-attr`].push({pattern:RegExp(`(^|["'\\s])(?:`+e+`)\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+(?=[\\s>]))`,`i`),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,`language-`+t],inside:Prism.languages[t]},punctuation:[{pattern:/^=/,alias:`attr-equals`},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend(`markup`,{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml,Prism.languages.mermaid={comment:{pattern:/%%.*/,greedy:!0},style:{pattern:/^([ \t]*(?:classDef|linkStyle|style)[ \t]+[\w$-]+[ \t]+)\w.*[^\s;]/m,lookbehind:!0,inside:{property:/\b\w[\w-]*(?=[ \t]*:)/,operator:/:/,punctuation:/,/}},"inter-arrow-label":{pattern:/([^<>ox.=-])(?:-[-.]|==)(?![<>ox.=-])[ \t]*(?:"[^"\r\n]*"|[^\s".=-](?:[^\r\n.=-]*[^\s.=-])?)[ \t]*(?:\.+->?|--+[->]|==+[=>])(?![<>ox.=-])/,lookbehind:!0,greedy:!0,inside:{arrow:{pattern:/(?:\.+->?|--+[->]|==+[=>])$/,alias:`operator`},label:{pattern:/^([\s\S]{2}[ \t]*)\S(?:[\s\S]*\S)?/,lookbehind:!0,alias:`property`},"arrow-head":{pattern:/^\S+/,alias:[`arrow`,`operator`]}}},arrow:[{pattern:/(^|[^{}|o.-])[|}][|o](?:--|\.\.)[|o][|{](?![{}|o.-])/,lookbehind:!0,alias:`operator`},{pattern:/(^|[^<>ox.=-])(?:[<ox](?:==+|--+|-\.*-)[>ox]?|(?:==+|--+|-\.*-)[>ox]|===+|---+|-\.+-)(?![<>ox.=-])/,lookbehind:!0,alias:`operator`},{pattern:/(^|[^<>()x-])(?:--?(?:>>|[x>)])(?![<>()x])|(?:<<|[x<(])--?(?!-))/,lookbehind:!0,alias:`operator`},{pattern:/(^|[^<>|*o.-])(?:[*o]--|--[*o]|<\|?(?:--|\.\.)|(?:--|\.\.)\|?>|--|\.\.)(?![<>|*o.-])/,lookbehind:!0,alias:`operator`}],label:{pattern:/(^|[^|<])\|(?:[^\r\n"|]|"[^"\r\n]*")+\|/,lookbehind:!0,greedy:!0,alias:`property`},text:{pattern:/(?:[(\[{]+|\b>)(?:[^\r\n"()\[\]{}]|"[^"\r\n]*")+(?:[)\]}]+|>)/,alias:`string`},string:{pattern:/"[^"\r\n]*"/,greedy:!0},annotation:{pattern:/<<(?:abstract|choice|enumeration|fork|interface|join|service)>>|\[\[(?:choice|fork|join)\]\]/i,alias:`important`},keyword:[{pattern:/(^[ \t]*)(?:action|callback|class|classDef|classDiagram|click|direction|erDiagram|flowchart|gantt|gitGraph|graph|journey|link|linkStyle|pie|requirementDiagram|sequenceDiagram|stateDiagram|stateDiagram-v2|style|subgraph)(?![\w$-])/m,lookbehind:!0,greedy:!0},{pattern:/(^[ \t]*)(?:activate|alt|and|as|autonumber|deactivate|else|end(?:[ \t]+note)?|loop|opt|par|participant|rect|state|note[ \t]+(?:over|(?:left|right)[ \t]+of))(?![\w$-])/im,lookbehind:!0,greedy:!0}],entity:/#[a-z0-9]+;/,operator:{pattern:/(\w[ \t]*)&(?=[ \t]*\w)|:::|:/,lookbehind:!0},punctuation:/[(){};]/},af.default.manual=!0,af.default.languages.mermaid&&!af.default.languages.mermaid[`class-declaration`]&&(af.default.languages.insertBefore(`mermaid`,`keyword`,{"class-declaration":{pattern:/(^[ \t]*)class[ \t]+[\w$-]+/m,lookbehind:!0,inside:{keyword:/^class/,"class-name":/[\w$-]+$/}}}),af.default.languages.insertBefore(`mermaid`,`punctuation`,{"class-member":{pattern:/^[ \t]*[+\-#~][\w$-]+\??(?:[ \t]+[\w$-]+)?/m,inside:{builtin:{pattern:/(^[ \t]*[+\-#~])[\w$-]+\??/,lookbehind:!0},property:{pattern:/(\s)[\w$-]+$/,lookbehind:!0},operator:/^[ \t]*[+\-#~]/}},annotation:{pattern:/<<[^>\r\n]+>>/,alias:`comment`}}));var of=class extends U{constructor(...e){super(...e),this.code=``,this.language=`json`,this.pretty=!1,this.lineNumbers=!1,this.highlightLines=``,this.startLine=1,this.location=``,this.embedded=!1,this.reserveLocation=!1,this.selectedLines=new Set,this.lastClickedLine=null,this._segmentCache={code:``,language:``,segments:[]},this._highlightCache={spec:``,parsed:new Set}}get displayCode(){if(!this.code)return``;if(this.pretty&&this.language===`json`)try{return JSON.stringify(JSON.parse(this.code),null,2)}catch{return this.code}return this.code}parseHighlightSpec(e){let t=new Set;if(!e)return t;for(let n of e.split(`,`)){let e=n.trim().match(/^(\d+)(?:-(\d+))?$/);if(!e)continue;let r=parseInt(e[1],10),i=e[2]?parseInt(e[2],10):r;for(let e=Math.min(r,i);e<=Math.max(r,i);e++)t.add(e)}return t}highlightCode(){let e=this.displayCode;if(!e)return``;try{let t=this.language===`xml`?`markup`:this.language;return af.default.highlight(e,af.default.languages[t],t)}catch{return e}}splitHighlightedLines(e){let t=[],n=``,r=[],i=0;for(;i<e.length;)if(e[i]===`
`){for(let e=r.length-1;e>=0;e--)n+=`</span>`;t.push(n),n=r.join(``),i++}else if(e[i]===`<`)if(e.startsWith(`</span>`,i))n+=`</span>`,r.pop(),i+=7;else{let t=e.indexOf(`>`,i);if(t===-1){n+=e[i],i++;continue}let a=e.slice(i,t+1);n+=a,a.startsWith(`</`)||r.push(a),i=t+1}else n+=e[i],i++;for(let e=r.length-1;e>=0;e--)n+=`</span>`;return n&&t.push(n),t}getLineSegments(){let e=this.displayCode;if(e===this._segmentCache.code&&this.language===this._segmentCache.language)return this._segmentCache.segments;let t=this.highlightCode(),n=t?this.splitHighlightedLines(t):[];return this._segmentCache={code:e,language:this.language,segments:n},n}get parsedHighlights(){return this._highlightCache.spec!==this.highlightLines&&(this._highlightCache={spec:this.highlightLines,parsed:this.parseHighlightSpec(this.highlightLines)}),this._highlightCache.parsed}get effectiveHighlights(){let e=this.parsedHighlights;return e.size>0?e:this.selectedLines}get isLocked(){return this.parsedHighlights.size>0}scrollToLine(e){this.renderRoot.querySelector(`[data-line="${e}"]`)?.scrollIntoView({block:`center`,behavior:`auto`})}handleLineClick(e,t){if(this.isLocked)return;let n=new Set;if(t.shiftKey&&this.lastClickedLine!==null){let t=Math.min(this.lastClickedLine,e),r=Math.max(this.lastClickedLine,e);for(let e=t;e<=r;e++)n.add(e)}else this.selectedLines.size===1&&this.selectedLines.has(e)||n.add(e);this.selectedLines=n,this.lastClickedLine=e}willUpdate(e){(e.has(`code`)||e.has(`language`))&&(this.selectedLines=new Set,this.lastClickedLine=null)}renderLocation(){return!this.location&&!this.reserveLocation?C:S`<div class="location ${this.location?``:`empty`}">${this.location||`\xA0`}</div>`}render(){if(!this.lineNumbers)return S`
              ${this.renderLocation()}
              <pre class="language-${this.language}"><code>${iu(this.highlightCode())}</code></pre>
            `;let e=this.getLineSegments(),t=Math.max(this.startLine,1),n=t+e.length-1,r=n>0?Math.floor(Math.log10(n))+1:1,i=this.effectiveHighlights,a=this.isLocked;return S`
          ${this.renderLocation()}
          <div class="lined-code${a?` locked`:``}" style="--gutter-digits: ${r}">
            <pre class="language-${this.language}"><code>${e.map((e,n)=>{let r=t+n;return S`<span class="line${i.has(r)?` highlighted`:``}" data-line=${r}
                ><span class="line-number"
                       @click=${e=>this.handleLineClick(r,e)}
                >${r}</span><span class="line-content">${iu(e||` `)}</span>
</span>`})}</code></pre>
          </div>
        `}};K([O()],of.prototype,`code`,void 0),K([O()],of.prototype,`language`,void 0),K([O({type:Boolean})],of.prototype,`pretty`,void 0),K([O({attribute:`line-numbers`,type:Boolean})],of.prototype,`lineNumbers`,void 0),K([O({attribute:`highlight-lines`})],of.prototype,`highlightLines`,void 0),K([O({attribute:`start-line`,type:Number})],of.prototype,`startLine`,void 0),K([O()],of.prototype,`location`,void 0),K([O({type:Boolean,reflect:!0})],of.prototype,`embedded`,void 0),K([O({attribute:`reserve-location`,type:Boolean})],of.prototype,`reserveLocation`,void 0),K([k()],of.prototype,`selectedLines`,void 0),K([k()],of.prototype,`lastClickedLine`,void 0),of=K([D(`pp-code-viewer`)],of);var sf=class extends U{constructor(...e){super(...e),this.icon=``,this.heading=``,this.level=1,this.size=`huge`}render(){if(!this.heading)return C;let e=fr(`h${Math.min(Math.max(this.level,1),6)}`);return hr`
            <pp-model-icon icon=${this.icon} size=${this.size}></pp-model-icon>
            <${e}>${this.heading}</${e}>
        `}};K([O()],sf.prototype,`icon`,void 0),K([O()],sf.prototype,`heading`,void 0),K([O({type:Number})],sf.prototype,`level`,void 0),K([O()],sf.prototype,`size`,void 0),sf=K([D(`pp-icon-title`)],sf);var cf,lf=class extends U{static{cf=this}constructor(...e){super(...e),this.registryKey=``,this.schemaRef=``,this.active=!1,this.entry=null,this.model=null,this.parsedData=null,this.popoverWidth=0,this.showRequestId=0,this.popoverMeasureAttempts=0,this.triggerTargets=new Set,this.pointerWithinTrigger=!1,this.pointerWithinPopup=!1,this.focusWithinPopup=!1,this.onTriggerEnter=()=>{this.pointerWithinTrigger=!0,this.show()},this.onTriggerLeave=e=>{this.pointerWithinTrigger=!1;let t=e.relatedTarget;this.containsInteractiveNode(t)||this.scheduleHide()},this.onPopupEnter=()=>{this.pointerWithinPopup=!0,this.cancelHide()},this.onPopupLeave=e=>{this.pointerWithinPopup=!1;let t=e.relatedTarget;this.containsInteractiveNode(t)||this.scheduleHide()},this.onPopupFocusIn=()=>{this.focusWithinPopup=!0,this.cancelHide()},this.onPopupFocusOut=e=>{let t=e.relatedTarget;this.containsInteractiveNode(t)||(this.focusWithinPopup=!1,this.scheduleHide())},this.onPopupInteraction=()=>{this.pointerWithinPopup=!0,this.cancelHide()}}static{this.showDelayMs=300}static{this.hideDelayMs=400}static{this.popoverWidthTolerancePx=2}static{this.maxPopoverMeasureAttempts=6}firstUpdated(){this.syncTriggerTargets()}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.showTimeout),clearTimeout(this.hideTimeout),this.showRequestId++,this.measureFrame&&cancelAnimationFrame(this.measureFrame),this.clearTriggerTargets(),this.pointerWithinTrigger=!1,this.pointerWithinPopup=!1,this.focusWithinPopup=!1,this.active=!1,this.popoverWidth=0}updated(e){if(e.has(`active`)||e.has(`model`)||e.has(`parsedData`)){this.schedulePopoverMeasure(!0);return}e.has(`popoverWidth`)&&this.schedulePopoverMeasure()}containsInteractiveNode(e){return e?this.contains(e)||this.renderRoot.contains(e):!1}isInteractivelyActive(){return this.pointerWithinTrigger||this.pointerWithinPopup||this.focusWithinPopup}clearTriggerTargets(){for(let e of this.triggerTargets)e.removeEventListener(`mouseenter`,this.onTriggerEnter),e.removeEventListener(`mouseleave`,this.onTriggerLeave),e.removeEventListener(`focusin`,this.onTriggerEnter),e.removeEventListener(`focusout`,this.onTriggerLeave);this.triggerTargets.clear()}syncTriggerTargets(){this.clearTriggerTargets();let e=new Set;this.trigger&&e.add(this.trigger);for(let t of this.authored)t instanceof HTMLElement&&e.add(t);for(let t of e)t.addEventListener(`mouseenter`,this.onTriggerEnter),t.addEventListener(`mouseleave`,this.onTriggerLeave),t.addEventListener(`focusin`,this.onTriggerEnter),t.addEventListener(`focusout`,this.onTriggerLeave),this.triggerTargets.add(t)}show(){clearTimeout(this.hideTimeout);let e=++this.showRequestId;this.showTimeout=window.setTimeout(async()=>{if(this.entry=(this.registryKey?re(this.registryKey):v(this.schemaRef))??null,!(!this.entry||e!==this.showRequestId||!this.isInteractivelyActive())&&(this.model=(this.registryKey?await ae(this.registryKey):await oe(this.schemaRef))??null,!(!this.model||e!==this.showRequestId||!this.isInteractivelyActive()))){try{this.parsedData=JSON.parse(this.model.schemaJson)}catch{this.parsedData=null}this.popoverWidth=0,this.popoverMeasureAttempts=0,this.active=!0}},cf.showDelayMs)}scheduleHide(){clearTimeout(this.showTimeout),this.hideTimeout=window.setTimeout(()=>{this.isInteractivelyActive()||(this.active=!1,this.popoverWidth=0,this.popoverMeasureAttempts=0)},cf.hideDelayMs)}cancelHide(){clearTimeout(this.hideTimeout)}resolveExample(){if(this.model?.mockJson)return this.model.mockJson;let e=this.parsedData;return e?e.schema?.example===void 0?e.example===void 0?Array.isArray(e.examples)&&e.examples.length>0?JSON.stringify(e.examples[0]):null:JSON.stringify(e.example):JSON.stringify(e.schema.example):null}getSchemaJson(){if(!this.model)return``;let e=this.parsedData;return e&&e.schema?JSON.stringify(e.schema):this.model.schemaJson}formatJson(e){try{return JSON.stringify(JSON.parse(e),null,2)}catch{return e}}schedulePopoverMeasure(e=!1){if(this.active){if(e)this.popoverMeasureAttempts=0;else if(this.popoverMeasureAttempts>=cf.maxPopoverMeasureAttempts)return;this.measureFrame&&cancelAnimationFrame(this.measureFrame),this.measureFrame=requestAnimationFrame(()=>{this.measureFrame=requestAnimationFrame(()=>{this.measureFrame=void 0,this.measurePopoverWidth()})})}}getCssLengthPx(e,t=0){let n=e.trim(),r=parseFloat(n);if(!Number.isFinite(r))return t;if(n.endsWith(`rem`)){let e=parseFloat(getComputedStyle(document.documentElement).fontSize);return r*(Number.isFinite(e)?e:16)}if(n.endsWith(`em`)){let e=parseFloat(getComputedStyle(this).fontSize);return r*(Number.isFinite(e)?e:16)}return r}getPopoverViewportWidth(){let e=getComputedStyle(this),t=this.getCssLengthPx(e.getPropertyValue(`--global-padding-double`));return Math.max(0,window.innerWidth-t)}collectRenderedWidth(e,t){let n=e.getBoundingClientRect().left-t+e.scrollWidth,r=e=>{for(let i of Array.from(e.children)){if(!(i instanceof HTMLElement))continue;let e=i.getBoundingClientRect();n=Math.max(n,e.left-t+i.scrollWidth),i.shadowRoot&&r(i.shadowRoot),r(i)}};return e.shadowRoot&&r(e.shadowRoot),r(e),Math.ceil(n)}measurePopoverWidth(){let e=this.popoverContent;if(!e)return;this.popoverMeasureAttempts++;let t=e.getBoundingClientRect(),n=Math.min(this.collectRenderedWidth(e,t.left),this.getPopoverViewportWidth());!Number.isFinite(n)||n<=0||Math.abs(n-t.width)<=cf.popoverWidthTolerancePx||(this.popoverWidth=n)}render(){let e=this.resolveExample(),t=this.getSchemaJson(),n=this.popoverWidth>0?`--ref-popover-width: ${this.popoverWidth}px`:``;return S`
            <span class="trigger" @click=${()=>{this.active=!1}}>
                ${this.slotted()}
            </span>
            ${this.active&&this.entry?S`
                <sl-popup
                    .anchor=${this.trigger}
                    placement="bottom-start"
                    strategy="fixed"
                    active
                    flip shift
                    distance="8">
                    <div class="pp-ref-popover-content"
                        style=${n}
                        @mouseenter=${this.onPopupEnter}
                        @mouseleave=${this.onPopupLeave}
                        @focusin=${this.onPopupFocusIn}
                        @focusout=${this.onPopupFocusOut}
                        @wheel=${this.onPopupInteraction}
                        @scroll=${this.onPopupInteraction}>
                        <div class="popover-header">
                            <pp-icon-title icon=${this.entry.componentType} heading=${this.entry.name} level=${3} size="medium"></pp-icon-title>
                        </div>
                        <div class="popover-body">
                            <pp-schema-properties compact condensed constrained popover-context schema-json=${t}></pp-schema-properties>
                        </div>
                        ${e?S`
                            <div class="popover-example">
                                <div class="example-label">Example</div>
                                <pp-code-viewer
                                    .code=${this.formatJson(e)}
                                    language="json">
                                </pp-code-viewer>
                            </div>
                        `:C}
                    </div>
                </sl-popup>
            `:C}
        `}};K([O({attribute:`registry-key`})],lf.prototype,`registryKey`,void 0),K([O({attribute:`schema-ref`})],lf.prototype,`schemaRef`,void 0),K([k()],lf.prototype,`active`,void 0),K([k()],lf.prototype,`entry`,void 0),K([k()],lf.prototype,`model`,void 0),K([k()],lf.prototype,`parsedData`,void 0),K([k()],lf.prototype,`popoverWidth`,void 0),K([A(`.trigger`)],lf.prototype,`trigger`,void 0),K([A(`.pp-ref-popover-content`)],lf.prototype,`popoverContent`,void 0),lf=cf=K([D(`pp-ref-popover`)],lf);var uf=class extends U{constructor(...e){super(...e),this.extensionsJson=``,this.extensions=[]}willUpdate(e){if(e.has(`extensionsJson`))if(this.extensionsJson)try{this.extensions=JSON.parse(this.extensionsJson)}catch{this.extensions=[]}else this.extensions=[]}renderValue(e){return e==null?C:typeof e==`object`?S`<pp-code-viewer code=${JSON.stringify(e,null,2)} language="json"></pp-code-viewer>`:S`<span class="ext-scalar">${String(e)}</span>`}render(){return this.extensions.length?S`<div class="ext-grid">
      ${this.extensions.map(e=>S`
        <div class="ext-key">${e.key}</div>
        <div class="ext-value">${this.renderValue(e.value)}</div>
      `)}
    </div>`:C}};K([O({attribute:`extensions-json`})],uf.prototype,`extensionsJson`,void 0),K([k()],uf.prototype,`extensions`,void 0),uf=K([D(`pp-extensions`)],uf);var df=class extends U{constructor(...e){super(...e),this.parametersJson=``,this.params=[]}willUpdate(e){if(e.has(`parametersJson`)&&this.parametersJson)try{this.params=JSON.parse(this.parametersJson)}catch{this.params=[]}}hasPayload(){return this.parametersJson!==``||this.hasAttribute(`parameters-json`)}renderSkeleton(){return S`
      <div class="parameters-skeleton" aria-hidden="true">
        ${[96,88,82].map(e=>S`
          <div class="parameter-skeleton-row">
            <div class="parameter-skeleton-name"></div>
            <div class="parameter-skeleton-type"></div>
            <div class="parameter-skeleton-in"></div>
            <div class="parameter-skeleton-desc" style=${`width:${e}%;`}></div>
          </div>
        `)}
      </div>
    `}inIcon(e){switch(e){case`cookie`:return`cookie`;case`header`:return`envelope`;case`path`:return`signpost`;case`query`:return`question-diamond`;default:return`question-diamond`}}parseSchema(e){if(!e)return null;try{return JSON.parse(e)}catch{return null}}render(){return this.params.length?S`
      ${this.params.map(e=>{let t=this.parseSchema(e.schemaJson),n=nu(t);return S`
          <div class="parameter">
            <div class="param-name-col">
              ${e.required?S`<span class="required-badge">req</span>`:C}
              ${e.ref?S`
                    <pp-ref-popover registry-key="${e.ref.componentType}/${e.ref.name}"><a
                        class="ref-link param-name" href=${Bc(e.ref.typeSlug,e.ref.slug)}>\u279c
                      ${e.name}</a></pp-ref-popover>`:S`<span class="param-name">${e.name}</span>`}

              ${e.deprecated?S`<span class="deprecated-badge">deprecated</span>`:C}
            </div>
            <div class="param-type-col">
              ${n?S`<span class="param-type">${n}</span>`:C}
              ${wd(t,{labelSuffix:`:`})}
            </div>
            <div class="param-in-col">
              <sl-icon class="param-in-icon" name="${this.inIcon(e.in)}"></sl-icon>
              <span class="param-in">${e.in}</span>
            </div>
            <div class="param-desc-col ${!e.ref&&(e.rawJson||e.rawYaml)?`has-actions`:``}">
              ${!e.ref&&(e.rawJson||e.rawYaml)?S`
                    <div class="param-desc-actions">
                      <pp-raw-viewer-btn
                          title="${e.name} (${e.in})"
                          raw-json=${e.rawJson||``}
                          raw-yaml=${e.rawYaml||``}
                          start-line=${e.sourceLine||1}
                          location=${e.location||``}>
                      </pp-raw-viewer-btn>
                    </div>`:C}
              <div class="param-desc-body">
                ${Z(e.description)}
              </div>
            </div>
            ${!e.ref&&(e.rawJson||e.rawYaml)||e.mockJson||e.examples&&Object.keys(e.examples).length>0?S`
                  <div class="param-extras">
                    ${e.mockJson||e.examples&&Object.keys(e.examples).length>0?S`
                          <pp-example-selector
                              mock-json=${e.mockJson||``}
                              examples-json=${e.examples?JSON.stringify(e.examples):``}>
                          </pp-example-selector>`:C}
                  </div>
                `:C}
          </div>
          ${e.extensions?.length?S`
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
            </div>`:C}
          
        `})}
    `:this.hasPayload()?C:this.renderSkeleton()}};K([O({attribute:`parameters-json`})],df.prototype,`parametersJson`,void 0),K([k()],df.prototype,`params`,void 0),df=K([D(`pp-operation-parameters`)],df);function ff(e){let t=parseInt(e,10);return t>=500?`status-error`:t>=400?`status-warn`:`status-ok`}var pf={100:`Continue`,101:`Switching Protocols`,102:`Processing`,103:`Early Hints`,200:`OK`,201:`Created`,202:`Accepted`,203:`Non-Authoritative Information`,204:`No Content`,205:`Reset Content`,206:`Partial Content`,207:`Multi-Status`,208:`Already Reported`,226:`IM Used`,300:`Multiple Choices`,301:`Moved Permanently`,302:`Found`,303:`See Other`,304:`Not Modified`,305:`Use Proxy`,307:`Temporary Redirect`,308:`Permanent Redirect`,400:`Bad Request`,401:`Unauthorized`,402:`Payment Required`,403:`Forbidden`,404:`Not Found`,405:`Method Not Allowed`,406:`Not Acceptable`,407:`Proxy Authentication Required`,408:`Request Timeout`,409:`Conflict`,410:`Gone`,411:`Length Required`,412:`Precondition Failed`,413:`Content Too Large`,414:`URI Too Long`,415:`Unsupported Media Type`,416:`Range Not Satisfiable`,417:`Expectation Failed`,418:`I'm a Teapot`,421:`Misdirected Request`,422:`Unprocessable Entity`,423:`Locked`,424:`Failed Dependency`,425:`Too Early`,426:`Upgrade Required`,428:`Precondition Required`,429:`Too Many Requests`,431:`Request Header Fields Too Large`,451:`Unavailable For Legal Reasons`,500:`Internal Server Error`,501:`Not Implemented`,502:`Bad Gateway`,503:`Service Unavailable`,504:`Gateway Timeout`,505:`HTTP Version Not Supported`,506:`Variant Also Negotiates`,507:`Insufficient Storage`,508:`Loop Detected`,510:`Not Extended`,511:`Network Authentication Required`},mf=class extends U{constructor(...e){super(...e),this.examplesData=``,this.mockJson=``,this.examplesJson=``,this.descriptionsJson=``,this.mode=`drawer`,this.codeLanguage=`json`,this.hideLabel=!1,this.showExpand=!1,this.showVisibilityToggle=!1,this.exampleTitle=`Example`,this.entries=[],this.descriptions={},this.selectedIndex=0}willUpdate(e){(e.has(`examplesData`)||e.has(`mockJson`)||e.has(`examplesJson`)||e.has(`descriptionsJson`))&&this.buildEntries()}buildEntries(){let e=[],t=this.mockJson,n={};if(this.examplesData)try{let e=JSON.parse(this.examplesData);e.mockJson&&(t=e.mockJson),e.examples&&(n=e.examples)}catch{}if(this.examplesJson)try{n={...n,...JSON.parse(this.examplesJson)}}catch{}for(let[t,r]of Object.entries(n))r&&e.push({key:t,json:r});if(t&&e.push({key:``,json:t}),this.entries=e,this.selectedIndex=0,this.descriptionsJson)try{this.descriptions=JSON.parse(this.descriptionsJson)}catch{this.descriptions={}}else this.descriptions={}}showExample(e){let t=e.json;if(this.codeLanguage===`json`)try{t=JSON.stringify(JSON.parse(e.json),null,2)}catch{}let n=new CustomEvent(`pp-show-example`,{bubbles:!0,composed:!0,detail:{title:e.key,json:t,language:this.codeLanguage}});this.dispatchEvent(n)}handleSelect(e){let t=e.detail?.item?.value;if(t===void 0)return;let n=parseInt(t,10);n>=0&&n<this.entries.length&&this.showExample(this.entries[n])}render(){if(!this.entries.length)return C;if(this.mode===`inline`)return this.renderInline();if(this.entries.length===1){let e=this.entries[0];return S`
        <div class="selector">
          <button @click=${()=>this.showExample(e)}>${e.key}</button>
        </div>
      `}return S`
      <div class="selector">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>View Example...</sl-button>
          <sl-menu @sl-select=${this.handleSelect}>
            ${this.entries.map((e,t)=>S`
              <sl-menu-item value="${t}">${e.key}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `}inlineLabel(e){return e.toLowerCase().includes(`example`)?e:`${e} Example`}expandToDrawer(e){this.dispatchEvent(new CustomEvent(`pp-show-example`,{bubbles:!0,composed:!0,detail:{title:this.exampleTitle,json:e,language:this.codeLanguage}}))}requestHideExample(){this.dispatchEvent(new CustomEvent(`pp-hide-example`,{bubbles:!0,composed:!0}))}renderCodeBlock(e){return S`
      <div class="code-container">
        <div class="floating-actions">
          ${this.showVisibilityToggle?S`
            <sl-tooltip content="hide example">
              <sl-icon-button name="eye-slash" label="Hide example"
                @click=${this.requestHideExample}></sl-icon-button>
            </sl-tooltip>
          `:C}
          ${this.showExpand?S`
            <sl-tooltip content="view expanded example">
              <sl-icon-button name="arrows-fullscreen" label="Expand"
                class="floating-expand"
                @click=${()=>this.expandToDrawer(e)}></sl-icon-button>
            </sl-tooltip>
          `:C}
          <sl-tooltip class="floating-copy" content="copy example to clipboard">
            <sl-icon-button
              name="copy"
              label="Copy example to clipboard"
              @click=${()=>navigator.clipboard.writeText(e)}>
            </sl-icon-button>
          </sl-tooltip>
        </div>
        <pp-code-viewer .code=${e} .language=${this.codeLanguage}
            ?pretty=${this.codeLanguage===`json`}></pp-code-viewer>
      </div>
    `}renderInline(){let e=this.entries[this.selectedIndex];if(this.entries.length===1)return S`
        ${this.hideLabel?C:S`<div class="inline-example-label">${this.inlineLabel(e.key)}</div>`}
        ${this.renderCodeBlock(e.json)}
      `;let t=this.descriptions[e.key];return S`
      ${this.hideLabel?C:S`<div class="inline-example-label">Example</div>`}
      ${this.renderCodeBlock(e.json)}
      <div class="inline-selector-row">
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret>${this.inlineLabel(e.key)}</sl-button>
          <sl-menu @sl-select=${this.handleInlineSelect}>
            ${this.entries.map((e,t)=>S`
              <sl-menu-item value="${t}">${this.inlineLabel(e.key)}</sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
        ${t?Z(t,{className:`inline-example-desc pp-markdown`}):C}
      </div>
    `}handleInlineSelect(e){let t=e.detail?.item?.value;t!==void 0&&(this.selectedIndex=parseInt(t,10))}};K([O({attribute:`examples-data`})],mf.prototype,`examplesData`,void 0),K([O({attribute:`mock-json`})],mf.prototype,`mockJson`,void 0),K([O({attribute:`examples-json`})],mf.prototype,`examplesJson`,void 0),K([O({attribute:`descriptions-json`})],mf.prototype,`descriptionsJson`,void 0),K([O()],mf.prototype,`mode`,void 0),K([O({attribute:`code-language`})],mf.prototype,`codeLanguage`,void 0),K([O({type:Boolean,attribute:`hide-label`})],mf.prototype,`hideLabel`,void 0),K([O({type:Boolean,attribute:`show-expand`})],mf.prototype,`showExpand`,void 0),K([O({type:Boolean,attribute:`show-visibility-toggle`})],mf.prototype,`showVisibilityToggle`,void 0),K([O({attribute:`example-title`})],mf.prototype,`exampleTitle`,void 0),K([k()],mf.prototype,`entries`,void 0),K([k()],mf.prototype,`descriptions`,void 0),K([k()],mf.prototype,`selectedIndex`,void 0),mf=K([D(`pp-example-selector`)],mf);var hf=class extends U{constructor(...e){super(...e),this.contentJson=``,this.hideRefLinks=!1,this.mediaTypes=[],this.selectedIndex=0,this.schemasIdentical=!1,this.wide=!1,this.exampleHidden=!1,this.resizeObserver=null,this.paneResizeObserver=null,this._sizePending=!1,this._rafId=0,this._splitRepositioning=!1,this._splitRepositionTimer=0,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.wide=this.offsetWidth>=900,!(typeof ResizeObserver>`u`)&&(this.resizeObserver=new ResizeObserver(e=>{for(let t of e)this.wide=t.contentRect.width>=900}),this.resizeObserver.observe(this),this.paneResizeObserver=new ResizeObserver(()=>{this.sizeSplitPanel()}))},0)}disconnectedCallback(){super.disconnectedCallback(),cancelAnimationFrame(this._rafId),window.clearTimeout(this._splitRepositionTimer),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.paneResizeObserver?.disconnect(),this.paneResizeObserver=null,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}updated(e){(e.has(`wide`)||e.has(`selectedIndex`)||e.has(`mediaTypes`)||e.has(`exampleHidden`))&&this.sizeSplitPanel(),this.syncPaneObservers()}sizeSplitPanel(){!this.splitPanel||!this.propsPane||!this.examplePane||this._sizePending||this._splitRepositioning||(this._sizePending=!0,this._rafId=requestAnimationFrame(()=>{if(this._sizePending=!1,!this.splitPanel||!this.propsPane||!this.examplePane||this._splitRepositioning)return;let e=this.measurePaneContentHeight(this.propsPane),t=this.exampleHidden?0:this.measurePaneContentHeight(this.examplePane),n=document.documentElement.clientHeight||800,r=this.mediaTypes[this.selectedIndex],i=this.getPropCount(r),a=this.exampleHidden?e:Math.max(e,t),o=i>=6?300:220,s=n*.75,c=Math.max(o,Math.min(a,s)),l=getComputedStyle(this.splitPanel),u=parseFloat(l.paddingTop)+parseFloat(l.paddingBottom),d=Math.round(c+u),f=parseFloat(this.splitPanel.style.height);(!Number.isFinite(f)||Math.abs(f-d)>=1)&&(this.splitPanel.style.height=`${d}px`)}))}handleSplitReposition(){this._splitRepositioning=!0,this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=0,this._sizePending=!1),window.clearTimeout(this._splitRepositionTimer),this._splitRepositionTimer=window.setTimeout(()=>{this._splitRepositioning=!1,this.sizeSplitPanel()},120)}measurePaneContentHeight(e){let t=Array.from(e.children).reduce((e,t)=>e+Math.max(t.offsetHeight,t.scrollHeight),0),n=getComputedStyle(e);return t+(parseFloat(n.paddingTop)+parseFloat(n.paddingBottom))}syncPaneObservers(){if(!this.paneResizeObserver||typeof ResizeObserver>`u`)return;let e=this.propsPane??null,t=this.examplePane??null,n=e?.firstElementChild??null,r=t?.firstElementChild??null;this.observedPropsPane!==e&&(this.observedPropsPane&&this.paneResizeObserver.unobserve(this.observedPropsPane),e&&this.paneResizeObserver.observe(e),this.observedPropsPane=e),this.observedExamplePane!==t&&(this.observedExamplePane&&this.paneResizeObserver.unobserve(this.observedExamplePane),t&&this.paneResizeObserver.observe(t),this.observedExamplePane=t),this.observedPropsContent!==n&&(this.observedPropsContent&&this.paneResizeObserver.unobserve(this.observedPropsContent),n instanceof Element&&this.paneResizeObserver.observe(n),this.observedPropsContent=n),this.observedExampleContent!==r&&(this.observedExampleContent&&this.paneResizeObserver.unobserve(this.observedExampleContent),r instanceof Element&&this.paneResizeObserver.observe(r),this.observedExampleContent=r)}getPropCount(e){let t=e?.isArray&&e?.itemsSchemaJson?e.itemsSchemaJson:e?.schemaJson;if(!t)return 0;try{let e=JSON.parse(t);return e.properties?Object.keys(e.properties).length:0}catch{return 0}}isComplexWithExample(e){if(!e.schemaJson&&!(e.isArray&&e.itemsSchemaJson))return!1;let t=e.isArray&&e.itemsSchemaJson?e.itemsSchemaJson:e.schemaJson;if(!t)return!1;try{let n=JSON.parse(t),r=n.properties||n.allOf||n.oneOf||n.anyOf,i=!!(e.mockJson||e.mockYaml||e.mockXml||e.examples&&Object.keys(e.examples).length);return!!r&&i}catch{return!1}}willUpdate(e){if(e.has(`contentJson`)&&this.contentJson){try{this.mediaTypes=JSON.parse(this.contentJson)}catch{this.mediaTypes=[]}let e=this.mediaTypes.findIndex(e=>e.mediaType.toLowerCase()===`application/json`);this.selectedIndex=e>=0?e:0,this.schemasIdentical=this.mediaTypes.length>1&&new Set(this.mediaTypes.map(e=>this.schemaFingerprint(e))).size===1}}schemaFingerprint(e){return e.isArray&&e.itemsRef?`array:${e.itemsRef.slug}:${e.itemsSchemaJson||e.schemaJson}`:e.schemaRef?`ref:${e.schemaRef.componentType}/${e.schemaRef.slug}`:`inline:${e.schemaJson}`}getMockAndLanguage(e){let t=e.mediaType.toLowerCase();return(t.includes(`yaml`)||t.includes(`x-yaml`))&&e.mockYaml?{mock:e.mockYaml,language:`yaml`}:t.includes(`xml`)&&e.mockXml?{mock:e.mockXml,language:`xml`}:{mock:e.mockJson||``,language:`json`}}renderSchemaHeader(e){return e.isArray&&e.itemsRef?S`
                <div class="media-type-ref">
                    <span class="media-type-label">${e.mediaType}</span>
                    ${this.hideRefLinks?S`<span class="array-type">Array</span>`:S`<span class="array-type">Array&lt;${Sd(e.itemsRef)}&gt;</span>`}
                </div>`:e.schemaRef?S`
                <div class="media-type-ref">
                    <span class="media-type-label">${e.mediaType}</span>
                    ${this.hideRefLinks?C:Sd(e.schemaRef)}
                </div>`:!e.schemaJson&&!e.rawSchemaJson&&!e.rawSchemaYaml?C:S`<div class="media-type-label">${e.mediaType}</div>`}renderSchemaProperties(e){if(e.isArray&&e.itemsRef){let t=e.itemsSchemaJson||e.schemaJson;return t?S`<pp-schema-properties schema-json=${t}></pp-schema-properties>`:C}return e.schemaRef,e.schemaJson?S`<pp-schema-properties schema-json=${e.schemaJson}></pp-schema-properties>`:C}renderInlineExamples(e,t,n){let r=e.examples&&Object.keys(e.examples).length>0;return!r&&!n?C:S`
            <pp-example-selector mode="inline" code-language=${t}
                examples-json=${r?JSON.stringify(e.examples):``}
                mock-json=${n}>
            </pp-example-selector>
        `}renderExtensions(e){return e.extensions?.length?S`
            <div class="media-type-extensions">
                <h4>${e.mediaType} Extensions</h4>
                <pp-extensions extensions-json=${JSON.stringify(e.extensions)}></pp-extensions>
            </div>
        `:C}renderDiagram(e){return e.mermaidDiagram?S`<pp-class-diagram name=${e.mediaType} .diagram=${e.mermaidDiagram}></pp-class-diagram>`:C}renderRawSchema(e){let t=e.rawSchemaJson||e.rawSchemaYaml||``;if(!t)return C;let n=e.rawSchemaJson?`json`:`yaml`;return S`
            <div class="multi-format-schema">
                ${e.schemaFormat?S`<div class="schema-format-label">${e.schemaFormat}</div>`:C}
                <pp-code-viewer .code=${t} .language=${n} ?pretty=${n===`json`}></pp-code-viewer>
            </div>`}renderRefInfo(e){return this.hideRefLinks?C:e.isArray&&e.itemsRef?S`<span class="array-type">Array&lt;${Sd(e.itemsRef)}&gt;</span>`:e.schemaRef?Sd(e.schemaRef):C}renderDropdown(e){return S`
            <div class="media-type-ref">
                <sl-dropdown skidding="5" distance="5">
                    <sl-button slot="trigger" caret>${e.mediaType}</sl-button>
                    <sl-menu @sl-select=${this.handleSelect}>
                        ${this.mediaTypes.map((e,t)=>S`
                            <sl-menu-item value="${t}">${e.mediaType}</sl-menu-item>
                        `)}
                    </sl-menu>
                </sl-dropdown>
                ${this.renderRefInfo(e)}
            </div>
        `}handleSelect(e){let t=e.detail?.item?.value;if(t===void 0)return;let n=parseInt(t,10);n>=0&&n<this.mediaTypes.length&&(this.selectedIndex=n)}renderSplit(e){let t=e.isArray&&e.itemsSchemaJson?e.itemsSchemaJson:e.schemaJson,{mock:n,language:r}=this.getMockAndLanguage(e),i=e.examples&&Object.keys(e.examples).length>0,a=e.mediaType||`Example`;return S`
            <sl-split-panel class=${this.exampleHidden?`schema-split example-hidden`:`schema-split`} position=${this.exampleHidden?`100`:`60`} @sl-reposition=${e=>e.target===e.currentTarget&&this.handleSplitReposition()}>
                <div slot="start" class="split-pane schema-props-pane">
                    <pp-schema-properties schema-json=${t||``} compact constrained></pp-schema-properties>
                </div>
                <sl-icon slot="divider" name="grip-vertical"></sl-icon>
                <div slot="end" class="split-pane schema-example-pane">
                    ${this.exampleHidden?this.renderExampleRestore():S`
                        <pp-example-selector mode="inline" code-language=${r}
                            mock-json=${n}
                            examples-json=${i?JSON.stringify(e.examples):``}
                            hide-label show-expand
                            show-visibility-toggle
                            example-title=${a}
                            @pp-hide-example=${this.hideExamplePane}></pp-example-selector>
                    `}
                </div>
            </sl-split-panel>
        `}hideExamplePane(){this.exampleHidden=!0}showExamplePane(){this.exampleHidden=!1}renderExampleRestore(){return S`
            <sl-tooltip class="example-restore-tooltip" content="show example">
                <sl-icon-button name="eye" label="Show example"
                    class="example-restore"
                    @click=${this.showExamplePane}></sl-icon-button>
            </sl-tooltip>
        `}render(){if(!this.mediaTypes.length)return C;if(this.mediaTypes.length===1){let e=this.mediaTypes[0];if(this.wide&&this.isComplexWithExample(e))return S`
                    ${this.renderSchemaHeader(e)}
                    ${this.renderSplit(e)}
                    ${this.renderRawSchema(e)}
                    ${this.renderDiagram(e)}
                    ${this.renderExtensions(e)}
                `;let{mock:t,language:n}=this.getMockAndLanguage(e);return S`
                ${this.renderSchemaHeader(e)}
                ${this.renderInlineExamples(e,n,t)}
                ${this.renderSchemaProperties(e)}
                ${this.renderRawSchema(e)}
                ${this.renderDiagram(e)}
                ${this.renderExtensions(e)}
            `}let e=this.mediaTypes[this.selectedIndex];if(this.schemasIdentical){let t=this.mediaTypes[0];if(this.wide&&this.isComplexWithExample(e))return S`
                    ${this.renderDropdown(e)}
                    ${this.renderSplit(e)}
                    ${this.renderRawSchema(e)}
                    ${this.renderDiagram(e)}
                    ${this.renderExtensions(e)}
                `;let{mock:n,language:r}=this.getMockAndLanguage(e);return S`
                ${this.renderDropdown(e)}
                ${this.renderInlineExamples(e,r,n)}
                ${this.renderSchemaProperties(t)}
                ${this.renderRawSchema(e)}
                ${this.renderDiagram(e)}
                ${this.renderExtensions(e)}
            `}if(this.wide&&this.isComplexWithExample(e))return S`
                ${this.renderDropdown(e)}
                ${this.renderSplit(e)}
                ${this.renderRawSchema(e)}
                ${this.renderDiagram(e)}
                ${this.renderExtensions(e)}
            `;let{mock:t,language:n}=this.getMockAndLanguage(e);return S`
            ${this.renderDropdown(e)}
            ${this.renderInlineExamples(e,n,t)}
            ${this.renderSchemaProperties(e)}
            ${this.renderRawSchema(e)}
            ${this.renderDiagram(e)}
            ${this.renderExtensions(e)}
        `}};K([O({attribute:`content-json`})],hf.prototype,`contentJson`,void 0),K([O({attribute:`hide-ref-links`,type:Boolean})],hf.prototype,`hideRefLinks`,void 0),K([k()],hf.prototype,`mediaTypes`,void 0),K([k()],hf.prototype,`selectedIndex`,void 0),K([k()],hf.prototype,`schemasIdentical`,void 0),K([k()],hf.prototype,`wide`,void 0),K([k()],hf.prototype,`exampleHidden`,void 0),K([A(`.schema-split`)],hf.prototype,`splitPanel`,void 0),K([A(`.schema-props-pane`)],hf.prototype,`propsPane`,void 0),K([A(`.schema-example-pane`)],hf.prototype,`examplePane`,void 0),hf=K([D(`pp-media-type-selector`)],hf);var gf=class extends U{constructor(...e){super(...e),this.responsesJson=``,this.commonHeadersJson=``,this.responses=[],this.commonResponseHeaders=[],this.commonHeaderNames=new Set,this.commonErrorKeys=new Set,this.commonErrorResponses=new Map,this.successResponses=[],this.redirectResponses=[],this.errorResponses=[]}willUpdate(e){if(e.has(`responsesJson`)&&this.responsesJson){try{this.responses=JSON.parse(this.responsesJson)}catch{this.responses=[]}let e=[...this.responses].sort((e,t)=>parseInt(e.statusCode,10)-parseInt(t.statusCode,10)),t=[],n=[],r=[];for(let i of e){let e=parseInt(i.statusCode,10);e>=400?r.push(i):e>=300?n.push(i):t.push(i)}this.successResponses=t,this.redirectResponses=n,this.errorResponses=r;let{commonKeys:i,commonResponses:a}=this.computeCommonErrors(r);this.commonErrorKeys=i,this.commonErrorResponses=a}if(e.has(`commonHeadersJson`)&&this.commonHeadersJson){try{this.commonResponseHeaders=JSON.parse(this.commonHeadersJson)}catch{this.commonResponseHeaders=[]}this.commonHeaderNames=new Set(this.commonResponseHeaders.map(e=>e.name))}}getResponseNavItems(){let e=[];for(let t of[...this.successResponses,...this.redirectResponses,...this.errorResponses])e.push({label:`${t.statusCode} ${pf[t.statusCode]||``}`.trim(),id:`response-${t.statusCode}`});return e}scrollToHeader(e){let t=this.querySelector(`#${CSS.escape(`header-`+e)}`);if(!t)return;let n=t.closest(`sl-details`);n&&!n.open?(n.open=!0,n.updateComplete?.then(()=>{t.scrollIntoView({behavior:`auto`,block:`center`})})):t.scrollIntoView({behavior:`auto`,block:`center`})}renderHeaderEntry(e){return S`
            <div class="header-entry">
                <div class="header-name-col">
                    ${e.ref?S`
                                <pp-ref-popover registry-key="${e.ref.componentType}/${e.ref.name}"><a
                                        class="ref-link header-name" href=${Bc(e.ref.typeSlug,e.ref.slug)}>\u279c
                                    ${e.name}</a></pp-ref-popover>`:S`<span class="header-name">${e.name}</span>`}
                </div>
                <div class="header-type-col">
                    ${e.schemaType?S`<span class="header-type">${e.schemaType}</span>`:C}
                    ${wd(e,{includeExample:!0})}
                </div>
                <div class="header-desc-col">
                    ${Z(e.description)}
                </div>
            </div>
            ${e.extensions?.length?S`
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
            `:C}
        `}renderHeaders(e,t){if(!e||!e.length)return C;let n=e.filter(e=>!t.has(e.name)),r=e.filter(e=>t.has(e.name));return!n.length&&!r.length?C:S`
            <div class="headers-section">
                <h4 class="headers-label">Response Headers</h4>
                    ${n.length?S`
                        <div class="headers-values">
                            ${n.map(e=>this.renderHeaderEntry(e))}
                        </div>`:C}
                ${r.length?S`
                    <div class="common-link-label">\u2191 common headers</div>
                    <ul class="common-header-list">
                        ${r.map(e=>S`
                            <li><a class="header-anchor" @click=${t=>{t.preventDefault(),this.scrollToHeader(e.name)}}>${e.name}</a></li>
                        `)}
                    </ul>
                `:C}
            </div>
        `}renderLinks(e){return e?.length?S`
            <div class="links-section">
                <h4 class="links-label">Response Links</h4>
                ${e.map(e=>S`
                    <div class="link-entry">
                        <span class="link-name">${e.ref?S`<pp-ref-popover registry-key="links/${e.ref.name}"><a class="ref-link" href=${Bc(e.ref.typeSlug,e.ref.slug)}>\u279c ${e.name}</a></pp-ref-popover>`:e.name}</span>
                        ${e.operationId?S`<span class="link-target">\u2192 ${e.operationSlug?S`<a class="ref-link" href=${zc(e.operationSlug)}>${e.operationId}</a>`:e.operationId}</span>`:C}
                        ${e.operationRef?S`<span class="link-target">\u2192 ${e.operationRef}</span>`:C}
                        ${e.description?Z(e.description,{className:`link-desc pp-markdown`}):C}
                    </div>
                `)}
            </div>
        `:C}errorRefKey(e){if(e.ref)return`ref:${e.ref.slug}`;if(e.content?.length){let t=e.content[0];if(t.schemaRef)return`schema:${t.schemaRef.slug}`;if(t.isArray&&t.itemsRef)return`items:${t.itemsRef.slug}`}return null}computeCommonErrors(e){let t=new Map;for(let n of e){let e=this.errorRefKey(n);if(!e)continue;let r=t.get(e);r?r.codeDescs.push({code:n.statusCode,description:n.description}):t.set(e,{resp:n,codeDescs:[{code:n.statusCode,description:n.description}]})}let n=new Set,r=new Map;for(let[e,i]of t)i.codeDescs.length>=2&&(n.add(e),r.set(e,i));return{commonKeys:n,commonResponses:r}}scrollToCommonError(e){this.querySelector(`#${CSS.escape(`common-error-`+e)}`)?.scrollIntoView({behavior:`auto`,block:`nearest`})}renderResponse(e,t,n){let r=n?this.errorRefKey(e):null,i=r!=null&&n?.has(r);return S`
            <div class="response" id="response-${e.statusCode}">
                    <h3><span class="status-code ${ff(e.statusCode)}">${e.statusCode}</span> ${pf[e.statusCode]||``}
                        ${e.rawJson||e.rawYaml?S`
                                <pp-raw-viewer-btn
                                        title="Response ${e.statusCode}"
                                        raw-json=${e.rawJson||``}
                                        raw-yaml=${e.rawYaml||``}
                                        start-line=${e.sourceLine||1}
                                        location=${e.location||``}>
                                </pp-raw-viewer-btn>`:C}
                    </h3>
                    ${e.descHtml?S`<div class="response-desc">${iu(e.descHtml)}</div>`:Z(e.description,{className:`response-desc pp-markdown`})}
              
                ${i?S`
                            <div class="common-error-link">
                                ${e.ref?Sd(e.ref,!0):C}
                                ${!e.ref&&e.content?.length?this.renderMediaTypeHeader(e.content[0]):C}
                                <a class="error-anchor" @click=${e=>{e.preventDefault(),this.scrollToCommonError(r)}}>\u2191 see common example</a>
                            </div>`:e.ref?Sd(e.ref,!0):e.content?.length?S`<pp-media-type-selector content-json=${JSON.stringify(e.content)}></pp-media-type-selector>`:C}
                ${this.renderHeaders(e.headers??[],t)}
                ${this.renderLinks(e.links??[])}
                ${e.extensions?.length?S`
                    <div class="response-extensions">
                        <h4>Response ${e.statusCode} Extensions</h4>
                        <pp-extensions extensions-json=${JSON.stringify(e.extensions)}></pp-extensions>
                    </div>`:C}
            </div>
        `}renderMediaTypeHeader(e){return e.isArray&&e.itemsRef?S`
                <span class="media-type-label">${e.mediaType}</span>
                <span class="array-type">Array&lt;${Sd(e.itemsRef)}&gt;</span>
            `:e.schemaRef?S`
                <span class="media-type-label">${e.mediaType}</span>
                ${Sd(e.schemaRef)}
            `:C}renderCommonErrors(e,t){return e.size?S`
            <div class="response-group-heading"><h4>Common Error Responses</h4></div>
            ${[...e.entries()].map(([e,{resp:n,codeDescs:r}])=>S`
                <div class="response common-error-response" id="common-error-${e}">
                    <div class="common-error-grid">
                        ${r.map(({code:e,description:t})=>S`
                            <div class="common-error-code"><span class="${ff(e)}">${e}</span> ${pf[e]||``}</div>
                            ${Z(t,{className:`common-error-desc pp-markdown`})}
                        `)}
                    </div>
                    ${n.ref?Sd(n.ref,!0):n.content?.length?S`<pp-media-type-selector content-json=${JSON.stringify(n.content)}></pp-media-type-selector>`:C}
                    ${this.renderHeaders(n.headers??[],t)}
                </div>
            `)}
        `:C}hasPayload(){return this.responsesJson!==``||this.commonHeadersJson!==``||this.hasAttribute(`responses-json`)||this.hasAttribute(`common-headers-json`)}renderSkeleton(){return S`
            <h2>Responses</h2>
            <div class="response response-skeleton" aria-hidden="true">
                <div class="response-skeleton-heading"></div>
                ${[32,84,62].map(e=>S`<div class="response-skeleton-line" style=${`width:${e}%;`}></div>`)}
            </div>
        `}render(){if(!this.responses.length)return this.hasPayload()?C:this.renderSkeleton();let e=this.commonHeaderNames,t=this.commonErrorKeys,n=this.commonErrorResponses;return S`
            <h2>Responses</h2>
            ${this.successResponses.map(t=>this.renderResponse(t,e))}
            ${this.redirectResponses.length?S`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Redirect Responses</h3></span>
                    ${this.redirectResponses.map(t=>this.renderResponse(t,e))}
                </sl-details>
            `:C}
            ${this.commonResponseHeaders.length?S`
                <sl-details class="pp-details">
                    <span slot="summary" class="pp-details-summary"><h3>Common Response Headers</h3></span>
                    <div class="property-box">
                        ${this.commonResponseHeaders.map(e=>S`
                            <div id="header-${e.name}">${this.renderHeaderEntry(e)}</div>
                        `)}
                    </div>
                </sl-details>
            `:C}
            ${this.errorResponses.length||n.size?S`
                <sl-details class="pp-details">
                    <div slot="summary" class="pp-details-summary"><h3>Error Responses</h3></div>
                    ${this.renderCommonErrors(n,e)}
                    ${this.errorResponses.map(n=>this.renderResponse(n,e,t))}
                </sl-details>
            `:C}
        `}};K([O({attribute:`responses-json`})],gf.prototype,`responsesJson`,void 0),K([O({attribute:`common-headers-json`})],gf.prototype,`commonHeadersJson`,void 0),K([k()],gf.prototype,`responses`,void 0),K([k()],gf.prototype,`commonResponseHeaders`,void 0),K([k()],gf.prototype,`commonHeaderNames`,void 0),K([k()],gf.prototype,`commonErrorKeys`,void 0),K([k()],gf.prototype,`commonErrorResponses`,void 0),K([k()],gf.prototype,`successResponses`,void 0),K([k()],gf.prototype,`redirectResponses`,void 0),K([k()],gf.prototype,`errorResponses`,void 0),gf=K([D(`pp-operation-responses`)],gf);var _f=class extends U{constructor(...e){super(...e),this.callbacksJson=``,this.callbacks=[]}willUpdate(e){if(e.has(`callbacksJson`)&&this.callbacksJson)try{this.callbacks=JSON.parse(this.callbacksJson)}catch{this.callbacks=[]}}renderRequestBody(e){return e.ref?S`<div class="callback-section-label">Request Body</div>${Sd(e.ref,!0)}`:e.content?.length?S`
            <div class="callback-section-label">Request Body${e.required?` (required)`:``}</div>
            ${e.descHtml?S`<div class="callback-desc">${iu(e.descHtml)}</div>`:Z(e.description,{className:`callback-desc pp-markdown`})}
            <pp-media-type-selector content-json=${JSON.stringify(e.content)}></pp-media-type-selector>
        `:C}renderResponses(e){return e?.length?S`
            <div class="callback-section-label">Responses</div>
            ${e.map(e=>S`
                <div class="callback-response">
                    <span class="callback-response-code ${ff(e.statusCode)}">${e.statusCode}</span>
                    <span class="callback-response-code">${pf[e.statusCode]||``}</span>
                    ${e.descHtml?S`<span class="callback-response-desc">${iu(e.descHtml)}</span>`:e.description?Z(e.description,{className:`callback-response-desc pp-markdown-inline`,inline:!0}):C}
                </div>
                ${e.ref?Sd(e.ref,!0):C}
                ${!e.ref&&e.content?.length?S`<pp-media-type-selector content-json=${JSON.stringify(e.content)}></pp-media-type-selector>`:C}
            `)}
        `:C}renderCallbackOperation(e){return S`
            <div class="callback-operation">
                <div class="callback-method-expression">
                    <pp-http-method method=${e.method}></pp-http-method>
                    <span class="callback-expression">${e.expression}</span>
                </div>
                ${e.descHtml?S`<div class="callback-desc">${iu(e.descHtml)}</div>`:Z(e.description,{className:`callback-desc pp-markdown`})}
                ${e.requestBody?this.renderRequestBody(e.requestBody):C}
                ${this.renderResponses(e.responses??[])}
            </div>
        `}hasPayload(){return this.callbacksJson!==``||this.hasAttribute(`callbacks-json`)}renderSkeleton(){return S`
            <div class="callback-entry callback-skeleton" aria-hidden="true">
                <div class="callback-skeleton-heading"></div>
                <div class="callback-skeleton-method"></div>
                ${[88,70,54].map(e=>S`<div class="callback-skeleton-line" style=${`width:${e}%;`}></div>`)}
            </div>
        `}render(){return this.callbacks.length?S`
            ${this.callbacks.map(e=>S`
                <div class="callback-entry">
                    <div class="callback-name">
                        ${e.ref?Sd(e.ref,!0):C}
                        ${e.name}
                    </div>
                    ${e.operations.map(e=>this.renderCallbackOperation(e))}
                </div>
            `)}
        `:this.hasPayload()?C:this.renderSkeleton()}};K([O({attribute:`callbacks-json`})],_f.prototype,`callbacksJson`,void 0),K([k()],_f.prototype,`callbacks`,void 0),_f=K([D(`pp-operation-callbacks`)],_f);var vf=class extends U{constructor(...e){super(...e),this.rawJson=``,this.rawYaml=``,this.startLine=1,this.title=`Schema`,this.location=``,this.noLineNumbers=!1,this.mode=`yaml`}connectedCallback(){super.connectedCallback();let e=document.body.getAttribute(`data-spec-format`);(e===`json`||e===`yaml`)&&(this.mode=e)}render(){if(!this.rawJson&&!this.rawYaml)return C;let e=!!this.rawJson,t=!!this.rawYaml,n=this.mode===`yaml`&&t?this.rawYaml:this.rawJson,r=this.mode===`yaml`&&t?`yaml`:`json`,i=e&&t;return S`
      ${this.title||i?S`
      <div class="toolbar">
        ${this.title?S`<h3>${this.title}</h3>`:C}
        ${i?S`
          <div class="toggle-group">
            <button class="toggle-btn ${this.mode===`json`?`active`:``}"
                    @click=${()=>this.mode=`json`}>JSON</button>
            <button class="toggle-btn ${this.mode===`yaml`?`active`:``}"
                    @click=${()=>this.mode=`yaml`}>YAML</button>
          </div>
        `:C}
      </div>
      `:C}
      <div class="code-container">
        <sl-tooltip class="floating-copy" content="copy code to clipboard">
          <sl-icon-button
            name="copy"
            label="Copy code to clipboard"
            @click=${()=>navigator.clipboard.writeText(n)}>
          </sl-icon-button>
        </sl-tooltip>
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
    `}};K([O({attribute:`raw-json`})],vf.prototype,`rawJson`,void 0),K([O({attribute:`raw-yaml`})],vf.prototype,`rawYaml`,void 0),K([O({attribute:`start-line`,type:Number})],vf.prototype,`startLine`,void 0),K([O()],vf.prototype,`title`,void 0),K([O()],vf.prototype,`location`,void 0),K([O({attribute:`no-line-numbers`,type:Boolean})],vf.prototype,`noLineNumbers`,void 0),K([k()],vf.prototype,`mode`,void 0),vf=K([D(`pp-inline-code`)],vf);var yf={schemas:`schemas`,responses:`responses`,parameters:`parameters`,requestBodies:`request-bodies`,headers:`headers`,securitySchemes:`security`,examples:`examples`,links:`links`,callbacks:`callbacks`,pathItems:Zl},Q=class extends U{constructor(...e){super(...e),this.modelJson=``,this.name=``,this.componentType=``,this.layoutMode=`stacked`,this.estimatedBodyHeight=0,this.estimatedSplitHeight=0,this.propertyCount=0,this.requiredCount=0,this.hasExample=!1,this.rawYaml=``,this.schemaRawYaml=``,this.schemaRawJson=``,this.schemaStartLine=1,this.startLine=1,this.location=``,this.mockJson=``,this.parsed=null,this.wide=typeof window<`u`?window.innerWidth>=900:!1,this.exampleJson=``,this.exampleHidden=!1,this.resizeObserver=null,this.paneResizeObserver=null,this._sizePending=!1,this._rafId=0,this._splitRepositioning=!1,this._splitRepositionTimer=0,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}connectedCallback(){super.connectedCallback(),this.wide=this.offsetWidth>=900,!(typeof ResizeObserver>`u`)&&(this.resizeObserver=new ResizeObserver(e=>{for(let t of e)this.wide=t.contentRect.width>=900}),this.resizeObserver.observe(this),this.paneResizeObserver=new ResizeObserver(()=>{this.sizeSplitPanel()}))}disconnectedCallback(){super.disconnectedCallback(),cancelAnimationFrame(this._rafId),window.clearTimeout(this._splitRepositionTimer),this.resizeObserver?.disconnect(),this.resizeObserver=null,this.paneResizeObserver?.disconnect(),this.paneResizeObserver=null,this.observedPropsPane=null,this.observedExamplePane=null,this.observedPropsContent=null,this.observedExampleContent=null}updated(e){(e.has(`wide`)||e.has(`parsed`)||e.has(`exampleJson`)||e.has(`exampleHidden`))&&this.sizeSplitPanel(),this.syncPaneObservers()}sizeSplitPanel(){!this.splitPanel||!this.propsPane||!this.examplePane||this._sizePending||this._splitRepositioning||(this._sizePending=!0,this._rafId=requestAnimationFrame(()=>{if(this._sizePending=!1,!this.splitPanel||!this.propsPane||!this.examplePane||this._splitRepositioning)return;let e=this.measurePaneContentHeight(this.propsPane),t=this.exampleHidden?0:this.measurePaneContentHeight(this.examplePane),n=document.documentElement.clientHeight||800,r=this.parsed?.properties?Object.keys(this.parsed.properties).length:0,i=this.exampleHidden?e:Math.max(e,t),a=(this.estimatedSplitHeight>0?this.estimatedSplitHeight:0)||(r>=6?300:220),o=Math.max(a,Math.min(i,n*.75)),s=getComputedStyle(this.splitPanel),c=parseFloat(s.paddingTop)+parseFloat(s.paddingBottom),l=Math.round(o+c),u=parseFloat(this.splitPanel.style.height);(!Number.isFinite(u)||Math.abs(u-l)>=1)&&(this.splitPanel.style.height=`${l}px`)}))}handleSplitReposition(){this._splitRepositioning=!0,this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=0,this._sizePending=!1),window.clearTimeout(this._splitRepositionTimer),this._splitRepositionTimer=window.setTimeout(()=>{this._splitRepositioning=!1,this.sizeSplitPanel()},120)}measurePaneContentHeight(e){let t=Array.from(e.children).reduce((e,t)=>e+Math.max(t.offsetHeight,t.scrollHeight),0),n=getComputedStyle(e);return t+(parseFloat(n.paddingTop)+parseFloat(n.paddingBottom))}syncPaneObservers(){if(!this.paneResizeObserver||typeof ResizeObserver>`u`)return;let e=this.propsPane??null,t=this.examplePane??null,n=e?.firstElementChild??null,r=t?.firstElementChild??null;this.observedPropsPane!==e&&(this.observedPropsPane&&this.paneResizeObserver.unobserve(this.observedPropsPane),e&&this.paneResizeObserver.observe(e),this.observedPropsPane=e),this.observedExamplePane!==t&&(this.observedExamplePane&&this.paneResizeObserver.unobserve(this.observedExamplePane),t&&this.paneResizeObserver.observe(t),this.observedExamplePane=t),this.observedPropsContent!==n&&(this.observedPropsContent&&this.paneResizeObserver.unobserve(this.observedPropsContent),n instanceof Element&&this.paneResizeObserver.observe(n),this.observedPropsContent=n),this.observedExampleContent!==r&&(this.observedExampleContent&&this.paneResizeObserver.unobserve(this.observedExampleContent),r instanceof Element&&this.paneResizeObserver.observe(r),this.observedExampleContent=r)}willUpdate(e){if(e.has(`modelJson`)&&this.modelJson)try{this.parsed=JSON.parse(this.modelJson)}catch{this.parsed=null}if(e.has(`parsed`)||e.has(`mockJson`)){let e=this.parsed;e?.example===void 0?this.exampleJson=this.mockJson||``:this.exampleJson=JSON.stringify(e.example,null,2)}}renderExamples(e,t){if(e.examples){let t={},n={};for(let[r,i]of Object.entries(e.examples)){i.value!==void 0&&(t[r]=JSON.stringify(i.value,null,2));let e=i.description||i.summary||``;e&&(n[r]=e)}if(!Object.keys(t).length)return C;let r=Object.keys(n).length?JSON.stringify(n):``;return S`<pp-example-selector mode="inline"
        examples-json=${JSON.stringify(t)}
        descriptions-json=${r}></pp-example-selector>`}let n=e.example??t?.example;return n===void 0?C:S`<pp-example-selector mode="inline" mock-json=${JSON.stringify(n,null,2)}></pp-example-selector>`}collectSchemaEntries(e){let t=[];e.type&&t.push({label:`type`,value:e.type+(e.format?` (${e.format})`:``),isCode:!0}),e.default!==void 0&&t.push({label:`default`,value:JSON.stringify(e.default),isCode:!0});for(let n of tu(e))t.push(n);return e.enum?.length&&t.push({label:`enum`,value:S`<div class="enum-grid">${e.enum.map(e=>S`<span class="enum-value">${JSON.stringify(e)}</span>`)}</div>`}),t}renderPropertyGrid(e){return e.length?S`
      <div class="property-grid">
        ${e.map(e=>S`
          <div class="property-grid-entry">
            <span class="property-grid-label">${e.label}</span>
            <span class="property-grid-value">${e.isCode?S`<code>${e.value}</code>`:e.value}</span>
          </div>
        `)}
      </div>
    `:C}renderParameter(e){let t=e.schema||{},n=[{label:`name`,value:e.name},{label:`in`,value:e.in}];return e.required!==void 0&&n.push({label:`required`,value:String(e.required)}),e.deprecated&&n.push({label:`deprecated`,value:`true`}),n.push(...this.collectSchemaEntries(t)),S`
      ${t.type===`boolean`?C:this.renderExamples(e,t)}
      ${this.renderPropertyGrid(n)}
    `}renderAsyncAPIParameter(e){let t=[];e.location&&t.push({label:`location`,value:e.location,isCode:!0}),e.default!==void 0&&t.push({label:`default`,value:JSON.stringify(e.default),isCode:!0}),Array.isArray(e.enum)&&e.enum.length&&t.push({label:`enum`,value:S`<div class="enum-grid">${e.enum.map(e=>S`<span class="enum-value">${JSON.stringify(e)}</span>`)}</div>`});let n={};return Array.isArray(e.examples)&&e.examples.forEach((e,t)=>{n[`Example ${t+1}`]=JSON.stringify(e,null,2)}),S`
      ${Object.keys(n).length?S`<pp-example-selector mode="inline" examples-json=${JSON.stringify(n)}></pp-example-selector>`:C}
      ${this.renderPropertyGrid(t)}
    `}renderHeader(e){let t=e.schema||{},n=[];return e.required&&n.push({label:`required`,value:`true`}),e.deprecated&&n.push({label:`deprecated`,value:`true`}),n.push(...this.collectSchemaEntries(t)),S`
      ${this.renderExamples(e,t)}
      ${this.renderPropertyGrid(n)}
    `}renderContent(e){let t=Array.isArray(e.content)?e.content:this.normalizeRawContent(e.content);return t.length?S`<pp-media-type-selector content-json=${JSON.stringify(t)} hide-ref-links></pp-media-type-selector>`:C}normalizeRawContent(e){return!e||typeof e!=`object`||Array.isArray(e)?[]:Object.entries(e).map(([e,t])=>{let n=t?.schema??{},r=this.normalizeRawExamples(t),i={mediaType:e,schemaJson:n?JSON.stringify(n):``};if(n?.$ref){let e=this.resolveComponentLink(n.$ref);e&&(i.schemaRef=e)}if(n?.type===`array`&&n.items&&(i.isArray=!0,i.itemsSchemaJson=JSON.stringify(n.items),n.items.$ref)){let e=this.resolveComponentLink(n.items.$ref);e&&(i.itemsRef=e)}return Object.keys(r).length&&(i.examples=r),i}).filter(e=>!!(e.schemaJson||e.schemaRef||e.itemsRef||e.examples&&Object.keys(e.examples).length))}normalizeRawExamples(e){let t={};if(e?.examples&&typeof e.examples==`object`&&!Array.isArray(e.examples))for(let[n,r]of Object.entries(e.examples))r?.value!==void 0&&(t[n]=JSON.stringify(r.value,null,2));return!Object.keys(t).length&&e?.example!==void 0&&(t.Example=JSON.stringify(e.example,null,2)),t}resolveComponentLink(e){if(!e||!e.startsWith(`#/components/`))return null;let t=e.replace(`#/components/`,``).split(`/`);if(t.length!==2)return null;let[n,r]=t,i=yf[n];return i?{name:r,componentType:n,typeSlug:i,slug:this.slugify(r)}:null}slugify(e){let t=e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`);return t=t.toLowerCase(),t=t.replace(/[/]/g,`-`).replace(/[{}_.]/g,`-`).replace(/ /g,`-`),t=t.replace(/[^a-z0-9-]/g,``),t=t.replace(/-{2,}/g,`-`),t=t.replace(/^-|-$/g,``),t||`unnamed`}renderExampleModel(e){let t=[];return e.summary&&t.push({label:`summary`,value:e.summary}),e.externalValue&&t.push({label:`externalValue`,value:S`
          <span class="example-external">
            <a href=${e.externalValue} target="_blank" rel="noreferrer">${e.externalValue}</a>
          </span>
        `}),S`
      ${e.value===void 0?C:S`<pp-example-selector mode="inline" mock-json=${JSON.stringify(e.value,null,2)}></pp-example-selector>`}
      ${this.renderPropertyGrid(t)}
    `}renderSchema(e){if(!(e.properties||e.allOf||e.oneOf||e.anyOf)){let t=this.collectSchemaEntries(e);return S`
        ${e.type!==`boolean`&&this.exampleJson?S`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`:C}
        ${this.renderPropertyGrid(t)}
      `}let t=e.properties?`Properties`:e.allOf?`Composition`:`Variants`;return this.wide&&this.exampleJson?this.renderSchemaSplit(t):this.renderSchemaStacked(t)}renderSchemaSplit(e){let t=this.estimatedSplitHeight>0?`height: ${this.estimatedSplitHeight}px;`:``;return S`
      <sl-split-panel class=${this.exampleHidden?`schema-split example-hidden`:`schema-split`} position=${this.exampleHidden?`100`:`60`} style=${t} @sl-reposition=${e=>e.target===e.currentTarget&&this.handleSplitReposition()}>
        <div slot="start" class="split-pane schema-props-pane">
          <h2>${e}</h2>
          <pp-schema-properties schema-json=${this.modelJson} compact></pp-schema-properties>
        </div>
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>
        <div slot="end" class="split-pane schema-example-pane">
          ${this.exampleHidden?this.renderExampleRestore():S`
            <pp-example-selector mode="inline" mock-json=${this.exampleJson} hide-label show-expand
              show-visibility-toggle
              example-title="${this.name} Example"
              @pp-hide-example=${this.hideExamplePane}></pp-example-selector>
          `}
        </div>
      </sl-split-panel>
    `}hideExamplePane(){this.exampleHidden=!0}showExamplePane(){this.exampleHidden=!1}renderExampleRestore(){return S`
      <sl-tooltip class="example-restore-tooltip" content="show example">
        <sl-icon-button name="eye" label="Show example"
          class="example-restore"
          @click=${this.showExamplePane}></sl-icon-button>
      </sl-tooltip>
    `}renderSchemaStacked(e){return S`
      <div class="schema-stacked" style=${this.estimatedBodyHeight>0?`min-height: ${this.estimatedBodyHeight}px;`:``}>
        ${this.exampleJson?S`<pp-example-selector mode="inline" mock-json=${this.exampleJson}></pp-example-selector>`:C}
        <h2>${e}</h2>
        <pp-schema-properties schema-json=${this.modelJson}></pp-schema-properties>
      </div>
    `}getReservedHeight(){return this.wide&&this.layoutMode===`split`&&this.estimatedSplitHeight>0?this.estimatedSplitHeight:this.estimatedBodyHeight>0?this.estimatedBodyHeight:this.propertyCount>0?Math.min(640,Math.max(220,160+this.propertyCount*40)):this.hasExample?360:240}renderSkeletonRows(e){return Array.from({length:Math.max(3,e||4)},(e,t)=>S`
      <div class="skeleton-row" style=${`width: ${100-Math.min(t*7,28)}%;`}></div>
    `)}renderSkeleton(){let e=`min-height: ${this.getReservedHeight()}px;`;return this.wide&&this.layoutMode===`split`?S`
        <div class="model-skeleton model-skeleton-split" style=${e}>
          <div class="model-skeleton-pane">
            <div class="skeleton-heading"></div>
            <div class="skeleton-list">
              ${this.renderSkeletonRows(this.propertyCount)}
            </div>
          </div>
          <div class="model-skeleton-divider"></div>
          <div class="model-skeleton-pane">
            ${this.hasExample?S`
              <div class="skeleton-example-header"></div>
              <div class="skeleton-example-block"></div>
            `:S`
              <div class="skeleton-example-block skeleton-example-block-muted"></div>
            `}
          </div>
        </div>
      `:S`
      <div class="model-skeleton" style=${e}>
        ${this.hasExample?S`
          <div class="skeleton-example-header"></div>
          <div class="skeleton-example-block"></div>
        `:C}
        <div class="skeleton-heading"></div>
        <div class="skeleton-list">
          ${this.renderSkeletonRows(this.propertyCount)}
        </div>
      </div>
    `}render(){if(!this.parsed)return this.renderSkeleton();let e=this.parsed;return e.in?this.renderParameter(e):this.componentType===`parameters`?this.renderAsyncAPIParameter(e):e.schema&&!e.properties&&!e.in?this.renderHeader(e):e.value!==void 0||e.externalValue!==void 0?this.renderExampleModel(e):e.content?this.renderContent(e):this.renderSchema(e)}};K([O({attribute:`model-json`})],Q.prototype,`modelJson`,void 0),K([O()],Q.prototype,`name`,void 0),K([O({attribute:`component-type`})],Q.prototype,`componentType`,void 0),K([O({attribute:`layout-mode`})],Q.prototype,`layoutMode`,void 0),K([O({attribute:`estimated-body-height`,type:Number})],Q.prototype,`estimatedBodyHeight`,void 0),K([O({attribute:`estimated-split-height`,type:Number})],Q.prototype,`estimatedSplitHeight`,void 0),K([O({attribute:`property-count`,type:Number})],Q.prototype,`propertyCount`,void 0),K([O({attribute:`required-count`,type:Number})],Q.prototype,`requiredCount`,void 0),K([O({attribute:`has-example`,type:Boolean})],Q.prototype,`hasExample`,void 0),K([O({attribute:`raw-yaml`})],Q.prototype,`rawYaml`,void 0),K([O({attribute:`schema-raw-yaml`})],Q.prototype,`schemaRawYaml`,void 0),K([O({attribute:`schema-raw-json`})],Q.prototype,`schemaRawJson`,void 0),K([O({attribute:`schema-start-line`,type:Number})],Q.prototype,`schemaStartLine`,void 0),K([O({attribute:`start-line`,type:Number})],Q.prototype,`startLine`,void 0),K([O()],Q.prototype,`location`,void 0),K([O({attribute:`mock-json`})],Q.prototype,`mockJson`,void 0),K([k()],Q.prototype,`parsed`,void 0),K([k()],Q.prototype,`wide`,void 0),K([k()],Q.prototype,`exampleJson`,void 0),K([k()],Q.prototype,`exampleHidden`,void 0),K([A(`.schema-split`)],Q.prototype,`splitPanel`,void 0),K([A(`.schema-props-pane`)],Q.prototype,`propsPane`,void 0),K([A(`.schema-example-pane`)],Q.prototype,`examplePane`,void 0),Q=K([D(`pp-model-page`)],Q);var bf=class extends U{constructor(...e){super(...e),this.name=``,this.href=``,this.description=``}render(){return S`
      <a href=${this.href}>
        <strong>${this.name}</strong>
        ${Z(this.description)}
      </a>
    `}};K([O()],bf.prototype,`name`,void 0),K([O()],bf.prototype,`href`,void 0),K([O()],bf.prototype,`description`,void 0),bf=K([D(`pp-model-card`)],bf);var xf=x`
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
`,$=class extends j{constructor(){super(...arguments),this.formControlController=new wo(this,{assumeInteractionOn:[`sl-blur`,`sl-input`]}),this.hasSlotController=new oo(this,`help-text`,`label`),this.localize=new F(this),this.hasFocus=!1,this.title=``,this.__numberInput=Object.assign(document.createElement(`input`),{type:`number`}),this.__dateInput=Object.assign(document.createElement(`input`),{type:`date`}),this.type=`text`,this.name=``,this.value=``,this.defaultValue=``,this.size=`medium`,this.filled=!1,this.pill=!1,this.label=``,this.helpText=``,this.clearable=!1,this.disabled=!1,this.placeholder=``,this.readonly=!1,this.passwordToggle=!1,this.passwordVisible=!1,this.noSpinButtons=!1,this.form=``,this.required=!1,this.spellcheck=!0}get valueAsDate(){return this.__dateInput.type=this.type,this.__dateInput.value=this.value,this.input?.valueAsDate||this.__dateInput.valueAsDate}set valueAsDate(e){this.__dateInput.type=this.type,this.__dateInput.valueAsDate=e,this.value=this.__dateInput.value}get valueAsNumber(){return this.__numberInput.value=this.value,this.input?.valueAsNumber||this.__numberInput.valueAsNumber}set valueAsNumber(e){this.__numberInput.valueAsNumber=e,this.value=this.__numberInput.value}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit(`sl-blur`)}handleChange(){this.value=this.input.value,this.emit(`sl-change`)}handleClearClick(e){e.preventDefault(),this.value!==``&&(this.value=``,this.emit(`sl-clear`),this.emit(`sl-input`),this.emit(`sl-change`)),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit(`sl-focus`)}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit(`sl-input`)}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleKeyDown(e){let t=e.metaKey||e.ctrlKey||e.shiftKey||e.altKey;e.key===`Enter`&&!t&&setTimeout(()=>{!e.defaultPrevented&&!e.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(e,t,n=`none`){this.input.setSelectionRange(e,t,n)}setRangeText(e,t,n,r=`preserve`){let i=t??this.input.selectionStart,a=n??this.input.selectionEnd;this.input.setRangeText(e,i,a,r),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){`showPicker`in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){let e=this.hasSlotController.test(`label`),t=this.hasSlotController.test(`help-text`),n=this.label?!0:!!e,r=this.helpText?!0:!!t,i=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value==`number`||this.value.length>0);return S`
      <div
        part="form-control"
        class=${M({"form-control":!0,"form-control--small":this.size===`small`,"form-control--medium":this.size===`medium`,"form-control--large":this.size===`large`,"form-control--has-label":n,"form-control--has-help-text":r})}
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
            class=${M({input:!0,"input--small":this.size===`small`,"input--medium":this.size===`medium`,"input--large":this.size===`large`,"input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons})}
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
              name=${N(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${N(this.placeholder)}
              minlength=${N(this.minlength)}
              maxlength=${N(this.maxlength)}
              min=${N(this.min)}
              max=${N(this.max)}
              step=${N(this.step)}
              .value=${Dl(this.value)}
              autocapitalize=${N(this.autocapitalize)}
              autocomplete=${N(this.autocomplete)}
              autocorrect=${N(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${N(this.pattern)}
              enterkeyhint=${N(this.enterkeyhint)}
              inputmode=${N(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${i?S`
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
            ${this.passwordToggle&&!this.disabled?S`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.passwordVisible?`hidePassword`:`showPassword`)}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.passwordVisible?S`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:S`
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
    `}};$.styles=[E,El,xf],$.dependencies={"sl-icon":or},w([A(`.input__control`)],$.prototype,`input`,2),w([k()],$.prototype,`hasFocus`,2),w([O()],$.prototype,`title`,2),w([O({reflect:!0})],$.prototype,`type`,2),w([O()],$.prototype,`name`,2),w([O()],$.prototype,`value`,2),w([Tl()],$.prototype,`defaultValue`,2),w([O({reflect:!0})],$.prototype,`size`,2),w([O({type:Boolean,reflect:!0})],$.prototype,`filled`,2),w([O({type:Boolean,reflect:!0})],$.prototype,`pill`,2),w([O()],$.prototype,`label`,2),w([O({attribute:`help-text`})],$.prototype,`helpText`,2),w([O({type:Boolean})],$.prototype,`clearable`,2),w([O({type:Boolean,reflect:!0})],$.prototype,`disabled`,2),w([O()],$.prototype,`placeholder`,2),w([O({type:Boolean,reflect:!0})],$.prototype,`readonly`,2),w([O({attribute:`password-toggle`,type:Boolean})],$.prototype,`passwordToggle`,2),w([O({attribute:`password-visible`,type:Boolean})],$.prototype,`passwordVisible`,2),w([O({attribute:`no-spin-buttons`,type:Boolean})],$.prototype,`noSpinButtons`,2),w([O({reflect:!0})],$.prototype,`form`,2),w([O({type:Boolean,reflect:!0})],$.prototype,`required`,2),w([O()],$.prototype,`pattern`,2),w([O({type:Number})],$.prototype,`minlength`,2),w([O({type:Number})],$.prototype,`maxlength`,2),w([O()],$.prototype,`min`,2),w([O()],$.prototype,`max`,2),w([O()],$.prototype,`step`,2),w([O()],$.prototype,`autocapitalize`,2),w([O()],$.prototype,`autocorrect`,2),w([O()],$.prototype,`autocomplete`,2),w([O({type:Boolean})],$.prototype,`autofocus`,2),w([O()],$.prototype,`enterkeyhint`,2),w([O({type:Boolean,converter:{fromAttribute:e=>!(!e||e===`false`),toAttribute:e=>e?`true`:`false`}})],$.prototype,`spellcheck`,2),w([O()],$.prototype,`inputmode`,2),w([T(`disabled`,{waitUntilFirstUpdate:!0})],$.prototype,`handleDisabledChange`,1),w([T(`step`,{waitUntilFirstUpdate:!0})],$.prototype,`handleStepChange`,1),w([T(`value`,{waitUntilFirstUpdate:!0})],$.prototype,`handleValueChange`,1),$.define(`sl-input`);var Sf={schemas:`Schemas`,responses:`Responses`,parameters:`Parameters`,requestBodies:`Request Bodies`,headers:`Headers`,securitySchemes:`Security Schemes`,examples:`Examples`,links:`Links`,callbacks:`Callbacks`},Cf=[`GET`,`POST`,`PUT`,`DELETE`,`PATCH`,`OPTIONS`,`HEAD`,`QUERY`,`RECEIVE`,`SEND`],wf=new Set([`receive`,`send`]);function Tf(e){return e.trim().toUpperCase()}function Ef(e){return e.trim().toLowerCase()}function Df(e){return wf.has(Ef(e))}var Of=class extends U{constructor(...e){super(...e),this.type=`operations`,this.heading=``,this.items=[],this.filterValue=``,this.searchTerm=``,this.filteredItems=[],this.filterOptions=[],this.handleClear=()=>{clearTimeout(this.searchTimeout),this.searchTerm=``}}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.searchTimeout)}willUpdate(e){e.has(`items`)&&(this.type===`components`?this.filterOptions=[...new Set(this.items.map(e=>e.componentType))].sort():this.filterOptions=[...new Set(this.items.map(e=>Tf(e.method)).filter(Boolean))].sort((e,t)=>{let n=Cf.indexOf(e),r=Cf.indexOf(t);return n!==-1||r!==-1?(n===-1?Cf.length:n)-(r===-1?Cf.length:r):e.localeCompare(t)})),(e.has(`items`)||e.has(`filterValue`)||e.has(`searchTerm`))&&(this.filteredItems=this.computeFiltered())}computeFiltered(){let e=this.searchTerm.toLowerCase();if(this.type===`operations`){let t=this.items;return this.filterValue&&(t=t.filter(e=>Tf(e.method)===this.filterValue)),e&&(t=t.filter(t=>t.path.toLowerCase().includes(e)||(t.operationId??``).toLowerCase().includes(e))),t}else{let t=this.items;return this.filterValue&&(t=t.filter(e=>e.componentType===this.filterValue)),e&&(t=t.filter(t=>t.name.toLowerCase().includes(e))),t}}handleSearch(e){clearTimeout(this.searchTimeout);let t=e.target.value;this.searchTimeout=window.setTimeout(()=>{this.searchTerm=t},150)}handleFilter(e){this.filterValue=e.detail?.item?.value??``}renderOperationMethod(e){return Df(e)?S`<pp-asyncapi-action action=${Ef(e)} size="small"></pp-asyncapi-action>`:S`<pp-http-method method=${e} tiny></pp-http-method>`}renderToolbar(){let e=this.type===`operations`?this.filterValue||`ALL METHODS`:Sf[this.filterValue]?.toUpperCase()||this.filterValue?.toUpperCase()||`ALL TYPES`;return S`
            <div class="toolbar">
                <sl-dropdown>
                    <sl-button slot="trigger" class="filter-btn" caret size="small">
                        ${this.type===`operations`&&this.filterValue?this.renderOperationMethod(this.filterValue):e}
                    </sl-button>
                    <sl-menu @sl-select=${this.handleFilter}>
                        <sl-menu-item value="">
                            ${this.type===`operations`?`ALL METHODS`:`ALL TYPES`}
                        </sl-menu-item>
                        ${this.type===`operations`?this.filterOptions.map(e=>S`
                                <sl-menu-item value=${e}>${this.renderOperationMethod(e)}</sl-menu-item>`):this.filterOptions.map(e=>S`
                                <sl-menu-item value=${e}>
                                    ${Sf[e]||e}
                                </sl-menu-item>`)}
                    </sl-menu>
                </sl-dropdown>
                <sl-input
                    size="small"
                    placeholder=${this.type===`operations`?`SEARCH OPERATIONS...`:`SEARCH NAMES...`}
                    aria-label=${this.type===`operations`?`Filter by operation`:`Search components`}
                    clearable
                    @sl-input=${this.handleSearch}
                    @sl-clear=${this.handleClear}>
                </sl-input>
            </div>
        `}renderOperationLabel(e){let t=e.operationId?.trim();return t?S`<span
                class="operation-ref-title"
                style="display:block;color:var(--terminal-text);line-height:1;overflow-wrap:anywhere;word-break:break-word;">${t}</span>`:S`<pp-render-operation-path path=${e.path}></pp-render-operation-path>`}renderOperationItem(e){return S`
            <div
                class="operation-ref-row"
                style="display:grid;grid-template-columns:max-content minmax(0,1fr);align-items:baseline;column-gap:var(--global-padding);padding:var(--global-padding-half) 0;min-width:0;">
                <span
                    class="operation-ref-method"
                    style="display:inline-flex;align-items:baseline;justify-content:flex-start;min-width:0;line-height:1;">
                    ${this.renderOperationMethod(e.method)}
                </span>
                <a class="operation-ref-link"
                   style="display:block;min-width:0;max-width:100%;color:var(--terminal-text);line-height:1;text-decoration:none;font-family:var(--font-stack),monospace;--op-path-text-decoration:none;"
                   @mouseenter=${e=>e.currentTarget.style.textDecoration=`underline`}
                   @mouseleave=${e=>e.currentTarget.style.textDecoration=`none`}
                   @focus=${e=>e.currentTarget.style.textDecoration=`underline`}
                   @blur=${e=>e.currentTarget.style.textDecoration=`none`}
                   href=${zc(e.slug)}>
                    ${this.renderOperationLabel(e)}
                </a>
            </div>
        `}renderComponentItem(e){return S`
            <div style="display:flex;align-items:center;gap:var(--global-padding);padding:0.2rem 0">
                <pp-model-icon icon=${e.componentType} size="medium"></pp-model-icon>
                <a style="color:var(--terminal-text);text-decoration:none;font-family:var(--font-stack),monospace"
                   @mouseenter=${e=>e.target.style.textDecoration=`underline`}
                   @mouseleave=${e=>e.target.style.textDecoration=`none`}
                   href=${Bc(e.typeSlug,e.slug)}><span aria-hidden="true">\u279c</span> ${e.name}</a>
            </div>
        `}render(){if(!this.items.length)return C;let e=this.type===`operations`?this.filteredItems.map(e=>this.renderOperationItem(e)):this.filteredItems.map(e=>this.renderComponentItem(e)),t=this.items.length>20;return S`
            <h2>${this.heading}</h2>
            ${t?this.renderToolbar():C}
            ${this.filteredItems.length?S`<pp-paginated-list
                            .values=${e}
                            .label=${this.heading}>
                        </pp-paginated-list>`:S`<div class="empty-state">No matching references</div>`}
        `}};K([O()],Of.prototype,`type`,void 0),K([O()],Of.prototype,`heading`,void 0),K([O({type:Array})],Of.prototype,`items`,void 0),K([k()],Of.prototype,`filterValue`,void 0),K([k()],Of.prototype,`searchTerm`,void 0),K([k()],Of.prototype,`filteredItems`,void 0),K([k()],Of.prototype,`filterOptions`,void 0),Of=K([D(`pp-ref-list`)],Of);var kf=class extends U{constructor(...e){super(...e),this.refsJson=``,this.refs={}}willUpdate(e){if(e.has(`refsJson`)&&this.refsJson)try{this.refs=JSON.parse(this.refsJson)}catch{this.refs={}}}render(){let{refs:e}=this,t=(e.usedByOperations?.length??0)>0,n=(e.usedByModels?.length??0)>0,r=(e.usesModels?.length??0)>0;return!t&&!n&&!r?C:S`
            ${t?S`
                <pp-ref-list
                    type="operations"
                    heading="Consumed By"
                    .items=${e.usedByOperations}>
                </pp-ref-list>`:C}
            ${n?S`
                <pp-ref-list
                    type="components"
                    heading="Referenced By"
                    .items=${e.usedByModels}>
                </pp-ref-list>`:C}
            ${r?S`
                <pp-ref-list
                    type="components"
                    heading="References"
                    .items=${e.usesModels}>
                </pp-ref-list>`:C}
        `}};K([O({attribute:`refs-json`})],kf.prototype,`refsJson`,void 0),K([k()],kf.prototype,`refs`,void 0),kf=K([D(`pp-cross-refs`)],kf);var Af=class extends U{constructor(...e){super(...e),this.title=``,this.json=``,this.yaml=``,this.format=`json`,this.rawMode=!1,this.highlightLines=``,this.startLine=1,this.location=``,this.method=``,this.path=``,this.componentType=``,this.handleShowExample=e=>{let t=e.detail;if((document.querySelector(`pp-problems-drawer`)?.querySelector(`sl-drawer`))?.hide?.(),this.title=t.title,this.json=t.json,this.yaml=t.yaml||``,this.rawMode=t.rawMode??!1,this.highlightLines=t.highlightLines||``,this.startLine=t.startLine??1,this.location=t.location||``,this.method=t.method||``,this.path=t.path||``,this.componentType=t.componentType||``,t.language)this.format=t.language;else{let e=document.body.getAttribute(`data-spec-format`);e===`yaml`&&t.yaml?this.format=`yaml`:e===`json`&&t.json?this.format=`json`:this.format=t.yaml?`yaml`:`json`}this.updateComplete.then(()=>{let e=this.drawer;e&&typeof e.show==`function`&&(e.updateComplete?e.updateComplete.then(()=>e.show()):e.show())})}}connectedCallback(){super.connectedCallback(),document.addEventListener(`pp-show-example`,this.handleShowExample)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`pp-show-example`,this.handleShowExample)}get copyText(){let e=this.querySelector(`pp-code-viewer`);return e?e.displayCode:this.format===`yaml`&&this.yaml?this.yaml:this.json}async copyCurrentCode(){let e=this.copyText;e&&await navigator.clipboard.writeText(e)}renderHeader(){return this.method&&this.path?S`
        <div class="rich-header">
          <pp-http-method method=${this.method}></pp-http-method>
          <pp-render-operation-path path=${this.path} nowrap></pp-render-operation-path>
        </div>
      `:this.componentType?S`
        <div class="component-header">
          <pp-model-icon icon=${this.componentType} size="large"></pp-model-icon>
          <span class="drawer-component-title">${this.title}</span>
        </div>
      `:S`<h3 class="drawer-title">${this.title||`Example`}</h3>`}render(){let e=this.format===`yaml`&&this.yaml?this.yaml:this.json,t=this.format;return S`
      <sl-drawer placement="end" no-header>
        <div class="drawer-header">
          ${this.renderHeader()}
          <div class="header-actions">
            ${this.yaml?S`
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
          <div class="floating-actions">
            <sl-tooltip class="floating-copy" content="copy example to clipboard">
              <sl-icon-button
                name="copy"
                label="Copy example to clipboard"
                @click=${this.copyCurrentCode}>
              </sl-icon-button>
            </sl-tooltip>
          </div>
          <pp-code-viewer
            .code=${e}
            .language=${t}
            ?line-numbers=${this.rawMode}
            .pretty=${t===`json`}
            reserve-location
            .startLine=${this.startLine}
            .location=${this.location}
            highlight-lines=${this.highlightLines}
            embedded>
          </pp-code-viewer>
        </div>
      </sl-drawer>
    `}};K([k()],Af.prototype,`title`,void 0),K([k()],Af.prototype,`json`,void 0),K([k()],Af.prototype,`yaml`,void 0),K([k()],Af.prototype,`format`,void 0),K([k()],Af.prototype,`rawMode`,void 0),K([k()],Af.prototype,`highlightLines`,void 0),K([k()],Af.prototype,`startLine`,void 0),K([k()],Af.prototype,`location`,void 0),K([k()],Af.prototype,`method`,void 0),K([k()],Af.prototype,`path`,void 0),K([k()],Af.prototype,`componentType`,void 0),K([A(`sl-drawer`)],Af.prototype,`drawer`,void 0),Af=K([D(`pp-example-drawer`)],Af);var jf=class extends U{constructor(...e){super(...e),this.btnTitle=``,this.rawJson=``,this.rawYaml=``,this.highlightLines=``,this.startLine=1,this.location=``,this.method=``,this.path=``,this.componentType=``,this.showTextLabel=!1}showRaw(){let e=new CustomEvent(`pp-show-example`,{bubbles:!0,composed:!0,detail:{title:this.btnTitle||`Raw Object`,json:this.rawJson,yaml:this.rawYaml,rawMode:!0,highlightLines:this.highlightLines||void 0,startLine:this.startLine>1?this.startLine:void 0,location:this.location||void 0,method:this.method||void 0,path:this.path||void 0,componentType:this.componentType||void 0}});this.dispatchEvent(e)}render(){return!this.rawJson&&!this.rawYaml?C:S`
            <sl-tooltip content="VIEW RAW OBJECT">
                <sl-button variant="text" size="small" @click=${this.showRaw}>
                    <sl-icon slot="prefix" name="braces" label="VIEW RAW OBJECT" ></sl-icon>
                </sl-button>
            </sl-tooltip>`}};K([O({attribute:`title`})],jf.prototype,`btnTitle`,void 0),K([O({attribute:`raw-json`})],jf.prototype,`rawJson`,void 0),K([O({attribute:`raw-yaml`})],jf.prototype,`rawYaml`,void 0),K([O({attribute:`highlight-lines`})],jf.prototype,`highlightLines`,void 0),K([O({attribute:`start-line`,type:Number})],jf.prototype,`startLine`,void 0),K([O()],jf.prototype,`location`,void 0),K([O()],jf.prototype,`method`,void 0),K([O()],jf.prototype,`path`,void 0),K([O({attribute:`component-type`})],jf.prototype,`componentType`,void 0),K([O({type:Boolean})],jf.prototype,`showTextLabel`,void 0),jf=K([D(`pp-raw-viewer-btn`)],jf);var Mf=class extends U{constructor(...e){super(...e),this.scopeLabel=`Diagnostics`,this.method=``,this.path=``,this.componentType=``,this.problems=[],this.slices={},this.metadata={},this.selectedID=``,this.handleShowProblems=async e=>{let t=e.detail||{};this.scopeLabel=t.title||t.scopeLabel||`Diagnostics`,this.method=t.method||``,this.path=t.path||``,this.componentType=t.componentType||``,this.problems=t.problems||[],this.slices=t.slices||{},this.metadata=t.metadata||{},this.selectedID=this.problems[0]?.id||``,await this.updateComplete,this.closeExampleDrawer(),this.drawer?.show&&(this.drawer.show(),await this.waitForDrawerShown(),this.scrollSelectedIntoView())}}connectedCallback(){super.connectedCallback(),window.addEventListener(`pp-show-problems`,this.handleShowProblems)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`pp-show-problems`,this.handleShowProblems)}closeExampleDrawer(){(document.querySelector(`pp-example-drawer`)?.querySelector(`sl-drawer`))?.hide?.()}waitForDrawerShown(){return new Promise(e=>{let t=this.drawer;if(!t){e();return}t.addEventListener(`sl-after-show`,()=>e(),{once:!0})})}selectProblem(e){this.selectedID=e.id,this.updateComplete.then(()=>this.scrollSelectedIntoView())}scrollSelectedIntoView(){let e=this.selectedProblem;e&&this.viewer?.scrollToLine(e.startLineNumber)}get selectedProblem(){return this.problems.find(e=>e.id===this.selectedID)||this.problems[0]}get selectedSlice(){let e=this.selectedProblem;if(!e)return;let t=this.metadata[e.id]?.sliceKey||e.sliceKey||``;return t?this.slices[t]:void 0}highlightLines(e){let t=e.startLineNumber,n=e.endLineNumber||t;return t<=0?``:n>t?`${t}-${n}`:`${t}`}sliceLanguage(e){return e.file.toLowerCase().endsWith(`.json`)?`json`:`yaml`}displayLocation(e){return e.split(/[\\/]/).pop()||e}renderHeaderContext(){return this.method&&this.path?S`
        <div class="rich-header">
          <pp-http-method method=${this.method}></pp-http-method>
          <pp-render-operation-path path=${this.path} nowrap></pp-render-operation-path>
        </div>
      `:this.componentType?S`
        <div class="component-header">
          <pp-model-icon icon=${this.componentType} size="large"></pp-model-icon>
          <span class="drawer-component-title">${this.scopeLabel}</span>
        </div>
      `:S`<h3>${this.scopeLabel}</h3>`}render(){let e=this.selectedProblem,t=this.selectedSlice;return S`
      <sl-drawer placement="bottom" no-header label="Diagnostics" style="--size: 50vh">
        <div class="drawer-header">
          <div class="drawer-title">
            ${this.renderHeaderContext()}
            <span class="problem-count">
              <span class="count-value">${this.problems.length}</span>
              <span class="count-label">problem${this.problems.length===1?``:`s`}</span>
            </span>
          </div>
          <sl-icon-button name="x-lg" label="Close" @click=${()=>this.drawer?.hide()}></sl-icon-button>
        </div>
        <sl-split-panel position="35" class="split">
          <div slot="start" class="problem-list">
            ${this.problems.map(t=>S`
              <button
                class="problem ${jl(t.severity)} ${t.id===e?.id?`active`:``}"
                @click=${()=>this.selectProblem(t)}
              >
                <span class="line">${t.startLineNumber||`-`}</span>
                <sl-icon
                  class="severity-icon"
                  name=${Ml(t.severity)}
                  label=${Nl(t.severity)}
                ></sl-icon>
                ${Z(t.message,{className:`message pp-markdown-inline`,inline:!0})}
              </button>
            `)}
          </div>
          <sl-icon slot="divider" name="grip-vertical"></sl-icon>
          <div slot="end" class="slice-panel">
            ${t&&e?S`
                <pp-code-viewer
                  .code=${t.source}
                  .language=${this.sliceLanguage(t)}
                  .startLine=${t.firstLine}
                  .location=${this.displayLocation(t.file||e.sourceLocation||``)}
                  line-numbers
                  embedded
                  highlight-lines=${this.highlightLines(e)}
                ></pp-code-viewer>
              `:S`<div class="empty">No source slice available</div>`}
          </div>
        </sl-split-panel>
      </sl-drawer>
    `}};K([A(`sl-drawer`)],Mf.prototype,`drawer`,void 0),K([A(`pp-code-viewer`)],Mf.prototype,`viewer`,void 0),K([k()],Mf.prototype,`scopeLabel`,void 0),K([k()],Mf.prototype,`method`,void 0),K([k()],Mf.prototype,`path`,void 0),K([k()],Mf.prototype,`componentType`,void 0),K([k()],Mf.prototype,`problems`,void 0),K([k()],Mf.prototype,`slices`,void 0),K([k()],Mf.prototype,`metadata`,void 0),K([k()],Mf.prototype,`selectedID`,void 0),Mf=K([D(`pp-problems-drawer`)],Mf);function Nf(){return globalThis.__PP_BOOTSTRAP__?.page||null}function Pf(e){return e?{counts:e.counts||{errors:0,warns:0,infos:0},siteCounts:e.siteCounts,problems:e.problems||[],slices:e.slices||{},metadata:e.metadata||{},orphanCount:e.orphanCount||0}:null}async function Ff(){if(d(`ppDeveloperMode`)!==`true`)return null;let e=Nf();return e?Pf(e.developer):(await new Promise(e=>{document.addEventListener(`pp:hydrated`,()=>e(),{once:!0})}),Pf(Nf()?.developer))}var If=class extends U{constructor(...e){super(...e),this.scopeLabel=``,this.drawerTitle=``,this.method=``,this.path=``,this.componentType=``,this.payload=null}async firstUpdated(){this.payload=await Ff()}resolveDrawerContext(){let e=this.getRootNode(),t=e.querySelector?.(`#pp-operation-raw, #pp-model-raw`),n=e.querySelector?.(`pp-icon-title[icon][heading]`),r=this.scopeLabel.trim(),i=/^(GET|PUT|POST|DELETE|PATCH|OPTIONS|HEAD|TRACE)\s+(.+)$/i.exec(r),a=this.method||t?.getAttribute(`method`)||i?.[1]||``,o=this.path||t?.getAttribute(`path`)||i?.[2]||``,s=this.componentType||t?.getAttribute(`component-type`)||n?.getAttribute(`icon`)||``;return{title:this.drawerTitle||t?.getAttribute(`title`)||n?.getAttribute(`heading`)||r||`Diagnostics`,method:a,path:o,componentType:s}}showDetails(){if(!this.payload||!this.payload.problems.length)return;let e=this.resolveDrawerContext();window.dispatchEvent(new CustomEvent(`pp-show-problems`,{detail:{scopeLabel:e.title,title:e.title,method:e.method,path:e.path,componentType:e.componentType,problems:this.payload.problems,slices:this.payload.slices,metadata:this.payload.metadata}}))}renderStat(e,t,n,r,i){let a=e||0;return a<=0?C:S`
      <div class="stat ${t}">
        <sl-icon name=${n} aria-hidden="true"></sl-icon>
        <span class="label">${a}</span>
        <span class="violation">${Al(a,r,i)}</span>
      </div>
    `}render(){let e=this.payload?.counts;return!this.payload||!e||kl(e)===0?C:S`
      <div class="stats" role="group" aria-label="Diagnostics">
        ${this.renderStat(e.errors,`err`,`exclamation-square`,`error`)}
        ${this.renderStat(e.warns,`warn`,`exclamation-triangle`,`warning`)}
        ${this.renderStat(e.infos,`info`,`info-square`,`info`,`infos`)}
        <sl-button class="details-button" size="medium" @click=${this.showDetails}>
          OPEN PROBLEMS
        </sl-button>
      </div>
    `}};K([O({attribute:`data-scope-label`})],If.prototype,`scopeLabel`,void 0),K([O({attribute:`data-title`})],If.prototype,`drawerTitle`,void 0),K([O({attribute:`data-method`})],If.prototype,`method`,void 0),K([O({attribute:`data-path`})],If.prototype,`path`,void 0),K([O({attribute:`data-component-type`})],If.prototype,`componentType`,void 0),K([k()],If.prototype,`payload`,void 0),If=K([D(`pp-violation-stats`)],If);var Lf={implicit:`IMPLICIT`,authorizationCode:`AUTHORIZATION CODE`,clientCredentials:`CLIENT CREDENTIALS`,password:`PASSWORD`};function Rf(e,t,n){switch(e){case`apiKey`:switch(t){case`cookie`:return`cookie`;case`header`:return`envelope`;case`query`:return`signpost`;default:return`key`}case`http`:switch(n){case`bearer`:return`shield-lock`;case`basic`:return`person-lock`;default:return`lock`}case`oauth2`:return`key`;case`openIdConnect`:return`fingerprint`;default:return`lock`}}var zf=class extends U{constructor(...e){super(...e),this.schemeJson=``,this.scheme=null}willUpdate(e){if(e.has(`schemeJson`)&&this.schemeJson)try{this.scheme=JSON.parse(this.schemeJson)}catch{this.scheme=null}}renderProperty(e,t){return S`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">${e}</span></div>
                <div class="prop-type-col"><span class="prop-type">${t}</span></div>
            </div>
        `}renderTypeProperty(e,t){return S`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">type</span></div>
                <div class="prop-type-col">
                    <sl-icon name=${t} class="type-icon"></sl-icon>
                    <span class="prop-type">${e.toUpperCase()}</span>
                </div>
            </div>
        `}renderUrlProperty(e,t){return S`
            <div class="property">
                <div class="prop-name-col"><span class="prop-name">${e}</span></div>
                <div class="prop-type-col">
                    <a class="url-link" href=${t} target="_blank" rel="noopener noreferrer">${t}</a>
                </div>
            </div>
        `}renderScopes(e){let t=Object.entries(e);return t.length===0?C:S`
            <div class="scopes-section">
                <div class="property scope-header">
                    <div class="prop-name-col"><span class="scope-heading">SCOPES</span></div>
                    <div class="prop-type-col"></div>
                </div>
                ${t.map(([e,t])=>S`
                    <div class="property scope-row">
                        <div class="prop-name-col"><code class="scope-name">${e}</code></div>
                        <div class="prop-type-col"><span class="scope-desc">${t}</span></div>
                    </div>
                `)}
            </div>
        `}renderFlow(e,t){return t?S`
            <div class="flow-section">
                <div class="flow-heading">${Lf[e]||e.toUpperCase()}</div>
                ${t.authorizationUrl?this.renderUrlProperty(`authorizationUrl`,t.authorizationUrl):C}
                ${t.tokenUrl?this.renderUrlProperty(`tokenUrl`,t.tokenUrl):C}
                ${t.refreshUrl?this.renderUrlProperty(`refreshUrl`,t.refreshUrl):C}
                ${t.scopes&&Object.keys(t.scopes).length>0?this.renderScopes(t.scopes):C}
            </div>
        `:C}renderFlows(e){if(!e||typeof e!=`object`)return C;let t=Object.keys(e);return t.length===0?C:t.map(t=>this.renderFlow(t,e[t]))}render(){if(!this.scheme)return C;let{type:e,name:t,scheme:n,bearerFormat:r,openIdConnectUrl:i,flows:a}=this.scheme,o=Rf(e,this.scheme.in,n);return S`
            <div class="scheme-properties">
                ${e?this.renderTypeProperty(e,o):C}
                ${t?this.renderProperty(`name`,t):C}
                ${this.scheme.in?this.renderProperty(`in`,this.scheme.in):C}
                ${n?this.renderProperty(`scheme`,n):C}
                ${r?this.renderProperty(`bearerFormat`,r):C}
                ${i?this.renderUrlProperty(`openIdConnectUrl`,i):C}
                ${e===`oauth2`?this.renderFlows(a):C}
            </div>
        `}};K([O({attribute:`scheme-json`})],zf.prototype,`schemeJson`,void 0),K([k()],zf.prototype,`scheme`,void 0),zf=K([D(`pp-security-scheme`)],zf);var Bf=`pp-page-nav-collapsed`,Vf=`pp-page-nav-hidden`,Hf=class extends U{constructor(...e){super(...e),this.pageTitle=``,this.sectionsJson=``,this.sections=[],this.collapsed=!1,this.navHidden=!1,this.activeId=``,this.scrollContainer=null,this.rafId=0,this.scrollSpySuppressed=!1,this.suppressionTimerId=0,this.boundScrollHandler=()=>this.onScroll(),this.boundHydrationHandler=()=>this.handleHydrationComplete()}connectedCallback(){super.connectedCallback(),this.collapsed=localStorage.getItem(Bf)===`true`,this.navHidden=localStorage.getItem(Vf)===`true`,document.addEventListener(`pp:hydrated`,this.boundHydrationHandler)}disconnectedCallback(){super.disconnectedCallback(),this.scrollContainer?.removeEventListener(`scroll`,this.boundScrollHandler),this.clearSuppressionTimer(),document.removeEventListener(`pp:hydrated`,this.boundHydrationHandler)}clearSuppressionTimer(){this.suppressionTimerId&&=(window.clearTimeout(this.suppressionTimerId),0)}updated(e){e.has(`navHidden`)&&this.toggleAttribute(`nav-hidden`,this.navHidden)}willUpdate(e){if(e.has(`sectionsJson`)&&this.sectionsJson){try{this.sections=JSON.parse(this.sectionsJson)}catch{this.sections=[]}this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}}loadResponseChildren(){let e=this.sections.find(e=>e.id===`section-responses`);if(!e)return;let t=()=>{let t=document.getElementById(`section-responses`);t&&typeof t.getResponseNavItems==`function`&&(e.children=t.getResponseNavItems(),this.requestUpdate())};t(),e.children?.length||customElements.whenDefined(`pp-operation-responses`).then(()=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>t())})})}setupScrollSpy(){this.scrollContainer?.removeEventListener(`scroll`,this.boundScrollHandler),this.scrollContainer=document.querySelector(`pp-layout`)?.querySelector(`.content-panel`)||null,this.scrollContainer&&this.scrollContainer.addEventListener(`scroll`,this.boundScrollHandler,{passive:!0})}handleHydrationComplete(){this.loadResponseChildren(),requestAnimationFrame(()=>this.setupScrollSpy())}suppressScrollSpy(){this.scrollSpySuppressed=!0,this.clearSuppressionTimer()}scheduleScrollSpyResume(){this.clearSuppressionTimer(),this.suppressionTimerId=window.setTimeout(()=>{this.scrollSpySuppressed=!1,this.suppressionTimerId=0},150)}onScroll(){if(this.scrollSpySuppressed){this.scheduleScrollSpyResume();return}this.rafId||=requestAnimationFrame(()=>{this.rafId=0,this.updateActiveSection()})}updateActiveSection(){let e=``;for(let t of this.sections){let n=this.findElement(t.id);if(n&&n.getBoundingClientRect().top<=100&&(e=t.id),t.children)for(let n of t.children){let t=this.findElement(n.id);t&&t.getBoundingClientRect().top<=100&&(e=n.id)}}e&&e!==this.activeId&&(this.activeId=e)}findElement(e){let t=document.getElementById(e);if(t)return t;let n=document.getElementById(`section-responses`);return n?n.querySelector(`#${CSS.escape(e)}`):null}navigateTo(e){this.suppressScrollSpy(),this.activeId=e;let t=this.findElement(e);if(!t)return;let n=t.closest(`sl-details`);n&&!n.open?(n.addEventListener(`sl-after-show`,()=>{t.scrollIntoView({behavior:`auto`,block:`center`})},{once:!0}),n.open=!0):t.scrollIntoView({behavior:`auto`,block:`center`})}toggleCollapsed(){this.collapsed=!this.collapsed,localStorage.setItem(Bf,String(this.collapsed))}toggleNavHidden(){let e=this.querySelector(`.collapse-tab`);e&&(e.addEventListener(`animationend`,()=>e.classList.remove(`flashing`),{once:!0}),e.classList.add(`flashing`));let t=this.querySelector(`.nav-container`);!this.navHidden&&t?t.style.height=t.offsetHeight+`px`:this.navHidden&&t&&(t.style.height=``),this.navHidden=!this.navHidden,localStorage.setItem(Vf,String(this.navHidden))}handleTabKeydown(e){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.toggleNavHidden())}statusColorClass(e){let t=e.substring(0,1);return t===`2`?`status-2xx`:t===`3`?`status-3xx`:t===`4`?`status-4xx`:t===`5`?`status-5xx`:``}render(){return S`
            <div class="nav-container">
                <nav aria-label="Page sections">
                    <div class="nav-header" @click=${this.toggleCollapsed}
                         aria-expanded=${!this.collapsed}>
                        <span class="nav-title">${this.pageTitle}</span>
                        <sl-icon name=${this.collapsed?`chevron-right`:`chevron-down`}></sl-icon>
                    </div>
                    ${this.collapsed?C:S`
                        <ul class="nav-sections">
                            ${this.sections.map(e=>S`
                                <li>
                                    <a href="#${e.id}"
                                       class=${e.id===this.activeId?`active`:``}
                                       aria-current=${e.id===this.activeId?`true`:C}
                                       @click=${t=>{t.preventDefault(),this.navigateTo(e.id)}}>
                                        ${e.label}
                                    </a>
                                    ${e.children?.length?S`
                                        <ul class="nav-children">
                                            ${e.children.map(e=>S`
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
                                    `:C}
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
        `}};K([O({attribute:`page-title`})],Hf.prototype,`pageTitle`,void 0),K([O({attribute:`sections-json`})],Hf.prototype,`sectionsJson`,void 0),K([k()],Hf.prototype,`sections`,void 0),K([k()],Hf.prototype,`collapsed`,void 0),K([k()],Hf.prototype,`navHidden`,void 0),K([k()],Hf.prototype,`activeId`,void 0),Hf=K([D(`pp-page-nav`)],Hf);var Uf=function(e){return e.LineNumber=`Line Number`,e.Severity=`Severity`,e}(Uf||{}),Wf=Object.values(Uf),Gf={operations:`Operations`,schemas:`Schemas`,parameters:`Parameters`,responses:`Responses`,requestBodies:`Request Bodies`,headers:`Headers`,securitySchemes:`Security Schemes`,examples:`Examples`,links:`Links`,callbacks:`Callbacks`,pathItems:`Path Items`},Kf={operations:10,schemas:20,parameters:30,responses:40,requestBodies:50,headers:60,securitySchemes:70,examples:80,links:90,callbacks:100,pathItems:110,overview:900,unlinked:1e3},qf=class extends U{constructor(...e){super(...e),this.payload=null,this.selectedSort=Uf.Severity,this.currentPage=1,this.groupPages={},this.groupSorts={},this.activePanel=`list-view`,this.itemsPerPage=20,this.sortCache=new Map,this.groupCache=null}async firstUpdated(){this.payload=await Ff()}handleSortSelect(e){let t=e.detail?.item?.value;Wf.includes(t)&&(this.selectedSort=t,this.currentPage=1)}handleGroupSortSelect(e,t){let n=t.detail?.item?.value;Wf.includes(n)&&(this.groupSorts={...this.groupSorts,[e.key]:n},this.setGroupPage(e.key,1,e.problems.length))}handleTabShow(e){let t=e.detail?.name;(t===`list-view`||t===`grouped-view`)&&(this.activePanel=t)}totalPages(e){return Math.max(1,Math.ceil(e/this.itemsPerPage))}handleFirstPage(e){e.stopPropagation(),this.currentPage=1}handlePreviousPage(e){e.stopPropagation(),this.currentPage=Math.max(1,this.currentPage-1)}handleNextPage(e){e.stopPropagation(),this.currentPage=Math.min(this.totalPages(this.payload?.problems.length||0),this.currentPage+1)}handleLastPage(e){e.stopPropagation(),this.currentPage=this.totalPages(this.payload?.problems.length||0)}groupCurrentPage(e,t){return Math.min(this.groupPages[e]||1,this.totalPages(t))}groupSort(e){return this.groupSorts[e]||Uf.Severity}setGroupPage(e,t,n){this.groupPages={...this.groupPages,[e]:Math.min(Math.max(1,t),this.totalPages(n))}}handleGroupFirstPage(e,t){t.stopPropagation(),this.setGroupPage(e.key,1,e.problems.length)}handleGroupPreviousPage(e,t){t.stopPropagation(),this.setGroupPage(e.key,this.groupCurrentPage(e.key,e.problems.length)-1,e.problems.length)}handleGroupNextPage(e,t){t.stopPropagation(),this.setGroupPage(e.key,this.groupCurrentPage(e.key,e.problems.length)+1,e.problems.length)}handleGroupLastPage(e,t){t.stopPropagation(),this.setGroupPage(e.key,this.totalPages(e.problems.length),e.problems.length)}location(e){return`${e.startLineNumber>0?e.startLineNumber:`-`}:${e.startColumn>0?e.startColumn:`-`}`}metadata(e){return this.payload?.metadata?.[e.id]||{}}problemHref(e,t=this.metadata(e)){return e.pageHref||t.pageHref||``}componentLabel(e){return Gf[e]?Gf[e]:e.replace(/([a-z0-9])([A-Z])/g,`$1 $2`).replace(/[-_]+/g,` `).replace(/\b\w/g,e=>e.toUpperCase())}groupKey(e){let t=this.metadata(e),n=e.pageKind||t.pageKind||``,r=e.pageComponent||t.pageComponent||``;return n===`operation`?{key:`operations`,title:Gf.operations,icon:`operations`,order:Kf.operations}:n===`model`&&r?{key:r,title:this.componentLabel(r),icon:r,order:Kf[r]||500}:n===`overview`?{key:`overview`,title:`API Overview`,icon:`document`,order:Kf.overview}:{key:`unlinked`,title:`Unlinked`,icon:`document`,order:Kf.unlinked}}renderTarget(e){let t=this.metadata(e),n=this.problemHref(e,t),r=e.pageTitle||t.pageTitle||``,i=e.pageKind||t.pageKind||``,a=e.pageMethod||t.pageMethod||``,o=e.pagePath||t.pagePath||``,s=e.pageOperationId||t.pageOperationId||``,c=e.pageComponent||t.pageComponent||``,l=r||n;return n?i===`operation`&&a&&(s||o)?S`
        <a class="page page-operation" href=${Ic(n)}>
          ${s?S`<span class="operation-label">${s}</span>`:S`<pp-render-operation-path path=${o} nowrap></pp-render-operation-path>`}
          <pp-http-method mode="nav-naked" method=${a}></pp-http-method>
        </a>
      `:i===`model`&&c?S`
        <a class="page page-model" href=${Ic(n)}>
          <pp-model-icon icon=${c} size="small"></pp-model-icon>
          <span>${l}</span>
        </a>
      `:S`<a class="page" href=${Ic(n)}>${l}</a>`:S`<span class="page empty-page">${l}</span>`}renderProblemMessage(e){let t=Z(e.message,{className:`message pp-markdown-inline`,inline:!0}),n=this.problemHref(e);return n?S`<a class="message-link" href=${Ic(n)}>${t}</a>`:t}renderSummaryStat(e,t,n,r,i){let a=e||0;return a<=0?C:S`
      <div class="stat ${t}">
        <sl-icon name=${n} aria-hidden="true"></sl-icon>
        <span>${a}</span>
        <small>${Al(a,r,i)}</small>
      </div>
    `}lineCompare(e,t){return e.startLineNumber-t.startLineNumber||e.startColumn-t.startColumn||e.id.localeCompare(t.id)}compareProblems(e,t,n){switch(n){case Uf.LineNumber:return this.lineCompare(e,t);case Uf.Severity:return t.severity-e.severity||this.lineCompare(e,t);default:return this.lineCompare(e,t)}}sortProblems(e,t){return[...e].sort((e,n)=>this.compareProblems(e,n,t))}memoizedSortProblems(e,t,n){let r=this.sortCache.get(e);if(r&&r.problems===t&&r.sort===n)return r.value;let i=this.sortProblems(t,n);return this.sortCache.set(e,{problems:t,sort:n,value:i}),i}groupedProblems(e){if(this.groupCache?.problems===e)return this.groupCache.value;let t=new Map;for(let n of e){let e=this.groupKey(n),r=t.get(e.key);r||(r={...e,problems:[]},t.set(e.key,r)),r.problems.push(n)}let n=[...t.values()].sort((e,t)=>e.order-t.order||e.title.localeCompare(t.title));return this.groupCache={problems:e,value:n},n}renderSortControl(e,t){return S`
      <div class="sort-filter">
        <span class="sort-label">Sort:</span>
        <sl-dropdown skidding="5" distance="5">
          <sl-button slot="trigger" caret size="small">${e}</sl-button>
          <sl-menu @sl-select=${t}>
            ${Wf.map(t=>S`
              <sl-menu-item value=${t} type="checkbox" .checked=${e===t}>
                ${t}
              </sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </div>
    `}renderProblemRow(e){return S`
      <div class="row ${jl(e.severity)}">
        <span class="severity">
          <sl-icon
            class="severity-icon"
            name=${Ml(e.severity)}
            label=${Nl(e.severity)}
          ></sl-icon>
        </span>
        <span class="location">${this.location(e)}</span>
        ${this.renderProblemMessage(e)}
        ${this.renderTarget(e)}
      </div>
    `}renderListView(e){let t=this.totalPages(e.length),n=Math.min(this.currentPage,t),r=(n-1)*this.itemsPerPage,i=e.slice(r,r+this.itemsPerPage);return S`
      <div class="list-toolbar">
        ${this.renderSortControl(this.selectedSort,this.handleSortSelect)}
      </div>
      <div class="list">
        ${e.length?S`
            <pp-paginator
              .currentPage=${n}
              .totalPages=${t}
              .totalItems=${e.length}
              .itemsPerPage=${this.itemsPerPage}
              label="Problems"
              @paginatorFirstPage=${this.handleFirstPage}
              @paginatorPreviousPage=${this.handlePreviousPage}
              @paginatorNextPage=${this.handleNextPage}
              @paginatorLastPage=${this.handleLastPage}
            ></pp-paginator>
            ${i.map(e=>this.renderProblemRow(e))}
          `:S`<div class="empty">No diagnostics found</div>`}
      </div>
    `}renderGroupedView(e){let t=this.groupedProblems(e);return S`
      <div class="grouped-list">
        ${t.length?t.map(e=>this.renderProblemGroup(e)):S`<div class="empty">No diagnostics found</div>`}
      </div>
    `}renderProblemGroup(e){let t=this.memoizedSortProblems(`group:${e.key}`,e.problems,this.groupSort(e.key)),n=this.totalPages(t.length),r=this.groupCurrentPage(e.key,t.length),i=(r-1)*this.itemsPerPage,a=t.slice(i,i+this.itemsPerPage);return S`
      <section class="problem-group">
        <div class="group-header">
          <div class="group-title">
            <pp-model-icon icon=${e.icon} size="medium"></pp-model-icon>
            <h2>${e.title}</h2>
          </div>
          <div class="group-actions">
            ${this.renderSortControl(this.groupSort(e.key),t=>this.handleGroupSortSelect(e,t))}
            <span class="group-count">${e.problems.length} ${Al(e.problems.length,`problem`)}</span>
          </div>
        </div>
        <div class="list group-problems">
          <pp-paginator
            .currentPage=${r}
            .totalPages=${n}
            .totalItems=${e.problems.length}
            .itemsPerPage=${this.itemsPerPage}
            label="Problems"
            @paginatorFirstPage=${t=>this.handleGroupFirstPage(e,t)}
            @paginatorPreviousPage=${t=>this.handleGroupPreviousPage(e,t)}
            @paginatorNextPage=${t=>this.handleGroupNextPage(e,t)}
            @paginatorLastPage=${t=>this.handleGroupLastPage(e,t)}
          ></pp-paginator>
          ${a.map(e=>this.renderProblemRow(e))}
        </div>
      </section>
    `}render(){if(!this.payload)return C;let e=this.payload.siteCounts||this.payload.counts,t=this.payload.problems||[];return S`
      <div class="summary" role="group" aria-label="Sitewide diagnostics">
        ${this.renderSummaryStat(e.errors,`err`,`exclamation-square`,`error`)}
        ${this.renderSummaryStat(e.warns,`warn`,`exclamation-triangle`,`warning`)}
        ${this.renderSummaryStat(e.infos,`info`,`info-square`,`info`,`infos`)}
        ${this.payload.orphanCount?S`<div class="stat orphan"><span>${this.payload.orphanCount}</span><small>${Al(this.payload.orphanCount,`orphan`)}</small></div>`:C}
      </div>
      <sl-tab-group class="diagnostics-tabs" @sl-tab-show=${this.handleTabShow}>
        <sl-tab slot="nav" panel="list-view">LIST VIEW</sl-tab>
        <sl-tab slot="nav" panel="grouped-view">GROUPED VIEW</sl-tab>
        <sl-tab-panel name="list-view">
          ${this.activePanel===`list-view`?this.renderListView(this.memoizedSortProblems(`list`,t,this.selectedSort)):C}
        </sl-tab-panel>
        <sl-tab-panel name="grouped-view">
          ${this.activePanel===`grouped-view`?this.renderGroupedView(t):C}
        </sl-tab-panel>
      </sl-tab-group>
    `}};K([k()],qf.prototype,`payload`,void 0),K([k()],qf.prototype,`selectedSort`,void 0),K([k()],qf.prototype,`currentPage`,void 0),K([k()],qf.prototype,`groupPages`,void 0),K([k()],qf.prototype,`groupSorts`,void 0),K([k()],qf.prototype,`activePanel`,void 0),qf=K([D(`pp-diagnostics-list`)],qf),gn(tt(`shoelace`));var Jf={...We,sun:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg>`,moon:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>`,display:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/></svg>`,"arrow-90deg-up":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708z"/></svg>`,"chevron-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>`,"chevron-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>`,"chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/></svg>`,"grip-vertical":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>`,copy:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10 1.5a1.5 1.5 0 0 1 1.5 1.5v1H13A1.5 1.5 0 0 1 14.5 5.5v8A1.5 1.5 0 0 1 13 15H6a1.5 1.5 0 0 1-1.5-1.5V12H3A1.5 1.5 0 0 1 1.5 10.5v-7A1.5 1.5 0 0 1 3 2h7zm.5 2A.5.5 0 0 0 10 3H3a.5.5 0 0 0-.5.5v7A.5.5 0 0 0 3 11h1.5V5.5A1.5 1.5 0 0 1 6 4h4.5zM6 5a.5.5 0 0 0-.5.5v8A.5.5 0 0 0 6 14h7a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 5z"/></svg>`,braces:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6"/></svg>`,envelope:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>`,"question-diamond":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/> <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/></svg>`,cookie:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/> <path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z"/></svg>`,signpost:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414a1 1 0 0 0-2 0M12.532 5l1.666 2-1.666 2H2V5z"/></svg>`,"shield-lock":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/> <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/></svg>`,"person-lock":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/></svg>`,lock:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/></svg>`,key:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5"/> <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>`,plug:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plug" viewBox="0 0 16 16"><path d="M6 0a.5.5 0 0 1 .5.5V3h3V.5a.5.5 0 0 1 1 0V3h1a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 10c-.002.434-.01.845-.04 1.22-.041.514-.126 1.003-.317 1.424a2.08 2.08 0 0 1-.97 1.028C6.725 13.9 6.169 14 5.5 14c-.998 0-1.61.33-1.974.718A1.92 1.92 0 0 0 3 16H2c0-.616.232-1.367.797-1.968C3.374 13.42 4.261 13 5.5 13c.581 0 .962-.088 1.218-.219.241-.123.4-.3.514-.55.121-.266.193-.621.23-1.09.027-.34.035-.718.037-1.141A3.5 3.5 0 0 1 4 6.5v-3a.5.5 0 0 1 .5-.5h1V.5A.5.5 0 0 1 6 0M5 4v2.5A2.5 2.5 0 0 0 7.5 9h1A2.5 2.5 0 0 0 11 6.5V4z"/></svg>`,fingerprint:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z"/> <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332q0 .613-.066 1.221A.5.5 0 0 1 6 8.447q.06-.555.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8m-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329"/> <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334m.3 1.67a.5.5 0 0 1 .449.546 10.7 10.7 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.7 9.7 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z"/> <path d="M3.902 4.222a5 5 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 4 4 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556m6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705M3.68 5.842a.5.5 0 0 1 .422.568q-.044.289-.044.59c0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.5 6.5 0 0 0 3.058 7q0-.375.054-.736a.5.5 0 0 1 .568-.422m8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.5 10.5 0 0 0 .584-2.678.5.5 0 0 1 .54-.456"/> <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865m-.89 1.257a.5.5 0 0 1 .04.706A5.48 5.48 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346m12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49"/></svg>`,"x-lg":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`,"hdd-network":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/> <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8.5v3a1.5 1.5 0 0 1 1.5 1.5h5.5a.5.5 0 0 1 0 1H10A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5H.5a.5.5 0 0 1 0-1H6A1.5 1.5 0 0 1 7.5 10V7H2a2 2 0 0 1-2-2zm1 0v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1m6 7.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5"/></svg>`,"box-arrow-up-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>`,download:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>`,box:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>`,"box-arrow-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/> <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/></svg>`,"arrow-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8"/></svg>`,"arrow-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg>`,"braces-asterisk":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C2.25 2 1.49 2.759 1.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M14.886 7.9v.164c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456v-1.3c-1.114 0-1.49-.362-1.49-1.456V4.352C14.51 2.759 13.75 2 12.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6M7.5 11.5V9.207l-1.621 1.621-.707-.707L6.792 8.5H4.5v-1h2.293L5.172 5.879l.707-.707L7.5 6.792V4.5h1v2.293l1.621-1.621.707.707L9.208 7.5H11.5v1H9.207l1.621 1.621-.707.707L8.5 9.208V11.5z"/></svg>`,"box-arrow-in-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/> <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/></svg>`,link:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/></svg>`,"telephone-outbound":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"/></svg>`,geo:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/></svg>`,"chat-left-quote":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/></svg>`,"arrow-clockwise":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>`,"arrow-counterclockwise":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/> <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308c-.12.1-.12.284 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/></svg>`,"x-diamond":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.987 16a1.53 1.53 0 0 1-1.07-.448L.45 9.082a1.53 1.53 0 0 1 0-2.165L6.917.45a1.53 1.53 0 0 1 2.166 0l6.469 6.468a1.53 1.53 0 0 1 0 2.164l-6.48 6.48a1.53 1.53 0 0 1-1.085.448M.879 8l7.108 7.108L15.096 8 7.987.879zM5.846 4.553a.5.5 0 1 0-.708.708L7.293 7.41 5.138 9.564a.5.5 0 0 0 .708.708L8 8.118l2.154 2.154a.5.5 0 0 0 .708-.708L8.708 7.41l2.154-2.149a.5.5 0 1 0-.708-.708L8 6.702z"/></svg>`,"gear-wide-connected":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/></svg>`,"chevron-double-left":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/> <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/></svg>`,"chevron-double-right":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/> <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/></svg>`,"zoom-in":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"/></svg>`,"zoom-out":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/><path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z"/><path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/></svg>`,"image-alt":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5z"/></svg>`,image:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/></svg>`,eye:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>`,"eye-slash":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>`,"arrows-fullscreen":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"/></svg>`,"filetype-svg":`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM0 14.841a1.13 1.13 0 0 0 .401.823q.194.162.478.252.285.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357a2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.187-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566a1.2 1.2 0 0 0-.5-.41a1.8 1.8 0 0 0-.78-.152q-.44 0-.776.15-.337.149-.528.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.256.193q-.167.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zm4.575 1.09h.952l1.327-3.999h-.879l-.887 3.138H5.05l-.897-3.138h-.917zm5.483-3.293q.114.228.14.492h-.776a.8.8 0 0 0-.096-.249.7.7 0 0 0-.17-.19.7.7 0 0 0-.237-.126 1 1 0 0 0-.3-.044q-.427 0-.664.302-.235.3-.235.85v.497q0 .352.097.616a.9.9 0 0 0 .305.413.87.87 0 0 0 .518.146 1 1 0 0 0 .457-.097.67.67 0 0 0 .273-.263q.09-.164.09-.364v-.254h-.823v-.59h1.576v.798q0 .29-.096.55a1.3 1.3 0 0 1-.293.457 1.4 1.4 0 0 1-.495.314q-.296.111-.698.111a2 2 0 0 1-.752-.132 1.45 1.45 0 0 1-.534-.377 1.6 1.6 0 0 1-.319-.58 2.5 2.5 0 0 1-.105-.745v-.507q0-.54.199-.949.202-.406.583-.633.383-.228.926-.228.357 0 .635.1.282.1.48.275.2.176.314.407"/></svg>`};Tn(`default`,{resolver:e=>{let t=Jf[e];return t?`data:image/svg+xml,${encodeURIComponent(t)}`:tt(`shoelace/assets/icons/${e}.svg`)}}),ls(tt(`shoelace/assets/icons`),Jf);var Yf=`pb33f-theme`,Xf=`pb33f-base-theme`,Zf=`pb33f-theme-change`,Qf=new Set([`dark`,`light`,`tektronix`]);function $f(){try{return document.referrer?new URL(document.referrer).origin:window.location.origin}catch{return window.location.origin}}function ep(e){return typeof e==`string`&&Qf.has(e)}function tp(e){try{localStorage.setItem(Yf,e),e!==`tektronix`&&localStorage.setItem(Xf,e)}catch{}document.documentElement.setAttribute(`theme`,e),e===`light`?document.documentElement.classList.remove(`sl-theme-dark`,`wa-dark`):document.documentElement.classList.add(`sl-theme-dark`,`wa-dark`),window.dispatchEvent(new CustomEvent(Zf,{detail:{theme:e}}))}window.addEventListener(`message`,e=>{if(e.source!==window.parent||e.origin!==$f())return;let t=e.data;!t||typeof t!=`object`||t.type!==`doctor:theme`||!ep(t.theme)||tp(t.theme)});function np(){Ze(),Ue()}return document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{np()},{once:!0}):np(),Object.defineProperty(e,`PpAsyncAPIAction`,{enumerable:!0,get:function(){return zl}}),Object.defineProperty(e,`PpAsyncAPIProtocol`,{enumerable:!0,get:function(){return Ul}}),Object.defineProperty(e,`PpCodeViewer`,{enumerable:!0,get:function(){return of}}),Object.defineProperty(e,`PpCrossRefs`,{enumerable:!0,get:function(){return kf}}),Object.defineProperty(e,`PpCurlCommand`,{enumerable:!0,get:function(){return Xl}}),Object.defineProperty(e,`PpDiagnosticsList`,{enumerable:!0,get:function(){return qf}}),Object.defineProperty(e,`PpExampleDrawer`,{enumerable:!0,get:function(){return Af}}),Object.defineProperty(e,`PpExampleSelector`,{enumerable:!0,get:function(){return mf}}),Object.defineProperty(e,`PpExtensions`,{enumerable:!0,get:function(){return uf}}),Object.defineProperty(e,`PpIconTitle`,{enumerable:!0,get:function(){return sf}}),Object.defineProperty(e,`PpInlineCode`,{enumerable:!0,get:function(){return vf}}),Object.defineProperty(e,`PpLayout`,{enumerable:!0,get:function(){return Cl}}),Object.defineProperty(e,`PpMediaTypeSelector`,{enumerable:!0,get:function(){return hf}}),Object.defineProperty(e,`PpModelCard`,{enumerable:!0,get:function(){return bf}}),Object.defineProperty(e,`PpModelPage`,{enumerable:!0,get:function(){return Q}}),Object.defineProperty(e,`PpNav`,{enumerable:!0,get:function(){return J}}),Object.defineProperty(e,`PpNavModelGroup`,{enumerable:!0,get:function(){return Jl}}),Object.defineProperty(e,`PpNavOperation`,{enumerable:!0,get:function(){return Yl}}),Object.defineProperty(e,`PpNavTag`,{enumerable:!0,get:function(){return Kl}}),Object.defineProperty(e,`PpOperationCallbacks`,{enumerable:!0,get:function(){return _f}}),Object.defineProperty(e,`PpOperationParameters`,{enumerable:!0,get:function(){return df}}),Object.defineProperty(e,`PpOperationResponses`,{enumerable:!0,get:function(){return gf}}),Object.defineProperty(e,`PpPageNav`,{enumerable:!0,get:function(){return Hf}}),Object.defineProperty(e,`PpProblemsDrawer`,{enumerable:!0,get:function(){return Mf}}),Object.defineProperty(e,`PpRawViewerBtn`,{enumerable:!0,get:function(){return jf}}),Object.defineProperty(e,`PpRefList`,{enumerable:!0,get:function(){return Of}}),Object.defineProperty(e,`PpRefPopover`,{enumerable:!0,get:function(){return lf}}),Object.defineProperty(e,`PpSchemaProperties`,{enumerable:!0,get:function(){return rf}}),Object.defineProperty(e,`PpSecurityScheme`,{enumerable:!0,get:function(){return zf}}),Object.defineProperty(e,`PpViolationStats`,{enumerable:!0,get:function(){return If}}),e})({});