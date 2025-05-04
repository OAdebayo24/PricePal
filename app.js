const app = require("./index");
const db = require("./db");

const PORT = process.env.PORT || 3000;

// Connect to database
db.connectToDb();

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "Price Pal API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await db.disconnectDB();
  process.exit(0);
});
