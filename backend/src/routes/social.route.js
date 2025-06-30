import express from 'express';
import {
  getAvailableChallenges,
  joinChallenge,
  getUserChallenges,
  createCustomChallenge,
  getChallengeLeaderboard,
  getUserAchievements,
  getFriendsList,
  inviteFriend
} from '../controllers/social.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.use(authenticateToken)

// Challenges
router.get('/challenges', getAvailableChallenges);
router.post('/challenges/:id/join', joinChallenge);
router.get('/challenges/my', getUserChallenges);
router.post('/challenges/custom', createCustomChallenge);

// Leaderboard
router.get('/leaderboard/:challengeId', getChallengeLeaderboard);

// Achievements
router.get('/achievements', getUserAchievements);

// Social - Friends
router.get('/friends', getFriendsList);
router.post('/friends/invite', inviteFriend);

export default router;
