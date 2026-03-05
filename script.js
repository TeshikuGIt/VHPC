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

const dropdownButtons = document.querySelectorAll('#SidebtnF, #SidebtnF1, #SidebtnF2, #SidebtnD, #SidebtnC');
dropdownButtons.forEach(button => {
    button.addEventListener('click', () => {
        myFunction(button.id);
    });
});
function myFunction(buttonId) {
  var x = document.getElementById("dropdown-menuF");
  var x1 = document.getElementById("dropdown-menuF1");
  var x2 = document.getElementById("dropdown-menuF2");
  var y = document.getElementById("dropdown-menuD");
  var z = document.getElementById("dropdown-menuC");
  if (buttonId === "SidebtnF") {
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  if (buttonId === "SidebtnF1") {
    if (x1.style.display === "none") {
      x1.style.display = "block";
    } else {
      x1.style.display = "none";
    }
  }
  if (buttonId === "SidebtnF2") {
    if (x2.style.display === "none") {
      x2.style.display = "block";
    } else {
      x2.style.display = "none";
    }
  }

  if (buttonId === "SidebtnD") {
    if (y.style.display === "none") {
      y.style.display = "block";
    } else {
      y.style.display = "none";
    }
  }
  if (buttonId === "SidebtnC") {
    if (z.style.display === "none") {
      z.style.display = "block";
    } else {
      z.style.display = "none";
    }
  }
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

// Fetch and populate table data
const pathname = window.location.pathname;
let apiEndpoint = '/api/data'; // default for Index/other
// Use explicit endpoints for Passed/Discarded pages
if (pathname.toLowerCase().includes('discarded')) {
    apiEndpoint = '/api/discarded';
} else if (pathname.toLowerCase().includes('passed')) {
    apiEndpoint = '/api/passed';
}

fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('data-table');
        const rows = table.querySelectorAll('tbody tr');
        data.forEach((record, index) => {
            if (rows[index]) {
                const spans = rows[index].querySelectorAll('[data-field]');
                spans.forEach(span => {
                    const field = span.dataset.field;
                    span.textContent = record[field] || 'N/A';
                });
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));

    if (window.location.pathname.toLowerCase().includes('view')) {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return;

    fetch(`/api/data/${id}`)
        .then(response => response.json())
        .then(record => {

            const spans = document.querySelectorAll('[data-field]');
            spans.forEach(span => {
                const field = span.dataset.field;
                span.textContent = record[field] || 'N/A';
            });

            document.getElementById('qr-image').src = `/api/qr/${id}`;
        })
        .catch(error => console.error('Error loading record:', error));
}
})