const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { 
		type: String,
		minlength: [ 3, ' Username must be 3 characteres min'],
		maxlength: [64, 'Username must be 64 characteres max'], 
		required: true,
		trim: true,
	},
		password: { 
			type: String,
			required: true,
			bcrypt: true,
			minlength: [7, 'Password must be 8 characteres min'],
			maxlength: [64, 'Password must be 64 characteres min'],
			trim: true
		},
			createdAt: { type: Date, default: Date.now()},
		})

userSchema.plugin(require('mongoose-bcrypt'));

const User = mongoose.model('User', userSchema);

module.exports = User;