"use client";

import React, { useState, useEffect, useMemo, isValidElement } from "react";
import { usePathname } from "next/navigation";
import FloatingContactChannels from "@/components/layout/ContactChannels/FloatingContactChannels";

interface PublicLayoutWrapperProps {
    children: React.ReactNode;
    header: React.ReactNode;
    footer: React.ReactNode;
    contactChannels: any;
}

export function PublicLayoutWrapper({
    children,
    header,
    footer,
    contactChannels,
}: PublicLayoutWrapperProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [pathname, mobileMenuOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", mobileMenuOpen);
    }, [mobileMenuOpen]);

    const closeMobileMenu = React.useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    const toggleMobileMenu = React.useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    // Memoize header để tránh re-render không cần thiết
    const HeaderWithProps = useMemo(() => {
        if (!isValidElement(header)) {
            return header;
        }
        return React.cloneElement(header as React.ReactElement<any>, {
            mobileMenuOpen,
            onToggleMobileMenu: toggleMobileMenu,
            onCloseMobileMenu: closeMobileMenu,
            currentPath: pathname,
        });
    }, [header, mobileMenuOpen, pathname, toggleMobileMenu, closeMobileMenu]);

    return (
        <div className="min-h-screen bg-gray-50">
            <React.Fragment key="header-section">{HeaderWithProps}</React.Fragment>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    key="mobile-overlay"
                    className="fixed inset-0 bg-black/40 z-[60]"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Main Content */}
            <main
                key="main-content"
                className={`flex-1 min-h-screen ${pathname === '/' ||
                    pathname === '/en' ||
                    pathname?.startsWith('/home/services') ||
                    pathname?.startsWith('/home/projects') ||
                    pathname?.startsWith('/home/posts') ||
                    pathname?.startsWith('/home/contact')
                    ? ''
                    : 'pt-20'
                    }`}>{children}</main>

            <React.Fragment key="footer-section">{footer}</React.Fragment>
            <FloatingContactChannels key="floating-channels" channels={contactChannels} />
        </div>
    );
}
