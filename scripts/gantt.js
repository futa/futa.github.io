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

let taskArray = [
  {
    task: "Garuda prog",
    type: "Garuda",
    startTime: "2019-11-07", //year/month/day
    endTime: "2019-11-08"
  },
  {
    task: "Ifrit spawn",
    type: "Ifrit",
    startTime: "2019-11-08",
    endTime: "2019-11-11"
  },
  {
    task: "Ifrit nails",
    type: "Ifrit",
    startTime: "2019-11-11",
    endTime: "2019-11-19"
  },
  {
    task: "Ifrit clean-up",
    type: "Ifrit",
    startTime: "2019-11-19",
    endTime: "2019-11-25"
  },
  {
    task: "Titan spawn",
    type: "Titan",
    startTime: "2019-11-19",
    endTime: "2019-11-21"
  },
  {
    task: "Titan gaols",
    type: "Titan",
    startTime: "2019-11-25",
    endTime: "2019-12-4"
  },
  {
    task: "Titan clean-up",
    type: "Titan",
    startTime: "2019-12-2",
    endTime: "2019-12-4"
  },
  {
    task: "Predation prog",
    type: "Predation",
    startTime: "2019-12-4",
    endTime: "2019-12-10"
  },
  {
    task: "Annihilation prog",
    type: "Annihilation",
    startTime: "2019-12-4",
    endTime: "2019-12-17"
  },
  {
    task: "Suppression prog",
    type: "Suppression",
    startTime: "2019-12-16",
    endTime: "2019-12-19"
  },
  {
    task: "Aetheric boom prog",
    type: "Suppression",
    startTime: "2019-12-19",
    endTime: "2019-12-23"
  }
];
let w = 800;
let h = 400;
let categories = new Array();

for (let i = 0; i < taskArray.length; i++) {
  categories.push(taskArray[i].type);
}

let catsUnfiltered = categories; //for vert labels

categories = checkUnique(categories);

let svg = d3
  .selectAll("#chart")
  //.selectAll("svg")
  .append("svg")
  .attr("viewBox", "0 0 800 400");

let dateFormat = d3.timeParse("%Y-%m-%d");
let timeScale = d3
  .scaleTime()
  .domain([
    d3.min(taskArray, function(d) {
      return dateFormat(d.startTime);
    }),
    d3.max(taskArray, function(d) {
      return dateFormat(d.endTime);
    })
  ])
  .range([0, 800 - 150]);

export default function drawGantt() {
  let barHeight = 20;
  let gap = barHeight + 4;
  let topPadding = 75;
  let sidePadding = 75;

  let colorScale = d3
    .scaleLinear()
    .domain([0, categories.length])
    .range(["#00B9FA", "#F95002"])
    .interpolate(d3.interpolateHcl);

  makeGrid(sidePadding, topPadding, w, h);
  drawRects(
    taskArray,
    gap,
    topPadding,
    sidePadding,
    barHeight,
    colorScale,
    w,
    h
  );
  vertLabels(gap, topPadding, sidePadding, barHeight, colorScale);
}

