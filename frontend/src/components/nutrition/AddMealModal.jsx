// import React, { useState } from 'react';
// import { X, Plus, Search, Minus } from 'lucide-react';

// const AddMealModal = ({ onClose, onMealAdded }) => {
//   const [mealData, setMealData] = useState({
//     type: 'breakfast',
//     foods: [],
//     timing: new Date().toISOString().slice(0, 16)
//   });
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searching, setSearching] = useState(false);
//   const [customFood, setCustomFood] = useState({
//     name: '',
//     quantity: '',
//     unit: 'g',
//     calories: '',
//     macros: { protein: '', carbs: '', fat: '', fiber: '' }
//   });
//   const [showCustomForm, setShowCustomForm] = useState(false);

//   const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
//   const units = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz', 'lb'];

//   const searchFoods = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }
    
//     setSearching(true);
//     try {
//       const response = await fetch(`/api/nutrition/foods/search?q=${encodeURIComponent(query)}`, {
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (data.success) {
//         setSearchResults(data.data);
//       }
//     } catch (error) {
//       console.error('Error searching foods:', error);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const addFoodToMeal = (food) => {
//     const newFood = {
//       name: food.name,
//       quantity: parseFloat(food.servingSize) || 1,
//       unit: food.servingUnit,
//       calories: food.calories,
//       macros: {
//         protein: food.macros.protein,
//         carbs: food.macros.carbs,
//         fat: food.macros.fat,
//         fiber: food.macros.fiber
//       }
//     };
    
//     setMealData(prev => ({
//       ...prev,
//       foods: [...prev.foods, newFood]
//     }));
//     setSearchQuery('');
//     setSearchResults([]);
//   };

//   const addCustomFood = () => {
//     if (!customFood.name || !customFood.quantity || !customFood.calories) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const newFood = {
//       name: customFood.name,
//       quantity: parseFloat(customFood.quantity),
//       unit: customFood.unit,
//       calories: parseFloat(customFood.calories),
//       macros: {
//         protein: parseFloat(customFood.macros.protein) || 0,
//         carbs: parseFloat(customFood.macros.carbs) || 0,
//         fat: parseFloat(customFood.macros.fat) || 0,
//         fiber: parseFloat(customFood.macros.fiber) || 0
//       }
//     };

//     setMealData(prev => ({
//       ...prev,
//       foods: [...prev.foods, newFood]
//     }));

//     setCustomFood({
//       name: '',
//       quantity: '',
//       unit: 'g',
//       calories: '',
//       macros: { protein: '', carbs: '', fat: '', fiber: '' }
//     });
//     setShowCustomForm(false);
//   };

//   const removeFoodFromMeal = (index) => {
//     setMealData(prev => ({
//       ...prev,
//       foods: prev.foods.filter((_, i) => i !== index)
//     }));
//   };

//   const updateFoodQuantity = (index, quantity) => {
//     setMealData(prev => ({
//       ...prev,
//       foods: prev.foods.map((food, i) => 
//         i === index ? { ...food, quantity: parseFloat(quantity) || 0 } : food
//       )
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (mealData.foods.length === 0) {
//       alert('Please add at least one food item');
//       return;
//     }

//     try {
//       const response = await fetch('/api/nutrition/meals', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify(mealData)
//       });

//       if (response.ok) {
//         onMealAdded();
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message || 'Failed to add meal');
//       }
//     } catch (error) {
//       console.error('Error adding meal:', error);
//       alert('Failed to add meal');
//     }
//   };

//   const totalCalories = mealData.foods.reduce((total, food) => total + food.calories, 0);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-800">Add New Meal</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Meal Type
//               </label>
//               <select
//                 value={mealData.type}
//                 onChange={(e) => setMealData(prev => ({ ...prev, type: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {mealTypes.map(type => (
//                   <option key={type} value={type}>
//                     {type.charAt(0).toUpperCase() + type.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Time
//               </label>
//               <input
//                 type="datetime-local"
//                 value={mealData.timing}
//                 onChange={(e) => setMealData(prev => ({ ...prev, timing: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Food Search */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Search Foods
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search for foods..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   searchFoods(e.target.value);
//                 }}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {searchResults.length > 0 && (
//               <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
//                 {searchResults.map((food) => (
//                   <button
//                     key={food.id}
//                     type="button"
//                     onClick={() => addFoodToMeal(food)}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
//                   >
//                     <div className="font-medium">{food.name}</div>
//                     <div className="text-sm text-gray-600">
//                       {food.servingSize} {food.servingUnit} • {food.calories} cal
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Custom Food Toggle */}
//           <div>
//             <button
//               type="button"
//               onClick={() => setShowCustomForm(!showCustomForm)}
//               className="text-blue-500 hover:text-blue-600 font-medium"
//             >
//               {showCustomForm ? 'Hide' : 'Add'} Custom Food
//             </button>
//           </div>

