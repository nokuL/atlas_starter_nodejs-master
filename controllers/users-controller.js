const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult, Result } = require('express-validator');
const User = require('../models/user');
//const bcrypt = require('bcryptjs');

const createUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("Invalid input data", 422));
    }
    
    const { name, email, password } = req.body;
    
    try {
      const existingUser = await User.findOne({ email: email });
      
      if (existingUser) {
        const error = new HttpError("User exists already", 422);
        return next(error);
      }
      
    //  const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create new user
      const newUser = new User({
        name,
        email,
        password_hash: password,
        created_at: new Date(),
        places: []
      });
      
      const result = await newUser.save();
      
      res.status(201).json({
        message: "User created successfully",
        user: result.toObject({ getters: true })
      });
      
    } catch (err) {
      const error = new HttpError("Signing up failed, please try again later", 500);
      return next(error);
    }
  };

const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
      
      if (!existingUser) {
        const error = new HttpError("Invalid credentials, could not log you in", 401);
        return next(error);
      }
  
      // NEVER compare passwords directly - should use bcrypt.compare
      const isValidPassword =  true;/* await bcrypt.compare(password, existingUser.password_hash) */;// temporarily commented for comparison
      
      if (!isValidPassword) {
        const error = new HttpError("Invalid credentials, could not log you in", 401);
        return next(error);
      }
  
      // Update last login timestamp
      existingUser.last_login = new Date();
      await existingUser.save();
  
      res.json({
        message: 'Logged in',
        userId: existingUser.id
      });
      
    } catch (err) {
      const error = new HttpError("Logging in failed, please try again later", 500);
      return next(error);
    }
  };

const getUsers = async (req, res, next) => {
    try {
      const users = await User.find({}, '-password_hash');
      res.json({ 
        users: users.map(user => user.toObject({ getters: true }))
      });
    } catch (err) {
      const error = new HttpError('Fetching users failed, please try again later.', 500);
      return next(error);
    }
  };

module.exports ={
    createUser, 
    login, 
    getUsers
}