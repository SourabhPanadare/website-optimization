const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/receipe/:id', function(req, res, next) {
  const parameterId = req.params.id;
  const strURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+parameterId;

  return new Promise(function(resolve, reject) {
      request.get({url:strURL}, function(err, resp, body) {
          if (err) {
              reject(err);
          } else {
              resolve(JSON.parse(body));
          }
      })
  }).then(function(result) {
    res.render('receipe',result);
  });
});

module.exports = router;
