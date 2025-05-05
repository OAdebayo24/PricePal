require("dotenv").config();
const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(
//   dbConfig.database,
//   dbConfig.user,
//   dbConfig.password,
//   {
//     host: dbConfig.host,
//     port: dbConfig.port,
//     dialect: dbConfig.dialect,
//     logging: false,
//   }
// );

const sequelize = new Sequelize(process.env.DIRECT_URL, {
  dialect: "postgres",
  logging: false,
});

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Initialize models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add models
db.users = require("./users.model")(sequelize, Sequelize.DataTypes);
db.vendors = require("./vendors.model")(sequelize, Sequelize.DataTypes);
db.registerStore = require("./registerStore.model")(sequelize, Sequelize.DataTypes);


// Define relationships

// db.User.hasOne(db.Vendor, { foreignKey: "user_id", onDelete: "CASCADE" });
db.registerStore.belongsTo(db.vendors, { foreignKey: "vendor_id" });
db.vendors.hasOne(db.registerStore, { foreignKey: "vendor_id", onDelete: "CASCADE" });



// Sync models
db.sequelize
  .sync({ alter: true }) // or { force: true } in dev if needed
  .then(() => {
    console.log("Database & tables synced");
  })
  .catch((err) => {
    console.error("Unable to sync database & tables:", err);
  });

module.exports = db;
