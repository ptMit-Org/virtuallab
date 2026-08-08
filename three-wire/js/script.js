// Highlight active navigation link and navigate
function activateLink(event, page) {
  // Optional: prevent default click behavior if you want to handle manually
  // event.preventDefault();

  // Remove 'active' from all nav links
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });

  // Add 'active' to the clicked one
  event.target.classList.add('active');

  // Navigate to the new page
  window.location.href = page;
}

// Auto-highlight the current page when it loads
window.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
});

// git@github.com-virtuallab:mmmvirtuallab-cloud/Three-Wire-Method.git