const app = require("./app");
require("dotenv").config();
const { sql, testConnection } = require("./db");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 App running on port ${PORT}...`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    console.log("Closing database connections...");
    await sql.end();
    process.exit(0);
  });
})();
