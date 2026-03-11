export const CONFIG = {
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

export const COLORS = {
    primary: '#ff6b9d',
    secondary: '#c084fc',
    accent: '#34d399',
    candyPink: '#ff6b9d',
    candyPurple: '#c084fc',
    candyMint: '#34d399',
    candyYellow: '#fcd34d',
    candyBlue: '#60a5fa',
    candyOrange: '#fb923c',
    candyPeach: '#fca5a5',
    candyLavender: '#a78bfa'
};

export const BREAKPOINTS = {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280
};

export const Z_INDEX = {
    base: 1,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    tooltip: 50
};
