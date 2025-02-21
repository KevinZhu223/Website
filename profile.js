// Load user data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initializePortfolioChart();
});

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Update profile information
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;

    // Load saved profile picture
    const savedPicture = localStorage.getItem(`profile_picture_${currentUser.email}`);
    if (savedPicture) {
        document.getElementById('profile-image').src = savedPicture;
    }

    // Load investment preferences with user-specific key
    const preferences = JSON.parse(localStorage.getItem(`investment_preferences_${currentUser.email}`) || '{}');
    document.getElementById('risk-tolerance').textContent = preferences.riskTolerance || 'Not set';
    document.getElementById('investment-timeline').textContent = preferences.investmentTimeline || 'Not set';
    document.getElementById('investment-goal').textContent = preferences.investmentGoal || 'Not set';
    document.getElementById('experience-level').textContent = preferences.experience || 'Not set';

    // Load portfolio summary with user-specific key
    const portfolio = JSON.parse(localStorage.getItem(`user_portfolio_${currentUser.email}`) || '[]');
    document.getElementById('total-etfs').textContent = portfolio.length;
    document.getElementById('diversity-score').textContent = calculateDiversityScore(portfolio) + '%';
    document.getElementById('avg-expense').textContent = calculateAverageExpense(portfolio) + '%';

    // Load user settings
    const settings = JSON.parse(localStorage.getItem('user_settings') || '{}');
    document.getElementById('email-notifications').checked = settings.emailNotifications || false;
    document.getElementById('two-factor').checked = settings.twoFactor || false;
}

function initializePortfolioChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    const portfolio = JSON.parse(localStorage.getItem('userPortfolio') || '[]');

    // Calculate sector distribution
    const sectorData = {};
    portfolio.forEach(etf => {
        const sector = etf['Investment Sector'];
        sectorData[sector] = (sectorData[sector] || 0) + 1;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(sectorData),
            datasets: [{
                data: Object.values(sectorData),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Portfolio Sector Distribution',
                    font: { size: 16 }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Handle profile picture upload
document.querySelector('.change-avatar-btn').addEventListener('click', () => {
    document.getElementById('avatar-upload').click();
});

document.getElementById('avatar-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            document.getElementById('profile-image').src = e.target.result;
            // Save to localStorage with user-specific key
            localStorage.setItem(`profile_picture_${currentUser.email}`, e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Handle settings changes
document.getElementById('email-notifications').addEventListener('change', (e) => {
    const settings = JSON.parse(localStorage.getItem('user_settings') || '{}');
    settings.emailNotifications = e.target.checked;
    localStorage.setItem('user_settings', JSON.stringify(settings));
});

document.getElementById('two-factor').addEventListener('change', (e) => {
    const settings = JSON.parse(localStorage.getItem('user_settings') || '{}');
    settings.twoFactor = e.target.checked;
    localStorage.setItem('user_settings', JSON.stringify(settings));
});

// Handle password change
document.querySelector('.change-password-btn').addEventListener('click', () => {
    const currentPassword = prompt('Enter current password:');
    if (currentPassword) {
        const newPassword = prompt('Enter new password:');
        if (newPassword) {
            const confirmPassword = prompt('Confirm new password:');
            if (newPassword === confirmPassword) {
                // In practice, you'd make an API call to change the password
                alert('Password changed successfully!');
            } else {
                alert('Passwords do not match!');
            }
        }
    }
});

// Add edit profile functionality
document.querySelector('.edit-profile-btn').addEventListener('click', () => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    
    // Create modal for editing profile
    const modalHtml = `
        <div class="modal" id="edit-profile-modal">
            <div class="modal-content">
                <h3>Edit Profile</h3>
                <form id="edit-profile-form">
                    <div class="form-group">
                        <label for="edit-name">Full Name</label>
                        <input type="text" id="edit-name" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email">Email</label>
                        <input type="email" id="edit-email" value="${currentUser.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-phone">Phone Number</label>
                        <input type="tel" id="edit-phone" value="${currentUser.phone || ''}" 
                               pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890">
                    </div>
                    <div class="form-group">
                        <label for="edit-bio">Bio</label>
                        <textarea id="edit-bio" rows="3">${currentUser.bio || ''}</textarea>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="save-btn">Save Changes</button>
                        <button type="button" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('edit-profile-modal');
    const form = document.getElementById('edit-profile-form');
    const cancelBtn = modal.querySelector('.cancel-btn');

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Update user data
        currentUser.name = document.getElementById('edit-name').value;
        currentUser.email = document.getElementById('edit-email').value;
        currentUser.phone = document.getElementById('edit-phone').value;
        currentUser.bio = document.getElementById('edit-bio').value;

        // Update localStorage
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...currentUser };
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Refresh profile display
        loadUserProfile();
        
        // Close modal
        modal.remove();
    });

    // Handle cancel button
    cancelBtn.addEventListener('click', () => {
        modal.remove();
    });
}); 