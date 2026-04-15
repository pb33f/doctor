package render

import (
	"context"
	"fmt"
	"io"
	"strconv"

	"github.com/a-h/templ"
)

func BootstrapHydrationScript(assetMode string, assetBaseURL string, sharedDataBase string, pageDataBase string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) error {
		sharedAssetBase := AssetHref(assetBaseURL, sharedDataBase)
		pageAssetBase := AssetHref(assetBaseURL, pageDataBase)
		script := fmt.Sprintf(`(function(){
var assetMode=%s;
var sharedBase=%s;
var pageBase=%s;
var sharedGlobal='__PP_SHARED_DATA__';
var pageGlobal='__PP_PAGE_DATA__';
var store=window.__PP_BOOTSTRAP__||(window.__PP_BOOTSTRAP__={});
function readSharedCache(){
  if(!sharedBase){return null;}
  try{
    var raw=sessionStorage.getItem('pp:shared:'+assetMode+':'+sharedBase);
    return raw?JSON.parse(raw):null;
  }catch(_){
    return null;
  }
}
function writeSharedCache(payload){
  if(!sharedBase||!payload){return;}
  try{
    sessionStorage.setItem('pp:shared:'+assetMode+':'+sharedBase, JSON.stringify(payload));
  }catch(_){}
}
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
var sharedCached=readSharedCache();
if(sharedCached){
  store.shared=sharedCached;
}
if(sharedBase){
  store.sharedPromise=loadAsset(sharedBase, sharedGlobal).then(function(payload){
    if(payload){
      store.shared=payload;
      writeSharedCache(payload);
    }
    return payload;
  }).catch(function(){
    return sharedCached||null;
  });
}
if(pageBase){
  store.pagePromise=loadAsset(pageBase, pageGlobal).then(function(payload){
    if(payload){
      store.page=payload;
    }
    return payload;
  }).catch(function(){
    return null;
  });
}
})();`, strconv.Quote(assetMode), strconv.Quote(sharedAssetBase), strconv.Quote(pageAssetBase))
		_, err := io.WriteString(w, `<script>`+script+`</script>`)
		return err
	})
}
