const Transform = require('stream').Transform;

module.exports = function(rate, options){

  class Movement extends Transform{
    constructor(_options){
      super(_options);
      this._previousLat = null;
      this._previousLng = null;
      this._previousTime = null;
    }

    _transform(chunk, encoding, callback){

      const chunkObj = JSON.parse(chunk);
      const currentTime = new Date() / 1000;
      const timeIncrement = currentTime - this._previousTime;

      if (this._previousLat && this._previousLng){
        const latDelta = Math.abs((parseFloat(chunkObj.latitude) - this._previousLat)) / timeIncrement;
        const lngDelta = Math.abs((parseFloat(chunkObj.longitude) - this._previousLng)) / timeIncrement;
        const outputObj = JSON.stringify({latitude: latDelta, longitude: lngDelta});
        const buf = Buffer.from(outputObj);
        callback(null, buf);
      }else{
        callback(null, null);
      }
      this._previousLat = parseFloat(chunkObj.latitude);
      this._previousLng = parseFloat(chunkObj.longitude);
      this._previousTime = currentTime;
    }

  }

  return new Movement(rate, options);

};
