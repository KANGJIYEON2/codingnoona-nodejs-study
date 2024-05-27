import React, { Children } from "react";
import TodoPage from "../pages/TodoPage";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
