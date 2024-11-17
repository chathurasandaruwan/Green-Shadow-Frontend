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