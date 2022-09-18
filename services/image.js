const ImageKit = require("imagekit");
const express = require('express');
const router = express.Router();
require('dotenv').config();
const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_PUBLIC_KEY,
    privateKey: process.env.IMAGE_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_ENDPOINT
});

module.exports.uploadImage = function (file,imageName,callback) {
    imagekit.upload({
        useUniqueFileName: true,
        file: file,
        fileName: imageName, 
        folder: 'upload'
    }, (error, result) => {
        if(error) console.log(error);
        else console.log(result);
        callback(result,error);
    });
}