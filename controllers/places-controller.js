const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');


const Place = require('../models/place');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');
const place = require('../models/place');



const createPlace = async (req, res, next) => {

    const { title, description, coordinates, address, creator } = req.body;

    let user ;
    try{
      user = await User.findById(creator);
     
    }catch(err){
      const error = new HttpError("Creating Place failed !", 500);
      return next(new HttpError(error));

    }
    if(!user){
      return next(new HttpError("Could not find user by id", 500));
    }
    const createdPlace = new Place( {
      title,
      description,
      location: coordinates,
      address,
      creator
    });
    try{
      const sess = await mongoose.startSession();
       sess.startTransaction();
       await createdPlace.save({session: sess});
       user.places.push(createdPlace);
       await user.save({session: sess})
       await sess.commitTransaction();

    }catch(err){
      const error = new HttpError("Creating Place failed !", 500);
      return next(new HttpError(error));


    }
  
};

const getPlaces = async (req, res, next) => { 
  let places;
  try{
     places = await Place.find();

  }catch(err){
    const error = new HttpError("Could not find any places");
    return next(error);
}
res.json({places: places.map(place=>place.toObject({getters: true}))})

}


const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const result = await Place.findById(placeId).exec();

    if (result === null) {
      return next(new HttpError('Could not find place for the provided id', 404));
    }

    res.status(200).json({ place: result.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError('Error fetching place by Id', 500)); 
  }
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const result = await Place.find({ creator: userId }).exec();

    if (result.length === 0) {
      return next(new HttpError('Could not find place for the provided user id', 404));
    }
    res.status(200).json({ places: result.map(place => place.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError('Error fetching place by user Id', 500)); 
  }
};

const patchPlace = async (req, res, next) => {
  const errors = validationResult(req);
  const placeId = req.params.pid;
  const { title, description } = req.body;

  try {
    let place = await Place.findById(placeId).exec();

    if (!place) {
      return next(new HttpError('Could not find place by id', 404));
    }

    place.title = title;
    place.description = description;

    const updatedPlace = await place.save(); 

    res.status(200).json({ place: updatedPlace.toObject() });
  } catch (err) {
    return next(new HttpError('Error saving the updated place', 500));
  }
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    const place = await Place.findById(placeId).populate('creator');

    if (!place) {
      return next(new HttpError("Could not find place", 404));
    }
    
    const sess = await mongoose.startSession();
     sess.startTransaction
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    sess.commitTransaction();

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (err) {
    return next(new HttpError("Caught error while deleting", 500));
  }
};

module.exports = { 
  getPlaceById, 
  getPlaceByUserId, 
  createPlace, 
  patchPlace, 
  deletePlace, 
  getPlaces 
};