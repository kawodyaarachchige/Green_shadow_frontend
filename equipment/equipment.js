let equipmentData = [];
let fieldMap = {};
let staffMap = {};

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie("token");

    Promise.all([loadFieldSelector(token), loadStaffSelector(token)])
        .then(() => {
            getAllEquipment(token);
        })
        .catch((error) => {
            console.error("Error initializing selectors:", error);
        });

    const searchBar = document.getElementById("equipmentSearch");
    searchBar.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredEquipment = equipmentData.filter(equipment =>
            equipment.name.toLowerCase().includes(searchTerm)
        );
        renderEquipment(filteredEquipment);
    });
});


const ajaxRequest = (url, method, data, token, successCallback, errorCallback) => {
    $.ajax({
        url,
        type: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: data ? JSON.stringify(data) : null,
        success: successCallback,
        error: errorCallback
    });
};
const loadFieldSelector = (token) => {
    return new Promise((resolve, reject) => {
        const fieldSelector = document.getElementById('equipmentField');
        fieldSelector.innerHTML = ''; // Clear existing options
        ajaxRequest(
            "http://localhost:8089/gs/api/v1/fields",
            "GET",
            null,
            token,
            (data) => {
                data.forEach(field => {
                    const option = document.createElement('option');
                    option.value = field.fieldCode;
                    option.textContent = field.fieldName;
                    fieldSelector.appendChild(option);

                    fieldMap[field.fieldCode] = field.fieldName;
                });
                resolve();
            },
            (error) => {
                console.error("Error loading fields:", error);
                showNotification("Failed to load fields", "error");
                reject(error);
            }
        );
    });
};

const loadStaffSelector = (token) => {
    return new Promise((resolve, reject) => {
        const staffSelector = document.getElementById("equipmentStaff");
        staffSelector.innerHTML = ''; // Clear existing options
        ajaxRequest(
            "http://localhost:8089/gs/api/v1/staff",
            "GET",
            null,
            token,
            (data) => {
                data.forEach(staff => {
                    const option = document.createElement("option");
                    option.value = staff.id;
                    option.textContent = `${staff.firstName} ${staff.lastName}`;
                    staffSelector.appendChild(option);

                    staffMap[staff.id] = `${staff.firstName} ${staff.lastName}`;
                });
                resolve();
            },
            (error) => {
                console.error("Error loading staff:", error);
                showNotification("Failed to load staff", "error");
                reject(error);
            }
        );
    });
};

const getFieldName = (fieldCode) => {
    if (fieldMap[fieldCode]) {
        return fieldMap[fieldCode];
    }
};

const getStaffName = (staffId) => {
    if (staffMap[staffId]) {
        return staffMap[staffId];
    }
}
function openEquipmentModal(equipment = null) {
    document.getElementById("equipmentModal").style.display = "block";

    const token = getCookie("token");
    loadFieldSelector(token);
    loadStaffSelector(token);
    if (equipment) {
        document.getElementById("modalTitle").textContent = "Update Equipment";
        document.getElementById("equipmentCode").value = equipment.equipmentId;
        document.getElementById("equipmentName").value = equipment.name;
        document.getElementById("equipmentType").value = equipment.equipmentType;
        document.getElementById("equipmentStatus").value = equipment.status;
        document.getElementById("equipmentField").value = equipment.fieldCode;
        document.getElementById("equipmentStaff").value = equipment.staffId;
    }else {
        document.getElementById("modalTitle").textContent = "Add Equipment";
        clearForm();
        document.getElementById("equipmentCode").value = "";
    }
}

function clearForm() {
    document.getElementById("equipmentForm").reset();
}
function closeEquipmentModal() {
    document.getElementById("equipmentModal").style.display = "none";
    clearForm();
}
function handleEquipmentFormSubmit(event) {
    event.preventDefault();
    const token = getCookie("token");
    const equipmentId = document.getElementById("equipmentCode").value;
    equipmentId === "" ? saveNewEquipment(token) : updateEquipment(token);
}
const getEquipmentFromData = () => ({
    equipmentId: document.getElementById("equipmentCode").value,
    name: document.getElementById("equipmentName").value,
    equipmentType: document.getElementById("equipmentType").value,
    status: document.getElementById("equipmentStatus").value,
    fieldCode: document.getElementById("equipmentField").value,
    staffId: document.getElementById("equipmentStaff").value

});
const validateForm = (equipmentData) => {
   return Object.values(equipmentData).every(field => field !== "");

}

