// Create a new countdown timer object for the given target date
var Countdown = function(title, date) {
	// Supply defaults
	when = date || new Date();
	title = title || "";
	
	var targetMS = when.getTime();

	// PUBLIC MEMBERS

	// Make title available
	this.title = title;

    // Make when available
    this.when = when;
    
    // Make dynamic count down available
	this.getSinceTimeSpan = function() {
		var ms = (new Date()).getTime() - targetMS;
		var ts = new Timespan(ms);
		return ts;
	};
};

Countdown.ParseDate = function(text) {
	text = text || "";
	var date = null;
	for (var i=0; i<Countdown.ParseDate.formats.length; i++) {
		var format = Countdown.ParseDate.formats[i];
		var match = format.re.exec(text);
		if (match != null) {
			date = format.out(match);
			break;
		}
	}
	return date;
};
// Known parse formats
Countdown.ParseDate.formats = [
    {// now
		re: /^$/,
		out: function(match) {
			return new Date();
		}
	},
    {// today
		re: /^today$/,
		out: function(match) {
			var d = new Date();
			d.setHours(0);
			d.setMinutes(0,0,0);
			return d;
		}
	},
    {// time
		re: /^([0-9]{2})\:([0-9]{2})$/,
		out: function(match) {
			var d = new Date();
			d.setHours(match[1]);
			d.setMinutes(match[2], 0, 0);
			return d;
		}
	},
	{// date
		re: /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/,
		out: function(match) {
			return new Date(match[3], match[2] - 1, match[1], 0, 0, 0);
		}
	},
	{// dateTime
		re: /^([0-9]{2})\:([0-9]{2}) ([0-9]{2})-([0-9]{2})-([0-9]{4})$/,
		out: function(match) {
			return new Date(match[5], match[4] - 1, match[3], match[1], match[2], 0);
		}
	}
];

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
	this.ms = ms;
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
	
	var pluralise = function(num) {
		return (num!=1)?"s":"";
	};
	
	var leftPad = function(str, padding, length) {
		str += "";
		padding += "";
		if (str.length < length) {
			return padding.substring(padding.length - (length - str.length)) + str;
		} else {
			return str;
		}
	};
	var zeroPadL = function(str) {
		return leftPad(str, "00", 2);
	};

	// Find friendly display text for a date
	var getDateRelativeText = function(date) {
		var t = zeroPadL(date.getHours()) + ":" + zeroPadL(date.getMinutes());
		var d = date.toLocaleDateString();
		
		// If midnight: date
		if (date.getHours() == 0 && date.getMinutes() == 0) {
			return d;
		}
		
		// If sometime today: time
		var today = Countdown.ParseDate("today");
		var todayTS = new Timespan(date.getTime() - today.getTime());
		if (!todayTS.isNegative && todayTS.days == 0) {
			return t;
		}
		
		// Other wise: time date
		return t + ", " + d;
	};
	
	// Find display text for a date
	var getDateText = function(date) {
		return date.toLocaleString();
	};

    // Find the display text for a time span
	var getSinceText = function(ts) {
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

	// Update the ui
	var updateUI = function() {
		var ts = countdown.getSinceTimeSpan();
		if (ts.isNegative) {
			$("body").addClass(config.futureClass);
			$("body").removeClass(config.pastClass);
		} else {
			$("body").addClass(config.pastClass);
			$("body").removeClass(config.futureClass);
		}
		$(config.container).html(getSinceText(ts));
	};

	// Set title text
	$(config.title).html(countdown.title || getDateRelativeText(countdown.when));

	// Set when text
	$(config.when).html(getDateText(countdown.when));
	
	// PUBLIC MEMBERS

	this.stop = function() {
		clearInterval(timeout);
	};

	this.start = function() {
		timeout = setInterval(updateUI, 100);
	};
};

// A UI to allow editing of a countdown's params
var CountdownEditUI = function(qsp, uiOptions) {
	// Supply default selectors
	var config = uiOptions || {};
	
	// Validate
	var validate = function() {
		var when = $(config.when).val();
		var d = Countdown.ParseDate(when);
		if (config.invalid) {
			$(config.invalid)[d ? "hide" : "show"]();
		}
	};
	
	// Set title text
	$(config.title).val(qsp.title);

	// Set when text
	$(config.when).val(qsp.when);
	
	// Hook up validation of when
	$(config.when).change(validate);

	// Trigger initial validation
	validate();
};