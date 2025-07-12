import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkout } from '../../context/WorkoutContext';

const ActiveSession = () => {
  const { currentSession, endWorkoutSession } = useWorkout();
  const [currentExercise, setCurrentExercise] = useState(0);

  if (!currentSession) return null;

  const exercise = currentSession.exercises[currentExercise];

  return (
    <motion.div
      className="bg-gray-900/70 backdrop-blur-md rounded-xl shadow-xl p-6 mb-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">
          {currentSession.name} - Active Session
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={endWorkoutSession}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-800 transition-colors shadow-md"
        >
          End Session
        </motion.button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Exercise {currentExercise + 1} of {currentSession.exercises.length}</span>
          <span>{Math.round(((currentExercise + 1) / currentSession.exercises.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentExercise + 1) / currentSession.exercises.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{exercise.name}</h3>
        <p className="text-gray-400 mb-4">{exercise.sets} sets × {exercise.reps} reps</p>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
            disabled={currentExercise === 0}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentExercise(Math.min(currentSession.exercises.length - 1, currentExercise + 1))}
            disabled={currentExercise === currentSession.exercises.length - 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 transition-colors"
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveSession;