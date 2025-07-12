// 

import React, { useState, useEffect } from 'react';
import { Search, Plus, Play, Dumbbell, Calendar, Target, Zap, Activity, TrendingUp, Clock, Flame, Users } from 'lucide-react';

// Context (unchanged as requested)
const WorkoutContext = React.createContext();

const useWorkout = () => {
  const context = React.useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

const mockWorkoutPlans = [
  {
    _id: '1',
    name: 'Neural Push Protocol',
    description: 'Advanced chest, shoulders, triceps optimization',
    difficulty: 'intermediate',
    duration: 60,
    category: 'strength',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10' },
      { name: 'Shoulder Press', sets: 3, reps: '10-12' },
      { name: 'Push-ups', sets: 3, reps: '15-20' }
    ]
  },
  {
    _id: '2',
    name: 'Quantum Pull Matrix',
    description: 'Back and biceps neural activation',
    difficulty: 'intermediate',
    duration: 55,
    category: 'strength',
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: '6-8' },
      { name: 'Rows', sets: 4, reps: '8-10' },
      { name: 'Bicep Curls', sets: 3, reps: '12-15' }
    ]
  },
  {
    _id: '3',
    name: 'Kinetic Leg System',
    description: 'Full lower body power enhancement',
    difficulty: 'advanced',
    duration: 70,
    category: 'strength',
    exercises: [
      { name: 'Squats', sets: 4, reps: '8-10' },
      { name: 'Deadlifts', sets: 3, reps: '6-8' },
      { name: 'Lunges', sets: 3, reps: '12 each leg' }
    ]
  },
  {
    _id: '4',
    name: 'Cardio Fusion Drive',
    description: 'High-intensity cardiovascular optimization',
    difficulty: 'intermediate',
    duration: 45,
    category: 'cardio',
    exercises: [
      { name: 'Burpees', sets: 3, reps: '10' },
      { name: 'Mountain Climbers', sets: 3, reps: '20' },
      { name: 'Jump Squats', sets: 3, reps: '15' }
    ]
  }
];

const mockExercises = [
  { _id: '1', name: 'Bench Press', category: 'chest', equipment: 'barbell', difficulty: 'intermediate' },
  { _id: '2', name: 'Pull-ups', category: 'back', equipment: 'bodyweight', difficulty: 'intermediate' },
  { _id: '3', name: 'Squats', category: 'legs', equipment: 'barbell', difficulty: 'beginner' },
  { _id: '4', name: 'Push-ups', category: 'chest', equipment: 'bodyweight', difficulty: 'beginner' },
  { _id: '5', name: 'Deadlifts', category: 'legs', equipment: 'barbell', difficulty: 'advanced' },
  { _id: '6', name: 'Burpees', category: 'cardio', equipment: 'bodyweight', difficulty: 'intermediate' }
];

const WorkoutProvider = ({ children }) => {
  const [workoutPlans, setWorkoutPlans] = useState(mockWorkoutPlans);
  const [exercises, setExercises] = useState(mockExercises);
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWorkoutPlans = async () => {
    setLoading(true);
    setTimeout(() => {
      setWorkoutPlans(mockWorkoutPlans);
      setLoading(false);
    }, 500);
  };

  const startWorkoutSession = async (planId) => {
    setLoading(true);
    setTimeout(() => {
      const plan = workoutPlans.find(p => p._id === planId);
      setCurrentSession({ ...plan, startTime: new Date() });
      setLoading(false);
    }, 300);
  };

  const endWorkoutSession = () => {
    setCurrentSession(null);
  };

  const value = {
    workoutPlans,
    exercises,
    currentWorkoutPlan,
    currentSession,
    loading,
    error,
    getWorkoutPlans,
    startWorkoutSession,
    endWorkoutSession
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Header Component
const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Dumbbell className="w-10 h-10 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NeuroFit Pro
              </h1>
              <p className="text-sm text-blue-300">Advanced Training System</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-blue-300">System Time</div>
              <div className="text-lg font-mono text-white">
                {time.toLocaleTimeString()}
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, change, color }) => (
  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-green-400 text-sm font-medium">+{change}%</div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  </div>
);

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          icon={Flame} 
          label="Calories Burned" 
          value="2,847" 
          change="12" 
          color="bg-gradient-to-br from-red-500 to-orange-500"
        />
        <StatsCard 
          icon={TrendingUp} 
          label="Workouts Completed" 
          value="24" 
          change="8" 
          color="bg-gradient-to-br from-green-500 to-emerald-500"
        />
        <StatsCard 
          icon={Clock} 
          label="Training Hours" 
          value="36.5" 
          change="15" 
          color="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <StatsCard 
          icon={Users} 
          label="Personal Records" 
          value="7" 
          change="23" 
          color="bg-gradient-to-br from-purple-500 to-pink-500"
        />
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Training Progress</h3>
        <div className="h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <div className="text-slate-400">Neural Performance Graph</div>
        </div>
      </div>
    </div>
  );
};

