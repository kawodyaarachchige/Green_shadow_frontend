let cropsData = [];
let fieldMap = {};


document.addEventListener('DOMContentLoaded', function () {
    const token = getCookie("token");
    getAllCrops(token);
    initializeCropSearchBar();
    loadFieldOptions(token);
    loadlogSelector(token);
    viewCropDetails();
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

const loadFieldOptions = (token) => {
    const fieldSelect = document.getElementById('fieldSelect');
    fieldSelect.innerHTML = ''; // Clear existing options

    ajaxRequest(
        "http://localhost:8089/gs/api/v1/fields",
        "GET",
        null,
        token,
        (data) => {
            console.log('Fields Data:', data);

            data.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode;
                option.textContent = field.fieldName;
                fieldSelect.appendChild(option);


            });

            console.log('Updated Field Map:', fieldMap);
        },
        (error) => {
            console.error('Error loading fields:', error);
            showNotification('Failed to load fields', 'error');
        }
    );

};
const loadlogSelector = (token) => {
    const logSelector = document.getElementById("logSelect");

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

function openCropModal(crop = null) {
    document.getElementById('cropModal').style.display = 'block';

    const token = getCookie("token");
    loadFieldOptions(token);

    if (crop) {
        document.getElementById('modalTitle').textContent = 'Edit Crop';
        document.getElementById('cropId').value = crop.cropCode;
        document.getElementById('specialName').value = crop.cropScientificName;
        document.getElementById('commonName').value = crop.cropCommonName;
        document.getElementById('category').value = crop.category;
        document.getElementById('fieldSelect').value = crop.fieldCode;
        document.getElementById('season').value = crop.cropSeason;

        const imagePreview = document.getElementById('imagePreview');
        if (crop.cropImage) {
            imagePreview.src = `data:image/jpeg;base64,${crop.cropImage}`;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
    } else {
        document.getElementById('modalTitle').textContent = 'Add Crop';
        document.getElementById('cropForm').reset();
        document.getElementById('cropId').value = '';
        document.getElementById('imagePreview').style.display = 'none';
    }
}

function closeCropModal() {
    document.getElementById('cropModal').style.display = 'none';
}
function previewCropImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}
function handleCropFormSubmit(event) {
    event.preventDefault();
    const token = getCookie("token");
    const cropId = document.getElementById('cropId').value;
    cropId === "" ? saveNewCrop(token) : updateCrop(token);
}

const getCropFromData = () => ({
    cropId: document.getElementById('cropId').value,
    cropScientificName: document.getElementById('specialName').value,
    cropCommonName: document.getElementById('commonName').value,
    category: document.getElementById('category').value,
    fieldCode: document.getElementById('fieldSelect').value,
    cropSeason: document.getElementById('season').value
});

const validateCropForm = (cropData) => {
    return Object.values(cropData).every(field => field !== "");
};

const saveNewCrop = (token) => {
    const cropData = getCropFromData();
    ajaxRequest(
        "http://localhost:8089/gs/api/v1/crops",
        "POST",
        cropData,
        token,
        (response) => {
            uploadImage(token, response.cropCode);
            saveLogForCrop(token,response.cropCode);
            showNotification('Crop added successfully!', 'success');
            closeCropModal();
            getAllCrops(token);

        },
        (error) => {
            console.error('Error saving crop:', error.responseText);
            showNotification(error.responseText);
        }
    );
};

const saveLogForCrop = (token,cropCode) => {
    const selectedLog = document.getElementById("logSelect").value;
    if (selectedLog) {
        const formData = new FormData();
        formData.append("logCode", selectedLog);
        formData.append("cropCode", cropCode);

       $.ajax({
           url: "http://localhost:8089/gs/api/v1/crops/log",
           type: "POST",
           headers: {
               "Authorization": `Bearer ${token}`
           },
           contentType: false,
           processData: false,
           data: formData,
           success: () => {
               getAllCrops(token);
               console.log("Log saved successfully");
           },
           error: (error) => {
               console.error(error.responseText);
               showNotification(error.responseText);
           }
       })
    }
}

const updateCrop = (token) => {
    const cropCode = document.getElementById('cropId').value;
    const cropData = getCropFromData();

    if (!validateCropForm(cropData)) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    ajaxRequest(
        `http://localhost:8089/gs/api/v1/crops/${cropCode}`,
        "PUT",
        cropData,
        token,
        async () => {
            await uploadImage(token, cropCode);
            saveLogForCrop(token, cropCode);
            showNotification('Crop updated successfully!', 'success');
            console.log("token : ", token);
            getAllCrops(token);
            closeCropModal();
        },
        (error) => {
            console.error('Error updating crop:', error.responseText);
            showNotification(error.responseText);
        }
    );
};

const uploadImage =  (token, cropCode) => {
    const imageInput = document.getElementById('cropImage');
    const formData = new FormData();
    formData.append('cropCode', cropCode);
    formData.append('image', imageInput.files[0]);

    $.ajax({
        url: `http://localhost:8089/gs/api/v1/crops`,
        type: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: () => {
            showNotification('Image uploaded successfully!', 'success');
        },
        error: (error) => {
            console.error('Error uploading image:', error.responseText);
            showNotification(error.responseText);
        }
    })
};

const getAllCrops = (token) => {
    ajaxRequest(
        "http://localhost:8089/gs/api/v1/crops",
        "GET",
        null,
        token,
        (response) => {
            renderCrops(cropsData = response);
        },
        (error) => {
            console.error('Error loading crops:', error);
            showNotification('Failed to load crops', 'error');
        }
    )
}

const renderCrops = (filteredCrops = [] = cropsData) => {
    const tableBody = document.getElementById('cropTableBody');
    tableBody.innerHTML = '';
    $('.crop-table').DataTable().destroy();
    $('#cropTableBody').empty();
    if (!filteredCrops.length) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="8" class="no-results">
                <i class="fas fa-seedling"></i>
                <p>No crops found. Add crops to get started.</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }

    filteredCrops.forEach(crop => {
        const row = document.createElement('tr');


        row.innerHTML = `
        <td title="${crop.cropCode}">${getFriendlyCropId(crop.cropCode)}</td>
        <td>${crop.cropScientificName}</td>
        <td>${crop.cropCommonName}</td>
        <td>${crop.category}</td>
        <td>${crop.fieldCode}</td>
        <td>${crop.cropSeason}</td>
        <td>
           <div class="action-buttons">
              <button onclick="openCropModal(${JSON.stringify(crop).replace(/"/g, '&quot;')})" class="edit-btn" title="Edit">
                 <i class="fas fa-edit"></i>
              </button>
              <button onclick="viewCropDetails('${crop.cropCode}')" class="view-btn" title="View Details">
                 <i class="fas fa-eye"></i>
              </button>
           </div>
        </td>
    `;
        tableBody.appendChild(row);
    });
    new DataTable('.crop-table', {
        paging: false,
        searching: true,
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        responsive: true,
        destroy: true

    })

};


