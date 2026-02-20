document.addEventListener('DOMContentLoaded', () => {
// Light and Dark Mode Toggle
const toggleButton = document.getElementById('theme-toggle');
if (toggleButton) {
    const htmlElement = document.documentElement;

    // Check for saved theme preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    htmlElement.setAttribute('data-theme', savedTheme);

    toggleButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');

if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Refresh button
const refreshBtn = document.getElementById('refresh');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        location.reload();
    });
}

// Search input
const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        console.log('Search:', e.target.value);
        // Add search logic here
    });
}

// Dropdown menu
const dropdownBtn = document.getElementById('dropdown-menu');
if (dropdownBtn) {
    dropdownBtn.addEventListener('click', () => {
        // Toggle dropdown, assuming there's a dropdown element
        const dropdown = document.getElementById('dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    });
}

// Arrow buttons
const leftArrow = document.getElementById('arrow-button-left');
const rightArrow = document.getElementById('arrow-button-right');

if (leftArrow) {
    leftArrow.addEventListener('click', () => {
        console.log('Left arrow clicked');
        // Add navigation logic
    });
}

if (rightArrow) {
    rightArrow.addEventListener('click', () => {
        console.log('Right arrow clicked');
        // Add navigation logic
    });
}

// Number buttons
const numberBtns = document.querySelectorAll('#numbers');
numberBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log('Number clicked:', e.target.textContent);
        // Add page selection logic
    });
});
});