import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Chat from "../pages/Chat";
import Auth from "../pages/Auth";
import SelectChat from "../pages/Chat/SelectChat";
import SelectedChat from "../pages/Chat/SelectedChat"
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Chat />,
        children: [{ path: "/", element: <SelectChat /> }, {path: "chat/:id", element: <SelectedChat/>}],
      },
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
]);