function initializeCropSearchBar() {
    const searchInput = document.getElementById('cropSearch');
    searchInput.addEventListener('input', (e ) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCrop = cropsData.filter(crop =>
            crop.cropCode.toLowerCase().includes(searchTerm) ||
            crop.cropScientificName.toLowerCase().includes(searchTerm) ||
            crop.cropCommonName.toLowerCase().includes(searchTerm) ||
            crop.category.toLowerCase().includes(searchTerm)

        );
        renderCrops(filteredCrop);
    })
}

function viewCropDetails(cropCode) {
    console.log(cropCode);
    const crop = cropsData.find(crop => crop.cropCode === cropCode);

    if (crop) {
        document.getElementById('viewCropId').textContent = crop.cropCode;
        document.getElementById('viewSpecialName').textContent = crop.cropScientificName;
        document.getElementById('viewCommonName').textContent = crop.cropCommonName;
        document.getElementById('viewCategory').textContent = crop.category;
        document.getElementById('viewField').textContent = crop.fieldCode;
        document.getElementById('viewSeason').textContent = crop.cropSeason;

        const imagePreview = document.getElementById('viewCropImage');
        if (crop.cropImage) {
            imagePreview.src = '';
            imagePreview.src = `data:image/jpeg;base64,${crop.cropImage}`;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }

        document.getElementById('viewCropModal').style.display = 'block';
    } else {
        console.error('Crop not found for the given cropCode:', cropCode);
    }
}



function closeViewCropModal() {
    document.getElementById('viewCropModal').style.display = 'none';
    const imagePreview = document.getElementById('viewCropImage');
    imagePreview.src = '';
    imagePreview.style.display = 'none';

}


window.onload = function () {
    const token = getCookie("token");
    renderCrops();
    initializeCropSearchBar();
    loadFieldOptions(token);
    getAllCrops(token);
};
function getFriendlyCropId(cropCode) {
    const parts = cropCode.split('-');
    const prefix = parts[0];
    const shortUUID = parts[1].substring(0, 6);
    return `${prefix} (${shortUUID})`;
}
