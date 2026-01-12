const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
})

router.get('/sign-in', async (req, res) => {
    res.render('auth/sign-in.ejs');
})

router.post('/sign-up', async (req, res) => {
    const userInDB = await User.findOne({ username: req.body.username });

    userInDB && res.send(`A user with username ${req.body.username} already exists. Please select a new username`);

    if (req.body.password !== req.body.confirmPassword) {
        return res.send(`Passswords must match!`)
    };

    const hasedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hasedPassword;

    const newUser = await User.create(req.body);

    res.send(newUser);
})

router.post('/sign-in', async (req, res) => {
    const userInDB = await User.findOne({ username: req.body.username });
    if (!userInDB) {
        return res.send(`A user with username ${req.body.username} does not exits. `);
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDB.password
    );
    if (!validPassword) {
        return res.send("Incorect Password. Please try again")
    };

    req.session.user = {
        username: userInDB.username,
        _id: userInDB._id
    };

    req.session.save(() => {
        res.redirect('/')
    });
})

router.get('/sign-out', async (req,res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
})

module.exports = router;