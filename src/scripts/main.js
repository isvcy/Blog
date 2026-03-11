import { particleSystem } from './modules/particles.js';
import { themeManager } from './modules/theme.js';
import { cursorEffect } from './modules/cursor.js';
import { 
    timeUpdater, 
    counterAnimation, 
    cardAnimation, 
    lazyLoad, 
    blogFilter 
} from './modules/animations.js';
import { CONFIG } from './config/constants.js';

class App {
    constructor() {
        this.modules = {
            particleSystem,
            themeManager,
            cursorEffect,
            timeUpdater,
            counterAnimation,
            cardAnimation,
            lazyLoad,
            blogFilter
        };
    }

    async init() {
        try {
            this.checkWelcome();
            await this.initModules();
            console.log('🚀 应用初始化完成');
        } catch (error) {
            console.error('应用初始化错误:', error);
        }
    }

    checkWelcome() {
        const hasVisited = localStorage.getItem(CONFIG.welcome.storageKey);
        if (!hasVisited) {
            localStorage.setItem(CONFIG.welcome.storageKey, 'true');
            window.location.href = CONFIG.welcome.redirectUrl;
        }
    }

    async initModules() {
        const initPromises = Object.entries(this.modules).map(([name, module]) => {
            return new Promise(resolve => {
                try {
                    if (typeof module.init === 'function') {
                        module.init();
                    }
                    resolve({ name, status: 'success' });
                } catch (error) {
                    console.warn(`模块 ${name} 初始化失败:`, error);
                    resolve({ name, status: 'failed', error });
                }
            });
        });

        return Promise.all(initPromises);
    }

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
}

const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

window.addEventListener('beforeunload', () => app.destroy());

export default app;
