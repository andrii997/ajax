var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	nodeStatic = require("node-static"),
	file = new nodeStatic.Server("."),
	todoControllerFactory = require("./backend/controllers/todo-controller"),
	fs = require("fs"),
	LISTEN_PORT = 8081,
	TODOS_FILE_NAME = __dirname + "/resources/todos.json",
	TODOS_API_URL = "/api/todo";


app.use(bodyParser.json());

fs.readFile(TODOS_FILE_NAME, function(err, data) {

	var items = JSON.parse(data);
	var controller = todoControllerFactory(items);

	app.get(TODOS_API_URL, controller.get);
	app.post(TODOS_API_URL, controller.post);
	app.put(TODOS_API_URL, controller.put);
	app.delete(TODOS_API_URL, controller.del);
	app.get("*", function(req, res) {
		file.serve(req, res);
	});
	app.listen(LISTEN_PORT);
	console.log("Listening on port " + LISTEN_PORT);
});
