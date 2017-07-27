var express = require('express'),
    https = require('https'),
    bodyParser = require('body-parser'),
    fs = require('fs');
var app = express();
var runkey = require("./hidden/runkey.js").runkey;

var credentials = { // SSL Credentials
    key: fs.readFileSync("../cert/privkey.pem"),
    cert: fs.readFileSync("../cert/cert.pem")
};

app.use(bodyParser.json());       // to support JSON-encoded POST bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded POST bodies
    extended: true
}));

var server = https.createServer(credentials, app);

server.listen(8081, function () {
    console.log('Listening');
});


app.get('/', function (req, res) {
    res.send("Home Page");
});

app.all('/runkey', function (req, res) {
    var json = {};
    // If key is valid
    if (typeof req.body.key === "undefined") {
        json.ok = false;
        json.error = "No key";
    } else {
        if (req.body.key === runkey) {
            json.ok = true;
        } else {
            json.ok = false;
            json.error = "Invalid key";
        }
    }
    res.json(json);
});