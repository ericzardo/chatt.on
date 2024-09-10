import { createBrowserRouter } from "react-router-dom";

import Home from "@pages/Home";
import AdminHome from "@pages/admin/Home";
import SignIn from "@pages/Sign/In";
import SignUp from "@pages/Sign/Up";
import ForgotPassword from "@pages/Sign/ForgotPassword";
import ResetPassword from "@pages/Sign/ResetPassword";
import ChatPage from "@pages/Chat";

import { SocketProvider } from "./context/SocketContext";

import Providers from "./context/Providers";

import AuthProtection from "./middlewares/AuthProtection";
import AdminProtection from "./middlewares/AdminProtection";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Providers >
        <Home />
      </Providers >
    ),
  },
  {
    path: "/c/:chatName",
    element: (
      <Providers >
        <AuthProtection>
          <SocketProvider>
            <ChatPage />
          </SocketProvider>
        </AuthProtection>
      </Providers>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <Providers >
        <SignUp />
      </Providers >
    ),
  },
  {
    path: "/sign-in",
    element: (
      <Providers >
        <SignIn />
      </Providers >
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <Providers >
        <ForgotPassword />
      </Providers >
    )
  },
  {
    path: "/reset-password/:token",
    element: (

      <Providers >
        <ResetPassword />
      </Providers >
    )
  },
  {
    path: "/admin/*",
    element: (
      <Providers >
        <AdminProtection>
          <AdminHome />
        </AdminProtection>
      </Providers>
    ),
  },
]);

export default router;
