const express = require('express');
const {adminSignUp, adminLogIn, adminVerify, adminForgotPassword, adminResetPassword, adminChangePassword, allAdmins, oneAdmin, deleteAdmin, updateAdmin} = require('../controllers/addAdmin');
const {userSignUp, userlogIn, verifyUser, UserResetPassword, UserLogOut, UserForgotPassword, allUsers, oneUser, deleteUser, updateUser} = require('../controllers/addUsers')
const {newDoc, docVerify, docLogIn, docForgotPassword, docResetPassword, docLogout, allDoctors, oneDoctor, deleteDoctor, updateDoctor} = require('../controllers/addDoctor')
const { addMessage, getMessages } = require("../controllers/messageController");


const Router = express.Router();

//admin routes
Router.get('/alladmins', allAdmins)
Router.get('/admin/:id', oneAdmin)
Router.delete('/admin/:id', deleteAdmin)
Router.patch('/admin/:id', updateAdmin)
Router.route('/adminsignup').post(adminSignUp)
// Router.route('/userVerify/:id').post(verifyLink)
Router.route('/adminlogin').post(adminLogIn)
Router.route('/adminVerify/:userid').post(adminVerify)
Router.route('/adminForgotPassword').post(adminForgotPassword)
Router.route('/adminchangepassword/:id/:token').post(adminResetPassword)
Router.route('/adminchangepassword/:id').post(adminChangePassword)

// user routes
Router.get('/user/:id', oneUser)
Router.delete('/user/:id', deleteUser)
Router.patch('/user/:id', updateUser)
Router.route('/allusers').get(allUsers)
Router.route('/usersignUp').post(userSignUp)
Router.route('/userlogIn').post(userlogIn)
Router.route('/verifyUser/:id').post(verifyUser)
Router.route('/userforgotpassword').post(UserForgotPassword)
Router.route('/userchangepassword/:id/:token').post(UserResetPassword)
Router.route('/userlogOut').post(UserLogOut)

//doctors routes
Router.get('/alldoctors', allDoctors)
Router.get('/doctor', oneDoctor)
Router.delete('/doctor', deleteDoctor)
Router.patch('/doctors', updateDoctor)
Router.route('/sign').post(newDoc)
Router.route('/docVerify/:docid').post(docVerify)
Router.route('/login').post(docLogIn)
Router.route('/forgotpassword').post(docForgotPassword)
Router.route("/changepassword/:id/:token").post(docResetPassword)
Router.route('/logout').post(docLogout)

//message routes
Router.post("/addmsg/", addMessage);
Router.post("/getmsg/", getMessages);


module.exports = Router