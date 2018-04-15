/**
 * Created by akv on 8/14/16.
 */
var TodoRepository = require("../repositories/todo-repository");

var todoRepository = new TodoRepository();
function init(todoItems) {
	for (var i = 0; i < todoItems.length; i++) {
		var cur = todoItems[i];
		todoRepository.add(cur);
	}

	return {
		get: get,
		post: post,
		put: put,
		del: del
	};
}

function get(req, res) {
	var id = req.query.id;
	if (id) {
		var item = todoRepository.find(id);
		if (item) {
			res.send(item);
		} else {
			res.status(404)
				.send({
					message: "'Todo item' with id " + id + " not found"
				});
		}
	} else {
		res.send(todoRepository.getList());
	}
}
function post(req, res) {
	var newItem = req.body;
	if (!newItem) {
		return res.status(400)
			.send({
				message: "Empty request body received."
			});
	}
	var item = todoRepository.add(newItem);
	res.send(item);
}
function put(req, res) {
	var data = req.body;
	if (!data) {
		return res.status(400)
			.send({
				message: "Empty request body received."
			});
	}
	if (isFinishingRequested(data)) {
		var item = todoRepository.find(data.id);
		if (!item) {
			return res.status(404)
				.send("Item with id='" + data.id + "' not found.");
		}

		switch(data.action) {
			case "done":
				item.finish();
				break;
			case "reset":
				item.revertFinish();
				break;
			default:
				return res.status(400)
					.send({
						message: "Unsupported 'action' parameter provided: " + data.action
					});
		}

		data = item;
	}

	data = todoRepository.update(data);

	res.send(data);
}
function del(req, res) {

	var id = req.query.id,
		item;
	if (id && (item = todoRepository.find(id))) {
		item = todoRepository.remove(item);
		res.send(item);
	} else {
		res.status(404)
			.send({
				message: "'Todo item' with id " + id + " not found."
			});
	}
}


function isFinishingRequested(data) {
	return "action" in data && "id" in data;
}

module.exports = init;