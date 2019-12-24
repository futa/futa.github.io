import drawCalendar from "./calendar.js";
import drawGantt from "./gantt.js";

d3.csv("dates-wipe.csv", function(response) {
  drawCalendar(response, "wipe");
});

let taskArray = [
  {
    task: "conceptualize",
    type: "Garuda",
    startTime: "2013-1-28", //year/month/day
    endTime: "2013-2-1",
    details: "This actually didn't take any conceptualization"
  },

  {
    task: "sketch",
    type: "Garuda",
    startTime: "2013-2-1",
    endTime: "2013-2-6",
    details: "No sketching either, really"
  },

  {
    task: "color profiles",
    type: "Garuda",
    startTime: "2013-2-6",
    endTime: "2013-2-9"
  },

  {
    task: "HTML",
    type: "Ifrit",
    startTime: "2013-2-2",
    endTime: "2013-2-6",
    details: "all three lines of it"
  },

  {
    task: "write the JS",
    type: "Ifrit",
    startTime: "2013-2-6",
    endTime: "2013-2-9"
  },

  {
    task: "advertise",
    type: "Ifrit",
    startTime: "2013-2-9",
    endTime: "2013-2-12",
    details: "This counts, right?"
  },

  {
    task: "spam links",
    type: "Titan",
    startTime: "2013-2-12",
    endTime: "2013-2-14"
  },
  {
    task: "eat",
    type: "Predation",
    startTime: "2013-2-8",
    endTime: "2013-2-13",
    details: "All the things"
  },

  {
    task: "crying",
    type: "Anniliation",
    startTime: "2013-2-13",
    endTime: "2013-2-16"
  }
];

//from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
function checkUnique(arr) {
  let hash = {},
    result = [];
  for (let i = 0, l = arr.length; i < l; ++i) {
    if (!hash.hasOwnProperty(arr[i])) {
      //it works with objects! in FF, at least
      hash[arr[i]] = true;
      result.push(arr[i]);
    }
  }
  return result;
}

let w = 800;
let h = 400;

let svg = d3
  .selectAll("#chart")
  //.selectAll("svg")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "svg");

let categories = new Array();

for (let i = 0; i < taskArray.length; i++) {
  categories.push(taskArray[i].type);
}

let catsUnfiltered = categories; //for vert labels

categories = checkUnique(categories);

drawGantt(taskArray, w, h, categories);
