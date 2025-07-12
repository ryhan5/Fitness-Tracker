// import React, { useState, useEffect } from 'react';
// import { Plus, Target, Calendar } from 'lucide-react';
// import MealCard from './MealCard';
// import AddMealModal from './AddMealModal';
// import WaterTracker from './WaterTracker';
// import NutritionStats from './NutritionStats';

// const NutritionDashboard = () => {
//   const [dailyLog, setDailyLog] = useState(null);
//   const [showAddMeal, setShowAddMeal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     fetchDailyLog();
//   }, [selectedDate]);

//   const fetchDailyLog = async () => {
//     setError(null);
//     try {
//       const response = await fetch(`/api/nutrition/daily?date=${selectedDate}`, {
//         credentials: 'include',
//       });
//       const data = await response.json();
//       if (data.success) {
//         setDailyLog(data.data);
//       } else {
//         setError('Failed to load daily log.');
//       }
//     } catch (error) {
//       setError('Network error occurred.');
//       console.error('Error fetching daily log:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMealAdded = () => {
//     fetchDailyLog();
//     setShowAddMeal(false);
//     setTimeout(() => {
//       document.getElementById('meals-section')?.scrollIntoView({ behavior: 'smooth' });
//     }, 300);
//   };

//   const handleMealDeleted = async (mealId) => {
//     try {
//       const response = await fetch(`/api/nutrition/meals/${mealId}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });

//       if (response.ok) {
//         fetchDailyLog();
//       }
//     } catch (error) {
//       console.error('Error deleting meal:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {/* Header */}
//         <header className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Nutrition Dashboard</h1>
//             <p className="text-gray-600 mt-1">Track your daily nutrition goals</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-5 h-5 text-gray-500" />
//               <input
//                 type="date"
//                 value={selectedDate}
//                 max={new Date().toISOString().split('T')[0]}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               onClick={() => setShowAddMeal(true)}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <Plus className="w-5 h-5" />
//               Add Meal
//             </button>
//           </div>
//         </header>

//         {/* Error */}
//         {error && (
//           <div className="text-red-600 text-center mb-4">{error}</div>
//         )}

//         {/* Stats Overview */}
//         {dailyLog && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2">
//               <NutritionStats
//                 dailyTotals={dailyLog.dailyTotals}
//                 dailyGoals={dailyLog.dailyGoals}
//               />
//             </div>
//             <div>
//               <WaterTracker
//                 current={dailyLog.waterIntake}
//                 goal={dailyLog.dailyGoals.water}
//                 onUpdate={fetchDailyLog}
//               />
//             </div>
//           </div>
//         )}

//         {/* Meals Section */}
//         <section id="meals-section" className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-800">Today's Meals</h2>
//           </div>

//           <div className="p-6">
//             {dailyLog?.meals?.length > 0 ? (
//               <div className="space-y-4">
//                 {dailyLog.meals.map((meal) => (
//                   <MealCard
//                     key={meal._id}
//                     meal={meal}
//                     onDelete={() => handleMealDeleted(meal._id)}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Target className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-800 mb-2">No meals logged yet</h3>
//                 <p className="text-gray-500 mb-4">Start tracking your nutrition by adding your first meal</p>
//                 <button
//                   onClick={() => setShowAddMeal(true)}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
//                 >
//                   <Plus className="w-5 h-5" />
//                   Add Your First Meal
//                 </button>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Add Meal Modal */}
//       {showAddMeal && (
//         <AddMealModal
//           onClose={() => setShowAddMeal(false)}
//           onMealAdded={handleMealAdded}
//         />
//       )}
//     </main>
//   );
// };

// export default NutritionDashboard;


import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar } from 'lucide-react';
import { useNutri } from '../../context/NurtiContext';
import MealCard from './MealCard';
import AddMealModal from './AddMealModal';
import WaterTracker from './WaterTracker';
import NutritionStats from './NutritionStats';

const NutritionDashboard = () => {
  const { 
    nutritionLog, 
    dailyTotals, 
    loading, 
    getDailyNutritionLog, 
    deleteMeal 
  } = useNutri();
  
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyLog();
  }, [selectedDate]);

  const fetchDailyLog = async () => {
    setError(null);
    try {
      await getDailyNutritionLog(selectedDate);
    } catch (error) {
      setError(error.message || 'Failed to load daily log');
    }
  };

  const handleMealAdded = () => {
    fetchDailyLog();
    setShowAddMeal(false);
    setTimeout(() => {
      document.getElementById('meals-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleMealDeleted = async (mealId) => {
    try {
      await deleteMeal(mealId);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Nutrition Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your daily nutrition goals</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowAddMeal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Meal
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        {nutritionLog && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <NutritionStats
                dailyTotals={dailyTotals}
                dailyGoals={nutritionLog.dailyGoals}
              />
            </div>
            <div>
              <WaterTracker
                current={nutritionLog.waterIntake || 0}
                goal={nutritionLog.dailyGoals?.water || 2000}
                onUpdate={fetchDailyLog}
              />
            </div>
          </div>
        )}

        {/* Meals Section */}
        <section id="meals-section" className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Today's Meals</h2>
          </div>

          <div className="p-6">
            {nutritionLog?.meals?.length > 0 ? (
              <div className="space-y-4">
                {nutritionLog.meals.map((meal) => (
                  <MealCard
                    key={meal._id}
                    meal={meal}
                    onDelete={() => handleMealDeleted(meal._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No meals logged yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your nutrition by adding your first meal</p>
                <button
                  onClick={() => setShowAddMeal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Meal
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <AddMealModal
          onClose={() => setShowAddMeal(false)}
          onMealAdded={handleMealAdded}
        />
      )}
    </main>
  );
};

export default NutritionDashboard;