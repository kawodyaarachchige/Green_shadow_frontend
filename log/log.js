// Log Management JavaScript

// Mock data for initial testing
let logs = [
    {
        id: 'L001',
        date: '2024-03-15',
        details: 'Regular maintenance check completed',
        imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format'
    }
];

// DOM Elements
const logModal = document.getElementById('logModal');
const logForm = document.getElementById('logForm');
const logTableBody = document.getElementById('logTableBody');
const searchInput = document.getElementById('logSearch');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderLogTable();
    setupSearchListener();
    setupImagePreview();
});

// Setup image preview
function setupImagePreview() {
    const imageInput = document.getElementById('logImage');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });
}

// Search functionality
function setupSearchListener() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLogs = logs.filter(log =>
            log.details.toLowerCase().includes(searchTerm) ||
            log.date.includes(searchTerm)
        );
        renderLogTable(filteredLogs);
    });
}

// Render log table
function renderLogTable(logsToRender = logs) {
    logTableBody.innerHTML = '';
    logsToRender.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.id}</td>
            <td>${formatDate(log.date)}</td>
            <td>${log.details}</td>
            <td>
                ${log.imageUrl ? `<img src="${log.imageUrl}" class="log-image" onclick="showFullImage('${log.imageUrl}')">` : 'No image'}
            </td>
            <td class="table-actions">
                <button onclick="editLog('${log.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteLog('${log.id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        logTableBody.appendChild(row);
    });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show full image
function showFullImage(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `<img src="${imageUrl}" alt="Full size image">`;
    document.body.appendChild(modal);

    modal.addEventListener('click', () => {
        modal.remove();
    });
}

// Open modal for adding new log
function openLogModal() {
    document.getElementById('modalTitle').textContent = 'Add Log';
    clearForm();
    logModal.style.display = 'block';
}

// Close modal
function closeLogModal() {
    logModal.style.display = 'none';
    clearForm();
}

// Clear form
function clearForm() {
    logForm.reset();
    document.getElementById('logId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Log';
    document.getElementById('imagePreview').innerHTML = '';
}

// Handle form submission
function handleLogFormSubmit(event) {
    event.preventDefault();

    const logId = document.getElementById('logId').value;
    const imageInput = document.getElementById('logImage');
    let imageUrl = '';

    // In a real application, you would upload the image to a server
    // For this demo, we'll use a placeholder image if a file is selected
    if (imageInput.files.length > 0) {
        imageUrl = 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&auto=format';
    }

    const log = {
        id: logId || `L${String(logs.length + 1).padStart(3, '0')}`,
        date: document.getElementById('logDate').value,
        details: document.getElementById('logDetails').value,
        imageUrl: imageUrl
    };

    if (logId) {
        // Update existing log
        const index = logs.findIndex(l => l.id === logId);
        logs[index] = { ...logs[index], ...log };
    } else {
        // Add new log
        logs.push(log);
    }

    renderLogTable();
    closeLogModal();
    showNotification(logId ? 'Log updated successfully!' : 'Log added successfully!');
}

// Edit log
function editLog(id) {
    const log = logs.find(l => l.id === id);
    if (log) {
        document.getElementById('logId').value = log.id;
        document.getElementById('logDate').value = log.date;
        document.getElementById('logDetails').value = log.details;

        if (log.imageUrl) {
            document.getElementById('imagePreview').innerHTML = `
                <img src="${log.imageUrl}" alt="Preview">
            `;
        }

        document.getElementById('modalTitle').textContent = 'Edit Log';
        logModal.style.display = 'block';
    }
}

// Delete log
function deleteLog(id) {
    if (confirm('Are you sure you want to delete this log?')) {
        logs = logs.filter(log => log.id !== id);
        renderLogTable();
        showNotification('Log deleted successfully!');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === logModal) {
        closeLogModal();
    }
}

// Handle menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});