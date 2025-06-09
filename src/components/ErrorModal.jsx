import React from 'react';

const ErrorModal = ({message, onClose}) => {
    if (!message) return null;

    return (
        <div className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className = "bg-white p-6 rounded-lg shadow max-w-sm w-full">
                <h2 className = "text-lg font-semibold text-red-600 mb-4">AN ERROR OCCURRED</h2>
                <p className = "text-gray-700 mb-6">{message}</p>
                <div className = "text-right">
                    <button
                        onClick = {onClose}
                        className = "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
