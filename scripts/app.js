import drawCalendar from "./calendar.js";
import drawGantt from "./gantt.js";
import drawBar from "./bar.js";

// Draw pulls calendar
d3.csv("../../data/dates-wipe.csv", function(response) {
  console.log("response: ", response);
  drawCalendar(response, "wipe");
});

// Draw progression Gantt chart
drawGantt();

d3.csv("../../data/data.csv", drawBar);

const prog = [
  [58, 506, 22], //WAR
  [58, 506, 22], //GNB
  [58, 506, 22], //WHM
  [58, 506, 22], //SCH
  [58, 506, 22], //DRG
  [44.2, 284, 17], //SAM
  [49.5, 352, 19], //MCH
  [33.3, 192, 13] //RDM
];

const members = document.querySelectorAll("#members-list > li");
const hours = document.querySelector("#member-number-hours");
const pulls = document.querySelector("#member-number-pulls");
const days = document.querySelector("#member-number-days");
members.forEach(m => {
  m.addEventListener("mouseenter", function(evt) {
    let idx = parseInt(evt.target.dataset.index, 10) - 1;
    hours.innerHTML = prog[idx][0];
    pulls.innerHTML = prog[idx][1];
    days.innerHTML = prog[idx][2];
  });
  m.addEventListener("mouseleave", function(evt) {
    let idx = parseInt(evt.target.dataset.index, 10);
    hours.innerHTML = prog[0][0];
    pulls.innerHTML = prog[0][1];
    days.innerHTML = prog[0][2];
  });
});
