import { Navigate, Outlet } from 'react-router-dom'

const RoleAccess = ({ roles = true }) => {
  return roles ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

export { RoleAccess }
