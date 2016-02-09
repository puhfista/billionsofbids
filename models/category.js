/**
 * Created by ryanpfister on 4/27/15.
 */


var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var shortid = require('shortid');

var categorySchema = new Schema({
	_id: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
	name: {
		type: String,
		required: true
	},
	group: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Category', categorySchema );