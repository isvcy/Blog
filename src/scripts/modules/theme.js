import { CONFIG } from '../config/constants.js';
import { $, on, storageGet, storageSet } from '../utils/helpers.js';

class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.toggleBtn = null;
        this.iconEl = null;
        this.storageKey = CONFIG.theme.storageKey;
    }

    init() {
        this.toggleBtn = $('#theme-toggle');
        this.iconEl = $('#theme-icon');

        this.loadTheme();
        this.bindEvents();
    }

    loadTheme() {
        const savedTheme = storageGet(this.storageKey, CONFIG.theme.defaultTheme);
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        this.updateIcon();
        storageSet(this.storageKey, theme);
    }

    toggle() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    updateIcon() {
        if (!this.iconEl) return;
        this.iconEl.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
        this.iconEl.setAttribute('aria-label', 
            this.currentTheme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'
        );
    }

    bindEvents() {
        if (this.toggleBtn) {
            on(this.toggleBtn, 'click', () => this.toggle());
        }
    }

    getTheme() {
        return this.currentTheme;
    }

    isDark() {
        return this.currentTheme === 'dark';
    }
}

export const themeManager = new ThemeManager();
