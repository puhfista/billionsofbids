/**
 * Created by ryanpfister on 3/25/15.
 */

var mongoose = require( 'mongoose' );
require('mongoose-long')(mongoose);
var Schema = mongoose.Schema;
var _ = require('underscore');
var validators = require('./validators');
var SchemaTypes = mongoose.Schema.Types;

var messageSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	senderId: {
		type: SchemaTypes.Long,
		required: true
	},
	recipientId:{
		type: SchemaTypes.Long,
		required: true
	},
	senderName: {
		type: String,
		required: true
	},
	body: {
		type: String,
		trim: true,
		validate: validators.maxStringLengthValidator
	},
	createdOn:{
		type: Date,
		default: Date.now
	}
});

var conversationSchema = new Schema({
	_id: {
		type: String,
		unique: true
	},
	messages: [messageSchema],
	largerUser: {
		type: SchemaTypes.Long,
		index: true,
		required: true
	},
	smallerUser: {
		type: SchemaTypes.Long,
		index: true,
		required: true
	},
	largerName:{
		type: String,
		required: true
	},
	smallerName:{
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Conversation', conversationSchema );