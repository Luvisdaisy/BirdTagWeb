import React, {useState} from 'react';
import {CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';
import ErrorModal from './ErrorModal';
import {useToast} from '../contexts/ToastContext';

const VerifyModal = ({email, isOpen, onClose, onVerified}) => {
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const {showToast} = useToast();

    const poolData = {
        UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    };
    const userPool = new CognitoUserPool(poolData);

    const handleConfirm = (e) => {
        e.preventDefault();
        setIsVerifying(true);
        const user = new CognitoUser({Username: email, Pool: userPool});

        user.confirmRegistration(code, true, (err, result) => {
            setIsVerifying(false);
            if (err) {
                setErrorMessage(err.message || 'Verification code verification failed');
            } else {
                showToast('Verification was successful!');
                onVerified();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className = "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className = "bg-white p-6 rounded shadow max-w-sm w-full">
                    <h2 className = "text-xl font-bold mb-4">Email Verification</h2>
                    <p className = "mb-2 text-sm text-gray-700">The verification code has been sent
                                                                to:<strong>{email}</strong></p>
                    <form onSubmit = {handleConfirm} className = "space-y-4">
                        <input
                            type = "text"
                            className = "w-full p-2 border"
                            placeholder = "Please enter a 6-digit verification code"
                            value = {code}
                            onChange = {(e) => setCode(e.target.value)}
                            required
                        />
                        <div className = "flex justify-end gap-2">
                            <button
                                type = "button"
                                onClick = {onClose}
                                className = "px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type = "submit"
                                disabled = {isVerifying}
                                className = {`px-4 py-2 ${
                                    isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'
                                } rounded`}
                            >
                                {isVerifying ? 'Verifying...' : 'Verification'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ErrorModal message = {errorMessage} onClose = {() => setErrorMessage('')}/>
        </>
    );
};

export default VerifyModal;
