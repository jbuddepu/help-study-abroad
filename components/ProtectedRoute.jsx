import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [router, token]);

  if (!token) {
    return <Loader />;
  }

  return children;
};

export default ProtectedRoute;
