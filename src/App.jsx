import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import OrderPage from './pages/OrderPage'
import OrderStatusPage from './pages/OrderStatusPage'
import RentalPage from './pages/RentalPage'
import NoticePage from './pages/NoticePage'
import AdminPage from './pages/AdminPage'
import AdminRentalPage from './pages/AdminRentalPage'
import AdminOrderPage from './pages/AdminOrderPage'

function ProtectedAdmin({ children }) {
  const isAuthed = sessionStorage.getItem('mgp_admin_auth') === 'true'

  if (!isAuthed) {
    return <Navigate to="/admin" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderPage />} />
      <Route path="/order-status" element={<OrderStatusPage />} />
      <Route path="/rental" element={<RentalPage />} />
      <Route path="/notice" element={<NoticePage />} />

      <Route path="/admin" element={<AdminPage />} />

      <Route
        path="/admin/rental"
        element={
          <ProtectedAdmin>
            <AdminRentalPage />
          </ProtectedAdmin>
        }
      />

      <Route
        path="/admin/order"
        element={
          <ProtectedAdmin>
            <AdminOrderPage />
          </ProtectedAdmin>
        }
      />
    </Routes>
  )
}

export default App