({
    appDir: "../",
    baseUrl: "js",
    dir: "../../public",
    modules: [
        {name: "hound"},
        {name: "docs"},
        {name: "mall"},
        {name: "admin"}
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimize: "uglify2",
    optimizeCss: "standard",
    removeCombined: true,
    paths: {
        "jquery": "jquery-3.2.1.min",
        "bootstrap": "bootstrap.min",
        "swiper": "plugins/swiper/swiper.min",
        "sweetAlert": "plugins/sweetalert2/sweetalert2.min",
        "form": "plugins/form/jquery.form.min",
        "validate": "plugins/validate/jquery.validate.min",
        "dropload": "plugins/dropload/dropload.min",
        "lazyload": "plugins/lazyload/jquery.lazyload.min",
        "cookie": "plugins/cookie/jquery.cookie",
        "metisMenu": "plugins/metismenu/metisMenu.min"
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "$"
        },
        "swiper": {
            deps: ["jquery"],
            exports: "Swiper"
        },
        "form": {
            deps: ["jquery"],
            exports: "$"
        },
        "validate": {
            deps: ["jquery"],
            exports: "$"
        },
        "dropload": {
            deps: ["jquery"],
            exports: "$"
        },
        "lazyload": {
            deps: ["jquery"],
            exports: "$"
        },
        "cookie": {
            deps: ["jquery"],
            exports: "$"
        },
        "metisMenu": {
            deps: ["jquery"],
            exports: "$"
        }
    }
})