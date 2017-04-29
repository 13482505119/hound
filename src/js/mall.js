/**
 * Muse mall module
 *
 */

require(["hound", "pullLoad"], function(hound, pullLoad) {
    //document.ready
    $(function () {
        //IScroll
        if ($("#wrapper").length == 1) {
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
        }

        //商品图片轮播
        if ($(".swiper-wrapper", ".swiper-goods").children().length > 1) {
            new Swiper ('.swiper-goods', {
                loop: true,
                pagination: '.swiper-pagination'
            });
        }

        //收藏及取消收藏
        $(".btn-favorite").click(function () {

        });

    });
});
