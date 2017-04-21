/**
 * base module
 *
 */

require(["hound"], function() {
    //document.ready
    $(function () {

        //common header
        $("#header").load("header.html", function () {
            $(".navbar-nav").find('a[href="'  + location.pathname.substr(location.pathname.lastIndexOf("/") + 1) +  '"]').parent().addClass("active");
        });

        //common footer
        $("#footer").load("footer.html");

        //$.hound.loading();

    });
});
