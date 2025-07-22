import { useState, useEffect, useMemo } from 'react';

// Breakpoints matching Tailwind CSS and responsive design best practices
export const breakpoints = {
  xs: 0,      // Extra small devices (phones)
  sm: 640,    // Small devices (tablets)
  md: 768,    // Medium devices (small laptops)
  lg: 1024,   // Large devices (laptops/desktops)
  xl: 1280,   // Extra large devices (large desktops)
  '2xl': 1536, // 2X Extra large devices (larger desktops)
  '3xl': 1920, // 3X Extra large devices (ultra-wide)
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook to get current window size with debouncing for performance
export function useWindowSize(debounceMs: number = 100) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    function handleResize() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    }

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);

  return windowSize;
}

// Hook to check if current screen size matches a breakpoint
export function useBreakpoint(breakpoint: Breakpoint) {
  const { width } = useWindowSize();
  return useMemo(() => width >= breakpoints[breakpoint], [width, breakpoint]);
}

// Hook to get current breakpoint
export function useCurrentBreakpoint(): Breakpoint {
  const { width } = useWindowSize();

  return useMemo(() => {
    if (width >= breakpoints['3xl']) return '3xl';
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [width]);
}

// Device detection hooks
export function useIsMobile() {
  return !useBreakpoint('md');
}

export function useIsTablet() {
  const isMd = useBreakpoint('md');
  const isLg = useBreakpoint('lg');
  return isMd && !isLg;
}

export function useIsDesktop() {
  return useBreakpoint('lg');
}

export function useIsLargeScreen() {
  return useBreakpoint('xl');
}

// Hook for touch device detection
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    setIsTouchDevice(checkTouchDevice());
  }, []);

  return isTouchDevice;
}

// Hook for orientation detection
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      if (window.innerHeight > window.innerWidth) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
}

// Responsive component that renders different content based on screen size
interface ResponsiveProps {
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Responsive({ mobile, tablet, desktop, children, fallback }: ResponsiveProps) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (isDesktop && desktop) return <>{desktop}</>;
  if (children) return <>{children}</>;
  return <>{fallback}</>;
}

// Utility function to get responsive values based on current breakpoint
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint,
  fallback?: T
): T | undefined {
  // Order breakpoints from largest to smallest
  const orderedBreakpoints: Breakpoint[] = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentBpIndex = orderedBreakpoints.indexOf(currentBreakpoint);
  
  // Look for value starting from current breakpoint and going down
  for (let i = currentBpIndex; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return fallback;
}

// Responsive grid component with better controls
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: Partial<Record<Breakpoint, number>>;
  gap?: string | Partial<Record<Breakpoint, string>>;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }, 
  gap = 'gap-4',
  className = ''
}: ResponsiveGridProps) {
  const getResponsiveClasses = () => {
    const classes: string[] = [];
    
    // Grid columns
    if (typeof cols === 'object') {
      Object.entries(cols).forEach(([bp, colCount]) => {
        if (colCount && bp in breakpoints) {
          const prefix = bp === 'xs' ? '' : `${bp}:`;
          classes.push(`${prefix}grid-cols-${colCount}`);
        }
      });
    }
    
    // Gap
    if (typeof gap === 'string') {
      classes.push(gap);
    } else if (typeof gap === 'object') {
      Object.entries(gap).forEach(([bp, gapValue]) => {
        if (gapValue && bp in breakpoints) {
          const prefix = bp === 'xs' ? '' : `${bp}:`;
          classes.push(`${prefix}${gapValue}`);
        }
      });
    }
    
    return classes.join(' ');
  };

  return (
    <div className={`grid ${getResponsiveClasses()} ${className}`}>
      {children}
    </div>
  );
}

// Enhanced container component with responsive padding and max widths
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  padding?: boolean | Partial<Record<Breakpoint, string>>;
  className?: string;
}

export function Container({ 
  children, 
  size = 'xl', 
  padding = true,
  className = '' 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '3xl': 'max-w-[1920px]',
    full: 'max-w-full',
  };

  const getPaddingClasses = () => {
    if (padding === false) return '';
    if (padding === true) return 'px-4 sm:px-6 lg:px-8';
    
    if (typeof padding === 'object') {
      const classes: string[] = [];
      Object.entries(padding).forEach(([bp, paddingValue]) => {
        if (paddingValue && bp in breakpoints) {
          const prefix = bp === 'xs' ? '' : `${bp}:`;
          classes.push(`${prefix}${paddingValue}`);
        }
      });
      return classes.join(' ');
    }
    
    return '';
  };

  return (
    <div className={`mx-auto ${sizeClasses[size]} ${getPaddingClasses()} ${className}`}>
      {children}
    </div>
  );
}

