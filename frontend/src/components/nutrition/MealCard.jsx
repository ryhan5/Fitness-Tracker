import React from 'react';
import { Clock, Trash2, Edit } from 'lucide-react';
import { useNutri } from '../../context/NurtiContext';

const MealCard = ({ meal, onEdit }) => {
  const { deleteMeal } = useNutri();
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🥞',
      lunch: '🥗',
      dinner: '🍽️',
      snack: '🍎'
    };
    return icons[type] || '🍴';
  };
  
  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-blue-100 text-blue-800',
      snack: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };
  
  const totalMacros = meal.foods.reduce((acc, food) => {
    acc.protein += food.macros.protein;
    acc.carbs += food.macros.carbs;
    acc.fat += food.macros.fat;
    acc.fiber += food.macros.fiber;
    return acc;
  }, { protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const handleDelete = async () => {
    try {
      await deleteMeal(meal._id);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(meal);
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getMealIcon(meal.type)}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 capitalize">{meal.type}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(meal.type)}`}>
                {meal.totalCalories} cal
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4" />
              {formatTime(meal.timing)}
            </div>
          </div>
        </div>
       
        <div className="flex items-center gap-2">
          <button 
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Foods */}
      <div className="space-y-2 mb-3">
        {meal.foods.map((food, index) => (
          <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
            <span className="font-medium text-gray-700">{food.name}</span>
            <span className="text-gray-500">{food.quantity} {food.unit} • {food.calories} cal</span>
          </div>
        ))}
      </div>
      
      {/* Macros Summary */}
      <div className="grid grid-cols-4 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Protein</div>
          <div className="text-lg font-semibold text-blue-600">{totalMacros.protein.toFixed(1)}g</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Carbs</div>
          <div className="text-lg font-semibold text-green-600">{totalMacros.carbs.toFixed(1)}g</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Fat</div>
          <div className="text-lg font-semibold text-orange-600">{totalMacros.fat.toFixed(1)}g</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600">Fiber</div>
          <div className="text-lg font-semibold text-purple-600">{totalMacros.fiber.toFixed(1)}g</div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;