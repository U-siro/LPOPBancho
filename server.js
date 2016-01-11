console.log("Defining variable and modules");
var express = require('express');
var app = express();
var users = new Array();
var tokentouser = new Array();
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var SilenceStat;
var multer  = require('multer');
var scrupload = multer({ dest: 'screenshot_uploads/' });
var repupload = multer({ dest: 'replay_uploads/' });
console.log("Reading config..");
try {
var config = JSON.parse(fs.readFileSync("config.json","utf8"));
} catch(e) {
  console.log("We found error from your config.json");
  console.log("Please verify your config.json");
  console.log(e);
  return;
}
if(config['SilenceStat']){
SilenceStat=1;
}
console.log("Config Loaded!");

console.log("Defining Functions");
function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
  req.rawBody += chunk;
  });
  req.on('end', function() {
    next();
  });
}


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function replaceAll(str, searchStr, replaceStr) {

    return str.split(searchStr).join(replaceStr);
}
function hex2bin(hex)
{
    var bytes = [], str;

    for(var i=0; i< hex.length-1; i+=2)
        bytes.push(parseInt(hex.substr(i, 2), 16));

    return String.fromCharCode.apply(String, bytes);    
}
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

function logc(str) {
console.log("[" + getDateTime() + "]" + str);
}

function get_logc(filename, ip){
logc("Get " + filename + "from " + ip); 
}

function post_logc(filename, ip){
logc("Get " + filename + "from " + ip); 
}
function toHex(str) {
  var hex = '';
  for(var i=0;i<str.length;i++) {
    hex += ''+str.charCodeAt(i).toString(16);
  }
  return replaceAll(hex," ","");
}
function isNormalPacket(hexpacket){
  if(hexpacket=="40000000"){
    return 1;
  } else {
    return 0;
  }
}
function isLogoutPacket(hexpacket){
  if(hexpacket=="20040000000"){
    return 1;
  } else {
    return 0;
  }
}

function scoreString(replayId, name, score, combo, count50, count100, count300, countMiss, countKatu, countGeki, FC, mods, avatarID, rank, timestamp){
  return replayId + "|" + name + "|" + score + "|" + combo + "|" + count50 + "|" + count100 + "|" + count300 + "|" + countMiss + "|" + countKatu + "|" + countGeki + "|" + FC + "|" + mods + "|" + avatarID + "|" + rank + "|" + timestamp + "\r\n";
}

function isInvaild(uid,upw){
  var sql = "SELECT * FROM users where username='" + uid + "' and passwordHash='" + upw + "';";
  logc(sql);
connection.query(sql, function(err, rows) {
if(!rows[0]) { 
  return 1;
}
return 0;
});
}




logc("Express.js Preparing..");
app.use(rawBody);


//MySQL Server
var connection = mysql.createConnection(config['mysql']);
logc("MySQL Connecting..");
connection.connect(function(err) {
    if (err) {
      console.error('MySQL Connection Error');
      console.error(err);
      throw err;
    } else {
      logc("MySQL Successfully Connected");
    }
});



app.post('/', function(req, res) {
var rawpost=req.rawBody;
res.set("cho-protocol","19");
  if(config['debug']) {
    if(isNormalPacket(toHex(rawpost))==0){
    logc("Received from client: " + rawpost);
    logc("Received from client with hex: " + toHex(rawpost));
  }
  }
var reqcon = req.rawBody.split(/\n/);

if(req.get("osu-token")) {
  var token=req.get("osu-token");
  var tusername=tokentouser[token];
      if(!isNormalPacket(toHex(rawpost))==0){
  logc("Bancho Request Received from " + tusername + "(" + token + ")");
}
if(isLogoutPacket(toHex(rawpost))==1){
  var tusername=tokentouser[token];
  logc("Player " + tusername + " leave the game");
}

  res.send("");

  return;
}

var nickname=reqcon[0];
var usertoken=makeid();
tokentouser[usertoken]=nickname;
logc("Player " + nickname + " joined the game with token " + usertoken);
res.set("cho-token",usertoken);
var sql = "SELECT * FROM users where username='" + reqcon[0] + "' and passwordHash='" + reqcon[1] + "';"

connection.query(sql, function(err, rows) {
if(!rows[0]) { 
  var sendbuffer=hex2bin("05000004000000FFFFFFFF");
        if(config['debug']) {
    logc("Send to client: " + sendbuffer);
  }
    res.send(sendbuffer);
    logc("Login Failed");
    return;
  } else {
        var out="";
        // Ban client locking
        if(config['ClientLock']){
    if(rows[0].isBanned){
out = "5C0000000000000005000004000000600200004b00000400000013000000470000040000000100000048000053006002USERNAMEREALLY6002";
    }
  }
    out = out + "USERID00040000000000000005000004000000600200004B0000040000001300000047000004000000010000004800000A000000020002000000030000005300001C000000600200000B07USERNAMEREALLY1800010000000000000000BC0100000B00002E0000006002000000000000000000000000000067B3040000000000D044783F030000000000000000000000BC010000000053000021000000020000000B0C436F6F6B69657A69426F74731801000000000000000000000000005300001B000000030000000B0642616E63686F1801000000000000000000440000005300001D0000007D0100000B084E696B6F6E696B6F180100000000000000000034000000600000";
    out = replaceAll(out, "USERID", "0f24");
    out = replaceAll(out, "USERNAMEREALLY", toHex(nickname));
    logc(nickname);

      if(config['debug']) {
    logc("original Send to client: " + out);
  }
    out = hex2bin(out);
    res.send(out);
  if(config['debug']) {
    logc("Send to client: " + out);
  }
}
});
});

