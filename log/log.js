let logCounter = 1;
const logIdMap = new Map();

// Function to get a user-friendly ID
function getFriendlyLogId(complexLogId) {
    if (!logIdMap.has(complexLogId)) {
        logIdMap.set(complexLogId, logCounter++);
    }
    return `LOG-${String(logIdMap.get(complexLogId)).padStart(4, '0')}`;
}

document.addEventListener('DOMContentLoaded', function () {
    setDefaultDates();
    const token = getCookie("token");
    const userLoggedIn = getCookie("user");
    console.log(userLoggedIn);
    console.log(token);

    loadTable(token);

    const btnSaveLog = document.getElementById("btn-save-log");
    if (btnSaveLog) {
        btnSaveLog.addEventListener("click", () => {
            if (document.getElementById("logId").value === "") {
                saveNewLog(token);
            } else {
                updateLog(token);
            }
        });
    }

    const btnUploadImage = document.getElementById("btn-upload-image");
    if (btnUploadImage) {
        btnUploadImage.addEventListener("click", () => uploadImage(token));
    }

    const btnFilterLogsByDate = document.getElementById("filterLogsByDate");
    if (btnFilterLogsByDate) {
        btnFilterLogsByDate.addEventListener("click", () => filterByDates(token));
    }

    const btnClearDatesFilter = document.getElementById("clearFilters");
    if (btnClearDatesFilter) {
        btnClearDatesFilter.addEventListener("click", () => clearFilters(token));
    }

});

function setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
}

function clearFilters(token) {
    document.getElementById('searchInput').value = '';
    setDefaultDates();
    loadTable(token);

}

function openLogModal(logId = null, logDate = null, logDescription = null) {
    console.log("hi")
    const modal = document.getElementById('logModal');
    const form = document.getElementById('logForm');
    const titleElement = modal.querySelector('h2');

    if (logId) {
        titleElement.textContent = 'Edit Log';
        document.getElementById('logId').value = logId;
        document.getElementById('logDate').value = logDate;
        document.getElementById('logDescription').value = logDescription;
    } else {
        titleElement.textContent = 'Add New Log';
        form.reset();
        document.getElementById('logId').value = '';
    }

    modal.style.display = 'block';
}

function closeLogModal() {
    document.getElementById('logModal').style.display = 'none';
}

function openImageModal(logId = null, logImage = null) {
    const modal = document.getElementById('imageModal');
    if (logId || logImage) {
        //document.getElementById("imagePreview").innerHTML = `<img src="${logImage}" alt="Log Image" style="width: 50px; height: 50px; object-fit: cover;">`;
        document.getElementById("logId-2").value = logId;
    }
    modal.style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.getElementById('imagePreview').innerHTML = '';
}

function editLog(logId, logDate, logDescription) {
    openLogModal(logId, logDate, logDescription);
}

const saveNewLog = (token) => {
    const logDate = document.getElementById("logDate").value;
    const logDetails = document.getElementById("logDescription").value;

    if (!logDate || !logDetails) {
        showNotification("all field should be completed .", "error")
        return console.error("all fields should be completed..")
    }

    const logModel = {
        logDate,
        logDetails
    }

    $.ajax({
        url: "http://localhost:8089/gs/api/v1/logs",
        type: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(logModel),
        success: (data) => {
            showNotification("Log saved successfully", "success")
            closeLogModal();
            loadTable(token);
        },
        error: (error) => {
            showNotification("something went wrong, log not saved !", "info")
            console.log("something went wrong, log not saved !")
        }
    })
}
const loadTable = (token) => {
    clearTable();

    const logTable = document.getElementById("logsTableBody");

    // Fetch data from the backend
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/logs",
        type: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            window.logsData = data;
            const sortedData = data.sort((a, b) => new Date(a.logDate) - new Date(b.logDate));

            sortedData.forEach((log) => {
                const row = createLogRow(log);
                logTable.appendChild(row);
            });
        },
        error: (error) => {
            console.log("Something went wrong:", error);
        }
    });
};

const createLogRow = (log) => {
    const row = document.createElement("tr");
    const formattedDate = formatLogDate(log.logDate);
    const friendlyId = getFriendlyLogId(log.logCode);

    row.innerHTML = `
        <td title="${log.logCode}">${friendlyId}</td>
        <td>${formattedDate}</td>
        <td>${log.logDetails}</td>
        <td>
            <img src="data:image/jpeg;base64,${log.observedImage}" alt="Log Image" style="width: 80px; height: 60px;" />
        </td>
    `;

    const actionCell = document.createElement("td");
    actionCell.className = "action-buttons";

    const editButton = document.createElement("button");
    editButton.className = "action-btn edit-btn";
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    editButton.onclick = () => editLog(log.logCode, log.logDate, log.logDetails);

    const uploadButton = document.createElement("button");
    uploadButton.className = "action-btn upload-btn";
    uploadButton.innerHTML = `<i class="fas fa-upload"></i>`;
    uploadButton.onclick = () => openImageModal(log.logCode, log.observedImage);

    const deleteButton = document.createElement("button");
    deleteButton.className = "action-btn delete-btn";
    deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteButton.onclick = () => deleteLog(log.logCode);

    actionCell.appendChild(deleteButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(uploadButton);
    row.appendChild(actionCell);

    return row;
};

function deleteLog(logCode) {
    const token = getCookie("token");
    console.log(logCode)

    $.ajax({
        url: `http://localhost:8089/gs/api/v1/logs/${logCode}`,
        type: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            showNotification("Log deleted successfully", "success")
            console.log("Log deleted successfully");
            loadTable(token);
        },
        error: (error) => {
            showNotification("Something went wrong, log not deleted !", "error")
            console.log("Something went wrong, log not deleted !");
        }
    })
}


