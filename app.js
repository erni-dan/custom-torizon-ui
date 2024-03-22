const express = require('express');
const routes = require("./routes/routes");

const app = express();
app.use('/public', express.static(__dirname + '/public'));

const nunjucks = require('nunjucks')
// Set up the template engine and define the html templates directory
const env = nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

// add global date compare possibility during template rendering, returns `now` if no argument is passed.
env.addGlobal('toDate', function (date) {
    return date ? new Date(date) : new Date();
});

app.use("/", routes);


module.exports = app;