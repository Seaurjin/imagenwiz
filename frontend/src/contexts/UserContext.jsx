import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from './AuthContext';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { token, user: authUser, isAuthenticated } = useAuthContext();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Update user data from auth context
    if (authUser) {
      setUser(authUser);
      setIsAdmin(authUser.is_admin || authUser.role === 'admin');
      setCredits(authUser.credits || 0);
      setLoading(false);
    } else if (!isAuthenticated && !token) {
      // Reset state when not authenticated
      setUser(null);
      setIsAdmin(false);
      setCredits(0);
      setLoading(false);
    }
  }, [authUser, isAuthenticated, token]);

  // Refresh user credits
  const refreshUserCredits = async () => {
    if (!token || !isAuthenticated) return;
    
    try {
      const response = await axios.get('/api/user/credits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.credits !== undefined) {
        setCredits(response.data.credits);
        
        // Also update the local user object
        setUser(prevUser => ({
          ...prevUser,
          credits: response.data.credits
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user credits:', error);
    }
  };

  const value = {
    user,
    isAdmin,
    credits,
    loading,
    refreshUserCredits
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;