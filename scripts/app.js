import drawCalendar from "./calendar.js";
import drawGantt from "./gantt.js";
import drawBar from "./bar.js";

// Draw pulls calendar
d3.csv("dates-wipe.csv", function(response) {
  drawCalendar(response, "wipe");
});

// Draw progression Gantt chart
drawGantt();

d3.csv("data.csv", drawBar);
