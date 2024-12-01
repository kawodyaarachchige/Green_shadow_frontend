let logCounter = 1;
const logIdMap = new Map();

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    setDefaultDates();
    const token = getCookie("token");
    const userLoggedIn = getCookie("user");
    console.log(userLoggedIn, token);

    loadTable(token);
    setupEventListeners(token);
}

function setupEventListeners(token) {
    setupButtonListener("btn-save-log", () => handleSaveLog(token));
    setupButtonListener("btn-upload-image", () => uploadImage(token));
    setupButtonListener("filterLogsByDate", () => filterByDates(token));
    setupButtonListener("clearFilters", () => clearFilters(token));
}

function setupButtonListener(buttonId, callback) {
    const button = document.getElementById(buttonId);
    if (button) button.addEventListener("click", callback);
}

function setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    document.getElementById("startDate").value = formatDate(firstDay);
    document.getElementById("endDate").value = formatDate(lastDay);
}

function clearFilters(token) {
    document.getElementById('searchInput').value = '';
    setDefaultDates();
    loadTable(token);
}

function handleSaveLog(token) {
    const logId = document.getElementById("logId").value;
    if (logId === "") saveNewLog(token);
    else updateLog(token);
}

function openLogModal(logId = null, logDate = null, logDescription = null) {
    const modal = document.getElementById('logModal');
    const titleElement = modal.querySelector('h2');

    if (logId) {
        titleElement.textContent = 'Edit Log';
        populateLogForm(logId, logDate, logDescription);
    } else {
        titleElement.textContent = 'Add New Log';
        resetLogForm();
    }

    modal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openImageModal(logId = null) {
    const modal = document.getElementById('imageModal');
    if (logId) document.getElementById("logId-2").value = logId;
    modal.style.display = 'block';
}

function createLogRow(log) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td title="${log.logCode}">${getFriendlyLogId(log.logCode)}</td>
        <td>${formatDate(new Date(log.logDate))}</td>
        <td>${log.logDetails}</td>
        <td>
            <img src="data:image/jpeg;base64,${log.observedImage}" alt="Log Image" style="width: 80px; height: 60px;" />
        </td>
    `;
    row.appendChild(createActionButtons(log));
    return row;
}

function createActionButtons(log) {
    const actionCell = document.createElement("td");
    actionCell.className = "action-buttons";
    actionCell.appendChild(createButton("edit-btn", "fa-edit", () => openLogModal(log.logCode, log.logDate, log.logDetails)));
    actionCell.appendChild(createButton("upload-btn", "fa-upload", () => openImageModal(log.logCode)));
    actionCell.appendChild(createButton("delete-btn", "fa-trash", () => deleteLog(log.logCode)));
    return actionCell;
}

function createButton(className, iconClass, callback) {
    const button = document.createElement("button");
    button.className = `action-btn ${className}`;
    button.innerHTML = `<i class="fas ${iconClass}"></i>`;
    button.addEventListener("click", callback);
    return button;
}

function saveNewLog(token) {
    const logModel = getLogFormData();
    if (!logModel) return;

    sendRequest("POST", "http://localhost:8089/gs/api/v1/logs", token, logModel, () => {
        showNotification("Log saved successfully", "success");
        closeModal('logModal');
        loadTable(token);
    });
}

function updateLog(token) {
    const logId = document.getElementById("logId").value;
    const logModel = getLogFormData();
    if (!logModel) return;

    sendRequest("PUT", `http://localhost:8089/gs/api/v1/logs/${logId}`, token, logModel, () => {
        showNotification("Log updated successfully", "success");
        closeModal('logModal');
        loadTable(token);
    });
}

function deleteLog(logCode) {
    const token = getCookie("token");
    sendRequest("DELETE", `http://localhost:8089/gs/api/v1/logs/${logCode}`, token, null, () => {
        showNotification("Log deleted successfully", "success");
        loadTable(token);
    });
}

function uploadImage(token) {
    const logCode = document.getElementById("logId-2").value;
    const imageFile = document.getElementById("imageInput").files[0];
    if (!imageFile) return showNotification("Please upload an image", "error");

    const formData = new FormData();
    formData.append("logCode", logCode);
    formData.append("image", imageFile);

    $.ajax({
        url: `http://localhost:8089/gs/api/v1/logs`,
        type: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        data: formData,
        processData: false,
        contentType: false,
        success: () => {
            showNotification("Image uploaded successfully", "success");
            closeModal('imageModal');
            loadTable(token);
        },
        error: (error) => {
            console.error("Error:", error.responseText);
            showNotification(error.responseText);
        },
    });
}

function loadTable(token) {
    clearTable();
    sendRequest("GET", "http://localhost:8089/gs/api/v1/logs", token, null, (data) => {
        const logTable = document.getElementById("logsTableBody");
        data.sort((a, b) => new Date(a.logDate) - new Date(b.logDate))
            .forEach((log) => logTable.appendChild(createLogRow(log)));
    });
}

function filterByDates(token) {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
        showNotification("Please select both start and end dates.", "error");
        return;
    }
    clearTable();
    const url = `http://localhost:8089/gs/api/v1/logs/date?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

    $.ajax({
        url: url,
        type: "GET",
        headers: { "Authorization": `Bearer ${token}` },
        success: function (data) {
            if (data && data.length > 0) {
                const logTable = document.getElementById("logsTableBody");
                data.forEach((log) => logTable.appendChild(createLogRow(log)));
                showNotification(`Loaded ${data.length} logs successfully.`, "success");
            } else {
                showNotification("No logs found for the selected date range.", "info");
            }
        },
        error: function () {
            showNotification("Failed to load logs for the selected date range.", "error");
        }
    });
}


function getFriendlyLogId(logCode) {
    const parts = logCode.split('-');
    const prefix = parts[0];
    const shortUUID = parts[1].substring(0, 6);
    return `${prefix} (${shortUUID})`;

}

function getLogFormData() {
    const logDate = document.getElementById("logDate").value;
    const logDetails = document.getElementById("logDescription").value;

    if (!logDate || !logDetails) {
        showNotification("All fields must be completed.", "error");
        return null;
    }
    return { logDate, logDetails };
}

function clearTable() {
    document.getElementById("logsTableBody").innerHTML = "";
}

function sendRequest(method, url, token, data, successCallback) {
    $.ajax({
        url,
        type: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        data: data ? JSON.stringify(data) : undefined,
        success: successCallback,
        error: (error) => {
            console.error("Error:", error.responseText);
            showNotification(error.responseText);
        },
    });
}


function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function populateLogForm(logId, logDate, logDescription) {
    document.getElementById("logId").value = logId;
    document.getElementById("logDate").value = logDate;
    document.getElementById("logDescription").value = logDescription;
}

function resetLogForm() {
    document.getElementById("logForm").reset();
    document.getElementById("logId").value = "";
}
function closeLogModal() {
    const modal = document.getElementById('logModal');
    modal.style.display = 'none';
    resetLogForm();
}
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}