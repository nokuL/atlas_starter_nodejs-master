const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult, Result } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const createUser = async (req, res, next) => {
  console.log("##################### create user here");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("Invalid input data", 422));
    }
    
    const { name, email, password, userName } = req.body;
    
    try {
      const existingUser = await User.findOne({ email: email });
      
      if (existingUser) {
        const error = new HttpError("User exists already, please login instead", 422);
        return next(error);
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create new user
      const newUser = new User({
        name,
        userName,
        email,        
        password_hash: hashedPassword,
        created_at: new Date(),
        places: [],
      });
      
      const result = await newUser.save();
      let token;
       token = jwt.sign({userId: newUser.id, email: newUser.email}, SECRET, {expiresIn: '1h'})
      
      res.status(201).json({
        message: "User created successfully",
        user: {userId: newUser.id, email: email},
        token: token
      });
      
    } catch (err) {
      console.log(err);
      const error = new HttpError("Signing up failed, please try again later", 500);
      return next(error);
    }
  };

const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("&&&&&&&&&&&&&&&&&&&&"+ req)
  
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
      console.log("!!!!!!!!!!!!!!!!!!!!!!! LOGIN HERE"+ existingUser);
      
      if (!existingUser) {
        const error = new HttpError("Invalid credentials, could not log you in", 401);
        return next(error);
      }
  
      const isValidPassword =   await bcrypt.compare(password, existingUser.password_hash);// temporarily commented for comparison
      
      if (!isValidPassword) {
        const error = new HttpError("Invalid credentials, could not log you in", 401);
        return next(error);
      }

      let token ;
      token = jwt.sign({userId: existingUser.id, email: existingUser.email},SECRET, {expiresIn: '1h'})

  
      existingUser.last_login = new Date();
      await existingUser.save();
      console.log("!!!!!!!!!!!!!!!!!!!!!!! LOGIN HERE USER"+ existingUser +" TOKEN"+ token);

  
      res.json({
        message: 'Logged in',
        user: {userId: existingUser.id, email: existingUser.email},
        token: token
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