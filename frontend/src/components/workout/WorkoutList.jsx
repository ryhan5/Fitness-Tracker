import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WorkoutCard from './WorkoutCard';
import { useWorkout } from '../../context/WorkoutContext';

const WorkoutList = () => {
  const { workoutPlans, loading, startWorkoutSession, getWorkoutPlans } = useWorkout();

  useEffect(() => {
    getWorkoutPlans();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-gray-900/50 rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded mb-4"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {workoutPlans.map(plan => (
          <WorkoutCard
            key={plan._id}
            plan={plan}
            onStart={startWorkoutSession}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutList;