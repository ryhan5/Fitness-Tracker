import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { Camera, Edit, Mail, MapPin, Calendar } from 'lucide-react';

const ProfileHeader = ({ userProfile }) => {
  const { uploadProfilePicture, loading } = useUser();
  const [isEditingPicture, setIsEditingPicture] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        await uploadProfilePicture(formData);
        setIsEditingPicture(false);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Profile Info */}
      <div className="px-6 py-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0 -mt-16">
              <div className="relative">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white object-cover"
                  src={userProfile?.profilePicture || '/api/placeholder/96/96'}
                  alt={userProfile?.fullName || 'Profile'}
                />
                <button
                  onClick={() => setIsEditingPicture(true)}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
                
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image-upload"
                />
                
                {isEditingPicture && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer text-white p-2 rounded-full hover:bg-black hover:bg-opacity-20"
                    >
                      <Edit className="h-5 w-5" />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="mt-4 sm:mt-0 sm:pt-1 sm:pb-1">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {userProfile?.fullName || 'User Name'}
                </h1>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                {userProfile?.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    {userProfile.email}
                  </div>
                )}
                {userProfile?.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    {userProfile.location}
                  </div>
                )}
                {userProfile?.joinDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                    Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        {userProfile?.bio && (
          <div className="mt-6">
            <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
              {userProfile.bio}
            </p>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {userProfile?.completedWorkouts || 0}
            </div>
            <div className="text-sm text-gray-500">Workouts Completed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {userProfile?.totalDistance || 0}km
            </div>
            <div className="text-sm text-gray-500">Total Distance</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">
              {userProfile?.achievements || 0}
            </div>
            <div className="text-sm text-gray-500">Achievements</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;