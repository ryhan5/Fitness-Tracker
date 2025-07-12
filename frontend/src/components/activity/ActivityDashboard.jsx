import React, { useState } from 'react';
import { Calendar, Clock, MapPin, TrendingUp, Plus, Search, Filter, MoreVertical, Edit, Trash2, Upload, Eye } from 'lucide-react';

// Mock data for demonstration
const mockActivities = [
  {
    _id: '1',
    title: 'Morning Run',
    type: 'running',
    duration: 2400, // seconds
    distance: 5.2,
    completedAt: '2024-01-15T06:30:00Z',
    caloriesBurned: 450,
    avgHeartRate: 150,
    hasGPS: true
  },
  {
    _id: '2',
    title: 'Gym Workout',
    type: 'gym',
    duration: 3600,
    distance: 0,
    completedAt: '2024-01-14T18:00:00Z',
    caloriesBurned: 320,
    avgHeartRate: 140,
    hasGPS: false
  },
  {
    _id: '3',
    title: 'Cycling Adventure',
    type: 'cycling',
    duration: 5400,
    distance: 15.8,
    completedAt: '2024-01-13T08:00:00Z',
    caloriesBurned: 680,
    avgHeartRate: 135,
    hasGPS: true
  }
];

const mockStats = {
  totalActivities: 45,
  totalDistance: 180.5,
  totalDuration: 432000,
  totalCalories: 12450,
  avgHeartRate: 145,
  thisWeekActivities: 8,
  thisWeekDistance: 42.3,
  thisWeekDuration: 18000
};

// Activity Card Component
const ActivityCard = ({ activity, onEdit, onDelete, onUploadGPS, onView }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      running: 'bg-blue-500',
      cycling: 'bg-green-500',
      gym: 'bg-purple-500',
      swimming: 'bg-cyan-500',
      walking: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${getActivityTypeColor(activity.type)} flex items-center justify-center`}>
            <span className="text-white font-semibold text-lg">
              {activity.type.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{activity.title}</h3>
            <p className="text-sm text-gray-500 capitalize">{activity.type}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <button
                onClick={() => { onView(activity); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => { onEdit(activity); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              {!activity.hasGPS && (
                <button
                  onClick={() => { onUploadGPS(activity); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  Upload GPS
                </button>
              )}
              <button
                onClick={() => { onDelete(activity); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formatDuration(activity.duration)}</span>
        </div>
        {activity.distance > 0 && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{activity.distance} km</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{activity.caloriesBurned} cal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">♥️ {activity.avgHeartRate} bpm</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{formatDate(activity.completedAt)}</span>
        {activity.hasGPS && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            GPS Tracked
          </span>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, unit, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Activity Form Component
const ActivityForm = ({ activity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    type: activity?.type || 'running',
    duration: activity?.duration || '',
    distance: activity?.distance || '',
    caloriesBurned: activity?.caloriesBurned || '',
    avgHeartRate: activity?.avgHeartRate || '',
    completedAt: activity?.completedAt ? new Date(activity.completedAt).toISOString().slice(0, 16) : ''
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.completedAt) {
      alert('Please fill in required fields');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">
          {activity ? 'Edit Activity' : 'Add New Activity'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="gym">Gym</option>
              <option value="swimming">Swimming</option>
              <option value="walking">Walking</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories Burned
              </label>
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Heart Rate
              </label>
              <input
                type="number"
                name="avgHeartRate"
                value={formData.avgHeartRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completed At
            </label>
            <input
              type="datetime-local"
              name="completedAt"
              value={formData.completedAt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              {activity ? 'Update' : 'Create'} Activity
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Activity Dashboard Component
const ActivityDashboard = () => {
  const [activities, setActivities] = useState(mockActivities);
  const [stats, setStats] = useState(mockStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCreateActivity = (formData) => {
    const newActivity = {
      _id: Date.now().toString(),
      ...formData,
      duration: parseInt(formData.duration) * 60, // Convert to seconds
      distance: parseFloat(formData.distance) || 0,
      caloriesBurned: parseInt(formData.caloriesBurned) || 0,
      avgHeartRate: parseInt(formData.avgHeartRate) || 0,
      hasGPS: false
    };
    setActivities(prev => [newActivity, ...prev]);
    setShowForm(false);
  };

  const handleUpdateActivity = (formData) => {
    const updatedActivity = {
      ...editingActivity,
      ...formData,
      duration: parseInt(formData.duration) * 60,
      distance: parseFloat(formData.distance) || 0,
      caloriesBurned: parseInt(formData.caloriesBurned) || 0,
      avgHeartRate: parseInt(formData.avgHeartRate) || 0
    };
    setActivities(prev => prev.map(a => a._id === editingActivity._id ? updatedActivity : a));
    setEditingActivity(null);
  };

  const handleDeleteActivity = (activity) => {
    if (window.confirm(`Are you sure you want to delete "${activity.title}"?`)) {
      setActivities(prev => prev.filter(a => a._id !== activity._id));
    }
  };

  const handleUploadGPS = (activity) => {
    // Mock GPS upload
    alert(`GPS upload for "${activity.title}" - Feature coming soon!`);
  };

  const handleViewActivity = (activity) => {
    alert(`Viewing details for "${activity.title}" - Feature coming soon!`);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Activity Dashboard</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Activity
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Activities"
            value={stats.totalActivities}
            unit=""
            icon={TrendingUp}
            color="blue"
          />
          <StatsCard
            title="Total Distance"
            value={stats.totalDistance}
            unit="km"
            icon={MapPin}
            color="green"
          />
          <StatsCard
            title="Total Duration"
            value={formatDuration(stats.totalDuration)}
            unit=""
            icon={Clock}
            color="purple"
          />
          <StatsCard
            title="Calories Burned"
            value={stats.totalCalories.toLocaleString()}
            unit="cal"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="gym">Gym</option>
                <option value="swimming">Swimming</option>
                <option value="walking">Walking</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onEdit={setEditingActivity}
              onDelete={handleDeleteActivity}
              onUploadGPS={handleUploadGPS}
              onView={handleViewActivity}
            />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No activities found.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Your First Activity
            </button>
          </div>
        )}
      </div>

      {/* Forms */}
      {showForm && (
        <ActivityForm
          onSubmit={handleCreateActivity}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingActivity && (
        <ActivityForm
          activity={editingActivity}
          onSubmit={handleUpdateActivity}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
};

export default ActivityDashboard;