(() => {
    // Skip on touch devices
    if ('ontouchstart' in window && window.matchMedia('(max-width: 768px)').matches) return;

    const canvas = document.getElementById('dot-grid');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const GAP = 32;
    const RADIUS = 160;
    const BASE_ALPHA = 0.18;
    const MAX_ALPHA = 0.73;
    const BASE_SIZE = 3.2;
    const MAX_SIZE = 4.8;

    const FADE_DELAY = 600;  // ms before fading out
    const FADE_DURATION = 400; // ms to fully fade out

    let mouse = { x: -9999, y: -9999 };
    let raf = null;
    let idleTimer = null;
    let fadeStart = null;
    let fading = false;
    let visible = false;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate global fade multiplier
        let fade = 1;
        if (fading) {
            fade = Math.max(0, 1 - (Date.now() - fadeStart) / FADE_DURATION);
            if (fade <= 0) {
                fading = false;
                visible = false;
                return;
            }
            raf = requestAnimationFrame(draw);
        }

        if (!visible && !fading) return;

        const cols = Math.ceil(window.innerWidth / GAP) + 1;
        const rows = Math.ceil(window.innerHeight / GAP) + 1;
        const style     = getComputedStyle(document.documentElement);
        const dotColor  = style.getPropertyValue('--dot').trim();
        const baseAlpha = parseFloat(style.getPropertyValue('--dot-base')) || BASE_ALPHA;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * GAP;
                const y = r * GAP;
                const dist = Math.hypot(x - mouse.x, y - mouse.y);
                const t = Math.max(0, 1 - dist / RADIUS);
                const ease = t * t * (3 - 2 * t); // smoothstep

                const alpha = (baseAlpha + (MAX_ALPHA - baseAlpha) * ease) * fade;
                const size = BASE_SIZE + (MAX_SIZE - BASE_SIZE) * ease;

                ctx.strokeStyle = `rgba(${dotColor}, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x - size, y);
                ctx.lineTo(x + size, y);
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y + size);
                ctx.stroke();
            }
        }
    }

    function startFade() {
        fading = true;
        fadeStart = Date.now();
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
    }

    function resetIdleTimer() {
        if (idleTimer) clearTimeout(idleTimer);
        fading = false;
        visible = true;
        idleTimer = setTimeout(startFade, FADE_DELAY);
    }

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        resetIdleTimer();
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
        if (idleTimer) clearTimeout(idleTimer);
        startFade();
    });

    window.addEventListener('resize', resize);
    resize();
})();
