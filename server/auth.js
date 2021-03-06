//passport configuration file
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const token = require("../config");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: token.googleClientID,
        clientSecret: token.googleClientSecret,
        callbackURL: "http://localhost:3000/auth/google/callback"
      },
      (token, refreshToken, profile, done) => {
        return done(null, {
          profile: profile,
          token: token
        });
      }
    )
  );

};


