#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("🚀 Deploying MongoDB-optimized backend to Vercel...");

try {
	// Check if we're in the backend directory
	if (!require("fs").existsSync("./server.js")) {
		console.error("❌ Please run this from the backend directory");
		process.exit(1);
	}

	console.log("📦 Installing dependencies...");
	execSync("npm install", { stdio: "inherit" });

	console.log("🧪 Testing database connection locally...");
	try {
		execSync("node test-db-connection.js", { stdio: "inherit" });
	} catch (error) {
		console.error(
			"⚠️  Local database test failed, but continuing with deployment..."
		);
	}

	console.log("🌐 Deploying to Vercel...");
	execSync("vercel --prod", { stdio: "inherit" });

	console.log("\n✅ Deployment complete!");
	console.log("\n🔍 Next steps:");
	console.log("1. Check your deployment URL/api/health");
	console.log("2. Check your deployment URL/api/db-status");
	console.log("3. Test API endpoints like /api/students");
	console.log("4. Monitor Vercel function logs for any issues");
} catch (error) {
	console.error("❌ Deployment failed:", error.message);
	process.exit(1);
}
