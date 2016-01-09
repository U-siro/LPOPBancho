// lovelive!
console.log("Defining variable and modules");
var express = require('express');
var app = express();
var users=new Array();
var fs = require('fs');
var mysql = require('mysql');
var conv = require('binstring');
var bodyParser = require('body-parser');
var packets=[];
var failed;

console.log("Enabling PHP");
var phpnode = require('php-node')({bin:"C:\\xampp\\php\\php.exe"});
app.engine('php', phpnode);
app.set('view engine', 'php');

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

console.log("Express.js Preparing..");
  app.use(rawBody);
//app.set('views', "C:\\Users\\lpopme\\Downloads\\Server\\Server\\");
console.log("MySQL Connecting..");
  var connection = mysql.createConnection({
    host    :'ranking.lpop.me',
    port : 3306,
    user : 'root',
    password : '***REMOVED***',
    database:'osuserve_osuserver'
});
connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    } else {
      console.log("MySQL Successfully Connected");
    }
});

app.post('/', function(req, res) {
res.set("cho-token","yomama");
res.set("cho-protocol","19");
console.log("Bancho Request");
console.log(req.rawBody);
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
console.log("Login Failed Packet Successfully Saved!");
    console.log("Login Failed");
    return;
  } else {
    fs.readFile('./login.raw', 'utf8', function (err,data) {
  var out=data;
console.log(reqcon[0]);
  out=replaceAll(out,"LPOPYui",reqcon[0]);
  res.send(out);
  console.log(out);
});
}
});


//res.send(".................`...K..........G..........H..\n.............S......`.....LPOPYui......................`.............................................S..!.........CassandraBot...............S............Connor...........-...S......}.....Doomsday...........4...`..\n.........`...Y..........@........#osu@........#newsA........#osu..Main channel..A..F.....#news.;This will contain announcements and info, while beta lasts......:.....CassandraBot. Holy shit dude, it's working! :D..#osu.......'.....CassandraBot.\nThanks JustM3..#osu.......=.....CassandraBot.#Checkout #news for more information..#osu.......Z.....CassandraBot.?Bancho implementation is a go! Thanks to JustM3 for creating it..#news.......I.....CassandraBot..Chat doesn't work right now, but it's a start...#news.............Connor..<3..LPOPYui....");
//res.send("error: pass");
//res.sendFile("C:\\Users\\lpopvm\\Desktop\\Bancho\\login.raw");
});


app.get('*', function(req, res) {
res.send("We Don't accept any web request because rebuilding html");
});
//ranking submit
app.post('web/osu-submit-modular.php', function(req, res) {

});

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});
