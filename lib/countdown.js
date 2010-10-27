// Create a new countdown timer object for the given target date
var Countdown = function(title, when) {
	// Supply defaults
	title = title || "Countdown";
	when = when || new Date();
	var targetMS = when.getTime();

	var getSinceMS = function() {
		return (new Date()).getTime() - targetMS;
	};
	
	var pluralise = function(num) {
		return (num!=1)?"s":"";
	};

	// PUBLIC MEMBERS

	// Make title available
	this.title = title;

    // Make when available
    this.when = when;
    
    // Make dynamic text available
	this.getSinceText = function() {
		var ms = getSinceMS();

		// Build text for the elapsed time
		var sections = [];
		var ts = new Timespan(ms);
		if (ts.days != 0) { sections.push(ts.days + " day" + pluralise(ts.days)); }
		if (ts.hours != 0) { sections.push(ts.hours + " hour" + pluralise(ts.hours)); }
		if (ts.mins != 0) { sections.push(ts.mins + " minute" + pluralise(ts.mins)); }
		sections.push(ts.secs + " second" + pluralise(ts.secs));
		var text = sections.join(", ");

		// Add negative marker
		if (ts.isNegative) { text = "- " + text; }

		return text;
	};
};

var QueryStringHelper = {
	// Parse the query string to a hash
	parse: function(search) {
		var s = search.substring(1);
		
		var params = {};
		for (var part in s.split("&")) {
			var temp = part.split("=");
			var key = temp[0];
			var value = temp[1];
			params[key] = value;
		}
		
		return params;
	}
};

// Utility class breaking a timespan into units
var Timespan = function(ms) {
	this.isNegative = (ms < 0);
	
	// Always do the math with positive
	if (this.isNegative) { ms *= -1; }
	
	// Break into units
	var secondsLeft = Math.floor(ms / 1000);
	this.days = Math.floor(secondsLeft / 86400);
	secondsLeft = secondsLeft % 86400;
	this.hours = Math.floor(secondsLeft / 3600);
	secondsLeft = secondsLeft % 3600;
	this.mins = Math.floor(secondsLeft / 60);
	secondsLeft = secondsLeft % 60;
	this.secs = Math.floor(secondsLeft) + (this.isNegative ? 1 : 0);
};

// A UI to dynamically display a countdown
var CountdownUI = function(title, countdown, uiOptions) {
	// Supply default selectors
	var uiSelectors = uiOptions || {};
	uiSelectors.title = uiSelectors.title || "#title";
	uiSelectors.container = uiSelectors.container || "#container";

	var timeout;
	
	// Set title text
	$(uiSelectors.title).html(title);

	// Update the ui
	var updateUI = function() {
		$(uiSelectors.container).html(countdown.getSinceText());
	};
	
	// PUBLIC MEMBERS

	this.stop = function() {
		clearInterval(timeout);
	};

	this.start = function() {
		timeout = setInterval(updateUI, 100);
	};
};