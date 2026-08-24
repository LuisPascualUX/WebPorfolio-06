(() => {
    // Solo en dispositivos con ratón
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const SIZE = 18;
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px)`;
        cursor.classList.add('cursor--visible');

        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el && el.closest(INTERACTIVE)) {
            cursor.classList.add('cursor--hover');
        } else {
            cursor.classList.remove('cursor--hover');
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--visible');
    });
})();
