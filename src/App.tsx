import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./modules/BottomNav/BottomNav";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./store";
function App() {
  const darkMode = useSelector((state: RootState) => state.app.darkMode);
  const theme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Outlet />
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}

export default App;
