import React from 'react'
import '../styles/Layout.css'
import { Badge, message } from 'antd'
import { userMenu, adminMenu } from '../Data/data'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Layout = ({ children }) => {

  const { user } = useSelector(state => state.user)
  const location = useLocation();
  const navigate = useNavigate();

  // logout function

  const handlelogout = () => {
    localStorage.clear()
    message.success("Logout Successfully")
    navigate("/login")
  }


  // =========== doctor menu ===============
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",

      icon: "fa-solid fa-list",
    },

    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  // =========== doctor menu ===============


  //rendering menu list
  // const SidebarMenu = user?.isAdmin ? adminMenu : userMenu
  const SidebarMenu = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;

  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>DOCTRR</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map(menu => {

                const isActive = location.pathname === menu.path
                // location.pathname: This represents the current URL path in a web application. It tells you which page or route the user is currently viewing.

                return (
                  <>
                    <div className={`menu-item ${isActive && 'active'}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>

                  </>
                )
              })}

              <div className={`menu-item`} onClick={handlelogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to='/login'>Logout</Link>
              </div>

            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>

                {/* <Badge count={user && user.notification.length}>
                  <i className='fa-solid fa-bell'></i>
                </Badge> */}

                <Badge
                  count={user && user.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i class="fa-solid fa-bell"></i>
                </Badge>
                <Link to='/profile'>{user?.name}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout