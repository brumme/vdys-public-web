const express = require('express');
const bodyParser = require('body-parser');
const util = require('./lib/util');
const fileutil = require('./lib/fileutil');
const config = require('./config.json');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/r/:roomId', function(req, res) {
  let roomData = fileutil.getRoomData(req.params.roomId);
  if ( roomData.state === "ERR" ) {
    res.redirect('/');
  } else {
    res.render('room', { roomName: roomData.data.roomName, streamKeyOut: roomData.data.streamKeyOut });
  }
});

app.post("/make", function (req, res) {
  let roomData = util.makeNewRoom(req.body.roomName);
  let roomURL = req.protocol + "://" + req.headers.host + "/r/" + roomData.roomId;
  roomData.roomURL = roomURL;

  var saved = fileutil.saveRoomData(roomData);
  if (saved.state === "ERR") {
    console.error("Room Save error!");
    res.redirect(".");
  }
  
  res.render('roomDetails', roomData);
});

app.get('/api/makeRoom/:roomName', function(req, res) {
  if (req.headers.apiKey == null)
    res.send("ERR_AUTH");
  if (config.valid_api_keys.indexOf(req.headers.apiKey) == -1)
    res.send("ERR_AUTH");
  let roomData = util.makeNewRoom(req.params.roomName);
  let roomURL = req.protocol + "://" + req.headers.host + "/r/" + roomData.roomId;
  roomData.roomURL = roomURL;

  var saved = fileutil.saveRoomData(roomData);
  if (saved.state === "ERR") {
    console.error("Room Save error!");
    res.redirect(".");
  }

  res.send(roomData);
});

app.listen(port, function () {
  console.log('Server listening on port ' + port);
});

setInterval(fileutil.deleteOldRooms, 10 * 1000);