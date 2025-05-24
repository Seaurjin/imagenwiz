import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rate limiting for user refresh - track last refresh time
  const lastUserRefreshTime = useRef(0);
  const userRefreshLimit = 60000; // 60 seconds in milliseconds

  // Set up axios defaults - use relative URLs to ensure proxy works correctly
  axios.defaults.baseURL = '';  // Empty baseURL to use relative URLs

  // Debug our environment
  console.log("React environment:", import.meta.env);
  console.log("Current axios baseURL:", axios.defaults.baseURL);

  console.log("[AuthContext] Initial localStorage token:", localStorage.getItem("token") ? localStorage.getItem("token").substring(0,15)+'...' : 'null | undefined');

  // Function to get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('[AuthContext] Retrieved token from localStorage:', token ? `${token.substring(0, 15)}...` : 'null');
    return token;
  };

  // Function to get cookie value
  const getCookie = (name) => {
    console.log('[AuthContext] Attempting to get cookie:', name);
    const value = `; ${document.cookie}`;
    console.log('[AuthContext] Full document.cookie:', value);
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const token = parts.pop().split(';').shift();
      console.log('[AuthContext] Retrieved access_token from cookies:', token ? `${token.substring(0, 15)}...` : 'null');
      return token;
    }
    console.log('[AuthContext] No access_token found in cookies');
    return null;
  };

  // Function to set cookie
  const setCookie = (name, value, days = 1) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    console.log('[AuthContext] Set access_token cookie:', value ? `${value.substring(0, 15)}...` : 'null');
  };

  // Function to remove cookie
  const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    console.log('[AuthContext] Removed access_token cookie');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      // Prioritize token from state, fallback to cookie
      const currentToken = token || getCookie('access_token');

      if (!currentToken) {
        console.error('[AuthContext] No authentication token found for refreshUser');
        throw new Error('No authentication token found');
      }

      console.log('[AuthContext] Fetching user data with token:', `${currentToken.substring(0, 15)}...`);
      const response = await axios.get('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data) {
        throw new Error('Failed to fetch user data');
      }

      console.log('[AuthContext] Successfully fetched user data:', response.data);
      updateUser(response.data);
      return response.data;
    } catch (err) {
      console.error('[AuthContext] Error refreshing user:', err);
      throw err;
    }
  };

  // Handle Google authentication callback
  const handleGoogleCallback = async (token) => {
    try {
      console.log('[AuthContext] Handling Google callback with token:', token ? `${token.substring(0, 15)}...` : 'null');
      setError(null);
      setToken(token);
      setCookie('access_token', token);
      
      // Fetch user data
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      console.log('[AuthContext] Successfully fetched user data after Google callback:', data);
      updateUser(data);
      return data;
    } catch (err) {
      console.error('[AuthContext] Google auth callback error:', err);
      setError(err.message || 'Google authentication failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    removeCookie('access_token');
  };

  // Login function
  const login = async (username, password) => {
    try {
      console.log('[AuthContext] Attempting to log in user:', username);
      setError(null);
      setLoading(true);

      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });

      if (!response.data || !response.data.access_token) {
        throw new Error('Login failed: Invalid response from server.');
      }

      const token = response.data.access_token;
      console.log('[AuthContext] Login successful, received token:', `${token.substring(0, 15)}...`);
      setToken(token);
      setCookie('access_token', token);
      
      // Attempt to fetch user data immediately after login
      await refreshUser();

      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      setLoading(false);
      // Propagate error to handleSubmit for display
      throw err;
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (user) { return; }
      console.log('[AuthContext] Running initial auth check on mount');
      try {
        console.log('[AuthContext] Calling getCookie for access_token in checkAuth');
        const token = getCookie('access_token');
        if (token) {
          console.log('[AuthContext] Found existing token:', `${token.substring(0, 15)}...`);
          setToken(token);
          await refreshUser();
        } else {
          console.log('[AuthContext] No existing token found');
        }
      } catch (err) {
        console.error('[AuthContext] Auth check error:', err);
        removeCookie('access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        refreshUser,
        handleGoogleCallback,
        logout,
        login,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
