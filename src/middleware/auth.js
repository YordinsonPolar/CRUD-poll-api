const { verify, sign }  = require('jsonwebtoken');
const User = require('../model/user.js');

const isAuth = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	let token = authHeader && authHeader.split(' ')[1];

	if (token === null) return res.status(401).json({ message: 'Unauthorized'});
	
	verify(token, process.env.SECRET, (err, user) => {
		if (err) return res.status(403).json({ message: err.message })
		res.tokenUser = user;
		next();
	})
}

const createAccessToken = (user) => {
	return sign({ username: user.username }, process.env.SECRET, { expiresIn: "4h"});
}

const refreshAccessToken = async (req, res, next) => {
	const token = req.cookies.jid;
	if (!token) return res.status(500).json({ message: 'No valid token' });

	let payload = null;
	let newAccessToken = null;
	try { 
		payload = await verify(token, process.env.REFRESH_SECRET );
		const user = await User.findOne({ _id: payload.id });
	 	newAccessToken = await sign({ id: user._id }, process.env.SECRET, { expiresIn: "7d" });
	} catch (err) { return res.status(500).json({ message: err.message }) };
	
	return res.json({ accessToken: newAccessToken });
}


exports.createAccessToken = createAccessToken;
exports.isAuth = isAuth;
exports.refreshAccessToken = refreshAccessToken;
