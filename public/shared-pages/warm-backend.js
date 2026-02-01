(function () {
  const base = 'https://bloodlink-backend.onrender.com';
  const key = 'backendWarmedAt';
  const now = Date.now();
  const last = Number(localStorage.getItem(key) || 0);
  if (now - last < 5 * 60 * 1000) return;
  localStorage.setItem(key, String(now));
  fetch(`${base}/`, { mode: 'no-cors' }).catch(() => {});
})();
