// Settings Management JavaScript

// Mock user data
let currentUser = {
    email: 'user@example.com',
    role: 'MANAGER',
    roleCode: 'MGR001'
};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
    setupPasswordToggles();
    setupFormListeners();
});

// Initialize settings
function initializeSettings() {
    // Populate form fields with current user data
    document.getElementById('emailForSettings').value = currentUser.email;
    document.getElementById('roleForSettings').value = currentUser.role;
    document.getElementById('roleCode').value = currentUser.roleCode;
}

// Setup password visibility toggles
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            e.target.classList.toggle('fa-eye');
            e.target.classList.toggle('fa-eye-slash');
        });
    });
}

// Setup form listeners
function setupFormListeners() {
    // Profile settings form
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleProfileUpdate();
    });

    // Password change form
    document.getElementById('change-password-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handlePasswordChange();
    });
}

// Handle profile update
function handleProfileUpdate() {
    const newRole = document.getElementById('roleForSettings').value;
    const newRoleCode = document.getElementById('roleCode').value;

    // Validate role code format (example: should be 6 characters)
    if (newRoleCode.length !== 6) {
        showNotification('Role code must be 6 characters long', 'error');
        return;
    }

    // Update user data
    currentUser.role = newRole;
    currentUser.roleCode = newRoleCode;

    showNotification('Profile settings updated successfully', 'success');
}

// Handle password change
function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate password requirements
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    // In a real application, you would verify the current password
    // and make an API call to update the password

    showNotification('Password updated successfully', 'success');
    document.getElementById('change-password-form').reset();
}

// Confirm account deletion
function confirmDeleteAccount() {
    const password = document.getElementById('deletePassword').value;

    if (!password) {
        showNotification('Please enter your password to confirm deletion', 'error');
        return;
    }

    const modal = document.getElementById('confirmModal');
    const message = document.getElementById('confirmMessage');
    message.textContent = 'Are you sure you want to delete your account? This action cannot be undone.';

    modal.style.display = 'block';

    // Handle confirmation
    document.getElementById('confirmYes').onclick = () => {
        // In a real application, you would verify the password
        // and make an API call to delete the account
        showNotification('Account deleted successfully', 'success');
        modal.style.display = 'none';
        // Redirect to login page
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    };

    document.getElementById('confirmNo').onclick = () => {
        modal.style.display = 'none';
    };

    document.querySelector('#confirmModal .close-btn').onclick = () => {
        modal.style.display = 'none';
    };
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Handle menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});