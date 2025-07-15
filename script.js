document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const osSelector = document.getElementById('os-select');
    const commandSections = document.querySelectorAll('.command-section');
    const downloadBtn = document.querySelector('.download-btn');

    if (osSelector) {
        osSelector.addEventListener('change', function() {
            const selectedOS = this.value;
            
            commandSections.forEach(function(section) {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(selectedOS + '-install');
            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (downloadBtn) {
                const osNames = {
                    'linux': 'Linux',
                    'mac': 'macOS',
                    'windows': 'Windows'
                };
                downloadBtn.innerHTML = `⬇️ Baixar para ${osNames[selectedOS] || 'Linux'}`;
                
                if (selectedOS === 'windows') {
                    downloadBtn.style.opacity = '0.5';
                    downloadBtn.style.pointerEvents = 'none';
                } else {
                    downloadBtn.style.opacity = '1';
                    downloadBtn.style.pointerEvents = 'auto';
                }
            }
        });
    }

    const copyButtons = document.querySelectorAll('.copy-command');
    copyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-command');
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    showCopySuccess(button);
                }).catch(function(err) {
                    fallbackCopyText(textToCopy, button);
                });
            } else {
                fallbackCopyText(textToCopy, button);
            }
        });
    });

    function fallbackCopyText(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
        }
        
        document.body.removeChild(textArea);
    }

    function showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copiado!';
        button.style.background = '#43a047';
        
        setTimeout(function() {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }

    const notifyBtn = document.querySelector('.notify-button');
    const notifyInput = document.querySelector('.email-input');
    
    if (notifyBtn && notifyInput) {
        notifyBtn.addEventListener('click', function() {
            const email = notifyInput.value.trim();
            if (email && isValidEmail(email)) {
                alert('Obrigado! Você será notificado quando a versão para Windows estiver disponível.');
                notifyInput.value = '';
                this.innerHTML = '✅ Cadastrado!';
                this.style.background = '#43a047';
                
                setTimeout(() => {
                    this.innerHTML = 'Receber notificação';
                    this.style.background = '';
                }, 3000);
            } else {
                alert('Por favor, insira um email válido.');
                notifyInput.focus();
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .developer-card, .feedback-card, .download-card-main, .install-commands, .system-requirements').forEach(function(card) {
        observer.observe(card);
    });

    const style = document.createElement('style');
    style.textContent = `
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .feature-card,
        .developer-card,
        .feedback-card,
        .download-card-main,
        .install-commands,
        .system-requirements {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .feature-card.animate-in,
        .developer-card.animate-in,
        .feedback-card.animate-in,
        .download-card-main.animate-in,
        .install-commands.animate-in,
        .system-requirements.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .hero-logo {
            transition: transform 0.3s ease;
        }

        .hero-logo:hover {
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .download-hero {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .option-group {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }
            
            .os-selector {
                min-width: auto;
                width: 100%;
            }
            
            .notify-form {
                flex-direction: column;
                align-items: stretch;
            }
            
            .email-input {
                min-width: auto;
                width: 100%;
            }
            
            .terminal-body code {
                font-size: 0.8rem;
                word-break: break-word;
            }

            .terminal-header {
                flex-direction: column;
                gap: 0.5rem;
                align-items: flex-start;
            }

            .copy-command {
                align-self: flex-end;
            }

            .version-info {
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);


    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            updateThemeIcon();
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    
    function updateThemeIcon() {
    }
    
    updateThemeIcon();

    function initCommandsNavigation() {
        
        const navItems = document.querySelectorAll('.docs-nav-item');
        const sections = document.querySelectorAll('.docs-section');
        
        
        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const targetSection = item.getAttribute('data-section');
                
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                

                item.classList.add('active');
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                } else {
                    console.error('Target element not found for:', targetSection);
                }
            });
        });
    }

    
    function initCodeCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-code-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const codeData = button.getAttribute('data-code');
                
                try {
                    await navigator.clipboard.writeText(codeData);
                    
                    
                    const originalText = button.textContent;
                    button.textContent = '✅ Copiado!';
                    button.style.background = '#22c55e';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                    }, 2000);
                } catch (err) {                    
                    const textArea = document.createElement('textarea');
                    textArea.value = codeData;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    
                    const originalText = button.textContent;
                    button.textContent = '✅ Copiado!';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                }
            });
        });
    }

    
    function smoothScrollToCommands() {
        const commandsLinks = document.querySelectorAll('a[href="#comandos"]');
        
        commandsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('comandos');
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    
    setTimeout(() => {
        initCommandsNavigation();
        initCodeCopyButtons();
        smoothScrollToCommands();
        initPDFViewer();
        
    }, 100);
}); 


function initPDFViewer() {
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
        console.log('PDF Viewer inicializado');
    }
} 