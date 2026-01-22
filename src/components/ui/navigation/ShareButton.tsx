"use client";

import { Button } from '@/components/ui/navigation/Button';

interface ShareButtonProps {
    title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
    const handleShare = () => {
        if (typeof window !== "undefined" && navigator.share) {
            navigator.share({
                title: title,
                url: window.location.href
            }).catch(console.error);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
        >
            Chia sẻ
        </Button>
    );
}
