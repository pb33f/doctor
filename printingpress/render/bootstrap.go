package render

import (
	"context"
	"fmt"
	"io"
	"strconv"

	"github.com/a-h/templ"
)

func BootstrapSharedNavCacheScript(assetBaseURL string, sharedDataBase string, sharedDataHash string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
		script := fmt.Sprintf(`(function(){
var sharedBase=%s;
var sharedHash=%s;
if(!sharedBase||!sharedHash){return;}
var navEl=document.getElementById('pp-nav');
var store=window.__PP_BOOTSTRAP__||(window.__PP_BOOTSTRAP__={});
var log=window.__PP_LOG||function(){};
log('shared-cache-bootstrap:start',{sharedBase:sharedBase});
function bagID(assetBase){
  try{
    return 'printing-press:shared:'+new URL(assetBase, document.baseURI).href;
  }catch(_){
    return 'printing-press:shared:'+assetBase;
  }
}
function escapeHtml(value){
  return String(value==null?'':value).replace(/[&<>"']/g, function(ch){
    switch(ch){
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return ch;
    }
  });
}
function isLiteralHref(href){
  return !href
    || href.charAt(0)==='/'
    || href.charAt(0)==='#'
    || href.indexOf('data:')===0
    || /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(href);
}
function currentDocBase(){
  var configuredBase=document.body&&document.body.dataset?document.body.dataset.ppBaseUrl:'';
  if(!configuredBase){
    return document.baseURI;
  }
  try{
    return new URL(configuredBase, window.location.href).toString();
  }catch(_){
    return document.baseURI;
  }
}
function docHref(href){
  if(isLiteralHref(href)){
    return href;
  }
  try{
    return new URL(href, currentDocBase()).toString();
  }catch(_){
    return href;
  }
}
function overviewHref(){
  var configuredOverview=document.body&&document.body.dataset?document.body.dataset.ppOverviewHref:'';
  return docHref(configuredOverview||'index.html');
}
function operationHref(slug){
  return docHref('operations/'+slug+'.html');
}
function modelHref(typeSlug, slug){
  return docHref('models/'+typeSlug+'/'+slug+'.html');
}
function parseJSONAttr(raw){
  if(Array.isArray(raw)){
    return raw;
  }
  if(!raw || typeof raw!=='string'){
    return [];
  }
  try{
    var parsed=JSON.parse(raw);
    return Array.isArray(parsed)?parsed:[];
  }catch(_){
    return [];
  }
}
function tagContainsSlug(tag, activeSlug){
  if(!tag || !activeSlug){
    return false;
  }
  var operations=Array.isArray(tag.operations)?tag.operations:[];
  for(var i=0;i<operations.length;i++){
    if(operations[i] && operations[i].slug===activeSlug){
      return true;
    }
  }
  var children=Array.isArray(tag.children)?tag.children:[];
  for(var j=0;j<children.length;j++){
    if(tagContainsSlug(children[j], activeSlug)){
      return true;
    }
  }
  return false;
}
function groupContainsSlug(group, activeSlug){
  if(!group || !activeSlug){
    return false;
  }
  var models=Array.isArray(group.models)?group.models:[];
  for(var i=0;i<models.length;i++){
    var model=models[i];
    if(model && (model.typeSlug+'/'+model.slug)===activeSlug){
      return true;
    }
  }
  return false;
}
function renderMethodBadge(method){
  var normalized=String(method||'').toUpperCase();
  if(!normalized){
    return '';
  }
  var abbrevMap={
    GET:'GET',
    POST:'POST',
    PUT:'PUT',
    DELETE:'DEL',
    PATCH:'PAT',
    OPTIONS:'OPT',
    HEAD:'HEAD',
    TRACE:'TRC',
    QUERY:'QRY'
  };
  var label=abbrevMap[normalized]||normalized;
  return '<span class=\'pp-nav-preview-method pp-nav-preview-method-'+escapeHtml(normalized.toLowerCase())+'\'>'+escapeHtml(label)+'</span>';
}
function renderOperationItem(op, activeSlug){
  if(!op){
    return '';
  }
  var classes=['pp-nav-preview-operation-link'];
  if(op.deprecated){
    classes.push('deprecated');
  }
  if(op.slug===activeSlug){
    classes.push('active');
  }
  return '<li><a href=\''+escapeHtml(operationHref(op.slug||''))+'\' class=\''+classes.join(' ')+'\'><span class=\'pp-nav-preview-item-title pp-nav-preview-operation-title\'>'+escapeHtml(op.summary||op.path||op.slug||'Untitled')+'</span>'+renderMethodBadge(op.method)+'</a></li>';
}
function renderTag(tag, activeSlug){
  if(!tag){
    return '';
  }
  var open=tagContainsSlug(tag, activeSlug);
  var headerClasses=['tag-header'];
  if(open){
    headerClasses.push('active');
  }
  var html='<div class=\''+headerClasses.join(' ')+'\'><span class=\'pp-nav-preview-chevron\'>'+(open?'▾':'>')+'</span><span class=\'tag-name\'>'+escapeHtml(tag.summary||tag.name||'Untitled')+'</span></div>';
  if(!open){
    return html;
  }
  html+='<div class=\'tag-body\'>';
  var operations=Array.isArray(tag.operations)?tag.operations:[];
  if(operations.length){
    html+='<ul>';
    for(var i=0;i<operations.length;i++){
      html+=renderOperationItem(operations[i], activeSlug);
    }
    html+='</ul>';
  }
  var children=Array.isArray(tag.children)?tag.children:[];
  if(children.length){
    html+='<div class=\'children\'>';
    for(var j=0;j<children.length;j++){
      html+=renderTag(children[j], activeSlug);
    }
    html+='</div>';
  }
  html+='</div>';
  return html;
}
function renderModelGroup(group, activeSlug){
  if(!group){
    return '';
  }
  var open=groupContainsSlug(group, activeSlug);
  var headerClasses=['group-header'];
  if(open){
    headerClasses.push('active');
  }
  var html='<div class=\''+headerClasses.join(' ')+'\'><span class=\'pp-nav-preview-chevron\'>'+(open?'▾':'▸')+'</span><span class=\'group-name\'>'+escapeHtml(group.name||'Untitled')+'</span></div>';
  if(!open){
    return html;
  }
  var models=Array.isArray(group.models)?group.models:[];
  if(!models.length){
    return html;
  }
  html+='<div class=\'group-body\'><ul>';
  for(var i=0;i<models.length;i++){
    var model=models[i];
    if(!model){
      continue;
    }
    var modelSlug=(model.typeSlug||'')+'/'+(model.slug||'');
    var classes=['pp-nav-preview-model-link'];
    if(modelSlug===activeSlug){
      classes.push('active');
    }
    html+='<li><a href=\''+escapeHtml(modelHref(model.typeSlug||'', model.slug||''))+'\' class=\''+classes.join(' ')+'\'><span class=\'pp-nav-preview-item-title pp-nav-preview-model-title\'>'+escapeHtml(model.name||model.slug||'Untitled')+'</span></a></li>';
  }
  html+='</ul></div>';
  return html;
}
function renderNavPreview(navAttrs, activeSlug){
  if(!navAttrs){
    return '';
  }
  var tags=parseJSONAttr(navAttrs['data-nav']);
  var modelGroups=parseJSONAttr(navAttrs['data-models']);
  var webhooks=parseJSONAttr(navAttrs['data-webhooks']);
  if(!tags.length && !modelGroups.length && !webhooks.length){
    return '';
  }
  var html='<div class=\'pp-nav-fallback pp-nav-preview\'><a class=\'nav-home'+(!activeSlug?' active':'')+'\' href=\''+escapeHtml(overviewHref())+'\'><span class=\'nav-home-chevron\'>›</span>API OVERVIEW</a>';
  if(tags.length){
    html+='<div class=\'nav-section nav-operations-section\'><h4>Operations</h4>';
    for(var i=0;i<tags.length;i++){
      html+=renderTag(tags[i], activeSlug);
    }
    html+='</div>';
  }
  if(modelGroups.length){
    html+='<div class=\'nav-section nav-models-section\'><h4>Models</h4>';
    for(var j=0;j<modelGroups.length;j++){
      html+=renderModelGroup(modelGroups[j], activeSlug);
    }
    html+='</div>';
  }
  if(webhooks.length){
    html+='<div class=\'nav-section nav-webhooks-section\'><h4>Webhooks</h4>'+renderTag({name:'Webhooks',summary:'Webhooks',children:null,operations:webhooks,isNavOnly:false}, activeSlug)+'</div>';
  }
  html+='</div>';
  return html;
}
function shouldHoldNavPreview(){
  try{
    var params=new URLSearchParams(window.location.search||'');
    var queryValue=params.get('pp-debug-nav-preview');
    if(queryValue==='1' || queryValue==='true'){
      return true;
    }
  }catch(_){}
  try{
    var stored=localStorage.getItem('pp-debug-nav-preview');
    return stored==='1' || stored==='true';
  }catch(_){
    return false;
  }
}
function deleteSaddlebagDB(){
  return new Promise(function(resolve){
    try{
      var deleteReq=indexedDB.deleteDatabase('saddlebag');
      deleteReq.onsuccess=function(){ resolve(); };
      deleteReq.onerror=function(){ resolve(); };
      deleteReq.onblocked=function(){ resolve(); };
    }catch(_){
      resolve();
    }
  });
}
function applyCachedPayload(payload){
  if(!payload){return null;}
  store.shared=payload;
  var navAttrs=payload.attributes&&payload.attributes['pp-nav'];
  if(navEl&&navAttrs){
    Object.keys(navAttrs).forEach(function(name){
      navEl.setAttribute(name, navAttrs[name]);
    });
    navEl.setAttribute('data-pp-nav-cached','true');
    var fallback=navEl.querySelector('.pp-nav-fallback');
    if(fallback){
      var preview=renderNavPreview(navAttrs, navEl.getAttribute('data-active')||'');
      if(preview){
        fallback.outerHTML=preview;
        log('nav-preview:rendered',{
          source:'shared-cache-bootstrap',
          tags: parseJSONAttr(navAttrs['data-nav']).length,
          modelGroups: parseJSONAttr(navAttrs['data-models']).length,
          webhooks: parseJSONAttr(navAttrs['data-webhooks']).length,
        });
        if(shouldHoldNavPreview()){
          navEl.setAttribute('data-pp-preview-hold','true');
          store.stopAtPreview=true;
          log('nav-preview:held',{source:'shared-cache-bootstrap'});
        }
      } else {
        log('nav-fallback:retained',{
          source:'shared-cache-bootstrap',
          tags: parseJSONAttr(navAttrs['data-nav']).length,
          modelGroups: parseJSONAttr(navAttrs['data-models']).length,
          webhooks: parseJSONAttr(navAttrs['data-webhooks']).length,
        });
      }
    }
  }
  return payload;
}
if(typeof indexedDB==='undefined'){
  log('shared-cache-bootstrap:indexeddb-unavailable');
  return;
}
store.sharedPromise=new Promise(function(resolve){
  try{
    var openReq=indexedDB.open('saddlebag',1);
    openReq.onerror=function(){ log('shared-cache-bootstrap:db-open-error'); resolve(null); };
    openReq.onupgradeneeded=function(){ log('shared-cache-bootstrap:db-upgrade'); };
    openReq.onsuccess=function(){
      var db=openReq.result;
      if(!db.objectStoreNames.contains('bags')){
        try{ db.close(); }catch(_){}
        log('shared-cache-bootstrap:missing-store-reset');
        deleteSaddlebagDB().then(function(){ resolve(null); });
        return;
      }
      try{
        var tx=db.transaction('bags', 'readonly');
        var getReq=tx.objectStore('bags').get(bagID(sharedBase));
        getReq.onerror=function(){ log('shared-cache-bootstrap:read-error'); resolve(null); };
        getReq.onsuccess=function(){
          var bag=getReq.result;
          var entry=null;
          if(bag){
            if(typeof bag.get==='function'){
              entry=bag.get('shared-payload');
            }else{
              entry=bag['shared-payload']||null;
            }
          }
          if(!entry){
            log('shared-cache-bootstrap:miss');
            resolve(null);
            return;
          }
          if(entry.hash!==sharedHash){
            try{
              db.transaction('bags', 'readwrite').objectStore('bags').delete(bagID(sharedBase));
            }catch(_){}
            log('shared-cache-bootstrap:stale',{cachedHash:entry.hash, sharedHash:sharedHash});
            resolve(null);
            return;
          }
          log('shared-cache-bootstrap:hit');
          resolve(applyCachedPayload(entry.payload||null));
        };
      }catch(_){
        log('shared-cache-bootstrap:transaction-error');
        resolve(null);
      }
    };
  }catch(_){
    log('shared-cache-bootstrap:exception');
    resolve(null);
  }
});
})();`, strconv.Quote(sharedAssetBase), strconv.Quote(sharedDataHash))
		_, err := io.WriteString(w, `<script>`+script+`</script>`)
		return err
	})
}

