/**
 * Created by akv on 8/14/16.
 */
var TodoItem = require("../models/todo-item"),
	uuid = require("uuid");

function getValuesFromObject(obj) {
	var resp = [];
	for (var key in obj) {
		resp.push(obj[key]);
	}

	return resp;
}

function InMemoryTodoRepository() {
	this.__items = Object.create(null);
}

function ensureIsTodoItemInstance(item) {
	if (item instanceof TodoItem) {
		return item;
	}

	return new TodoItem(item);
}

InMemoryTodoRepository.prototype = {
	set: function(item) {
		this.__items[item.id] = item;
	},
	getList: function() {
		return getValuesFromObject(this.__items);
	},
	find: function(id) {
		return this.__items[id];
	},
	add: function(item) {
		item = ensureIsTodoItemInstance(item);
		item.id = uuid.v4();
		this.set(item);

		return item;
	},
	update: function(item) {
		item = ensureIsTodoItemInstance(item);
		if (!this.exists(item)) {
			throw new Error("Cannot update not existent item");
		}
		var old = this.find(item.id);
		this.remove(old);
		this.set(item);

		return item;
	},
	remove: function(item) {
		item = ensureIsTodoItemInstance(item);
		if (!this.exists(item)) {
			throw new Error("Cannot remove not existent item");
		}

		delete this.__items[item.id];
		return item;
	},
	exists: function(item) {
		item = ensureIsTodoItemInstance(item);

		return item.id in this.__items;
	}
};

module.exports = InMemoryTodoRepository;