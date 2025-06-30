// controllers/workout.controller.js
import { WorkoutPlan, Exercise, WorkoutSession } from '../models/workout.model.js';
import mongoose from 'mongoose';

// Get all workout plans for a user
export const getWorkoutPlans = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming user ID comes from auth middleware
    const { page = 1, limit = 10, difficulty, isActive } = req.query;
    
    const filter = { userId };
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const plans = await WorkoutPlan.find(filter)
      .populate('schedule.exercises.exerciseId', 'name category targetMuscles equipment')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await WorkoutPlan.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: plans,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workout plans',
      error: error.message
    });
  }
};

// Create a new workout plan
export const createWorkoutPlan = async (req, res) => {
  try {

    // console.log('req.user:', req.user);
    // console.log('req.body:', req.body);

    // const { userId } = req.user._id;
    const planData = { ...req.body, userId:req.user._id };
    
    // Validate exercise IDs exist
    const exerciseIds = planData.schedule.flatMap(day => 
      day.exercises.map(ex => ex.exerciseId)
    );
    
    const existingExercises = await Exercise.find({ 
      _id: { $in: exerciseIds } 
    });
    
    if (existingExercises.length !== exerciseIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more exercise IDs are invalid'
      });
    }
    
    const workoutPlan = new WorkoutPlan(planData);
    await workoutPlan.save();
    
    await workoutPlan.populate('schedule.exercises.exerciseId', 'name category targetMuscles');
    
    res.status(201).json({
      success: true,
      data: workoutPlan,
      message: 'Workout plan created successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating workout plan',
      error: error.message
    });
  }
};

// Get a specific workout plan by ID
export const getWorkoutPlanById = async (req, res) => {
  try {

    console.log("req.user: ", req.user._id);
    

    const { id } = req.params;
    const userId  = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout plan ID'
      });
    }
    
    const workoutPlan = await WorkoutPlan.findOne({ _id: id, userId })
      .populate('schedule.exercises.exerciseId');
    
    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: workoutPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workout plan',
      error: error.message
    });
  }
};

// Update a workout plan
export const updateWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const  userId  = req.user._id;
    const updates = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout plan ID'
      });
    }
    
    // If updating schedule, validate exercise IDs
    if (updates.schedule) {
      const exerciseIds = updates.schedule.flatMap(day => 
        day.exercises.map(ex => ex.exerciseId)
      );
      
      const existingExercises = await Exercise.find({ 
        _id: { $in: exerciseIds } 
      });
      
      if (existingExercises.length !== exerciseIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more exercise IDs are invalid'
        });
      }
    }
    
    const workoutPlan = await WorkoutPlan.findOneAndUpdate(
      { _id: id, userId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('schedule.exercises.exerciseId');
    
    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: workoutPlan,
      message: 'Workout plan updated successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating workout plan',
      error: error.message
    });
  }
};

// Delete a workout plan
export const deleteWorkoutPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout plan ID'
      });
    }
    
    const workoutPlan = await WorkoutPlan.findOneAndDelete({ _id: id, userId });
    
    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }
    
    // Optionally, also delete associated workout sessions
    await WorkoutSession.deleteMany({ workoutPlanId: id });
    
    res.status(200).json({
      success: true,
      message: 'Workout plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting workout plan',
      error: error.message
    });
  }
};

// Start a workout session
export const startWorkoutSession = async (req, res) => {
  try {

    console.log(req.body);
    

    const { id } = req.params; // workout plan ID
    const userId = req.user._id;
    const { day } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout plan ID'
      });
    }
    
    const workoutPlan = await WorkoutPlan.findOne({ _id: id, userId })
      .populate('schedule.exercises.exerciseId');
    
    if (!workoutPlan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }
    
    // Find the day's workout
    const dayWorkout = workoutPlan.schedule.find(schedule => 
      schedule.day.toLowerCase() === day.toLowerCase()
    );
    
    if (!dayWorkout) {
      return res.status(400).json({
        success: false,
        message: `No workout scheduled for ${day}`
      });
    }
    
    // Check if there's already an active session
    const existingSession = await WorkoutSession.findOne({
      userId,
      workoutPlanId: id,
      status: 'in-progress'
    });
    
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active workout session',
        data: existingSession
      });
    }
    
    // Create new session
    const session = new WorkoutSession({
      userId,
      workoutPlanId: id,
      day: day.toLowerCase(),
      startTime: new Date(),
      exercises: dayWorkout.exercises.map(ex => ({
        exerciseId: ex.exerciseId._id,
        sets: Array.from({ length: ex.sets }, (_, i) => ({
          setNumber: i + 1,
          reps: 0,
          weight: 0,
          completed: false
        }))
      }))
    });
    
    await session.save();
    await session.populate('exercises.exerciseId');
    
    res.status(201).json({
      success: true,
      data: session,
      message: 'Workout session started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting workout session',
      error: error.message
    });
  }
};

// Log/complete a workout session
export const logWorkoutSession = async (req, res) => {
  try {

    console.log("Farhaaan :", req.body);
    

    const userId = req.user._id;
    const { sessionId, exercises, status = 'completed', notes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session ID'
      });
    }
    
    const session = await WorkoutSession.findOne({ 
      _id: sessionId, 
      userId 
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Workout session not found'
      });
    }
    
    // Update session data
    const endTime = new Date();
    const totalDuration = Math.round((endTime - session.startTime) / (1000 * 60)); // minutes
    
    const updatedSession = await WorkoutSession.findByIdAndUpdate(
      sessionId,
      {
        endTime,
        totalDuration,
        status,
        exercises: exercises || session.exercises,
        notes,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('exercises.exerciseId');
    
    res.status(200).json({
      success: true,
      data: updatedSession,
      message: 'Workout session logged successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging workout session',
      error: error.message
    });
  }
};

// Get exercise database
export const getExerciseDatabase = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      difficulty, 
      equipment, 
      targetMuscle,
      search 
    } = req.query;
    
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (equipment) filter.equipment = { $in: equipment.split(',') };
    if (targetMuscle) filter.targetMuscles = { $in: targetMuscle.split(',') };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const exercises = await Exercise.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Exercise.countDocuments(filter);
    
    // Get unique values for filters
    const categories = await Exercise.distinct('category');
    const equipmentList = await Exercise.distinct('equipment');
    const targetMusclesList = await Exercise.distinct('targetMuscles');
    
    res.status(200).json({
      success: true,
      data: exercises,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      filters: {
        categories,
        equipment: equipmentList,
        targetMuscles: targetMusclesList,
        difficulties: ['beginner', 'intermediate', 'advanced']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exercise database',
      error: error.message
    });
  }
};