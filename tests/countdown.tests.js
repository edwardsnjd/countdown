// Ensure Tests namespace
if (typeof(Tests) == "undefined") {
	var Tests = {
		assert: function(condition, failureMessage) {
			if (!condition) { Tests.fail(failureMessage); }
		},
		
		fail: function(failureMessage) {
			throw(failureMessage);
		},
		
		log: function(group, member, pass, message) {
			alert((pass?"PASS: ":"FAIL: ") + group + " - " + member + ": " + message);
		},
		
		run: function(groups) {
			groups = groups || Tests;
			for (var group in groups) {
				Tests.runGroup(group);
			}
		},
		
		runGroup: function(group) {
			var tests = Tests[group];
			if (!tests) {
				Tests.log(group, "n/a", false, "Failed to find test group");
				return;
			}
			for (var member in tests) {
				var test = tests[member];
				if (typeof(test) == "function") {
					try {
						test();
						Tests.log(group, member, true, "");
					} catch(err) {
						Tests.log(group, member, false, err);
					}
				}
			}
		}
	};
}

Tests.CountdownParseDate = {
	NoArgs: function() {
		var cd = Countdown.ParseDate();
		Tests.assert(cd != null, "Date was null");
	},
	Empty: function() {
		var cd = Countdown.ParseDate("");
		Tests.assert(cd != null, "Date was null");
	},
	Date: function() {
		var cd = Countdown.ParseDate("31-12-2008");
		Tests.assert(+cd == +new Date(2008,11,31,0,0,0), "Date should have been 31-12-2008, " + cd);
	},
	Time: function() {
		var cd = Countdown.ParseDate("11:34");
		var d = new Date();
		d.setHours(11);
		d.setMinutes(34,0,0);
		Tests.assert(+cd == +d, "Date should have been today at 11:34, " + cd);
	},
	DateTime: function() {
		var cd = Countdown.ParseDate("11:34 15-01-2008");
		Tests.assert(+cd == +new Date(2008,0,15,11,34), "Date should have been 11:34 15-01-2008, " + cd);
	},
	Today: function() {
		var cd = Countdown.ParseDate("today");
		var d = new Date();
		d.setHours(0);
		d.setMinutes(0,0,0);
		Tests.assert(+cd == +d, "Date should have been today, " + cd);
	},
	Invalid: function() {
		var cd = Countdown.ParseDate("nowfds ds fds");
		Tests.assert(cd == null, "Date should be null");
	}
};

Tests.QueryStringHelper = {
	parseEmpty: function() {
		var params = QueryStringHelper.parse("");
		Tests.assert(typeof params.t == "undefined", "A parameter was found from an empty input.");
	},
	parseEmptyWithQ: function() {
		var params = QueryStringHelper.parse("?");
		Tests.assert(typeof params.t == "undefined", "A parameter was found from an empty input.");
	},
	parseSingleNoValue: function() {
		var params = QueryStringHelper.parse("?t");
		Tests.assert(typeof params.t != "undefined", "The t parameter was not found from \"?t\".");
	},
	parseSingleWithValue: function() {
		var params = QueryStringHelper.parse("?t=123");
		Tests.assert(typeof params.t != "undefined", "The t parameter was not found from \"?t=123\".");
		Tests.assert(params.t === "123", "The t parameter value was not found in \"?t=123\".");
	},
	parseSingleWithEqualsInValue: function() {
		var params = QueryStringHelper.parse("?t=123=12345=4=fdf=fjdkj");
		Tests.assert(typeof params.t != "undefined", "The t parameter was not found from \"?t=123=12345=4=fdf=fjdkj\".");
		Tests.assert(params.t === "123=12345=4=fdf=fjdkj", "The t parameter value was not found in \"?t=123=12345=4=fdf=fjdkj\".");
	},
	parseMutipleValues: function() {
		var params = QueryStringHelper.parse("?t=123&foo=bar");
		Tests.assert(typeof params.t != "undefined", "The t parameter was not found from \"?t=123&foo=bar\".");
		Tests.assert(typeof params.foo != "undefined", "The foo parameter was not found from \"?t=123&foo=bar\".");
		Tests.assert(params.t === "123", "The t parameter value was not found in \"?t=123&foo=bar\".");
		Tests.assert(params.foo === "bar", "The foo parameter value was not found in \"?t=123&foo=bar\".");
	},
	parseMutipleNastyValues: function() {
		var params = QueryStringHelper.parse("?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r");
		Tests.assert(typeof params.t != "undefined", "The t parameter was not found from \"?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r\".");
		Tests.assert(typeof params.fo != "undefined", "The fo parameter was not found from \"?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r\".");
		Tests.assert(typeof params.o != "undefined", "The fo parameter was not found from \"?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r\".");
		Tests.assert(params.t === "123= 4343j fjkjkfdlj=f", "The t parameter value was not found in \"?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r\".");
		Tests.assert(params.fo === "", "The fo parameter value was not found in \"?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r\".");
		Tests.assert(params.o === "ba    FFff==d==r", "The fo parameter value was not found in \"?t=123=+4343j%20fjkjkfdlj=f&fo&o=ba++++FFff==d==r\".");
	}
};

Tests.Countdown = {
	ctorPassedNulls: function() {
		var cd = new Countdown(null, null);
		Tests.assert(cd.title == "", "Default empty title wasn't supplied");
		Tests.assert(cd.when != null, "Default when wasn't supplied");
		Tests.assert(cd.when instanceof Date, "Default when wasn't a date");
	},
	ctor: function() {
		var title = "jkdfjk";
		var when = new Date();
		var cd = new Countdown(title, when);
		Tests.assert(cd.title === title, "Supplied title wasn't returned");
		Tests.assert(cd.when === when, "Supplied when wasn't returned");
	},
	ctorPassedNullTitle: function() {
		var when = new Date();
		var cd = new Countdown(null, when);
		Tests.assert(cd.title == "", "Default empty title wasn't supplied");
		Tests.assert(cd.when === when, "Supplied when wasn't returned");
	},
	getSinceTimeSpan: function() {
		var when = new Date();
		var cd = new Countdown("title", when);
		Tests.assert(typeof(cd.getSinceTimeSpan) === "function", "getSinceTimeSpan should be an available function");
		var ts1 = cd.getSinceTimeSpan();
		while ((new Date()).getTime() - when.getTime() == 0) { }
		var ts2 = cd.getSinceTimeSpan();
		Tests.assert(ts1 instanceof Timespan, "getSinceTimeSpan should return a timespan");
		Tests.assert(ts2 instanceof Timespan, "getSinceTimeSpan should return a timespan");
		Tests.assert(ts1.ms < ts2.ms, "getSinceTimeSpan should return increasing timespans");
	}
};