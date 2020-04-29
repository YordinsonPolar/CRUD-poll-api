const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const db = require('./dataBase.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { refreshAccessToken } = require('./middleware/auth.js');
const { isAuth } = require('./middleware/auth.js');

// Config
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser()); 
app.use(cors());

//routes
app.use('/', require('./routes/user'))
app.use('/polls', require('./routes/poll'))
app.post('/polls/refreshAccessToken', isAuth, refreshAccessToken);


app.listen(PORT, () => console.log(`Server Started ${PORT}`));