import Activity from '../models/activity.model.js';
import mongoose from 'mongoose';

// Get all user activities with pagination and filtering
export const getUserActivities = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      startDate, 
      endDate,
      sortBy = 'completedAt',
      sortOrder = 'desc'
    } = req.query;
    
    const userId = req.user.id; // Assuming user ID comes from auth middleware
    
    // Build filter object
    const filter = { userId: new mongoose.Types.ObjectId(userId) };
    
    if (type) {
      filter.type = type.toLowerCase();
    }
    
    if (startDate || endDate) {
      filter.completedAt = {};
      if (startDate) filter.completedAt.$gte = new Date(startDate);
      if (endDate) filter.completedAt.$lte = new Date(endDate);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    // Execute queries
    const [activities, totalCount] = await Promise.all([
      Activity.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Activity.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// Create a new activity
export const createActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const activityData = { ...req.body, userId };
    
    // Validate required fields
    if (!activityData.name || !activityData.type || !activityData.duration) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and duration are required fields'
      });
    }
    
    const activity = new Activity(activityData);
    await activity.save();
    
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
};

// Get specific activity by ID
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    
    const activity = await Activity.findOne({ 
      _id: id, 
      userId: new mongoose.Types.ObjectId(userId) 
    });
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    
    // Remove userId from update data to prevent unauthorized changes
    delete updateData.userId;
    
    const activity = await Activity.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    
    const activity = await Activity.findOneAndDelete({ 
      _id: id, 
      userId: new mongoose.Types.ObjectId(userId) 
    });
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
};

// Upload GPS data for an activity
export const uploadGPSData = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { coordinates, startLocation, endLocation, elevation } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    
    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({
        success: false,
        message: 'GPS coordinates are required and must be an array'
      });
    }
    
    const gpsData = {
      coordinates,
      startLocation,
      endLocation,
      elevation
    };
    
    const activity = await Activity.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      { gpsData },
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'GPS data uploaded successfully',
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading GPS data',
      error: error.message
    });
  }
};

// Get activity statistics
export const getActivityStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      startDate, 
      endDate, 
      type,
      period = 'month' // week, month, year
    } = req.query;
    
    // Build match stage for aggregation
    const matchStage = { userId: new mongoose.Types.ObjectId(userId) };
    
    if (type) {
      matchStage.type = type.toLowerCase();
    }
    
    if (startDate || endDate) {
      matchStage.completedAt = {};
      if (startDate) matchStage.completedAt.$gte = new Date(startDate);
      if (endDate) matchStage.completedAt.$lte = new Date(endDate);
    }
    
    // Aggregation pipeline
    const stats = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDistance: { $sum: '$distance' },
          totalSteps: { $sum: '$steps' },
          avgDuration: { $avg: '$duration' },
          avgCalories: { $avg: '$caloriesBurned' },
          avgDistance: { $avg: '$distance' },
          avgHeartRate: { $avg: '$heartRate.average' }
        }
      }
    ]);
    
    // Get activity breakdown by type
    const activityBreakdown = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDistance: { $sum: '$distance' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get time-based breakdown
    let groupBy;
    switch (period) {
      case 'week':
        groupBy = { 
          year: { $year: '$completedAt' },
          week: { $week: '$completedAt' }
        };
        break;
      case 'year':
        groupBy = { year: { $year: '$completedAt' } };
        break;
      default: // month
        groupBy = { 
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' }
        };
    }
    
    const timeBreakdown = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDistance: { $sum: '$distance' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.week': -1 } },
      { $limit: 12 } // Last 12 periods
    ]);
    
    const result = {
      overall: stats[0] || {
        totalActivities: 0,
        totalDuration: 0,
        totalCalories: 0,
        totalDistance: 0,
        totalSteps: 0,
        avgDuration: 0,
        avgCalories: 0,
        avgDistance: 0,
        avgHeartRate: 0
      },
      activityBreakdown,
      timeBreakdown
    };
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity statistics',
      error: error.message
    });
  }
};