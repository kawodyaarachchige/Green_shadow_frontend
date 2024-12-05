let staffData = [];
document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie("token");
    const userLoggedIn = getCookie("user");
    loadStaffTable(token)
    loadFieldSelector(token);

    loadLogSelector(token);


    const btnSaveStaff = document.getElementById("btn-save-staff");
    if (btnSaveStaff) {
        btnSaveStaff.addEventListener("click", () => {
            if (document.getElementById("staffId").value === "") {
                saveNewStaff(token);
            } else {
                updateStaff(token);
            }

        });
        displayStaffData();
        initializeSearch();
    }

});
const loadLogSelector = (token) => {
    const logSelector = document.getElementById("logIdStaff");

    $.ajax({
        url: "http://localhost:8089/gs/api/v1/logs",
        type: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            data.forEach((log) => {
                const option = document.createElement("option");
                option.value = log.logCode;
                option.textContent = log.logDetails;
                logSelector.appendChild(option);
            });
        },
        error: (error) => {
            console.log("Something went wrong:", error);
        }
    });
}
const loadFieldSelector = (token) => {
    const fieldSelector = document.getElementById("fieldIdOnStaff");
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/fields",
        type: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            data.forEach((field) => {
                const option = document.createElement("option");
                option.value = field.fieldCode;
                option.textContent = field.fieldName;
                fieldSelector.appendChild(option);
            });
        },
        error: (error) => {
            console.log("Something went wrong:", error);
        }
    });
}
const saveNewStaff = (token) => {

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const designation = document.getElementById("designation").value;
    const gender = document.getElementById("gender").value;
    const joinedDate = document.getElementById("joinDate").value;
    const dob = document.getElementById("dob").value;
    const addressLine1 = document.getElementById("addressLine1").value;
    const addressLine2 = document.getElementById("addressLine2").value;
    const addressLine3 = document.getElementById("addressLine3").value;
    const addressLine4 = document.getElementById("addressLine4").value;
    const addressLine5 = document.getElementById("addressLine5").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const logCode = document.getElementById("logIdStaff").value;
    const fieldCode = document.getElementById("fieldIdOnStaff").value;
    if (!firstName || !lastName || !designation || !gender || !joinedDate || !dob || !addressLine1 || !addressLine2 || !addressLine3 || !addressLine4 || !addressLine5 || !contactNumber || !email || !role) {
        showNotification("Please fill in all required fields", "error");
    }

    const staffModel = {
        firstName,
        lastName,
        designation,
        gender,
        joinedDate,
        dob,
        addressLine1,
        addressLine2,
        addressLine3,
        addressLine4,
        addressLine5,
        contactNumber,
        email,
        role,
        logCode
    }
    console.log(staffModel)

    $.ajax({
        url: "http://localhost:8089/gs/api/v1/staff",
        type: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(staffModel),
        success: (response) => {
            assignFieldToStaff(response.staffId,fieldCode, token)
            showNotification("Staff member saved successfully", "success");
            closeStaffModal();
            loadStaffTable(token);
        },
        error: (error) => {
            showNotification(error.responseText);
            console.log("Something went wrong:", error.responseText);
        }
    });
}
const assignFieldToStaff = (staffId, fieldCode, token) => {
    const asignnedField = document.getElementById("fieldIdOnStaff").value;
    if(asignnedField){
       const formData = new FormData();
        formData.append("staffId", staffId);
        formData.append("fieldCode", fieldCode);

        $.ajax({
            url: `http://localhost:8089/gs/api/v1/staff`,
            type: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            contentType: false,
            processData: false,
            data: formData,
            success: () => {
                console.log("Field assigned successfully");
            },
            error: (error) => {
                showNotification(error.responseText);
                console.log("Something went wrong:", error.responseText);
            }
        });
    }
}
const updateStaff = (token) => {
    const staffId = document.getElementById("staffId").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const designation = document.getElementById("designation").value;
    const gender = document.getElementById("gender").value;
    const joinedDate = document.getElementById("joinDate").value;
    const dob = document.getElementById("dob").value;
    const addressLine1 = document.getElementById("addressLine1").value;
    const addressLine2 = document.getElementById("addressLine2").value;
    const addressLine3 = document.getElementById("addressLine3").value;
    const addressLine4 = document.getElementById("addressLine4").value;
    const addressLine5 = document.getElementById("addressLine5").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const logCode = document.getElementById("logIdStaff").value;
    const fieldCode = document.getElementById("fieldIdOnStaff").value;
    if (!firstName || !lastName || !designation || !gender || !joinedDate || !dob || !addressLine1 || !addressLine2 || !addressLine3 || !addressLine4 || !addressLine5 || !contactNumber || !email || !role) {
        showNotification("Please fill in all required fields", "info");

    }
    $.ajax({
        url: `http://localhost:8089/gs/api/v1/staff/${staffId}`,
        type: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify({
            firstName,
            lastName,
            designation,
            gender,
            joinedDate,
            dob,
            addressLine1,
            addressLine2,
            addressLine3,
            addressLine4,
            addressLine5,
            contactNumber,
            email,
            role,
            logCode
        }),
        success: (data) => {
            assignFieldToStaff(staffId,fieldCode, token);
            showNotification("Staff member updated successfully", "success");
            closeStaffModal();
            loadStaffTable(token);
        },
        error: (error) => {
            showNotification(error.responseText);
            console.log("Something went wrong:", error.responseText);
        }
    });
}

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

