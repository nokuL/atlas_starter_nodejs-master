const express = require('express');

const {check} = require('express-validator');

const {getUsers, getUserById, createUser, patchUser, deleteUser, login, signup} = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();




router.get('/', getUsers);

//router.get('/:uid', getUserById);

/* router.post('/', [check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})
],  createUser); */

/* router.patch('/:uid', [check('name').not().isEmpty(), 
check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})
],patchUser); */

//router.delete('/:uid', deleteUser)

router.post('/login', login);

router.post('/signup', fileUpload.single('image'), [check('name').not().isEmpty(), 
    check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})
    ], createUser);

module.exports = router;