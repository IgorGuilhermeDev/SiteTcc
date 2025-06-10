function setTheme(theme, saveToStorage = true) {
    if (theme === 'system') {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
        if (saveToStorage) {
            localStorage.removeItem('theme');
        }
    } else {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        if (saveToStorage) {
            localStorage.setItem('theme', theme);
        }
    }
    
    updateThemeToggleIcon(theme);
    
    // Atualizar outros elementos
    const elements = [
        '.navbar',
        'section',
        '.footer',
        '.btn',
        '.download-btn',
        '.terminal-block',
        '.terminal-header',
        '.terminal-body',
        '.copy-command'
    ];
    
    elements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (theme === 'system') {
                element.removeAttribute('data-theme');
            } else {
                element.setAttribute('data-theme', theme);
            }
        });
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (!currentTheme) {
        setTheme(systemPrefersDark ? 'light' : 'dark');
    } else {
        setTheme('system');
    }
}

function updateThemeToggleIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
    
    toggle.setAttribute('data-theme', theme || 'system');
    toggle.innerHTML = isDark ? 
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    document.body.appendChild(themeToggle);
    themeToggle.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || 'system', false);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            updateThemeToggleIcon('system');
        }
    });
});

document.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme) {
            navbar.setAttribute('data-theme', currentTheme);
        } else {
            navbar.removeAttribute('data-theme');
        }
        navbar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
    }
}); 