function drawRects(
  theArray,
  theGap,
  theTopPad,
  theSidePad,
  theBarHeight,
  theColorScale,
  w,
  h
) {
  let bigRects = svg
    .append("g")
    .selectAll("rect")
    .data(theArray)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d, i) {
      return i * theGap + theTopPad - 2;
    })
    .attr("width", function(d) {
      return w - theSidePad / 2;
    })
    .attr("height", theGap)
    .attr("stroke", "none")
    .attr("fill", function(d) {
      for (let i = 0; i < categories.length; i++) {
        if (d.type == categories[i]) {
          return d3.rgb(theColorScale(i));
        }
      }
    })
    .attr("opacity", 0.2);

  let rectangles = svg
    .append("g")
    .selectAll("rect")
    .data(theArray)
    .enter();

  let innerRects = rectangles
    .append("rect")
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("x", function(d) {
      return timeScale(dateFormat(d.startTime)) + theSidePad;
    })
    .attr("y", function(d, i) {
      return i * theGap + theTopPad;
    })
    .attr("width", function(d) {
      return (
        timeScale(dateFormat(d.endTime)) - timeScale(dateFormat(d.startTime))
      );
    })
    .attr("height", theBarHeight)
    .attr("stroke", "none")
    .attr("fill", function(d) {
      for (let i = 0; i < categories.length; i++) {
        if (d.type == categories[i]) {
          return d3.rgb(theColorScale(i));
        }
      }
    });

  let rectText = rectangles
    .append("text")
    .text(function(d) {
      return d.task;
    })
    .attr("x", function(d) {
      return (
        (timeScale(dateFormat(d.endTime)) -
          timeScale(dateFormat(d.startTime))) /
          2 +
        timeScale(dateFormat(d.startTime)) +
        theSidePad
      );
    })
    .attr("y", function(d, i) {
      return i * theGap + 14 + theTopPad;
    })
    .attr("font-size", 11)
    .attr("text-anchor", "middle")
    .attr("text-height", theBarHeight)
    .attr("fill", "#666");

  // rectText
  //   .on("mouseover", function(e) {
  //     // console.log(this.x.animVal.getItem(this));
  //     let tag = "";

  //     if (d3.select(this).data()[0].details != undefined) {
  //       tag =
  //         "Task: " +
  //         d3.select(this).data()[0].task +
  //         "<br/>" +
  //         "Type: " +
  //         d3.select(this).data()[0].type +
  //         "<br/>" +
  //         "Starts: " +
  //         d3.select(this).data()[0].startTime +
  //         "<br/>" +
  //         "Ends: " +
  //         d3.select(this).data()[0].endTime +
  //         "<br/>" +
  //         "Details: " +
  //         d3.select(this).data()[0].details;
  //     } else {
  //       tag =
  //         "Task: " +
  //         d3.select(this).data()[0].task +
  //         "<br/>" +
  //         "Type: " +
  //         d3.select(this).data()[0].type +
  //         "<br/>" +
  //         "Starts: " +
  //         d3.select(this).data()[0].startTime +
  //         "<br/>" +
  //         "Ends: " +
  //         d3.select(this).data()[0].endTime;
  //     }
  //     let output = document.getElementById("tag");

  //     let x = this.x.animVal.getItem(this) + "px";
  //     let y = this.y.animVal.getItem(this) + 25 + "px";

  //     output.innerHTML = tag;
  //     output.style.top = y;
  //     output.style.left = x;
  //     output.style.display = "block";
  //   })
  //   .on("mouseout", function() {
  //     let output = document.getElementById("tag");
  //     output.style.display = "none";
  //   });

  //   innerRects
  //     .on("mouseover", function(e) {
  //       //console.log(this);
  //       let tag = "";

  //       if (d3.select(this).data()[0].details != undefined) {
  //         tag =
  //           "Task: " +
  //           d3.select(this).data()[0].task +
  //           "<br/>" +
  //           "Type: " +
  //           d3.select(this).data()[0].type +
  //           "<br/>" +
  //           "Starts: " +
  //           d3.select(this).data()[0].startTime +
  //           "<br/>" +
  //           "Ends: " +
  //           d3.select(this).data()[0].endTime +
  //           "<br/>" +
  //           "Details: " +
  //           d3.select(this).data()[0].details;
  //       } else {
  //         tag =
  //           "Task: " +
  //           d3.select(this).data()[0].task +
  //           "<br/>" +
  //           "Type: " +
  //           d3.select(this).data()[0].type +
  //           "<br/>" +
  //           "Starts: " +
  //           d3.select(this).data()[0].startTime +
  //           "<br/>" +
  //           "Ends: " +
  //           d3.select(this).data()[0].endTime;
  //       }
  //       let output = document.getElementById("tag");

  //       let x = this.x.animVal.value + this.width.animVal.value / 2 + "px";
  //       let y = this.y.animVal.value + 25 + "px";

  //       output.innerHTML = tag;
  //       output.style.top = y;
  //       output.style.left = x;
  //       output.style.display = "block";
  //     })
  //     .on("mouseout", function() {
  //       let output = document.getElementById("tag");
  //       output.style.display = "none";
  //     });
}

function makeGrid(theSidePad, theTopPad, w, h) {
  let xAxis = d3
    .axisBottom(timeScale)
    .ticks(d3.timeDay, 1)
    .tickSize(-h + theTopPad + 20, 0, 0)
    .tickFormat(d3.timeFormat("%d"));

  let grid = svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + theSidePad + ", " + (h - 50) + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("fill", "#000")
    .attr("stroke", "none")
    .attr("font-size", 10)
    .attr("dy", "1em");
}

function vertLabels(
  theGap,
  theTopPad,
  theSidePad,
  theBarHeight,
  theColorScale
) {
  let numOccurances = new Array();
  let prevGap = 0;

  for (let i = 0; i < categories.length; i++) {
    numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
  }

  let axisText = svg
    .append("g") //without doing this, impossible to put grid lines behind text
    .selectAll("text")
    .data(numOccurances)
    .enter()
    .append("text")
    .text(function(d) {
      return d[0];
    })
    .attr("x", 10)
    .attr("y", function(d, i) {
      if (i > 0) {
        for (let j = 0; j < i; j++) {
          prevGap += numOccurances[i - 1][1];
          // console.log(prevGap);
          return (d[1] * theGap) / 2 + prevGap * theGap + theTopPad;
        }
      } else {
        return (d[1] * theGap) / 2 + theTopPad;
      }
    })
    .attr("font-size", 11)
    .attr("text-anchor", "start")
    .attr("text-height", 14)
    .attr("fill", function(d) {
      for (let i = 0; i < categories.length; i++) {
        if (d[0] == categories[i]) {
          //  console.log("true!");
          return d3.rgb(theColorScale(i)).darker();
        }
      }
    });
}

//from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
function getCounts(arr) {
  let i = arr.length, // let to loop over
    obj = {}; // obj to store results
  while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
  return obj;
}

// get specific from everything
function getCount(word, arr) {
  return getCounts(arr)[word] || 0;
}
