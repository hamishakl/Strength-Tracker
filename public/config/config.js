const cloudinary = require('cloudinary').v2;

// Configure your cloud name, API key and API secret:

const myconfig = cloudinary.config({
  cloud_name: "df7rg1mde",
  api_key: "712936595958458",
  api_secret: "GPghvE0yD6Yk-rFTj_EryVXMXRU" ,
  secure: true
});

exports.myconfig = myconfig;