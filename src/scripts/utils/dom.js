export function $(selector, context = document) {
    return context.querySelector(selector);
}

export function $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
}

export function on(element, event, handler, options = {}) {
    if (!element) return () => {};
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
}

export function onAll(selector, event, handler, options = {}) {
    const elements = $$(selector);
    elements.forEach(el => el.addEventListener(event, handler, options));
    return () => elements.forEach(el => el.removeEventListener(event, handler, options));
}

export function delegate(container, selector, event, handler) {
    if (!container) return () => {};
    const listener = (e) => {
        const target = e.target.closest(selector);
        if (target && container.contains(target)) {
            handler.call(target, e, target);
        }
    };
    container.addEventListener(event, listener);
    return () => container.removeEventListener(event, listener);
}

export function addClass(element, ...classes) {
    element?.classList.add(...classes);
}

export function removeClass(element, ...classes) {
    element?.classList.remove(...classes);
}

export function toggleClass(element, className, force) {
    element?.classList.toggle(className, force);
}

export function hasClass(element, className) {
    return element?.classList.contains(className) ?? false;
}

export function setStyles(element, styles) {
    if (!element) return;
    Object.assign(element.style, styles);
}

export function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function setCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
}

export function createElement(tag, attributes = {}, children = []) {
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
