import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Apple, 
  Activity, 
  Dumbbell, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X
} from 'lucide-react';
import FortisFitnessLogo from './FortisFitnessLogo';

const Navbar = () => {
  const { token, logout, user: authUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // First try to get user from AuthContext, then from localStorage
    if (authUser) {
      setUser(authUser);
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [authUser, token]);

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Nutrition', icon: Apple, path: '/nutrition' },
    { name: 'Activity', icon: Activity, path: '/activity' },
    { name: 'Workout', icon: Dumbbell, path: '/workout' },
    { name: 'Challenges', icon: Trophy, path: '/social' },
  ];

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('hihihihihi');
      
      setUser(null);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/signup');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('/')}
          >
            <FortisFitnessLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {token && navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-blue-400 group hover:cursor-pointer"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side - Profile & Auth */}
          <div className="flex items-center space-x-3">
            {token ? (
              <>
                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative hover:cursor-pointer">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors hover:cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.profile?.firstName || 'User'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 text-gray-800 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium">{user?.profile?.firstName} {user?.profile?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigation('/profile');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors hover:cursor-pointer"
                        >
                          <User className="h-4 w-4" />
                          <span>Manage Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavigation('/settings');
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors hover:cursor-pointer"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </button>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2 hover:cursor-pointer">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors hover:cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-3 space-y-2">
            {token && navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
            
            {token && (
              <div className="border-t border-slate-700 pt-3 mt-3">
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Manage Profile</span>
                </button>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;