const express = require("express");
// const methodOverride = require("method-override");
require("dotenv").config();

const {
  passport,
  //sessionMiddleware,
  checkRevokedToken,
  optionalAuth,
} = require("./authentication/auth");


const UserRoute = require("./routes/user.route")
const VendorRoute = require("./routes/vendor.routes")
const AuthRoute = require("./routes/auth.route")
const RegisterStoreRoute = require("./routes/registerStore.route")

// use middleware to protect routes
// const verifyAdmin = require("./middleware/verifyAdmin");
const verifyVendor = require("./middlewares/verifyVendor.middleware");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(methodOverride("_method"));

// app.use(sessionMiddleware);
// app.use(passport.initialize());
// app.use(passport.session());

app.set("views", "views");
app.set("view engine", "ejs");


// Routes
app.use("/", AuthRoute);

app.use(
  "/register-store",
  passport.authenticate("jwt", { session: false }),
  RegisterStoreRoute,
);

app.use(
  "/vendors",
  passport.authenticate("jwt", { session: false }),
  checkRevokedToken,
  VendorRoute
);
app.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  checkRevokedToken,
  // verifyAdmin,
  UserRoute
);

// app.use(
//   "/ratings",
//   passport.authenticate("jwt", { session: false }),
//   checkRevokedToken,
//   ratingsRoute
// );



// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
