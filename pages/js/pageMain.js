// ---------navbar-active-animation-pages-----------
function updateHoriSelector() {
    var tabsNewAnim = $("#navbarSupportedContent");
    var activeItem = tabsNewAnim.find(".active");
    if (activeItem.length) {
        var activeWidth = activeItem.innerWidth();
        var activeHeight = activeItem.innerHeight();
        var itemPos = activeItem.position();
        $(".hori-selector").css({
            top: itemPos.top + "px",
            left: itemPos.left + "px",
            height: activeHeight + "px",
            width: activeWidth + "px",
        });
    }
}

function test() {
    updateHoriSelector();
    $("#navbarSupportedContent").on("click", "li", function () {
        $("#navbarSupportedContent ul li").removeClass("active");
        $(this).addClass("active");
        updateHoriSelector();
    });
}

$(document).ready(function () {
    test();
});

$(window).on("resize", function () {
    updateHoriSelector();
});

$(".navbar-toggler").click(function () {
    $(".navbar-collapse").slideToggle(300);
    updateHoriSelector();
});

$(window).on("load", function () {
    var current = location.pathname.split("/").pop().toLowerCase();
    if (current === "") current = "index.html";
    $("#navbarSupportedContent ul li a").each(function () {
        var $this = $(this);
        if ($this.attr("href").toLowerCase() === current) {
            $this.parent().addClass("active");
        } else {
            $this.parent().removeClass("active");
        }
    });
    updateHoriSelector();
});