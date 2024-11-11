let equipmentData = [];
let staffData = [
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Smith'},
    {id: 3, name: 'Alan Turing'},
    {id: 4, name: 'Ada Lovelace'}
];

let fieldData = [
    {id: 1, name: 'Field A'},
    {id: 2, name: 'Field B'},
    {id: 3, name: 'Field C'}
];

// Function to populate the staff select dropdown with dummy data
function populateStaffOptions() {
    const staffSelect = document.getElementById('equipmentStaff');
    staffSelect.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Staff';
    staffSelect.appendChild(defaultOption);
    staffData.forEach(staff => {
        const option = document.createElement('option');
        option.value = staff.id;
        option.textContent = staff.name;
        staffSelect.appendChild(option);
    });
}

// Function to populate the field select dropdown with dummy data
function populateFieldOptions() {
    const fieldSelect = document.getElementById('equipmentField');
    fieldSelect.innerHTML = ''; // Clear existing options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Field';
    fieldSelect.appendChild(defaultOption);
    fieldData.forEach(field => {
        const option = document.createElement('option');
        option.value = field.id;
        option.textContent = field.name;
        fieldSelect.appendChild(option);
    });
}

function displayEquipmentData() {
    const equipmentContainer = document.getElementById('equipmentTableBody');
    equipmentContainer.innerHTML = ''; // Clear existing content

    equipmentData.forEach(equipment => {
        // Get staff name and field name based on IDs, if not found set "Not Assigned"
        const staff = staffData.find(staffMember => staffMember.id === parseInt(equipment.assignedStaff));
        const field = fieldData.find(fieldItem => fieldItem.id === parseInt(equipment.assignedField));

        const staffName = staff ? staff.name : 'Not Assigned';
        const fieldName = field ? field.name : 'Not Assigned';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${equipment.id}</td>
            <td>${equipment.name}</td>
            <td>${equipment.type}</td>
            <td>${equipment.status}</td>
            <td>${fieldName}</td>
            <td>${staffName}</td>
            <td>
                <button onclick="editEquipment(${equipment.id})" class="edit-btn">Edit</button>
                <button onclick="deleteEquipment(${equipment.id})" class="delete-btn">Delete</button>
            </td>
        `;
        equipmentContainer.appendChild(row);
    });
}

async function handleEquipmentFormSubmit(event) {
    event.preventDefault();

    const equipmentId = document.getElementById('equipmentId').value;
    const equipmentName = document.getElementById('equipmentName').value;
    const equipmentType = document.getElementById('equipmentType').value;
    const equipmentStatus = document.getElementById('equipmentStatus').value;
    const equipmentField = document.getElementById('equipmentField').value;
    const equipmentStaff = document.getElementById('equipmentStaff').value;

    const equipment = {
        id: equipmentId || Date.now(),
        name: equipmentName,
        type: equipmentType,
        status: equipmentStatus,
        assignedField: equipmentField,
        assignedStaff: equipmentStaff,
    };

    if (equipmentId) {
        // Update existing equipment
        equipmentData = equipmentData.map(equip => equip.id === equipment.id ? equipment : equip);
    } else {
        // Add new equipment
        equipmentData.push(equipment);
    }

    displayEquipmentData();
    closeEquipmentModal();
}

function editEquipment(id) {
    const equipment = equipmentData.find(equip => equip.id === id);
    if (equipment) {
        document.getElementById('equipmentId').value = equipment.id;
        document.getElementById('equipmentName').value = equipment.name;
        document.getElementById('equipmentType').value = equipment.type;
        document.getElementById('equipmentStatus').value = equipment.status;
        document.getElementById('equipmentField').value = equipment.assignedField;
        document.getElementById('equipmentStaff').value = equipment.assignedStaff;
        document.getElementById('modalTitle').textContent = 'Edit Equipment';
        openEquipmentModal();
    }
}

function deleteEquipment(id) {
    if (confirm('Are you sure you want to delete this equipment?')) {
        equipmentData = equipmentData.filter(equip => equip.id !== id);
        displayEquipmentData();
    }
}

function openEquipmentModal() {
    document.getElementById('equipmentModal').style.display = 'block';
}

function closeEquipmentModal() {
    document.getElementById('equipmentModal').style.display = 'none';
}

window.addEventListener('load', () => {
    populateStaffOptions();
    populateFieldOptions();
    displayEquipmentData();
});
