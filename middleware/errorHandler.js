// Error handler
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	console.log(err);
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error'
	});
};
// Export module
module.exports = errorHandler;
