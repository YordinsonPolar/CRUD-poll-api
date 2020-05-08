const Poll = require('../model/poll.js');

const updateVotes = async (docId , username, newAnswer, hasVote) => {
	const { votesA, votesB } = await Poll.findOneAndUpdate(
		{ _id: docId, 'userVotes.username': username },
		{ $set: { 'userVotes.$.answer': newAnswer }});

	let votes = null;
	if (hasVote) { 
		if (newAnswer === 'a') votes = { votesA: votesA + 1, votesB: votesB > 0 ? -1 : 0 };
		if (newAnswer === 'b') votes = { votesB: votesB + 1, votesA: votesA > 0 ? -1 : 0 };
	}else {
		if (newAnswer === 'a') votes = { votesA: votesA + 1 };
		if (newAnswer === 'b') votes = { votesB: votesB + 1 };
	}
	if(!votes) throw Error('Invalid answer');
	const newVotes = await Poll.findOneAndUpdate({ _id: docId }, { $set: votes }, { new: true });
	return newVotes;

}

exports.updateVotes = updateVotes;