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

Tests.Countdown = {
	ctor: function() {
		var title = "jkdfjk";
		var when = new Date();
		var cd = new Countdown(title, when);
		Tests.assert(cd.title == title, "Supplied title wasn't returned");
		Tests.assert(cd.when == when, "Supplied when wasn't returned");
	},
	ctorPassedNulls: function() {
		var cd = new Countdown(null, null);
		Tests.assert(cd.title == "Countdown", "Default title wasn't supplied");
		Tests.assert(cd.when != null, "Default when wasn't supplied");
		Tests.assert(typeof(cd.when.getTime) == "function", "Default when wasn't a date");
	}
};

Tests.QueryStringHelper = {
};

Tests.Timespan = {
};