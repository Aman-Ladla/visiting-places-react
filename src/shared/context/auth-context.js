import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    token: null,
    logout: () => {},
    userId: null,
});