const loadStaffTable = (token) => {
    clearFields();
    const staffTable = document.getElementById('staffTableBody');
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/staff",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            staffData = data;
            displayStaffData(data);
        },
        error: (error) => {
            console.log("Something went wrong:", error);
        }
    });
}

function displayStaffData(dataToDisplay = staffData) {
    const tableBody = document.getElementById('staffTableBody');
    tableBody.innerHTML = '';

    $('.staff-table').DataTable().destroy();
    $('#staffTableBody').empty();

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
            <td title="${staff.id}">${getFriendlyStaffId(staff.id)}</td>
            <td>${staff.firstName} ${staff.lastName}</td>
            <td>${staff.designation}</td>
            <td>${staff.contactNumber}</td>
            <td>${staff.email}</td>
            <td>${staff.role}</td>
        `;

        const actionCell = document.createElement("td");
        actionCell.className = "action-buttons";

        const editButton = document.createElement("button");
        editButton.className = "action-btn edit-btn";
        editButton.innerHTML = `<i class="fas fa-edit"></i>`;
        editButton.onclick = () => editStaff(staff.id, staff.firstName, staff.lastName, staff.designation, staff.gender, staff.joinedDate, staff.dob, staff.addressLine1, staff.addressLine2, staff.addressLine3, staff.addressLine4, staff.addressLine5, staff.contactNumber, staff.email, staff.role);

        const deleteButton = document.createElement("button");
        deleteButton.className = "action-btn delete-btn";
        deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
        deleteButton.onclick = () => deleteStaff(staff.id);

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    new DataTable('.staff-table', {paging: false, pageLength: 10, responsive: true, destroy: true});
}

function deleteStaff(staffId) {
    console.log(staffId)
    const token = getCookie("token");
    $.ajax({
        url: `http://localhost:8089/gs/api/v1/staff/${staffId}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: () => {
            showNotification("Staff member deleted successfully", "success");
            loadStaffTable(token);
        },
        error: (error) => {
            showNotification(error.responseText);
            console.log("Something went wrong:", error.responseText);
        }
    });
}

function editStaff(staffId, firstName, lastName, designation, gender, joinedDate, dob, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contactNumber, email, role) {
    openStaffModal(staffId, firstName, lastName, designation, gender, joinedDate, dob, addressLine1, addressLine2, addressLine3, addressLine4, addressLine5, contactNumber, email, role);
}

function openStaffModal(
    staffId = null,
    firstName = '',
    lastName = '',
    designation = '',
    gender = '',
    joinDate = '',
    dob = '',
    addressLine1 = '',
    addressLine2 = '',
    addressLine3 = '',
    addressLine4 = '',
    addressLine5 = '',
    contactNumber = '',
    email = '',
    role = ''
) {
    const modal = document.getElementById('staffModal');
    const form = document.getElementById('staffForm');
    const titleElement = modal.querySelector('h2');

    if (staffId) {
        // Edit existing staff
        titleElement.textContent = 'Edit Staff';
        document.getElementById('staffId').value = staffId;
        document.getElementById('firstName').value = firstName;
        document.getElementById('lastName').value = lastName;
        document.getElementById('designation').value = designation;
        document.getElementById('gender').value = gender;
        document.getElementById('joinDate').value = joinDate;
        document.getElementById('dob').value = dob;
        document.getElementById('addressLine1').value = addressLine1;
        document.getElementById('addressLine2').value = addressLine2;
        document.getElementById('addressLine3').value = addressLine3;
        document.getElementById('addressLine4').value = addressLine4;
        document.getElementById('addressLine5').value = addressLine5;
        document.getElementById('contactNumber').value = contactNumber;
        document.getElementById('email').value = email;
        document.getElementById('role').value = role;
    } else {
        titleElement.textContent = 'Add New Staff';
        form.reset();
        document.getElementById('staffId').value = '';
    }
    modal.style.display = 'block';
}
function closeStaffModal() {
    document.getElementById('staffModal').style.display = 'none';
}



const clearFields = () => {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("designation").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("joinDate").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("addressLine1").value = "";
    document.getElementById("addressLine2").value = "";
    document.getElementById("addressLine3").value = "";
    document.getElementById("addressLine4").value = "";
    document.getElementById("addressLine5").value = "";
    document.getElementById("contactNumber").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "";
    document.getElementById("logIdStaff").value = "";
}


function getFriendlyStaffId(staffId) {
    const parts = staffId.split('-');
    const prefix = parts[0];
    const shortUUID = parts[1].substring(0, 6);
    return `${prefix} (${shortUUID})`;
}

