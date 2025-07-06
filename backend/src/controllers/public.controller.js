import User from '../models/user.model.js';

// Get total user count
export const userCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        message: "Total active users count"
      }
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get public statistics (additional endpoint)
export const getPublicStats = async (req, res) => {
  try {
    const [
      totalUsers,
      verifiedUsers,
      newUsersThisMonth,
      fitnessLevelStats,
      genderStats
    ] = await Promise.all([
      // Total active users
      User.countDocuments({ isActive: true }),
      
      // Verified users
      User.countDocuments({ isActive: true, isEmailVerified: true }),
      
      // New users this month
      User.countDocuments({
        isActive: true,
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),
      
      // Fitness level distribution
      User.aggregate([
        { $match: { isActive: true, 'profile.fitnessLevel': { $exists: true } } },
        { $group: { _id: '$profile.fitnessLevel', count: { $sum: 1 } } }
      ]),
      
      // Gender distribution
      User.aggregate([
        { $match: { isActive: true, 'profile.gender': { $exists: true } } },
        { $group: { _id: '$profile.gender', count: { $sum: 1 } } }
      ])
    ]);

    // Format fitness level stats
    const fitnessLevels = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };
    
    fitnessLevelStats.forEach(stat => {
      if (stat._id) {
        fitnessLevels[stat._id] = stat.count;
      }
    });

    // Format gender stats
    const genderDistribution = {
      male: 0,
      female: 0,
      other: 0
    };
    
    genderStats.forEach(stat => {
      if (stat._id) {
        genderDistribution[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        newUsersThisMonth,
        fitnessLevels,
        genderDistribution,
        verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};