"use client";

import React, { useState, useEffect, useMemo, isValidElement } from "react";
import { usePathname } from "next/navigation";
import FloatingContactChannels from "@/components/layout/public/ContactChannels/FloatingContactChannels";

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
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <React.Fragment key="header-section">{header}</React.Fragment>

            {/* Main Content */}
            <main
                key="main-content"
                className="flex-1 min-h-screen pt-20"
            >
                {children}
            </main>

            <React.Fragment key="footer-section">{footer}</React.Fragment>
            <FloatingContactChannels key="floating-channels" channels={contactChannels} />
        </div>
    );
}
