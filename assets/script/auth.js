document.addEventListener('DOMContentLoaded', () => {

    const login = document.getElementById('loginForm');
    const signup = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const switchForms = (hideForm, showForm) => {
        hideForm.style.display = 'none';
        hideForm.classList.remove('active');
        showForm.style.display = 'block';
        void showForm.offsetWidth;
        showForm.classList.add('active');
    };
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchForms(login, signup);
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchForms(signup, login);
    });
    /**
     * Toggles password visibility and updates the eye icon.
     */
    function togglePasswordVisibility(event) {
        const inputGroup = event.target.closest('.input-group');
        if (!inputGroup) return;
        const input = inputGroup.querySelector('input[type="password"], input[type="text"]');
        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
                event.target.src = 'https://api.iconify.design/mdi:eye-off.svg';
            } else {
                input.type = 'password';
                event.target.src = 'https://api.iconify.design/mdi:eye.svg';
            }
        }
    }
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const inputGroup = input.closest('.input-group');
        if (!inputGroup) return;

        const existingError = inputGroup.querySelector('.error-message');
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            inputGroup.appendChild(errorDiv);

            setTimeout(() => {
                errorDiv.remove();
                inputGroup.classList.remove('error');
            }, 3000);
        }
    }

    /**
     * Handles login form submission.
     */
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!validateEmail(email)) {
            showError('email', 'Enter a proper email address to proceed.');
            return;
        }

        if (password.length < 6) {
            showError('password', 'Password should be a minimum of 6 characters.');
            return;
        }

        const user = JSON.stringify({ email, password });

        $.ajax({
            url: 'http://localhost:8089/gs/api/v1/users/login',
            type: 'POST',
            data: user,
            contentType: 'application/json',
            success: (response) => {
                document.cookie = `token=${response.token}; path=/; secure;`;
                document.cookie = `userGreenShadow=${email}; path=/; secure;`;
                window.location.href = 'dashboard/dashboard.html';
            },
            error: (xhr) => {
                console.error('Login error:', xhr.responseText);
                alert('Login failed. Please check your credentials.');
            }
        });
    }

    /**
     * Handles signup form submission.
     */
    function handleSignup(event) {
        event.preventDefault();

        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('role').value;
        const roleClarificationCode = document.getElementById('roleCode').value;


        if (!validateEmail(email)) {
            showError('signupEmail', 'Enter a valid email address to continue.');
            return;
        }

        if (password.length < 6) {
            showError('signupPassword', 'Your password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            showError('confirmPassword', 'The passwords you entered do not match.');
            return;
        }

        if (!role.trim()) {
            showError('role', 'A role must be selected to proceed.');
            return;
        }

        const user = JSON.stringify({ email, password, role , roleClarificationCode});

        $.ajax({
            url: 'http://localhost:8089/gs/api/v1/users/register',
            type: 'POST',
            data: user,
            contentType: 'application/json',
            success: (response) => {
                document.cookie = `token=${response.token}`;
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', email);
                window.location.href = 'index.html';
            },
            error: (xhr) => {
                console.error('Signup error:', xhr.responseText);
            }
        });
    }
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

