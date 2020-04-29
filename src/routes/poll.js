const router = require('express').Router();
const Poll = require('../model/poll.js');
const { findPoll } = require('../middleware/findUser.js');

router.get('/', async (req, res) => {
	try {
		const polls = await Poll.find();
		return res.json(polls);
	} catch(err) { res.status(500).json({ message: err.message }) }
})

router.patch('/:id', findPoll, async (req, res) => {
	let poll = req.body;
	for( data in poll ) { if (poll[data]) res.poll[data] = poll[data]; }

	try {
		const updatedPoll = await res.poll.save()
		return res.json(updatedPoll);
	} catch (err) { return res.status(400).json({ message: err }) }
})

router.post('/add', async (req, res) => {
	try {
		const newPoll = new Poll({ ...req.body, votesA: 0, votesB: 0, createdBy: req.user.username});
		const savePoll = await newPoll.save();
		return res.json(savePoll);
	} catch (err) {
		res.status(500).json({ message: err });
	}
})

router.delete('/:id', findPoll, async (req, res) => {
	try {
		await res.poll.remove();
		return res.json({ message: 'Deleted poll'})
	} catch (err) { return res.status(500).json({ message: err.message }) }
})

module.exports = router;