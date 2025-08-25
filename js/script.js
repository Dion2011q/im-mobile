// Phone number choice functionality
function showPhoneOptions() {
    const phoneNumber = '+31655628064';
    const choice = confirm('Kies hoe u contact wilt opnemen:\n\nOK = WhatsApp\nAnnuleren = Bellen');

    if (choice) {
        // WhatsApp
        window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}`, '_blank');
    } else {
        // Regular phone call
        window.location.href = `tel:${phoneNumber}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();

    // Initialize mobile-friendly interactions
    initializeMobileInteractions();

    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                nav.classList.remove('active');
            }
        });
    }
});

function initializeMobileInteractions() {
    // Make buttons more touch-friendly
    const buttons = document.querySelectorAll('.btn, button, .repair-btn');
    buttons.forEach(button => {
        button.style.minHeight = '44px'; // iOS recommended touch target size
        button.style.minWidth = '44px';
    });

    // Add touch-friendly behavior to links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('touchstart', function() {
            // Add touch feedback
        });
    });
}

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

// Phone options modal functionality
function showPhoneOptions() {
    const phoneModal = document.getElementById('phoneModal');
    if (phoneModal) {
        phoneModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePhoneModal() {
    const phoneModal = document.getElementById('phoneModal');
    if (phoneModal) {
        phoneModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function callWhatsApp() {
    const phoneNumber = '+31655628064';
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
    closePhoneModal();
}

function makePhoneCall() {
    const phoneNumber = '+31655628064';
    window.location.href = `tel:${phoneNumber}`;
    closePhoneModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('phoneModal');
    if (modal && event.target === modal) {
        closePhoneModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('phoneModal');
        if (modal && modal.style.display === 'block') {
            closePhoneModal();
        }
    }
});