// Futuristic Workout Card Component
const WorkoutCard = ({ plan, onStart }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'strength': return <Dumbbell className="w-4 h-4" />;
      case 'cardio': return <Activity className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              {getCategoryIcon(plan.category)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-slate-400 text-sm">{plan.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(plan.difficulty)} text-white`}>
            {plan.difficulty}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{plan.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{plan.exercises.length} exercises</span>
            </div>
          </div>
          <div className="text-blue-400 font-mono text-sm">
            #{plan._id.padStart(3, '0')}
          </div>
        </div>
        
        <button
          onClick={() => onStart(plan._id)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>Initialize Training</span>
          <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Workout List Component
const WorkoutList = () => {
  const { workoutPlans, loading, startWorkoutSession, getWorkoutPlans } = useWorkout();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getWorkoutPlans();
  }, []);

  const filteredPlans = filter === 'all' 
    ? workoutPlans 
    : workoutPlans.filter(plan => plan.category === filter);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded mb-4"></div>
            <div className="h-8 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Training Protocols</h2>
        <div className="flex space-x-2">
          {['all', 'strength', 'cardio'].map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => (
          <WorkoutCard 
            key={plan._id} 
            plan={plan} 
            onStart={startWorkoutSession}
          />
        ))}
      </div>
    </div>
  );
};

// Active Session Component
const ActiveSession = () => {
  const { currentSession, endWorkoutSession } = useWorkout();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (currentSession) {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentSession]);

  if (!currentSession) return null;

  const exercise = currentSession.exercises[currentExercise];
  const progress = ((currentExercise + 1) / currentSession.exercises.length) * 100;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            {currentSession.name}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span>Session Active</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <button
          onClick={endWorkoutSession}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Terminate Session
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Exercise {currentExercise + 1} of {currentSession.exercises.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">{exercise.name}</h3>
          <p className="text-slate-400 mb-4">{exercise.sets} sets × {exercise.reps} reps</p>
          <div className="text-lg text-blue-400 font-mono">
            Neural Pattern: ACTIVE
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
            disabled={currentExercise === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentExercise(Math.min(currentSession.exercises.length - 1, currentExercise + 1))}
            disabled={currentExercise === currentSession.exercises.length - 1}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Exercise Database Component
const ExerciseDatabase = () => {
  const { exercises } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredExercises, setFilteredExercises] = useState(exercises);

  useEffect(() => {
    let filtered = exercises;
    
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }
    
    setFilteredExercises(filtered);
  }, [searchTerm, selectedCategory, exercises]);

  const categories = ['all', ...new Set(exercises.map(ex => ex.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Exercise Database</h2>
        <div className="text-sm text-slate-400">
          {filteredExercises.length} exercises found
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search neural patterns..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <div key={exercise._id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                {exercise.name}
              </h3>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                {exercise.category}
              </span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                {exercise.equipment}
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                {exercise.difficulty}
              </span>
            </div>
            
            <div className="text-xs text-slate-400 font-mono">
              ID: {exercise._id.padStart(3, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'workouts', label: 'Training Protocols', icon: Dumbbell },
    { id: 'exercises', label: 'Exercise Database', icon: Target }
  ];

  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50 mb-6">
      <div className="flex space-x-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Main Workout Component
const Workout = () => {
  const { currentSession } = useWorkout();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentSession && <ActiveSession />}
        
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl"></div>
          <div className="relative p-6">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'workouts' && <WorkoutList />}
            {activeTab === 'exercises' && <ExerciseDatabase />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;