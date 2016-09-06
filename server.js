const net = require('net');
const Movement = require('./Movement');
const SatelliteLocation = require('satellite-stream');

const id = '25544';
const rateAsSeconds = 3;
var locationStream = null;
var movementStream = Movement();

const server = net.createServer( socket => {

  socket.on('data', chunk => {
    let chunkString = chunk.toString().slice(0, -2); // Removes /r/n at end of line
    let chunkArray = chunkString.split(' ');

    if (chunkArray[0] === 'start'){
      if (!locationStream || locationStream.stopped) locationStream = SatelliteLocation(id, rateAsSeconds);

      locationStream.pipe(movementStream);
      movementStream.on('data', writeData);

    }else if(chunkArray[0] === 'stop'){
      stopStream();

    }else if (chunkArray[0] === 'close'){
      stopStream();
      socket.destroy();

    }else{
      socket.write('echo: ' + chunkString + '\n');
    }
  });

  var writeData = (data) => {
    let dataObj = JSON.parse(data);
    if (socket) socket.write('latitude speed: ' + dataObj.latitude + ' longitude speed: ' + dataObj.longitude + '\n');
  };

  function stopStream(){
    if (locationStream) locationStream.unpipe(movementStream);
    if (movementStream) movementStream.removeListener('data', writeData);
  }

});

module.exports = server;
