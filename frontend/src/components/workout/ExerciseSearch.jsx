import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../../context/WorkoutContext';

const ExerciseSearch = () => {
  const { exercises } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exercises);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterEquipment, setFilterEquipment] = useState('');

  const categories = [...new Set(exercises.map(ex => ex.category))];
  const equipment = [...new Set(exercises.map(ex => ex.equipment))];

  useEffect(() => {
    const filtered = exercises.filter(exercise =>
      (exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       exercise.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory ? exercise.category === filterCategory : true) &&
      (filterEquipment ? exercise.equipment === filterEquipment : true)
    );
    setFilteredExercises(filtered);
  }, [searchTerm, filterCategory, filterEquipment, exercises]);

  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-md rounded-xl shadow-xl p-6 border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Exercise Database</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterEquipment}
          onChange={(e) => setFilterEquipment(e.target.value)}
        >
          <option value="">All Equipment</option>
          {equipment.map(eq => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredExercises.map(exercise => (
            <motion.div
              key={exercise._id}
              className="border border-gray-600 rounded-lg p-4 hover:border-blue-500 transition-colors bg-gray-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold text-white">{exercise.name}</h3>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-600/50 text-blue-200 text-xs rounded">
                  {exercise.category}
                </span>
                <span className="px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded">
                  {exercise.equipment}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExerciseSearch;