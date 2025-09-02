import { createContext, useReducer, useState } from "react";
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
    const [activeChat, setActiveChat] = useState(true);

    // console.info(JSON.stringify(token, null, 2))
    // console.info(JSON.stringify(currentUser, null, 2))

    const contextValue = {
        currentUser,
        currentUserDispatch,
        token,
        tokenDispatch,
        activeChat, setActiveChat
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}