import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}