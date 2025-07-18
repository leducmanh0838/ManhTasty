import { createContext, useReducer } from "react";
import cookie from "react-cookies"
import MyUserReducer from "../reducers/MyUserReducer";
import { GoogleOAuthProvider } from "@react-oauth/google";

const WEB_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";

export const AppContext = createContext();

const initUser = () => {
    const cookieUser = cookie.load('user');
    return cookieUser ? cookieUser : null;
}

export const AppProvider = ({ children }) => {
    const [user, dispatch] = useReducer(MyUserReducer, null, initUser);

    const contextValue = {
        user,
        dispatch,
    };

    return (
        <GoogleOAuthProvider clientId={WEB_CLIENT_ID}>
            <AppContext.Provider value={contextValue}>
                {children}
            </AppContext.Provider>
        </GoogleOAuthProvider>
    );
}