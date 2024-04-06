import React, { useState, useEffect, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useParams } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import {
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@emotion/react";
import { addDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const SelectedChat = () => {
  const { chats, isDrawerOpen } = useSelector((state: RootState) => state.app);
  const [sendInput, setSendInput] = useState("");
  const params = useParams();
  const theme: any = useTheme();
  const me = chats.find((chat) => chat.email === auth.currentUser?.email);
  const currentChat = me?.chats.find((current) => current.id === params.id);
  const sortCurrentChat = {
    ...currentChat,
  };
  async function sendMessage(e: FormEvent) {

    e.preventDefault()
    if (sendInput === "") {
      return;
    }
    if(params.id === "Talkiverse") {
      const meRef = doc(db, "users", `${me?.id}`)
      const meSnap = await getDoc(meRef)
      const meData = meSnap.data()
      meData!.chats.forEach((chat:any) => {
        if(chat.id === params.id){
          chat.messages.push({
            message: sendInput,
            mine: true,
            id: Date.now(),
          })
        } 
      })
      await updateDoc(meRef, meData!)
      setSendInput("")
      return;
    }
    const meRef = doc(db, "users", `${me?.id}`)
    const takerRef = doc(db, "users", `${currentChat?.id}`)
    const meSnap = await getDoc(meRef)
    const takerSnap = await getDoc(takerRef)
    const meData = meSnap.data()
    const takerData = takerSnap.data()
    meData!.chats.forEach((chat: any) => {
      if(chat.id === params.id){
        chat.messages.push({
          message: sendInput,
          mine: true,
          id: Date.now(),
        })
      } 
    })
    takerData!.chats.forEach((chat: any) => {
      if(chat.id === me?.id){
        chat.messages.push({
          message: sendInput,
          mine: false,
          id: Date.now(),
        })
      }} )
      await updateDoc(meRef, meData!)
      await updateDoc(takerRef, takerData!)
      setSendInput("")
  }
  return (
    <div style={{ position: "relative", height: "80vh" }}>
      <div style={{ height: "calc(100% - 56px)", overflowY: "auto" }}>
        {sortCurrentChat?.messages !== undefined ? (
          sortCurrentChat?.messages.map((message) => (
            <Paper
              elevation={3}
              style={{ padding: "10px", marginBottom: "10px" }}
              key={message.id}
              //@ts-ignore
              sx={{
                color: theme.palette.mode === "dark" && message.mine && "black",
                background: message.mine
                  && theme.palette.primary.light,
              }}
            >
              <Typography variant="subtitle1">{message.mine ? "Me" : currentChat?.email}</Typography>
              <Typography variant="body1">{message.message}</Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="h3">Start a conversation</Typography>
        )}
      </div>
          <form onSubmit={(e)=>sendMessage(e)}>

      <TextField
        value={sendInput}
        onChange={(e) => setSendInput(e.target.value)}
        fullWidth
        InputProps={{
          style: { textAlign: "left" },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ bottom: 0 }}
      />
          </form>

    </div>
  );
};

export default SelectedChat;
