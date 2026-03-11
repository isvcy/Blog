import { CONFIG, COLORS } from '../config/constants.js';
import { $, isMobile, randomRange, randomInt, randomColor, distance, clamp } from '../utils/helpers.js';

class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.reset();
    }

    reset() {
        this.x = randomRange(0, this.canvas.width);
        this.y = randomRange(0, this.canvas.height);
        this.vx = randomRange(-this.config.maxSpeed, this.config.maxSpeed);
        this.vy = randomRange(-this.config.maxSpeed, this.config.maxSpeed);
        this.radius = randomRange(this.config.minRadius, this.config.maxRadius);
        this.color = randomColor(this.config.colors);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        this.x = clamp(this.x, 0, this.canvas.width);
        this.y = clamp(this.y, 0, this.canvas.height);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        this.config = CONFIG.particles;
    }

    init() {
        this.canvas = $('#particles');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.start();

        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = isMobile() ? this.config.countMobile : this.config.countDesktop;
        this.particles = Array.from(
            { length: count },
            () => new Particle(this.canvas, this.config)
        );
    }

    handleResize() {
        this.resize();
        this.createParticles();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else {
            this.start();
        }
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dist = distance(p1.x, p1.y, p2.x, p2.y);

                if (dist < this.config.connectionDistance) {
                    const opacity = 1 - dist / this.config.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 107, 157, ${opacity * 0.25})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.handleResize.bind(this));
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
}

export const particleSystem = new ParticleSystem();
