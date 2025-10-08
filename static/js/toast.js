// toast.js
// Reusable toast system — call showToast(title, message, type='info', duration=3000)

(function () {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.warn('Toast container not found (expected #toast-container).');
  }

  // helper to create icon HTML (simple)
  function iconForType(type) {
    if (type === 'success') return '✅';
    if (type === 'error') return '⛔';
    return '🔔';
  }

  // Create one toast element and return control object
  function createToastEl(title, message, type) {
    const toast = document.createElement('div');
    // allow pointer events for interactions (pause on hover)
    toast.className = 'pointer-events-auto w-80 max-w-[90vw] bg-white border p-3 rounded-lg shadow-lg transform transition-all duration-200 ease-out flex items-start gap-3 opacity-0 translate-y-4';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'text-xl flex-none';
    iconWrapper.textContent = iconForType(type);

    const body = document.createElement('div');
    body.className = 'flex-1 min-w-0';

    const ttl = document.createElement('div');
    ttl.className = 'font-semibold text-sm text-gray-900';
    ttl.textContent = title || (type === 'success' ? 'Success' : (type === 'error' ? 'Error' : 'Info'));

    const msg = document.createElement('div');
    msg.className = 'text-sm text-gray-600 mt-1 break-words';
    msg.textContent = message || '';

    body.appendChild(ttl);
    body.appendChild(msg);

    // close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-2 text-gray-400 hover:text-gray-600 text-sm flex-none';
    closeBtn.setAttribute('aria-label', 'Close toast');
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    toast.appendChild(iconWrapper);
    toast.appendChild(body);
    toast.appendChild(closeBtn);

    return toast;
  }

  // Remove with animation
  function removeToast(toast) {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 220);
  }

  // Pause timer helper: returns {start, pause, resume, clear}
  function timerController(duration, onExpire) {
    let start = Date.now();
    let remaining = duration;
    let timeoutId = null;
    function startTimer() { timeoutId = setTimeout(onExpire, remaining); start = Date.now(); }
    function pause() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        remaining = remaining - (Date.now() - start);
        timeoutId = null;
      }
    }
    function resume() {
      if (!timeoutId) {
        start = Date.now();
        timeoutId = setTimeout(onExpire, remaining);
      }
    }
    function clear() {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
    }
    startTimer();
    return { pause, resume, clear };
  }

  // Public function to show toast
  window.showToast = function (title, message, type = 'info', duration = 3000) {
    if (!container) return;
    // create element
    const toastEl = createToastEl(title, message, type);

    // append to container (stack newest on top)
    container.insertBefore(toastEl, container.firstChild);

    // small entrance animation
    requestAnimationFrame(() => {
      toastEl.classList.remove('opacity-0', 'translate-y-4');
      toastEl.classList.add('opacity-100', 'translate-y-0');
    });

    // timer to auto-dismiss
    const controller = timerController(duration, () => removeToast(toastEl));

    // pause on hover
    toastEl.addEventListener('mouseenter', () => controller.pause());
    toastEl.addEventListener('mouseleave', () => controller.resume());

    // return function to programmatically dismiss
    return () => {
      controller.clear();
      removeToast(toastEl);
    };
  };

  // Extra helper: clear all toasts
  window.clearAllToasts = function () {
    if (!container) return;
    Array.from(container.children).forEach(child => {
      // animate out
      child.classList.remove('opacity-100','translate-y-0');
      child.classList.add('opacity-0','translate-y-4');
      setTimeout(() => { if (child.parentNode) child.parentNode.removeChild(child); }, 220);
    });
  };
})();
