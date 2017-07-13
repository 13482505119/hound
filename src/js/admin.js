/**
 * Created by LiuSong on 2017/7/13.
 */

require.config({
    paths: {
        "jquery": "jquery-3.2.1.min",
        "Bootstrap": "bootstrap.min",
        "metisMenu": "plugins/metismenu/metisMenu.min"
    },
    shim:{
        "Bootstrap": {
            deps: ["jquery"],
            exports: "$"
        },
        "metisMenu": {
            deps: ["jquery"],
            exports: "$"
        }
    }
});

require(["hound", "Bootstrap", "metisMenu"], function(hound) {
    //MetsiMenu
    $('.metismenu').metisMenu();
});
