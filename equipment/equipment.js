// Data storage
let equipmentData = [];
let fieldData = [];
const staffData = [
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Smith'},
    {id: 3, name: 'Alan Turing'},
    {id: 4, name: 'Ada Lovelace'}
];

// Initialize data and event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    populateDropdowns();
    displayEquipmentData();
});

// Load saved data from localStorage
function loadSavedData() {
    // Load equipment data
    const savedEquipmentData = localStorage.getItem('equipmentData');
    if (savedEquipmentData) {
        equipmentData = JSON.parse(savedEquipmentData);
    }

    // Load field data
    const savedFieldData = localStorage.getItem('fields');
    if (savedFieldData) {
        fieldData = JSON.parse(savedFieldData);
    }
}

// Populate all dropdowns
function populateDropdowns() {
    populateFieldOptions();
    populateStaffOptions();
}

// Populate field options with current selection maintained
function populateFieldOptions() {
    const fieldSelect = document.getElementById('equipmentField');
    const currentValue = fieldSelect.value;

    fieldSelect.innerHTML = '<option value="">Select Field</option>';

    fieldData.forEach(field => {
        const option = document.createElement('option');
        option.value = field.id;
        option.textContent = field.name;

        if (currentValue && field.id === currentValue) {
            option.selected = true;
        }

        fieldSelect.appendChild(option);
    });
}

// Populate staff options
function populateStaffOptions() {
    const staffSelect = document.getElementById('equipmentStaff');
    const currentValue = staffSelect.value;

    staffSelect.innerHTML = '<option value="">Select Staff</option>';

    staffData.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff.id;
        option.textContent = staff.name;

        if (currentValue && parseInt(currentValue) === staff.id) {
            option.selected = true;
        }

        staffSelect.appendChild(option);
    });
}

// Display equipment data in table
function displayEquipmentData() {
    const tableBody = document.getElementById('equipmentTableBody');
    tableBody.innerHTML = '';

    if (equipmentData.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="7" class="text-center">No equipment found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    equipmentData.forEach(equipment => {
        const staff = staffData.find(s => s.id === parseInt(equipment.assignedStaff));
        const field = fieldData.find(f => f.id === equipment.assignedField);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.id}</td>
            <td>${equipment.name}</td>
            <td>${equipment.type}</td>
            <td>${equipment.status}</td>
            <td>${field ? field.name : 'Not Assigned'}</td>
            <td>${staff ? staff.name : 'Not Assigned'}</td>
            <td>
                <button onclick="editEquipment('${equipment.id}')" class="edit-btn">
                    <i class="fas fa-pencil-alt"></i></button>
                <button onclick="deleteEquipment('${equipment.id}')" class="delete-btn">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle form submission
function handleEquipmentFormSubmit(event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById('equipmentId').value || String(Date.now()),
        name: document.getElementById('equipmentName').value,
        type: document.getElementById('equipmentType').value,
        status: document.getElementById('equipmentStatus').value,
        assignedField: document.getElementById('equipmentField').value,
        assignedStaff: document.getElementById('equipmentStaff').value
    };

    if (document.getElementById('equipmentId').value) {
        // Update existing equipment
        const index = equipmentData.findIndex(e => e.id === formData.id);
        if (index !== -1) {
            equipmentData[index] = formData;
        }
    } else {
        // Add new equipment
        equipmentData.push(formData);
    }

    saveAndRefresh();
    closeEquipmentModal();
}

// Edit equipment
function editEquipment(id) {
    const equipment = equipmentData.find(e => e.id === id);
    if (equipment) {
        document.getElementById('modalTitle').textContent = 'Edit Equipment';
        document.getElementById('equipmentId').value = equipment.id;
        document.getElementById('equipmentName').value = equipment.name;
        document.getElementById('equipmentType').value = equipment.type;
        document.getElementById('equipmentStatus').value = equipment.status;

        // Set field and staff values and ensure options are populated
        populateDropdowns();

        // Set the selected values after populating dropdowns
        document.getElementById('equipmentField').value = equipment.assignedField;
        document.getElementById('equipmentStaff').value = equipment.assignedStaff;

        openEquipmentModal();
    }
}

// Delete equipment
function deleteEquipment(id) {
    if (confirm('Are you sure you want to delete this equipment?')) {
        equipmentData = equipmentData.filter(e => e.id !== id);
        saveAndRefresh();
    }
}

// Save data and refresh display
function saveAndRefresh() {
    localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
    displayEquipmentData();
}

// Modal functions
function openEquipmentModal() {
    document.getElementById('equipmentModal').style.display = 'block';
    populateDropdowns(); // Ensure dropdowns are populated when opening modal
}

function closeEquipmentModal() {
    const form = document.getElementById('equipmentForm');
    form.reset();
    document.getElementById('equipmentId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Equipment';
    document.getElementById('equipmentModal').style.display = 'none';
}

// Add storage event listener to update fields when they change
window.addEventListener('storage', (e) => {
    if (e.key === 'fields') {
        fieldData = JSON.parse(e.newValue || '[]');
        populateFieldOptions();
        displayEquipmentData(); // Refresh display to show updated field names
    }
});