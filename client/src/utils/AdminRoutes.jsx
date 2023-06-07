import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const AdminRoutes = () => {
    const { token, role } = useSelector(state => state.Auth)
    return (
        token && role == "admin" ? <Outlet /> : <Navigate to="/" />
    )
}

export default AdminRoutes