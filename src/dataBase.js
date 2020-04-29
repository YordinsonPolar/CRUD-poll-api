const mongoose = require('mongoose');

const MONGO_DB = process.env.MONGO_DB;

mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Database'));
