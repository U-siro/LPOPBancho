// lovelive!
console.log("Defining variable and modules");
var express = require('express');
var app = express();
var users=new Array();
var fs = require('fs');
var mysql = require('mysql');
var conv = require('binstring');
var bodyParser = require('body-parser');
// Your BanchoServer Website
var site="http://cafe.naver.com/lpopbancho";

//debug flag
var debug=1;

console.log("PHP is deprecated, don't load php anymore.");

console.log("Defining Functions");
function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function(){
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

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function replaceAll(str, searchStr, replaceStr) {

    return str.split(searchStr).join(replaceStr);
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

logc("Express.js Preparing..");
  app.use(rawBody);
logc("MySQL Connecting..");
  var connection = mysql.createConnection({
    host    :'ranking.lpop.me',
    port : 3306,
    user : 'root',
    password : '***REMOVED***',
    database:'osuserve_osuserver'
});
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
res.set("cho-token","lpopbancho");
res.set("cho-protocol","19");
logc("Bancho Request");
logc(req.rawBody);
var reqcon=req.rawBody;
reqcon=reqcon.split(/\n/);

if(req.get("osu-token")) {
  res.send("");
  return;
}

var sql="SELECT * FROM users_accounts where osuname='" + reqcon[0] + "' and passwordHash='" + reqcon[1] + "';"

connection.query(sql,function(err,rows) {

if(!rows[0]) { 

res.sendFile('./failed.raw');
logc("Login Failed Packet Successfully Saved!");
    logc("Login Failed");
    return;
  } else {
    fs.readFile('./login.raw', 'utf8', function (err,data) {
  var out=data;
  logc(reqcon[0]);
  out=replaceAll(out, "LPOPYui", reqcon[0]);
  res.send(out);
  if(debug) {
  logc("Send to client: " + out);
  }
});
}
});
});

//ranking submit
app.post('/web/osu-submit-modular.php', function(req, res) {

});

//get ranking
app.get('/web/osu-osz2-getscores.php', function(req, res) {

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

});

//dummy #2(i don't know but it didn't any)
app.get('/web/lastfm.php', function(req, res) {

});

//fuck hackers
app.get('/web/', function(req, res) {
res.set("Location","http://kkzkk.com/"); 
return res.end(res.writeHead(302, 'Fuck You <br> <img src="http://cdn.meme.am/images/300x/188585.jpg">')); 
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
res.send("Hello! You can get info about this bancho server in " + site);
});

app.get('*', function(req, res) {
return res.end(res.writeHead(404, 'Not in there')); 
res.send("Hmm.. Not found");
});

var server = app.listen(80, function() {
    logc('Bancho Listening on ' + server.address().port);
});