const logoutBtn = document.querySelector('.logout-btn');
const navItems = document.querySelectorAll('.nav-item');
const sidebar = document.getElementById('sidebar');

// Toggle sidebar on mobile
document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
logoutBtn.addEventListener('click', handleLogout);
navItems.forEach(item => item.addEventListener('click', handleNavItemClick));

// Toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Handle logout action
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('Logging out...');
        document.cookie='token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '../index.html';
    }
}

// Handle navigation item click
function handleNavItemClick() {
    navItems.forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    const section = this.dataset.section;
    handleSectionChange(section);
    closeSidebarOnMobile();
}

// Change section handler
function handleSectionChange(section) {
    console.log(`Switching to ${section} section`);
}

// Close sidebar on mobile if necessary
function closeSidebarOnMobile() {
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('active');
    }
}

// Update Date and Time every second
function updateDateTime() {
    const dateTimeElement = document.getElementById("date-time");
    if (dateTimeElement) {
        dateTimeElement.textContent = new Date().toLocaleString();
    }
    setTimeout(updateDateTime, 1000);
}

document.addEventListener("DOMContentLoaded", updateDateTime);

// Display notification
function showNotification(message, type = 'info') {
    const notification = createNotification(message, type);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Create notification element
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconClass(type)}"></i>
        <span>${message}</span>
    `;
    return notification;
}

// Get appropriate icon class based on notification type
function getIconClass(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

// Get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}
