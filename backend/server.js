'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');


app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));
app.options('*', cors());
app.enable('trust proxy');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json())


const userRoute = require('./user');
const shelterRoute = require('./shelter');
app.use('/api', routes);
app.use('/users', userRoute);
app.use('/shelters', shelterRoute);
app.use('/pets', require('./PetProfile/API/petAPI'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});