// legacy/server.js
const dotenv = require("dotenv");
// IMPORTANT: Call dotenv.config() at the very top, before other requires
dotenv.config();

console.log("Loading environment variables from .env file");
// Now, process.env variables are available for all subsequent requires
const app = require("./app"); // Import your Express app
const connectDB = require("./config/db"); // Import your DB connection function

const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to connect to database — aborting startup:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `Google API Key: ${process.env.GOOGLE_API_KEY ? "Set" : "Not Set"}`,
    );
    console.log(`MongoDB URI: ${process.env.MONGODB_URI ? "Set" : "Not Set"}`);
  });
})();
