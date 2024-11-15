document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');

    // Function to switch forms with proper animation
    const switchForms = (hideForm, showForm) => {
        hideForm.style.display = 'none';
        hideForm.classList.remove('active');
        showForm.style.display = 'block';
        // Trigger reflow to ensure animation works
        void showForm.offsetWidth;
        showForm.classList.add('active');
    };

    // Switch to signup form
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        switchForms(loginForm, signupForm);
    });

    // Switch to login form
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchForms(signupForm, loginForm);
    });

    // Handle form submissions
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Add your login logic here
        console.log('Login:', { email, password, rememberMe });
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Add your signup logic here
        console.log('Signup:', { name, email, password });
    });

    // Add floating label behavior
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        // Set initial state
        if (input.value) {
            input.classList.add('has-value');
        }

        input.addEventListener('focus', () => {
            input.classList.add('has-value');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.classList.remove('has-value');
            }
        });
    });
});