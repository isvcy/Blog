// 模块化JavaScript代码
const App = (function() {
    // 粒子系统
    const ParticleSystem = {
        particles: [],
        canvas: null,
        ctx: null,
        
        init() {
            this.canvas = document.getElementById('particles');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', () => this.resizeCanvas());
        },
        
        resizeCanvas() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },
        
        createParticles() {
            // 根据设备类型和屏幕尺寸调整粒子数量
            const isMobile = window.innerWidth < 768;
            const particleCount = isMobile ? 40 : 80;
            
            for (let i = 0; i < particleCount; i++) {
                this.particles.push(new this.Particle(this));
            }
        },
        
        Particle: class {
            constructor(system) {
                this.system = system;
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * this.system.canvas.width;
                this.y = Math.random() * this.system.canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = this.getRandomColor();
            }
            
            getRandomColor() {
                const colors = [
                    'rgba(0, 245, 255,',
                    'rgba(168, 85, 247,',
                    'rgba(34, 197, 94,',
                    'rgba(249, 115, 22,'
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > this.system.canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > this.system.canvas.height) this.speedY *= -1;
            }
            
            draw() {
                const ctx = this.system.ctx;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        },
        
        connectParticles() {
            // 只在非移动设备上连接粒子，提高移动设备性能
            const isMobile = window.innerWidth < 768;
            if (isMobile) return;
            
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.2;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        },
        
        animate() {
            if (!this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            this.connectParticles();
            
            // 使用requestAnimationFrame的回调形式，避免箭头函数的闭包开销
            requestAnimationFrame(this.animate.bind(this));
        }
    };
    
    // 光标效果
    const CursorEffect = {
        cursorGlow: null,
        mouseX: 0,
        mouseY: 0,
        glowX: 0,
        glowY: 0,
        
        init() {
            this.cursorGlow = document.getElementById('cursor-glow');
            if (!this.cursorGlow) return;
            
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
            
            // 添加触摸事件支持
            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    this.mouseX = e.touches[0].clientX;
                    this.mouseY = e.touches[0].clientY;
                }
            });
            
            this.update();
        },
        
        update() {
            if (!this.cursorGlow) return;
            
            this.glowX += (this.mouseX - this.glowX) * 0.1;
            this.glowY += (this.mouseY - this.glowY) * 0.1;
            
            this.cursorGlow.style.left = this.glowX + 'px';
            this.cursorGlow.style.top = this.glowY + 'px';
            
            requestAnimationFrame(() => this.update());
        }
    };
    
    // 时间更新
    const TimeUpdater = {
        init() {
            this.update();
            setInterval(() => this.update(), 1000);
        },
        
        update() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
            const dateStr = now.toLocaleDateString('zh-CN');
            const timeElement = document.getElementById('current-time');
            
            if (timeElement) {
                timeElement.textContent = `${dateStr} ${timeStr}`;
            }
        }
    };
    
    // 主题切换
    const ThemeManager = {
        init() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const html = document.documentElement;
            
            if (!themeToggle) return;
            
            // 加载保存的主题
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || !savedTheme) {
                html.classList.add('dark');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                html.classList.remove('dark');
                if (themeIcon) themeIcon.textContent = '🌙';
            }
            
            // 主题切换事件
            themeToggle.addEventListener('click', () => {
                html.style.transition = 'all 0.5s ease';
                
                html.classList.toggle('dark');
                const isDark = html.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                
                if (themeIcon) {
                    themeIcon.style.transform = 'rotate(180deg) scale(0)';
                    setTimeout(() => {
                        themeIcon.textContent = isDark ? '☀️' : '🌙';
                        themeIcon.style.transform = 'rotate(360deg) scale(1)';
                    }, 150);
                }
                
                // 确保卡片有过渡效果
                document.querySelectorAll('.panel-card, .blog-card, .project-card').forEach(card => {
                    card.style.transition = 'all 0.5s ease';
                });
            });
        }
    };
    
    // 计数器动画
    const CounterAnimation = {
        init() {
            const counters = document.querySelectorAll('.counter');
            if (counters.length === 0) return;
            
            const animateCounters = () => {
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();
                    
                    const updateCounter = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(start + (target - start) * easeOut);
                        counter.textContent = current;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    requestAnimationFrame(updateCounter);
                });
            };
            
            const observerOptions = {
                threshold: 0.5
            };
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        }
    };
    
    // 卡片动画
    const CardAnimation = {
        init() {
            this.addRippleEffect();
            this.addFadeInEffect();
        },
        
        addRippleEffect() {
            // 添加涟漪效果样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.querySelectorAll('.panel-card, .blog-card, .project-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    
                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        background: rgba(0, 245, 255, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple 0.6s ease-out;
                        left: ${e.clientX - rect.left - size/2}px;
                        top: ${e.clientY - rect.top - size/2}px;
                        pointer-events: none;
                    `;
                    
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        },
        
        addFadeInEffect() {
            document.querySelectorAll('.panel-card, .blog-card, .project-card').forEach((card, index) => {
                // 初始状态：确保卡片可见，避免布局错乱
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                
                // 然后应用动画效果
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.transitionDelay = `${index * 0.1}s`;
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, 100);
            });
        }
    };
    
    // 博客分类过滤
    const BlogFilter = {
        init() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const filterItems = document.querySelectorAll('[data-category]');
            
            if (filterButtons.length === 0) return;
            
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    
                    // 更新按钮状态
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active', 'bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30');
                        btn.classList.add('bg-gray-800', 'text-gray-400', 'border-gray-700');
                    });
                    button.classList.add('active', 'bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30');
                    button.classList.remove('bg-gray-800', 'text-gray-400', 'border-gray-700');
                    
                    // 过滤项目
                    filterItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        if (filter === 'all' || category === filter) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    };
    
    // 图片懒加载
    const LazyLoad = {
        init() {
            const lazyImages = document.querySelectorAll('.lazyload');
            if (lazyImages.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazyload');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    };
    
    // 初始化应用
    function init() {
        try {
            ParticleSystem.init();
            CursorEffect.init();
            TimeUpdater.init();
            ThemeManager.init();
            CounterAnimation.init();
            CardAnimation.init();
            BlogFilter.init();
            LazyLoad.init();
        } catch (error) {
            console.error('应用初始化错误:', error);
        }
    }
    
    return {
        init
    };
})();

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', App.init);
