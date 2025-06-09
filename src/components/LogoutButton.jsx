import React from 'react';
import {ArrowLeftOnRectangleIcon} from '@heroicons/react/24/solid';
import {useAuth} from '../contexts/AuthContext';
import {useToast} from '../contexts/ToastContext';

const LogoutButton = () => {
    const {logout} = useAuth();
    const {showToast} = useToast();

    const handle = () => {
        logout();
        showToast('Logged out', 'success');
    };

    return (
        <button
            onClick = {handle}
            className = "flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm
                 text-blue-700 hover:bg-blue-100 transition"
        >
            <ArrowLeftOnRectangleIcon className = "h-5 w-5"/>
            QUIT
        </button>
    );
};

export default LogoutButton;
