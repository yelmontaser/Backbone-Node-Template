// Functions to create session Id

	function s4() {
	  	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	};
	
	exports.createGUID = function() {
		return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	}