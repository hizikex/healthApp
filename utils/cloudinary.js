const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "df3lsxk9y",
  api_key: "213848831198536",
  api_secret: "yosxBbytYHjI-snqew6Pp5OBJPI"
});

module.exports = cloudinary;