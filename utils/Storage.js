/** 
 * Creates a new Storage. A storage uses local storage capabilities to save JSON data
 */
/*jslint browser: true */

var Storage = (function () {
	"use strict";
	
	/**
	 * Returns true if local storage is supported
	 */
	function supportsStorage() {
		return window.localStorage !== "undefined" && window.localStorage !== null;
	}
	
	/**
	 * Returns true if the string is an integer
	 * @param {string} string
	 * @return {boolean}
	 */
	function isInteger(string) {
		var validChars = "0123456789-", isNumber = true, i, char;
		
		for (i = 0; i < string.length && isNumber === true; i += 1) {
			char = string.charAt(i);
			if (validChars.indexOf(char) === -1) {
				isNumber = false;
			}
		}
		return isNumber;
	}
	
	
	/**
	 * @constructor
	 * Creates a new storage
	 * @param {string} name  The name of the storage
	 * @param {function(): boolean} func  A function to determine if you can save data or not
	 */
	function Storage(name, func) {
		this.name     = name;
		this.canSave  = func || function () { return true; };
		this.supports = supportsStorage();
	}
	
	Storage.prototype = {
		/**
		 * Returns the data in the saved format
		 * @param {string} name
		 * @return {(boolean|number|string|Object)}
		 */
		get: function (name) {
			var content = null;
			if (this.supports && window.localStorage[this.getName(name)]) {
				content = window.localStorage[this.getName(name)];
				if (content === "true" || content === "false") {
					content = content === "true";
				} else if (isInteger(content)) {
					content = parseInt(content, 10);
				} else {
					content = JSON.parse(content);
				}
			}
			return content;
		},
		
		/**
		 * Saves the given data as a JSON object
		 * @param {string} name
		 * @param {(boolean|number|string|Object)} value
		 */
		set: function (name, value) {
			if (this.supports && this.canSave()) {
				window.localStorage[this.getName(name)] = JSON.stringify(value);
			}
		},
		
		/**
		 * Removes the data with the given name
		 * @param {string} name
		 */
		remove: function (name) {
			if (this.supports && this.canSave()) {
				window.localStorage.removeItem(this.getName(name));
			}
		},
		
		
		/**
		 * Returns the key for the given name
		 * @param {string} name
		 * @return {string}
		 */
		getName: function (name) {
			return this.name + "." + name;
		},
		
		/**
		 * Returns true if local storage is supported
		 */
		isSupported: function () {
			return this.supports;
		}
	};
	
	return Storage;
}());