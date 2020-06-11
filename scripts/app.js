import drawCalendar from "./calendar.js";
import drawGantt from "./gantt.js";
import drawBar from "./bar.js";

// UWU Draw pulls calendar
d3.csv("../../data/dates-wipe.csv", function (response) {
  drawCalendar(response, "wipe");
});

// TEA Draw pulls calendar
d3.csv("../../data/tea-dates-wipe.csv", function (response) {
  drawCalendar(response, "tea");
});

// UCOB Draw pulls calendar
d3.csv("../../data/ucob-dates-wipe.csv", function (response) {
  drawCalendar(response, "ucob");
});
d3.csv("../../data/ucob-dates-wipe-sch.csv", function (response) {
  drawCalendar(response, "ucob-sch");
});
d3.csv("../../data/ucob-dates-wipe-nin.csv", function (response) {
  drawCalendar(response, "ucob-nin");
});
d3.csv("../../data/ucob-dates-wipe-smn.csv", function (response) {
  drawCalendar(response, "ucob-smn");
});

const isTEA = document.querySelector("#TEA");
const isUCOB = document.querySelector("#UCOB");
if (isTEA) {
  drawBar("tea");
} else if (isUCOB) {
  drawBar("ucob");
} else {
  drawBar();
}

// Draw progression Gantt chart
if (!isTEA || !isUCOB) {
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
  [33.3, 192, 13], //RDM
];

const teaProg = [
  [71.7, 874, 25],
  [85.45, 1112, 31],
  [71.7, 874, 25],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
  [85.45, 1112, 31],
];

const ucobProg = [
  [75.5, 672, 29], //WAR
  [75.5, 672, 29], //GNB
  [75.5, 672, 29], //WHM
  [53, 381, 18], //SCH
  [75.5, 672, 29], //SAM
  [75.5, 672, 29], //MCH
  [44, 299, 15], //NIN
  [33, 202, 11], //SMN
];

const toggleCalendars = (idx) => {
  const calendarCommon = document.querySelector("#calendar-ucob");
  const calendarSCH = document.querySelector("#calendar-ucob-sch");
  const calendarNIN = document.querySelector("#calendar-ucob-nin");
  const calendarSMN = document.querySelector("#calendar-ucob-smn");
  switch (idx) {
    case 3:
      calendarCommon.classList.add("hidden");
      calendarSCH.classList.remove("hidden");
      calendarNIN.classList.add("hidden");
      calendarSMN.classList.add("hidden");
      break;
    case 6:
      calendarCommon.classList.add("hidden");
      calendarSCH.classList.add("hidden");
      calendarNIN.classList.remove("hidden");
      calendarSMN.classList.add("hidden");
      break;
    case 7:
      calendarCommon.classList.add("hidden");
      calendarSCH.classList.add("hidden");
      calendarNIN.classList.add("hidden");
      calendarSMN.classList.remove("hidden");
      break;
    default:
      calendarCommon.classList.remove("hidden");
      calendarSCH.classList.add("hidden");
      calendarNIN.classList.add("hidden");
      calendarSMN.classList.add("hidden");
  }
};

if (isTEA) {
  // TEA
  const teaMembers = document.querySelectorAll("#tea-members-list > li");
  const teaHours = document.querySelector("#tea-member-number-hours");
  const teaPulls = document.querySelector("#tea-member-number-pulls");
  const teaDays = document.querySelector("#tea-member-number-days");
  teaMembers.forEach((m) => {
    m.addEventListener("mouseenter", function (evt) {
      let idx = parseInt(evt.target.dataset.index, 10) - 1;
      teaHours.innerHTML = teaProg[idx][0];
      teaPulls.innerHTML = teaProg[idx][1];
      teaDays.innerHTML = teaProg[idx][2];
    });
    m.addEventListener("mouseleave", function (evt) {
      let idx = parseInt(evt.target.dataset.index, 10);
      teaHours.innerHTML = teaProg[1][0];
      teaPulls.innerHTML = teaProg[1][1];
      teaDays.innerHTML = teaProg[1][2];
    });
  });
} else if (isUCOB) {
  // UCOB
  const ucobMembers = document.querySelectorAll("#ucob-members-list > li");
  const ucobHours = document.querySelector("#ucob-member-number-hours");
  const ucobPulls = document.querySelector("#ucob-member-number-pulls");
  const ucobDays = document.querySelector("#ucob-member-number-days");
  ucobMembers.forEach((m) => {
    m.addEventListener("mouseenter", function (evt) {
      let idx = parseInt(evt.target.dataset.index, 10) - 1;
      ucobHours.innerHTML = ucobProg[idx][0];
      ucobPulls.innerHTML = ucobProg[idx][1];
      ucobDays.innerHTML = ucobProg[idx][2];
      toggleCalendars(idx);
    });
    // m.addEventListener("mouseleave", function (evt) {
    //   let idx = parseInt(evt.target.dataset.index, 10);
    //   ucobHours.innerHTML = ucobProg[1][0];
    //   ucobPulls.innerHTML = ucobProg[1][1];
    //   ucobDays.innerHTML = ucobProg[1][2];
    //   toggleCalendars(0);
    // });
  });
} else {
  // UWU
  const members = document.querySelectorAll("#members-list > li");
  const hours = document.querySelector("#member-number-hours");
  const pulls = document.querySelector("#member-number-pulls");
  const days = document.querySelector("#member-number-days");
  members.forEach((m) => {
    m.addEventListener("mouseenter", function (evt) {
      let idx = parseInt(evt.target.dataset.index, 10) - 1;
      hours.innerHTML = prog[idx][0];
      pulls.innerHTML = prog[idx][1];
      days.innerHTML = prog[idx][2];
    });
    m.addEventListener("mouseleave", function (evt) {
      let idx = parseInt(evt.target.dataset.index, 10);
      hours.innerHTML = prog[0][0];
      pulls.innerHTML = prog[0][1];
      days.innerHTML = prog[0][2];
    });
  });
}
