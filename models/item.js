/**
 * Created by ryanpfister on 3/10/15.
 */

var mongoose = require( 'mongoose' );
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var _ = require('underscore');
var shortid = require('shortid');
var validators = require('./validators');
var SchemaTypes = mongoose.Schema.Types;


var itemSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
	userId: {
		type:  SchemaTypes.Long,
		index: true,
		required: true
	},
	images: {
		type: [String]
	},
	title: {
		type: String,
		required: true,
		trim: true,
		validate: validators.requiredStringValidator
	},
	categories: {
		type: [String],
		index: true,
		required: true
	},
	geolocation: {
		type: [Number],
		index: '2dsphere',
		required: true
	},
	city: {
		type: String,
		trim: true,
		required: true
	},
	state: {
		type: String,
		trim: true,
		required: true
	},
	zipcode: {
		type: String,
		trim: true,
		required: true
	},
	videoUrl: {
		type: String,
		trim: true
	},
	description:{
		type: String,
		required: true,
		trim: true,
		validate: validators.requiredStringValidator
	},
	minimumBid:{
		type: Number,
		'default': 0
	},
	endDate:{
		type: Date
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
});

itemSchema.index({ title: 'text' });

var model = mongoose.model('Item', itemSchema );
model.collection.ensureIndex({ title: 'text' }, function(err,a,b,c){
	var whatev = err;
});

module.exports = model;