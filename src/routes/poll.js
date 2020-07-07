const router = require('express').Router();
const { findPoll } = require('../middleware/findUser.js');
const { isAuth } = require('../middleware/auth.js');
const { updateVotes } = require('../utils/updateVotes.js');
const { paginatedResults } = require('../middleware/pagination.js');

const Poll = require('../model/poll.js');

router.get('/', paginatedResults(Poll), async (req, res) => {
	return res.json(res.paginatedResults);
})

router.get('/questions/:question', async (req, res) => {
	try{
		const filter = { question: { $regex: new RegExp(req.params.question,'i')}};
		const getAllquestions = await Poll.find(filter);
		const questions = getAllquestions.map(poll => ({ question: poll.question, _id: poll._id })).sort(new Intl.Collator().compare);
		return res.json(questions)
	}catch(err){ return res.status(500).json({ message: err.message })}
})

router.get('/poll/:id', async (req, res) => {
	try{
		const getPoll = await Poll.findById({ _id: req.params.id });
		if (getPoll === null) throw Error('Cannot find Poll');
		else return res.json(getPoll);
	}catch(err){ return res.status(500).json({ message: err.message})}
})

router.patch('/:id', isAuth, findPoll, async (req, res) => {
	let poll = req.body;
	for( data in poll ) { if (poll[data]) res.poll[data] = poll[data]; }

	try {
		const updatedPoll = await res.poll.save()
		return res.json(updatedPoll);
	} catch (err) { return res.status(400).json({ message: err }) }
})

router.post('/add', isAuth, async (req, res) => {
	try {
		const newPoll = new Poll({ ...req.body, votesA: 0, votesB: 0, createdBy: res.authUser.username});
		const savePoll = await newPoll.save();
		return res.json(savePoll);
	} catch (err) { return res.status(500).json({ message: err.errors }) }
})

router.patch('/vote/:id',isAuth, findPoll, async (req, res) => {
	const answer = req.body.answer.toLowerCase();
	const { username } = res.authUser;
	const userHasVote = res.poll.userVotes.find(vote => vote.username === username );
	if (!userHasVote){
		try {
			const newVote = res.poll.userVotes.push({ username, answer });
			const saveNewVote = await res.poll.save();
			const saveUpdateVote = await updateVotes(req.params.id, username, answer, false);
			return res.json(saveUpdateVote);
		} catch(err) { res.status(500).json({ message: err.message })}

	} if (userHasVote.answer === answer) return res.status(500).json({ message: `You has voted already `});
	else {
		try {
			const saveUpdateVote = await updateVotes(req.params.id, username, answer, true);
			return res.json(saveUpdateVote);
		} catch(err) { return res.status(500).json({ message: err.message })}
	}
})

router.delete('/:id', isAuth, findPoll, async (req, res) => {
	const { username, admin } = res.authUser;
	try {
		if (username === res.poll.createdBy || admin === true) {
			await res.poll.remove();
			return res.json({ message: 'Deleted poll'});
		}
		return res.status(401).json({ message: 'Unauthorized'});
	} catch (err) { return res.status(500).json({ message: err.message }) }
})

module.exports = router;