const express = require('express');
const routes = require("./routes/routes");

const app = express();
app.use('/public', express.static(__dirname + '/public'));

const nunjucks = require('nunjucks')
// Set up the template engine and define the html templates directory
nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

app.use("/", routes);


module.exports = app;