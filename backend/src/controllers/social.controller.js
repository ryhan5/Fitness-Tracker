import { Challenge, Achievement, Friend } from '../models/social.model.js';
import mongoose from 'mongoose';

// Challenge Controllers
export const getAvailableChallenges = async (req, res) => {
  try {
    const { category, type, difficulty, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    
    // Add date filter to show only current/future challenges
    query['duration.end'] = { $gte: new Date() };
    
    const skip = (page - 1) * limit;
    
    const challenges = await Challenge.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Add computed fields
    const challengesWithMeta = challenges.map(challenge => ({
      ...challenge,
      participantCount: challenge.participants.length,
      daysRemaining: Math.ceil((new Date(challenge.duration.end) - new Date()) / (1000 * 60 * 60 * 24)),
      canJoin: challenge.maxParticipants ? challenge.participants.length < challenge.maxParticipants : true
    }));
    
    const total = await Challenge.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: challengesWithMeta,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching challenges', 
      error: error.message 
    });
  }
};

export const joinChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming user is attached to req via auth middleware
    
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }
    
    // Check if user can join
    if (!challenge.canUserJoin(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot join this challenge' 
      });
    }
    
    // Add user to participants
    challenge.participants.push({
      userId: userId,
      joinedAt: new Date(),
      progress: 0,
      completed: false
    });
    
    await challenge.save();
    
    // Create participation achievement if first challenge
    const userChallengeCount = await Challenge.countDocuments({
      'participants.userId': userId
    });
    
    if (userChallengeCount === 1) {
      await Achievement.create({
        userId: userId,
        type: 'milestone',
        name: 'First Challenge',
        description: 'Joined your first challenge!',
        icon: '🎯',
        category: 'challenge',
        progress: { current: 1, target: 1 },
        points: 50
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined challenge',
      data: challenge
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error joining challenge', 
      error: error.message 
    });
  }
};

export const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'active' } = req.query;
    
    let query = { 'participants.userId': userId };
    
    if (status === 'active') {
      query.isActive = true;
      query['duration.end'] = { $gte: new Date() };
    } else if (status === 'completed') {
      query['duration.end'] = { $lt: new Date() };
    }
    
    const challenges = await Challenge.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ 'participants.joinedAt': -1 })
      .lean();
    
    // Add user's progress to each challenge
    const challengesWithProgress = challenges.map(challenge => {
      const userParticipation = challenge.participants.find(
        p => p.userId.toString() === userId.toString()
      );
      
      return {
        ...challenge,
        userProgress: userParticipation,
        participantCount: challenge.participants.length,
        daysRemaining: Math.max(0, Math.ceil((new Date(challenge.duration.end) - new Date()) / (1000 * 60 * 60 * 24)))
      };
    });
    
    res.status(200).json({
      success: true,
      data: challengesWithProgress
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user challenges', 
      error: error.message 
    });
  }
};

export const createCustomChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      type,
      category,
      target,
      duration,
      maxParticipants,
      difficulty,
      rewards
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !type || !category || !target || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Validate dates
    const startDate = new Date(duration.start);
    const endDate = new Date(duration.end);
    const now = new Date();
    
    if (startDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }
    
    const challenge = new Challenge({
      name,
      description,
      type,
      category,
      target,
      duration: {
        start: startDate,
        end: endDate
      },
      maxParticipants,
      difficulty: difficulty || 'medium',
      rewards: rewards || [],
      createdBy: userId,
      participants: [{
        userId: userId,
        joinedAt: new Date(),
        progress: 0,
        completed: false
      }]
    });
    
    await challenge.save();
    
    // Create achievement for creating first challenge
    const userCreatedChallenges = await Challenge.countDocuments({ createdBy: userId });
    if (userCreatedChallenges === 1) {
      await Achievement.create({
        userId: userId,
        type: 'milestone',
        name: 'Challenge Creator',
        description: 'Created your first challenge!',
        icon: '🏆',
        category: 'social',
        progress: { current: 1, target: 1 },
        points: 100
      });
    }
    
    await challenge.populate('createdBy', 'name avatar');
    
    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      data: challenge
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating challenge', 
      error: error.message 
    });
  }
};

