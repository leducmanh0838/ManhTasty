import { createContext, useReducer } from "react";
import cookie from "react-cookies"
import { GoogleOAuthProvider } from "@react-oauth/google";
import { WEB_CLIENT_ID } from "../configs/Values";
import { CurrentUserReducer, TokenReducer } from "../reducers/AuthReducer";

// const WEB_CLIENT_ID = process.env.REACT_APP_WEB_CLIENT_ID;

export const AppContext = createContext();

const initCurrentUser = () => {
    const cookieUser = cookie.load('current-user');
    return cookieUser ? cookieUser : null;
}

const initToken = () => {
    const cookieToken = cookie.load('token');
    return cookieToken ? cookieToken : null;
}

export const AppProvider = ({ children }) => {
    // console.info('AppProvider')
    // console.info(JSON.stringify(initUser(), null, 2))
    // console.log(document.cookie);
    const [currentUser, currentUserDispatch] = useReducer(CurrentUserReducer, null, initCurrentUser);
    const [token, tokenDispatch] = useReducer(TokenReducer, null, initToken);

    const contextValue = {
        currentUser,
        currentUserDispatch,
        token,
        tokenDispatch,
    };

    return (
        <GoogleOAuthProvider clientId={WEB_CLIENT_ID}>
            <AppContext.Provider value={contextValue}>
                {children}
            </AppContext.Provider>
        </GoogleOAuthProvider>
    );
}