function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.setAttribute('data-theme', theme);
        navbar.style.background = '';
        void navbar.offsetHeight;
        navbar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
    }

    document.querySelectorAll('section').forEach(section => {
        section.setAttribute('data-theme', theme);
    });

    const footer = document.querySelector('.footer');
    if (footer) {
        footer.setAttribute('data-theme', theme);
    }

    document.querySelectorAll('.btn, .download-btn').forEach(button => {
        button.setAttribute('data-theme', theme);
    });

    document.querySelectorAll('.terminal-block, .terminal-header, .terminal-body, .copy-command').forEach(element => {
        element.setAttribute('data-theme', theme);
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function updateThemeToggleIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    
    toggle.setAttribute('data-theme', theme);
    toggle.innerHTML = theme === 'dark' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    document.body.appendChild(themeToggle);
    themeToggle.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});

document.addEventListener('scroll', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.setAttribute('data-theme', currentTheme);
        navbar.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
    }
}); 