const logoutBtn = document.querySelector('.logout-btn');
const navItems = document.querySelectorAll('.nav-item');
const sidebar = document.getElementById('sidebar');
// Toggle sidebar on mobile
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
});
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Implement logout logic here
        console.log('Logging out...');
    }
});
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        navItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        // Handle section change
        const section = item.dataset.section;
        handleSectionChange(section);
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    });
});
// Section Change Handler
function handleSectionChange(section) {
    // Implement section change logic here
    console.log(`Switching to ${section} section`);
}

// Logout Handler
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Implement logout logic here
        console.log('Logging out...');
    }
});