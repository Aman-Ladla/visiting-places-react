import { useCallback, useEffect, useState } from "react";

let logoutTimer;

const useAuth = () => {
    const [token, setToken] = useState();
    const [userId, setUserId] = useState();
    const [tokenExpirationDate, setTokenExpirationDate] = useState();

    const login = useCallback((userId, token, expirationDate) => {
        setUserId(userId);
        setToken(token);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: userId,
                token: token,
                expirationDate: tokenExpirationDate.toISOString(),
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expirationDate) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                new Date(storedData.expirationDate)
            );
        }
    }, [login]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, tokenExpirationDate, logout]);

    return { token, userId, login, logout };
};

export default useAuth;
