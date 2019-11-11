const express = require('express');
const exphbs = require( 'express-handlebars');
const path = require('path');

const indexRouter = require('./routes/index');
const categoryRouter = require('./routes/category');
const receipeRouter = require('./routes/receipe');

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

app.get('/', indexRouter);
app.get('/categories/:id',categoryRouter);
app.get('/receipe/:id',receipeRouter);

app.listen(6200, function(){
  console.log('Server up: http://localhost:6200');
});
