import { CONFIG } from '../config/constants.js';
import { $, $$, on, delegate, createElement, formatTime } from '../utils/helpers.js';

class TimeUpdater {
    constructor() {
        this.element = null;
        this.intervalId = null;
    }

    init() {
        this.element = $('#current-time');
        if (!this.element) return;

        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);
    }

    update() {
        if (this.element) {
            this.element.textContent = formatTime();
        }
    }

    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

class CounterAnimation {
    constructor() {
        this.counters = [];
        this.duration = CONFIG.counter.duration;
    }

    init() {
        this.counters = $$('[data-counter-target]');
        this.observe();
    }

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
    }

    animate(element) {
        const target = parseInt(element.dataset.counterTarget, 10);
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
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
}

class CardAnimation {
    constructor() {
        this.cards = [];
        this.observer = null;
        this.initialized = false;
    }

    init() {
        this.cards = $$('.card, [data-card]');
        this.observe();
        this.addRippleEffect();
        this.initialized = true;
        
        // 监听页面显示事件（包括从 BFCache 恢复）
        window.addEventListener('pageshow', (event) => {
            if (event.persisted && this.initialized) {
                // 从 BFCache 恢复，平滑重置动画
                this.smoothReset();
            }
        });
    }

    observe() {
        this.observer = new IntersectionObserver(
            entries => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // 使用 requestAnimationFrame 确保动画流畅
                        requestAnimationFrame(() => {
                            entry.target.classList.add('animate-fadeIn');
                        });
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        this.cards.forEach(card => this.observer.observe(card));
    }

    smoothReset() {
        // 平滑重置：先隐藏，再移除动画类，然后重新观察
        this.cards.forEach((card, index) => {
            // 先添加隐藏类
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
    }

    addRippleEffect() {
        delegate(document, '.card, [data-card]', 'click', (e, target) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = createElement('span', {
                className: 'ripple-effect',
                style: `left: ${x}px; top: ${y}px;`
            });

            target.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }
}

class LazyLoad {
    constructor() {
        this.images = [];
    }

    init() {
        this.images = $$('[data-src]');
        this.observe();
    }

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
    }

    loadImage(element) {
        const src = element.dataset.src;
        if (!src) return;

        element.src = src;
        element.removeAttribute('data-src');
        element.classList.add('loaded');
    }
}

class BlogFilter {
    constructor() {
        this.buttons = [];
        this.items = [];
        this.activeFilter = 'all';
    }

    init() {
        this.buttons = $$('[data-filter]');
        this.items = $$('[data-category]');

        if (this.buttons.length === 0) return;

        this.bindEvents();
    }

    bindEvents() {
        this.buttons.forEach(btn => {
            on(btn, 'click', () => {
                const filter = btn.dataset.filter;
                this.filter(filter);
                this.updateButtons(btn);
            });
        });
    }

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
    }

    updateButtons(activeBtn) {
        this.buttons.forEach(btn => {
            btn.classList.toggle('active', btn === activeBtn);
        });
    }
}

export const timeUpdater = new TimeUpdater();
export const counterAnimation = new CounterAnimation();
export const cardAnimation = new CardAnimation();
export const lazyLoad = new LazyLoad();
export const blogFilter = new BlogFilter();
