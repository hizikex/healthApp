// require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const adminModel = require('../models/addAdmin')
// const dotenv = require('dotenv')
// // dotenv.config({path: './config/config.env'})

// const isSignIn = async (req, res, next) => {
//         const adminId = req.params.id;
//         const admin = await adminModel.findById(adminId)
//         // console.log(user);
//         const authToken = admin.token;
//         if(!authToken) return res.status(401).json({message: "Not authorized"});
                
//        jwt.verify(authToken, process.env.JWTTOKEN, (err, payload)=>{
//          if(err) return res.status(401).json({message: err.message})
//             req.user = payload
//             next()
//             // console.log(res.user);
//         })        
// }

// const IsAdminAuth = (req, res, next)=>{
//     isSignIn(req, res, ()=>{
//         // console.log("lookig", req.user);
//         if(req.user.superAdmin){
//             next()
//         }else{
//             res.status(403).json({message: "You are not an admin"})
//         }
//     })
// }

// module.exports = {IsAdminAuth}