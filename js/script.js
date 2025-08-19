document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav ul');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    }

    // Initialize phone contact menu
    initializePhoneContactMenu();
});

function initializeTheme() {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

function initializePhoneContactMenu() {
    const phoneLinks = document.querySelectorAll('.phone-link');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('data-phone');
            showContactMenu(phoneNumber, e.target);
        });
    });
}

function showContactMenu(phoneNumber, clickedElement) {
    // Remove existing menu if present
    const existingMenu = document.querySelector('.contact-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create menu
    const menu = document.createElement('div');
    menu.className = 'contact-menu';
    menu.innerHTML = `
        <div class="contact-menu-item" onclick="callPhone('${phoneNumber}')">
            <span>📞</span> Bellen
        </div>
        <div class="contact-menu-item" onclick="openWhatsApp('${phoneNumber}')">
            <span>💬</span> WhatsApp
        </div>
    `;

    // Position menu near clicked element
    const rect = clickedElement.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = (rect.bottom + 5) + 'px';
    menu.style.left = rect.left + 'px';
    menu.style.zIndex = '1000';

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== clickedElement) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function callPhone(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
    const menu = document.querySelector('.contact-menu');
    if (menu) menu.remove();
}

function openWhatsApp(phoneNumber) {
    // Format phone number for WhatsApp (remove spaces and add country code if needed)
    const formattedNumber = phoneNumber.replace(/\s/g, '');
    const whatsappNumber = formattedNumber.startsWith('06') ? '31' + formattedNumber.substring(1) : formattedNumber;
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    const menu = document.querySelector('.contact-menu');
    if (menu) menu.remove();
}