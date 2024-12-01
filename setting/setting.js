document.addEventListener("DOMContentLoaded", () => {
    const token = getCookie('token');
    setupPasswordToggles();

    const btnChangeRole = document.getElementById("btn-change-role");
    if (btnChangeRole) {
        btnChangeRole.addEventListener("click", () => changeRole(token));
    }
    const btnChangePassword = document.getElementById("btn-change-password");
    if (btnChangePassword) {
        btnChangePassword.addEventListener("click", () => changePassword(token));
    }
    const btnDeleteAccount = document.getElementById("btn-delete-account");
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener("click", () => deleteAccount(token));
    }
})


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

const changeRole = (token) => {
    const email = getCookie('userGreenShadow');
    const password = document.getElementById("passwordForRoleChange").value;
    const role = document.getElementById('roleForSettings').value;
    const roleClarificationCode = document.getElementById("roleCode").value;

    if(!password || !role || !roleClarificationCode){
        showNotification('Please fill in all required fields', 'error');
        return;
    }


    ajaxRequest(
        'http://localhost:8089/gs/api/v1/users/role',
        'PUT',
        {
            email: email,
            password: password,
            role: role,
            roleClarificationCode: roleClarificationCode
        },
        token,
        (response) => {
            showNotification('Profile updated successfully', 'success');
            logoutAuto();
        },
        (error) => {
            showNotification('Password is incorrect', 'error');
            console.log(error.responseText);
        }
    );

}
const changePassword = (token) => {
    const email = getCookie('userGreenShadow');
    const password = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(!password || !newPassword || !confirmPassword){
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    ajaxRequest(
        'http://localhost:8089/gs/api/v1/users/password',
        'PUT',
        {
            userDTO:{
                email: email,
                password: password
            },
            newPassword: confirmPassword
        },
        token,
        (response) => {
            showNotification('Profile updated successfully', 'success');
            logoutAuto();
        },
        (error) => {
            showNotification(error.responseText);
            console.log(error.responseText);
        }
    );
}
const deleteAccount = (token) => {
    const email = getCookie('userGreenShadow');
    const password = document.getElementById("deletePassword").value;

    if(!password){
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    ajaxRequest(
        'http://localhost:8089/gs/api/v1/users/delete',
        'DELETE',
        {
            email: email,
            password: password
        },
        token,
        (response) => {
            showNotification('Account deleted successfully', 'success');
            logoutAuto();
        },
        (error) => {
            showNotification(error.responseText);
            console.log(error.responseText);
        }
    )

}
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            e.target.classList.toggle('fa-eye');
            e.target.classList.toggle('fa-eye-slash');
        });
    });
}

function confirmDeleteAccount() {
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
        deleteAccount(token);
    }
}

function logoutAuto(){
    document.cookie='token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie='userGreenShadow=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '../index.html';
}