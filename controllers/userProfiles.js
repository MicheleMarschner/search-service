const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

//  @desc   Get pre-filtered User Profiles
//  @route  GET /api/v1/search/userprofiles
//  @access Private
exports.getUserProfiles = asyncHandler(async (req, res, next) => {

    const userProfiles = await req.advancedResults.select('username name profile_picture -_id');
   
    return res.status(200).json({
        success: true,
        msg: 'Show all',
        count: userProfiles.length,
        data: userProfiles
    });
});