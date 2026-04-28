import { Navigate } from 'react-router-dom'

export function ProtectedAdmin({ children }) {
  const isAdmin = sessionStorage.getItem('mgp_admin_auth') === 'true'

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export function ProtectedStaff({ children }) {
  const isStaff = sessionStorage.getItem('mgp_staff_auth') === 'true'

  if (!isStaff) {
    return <Navigate to="/staff-login" replace />
  }

  return children
}