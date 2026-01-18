'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Global navigation progress bar
 * Shows a loading indicator when navigating between pages
 */
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // Start loading indicator
        setIsNavigating(true);

        // Small delay to prevent flash for fast navigations
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!isNavigating) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999]">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress-bar" />
        </div>
    );
}
