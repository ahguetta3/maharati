// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password strength checker
const passwordInput = document.querySelector('input[type="password"]');
if (passwordInput) {
    const strengthMeter = document.querySelector('.password-strength');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Uppercase check
        if (password.match(/[A-Z]/)) strength += 1;
        
        // Lowercase check
        if (password.match(/[a-z]/)) strength += 1;
        
        // Number check
        if (password.match(/[0-9]/)) strength += 1;
        
        // Special character check
        if (password.match(/[^A-Za-z0-9]/)) strength += 1;
        
        strengthMeter.classList.remove('weak', 'medium', 'strong');
        if (strength <= 2) {
            strengthMeter.classList.add('weak');
        } else if (strength <= 4) {
            strengthMeter.classList.add('medium');
        } else {
            strengthMeter.classList.add('strong');
        }
    });
}

// Form validation
const forms = document.querySelectorAll('.auth-form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = this.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'هذا الحقل مطلوب');
            } else {
                removeError(input);
                
                // Email validation
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'البريد الإلكتروني غير صحيح');
                }
                
                // Password validation
                if (input.type === 'password' && input.value.length < 8) {
                    isValid = false;
                    showError(input, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
                }
            }
        });
        
        // Password confirmation check
        const password = this.querySelector('input[type="password"]');
        const confirm = this.querySelectorAll('input[type="password"]')[1];
        if (confirm && password.value !== confirm.value) {
            isValid = false;
            showError(confirm, 'كلمات المرور غير متطابقة');
        }
        
        if (isValid) {
            // Show loading state
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Here you would typically make an API call
                console.log('Form submitted successfully');
                
                // Reset button state
                button.innerHTML = originalText;
                button.disabled = false;
                
                // Show success message
                showAlert('success', 'تم تسجيل الدخول بنجاح');
                
                // Redirect (you would typically do this after successful API call)
                // window.location.href = '/dashboard';
            }, 1500);
        }
    });
});

// Helper functions
function showError(input, message) {
    const formGroup = input.closest('.mb-3');
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message text-danger mt-1';
    error.textContent = message;
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    input.classList.add('is-invalid');
}

function removeError(input) {
    const formGroup = input.closest('.mb-3');
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.classList.remove('is-invalid');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.auth-card').insertBefore(alert, document.querySelector('.auth-form'));
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}
