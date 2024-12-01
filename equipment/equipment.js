let equipmentData = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie("token");
    loadFieldSelector(token);
    loadStaffSelector(token);
  getAllEquipment(token);
    //initializeSearch();
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
            });


        },
        (error) => {
            console.error("Error loading fields:", error);
            showNotification("Failed to load fields", "error");
        }
    );
};
const loadStaffSelector = (token) => {
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
            });
        },
        (error) => {
            console.error("Error loading staff:", error);
            showNotification("Failed to load staff", "error");
        }
    );
};
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
const renderEquipment = (filteredEquipmentData = [] = equipmentData) => {
    const equipmentTableBody = document.getElementById("equipmentTableBody");
    equipmentTableBody.innerHTML = "";
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
    equipmentData.forEach((equipment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${equipment.equipmentId}</td>
            <td>${equipment.name}</td>
            <td>${equipment.equipmentType}</td>
            <td>${equipment.status}</td>
            <td>${equipment.fieldCode}</td>
            <td>${equipment.staffId}</td>
            <td>
               <button onclick="openEquipmentModal(${JSON.stringify(equipment).replace(/"/g, '&quot;')})" class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
    
            </td>
        `;
        equipmentTableBody.appendChild(row);
    });
};