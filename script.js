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
        document.cookie='userGreenShadow=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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

document.addEventListener("DOMContentLoaded", () => {
    updateDateTime();

})

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
/*const apiKey = '5c2b4c4b0a0d4d5c2b4c4b0a0d4d5c2b';
const city = 'Colombo'; // Replace with your location

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        const weatherDetails = `
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;
        document.getElementById('weatherDetails').innerHTML = weatherDetails;
    });*/
/*const activityLogs = document.getElementById('activityLogs');
const logActivity = (activity) => {
    const logItem = document.createElement('li');
    logItem.textContent = activity;
    activityLogs.appendChild(logItem);
};

// Example usage:
logActivity('Added a new crop: Rice');
logActivity('Updated soil moisture for Field 1');*/



