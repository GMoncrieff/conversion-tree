// General app utilities and helpers

// Clear session storage on landing page
if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    // Only clear if user explicitly returns to start
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
        sessionStorage.clear();
    }
}

// Utility function to format text
function formatText(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Add smooth transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});
