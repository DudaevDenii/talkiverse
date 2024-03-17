import React, { useEffect, useState } from "react";
import ChatNav from "../modules/ChatNav/ChatNav";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { changeValue, getChats } from "../store/appSlice";
function Chat() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.app.chats);
  useEffect(() => {
    if (!auth.currentUser) {
      dispatch(changeValue("login"));
      navigate("/auth");
    } else {
      dispatch(getChats());
    }
  }, []);
  return (
    <div>
      <ChatNav allChats={chats}>
        <Outlet />
      </ChatNav>
    </div>
  );
}

export default Chat;