const updateLog = (token) => {
    console.log("Update log called..")

    const logId = document.getElementById("logId").value;
    const logDate = document.getElementById("logDate").value;
    const logDetails = document.getElementById("logDescription").value;

    if (!logDate || !logDetails) {
        showNotification("All fields should be completed for update log.", "info")
        return console.log("all fields should be completed for update log..")
    }

    $.ajax({
        url: `http://localhost:8089/gs/api/v1/logs/${logId}`,
        type: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify({
            logDate,
            logDetails
        }),
        success: (data) => {
            showNotification("Log updated successfully", "success")
            console.log("Log updated successfully");
            closeLogModal();
            loadTable(token);
        },
        error: (error) => {
            showNotification("Something went wrong, log not updated !", "error")
            console.log("Something went wrong, log not updated !");
        }
    })
}

const uploadImage = (token) => {
    const selectedLogCode = document.getElementById("logId-2").value;
    const image1 = document.getElementById("imageInput").files[0];

    if (!image1) {
        showNotification("Please upload an image", "error");
        return console.log("Please upload an image");
    }

    const formData = new FormData();
    formData.append("logCode", selectedLogCode);
    formData.append("image", image1);

    $.ajax({
        url: `http://localhost:8089/gs/api/v1/logs`,
        type: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: (data) => {
            showNotification("Image uploaded successfully", "success")
            console.log("Image uploaded successfully");
            closeImageModal();
            loadTable(token);
        },
        error: (error) => {
            showNotification("Something went wrong, image not uploaded", "error")
            console.log("Something went wrong, image not uploaded");
        }
    })
}
const filterByDates = (token) => {
    clearTable();
    logCounter = 1;
    logIdMap.clear();

    const logsTable = document.getElementById("logsTableBody");
    const startedDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startedDate || !endDate) {
        showNotification("Please select both dates", "error");
        return console.log("Please select both dates");
    }
    if (startedDate && endDate) {
        $.ajax({
            url: `http://localhost:8089/gs/api/v1/logs/date?startDate=${encodeURIComponent(startedDate)}&endDate=${encodeURIComponent(endDate)}`,
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },

            success: (data) => {
                data.forEach((log) => {
                    const row = document.createElement("tr");

                    const formattedDate = formatLogDate(log.logDate);

                    // Populate row with log details
                    row.innerHTML = `
                    <td>${log.logCode}</td>
                    <td>${formattedDate}</td>
                    <td>${log.logDetails}</td>
                    <td>
                        <img src="data:image/jpeg;base64,${log.observedImage}" alt="Log Image" style="width: 80px; height: 60px;"/>
                    </td>
                `;

                    // Create the action buttons cell
                    const actionCell = document.createElement("td");
                    actionCell.className = "action-buttons";

                    // Create the "Edit" button
                    const editButton = document.createElement("button");
                    editButton.className = "action-btn edit-btn";
                    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
                    editButton.onclick = () => editLog(log.logCode, log.logDate, log.logDetails); // Use `log.logCode` for unique identification

                    // Create the "Upload" button
                    const uploadButton = document.createElement("button");
                    uploadButton.className = "action-btn upload-btn";
                    uploadButton.innerHTML = `<i class="fas fa-upload"></i>`;
                    uploadButton.onclick = () => openImageModal(log.logCode, log.observedImage); // Use `log.logCode` for unique identification

                    actionCell.appendChild(editButton);
                    actionCell.appendChild(uploadButton);
                    row.appendChild(actionCell);
                    row.addEventListener("click", () => updateModalFields(log));
                    logsTable.appendChild(row);
                });
            },
            error: (error) => {
                showNotification("Something went wrong, log not updated !", "error")
                console.log("Something went wrong, log not updated !");
            }
        })
    }
}

document.getElementById("searchInput").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const logTable = document.getElementById("logsTableBody");

    logTable.innerHTML = "";
    logCounter = 1;
    logIdMap.clear();

    const filteredLogs = window.logsData.filter((log) => {
        const friendlyId = getFriendlyLogId(log.logCode);
        return (
            log.logCode.toLowerCase().includes(searchTerm) ||
            log.logDetails.toLowerCase().includes(searchTerm) ||
            log.logDate.toLowerCase().includes(searchTerm)
        );
    });

    filteredLogs.forEach((log) => {
        const row = createLogRow(log);
        logTable.appendChild(row);
    });
});


const clearTable = () => {
    const vehicleTable = document.getElementById("logsTableBody");
    vehicleTable.innerHTML = "";
}

const updateModalFields = (log) => {
    document.getElementById("logId").value = log.logCode;
    document.getElementById("logDate").value = log.logDate;
    document.getElementById("logDescription").value = log.logDetails;
}

const formatLogDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};


