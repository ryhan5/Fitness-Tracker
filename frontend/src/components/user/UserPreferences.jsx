import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { Save, Settings, Bell, Globe, Moon, Sun, Smartphone, Mail, Volume2, Eye, EyeOff, Timer, Users, Shield, Monitor } from 'lucide-react';

const UserPreferences = ({ userPreferences }) => {
  const { updateUserPreferences, loading } = useUser();
  const [formData, setFormData] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false,
      workout: true,
      progress: true,
      social: false
    },
    privacy: {
      profileVisibility: 'public',
      showActivity: true,
      showStats: true,
      allowMessages: true
    },
    workout: {
      units: 'metric',
      defaultDuration: 60,
      restTimer: 60,
      autoStart: false,
      playSound: true
    },
    display: {
      compactView: false,
      showAnimation: true,
      highContrast: false
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userPreferences) {
      setFormData({
        theme: userPreferences.theme || 'light',
        language: userPreferences.language || 'en',
        timezone: userPreferences.timezone || 'UTC',
        notifications: {
          email: userPreferences.notifications?.email ?? true,
          push: userPreferences.notifications?.push ?? true,
          sms: userPreferences.notifications?.sms ?? false,
          workout: userPreferences.notifications?.workout ?? true,
          progress: userPreferences.notifications?.progress ?? true,
          social: userPreferences.notifications?.social ?? false
        },
        privacy: {
          profileVisibility: userPreferences.privacy?.profileVisibility || 'public',
          showActivity: userPreferences.privacy?.showActivity ?? true,
          showStats: userPreferences.privacy?.showStats ?? true,
          allowMessages: userPreferences.privacy?.allowMessages ?? true
        },
        workout: {
          units: userPreferences.workout?.units || 'metric',
          defaultDuration: userPreferences.workout?.defaultDuration || 60,
          restTimer: userPreferences.workout?.restTimer || 60,
          autoStart: userPreferences.workout?.autoStart ?? false,
          playSound: userPreferences.workout?.playSound ?? true
        },
        display: {
          compactView: userPreferences.display?.compactView ?? false,
          showAnimation: userPreferences.display?.showAnimation ?? true,
          highContrast: userPreferences.display?.highContrast ?? false
        }
      });
    }
  }, [userPreferences]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');
    
    if (keys.length === 1) {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'checkbox' ? checked : value
        }
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await updateUserPreferences(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleCancel = () => {
    if (userPreferences) {
      setFormData({
        theme: userPreferences.theme || 'light',
        language: userPreferences.language || 'en',
        timezone: userPreferences.timezone || 'UTC',
        notifications: {
          email: userPreferences.notifications?.email ?? true,
          push: userPreferences.notifications?.push ?? true,
          sms: userPreferences.notifications?.sms ?? false,
          workout: userPreferences.notifications?.workout ?? true,
          progress: userPreferences.notifications?.progress ?? true,
          social: userPreferences.notifications?.social ?? false
        },
        privacy: {
          profileVisibility: userPreferences.privacy?.profileVisibility || 'public',
          showActivity: userPreferences.privacy?.showActivity ?? true,
          showStats: userPreferences.privacy?.showStats ?? true,
          allowMessages: userPreferences.privacy?.allowMessages ?? true
        },
        workout: {
          units: userPreferences.workout?.units || 'metric',
          defaultDuration: userPreferences.workout?.defaultDuration || 60,
          restTimer: userPreferences.workout?.restTimer || 60,
          autoStart: userPreferences.workout?.autoStart ?? false,
          playSound: userPreferences.workout?.playSound ?? true
        },
        display: {
          compactView: userPreferences.display?.compactView ?? false,
          showAnimation: userPreferences.display?.showAnimation ?? true,
          highContrast: userPreferences.display?.highContrast ?? false
        }
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">User Preferences</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit Preferences
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-1" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.theme === 'light' ? <Sun className="inline h-4 w-4 mr-1" /> : <Moon className="inline h-4 w-4 mr-1" />}
                Theme
              </label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } border-gray-300`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } border-gray-300`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } border-gray-300`}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">GMT</option>
                <option value="Europe/Paris">CET</option>
                <option value="Asia/Tokyo">JST</option>
                <option value="Asia/Kolkata">IST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Bell className="inline h-5 w-5 mr-2" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifications.email"
                  checked={formData.notifications.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifications.push"
                  checked={formData.notifications.push}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Push Notifications</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifications.sms"
                  checked={formData.notifications.sms}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">SMS Notifications</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifications.workout"
                  checked={formData.notifications.workout}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Workout Reminders</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifications.progress"
                  checked={formData.notifications.progress}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Progress Updates</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="notifications.social"
                  checked={formData.notifications.social}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Social Activities</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Shield className="inline h-5 w-5 mr-2" />
            Privacy Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                name="privacy.profileVisibility"
                value={formData.privacy.profileVisibility}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                } border-gray-300`}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="privacy.showActivity"
                  checked={formData.privacy.showActivity}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Show Activity</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="privacy.showStats"
                  checked={formData.privacy.showStats}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Show Statistics</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="privacy.allowMessages"
                  checked={formData.privacy.allowMessages}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Allow Messages</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Workout Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Timer className="inline h-5 w-5 mr-2" />
            Workout Settings
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>
                <select
                  name="workout.units"
                  value={formData.workout.units}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  } border-gray-300`}
                >
                  <option value="metric">Metric (kg, cm)</option>
                  <option value="imperial">Imperial (lbs, ft)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Workout Duration (minutes)
                </label>
                <input
                  type="number"
                  name="workout.defaultDuration"
                  value={formData.workout.defaultDuration}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="15"
                  max="180"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  } border-gray-300`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rest Timer (seconds)
                </label>
                <input
                  type="number"
                  name="workout.restTimer"
                  value={formData.workout.restTimer}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="30"
                  max="300"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                  } border-gray-300`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="workout.autoStart"
                  checked={formData.workout.autoStart}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Auto-start Rest Timer</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="workout.playSound"
                  checked={formData.workout.playSound}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Play Sound Effects</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <Monitor className="inline h-5 w-5 mr-2" />
            Display Settings
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="display.compactView"
                  checked={formData.display.compactView}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Compact View</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="display.showAnimation"
                  checked={formData.display.showAnimation}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Show Animations</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="display.highContrast"
                  checked={formData.display.highContrast}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <div className="flex items-center space-x-2">
                  <EyeOff className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">High Contrast</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;