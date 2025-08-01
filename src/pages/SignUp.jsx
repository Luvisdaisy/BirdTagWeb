import React, {useState} from 'react';
import {CognitoUserPool} from 'amazon-cognito-identity-js';
import {Link, useNavigate} from 'react-router-dom';
import VerifyModal from '../components/VerifyModal';
import ErrorModal from '../components/ErrorModal';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const poolData = {
        UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    };
    const userPool = new CognitoUserPool(poolData);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsRegistering(true);
        userPool.signUp(email, password, [], null, (err, result) => {
            setIsRegistering(false);
            if (err) {
                setErrorMessage(err.message || 'REGISTRATION FAILED PLEASE TRY AGAIN LATER');
            } else {
                setShowVerifyModal(true);
            }
        });
    };

    return (
        <div
            className = "min-h-screen bg-gradient-to-tr from-blue-100 to-blue-300 flex items-center justify-center px-4">
            <div className = "bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
                <h2 className = "text-2xl font-bold text-center text-gray-800">Register</h2>
                <form onSubmit = {handleSubmit} className = "space-y-4">
                    <input
                        type = "email"
                        className = "w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        placeholder = "email"
                        required
                    />
                    <input
                        type = "password"
                        className = "w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        placeholder = "password"
                        required
                    />
                    <button
                        type = "submit"
                        disabled = {isRegistering}
                        className = {`w-full ${
                            isRegistering ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white font-semibold py-2 px-4 rounded transition`}
                    >
                        {isRegistering ? 'Registering...' : 'Registered'}
                    </button>
                </form>
                <div className = "text-center text-sm text-gray-600">
                    Already have an account?
                    <Link to = "/login" className = "ml-1 text-blue-600 hover:underline">
                        Return to login
                    </Link>
                </div>
            </div>

            <VerifyModal
                email = {email}
                isOpen = {showVerifyModal}
                onClose = {() => setShowVerifyModal(false)}
                onVerified = {() => {
                    setShowVerifyModal(false);
                    navigate('/login');
                }}
            />
            <ErrorModal message = {errorMessage} onClose = {() => setErrorMessage('')}/>
        </div>
    );
};

export default SignUp;
