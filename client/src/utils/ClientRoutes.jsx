import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const ClientRoutes = () => {
    const { token, role } = useSelector(state => state.Auth)
    return (
        token && role == "user" ? <Outlet /> : <Navigate to="/" />
    )
}

export default ClientRoutes