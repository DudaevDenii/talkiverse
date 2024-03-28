import React, { useEffect, useState } from "react";
import ChatNav from "../modules/ChatNav/ChatNav";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { changeValue, getChats, listenToChats } from "../store/appSlice";
import { LinearProgress } from "@mui/material";
function Chat() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.app.chats);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(listenToChats());
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        async function requestChats() {
          await dispatch(getChats());
          setLoading(false);
        }
        requestChats();
      } else {
        dispatch(changeValue("login"));
        navigate("/auth");
      }
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    });
  }, []);
  return (
    <div>
      {loading ? (
        <LinearProgress />
      ) : (
        <ChatNav allChats={chats}>
          <Outlet />
        </ChatNav>
      )}
    </div>
  );
}

export default Chat;
