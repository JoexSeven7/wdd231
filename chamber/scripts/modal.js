// Handle membership dialogs
document.addEventListener('DOMContentLoaded', function() {
    // Get all membership links
    const membershipLinks = document.querySelectorAll('.membership-link');
    
    // Get all dialogs
    const dialogs = {
        'np': document.getElementById('np-dialog'),
        'bronze': document.getElementById('bronze-dialog'),
        'silver': document.getElementById('silver-dialog'),
        'gold': document.getElementById('gold-dialog')
    };
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-dialog');
    
    // Open dialog when membership link is clicked
    membershipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const membershipType = this.getAttribute('data-membership');
            if (dialogs[membershipType]) {
                dialogs[membershipType].showModal();
            }
        });
    });
    
    // Close dialog when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dialog = this.closest('dialog');
            dialog.close();
        });
    });
    
    // Close dialog when clicking outside the dialog content
    Object.values(dialogs).forEach(dialog => {
        dialog.addEventListener('click', function(e) {
            // Check if click was on the backdrop (dialog area outside content)
            const rect = dialog.getBoundingClientRect();
            if (e.clientY < rect.top || e.clientY > rect.bottom || 
                e.clientX < rect.left || e.clientX > rect.right) {
                dialog.close();
            }
        });
    });
    
    // Close dialog with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            Object.values(dialogs).forEach(dialog => {
                if (dialog.open) {
                    dialog.close();
                }
            });
        }
    });
});


// Set timestamp on page load
        document.getElementById('timestamp').value = new Date().toISOString();
    