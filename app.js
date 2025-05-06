require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users-routes');
const authRoutes = require('./routes/auth-route');
const app = express();

app.use(bodyParser.json());


app.use('/uploads/images', express.static(path.join('uploads', 'images')));




app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS'); // Add OPTIONS
  next();
});
app.use('/api/places/',placesRoutes);


app.use('/api/users/', usersRoutes);

//app.use('/auth', authRoutes);

app.use((req, res, next)=>{
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.use((error, req, res, next)=>{
   if(req.file){

    fs.unlink(req.file.path, (err)=>{
        console.log(err);
    })

   }
    if(req.headerSent){
      return  next(error);
    }
    res.status(error.code || 500).json({message: error.message || 'An unknown error occurred'})
})
const uri =
"mongodb+srv://noku:noku@cluster0.s6jlt.mongodb.net?retryWrites=true&w=majority";

 mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000 // Increase timeout
})
.then(()=>app.listen(5000, () => {
  console.log('Server is running on port 5000');
}))
.catch(err => console.log(err)); 
// mongoose.connect(uri)