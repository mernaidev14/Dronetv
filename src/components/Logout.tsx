import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from './context/context';

export default function Logout() {
  const { logout } = useUserAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
}