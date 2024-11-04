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
let fields = [];  // Array to store field data

function openFieldModal(editField = null) {
    const modal = document.getElementById('fieldModal');
    const modalTitle = document.getElementById('modalTitle');
    const fieldForm = document.getElementById('fieldForm');

    // Reset form fields
    fieldForm.reset();
    document.getElementById('fieldId').value = '';

    if (editField) {
        modalTitle.textContent = 'Edit Field';
        document.getElementById('fieldId').value = editField.id;
        document.getElementById('fieldName').value = editField.name;
        document.getElementById('fieldLocation').value = editField.location;
        document.getElementById('fieldSize').value = editField.size;
        document.getElementById('fieldLog').value = editField.log;
    } else {
        modalTitle.textContent = 'Add Field';
    }

    modal.style.display = 'block';
}

function closeFieldModal() {
    document.getElementById('fieldModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    renderFields();
    updateDateTime();  // Only run updateDateTime after DOM is loaded
});

function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime'); // Make sure this ID matches the HTML

    if (dateTimeElement) {
        dateTimeElement.textContent = new Date().toLocaleString(); // Set the current date and time
    } else {
        console.error("Element with ID 'dateTime' not found.");
    }
}

// Example of how the modal functions should work
function handleFieldFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('fieldId').value;
    const name = document.getElementById('fieldName').value;
    const location = document.getElementById('fieldLocation').value;
    const size = document.getElementById('fieldSize').value;
    const log = document.getElementById('fieldLog').value;

    if (id) {
        // Update existing field
        const field = fields.find(f => f.id === id);
        field.name = name;
        field.location = location;
        field.size = size;
        field.log = log;
    } else {
        // Add new field
        const newField = {
            id: Date.now().toString(),
            name,
            location,
            size,
            log
        };
        fields.push(newField);
    }

    closeFieldModal();
    renderFields();
}

function renderFields() {
    const fieldTableBody = document.getElementById('fieldTableBody');
    fieldTableBody.innerHTML = '';

    fields.forEach(field => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${field.id}</td>
            <td>${field.name}</td>
            <td>${field.location}</td>
            <td>${field.size}</td>
            <td>${field.log}</td>
            <td>
                <button onclick="openFieldModal(${JSON.stringify(field)})" class="edit-btn">Edit</button>
                <button onclick="deleteField('${field.id}')" class="delete-btn">Delete</button>
            </td>
        `;

        fieldTableBody.appendChild(row);
    });
}

function deleteField(id) {
    if (confirm('Are you sure you want to delete this field?')) {
        fields = fields.filter(field => field.id !== id);
        renderFields();
    }
}
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = new Date().toLocaleString();
    } else {
        console.error("Element with ID 'dateTime' not found.");
    }
}
setInterval(updateDateTime, 1000);

document.addEventListener('DOMContentLoaded', () => {
    renderFields();
    updateDateTime();
});

