const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/auth');

const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
}).
    then(() => console.log("DB Connected"));


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use("/api", authRoutes); 

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});