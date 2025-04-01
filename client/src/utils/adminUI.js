/**
 * Admin UI Enhancement Utilities
 */

/**
 * Initialize table scroll indicators
 * Adds visual indicators for tables that have horizontal scrolling
 */
export const initTableScrollIndicators = () => {
  // Find all table containers
  const tableContainers = document.querySelectorAll('.admin-page .table-container');
  
  if (!tableContainers || tableContainers.length === 0) return;
  
  // Check each container
  tableContainers.forEach(container => {
    const checkForOverflow = () => {
      // Check if table is wider than container
      const hasOverflow = container.scrollWidth > container.clientWidth;
      
      // Add or remove class based on overflow
      if (hasOverflow) {
        container.classList.add('has-overflow');
      } else {
        container.classList.remove('has-overflow');
      }
    };
    
    // Initial check
    checkForOverflow();
    
    // Listen for resize events
    window.addEventListener('resize', checkForOverflow);
    
    // Listen for scroll events to update indicator
    container.addEventListener('scroll', () => {
      // If we're near the end of scrolling, hide indicator
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 40) {
        container.classList.remove('has-overflow');
      } else if (container.scrollWidth > container.clientWidth) {
        container.classList.add('has-overflow');
      }
    });
  });
};

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset from top in pixels
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const position = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: position,
    behavior: 'smooth'
  });
};

/**
 * Apply focused state to an element
 * @param {string} elementId - ID of element to focus
 */
export const focusElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Add focus class
  element.classList.add('highlight-focus');
  
  // Remove after animation completes
  setTimeout(() => {
    element.classList.remove('highlight-focus');
  }, 2000);
};

/**
 * Initialize floating labels for form inputs
 */
export const initFloatingLabels = () => {
  const formControls = document.querySelectorAll('.admin-page .form-control');
  
  formControls.forEach(input => {
    // Check initial state
    if (input.value) {
      input.classList.add('has-value');
    }
    
    // Add event listeners
    input.addEventListener('focus', () => {
      input.classList.add('is-focused');
    });
    
    input.addEventListener('blur', () => {
      input.classList.remove('is-focused');
      if (input.value) {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });
};

// Export all utilities
export default {
  initTableScrollIndicators,
  scrollToElement,
  focusElement,
  initFloatingLabels
}; 