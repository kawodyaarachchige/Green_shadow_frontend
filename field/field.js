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
    const name = document.getElementById('fieldName').value;
    const location = document.getElementById('location').value;
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
             <button onclick="openFieldModal(${JSON.stringify(field).replace(/"/g, '&quot;')})" class="edit-btn">Edit</button>
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
})

let map;  // Declare map globally to ensure it's only initialized once.

function openFieldModal(editField = null) {
    const modal = document.getElementById('fieldModal');
    const modalTitle = document.getElementById('modalTitle');
    const fieldForm = document.getElementById('fieldForm');
    const locationInput = document.getElementById('location');

    fieldForm.reset();
    document.getElementById('fieldId').value = '';

    if (editField) {
        modalTitle.textContent = 'Edit Field';
        document.getElementById('fieldId').value = editField.id;
        document.getElementById('fieldName').value = editField.name;
        document.getElementById('location').value = editField.location;
        document.getElementById('fieldSize').value = editField.size;
        document.getElementById('fieldLog').value = editField.log;
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
