import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useUser();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
