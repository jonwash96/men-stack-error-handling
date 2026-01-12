const express = require('express');
const router = express.Router();

const Fruit = require('../models/Fruit.js');

router.get('/new', (req, res) => {
  res.render('fruits/new.ejs');
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.name.trim()) {
      throw new Error("Invalid input! 'Name' cannot be empty.")
    }

    await Fruit.create(req.body);
    req.session.mesage = "Fruit Successfully Created"

    req.session.save(() => {
      res.status(200).redirect('/fruits');
    })
  } catch (error) {
    console.error(error.message);

    req.session.message = error.message

    req.session.save(() => {
      res.status(400).render('fruits/new.ejs', { errorMessage:error.message });
    });
  }
});

router.get('/', async (req, res) => {
  const foundFruits = await Fruit.find();
  res.render('fruits/index.ejs', { fruits: foundFruits });
});

module.exports = router;