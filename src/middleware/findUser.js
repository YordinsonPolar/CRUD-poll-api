const User = require('../model/user.js');
const Poll = require('../model/poll.js');

const findUser = async (req, res, next) => {
	let findUser = null;
	try {
		findUser = await User.findById(req.params.id);
		if (findUser === null) throw Error('Cannot find user')
	} catch (err) { return res.status(500).json({ message: err.message }) }
	
	res.findUser = findUser;
	next();
}

const findPoll = async (req, res, next) => {
	let findPoll = null;
	try {
		findPoll = await Poll.findById(req.params.id);
		if (findPoll === null) throw Error('Cannot find poll')
	} catch (err) { return res.status(500).json({ message: err.message }) }
	
	res.poll = findPoll;
	next();
}

exports.findPoll = findPoll;
exports.findUser = findUser;
