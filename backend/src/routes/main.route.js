import express from 'express';

import authentication from './auth.route.js';
import user from './user.route.js';
import activity from './activity.route.js';
import workout from './workout.route.js';
import nutrition from './nutrition.route.js';
import social from './social.route.js';

const router = express.Router();

// User Authentication
router.use('/auth', authentication);

// User Details
router.use('/user', user);

// Activity Management
router.use('/activity', activity);

// Workout Management
router.use('/workout', workout);

// Nutrition
router.use('/nutrition', nutrition);

// Social Challenges
router.use('/social', social);

export default router;