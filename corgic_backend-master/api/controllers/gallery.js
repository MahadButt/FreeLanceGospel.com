const galleryService = require("../../services/GalleryService");
const path = require('path');
const fs = require('fs');

const getGallery=async (req,res)=>{

  var gallery=await galleryService.getGallery(req.params.limit)
   return res.json(gallery);
}

const insertImages=async(req,res)=>{
    const directoryPath = 'F:\\gospelImagesForGallery';
    var filePaths=[]
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    for(var i=0;i<files.length;i++){
        filePaths.push({files:`${directoryPath}\\${files[i]}`,name:files[i]})
    } 
    galleryService.insertImages(filePaths)
});
    
}

module.exports={
    getGallery,
    insertImages
}