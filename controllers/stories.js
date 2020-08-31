const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

//  @desc   Get pre-filtered Stories
//  @route  GET /api/v1/search/stories
//  @access Private
exports.getStories = asyncHandler(async (req, res, next) => {

    const stories = await req.advancedResults.select('title body');
    
    return res.status(200).json({
        success: true,
        msg: 'Show all',
        count: stories.length,
        data: stories
    });
});