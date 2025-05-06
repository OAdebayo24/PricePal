const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { isTokenRevoked } = require("../middlewares/blacklist.middleware");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const db = require("../models");
const users = db.users;
const sequelize = db.sequelize;

require("sequelize");
require("dotenv").config();

const checkRevokedToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token && isTokenRevoked(token)) {
    return res
      .status(401)
      .json({ message: "Token has been revoked. Please log in again." });
  }

  next();
};


// JWT Authentication Strategy
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await users.findOne({ where: { id: token.id } });
        if (!user) return done(null, false);
        // console.log(token);
        return done(null, { id: user.id});
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Authentication Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await users.findOne({
          where: { email_address: profile.emails[0].value },
        });

        if (!user) {
          // Create new user if not found
          user = await users.create({
            email_address: profile.emails[0].value,
            // role: "User",
            password: "OAuthUser",
            //googleId: profile.id,
          });
          //console.log(user);
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Signup Strategy

  passport.use(
    "signup",
    new localStrategy(
      {
        usernameField: "email_address",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email_address, password, done) => {
        const { confirm_password } = req.body;

        if (!password || password.length < 8) {
          return done(null, false, {
            message: "Password must be at least 8 characters long.",
          });
        }

        if (password !== confirm_password) {
          return done(null, false, { message: "Passwords do not match." });
        }

        const transaction = await sequelize.transaction();

        try {
          const existingUser = await users.findOne({
            where: { email_address },
          });

          if (existingUser) {
            await transaction.rollback();
            return done(null, false, { message: "Email already in use." });
          }

          const newUser = await users.create(
            { email_address, password },
            { transaction }
          );

          await transaction.commit();
          return done(null, newUser, {
            message: "User registered successfully.",
          });
        } catch (error) {
          await transaction.rollback();
          return done(error);
        }
      }
    )
  );



// Login Strategy

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email_address",
      passwordField: "password",
    },
    async (email_address, password, done) => {
      try {
        const user = await users.findOne({ where: { email_address } });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        // Compare passwords using the method in the model
        const isValidPassword = await user.validatePassword(password);

        if (!isValidPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    req.user = user || null;
    next();
  })(req, res, next);
};

module.exports = {
  // sessionMiddleware,
  passport,
  checkRevokedToken,
  optionalAuth,
};
