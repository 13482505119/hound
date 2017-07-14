/**
 * Created by LiuSong on 2017/7/13.
 */

require.config({
    paths: {
        "jquery": "jquery-3.2.1.min",
        "bootstrap": "bootstrap.min",
        "metisMenu": "plugins/metismenu/metisMenu.min"
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"
        },
        "metisMenu": {
            deps: ["jquery"],
            exports: "$"
        }
    }
});

require(["hound", "bootstrap", "metisMenu"], function(hound) {
    //MetsiMenu
    $('.metismenu').metisMenu();

    $("thead :checkbox, tfoot :checkbox").on("click", function () {
        $(this).closest("table").find(":checkbox").prop("checked", $(this).prop("checked"));
    });
});
