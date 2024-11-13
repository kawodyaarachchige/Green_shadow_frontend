let fieldData = [];
let map;
let marker;

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie("token");
    loadFieldTable(token);
    loadLogSelector(token);
    initializeMap();
    initializeSearch();
});

// Map Functions
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

function setLocation(lat, lng) {
    if (map) {
        map.setView([lat, lng], 13);
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([lat, lng]).addTo(map);
    }
}

function clearMarker() {
    if (marker) {
        map.removeLayer(marker);
    }
}

// Image Functions
function previewImage1(event) {
    const preview = document.getElementById('imagePreview1');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function previewImage2(event) {
    const preview = document.getElementById('imagePreview2');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function clearImagePreviews() {
    const preview1 = document.getElementById('imagePreview1');
    const preview2 = document.getElementById('imagePreview2');
    preview1.src = '';
    preview2.src = '';
    preview1.style.display = 'none';
    preview2.style.display = 'none';
}

// API Functions
const loadLogSelector = (token) => {
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/logs",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: (logs) => {
            const logSelector = document.getElementById('fieldLog');
            logSelector.innerHTML = '';

            logs.forEach(log => {
                const option = document.createElement('option');
                option.value = log.logCode;
                option.textContent = log.logDetails;
                logSelector.appendChild(option);
            });
        },
        error: (error) => {
            console.error('Error loading logs:', error);
            showNotification('Failed to load logs', 'error');
        }
    });
};

function handleFieldFormSubmit(event) {
    event.preventDefault();
    const token = getCookie("token");
    const fieldCode = document.getElementById('fieldId').value;

    const fieldData = {
        fieldName: document.getElementById('fieldName').value,
        location: document.getElementById('location').value,
        extentSize: document.getElementById('fieldSize').value,
        logCode: document.getElementById('fieldLog').value
    };

    if (!fieldData.fieldName || !fieldData.location || !fieldData.extentSize || !fieldData.logCode) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (fieldCode) {
        updateField(token, fieldCode, fieldData);
    } else {
        saveField(token, fieldData);
    }
}

function saveField(token, fieldData) {
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/fields",
        type: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(fieldData),
        success: async () => {
            await handleImageUpload(token, fieldData.fieldCode);
            showNotification('Field saved successfully', 'success');
            closeFieldModal();
            loadFieldTable(token);
        },
        error: (error) => {
            console.error('Error saving field:', error);
            showNotification('Failed to save field', 'error');
        }
    });
}

function updateField(token, fieldCode, fieldData) {
    $.ajax({
        url: `http://localhost:8089/gs/api/v1/fields/${fieldCode}`,
        type: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(fieldData),
        success: async () => {
            await handleImageUpload(token, fieldCode);
            showNotification('Field updated successfully', 'success');
            closeFieldModal();
            loadFieldTable(token);
        },
        error: (error) => {
            console.error('Error updating field:', error);
            showNotification('Failed to update field', 'error');
        }
    });
}

async function handleImageUpload(token, fieldCode) {
    const image1 = document.getElementById('fieldImage').files[0];
    const image2 = document.getElementById('fieldImage2').files[0];

    if (image1 && image2) {
        const formData = new FormData();
        formData.append('fieldCode', fieldCode);
        formData.append('image1', image1);
        formData.append('image2', image2);

        try {
            await $.ajax({
                url: "http://localhost:8089/gs/api/v1/fields",
                type: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data: formData,
                processData: false,
                contentType: false
            });
        } catch (error) {
            console.error('Error uploading images:', error);
            showNotification('Failed to upload images', 'error');
        }
    }
}

function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFields = fieldData.filter(field =>
            field.location.toLowerCase().includes(searchTerm) ||
            field.fieldName.toLowerCase().includes(searchTerm)
        );
        displayFieldData(filteredFields);
    });
}

function loadFieldTable(token) {
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/fields",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            fieldData = data;
            displayFieldData(data);
        },
        error: (error) => {
            console.error('Error loading fields:', error);
            showNotification('Failed to load fields', 'error');
        }
    });
}

