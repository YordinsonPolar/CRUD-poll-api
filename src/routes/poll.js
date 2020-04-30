const router = require('express').Router();
const { findPoll } = require('../middleware/findUser.js');
const { isAuth } = require('../middleware/auth.js');
const { updateVotes } = require('../utils/updateVotes.js');

router.get('/', async (req, res) => {
	try {
		const polls = await Poll.find();
		return res.json(polls);
	} catch(err) { res.status(500).json({ message: err.message }) }
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
		const newPoll = new Poll({ ...req.body, votesA: 0, votesB: 0, createdBy: req.user.username});
		const savePoll = await newPoll.save();
		return res.json(savePoll);
	} catch (err) {
		res.status(500).json({ message: err });
	}
})

router.patch('/vote/:id',isAuth, findPoll, async (req, res) => {
	const answer = req.body.answer.toLowerCase();
	const userVote = res.poll.userVotes.find(vote => vote.username === res.user.username );
	if (!userVote){
		try {
			const newVote = res.poll.userVotes.push({ username: res.user.username, answer: answer });
			const saveNewVote = await res.poll.save();
			const saveUpdateVote = await updateVotes(req.params.id, res.user.username, answer);
			return res.json(saveUpdateVote);
		} catch(err) { res.status(500).json({ message: err.message })}

	} if (userVote.answer === answer) return res.status(500).json({ message: `You has voted already `});
	else {
		try {
			const saveUpdateVote = await updateVotes(req.params.id, res.user.username, answer);
			return res.json(saveUpdateVote);
		} catch(err) { return res.status(500).json({ message: err.message })}
	}
})

router.delete('/:id', isAuth, findPoll, async (req, res) => {
	try {
		await res.poll.remove();
		return res.json({ message: 'Deleted poll'})
	} catch (err) { return res.status(500).json({ message: err.message }) }
})

module.exports = router;