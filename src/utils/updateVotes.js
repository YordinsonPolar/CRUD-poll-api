const Poll = require('../model/poll.js');

const updateVotes = async (docId , username, newAnswer) => {
	const { votesA, votesB } = await Poll.findOneAndUpdate(
		{ _id: docId, 'userVotes.username': username },
		{ $set: { 'userVotes.$.answer': newAnswer }});

	let votes = null;
	if (newAnswer === 'a') votes = { votesA: votesA + 1, votesB: votesB > 0 ? votesB - 1 : 0};
	if (newAnswer === 'b') votes = { votesB: votesB + 1, votesA: votesA > 0 ? votesA - 1 : 0};
	
	if(!votes) throw Error('Invalid answer');
	const newVotes = await Poll.findOneAndUpdate({ _id: docId }, { $set: votes }, { new: true });
	return newVotes;

}

exports.updateVotes = updateVotes;