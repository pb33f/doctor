(function () {
  const assetMode = __PP_ASSET_MODE__;
  const sharedBase = __PP_SHARED_BASE__;
  const pageBase = __PP_PAGE_BASE__;
  const pageGlobal = '__PP_PAGE_DATA__';
  const store = window.__PP_BOOTSTRAP__ || (window.__PP_BOOTSTRAP__ = {});
  const log = window.__PP_LOG || function () {};
  const schemeHrefRE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

  if (store.stopAtPreview) {
    log('bootstrap-hydration:skipped', { reason: 'preview-hold' });
    return;
  }

  log('bootstrap-hydration:start', { assetMode, sharedBase, pageBase });

  function runtimeAssetHref(assetBase, extension) {
    const href = assetBase + extension;
    const configuredBase = document.body && document.body.dataset ? document.body.dataset.ppBaseUrl : '';
    if (!configuredBase || href.indexOf('#') === 0 || href.indexOf('data:') === 0 || schemeHrefRE.test(href)) {
      return href;
    }
    try {
      return new URL(href, new URL(configuredBase, window.location.href)).toString();
    } catch (_) {
      return href;
    }
  }

  function loadScriptAsset(assetBase, globalName) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      const href = runtimeAssetHref(assetBase, '.js');
      script.src = href;
      script.async = false;
      script.onload = function () {
        script.remove();
        const payload = window[globalName] || null;
        try {
          delete window[globalName];
        } catch (_) {}
        resolve(payload);
      };
      script.onerror = function () {
        script.remove();
        reject(new Error('unable to load script asset: ' + href));
      };
      document.head.appendChild(script);
    });
  }

  function loadJSONAsset(assetBase) {
    const href = runtimeAssetHref(assetBase, '.json');
    return fetch(href).then(function (response) {
      if (!response.ok) {
        throw new Error('unable to fetch asset: ' + href + ' (' + response.status + ')');
      }
      return response.json();
    });
  }

  function loadAsset(assetBase, globalName) {
    if (!assetBase) {
      return Promise.resolve(null);
    }
    if (assetMode === 'portable') {
      return loadScriptAsset(assetBase, globalName);
    }
    return loadJSONAsset(assetBase);
  }

  if (pageBase) {
    log('page-payload:load:start', { pageBase, mode: assetMode });
    store.pagePromise = loadAsset(pageBase, pageGlobal)
      .then(function (payload) {
        if (payload) {
          store.page = payload;
        }
        log('page-payload:load:done', { pageBase, hasPayload: !!payload });
        return payload;
      })
      .catch(function () {
        log('page-payload:load:error', { pageBase });
        return null;
      });
  }
})();
