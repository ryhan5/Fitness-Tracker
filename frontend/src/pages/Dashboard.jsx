import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  Target, 
  Trophy, 
  Calendar, 
  TrendingUp,
  Apple,
  Dumbbell,
  Clock,
  Zap,
  Heart,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [totalUser, setTotalUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Simulate fetching total user count
    setTimeout(() => {
      setTotalUser(1247); // Mock data - replace with actual API call
    }, 1000);
  }, []);

  const stats = [
    {
      title: "Today's Calories",
      value: "2,340",
      target: "2,500",
      icon: Apple,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: 93
    },
    {
      title: "Active Minutes",
      value: "45",
      target: "60",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: 75
    },
    {
      title: "Workouts This Week",
      value: "4",
      target: "5",
      icon: Dumbbell,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progress: 80
    },
    {
      title: "Current Streak",
      value: "12",
      target: "days",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progress: 100
    }
  ];

  const recentActivities = [
    { type: "Workout", name: "Morning Cardio", time: "8:00 AM", duration: "30 min", calories: "320" },
    { type: "Nutrition", name: "Breakfast logged", time: "9:30 AM", calories: "450" },
    { type: "Activity", name: "Walk to work", time: "10:15 AM", duration: "15 min", calories: "85" },
    { type: "Workout", name: "Strength Training", time: "6:00 PM", duration: "45 min", calories: "280" }
  ];

  const achievements = [
    { title: "First Workout", icon: Award, earned: true },
    { title: "7-Day Streak", icon: Trophy, earned: true },
    { title: "Monthly Goal", icon: Target, earned: false },
    { title: "Fitness Enthusiast", icon: Heart, earned: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.profile?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Here's your fitness overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Target: {stat.target}</span>
                  <span className="text-xs font-medium text-gray-700">{stat.progress}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stat.progress >= 100 ? 'bg-green-500' : 
                      stat.progress >= 75 ? 'bg-blue-500' : 
                      stat.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(stat.progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'Workout' ? 'bg-purple-100' :
                      activity.type === 'Nutrition' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'Workout' ? <Dumbbell className="h-4 w-4 text-purple-600" /> :
                       activity.type === 'Nutrition' ? <Apple className="h-4 w-4 text-green-600" /> :
                       <Activity className="h-4 w-4 text-blue-600" />}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{activity.name}</h4>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      {activity.duration && (
                        <span className="flex items-center mr-4">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.duration}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {activity.calories} cal
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Community */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-yellow-100' : 'bg-gray-200'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-sm font-medium ${
                          achievement.earned ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {achievement.earned ? 'Earned' : 'Not earned yet'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Community</h2>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {totalUser !== null ? totalUser.toLocaleString() : 'Loading...'}
                </div>
                <p className="text-sm text-gray-600 mb-4">Total Members</p>
                <div className="flex items-center justify-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+127 this week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default Dashboard;