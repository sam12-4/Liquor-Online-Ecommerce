// Media query breakpoints (matching Tailwind defaults)
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Check if the current window width matches a media query
 * @param {string} query - The media query to check (e.g., 'sm', 'md', 'lg', 'xl', '2xl')
 * @param {string} type - The type of comparison ('min' or 'max')
 * @returns {boolean}
 */
export const matches = (query, type = 'min') => {
  if (typeof window === 'undefined') return false;
  
  const width = window.innerWidth;
  const breakpoint = breakpoints[query];
  
  if (!breakpoint) return false;
  
  if (type === 'min') {
    return width >= breakpoint;
  }
  
  if (type === 'max') {
    return width < breakpoint;
  }
  
  return false;
};

/**
 * Hook to check if the viewport is mobile sized
 * @returns {boolean}
 */
export const isMobile = () => {
  return matches('md', 'max');
};

/**
 * Hook to check if the viewport is tablet sized
 * @returns {boolean}
 */
export const isTablet = () => {
  return matches('md', 'min') && matches('lg', 'max');
};

/**
 * Hook to check if the viewport is desktop sized
 * @returns {boolean}
 */
export const isDesktop = () => {
  return matches('lg', 'min');
};

// Export the breakpoints for direct access
export { breakpoints }; 