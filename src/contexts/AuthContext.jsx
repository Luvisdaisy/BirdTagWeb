import React, {createContext, useContext, useEffect, useState} from 'react';
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import {jwtDecode} from 'jwt-decode';

/* ===== 1️⃣ 配置 UserPool ===== */
const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

/* ===== 2️⃣ 创建上下文 ===== */
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

/* ===== 3️⃣ Provider 组件 ===== */
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);   // { email, tokens }

    /* --- A . 刷新页面时恢复会话 --- */
    useEffect(() => {
        const cu = userPool.getCurrentUser();   // 从 localStorage 取 LastAuthUser
        if (!cu) return;

        cu.getSession((err, session) => {
            if (err || !session?.isValid()) {
                cu.signOut();                       // Refresh 失效，强制登出
                return;
            }
            const idToken = session.getIdToken().getJwtToken();
            const access = session.getAccessToken();
            const refreshTok = session.getRefreshToken().getToken();

            setUser({
                email: jwtDecode(idToken).email,
                tokens: {
                    id: idToken,
                    access: access.getJwtToken(),
                    refresh: refreshTok,
                    exp: access.getExpiration(),
                },
            });
        });
    }, []);

    /* --- B . 登录 / 登出方法 --- */
    const login = ({email, password}) =>
        new Promise((resolve, reject) => {
            const user = new CognitoUser({Username: email, Pool: userPool});
            const auth = new AuthenticationDetails({Username: email, Password: password});

            user.authenticateUser(auth, {
                onSuccess: (session) => {
                    const idToken = session.getIdToken().getJwtToken();
                    const accessTok = session.getAccessToken();
                    const refreshTok = session.getRefreshToken().getToken();

                    setUser({
                        email,
                        tokens: {
                            id: idToken,
                            access: accessTok.getJwtToken(),
                            refresh: refreshTok,
                            exp: accessTok.getExpiration(),
                        },
                    });
                    resolve();
                },
                onFailure: reject,
            });
        });

    const logout = () => {
        const cu = userPool.getCurrentUser();
        if (cu) cu.signOut();
        setUser(null);
    };

    /* --- C . 暴露上下文 --- */
    return (
        <AuthContext.Provider value = {{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
