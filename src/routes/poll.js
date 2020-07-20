const router = require('express').Router();
const { findPoll } = require('../middleware/findUser.js');
const { isAuth } = require('../middleware/auth.js');
const { paginatedResults } = require('../middleware/pagination.js');

const Poll = require('../model/poll.js');

const { getAllPolls, getAllQuestions, getPoll, updatePoll, addPoll, addVote, deletePoll } = require('../controllers/poll.js');

router.get('/', paginatedResults(Poll), getAllPolls)
router.get('/questions/:question', getAllQuestions)
router.get('/poll/:id', getPoll)
router.patch('/:id', isAuth, findPoll, updatePoll)
router.post('/add', isAuth, addPoll)
router.patch('/vote/:id',isAuth, findPoll, addVote)
router.delete('/:id', isAuth, findPoll, deletePoll)

module.exports = router;