//           {/* Custom Food Form */}
//           {showCustomForm && (
//             <div className="bg-gray-50 p-4 rounded-lg space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Food name"
//                   value={customFood.name}
//                   onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Calories"
//                   value={customFood.calories}
//                   onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4">
//                 <input
//                   type="number"
//                   placeholder="Quantity"
//                   value={customFood.quantity}
//                   onChange={(e) => setCustomFood(prev => ({ ...prev, quantity: e.target.value }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <select
//                   value={customFood.unit}
//                   onChange={(e) => setCustomFood(prev => ({ ...prev, unit: e.target.value }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {units.map(unit => (
//                     <option key={unit} value={unit}>{unit}</option>
//                   ))}
//                 </select>
//                 <button
//                   type="button"
//                   onClick={addCustomFood}
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="grid grid-cols-4 gap-4">
//                 <input
//                   type="number"
//                   placeholder="Protein (g)"
//                   value={customFood.macros.protein}
//                   onChange={(e) => setCustomFood(prev => ({ 
//                     ...prev, 
//                     macros: { ...prev.macros, protein: e.target.value }
//                   }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Carbs (g)"
//                   value={customFood.macros.carbs}
//                   onChange={(e) => setCustomFood(prev => ({ 
//                     ...prev, 
//                     macros: { ...prev.macros, carbs: e.target.value }
//                   }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Fat (g)"
//                   value={customFood.macros.fat}
//                   onChange={(e) => setCustomFood(prev => ({ 
//                     ...prev, 
//                     macros: { ...prev.macros, fat: e.target.value }
//                   }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="number"
//                   placeholder="Fiber (g)"
//                   value={customFood.macros.fiber}
//                   onChange={(e) => setCustomFood(prev => ({ 
//                     ...prev, 
//                     macros: { ...prev.macros, fiber: e.target.value }
//                   }))}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Added Foods */}
//           {mealData.foods.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium text-gray-800 mb-3">Added Foods</h3>
//               <div className="space-y-2">
//                 {mealData.foods.map((food, index) => (
//                   <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
//                     <div className="flex-1">
//                       <div className="font-medium">{food.name}</div>
//                       <div className="text-sm text-gray-600">
//                         {food.calories} cal • {food.macros.protein}g protein
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="number"
//                         value={food.quantity}
//                         onChange={(e) => updateFoodQuantity(index, e.target.value)}
//                         className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                       />
//                       <span className="text-sm text-gray-600">{food.unit}</span>
//                       <button
//                         type="button"
//                         onClick={() => removeFoodFromMeal(index)}
//                         className="text-red-500 hover:text-red-700 p-1"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                 <div className="text-lg font-semibold text-blue-800">
//                   Total Calories: {totalCalories}
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
//             >
//               Add Meal
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMealModal;

import React, { useState } from 'react';
import { X, Plus, Search, Minus } from 'lucide-react';
import { useNutri } from '../../context/NurtiContext';

