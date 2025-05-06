const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../models/http-error');
const { getPlaceById, getPlaceByUserId, createPlace, patchPlace, deletePlace, getPlaces } = require('../controllers/places-controller');
const checkAuth = require('./check_auth_routes');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();


router.get('/', getPlaces)

router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlaceByUserId)

router.use(checkAuth);

router.post(
    '/',
    fileUpload.single('image'),
    (req, res, next) => {
      if (!req.file) {
        return next(new HttpError('No image file provided.', 400));
      }
      next();
    },
    [check('title').not().isEmpty()], // Your validation checks
    createPlace
  );

router.patch('/:pid', [check('title').not().isEmpty(),
check('description').isLength({ min: 5 }),
check('address').not().isEmpty()], patchPlace)

router.delete('/:pid', deletePlace)

module.exports = router;