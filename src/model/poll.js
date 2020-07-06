const mongoose = require('mongoose');
 
const pollSchema = new mongoose.Schema({
	question: { type: String, required: true, minlength: [ 7, '7 characteres min'] },
	answerA: { type: String, required: true, minlength: [ 3, '3 characteres min'] },
	answerB: { type: String, required: true, minlength: [ 3, '3 characteres min'] },
	votesA: { type: Number, default: 0, required: true },
	votesB: { type: Number, default: 0, required: true },
	createdBy: { type: String, required: true },
	userVotes: [
		{
			username: { type: String, required: true},
			answer: { type: String, required: true},
		}
	]
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;