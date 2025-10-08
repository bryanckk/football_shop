// auth.js -- supports login/register via AJAX (fetch JSON)
// Use in login.html / register.html if you replace forms with AJAX

async function ajaxLogin(formEl, onSuccess) {
  try {
    const fd = new FormData(formEl);
    const payload = {};
    fd.forEach((v,k) => payload[k]=v);
    const res = await fetch("{% url 'main:ajax_login' %}", {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    showToast('Welcome', 'You are now logged in', 'success');
    if (typeof onSuccess === 'function') onSuccess(data);
  } catch (err) {
    showToast('Login failed', err.message || 'Invalid credentials', 'error');
  }
}

async function ajaxRegister(formEl, onSuccess) {
  try {
    const fd = new FormData(formEl);
    const payload = {};
    fd.forEach((v,k) => payload[k]=v);
    const res = await fetch("{% url 'main:ajax_register' %}", {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Register failed');
    showToast('Account created', 'You can login now', 'success');
    if (typeof onSuccess === 'function') onSuccess(data);
  } catch (err) {
    showToast('Register failed', err.message || 'Error creating account', 'error');
  }
}
