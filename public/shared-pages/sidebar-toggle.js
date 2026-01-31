(function () {
  const layout = document.querySelector('.layout') || document.body;
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const existing = sidebar.querySelector('.toggle-btn');
  if (!existing) {
    const logo = sidebar.querySelector('.logo, .sidebar-logo');
    const header = document.createElement('div');
    header.className = 'sidebar-header';

    if (logo) {
      header.appendChild(logo);
    }

    const btn = document.createElement('button');
    btn.className = 'toggle-btn';
    btn.type = 'button';
    btn.title = 'Toggle sidebar';
    btn.textContent = '☰';

    btn.addEventListener('click', () => {
      layout.classList.toggle('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', layout.classList.contains('sidebar-collapsed'));
    });

    header.appendChild(btn);
    sidebar.insertBefore(header, sidebar.firstChild);
  }

  if (localStorage.getItem('sidebarCollapsed') === 'true') {
    layout.classList.add('sidebar-collapsed');
  }
})();
