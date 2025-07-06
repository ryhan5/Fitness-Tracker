import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { token, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
        {/* Hero */}
        <div className="text-center py-20">
          <h2 className="text-9xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to 
          </h2>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Fortis Fitness
          </h2>


          {!token && (
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-lg font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md text-lg font-medium"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