export const getChallengeLeaderboard = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { limit = 50 } = req.query;
    
    const challenge = await Challenge.findById(challengeId)
      .populate('participants.userId', 'name avatar')
      .lean();
    
    if (!challenge) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }
    
    // Sort participants by progress (descending)
    const sortedParticipants = challenge.participants
      .sort((a, b) => b.progress - a.progress)
      .slice(0, parseInt(limit))
      .map((participant, index) => ({
        rank: index + 1,
        user: participant.userId,
        progress: participant.progress,
        completed: participant.completed,
        joinedAt: participant.joinedAt,
        progressPercentage: Math.min(
          Math.round((participant.progress / challenge.target.value) * 100),
          100
        )
      }));
    
    res.status(200).json({
      success: true,
      data: {
        challenge: {
          id: challenge._id,
          name: challenge.name,
          target: challenge.target,
          participantCount: challenge.participants.length
        },
        leaderboard: sortedParticipants
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching leaderboard', 
      error: error.message 
    });
  }
};

// Achievement Controllers
export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, type, page = 1, limit = 20 } = req.query;
    
    const query = { userId };
    if (category) query.category = category;
    if (type) query.type = type;
    
    const skip = (page - 1) * limit;
    
    const achievements = await Achievement.find(query)
      .populate('challengeId', 'name')
      .sort({ earnedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Achievement.countDocuments(query);
    
    // Get achievement stats
    const stats = await Achievement.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      }
    ]);
    
    const totalPoints = await Achievement.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$points' } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: achievements,
      stats: {
        byCategory: stats,
        totalPoints: totalPoints[0]?.total || 0,
        totalAchievements: total
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching achievements', 
      error: error.message 
    });
  }
};

// Social Controllers
export const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'accepted' } = req.query;
    
    const query = {
      status,
      $or: [
        { userId: userId },
        { friendId: userId }
      ]
    };
    
    const friendships = await Friend.find(query)
      .populate('userId', 'name avatar email lastActive')
      .populate('friendId', 'name avatar email lastActive')
      .sort({ acceptedAt: -1 })
      .lean();
    
    // Format response to show friend details
    const friends = friendships.map(friendship => {
      const friend = friendship.userId.toString() === userId.toString() 
        ? friendship.friendId 
        : friendship.userId;
      
      return {
        friendshipId: friendship._id,
        friend,
        status: friendship.status,
        connectedSince: friendship.acceptedAt,
        requestedBy: friendship.requestedBy
      };
    });
    
    res.status(200).json({
      success: true,
      data: friends
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching friends list', 
      error: error.message 
    });
  }
};

export const inviteFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, friendId } = req.body;
    
    let targetFriendId = friendId;
    
    // If email provided, find user by email
    if (email && !friendId) {
      // You'd need to import User model for this
      // const user = await User.findOne({ email });
      // if (!user) {
      //   return res.status(404).json({ 
      //     success: false, 
      //     message: 'User not found with this email' 
      //   });
      // }
      // targetFriendId = user._id;
      
      return res.status(400).json({
        success: false,
        message: 'Please provide friendId or implement email lookup'
      });
    }
    
    if (!targetFriendId) {
      return res.status(400).json({
        success: false,
        message: 'Friend ID is required'
      });
    }
    
    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      $or: [
        { userId: userId, friendId: targetFriendId },
        { userId: targetFriendId, friendId: userId }
      ]
    });
    
    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        message: 'Friendship request already exists'
      });
    }
    
    // Create friendship request
    const friendship = new Friend({
      userId: userId,
      friendId: targetFriendId,
      status: 'pending',
      requestedBy: userId
    });
    
    await friendship.save();
    await friendship.populate('friendId', 'name avatar email');
    
    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: friendship
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error sending friend request', 
      error: error.message 
    });
  }
};

// Additional helper functions for updating challenge progress
export const updateChallengeProgress = async (userId, category, value) => {
  try {
    const userChallenges = await Challenge.find({
      'participants.userId': userId,
      category: category,
      isActive: true,
      'duration.start': { $lte: new Date() },
      'duration.end': { $gte: new Date() }
    });
    
    for (const challenge of userChallenges) {
      const participantIndex = challenge.participants.findIndex(
        p => p.userId.toString() === userId.toString()
      );
      
      if (participantIndex !== -1) {
        challenge.participants[participantIndex].progress += value;
        challenge.participants[participantIndex].lastUpdated = new Date();
        
        // Check if target reached
        if (challenge.participants[participantIndex].progress >= challenge.target.value) {
          challenge.participants[participantIndex].completed = true;
          
          // Award completion achievement
          await Achievement.create({
            userId: userId,
            type: 'trophy',
            name: `${challenge.name} Champion`,
            description: `Completed the ${challenge.name} challenge!`,
            icon: '🏅',
            category: 'challenge',
            challengeId: challenge._id,
            progress: { current: 1, target: 1 },
            points: 200
          });
        }
        
        await challenge.save();
      }
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
  }
};