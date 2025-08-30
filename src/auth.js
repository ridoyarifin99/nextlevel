document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const backendUrl = '/api/auth'; // Using a relative URL since frontend and backend are on the same domain

    // --- Get Elements for Modals and Auth State ---
    const authContainer = document.getElementById('auth-container');
    const userContainer = document.getElementById('user-container');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // --- Event Listeners to Open Modals ---
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            signupModal.classList.remove('hidden');
            signupModal.classList.add('flex');
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.remove('hidden');
            loginModal.classList.add('flex');
        });
    }

    // --- Event Listeners to Close Modals ---
    const closeModal = (modal) => {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    if (closeSignupModal) {
        closeSignupModal.addEventListener('click', () => closeModal(signupModal));
    }
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    }
    
    // Close modal if user clicks on the overlay background
    if (signupModal) {
        signupModal.addEventListener('click', (e) => {
            if (e.target === signupModal) closeModal(signupModal);
        });
    }
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeModal(loginModal);
        });
    }
    
    // --- Function to update UI based on login state ---
    const updateUI = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user) {
            // User is logged in
            authContainer.classList.add('hidden');
            userContainer.classList.remove('hidden');
            usernameDisplay.textContent = `Welcome, ${user.username}!`;
        } else {
            // User is logged out
            authContainer.classList.remove('hidden');
            userContainer.classList.add('hidden');
        }
    };
    
    // --- Event Listener for Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const res = await fetch(`${backendUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.msg || 'Login failed');
                }
                
                // Store token and user info in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                alert('Login successful!');
                updateUI();
                closeModal(loginModal);

            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }

    // --- Event Listener for Signup ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                const res = await fetch(`${backendUrl}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.msg || 'Signup failed');
                }

                alert(data.msg); // "User registered successfully!"
                closeModal(signupModal);

            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }
    
    // --- Event Listener for Logout ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('You have been logged out.');
            updateUI();
        });
    }
    
    // --- Initial UI check when the page loads ---
    updateUI();
});