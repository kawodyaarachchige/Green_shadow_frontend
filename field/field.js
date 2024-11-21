// Global variables
let fields = [];
let map = null;
let currentMarker = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadFieldsFromStorage();
    renderFields();
    initializeSearchBar();
    initializeMenuToggle();
});

// Menu Toggle Function
function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Local Storage Functions
function loadFieldsFromStorage() {
    const storedFields = localStorage.getItem('fields');
    fields = storedFields ? JSON.parse(storedFields) : [];
}

function saveFieldsToStorage() {
    localStorage.setItem('fields', JSON.stringify(fields));
}

// Modal Functions
function closeFieldModal() {
    const modal = document.getElementById('fieldModal');
    modal.style.display = 'none';
    if (map) {
        map.remove();
        map = null;
        currentMarker = null;
    }
}

function closeViewMoreModal() {
    const modal = document.getElementById('viewMoreModal');
    modal.style.display = 'none';
}

// Image Preview Functions
function previewImage1(event) {
    const preview = document.getElementById('imagePreview1');
    handleImagePreview(event.target.files[0], preview);
}

function previewImage2(event) {
    const preview = document.getElementById('imagePreview2');
    handleImagePreview(event.target.files[0], preview);
}

function handleImagePreview(file, previewElement) {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Field Management Functions
function handleFieldFormSubmit(event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById('fieldId').value || Date.now().toString(),
        name: document.getElementById('fieldName').value.trim(),
        location: document.getElementById('location').value.trim(),
        size: document.getElementById('fieldSize').value.trim(),
        log: document.getElementById('fieldLog').value.trim(),
        lastUpdated: new Date().toISOString()
    };

    if (!validateFieldData(formData)) return;

    const image1File = document.getElementById('fieldImage').files[0];
    const image2File = document.getElementById('fieldImage2').files[0];

    Promise.all([
        processImage(image1File),
        processImage(image2File)
    ]).then(([image1, image2]) => {
        formData.image1 = image1 || (fields.find(f => f.id === formData.id)?.image1 || '');
        formData.image2 = image2 || (fields.find(f => f.id === formData.id)?.image2 || '');

        saveField(formData);
    });
}

function validateFieldData(data) {
    const nameRegex = /^[a-zA-Z0-9\s]{3,50}$/;
    const locationRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    const sizeRegex = /^\d+(\.\d{1,2})?$/;

    if (!nameRegex.test(data.name)) {
        showNotification('Invalid name: 3-50 characters, letters, numbers, and spaces only', 'error');
        return false;
    }

    if (!locationRegex.test(data.location)) {
        showNotification('Invalid location format: Use latitude, longitude', 'error');
        return false;
    }

    if (!sizeRegex.test(data.size)) {
        showNotification('Invalid size: Use positive numbers with up to 2 decimal places', 'error');
        return false;
    }

    return true;
}

