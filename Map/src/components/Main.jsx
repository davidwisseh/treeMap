import * as d3 from "d3";
import React from "react";
const Main = ({ current, first }) => {
  const m = document.querySelector(".container");
  if (m && !first) {
    m.innerHTML = "";
  }

  const tooltip = d3
    .select(".container")
    .append("div")
    .attr("id", "tooltip")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .style("background", "green")
    .style("opacity", "0.7")
    .style("position", "absolute");

  const tName = tooltip.append("p");
  const tCategory = tooltip.append("p");
  const tValue = tooltip.append("p");

  const { name, children } = current;
  const rn = name.split(" ").slice(0, 2).join(" ");
  const getdesc = (rn) => {
    switch (rn) {
      case "Video Game":
        return "Top 100 Most Sold Video Games Grouped by Platform";
      case "Movies":
        return "Top 100 Highest Grossing Movies Grouped By Genre";
      case "Kickstarter":
        return "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category";
    }
  };
  const getTitle = () => {
    if (rn === "Movies") {
      return "Movie";
    }
    return rn;
  };
  const title = getTitle();
  const desc = getdesc(rn);
  d3.select(".container")
    .append("h1")
    .attr("class", "text-5xl font-bold")
    .attr("id", "title")
    .text(`${title} sales`);
  d3.select(".container")
    .append("h1")
    .attr("class", "")
    .attr("id", "description")
    .text(`${desc} sales`);

  const width = 960;
  const height = 600;
  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin", "auto");

  const heir = d3
    .treemap()
    .tile(d3.treemapSquarify) // e.g., d3.treemapSquarify
    .size([width, height])
    .padding(1)
    .round(true)(
    d3
      .hierarchy(current)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );
  const color = d3.scaleOrdinal(
    current.children.map((d) => d.name),
    d3.schemeTableau10
  );
  const legend = d3
    .select(".container")
    .append("svg")
    .attr("id", "legend")
    .attr("width", width / 2)
    .attr("height", height / 2)
    .style("margin", "auto")
    .style("font-size", "12px");

  const lx = d3.scaleLinear().domain([0, 2]).range([0, 380]);
  let x = 0;
  let y = 0;
  const ly = d3
    .scaleLinear()
    .domain([0, current.children.length / 3])
    .range([50, 200]);
  const getX = () => {
    let ans = lx(x);
    if (x > 0) {
      ans -= 30;
    }

    if (x == 2) {
      x = 0;
    } else {
      x++;
    }

    return ans;
  };
  let count = 0;
  const getY = () => {
    const ans = ly(y);
    if (count == 2) {
      y++;
      count = 0;
    } else {
      count++;
    }
    return ans;
  };
  const groups = legend
    .selectAll("g")
    .data(current.children)
    .enter()
    .append("g")
    .attr("transform", (_, i) => `translate(${getX()}, ${getY()})`)
    .style("display", "flex")
    .style("align-items", "center");
  groups
    .append("rect")
    .style("fill", (d) => `${color(d.name)}`)
    .attr("width", 20)
    .attr("y", -15)
    .attr("height", 20)
    .attr("class", "legend-item");

  groups
    .append("text")
    .text((d) => d.name)
    .attr("x", 25);

  const leaf = svg
    .selectAll("g")
    .data(heir.leaves())
    .join("g")
    .attr("transform", (d) => `translate(${d.x0},${d.y0})`)
    .style("font-size", "8px");

  leaf
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => `${d.data.name}`)
    .attr("data-category", (d) => `${d.parent.data.name}`)
    .attr("data-value", (d) => `${d.data.value}`)
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  leaf
    .append("text")
    .attr("clip-path", (d) => d.clipUid)
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
    .attr("x", 3)
    .attr(
      "y",
      (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
    )
    .attr("fill-opacity", (d, i, nodes) =>
      i === nodes.length - 1 ? 0.7 : null
    )
    .text((d) => d);
  svg
    .on("mousemove", (e) => {
      tooltip
        .style("visibility", "visible")
        .style("top", `${e.layerY - 40}px`)
        .style("left", `${e.layerX + 10}px`);
    })
    .on("mouseleave", () => {
      tooltip.style("visibility", "hidden");
    });
  svg.selectAll("rect").on("mouseover", (e) => {
    const { name, category, value } = e.target.__data__.data;
    tooltip.attr("data-value", value);

    tName.text(`Name: ${name}`);
    tCategory.text(`Category: ${category}`);
    tValue.text(`Value: ${value}`);
  });

  return (
    <div
      className="container text-center"
      style={{ margin: "75px auto 0 auto" }}
    ></div>
  );
};

export default Main;
