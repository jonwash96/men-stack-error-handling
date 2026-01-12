const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const authRoutes = require('./controllers/auth.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./db/connection.js');
require('dotenv').config();

//* VAR
const PORT = process.env.PORT;

//* APP
const app = express();

//* MID
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended:true }));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGODB_URI+process.env.MONGODB_DB
    })
}));

//* ROUTE
app.get('/', (req,res) => {
    res.render('index.ejs', {
        user:req.session.user
    });
})
app.use('/auth', authRoutes);

app.get('/vip-lounge', (req,res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}`);
    } else {
        res.send('Sorry, no guests allowed.');
    }
})

//* LISTEN
app.listen(PORT, ()=>console.log(`Server Running on port 3002. Access at [http://localhost:${PORT}]`));