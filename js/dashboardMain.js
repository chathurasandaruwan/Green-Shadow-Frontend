// ----------navbar-active-animation home page-----------
function test() {
    var tabsNewAnim = $("#navbarSupportedContent");
    var selectorNewAnim = $("#navbarSupportedContent").find("li").length;
    var activeItemNewAnim = tabsNewAnim.find(".active");
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
        top: itemPosNewAnimTop.top + "px",
        left: itemPosNewAnimLeft.left + "px",
        height: activeWidthNewAnimHeight + "px",
        width: activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click", "li", function (e) {
        $("#navbarSupportedContent ul li").removeClass("active");
        $(this).addClass("active");
        var activeWidthNewAnimHeight = $(this).innerHeight();
        var activeWidthNewAnimWidth = $(this).innerWidth();
        var itemPosNewAnimTop = $(this).position();
        var itemPosNewAnimLeft = $(this).position();
        $(".hori-selector").css({
            top: itemPosNewAnimTop.top + "px",
            left: itemPosNewAnimLeft.left + "px",
            height: activeWidthNewAnimHeight + "px",
            width: activeWidthNewAnimWidth + "px"
        });
    });
}
$(document).ready(function () {
    setTimeout(function () {
        test();
    });
});
$(window).on("resize", function () {
    setTimeout(function () {
        test();
    }, 500);
});
$(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function () {
        test();
    });
});

$(document).ready(function ($) {
    // Get the current path of the URL
    var path = window.location.pathname.split("/").pop();

    // If the path is empty (home page), default to 'index.html'
    if (path === "") {
        path = "index.html";
    }

    // Find the target link using the href attribute
    var target = $('#navbarSupportedContent ul li a').filter(function () {
        return $(this).attr('href') === path;
    });

    // Remove "active" class from all links and add to the target link
    $('#navbarSupportedContent ul li').removeClass("active");
    target.parent().addClass("active");
});


// Load the data to bar chart
// Set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    viewboxWidth = 960,
    viewboxHeight = 500,
    width = viewboxWidth - margin.left - margin.right,
    height = viewboxHeight - margin.top - margin.bottom;

// Set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 100]);

// Append the SVG object using jQuery
var $chart = $("#chart");
$chart.empty(); // Clear existing content
var svg = d3.select($chart[0]).append("svg")
    .attr("preserveAspectRatio", "none")
    .attr("viewBox", "0 0 " + viewboxWidth + " " + viewboxHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [
    { label: 'crop', value: 0, color: '#689f38' },
    { label: 'field', value: 0, color: '#f50057' },
    { label: 'staff', value: 0, color: '#9c27b0' },
    { label: 'vehicle', value: 0, color: '#ffc107' },
    { label: 'log', value: 0, color: '#009688' },
    { label: 'Equipment', value: 0, color: '#ffc107' },
];

var newData = function (data) {
    var customValues = [10, 12, 34, 56, 109,40]; // Define the custom values
    return data.map(function (d, i) {
        d.oldValue = d.value;
        d.value = customValues[i % customValues.length]; // Assign values cyclically if data length exceeds customValues length
        return d;
    });
};
var init = function (data) {
    x.domain(data.map(function (d) { return d.label; }));
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

    var bars = svg.selectAll(".bar")
        .data(data);

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function (d) { return d.color; })
        .attr("x", function (d) { return x(d.label); })
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", "0")
        .exit()
        .remove();

    var labels = svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("fill", function (d) { return d.color; })
        .text(function (d) { return d.label; })
        .attr("x", function (d) { return x(d.label) + (x.bandwidth() / 2); })
        .attr("y", height - 10)
        .attr('textLength', x.bandwidth() - 10)
        .attr('lengthAdjust', 'spacingAndGlyphs')
        .exit()
        .remove();

    var amounts = svg.selectAll(".amount")
        .data(data)
        .enter()
        .append("text")
        .text(0)
        .attr("class", "amount")
        .attr("fill", function (d) { return d.color; })
        .attr("x", function (d) { return x(d.label) + (x.bandwidth() / 2); })
        .attr('y', height - 66)
        .exit()
        .remove();

    drawChart(data);
};

var drawChart = function (data) {
    x.domain(data.map(function (d) { return d.label; }));
    y.domain([0, d3.max(data, function (d) { return d.value; })]);

    var bars = svg.selectAll(".bar")
        .data(data);

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function (d) { return d.color; });

    bars.exit()
        .transition()
        .duration(300)
        .ease(d3.easeExp)
        .attr("height", 0)
        .remove();

    bars.transition()
        .duration(1000)
        .ease(d3.easeQuad)
        .attr("x", function (d) { return x(d.label); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.value); })
        .attr("height", function (d) { return height - y(d.value); });

    var labels = svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("fill", function (d) { return d.color; })
        .text(function (d) { return d.label; })
        .attr("x", function (d) { return x(d.label) + (x.bandwidth() / 2); })
        .attr("y", height - 10)
        .attr('textLength', x.bandwidth() - 10)
        .attr('lengthAdjust', 'spacingAndGlyphs')
        .exit()
        .remove();

    var amounts = svg.selectAll(".amount")
        .data(data);

    amounts.enter()
        .append("text")
        .attr("class", "amount");

    amounts.exit()
        .transition()
        .duration(1000)
        .ease(d3.easeExp)
        .attr("y", 0)
        .remove();

    var format = d3.format(",d");
    amounts.transition()
        .duration(1000)
        .ease(d3.easeQuad)
        .tween("text", function (d) {
            var that = d3.select(this),
                i = d3.interpolateNumber(d.oldValue, d.value);
            return function (t) { that.text(format(i(t))); };
        })
        .attr("fill", function (d) { return d.color; })
        .attr("x", function (d) { return x(d.label) + (x.bandwidth() / 2); })
        .attr("y", function (d) { return y(d.value) - 5; });
};
init(newData(data));
drawChart(newData(data));