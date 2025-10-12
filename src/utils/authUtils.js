import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react'; // Import useState và useEffect
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug
    if (!token) {
      navigate('/admin/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // Debug
      const userRole = decodedToken.role || decodedToken.roles || decodedToken.userRole; // Thử nhiều key
      console.log('User Role:', userRole); // Debug

      if (!userRole || userRole.toLowerCase() !== 'admin') {
        navigate('/admin/login', { state: { from: location.pathname } });
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token decode error:', error); // Debug
      navigate('/admin/login', { state: { from: location.pathname } });
    }
  }, [navigate, location.pathname]);

  return isAuthenticated;
};

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = useAuth(); // Sử dụng custom hook

    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
};