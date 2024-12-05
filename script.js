const logoutBtn = document.querySelector('.logout-btn');
const navItems = document.querySelectorAll('.nav-item');
const sidebar = document.getElementById('sidebar');


document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
logoutBtn.addEventListener('click', handleLogout);
navItems.forEach(item => item.addEventListener('click', handleNavItemClick));


function toggleSidebar() {
    sidebar.classList.toggle('active');
}


function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('Logging out...');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'userGreenShadow=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '../index.html';
    }
}

function handleNavItemClick() {
    navItems.forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    const section = this.dataset.section;
    handleSectionChange(section);
    closeSidebarOnMobile();
}


function handleSectionChange(section) {
    console.log(`Switching to ${section} section`);
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 1024) {
        sidebar.classList.remove('active');
    }
}

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

function showNotification(message, type = 'info') {
    const notification = createNotification(message, type);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconClass(type)}"></i>
        <span>${message}</span>
    `;
    return notification;
}

function getIconClass(type) {
    switch (type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'exclamation-circle';
        default:
            return 'info-circle';
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}
setAccess()

function setAccess(){
    console.log("in access")
    const role = getCookie('role');
    console.log(role)

    if (role === 'ADMINISTRATIVE') {
        $('.sidebar-nav a[data-section="crops"]').css('display', 'none');
        $('.sidebar-nav a[data-section="fields"]').css('display', 'none');
        $('.sidebar-nav a[data-section="logs"]').css('display', 'none');
    }

    if (role === 'SCIENTIST') {
        $('.sidebar-nav a[data-section="vehicles"]').css('display', 'none');
        $('.sidebar-nav a[data-section="staff"]').css('display', 'none');
        $('.sidebar-nav a[data-section="equipment"]').css('display', 'none');
    }


}

