const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI+process.env.MONGODB_DB);
mongoose.connection.on('connected', ()=>console.log("Connected to MongoDB"));
mongoose.connection.on('error', ()=>console.log("Error Connecting to MongoDB"));