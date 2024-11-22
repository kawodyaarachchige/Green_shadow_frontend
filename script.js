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
        console.log('Logging out...');
        window.location.href = '../index.html';
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
    console.log(`Switching to ${section} section`);
}

// Logout Handler
logoutBtn.addEventListener('click', () => {
});
function updateDateTime() {
    const dateTimeElement = document.getElementById("date-time");
    if (dateTimeElement) {
        dateTimeElement.textContent = new Date().toLocaleString();
    }
    setTimeout(updateDateTime, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    updateDateTime();
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Append the notification to the body
    document.body.appendChild(notification);

    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500); // Wait for fade-out transition to finish
    }, 3000); // Keep the notification visible for 3 seconds
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}
