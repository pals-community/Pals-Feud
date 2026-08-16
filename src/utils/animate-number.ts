const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function animateNumber(
    $el: HTMLElement,
    from: number,
    to: number,
    duration = 700
) {
    if (from === to) {
        $el.textContent = String(to);
        return;
    }

    const start = performance.now();

    function frame(now: number) {
        const t = Math.min((now - start) / duration, 1);
        const value = from + (to - from) * easeOutCubic(t);
        $el.textContent = String(Math.round(value));
        if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}
