// Display form data on the thankyou page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get form data from URL parameters
    const firstName = urlParams.get('first-name') || 'Not provided';
    const lastName = urlParams.get('last-name') || 'Not provided';
    const email = urlParams.get('email') || 'Not provided';
    const mobile = urlParams.get('mobile') || 'Not provided';
    const organization = urlParams.get('organization') || 'Not provided';
    const membership = urlParams.get('membership') || 'Not provided';
    const timestamp = urlParams.get('timestamp') || new Date().toISOString();
    
    // Display the data
    document.getElementById('full-name').textContent = firstName + ' ' + lastName;
    document.getElementById('email-display').textContent = email;
    document.getElementById('phone-display').textContent = mobile;
    document.getElementById('business-display').textContent = organization;
    
    // Format membership level display
    const membershipDisplay = {
        'np': 'NP Membership (Non-Profit)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    document.getElementById('membership-display').textContent = membershipDisplay[membership] || membership;
    
    // Format timestamp
    const date = new Date(timestamp);
    document.getElementById('date-display').textContent = date.toLocaleString('en-NG');
});

// Update footer with current date and year
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    document.getElementById('mod-date').textContent = now.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('copyright-year').textContent = now.getFullYear();
});