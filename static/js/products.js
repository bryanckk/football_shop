// static/js/products.js (FINAL)
// Replace whole file with this. Exposes window.openCreate and window.openEdit
(function () {
  // small helpers
  function log(...args){ if(window.console) console.log('[products.js]', ...args); }
  function getCSRF(){ const name='csrftoken'; return document.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith(name+'='))?.split('=')[1] ? decodeURIComponent(document.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith(name+'='))?.split('=')[1]) : ''; }
  function show(el){ if(el) el.classList.remove('hidden'); }
  function hide(el){ if(el) el.classList.add('hidden'); }
  async function parseJsonSafe(res){
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    const t = await res.text();
    throw new Error('Non-JSON response: ' + t.slice(0,500));
  }

  // DOM refs
  const refs = {
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('errorMessage'),
    empty: document.getElementById('empty'),
    grid: document.getElementById('grid'),
    btnRefresh: document.getElementById('btnRefresh'),
    btnCreate: document.getElementById('btnCreate'),
    productForm: document.getElementById('productForm'),
    btnSubmitProduct: document.getElementById('btnSubmitProduct'),
    productModal: document.getElementById('productModal'),
    productDeleteModal: document.getElementById('productDeleteModal'),
    btnConfirmDelete: document.getElementById('btnConfirmDelete'),
    productIdInput: document.getElementById('productId'),
    emptyCreate: document.getElementById('emptyCreate')
  };

  function showLoading(){ show(refs.loading); hide(refs.error); hide(refs.empty); hide(refs.grid); }
  function showGrid(){ hide(refs.loading); hide(refs.error); hide(refs.empty); show(refs.grid); }
  function showEmpty(){ hide(refs.loading); hide(refs.error); show(refs.empty); hide(refs.grid); }
  function showError(msg){ hide(refs.loading); show(refs.error); hide(refs.empty); hide(refs.grid); if(refs.errorMessage) refs.errorMessage.textContent = msg || 'Failed to load'; }

  // Normalize product object (accepts Django-serializer or custom JSON)
  function normalizeItems(data){
    if (!Array.isArray(data)) return [];
    if (data.length > 0 && data[0].fields !== undefined) {
      return data.map(x => ({ id: x.pk, ...x.fields }));
    }
    return data;
  }

  // Render
  function renderProducts(items){
    refs.grid.innerHTML = '';
    refs.grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    items.forEach(it => {
      const isOwner = String(it.user_id ?? it.user ?? '') === String(CURRENT_USER_ID ?? '');
      const thumbHtml = it.thumbnail ? `<img src="${DOMPurify.sanitize(it.thumbnail)}" alt="${DOMPurify.sanitize(it.name)}" class="w-full h-40 object-cover">` : `<div class="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>`;
      const featured = it.is_featured ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Featured</span>` : '';
      const article = document.createElement('article');
      article.className = 'bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full';
      article.innerHTML = `
        <div class="relative">${thumbHtml}</div>
        <div class="p-4 flex flex-col flex-1">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold">${DOMPurify.sanitize(it.name ?? '')}</h3>
            <div class="text-sm text-gray-500">${it.price ?? ''} IDR</div>
          </div>
          <p class="text-gray-600 text-sm flex-1 mb-4">${DOMPurify.sanitize(it.description ?? '')}</p>
          <div class="flex items-center justify-between pt-3">
            <div class="text-xs text-gray-500">Stock: ${it.stock ?? 0}</div>
            <div>${featured}</div>
          </div>
          <div class="mt-3 flex items-center justify-between gap-2">
            <a href="/product/${it.id}/" class="text-green-600 hover:underline text-sm">View</a>
            <div class="ml-auto flex items-center gap-2">
              ${ isOwner ? `<button class="btn-edit text-sm px-3 py-1 border rounded" data-id="${it.id}">Edit</button>` : '' }
              ${ isOwner ? `<button class="btn-delete text-sm px-3 py-1 border rounded text-red-600" data-id="${it.id}">Delete</button>` : '' }
            </div>
          </div>
        </div>
      `;
      refs.grid.appendChild(article);
    });
  }

  // Fetch products
  async function fetchProducts(){
    showLoading();
    if (typeof PRODUCTS_LIST_ENDPOINT === 'undefined') {
      showError('PRODUCTS_LIST_ENDPOINT not configured');
      log('PRODUCTS_LIST_ENDPOINT undefined');
      return;
    }
    try {
      const res = await fetch(PRODUCTS_LIST_ENDPOINT, { method: 'GET', credentials: 'same-origin', headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        // try parse body for detail
        try {
          const body = await parseJsonSafe(res);
          throw new Error(body.detail || JSON.stringify(body));
        } catch (e) {
          throw new Error(`Failed to fetch products (HTTP ${res.status})`);
        }
      }
      const data = await parseJsonSafe(res);
      let items = normalizeItems(data);
      if (!items.length) { showEmpty(); return; }
      // sort featured first then newest id
      items.sort((a,b) => (b.is_featured?1:0) - (a.is_featured?1:0) || ((b.id||0)-(a.id||0)));
      renderProducts(items);
      showGrid();
    } catch (err) {
      log('fetchProducts error', err);
      showError('Failed to load products. Check console.');
      if (window.showToast) showToast('Failed to load products','', 'error');
    }
  }

  // Expose global openCreate / openEdit so template or other code can call them
  window.openCreate = function () {
    if (refs.productForm) refs.productForm.reset();
    if (refs.productIdInput) refs.productIdInput.value = '';
    const titleEl = document.getElementById('productModalTitle'); if (titleEl) titleEl.textContent = 'Create Product';
    if (typeof showProductModal === 'function') showProductModal(); else if (refs.productModal) refs.productModal.classList.remove('hidden');
  };

  window.openEdit = async function (idOrObject) {
    const id = (typeof idOrObject === 'string' || typeof idOrObject === 'number') ? idOrObject : (idOrObject?.id ?? null);
    let data = null;
    if (typeof id !== 'undefined' && id !== null) {
      // try show_json_by_id endpoint if available
      const maybeDetail = (typeof PRODUCTS_LIST_ENDPOINT === 'string' && PRODUCTS_LIST_ENDPOINT.endsWith('/json/')) ? PRODUCTS_LIST_ENDPOINT.replace(/\/json\/?$/, `/json/${id}/`) : null;
      if (maybeDetail) {
        try {
          const res = await fetch(maybeDetail, { credentials: 'same-origin', headers: { 'Accept': 'application/json' }});
          if (res.ok) {
            const d = await parseJsonSafe(res);
            // if django serializer array
            if (Array.isArray(d) && d.length > 0 && d[0].fields) data = { id: d[0].pk, ...d[0].fields };
            else if (typeof d === 'object') data = d;
          }
        } catch (e) { log('detail fetch failed', e); }
      }
    } else if (typeof idOrObject === 'object') {
      data = idOrObject;
    }

    // fill form
    if (refs.productForm && data) {
      if (refs.productIdInput) refs.productIdInput.value = data.id ?? data.pk ?? '';
      const map = [['p_name','name'],['p_price','price'],['p_stock','stock'],['p_category','category'],['p_thumbnail','thumbnail'],['p_description','description']];
      map.forEach(([el,key]) => { const node = document.getElementById(el); if (node) node.value = data[key] ?? ''; });
      const feat = document.getElementById('p_featured'); if (feat) feat.checked = !!(data.is_featured ?? false);
    }
    const titleEl = document.getElementById('productModalTitle'); if (titleEl) titleEl.textContent = 'Edit Product';
    if (typeof showProductModal === 'function') showProductModal(); else if (refs.productModal) refs.productModal.classList.remove('hidden');
  };

  // Event delegation for edit/delete/create/refresh
  document.addEventListener('click', (ev) => {
    const t = ev.target;
    if (!t) return;
    if (t.matches('#btnCreate')) { ev.preventDefault(); return window.openCreate(); }
    if (t.matches('#emptyCreate')) { ev.preventDefault(); return window.openCreate(); }
    if (t.matches('#btnRefresh')) { ev.preventDefault(); return fetchProducts(); }
    if (t.matches('.btn-edit')) { ev.preventDefault(); const id = t.dataset.id; return window.openEdit(id); }
    if (t.matches('.btn-delete')) {
      ev.preventDefault();
      const id = t.dataset.id;
      if (!id) return;
      if (refs.btnConfirmDelete) refs.btnConfirmDelete.dataset.id = id;
      if (typeof showDeleteModal === 'function') showDeleteModal(); else if (refs.productDeleteModal) refs.productDeleteModal.classList.remove('hidden');
    }
  });

  // Delete confirm handler
  if (refs.btnConfirmDelete) {
    refs.btnConfirmDelete.addEventListener('click', async function () {
      const id = this.dataset.id;
      if (!id) return;
      try {
        const url = (PRODUCTS_DELETE_BASE || '').replace('00000000-0000-0000-0000-000000000000', id);
        if (!url) throw new Error('Delete endpoint not configured');
        const res = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRFToken': getCSRF() , 'Accept': 'application/json' } });
        if (!res.ok) {
          try { const b = await parseJsonSafe(res); throw new Error(b.detail || JSON.stringify(b)); } catch(e){ throw new Error('Delete failed (HTTP '+res.status+')'); }
        }
        if (typeof hideDeleteModal === 'function') hideDeleteModal(); else if (refs.productDeleteModal) refs.productDeleteModal.classList.add('hidden');
        if (window.showToast) showToast('Product deleted','', 'success');
        fetchProducts();
      } catch (err) {
        log('delete error', err);
        if (window.showToast) showToast('Delete failed','', 'error');
      }
    });
  }

  // Submit create/update
  if (refs.btnSubmitProduct) {
    refs.btnSubmitProduct.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!refs.productForm) { log('productForm not found'); return; }
      try {
        const id = refs.productIdInput?.value || null;
        let url = PRODUCTS_CREATE_ENDPOINT;
        if (id) url = (PRODUCTS_UPDATE_BASE || '').replace('00000000-0000-0000-0000-000000000000', id);
        const fd = new FormData(refs.productForm);
        const feat = document.getElementById('p_featured');
        if (feat && feat.checked) fd.set('is_featured','on'); else fd.delete('is_featured');
        const res = await fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRFToken': getCSRF() }, body: fd });
        if (!res.ok) {
          try { const b = await parseJsonSafe(res); throw new Error(b.detail || JSON.stringify(b)); } catch(e){ throw new Error('Save failed (HTTP '+res.status+')'); }
        }
        if (typeof hideProductModal === 'function') hideProductModal(); else if (refs.productModal) refs.productModal.classList.add('hidden');
        if (window.showToast) showToast(id ? 'Product updated' : 'Product created','', 'success');
        fetchProducts();
      } catch (err) {
        log('save error', err);
        if (window.showToast) showToast('Save failed','', 'error');
      }
    });
  }

  // init: call fetch after load + tiny delay to avoid race
  window.addEventListener('load', function () { setTimeout(fetchProducts, 250); });

  // expose fetchProducts to console for debugging
  window.fetchProducts = fetchProducts;
  log('products.js initialized');
})();