//ranking submit
app.post('/web/osu-submit-modular.php', function(req, res) {

});

//get ranking
app.get('/web/osu-osz2-getscores.php', function(req, res) {
res.write("3|false|0|0|0\r\n\r\n\r\n9.28235\r\n\r\n");
logc(req.query.us + " " + req.query.ha);
if(isInvaild(req.query.us,req.query.ha)){
res.write(scoreString(0, 'You', 1, 0,
            0, 10, 50, 1, 0, 0,
            0, 0, 0, 2, 0));
res.write(scoreString(0, 'are', 0, 0,
            0, 0, 50, 1, 10, 0,
            0, 0, 0, 3, 0));
res.write(scoreString(0, 'invalid!', -1, 0,
            2, 10, 0, 1, 0, 0,
            0, 0, 0, 4, 0));
res.end();
return;
}
res.write(scoreString(0, 'Ranking', 1, 0,
            0, 10, 50, 1, 0, 0,
            0, 0, 0, 2, 0));
res.write(scoreString(0, 'not yet', 0, 0,
            0, 0, 50, 1, 10, 0,
            0, 0, 0, 3, 0));
res.write(scoreString(0, 'availble', -1, 0,
            2, 10, 0, 1, 0, 0,
            0, 0, 0, 4, 0));
res.end();
});

//replay
app.get('/web/osu-getreplay.php', function(req, res) {

});

//rate
app.get('/web/osu-rate.php', function(req, res) {
res.send("ok");
});

//error
app.post('/web/osu-error.php', function(req, res) {

});

//dummy #1(i don't know but it didn't any)
app.get('/web/bancho_connect.php', function(req, res) {
res.send("error: pass");
});

//dummy #2(i don't know but it didn't any)
app.get('/web/lastfm.php', function(req, res) {

});

// Update
app.get('/web/check-update.php', function(req, res) {
res.send("[]");
});

//screenshot
app.post('/web/osu-screenshot.php', scrupload.single('ss'), function(req, res) {
  console.log(req.body);
 // console.log(req.rawBody);
  var scrid = makeid();
  res.send(scrid);
  logc(req.files);
});

// fuck hackers
app.get('/web/', function(req, res) {
res.set("Location", "http://kkzkk.com/"); 
return res.end(res.writeHead(302, 'Fuck You')); 
});

// Special Pages
app.get('/u/me/avatar', function(req, res) {
  if(req.get('host')!="osu.ppy.sh"){
    res.send("Invaild Hostname!");
    return;
  }
  res.send("Hello");
});

// Redirect hard-coded page url
app.get('/forum/ucp.php', function(req, res) {
  if(!req.get('host')!="osu.ppy.sh"){
    res.send("Invaild Hostname!");
    return;
  }
  // Router
  if(req.query.i=="profile" && req.query.mode=="avatar"){
    res.set("Location", "/u/me/avatar");
    return res.end(res.writeHead(302, 'Hello Browser')); 
  }
  return res.end(res.writeHead(404, 'Not in there')); 
});



//need more work files:
//bancho_connect.php
//check-updates.php
//lastfm.php
//osu-addfavourite.php
//osu-checktweets.php
//osu-comment.php
//osu-error.php
//osu-get-beatmap-topic.php
//osu-getcharts.php
//osu-getfavourites.php
//osu-gethelp.php
//osu-getreplay.php
//osu-osz2-bmsubmit-getid.php
//osu-osz2-bmsubmit-post.php
//osu-osz2-bmsubmit-upload.php
//osu-osz2-getfilecontents.php
//osu-osz2-getfileinfo.php
//osu-osz2-getrawheader.php
//osu-osz2-getscores.php
//osu-rate.php
//osu-search-set.php
//osu-search.php
//osu-submit-modular.php

app.get('/', function(req, res) {
res.set("Location", config['site']); 
return res.end(res.writeHead(302, 'Webcome to Bancho')); 
});

app.get('*', function(req, res) {
logc(req.originalUrl + " accessed");
if(req.get('host')=="a.ppy.sh"){
  res.sendFile(__dirname + "/profile.png");
} else {
return res.end(res.writeHead(404, 'Not in there')); 
//res.send("Hmm.. Not found");
}


});

var server = app.listen(80, function() {
    logc('Bancho Listening on ' + server.address().port);
});
