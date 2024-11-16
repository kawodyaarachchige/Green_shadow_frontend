// Global Variables
let crops = [];

// Load data from localStorage
function loadData() {
    const savedCrops = localStorage.getItem('crops');
    if (savedCrops) {
        crops = JSON.parse(savedCrops);
    }
}

// Save crops to localStorage
function saveData() {
    localStorage.setItem('crops', JSON.stringify(crops));
}

// Fetch fields from localStorage
function getFields() {
    const savedFields = localStorage.getItem('fields');
    return savedFields ? JSON.parse(savedFields) : [];
}

// Open Crop Modal
function openCropModal(crop = null) {
    document.getElementById('cropModal').style.display = 'block';
    loadFieldOptions();

    if (crop) {
        document.getElementById('modalTitle').textContent = 'Edit Crop';
        document.getElementById('cropId').value = crop.cropId;
        document.getElementById('specialName').value = crop.specialName;
        document.getElementById('commonName').value = crop.commonName;
        document.getElementById('category').value = crop.category;
        document.getElementById('fieldSelect').value = crop.fieldId;
        document.getElementById('season').value = crop.season;

        if (crop.image) {
            document.getElementById('imagePreview').src = crop.image;
            document.getElementById('imagePreview').style.display = 'block';
        } else {
            document.getElementById('imagePreview').style.display = 'none';
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add Crop';
        document.getElementById('cropForm').reset();
        document.getElementById('cropId').value = ''; // Clear the ID for a new entry
        document.getElementById('imagePreview').style.display = 'none';
    }
}

// Close Crop Modal
function closeCropModal() {
    document.getElementById('cropModal').style.display = 'none';
}

// Load Field Options for Dropdown
function loadFieldOptions() {
    const fieldSelect = document.getElementById('fieldSelect');
    const fields = getFields();

    fieldSelect.innerHTML = ''; // Clear existing options
    fields.forEach(field => {
        const option = document.createElement('option');
        option.value = field.id;
        option.textContent = field.name;
        fieldSelect.appendChild(option);
    });
}

// Handle Crop Image Preview
function previewCropImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // Show image preview
        };
        reader.readAsDataURL(file);
    }
}

// Handle Crop Form Submission
function handleCropFormSubmit(event) {
    event.preventDefault();

    const cropId = document.getElementById('cropId').value || (crops.length + 1).toString(); // Auto-generate ID if not provided
    const specialName = document.getElementById('specialName').value;
    const commonName = document.getElementById('commonName').value;
    const category = document.getElementById('category').value;
    const fieldId = parseInt(document.getElementById('fieldSelect').value);
    const season = document.getElementById('season').value;
    const cropImage = document.getElementById('imagePreview').src;

    const existingCrop = crops.find(crop => crop.cropId === cropId);

    if (existingCrop) {
        // Update crop
        existingCrop.specialName = specialName;
        existingCrop.commonName = commonName;
        existingCrop.category = category;
        existingCrop.fieldId = fieldId;
        existingCrop.season = season;
        existingCrop.image = cropImage;
        showNotification('Crop updated successfully!', 'success');
    } else {
        // Add new crop
        const newCrop = { cropId, specialName, commonName, category, fieldId, season, image: cropImage };
        crops.push(newCrop);
        showNotification('Crop added successfully!', 'success');
    }

    saveData(); // Save to localStorage
    renderCrops(); // Update UI
    closeCropModal();
}

// Render Crops
function renderCrops(filteredCrops = crops) {
    const tableBody = document.getElementById('cropTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (filteredCrops.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="no-results">
                    <i class="fas fa-seedling"></i>
                    <p>No crops found. Add crops to get started.</p>
                </td>
            </tr>
        `;
        return;
    }

    const fields = getFields();

    filteredCrops.forEach(crop => {
        const field = fields.find(f => f.id === crop.fieldId); // Get the field name for this crop
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.cropId}</td>
            <td>${crop.specialName}</td>
            <td>${crop.commonName}</td>
            <td>${crop.category}</td>
            <td>${field ? field.name : 'Unknown'}</td>
            <td>${crop.season}</td>
            <td>
               <div class="action-buttons">
                  <button onclick="openCropModal(${JSON.stringify(crop).replace(/"/g, '&quot;')})" class="edit-btn" title="Edit">
                     <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="deleteCrop('${crop.cropId}')" class="delete-btn" title="Delete">
                     <i class="fas fa-trash"></i>
                  </button>
                  <button onclick="viewCropDetails('${crop.cropId}')" class="view-btn" title="View Details">
                     <i class="fas fa-eye"></i>
                  </button>
               </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Crop Search
function initializeCropSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) {
        console.error("Search input element not found. Verify your HTML.");
        return;
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCrops = crops.filter(crop =>
            crop.specialName.toLowerCase().includes(searchTerm) ||
            crop.commonName.toLowerCase().includes(searchTerm) ||
            crop.category.toLowerCase().includes(searchTerm)
        );
        renderCrops(filteredCrops);
    });
}

// Delete Crop
function deleteCrop(cropId) {
    const index = crops.findIndex(crop => crop.cropId === cropId);

    if (confirm("Are you sure you want to delete this crop?") && index > -1) {
        crops.splice(index, 1); // Remove crop from array
        showNotification('Crop deleted successfully!', 'error');

        saveData(); // Save changes to localStorage
        renderCrops(); // Update UI
    }
}

// Notification Function
function showNotification(message, type) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// View Crop Details
function viewCropDetails(cropId) {
    const crop = crops.find(c => c.cropId === cropId);
    if (crop) {
        document.getElementById('viewCropId').textContent = crop.cropId;
        document.getElementById('viewSpecialName').textContent = crop.specialName;
        document.getElementById('viewCommonName').textContent = crop.commonName;
        document.getElementById('viewCategory').textContent = crop.category;
        document.getElementById('viewField').textContent = crop.fieldId;
        document.getElementById('viewSeason').textContent = crop.season;

        // Ensure the image is shown in the modal
        const imageElement = document.getElementById('viewCropImage');
        if (crop.image) {
            imageElement.src = crop.image;
            imageElement.style.display = 'block'; // Make the image visible
        } else {
            imageElement.style.display = 'none'; // Hide the image if none exists
        }

        // Show the modal
        document.getElementById('viewCropModal').style.display = 'block';
    }
}


// Close View Crop Modal
function closeViewCropModal() {
    document.getElementById('viewCropModal').style.display = 'none';
}


// Initialize on page load
window.onload = function () {
    loadData(); // Load saved data
    renderCrops(); // Render initial crops table
    initializeCropSearchBar(); // Setup search bar
};
