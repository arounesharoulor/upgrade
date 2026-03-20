import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the device is mobile based on window width.
 * Standard breakpoint: 768px (MD in Tailwind)
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Using 1024 for more aggressive optimization on tablets too
    };
    
    // Initial check
    checkMobile();
    
    // Resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}