function displayFieldData(dataToDisplay = fieldData) {
    const tableBody = document.getElementById('fieldTableBody');
    tableBody.innerHTML = '';

    if (dataToDisplay.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="text-center">
                <i class="fas fa-map-marked-alt"></i>
                <p>No fields found</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }

    dataToDisplay.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${field.fieldCode}</td>
            <td>${field.fieldName}</td>
            <td>${field.fieldLocation}</td>
            <td>${field.extentSizeOfField}</td>
            <td>${field.logCode}</td>
            <td class="action-buttons">
                <button class="action-btn view-btn" onclick="viewFieldDetails('${field.fieldCode}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" onclick="editField('${field.fieldCode}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteField('${field.fieldCode}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteField(fieldCode) {
    const token = getCookie("token");
    $.ajax({
        url: `http://localhost:8089/gs/api/v1/fields/${fieldCode}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: () => {
            showNotification('Field deleted successfully', 'success');
            loadFieldTable(token);
        },
        error: (error) => {
            console.error('Error deleting field:', error);
            showNotification('Failed to delete field', 'error');
        }
    });
}

function editField(fieldCode) {
    const field = fieldData.find(f => f.fieldCode === fieldCode);
    if (field) {
        openFieldModal();
        document.getElementById('fieldId').value = field.fieldCode;
        document.getElementById('fieldName').value = field.fieldName;
        document.getElementById('location').value = field.fieldLocation;
        document.getElementById('fieldSize').value = field.extentSizeOfField;
        document.getElementById('fieldLog').value = field.logCode;

        const [lat, lng] = field.fieldLocation.split(',').map(coord => parseFloat(coord.trim()));
        setLocation(lat, lng);

        document.getElementById('modalTitle').textContent = 'Edit Field';
    }
}

function viewFieldDetails(fieldCode) {
    const field = fieldData.find(f => f.fieldCode === fieldCode);
    if (field) {
        document.getElementById('viewFieldId').textContent = field.fieldCode;
        document.getElementById('viewFieldName').textContent = field.fieldName;
        document.getElementById('viewFieldLocation').textContent = field.location;
        document.getElementById('viewFieldSize').textContent = field.extentSize;
        document.getElementById('viewFieldLog').textContent = field.logCode;

        if (field.image1) {
            const img1 = document.getElementById('viewFieldImage1');
            img1.src = `data:image/jpeg;base64,${field.image1}`;
            img1.style.display = 'block';
        }

        if (field.image2) {
            const img2 = document.getElementById('viewFieldImage2');
            img2.src = `data:image/jpeg;base64,${field.image2}`;
            img2.style.display = 'block';
        }

        document.getElementById('viewMoreModal').style.display = 'block';
    }
}

function openFieldModal() {
    const modal = document.getElementById('fieldModal');
    modal.style.display = 'block';

    if (!document.getElementById('fieldId').value) {
        document.getElementById('modalTitle').textContent = 'Add Field';
        clearForm();
    }
}

function closeFieldModal() {
    document.getElementById('fieldModal').style.display = 'none';
    clearForm();
}

function closeViewMoreModal() {
    document.getElementById('viewMoreModal').style.display = 'none';
}

function clearForm() {
    document.getElementById('fieldId').value = '';
    document.getElementById('fieldName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('fieldSize').value = '';
    document.getElementById('fieldLog').value = '';
    document.getElementById('fieldImage').value = '';
    document.getElementById('fieldImage2').value = '';
    clearImagePreviews();
    clearMarker();
}


window.handleFieldFormSubmit = handleFieldFormSubmit;
window.editField = editField;
window.deleteField = deleteField;
window.viewFieldDetails = viewFieldDetails;
window.openFieldModal = openFieldModal;
window.closeFieldModal = closeFieldModal;
window.closeViewMoreModal = closeViewMoreModal;
window.previewImage1 = previewImage1;
window.previewImage2 = previewImage2;