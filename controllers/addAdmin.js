 // const dotenv = require('dotenv')
 require('dotenv').config()
 const adminModel = require('../models/addAdmin')
 const bcrypt = require('bcrypt')
 const jwt = require('jsonwebtoken')
 const sendMail = require('../utils/adminEmail')
 
 exports.adminSignUp = async (req, res)=>{
 try {
     const {firstName, lastName, dateOfBirth, phoneNumber,username, email, password} = req.body;
     const saltPassword = await bcrypt.genSaltSync(12);
     const hashPassword = await bcrypt.hashSync(password, saltPassword)
 
     const data = {
         firstName,
         lastName,
         dateOfBirth,
         phoneNumber,
         username,
         email,
         password: hashPassword
     }
 
     const createAdmin = new adminModel(data)
     const myToken = await jwt.sign({
         id: createAdmin._id,
         email: createAdmin.email,
         password: createAdmin.password,
     }, process.env.JWTTOKEN, {
         expiresIn: "1d"
     })
 
     createAdmin.token = myToken
     await createAdmin.save()
 
     const verifyLink = `${req.protocol}://${req.get("host")}/api/adminVerify/${createAdmin._id}`
     const message = `Thank you for registering us. Please click on this link ${verifyLink} to verify your account`;
     sendMail({
         email: createAdmin.email,
         subject: "Kindly Verify",
         message,
     });
     res.status(201).json({
         message: "Admin created",
         data: createAdmin
     })
     } catch (error) {
         res.status(400).json({
             message: error.message
         })
     }
 }
 
 // exports.adminLogIn = async (req, res) => {
 //     try {
 //         const {email, username, password} = req.body;
 //         const checkEmail = await adminModel.findOne({email: email});
 //         // const checkUsername = await adminModel.findOne({username: username});
 //         const saltPassword = await bcrypt.genSaltSync(12);
 //         const hashPassword = await bcrypt.hashSync(password, saltPassword)
 //         const isPassword = await bcrypt.compare(password, hashPassword)
 //         if (!checkEmail) return 
 //         res.status(404).json({
 //             message: "Email not recognized"
 //         })
 //         if (!checkUsername) return 
 //         res.status(404).json({
 //             message: "Username not recognized"
 //         })
 //         if (!isPassword) {
 //             res.status(404).json({
 //                 message: "wrong password"
 //             })
 //         } else {
 //             const token = jwt.sign({
 //                 phoneNumber: checkEmail.phoneNumber,
 //                 username: checkEmail.username,
 //                 email: checkEmail.email,
 //                 password: checkEmail.password
 //             }, process.env.JWTTOKEN, {
 //                 expiresIn: "4h"
 //             })
 //         }
 //         checkEmail.token = token
 //         await checkEmail.save()
 //         res.status(201).json({
 //             message: "Logged In Successfully"
 //         })
 //     } catch (err) {
 //         res.status(400).json({
 //             message: err.message
 //         })
 //     }
 // }
 
 exports.adminLogIn = async(req,res) =>  {
     try{
         const {email,password} = req.body
         const check = await adminModel.findOne({email:email})
         if(!check) return res.status(404).json({message:'Not found'})
         const isPassword =await bcrypt.compare(password,check.password)
         if(!isPassword) return res.status(404).json({message:'Email or password incorrect'})
 
         const myToken = jwt.sign({
             id:check._id,
             password: check.password, 
             superAdmin:check.superAdmin}, process.env.JWTTOKEN, {expiresIn: "1d"})
 
         check.token = myToken 
         await check.save()
          res.status(201).json({
             message:"Successful",
             data:check
          })
     }catch(e){
         res.status(400).json({
             message:e.message
         })
     }
 }
 
 exports.adminVerify = async (req, res) => {
     try{    
         const userid = req.params.userid
         const user = await adminModel.findById(userid)
         await adminModel.findByIdAndUpdate(
             user._id,
             {
                 verify: true
             },
             {
                 new : true
             }
         )
 
         res.status(200).json({
             message: "you have been verified"
         })
 
     }catch(err){
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 
 exports.adminForgotPassword = async (req, res) => {
     try{
         const {email} = req.body
         const userEmail = await adminModel.findOne({email})
         if(!userEmail) return  res.status(404).json({ message: "Email not recognized" })
         const myToken = jwt.sign({
             id: userEmail._id,
             superAdmin: userEmail.superAdmin},
              process.env.JWTTOKEN, {
                 expiresIn: "1m"
             })
 
         const VerifyLink = `${req.protocol}://${req.get("host")}/api/changepassword/${userEmail._id}/${myToken}`
         const message = `Use this link ${VerifyLink} to change your password`;
         adminSendEmail({
           email: userEmail.email,
           subject: "Reset Pasword",
           message,
         })
         
         res.status(202).json({
             message:"email have been sent"
         })
 
         // console.log(userEmail);
     }catch(err){
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 exports.adminResetPassword = async (req, res) => {
     try {
         const {password} = req.body
         const id = req.params.id
         const passwordchange = await adminModel.findById(id)
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt);
 
         await adminModel.findByIdAndUpdate(passwordchange._id,{
             password: hash
         },{new: true})
 
         res.status(202).json({
             message:"password updated"
         })
 
     } catch (err) {
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 exports.adminChangePassword = async (req, res) => {
     try {
         const {password} = req.body
         const id = req.params.id
         const passwordchange = await adminModel.findById(id)
         const isPassword =await bcrypt.compare(password, passwordchange.password)
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(password, salt);
 
         await adminModel.findByIdAndUpdate(passwordchange._id,{
             password: hash
         },
         {
             new: true
         })
 
         res.status(202).json({
             message:"password updated"
         })
     } catch (err) {
         res.status(400).json({
             message:err.message
         })
     }
 }
 
 exports.allAdmins = async (req, res)=>{
     try {
         const getAllAdmins = await adminModel.find()
         if (getAllAdmins) {
             res.status(200).json({
                 numberOfadmin: getAllAdmins.length,
                 message: "All Admins",
                     data: getAllAdmins
         })
         // console.log(getAll)
         } else {
             res.status(404).json({
                 message: "No admin in the database"
             });
         }
     } catch(err) {
         res.status(400).json({
             message: err.message
         });
     }
 }
 
 
 exports.oneAdmin = async (req, res) => {
     let id = req.params.id;
     const anAdmin = await adminModel.findById(id);
     if (anAdmin) {
         res.status(200).json({
             message: "An Admin with ID" + id,
             data: anAdmin
         })
     } else {
         res.status(404).json({
             message: err.message
         })
     }
 
 }
 
 exports.deleteAdmin = async (req, res) => {
     let id = req.params.id;
     const deletedAdmin = await adminModel.findByIdAndDelete(id);
     if (deletedAdmin) {
         res.status(200).json({
             message: "Successfully deleted admin with ID " + id,
             data: deletedAdmin
         })
     } else {
         res.status(404).json({
             message: err.message
         })
     }
 
 }
 
 
 exports.updateAdmin = async (req, res) => {
     const  {name, mobileNo,birthDate,gender,speciality,location} = req.body
     let id = req.params.id;
     const data = {
         name,
         mobileNo,
         birthDate,
         gender,
         speciality,
         location
     }
     const updatedAdmin = await adminModel.findByIdAndUpdate(id, {data});
     if (updatedAdmin) {
         res.status(200).json({
             message: "Successfully Updated admin with ID: " + id,
             data: updatedAdmin
         })
     } else {
         res.status(404).json({
             message: err.message
         })
     }
 
 }