import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyEmail from './components/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/common/LoadingSpinner';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Profile from './components/user/Profile';
import NutritionDashboard from './components/nutrition/NutritionDashboard';
import ActivityDashboard from './components/activity/ActivityDashboard';
import Workout from './components/workout/Workout';
import Challenges from './components/social/Challenges';

import { NutriProvider } from './context/NurtiContext';
import { UserProvider } from './context/UserContext';
import { SocialProvider } from './context/SocialContext';
import { WorkoutProvider } from './context/WorkoutContext';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
 
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }
 
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NutriProvider>
          <SocialProvider>
            <WorkoutProvider>
              <Router>
                <div className="App">
                  <Navbar />
                  <main>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />



                    
                      {/* Protected Routes */}
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />.
                      <Route path='/nutrition' element={<ProtectedRoute><NutritionDashboard /></ProtectedRoute>} />
                      <Route path='/activity' element={<ProtectedRoute><ActivityDashboard /></ProtectedRoute>} />
                      <Route path='/workout' element={<ProtectedRoute><Workout /></ProtectedRoute>} />
                      <Route path='/social' element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
                      

                    
                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </WorkoutProvider>
          </SocialProvider>
        </NutriProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;