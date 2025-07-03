// const passport = require('passport');
// const  GoogleStrategy = require('passport-google-oauth20').Strategy;
// //const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
// const User = mongoose.model('User');
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "auth/google/callback"
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       let user = await User.findOne({ googleId: profile.id });

//       if (!user) {
//         user = await new User({ googleId: profile.id }).save();
//       }

//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   }
// ));

// // passport.use(new LocalStrategy(
// //     {
// //       usernameField: 'email', // or 'username' depending on your model
// //       passwordField: 'password'
// //     },
// //     async (email, password, done) => {
// //       try {
// //         // Find the user by email
// //         const user = await User.findOne({ email: email });
  
// //         if (!user) {
// //           return done(null, false, { message: 'Incorrect email.' });
// //         }
  
// //         // Check if the password is correct
// //         const isMatch = await user.comparePassword(password); // Assuming you have a method to compare passwords
  
// //         if (!isMatch) {
// //           return done(null, false, { message: 'Incorrect password.' });
// //         }
  
// //         return done(null, user);
// //       } catch (err) {
// //         return done(err);
// //       }
// //     }
// //   ));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });
  
//   // Deserialize user from session
//   passport.deserializeUser(async (id, done) => {
//     try {
//       const user = await User.findById(id);
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });