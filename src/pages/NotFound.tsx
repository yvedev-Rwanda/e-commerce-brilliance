import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.warn('Redirecting from non-existent route:', location.pathname);
    navigate('/', { replace: true });
  }, [navigate, location.pathname]);

  return null;
};

export default NotFound;