// Show/hide content based on breakpoints with better API
interface ShowProps {
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | Breakpoint[];
  children: React.ReactNode;
}

export function Show({ above, below, only, children }: ShowProps) {
  const currentBreakpoint = useCurrentBreakpoint();
  const currentWidth = breakpoints[currentBreakpoint];

  if (only) {
    const onlyArray = Array.isArray(only) ? only : [only];
    return onlyArray.includes(currentBreakpoint) ? <>{children}</> : null;
  }

  if (above && below) {
    const aboveWidth = breakpoints[above];
    const belowWidth = breakpoints[below];
    return currentWidth >= aboveWidth && currentWidth < belowWidth ? <>{children}</> : null;
  }

  if (above) {
    const aboveWidth = breakpoints[above];
    return currentWidth >= aboveWidth ? <>{children}</> : null;
  }

  if (below) {
    const belowWidth = breakpoints[below];
    return currentWidth < belowWidth ? <>{children}</> : null;
  }

  return <>{children}</>;
}

// Hide content based on breakpoints
interface HideProps {
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | Breakpoint[];
  children: React.ReactNode;
}

export function Hide({ above, below, only, children }: HideProps) {
  const currentBreakpoint = useCurrentBreakpoint();
  const currentWidth = breakpoints[currentBreakpoint];

  if (only) {
    const onlyArray = Array.isArray(only) ? only : [only];
    return !onlyArray.includes(currentBreakpoint) ? <>{children}</> : null;
  }

  if (above && below) {
    const aboveWidth = breakpoints[above];
    const belowWidth = breakpoints[below];
    return !(currentWidth >= aboveWidth && currentWidth < belowWidth) ? <>{children}</> : null;
  }

  if (above) {
    const aboveWidth = breakpoints[above];
    return currentWidth < aboveWidth ? <>{children}</> : null;
  }

  if (below) {
    const belowWidth = breakpoints[below];
    return currentWidth >= belowWidth ? <>{children}</> : null;
  }

  return null;
}

// Responsive typography component
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: Partial<Record<Breakpoint, string>>;
  weight?: Partial<Record<Breakpoint, string>>;
  color?: string;
  className?: string;
  as?: React.ElementType;
}

export function ResponsiveText({ 
  children, 
  size = { xs: 'text-sm', md: 'text-base', lg: 'text-lg' },
  weight,
  color,
  className = '',
  as: Component = 'div'
}: ResponsiveTextProps) {
  const getResponsiveClasses = () => {
    const classes: string[] = [];
    
    // Text sizes
    Object.entries(size).forEach(([bp, sizeValue]) => {
      if (sizeValue && bp in breakpoints) {
        const prefix = bp === 'xs' ? '' : `${bp}:`;
        classes.push(`${prefix}${sizeValue}`);
      }
    });
    
    // Font weights
    if (weight) {
      Object.entries(weight).forEach(([bp, weightValue]) => {
        if (weightValue && bp in breakpoints) {
          const prefix = bp === 'xs' ? '' : `${bp}:`;
          classes.push(`${prefix}${weightValue}`);
        }
      });
    }
    
    // Color
    if (color) {
      classes.push(color);
    }
    
    return classes.join(' ');
  };

  return (
    <Component className={`${getResponsiveClasses()} ${className}`}>
      {children}
    </Component>
  );
}

// Hook for responsive value with type safety
export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  fallback?: T
): T | undefined {
  const currentBreakpoint = useCurrentBreakpoint();
  return useMemo(() => 
    getResponsiveValue(values, currentBreakpoint, fallback),
    [values, currentBreakpoint, fallback]
  );
}

// Responsive spacing utilities
export const responsiveSpacing = {
  padding: {
    none: { xs: 'p-0' },
    small: { xs: 'p-2', sm: 'p-3', md: 'p-4' },
    medium: { xs: 'p-4', sm: 'p-6', md: 'p-8' },
    large: { xs: 'p-6', sm: 'p-8', md: 'p-12' },
  },
  margin: {
    none: { xs: 'm-0' },
    small: { xs: 'm-2', sm: 'm-3', md: 'm-4' },
    medium: { xs: 'm-4', sm: 'm-6', md: 'm-8' },
    large: { xs: 'm-6', sm: 'm-8', md: 'm-12' },
  },
  gap: {
    small: { xs: 'gap-2', sm: 'gap-3', md: 'gap-4' },
    medium: { xs: 'gap-4', sm: 'gap-6', md: 'gap-8' },
    large: { xs: 'gap-6', sm: 'gap-8', md: 'gap-12' },
  },
};
