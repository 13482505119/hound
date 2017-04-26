/**
 * base module
 *
 */

require(["hound", "plugins/iscroll/pullLoad"], function(hound, pullLoad) {
    //document.ready
    $(function () {

        var myIScroll = pullLoad("#wrapper", {
            pullDownAction: function () {
                setTimeout(function () {
                    myIScroll.refresh();
                }, 3000);
            },
            pullUpAction: function () {
                setTimeout(function () {
                    myIScroll.refresh();
                }, 3000);
            }
        });

        console.log(myIScroll);

    });
});
