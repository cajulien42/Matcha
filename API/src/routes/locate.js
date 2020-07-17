
const debug = require('debug')('routes:locate');
const axios = require('axios');
const express = require('express');
const _ = require('lodash');
const handler = require('../middleware/wrapper');

const router = express.Router();
const requiredProperties = ['username', 'password'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/geocode', handler(async (req, res) => {
  let ip = req.clientIp;
  const publicIp = require('public-ip');


  if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '127.0.0.1') ip = await publicIp.v4();
  // const localisation = await axios.get(`https://www.iplocate.io/api/lookup/${ip}`);
  // const localisation = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=6ec1c766d7d3402ea36680595e7bb16f`);
  const localisation = await axios.get(`http://api.ipstack.com/${ip}?access_key=50e20f387ee5f01ba3aca5fd1c6bc7a9`);
  // const localisation = await axios.get('https://api.ipdata.co?api-key=ddccecd17e6cc559ddbb1bb2e41db865f1cb5d82ecf71edfa684a5ff');
  // const adress = await axios.get(`https://www.latlong.net/c/?lat=${localisation.data.lat}&long=${localisation.data.lat}`);
  // const adress = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=LAT=${localisation.data.lat}&LNG=${localisation.data.lat}&key=251f06800b5a4219839cd2a3f802e878`);
  // const adress = await axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=6693e45f2d8b2d&lat=${localisation.data.latitude}&lon=${localisation.data.longitude}&format=json`);
  // debug(`https://eu1.locationiq.com/v1/reverse.php?key=6693e45f2d8b2d&lat=${localisation.data.latitude}&lon=${localisation.data.longitude}&format=json`);
  // const result = { localisation: localisation.data, adress }
  // debug(localisation.data);
  return res.status(200).json({
    success: true,
    payload: { localisation: localisation.data },
  });
}));

router.get('/reverseGeocode/:lat/:long', handler(async (req, res) => {
  const adress = await axios.get(`https://eu1.locationiq.com/v1/reverse.php?key=6693e45f2d8b2d&lat=${req.params.lat}&lon=${req.params.long}&format=json`);
  return res.status(200).json({
    success: true,
    payload: { adress: adress.data },
  });
}));

module.exports = router;
