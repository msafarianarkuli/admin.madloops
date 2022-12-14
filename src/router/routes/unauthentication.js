import { lazy } from "react";

const Error = lazy(() => import("../../views/Error"));
const Login = lazy(() => import("../../views/LoginBasic"));
const Register = lazy(() => import("../../views/RegisterBasic"));

const UnAuthentication = [
  {
    path: "/login",
    element: <Login />,
    layout: "BlankLayout",
    meta: {
      publicRoute: true,
      restricted: true,
      layout: "blank",
    },
    auth: false,
  },
  {
    path: "/register",
    element: <Register />,
    layout: "BlankLayout",
    meta: {
      publicRoute: true,
      layout: "blank",
      restricted: true,
    },
    auth: false,
  },
  {
    path: "*",
    element: <Error />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
    },
    auth: false,
  },
];
export default UnAuthentication;
