# website-optimization

  https://github.com/gerardo-rodriguez/handlebars-experimentation
  https://github.com/barc/express-hbs
  https://www.themealdb.com/api.php
  https://github.com/verlok/lazyload
  https://github.com/aFarkas/lazysizes

# Installation

  npm init
  npm install express --save
  npm install express-handlebars --save
  npm install --save requests

# Project Structure

  public/
    css,js,fonts,images,pages,plugin
  routes/
  views/
  app.js
  gulpfile.js

# Project Files

  app.js

    var app = express();
    app.engine("hbs", exphbs({
      defaultLayout: "default",
      extname: ".hbs",
      helpers: require("./public/js/helpers.js").helpers, // same file that gets used on our client
      partialsDir: "views/partials/", // same as default, I just like to be explicit
      layoutsDir: "views/layouts/" // same as default, I just like to be explicit
    }));
    app.set('view engine', 'hbs');
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/categories/:id',categoryRouter);

  routes/index.js

    const router = express.Router();
    router.get('/', function(req, res, next) {
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
    )}

    Promise.all([randomPromise,categoryPromise,latestPromise]).then(function(result) {
        var homeApiObject = {};
        homeApiObject.randomdetails = randomResult;
        homeApiObject.categorydetails = categoryResult;
        homeApiObject.latestdetails = latestResult;

        returnRenderData = homeApiObject;
        res.render('index',returnRenderData);
    });
