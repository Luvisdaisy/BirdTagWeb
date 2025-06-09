import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import {jwtDecode} from 'jwt-decode';

/* ------------------------------------------------------------
   Cognito User‑Pool 初始配置
------------------------------------------------------------ */
const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

/* ------------------------------------------------------------
   上下文创建 & Hook
------------------------------------------------------------ */
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/* ------------------------------------------------------------
   Provider 组件
------------------------------------------------------------ */
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);           // { email, tokens }
    const [initializing, setInit] = useState(true);   // 首次恢复会话标记

    /* ----------  A. 刷新页面时恢复会话  ---------- */
    useEffect(() => {
        const cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) {
            setInit(false);
            return;
        }

        cognitoUser.getSession((err, session) => {
            if (!err && session?.isValid()) {
                const idToken = session.getIdToken().getJwtToken();
                const accessTok = session.getAccessToken();
                const refreshTok = session.getRefreshToken().getToken();

                setUser({
                    email: jwtDecode(idToken).email ?? jwtDecode(idToken)[
                        'cognito:username'
                        ],
                    tokens: {
                        id: idToken,
                        access: accessTok.getJwtToken(),
                        refresh: refreshTok,
                        exp: accessTok.getExpiration(),
                    },
                });
            } else {
                cognitoUser.signOut();
            }
            setInit(false);
        });
    }, []);

    /* ----------  B. 登录  ---------- */
    const login = ({email, password}) =>
        new Promise((resolve, reject) => {
            const cognitoUser = new CognitoUser({Username: email, Pool: userPool});
            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password,
            });

            cognitoUser.authenticateUser(authDetails, {
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
                    setInit(false);
                    resolve();
                },
                onFailure: (err) => {
                    setInit(false);
                    reject(err);
                },
            });
        });

    /* ----------  C. 登出  ---------- */
    const logout = () => {
        const cu = userPool.getCurrentUser();
        if (cu) cu.signOut();
        setUser(null);
    };

    /* ----------  D. 自动刷新 Access Token  ---------- */
    useEffect(() => {
        if (!user) return;

        const timer = setInterval(() => {
            const nowSec = Date.now() / 1000;
            if (user.tokens.exp - nowSec > 300) return; // >5 分钟则忽略

            const cu = userPool.getCurrentUser();
            if (!cu) return;

            cu.getSession((err, session) => {
                if (err || !session?.isValid()) {
                    logout();
                    return;
                }
                const accessTok = session.getAccessToken();
                setUser((u) => ({
                    ...u,
                    tokens: {
                        ...u.tokens,
                        access: accessTok.getJwtToken(),
                        exp: accessTok.getExpiration(),
                    },
                }));
            });
        }, 60_000); // 每分钟检查一次

        return () => clearInterval(timer);
    }, [user]);

    /* ----------  E. 上下文输出  ---------- */
    const value = {user, initializing, login, logout};

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>;
};
