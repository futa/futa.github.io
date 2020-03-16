import drawCalendar from "./calendar.js";
import drawGantt from "./gantt.js";
import drawBar from "./bar.js";

// UWU Draw pulls calendar
d3.csv("../../data/dates-wipe.csv", function(response) {
  drawCalendar(response, "wipe");
});

// TEA Draw pulls calendar
d3.csv("../../data/tea-dates-wipe.csv", function(response) {
  drawCalendar(response, "tea");
});

const isTEA = document.querySelector("#TEA");
if (isTEA) {
  drawBar("tea");
} else {
  drawBar();
}

// Draw progression Gantt chart
if (!isTEA) {
  drawGantt();
}

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

const teaProg = [
  [71.7, 874, 25],
  [85.45, 1112, 31],
  [71.7, 874, 25],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
  [85.45, 1112, 31]
];

if (isTEA) {
  // TEA
  const teaMembers = document.querySelectorAll("#tea-members-list > li");
  const teaHours = document.querySelector("#tea-member-number-hours");
  const teaPulls = document.querySelector("#tea-member-number-pulls");
  const teaDays = document.querySelector("#tea-member-number-days");
  teaMembers.forEach(m => {
    m.addEventListener("mouseenter", function(evt) {
      let idx = parseInt(evt.target.dataset.index, 10) - 1;
      teaHours.innerHTML = teaProg[idx][0];
      teaPulls.innerHTML = teaProg[idx][1];
      teaDays.innerHTML = teaProg[idx][2];
    });
    m.addEventListener("mouseleave", function(evt) {
      let idx = parseInt(evt.target.dataset.index, 10);
      teaHours.innerHTML = teaProg[1][0];
      teaPulls.innerHTML = teaProg[1][1];
      teaDays.innerHTML = teaProg[1][2];
    });
  });
} else {
  // UWU
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
}
