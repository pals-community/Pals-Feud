import type { ChromaKeyHandle, ChromaKeyOptions } from "@/types";

export function createChromaKeyPainter(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    options: ChromaKeyOptions = {}
): ChromaKeyHandle {
    const { minGreen = 80, thresholdLow = 20, thresholdHigh = 70 } = options;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    let rafId: number | null = null;

    const drawFrame = () => {
        if (video.paused || video.ended) {
            rafId = null;
            return;
        }

        const w = video.videoWidth;
        const h = video.videoHeight;

        if (w === 0 || h === 0) {
            rafId = requestAnimationFrame(drawFrame);
            return;
        }

        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }

        ctx.drawImage(video, 0, 0, w, h);
        const frame = ctx.getImageData(0, 0, w, h);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (g < minGreen) continue;

            const excess = g - Math.max(r, b);
            if (excess <= thresholdLow) continue;

            if (excess >= thresholdHigh) {
                data[i + 3] = 0;
                continue;
            }

            const alpha = 1 - (excess - thresholdLow) / (thresholdHigh - thresholdLow);
            data[i + 3] = Math.round(alpha * 255);

            const desaturated = Math.max(r, b);
            data[i + 1] = Math.min(g, desaturated + (g - desaturated) * alpha);
        }

        ctx.putImageData(frame, 0, 0);
        rafId = requestAnimationFrame(drawFrame);
    };

    return {
        start() {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(drawFrame);
        },
        stop() {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
    };
}
