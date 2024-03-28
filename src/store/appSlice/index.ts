import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDocs, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { WritableDraft } from "immer";

export interface AppState {
  login: boolean;
  darkMode: boolean;
  value: string;
  chats: Chat[];
  isDrawerOpen: boolean;
}
export interface Chat {
  id: string;
  email: string;
  chats: OneMessage[];
}
export interface OneMessage {
  id:string
  email: string;
  messages: Message[];
  amount: number
}
export interface Message {
  mine: boolean;
  message: string;
  id: number
}

const initialState: AppState = {
  login: false,
  darkMode: false,
  value: "chats",
  chats: [],
  isDrawerOpen: false
};
export const getChats = createAsyncThunk("chats/fetchChats", async () => {
  try {
    const q = collection(db, 'users');
    const response = await getDocs(q);
    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
  }
  return [];
});
export const listenToChats = createAsyncThunk(
  "chats/listenToChats",
  async (_, { dispatch }) => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const chats: Chat[] = [];
      snapshot.forEach((doc) => {
  const id = doc.id; // Извлекаем id документа
  const { email, chats: chatData } = doc.data();
  const formattedChats = chatData.map((chat: any) => {
    return {
      ...chat,
      messages: chat.messages.map((message: any) => ({
        ...message,
      }))
    };
  });
  chats.push({ id, email, chats: formattedChats });
});

      dispatch(setChats(chats));
    });
    return unsubscribe;
  }
);


export const appSlice = createSlice({
  name: "app",
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
    setChats(state, action) {
      state.chats = action.payload
    },
    setIsDrawerOpen(state, action) {
      state.isDrawerOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getChats.fulfilled, (state, action) => {
      if (action.payload) {
        state.chats = action.payload as WritableDraft<Chat>[];
      }
    });
    builder.addCase(listenToChats.fulfilled, (state, action) => {
      state.chats = action.payload
    });
  },
});

export const { logIn, logOut, changeMode, changeValue, setChats, setIsDrawerOpen } = appSlice.actions;

export default appSlice.reducer;
