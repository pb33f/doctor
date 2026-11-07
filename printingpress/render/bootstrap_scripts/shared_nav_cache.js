(function () {
  const sharedBase = __PP_SHARED_BASE__;
  const sharedHash = __PP_SHARED_HASH__;
  if (!sharedBase || !sharedHash) {
    return;
  }

  const navEl = document.getElementById('pp-nav');
  const store = window.__PP_BOOTSTRAP__ || (window.__PP_BOOTSTRAP__ = {});
  const log = window.__PP_LOG || function () {};

  log('shared-cache-bootstrap:start', { sharedBase });

  function currentDocBase() {
    const configuredBase = document.body && document.body.dataset ? document.body.dataset.ppBaseUrl : '';
    if (!configuredBase) {
      return document.baseURI;
    }
    try {
      return new URL(configuredBase, window.location.href).toString();
    } catch (_) {
      return document.baseURI;
    }
  }

  function bagID(assetBase) {
    try {
      return 'printing-press:shared:' + new URL(assetBase, currentDocBase()).href;
    } catch (_) {
      return 'printing-press:shared:' + assetBase;
    }
  }

  function deleteSaddlebagDB() {
    return new Promise(function (resolve) {
      try {
        const deleteReq = indexedDB.deleteDatabase('saddlebag');
        deleteReq.onsuccess = function () {
          resolve();
        };
        deleteReq.onerror = function () {
          resolve();
        };
        deleteReq.onblocked = function () {
          resolve();
        };
      } catch (_) {
        resolve();
      }
    });
  }

  function applyCachedPayload(payload) {
    if (!payload) {
      return null;
    }
    store.shared = payload;
    const navAttrs = payload.attributes && payload.attributes['pp-nav'];
    if (navEl && navAttrs) {
      Object.keys(navAttrs).forEach(function (name) {
        navEl.setAttribute(name, navAttrs[name]);
      });
      navEl.setAttribute('data-pp-nav-cached', 'true');
    }
    return payload;
  }

  if (typeof indexedDB === 'undefined') {
    log('shared-cache-bootstrap:indexeddb-unavailable');
    return;
  }

  store.sharedPromise = new Promise(function (resolve) {
    try {
      const openReq = indexedDB.open('saddlebag', 1);
      openReq.onerror = function () {
        log('shared-cache-bootstrap:db-open-error');
        resolve(null);
      };
      openReq.onupgradeneeded = function () {
        log('shared-cache-bootstrap:db-upgrade');
      };
      openReq.onsuccess = function () {
        const db = openReq.result;
        if (!db.objectStoreNames.contains('bags')) {
          try {
            db.close();
          } catch (_) {}
          log('shared-cache-bootstrap:missing-store-reset');
          deleteSaddlebagDB().then(function () {
            resolve(null);
          });
          return;
        }
        try {
          const tx = db.transaction('bags', 'readonly');
          const getReq = tx.objectStore('bags').get(bagID(sharedBase));
          getReq.onerror = function () {
            log('shared-cache-bootstrap:read-error');
            resolve(null);
          };
          getReq.onsuccess = function () {
            const bag = getReq.result;
            let entry = null;
            if (bag) {
              if (typeof bag.get === 'function') {
                entry = bag.get('shared-payload');
              } else {
                entry = bag['shared-payload'] || null;
              }
            }
            if (!entry) {
              log('shared-cache-bootstrap:miss');
              resolve(null);
              return;
            }
            if (entry.hash !== sharedHash) {
              try {
                db.transaction('bags', 'readwrite').objectStore('bags').delete(bagID(sharedBase));
              } catch (_) {}
              log('shared-cache-bootstrap:stale', { cachedHash: entry.hash, sharedHash });
              resolve(null);
              return;
            }
            log('shared-cache-bootstrap:hit');
            resolve(applyCachedPayload(entry.payload || null));
          };
        } catch (_) {
          log('shared-cache-bootstrap:transaction-error');
          resolve(null);
        }
      };
    } catch (_) {
      log('shared-cache-bootstrap:exception');
      resolve(null);
    }
  });
})();
