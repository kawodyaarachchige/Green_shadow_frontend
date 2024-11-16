// Data storage
let staffData = [];

// Initialize data and event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    displayStaffData();
    initializeSearch();
});

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredStaff = staffData.filter(staff =>
            `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchTerm) ||
            staff.email.toLowerCase().includes(searchTerm) ||
            staff.designation.toLowerCase().includes(searchTerm)
        );
        displayStaffData(filteredStaff);
    });
}

// Load saved data from localStorage
function loadSavedData() {
    const savedStaffData = localStorage.getItem('staffData');
    if (savedStaffData) {
        staffData = JSON.parse(savedStaffData);
    }
}

// Display staff data in table
function displayStaffData(dataToDisplay = staffData) {
    const tableBody = document.getElementById('staffTableBody');
    tableBody.innerHTML = '';

    if (dataToDisplay.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center">
                <i class="fas fa-users"></i>
                <p>No staff members found</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }

    dataToDisplay.forEach(staff => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${staff.id}</td>
            <td>${staff.firstName} ${staff.lastName}</td>
            <td>${staff.designation}</td>
            <td>${staff.contactNumber}</td>
            <td>${staff.email}</td>
            <td>${staff.role}</td>
            <td>
                <button onclick="editStaff('${staff.id}')" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteStaff('${staff.id}')" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Handle form submission
function handleStaffFormSubmit(event) {
    event.preventDefault();

    const formData = {
        id: document.getElementById('staffId').value || Date.now().toString(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        designation: document.getElementById('designation').value,
        gender: document.getElementById('gender').value,
        joinDate: document.getElementById('joinDate').value,
        dob: document.getElementById('dob').value,
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        addressLine3: document.getElementById('addressLine3').value,
        addressLine4: document.getElementById('addressLine4').value,
        addressLine5: document.getElementById('addressLine5').value,
        contactNumber: document.getElementById('contactNumber').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value
    };

    if (document.getElementById('staffId').value) {
        // Update existing staff
        const index = staffData.findIndex(s => s.id === formData.id);
        if (index !== -1) {
            staffData[index] = formData;
        }
    } else {
        // Add new staff
        staffData.push(formData);
    }

    saveAndRefresh();
    closeStaffModal();
}

// Edit staff
function editStaff(id) {
    const staff = staffData.find(s => s.id === id);
    if (staff) {
        document.getElementById('modalTitle').textContent = 'Edit Staff';
        document.getElementById('staffId').value = staff.id;
        document.getElementById('firstName').value = staff.firstName;
        document.getElementById('lastName').value = staff.lastName;
        document.getElementById('designation').value = staff.designation;
        document.getElementById('gender').value = staff.gender;
        document.getElementById('joinDate').value = staff.joinDate;
        document.getElementById('dob').value = staff.dob;
        document.getElementById('addressLine1').value = staff.addressLine1;
        document.getElementById('addressLine2').value = staff.addressLine2;
        document.getElementById('addressLine3').value = staff.addressLine3;
        document.getElementById('addressLine4').value = staff.addressLine4;
        document.getElementById('addressLine5').value = staff.addressLine5;
        document.getElementById('contactNumber').value = staff.contactNumber;
        document.getElementById('email').value = staff.email;
        document.getElementById('role').value = staff.role;

        openStaffModal();
    }
}

// Delete staff
function deleteStaff(id) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        staffData = staffData.filter(s => s.id !== id);
        saveAndRefresh();
    }
}

/*// View staff details
function viewStaffDetails(id) {
    const staff = staffData.find(s => s.id === id);
    if (staff) {
        alert(`
            Staff Details:
            Name: ${staff.firstName} ${staff.lastName}
            Designation: ${staff.designation}
            Gender: ${staff.gender}
            Join Date: ${staff.joinDate}
            DOB: ${staff.dob}
            Address: 
            ${staff.addressLine1}
            ${staff.addressLine2}
            ${staff.addressLine3}
            ${staff.addressLine4}
            ${staff.addressLine5}
            Contact: ${staff.contactNumber}
            Email: ${staff.email}
            Role: ${staff.role}
        `);
    }
}*/

// Save data and refresh display
function saveAndRefresh() {
    localStorage.setItem('staffData', JSON.stringify(staffData));
    displayStaffData();
}

// Modal functions
function openStaffModal() {
    document.getElementById('staffModal').style.display = 'block';
}

function closeStaffModal() {
    const form = document.getElementById('staffForm');
    form.reset();
    document.getElementById('staffId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Staff';
    document.getElementById('staffModal').style.display = 'none';
}

// Initialize sidebar toggle functionality
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
});