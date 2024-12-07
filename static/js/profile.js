// Profile Image Upload
document.querySelector('.change-photo-btn').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.querySelector('.profile-image img').src = event.target.result;
                // Here you would typically upload the file to your server
                uploadProfileImage(file);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
});

// Profile Form Submission
document.querySelector('.profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Here you would typically make an API call to update profile
        console.log('Profile updated successfully');
        
        // Reset button state
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        showAlert('success', 'تم حفظ التغييرات بنجاح');
    }, 1500);
});

// Helper Functions
function uploadProfileImage(file) {
    // Simulate upload
    console.log('Uploading profile image:', file.name);
    // Here you would typically make an API call to upload the image
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.profile-content').insertBefore(alert, document.querySelector('.card'));
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Course Progress Animation
document.querySelectorAll('.progress-bar').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
        bar.style.width = width;
    }, 100);
});
