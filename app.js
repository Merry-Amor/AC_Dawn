var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const request = require('request');
var path = require('path');

const dice_url = "https://rocky-ridge-20428.herokuapp.com"

var dice_result = ""
var system_dice = "Eireann3rd"

app.use(express.static(__dirname));

function command_checker(msg){
  result = ""
  for(var i=0; i<msg.length; i++) {
      // console.log(msg.charAt(i));
      if(msg.charAt(i) == ':') {
        result_num = i;
        break;
      } else {
      }
   }
    for(var i=result_num + 1; i<msg.length; i++) {
        console.log(msg.charAt(i));
        if(msg.charAt(i) == "") {
          break;
        } else {
        result += msg.charAt(i);
        // console.log(result);
        }
     }
  req_uri = dice_url + '/v1/diceroll?system=' + system_dice + '&command=' + result
  // console.log(req_uri)
	request(req_uri, function (error, response, body) {
    console.log('body => ' + body) // Print the google web page.
    result = body;
    if (result == '{"ok":false,"reason":"unsupported dicebot"}' || result == undefined){
      return 'null'
    } else {
      result = JSON.parse(result);
      console.log(result.result)
      dice_result = result.result;
        result_msg = system_dice + ':' + dice_result;
        io.emit('chat message', result_msg)
    }
  });
}

function system_list_maker() {
  result = "";
  msg = [];
  systemAr = [];
  req_uri = dice_url + '/v1/names';
  request(req_uri, function (error, response, body) {
    result = body;
    result = JSON.parse(result);
    for (var i=0; i<result.names.length; i++) {
      systemAr = [result.names[i].name, result.names[i].system];
      msg.push(systemAr);
    }
    io.emit('post system list', msg);
  });
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/room.html');
});

app.get('/room/:roomId', function(req, res){
  res.sendFile(__dirname + '/room.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    command_checker(msg);
    console.log(dice_result)
    io.emit('chat message', msg);
  });
  socket.on('get system list', function(){
    system_list_maker();
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
