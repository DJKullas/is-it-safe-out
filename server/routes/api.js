const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://api.openweathermap.org/data/2.5/weather?APPID=b090401a8d93fe8d9b1c0c9315ac27bf&units=imperial&zip=';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all posts
router.get('/weather', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}${req.query.zipCode},us`)
    .then(weather => {
        res.status(200).json(weather.data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

module.exports = router;