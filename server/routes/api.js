const config = require('../../src/secret.config.js');
const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = `https://api.openweathermap.org/data/2.5/weather?APPID=${config.weatherApiKey}&units=imperial&zip=`;

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/weather', (req, res) => {
  console.log(config);
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