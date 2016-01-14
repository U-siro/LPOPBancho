// LPOPBancho Source Code
// Copyright 2016 Castar & NekoWasHere
// if you made any change, Please commit them!
// For more help, read "LICENSE"

// This is open source, but it is commercial software.
// Any server should have license.
// This is including forks, so if you don't have license,
// You can't use this.
// If you receive punishment by the conditions in copyright violation.
console.log("Defining variable and modules");
var version = "0.0.1";
var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
//https.globalAgent.options.secureProtocol = 'SSLv3_method';
var users = new Array();
var status = new Array();
var tokentouser = new Array();
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var formidable = require("formidable");
var SilenceStat;
var  util = require('util');
var options = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
};
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
function isExitBeatmapPacket(hexpacket){
  if(hexpacket=="000e0000b0b04020004bfffd40"){
    return 1;
  } else {
    return 0;
  }
}
String.prototype.startsWith = function(needle)
{
    return(this.indexOf(needle) == 0);
};
function scoreString(replayId, name, score, combo, count50, count100, count300, countMiss, countKatu, countGeki, FC, mods, avatarID, rank, timestamp){
  return replayId + "|" + name + "|" + score + "|" + combo + "|" + count50 + "|" + count100 + "|" + count300 + "|" + countMiss + "|" + countKatu + "|" + countGeki + "|" + FC + "|" + mods + "|" + avatarID + "|" + rank + "|" + timestamp + "|1\n";
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
function padLeft(nr, n, str){
    return Array(n-String(nr).length+1).join(str||'0')+nr;
}
//or as a Number prototype method:
Number.prototype.padLeft = function (n,str){
    return Array(n-String(this).length+1).join(str||'0')+this;
}







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

app.use(rawBody);
app.use(bodyParser.json({limit: '10mb'}));
logc("Express.js Preparing..");

var server = app.listen(80, function() {
    logc('Bancho Listening on ' + server.address().port);
});

https.createServer(options,app).listen(443, function(){
  logc('Secure HTTPS on *:443');
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
      if(isNormalPacket(toHex(rawpost))!=0){
  logc("Bancho Request Received from " + tusername + "(" + token + ")");
}
if(isLogoutPacket(toHex(rawpost))==1){
  var tusername=tokentouser[token];
  logc("Player " + tusername + " leave the game");
}

  res.send(hex2bin("0d0a"));

  return;
}

var nickname=reqcon[0];
var usertoken=makeid();
tokentouser[usertoken]=nickname;
logc("Player " + nickname + " joined the game with token " + usertoken);
res.set("cho-token",usertoken);
var sql = "SELECT * FROM users where username='" + reqcon[0] + "' and passwordHash='" + reqcon[1] + "';"
var banned = 0;
connection.query(sql, function(err, rows) {
if(!rows[0]) { 
  var sendbuffer=hex2bin("05000004000000FEFFFFFF");
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
  // Just send login packet only, other packet should use with token
    out = out + "USERID00040000000000000005000004000000600200004B0000040000001300000047000004000000010000004800000A000000020002000000030000005300001C000000600200000BNICKLENGTHUSERNAMEREALLY1800010000000000000000BC0100000B00002E0000006002000000000000000000000000000067B3040000000000D044783F030000000000000000000000BC0100000000530000210000000200";
    out = replaceAll(out, "USERID", rows[0].id.padLeft(4,0));
    out = replaceAll(out, "USERNAMEREALLY", toHex(nickname));
    out = replaceAll(out, "NICKLENGTH", padLeft(nickname.length.toString(16),2,0));
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
// Not completed yet
    var form = new formidable.IncomingForm();
console.log("parsing");
    form.parse(req);

    form.on("fileBegin", function (name, file){
        file.path = __dirname + "/temp/" + file.name;
    });

    form.on("file", function (name, file){
        console.log("Uploaded " + file.name);
    });

res.send("error: disabled");
});

//get ranking
app.get('/web/osu-osz2-getscores.php', function(req, res) {
res.write("2|false|141255|45204|7152\n0\n[bold:0,size:20]" + req.query.f + "|Powered by LPOPBancho\n9.19911\n");
logc(req.query.us + " " + req.query.ha);
res.write(scoreString(0, req.query.us, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0));
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
app.get('/web/osu-getreplay.php', function(req, re) {

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
res.send("us");
});

//dummy #2(i don't know but it didn't any)
app.get('/web/lastfm.php', function(req, res) {

});

// Update
app.get('/web/check-updates.php', function(req, res) {
res.send("[]");
});

//screenshot
app.post('/web/osu-screenshot.php', function(req, res) {
 // console.log(req.rawBody);
  var scrid = makeid();
  res.write(scrid);
    res.status(204).end()
    console.log(req.body);// form fields
    console.log(req.files);// form files

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
app.get('/version', function(req, res) {
  res.send("This running LPOPBancho v" + version + ".");
});

// Redirect hard-coded page url
app.get('/forum/ucp.php', function(req, res) {
  if(req.get('host')!="osu.ppy.sh"){
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

