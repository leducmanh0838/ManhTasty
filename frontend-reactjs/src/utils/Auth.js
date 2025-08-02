import { useContext } from "react";
import { ActionType } from "../reducers/AuthReducer";
import { AppContext } from "../provides/AppProvider";
import cookie from "react-cookies"
import Apis, { endpoints } from "../configs/Apis";
import { DOT_CLIENT_ID, DOT_CLIENT_SECRET } from "../configs/Values";

export function useLogin() {
  const { currentUserDispatch, tokenDispatch } = useContext(AppContext);

  const login = (resData) => {
    currentUserDispatch({
      type: ActionType.LOGIN,
      payload: resData.current_user,
    });

    tokenDispatch({
      type: ActionType.LOGIN,
      payload: resData.token,
    });
  };

  return login;
}

export function useLogout() {
  const { currentUserDispatch, tokenDispatch } = useContext(AppContext);

  const logout = () => {
    currentUserDispatch({
      type: ActionType.LOGOUT
    });

    tokenDispatch({
      type: ActionType.LOGOUT
    });
  };

  return logout;
}

export async function getAccessToken() {
  console.info('getAccessToken')
  const token = cookie.load('token');

  if (!token) {
    console.error('Not found token')
  }

  const now = new Date();
  const expiresAt = new Date(token.expires);

  if (now < expiresAt) {
    console.info('token.access_token: ', token.access_token)
    return token.access_token;
  }
  console.info('NOT now < expiresAt')

  const formData = new FormData();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', token.refresh_token);
  formData.append('client_id', DOT_CLIENT_ID);
  formData.append('client_secret', DOT_CLIENT_SECRET);

  // Nếu token đã hết hạn → gửi refresh
  const response = await Apis.post(endpoints.token, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });

  // if (!response.ok) {
  //   throw new Error('Refresh token failed');
  // }

  const newToken = response.data;

  cookie.save('token', newToken);

  return newToken.access_token;
}