function processImage(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function saveField(fieldData) {
    const index = fields.findIndex(f => f.id === fieldData.id);

    if (index > -1) {
        fields[index] = { ...fields[index], ...fieldData };
        showNotification('Field updated successfully', 'info');
    } else {
        fields.push(fieldData);
        showNotification('Field added successfully', 'success');
    }

    saveFieldsToStorage();
    closeFieldModal();
    renderFields();
}

function deleteField(id) {
    if (!confirm('Are you sure you want to delete this field?')) return;

    fields = fields.filter(field => field.id !== id);
    saveFieldsToStorage();
    renderFields();
    showNotification('Field deleted successfully', 'error');
}

function viewMore(id) {
    const field = fields.find(field => field.id === id);
    if (!field) return;

    document.getElementById('viewFieldId').textContent = field.id;
    document.getElementById('viewFieldName').textContent = field.name;
    document.getElementById('viewFieldLocation').textContent = field.location;
    document.getElementById('viewFieldSize').textContent = field.size + ' acres';
    document.getElementById('viewFieldLog').textContent = field.log;

    const image1 = document.getElementById('viewFieldImage1');
    const image2 = document.getElementById('viewFieldImage2');

    if (field.image1) {
        image1.src = field.image1;
        image1.style.display = 'block';
    } else {
        image1.style.display = 'none';
    }

    if (field.image2) {
        image2.src = field.image2;
        image2.style.display = 'block';
    } else {
        image2.style.display = 'none';
    }

    document.getElementById('viewMoreModal').style.display = 'block';
}

// UI Functions
function renderFields() {
    const tbody = document.getElementById('fieldTableBody');
    tbody.innerHTML = '';

    if (fields.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="no-results">
                    <i class="fas fa-seedling"></i>
                    <p>No fields added yet. Click "Add Field" to get started.</p>
                </td>
            </tr>
        `;
        return;
    }

    fields.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${field.id}</td>
            <td>${field.name}</td>
            <td>${field.location}</td>
            <td>${field.size} acres</td>
            <td>${field.log}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="openFieldModal('${field.id}')" class="edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteField('${field.id}')" class="delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="viewMore('${field.id}')" class="view-btn" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function initializeSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFields = fields.filter(field =>
            field.name.toLowerCase().includes(searchTerm) ||
            field.location.toLowerCase().includes(searchTerm)
        );
        renderFilteredFields(filteredFields);
    });
}

function renderFilteredFields(filteredFields) {
    const tbody = document.getElementById('fieldTableBody');
    tbody.innerHTML = '';

    if (filteredFields.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No fields found matching your search</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredFields.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${field.id}</td>
            <td>${field.name}</td>
            <td>${field.location}</td>
            <td>${field.size} acres</td>
            <td>${field.log}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="openFieldModal('${field.id}')" class="edit-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteField('${field.id}')" class="delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="viewMore('${field.id}')" class="view-btn" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openFieldModal(fieldId = null) {
    const modal = document.getElementById('fieldModal');
    const form = document.getElementById('fieldForm');
    form.reset();

    // Reset image previews
    document.getElementById('imagePreview1').style.display = 'none';
    document.getElementById('imagePreview2').style.display = 'none';

    if (fieldId) {
        const field = fields.find(f => f.id === fieldId);
        if (field) {
            document.getElementById('modalTitle').textContent = 'Edit Field';
            populateFormWithFieldData(field);
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Field';
        document.getElementById('fieldId').value = '';
    }

    modal.style.display = 'block';
    initializeMap();
}

function populateFormWithFieldData(field) {
    document.getElementById('fieldId').value = field.id;
    document.getElementById('fieldName').value = field.name;
    document.getElementById('location').value = field.location;
    document.getElementById('fieldSize').value = field.size;
    document.getElementById('fieldLog').value = field.log;

    if (field.image1) {
        document.getElementById('imagePreview1').src = field.image1;
        document.getElementById('imagePreview1').style.display = 'block';
    }
    if (field.image2) {
        document.getElementById('imagePreview2').src = field.image2;
        document.getElementById('imagePreview2').style.display = 'block';
    }

    if (field.location) {
        const [lat, lng] = field.location.split(',').map(coord => parseFloat(coord.trim()));
        if (map) {
            map.setView([lat, lng], 15);
            if (currentMarker) {
                currentMarker.setLatLng([lat, lng]);
            } else {
                currentMarker = L.marker([lat, lng]).addTo(map);
            }
        }
    }
}

function initializeMap() {
    if (!map) {
        map = L.map('map').setView([7.8731, 80.7718], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            document.getElementById('location').value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

            if (currentMarker) {
                currentMarker.setLatLng(e.latlng);
            } else {
                currentMarker = L.marker(e.latlng).addTo(map);
            }
        });
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFieldModal();
        closeViewMoreModal();
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const fieldModal = document.getElementById('fieldModal');
    const viewMoreModal = document.getElementById('viewMoreModal');

    if (e.target === fieldModal) {
        closeFieldModal();
    }
    if (e.target === viewMoreModal) {
        closeViewMoreModal();
    }
});