const AddMealModal = ({ onClose, onMealAdded }) => {
  const { logMeal, searchFoodDatabase } = useNutri();
  
  const [mealData, setMealData] = useState({
    type: 'breakfast',
    foods: [],
    timing: new Date().toISOString().slice(0, 16)
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    quantity: '',
    unit: 'g',
    calories: '',
    macros: { protein: '', carbs: '', fat: '', fiber: '' }
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const units = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz', 'lb'];

  const searchFoods = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const results = await searchFoodDatabase(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching foods:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addFoodToMeal = (food) => {
    const newFood = {
      name: food.name,
      quantity: parseFloat(food.servingSize) || 1,
      unit: food.servingUnit || 'g',
      calories: food.calories || 0,
      macros: {
        protein: food.macros?.protein || 0,
        carbs: food.macros?.carbs || 0,
        fat: food.macros?.fat || 0,
        fiber: food.macros?.fiber || 0
      }
    };
    
    setMealData(prev => ({
      ...prev,
      foods: [...prev.foods, newFood]
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const addCustomFood = () => {
    if (!customFood.name || !customFood.quantity || !customFood.calories) {
      alert('Please fill in all required fields');
      return;
    }

    const newFood = {
      name: customFood.name,
      quantity: parseFloat(customFood.quantity),
      unit: customFood.unit,
      calories: parseFloat(customFood.calories),
      macros: {
        protein: parseFloat(customFood.macros.protein) || 0,
        carbs: parseFloat(customFood.macros.carbs) || 0,
        fat: parseFloat(customFood.macros.fat) || 0,
        fiber: parseFloat(customFood.macros.fiber) || 0
      }
    };

    setMealData(prev => ({
      ...prev,
      foods: [...prev.foods, newFood]
    }));

    setCustomFood({
      name: '',
      quantity: '',
      unit: 'g',
      calories: '',
      macros: { protein: '', carbs: '', fat: '', fiber: '' }
    });
    setShowCustomForm(false);
  };

  const removeFoodFromMeal = (index) => {
    setMealData(prev => ({
      ...prev,
      foods: prev.foods.filter((_, i) => i !== index)
    }));
  };

  const updateFoodQuantity = (index, quantity) => {
    setMealData(prev => ({
      ...prev,
      foods: prev.foods.map((food, i) => 
        i === index ? { ...food, quantity: parseFloat(quantity) || 0 } : food
      )
    }));
  };

  const handleSubmit = async () => {
    if (mealData.foods.length === 0) {
      alert('Please add at least one food item');
      return;
    }

    try {
      await logMeal(mealData);
      onMealAdded();
    } catch (error) {
      console.error('Error adding meal:', error);
      alert(error.message || 'Failed to add meal');
    }
  };

  const totalCalories = mealData.foods.reduce((total, food) => total + food.calories, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Add New Meal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                value={mealData.type}
                onChange={(e) => setMealData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mealTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="datetime-local"
                value={mealData.timing}
                onChange={(e) => setMealData(prev => ({ ...prev, timing: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Food Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Foods
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for foods..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchFoods(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {searching && (
              <div className="mt-2 text-center text-gray-500">
                Searching foods...
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                {searchResults.map((food, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addFoodToMeal(food)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      {food.servingSize || 1} {food.servingUnit || 'serving'} • {food.calories || 0} cal
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Food Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              {showCustomForm ? 'Hide' : 'Add'} Custom Food
            </button>
          </div>

          {/* Custom Food Form */}
          {showCustomForm && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Food name"
                  value={customFood.name}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={customFood.calories}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, calories: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Quantity"
                  value={customFood.quantity}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, quantity: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={customFood.unit}
                  onChange={(e) => setCustomFood(prev => ({ ...prev, unit: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCustomFood}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={customFood.macros.protein}
                  onChange={(e) => setCustomFood(prev => ({ 
                    ...prev, 
                    macros: { ...prev.macros, protein: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={customFood.macros.carbs}
                  onChange={(e) => setCustomFood(prev => ({ 
                    ...prev, 
                    macros: { ...prev.macros, carbs: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={customFood.macros.fat}
                  onChange={(e) => setCustomFood(prev => ({ 
                    ...prev, 
                    macros: { ...prev.macros, fat: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Fiber (g)"
                  value={customFood.macros.fiber}
                  onChange={(e) => setCustomFood(prev => ({ 
                    ...prev, 
                    macros: { ...prev.macros, fiber: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Added Foods */}
          {mealData.foods.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Added Foods</h3>
              <div className="space-y-2">
                {mealData.foods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-gray-600">
                        {food.calories} cal • {food.macros.protein}g protein
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={food.quantity}
                        onChange={(e) => updateFoodQuantity(index, e.target.value)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">{food.unit}</span>
                      <button
                        type="button"
                        onClick={() => removeFoodFromMeal(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-800">
                  Total Calories: {totalCalories}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;