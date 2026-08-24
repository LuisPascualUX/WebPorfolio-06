(() => {
    const root = document.documentElement;
    const btn  = document.getElementById('theme-toggle');
    if (!btn) return;

    function isDark() {
        const t = root.getAttribute('data-theme');
        if (t) return t === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateLabel() {
        btn.setAttribute('aria-label', isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }

    btn.addEventListener('click', () => {
        const next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateLabel();
    });

    updateLabel();
})();
