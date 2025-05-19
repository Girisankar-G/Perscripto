import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointment from './pages/Doctor/DoctorAppointment'
import DoctorList from './pages/Admin/DoctorsList'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      {aToken || dToken ? (
        <>
          <Navbar />
          <div className='flex items-start'>
            <SideBar />
            <Routes>
              {/** Admin */}
              <Route path='/' element={<Dashboard />} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllAppointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-list' element={<DoctorList />} />

              {/** Doctor */}
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/doctor-appointments' element={<DoctorAppointment />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />

              {/** Redirect to dashboard if no route matches */}
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <Login />
          <ToastContainer />
        </>
      )}
    </div>
  )
}

export default App
