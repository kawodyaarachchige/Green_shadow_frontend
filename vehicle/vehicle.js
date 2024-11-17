// Vehicle Management JavaScript

// Mock data for initial testing
let vehicles = [
    {
        id: 'V001',
        licenseNumber: 'ABC123',
        category: 'Truck',
        fuelType: 'Diesel',
        status: 'AVAILABLE',
        staffId: 'S001',
        remark: 'Regular maintenance done'
    }
];

// Mock staff data
let staffList = [
    { id: 'S001', name: 'John Doe' },
    { id: 'S002', name: 'Jane Smith' }
];

// DOM Elements
const vehicleModal = document.getElementById('vehicleModal');
const vehicleForm = document.getElementById('vehicleForm');
const vehicleTableBody = document.getElementById('vehicleTableBody');
const searchInput = document.getElementById('vehicleSearch');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStaffList();
    renderVehicleTable();
    setupSearchListener();
});

// Load staff list into select dropdown
function loadStaffList() {
    const staffSelect = document.getElementById('staffIdOnVehicle');
    staffSelect.innerHTML = '<option value="">Select Staff</option>';
    staffList.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff.id;
        option.textContent = `${staff.id} - ${staff.name}`;
        staffSelect.appendChild(option);
    });
}

// Search functionality
function setupSearchListener() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVehicles = vehicles.filter(vehicle =>
            vehicle.licenseNumber.toLowerCase().includes(searchTerm) ||
            vehicle.category.toLowerCase().includes(searchTerm) ||
            vehicle.staffId.toLowerCase().includes(searchTerm)
        );
        renderVehicleTable(filteredVehicles);
    });
}

// Render vehicle table
function renderVehicleTable(vehiclesToRender = vehicles) {
    vehicleTableBody.innerHTML = '';
    vehiclesToRender.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${vehicle.licenseNumber}</td>
            <td>${vehicle.category}</td>
            <td>${vehicle.fuelType}</td>
            <td>${vehicle.status}</td>
            <td>${vehicle.staffId}</td>
            <td class="table-actions">
                <button onclick="editVehicle('${vehicle.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteVehicle('${vehicle.id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        vehicleTableBody.appendChild(row);
    });
}

// Open modal for adding new vehicle
function openVehicleModal() {
    document.getElementById('modalTitle').textContent = 'Add Vehicle';
    clearForm();
    vehicleModal.style.display = 'block';
}

// Close modal
function closeVehicleModal() {
    vehicleModal.style.display = 'none';
    clearForm();
}

// Clear form
function clearForm() {
    vehicleForm.reset();
    document.getElementById('vehicleId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Vehicle';
}

// Handle form submission
function handleVehicleFormSubmit(event) {
    event.preventDefault();

    const vehicleId = document.getElementById('vehicleId').value;
    const vehicle = {
        id: vehicleId || `V${String(vehicles.length + 1).padStart(3, '0')}`,
        licenseNumber: document.getElementById('licenNo').value,
        category: document.getElementById('category').value,
        fuelType: document.getElementById('fuelType').value,
        status: document.getElementById('vehicleStatus').value,
        staffId: document.getElementById('staffIdOnVehicle').value,
        remark: document.getElementById('remark').value
    };

    if (vehicleId) {
        // Update existing vehicle
        const index = vehicles.findIndex(v => v.id === vehicleId);
        vehicles[index] = vehicle;
    } else {
        // Add new vehicle
        vehicles.push(vehicle);
    }

    renderVehicleTable();
    closeVehicleModal();
    showNotification(vehicleId ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
}

// Edit vehicle
function editVehicle(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
        document.getElementById('vehicleId').value = vehicle.id;
        document.getElementById('licenNo').value = vehicle.licenseNumber;
        document.getElementById('category').value = vehicle.category;
        document.getElementById('fuelType').value = vehicle.fuelType;
        document.getElementById('vehicleStatus').value = vehicle.status;
        document.getElementById('staffIdOnVehicle').value = vehicle.staffId;
        document.getElementById('remark').value = vehicle.remark;

        document.getElementById('modalTitle').textContent = 'Edit Vehicle';
        vehicleModal.style.display = 'block';
    }
}

// Delete vehicle
function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        vehicles = vehicles.filter(vehicle => vehicle.id !== id);
        renderVehicleTable();
        showNotification('Vehicle deleted successfully!');
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === vehicleModal) {
        closeVehicleModal();
    }
}

// Handle menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});