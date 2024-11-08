const crops = [];
const fields = [
    {id: 1, name: "Field A"},
    {id: 2, name: "Field B"},
    {id: 3, name: "Field C"},
];

function openCropModal(crop = null) {
    document.getElementById('cropModal').style.display = 'block';
    loadFieldOptions();

    if (crop) {
        document.getElementById('modalTitle').textContent = 'Edit Crop';
        document.getElementById('cropId').value = crop.cropId;
        document.getElementById('specialName').value = crop.specialName;
        document.getElementById('commonName').value = crop.commonName;
        document.getElementById('category').value = crop.category;
        document.getElementById('fieldSelect').value = crop.fieldId;
        document.getElementById('season').value = crop.season;
    } else {
        document.getElementById('modalTitle').textContent = 'Add Crop';
        document.getElementById('cropForm').reset();
        document.getElementById('cropId').value = ''; // Clear the ID for new entry
    }
}

function closeCropModal() {
    document.getElementById('cropModal').style.display = 'none';
}

function loadFieldOptions() {
    const fieldSelect = document.getElementById('fieldSelect');
    fieldSelect.innerHTML = '';
    fields.forEach(field => {
        const option = document.createElement('option');
        option.value = field.id;
        option.textContent = field.name;
        fieldSelect.appendChild(option);
    });
}
function handleCropFormSubmit(event) {
    event.preventDefault();

    const cropId = document.getElementById('cropId').value || (crops.length + 1).toString(); // Auto-generated ID if none
    const specialName = document.getElementById('specialName').value;
    const commonName = document.getElementById('commonName').value;
    const category = document.getElementById('category').value;
    const fieldId = document.getElementById('fieldSelect').value;
    const season = document.getElementById('season').value;
    const cropImage = document.getElementById('cropImage').files[0];

    const existingCrop = crops.find(c => c.cropId === cropId);

    if (existingCrop) {
        existingCrop.specialName = specialName;
        existingCrop.commonName = commonName;
        existingCrop.category = category;
        existingCrop.fieldId = fieldId;
        existingCrop.season = season;
        existingCrop.cropImage = cropImage;
    } else {
        // Add new crop
        const newCrop = {cropId, specialName, commonName, category, fieldId, season, cropImage};
        crops.push(newCrop);
    }

    updateCropTable();
    closeCropModal();
}

function updateCropTable() {
    const tableBody = document.getElementById('cropTableBody');
    tableBody.innerHTML = '';

    crops.forEach(crop => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.cropId}</td>
            <td>${crop.specialName}</td>
            <td>${crop.commonName}</td>
            <td>${crop.category}</td>
            <td>${fields.find(field => field.id == crop.fieldId).name}</td>
            <td>${crop.season}</td>
            <td>
                <button onclick="openCropModal(${JSON.stringify(crop).replace(/"/g, '&quot;')})" class="edit-btn">Edit</button>
                <button onclick="deleteCrop('${crop.cropId}')" class="delete-btn">Delete</button>
                <button onclick="viewCropDetails(${crop.cropId})" class="view-btn">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteCrop(cropId) {
    const index = crops.findIndex(crop => crop.cropId === cropId);

    if (confirm("Are you sure you want to delete this crop?") && index > -1) {
        crops.splice(index, 1); // Remove crop from array
        updateCropTable();
    }
}

function viewCropDetails(cropId) {
    const crop = crops.find(c => c.cropId == cropId);
    if (crop) {
        document.getElementById('viewCropId').textContent = crop.cropId;
        document.getElementById('viewSpecialName').textContent = crop.specialName;
        document.getElementById('viewCommonName').textContent = crop.commonName;
        document.getElementById('viewCategory').textContent = crop.category;
        document.getElementById('viewField').textContent = fields.find(f => f.id == crop.fieldId).name;
        document.getElementById('viewSeason').textContent = crop.season;

        const viewCropImage = document.getElementById('viewCropImage');
        if (crop.cropImage) {
            viewCropImage.src = URL.createObjectURL(crop.cropImage);
            viewCropImage.style.display = 'block';
        } else {
            viewCropImage.style.display = 'none';
        }

        document.getElementById('viewCropModal').style.display = 'block';
    }
}

function closeViewCropModal() {
    document.getElementById('viewCropModal').style.display = 'none';
}

function previewCropImage(event) {
    const file = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.style.display = 'block';
            imagePreview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {

        imagePreview.style.display = 'none';
    }
}

