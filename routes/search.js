// Imports
const express = require('express');
const passport = require('passport');
const passportConfig = require('../passport/passport-config');
// Passport strategies assignment
const passportJWT = passport.authenticate('jwt', { session: false });
// Import middleware
const advancedSearch = require('../middleware/advancedSearch');
// Import models
const UserProfile = require('../models/UserProfile');
const Story = require('../models/Story');
// Import controllers
const { getUserProfiles } = require('../controllers/userProfiles');
const { getStories } = require('../controllers/stories');
// Create router from express
const router = express.Router();
router.use(passportJWT);
// Routes mapping
router.route('/userprofiles').get(advancedSearch(UserProfile), getUserProfiles);
router.route('/stories').get(advancedSearch(Story), getStories);
// Export module
module.exports = router;
