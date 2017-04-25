/**
 * base module
 *
 */

require(["hound", "plugins/iscroll/pullLoad"], function(hound, pullLoad) {
    //document.ready
    $(function () {

        var me = pullLoad(".goods-waterfall", {});
        console.log(hound);
    });
});
