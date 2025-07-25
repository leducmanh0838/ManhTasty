import { useContext } from "react";
import { ActionType } from "../reducers/AuthReducer";
import { AppContext } from "../provides/AppProvider";

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