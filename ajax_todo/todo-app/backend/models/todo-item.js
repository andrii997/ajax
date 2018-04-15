/**
 * Created by akv on 8/14/16.
 */
function TodoItem(options) {
	this.id = (options.id || "").toLowerCase();
	this.title = options.title;
	this.value = options.value;
	this.done = !!options.done;
	this.createdOn = options.createdOn;
	this.finishedOn = options.finishedOn;
}
TodoItem.prototype = {
	finish: function() {
		if (!this.done) {
			this.done = true;
			this.finishedOn = new Date();
		}
	},
	revertFinish: function() {
		this.done = false;
		this.finishedOn = null;
	}
};

module.exports = TodoItem;
