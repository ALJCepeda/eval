var express = require("express");
var app = express();
var zmq = require("zmq");
var http = require("http").Server(app);
var config = require("./config.js");
var Bare = require("./libs/bareutil");
var WORK_URL = "tcp://127.0.0.1:3000";

require("./resources/prototypes/object.js");
var RecordBook = require("./resources/recordbook.js");
var book = new RecordBook();

var StaticAPI = require("./resources/staticapi.js");
var staticy = new StaticAPI(book);
staticy.bootstrap(app);
staticy.routes.index(app, "get");

var RestAPI= require("./resources/restapi.js");
var rest = new RestAPI(WORK_URL, book);
rest.bootstrap(app);
rest.routes.info(app, "get");
rest.routes.compile(app, "post");
rest.routes.scriptID(app, "get");

app.use("/require.js", express.static("./node_modules/requirejs/require.js"));
app.use("/knockout.js", express.static("./node_modules/knockout/build/output/knockout-latest.js"));
app.use("/underscore.js", express.static("./node_modules/underscore/underscore-min.js"));
app.use("/backbone.js", express.static("./node_modules/backbone/backbone-min.js"));
app.use("/ace-builds", express.static("./node_modules/ace-builds"));

http.listen(config.port, function() { console.log("listening on *: " + config.port); });
