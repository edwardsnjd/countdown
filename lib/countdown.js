// Create a new countdown timer object for the given target date
var Countdown = function(title, when) {
	// Supply defaults
	title = title || "Countdown";
	when = when || new Date();
	var targetMS = when.getTime();

	var pluralise = function(num) {
		return (num!=1)?"s":"";
	};

	// PUBLIC MEMBERS

	// Make title available
	this.title = title;

    // Make when available
    this.when = when;
    
    // Make dynamic count available
	this.getSinceTimeSpan = function() {
		var ms = (new Date()).getTime() - targetMS;
		var ts = new Timespan(ms);
		return ts;
	};
    
    // Make dynamic text available
	this.getSinceText = function() {
		var ts = this.getSinceTimeSpan();

		// Build text for the elapsed time
		var sections = [];
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
Countdown.getFriendlyDate = function(date) {
	return date.toLocaleString();
};

var QueryStringHelper = {
	// Parse the query string to a hash
	parse: function(search) {
		var s = search.substring(1);
		
		var params = {};

		var spaceRE = /\+/g;
		var paramRE = /([^&=]+)=?([^&]*)/g;
		var cleanSpace = function (s) { return decodeURIComponent(s.replace(spaceRE, " ")); };
	 
		var match;
		// NB. Exec increments last match index for re for repeat invocation
		while (match = paramRE.exec(s)) {
		   params[cleanSpace(match[1])] = cleanSpace(match[2]); 
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
var CountdownUI = function(countdown, uiOptions) {
	// Supply default selectors
	var config = uiOptions || {};
	
	var timeout;
	
	// Set title text
	$(config.title).html(countdown.title);

	// Set when text
	$(config.when).html(Countdown.getFriendlyDate(countdown.when));

	// Update the ui
	var updateUI = function() {
		if (countdown.getSinceTimeSpan().isNegative) {
			$("body").addClass(config.futureClass);
			$("body").removeClass(config.pastClass);
		} else {
			$("body").addClass(config.pastClass);
			$("body").removeClass(config.futureClass);
		}
		$(config.container).html(countdown.getSinceText());
	};
	
	// PUBLIC MEMBERS

	this.stop = function() {
		clearInterval(timeout);
	};

	this.start = function() {
		timeout = setInterval(updateUI, 100);
	};
};

// A UI to allow editing of a countdown
var CountdownEditUI = function(countdown, uiOptions) {
	// Supply default selectors
	var config = uiOptions || {};
	
	// Set title text
	$(config.title).val(countdown.title);

	// Set when text
	$(config.when).val(countdown.when.toString());
};
