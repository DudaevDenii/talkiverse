import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeValue, logIn } from "../../store/appSlice";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [passwordUp, setPasswordUp] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loginUp, setLoginUp] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    login: {
      error: false,
      errorType: "",
    },
    pass: {
      error: false,
      errorType: "",
    },
    confPass: {
      error: false,
      errorType: "",
    },
  });
  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let hasErrors = false;
    if (passwordUp.length < 6) {
      hasErrors = true;
      setErrors((prev) => ({
        ...prev,
        pass: { error: true, errorType: "At least 6 symbols" },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        pass: { error: false, errorType: "" },
      }));
    }
    if (passwordUp !== confirmPass) {
      hasErrors = true;
      setErrors((prev) => ({
        ...prev,
        confPass: { error: true, errorType: "Passwords are not the same" },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confPass: { error: false, errorType: "" },
      }));
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginUp)) {
      hasErrors = true;
      setErrors((prev) => ({
        ...prev,
        login: { error: true, errorType: "Invalid email" },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        login: { error: false, errorType: "" },
      }));
    }
    if (!hasErrors) {
      try {
        await createUserWithEmailAndPassword(auth, loginUp, passwordUp);
        await addDoc(collection(db, "users"), {email: auth.currentUser?.email, chats: [{id: "Talkiverse", email: "Talkiverse@talkiverse.com",amount: 1, messages: [{id: 1, mine: false, message: "Hi! Welcome to Talkiverse messenger!"}]}]})
        dispatch(changeValue("chats"))
        navigate("/");
      } catch (error) {
        alert("User is already exist")
        console.error(error);
      }
    }
  }
  return (
    <div>
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
        onSubmit={(e) => register(e)}
      >
        <TextField
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Email"
          value={loginUp}
          onChange={(e) => setLoginUp(e.target.value)}
          error={errors.login.error}
          helperText={errors.login.errorType}
        />
        <TextField
          type={isShowPassword ? "text" : "password"}
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Password"
          value={passwordUp}
          onChange={(e) => setPasswordUp(e.target.value)}
          error={errors.pass.error}
          helperText={errors.pass.errorType}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type={isShowConfirmPassword ? "text" : "password"}
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Confirm Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          error={errors.confPass.error}
          helperText={errors.confPass.errorType}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                >
                  {isShowConfirmPassword ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
