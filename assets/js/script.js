var qsp = QueryStringHelper.parse(window.location.search);

var cd = new Countdown(qsp.title, Countdown.ParseDate(qsp.when));
var ui = new CountdownUI(cd, {title: "#title", container: "#container", when: "#whenContainer", pastClass: "past", futureClass: "future"});
var editUI = new CountdownEditUI(qsp, {title: "#titleEdit", when: "#whenEdit" });

ui.start();

var qsp = QueryStringHelper.parse(window.location.search);

var ui = new CountdownEditUI(qsp, { title: "#title", when: "#when", invalid: "#whenInfo" });