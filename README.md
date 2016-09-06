# Transform Implementation

An implementation of the satellite-stream module. It applies a transform stream to change location data to movement data – rate of change in latitude and longitude per second.

It launches a simple TCP server. The server implements the satellite-stream module and applies a transform to convert the stream of location data to movement data.  

## Deployment and Usage

After downloading, install the dependencies from the terminal window:  
`npm install`  

In the terminal window, start the server with:  
`node tcp-start.js`  

In another terminal window, open a client with:  
`telnet localhost 65000`  

The client responds to three commands:  
 - `start` - begins the stream and prints out movement speed as changes in latitude and longitude per second.
 - `stop` - halts the stream  
 - `close` - terminates the client TCP socket  

Any unrecognized commands will echo back to client. Stop the TCP server with `Option-C`.

## Notes

Movement.js is a factory function that produces a subclass of `stream.Transform`. It transforms the output from a Readable stream that writes JSON objects with a `latitude <float>` property and a `longitude <float>` property. The output of the transform is a JSON object with `latitude <float>` and `longitude <float>` properties that represent the change in degrees per second.

## Known Issues
Currently the server works reliably with one client. The server does not track separate clients so `start` and `stop` commands will affect all stream consumers and cause erratic behavior.  