function saveNewEquipment(token) {
    const equipmentData = getEquipmentFromData();
    ajaxRequest(
        "http://localhost:8089/gs/api/v1/equipments",
        "POST",
        equipmentData,
        token,
        (response) => {
            showNotification("Equipment added successfully!", "success");
            getAllEquipment(token);
            closeEquipmentModal();
        },
        (error) => {
            console.error("Error saving equipment:", error.responseText);
            showNotification(error.responseText);
        }
    );
}
const getAllEquipment = (token) => {
    ajaxRequest(
        "http://localhost:8089/gs/api/v1/equipments",
        "GET",
        null,
        token,
        (response) => {
            renderEquipment(equipmentData = response);
        },
        (error) => {
            console.error("Error loading equipment:", error);
            showNotification("Failed to load equipment", "error");
        }
    )
}
function updateEquipment(token) {
    const equipmentId = document.getElementById("equipmentCode").value;
    const equipmentData = getEquipmentFromData();
    if(!validateForm(equipmentData)){
        showNotification("Please fill in all required fields.", "error");
        return;
    }
    ajaxRequest(
        `http://localhost:8089/gs/api/v1/equipments/${equipmentId}`,
        "PUT",
        equipmentData,
        token,
        (response) => {
            showNotification("Equipment updated successfully!", "success");
            getAllEquipment(token);
            closeEquipmentModal();
        },
        (error) => {
            console.error("Error updating equipment:", error.responseText);
            showNotification(error.responseText);
        }
    );
}
function deleteEquipment(equipmentId) {
    const token = getCookie('token');
    ajaxRequest(
        `http://localhost:8089/gs/api/v1/equipments/${equipmentId}`,
        "DELETE",
        null,
        token,
        (response) => {
            showNotification("Equipment deleted successfully!", "success");
            getAllEquipment(token);
        },
        (error) => {
            console.error(error.responseText);
            showNotification(error.responseText);
        }
    );
}

const renderEquipment = (filteredEquipmentData = [] = equipmentData) => {
    const equipmentTableBody = document.getElementById("equipmentTableBody");
    equipmentTableBody.innerHTML = "";

    $('.equipment-table').DataTable().destroy();
    $('#equipmentTableBody').empty()

    if(!filteredEquipmentData.length){
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="7">No equipment found
            <i class="fas fa-exclamation-triangle"></i>
            <p>No Equipment Found .Add Equipment to get started</p>
            </td>
        `;
        equipmentTableBody.appendChild(row);
        return;
    }
    filteredEquipmentData.forEach(equipment => {
        const fieldName = getFieldName(equipment.fieldCode);
        const staffName = getStaffName(equipment.staffId);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td title="${equipment.equipmentId}">${getfriendlyEquipmentId(equipment.equipmentId)}</td>
            <td>${equipment.name}</td>
            <td>${equipment.equipmentType}</td>
            <td>${equipment.status}</td>
            <td>${fieldName}</td>
            <td>${staffName}</td>
            <td>
               <button onclick="openEquipmentModal(${JSON.stringify(equipment).replace(/"/g, '&quot;')})" class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
               <button onclick="deleteEquipment('${equipment.equipmentId}')" class="delete-btn" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        equipmentTableBody.appendChild(row);
    });
    new DataTable('.equipment-table', {
        paging: false,
        searching: true,
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        responsive: true,
        destroy: true

    })


}
function getfriendlyEquipmentId(equipmentId) {
    const parts = equipmentId.split('-');
    const prefix = parts[0];
    const shortUUID = parts[1].substring(0, 6);
    return `${prefix} (${shortUUID})`;

}

