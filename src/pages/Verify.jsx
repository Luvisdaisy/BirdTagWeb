import React, {useState} from 'react';
import {CognitoUser, CognitoUserPool} from 'amazon-cognito-identity-js';

const Verify = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    const poolData = {
        UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    };
    const userPool = new CognitoUserPool(poolData);

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = new CognitoUser({Username: email, Pool: userPool});

        user.confirmRegistration(code, true, (err, result) => {
            if (err) {
                alert('Verification failed: ' + err.message);
            } else {
                alert('Verification is successful, please log in');
                window.location.href = '/login';
            }
        });
    };

    return (
        <form onSubmit = {handleSubmit} className = "max-w-sm mx-auto p-4 space-y-4">
            <h2 className = "text-xl font-bold">Email Verification</h2>
            <input
                className = "w-full p-2 border"
                type = "email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                placeholder = "Registered Email"
                required
            />
            <input
                className = "w-full p-2 border"
                type = "text"
                value = {code}
                onChange = {(e) => setCode(e.target.value)}
                placeholder = "Verification code (6 digits)"
                required
            />
            <button className = "bg-green-600 text-white px-4 py-2">VERIFY</button>
        </form>
    );
};

export default Verify;
