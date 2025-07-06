const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    )
}

export default LoadingSpinner