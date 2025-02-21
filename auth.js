// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const currentPath = window.location.pathname;
    
    // Get just the filename from the path
    const page = currentPath.split('/').pop() || 'index.html';
    
    // Check if we're on login or register page
    const isAuthPage = page === 'login.html' || page === 'register.html';
    
    if (!token && !isAuthPage) {
        // Not logged in and not on auth page - redirect to login
        window.location.href = 'login.html';
    } else if (token && isAuthPage) {
        // Logged in but on auth page - redirect to main page
        window.location.href = 'index.html';
    }
}

// Handle login form submission
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Here you would typically make an API call to your backend
            // For demo purposes, we'll use localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('auth_token', 'demo_token');
                localStorage.setItem('current_user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    });
}

// Handle registration form submission
if (document.getElementById('register-form')) {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            // For demo purposes, using localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.email === email)) {
                alert('Email already registered');
                return;
            }
            
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! Please log in.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    });
}

// Handle logout
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    window.location.href = 'login.html';
}

// Check authentication on page load
checkAuth(); 