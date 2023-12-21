export default function drawCalendar(dateData, type) {
  let weeksInMonth = function (month) {
    let m = d3.timeMonth.floor(month);
    return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m, 1)).length;
  };

  let minDate = d3.min(dateData, (d) => {
    return new Date(d.day);
  });
  let maxDate = d3.max(dateData, (d) => {
    return new Date(d.day);
  });

  let cellMargin = 2,
    cellSize = 20;

  let day = d3.timeFormat("%w"),
    week = d3.timeFormat("%U"),
    format = d3.timeFormat("%m-%d-%Y"),
    titleFormat = d3.utcFormat("%a, %d-%b"),
    monthName = d3.timeFormat("%B"),
    months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

  let svg = d3
    .select(`#calendar-${type}`)
    .selectAll("svg")
    .data(months)
    .enter()
    .append("svg")
    .attr("class", "month")
    .attr("height", cellSize * 7 + cellMargin * 8 + 20) // the 20 is for the month labels
    .attr("width", function (d) {
      let columns = weeksInMonth(d);
      return cellSize * columns + cellMargin * (columns + 1);
    })
    .append("g");

  svg
    .append("text")
    .attr("class", "month-name")
    .attr("y", cellSize * 7 + cellMargin * 8 + 15)
    .attr("x", function (d) {
      let columns = weeksInMonth(d);
      return (cellSize * columns + cellMargin * (columns + 1)) / 2;
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
      return monthName(d);
    });

  let rect = svg
    .selectAll("rect.day")
    .data(function (d, i) {
      return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth() + 1, 1));
    })
    .enter()
    .append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 3)
    .attr("ry", 3) // rounded corners
    .attr("fill", "#eaeaea") // default light grey fill
    .attr("y", function (d) {
      return day(d) * cellSize + day(d) * cellMargin + cellMargin;
    })
    .attr("x", function (d) {
      return (
        (week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) *
          cellSize +
        (week(d) - week(new Date(d.getFullYear(), d.getMonth(), 1))) *
          cellMargin +
        cellMargin
      );
    })
    .on("mouseover", function (d) {
      d3.select(this).classed("hover", true);
    })
    .on("mouseout", function (d) {
      d3.select(this).classed("hover", false);
    })
    .datum(format);

  rect.append("title").text(function (d) {
    return titleFormat(new Date(d));
  });

  let lookup = d3
    .nest()
    .key(function (d) {
      return d.day;
    })
    .rollup(function (leaves) {
      return d3.sum(leaves, function (d) {
        return parseInt(d.count);
      });
    })
    .object(dateData);

  let scale = d3
    .scaleLinear()
    .domain(
      d3.extent(dateData, function (d) {
        return parseInt(d.count);
      })
    )
    .range([0.1, 1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

  rect
    .filter(function (d) {
      return d in lookup;
    })
    .style("fill", (d) => {
      return type === "wipe" ||
        type === "tea" ||
        type === "ucob" ||
        type === "dru" ||
        type === "top"
        ? d3.interpolateReds(scale(lookup[d]))
        : d3.interpolateBlues(scale(lookup[d]));
    })
    .select("title")
    .text(function (d) {
      return titleFormat(new Date(d)) + ":  " + lookup[d];
    });
}
