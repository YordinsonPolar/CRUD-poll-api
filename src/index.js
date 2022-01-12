const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const db = require('./dataBase.js');
const { refreshAccessToken } = require('./middleware/auth.js');
const { isAuth } = require('./middleware/auth.js');

const corsOptions ={
  origin:'*', 
  credentials:true, //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

// Config
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser()); 
app.use(cors(corsOptions));

//routes
app.use('/', require('./routes/user'))
app.use('/polls', require('./routes/poll'))
app.post('/polls/refreshAccessToken', isAuth, refreshAccessToken);


app.listen(PORT, () => console.log(`Server Started ${PORT}`));