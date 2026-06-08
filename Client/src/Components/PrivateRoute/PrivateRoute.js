import { Navigate } from 'react-router-dom';
import { getUserInformation } from '../../Api/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('accessToken');
  const user = getUserInformation();

  if (!token) {
    return <Navigate to="/signIn" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
