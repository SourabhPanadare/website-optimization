const express = require('express');
const request = require('request');

const router = express.Router();
var randomResult, categoryResult, latestResult;

router.get('/', function(req, res, next) {
  const strRandomURL = "https://www.themealdb.com/api/json/v1/1/random.php";
  const strCategoryURL = "https://www.themealdb.com/api/json/v1/1/categories.php";
  const strLatestURL = "https://www.themealdb.com/api/json/v1/1/search.php?f="+generate_random_string(1);

  var randomPromise = new Promise(function(resolve, reject) {
    request.get({url:strRandomURL}, function(err, resp, body) {
        if (err) {
            reject(err);
        } else {
          var randomJsonObject = {};
          var randomResponse = JSON.parse(body);
           randomResponse.meals.map(function(item) {
               randomJsonObject = {};
               randomJsonObject.mealid = item.idMeal;
               randomJsonObject.mealname = item.strMeal;
               randomJsonObject.mealimage = item.strMealThumb;
           });
           randomResult = randomJsonObject;
           resolve(randomJsonObject);
        }
    })
  });

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

  var latestPromise = new Promise(function(resolve, reject) {
    request.get({url:strLatestURL}, function(err, resp, body) {
        if (err) {
            reject(err);
        } else {
          var latestJsonObject = {};
          var latestJsonArray = [];
          var latestResponse = JSON.parse(body);
          if(latestResponse.meals){
			  latestResponse.meals.slice(0,10).map(function(item) {
				  latestJsonObject = {};
				  latestJsonObject.latestid = item.idMeal;
				  latestJsonObject.latestname = item.strMeal;
				  latestJsonObject.latestcategory = item.strCategory;
				  latestJsonObject.latestimage = item.strMealThumb;
				  latestJsonArray.push(latestJsonObject);
			  });
	      }
          latestResult = latestJsonArray;
          resolve(latestJsonArray);
        }
    })
  });

  Promise.all([randomPromise,categoryPromise,latestPromise]).then(function(result) {
      var homeApiObject = {};
      homeApiObject.randomdetails = randomResult;
      homeApiObject.categorydetails = categoryResult;
      homeApiObject.latestdetails = latestResult;

      returnRenderData = homeApiObject;
      res.render('index',returnRenderData);
  });

});

function generate_random_string(string_length){
    let random_string = '';
    let random_ascii;
    let ascii_low = 65;
    let ascii_high = 90
    for(let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}

module.exports = router;
