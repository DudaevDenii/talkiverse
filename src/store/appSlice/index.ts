import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { WritableDraft } from "immer";

export interface AppState {
  login: boolean;
  darkMode: boolean;
  value: string;
  chats: Chat[];
}
export interface Chat {
  id: string;
  email: string;
  chats: OneMessage[];
}
export interface OneMessage {
  taker: string;
  messages: Message[];
}
export interface Message {
  mine: boolean;
  message: string;
}

const initialState: AppState = {
  login: false,
  darkMode: false,
  value: "chats",
  chats: [],
};
export const getChats = createAsyncThunk("chats/fetchChats", async () => {
  try {
    const response = await getDocs(collection(db, "users"));
    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
  }
  return [];
});

export const appSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    logIn(state) {
      state.login = true;
    },
    logOut(state) {
      state.login = false;
    },
    changeMode(state) {
      state.darkMode = !state.darkMode;
    },
    changeValue(state, action) {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      if (action.payload) {
        state.chats = action.payload as WritableDraft<Chat>[];
        console.log(state.chats);
      }
    });
  },
});

export const { logIn, logOut, changeMode, changeValue } = appSlice.actions;

export default appSlice.reducer;
