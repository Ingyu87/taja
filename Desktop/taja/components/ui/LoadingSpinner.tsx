export const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-pink-400 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                    🏰
                </div>
            </div>
        </div>
    );
};
