let vehicleData = [];
let staffMap = {};

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie("token");
    loadVehicleTable(token);
    loadStaffSelector(token);
    initializeSearch();
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

const loadStaffSelector = (token) => {
    const staffSelector = document.getElementById("staffIdOnVehicle");

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
            showNotification("Failed to load staff members", "error");
            console.error("Error loading staff:", error);
        }
    );
};

const handleVehicleFormSubmit = (event) => {
    event.preventDefault();
    const token = getCookie("token");
    const vehicleId = document.getElementById("vehicleId").value;

    vehicleId === "" ? saveNewVehicle(token) : updateVehicle(token);
};

const getVehicleFormData = () => {
    return {
        licensePlateNumber: document.getElementById("licenNo").value,
        vehicleCategory: document.getElementById("category").value,
        fuelType: document.getElementById("fuelType").value,
        status: document.getElementById("vehicleStatus").value,
        staff: document.getElementById("staffIdOnVehicle").value,
        remarks: document.getElementById("remark").value
    };
};

const validateVehicleForm = (vehicleData) => {
    return Object.values(vehicleData).every(field => field !== "");
};

const saveNewVehicle = (token) => {
    const vehicleData = getVehicleFormData();

    if (!validateVehicleForm(vehicleData)) {
        showNotification("Please fill in all required fields", "error");
        return;
    }

    ajaxRequest(
        "http://localhost:8089/gs/api/v1/vehicles",
        "POST",
        vehicleData,
        token,
        () => {
            showNotification("Vehicle saved successfully", "success");
            closeVehicleModal();
            loadVehicleTable(token);
        },
        (error) => {
            showNotification(error.responseText);
            console.error("Error saving vehicle:", error.responseText);
        }
    );
};

const updateVehicle = (token) => {
    const vehicleCode = document.getElementById("vehicleId").value;
    const vehicleData = getVehicleFormData();

    if (!validateVehicleForm(vehicleData)) {
        showNotification("Please fill in all required fields", "error");
        return;
    }

    ajaxRequest(
        `http://localhost:8089/gs/api/v1/vehicles/${vehicleCode}`,
        "PUT",
        vehicleData,
        token,
        () => {
            showNotification("Vehicle updated successfully", "success");
            closeVehicleModal();
            loadVehicleTable(token);
        },
        (error) => {
            showNotification(error.responseText);
            console.error("Error updating vehicle:", error.responseText);
        }
    );
};

const initializeSearch = () => {
    const searchInput = document.getElementById('vehicleSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVehicles = vehicleData.filter(vehicle =>
            vehicle.vehicleCategory.toLowerCase().includes(searchTerm)
        );
        displayVehicleData(filteredVehicles);
    });
};

const loadVehicleTable = (token) => {
    clearFields();
    ajaxRequest(
        "http://localhost:8089/gs/api/v1/vehicles",
        "GET",
        null,
        token,
        (data) => {
            vehicleData = data;
            displayVehicleData(data);
        },
        (error) => {
            showNotification("Failed to load vehicles", "error");
            console.error("Error loading vehicles:", error);
        }
    );
};

const displayVehicleData = (dataToDisplay = vehicleData) => {
    const tableBody = document.getElementById('vehicleTableBody');
    tableBody.innerHTML = '';

    if (dataToDisplay.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" class="text-center">
                <i class="fas fa-truck"></i>
                <p>No vehicles found</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }

    dataToDisplay.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td title="${vehicle.vehicleCode}">${getFriendlyVehicleCode(vehicle.vehicleCode)}</td>
            <td>${vehicle.licensePlateNumber}</td>
            <td>${vehicle.vehicleCategory}</td>
            <td>${vehicle.fuelType}</td>
            <td>${vehicle.status}</td>
            <td>${vehicle.staff}</td>
            <td>${vehicle.remarks}</td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" onclick="editVehicle(${JSON.stringify(vehicle).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteVehicle('${vehicle.vehicleCode}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};
const deleteVehicle = (vehicleCode) => {
    const token = getCookie("token");
    ajaxRequest(
        `http://localhost:8089/gs/api/v1/vehicles/${vehicleCode}`,
        "DELETE",
        null,
        token,
        () => {
            showNotification("Vehicle deleted successfully", "success");
            loadVehicleTable(token);
        },
        (error) => {
            showNotification(error.responseText);
            console.error("Error deleting vehicle:", error.responseText);
        }
    );
};

const editVehicle = (vehicle) => {
    openVehicleModal();
    document.getElementById("vehicleId").value = vehicle.vehicleCode;
    document.getElementById("licenNo").value = vehicle.licensePlateNumber;
    document.getElementById("category").value = vehicle.vehicleCategory;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("vehicleStatus").value = vehicle.status;
    document.getElementById("staffIdOnVehicle").value = vehicle.staff;
    document.getElementById("remark").value = vehicle.remarks || '';

    document.getElementById("modalTitle").textContent = "Edit Vehicle";
};

const openVehicleModal = () => {
    const modal = document.getElementById('vehicleModal');
    modal.style.display = 'block';

    if (!document.getElementById("vehicleId").value) {
        document.getElementById("modalTitle").textContent = "Add Vehicle";
        clearFields();
    }
};

const closeVehicleModal = () => {
    document.getElementById('vehicleModal').style.display = 'none';
    clearFields();
};

const clearFields = () => {
    document.getElementById("vehicleId").value = "";
    document.getElementById("licenNo").value = "";
    document.getElementById("category").value = "";
    document.getElementById("fuelType").value = "Petrol";
    document.getElementById("vehicleStatus").value = "AVAILABLE";
    document.getElementById("staffIdOnVehicle").value = "";
    document.getElementById("remark").value = "";
};

function clearForm() {
    clearFields();
}
function getFriendlyVehicleCode(vehicleCode) {
    const parts = vehicleCode.split('-');
    const prefix = parts[0];
    const shortUUID = parts[1].substring(0, 6);
    return `${prefix} (${shortUUID})`;
}
