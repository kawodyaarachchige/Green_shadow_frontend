// Initialize the application
document.addEventListener('DOMContentLoaded', function() {

    setDefaultDates();

    const token = getCookie("token");
    const userLoggedIn = getCookie("user");
    console.log(userLoggedIn);
    console.log(token);

    loadTable(token);

    const btnSaveLog = document.getElementById("btn-save-log");
    if(btnSaveLog){
        btnSaveLog.addEventListener("click", ()=> {
            if (document.getElementById("logId").value === "") {
                saveNewLog(token);
            } else {
                updateLog(token);
            }
        });
    }

    const btnUploadImage = document.getElementById("btn-upload-image");
    if(btnUploadImage){
        btnUploadImage.addEventListener("click" , () => uploadImage(token));
    }

    const btnFilterLogsByDate = document.getElementById("filterLogsByDate");
    if(btnFilterLogsByDate){
        btnFilterLogsByDate.addEventListener("click" , () => filterByDates(token));
    }

    const btnClearDatesFilter = document.getElementById("clearFilters");
    if(btnClearDatesFilter){
        btnClearDatesFilter.addEventListener("click" , () => clearFilters(token));
    }


});

// Set default dates (current month range)
function setDefaultDates() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
}
// Clear all filters
function clearFilters(token) {
    document.getElementById('searchInput').value = '';
    setDefaultDates();
    loadTable(token);

}

function openLogModal(logId = null,logDate = null,logDescription = null) {
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

function openImageModal(logId = null,logImage = null) {
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
// Edit log
function editLog(logId,logDate,logDescription) {
    openLogModal(logId,logDate,logDescription);
}

const saveNewLog = (token) => {
    const logDate = document.getElementById("logDate").value;
    const logDetails = document.getElementById("logDescription").value;

    if (!logDate || !logDetails){
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
      success: (data) =>{
          console.log("Log saved successfully")
          closeLogModal();
          loadTable(token);
      },
      error: (error) => {
          console.log("something went wrong, log not saved !")
      }
    })
}
const loadTable = (token) => {
    clearTable();

    const vehicleTable = document.getElementById("logsTableBody");

    // Fetch data from the backend
    $.ajax({
        url: "http://localhost:8089/gs/api/v1/logs",
        type: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        success: (data) => {
            // Store data for filtering
            window.logsData = data;

            data.forEach((log) => {
                const row = createLogRow(log);
                vehicleTable.appendChild(row);
            });
        },
        error: (error) => {
            console.log("Something went wrong:", error);
        }
    });
};

// Create a function to generate log rows
const createLogRow = (log) => {
    const row = document.createElement("tr");
    const formattedDate = formatLogDate(log.logDate);

    row.innerHTML = `
        <td>${log.logCode}</td>
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

    actionCell.appendChild(editButton);
    actionCell.appendChild(uploadButton);
    row.appendChild(actionCell);

    return row;
};


const updateLog = (token) => {
    console.log("Update log called..")

    const logId = document.getElementById("logId").value;
    const logDate = document.getElementById("logDate").value;
    const logDetails = document.getElementById("logDescription").value;

    if(!logDate || !logDetails){
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
        console.log("Log updated successfully");
        closeLogModal();
        loadTable(token);
      },
      error: (error) => {
        console.log("Something went wrong, log not updated !");
      }
    })
}

const uploadImage = (token) => {
    const selectedLogCode = document.getElementById("logId-2").value;
    const image1 = document.getElementById("imageInput").files[0];

    if (!image1) {
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
        console.log("Image uploaded successfully");
        closeImageModal();
        loadTable(token);
      },
      error: (error) => {
        console.log("Something went wrong, image not uploaded");
      }
    })
}
const filterByDates = (token) => {
    clearTable();

    const logsTable = document.getElementById("logsTableBody");
    const startedDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startedDate || !endDate) {
        return console.log("Please select both dates");
    }
    if (startedDate && endDate){
        $.ajax({
            url:`http://localhost:8089/gs/api/v1/logs/date?startDate=${encodeURIComponent(startedDate)}&endDate=${encodeURIComponent(endDate)}`,
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
                    editButton.onclick = () => editLog(log.logCode,log.logDate,log.logDetails); // Use `log.logCode` for unique identification

                    // Create the "Upload" button
                    const uploadButton = document.createElement("button");
                    uploadButton.className = "action-btn upload-btn";
                    uploadButton.innerHTML = `<i class="fas fa-upload"></i>`;
                    uploadButton.onclick = () => openImageModal(log.logCode,log.observedImage); // Use `log.logCode` for unique identification

                    actionCell.appendChild(editButton);
                    actionCell.appendChild(uploadButton);
                    row.appendChild(actionCell);
                    row.addEventListener("click", () => updateModalFields(log));
                    logsTable.appendChild(row);
                });
            },
            error: (error) => {
                console.log("Something went wrong, log not updated !");
            }
        })
    }
}

// Add search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const logTable = document.getElementById("logsTableBody");

    logTable.innerHTML = "";

    // Filter logs based on the search term
    const filteredLogs = window.logsData.filter((log) => {
        return (
            log.logCode.toLowerCase().includes(searchTerm) ||
            log.logDetails.toLowerCase().includes(searchTerm) ||
            log.logDate.toLowerCase().includes(searchTerm)
        );
    });

    // Append filtered rows to the table
    filteredLogs.forEach((log) => {
        const row = createLogRow(log);
        logTable.appendChild(row);
    });
});


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

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

