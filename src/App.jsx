import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import OrderPage from './pages/OrderPage'
import OrderStatusPage from './pages/OrderStatusPage'
import RentalPage from './pages/RentalPage'
import NoticePage from './pages/NoticePage'

import AdminPage from './pages/AdminPage'
import AdminRentalPage from './pages/AdminRentalPage'
import AdminOrderPage from './pages/AdminOrderPage'
import AdminStaffPage from './pages/AdminStaffPage'
import AdminOrganizationPage from './pages/AdminOrganizationPage'
import AdminNoticePage from './pages/AdminNoticePage'
import { ProtectedAdmin, ProtectedStaff } from './components/ProtectedRoute'

import StaffSignupPage from './pages/StaffSignupPage'
import StaffLoginPage from './pages/StaffLoginPage'
import StaffPage from './pages/StaffPage'
import StaffOrderPage from './pages/StaffOrderPage'
import PortalPage from './pages/PortalPage'
import OrganizationPage from './pages/OrganizationPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/order" element={<OrderPage />} />
      <Route path="/order-status" element={<OrderStatusPage />} />
      <Route path="/rental" element={<RentalPage />} />
      <Route path="/notice" element={<NoticePage />} />

      <Route path="/portal" element={<PortalPage />} />
      <Route path="/organization" element={<OrganizationPage />} />

      <Route path="/staff-signup" element={<StaffSignupPage />} />
      <Route path="/staff-login" element={<StaffLoginPage />} />

      <Route
  path="/staff"
  element={
    <ProtectedStaff>
      <StaffPage />
    </ProtectedStaff>
  }
/>

      <Route
        path="/staff/orders"
        element={
          <ProtectedStaff>
            <StaffOrderPage />
          </ProtectedStaff>
        }
      />

      <Route
  path="/admin"
  element={
    <ProtectedAdmin>
      <AdminPage />
    </ProtectedAdmin>
  }
/>

      <Route
        path="/admin/rental"
        element={
          <ProtectedAdmin>
            <AdminRentalPage />
          </ProtectedAdmin>
        }
      />

      <Route
  path="/admin/orders"
  element={
    <ProtectedAdmin>
      <AdminOrdersPage />
    </ProtectedAdmin>
  }
/>

      <Route
  path="/admin/staff"
  element={
    <ProtectedAdmin>
      <AdminStaffPage />
    </ProtectedAdmin>
  }
/>

      <Route
        path="/admin/organization"
        element={
          <ProtectedAdmin>
            <AdminOrganizationPage />
          </ProtectedAdmin>
        }
      />

      <Route
  path="/admin/notices"
  element={
    <ProtectedAdmin>
      <AdminNoticePage />
    </ProtectedAdmin>
  }
/>
    </Routes>
  )
}

export default App