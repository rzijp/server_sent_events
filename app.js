var express = require('express'),
    cpu = require('windows-cpu');

var app = express();

// static files are read from 'public' folder
app.use(express.static('public'));

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

// init message counter, every new message needs to have a unique id
var messageCount = 0;

// event stream
app.get('/update-stream', function(req, res) {
  req.socket.setTimeout(0x7FFFFFFF); // let request last as long as possible

  res.writeHead(200, { //send headers for event-stream connection
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // repeatedly send current CPU usage
  setInterval(function(req, res) {
    cpu.totalLoad(function(error, results) {
      if(error) {
        console.log(error);
      } else {
        messageCount++;
        res.write('id: ' + messageCount + '\n');
        res.write("data: "+ JSON.stringify({'cpu' : results[0]}) +'\n\n'); // Note the extra newline
      }
    });
  }, 1000, req, res);
});

app.listen(8000, function() {
  console.log("Express server listening on port 8000");
});