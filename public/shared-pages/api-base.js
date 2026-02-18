(function () {
  const LOCAL_BASE = 'http://localhost:3000';
  const RENDER_BASE = 'https://bloodlink-backend.onrender.com';
  const isLocalHost =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '' ||
    location.protocol === 'file:';
  const stored = localStorage.getItem('apiBase');
  let apiBase = isLocalHost ? LOCAL_BASE : (stored || RENDER_BASE);
  if (isLocalHost && stored !== LOCAL_BASE) {
    localStorage.setItem('apiBase', LOCAL_BASE);
  }

  window.LIFELINK_API_BASE = apiBase;
  console.log('[API Base Init] Setting API_BASE to:', window.LIFELINK_API_BASE);
  
  window.LifeLinkApi = {
    getBase: () => window.LIFELINK_API_BASE,
    toggle: () => {
      const next = window.LIFELINK_API_BASE === LOCAL_BASE ? RENDER_BASE : LOCAL_BASE;
      localStorage.setItem('apiBase', next);
      location.reload();
    }
  };
})();
