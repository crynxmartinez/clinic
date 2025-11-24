// ========================================
// CLINIC CONFIGURATION
// ========================================
// 
// IMPORTANT: Change these values for each clinic deployment
// This file controls which clinic's data is displayed
//
// ========================================

// CLINIC IDENTIFICATION
// Change this to match the clinic ID in Firebase
// Examples: 'downtown-dental', 'smile-clinic', 'happy-teeth'
const CLINIC_ID = 'CHANGE_ME';

// CLINIC INFORMATION
// Change this to the clinic's display name
const CLINIC_NAME = 'CHANGE_ME Clinic';

// CLINIC BRANDING (Optional)
const CLINIC_LOGO = 'assets/logo.png';
const CLINIC_PRIMARY_COLOR = '#0066cc';
const CLINIC_SECONDARY_COLOR = '#00cc66';

// CLINIC CONTACT (Optional - for homepage)
const CLINIC_PHONE = '+1 (555) 123-4567';
const CLINIC_EMAIL = 'info@clinic.com';
const CLINIC_ADDRESS = '123 Main Street, City, State 12345';

// ========================================
// DO NOT MODIFY BELOW THIS LINE
// ========================================

// Validation check
if (CLINIC_ID === 'CHANGE_ME') {
    console.error('⚠️ WARNING: CLINIC_ID not configured! Please update config.js');
    console.error('Current CLINIC_ID:', CLINIC_ID);
}

// Export for use in other files
window.CLINIC_CONFIG = {
    id: CLINIC_ID,
    name: CLINIC_NAME,
    logo: CLINIC_LOGO,
    primaryColor: CLINIC_PRIMARY_COLOR,
    secondaryColor: CLINIC_SECONDARY_COLOR,
    phone: CLINIC_PHONE,
    email: CLINIC_EMAIL,
    address: CLINIC_ADDRESS
};

console.log('✅ Clinic Config Loaded:', CLINIC_NAME, '(' + CLINIC_ID + ')');
