/*
 *  core uploadfs.js
 *  package: /core/services/uploadfs.js
 */

const express = require('express');
const router = express.Router();
//const { URL } = require('url');

var fs = require('fs');

const request = require('request-promise');
const path = require('path');
const config = require('../config/config');

const multer = require('multer');

const asset = require('../models/assetModel');
const appName = 'develar';
const whoami = './core/services/uploadfs:';


const storageDir = config.storagePath;
const publicPath = config.publicPath;

function selectDestination(){
  let today = new Date();
  let day   = ('0000' + today.getDate()).substr(-2);
  let month = ('0000' + (today.getMonth()+1)).substr(-2);
  let year = today.getFullYear();

  let destinationPath = storageDir + '/assets' + '/' + year + '/' + month + '/' + day;

  if(!fs.existsSync(destinationPath)){
    destinationPath = storageDir;

    if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath);

    destinationPath += '/assets';
    if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath);

    destinationPath += '/'+year;
    if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath);

    destinationPath += '/'+month;
    if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath);

    destinationPath += '/'+day;
    if(!fs.existsSync(destinationPath)) fs.mkdirSync(destinationPath);
  }

  return destinationPath;

}

const es_cutoff = {
    "á" : "a",
    "Á" : "A",
    "é" : "e",
    "É" : "E",
    "í" : "i",
    "Í" : "I",
    "ó" : "o",
    "Ó" : "O",
    "ú" : "u",
    "Ú" : "U",
    "ñ" : "n"
};


function safeFileName(name){
  var str = name;
  str = str.split(' ').join('_');
  str = str.replace(/[áÁéÉíÍóÓúÚñ]/g,function(c) { return es_cutoff[c]; });
  return str;
};

function getFileType(name){
  let ftype = '';
  let tokens = name.split('.');
  if(tokens.length) {
    ftype = '.' + tokens[tokens.length - 1]

  }
  return ftype;
}


function setNormalizedFileName(originalname){
    let tstmp =  '_' + (new Date().getTime().toString());
    return  safeFileName(originalname) + tstmp + getFileType(originalname);
};



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
    let destination = selectDestination();
		//console.log('destination [%s]', destination);
		cb(null, destination);
	},

	filename: function (req, file, cb) {
    cb(null, setNormalizedFileName(file.originalname))
	}
});


//const upload = multer( {storage: storage });
const upload = multer({storage: storage}).single('file');
/** API path that will upload the files */
// router.post('/api/upload', function(req, res) {
// 	upload(req, res, function(err){
// 		console.log(req.file);
// 		if(err){
// 			res.json({ error_code: 1, err_desc: err });
// 			return;
// 		}
// 		res.json({error_code: 0 ,err_desc: null });
// 	});
// });

router.post('/assetupload', upload, function(req, res, next){

  let file = req.file;
  let uploadDate = new Date();

  let fileData = {
    filename:     file.filename,
    path:         path.relative(publicPath,req.file.path),
    originalname: file.originalname,
    encoding:     file.encoding,
    mimetype:     file.mimetype,
    size:         file.size,
    destination:  file.destination,
    upload:       uploadDate,
    uploadtime:   uploadDate.getTime()
  }

  asset.createAssetFromUpload(fileData, function(err){

        res.status(400).json(err);

  }, function(asset){

        res.status(200).json(asset);
  })

})

router.post('/updatefile', upload, function(req, res, next){

  let file = req.file;
  let uploadDate = new Date();

  let fileData = {
    filename:     file.filename,
    path:         path.relative(publicPath,req.file.path),
    originalname: file.originalname,
    encoding:     file.encoding,
    mimetype:     file.mimetype,
    size:         file.size,
    destination:  file.destination,
    upload:       uploadDate,
    uploadtime:   uploadDate.getTime()
  }

  res.status(200).json(fileData);


})




  // const urlPath = new URL(req.file.path);
  // console.log('URL host [%s]', urlPath.host)
 
  // console.log('URL hostname [%s]', urlPath.hostname)
  // console.log('URL href [%s]', urlPath.href)
  // console.log('URL origin [%s]', urlPath.origin)
  // console.log('URL pathname [%s]', urlPath.pathname)
  //console.log('URL xx [%s]', urlPath.xx)
  //




router.post('/profile', upload, function(req, res, next){

  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any  

  //console.log('relative path: [%s]', path.relative(storageDir,req.file.path ))
  res.status(200).json(req.file);

  // const urlPath = new URL(req.file.path);
  // console.log('URL host [%s]', urlPath.host)
 
  // console.log('URL hostname [%s]', urlPath.hostname)
  // console.log('URL href [%s]', urlPath.href)
  // console.log('URL origin [%s]', urlPath.origin)
  // console.log('URL pathname [%s]', urlPath.pathname)
  //console.log('URL xx [%s]', urlPath.xx)
  //
})

// router.post('/files', upload.array('files'), function(req, res, next){
// 	// req.files is array of `photos` files
// 	// req.body will contain the text fields, if there were any

// 		if(err){
// 			res.json({ error_code: 1, err_desc: err });
// 			return;
// 		}
// 		res.json({error_code: 0 ,err_desc: null });
// })

// const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
// router.post('/cool-profile', cpUpload, function (req, res, next) {
//   // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
//   //
//   // e.g.
//   //  req.files['avatar'][0] -> File
//   //  req.files['gallery'] -> Array
//   //
//   // req.body will contain the text fields, if there were any
// })

// In case you need to handle a text-only multipart form, 
// you can use any of the multer methods (.single(), .array(), fields()). 
// Here is an example using .array():
// router.post('/images', upload.array(), function (req, res, next) {
//   // req.body contains the text fields
// })

module.exports = router;


//File information: each file contanis the following information
/**********************************************************************
   key 						Description 																		Note
***********************************************************************
fieldname 			Field name specified in the form 	
originalname		Name of the file on the user's computer 	
encoding 				Encoding type of the file 	
mimetype 				Mime type of the file 	
size 						Size of the file in bytes 	
destination 		The folder to which the file has been saved 		DiskStorage
filename 				The name of the file within the destination 		DiskStorage
path 						The full path to the uploaded file 							DiskStorage
buffer 					A Buffer of the entire file 										MemoryStorage
****/


//Multer Optx
/**********************************************************************
   key 						Description 																		Note
***********************************************************************
dest || storage 	Where to store the files
fileFilter 				Function to control which files are accepted
limits 						Limits of the uploaded data
preservePath 			Keep the full path of files instead of just the base name

If you want more control over your uploads, you'll want to use the storage option 
instead of dest. Multer ships with storage engines 
DiskStorage and MemoryStorage; More engines are available from third parties.
****/



//limits
/****************************************************************************************************
   key 						Description 																													Default
******************************************************************************************************
fieldNameSize		Max field name size 																											100 bytes
fieldSize 			Max field value size 																											1MB
fields 					Max number of non-file fields 																						Infinity
fileSize 				For multipart forms, the max file size (in bytes) 												Infinity
files 					For multipart forms, the max number of file fields 												Infinity
parts 					For multipart forms, the max number of parts (fields + files) 						Infinity
headerPairs 		For multipart forms, the max number of header key=>value pairs to parse 	2000


function fileFilter (req, file, cb) {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To reject this file pass `false`, like so:
  cb(null, false)

  // To accept the file pass `true`, like so:
  cb(null, true)

  // You can always pass an error if something goes wrong:
  cb(new Error('I don\'t have a clue!'))

}

****/



