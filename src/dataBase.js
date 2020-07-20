const mongoose = require('mongoose');

const MONGO_DB = process.env.MONGO_DB;

const mongooseExeptions = { 
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
}

mongoose.connect(MONGO_DB, mongooseExeptions);
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Database'));
