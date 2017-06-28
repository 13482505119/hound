({
    appDir: "../",
    baseUrl: "js",
    dir: "../../public",
    modules: [
        {name: "hound"},
        {name: "docs"},
        {name: "mall"}
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
        "cookie": "plugins/cookie/jquery.cookie"
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
        "bootstrap/bootstrap-affix": {
            deps: ["jquery"],
            exports: "$.fn.affix"
        },
        "bootstrap/bootstrap-alert": {
            deps: ["jquery"],
            exports: "$.fn.alert"
        },
        "bootstrap/bootstrap-button": {
            deps: ["jquery"],
            exports: "$.fn.button"
        },
        "bootstrap/bootstrap-carousel": {
            deps: ["jquery"],
            exports: "$.fn.carousel"
        },
        "bootstrap/bootstrap-collapse": {
            deps: ["jquery"],
            exports: "$.fn.collapse"
        },
        "bootstrap/bootstrap-dropdown": {
            deps: ["jquery"],
            exports: "$.fn.dropdown"
        },
        "bootstrap/bootstrap-modal": {
            deps: ["jquery"],
            exports: "$.fn.modal"
        },
        "bootstrap/bootstrap-popover": {
            deps: ["jquery"],
            exports: "$.fn.popover"
        },
        "bootstrap/bootstrap-scrollspy": {
            deps: ["jquery"],
            exports: "$.fn.scrollspy"
        },
        "bootstrap/bootstrap-tab": {
            deps: ["jquery"],
            exports: "$.fn.tab"
        },
        "bootstrap/bootstrap-tooltip": {
            deps: ["jquery"],
            exports: "$.fn.tooltip"
        },
        "bootstrap/bootstrap-transition": {
            deps: ["jquery"],
            exports: "$.support.transition"
        }
    }
})