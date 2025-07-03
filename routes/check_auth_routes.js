const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;


module.exports = (req, res, next)=>{

    if(req.method==='OPTIONS'){
        return next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1];// splitting token
        if(!token){
            throw new Error("Authentication failed");
          
        }
        const decodedToken = jwt.verify(token, SECRET);
         req.userData = {userId: decodedToken.userId, email: decodedToken.email};
         next();
        

    }catch(err){
        const error = new HttpError("Authentication failed");
        return  next(error);

    }
  
}