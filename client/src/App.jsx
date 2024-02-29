import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'
import ProtectedRoutes from './components/ProtectedRoutes'
import PublicRoutes from './components/PublicRoutes'
import ApplyDoctor from './pages/ApplyDoctor'
import Notification from './pages/Notification'
import Users from './pages/admin/Users'
import Doctor from './pages/admin/Doctor'
import Profile from './pages/doctor/Profile'
import BookingPage from './pages/BookingPage'
import Appointments from './pages/Appointments'
import DoctorAppointments from './pages/doctor/DoctorAppointments'




function App() {

  const { loading } = useSelector(state => state.alerts)  // target reducer in store.jsx


  return (
    <>
      <BrowserRouter>
        {loading ? (<Spinner></Spinner>) :
          (
            <Routes>

              <Route path='/' element={<ProtectedRoutes><Homepage></Homepage></ProtectedRoutes>}></Route>

              <Route path='/login' element={<PublicRoutes><Login></Login></PublicRoutes>}></Route>

              <Route path='/register' element={<PublicRoutes><Register></Register></PublicRoutes>}></Route>

              <Route path='/apply-doctor' element={<ProtectedRoutes><ApplyDoctor></ApplyDoctor></ProtectedRoutes>}></Route>

              <Route path='/notification' element={<ProtectedRoutes><Notification></Notification></ProtectedRoutes>}></Route>

              <Route path='/admin/users' element={<ProtectedRoutes><Users></Users></ProtectedRoutes>}></Route>

              <Route path='/admin/doctors' element={<ProtectedRoutes><Doctor></Doctor></ProtectedRoutes>}></Route>

              <Route path='/doctor/profile/:id' element={<ProtectedRoutes><Profile></Profile></ProtectedRoutes>}></Route>

              <Route path='/doctor/book-appointment/:doctorId' element={<ProtectedRoutes><BookingPage></BookingPage></ProtectedRoutes>}></Route>

              <Route path='/appointments' element={<ProtectedRoutes><Appointments></Appointments></ProtectedRoutes>}></Route>

              <Route path='/doctor-appointments' element={<ProtectedRoutes><DoctorAppointments></DoctorAppointments></ProtectedRoutes>}></Route>


            </Routes>
          )
        }
      </BrowserRouter>
    </>
  )
}

export default App
