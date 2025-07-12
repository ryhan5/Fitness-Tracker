import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import HealthMetrics from './HealthMetrics';
import UserPreferences from './UserPreferences';
import { User, Activity, Settings, Trash2 } from 'lucide-react';

const Profile = () => {
  const { 
    userProfile, 
    healthMetrics, 
    userPreferences, 
    loading, 
    getUserProfile, 
    getHealthMetrics, 
    getUserPreferences,
    deleteUserAccount 
  } = useUser();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          getUserProfile(),
          getHealthMetrics(),
          getUserPreferences()
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'health', label: 'Health Metrics', icon: Activity },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserAccount({ reason: 'User requested deletion' });
        // Redirect to login or home page after deletion
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader userProfile={userProfile} />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <ProfileForm userProfile={userProfile} />
            )}
            {activeTab === 'health' && (
              <HealthMetrics healthMetrics={healthMetrics} />
            )}
            {activeTab === 'preferences' && (
              <UserPreferences userPreferences={userPreferences} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Profile Complete</span>
                  <span className="text-sm font-medium text-green-600">
                    {userProfile ? '100%' : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Health Metrics</span>
                  <span className="text-sm font-medium text-blue-600">
                    {healthMetrics ? 'Updated' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Preferences</span>
                  <span className="text-sm font-medium text-purple-600">
                    {userPreferences ? 'Configured' : 'Default'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;