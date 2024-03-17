import { Button, TextField, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

function SignIn() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [passwordIn, setPasswordIn] = useState("");
  const [loginIn, setLoginIn] = useState("");
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
      >
        <TextField
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Email"
          value={loginIn}
          onChange={(e) => setLoginIn(e.target.value)}
        />
        <TextField
          fullWidth={isMobile}
          style={!isMobile ? { width: "60%" } : {}}
          placeholder="Password"
          value={passwordIn}
          onChange={(e) => setPasswordIn(e.target.value)}
        />
        <Button
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
