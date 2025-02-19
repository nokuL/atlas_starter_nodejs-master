const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const { MongoClient, ObjectId } = require("mongodb");


const Place = require('../models/place');


// The connect() method does not attempt a connection; instead it instructs
// the driver to connect using the settings provided when a connection
// is required.

// Provide the name of the database and collection you want to use.
// If the database and/or collection do not exist, the driver and Atlas
// will create them automatically when you first write data.
const dbName = "places_db";
const collectionName = "more_recipes";

// Create references to the database and collection in order to run
// operations on them.



const createPlace = async (req, res, next) => {

    const { title, description, coordinates, address, creator } = req.body;
    let creatorId;
    try {
      creatorId = new ObjectId(creator);
    } catch (err) {
      return next(new HttpError('Invalid creator ID', 400));
    }
    
    const createdPlace = new Place({
      title,
      description,
      location: coordinates,
      address,
      creator: creatorId
    });
      
     await createdPlace.save()
     .then((result) => {
        res.status(201).json({ place: result });
        console.log(`${result.insertedCount} documents successfully inserted.\n`);
    })
    .catch(err => new HttpError(err));
    

};

const getPlaces = async (req, res, next) => { 
 await Place.find()
 .exec()
 .then((result) => { res.json({ places: result }); })
 .catch(err => new HttpError(err));

}



const getPlaceById = async (req, res, next) => {
  const placerId = req.params.pid;

  try{
    await client.connect();
    const db = client.db('placer_db');
    const collection = db.collection('places');
    const place = await collection.findOne({ _id: new ObjectId(placerId) });

  }catch(err){
    return next(new HttpError('Fetching place failed, please try again', 500));

  }finally{
    await client.close();

  }
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  try{
    const db = client.db('places_db');
    const collection = db.collection('places');
    const places = await collection.find({ creator: userId }).toArray();

  }catch(err){
    return next(new HttpError('Fetching places failed, please try again', 500));

  }finally{
    await client.close();

  }

};


const patchPlace = async (req, res, next) => {
  const errors = validationResult(req);
  const placeId = req.params.pid;
  const { title, description } = req.body;
  try{
    await client.connect();
    const db = client.db('places_db');
    const collection = db.collection('places');
    const result = await collection.updateOne({ _id: new ObjectId(placeId) }, { $set: { title, description } });

    if(result.modifiedCount === 0){
      return next(new HttpError('Could not find place for this id', 404));
    }

    res.status(200).json({ message: 'Place updated successfully' });


  }catch(err){
    return next(new HttpError('Updating place failed, please try again', 500));
  }finally{

  }
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  try{
    await client.connect();
    const db = client.db('places_db');
    const collection = db.collection('places');
    const result = await collection.deleteOne({ _id: new ObjectId(placeId) });

    if(result.deletedCount === 0){
      return next(new HttpError('Could not find place for this id', 404));
    }

    res.status(200).json({ message: 'Place deleted successfully' });

  }catch(err){
    return next(new HttpError('Deleting place failed, please try again', 500));
  }finally{
    await client.close();
  }
}

module.exports = { 
  getPlaceById, 
  getPlaceByUserId, 
  createPlace, 
  patchPlace, 
  deletePlace, 
  getPlaces 
};