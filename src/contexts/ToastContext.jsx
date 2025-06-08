import React, {createContext, useContext, useState} from 'react';

const ToastContext = createContext();

let toastId = 0;

export const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = toastId++;
        const newToast = {id, message, type};
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value = {{showToast}}>
            {children}
            <div className = "fixed bottom-4 right-4 z-50 space-y-2 flex flex-col items-end">
                {toasts.map((toast) => (
                    <div
                        key = {toast.id}
                        className = {`toast-box text-white animate-fade-in-out transition-opacity duration-500 ${
                            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);