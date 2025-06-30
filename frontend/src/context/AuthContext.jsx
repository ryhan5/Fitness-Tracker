// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authAPI } from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       setIsAuthenticated(true);
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await authAPI.login({ email, password });
//       const { accessToken, user } = response.data;
      
//       localStorage.setItem('accessToken', accessToken);
//       setUser(user);
//       setIsAuthenticated(true);
      
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       const response = await authAPI.signup(userData);
//       return { 
//         success: true, 
//         message: response.data.message 
//       };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Signup failed' 
//       };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authAPI.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('accessToken');
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   const forgotPassword = async (email) => {
//     try {
//       const response = await authAPI.forgotPassword(email);
//       return { 
//         success: true, 
//         message: response.data.message 
//       };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Failed to send reset email' 
//       };
//     }
//   };

//   const resetPassword = async (token, newPassword) => {
//     try {
//       const response = await authAPI.resetPassword({ token, newPassword });
//       return { 
//         success: true, 
//         message: response.data.message 
//       };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Password reset failed' 
//       };
//     }
//   };

//   const verifyEmail = async (token) => {
//     try {
//       const response = await authAPI.verifyEmail(token);
//       return { 
//         success: true, 
//         message: response.data.message 
//       };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Email verification failed' 
//       };
//     }
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     signup,
//     logout,
//     forgotPassword,
//     resetPassword,
//     verifyEmail,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount, check if token exists and validate it
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { accessToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await authAPI.resetPassword({ token, newPassword });
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed',
      };
    }
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
