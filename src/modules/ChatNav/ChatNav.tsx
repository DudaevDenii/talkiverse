import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Chat, Message, getChats, setChats, setIsDrawerOpen } from "../../store/appSlice";
import { auth, db } from "../../config/firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, TextField } from "@mui/material";
import {
  FieldValue,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({
  children,
  allChats,
}: {
  children: React.ReactNode;
  allChats: Chat[];
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const me = allChats.find(
    (el: Chat) => el.email === auth.currentUser?.email
  );
  const [findUser, setFindUser] = React.useState("");
  const [isFindOpen, setIsFindOpen] = React.useState(false);
  const [foundChat, setFoundChat] = React.useState<Chat | undefined>();
  const isDrawerOpen = useSelector((state: RootState) => state.app.isDrawerOpen)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleDrawerOpen = () => {
    setOpen(true);
    setIsDrawerOpen(true)
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setIsDrawerOpen(false)

  };
  function findUserFunc() {
    if (findUser === "") {
      alert("Fill out the field");
      return;
    }
    const isUserInMyList = me?.chats.some((el) => el.email === findUser);
    let findChats;
    if (!isUserInMyList) {
      findChats = allChats.find(
        (user) => user.email !== me?.email && user.email === findUser
      );
    }

    setIsFindOpen(true);
    setFoundChat(findChats);
    setFindUser("");
  }
  function setFindUserField(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.charAt(e.target.value.length - 1) !== " ") {
      setFindUser(e.target.value);
    }
  }

  async function addToChats() {
    if (foundChat) {
      const returnChat = {
        id: foundChat.id,
        email: foundChat.email,
        messages: [],
        amount: 0
      };
      const returnTakerChat = {
        id: me?.id,
        email: me?.email,
        messages: [],
        amount: 0
      };
      
      const foundChatRef = doc(db, "users", `${me?.id}`);
      const takerChatRef = doc(db, "users", `${foundChat?.id}`)
      const foundCollection = collection(db, "users");
      try {

        await updateDoc(foundChatRef, {
          chats: arrayUnion(returnChat)
        });
        await updateDoc(takerChatRef, {
          chats: arrayUnion(returnTakerChat)
        })
        const newData: Chat[] = [];
        const snapshot = await getDocs(foundCollection);
        snapshot.forEach((doc) => {
          newData.push({ id: doc.id, ...(doc.data() as any) });
        });
        dispatch(setChats(newData))
        setIsFindOpen(false);
        setFoundChat(undefined);

      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <Box sx={{ display: "flex" }}>
      {" "}
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Talkiverse
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <ListItem>
          <TextField
            fullWidth
            placeholder="User's email"
            value={findUser}
            onChange={(e) => setFindUserField(e)}
          />
        </ListItem>
        <ListItem>
          {isFindOpen ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsFindOpen(false)}
            >
              Close
            </Button>
          ) : (
            <Button variant="contained" fullWidth onClick={findUserFunc}>
              Find
            </Button>
          )}
        </ListItem>
        {isFindOpen && (
          <ListItem disablePadding>
            {foundChat ? (
              <ListItemButton onClick={addToChats}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    foundChat.email.length > 20
                      ? foundChat.email.slice(0, 20) + "..."
                      : foundChat.email
                  }
                />
              </ListItemButton>
            ) : (
              <ListItem>
              <ListItemText primary={"User is not found"} />
              </ListItem>
            )}
          </ListItem>
        )}

        <List>
          {me?.chats.length === 0 ? (
            <ListItem>You have no chats yet</ListItem>
          ) : (
            <>
              <Divider />
              {me?.chats.map((el) => (
                <ListItem disablePadding key={el.id}>
                  <ListItemButton onClick={() => navigate(`/chat/${el.id}`)}>
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                    el.email.length > 20
                      ? el.email.slice(0, 20) + "..."
                      : el.email
                  } />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          )}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
