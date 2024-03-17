import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Chat from "../pages/Chat";
import Auth from "../pages/Auth";
import SelectChat from "../pages/Chat/SelectChat";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Chat />,
        children: [{ path: "/", element: <SelectChat /> }],
      },
      {
        path: "/auth",
        element: <Auth />,
      },
    ],
  },
]);
