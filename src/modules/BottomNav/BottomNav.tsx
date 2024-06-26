import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LightModeIcon from "@mui/icons-material/LightMode";
import ChatIcon from "@mui/icons-material/Chat";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { changeMode, changeValue } from "../../store/appSlice/index";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
export default function LabelBottomNavigation() {
  const dispatch: AppDispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false)
  const value = useSelector((state: RootState) => state.app.value);
  const navigate = useNavigate();
  useEffect(() => {
    switch (value) {
      case "chats":
        navigate("/");
        break;
      case "login":
        navigate("/auth");
        break;
      case "logout":
        navigate("/");
        break;

      default:
        break;
    }
  }, [value]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
  })})
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (newValue !== "") {
      dispatch(changeValue(newValue));
    }
  };

  return (
    <BottomNavigation
      sx={{ width: 500 }}
      value={value}
      onChange={handleChange}
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <BottomNavigationAction label="Chats" value="chats" icon={<ChatIcon />} />
      <BottomNavigationAction
        label="Mode"
        value=""
        icon={<LightModeIcon />}
        onClick={() => dispatch(changeMode())}
      />
      {isLogin ? (
        <BottomNavigationAction
          label="Logout"
          value=""
          icon={<LogoutIcon />}
          onClick={() => auth.signOut().then(() => {}).catch((err) => console.error(err))}
        />
      ) : (
        <BottomNavigationAction
          label="Login"
          value="login"
          icon={<LoginIcon />}
        />
      )}
    </BottomNavigation>
  );
}
