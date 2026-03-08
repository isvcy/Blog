const particles = [];
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
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

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const opacity = (1 - distance / 150) * 0.2;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
    }
    
    requestAnimationFrame(updateCursorGlow);
}

updateCursorGlow();

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    const dateStr = now.toLocaleDateString('zh-CN');
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = `${dateStr} ${timeStr}`;
    }
}

updateTime();
setInterval(updateTime, 1000);

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || !savedTheme) {
    html.classList.add('dark');
    if (themeIcon) themeIcon.textContent = '☀️';
} else {
    html.classList.remove('dark');
    if (themeIcon) themeIcon.textContent = '🌙';
}

if (themeToggle) {
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
        
        document.querySelectorAll('.panel-card, .blog-card, .project-card').forEach(card => {
            card.style.transition = 'all 0.5s ease';
        });
    });
}

const counters = document.querySelectorAll('.counter');
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

const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

const commands = {
    help: () => [
        'Available commands:',
        '  help     - Show this help message',
        '  about    - About me',
        '  skills   - My technical skills',
        '  contact  - Contact information',
        '  clear    - Clear terminal',
        '  date     - Show current date',
        '  whoami   - Who am I?'
    ],
    about: () => [
        '👋 Hi, I am a Full-Stack Developer!',
        'I love building beautiful and functional web applications.',
        'Passionate about clean code and great user experiences.'
    ],
    skills: () => [
        '🛠️ Technical Skills:',
        '  Frontend: React, Vue, TypeScript, TailwindCSS',
        '  Backend:  Node.js, Python, Go, Rust',
        '  Database: PostgreSQL, MongoDB, Redis',
        '  DevOps:   Docker, Kubernetes, AWS, GitHub Actions'
    ],
    contact: () => [
        '📧 Contact me:',
        '  Email:    hello@example.com',
        '  GitHub:   github.com/yourusername',
        '  Twitter:  @yourusername'
    ],
    date: () => [new Date().toLocaleString('zh-CN')],
    whoami: () => ['You are a visitor exploring DevConsole 🚀'],
    clear: () => {
        if (terminalOutput) {
            terminalOutput.innerHTML = '';
        }
        return [];
    }
};

if (terminalInput) {
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim().toLowerCase();
            if (input) {
                const commandLine = document.createElement('p');
                commandLine.innerHTML = `<span class="text-green-400">$</span> ${input}`;
                terminalOutput.appendChild(commandLine);

                if (commands[input]) {
                    const output = commands[input]();
                    output.forEach(line => {
                        const p = document.createElement('p');
                        p.textContent = line;
                        p.className = 'text-gray-300';
                        terminalOutput.appendChild(p);
                    });
                } else {
                    const p = document.createElement('p');
                    p.textContent = `Command not found: ${input}. Type 'help' for available commands.`;
                    p.className = 'text-red-400';
                    terminalOutput.appendChild(p);
                }

                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }
    });
}

document.querySelectorAll('.panel-card, .blog-card, .project-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
});

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
