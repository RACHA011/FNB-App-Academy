// Configuration file for the Contact Book App
// API Configuration - matches your existing setup
const rootPath = "https://mysite.itvarsity.org/api/ContactBook/";

// Check and get API key from localStorage
let apiKey = checkApiKey();

function checkApiKey() {
    const storedApiKey = localStorage.getItem("apiKey");
    if (!storedApiKey) {
        // Redirect to API key entry page if no key is found
        window.location.href = "enter-api-key.html";
        return null;
    }
    return storedApiKey;
}

// App Configuration
const APP_CONFIG = {
    // Maximum file size for avatar uploads (in bytes)
    maxAvatarSize: 5 * 1024 * 1024, // 5MB
    
    // Allowed image formats for avatars
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    
    // Default avatar placeholder
    defaultAvatarUrl: 'https://via.placeholder.com/120x120/4f46e5/white?text=?',
    
    // API endpoints
    endpoints: {
        getContacts: 'controller/get-contacts/',
        insertContact: 'controller/insert-contact/',
        editContact: 'controller/edit-contact/',
        deleteContact: 'controller/delete-contact/',
        uploads: 'controller/uploads/',
        apiKey: 'controller/api-key/'
    },
    
    // App settings
    searchDebounceTime: 300, // milliseconds
    loadingTimeout: 10000, // 10 seconds
    
    // UI Messages
    messages: {
        loading: 'Loading...',
        noContacts: 'No contacts found',
        contactAdded: 'Contact added successfully!',
        contactUpdated: 'Contact updated successfully!',
        contactDeleted: 'Contact deleted successfully!',
        confirmDelete: 'Are you sure you want to delete this contact? This action cannot be undone.',
        networkError: 'Network error. Please check your connection and try again.',
        invalidApiKey: 'Invalid API key. Please check your credentials.',
        requiredFields: 'Please fill in all required fields.',
        invalidEmail: 'Please enter a valid email address.',
        fileTooLarge: 'File size must be less than 5MB',
        invalidFileType: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    }
};

// Utility functions
const utils = {
    // Format phone number for display
    formatPhoneNumber: function(phone) {
        if (!phone) return '';
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        // Format as (XXX) XXX-XXXX for US numbers
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        // Format international numbers
        if (cleaned.length > 10) {
            return `+${cleaned.slice(0, -10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
        }
        return phone; // Return original if not a standard format
    },
    
    // Validate email format
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validate phone number
    isValidPhone: function(phone) {
        if (!phone) return true; // Phone is optional
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    },
    
    // Generate initials from name
    getInitials: function(firstName, lastName) {
        const first = firstName ? firstName.charAt(0).toUpperCase() : '';
        const last = lastName ? lastName.charAt(0).toUpperCase() : '';
        return first + last || '?';
    },
    
    // Get avatar URL with fallback
    getAvatarUrl: function(avatar, firstName = '', lastName = '') {
        if (avatar && avatar !== 'default-avatar.png') {
            return `${rootPath}${APP_CONFIG.endpoints.uploads}${avatar}`;
        }
        // Generate placeholder with initials
        const initials = this.getInitials(firstName, lastName);
        return `https://via.placeholder.com/120x120/4f46e5/white?text=${initials}`;
    },
    
    // Validate file size and type for avatar uploads
    validateAvatarFile: function(file) {
        if (!file) return { valid: true }; // File is optional
        
        if (file.size > APP_CONFIG.maxAvatarSize) {
            return { 
                valid: false, 
                error: APP_CONFIG.messages.fileTooLarge
            };
        }
        
        if (!APP_CONFIG.allowedImageTypes.includes(file.type)) {
            return { 
                valid: false, 
                error: APP_CONFIG.messages.invalidFileType
            };
        }
        
        return { valid: true };
    },
    
    // Debounce function for search
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Handle API errors
    handleApiError: function(error, defaultMessage = APP_CONFIG.messages.networkError) {
        console.error('API Error:', error);
        
        if (error.message && error.message.includes('Failed to fetch')) {
            return APP_CONFIG.messages.networkError;
        }
        
        return defaultMessage;
    },
    
    // Show loading state
    showLoading: function(element, show = true) {
        if (!element) return;
        
        if (show) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    },
    
    // Sanitize input to prevent XSS
    sanitizeInput: function(input) {
        if (typeof input !== 'string') return input;
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    // Check if API key is still valid
    validateApiKey: function() {
        const storedApiKey = localStorage.getItem("apiKey");
        if (!storedApiKey) {
            window.location.href = "enter-api-key.html";
            return false;
        }
        return true;
    },
    
    // Logout function
    logout: function() {
        localStorage.removeItem("apiKey");
        window.location.href = "enter-api-key.html";
    }
};

// Global error handler for API calls
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Check if it's an API key related error
    if (event.reason && event.reason.message && event.reason.message.includes('401')) {
        utils.logout();
    }
});

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rootPath,
        apiKey,
        APP_CONFIG,
        utils,
        checkApiKey
    };
}