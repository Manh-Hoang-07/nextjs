export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                </div>
            </div>
        </div>
    );
}
