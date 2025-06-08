import React, {useState} from 'react';
import {CognitoUserPool, CognitoUser} from 'amazon-cognito-identity-js';

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
                alert('验证失败: ' + err.message);
            } else {
                alert('验证成功，请登录');
                window.location.href = '/login';
            }
        });
    };

    return (
        <form onSubmit = {handleSubmit} className = "max-w-sm mx-auto p-4 space-y-4">
            <h2 className = "text-xl font-bold">邮箱验证</h2>
            <input
                className = "w-full p-2 border"
                type = "email"
                value = {email}
                onChange = {(e) => setEmail(e.target.value)}
                placeholder = "注册邮箱"
                required
            />
            <input
                className = "w-full p-2 border"
                type = "text"
                value = {code}
                onChange = {(e) => setCode(e.target.value)}
                placeholder = "验证码（6位）"
                required
            />
            <button className = "bg-green-600 text-white px-4 py-2">验证</button>
        </form>
    );
};

export default Verify;
