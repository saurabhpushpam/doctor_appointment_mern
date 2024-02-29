import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoutes = ({ children }) => {

  if (localStorage.getItem("token")) {
    return <Navigate to="/"></Navigate>
  }
  else {
    return children;
  }

}

export default PublicRoutes

// In React, children is a special prop that is used to pass components or elements directly into another component. It represents the content that is passed between the opening and closing tags of a component, in App.jsx in between PublicRoutes we have sent login, register so if it will get token then redirect to homepage, or if there is no token then we can by using /login go to login page or by using /register go to register

// that means if token is available we cant go to the login or register page