(function () {
  const LOCAL_BASE = 'http://localhost:3000';
  const RENDER_BASE = 'https://bloodlink-backend.onrender.com';
  const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const stored = localStorage.getItem('apiBase');
  const apiBase = stored || (isLocalHost ? LOCAL_BASE : RENDER_BASE);

  window.LIFELINK_API_BASE = apiBase;
  window.LifeLinkApi = {
    getBase: () => apiBase,
    toggle: () => {
      const next = apiBase === LOCAL_BASE ? RENDER_BASE : LOCAL_BASE;
      localStorage.setItem('apiBase', next);
      location.reload();
    }
  };
})();
