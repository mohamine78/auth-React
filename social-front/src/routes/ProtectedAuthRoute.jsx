import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedAuthRoute = () => {
  const token = Cookies.get('token');

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedAuthRoute;
