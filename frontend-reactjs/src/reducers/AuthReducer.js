import cookie from 'react-cookies'

export const ActionType = {
  LOGIN: 1,
  LOGOUT: 2,
};

export const CurrentUserReducer = (current, action) => {
    switch (action.type) {
        case ActionType.LOGIN:
            // cookie.save('access-token', action.payload.access_token);
            cookie.save('current-user', action.payload);
            return action.payload;
        case ActionType.LOGOUT:
            cookie.remove('current-user');
            return null;
    }
    return current;
}

export const TokenReducer = (current, action) => {
    switch (action.type) {
        case ActionType.LOGIN:
            // cookie.save('access-token', action.payload.access_token);
            cookie.save('token', action.payload);
            return action.payload;
        case ActionType.LOGOUT:
            cookie.remove('token');
            return null;
    }
    return current;
}