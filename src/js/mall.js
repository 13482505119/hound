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
                        setSWControl();
                    }, 3000);
                },
                pullUpAction: function () {
                    setTimeout(function () {
                        //todo load next page

                        myIScroll.refresh();
                        setSWControl();
                    }, 3000);
                }
            });
        }

        //商品图片轮播
        var swGoods = {
                loop: true,
                pagination: '.swiper-pagination'
            },
            swControl = {
                slidesPerView: 'auto',
                resistanceRatio: .00000000000001,
                slideToClickedSlide: true
            };
        if ($(".swiper-wrapper", ".swiper-goods").children().length > 1) {
            new Swiper ('.swiper-goods', swGoods);
        }
        function setSWControl() {
            if ($(".swiper-control").length > 1) {
                new Swiper('.swiper-control', swControl);
            }
        }
        setSWControl();

        //收藏及取消收藏
        $(".btn-favorite").click(function () {
            //todo favorite

        });

        //商品数量
        $(".input-group-quantity").on("click", ".input-group-addon", function () {
            var $this = $(this),
                $quantity = $this.parent().find("input"),
                $total = $($quantity.data("total")),
                $count = $($quantity.data("count")),
                quantity = parseInt($quantity.val()),
                price = parseFloat($quantity.data("price")),
                min = $quantity.attr("min"),
                max = $quantity.attr("max"),
                total,
                dotIndex;

            if ($this.index() == 0) {
                quantity = quantity > min ? --quantity : min;
                $quantity.val(quantity);
            } else {
                quantity = quantity < max ? ++quantity : max;
                $quantity.val(quantity);
            }

            total = (price * quantity).toFixed(2).toString();
            dotIndex = total.indexOf(".");

            $count.html(quantity);
            $total.html('<span class="text-big">' + total.substr(0, dotIndex) + '.</span>' + total.substr(dotIndex + 1));
        });

    });
});
