const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');


const Place = require('../models/place');



const createPlace = async (req, res, next) => {

    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = new Place( {
      title,
      description,
      location: coordinates,
      address,
      creator
    });
    await createdPlace.save().then((result) => {
      res.status(201).json({ place: result });
    }).catch(err => {new HttpError('Creating place failed, please try again', err);
      return next(err);
    });
  
};

const getPlaces = async (req, res, next) => { 
await Place.find()
.exec()
.then((result)=>{res.json({places: result})})
.catch(err=> {
  new HttpError(err)
  return next(err);})

}


const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

await Place.findById(placeId)
.exec()
.then((result)=>{
  if(result === null){
    return next(new HttpError('Could not find place for the provided id', 404));
  }else{
    res.status(200).json({place: result.toObject({getters: true})});
  }
}).catch(err=>{
  new HttpError('Error fetching place by Id', err);
  return next(err);
})

};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  await Place.find({ creator: userId})
  .exec()
  .then(result => {
    if(result.length === 0){
      return next(new HttpError('Could not find place for the provided user id', 404));
    }else{
      res.status(200).json({places: result})} 
    }
    )
  .catch(err=>{
    new HttpError('Error fetching place by user Id', err);
    return next(err);
  })

};


const patchPlace = async (req, res, next) => {
  const errors = validationResult(req);
  const placeId = req.params.pid;
  const { title, description } = req.body;
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