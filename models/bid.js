/**
 * Created by ryanpfister on 3/23/15.
 */

var mongoose = require( 'mongoose' );
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var _ = require('underscore');
var validators = require('./validators');
var SchemaTypes = mongoose.Schema.Types;

var bidSchema = new Schema({
	_id: {
		type: String,
		unique: true
	},
	itemId: {
		type: String,
		index: true,
		required: true
	},
	userId: {
		type: String,
		index: true,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	bidAmount: {
		type: Number,
		required: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	}

});

module.exports = mongoose.model('Bid', bidSchema );