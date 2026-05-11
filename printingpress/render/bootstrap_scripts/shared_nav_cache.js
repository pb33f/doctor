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

  function bagID(assetBase) {
    try {
      return 'printing-press:shared:' + new URL(assetBase, document.baseURI).href;
    } catch (_) {
      return 'printing-press:shared:' + assetBase;
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      switch (ch) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        default:
          return ch;
      }
    });
  }

  function isLiteralHref(href) {
    return (
      !href ||
      href.charAt(0) === '/' ||
      href.charAt(0) === '#' ||
      href.indexOf('data:') === 0 ||
      /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(href)
    );
  }

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

  function docHref(href) {
    if (isLiteralHref(href)) {
      return href;
    }
    try {
      return new URL(href, currentDocBase()).toString();
    } catch (_) {
      return href;
    }
  }

  function overviewHref() {
    const configuredOverview = document.body && document.body.dataset ? document.body.dataset.ppOverviewHref : '';
    return docHref(configuredOverview || 'index.html');
  }

  function developerMode() {
    return document.body && document.body.dataset && document.body.dataset.ppDeveloperMode === 'true';
  }

  function operationHref(slug) {
    return docHref('operations/' + slug + '.html');
  }

  function modelHref(typeSlug, slug) {
    return docHref('models/' + typeSlug + '/' + slug + '.html');
  }

  function parseJSONAttr(raw) {
    if (Array.isArray(raw)) {
      return raw;
    }
    if (!raw || typeof raw !== 'string') {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function tagContainsSlug(tag, activeSlug) {
    if (!tag || !activeSlug) {
      return false;
    }
    const operations = Array.isArray(tag.operations) ? tag.operations : [];
    for (let i = 0; i < operations.length; i++) {
      if (operations[i] && operations[i].slug === activeSlug) {
        return true;
      }
    }
    const children = Array.isArray(tag.children) ? tag.children : [];
    for (let i = 0; i < children.length; i++) {
      if (tagContainsSlug(children[i], activeSlug)) {
        return true;
      }
    }
    return false;
  }

  function groupContainsSlug(group, activeSlug) {
    if (!group || !activeSlug) {
      return false;
    }
    const models = Array.isArray(group.models) ? group.models : [];
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      if (model && model.typeSlug + '/' + model.slug === activeSlug) {
        return true;
      }
    }
    return false;
  }

  function renderMethodBadge(method) {
    const normalized = String(method || '').toUpperCase();
    if (!normalized) {
      return '';
    }
    const abbrevMap = {
      GET: 'GET',
      POST: 'POST',
      PUT: 'PUT',
      DELETE: 'DEL',
      PATCH: 'PAT',
      OPTIONS: 'OPT',
      HEAD: 'HEAD',
      TRACE: 'TRC',
      QUERY: 'QRY',
    };
    const label = abbrevMap[normalized] || normalized;
    return (
      "<span class='pp-nav-preview-method pp-nav-preview-method-" +
      escapeHtml(normalized.toLowerCase()) +
      "'>" +
      escapeHtml(label) +
      '</span>'
    );
  }

  function renderOperationItem(op, activeSlug) {
    if (!op) {
      return '';
    }
    const classes = ['pp-nav-preview-operation-link'];
    if (op.deprecated) {
      classes.push('deprecated');
    }
    if (op.slug === activeSlug) {
      classes.push('active');
    }
    return (
      "<li><a href='" +
      escapeHtml(operationHref(op.slug || '')) +
      "' class='" +
      classes.join(' ') +
      "'><span class='pp-nav-preview-item-title pp-nav-preview-operation-title'>" +
      escapeHtml(op.summary || op.path || op.slug || 'Untitled') +
      '</span>' +
      renderMethodBadge(op.method) +
      '</a></li>'
    );
  }

  function renderTag(tag, activeSlug) {
    if (!tag) {
      return '';
    }
    const open = tagContainsSlug(tag, activeSlug);
    const headerClasses = ['tag-header'];
    if (open) {
      headerClasses.push('active');
    }
    let html =
      "<div class='" +
      headerClasses.join(' ') +
      "'><span class='pp-nav-preview-chevron'>" +
      (open ? '▾' : '>') +
      "</span><span class='tag-name'>" +
      escapeHtml(tag.summary || tag.name || 'Untitled') +
      '</span></div>';
    if (!open) {
      return html;
    }
    html += "<div class='tag-body'>";
    const operations = Array.isArray(tag.operations) ? tag.operations : [];
    if (operations.length) {
      html += '<ul>';
      for (let i = 0; i < operations.length; i++) {
        html += renderOperationItem(operations[i], activeSlug);
      }
      html += '</ul>';
    }
    const children = Array.isArray(tag.children) ? tag.children : [];
    if (children.length) {
      html += "<div class='children'>";
      for (let i = 0; i < children.length; i++) {
        html += renderTag(children[i], activeSlug);
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderModelGroup(group, activeSlug) {
    if (!group) {
      return '';
    }
    const open = groupContainsSlug(group, activeSlug);
    const headerClasses = ['group-header'];
    if (open) {
      headerClasses.push('active');
    }
    let html =
      "<div class='" +
      headerClasses.join(' ') +
      "'><span class='pp-nav-preview-chevron'>" +
      (open ? '▾' : '▸') +
      "</span><span class='group-name'>" +
      escapeHtml(group.name || 'Untitled') +
      '</span></div>';
    if (!open) {
      return html;
    }
    const models = Array.isArray(group.models) ? group.models : [];
    if (!models.length) {
      return html;
    }
    html += "<div class='group-body'><ul>";
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      if (!model) {
        continue;
      }
      const modelSlug = (model.typeSlug || '') + '/' + (model.slug || '');
      const classes = ['pp-nav-preview-model-link'];
      if (modelSlug === activeSlug) {
        classes.push('active');
      }
      html +=
        "<li><a href='" +
        escapeHtml(modelHref(model.typeSlug || '', model.slug || '')) +
        "' class='" +
        classes.join(' ') +
        "'><span class='pp-nav-preview-item-title pp-nav-preview-model-title'>" +
        escapeHtml(model.name || model.slug || 'Untitled') +
        '</span></a></li>';
    }
    html += '</ul></div>';
    return html;
  }

  function renderNavPreview(navAttrs, activeSlug) {
    if (!navAttrs) {
      return '';
    }
    const tags = parseJSONAttr(navAttrs['data-nav']);
    const modelGroups = parseJSONAttr(navAttrs['data-models']);
    const webhooks = parseJSONAttr(navAttrs['data-webhooks']);
    if (!tags.length && !modelGroups.length && !webhooks.length) {
      return '';
    }
    let html =
      "<div class='pp-nav-fallback pp-nav-preview'><a class='nav-home" +
      (!activeSlug ? ' active' : '') +
      "' href='" +
      escapeHtml(overviewHref()) +
      "'><span class='nav-home-chevron'>›</span>API OVERVIEW</a>";
    if (developerMode()) {
      html +=
        "<a class='nav-home diagnostics" +
        (activeSlug === 'diagnostics' ? ' active' : '') +
        "' href='" +
        escapeHtml(docHref('diagnostics.html')) +
        "'><span class='nav-home-chevron'>›</span>DIAGNOSTICS</a>";
    }
    if (tags.length) {
      html += "<div class='nav-section nav-operations-section'><h4>Operations</h4>";
      for (let i = 0; i < tags.length; i++) {
        html += renderTag(tags[i], activeSlug);
      }
      html += '</div>';
    }
    if (modelGroups.length) {
      html += "<div class='nav-section nav-models-section'><h4>Models</h4>";
      for (let i = 0; i < modelGroups.length; i++) {
        html += renderModelGroup(modelGroups[i], activeSlug);
      }
      html += '</div>';
    }
    if (webhooks.length) {
      html +=
        "<div class='nav-section nav-webhooks-section'><h4>Webhooks</h4>" +
        renderTag({ name: 'Webhooks', summary: 'Webhooks', children: null, operations: webhooks, isNavOnly: false }, activeSlug) +
        '</div>';
    }
    html += '</div>';
    return html;
  }

  function shouldHoldNavPreview() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const queryValue = params.get('pp-debug-nav-preview');
      if (queryValue === '1' || queryValue === 'true') {
        return true;
      }
    } catch (_) {}
    try {
      const stored = localStorage.getItem('pp-debug-nav-preview');
      return stored === '1' || stored === 'true';
    } catch (_) {
      return false;
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
      const fallback = navEl.querySelector('.pp-nav-fallback');
      if (fallback) {
        const preview = renderNavPreview(navAttrs, navEl.getAttribute('data-active') || '');
        if (preview) {
          fallback.outerHTML = preview;
          log('nav-preview:rendered', {
            source: 'shared-cache-bootstrap',
            tags: parseJSONAttr(navAttrs['data-nav']).length,
            modelGroups: parseJSONAttr(navAttrs['data-models']).length,
            webhooks: parseJSONAttr(navAttrs['data-webhooks']).length,
          });
          if (shouldHoldNavPreview()) {
            navEl.setAttribute('data-pp-preview-hold', 'true');
            store.stopAtPreview = true;
            log('nav-preview:held', { source: 'shared-cache-bootstrap' });
          }
        } else {
          log('nav-fallback:retained', {
            source: 'shared-cache-bootstrap',
            tags: parseJSONAttr(navAttrs['data-nav']).length,
            modelGroups: parseJSONAttr(navAttrs['data-models']).length,
            webhooks: parseJSONAttr(navAttrs['data-webhooks']).length,
          });
        }
      }
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
