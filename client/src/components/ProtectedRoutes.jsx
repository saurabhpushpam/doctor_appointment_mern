import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import axios from 'axios'
import { setUser } from '../redux/features/userSlice'

const ProtectedRoutes = ({ children }) => {

  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)

  // get user
  //eslint-disable-next-line
  const getUser = async () => {
    try {
      dispatch(showLoading())
      const res = await axios.post('http://localhost:8000/api/getuserbyid',
        {
          token: localStorage.getItem('token')
        },
        {
          headers: {
            // Authorization: `Bearer ${localStorage.getItem('token')}`
            Authorization: `${localStorage.getItem('token')}`
          }
        }
      )

      dispatch(hideLoading())

      if (res.data.success) {
        dispatch(setUser(res.data.data))
      }
      else {
        <Navigate to='/login'></Navigate>
        localStorage.clear()
      }

    }
    catch (error) {
      dispatch(hideLoading())
      localStorage.clear()
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser])

  if (localStorage.getItem("token")) {
    return children
  }
  else {
    return <Navigate to="/login"></Navigate>
  }

}

export default ProtectedRoutes

// In React, children is a special prop that is used to pass components or elements directly into another component. It represents the content that is passed between the opening and closing tags of a component, in App.jsx in between ProtectedRoutes we have sent homepage so if it will get token that means user is logged in then it will return children means homepage will open