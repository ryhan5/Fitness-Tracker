import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FortisFitnessLogo from './FortisFitnessLogo';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-l from-gray-800 via-gray-700 to-gray-800 text-white shadow-md">
      {/* Logo */}
      <div
        className="text-2xl  cursor-pointer"
        onClick={() => navigate('/')}
      >
        <FortisFitnessLogo />
      </div>

      {/* dashboard */}
      <div className="">
        <button
          className='px-4 py-2 border-2 border-blue-800 bg-gray-50 hover:bg-blue-400 text-black  rounded-md transition hover:cursor-pointer'
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
      </div>

      {/* Auth Buttons */}
      <div className="space-x-4">
        {token ? (
          <button
            onClick={logout}
            className="px-4 py-2 border-2 border-red-800 bg-gray-50 hover:bg-red-400 text-black  rounded-md transition hover:cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 border-2 border-green-500 bg-gray-50 hover:bg-green-400 text-black  rounded-md transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border-2 border-blue-500 bg-gray-50 hover:bg-blue-400 text-black  rounded-md transition"
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
