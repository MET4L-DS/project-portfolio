// Middleware for enhanced serverless logging and error handling

const serverlessLogger = (req, res, next) => {
	const start = Date.now();
	const { method, url, headers } = req;

	// Log incoming request
	console.log(
		`📥 ${method} ${url} - ${
			headers["user-agent"]?.substring(0, 50) || "unknown"
		}`
	);

	// Override res.json to log responses
	const originalJson = res.json;
	res.json = function (data) {
		const duration = Date.now() - start;
		const status = res.statusCode;

		// Log response
		if (status >= 400) {
			console.error(
				`📤 ${method} ${url} - ${status} (${duration}ms) - ERROR:`,
				data.error || data.message
			);
		} else {
			console.log(`📤 ${method} ${url} - ${status} (${duration}ms)`);
		}

		return originalJson.call(this, data);
	};

	next();
};

const errorHandler = (err, req, res, next) => {
	const { method, url } = req;

	console.error(`❌ Unhandled error in ${method} ${url}:`, {
		message: err.message,
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
		timestamp: new Date().toISOString(),
	});

	// Check if it's a MongoDB connection error
	if (
		err.name === "MongooseError" ||
		err.message.includes("MongoDB") ||
		err.message.includes("mongoose")
	) {
		return res.status(503).json({
			error: "Database connection error",
			message:
				"Unable to connect to the database. Please try again later.",
			timestamp: new Date().toISOString(),
			details:
				process.env.NODE_ENV === "development"
					? err.message
					: undefined,
		});
	}

	// Generic error response
	res.status(500).json({
		error: "Internal server error",
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong",
		timestamp: new Date().toISOString(),
	});
};

module.exports = {
	serverlessLogger,
	errorHandler,
};
