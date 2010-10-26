// Create a new countdown timer object for the given target date
var Countdown = function(target) {
  var targetMS = target.getTime();
  
  var pluralise = function(num) {
    return (num!=1)?"s":"";
  };

  this.getSinceMS = function() {
    return (new Date()).getTime() - targetMS;
  };

  this.getSinceText = function() {
    var ms = this.getSinceMS();

    // Build text for the elapsed time
    var out = "";
    var ts = new Timespan(ms);
    if(ts.days != 0) { out += ts.days + " day" + pluralise(ts.days) + ", "; }
    if(ts.days != 0 || ts.hours != 0) { out += ts.hours + " hour" + pluralise(ts.hours) + ", "; }
    if(ts.days != 0 || ts.hours != 0 || ts.mins != 0) { out += ts.mins + " minute" + pluralise(ts.mins) + ", "; }
    out += ts.secs + " second" + pluralise(ts.secs);
    
    return out;
  };
};

var QueryStringHelper = {
	// Parse the query string to a hash
	parse: function(qs) {
		var s = qs.substring(1);
		
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
	var working = Math.floor(ms/1000);
	this.days = Math.floor(working/86400);
	working = working%86400;
	this.hours = Math.floor(working/3600);
	working = working%3600;
	this.mins = Math.floor(working/60);
	working = working%60;
	this.secs = Math.floor(working);
};

// A UI to dynamically display a countdown
var CountdownUI = function(title, countdown, uiOptions) {
  // Supply default selectors
  var uiSelectors = uiOptions || {};
  uiSelectors.title = uiSelectors.title || "#title";
  uiSelectors.container = uiSelectors.container || "#container";

  // Set title text
  $(uiSelectors.title).html(title);
 
  var timeout;

  // Update the ui
  var updateUI = function() {
    $(uiSelectors.container).html(countdown.getSinceText());
  };

  this.stop = function() {
    clearInterval(timeout);
  };

  this.start = function() {
    timeout = setInterval(updateUI, 100);
  };
};