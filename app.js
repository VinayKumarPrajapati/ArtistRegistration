const express = require('express');
const mongoose = require('mongoose');

const artistRoutes = require('./routes/artist');

require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
}).
    then(() => console.log("DB Connected"));


app.use("/api", artistRoutes); 

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});