import { Button, IconButton, InputAdornment, TextField, useMediaQuery } from "@mui/material";
import React, { FormEvent, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeValue } from "../../store/appSlice";
function SignIn() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [passwordIn, setPasswordIn] = useState("");
  const [loginIn, setLoginIn] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  async function submitSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if(passwordIn === "" || loginIn === ""){
      alert("Please fill out all fields");
    }else{
      try{
        await signInWithEmailAndPassword(auth, loginIn, passwordIn)
        dispatch(changeValue("chats"))
        navigate("/")
      }catch(err){
        alert("Incorrect email or password")
        console.error(err)
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
        onSubmit={(e) => submitSignIn(e)}
      >
        <TextField
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Email"
          value={loginIn}
          onChange={(e) => setLoginIn(e.target.value)}
        />
<TextField
          type={isShowPassword ? "text" : "password"}
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Password"
          value={passwordIn}
          onChange={(e) => setPasswordIn(e.target.value)}
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
        <Button
        type="submit"
          variant="contained"
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
        >
          Sign In
        </Button>
      </form>
    </div>
  );

        }
export default SignIn;
