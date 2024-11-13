let vehicleData = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie("token");
    loadVehicleTable(token);
    loadStaffSelector(token);

    initializeSearch();
});

const loadStaffSelector = (token) => {
    const staffSelector = document.getElementById("staffIdOnVehicle");

    $.ajax({
        url: "http://localhost:8089/gs/api/v1/staff",
        type: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            data.forEach((staff) => {
                const option = document.createElement("option");
                option.value = staff.id;
                option.textContent = `${staff.firstName} ${staff.lastName}`;
                staffSelector.appendChild(option);
            });
        },
        error: (error) => {
            console.log("Something went wrong:", error);
            showNotification("Failed to load staff members", "error");
        }
    });
}

function handleVehicleFormSubmit(event) {
    event.preventDefault();
    const token = getCookie("token");
    const vehicleId = document.getElementById("vehicleId").value;

    if (vehicleId === "") {
        saveNewVehicle(token);
    } else {
        updateVehicle(token);
    }
}

const saveNewVehicle = (token) => {
    const licensePlateNumber = document.getElementById("licenNo").value;
    const vehicleCategory = document.getElementById("category").value;
    const fuelType = document.getElementById("fuelType").value;
    const status = document.getElementById("vehicleStatus").value;
    const staff = document.getElementById("staffIdOnVehicle").value;
    const remarks = document.getElementById("remark").value;

    if (!licensePlateNumber || !vehicleCategory || !fuelType || !status || !staff) {
        showNotification("Please fill in all required fields", "error");
        return;
    }

    const vehicleModel = {
        licensePlateNumber,
        vehicleCategory,
        fuelType,
        status,
        remarks,
        staff
    };

    $.ajax({
        url: "http://localhost:8089/gs/api/v1/vehicles",
        type: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(vehicleModel),
        success: (data) => {
            showNotification("Vehicle saved successfully", "success");
            closeVehicleModal();
            loadVehicleTable(token);
        },
        error: (error) => {
            showNotification("Vehicle could not be saved", "error");
            console.log("Something went wrong:", error);
        }
    });
}

const updateVehicle = (token) => {
    const vehicleCode = document.getElementById("vehicleId").value;
    const licensePlateNumber = document.getElementById("licenNo").value;
    const vehicleCategory = document.getElementById("category").value;
    const fuelType = document.getElementById("fuelType").value;
    const status = document.getElementById("vehicleStatus").value;
    const staff = document.getElementById("staffIdOnVehicle").value;
    const remarks = document.getElementById("remark").value;

    if (!licensePlateNumber || !vehicleCategory || !fuelType || !status || !staff || !remarks) {
        showNotification("Please fill in all required fields", "error");
        return;
    }

    $.ajax({
        url: `http://localhost:8089/gs/api/v1/vehicles/${vehicleCode}`,
        type: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify({
            licensePlateNumber,
            vehicleCategory,
            fuelType,
            status,
            staff,
            remarks
        }),
        success: (data) => {
            showNotification("Vehicle updated successfully", "success");
            closeVehicleModal();
            loadVehicleTable(token);
        },
        error: (error) => {
            showNotification("Vehicle could not be updated", "error");
            console.log("Something went wrong:", error);
        }
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('vehicleSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredVehicles = vehicleData.filter(vehicle =>
            vehicle.vehicleCategory.toLowerCase().includes(searchTerm)
        );
        displayVehicleData(filteredVehicles);
    });
}

const loadVehicleTable = (token) => {
    clearFields();
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/vehicles",
        type: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            vehicleData = data;
            displayVehicleData(data);
        },
        error: (error) => {
            console.log("Something went wrong:", error);
            showNotification("Failed to load vehicles", "error");
        }
    });
}

function displayVehicleData(dataToDisplay = vehicleData) {
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
            <td>${vehicle.vehicleCode}</td>
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
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editVehicle(vehicle) {
    openVehicleModal();
    document.getElementById("vehicleId").value = vehicle.vehicleCode;
    document.getElementById("licenNo").value = vehicle.licensePlateNumber;
    document.getElementById("category").value = vehicle.vehicleCategory;
    document.getElementById("fuelType").value = vehicle.fuelType;
    document.getElementById("vehicleStatus").value = vehicle.status;
    document.getElementById("staffIdOnVehicle").value = vehicle.staff;
    document.getElementById("remark").value = vehicle.remarks || '';

    document.getElementById("modalTitle").textContent = "Edit Vehicle";
}

function openVehicleModal() {
    const modal = document.getElementById('vehicleModal');
    modal.style.display = 'block';

    if (!document.getElementById("vehicleId").value) {
        document.getElementById("modalTitle").textContent = "Add Vehicle";
        clearFields();
    }
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').style.display = 'none';
    clearFields();
}

function clearFields() {
    document.getElementById("vehicleId").value = "";
    document.getElementById("licenNo").value = "";
    document.getElementById("category").value = "";
    document.getElementById("fuelType").value = "Petrol";
    document.getElementById("vehicleStatus").value = "AVAILABLE";
    document.getElementById("staffIdOnVehicle").value = "";
    document.getElementById("remark").value = "";
}

function clearForm() {
    clearFields();
}