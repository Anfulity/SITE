'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


function init() {
    initTheme();
    initMobileMenu();
    initScrollProgress();
    initNavbarShrink();
    initScrollReveal();
    initScrollSpy();
    initTypewriter();
    initCounters();
}

init();

function initTheme() {
    const toggle = document.querySelector('.theme-switch input');
    if (!toggle) return;
    const root = document.documentElement;

    toggle.checked = root.classList.contains('dark-mode');

    toggle.addEventListener('change', () => {
        root.classList.toggle('dark-mode', toggle.checked);
        try {
            localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
        } catch (e) {}
    });
}

function initMobileMenu() {
    const checkbox = document.getElementById('nav-toggle');
    if (!checkbox) return;

    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => { checkbox.checked = false; });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') checkbox.checked = false;
    });
}

function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    let ticking = false;

    function update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
}

function initNavbarShrink() {
    const header = document.querySelector('.navbar-header');
    if (!header) return;
    const check = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', check, { passive: true });
    check();
}

function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    items.forEach(el => observer.observe(el));
}

function initScrollSpy() {
    const links = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.toggle(
                'active', l.getAttribute('href') === '#' + entry.target.id
            ));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
}

function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const words = ['Plastic', 'Paper', 'Metal', 'E-Waste', 'Glass', 'Household Waste', 'Tires', 'Used Oil', 'Food', 'Lawn Materials'];

    if (prefersReducedMotion) { el.textContent = words[0]; return; }

    let w = 0, c = 0, deleting = false;

    function tick() {
        const word = words[w];
        c += deleting ? -1 : 1;
        el.textContent = word.slice(0, c);

        let delay = deleting ? 50 : 100;
        if (!deleting && c === word.length) { deleting = true; delay = 1400; }
        else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
        setTimeout(tick, delay);
    }
    tick();
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function run(el) {
        const target = +el.dataset.target;
        if (prefersReducedMotion) { el.textContent = target.toLocaleString(); return; }
        const duration = 1800;
        const start = performance.now();

        function frame(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased).toLocaleString();
            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { run(entry.target); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}