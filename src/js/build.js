({
    appDir: "../",
    baseUrl: "js",
    dir: "../../public",
    modules: [
        {name: "hound"},
        {name: "docs"}
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimize: "uglify2",
    optimizeCss: "standard",
    removeCombined: true,
    paths: {
        "jquery": "jquery-3.2.1.min",
        "bootstrap": "bootstrap.min",
        "form": "plugins/form/jquery.form.min",
        "validate": "plugins/validate/jquery.validate.min",
        "dropload": "plugins/dropload/dropload.min",
        "lazyload": "plugins/lazyload/jquery.lazyload.min"
    },
    shim:{
        "bootstrap": {
            deps: ["jquery"],
            exports: "jquery"
        },
        "form": {
            deps: ["jquery"],
            exports: "jquery"
        },
        "validate": {
            deps: ["jquery"],
            exports: "jquery"
        },
        "dropload":{
            deps: ["jquery"],
            exports: "jquery"
        },
        "lazyload":{
            deps: ["jquery"],
            exports: "jquery"
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