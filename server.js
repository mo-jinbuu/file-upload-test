'use strict';

var express = require('express');
var cors = require('cors');
const multer = require ('multer')
const bodyParser = require('body-parser')
const path = require('path')

// Set Storage
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + 
    path.extname(file.originalname))
  }
})

// Init upload
const upload = multer({
  storage: storage,
}).single('upfile')

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send('Error while trying to upload file: ' + err)
    } else {
      console.log(req.file)
      let { originalname, mimetype, size } = req.file;
      res.json({
        name: originalname,
        type: mimetype,
        size: size
      })
    }
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
