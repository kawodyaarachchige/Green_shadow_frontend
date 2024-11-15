// Initialize map for selecting vehicle location
let map, marker;
function initMap() {
    map = L.map('vehicleMap').setView([51.505, -0.09], 13); // Default location
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        document.getElementById('vehicleLocation').value = `Lat: ${lat}, Lng: ${lng}`;

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([lat, lng]).addTo(map);
    });
}

document.addEventListener('DOMContentLoaded', initMap);

// Function to open the Add/Edit Vehicle modal
function openVehicleModal() {
    document.getElementById('vehicleModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Add Vehicle';
}

// Function to close the Vehicle modal
function closeVehicleModal() {
    document.getElementById('vehicleModal').style.display = 'none';
}

// Handle form submission
function handleVehicleFormSubmit(event) {
    event.preventDefault();

    const vehicleData = {
        id: document.getElementById('vehicleId').value,
        name: document.getElementById('vehicleName').value,
        location: document.getElementById('vehicleLocation').value,
        type: document.getElementById('vehicleType').value,
        status: document.getElementById('vehicleStatus').value,
        log: document.getElementById('vehicleLog').value,
    };

    // Add or update vehicle entry
    if (vehicleData.id) {
        updateVehicle(vehicleData);
    } else {
        addVehicle(vehicleData);
    }

    closeVehicleModal();
}

// Sample function to add a vehicle (could be replaced with backend logic)
function addVehicle(vehicleData) {
    const vehicleTableBody = document.getElementById('vehicleTableBody');
    const row = vehicleTableBody.insertRow();

    row.innerHTML = `
        <td>${vehicleData.id}</td>
        <td>${vehicleData.name}</td>
        <td>${vehicleData.location}</td>
        <td>${vehicleData.type}</td>
        <td>${vehicleData.status}</td>
        <td>${vehicleData.log}</td>
        <td>
            <button onclick="editVehicle(${vehicleData.id})">Edit</button>
            <button onclick="deleteVehicle(${vehicleData.id})">Delete</button>
        </td>
    `;
}

// Preview image functions
function previewVehicleImage1(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('vehicleImagePreview1');
        preview.src = reader.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function previewVehicleImage2(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('vehicleImagePreview2');
        preview.src = reader.result;
        preview.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Function to edit a vehicle
function editVehicle(id) {
    // Fetch data and populate modal fields
    document.getElementById('modalTitle').textContent = 'Edit Vehicle';
    openVehicleModal();
    // Populate fields with existing data for the selected vehicle
    // Example:
    document.getElementById('vehicleId').value = id; // Replace with actual data retrieval
}

// Function to delete a vehicle
function deleteVehicle(id) {
    // Remove vehicle row (or call backend to delete)
    const row = document.querySelector(`#vehicleTableBody tr[data-id="${id}"]`);
    if (row) row.remove();
}

// Handle 'View More' modal for vehicle details
function openViewVehicleModal(vehicle) {
    document.getElementById('viewVehicleId').textContent = vehicle.id;
    document.getElementById('viewVehicleName').textContent = vehicle.name;
    document.getElementById('viewVehicleLocation').textContent = vehicle.location;
    document.getElementById('viewVehicleType').textContent = vehicle.type;
    document.getElementById('viewVehicleStatus').textContent = vehicle.status;
    document.getElementById('viewVehicleLog').textContent = vehicle.log;

    document.getElementById('viewVehicleImage1').src = vehicle.image1;
    document.getElementById('viewVehicleImage1').style.display = 'block';

    document.getElementById('viewVehicleImage2').src = vehicle.image2;
    document.getElementById('viewVehicleImage2').style.display = 'block';

    document.getElementById('viewVehicleModal').style.display = 'block';
}

// Close 'View More' modal
function closeViewVehicleModal() {
    document.getElementById('viewVehicleModal').style.display = 'none';
}
