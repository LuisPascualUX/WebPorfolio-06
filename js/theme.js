(() => {
    const root = document.documentElement;
    const btn  = document.getElementById('theme-toggle');
    if (!btn) return;

    const labels = {
        es: { light: 'Cambiar a modo claro', dark: 'Cambiar a modo oscuro' },
        en: { light: 'Switch to light mode', dark: 'Switch to dark mode' },
    };
    const lang = (root.getAttribute('lang') || 'es').slice(0, 2);
    const t = labels[lang] || labels.es;

    function isDark() {
        const theme = root.getAttribute('data-theme');
        if (theme) return theme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function updateLabel() {
        btn.setAttribute('aria-label', isDark() ? t.light : t.dark);
    }

    btn.addEventListener('click', () => {
        const next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateLabel();
    });

    updateLabel();
})();
