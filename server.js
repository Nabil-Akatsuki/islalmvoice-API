const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors")

dotenv.config();

const app = express();

require('./models/dbConfig');
app.use(cors())
app.use(express.json());
const userRoute = require('./controller/UserController');
app.use('/users', userRoute);
const messageRoute = require('./controller/senderController');
app.use('/sendmail', messageRoute);

app.listen((5300), () => {
    console.log(`Le serveur à demarrer sur le port 5300`)
});