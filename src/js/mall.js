/**
 * Muse mall module
 *
 */

require(["hound", "pullLoad"], function(hound, pullLoad) {
    //document.ready
    $(function () {

        var myIScroll = pullLoad("#wrapper", {
            pullDownAction: function () {
                setTimeout(function () {
                    //todo refresh page

                    myIScroll.refresh();
                }, 3000);
            },
            pullUpAction: function () {
                setTimeout(function () {
                    //todo load next page

                    myIScroll.refresh();
                }, 3000);
            }
        });

        console.log(myIScroll);

    });
});
