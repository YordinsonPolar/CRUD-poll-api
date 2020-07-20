const bcrypt = require('bcrypt');

const User = require('../model/user.js');
const { createAccessToken } = require('../middleware/auth.js');

const getUser = (req, res) => res.json(res.authUser);

const userLogin =  async (req, res) => {
	const { username, password } = req.body;
	try {
		const findUser = await User.findOne({ username });
		if (findUser !== null) {
			const decodePassword = await bcrypt.compare(password, findUser.password);
			if (!decodePassword) return res.status(500).json({ password: 'Password not match'});
		} else return res.status(500).json({ username: 'Username not found'});
		const accessToken = createAccessToken(findUser);
		return res.json({ accessToken });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
}

const userRegister = async (req,res) => {
	const { username, password, confirmPassword } = req.body;
	if (password !== confirmPassword) return res.status(500).json({ password: 'Password not match' })
	try { 
		const findUser = await User.findOne({ username });
		if (findUser) return res.status(500).json({ username: 'User already taken' });
		const newUser = new User({ username, password });
		const savedUser = await newUser.save();
		const accessToken = createAccessToken(savedUser);
		return res.json({ accessToken });
	} catch(err) { 
		return res.status(500).json(err);
  }
}

const userDelete = async (req, res) => {
	try {
		if (res.authUser.username === res.findUser.username || res.authUser.admin === true) {
			await res.findUser.remove();
			return res.json({ message: 'Deleted user'})
		}else {
			return res.status(401).json({ message: 'Unauthorized'});
		}
	} catch (err) { 
		return res.status(500).json({ message: err.message });
  }
}

exports.getUser = getUser;
exports.userLogin = userLogin;
exports. userRegister = userRegister;
exports. userDelete = userDelete;
