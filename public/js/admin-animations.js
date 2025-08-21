/**
 * Admin Panel Animations and UI Enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initializeAnimations();
  
  // Setup toast notification system
  setupToastSystem();
  
  // Add loading indicators
  setupLoadingIndicators();
});

/**
 * Initialize all animations and transitions
 */
function initializeAnimations() {
  // Add animation classes to elements
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, color 0.3s ease';
    });
  });
  
  // Add hover effects to cards
  document.querySelectorAll('.stat-card, .card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
  });
  
  // Add button effects
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(1px)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Table row hover effects
  document.querySelectorAll('tr').forEach(row => {
    if (!row.classList.contains('table-header')) {
      row.classList.add('table-row');
    }
  });
}

/**
 * Setup toast notification system
 */
function setupToastSystem() {
  // Create toast container if it doesn't exist
  if (!document.querySelector('.toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Override the default alert with custom toast
  window.originalAlert = window.alert;
  window.alert = function(message) {
    showToast(message);
  };
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  const toastContainer = document.querySelector('.toast-container');
  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * Setup loading indicators for async operations
 */
function setupLoadingIndicators() {
  // Add loading class to elements that load data
  document.querySelectorAll('[data-loading]').forEach(element => {
    element.classList.add('loading');
  });
  
  // Monitor fetch requests to show loading state
  const originalFetch = window.fetch;
  window.fetch = function() {
    const fetchCall = originalFetch.apply(this, arguments);
    
    // Show loading indicator
    document.body.classList.add('loading-data');
    
    fetchCall.finally(() => {
      // Hide loading indicator when done
      document.body.classList.remove('loading-data');
      
      // Remove loading class from elements
      setTimeout(() => {
        document.querySelectorAll('.loading').forEach(el => {
          if (!el.getAttribute('data-permanent-loader')) {
            el.classList.remove('loading');
          }
        });
      }, 300);
    });
    
    return fetchCall;
  };
}

/**
 * Create a modal dialog
 * @param {string} title - The modal title
 * @param {string} content - The modal content
 * @param {Function} onConfirm - Callback when confirmed
 */
function showModal(title, content, onConfirm = null) {
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Add title
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = title;
  modalContent.appendChild(modalTitle);
  
  // Add content
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.innerHTML = content;
  modalContent.appendChild(modalBody);
  
  // Add buttons
  const modalFooter = document.createElement('div');
  modalFooter.className = 'modal-footer';
  
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    closeModal(modal);
  });
  
  const confirmButton = document.createElement('button');
  confirmButton.className = 'btn btn-primary';
  confirmButton.textContent = 'Confirm';
  confirmButton.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeModal(modal);
  });
  
  modalFooter.appendChild(cancelButton);
  modalFooter.appendChild(confirmButton);
  modalContent.appendChild(modalFooter);
  
  // Add to modal
  modal.appendChild(modalContent);
  
  // Add to body
  document.body.appendChild(modal);
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

/**
 * Close a modal dialog
 * @param {HTMLElement} modal - The modal element to close
 */
function closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => {
    modal.remove();
  }, 300);
}

/**
 * Confirm an action with a modal
 * @param {string} message - The confirmation message
 * @param {Function} onConfirm - Callback when confirmed
 */
function confirmAction(message, onConfirm) {
  showModal('Confirm Action', `<p>${message}</p>`, onConfirm);
}