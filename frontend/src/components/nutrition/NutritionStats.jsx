import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { useNutri } from '../../context/NurtiContext';

const NutritionStats = ({ dailyGoals }) => {
  const { dailyTotals } = useNutri();
  
  const stats = [
    {
      name: 'Calories',
      current: dailyTotals.calories,
      goal: dailyGoals.calories,
      color: 'bg-red-500',
      lightColor: 'bg-red-100',
      textColor: 'text-red-600',
      unit: 'cal'
    },
    {
      name: 'Protein',
      current: dailyTotals.protein,
      goal: dailyGoals.protein,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      unit: 'g'
    },
    {
      name: 'Carbs',
      current: dailyTotals.carbs,
      goal: dailyGoals.carbs,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600',
      unit: 'g'
    },
    {
      name: 'Fat',
      current: dailyTotals.fat,
      goal: dailyGoals.fat,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      unit: 'g'
    }
  ];

  const ProgressBar = ({ current, goal, color, lightColor }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const isOver = current > goal;
    
    return (
      <div className={`w-full h-2 ${lightColor} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${isOver ? 'bg-red-500' : color} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Target className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Daily Nutrition</h3>
          <p className="text-sm text-gray-600">Track your macro goals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => {
          const percentage = (stat.current / stat.goal) * 100;
          const isOver = stat.current > stat.goal;
          
          return (
            <div key={stat.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{stat.name}</span>
                <span className={`text-sm ${isOver ? 'text-red-600' : 'text-gray-600'}`}>
                  {stat.current.toFixed(1)} / {stat.goal} {stat.unit}
                </span>
              </div>
              
              <ProgressBar
                current={stat.current}
                goal={stat.goal}
                color={stat.color}
                lightColor={stat.lightColor}
              />
              
              <div className="flex items-center justify-between text-sm">
                <span className={`${stat.textColor} font-medium`}>
                  {percentage.toFixed(1)}% of goal
                </span>
                {isOver && (
                  <span className="text-red-600 font-medium">
                    +{(stat.current - stat.goal).toFixed(1)} {stat.unit} over
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {dailyTotals.calories.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Total Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {dailyTotals.fiber.toFixed(1)}g
            </div>
            <div className="text-sm text-gray-600">Fiber</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionStats;