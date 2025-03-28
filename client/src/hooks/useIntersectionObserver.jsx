import { useState, useEffect, useRef } from 'react';

/**
 * Hook that tracks whether an element is in the viewport
 * @param {Object} options - Intersection observer options
 * @param {number} options.threshold - Threshold for triggering the intersection 
 * @param {string} options.root - Element used as viewport for checking visibility
 * @param {string} options.rootMargin - Margin around the root
 * @param {boolean} options.triggerOnce - Whether to observe only once
 * @returns {Array} [ref, isIntersecting, entry] - Ref to attach to element, boolean if intersecting, intersection entry object
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  triggerOnce = true,
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const observerRef = useRef(null);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!window.IntersectionObserver) {
      // Fallback for browsers that don't support IntersectionObserver
      setIsIntersecting(true);
      return;
    }

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        // If triggerOnce is true and element is intersecting, unobserve
        if (triggerOnce && entry.isIntersecting) {
          observerRef.current.unobserve(entry.target);
        }
      },
      {
        root: root && document.querySelector(root),
        rootMargin,
        threshold,
      }
    );

    // Observe the element
    const currentElement = elementRef.current;
    if (currentElement) {
      observerRef.current.observe(currentElement);
    }

    return () => {
      if (observerRef.current && currentElement) {
        observerRef.current.unobserve(currentElement);
      }
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return [elementRef, isIntersecting, entry];
};

export default useIntersectionObserver; 