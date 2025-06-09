import {useAuth} from '../contexts/AuthContext';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {user, initializing} = useAuth();

    if (initializing)
        return (
            <div className = "h-screen flex items-center justify-center">
                <svg className = "animate-spin h-8 w-8 text-blue-600" viewBox = "0 0 24 24"> …</svg>
            </div>
        );
    return user ? children : <Navigate to = "/login" replace/>;
};

export default ProtectedRoute;