func BootstrapHydrationScript(assetMode string, assetBaseURL string, sharedDataBase string, pageDataBase string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
		pageAssetBase := AssetHref(assetBaseURL, pageDataBase)
		script := fmt.Sprintf(`(function(){
var assetMode=%s;
var sharedBase=%s;
var pageBase=%s;
var pageGlobal='__PP_PAGE_DATA__';
var store=window.__PP_BOOTSTRAP__||(window.__PP_BOOTSTRAP__={});
var log=window.__PP_LOG||function(){};
if(store.stopAtPreview){
  log('bootstrap-hydration:skipped',{reason:'preview-hold'});
  return;
}
log('bootstrap-hydration:start',{assetMode:assetMode,sharedBase:sharedBase,pageBase:pageBase});
function loadScriptAsset(assetBase, globalName){
  return new Promise(function(resolve,reject){
    var script=document.createElement('script');
    script.src=assetBase+'.js';
    script.async=false;
    script.onload=function(){
      script.remove();
      var payload=window[globalName]||null;
      try{delete window[globalName];}catch(_){}
      resolve(payload);
    };
    script.onerror=function(){
      script.remove();
      reject(new Error('unable to load script asset: '+assetBase+'.js'));
    };
    document.head.appendChild(script);
  });
}
function loadJSONAsset(assetBase){
  return fetch(assetBase+'.json').then(function(response){
    if(!response.ok){
      throw new Error('unable to fetch asset: '+assetBase+'.json ('+response.status+')');
    }
    return response.json();
  });
}
function loadAsset(assetBase, globalName){
  if(!assetBase){return Promise.resolve(null);}
  if(assetMode==='portable'){
    return loadScriptAsset(assetBase, globalName);
  }
  return loadJSONAsset(assetBase);
}
if(pageBase){
  log('page-payload:load:start',{pageBase:pageBase,mode:assetMode});
  store.pagePromise=loadAsset(pageBase, pageGlobal).then(function(payload){
    if(payload){
      store.page=payload;
    }
    log('page-payload:load:done',{pageBase:pageBase,hasPayload:!!payload});
    return payload;
  }).catch(function(){
    log('page-payload:load:error',{pageBase:pageBase});
    return null;
  });
}
})();`, strconv.Quote(assetMode), strconv.Quote(sharedAssetBase), strconv.Quote(pageAssetBase))
		_, err := io.WriteString(w, `<script>`+script+`</script>`)
		return err
	})
}
