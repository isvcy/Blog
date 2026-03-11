const CONFIG = {
    particles: {
        countMobile: 40,
        countDesktop: 80,
        connectionDistance: 150,
        maxSpeed: 0.5,
        minRadius: 1,
        maxRadius: 3,
        colors: ['#ff6b9d', '#c084fc', '#34d399', '#fcd34d', '#60a5fa']
    },
    cursor: {
        smoothing: 0.1,
        size: 300
    },
    animations: {
        duration: 500,
        stagger: 100,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    theme: {
        storageKey: 'theme',
        defaultTheme: 'dark'
    },
    welcome: {
        storageKey: 'hasVisitedWelcome',
        redirectUrl: 'welcome.html'
    },
    counter: {
        duration: 2000,
        easing: 'easeOutExpo'
    },
    lazyLoad: {
        threshold: 0.1,
        rootMargin: '50px'
    }
};

const Utils = {
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    $$(selector, context = document) {
        return [...context.querySelectorAll(selector)];
    },

    on(element, event, handler, options = {}) {
        if (!element) return () => {};
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    },

    delegate(container, selector, event, handler) {
        if (!container) return () => {};
        const listener = (e) => {
            const target = e.target.closest(selector);
            if (target && container.contains(target)) {
                handler.call(target, e, target);
            }
        };
        container.addEventListener(event, listener);
        return () => container.removeEventListener(event, listener);
    },

    isMobile() {
        return window.innerWidth < 768;
    },

    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomInt(min, max) {
        return Math.floor(this.randomRange(min, max + 1));
    },

    randomColor(colors) {
        return colors[this.randomInt(0, colors.length - 1)];
    },

    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    throttle(fn, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    formatTime(date = new Date()) {
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    },

    storageGet(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    storageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },

    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        return element;
    }
};

class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.reset();
    }

    reset() {
        this.x = Utils.randomRange(0, this.canvas.width);
        this.y = Utils.randomRange(0, this.canvas.height);
        this.vx = Utils.randomRange(-this.config.maxSpeed, this.config.maxSpeed);
        this.vy = Utils.randomRange(-this.config.maxSpeed, this.config.maxSpeed);
        this.radius = Utils.randomRange(this.config.minRadius, this.config.maxRadius);
        this.color = Utils.randomColor(this.config.colors);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        this.x = Utils.clamp(this.x, 0, this.canvas.width);
        this.y = Utils.clamp(this.y, 0, this.canvas.height);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    isRunning: false,

    init() {
        this.canvas = Utils.$('#particles');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.start();

        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        const count = Utils.isMobile() ? CONFIG.particles.countMobile : CONFIG.particles.countDesktop;
        this.particles = Array.from(
            { length: count },
            () => new Particle(this.canvas, CONFIG.particles)
        );
    },

    handleResize() {
        this.resize();
        this.createParticles();
    },

    handleVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else {
            this.start();
        }
    },

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dist = Utils.distance(p1.x, p1.y, p2.x, p2.y);

                if (dist < CONFIG.particles.connectionDistance) {
                    const opacity = 1 - dist / CONFIG.particles.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(255, 107, 157, ${opacity * 0.25})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    },

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    },

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },

    destroy() {
        this.stop();
    }
};

const ThemeManager = {
    currentTheme: null,
    toggleBtn: null,
    iconEl: null,

    init() {
        this.toggleBtn = Utils.$('#theme-toggle');
        this.iconEl = Utils.$('#theme-icon');
        this.loadTheme();
        this.bindEvents();
    },

    loadTheme() {
        const savedTheme = Utils.storageGet(CONFIG.theme.storageKey, CONFIG.theme.defaultTheme);
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        this.currentTheme = theme;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        this.updateIcon();
        Utils.storageSet(CONFIG.theme.storageKey, theme);
    },

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    updateIcon() {
        if (!this.iconEl) return;
        this.iconEl.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
    },

    bindEvents() {
        if (this.toggleBtn) {
            Utils.on(this.toggleBtn, 'click', () => this.toggle());
        }
    }
};

const CursorEffect = {
    element: null,
    mouseX: 0,
    mouseY: 0,
    glowX: 0,
    glowY: 0,
    animationId: null,
    isEnabled: true,

    init() {
        if (Utils.isMobile() || Utils.isTouchDevice() || Utils.prefersReducedMotion()) {
            this.isEnabled = false;
            return;
        }

        this.element = Utils.$('#cursor-glow');
        if (!this.element) return;

        this.bindEvents();
        this.start();
    },

    bindEvents() {
        Utils.on(document, 'mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        Utils.on(document, 'mouseleave', () => {
            if (this.element) this.element.style.opacity = '0';
        });

        Utils.on(document, 'mouseenter', () => {
            if (this.element) this.element.style.opacity = '1';
        });
    },

    update() {
        if (!this.isEnabled) return;

        this.glowX = Utils.lerp(this.glowX, this.mouseX, CONFIG.cursor.smoothing);
        this.glowY = Utils.lerp(this.glowY, this.mouseY, CONFIG.cursor.smoothing);

        if (this.element) {
            this.element.style.left = `${this.glowX}px`;
            this.element.style.top = `${this.glowY}px`;
        }

        this.animationId = requestAnimationFrame(() => this.update());
    },

    start() {
        if (!this.isEnabled) return;
        this.update();
    },

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },

    destroy() {
        this.stop();
        this.isEnabled = false;
    }
};

