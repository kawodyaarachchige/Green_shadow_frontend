let fields = [];

function closeFieldModal() {
    document.getElementById('fieldModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    renderFields();
    updateDateTime();
});

function handleFieldFormSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('fieldId').value;
    const name = document.getElementById('fieldName').value.trim();
    const location = document.getElementById('location').value.trim();
    const size = document.getElementById('fieldSize').value.trim();
    const log = document.getElementById('fieldLog').value.trim();
    const image1File = document.getElementById('fieldImage').files[0];
    const image2File = document.getElementById('fieldImage2').files[0];

    // Validation
    const nameRegex = /^[a-zA-Z\s]{3,}$/; // Name should have at least 3 letters
    const locationRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/; // Latitude, Longitude format
    const sizeRegex = /^\d+(\.\d{1,2})?$/; // Allow positive numbers with up to 2 decimal places

    if (!nameRegex.test(name)) {
        alert('Invalid name: Only letters and spaces, with at least 3 characters');
        return;
    }

    if (!locationRegex.test(location)) {
        alert('Invalid location: Please enter latitude and longitude in the format "lat, lng"');
        return;
    }

    if (!sizeRegex.test(size)) {
        alert('Invalid size: Please enter a positive number, optionally with up to two decimal places');
        return;
    }

    const newField = {
        id: id || Date.now().toString(),
        name,
        location,
        size,
        log,
        image1: '',
        image2: ''
    };

    // Convert image files to data URLs if available
    if (image1File) {
        const reader1 = new FileReader();
        reader1.onload = function (e) {
            newField.image1 = e.target.result;
            saveOrUpdateField(newField);
        };
        reader1.readAsDataURL(image1File);
    } else {
        saveOrUpdateField(newField);
    }

    if (image2File) {
        const reader2 = new FileReader();
        reader2.onload = function (e) {
            newField.image2 = e.target.result;
            saveOrUpdateField(newField);
        };
        reader2.readAsDataURL(image2File);
    } else {
        saveOrUpdateField(newField);
    }
}

function saveOrUpdateField(field) {
    const existingIndex = fields.findIndex(f => f.id === field.id);

    if (existingIndex > -1) {
        // Update existing field
        fields[existingIndex] = field;
    } else {
        // Add new field
        fields.push(field);
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
             <button onclick="openFieldModal(${JSON.stringify(field).replace(/"/g, '&quot;')})" class="edit-btn">Edit</button>
                <button onclick="deleteField('${field.id}')" class="delete-btn">Delete</button>
                <button onclick="viewMore('${field.id}')" class="view-btn">View</button>
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

function viewMore(id) {
    const field = fields.find(field => field.id === id);

    document.getElementById('viewFieldId').textContent = field.id;
    document.getElementById('viewFieldName').textContent = field.name;
    document.getElementById('viewFieldLocation').textContent = field.location;
    document.getElementById('viewFieldSize').textContent = field.size;
    document.getElementById('viewFieldLog').textContent = field.log;

    const imagePreview1 = document.getElementById('viewFieldImage1');
    const imagePreview2 = document.getElementById('viewFieldImage2');

    if (field.image1) {
        imagePreview1.src = field.image1;
        imagePreview1.style.display = 'block';
    } else {
        imagePreview1.style.display = 'none';
    }

    if (field.image2) {
        imagePreview2.src = field.image2;
        imagePreview2.style.display = 'block';
    } else {
        imagePreview2.style.display = 'none';
    }

    document.getElementById('viewMoreModal').style.display = 'block';
}

function closeViewMoreModal() {
    document.getElementById('viewMoreModal').style.display = 'none';
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
})

let map;  // Declare map globally to ensure it's only initialized once.

function openFieldModal(editField = null) {
    const modal = document.getElementById('fieldModal');
    const modalTitle = document.getElementById('modalTitle');
    const fieldForm = document.getElementById('fieldForm');
    const locationInput = document.getElementById('location');

    const image1Input = document.getElementById('image1');
    const image2Input = document.getElementById('image2');

    fieldForm.reset();
    document.getElementById('fieldId').value = '';

    if (editField) {
        modalTitle.textContent = 'Edit Field';
        document.getElementById('fieldId').value = editField.id;
        document.getElementById('fieldName').value = editField.name;
        document.getElementById('location').value = editField.location;
        document.getElementById('fieldSize').value = editField.size;
        document.getElementById('fieldLog').value = editField.log;
        document.getElementById('imagePreview1').src = editField.image1;
        document.getElementById('imagePreview2').src = editField.image2;

    } else {
        modalTitle.textContent = 'Add Field';
    }

    modal.style.display = 'block';

    if (!map) {
        map = L.map('map').setView([7.8731, 80.7718], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    }

    let marker;
    map.on('click', function (e) {
        const {lat, lng} = e.latlng;
        locationInput.value = `${lat.toFixed(5)},  ${lng.toFixed(5)}`;
        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }
    });
}

function previewImage1(event) {
    const fileInput = event.target;
    const preview = document.getElementById('imagePreview1');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // Show the preview
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

function previewImage2(event) {
    const fileInput = event.target;
    const preview = document.getElementById('imagePreview2');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // Show the preview
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}


