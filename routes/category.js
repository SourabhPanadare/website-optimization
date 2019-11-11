const express = require('express');
const request = require('request');

const router = express.Router();
var categoryResult, filterResult;

router.get('/categories/:id', function(req, res, next) {
  const parameterId = req.params.id;
  const strCategoryURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
  const strFilterURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c="+parameterId;

  var categoryPromise = new Promise(function(resolve, reject) {
    request.get({url:strCategoryURL}, function(err, resp, body) {
        if (err) {
            reject(err);
        } else {
          var categoryJsonObject = {};
          var categoryJsonArray = [];
          var categoryResponse = JSON.parse(body);
          categoryResponse.categories.map(function(item) {
              categoryJsonObject = {};
              categoryJsonObject.categoryid = item.idCategory;
              categoryJsonObject.categoryname = item.strCategory;
              categoryJsonObject.categoryimage = item.strCategoryThumb;
              categoryJsonArray.push(categoryJsonObject);
          });
          categoryResult = categoryJsonArray;
          resolve(categoryJsonArray);
        }
    })
  });

  var filterPromise = new Promise(function(resolve, reject) {
    request.get({url:strFilterURL}, function(err, resp, body) {
        if (err) {
            reject(err);
        } else {
          var filterJsonObject = {};
          var filterJsonArray = [];
          var filterResponse = JSON.parse(body);
          filterResponse.meals.map(function(item) {
              filterJsonObject = {};
              filterJsonObject.filterid = item.idMeal;
              filterJsonObject.filtername = item.strMeal;
              filterJsonObject.filterimage = item.strMealThumb;
              filterJsonArray.push(filterJsonObject);
          });
          filterResult = filterJsonArray;
          resolve(filterJsonArray);
        }
    })
  });

  Promise.all([categoryPromise,filterPromise]).then(function(result) {
      var categoryApiObject = {};
      categoryApiObject.categorydetails = categoryResult;
      categoryApiObject.filterdetails = filterResult;

      returnRenderData = categoryApiObject;
      res.render('category',returnRenderData);
  });

});

module.exports = router;