const TimeUpdater = {
    element: null,
    intervalId: null,

    init() {
        this.element = Utils.$('#current-time');
        if (!this.element) return;

        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);
    },

    update() {
        if (this.element) {
            this.element.textContent = Utils.formatTime();
        }
    },

    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
};

const CounterAnimation = {
    counters: [],

    init() {
        this.counters = Utils.$$('[data-counter-target]');
        this.observe();
    },

    observe() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.counters.forEach(counter => observer.observe(counter));
    },

    animate(element) {
        const target = parseInt(element.dataset.counterTarget, 10);
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / CONFIG.counter.duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(step);
    }
};

const CardAnimation = {
    cards: [],
    observer: null,
    initialized: false,
    isHomePage: false, // 判断是否是主页

    init() {
        this.cards = Utils.$$('.card, [data-card]');
        // 检查是否是主页（包含带 data-card 属性的卡片）
        this.isHomePage = Utils.$('[data-card]') !== null;
        this.observe();
        this.addRippleEffect();
        this.initialized = true;
        
        // 监听页面显示事件（包括从 BFCache 恢复）
        window.addEventListener('pageshow', (event) => {
            // 只有在主页从 BFCache 恢复时才重置
            if (event.persisted && this.initialized && this.isHomePage) {
                // 从 BFCache 恢复，平滑重置动画
                this.smoothReset();
            }
        });
    },

    observe() {
        this.observer = new IntersectionObserver(
            entries => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // 使用 requestAnimationFrame 确保动画流畅
                        requestAnimationFrame(() => {
                            entry.target.classList.add('animate-fadeIn');
                            // 清除可能存在的内联样式
                            entry.target.style.opacity = '';
                            entry.target.style.transform = '';
                        });
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.cards.forEach(card => this.observer.observe(card));
    },

    smoothReset() {
        // 平滑重置：先隐藏，再移除动画类，然后重新观察
        this.cards.forEach((card, index) => {
            // 先添加隐藏样式
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                // 移除动画类
                card.classList.remove('animate-fadeIn');
                
                // 重新观察
                if (this.observer) {
                    this.observer.observe(card);
                }
            }, index * CONFIG.animations.stagger);
        });
    },

    addRippleEffect() {
        Utils.delegate(document, '.card, [data-card]', 'click', (e, target) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = Utils.createElement('span', {
                className: 'ripple-effect',
                style: `left: ${x}px; top: ${y}px;`
            });

            target.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }
};

const LazyLoad = {
    images: [],

    init() {
        this.images = Utils.$$('[data-src]');
        this.observe();
    },

    observe() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: CONFIG.lazyLoad.threshold,
                rootMargin: CONFIG.lazyLoad.rootMargin
            }
        );

        this.images.forEach(img => observer.observe(img));
    },

    loadImage(element) {
        const src = element.dataset.src;
        if (!src) return;

        element.src = src;
        element.removeAttribute('data-src');
        element.classList.add('loaded');
    }
};

const BlogFilter = {
    buttons: [],
    items: [],
    activeFilter: 'all',

    init() {
        this.buttons = Utils.$$('[data-filter]');
        this.items = Utils.$$('[data-category]');

        if (this.buttons.length === 0) return;

        this.bindEvents();
    },

    bindEvents() {
        this.buttons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                const filter = btn.dataset.filter;
                this.filter(filter);
                this.updateButtons(btn);
            });
        });
    },

    filter(category) {
        this.activeFilter = category;

        this.items.forEach((item, index) => {
            const shouldShow = category === 'all' || item.dataset.category === category;

            if (shouldShow) {
                item.classList.remove('hidden');
                setTimeout(() => {
                    item.classList.add('animate-fadeIn');
                }, index * 50);
            } else {
                item.classList.add('hidden');
                item.classList.remove('animate-fadeIn');
            }
        });
    },

    updateButtons(activeBtn) {
        this.buttons.forEach(btn => {
            btn.classList.toggle('active', btn === activeBtn);
        });
    }
};

const App = {
    modules: null,

    init() {
        this.modules = {
            ParticleSystem,
            ThemeManager,
            CursorEffect,
            TimeUpdater,
            CounterAnimation,
            CardAnimation,
            LazyLoad,
            BlogFilter
        };

        try {
            this.checkWelcome();
            this.initModules();
            console.log('🚀 应用初始化完成');
        } catch (error) {
            console.error('应用初始化错误:', error);
        }
    },

    checkWelcome() {
        const hasVisited = localStorage.getItem(CONFIG.welcome.storageKey);
        if (!hasVisited) {
            localStorage.setItem(CONFIG.welcome.storageKey, 'true');
            window.location.href = CONFIG.welcome.redirectUrl;
        }
    },

    initModules() {
        Object.entries(this.modules).forEach(([name, module]) => {
            try {
                if (typeof module.init === 'function') {
                    module.init();
                }
            } catch (error) {
                console.warn(`模块 ${name} 初始化失败:`, error);
            }
        });
    },

    destroy() {
        Object.entries(this.modules).forEach(([name, module]) => {
            try {
                if (typeof module.destroy === 'function') {
                    module.destroy();
                }
            } catch (error) {
                console.warn(`模块 ${name} 销毁失败:`, error);
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

window.addEventListener('beforeunload', () => App.destroy());
