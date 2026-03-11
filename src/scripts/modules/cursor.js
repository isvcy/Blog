import { CONFIG } from '../config/constants.js';
import { $, on, lerp, isMobile, isTouchDevice, prefersReducedMotion } from '../utils/helpers.js';

class CursorEffect {
    constructor() {
        this.element = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.glowX = 0;
        this.glowY = 0;
        this.animationId = null;
        this.isEnabled = true;
        this.smoothing = CONFIG.cursor.smoothing;
    }

    init() {
        if (isMobile() || isTouchDevice() || prefersReducedMotion()) {
            this.isEnabled = false;
            return;
        }

        this.element = $('#cursor-glow');
        if (!this.element) return;

        this.bindEvents();
        this.start();
    }

    bindEvents() {
        on(document, 'mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        on(document, 'mouseleave', () => {
            this.element.style.opacity = '0';
        });

        on(document, 'mouseenter', () => {
            this.element.style.opacity = '1';
        });
    }

    update() {
        if (!this.isEnabled) return;

        this.glowX = lerp(this.glowX, this.mouseX, this.smoothing);
        this.glowY = lerp(this.glowY, this.mouseY, this.smoothing);

        if (this.element) {
            this.element.style.left = `${this.glowX}px`;
            this.element.style.top = `${this.glowY}px`;
        }

        this.animationId = requestAnimationFrame(() => this.update());
    }

    start() {
        if (!this.isEnabled) return;
        this.update();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stop();
        this.isEnabled = false;
    }
}

export const cursorEffect = new CursorEffect();
