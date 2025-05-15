import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  // Try to load user from localStorage
  const storedUser = localStorage.getItem('user');
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(localStorage.getItem("token"));
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

  // Custom setUser function that also updates localStorage
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("Updated user in localStorage:", userData.username);
    } else {
      localStorage.removeItem('user');
      console.log("Removed user from localStorage");
    }
  };

  // Set token in axios headers and localStorage
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      console.log("[AuthContext] setAuthToken: SUCCESSFULLY SET localStorage 'token' to:", token ? token.substring(0, 15) + '...' : 'null | undefined');
      console.log("[AuthContext] setAuthToken: localStorage.getItem('token') now returns:", localStorage.getItem("token") ? localStorage.getItem("token").substring(0,15)+'...' : 'null | undefined');
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("[AuthContext] setAuthToken: CLEARED localStorage 'token' and 'user'");
    }
  };

  // Register user
  const register = async (username, password) => {
    try {
      setError(null);
      console.log("Attempting registration for:", username);
      
      // Use correct URL with API prefix for Express proxy
      const registerUrl = "/api/auth/register";
      console.log("Making registration request to:", registerUrl);
      
      const res = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Registration response:", data);

      setToken(data.access_token);
      updateUser(data.user);
      setAuthToken(data.access_token);
      return data;
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    }
  };

  // Login user with better error handling and debugging
  const login = async (username, password) => {
    try {
      setError(null);
      console.log("[AuthContext] login: Attempting for:", username);

      // Direct fetch approach with Express proxy route
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const loginUrl = `/api/auth/login?t=${timestamp}`;
      console.log("Making fetch request to:", loginUrl);
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log("[AuthContext] login: API Response data:", data);

      if (!data.access_token) {
        console.error("[AuthContext] login: No access_token in response!");
        throw new Error("Missing access_token in login response");
      }
      if (!data.user) {
        console.error("[AuthContext] login: No user data in response!");
        throw new Error("Missing user data in login response");
      }

      console.log("[AuthContext] login: Preparing to call setToken and setAuthToken with token:", data.access_token ? data.access_token.substring(0,15)+'...' : 'null | undefined');
      setToken(data.access_token);
      updateUser(data.user);
      setAuthToken(data.access_token); // This call should store it
      console.log("[AuthContext] login: FINISHED setting token and user state. localStorage token should now be set.");
      return data;
    } catch (err) {
      console.error("[AuthContext] login: Login error:", err.message, err.stack);
      setError(err.message || "Login failed. Check your credentials.");
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    updateUser(null);
    setAuthToken(null);
  };
  
  // Refresh user data from backend with rate limiting
  const refreshUser = async () => {
    if (!token) return;
    
    try {
      // Rate limiting check - only refresh if it's been more than 60 seconds since last refresh
      const currentTime = Date.now();
      const timeSinceLastRefresh = currentTime - lastUserRefreshTime.current;
      
      // If the last refresh was less than 60 seconds ago, use cached data
      if (timeSinceLastRefresh < userRefreshLimit) {
        console.log(`Rate limited: User data refreshed recently (${Math.round(timeSinceLastRefresh / 1000)}s ago). Using cached data.`);
        // Return the current user data from state
        return user;
      }
      
      // Update the last refresh time
      lastUserRefreshTime.current = currentTime;
      
      // Force clear any possible browser cache with unique timestamp and cache control headers
      const userTimestamp = currentTime;
      const userUrl = `/api/auth/user?forceRefresh=${userTimestamp}`;
      console.log("Refreshing user data from:", userUrl);
      const response = await fetch(userUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log("Refreshed user data:", data);

      // Handle different response formats
      if (data.user) {
        updateUser(data.user);
      } else if (data && data.id) {
        updateUser(data);
      } else {
        throw new Error("Invalid user data format");
      }
      
      return data;
    } catch (err) {
      console.error("Error refreshing user:", err);
      return null;
    }
  };
  
  // Force a complete refresh with rate limiting
  const forceRefreshUserData = async () => {
    try {
      // Rate limiting check for force refresh
      // We'll allow force refresh to bypass rate limiting for manual user actions
      // But still track the last refresh time
      const currentTime = Date.now();
      const timeSinceLastRefresh = currentTime - lastUserRefreshTime.current;
      
      // Log whether we're rate-limiting this request
      if (timeSinceLastRefresh < userRefreshLimit) {
        console.log(`Force refresh requested, bypassing rate limit (${Math.round(timeSinceLastRefresh / 1000)}s since last refresh)`);
      }
      
      // Update the last refresh time regardless
      lastUserRefreshTime.current = currentTime;
      
      // First clear user data
      updateUser(null);
      
      // Then fetch fresh data from server with cache-busting
      if (token) {
        const timestamp = currentTime;
        const userUrl = `/api/auth/user?forceRefresh=${timestamp}`;
        console.log("Force refreshing user data from:", userUrl);
        
        const response = await fetch(userUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("Force refreshed user data:", data);

        // Update user data with latest from server
        if (data.user) {
          updateUser(data.user);
        } else if (data && data.id) {
          updateUser(data);
        } else {
          throw new Error("Invalid user data format");
        }
        
        return data;
      }
    } catch (err) {
      console.error("Error force refreshing user:", err);
      return null;
    }
  };

  // Check if user is authenticated on load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        console.log("[AuthContext] useEffect: Token found in state, attempting to load user. Token:", token.substring(0,15)+'...');
        let clearTokenAndUser = false;
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const userTimestamp = new Date().getTime();
          const userUrl = `/api/auth/user?t=${userTimestamp}`;
          console.log("[AuthContext] useEffect: Making user fetch request to:", userUrl);
          const response = await fetch(userUrl, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (!response.ok) {
            console.error(`[AuthContext] useEffect: HTTP error ${response.status} fetching user. Status: ${response.statusText}`);
            if (response.status === 401 || response.status === 403) {
              console.warn("[AuthContext] useEffect: Token rejected by server when fetching user.");
              clearTokenAndUser = true; // Token is invalid according to the server
            }
            // For other server errors (5xx), don't clear the token, server might be temporarily down.
          }

          if (!clearTokenAndUser) {
            const data = await response.json();
            console.log("[AuthContext] useEffect: User data response:", data);
            if (data.user) {
              updateUser(data.user);
            } else if (data && data.id) {
              updateUser(data);
            } else {
              console.error("[AuthContext] useEffect: Invalid user data format from /api/auth/user.");
              // Potentially clear token if user data is essential and format is wrong, 
              // but for now, let's assume a malformed response isn't a token issue itself.
            }
          }
        } catch (err) {
          console.error("[AuthContext] useEffect: Error during loadUser process (e.g., network issue fetching user):", err);
          // Don't clear token for general network errors. Only if server explicitly rejects token (401/403)
        }

        if (clearTokenAndUser) {
          console.log("[AuthContext] useEffect: Clearing token and user due to server rejection of token.");
          setToken(null);
          updateUser(null);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        register,
        login,
        logout,
        refreshUser,
        forceRefreshUserData,
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
