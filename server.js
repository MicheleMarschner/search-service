// Imports
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
// Define config file
dotenv.config({ path: './config/config.env' });
// Connect to DB
connectDB();
// Define port
const port = process.env.PORT || 6000;
// Import routes
const search = require('./routes/search');
// Create app from expreess
const app = express();
// Middlewares
// Parse request body
app.use(express.json());
// Cors
app.use(cors());
// Logger for dev mode
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
// Routes
app.use('/api/v1/search', search);
// Error handler
app.use(errorHandler);
// Listen
const server = app.listen(
	port,
	console.log(
		`Server started in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
	)
);
// Handle uhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server
	server.close(() => process.exit(1));
});
