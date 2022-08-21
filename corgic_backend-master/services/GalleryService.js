const logger = require("../loaders/logger");
const Gallery = require('../models/Gallery')
const sharp = require("sharp");
const fs = require('fs');

var galleryService={
    getGallery:async function(limit){

        try{
            const images=await Gallery.query().limit(limit)
            const count=await Gallery.query().count('id as count');
            console.log(count)
            return { success: true,images,count:count[0].count};
        }
        catch(e){
            logger.error(e)
            return { success: false };
        }

    },

    insertImages:async function(fileArr){
        let ImagesArray = [];
        for (let i = 0; i < fileArr.length; i++) {
           
            const filename = fileArr[i].name.replace(/\..+$/, "");
            const newFilename = `optimized-gi-${filename}-${Date.now()}.jpeg`;
            try
            {
                await sharp(fileArr[i].files)
            .jpeg({ quality: 60, force: true })
            .toFile(`public/galleryImages/${newFilename}`);
            }
            catch(err){
                console.log(err)
            }
            

            const imagePath = `galleryImages/${newFilename}`;
            ImagesArray.push({image_url: imagePath })
  
                
                
        
        }
        for (let i = 0; i < ImagesArray.length; i++) {
            await Gallery.query().insert(ImagesArray[i]);
        }
    }
}

module.exports=galleryService