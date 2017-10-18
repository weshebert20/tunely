
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Song = require('./song.js');

let AlbumSchema = new Schema({
		artistName: String,
		name: String,
		releaseDate: String,
		genre: [String],
		songs: [Song.schema]
});

let Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;



