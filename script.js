const logoutBtn = document.querySelector('.logout-btn');
const navItems = document.querySelectorAll('.nav-item');
const sidebar = document.getElementById('sidebar');
// Toggle sidebar on mobile
document.getElementById('menuToggle').addEventListener('click', function () {
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
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const section = item.dataset.section;
        handleSectionChange(section);
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

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}
